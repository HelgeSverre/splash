<p align="center">
  <img src="app/public/icon.png" width="96" height="96" alt="Splash app icon">
</p>

<h1 align="center">Splash</h1>

<p align="center">
  A desktop app for running coding agents such as Claude Code, Codex and Gemini CLI in your git projects.
</p>

<p align="center">
  <a href="https://github.com/HelgeSverre/splash/actions/workflows/ci.yml"><img src="https://github.com/HelgeSverre/splash/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <img src="https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey" alt="Platforms: macOS, Windows and Linux">
  <img src="https://img.shields.io/badge/status-early%20development-yellow" alt="Status: early development">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="License: MIT"></a>
</p>

Splash talks to agents over the [Agent Client Protocol](https://agentclientprotocol.com) (ACP), a JSON-RPC protocol many coding agents implement for use in editors. It starts the agent as a child process, sends it your prompts and shows what it streams back: messages, tool calls, diffs, plans and permission requests.

Each session is one agent working in one project folder. It runs in the folder itself or, in a git repository, in a separate worktree: a second checkout of the repo on its own branch.

Splash is an early personal project. Native CI covers macOS (Apple silicon and Intel), Windows x64, and Ubuntu 24.04 x64. The single-user server builds separately without GUI libraries. Provider compatibility is checked with an ACP handshake on the machine running the agents; an installed CLI alone is not proof of support.

## Screenshots

Click any screenshot to open it at full size. Session and workbench captures use an isolated demo project; GitHub captures show public repositories. The session library, ACP history, fork, attention, and review captures use synthetic conversations and fixture-backed ACP responses in the real app's web harness. Server captures use the authenticated server locally with isolated data and fixture agents; they demonstrate the UI, not a live remote deployment.

The platform settings captures below show a macOS browser connected to the local
macOS demo server. The Linux and Windows captures show downloaded CI artifacts
running in Ubuntu 24.04 Docker/Xvfb and a temporary Windows Server 2025 EC2 desktop.
See the [artifact smoke-test report](docs/artifact-smoke-2026-10-07.md) for scope and results.

<table>
  <tr>
    <td width="50%" valign="top"><strong>Linux CI artifact — installed DEB</strong><br><a href="screenshots/linux-ci-artifact.png"><img src="screenshots/linux-ci-artifact.png" alt="Installed Linux CI artifact rendering in an Ubuntu 24.04 Docker container with Xvfb" width="100%"></a></td>
    <td width="50%" valign="top"><strong>Windows CI artifact — standard-user install</strong><br><a href="screenshots/windows-ci-artifact.png"><img src="screenshots/windows-ci-artifact.png" alt="Installed Windows CI artifact running as a standard user on a temporary Windows Server 2025 EC2 desktop" width="100%"></a></td>
  </tr>
  <tr>
    <td width="50%" valign="top"><strong>Backend host and shell diagnostics</strong><br><a href="screenshots/platform-host.jpg"><img src="screenshots/platform-host.jpg" alt="About Splash showing the backend operating system, architecture, terminal shell and isolated data location" width="100%"></a></td>
    <td width="50%" valign="top"><strong>Client and browser shortcut conventions</strong><br><a href="screenshots/platform-shortcuts.jpg"><img src="screenshots/platform-shortcuts.jpg" alt="Keyboard settings with browser-safe default shortcuts on a macOS client" width="100%"></a></td>
  </tr>
  <tr>
    <td colspan="2" valign="top"><strong>Verify ACP compatibility on the backend host</strong><br><a href="screenshots/platform-agent-check.jpg"><img src="screenshots/platform-agent-check.jpg" alt="Agent settings showing a successful fixture-backed ACP handshake on the macOS demo host" width="100%"></a></td>
  </tr>
  <tr>
    <td width="50%" valign="top"><strong>Discover sessions through the server</strong><br><a href="screenshots/server-discovery-restored.jpg"><img src="screenshots/server-discovery-restored.jpg" alt="Successful server discovery with two fixture sessions each from Claude Code, Codex and Pi" width="100%"></a></td>
    <td width="50%" valign="top"><strong>Diagnose an adapter startup failure</strong><br><a href="screenshots/server-discovery-error.jpg"><img src="screenshots/server-discovery-error.jpg" alt="Agent initialization failure including stderr that identifies a missing adapter executable" width="100%"></a></td>
  </tr>
  <tr>
    <td width="50%" valign="top"><strong>Sign in to a Splash server</strong><br><a href="screenshots/server-login.jpg"><img src="screenshots/server-login.jpg" alt="Token login for the authenticated Splash server" width="100%"></a></td>
    <td width="50%" valign="top"><strong>Server session library</strong><br><a href="screenshots/server-library.jpg"><img src="screenshots/server-library.jpg" alt="Connected server status and saved conversations in the browser" width="100%"></a></td>
  </tr>
  <tr>
    <td width="50%" valign="top"><strong>Choose a folder on the server</strong><br><a href="screenshots/server-folders.jpg"><img src="screenshots/server-folders.jpg" alt="Browser folder picker showing projects on the server filesystem" width="100%"></a></td>
    <td width="50%" valign="top"><strong>Keep drafts during a disconnect</strong><br><a href="screenshots/server-offline.jpg"><img src="screenshots/server-offline.jpg" alt="Offline banner with a saved conversation and an unsent draft preserved" width="100%"></a></td>
  </tr>

  <tr>
    <td width="50%" valign="top">
      <strong>Browse history across agents and folders</strong><br>
      <a href="screenshots/agent-session-browser.jpg"><img src="screenshots/agent-session-browser.jpg" alt="Unified agent history with independent pagination, loaded-session search, activity filters and sorting" width="100%"></a>
    </td>
    <td width="50%" valign="top">
      <strong>Refresh a conversation continued elsewhere</strong><br>
      <a href="screenshots/session-history-refresh.jpg"><img src="screenshots/session-history-refresh.jpg" alt="Refreshed transcript with source activity, synchronization time and additional workspace folders" width="100%"></a>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <strong>Fork a conversation</strong><br>
      <a href="screenshots/session-fork.jpg"><img src="screenshots/session-fork.jpg" alt="Experimental conversation fork choices showing the workspace folders shared with the original session" width="100%"></a>
    </td>
    <td width="50%" valign="top">
      <strong>Prepare a review in a fork</strong><br>
      <a href="screenshots/session-fork-review.jpg"><img src="screenshots/session-fork-review.jpg" alt="Forked conversation linked to its parent, with an editable review draft ready to send" width="100%"></a>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <strong>Inspect native history and capabilities</strong><br>
      <a href="screenshots/session-history-management.jpg"><img src="screenshots/session-history-management.jpg" alt="Agent history metadata, workspace folders and advertised lifecycle capabilities" width="100%"></a>
    </td>
    <td width="50%" valign="top">
      <strong>Delete agent history with confirmation</strong><br>
      <a href="screenshots/session-history-delete.jpg"><img src="screenshots/session-history-delete.jpg" alt="Explicit confirmation to delete native agent history while keeping the saved Splash transcript" width="100%"></a>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <strong>Session library</strong><br>
      <a href="screenshots/session-library.jpg"><img src="screenshots/session-library.jpg" alt="Saved conversations across agents, with project, agent and status filters" width="100%"></a>
    </td>
    <td width="50%" valign="top">
      <strong>Search saved and archived transcripts</strong><br>
      <a href="screenshots/session-search.jpg"><img src="screenshots/session-search.jpg" alt="Transcript search results with excerpts from active and archived conversations" width="100%"></a>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <strong>Preview existing agent sessions</strong><br>
      <a href="screenshots/agent-session-preview.jpg"><img src="screenshots/agent-session-preview.jpg" alt="ACP session discovery and conversation preview before adding it to Splash" width="100%"></a>
    </td>
    <td width="50%" valign="top">
      <strong>Needs attention</strong><br>
      <a href="screenshots/attention-inbox.jpg"><img src="screenshots/attention-inbox.jpg" alt="Persistent permission, recovery and completed-work queues" width="100%"></a>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <strong>Review response, diffs, and feedback</strong><br>
      <a href="screenshots/review.jpg"><img src="screenshots/review.jpg" alt="Review panel beside a code diff, with the final response and feedback composer" width="100%"></a>
    </td>
    <td width="50%" valign="top">
      <strong>Library empty state</strong><br>
      <a href="screenshots/session-library-empty.jpg"><img src="screenshots/session-library-empty.jpg" alt="Empty library with options to start a session or open agent history" width="100%"></a>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <strong>Jump to a matching message</strong><br>
      <a href="screenshots/session-search-match.jpg"><img src="screenshots/session-search-match.jpg" alt="Archived conversation opened at the highlighted transcript search match" width="100%"></a>
    </td>
    <td width="50%" valign="top">
      <strong>Retry one agent while keeping other results</strong><br>
      <a href="screenshots/agent-session-error.jpg"><img src="screenshots/agent-session-error.jpg" alt="One agent's discovery error and retry action beside successful results from the other agents" width="100%"></a>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <strong>Sessions and transcripts</strong><br>
      <a href="screenshots/session.jpg"><img src="screenshots/session.jpg" alt="Saved conversation with explicit reconnect and the review panel" width="100%"></a>
    </td>
    <td width="50%" valign="top">
      <strong>GitHub triage</strong><br>
      <a href="screenshots/github-triage.png"><img src="screenshots/github-triage.png" alt="Splash: GitHub triage" width="100%"></a>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <strong>Actions run overview</strong><br>
      <a href="screenshots/actions-overview.png"><img src="screenshots/actions-overview.png" alt="Splash: Actions run overview" width="100%"></a>
    </td>
    <td width="50%" valign="top">
      <strong>Failed jobs and searchable logs</strong><br>
      <a href="screenshots/actions-detail.png"><img src="screenshots/actions-detail.png" alt="Splash: Failed jobs and searchable logs" width="100%"></a>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <strong>Workflow catalog</strong><br>
      <a href="screenshots/actions-workflows.png"><img src="screenshots/actions-workflows.png" alt="Splash: Workflow catalog" width="100%"></a>
    </td>
    <td width="50%" valign="top">
      <strong>GitHub search</strong><br>
      <a href="screenshots/github-search.png"><img src="screenshots/github-search.png" alt="Splash: GitHub search" width="100%"></a>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <strong>Repository scope picker</strong><br>
      <a href="screenshots/repository-picker.png"><img src="screenshots/repository-picker.png" alt="Splash: Repository scope picker" width="100%"></a>
    </td>
    <td width="50%" valign="top">
      <strong>Issue editor</strong><br>
      <a href="screenshots/issue-editor.png"><img src="screenshots/issue-editor.png" alt="Splash: Issue editor" width="100%"></a>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <strong>Markdown issue preview</strong><br>
      <a href="screenshots/issue-preview.png"><img src="screenshots/issue-preview.png" alt="Splash: Markdown issue preview" width="100%"></a>
    </td>
    <td width="50%" valign="top">
      <strong>New session with additional folders</strong><br>
      <a href="screenshots/new-session-folders.jpg"><img src="screenshots/new-session-folders.jpg" alt="New session setup with additional workspace folders, mode, model and permission choices" width="100%"></a>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <strong>File browser</strong><br>
      <a href="screenshots/files.png"><img src="screenshots/files.png" alt="Splash: File browser" width="100%"></a>
    </td>
    <td width="50%" valign="top">
      <strong>Diff viewer</strong><br>
      <a href="screenshots/diff.png"><img src="screenshots/diff.png" alt="Splash: Diff viewer" width="100%"></a>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <strong>Terminal</strong><br>
      <a href="screenshots/terminal.png"><img src="screenshots/terminal.png" alt="Splash: Terminal" width="100%"></a>
    </td>
    <td width="50%" valign="top">
      <strong>Session details</strong><br>
      <a href="screenshots/session-details.png"><img src="screenshots/session-details.png" alt="Splash: Session details" width="100%"></a>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <strong>JSON-RPC log</strong><br>
      <a href="screenshots/rpc-log.png"><img src="screenshots/rpc-log.png" alt="Splash: JSON-RPC log" width="100%"></a>
    </td>
    <td width="50%" valign="top">
      <strong>Command palette</strong><br>
      <a href="screenshots/command-palette.png"><img src="screenshots/command-palette.png" alt="Splash: Command palette" width="100%"></a>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <strong>Welcome</strong><br>
      <a href="screenshots/welcome.png"><img src="screenshots/welcome.png" alt="Splash: Welcome" width="100%"></a>
    </td>
    <td width="50%" valign="top">
      <strong>General settings</strong><br>
      <a href="screenshots/settings-general.png"><img src="screenshots/settings-general.png" alt="Splash: General settings" width="100%"></a>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <strong>Agent overview</strong><br>
      <a href="screenshots/settings-agents.png"><img src="screenshots/settings-agents.png" alt="Splash: Agent overview" width="100%"></a>
    </td>
    <td width="50%" valign="top">
      <strong>Agent configuration</strong><br>
      <a href="screenshots/settings-agent.png"><img src="screenshots/settings-agent.png" alt="Splash: Agent configuration" width="100%"></a>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <strong>Agent skills</strong><br>
      <a href="screenshots/settings-skills.png"><img src="screenshots/settings-skills.png" alt="Splash: Agent skills" width="100%"></a>
    </td>
    <td width="50%" valign="top">
      <strong>Agent commands</strong><br>
      <a href="screenshots/settings-commands.png"><img src="screenshots/settings-commands.png" alt="Splash: Agent commands" width="100%"></a>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <strong>MCP servers</strong><br>
      <a href="screenshots/settings-mcp.png"><img src="screenshots/settings-mcp.png" alt="Splash: MCP servers" width="100%"></a>
    </td>
    <td width="50%" valign="top">
      <strong>Keyboard shortcuts</strong><br>
      <a href="screenshots/settings-shortcuts.png"><img src="screenshots/settings-shortcuts.png" alt="Splash: Keyboard shortcuts" width="100%"></a>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <strong>About Splash</strong><br>
      <a href="screenshots/settings-about.png"><img src="screenshots/settings-about.png" alt="Splash: About Splash" width="100%"></a>
    </td>
    <td width="50%" valign="top">
      <strong>Design system playground</strong><br>
      <a href="screenshots/design-system.png"><img src="screenshots/design-system.png" alt="Splash: Design system playground" width="100%"></a>
    </td>
  </tr>
</table>

The [screenshots folder](screenshots/) also preserves the [original session capture](screenshots/session-original.png) and the [early GitHub design explorations](screenshots/design-explorations/). Those concepts are not screenshots of the current app. Images are tracked in Git, excluded from the Cargo package, and kept outside the embedded frontend and app bundle.

## Getting started

### Download the app

Get tagged builds from [Releases](https://github.com/HelgeSverre/splash/releases).
Every CI run also uploads candidate packages under **Actions → CI → Artifacts**.
CI artifacts are test builds, not signed public releases.

| Platform | Artifacts | Installation / requirements |
| --- | --- | --- |
| macOS 14+ Apple silicon / Intel | Universal `.pkg` installer, plus `.app` ZIPs per architecture; all signed and notarized | Open the `.pkg`, or extract a ZIP (`arm64` or `x86_64`) and move Splash to Applications. |
| Windows 11 x64 | Per-user `-setup.exe` and portable `.zip` | Run setup or extract the ZIP. Requires [WebView2 Evergreen Runtime](https://developer.microsoft.com/microsoft-edge/webview2/). The Visual C++ runtime is statically linked; packages are currently unsigned. |
| Ubuntu 24.04 x64 | `.deb`, `.AppImage`, `.tar.gz` | Prefer `sudo apt install ./Splash-*.deb` to install runtime dependencies automatically. |
| Headless server, all four targets | `splash-server-*` ZIP or tarball | Extract and run `splash-server --help`; no windowing/WebKit runtime required. |

All archives/installers have adjacent SHA-256 files. Verify with `sha256sum -c`
on Linux, `shasum -a 256` on macOS, or `Get-FileHash -Algorithm SHA256` on Windows.
Tagged releases publish automatically after native checks, package smoke tests,
macOS notarization and a complete checksum-verified asset inventory pass. A new
app version on `main` is tagged automatically after CI succeeds. The historical
`v0.1.0` release contains only the original Apple silicon macOS build; the full
platform matrix applies to subsequent releases. macOS signing/notarization keeps using the
configured Apple secrets for desktop app ZIPs; Windows packages and standalone
server archives are unsigned.

#### Linux AppImage caveats

The AppImage deliberately uses the host's maintained GTK/WebKit libraries. It
is **not a universal Linux bundle**. Ubuntu 24.04 is the tested runtime baseline
(glibc 2.39); other distributions must supply compatible libraries:

```sh
sudo apt install libgtk-3-0t64 libwebkit2gtk-4.1-0 libxdo3 libssl3t64 libfuse2t64
chmod +x Splash-*.AppImage
./Splash-*.AppImage
```

If FUSE is unavailable, extract with `./Splash-*.AppImage --appimage-extract`
and run `./squashfs-root/AppRun`. Keep extracted files in a directory owned by
your user. Never run Splash as root or disable the WebKit sandbox.

Sourcefour's AppImage permission/cache lessons are encoded in the packaging
checks: pinned, checksum-verified appimagetool; final-image launcher and binary
permissions checked for **all users**; a glibc symbol scan; and fresh-runtime GUI
smoke tests run as an ordinary user with a private temporary directory. These
check the final AppImage and extracted `.deb`, not just a build-tree executable.
The Linux webview uses GTK embedding for X11/Wayland; automated renderer smoke
coverage currently uses Xvfb (X11), so Wayland remains a manual verification item.

### Build from source

Requirements:

- A supported OS, git, stable Rust (rustup), Node.js 22.12+, Python 3.11+, and [just](https://github.com/casey/just).
- Windows: MSVC Rust target, Visual Studio C++ Build Tools, WebView2, and Git Bash for `just` recipes.
- Ubuntu desktop builds: `sudo apt install build-essential pkg-config libgtk-3-dev libwebkit2gtk-4.1-dev libxdo-dev libssl-dev`. Headless builds need the compiler, pkg-config, and OpenSSL development files only.
- At least one agent from the [table below](#agents), installed and signed in.
- Optional: `gh`, signed in with `gh auth login --hostname github.com`, for the GitHub view and branch pull requests.

```bash
git clone https://github.com/HelgeSverre/splash.git
cd splash
just setup                  # frontend dependencies, and rata (Elyra's CLI, built with cargo)
just run                    # build the frontend and start the app
just run ~/code/some-repo   # the same, adding a folder as a project
```

The first build compiles all Rust dependencies and takes a few minutes. In the app, add a project folder, press ⌘N to open the new-session dialog, pick an agent, and send a prompt. `just detect` lists which agents Splash can find and whether they answer.

Data lives in `~/Library/Application Support/Splash`. Set `SPLASH_DATA_DIR` to use another folder.

## Run as a web app over SSH

Run `splash-server` on the machine that owns your repositories and agent logins.
Open its UI in your browser through an SSH tunnel. Agents still speak ACP over
local stdio on that machine; SSH transports the browser connection. Files, Git,
terminals, session discovery and agent execution all stay together on the server.

```text
Browser → localhost:4780 → SSH tunnel → Splash server → ACP stdio → agents
                                            └─────── repositories / terminals
```

Build on the server with Rust, Node.js and the frontend dependencies installed:

```sh
cd app && npm ci && cd ..
just server-build
mkdir -p ~/.local/bin
cp target/release/splash-server ~/.local/bin/
~/.local/bin/splash-server --name devbox --data-dir ~/.local/share/SplashServer ~/code/my-project
```

On Ubuntu 24.04, install `build-essential pkg-config libgtk-3-dev
libwebkit2gtk-4.1-dev libxdo-dev libssl-dev` first. Elyra currently links desktop
libraries into the server binary, but the server does not open a window or need
a display. Install and authenticate your chosen agents on that same machine.
Node.js is also needed there for agents launched through npm adapters.

From your laptop:

```sh
ssh -N -o ExitOnForwardFailure=yes -o ServerAliveInterval=30 \
  -L 127.0.0.1:4780:127.0.0.1:4780 devbox
```

Open **http://127.0.0.1:4780** and paste the token from the server's
`DATA_DIR/server.token`. Startup prints the token file's location, never its
contents. Read the file through your SSH session. Keep the token private: it
provides access to this user's repositories, terminals and agents.

The server binds only to loopback and requires a token. Login uses an HttpOnly,
SameSite cookie; foreign origins and non-loopback Host headers are rejected.
This is a personal, single-user service intended for SSH forwarding, not a public
or multi-user web deployment. Several hosts can use different local tunnel ports;
each server keeps its own login cookie and database.

`--port`, `--data-dir`, `--name`, `--help` and `--version` are available. The default
data folder is `SplashServer` under the OS data directory, separate from the
desktop app's `Splash` folder. `SPLASH_DATA_DIR` overrides it. Do not share a live
database with the desktop app; a lock prevents two servers using the same folder.
Completion scripts for Bash, Zsh and Fish are in [completions/](completions/).

### Keep the server running

For Linux, install the supplied user service after copying the binary:

```sh
mkdir -p ~/.config/systemd/user
cp packaging/server/splash.service ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable --now splash
journalctl --user -u splash -f
```

Edit its name, data directory and environment as needed. To keep a user service
running after logout, the machine administrator can enable lingering with
`loginctl enable-linger USER`. For macOS, copy the
[launchd example](packaging/server/com.helgesverre.splash-server.plist.example) to
`~/Library/LaunchAgents/com.helgesverre.splash-server.plist`, replace `YOUR_USER`
with your actual account name, then load it with
`launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.helgesverre.splash-server.plist`.
These templates are not installed automatically.

Closing a browser or losing the SSH tunnel leaves agents running in the service.
When connectivity returns, Splash refreshes sessions, the current transcript,
permissions, files and existing terminal views. Drafts stay in the open tab;
sending, continuing a conversation and the Needs attention, Review and history
actions are disabled while disconnected. Commands are never automatically replayed
because a failed response does not prove that the server missed the command. One
that fails while the connection is being restored says so ("The server restarted.
Try again in a moment.").

Restarting the backend interrupts agent and terminal processes. Saved transcripts
remain, and the browser notices the restart at once and restores its connection
and current view as soon as the server answers; continue the conversation explicitly. Drafts are held in browser memory, so save important
unsent text before reloading or signing out. To rotate access, stop the service,
remove only `server.token` from its data directory, and start it again; every
browser must sign in with the new token.

If **Find sessions** reports a transport closing during `initialize`, the adapter
exited before completing its ACP handshake. The error includes the agent's recent
stderr under **Agent output**. Check that executable paths still exist and that
the agent or adapter is installed and authenticated on the server, then retry.
The documented demo uses fixture agents, not your personal agent installations.

This version connects one browser tab to one server. A multi-host dashboard and
launching a remote ACP agent directly through `ssh host agent --acp` are separate
future work; they are not needed for the server-over-SSH setup above.

## Features

- **Sessions.** In place or in a worktree on a `splash/…` branch. Archiving or deleting removes the worktree and keeps the branch. Both require an explicit discard confirmation if there are uncommitted changes; deleting also removes the transcript.
- **Transcript.** Markdown with syntax highlighting, collapsible thinking, tool calls with status and diffs, plans as checklists, and permission requests answered with the 1–9 keys.
- **Agent controls.** Model, mode and effort pickers when the agent offers them, slash-command completion, and context and cost readouts when the agent reports them.
- **GitHub.** A triage view across personal and organization repositories, with repository/owner filters, issues, PRs, branches, recent activity and discussions. Git remotes connect items to local projects and sessions; additional projects can be linked manually. Create issues in any accessible repository with a Markdown editor and preview.
- **Actions.** Cross-repository workflow runs, filters, workflow catalog, attempt details, job steps and searchable log previews.
- **Workbench.** A side panel with the session's git changes, a file tree and session details; diff and file tabs; a terminal in the session folder (⌘J).
- **Session library.** Search titles, folders, and saved transcript text across agents, including archived conversations. Filter by project, agent, or status. Search results open the matching message; session URLs survive reloads.
- **Existing agent history.** Browse all installed agents and folders together, with independent loading, errors, pagination, and cached lists. Search and sort loaded results, preview their transcripts and workspace folders, then add or update a local copy.
- **Needs attention.** Permissions, connection failures, and completed turns stay in a persistent queue. Open the conversation, reconnect or recheck the agent, and mark finished work reviewed.
- **Review.** See the latest response, failed tools, changed files, and an associated PR when available. Open every changed file as a diff, send feedback, or ask the agent to review its work.
- **History controls.** Refresh conversations continued outside Splash, preserve additional workspace folders, disconnect gracefully, and choose between removing a local copy or deleting agent history. Fork a conversation into a separate approach or prepare a review draft when the agent supports it.
- **Resume.** Cached conversations open without starting an agent. Continue or send a message to reconnect using `session/resume` or `session/load` when supported. A failed reconnect preserves the original session ID and history, with the unsent draft available to retry.
- **Settings.** Per-agent status and version, a connection test that sends no prompt, extra launch arguments, read-only lists of each agent's skills, commands and MCP servers, and rebindable shortcuts.
- **Log.** Each session's JSON-RPC traffic, kept in memory for the current run.

## Existing sessions and review

Open **Sessions → Open from agent** and choose **All installed agents** and
**All folders**, or narrow either filter, then **Find sessions**. Each agent has
its own progress, retry controls, and **Load more** button. Lists stay cached
for the current app run; **Refresh lists** checks again. Search, activity
filters, and sorting apply to the pages loaded so far, not the agent's entire
history. Agents without listing can still be opened by a known session ID.

Select a conversation to preview its transcript and complete workspace folder
list. **Add to Splash** saves a local copy; **Update local copy** replaces an
existing disconnected conversation's cached transcript. Neither sends a prompt.

Splash negotiates ACP v1 and checks the running adapter's capabilities.
[`session/list`](https://agentclientprotocol.com/protocol/v1/session-list)
discovers conversations; omitting its folder filter requests all known sessions.
[`session/load`](https://agentclientprotocol.com/protocol/v1/session-setup)
replays history. `session/resume` reconnects without replay, so reconnecting a
cached conversation is separate from refreshing it.

The repository's recorded initialization fixtures establish this baseline:

| Adapter in recorded fixture | Lists sessions | Loads history | Resumes without replay |
| --- | --- | --- | --- |
| Claude Code 0.81.1 | Yes | Yes | Yes |
| Codex 1.13.1 | Yes | Yes | Yes |
| Pi 0.0.33 | Yes | Yes | No |
| Pool 1.0.16 | Yes | Yes | No |
| Glue 0.9.0 | No | No | No |

The same capability checks apply to every configured agent. Actual history
availability depends on the installed adapter, account, launch arguments, and
working directory; advertised support does not guarantee that every native CLI
conversation is exposed. Splash does not parse private vendor history formats
or attach to another running process. ACP v2-only adapters need a separate
protocol integration.

Previewing starts a short-lived agent connection and sends no prompt. Import
stores the transcript, original agent session ID, working directory, additional
workspace folders, source metadata, and launch arguments. Imported conversations
stay in their original folders. Previews expire after 15 minutes.

**Refresh from agent** reloads a disconnected conversation, replacing its
transcript and search index together. A failed refresh leaves the cached copy
intact. Splash keeps user-chosen titles, records when history was last synced,
and shows **New activity at agent** when discovery reports newer source activity.
This is a manual refresh, not a live attachment to another agent process.
Workspace roots are included on supported new, load, resume, and fork requests;
an adapter that cannot restore a saved root set reports an error instead of
silently dropping folders.

**Disconnect agent** uses `session/close` when advertised, with a bounded wait
and process termination as a fallback. Stop an active turn before disconnecting.
**Manage history** shows the source metadata and separate removal actions:

- **Remove local copy** removes Splash's transcript while keeping provider
  history and external folders. Deleting an owned worktree session also removes
  its worktree; a worktree shared by a fork must be kept until that fork is
  archived or removed.
- **Delete agent history** requires confirmation and advertised
  [`session/delete`](https://agentclientprotocol.com/protocol/v1/session-delete)
  support. The conversation disappears from the agent's list; storage erasure
  depends on the agent. Splash retains a read-only local transcript.

**Fork conversation** creates a new native conversation from the provider's
current context and links it to its parent. **Try another approach** opens the
fork; **Fork for review** also prepares a review message for you to send. Forks
share workspace files with their parent. Arbitrary branching from a selected
message is not supported. The
[`session/fork` extension](https://agentclientprotocol.com/rfds/session-fork)
is experimental; Splash enables it only for agents advertising fork and history
loading. Recorded Claude and Codex fixtures advertise these capabilities, but
availability still depends on the running adapter.

The **In Splash** search uses literal word prefixes in persisted transcript
text and tool output, with up to 200 transcript matches per query. Narrow the
query when the limit is reached. It includes archived history and only searches
conversations already saved in Splash.

**Needs attention** keeps pending permissions, failures, and completed turns
across restarts. An interrupted permission must be requested again by the
reconnected agent; an old request cannot be answered. On macOS and Linux, a
turn still running when Splash quits needs recovery after the restart. **Review response &
changes** opens the Review panel. Its file list describes the folder's current
git changes, which may include work from another session sharing that folder.
Send feedback or request a review to continue the same conversation, then use
**Mark reviewed** when finished.

## GitHub view

Open **GitHub** in the sidebar (or the command palette). Splash uses the active
`github.com` account in GitHub CLI; it does not store a separate token. Private
repositories and organizations are visible only when that login has access,
including any required organization SSO authorization.

Use **Repositories** to choose a set across owners, or **Linked to Splash** to
focus on local projects. Owner, repository scope and selected tab survive a
restart. The catalog includes repositories outside Splash. Matching GitHub
remotes link projects automatically; **Link to Splash** connects other folders.
Select a row to read its description/discussion, open GitHub, or continue a local
session. **New issue** is also available from the command palette. Closing the
composer retains the draft for the current app run; submission requires pressing
**Create issue**.

Activity loads progressively, with up to four requests in flight. The first page
contains up to 30 items per repository/feed; **Load more**
continues pagination. Filters and counts describe loaded items, not a complete
historical total. **Needs me** includes direct review requests, assignments, and
your PRs with failed checks or requested changes; team review requests are not
included. Branch dates refer to the last commit. GitHub's event feed has limited
history and may be delayed. Discussions show the latest 30 comments, with a link
to older comments and inline PR reviews on GitHub. Refresh is manual; failures
remain visible with retry controls.

The repository picker supports **Clear all**, search, and **Select matches** /
**Deselect matches** without losing selections outside the search. **Save view**
stores the repository scope, owner, linked filter, type, state, inbox filter and
search fields. Saved views and inbox state are local and scoped to the GitHub login.

**Search GitHub** searches issues and PRs beyond the loaded activity, with author,
assignee, label and review filters. Text is literal; use the fields for qualifiers.
Search runs explicitly, two requests at a time, with pause/resume and pagination.
GitHub caps search at 1,000 matches per group of up to ten repositories/type and indexing can lag;
narrow your scope if you reach that limit.
Saved searches restore their fields; press **Search GitHub** to run them. Branches
and events remain available in **Loaded activity**.

**Unread** tracks updates since you first opened this inbox or last marked an item
read. Mark individual items read/unread or mark the matching loaded list read.
Snooze until tomorrow at 9 AM local time or until new activity; a newer update wakes
either kind of snooze. Use **Snoozed** to review or unsnooze deferred items. These
controls do not modify GitHub notifications. Refresh to check for new activity.

**Work on this** opens session setup and prepares the item title, description and
URL in the composer for review before sending. For PRs, choose a fresh worktree
from the PR head, including fork PRs. This requires a matching local GitHub remote
and working Git authentication. Splash fetches a unique temporary ref and creates
its own branch without switching the current checkout. Existing sessions are
labelled when their branch or saved source URL matches the item.

## GitHub Actions

Open **Actions** in the sidebar, command palette, or GitHub triage header. The
repository picker, owner filter and **Linked to Splash** scope are shared with
triage, including clear/search/select-matches controls.

**Runs** combines recent runs across the selected repositories, newest first.
Status, time range, exact branch and event filters are sent to GitHub; the text
field filters the loaded results. Counts describe loaded runs. The initial page
contains 30 runs per repository, with **Load more run history**, pause/resume and
visible per-repository errors. GitHub limits filtered history to 1,000 results per
repository. Refresh is manual; refreshing runs also reloads the selected run’s jobs.

**Workflows** lists workflows separately, including disabled ones and workflows
without recent runs. **View runs** narrows the run list to that workflow. Clear
**All workflows** to return to the full repository scope.

Select a run to inspect a specific attempt’s jobs, step outcomes, runner, timings,
and matching Splash sessions. Completed jobs have searchable plain-text log
previews, capped at 512 KiB; **Full job and logs** opens GitHub for live logs or the
rest of a long log. Expired logs and missing Actions permissions appear as errors.
The Actions integration only reads GitHub data; it does not dispatch, rerun or
cancel workflows.

## Agents

Splash does not install agents or sign in to them. Install and authenticate each CLI yourself; the `npx` adapters are downloaded by npx the first time they run. Splash can tell that an agent is signed out only for Claude Code, Codex, Glue and Pool. For the others, the connection test or the first session shows it.

<details>
<summary>Launch commands (20 agents)</summary>

| Agent | Launch command |
|---|---|
| Claude Code | `npx -y @agentclientprotocol/claude-agent-acp@0.81.1` |
| Codex | `npx -y @agentclientprotocol/codex-acp@1.13.1` |
| Glue | `glue acp` |
| Amp | `npx -y amp-acp@0.9.0` |
| Autohand | `npx -y @autohandai/autohand-acp@0.2.1` |
| Copilot | `copilot --acp` |
| Devin | `devin acp` |
| Dirac | `dirac --acp` |
| Droid | `droid exec --output-format acp-daemon` |
| Gemini | `gemini --acp` |
| Goose | `goose acp` |
| Hermes | `hermes acp` |
| Junie | `junie --acp=true` |
| Kimi | `kimi acp` |
| Letta | `npx -y @letta-ai/letta-acp@0.1.11` |
| OpenCode | `opencode acp` |
| OpenHands | `openhands acp` |
| Pi | `npx -y pi-acp@0.0.33` |
| Pool | `pool acp` |
| Vibe | `vibe-acp` |

</details>

The `npx` entries are adapters around the vendor's CLI; the rest are the CLIs' own ACP modes. The list and pinned versions are in `src/agents/registry.rs`. Agents report different things (models, modes, commands, usage), so not every control appears for every agent.

## How it works

Splash is built with [Elyra](https://github.com/kwhorne/elyra-framework): a Rust process with a Svelte 5 frontend in a webview.

```mermaid
flowchart LR
  UI["Webview (Svelte)"] -- "api.* commands" --> Hub["Rust: app.rs + hub services"]
  Hub -- "event channels" --> UI
  Hub -- "prompt, cancel, answer" --> Actor["Session actor<br/>(one per running agent)"]
  Actor -- "transcript changes" --> Hub
  Hub --> DB[("SQLite")]
  Actor <-- "ACP over stdio" --> Agent["Agent process"]
```

1. **UI and backend.** The UI calls Rust `#[command]` functions through a typed `api.*` facade and listens on Elyra event channels. `rata codegen` generates both into `app/src/bindings.ts`.
2. **Starting an agent.** Creating a session, continuing it, or sending a prompt starts its agent. Opening cached history only reads Splash's saved transcript. `acp/transport.rs` runs the launch command in the session folder, in its own process group, with your login shell's `PATH`. Its stdin and stdout carry ACP through the [`agent-client-protocol`](https://crates.io/crates/agent-client-protocol) crate. Splash offers no file-system or terminal capabilities to the agent: the agent edits files itself, and Splash sees the results through git and a file watcher.
3. **The session actor.** `acp/actor.rs` is one task per running agent. It runs `initialize` and `session/new` (or `session/resume` / `session/load`), then handles prompts, cancels, permission answers and option changes. It owns the session's transcript, which `acp/map.rs` builds from each `session/update` notification. Every 33 ms it hands the changes to the hub. Discovery and preview use separate short-lived connections in `acp/history.rs`.
4. **Keeping the UI in step.** Each change is either a full entry or a text append, with a version number per entry. The UI ignores stale versions and, when an append doesn't follow the last version it has, fetches the whole transcript again from a copy kept in Rust.
5. **The hub** wires these services:
   - `sessions.rs`: projects, sessions, worktrees, running actors and the in-memory transcript copies. `sessions/library.rs` handles discovery, preview, import, search, and recovery. Finished entries, plus a checkpoint of streaming ones about every 2 s, are queued to a single SQLite writer in `store.rs`; SQLite also maintains the transcript search index and persistent attention items.
   - `workspace.rs`: git status and diffs, file reads, the file watcher and terminals, on top of `src/workspace.rs`, `src/terminal.rs` and `src/git_info.rs`.
   - `agents.rs`: finding installed agents and the connection test.
   - `customize.rs`: app settings, and reading each agent's skills, commands and MCP config.
   - `src/github.rs`: GitHub CLI requests, repository discovery, pagination, project links and issue creation.
6. **Processes.** `procs.rs` kills every agent and shell process group when the app quits, including on SIGTERM, SIGINT and SIGHUP, but not after a crash or SIGKILL. Quitting mid-turn can lose the last couple of seconds of streamed output.

On the frontend, `app/src/lib` holds the state modules. `live.ts` subscribes them to the event channels at startup; the Log tab subscribes to its own channel while it is open.

### Layout

```
src/
  app.rs            commands, events and setup, shared by the app and splash-web
  hub/              sessions, agents, workspace and customize services
  acp/              transport, actor, transcript model and mapper
  agents/           registry, PATH lookup, detection, connection test, skills/MCP readers
  store.rs          SQLite migrations, queries and the writer task
  git.rs            git helpers        worktree.rs   worktree create/remove
  workspace.rs      file access, watcher   terminal.rs   PTY shells
  git_info.rs       remote, branch, PR     procs.rs      process groups
  bin/
    splash-web.rs   the app over HTTP, for headless UI testing
    spike.rs        drive one agent from the terminal; record fixtures
    fake-acp.rs     replays a fixture as if it were an agent
app/src/
  bindings.ts       generated by rata codegen
  lib/              state modules, keybindings, commands, markdown, highlighting
  components/       UI; ui/ holds shared primitives, playground/ a component gallery
fixtures/           ACP traffic recorded from Claude Code, Codex, Glue, Pi, Pool and Amp
tests/              mapper, actor, hub and store tests
e2e/                browser tests of the app's flows (Playwright), fake agents and gh
```

### Platform boundaries

The browser chooses keyboard conventions; the backend supplies filesystem and
shell information. A Windows browser connected to a Linux server uses Windows
shortcut labels and Linux paths. Browser mode avoids reserved navigation keys;
explicit saved shortcut overrides retain their meaning.

Agents use native PATH/PATHEXT resolution, including Windows npm `.cmd` launchers.
On Unix the search path comes from a login shell; `SPLASH_PATH` replaces it
verbatim (the end-to-end tests use it so only their fake agents are found).
Arguments are passed separately through Rust's process API. Terminals choose
`pwsh`, Windows PowerShell, then `COMSPEC` on Windows, and a login shell on Unix;
`SPLASH_SHELL` overrides the executable. Windows processes and ConPTY shells
start suspended until assigned to kill-on-close Job Objects. Unix uses process
groups and signal cleanup on a dedicated thread. Server tokens/locks use Unix
0600 permissions or a protected Windows owner-only DACL; reparse points/symlinks
are rejected. Existing data-directory locations are preserved.

WSL is a separate Linux host: run `splash-server` inside WSL and connect through
the browser. Splash does not silently mix WSL and Windows paths/executables.
Agent Settings reports whether a handshake has actually succeeded on this host.
A successful handshake does not promise every optional provider session feature.

Three small upstream patches are retained under `vendor/`: Elyra's optional
headless/desktop boundary and GTK embedding, portable-pty's suspended Windows
creation option, and a tiny_http worker-pool fix that stopped bursts of browser
connections from stalling requests. Their `SPLASH-PATCH.md` files describe the changes and update
procedure. They preserve the same command router and security checks in both
build modes.

## Development

```bash
just dev        # hot reload for frontend changes (Rust changes need a restart)
just check      # formatting, clippy, svelte-check, style scripts, all Rust tests
just test       # Rust tests only
just e2e        # browser tests of every flow, desktop UI and web version
just codegen    # regenerate app/src/bindings.ts after changing a command or event
just site       # the marketing site in website/, built from the app's own components
```

`just check` includes three scripts in `scripts/`: no colour literals outside the CSS tokens, no `:hover` rule without a focus state, and no em dashes in the UI source.

**Tests.**
- `tests/map_fixtures.rs` replays the recorded traffic through the mapper.
- `tests/actor.rs` runs the actor against `fake-acp`: streaming, permissions, cancel, options, load/resume selection, failed reconnects and a missing binary.
- `tests/hub.rs` runs the sessions service: worktrees, titles, archive, delete, concurrent opens, history discovery/import, directory ownership, and persistent attention.
- `tests/store.rs` covers persistence, transcript search, indexing updates, and import identity; there are also unit tests in `src/`.
- `node --experimental-strip-types --test app/tests/*.test.ts` runs the frontend model tests; `just check` also type-checks the Svelte UI.
- `just e2e` drives the real UI in headless Chromium, against both the desktop UI (`splash-web`) and the web version (`splash-server`). Each test gets its own data folder, home, git repository and fake agents; no real agent, account or GitHub login is used. See [e2e/README.md](e2e/README.md).

To record a fixture: `just spike claude ./some/repo "a prompt" --record name`.

**Website.** `website/` is a static SvelteKit site that renders the app's real components on demo data in the browser. It is not part of the app bundle; see [website/README.md](website/README.md).

**Headless UI.** `just web` serves the real backend and UI on port 4780 with its own data folder, so a headless browser can drive the app. Native dialogs and notifications are stubbed. `#/playground` shows the UI components and design tokens with sample data.

For substantial UI changes, capture most major affected screens in an isolated
demo workspace, inspect the images, show them during the work, and update the
gallery above. See [AGENTS.md](AGENTS.md) for the screenshot policy.

CI runs `just check` on pushes to main, pull requests and before every release build. A new app version on `main` is tagged after green CI; pushing a matching `v*` tag also triggers a release. The release workflow builds, signs and notarizes the macOS app, collects every platform package with checksums, generates release notes, and publishes automatically. Tags must match the Cargo, lockfile and bundle versions. Published assets are never overwritten by retries. See [Releasing](docs/releasing.md) for signing configuration and local verification.

## License

[MIT](LICENSE). Created by [Helge Sverre](https://github.com/HelgeSverre).

Splash is an independent project and is not affiliated with the agent providers.
Report bugs and compatibility problems through [GitHub Issues](https://github.com/HelgeSverre/splash/issues).
