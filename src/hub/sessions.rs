//! Projects and sessions: the stored records, the live agent actors and a
//! mirror of each transcript. It is also the actors' [`Sink`], fanning their
//! output to the EventBus and the store.

use std::collections::{HashMap, HashSet, VecDeque};
use std::path::{Path, PathBuf};
use std::sync::{Arc, OnceLock};

use parking_lot::Mutex;
use serde::{Deserialize, Serialize};
use tokio::sync::{mpsc, OnceCell};

use super::{blocking, split_args, warm_env, workspace, Core, Error, Result};
use crate::acp::actor::{self, SessionCmd, SessionSpec, Sink, Status};
use crate::acp::map::{Change, TranscriptSnapshot};
use crate::acp::model::{Entry, SessionMeta};
use crate::acp::transport::Dir;
use crate::git;
use crate::store::{self, Isolation, Project, SessionRecord, Store};
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

#[derive(Clone, Debug, Serialize, Deserialize, specta::Type)]
pub struct RpcLine {
    pub session: String,
    pub dir: Dir,
    /// Seconds since the epoch.
    pub at: f64,
    pub line: String,
}

const RPC_KEEP: usize = 5_000;

/// The placeholder title a session has until it gets a real one.
const NEW_SESSION: &str = "New session";

struct Live {
    tx: mpsc::UnboundedSender<SessionCmd>,
    status: Status,
    detail: Option<String>,
    meta: SessionMeta,
}

type OnStop = Box<dyn Fn(&str) + Send + Sync>;

pub struct Sessions {
    core: Arc<Core>,
    /// Set once `records` holds what the store has.
    loaded: OnceCell<()>,
    records: Mutex<HashMap<String, SessionRecord>>,
    live: Mutex<HashMap<String, Live>>,
    mirrors: Mutex<HashMap<String, TranscriptSnapshot>>,
    rpc: Mutex<HashMap<String, VecDeque<RpcLine>>>,
    watching_rpc: Mutex<HashSet<String>>,
    /// Sessions whose title Splash chose (not the user), so an agent-reported
    /// title may replace it.
    auto_titled: Mutex<HashSet<String>>,
    on_stop: OnceLock<OnStop>,
}

impl Sessions {
    pub fn new(core: Arc<Core>) -> Self {
        Self {
            core,
            loaded: OnceCell::new(),
            records: Mutex::default(),
            live: Mutex::default(),
            mirrors: Mutex::default(),
            rpc: Mutex::default(),
            watching_rpc: Mutex::default(),
            auto_titled: Mutex::default(),
            on_stop: OnceLock::new(),
        }
    }

    /// Called with a session's id when its agent is stopped.
    pub fn on_stop(&self, f: impl Fn(&str) + Send + Sync + 'static) {
        let _ = self.on_stop.set(Box::new(f));
    }

    /// The store, with the stored sessions loaded on first use.
    async fn store(&self) -> Result<&Store> {
        let store = self.core.store().await?;
        self.loaded
            .get_or_try_init(|| async {
                let sessions = store.sessions().await?;
                let mut records = self.records.lock();
                let mut auto = self.auto_titled.lock();
                for r in sessions {
                    // Still unnamed: an agent-reported title may replace it.
                    if r.title == NEW_SESSION {
                        auto.insert(r.id.clone());
                    }
                    records.insert(r.id.clone(), r);
                }
                Ok::<_, Error>(())
            })
            .await?;
        Ok(store)
    }

    // ── projects ───────────────────────────────────────────────────────────

    pub async fn projects(&self) -> Result<Vec<Project>> {
        self.store().await?.projects().await
    }

    pub async fn add_project(&self, path: &str) -> Result<Project> {
        let path = PathBuf::from(path);
        let path = path
            .canonicalize()
            .map_err(|e| Error::Io(format!("{}: {e}", path.display())))?;
        if !path.is_dir() {
            return Err(Error::Io(format!("not a folder: {}", path.display())));
        }
        let name = path
            .file_name()
            .map(|n| n.to_string_lossy().into_owned())
            .unwrap_or_else(|| "project".into());
        let repo = path.clone();
        let is_git = blocking(move || {
            let is_git = git::is_git(&repo);
            if is_git {
                git::prune(&repo);
            }
            is_git
        })
        .await?;
        let project = self
            .store()
            .await?
            .add_project(&path.to_string_lossy(), &name, is_git)
            .await?;
        self.core.emit("project", &project);
        Ok(project)
    }

    pub async fn remove_project(&self, id: &str) -> Result<()> {
        let store = self.store().await?;
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
        store.remove_project(id).await
    }

    // ── sessions ───────────────────────────────────────────────────────────

    pub fn record(&self, id: &str) -> Result<SessionRecord> {
        self.records
            .lock()
            .get(id)
            .cloned()
            .ok_or(Error::NotFound("no such session"))
    }

    /// Change a record in memory and show the UI.
    fn update_record(&self, id: &str, f: impl FnOnce(&mut SessionRecord)) {
        if let Some(r) = self.records.lock().get_mut(id) {
            f(r);
        }
        self.emit(id);
    }

    pub async fn list(&self) -> Result<Vec<SessionView>> {
        self.store().await?;
        let mut records: Vec<SessionRecord> = self.records.lock().values().cloned().collect();
        records.sort_by(|a, b| b.created_at.total_cmp(&a.created_at));
        Ok(records.into_iter().map(|r| self.view(r)).collect())
    }

    fn view(&self, record: SessionRecord) -> SessionView {
        let mut view = match self.live.lock().get(&record.id) {
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

    fn emit(&self, id: &str) {
        if let Ok(r) = self.record(id) {
            self.core.emit("session", &self.view(r));
        }
    }

    pub async fn create(
        self: &Arc<Self>,
        project_id: &str,
        agent_id: &str,
        isolation: Isolation,
        title: Option<String>,
    ) -> Result<SessionView> {
        let store = self.store().await?;
        let project = store.project(project_id).await?;
        self.core.agent(agent_id)?;
        let id = store::new_id("s");
        let title = title
            .filter(|t| !t.trim().is_empty())
            .unwrap_or_else(|| NEW_SESSION.into());
        let repo = PathBuf::from(&project.path);

        let (cwd, branch, base_sha) = match isolation {
            Isolation::InPlace => {
                let (branch, sha) =
                    blocking(move || (git::current_branch(&repo), git::head_sha(&repo))).await?;
                (project.path.clone(), branch, sha)
            }
            Isolation::Worktree => {
                if !project.is_git {
                    return Err(Error::Git("worktrees need a git repository".into()));
                }
                let short = &id[2..8];
                let named = if title == NEW_SESSION {
                    agent_id
                } else {
                    &title
                };
                let branch = format!("splash/{}-{short}", worktree::slug(named, 32));
                let dest = self
                    .core
                    .data_dir
                    .join("worktrees")
                    .join(worktree::slug(&project.name, 40))
                    .join(&id);
                let created = blocking(move || worktree::create(&repo, &dest, &branch)).await??;
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
        if record.title == NEW_SESSION {
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
    pub async fn ensure_live(self: &Arc<Self>, id: &str) -> Result<()> {
        // Claim the slot before any await: two quick opens (or an open and a
        // prompt) must not start two agents. Commands sent meanwhile queue on
        // the real channel and reach the actor once it runs.
        let (tx, rx) = mpsc::unbounded_channel();
        {
            let mut live = self.live.lock();
            if live.contains_key(id) {
                return Ok(());
            }
            live.insert(
                id.to_string(),
                Live {
                    tx,
                    status: Status::Starting,
                    detail: None,
                    meta: SessionMeta::default(),
                },
            );
        }
        let spec = match self.spec(id).await {
            Ok(spec) => spec,
            Err(e) => {
                self.live.lock().remove(id);
                return Err(e);
            }
        };
        actor::start_with(spec, rx, self.clone() as Arc<dyn Sink>);
        self.emit(id);
        Ok(())
    }

    /// Everything an actor needs to (re)start a session, and its mirror reset
    /// to the stored transcript.
    async fn spec(&self, id: &str) -> Result<SessionSpec> {
        warm_env().await;
        let store = self.store().await?;
        let record = self.record(id)?;
        let agent = self.core.agent(&record.agent_id)?;
        let history = store.entries(id).await?;
        let extra = split_args(&store.extra_args(agent.id).await.unwrap_or_default());
        self.mirrors.lock().insert(
            id.to_string(),
            TranscriptSnapshot::from_history(history.clone()),
        );
        Ok(SessionSpec {
            key: id.to_string(),
            agent,
            cwd: PathBuf::from(&record.cwd),
            extra_args: extra,
            resume: record.agent_session_id,
            history,
        })
    }

    /// The transcript to render (the stored one if the agent hasn't run).
    pub async fn transcript(&self, id: &str) -> Result<TranscriptSnapshot> {
        let store = self.store().await?;
        if !self.mirrors.lock().contains_key(id) {
            let entries = store.entries(id).await?;
            self.mirrors
                .lock()
                .insert(id.to_string(), TranscriptSnapshot::from_history(entries));
        }
        Ok(self.mirrors.lock().get(id).cloned().unwrap_or_default())
    }

    fn send(&self, id: &str, cmd: SessionCmd) -> Result<()> {
        let live = self.live.lock();
        let l = live
            .get(id)
            .ok_or(Error::NotFound("the session isn't running"))?;
        l.tx.send(cmd)
            .map_err(|_| Error::Other("the session has stopped".into()))
    }

    pub async fn prompt(self: &Arc<Self>, id: &str, text: &str) -> Result<()> {
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
        // Name the session after its first prompt. The agent's own title
        // replaces it when it sends one.
        let unnamed = self.record(id).is_ok_and(|r| r.title == NEW_SESSION);
        let title = short_title(text);
        if unnamed && !title.is_empty() {
            self.store().await?.set_title(id, &title).await?;
            self.update_record(id, |r| r.title = title);
        }
        self.send(id, SessionCmd::Prompt(text.to_string()))
    }

    pub fn cancel(&self, id: &str) -> Result<()> {
        self.send(id, SessionCmd::Cancel)
    }

    pub fn resolve_permission(
        &self,
        id: &str,
        request_id: &str,
        option_id: Option<String>,
    ) -> Result<()> {
        self.send(
            id,
            SessionCmd::ResolvePermission {
                request_id: request_id.into(),
                option_id,
            },
        )
    }

    pub fn set_option(&self, id: &str, option: &str, value: &str) -> Result<()> {
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
        let changed = self.records.lock().get_mut(id).is_some_and(|r| {
            let changed = r.title != title;
            r.title = title.to_string();
            changed
        });
        if !changed {
            return;
        }
        if let Some(store) = self.core.opened_store().cloned() {
            let (id, title) = (id.to_string(), title.to_string());
            tokio::spawn(async move {
                let _ = store.set_title(&id, &title).await;
            });
        }
        self.emit(id);
    }

    pub async fn rename(&self, id: &str, title: &str) -> Result<()> {
        let title = title.trim();
        self.auto_titled.lock().remove(id);
        self.store().await?.set_title(id, title).await?;
        self.update_record(id, |r| r.title = title.to_string());
        Ok(())
    }

    fn stop(&self, id: &str) {
        if let Some(l) = self.live.lock().remove(id) {
            let _ = l.tx.send(SessionCmd::Shutdown);
        }
        if let Some(f) = self.on_stop.get() {
            f(id);
        }
    }

    /// Stop the agent and, for worktree sessions, remove the worktree (the
    /// branch stays). Refuses a dirty worktree unless `force`.
    pub async fn archive(&self, id: &str, force: bool) -> Result<()> {
        let record = self.record(id)?;
        self.remove_worktree(&record, force).await?;
        self.stop(id);
        self.store().await?.set_archived(id, true).await?;
        self.update_record(id, |r| r.archived = true);
        Ok(())
    }

    pub async fn delete(&self, id: &str) -> Result<()> {
        if let Ok(record) = self.record(id) {
            self.remove_worktree(&record, true).await?;
        }
        self.stop(id);
        self.store().await?.delete_session(id).await?;
        self.records.lock().remove(id);
        self.mirrors.lock().remove(id);
        self.rpc.lock().remove(id);
        self.auto_titled.lock().remove(id);
        Ok(())
    }

    /// For worktree sessions: stop the agent and remove the worktree (the
    /// branch stays). A dirty worktree needs `force`; without it the error is
    /// "dirty", which the UI turns into a confirmation.
    async fn remove_worktree(&self, record: &SessionRecord, force: bool) -> Result<()> {
        if record.isolation != Isolation::Worktree || !Path::new(&record.cwd).exists() {
            return Ok(());
        }
        let dir = PathBuf::from(&record.cwd);
        let d = dir.clone();
        if !force && blocking(move || git::is_dirty(&d)).await? {
            return Err(Error::Dirty);
        }
        let project = self.store().await?.project(&record.project_id).await?;
        self.stop(&record.id);
        blocking(move || worktree::remove(Path::new(&project.path), &dir, force)).await?
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
}

impl Sink for Sessions {
    fn changes(&self, key: &str, changes: Vec<Change>) {
        {
            let mut mirrors = self.mirrors.lock();
            let m = mirrors.entry(key.to_string()).or_default();
            for c in &changes {
                m.apply(c);
            }
        }
        self.core.emit(
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
            let changed = self.records.lock().get_mut(key).is_some_and(|r| {
                let changed = r.usage.as_ref() != Some(usage);
                r.usage = Some(usage.clone());
                changed
            });
            if let (true, Some(store)) = (changed, self.core.opened_store()) {
                store.queue_usage(key, usage);
            }
        }
        self.emit(key);
    }

    fn persist(&self, key: &str, entries: Vec<(usize, Entry)>) {
        if let Some(store) = self.core.opened_store() {
            store.queue_entries(key, entries);
        }
    }

    fn agent_session(&self, key: &str, agent_session_id: &str) {
        if let Some(store) = self.core.opened_store() {
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
            self.core.emit("rpc", &entry);
        }
    }

    fn workspace_dirty(&self, key: &str) {
        workspace::changed(&self.core, key, Vec::new());
    }
}

/// A session name from free text: the first sentence of the first line, cut
/// at a word boundary to about 56 characters.
pub fn short_title(text: &str) -> String {
    let line = text
        .lines()
        .map(str::trim)
        .find(|l| !l.is_empty())
        .unwrap_or("");
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
    out.trim_end_matches(['.', ',', ':', ';']).to_string()
}

#[cfg(test)]
mod tests {
    use super::short_title;

    #[test]
    fn titles_are_the_first_sentence_cut_at_a_word() {
        assert_eq!(
            short_title("Read calc.py, explain the bug in one sentence, then fix it."),
            "Read calc.py, explain the bug in one sentence, then fix…"
        );
        assert_eq!(
            short_title("Fix the login redirect. Then run the tests."),
            "Fix the login redirect"
        );
        assert_eq!(
            short_title("\n  what does main.rs do?\nmore"),
            "what does main.rs do?"
        );
        assert_eq!(short_title("Short one"), "Short one");
    }
}
