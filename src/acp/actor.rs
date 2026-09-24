//! One live agent session: a tokio task that owns the ACP connection, the
//! transcript and any pending permission requests.
//!
//! ```text
//! commands ──SessionCmd──▶ ┌────────┐ ──Change/status/persist──▶ Sink (UI, DB)
//! SDK handlers ──Inbound──▶│ actor  │ ──requests/notifications──▶ agent
//!                          └────────┘
//! ```
//! SDK handlers never block: they forward to the actor and return, because a
//! handler holds the connection's dispatch loop until it finishes.

use std::collections::HashMap;
use std::path::PathBuf;
use std::pin::Pin;
use std::sync::atomic::{AtomicBool, AtomicU64, Ordering};
use std::sync::Arc;
use std::time::{Duration, Instant};

use agent_client_protocol::schema::v1::{
    CancelNotification, ClientCapabilities, ContentBlock, Implementation, InitializeRequest,
    LoadSessionRequest, NewSessionRequest, PromptRequest, PromptResponse, RequestPermissionOutcome,
    RequestPermissionRequest, RequestPermissionResponse, SelectedPermissionOutcome, SessionId,
    SetSessionConfigOptionRequest, SetSessionModeRequest, TextContent,
};
use agent_client_protocol::schema::ProtocolVersion;
use agent_client_protocol::{Agent, ConnectionTo, Responder, UntypedMessage};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use tokio::sync::mpsc;

use super::map::{Change, Transcript};
use super::model::{Entry, SessionMeta};
use super::transport::{self, Dir};
use crate::agents::AgentSpec;

/// How long an agent gets to answer `initialize` — `npx` may be downloading.
const INIT_TIMEOUT: Duration = Duration::from_secs(180);
const FLUSH_EVERY: Duration = Duration::from_millis(33);
/// Checkpoint still-streaming entries to the database this often.
const CHECKPOINT_EVERY: u32 = 60; // × FLUSH_EVERY ≈ 2s

#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize, specta::Type)]
#[serde(rename_all = "snake_case")]
pub enum Status {
    Starting,
    Idle,
    Running,
    AwaitingPermission,
    Error,
    Exited,
}

pub enum SessionCmd {
    Prompt(String),
    Cancel,
    SetOption {
        id: String,
        value: String,
    },
    ResolvePermission {
        request_id: String,
        option_id: Option<String>,
    },
    Shutdown,
}

/// Where a session's output goes. The app implements it with the EventBus
/// and SQLite; tests record into memory.
pub trait Sink: Send + Sync + 'static {
    fn changes(&self, key: &str, changes: Vec<Change>);
    fn status(&self, key: &str, status: Status, detail: Option<&str>, meta: &SessionMeta);
    fn persist(&self, key: &str, entries: Vec<(usize, Entry)>);
    /// The agent's own session id, for `session/load` after a restart.
    fn agent_session(&self, key: &str, agent_session_id: &str);
    fn rpc(&self, key: &str, dir: Dir, line: &str);
    fn workspace_dirty(&self, key: &str);
}

pub struct SessionSpec {
    /// Splash's id for the session.
    pub key: String,
    pub agent: &'static AgentSpec,
    pub cwd: PathBuf,
    pub extra_args: Vec<String>,
    /// The agent session to resume, if we have one.
    pub resume: Option<String>,
    /// The transcript so far (from the database).
    pub history: Vec<Entry>,
}

enum Inbound {
    Update(Value),
    Permission {
        id: String,
        params: Value,
        // Boxed: the responder dwarfs the other variants.
        responder: Box<Responder<RequestPermissionResponse>>,
    },
    Options(Value),
    Error(String),
    Exited(String),
}

type PromptFut = Pin<
    Box<
        dyn std::future::Future<Output = Result<PromptResponse, agent_client_protocol::Error>>
            + Send,
    >,
>;

/// Start a session; returns the command channel. The task ends on
/// `Shutdown`, when the agent exits, or when every sender is dropped.
pub fn start(spec: SessionSpec, sink: Arc<dyn Sink>) -> mpsc::UnboundedSender<SessionCmd> {
    let (tx, rx) = mpsc::unbounded_channel();
    tokio::spawn(run(spec, rx, sink));
    tx
}

async fn run(
    spec: SessionSpec,
    mut cmds: mpsc::UnboundedReceiver<SessionCmd>,
    sink: Arc<dyn Sink>,
) {
    let key = spec.key.clone();
    let mut transcript = Transcript::restore(spec.history);
    sink.status(&key, Status::Starting, None, &transcript.meta);

    let tap = {
        let sink = sink.clone();
        let key = key.clone();
        Arc::new(move |dir: Dir, line: &str| sink.rpc(&key, dir, line)) as transport::Tap
    };
    let (conn, mut process) = match transport::spawn(spec.agent, &spec.cwd, &spec.extra_args, tap) {
        Ok(pair) => pair,
        Err(e) => {
            fail(
                &*sink,
                &key,
                &mut transcript,
                &format!("Couldn't start {}: {e}", spec.agent.name),
            );
            return;
        }
    };

    let (in_tx, mut inbound) = mpsc::unbounded_channel::<Inbound>();
    // While `session/load` replays history we already have, drop transcript updates.
    let replaying = Arc::new(AtomicBool::new(false));
    let next_request = Arc::new(AtomicU64::new(1));

    {
        let in_tx = in_tx.clone();
        let stderr = process.stderr.clone();
        let mut child = process.child.take().expect("fresh process has its child");
        tokio::spawn(async move {
            let status = child.wait().await;
            // Let stderr drain so the message has the reason.
            tokio::time::sleep(Duration::from_millis(100)).await;
            let tail = stderr
                .lock()
                .iter()
                .rev()
                .take(12)
                .rev()
                .cloned()
                .collect::<Vec<_>>()
                .join("\n");
            let code = status
                .map(|s| s.to_string())
                .unwrap_or_else(|e| e.to_string());
            let _ = in_tx.send(Inbound::Exited(if tail.is_empty() {
                code
            } else {
                format!("{code}\n{tail}")
            }));
        });
    }

    let spec_agent = spec.agent;
    let cwd = spec.cwd.clone();
    let resume = spec.resume.clone();
    let sink2 = sink.clone();
    let key2 = key.clone();
    let stderr_for_errors = process.stderr.clone();

    let result = agent_client_protocol::Client
        .builder()
        .on_receive_notification(
            {
                let in_tx = in_tx.clone();
                let replaying = replaying.clone();
                async move |msg: UntypedMessage, _cx| {
                    if msg.method == "session/update" {
                        let update = msg.params.get("update").cloned().unwrap_or(Value::Null);
                        let kind = update["sessionUpdate"].as_str().unwrap_or("");
                        let transcript_kind = !matches!(
                            kind,
                            "available_commands_update"
                                | "current_mode_update"
                                | "config_option_update"
                                | "usage_update"
                                | "session_info_update"
                        );
                        if !(replaying.load(Ordering::Acquire) && transcript_kind) {
                            let _ = in_tx.send(Inbound::Update(update));
                        }
                    }
                    Ok(())
                }
            },
            agent_client_protocol::on_receive_notification!(),
        )
        .on_receive_request(
            {
                let in_tx = in_tx.clone();
                let next_request = next_request.clone();
                async move |req: RequestPermissionRequest, responder, _cx| {
                    let id = next_request.fetch_add(1, Ordering::Relaxed).to_string();
                    let params = serde_json::to_value(&req).unwrap_or(Value::Null);
                    if let Err(e) = in_tx.send(Inbound::Permission { id, params, responder: Box::new(responder) }) {
                        // The actor is gone; refuse rather than leave the agent waiting.
                        if let Inbound::Permission { responder, .. } = e.0 {
                            let _ = responder.respond(RequestPermissionResponse::new(RequestPermissionOutcome::Cancelled));
                        }
                    }
                    Ok(())
                }
            },
            agent_client_protocol::on_receive_request!(),
        )
        .connect_with(conn, async move |cx: ConnectionTo<Agent>| {
            let sink = sink2;
            let key = key2;
            let outcome: Result<(), agent_client_protocol::Error> = async {

            let init = tokio::time::timeout(
                INIT_TIMEOUT,
                cx.send_request(
                    InitializeRequest::new(ProtocolVersion::V1)
                        .client_capabilities(ClientCapabilities::new())
                        .client_info(Implementation::new("splash", env!("CARGO_PKG_VERSION"))),
                )
                .block_task(),
            )
            .await
            .map_err(|_| agent_client_protocol::Error::internal_error().data("initialize timed out"))??;
            let can_load = init.agent_capabilities.load_session;

            let session_id: SessionId = match resume.filter(|_| can_load) {
                Some(prev) => {
                    replaying.store(true, Ordering::Release);
                    let loaded = cx
                        .send_request(LoadSessionRequest::new(SessionId::new(prev.clone()), cwd.clone()))
                        .block_task()
                        .await;
                    replaying.store(false, Ordering::Release);
                    match loaded {
                        Ok(resp) => {
                            transcript.set_session_state(&serde_json::to_value(&resp).unwrap_or_default());
                            SessionId::new(prev)
                        }
                        Err(e) => {
                            transcript.push(Entry::Divider {
                                text: format!("Couldn't resume the previous {} session ({e}); started a new one.", spec_agent.name),
                            });
                            new_session(&cx, &cwd, &mut transcript).await?
                        }
                    }
                }
                None => {
                    let had_history = !transcript.is_empty();
                    let sid = new_session(&cx, &cwd, &mut transcript).await?;
                    if had_history {
                        transcript.push(Entry::Divider {
                            text: format!("New {} session — the agent doesn't remember the conversation above.", spec_agent.name),
                        });
                    }
                    sid
                }
            };
            sink.agent_session(&key, &session_id.0);

            let mut status = Status::Idle;
            let mut detail: Option<String> = None;
            sink.status(&key, status, None, &transcript.meta);

            let mut prompt: Option<PromptFut> = None;
            let mut turn_started = Instant::now();
            let mut permissions: HashMap<String, Responder<RequestPermissionResponse>> = HashMap::new();
            let mut ticker = tokio::time::interval(FLUSH_EVERY);
            ticker.set_missed_tick_behavior(tokio::time::MissedTickBehavior::Delay);
            let mut ticks: u32 = 0;

            loop {
                let before = status;
                tokio::select! {
                    biased;
                    Some(msg) = inbound.recv() => match msg {
                        Inbound::Update(update) => {
                            let fx = transcript.apply(&update);
                            if fx.meta_changed {
                                sink.status(&key, status, detail.as_deref(), &transcript.meta);
                            }
                            if fx.workspace_dirty {
                                sink.workspace_dirty(&key);
                            }
                        }
                        Inbound::Permission { id, params, responder } => {
                            transcript.permission(&id, &params);
                            permissions.insert(id, *responder);
                            status = Status::AwaitingPermission;
                        }
                        Inbound::Options(resp) => {
                            if let Some(opts) = resp.get("configOptions") {
                                transcript.apply(&serde_json::json!({"sessionUpdate": "config_option_update", "configOptions": opts}));
                                sink.status(&key, status, detail.as_deref(), &transcript.meta);
                            }
                        }
                        Inbound::Error(text) => {
                            transcript.push(Entry::Error { text });
                        }
                        Inbound::Exited(why) => {
                            if prompt.is_some() {
                                transcript.end_turn("error", turn_started.elapsed().as_secs_f64() * 1000.0);
                            }
                            transcript.push(Entry::Error { text: format!("{} exited: {why}", spec_agent.name) });
                            flush(&*sink, &key, &mut transcript, true);
                            sink.status(&key, Status::Exited, Some(&why), &transcript.meta);
                            return Ok(());
                        }
                    },
                    result = async { prompt.as_mut().unwrap().await }, if prompt.is_some() => {
                        prompt = None;
                        let elapsed = turn_started.elapsed().as_secs_f64() * 1000.0;
                        for (_, r) in permissions.drain() {
                            let _ = r.respond(RequestPermissionResponse::new(RequestPermissionOutcome::Cancelled));
                        }
                        match result {
                            Ok(resp) => {
                                let reason = serde_json::to_value(resp.stop_reason).ok()
                                    .and_then(|v| v.as_str().map(String::from))
                                    .unwrap_or_else(|| "end_turn".into());
                                transcript.end_turn(&reason, elapsed);
                                status = Status::Idle;
                                detail = None;
                            }
                            Err(e) => {
                                transcript.end_turn("error", elapsed);
                                transcript.push(Entry::Error { text: e.to_string() });
                                status = Status::Error;
                                detail = Some(e.to_string());
                            }
                        }
                        sink.workspace_dirty(&key);
                    }
                    Some(cmd) = cmds.recv() => match cmd {
                        SessionCmd::Prompt(text) => {
                            if prompt.is_some() {
                                continue;
                            }
                            transcript.begin_turn(&text);
                            turn_started = Instant::now();
                            let req = PromptRequest::new(session_id.clone(), vec![ContentBlock::Text(TextContent::new(text))]);
                            prompt = Some(Box::pin(cx.send_request(req).block_task()));
                            status = Status::Running;
                            detail = None;
                        }
                        SessionCmd::Cancel => {
                            if prompt.is_some() {
                                let _ = cx.send_notification(CancelNotification::new(session_id.clone()));
                            }
                            for (id, r) in permissions.drain() {
                                let _ = r.respond(RequestPermissionResponse::new(RequestPermissionOutcome::Cancelled));
                                transcript.resolve_permission(&id, "cancelled");
                            }
                        }
                        SessionCmd::SetOption { id, value } => {
                            let legacy = transcript.meta.legacy_modes && id == "mode";
                            let cx = cx.clone();
                            let sid = session_id.clone();
                            let in_tx = in_tx.clone();
                            tokio::spawn(async move {
                                let resp = if legacy {
                                    cx.send_request(SetSessionModeRequest::new(sid, value.clone())).block_task().await
                                        .map(|_| serde_json::json!({}))
                                } else {
                                    cx.send_request(SetSessionConfigOptionRequest::new(sid, id, value.as_str())).block_task().await
                                        .map(|r| serde_json::to_value(r).unwrap_or_default())
                                };
                                match resp {
                                    Ok(_) if legacy => {
                                        let _ = in_tx.send(Inbound::Update(serde_json::json!({"sessionUpdate": "current_mode_update", "currentModeId": value})));
                                    }
                                    Ok(v) => { let _ = in_tx.send(Inbound::Options(v)); }
                                    Err(e) => {
                                        let _ = in_tx.send(Inbound::Error(format!("Couldn't change the setting: {e}")));
                                    }
                                }
                            });
                        }
                        SessionCmd::ResolvePermission { request_id, option_id } => {
                            if let Some(r) = permissions.remove(&request_id) {
                                let outcome = match &option_id {
                                    Some(id) => RequestPermissionOutcome::Selected(SelectedPermissionOutcome::new(id.clone())),
                                    None => RequestPermissionOutcome::Cancelled,
                                };
                                let _ = r.respond(RequestPermissionResponse::new(outcome));
                                transcript.resolve_permission(&request_id, option_id.as_deref().unwrap_or("cancelled"));
                            }
                            if permissions.is_empty() && status == Status::AwaitingPermission {
                                status = if prompt.is_some() { Status::Running } else { Status::Idle };
                            }
                        }
                        SessionCmd::Shutdown => break,
                    },
                    _ = ticker.tick() => {
                        ticks = ticks.wrapping_add(1);
                        flush(&*sink, &key, &mut transcript, ticks.is_multiple_of(CHECKPOINT_EVERY));
                    }
                    else => break,
                }
                if status != before {
                    flush(&*sink, &key, &mut transcript, false);
                    sink.status(&key, status, detail.as_deref(), &transcript.meta);
                }
            }
            flush(&*sink, &key, &mut transcript, true);
            Ok(())
            }
            .await;
            if let Err(e) = outcome {
                let tail = stderr_for_errors.lock().iter().cloned().collect::<Vec<_>>().join("\n");
                let msg = if tail.trim().is_empty() { e.to_string() } else { format!("{e}\n\n{tail}") };
                fail(&*sink, &key, &mut transcript, &msg);
            }
            Ok(())
        })
        .await;

    process.kill();
    if let Err(e) = result {
        // The connection itself broke (transport error) before our loop could report.
        sink.status(
            &key,
            Status::Error,
            Some(&e.to_string()),
            &SessionMeta::default(),
        );
    }
}

async fn new_session(
    cx: &ConnectionTo<Agent>,
    cwd: &std::path::Path,
    transcript: &mut Transcript,
) -> Result<SessionId, agent_client_protocol::Error> {
    let resp = cx
        .send_request(NewSessionRequest::new(cwd.to_path_buf()))
        .block_task()
        .await?;
    transcript.set_session_state(&serde_json::to_value(&resp).unwrap_or_default());
    Ok(resp.session_id)
}

fn flush(sink: &dyn Sink, key: &str, transcript: &mut Transcript, checkpoint: bool) {
    let changes = transcript.flush();
    if !changes.is_empty() {
        sink.changes(key, changes);
    }
    let unsaved = transcript.take_unsaved(checkpoint);
    if !unsaved.is_empty() {
        sink.persist(key, unsaved);
    }
}

fn fail(sink: &dyn Sink, key: &str, transcript: &mut Transcript, msg: &str) {
    transcript.push(Entry::Error {
        text: msg.to_string(),
    });
    flush(sink, key, transcript, true);
    sink.status(key, Status::Error, Some(msg), &transcript.meta);
}
