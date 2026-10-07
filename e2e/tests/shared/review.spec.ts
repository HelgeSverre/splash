// The Review tab: the latest response, failed tools, changed files, feedback
// for the agent, and asking it to review its own work.
import { expect, test } from "../../fixtures.ts";
import { Review } from "../../support/views.ts";

test("the review shows the response and the tools that failed", async ({ splash }) => {
  const { app, page, world } = splash;
  world.agents.fixture("claude", "pool/read.jsonl");
  await app.newSession({ where: "in_place" });
  await app.send("Find calc.py");
  await app.allowPermissions(2);
  await expect(app.turnEnds()).toBeVisible();

  // Finishing selects the Review tab.
  await expect(app.sideTab("review")).toHaveAttribute("aria-selected", "true");
  const review = new Review(page);
  const latest = await app.entries("agent").last().innerText();
  await expect(review.latest).toContainText(latest.trim().split("\n")[0]);
  await expect(review.failures).toHaveAttribute("data-count", "1");
  await expect(review.failure).toContainText("calc.py");
  await expect(review.reviewAllChanges).toBeDisabled();

  await review.markReviewed.click();
  await expect(review.markReviewed).toHaveCount(0);
  await expect(app.attentionCount).toHaveText("");
});

test("feedback and review requests go to the agent as prompts", async ({ splash }) => {
  const { app, page, world } = splash;
  await app.newSession({ where: "in_place" });
  await app.prompt("What does subtract do?");
  await app.sideTab("review").click();

  const review = new Review(page);
  await review.feedback.fill("Rename subtract to minus in calc.py:5.");
  await review.sendFeedback.click();
  await expect(app.sessionTab("chat")).toHaveAttribute("aria-selected", "true");
  await expect(app.turnEnds()).toHaveCount(2);
  await expect(review.feedback).toHaveValue("");

  await review.askForReview.click();
  await expect(app.turnEnds()).toHaveCount(3);
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
  await app.sideTab("review").click();
  await app.send("Write a long essay");
  await app.expectStatus("running");
  const review = new Review(page);
  await expect(review.sendFeedback).toBeDisabled();
  await expect(review.askForReview).toBeDisabled();
  await app.stopButton.click();
  await app.expectStatus("idle");
  await expect(review.askForReview).toBeEnabled();
});
