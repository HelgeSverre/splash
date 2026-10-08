//! Child processes: short-lived commands run with a deadline, and every
//! process group Splash starts, tracked so none outlive it.
//!
//! Elyra leaves its event loop with `process::exit`, so destructors (and
//! tokio's `kill_on_drop`) never run on quit. `exit` does run `atexit`
//! handlers, so the registry kills whatever is left from one.

use std::io::Read;
use std::process::{Command, Output, Stdio};
use std::time::{Duration, Instant};

#[cfg(unix)]
mod unix;
#[cfg(windows)]
mod windows;
#[cfg(unix)]
pub use unix::*;
#[cfg(windows)]
pub use windows::*;

type Hook = Box<dyn Fn() + Send>;
static SHUTDOWN_HOOKS: parking_lot::Mutex<Vec<Hook>> = parking_lot::Mutex::new(Vec::new());

/// Run `hook` when Splash starts to exit, before it stops the agents. Only on
/// Unix: on Windows the agents end with Splash's process, so nothing runs in
/// between.
pub fn on_shutdown(hook: impl Fn() + Send + 'static) {
    SHUTDOWN_HOOKS.lock().push(Box::new(hook));
}

#[cfg(unix)]
fn run_shutdown_hooks() {
    // Don't block during exit; if the lock is held, skip rather than hang.
    if let Some(hooks) = SHUTDOWN_HOOKS.try_lock() {
        for hook in hooks.iter() {
            hook();
        }
    }
}

/// Run `cmd` (stdin closed, stdout captured, stderr dropped), killing it if
/// it isn't done within `timeout`. `None` when it can't start or times out.
pub fn run_with_timeout(cmd: &mut Command, timeout: Duration) -> Option<Output> {
    #[cfg(unix)]
    {
        use std::os::unix::process::CommandExt;
        cmd.process_group(0);
    }
    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        cmd.creation_flags(windows_sys::Win32::System::Threading::CREATE_SUSPENDED);
    }
    let mut child = cmd
        .stdin(Stdio::null())
        .stdout(Stdio::piped())
        .stderr(Stdio::null())
        .spawn()
        .ok()?;
    let pid = child.id() as i32;
    let tree = match ProcessTree::new(pid) {
        Ok(tree) => tree,
        Err(_) => {
            let _ = child.kill();
            let _ = child.wait();
            return None;
        }
    };
    // Drain stdout alongside, so a chatty child can't block on a full pipe.
    let mut out = child.stdout.take()?;
    let reader = std::thread::spawn(move || {
        let mut buf = Vec::new();
        let _ = out.read_to_end(&mut buf);
        buf
    });
    let deadline = Instant::now() + timeout;
    let status = loop {
        match child.try_wait() {
            Ok(Some(status)) => break status,
            Ok(None) if Instant::now() < deadline => std::thread::sleep(Duration::from_millis(20)),
            _ => {
                tree.kill();
                let _ = child.kill();
                let _ = child.wait();
                return None;
            }
        }
    };
    tree.kill();
    Some(Output {
        status,
        stdout: reader.join().unwrap_or_default(),
        stderr: Vec::new(),
    })
}

/// Own a registered child tree. Cleanup also runs on setup errors and cancellation.
pub struct ProcessTree {
    id: i32,
    killed: std::sync::atomic::AtomicBool,
}
impl ProcessTree {
    /// Windows callers must create the child suspended; assignment precedes resume.
    pub fn new(id: i32) -> std::io::Result<Self> {
        if id <= 0 {
            return Err(std::io::Error::new(
                std::io::ErrorKind::InvalidInput,
                "Invalid process ID",
            ));
        }
        register(id)?;
        let tree = Self {
            id,
            killed: std::sync::atomic::AtomicBool::new(false),
        };
        #[cfg(windows)]
        resume(id)?;
        Ok(tree)
    }
    pub fn kill(&self) {
        if !self.killed.swap(true, std::sync::atomic::Ordering::AcqRel) {
            kill_group(self.id);
        }
    }
}
impl Drop for ProcessTree {
    fn drop(&mut self) {
        self.kill();
    }
}

/// Bounded detection commands need the same descendant cleanup as ACP sessions.
pub async fn output_with_timeout(
    mut command: tokio::process::Command,
    timeout: Duration,
) -> std::io::Result<Output> {
    #[cfg(unix)]
    command.process_group(0);
    #[cfg(windows)]
    command.creation_flags(windows_sys::Win32::System::Threading::CREATE_SUSPENDED);
    let mut child = command
        .stdin(Stdio::null())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .kill_on_drop(true)
        .spawn()?;
    let id = child
        .id()
        .ok_or_else(|| std::io::Error::other("Child has no process ID"))? as i32;
    let _tree = ProcessTree::new(id).inspect_err(|_| {
        let _ = child.start_kill();
    })?;
    tokio::time::timeout(timeout, child.wait_with_output())
        .await
        .map_err(|_| std::io::Error::new(std::io::ErrorKind::TimedOut, "Command timed out"))?
}
