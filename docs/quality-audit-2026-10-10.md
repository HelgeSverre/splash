# Splash quality audit October 2026

Splash was tested from empty data directories, fresh browser profiles, clean Linux
containers, and a fresh Windows desktop account. The fixes address first-session
setup, disconnected servers, interrupted conversations, workspace errors, and
layout recovery. Tests use synthetic conversations and fixture agents; they do
not establish compatibility with authenticated production providers.

## Fixes and regression coverage

| Area | User-visible problem | Result and coverage |
| --- | --- | --- |
| First run | An installed provider CLI could count as ready while its actual ACP launcher was missing. | Readiness checks the configured launcher. Empty setup explains the missing project or agent and links to configuration. Shared onboarding tests cover missing launchers and setup recovery. |
| Offline setup | Project, new-session, and agent settings controls could attempt mutations against an unavailable server. | Affected controls expose their disabled state and action handlers guard mutations. Web onboarding and connection tests exercise disconnect and retry. |
| ACP probes | Concurrent checks shared one scratch folder. | Each probe owns a unique temporary directory and removes it after completion. Concurrent fixture checks verify distinct, cleaned-up paths. |
| Preferences | Failed or overlapping saves could leave controls showing values that were not persisted; reconnect snapshots could replace newer choices. | Writes serialize per key, failures restore the last confirmed value only for the current intent, and snapshot markers protect pending or newer edits. Delayed-response tests cover both snapshot orderings and A→B→A saves. |
| Transcript loading | A delayed full transcript response could erase events received while it was in flight. | Events queue during the load and replay using entry versions. A second client streams a response while the first client's real snapshot is deliberately held. |
| Transcript recovery | A failed gap-recovery request could leave the transcript permanently stale. | Recovery rejects outdated responses, retries with bounded backoff, and cancels on success or disposal. Independent state review checked the retry and version guards. |
| Interrupted agents | Startup did not share a total timeout across initialize and new/load/resume requests. Stale streaming entries or tools could appear unfinished after restart. | One 180-second startup deadline covers the whole sequence. Actor restoration and cold transcript reads settle interrupted messages, tools, and permissions. Paused-clock actor and fresh-Hub tests cover both paths. Cold reads leave stored checkpoints untouched. |
| Tool failures | A pending tool could appear completed when the agent failed. | Pending and in-progress tools become failed. Mapper and lifecycle tests cover interrupted states. |
| HTTP capacity | Idle event polls could occupy the command pool and block ordinary operations. | Event polls have a separate bounded pool. An HTTP test fills that pool, proves overflow, and then completes an authenticated command. |
| Stalled uploads | An incomplete request body could hold a request permit indefinitely; rejecting it could block cleanup, and declared lengths could cause an oversized drain allocation. | Streaming bodies have a ten-second read inactivity timeout. Timeout and admission rejection close the read side before cleanup; oversized bodies retain the size error without draining forever. Cleanup uses an 8 KiB buffer. The transport regression saturates capacity with declared, chunked and `100-continue` bodies, keeps their sockets open through recovery, checks an oversized body with an extreme declared length, and reuses a complete-upload connection for an event response lasting beyond the timeout. |
| Sign out | An HTTP error from logout could be mistaken for an unreachable server. | Transport failures show offline guidance; HTTP failures retain online state and report the response. Unauthorized logout returns to login. Web server tests cover each outcome. |
| Agent history | Another import action could overlap a pending import; action buttons crowded the history bar. | Import controls stay disabled while saving. History actions open from a vertical ellipsis menu with keyboard navigation and disabled-state guidance. Shared history tests cover imports and menu interactions. |
| Missing folders | A deleted or moved workspace looked like an empty directory. | Files displays a readable error, including failed nested folders. Rust directory tests and shared workbench tests distinguish absent folders from empty ones. |
| Workspace updates | Absolute diff paths missed relative watcher updates; delayed directory/status responses could replace newer state. | Path matching handles both forms. Request versions and workspace lifetimes reject stale replies, including responses from a discarded workspace. Shared tests exercise absolute-path diff refresh. |
| Worktree errors | A failed Git HEAD query, including a missing workspace folder, became the misleading message “the repository has no commits yet.” | Worktree creation preserves Git errors and uses the no-commits message only for an unborn HEAD. Unit regressions distinguish an empty repository from a missing working directory. Both browser harnesses verify the error and successful retry after the folder returns. |
| Terminal replacement | The first command after shell exit could be lost, and removed sessions retained terminal instances. | Input buffers while the shell attaches, dead PTYs are replaced, and event sequences remain monotonic across replacements. Retiring a shell reaps its child; session disposal releases its client instance. Shared browser tests send a command immediately after exit. Generation-bound reaping prevents a delayed old callback from removing a replacement, even after that replacement exits. |
| Windows shell exit | An exited PowerShell process retained a ConPTY master, preventing reader EOF and leaving the terminal active indefinitely. | A Windows child watcher releases the ConPTY master after process exit. The reader drains final output before publishing one exit. Reconnecting during that drain reattaches to the same terminal. Native regressions cover final output, replacement generations, and the drain handoff. |
| Window layout | Invalid saved JSON could stop startup. Wide panels or a tall terminal could hide the composer in the minimum desktop window. | Saved values are validated. Rendered panel sizes yield to the available area while preserving preferences for a larger window. Tests verify a usable composer and at least 80 pixels of transcript at 900×560, then restored dimensions after expansion. |
| Side tabs | The selected tab could be clipped in a narrow side panel. | Selection scrolls into view after tab or width changes. A 220-pixel panel regression checks the selected tab and refresh control. |
| Input and navigation | IME Enter could send unfinished text or complete an open slash command; streaming while Chat was hidden could reset its scroll position; previous-session navigation from the library selected the wrong session. | Composition and legacy key-code guards run before slash-menu dispatch; tests keep the partial command unchanged for both IME markers and verify ordinary Enter still completes it. Active-view and resize scroll tracking, and corrected wraparound navigation have shared browser coverage. Terminal resizing preserves a pinned bottom position and leaves a scrolled-up reader in place. |
| Document previews | Repeated frontmatter values caused duplicate Svelte keys and prevented rendering. | Preview chips accept repeated values. The regression renders `[Read, Read, Bash]`, switches to source, and checks for page errors. |
| GitHub | Expired credentials kept triggering requests; issue creation could be offered without an eligible repository. | Authentication failure pauses the remaining batch until retry. Issue creation requires a repository that supports issues. Shared fixture-backed GitHub tests cover both states. |
| Linux installation tests | Preinstalled GTK and WebKit libraries hid missing DEB dependency declarations. | Package smoke starts without those libraries, installs the finished DEB through apt, then runs the extracted AppImage's AppRun, raw DEB, installed DEB, and server checks as an ordinary user. |

These findings came from independent discovery, runtime reproductions, and review.
Proposed fixes without a reproducible defect were discarded. The native Windows
tests exposed the ConPTY issue after the browser tests had already passed.

## Validation environments

The desktop browser harness runs Splash's real backend and frontend over HTTP;
the server harness adds authentication, polling, and reconnect behavior. Both use
isolated databases and fixture executables. Browser screenshots are captured on
macOS and are labeled separately from native operating-system evidence.

Linux package checks use Ubuntu 24.04, a fresh ordinary user, Xvfb, D-Bus, and a
fresh temporary directory. AppImage extraction checks inspect final internal
launcher and binary permissions as well as runtime readiness. The outer Docker container
allows the namespaces needed by WebKit; WebKit's own sandbox remains enabled.
Local x64 container emulation is supplemented by a native x64 EC2 Docker runner.

Windows package checks use a fresh non-admin account on Windows Server 2025 with
no Rust, Cargo, Node, or Git development tools. The portable application and
per-user installer use isolated data in a path containing spaces and Unicode.
Uninstall removes the application and its registration while retaining user data.
The base image includes WebView2 Runtime 151.0.4129.78, so this environment does not
test installation on a machine without that runtime.

## Validation results

| Check | Evidence |
| --- | --- |
| Local quality gate | `just check`: 97 Rust tests passed; formatting, Clippy, CSS tokens, focus and copy checks passed; Svelte reported zero errors and warnings. |
| Frontend and server client | `just frontend` passed; all 15 `app/tests/*.test.ts` tests passed; the freshly built headless server passed `scripts/test-server-http.py`. |
| macOS server archive | The macOS arm64 server archive from application snapshot `a18f842` passed checksum verification and the HTTP smoke with a fresh HOME/data directory and `/usr/bin:/bin` PATH. |
| Browser workflows | The final local suite passed 267 tests with nine intentional skips. All 30 project tests also passed separately, including moved-folder recovery in both harnesses. |
| Native matrix | [CI run 38006450744](https://github.com/HelgeSverre/splash/actions/runs/38006450744), at application snapshot `a18f842`, passed all ten jobs: macOS arm64/x64, Windows MSVC, Ubuntu x64, desktop and headless builds, native renderer readiness, browser flows and package smoke. Each cumulative stacked PR repeats this matrix; [the final timeout PR checks](https://github.com/HelgeSverre/splash/pull/7/checks) cover the completed stack. |
| Clean native x64 Docker | Rust terminal tests, default/headless checks, 18 terminal/workbench browser flows and native renderer/IPC readiness passed. A separate full run passed 263 browser tests with nine skips. |
| Linux packages | CI packages from application snapshot `a18f842` passed checksum verification, fresh apt dependency installation, extracted-AppImage/raw-DEB/installed-DEB native renderer readiness and isolated server HTTP checks. AppImage internal executable modes were checked before ordinary-user execution. |
| Normal AppImage launch | The CI AppImage from application snapshot `a18f842` also passed direct FUSE-mounted launch in a fresh Ubuntu 24.04 container, with `libfuse2t64`, `fuse3`, `/dev/fuse`, UID 1001 and a fresh TMPDIR. No extraction flag/environment override or WebKit sandbox override was used. |
| Windows packages | The CI installer and portable archive from application snapshot `a18f842` passed checksum verification and frontend readiness under a fresh non-admin account. Installation/uninstallation succeeded and user data survived uninstall. |
| Windows terminal | All four native terminal regressions passed independently on Windows PowerShell 5.1.26100.33451; the same regressions passed on the Windows CI runner. |
| HTTP transport | All eight server integration tests passed with default and headless features; all 11 vendored HTTP-library tests passed. Read timeouts apply while streaming bodies are consumed and are cleared before idle keep-alive/event traffic. |
| Audit cleanup guard | Mock AWS regressions refuse mismatched instance/account pins and extra or managed/unattached network interfaces before any destructive request; the helper is included in CI. |
| Documentation captures | Real first-run, populated, minimum-window, history menu/dialog and offline states were captured and inspected; native Linux and Windows captures use finished CI packages. |

The first local final-gate attempt had one transient Hub failure: a HEAD query
was reported as missing despite immediately preceding successful HEAD assertions.
Focused, parallel, serial and full-gate retests passed. The underlying transient
subprocess failure was not reproduced; the misleading error conversion was
fixed and independently covered, rather than treating the transient cause as known.

A final browser run passed 264 cases but failed while reading an incomplete
fixture-agent JSONL audit record. The IME behavior assertions had already passed.
The log helper now reads only newline-terminated records and still rejects
malformed complete records. Both helper unit tests and the desktop/web IME
regressions passed, followed by a full 265-test rerun. A later slash-menu IME regression reproduced the unwanted completion in both browser modes before the fix; the composition guard now precedes menu dispatch. Its red/green checks and the final 267-test suite passed.

One long Docker command did not finish its native wrapper phase within its outer
deadline. That run is not counted as a native success. A bounded fresh native
retake subsequently emitted the renderer-loaded and IPC-round-trip success line.

Authenticated production providers, a Windows machine without WebView2, Linux
Wayland, Linux ARM64, and finished macOS desktop installers/notarization were not
verified. Native macOS CI builds and renderer smoke are separate from testing a
finished signed desktop installer.

## Screenshots

The [README gallery](../README.md#screenshots) links the representative captures.
The populated views below use synthetic ACP responses in the real UI.

| Capture | Client and host |
| --- | --- |
| [First run](../screenshots/quality-desktop-first-run.jpg) and [agent setup](../screenshots/quality-desktop-agent-setup.jpg) | macOS Chromium, desktop browser harness, no configured providers |
| [Conversation](../screenshots/quality-desktop-conversation.jpg), [connected history actions](../screenshots/quality-desktop-history-actions-connected.jpg), [saved history actions](../screenshots/quality-desktop-history-actions-menu.jpg), and [library](../screenshots/quality-desktop-library.jpg) | macOS Chromium, desktop browser harness, fixture agent |
| [Minimum window](../screenshots/quality-desktop-small-window.jpg), [terminal](../screenshots/quality-desktop-small-window-terminal.jpg), and [missing workspace](../screenshots/quality-desktop-missing-workspace.jpg) | macOS Chromium, desktop browser harness |
| [Offline draft](../screenshots/quality-web-offline-draft.jpg) | macOS Chromium, authenticated local server with an injected connection failure |
| [Linux first run](../screenshots/quality-linux-first-run.png) | Native Linux webview, installed CI DEB, Ubuntu 24.04 Docker/Xvfb |
| [Windows first run](../screenshots/quality-windows-installed.png) | Native Windows WebView2, installed CI application, Windows Server 2025 EC2 |

## Product scope

The current layout target remains the 900×560 minimum desktop window. A browser
layout below that width would be a separate responsive-design change. Linux
release artifacts currently target x64; adding Linux ARM64 requires a packaging
and native-validation lane. These choices were presented together for review.

## Audit isolation

The audit branch is `feature/quality-audit`, based on `7b04cd8`, in a separate
managed worktree. Review is split into six draft stacked PRs, in this review and merge order:
[backend recovery #2](https://github.com/HelgeSverre/splash/pull/2),
[terminal and layout #3](https://github.com/HelgeSverre/splash/pull/3),
[client recovery #4](https://github.com/HelgeSverre/splash/pull/4),
[history and workbench #5](https://github.com/HelgeSverre/splash/pull/5), and
[validation and evidence #6](https://github.com/HelgeSverre/splash/pull/6), and
[HTTP request timeouts #7](https://github.com/HelgeSverre/splash/pull/7).
Merge commits preserve stack ancestry; retarget the next PR to `main` after
its predecessor merges. Squash or rebase merges require restacking descendants.
Nothing has been merged as part of the audit. The original checkout and its existing edits were left alone.
All runtime data came from isolated test directories. The audit created two
Linux runners and one Windows VM with dedicated networking and transfer buckets.
A Linux provisioning retry replaced the ledger entry without retaining the first
instance ID. Cleanup stopped at the resulting subnet dependency; the original
creation events were recovered from this audit's agent session and independently
verified before the omitted instance was touched.

All three audit instances were terminated, their three root disks were verified
deleted, and the dedicated buckets, networks and IAM resources were removed.
No unrelated EC2 instance was queried or changed. The reusable cleanup helper now
checks for other network interfaces before any mutation. Provisioning guidance
requires stable launch idempotency tokens and an append-only record of every
returned instance ID. Private resource ledgers and original creation evidence
remain outside the repository.
