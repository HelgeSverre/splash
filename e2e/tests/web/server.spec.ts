// The web version's own edges: choosing a project folder on the server, a
// command that fails in flight (never sent twice), and a server whose sign-in
// token changed.
import { mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "../../fixtures.ts";

test.describe("server folder picker", () => {
  test.use({ folders: "none" });
  test.beforeEach(({ world }) => {
    for (const dir of ["code/alpha", "code/beta", "Documents", ".hidden/inside", ".config"]) mkdirSync(join(world.home, dir), { recursive: true });
  });

  test("browses the server's folders and adds one", async ({ splash }) => {
    const { app, page, world, db } = splash;
    await app.sidebar.getByRole("button", { name: "Add a project folder" }).first().click();
    const picker = page.getByRole("dialog", { name: "Add a folder on the server" });
    const input = picker.getByLabel("Server folder path");
    const folders = picker.locator(".folders");
    const add = picker.getByRole("button", { name: "Add this folder" });
    const listed = () => folders.getByRole("button");
    await expect(picker).toContainText("Choose a project on E2E box.");

    // It starts at the server's home folder. Dot-folders are not listed.
    await expect(input).toHaveValue(world.home);
    await expect(listed()).toHaveText(["code›", "Documents›"]);
    await expect(picker.getByRole("button", { name: "Up one folder" })).toBeEnabled();

    await listed().filter({ hasText: "code" }).click();
    await expect(input).toHaveValue(join(world.home, "code"));
    await expect(listed()).toHaveText(["alpha›", "beta›"]);
    await listed().filter({ hasText: "alpha" }).click();
    await expect(input).toHaveValue(join(world.home, "code", "alpha"));
    await expect(folders).toContainText("No visible subfolders. You can select this folder or enter another path.");

    await picker.getByRole("button", { name: "Up one folder" }).click();
    await expect(input).toHaveValue(join(world.home, "code"));
    await picker.getByRole("button", { name: "Home" }).click();
    await expect(input).toHaveValue(world.home);

    // A typed path is only added once it has been opened.
    await input.fill(join(world.home, "code", "beta"));
    await expect(add).toBeDisabled();
    await input.press("Enter");
    await expect(folders).toHaveAttribute("aria-busy", "false");
    await expect(input).toHaveValue(join(world.home, "code", "beta"));
    await expect(add).toBeEnabled();

    // Errors keep the listing, and nothing can be added until a folder opens.
    await input.fill(join(world.home, "missing"));
    await picker.getByRole("button", { name: "Go" }).click();
    await expect(picker.getByRole("alert")).toContainText("No such file or directory");
    await expect(add).toBeDisabled();
    await input.fill("code/alpha");
    await picker.getByRole("button", { name: "Go" }).click();
    await expect(picker.getByRole("alert")).toHaveText("Enter an absolute folder path on the server");
    await expect(add).toBeDisabled();

    await input.fill(join(world.home, "code", "alpha"));
    await picker.getByRole("button", { name: "Go" }).click();
    await expect(picker.getByRole("alert")).toHaveCount(0);
    await expect(input).toHaveValue(join(world.home, "code", "alpha"));
    await add.click();
    await expect(picker).toBeHidden();
    await expect(app.projectRow("alpha")).toBeVisible();
    await expect(page.getByRole("dialog", { name: "New session" }).getByRole("radio", { name: /^alpha/ })).toBeChecked();
    expect(db.projects()).toEqual([expect.objectContaining({ name: "alpha", path: join(world.home, "code", "alpha"), is_git: 0 })]);
  });

  test("Cancel adds nothing", async ({ splash }) => {
    const { app, page, db } = splash;
    await app.sidebar.getByRole("button", { name: "Add a project folder" }).first().click();
    const picker = page.getByRole("dialog", { name: "Add a folder on the server" });
    await picker.locator(".folders").getByRole("button", { name: /^code/ }).click();
    await picker.getByRole("button", { name: "Cancel" }).click();
    await expect(picker).toBeHidden();
    await expect(page.getByRole("dialog", { name: "New session" })).toHaveCount(0);
    expect(db.projects()).toEqual([]);
  });
});

test("a command that fails in flight is not sent again", async ({ splash }) => {
  const { app, page, world, db } = splash;
  const id = await app.newSession({ where: "in_place" });
  const sent: string[] = [];
  page.on("request", (r) => r.url().endsWith("/__cmd/send_prompt") && sent.push(r.url()));
  await page.route("**/__cmd/send_prompt", (route) => route.abort("connectionreset"), { times: 1 });
  // Hold the connection check down too, so the lost connection stays in view.
  await page.route("**/__server/state", (route) => route.abort("connectionrefused"));

  await app.composer.fill("Did this arrive?");
  await app.composer.press("Enter");
  await expect(page.locator(".elyra-toast.error")).toBeVisible();
  await expect(page.getByRole("status").filter({ hasText: "Connection lost · reconnecting" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Send" })).toBeDisabled();
  await expect(app.composer).toHaveValue("Did this arrive?");

  // Back online: still exactly one attempt, and nothing reached the agent.
  await page.unroute("**/__server/state");
  await page.getByRole("button", { name: "Retry connection" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Connected · files and agents run on this server" })).toBeVisible();
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
  await app.newSession({ where: "in_place" });
  await app.composer.fill("Unsent draft");
  const old = backend.token();

  await backend.stop();
  rmSync(join(world.data, "server.token"));
  await backend.start();
  expect(backend.token()).not.toBe(old);

  await expect(page.getByRole("status").filter({ hasText: "Sign in again to reconnect" })).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole("button", { name: "Send" })).toBeDisabled();
  // The old sign-in no longer counts for anything.
  const res = await page.request.post(backend.url + "/__cmd/list_sessions", { headers: { origin: backend.url } });
  expect(res.status()).toBe(401);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Connect to your workspace" })).toBeVisible();

  await page.getByLabel("Server token").fill(old);
  await page.getByRole("button", { name: "Connect to server" }).click();
  await expect(page.getByRole("alert")).toContainText("The token did not match");
  await page.getByLabel("Server token").fill(backend.token());
  await page.getByRole("button", { name: "Connect to server" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Connected · files and agents run on this server" })).toBeVisible();
  await expect(app.sessionRow("New session")).toBeVisible();
  const names = (await page.context().cookies(backend.url)).map((c) => c.name);
  expect(names).toContain(`splash_auth_${backend.token().slice(0, 12)}`);
});
