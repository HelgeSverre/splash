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
    if register(pid).is_err() {
        let _ = child.kill();
        let _ = child.wait();
        return None;
    }
    #[cfg(windows)]
    if resume(pid).is_err() {
        kill_group(pid);
        let _ = child.kill();
        let _ = child.wait();
        return None;
    }
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
                kill_group(pid);
                let _ = child.kill();
                let _ = child.wait();
                return None;
            }
        }
    };
    kill_group(pid);
    Some(Output {
        status,
        stdout: reader.join().unwrap_or_default(),
        stderr: Vec::new(),
    })
}
