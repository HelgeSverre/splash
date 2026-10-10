//! One login shell per session in a real PTY, for the bottom terminal pane.
//! Output streams out as base64 chunks with sequence numbers; a scrollback
//! buffer lets the pane reattach without losing anything.

use std::collections::{HashMap, VecDeque};
use std::io::{Read, Write};
use std::path::Path;
use std::sync::atomic::{AtomicBool, AtomicU32, AtomicU64, Ordering};
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

type Emitter = Arc<Mutex<Box<dyn Fn(TermEvent, u64) + Send>>>;

struct Term {
    writer: Box<dyn Write + Send>,
    master: Arc<Mutex<Option<Box<dyn MasterPty + Send>>>>,
    child: Arc<Mutex<Box<dyn Child + Send + Sync>>>,
    tree: crate::procs::ProcessTree,
    state: Arc<TermState>,
}

struct TermState {
    generation: u64,
    buffer: Arc<Mutex<(VecDeque<u8>, u32)>>,
    reader_done: Arc<AtomicBool>,
    ended: Arc<AtomicBool>,
    active: Arc<AtomicBool>,
    emitter: Emitter,
}

#[derive(Default)]
pub struct Terminals {
    map: Mutex<HashMap<String, Term>>,
    // Event sequence numbers are per service rather than per shell. Clients
    // only require monotonicity within their session, so harmless gaps avoid
    // an old shell generation reusing a new shell's sequence numbers.
    seq: Arc<AtomicU32>,
    generation: AtomicU64,
}

impl Terminals {
    /// Attach to the session's shell, starting it if needed.
    pub fn open(
        &self,
        session: &str,
        cwd: &Path,
        cols: u16,
        rows: u16,
        emit: impl Fn(TermEvent, u64) + Send + 'static,
    ) -> Result<TermAttach> {
        let mut map = self.map.lock();
        if let Some(t) = map.get(session) {
            if !t.state.reader_done.load(Ordering::Acquire) {
                if let Some(master) = t.master.lock().as_ref() {
                    let _ = master.resize(PtySize {
                        rows,
                        cols,
                        pixel_width: 0,
                        pixel_height: 0,
                    });
                }
                // On Windows the child watcher may already have closed the
                // ConPTY master so the reader can drain its final bytes. Keep
                // this generation attached until that reader publishes exit.
                let (buf, seq) = &*t.state.buffer.lock();
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
        let child = Arc::new(Mutex::new(child));
        let mut reader = pair.master.try_clone_reader().map_err(io)?;
        let writer = pair.master.take_writer().map_err(io)?;
        let master = Arc::new(Mutex::new(Some(pair.master)));

        let baseline = self.seq.load(Ordering::Acquire);
        let generation = self.generation.fetch_add(1, Ordering::Relaxed) + 1;
        let state = Arc::new(TermState {
            generation,
            buffer: Arc::new(Mutex::new((VecDeque::with_capacity(SCROLLBACK), baseline))),
            reader_done: Arc::new(AtomicBool::new(false)),
            ended: Arc::new(AtomicBool::new(false)),
            active: Arc::new(AtomicBool::new(true)),
            emitter: Arc::new(Mutex::new(Box::new(emit))),
        });
        {
            let state = state.clone();
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
                                // Serialize output with the final event so no chunk can
                                // be published after its terminal has exited.
                                let emit = state.emitter.lock();
                                if state.ended.load(Ordering::Acquire) {
                                    continue;
                                }
                                let bytes = &chunk[..n];
                                let s = seq.fetch_add(1, Ordering::Relaxed) + 1;
                                {
                                    let (buf, last) = &mut *state.buffer.lock();
                                    buf.extend(bytes);
                                    let over = buf.len().saturating_sub(SCROLLBACK);
                                    buf.drain(..over);
                                    *last = s;
                                }
                                if state.active.load(Ordering::Acquire) {
                                    (emit)(
                                        TermEvent {
                                            session: session.clone(),
                                            seq: s,
                                            data: b64(bytes),
                                            exited: false,
                                        },
                                        generation,
                                    );
                                }
                            }
                        }
                    }
                    finish(&session, &seq, &state);
                })
                .map_err(io)?;
        }
        #[cfg(windows)]
        {
            let child = child.clone();
            let master = master.clone();
            let state = state.clone();
            let session = session.to_string();
            std::thread::Builder::new()
                .name(format!("pty-watch-{session}"))
                .spawn(move || loop {
                    if state.ended.load(Ordering::Acquire) {
                        break;
                    }
                    if matches!(child.lock().try_wait(), Ok(Some(_))) {
                        // ConPTY keeps the output pipe open after the child
                        // exits. Closing its master lets the reader drain the
                        // pipe and publish final output before the exit event.
                        drop(master.lock().take());
                        break;
                    }
                    std::thread::sleep(std::time::Duration::from_millis(20));
                })
                .map_err(io)?;
        }
        map.insert(
            session.to_string(),
            Term {
                writer,
                master,
                child,
                tree,
                state: state.clone(),
            },
        );
        let (buf, seq) = &*state.buffer.lock();
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
        let resized = t
            .master
            .lock()
            .as_ref()
            .ok_or(Error::NotFound("no terminal"))?
            .resize(PtySize {
                rows,
                cols,
                pixel_width: 0,
                pixel_height: 0,
            })
            .map_err(io);
        resized
    }

    /// Kill the shell (a new one starts on the next `open`).
    pub fn close(&self, session: &str) {
        let term = self.map.lock().remove(session);
        if let Some(term) = term {
            retire(term);
        }
    }

    /// Forget a shell whose reader ended. A newer replacement is retained.
    pub fn reap(&self, session: &str, generation: u64) {
        let term = {
            let mut map = self.map.lock();
            if map.get(session).is_some_and(|t| {
                t.state.generation == generation && t.state.reader_done.load(Ordering::Acquire)
            }) {
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

fn finish(session: &str, seq: &AtomicU32, state: &TermState) {
    // Serialize the final event with the reader's output allocation and
    // publication, so no chunk can follow the exited event.
    let emit = state.emitter.lock();
    if state
        .ended
        .compare_exchange(false, true, Ordering::AcqRel, Ordering::Acquire)
        .is_err()
    {
        return;
    }
    // Allocate the exit sequence before exposing reader_done: a replacement
    // attach uses this as its stale-event floor.
    let seq = seq.fetch_add(1, Ordering::Relaxed) + 1;
    state.buffer.lock().1 = seq;
    state.reader_done.store(true, Ordering::Release);
    if state.active.load(Ordering::Acquire) {
        (emit)(
            TermEvent {
                session: session.to_string(),
                seq,
                data: String::new(),
                exited: true,
            },
            state.generation,
        );
    }
}

fn retire(term: Term) {
    term.state.active.store(false, Ordering::Release);
    term.state.ended.store(true, Ordering::Release);
    term.tree.kill();
    drop(term.master.lock().take());
    let mut child = term.child.lock();
    let _ = child.kill();
    let _ = child.wait();
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
        let child = match term.child.lock().try_wait() {
            Ok(Some(status)) => format!("exited {status:?}"),
            Ok(None) => "running".into(),
            Err(error) => format!("wait error {error}"),
        };
        format!(
            "reader_done={}, ended={}, active={}, child={child}",
            term.state.reader_done.load(Ordering::Acquire),
            term.state.ended.load(Ordering::Acquire),
            term.state.active.load(Ordering::Acquire),
        )
    }

    #[test]
    fn a_shell_echoes_and_reattaches_with_scrollback() {
        let terms = Terminals::default();
        let (tx, rx) = mpsc::channel::<TermEvent>();
        let dir = std::env::temp_dir();
        terms
            .open("t1", &dir, 80, 24, move |e, _| {
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
        let again = terms.open("t1", &dir, 100, 30, |_, _| {}).unwrap();
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
            .open("t1", &dir, 80, 24, move |e, _| {
                let _ = tx.send(e);
            })
            .unwrap();

        let exit = if cfg!(windows) {
            "echo splash-final-output; exit\r\n"
        } else {
            "echo splash-final-output; exit\n"
        };
        let mut exited = false;
        let mut exit_seq = 0;
        let mut output = String::new();
        let mut final_output_seen = false;
        let mut query_tail = Vec::new();
        let mut sent_exit = false;
        let deadline = std::time::Instant::now() + Duration::from_secs(10);
        while !exited && std::time::Instant::now() < deadline {
            if let Ok(event) = rx.recv_timeout(Duration::from_millis(200)) {
                let bytes = base64::engine::general_purpose::STANDARD
                    .decode(event.data)
                    .unwrap();
                output.push_str(&String::from_utf8_lossy(&bytes));
                final_output_seen |= output.contains("splash-final-output");
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
        assert!(
            final_output_seen,
            "final output was lost before exit (output={output:?})"
        );

        let fresh = terms.open("t1", &dir, 80, 24, |_, _| {}).unwrap();
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

    #[cfg(windows)]
    #[test]
    fn a_draining_conpty_is_not_replaced_before_reader_finishes() {
        let terms = Terminals::default();
        let dir = std::env::temp_dir();
        terms.open("t1", &dir, 80, 24, |_, _| {}).unwrap();

        // This is the state after the watcher observes the child exit and
        // takes the ConPTY master. Keep it alive outside Term so the reader
        // remains in its pre-EOF drain window deterministically.
        let (generation, master) = {
            let map = terms.map.lock();
            let term = map.get("t1").unwrap();
            let generation = term.state.generation;
            let master = {
                let mut held = term.master.lock();
                held.take().expect("ConPTY master")
            };
            (generation, master)
        };

        terms.open("t1", &dir, 100, 30, |_, _| {}).unwrap();
        let map = terms.map.lock();
        let term = map.get("t1").expect("draining terminal was replaced");
        assert_eq!(term.state.generation, generation);
        assert!(!term.state.reader_done.load(Ordering::Acquire));
        drop(map);

        terms.close("t1");
        drop(master);
    }

    #[test]
    fn a_late_exit_event_is_stale_after_replacement() {
        let terms = Arc::new(Terminals::default());
        let old_terms = Arc::downgrade(&terms);
        let (output_tx, output_rx) = mpsc::channel::<TermEvent>();
        let (exit_ready_tx, exit_ready_rx) = mpsc::channel::<u32>();
        let (release_tx, release_rx) = mpsc::channel::<()>();
        let (late_tx, late_rx) = mpsc::channel::<TermEvent>();
        let dir = std::env::temp_dir();
        terms
            .open("t1", &dir, 80, 24, move |event, generation| {
                if event.exited {
                    let _ = exit_ready_tx.send(event.seq);
                    let _ = release_rx.recv();
                    if let Some(terms) = old_terms.upgrade() {
                        terms.reap(&event.session, generation);
                    }
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
            .open("t1", &dir, 80, 24, move |event, _| {
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

        let fresh_generation = terms.map.lock().get("t1").unwrap().state.generation;
        terms.write("t1", exit).unwrap();
        let deadline = std::time::Instant::now() + Duration::from_secs(10);
        let mut fresh_exited = false;
        while !fresh_exited && std::time::Instant::now() < deadline {
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
                fresh_exited = event.exited;
            }
        }
        assert!(fresh_exited, "replacement shell did not exit");

        // The old callback reaps after the replacement has also finished. It
        // must not remove the newer generation merely because both share a
        // session ID.
        release_tx.send(()).unwrap();
        let late = late_rx.recv_timeout(Duration::from_secs(1)).unwrap();
        assert!(late.exited);
        assert!(late.seq <= fresh.seq);
        let retained = terms.map.lock();
        let current = retained.get("t1").expect("replacement was reaped");
        assert_eq!(current.state.generation, fresh_generation);
        assert!(current.state.reader_done.load(Ordering::Acquire));
        drop(retained);
        terms.close("t1");
    }
}
