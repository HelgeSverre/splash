//! A fake ACP agent that replays a recorded fixture, for deterministic tests.
//!
//! fake-acp <fixture.jsonl>      (FAKE_ACP_SPEED=10 replays 10× faster; 0 = no delays)
//!
//! Answers `initialize` / `session/new` / `session/load` with the recorded
//! results, and each `session/prompt` with the recorded turn: its updates (with
//! the recorded gaps), its permission requests (waiting for our answer), and
//! finally the recorded stop reason. `session/cancel` cuts the turn short.

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
    let path = std::env::args()
        .nth(1)
        .expect("usage: fake-acp <fixture.jsonl>");
    let speed: f64 = std::env::var("FAKE_ACP_SPEED")
        .ok()
        .and_then(|s| s.parse().ok())
        .unwrap_or(10.0);
    let rows: Vec<Value> = std::fs::read_to_string(&path)
        .expect("fixture")
        .lines()
        .filter(|l| !l.trim().is_empty())
        .map(|l| serde_json::from_str(l).expect("row"))
        .collect();

    let result_of = |method: &str| -> Value {
        let id = rows
            .iter()
            .find(|r| r["dir"] == "out" && r["line"]["method"] == method)
            .map(|r| r["line"]["id"].clone());
        id.and_then(|id| {
            rows.iter().find(|r| {
                r["dir"] == "in" && r["line"]["id"] == id && r["line"].get("method").is_none()
            })
        })
        .map(|r| r["line"]["result"].clone())
        .unwrap_or(json!({}))
    };
    let init = result_of("initialize");
    let new_session = result_of("session/new");
    let listed = result_of("session/list");
    let replay: Vec<Value> = rows
        .iter()
        .filter(|r| r["dir"] == "in" && r["line"]["method"] == "session/update")
        .map(|r| r["line"].clone())
        .collect();
    let has_load = rows.iter().any(|r| r["line"]["method"] == "session/load");
    let recorded_sid = new_session["sessionId"].clone();
    let turns = extract_turns(&rows);
    let mut turns = turns.into_iter();

    let (tx, mut rx) = mpsc::unbounded_channel::<Value>();
    tokio::spawn(async move {
        let mut lines = BufReader::new(tokio::io::stdin()).lines();
        while let Ok(Some(line)) = lines.next_line().await {
            if let Ok(v) = serde_json::from_str::<Value>(&line) {
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
        match method {
            "initialize" => send(json!({"jsonrpc": "2.0", "id": id, "result": init})),
            "session/new" => send(json!({"jsonrpc": "2.0", "id": id, "result": new_session})),
            "session/list" => {
                let result = if msg["params"]["cursor"] == "page-2" {
                    json!({"sessions":[]})
                } else {
                    listed.clone()
                };
                send(json!({"jsonrpc":"2.0", "id":id, "result":result}));
            }
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
                if has_load {
                    for notification in &replay {
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
            "session/prompt" => {
                let sid = msg["params"]["sessionId"].clone();
                let Some(turn) = turns.next() else {
                    send(json!({"jsonrpc": "2.0", "id": id, "result": {"stopReason": "end_turn"}}));
                    continue;
                };
                let mut cancelled = false;
                'steps: for (delay, mut step) in turn.steps {
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

fn send(v: Value) {
    let mut out = std::io::stdout().lock();
    let _ = writeln!(out, "{v}");
    let _ = out.flush();
}
