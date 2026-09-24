//! The app's state: projects, sessions, live agent actors, the agent list.
//! Commands in `main.rs` are thin wrappers over this; it is also the actors'
//! [`Sink`], fanning their output to the EventBus and the store.

use std::collections::{HashMap, HashSet, VecDeque};
use std::path::{Path, PathBuf};
use std::sync::Arc;

use elyra::EventBus;
use parking_lot::Mutex;
use serde::{Deserialize, Serialize};
use tokio::sync::{mpsc, OnceCell};

use crate::acp::actor::{self, SessionCmd, SessionSpec, Sink, Status};
use crate::acp::map::Change;
use crate::acp::model::{Entry, SessionMeta};
use crate::acp::transport::Dir;
use crate::agents::customize::{self, CommandFile, Doc, McpList, Skill};
use crate::agents::detect::{self, AgentStatus};
use crate::agents::{probe, registry};
use crate::git_info::{self, GitInfo};
use crate::store::{self, Isolation, Project, SessionRecord, Store};
use crate::terminal::{TermAttach, Terminals};
use crate::workspace::{self, DirEntry, FileChange, FileContent, FileDiff};
use crate::worktree;

/// A session as the UI sees it: the stored record plus live state.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, specta::Type)]
pub struct SessionView {
    #[serde(flatten)]
    pub record: SessionRecord,
    pub status: Status,
    pub detail: Option<String>,
    pub meta: SessionMeta,
}

/// Pushed on `transcript`: one flush worth of changes for one session.
#[derive(Clone, Debug, Serialize, Deserialize, specta::Type)]
pub struct TranscriptEvent {
    pub session: String,
    pub changes: Vec<Change>,
}

/// A transcript with per-entry versions, for (re)syncing the frontend.
#[derive(Clone, Debug, Default, Serialize, Deserialize, specta::Type)]
pub struct TranscriptSnapshot {
    pub entries: Vec<Entry>,
    pub versions: Vec<u32>,
}

#[derive(Clone, Debug, Serialize, Deserialize, specta::Type)]
pub struct RpcLine {
    pub session: String,
    pub dir: Dir,
    /// Seconds since the epoch.
    pub at: f64,
    pub line: String,
}

/// Pushed on `workspace` when files in a session's folder probably changed.
#[derive(Clone, Debug, Serialize, Deserialize, specta::Type)]
pub struct WorkspaceEvent {
    pub session: String,
    pub paths: Vec<String>,
}

const RPC_KEEP: usize = 5_000;

struct Live {
    tx: mpsc::UnboundedSender<SessionCmd>,
    status: Status,
    detail: Option<String>,
    meta: SessionMeta,
}

pub struct Hub {
    data_dir: PathBuf,
    bus: EventBus,
    store: OnceCell<Store>,
    records: Mutex<HashMap<String, SessionRecord>>,
    live: Mutex<HashMap<String, Live>>,
    mirrors: Mutex<HashMap<String, TranscriptSnapshot>>,
    agents: Mutex<Vec<AgentStatus>>,
    rpc: Mutex<HashMap<String, VecDeque<RpcLine>>>,
    watching_rpc: Mutex<HashSet<String>>,
    watchers: Mutex<HashMap<String, workspace::Watcher>>,
    terminals: Terminals,
    git_cache: Mutex<HashMap<String, (std::time::Instant, GitInfo)>>,
    /// Sessions whose title Splash chose (not the user), so an agent-reported
    /// title may replace it.
    auto_titled: Mutex<HashSet<String>>,
    me: Mutex<Option<std::sync::Weak<Hub>>>,
}

impl Hub {
    pub fn new(data_dir: PathBuf, bus: EventBus) -> Arc<Self> {
        let hub = Arc::new(Self {
            data_dir,
            bus,
            store: OnceCell::new(),
            records: Mutex::default(),
            live: Mutex::default(),
            mirrors: Mutex::default(),
            agents: Mutex::default(),
            rpc: Mutex::default(),
            watching_rpc: Mutex::default(),
            watchers: Mutex::default(),
            terminals: Terminals::default(),
            git_cache: Mutex::default(),
            auto_titled: Mutex::default(),
            me: Mutex::new(None),
        });
        *hub.me.lock() = Some(Arc::downgrade(&hub));
        hub
    }

    fn arc(&self) -> Arc<Hub> {
        self.me
            .lock()
            .as_ref()
            .and_then(|w| w.upgrade())
            .expect("hub alive")
    }

    /// The store, opened (and migrated) on first use — on Elyra's runtime,
    /// where its writer task can live.
    pub async fn store(&self) -> Result<&Store, String> {
        self.store
            .get_or_try_init(|| async {
                let store = Store::open(&self.data_dir.join("splash.db")).await?;
                let sessions = store.sessions().await?;
                let mut records = self.records.lock();
                for r in sessions {
                    records.insert(r.id.clone(), r);
                }
                drop(records);
                Ok::<_, String>(store)
            })
            .await
    }

    // ── agents ─────────────────────────────────────────────────────────────

    pub async fn agents(&self, refresh: bool) -> Result<Vec<AgentStatus>, String> {
        if !refresh && !self.agents.lock().is_empty() {
            return Ok(self.agents.lock().clone());
        }
        let store = self.store().await?;
        let mut list = detect::detect_all().await;
        let probes: HashMap<String, String> = store.probes().await?.into_iter().collect();
        for a in &mut list {
            a.probe = probes.get(&a.id).and_then(|j| serde_json::from_str(j).ok());
            a.extra_args = store.extra_args(&a.id).await.unwrap_or_default();
        }
        *self.agents.lock() = list.clone();
        Ok(list)
    }

    pub async fn probe(&self, agent_id: &str) -> Result<AgentStatus, String> {
        let spec = registry::find(agent_id).ok_or("unknown agent")?;
        let store = self.store().await?;
        let extra = split_args(&store.extra_args(agent_id).await?);
        let result = probe::probe(spec, &extra).await;
        store
            .save_probe(
                agent_id,
                &serde_json::to_string(&result).unwrap_or_default(),
            )
            .await?;
        let mut status = detect::detect(spec).await;
        status.probe = Some(result);
        status.extra_args = extra.join(" ");
        self.replace_agent(status.clone());
        Ok(status)
    }

    pub async fn set_agent_args(&self, agent_id: &str, args: &str) -> Result<AgentStatus, String> {
        self.store()
            .await?
            .set_extra_args(agent_id, args.trim())
            .await?;
        let mut list = self.agents(false).await?;
        let a = list
            .iter_mut()
            .find(|a| a.id == agent_id)
            .ok_or("unknown agent")?;
        a.extra_args = args.trim().to_string();
        let a = a.clone();
        self.replace_agent(a.clone());
        Ok(a)
    }

    fn replace_agent(&self, status: AgentStatus) {
        let mut agents = self.agents.lock();
        match agents.iter_mut().find(|a| a.id == status.id) {
            Some(a) => *a = status.clone(),
            None => agents.push(status.clone()),
        }
        let _ = self.bus.emit("agents", &status);
    }

    // ── projects ───────────────────────────────────────────────────────────

    pub async fn projects(&self) -> Result<Vec<Project>, String> {
        self.store().await?.projects().await
    }

    pub async fn add_project(&self, path: &str) -> Result<Project, String> {
        let path = PathBuf::from(path);
        let path = path
            .canonicalize()
            .map_err(|e| format!("{}: {e}", path.display()))?;
        if !path.is_dir() {
            return Err(format!("not a folder: {}", path.display()));
        }
        let name = path
            .file_name()
            .map(|n| n.to_string_lossy().into_owned())
            .unwrap_or_else(|| "project".into());
        let is_git = worktree::is_git(&path);
        if is_git {
            worktree::prune(&path);
        }
        let project = self
            .store()
            .await?
            .add_project(&path.to_string_lossy(), &name, is_git)
            .await?;
        let _ = self.bus.emit("project", &project);
        Ok(project)
    }

    pub async fn remove_project(&self, id: &str) -> Result<(), String> {
        let ids: Vec<String> = self
            .records
            .lock()
            .values()
            .filter(|r| r.project_id == id)
            .map(|r| r.id.clone())
            .collect();
        for sid in ids {
            self.stop(&sid);
            self.records.lock().remove(&sid);
        }
        self.store().await?.remove_project(id).await
    }

    // ── sessions ───────────────────────────────────────────────────────────

    pub async fn sessions(&self) -> Result<Vec<SessionView>, String> {
        self.store().await?;
        let mut records: Vec<SessionRecord> = self.records.lock().values().cloned().collect();
        records.sort_by(|a, b| b.created_at.total_cmp(&a.created_at));
        Ok(records.into_iter().map(|r| self.view(r)).collect())
    }

    fn view(&self, record: SessionRecord) -> SessionView {
        let live = self.live.lock();
        let mut view = match live.get(&record.id) {
            Some(l) => SessionView {
                status: l.status,
                detail: l.detail.clone(),
                meta: l.meta.clone(),
                record,
            },
            None => SessionView {
                status: Status::Exited,
                detail: None,
                meta: SessionMeta::default(),
                record,
            },
        };
        // Until the agent reports again, show what it last said.
        if view.meta.usage.is_none() {
            view.meta.usage = view.record.usage.clone();
        }
        view
    }

    fn emit_session(&self, id: &str) {
        let record = self.records.lock().get(id).cloned();
        if let Some(r) = record {
            let _ = self.bus.emit("session", &self.view(r));
        }
    }

    pub async fn create_session(
        &self,
        project_id: &str,
        agent_id: &str,
        isolation: Isolation,
        title: Option<String>,
    ) -> Result<SessionView, String> {
        let store = self.store().await?;
        let project = store.project(project_id).await?;
        registry::find(agent_id).ok_or("unknown agent")?;
        let id = store::new_id("s");
        let title = title
            .filter(|t| !t.trim().is_empty())
            .unwrap_or_else(|| "New session".into());
        let repo = PathBuf::from(&project.path);

        let (cwd, branch, base_sha) = match isolation {
            Isolation::InPlace => (
                project.path.clone(),
                worktree::current_branch(&repo),
                worktree::head_sha(&repo),
            ),
            Isolation::Worktree => {
                if !project.is_git {
                    return Err("worktrees need a git repository".into());
                }
                let short = &id[2..8];
                let slug = worktree::slug(
                    if title == "New session" {
                        agent_id
                    } else {
                        &title
                    },
                    32,
                );
                let dest = self
                    .data_dir
                    .join("worktrees")
                    .join(worktree::slug(&project.name, 40))
                    .join(&id);
                let created = worktree::create(&repo, &dest, &format!("splash/{slug}-{short}"))?;
                (
                    created.path.to_string_lossy().into_owned(),
                    Some(created.branch),
                    Some(created.base_sha),
                )
            }
        };
        let now = store::now();
        let record = SessionRecord {
            id: id.clone(),
            project_id: project.id,
            agent_id: agent_id.into(),
            title,
            cwd,
            isolation,
            branch,
            base_sha,
            agent_session_id: None,
            archived: false,
            created_at: now,
            updated_at: now,
            usage: None,
        };
        store.insert_session(&record).await?;
        if record.title == "New session" {
            self.auto_titled.lock().insert(id.clone());
        }
        self.records.lock().insert(id.clone(), record.clone());
        self.mirrors
            .lock()
            .insert(id.clone(), TranscriptSnapshot::default());
        self.ensure_live(&id).await?;
        Ok(self.view(record))
    }

    /// Start the agent for a session if it isn't running (resuming if we can).
    pub async fn ensure_live(&self, id: &str) -> Result<(), String> {
        if self.live.lock().contains_key(id) {
            return Ok(());
        }
        let store = self.store().await?;
        let record = self
            .records
            .lock()
            .get(id)
            .cloned()
            .ok_or("no such session")?;
        let agent = registry::find(&record.agent_id).ok_or("unknown agent")?;
        let history = store.entries(id).await?;
        let extra = split_args(&store.extra_args(agent.id).await.unwrap_or_default());
        {
            let mut mirrors = self.mirrors.lock();
            mirrors.insert(
                id.to_string(),
                TranscriptSnapshot {
                    versions: vec![1; history.len()],
                    entries: history.clone(),
                },
            );
        }
        let spec = SessionSpec {
            key: id.to_string(),
            agent,
            cwd: PathBuf::from(&record.cwd),
            extra_args: extra,
            resume: record.agent_session_id.clone(),
            history,
        };
        // Register before starting, so the actor's first status finds the entry.
        let (placeholder, _) = mpsc::unbounded_channel();
        self.live.lock().insert(
            id.to_string(),
            Live {
                tx: placeholder,
                status: Status::Starting,
                detail: None,
                meta: SessionMeta::default(),
            },
        );
        let tx = actor::start(spec, self.arc() as Arc<dyn Sink>);
        if let Some(l) = self.live.lock().get_mut(id) {
            l.tx = tx;
        }
        self.emit_session(id);
        Ok(())
    }

    pub async fn open_session(&self, id: &str) -> Result<TranscriptSnapshot, String> {
        self.store().await?;
        if !self.mirrors.lock().contains_key(id) {
            let entries = self.store().await?.entries(id).await?;
            self.mirrors.lock().insert(
                id.to_string(),
                TranscriptSnapshot {
                    versions: vec![1; entries.len()],
                    entries,
                },
            );
        }
        Ok(self.mirrors.lock().get(id).cloned().unwrap_or_default())
    }

    fn send(&self, id: &str, cmd: SessionCmd) -> Result<(), String> {
        let live = self.live.lock();
        let l = live.get(id).ok_or("the session isn't running")?;
        l.tx.send(cmd)
            .map_err(|_| "the session has stopped".to_string())
    }

    pub async fn prompt(&self, id: &str, text: &str) -> Result<(), String> {
        let text = text.trim();
        if text.is_empty() {
            return Ok(());
        }
        let exited = self
            .live
            .lock()
            .get(id)
            .map(|l| matches!(l.status, Status::Exited | Status::Error))
            .unwrap_or(true);
        if exited {
            self.live.lock().remove(id);
            self.ensure_live(id).await?;
        }
        // Name the session after its first prompt.
        let rename = self
            .records
            .lock()
            .get(id)
            .is_some_and(|r| r.title == "New session");
        if rename {
            let title: String = text.lines().next().unwrap_or("").chars().take(60).collect();
            self.store().await?.set_title(id, &title).await?;
            if let Some(r) = self.records.lock().get_mut(id) {
                r.title = title;
            }
            self.emit_session(id);
        }
        self.send(id, SessionCmd::Prompt(text.to_string()))
    }

    pub fn cancel(&self, id: &str) -> Result<(), String> {
        self.send(id, SessionCmd::Cancel)
    }

    pub fn resolve_permission(
        &self,
        id: &str,
        request_id: &str,
        option_id: Option<String>,
    ) -> Result<(), String> {
        self.send(
            id,
            SessionCmd::ResolvePermission {
                request_id: request_id.into(),
                option_id,
            },
        )
    }

    pub fn set_option(&self, id: &str, option: &str, value: &str) -> Result<(), String> {
        self.send(
            id,
            SessionCmd::SetOption {
                id: option.into(),
                value: value.into(),
            },
        )
    }

    /// Retitle a session Splash named itself (queued write; no-op if unchanged).
    fn set_auto_title(&self, id: &str, title: &str) {
        let title = title.trim();
        if title.is_empty() || !self.auto_titled.lock().contains(id) {
            return;
        }
        {
            let mut records = self.records.lock();
            let Some(r) = records.get_mut(id) else { return };
            if r.title == title {
                return;
            }
            r.title = title.to_string();
        }
        if let Some(store) = self.store.get().cloned() {
            let (id2, t) = (id.to_string(), title.to_string());
            tokio::spawn(async move {
                let _ = store.set_title(&id2, &t).await;
            });
        }
        self.emit_session(id);
    }

    pub async fn rename(&self, id: &str, title: &str) -> Result<(), String> {
        self.auto_titled.lock().remove(id);
        self.store().await?.set_title(id, title.trim()).await?;
        if let Some(r) = self.records.lock().get_mut(id) {
            r.title = title.trim().to_string();
        }
        self.emit_session(id);
        Ok(())
    }

    fn stop(&self, id: &str) {
        if let Some(l) = self.live.lock().remove(id) {
            let _ = l.tx.send(SessionCmd::Shutdown);
        }
        self.terminals.close(id);
        self.watchers.lock().remove(id);
    }

    /// Stop the agent and, for worktree sessions, remove the worktree (the
    /// branch stays). Refuses a dirty worktree unless `force`.
    pub async fn archive(&self, id: &str, force: bool) -> Result<(), String> {
        let record = self
            .records
            .lock()
            .get(id)
            .cloned()
            .ok_or("no such session")?;
        if record.isolation == Isolation::Worktree {
            let dir = Path::new(&record.cwd);
            if dir.exists() {
                if !force && worktree::is_dirty(dir) {
                    return Err("dirty".into());
                }
                let project = self.store().await?.project(&record.project_id).await?;
                self.stop(id);
                worktree::remove(Path::new(&project.path), dir, force)?;
            }
        }
        self.stop(id);
        self.store().await?.set_archived(id, true).await?;
        if let Some(r) = self.records.lock().get_mut(id) {
            r.archived = true;
        }
        self.emit_session(id);
        Ok(())
    }

    pub async fn delete(&self, id: &str) -> Result<(), String> {
        let record = self.records.lock().get(id).cloned();
        if let Some(r) = &record {
            if r.isolation == Isolation::Worktree && Path::new(&r.cwd).exists() {
                self.archive(id, true).await?;
            }
        }
        self.stop(id);
        self.store().await?.delete_session(id).await?;
        self.records.lock().remove(id);
        self.mirrors.lock().remove(id);
        self.rpc.lock().remove(id);
        Ok(())
    }

    // ── raw JSON-RPC log ───────────────────────────────────────────────────

    pub fn rpc_log(&self, id: &str) -> Vec<RpcLine> {
        self.rpc
            .lock()
            .get(id)
            .map(|q| q.iter().cloned().collect())
            .unwrap_or_default()
    }

    pub fn watch_rpc(&self, id: &str, on: bool) {
        let mut w = self.watching_rpc.lock();
        if on {
            w.insert(id.to_string());
        } else {
            w.remove(id);
        }
    }

    // ── workspace ──────────────────────────────────────────────────────────

    /// The session folder and the commit its changes are measured against.
    fn workspace_of(&self, id: &str) -> Result<(PathBuf, String), String> {
        let r = self
            .records
            .lock()
            .get(id)
            .cloned()
            .ok_or("no such session")?;
        let base = match r.isolation {
            Isolation::Worktree => r.base_sha.unwrap_or_else(|| "HEAD".into()),
            Isolation::InPlace => "HEAD".into(),
        };
        Ok((PathBuf::from(r.cwd), base))
    }

    pub async fn workspace_status(&self, id: &str) -> Result<Vec<FileChange>, String> {
        let (root, base) = self.workspace_of(id)?;
        tokio::task::spawn_blocking(move || workspace::status(&root, &base))
            .await
            .map_err(|e| e.to_string())?
    }

    pub async fn file_diff(&self, id: &str, path: &str) -> Result<FileDiff, String> {
        let (root, base) = self.workspace_of(id)?;
        let path = path.to_string();
        tokio::task::spawn_blocking(move || workspace::file_diff(&root, &base, &path))
            .await
            .map_err(|e| e.to_string())?
    }

    pub async fn list_dir(&self, id: &str, path: &str) -> Result<Vec<DirEntry>, String> {
        let (root, _) = self.workspace_of(id)?;
        let path = path.to_string();
        tokio::task::spawn_blocking(move || workspace::list_dir(&root, &path))
            .await
            .map_err(|e| e.to_string())?
    }

    pub async fn read_file(&self, id: &str, path: &str) -> Result<FileContent, String> {
        let (root, _) = self.workspace_of(id)?;
        let path = path.to_string();
        tokio::task::spawn_blocking(move || workspace::read_file(&root, &path))
            .await
            .map_err(|e| e.to_string())?
    }

    /// Watch a session's folder while the UI shows it (one watcher per open session).
    pub fn watch_workspace(&self, id: &str, on: bool) -> Result<(), String> {
        if !on {
            self.watchers.lock().remove(id);
            return Ok(());
        }
        if self.watchers.lock().contains_key(id) {
            return Ok(());
        }
        let (root, _) = self.workspace_of(id)?;
        if !root.exists() {
            return Ok(());
        }
        let hub = std::sync::Arc::downgrade(&self.arc());
        let key = id.to_string();
        let w = workspace::watch(&root, move |paths| {
            if let Some(hub) = hub.upgrade() {
                hub.emit_workspace(&key, paths);
            }
        })?;
        self.watchers.lock().insert(id.to_string(), w);
        Ok(())
    }

    // ── terminal ───────────────────────────────────────────────────────────

    pub fn term_open(&self, id: &str, cols: u16, rows: u16) -> Result<TermAttach, String> {
        let (root, _) = self.workspace_of(id)?;
        let cwd = if root.exists() {
            root
        } else {
            std::env::var("HOME").map(PathBuf::from).unwrap_or(root)
        };
        let hub = std::sync::Arc::downgrade(&self.arc());
        self.terminals.open(id, &cwd, cols, rows, move |ev| {
            if let Some(hub) = hub.upgrade() {
                if ev.exited {
                    hub.terminals.reap(&ev.session);
                }
                let _ = hub.bus.emit("term", &ev);
            }
        })
    }

    pub fn term_write(&self, id: &str, data: &str) -> Result<(), String> {
        self.terminals.write(id, data)
    }

    pub fn term_resize(&self, id: &str, cols: u16, rows: u16) -> Result<(), String> {
        self.terminals.resize(id, cols, rows)
    }

    pub fn term_close(&self, id: &str) {
        self.terminals.close(id)
    }

    // ── settings & customisation ───────────────────────────────────────────

    pub async fn settings(&self) -> Result<std::collections::BTreeMap<String, String>, String> {
        let mut s = self.store().await?.settings().await?;
        s.insert("data_dir".into(), self.data_dir.display().to_string());
        s.insert(
            "worktrees_dir".into(),
            self.data_dir.join("worktrees").display().to_string(),
        );
        Ok(s)
    }

    pub async fn set_setting(&self, key: &str, value: &str) -> Result<(), String> {
        self.store().await?.set_setting(key, value).await
    }

    pub async fn skills(&self) -> Result<Vec<Skill>, String> {
        let home = PathBuf::from(std::env::var("HOME").unwrap_or_default());
        let projects: Vec<(String, PathBuf)> = self
            .projects()
            .await?
            .into_iter()
            .map(|p| (p.name, PathBuf::from(p.path)))
            .collect();
        tokio::task::spawn_blocking(move || customize::skills(&home, &projects))
            .await
            .map_err(|e| e.to_string())
    }

    async fn skill_context(&self) -> Result<(PathBuf, Vec<(String, PathBuf)>), String> {
        let home = PathBuf::from(std::env::var("HOME").unwrap_or_default());
        let projects = self
            .projects()
            .await?
            .into_iter()
            .map(|p| (p.name, PathBuf::from(p.path)))
            .collect();
        Ok((home, projects))
    }

    pub async fn command_files(&self) -> Result<Vec<CommandFile>, String> {
        let (home, projects) = self.skill_context().await?;
        tokio::task::spawn_blocking(move || customize::command_files(&home, &projects))
            .await
            .map_err(|e| e.to_string())
    }

    pub async fn read_doc(&self, path: &str) -> Result<Doc, String> {
        let (home, projects) = self.skill_context().await?;
        let path = path.to_string();
        tokio::task::spawn_blocking(move || customize::read_doc(&home, &projects, &path))
            .await
            .map_err(|e| e.to_string())?
    }

    pub async fn mcp_servers(&self) -> Result<McpList, String> {
        let home = PathBuf::from(std::env::var("HOME").unwrap_or_default());
        tokio::task::spawn_blocking(move || customize::mcp_servers(&home))
            .await
            .map_err(|e| e.to_string())
    }

    /// Remote, branch and PR for a session's folder (cached for a minute).
    pub async fn git_info(&self, id: &str, refresh: bool) -> Result<GitInfo, String> {
        if !refresh {
            if let Some((at, info)) = self.git_cache.lock().get(id) {
                if at.elapsed() < std::time::Duration::from_secs(60) {
                    return Ok(info.clone());
                }
            }
        }
        let (root, _) = self.workspace_of(id)?;
        let info = tokio::task::spawn_blocking(move || git_info::info(&root))
            .await
            .map_err(|e| e.to_string())?;
        self.git_cache
            .lock()
            .insert(id.to_string(), (std::time::Instant::now(), info.clone()));
        Ok(info)
    }

    pub fn record(&self, id: &str) -> Option<SessionRecord> {
        self.records.lock().get(id).cloned()
    }

    pub fn emit_workspace(&self, id: &str, paths: Vec<String>) {
        let _ = self.bus.emit(
            "workspace",
            &WorkspaceEvent {
                session: id.to_string(),
                paths,
            },
        );
    }
}

impl Sink for Hub {
    fn changes(&self, key: &str, changes: Vec<Change>) {
        {
            let mut mirrors = self.mirrors.lock();
            let m = mirrors.entry(key.to_string()).or_default();
            for c in &changes {
                match c {
                    Change::Upsert {
                        index,
                        version,
                        entry,
                    } => {
                        let i = *index as usize;
                        while m.entries.len() <= i {
                            m.entries.push(Entry::Divider {
                                text: String::new(),
                            });
                            m.versions.push(0);
                        }
                        if *version > m.versions[i] {
                            m.entries[i] = entry.clone();
                            m.versions[i] = *version;
                        }
                    }
                    Change::AppendText {
                        index,
                        version,
                        delta,
                    } => {
                        let i = *index as usize;
                        if let Some(Entry::Agent { text, .. } | Entry::Thought { text, .. }) =
                            m.entries.get_mut(i)
                        {
                            if m.versions[i] + 1 == *version {
                                text.push_str(delta);
                                m.versions[i] = *version;
                            }
                        }
                    }
                }
            }
        }
        let _ = self.bus.emit(
            "transcript",
            &TranscriptEvent {
                session: key.to_string(),
                changes,
            },
        );
    }

    fn status(&self, key: &str, status: Status, detail: Option<&str>, meta: &SessionMeta) {
        {
            let mut live = self.live.lock();
            let Some(l) = live.get_mut(key) else { return };
            l.status = status;
            l.detail = detail.map(String::from);
            // An exiting actor reports empty meta; keep the last known pickers.
            if status != Status::Exited || meta != &SessionMeta::default() {
                l.meta = meta.clone();
            }
        }
        // An agent-generated name beats ours.
        if let Some(t) = &meta.title {
            self.set_auto_title(key, &short_title(t));
        }
        if let Some(usage) = &meta.usage {
            let changed = {
                let mut records = self.records.lock();
                match records.get_mut(key) {
                    Some(r) if r.usage.as_ref() != Some(usage) => {
                        r.usage = Some(usage.clone());
                        true
                    }
                    _ => false,
                }
            };
            if changed {
                if let Some(store) = self.store.get() {
                    store.queue_usage(key, usage);
                }
            }
        }
        self.emit_session(key);
    }

    fn persist(&self, key: &str, entries: Vec<(usize, Entry)>) {
        if let Some(store) = self.store.get() {
            store.queue_entries(key, entries);
        }
    }

    fn agent_session(&self, key: &str, agent_session_id: &str) {
        if let Some(store) = self.store.get() {
            store.queue_agent_session(key, agent_session_id);
        }
        if let Some(r) = self.records.lock().get_mut(key) {
            r.agent_session_id = Some(agent_session_id.to_string());
        }
    }

    fn rpc(&self, key: &str, dir: Dir, line: &str) {
        let entry = RpcLine {
            session: key.to_string(),
            dir,
            at: store::now(),
            line: line.to_string(),
        };
        {
            let mut rpc = self.rpc.lock();
            let q = rpc.entry(key.to_string()).or_default();
            if q.len() == RPC_KEEP {
                q.pop_front();
            }
            q.push_back(entry.clone());
        }
        if self.watching_rpc.lock().contains(key) {
            let _ = self.bus.emit("rpc", &entry);
        }
    }

    fn workspace_dirty(&self, key: &str) {
        self.emit_workspace(key, Vec::new());
    }
}

/// A session name from free text: the first sentence of the first line, cut
/// at a word boundary to about 56 characters.
pub fn short_title(text: &str) -> String {
    let line = text.lines().map(str::trim).find(|l| !l.is_empty()).unwrap_or("");
    let sentence = line
        .char_indices()
        .find(|&(i, c)| matches!(c, '.' | '?' | '!') && line[i + c.len_utf8()..].starts_with(' '))
        .map(|(i, _)| &line[..i])
        .unwrap_or(line);
    let mut out = String::new();
    for word in sentence.split_whitespace() {
        if !out.is_empty() && out.chars().count() + 1 + word.chars().count() > 56 {
            out.push('…');
            break;
        }
        if !out.is_empty() {
            out.push(' ');
        }
        out.push_str(word);
    }
    out.trim_end_matches(|c: char| matches!(c, '.' | ',' | ':' | ';')).to_string()
}

#[cfg(test)]
mod tests {
    use super::short_title;

    #[test]
    fn titles_are_the_first_sentence_cut_at_a_word() {
        assert_eq!(short_title("Read calc.py, explain the bug in one sentence, then fix it."), "Read calc.py, explain the bug in one sentence, then fix…");
        assert_eq!(short_title("Fix the login redirect. Then run the tests."), "Fix the login redirect");
        assert_eq!(short_title("\n  what does main.rs do?\nmore"), "what does main.rs do?");
        assert_eq!(short_title("Short one"), "Short one");
    }
}

fn split_args(s: &str) -> Vec<String> {
    s.split_whitespace().map(String::from).collect()
}
