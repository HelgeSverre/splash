# Splash website

The marketing site: a landing page, one page per feature, and a combined
download and changelog page. SvelteKit 3 with `adapter-static`; every page is
prerendered to plain HTML in `build/`. Dependencies are managed with bun
(`bun.lock`).

```bash
just site          # dev server (http://localhost:5287)
just site-build    # svelte-check, then a static build in website/build
```

The site is separate from the app: nothing here is embedded in the desktop
binary, the Cargo package excludes `website/`, and the app's lint scripts only
scan `app/`.

## Live scenes

The app windows on the site are not mockups. They render the desktop app's
own components from `app/src` (imported through the `$splash/*` alias), so the
site always matches the current UI.

Two Vite aliases make that work:

| Alias | Points at | Why |
| --- | --- | --- |
| `$splash/*` | `../app/src/*` | The app's components, state modules and `app.css` tokens. |
| `@elyra/runtime` | `src/lib/demo/runtime.ts` | Replaces the IPC bridge to Rust with an in-browser demo backend. |

`resolve.dedupe` forces the shared components' bare imports (`svelte`,
`marked`, `highlight.js`, …) to this package's `node_modules`, so there is one
Svelte runtime and the site builds without `app/node_modules`.

`src/lib/demo/`:

| File | Role |
| --- | --- |
| `runtime.ts` | The `@elyra/runtime` surface: `invoke`, `channel`, toasts, context menus, dialogs. |
| `backend.ts` | Answers `api.*` commands and emits `session`, `transcript`, `workspace` and `rpc` events, so the app's real state modules do the rendering. Scripted agents: the hero task, the pending migration permission, and an honest reply to anything typed in a composer. |
| `world.ts` | The demo world: project `atlas`, its sessions, the agents from `src/agents/registry.rs`, files and diffs. Synthetic data. |
| `github.ts`, `history.ts` | Fixtures for the GitHub, Actions and agent history views. |
| `boot.ts` | Subscribes the channels and runs the app's own `loadAll()`, once per page load. |
| `guard.ts` | Keeps scene focus and `scrollIntoView` calls from scrolling the page. |

Scenes in `src/lib/scenes/` compose real components (the workbench, Needs
attention, Review, transcript). `Live.svelte` mounts a scene on the client
only, after `boot()`; the prerendered HTML shows a placeholder or a real
screenshot instead. `AppWindow.svelte` draws the window, zooms the scene to fit
narrower columns, and contains the app's fixed-position dialogs.

When an app command or event changes, `bun run check` fails here too. Add a
handler to `backend.ts` for any new command a scene calls; unhandled commands
log `[demo] unhandled command` in dev and resolve to `null`.

## Content

- Copy follows the README and the code.
- Screenshots come straight from `../screenshots` through `src/lib/shots.ts`;
  nothing is copied.
- The "Under the hood" trace replays `../fixtures/claude/edit_allow.jsonl`, the
  recording the mapper tests use.

## Downloads and changelog

`src/lib/releases.ts` builds every download link from the `version` in
`Cargo.toml` (the release workflow requires the tag to match it) and the file
names `release.yml` and `scripts/package-platform.py` produce:
`github.com/HelgeSverre/splash/releases/download/v<version>/<file>`, each with
its `.sha256`. Bumping the version and tagging updates the site on its next
build.

The changelog renders every `../.github/release-notes-<version>.md`, the same
files the release workflow publishes, newest first. Add the release date to
`DATES` in `releases.ts`.
