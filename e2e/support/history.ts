// Agent history: the Sessions page's "Open from agent" browser, and a
// session's history bar (Refresh from agent, Fork conversation, Manage history).
//
// The fake agents replay synthesized recordings (fixtures/e2e/history_*.jsonl):
// Claude lists two pages of saved sessions and can load, resume, fork and
// delete them; Codex lists one and can only load it. Saved sessions live in
// the folder the agent was launched in ($CWD).
import { expect, type Locator } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { AgentId } from "./agents.ts";
import type { App } from "./app.ts";
import { FIXTURES } from "./paths.ts";
import type { World } from "./world.ts";

/** Point Claude and Codex at the history recordings. */
export function historyAgents(world: World) {
  world.agents.fixture("claude", "e2e/history_claude.jsonl");
  world.agents.fixture("codex", "e2e/history_codex.jsonl");
}

/** A file where fake-acp keeps the session IDs deleted from its history (`--state`). */
export const deletedState = (world: World, agent: AgentId = "claude") => join(world.control, `${agent}.deleted.json`);

/** Make the agent's saved history differ from its recording, like a
 * conversation that went on elsewhere: replace text in a copy and replay that. */
export function rewriteHistory(world: World, agent: "claude" | "codex", edits: [string, string][]) {
  let text = readFileSync(join(FIXTURES, "e2e", `history_${agent}.jsonl`), "utf8");
  for (const [from, to] of edits) {
    if (!text.includes(from)) throw new Error(`history_${agent}.jsonl has no "${from}"`);
    text = text.replaceAll(from, to);
  }
  const file = join(world.control, `history_${agent}.jsonl`);
  writeFileSync(file, text);
  world.agents.fixture(agent, file);
}

export class History {
  readonly app: App;
  constructor(app: App) {
    this.app = app;
  }
  get page() {
    return this.app.page;
  }

  // ── Sessions → Open from agent ──────────────────────────────────────────

  get panel() {
    return this.page.locator("#library-panel-external");
  }
  private get filters() {
    return this.panel.locator("form").first();
  }
  /** One agent's discovery state: name, status, Retry/Load more, error. */
  source(agent: string): Locator {
    return this.panel.locator(".sources .source").filter({ has: this.page.locator("strong", { hasText: agent }) });
  }
  status(agent: string): Locator {
    return this.source(agent).getByRole("status");
  }
  get rows(): Locator {
    return this.panel.locator(".results").getByRole("button");
  }
  /** A listed session, by title. */
  row(title: string): Locator {
    return this.rows.filter({ has: this.page.locator("strong").getByText(title, { exact: true }) });
  }
  get preview(): Locator {
    return this.panel.locator("article.preview");
  }
  /** Expand "Open a known session ID"; returns its form. */
  async openKnown(): Promise<Locator> {
    await this.panel.getByText("Open a known session ID", { exact: true }).click();
    const form = this.panel.locator("details.known form");
    await expect(form).toBeVisible();
    return form;
  }

  async open() {
    await this.app.openNav("Sessions");
    await this.page.getByRole("tablist", { name: "Session sources" }).getByRole("tab", { name: "Open from agent" }).click();
    await expect(this.filters.getByRole("button", { name: "Find sessions" })).toBeVisible();
  }

  /** Choose the agent and folder (by project name), then Find sessions or Refresh lists. */
  async find({ agent, folder, refresh = false }: { agent?: string; folder?: string; refresh?: boolean } = {}) {
    await this.filters.getByLabel("Agent").selectOption({ label: agent ?? "All installed agents" });
    await this.filters.getByLabel("Folders").selectOption({ label: folder ?? "All folders" });
    await this.filters.getByRole("button", { name: refresh ? "Refresh lists" : "Find sessions" }).click();
  }

  /** Preview a listed session. */
  async show(title: string) {
    await this.row(title).click();
    await expect(this.row(title)).toHaveAttribute("aria-pressed", "true");
    await expect(this.preview.getByRole("heading", { level: 2 })).toBeVisible();
  }

  /** Find Claude's saved sessions in the repo, preview one and add it; returns the new session's id. */
  async importSession(title: string): Promise<string> {
    await this.open();
    await this.find({ agent: "Claude Code", folder: "repo" });
    await expect(this.status("Claude Code")).toHaveText(/\d+ loaded/);
    await this.show(title);
    await this.preview.getByRole("button", { name: "Add to Splash" }).click();
    await expect(this.app.title).toBeVisible();
    await this.app.expectStatus("exited");
    return this.app.sessionId();
  }

  // ── A session's history bar ─────────────────────────────────────────────

  get bar(): Locator {
    return this.page.locator(".history-bar");
  }
  button(name: string): Locator {
    return this.bar.getByRole("button", { name, exact: true });
  }
  get notice(): Locator {
    return this.bar.getByRole("status");
  }

  async disconnect() {
    await this.button("Disconnect agent").click();
    await expect(this.notice).toHaveText("Agent disconnected. Your local history is saved.");
    await this.app.expectStatus("exited");
  }

  /** Open Manage history; returns the dialog. */
  async manage(): Promise<Locator> {
    await this.button("Manage history").click();
    const dialog = this.page.getByRole("dialog", { name: "Manage session history" });
    await expect(dialog).toBeVisible();
    return dialog;
  }

  /** Fork the open session ("Try another approach" or "Fork for review"). */
  async fork(action: "Try another approach" | "Fork for review") {
    await this.button("Fork conversation").click();
    const dialog = this.page.getByRole("dialog", { name: "Fork conversation" });
    await dialog.getByRole("button", { name: action }).click();
    await expect(dialog).toBeHidden();
  }
}
