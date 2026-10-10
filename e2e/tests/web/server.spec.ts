// The web version's own edges: choosing a project folder on the server, a
// command that fails in flight (never sent twice), and a server whose sign-in
// token changed.
import { mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "../../fixtures.ts";
import { Connection, FolderPicker, Login } from "../../support/server.ts";

test.describe("server folder picker", () => {
  test.use({ folders: "none" });
  test.beforeEach(({ world }) => {
    for (const dir of ["code/alpha", "code/beta", "Documents", ".hidden/inside", ".config"]) mkdirSync(join(world.home, dir), { recursive: true });
  });

  test("browses the server's folders and adds one", async ({ splash }) => {
    const { app, page, world, db } = splash;
    const home = (...parts: string[]) => join(world.home, ...parts);
    await app.addProjectButton.click();
    const picker = new FolderPicker(page);
    await expect(picker.dialog).toContainText("Choose a project on E2E box.");

    // It starts at the server's home folder. Dot-folders are not listed.
    await expect(picker.path).toHaveValue(world.home);
    await expect.poll(() => picker.folderPaths()).toEqual([home("code"), home("Documents")]);
    await expect(picker.up).toBeEnabled();

    await picker.folder(home("code")).click();
    await expect(picker.path).toHaveValue(home("code"));
    await expect.poll(() => picker.folderPaths()).toEqual([home("code", "alpha"), home("code", "beta")]);
    await picker.folder(home("code", "alpha")).click();
    await expect(picker.path).toHaveValue(home("code", "alpha"));
    await expect(picker.list).toContainText("No visible subfolders. You can select this folder or enter another path.");

    await picker.up.click();
    await expect(picker.path).toHaveValue(home("code"));
    await picker.home.click();
    await expect(picker.path).toHaveValue(world.home);

    // A typed path is only added once it has been opened.
    await picker.path.fill(home("code", "beta"));
    await expect(picker.add).toBeDisabled();
    await picker.path.press("Enter");
    await expect(picker.list).toHaveAttribute("aria-busy", "false");
    await expect(picker.path).toHaveValue(home("code", "beta"));
    await expect(picker.add).toBeEnabled();

    // Errors keep the listing, and nothing can be added until a folder opens.
    await picker.path.fill(home("missing"));
    await picker.go.click();
    await expect(picker.error).toHaveText("No folder exists at that path on the server");
    await expect(picker.add).toBeDisabled();
    await picker.path.fill("code/alpha");
    await picker.go.click();
    await expect(picker.error).toHaveText("Enter an absolute folder path on the server");
    await expect(picker.add).toBeDisabled();

    await picker.path.fill(home("code", "alpha"));
    await picker.go.click();
    await expect(picker.error).toHaveCount(0);
    await expect(picker.path).toHaveValue(home("code", "alpha"));
    await picker.add.click();
    await expect(picker.dialog).toBeHidden();
    await expect(app.projectRow(home("code", "alpha"))).toBeVisible();
    const projects = db.projects();
    expect(projects).toEqual([expect.objectContaining({ name: "alpha", path: home("code", "alpha"), is_git: 0 })]);
    await expect(app.dialogChoice("project", projects[0].id)).toBeChecked();
  });

  test("Cancel adds nothing", async ({ splash }) => {
    const { app, page, world, db } = splash;
    await app.addProjectButton.click();
    const picker = new FolderPicker(page);
    await picker.folder(join(world.home, "code")).click();
    await picker.cancel.click();
    await expect(picker.dialog).toBeHidden();
    await expect(app.newSessionDialog).toHaveCount(0);
    expect(db.projects()).toEqual([]);
  });
});

test("a command that fails in flight is not sent again", async ({ splash }) => {
  const { app, page, world, db } = splash;
  const connection = new Connection(page);
  const id = await app.newSession({ where: "in_place" });
  const sent: string[] = [];
  page.on("request", (r) => r.url().endsWith("/__cmd/send_prompt") && sent.push(r.url()));
  await page.route("**/__cmd/send_prompt", (route) => route.abort("connectionreset"), { times: 1 });
  // Hold the connection check down too, so the lost connection stays in view.
  await page.route("**/__server/state", (route) => route.abort("connectionrefused"));

  await app.composer.fill("Did this arrive?");
  await app.composer.press("Enter");
  await expect(app.ui.errorToasts).toBeVisible();
  await connection.expectStatus("offline");
  await expect(connection.message).toHaveText("Connection lost · reconnecting");
  await expect(app.sendButton).toBeDisabled();
  await expect(app.composer).toHaveValue("Did this arrive?");

  // Back online by itself: still exactly one attempt, and nothing reached the agent.
  await page.unroute("**/__server/state");
  await connection.expectStatus("online");
  await expect(connection.message).toHaveText("Connected · files and agents run on this server");
  expect(sent).toHaveLength(1);
  await expect(app.entries("user")).toHaveCount(0);
  expect(world.agents.requests("claude", "session/prompt")).toEqual([]);
  expect(db.kinds(id)).toEqual([]);

  // Sending again is the user's call, and it goes once.
  await app.composer.press("Enter");
  await expect(app.entries("turn_end")).toHaveCount(1);
  await expect(app.entries("user")).toHaveCount(1);
  await expect(app.entries("user")).toContainText("Did this arrive?");
  expect(sent).toHaveLength(2);
  const prompts = world.agents.requests("claude", "session/prompt");
  expect(prompts).toHaveLength(1);
  expect(prompts[0].params.prompt).toEqual([expect.objectContaining({ type: "text", text: "Did this arrive?" })]);
  await expect.poll(() => db.kinds(id)).toEqual(["user", "tool", "agent", "turn_end"]);
});

test("a server with a new token asks to sign in again", async ({ splash }) => {
  const { app, page, backend, world } = splash;
  const connection = new Connection(page);
  await app.newSession({ where: "in_place" });
  await app.composer.fill("Unsent draft");
  const old = backend.token();

  await backend.stop();
  rmSync(join(world.data, "server.token"));
  await backend.start();
  expect(backend.token()).not.toBe(old);

  await connection.expectStatus("auth", 15_000);
  await expect(connection.message).toHaveText("Sign in again to reconnect");
  await expect(connection.error).toHaveCount(0);
  await expect(app.sendButton).toBeDisabled();
  // The old sign-in no longer counts for anything.
  const res = await page.request.post(backend.url + "/__cmd/list_sessions", { headers: { origin: backend.url } });
  expect(res.status()).toBe(401);
  await connection.signIn.click();
  const login = new Login(page);
  await expect(login.token).toBeVisible();

  await login.signIn(old);
  await expect(login.error).toContainText("The token did not match");
  await login.signIn(backend.token());
  await connection.expectStatus("online");
  await expect(connection.message).toHaveText("Connected · files and agents run on this server");
  await expect(app.sessionRow("New session")).toBeVisible();
  const names = (await page.context().cookies(backend.url)).map((c) => c.name);
  expect(names).toContain(`splash_auth_${backend.token().slice(0, 12)}`);
});
