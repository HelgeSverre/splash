//! Discovery, safe history replacement, and provider lifecycle actions.
use super::*;
use crate::acp::history::{self, ExternalSession, HistoryCapabilities, HistoryPage, HistoryResult};
use crate::store::SessionSource;

#[derive(Clone, Debug, Serialize, Deserialize, specta::Type)]
pub struct SessionPreview {
    pub token: String,
    pub agent_id: String,
    pub session_id: String,
    pub cwd: String,
    pub title: String,
    pub entries: Vec<Entry>,
    pub additional_directories: Vec<String>,
    pub source: SessionSource,
}

#[derive(Clone)]
pub(super) struct CachedPreview {
    preview: SessionPreview,
    args: String,
    at: f64,
}

pub(super) fn validate_directory(path: &str) -> Result<()> {
    if !Path::new(path).is_absolute() || !Path::new(path).is_dir() {
        return Err(Error::Other(format!(
            "Workspace folder is missing or not absolute: {path}"
        )));
    }
    Ok(())
}
fn validate_workspace(info: &ExternalSession) -> Result<()> {
    validate_directory(&info.cwd)?;
    for path in &info.additional_directories {
        validate_directory(path)?;
    }
    Ok(())
}
fn fallback_title(entries: &[Entry], agent: &str) -> String {
    entries
        .iter()
        .find_map(|e| match e {
            Entry::User { text } => Some(short_title(text)),
            _ => None,
        })
        .unwrap_or_else(|| format!("{agent} conversation"))
}
fn source_from(result: &HistoryResult) -> SessionSource {
    SessionSource {
        capabilities: Some(result.page.capabilities.clone()),
        title: result.session.title.clone(),
        updated_at: result.session.updated_at.clone(),
        synced_updated_at: result.session.updated_at.clone(),
        metadata_json: result.session.metadata_json.clone(),
        last_synced_at: Some(store::now()),
        last_local_activity_at: None,
        deleted: false,
    }
}
fn native_info(record: &SessionRecord) -> Result<ExternalSession> {
    if record.source.deleted {
        return Err(Error::Other(
            "This conversation was deleted from the agent. The local copy is read-only.".into(),
        ));
    }
    Ok(ExternalSession {
        session_id: record
            .agent_session_id
            .clone()
            .ok_or(Error::NotFound("This session has no agent history yet."))?,
        cwd: record.cwd.clone(),
        title: record.source.title.clone(),
        updated_at: record.source.updated_at.clone(),
        additional_directories: record.additional_directories.clone(),
        metadata_json: record.source.metadata_json.clone(),
    })
}

impl Sessions {
    async fn history_args(
        &self,
        agent_id: &str,
    ) -> Result<(String, &'static crate::agents::AgentSpec)> {
        warm_env().await;
        Ok((
            self.store().await?.extra_args(agent_id).await?,
            self.core.agent(agent_id)?,
        ))
    }

    /// Empty cwd means all folders, while the subprocess starts in the user's home.
    pub async fn discover(
        &self,
        agent_id: &str,
        cwd: &str,
        cursor: Option<String>,
    ) -> Result<HistoryPage> {
        let (args, agent) = self.history_args(agent_id).await?;
        let filter = (!cwd.is_empty()).then(|| PathBuf::from(cwd));
        let launch = filter
            .clone()
            .or_else(dirs::home_dir)
            .unwrap_or_else(std::env::temp_dir);
        validate_directory(&launch.to_string_lossy())?;
        let page = history::read(
            agent,
            &launch,
            &split_args(&args),
            history::Request::List {
                cwd: filter,
                cursor,
            },
        )
        .await?
        .page;
        // A list can report new source activity, but never replaces a transcript.
        let _guard = self.startup_lock.lock().await;
        for info in &page.sessions {
            let ids: Vec<_> = self
                .records
                .lock()
                .values()
                .filter(|r| {
                    r.agent_id == agent_id
                        && r.agent_session_id.as_deref() == Some(&info.session_id)
                        && r.launch_args.as_deref().unwrap_or(&args) == args
                })
                .map(|r| r.id.clone())
                .collect();
            for id in ids {
                let mut record = self.record(&id)?;
                record.source.title = info.title.clone();
                record.source.updated_at = info.updated_at.clone();
                record.source.metadata_json = info.metadata_json.clone();
                record.source.capabilities = Some(page.capabilities.clone());
                self.store().await?.queue_source(&id, &record.source);
                self.records.lock().insert(id.clone(), record);
                self.emit(&id);
            }
        }
        Ok(page)
    }

    pub async fn preview(&self, agent_id: &str, info: ExternalSession) -> Result<SessionPreview> {
        let started_at = store::now();
        if info.session_id.trim().is_empty() {
            return Err(Error::Other("Enter a session ID.".into()));
        }
        validate_workspace(&info)?;
        let (args, agent) = self.history_args(agent_id).await?;
        let result = history::read(
            agent,
            Path::new(&info.cwd),
            &split_args(&args),
            history::Request::Load(info.clone()),
        )
        .await?;
        let source = source_from(&result);
        let title = source
            .title
            .clone()
            .filter(|t| !t.trim().is_empty())
            .unwrap_or_else(|| fallback_title(&result.entries, agent.name));
        let preview = SessionPreview {
            token: store::new_id("preview"),
            agent_id: agent_id.into(),
            session_id: info.session_id,
            cwd: info.cwd,
            title,
            entries: result.entries,
            additional_directories: info.additional_directories,
            source,
        };
        let mut cache = self.previews.lock();
        cache.retain(|_, p| store::now() - p.at < 900.0);
        if cache.len() >= 8 {
            if let Some(key) = cache
                .iter()
                .min_by(|a, b| a.1.at.total_cmp(&b.1.at))
                .map(|(k, _)| k.clone())
            {
                cache.remove(&key);
            }
        }
        cache.insert(
            preview.token.clone(),
            CachedPreview {
                preview: preview.clone(),
                args,
                at: started_at,
            },
        );
        Ok(preview)
    }

    fn require_disconnected(&self, id: &str) -> Result<()> {
        if self
            .live
            .lock()
            .get(id)
            .is_some_and(|l| !matches!(l.status, Status::Exited | Status::Error))
        {
            return Err(Error::Other("Disconnect this session before refreshing, forking, or deleting its agent history.".into()));
        }
        self.stop(id);
        Ok(())
    }

    pub async fn import_preview(&self, token: &str) -> Result<SessionView> {
        let _guard = self.startup_lock.lock().await;
        let cached = self
            .previews
            .lock()
            .get(token)
            .cloned()
            .filter(|p| store::now() - p.at < 900.0)
            .ok_or(Error::NotFound(
                "Preview expired. Load the conversation again.",
            ))?;
        let p = cached.preview;
        self.store().await?;
        let existing = self
            .records
            .lock()
            .values()
            .find(|r| {
                r.agent_id == p.agent_id
                    && r.agent_session_id.as_deref() == Some(&p.session_id)
                    && r.launch_args.as_deref().unwrap_or(&cached.args) == cached.args
            })
            .cloned();
        if let Some(mut record) = existing {
            self.require_disconnected(&record.id)?;
            // Reject previews made before the last local turn or refresh.
            if record.source.deleted
                || record
                    .source
                    .last_local_activity_at
                    .is_some_and(|t| t > cached.at)
                || record
                    .source
                    .last_synced_at
                    .is_some_and(|t| t > cached.at && Some(t) != p.source.last_synced_at)
            {
                return Err(Error::Other("This preview is older than the saved conversation. Preview it again or use Refresh from agent.".into()));
            }
            if record.cwd != p.cwd {
                return Err(Error::Other("The original working folder changed. Remove the local copy before importing it again.".into()));
            }
            if !record.title_override {
                record.title = short_title(&p.title);
            }
            record.additional_directories = p.additional_directories;
            record.source = p.source;
            record.updated_at =
                store::timestamp(record.source.updated_at.as_deref()).unwrap_or(record.updated_at);
            record.launch_args = Some(cached.args);
            self.replace_history(record, p.entries).await
        } else {
            let project = self.add_project(&p.cwd).await?;
            let cwd = PathBuf::from(&p.cwd);
            let (branch, base_sha) =
                blocking(move || (git::current_branch(&cwd), git::head_sha(&cwd))).await?;
            let record = SessionRecord {
                id: store::new_id("s"),
                project_id: project.id,
                agent_id: p.agent_id,
                title: short_title(&p.title),
                cwd: p.cwd,
                isolation: Isolation::InPlace,
                branch,
                base_sha,
                agent_session_id: Some(p.session_id),
                archived: false,
                created_at: store::now(),
                updated_at: store::timestamp(p.source.updated_at.as_deref())
                    .or(p.source.last_synced_at)
                    .unwrap_or_else(store::now),
                usage: None,
                external: true,
                launch_args: Some(cached.args),
                attention: None,
                source: p.source,
                additional_directories: p.additional_directories,
                parent_id: None,
                title_override: false,
            };
            self.store().await?.save_import(&record, &p.entries).await?;
            self.publish_history(record, p.entries)
        }
    }

    fn publish_history(&self, record: SessionRecord, entries: Vec<Entry>) -> Result<SessionView> {
        let snap = TranscriptSnapshot::from_history(entries);
        self.records
            .lock()
            .insert(record.id.clone(), record.clone());
        self.mirrors.lock().insert(record.id.clone(), snap.clone());
        self.core.emit(
            "transcript",
            &TranscriptEvent {
                session: record.id.clone(),
                changes: vec![],
                reset: Some(snap),
            },
        );
        self.emit(&record.id);
        Ok(self.view(record))
    }
    async fn replace_history(
        &self,
        record: SessionRecord,
        entries: Vec<Entry>,
    ) -> Result<SessionView> {
        self.store()
            .await?
            .replace_history(&record, &entries)
            .await?;
        self.publish_history(record, entries)
    }
    async fn profile(
        &self,
        record: &SessionRecord,
    ) -> Result<(String, &'static crate::agents::AgentSpec)> {
        let (args, agent) = self.history_args(&record.agent_id).await?;
        Ok((record.launch_args.clone().unwrap_or(args), agent))
    }

    /// Fetch current roots and metadata before replaying a stored session.
    async fn current_info(
        &self,
        record: &SessionRecord,
        agent: &crate::agents::AgentSpec,
        args: &[String],
    ) -> Result<ExternalSession> {
        let fallback = native_info(record)?;
        validate_directory(&fallback.cwd)?;
        let mut cursor = None;
        let mut seen = HashSet::new();
        for _ in 0..100 {
            let result = history::read(
                agent,
                Path::new(&record.cwd),
                args,
                history::Request::List {
                    cwd: Some(PathBuf::from(&record.cwd)),
                    cursor,
                },
            )
            .await?;
            if !result.page.capabilities.list {
                validate_workspace(&fallback)?;
                return Ok(fallback);
            }
            if let Some(info) = result
                .page
                .sessions
                .into_iter()
                .find(|s| s.session_id == fallback.session_id)
            {
                if info.cwd != record.cwd {
                    return Err(Error::Other("The agent reports a different working folder. Preview the conversation again in the session library.".into()));
                }
                validate_workspace(&info)?;
                return Ok(info);
            }
            match result.page.next_cursor {
                Some(next) if seen.insert(next.clone()) => cursor = Some(next),
                Some(_) => {
                    return Err(Error::Other(
                        "The agent returned a repeated history cursor.".into(),
                    ))
                }
                // Some adapters don't list every loadable session. A known ID is
                // still loadable; keep its explicitly saved roots and metadata.
                None => {
                    validate_workspace(&fallback)?;
                    return Ok(fallback);
                }
            }
        }
        Err(Error::Other(
            "The agent returned too many history pages. Narrow its history before retrying.".into(),
        ))
    }

    pub async fn refresh_history(&self, id: &str) -> Result<SessionView> {
        let _guard = self.startup_lock.lock().await;
        self.store().await?;
        self.require_disconnected(id)?;
        let mut record = self.record(id)?;
        let (args, agent) = self.profile(&record).await?;
        let extra = split_args(&args);
        let info = self.current_info(&record, agent, &extra).await?;
        let result = history::read(
            agent,
            Path::new(&record.cwd),
            &extra,
            history::Request::Load(info),
        )
        .await?;
        record.source = source_from(&result);
        record.additional_directories = result.session.additional_directories;
        record.launch_args = Some(args);
        record.updated_at =
            store::timestamp(record.source.updated_at.as_deref()).unwrap_or(record.updated_at);
        if !record.title_override {
            record.title = short_title(
                &record
                    .source
                    .title
                    .clone()
                    .filter(|t| !t.trim().is_empty())
                    .unwrap_or_else(|| fallback_title(&result.entries, agent.name)),
            );
        }
        self.replace_history(record, result.entries).await
    }

    pub async fn history_capabilities(&self, id: &str) -> Result<HistoryCapabilities> {
        let _guard = self.startup_lock.lock().await;
        let record = self.record(id)?;
        let (args, agent) = self.profile(&record).await?;
        let launch = if Path::new(&record.cwd).is_dir() {
            PathBuf::from(&record.cwd)
        } else {
            dirs::home_dir().unwrap_or_else(std::env::temp_dir)
        };
        let result = history::read(
            agent,
            &launch,
            &split_args(&args),
            history::Request::Inspect,
        )
        .await?;
        // A live actor may have updated its metadata during the handshake.
        let mut record = self.record(id)?;
        record.source.capabilities = Some(result.page.capabilities.clone());
        self.store().await?.queue_source(id, &record.source);
        self.records.lock().insert(id.into(), record);
        self.emit(id);
        Ok(result.page.capabilities)
    }

    pub async fn delete_native(&self, id: &str) -> Result<SessionView> {
        let _guard = self.startup_lock.lock().await;
        self.require_disconnected(id)?;
        let mut record = self.record(id)?;
        let info = native_info(&record)?;
        let (args, agent) = self.profile(&record).await?;
        let launch = if Path::new(&record.cwd).is_dir() {
            PathBuf::from(&record.cwd)
        } else {
            dirs::home_dir().unwrap_or_else(std::env::temp_dir)
        };
        history::read(
            agent,
            &launch,
            &split_args(&args),
            history::Request::Delete(info.session_id),
        )
        .await?;
        record.source.deleted = true;
        self.store().await?.queue_source(id, &record.source);
        self.store().await?.settle().await;
        self.records.lock().insert(id.into(), record.clone());
        self.emit(id);
        Ok(self.view(record))
    }

    pub async fn fork_history(&self, id: &str) -> Result<SessionView> {
        let _guard = self.startup_lock.lock().await;
        self.require_disconnected(id)?;
        let parent = self.record(id)?;
        let (args, agent) = self.profile(&parent).await?;
        let extra = split_args(&args);
        let info = self.current_info(&parent, agent, &extra).await?;
        let result = history::read(
            agent,
            Path::new(&parent.cwd),
            &extra,
            history::Request::Fork(info),
        )
        .await?;
        if Some(&result.session.session_id) == parent.agent_session_id.as_ref() {
            return Err(Error::Other(
                "The agent returned the parent ID instead of a new fork.".into(),
            ));
        }
        let native_id = result.session.session_id.clone();
        let mut source = source_from(&result);
        let title = format!("Fork of {}", parent.title);
        source.title = None;
        source.metadata_json = None;
        // Forking creates a new native conversation; the parent's activity date
        // must not masquerade as the child's last update.
        source.updated_at = None;
        source.synced_updated_at = None;
        let record = SessionRecord {
            id: store::new_id("s"),
            project_id: parent.project_id,
            agent_id: parent.agent_id,
            title,
            cwd: parent.cwd,
            isolation: Isolation::InPlace,
            branch: parent.branch,
            base_sha: parent.base_sha,
            agent_session_id: Some(native_id.clone()),
            archived: false,
            created_at: store::now(),
            updated_at: store::now(),
            usage: None,
            external: true,
            launch_args: Some(args),
            attention: None,
            source,
            additional_directories: result.session.additional_directories,
            parent_id: Some(id.into()),
            title_override: true,
        };
        self.store().await?.save_import(&record, &result.entries).await.map_err(|e| Error::Other(format!("Agent fork {native_id} was created, but its local copy could not be saved: {e}. Import that ID to recover it.")))?;
        self.publish_history(record, result.entries)
    }

    pub async fn disconnect(&self, id: &str) -> Result<()> {
        let _guard = self.startup_lock.lock().await;
        if self.live.lock().get(id).is_some_and(|l| {
            matches!(
                l.status,
                Status::Starting | Status::Running | Status::AwaitingPermission
            )
        }) {
            return Err(Error::Other(
                "Stop the current turn before disconnecting.".into(),
            ));
        }
        let (done, wait) = tokio::sync::oneshot::channel();
        if self.send(id, SessionCmd::Disconnect(done)).is_ok() {
            let _ = tokio::time::timeout(std::time::Duration::from_secs(5), wait).await;
        }
        self.stop(id);
        self.store().await?.settle().await;
        self.emit(id);
        Ok(())
    }

    pub async fn search(&self, query: &str) -> Result<Vec<store::SessionMatch>> {
        let store = self.store().await?;
        store.settle().await;
        store.search_sessions(query).await
    }

    pub async fn acknowledge(&self, id: &str) -> Result<()> {
        let store = self.store().await?;
        {
            let _callbacks = self.callbacks.lock();
            self.record(id)?;
            // Active permissions can only be cleared by answering them.
            if self
                .live
                .lock()
                .get(id)
                .is_some_and(|l| l.status == Status::AwaitingPermission)
            {
                return Ok(());
            }
            self.update_record(id, |r| r.attention = None);
            store.queue_attention(id, None);
        }
        store.settle().await;
        Ok(())
    }

    pub async fn restart(self: &Arc<Self>, id: &str) -> Result<()> {
        let _startup = self.startup_lock.lock().await;
        let record = self.record(id)?;
        if record.archived {
            return Err(Error::Other("Archived sessions are read-only.".into()));
        }
        if self.live.lock().get(id).is_some_and(|l| {
            matches!(
                l.status,
                Status::Starting | Status::Running | Status::AwaitingPermission
            )
        }) {
            return Err(Error::Other(
                "Wait for the current turn to stop before reconnecting.".into(),
            ));
        }
        self.stop(id);
        self.store().await?.settle().await;
        self.ensure_live(id).await
    }
}
