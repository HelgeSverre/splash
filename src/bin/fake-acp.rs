//! A fake ACP agent that replays a recorded fixture, for deterministic tests.
//!
//! fake-acp <fixture.jsonl>      (FAKE_ACP_SPEED=10 replays 10× faster; 0 = no delays)
//!
//! Answers `initialize` / `session/new` / `session/load` with the recorded
//! results, and each `session/prompt` with the recorded turn: its updates (with
//! the recorded gaps), its permission requests (waiting for our answer), and
//! finally the recorded stop reason. `session/cancel` cuts the turn short.
//!
//! Test flags: `--apply-diffs` writes each completed edit's new text to disk,
//! `--exit-mid-turn N` dies after N steps of the first turn, `--hang-new`
//! accepts `session/new` without answering, `--fail-prompt` answers every
//! prompt with an error, `--wait-initialize FILE` waits for FILE before
//! answering initialization, `--trace FILE` logs every message sent,
//! `--announce-commands` sends the
//! recording's slash commands right after `session/new`, as adapters do (so a
//! handshake probe sees them).
//!
//! History: `session/list` answers with the recorded page whose request had
//! the same `cursor` (an unrecorded `page-2` is empty), and `session/load`
//! replays the updates recorded before that session's load result (an
//! unrecorded session ID replays the first recorded load).

use std::io::Write;
use std::time::Duration;

use serde_json::{json, Value};
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::sync::mpsc;

struct Turn {
    /// (delay since previous step in ms, message from the agent)
    steps: Vec<(u64, Value)>,
    stop_reason: Value,
}

#[tokio::main(flavor = "current_thread")]
async fn main() {
    let args: Vec<String> = std::env::args().collect();
    let option = |name: &str| {
        args.iter()
            .position(|s| s == name)
            .and_then(|i| args.get(i + 1))
            .cloned()
    };
    if args.iter().any(|arg| arg == "--fail-initialize") {
        eprintln!("adapter executable missing: reinstall the adapter");
        std::process::exit(127);
    }
    if let Some(path) = option("--heartbeat-child") {
        loop {
            let mut file = std::fs::OpenOptions::new()
                .create(true)
                .append(true)
                .open(&path)
                .unwrap();
            file.write_all(b".").unwrap();
            tokio::time::sleep(Duration::from_millis(20)).await;
        }
    }
    if let Some(path) = option("--spawn-heartbeat-child") {
        let mut child = std::process::Command::new(std::env::current_exe().unwrap())
            .args(["--heartbeat-child", &path])
            .spawn()
            .unwrap();
        let _ = child.wait();
        return;
    }
    let audit = option("--audit");
    let _ = TRACE.set(option("--trace"));
    let apply_diffs = args.iter().any(|s| s == "--apply-diffs");
    let exit_mid_turn: Option<usize> = option("--exit-mid-turn").and_then(|n| n.parse().ok());
    let wait_initialize = option("--wait-initialize");
    let mut first_turn = true;
    let required_root = option("--require-root");
    let state = option("--state");
    let path = std::env::args()
        .nth(1)
        .expect("usage: fake-acp <fixture.jsonl>");
    let speed: f64 = std::env::var("FAKE_ACP_SPEED")
        .ok()
        .and_then(|s| s.parse().ok())
        .unwrap_or(10.0);
    let mut rows: Vec<Value> = std::fs::read_to_string(&path)
        .expect("fixture")
        .lines()
        .filter(|l| !l.trim().is_empty())
        .map(|l| serde_json::from_str(l).expect("row"))
        .collect();
    fn substitute(value: &mut Value, cwd: &str) {
        match value {
            Value::String(s) => *s = s.replace("$CWD", cwd),
            Value::Array(items) => items.iter_mut().for_each(|v| substitute(v, cwd)),
            Value::Object(map) => map.values_mut().for_each(|v| substitute(v, cwd)),
            _ => {}
        }
    }
    let cwd = std::env::current_dir()
        .unwrap()
        .to_string_lossy()
        .into_owned();
    for row in &mut rows {
        substitute(row, &cwd);
    }
    let mut deleted: Vec<String> = state
        .as_ref()
        .and_then(|path| std::fs::read_to_string(path).ok())
        .and_then(|s| serde_json::from_str(&s).ok())
        .unwrap_or_default();

    let is_response = |r: &Value, id: &Value| {
        r["dir"] == "in" && r["line"]["id"] == *id && r["line"].get("method").is_none()
    };
    let response_to = |id: &Value| -> Value {
        rows.iter()
            .find(|r| is_response(r, id))
            .map(|r| r["line"]["result"].clone())
            .unwrap_or(json!({}))
    };
    let requests = |method: &str| -> Vec<(usize, &Value)> {
        rows.iter()
            .enumerate()
            .filter(|(_, r)| r["dir"] == "out" && r["line"]["method"] == method)
            .map(|(i, r)| (i, &r["line"]))
            .collect()
    };
    let result_of = |method: &str| -> Value {
        requests(method)
            .first()
            .map(|(_, line)| response_to(&line["id"]))
            .unwrap_or(json!({}))
    };
    let init = result_of("initialize");
    let new_session = result_of("session/new");
    // Updates the agent sent while creating the session, before and after its
    // result and before the first prompt (notices, command lists).
    let (notices_before, notices_after) = {
        let start = rows
            .iter()
            .position(|r| r["dir"] == "out" && r["line"]["method"] == "session/new");
        let mut before = Vec::new();
        let mut after = Vec::new();
        let mut answered = false;
        for r in start.map_or(&rows[..0], |i| &rows[i + 1..]) {
            if r["dir"] == "out" {
                break;
            }
            if r["line"]["method"] == "session/update" {
                if answered { &mut after } else { &mut before }.push(r["line"].clone());
            } else if r["line"].get("result").is_some() {
                answered = true;
            }
        }
        (before, after)
    };
    let listed = result_of("session/list");
    // Recorded list pages, by the cursor they were asked for (null: the first).
    let pages: Vec<(Value, Value)> = requests("session/list")
        .into_iter()
        .map(|(_, line)| (line["params"]["cursor"].clone(), response_to(&line["id"])))
        .collect();
    // Recorded loads: the session asked for and the updates sent before the result.
    let loads: Vec<(Value, Vec<Value>)> = requests("session/load")
        .into_iter()
        .map(|(i, line)| {
            let updates = rows[i + 1..]
                .iter()
                .take_while(|r| !is_response(r, &line["id"]))
                .filter(|r| r["dir"] == "in" && r["line"]["method"] == "session/update")
                .map(|r| r["line"].clone())
                .collect();
            (line["params"]["sessionId"].clone(), updates)
        })
        .collect();
    let announce = args
        .iter()
        .any(|s| s == "--announce-commands")
        .then(|| {
            rows.iter().find(|r| {
                r["dir"] == "in"
                    && r["line"]["params"]["update"]["sessionUpdate"] == "available_commands_update"
            })
        })
        .flatten()
        .map(|r| r["line"].clone());
    let recorded_sid = new_session["sessionId"].clone();
    let turns = extract_turns(&rows);
    let mut turns = turns.into_iter();

    let (tx, mut rx) = mpsc::unbounded_channel::<Value>();
    // Every message is audited as it arrives, including permission answers
    // and cancels read in the middle of a turn.
    let audit_path = audit.clone();
    tokio::spawn(async move {
        let mut lines = BufReader::new(tokio::io::stdin()).lines();
        while let Ok(Some(line)) = lines.next_line().await {
            if let Ok(v) = serde_json::from_str::<Value>(&line) {
                if let Some(path) = &audit_path {
                    let mut file = std::fs::OpenOptions::new()
                        .create(true)
                        .append(true)
                        .open(path)
                        .unwrap();
                    writeln!(file, "{v}").unwrap();
                }
                if tx.send(v).is_err() {
                    break;
                }
            }
        }
    });

    let mut next_id = 1000u64;
    while let Some(msg) = rx.recv().await {
        let Some(method) = msg["method"].as_str() else {
            continue;
        };
        let id = msg["id"].clone();
        if matches!(
            method,
            "session/new" | "session/load" | "session/resume" | "session/fork"
        ) {
            if let Some(root) = &required_root {
                if !msg["params"]["additionalDirectories"]
                    .as_array()
                    .is_some_and(|roots| roots.contains(&json!(root)))
                {
                    send(
                        json!({"jsonrpc":"2.0", "id":id, "error":{"code":-32602,"message":"Required workspace root was lost"}}),
                    );
                    continue;
                }
            }
        }
        if method == "session/load" && args.iter().any(|s| s == "--fail-load") {
            send(
                json!({"jsonrpc":"2.0", "id":id, "error":{"code":-32603,"message":"Replay failed"}}),
            );
            continue;
        }
        match method {
            "initialize" if wait_initialize.is_some() => {
                let release = wait_initialize.as_deref().unwrap_or_default();
                let _ = std::fs::write(format!("{release}.ready"), "");
                while !std::path::Path::new(release).exists() {
                    tokio::time::sleep(Duration::from_millis(10)).await;
                }
                send(json!({"jsonrpc": "2.0", "id": id, "result": init}));
            }
            "initialize" => send(json!({"jsonrpc": "2.0", "id": id, "result": init})),
            "session/new" if args.iter().any(|s| s == "--hang-new") => {}
            "session/new" => {
                notices_before.iter().cloned().for_each(send);
                send(json!({"jsonrpc": "2.0", "id": id, "result": new_session}));
                notices_after.iter().cloned().for_each(send);
                if let Some(mut update) = announce.clone() {
                    update["params"]["sessionId"] = new_session["sessionId"].clone();
                    send(update);
                }
            }
            "session/list" => {
                let cursor = &msg["params"]["cursor"];
                let mut result = match pages.iter().find(|(c, _)| c == cursor) {
                    Some((_, page)) => page.clone(),
                    None if cursor == "page-2" => json!({"sessions":[]}),
                    None => listed.clone(),
                };
                if let Some(sessions) = result["sessions"].as_array_mut() {
                    sessions.retain(|s| !deleted.iter().any(|id| s["sessionId"] == *id));
                }
                send(json!({"jsonrpc":"2.0", "id":id, "result":result}));
            }
            "session/close" => {
                if !args.iter().any(|s| s == "--hang-close") {
                    send(json!({"jsonrpc":"2.0", "id":id, "result":{}}));
                }
            }
            "session/delete" => {
                if args.iter().any(|s| s == "--fail-delete") {
                    send(
                        json!({"jsonrpc":"2.0", "id":id, "error":{"code":-32603,"message":"Delete failed"}}),
                    );
                } else {
                    if let Some(id) = msg["params"]["sessionId"].as_str() {
                        deleted.push(id.into());
                    }
                    if let Some(path) = &state {
                        std::fs::write(path, serde_json::to_string(&deleted).unwrap()).unwrap();
                    }
                    send(json!({"jsonrpc":"2.0", "id":id, "result":{}}));
                }
            }
            "session/fork" => send(
                json!({"jsonrpc":"2.0", "id":id, "result":{"sessionId": format!("fork-{}", uuid::Uuid::new_v4())}}),
            ),
            "session/resume" if msg["params"]["sessionId"] == "missing-session" => send(
                json!({"jsonrpc":"2.0", "id":id, "error":{"code":-32602,"message":"Session not found"}}),
            ),
            "session/resume" => send(json!({"jsonrpc":"2.0", "id":id, "result":{}})),
            "session/load" => {
                if msg["params"]["sessionId"] == "missing-session" {
                    send(
                        json!({"jsonrpc":"2.0", "id":id, "error":{"code":-32602,"message":"Session not found"}}),
                    );
                    continue;
                }
                let load = loads
                    .iter()
                    .find(|(sid, _)| *sid == msg["params"]["sessionId"])
                    .or(loads.first());
                if let Some((_, replay)) = load {
                    for notification in replay {
                        let mut notification = notification.clone();
                        notification["params"]["sessionId"] = msg["params"]["sessionId"].clone();
                        send(notification);
                    }
                }
                let mut r = new_session.clone();
                r.as_object_mut().map(|o| o.remove("sessionId"));
                send(json!({"jsonrpc": "2.0", "id": id, "result": r}));
            }
            "session/set_config_option" => {
                let (cfg, val) = (
                    msg["params"]["configId"].clone(),
                    msg["params"]["value"].clone(),
                );
                let mut opts = new_session["configOptions"].clone();
                for o in opts.as_array_mut().into_iter().flatten() {
                    if o["id"] == cfg {
                        o["currentValue"] = val.clone();
                    }
                }
                send(json!({"jsonrpc": "2.0", "id": id, "result": {"configOptions": opts}}));
            }
            "session/set_mode" => send(json!({"jsonrpc": "2.0", "id": id, "result": {}})),
            "session/prompt" if args.iter().any(|s| s == "--fail-prompt") => send(
                json!({"jsonrpc":"2.0", "id":id, "error":{"code":-32603,"message":"Internal error: the model is unavailable"}}),
            ),
            "session/prompt" => {
                let sid = msg["params"]["sessionId"].clone();
                let exit_after = exit_mid_turn.filter(|_| std::mem::take(&mut first_turn));
                let Some(turn) = turns.next() else {
                    send(json!({"jsonrpc": "2.0", "id": id, "result": {"stopReason": "end_turn"}}));
                    continue;
                };
                let mut cancelled = false;
                'steps: for (n, (delay, mut step)) in turn.steps.into_iter().enumerate() {
                    if exit_after == Some(n) {
                        eprintln!("fake-acp: lost connection to the model provider");
                        std::process::exit(1);
                    }
                    if speed > 0.0 {
                        let wait = Duration::from_millis((delay as f64 / speed) as u64);
                        // Watch for a cancel while waiting.
                        let deadline = tokio::time::Instant::now() + wait;
                        loop {
                            tokio::select! {
                                _ = tokio::time::sleep_until(deadline) => break,
                                Some(m) = rx.recv() => if m["method"] == "session/cancel" { cancelled = true; break 'steps; },
                            }
                        }
                    }
                    if step["params"].get("sessionId").is_some() {
                        step["params"]["sessionId"] = sid.clone();
                    }
                    if step.get("id").is_some() {
                        // A request to us (permission): fresh id, wait for the answer.
                        next_id += 1;
                        step["id"] = json!(next_id);
                        send(step);
                        loop {
                            let Some(m) = rx.recv().await else { return };
                            if m["method"] == "session/cancel" {
                                cancelled = true;
                                break 'steps;
                            }
                            if m["id"] == json!(next_id) && m.get("method").is_none() {
                                break;
                            }
                        }
                    } else {
                        if apply_diffs {
                            write_diffs(&step);
                        }
                        send(step);
                    }
                }
                let _ = &recorded_sid;
                let stop = if cancelled {
                    json!("cancelled")
                } else {
                    turn.stop_reason
                };
                send(json!({"jsonrpc": "2.0", "id": id, "result": {"stopReason": stop}}));
            }
            _ if !id.is_null() => send(
                json!({"jsonrpc": "2.0", "id": id, "error": {"code": -32601, "message": "method not found"}}),
            ),
            _ => {}
        }
    }
}

fn extract_turns(rows: &[Value]) -> Vec<Turn> {
    let mut turns = Vec::new();
    let mut i = 0;
    while i < rows.len() {
        let r = &rows[i];
        if r["dir"] == "out" && r["line"]["method"] == "session/prompt" {
            let prompt_id = r["line"]["id"].clone();
            let mut last_t = r["t"].as_u64().unwrap_or(0);
            let mut steps = Vec::new();
            let mut stop = json!("end_turn");
            i += 1;
            while i < rows.len() {
                let r = &rows[i];
                let line = &r["line"];
                if r["dir"] == "in" {
                    if line["id"] == prompt_id && line.get("method").is_none() {
                        stop = line["result"]["stopReason"].clone();
                        break;
                    }
                    if line.get("method").is_some() {
                        let t = r["t"].as_u64().unwrap_or(last_t);
                        steps.push((t.saturating_sub(last_t), line.clone()));
                        last_t = t;
                    }
                }
                i += 1;
            }
            turns.push(Turn {
                steps,
                stop_reason: stop,
            });
        }
        i += 1;
    }
    turns
}

/// A completed tool call's diff content, written to disk like a real edit.
fn write_diffs(step: &Value) {
    let update = &step["params"]["update"];
    if update["status"] != "completed" {
        return;
    }
    for item in update["content"].as_array().into_iter().flatten() {
        if let (Some("diff"), Some(path), Some(text)) = (
            item["type"].as_str(),
            item["path"].as_str(),
            item["newText"].as_str(),
        ) {
            let _ = std::fs::write(path, text);
        }
    }
}

/// `--trace <file>`: every message sent, as the audit logs every one received.
static TRACE: std::sync::OnceLock<Option<String>> = std::sync::OnceLock::new();

fn send(v: Value) {
    if let Some(path) = TRACE.get().and_then(Option::as_ref) {
        if let Ok(mut file) = std::fs::OpenOptions::new()
            .create(true)
            .append(true)
            .open(path)
        {
            let _ = writeln!(file, "{v}");
        }
    }
    let mut out = std::io::stdout().lock();
    let _ = writeln!(out, "{v}");
    let _ = out.flush();
}
