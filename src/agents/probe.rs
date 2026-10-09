//! The free ACP handshake: `initialize` + `session/new` in a scratch
//! directory, recording what the agent can do. No prompt is sent, so no tokens
//! are spent. It also warms the `npx` cache for adapters.

use std::sync::Arc;
use std::time::{Duration, Instant};

use agent_client_protocol::schema::v1::{
    ClientCapabilities, Implementation, InitializeRequest, NewSessionRequest,
};
use agent_client_protocol::schema::ProtocolVersion;
use agent_client_protocol::{Agent, ConnectionTo, UntypedMessage};
use parking_lot::Mutex;
use serde::{Deserialize, Serialize};
use serde_json::Value;

use crate::acp::map::Transcript;
use crate::acp::model::{ConfigOption, SlashCommand};
use crate::acp::transport;
use crate::agents::AgentSpec;

#[derive(Clone, Debug, Default, PartialEq, Serialize, Deserialize, specta::Type)]
pub struct AgentProbe {
    pub ok: bool,
    pub error: Option<String>,
    pub agent_name: Option<String>,
    pub agent_version: Option<String>,
    pub protocol_version: Option<f64>,
    pub load_session: bool,
    #[serde(default)]
    pub list_sessions: bool,
    #[serde(default)]
    pub resume_session: bool,
    pub image: bool,
    pub audio: bool,
    pub embedded_context: bool,
    pub auth_methods: Vec<String>,
    pub options: Vec<ConfigOption>,
    pub commands: Vec<SlashCommand>,
    pub duration_ms: f64,
    pub probed_at: f64,
}

pub async fn probe(spec: &AgentSpec, extra_args: &[String]) -> AgentProbe {
    let started = Instant::now();
    let mut out = AgentProbe {
        probed_at: crate::store::now(),
        ..Default::default()
    };
    // Refresh all probes agents concurrently. A distinct cwd keeps adapters
    // which write project state from seeing another agent's handshake.
    let scratch = std::env::temp_dir().join(crate::store::new_id("splash-probe"));
    if let Err(e) = std::fs::create_dir_all(&scratch) {
        out.error = Some(format!("couldn't create temporary probe folder: {e}"));
        return out;
    }

    let (conn, mut process) =
        match transport::spawn(spec, &scratch, extra_args, Arc::new(|_, _| {})) {
            Ok(pair) => pair,
            Err(e) => {
                let _ = std::fs::remove_dir_all(&scratch);
                out.error = Some(e.to_string());
                return out;
            }
        };
    let commands: Arc<Mutex<Vec<SlashCommand>>> = Arc::default();
    let result: Arc<Mutex<Option<(Value, Value)>>> = Arc::default();
    let session_dir = scratch.clone();

    let run = agent_client_protocol::Client
        .builder()
        .on_receive_notification(
            {
                let commands = commands.clone();
                async move |msg: UntypedMessage, _cx| {
                    let update = &msg.params["update"];
                    if update["sessionUpdate"] == "available_commands_update" {
                        let mut t = Transcript::new();
                        t.apply(update);
                        *commands.lock() = t.meta.commands;
                    }
                    Ok(())
                }
            },
            agent_client_protocol::on_receive_notification!(),
        )
        .connect_with(conn, {
            let result = result.clone();
            let commands = commands.clone();
            async move |cx: ConnectionTo<Agent>| {
                let init = cx
                    .send_request(
                        InitializeRequest::new(ProtocolVersion::V1)
                            .client_capabilities(ClientCapabilities::new())
                            .client_info(Implementation::new("splash", env!("CARGO_PKG_VERSION"))),
                    )
                    .block_task()
                    .await?;
                let session = cx
                    .send_request(NewSessionRequest::new(session_dir))
                    .block_task()
                    .await?;
                // Commands arrive as a notification shortly after session/new.
                for _ in 0..30 {
                    if !commands.lock().is_empty() {
                        break;
                    }
                    tokio::time::sleep(Duration::from_millis(50)).await;
                }
                *result.lock() = Some((
                    serde_json::to_value(&init).unwrap_or_default(),
                    serde_json::to_value(&session).unwrap_or_default(),
                ));
                Ok(())
            }
        });

    let outcome = tokio::time::timeout(Duration::from_secs(180), run).await;
    process.kill();
    if let Some(child) = process.child.as_mut() {
        let _ = tokio::time::timeout(Duration::from_secs(1), child.wait()).await;
    }
    process.drain_stderr().await;
    let stderr = process.stderr_tail();
    match outcome {
        Err(_) => out.error = Some("timed out after 180s".into()),
        Ok(Err(e)) => {
            out.error = Some(if stderr.trim().is_empty() {
                e.to_string()
            } else {
                format!("{e}\n{stderr}")
            })
        }
        Ok(Ok(())) => {}
    }

    if let Some((init, session)) = result.lock().take() {
        out.ok = true;
        out.agent_name = init["agentInfo"]["title"]
            .as_str()
            .or(init["agentInfo"]["name"].as_str())
            .map(String::from);
        out.agent_version = init["agentInfo"]["version"].as_str().map(String::from);
        out.protocol_version = init["protocolVersion"].as_f64();
        let caps = &init["agentCapabilities"];
        out.load_session = caps["loadSession"].as_bool().unwrap_or(false);
        out.list_sessions = caps["sessionCapabilities"]["list"].is_object();
        out.resume_session = caps["sessionCapabilities"]["resume"].is_object();
        out.image = caps["promptCapabilities"]["image"]
            .as_bool()
            .unwrap_or(false);
        out.audio = caps["promptCapabilities"]["audio"]
            .as_bool()
            .unwrap_or(false);
        out.embedded_context = caps["promptCapabilities"]["embeddedContext"]
            .as_bool()
            .unwrap_or(false);
        out.auth_methods = init["authMethods"]
            .as_array()
            .into_iter()
            .flatten()
            .filter_map(|m| m["name"].as_str().or(m["id"].as_str()).map(String::from))
            .collect();
        let mut t = Transcript::new();
        t.set_session_state(&session);
        out.options = t.meta.options;
        out.commands = commands.lock().clone();
    }
    out.duration_ms = started.elapsed().as_secs_f64() * 1000.0;
    let _ = std::fs::remove_dir_all(&scratch);
    out
}
