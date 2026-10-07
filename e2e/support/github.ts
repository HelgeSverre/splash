// The fake GitHub: the `gh` router's scenario and call log (fakes/gh,
// fakes/gh-router), pull requests on the offline github.com remote
// (support/git.ts), and the GitHub and Actions views.
//
//   test.use({ gh: true });
//   test.beforeEach(async ({ world, page }) => {
//     bareRemote(world, "e2e/demo");   // the project's origin: auto-linked
//     await pinClock(page);            // the scenario's "now"
//   });
//   const gh = new FakeGithub(world);
//   gh.fail(/^graphql pullRequests e2e-labs\/widgets$/, "gh: Not Found (HTTP 404)");
//   expect(gh.graphql(/search/)[0].variables.q).toBe("…");
import { expect, type Page } from "@playwright/test";
import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createPrRef, git, write } from "./git.ts";
import { E2E } from "./paths.ts";
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

/** The GitHub triage view. */
export class GithubView {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  get list() {
    return this.page.getByRole("region", { name: "GitHub activity" });
  }
  /** Rows of the activity list, or the one whose title matches. */
  rows(title?: string | RegExp) {
    const rows = this.list.getByRole("button").filter({ has: this.page.locator(".item-title") });
    return title === undefined ? rows : rows.filter({ has: this.page.locator(".item-title").getByText(title, { exact: true }) });
  }
  get detail() {
    return this.page.getByRole("complementary", { name: "GitHub item details" });
  }
  /** The footer's "n / m feeds loaded". */
  get sync() {
    return this.page.getByRole("status").filter({ hasText: /feeds loaded|^Loading \d/ });
  }
  tab(name: "All activity" | "Needs me" | "Issues" | "PRs" | "Branches") {
    return this.page.getByRole("tablist", { name: "GitHub activity type" }).getByRole("tab", { name, exact: true });
  }
  get repositoriesButton() {
    return this.page.getByRole("button", { name: /^Repositories \d+$/ });
  }
  select(label: string) {
    return this.page.getByRole("combobox", { name: label, exact: true });
  }
  /** Wait until every feed in scope has loaded. */
  async loaded(feeds: number) {
    await expect(this.sync).toHaveText(new RegExp(`^${feeds} / ${feeds} feeds loaded`));
  }
}

/** The Actions view. */
export class ActionsView {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  get runs() {
    return this.page.getByRole("region", { name: "Workflow runs" });
  }
  /** Run rows, or the one with this title. */
  run(title?: string) {
    const rows = this.runs.getByRole("button").filter({ has: this.page.locator(".row-main") });
    return title === undefined ? rows : rows.filter({ has: this.page.locator("strong").getByText(title, { exact: true }) });
  }
  get detail() {
    return this.page.getByRole("complementary", { name: "Workflow run details" });
  }
  get sync() {
    return this.page.getByRole("status").filter({ hasText: /repositories loaded|^Loading \d/ });
  }
  get summary() {
    return this.page.locator(".summary");
  }
  select(label: string) {
    return this.page.getByRole("combobox", { name: label, exact: true });
  }
  async loaded(repositories: number) {
    await expect(this.sync).toHaveText(new RegExp(`^${repositories} / ${repositories} repositories loaded`));
  }
}
