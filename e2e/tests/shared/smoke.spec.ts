// The release-blocking path: start a session, run a turn, review the result.
import { expect, test } from "../../fixtures.ts";

test("a new session runs a turn and asks for review", async ({ splash }) => {
  const { app, page, world, db } = splash;
  const id = await app.newSession({ agent: "claude", where: "in_place" });

  await expect(app.transcript.getByText("What should we work on?")).toBeVisible();
  const launches = world.agents.launches("claude");
  expect(launches).toHaveLength(1);
  expect(launches[0].cwd).toBe(world.repo);
  expect(launches[0].argv).toContain("@agentclientprotocol/claude-agent-acp@0.81.1");

  await app.prompt("What does subtract do?");
  await expect(app.entries("tool").getByText("Read calc.py")).toBeVisible();
  await expect(app.entries("agent").last()).toContainText("a - b");
  await expect(app.entries("turn_end").last()).toContainText("done");
  await app.expectStatus("idle");

  // Finished work waits for review in the sidebar and the inbox.
  await expect(app.sidebar.getByRole("button", { name: /^Needs attention/ })).toContainText("1");
  await expect(page.getByRole("tab", { name: "Review", selected: true })).toBeVisible();
  await app.openNav("Needs attention");
  const review = page.getByRole("region", { name: "Ready to review" });
  await expect(review).toContainText("The agent finished. Review its response and changes.");
  await review.getByRole("button", { name: "Mark reviewed" }).click();
  await expect(page.getByText("Nothing needs attention")).toBeVisible();

  await expect.poll(() => db.kinds(id)).toEqual(["user", "tool", "agent", "turn_end"]);
  const row = db.session(id)!;
  expect(row.isolation).toBe("in_place");
  expect(row.branch).toBe("main");
  expect(row.attention_json).toBeNull();
});
