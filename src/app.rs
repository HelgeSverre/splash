//! The app definition — commands, events and providers — shared by the
//! windowed binary and the headless `splash-web` harness.

use std::path::PathBuf;

use elyra::{command, commands, AboutInfo, App, Ctx};

use crate::acp::map::TranscriptSnapshot;
use crate::agents::customize::{CommandFile, Doc, McpList, Skill};
use crate::agents::detect::AgentStatus;
use crate::git_info::GitInfo;
use crate::github::{
    Github, GithubCatalog, GithubComments, GithubItem, GithubKind, GithubPage, GithubSearch,
};
use crate::hub::{
    Agents, Customize, Hub, RpcLine, SessionView, Sessions, TranscriptEvent, Workspace,
    WorkspaceEvent,
};
use crate::store::{Isolation, Project};
use crate::terminal::{TermAttach, TermEvent};
use crate::workspace::{DirEntry, FileChange, FileContent, FileDiff};

/// The built Svelte frontend, embedded from memory.
#[derive(rust_embed::RustEmbed)]
#[folder = "app/dist"]
pub struct Assets;

/// Release metadata shared by the settings page and native About dialog.
#[derive(serde::Serialize, specta::Type)]
pub struct AppInfo {
    version: String,
    description: String,
    author: String,
    repository: String,
    license: String,
}

#[command]
fn app_info(_ctx: Ctx) -> AppInfo {
    AppInfo {
        version: env!("CARGO_PKG_VERSION").into(),
        description: env!("CARGO_PKG_DESCRIPTION").into(),
        author: env!("CARGO_PKG_AUTHORS").into(),
        repository: env!("CARGO_PKG_REPOSITORY").into(),
        license: env!("CARGO_PKG_LICENSE").into(),
    }
}

// ── agents ─────────────────────────────────────────────────────────────────

#[command]
async fn list_agents(ctx: Ctx, refresh: bool) -> elyra::Result<Vec<AgentStatus>> {
    Ok(ctx.get::<Agents>().list(refresh).await?)
}

#[command]
async fn probe_agent(ctx: Ctx, id: String) -> elyra::Result<AgentStatus> {
    Ok(ctx.get::<Agents>().probe(&id).await?)
}

#[command]
async fn set_agent_args(ctx: Ctx, id: String, args: String) -> elyra::Result<AgentStatus> {
    Ok(ctx.get::<Agents>().set_args(&id, &args).await?)
}

// GitHub credentials stay in the local GitHub CLI.
#[command]
async fn github_catalog(ctx: Ctx) -> elyra::Result<GithubCatalog> {
    Ok(ctx.get::<Github>().catalog().await?)
}

#[command]
async fn github_page(
    ctx: Ctx,
    repository: String,
    kind: GithubKind,
    cursor: Option<String>,
) -> elyra::Result<GithubPage> {
    Ok(ctx.get::<Github>().page(&repository, kind, cursor).await?)
}

#[command]
async fn github_comments(
    ctx: Ctx,
    repository: String,
    number: u32,
    kind: GithubKind,
) -> elyra::Result<GithubComments> {
    Ok(ctx
        .get::<Github>()
        .comments(&repository, number, kind)
        .await?)
}

#[command]
async fn github_create_issue(
    ctx: Ctx,
    repository: String,
    title: String,
    body: String,
) -> elyra::Result<GithubItem> {
    Ok(ctx
        .get::<Github>()
        .create_issue(&repository, &title, &body)
        .await?)
}

#[command]
async fn github_link_project(
    ctx: Ctx,
    repository: String,
    project_id: Option<String>,
) -> elyra::Result<()> {
    Ok(ctx
        .get::<Github>()
        .link(&repository, project_id.as_deref())
        .await?)
}

#[command]
async fn github_search(
    ctx: Ctx,
    repositories: Vec<String>,
    kind: GithubKind,
    filters: GithubSearch,
    cursor: Option<String>,
) -> elyra::Result<GithubPage> {
    Ok(ctx
        .get::<Github>()
        .search(&repositories, kind, filters, cursor)
        .await?)
}

#[command]
async fn github_work_session(
    ctx: Ctx,
    project_id: String,
    agent_id: String,
    repository: String,
    number: u32,
    title: String,
) -> elyra::Result<SessionView> {
    let sha = ctx
        .get::<Github>()
        .pull_request_revision(&project_id, &repository, number)
        .await?;
    Ok(ctx
        .get::<Sessions>()
        .create_at(
            &project_id,
            &agent_id,
            Isolation::Worktree,
            Some(title),
            Some(sha),
        )
        .await?)
}

#[command]
async fn github_actions_runs(
    ctx: Ctx,
    repository: String,
    filters: crate::github_actions::ActionsFilters,
    page: u32,
) -> elyra::Result<crate::github_actions::ActionsRuns> {
    Ok(ctx
        .get::<Github>()
        .actions_runs(&repository, filters, page)
        .await?)
}
#[command]
async fn github_actions_workflows(
    ctx: Ctx,
    repository: String,
    page: u32,
) -> elyra::Result<crate::github_actions::ActionsWorkflows> {
    Ok(ctx
        .get::<Github>()
        .actions_workflows(&repository, page)
        .await?)
}
#[command]
async fn github_actions_jobs(
    ctx: Ctx,
    repository: String,
    run_id: String,
    attempt: u32,
    page: u32,
) -> elyra::Result<crate::github_actions::ActionsJobs> {
    Ok(ctx
        .get::<Github>()
        .actions_jobs(&repository, &run_id, attempt, page)
        .await?)
}
#[command]
async fn github_actions_log(
    ctx: Ctx,
    repository: String,
    job_id: String,
) -> elyra::Result<crate::github_actions::ActionsLog> {
    Ok(ctx
        .get::<Github>()
        .actions_log(&repository, &job_id)
        .await?)
}

// ── projects ───────────────────────────────────────────────────────────────

#[command]
async fn list_projects(ctx: Ctx) -> elyra::Result<Vec<Project>> {
    Ok(ctx.get::<Sessions>().projects().await?)
}

#[command]
async fn add_project(ctx: Ctx, path: String) -> elyra::Result<Project> {
    Ok(ctx.get::<Sessions>().add_project(&path).await?)
}

#[command]
async fn remove_project(ctx: Ctx, id: String) -> elyra::Result<()> {
    Ok(ctx.get::<Sessions>().remove_project(&id).await?)
}

// ── sessions ───────────────────────────────────────────────────────────────

#[command]
async fn list_sessions(ctx: Ctx) -> elyra::Result<Vec<SessionView>> {
    Ok(ctx.get::<Sessions>().list().await?)
}

#[command]
async fn create_session(
    ctx: Ctx,
    project_id: String,
    agent_id: String,
    isolation: Isolation,
    title: Option<String>,
) -> elyra::Result<SessionView> {
    Ok(ctx
        .get::<Sessions>()
        .create(&project_id, &agent_id, isolation, title)
        .await?)
}

/// Read cached history without launching an agent. Sending a prompt reconnects explicitly.
#[command]
async fn open_session(ctx: Ctx, id: String) -> elyra::Result<TranscriptSnapshot> {
    Ok(ctx.get::<Sessions>().transcript(&id).await?)
}

#[command]
async fn discover_sessions(
    ctx: Ctx,
    agent_id: String,
    cwd: String,
    cursor: Option<String>,
) -> elyra::Result<crate::acp::history::HistoryPage> {
    Ok(ctx
        .get::<Sessions>()
        .discover(&agent_id, &cwd, cursor)
        .await?)
}
#[command]
async fn preview_session(
    ctx: Ctx,
    agent_id: String,
    cwd: String,
    session_id: String,
) -> elyra::Result<crate::hub::SessionPreview> {
    Ok(ctx
        .get::<Sessions>()
        .preview(&agent_id, &cwd, &session_id)
        .await?)
}
#[command]
async fn import_session(ctx: Ctx, token: String) -> elyra::Result<SessionView> {
    Ok(ctx.get::<Sessions>().import_preview(&token).await?)
}
#[command]
async fn search_sessions(
    ctx: Ctx,
    query: String,
) -> elyra::Result<Vec<crate::store::SessionMatch>> {
    Ok(ctx.get::<Sessions>().search(&query).await?)
}
#[command]
async fn acknowledge_session(ctx: Ctx, id: String) -> elyra::Result<()> {
    Ok(ctx.get::<Sessions>().acknowledge(&id).await?)
}
#[command]
async fn restart_session(ctx: Ctx, id: String) -> elyra::Result<()> {
    Ok(ctx.get::<Sessions>().restart(&id).await?)
}

/// The transcript alone, for a resync (the agent isn't started).
#[command]
async fn session_transcript(ctx: Ctx, id: String) -> elyra::Result<TranscriptSnapshot> {
    Ok(ctx.get::<Sessions>().transcript(&id).await?)
}

#[command]
async fn send_prompt(ctx: Ctx, id: String, text: String) -> elyra::Result<()> {
    Ok(ctx.get::<Sessions>().prompt(&id, &text).await?)
}

#[command]
async fn cancel(ctx: Ctx, id: String) -> elyra::Result<()> {
    Ok(ctx.get::<Sessions>().cancel(&id)?)
}

#[command]
async fn resolve_permission(
    ctx: Ctx,
    id: String,
    request_id: String,
    option_id: Option<String>,
) -> elyra::Result<()> {
    Ok(ctx
        .get::<Sessions>()
        .resolve_permission(&id, &request_id, option_id)?)
}

#[command]
async fn set_option(ctx: Ctx, id: String, option: String, value: String) -> elyra::Result<()> {
    Ok(ctx.get::<Sessions>().set_option(&id, &option, &value)?)
}

#[command]
async fn rename_session(ctx: Ctx, id: String, title: String) -> elyra::Result<()> {
    Ok(ctx.get::<Sessions>().rename(&id, &title).await?)
}

/// `force` discards uncommitted changes in a worktree; without it a dirty
/// worktree answers with the error "dirty".
#[command]
async fn archive_session(ctx: Ctx, id: String, force: bool) -> elyra::Result<()> {
    Ok(ctx.get::<Sessions>().archive(&id, force).await?)
}

#[command]
async fn delete_session(ctx: Ctx, id: String, force: bool) -> elyra::Result<()> {
    Ok(ctx.get::<Sessions>().delete(&id, force).await?)
}

#[command]
async fn rpc_log(ctx: Ctx, id: String) -> Vec<RpcLine> {
    ctx.get::<Sessions>().rpc_log(&id)
}

#[command]
async fn watch_rpc(ctx: Ctx, id: String, on: bool) {
    ctx.get::<Sessions>().watch_rpc(&id, on)
}

/// `splash <folder>…` adds those folders as projects on startup.
struct OpenArgs(Vec<String>);

impl elyra::Provider for OpenArgs {
    fn boot(&self, ctx: &Ctx) {
        let sessions = ctx.get::<Sessions>();
        let dirs = self.0.clone();
        tokio::spawn(async move {
            for dir in dirs {
                if let Err(e) = sessions.add_project(&dir).await {
                    eprintln!("splash: {dir}: {e}");
                }
            }
        });
    }
}

// ── workspace ──────────────────────────────────────────────────────────────

#[command]
async fn workspace_status(ctx: Ctx, id: String) -> elyra::Result<Vec<FileChange>> {
    Ok(ctx.get::<Workspace>().status(&id).await?)
}

#[command]
async fn file_diff(ctx: Ctx, id: String, path: String) -> elyra::Result<FileDiff> {
    Ok(ctx.get::<Workspace>().file_diff(&id, &path).await?)
}

#[command]
async fn list_dir(ctx: Ctx, id: String, path: String) -> elyra::Result<Vec<DirEntry>> {
    Ok(ctx.get::<Workspace>().list_dir(&id, &path).await?)
}

#[command]
async fn read_file(ctx: Ctx, id: String, path: String) -> elyra::Result<FileContent> {
    Ok(ctx.get::<Workspace>().read_file(&id, &path).await?)
}

#[command]
async fn watch_workspace(ctx: Ctx, id: String, on: bool) -> elyra::Result<()> {
    Ok(ctx.get::<Workspace>().watch(&id, on)?)
}

// ── terminal ───────────────────────────────────────────────────────────────

#[command]
async fn term_open(ctx: Ctx, id: String, cols: u16, rows: u16) -> elyra::Result<TermAttach> {
    Ok(ctx.get::<Workspace>().term_open(&id, cols, rows)?)
}

#[command]
async fn term_write(ctx: Ctx, id: String, data: String) -> elyra::Result<()> {
    Ok(ctx.get::<Workspace>().term_write(&id, &data)?)
}

#[command]
async fn term_resize(ctx: Ctx, id: String, cols: u16, rows: u16) -> elyra::Result<()> {
    Ok(ctx.get::<Workspace>().term_resize(&id, cols, rows)?)
}

#[command]
async fn term_close(ctx: Ctx, id: String) {
    ctx.get::<Workspace>().term_close(&id)
}

// ── settings & customisation ───────────────────────────────────────────────

#[command]
async fn get_settings(ctx: Ctx) -> elyra::Result<std::collections::BTreeMap<String, String>> {
    Ok(ctx.get::<Customize>().settings().await?)
}

#[command]
async fn set_setting(ctx: Ctx, key: String, value: String) -> elyra::Result<()> {
    Ok(ctx.get::<Customize>().set_setting(&key, &value).await?)
}

#[command]
async fn list_skills(ctx: Ctx) -> elyra::Result<Vec<Skill>> {
    Ok(ctx.get::<Customize>().skills().await?)
}

#[command]
async fn list_command_files(ctx: Ctx) -> elyra::Result<Vec<CommandFile>> {
    Ok(ctx.get::<Customize>().command_files().await?)
}

/// A skill or command file, split into frontmatter and body.
#[command]
async fn read_doc(ctx: Ctx, path: String) -> elyra::Result<Doc> {
    Ok(ctx.get::<Customize>().read_doc(&path).await?)
}

#[command]
async fn list_mcp_servers(ctx: Ctx) -> elyra::Result<McpList> {
    Ok(ctx.get::<Customize>().mcp_servers().await?)
}

#[command]
async fn session_git(ctx: Ctx, id: String, refresh: bool) -> elyra::Result<GitInfo> {
    Ok(ctx.get::<Workspace>().git_info(&id, refresh).await?)
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
                .description(env!("CARGO_PKG_DESCRIPTION"))
                .website(env!("CARGO_PKG_HOMEPAGE"))
                .repository(env!("CARGO_PKG_REPOSITORY"))
                .author(env!("CARGO_PKG_AUTHORS"), "https://github.com/HelgeSverre")
                .icon("/icon.png"),
        );
    let hub = Hub::new(data_dir, app.events());
    app.bind_as::<Sessions>(hub.sessions)
        .bind_as::<Github>(hub.github)
        .bind_as::<Agents>(hub.agents)
        .bind_as::<Workspace>(hub.workspace)
        .bind_as::<Customize>(hub.customize)
        .provider(OpenArgs(folders))
        .event::<SessionView>("session")
        .event::<TranscriptEvent>("transcript")
        .event::<AgentStatus>("agents")
        .event::<RpcLine>("rpc")
        .event::<WorkspaceEvent>("workspace")
        .event::<Project>("project")
        .event::<TermEvent>("term")
        .commands(commands![
            app_info,
            github_catalog,
            github_actions_runs,
            github_actions_workflows,
            github_actions_jobs,
            github_actions_log,
            github_search,
            github_work_session,
            github_page,
            github_comments,
            github_create_issue,
            github_link_project,
            list_agents,
            probe_agent,
            set_agent_args,
            list_projects,
            add_project,
            remove_project,
            list_sessions,
            discover_sessions,
            preview_session,
            import_session,
            search_sessions,
            acknowledge_session,
            restart_session,
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
