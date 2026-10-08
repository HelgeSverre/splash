// The web version: signing in with the server token, losing the connection,
// and coming back after the server restarts.
import { expect, test } from "../../fixtures.ts";
import { Connection, Login } from "../../support/server.ts";

test.describe("sign in", () => {
  test.use({ signIn: false });

  test("the token signs in and out; a wrong one is refused", async ({ splash }) => {
    const { app, page, backend } = splash;
    const login = new Login(page);
    await page.goto(backend.url + "/");
    await expect(login.token).toBeVisible();

    await login.signIn("0".repeat(64));
    await expect(login.error).toHaveText("The token did not match. Copy it from this server's server.token file.");

    await login.signIn(backend.token());
    const connection = new Connection(page);
    await connection.expectStatus("online");
    await expect(connection.message).toHaveText("Connected · files and agents run on this server");
    await expect(connection.name).toHaveText("E2E box");
    await app.waitReady();
    expect(await page.content()).not.toContain(backend.token());

    const [cookie] = await page.context().cookies(backend.url);
    expect(cookie.name).toBe(`splash_auth_${backend.token().slice(0, 12)}`);
    expect(cookie.httpOnly).toBe(true);
    expect(cookie.sameSite).toBe("Strict");

    await connection.signOut.click();
    await expect(login.token).toBeVisible();
    const res = await page.request.post(backend.url + "/__cmd/list_sessions", { headers: { origin: backend.url } });
    expect(res.status()).toBe(401);
  });
});

test("a lost connection keeps drafts and blocks sending until it returns", async ({ splash }) => {
  const { app, page, backend } = splash;
  const connection = new Connection(page);
  await app.newSession({ where: "in_place" });
  await app.composer.fill("Keep this draft");

  await backend.stop();
  await connection.expectStatus("offline");
  await expect(connection.message).toHaveText("Connection lost · reconnecting");
  await expect(connection.error).toHaveText("Check that the server and SSH tunnel are running. Your drafts are kept here.");
  await expect(app.sendButton).toBeDisabled();
  await expect(app.composer).toHaveValue("Keep this draft");
  await expect(connection.retry).toBeVisible();

  // Retrying by hand is optional: the page keeps looking, every 2 s at most.
  await backend.start();
  await connection.expectStatus("online");
  await expect(app.composer).toHaveValue("Keep this draft");
  await expect(app.sendButton).toBeEnabled();
});

test("after a server restart the workspace is restored and the agent reconnects", async ({ splash }) => {
  const { app, page, backend, world } = splash;
  const id = await app.newSession({ where: "in_place" });
  await app.prompt("What does subtract do?");
  await app.composer.fill("Next question");
  const before = await (await page.request.get(backend.url + "/__server/state")).json();

  await splash.restart();
  await new Connection(page).expectStatus("online");
  const after = await (await page.request.get(backend.url + "/__server/state")).json();
  expect(after.instance).not.toBe(before.instance);

  // The agent died with the server: the transcript is the saved history.
  await expect(app.resumeNote).toContainText("Viewing saved history. Continue to reconnect the agent.");
  await app.expectStatus("exited");
  await expect(app.entries("agent").last()).toContainText("a - b");
  await expect(app.composer).toHaveValue("Next question");
  expect(world.agents.launches("claude")).toHaveLength(1);

  await app.continueButton.click();
  await app.expectStatus("idle");
  expect(world.agents.launches("claude")).toHaveLength(2);
  expect(world.agents.requests("claude", "session/resume").at(-1)?.params.sessionId).toBe(splash.db.session(id)!.agent_session_id);
});
