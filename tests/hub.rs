//! The app's state end to end: a temp data dir, a temp git repo, and
//! `fake-acp` standing in for the agent.

use std::future::Future;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::Arc;
use std::time::Duration;

use splash::acp::actor::{Sink, Status};
use splash::acp::model::{Entry, SessionMeta, Usage};
use splash::agents::registry::{AgentSpec, AuthCheck, Transport};
use splash::hub::Hub;
use splash::store::{new_id, Isolation};

fn temp(prefix: &str) -> PathBuf {
    let dir = std::env::temp_dir().join(new_id(prefix));
    std::fs::create_dir_all(&dir).unwrap();
    dir
}

fn git(dir: &Path, args: &[&str]) -> String {
    let out = Command::new("git")
        .args(["-c", "user.email=t@t", "-c", "user.name=t"])
        .args(args)
        .current_dir(dir)
        .output()
        .unwrap();
    assert!(out.status.success(), "git {args:?}: {out:?}");
    String::from_utf8_lossy(&out.stdout).trim().to_string()
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

fn fake_agent(fixture: &str) -> &'static AgentSpec {
    let program: &'static str =
        Box::leak(env!("CARGO_BIN_EXE_fake-acp").to_string().into_boxed_str());
    let path: &'static str = Box::leak(
        format!("{}/fixtures/{fixture}.jsonl", env!("CARGO_MANIFEST_DIR")).into_boxed_str(),
    );
    let args: &'static [&'static str] = Box::leak(vec![path].into_boxed_slice());
    Box::leak(Box::new(AgentSpec {
        id: "fake",
        name: "Fake",
        cli: program,
        program,
        args,
        env: &[],
        transport: Transport::Native,
        experimental: false,
        auth: AuthCheck::File("nope"),
    }))
}

/// A hub on `data` whose every agent is `fixture`; counts agent lookups.
fn hub(data: &Path, fixture: &str) -> (Hub, Arc<AtomicUsize>) {
    let spec = fake_agent(fixture);
    let lookups = Arc::new(AtomicUsize::new(0));
    let n = lookups.clone();
    let hub = Hub::with_agents(
        data.to_path_buf(),
        elyra::EventBus::new(),
        Arc::new(move |_| {
            n.fetch_add(1, Ordering::SeqCst);
            Some(spec)
        }),
    );
    (hub, lookups)
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

async fn status(hub: &Hub, id: &str) -> Option<Status> {
    let views = hub.sessions.list().await.unwrap();
    views
        .into_iter()
        .find(|v| v.record.id == id)
        .map(|v| v.status)
}

async fn idle(hub: &Hub, id: &str) {
    eventually("idle", || async {
        status(hub, id).await == Some(Status::Idle)
    })
    .await;
}

async fn turn_ended(hub: &Hub, id: &str) {
    eventually("turn end", || async {
        let snap = hub.sessions.transcript(id).await.unwrap();
        snap.entries
            .iter()
            .any(|e| matches!(e, Entry::TurnEnd { .. }))
    })
    .await;
}

fn title(hub: &Hub, id: &str) -> String {
    hub.sessions.record(id).unwrap().title
}

/// The title codex's recorded `session_info_update` carries, shortened.
const CODEX_TITLE: &str = "Read calc.py and tell me in one sentence what bug it has";

#[tokio::test(flavor = "multi_thread")]
async fn projects_and_sessions_in_place_and_in_a_worktree() {
    let (data, repo) = (temp("data"), repo());
    let (hub, _) = hub(&data, "claude/read");
    let project = hub
        .sessions
        .add_project(&repo.to_string_lossy())
        .await
        .unwrap();
    assert!(project.is_git);
    assert_eq!(
        hub.sessions.projects().await.unwrap(),
        vec![project.clone()]
    );

    let head = git(&repo, &["rev-parse", "HEAD"]);
    let here = hub
        .sessions
        .create(&project.id, "fake", Isolation::InPlace, None)
        .await
        .unwrap();
    assert_eq!(here.record.title, "New session");
    assert_eq!(here.record.cwd, project.path);
    assert_eq!(here.record.base_sha.as_deref(), Some(head.as_str()));

    let wt = hub
        .sessions
        .create(
            &project.id,
            "fake",
            Isolation::Worktree,
            Some("Fix it".into()),
        )
        .await
        .unwrap();
    let branch = wt.record.branch.clone().unwrap();
    assert!(branch.starts_with("splash/fix-it-"), "{branch}");
    assert_eq!(wt.record.base_sha.as_deref(), Some(head.as_str()));
    assert!(Path::new(&wt.record.cwd).join("a.txt").exists());
    assert!(wt.record.cwd.starts_with(&*data.to_string_lossy()));
    idle(&hub, &wt.record.id).await;
    assert_eq!(hub.sessions.list().await.unwrap().len(), 2);
}

#[tokio::test(flavor = "multi_thread")]
async fn a_prompt_names_the_session_until_the_agent_does() {
    let (data, repo) = (temp("data"), repo());
    let (hub, _) = hub(&data, "codex/read");
    let project = hub
        .sessions
        .add_project(&repo.to_string_lossy())
        .await
        .unwrap();
    let s = hub
        .sessions
        .create(&project.id, "fake", Isolation::InPlace, None)
        .await
        .unwrap();
    let id = s.record.id;
    idle(&hub, &id).await;
    hub.sessions
        .prompt(&id, "Fix the flaky login test. Then run it.")
        .await
        .unwrap();
    assert_eq!(title(&hub, &id), "Fix the flaky login test");
    eventually("the agent's title", || async {
        title(&hub, &id) == CODEX_TITLE
    })
    .await;
    turn_ended(&hub, &id).await;
    // Persisted too.
    let stored = hub.core.store().await.unwrap().session(&id).await.unwrap();
    assert_eq!(stored.title, CODEX_TITLE);

    // A name the user gave sticks.
    let named = hub
        .sessions
        .create(&project.id, "fake", Isolation::InPlace, None)
        .await
        .unwrap();
    let id = named.record.id;
    idle(&hub, &id).await;
    hub.sessions.rename(&id, "  Mine ").await.unwrap();
    hub.sessions
        .prompt(&id, "Fix the flaky login test")
        .await
        .unwrap();
    turn_ended(&hub, &id).await;
    tokio::time::sleep(Duration::from_millis(100)).await;
    assert_eq!(title(&hub, &id), "Mine");
}

#[tokio::test(flavor = "multi_thread")]
async fn an_untitled_session_stays_auto_titled_across_a_restart() {
    let (data, repo) = (temp("data"), repo());
    let id = {
        let (hub, _) = hub(&data, "codex/read");
        let project = hub
            .sessions
            .add_project(&repo.to_string_lossy())
            .await
            .unwrap();
        let s = hub
            .sessions
            .create(&project.id, "fake", Isolation::InPlace, None)
            .await
            .unwrap();
        s.record.id
    };
    let (hub, _) = hub(&data, "codex/read");
    hub.sessions.list().await.unwrap();
    assert_eq!(title(&hub, &id), "New session");
    hub.sessions.prompt(&id, "Explain it").await.unwrap();
    eventually("the agent's title", || async {
        title(&hub, &id) == CODEX_TITLE
    })
    .await;
}

#[tokio::test(flavor = "multi_thread")]
async fn archiving_a_dirty_worktree_needs_force_and_keeps_the_branch() {
    let (data, repo) = (temp("data"), repo());
    let (hub, _) = hub(&data, "claude/read");
    let project = hub
        .sessions
        .add_project(&repo.to_string_lossy())
        .await
        .unwrap();
    let s = hub
        .sessions
        .create(&project.id, "fake", Isolation::Worktree, None)
        .await
        .unwrap();
    let (id, cwd, branch) = (s.record.id, s.record.cwd, s.record.branch.unwrap());
    assert!(branch.starts_with("splash/fake-"), "{branch}");
    std::fs::write(Path::new(&cwd).join("b.txt"), "b").unwrap();

    assert_eq!(
        hub.sessions
            .archive(&id, false)
            .await
            .unwrap_err()
            .to_string(),
        "dirty"
    );
    assert!(Path::new(&cwd).exists());
    assert!(!hub.sessions.record(&id).unwrap().archived);

    hub.sessions.archive(&id, true).await.unwrap();
    assert!(!Path::new(&cwd).exists());
    assert!(hub.sessions.record(&id).unwrap().archived);
    assert_eq!(status(&hub, &id).await, Some(Status::Exited));
    git(&repo, &["rev-parse", "--verify", &branch]);
}

#[tokio::test(flavor = "multi_thread")]
async fn deleting_a_dirty_worktree_requires_force() {
    let (data, repo) = (temp("data"), repo());
    let (hub, _) = hub(&data, "claude/read");
    let project = hub
        .sessions
        .add_project(&repo.to_string_lossy())
        .await
        .unwrap();
    let s = hub
        .sessions
        .create(&project.id, "fake", Isolation::Worktree, None)
        .await
        .unwrap();
    let (id, cwd) = (s.record.id, s.record.cwd);
    let branch = s.record.branch.unwrap();
    idle(&hub, &id).await;
    std::fs::write(Path::new(&cwd).join("a.txt"), "edited").unwrap();
    std::fs::write(Path::new(&cwd).join("b.txt"), "b").unwrap();
    assert_eq!(
        hub.sessions
            .delete(&id, false)
            .await
            .unwrap_err()
            .to_string(),
        "dirty"
    );
    assert!(hub.sessions.record(&id).is_ok());
    assert!(hub.core.store().await.unwrap().session(&id).await.is_ok());
    assert_eq!(status(&hub, &id).await, Some(Status::Idle));
    assert_eq!(
        std::fs::read_to_string(Path::new(&cwd).join("a.txt")).unwrap(),
        "edited"
    );
    assert_eq!(
        std::fs::read_to_string(Path::new(&cwd).join("b.txt")).unwrap(),
        "b"
    );

    hub.sessions.delete(&id, true).await.unwrap();
    assert!(hub.sessions.record(&id).is_err());
    assert!(hub.sessions.list().await.unwrap().is_empty());
    assert!(hub.core.store().await.unwrap().session(&id).await.is_err());
    assert!(!Path::new(&cwd).exists());
    assert!(hub.sessions.rpc_log(&id).is_empty());
    git(&repo, &["rev-parse", "--verify", &branch]);
}

#[tokio::test(flavor = "multi_thread")]
async fn deleting_without_force_handles_clean_worktrees_and_in_place_files() {
    for isolation in [Isolation::Worktree, Isolation::InPlace] {
        let (data, repo) = (temp("data"), repo());
        let (hub, _) = hub(&data, "claude/read");
        let project = hub
            .sessions
            .add_project(&repo.to_string_lossy())
            .await
            .unwrap();
        let in_place = isolation == Isolation::InPlace;
        let s = hub
            .sessions
            .create(&project.id, "fake", isolation, None)
            .await
            .unwrap();
        idle(&hub, &s.record.id).await;
        if in_place {
            std::fs::write(repo.join("a.txt"), "unsaved work").unwrap();
        }
        hub.sessions.delete(&s.record.id, false).await.unwrap();
        assert!(hub.sessions.record(&s.record.id).is_err());
        assert!(hub
            .core
            .store()
            .await
            .unwrap()
            .session(&s.record.id)
            .await
            .is_err());
        if in_place {
            assert_eq!(
                std::fs::read_to_string(repo.join("a.txt")).unwrap(),
                "unsaved work"
            );
        } else {
            assert!(!Path::new(&s.record.cwd).exists());
        }
    }
}

#[tokio::test(flavor = "multi_thread")]
async fn concurrent_opens_start_one_agent() {
    let (data, repo) = (temp("data"), repo());
    let id = {
        let (hub, _) = hub(&data, "claude/read");
        let project = hub
            .sessions
            .add_project(&repo.to_string_lossy())
            .await
            .unwrap();
        let s = hub
            .sessions
            .create(&project.id, "fake", Isolation::InPlace, None)
            .await
            .unwrap();
        s.record.id
    };
    let (hub, lookups) = hub(&data, "claude/read");
    let (a, b) = tokio::join!(hub.sessions.ensure_live(&id), hub.sessions.ensure_live(&id));
    a.unwrap();
    b.unwrap();
    idle(&hub, &id).await;
    assert_eq!(lookups.load(Ordering::SeqCst), 1);
}

#[tokio::test(flavor = "multi_thread")]
async fn usage_is_persisted_only_when_it_changes() {
    let (data, repo) = (temp("data"), repo());
    let (hub, _) = hub(&data, "claude/read");
    let project = hub
        .sessions
        .add_project(&repo.to_string_lossy())
        .await
        .unwrap();
    let s = hub
        .sessions
        .create(&project.id, "fake", Isolation::InPlace, None)
        .await
        .unwrap();
    let id = s.record.id;
    idle(&hub, &id).await;
    let store = hub.core.store().await.unwrap().clone();
    let usage = |used: f64| Usage {
        used,
        size: 100.0,
        cost_usd: None,
        extra: vec![],
    };
    let report = |used: f64| {
        let meta = SessionMeta {
            usage: Some(usage(used)),
            ..Default::default()
        };
        Sink::status(&*hub.sessions, &id, Status::Idle, None, &meta);
    };
    let stored = || async {
        store.settle().await;
        store.session(&id).await.unwrap().usage
    };

    report(1.0);
    assert_eq!(stored().await, Some(usage(1.0)));
    // Something else writes; the same report again must not overwrite it.
    store.queue_usage(&id, &usage(2.0));
    report(1.0);
    assert_eq!(stored().await, Some(usage(2.0)));
    report(3.0);
    assert_eq!(stored().await, Some(usage(3.0)));
    assert_eq!(hub.sessions.record(&id).unwrap().usage, Some(usage(3.0)));
}
