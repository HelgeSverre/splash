//! The app's state, as services the commands in `app.rs` resolve from
//! Elyra's container: [`Sessions`] (projects, sessions, live agents),
//! [`Agents`] (the agent list), [`Workspace`] (a session's files, terminal and
//! git) and [`Customize`] (settings, skills, MCP). They share a [`Core`].

use std::path::PathBuf;
use std::sync::Arc;

use elyra::EventBus;
use tokio::sync::OnceCell;

use crate::agents::{registry, AgentSpec};
use crate::store::Store;

mod agents;
mod customize;
mod sessions;
mod workspace;

pub use agents::Agents;
pub use customize::Customize;
pub use sessions::{short_title, RpcLine, SessionPreview, SessionView, Sessions, TranscriptEvent};
pub use workspace::{Workspace, WorkspaceEvent};

pub use crate::error::{Error, Result};

/// Resolves an agent id to its spec: the registry, or a fake agent in tests.
pub type AgentLookup = Arc<dyn Fn(&str) -> Option<&'static AgentSpec> + Send + Sync>;

/// What every service needs: where data lives, the event bus, the store.
pub struct Core {
    pub data_dir: PathBuf,
    bus: EventBus,
    store: OnceCell<Store>,
    find_agent: AgentLookup,
}

impl Core {
    /// The store, opened (and migrated) on first use — on Elyra's runtime,
    /// where its writer task can live.
    pub async fn store(&self) -> Result<&Store> {
        let path = self.data_dir.join("splash.db");
        self.store
            .get_or_try_init(|| async move { Store::open(&path).await })
            .await
    }

    /// The store if something opened it already: for the actors' callbacks,
    /// which only queue writes and can't wait.
    pub fn opened_store(&self) -> Option<&Store> {
        self.store.get()
    }

    pub fn agent(&self, id: &str) -> Result<&'static AgentSpec> {
        (self.find_agent)(id).ok_or(Error::NotFound("unknown agent"))
    }

    /// Push an event to the UI; nobody listening isn't an error.
    pub fn emit<T: serde::Serialize>(&self, channel: &str, value: &T) {
        let _ = self.bus.emit(channel, value);
    }
}

/// Every service, wired together; `app.rs` binds each one.
pub struct Hub {
    pub github: Arc<crate::github::Github>,
    pub core: Arc<Core>,
    pub sessions: Arc<Sessions>,
    pub agents: Arc<Agents>,
    pub workspace: Arc<Workspace>,
    pub customize: Arc<Customize>,
}

impl Hub {
    pub fn new(data_dir: PathBuf, bus: EventBus) -> Self {
        Self::with_agents(data_dir, bus, Arc::new(registry::find))
    }

    pub fn with_agents(data_dir: PathBuf, bus: EventBus, find_agent: AgentLookup) -> Self {
        let core = Arc::new(Core {
            data_dir,
            bus,
            store: OnceCell::new(),
            find_agent,
        });
        let sessions = Arc::new(Sessions::new(core.clone()));
        let workspace = Arc::new(Workspace::new(core.clone(), sessions.clone()));
        // A stopped session's shell, watcher and git cache go with it.
        let ws = Arc::downgrade(&workspace);
        sessions.on_stop(move |id| {
            if let Some(ws) = ws.upgrade() {
                ws.forget(id);
            }
        });
        // Splash stopping its agents on exit is not their failure.
        let s = Arc::downgrade(&sessions);
        crate::procs::on_shutdown(move || {
            if let Some(s) = s.upgrade() {
                s.shut_down();
            }
        });
        Self {
            github: Arc::new(crate::github::Github::new(core.clone())),
            agents: Arc::new(Agents::new(core.clone())),
            customize: Arc::new(Customize::new(core.clone())),
            core,
            sessions,
            workspace,
        }
    }
}

/// Run blocking work (git, the filesystem) off the async runtime's workers.
async fn blocking<T: Send + 'static>(f: impl FnOnce() -> T + Send + 'static) -> Result<T> {
    Ok(tokio::task::spawn_blocking(f).await?)
}

/// Resolving the login-shell PATH can take seconds the first time; make sure
/// that happens on a blocking thread, never on a runtime worker.
async fn warm_env() {
    let _ = blocking(|| {
        crate::agents::env::path();
    })
    .await;
}

fn split_args(s: &str) -> Vec<String> {
    s.split_whitespace().map(String::from).collect()
}
