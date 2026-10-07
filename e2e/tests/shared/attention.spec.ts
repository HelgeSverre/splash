// Needs attention: permissions, failures and finished work wait in one inbox,
// survive a restart, and background sessions announce themselves.
import { expect, test } from "../../fixtures.ts";

test("a pending permission waits in the inbox until answered", async ({ splash }) => {
  const { app, page, world } = splash;
  world.agents.fixture("claude", "pool/read.jsonl");
  await app.newSession({ where: "in_place" });
  await app.send("Find calc.py");
  await app.expectStatus("awaiting_permission");

  await app.openNav("Needs attention");
  const waiting = page.getByRole("region", { name: "Waiting for permission" });
  await expect(waiting).toContainText("Find calc.py");
  await expect(waiting).toContainText("A tool needs your permission.");
  await expect(waiting.getByRole("button", { name: "Dismiss" })).toHaveCount(0);
  await waiting.getByRole("button", { name: "Answer permission" }).click();

  await expect(app.entries("permission").locator(".perm.pending")).toHaveCount(1);
  await app.entries("permission").locator(".perm.pending").getByRole("button").first().click();
  await app.entries("permission").locator(".perm.pending").getByRole("button").first().click();
  await expect(app.entries("turn_end")).toBeVisible();
  await app.openNav("Needs attention");
  await expect(page.getByRole("region", { name: "Waiting for permission" })).toHaveCount(0);
  await expect(page.getByRole("region", { name: "Ready to review" })).toContainText("Find calc.py");
});

test("a failed agent can be rechecked, reconnected or dismissed", async ({ splash }) => {
  const { app, page, world } = splash;
  world.agents.flags("claude", "--exit-mid-turn", "2");
  await app.newSession({ where: "in_place" });
  await app.send("What does subtract do?");
  await app.expectStatus("exited");

  await app.openNav("Needs attention");
  const recovery = page.getByRole("region", { name: "Needs recovery" });
  await expect(recovery).toContainText("What does subtract do?");

  // The connection test runs the agent without the conversation.
  await recovery.getByRole("button", { name: "Recheck agent" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Claude Code connected successfully. Reconnect the conversation when ready." })).toBeVisible();

  world.agents.flags("claude", "--fail-initialize");
  await recovery.getByRole("button", { name: "Recheck agent" }).click();
  await expect(page.getByRole("alert")).toContainText("adapter executable missing");

  await recovery.getByRole("button", { name: "Dismiss" }).click();
  await expect(page.getByRole("region", { name: "Needs recovery" })).toHaveCount(0);
  await expect(page.getByText("Nothing needs attention")).toBeVisible();
});

test("attention survives a restart; a session stopped mid-permission needs recovery", async ({ splash }) => {
  const { app, page, world } = splash;
  await app.newSession({ agent: "codex", where: "in_place" });
  await app.prompt("Have a look at calc.py");
  world.agents.fixture("claude", "pool/read.jsonl");
  await app.newSession({ agent: "claude", where: "in_place" });
  await app.send("Find calc.py");
  await app.expectStatus("awaiting_permission");

  // Stopping the backend stops its agents: the unanswered request is gone.
  await splash.restart();
  await app.openNav("Needs attention");
  await expect(page.getByRole("region", { name: "Ready to review" })).toContainText("Read calc.py and tell me in one sentence what bug it has");
  await expect(page.getByRole("region", { name: "Waiting for permission" })).toHaveCount(0);
  const recovery = page.getByRole("region", { name: "Needs recovery" });
  await expect(recovery).toContainText("Find calc.py");
  await recovery.getByRole("button", { name: "Reconnect agent" }).click();
  await expect(app.entries("permission").first().locator(".answer.rejected")).toHaveText("→ cancelled");
  await app.expectStatus("idle");
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
  await expect(background.locator(".dot")).toHaveClass(/awaiting_permission/, { timeout: 15_000 });
  await expect(background.locator(".needs")).toHaveAttribute("title", "Needs you");
  // The web version has no permission to show OS notifications, so it toasts.
  if (harness === "web")
    await expect(app.ui.toasts.filter({ hasText: "Find calc.py needs permission: Splash is waiting for you to allow or reject a tool call." })).toBeVisible();
  await background.click();
  await expect(app.entries("permission").locator(".perm.pending")).toHaveCount(1);
});

test.describe("with notifications off", () => {
  test.beforeEach(({ harness }) => test.skip(harness !== "web", "toasts are the web version's notifications"));

  test("a background session does not toast", async ({ splash }) => {
    const { app, page, world } = splash;
    await page.getByRole("button", { name: "Settings" }).click();
    const settings = page.getByRole("dialog", { name: "Settings" });
    await settings.getByRole("button", { name: "General", exact: true }).click();
    const toggle = settings.getByRole("switch", { name: "Notify when a background session needs you" });
    await expect(toggle).toBeChecked();
    await toggle.click();
    await expect(toggle).not.toBeChecked();
    await page.keyboard.press("Escape");

    world.agents.fixture("claude", "pool/read.jsonl");
    world.agents.speed("claude", 2);
    await app.newSession({ agent: "claude", where: "in_place" });
    await app.send("Find calc.py");
    await app.newSession({ agent: "glue", where: "in_place" });
    await expect(app.sessionRow("Find calc.py").locator(".needs")).toBeVisible({ timeout: 15_000 });
    await expect(app.ui.toasts.filter({ hasText: "needs permission" })).toHaveCount(0);
  });
});
