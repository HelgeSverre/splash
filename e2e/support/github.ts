// The fake GitHub: the `gh` router's scenario and call log (fakes/gh,
// fakes/gh-router), pull requests on the offline github.com remote
// (support/git.ts), and the GitHub and Actions views, found by test id.
//
//   test.use({ gh: true });
//   test.beforeEach(async ({ world, page }) => {
//     bareRemote(world, "e2e/demo");   // the project's origin: auto-linked
//     await pinClock(page);            // the scenario's "now"
//   });
//   const gh = new FakeGithub(world);
//   gh.fail(/^graphql pullRequests e2e-labs\/widgets$/, "gh: Not Found (HTTP 404)");
//   expect(gh.graphql(/search/)[0].variables.q).toBe("…");
import { expect, type Locator, type Page } from "@playwright/test";
import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createPrRef, git, write } from "./git.ts";
import { E2E } from "./paths.ts";
import { testId } from "./testid.ts";
import type { World } from "./world.ts";

/** "Now" in the triage scenario. Tests pin the browser clock to it (pinClock). */
export const NOW = "2026-10-07T12:00:00Z";

const SCENARIOS = join(E2E, "fakes", "gh-router", "scenarios");

export type GhCall = { argv: string[]; stdin: string; cwd: string };
export type Comment = { author: string; body: string; created: string };
export type Issue = {
  number: number;
  title: string;
  body?: string;
  state: "OPEN" | "CLOSED" | "MERGED";
  updated: string;
  author: string;
  assignees?: string[];
  labels?: string[];
  comments?: Comment[];
};
export type Pull = Issue & { branch: string; review?: string | null; checks?: string | null; reviewers?: string[]; draft?: boolean };
export type Repository = {
  full_name: string;
  private?: boolean;
  archived?: boolean;
  has_issues?: boolean;
  pushed_at: string;
  issues?: Issue[];
  pulls?: Pull[];
  branches?: { name: string; message: string; committed: string; author: string }[];
  events?: unknown[];
  actions?: { workflows?: unknown[]; runs?: unknown[]; jobs?: Record<string, unknown[]>; logs?: Record<string, unknown> };
};
export type Rule = { match: string; error: string };
export type Scenario = {
  login: string;
  now: string;
  next_number: number;
  failures: Rule[];
  delays: { match: string; seconds: number }[];
  repositories: Repository[];
};

export class FakeGithub {
  readonly dir: string;
  constructor(world: World) {
    this.dir = join(world.control, "gh");
    mkdirSync(this.dir, { recursive: true });
  }

  private get file() {
    return join(this.dir, "scenario.json");
  }

  /** Start this test from another scenario in fakes/gh-router/scenarios (default: triage). */
  use(name: string) {
    copyFileSync(join(SCENARIOS, `${name}.json`), this.file);
  }

  scenario(): Scenario {
    return JSON.parse(readFileSync(existsSync(this.file) ? this.file : join(SCENARIOS, "triage.json"), "utf8"));
  }

  /** Change this test's scenario; the next gh call answers from it. */
  update(change: (scenario: Scenario) => void) {
    const scenario = this.scenario();
    change(scenario);
    // Replaced atomically: gh calls run concurrently and must never read half a file.
    const tmp = `${this.file}.${process.pid}.tmp`;
    writeFileSync(tmp, JSON.stringify(scenario, null, 2));
    renameSync(tmp, this.file);
  }

  /** A repository of a scenario, by name. */
  static repo(scenario: Scenario, name: string): Repository {
    const repo = scenario.repositories.find((r) => r.full_name === name);
    if (!repo) throw new Error(`no repository ${name} in the scenario`);
    return repo;
  }

  /** Make requests whose key matches fail like gh does (see router.py for keys). */
  fail(match: RegExp, error: string) {
    this.update((s) => s.failures.push({ match: match.source, error }));
  }
  /** Drop every injected failure. */
  heal() {
    this.update((s) => (s.failures = []));
  }
  /** Hold requests whose key matches for a while, to catch the UI loading. */
  delay(match: RegExp, seconds: number) {
    this.update((s) => s.delays.push({ match: match.source, seconds }));
  }

  /** Every gh call, in order. */
  calls(): GhCall[] {
    const file = join(this.dir, "calls.jsonl");
    if (!existsSync(file)) return [];
    return readFileSync(file, "utf8")
      .split("\n")
      .filter((l) => l.trim())
      .map((l) => JSON.parse(l) as GhCall);
  }
  /** `gh api` calls to REST endpoints matching `endpoint`. */
  rest(endpoint: RegExp): GhCall[] {
    return this.calls().filter((c) => c.argv[0] === "api" && endpointOf(c) !== "graphql" && endpoint.test(endpointOf(c) ?? ""));
  }
  /** GraphQL requests whose query matches. */
  graphql(query: RegExp = /./): { query: string; variables: Record<string, unknown> }[] {
    return this.calls()
      .filter((c) => c.argv[0] === "api" && endpointOf(c) === "graphql")
      .map((c) => JSON.parse(c.stdin))
      .filter((body) => query.test(body.query));
  }
  /** Git transport requests the offline github.com served ("git-upload-pack e2e/demo.git"). */
  ssh(): string[] {
    const file = join(this.dir, "ssh.log");
    return existsSync(file) ? readFileSync(file, "utf8").split("\n").filter(Boolean) : [];
  }
}

/** The endpoint argument of a `gh api` call. */
export function endpointOf(call: GhCall): string | undefined {
  const args = call.argv.slice(1);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--hostname" || args[i] === "--input") i++;
    else if (!args[i].startsWith("-")) return args[i];
  }
  return undefined;
}

/**
 * Open pull request `number` on the offline GitHub: a commit on `branch`, made
 * in a scratch clone so the project's own checkout never has it, pushed as
 * refs/heads/<branch> and refs/pull/<number>/head. Returns the commit.
 */
export function publishPullRequest(
  world: World,
  bare: string,
  pr: { number: number; branch: string; message: string; files: Record<string, string> },
): string {
  const env = world.env();
  const clone = join(world.root, `pull-${pr.number}`);
  git(world.root, env, "clone", "-q", bare, clone);
  git(clone, env, "checkout", "-q", "-b", pr.branch);
  for (const [path, text] of Object.entries(pr.files)) write(clone, path, text);
  git(clone, env, "commit", "-q", "-am", pr.message);
  git(clone, env, "push", "-q", "origin", pr.branch);
  const sha = git(clone, env, "rev-parse", "HEAD");
  createPrRef(bare, env, pr.number, sha);
  return sha;
}

/** Pin the browser's clock to `time`; it then runs on from there. Call before the page loads. */
export async function pinClock(page: Page, time = NOW) {
  await page.clock.install({ time });
}

/** An item's kind in the GitHub view. */
export type GithubKind = "issue" | "pull_request" | "branch" | "activity";

/** The GitHub triage view. Rows carry `data-repo`, `data-kind`, `data-number`
 * (issues and pull requests) and `data-branch` (branches and pull requests). */
export class GithubView {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  get root() {
    return testId(this.page, "github-view");
  }
  /** "@login" in the header. */
  get account() {
    return testId(this.page, "github-account");
  }
  get refresh() {
    return testId(this.page, "github-refresh");
  }
  get newIssue() {
    return testId(this.page, "github-new-issue");
  }

  // ── Scope and filters ──────────────────────────────────────────────────────

  /** Filters loaded items, or holds the text to search GitHub for. */
  get search() {
    return testId(this.page, "github-search");
  }
  /** Values are owner logins, "" for all owners. */
  get owner() {
    return testId(this.page, "github-owner");
  }
  /** Opens the repository picker; `data-count` is the repositories in scope. */
  get repositories() {
    return testId(this.page, "github-repositories");
  }
  /** Linked to Splash; `aria-pressed` while on. */
  get linked() {
    return testId(this.page, "github-linked");
  }
  /** Saved views by id; "" is the unsaved, custom view. */
  get savedView() {
    return testId(this.page, "github-saved-view");
  }
  /** The view the saved-view menu shows. */
  get currentView() {
    return this.savedView.locator("option:checked");
  }
  /** The saved views on offer, without the custom view. */
  get savedViews() {
    return this.savedView.locator('option:not([value=""])');
  }
  get saveView() {
    return testId(this.page, "github-save-view");
  }
  get deleteView() {
    return testId(this.page, "github-delete-view");
  }
  get saveDialog() {
    return testId(this.page, "github-save-dialog");
  }
  get saveName() {
    return testId(this.saveDialog, "github-save-name");
  }
  get saveSubmit() {
    return testId(this.saveDialog, "github-save-submit");
  }
  /** inbox, unread, snoozed or all (inbox and snoozed). */
  get inboxFilter() {
    return testId(this.page, "github-inbox-filter");
  }
  get markAllRead() {
    return testId(this.page, "github-mark-all-read");
  }
  /** loaded (filter loaded activity) or github (search GitHub). */
  get searchSource() {
    return testId(this.page, "github-search-source");
  }
  /** Search GitHub's fields, shown while the source is `github`. */
  get author() {
    return testId(this.page, "github-search-author");
  }
  get assignee() {
    return testId(this.page, "github-search-assignee");
  }
  get label() {
    return testId(this.page, "github-search-label");
  }
  /** "", requested, required, approved or changes_requested. */
  get review() {
    return testId(this.page, "github-search-review");
  }
  get searchGithub() {
    return testId(this.page, "github-search-submit");
  }
  tab(tab: "all" | "needs_me" | "issue" | "pull_request" | "branch") {
    return testId(testId(this.page, "github-tabs"), "tab", { tab });
  }
  /** all, open, or closed (closed and merged). */
  get itemStatus() {
    return testId(this.page, "github-item-status");
  }

  // ── The list ───────────────────────────────────────────────────────────────

  get list() {
    return testId(this.page, "github-list");
  }
  /** "n loaded items"; `data-count` is n. */
  get count() {
    return testId(this.list, "github-count");
  }
  /** Rows of the list, all or narrowed by their data. */
  items(data: { repo?: string; kind?: GithubKind; number?: number; branch?: string } = {}) {
    const { number, ...rest } = data;
    return testId(this.list, "github-item", number === undefined ? rest : { ...rest, number: String(number) });
  }
  /** An issue's or pull request's row. */
  item(repo: string, number: number) {
    return this.items({ repo, number });
  }
  /** A branch's row. */
  branch(repo: string, name: string) {
    return this.items({ repo, kind: "branch", branch: name });
  }
  /** Every row's title, in order. */
  get titles() {
    return testId(this.list, "github-item-title");
  }
  title(row: Locator) {
    return testId(row, "github-item-title");
  }
  /** The unread marks in the list, or on one row. */
  unread(row: Locator = this.list) {
    return testId(row, "github-item-unread");
  }
  /** Shown on a row whose repository is linked to a Splash project. */
  linkedMark(row: Locator) {
    return testId(row, "github-item-linked");
  }
  get empty() {
    return testId(this.list, "github-empty");
  }
  /** Loads older items; `data-count` is the feeds that have more. */
  get loadMore() {
    return testId(this.list, "github-load-more");
  }

  // ── Failed feeds ───────────────────────────────────────────────────────────

  /** The failed feeds' report, a `<details>`; `data-count` is how many. */
  get failures() {
    return testId(this.page, "github-failures");
  }
  /** Unfolds and folds the report. */
  get failuresSummary() {
    return testId(this.failures, "github-failures-summary");
  }
  failure(repo: string, kind: GithubKind) {
    return testId(this.failures, "github-failure", { repo, kind });
  }
  get retryFailures() {
    return testId(this.failures, "github-failures-retry");
  }

  // ── Footer ─────────────────────────────────────────────────────────────────

  /** "n / m feeds loaded", or "Loading n / m" while `data-loading`; `data-loaded` and `data-total` are n and m. */
  get sync() {
    return testId(this.page, "github-sync");
  }
  /** The footer once loading stopped with `loaded` of `total` feeds answered. */
  synced(loaded: number, total = loaded) {
    return testId(this.page, "github-sync", { loading: "false", loaded: String(loaded), total: String(total) });
  }
  /** Every feed answered. Each is a fake gh process, so allow for a busy machine. */
  async loaded(feeds: number) {
    await expect(this.synced(feeds)).toBeVisible({ timeout: 30_000 });
  }
  get pause() {
    return testId(this.page, "github-pause");
  }
  get resume() {
    return testId(this.page, "github-resume");
  }
  get resumeSearch() {
    return testId(this.page, "github-resume-search");
  }

  // ── The selected item ──────────────────────────────────────────────────────

  /** The selected item's details; `data-repo`, `data-kind` and `data-number` say which. */
  get detail() {
    return testId(this.page, "github-detail");
  }
  get detailTitle() {
    return testId(this.detail, "github-detail-title");
  }
  get comments() {
    return testId(this.detail, "github-comment");
  }
  get workOnThis() {
    return testId(this.detail, "github-detail-work");
  }
  /** Mark read or Mark unread; `data-unread` is the item's state. */
  get readToggle() {
    return testId(this.detail, "github-detail-read");
  }
  /** tomorrow (until 9 tomorrow), activity (until new activity) or wake. */
  get snooze() {
    return testId(this.detail, "github-detail-snooze");
  }
  /** A Splash project of the item's repository, by its folder. */
  detailProject(path: string) {
    return testId(this.detail, "github-detail-project", { path });
  }
  get noProject() {
    return testId(this.detail, "github-detail-no-project");
  }
  /** A session of a linked project; `data-match` is `item` or `branch` when it works on this one. */
  detailSession(sessionId: string) {
    return testId(this.detail, "github-detail-session", { "session-id": sessionId });
  }
  /** Link to Splash…, or Link another project… once linked. */
  get linkProject() {
    return testId(this.detail, "github-detail-link");
  }
  get linkDialog() {
    return testId(this.page, "github-link-dialog");
  }
  /** A project to link the repository to, by its folder. */
  linkChoice(path: string) {
    return testId(this.linkDialog, "github-link-project", { path });
  }
}

/** The GitHub view's repository picker. */
export class RepoPicker {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  get dialog() {
    return testId(this.page, "github-repo-picker");
  }
  get filter() {
    return testId(this.dialog, "github-repo-filter");
  }
  /** A repository's checkbox. */
  repo(name: string) {
    return testId(this.dialog, "github-repo", { repo: name });
  }
  /** The checked repositories. */
  get checked() {
    return testId(this.dialog, "github-repo").and(this.page.locator(":checked"));
  }
  /** "n selected"; `data-count` is n. */
  get selected() {
    return testId(this.dialog, "github-repo-selected");
  }
  get all() {
    return testId(this.dialog, "github-repo-all");
  }
  get clear() {
    return testId(this.dialog, "github-repo-clear");
  }
  /** `data-count` is how many match the filter. */
  get selectMatches() {
    return testId(this.dialog, "github-repo-select-matches");
  }
  get apply() {
    return testId(this.dialog, "github-repo-apply");
  }
}

/** The New issue dialog. */
export class IssueComposer {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  get dialog() {
    return testId(this.page, "issue-composer");
  }
  /** Values are repository names. */
  get repo() {
    return testId(this.dialog, "issue-repo");
  }
  /** The repositories it can be filed in. */
  get repoChoices() {
    return this.repo.locator("option:not([disabled])");
  }
  get title() {
    return testId(this.dialog, "issue-title");
  }
  get body() {
    return testId(this.dialog, "issue-body");
  }
  get write() {
    return testId(this.dialog, "issue-write");
  }
  /** Shows the preview; `aria-pressed` while it does. */
  get preview() {
    return testId(this.dialog, "issue-preview");
  }
  /** The headings and bold text the preview rendered from the Markdown. */
  get previewHeadings() {
    return testId(this.dialog, "issue-preview-pane").getByRole("heading");
  }
  get previewBold() {
    return testId(this.dialog, "issue-preview-pane").locator("strong");
  }
  get error() {
    return testId(this.dialog, "issue-error");
  }
  get checkGithub() {
    return testId(this.error, "issue-check-github");
  }
  get cancel() {
    return testId(this.dialog, "issue-cancel");
  }
  get create() {
    return testId(this.dialog, "issue-create");
  }
}

/** The Actions view. Runs carry `data-repo`, `data-run-id`, `data-status` and
 * `data-conclusion`; jobs and steps their status and conclusion too. */
export class ActionsView {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  get root() {
    return testId(this.page, "actions-view");
  }
  /** "@login" in the header. */
  get account() {
    return testId(this.page, "actions-account");
  }
  tab(tab: "runs" | "workflows") {
    return testId(testId(this.page, "actions-tabs"), "tab", { tab });
  }

  // ── Run filters ────────────────────────────────────────────────────────────

  /** GitHub's run statuses (failure, success…), "" for all. */
  get status() {
    return testId(this.page, "actions-status");
  }
  /** Days back (7, 30, 90), or "" for all available history. */
  get range() {
    return testId(this.page, "actions-range");
  }
  get branch() {
    return testId(this.page, "actions-branch");
  }
  get event() {
    return testId(this.page, "actions-event");
  }
  /** Applies the branch and event filters. */
  get apply() {
    return testId(this.page, "actions-apply");
  }
  /** "owner/name · workflow" while one workflow's runs show; `data-workflow-id` is which. */
  get workflowFilter() {
    return testId(this.page, "actions-workflow-filter");
  }
  get allWorkflows() {
    return testId(this.page, "actions-all-workflows");
  }
  /** The loaded runs, counted in `data-runs`, `data-active`, `data-failed` and `data-passed`. */
  get summary() {
    return testId(this.page, "actions-summary");
  }

  // ── Runs and workflows ─────────────────────────────────────────────────────

  get runs() {
    return testId(this.page, "actions-list", { tab: "runs" });
  }
  /** A run's row, by its id. */
  run(id: string) {
    return testId(this.runs, "actions-run", { "run-id": id });
  }
  /** Every run's title, in order. */
  get titles() {
    return testId(this.runs, "actions-run-title");
  }
  get workflows() {
    return testId(this.page, "actions-list", { tab: "workflows" });
  }
  /** A workflow, by id; `data-state` is GitHub's (active, disabled_manually…). */
  workflow(id: string) {
    return testId(this.workflows, "actions-workflow", { "workflow-id": id });
  }
  /** Every workflow's name, in order. */
  get workflowNames() {
    return testId(this.workflows, "actions-workflow-name");
  }
  viewRuns(workflow: Locator) {
    return testId(workflow, "actions-workflow-runs");
  }

  // ── The selected run ───────────────────────────────────────────────────────

  get detail() {
    return testId(this.page, "actions-detail");
  }
  get detailTitle() {
    return testId(this.detail, "actions-detail-title");
  }
  /** The run's `data-status`, `data-conclusion` and `data-attempt` (its latest). */
  get detailStatus() {
    return testId(this.detail, "actions-detail-status");
  }
  /** A session on the run's branch. */
  session(sessionId: string) {
    return testId(this.detail, "actions-detail-session", { "session-id": sessionId });
  }
  get attempt() {
    return testId(this.detail, "actions-attempt");
  }
  /** A job of the attempt shown, by name: a `<details>`, `open` while unfolded. */
  job(name: string) {
    return testId(this.detail, "actions-job", { name });
  }
  /** Unfolds and folds a job. */
  jobToggle(job: Locator) {
    return testId(job, "actions-job-summary");
  }
  /** A job's steps: name, status and duration. */
  steps(job: Locator) {
    return testId(job, "actions-step");
  }
  viewLog(job: Locator) {
    return testId(job, "actions-job-log");
  }
  /** Says where a running job's log is until it finishes. */
  liveLog(job: Locator) {
    return testId(job, "actions-job-live");
  }
  get log() {
    return testId(this.detail, "actions-log");
  }
  get logFilter() {
    return testId(this.detail, "actions-log-filter");
  }
  get logTruncated() {
    return testId(this.detail, "actions-log-truncated");
  }
  get logError() {
    return testId(this.detail, "actions-log-error");
  }
  get retryLog() {
    return testId(this.detail, "actions-log-retry");
  }

  // ── Footer ─────────────────────────────────────────────────────────────────

  /** "n / m repositories loaded", or "Loading n / m" while `data-loading`; `data-loaded` and `data-total` are n and m. */
  get sync() {
    return testId(this.page, "actions-sync");
  }
  /** The footer while loading, with `done` of `total` repositories answered. */
  loading(done: number, total: number) {
    return testId(this.page, "actions-sync", { loading: "true", loaded: String(done), total: String(total) });
  }
  /** The footer once loading stopped with `loaded` of `total` repositories answered. */
  synced(loaded: number, total = loaded) {
    return testId(this.page, "actions-sync", { loading: "false", loaded: String(loaded), total: String(total) });
  }
  /** Every repository answered. Each is a fake gh process, so allow for a busy machine. */
  async loaded(repositories: number) {
    await expect(this.synced(repositories)).toBeVisible({ timeout: 30_000 });
  }
  get pause() {
    return testId(this.page, "actions-pause");
  }
  get resume() {
    return testId(this.page, "actions-resume");
  }
}
