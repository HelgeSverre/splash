//! Provider history operations against a deterministic ACP subprocess, with
//! wire-level assertions. No installed agents or personal conversations used.
use serde_json::{json, Value};
use splash::{
    acp::{
        actor::{Sink, Status},
        model::SessionMeta,
    },
    agents::registry::{AgentSpec, AuthCheck, Transport},
    hub::Hub,
    store::{new_id, timestamp, Isolation},
};
use std::{path::PathBuf, sync::Arc, time::Duration};

struct Harness {
    hub: Hub,
    dir: PathBuf,
    cwd: PathBuf,
    root: PathBuf,
    fixture: PathBuf,
    audit: PathBuf,
}
impl Harness {
    fn new(flags: &[&str]) -> Self {
        let dir = std::env::temp_dir().join(new_id("history-lifecycle"));
        let cwd = dir.join("app");
        let root = cwd.join("shared");
        std::fs::create_dir_all(&root).unwrap();
        std::fs::write(cwd.join("keep.txt"), "user files").unwrap();
        let fixture = dir.join("fixture.jsonl");
        let audit = dir.join("audit.jsonl");
        let state = dir.join("deleted.json");
        let leak = |s: String| -> &'static str { Box::leak(s.into_boxed_str()) };
        let mut args = vec![
            leak(fixture.to_string_lossy().into_owned()),
            "--audit",
            leak(audit.to_string_lossy().into_owned()),
            "--state",
            leak(state.to_string_lossy().into_owned()),
            "--require-root",
            leak(root.to_string_lossy().into_owned()),
        ];
        args.extend(flags.iter().map(|s| leak(s.to_string())));
        let program = env!("CARGO_BIN_EXE_fake-acp");
        let spec: &'static AgentSpec = Box::leak(Box::new(AgentSpec {
            id: "fake",
            name: "Fake",
            cli: program,
            program,
            args: Box::leak(args.into_boxed_slice()),
            env: &[],
            transport: Transport::Native,
            experimental: false,
            auth: AuthCheck::File("nope"),
        }));
        let hub = Hub::with_agents(
            dir.join("data"),
            elyra::EventBus::new(),
            Arc::new(move |_| Some(spec)),
        );
        let harness = Self {
            hub,
            dir,
            cwd,
            root,
            fixture,
            audit,
        };
        harness.write_fixture(
            "Original source title",
            "2026-10-06T10:00:00Z",
            "oldneedle",
            true,
            true,
        );
        harness
    }
    fn write_fixture(&self, title: &str, date: &str, text: &str, load: bool, fork: bool) {
        let mut caps =
            json!({"list":{},"resume":{},"close":{},"delete":{},"additionalDirectories":{}});
        if fork {
            caps["fork"] = json!({});
        }
        let out = |id, method, params| json!({"t":0,"dir":"out","line":{"jsonrpc":"2.0","id":id,"method":method,"params":params}});
        let result =
            |id, result| json!({"t":0,"dir":"in","line":{"jsonrpc":"2.0","id":id,"result":result}});
        let rows = vec![
            out(1, "initialize", json!({})),
            result(
                1,
                json!({"protocolVersion":1,"agentCapabilities":{"loadSession":load,"sessionCapabilities":caps}}),
            ),
            out(2, "session/new", json!({})),
            result(2, json!({"sessionId":"new-native"})),
            out(3, "session/list", json!({})),
            result(
                3,
                json!({"sessions":[{"sessionId":"native-1","cwd":self.cwd,"title":title,"updatedAt":date,"additionalDirectories":[self.root],"_meta":{"label":"fixture"}}],"nextCursor":"page-2"}),
            ),
            out(4, "session/load", json!({})),
            json!({"t":0,"dir":"in","line":{"jsonrpc":"2.0","method":"session/update","params":{"sessionId":"native-1","update":{"sessionUpdate":"user_message_chunk","content":{"type":"text","text":text}}}}}),
            json!({"t":0,"dir":"in","line":{"jsonrpc":"2.0","method":"session/update","params":{"sessionId":"native-1","update":{"sessionUpdate":"agent_message_chunk","content":{"type":"text","text":"Saved answer"}}}}}),
            result(4, json!({})),
        ];
        std::fs::write(
            &self.fixture,
            rows.iter()
                .map(Value::to_string)
                .collect::<Vec<_>>()
                .join("\n"),
        )
        .unwrap();
    }
    async fn import(&self) -> splash::hub::SessionView {
        let page = self
            .hub
            .sessions
            .discover("fake", self.cwd.to_str().unwrap(), None)
            .await
            .unwrap();
        let preview = self
            .hub
            .sessions
            .preview("fake", page.sessions[0].clone())
            .await
            .unwrap();
        self.hub
            .sessions
            .import_preview(&preview.token)
            .await
            .unwrap()
    }
    fn requests(&self, method: &str) -> Vec<Value> {
        std::fs::read_to_string(&self.audit)
            .unwrap()
            .lines()
            .filter_map(|s| serde_json::from_str::<Value>(s).ok())
            .filter(|v| v["method"] == method)
            .collect()
    }
    async fn wait_status(&self, id: &str, status: Status) {
        for _ in 0..200 {
            if self
                .hub
                .sessions
                .list()
                .await
                .unwrap()
                .iter()
                .any(|s| s.record.id == id && s.status == status)
            {
                return;
            }
            tokio::time::sleep(Duration::from_millis(25)).await;
        }
        panic!("status {status:?} never reached");
    }
}
impl Drop for Harness {
    fn drop(&mut self) {
        let _ = std::fs::remove_dir_all(&self.dir);
    }
}

#[tokio::test(flavor = "multi_thread")]
async fn all_folder_listing_omits_cwd_and_pagination_keeps_its_scope() {
    let h = Harness::new(&[]);
    let page = h.hub.sessions.discover("fake", "", None).await.unwrap();
    assert!(
        page.capabilities.fork
            && page.capabilities.delete
            && page.capabilities.additional_directories
    );
    assert_eq!(
        page.sessions[0].additional_directories,
        vec![h.root.to_str().unwrap()]
    );
    let next = h
        .hub
        .sessions
        .discover("fake", "", page.next_cursor)
        .await
        .unwrap();
    assert!(next.sessions.is_empty());
    let calls = h.requests("session/list");
    assert!(calls.iter().all(|r| r["params"].get("cwd").is_none()));
    assert_eq!(calls[1]["params"]["cursor"], "page-2");
    assert!(h.requests("session/new").is_empty());
    assert!(h.requests("session/prompt").is_empty());
}

#[tokio::test(flavor = "multi_thread")]
async fn transport_failure_keeps_the_last_native_metadata() {
    let h = Harness::new(&[]);
    let saved = h.import().await;
    let id = &saved.record.id;
    h.hub.sessions.restart(id).await.unwrap();
    h.wait_status(id, Status::Idle).await;
    let mut meta = h
        .hub
        .sessions
        .list()
        .await
        .unwrap()
        .into_iter()
        .find(|s| s.record.id == *id)
        .unwrap()
        .meta;
    meta.title = Some("Latest native title".into());
    meta.source_updated_at = Some("2026-10-07T10:00:00Z".into());
    meta.source_metadata_json = Some(r#"{"label":"latest"}"#.into());
    meta.info_revision = 1;
    h.hub.sessions.status(id, Status::Idle, None, &meta);
    let before = h.hub.sessions.record(id).unwrap();
    h.hub.sessions.status(
        id,
        Status::Error,
        Some("Transport closed"),
        &SessionMeta::default(),
    );
    let after = h.hub.sessions.record(id).unwrap();
    assert_eq!(after.source, before.source);
    assert_eq!(after.title, "Latest native title");
    let view = h
        .hub
        .sessions
        .list()
        .await
        .unwrap()
        .into_iter()
        .find(|s| s.record.id == *id)
        .unwrap();
    assert_eq!(view.meta, meta);
    h.hub.sessions.disconnect(id).await.unwrap();
}

#[tokio::test(flavor = "multi_thread")]
async fn refresh_replaces_history_and_fts_preserves_identity_rename_and_native_dates() {
    let h = Harness::new(&[]);
    let saved = h.import().await;
    let id = &saved.record.id;
    assert_eq!(saved.record.title, "Original source title");
    assert_eq!(
        saved.record.updated_at,
        timestamp(Some("2026-10-06T10:00:00Z")).unwrap()
    );
    h.hub.sessions.rename(id, "My local title").await.unwrap();
    h.write_fixture(
        "New source title",
        "2026-10-07T10:00:00Z",
        "newneedle",
        true,
        true,
    );
    h.hub
        .sessions
        .discover("fake", h.cwd.to_str().unwrap(), None)
        .await
        .unwrap();
    let before = h.hub.sessions.record(id).unwrap();
    assert_eq!(
        before.source.updated_at.as_deref(),
        Some("2026-10-07T10:00:00Z")
    );
    assert_ne!(before.source.updated_at, before.source.synced_updated_at);
    let refreshed = h.hub.sessions.refresh_history(id).await.unwrap();
    assert_eq!(refreshed.record.id, *id);
    assert_eq!(refreshed.record.title, "My local title");
    assert_eq!(refreshed.record.created_at, saved.record.created_at);
    assert_eq!(
        refreshed.record.source.title.as_deref(),
        Some("New source title")
    );
    assert_eq!(
        refreshed.record.source.updated_at,
        refreshed.record.source.synced_updated_at
    );
    assert!(h.hub.sessions.search("oldneedle").await.unwrap().is_empty());
    assert_eq!(h.hub.sessions.search("newneedle").await.unwrap().len(), 1);
    let store = h.hub.core.store().await.unwrap();
    assert_eq!(store.entries(id).await.unwrap().len(), 2);
    assert_eq!(store.session(id).await.unwrap(), refreshed.record);
    assert!(h
        .requests("session/load")
        .iter()
        .all(|r| r["params"]["additionalDirectories"] == json!([h.root])));
    assert!(h.requests("session/prompt").is_empty());
}

#[tokio::test(flavor = "multi_thread")]
async fn failed_refresh_and_delete_preserve_the_local_copy() {
    let h = Harness::new(&["--fail-delete"]);
    let saved = h.import().await;
    let id = &saved.record.id;
    let snap = h.hub.sessions.transcript(id).await.unwrap();
    h.write_fixture(
        "Unavailable",
        "2026-10-07T10:00:00Z",
        "different",
        false,
        true,
    );
    assert!(h.hub.sessions.refresh_history(id).await.is_err());
    assert_eq!(h.hub.sessions.record(id).unwrap(), saved.record);
    assert_eq!(
        h.hub.sessions.transcript(id).await.unwrap().entries,
        snap.entries
    );
    assert!(h.hub.sessions.delete_native(id).await.is_err());
    assert!(!h.hub.sessions.record(id).unwrap().source.deleted);
    assert_eq!(
        h.hub.core.store().await.unwrap().entries(id).await.unwrap(),
        snap.entries
    );
}

#[tokio::test(flavor = "multi_thread")]
async fn reconnect_preserves_roots_and_close_is_used_before_history_operations() {
    let h = Harness::new(&[]);
    let saved = h.import().await;
    let id = &saved.record.id;
    h.hub.sessions.restart(id).await.unwrap();
    h.wait_status(id, Status::Idle).await;
    assert!(h.hub.sessions.refresh_history(id).await.is_err());
    assert!(h.hub.sessions.fork_history(id).await.is_err());
    assert!(h.hub.sessions.delete_native(id).await.is_err());
    assert_eq!(
        h.requests("session/resume")[0]["params"]["additionalDirectories"],
        json!([h.root])
    );
    h.hub.sessions.disconnect(id).await.unwrap();
    h.wait_status(id, Status::Exited).await;
    assert!(h.requests("session/close").len() >= 2);
    h.hub.sessions.refresh_history(id).await.unwrap();
}

#[tokio::test(flavor = "multi_thread")]
async fn native_delete_removes_listing_but_keeps_files_and_read_only_local_history() {
    let h = Harness::new(&[]);
    let saved = h.import().await;
    let id = &saved.record.id;
    let deleted = h.hub.sessions.delete_native(id).await.unwrap();
    assert!(deleted.record.source.deleted);
    assert_eq!(
        deleted.record.agent_session_id,
        saved.record.agent_session_id
    );
    assert_eq!(
        h.hub
            .core
            .store()
            .await
            .unwrap()
            .entries(id)
            .await
            .unwrap()
            .len(),
        2
    );
    assert!(h.hub.sessions.prompt(id, "do not send").await.is_err());
    assert!(h.hub.sessions.refresh_history(id).await.is_err());
    let page = h
        .hub
        .sessions
        .discover("fake", h.cwd.to_str().unwrap(), None)
        .await
        .unwrap();
    assert!(page.sessions.is_empty());
    assert!(h.cwd.join("keep.txt").exists());
    h.hub.sessions.delete(id, false).await.unwrap();
    assert!(h.cwd.join("keep.txt").exists());
    assert_eq!(h.requests("session/delete").len(), 1);
}

#[tokio::test(flavor = "multi_thread")]
async fn fork_uses_current_agent_history_keeps_parent_and_records_new_identity() {
    let h = Harness::new(&[]);
    let parent = h.import().await;
    h.write_fixture(
        "New source title",
        "2026-10-07T10:00:00Z",
        "forkneedle",
        true,
        true,
    );
    let child = h
        .hub
        .sessions
        .fork_history(&parent.record.id)
        .await
        .unwrap();
    assert_ne!(
        child.record.agent_session_id,
        parent.record.agent_session_id
    );
    assert_eq!(
        child.record.parent_id.as_deref(),
        Some(parent.record.id.as_str())
    );
    assert_eq!(
        child.record.additional_directories,
        parent.record.additional_directories
    );
    assert_eq!(
        h.hub.sessions.record(&parent.record.id).unwrap(),
        parent.record
    );
    assert_eq!(
        h.hub.sessions.search("forkneedle").await.unwrap()[0].session_id,
        child.record.id
    );
    assert_eq!(
        h.requests("session/fork")[0]["params"]["additionalDirectories"],
        json!([h.root])
    );
    assert!(h.requests("session/prompt").is_empty());
    h.write_fixture("No fork support", "2026-10-07T10:00:00Z", "x", true, false);
    assert!(h
        .hub
        .sessions
        .fork_history(&parent.record.id)
        .await
        .is_err());
    assert_eq!(h.requests("session/fork").len(), 1);
}

#[tokio::test(flavor = "multi_thread")]
async fn new_sessions_send_extra_roots_and_unresponsive_close_is_bounded() {
    let h = Harness::new(&["--hang-close"]);
    let project = h
        .hub
        .sessions
        .add_project(h.cwd.to_str().unwrap())
        .await
        .unwrap();
    let session = h
        .hub
        .sessions
        .create_at(
            &project.id,
            "fake",
            Isolation::InPlace,
            None,
            None,
            vec![h.root.to_str().unwrap().into()],
        )
        .await
        .unwrap();
    h.wait_status(&session.record.id, Status::Idle).await;
    assert_eq!(
        h.requests("session/new")[0]["params"]["additionalDirectories"],
        json!([h.root])
    );
    tokio::time::timeout(
        Duration::from_secs(5),
        h.hub.sessions.disconnect(&session.record.id),
    )
    .await
    .unwrap()
    .unwrap();
    h.wait_status(&session.record.id, Status::Exited).await;
    assert_eq!(h.requests("session/close").len(), 1);
}

#[test]
fn session_info_updates_distinguish_omitted_fields_from_explicit_null() {
    let mut transcript = splash::acp::map::Transcript::restore(vec![]);
    transcript.apply(&json!({"sessionUpdate":"session_info_update", "title":"Native", "updatedAt":"2026-10-06T10:00:00Z", "_meta":{"tag":"demo"}}));
    transcript.apply(&json!({"sessionUpdate":"session_info_update", "title":null}));
    assert_eq!(transcript.meta.title, None);
    assert_eq!(
        transcript.meta.source_updated_at.as_deref(),
        Some("2026-10-06T10:00:00Z")
    );
    assert!(transcript.meta.source_metadata_json.is_some());
    transcript
        .apply(&json!({"sessionUpdate":"session_info_update", "updatedAt":null, "_meta":null}));
    assert_eq!(transcript.meta.source_updated_at, None);
    assert_eq!(transcript.meta.source_metadata_json, None);
    assert_eq!(transcript.meta.info_revision, 3);
}

#[tokio::test(flavor = "multi_thread")]
async fn discovery_reports_the_launcher_error_when_initialization_closes() {
    let spec = AgentSpec {
        id: "broken",
        name: "Broken adapter",
        cli: env!("CARGO_BIN_EXE_fake-acp"),
        program: env!("CARGO_BIN_EXE_fake-acp"),
        args: &["--fail-initialize"],
        env: &[],
        transport: Transport::Native,
        experimental: false,
        auth: AuthCheck::File("nope"),
    };
    let result = splash::acp::history::read(
        &spec,
        &std::env::temp_dir(),
        &[],
        splash::acp::history::Request::List {
            cwd: None,
            cursor: None,
        },
    )
    .await;
    let error = match result {
        Err(e) => e.to_string(),
        Ok(_) => panic!("broken adapter must fail"),
    };
    assert!(
        error.contains("Broken adapter history request failed"),
        "{error}"
    );
    assert!(
        error.contains("adapter executable missing: reinstall the adapter"),
        "{error}"
    );
}
