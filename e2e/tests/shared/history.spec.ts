// Agent history: finding the conversations agents saved, previewing and adding
// them, refreshing, forking and deleting them, and Manage history's local
// removals. The agents replay fixtures/e2e/history_*.jsonl (support/history.ts).
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "../../fixtures.ts";
import { App } from "../../support/app.ts";
import { branchExists } from "../../support/git.ts";
import { deletedState, History, historyAgents, rewriteHistory } from "../../support/history.ts";
import { Library } from "../../support/views.ts";

test.beforeEach(({ world }) => historyAgents(world));

const source = (json: string) => JSON.parse(json) as { title?: string; deleted?: boolean };

test.describe("Open from agent", () => {
  test("Sessions opened while the app is still loading stays open", async ({ splash }) => {
    const { app, page } = splash;
    // Hold agent detection, the last step of loading, until Sessions is open.
    let release!: () => void;
    const held = new Promise<void>((resolve) => (release = resolve));
    await page.route("**/__cmd/list_agents", async (route) => {
      await held;
      await route.continue();
    });
    await page.reload();
    await app.waitShown();
    const history = new History(app);
    await history.open();
    // Only "All installed agents" so far.
    await expect(history.agentFilter).toBeVisible();
    await expect(history.agentOptions).toHaveCount(0);

    release();
    await expect(history.agentOptions).toHaveCount(3);
    for (const agent of ["claude", "codex", "glue"] as const) await expect(history.agentOption(agent)).toBeAttached();
    await expect(page).toHaveURL(/#\/library$/);
    await expect(history.findButton).toBeVisible();
  });

  test("finds each installed agent's sessions in a folder, and retries an agent that failed", async ({ splash }) => {
    const { app, world } = splash;
    const history = new History(app);
    await history.open();
    await history.find({ folder: world.repo });

    await history.expectListed("claude", 2);
    await history.expectListed("codex", 1);
    await expect(history.source("glue")).toHaveAttribute("data-state", "unlisted");
    await expect(history.noPreview("glue")).toBeVisible();
    // Most recent first, across agents.
    await expect(history.rowTitles).toHaveText(["Fix the subtract sign", "Tidy the imports", "Document the helpers"]);
    await expect(history.row("Tidy the imports")).toHaveAttribute("data-agent", "codex");
    await expect(history.row("Tidy the imports")).toHaveAttribute("data-cwd", world.repo);
    await expect(history.matchCount).toHaveAttribute("data-count", "3");

    // Discovery starts each agent in the folder and only lists: no session, no prompt.
    for (const agent of ["claude", "codex"] as const) {
      expect(world.agents.launches(agent).map((l) => l.cwd)).toEqual([world.repo]);
      expect(world.agents.requests(agent, "session/list").map((r) => r.params.cwd)).toEqual([world.repo]);
      expect(world.agents.requests(agent, "session/new")).toEqual([]);
      expect(world.agents.requests(agent, "session/prompt")).toEqual([]);
    }

    world.agents.flags("codex", "--fail-initialize");
    await history.find({ folder: world.repo, refresh: true });
    await expect(history.source("codex")).toHaveAttribute("data-state", "failed");
    const error = history.sourceError("codex");
    await expect(error).toContainText("Codex history request failed");
    await expect(error).toContainText("Agent output:\nadapter executable missing: reinstall the adapter");
    await history.expectListed("claude", 2);
    await expect(history.source("glue")).toHaveAttribute("data-state", "unlisted");

    world.agents.flags("codex");
    await history.retry("codex").click();
    await history.expectListed("codex", 1);
    await expect(error).toHaveCount(0);
    await expect(history.row("Tidy the imports")).toBeVisible();
    expect(world.agents.requests("codex", "session/list")).toHaveLength(2);
  });

  test("all folders asks each agent from the home folder, without a folder filter", async ({ splash }) => {
    const { app, world } = splash;
    const history = new History(app);
    await history.open();
    await history.find({ agent: "claude" });

    await history.expectListed("claude", 2);
    await expect(history.source("codex")).toHaveCount(0);
    expect(world.agents.launches("claude").map((l) => l.cwd)).toEqual([world.home]);
    expect(world.agents.requests("claude", "session/list")[0].params).not.toHaveProperty("cwd");
    // The recording's sessions live where the agent started: the home folder.
    await expect(history.row("Fix the subtract sign")).toHaveAttribute("data-agent", "claude");
    await expect(history.row("Fix the subtract sign")).toHaveAttribute("data-cwd", world.home);
  });

  test("loads more pages, previews a conversation and adds it to Splash", async ({ splash }) => {
    const { app, world, db } = splash;
    const history = new History(app);
    await history.open();
    await history.find({ agent: "claude", folder: world.repo });
    await history.expectListed("claude", 2);

    const more = history.loadMore("claude");
    await more.click();
    await history.expectListed("claude", 3);
    await expect(more).toHaveCount(0);
    await expect(history.rowTitles).toHaveText(["Fix the subtract sign", "Document the helpers", "Sketch a calculator CLI"]);
    expect(world.agents.requests("claude", "session/list").map((r) => r.params)).toEqual([
      { cwd: world.repo },
      { cwd: world.repo, cursor: "page-2" },
    ]);

    await expect(history.row("Fix the subtract sign")).toHaveAttribute("data-extra-folders", "1");
    await history.show("Fix the subtract sign");
    const preview = history.preview;
    await expect(history.previewTitle).toHaveText("Fix the subtract sign");
    await expect(preview).toHaveAttribute("data-agent", "claude");
    await expect(preview).toHaveAttribute("data-entries", "6");
    await expect(history.previewFolder(world.repo)).toBeVisible();
    await expect(history.previewFolder(join(world.repo, "src"))).toBeVisible();
    await expect(preview).toContainText("Why does subtract return the wrong sign?");
    await expect(preview).toContainText("The README now explains that subtract(a, b) is a minus b.");
    await expect(history.previewInputs).toHaveCount(0);
    // The agent replayed the saved conversation into its workspace and nothing else.
    expect(world.agents.requests("claude", "session/load").map((r) => r.params)).toEqual([
      expect.objectContaining({ sessionId: "native-1", cwd: world.repo, additionalDirectories: [join(world.repo, "src")] }),
    ]);
    expect(world.agents.requests("claude", "session/prompt")).toEqual([]);

    await history.importButton("add").click();
    await expect(app.title).toHaveText("Fix the subtract sign");
    const id = await app.sessionId();
    await app.expectStatus("exited");
    await expect(app.resumeNote).toContainText("Viewing saved history. Continue to reconnect the agent.");
    await expect(app.entries("tool")).toContainText("Read calc.py");
    await expect(app.entries("agent").last()).toContainText("subtract(a, b) is a minus b");
    await expect(app.sessionRow("Fix the subtract sign")).toBeVisible();
    const row = db.session(id)!;
    expect(row).toMatchObject({ external: 1, agent_session_id: "native-1", cwd: world.repo, isolation: "in_place", agent_id: "claude" });
    expect(JSON.parse(row.additional_directories_json)).toEqual([join(world.repo, "src")]);
    expect(source(row.source_json)).toMatchObject({ title: "Fix the subtract sign", deleted: false });
    expect(db.kinds(id)).toEqual(["user", "thought", "tool", "agent", "user", "agent"]);

    // Adding it again updates the same local copy.
    await history.open();
    await history.find({ agent: "claude", folder: world.repo });
    await expect(history.row("Fix the subtract sign")).toHaveAttribute("data-local", "current");
    await expect(history.row("Document the helpers")).toHaveAttribute("data-local", "none");
    await history.show("Fix the subtract sign");
    await expect(history.preview).toContainText("Updating replaces the local transcript with this replay.");
    await history.importButton("update").click();
    await expect(app.title).toHaveText("Fix the subtract sign");
    expect(await app.sessionId()).toBe(id);
    expect(db.sessions()).toHaveLength(1);
  });

  test("an agent with newer activity updates the local copy and its search index", async ({ splash }) => {
    const { app, page, world, db } = splash;
    const history = new History(app);
    const id = await history.importSession("Fix the subtract sign", world.repo);
    await expect.poll(() => db.kinds(id)).toHaveLength(6);

    rewriteHistory(world, "claude", [
      ["The README now explains that subtract(a, b) is a minus b.", "The docstring now spells out the argument order."],
      ["2026-10-01T09:30:00Z", "2026-10-05T12:00:00Z"],
    ]);
    await history.open();
    await history.find({ agent: "claude", folder: world.repo, refresh: true });
    await expect(history.row("Fix the subtract sign")).toHaveAttribute("data-local", "outdated");
    await history.show("Fix the subtract sign");
    await expect(history.preview).toContainText("The docstring now spells out the argument order.");
    await history.importButton("update").click();

    await expect(app.entries("agent").last()).toContainText("The docstring now spells out the argument order.");
    expect(await app.sessionId()).toBe(id);
    await expect(history.bar).toHaveAttribute("data-sync", "synced");
    await expect.poll(() => db.entries(id).at(-1)?.data.text).toBe("The docstring now spells out the argument order.");

    // The transcript search follows the replacement.
    await app.openNav("library");
    const library = new Library(page);
    await library.find("docstring");
    await expect(library.summary).toHaveAttribute("data-count", "1");
    await expect(library.excerpt(library.rows(id))).toContainText("docstring");
    await library.find("minus");
    await expect(library.summary).toHaveAttribute("data-count", "0");
  });

  test("a preview older than the local conversation is not imported over it", async ({ splash }) => {
    const { app, page, world, db } = splash;
    const history = new History(app);
    const id = await history.importSession("Fix the subtract sign", world.repo);
    await history.open();
    await history.find({ agent: "claude", folder: world.repo });
    await history.show("Fix the subtract sign");
    const update = history.importButton("update");
    await expect(update).toBeEnabled();

    // Meanwhile the conversation goes on in another window.
    const other = await page.context().newPage();
    try {
      const otherApp = new App(other, splash.harness);
      await other.goto(`${splash.backend.url}/#/session/${encodeURIComponent(id)}`);
      await otherApp.waitReady();
      await otherApp.continueButton.click();
      await otherApp.expectStatus("idle");
      await otherApp.prompt("Pick up where we left off.");
      await new History(otherApp).disconnect();
    } finally {
      await other.close();
    }
    await expect.poll(() => db.kinds(id)).toContain("turn_end");

    await expect(update).toBeEnabled();
    await update.click();
    await expect(history.error).toHaveText(
      "This preview is older than the saved conversation. Preview it again or use Refresh from agent.",
    );
    expect(db.entries(id).some((e) => e.data.text === "Picking up from the saved conversation: subtract is a - b.")).toBe(true);

    // A fresh preview may replace it.
    await history.show("Document the helpers");
    await history.show("Fix the subtract sign");
    await history.importButton("update").click();
    await expect(app.title).toHaveText("Fix the subtract sign");
    await expect.poll(() => db.kinds(id)).toEqual(["user", "thought", "tool", "agent", "user", "agent"]);
  });

  test("a known session ID can be previewed and added", async ({ splash }) => {
    const { app, world } = splash;
    const history = new History(app);
    await history.open();
    await history.openKnown();
    await history.knownAgent.selectOption("claude");
    await expect(history.knownCwd).toHaveValue(world.repo);

    await history.knownId.fill("missing-session");
    await history.knownPreview.click();
    const error = history.error;
    await expect(error).toContainText("Claude Code history request failed");
    await expect(error).toContainText("Session not found");
    await expect(history.preview).toHaveCount(0);

    await history.knownCwd.fill("repo");
    await history.knownId.fill("native-2");
    await history.knownPreview.click();
    await expect(error).toHaveText("Workspace folder is missing or not absolute: repo");

    await history.knownCwd.fill(world.repo);
    await history.knownPreview.click();
    // Without a listed title, the first message names it.
    await expect(history.previewTitle).toHaveText("Add docstrings to calc.py");
    await expect(history.preview).toContainText("Added docstrings to add and subtract.");
    await expect(error).toHaveCount(0);
    await history.importButton("add").click();
    await expect(app.title).toHaveText("Add docstrings to calc.py");
    expect(world.agents.requests("claude", "session/load").map((r) => r.params.sessionId)).toEqual(["missing-session", "native-2"]);
  });
});

test.describe("a saved conversation", () => {
  test("refreshes from the agent, keeping a rename, and survives a failed refresh", async ({ splash }) => {
    const { app, world, db } = splash;
    const history = new History(app);
    const id = await history.importSession("Fix the subtract sign", world.repo);
    await expect(history.bar).toHaveAttribute("data-sync", "synced");
    await expect(history.refreshButton).toBeEnabled();
    await app.title.click();
    await app.ui.modalInput.fill("Subtract notes");
    await app.confirm("OK");
    await expect(app.title).toHaveText("Subtract notes");

    // The agent's copy moves on; its list says so.
    rewriteHistory(world, "claude", [
      ["The README now explains that subtract(a, b) is a minus b.", "The docstring now spells out the argument order."],
      ["2026-10-01T09:30:00Z", "2026-10-05T12:00:00Z"],
      ["Fix the subtract sign", "Explain the subtract sign"],
    ]);
    await history.open();
    await history.find({ agent: "claude", folder: world.repo, refresh: true });
    await expect(history.row("Explain the subtract sign")).toHaveAttribute("data-local", "outdated");
    await app.sessionRow("Subtract notes").click();
    await expect(history.bar).toHaveAttribute("data-sync", "outdated");

    await history.refreshButton.click();
    await expect(history.notice).toHaveText("History refreshed from the agent.");
    await expect(app.entries("agent").last()).toContainText("The docstring now spells out the argument order.");
    await expect(app.transcript).not.toContainText("a minus b");
    // Synced, no longer behind the agent.
    await expect(history.bar).toHaveAttribute("data-sync", "synced");
    await expect(app.title).toHaveText("Subtract notes");
    expect(db.session(id)).toMatchObject({ title: "Subtract notes", title_override: 1 });
    expect(source(db.session(id)!.source_json).title).toBe("Explain the subtract sign");
    // Refreshing lists to find the session's folders, then replays it; it never connects.
    expect(world.agents.requests("claude", "session/resume")).toEqual([]);
    expect(world.agents.requests("claude", "session/prompt")).toEqual([]);

    world.agents.flags("claude", "--fail-load");
    await history.refreshButton.click();
    const error = history.barError;
    await expect(error).toContainText("Claude Code history request failed");
    await expect(error).toContainText("Replay failed");
    await expect(app.entries("agent").last()).toContainText("The docstring now spells out the argument order.");
    await expect(app.title).toHaveText("Subtract notes");
    expect(db.kinds(id)).toEqual(["user", "thought", "tool", "agent", "user", "agent"]);
  });

  test("forks into a separate conversation, or one prepared for review", async ({ splash }) => {
    const { app, world, db } = splash;
    const history = new History(app);
    const parent = await history.importSession("Fix the subtract sign", world.repo);

    await history.forkButton.click();
    await expect(history.dialog("fork")).toBeVisible();
    await expect(history.dialogTitle).toHaveText("Fix the subtract sign");
    await expect(history.dialogFolder(join(world.repo, "src"))).toBeVisible();
    await history.forkAction("separate").click();
    await expect(history.dialog("fork")).toBeHidden();

    await expect(app.title).toHaveText("Fork of Fix the subtract sign");
    const fork = await app.sessionId();
    expect(fork).not.toBe(parent);
    const row = db.session(fork)!;
    expect(row).toMatchObject({ parent_id: parent, external: 1, cwd: world.repo, isolation: "in_place", title_override: 1 });
    expect(row.agent_session_id).toMatch(/^fork-/);
    expect(JSON.parse(row.additional_directories_json)).toEqual([join(world.repo, "src")]);
    expect(world.agents.requests("claude", "session/fork").map((r) => r.params)).toEqual([
      expect.objectContaining({ sessionId: "native-1", cwd: world.repo, additionalDirectories: [join(world.repo, "src")] }),
    ]);
    // The fork starts from the parent's conversation.
    await expect(app.entries("agent").last()).toContainText("subtract(a, b) is a minus b");
    await app.expectStatus("exited");

    // The fork links back to its parent.
    await expect(history.parentLink).toHaveAttribute("data-session-id", parent);
    await expect(history.parentLink).toContainText("Fix the subtract sign");
    await history.parentLink.click();
    await expect(app.title).toHaveText("Fix the subtract sign");
    expect(await app.sessionId()).toBe(parent);

    await history.fork("review");
    await expect(app.title).toHaveText("Fork of Fix the subtract sign");
    const review = await app.sessionId();
    expect([parent, fork]).not.toContain(review);
    await expect(app.composer).toHaveValue(/^Review the work in the parent conversation\./);
    await app.expectStatus("exited");
    expect(db.session(review)!.parent_id).toBe(parent);
    // Prepared, not sent.
    expect(world.agents.requests("claude", "session/prompt")).toEqual([]);
    expect(world.agents.requests("claude", "session/fork")).toHaveLength(2);
  });

  test("deleting it from the agent's history keeps a read-only local copy", async ({ splash }) => {
    const { app, world, db } = splash;
    const history = new History(app);
    const state = deletedState(world);
    world.agents.flags("claude", "--state", state, "--fail-delete");
    const id = await history.importSession("Fix the subtract sign", world.repo);

    // A connected agent has to be disconnected first.
    await app.continueButton.click();
    await app.expectStatus("idle");
    await history.manage();
    await expect(history.disconnectFirst).toHaveText("Disconnect the agent before changing its saved history.");
    await expect(history.deleteAgentHistoryButton).toBeDisabled();
    await expect(history.removeLocalButton).toBeDisabled();
    await history.closeDialog.click();
    await expect(history.dialog("manage")).toBeHidden();
    await history.disconnect();

    // The agent refuses: nothing changes.
    await history.manage();
    await expect(history.agentSessionId).toHaveText("native-1");
    await history.deleteAgentHistoryButton.click();
    const confirm = history.confirmation;
    await expect(confirm).toHaveAttribute("data-confirm", "native");
    await expect(history.confirmTitle).toHaveText("Delete from agent history?");
    await history.confirmButton.click();
    await expect(history.dialogError).toContainText("Delete failed");
    expect(source(db.session(id)!.source_json).deleted).toBe(false);

    world.agents.flags("claude", "--state", state);
    await history.confirmButton.click();
    await expect(history.notice).toHaveText("Removed from agent history. Your local transcript is still available.");
    await expect(confirm).toHaveCount(0);
    await expect(history.deleteAgentHistoryButton).toHaveCount(0);
    await history.closeDialog.click();

    await expect(history.bar).toHaveAttribute("data-sync", "deleted");
    await expect(app.composer).toBeDisabled();
    await expect(app.composer).toHaveAttribute("placeholder", "Agent history was deleted. This local copy is read-only.");
    await expect(history.refreshButton).toHaveCount(0);
    await expect(history.forkButton).toHaveCount(0);
    await expect(app.continueButton).toHaveCount(0);
    await expect(app.entries("agent").last()).toContainText("subtract(a, b) is a minus b");
    expect(world.agents.requests("claude", "session/delete").map((r) => r.params.sessionId)).toEqual(["native-1", "native-1"]);
    await expect.poll(() => source(db.session(id)!.source_json).deleted).toBe(true);
    expect(JSON.parse(readFileSync(state, "utf8"))).toEqual(["native-1"]);

    // The agent no longer lists it.
    await history.open();
    await history.find({ agent: "claude", folder: world.repo });
    await history.expectListed("claude", 1);
    await expect(history.rowTitles).toHaveText(["Document the helpers"]);
  });
});

test.describe("Manage history", () => {
  test("deletes a disconnected worktree session and its worktree", async ({ splash }) => {
    const { app, world, db } = splash;
    const history = new History(app);
    const id = await app.newSession({ where: "worktree" });
    const { cwd, branch } = db.session(id)!;

    await history.manage();
    await expect(history.disconnectFirst).toHaveText("Disconnect the agent before changing its saved history.");
    // Delete local session… (the worktree goes too), not Remove local copy….
    await expect(history.removeLocalButton).toHaveAttribute("data-worktree", "true");
    await expect(history.removeLocalButton).toBeDisabled();
    await history.closeDialog.click();
    await history.disconnect();

    await history.manage();
    await history.removeLocalButton.click();
    await expect(history.confirmation).toHaveAttribute("data-confirm", "local");
    await expect(history.confirmTitle).toHaveText("Delete local session?");
    await expect(history.confirmMessage).toContainText("This deletes the local transcript and its worktree.");
    await history.confirmButton.click();

    await expect(app.sessionRow("New session")).toHaveCount(0);
    await expect(app.welcome).toBeVisible();
    expect(db.session(id)).toBeUndefined();
    expect(db.entries(id)).toEqual([]);
    await expect.poll(() => existsSync(cwd)).toBe(false);
    expect(branchExists(world.repo, world.env(), branch!)).toBe(true);
    // The agent's own history is left alone.
    expect(world.agents.requests("claude", "session/delete")).toEqual([]);
  });

  test("asks before discarding uncommitted changes in the worktree", async ({ splash }) => {
    const { app, world, db } = splash;
    const history = new History(app);
    const id = await app.newSession({ where: "worktree" });
    const { cwd, branch } = db.session(id)!;
    writeFileSync(join(cwd, "scratch.txt"), "work in progress\n");
    await history.disconnect();

    await history.manage();
    const confirm = history.confirmation;
    await history.removeLocalButton.click();
    await history.confirmButton.click();
    await expect(confirm).toHaveAttribute("data-confirm", "dirty");
    await expect(history.confirmTitle).toHaveText("Discard uncommitted changes?");
    await expect(history.confirmMessage).toContainText("The worktree has uncommitted changes. Delete anyway and permanently discard them?");
    await history.cancelConfirmButton.click();
    await expect(confirm).toHaveCount(0);
    expect(db.session(id)).toBeDefined();
    expect(existsSync(join(cwd, "scratch.txt"))).toBe(true);

    await history.removeLocalButton.click();
    await history.confirmButton.click();
    // Discard & delete.
    await expect(confirm).toHaveAttribute("data-confirm", "dirty");
    await history.confirmButton.click();
    await expect(app.sessionRow("New session")).toHaveCount(0);
    expect(db.session(id)).toBeUndefined();
    await expect.poll(() => existsSync(cwd)).toBe(false);
    expect(branchExists(world.repo, world.env(), branch!)).toBe(true);
  });

  test("removes an imported copy and leaves the agent's conversation", async ({ splash }) => {
    const { app, world, db } = splash;
    const history = new History(app);
    const id = await history.importSession("Document the helpers", world.repo);

    await history.manage();
    // Remove local copy…: an imported conversation has no worktree of its own.
    await expect(history.removeLocalButton).toHaveAttribute("data-worktree", "false");
    await history.removeLocalButton.click();
    await expect(history.confirmation).toHaveAttribute("data-confirm", "local");
    await expect(history.confirmTitle).toHaveText("Remove local copy?");
    await expect(history.confirmMessage).toContainText("This removes the transcript from Splash.");
    await history.confirmButton.click();

    await expect(app.sessionRow("Document the helpers")).toHaveCount(0);
    await expect(app.welcome).toBeVisible();
    expect(db.session(id)).toBeUndefined();
    expect(existsSync(join(world.repo, "calc.py"))).toBe(true);
    expect(world.agents.requests("claude", "session/delete")).toEqual([]);

    await history.open();
    await history.find({ agent: "claude", folder: world.repo });
    await expect(history.row("Document the helpers")).toBeVisible();
    await expect(history.row("Document the helpers")).toHaveAttribute("data-local", "none");
  });

  test("a worktree shared with a fork is kept until the fork is removed", async ({ splash }) => {
    const { app, world, db } = splash;
    const history = new History(app);
    const parent = await app.newSession({ where: "worktree" });
    const { cwd, branch } = db.session(parent)!;
    await history.disconnect();
    await history.fork("separate");
    await expect(app.title).toHaveText("Fork of New session");
    const fork = await app.sessionId();
    expect(db.session(fork)).toMatchObject({ cwd, parent_id: parent, isolation: "in_place", external: 1 });

    await app.contextMenu(app.sessionRow("New session"), "Archive");
    await expect(
      app.ui.toasts.filter({ hasText: "Another conversation uses this worktree. Archive or remove its local copy first." }),
    ).toBeVisible();
    expect(db.session(parent)!.archived).toBe(0);
    expect(existsSync(cwd)).toBe(true);

    await history.manage();
    await history.removeLocalButton.click();
    await history.confirmButton.click();
    await expect(app.sessionRow("Fork of New session")).toHaveCount(0);
    expect(existsSync(cwd)).toBe(true);

    await app.contextMenu(app.sessionRow("New session"), "Archive");
    await expect(app.archivedCount).toHaveText("1");
    await expect.poll(() => existsSync(cwd)).toBe(false);
    expect(branchExists(world.repo, world.env(), branch!)).toBe(true);
    expect(db.session(parent)!.archived).toBe(1);
  });
});
