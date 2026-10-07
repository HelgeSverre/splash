// The workbench around a session: edits and plans in the transcript, the
// Changes and Files tabs, diff and file tabs, the RPC log, the terminal.
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "../../fixtures.ts";
import { Review, Workbench } from "../../support/views.ts";

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

    await expect(app.thought(app.entries("thought").first()).toggle).toHaveAttribute("data-open", "false");
    // Each plan update replaces the plan.
    await expect(app.entries("plan")).toHaveCount(1);
    await expect(app.entries("plan")).toContainText("Plan 2/3");
    await expect(app.planItems("completed")).toHaveText(["Read calc.py", "Add multiply to calc.py"]);
    await expect(app.planItems("in_progress")).toHaveText("Run the tests");

    // Completed edits open with their diff; a created file is marked new.
    const [edit, created] = [app.tools("edit").first(), app.tools("edit").last()];
    await expect(app.toolDiffs(edit)).toHaveAttribute("data-path", join(cwd, "calc.py"));
    await expect(app.toolDiffs(created)).toHaveAttribute("data-path", join(cwd, "test_calc.py"));
    await expect(app.toolDiffs(created)).toHaveAttribute("data-new", "true");

    // The diff's path opens a diff tab; the location opens the file at its line.
    await app.toolDiffPath(app.toolDiffs(edit)).click();
    await expect(app.sessionTab("diff", join(cwd, "calc.py"))).toHaveAttribute("aria-selected", "true");
    await app.sessionTab("chat").click();
    await app.toolLocations(edit).click();
    await expect(app.sessionTab("file", join(cwd, "calc.py"))).toHaveAttribute("aria-selected", "true");
    await expect(new Workbench(page).fileReadOnly).toBeVisible();
  });

  test("lists the changes, opens diffs and reviews them all", async ({ splash }) => {
    const { app, page } = splash;
    await app.newSession({ where: "worktree" });
    await app.prompt("Add a multiply function with a test");
    const bench = new Workbench(page);

    await app.sideTab("changes").click();
    await expect(bench.changes()).toHaveCount(2);
    await expect(bench.changesCount).toHaveAttribute("data-count", "2");
    await expect(bench.changes("calc.py")).toHaveAttribute("data-status", "M");
    await expect(bench.changes("test_calc.py")).toHaveAttribute("data-status", "?");

    await bench.changes("test_calc.py").click();
    await expect(app.sessionTab("diff", "test_calc.py")).toHaveAttribute("aria-selected", "true");
    await expect(bench.diffNewFile).toBeVisible();

    await bench.changes("calc.py").click();
    await expect(bench.diffLayout("unified")).toBeChecked();
    await bench.diffLayout("split").click();
    await expect(bench.diffLayout("split")).toBeChecked();
    await bench.wholeFile.click();
    await expect(bench.wholeFile).toBeChecked();
    await bench.openFile.click();
    await expect(app.sessionTab("file", "calc.py")).toHaveAttribute("aria-selected", "true");

    // Review all changes opens one diff tab per change.
    await app.closeTab("diff", "test_calc.py").click();
    await expect(app.sessionTab("diff", "test_calc.py")).toHaveCount(0);
    await app.sideTab("review").click();
    await new Review(page).reviewAllChanges.click();
    await expect(app.sessionTab("diff")).toHaveCount(2);
  });
});

test("the Changes tab follows the files without a refresh", async ({ splash }) => {
  const { app, page, db } = splash;
  const id = await app.newSession({ where: "worktree" });
  const { cwd } = db.session(id)!;
  const bench = new Workbench(page);
  await app.sideTab("changes").click();
  await expect(bench.noChanges).toBeVisible();

  writeFileSync(join(cwd, "calc.py"), readFileSync(join(cwd, "calc.py"), "utf8").replace("a - b", "b - a"));
  writeFileSync(join(cwd, "notes.txt"), "todo\n");
  rmSync(join(cwd, "README.md"));
  await expect(bench.changes()).toHaveCount(3, { timeout: 15_000 });
  await expect(app.sideTab("changes")).toContainText("3");

  await bench.changes("README.md").click();
  await expect(bench.diffDeleted).toBeVisible();
  await expect(bench.openFile).toHaveCount(0);
});

test("the file tree opens files and changed files as diffs", async ({ splash }) => {
  const { app, page, db } = splash;
  const id = await app.newSession({ where: "worktree" });
  writeFileSync(join(db.session(id)!.cwd, "calc.py"), "def add(a, b):\n    return a + b\n");
  await app.sideTab("files").click();
  const bench = new Workbench(page);
  await expect(bench.node("README.md")).toBeVisible();

  const src = bench.node("src");
  await expect(src).toHaveAttribute("aria-expanded", "false");
  await src.click();
  await expect(src).toHaveAttribute("aria-expanded", "true");
  await expect(bench.node("src/util.py")).toBeVisible();
  await src.press("ArrowLeft");
  await expect(src).toHaveAttribute("aria-expanded", "false");
  await src.press("ArrowRight");
  await expect(src).toHaveAttribute("aria-expanded", "true");

  await bench.node("src/util.py").click();
  await expect(app.sessionTab("file", "src/util.py")).toHaveAttribute("aria-selected", "true");
  await expect(bench.fileMeta).toHaveAttribute("data-lines", "3");
  await expect(bench.fileContent).toContainText("return x * 2");

  // A changed file is marked, and opens as its diff.
  await expect(bench.changeMark(bench.node("calc.py"))).toHaveAttribute("data-status", "M", { timeout: 15_000 });
  await bench.node("calc.py").click();
  await expect(app.sessionTab("diff", "calc.py")).toHaveAttribute("aria-selected", "true");
});

test("the log shows the agent's JSON-RPC traffic and filters it", async ({ splash }) => {
  const { app, page } = splash;
  await app.newSession({ where: "in_place" });
  await app.prompt("What does subtract do?");
  await app.openLogButton.click();
  await expect(app.sessionTab("log")).toHaveAttribute("aria-selected", "true");

  const bench = new Workbench(page);
  // The finished turn's traffic loads with the tab.
  await expect.poll(() => bench.logLines.count()).toBeGreaterThan(10);
  const total = await bench.logLines.count();
  await bench.logFilter.fill("session/prompt");
  await expect(bench.logLines).toHaveCount(1);
  await expect(bench.logLines).toHaveAttribute("data-method", "session/prompt");
  await expect(bench.filterCount).toHaveAttribute("data-shown", "1");
  await expect(bench.filterCount).toHaveAttribute("data-total", String(total));
  await bench.logFilter.fill("");

  // A new turn appends while the tab is open.
  await app.sessionTab("chat").click();
  await app.prompt("And add?");
  await app.sessionTab("log").click();
  await expect.poll(() => bench.logLines.count()).toBeGreaterThan(total);

  await app.closeTab("log").click();
  await expect(app.sessionTab("log")).toHaveCount(0);
});

test("the terminal runs a shell in the session's folder", async ({ splash }) => {
  const { app, page, world } = splash;
  await app.newSession({ where: "in_place" });
  await app.terminalToggle.click();
  const bench = new Workbench(page);
  await expect(bench.terminalInput).toBeVisible();
  await bench.terminalInput.click();
  await page.keyboard.type("echo e2e-ok-$((6*7)) && pwd\n");
  await expect(bench.terminalScreen).toContainText("e2e-ok-42");
  await expect(bench.terminalScreen).toContainText(world.repo);

  await bench.hideTerminal.click();
  await expect(bench.terminal).toHaveCount(0);
  await expect(app.composer).toBeFocused();
});

test("the side panel stays as it was left after a reload", async ({ splash }) => {
  const { app, page } = splash;
  await app.newSession({ where: "in_place" });
  await expect(app.panelToggle).toHaveAttribute("aria-pressed", "true");
  await app.sideTab("files").click();
  await page.reload();
  await expect(app.sideTab("files")).toHaveAttribute("aria-selected", "true");

  await app.panelToggle.click();
  await expect(app.panelToggle).toHaveAttribute("aria-pressed", "false");
  await expect(app.sidePanel).toHaveCount(0);
  await page.reload();
  await expect(app.panelToggle).toHaveAttribute("aria-pressed", "false");
  await expect(app.sidePanel).toHaveCount(0);
});
