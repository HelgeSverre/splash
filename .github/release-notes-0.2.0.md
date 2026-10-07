# Splash 0.2.0

Splash now runs on macOS, Windows and Linux, comes with a headless server you
can use from a browser over SSH, and adds the views that keep several agents
manageable: one queue for everything waiting on you, a review panel, a
searchable session library and GitHub triage.

## New

- **Needs attention:** one persistent queue for pending permissions, failed
  connections and finished turns, across restarts.
- **Review:** the latest response, failed tools, changed files and the branch's
  pull request, with feedback straight back to the agent.
- **Session library:** search saved and archived transcripts across agents and
  open a result at the matching message.
- **Agent history:** discover sessions from installed agents over ACP, preview
  them without sending a prompt, then add, refresh, fork or delete them.
- **GitHub:** triage issues, pull requests, branches and Actions runs across
  repositories, and start a session or a PR-head worktree from any item.
- **splash-server:** run Splash on another machine and use it in a browser
  through an SSH tunnel, with token login and reconnect recovery.
- **Additional workspace folders** are kept on new, load, resume and fork
  requests.
- **A new app icon**, drawn for every platform's sizes.

## Downloads

| Platform | Files |
| --- | --- |
| macOS 14+ | `Splash-0.2.0-macos-arm64.zip` (Apple silicon), `Splash-0.2.0-macos-x86_64.zip` (Intel). Signed with a Developer ID, notarized by Apple, with a stapled ticket. |
| Windows 11 x64 | `Splash-0.2.0-windows-x86_64-setup.exe` (per-user installer), `Splash-0.2.0-windows-x86_64.zip` (portable). Requires the WebView2 Runtime. |
| Ubuntu 24.04 x64 | `Splash-0.2.0-linux-x86_64.deb`, `.AppImage` and `.tar.gz`. Install the `.deb` with apt to pull in GTK and WebKit. |
| Headless server | `splash-server-0.2.0-<os>-<arch>` for macOS (Apple silicon and Intel), Linux and Windows. |

Every archive and installer has an adjacent SHA-256 checksum.

## Requirements

Install and sign in to your agent CLI separately; Splash finds it on your PATH.
Adapters launched through `npx` also need Node.js and npm. Git is required for
worktrees and the GitHub CLI for the GitHub view. Model selection, usage
reporting and conversation resume appear when the agent supports them.

See the [README](https://github.com/HelgeSverre/splash#readme) for setup and
[open an issue](https://github.com/HelgeSverre/splash/issues/new/choose) for bugs
or compatibility problems.
