//! Store round-trips on a throwaway SQLite file.

use splash::acp::model::Entry;
use splash::store::{new_id, now, Isolation, SessionRecord, Store};

async fn open() -> (Store, std::path::PathBuf) {
    let dir = std::env::temp_dir().join(new_id("splash-test"));
    let store = Store::open(&dir.join("t.db")).await.unwrap();
    (store, dir)
}

fn record(project: &str) -> SessionRecord {
    SessionRecord {
        id: new_id("s"),
        project_id: project.into(),
        agent_id: "claude".into(),
        title: "fix it".into(),
        cwd: "/tmp".into(),
        isolation: Isolation::Worktree,
        branch: Some("splash/fix-it".into()),
        base_sha: Some("abc".into()),
        agent_session_id: None,
        archived: false,
        created_at: now(),
        updated_at: now(),
        usage: None,
    }
}

#[tokio::test]
async fn projects_sessions_and_entries_round_trip() {
    let (store, dir) = open().await;
    let p = store.add_project("/tmp/repo", "repo", true).await.unwrap();
    // Adding the same path again returns the existing project.
    assert_eq!(
        store
            .add_project("/tmp/repo", "other", false)
            .await
            .unwrap()
            .id,
        p.id
    );

    let s = record(&p.id);
    store.insert_session(&s).await.unwrap();
    store.queue_entries(
        &s.id,
        vec![
            (0, Entry::User { text: "hi".into() }),
            (
                1,
                Entry::Agent {
                    text: "he".into(),
                    streaming: true,
                },
            ),
        ],
    );
    // A later snapshot of the same index replaces it.
    store.queue_entries(
        &s.id,
        vec![(
            1,
            Entry::Agent {
                text: "hello".into(),
                streaming: false,
            },
        )],
    );
    store.queue_agent_session(&s.id, "acp-123");
    store.queue_usage(
        &s.id,
        &splash::acp::model::Usage {
            used: 1000.0,
            size: 200000.0,
            cost_usd: Some(0.5),
            extra: vec![],
        },
    );
    store.settle().await;

    let entries = store.entries(&s.id).await.unwrap();
    assert_eq!(
        entries,
        vec![
            Entry::User { text: "hi".into() },
            Entry::Agent {
                text: "hello".into(),
                streaming: false
            }
        ]
    );
    let back = store.session(&s.id).await.unwrap();
    assert_eq!(back.agent_session_id.as_deref(), Some("acp-123"));
    assert_eq!(back.isolation, Isolation::Worktree);
    assert_eq!(back.usage.map(|u| u.cost_usd), Some(Some(0.5)));

    // Deleting a project cascades to its sessions and entries.
    store.remove_project(&p.id).await.unwrap();
    assert!(store.sessions().await.unwrap().is_empty());
    assert!(store.entries(&s.id).await.unwrap().is_empty());
    let _ = std::fs::remove_dir_all(dir);
}

#[tokio::test]
async fn reopening_keeps_data_and_does_not_remigrate() {
    let (store, dir) = open().await;
    let p = store.add_project("/tmp/x", "x", false).await.unwrap();
    drop(store);
    let again = Store::open(&dir.join("t.db")).await.unwrap();
    assert_eq!(again.projects().await.unwrap()[0].id, p.id);
    again.set_extra_args("glue", "-m foo").await.unwrap();
    again.set_setting("default_agent", "codex").await.unwrap();
    again.set_setting("default_agent", "pool").await.unwrap();
    assert_eq!(
        again
            .settings()
            .await
            .unwrap()
            .get("default_agent")
            .map(String::as_str),
        Some("pool")
    );
    assert_eq!(again.extra_args("glue").await.unwrap(), "-m foo");
    let _ = std::fs::remove_dir_all(dir);
}
