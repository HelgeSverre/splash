// Projects and sessions: adding and removing projects, starting sessions in
// place or in a worktree, renaming, archiving and deleting them.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "../../fixtures.ts";
import { branchExists, status } from "../../support/git.ts";

test.describe("without projects", () => {
  test.use({ folders: "none" });

  test("adding a project folder offers a new session in it", async ({ splash }) => {
    const { app, page, world, db } = splash;
    await expect(app.sidebar.getByRole("button", { name: "Add a project folder" })).toHaveCount(2);
    await splash.addProject(world.repo);

    await expect(app.projectRow("repo")).toBeVisible();
    const dialog = page.getByRole("dialog", { name: "New session" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("radiogroup", { name: "Project" }).getByRole("radio", { name: /^repo/ })).toBeChecked();
    expect(db.projects()).toEqual([expect.objectContaining({ name: "repo", path: world.repo, is_git: 1 })]);
  });

  test("a folder that is not a git repository can only work in place", async ({ splash }) => {
    const { page, world, db } = splash;
    const notes = world.folder("notes", { "todo.md": "- write tests\n" });
    await splash.addProject(notes);

    const dialog = page.getByRole("dialog", { name: "New session" });
    const where = dialog.getByRole("radiogroup", { name: "Where it works" });
    await expect(where.getByRole("radio", { name: /New worktree/ })).toBeDisabled();
    await expect(where.getByRole("radio", { name: /New worktree/ })).toContainText("Needs a git repository");
    await expect(where.getByRole("radio", { name: /In place/ })).toBeChecked();
    expect(db.projects()[0].is_git).toBe(0);
  });
});

test("removing a project removes its sessions but not its files", async ({ splash }) => {
  const { app, page, world, db } = splash;
  await app.newSession({ where: "in_place" });
  await expect(app.sessionRow("New session")).toBeVisible();

  await app.projectRow("repo").click({ button: "right" });
  await app.ui.menuItem("Remove project…").click();
  await expect(app.ui.modal).toContainText("Remove repo from Splash? Its sessions are deleted; files on disk are untouched.");
  await app.confirm("Remove");

  await expect(app.projectRow("repo")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Splash" })).toBeVisible();
  expect(db.projects()).toEqual([]);
  expect(db.sessions()).toEqual([]);
  expect(existsSync(join(world.repo, "calc.py"))).toBe(true);
  // The session's agent is stopped with it.
  await expect.poll(() => agentAlive(world.agents.launches("claude")[0].pid)).toBe(false);
});

test("a session in a worktree gets its own branch and folder", async ({ splash }) => {
  const { app, world, db } = splash;
  const id = await app.newSession({ where: "worktree" });
  const row = db.session(id)!;

  expect(row.isolation).toBe("worktree");
  expect(row.branch).toMatch(/^splash\/claude-[a-z0-9]{6}$/);
  expect(row.cwd).toBe(join(world.data, "worktrees", "repo", id));
  expect(readFileSync(join(row.cwd, "calc.py"), "utf8")).toContain("def subtract");
  expect(branchExists(world.repo, world.env(), row.branch!)).toBe(true);
  expect(world.agents.launches("claude")[0].cwd).toBe(row.cwd);

  await expect(app.page.locator(".composer .chip").first()).toContainText(row.branch!);
  await app.sideTab("Details").click();
  await expect(app.detail("Isolation")).toHaveText("worktree");
  await expect(app.detail("Branch")).toHaveText(row.branch!);
  await expect(app.detail("Base")).toHaveText(row.base_sha!.slice(0, 10));
  await app.sideTab("Changes").click();
  await expect(app.page.getByText(`vs ${row.base_sha!.slice(0, 7)}`)).toBeVisible();
});

test("a session in place works in the project folder", async ({ splash }) => {
  const { app, world, db } = splash;
  const id = await app.newSession({ where: "in_place" });
  await expect(app.page.locator(".composer .chip").first()).toHaveText("In place · main");
  await expect(app.transcript.getByText(/repo · main$/)).toBeVisible();
  expect(db.session(id)).toMatchObject({ isolation: "in_place", branch: "main", cwd: world.repo });
});

test("renaming a session keeps the name when the agent sends a title", async ({ splash }) => {
  const { app, world, db } = splash;
  world.agents.fixture("codex", "codex/read.jsonl");
  const id = await app.newSession({ agent: "codex", where: "in_place" });

  await app.title.click();
  await app.ui.modalInput.fill("Subtract review");
  await app.confirm("OK");
  await expect(app.title).toHaveText("Subtract review");
  await expect(app.sessionRow("Subtract review")).toBeVisible();

  // Codex reports its own title during the turn; the user's name wins.
  await app.prompt("Read calc.py and tell me in one sentence what bug it has.");
  await expect(app.title).toHaveText("Subtract review");
  expect(db.session(id)).toMatchObject({ title: "Subtract review", title_override: 1 });
});

test("archiving a clean worktree keeps its branch and makes the session read-only", async ({ splash }) => {
  const { app, page, world, db } = splash;
  const id = await app.newSession({ where: "worktree" });
  const { cwd, branch } = db.session(id)!;

  await app.contextMenu(app.sessionRow("New session"), "Archive");
  await expect(app.sidebar.getByRole("button", { name: /^Archived/ })).toContainText("1");
  await expect.poll(() => existsSync(cwd)).toBe(false);
  expect(branchExists(world.repo, world.env(), branch!)).toBe(true);
  expect(db.session(id)).toMatchObject({ archived: 1, attention_json: null });

  await app.sidebar.getByRole("button", { name: /^Archived/ }).click();
  await app.sessionRow("New session").click();
  await expect(page.locator(".tag", { hasText: "archived" }).first()).toBeVisible();
  await expect(app.composer).toBeDisabled();
  await expect(app.composer).toHaveAttribute("placeholder", "This session is archived.");
  await expect(page.getByRole("button", { name: "Continue conversation" })).toHaveCount(0);
});

test("archiving a worktree with uncommitted changes asks first", async ({ splash }) => {
  const { app, world, db } = splash;
  const id = await app.newSession({ where: "worktree" });
  const { cwd, branch } = db.session(id)!;
  writeFileSync(join(cwd, "scratch.txt"), "work in progress\n");

  await app.contextMenu(app.sessionRow("New session"), "Archive");
  await expect(app.ui.modal).toContainText("The worktree has uncommitted changes. Archive anyway and discard them? (The branch is kept.)");
  await app.confirm("Cancel");
  expect(existsSync(join(cwd, "scratch.txt"))).toBe(true);
  expect(db.session(id)!.archived).toBe(0);

  await app.contextMenu(app.sessionRow("New session"), "Archive");
  await app.confirm("Discard & archive");
  await expect.poll(() => existsSync(cwd)).toBe(false);
  expect(branchExists(world.repo, world.env(), branch!)).toBe(true);
  expect(db.session(id)!.archived).toBe(1);
});

test("deleting a worktree session removes it, its transcript and its folder", async ({ splash }) => {
  const { app, page, world, db } = splash;
  const id = await app.newSession({ where: "worktree" });
  await app.prompt("What does subtract do?");
  const { cwd, branch } = db.session(id)!;
  writeFileSync(join(cwd, "scratch.txt"), "work in progress\n");

  await app.contextMenu(app.sessionRow("What does subtract do?"), "Remove local session…");
  await expect(app.ui.modal).toContainText(`Remove "What does subtract do?" from Splash?`);
  await app.confirm("Delete");
  await expect(app.ui.modal).toContainText("The worktree has uncommitted changes. Delete anyway and permanently discard them?");
  await app.confirm("Discard & delete");

  await expect(app.sessionRow("What does subtract do?")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Splash" })).toBeVisible();
  expect(db.session(id)).toBeUndefined();
  expect(db.entries(id)).toEqual([]);
  await expect.poll(() => existsSync(cwd)).toBe(false);
  expect(branchExists(world.repo, world.env(), branch!)).toBe(true);
});

test("deleting an in-place session leaves the project's files alone", async ({ splash }) => {
  const { app, world, db } = splash;
  const id = await app.newSession({ where: "in_place" });
  writeFileSync(join(world.repo, "unsaved.txt"), "unsaved work\n");

  await app.contextMenu(app.sessionRow("New session"), "Remove local session…");
  await app.confirm("Delete");
  await expect(app.sessionRow("New session")).toHaveCount(0);
  expect(db.session(id)).toBeUndefined();
  expect(readFileSync(join(world.repo, "unsaved.txt"), "utf8")).toBe("unsaved work\n");
  expect(status(world.repo, world.env())).toBe("?? unsaved.txt");
});

test("the agent's modes and models are pickers in the composer", async ({ splash }) => {
  const { app, page, world } = splash;
  await app.newSession({ where: "in_place" });
  for (const [name, label] of [["Mode", "Auto"], ["Model", "Opus"], ["Effort", "Medium"], ["Fast mode", "Off"]])
    await expect(app.picker(name)).toHaveText(label);

  await app.picker("Model").click();
  const list = page.getByRole("listbox", { name: "Model" });
  await expect(list.getByRole("option", { name: /Opus/ }).last()).toHaveAttribute("aria-selected", "true");
  await list.getByRole("option", { name: /Sonnet 5/ }).click();
  await expect(app.picker("Model")).toHaveText("Sonnet 5");
  await expect.poll(() => world.agents.requests("claude", "session/set_config_option").map((r) => r.params)).toEqual([
    expect.objectContaining({ configId: "model", value: "sonnet" }),
  ]);
});

test("an agent without options shows no pickers", async ({ splash }) => {
  const { app, page } = splash;
  await app.newSession({ agent: "glue", where: "in_place" });
  await expect(page.locator(".composer .controls [aria-haspopup=listbox]")).toHaveCount(0);
});

test("extra workspace folders are passed to agents that support them", async ({ splash }) => {
  const { app, world } = splash;
  const shared = world.folder("shared", { "notes.md": "shared notes\n" });
  await app.newSession({ where: "in_place", folders: [shared] });
  expect(world.agents.requests("claude", "session/new")[0].params.additionalDirectories).toEqual([shared]);
  await app.sideTab("Details").click();
  await expect(app.detail("Extra folder 1")).toBeVisible();
});

test("an agent that cannot use extra folders says so", async ({ splash }) => {
  const { app, page, world } = splash;
  const shared = world.folder("shared");
  await app.newSessionButton.click();
  const dialog = page.getByRole("dialog", { name: "New session" });
  await dialog.getByRole("radiogroup", { name: "Agent" }).getByRole("radio", { name: /^Glue/ }).click();
  await dialog.getByRole("radiogroup", { name: "Where it works" }).getByRole("radio", { name: /In place/ }).click();
  await dialog.getByLabel("Additional workspace folders").fill(shared);
  await dialog.getByRole("button", { name: /^Start session/ }).click();
  await expect(app.entries("error")).toContainText("This agent does not support the session's additional workspace folders.");
  await app.expectStatus("error");
});

function agentAlive(pid: number) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}
