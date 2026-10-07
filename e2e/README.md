# End-to-end tests

Playwright drives the real Splash UI in headless Chromium against two backends
built from this repository:

| Project | Backend | What it covers |
| --- | --- | --- |
| `desktop` | `splash-web` (the desktop build served over HTTP) | the desktop app's UI, commands and events |
| `web` | `splash-server` (the headless web version) | the same flows, plus sign-in, lost connections and server restarts |

Tests in `tests/shared` run in both projects; `tests/desktop` and `tests/web`
hold the flows only one of them has. The native window, webview engines, OS
dialogs and notifications are out of reach of a browser; `scripts/test-desktop.py`
keeps checking those on every OS.

## Running

```bash
just e2e                                   # build what the tests need, run them all
just e2e --project=web                     # one backend
just e2e tests/shared/smoke.spec.ts        # one file
just e2e -g "permission" --headed          # by title, with a visible browser
just e2e-ui                                # Playwright's UI mode
```

`just e2e` builds the frontend (debug binaries serve `app/dist` from disk),
`splash-web`, `fake-acp` and the headless `splash-server`. To test a release
build instead, set `SPLASH_E2E_BIN_DIR=target/release`.

CI runs the suite on Ubuntu for every push and pull request, and releases wait
for it. To check for flakes, run the CI workflow by hand with `e2e_repeat` set
(`gh workflow run CI -f e2e_repeat=10`).

Failures keep a trace, a screenshot, the backend log, the agents' launch log and
every ACP request they received (`npx playwright show-report`). Set
`SPLASH_E2E_KEEP=1` to keep each test's temporary folder; its path is printed.

## Isolation

Each test gets its own World (`support/world.ts`), deleted afterwards:

- `data/`: `SPLASH_DATA_DIR`, so the database, worktrees and server token are
  new. Your own Splash data is never read.
- `home/`: `HOME`, so skills, commands, MCP servers and agent credentials come
  only from what the test writes there.
- `bin/`: the only agent CLIs on `SPLASH_PATH`. Splash uses that search path
  verbatim, so agents installed on your machine are never detected or started.
- `repo/`: a small git repository, added as a project at startup.
- `control/`: how the fake agents behave, and what they were asked.

The browser runs with `en-US` and UTC; backends with `TZ=UTC`.

## Fake agents

`fakes/agent` is linked into `bin/` as `claude`, `codex`, `glue`, `pool`, `pi`
and `npx`. It answers version and login checks like the real CLIs and replaces
every ACP launch with `fake-acp` replaying a recording from `fixtures/`. Tests
steer it through `splash.world.agents` (`support/agents.ts`):

```ts
world.agents.fixture("claude", "pool/read.jsonl"); // replay another recording
world.agents.flags("claude", "--fail-load");       // fake-acp flags
world.agents.speed("claude", 1);                   // recorded timing (default 0: instant)
world.agents.loggedOut("codex");                   // fail the login check
world.agents.launches("claude");                   // argv and cwd of each launch
world.agents.requests("claude", "session/resume"); // ACP requests the agent received
```

`fake-acp` also takes `--apply-diffs`, `--exit-mid-turn N` and `--fail-prompt`
for edits on disk and failures.
`--announce-commands` sends the recording's slash commands right after
`session/new`, as adapters do, so a Settings refresh (the handshake) lists them.

## Writing tests

```ts
import { expect, test } from "../../fixtures.ts";

test("…", async ({ splash }) => {
  const { app, page, world, db } = splash;
  const id = await app.newSession({ agent: "claude", where: "in_place" });
  await app.prompt("What does subtract do?");
  await expect(app.entries("agent").last()).toContainText("a - b");
  await expect.poll(() => db.kinds(id)).toEqual(["user", "tool", "agent", "turn_end"]);
});
```

- Wait on what the user sees (roles, labels, text), `expect.poll` for the
  database and files. Never sleep, never wait for `networkidle` (the event
  stream is a long poll).
- `support/app.ts` has the common steps; `support/elyra.ts` locates the
  runtime's confirm, prompt, toast, palette and context menu.
- Transcript entries carry `data-kind`, the session header's status `data-status`.
- Options: `test.use({ agents: [...], gh: true, folders: "none", signIn: false })`.
- To prepare files before the backend starts, use a `beforeEach` that asks
  only for `world`: `test.beforeEach(({ world }) => world.signInPool())`.
- `splash.restart()` restarts the backend on the same port and data.
- No screenshot baselines: assertions are semantic and platform independent.
