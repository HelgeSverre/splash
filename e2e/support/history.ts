// Agent history: the Sessions page's "Open from agent" browser, and a
// session's history bar (Refresh from agent, Fork conversation, Manage history).
// Found by test id, like everything in support/.
//
// The fake agents replay synthesized recordings (fixtures/e2e/history_*.jsonl):
// Claude lists two pages of saved sessions and can load, resume, fork and
// delete them; Codex lists one and can only load it. Saved sessions live in
// the folder the agent was launched in ($CWD).
import { expect } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { AgentId } from "./agents.ts";
import type { App } from "./app.ts";
import { FIXTURES } from "./paths.ts";
import { testId } from "./testid.ts";
import { Library } from "./views.ts";
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

/** An agent's discovery: still finding, failed (an error and Retry), listed
 * ("n loaded"), or unlisted (the agent can't list its sessions). */
export type SourceState = "loading" | "failed" | "listed" | "unlisted";

export class History {
  readonly app: App;
  constructor(app: App) {
    this.app = app;
  }
  get page() {
    return this.app.page;
  }

  // ── Sessions → Open from agent ──────────────────────────────────────────

  /** The agent filter; option values are agent ids, "" for all installed agents. */
  get agentFilter() {
    return testId(this.page, "external-agent");
  }
  /** The filter's installed agents, without "All installed agents". */
  get agentOptions() {
    const filter = this.agentFilter;
    return testId(filter, "external-agent-option");
  }
  agentOption(agent: AgentId) {
    const filter = this.agentFilter;
    return testId(filter, "external-agent-option", { agent });
  }
  /** The folder filter; option values are project paths, "" for all folders. */
  get folderFilter() {
    return testId(this.page, "external-folder");
  }
  get findButton() {
    return testId(this.page, "external-find");
  }
  get refreshListsButton() {
    return testId(this.page, "external-refresh");
  }
  /** One agent's discovery; `data-state` is a SourceState, `data-count` the sessions loaded. */
  source(agent: AgentId) {
    return testId(this.page, "external-source", { agent });
  }
  /** Wait until the agent has listed `count` sessions ("n loaded"). */
  async expectListed(agent: AgentId, count: number) {
    await expect(testId(this.page, "external-source", { agent, state: "listed", count: String(count) })).toBeVisible();
  }
  sourceError(agent: AgentId) {
    const source = this.source(agent);
    return testId(source, "external-source-error");
  }
  retry(agent: AgentId) {
    const source = this.source(agent);
    return testId(source, "external-source-retry");
  }
  /** Load more from the agent: its next page. */
  loadMore(agent: AgentId) {
    const source = this.source(agent);
    return testId(source, "external-source-more");
  }
  /** Shown when the agent lists sessions but can't replay them. */
  noPreview(agent: AgentId) {
    const source = this.source(agent);
    return testId(source, "external-source-no-preview");
  }
  /** "n loaded sessions match"; `data-count` is n. */
  get matchCount() {
    return testId(this.page, "external-match-count");
  }
  /** Listed sessions, each with `data-agent`, `data-session-id` (the agent's),
   * `data-cwd`, `data-extra-folders` (how many) and `data-local`: `none`,
   * `current` (In Splash) or `outdated` (the agent has newer activity). */
  get rows() {
    return testId(this.page, "external-session");
  }
  /** The listed sessions' titles, in order. */
  get rowTitles() {
    const rows = this.rows;
    return testId(rows, "external-session-title");
  }
  /** A listed session, by its title in the recording. */
  row(title: string) {
    const titles = testId(this.page, "external-session-title");
    return this.rows.filter({ has: titles.getByText(title, { exact: true }) });
  }
  /** The previewed conversation: `data-agent`, `data-session-id`, `data-entries` (how many). */
  get preview() {
    return testId(this.page, "external-preview");
  }
  get previewTitle() {
    const preview = this.preview;
    return testId(preview, "external-preview-title");
  }
  /** One of the preview's workspace folders, by path. */
  previewFolder(path: string) {
    const preview = this.preview;
    return testId(preview, "external-preview-folder", { path });
  }
  /** Any text box in the preview, which is read-only. */
  get previewInputs() {
    return this.preview.getByRole("textbox");
  }
  /** Add to Splash (`add`), or Update local copy (`update`) for a conversation already there. */
  importButton(mode: "add" | "update") {
    const preview = this.preview;
    return testId(preview, "external-import", { mode });
  }
  /** Why loading or adding a conversation failed. */
  get error() {
    return testId(this.page, "external-error");
  }

  // "Open a known session ID", once openKnown() has expanded it.
  get knownAgent() {
    return testId(this.page, "external-known-agent");
  }
  get knownId() {
    return testId(this.page, "external-known-id");
  }
  /** The original working directory. */
  get knownCwd() {
    return testId(this.page, "external-known-cwd");
  }
  get knownPreview() {
    return testId(this.page, "external-known-preview");
  }
  async openKnown() {
    await testId(this.page, "external-known-toggle").click();
    await expect(testId(this.page, "external-known")).toHaveAttribute("open");
    await expect(this.knownId).toBeVisible();
  }

  async open() {
    await this.app.openNav("library");
    await new Library(this.page).tab("external").click();
    await expect(this.findButton).toBeVisible();
  }

  /** Choose the agent and folder (a project's path), then Find sessions or Refresh lists. */
  async find({ agent, folder, refresh = false }: { agent?: AgentId; folder?: string; refresh?: boolean } = {}) {
    await this.agentFilter.selectOption({ value: agent ?? "" });
    await this.folderFilter.selectOption({ value: folder ?? "" });
    await (refresh ? this.refreshListsButton : this.findButton).click();
  }

  /** Preview a listed session. */
  async show(title: string) {
    await this.row(title).click();
    await expect(this.row(title)).toHaveAttribute("aria-pressed", "true");
    await expect(this.previewTitle).toBeVisible();
  }

  /** Find Claude's saved sessions in a project folder, preview one and add it;
   * returns the new session's id. */
  async importSession(title: string, folder: string): Promise<string> {
    await this.open();
    await this.find({ agent: "claude", folder });
    await expect(this.source("claude")).toHaveAttribute("data-state", "listed");
    await this.show(title);
    await this.importButton("add").click();
    await expect(this.app.title).toBeVisible();
    await this.app.expectStatus("exited");
    return this.app.sessionId();
  }

  // ── A session's history bar ─────────────────────────────────────────────

  /** `data-sync`: `synced`, `unsynced`, `outdated` (new activity at the agent)
   * or `deleted` (local history only). */
  get bar() {
    return testId(this.page, "history-bar");
  }
  /** "Fork of …", which opens the parent; `data-session-id` is the parent's id. */
  get parentLink() {
    const bar = this.bar;
    return testId(bar, "history-parent");
  }
  /** The overflow trigger beside Agent history. */
  get menuTrigger() {
    return testId(this.bar, "history-menu-trigger");
  }
  /** The open history-actions menu. */
  get menu() {
    return testId(this.bar, "history-menu");
  }
  get menuItems() {
    return testId(this.menu, "history-menu-item");
  }
  menuItem(action: "disconnect" | "capabilities" | "refresh" | "fork" | "manage") {
    return testId(this.menu, "history-menu-item", { action });
  }
  /** Open the history-actions menu before interacting with one of its actions. */
  async openMenu() {
    await this.menuTrigger.click();
    await expect(this.menu).toBeVisible();
  }
  get disconnectButton() {
    return this.menuItem("disconnect");
  }
  /** Refresh from agent. */
  get refreshButton() {
    return this.menuItem("refresh");
  }
  /** Fork conversation. */
  get forkButton() {
    return this.menuItem("fork");
  }
  get manageButton() {
    return this.menuItem("manage");
  }
  /** What the last action did. */
  get notice() {
    const bar = this.bar;
    return testId(bar, "history-notice");
  }
  /** Announced while a history action is in flight after its menu closes. */
  get busy() {
    return testId(this.bar, "history-busy");
  }
  /** Why the last action failed. */
  get barError() {
    const bar = this.bar;
    return testId(bar, "history-error");
  }

  async disconnect() {
    await this.openMenu();
    await this.disconnectButton.click();
    await expect(this.notice).toHaveText("Agent disconnected. Your local history is saved.");
    await this.app.expectStatus("exited");
  }

  // ── Manage history and Fork conversation dialogs ────────────────────────

  /** The open dialog: Manage history (`manage`) or Fork conversation (`fork`). */
  dialog(panel?: "manage" | "fork") {
    return testId(this.page, "history-dialog", panel ? { panel } : {});
  }
  /** The session's title, at the top of the dialog. */
  get dialogTitle() {
    const dialog = this.dialog();
    return testId(dialog, "history-dialog-title");
  }
  /** One of the session's workspace folders, by path. */
  dialogFolder(path: string) {
    const dialog = this.dialog();
    return testId(dialog, "history-dialog-folder", { path });
  }
  get dialogError() {
    const dialog = this.dialog();
    return testId(dialog, "history-dialog-error");
  }
  get closeDialog() {
    const dialog = this.dialog();
    return testId(dialog, "modal-close");
  }
  /** The agent's own id for the conversation. */
  get agentSessionId() {
    const dialog = this.dialog();
    return testId(dialog, "history-agent-session");
  }
  /** "Disconnect the agent before …", while it's connected. */
  get disconnectFirst() {
    const dialog = this.dialog();
    return testId(dialog, "history-disconnect-first");
  }
  /** Delete agent history… */
  get deleteAgentHistoryButton() {
    const dialog = this.dialog();
    return testId(dialog, "history-delete-agent");
  }
  /** Delete local session… (`data-worktree`: the worktree goes too) or Remove local copy… */
  get removeLocalButton() {
    const dialog = this.dialog();
    return testId(dialog, "history-remove-local");
  }
  /** The confirmation; `data-confirm` is `native` (agent history), `local`, or `dirty` (uncommitted changes). */
  get confirmation() {
    const dialog = this.dialog();
    return testId(dialog, "history-confirm");
  }
  get confirmTitle() {
    const confirmation = this.confirmation;
    return testId(confirmation, "history-confirm-title");
  }
  get confirmMessage() {
    const confirmation = this.confirmation;
    return testId(confirmation, "history-confirm-message");
  }
  /** The confirmation's delete, remove or discard button. */
  get confirmButton() {
    const confirmation = this.confirmation;
    return testId(confirmation, "history-confirm-delete");
  }
  get cancelConfirmButton() {
    const confirmation = this.confirmation;
    return testId(confirmation, "history-confirm-cancel");
  }
  /** Fork conversation's Try another approach (`separate`) or Fork for review (`review`). */
  forkAction(kind: "separate" | "review") {
    const dialog = this.dialog("fork");
    return kind === "separate" ? testId(dialog, "history-fork-separate") : testId(dialog, "history-fork-review");
  }

  /** Open Manage history. */
  async manage() {
    await this.openMenu();
    await this.manageButton.click();
    await expect(this.dialog("manage")).toBeVisible();
  }

  /** Fork the open session into a separate conversation, or one prepared for review. */
  async fork(kind: "separate" | "review") {
    await this.openMenu();
    await this.forkButton.click();
    await this.forkAction(kind).click();
    await expect(this.dialog("fork")).toBeHidden();
  }
}
