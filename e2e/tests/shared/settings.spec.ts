// Settings: each agent's status and handshake, launch arguments, the skills,
// commands and MCP servers agents read, defaults for new sessions, and
// rebinding keyboard shortcuts.
import { join } from "node:path";
import { expect, test } from "../../fixtures.ts";
import { keycaps, SECRETS, seedCustomizations, Settings, withCommands } from "../../support/settings.ts";

test.describe("agents", () => {
  test("a refresh runs the handshake and shows what the agent reports", async ({ splash }) => {
    const { app, page, world, db } = splash;
    // Claude, Codex and Glue are installed and signed in; nothing else is.
    await page.getByRole("button", { name: "Agents · 3 ready" }).click();
    const settings = new Settings(app);
    await expect(settings.heading).toHaveText("Agents");
    const overview = (name: string) => settings.badge(settings.row(name));
    await expect(overview("Claude Code")).toHaveText("not probed");
    await expect(settings.row("Claude Code")).toContainText("ACP adapter · v2.1.0");
    await expect(overview("Glue")).toHaveText("not probed");
    await expect(settings.row("Glue")).toContainText("native ACP · v0.9.0");
    await expect(overview("Gemini")).toHaveText("not installed");

    await settings.row("Claude Code").getByRole("button").click();
    await expect(settings.heading).toHaveText("Claude Code");
    await expect(settings.value("Host compatibility")).toHaveText("Unverified on this host");
    await expect(settings.value("Installed")).toHaveText(join(world.bin, "claude"));
    await expect(settings.value("Login")).toHaveText("signed in · via api key");
    await expect(settings.value("Launch")).toHaveText("npx -y @agentclientprotocol/claude-agent-acp@0.81.1");
    await expect(settings.dialog.getByText("Not checked yet.")).toBeVisible();

    await settings.dialog.getByRole("button", { name: "Refresh Claude Code" }).click();
    await expect(settings.value("Host compatibility")).toHaveText("ACP handshake verified on this host");
    await expect(settings.badge()).toHaveText("ready");
    await expect(settings.nav("Claude Code")).toHaveAccessibleName("Claude Code ready");
    await expect(settings.value("Reports as")).toHaveText(/^Claude Agent 0\.81\.1 · protocol v1 · \d+ ms · just now$/);
    const capabilities = settings.row("Capabilities").locator(".tag");
    await expect(capabilities).toHaveText(["resume", "images", "audio", "embedded context"]);
    await expect(capabilities.filter({ hasText: "audio" })).toHaveAttribute("title", "not supported");
    await expect(settings.value("Model")).toHaveText("Opus");
    await expect(settings.row("Model")).toContainText("6 choices");
    await expect(settings.value("Mode")).toHaveText("Auto");

    // The handshake ran in a scratch folder, and is kept.
    const probe = world.agents.launches("claude");
    expect(probe).toHaveLength(1);
    expect(probe[0].cwd).toBe(join(world.tmp, "splash-probe"));
    expect(world.agents.requests("claude", "session/prompt")).toEqual([]);
    const saved = () => db.query<{ data: string }>("SELECT data FROM agent_probes WHERE agent_id = 'claude'").map((r) => JSON.parse(r.data));
    await expect.poll(saved).toEqual([expect.objectContaining({ ok: true, agent_name: "Claude Agent", agent_version: "0.81.1", load_session: true })]);

    await settings.go("Overview");
    await expect(overview("Claude Code")).toHaveText("ready");
    await expect(overview("Codex")).toHaveText("not probed");
  });

  test("a failed handshake shows the agent's error", async ({ splash }) => {
    const { app, page, world } = splash;
    world.agents.flags("claude", "--fail-initialize");
    const settings = new Settings(app);
    await settings.open("Claude Code");
    await settings.dialog.getByRole("button", { name: "Refresh Claude Code" }).click();

    await expect(settings.dialog.getByText("Handshake failed · just now")).toBeVisible();
    await expect(settings.dialog.locator("pre.err")).toContainText("adapter executable missing: reinstall the adapter");
    await expect(settings.value("Host compatibility")).toHaveText("Unverified on this host");
    await expect(settings.badge()).toHaveText("probe failed");
    await expect(settings.nav("Claude Code")).toHaveAccessibleName("Claude Code probe failed");

    // Still offered for a session: the CLI is installed and signed in.
    await settings.close();
    await app.newSessionButton.click();
    const claude = page.getByRole("dialog", { name: "New session" }).getByRole("radio", { name: /^Claude Code/ });
    await expect(claude).toContainText("probe failed");
    await expect(claude).toBeEnabled();
  });

  test.describe("signed out", () => {
    test.beforeEach(({ world }) => world.agents.loggedOut("claude"));

    test("an agent that is signed out cannot start a session", async ({ splash }) => {
      const { app, page } = splash;
      await expect(page.getByRole("button", { name: "Agents · 2 ready" })).toBeVisible();
      const settings = new Settings(app);
      await settings.open("Overview");
      await expect(settings.badge(settings.row("Claude Code"))).toHaveText("signed out");
      await settings.go("Claude Code");
      await expect(settings.value("Login")).toHaveText("signed out");
      await settings.close();

      await app.newSessionButton.click();
      const agents = page.getByRole("dialog", { name: "New session" }).getByRole("radiogroup", { name: "Agent" });
      await expect(agents.getByRole("radio", { name: /^Claude Code/ })).toContainText("signed out");
      await expect(agents.getByRole("radio", { name: /^Claude Code/ })).toBeDisabled();
      // The default agent can't start: the dialog picks one that can.
      await expect(agents.getByRole("radio", { name: /^Codex/ })).toBeChecked();
    });
  });

  test("extra arguments go before the agent's own on every launch", async ({ splash }) => {
    const { app, page, world, db } = splash;
    const settings = new Settings(app);
    await settings.open("Claude Code");
    const args = settings.dialog.getByRole("textbox", { name: "Extra arguments" });
    await args.fill("--verbose --x=1");
    await args.press("Enter");
    await expect(settings.value("Launch")).toHaveText("--verbose --x=1 npx -y @agentclientprotocol/claude-agent-acp@0.81.1");
    await expect.poll(() => db.query("SELECT extra_args FROM agent_settings WHERE agent_id = 'claude'")).toEqual([{ extra_args: "--verbose --x=1" }]);

    // The handshake…
    await settings.dialog.getByRole("button", { name: "Refresh Claude Code" }).click();
    await expect(settings.value("Host compatibility")).toHaveText("ACP handshake verified on this host");
    await settings.close();
    // …and a session.
    await app.newSession({ where: "in_place" });
    const launches = world.agents.launches("claude");
    expect(launches).toHaveLength(2);
    for (const launch of launches) expect(launch.argv).toEqual(["--verbose", "--x=1", "-y", "@agentclientprotocol/claude-agent-acp@0.81.1"]);
    expect(launches[1].cwd).toBe(world.repo);
    await app.sideTab("Details").click();
    await expect(app.detail("Launch")).toHaveText("--verbose --x=1 npx -y @agentclientprotocol/claude-agent-acp@0.81.1");

    // Kept across a reload.
    await page.reload();
    await app.waitReady();
    await settings.open("Claude Code");
    await expect(args).toHaveValue("--verbose --x=1");
  });
});

test.describe("skills, commands and MCP servers", () => {
  test.beforeEach(({ world }) => seedCustomizations(world));

  test("skills are grouped by where they live, and open in a preview", async ({ splash }) => {
    const { app, page } = splash;
    const settings = new Settings(app);
    await settings.open("Claude Code");
    await expect(settings.dialog.locator(".links")).toContainText("3Skills");
    await settings.subPage("Claude Code", "Skills");

    const groups = settings.dialog.locator(".title.t-group");
    await expect(groups).toHaveText(["~/.claude/skills", "~/.agents/skills shared", "repo/.claude/skills"]);
    await expect(settings.row("deploy")).toContainText("Ship it safely.");
    await expect(settings.row(/^review/).locator(".tag")).toHaveText(["not in / menu", "manual only"]);
    await expect(settings.row("local-one")).toContainText("Only in this project");
    // Codex's own skills are not Claude's; a folder without SKILL.md is not a skill.
    await expect(settings.row("plan")).toHaveCount(0);
    await expect(settings.row("empty")).toHaveCount(0);

    const filter = settings.dialog.getByRole("textbox", { name: "Filter skills" });
    await filter.fill("diff");
    await expect(settings.dialog.locator(".filter-bar")).toContainText("1 of 3");
    await expect(settings.dialog.locator(".set-row")).toHaveCount(1);
    await filter.fill("nothing like it");
    await expect(settings.dialog.getByText("No skills match.")).toBeVisible();
    await filter.fill("");

    await settings.row("deploy").getByRole("button").first().click();
    const preview = page.getByRole("dialog", { name: "skill preview" });
    await expect(preview.getByRole("heading", { name: "Deploy", exact: true })).toBeVisible();
    await expect(preview.getByRole("region", { name: "Document" }).locator("strong")).toHaveText("carefully");
    const frontmatter = preview.getByRole("complementary", { name: "Frontmatter" });
    await expect(frontmatter).toContainText("Ship it safely.");
    await expect(frontmatter.locator(".tag")).toHaveText(["Bash", "Read"]);
    await preview.getByRole("radiogroup", { name: "View" }).getByRole("radio", { name: "Source" }).click();
    await expect(preview.getByRole("region", { name: "Document" })).toContainText("Ship it **carefully**.");

    // Esc closes the preview, then Settings.
    await page.keyboard.press("Escape");
    await expect(preview).toBeHidden();
    await expect(settings.heading).toHaveText("Claude Code · Skills");
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
    await settings.open("Claude Code");
    await settings.subPage("Claude Code", "Commands");
    await expect(settings.dialog.getByText("Refresh Claude Code to list its commands.")).toBeVisible();

    await settings.go("Claude Code");
    await settings.dialog.getByRole("button", { name: "Refresh Claude Code" }).click();
    await expect(settings.dialog.locator(".links")).toContainText("13Commands");
    await settings.subPage("Claude Code", "Commands");
    const command = (name: string) => settings.dialog.getByRole("button", { name: new RegExp(`^/${name} `) });
    await expect(settings.dialog.locator(".filter-bar")).toContainText("13 of 13");
    await expect(command("compact").locator(".tag")).toHaveText("built in");
    await expect(command("deploy").locator(".tag")).toHaveText("skill");
    await expect(command("review").locator(".tag")).toHaveCount(0);
    await expect(command("git:commit").locator(".tag")).toHaveCount(0);

    await settings.dialog.getByRole("textbox", { name: "Filter commands" }).fill("git:");
    await expect(settings.dialog.locator(".filter-bar")).toContainText("1 of 13");
    await command("git:commit").click();
    const preview = page.getByRole("dialog", { name: "command preview" });
    await expect(preview.getByRole("region", { name: "Document" })).toContainText("Commit it.");
    const frontmatter = preview.getByRole("complementary", { name: "Frontmatter" });
    await expect(frontmatter).toContainText("Commit staged changes");
    await expect(frontmatter).toContainText("<message>");
    await page.keyboard.press("Escape");

    await settings.dialog.getByRole("textbox", { name: "Filter commands" }).fill("compact");
    await command("compact").click();
    await expect(page.getByRole("dialog", { name: "command preview" })).toContainText("Built into the agent. No file.");
  });

  test("MCP servers show their transport and key names, never secret values", async ({ splash }) => {
    const { app, page, world } = splash;
    const settings = new Settings(app);
    await settings.open("Claude Code");
    await settings.subPage("Claude Code", "MCP servers");
    await expect(settings.dialog.locator(".lede")).toHaveText("From ~/.claude.json. Only header and env names are shown, never values.");
    await expect(settings.dialog.locator(".filter-bar")).toContainText("3 of 3");

    await expect(settings.row(/^docs/)).toContainText("http");
    await expect(settings.row(/^docs/)).toContainText("https://docs.example/mcp");
    await expect(settings.row(/^docs/)).toContainText("headers: Authorization");
    await expect(settings.row(/^db/)).toContainText("stdio");
    await expect(settings.row(/^db/)).toContainText("npx db-mcp");
    await expect(settings.row(/^db/)).toContainText("env: DB_PASSWORD");
    await expect(settings.row(/^legacy/).locator(".tag")).toHaveText(["stdio", "disabled"]);
    await expect(settings.row(/^tracker/)).toHaveCount(0);

    // Servers configured for one project are listed on request.
    await settings.dialog.getByRole("checkbox", { name: "Per project (1)" }).click();
    await expect(settings.dialog.locator(".filter-bar")).toContainText("4 of 4");
    await expect(settings.row(/^tracker/)).toContainText(`project ${world.repo}`);
    await expect(settings.row(/^tracker/)).toContainText("env: API_TOKEN");
    await settings.dialog.getByRole("textbox", { name: "Filter servers" }).fill("docs.example");
    await expect(settings.dialog.locator(".filter-bar")).toContainText("1 of 4");

    // Other agents' configs, including one that cannot be read.
    await settings.subPage("Codex", "MCP servers");
    await expect(settings.row(/^repl/)).toContainText("env: TOKEN");
    await settings.subPage("Pi", "MCP servers");
    await expect(settings.row("Couldn't read ~/.pi/agent/mcp.json")).toBeVisible();

    const html = await page.content();
    for (const secret of SECRETS) expect(html).not.toContain(secret);
  });

  test("Search settings narrows the rail", async ({ splash }) => {
    const { app, page } = splash;
    const settings = new Settings(app);
    await settings.open();
    const search = settings.dialog.getByRole("textbox", { name: "Search settings" });
    await search.fill("codex");
    await expect(settings.rail.locator(".nav-item .label")).toHaveText(["Codex", "Skills", "Commands", "MCP servers"]);
    await settings.rail.locator(".nav-item", { hasText: "MCP servers" }).click();
    await expect(settings.heading).toHaveText("Codex · MCP servers");

    await search.fill("shortcut");
    await expect(settings.rail.locator(".nav-item .label")).toHaveText(["Keyboard shortcuts"]);
    // Esc clears the search before it closes anything.
    await search.press("Escape");
    await expect(search).toHaveValue("");
    await expect(settings.nav("Claude Code")).toBeVisible();
    await expect(settings.dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(settings.dialog).toBeHidden();
  });
});

test("General sets the defaults for new sessions", async ({ splash }) => {
  const { app, page, world, db } = splash;
  const settings = new Settings(app);
  await settings.open();
  await expect(settings.value("Data folder")).toHaveText(world.data);
  await expect(settings.value("Worktrees")).toHaveText(join(world.data, "worktrees"));

  const agent = settings.dialog.getByRole("radiogroup", { name: "Default agent" });
  await expect(agent.getByRole("radio", { name: "Claude Code" })).toBeChecked();
  await agent.getByRole("radio", { name: "Codex" }).click();
  await expect(agent.getByRole("radio", { name: "Codex" })).toBeChecked();
  const where = settings.dialog.getByRole("radiogroup", { name: "Where sessions work" });
  await expect(where.getByRole("radio", { name: "Worktree" })).toBeChecked();
  await where.getByRole("radio", { name: "In place" }).click();
  const notify = settings.dialog.getByRole("switch", { name: "Notify when a background session needs you" });
  await expect(notify).toBeChecked();
  await notify.click();
  await expect(notify).not.toBeChecked();
  await expect.poll(() => [db.setting("default_agent"), db.setting("default_isolation"), db.setting("notify")]).toEqual(["codex", "in_place", "off"]);
  await settings.close();

  await app.newSessionButton.click();
  const dialog = page.getByRole("dialog", { name: "New session" });
  await expect(dialog.getByRole("radiogroup", { name: "Agent" }).getByRole("radio", { name: /^Codex/ })).toBeChecked();
  await expect(dialog.getByRole("radiogroup", { name: "Where it works" }).getByRole("radio", { name: /^In place/ })).toBeChecked();
  await dialog.getByRole("button", { name: /^Start session/ }).click();
  const id = await app.sessionId();
  expect(db.session(id)).toMatchObject({ agent_id: "codex", isolation: "in_place" });

  // Kept across a reload.
  await page.reload();
  await app.waitReady();
  await settings.open();
  await expect(agent.getByRole("radio", { name: "Codex" })).toBeChecked();
  await expect(where.getByRole("radio", { name: "In place" })).toBeChecked();
  await expect(notify).not.toBeChecked();
});

test.describe("keyboard shortcuts", () => {
  test("defaults suit the client, and a new shortcut replaces the old one", async ({ splash }) => {
    const { app, page, db, harness } = splash;
    await app.newSession({ where: "in_place" });
    const terminal = page.getByRole("button", { name: "Terminal", exact: true });
    const settings = new Settings(app);
    await settings.open("Keyboard shortcuts");
    await expect(settings.dialog.locator(".lede")).toHaveText(
      `Click a shortcut to change it. Defaults follow ${process.platform === "darwin" ? "macOS" : "Windows and Linux"} conventions${harness === "web" ? " and avoid browser navigation shortcuts" : ""}.`,
    );
    await expect(settings.shortcut("New session")).toHaveAccessibleName(keycaps(app.combo("N")));
    await expect(settings.shortcut("Go to session 1")).toHaveAccessibleName(keycaps(app.combo("1")));
    await expect(settings.shortcut("Command palette")).toHaveAccessibleName(`${keycaps(app.combo("Shift+P"))} or ${keycaps(app.combo("K"))}`);
    await expect(settings.shortcut("Toggle terminal")).toHaveAccessibleName(keycaps(app.combo("J")));
    await expect(settings.dialog.getByRole("button", { name: "Reset all" })).toHaveCount(0);

    const keys = settings.shortcut("Toggle terminal");
    await keys.click();
    await expect(keys).toHaveAttribute("aria-pressed", "true");
    await expect(keys).toHaveAccessibleName("Press keys…");
    // A shortcut needs a modifier.
    await page.keyboard.press("t");
    await expect(settings.row("Toggle terminal")).toContainText("Add ⌘, ⌥ or ⌃");
    await page.keyboard.press("Control+Alt+T");
    await expect(keys).toHaveAttribute("aria-pressed", "false");
    await expect(keys).toHaveAccessibleName(keycaps("Ctrl+Alt+T"));
    await expect(settings.row("Toggle terminal").getByRole("button", { name: "reset" })).toBeVisible();
    await expect.poll(() => db.setting("keybindings")).toBe(JSON.stringify({ "view.terminal": ["Ctrl+Alt+T"] }));
    await settings.close();

    await page.keyboard.press("Control+Alt+T");
    await expect(terminal).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#terminal-pane")).toBeVisible();
    // The old shortcut does nothing now: only the new one closes it again.
    await page.keyboard.press(app.key("J"));
    await page.keyboard.press("Control+Alt+T");
    await expect(terminal).toHaveAttribute("aria-pressed", "false");

    await settings.open("Keyboard shortcuts");
    await settings.row("Toggle terminal").getByRole("button", { name: "reset" }).click();
    await expect(keys).toHaveAccessibleName(keycaps(app.combo("J")));
    await expect.poll(() => db.setting("keybindings")).toBe("{}");
    await settings.close();
    await page.keyboard.press(app.key("J"));
    await expect(terminal).toHaveAttribute("aria-pressed", "true");
  });

  test("taking a shortcut another action uses asks first; Backspace clears one", async ({ splash }) => {
    const { app, page, db } = splash;
    const settings = new Settings(app);
    await settings.open("Keyboard shortcuts");
    const keys = settings.shortcut("Toggle terminal");
    const row = settings.row("Toggle terminal");
    const clash = `${keycaps(app.combo("N"))} is used by “New session”`;

    await keys.click();
    await page.keyboard.press(app.key("N"));
    await expect(row).toContainText(clash);
    await row.getByRole("button", { name: "Cancel" }).click();
    await expect(row).not.toContainText(clash);
    await expect(keys).toHaveAccessibleName(keycaps(app.combo("J")));
    await expect(settings.shortcut("New session")).toHaveAccessibleName(keycaps(app.combo("N")));
    // Recording stops the shortcut from firing: no New session dialog.
    await expect(page.getByRole("dialog", { name: "New session" })).toHaveCount(0);

    await keys.click();
    await page.keyboard.press(app.key("N"));
    await row.getByRole("button", { name: "Use here" }).click();
    await expect(keys).toHaveAccessibleName(keycaps(app.combo("N")));
    await expect(settings.shortcut("New session")).toHaveAccessibleName("none");
    await expect.poll(() => JSON.parse(db.setting("keybindings") ?? "{}")).toEqual({ "session.new": [], "view.terminal": [app.combo("N")] });

    // Esc cancels a recording; Backspace removes the shortcut.
    const palette = settings.shortcut("Command palette");
    await palette.click();
    await page.keyboard.press("Escape");
    await expect(palette).toHaveAttribute("aria-pressed", "false");
    await expect(settings.dialog).toBeVisible();
    await palette.click();
    await page.keyboard.press("Backspace");
    await expect(palette).toHaveAccessibleName("none");

    await settings.dialog.getByRole("button", { name: "Reset all" }).click();
    await expect(settings.shortcut("New session")).toHaveAccessibleName(keycaps(app.combo("N")));
    await expect(palette).toHaveAccessibleName(`${keycaps(app.combo("Shift+P"))} or ${keycaps(app.combo("K"))}`);
    await expect(keys).toHaveAccessibleName(keycaps(app.combo("J")));
    await expect.poll(() => db.setting("keybindings")).toBe("{}");
    await expect(settings.dialog.getByRole("button", { name: "Reset all" })).toHaveCount(0);
  });
});
