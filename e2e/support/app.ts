// High-level steps through the Splash UI, shared by both harnesses. Each waits
// for what the user would see before returning, so tests never race the app.
// Elements are found by test id (AGENTS.md, Test ids); this file and its
// siblings in support/ are the only places that name them.
import { expect, type Locator, type Page } from "@playwright/test";
import type { AgentId } from "./agents.ts";
import type { Harness } from "./backend.ts";
import { elyra } from "./elyra.ts";
import { testId } from "./testid.ts";

export type Status = "starting" | "idle" | "running" | "awaiting_permission" | "error" | "exited";
export type View = "library" | "attention" | "github" | "actions";
export type SideTab = "review" | "changes" | "files" | "details";
export type EntryKind = "user" | "agent" | "thought" | "tool" | "plan" | "permission" | "turn_end" | "error" | "notice" | "divider";

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

  // ── Shortcuts ──────────────────────────────────────────────────────────────

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

  // ── Sidebar ────────────────────────────────────────────────────────────────

  get sidebar() {
    return testId(this.page, "sidebar");
  }
  /** The sidebar's New session item (the Welcome page has a button of its own). */
  get newSessionButton() {
    return testId(this.page, "sidebar-new-session");
  }
  get addProjectButton() {
    return testId(this.page, "sidebar-add-project");
  }
  /** The number of sessions in Needs attention (empty when none). */
  get attentionCount() {
    return testId(this.page, "sidebar-attention-count");
  }
  get archivedToggle() {
    return testId(this.page, "sidebar-archived");
  }
  get archivedCount() {
    return testId(this.page, "sidebar-archived-count");
  }
  /** A view's item in the sidebar. */
  navItem(view: View): Locator {
    return {
      library: testId(this.page, "sidebar-library"),
      attention: testId(this.page, "sidebar-attention"),
      github: testId(this.page, "sidebar-github"),
      actions: testId(this.page, "sidebar-actions"),
    }[view];
  }
  async openNav(view: View) {
    await this.navItem(view).click();
  }
  /** A project in the sidebar, by its folder. */
  projectRow(path: string) {
    return testId(this.page, "sidebar-project", { path });
  }
  projectToggle(path: string) {
    return testId(this.projectRow(path), "sidebar-project-toggle");
  }
  /** Every session row in the sidebar. */
  get sessionRows() {
    return testId(this.page, "sidebar-session");
  }
  /** A session's row in the sidebar, by the title the test gave it. */
  sessionRow(title: string) {
    return this.sessionRows.filter({ has: this.page.getByText(title, { exact: true }) });
  }
  /** Shown on a session that waits for a permission answer. */
  needsYou(row: Locator) {
    return testId(row, "sidebar-session-needs");
  }
  /** The row's Go to session shortcut. */
  sessionKey(row: Locator) {
    return testId(row, "sidebar-session-key");
  }

  // ── Welcome ────────────────────────────────────────────────────────────────

  get welcome() {
    return testId(this.page, "welcome");
  }
  /** "Agents · n ready", which opens Settings on Agents; `data-ready` is n. */
  get welcomeAgents() {
    return testId(this.welcome, "welcome-agents");
  }
  /** The keycaps the Welcome page lists for an action (`session.new`, `app.palette`…). */
  welcomeShortcut(action: string) {
    return testId(this.welcome, "welcome-shortcut", { action });
  }

  // ── New session ────────────────────────────────────────────────────────────

  get newSessionDialog() {
    return testId(this.page, "new-session");
  }
  private dialogGroup(group: "project" | "agent" | "where") {
    return {
      project: testId(this.newSessionDialog, "new-session-project"),
      agent: testId(this.newSessionDialog, "new-session-agent"),
      where: testId(this.newSessionDialog, "new-session-where"),
    }[group];
  }
  /** A card in the dialog: a project (by id), an agent (by id), or where it works. */
  dialogChoice(group: "project" | "agent" | "where", value: string) {
    return testId(this.dialogGroup(group), "choice", { value });
  }
  /** Every card of one group in the dialog. */
  dialogChoices(group: "project" | "agent" | "where") {
    return testId(this.dialogGroup(group), "choice");
  }
  /** What the dialog says about an agent: its version, or why it can't start. */
  agentState(agent: AgentId | string) {
    return testId(this.dialogChoice("agent", agent), "new-session-agent-state");
  }
  get dialogFolders() {
    return testId(this.newSessionDialog, "new-session-folders");
  }
  /** Guidance shown before any project folder has been added. */
  get dialogProjectEmpty() {
    return testId(this.newSessionDialog, "new-session-project-empty");
  }
  /** Guidance and route to Settings when no detected agent can start. */
  get dialogAgentEmpty() {
    return testId(this.newSessionDialog, "new-session-agent-empty");
  }
  get dialogConfigureAgents() {
    return testId(this.newSessionDialog, "new-session-configure-agents");
  }
  get dialogAddFolder() {
    return testId(this.newSessionDialog, "new-session-add-folder");
  }
  get dialogStart() {
    return testId(this.newSessionDialog, "new-session-start");
  }
  get dialogCancel() {
    return testId(this.newSessionDialog, "new-session-cancel");
  }
  /** "owner/name #n: title" when working on a GitHub item. */
  get dialogContext() {
    return testId(this.newSessionDialog, "new-session-context");
  }
  /** Start a new worktree from the pull request's head (a pull request's only). */
  get dialogPrHead() {
    return testId(this.newSessionDialog, "new-session-pr-head");
  }

  /** Start a session through the New session dialog and wait until the agent is ready. */
  async newSession(options: { agent?: AgentId; where?: "worktree" | "in_place"; folders?: string[] } = {}) {
    const before = await this.page.evaluate(() => location.hash);
    await this.newSessionButton.click();
    await expect(this.newSessionDialog).toBeVisible();
    const agent = this.dialogChoice("agent", options.agent ?? "claude");
    await expect(agent).toBeEnabled();
    await agent.click();
    await this.dialogChoice("where", options.where ?? "in_place").click();
    if (options.folders) await this.dialogFolders.fill(options.folders.join("\n"));
    await this.dialogStart.click();
    // Typing before the dialog closes would reach the previous session.
    await expect(this.newSessionDialog).toBeHidden();
    await this.page.waitForFunction((b) => location.hash !== b && location.hash.startsWith("#/session/"), before);
    await this.expectStatus("idle");
    return this.sessionId();
  }

  /** The current session id, from the URL. */
  async sessionId(): Promise<string> {
    await this.page.waitForFunction(() => location.hash.startsWith("#/session/"));
    return this.page.evaluate(() => decodeURIComponent(location.hash.slice("#/session/".length).split("?")[0]));
  }

  // ── Session header ─────────────────────────────────────────────────────────

  /** The session header's title, which renames on click. */
  get title() {
    return testId(this.page, "session-title");
  }
  /** The session's status; its `data-status` is the state. */
  get status() {
    return testId(this.page, "session-status");
  }
  get cost() {
    return testId(this.page, "session-cost");
  }
  get archivedTag() {
    return testId(this.page, "session-archived");
  }
  get terminalToggle() {
    return testId(this.page, "session-terminal-toggle");
  }
  get panelToggle() {
    return testId(this.page, "session-panel-toggle");
  }
  /** The GitHub repository of the session's origin, which opens it. */
  get repoLink() {
    return testId(this.page, "session-repo");
  }
  /** The branch's pull request; `data-number` and `data-state` (open, merged…). */
  get pullRequest() {
    return testId(this.page, "session-pr");
  }

  async expectStatus(status: Status, timeout?: number) {
    await expect(this.status).toHaveAttribute("data-status", status, { timeout });
  }

  // ── Composer ───────────────────────────────────────────────────────────────

  get composer() {
    return testId(this.page, "composer-input");
  }
  get sendButton() {
    return testId(this.page, "composer-send");
  }
  get stopButton() {
    return testId(this.page, "composer-stop");
  }
  /** "Viewing saved history…" or "Connection failed…" above the box. */
  get resumeNote() {
    return testId(this.page, "composer-resume-note");
  }
  get continueButton() {
    return testId(this.page, "composer-continue");
  }
  /** The chip saying where the session works: a branch, or "In place · main". */
  get whereChip() {
    return testId(this.page, "composer-where");
  }
  get contextRing() {
    return testId(this.page, "context-ring");
  }
  /** An option picker (`mode`, `model`, `effort`, `fast`…), by the agent's option id. */
  picker(option: string) {
    return testId(testId(this.page, "composer-options"), "option-picker", { option });
  }
  get pickers() {
    return testId(testId(this.page, "composer-options"), "option-picker");
  }
  /** A choice in the open picker's menu, by value. */
  pickerChoice(value: string) {
    return testId(testId(this.page, "option-menu"), "option-choice", { value });
  }
  get slashMenu() {
    return testId(this.page, "slash-menu");
  }
  get slashCommands() {
    return testId(this.slashMenu, "slash-command");
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

  // ── Transcript ─────────────────────────────────────────────────────────────

  get transcript() {
    return testId(this.page, "transcript");
  }
  /** The centred "What should we work on?" before anything is said. */
  get transcriptEmpty() {
    return testId(this.transcript, "transcript-empty");
  }
  /** "Working…", "Waiting for you…" under the last entry. */
  get transcriptHint() {
    return testId(this.transcript, "transcript-hint");
  }
  /** Transcript entries, all or of one kind. */
  entries(kind?: EntryKind) {
    return testId(this.transcript, "entry", kind ? { kind } : {});
  }
  /** The entry the URL points at (a library search hit). */
  get matchedEntry() {
    return testId(this.transcript, "entry", { matched: "true" });
  }
  /** How a turn ended; its `data-stop-reason` is the reason. */
  turnEnds() {
    return testId(this.transcript, "turn-end");
  }
  /** Permission cards in a `state`: pending, allowed or rejected. */
  permissions(state?: "pending" | "allowed" | "rejected") {
    return testId(this.transcript, "permission", state ? { state } : {});
  }
  permissionAnswer(card: Locator) {
    return testId(card, "permission-answer");
  }
  /** A pending card's option: by kind (`allow_once`, `allow_always`, `reject_once`), or the first. */
  permissionOption(card: Locator, kind?: string) {
    return kind ? testId(card, "permission-option", { "option-kind": kind }) : testId(card, "permission-option").first();
  }
  /** A thought entry's fold and, while open, its text. */
  thought(entry: Locator) {
    return { toggle: testId(entry, "thought-toggle"), text: testId(entry, "thought-text") };
  }
  /** An agent notice's fold and, while open, its text. */
  notice(entry: Locator) {
    return { toggle: testId(entry, "notice-toggle"), text: testId(entry, "notice-text") };
  }
  /** Tool calls, all or of one ACP kind (`read`, `edit`, `execute`…). */
  tools(kind?: string) {
    return testId(this.transcript, "tool", kind ? { "tool-kind": kind } : {});
  }

  /** The plan's steps, all or in one state (`completed`, `in_progress`, `pending`). */
  planItems(status?: "completed" | "in_progress" | "pending") {
    return testId(this.entries("plan"), "plan-item", status ? { status } : {});
  }
  /** A tool call's diffs; `data-path` is the file, `data-new` marks a new one. */
  toolDiffs(tool: Locator) {
    return testId(tool, "tool-diff");
  }
  /** The file name over a diff, which opens it in a diff tab. */
  toolDiffPath(diff: Locator) {
    return testId(diff, "tool-diff-path");
  }
  /** A tool call's file locations (`data-path`, `data-line`), which open the file. */
  toolLocations(tool: Locator) {
    return testId(tool, "tool-location");
  }

  /** Allow the next `count` permission requests with their first option,
   * one at a time: each is answered before the next is clicked. */
  async allowPermissions(count: number) {
    const answered = this.permissionAnswers;
    const done = await answered.count();
    for (let i = 1; i <= count; i++) {
      await this.permissionOption(this.permissions("pending")).click();
      await expect(answered).toHaveCount(done + i);
    }
  }
  get permissionAnswers() {
    return testId(this.transcript, "permission-answer");
  }

  // ── Session tabs and side panel ────────────────────────────────────────────

  /** A tab over the transcript: the chat, the log, or a file or diff by path. */
  sessionTab(kind: "chat" | "log" | "file" | "diff", path?: string) {
    return testId(testId(this.page, "session-tabs"), "tab", path ? { kind, path } : { kind });
  }
  get sessionTabs() {
    return testId(testId(this.page, "session-tabs"), "tab");
  }
  /** The close button of the tab with this kind (and path). */
  closeTab(kind: "log" | "file" | "diff", path?: string) {
    return testId(testId(this.page, "session-tabs"), "tab-close", path ? { kind, path } : { kind });
  }
  get openLogButton() {
    return testId(this.page, "session-open-log");
  }
  /** A tab of the side panel. */
  sideTab(tab: SideTab) {
    return testId(testId(this.page, "side-tabs"), "tab", { tab });
  }
  get sidePanel() {
    return testId(this.page, "side-tabs");
  }
  /** A value in the Details panel, by its row key (`branch`, `extra-folder-1`). */
  detail(key: string) {
    return testId(this.page, "detail", { key });
  }

  // ── Context menu and dialogs (Elyra's own UI) ─────────────────────────────

  /** Right-click a sidebar row and pick a menu item. */
  async contextMenu(row: Locator, item: string | RegExp) {
    await row.click({ button: "right" });
    await this.ui.menuItem(item).click();
  }

  /** Answer the open confirm or prompt dialog; another may follow it. */
  async confirm(label: string) {
    const message = (await this.ui.modalMessage.innerText()).split("\n")[0];
    await this.ui.modalButton(label).click();
    await expect(this.ui.modal.filter({ hasText: message })).toHaveCount(0);
  }

  /** Drawn, though it may still be loading (agent detection, routing). */
  async waitShown() {
    await expect(this.newSessionButton).toBeVisible();
  }

  /** Loaded, and showing the view the URL names. */
  async waitReady() {
    await expect(testId(this.page, "app")).toHaveAttribute("data-ready", "true");
  }
}
