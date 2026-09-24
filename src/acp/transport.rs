//! Spawning an ACP agent and turning its stdio into the SDK's `Lines`
//! transport, with every JSON-RPC line copied to a tap (the raw log).
//!
//! We spawn ourselves rather than use the SDK's `AcpAgent`: it can't set a
//! working directory, and we want our own `PATH`, process group and log.

use std::collections::VecDeque;
use std::path::Path;
use std::process::Stdio;
use std::sync::Arc;

use agent_client_protocol::Lines;
use futures::{Sink, Stream, StreamExt};
use parking_lot::Mutex;
use serde::{Deserialize, Serialize};
use tokio::io::{AsyncBufReadExt, AsyncWriteExt, BufReader};
use tokio::process::{Child, Command};

use crate::agents::{env, AgentSpec};

/// Direction of a raw line, from Splash's point of view.
#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize, specta::Type)]
#[serde(rename_all = "snake_case")]
pub enum Dir {
    Out,
    In,
}

pub type Tap = Arc<dyn Fn(Dir, &str) + Send + Sync>;

/// The agent process. Killing happens through the process group, so helper
/// processes the adapter starts (the vendor CLI under `npx`) go too.
pub struct AgentProcess {
    pub pgid: i32,
    /// Taken by whoever waits on the exit (killing goes through the group).
    pub child: Option<Child>,
    /// The last ~40 lines of stderr, for error messages when the agent dies.
    pub stderr: Arc<Mutex<VecDeque<String>>>,
}

impl AgentProcess {
    pub fn kill(&self) {
        crate::procs::kill_group(self.pgid);
    }

    pub fn stderr_tail(&self) -> String {
        self.stderr
            .lock()
            .iter()
            .cloned()
            .collect::<Vec<_>>()
            .join("\n")
    }
}

pub type Transport = Lines<
    std::pin::Pin<Box<dyn Sink<String, Error = std::io::Error> + Send>>,
    std::pin::Pin<Box<dyn Stream<Item = std::io::Result<String>> + Send>>,
>;

/// Start `spec`'s ACP server in `cwd`. `extra` goes before the spec's own
/// args — global options such as `glue -m <model> acp`.
pub fn spawn(
    spec: &AgentSpec,
    cwd: &Path,
    extra: &[String],
    tap: Tap,
) -> std::io::Result<(Transport, AgentProcess)> {
    let program = env::which(spec.program).ok_or_else(|| {
        std::io::Error::new(
            std::io::ErrorKind::NotFound,
            format!("`{}` not found on PATH", spec.program),
        )
    })?;
    let mut cmd = Command::new(program);
    cmd.args(extra)
        .args(spec.args)
        .current_dir(cwd)
        .env("PATH", env::path())
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .process_group(0)
        .kill_on_drop(true);
    let mut child = cmd.spawn()?;
    let pgid = child.id().map(|p| p as i32).unwrap_or(0);
    if pgid > 0 {
        crate::procs::register(pgid);
    }

    let stdin = child.stdin.take().expect("piped stdin");
    let stdout = child.stdout.take().expect("piped stdout");
    let stderr = child.stderr.take().expect("piped stderr");

    let tail = Arc::new(Mutex::new(VecDeque::with_capacity(40)));
    {
        let tail = tail.clone();
        tokio::spawn(async move {
            let mut lines = BufReader::new(stderr).lines();
            while let Ok(Some(line)) = lines.next_line().await {
                let mut t = tail.lock();
                if t.len() == 40 {
                    t.pop_front();
                }
                t.push_back(line);
            }
        });
    }

    let out_tap = tap.clone();
    let outgoing = futures::sink::unfold(stdin, move |mut stdin, line: String| {
        let tap = out_tap.clone();
        async move {
            tap(Dir::Out, &line);
            stdin.write_all(line.as_bytes()).await?;
            stdin.write_all(b"\n").await?;
            stdin.flush().await?;
            Ok::<_, std::io::Error>(stdin)
        }
    });
    let incoming = tokio_stream::wrappers::LinesStream::new(BufReader::new(stdout).lines())
        // Some agents print a banner or blank lines to stdout; the SDK would
        // treat them as malformed JSON-RPC. Keep only lines that look like JSON.
        .filter(|line| {
            let keep = match line {
                Ok(l) => l.trim_start().starts_with('{') || l.trim_start().starts_with('['),
                Err(_) => true,
            };
            futures::future::ready(keep)
        })
        .inspect(move |line| {
            if let Ok(line) = line {
                tap(Dir::In, line);
            }
        });

    let transport = Lines::new(
        Box::pin(outgoing) as std::pin::Pin<Box<dyn Sink<String, Error = std::io::Error> + Send>>,
        Box::pin(incoming) as std::pin::Pin<Box<dyn Stream<Item = std::io::Result<String>> + Send>>,
    );
    Ok((
        transport,
        AgentProcess {
            pgid,
            child: Some(child),
            stderr: tail,
        },
    ))
}
