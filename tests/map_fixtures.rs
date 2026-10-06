//! Replay recorded agent traffic through the mapper.

use serde_json::Value;
use splash::acp::map::{Change, Transcript};
use splash::acp::model::Entry;

/// Feed a fixture (`{t, dir, line}` per row) through a transcript the way the
/// session actor does.
fn replay(agent: &str, name: &str) -> Transcript {
    let path = format!(
        "{}/fixtures/{agent}/{name}.jsonl",
        env!("CARGO_MANIFEST_DIR")
    );
    let text = std::fs::read_to_string(&path).unwrap_or_else(|e| panic!("{path}: {e}"));
    let mut t = Transcript::new();
    let mut prompt_id = None;
    for row in text.lines().filter(|l| !l.trim().is_empty()) {
        let row: Value = serde_json::from_str(row).unwrap();
        let msg = &row["line"];
        match (row["dir"].as_str(), msg["method"].as_str()) {
            (Some("out"), Some("session/prompt")) => {
                prompt_id = Some(msg["id"].clone());
                t.begin_turn(msg["params"]["prompt"][0]["text"].as_str().unwrap_or(""));
            }
            (Some("in"), Some("session/update")) => {
                t.apply(&msg["params"]["update"]);
            }
            (Some("out"), None) if msg["result"].get("outcome").is_some() => {
                let outcome = &msg["result"]["outcome"];
                let choice = outcome["optionId"].as_str().unwrap_or("cancelled");
                t.resolve_permission(&msg["id"].to_string(), choice);
            }
            (Some("in"), Some("session/request_permission")) => {
                t.permission(&msg["id"].to_string(), &msg["params"]);
            }
            (Some("in"), None) if msg.get("result").is_some() => {
                let result = &msg["result"];
                if result.get("sessionId").is_some() {
                    t.set_session_state(result);
                }
                if Some(&msg["id"]) == prompt_id.as_ref() {
                    t.end_turn(result["stopReason"].as_str().unwrap_or("?"), 0.0);
                }
            }
            _ => {}
        }
    }
    t
}

fn kinds(t: &Transcript) -> Vec<&'static str> {
    t.entries().iter().map(Entry::kind).collect()
}

fn agent_text(t: &Transcript) -> String {
    t.entries()
        .iter()
        .filter_map(|e| match e {
            Entry::Agent { text, .. } => Some(text.as_str()),
            _ => None,
        })
        .collect::<Vec<_>>()
        .join("")
}

fn tools(t: &Transcript) -> Vec<(String, String, Option<String>)> {
    t.entries()
        .iter()
        .filter_map(|e| match e {
            Entry::Tool {
                tool_kind,
                status,
                input,
                ..
            } => Some((tool_kind.clone(), status.clone(), input.clone())),
            _ => None,
        })
        .collect()
}

#[test]
fn claude_read_turn() {
    let t = replay("claude", "read");
    let k = kinds(&t);
    assert_eq!(k.first(), Some(&"user"));
    assert_eq!(k.last(), Some(&"turn_end"));
    assert!(agent_text(&t).contains("a - b"), "{}", agent_text(&t));
    let tools = tools(&t);
    assert_eq!(tools.len(), 1, "{tools:?}");
    assert_eq!(tools[0].0, "read");
    assert_eq!(tools[0].1, "completed");
    assert!(
        tools[0].2.as_deref().unwrap_or("").ends_with("calc.py"),
        "{tools:?}"
    );
    // Nothing is left streaming after the turn.
    assert!(t.entries().iter().all(|e| !e.is_live()));
    // Model, mode and effort pickers, model first.
    let cats: Vec<_> = t.meta.options.iter().map(|o| o.category.as_str()).collect();
    assert_eq!(&cats[..3], ["model", "mode", "thought_level"]);
    assert!(!t.meta.legacy_modes);
    assert!(!t.meta.commands.is_empty());
    assert!(
        t.meta
            .usage
            .as_ref()
            .and_then(|u| u.cost_usd)
            .unwrap_or(0.0)
            > 0.0
    );
}

#[test]
fn claude_cancel_ends_cleanly() {
    let t = replay("claude", "cancel");
    match t.entries().last() {
        Some(Entry::TurnEnd { stop_reason, .. }) => assert_eq!(stop_reason, "cancelled"),
        other => panic!("{other:?}"),
    }
    assert!(!agent_text(&t).is_empty());
}

#[test]
fn claude_edit_runs_tools_in_order() {
    let t = replay("claude", "edit_allow");
    let tools = tools(&t);
    assert!(tools.len() >= 2, "{tools:?}");
    assert!(tools.iter().all(|(_, s, _)| s == "completed"), "{tools:?}");
    assert!(
        tools
            .iter()
            .any(|(_, _, i)| i.as_deref().unwrap_or("").contains("sed")),
        "{tools:?}"
    );
}

#[test]
fn every_agent_fixture_maps_to_a_finished_turn() {
    for agent in ["claude", "codex", "pool", "pi", "glue"] {
        let t = replay(agent, "read");
        assert!(
            matches!(t.entries().last(), Some(Entry::TurnEnd { .. })),
            "{agent}: {:?}",
            kinds(&t)
        );
        assert!(!agent_text(&t).is_empty(), "{agent}: no agent text");
        assert!(
            t.entries().iter().all(|e| !e.is_live()),
            "{agent}: live entries left: {:?}",
            t.entries()
                .iter()
                .filter(|e| e.is_live())
                .collect::<Vec<_>>()
        );
        assert!(
            !t.entries()
                .iter()
                .any(|e| matches!(e, Entry::Unknown { .. })),
            "{agent}: unknown updates {:?}",
            t.entries()
                .iter()
                .filter(|e| matches!(e, Entry::Unknown { .. }))
                .collect::<Vec<_>>()
        );
    }
}

#[test]
fn pool_permissions_are_resolved_with_the_chosen_option() {
    let t = replay("pool", "read");
    let perms: Vec<_> = t
        .entries()
        .iter()
        .filter_map(|e| match e {
            Entry::Permission {
                resolution,
                options,
                ..
            } => Some((resolution.clone(), options.len())),
            _ => None,
        })
        .collect();
    assert_eq!(perms.len(), 2, "{perms:?}");
    assert!(
        perms
            .iter()
            .all(|(r, n)| r.as_deref() == Some("allow-once") && *n == 3),
        "{perms:?}"
    );
}

#[test]
fn codex_pool_pi_expose_a_model_picker() {
    for agent in ["codex", "pool", "pi"] {
        let t = replay(agent, "read");
        let model = t.meta.options.iter().find(|o| o.category == "model");
        let model = model.unwrap_or_else(|| panic!("{agent}: {:?}", t.meta.options));
        assert!(model.choices.len() > 1, "{agent}");
        assert!(
            model.choices.iter().any(|c| c.value == model.current),
            "{agent}: current not in choices"
        );
    }
    // pi advertises its thinking levels as legacy modes *and* as a
    // thought_level option: show one picker, not two.
    let pi = replay("pi", "read");
    assert!(!pi.meta.legacy_modes);
    assert_eq!(
        pi.meta
            .options
            .iter()
            .filter(|o| o.category == "thought_level")
            .count(),
        1
    );
    assert!(!pi.meta.options.iter().any(|o| o.category == "mode"));
}

#[test]
fn streaming_sends_a_snapshot_then_appends() {
    let mut t = Transcript::new();
    let chunk = |s: &str| serde_json::json!({"sessionUpdate": "agent_message_chunk", "content": {"type": "text", "text": s}});
    t.begin_turn("q");
    t.flush();
    t.apply(&chunk("Hel"));
    let first = t.flush();
    assert!(
        matches!(
            &first[..],
            [Change::Upsert {
                index: 1,
                version: 1,
                ..
            }]
        ),
        "{first:?}"
    );
    t.apply(&chunk("lo"));
    t.apply(&chunk(" world"));
    let second = t.flush();
    assert_eq!(
        second,
        vec![Change::AppendText {
            index: 1,
            version: 2,
            delta: "lo world".into()
        }]
    );
    // A tool call closes the message: a final snapshot with streaming=false.
    t.apply(&serde_json::json!({"sessionUpdate": "tool_call", "toolCallId": "t1", "title": "Read", "kind": "read"}));
    let third = t.flush();
    assert!(matches!(
        &third[0],
        Change::Upsert {
            index: 1,
            version: 3,
            entry: Entry::Agent {
                streaming: false,
                ..
            }
        }
    ));
    assert!(matches!(
        &third[1],
        Change::Upsert {
            index: 2,
            version: 1,
            ..
        }
    ));
    assert!(t.flush().is_empty());
}

#[test]
fn permission_round_trip() {
    let mut t = Transcript::new();
    t.apply(&serde_json::json!({"sessionUpdate": "tool_call", "toolCallId": "t1", "title": "Bash", "kind": "execute", "rawInput": {"command": "rm -rf build"}}));
    let i = t.permission("7", &serde_json::json!({
        "toolCall": {"toolCallId": "t1"},
        "options": [{"optionId": "a", "name": "Allow", "kind": "allow_once"}, {"optionId": "r", "name": "Reject", "kind": "reject_once"}]
    }));
    match &t.entries()[i] {
        Entry::Permission {
            title,
            options,
            resolution: None,
            ..
        } => {
            assert_eq!(title, "Bash: rm -rf build");
            assert_eq!(options.len(), 2);
        }
        other => panic!("{other:?}"),
    }
    t.resolve_permission("7", "a");
    assert!(matches!(&t.entries()[i], Entry::Permission { resolution: Some(r), .. } if r == "a"));
}

#[test]
fn unknown_updates_are_kept() {
    let mut t = Transcript::new();
    t.apply(&serde_json::json!({"sessionUpdate": "from_the_future", "x": 1}));
    assert!(matches!(&t.entries()[0], Entry::Unknown { json } if json.contains("from_the_future")));
}

#[test]
fn output_outside_a_turn_is_a_notice() {
    let mut t = Transcript::new();
    let chunk = |s: &str| serde_json::json!({"sessionUpdate": "agent_message_chunk", "content": {"type": "text", "text": s}});
    t.apply(&chunk("calling \"initialize\": rejected by transport"));
    t.apply(&chunk("\nbad content type"));
    assert_eq!(t.entries().len(), 1);
    assert!(
        matches!(&t.entries()[0], Entry::Notice { text } if text.contains("rejected") && text.contains("bad content"))
    );
    assert!(t.entries().iter().all(|e| !e.is_live()));
    // Inside a turn the same chunk is a reply.
    t.begin_turn("hi");
    t.apply(&chunk("hello"));
    assert!(matches!(&t.entries()[2], Entry::Agent { text, streaming: true } if text == "hello"));
}

#[test]
fn pool_usage_meta_becomes_labelled_extras() {
    let t = replay("pool", "read");
    let usage = t.meta.usage.clone().expect("usage");
    let labels: Vec<_> = usage.extra.iter().map(|e| e.label.as_str()).collect();
    assert!(labels.contains(&"Input tokens"), "{labels:?}");
    assert!(labels.contains(&"Cached read tokens"), "{labels:?}");
}

#[test]
fn replay_preserves_user_chunks_turn_boundaries_and_message_ids() {
    use splash::acp::map::Replay;
    let mut replay = Replay::default();
    for update in [
        serde_json::json!({"sessionUpdate":"user_message_chunk","messageId":"u1","content":{"type":"text","text":"First "}}),
        serde_json::json!({"sessionUpdate":"user_message_chunk","messageId":"u1","content":{"type":"text","text":"question"}}),
        serde_json::json!({"sessionUpdate":"agent_thought_chunk","content":{"type":"text","text":"Thinking"}}),
        serde_json::json!({"sessionUpdate":"agent_message_chunk","messageId":"a1","content":{"type":"text","text":"One"}}),
        serde_json::json!({"sessionUpdate":"agent_message_chunk","messageId":"a2","content":{"type":"text","text":"Two"}}),
        serde_json::json!({"sessionUpdate":"user_message_chunk","messageId":"u2","content":{"type":"text","text":"Next question"}}),
        serde_json::json!({"sessionUpdate":"tool_call","toolCallId":"t1","title":"Read a file","status":"completed"}),
        serde_json::json!({"sessionUpdate":"agent_message_chunk","content":{"type":"text","text":"Answer"}}),
    ] {
        replay.apply(&update);
    }
    let entries = replay.finish();
    assert_eq!(entries.len(), 7);
    assert!(matches!(&entries[0], Entry::User { text } if text == "First question"));
    assert!(matches!(&entries[1], Entry::Thought { text, streaming: false } if text == "Thinking"));
    assert!(matches!(&entries[2], Entry::Agent { text, streaming: false } if text == "One"));
    assert!(matches!(&entries[3], Entry::Agent { text, streaming: false } if text == "Two"));
    assert!(matches!(&entries[4], Entry::User { text } if text == "Next question"));
    assert!(matches!(&entries[5], Entry::Tool { id, .. } if id == "t1"));
    assert!(matches!(&entries[6], Entry::Agent { text, streaming: false } if text == "Answer"));
}
