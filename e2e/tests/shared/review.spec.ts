// The Review tab: the latest response, failed tools, changed files, feedback
// for the agent, and asking it to review its own work.
import { expect, test } from "../../fixtures.ts";

test("the review shows the response and the tools that failed", async ({ splash }) => {
  const { app, page, world } = splash;
  world.agents.fixture("claude", "pool/read.jsonl");
  await app.newSession({ where: "in_place" });
  await app.send("Find calc.py");
  await app.allowPermissions(2);
  await expect(app.entries("turn_end")).toBeVisible();

  // Finishing selects the Review tab.
  await expect(app.sideTab("Review")).toHaveAttribute("aria-selected", "true");
  const review = page.getByRole("tabpanel").filter({ has: page.getByRole("heading", { name: "Review work" }) });
  await expect(review.getByRole("heading", { name: "Latest response" })).toBeVisible();
  const latest = await app.entries("agent").last().innerText();
  await expect(review).toContainText(latest.trim().split("\n")[0]);
  await expect(review.getByRole("heading", { name: "Errors and failed tools · 1" })).toBeVisible();
  await expect(review.getByRole("button", { name: "Review all changes" })).toBeDisabled();

  await review.getByRole("button", { name: "Mark reviewed" }).click();
  await expect(review.getByRole("button", { name: "Mark reviewed" })).toHaveCount(0);
  await expect(app.sidebar.getByRole("button", { name: /^Needs attention/ })).not.toContainText(/\d/);
});

test("feedback and review requests go to the agent as prompts", async ({ splash }) => {
  const { app, page, world } = splash;
  await app.newSession({ where: "in_place" });
  await app.prompt("What does subtract do?");
  await app.sideTab("Review").click();

  const feedback = page.getByLabel("Feedback for the agent");
  await feedback.fill("Rename subtract to minus in calc.py:5.");
  await page.getByRole("button", { name: "Send feedback" }).click();
  await expect(page.getByRole("tablist", { name: "Session tabs" }).getByRole("tab", { name: "Chat", selected: true })).toBeVisible();
  await expect(app.entries("turn_end")).toHaveCount(2);
  await expect(feedback).toHaveValue("");

  await page.getByRole("button", { name: "Ask agent to review" }).click();
  await expect(app.entries("turn_end")).toHaveCount(3);
  const prompts = world.agents.requests("claude", "session/prompt").map((r) => r.params.prompt[0].text);
  expect(prompts).toEqual([
    "What does subtract do?",
    "Review feedback for this conversation:\n\nRename subtract to minus in calc.py:5.",
    expect.stringMatching(/^Review the changes you made in this conversation\. Check for correctness, regressions, and missing validation\./),
  ]);
});

test("review buttons wait while the agent works", async ({ splash }) => {
  const { app, page, world } = splash;
  world.agents.fixture("claude", "claude/cancel.jsonl");
  world.agents.speed("claude", 1);
  await app.newSession({ where: "in_place" });
  await app.sideTab("Review").click();
  await app.send("Write a long essay");
  await app.expectStatus("running");
  await expect(page.getByRole("button", { name: "Send feedback" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Ask agent to review" })).toBeDisabled();
  await app.stopButton.click();
  await app.expectStatus("idle");
  await expect(page.getByRole("button", { name: "Ask agent to review" })).toBeEnabled();
});
