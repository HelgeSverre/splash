// ```mermaid fences in agent messages: drawn as diagrams once the fence is
// complete, with the source a click away, and left as code when invalid.
import { expect, test } from "../../fixtures.ts";

test.beforeEach(({ world }) => world.agents.fixture("claude", "e2e/mermaid.jsonl"));

test("finished fences are drawn, an invalid one keeps its source, and the source can be shown", async ({ splash }) => {
  const { app } = splash;
  await app.newSession({ where: "in_place" });
  await app.prompt("Draw how a prompt gets from the composer to the agent");

  const blocks = app.diagrams();
  await expect(blocks).toHaveCount(4);
  await expect(app.diagrams("ready")).toHaveCount(3);
  const flow = app.diagram(blocks.nth(0));
  await expect(flow.svg).toBeVisible();
  await expect(flow.svg).toContainText("Session store");
  await expect(flow.source).toBeHidden();
  const sequence = app.diagram(blocks.nth(1));
  await expect(sequence.svg).toContainText("session/prompt");
  const states = app.diagram(blocks.nth(2));
  await expect(states.svg).toContainText("awaiting_permission");

  // The fence mermaid can't parse stays a code block, with the error under it.
  const broken = app.diagram(blocks.nth(3));
  await expect(blocks.nth(3)).toHaveAttribute("data-status", "error");
  await expect(broken.svg).toHaveCount(0);
  await expect(broken.source).toBeVisible();
  await expect(broken.source).toContainText("A --> B -->");
  await expect(broken.error).toContainText("Not a valid diagram");
  await expect(broken.sourceToggle).toBeHidden();

  // Source shows the fence's text instead of the drawing, and back.
  await expect(flow.sourceToggle).toHaveAttribute("aria-pressed", "false");
  await flow.sourceToggle.click();
  await expect(flow.sourceToggle).toHaveAttribute("aria-pressed", "true");
  await expect(blocks.nth(0)).toHaveAttribute("data-view", "source");
  await expect(flow.source).toBeVisible();
  await expect(flow.source).toContainText('C["Composer"] --> S["Session store"]');
  await expect(flow.svg).toBeHidden();
  await flow.sourceToggle.click();
  await expect(flow.svg).toBeVisible();

  // Wide diagrams scroll at actual size rather than shrinking too far; the button flips it.
  await expect(blocks.nth(0)).toHaveAttribute("data-size", "actual");
  await expect(flow.sizeToggle).toHaveAttribute("aria-pressed", "true");
  await flow.sizeToggle.click();
  await expect(blocks.nth(0)).toHaveAttribute("data-size", "fit");
});

test("an open fence streams as code and is drawn only once it closes", async ({ splash }) => {
  const { app, world } = splash;
  // At recorded speed the first fence arrives in two chunks 4 s apart.
  world.agents.speed("claude", 1);
  await app.newSession({ where: "in_place" });
  await app.send("Draw how a prompt gets from the composer to the agent");
  await expect(app.codeBlocks.first()).toContainText('S --> A{"Agent running?"}');
  await expect(app.diagrams()).toHaveCount(0);

  // Once closed, it is drawn; the first diagram also loads mermaid.
  await expect(app.diagrams("ready").first()).toBeVisible({ timeout: 20_000 });
  await expect(app.codeBlocks).toHaveCount(0);
  await expect(app.turnEnds()).toHaveAttribute("data-stop-reason", "end_turn");
  await expect(app.diagrams("ready")).toHaveCount(3);
});

test("diagrams are drawn again from saved history", async ({ splash }) => {
  const { app } = splash;
  await app.newSession({ where: "in_place" });
  await app.prompt("Draw how a prompt gets from the composer to the agent");
  await expect(app.diagrams("ready")).toHaveCount(3);
  await splash.restart();
  await expect(app.diagrams("ready")).toHaveCount(3);
  await expect(app.diagram(app.diagrams().nth(1)).svg).toContainText("session/prompt");
});
