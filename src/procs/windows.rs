//! Job handles are retained until cleanup; the OS closes them even on a crash.
use parking_lot::Mutex;
use std::{
    collections::HashMap,
    io,
    mem::size_of,
    sync::atomic::{AtomicBool, Ordering},
};
use windows_sys::Win32::{
    Foundation::*,
    System::{Diagnostics::ToolHelp::*, JobObjects::*, Threading::*},
};

static JOBS: Mutex<Option<HashMap<i32, Job>>> = Mutex::new(None);
static SHUTTING_DOWN: AtomicBool = AtomicBool::new(false);

struct Job(HANDLE);
// SAFETY: a Job Object handle can be used and closed from any thread. The registry owns it.
unsafe impl Send for Job {}
impl Drop for Job {
    fn drop(&mut self) {
        // SAFETY: this uniquely owned, valid handle is closed exactly once.
        unsafe {
            CloseHandle(self.0);
        }
    }
}
pub(crate) fn is_shutting_down() -> bool {
    SHUTTING_DOWN.load(Ordering::Acquire)
}

/// The caller suspends ACP children until their job has been assigned.
pub fn register(pid: i32) -> io::Result<()> {
    // SAFETY: pointers reference initialized structures, handle ownership is local.
    unsafe {
        let job = Job(CreateJobObjectW(std::ptr::null(), std::ptr::null()));
        if job.0.is_null() {
            return Err(io::Error::last_os_error());
        }
        let mut limits: JOBOBJECT_EXTENDED_LIMIT_INFORMATION = std::mem::zeroed();
        limits.BasicLimitInformation.LimitFlags = JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE;
        if SetInformationJobObject(
            job.0,
            JobObjectExtendedLimitInformation,
            &limits as *const _ as _,
            size_of::<JOBOBJECT_EXTENDED_LIMIT_INFORMATION>() as u32,
        ) == 0
        {
            return Err(io::Error::last_os_error());
        }
        let process = OpenProcess(PROCESS_SET_QUOTA | PROCESS_TERMINATE, 0, pid as u32);
        if process.is_null() {
            return Err(io::Error::last_os_error());
        }
        let assigned = AssignProcessToJobObject(job.0, process);
        let error = io::Error::last_os_error();
        CloseHandle(process);
        if assigned == 0 {
            return Err(error);
        }
        JOBS.lock()
            .get_or_insert_with(HashMap::new)
            .insert(pid, job);
    }
    Ok(())
}

pub fn unregister(pid: i32) {
    if let Some(jobs) = JOBS.lock().as_mut() {
        jobs.remove(&pid);
    }
}
pub fn kill_group(pid: i32) {
    unregister(pid);
}

/// Resume only threads belonging to the still-suspended child, after job assignment.
pub fn resume(pid: i32) -> io::Result<()> {
    // SAFETY: toolhelp initializes THREADENTRY32; thread handles are closed locally.
    unsafe {
        let snapshot = CreateToolhelp32Snapshot(TH32CS_SNAPTHREAD, 0);
        if snapshot == INVALID_HANDLE_VALUE {
            return Err(io::Error::last_os_error());
        }
        let mut entry: THREADENTRY32 = std::mem::zeroed();
        entry.dwSize = size_of::<THREADENTRY32>() as u32;
        let mut found = false;
        let mut next = Thread32First(snapshot, &mut entry);
        let mut error = None;
        while next != 0 {
            if entry.th32OwnerProcessID == pid as u32 {
                let thread = OpenThread(THREAD_SUSPEND_RESUME, 0, entry.th32ThreadID);
                if thread.is_null() {
                    error = Some(io::Error::last_os_error());
                    break;
                }
                let result = ResumeThread(thread);
                if result == u32::MAX {
                    error = Some(io::Error::last_os_error());
                }
                CloseHandle(thread);
                found = true;
            }
            next = Thread32Next(snapshot, &mut entry);
        }
        CloseHandle(snapshot);
        if let Some(error) = error {
            return Err(error);
        }
        if !found {
            return Err(io::Error::other("Suspended agent has no thread to resume"));
        }
    }
    Ok(())
}
