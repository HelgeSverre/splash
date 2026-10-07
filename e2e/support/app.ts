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

/** The browser runs on this machine: macOS gets ⌘ shortcuts and keycap symbols. */
export const APPLE = process.platform === "darwin";

/** What the web version binds instead of the shortcuts browsers keep for themselves. */
const BROWSER_SAFE: Record<string, string> = {
  "Meta+N": "Alt+Shift+N",
  "Meta+W": "Alt+Shift+W",
  "Meta+L": "Alt+Shift+L",
  "Meta+K": "Alt+Shift+K",
  "Meta+Shift+P": "Alt+Shift+P",
  "Ctrl+Tab": "Alt+Shift+ArrowRight",
  "Ctrl+Shift+Tab": "Alt+Shift+ArrowLeft",
  ...(APPLE ? {} : { "Meta+J": "Alt+Shift+J", "Meta+B": "Alt+Shift+B" }),
};

function defaultShortcut(combo: string, harness: Harness): string {
  if (!/(^|\+)(Meta|Ctrl)\+/.test(combo)) combo = `Meta+${combo}`;
  if (harness === "web") combo = BROWSER_SAFE[combo] ?? combo.replace(/^Meta\+([1-9])$/, "Alt+Shift+$1");
  if (!APPLE) combo = combo.replace("Meta", "Ctrl");
  const parts = combo.split("+");
  const key = parts.pop()!;
  return [...["Ctrl", "Alt", "Shift", "Meta"].filter((m) => parts.includes(m)), key].join("+");
}

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
  /** One of the app's default shortcuts, written as in lib/keybindings ("Meta+N",
   * "Meta+Shift+P", "Alt+Meta+B", "Ctrl+Tab"; a bare key means Meta+key), as the
   * app binds it here: ⌘ on macOS, Ctrl elsewhere, and on the web the browser's
   * own shortcuts moved to Alt+Shift. Canonical ("Ctrl+Alt+B"), as Settings shows it. */
  combo(combo: string) {
    return defaultShortcut(combo, this.harness);
  }
  /** The same shortcut as keys for `page.keyboard.press`. */
  key(combo: string) {
    return this.combo(combo).replace(/\bCtrl\b/, "Control");
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

  /** Allow the next `count` permission requests with their first option,
   * one at a time: each is answered before the next is clicked. */
  async allowPermissions(count: number) {
    const answered = this.entries("permission").locator(".answer");
    const done = await answered.count();
    for (let i = 1; i <= count; i++) {
      await this.entries("permission").locator(".perm.pending").getByRole("button").first().click();
      await expect(answered).toHaveCount(done + i);
    }
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
