//! M0 spike: drive one ACP agent headless, print what streams back, and record
//! the raw JSON-RPC as a fixture.
//!
//! cargo run --bin spike -- <agent> <dir> "<prompt>" [--allow|--reject] [--cancel-after SECS] [--record NAME]

use std::io::Write;
use std::path::PathBuf;
use std::sync::Arc;
use std::time::{Duration, Instant};

use agent_client_protocol::schema::v1::{
    CancelNotification, ContentBlock, InitializeRequest, NewSessionRequest, PermissionOptionKind,
    PromptRequest, RequestPermissionOutcome, RequestPermissionRequest, RequestPermissionResponse,
    SelectedPermissionOutcome, TextContent,
};
use agent_client_protocol::schema::ProtocolVersion;
use agent_client_protocol::{Agent, ConnectionTo, UntypedMessage};
use parking_lot::Mutex;
use splash::acp::transport::{self, Dir};
use splash::agents;

#[tokio::main]
async fn main() {
    let args: Vec<String> = std::env::args().skip(1).collect();
    if args.first().map(String::as_str) == Some("--detect") {
        let t = Instant::now();
        let all = agents::detect::detect_all().await;
        eprintln!("detect took {:.1}s", t.elapsed().as_secs_f32());
        for a in &all {
            println!(
                "{:<6} installed={} ready={} version={:?} auth={:?} {:?}",
                a.id,
                a.installed,
                a.ready(),
                a.version,
                a.auth,
                a.auth_detail
            );
        }
        let probes =
            futures::future::join_all(agents::AGENTS.iter().map(|s| agents::probe::probe(s, &[])))
                .await;
        for (s, p) in agents::AGENTS.iter().zip(probes) {
            println!(
                "{:<6} probe ok={} {:?} {:?} load={} img={} options={:?} commands={} {:.0}ms err={:?}",
                s.id, p.ok, p.agent_name, p.agent_version, p.load_session, p.image,
                p.options.iter().map(|o| format!("{}={}", o.id, o.current)).collect::<Vec<_>>(),
                p.commands.len(), p.duration_ms, p.error.as_deref().map(|e| e.chars().take(120).collect::<String>())
            );
        }
        return;
    }
    let flag = |f: &str| args.iter().any(|a| a == f);
    let value = |f: &str| {
        args.iter()
            .position(|a| a == f)
            .and_then(|i| args.get(i + 1).cloned())
    };
    let positional: Vec<&String> = {
        let mut skip = false;
        args.iter()
            .filter(|a| {
                if skip {
                    skip = false;
                    return false;
                }
                if *a == "--cancel-after" || *a == "--record" {
                    skip = true;
                    return false;
                }
                !a.starts_with("--")
            })
            .collect()
    };
    let [agent, dir, prompt] = positional[..] else {
        eprintln!("usage: spike <agent> <dir> <prompt> [--allow|--reject] [--cancel-after S] [--record NAME]");
        std::process::exit(2);
    };
    let spec = agents::registry::find(agent).expect("unknown agent");
    let cwd = PathBuf::from(dir).canonicalize().expect("dir");
    let allow = !flag("--reject");
    let cancel_after = value("--cancel-after").and_then(|s| s.parse::<u64>().ok());

    let started = Instant::now();
    let record: Arc<Mutex<Vec<String>>> = Arc::new(Mutex::new(Vec::new()));
    let tap = {
        let record = record.clone();
        Arc::new(move |dir: Dir, line: &str| {
            let t = started.elapsed().as_millis();
            let arrow = if dir == Dir::Out { ">>" } else { "<<" };
            let short: String = line.chars().take(220).collect();
            eprintln!("\x1b[2m{t:>6} {arrow} {short}\x1b[0m");
            record.lock().push(
                serde_json::json!({"t": t, "dir": dir, "line": serde_json::from_str::<serde_json::Value>(line).unwrap_or(line.into())})
                    .to_string(),
            );
        }) as transport::Tap
    };

    let (conn, proc) = transport::spawn(
        spec,
        &cwd,
        &std::env::var("SPLASH_EXTRA_ARGS")
            .map(|s| s.split_whitespace().map(String::from).collect::<Vec<_>>())
            .unwrap_or_default(),
        tap,
    )
    .expect("spawn");
    eprintln!("spawned {} (pgid {})", spec.name, proc.pgid);

    let result = agent_client_protocol::Client
        .builder()
        .on_receive_notification(
            async move |msg: UntypedMessage, _cx| {
                if msg.method == "session/update" {
                    let update = &msg.params["update"];
                    let kind = update["sessionUpdate"].as_str().unwrap_or("?");
                    match kind {
                        "agent_message_chunk" | "agent_thought_chunk" => {
                            let text = update["content"]["text"].as_str().unwrap_or("");
                            if kind == "agent_thought_chunk" {
                                print!("\x1b[3;90m{text}\x1b[0m");
                            } else {
                                print!("{text}");
                            }
                            let _ = std::io::stdout().flush();
                        }
                        other => println!("\n\x1b[36m[{other}]\x1b[0m {}", short(update)),
                    }
                } else {
                    println!("\n\x1b[35m[notification {}]\x1b[0m", msg.method);
                }
                Ok(())
            },
            agent_client_protocol::on_receive_notification!(),
        )
        .on_receive_request(
            async move |req: RequestPermissionRequest, responder, _cx| {
                let wanted = if allow {
                    [
                        PermissionOptionKind::AllowOnce,
                        PermissionOptionKind::AllowAlways,
                    ]
                } else {
                    [
                        PermissionOptionKind::RejectOnce,
                        PermissionOptionKind::RejectAlways,
                    ]
                };
                let pick = req
                    .options
                    .iter()
                    .find(|o| wanted.contains(&o.kind))
                    .map(|o| o.option_id.clone());
                println!(
                    "\n\x1b[33m[permission]\x1b[0m {:?} -> {}",
                    req.tool_call.fields.title,
                    if allow { "allow" } else { "reject" }
                );
                responder.respond(RequestPermissionResponse::new(match pick {
                    Some(id) => {
                        RequestPermissionOutcome::Selected(SelectedPermissionOutcome::new(id))
                    }
                    None => RequestPermissionOutcome::Cancelled,
                }))
            },
            agent_client_protocol::on_receive_request!(),
        )
        .connect_with(conn, async move |cx: ConnectionTo<Agent>| {
            let init = cx
                .send_request(InitializeRequest::new(ProtocolVersion::V1))
                .block_task()
                .await?;
            eprintln!(
                "initialized: {:?} load_session={}",
                init.agent_info.as_ref().map(|i| (&i.name, &i.version)),
                init.agent_capabilities.load_session
            );
            let session = cx
                .send_request(NewSessionRequest::new(cwd.clone()))
                .block_task()
                .await?;
            let sid = session.session_id.clone();
            eprintln!(
                "session {} modes={:?} config={}",
                sid.0,
                session.modes.as_ref().map(|m| m
                    .available_modes
                    .iter()
                    .map(|m| m.id.0.to_string())
                    .collect::<Vec<_>>()),
                session
                    .config_options
                    .as_ref()
                    .map(|c| c.len())
                    .unwrap_or(0)
            );

            if let Some(secs) = cancel_after {
                let cx2 = cx.clone();
                let sid2 = sid.clone();
                tokio::spawn(async move {
                    tokio::time::sleep(Duration::from_secs(secs)).await;
                    eprintln!("\n-- cancelling --");
                    let _ = cx2.send_notification(CancelNotification::new(sid2));
                });
            }

            let resp = cx
                .send_request(PromptRequest::new(
                    sid,
                    vec![ContentBlock::Text(TextContent::new(prompt.to_string()))],
                ))
                .block_task()
                .await?;
            println!("\n\x1b[32m[done]\x1b[0m stop_reason={:?}", resp.stop_reason);
            Ok(())
        })
        .await;

    if let Err(e) = result {
        eprintln!("error: {e:?}\nstderr:\n{}", proc.stderr_tail());
    }
    proc.kill();
    eprintln!("elapsed {:.1}s", started.elapsed().as_secs_f32());

    if let Some(name) = value("--record") {
        let path = PathBuf::from(format!("fixtures/{}/{name}.jsonl", spec.id));
        std::fs::create_dir_all(path.parent().unwrap()).unwrap();
        std::fs::write(&path, record.lock().join("\n") + "\n").unwrap();
        eprintln!("recorded {}", path.display());
    }
    // Give the SIGKILL follow-up thread a moment, then check for leftovers.
    tokio::time::sleep(Duration::from_millis(1700)).await;
}

fn short(v: &serde_json::Value) -> String {
    let s = v.to_string();
    s.chars().take(300).collect()
}
