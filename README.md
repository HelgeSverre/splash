# Splash

Splash is a small desktop app for running coding agents side by side. It supports Claude Code, Codex, Glue, Pi and Pool, and talks to all of them over one protocol, the [Agent Client Protocol](https://agentclientprotocol.com) (ACP). It is built on [Elyra](https://github.com/kwhorne/elyra-framework) (Rust + Svelte 5) and uses Glue's visual style.

## Features

- **Projects and sessions.** A session is one agent working in a project. It runs either in place (in your checkout) or in its own git worktree on a `splash/…` branch.
- **Live streaming transcript:**
  - Agent messages render as markdown.
  - Thinking is collapsible.
  - Tool calls show their status, file locations and inline diffs.
  - Plans appear as checklists.
  - Permission requests appear as cards you answer with the 1–9 keys.
- **Per-agent controls.** Each agent's own model, mode and effort pickers are shown, plus slash-command autocomplete, context usage and cost.
- **Workbench:**
  - The right panel (⌥⌘B) shows **Changes** (git status against the session's base) and **Files** (a tree that respects `.gitignore`).
  - Diff and file tabs open in the centre.
  - The bottom **terminal** (⌘J) is a real shell in the session's folder.
- **Agents screen.** For each agent it shows whether it's installed, its version, login state and launch command. **Probe** runs the ACP handshake without spending any tokens and shows the agent's capabilities, models, modes and slash commands.
- **Log tab.** Each session has a log of the raw JSON-RPC traffic.
- **Persistence.** Sessions are stored in SQLite (`~/Library/Application Support/Splash`). Agents that support `session/load` pick up where they left off after a restart. Other agents start a fresh session, and the transcript shows a divider where the new session begins.

## Agents

| Agent | How it runs over ACP |
|---|---|
| Glue | `glue acp` (native) |
| Pool | `pool acp` (native) |
| Claude Code | `npx -y @agentclientprotocol/claude-agent-acp@0.81.1` |
| Codex | `npx -y @agentclientprotocol/codex-acp@1.13.1` |
| Pi | `npx -y pi-acp@0.0.33` (community adapter, experimental) |

Adapter versions are pinned in `src/agents/registry.rs`. On the Agents screen, **Extra args** adds options before the ACP arguments of an agent's launch command.

## Run

```bash
(cd app && npm install && npm run build)
cargo run                          # ⌘N to add a folder and start a session
cargo run -- ~/code/some-repo      # or add projects up front
```

After you change a command or event type, regenerate `app/src/bindings.ts` with `rata codegen` (Elyra's CLI).

## Test

```bash
cargo test
```

The suite covers:

- **`tests/map_fixtures.rs`:** replays recorded traffic from all five agents (`fixtures/`) through the ACP-to-transcript mapper.
- **`tests/actor.rs`:** drives the session actor against `fake-acp`, a binary that plays a fixture back as if it were the agent. It checks streaming, permissions, cancel, config options and resume.
- **Workspace, worktree, store and terminal:** unit tests on temporary git repos.

To record a new fixture from a real agent:

```bash
cargo run --bin spike -- claude ./some/repo "a prompt" --record name
cargo run --bin spike -- --detect      # detection and probes for all agents
```

### Driving the UI without a window

`splash-web` serves the real backend and UI over HTTP through Elyra's protocol handler. That lets a headless browser drive Splash without touching the desktop. Native dialogs and notifications are stubbed out.

```bash
SPLASH_DATA_DIR=/tmp/splash-dev cargo run --bin splash-web -- --port 4780 ./some/repo
agent-browser --session splash open http://127.0.0.1:4780/
```

## Layout

```
src/
  acp/transport.rs   spawns an agent; its stdio becomes the ACP SDK's Lines transport, with every line tapped for the Log tab
  acp/actor.rs       one tokio task per live session (prompt, cancel, permissions, options, resume)
  acp/map.rs         raw session/update JSON → transcript entries plus versioned changes for the UI
  agents/            registry, login-shell PATH, detection, probe
  hub.rs             app state: projects, sessions, live actors, transcript mirrors; the actors' output target
  store.rs           SQLite via Elyra's Database (migrations run at boot, one serial writer)
  workspace.rs       git status/diff, file tree, file reads (sandboxed to the session folder), watcher
  worktree.rs        git worktree create/remove
  terminal.rs        PTY shell per session with scrollback
  procs.rs           agent and shell process groups, killed on exit and on SIGTERM/SIGINT/SIGHUP
  app.rs             commands, events and providers (shared by both binaries)
app/src/
  lib/state.svelte.ts   the store: applies the transcript, session and workspace event channels
  components/           Sidebar, SessionView, Transcript, Composer, RightPanel, DiffTab, FileTab, TerminalPane, AgentsScreen…
```
