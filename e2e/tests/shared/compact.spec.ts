// The compact workbench: one header bar over the chat, a tab bar only when
// there is a second tab, the side panel as an overlay in a small window, and
// a sidebar and New session dialog that show only what can be used.
import { expect, test } from "../../fixtures.ts";
import { Workbench } from "../../support/views.ts";

test("the tab bar appears with the second tab and carries that tab's controls", async ({ splash }) => {
  const { app, page, world } = splash;
  world.agents.fixture("claude", "e2e/plan_edit.jsonl");
  world.agents.flags("claude", "--apply-diffs");
  await app.newSession({ where: "worktree" });
  await app.prompt("Add a multiply function with a test");
  const bench = new Workbench(page);

  // The chat alone: no tab bar, and the header starts the transcript.
  await expect(app.tabStrip).toHaveAttribute("data-single", "true");
  await expect(app.tabStrip).toBeHidden();
  await expect(app.sessionTabs).toHaveCount(1);

  // A diff brings the bar, with its layout controls beside the tabs.
  await bench.changes("calc.py").click();
  await expect(app.tabStrip).toHaveAttribute("data-single", "false");
  await expect(app.sessionTab("diff", "calc.py")).toBeVisible();
  await expect(bench.diffLayout("unified")).toBeChecked();
  await expect(bench.openFile).toBeVisible();

  // The chat tab has no controls of its own; a file shows its size instead.
  await app.sessionTab("chat").click();
  await expect(app.tabTools).toBeEmpty();
  await app.sessionTab("diff", "calc.py").click();
  await bench.openFile.click();
  await expect(bench.fileReadOnly).toBeVisible();
  await expect(bench.diffLayout("unified")).toHaveCount(0);

  // The log opens from the session menu; closing every tab hides the bar again.
  await app.openLog();
  await page.keyboard.press(app.key("W"));
  await page.keyboard.press(app.key("W"));
  await page.keyboard.press(app.key("W"));
  await expect(app.sessionTabs).toHaveCount(1);
  await expect(app.tabStrip).toBeHidden();
  await expect(app.composer).toBeVisible();
});

test("a small window floats the side panel over the chat and leaves the saved layout alone", async ({ splash }) => {
  const { app, page } = splash;
  await app.newSession({ where: "in_place" });
  await expect(app.sidePanel).toBeVisible();
  const side = app.workbenchSide;
  await expect(side).toHaveAttribute("data-overlay", "false");
  const wide = (await app.transcript.boundingBox())!.width;

  // Narrow: the panel steps aside, and the chat takes the room.
  await page.setViewportSize({ width: 900, height: 600 });
  await expect(side).toHaveCount(0);
  await expect(app.panelToggle).toHaveAttribute("aria-pressed", "false");
  await expect.poll(async () => (await app.transcript.boundingBox())!.width).toBeGreaterThan(600);

  // A finished turn selects Review but does not cover the chat uninvited.
  await app.prompt("What does subtract do?");
  await expect(side).toHaveCount(0);

  // Opened there it overlays: the chat keeps its width, and the header's
  // toggle stays in reach to close it.
  const narrow = (await app.transcript.boundingBox())!.width;
  await app.panelToggle.click();
  await expect(side).toHaveAttribute("data-overlay", "true");
  await expect(app.sideTab("review")).toHaveAttribute("aria-selected", "true");
  expect((await app.transcript.boundingBox())!.width).toBe(narrow);
  await app.panelToggle.click();
  await expect(side).toHaveCount(0);

  // Wide again: the column is back as it was saved.
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(side).toHaveAttribute("data-overlay", "false");
  await expect.poll(async () => (await app.transcript.boundingBox())!.width).toBe(wide);
});

test("the sidebar hides and comes back from the session header", async ({ splash }) => {
  const { app } = splash;
  await app.newSession({ where: "in_place" });
  await expect(app.showSidebar).toHaveCount(0);
  await app.hideSidebar.click();
  await expect(app.sidebar).toHaveCount(0);
  await app.showSidebar.click();
  await expect(app.sidebar).toBeVisible();
  await expect(app.showSidebar).toHaveCount(0);
});

test("session shortcuts show in the sidebar only while a modifier is held", async ({ splash }) => {
  const { app, page } = splash;
  await app.newSession({ where: "in_place" });
  const key = app.sessionKey(app.sessionRows.first());
  await expect(key).toBeHidden();
  await expect(key).not.toHaveText("");
  const modifier = app.key("1").split("+")[0];
  await page.keyboard.down(modifier);
  await expect(key).toBeVisible();
  await page.keyboard.up(modifier);
  await expect(key).toBeHidden();
});

test("New session offers installed agents and folds the rest and the extra folders", async ({ splash }) => {
  const { app } = splash;
  await app.newSessionButton.click();
  await expect(app.dialogChoices("agent")).toHaveCount(3);
  await expect(app.dialogStart).toBeInViewport();

  const more = app.dialogMoreAgents;
  await expect(more).toHaveAttribute("aria-expanded", "false");
  const missing = Number(await more.getAttribute("data-count"));
  expect(missing).toBeGreaterThan(0);
  await more.click();
  await expect(more).toHaveAttribute("aria-expanded", "true");
  await expect(app.dialogChoices("agent")).toHaveCount(3 + missing);
  await expect(app.agentState("gemini")).toHaveText("not installed");
  await more.click();
  await expect(app.dialogChoices("agent")).toHaveCount(3);

  await expect(app.dialogFolders).toHaveCount(0);
  await app.dialogFoldersToggle.click();
  await expect(app.dialogFolders).toBeVisible();
  await expect(app.dialogFoldersToggle).toHaveCount(0);
});

test("replying to a stopped session reconnects the agent and sends the message", async ({ splash }) => {
  const { app, world } = splash;
  world.agents.flags("claude", "--exit-mid-turn", "2");
  await app.newSession({ where: "in_place" });
  await app.send("What does subtract do?");
  await app.expectStatus("exited");
  // The agent died: that is not "stopped".
  await expect(app.status).toHaveText("exited");
  await expect(app.status).toHaveAttribute("data-failed", "true");
  await app.expectReconnectHint();
  await expect(app.continueButton).toHaveText("Reconnect");

  world.agents.flags("claude");
  await app.prompt("Try that again");
  await app.expectStatus("idle");
  await expect(app.continueButton).toHaveCount(0);
  await expect(app.composer).toHaveAttribute("placeholder", "Describe a task or ask a question");
  expect(world.agents.launches("claude").length).toBeGreaterThanOrEqual(2);
});

test("the composer names what each option switches and where the session works", async ({ splash }) => {
  const { app } = splash;
  await app.newSession({ where: "in_place" });
  // An on/off option reads as its name and state, not a bare "Off".
  await expect(app.picker("fast")).toHaveText("Fast off");
  await expect(app.whereChip).toContainText("In place");
  await app.whereChip.click();
  await expect(app.sideTab("details")).toHaveAttribute("aria-selected", "true");
});
