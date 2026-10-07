// GitHub triage and Actions through the fake `gh` (fakes/gh): scoping and
// saved views, unread and snooze, search, new issues, working on an issue or a
// pull request, the session's PR, and workflow runs with their jobs and logs.
// The project's origin is github.com/e2e/demo on an offline bare remote.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "../../fixtures.ts";
import { bareRemote, CALC, git, remotePath, status } from "../../support/git.ts";
import { ActionsView, FakeGithub, GithubView, pinClock, publishPullRequest } from "../../support/github.ts";

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
  await app.openNav("GitHub");

  await expect(page.getByText("@octocat")).toBeVisible();
  await view.loaded(15);
  await expect(view.repositoriesButton).toHaveText("Repositories 4");
  await expect(view.list).toContainText("18 loaded items");
  await expect(view.rows("Subtract returns the wrong sign")).toBeVisible();
  await expect(view.rows("Pushed to main")).toBeVisible();

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
  await view.list.getByRole("button", { name: "Load more (1 feeds)" }).click();
  await expect(view.rows("Support division")).toBeVisible();
  expect(gh.graphql(/issues\(first:30/).filter((b) => b.variables.name === "demo").map((b) => b.variables.cursor)).toEqual([null, "Y3Vyc29yOjM="]);

  const titles = view.rows().locator(".item-title");
  await view.tab("Needs me").click();
  await expect(titles).toHaveText(["Fix subtract sign", "Bump widget styles", "Subtract returns the wrong sign"]);
  await view.tab("Issues").click();
  await expect(titles).toHaveText(ALL_ISSUES);
  await view.select("Item status").selectOption("Open");
  await expect(titles).toHaveText(["Subtract returns the wrong sign", "Document the add helper", "Widget renders twice", "Support division"]);
  await view.tab("PRs").click();
  await view.select("Item status").selectOption("Closed / merged");
  await expect(titles).toHaveText(["Add multiply", "Old cleanup"]);
  await view.select("Item status").selectOption("All states");

  await view.tab("Branches").click();
  await view.select("GitHub owner").selectOption("e2e-labs");
  await expect(view.repositoriesButton).toHaveText("Repositories 2");
  await expect(titles).toHaveText(["bump-styles", "main", "main"]);
  const linked = page.getByRole("button", { name: "Linked to Splash" });
  await linked.click();
  await expect(linked).toHaveAttribute("aria-pressed", "true");
  await expect(view.repositoriesButton).toHaveText("Repositories 0");
  await expect(view.list).toContainText("Choose repositories or clear your scope filters.");
  await view.select("GitHub owner").selectOption("All owners");
  // Only e2e/demo is the origin of a Splash project.
  await expect(view.repositoriesButton).toHaveText("Repositories 1");
  await expect(titles).toHaveText(["main", "fix/subtract-sign", "feat/a"]);
  await expect(view.rows("feat/a").getByTitle("Linked to a Splash project")).toBeVisible();

  // The scope is a setting: it survives a reload.
  await expect.poll(() => [db.setting("github.owner"), db.setting("github.linked"), db.setting("github.feed")]).toEqual(["", "true", "branch"]);
  await page.reload();
  await app.waitReady();
  await expect(view.tab("Branches")).toHaveAttribute("aria-selected", "true");
  await expect(linked).toHaveAttribute("aria-pressed", "true");
  await expect(view.repositoriesButton).toHaveText("Repositories 1");
  await expect(titles).toHaveText(["main", "fix/subtract-sign", "feat/a"]);
});

test("GitHub opened while Splash is still starting stays open", async ({ splash }) => {
  const { app, page } = splash;
  // Hold agent detection, the last thing Splash loads at startup.
  let release = () => {};
  const held = new Promise<void>((resolve) => (release = resolve));
  await page.route("**/__cmd/list_agents", async (route) => {
    await held;
    await route.continue();
  });
  await page.reload();
  await app.waitReady();
  await app.openNav("GitHub");
  await expect(page.getByRole("heading", { name: "GitHub", exact: true })).toBeVisible();

  release();
  // Once loaded, the URL follows the open view instead of resetting it.
  await expect(page).toHaveURL(/#\/github$/);
  await expect(page.getByRole("heading", { name: "GitHub", exact: true })).toBeVisible();
  await new GithubView(page).loaded(15);
});

test("the repository picker narrows the scope, and a saved view brings it back", async ({ splash }) => {
  const { app, page, db } = splash;
  const view = new GithubView(page);
  const titles = view.rows().locator(".item-title");
  await app.openNav("GitHub");
  await view.loaded(15);

  await view.repositoriesButton.click();
  const picker = page.getByRole("dialog", { name: "Choose GitHub repositories" });
  await expect(picker.getByRole("checkbox", { checked: true })).toHaveCount(4);
  await picker.getByRole("button", { name: "Clear all" }).click();
  await expect(picker).toContainText("0 selected");
  await picker.getByRole("textbox", { name: "Find a repository across all owners…" }).fill("e2e/");
  await picker.getByRole("button", { name: "Select matches (2)" }).click();
  await expect(picker).toContainText("2 selected");
  await picker.getByRole("checkbox", { name: /^e2e\/docs/ }).uncheck();
  await expect(picker).toContainText("1 selected");
  await picker.getByRole("button", { name: "Apply scope" }).click();
  await expect(picker).toBeHidden();
  await expect(view.repositoriesButton).toHaveText("Repositories 1");
  await view.loaded(4);
  await expect.poll(() => db.setting("github.repositories")).toBe(JSON.stringify(["e2e/demo"]));

  await view.tab("Issues").click();
  await page.getByRole("button", { name: "Save view…" }).click();
  const save = page.getByRole("dialog", { name: "Save GitHub view" });
  await save.getByLabel("View name").fill("Demo issues");
  await save.getByRole("button", { name: "Save" }).click();
  await expect(save).toBeHidden();
  await expect(view.select("Saved view").locator("option:checked")).toHaveText("Demo issues");
  // Views belong to the GitHub login.
  const views = () => JSON.parse(db.setting("github.octocat.views") ?? "[]").map((v: any) => [v.name, v.repositories, v.feed]);
  await expect.poll(views).toEqual([["Demo issues", ["e2e/demo"], "issue"]]);

  // Widen the scope again, then restore the view.
  await view.repositoriesButton.click();
  await picker.getByRole("button", { name: "All repositories" }).click();
  await expect(picker).toContainText("4 selected");
  await picker.getByRole("button", { name: "Apply scope" }).click();
  await view.tab("All activity").click();
  await expect(view.repositoriesButton).toHaveText("Repositories 4");
  await view.select("Saved view").selectOption("Custom view");
  await view.select("Saved view").selectOption("Demo issues");
  await expect(view.repositoriesButton).toHaveText("Repositories 1");
  await expect(view.tab("Issues")).toHaveAttribute("aria-selected", "true");
  await expect(titles).toHaveText(["Subtract returns the wrong sign", "Document the add helper", "Crash on empty input"]);

  await page.getByRole("button", { name: "Delete view" }).click();
  await expect(view.select("Saved view").locator("option")).toHaveText(["Custom view"]);
  await expect.poll(views).toEqual([]);
});

test("a feed that fails is reported, and retrying it fills the gap", async ({ splash }) => {
  const { app, page, world } = splash;
  const gh = new FakeGithub(world);
  gh.fail(/^graphql pullRequests e2e-labs\/widgets$/, "gh: Not Found (HTTP 404)");
  const view = new GithubView(page);
  await app.openNav("GitHub");

  await expect(view.sync).toHaveText(/^14 \/ 15 feeds loaded/);
  const failures = page.locator("details", { hasText: "1 GitHub feed failed. Results may be incomplete." });
  await failures.getByText("1 GitHub feed failed").click();
  await expect(failures).toContainText("e2e-labs/widgets · pull request");
  await expect(failures).toContainText("HTTP 404");
  await expect(view.rows("Widget renders twice")).toBeVisible();
  await expect(view.rows("Bump widget styles")).toHaveCount(0);

  gh.heal();
  await failures.getByRole("button", { name: "Retry failed requests" }).click();
  await view.loaded(15);
  await expect(failures).toHaveCount(0);
  await expect(view.rows("Bump widget styles")).toBeVisible();
  expect(feeds(gh).filter((f) => f === "e2e-labs/widgets pullRequests")).toHaveLength(2);
});

test("items are marked read or unread, and snoozed until tomorrow or new activity", async ({ splash }) => {
  const { app, page, world, db } = splash;
  const gh = new FakeGithub(world);
  const view = new GithubView(page);
  await app.openNav("GitHub");
  await view.loaded(15);
  const unread = view.list.getByRole("img", { name: "Unread" });
  // What was already on GitHub when Splash first looked counts as read.
  await expect(unread).toHaveCount(0);

  const issue = view.rows("Subtract returns the wrong sign");
  await issue.click();
  await expect(issue).toHaveAttribute("aria-pressed", "true");
  await expect(view.detail.getByRole("heading", { name: "Subtract returns the wrong sign" })).toBeVisible();
  await expect(view.detail).toContainText("I'll take this one.");
  await view.detail.getByRole("button", { name: "Mark unread" }).click();
  await expect(issue.getByRole("img", { name: "Unread" })).toBeVisible();
  await expect(unread).toHaveCount(1);
  await view.detail.getByRole("button", { name: "Mark read" }).click();
  await expect(unread).toHaveCount(0);

  // Until tomorrow at 9: out of the inbox, under Snoozed.
  await view.detail.getByRole("combobox", { name: "Snooze item" }).selectOption("Until tomorrow at 9");
  await expect(issue).toHaveCount(0);
  await view.select("Inbox filter").selectOption("Snoozed");
  await expect(view.rows().locator(".item-title")).toHaveText(["Subtract returns the wrong sign"]);
  await view.select("Inbox filter").selectOption("Include snoozed");
  await expect(issue).toBeVisible();
  await view.select("Inbox filter").selectOption("Inbox");
  await expect(issue).toHaveCount(0);
  const marks = () => JSON.parse(db.setting("github.octocat.inbox") ?? "{}").marks ?? {};
  await expect.poll(() => marks()["e2e/demo:I_e2e/demo_12"]?.snooze?.until).toBe(Date.parse("2026-10-08T09:00:00Z"));

  // Until new activity.
  const pull = view.rows("Fix subtract sign");
  await pull.click();
  await view.detail.getByRole("combobox", { name: "Snooze item" }).selectOption("Until new activity");
  await expect(pull).toHaveCount(0);

  // The next morning the issue is back; the pull request still sleeps.
  await page.clock.fastForward("22:00:00");
  await expect(issue).toBeVisible();
  await expect(pull).toHaveCount(0);

  // A new commit on the pull request wakes it, unread.
  gh.update((s) => {
    FakeGithub.repo(s, "e2e/demo").pulls!.find((p) => p.number === 7)!.updated = "2026-10-08T09:30:00Z";
  });
  await page.getByRole("button", { name: "Refresh GitHub" }).click();
  await expect(pull.getByRole("img", { name: "Unread" })).toBeVisible();
  await expect(unread).toHaveCount(1);
  await page.getByRole("button", { name: "Mark loaded read" }).click();
  await expect(unread).toHaveCount(0);
});

test("Search GitHub sends the text literally, with the scope and qualifiers as fields", async ({ splash }) => {
  const { app, page, world } = splash;
  const gh = new FakeGithub(world);
  const view = new GithubView(page);
  const titles = view.rows().locator(".item-title");
  const searches = () => gh.graphql(/search\(type:ISSUE/).map((b) => b.variables);
  await app.openNav("GitHub");
  await view.loaded(15);

  await view.select("GitHub owner").selectOption("e2e");
  await view.select("Search source").selectOption("Search GitHub");
  await view.tab("Issues").click();
  await page.getByRole("textbox", { name: "Search GitHub items" }).fill("wrong sign");
  await page.getByRole("textbox", { name: "Author", exact: true }).fill("hubot");
  await page.getByRole("textbox", { name: "Assignee", exact: true }).fill("@me");
  await page.getByRole("textbox", { name: "Label", exact: true }).fill("bug");
  await view.select("Item status").selectOption("Open");
  await page.getByRole("button", { name: "Search GitHub" }).click();
  // The router also returns an issue from outside the scope; Splash drops it.
  await expect(titles).toHaveText(["Subtract returns the wrong sign"]);
  expect(searches()).toEqual([
    { q: 'repo:e2e/demo is:issue sort:updated-desc "wrong" "sign" author:"hubot" assignee:"@me" label:"bug" is:open', cursor: null },
  ]);

  // A review filter searches pull requests.
  for (const field of ["Search GitHub items", "Author", "Assignee", "Label"]) await page.getByRole("textbox", { name: field, exact: true }).fill("");
  await view.select("Item status").selectOption("All states");
  await view.select("GitHub owner").selectOption("All owners");
  await view.select("Review status").selectOption("Review requested from me");
  await expect(view.tab("PRs")).toHaveAttribute("aria-selected", "true");
  await page.getByRole("button", { name: "Search GitHub" }).click();
  await expect(titles).toHaveText(["Bump widget styles"]);
  expect(searches().at(-1)).toEqual({
    q: "repo:e2e-labs/legacy repo:e2e-labs/widgets repo:e2e/demo repo:e2e/docs is:pr sort:updated-desc review-requested:@me",
    cursor: null,
  });

  // Pages continue from GitHub's cursor; a slow search can be paused.
  gh.delay(/^graphql search/, 3);
  await view.tab("Issues").click();
  await page.getByRole("button", { name: "Search GitHub" }).click();
  await page.getByRole("button", { name: "Pause" }).click();
  gh.update((s) => (s.delays = []));
  await page.getByRole("button", { name: "Resume search" }).click();
  await expect(titles).toHaveText(["Subtract returns the wrong sign", "Document the add helper", "Widget renders twice"]);
  await page.getByRole("button", { name: "Load more (1 feeds)" }).click();
  await expect(titles).toHaveText(ALL_ISSUES);
  expect(searches().at(-1)).toEqual({ q: "repo:e2e-labs/legacy repo:e2e-labs/widgets repo:e2e/demo is:issue sort:updated-desc", cursor: "Y3Vyc29yOjM=" });
});

test("a new issue is previewed, kept as a draft, and sent to GitHub as literal JSON", async ({ splash }) => {
  const { app, page, world } = splash;
  const gh = new FakeGithub(world);
  const view = new GithubView(page);
  await app.openNav("GitHub");
  await view.loaded(15);

  // Starts in the selected item's repository.
  await view.rows("Widget renders twice").click();
  await page.getByRole("button", { name: "New issue" }).click();
  const dialog = page.getByRole("dialog", { name: "New GitHub issue" });
  const repo = dialog.getByRole("combobox", { name: "Repository", exact: true });
  await expect(repo).toHaveValue("e2e-labs/widgets");
  // Not e2e/docs (issues are off) nor the archived e2e-labs/legacy.
  await expect(repo.locator("option:not([disabled])")).toHaveText(["e2e/demo", "e2e-labs/widgets"]);
  await repo.selectOption("e2e/demo");
  const title = 'Negative results: $(touch pwned) `uname` "quoted"';
  const body = "## Steps\n\n- [ ] call `subtract(2, 3)`\n\n**Expected** -1 & <b>not</b> 1";
  await dialog.getByRole("textbox", { name: "Title" }).fill(title);
  await dialog.getByRole("textbox", { name: "Description" }).fill(body);
  await dialog.getByRole("button", { name: "Preview" }).click();
  await expect(dialog.getByRole("button", { name: "Preview" })).toHaveAttribute("aria-pressed", "true");
  await expect(dialog.getByRole("heading", { name: "Steps" })).toBeVisible();
  await expect(dialog.locator("strong", { hasText: "Expected" })).toBeVisible();

  // Closing keeps the draft.
  await dialog.getByRole("button", { name: "Cancel" }).click();
  await expect(dialog).toBeHidden();
  await page.getByRole("button", { name: "New issue" }).click();
  await expect(repo).toHaveValue("e2e/demo");
  await expect(dialog.getByRole("textbox", { name: "Title" })).toHaveValue(title);
  await expect(dialog.getByRole("textbox", { name: "Description" })).toHaveValue(body);

  // GitHub refuses: the draft stays, with a way to check GitHub.
  gh.fail(/^repos\/e2e\/demo\/issues$/, "gh: Resource not accessible by integration (HTTP 403)");
  await dialog.getByRole("button", { name: "Create issue" }).click();
  await expect(dialog.getByRole("alert")).toContainText("HTTP 403");
  await expect(dialog.getByRole("alert").getByRole("button", { name: "Check issues on GitHub" })).toBeVisible();
  await expect(dialog.getByRole("textbox", { name: "Title" })).toHaveValue(title);

  gh.heal();
  await dialog.getByRole("button", { name: "Create issue" }).click();
  await expect(dialog).toBeHidden();
  await expect(app.ui.toasts.filter({ hasText: "Created e2e/demo #42" })).toBeVisible();
  // The issue went to gh as JSON on stdin, never as arguments.
  const created = gh.rest(/^repos\/e2e\/demo\/issues$/);
  expect(created.map((c) => c.argv)).toEqual(Array(2).fill(["api", "--hostname", "github.com", "repos/e2e/demo/issues", "--input", "-"]));
  expect(JSON.parse(created[1].stdin)).toEqual({ title, body });
  expect(existsSync(join(world.root, "pwned"))).toBe(false);
  // It tops the list, selected.
  await expect(view.rows().first().locator(".item-title")).toHaveText(title);
  await expect(view.rows(title)).toHaveAttribute("aria-pressed", "true");
  await expect(view.detail.getByRole("heading", { name: title })).toBeVisible();

  await page.getByRole("button", { name: "New issue" }).click();
  await expect(dialog.getByRole("textbox", { name: "Title" })).toHaveValue("");
});

test("working on an issue drafts it into a new session", async ({ splash }) => {
  const { app, page, world, db } = splash;
  const view = new GithubView(page);
  await app.openNav("GitHub");
  await view.loaded(15);

  await view.rows("Subtract returns the wrong sign").click();
  // e2e/demo is the project's origin.
  await expect(view.detail).toContainText(world.repo);
  await view.detail.getByRole("button", { name: "Work on this" }).click();
  const dialog = page.getByRole("dialog", { name: "New session" });
  await expect(dialog).toContainText("e2e/demo #12: Subtract returns the wrong sign");
  await expect(dialog.getByRole("radiogroup", { name: "Project" }).getByRole("radio", { name: /^repo/ })).toBeChecked();
  await expect(dialog.getByRole("checkbox")).toHaveCount(0);
  await dialog.getByRole("radiogroup", { name: "Where it works" }).getByRole("radio", { name: /In place/ }).click();
  await dialog.getByRole("button", { name: /^Start session/ }).click();
  await expect(dialog).toBeHidden();

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
  await app.openNav("GitHub");
  await view.rows("Subtract returns the wrong sign").click();
  await expect(view.detail.getByRole("button", { name: /^Subtract returns the wrong sign/ })).toContainText("this item");
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
    await app.openNav("GitHub");
    await view.loaded(15);

    await view.tab("PRs").click();
    await view.rows("Fix subtract sign").click();
    await view.detail.getByRole("button", { name: "Work on this" }).click();
    const dialog = page.getByRole("dialog", { name: "New session" });
    await expect(dialog.getByRole("checkbox", { name: "Start a new worktree from PR #7 (fix/subtract-sign)" })).toBeChecked();
    await expect(dialog.getByRole("radiogroup", { name: "Where it works" })).toHaveCount(0);
    await dialog.getByRole("button", { name: /^Start session/ }).click();
    await expect(dialog).toBeHidden();

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
  await app.openNav("GitHub");
  await view.loaded(15);

  await view.rows("Bump widget styles").click();
  await expect(view.detail).toContainText("No matching local project.");
  await view.detail.getByRole("button", { name: "Link to Splash…" }).click();
  const link = page.getByRole("dialog", { name: "Link repository to Splash" });
  await link.getByRole("button", { name: "repo", exact: true }).click();
  await expect(link).toBeHidden();
  await expect(view.detail).toContainText(world.repo);
  await expect(view.detail.getByRole("button", { name: "Link another project…" })).toBeVisible();
  await expect.poll(() => db.setting("github.link.e2e-labs/widgets")).toBe(JSON.stringify([db.projects()[0].id]));

  // Linked by hand, but the project's origin is e2e/demo: the PR head cannot be fetched.
  await view.detail.getByRole("button", { name: "Work on this" }).click();
  const dialog = page.getByRole("dialog", { name: "New session" });
  await expect(dialog.getByRole("radiogroup", { name: "Project" }).getByRole("radio", { name: /^repo/ })).toBeChecked();
  await dialog.getByRole("button", { name: /^Start session/ }).click();
  await expect(
    app.ui.toasts.filter({ hasText: "This project has no GitHub remote matching the pull request. Link the matching local checkout first." }),
  ).toBeVisible();
  await expect(dialog).toBeVisible();
  expect(db.sessions()).toEqual([]);
});

test("a session's pull request shows in its header and review panel", async ({ splash }) => {
  const { app, page, world, db } = splash;
  const gh = new FakeGithub(world);
  // Slow enough for the UI to see the turn run.
  world.agents.speed("claude", 10);
  const id = await app.newSession({ where: "worktree" });
  const { branch, cwd } = db.session(id)!;
  await expect(page.getByRole("button", { name: "github.com/e2e/demo" })).toHaveAttribute("title", "https://github.com/e2e/demo");
  await expect(page.getByRole("button", { name: /^PR #/ })).toHaveCount(0);

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
  const chip = page.getByRole("button", { name: /^PR #15/ });
  await expect(chip).toContainText("open");
  await expect(chip).toHaveAttribute("title", "Teach subtract about signs");
  await app.sideTab("Review").click();
  await expect(page.getByRole("button", { name: "Open PR #15" })).toBeVisible();
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
  const titles = actions.run().locator("strong");
  /** The latest runs request for e2e/demo. */
  const demoRuns = () => gh.rest(/^repos\/e2e\/demo\/actions\/(workflows\/\d+\/)?runs\?/).at(-1)?.argv[3];

  // A slow repository can be paused and resumed.
  gh.delay(/^repos\/e2e-labs\/widgets\/actions\/runs\?/, 4);
  await app.openNav("Actions");
  await expect(page.getByText("@octocat")).toBeVisible();
  await expect(actions.sync).toHaveText(/^Loading 3 \/ 4 repositories/);
  await page.getByRole("button", { name: "Pause" }).click();
  await expect(actions.sync).toHaveText(/^3 \/ 4 repositories loaded/);
  gh.update((s) => (s.delays = []));
  await page.getByRole("button", { name: "Resume" }).click();
  await actions.loaded(4);

  for (const text of ["4 runs loaded", "1 active / waiting", "1 need attention", "2 successful"]) await expect(actions.summary).toContainText(text);
  await expect(titles).toHaveText(["Try feature a", "Fix subtract sign", "Bump widget styles", "Initial commit"]);
  expect(demoRuns()).toMatch(new RegExp(`^repos/e2e/demo/actions/runs\\?per_page=30&page=1&${LAST_30_DAYS}$`));

  // Status, branch and event filters go to GitHub, encoded.
  await actions.select("Run status").selectOption("Failed");
  await expect(titles).toHaveText(["Fix subtract sign"]);
  await page.getByRole("textbox", { name: "Branch filter" }).fill("fix/subtract-sign");
  await page.getByRole("textbox", { name: "Event filter" }).fill("pull_request");
  await page.getByRole("button", { name: "Apply" }).click();
  await expect
    .poll(demoRuns)
    .toMatch(new RegExp(`^repos/e2e/demo/actions/runs\\?per_page=30&page=1&status=failure&branch=fix%2Fsubtract-sign&event=pull_request&${LAST_30_DAYS}$`));
  await expect(titles).toHaveText(["Fix subtract sign"]);

  await actions.select("Run status").selectOption("Successful");
  await page.getByRole("textbox", { name: "Branch filter" }).fill("");
  await page.getByRole("textbox", { name: "Event filter" }).fill("");
  await page.getByRole("button", { name: "Apply" }).click();
  await actions.select("Run time range").selectOption("All available history");
  await expect(titles).toHaveText(["Bump widget styles", "Initial commit", "Release v0.1.0"]);
  await expect.poll(demoRuns).toBe("repos/e2e/demo/actions/runs?per_page=30&page=1&status=success");

  // A workflow's own runs.
  await page.getByRole("tablist", { name: "Actions overview" }).getByRole("tab", { name: "Workflows" }).click();
  const workflows = page.getByRole("region", { name: "Workflows" }).locator(".workflow");
  await expect(workflows.locator("strong")).toHaveText(["Widgets CI", "CI", "Release"]);
  await expect(workflows.nth(2)).toContainText("disabled manually");
  await workflows.nth(1).getByRole("button", { name: "View runs" }).click();
  await expect(page.getByRole("tab", { name: "Runs" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("e2e/demo · CI")).toBeVisible();
  await expect(titles).toHaveText(["Try feature a", "Fix subtract sign", "Initial commit"]);
  await expect.poll(demoRuns).toBe("repos/e2e/demo/actions/workflows/101/runs?per_page=30&page=1");
  await page.getByRole("button", { name: "All workflows" }).click();
  await expect(titles).toHaveText(["Try feature a", "Fix subtract sign", "Bump widget styles", "Initial commit", "Release v0.1.0"]);
});

test("a run shows its jobs per attempt, plain-text logs, and the sessions on its branch", async ({ splash }) => {
  const { app, page, world } = splash;
  const gh = new FakeGithub(world);
  const actions = new ActionsView(page);
  // A session in place on feat/a, where a run is in progress.
  git(world.repo, world.env(), "checkout", "-q", "-b", "feat/a");
  await app.newSession({ where: "in_place" });
  await app.prompt("What does subtract do?");
  await app.openNav("Actions");
  await actions.loaded(4);

  // The newest run is selected: still running, so its log is not ready.
  const detail = actions.detail;
  await expect(actions.run("Try feature a")).toHaveAttribute("aria-pressed", "true");
  await expect(detail.getByRole("heading", { name: "Try feature a" })).toBeVisible();
  await expect(detail).toContainText("in progress · latest attempt 1");
  const job = (name: string) => detail.locator("details").filter({ has: page.locator("summary", { hasText: ` · ${name} · ` }) });
  await job("test").locator("summary").click();
  await expect(job("test").getByRole("button", { name: "View log" })).toBeDisabled();
  await expect(job("test")).toContainText("Live logs are available on GitHub.");
  await detail.getByRole("button", { name: "What does subtract do?" }).click();
  await expect(app.title).toHaveText("What does subtract do?");
  await app.openNav("Actions");

  await actions.run("Fix subtract sign").click();
  await expect(detail).toContainText("failure · latest attempt 2");
  await expect(actions.select("Run attempt")).toHaveValue("2");
  await expect(detail.getByRole("button", { name: "What does subtract do?" })).toHaveCount(0);
  // The failed job is open, the rest folded.
  await expect(job("test")).toHaveAttribute("open", "");
  await expect(job("lint")).not.toHaveAttribute("open");
  await expect(job("test").locator("li")).toHaveText([/^Set up job\s*success/, /^Run tests\s*failure/]);
  expect(gh.rest(/\/jobs\?/).map((c) => c.argv[3])).toContain("repos/e2e/demo/actions/runs/9002/attempts/2/jobs?per_page=100&page=1");

  // Logs are plain text: escape sequences stripped, markup shown literally.
  await job("test").getByRole("button", { name: "View log" }).click();
  const log = detail.getByRole("region", { name: "Job log" });
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
  const find = detail.getByRole("textbox", { name: "Find lines in this log…" });
  await find.fill("failed");
  await expect(log).toHaveText("2026-10-06T16:14:18.0000000Z FAILED test_calc.py::test_subtract - assert 1 == -1");
  await find.fill("no such line");
  await expect(log).toHaveText("No matching lines.");

  // A log over 512 KiB is cut short.
  await job("build").locator("summary").click();
  await job("build").getByRole("button", { name: "View log" }).click();
  await expect(detail).toContainText("Showing the first 512 KiB. Open the full job on GitHub for the rest.");
  await expect(log).toContainText("building wheel for calc");

  // The first attempt failed earlier, and its log has expired.
  await actions.select("Run attempt").selectOption("1");
  await expect(job("test").locator("li")).toHaveText([/^Set up job/, /^Install dependencies\s*failure/]);
  expect(gh.rest(/\/jobs\?/).map((c) => c.argv[3])).toContain("repos/e2e/demo/actions/runs/9002/attempts/1/jobs?per_page=100&page=1");
  await job("test").getByRole("button", { name: "View log" }).click();
  await expect(detail.getByRole("alert")).toContainText("HTTP 410");
  await expect(detail.getByRole("button", { name: "Retry log" })).toBeVisible();
});
