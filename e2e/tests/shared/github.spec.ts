// GitHub triage and Actions through the fake `gh` (fakes/gh): scoping and
// saved views, unread and snooze, search, new issues, working on an issue or a
// pull request, the session's PR, and workflow runs with their jobs and logs.
// The project's origin is github.com/e2e/demo on an offline bare remote.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "../../fixtures.ts";
import { bareRemote, CALC, git, remotePath, status } from "../../support/git.ts";
import { ActionsView, FakeGithub, GithubView, IssueComposer, pinClock, publishPullRequest, RepoPicker } from "../../support/github.ts";
import { Review } from "../../support/views.ts";

test.use({ gh: true });

test.beforeEach(async ({ world, page }) => {
  bareRemote(world, "e2e/demo");
  await pinClock(page);
});

/** "owner/name connection" for each GraphQL feed request. */
const FEED = /repository\(owner:\$owner,name:\$name\) \{ (issues|pullRequests|refs)\(/;
const feeds = (gh: FakeGithub) => gh.graphql(FEED).map((b) => `${b.variables.owner}/${b.variables.name} ${FEED.exec(b.query)![1]}`);

/** Every issue in the triage scenario, newest first, once older pages are loaded. */
const ALL_ISSUES = ["Subtract returns the wrong sign", "Document the add helper", "Widget renders twice", "Crash on empty input", "Support division"];

test("GitHub lists every repository's activity, filtered by owner, link and type", async ({ splash }) => {
  const { app, page, world, db } = splash;
  const gh = new FakeGithub(world);
  const view = new GithubView(page);
  await app.openNav("github");

  await expect(view.account).toHaveText("@octocat");
  await view.loaded(15);
  await expect(view.repositories).toHaveAttribute("data-count", "4");
  await expect(view.count).toHaveAttribute("data-count", "18");
  await expect(view.title(view.item("e2e/demo", 12))).toHaveText("Subtract returns the wrong sign");
  await expect(view.title(view.items({ repo: "e2e/demo", kind: "activity" }).first())).toHaveText("Pushed to main");

  // Repositories come from one paginated, slurped request; each repository's
  // feeds are one REST or GraphQL page each, issues only where enabled.
  expect(gh.rest(/^user\/repos/).map((c) => c.argv)).toEqual([
    [
      "api",
      "--hostname",
      "github.com",
      "user/repos?per_page=100&sort=pushed&direction=desc&affiliation=owner,collaborator,organization_member",
      "--paginate",
      "--slurp",
    ],
  ]);
  expect(feeds(gh).sort()).toEqual(
    [
      "e2e-labs/legacy issues", "e2e-labs/legacy pullRequests", "e2e-labs/legacy refs",
      "e2e-labs/widgets issues", "e2e-labs/widgets pullRequests", "e2e-labs/widgets refs",
      "e2e/demo issues", "e2e/demo pullRequests", "e2e/demo refs",
      "e2e/docs pullRequests", "e2e/docs refs",
    ].sort(),
  );
  expect(gh.rest(/\/events\?/).map((c) => c.argv[3]).sort()).toEqual(
    ["e2e-labs/legacy", "e2e-labs/widgets", "e2e/demo", "e2e/docs"].map((r) => `repos/${r}/events?per_page=30&page=1`).sort(),
  );

  // Older items load on request, from the cursor the first page returned.
  await expect(view.loadMore).toHaveAttribute("data-count", "1");
  await view.loadMore.click();
  await expect(view.item("e2e/demo", 3)).toBeVisible();
  expect(gh.graphql(/issues\(first:30/).filter((b) => b.variables.name === "demo").map((b) => b.variables.cursor)).toEqual([null, "Y3Vyc29yOjM="]);

  const titles = view.titles;
  await view.tab("needs_me").click();
  await expect(titles).toHaveText(["Fix subtract sign", "Bump widget styles", "Subtract returns the wrong sign"]);
  await view.tab("issue").click();
  await expect(titles).toHaveText(ALL_ISSUES);
  await view.itemStatus.selectOption("open");
  await expect(titles).toHaveText(["Subtract returns the wrong sign", "Document the add helper", "Widget renders twice", "Support division"]);
  await view.tab("pull_request").click();
  await view.itemStatus.selectOption("closed");
  await expect(titles).toHaveText(["Add multiply", "Old cleanup"]);
  await view.itemStatus.selectOption("all");

  await view.tab("branch").click();
  await view.owner.selectOption("e2e-labs");
  await expect(view.repositories).toHaveAttribute("data-count", "2");
  await expect(titles).toHaveText(["bump-styles", "main", "main"]);
  await view.linked.click();
  await expect(view.linked).toHaveAttribute("aria-pressed", "true");
  await expect(view.repositories).toHaveAttribute("data-count", "0");
  await expect(view.empty).toContainText("Choose repositories or clear your scope filters.");
  await view.owner.selectOption({ value: "" });
  // Only e2e/demo is the origin of a Splash project.
  await expect(view.repositories).toHaveAttribute("data-count", "1");
  await expect(titles).toHaveText(["main", "fix/subtract-sign", "feat/a"]);
  await expect(view.linkedMark(view.branch("e2e/demo", "feat/a"))).toBeVisible();

  // The scope is a setting: it survives a reload.
  await expect.poll(() => [db.setting("github.owner"), db.setting("github.linked"), db.setting("github.feed")]).toEqual(["", "true", "branch"]);
  await page.reload();
  await app.waitReady();
  await expect(view.tab("branch")).toHaveAttribute("aria-selected", "true");
  await expect(view.linked).toHaveAttribute("aria-pressed", "true");
  await expect(view.repositories).toHaveAttribute("data-count", "1");
  await expect(titles).toHaveText(["main", "fix/subtract-sign", "feat/a"]);
});

test("GitHub opened while Splash is still starting stays open", async ({ splash }) => {
  const { app, page } = splash;
  const view = new GithubView(page);
  // Hold agent detection, the last thing Splash loads at startup.
  let release = () => {};
  const held = new Promise<void>((resolve) => (release = resolve));
  await page.route("**/__cmd/list_agents", async (route) => {
    await held;
    await route.continue();
  });
  await page.reload();
  await app.waitReady();
  await app.openNav("github");
  await expect(view.root).toBeVisible();

  release();
  // Once loaded, the URL follows the open view instead of resetting it.
  await expect(page).toHaveURL(/#\/github$/);
  await expect(view.root).toBeVisible();
  await view.loaded(15);
});

test("the repository picker narrows the scope, and a saved view brings it back", async ({ splash }) => {
  const { app, page, db } = splash;
  const view = new GithubView(page);
  const picker = new RepoPicker(page);
  await app.openNav("github");
  await view.loaded(15);

  await view.repositories.click();
  await expect(picker.checked).toHaveCount(4);
  await picker.clear.click();
  await expect(picker.selected).toHaveAttribute("data-count", "0");
  await picker.filter.fill("e2e/");
  await expect(picker.selectMatches).toHaveAttribute("data-count", "2");
  await picker.selectMatches.click();
  await expect(picker.selected).toHaveAttribute("data-count", "2");
  await picker.repo("e2e/docs").uncheck();
  await expect(picker.selected).toHaveAttribute("data-count", "1");
  await picker.apply.click();
  await expect(picker.dialog).toBeHidden();
  await expect(view.repositories).toHaveAttribute("data-count", "1");
  await view.loaded(4);
  await expect.poll(() => db.setting("github.repositories")).toBe(JSON.stringify(["e2e/demo"]));

  await view.tab("issue").click();
  await view.saveView.click();
  await view.saveName.fill("Demo issues");
  await view.saveSubmit.click();
  await expect(view.saveDialog).toBeHidden();
  await expect(view.currentView).toHaveText("Demo issues");
  // Views belong to the GitHub login.
  const views = () => JSON.parse(db.setting("github.octocat.views") ?? "[]").map((v: any) => [v.name, v.repositories, v.feed]);
  await expect.poll(views).toEqual([["Demo issues", ["e2e/demo"], "issue"]]);

  // Widen the scope again, then restore the view.
  await view.repositories.click();
  await picker.all.click();
  await expect(picker.selected).toHaveAttribute("data-count", "4");
  await picker.apply.click();
  await view.tab("all").click();
  await expect(view.repositories).toHaveAttribute("data-count", "4");
  await view.savedView.selectOption({ value: "" });
  await view.savedView.selectOption({ label: "Demo issues" });
  await expect(view.repositories).toHaveAttribute("data-count", "1");
  await expect(view.tab("issue")).toHaveAttribute("aria-selected", "true");
  await expect(view.titles).toHaveText(["Subtract returns the wrong sign", "Document the add helper", "Crash on empty input"]);

  await view.deleteView.click();
  await expect(view.savedViews).toHaveCount(0);
  await expect.poll(views).toEqual([]);
});

test("a feed that fails is reported, and retrying it fills the gap", async ({ splash }) => {
  const { app, page, world } = splash;
  const gh = new FakeGithub(world);
  gh.fail(/^graphql pullRequests e2e-labs\/widgets$/, "gh: Not Found (HTTP 404)");
  const view = new GithubView(page);
  await app.openNav("github");

  await expect(view.synced(14, 15)).toBeVisible();
  await expect(view.failures).toHaveAttribute("data-count", "1");
  await view.failuresSummary.click();
  const failure = view.failure("e2e-labs/widgets", "pull_request");
  await expect(failure).toBeVisible();
  await expect(failure).toContainText("HTTP 404");
  await expect(view.item("e2e-labs/widgets", 4)).toBeVisible();
  await expect(view.item("e2e-labs/widgets", 8)).toHaveCount(0);

  gh.heal();
  await view.retryFailures.click();
  await view.loaded(15);
  await expect(view.failures).toHaveCount(0);
  await expect(view.item("e2e-labs/widgets", 8)).toBeVisible();
  expect(feeds(gh).filter((f) => f === "e2e-labs/widgets pullRequests")).toHaveLength(2);
});

test("items are marked read or unread, and snoozed until tomorrow or new activity", async ({ splash }) => {
  const { app, page, world, db } = splash;
  const gh = new FakeGithub(world);
  const view = new GithubView(page);
  await app.openNav("github");
  await view.loaded(15);
  const unread = view.unread();
  // What was already on GitHub when Splash first looked counts as read.
  await expect(unread).toHaveCount(0);

  const issue = view.item("e2e/demo", 12);
  await issue.click();
  await expect(issue).toHaveAttribute("aria-pressed", "true");
  await expect(view.detailTitle).toHaveText("Subtract returns the wrong sign");
  await expect(view.comments).toContainText(["I'll take this one."]);
  await expect(view.readToggle).toHaveAttribute("data-unread", "false");
  await view.readToggle.click();
  await expect(view.unread(issue)).toBeVisible();
  await expect(unread).toHaveCount(1);
  await expect(view.readToggle).toHaveAttribute("data-unread", "true");
  await view.readToggle.click();
  await expect(unread).toHaveCount(0);

  // Until tomorrow at 9: out of the inbox, under Snoozed.
  await view.snooze.selectOption("tomorrow");
  await expect(issue).toHaveCount(0);
  await view.inboxFilter.selectOption("snoozed");
  await expect(view.titles).toHaveText(["Subtract returns the wrong sign"]);
  await view.inboxFilter.selectOption("all");
  await expect(issue).toBeVisible();
  await view.inboxFilter.selectOption("inbox");
  await expect(issue).toHaveCount(0);
  const marks = () => JSON.parse(db.setting("github.octocat.inbox") ?? "{}").marks ?? {};
  await expect.poll(() => marks()["e2e/demo:I_e2e/demo_12"]?.snooze?.until).toBe(Date.parse("2026-10-08T09:00:00Z"));

  // Until new activity.
  const pull = view.item("e2e/demo", 7);
  await pull.click();
  await view.snooze.selectOption("activity");
  await expect(pull).toHaveCount(0);

  // The next morning the issue is back; the pull request still sleeps.
  await page.clock.fastForward("22:00:00");
  await expect(issue).toBeVisible();
  await expect(pull).toHaveCount(0);

  // A new commit on the pull request wakes it, unread.
  gh.update((s) => {
    FakeGithub.repo(s, "e2e/demo").pulls!.find((p) => p.number === 7)!.updated = "2026-10-08T09:30:00Z";
  });
  await view.refresh.click();
  await expect(view.unread(pull)).toBeVisible();
  await expect(unread).toHaveCount(1);
  await view.markAllRead.click();
  await expect(unread).toHaveCount(0);
});

test("Search GitHub sends the text literally, with the scope and qualifiers as fields", async ({ splash }) => {
  const { app, page, world } = splash;
  const gh = new FakeGithub(world);
  const view = new GithubView(page);
  const titles = view.titles;
  const searches = () => gh.graphql(/search\(type:ISSUE/).map((b) => b.variables);
  await app.openNav("github");
  await view.loaded(15);

  await view.owner.selectOption("e2e");
  await view.searchSource.selectOption("github");
  await view.tab("issue").click();
  await view.search.fill("wrong sign");
  await view.author.fill("hubot");
  await view.assignee.fill("@me");
  await view.label.fill("bug");
  await view.itemStatus.selectOption("open");
  await view.searchGithub.click();
  // The router also returns an issue from outside the scope; Splash drops it.
  await expect(titles).toHaveText(["Subtract returns the wrong sign"]);
  expect(searches()).toEqual([
    { q: 'repo:e2e/demo is:issue sort:updated-desc "wrong" "sign" author:"hubot" assignee:"@me" label:"bug" is:open', cursor: null },
  ]);

  // A review filter searches pull requests.
  for (const field of [view.search, view.author, view.assignee, view.label]) await field.fill("");
  await view.itemStatus.selectOption("all");
  await view.owner.selectOption({ value: "" });
  await view.review.selectOption("requested");
  await expect(view.tab("pull_request")).toHaveAttribute("aria-selected", "true");
  await view.searchGithub.click();
  await expect(titles).toHaveText(["Bump widget styles"]);
  expect(searches().at(-1)).toEqual({
    q: "repo:e2e-labs/legacy repo:e2e-labs/widgets repo:e2e/demo repo:e2e/docs is:pr sort:updated-desc review-requested:@me",
    cursor: null,
  });

  // Pages continue from GitHub's cursor; a slow search can be paused.
  gh.delay(/^graphql search/, 3);
  await view.tab("issue").click();
  await view.searchGithub.click();
  await view.pause.click();
  gh.update((s) => (s.delays = []));
  await view.resumeSearch.click();
  await expect(titles).toHaveText(["Subtract returns the wrong sign", "Document the add helper", "Widget renders twice"]);
  await expect(view.loadMore).toHaveAttribute("data-count", "1");
  await view.loadMore.click();
  await expect(titles).toHaveText(ALL_ISSUES);
  expect(searches().at(-1)).toEqual({ q: "repo:e2e-labs/legacy repo:e2e-labs/widgets repo:e2e/demo is:issue sort:updated-desc", cursor: "Y3Vyc29yOjM=" });
});

test("a new issue is previewed, kept as a draft, and sent to GitHub as literal JSON", async ({ splash }) => {
  const { app, page, world } = splash;
  const gh = new FakeGithub(world);
  const view = new GithubView(page);
  const issue = new IssueComposer(page);
  await app.openNav("github");
  await view.loaded(15);

  // Starts in the selected item's repository.
  await view.item("e2e-labs/widgets", 4).click();
  await view.newIssue.click();
  await expect(issue.repo).toHaveValue("e2e-labs/widgets");
  // Not e2e/docs (issues are off) nor the archived e2e-labs/legacy.
  await expect(issue.repoChoices).toHaveText(["e2e/demo", "e2e-labs/widgets"]);
  await issue.repo.selectOption("e2e/demo");
  const title = 'Negative results: $(touch pwned) `uname` "quoted"';
  const body = "## Steps\n\n- [ ] call `subtract(2, 3)`\n\n**Expected** -1 & <b>not</b> 1";
  await issue.title.fill(title);
  await issue.body.fill(body);
  await issue.preview.click();
  await expect(issue.preview).toHaveAttribute("aria-pressed", "true");
  await expect(issue.previewHeadings).toHaveText(["Steps"]);
  await expect(issue.previewBold).toHaveText(["Expected"]);

  // Closing keeps the draft.
  await issue.cancel.click();
  await expect(issue.dialog).toBeHidden();
  await view.newIssue.click();
  await expect(issue.repo).toHaveValue("e2e/demo");
  await expect(issue.title).toHaveValue(title);
  await expect(issue.body).toHaveValue(body);

  // GitHub refuses: the draft stays, with a way to check GitHub.
  gh.fail(/^repos\/e2e\/demo\/issues$/, "gh: Resource not accessible by integration (HTTP 403)");
  await issue.create.click();
  await expect(issue.error).toContainText("HTTP 403");
  await expect(issue.checkGithub).toBeVisible();
  await expect(issue.title).toHaveValue(title);

  gh.heal();
  await issue.create.click();
  await expect(issue.dialog).toBeHidden();
  await expect(app.ui.toasts.filter({ hasText: "Created e2e/demo #42" })).toBeVisible();
  // The issue went to gh as JSON on stdin, never as arguments.
  const created = gh.rest(/^repos\/e2e\/demo\/issues$/);
  expect(created.map((c) => c.argv)).toEqual(Array(2).fill(["api", "--hostname", "github.com", "repos/e2e/demo/issues", "--input", "-"]));
  expect(JSON.parse(created[1].stdin)).toEqual({ title, body });
  expect(existsSync(join(world.root, "pwned"))).toBe(false);
  // It tops the list, selected.
  await expect(view.title(view.items().first())).toHaveText(title);
  await expect(view.item("e2e/demo", 42)).toHaveAttribute("aria-pressed", "true");
  await expect(view.detailTitle).toHaveText(title);

  await view.newIssue.click();
  await expect(issue.title).toHaveValue("");
});

test("working on an issue drafts it into a new session", async ({ splash }) => {
  const { app, page, world, db } = splash;
  const view = new GithubView(page);
  await app.openNav("github");
  await view.loaded(15);

  await view.item("e2e/demo", 12).click();
  // e2e/demo is the project's origin.
  await expect(view.detailProject(world.repo)).toBeVisible();
  await view.workOnThis.click();
  await expect(app.dialogContext).toHaveText("e2e/demo #12: Subtract returns the wrong sign");
  await expect(app.dialogChoice("project", db.projects()[0].id)).toBeChecked();
  await expect(app.dialogPrHead).toHaveCount(0);
  await app.dialogChoice("where", "in_place").click();
  await app.dialogStart.click();
  await expect(app.newSessionDialog).toBeHidden();

  const id = await app.sessionId();
  await app.expectStatus("idle");
  await expect(app.title).toHaveText("Subtract returns the wrong sign");
  await expect(app.composer).toHaveValue(
    "Work on e2e/demo #12: Subtract returns the wrong sign\nhttps://github.com/e2e/demo/issues/12\n\n" +
      "`subtract(2, 3)` returns `1`; it should be `-1`.\n\nSeen in **calc.py**.",
  );
  // Nothing is sent until the user sends it.
  expect(world.agents.requests("claude", "session/prompt")).toEqual([]);
  expect(db.session(id)).toMatchObject({ title: "Subtract returns the wrong sign", isolation: "in_place" });
  await expect.poll(() => db.setting(`session.github.${id}`)).toBe("https://github.com/e2e/demo/issues/12");

  // The item lists its session.
  await app.openNav("github");
  await view.item("e2e/demo", 12).click();
  await expect(view.detailSession(id)).toHaveAttribute("data-match", "item");
});

test.describe("a pull request", () => {
  let head = "";
  test.beforeEach(({ world }) => {
    head = publishPullRequest(world, remotePath(world, "e2e/demo"), {
      number: 7,
      branch: "fix/subtract-sign",
      message: "Add negate",
      files: { "calc.py": `${CALC}\n\ndef negate(a):\n    return -a\n` },
    });
  });

  test("work on this starts a worktree at the pull request's head", async ({ splash }) => {
    const { app, page, world, db } = splash;
    const gh = new FakeGithub(world);
    const env = world.env();
    const view = new GithubView(page);
    const before = git(world.repo, env, "rev-parse", "HEAD");
    expect(() => git(world.repo, env, "cat-file", "-e", head)).toThrow();
    await app.openNav("github");
    await view.loaded(15);

    await view.tab("pull_request").click();
    await view.item("e2e/demo", 7).click();
    await view.workOnThis.click();
    await expect(app.dialogPrHead).toBeChecked();
    await expect(app.dialogPrHead).toHaveAccessibleName("Start a new worktree from PR #7 (fix/subtract-sign)");
    await expect(app.dialogChoices("where")).toHaveCount(0);
    await app.dialogStart.click();
    await expect(app.newSessionDialog).toBeHidden();

    const id = await app.sessionId();
    await app.expectStatus("idle");
    const row = db.session(id)!;
    expect(row).toMatchObject({ isolation: "worktree", base_sha: head, title: "Fix subtract sign" });
    expect(row.branch).toMatch(/^splash\/fix-subtract-sign-[a-z0-9]{6}$/);
    expect(git(row.cwd, env, "rev-parse", "HEAD")).toBe(head);
    expect(readFileSync(join(row.cwd, "calc.py"), "utf8")).toContain("def negate");
    await expect(app.composer).toHaveValue("Work on e2e/demo #7: Fix subtract sign\nhttps://github.com/e2e/demo/pull/7\n\nFixes #12.");

    // Fetched from GitHub into a temporary ref, now gone; the project's own checkout is untouched.
    expect(gh.ssh()).toContain("git-upload-pack e2e/demo.git");
    expect(git(world.repo, env, "for-each-ref", "refs/splash")).toBe("");
    expect(git(world.repo, env, "rev-parse", "HEAD")).toBe(before);
    expect(git(world.repo, env, "branch", "--show-current")).toBe("main");
    expect(status(world.repo, env)).toBe("");
  });
});

test("a pull request from a repository without its checkout cannot start a worktree", async ({ splash }) => {
  const { app, page, world, db } = splash;
  const view = new GithubView(page);
  await app.openNav("github");
  await view.loaded(15);

  await view.item("e2e-labs/widgets", 8).click();
  await expect(view.noProject).toBeVisible();
  await view.linkProject.click();
  await view.linkChoice(world.repo).click();
  await expect(view.linkDialog).toBeHidden();
  await expect(view.detailProject(world.repo)).toBeVisible();
  await expect(view.linkProject).toHaveText("Link another project…");
  await expect.poll(() => db.setting("github.link.e2e-labs/widgets")).toBe(JSON.stringify([db.projects()[0].id]));

  // Linked by hand, but the project's origin is e2e/demo: the PR head cannot be fetched.
  await view.workOnThis.click();
  await expect(app.dialogChoice("project", db.projects()[0].id)).toBeChecked();
  await app.dialogStart.click();
  await expect(
    app.ui.toasts.filter({ hasText: "This project has no GitHub remote matching the pull request. Link the matching local checkout first." }),
  ).toBeVisible();
  await expect(app.newSessionDialog).toBeVisible();
  expect(db.sessions()).toEqual([]);
});

test("a session's pull request shows in its header and review panel", async ({ splash }) => {
  const { app, page, world, db } = splash;
  const gh = new FakeGithub(world);
  // Slow enough for the UI to see the turn run.
  world.agents.speed("claude", 10);
  const id = await app.newSession({ where: "worktree" });
  const { branch, cwd } = db.session(id)!;
  await expect(app.repoLink).toHaveText("github.com/e2e/demo");
  await expect(app.repoLink).toHaveAttribute("title", "https://github.com/e2e/demo");
  await expect(app.pullRequest).toHaveCount(0);

  // The agent's branch gets a pull request; Splash looks again when it sees a turn end.
  gh.update((s) =>
    FakeGithub.repo(s, "e2e/demo").pulls!.push({
      number: 15,
      title: "Teach subtract about signs",
      state: "OPEN",
      updated: "2026-10-07T11:30:00Z",
      author: "octocat",
      branch: branch!,
    }),
  );
  await app.send("What does subtract do?");
  await app.expectStatus("running");
  await expect(app.entries("turn_end")).toBeVisible();
  await expect(app.pullRequest).toHaveAttribute("data-number", "15");
  await expect(app.pullRequest).toHaveAttribute("data-state", "open");
  await expect(app.pullRequest).toHaveAttribute("title", "Teach subtract about signs");
  await app.sideTab("review").click();
  await expect(new Review(page).openPullRequest).toHaveAttribute("data-number", "15");
  expect(gh.calls().filter((c) => c.argv[0] === "pr").at(-1)).toEqual({
    argv: ["pr", "view", branch, "--json", "number,url,state,title"],
    stdin: "",
    cwd,
  });
});

/** The default time range: runs created in the 30 days before the pinned clock. */
const LAST_30_DAYS = String.raw`created=%3E%3D2026-09-07T12%3A0\d%3A\d\d\.\d{3}Z`;

test("Actions lists runs across the scope and filters them on GitHub", async ({ splash }) => {
  const { app, page, world } = splash;
  const gh = new FakeGithub(world);
  const actions = new ActionsView(page);
  const titles = actions.titles;
  /** The latest runs request for e2e/demo. */
  const demoRuns = () => gh.rest(/^repos\/e2e\/demo\/actions\/(workflows\/\d+\/)?runs\?/).at(-1)?.argv[3];

  // A slow repository can be paused and resumed.
  gh.delay(/^repos\/e2e-labs\/widgets\/actions\/runs\?/, 4);
  await app.openNav("actions");
  await expect(actions.account).toHaveText("@octocat");
  await expect(actions.loading(3, 4)).toBeVisible();
  await actions.pause.click();
  await expect(actions.synced(3, 4)).toBeVisible();
  gh.update((s) => (s.delays = []));
  await actions.resume.click();
  await actions.loaded(4);

  for (const [count, n] of Object.entries({ runs: 4, active: 1, failed: 1, passed: 2 }))
    await expect(actions.summary).toHaveAttribute(`data-${count}`, String(n));
  await expect(titles).toHaveText(["Try feature a", "Fix subtract sign", "Bump widget styles", "Initial commit"]);
  expect(demoRuns()).toMatch(new RegExp(`^repos/e2e/demo/actions/runs\\?per_page=30&page=1&${LAST_30_DAYS}$`));

  // Status, branch and event filters go to GitHub, encoded.
  await actions.status.selectOption("failure");
  await expect(titles).toHaveText(["Fix subtract sign"]);
  await actions.branch.fill("fix/subtract-sign");
  await actions.event.fill("pull_request");
  await actions.apply.click();
  await expect
    .poll(demoRuns)
    .toMatch(new RegExp(`^repos/e2e/demo/actions/runs\\?per_page=30&page=1&status=failure&branch=fix%2Fsubtract-sign&event=pull_request&${LAST_30_DAYS}$`));
  await expect(titles).toHaveText(["Fix subtract sign"]);

  await actions.status.selectOption("success");
  await actions.branch.fill("");
  await actions.event.fill("");
  await actions.apply.click();
  await actions.range.selectOption({ value: "" });
  await expect(titles).toHaveText(["Bump widget styles", "Initial commit", "Release v0.1.0"]);
  await expect.poll(demoRuns).toBe("repos/e2e/demo/actions/runs?per_page=30&page=1&status=success");

  // A workflow's own runs.
  await actions.tab("workflows").click();
  await expect(actions.workflowNames).toHaveText(["Widgets CI", "CI", "Release"]);
  await expect(actions.workflow("102")).toHaveAttribute("data-state", "disabled_manually");
  await actions.viewRuns(actions.workflow("101")).click();
  await expect(actions.tab("runs")).toHaveAttribute("aria-selected", "true");
  await expect(actions.workflowFilter).toHaveText("e2e/demo · CI");
  await expect(titles).toHaveText(["Try feature a", "Fix subtract sign", "Initial commit"]);
  await expect.poll(demoRuns).toBe("repos/e2e/demo/actions/workflows/101/runs?per_page=30&page=1");
  await actions.allWorkflows.click();
  await expect(titles).toHaveText(["Try feature a", "Fix subtract sign", "Bump widget styles", "Initial commit", "Release v0.1.0"]);
});

test("a run shows its jobs per attempt, plain-text logs, and the sessions on its branch", async ({ splash }) => {
  const { app, page, world } = splash;
  const gh = new FakeGithub(world);
  const actions = new ActionsView(page);
  // A session in place on feat/a, where a run is in progress.
  git(world.repo, world.env(), "checkout", "-q", "-b", "feat/a");
  const session = await app.newSession({ where: "in_place" });
  await app.prompt("What does subtract do?");
  await app.openNav("actions");
  await actions.loaded(4);

  // The newest run is selected: still running, so its log is not ready.
  await expect(actions.run("9003")).toHaveAttribute("aria-pressed", "true");
  await expect(actions.detailTitle).toHaveText("Try feature a");
  await expect(actions.detailStatus).toHaveAttribute("data-status", "in_progress");
  await expect(actions.detailStatus).toHaveAttribute("data-attempt", "1");
  const job = (name: string) => actions.job(name);
  await actions.jobToggle(job("test")).click();
  await expect(actions.viewLog(job("test"))).toBeDisabled();
  await expect(actions.liveLog(job("test"))).toContainText("Live logs are available on GitHub.");
  await actions.session(session).click();
  await expect(app.title).toHaveText("What does subtract do?");
  await app.openNav("actions");

  await actions.run("9002").click();
  await expect(actions.detailStatus).toHaveAttribute("data-conclusion", "failure");
  await expect(actions.detailStatus).toHaveAttribute("data-attempt", "2");
  await expect(actions.attempt).toHaveValue("2");
  await expect(actions.session(session)).toHaveCount(0);
  // The failed job is open, the rest folded.
  await expect(job("test")).toHaveAttribute("open", "");
  await expect(job("lint")).not.toHaveAttribute("open");
  await expect(actions.steps(job("test"))).toHaveText([/^Set up job\s*success/, /^Run tests\s*failure/]);
  expect(gh.rest(/\/jobs\?/).map((c) => c.argv[3])).toContain("repos/e2e/demo/actions/runs/9002/attempts/2/jobs?per_page=100&page=1");

  // Logs are plain text: escape sequences stripped, markup shown literally.
  await actions.viewLog(job("test")).click();
  const log = actions.log;
  await expect(log).toContainText("FAILED test_calc.py::test_subtract - assert 1 == -1");
  await expect(log).toContainText('<script>document.title = "e2e-injected"</script>');
  await expect(log).toContainText("python -m pytest\n");
  expect(await log.textContent()).not.toMatch(/\x1b|\[\d+;1m/);
  await expect(page).not.toHaveTitle("e2e-injected");
  // gh is asked whether it can pass escape sequences through first.
  const logCalls = gh.calls().filter((c) => c.argv[1] === "--help" || c.argv.at(-1)!.endsWith("/logs"));
  expect(logCalls.map((c) => c.argv)).toEqual([
    ["api", "--help"],
    ["api", "--allow-escape-sequences", "--hostname", "github.com", "repos/e2e/demo/actions/jobs/7002/logs"],
  ]);
  await actions.logFilter.fill("failed");
  await expect(log).toHaveText("2026-10-06T16:14:18.0000000Z FAILED test_calc.py::test_subtract - assert 1 == -1");
  await actions.logFilter.fill("no such line");
  await expect(log).toHaveText("No matching lines.");

  // A log over 512 KiB is cut short.
  await actions.jobToggle(job("build")).click();
  await actions.viewLog(job("build")).click();
  await expect(actions.logTruncated).toHaveText("Showing the first 512 KiB. Open the full job on GitHub for the rest.");
  await expect(log).toContainText("building wheel for calc");

  // The first attempt failed earlier, and its log has expired.
  await actions.attempt.selectOption("1");
  await expect(actions.steps(job("test"))).toHaveText([/^Set up job/, /^Install dependencies\s*failure/]);
  expect(gh.rest(/\/jobs\?/).map((c) => c.argv[3])).toContain("repos/e2e/demo/actions/runs/9002/attempts/1/jobs?per_page=100&page=1");
  await actions.viewLog(job("test")).click();
  await expect(actions.logError).toContainText("HTTP 410");
  await expect(actions.retryLog).toBeVisible();
});
