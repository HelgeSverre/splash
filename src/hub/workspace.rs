//! A session's folder as the UI browses it: changes, diffs, the tree, a
//! watcher, the terminal and the upstream git info.

use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::Arc;
use std::time::{Duration, Instant};

use parking_lot::Mutex;
use serde::{Deserialize, Serialize};

use super::{blocking, Core, Result, Sessions};
use crate::git_info::{self, GitInfo};
use crate::store::Isolation;
use crate::terminal::{TermAttach, Terminals};
use crate::workspace::{self, DirEntry, FileChange, FileContent, FileDiff};

/// Pushed on `workspace` when files in a session's folder probably changed.
#[derive(Clone, Debug, Serialize, Deserialize, specta::Type)]
pub struct WorkspaceEvent {
    pub session: String,
    pub paths: Vec<String>,
}

/// How long upstream git info (a `gh` call) stays fresh.
const GIT_TTL: Duration = Duration::from_secs(60);

pub struct Workspace {
    core: Arc<Core>,
    sessions: Arc<Sessions>,
    watchers: Mutex<HashMap<String, workspace::Watcher>>,
    terminals: Arc<Terminals>,
    git_cache: Mutex<HashMap<String, (Instant, GitInfo)>>,
}

impl Workspace {
    pub fn new(core: Arc<Core>, sessions: Arc<Sessions>) -> Self {
        Self {
            core,
            sessions,
            watchers: Mutex::default(),
            terminals: Arc::default(),
            git_cache: Mutex::default(),
        }
    }

    /// The session folder and the commit its changes are measured against.
    fn folder(&self, id: &str) -> Result<(PathBuf, String)> {
        let r = self.sessions.record(id)?;
        let base = match r.isolation {
            Isolation::Worktree => r.base_sha.unwrap_or_else(|| "HEAD".into()),
            Isolation::InPlace => "HEAD".into(),
        };
        Ok((PathBuf::from(r.cwd), base))
    }

    pub async fn status(&self, id: &str) -> Result<Vec<FileChange>> {
        let (root, base) = self.folder(id)?;
        Ok(blocking(move || workspace::status(&root, &base)).await??)
    }

    pub async fn file_diff(&self, id: &str, path: &str) -> Result<FileDiff> {
        let (root, base) = self.folder(id)?;
        let path = path.to_string();
        Ok(blocking(move || workspace::file_diff(&root, &base, &path)).await??)
    }

    pub async fn list_dir(&self, id: &str, path: &str) -> Result<Vec<DirEntry>> {
        let (root, _) = self.folder(id)?;
        let path = path.to_string();
        Ok(blocking(move || workspace::list_dir(&root, &path)).await??)
    }

    pub async fn read_file(&self, id: &str, path: &str) -> Result<FileContent> {
        let (root, _) = self.folder(id)?;
        let path = path.to_string();
        Ok(blocking(move || workspace::read_file(&root, &path)).await??)
    }

    /// Watch a session's folder while the UI shows it (one watcher per open session).
    pub fn watch(&self, id: &str, on: bool) -> Result<()> {
        if !on {
            self.watchers.lock().remove(id);
            return Ok(());
        }
        if self.watchers.lock().contains_key(id) {
            return Ok(());
        }
        let (root, _) = self.folder(id)?;
        if !root.exists() {
            return Ok(());
        }
        let core = self.core.clone();
        let key = id.to_string();
        let w = workspace::watch(&root, move |paths| changed(&core, &key, paths))?;
        self.watchers.lock().insert(id.to_string(), w);
        Ok(())
    }

    pub fn term_open(&self, id: &str, cols: u16, rows: u16) -> Result<TermAttach> {
        let (root, _) = self.folder(id)?;
        let cwd = if root.exists() {
            root
        } else {
            std::env::var("HOME").map(PathBuf::from).unwrap_or(root)
        };
        let core = self.core.clone();
        let terminals = Arc::downgrade(&self.terminals);
        self.terminals.open(id, &cwd, cols, rows, move |ev| {
            if ev.exited {
                if let Some(t) = terminals.upgrade() {
                    t.reap(&ev.session);
                }
            }
            core.emit("term", &ev);
        })
    }

    pub fn term_write(&self, id: &str, data: &str) -> Result<()> {
        self.terminals.write(id, data)
    }

    pub fn term_resize(&self, id: &str, cols: u16, rows: u16) -> Result<()> {
        self.terminals.resize(id, cols, rows)
    }

    pub fn term_close(&self, id: &str) {
        self.terminals.close(id)
    }

    /// Remote, branch and PR for a session's folder (cached for a minute).
    pub async fn git_info(&self, id: &str, refresh: bool) -> Result<GitInfo> {
        if !refresh {
            if let Some((at, info)) = self.git_cache.lock().get(id) {
                if at.elapsed() < GIT_TTL {
                    return Ok(info.clone());
                }
            }
        }
        let (root, _) = self.folder(id)?;
        let info = blocking(move || git_info::info(&root)).await?;
        self.git_cache
            .lock()
            .insert(id.to_string(), (Instant::now(), info.clone()));
        Ok(info)
    }

    /// Drop everything held for a session that stopped.
    pub fn forget(&self, id: &str) {
        self.terminals.close(id);
        self.watchers.lock().remove(id);
        self.git_cache.lock().remove(id);
    }
}

/// Tell the UI files in a session's folder changed (`paths` empty: unknown).
pub(super) fn changed(core: &Core, id: &str, paths: Vec<String>) {
    core.emit(
        "workspace",
        &WorkspaceEvent {
            session: id.to_string(),
            paths,
        },
    );
}
