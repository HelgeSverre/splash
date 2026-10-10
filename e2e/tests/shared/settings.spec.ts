// Settings: each agent's status and handshake, launch arguments, the skills,
// commands and MCP servers agents read, defaults for new sessions, and
// rebinding keyboard shortcuts.
import { join } from "node:path";
import { expect, test } from "../../fixtures.ts";
import { Workbench } from "../../support/views.ts";
import { keycaps, SECRETS, seedCustomizations, Settings, withCommands } from "../../support/settings.ts";

test.describe("agents", () => {
  test("a refresh runs the handshake and shows what the agent reports", async ({ splash }) => {
    const { app, world, db } = splash;
    // Claude, Codex and Glue are installed and signed in; nothing else is.
    await expect(app.welcomeAgents).toHaveAttribute("data-ready", "3");
    await app.welcomeAgents.click();
    const settings = new Settings(app);
    await settings.expectPage("agents");
    await expect(settings.status("claude")).toHaveText("not probed");
    await expect(settings.agentRow("claude")).toContainText("ACP adapter · v2.1.0");
    await expect(settings.status("glue")).toHaveText("not probed");
    await expect(settings.agentRow("glue")).toContainText("native ACP · v0.9.0");
    await expect(settings.status("gemini")).toHaveText("not installed");

    await settings.rowLink(settings.agentRow("claude")).click();
    await settings.expectPage("agent:claude");
    await expect(settings.value("host")).toHaveText("Unverified on this host");
    await expect(settings.value("installed")).toHaveText(join(world.bin, "claude"));
    await expect(settings.value("login")).toHaveText("signed in · via api key");
    await expect(settings.value("launch")).toHaveText("npx -y @agentclientprotocol/claude-agent-acp@0.81.1");
    await expect(settings.handshake).toHaveAttribute("data-state", "unchecked");

    await settings.refresh.click();
    await expect(settings.value("host")).toHaveText("ACP handshake verified on this host");
    await expect(settings.status("claude")).toHaveText("ready");
    await expect(settings.nav("agent:claude")).toHaveAccessibleName("Claude Code ready");
    await expect(settings.value("reports-as")).toHaveText(/^Claude Agent 0\.81\.1 · protocol v1 · \d+ ms · just now$/);
    await expect(settings.capabilities()).toHaveText(["resume", "images", "audio", "embedded context"]);
    await expect(settings.capabilities("audio")).toHaveAttribute("data-supported", "false");
    await expect(settings.capabilities("audio")).toHaveAttribute("title", "not supported");
    await expect(settings.value(settings.option("model"))).toHaveText("Opus");
    await expect(settings.option("model")).toContainText("6 choices");
    await expect(settings.value(settings.option("mode"))).toHaveText("Auto");

    // The handshake ran in a scratch folder, and is kept.
    const probe = world.agents.launches("claude");
    expect(probe).toHaveLength(1);
    expect(probe[0].cwd.startsWith(join(world.tmp, "splash-probe_"))).toBe(true);
    expect(world.agents.requests("claude", "session/prompt")).toEqual([]);
    const saved = () => db.query<{ data: string }>("SELECT data FROM agent_probes WHERE agent_id = 'claude'").map((r) => JSON.parse(r.data));
    await expect.poll(saved).toEqual([expect.objectContaining({ ok: true, agent_name: "Claude Agent", agent_version: "0.81.1", load_session: true })]);

    await settings.go("agents");
    await expect(settings.status("claude")).toHaveText("ready");
    await expect(settings.status("codex")).toHaveText("not probed");
  });

  test.describe("Amp", () => {
    test.use({ agents: ["amp"] });

    test("its adapter's handshake reports Amp's modes", async ({ splash }) => {
      const { app } = splash;
      const settings = new Settings(app);
      await settings.open("agent:amp");
      await expect(settings.value("launch")).toHaveText("npx -y amp-acp@0.9.0");
      await expect(settings.value("login")).toHaveText("unknown");
      await settings.refresh.click();
      await expect(settings.value("host")).toHaveText("ACP handshake verified on this host");
      await expect(settings.value("reports-as")).toHaveText(/^Amp ACP Agent 0\.9\.0 · protocol v1 · /);
      await expect(settings.value(settings.option("amp-mode"))).toHaveText("Medium");
      await expect(settings.option("amp-mode")).toContainText("4 choices");
      await expect(settings.value(settings.option("permission"))).toHaveText("Default");
    });
  });

  test("a failed handshake shows the agent's error", async ({ splash }) => {
    const { app, world } = splash;
    world.agents.flags("claude", "--fail-initialize");
    const settings = new Settings(app);
    await settings.open("agent:claude");
    await settings.refresh.click();

    await expect(settings.handshake).toHaveAttribute("data-state", "failed");
    await expect(settings.handshake).toContainText("Handshake failed · just now");
    await expect(settings.handshakeError).toContainText("adapter executable missing: reinstall the adapter");
    await expect(settings.value("host")).toHaveText("Unverified on this host");
    await expect(settings.status("claude")).toHaveText("probe failed");
    await expect(settings.nav("agent:claude")).toHaveAccessibleName("Claude Code probe failed");

    // Still offered for a session: the CLI is installed and signed in.
    await settings.close();
    await app.newSessionButton.click();
    await expect(app.agentState("claude")).toHaveText("probe failed");
    await expect(app.dialogChoice("agent", "claude")).toBeEnabled();
  });

  test.describe("signed out", () => {
    test.beforeEach(({ world }) => world.agents.loggedOut("claude"));

    test("an agent that is signed out cannot start a session", async ({ splash }) => {
      const { app } = splash;
      await expect(app.welcomeAgents).toHaveAttribute("data-ready", "2");
      const settings = new Settings(app);
      await settings.open("agents");
      await expect(settings.status("claude")).toHaveText("signed out");
      await settings.go("agent:claude");
      await expect(settings.value("login")).toHaveText("signed out");
      await settings.close();

      await app.newSessionButton.click();
      await expect(app.agentState("claude")).toHaveText("signed out");
      await expect(app.dialogChoice("agent", "claude")).toBeDisabled();
      // The default agent can't start: the dialog picks one that can.
      await expect(app.dialogChoice("agent", "codex")).toBeChecked();
    });
  });

  test("extra arguments go before the agent's own on every launch", async ({ splash }) => {
    const { app, page, world, db } = splash;
    const settings = new Settings(app);
    await settings.open("agent:claude");
    await settings.extraArgs.fill("--verbose --x=1");
    await settings.extraArgs.press("Enter");
    await expect(settings.value("launch")).toHaveText("--verbose --x=1 npx -y @agentclientprotocol/claude-agent-acp@0.81.1");
    await expect.poll(() => db.query("SELECT extra_args FROM agent_settings WHERE agent_id = 'claude'")).toEqual([{ extra_args: "--verbose --x=1" }]);

    // The handshake…
    await settings.refresh.click();
    await expect(settings.value("host")).toHaveText("ACP handshake verified on this host");
    await settings.close();
    // …and a session.
    await app.newSession({ where: "in_place" });
    const launches = world.agents.launches("claude");
    expect(launches).toHaveLength(2);
    for (const launch of launches) expect(launch.argv).toEqual(["--verbose", "--x=1", "-y", "@agentclientprotocol/claude-agent-acp@0.81.1"]);
    expect(launches[1].cwd).toBe(world.repo);
    await app.sideTab("details").click();
    await expect(app.detail("launch")).toHaveText("--verbose --x=1 npx -y @agentclientprotocol/claude-agent-acp@0.81.1");

    // Kept across a reload.
    await page.reload();
    await app.waitReady();
    await settings.open("agent:claude");
    await expect(settings.extraArgs).toHaveValue("--verbose --x=1");
  });
});

test.describe("skills, commands and MCP servers", () => {
  test.beforeEach(({ world }) => seedCustomizations(world));

  test("skills are grouped by where they live, and open in a preview", async ({ splash }) => {
    const { app, page } = splash;
    const settings = new Settings(app);
    await settings.open("agent:claude");
    await expect(settings.link("skills")).toHaveAttribute("data-count", "3");
    await settings.subPage("claude", "skills");

    await expect(settings.groupTitles).toHaveText(["~/.claude/skills", "~/.agents/skills shared", "repo/.claude/skills"]);
    await expect(settings.skills("deploy")).toContainText("Ship it safely.");
    await expect(settings.tags(settings.skills("review"))).toHaveText(["not in / menu", "manual only"]);
    await expect(settings.skills("local-one")).toContainText("Only in this project");
    // Codex's own skills are not Claude's; a folder without SKILL.md is not a skill.
    await expect(settings.skills("plan")).toHaveCount(0);
    await expect(settings.skills("empty")).toHaveCount(0);

    await settings.filter.fill("diff");
    await expect(settings.filterCount).toHaveAttribute("data-shown", "1");
    await expect(settings.filterCount).toHaveAttribute("data-total", "3");
    await expect(settings.skills()).toHaveCount(1);
    await settings.filter.fill("nothing like it");
    await expect(settings.empty).toHaveText("No skills match.");
    await settings.filter.fill("");

    await settings.rowLink(settings.skills("deploy")).click();
    const preview = settings.preview;
    await expect(preview.dialog).toHaveAttribute("data-kind", "skill");
    await expect(preview.headings).toHaveText(["Deploy"]);
    await expect(preview.bold).toHaveText("carefully");
    await expect(preview.field("description")).toContainText("Ship it safely.");
    await expect(preview.chips(preview.field("allowed-tools"))).toHaveText(["Bash", "Read"]);
    await preview.view("source").click();
    await expect(preview.document).toContainText("Ship it **carefully**.");

    // Esc closes the preview, then Settings.
    await page.keyboard.press("Escape");
    await expect(preview.dialog).toBeHidden();
    await settings.expectPage("agent:claude:skills");
    await page.keyboard.press("Escape");
    await expect(settings.dialog).toBeHidden();
  });

  test("commands come from the agent and open the file behind them", async ({ splash }) => {
    const { app, page, world } = splash;
    // Claude lists custom commands and skills along with its own.
    withCommands(world, "claude", "claude/read.jsonl", [
      { name: "review", description: "Review the diff (user)" },
      { name: "git:commit", description: "Commit staged changes (user)" },
      { name: "deploy", description: "Ship it safely." },
    ]);
    const settings = new Settings(app);
    await settings.open("agent:claude");
    await settings.subPage("claude", "commands");
    await expect(settings.empty).toHaveText("Refresh Claude Code to list its commands.");

    await settings.go("agent:claude");
    await settings.refresh.click();
    await expect(settings.link("commands")).toHaveAttribute("data-count", "13");
    await settings.subPage("claude", "commands");
    await expect(settings.filterCount).toHaveAttribute("data-shown", "13");
    await expect(settings.filterCount).toHaveAttribute("data-total", "13");
    await expect(settings.tags(settings.commands("compact"))).toHaveText("built in");
    await expect(settings.tags(settings.commands("deploy"))).toHaveText("skill");
    await expect(settings.tags(settings.commands("review"))).toHaveCount(0);
    await expect(settings.tags(settings.commands("git:commit"))).toHaveCount(0);

    await settings.filter.fill("git:");
    await expect(settings.filterCount).toHaveAttribute("data-shown", "1");
    await expect(settings.filterCount).toHaveAttribute("data-total", "13");
    await settings.commands("git:commit").click();
    const preview = settings.preview;
    await expect(preview.dialog).toHaveAttribute("data-kind", "command");
    await expect(preview.document).toContainText("Commit it.");
    await expect(preview.field("description")).toContainText("Commit staged changes");
    await expect(preview.field("argument-hint")).toContainText("<message>");
    await page.keyboard.press("Escape");

    await settings.filter.fill("compact");
    await settings.commands("compact").click();
    await expect(preview.dialog).toHaveAttribute("data-kind", "command");
    await expect(preview.builtin).toContainText("Built into the agent. No file.");
  });

  test("MCP servers show their transport and key names, never secret values", async ({ splash }) => {
    const { app, page, world } = splash;
    const settings = new Settings(app);
    await settings.open("agent:claude");
    await settings.subPage("claude", "mcp");
    await expect(settings.lede).toHaveText("From ~/.claude.json. Only header and env names are shown, never values.");
    await expect(settings.filterCount).toHaveAttribute("data-shown", "3");
    await expect(settings.filterCount).toHaveAttribute("data-total", "3");

    await expect(settings.mcpServers("docs")).toContainText("http");
    await expect(settings.mcpServers("docs")).toContainText("https://docs.example/mcp");
    await expect(settings.mcpServers("docs")).toContainText("headers: Authorization");
    await expect(settings.mcpServers("db")).toContainText("stdio");
    await expect(settings.mcpServers("db")).toContainText("npx db-mcp");
    await expect(settings.mcpServers("db")).toContainText("env: DB_PASSWORD");
    await expect(settings.tags(settings.mcpServers("legacy"))).toHaveText(["stdio", "disabled"]);
    await expect(settings.mcpServers("tracker")).toHaveCount(0);

    // Servers configured for one project are listed on request.
    await expect(settings.perProject).toHaveAttribute("data-count", "1");
    await settings.perProject.click();
    await expect(settings.filterCount).toHaveAttribute("data-shown", "4");
    await expect(settings.filterCount).toHaveAttribute("data-total", "4");
    await expect(settings.mcpServers("tracker")).toContainText(`project ${world.repo}`);
    await expect(settings.mcpServers("tracker")).toContainText("env: API_TOKEN");
    await settings.filter.fill("docs.example");
    await expect(settings.filterCount).toHaveAttribute("data-shown", "1");
    await expect(settings.filterCount).toHaveAttribute("data-total", "4");

    // Other agents' configs, including one that cannot be read.
    await settings.subPage("codex", "mcp");
    await expect(settings.mcpServers("repl")).toContainText("env: TOKEN");
    await settings.subPage("pi", "mcp");
    await expect(settings.mcpErrors).toContainText("Couldn't read ~/.pi/agent/mcp.json");

    const html = await page.content();
    for (const secret of SECRETS) expect(html).not.toContain(secret);
  });

  test("Search settings narrows the rail", async ({ splash }) => {
    const { app, page } = splash;
    const settings = new Settings(app);
    await settings.open();
    await settings.search.fill("codex");
    await expect.poll(() => settings.railPages()).toEqual(["agent:codex", "agent:codex:skills", "agent:codex:commands", "agent:codex:mcp"]);
    await settings.nav("agent:codex:mcp").click();
    await settings.expectPage("agent:codex:mcp");

    await settings.search.fill("shortcut");
    await expect.poll(() => settings.railPages()).toEqual(["shortcuts"]);
    // Esc clears the search before it closes anything.
    await settings.search.press("Escape");
    await expect(settings.search).toHaveValue("");
    await expect(settings.nav("agent:claude")).toBeVisible();
    await expect(settings.dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(settings.dialog).toBeHidden();
  });
});

test("General sets the defaults for new sessions", async ({ splash }) => {
  const { app, page, world, db } = splash;
  const settings = new Settings(app);
  await settings.open();
  await expect(settings.value("data-folder")).toHaveText(world.data);
  await expect(settings.value("worktrees")).toHaveText(join(world.data, "worktrees"));

  await expect(settings.defaultAgent("claude")).toBeChecked();
  await settings.defaultAgent("codex").click();
  await expect(settings.defaultAgent("codex")).toBeChecked();
  await expect(settings.isolation("worktree")).toBeChecked();
  await settings.isolation("in_place").click();
  await expect(settings.notify).toBeChecked();
  await settings.notify.click();
  await expect(settings.notify).not.toBeChecked();
  await expect.poll(() => [db.setting("default_agent"), db.setting("default_isolation"), db.setting("notify")]).toEqual(["codex", "in_place", "off"]);
  await settings.close();

  await app.newSessionButton.click();
  await expect(app.dialogChoice("agent", "codex")).toBeChecked();
  await expect(app.dialogChoice("where", "in_place")).toBeChecked();
  await app.dialogStart.click();
  const id = await app.sessionId();
  expect(db.session(id)).toMatchObject({ agent_id: "codex", isolation: "in_place" });

  // Kept across a reload.
  await page.reload();
  await app.waitReady();
  await settings.open();
  await expect(settings.defaultAgent("codex")).toBeChecked();
  await expect(settings.isolation("in_place")).toBeChecked();
  await expect(settings.notify).not.toBeChecked();
});

test.describe("keyboard shortcuts", () => {
  test("defaults suit the client, and a new shortcut replaces the old one", async ({ splash }) => {
    const { app, page, db, harness } = splash;
    await app.newSession({ where: "in_place" });
    const bench = new Workbench(page);
    const settings = new Settings(app);
    await settings.open("shortcuts");
    await expect(settings.lede).toHaveText(
      `Click a shortcut to change it. Defaults follow ${process.platform === "darwin" ? "macOS" : "Windows and Linux"} conventions${harness === "web" ? " and avoid browser navigation shortcuts" : ""}.`,
    );
    await expect(settings.shortcut("session.new")).toHaveAccessibleName(keycaps(app.combo("N")));
    await expect(settings.shortcut("session.go1")).toHaveAccessibleName(keycaps(app.combo("1")));
    await expect(settings.shortcut("app.palette")).toHaveAccessibleName(`${keycaps(app.combo("Shift+P"))} or ${keycaps(app.combo("K"))}`);
    await expect(settings.shortcut("view.terminal")).toHaveAccessibleName(keycaps(app.combo("J")));
    await expect(settings.resetShortcuts).toHaveCount(0);

    const keys = settings.shortcut("view.terminal");
    await keys.click();
    await expect(keys).toHaveAttribute("aria-pressed", "true");
    await expect(keys).toHaveAccessibleName("Press keys…");
    // A shortcut needs a modifier.
    await page.keyboard.press("t");
    await expect(settings.shortcutHint("view.terminal")).toHaveText("Add ⌘, ⌥ or ⌃");
    await page.keyboard.press("Control+Alt+T");
    await expect(keys).toHaveAttribute("aria-pressed", "false");
    await expect(keys).toHaveAccessibleName(keycaps("Ctrl+Alt+T"));
    await expect(settings.shortcutReset("view.terminal")).toBeVisible();
    await expect.poll(() => db.setting("keybindings")).toBe(JSON.stringify({ "view.terminal": ["Ctrl+Alt+T"] }));
    await settings.close();

    await page.keyboard.press("Control+Alt+T");
    await expect(app.terminalToggle).toHaveAttribute("aria-pressed", "true");
    await expect(bench.terminal).toBeVisible();
    // The old shortcut does nothing now: only the new one closes it again.
    await page.keyboard.press(app.key("J"));
    await page.keyboard.press("Control+Alt+T");
    await expect(app.terminalToggle).toHaveAttribute("aria-pressed", "false");

    await settings.open("shortcuts");
    await settings.shortcutReset("view.terminal").click();
    await expect(keys).toHaveAccessibleName(keycaps(app.combo("J")));
    await expect.poll(() => db.setting("keybindings")).toBe("{}");
    await settings.close();
    await page.keyboard.press(app.key("J"));
    await expect(app.terminalToggle).toHaveAttribute("aria-pressed", "true");
  });

  test("taking a shortcut another action uses asks first; Backspace clears one", async ({ splash }) => {
    const { app, page, db } = splash;
    const settings = new Settings(app);
    await settings.open("shortcuts");
    const keys = settings.shortcut("view.terminal");
    const clash = settings.shortcutClash("view.terminal");
    const message = `${keycaps(app.combo("N"))} is used by “New session”`;

    await keys.click();
    await page.keyboard.press(app.key("N"));
    await expect(clash.message).toHaveText(message);
    await clash.cancel.click();
    await expect(clash.message).toHaveCount(0);
    await expect(keys).toHaveAccessibleName(keycaps(app.combo("J")));
    await expect(settings.shortcut("session.new")).toHaveAccessibleName(keycaps(app.combo("N")));
    // Recording stops the shortcut from firing: no New session dialog.
    await expect(app.newSessionDialog).toHaveCount(0);

    await keys.click();
    await page.keyboard.press(app.key("N"));
    await clash.useHere.click();
    await expect(keys).toHaveAccessibleName(keycaps(app.combo("N")));
    await expect(settings.shortcut("session.new")).toHaveAccessibleName("none");
    await expect.poll(() => JSON.parse(db.setting("keybindings") ?? "{}")).toEqual({ "session.new": [], "view.terminal": [app.combo("N")] });

    // Esc cancels a recording; Backspace removes the shortcut.
    const palette = settings.shortcut("app.palette");
    await palette.click();
    await page.keyboard.press("Escape");
    await expect(palette).toHaveAttribute("aria-pressed", "false");
    await expect(settings.dialog).toBeVisible();
    await palette.click();
    await page.keyboard.press("Backspace");
    await expect(palette).toHaveAccessibleName("none");

    await settings.resetShortcuts.click();
    await expect(settings.shortcut("session.new")).toHaveAccessibleName(keycaps(app.combo("N")));
    await expect(palette).toHaveAccessibleName(`${keycaps(app.combo("Shift+P"))} or ${keycaps(app.combo("K"))}`);
    await expect(keys).toHaveAccessibleName(keycaps(app.combo("J")));
    await expect.poll(() => db.setting("keybindings")).toBe("{}");
    await expect(settings.resetShortcuts).toHaveCount(0);
  });
});
