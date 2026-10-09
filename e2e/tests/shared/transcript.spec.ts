// The transcript: streamed messages and tools, thinking, permissions, stopping
// a turn, slash commands, usage, and an agent that dies mid-turn.
import { expect, test } from "../../fixtures.ts";
import type { Page } from "@playwright/test";
import { App } from "../../support/app.ts";
import { Attention } from "../../support/views.ts";

test("a turn streams text and tools, then retitles the session from the prompt", async ({ splash }) => {
  const { app, world } = splash;
  world.agents.speed("claude", 10);
  await app.newSession({ where: "in_place" });
  await app.send("What does subtract do?");
  await app.expectStatus("running");
  await expect(app.tools("read")).toHaveAttribute("data-status", "completed");
  await expect(app.turnEnds()).toHaveAttribute("data-stop-reason", "end_turn");
  await expect(app.turnEnds()).toContainText(/ · \d/);
  await app.expectStatus("idle");
  await expect(app.title).toHaveText("What does subtract do?");
  await expect(app.sessionRow("What does subtract do?")).toBeVisible();
});

test("live transcript updates survive an older delayed snapshot", async ({ splash }) => {
  const { app, page, backend, harness } = splash;
  const id = await app.newSession({ where: "in_place" });
  let releaseSnapshot!: () => void;
  const snapshotReleased = new Promise<void>((resolve) => (releaseSnapshot = resolve));
  let snapshotCaptured = false;
  let other: Page | undefined;

  await page.route("**/__cmd/open_session", async (route) => {
    // Capture a real, empty snapshot before the other client starts a turn.
    const response = await route.fetch();
    snapshotCaptured = true;
    await snapshotReleased;
    await route.fulfill({ response });
  }, { times: 1 });

  try {
    await app.sessionRow("New session").click();
    await expect.poll(() => snapshotCaptured).toBe(true);

    other = await page.context().newPage();
    const otherApp = new App(other, harness);
    await other.goto(`${backend.url}/#/session/${encodeURIComponent(id)}`);
    await otherApp.waitReady();
    await otherApp.composer.fill("What does subtract do?");
    await otherApp.composer.press("Enter");
    await expect(otherApp.entries("agent")).toContainText("subtracts instead of adding");

    releaseSnapshot();
    await expect(app.entries("user")).toContainText("What does subtract do?");
    await expect(app.entries("agent")).toContainText("subtracts instead of adding");
  } finally {
    releaseSnapshot();
    await other?.close();
    await page.unroute("**/__cmd/open_session");
  }
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
  await expect(app.turnEnds()).toHaveAttribute("data-stop-reason", "refusal");
});

test("thinking folds into a Thought once it finishes", async ({ splash }) => {
  const { app, world } = splash;
  world.agents.fixture("claude", "pool/read.jsonl");
  await app.newSession({ where: "in_place" });
  await app.send("Find calc.py");
  // Two permission requests on the way.
  await app.allowPermissions(2);
  await expect(app.turnEnds()).toBeVisible();
  const thought = app.thought(app.entries("thought").first());
  await expect(thought.toggle).toHaveAttribute("data-open", "false");
  await expect(thought.text).toHaveCount(0);
  await thought.toggle.click();
  await expect(thought.text).toBeVisible();
});

test.describe("permissions", () => {
  test.beforeEach(({ world }) => world.agents.fixture("claude", "pool/read.jsonl"));

  test("are answered with number keys or a click, and wait in Needs attention", async ({ splash }) => {
    const { app, page, world } = splash;
    await app.newSession({ where: "in_place" });
    await app.send("Find calc.py");

    const pending = app.permissions("pending");
    await expect(pending).toHaveCount(1);
    await app.expectStatus("awaiting_permission");
    await expect(app.status).toHaveText("needs you");
    await expect(app.transcriptHint).toHaveText("Waiting for you: press 1 to 3 or click an option.");
    await expect(app.attentionCount).toHaveText("1");

    // Typing a draft keeps the number keys for the draft.
    await app.composer.fill("draft");
    await app.composer.press("1");
    await expect(app.composer).toHaveValue("draft1");
    await expect(pending).toHaveCount(1);
    await app.composer.fill("");

    await app.transcript.focus();
    await page.keyboard.press("1");
    await expect(app.permissionAnswer(app.permissions().first())).toHaveText("→ Allow once");

    await expect(pending).toHaveCount(1);
    await app.permissionOption(pending, "allow_always").click();
    await expect(app.permissions("allowed")).toHaveCount(2);
    await expect(app.turnEnds()).toBeVisible();

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
    await app.permissionOption(app.permissions("pending"), "reject_once").click();
    await expect(app.permissions("rejected")).toHaveCount(1);
    await expect(app.permissionAnswer(app.permissions("rejected"))).toHaveText("→ Reject");
  });

  test("stopping the turn cancels a pending request", async ({ splash }) => {
    const { app, world } = splash;
    await app.newSession({ where: "in_place" });
    await app.send("Find calc.py");
    await expect(app.permissions("pending")).toHaveCount(1);
    await app.stopButton.click();
    await expect(app.turnEnds()).toHaveAttribute("data-stop-reason", "cancelled");
    await expect(app.permissions("rejected")).toHaveCount(1);
    await expect(app.permissionAnswer(app.permissions("rejected"))).toHaveText("→ cancelled");
    await app.expectStatus("idle");
    expect(world.agents.requests("claude", "session/cancel")).toHaveLength(1);
  });
});

test("Stop ends a running turn", async ({ splash }) => {
  const { app, world } = splash;
  world.agents.fixture("claude", "claude/cancel.jsonl");
  world.agents.speed("claude", 1);
  await app.newSession({ where: "in_place" });
  await app.send("Write a long essay");
  await app.expectStatus("running");
  await expect(app.composer).toHaveAttribute("placeholder", "The agent is working…");
  await app.stopButton.click();
  await expect(app.turnEnds()).toHaveAttribute("data-stop-reason", "cancelled");
  await app.expectStatus("idle");
  await expect(app.sendButton).toBeVisible();
  expect(world.agents.requests("claude", "session/cancel")).toHaveLength(1);
});

test("slash commands complete from the agent's list", async ({ splash }) => {
  const { app } = splash;
  await app.newSession({ where: "in_place" });
  // Claude lists its commands once the first turn starts.
  await app.prompt("What does subtract do?");
  await app.composer.fill("/");
  await expect(app.slashCommands).toHaveCount(8);
  await app.composer.fill("/co");
  // Names that start with what's typed come first.
  await expect.poll(() => app.slashCommands.evaluateAll((items) => items.map((i) => i.getAttribute("data-name")))).toEqual([
    "compact",
    "context",
    "autocompact",
  ]);
  await app.composer.press("ArrowDown");
  await expect(app.slashCommands.nth(1)).toHaveAttribute("data-active", "true");
  await app.composer.press("Tab");
  await expect(app.composer).toHaveValue("/context ");
  await expect(app.slashMenu).toHaveCount(0);
});

test("an agent without commands shows no slash menu", async ({ splash }) => {
  const { app } = splash;
  await app.newSession({ agent: "glue", where: "in_place" });
  await app.composer.fill("/");
  await expect(app.slashMenu).toHaveCount(0);
});

test("Enter that confirms an IME candidate keeps the composer draft", async ({ splash }) => {
  const { app, world } = splash;
  await app.newSession({ where: "in_place" });
  await app.composer.fill("unfinished candidate");

  // WebKit can report this composition-confirming Enter after compositionend,
  // with isComposing already false. It still has legacy keyCode 229.
  await app.composer.evaluate((element) => {
    const event = new KeyboardEvent("keydown", { bubbles: true, key: "Enter" });
    Object.defineProperty(event, "keyCode", { value: 229 });
    element.dispatchEvent(event);
  });
  await expect(app.composer).toHaveValue("unfinished candidate");
  await expect(app.entries("user")).toHaveCount(0);

  await app.composer.press("Enter");
  await expect.poll(() => world.agents.requests("claude", "session/prompt")).toHaveLength(1);
  await expect(app.composer).toHaveValue("");
});

test("returning to Chat follows output that arrived while Log was open", async ({ splash }) => {
  const { app, world } = splash;
  world.agents.fixture("claude", "claude/cancel.jsonl");
  world.agents.speed("claude", 1);
  await app.newSession({ where: "in_place" });
  await app.send("Write a long essay");
  await expect(app.entries("agent")).toContainText("Addition is often");

  await app.openLogButton.click();
  await expect(app.sessionTab("log")).toHaveAttribute("aria-selected", "true");
  // Let enough output arrive for the transcript to overflow while its scroller
  // is hidden by the Log pane.
  await expect(app.entries("agent")).toContainText("This sounds obvious");

  await app.sessionTab("chat").click();
  await expect.poll(() => app.transcript.evaluate((element) => element.scrollHeight - element.scrollTop - element.clientHeight)).toBeLessThanOrEqual(2);
  await app.stopButton.click();
});

test("session controls remain reachable in a narrow centre pane", async ({ splash }) => {
  const { app, page } = splash;
  await page.setViewportSize({ width: 900, height: 560 });
  await app.newSession({ where: "in_place" });

  const controls = [app.title, app.status, app.terminalToggle, app.panelToggle, app.composer, app.sendButton];
  const boxes = await Promise.all(controls.map((control) => control.boundingBox()));
  expect(boxes.every((box) => box && box.x >= 0 && box.y >= 0 && box.x + box.width <= 900 && box.y + box.height <= 560)).toBe(true);
});

test("context use and cost are shown and kept across a restart", async ({ splash }) => {
  const { app } = splash;
  await app.newSession({ where: "in_place" });
  await expect(app.contextRing).toHaveAttribute("title", "Context usage appears after the first turn");
  await app.prompt("What does subtract do?");
  await expect(app.cost).toHaveText("$0.14");
  await expect(app.contextRing).toHaveAttribute("title", "Context 26k of 1.0M tokens (3%) · $0.14");
  await app.sideTab("details").click();
  await expect(app.detail("turns")).toHaveText("1");
  await expect(app.detail("cost")).toHaveText("$0.1393");

  await splash.restart();
  await expect(app.cost).toHaveText("$0.14");
});

test("an agent that exits mid-turn leaves an error and a recovery item", async ({ splash }) => {
  const { app, page, world } = splash;
  world.agents.flags("claude", "--exit-mid-turn", "3");
  const id = await app.newSession({ where: "in_place" });
  await app.send("What does subtract do?");
  const exited = "Claude Code exited: exit status: 1\nfake-acp: lost connection to the model provider";
  await expect(app.entries("error").last()).toHaveText(exited);
  await expect(app.turnEnds()).toHaveAttribute("data-stop-reason", "error");
  await app.expectStatus("exited");
  // The exit says why; the protocol's "Incoming transport closed" doesn't.
  await expect(app.entries("error")).toHaveCount(1);
  await expect(app.resumeNote).toContainText("Viewing saved history. Continue to reconnect the agent.");

  await app.openNav("attention");
  const attention = new Attention(page);
  const item = attention.item(id, "failed");
  await expect(attention.detail(item)).toHaveText(exited);
  await expect(attention.reconnect(item)).toBeVisible();

  world.agents.flags("claude");
  await attention.reconnect(item).click();
  await app.expectStatus("idle");
  await expect(attention.group("failed")).toHaveCount(0);
});

test("an agent's notice before the first turn is shown folded", async ({ splash }) => {
  const { app } = splash;
  // Pool reports a broken MCP server while creating the session.
  splash.world.agents.fixture("claude", "pool/read.jsonl");
  await app.newSession({ where: "in_place" });
  const notice = app.notice(app.entries("notice"));
  await expect(notice.toggle).toContainText("MCP server failed to initialize:");
  await expect(notice.text).toHaveCount(0);
  await notice.toggle.click();
  await expect(notice.text).toContainText("docs (configured in ~/.config/poolside/settings.yaml)");
  await expect(app.transcriptEmpty).toBeVisible();
});

test.describe("Amp", () => {
  test.use({ agents: ["amp"] });

  test("runs through its adapter, with its modes and permissions as pickers", async ({ splash }) => {
    const { app, world } = splash;
    await app.newSession({ agent: "amp", where: "in_place" });
    expect(world.agents.launches("amp").map((l) => l.argv)).toEqual([["-y", "amp-acp@0.9.0"]]);
    await expect(app.picker("amp-mode")).toHaveText("Medium");
    await expect(app.picker("permission")).toHaveText("Default");

    // Amp runs tools without asking unless permissions are configured.
    await app.prompt("What bug does calc.py have?");
    await expect(app.tools()).toContainText("cat -n calc.py");
    await expect(app.permissions()).toHaveCount(0);
    await expect(app.entries("agent").last()).toContainText("subtracts 1 from the true mean");

    await app.picker("amp-mode").click();
    await app.pickerChoice("low").click();
    await expect(app.picker("amp-mode")).toHaveText("Low");
    await expect.poll(() => world.agents.requests("amp", "session/set_config_option").map((r) => r.params)).toEqual([
      expect.objectContaining({ configId: "amp-mode", value: "low" }),
    ]);
  });
});
