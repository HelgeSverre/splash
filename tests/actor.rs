//! The session actor against `fake-acp` replaying recorded fixtures.

use std::sync::Arc;
use std::time::{Duration, Instant};

use parking_lot::Mutex;
use splash::acp::actor::{self, SessionCmd, SessionSpec, Sink, Status};
use splash::acp::map::{Change, TranscriptSnapshot};
use splash::acp::model::{Entry, SessionMeta};
use splash::acp::transport::Dir;
use splash::agents::registry::{AgentSpec, AuthCheck, Transport};

/// Records everything, and mirrors the frontend with the app's own
/// [`TranscriptSnapshot::apply`], so the wire protocol is tested too.
#[derive(Default)]
struct Recorder {
    mirror: Mutex<TranscriptSnapshot>,
    gaps: Mutex<u32>,
    statuses: Mutex<Vec<Status>>,
    meta: Mutex<SessionMeta>,
    persisted: Mutex<Vec<(usize, Entry)>>,
    agent_session: Mutex<Option<String>>,
    rpc_lines: Mutex<usize>,
    methods: Mutex<Vec<String>>,
}

impl Sink for Recorder {
    fn changes(&self, _key: &str, changes: Vec<Change>) {
        let mut m = self.mirror.lock();
        for c in &changes {
            if !m.apply(c) {
                *self.gaps.lock() += 1;
            }
        }
    }
    fn status(&self, _key: &str, status: Status, _detail: Option<&str>, meta: &SessionMeta) {
        self.statuses.lock().push(status);
        *self.meta.lock() = meta.clone();
    }
    fn persist(&self, _key: &str, entries: Vec<(usize, Entry)>) {
        self.persisted.lock().extend(entries);
    }
    fn agent_session(&self, _key: &str, id: &str) {
        *self.agent_session.lock() = Some(id.to_string());
    }
    fn rpc(&self, _key: &str, dir: Dir, line: &str) {
        *self.rpc_lines.lock() += 1;
        if dir == Dir::Out {
            if let Some(method) = serde_json::from_str::<serde_json::Value>(line)
                .ok()
                .and_then(|v| v["method"].as_str().map(String::from))
            {
                self.methods.lock().push(method);
            }
        }
    }
    fn workspace_dirty(&self, _key: &str) {}
}

impl Recorder {
    fn entries(&self) -> Vec<Entry> {
        self.mirror.lock().entries.clone()
    }
    fn last_status(&self) -> Option<Status> {
        self.statuses.lock().last().copied()
    }

    fn diagnostics(&self) -> String {
        format!(
            "statuses: {:?}, methods: {:?}, entries: {:?}",
            *self.statuses.lock(),
            *self.methods.lock(),
            self.entries()
        )
    }
}

/// Wait for an external fixture without yielding an idle paused Tokio runtime.
/// A single long-lived blocking task keeps Tokio's auto-advance inhibited
/// while the actor handles process I/O on the test runtime.
async fn wait_for_file(path: std::path::PathBuf, timeout: Duration) -> bool {
    tokio::task::spawn_blocking(move || {
        let deadline = Instant::now() + timeout;
        while Instant::now() < deadline {
            if path.exists() {
                return true;
            }
            std::thread::sleep(Duration::from_millis(10));
        }
        path.exists()
    })
    .await
    .unwrap()
}

async fn wait_for_method(rec: Arc<Recorder>, method: &'static str, timeout: Duration) -> bool {
    tokio::task::spawn_blocking(move || {
        let deadline = Instant::now() + timeout;
        while Instant::now() < deadline {
            if rec.methods.lock().iter().any(|seen| seen == method) {
                return true;
            }
            std::thread::sleep(Duration::from_millis(10));
        }
        rec.methods.lock().iter().any(|seen| seen == method)
    })
    .await
    .unwrap()
}

fn fake_agent(fixture: &str) -> &'static AgentSpec {
    fake_agent_with(fixture, &[])
}

fn fake_agent_with(fixture: &str, flags: &[&'static str]) -> &'static AgentSpec {
    let program: &'static str =
        Box::leak(env!("CARGO_BIN_EXE_fake-acp").to_string().into_boxed_str());
    let path: &'static str = Box::leak(
        format!("{}/fixtures/{fixture}.jsonl", env!("CARGO_MANIFEST_DIR")).into_boxed_str(),
    );
    let args: &'static [&'static str] = Box::leak(
        std::iter::once(path)
            .chain(flags.iter().copied())
            .collect::<Vec<_>>()
            .into_boxed_slice(),
    );
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

fn start(
    fixture: &str,
    history: Vec<Entry>,
    resume: Option<&str>,
) -> (
    tokio::sync::mpsc::UnboundedSender<SessionCmd>,
    Arc<Recorder>,
) {
    let rec = Arc::new(Recorder::default());
    let tx = actor::start(
        SessionSpec {
            key: "s1".into(),
            agent: fake_agent(fixture),
            cwd: std::env::temp_dir(),
            extra_args: vec![],
            resume: resume.map(String::from),
            history,
            additional_directories: vec![],
            source: Default::default(),
        },
        rec.clone() as Arc<dyn Sink>,
    );
    (tx, rec)
}

async fn wait_for(rec: &Recorder, what: &str, f: impl Fn(&Recorder) -> bool) {
    for _ in 0..400 {
        if f(rec) {
            return;
        }
        tokio::time::sleep(Duration::from_millis(25)).await;
    }
    panic!(
        "timed out waiting for {what}; statuses={:?} entries={:?}",
        rec.statuses.lock(),
        rec.entries()
    );
}

fn has_turn_end(r: &Recorder) -> bool {
    r.entries()
        .iter()
        .any(|e| matches!(e, Entry::TurnEnd { .. }))
}

#[tokio::test(flavor = "multi_thread")]
async fn streams_a_claude_turn_into_the_mirror() {
    let (tx, rec) = start("claude/read", vec![], None);
    wait_for(&rec, "idle", |r| r.last_status() == Some(Status::Idle)).await;
    assert_eq!(
        rec.agent_session.lock().as_deref().map(|s| !s.is_empty()),
        Some(true)
    );
    // Model/mode/effort pickers came from session/new.
    assert!(rec
        .meta
        .lock()
        .options
        .iter()
        .any(|o| o.category == "model"));

    tx.send(SessionCmd::Prompt("what's the bug?".into()))
        .unwrap();
    wait_for(&rec, "turn end", has_turn_end).await;
    wait_for(&rec, "idle again", |r| {
        r.last_status() == Some(Status::Idle)
    })
    .await;

    let entries = rec.entries();
    assert!(matches!(&entries[0], Entry::User { text } if text == "what's the bug?"));
    let text: String = entries
        .iter()
        .filter_map(|e| match e {
            Entry::Agent {
                text,
                streaming: false,
            } => Some(text.as_str()),
            _ => None,
        })
        .collect();
    assert!(text.contains("a - b"), "{entries:?}");
    assert!(entries
        .iter()
        .any(|e| matches!(e, Entry::Tool { status, .. } if status == "completed")));
    assert_eq!(*rec.gaps.lock(), 0, "the mirror saw out-of-order appends");
    assert!(*rec.rpc_lines.lock() > 5);
    // Everything settled got persisted.
    let persisted = rec.persisted.lock();
    assert!(persisted
        .iter()
        .any(|(_, e)| matches!(e, Entry::TurnEnd { .. })));
    tx.send(SessionCmd::Shutdown).unwrap();
}

#[tokio::test(flavor = "multi_thread")]
async fn permission_requests_wait_for_the_user() {
    // Pool's recording asked twice before running tools.
    let (tx, rec) = start("pool/read", vec![], None);
    wait_for(&rec, "idle", |r| r.last_status() == Some(Status::Idle)).await;
    tx.send(SessionCmd::Prompt("go".into())).unwrap();
    wait_for(&rec, "awaiting permission", |r| {
        r.last_status() == Some(Status::AwaitingPermission)
    })
    .await;

    let pending = |r: &Recorder| {
        r.entries().into_iter().find_map(|e| match e {
            Entry::Permission {
                request_id,
                resolution: None,
                options,
                ..
            } => Some((request_id, options)),
            _ => None,
        })
    };
    // Answer each request with its allow-once option, as the UI would.
    for _ in 0..2 {
        wait_for(&rec, "a pending permission", |r| pending(r).is_some()).await;
        let (request_id, options) = pending(&rec).unwrap();
        let allow = options
            .iter()
            .find(|o| o.kind == "allow_once")
            .unwrap()
            .id
            .clone();
        tx.send(SessionCmd::ResolvePermission {
            request_id: request_id.clone(),
            option_id: Some(allow),
        })
        .unwrap();
        wait_for(&rec, "resolved", |r| {
            r.entries().iter().any(|e| matches!(e, Entry::Permission { request_id: id, resolution: Some(_), .. } if *id == request_id))
        })
        .await;
    }
    wait_for(&rec, "turn end", has_turn_end).await;
    let entries = rec.entries();
    let answers: Vec<_> = entries
        .iter()
        .filter_map(|e| match e {
            Entry::Permission { resolution, .. } => resolution.clone(),
            _ => None,
        })
        .collect();
    assert_eq!(answers, vec!["allow-once", "allow-once"]);
    assert!(
        matches!(entries.last(), Some(Entry::TurnEnd { stop_reason, .. }) if stop_reason == "end_turn")
    );
    tx.send(SessionCmd::Shutdown).unwrap();
}

#[tokio::test(flavor = "multi_thread")]
async fn cancel_stops_a_turn_and_answers_open_permissions() {
    let (tx, rec) = start("pool/read", vec![], None);
    wait_for(&rec, "idle", |r| r.last_status() == Some(Status::Idle)).await;
    tx.send(SessionCmd::Prompt("go".into())).unwrap();
    wait_for(&rec, "awaiting permission", |r| {
        r.last_status() == Some(Status::AwaitingPermission)
    })
    .await;
    tx.send(SessionCmd::Cancel).unwrap();
    wait_for(&rec, "turn end", has_turn_end).await;
    let entries = rec.entries();
    assert!(entries
        .iter()
        .any(|e| matches!(e, Entry::Permission { resolution: Some(r), .. } if r == "cancelled")));
    assert!(
        matches!(entries.last(), Some(Entry::TurnEnd { stop_reason, .. }) if stop_reason == "cancelled")
    );
    tx.send(SessionCmd::Shutdown).unwrap();
}

#[tokio::test(flavor = "multi_thread")]
async fn setting_an_option_updates_the_meta() {
    let (tx, rec) = start("claude/read", vec![], None);
    wait_for(&rec, "idle", |r| r.last_status() == Some(Status::Idle)).await;
    tx.send(SessionCmd::SetOption {
        id: "effort".into(),
        value: "high".into(),
    })
    .unwrap();
    wait_for(&rec, "effort=high", |r| {
        r.meta
            .lock()
            .options
            .iter()
            .any(|o| o.id == "effort" && o.current == "high")
    })
    .await;
    tx.send(SessionCmd::Shutdown).unwrap();
}

#[tokio::test(flavor = "multi_thread")]
async fn resume_loads_without_duplicating_history() {
    let history = vec![
        Entry::User {
            text: "earlier".into(),
        },
        Entry::Agent {
            text: "earlier answer".into(),
            streaming: false,
        },
        Entry::TurnEnd {
            stop_reason: "end_turn".into(),
            duration_ms: 1.0,
        },
    ];
    let (tx, rec) = start("claude/read", history, Some("prev-session"));
    wait_for(&rec, "idle", |r| r.last_status() == Some(Status::Idle)).await;
    assert_eq!(rec.agent_session.lock().as_deref(), Some("prev-session"));
    // No divider: the agent supports session/load.
    assert!(!rec
        .entries()
        .iter()
        .any(|e| matches!(e, Entry::Divider { .. })));
    tx.send(SessionCmd::Prompt("and now?".into())).unwrap();
    wait_for(&rec, "turn end", has_turn_end).await;
    // The new turn starts after the restored three entries.
    assert!(matches!(&rec.entries()[3], Entry::User { text } if text == "and now?"));
    tx.send(SessionCmd::Shutdown).unwrap();
}

#[tokio::test(flavor = "multi_thread")]
async fn a_missing_program_reports_an_error() {
    let rec = Arc::new(Recorder::default());
    let spec: &'static AgentSpec = Box::leak(Box::new(AgentSpec {
        id: "ghost",
        name: "Ghost",
        cli: "ghost",
        program: "definitely-not-installed-xyz",
        args: &[],
        env: &[],
        transport: Transport::Native,
        experimental: false,
        auth: AuthCheck::File("nope"),
    }));
    let _tx = actor::start(
        SessionSpec {
            key: "g".into(),
            agent: spec,
            cwd: std::env::temp_dir(),
            extra_args: vec![],
            resume: None,
            history: vec![],
            additional_directories: vec![],
            source: Default::default(),
        },
        rec.clone() as Arc<dyn Sink>,
    );
    wait_for(&rec, "error", |r| r.last_status() == Some(Status::Error)).await;
    assert!(rec
        .entries()
        .iter()
        .any(|e| matches!(e, Entry::Error { text } if text.contains("not found"))));
}

#[tokio::test(start_paused = true)]
async fn a_new_session_that_never_responds_times_out() {
    let release = std::env::temp_dir().join(splash::store::new_id("splash-init-release"));
    let ready = release.with_extension("ready");
    let release_flag: &'static str =
        Box::leak(release.to_string_lossy().into_owned().into_boxed_str());
    let rec = Arc::new(Recorder::default());
    let _tx = actor::start(
        SessionSpec {
            key: "hung-new".into(),
            agent: fake_agent_with(
                "claude/read",
                &["--wait-initialize", release_flag, "--hang-new"],
            ),
            cwd: std::env::temp_dir(),
            extra_args: vec![],
            resume: None,
            history: vec![],
            additional_directories: vec![],
            source: Default::default(),
        },
        rec.clone() as Arc<dyn Sink>,
    );

    // The fixture is an external process, so wait in real time without
    // advancing Tokio's paused clock. It pauses initialize until we have spent
    // most of the startup budget, then leaves session/new unanswered. That
    // proves the two requests share one deadline. The wait itself holds one
    // blocking task for its whole lifetime, keeping Tokio from auto-advancing
    // through an accidental idle gap on slower native runners.
    assert!(
        wait_for_file(ready.clone(), Duration::from_secs(10)).await,
        "fixture never received initialize; {}",
        rec.diagnostics()
    );
    tokio::time::advance(Duration::from_secs(120)).await;
    std::fs::write(&release, "continue").unwrap();
    assert!(
        wait_for_method(rec.clone(), "session/new", Duration::from_secs(10)).await,
        "fixture never received session/new; {}",
        rec.diagnostics()
    );

    tokio::time::advance(Duration::from_secs(61)).await;
    for _ in 0..100 {
        if rec.last_status() == Some(Status::Error) {
            break;
        }
        tokio::task::yield_now().await;
    }
    assert_eq!(rec.last_status(), Some(Status::Error));
    assert!(
        rec.entries().iter().any(
            |entry| matches!(entry, Entry::Error { text } if text.contains("Creating a new conversation timed out"))
        ),
        "entries: {:?}",
        rec.entries()
    );
    let _ = std::fs::remove_file(release);
    let _ = std::fs::remove_file(ready);
}

#[tokio::test(flavor = "multi_thread")]
async fn failed_resume_does_not_create_a_replacement_session_or_send_queued_prompt() {
    for fixture in ["history/read", "codex/read"] {
        let (tx, rec) = start(
            fixture,
            vec![Entry::User {
                text: "original".into(),
            }],
            Some("missing-session"),
        );
        let _ = tx.send(SessionCmd::Prompt("never send this".into()));
        wait_for(&rec, "failed resume", |r| {
            r.last_status() == Some(Status::Error)
        })
        .await;
        assert!(
            rec.agent_session.lock().is_none(),
            "must not replace original provider ID"
        );
        assert!(!rec
            .entries()
            .iter()
            .any(|e| matches!(e, Entry::User { text } if text == "never send this")));
        assert!(!rec
            .methods
            .lock()
            .iter()
            .any(|m| m == "session/new" || m == "session/prompt"));
    }
}

#[tokio::test(flavor = "multi_thread")]
async fn cached_history_uses_resume_when_advertised() {
    let (tx, rec) = start(
        "codex/read",
        vec![Entry::User {
            text: "earlier".into(),
        }],
        Some("native-session"),
    );
    wait_for(&rec, "resumed", |r| r.last_status() == Some(Status::Idle)).await;
    assert_eq!(rec.agent_session.lock().as_deref(), Some("native-session"));
    let methods = rec.methods.lock();
    assert!(methods.iter().any(|m| m == "session/resume"));
    assert!(!methods
        .iter()
        .any(|m| m == "session/new" || m == "session/load" || m == "session/prompt"));
    tx.send(SessionCmd::Shutdown).unwrap();
}

#[tokio::test(flavor = "multi_thread")]
async fn unsupported_resume_keeps_history_and_reports_error() {
    let (_tx, rec) = start(
        "glue/read",
        vec![Entry::User {
            text: "original".into(),
        }],
        Some("native"),
    );
    wait_for(&rec, "unsupported resume", |r| {
        r.last_status() == Some(Status::Error)
    })
    .await;
    assert!(rec.agent_session.lock().is_none());
}
