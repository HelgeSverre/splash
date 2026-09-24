//! The app definition — commands, events and providers — shared by the
//! windowed binary and the headless `splash-web` harness.

use std::path::PathBuf;
use std::sync::Arc;

use elyra::{command, commands, AboutInfo, App, Ctx};

use crate::agents::customize::{CommandFile, Doc, McpList, Skill};
use crate::agents::detect::AgentStatus;
use crate::git_info::GitInfo;
use crate::hub::{Hub, RpcLine, SessionView, TranscriptEvent, TranscriptSnapshot, WorkspaceEvent};
use crate::store::{Isolation, Project};
use crate::terminal::{TermAttach, TermEvent};
use crate::workspace::{DirEntry, FileChange, FileContent, FileDiff};

/// The built Svelte frontend, embedded from memory.
#[derive(rust_embed::RustEmbed)]
#[folder = "app/dist"]
pub struct Assets;
fn fail(e: String) -> elyra::Error {
    elyra::Error::command(e)
}

// ── agents ─────────────────────────────────────────────────────────────────

#[command]
async fn list_agents(ctx: Ctx, refresh: bool) -> elyra::Result<Vec<AgentStatus>> {
    ctx.get::<Hub>().agents(refresh).await.map_err(fail)
}

#[command]
async fn probe_agent(ctx: Ctx, id: String) -> elyra::Result<AgentStatus> {
    ctx.get::<Hub>().probe(&id).await.map_err(fail)
}

#[command]
async fn set_agent_args(ctx: Ctx, id: String, args: String) -> elyra::Result<AgentStatus> {
    ctx.get::<Hub>()
        .set_agent_args(&id, &args)
        .await
        .map_err(fail)
}

// ── projects ───────────────────────────────────────────────────────────────

#[command]
async fn list_projects(ctx: Ctx) -> elyra::Result<Vec<Project>> {
    ctx.get::<Hub>().projects().await.map_err(fail)
}

#[command]
async fn add_project(ctx: Ctx, path: String) -> elyra::Result<Project> {
    ctx.get::<Hub>().add_project(&path).await.map_err(fail)
}

#[command]
async fn remove_project(ctx: Ctx, id: String) -> elyra::Result<()> {
    ctx.get::<Hub>().remove_project(&id).await.map_err(fail)
}

// ── sessions ───────────────────────────────────────────────────────────────

#[command]
async fn list_sessions(ctx: Ctx) -> elyra::Result<Vec<SessionView>> {
    ctx.get::<Hub>().sessions().await.map_err(fail)
}

#[command]
async fn create_session(
    ctx: Ctx,
    project_id: String,
    agent_id: String,
    isolation: Isolation,
    title: Option<String>,
) -> elyra::Result<SessionView> {
    ctx.get::<Hub>()
        .create_session(&project_id, &agent_id, isolation, title)
        .await
        .map_err(fail)
}

/// The transcript to render, starting the agent in the background.
#[command]
async fn open_session(ctx: Ctx, id: String) -> elyra::Result<TranscriptSnapshot> {
    let hub = ctx.get::<Hub>();
    let snapshot = hub.open_session(&id).await.map_err(fail)?;
    let archived = hub.record(&id).map(|r| r.archived).unwrap_or(true);
    if !archived {
        hub.ensure_live(&id).await.map_err(fail)?;
    }
    Ok(snapshot)
}

#[command]
async fn session_transcript(ctx: Ctx, id: String) -> elyra::Result<TranscriptSnapshot> {
    ctx.get::<Hub>().open_session(&id).await.map_err(fail)
}

#[command]
async fn send_prompt(ctx: Ctx, id: String, text: String) -> elyra::Result<()> {
    ctx.get::<Hub>().prompt(&id, &text).await.map_err(fail)
}

#[command]
async fn cancel(ctx: Ctx, id: String) -> elyra::Result<()> {
    ctx.get::<Hub>().cancel(&id).map_err(fail)
}

#[command]
async fn resolve_permission(
    ctx: Ctx,
    id: String,
    request_id: String,
    option_id: Option<String>,
) -> elyra::Result<()> {
    ctx.get::<Hub>()
        .resolve_permission(&id, &request_id, option_id)
        .map_err(fail)
}

#[command]
async fn set_option(ctx: Ctx, id: String, option: String, value: String) -> elyra::Result<()> {
    ctx.get::<Hub>()
        .set_option(&id, &option, &value)
        .map_err(fail)
}

#[command]
async fn rename_session(ctx: Ctx, id: String, title: String) -> elyra::Result<()> {
    ctx.get::<Hub>().rename(&id, &title).await.map_err(fail)
}

/// `force` discards uncommitted changes in a worktree; without it a dirty
/// worktree answers with the error "dirty".
#[command]
async fn archive_session(ctx: Ctx, id: String, force: bool) -> elyra::Result<()> {
    ctx.get::<Hub>().archive(&id, force).await.map_err(fail)
}

#[command]
async fn delete_session(ctx: Ctx, id: String) -> elyra::Result<()> {
    ctx.get::<Hub>().delete(&id).await.map_err(fail)
}

#[command]
async fn rpc_log(ctx: Ctx, id: String) -> Vec<RpcLine> {
    ctx.get::<Hub>().rpc_log(&id)
}

#[command]
async fn watch_rpc(ctx: Ctx, id: String, on: bool) {
    ctx.get::<Hub>().watch_rpc(&id, on)
}

/// `splash <folder>…` adds those folders as projects on startup.
struct OpenArgs(Vec<String>);

impl elyra::Provider for OpenArgs {
    fn boot(&self, ctx: &Ctx) {
        let hub = ctx.get::<Hub>();
        let dirs = self.0.clone();
        tokio::spawn(async move {
            for dir in dirs {
                if let Err(e) = hub.add_project(&dir).await {
                    eprintln!("splash: {dir}: {e}");
                }
            }
        });
    }
}

// ── workspace ──────────────────────────────────────────────────────────────

#[command]
async fn workspace_status(ctx: Ctx, id: String) -> elyra::Result<Vec<FileChange>> {
    ctx.get::<Hub>().workspace_status(&id).await.map_err(fail)
}

#[command]
async fn file_diff(ctx: Ctx, id: String, path: String) -> elyra::Result<FileDiff> {
    ctx.get::<Hub>().file_diff(&id, &path).await.map_err(fail)
}

#[command]
async fn list_dir(ctx: Ctx, id: String, path: String) -> elyra::Result<Vec<DirEntry>> {
    ctx.get::<Hub>().list_dir(&id, &path).await.map_err(fail)
}

#[command]
async fn read_file(ctx: Ctx, id: String, path: String) -> elyra::Result<FileContent> {
    ctx.get::<Hub>().read_file(&id, &path).await.map_err(fail)
}

#[command]
async fn watch_workspace(ctx: Ctx, id: String, on: bool) -> elyra::Result<()> {
    ctx.get::<Hub>().watch_workspace(&id, on).map_err(fail)
}

// ── terminal ───────────────────────────────────────────────────────────────

#[command]
async fn term_open(ctx: Ctx, id: String, cols: u16, rows: u16) -> elyra::Result<TermAttach> {
    ctx.get::<Hub>().term_open(&id, cols, rows).map_err(fail)
}

#[command]
async fn term_write(ctx: Ctx, id: String, data: String) -> elyra::Result<()> {
    ctx.get::<Hub>().term_write(&id, &data).map_err(fail)
}

#[command]
async fn term_resize(ctx: Ctx, id: String, cols: u16, rows: u16) -> elyra::Result<()> {
    ctx.get::<Hub>().term_resize(&id, cols, rows).map_err(fail)
}

#[command]
async fn term_close(ctx: Ctx, id: String) {
    ctx.get::<Hub>().term_close(&id)
}

// ── settings & customisation ───────────────────────────────────────────────

#[command]
async fn get_settings(ctx: Ctx) -> elyra::Result<std::collections::BTreeMap<String, String>> {
    ctx.get::<Hub>().settings().await.map_err(fail)
}

#[command]
async fn set_setting(ctx: Ctx, key: String, value: String) -> elyra::Result<()> {
    ctx.get::<Hub>()
        .set_setting(&key, &value)
        .await
        .map_err(fail)
}

#[command]
async fn list_skills(ctx: Ctx) -> elyra::Result<Vec<Skill>> {
    ctx.get::<Hub>().skills().await.map_err(fail)
}

#[command]
async fn list_command_files(ctx: Ctx) -> elyra::Result<Vec<CommandFile>> {
    ctx.get::<Hub>().command_files().await.map_err(fail)
}

/// A skill or command file, split into frontmatter and body.
#[command]
async fn read_doc(ctx: Ctx, path: String) -> elyra::Result<Doc> {
    ctx.get::<Hub>().read_doc(&path).await.map_err(fail)
}

#[command]
async fn list_mcp_servers(ctx: Ctx) -> elyra::Result<McpList> {
    ctx.get::<Hub>().mcp_servers().await.map_err(fail)
}

#[command]
async fn session_git(ctx: Ctx, id: String, refresh: bool) -> elyra::Result<GitInfo> {
    ctx.get::<Hub>().git_info(&id, refresh).await.map_err(fail)
}

/// Where Splash keeps its database and worktrees (`SPLASH_DATA_DIR` overrides).
pub fn data_dir() -> PathBuf {
    std::env::var_os("SPLASH_DATA_DIR")
        .map(PathBuf::from)
        .unwrap_or_else(|| {
            dirs::data_dir()
                .unwrap_or_else(std::env::temp_dir)
                .join("Splash")
        })
}

/// The whole app, ready to `.run()` (or `.prepare()` for the harness).
pub fn build(data_dir: PathBuf, folders: Vec<String>) -> App {
    // Resolve the login-shell PATH up front, off the UI's critical path later.
    std::thread::spawn(|| {
        crate::agents::env::path();
    });

    let app = App::new()
        .title("Splash")
        .size(1440.0, 900.0)
        .min_size(900.0, 560.0)
        .persist_window_state()
        .batch_window(std::time::Duration::from_millis(16))
        .about(
            AboutInfo::new("Splash", env!("CARGO_PKG_VERSION"))
                .description("A small harness for coding agents.")
                .icon("/icon.svg"),
        );
    let hub: Arc<Hub> = Hub::new(data_dir, app.events());
    app.bind_as::<Hub>(hub)
        .provider(OpenArgs(folders))
        .event::<SessionView>("session")
        .event::<TranscriptEvent>("transcript")
        .event::<AgentStatus>("agents")
        .event::<RpcLine>("rpc")
        .event::<WorkspaceEvent>("workspace")
        .event::<Project>("project")
        .event::<TermEvent>("term")
        .commands(commands![
            list_agents,
            probe_agent,
            set_agent_args,
            list_projects,
            add_project,
            remove_project,
            list_sessions,
            create_session,
            open_session,
            session_transcript,
            send_prompt,
            cancel,
            resolve_permission,
            set_option,
            rename_session,
            archive_session,
            delete_session,
            rpc_log,
            watch_rpc,
            workspace_status,
            file_diff,
            list_dir,
            read_file,
            watch_workspace,
            term_open,
            term_write,
            term_resize,
            term_close,
            get_settings,
            set_setting,
            list_skills,
            list_mcp_servers,
            list_command_files,
            read_doc,
            session_git,
        ])
        .assets(elyra::asset_resolver::<Assets>())
}
