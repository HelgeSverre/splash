//! Short-lived, capability-gated ACP history and lifecycle operations.
//! These connections never send prompts and always cancel permission requests.
use std::{
    path::{Path, PathBuf},
    sync::Arc,
    time::Duration,
};

use super::{map::Replay, model::Entry, transport};
use crate::{
    agents::AgentSpec,
    error::{Error, Result},
};
use agent_client_protocol::{
    schema::{
        v1::{
            AgentCapabilities, ClientCapabilities, CloseSessionRequest, DeleteSessionRequest,
            ForkSessionRequest, Implementation, InitializeRequest, ListSessionsRequest,
            LoadSessionRequest, RequestPermissionOutcome, RequestPermissionRequest,
            RequestPermissionResponse, SessionId,
        },
        ProtocolVersion,
    },
    Agent, ConnectionTo, UntypedMessage,
};
use parking_lot::Mutex;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Default, PartialEq, Serialize, Deserialize, specta::Type)]
#[serde(default)]
pub struct HistoryCapabilities {
    pub list: bool,
    pub load: bool,
    pub resume: bool,
    pub close: bool,
    pub delete: bool,
    pub fork: bool,
    pub additional_directories: bool,
}
impl From<&AgentCapabilities> for HistoryCapabilities {
    fn from(caps: &AgentCapabilities) -> Self {
        let s = &caps.session_capabilities;
        Self {
            list: s.list.is_some(),
            load: caps.load_session,
            resume: s.resume.is_some(),
            close: s.close.is_some(),
            delete: s.delete.is_some(),
            fork: s.fork.is_some(),
            additional_directories: s.additional_directories.is_some(),
        }
    }
}

#[derive(Clone, Debug, Default, Serialize, Deserialize, specta::Type)]
pub struct ExternalSession {
    pub session_id: String,
    pub cwd: String,
    pub title: Option<String>,
    pub updated_at: Option<String>,
    #[serde(default)]
    pub additional_directories: Vec<String>,
    #[serde(default)]
    pub metadata_json: Option<String>,
}
impl ExternalSession {
    pub fn apply_info(&mut self, update: &serde_json::Value) {
        if let Some(value) = update.get("title") {
            self.title = value.as_str().map(String::from);
        }
        if let Some(value) = update.get("updatedAt") {
            self.updated_at = value.as_str().map(String::from);
        }
        if let Some(value) = update.get("_meta") {
            self.metadata_json = (!value.is_null()).then(|| value.to_string());
        }
    }
}

#[derive(Clone, Debug, Default, Serialize, Deserialize, specta::Type)]
pub struct HistoryPage {
    pub capabilities: HistoryCapabilities,
    pub sessions: Vec<ExternalSession>,
    pub next_cursor: Option<String>,
}

pub enum Request {
    List {
        cwd: Option<PathBuf>,
        cursor: Option<String>,
    },
    Load(ExternalSession),
    Inspect,
    Delete(String),
    Fork(ExternalSession),
}

pub struct HistoryResult {
    pub page: HistoryPage,
    pub entries: Vec<Entry>,
    pub session: ExternalSession,
}

fn unsupported(message: &str) -> agent_client_protocol::Error {
    agent_client_protocol::Error::invalid_params().data(message)
}

pub async fn read(
    agent: &AgentSpec,
    cwd: &Path,
    extra: &[String],
    request: Request,
) -> Result<HistoryResult> {
    let (conn, mut process) = transport::spawn(agent, cwd, extra, Arc::new(|_, _| {}))?;
    let replay = Arc::new(Mutex::new(Replay::default()));
    let session = Arc::new(Mutex::new(match &request {
        Request::Load(info) | Request::Fork(info) => info.clone(),
        _ => ExternalSession::default(),
    }));
    let page = Arc::new(Mutex::new(HistoryPage::default()));
    let received = Arc::new(Mutex::new(tokio::time::Instant::now()));
    let run = agent_client_protocol::Client.builder()
        .on_receive_notification({
            let replay = replay.clone();
            let session = session.clone();
            let received = received.clone();
            async move |msg: UntypedMessage, _cx| {
                if msg.method == "session/update" && msg.params["sessionId"].as_str() == Some(session.lock().session_id.as_str()) {
                    *received.lock() = tokio::time::Instant::now();
                    let update = &msg.params["update"];
                    if update["sessionUpdate"] == "session_info_update" { session.lock().apply_info(update); }
                    replay.lock().apply(update);
                }
                Ok(())
            }
        }, agent_client_protocol::on_receive_notification!())
        .on_receive_request(async move |_req: RequestPermissionRequest, responder, _cx| {
            responder.respond(RequestPermissionResponse::new(RequestPermissionOutcome::Cancelled))?;
            Ok(())
        }, agent_client_protocol::on_receive_request!())
        .connect_with(conn, {
            let page = page.clone();
            let session = session.clone();
            async move |cx: ConnectionTo<Agent>| {
                let init = cx.send_request(InitializeRequest::new(ProtocolVersion::V1)
                    .client_capabilities(ClientCapabilities::new())
                    .client_info(Implementation::new("splash", env!("CARGO_PKG_VERSION"))))
                    .block_task().await?;
                if init.protocol_version != ProtocolVersion::V1 { return Err(unsupported("This agent did not negotiate ACP v1")); }
                let caps = HistoryCapabilities::from(&init.agent_capabilities);
                page.lock().capabilities = caps.clone();
                match request {
                    Request::List { cwd, cursor } if caps.list => {
                        let response = cx.send_request(ListSessionsRequest::new().cwd(cwd).cursor(cursor)).block_task().await?;
                        let mut page = page.lock();
                        page.next_cursor = response.next_cursor;
                        page.sessions = response.sessions.into_iter().map(|s| ExternalSession {
                            session_id: s.session_id.0.to_string(), cwd: s.cwd.to_string_lossy().into_owned(),
                            title: s.title, updated_at: s.updated_at,
                            additional_directories: s.additional_directories.into_iter().map(|d| d.to_string_lossy().into_owned()).collect(),
                            metadata_json: s.meta.and_then(|m| serde_json::to_string(&m).ok()),
                        }).collect();
                    }
                    Request::List { .. } | Request::Inspect => {}
                    Request::Delete(id) => {
                        if !caps.delete { return Err(unsupported("This agent does not support deleting saved sessions")); }
                        cx.send_request(DeleteSessionRequest::new(id)).block_task().await?;
                    }
                    request @ (Request::Load(_) | Request::Fork(_)) => {
                        if !caps.load { return Err(unsupported("This agent cannot replay saved history")); }
                        let fork = matches!(request, Request::Fork(_));
                        if fork && !caps.fork { return Err(unsupported("This agent does not support forking sessions")); }
                        let info = session.lock().clone();
                        if !info.additional_directories.is_empty() && !caps.additional_directories {
                            return Err(unsupported("This agent no longer supports this session's additional folders. Its workspace cannot be restored safely."));
                        }
                        let roots: Vec<PathBuf> = info.additional_directories.iter().map(PathBuf::from).collect();
                        let id = SessionId::new(info.session_id.clone());
                        cx.send_request(LoadSessionRequest::new(id.clone(), &info.cwd).additional_directories(roots.clone())).block_task().await?;
                        // Tolerate v1 adapters which finish replay just after replying.
                        let started = tokio::time::Instant::now();
                        loop {
                            tokio::time::sleep(Duration::from_millis(150)).await;
                            if received.lock().elapsed() >= Duration::from_millis(300) || started.elapsed() >= Duration::from_secs(5) { break; }
                        }
                        let result = if fork {
                            cx.send_request(ForkSessionRequest::new(id.clone(), info.cwd).additional_directories(roots)).block_task().await.map(|response| {
                                session.lock().session_id = response.session_id.0.to_string();
                                response.session_id
                            })
                        } else { Ok(id.clone()) };
                        // Closing releases resources, never deletes provider history. A
                        // broken close falls back to terminating our process below.
                        if caps.close {
                            close(&cx, id.clone()).await;
                            if let Ok(child) = &result { if child != &id { close(&cx, child.clone()).await; } }
                        }
                        result?;
                    }
                }
                Ok(())
            }
        });
    let outcome = tokio::time::timeout(Duration::from_secs(180), run).await;
    process.kill();
    if let Some(mut child) = process.child.take() {
        let _ = child.wait().await;
    }
    outcome
        .map_err(|_| {
            Error::Other("Agent history request timed out. Retry when the agent is ready.".into())
        })?
        .map_err(|e| Error::Other(format!("Agent history request failed: {e}")))?;
    let entries = std::mem::take(&mut *replay.lock()).finish();
    let page = std::mem::take(&mut *page.lock());
    let session = session.lock().clone();
    Ok(HistoryResult {
        page,
        entries,
        session,
    })
}

pub async fn close(cx: &ConnectionTo<Agent>, id: SessionId) {
    let _ = tokio::time::timeout(
        Duration::from_secs(3),
        cx.send_request(CloseSessionRequest::new(id)).block_task(),
    )
    .await;
}
