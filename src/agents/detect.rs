//! Is each agent installed, which version, is the user logged in — all
//! without starting a session.

use std::time::Duration;

use serde::{Deserialize, Serialize};
use tokio::process::Command;

use super::env;
use super::probe::AgentProbe;
use super::registry::{AgentSpec, AuthCheck, Transport, AGENTS};

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, specta::Type)]
#[serde(rename_all = "snake_case")]
pub enum Auth {
    Ok,
    LoggedOut,
    Unknown,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, specta::Type)]
pub struct AgentStatus {
    pub id: String,
    pub name: String,
    pub transport: Transport,
    pub experimental: bool,
    /// The full ACP launch command, for display.
    pub launch: String,
    pub installed: bool,
    pub cli_path: Option<String>,
    pub version: Option<String>,
    pub auth: Auth,
    pub auth_detail: Option<String>,
    /// For adapters: whether `npx` is available to run them.
    pub runner_ok: bool,
    pub probe: Option<AgentProbe>,
    pub extra_args: String,
}

impl AgentStatus {
    /// Installed, logged in (or unknowable), and its launcher exists.
    pub fn ready(&self) -> bool {
        self.installed && self.runner_ok && self.auth != Auth::LoggedOut
    }
}

pub async fn detect_all() -> Vec<AgentStatus> {
    futures::future::join_all(AGENTS.iter().map(detect)).await
}

pub async fn detect(spec: &AgentSpec) -> AgentStatus {
    let cli_path = env::which(spec.cli);
    let installed = cli_path.is_some();
    let runner_ok = env::which(spec.program).is_some();
    let (version, (auth, auth_detail)) = if installed {
        tokio::join!(version(spec), auth(spec))
    } else {
        (None, (Auth::Unknown, None))
    };
    AgentStatus {
        id: spec.id.into(),
        name: spec.name.into(),
        transport: spec.transport,
        experimental: spec.experimental,
        launch: std::iter::once(spec.program)
            .chain(spec.args.iter().copied())
            .collect::<Vec<_>>()
            .join(" "),
        installed,
        cli_path: cli_path.map(|p| p.display().to_string()),
        version,
        auth,
        auth_detail,
        runner_ok,
        probe: None,
        extra_args: String::new(),
    }
}

async fn run(args: &[&str]) -> Option<(bool, String)> {
    let (program, rest) = args.split_first()?;
    let program = env::which(program)?;
    let out = tokio::time::timeout(
        Duration::from_secs(10),
        Command::new(program)
            .args(rest)
            .env("PATH", env::path())
            .env("NO_COLOR", "1")
            .stdin(std::process::Stdio::null())
            .kill_on_drop(true)
            .output(),
    )
    .await
    .ok()?
    .ok()?;
    let mut text = String::from_utf8_lossy(&out.stdout).into_owned();
    text.push_str(&String::from_utf8_lossy(&out.stderr));
    Some((out.status.success(), strip_ansi(&text)))
}

async fn version(spec: &AgentSpec) -> Option<String> {
    let (_, text) = run(&[spec.cli, "--version"]).await?;
    let line = text.lines().map(str::trim).find(|l| !l.is_empty())?;
    // "glue v0.9.0 (f59a9ff…)", "codex-cli 0.156.1", "2.1.281 (Claude Code)" → the version-looking token.
    let token = line
        .split_whitespace()
        .map(|t| {
            t.trim_start_matches('v')
                .trim_matches(|c| c == '(' || c == ')' || c == ',' || c == '.')
        })
        .find(|t| t.chars().next().is_some_and(|c| c.is_ascii_digit()) && t.contains('.'));
    Some(token.unwrap_or(line).to_string())
}

async fn auth(spec: &AgentSpec) -> (Auth, Option<String>) {
    match spec.auth {
        AuthCheck::File(rel) => {
            let home = std::env::var("HOME").unwrap_or_default();
            if std::path::Path::new(&home).join(rel).exists() {
                (Auth::Ok, None)
            } else {
                (
                    Auth::LoggedOut,
                    Some(format!("~/{rel} not found. Run `{} login`.", spec.cli)),
                )
            }
        }
        AuthCheck::None => (Auth::Unknown, None),
        AuthCheck::Command(args) => match run(args).await {
            Some((ok, text)) => {
                // `claude auth status` prints JSON with `loggedIn`.
                if let Ok(v) = serde_json::from_str::<serde_json::Value>(text.trim()) {
                    let logged_in = v["loggedIn"].as_bool().unwrap_or(ok);
                    let how = v["authMethod"]
                        .as_str()
                        .map(|m| format!("via {}", m.replace('_', " ")));
                    return (if logged_in { Auth::Ok } else { Auth::LoggedOut }, how);
                }
                (
                    if ok { Auth::Ok } else { Auth::LoggedOut },
                    status_line(&text),
                )
            }
            None => (Auth::Unknown, Some("auth check timed out".into())),
        },
    }
}

/// The line that says something about login state, if any.
fn status_line(text: &str) -> Option<String> {
    let lines: Vec<&str> = text
        .lines()
        .map(str::trim)
        .filter(|l| !l.is_empty())
        .collect();
    let wanted = |l: &&&str| {
        let l = l.to_lowercase();
        l.contains("logged")
            || l.contains("signed")
            || l.contains("not authenticated")
            || (l.contains(" ok") && l.contains("error"))
    };
    lines
        .iter()
        .find(wanted)
        .map(|l| l.chars().take(160).collect())
}

fn strip_ansi(s: &str) -> String {
    let mut out = String::with_capacity(s.len());
    let mut chars = s.chars().peekable();
    while let Some(c) = chars.next() {
        if c == '\x1b' {
            if chars.peek() == Some(&'[') {
                chars.next();
                for c in chars.by_ref() {
                    if c.is_ascii_alphabetic() {
                        break;
                    }
                }
            }
        } else {
            out.push(c);
        }
    }
    out
}
