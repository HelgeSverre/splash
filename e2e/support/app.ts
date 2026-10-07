// High-level steps through the Splash UI, shared by both harnesses. Each waits
// for what the user would see before returning, so tests never race the app.
import { expect, type Page } from "@playwright/test";
import type { AgentId } from "./agents.ts";
import type { Harness } from "./backend.ts";
import { elyra } from "./elyra.ts";

const AGENT_NAMES: Record<AgentId, string> = {
  claude: "Claude Code",
  codex: "Codex",
  glue: "Glue",
  pool: "Pool",
  pi: "Pi",
};

export type Status = "starting" | "idle" | "running" | "awaiting_permission" | "error" | "exited";

export class App {
  readonly page: Page;
  readonly harness: Harness;
  constructor(page: Page, harness: Harness) {
    this.page = page;
    this.harness = harness;
  }

  get ui() {
    return elyra(this.page);
  }
  get sidebar() {
    return this.page.locator("aside").first();
  }
  get composer() {
    return this.page.getByRole("textbox", { name: "Message" });
  }
  get transcript() {
    return this.page.getByRole("region", { name: "Transcript" });
  }
  /** Transcript entries of one kind (user, agent, tool, permission, turn_end, error, …). */
  entries(kind: string) {
    return this.transcript.locator(`[data-kind="${kind}"]`);
  }
  get sendButton() {
    return this.page.getByRole("button", { name: "Send", exact: true });
  }
  get stopButton() {
    return this.page.getByRole("button", { name: "Stop", exact: true });
  }
  /** The session header's title, which renames on click. */
  get title() {
    return this.page.locator('button[title="Rename"]');
  }
  get status() {
    return this.page.locator("[data-status]");
  }
  /** The modifier the app's default shortcuts use: browser-safe Alt+Shift on the web. */
  key(combo: string) {
    return this.harness === "web" ? `Alt+Shift+${combo}` : `ControlOrMeta+${combo}`;
  }

  /** The sidebar's New session item (the Welcome page has a button of its own). */
  get newSessionButton() {
    return this.sidebar.locator(".footer .nav-item", { hasText: "New session" });
  }

  async waitReady() {
    await expect(this.newSessionButton).toBeVisible();
  }

  async expectStatus(status: Status, timeout?: number) {
    await expect(this.status).toHaveAttribute("data-status", status, { timeout });
  }

  /** The current session id, from the URL. */
  async sessionId(): Promise<string> {
    await this.page.waitForFunction(() => location.hash.startsWith("#/session/"));
    return this.page.evaluate(() => decodeURIComponent(location.hash.slice("#/session/".length).split("?")[0]));
  }

  /** Start a session through the New session dialog and wait until the agent is ready. */
  async newSession(options: { agent?: AgentId; where?: "worktree" | "in_place"; project?: string; folders?: string[] } = {}) {
    const before = await this.page.evaluate(() => location.hash);
    await this.newSessionButton.click();
    const dialog = this.page.getByRole("dialog", { name: "New session" });
    await expect(dialog).toBeVisible();
    if (options.project) await dialog.getByRole("radiogroup", { name: "Project" }).getByRole("radio", { name: options.project }).click();
    const agent = dialog.getByRole("radiogroup", { name: "Agent" }).getByRole("radio", { name: AGENT_NAMES[options.agent ?? "claude"] });
    await expect(agent).toBeEnabled();
    await agent.click();
    const where = options.where === "worktree" ? "New worktree" : "In place";
    await dialog.getByRole("radiogroup", { name: "Where it works" }).getByRole("radio", { name: where }).click();
    if (options.folders) await dialog.getByLabel("Additional workspace folders").fill(options.folders.join("\n"));
    await dialog.getByRole("button", { name: /^Start session/ }).click();
    // Typing before the dialog closes would reach the previous session.
    await expect(dialog).toBeHidden();
    await this.page.waitForFunction((b) => location.hash !== b && location.hash.startsWith("#/session/"), before);
    await this.expectStatus("idle");
    return this.sessionId();
  }

  /** Type a prompt and send it with Enter. */
  async send(text: string) {
    await this.composer.fill(text);
    await this.composer.press("Enter");
    await expect(this.entries("user").filter({ hasText: text }).last()).toBeVisible();
  }

  /** Send a prompt and wait for the turn to end. */
  async prompt(text: string) {
    const ends = await this.entries("turn_end").count();
    await this.send(text);
    await expect(this.entries("turn_end")).toHaveCount(ends + 1);
  }

  async openNav(name: "Sessions" | "Needs attention" | "GitHub" | "Actions") {
    await this.sidebar.getByRole("button", { name: new RegExp(`^${name}`) }).click();
  }

  /** A tab of the side panel (Review, Changes, Files, Details). */
  sideTab(name: "Review" | "Changes" | "Files" | "Details") {
    return this.page.getByRole("tablist", { name: "Side panel" }).getByRole("tab", { name: new RegExp(`^${name}`) });
  }

  /** A value in the Details panel, by its label. */
  detail(label: string) {
    return this.page.locator(".kv-k", { hasText: new RegExp(`^${label}$`) }).locator("xpath=following-sibling::*[1]");
  }

  /** The composer's option pickers (mode, model, effort…), by option name. */
  picker(name: string) {
    return this.page.locator(`.composer .controls [aria-haspopup=listbox][title="${name}"]`);
  }

  /** A project's toggle in the sidebar. */
  projectRow(name: string) {
    return this.sidebar.locator(".project-toggle", { hasText: name });
  }

  /** The sidebar row of a session, by title. */
  sessionRow(title: string) {
    return this.sidebar.locator("nav .nav-item").filter({ has: this.page.locator(".label").getByText(title, { exact: true }) });
  }

  /** Right-click a sidebar row and pick a menu item. */
  async contextMenu(row: ReturnType<App["sessionRow"]>, item: string | RegExp) {
    await row.click({ button: "right" });
    await this.ui.menuItem(item).click();
  }

  /** Answer the open confirm or prompt dialog; another may follow it. */
  async confirm(label: string) {
    const text = this.ui.modal.locator(".elyra-modal-body, .elyra-modal-title").first();
    const message = (await text.innerText()).split("\n")[0];
    await this.ui.modalButton(label).click();
    await expect(this.ui.modal.filter({ hasText: message })).toHaveCount(0);
  }
}
