// Agent history: finding the conversations agents saved, previewing and adding
// them, refreshing, forking and deleting them, and Manage history's local
// removals. The agents replay fixtures/e2e/history_*.jsonl (support/history.ts).
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "../../fixtures.ts";
import { App } from "../../support/app.ts";
import { branchExists } from "../../support/git.ts";
import { deletedState, History, historyAgents, rewriteHistory } from "../../support/history.ts";

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
    await app.waitReady();
    const history = new History(app);
    await history.open();
    const agent = history.panel.locator("form").first().getByLabel("Agent");
    await expect(agent.getByRole("option")).toHaveText(["All installed agents"]);

    release();
    await expect(agent.getByRole("option")).toHaveText(["All installed agents", "Claude Code", "Codex", "Glue"]);
    await expect(page).toHaveURL(/#\/library$/);
    await expect(history.panel.getByRole("button", { name: "Find sessions" })).toBeVisible();
  });

  test("finds each installed agent's sessions in a folder, and retries an agent that failed", async ({ splash }) => {
    const { app, world } = splash;
    const history = new History(app);
    await history.open();
    await history.find({ folder: "repo" });

    await expect(history.status("Claude Code")).toHaveText("2 loaded");
    await expect(history.status("Codex")).toHaveText("1 loaded");
    await expect(history.status("Glue")).toHaveText("Listing unavailable");
    await expect(history.source("Glue")).toContainText("Preview unavailable");
    // Most recent first, across agents.
    await expect(history.rows.locator("strong")).toHaveText(["Fix the subtract sign", "Tidy the imports", "Document the helpers"]);
    await expect(history.row("Tidy the imports")).toContainText(`Codex · ${world.repo}`);
    await expect(history.panel.getByRole("status").filter({ hasText: "loaded sessions match" })).toHaveText(/^3 loaded sessions match/);

    // Discovery starts each agent in the folder and only lists: no session, no prompt.
    for (const agent of ["claude", "codex"] as const) {
      expect(world.agents.launches(agent).map((l) => l.cwd)).toEqual([world.repo]);
      expect(world.agents.requests(agent, "session/list").map((r) => r.params.cwd)).toEqual([world.repo]);
      expect(world.agents.requests(agent, "session/new")).toEqual([]);
      expect(world.agents.requests(agent, "session/prompt")).toEqual([]);
    }

    world.agents.flags("codex", "--fail-initialize");
    await history.find({ folder: "repo", refresh: true });
    await expect(history.status("Codex")).toHaveText("Could not finish");
    const error = history.source("Codex").getByRole("alert");
    await expect(error).toContainText("Codex history request failed");
    await expect(error).toContainText("Agent output:\nadapter executable missing: reinstall the adapter");
    await expect(history.status("Claude Code")).toHaveText("2 loaded");
    await expect(history.status("Glue")).toHaveText("Listing unavailable");

    world.agents.flags("codex");
    await history.source("Codex").getByRole("button", { name: "Retry" }).click();
    await expect(history.status("Codex")).toHaveText("1 loaded");
    await expect(error).toHaveCount(0);
    await expect(history.row("Tidy the imports")).toBeVisible();
    expect(world.agents.requests("codex", "session/list")).toHaveLength(2);
  });

  test("all folders asks each agent from the home folder, without a folder filter", async ({ splash }) => {
    const { app, world } = splash;
    const history = new History(app);
    await history.open();
    await history.find({ agent: "Claude Code" });

    await expect(history.status("Claude Code")).toHaveText("2 loaded");
    await expect(history.source("Codex")).toHaveCount(0);
    expect(world.agents.launches("claude").map((l) => l.cwd)).toEqual([world.home]);
    expect(world.agents.requests("claude", "session/list")[0].params).not.toHaveProperty("cwd");
    // The recording's sessions live where the agent started: the home folder.
    await expect(history.row("Fix the subtract sign")).toContainText("Claude Code · ~");
  });

  test("loads more pages, previews a conversation and adds it to Splash", async ({ splash }) => {
    const { app, page, world, db } = splash;
    const history = new History(app);
    await history.open();
    await history.find({ agent: "Claude Code", folder: "repo" });
    await expect(history.status("Claude Code")).toHaveText("2 loaded");

    const more = history.source("Claude Code").getByRole("button", { name: "Load more from Claude Code" });
    await more.click();
    await expect(history.status("Claude Code")).toHaveText("3 loaded");
    await expect(more).toHaveCount(0);
    await expect(history.rows.locator("strong")).toHaveText(["Fix the subtract sign", "Document the helpers", "Sketch a calculator CLI"]);
    expect(world.agents.requests("claude", "session/list").map((r) => r.params)).toEqual([
      { cwd: world.repo },
      { cwd: world.repo, cursor: "page-2" },
    ]);

    await expect(history.row("Fix the subtract sign")).toContainText("+1 workspace folder");
    await history.show("Fix the subtract sign");
    const preview = history.preview;
    await expect(preview.getByRole("heading", { name: "Fix the subtract sign" })).toBeVisible();
    await expect(preview).toContainText("Claude Code · 6 entries");
    await expect(preview.locator(".workspace")).toContainText(world.repo);
    await expect(preview.locator(".workspace")).toContainText(join(world.repo, "src"));
    await expect(preview).toContainText("Why does subtract return the wrong sign?");
    await expect(preview).toContainText("The README now explains that subtract(a, b) is a minus b.");
    await expect(preview.getByRole("textbox")).toHaveCount(0);
    // The agent replayed the saved conversation into its workspace and nothing else.
    expect(world.agents.requests("claude", "session/load").map((r) => r.params)).toEqual([
      expect.objectContaining({ sessionId: "native-1", cwd: world.repo, additionalDirectories: [join(world.repo, "src")] }),
    ]);
    expect(world.agents.requests("claude", "session/prompt")).toEqual([]);

    await preview.getByRole("button", { name: "Add to Splash" }).click();
    await expect(app.title).toHaveText("Fix the subtract sign");
    const id = await app.sessionId();
    await app.expectStatus("exited");
    await expect(page.getByText("Viewing saved history. Continue to reconnect the agent.")).toBeVisible();
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
    await history.find({ agent: "Claude Code", folder: "repo" });
    await expect(history.row("Fix the subtract sign")).toContainText("In Splash");
    await expect(history.row("Document the helpers")).not.toContainText("In Splash");
    await history.show("Fix the subtract sign");
    await expect(history.preview).toContainText("Updating replaces the local transcript with this replay.");
    await history.preview.getByRole("button", { name: "Update local copy" }).click();
    await expect(app.title).toHaveText("Fix the subtract sign");
    expect(await app.sessionId()).toBe(id);
    expect(db.sessions()).toHaveLength(1);
  });

  test("an agent with newer activity updates the local copy and its search index", async ({ splash }) => {
    const { app, page, world, db } = splash;
    const history = new History(app);
    const id = await history.importSession("Fix the subtract sign");
    await expect.poll(() => db.kinds(id)).toHaveLength(6);

    rewriteHistory(world, "claude", [
      ["The README now explains that subtract(a, b) is a minus b.", "The docstring now spells out the argument order."],
      ["2026-10-01T09:30:00Z", "2026-10-05T12:00:00Z"],
    ]);
    await history.open();
    await history.find({ agent: "Claude Code", folder: "repo", refresh: true });
    await expect(history.row("Fix the subtract sign")).toContainText("New activity");
    await history.show("Fix the subtract sign");
    await expect(history.preview).toContainText("The docstring now spells out the argument order.");
    await history.preview.getByRole("button", { name: "Update local copy" }).click();

    await expect(app.entries("agent").last()).toContainText("The docstring now spells out the argument order.");
    expect(await app.sessionId()).toBe(id);
    await expect(history.bar).toContainText(/Synced /);
    await expect.poll(() => db.entries(id).at(-1)?.data.text).toBe("The docstring now spells out the argument order.");

    // The transcript search follows the replacement.
    await app.openNav("Sessions");
    const search = page.getByRole("searchbox", { name: "Search conversations" });
    await search.fill("docstring");
    await expect(page.getByRole("tabpanel").getByRole("status")).toHaveText("1 conversations");
    await expect(page.locator(".excerpt")).toContainText("docstring");
    await search.fill("minus");
    await expect(page.getByRole("tabpanel").getByRole("status")).toHaveText("0 conversations");
  });

  test("a preview older than the local conversation is not imported over it", async ({ splash }) => {
    const { app, page, db } = splash;
    const history = new History(app);
    const id = await history.importSession("Fix the subtract sign");
    await history.open();
    await history.find({ agent: "Claude Code", folder: "repo" });
    await history.show("Fix the subtract sign");
    const update = history.preview.getByRole("button", { name: "Update local copy" });
    await expect(update).toBeEnabled();

    // Meanwhile the conversation goes on in another window.
    const other = await page.context().newPage();
    try {
      const otherApp = new App(other, splash.harness);
      await other.goto(`${splash.backend.url}/#/session/${encodeURIComponent(id)}`);
      await otherApp.waitReady();
      await other.getByRole("button", { name: "Continue conversation" }).click();
      await otherApp.expectStatus("idle");
      await otherApp.prompt("Pick up where we left off.");
      await new History(otherApp).disconnect();
    } finally {
      await other.close();
    }
    await expect.poll(() => db.kinds(id)).toContain("turn_end");

    await expect(update).toBeEnabled();
    await update.click();
    await expect(history.panel.getByRole("alert")).toHaveText(
      "This preview is older than the saved conversation. Preview it again or use Refresh from agent.",
    );
    expect(db.entries(id).some((e) => e.data.text === "Picking up from the saved conversation: subtract is a - b.")).toBe(true);

    // A fresh preview may replace it.
    await history.show("Document the helpers");
    await history.show("Fix the subtract sign");
    await history.preview.getByRole("button", { name: "Update local copy" }).click();
    await expect(app.title).toHaveText("Fix the subtract sign");
    await expect.poll(() => db.kinds(id)).toEqual(["user", "thought", "tool", "agent", "user", "agent"]);
  });

  test("a known session ID can be previewed and added", async ({ splash }) => {
    const { app, world } = splash;
    const history = new History(app);
    await history.open();
    const form = await history.openKnown();
    await form.getByLabel("Agent").selectOption({ label: "Claude Code" });
    await expect(form.getByLabel("Original working directory")).toHaveValue(world.repo);

    await form.getByLabel("Session ID").fill("missing-session");
    await form.getByRole("button", { name: "Preview by ID" }).click();
    const error = history.panel.getByRole("alert");
    await expect(error).toContainText("Claude Code history request failed");
    await expect(error).toContainText("Session not found");
    await expect(history.preview).toHaveCount(0);

    await form.getByLabel("Original working directory").fill("repo");
    await form.getByLabel("Session ID").fill("native-2");
    await form.getByRole("button", { name: "Preview by ID" }).click();
    await expect(error).toHaveText("Workspace folder is missing or not absolute: repo");

    await form.getByLabel("Original working directory").fill(world.repo);
    await form.getByRole("button", { name: "Preview by ID" }).click();
    // Without a listed title, the first message names it.
    await expect(history.preview.getByRole("heading", { name: "Add docstrings to calc.py" })).toBeVisible();
    await expect(history.preview).toContainText("Added docstrings to add and subtract.");
    await expect(error).toHaveCount(0);
    await history.preview.getByRole("button", { name: "Add to Splash" }).click();
    await expect(app.title).toHaveText("Add docstrings to calc.py");
    expect(world.agents.requests("claude", "session/load").map((r) => r.params.sessionId)).toEqual(["missing-session", "native-2"]);
  });
});

test.describe("a saved conversation", () => {
  test("refreshes from the agent, keeping a rename, and survives a failed refresh", async ({ splash }) => {
    const { app, world, db } = splash;
    const history = new History(app);
    const id = await history.importSession("Fix the subtract sign");
    await expect(history.bar).toContainText(/Synced /);
    await expect(history.button("Refresh from agent")).toBeEnabled();
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
    await history.find({ agent: "Claude Code", folder: "repo", refresh: true });
    await expect(history.row("Explain the subtract sign")).toContainText("New activity");
    await app.sessionRow("Subtract notes").click();
    await expect(history.bar).toContainText("New activity at agent");

    await history.button("Refresh from agent").click();
    await expect(history.notice).toHaveText("History refreshed from the agent.");
    await expect(app.entries("agent").last()).toContainText("The docstring now spells out the argument order.");
    await expect(app.transcript).not.toContainText("a minus b");
    await expect(history.bar).toContainText(/Synced /);
    await expect(history.bar).not.toContainText("New activity at agent");
    await expect(app.title).toHaveText("Subtract notes");
    expect(db.session(id)).toMatchObject({ title: "Subtract notes", title_override: 1 });
    expect(source(db.session(id)!.source_json).title).toBe("Explain the subtract sign");
    // Refreshing lists to find the session's folders, then replays it; it never connects.
    expect(world.agents.requests("claude", "session/resume")).toEqual([]);
    expect(world.agents.requests("claude", "session/prompt")).toEqual([]);

    world.agents.flags("claude", "--fail-load");
    await history.button("Refresh from agent").click();
    const error = history.bar.getByRole("alert");
    await expect(error).toContainText("Claude Code history request failed");
    await expect(error).toContainText("Replay failed");
    await expect(app.entries("agent").last()).toContainText("The docstring now spells out the argument order.");
    await expect(app.title).toHaveText("Subtract notes");
    expect(db.kinds(id)).toEqual(["user", "thought", "tool", "agent", "user", "agent"]);
  });

  test("forks into a separate conversation, or one prepared for review", async ({ splash }) => {
    const { app, page, world, db } = splash;
    const history = new History(app);
    const parent = await history.importSession("Fix the subtract sign");

    await history.button("Fork conversation").click();
    const dialog = page.getByRole("dialog", { name: "Fork conversation" });
    await expect(dialog.getByRole("heading", { name: "Fix the subtract sign" })).toBeVisible();
    await expect(dialog).toContainText(join(world.repo, "src"));
    await dialog.getByRole("button", { name: "Try another approach" }).click();
    await expect(dialog).toBeHidden();

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

    await history.button("Fork of Fix the subtract sign").click();
    await expect(app.title).toHaveText("Fix the subtract sign");
    expect(await app.sessionId()).toBe(parent);

    await history.fork("Fork for review");
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
    const { app, page, world, db } = splash;
    const history = new History(app);
    const state = deletedState(world);
    world.agents.flags("claude", "--state", state, "--fail-delete");
    const id = await history.importSession("Fix the subtract sign");

    // A connected agent has to be disconnected first.
    await page.getByRole("button", { name: "Continue conversation" }).click();
    await app.expectStatus("idle");
    let manage = await history.manage();
    await expect(manage).toContainText("Disconnect the agent before changing its saved history.");
    await expect(manage.getByRole("button", { name: "Delete agent history…" })).toBeDisabled();
    await expect(manage.getByRole("button", { name: "Remove local copy…" })).toBeDisabled();
    await manage.getByRole("button", { name: "Close" }).click();
    await expect(manage).toBeHidden();
    await history.disconnect();

    // The agent refuses: nothing changes.
    manage = await history.manage();
    await expect(manage).toContainText("native-1");
    await manage.getByRole("button", { name: "Delete agent history…" }).click();
    const confirm = manage.getByRole("group", { name: "Confirm deletion" });
    await expect(confirm.getByRole("heading")).toHaveText("Delete from agent history?");
    await confirm.getByRole("button", { name: "Delete from agent history" }).click();
    await expect(manage.getByRole("alert")).toContainText("Delete failed");
    expect(source(db.session(id)!.source_json).deleted).toBe(false);

    world.agents.flags("claude", "--state", state);
    await confirm.getByRole("button", { name: "Delete from agent history" }).click();
    await expect(history.notice).toHaveText("Removed from agent history. Your local transcript is still available.");
    await expect(confirm).toHaveCount(0);
    await expect(manage.getByRole("button", { name: "Delete agent history…" })).toHaveCount(0);
    await manage.getByRole("button", { name: "Close" }).click();

    await expect(history.bar).toContainText("Local history only");
    await expect(app.composer).toBeDisabled();
    await expect(app.composer).toHaveAttribute("placeholder", "Agent history was deleted. This local copy is read-only.");
    await expect(history.button("Refresh from agent")).toHaveCount(0);
    await expect(history.button("Fork conversation")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Continue conversation" })).toHaveCount(0);
    await expect(app.entries("agent").last()).toContainText("subtract(a, b) is a minus b");
    expect(world.agents.requests("claude", "session/delete").map((r) => r.params.sessionId)).toEqual(["native-1", "native-1"]);
    await expect.poll(() => source(db.session(id)!.source_json).deleted).toBe(true);
    expect(JSON.parse(readFileSync(state, "utf8"))).toEqual(["native-1"]);

    // The agent no longer lists it.
    await history.open();
    await history.find({ agent: "Claude Code", folder: "repo" });
    await expect(history.status("Claude Code")).toHaveText("1 loaded");
    await expect(history.rows.locator("strong")).toHaveText(["Document the helpers"]);
  });
});

test.describe("Manage history", () => {
  test("deletes a disconnected worktree session and its worktree", async ({ splash }) => {
    const { app, page, world, db } = splash;
    const history = new History(app);
    const id = await app.newSession({ where: "worktree" });
    const { cwd, branch } = db.session(id)!;

    let manage = await history.manage();
    await expect(manage).toContainText("Disconnect the agent before changing its saved history.");
    await expect(manage.getByRole("button", { name: "Delete local session…" })).toBeDisabled();
    await manage.getByRole("button", { name: "Close" }).click();
    await history.disconnect();

    manage = await history.manage();
    await manage.getByRole("button", { name: "Delete local session…" }).click();
    const confirm = manage.getByRole("group", { name: "Confirm deletion" });
    await expect(confirm.getByRole("heading")).toHaveText("Delete local session?");
    await expect(confirm).toContainText("This deletes the local transcript and its worktree.");
    await confirm.getByRole("button", { name: "Delete local session", exact: true }).click();

    await expect(app.sessionRow("New session")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Splash" })).toBeVisible();
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

    const manage = await history.manage();
    const confirm = manage.getByRole("group", { name: "Confirm deletion" });
    await manage.getByRole("button", { name: "Delete local session…" }).click();
    await confirm.getByRole("button", { name: "Delete local session", exact: true }).click();
    await expect(confirm.getByRole("heading")).toHaveText("Discard uncommitted changes?");
    await expect(confirm).toContainText("The worktree has uncommitted changes. Delete anyway and permanently discard them?");
    await confirm.getByRole("button", { name: "Cancel" }).click();
    await expect(confirm).toHaveCount(0);
    expect(db.session(id)).toBeDefined();
    expect(existsSync(join(cwd, "scratch.txt"))).toBe(true);

    await manage.getByRole("button", { name: "Delete local session…" }).click();
    await confirm.getByRole("button", { name: "Delete local session", exact: true }).click();
    await confirm.getByRole("button", { name: "Discard & delete" }).click();
    await expect(app.sessionRow("New session")).toHaveCount(0);
    expect(db.session(id)).toBeUndefined();
    await expect.poll(() => existsSync(cwd)).toBe(false);
    expect(branchExists(world.repo, world.env(), branch!)).toBe(true);
  });

  test("removes an imported copy and leaves the agent's conversation", async ({ splash }) => {
    const { app, page, world, db } = splash;
    const history = new History(app);
    const id = await history.importSession("Document the helpers");

    const manage = await history.manage();
    await manage.getByRole("button", { name: "Remove local copy…" }).click();
    const confirm = manage.getByRole("group", { name: "Confirm deletion" });
    await expect(confirm.getByRole("heading")).toHaveText("Remove local copy?");
    await expect(confirm).toContainText("This removes the transcript from Splash.");
    await confirm.getByRole("button", { name: "Remove local copy", exact: true }).click();

    await expect(app.sessionRow("Document the helpers")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Splash" })).toBeVisible();
    expect(db.session(id)).toBeUndefined();
    expect(existsSync(join(world.repo, "calc.py"))).toBe(true);
    expect(world.agents.requests("claude", "session/delete")).toEqual([]);

    await history.open();
    await history.find({ agent: "Claude Code", folder: "repo" });
    await expect(history.row("Document the helpers")).toBeVisible();
    await expect(history.row("Document the helpers")).not.toContainText("In Splash");
  });

  test("a worktree shared with a fork is kept until the fork is removed", async ({ splash }) => {
    const { app, world, db } = splash;
    const history = new History(app);
    const parent = await app.newSession({ where: "worktree" });
    const { cwd, branch } = db.session(parent)!;
    await history.disconnect();
    await history.fork("Try another approach");
    await expect(app.title).toHaveText("Fork of New session");
    const fork = await app.sessionId();
    expect(db.session(fork)).toMatchObject({ cwd, parent_id: parent, isolation: "in_place", external: 1 });

    await app.contextMenu(app.sessionRow("New session"), "Archive");
    await expect(
      app.ui.toasts.filter({ hasText: "Another conversation uses this worktree. Archive or remove its local copy first." }),
    ).toBeVisible();
    expect(db.session(parent)!.archived).toBe(0);
    expect(existsSync(cwd)).toBe(true);

    const manage = await history.manage();
    await manage.getByRole("button", { name: "Remove local copy…" }).click();
    await manage.getByRole("group", { name: "Confirm deletion" }).getByRole("button", { name: "Remove local copy", exact: true }).click();
    await expect(app.sessionRow("Fork of New session")).toHaveCount(0);
    expect(existsSync(cwd)).toBe(true);

    await app.contextMenu(app.sessionRow("New session"), "Archive");
    await expect(app.sidebar.getByRole("button", { name: /^Archived/ })).toContainText("1");
    await expect.poll(() => existsSync(cwd)).toBe(false);
    expect(branchExists(world.repo, world.env(), branch!)).toBe(true);
    expect(db.session(parent)!.archived).toBe(1);
  });
});
