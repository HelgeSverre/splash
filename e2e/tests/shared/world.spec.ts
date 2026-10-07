// The World can be prepared before the backend starts.
import { expect, test } from "../../fixtures.ts";

test.use({ agents: ["claude", "pool"] });
test.beforeEach(({ world }) => world.signInPool());

test("an agent signed in before startup is offered as ready", async ({ splash }) => {
  const { app, page } = splash;
  await app.newSessionButton.click();
  const agents = page.getByRole("dialog", { name: "New session" }).getByRole("radiogroup", { name: "Agent" });
  await expect(agents.getByRole("radio", { name: /^Pool/ })).toContainText("v1.4.2");
  await expect(agents.getByRole("radio", { name: /^Pool/ })).toBeEnabled();
  await expect(agents.getByRole("radio", { name: /^Codex/ })).toContainText("not installed");
});
