//! Splash stopping its agents as it exits, which is not their failure. Its own
//! binary: `procs::shut_down` stops every agent in the process, as Splash
//! does on SIGTERM or quit. Only on Unix, where Splash outlives its agents.
#![cfg(unix)]

use std::future::Future;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::sync::Arc;
use std::time::Duration;

use splash::acp::actor::Status;
use splash::acp::model::Entry;
use splash::agents::registry::{AgentSpec, AuthCheck, Transport};
use splash::hub::{Hub, SessionView};
use splash::store::{new_id, AttentionKind, Isolation};

fn temp(prefix: &str) -> PathBuf {
    let dir = std::env::temp_dir().join(new_id(prefix));
    std::fs::create_dir_all(&dir).unwrap();
    dir
}

fn git(dir: &Path, args: &[&str]) {
    let out = Command::new("git")
        .args(["-c", "user.email=t@t", "-c", "user.name=t"])
        .args(args)
        .current_dir(dir)
        .output()
        .unwrap();
    assert!(out.status.success(), "git {args:?}: {out:?}");
}

/// A repository with one commit.
fn repo() -> PathBuf {
    let dir = temp("repo");
    git(&dir, &["init", "-q"]);
    std::fs::write(dir.join("a.txt"), "a").unwrap();
    git(&dir, &["add", "."]);
    git(&dir, &["commit", "-qm", "init"]);
    dir
}

fn fake_agent(fixture: &str, env: &'static [(&'static str, &'static str)]) -> &'static AgentSpec {
    let program: &'static str =
        Box::leak(env!("CARGO_BIN_EXE_fake-acp").to_string().into_boxed_str());
    let path: &'static str = Box::leak(
        format!("{}/fixtures/{fixture}.jsonl", env!("CARGO_MANIFEST_DIR")).into_boxed_str(),
    );
    Box::leak(Box::new(AgentSpec {
        id: "fake",
        name: "Fake",
        cli: program,
        program,
        args: Box::leak(vec![path].into_boxed_slice()),
        env,
        transport: Transport::Native,
        experimental: false,
        auth: AuthCheck::File("nope"),
    }))
}

async fn eventually<F: Future<Output = bool>>(what: &str, mut f: impl FnMut() -> F) {
    for _ in 0..400 {
        if f().await {
            return;
        }
        tokio::time::sleep(Duration::from_millis(25)).await;
    }
    panic!("timed out waiting for {what}");
}

async fn view(hub: &Hub, id: &str) -> SessionView {
    let views = hub.sessions.list().await.unwrap();
    views.into_iter().find(|v| v.record.id == id).unwrap()
}

#[tokio::test(flavor = "multi_thread")]
async fn shutting_down_keeps_permissions_and_marks_interrupted_work() {
    let (data, repo) = (temp("data"), repo());
    // "done" finishes its turn, "asks" waits for a permission, and "busy"
    // replays a turn of several seconds at its recorded speed.
    let done = fake_agent("claude/read", &[]);
    let asks = fake_agent("pool/read", &[]);
    let busy = fake_agent("claude/cancel", &[("FAKE_ACP_SPEED", "1")]);
    let hub = Hub::with_agents(
        data.clone(),
        elyra::EventBus::new(),
        Arc::new(move |id| match id {
            "asks" => Some(asks),
            "busy" => Some(busy),
            _ => Some(done),
        }),
    );
    let project = hub
        .sessions
        .add_project(repo.to_str().unwrap())
        .await
        .unwrap();
    let mut ids = vec![];
    for agent in ["done", "asks", "busy"] {
        let s = hub
            .sessions
            .create(&project.id, agent, Isolation::InPlace, None)
            .await
            .unwrap();
        hub.sessions.prompt(&s.record.id, "Go").await.unwrap();
        ids.push(s.record.id);
    }
    let (reviewed, waiting, working) = (&ids[0], &ids[1], &ids[2]);
    eventually("a review, a permission and a turn in progress", || async {
        view(&hub, reviewed).await.record.attention.is_some()
            && view(&hub, waiting).await.status == Status::AwaitingPermission
            && hub
                .sessions
                .transcript(working)
                .await
                .unwrap()
                .entries
                .iter()
                .any(|e| matches!(e, Entry::Agent { .. }))
    })
    .await;
    assert_eq!(view(&hub, working).await.status, Status::Running);

    // As on SIGTERM or quit: the hub hears first, then every agent is stopped.
    tokio::task::spawn_blocking(splash::procs::shut_down)
        .await
        .unwrap();
    for id in &ids {
        eventually("every agent stopped", || async {
            matches!(view(&hub, id).await.status, Status::Exited | Status::Error)
        })
        .await;
    }

    // What a restart finds.
    let store = hub.core.store().await.unwrap();
    store.settle().await;
    let attention = |id: &str| {
        let id = id.to_string();
        async move { store.session(&id).await.unwrap().attention.unwrap() }
    };
    assert_eq!(attention(reviewed).await.kind, AttentionKind::Review);
    let asked = attention(waiting).await;
    assert_eq!(asked.kind, AttentionKind::Permission);
    assert_eq!(asked.detail, "A tool needs your permission.");
    let interrupted = attention(working).await;
    assert_eq!(interrupted.kind, AttentionKind::Failed);
    assert_eq!(
        interrupted.detail,
        "Splash stopped while the agent was working. Reconnect to continue."
    );

    // Both stopped turns are closed, with the reason and no protocol error.
    for id in [waiting, working] {
        let entries = store.entries(id).await.unwrap();
        let errors: Vec<&str> = entries
            .iter()
            .filter_map(|e| match e {
                Entry::Error { text } => Some(text.as_str()),
                _ => None,
            })
            .collect();
        assert_eq!(errors, ["Splash stopped while the agent was working."]);
        assert!(entries.iter().any(
            |e| matches!(e, Entry::TurnEnd { stop_reason, .. } if stop_reason == "cancelled")
        ));
        assert!(!entries.iter().any(|e| matches!(
            e,
            Entry::Permission {
                resolution: None,
                ..
            }
        )));
    }
    let entries = store.entries(reviewed).await.unwrap();
    assert!(!entries.iter().any(|e| matches!(e, Entry::Error { .. })));

    let _ = std::fs::remove_dir_all(data);
    let _ = std::fs::remove_dir_all(repo);
}
