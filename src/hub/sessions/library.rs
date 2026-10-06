//! Session discovery, previews, and importing externally owned conversations.
use super::*;
use crate::acp::history::{self, HistoryPage};

#[derive(Clone, Debug, Serialize, Deserialize, specta::Type)]
pub struct SessionPreview {
    pub token: String,
    pub agent_id: String,
    pub session_id: String,
    pub cwd: String,
    pub title: String,
    pub entries: Vec<Entry>,
}

#[derive(Clone)]
pub(super) struct CachedPreview {
    preview: SessionPreview,
    args: String,
    at: f64,
}

impl Sessions {
    async fn history_args(
        &self,
        agent_id: &str,
        cwd: &str,
    ) -> Result<(String, &'static crate::agents::AgentSpec)> {
        if !Path::new(cwd).is_absolute() || !Path::new(cwd).is_dir() {
            return Err(Error::Other(
                "Choose the existing conversation's absolute working directory.".into(),
            ));
        }
        warm_env().await;
        let agent = self.core.agent(agent_id)?;
        let args = self.store().await?.extra_args(agent_id).await?;
        Ok((args, agent))
    }

    pub async fn discover(
        &self,
        agent_id: &str,
        cwd: &str,
        cursor: Option<String>,
    ) -> Result<HistoryPage> {
        let (args, agent) = self.history_args(agent_id, cwd).await?;
        Ok(history::read(
            agent,
            Path::new(cwd),
            &split_args(&args),
            history::Request::List(cursor),
        )
        .await?
        .page)
    }

    pub async fn preview(
        &self,
        agent_id: &str,
        cwd: &str,
        session_id: &str,
    ) -> Result<SessionPreview> {
        if session_id.trim().is_empty() {
            return Err(Error::Other("Enter a session ID.".into()));
        }
        let (args, agent) = self.history_args(agent_id, cwd).await?;
        let result = history::read(
            agent,
            Path::new(cwd),
            &split_args(&args),
            history::Request::Load(session_id.into()),
        )
        .await?;
        let title = result
            .title
            .filter(|s| !s.trim().is_empty())
            .unwrap_or_else(|| {
                result
                    .entries
                    .iter()
                    .find_map(|e| match e {
                        Entry::User { text } => Some(short_title(text)),
                        _ => None,
                    })
                    .unwrap_or_else(|| format!("{} conversation", agent.name))
            });
        let preview = SessionPreview {
            token: store::new_id("preview"),
            agent_id: agent_id.into(),
            session_id: session_id.into(),
            cwd: cwd.into(),
            title,
            entries: result.entries,
        };
        let mut cache = self.previews.lock();
        cache.retain(|_, p| store::now() - p.at < 900.0);
        if cache.len() >= 8 {
            if let Some(key) = cache
                .iter()
                .min_by(|a, b| a.1.at.total_cmp(&b.1.at))
                .map(|(key, _)| key.clone())
            {
                cache.remove(&key);
            }
        }
        cache.insert(
            preview.token.clone(),
            CachedPreview {
                preview: preview.clone(),
                args,
                at: store::now(),
            },
        );
        Ok(preview)
    }

    pub async fn import_preview(&self, token: &str) -> Result<SessionView> {
        // Serialize identity checks and persistence so repeated clicks/imports deduplicate.
        let _guard = self.import_lock.lock().await;
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
        if let Some(record) = existing {
            return Ok(self.view(record));
        }
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
            updated_at: store::now(),
            usage: None,
            external: true,
            launch_args: Some(cached.args),
            attention: None,
        };
        self.store().await?.save_import(&record, &p.entries).await?;
        self.records
            .lock()
            .insert(record.id.clone(), record.clone());
        self.mirrors.lock().insert(
            record.id.clone(),
            TranscriptSnapshot::from_history(p.entries),
        );
        self.emit(&record.id);
        Ok(self.view(record))
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
