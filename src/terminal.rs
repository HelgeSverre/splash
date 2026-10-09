//! One login shell per session in a real PTY, for the bottom terminal pane.
//! Output streams out as base64 chunks with sequence numbers; a scrollback
//! buffer lets the pane reattach without losing anything.

use std::collections::{HashMap, VecDeque};
use std::io::{Read, Write};
use std::path::Path;
use std::sync::atomic::{AtomicBool, AtomicU32, Ordering};
use std::sync::Arc;

use base64::Engine;
use parking_lot::Mutex;
use portable_pty::{native_pty_system, Child, CommandBuilder, MasterPty, PtySize};
use serde::{Deserialize, Serialize};

use crate::error::{Error, Result};

const SCROLLBACK: usize = 256 * 1024;

#[derive(Clone, Debug, Serialize, Deserialize, specta::Type)]
pub struct TermEvent {
    pub session: String,
    pub seq: u32,
    /// Base64 bytes (specta would type `Vec<u8>` as `number[]`).
    pub data: String,
    pub exited: bool,
}

#[derive(Clone, Debug, Serialize, Deserialize, specta::Type)]
pub struct TermAttach {
    /// Everything still in the scrollback, base64.
    pub scrollback: String,
    /// The last sequence number included in `scrollback`.
    pub seq: u32,
}

struct Term {
    writer: Box<dyn Write + Send>,
    master: Box<dyn MasterPty + Send>,
    child: Box<dyn Child + Send + Sync>,
    tree: crate::procs::ProcessTree,
    buffer: Arc<Mutex<(VecDeque<u8>, u32)>>,
    reader_done: Arc<AtomicBool>,
    active: Arc<AtomicBool>,
}

#[derive(Default)]
pub struct Terminals {
    map: Mutex<HashMap<String, Term>>,
    // Event sequence numbers are per service rather than per shell. Clients
    // only require monotonicity within their session, so harmless gaps avoid
    // an old shell generation reusing a new shell's sequence numbers.
    seq: Arc<AtomicU32>,
}

impl Terminals {
    /// Attach to the session's shell, starting it if needed.
    pub fn open(
        &self,
        session: &str,
        cwd: &Path,
        cols: u16,
        rows: u16,
        emit: impl Fn(TermEvent) + Send + 'static,
    ) -> Result<TermAttach> {
        let mut map = self.map.lock();
        if let Some(t) = map.get(session) {
            if !t.reader_done.load(Ordering::Acquire) {
                let _ = t.master.resize(PtySize {
                    rows,
                    cols,
                    pixel_width: 0,
                    pixel_height: 0,
                });
                let (buf, seq) = &*t.buffer.lock();
                let bytes: Vec<u8> = buf.iter().copied().collect();
                return Ok(TermAttach {
                    scrollback: b64(&bytes),
                    seq: *seq,
                });
            }
        }
        if let Some(old) = map.remove(session) {
            // The reader may have reached EOF before its child is waitable.
            // Retire it before starting a replacement so late reader events
            // cannot be published for the new shell generation.
            retire(old);
        }

        let pair = native_pty_system()
            .openpty(PtySize {
                rows,
                cols,
                pixel_width: 0,
                pixel_height: 0,
            })
            .map_err(io)?;
        let (shell, args) = crate::agents::env::shell();
        let mut cmd = CommandBuilder::new(shell);
        cmd.args(args);
        cmd.cwd(cwd);
        cmd.env("TERM", "xterm-256color");
        cmd.env("COLORTERM", "truecolor");
        cmd.env("PATH", crate::agents::env::path());
        if std::env::var("LANG").is_err() {
            cmd.env("LANG", "en_US.UTF-8");
        }
        #[cfg(windows)]
        cmd.set_suspended(true);
        let mut child = pair.slave.spawn_command(cmd).map_err(io)?;
        drop(pair.slave);
        let pid = child
            .process_id()
            .ok_or_else(|| Error::Io("Terminal has no process ID".into()))?;
        let tree = crate::procs::ProcessTree::new(pid as i32).inspect_err(|_| {
            let _ = child.kill();
        })?;
        let mut reader = pair.master.try_clone_reader().map_err(io)?;
        let writer = pair.master.take_writer().map_err(io)?;

        let baseline = self.seq.load(Ordering::Acquire);
        let buffer = Arc::new(Mutex::new((VecDeque::with_capacity(SCROLLBACK), baseline)));
        let reader_done = Arc::new(AtomicBool::new(false));
        let active = Arc::new(AtomicBool::new(true));
        {
            let buffer = buffer.clone();
            let reader_done = reader_done.clone();
            let active = active.clone();
            let seq = self.seq.clone();
            let session = session.to_string();
            std::thread::Builder::new()
                .name(format!("pty-{session}"))
                .spawn(move || {
                    let mut chunk = [0u8; 16 * 1024];
                    loop {
                        match reader.read(&mut chunk) {
                            Ok(0) | Err(_) => break,
                            Ok(n) => {
                                let bytes = &chunk[..n];
                                let s = seq.fetch_add(1, Ordering::Relaxed) + 1;
                                {
                                    let (buf, last) = &mut *buffer.lock();
                                    buf.extend(bytes);
                                    let over = buf.len().saturating_sub(SCROLLBACK);
                                    buf.drain(..over);
                                    *last = s;
                                }
                                if active.load(Ordering::Acquire) {
                                    emit(TermEvent {
                                        session: session.clone(),
                                        seq: s,
                                        data: b64(bytes),
                                        exited: false,
                                    });
                                }
                            }
                        }
                    }
                    // Allocate the exit sequence before exposing reader_done:
                    // a replacement attach uses this as its stale-event floor.
                    let s = seq.fetch_add(1, Ordering::Relaxed) + 1;
                    buffer.lock().1 = s;
                    reader_done.store(true, Ordering::Release);
                    if active.load(Ordering::Acquire) {
                        emit(TermEvent {
                            session: session.clone(),
                            seq: s,
                            data: String::new(),
                            exited: true,
                        });
                    }
                })
                .map_err(io)?;
        }
        map.insert(
            session.to_string(),
            Term {
                writer,
                master: pair.master,
                child,
                tree,
                buffer: buffer.clone(),
                reader_done,
                active,
            },
        );
        let (buf, seq) = &*buffer.lock();
        let bytes: Vec<u8> = buf.iter().copied().collect();
        Ok(TermAttach {
            scrollback: b64(&bytes),
            seq: *seq,
        })
    }

    pub fn write(&self, session: &str, data: &str) -> Result<()> {
        let mut map = self.map.lock();
        let t = map.get_mut(session).ok_or(Error::NotFound("no terminal"))?;
        t.writer.write_all(data.as_bytes())?;
        Ok(t.writer.flush()?)
    }

    pub fn resize(&self, session: &str, cols: u16, rows: u16) -> Result<()> {
        let map = self.map.lock();
        let t = map.get(session).ok_or(Error::NotFound("no terminal"))?;
        t.master
            .resize(PtySize {
                rows,
                cols,
                pixel_width: 0,
                pixel_height: 0,
            })
            .map_err(io)
    }

    /// Kill the shell (a new one starts on the next `open`).
    pub fn close(&self, session: &str) {
        let term = self.map.lock().remove(session);
        if let Some(term) = term {
            retire(term);
        }
    }

    /// Forget a shell whose reader ended. A newer replacement is retained.
    pub fn reap(&self, session: &str) {
        let term = {
            let mut map = self.map.lock();
            if map
                .get(session)
                .is_some_and(|t| t.reader_done.load(Ordering::Acquire))
            {
                map.remove(session)
            } else {
                None
            }
        };
        if let Some(term) = term {
            retire(term);
        }
    }
}

fn retire(mut term: Term) {
    term.active.store(false, Ordering::Release);
    term.tree.kill();
    let _ = term.child.kill();
    let _ = term.child.wait();
}

fn io(e: impl std::fmt::Display) -> Error {
    Error::Io(e.to_string())
}

fn b64(bytes: &[u8]) -> String {
    base64::engine::general_purpose::STANDARD.encode(bytes)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::mpsc;
    use std::time::Duration;

    /// ConPTY can split or repeat cursor-position requests across PTY reads.
    /// Keep a three-byte suffix so `ESC[6n` spanning two chunks still gets a
    /// response, and answer every complete request we observe.
    fn cursor_queries(tail: &mut Vec<u8>, bytes: &[u8]) -> usize {
        tail.extend_from_slice(bytes);
        let count = tail.windows(4).filter(|part| *part == b"\x1b[6n").count();
        let keep = tail.len().min(3);
        tail.drain(..tail.len() - keep);
        count
    }

    fn terminal_state(terms: &Terminals, session: &str) -> String {
        let mut map = terms.map.lock();
        let Some(term) = map.get_mut(session) else {
            return "missing".into();
        };
        let child = match term.child.try_wait() {
            Ok(Some(status)) => format!("exited {status:?}"),
            Ok(None) => "running".into(),
            Err(error) => format!("wait error {error}"),
        };
        format!(
            "reader_done={}, active={}, child={child}",
            term.reader_done.load(Ordering::Acquire),
            term.active.load(Ordering::Acquire),
        )
    }

    #[test]
    fn a_shell_echoes_and_reattaches_with_scrollback() {
        let terms = Terminals::default();
        let (tx, rx) = mpsc::channel::<TermEvent>();
        let dir = std::env::temp_dir();
        terms
            .open("t1", &dir, 80, 24, move |e| {
                let _ = tx.send(e);
            })
            .unwrap();
        let command = if cfg!(windows) {
            "echo (\"splash-\" + (40+2))\r\n"
        } else {
            "echo splash-$((40+2))\n"
        };
        let mut seen = String::new();
        let mut query_tail = Vec::new();
        let mut sent_command = false;
        let deadline = std::time::Instant::now() + Duration::from_secs(10);
        while !seen.contains("splash-42") && std::time::Instant::now() < deadline {
            if let Ok(e) = rx.recv_timeout(Duration::from_millis(200)) {
                let bytes = base64::engine::general_purpose::STANDARD
                    .decode(e.data)
                    .unwrap();
                // ConPTY asks the terminal emulator for its cursor position at startup.
                // This fixture has no xterm.js, so answer every query it emits.
                let queries = cursor_queries(&mut query_tail, &bytes);
                if cfg!(windows) {
                    for _ in 0..queries {
                        terms.write("t1", "\x1b[1;1R").unwrap();
                    }
                }
                if !sent_command
                    && ((cfg!(windows) && queries > 0) || (!cfg!(windows) && !bytes.is_empty()))
                {
                    terms.write("t1", command).unwrap();
                    sent_command = true;
                }
                seen.push_str(&String::from_utf8_lossy(&bytes));
            }
        }
        assert!(seen.contains("splash-42"), "output: {seen:?}");

        // A second open reattaches: same shell, scrollback included.
        let again = terms.open("t1", &dir, 100, 30, |_| {}).unwrap();
        let scroll = base64::engine::general_purpose::STANDARD
            .decode(again.scrollback)
            .unwrap();
        assert!(String::from_utf8_lossy(&scroll).contains("splash-42"));
        assert!(again.seq > 0);
        terms.close("t1");
    }

    #[test]
    fn an_exited_shell_is_replaced_on_next_open() {
        let terms = Terminals::default();
        let (tx, rx) = mpsc::channel::<TermEvent>();
        let dir = std::env::temp_dir();
        terms
            .open("t1", &dir, 80, 24, move |e| {
                let _ = tx.send(e);
            })
            .unwrap();

        let exit = if cfg!(windows) { "exit\r\n" } else { "exit\n" };
        let mut exited = false;
        let mut exit_seq = 0;
        let mut output = String::new();
        let mut query_tail = Vec::new();
        let mut sent_exit = false;
        let deadline = std::time::Instant::now() + Duration::from_secs(10);
        while !exited && std::time::Instant::now() < deadline {
            if let Ok(event) = rx.recv_timeout(Duration::from_millis(200)) {
                let bytes = base64::engine::general_purpose::STANDARD
                    .decode(event.data)
                    .unwrap();
                output.push_str(&String::from_utf8_lossy(&bytes));
                let queries = cursor_queries(&mut query_tail, &bytes);
                if cfg!(windows) {
                    for _ in 0..queries {
                        terms.write("t1", "\x1b[1;1R").unwrap();
                    }
                }
                if !sent_exit
                    && ((cfg!(windows) && queries > 0) || (!cfg!(windows) && !bytes.is_empty()))
                {
                    terms.write("t1", exit).unwrap();
                    sent_exit = true;
                }
                exited = event.exited;
                if exited {
                    exit_seq = event.seq;
                }
            }
        }
        assert!(
            exited,
            "shell did not exit (sent_exit={sent_exit}, {}, output={output:?})",
            terminal_state(&terms, "t1"),
        );

        let fresh = terms.open("t1", &dir, 80, 24, |_| {}).unwrap();
        let scrollback = base64::engine::general_purpose::STANDARD
            .decode(fresh.scrollback)
            .unwrap();
        assert!(
            !String::from_utf8_lossy(&scrollback).contains("exit"),
            "reopened dead terminal scrollback"
        );
        assert!(fresh.seq >= exit_seq);
        terms.close("t1");
    }

    #[test]
    fn a_late_exit_event_is_stale_after_replacement() {
        let terms = Terminals::default();
        let (output_tx, output_rx) = mpsc::channel::<TermEvent>();
        let (exit_ready_tx, exit_ready_rx) = mpsc::channel::<u32>();
        let (release_tx, release_rx) = mpsc::channel::<()>();
        let (late_tx, late_rx) = mpsc::channel::<TermEvent>();
        let dir = std::env::temp_dir();
        terms
            .open("t1", &dir, 80, 24, move |event| {
                if event.exited {
                    let _ = exit_ready_tx.send(event.seq);
                    let _ = release_rx.recv();
                    let _ = late_tx.send(event);
                } else {
                    let _ = output_tx.send(event);
                }
            })
            .unwrap();

        let exit = if cfg!(windows) { "exit\r\n" } else { "exit\n" };
        let mut query_tail = Vec::new();
        let mut sent_exit = false;
        let mut output = String::new();
        let deadline = std::time::Instant::now() + Duration::from_secs(10);
        let exit_seq = loop {
            if let Ok(seq) = exit_ready_rx.try_recv() {
                break seq;
            }
            assert!(
                std::time::Instant::now() < deadline,
                "shell did not exit (sent_exit={sent_exit}, {}, output={output:?})",
                terminal_state(&terms, "t1"),
            );
            if let Ok(event) = output_rx.recv_timeout(Duration::from_millis(200)) {
                let bytes = base64::engine::general_purpose::STANDARD
                    .decode(event.data)
                    .unwrap();
                output.push_str(&String::from_utf8_lossy(&bytes));
                let queries = cursor_queries(&mut query_tail, &bytes);
                if cfg!(windows) {
                    for _ in 0..queries {
                        terms.write("t1", "\x1b[1;1R").unwrap();
                    }
                }
                if !sent_exit
                    && ((cfg!(windows) && queries > 0) || (!cfg!(windows) && !bytes.is_empty()))
                {
                    terms.write("t1", exit).unwrap();
                    sent_exit = true;
                }
            }
        };

        // The reader has allocated its exit sequence but has not published it.
        // A concurrent attach must create a new shell with that sequence as
        // its floor, so clients discard the delayed old exit event below.
        let (fresh_tx, fresh_rx) = mpsc::channel::<TermEvent>();
        let fresh = terms
            .open("t1", &dir, 80, 24, move |event| {
                let _ = fresh_tx.send(event);
            })
            .unwrap();
        let scrollback = base64::engine::general_purpose::STANDARD
            .decode(fresh.scrollback)
            .unwrap();
        assert!(
            !String::from_utf8_lossy(&scrollback).contains("exit"),
            "reopened dead terminal scrollback"
        );
        assert!(fresh.seq >= exit_seq);

        release_tx.send(()).unwrap();
        let late = late_rx.recv_timeout(Duration::from_secs(1)).unwrap();
        assert!(late.exited);
        assert!(late.seq <= fresh.seq);

        let command = if cfg!(windows) {
            "echo splash-restarted\r\n"
        } else {
            "echo splash-restarted\n"
        };
        let mut query_tail = Vec::new();
        let mut sent_command = false;
        let deadline = std::time::Instant::now() + Duration::from_secs(10);
        let mut live_output = false;
        while !live_output && std::time::Instant::now() < deadline {
            if let Ok(event) = fresh_rx.recv_timeout(Duration::from_millis(200)) {
                let bytes = base64::engine::general_purpose::STANDARD
                    .decode(event.data)
                    .unwrap();
                let queries = cursor_queries(&mut query_tail, &bytes);
                if cfg!(windows) {
                    for _ in 0..queries {
                        terms.write("t1", "\x1b[1;1R").unwrap();
                    }
                }
                if !sent_command
                    && ((cfg!(windows) && queries > 0) || (!cfg!(windows) && !bytes.is_empty()))
                {
                    terms.write("t1", command).unwrap();
                    sent_command = true;
                }
                if String::from_utf8_lossy(&bytes).contains("splash-restarted") {
                    assert!(event.seq > fresh.seq);
                    live_output = true;
                }
            }
        }
        assert!(live_output, "replacement shell did not produce output");
        terms.close("t1");
    }
}
