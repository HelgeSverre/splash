//! Child processes: short-lived commands run with a deadline, and every
//! process group Splash starts, tracked so none outlive it.
//!
//! Elyra leaves its event loop with `process::exit`, so destructors (and
//! tokio's `kill_on_drop`) never run on quit. `exit` does run `atexit`
//! handlers, so the registry kills whatever is left from one.

use std::collections::HashSet;
use std::io::Read;
use std::process::{Command, Output, Stdio};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Once;
use std::time::{Duration, Instant};

use parking_lot::Mutex;

/// Run `cmd` (stdin closed, stdout captured, stderr dropped), killing it if
/// it isn't done within `timeout`. `None` when it can't start or times out.
pub fn run_with_timeout(cmd: &mut Command, timeout: Duration) -> Option<Output> {
    let mut child = cmd
        .stdin(Stdio::null())
        .stdout(Stdio::piped())
        .stderr(Stdio::null())
        .spawn()
        .ok()?;
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
                let _ = child.kill();
                let _ = child.wait();
                return None;
            }
        }
    };
    Some(Output {
        status,
        stdout: reader.join().unwrap_or_default(),
        stderr: Vec::new(),
    })
}

static GROUPS: Mutex<Option<HashSet<i32>>> = Mutex::new(None);
static INSTALL: Once = Once::new();
static SHUTTING_DOWN: AtomicBool = AtomicBool::new(false);

/// Child exits during app shutdown are expected, not session failures.
pub(crate) fn is_shutting_down() -> bool {
    SHUTTING_DOWN.load(Ordering::Acquire)
}

/// Track a process group (spawned with `process_group(0)`, so pgid == pid).
pub fn register(pgid: i32) {
    INSTALL.call_once(|| unsafe {
        libc::atexit(kill_all_at_exit);
        // A crash or `kill` skips atexit; clean up on the usual signals too.
        for sig in [libc::SIGTERM, libc::SIGINT, libc::SIGHUP] {
            libc::signal(
                sig,
                on_signal as extern "C" fn(libc::c_int) as libc::sighandler_t,
            );
        }
    });
    GROUPS.lock().get_or_insert_with(HashSet::new).insert(pgid);
}

pub fn unregister(pgid: i32) {
    if let Some(set) = GROUPS.lock().as_mut() {
        set.remove(&pgid);
    }
}

/// Terminate one group now: SIGTERM, then SIGKILL shortly after.
pub fn kill_group(pgid: i32) {
    unsafe {
        libc::killpg(pgid, libc::SIGTERM);
    }
    std::thread::spawn(move || {
        std::thread::sleep(std::time::Duration::from_millis(1500));
        unsafe {
            libc::killpg(pgid, libc::SIGKILL);
        }
    });
    unregister(pgid);
}

extern "C" fn on_signal(sig: libc::c_int) {
    kill_all_at_exit();
    unsafe {
        // Re-raise with the default action so the exit status stays honest.
        libc::signal(sig, libc::SIG_DFL);
        libc::raise(sig);
    }
}

extern "C" fn kill_all_at_exit() {
    SHUTTING_DOWN.store(true, Ordering::Release);
    // Don't block on the lock during exit; if it's held, skip rather than hang.
    let Some(guard) = GROUPS.try_lock() else {
        return;
    };
    let Some(set) = guard.as_ref() else { return };
    for &pgid in set {
        unsafe {
            libc::killpg(pgid, libc::SIGTERM);
        }
    }
    std::thread::sleep(std::time::Duration::from_millis(300));
    for &pgid in set {
        unsafe {
            libc::killpg(pgid, libc::SIGKILL);
        }
    }
}
