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

## Comparison pages

`/vs/<slug>` compares Splash with one other tool. The pages are factual, not
sales copy: every statement about either product cites a public source, and
the footer's Comparisons column is their only link (not the nav).

| File | Role |
| --- | --- |
| `src/lib/compare/types.ts` | The `Comparison` shape: intro, product cards, grouped rows, differences, fit, sources. |
| `src/lib/compare/splash.ts` | Splash's side of every page: `SPLASH`, the `S` answer cells and their sources in this repository. The agent count and version are read from the source. |
| `src/lib/compare/<slug>.ts` | One comparison's data and sources. |
| `src/lib/compare/index.ts` | `COMPARISONS`, in footer order. The route, footer, sitemap and share cards read it. |
| `src/lib/compare/sources.ts` | Numbers sources in the order a page cites them, and fails the prerender on a statement without a source, an unknown source id, or a source nothing cites. |

`src/routes/vs/[slug]/+page.svelte` is the shared layout, built from
`CompareHeader`, `CompareGlance`, `CompareTable` (with `CompareCell` and
`Cite`), `Details`, `CompareFit` and `CompareSources`. Sections without data
are left out. A page that needs a different structure can add
`src/routes/vs/<slug>/+page.svelte` and compose the same components.

Rules for the data:

- Facts about another product come from its own site, docs, changelog or
  repository, read when the page is written; `checked` records the date.
- Paraphrase; quote nothing longer than a few words.
- Marks (`yes`, `partial`, `no`, `unknown`) go on capability rows only. `no`
  means the product's own sources say it's absent or out of scope.
- Include rows where the other product does something Splash doesn't.
- Splash's answers come from `S`. Change `splash.ts` when Splash changes, and
  every page follows.

To recheck a page, open each source, update anything that changed, and move
`checked` (and each source's `checked`) to that day.

## Search and share cards

The site lives at `https://splash.computer` (`SITE_URL` in `src/lib/site.ts`).
Every page renders `Seo.svelte`: title, description, canonical URL, and Open
Graph and Twitter tags pointing at its share card. Feature pages take their H1
and description from `FEATURES` in `site.ts`. `JsonLd.svelte` writes structured
data: `WebSite` and `SoftwareApplication` on the home page, and a
`BreadcrumbList` on feature and comparison pages and `/vs`.
`src/routes/sitemap.xml` lists every page; `static/robots.txt` points to it.
`static/favicon.ico` (16, 32 and 48 px, from `app/public/icon.png`) is for
clients that ask for it by name; pages declare the SVG and PNG icons.

Each page has a 1200 × 630 share card in `static/og/<slug>.png`, defined in
`src/lib/og.ts`: the page's headline over its real app window (a live scene, or
a capture from `SHOTS`), in the site's own tokens. `/og-card/<slug>` renders a
card on the dev server only; the static build has no page for it.

```bash
just site-og       # recapture every card (uses Google Chrome, or CHROME_PATH)
```

Recapture after changing a headline, `og.ts`, or a scene the cards show, and
commit the PNGs.
