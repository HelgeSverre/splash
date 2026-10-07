# Working on Splash

Splash is a Rust/Elyra desktop app with a Svelte 5 frontend. Match the existing
components, CSS tokens, and typed command/event bindings. Regenerate bindings
with `just codegen` after changing exposed Rust types or commands.

## Validation

Run `just check` and `just frontend` for significant changes. Run `just e2e`
for UI or backend flow changes; it drives the desktop UI and the web version
with fixture agents only. New or changed UI flows need a test in `e2e/tests`. Use an isolated
`SPLASH_DATA_DIR` for app testing and screenshots; do not use personal agent
conversations or modify the user's normal Splash database as test data.

For server changes, also run `node --experimental-strip-types --test app/tests/*.test.ts`
and `python3 scripts/test-server-http.py target/debug/splash-server` after building
the binary. Verify reconnects against an isolated server; do not interrupt the
user's normal server or agents.

## UI screenshots and README

For every substantial UI change:

- Run the real app or the `splash-web` harness (or `splash-server` for server UI) and capture screenshots of the
  finished UI. Do not substitute mockups, design concepts, or fabricated UI.
- Cover most major screens and workflows affected by the change, including
  meaningful populated states. Capture relevant empty, loading, or error states
  when those are central to the feature.
- Use an isolated demo project and synthetic conversations. Public GitHub data
  is acceptable; exclude private repositories, conversations, credentials, and
  other personal information.
- Save the images in `screenshots/` with descriptive filenames. Inspect them
  for clipped text, broken layout, stale content, and unreadable controls.
- Add or update linked thumbnails in the README's Screenshots section, with
  useful alt text and labels. Keep the gallery representative of the major UI;
  replace stale captures for screens changed by the task.
- Show the user screenshots during the work and link the final captures when
  reporting completion. State any screenshot or runtime limitation explicitly.

Screenshots are documentation assets, not frontend assets. Keep them out of the
embedded webview and release bundle. Describe demo fixtures honestly in the
README and keep any historical design explorations clearly separated.

For long-lived demo previews, copy required server and fixture-agent executables
into the isolated demo directory. Do not leave launchers pointing into `target/`,
which build cleanup may remove. Before handing off a preview, exercise its main
actions (including **Find sessions**) with the same environment it will retain.

## Cross-platform changes

Keep browser/client conventions separate from backend-host filesystem semantics.
Exercise native CI on macOS arm64/x64, Windows MSVC, and Ubuntu x64. Check both
default desktop and `--no-default-features` headless builds. Do not claim provider
support from CLI detection alone. Document any unverified platform/runtime.

For packaging changes, test finished installers/archives, including a native
webview readiness round trip. AppImage checks must inspect final internal 0755
launcher/binary permissions and run as a different ordinary user with a fresh
TMPDIR; owner-only `test -x` is insufficient. Never disable WebKit's sandbox to
make smoke tests pass. Keep external packaging tools pinned and checksum verified.
The screenshot policy above also applies to platform-dependent UI; label captures
by actual client/host and never present browser emulation as native OS evidence.
