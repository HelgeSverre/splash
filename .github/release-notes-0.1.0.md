# Splash 0.1.0

The first public preview of Splash: a macOS workspace for coding agents using
the Agent Client Protocol.

## Included

- Run agent sessions in a project folder or an isolated git worktree.
- Follow streamed responses, tool calls, diffs, plans and permission requests.
- Browse changed files and use an integrated terminal in each session.
- Resume supported agent conversations after restarting Splash.
- Configure agent launch arguments and keyboard shortcuts.
- Protect uncommitted work with an explicit discard confirmation when archiving
  or deleting a worktree session.

## Install

Download `Splash-0.1.0-macos-arm64.zip`, extract it, and move **Splash.app** into
**Applications**. The app is signed with a Developer ID, notarized by Apple, and
includes a stapled notarization ticket. A SHA-256 checksum accompanies the ZIP.

The binary is for Apple silicon Macs. Install and authenticate your agent CLI
separately. Adapters launched through `npx` also need Node.js and npm; git is
required for worktrees.

## Early-preview limits

Agent capabilities vary: model selection, usage reporting and conversation
resume appear only when supported by the agent. The registry includes 19
agents; this does not mean every agent/version combination has been tested.
Intel, Windows and Linux binaries are not included in this release.

See the [README](https://github.com/HelgeSverre/splash#readme) for setup and
[open an issue](https://github.com/HelgeSverre/splash/issues/new/choose) for bugs
or compatibility problems.
