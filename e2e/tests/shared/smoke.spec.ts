// The release-blocking path: start a session, run a turn, review the result.
import { expect, test } from "../../fixtures.ts";
import { Attention } from "../../support/views.ts";

test("a new session runs a turn and asks for review", async ({ splash }) => {
  const { app, page, world, db } = splash;
  const id = await app.newSession({ agent: "claude", where: "in_place" });

  await expect(app.transcriptEmpty).toBeVisible();
  const launches = world.agents.launches("claude");
  expect(launches).toHaveLength(1);
  expect(launches[0].cwd).toBe(world.repo);
  expect(launches[0].argv).toContain("@agentclientprotocol/claude-agent-acp@0.81.1");

  await app.prompt("What does subtract do?");
  await expect(app.tools("read")).toHaveAttribute("data-status", "completed");
  await expect(app.entries("agent").last()).toContainText("a - b");
  await expect(app.turnEnds().last()).toHaveAttribute("data-stop-reason", "end_turn");
  await app.expectStatus("idle");

  // Finished work waits for review in the sidebar and the inbox.
  await expect(app.attentionCount).toHaveText("1");
  await expect(app.sideTab("review")).toHaveAttribute("aria-selected", "true");
  await app.openNav("attention");
  const attention = new Attention(page);
  const item = attention.item(id, "review");
  await expect(attention.detail(item)).toHaveText("The agent finished. Review its response and changes.");
  await attention.dismiss(item).click();
  await expect(attention.empty).toBeVisible();

  await expect.poll(() => db.kinds(id)).toEqual(["user", "tool", "agent", "turn_end"]);
  const row = db.session(id)!;
  expect(row.isolation).toBe("in_place");
  expect(row.branch).toBe("main");
  expect(row.attention_json).toBeNull();
});
