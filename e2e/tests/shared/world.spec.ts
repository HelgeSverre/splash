// The World can be prepared before the backend starts.
import { expect, test } from "../../fixtures.ts";

test.use({ agents: ["claude", "pool"] });
test.beforeEach(({ world }) => world.signInPool());

test("an agent signed in before startup is offered as ready", async ({ splash }) => {
  const { app } = splash;
  await app.newSessionButton.click();
  await expect(app.agentState("pool")).toHaveText("v1.4.2");
  await expect(app.dialogChoice("agent", "pool")).toBeEnabled();
  await expect(app.agentState("codex")).toHaveAttribute("data-tone", "err");
  await expect(app.agentState("codex")).toHaveText("not installed");
});
