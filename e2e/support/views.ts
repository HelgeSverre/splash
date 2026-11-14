// Views beyond the session itself: Needs attention, the Review tab, the
// session library, and the workbench panes (changes, files, diffs, log,
// terminal). Found by test id, like everything in support/.
import type { Locator, Page } from "@playwright/test";
import { testId } from "./testid.ts";

/** Needs attention. Groups are `permission`, `failed` and `review`. */
export class Attention {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  group(kind: "permission" | "failed" | "review") {
    return testId(this.page, "attention-group", { kind });
  }
  /** A session's item, in one group or any. */
  item(sessionId: string, kind?: "permission" | "failed" | "review") {
    return testId(kind ? this.group(kind) : this.page, "attention-item", { "session-id": sessionId });
  }
  items(kind?: "permission" | "failed" | "review") {
    return testId(kind ? this.group(kind) : this.page, "attention-item");
  }
  title(item: Locator) {
    return testId(item, "attention-title");
  }
  detail(item: Locator) {
    return testId(item, "attention-detail");
  }
  /** Answer permission, Review response & changes, or Open conversation. */
  open(item: Locator) {
    return testId(item, "attention-open");
  }
  reconnect(item: Locator) {
    return testId(item, "attention-reconnect");
  }
  recheck(item: Locator) {
    return testId(item, "attention-recheck");
  }
  /** Dismiss, or Mark reviewed for a review. */
  dismiss(item: Locator) {
    return testId(item, "attention-dismiss");
  }
  get empty() {
    return testId(this.page, "attention-empty");
  }
  get error() {
    return testId(this.page, "attention-error");
  }
  get checked() {
    return testId(this.page, "attention-checked");
  }
}

/** The side panel's Review tab. */
export class Review {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  get panel() {
    return testId(this.page, "review");
  }
  get reviewAllChanges() {
    return testId(this.panel, "review-all-changes");
  }
  /** Opens the session's pull request; `data-number` is its number. */
  get openPullRequest() {
    return testId(this.panel, "review-open-pr");
  }
  get markReviewed() {
    return testId(this.panel, "review-mark-reviewed");
  }
  get latest() {
    return testId(this.panel, "review-latest");
  }
  /** The failures section; `data-count` is how many. */
  get failures() {
    return testId(this.panel, "review-failures");
  }
  get failure() {
    return testId(this.failures, "review-failure");
  }
  get feedback() {
    return testId(this.panel, "review-feedback");
  }
  get sendFeedback() {
    return testId(this.panel, "review-send-feedback");
  }
  get askForReview() {
    return testId(this.panel, "review-ask");
  }
  get error() {
    return testId(this.panel, "review-error");
  }
}

/** The Sessions view's In Splash tab. */
export class Library {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  /** `saved` (In Splash) or `external` (Open from agent). */
  tab(tab: "saved" | "external") {
    return testId(testId(this.page, "library-tabs"), "tab", { tab });
  }
  get search() {
    return testId(this.page, "library-search");
  }
  get project() {
    return testId(this.page, "library-project");
  }
  get agent() {
    return testId(this.page, "library-agent");
  }
  /** all, active, archived, running, awaiting_permission or error. */
  get status() {
    return testId(this.page, "library-status");
  }
  /** `data-searching` while transcripts are searched, `data-count` the rows. */
  get summary() {
    return testId(this.page, "library-summary");
  }
  rows(sessionId?: string) {
    return testId(this.page, "library-session", sessionId ? { "session-id": sessionId } : {});
  }
  excerpt(row: Locator) {
    return testId(row, "library-excerpt");
  }
  get empty() {
    return testId(this.page, "library-empty");
  }
  /** Search and wait for the transcript search to settle. */
  async find(text: string) {
    await this.search.fill(text);
    await this.summary.and(this.page.locator("[data-searching=false]")).waitFor();
  }
}

/** The Review tab's changed files, the Files tab, and the diff, file, log and
 * terminal panes. Diff and file controls sit on the tab bar and are those of
 * the open session tab; the log's are in its pane. */
export class Workbench {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  /** The open session tab's pane. */
  get pane() {
    return testId(this.page, "session-pane", { active: "true" });
  }
  /** The open tab's own controls, at the right of the tab bar. */
  get tools() {
    return testId(this.page, "session-tab-tools");
  }
  /** Changed files; `data-path` and `data-status` on each. */
  changes(path?: string) {
    return testId(this.page, "change", path ? { path } : {});
  }
  /** "n files"; `data-count` is n. */
  get changesCount() {
    return testId(this.page, "changes-count");
  }
  get changesBase() {
    return testId(this.page, "changes-base");
  }
  get noChanges() {
    return testId(this.page, "changes-empty");
  }
  get diffNewFile() {
    return testId(this.tools, "diff-new-file");
  }
  get diffDeleted() {
    return testId(this.tools, "diff-deleted");
  }
  diffLayout(value: "unified" | "split") {
    return testId(testId(this.tools, "diff-layout"), "segment", { value });
  }
  get wholeFile() {
    return testId(this.tools, "diff-whole-file");
  }
  get openFile() {
    return testId(this.tools, "diff-open-file");
  }
  get tree() {
    return testId(this.page, "file-tree");
  }
  /** A folder listing that failed, rather than a real empty folder. */
  get fileTreeError() {
    return testId(this.page, "file-tree-error");
  }
  get refreshSidePanel() {
    return testId(this.page, "side-panel-refresh");
  }
  /** A file or folder in the tree, by path relative to the session folder. */
  node(path: string) {
    return testId(this.tree, "tree-node", { path });
  }
  changeMark(node: Locator) {
    return testId(node, "change-mark");
  }
  /** "n lines · size"; `data-lines` is n. */
  get fileMeta() {
    return testId(this.tools, "file-meta");
  }
  get fileReadOnly() {
    return testId(this.tools, "file-readonly");
  }
  get fileContent() {
    return testId(this.pane, "file-content");
  }
  get logFilter() {
    return testId(this.pane, "log-filter");
  }
  /** Lines of the RPC log; `data-method` on each. */
  get logLines() {
    return testId(this.pane, "log-line");
  }
  /** "n of m lines"; `data-shown` and `data-total`. */
  get filterCount() {
    return testId(this.pane, "filter-count");
  }
  get terminal() {
    return testId(this.page, "terminal");
  }
  /** xterm's own rendering of the shell's screen. */
  get terminalScreen() {
    return this.terminal.locator(".xterm-rows");
  }
  get terminalInput() {
    return this.terminal.locator(".xterm");
  }
  get hideTerminal() {
    return testId(this.page, "terminal-hide");
  }
}
