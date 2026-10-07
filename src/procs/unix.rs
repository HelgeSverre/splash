use parking_lot::Mutex;
use std::collections::HashSet;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Once;
static GROUPS: Mutex<Option<HashSet<i32>>> = Mutex::new(None);
static INSTALL: Once = Once::new();
static SHUTTING_DOWN: AtomicBool = AtomicBool::new(false);

/// Child exits during app shutdown are expected, not session failures.
pub(crate) fn is_shutting_down() -> bool {
    SHUTTING_DOWN.load(Ordering::Acquire)
}

/// Track a process group (spawned with `process_group(0)`, so pgid == pid).
pub fn register(pgid: i32) -> std::io::Result<()> {
    INSTALL.call_once(|| {
        // SAFETY: atexit is a normal exit callback, not an asynchronous signal handler.
        unsafe {
            libc::atexit(kill_all_at_exit);
        }
        if let Ok(mut signals) =
            signal_hook::iterator::Signals::new([libc::SIGTERM, libc::SIGINT, libc::SIGHUP])
        {
            std::thread::spawn(move || {
                if let Some(signal) = signals.forever().next() {
                    kill_all_at_exit();
                    // The handler thread can safely lock and sleep. Restore the
                    // default signal action so shells observe the original signal.
                    let _ = signal_hook::low_level::emulate_default_handler(signal);
                }
            });
        }
    });
    GROUPS.lock().get_or_insert_with(HashSet::new).insert(pgid);
    Ok(())
}

pub fn unregister(pgid: i32) {
    if let Some(set) = GROUPS.lock().as_mut() {
        set.remove(&pgid);
    }
}

/// Terminate one group now: SIGTERM, then SIGKILL shortly after.
pub fn kill_group(pgid: i32) {
    // SAFETY: registered children lead a separate process group.
    unsafe {
        libc::killpg(pgid, libc::SIGTERM);
    }
    std::thread::spawn(move || {
        std::thread::sleep(std::time::Duration::from_millis(1500));
        // SAFETY: the registered process group remains tracked during its grace period.
        unsafe {
            libc::killpg(pgid, libc::SIGKILL);
        }
        unregister(pgid);
    });
}

extern "C" fn kill_all_at_exit() {
    if SHUTTING_DOWN.swap(true, Ordering::AcqRel) {
        return;
    }
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
