// Playwright fixtures: every test gets its own World (temp home, data dir, fake
// agents, git repo) and its own backend, and a page signed in to it.
//
//   test("…", async ({ splash }) => { await splash.app.newSession(); … });
//
// Options (test.use): `agents`, `gh`, `folders` ("repo" adds the temp repo as a
// project at startup, "none" starts empty), `signIn` (web: log in first).
// To prepare the World before the backend starts:
//
//   test.beforeEach(({ world }) => world.signInPool());
import { test as base, expect, type Page } from "@playwright/test";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { AgentId } from "./support/agents.ts";
import { App } from "./support/app.ts";
import { Backend, type Harness } from "./support/backend.ts";
import { Db } from "./support/db.ts";
import { World } from "./support/world.ts";

declare global {
  var __SPLASH_SERVER__: { instance: string } | undefined;
}

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
  /** Add a project folder the way a user does: the native dialog on the
   * desktop (answered by the harness), the server folder picker on the web.
   * Splash then opens the New session dialog for it. */
  addProject(path: string): Promise<void>;
};

type Options = {
  harness: Harness;
  agents: AgentId[];
  gh: boolean;
  folders: "repo" | "none";
  signIn: boolean;
};

export const test = base.extend<Options & { world: World; splash: Splash }>({
  harness: ["desktop", { option: true }],
  agents: [["claude", "codex", "glue"], { option: true }],
  gh: [false, { option: true }],
  folders: ["repo", { option: true }],
  signIn: [true, { option: true }],

  // Set up before the backend starts: a beforeEach that asks only for `world`
  // can seed the home folder, fake agents or gh first.
  world: async ({ agents, gh }, use) => {
    const world = new World({ agents, gh });
    await use(world);
    world.dispose();
  },

  splash: async ({ harness, agents, folders, signIn, page, world }, use, testInfo) => {
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
      async addProject(path: string) {
        const add = app.sidebar.getByRole("button", { name: "Add a project folder" }).first();
        if (harness === "desktop") {
          writeFileSync(join(world.control, "dialog.json"), JSON.stringify([path]));
          await add.click();
          return;
        }
        await add.click();
        const picker = page.getByRole("dialog", { name: "Add a folder on the server" });
        const input = picker.getByLabel("Server folder path");
        await expect(input).toHaveValue(world.home);
        await input.fill(path);
        await picker.getByRole("button", { name: "Go" }).click();
        // The listing must be the typed folder before it can be added.
        await expect(picker.locator(".folders")).toHaveAttribute("aria-busy", "false");
        await expect(input).toHaveValue(path);
        await picker.getByRole("button", { name: "Add this folder" }).click();
        await expect(picker).toBeHidden();
      },
      async restart({ reload = harness === "desktop" } = {}) {
        await backend.restart();
        // The desktop page's IPC token dies with its backend; the web version
        // reconnects by itself, within its 5 s connection check.
        if (reload) {
          await page.reload();
          await app.waitReady();
        } else if (harness === "web") {
          const { instance } = await (await page.request.get(backend.url + "/__server/state")).json();
          await page.waitForFunction((i) => globalThis.__SPLASH_SERVER__?.instance === i, instance, { timeout: 15_000 });
          await expect(page.getByRole("status").filter({ hasText: "Connected · files and agents run on this server" })).toBeVisible();
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
    }
  },
});

export { expect };
