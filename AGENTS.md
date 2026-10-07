# Working on Splash

Splash is a Rust/Elyra desktop app with a Svelte 5 frontend. Match the existing
components, CSS tokens, and typed command/event bindings. Regenerate bindings
with `just codegen` after changing exposed Rust types or commands.

## Validation

Run `just check` and `just frontend` for significant changes. Use an isolated
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
