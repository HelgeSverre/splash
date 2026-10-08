// Needs attention: permissions, failures and finished work wait in one inbox,
// survive a restart, and background sessions announce themselves.
import { expect, test } from "../../fixtures.ts";
import { Settings } from "../../support/settings.ts";
import { Attention } from "../../support/views.ts";

test("a pending permission waits in the inbox until answered", async ({ splash }) => {
  const { app, page, world } = splash;
  world.agents.fixture("claude", "pool/read.jsonl");
  const id = await app.newSession({ where: "in_place" });
  await app.send("Find calc.py");
  await app.expectStatus("awaiting_permission");

  await app.openNav("attention");
  const attention = new Attention(page);
  const item = attention.item(id, "permission");
  await expect(attention.title(item)).toHaveText("Find calc.py");
  await expect(attention.detail(item)).toHaveText("A tool needs your permission.");
  // An unanswered request can't be dismissed.
  await expect(attention.dismiss(item)).toHaveCount(0);
  await attention.open(item).click();

  await expect(app.permissions("pending")).toHaveCount(1);
  await app.allowPermissions(2);
  await expect(app.turnEnds()).toBeVisible();
  await app.openNav("attention");
  await expect(attention.group("permission")).toHaveCount(0);
  await expect(attention.item(id, "review")).toBeVisible();
});

test("a failed agent can be rechecked, reconnected or dismissed", async ({ splash }) => {
  const { app, page, world } = splash;
  world.agents.flags("claude", "--exit-mid-turn", "2");
  const id = await app.newSession({ where: "in_place" });
  await app.send("What does subtract do?");
  await app.expectStatus("exited");

  await app.openNav("attention");
  const attention = new Attention(page);
  const item = attention.item(id, "failed");
  // How the agent exited and what it said, not the protocol's closed connection.
  await expect(attention.detail(item)).toHaveText("Claude Code exited: exit status: 1\nfake-acp: lost connection to the model provider");

  // The connection test runs the agent without the conversation.
  await attention.recheck(item).click();
  await expect(attention.checked).toHaveText("Claude Code connected successfully. Reconnect the conversation when ready.");

  world.agents.flags("claude", "--fail-initialize");
  await attention.recheck(item).click();
  await expect(attention.error).toContainText("adapter executable missing");

  await attention.dismiss(item).click();
  await expect(attention.group("failed")).toHaveCount(0);
  await expect(attention.empty).toBeVisible();
});

test("attention survives a restart; a permission it interrupted waits for a reconnect", async ({ splash }) => {
  const { app, page, world } = splash;
  const reviewed = await app.newSession({ agent: "codex", where: "in_place" });
  await app.prompt("Have a look at calc.py");
  world.agents.fixture("claude", "pool/read.jsonl");
  const waiting = await app.newSession({ agent: "claude", where: "in_place" });
  await app.send("Find calc.py");
  await app.expectStatus("awaiting_permission");

  // Stopping the backend stops its agents. That isn't the agent failing, so
  // the item stays a permission, though the old request can't be answered.
  await splash.restart();
  await app.openNav("attention");
  const attention = new Attention(page);
  await expect(attention.item(reviewed, "review")).toBeVisible();
  await expect(attention.group("failed")).toHaveCount(0);
  const item = attention.item(waiting, "permission");
  await expect(attention.detail(item)).toHaveText(
    "The agent stopped while waiting for permission. Reconnect to continue; the old request can no longer be answered.",
  );
  await attention.reconnect(item).click();
  await expect(app.permissionAnswer(app.permissions("rejected"))).toHaveText("→ cancelled");
  await app.expectStatus("idle");
  await app.openNav("attention");
  await expect(attention.group("permission")).toHaveCount(0);
});

test("a turn a restart interrupted needs recovery", async ({ splash }) => {
  const { app, page, world } = splash;
  world.agents.fixture("claude", "claude/cancel.jsonl");
  world.agents.speed("claude", 1);
  const id = await app.newSession({ where: "in_place" });
  await app.send("Write a long essay");
  await app.expectStatus("running");

  await splash.restart();
  await app.openNav("attention");
  const attention = new Attention(page);
  const item = attention.item(id, "failed");
  await expect(attention.detail(item)).toHaveText("Splash stopped while the agent was working. Reconnect to continue.");
  await attention.reconnect(item).click();
  await expect(app.entries("error").last()).toHaveText("Splash stopped while the agent was working.");
  await expect(app.turnEnds()).toHaveAttribute("data-stop-reason", "cancelled");
  await app.expectStatus("idle");
  await app.openNav("attention");
  await expect(attention.group("failed")).toHaveCount(0);
});

test("a background session that needs you is marked unread", async ({ splash }) => {
  const { app, world, harness } = splash;
  world.agents.fixture("claude", "pool/read.jsonl");
  world.agents.speed("claude", 2);
  await app.newSession({ agent: "claude", where: "in_place" });
  await app.send("Find calc.py");
  // Its first permission request comes about 4 s later; look elsewhere.
  await app.newSession({ agent: "glue", where: "in_place" });

  const background = app.sessionRow("Find calc.py");
  await expect(background).toHaveAttribute("data-status", "awaiting_permission", { timeout: 15_000 });
  await expect(app.needsYou(background)).toBeVisible();
  // The web version has no permission to show OS notifications, so it toasts.
  if (harness === "web")
    await expect(app.ui.toasts.filter({ hasText: "Find calc.py needs permission: Splash is waiting for you to allow or reject a tool call." })).toBeVisible();
  await background.click();
  await expect(app.permissions("pending")).toHaveCount(1);
});

test.describe("with notifications off", () => {
  test.beforeEach(({ harness }) => test.skip(harness !== "web", "toasts are the web version's notifications"));

  test("a background session does not toast", async ({ splash }) => {
    const { app, page, world } = splash;
    const settings = new Settings(app);
    await settings.open();
    await expect(settings.notify).toBeChecked();
    await settings.notify.click();
    await expect(settings.notify).not.toBeChecked();
    await page.keyboard.press("Escape");

    world.agents.fixture("claude", "pool/read.jsonl");
    world.agents.speed("claude", 2);
    await app.newSession({ agent: "claude", where: "in_place" });
    await app.send("Find calc.py");
    await app.newSession({ agent: "glue", where: "in_place" });
    await expect(app.needsYou(app.sessionRow("Find calc.py"))).toBeVisible({ timeout: 15_000 });
    await expect(app.ui.toasts.filter({ hasText: "needs permission" })).toHaveCount(0);
  });
});
