// Playwright fixtures: every test gets its own World (temp home, data dir, fake
// agents, git repo) and its own backend, and a page signed in to it.
//
//   test("…", async ({ splash }) => { await splash.app.newSession(); … });
//
// Options (test.use): `agents`, `gh`, `folders` ("repo" adds the temp repo as a
// project at startup, "none" starts empty), `signIn` (web: log in first).
import { test as base, expect, type Page } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { AgentId } from "./support/agents.ts";
import { App } from "./support/app.ts";
import { Backend, type Harness } from "./support/backend.ts";
import { Db } from "./support/db.ts";
import { World } from "./support/world.ts";

export type Splash = {
  harness: Harness;
  world: World;
  backend: Backend;
  db: Db;
  page: Page;
  app: App;
  /** Load the app (signing in on the web) and wait for it. */
  open(): Promise<void>;
  /** Sign in to the web version with its token. */
  signIn(): Promise<void>;
  /** Restart the backend on the same port and data directory, then reload. */
  restart(options?: { reload?: boolean }): Promise<void>;
};

type Options = {
  harness: Harness;
  agents: AgentId[];
  gh: boolean;
  folders: "repo" | "none";
  signIn: boolean;
};

export const test = base.extend<Options & { splash: Splash }>({
  harness: ["desktop", { option: true }],
  agents: [["claude", "codex", "glue"], { option: true }],
  gh: [false, { option: true }],
  folders: ["repo", { option: true }],
  signIn: [true, { option: true }],

  splash: async ({ harness, agents, gh, folders, signIn, page }, use, testInfo) => {
    const world = new World({ agents, gh });
    const backend = new Backend(harness, world, folders === "repo" ? [world.repo] : []);
    const app = new App(page, harness);
    const splash: Splash = {
      harness,
      world,
      backend,
      db: new Db(world.data),
      page,
      app,
      async signIn() {
        const res = await page.request.post(backend.url + "/login", {
          data: backend.token(),
          headers: { origin: backend.url, "content-type": "text/plain" },
        });
        expect(res.status()).toBe(204);
      },
      async open() {
        if (harness === "web") await splash.signIn();
        await page.goto(backend.url + "/");
        await app.waitReady();
        // Startup folders are added in the background.
        if (folders === "repo") await expect(app.projectRow("repo")).toBeVisible();
      },
      async restart({ reload = harness === "desktop" } = {}) {
        await backend.restart();
        // The desktop page's IPC token dies with its backend; the web version
        // reconnects by itself.
        if (reload) {
          await page.reload();
          await app.waitReady();
        }
      },
    };
    try {
      await backend.start();
      if (harness === "desktop" || signIn) await splash.open();
      await use(splash);
    } finally {
      await backend.dispose();
      if (testInfo.status !== testInfo.expectedStatus) {
        const attach = (name: string, path: string) =>
          existsSync(path) && testInfo.attach(name, { body: readFileSync(path), contentType: "text/plain" });
        await attach("backend.log", backend.logFile);
        await attach("launches.jsonl", join(world.control, "launches.jsonl"));
        for (const agent of agents) await attach(`${agent}.audit.jsonl`, join(world.control, `${agent}.audit.jsonl`));
      }
      world.dispose();
    }
  },
});

export { expect };
