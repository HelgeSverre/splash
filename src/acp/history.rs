//! Short-lived ACP connections for discovery and history preview. These never
//! create sessions or send prompts. Agent permissions are always cancelled.
use std::{path::Path, sync::Arc, time::Duration};

use agent_client_protocol::{
    schema::{
        v1::{
            ClientCapabilities, Implementation, InitializeRequest, ListSessionsRequest,
            LoadSessionRequest, RequestPermissionOutcome, RequestPermissionRequest,
            RequestPermissionResponse, SessionId,
        },
        ProtocolVersion,
    },
    Agent, ConnectionTo, UntypedMessage,
};
use parking_lot::Mutex;
use serde::{Deserialize, Serialize};

use super::{map::Replay, model::Entry, transport};
use crate::{
    agents::AgentSpec,
    error::{Error, Result},
};

#[derive(Clone, Debug, Default, Serialize, Deserialize, specta::Type)]
pub struct HistoryCapabilities {
    pub list: bool,
    pub load: bool,
    pub resume: bool,
}

#[derive(Clone, Debug, Serialize, Deserialize, specta::Type)]
pub struct ExternalSession {
    pub session_id: String,
    pub cwd: String,
    pub title: Option<String>,
    pub updated_at: Option<String>,
}

#[derive(Clone, Debug, Default, Serialize, Deserialize, specta::Type)]
pub struct HistoryPage {
    pub capabilities: HistoryCapabilities,
    pub sessions: Vec<ExternalSession>,
    pub next_cursor: Option<String>,
}

pub enum Request {
    List(Option<String>),
    Load(String),
}

pub struct HistoryResult {
    pub page: HistoryPage,
    pub entries: Vec<Entry>,
    pub title: Option<String>,
}

pub async fn read(
    agent: &AgentSpec,
    cwd: &Path,
    extra: &[String],
    request: Request,
) -> Result<HistoryResult> {
    let (conn, mut process) = transport::spawn(agent, cwd, extra, Arc::new(|_, _| {}))?;
    let replay = Arc::new(Mutex::new(Replay::default()));
    let title = Arc::new(Mutex::new(None));
    let page = Arc::new(Mutex::new(HistoryPage::default()));
    let load_id = match &request {
        Request::Load(id) => Some(id.clone()),
        Request::List(_) => None,
    };
    let received = Arc::new(Mutex::new(tokio::time::Instant::now()));
    let run = agent_client_protocol::Client
        .builder()
        .on_receive_notification(
            {
                let replay = replay.clone();
                let title = title.clone();
                let received = received.clone();
                async move |msg: UntypedMessage, _cx| {
                    if msg.method == "session/update"
                        && load_id.as_deref() == msg.params["sessionId"].as_str()
                    {
                        *received.lock() = tokio::time::Instant::now();
                        let update = &msg.params["update"];
                        if let Some(t) = update["title"].as_str() {
                            *title.lock() = Some(t.to_string());
                        }
                        replay.lock().apply(update);
                    }
                    Ok(())
                }
            },
            agent_client_protocol::on_receive_notification!(),
        )
        .on_receive_request(
            async move |_req: RequestPermissionRequest, responder, _cx| {
                responder.respond(RequestPermissionResponse::new(
                    RequestPermissionOutcome::Cancelled,
                ))?;
                Ok(())
            },
            agent_client_protocol::on_receive_request!(),
        )
        .connect_with(conn, {
            let page = page.clone();
            let cwd = cwd.to_path_buf();
            async move |cx: ConnectionTo<Agent>| {
                let init = cx
                    .send_request(
                        InitializeRequest::new(ProtocolVersion::V1)
                            .client_capabilities(ClientCapabilities::new())
                            .client_info(Implementation::new("splash", env!("CARGO_PKG_VERSION"))),
                    )
                    .block_task()
                    .await?;
                if init.protocol_version != ProtocolVersion::V1 {
                    return Err(agent_client_protocol::Error::invalid_params()
                        .data("This agent did not negotiate ACP v1"));
                }
                let caps = init.agent_capabilities;
                let capabilities = HistoryCapabilities {
                    list: caps.session_capabilities.list.is_some(),
                    load: caps.load_session,
                    resume: caps.session_capabilities.resume.is_some(),
                };
                *page.lock() = HistoryPage {
                    capabilities: capabilities.clone(),
                    ..Default::default()
                };
                match request {
                    Request::List(cursor) if capabilities.list => {
                        let response = cx
                            .send_request(ListSessionsRequest::new().cwd(cwd).cursor(cursor))
                            .block_task()
                            .await?;
                        let mut page = page.lock();
                        page.next_cursor = response.next_cursor;
                        page.sessions = response
                            .sessions
                            .into_iter()
                            .map(|s| ExternalSession {
                                session_id: s.session_id.0.to_string(),
                                cwd: s.cwd.to_string_lossy().into_owned(),
                                title: s.title,
                                updated_at: s.updated_at,
                            })
                            .collect();
                    }
                    Request::List(_) => {}
                    Request::Load(id) => {
                        if !capabilities.load {
                            return Err(agent_client_protocol::Error::invalid_params()
                                .data("This agent cannot replay saved history"));
                        }
                        cx.send_request(LoadSessionRequest::new(SessionId::new(id), cwd))
                            .block_task()
                            .await?;
                        // Some v1 agents respond before finishing replay. Allow a bounded
                        // quiet period, without ever sending a prompt into that stream.
                        let started = tokio::time::Instant::now();
                        loop {
                            tokio::time::sleep(Duration::from_millis(150)).await;
                            if received.lock().elapsed() >= Duration::from_millis(300)
                                || started.elapsed() >= Duration::from_secs(5)
                            {
                                break;
                            }
                        }
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
        .map_err(|e| Error::Other(format!("Could not read agent history: {e}")))?;
    let entries = std::mem::take(&mut *replay.lock()).finish();
    let page = std::mem::take(&mut *page.lock());
    let title = title.lock().take();
    Ok(HistoryResult {
        page,
        entries,
        title,
    })
}
