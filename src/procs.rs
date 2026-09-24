//! Every child process group Splash starts, so none outlive it.
//!
//! Elyra leaves its event loop with `process::exit`, so destructors (and
//! tokio's `kill_on_drop`) never run on quit. `exit` does run `atexit`
//! handlers, so the registry kills whatever is left from one.

use std::collections::HashSet;
use std::sync::Once;

use parking_lot::Mutex;

static GROUPS: Mutex<Option<HashSet<i32>>> = Mutex::new(None);
static INSTALL: Once = Once::new();

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
