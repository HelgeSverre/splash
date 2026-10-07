// The web version: signing in with the server token, losing the connection,
// and coming back after the server restarts.
import { expect, test } from "../../fixtures.ts";

test.describe("sign in", () => {
  test.use({ signIn: false });

  test("the token signs in and out; a wrong one is refused", async ({ splash }) => {
    const { page, backend } = splash;
    await page.goto(backend.url + "/");
    await expect(page.getByRole("heading", { name: "Connect to your workspace" })).toBeVisible();

    await page.getByLabel("Server token").fill("0".repeat(64));
    await page.getByRole("button", { name: "Connect to server" }).click();
    await expect(page.getByRole("alert")).toContainText("The token did not match");

    await page.getByLabel("Server token").fill(backend.token());
    await page.getByRole("button", { name: "Connect to server" }).click();
    await expect(page.getByRole("status").filter({ hasText: "Connected · files and agents run on this server" })).toBeVisible();
    await expect(page.locator(".server-connection strong")).toHaveText("E2E box");
    expect(await page.content()).not.toContain(backend.token());

    const [cookie] = await page.context().cookies(backend.url);
    expect(cookie.name).toBe(`splash_auth_${backend.token().slice(0, 12)}`);
    expect(cookie.httpOnly).toBe(true);
    expect(cookie.sameSite).toBe("Strict");

    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page.getByRole("heading", { name: "Connect to your workspace" })).toBeVisible();
    const res = await page.request.post(backend.url + "/__cmd/list_sessions", { headers: { origin: backend.url } });
    expect(res.status()).toBe(401);
  });
});

test("a lost connection keeps drafts and blocks sending until it returns", async ({ splash }) => {
  const { app, page, backend } = splash;
  await app.newSession({ where: "in_place" });
  await app.composer.fill("Keep this draft");

  await backend.stop();
  await expect(page.getByRole("status").filter({ hasText: "Connection lost · reconnecting" })).toBeVisible();
  await expect(page.getByText("Check that the server and SSH tunnel are running. Your drafts are kept here.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Retry connection" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Send" })).toBeDisabled();
  await expect(app.composer).toHaveValue("Keep this draft");

  await backend.start();
  await page.getByRole("button", { name: "Retry connection" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Connected · files and agents run on this server" })).toBeVisible();
  await expect(app.composer).toHaveValue("Keep this draft");
  await expect(page.getByRole("button", { name: "Send" })).toBeEnabled();
});

test("after a server restart the workspace is restored and the agent reconnects", async ({ splash }) => {
  const { app, page, backend, world } = splash;
  const id = await app.newSession({ where: "in_place" });
  await app.prompt("What does subtract do?");
  await app.composer.fill("Next question");
  const before = await (await page.request.get(backend.url + "/__server/state")).json();

  await splash.restart();
  await expect(page.getByRole("status").filter({ hasText: "Connected · files and agents run on this server" })).toBeVisible({ timeout: 15_000 });
  const after = await (await page.request.get(backend.url + "/__server/state")).json();
  expect(after.instance).not.toBe(before.instance);

  // The agent died with the server: the transcript is the saved history.
  await expect(page.getByText("Viewing saved history. Continue to reconnect the agent.")).toBeVisible();
  await app.expectStatus("exited");
  await expect(app.entries("agent").last()).toContainText("a - b");
  await expect(app.composer).toHaveValue("Next question");
  expect(world.agents.launches("claude")).toHaveLength(1);

  await page.getByRole("button", { name: "Continue conversation" }).click();
  await app.expectStatus("idle");
  expect(world.agents.launches("claude")).toHaveLength(2);
  expect(world.agents.requests("claude", "session/resume").at(-1)?.params.sessionId).toBe(splash.db.session(id)!.agent_session_id);
});
