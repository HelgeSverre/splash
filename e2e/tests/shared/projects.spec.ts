// Projects and sessions: adding and removing projects, starting sessions in
// place or in a worktree, renaming, archiving and deleting them.
import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "../../fixtures.ts";
import { branchExists, status } from "../../support/git.ts";
import { Workbench } from "../../support/views.ts";

test.describe("without projects", () => {
  test.use({ folders: "none" });

  test("adding a project folder offers a new session in it", async ({ splash }) => {
    const { app, world, db } = splash;
    await splash.addProject(world.repo);

    await expect(app.projectRow(world.repo)).toBeVisible();
    await expect(app.newSessionDialog).toBeVisible();
    const [project] = db.projects();
    expect(project).toMatchObject({ name: "repo", path: world.repo, is_git: 1 });
    await expect(app.dialogChoice("project", project.id)).toBeChecked();
  });

  test("a folder that is not a git repository can only work in place", async ({ splash }) => {
    const { app, world, db } = splash;
    const notes = world.folder("notes", { "todo.md": "- write tests\n" });
    await splash.addProject(notes);

    await expect(app.dialogChoice("where", "worktree")).toBeDisabled();
    await expect(app.dialogChoice("where", "worktree")).toContainText("Needs a git repository");
    await expect(app.dialogChoice("where", "in_place")).toBeChecked();
    expect(db.projects()[0].is_git).toBe(0);
  });
});

test("removing a project removes its sessions but not its files", async ({ splash }) => {
  const { app, world, db } = splash;
  await app.newSession({ where: "in_place" });
  await expect(app.sessionRows).toHaveCount(1);

  await app.contextMenu(app.projectRow(world.repo), "Remove project…");
  await expect(app.ui.modal).toContainText("Remove repo from Splash? Its sessions are deleted; files on disk are untouched.");
  await app.confirm("Remove");

  await expect(app.projectRow(world.repo)).toHaveCount(0);
  await expect(app.welcome).toBeVisible();
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

  await expect(app.whereChip).toHaveText(row.branch!);
  await app.sideTab("details").click();
  await expect(app.detail("isolation")).toHaveText("worktree");
  await expect(app.detail("branch")).toHaveText(row.branch!);
  await expect(app.detail("base")).toHaveText(row.base_sha!.slice(0, 10));
  await app.sideTab("changes").click();
  await expect(new Workbench(app.page).changesBase).toHaveText(`vs ${row.base_sha!.slice(0, 7)}`);
});

test("a moved project reports its Git error and can start after the folder returns", async ({ splash }) => {
  const { app, world, db } = splash;
  await app.newSessionButton.click();
  await expect(app.newSessionDialog).toBeVisible();
  await app.dialogChoice("agent", "claude").click();
  await app.dialogChoice("where", "worktree").click();
  renameSync(world.repo, world.repo + "-moved");
  await app.dialogStart.click();

  const failure = app.ui.toasts.filter({ hasText: "git:" });
  await expect(failure).toBeVisible();
  await expect(failure).not.toContainText("the repository has no commits yet");
  await expect(app.newSessionDialog).toBeVisible();
  await expect(app.dialogStart).toBeEnabled();
  expect(db.sessions()).toEqual([]);

  renameSync(world.repo + "-moved", world.repo);
  await app.dialogStart.click();
  await expect(app.newSessionDialog).toBeHidden();
  await app.expectStatus("idle");
  expect(db.sessions()).toHaveLength(1);
});

test("a session in place works in the project folder", async ({ splash }) => {
  const { app, world, db } = splash;
  const id = await app.newSession({ where: "in_place" });
  await expect(app.whereChip).toHaveText("In place · main");
  await expect(app.transcriptEmpty).toContainText(`${world.repo} · main`);
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
  const { app, world, db } = splash;
  const id = await app.newSession({ where: "worktree" });
  const { cwd, branch } = db.session(id)!;

  await app.contextMenu(app.sessionRow("New session"), "Archive");
  await expect(app.archivedCount).toHaveText("1");
  await expect.poll(() => existsSync(cwd)).toBe(false);
  expect(branchExists(world.repo, world.env(), branch!)).toBe(true);
  expect(db.session(id)).toMatchObject({ archived: 1, attention_json: null });

  await app.archivedToggle.click();
  await app.sessionRow("New session").click();
  await expect(app.archivedTag).toBeVisible();
  await expect(app.composer).toBeDisabled();
  await expect(app.composer).toHaveAttribute("placeholder", "This session is archived.");
  await expect(app.continueButton).toHaveCount(0);
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
  const { app, world, db } = splash;
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
  await expect(app.welcome).toBeVisible();
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
  const { app, world } = splash;
  await app.newSession({ where: "in_place" });
  for (const [option, label] of [["mode", "Auto"], ["model", "Opus"], ["effort", "Medium"], ["fast", "Off"]])
    await expect(app.picker(option)).toHaveText(label);

  await app.picker("model").click();
  await expect(app.pickerChoice("opus")).toHaveAttribute("aria-selected", "true");
  await app.pickerChoice("sonnet").click();
  await expect(app.picker("model")).toHaveText("Sonnet 5");
  await expect.poll(() => world.agents.requests("claude", "session/set_config_option").map((r) => r.params)).toEqual([
    expect.objectContaining({ configId: "model", value: "sonnet" }),
  ]);
});

test("an agent without options shows no pickers", async ({ splash }) => {
  const { app } = splash;
  await app.newSession({ agent: "glue", where: "in_place" });
  await expect(app.pickers).toHaveCount(0);
});

test("extra workspace folders are passed to agents that support them", async ({ splash }) => {
  const { app, world } = splash;
  const shared = world.folder("shared", { "notes.md": "shared notes\n" });
  await app.newSession({ where: "in_place", folders: [shared] });
  expect(world.agents.requests("claude", "session/new")[0].params.additionalDirectories).toEqual([shared]);
  await app.sideTab("details").click();
  await expect(app.detail("extra-folder-1")).toHaveText(shared);
});

test("an agent that cannot use extra folders says so", async ({ splash }) => {
  const { app, world } = splash;
  const shared = world.folder("shared");
  await app.newSessionButton.click();
  await app.dialogChoice("agent", "glue").click();
  await app.dialogChoice("where", "in_place").click();
  await app.dialogFolders.fill(shared);
  await app.dialogStart.click();
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
