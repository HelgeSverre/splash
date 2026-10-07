// The transcript: streamed messages and tools, thinking, permissions, stopping
// a turn, slash commands, usage, and an agent that dies mid-turn.
import { expect, test } from "../../fixtures.ts";

test("a turn streams text and tools, then retitles the session from the prompt", async ({ splash }) => {
  const { app, world } = splash;
  world.agents.speed("claude", 10);
  await app.newSession({ where: "in_place" });
  await app.send("What does subtract do?");
  await app.expectStatus("running");
  await expect(app.entries("tool").getByText("Read calc.py")).toBeVisible();
  await expect(app.entries("turn_end")).toContainText(/done · /);
  await app.expectStatus("idle");
  await expect(app.title).toHaveText("What does subtract do?");
  await expect(app.sessionRow("What does subtract do?")).toBeVisible();
});

test("an agent's own title replaces the prompt title", async ({ splash }) => {
  const { app } = splash;
  await app.newSession({ agent: "codex", where: "in_place" });
  await app.prompt("Have a look at calc.py");
  // Codex reports the title; Splash keeps its first sentence.
  await expect(app.title).toHaveText("Read calc.py and tell me in one sentence what bug it has");
});

test("a refusal ends the turn as such", async ({ splash }) => {
  const { app } = splash;
  await app.newSession({ agent: "glue", where: "in_place" });
  await app.prompt("Delete everything");
  await expect(app.entries("turn_end")).toContainText("refusal");
});

test("thinking folds into a Thought once it finishes", async ({ splash }) => {
  const { app, world } = splash;
  world.agents.fixture("claude", "pool/read.jsonl");
  await app.newSession({ where: "in_place" });
  await app.send("Find calc.py");
  // Two permission requests on the way.
  for (let i = 0; i < 2; i++) {
    await expect(app.entries("permission").locator(".perm.pending")).toHaveCount(1);
    await app.entries("permission").locator(".perm.pending").getByRole("button").first().click();
  }
  await expect(app.entries("turn_end")).toBeVisible();
  const thought = app.entries("thought").first();
  await expect(thought).toContainText("Thought");
  await expect(thought.locator(".thought-text")).toHaveCount(0);
  await thought.getByRole("button").first().click();
  await expect(thought.locator(".thought-text")).toBeVisible();
});

test.describe("permissions", () => {
  test.beforeEach(({ splash }) => splash.world.agents.fixture("claude", "pool/read.jsonl"));

  test("are answered with number keys or a click, and wait in Needs attention", async ({ splash }) => {
    const { app, page, world } = splash;
    await app.newSession({ where: "in_place" });
    await app.send("Find calc.py");

    const pending = app.entries("permission").locator(".perm.pending");
    await expect(pending).toHaveCount(1);
    await app.expectStatus("awaiting_permission");
    await expect(app.status).toHaveText("needs you");
    await expect(app.transcript.getByText("Waiting for you: press 1 to 3 or click an option.")).toBeVisible();
    await expect(app.sidebar.getByRole("button", { name: /^Needs attention/ })).toContainText("1");

    // Typing a draft keeps the number keys for the draft.
    await app.composer.fill("draft");
    await app.composer.press("1");
    await expect(app.composer).toHaveValue("draft1");
    await expect(pending).toHaveCount(1);
    await app.composer.fill("");

    await app.transcript.focus();
    await page.keyboard.press("1");
    await expect(app.entries("permission").first().locator(".answer")).toHaveText("→ Allow once");

    await expect(pending).toHaveCount(1);
    await pending.getByRole("button", { name: /Always allow/ }).click();
    await expect(app.entries("permission").nth(1).locator(".answer")).toContainText("→ Always allow");
    await expect(app.entries("turn_end")).toBeVisible();

    const answers = world.agents.audit("claude").filter((m) => m.result?.outcome);
    expect(answers.map((m) => m.result.outcome)).toEqual([
      { outcome: "selected", optionId: "allow-once" },
      { outcome: "selected", optionId: "allow-always" },
    ]);
  });

  test("a rejected request is shown as rejected", async ({ splash }) => {
    const { app } = splash;
    await app.newSession({ where: "in_place" });
    await app.send("Find calc.py");
    await app.entries("permission").locator(".perm.pending").getByRole("button", { name: /Reject/ }).click();
    await expect(app.entries("permission").first().locator(".answer.rejected")).toHaveText("→ Reject");
  });

  test("stopping the turn cancels a pending request", async ({ splash }) => {
    const { app, page, world } = splash;
    await app.newSession({ where: "in_place" });
    await app.send("Find calc.py");
    await expect(app.entries("permission").locator(".perm.pending")).toHaveCount(1);
    await app.stopButton.click();
    await expect(app.entries("turn_end")).toContainText("cancelled");
    await expect(app.entries("permission").first().locator(".answer.rejected")).toHaveText("→ cancelled");
    await app.expectStatus("idle");
    expect(world.agents.requests("claude", "session/cancel")).toHaveLength(1);
  });
});

test("Stop ends a running turn", async ({ splash }) => {
  const { app, page, world } = splash;
  world.agents.fixture("claude", "claude/cancel.jsonl");
  world.agents.speed("claude", 1);
  await app.newSession({ where: "in_place" });
  await app.send("Write a long essay");
  await app.expectStatus("running");
  await expect(app.composer).toHaveAttribute("placeholder", "The agent is working…");
  await app.stopButton.click();
  await expect(app.entries("turn_end")).toContainText("cancelled");
  await app.expectStatus("idle");
  await expect(app.sendButton).toBeVisible();
  expect(world.agents.requests("claude", "session/cancel")).toHaveLength(1);
});

test("slash commands complete from the agent's list", async ({ splash }) => {
  const { app, page } = splash;
  await app.newSession({ where: "in_place" });
  // Claude lists its commands once the first turn starts.
  await app.prompt("What does subtract do?");
  await app.composer.fill("/");
  const menu = page.locator(".slash.popover");
  await expect(menu.getByRole("button")).toHaveCount(8);
  await app.composer.fill("/co");
  await expect(menu).toContainText("/compact");
  await expect(menu).toContainText("/context");
  await app.composer.press("ArrowDown");
  await app.composer.press("Tab");
  await expect(app.composer).toHaveValue("/context ");
  await expect(menu).toHaveCount(0);
});

test("an agent without commands shows no slash menu", async ({ splash }) => {
  const { app, page } = splash;
  await app.newSession({ agent: "glue", where: "in_place" });
  await app.composer.fill("/");
  await expect(page.locator(".slash.popover")).toHaveCount(0);
});

test("context use and cost are shown and kept across a restart", async ({ splash }) => {
  const { app, page } = splash;
  await app.newSession({ where: "in_place" });
  await expect(page.locator(".composer .ring")).toHaveAttribute("title", "Context usage appears after the first turn");
  await app.prompt("What does subtract do?");
  await expect(page.locator(".cost")).toHaveText("$0.14");
  await expect(page.locator(".composer .ring")).toHaveAttribute("title", "Context 26k of 1.0M tokens (3%) · $0.14");
  await app.sideTab("Details").click();
  await expect(app.detail("Turns")).toHaveText("1");
  await expect(app.detail("Cost")).toHaveText("$0.1393");

  await splash.restart();
  await expect(page.locator(".cost")).toHaveText("$0.14");
});

test("an agent that exits mid-turn leaves an error and a recovery item", async ({ splash }) => {
  const { app, page, world } = splash;
  world.agents.flags("claude", "--exit-mid-turn", "3");
  await app.newSession({ where: "in_place" });
  await app.send("What does subtract do?");
  await expect(app.entries("error").last()).toHaveText("Claude Code exited: exit status: 1 fake-acp: lost connection to the model provider");
  await expect(app.entries("turn_end")).toContainText("error");
  await app.expectStatus("exited");
  await expect(page.getByText("Viewing saved history. Continue to reconnect the agent.")).toBeVisible();

  await app.openNav("Needs attention");
  const recovery = page.getByRole("region", { name: "Needs recovery" });
  await expect(recovery).toContainText("What does subtract do?");
  await expect(recovery.getByRole("button", { name: "Reconnect agent" })).toBeVisible();

  world.agents.flags("claude");
  await recovery.getByRole("button", { name: "Reconnect agent" }).click();
  await app.expectStatus("idle");
  await expect(page.getByRole("region", { name: "Needs recovery" })).toHaveCount(0);
});

test("an agent's notice before the first turn is shown folded", async ({ splash }) => {
  const { app } = splash;
  // Pool reports a broken MCP server while creating the session.
  splash.world.agents.fixture("claude", "pool/read.jsonl");
  await app.newSession({ where: "in_place" });
  const notice = app.entries("notice");
  await expect(notice).toContainText("Agent notice");
  await expect(notice).toContainText("MCP server failed to initialize:");
  await expect(notice.locator(".notice-text")).toHaveCount(0);
  await notice.getByRole("button").click();
  await expect(notice.locator(".notice-text")).toContainText("docs (configured in ~/.config/poolside/settings.yaml)");
  await expect(app.transcript.getByText("What should we work on?")).toBeVisible();
});
