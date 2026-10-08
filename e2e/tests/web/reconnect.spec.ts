// The seconds after the web version's server restarts: actions that need the
// server wait for it, one that fails anyway says why in plain words, and the
// page is back long before its 5 s connection check would have noticed.
import { expect, test } from "../../fixtures.ts";
import { Connection } from "../../support/server.ts";
import { Attention } from "../../support/views.ts";

test("actions wait for a restarting server, which is back within seconds", async ({ splash }) => {
  const { app, page, backend, world } = splash;
  const connection = new Connection(page);
  const attention = new Attention(page);
  const instance = async () => (await (await page.request.get(backend.url + "/__server/state")).json()).instance;
  world.agents.flags("claude", "--exit-mid-turn", "2");
  const id = await app.newSession({ where: "in_place" });
  await app.send("What does subtract do?");
  await app.expectStatus("exited");
  world.agents.flags("claude");
  await expect(app.continueButton).toBeEnabled();

  // While the server is away, actions that need it are held back, and one
  // that is not fails in plain words.
  await backend.stop();
  await connection.expectStatus("offline");
  await expect(app.continueButton).toBeDisabled();
  await app.picker("model").click();
  await app.pickerChoice("sonnet").click();
  await expect(app.ui.errorToasts.filter({ hasText: "Reconnecting to the server. Try again in a moment." })).toBeVisible();

  // Back, but with a new IPC token the page doesn't have yet: the server
  // refuses what it sends. Holding back the page's checks keeps it there.
  await connection.holdChecks();
  await backend.start();
  await app.picker("model").click();
  await app.pickerChoice("sonnet").click();
  await expect(app.ui.errorToasts.filter({ hasText: "The server restarted. Try again in a moment." })).toBeVisible();
  await app.openNav("attention");
  const item = attention.item(id, "failed");
  await expect(attention.reconnect(item)).toBeDisabled();
  await expect(attention.recheck(item)).toBeDisabled();
  await expect(attention.dismiss(item)).toBeDisabled();
  await connection.releaseChecks();
  await connection.expectInstance(await instance());
  await attention.reconnect(item).click();
  await app.expectStatus("idle");
  await expect(app.ui.errorToasts.filter({ hasText: /IPC|fetch/ })).toHaveCount(0);

  // A restart is noticed as the event stream breaks, not at the next 5 s check.
  await app.composer.fill("Next question");
  const before = await instance();
  await backend.restart();
  const restarted = Date.now();
  const after = await instance();
  expect(after).not.toBe(before);
  await connection.expectInstance(after, 2_000);
  expect(Date.now() - restarted).toBeLessThan(2_000);

  await app.continueButton.click();
  await app.expectStatus("idle");
  await expect(app.composer).toHaveValue("Next question");
  expect(world.agents.launches("claude")).toHaveLength(3);
});
