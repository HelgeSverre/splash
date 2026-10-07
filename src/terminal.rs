//! One login shell per session in a real PTY, for the bottom terminal pane.
//! Output streams out as base64 chunks with sequence numbers; a scrollback
//! buffer lets the pane reattach without losing anything.

use std::collections::{HashMap, VecDeque};
use std::io::{Read, Write};
use std::path::Path;
use std::sync::atomic::{AtomicU32, Ordering};
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
    buffer: Arc<Mutex<(VecDeque<u8>, u32)>>,
}

#[derive(Default)]
pub struct Terminals {
    map: Mutex<HashMap<String, Term>>,
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
        if let Some(pid) = child.process_id() {
            // The shell leads its own session, so its pid is its group id.
            if let Err(error) = crate::procs::register(pid as i32) {
                let _ = child.kill();
                return Err(error.into());
            }
            #[cfg(windows)]
            if let Err(error) = crate::procs::resume(pid as i32) {
                crate::procs::kill_group(pid as i32);
                let _ = child.kill();
                return Err(error.into());
            }
        }
        let mut reader = pair.master.try_clone_reader().map_err(io)?;
        let writer = pair.master.take_writer().map_err(io)?;

        let buffer = Arc::new(Mutex::new((VecDeque::with_capacity(SCROLLBACK), 0u32)));
        let seq = Arc::new(AtomicU32::new(0));
        {
            let buffer = buffer.clone();
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
                                emit(TermEvent {
                                    session: session.clone(),
                                    seq: s,
                                    data: b64(bytes),
                                    exited: false,
                                });
                            }
                        }
                    }
                    let s = seq.fetch_add(1, Ordering::Relaxed) + 1;
                    buffer.lock().1 = s;
                    emit(TermEvent {
                        session: session.clone(),
                        seq: s,
                        data: String::new(),
                        exited: true,
                    });
                })
                .map_err(io)?;
        }
        map.insert(
            session.to_string(),
            Term {
                writer,
                master: pair.master,
                child,
                buffer,
            },
        );
        Ok(TermAttach {
            scrollback: String::new(),
            seq: 0,
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
        if let Some(mut t) = self.map.lock().remove(session) {
            if let Some(pid) = t.child.process_id() {
                crate::procs::kill_group(pid as i32);
            }
            let _ = t.child.kill();
            let _ = t.child.wait();
        }
    }

    /// Forget a shell that exited on its own.
    pub fn reap(&self, session: &str) {
        let mut map = self.map.lock();
        if let Some(t) = map.get_mut(session) {
            if matches!(t.child.try_wait(), Ok(Some(_))) {
                if let Some(pid) = t.child.process_id() {
                    crate::procs::unregister(pid as i32);
                }
                map.remove(session);
            }
        }
    }
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
        terms.write("t1", command).unwrap();

        let mut seen = String::new();
        let deadline = std::time::Instant::now() + Duration::from_secs(10);
        while !seen.contains("splash-42") && std::time::Instant::now() < deadline {
            if let Ok(e) = rx.recv_timeout(Duration::from_millis(200)) {
                let bytes = base64::engine::general_purpose::STANDARD
                    .decode(e.data)
                    .unwrap();
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
}
