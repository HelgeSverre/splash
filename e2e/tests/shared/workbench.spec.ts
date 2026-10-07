// The workbench around a session: edits and plans in the transcript, the
// Changes and Files tabs, diff and file tabs, the RPC log, the terminal.
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "../../fixtures.ts";

const sessionTabs = (page: import("@playwright/test").Page) => page.getByRole("tablist", { name: "Session tabs" });

test.describe("an agent that plans and edits", () => {
  test.beforeEach(({ world }) => {
    world.agents.fixture("claude", "e2e/plan_edit.jsonl");
    world.agents.flags("claude", "--apply-diffs");
  });

  test("shows its plan and diffs, and the edits land in the worktree", async ({ splash }) => {
    const { app, page, db } = splash;
    const id = await app.newSession({ where: "worktree" });
    await app.prompt("Add a multiply function with a test");
    const { cwd } = db.session(id)!;
    expect(readFileSync(join(cwd, "calc.py"), "utf8")).toContain("def multiply(a, b):");

    await expect(app.entries("thought").first()).toContainText("Thought");
    // Each plan update replaces the plan.
    const plan = app.entries("plan");
    await expect(plan).toHaveCount(1);
    await expect(plan).toContainText("Plan 2/3");
    await expect(plan.locator(".item.completed")).toHaveText(["Read calc.py", "Add multiply to calc.py"]);
    await expect(plan.locator(".item.in_progress")).toHaveText("Run the tests");

    // Completed edits open with their diff.
    const edit = app.entries("tool").filter({ hasText: "Edit calc.py" });
    await expect(edit.locator(".diff-head")).toContainText("calc.py");
    const created = app.entries("tool").filter({ hasText: "Write test_calc.py" });
    await expect(created.locator(".diff-head")).toContainText("new file");

    // The diff's path opens a diff tab; the location opens the file at its line.
    await edit.locator(".diff-head").getByRole("button", { name: "calc.py" }).click();
    await expect(sessionTabs(page).getByRole("tab", { name: /calc\.py/, selected: true })).toContainText("±");
    await sessionTabs(page).getByRole("tab", { name: "Chat" }).click();
    await edit.locator(".row .loc").filter({ hasText: "calc.py:7" }).click();
    await expect(sessionTabs(page).getByRole("tab", { name: "calc.py", exact: true, selected: true })).toBeVisible();
    await expect(page.getByText("read-only")).toBeVisible();
  });

  test("lists the changes, opens diffs and reviews them all", async ({ splash }) => {
    const { app, page } = splash;
    await app.newSession({ where: "worktree" });
    await app.prompt("Add a multiply function with a test");

    await app.sideTab("Changes").click();
    const changes = page.getByRole("tabpanel").locator(".change");
    await expect(changes).toHaveCount(2);
    await expect(page.locator(".files")).toHaveText("2 files");
    await expect(changes.filter({ hasText: "calc.py" }).first()).toHaveAttribute("title", /calc\.py/);

    await changes.filter({ hasText: "test_calc.py" }).click();
    const tab = sessionTabs(page).getByRole("tab", { name: /test_calc\.py/, selected: true });
    await expect(tab).toBeVisible();
    await expect(page.getByRole("tabpanel", { name: /test_calc\.py/ }).locator(".tag", { hasText: "new file" })).toBeVisible();

    await changes.filter({ hasNotText: "test_" }).click();
    const layout = page.getByRole("radiogroup", { name: "Diff layout" });
    await expect(layout.getByRole("radio", { name: "Unified" })).toBeChecked();
    await layout.getByRole("radio", { name: "Split" }).click();
    await expect(layout.getByRole("radio", { name: "Split" })).toBeChecked();
    await page.getByRole("checkbox", { name: "Whole file" }).check();
    await page.getByRole("button", { name: "Open file" }).click();
    await expect(sessionTabs(page).getByRole("tab", { name: "calc.py", exact: true, selected: true })).toBeVisible();

    // Review all changes opens one diff tab per change.
    await sessionTabs(page).getByRole("button", { name: /^Close/ }).first().click();
    await app.sideTab("Review").click();
    await page.getByRole("button", { name: "Review all changes" }).click();
    await expect(sessionTabs(page).getByRole("tab").filter({ hasText: "±" })).toHaveCount(2);
  });
});

test("the Changes tab follows the files without a refresh", async ({ splash }) => {
  const { app, page, db } = splash;
  const id = await app.newSession({ where: "worktree" });
  const { cwd } = db.session(id)!;
  await app.sideTab("Changes").click();
  await expect(page.getByText("No changes")).toBeVisible();

  writeFileSync(join(cwd, "calc.py"), readFileSync(join(cwd, "calc.py"), "utf8").replace("a - b", "b - a"));
  writeFileSync(join(cwd, "notes.txt"), "todo\n");
  rmSync(join(cwd, "README.md"));
  const changes = page.getByRole("tabpanel").locator(".change");
  await expect(changes).toHaveCount(3, { timeout: 15_000 });
  await expect(app.sideTab("Changes")).toContainText("3");

  await changes.filter({ hasText: "README.md" }).click();
  await expect(page.getByRole("tabpanel", { name: /README\.md/ }).locator(".tag", { hasText: "deleted" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Open file" })).toHaveCount(0);
});

test("the file tree opens files and changed files as diffs", async ({ splash }) => {
  const { app, page, db } = splash;
  const id = await app.newSession({ where: "worktree" });
  writeFileSync(join(db.session(id)!.cwd, "calc.py"), "def add(a, b):\n    return a + b\n");
  await app.sideTab("Files").click();
  const tree = page.getByRole("tree", { name: "Files" });
  await expect(tree.getByRole("treeitem", { name: "README.md" })).toBeVisible();

  const src = tree.getByRole("treeitem", { name: "src" });
  await expect(src).toHaveAttribute("aria-expanded", "false");
  await src.click();
  await expect(src).toHaveAttribute("aria-expanded", "true");
  await expect(tree.getByRole("treeitem", { name: "util.py" })).toBeVisible();
  await src.press("ArrowLeft");
  await expect(src).toHaveAttribute("aria-expanded", "false");
  await src.press("ArrowRight");
  await expect(src).toHaveAttribute("aria-expanded", "true");

  await tree.getByRole("treeitem", { name: "util.py" }).click();
  await expect(sessionTabs(page).getByRole("tab", { name: "util.py", selected: true })).toBeVisible();
  await expect(page.getByText(/^3 lines · /)).toBeVisible();
  await expect(page.locator(".content")).toContainText("return x * 2");

  // A changed file is marked, and opens as its diff.
  const calc = tree.getByRole("treeitem", { name: /calc\.py/ });
  await expect(calc.locator(".mark")).toBeVisible({ timeout: 15_000 });
  await calc.click();
  await expect(sessionTabs(page).getByRole("tab", { name: /calc\.py/, selected: true })).toContainText("±");
});

test("the log shows the agent's JSON-RPC traffic and filters it", async ({ splash }) => {
  const { app, page } = splash;
  await app.newSession({ where: "in_place" });
  await app.prompt("What does subtract do?");
  await page.getByRole("button", { name: "Log", exact: true }).click();
  const tab = sessionTabs(page).getByRole("tab", { name: "Log", selected: true });
  await expect(tab).toBeVisible();

  const filter = page.getByRole("searchbox", { name: "Filter the log" }).or(page.getByRole("textbox", { name: "Filter the log" }));
  const lines = page.locator(".log .line");
  const total = await lines.count();
  expect(total).toBeGreaterThan(10);
  await filter.fill("session/prompt");
  await expect(lines).toHaveCount(1);
  await expect(page.getByText(`1 of ${total} lines`)).toBeVisible();
  await filter.fill("");

  // A new turn appends while the tab is open.
  await sessionTabs(page).getByRole("tab", { name: "Chat" }).click();
  await app.prompt("And add?");
  await sessionTabs(page).getByRole("tab", { name: "Log" }).click();
  await expect.poll(() => lines.count()).toBeGreaterThan(total);

  await page.getByRole("button", { name: "Close Log" }).click();
  await expect(sessionTabs(page).getByRole("tab", { name: "Log" })).toHaveCount(0);
});

test("the terminal runs a shell in the session's folder", async ({ splash }) => {
  const { app, page, world } = splash;
  await app.newSession({ where: "in_place" });
  await page.getByRole("button", { name: "Terminal" }).click();
  const terminal = page.locator("#terminal-pane .xterm");
  await expect(terminal).toBeVisible();
  await terminal.click();
  await page.keyboard.type("echo e2e-ok-$((6*7)) && pwd\n");
  const rows = page.locator("#terminal-pane .xterm-rows");
  await expect(rows).toContainText("e2e-ok-42");
  await expect(rows).toContainText(world.repo);

  await page.getByRole("button", { name: "Hide the terminal" }).click();
  await expect(terminal).toBeHidden();
  await expect(app.composer).toBeFocused();
});

test("the side panel stays as it was left after a reload", async ({ splash }) => {
  const { app, page } = splash;
  await app.newSession({ where: "in_place" });
  const toggle = page.getByRole("button", { name: "Changes & files" });
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await app.sideTab("Files").click();
  await page.reload();
  await expect(app.sideTab("Files")).toHaveAttribute("aria-selected", "true");

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByRole("tablist", { name: "Side panel" })).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole("button", { name: "Changes & files" })).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByRole("tablist", { name: "Side panel" })).toHaveCount(0);
});
