//! Persistence: projects, sessions and their transcripts in SQLite, through
//! Elyra's `Database` (raw SQL — text keys and upserts don't suit its models).
//!
//! Writes from sessions go through one background writer, so rapid
//! checkpoints of the same entry can't land out of order.

use elyra::db::sqlx::{self, Row};
use elyra::db::{Driver, RustMigration};
use elyra::Database;
use serde::{Deserialize, Serialize};
use tokio::sync::mpsc;

use crate::acp::model::Entry;

macro_rules! session_cols {
    () => {
        "id, project_id, agent_id, title, cwd, isolation, branch, base_sha, agent_session_id, archived, created_at, updated_at, usage_json, external, launch_args, attention_json, source_json, additional_directories_json, parent_id, title_override"
    };
}

fn isolation_str(i: &Isolation) -> &'static str {
    match i {
        Isolation::InPlace => "in_place",
        Isolation::Worktree => "worktree",
    }
}

use crate::error::Error;
pub use crate::error::Result;

fn err(e: impl std::fmt::Display) -> Error {
    Error::Store(e.to_string())
}

pub fn now() -> f64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_secs_f64())
        .unwrap_or(0.0)
}

/// A short random id with a readable prefix (`p_3f9a2c71d0e4`).
pub fn new_id(prefix: &str) -> String {
    let u = uuid::Uuid::new_v4().simple().to_string();
    format!("{prefix}_{}", &u[..12])
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, specta::Type)]
pub struct Project {
    pub id: String,
    pub name: String,
    pub path: String,
    pub is_git: bool,
    pub created_at: f64,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, specta::Type)]
#[serde(rename_all = "snake_case")]
pub enum Isolation {
    InPlace,
    Worktree,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, specta::Type)]
pub struct SessionRecord {
    pub id: String,
    pub project_id: String,
    pub agent_id: String,
    pub title: String,
    pub cwd: String,
    pub isolation: Isolation,
    pub branch: Option<String>,
    pub base_sha: Option<String>,
    pub agent_session_id: Option<String>,
    pub archived: bool,
    pub created_at: f64,
    pub updated_at: f64,
    /// The last usage the agent reported (context, cost), kept across restarts.
    pub usage: Option<crate::acp::model::Usage>,
    /// External conversations never own their directory or provider history.
    #[serde(default)]
    pub external: bool,
    /// The launch profile used when importing (None follows current settings).
    #[serde(default)]
    pub launch_args: Option<String>,
    #[serde(default)]
    pub attention: Option<Attention>,
    #[serde(default)]
    pub source: SessionSource,
    #[serde(default)]
    pub additional_directories: Vec<String>,
    #[serde(default)]
    pub parent_id: Option<String>,
    #[serde(default)]
    pub title_override: bool,
}

/// Provider metadata is separate from local activity and user-chosen titles.
#[derive(Clone, Debug, Default, PartialEq, Serialize, Deserialize, specta::Type)]
#[serde(default)]
pub struct SessionSource {
    pub capabilities: Option<crate::acp::history::HistoryCapabilities>,
    pub title: Option<String>,
    pub updated_at: Option<String>,
    pub metadata_json: Option<String>,
    pub synced_updated_at: Option<String>,
    pub last_synced_at: Option<f64>,
    pub last_local_activity_at: Option<f64>,
    pub deleted: bool,
}

pub fn timestamp(value: Option<&str>) -> Option<f64> {
    chrono::DateTime::parse_from_rfc3339(value?)
        .ok()
        .map(|t| t.timestamp_millis() as f64 / 1000.0)
}

struct SessionLifecycle;
impl RustMigration for SessionLifecycle {
    fn version(&self) -> &str {
        "20261006000002"
    }
    fn name(&self) -> &str {
        "session_lifecycle"
    }
    fn up(&self, _driver: Driver) -> Vec<String> {
        vec![
            "ALTER TABLE sessions ADD COLUMN source_json TEXT NOT NULL DEFAULT '{}'".into(),
            "ALTER TABLE sessions ADD COLUMN additional_directories_json TEXT NOT NULL DEFAULT '[]'".into(),
            "ALTER TABLE sessions ADD COLUMN parent_id TEXT".into(),
            "ALTER TABLE sessions ADD COLUMN title_override INTEGER NOT NULL DEFAULT 0".into(),
            // Existing titles may have been chosen by the user. Keep them on refresh.
            "UPDATE sessions SET title_override = 1 WHERE title <> 'New session'".into(),
        ]
    }
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, specta::Type)]
#[serde(rename_all = "snake_case")]
pub enum AttentionKind {
    Permission,
    Failed,
    Review,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, specta::Type)]
pub struct Attention {
    pub kind: AttentionKind,
    pub detail: String,
    pub at: f64,
}

#[derive(Clone, Debug, Serialize, Deserialize, specta::Type)]
pub struct SessionMatch {
    pub session_id: String,
    pub entry_index: u32,
    pub excerpt: String,
}

struct SessionLibrary;
impl RustMigration for SessionLibrary {
    fn version(&self) -> &str {
        "20261006000001"
    }
    fn name(&self) -> &str {
        "session_library"
    }
    fn up(&self, _driver: Driver) -> Vec<String> {
        vec![
            "ALTER TABLE sessions ADD COLUMN external INTEGER NOT NULL DEFAULT 0".into(),
            "ALTER TABLE sessions ADD COLUMN launch_args TEXT".into(),
            "ALTER TABLE sessions ADD COLUMN attention_json TEXT".into(),
            "CREATE UNIQUE INDEX imported_identity ON sessions(agent_id, agent_session_id, launch_args) WHERE external = 1".into(),
            "CREATE VIRTUAL TABLE entry_search USING fts5(session_id UNINDEXED, idx UNINDEXED, text, tokenize='unicode61')".into(),
            // Index human-readable text, including tool output. Existing transcripts are backfilled.
            "INSERT INTO entry_search(rowid, session_id, idx, text) SELECT rowid, session_id, idx, COALESCE(json_extract(data, '$.text'), json_extract(data, '$.title'), '') || ' ' || COALESCE(json_extract(data, '$.output'), '') || ' ' || COALESCE(json_extract(data, '$.content'), '') FROM entries".into(),
            "CREATE TRIGGER entries_search_insert AFTER INSERT ON entries BEGIN INSERT INTO entry_search(rowid, session_id, idx, text) VALUES (new.rowid, new.session_id, new.idx, COALESCE(json_extract(new.data, '$.text'), json_extract(new.data, '$.title'), '') || ' ' || COALESCE(json_extract(new.data, '$.output'), '') || ' ' || COALESCE(json_extract(new.data, '$.content'), '')); END".into(),
            "CREATE TRIGGER entries_search_update AFTER UPDATE ON entries BEGIN DELETE FROM entry_search WHERE rowid = old.rowid; INSERT INTO entry_search(rowid, session_id, idx, text) VALUES (new.rowid, new.session_id, new.idx, COALESCE(json_extract(new.data, '$.text'), json_extract(new.data, '$.title'), '') || ' ' || COALESCE(json_extract(new.data, '$.output'), '') || ' ' || COALESCE(json_extract(new.data, '$.content'), '')); END".into(),
            "CREATE TRIGGER entries_search_delete AFTER DELETE ON entries BEGIN DELETE FROM entry_search WHERE rowid = old.rowid; END".into(),
        ]
    }
}

struct Schema;
struct Settings;
struct SessionUsage;

impl RustMigration for SessionUsage {
    fn version(&self) -> &str {
        "20260924000003"
    }
    fn name(&self) -> &str {
        "session_usage"
    }
    fn up(&self, _driver: Driver) -> Vec<String> {
        vec!["ALTER TABLE sessions ADD COLUMN usage_json TEXT".into()]
    }
}

impl RustMigration for Settings {
    fn version(&self) -> &str {
        "20260924000002"
    }
    fn name(&self) -> &str {
        "settings"
    }
    fn up(&self, _driver: Driver) -> Vec<String> {
        vec!["CREATE TABLE settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)".into()]
    }
}

impl RustMigration for Schema {
    fn version(&self) -> &str {
        "20260924000001"
    }
    fn name(&self) -> &str {
        "splash_schema"
    }
    fn up(&self, _driver: Driver) -> Vec<String> {
        vec![
            "CREATE TABLE projects (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                path TEXT NOT NULL UNIQUE,
                is_git INTEGER NOT NULL DEFAULT 0,
                created_at REAL NOT NULL
            )"
            .into(),
            "CREATE TABLE sessions (
                id TEXT PRIMARY KEY,
                project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                agent_id TEXT NOT NULL,
                title TEXT NOT NULL,
                cwd TEXT NOT NULL,
                isolation TEXT NOT NULL,
                branch TEXT,
                base_sha TEXT,
                agent_session_id TEXT,
                archived INTEGER NOT NULL DEFAULT 0,
                created_at REAL NOT NULL,
                updated_at REAL NOT NULL
            )"
            .into(),
            "CREATE INDEX sessions_by_project ON sessions(project_id, updated_at)".into(),
            "CREATE TABLE entries (
                session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
                idx INTEGER NOT NULL,
                kind TEXT NOT NULL,
                data TEXT NOT NULL,
                PRIMARY KEY (session_id, idx)
            )"
            .into(),
            "CREATE TABLE agent_probes (
                agent_id TEXT PRIMARY KEY,
                data TEXT NOT NULL
            )"
            .into(),
            "CREATE TABLE agent_settings (
                agent_id TEXT PRIMARY KEY,
                extra_args TEXT NOT NULL DEFAULT ''
            )"
            .into(),
        ]
    }
}

enum Write {
    Entries {
        session: String,
        entries: Vec<(usize, Entry)>,
    },
    AgentSession {
        session: String,
        id: String,
    },
    Touch {
        session: String,
    },
    Usage {
        session: String,
        json: String,
    },
    Attention {
        session: String,
        json: Option<String>,
    },
    Title {
        session: String,
        title: String,
    },
    Source {
        session: String,
        json: String,
    },
    Barrier(tokio::sync::oneshot::Sender<()>),
}

#[derive(Clone)]
pub struct Store {
    db: Database,
    writer: mpsc::UnboundedSender<Write>,
}

impl Store {
    /// Open (creating if needed) and migrate. Must run inside a tokio runtime.
    pub async fn open(path: &std::path::Path) -> Result<Self> {
        if let Some(dir) = path.parent() {
            std::fs::create_dir_all(dir).map_err(err)?;
        }
        let db = Database::connect(&elyra::db::sqlite_url(path))
            .await
            .map_err(err)?;
        Self::with_db(db).await
    }

    pub async fn with_db(db: Database) -> Result<Self> {
        sqlx::raw_sql(sqlx::AssertSqlSafe(
            "PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;".to_string(),
        ))
        .execute(db.pool())
        .await
        .map_err(err)?;
        let migrations: Vec<Box<dyn RustMigration>> = vec![
            Box::new(Schema),
            Box::new(Settings),
            Box::new(SessionUsage),
            Box::new(SessionLibrary),
            Box::new(SessionLifecycle),
        ];
        db.migrator(std::path::PathBuf::from("migrations"))
            .run_rust(&migrations, Driver::Sqlite)
            .await
            .map_err(err)?;

        let (writer, mut rx) = mpsc::unbounded_channel::<Write>();
        let pool = db.pool().clone();
        tokio::spawn(async move {
            while let Some(w) = rx.recv().await {
                let result = match w {
                    Write::Entries { session, entries } => {
                        write_entries(&pool, &session, entries).await
                    }
                    Write::AgentSession { session, id } => {
                        sqlx::query("UPDATE sessions SET agent_session_id = ? WHERE id = ?")
                            .bind(id)
                            .bind(session)
                            .execute(&pool)
                            .await
                            .map(|_| ())
                    }
                    Write::Usage { session, json } => {
                        sqlx::query("UPDATE sessions SET usage_json = ? WHERE id = ?")
                            .bind(json)
                            .bind(session)
                            .execute(&pool)
                            .await
                            .map(|_| ())
                    }
                    Write::Attention { session, json } => {
                        sqlx::query("UPDATE sessions SET attention_json = ? WHERE id = ?")
                            .bind(json)
                            .bind(session)
                            .execute(&pool)
                            .await
                            .map(|_| ())
                    }
                    Write::Title { session, title } => sqlx::query(
                        "UPDATE sessions SET title = ? WHERE id = ? AND title_override = 0",
                    )
                    .bind(title)
                    .bind(session)
                    .execute(&pool)
                    .await
                    .map(|_| ()),
                    Write::Source { session, json } => {
                        sqlx::query("UPDATE sessions SET source_json = ? WHERE id = ?")
                            .bind(json)
                            .bind(session)
                            .execute(&pool)
                            .await
                            .map(|_| ())
                    }
                    Write::Barrier(done) => {
                        let _ = done.send(());
                        Ok(())
                    }
                    Write::Touch { session } => {
                        sqlx::query("UPDATE sessions SET updated_at = ? WHERE id = ?")
                            .bind(now())
                            .bind(session)
                            .execute(&pool)
                            .await
                            .map(|_| ())
                    }
                };
                if let Err(e) = result {
                    eprintln!("splash: store write failed: {e}");
                }
            }
        });
        Ok(Self { db, writer })
    }

    // ── projects ────────────────────────────────────────────────────────────

    pub async fn projects(&self) -> Result<Vec<Project>> {
        let rows = sqlx::query(
            "SELECT id, name, path, is_git, created_at FROM projects ORDER BY name COLLATE NOCASE",
        )
        .fetch_all(self.db.pool())
        .await
        .map_err(err)?;
        rows.iter().map(project_from).collect()
    }

    pub async fn project(&self, id: &str) -> Result<Project> {
        let row =
            sqlx::query("SELECT id, name, path, is_git, created_at FROM projects WHERE id = ?")
                .bind(id)
                .fetch_optional(self.db.pool())
                .await
                .map_err(err)?
                .ok_or_else(|| Error::Store(format!("no project {id}")))?;
        project_from(&row)
    }

    pub async fn add_project(&self, path: &str, name: &str, is_git: bool) -> Result<Project> {
        if let Some(row) =
            sqlx::query("SELECT id, name, path, is_git, created_at FROM projects WHERE path = ?")
                .bind(path)
                .fetch_optional(self.db.pool())
                .await
                .map_err(err)?
        {
            return project_from(&row);
        }
        let p = Project {
            id: new_id("p"),
            name: name.into(),
            path: path.into(),
            is_git,
            created_at: now(),
        };
        sqlx::query(
            "INSERT INTO projects (id, name, path, is_git, created_at) VALUES (?, ?, ?, ?, ?)",
        )
        .bind(&p.id)
        .bind(&p.name)
        .bind(&p.path)
        .bind(p.is_git as i64)
        .bind(p.created_at)
        .execute(self.db.pool())
        .await
        .map_err(err)?;
        Ok(p)
    }

    pub async fn remove_project(&self, id: &str) -> Result<()> {
        sqlx::query("DELETE FROM projects WHERE id = ?")
            .bind(id)
            .execute(self.db.pool())
            .await
            .map_err(err)?;
        Ok(())
    }

    // ── sessions ────────────────────────────────────────────────────────────

    pub async fn sessions(&self) -> Result<Vec<SessionRecord>> {
        let rows = sqlx::query(concat!(
            "SELECT ",
            session_cols!(),
            " FROM sessions ORDER BY updated_at DESC"
        ))
        .fetch_all(self.db.pool())
        .await
        .map_err(err)?;
        rows.iter().map(session_from).collect()
    }

    pub async fn session(&self, id: &str) -> Result<SessionRecord> {
        let row = sqlx::query(concat!(
            "SELECT ",
            session_cols!(),
            " FROM sessions WHERE id = ?"
        ))
        .bind(id)
        .fetch_optional(self.db.pool())
        .await
        .map_err(err)?
        .ok_or_else(|| Error::Store(format!("no session {id}")))?;
        session_from(&row)
    }

    pub async fn insert_session(&self, s: &SessionRecord) -> Result<()> {
        let mut conn = self.db.pool().acquire().await.map_err(err)?;
        insert_record(&mut conn, s).await
    }

    pub async fn set_title(&self, id: &str, title: &str) -> Result<()> {
        sqlx::query("UPDATE sessions SET title = ? WHERE id = ?")
            .bind(title)
            .bind(id)
            .execute(self.db.pool())
            .await
            .map_err(err)?;
        Ok(())
    }

    pub async fn rename(&self, id: &str, title: &str) -> Result<()> {
        sqlx::query("UPDATE sessions SET title = ?, title_override = 1 WHERE id = ?")
            .bind(title)
            .bind(id)
            .execute(self.db.pool())
            .await
            .map_err(err)?;
        Ok(())
    }

    pub fn queue_title(&self, session: &str, title: &str) {
        let _ = self.writer.send(Write::Title {
            session: session.into(),
            title: title.into(),
        });
    }

    pub fn queue_source(&self, session: &str, source: &SessionSource) {
        if let Ok(json) = serde_json::to_string(source) {
            let _ = self.writer.send(Write::Source {
                session: session.into(),
                json,
            });
        }
    }

    /// Swap the full replay and its metadata in one transaction. Deletes also
    /// update FTS, so shortened histories cannot leave stale search matches.
    pub async fn replace_history(&self, s: &SessionRecord, entries: &[Entry]) -> Result<()> {
        self.settle().await;
        let mut tx = self.db.pool().begin().await.map_err(err)?;
        sqlx::query("UPDATE sessions SET title = ?, updated_at = ?, source_json = ?, additional_directories_json = ?, launch_args = ? WHERE id = ?")
            .bind(&s.title).bind(s.updated_at)
            .bind(serde_json::to_string(&s.source).map_err(err)?)
            .bind(serde_json::to_string(&s.additional_directories).map_err(err)?)
            .bind(&s.launch_args).bind(&s.id).execute(&mut *tx).await.map_err(err)?;
        sqlx::query("DELETE FROM entries WHERE session_id = ?")
            .bind(&s.id)
            .execute(&mut *tx)
            .await
            .map_err(err)?;
        write_entries_on(
            &mut tx,
            &s.id,
            entries.iter().cloned().enumerate().collect(),
        )
        .await
        .map_err(err)?;
        tx.commit().await.map_err(err)?;
        Ok(())
    }

    pub async fn set_archived(&self, id: &str, archived: bool) -> Result<()> {
        sqlx::query("UPDATE sessions SET archived = ? WHERE id = ?")
            .bind(archived as i64)
            .bind(id)
            .execute(self.db.pool())
            .await
            .map_err(err)?;
        Ok(())
    }

    pub async fn delete_session(&self, id: &str) -> Result<()> {
        sqlx::query("DELETE FROM sessions WHERE id = ?")
            .bind(id)
            .execute(self.db.pool())
            .await
            .map_err(err)?;
        Ok(())
    }

    pub async fn entries(&self, session: &str) -> Result<Vec<Entry>> {
        let rows = sqlx::query("SELECT data FROM entries WHERE session_id = ? ORDER BY idx")
            .bind(session)
            .fetch_all(self.db.pool())
            .await
            .map_err(err)?;
        Ok(rows
            .iter()
            .filter_map(|r| r.try_get::<String, _>("data").ok())
            .map(|d| serde_json::from_str(&d).unwrap_or(Entry::Unknown { json: d }))
            .collect())
    }

    /// Atomically save a newly imported transcript; failed inserts leave no partial history.
    pub async fn save_import(&self, s: &SessionRecord, entries: &[Entry]) -> Result<()> {
        let mut tx = self.db.pool().begin().await.map_err(err)?;
        insert_record(&mut tx, s).await?;
        write_entries_on(
            &mut tx,
            &s.id,
            entries.iter().cloned().enumerate().collect(),
        )
        .await
        .map_err(err)?;
        tx.commit().await.map_err(err)?;
        Ok(())
    }

    /// Literal word-prefix search, with a maximum of 200 matching sessions.
    pub async fn search_sessions(&self, query: &str) -> Result<Vec<SessionMatch>> {
        let query = query.chars().take(1000).collect::<String>();
        let expression = query
            .split_whitespace()
            .map(|word| format!("\"{}\"*", word.replace('"', "\"\"")))
            .collect::<Vec<_>>()
            .join(" AND ");
        if expression.is_empty() {
            return Ok(Vec::new());
        }
        let rows = sqlx::query("SELECT session_id, idx, snippet(entry_search, 2, '', '', '…', 24) AS excerpt FROM entry_search WHERE entry_search MATCH ? AND rowid IN (SELECT min(rowid) FROM entry_search WHERE entry_search MATCH ? GROUP BY session_id) ORDER BY rank LIMIT 200")
            .bind(&expression).bind(&expression).fetch_all(self.db.pool()).await.map_err(err)?;
        rows.iter()
            .map(|r| {
                Ok(SessionMatch {
                    session_id: r.try_get("session_id").map_err(err)?,
                    entry_index: r.try_get::<i64, _>("idx").map_err(err)? as u32,
                    excerpt: r.try_get("excerpt").map_err(err)?,
                })
            })
            .collect()
    }

    pub fn queue_attention(&self, session: &str, attention: Option<&Attention>) {
        let _ = self.writer.send(Write::Attention {
            session: session.into(),
            json: attention.and_then(|a| serde_json::to_string(a).ok()),
        });
    }

    // ── writes from live sessions (queued) ─────────────────────────────────

    pub fn queue_entries(&self, session: &str, entries: Vec<(usize, Entry)>) {
        let _ = self.writer.send(Write::Entries {
            session: session.into(),
            entries,
        });
        let _ = self.writer.send(Write::Touch {
            session: session.into(),
        });
    }

    pub fn queue_usage(&self, session: &str, usage: &crate::acp::model::Usage) {
        if let Ok(json) = serde_json::to_string(usage) {
            let _ = self.writer.send(Write::Usage {
                session: session.into(),
                json,
            });
        }
    }

    pub fn queue_agent_session(&self, session: &str, id: &str) {
        let _ = self.writer.send(Write::AgentSession {
            session: session.into(),
            id: id.into(),
        });
    }

    /// Resolves once every write queued before it has been applied.
    pub async fn settle(&self) {
        let (tx, rx) = tokio::sync::oneshot::channel();
        if self.writer.send(Write::Barrier(tx)).is_ok() {
            let _ = rx.await;
        }
    }

    // ── agents ─────────────────────────────────────────────────────────────

    pub async fn save_probe(&self, agent: &str, json: &str) -> Result<()> {
        sqlx::query("INSERT INTO agent_probes (agent_id, data) VALUES (?, ?) ON CONFLICT(agent_id) DO UPDATE SET data = excluded.data")
            .bind(agent)
            .bind(json)
            .execute(self.db.pool())
            .await
            .map_err(err)?;
        Ok(())
    }

    pub async fn probes(&self) -> Result<Vec<(String, String)>> {
        let rows = sqlx::query("SELECT agent_id, data FROM agent_probes")
            .fetch_all(self.db.pool())
            .await
            .map_err(err)?;
        Ok(rows
            .iter()
            .filter_map(|r| Some((r.try_get("agent_id").ok()?, r.try_get("data").ok()?)))
            .collect())
    }

    pub async fn settings(&self) -> Result<std::collections::BTreeMap<String, String>> {
        let rows = sqlx::query("SELECT key, value FROM settings")
            .fetch_all(self.db.pool())
            .await
            .map_err(err)?;
        Ok(rows
            .iter()
            .filter_map(|r| Some((r.try_get("key").ok()?, r.try_get("value").ok()?)))
            .collect())
    }

    pub async fn set_setting(&self, key: &str, value: &str) -> Result<()> {
        sqlx::query("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value")
            .bind(key)
            .bind(value)
            .execute(self.db.pool())
            .await
            .map_err(err)?;
        Ok(())
    }

    pub async fn extra_args(&self, agent: &str) -> Result<String> {
        let row = sqlx::query("SELECT extra_args FROM agent_settings WHERE agent_id = ?")
            .bind(agent)
            .fetch_optional(self.db.pool())
            .await
            .map_err(err)?;
        Ok(row
            .and_then(|r| r.try_get("extra_args").ok())
            .unwrap_or_default())
    }

    pub async fn set_extra_args(&self, agent: &str, args: &str) -> Result<()> {
        sqlx::query("INSERT INTO agent_settings (agent_id, extra_args) VALUES (?, ?) ON CONFLICT(agent_id) DO UPDATE SET extra_args = excluded.extra_args")
            .bind(agent)
            .bind(args)
            .execute(self.db.pool())
            .await
            .map_err(err)?;
        Ok(())
    }
}

async fn write_entries(
    pool: &sqlx::AnyPool,
    session: &str,
    entries: Vec<(usize, Entry)>,
) -> std::result::Result<(), sqlx::Error> {
    let mut tx = pool.begin().await?;
    write_entries_on(&mut tx, session, entries).await?;
    tx.commit().await
}

async fn write_entries_on(
    conn: &mut sqlx::AnyConnection,
    session: &str,
    entries: Vec<(usize, Entry)>,
) -> std::result::Result<(), sqlx::Error> {
    for (idx, entry) in entries {
        sqlx::query(
            "INSERT INTO entries (session_id, idx, kind, data) VALUES (?, ?, ?, ?)
             ON CONFLICT(session_id, idx) DO UPDATE SET kind = excluded.kind, data = excluded.data",
        )
        .bind(session)
        .bind(idx as i64)
        .bind(entry.kind())
        .bind(serde_json::to_string(&entry).unwrap_or_default())
        .execute(&mut *conn)
        .await?;
    }
    Ok(())
}

async fn insert_record(conn: &mut sqlx::AnyConnection, s: &SessionRecord) -> Result<()> {
    sqlx::query(
            "INSERT INTO sessions (id, project_id, agent_id, title, cwd, isolation, branch, base_sha,
             agent_session_id, archived, created_at, updated_at, external, launch_args, attention_json, source_json, additional_directories_json, parent_id, title_override) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        )
        .bind(&s.id)
        .bind(&s.project_id)
        .bind(&s.agent_id)
        .bind(&s.title)
        .bind(&s.cwd)
        .bind(isolation_str(&s.isolation))
        .bind(s.branch.clone())
        .bind(s.base_sha.clone())
        .bind(s.agent_session_id.clone())
        .bind(s.archived as i64)
        .bind(s.created_at)
        .bind(s.updated_at)
        .bind(s.external as i64)
        .bind(&s.launch_args)
        .bind(s.attention.as_ref().and_then(|a| serde_json::to_string(a).ok()))
        .bind(serde_json::to_string(&s.source).map_err(err)?)
        .bind(serde_json::to_string(&s.additional_directories).map_err(err)?)
        .bind(&s.parent_id)
        .bind(s.title_override as i64)
        .execute(conn)
        .await
        .map_err(err)?;
    Ok(())
}

fn project_from(r: &sqlx::any::AnyRow) -> Result<Project> {
    Ok(Project {
        id: r.try_get("id").map_err(err)?,
        name: r.try_get("name").map_err(err)?,
        path: r.try_get("path").map_err(err)?,
        is_git: r.try_get::<i64, _>("is_git").map_err(err)? != 0,
        created_at: r.try_get("created_at").map_err(err)?,
    })
}

fn session_from(r: &sqlx::any::AnyRow) -> Result<SessionRecord> {
    let isolation: String = r.try_get("isolation").map_err(err)?;
    Ok(SessionRecord {
        id: r.try_get("id").map_err(err)?,
        project_id: r.try_get("project_id").map_err(err)?,
        agent_id: r.try_get("agent_id").map_err(err)?,
        title: r.try_get("title").map_err(err)?,
        cwd: r.try_get("cwd").map_err(err)?,
        isolation: if isolation == "worktree" {
            Isolation::Worktree
        } else {
            Isolation::InPlace
        },
        branch: r.try_get("branch").map_err(err)?,
        base_sha: r.try_get("base_sha").map_err(err)?,
        agent_session_id: r.try_get("agent_session_id").map_err(err)?,
        archived: r.try_get::<i64, _>("archived").map_err(err)? != 0,
        created_at: r.try_get("created_at").map_err(err)?,
        updated_at: r.try_get("updated_at").map_err(err)?,
        external: r.try_get::<i64, _>("external").map_err(err)? != 0,
        launch_args: r.try_get("launch_args").map_err(err)?,
        source: serde_json::from_str(&r.try_get::<String, _>("source_json").map_err(err)?)
            .map_err(err)?,
        additional_directories: serde_json::from_str(
            &r.try_get::<String, _>("additional_directories_json")
                .map_err(err)?,
        )
        .map_err(err)?,
        parent_id: r.try_get("parent_id").map_err(err)?,
        title_override: r.try_get::<i64, _>("title_override").map_err(err)? != 0,
        attention: r
            .try_get::<Option<String>, _>("attention_json")
            .map_err(err)?
            .and_then(|j| serde_json::from_str(&j).ok()),
        usage: r
            .try_get::<Option<String>, _>("usage_json")
            .ok()
            .flatten()
            .and_then(|j| serde_json::from_str(&j).ok()),
    })
}
