// Resuming: saved history opens without an agent, Continue reconnects with
// session/resume or session/load, and a failed reconnect loses nothing.
import { expect, test } from "../../fixtures.ts";

test("saved history opens without starting the agent; Continue resumes it", async ({ splash }) => {
  const { app, page, world, db } = splash;
  const id = await app.newSession({ where: "in_place" });
  await app.prompt("What does subtract do?");
  await expect.poll(() => db.kinds(id)).toEqual(["user", "tool", "agent", "turn_end"]);

  await splash.restart();
  await app.sessionRow("What does subtract do?").click();
  await expect(app.entries("agent").last()).toContainText("a - b");
  await app.expectStatus("exited");
  await expect(page.getByText("Viewing saved history. Continue to reconnect the agent.")).toBeVisible();
  expect(world.agents.launches("claude")).toHaveLength(1);

  await page.getByRole("button", { name: "Continue conversation" }).click();
  await app.expectStatus("idle");
  // Claude can resume: the same agent session, no new one and no replay.
  const second = world.agents.audit("claude").slice(world.agents.audit("claude").findLastIndex((m) => m.method === "initialize"));
  const methods = second.map((m) => m.method).filter(Boolean);
  expect(methods).toContain("session/resume");
  expect(methods).not.toContain("session/new");
  expect(methods).not.toContain("session/load");
  expect(second.find((m) => m.method === "session/resume")!.params.sessionId).toBe(db.session(id)!.agent_session_id);
  await expect(app.entries("user")).toHaveCount(1);

  await app.prompt("And add?");
  await expect(app.entries("user")).toHaveCount(2);
});

test("an agent that can only load replays into the same transcript", async ({ splash }) => {
  const { app, page, world } = splash;
  // Pool's recording: session/load but no session/resume.
  world.agents.fixture("claude", "pool/read.jsonl");
  await app.newSession({ where: "in_place" });
  await app.send("Find calc.py");
  await app.allowPermissions(2);
  await expect(app.entries("turn_end")).toBeVisible();
  const entries = await app.transcript.locator("[data-kind]").count();

  await splash.restart();
  await app.sessionRow("Find calc.py").click();
  await page.getByRole("button", { name: "Continue conversation" }).click();
  await app.expectStatus("idle");
  expect(world.agents.requests("claude", "session/load")).toHaveLength(1);
  expect(world.agents.requests("claude", "session/resume")).toHaveLength(0);
  await expect(app.transcript.locator("[data-kind]")).toHaveCount(entries);
  await expect(app.entries("divider")).toHaveCount(0);
});

test("an agent that cannot restore a conversation says so", async ({ splash }) => {
  const { app, page } = splash;
  await app.newSession({ agent: "glue", where: "in_place" });
  await app.prompt("Hello");
  await splash.restart();
  await app.sessionRow("Hello").click();
  await page.getByRole("button", { name: "Continue conversation" }).click();
  await expect(app.entries("error").last()).toContainText("This agent cannot restore the saved conversation");
  await app.expectStatus("error");
});

test("a failed reconnect keeps the session id, the history and the draft", async ({ splash }) => {
  const { app, page, db } = splash;
  splash.world.agents.fixture("claude", "e2e/claude_missing.jsonl");
  const id = await app.newSession({ where: "in_place" });
  await app.prompt("What does subtract do?");
  const kinds = db.kinds(id);

  await splash.restart();
  await app.sessionRow("What does subtract do?").click();
  await app.composer.fill("My unsent question");
  await page.getByRole("button", { name: "Continue conversation" }).click();

  await app.expectStatus("error");
  await expect(page.getByText("Connection failed. Your saved conversation is preserved.")).toBeVisible();
  await expect(app.entries("error").last()).toContainText("Session not found");
  await expect(app.composer).toHaveValue("My unsent question");
  await expect(app.entries("agent").last()).toContainText("a - b");
  expect(db.session(id)!.agent_session_id).toBe("missing-session");
  await expect.poll(() => db.kinds(id).slice(0, kinds.length)).toEqual(kinds);

  await app.openNav("Needs attention");
  const recovery = page.getByRole("region", { name: "Needs recovery" });
  await expect(recovery).toContainText("What does subtract do?");
  await expect(recovery.getByRole("button", { name: "Reconnect agent" })).toBeVisible();
});

test("sending from saved history reconnects first", async ({ splash }) => {
  const { app, world } = splash;
  await app.newSession({ where: "in_place" });
  await app.prompt("What does subtract do?");
  await splash.restart();
  await app.sessionRow("What does subtract do?").click();
  await app.expectStatus("exited");

  await app.prompt("And add?");
  expect(world.agents.launches("claude")).toHaveLength(2);
  const methods = world.agents.audit("claude").map((m) => m.method).filter(Boolean);
  const resumed = methods.lastIndexOf("session/resume");
  expect(resumed).toBeGreaterThan(-1);
  expect(methods.lastIndexOf("session/prompt")).toBeGreaterThan(resumed);
});
