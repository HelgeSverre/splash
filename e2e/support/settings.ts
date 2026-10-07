// Settings: the dialog's rail, pages and rows; a home folder with skills,
// commands and MCP servers to list; and shortcuts as Settings writes them.
import { expect, type Locator, type Page } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { APPLE, type App } from "./app.ts";
import { write } from "./git.ts";
import { FIXTURES } from "./paths.ts";
import type { World } from "./world.ts";

export class Settings {
  readonly app: App;
  readonly page: Page;
  constructor(app: App) {
    this.app = app;
    this.page = app.page;
  }

  get dialog() {
    return this.page.getByRole("dialog", { name: "Settings" });
  }
  get rail() {
    return this.dialog.getByRole("navigation");
  }
  /** The open page's title. */
  get heading() {
    return this.dialog.getByRole("heading", { level: 2 });
  }

  /** Open Settings from the sidebar's gear (it opens on General), then a page. */
  async open(item?: string) {
    await this.app.sidebar.getByRole("button", { name: "Settings", exact: true }).click();
    await expect(this.heading).toHaveText("General");
    if (item) await this.go(item);
  }

  /** A rail item by its label. An agent's item is named with its status too. */
  nav(label: string) {
    return this.rail.locator(".nav-item").filter({ has: this.page.locator(".label").getByText(label, { exact: true }) });
  }

  /** Go to a rail item and wait for its page. */
  async go(label: string, heading = label === "Overview" ? "Agents" : label) {
    await this.nav(label).click();
    await expect(this.heading).toHaveText(heading);
  }

  /** An agent's sub-page (Skills, Commands, MCP servers), from the links on its page. */
  async subPage(agent: string, title: "Skills" | "Commands" | "MCP servers") {
    await this.go(agent);
    await this.dialog.locator(".links").getByRole("button", { name: new RegExp(`${title}$`) }).click();
    await expect(this.heading).toHaveText(`${agent} · ${title}`);
  }

  /** A settings row by its label. */
  row(label: string | RegExp): Locator {
    const text = typeof label === "string" ? this.page.locator(".label").getByText(label, { exact: true }) : this.page.locator(".label", { hasText: label });
    return this.dialog.locator(".set-row").filter({ has: text });
  }
  /** A row's read-only value. */
  value(label: string) {
    return this.row(label).locator(".value");
  }
  /** A status badge in a row or the page header ("ready", "signed out"…). */
  badge(scope: Locator = this.dialog.locator(".page-head")) {
    return scope.locator(".badge");
  }
  /** The keys button of an action on the Keyboard shortcuts page. */
  shortcut(action: string) {
    return this.row(action).locator("button.keys");
  }

  async close() {
    await this.dialog.getByRole("button", { name: "Close" }).click();
    await expect(this.dialog).toBeHidden();
  }
}

/** How Settings and the Welcome page write a combo: "⌥ ⇧ N" on macOS, "Alt Shift N" elsewhere. */
export function keycaps(combo: string): string {
  const symbols: Record<string, string> = APPLE
    ? { Ctrl: "⌃", Alt: "⌥", Shift: "⇧", Meta: "⌘", Enter: "⏎", Escape: "Esc", Tab: "⇥", Backspace: "⌫", ArrowLeft: "←", ArrowRight: "→" }
    : { Meta: "Win", Escape: "Esc" };
  return combo
    .split("+")
    .map((k) => symbols[k] ?? k)
    .join(" ");
}

/** Values in the seeded MCP configs that must never reach the page. */
export const SECRETS = ["e2e-header-secret-7f3a", "e2e-db-password-91c2", "e2e-project-token-c0de", "e2e-codex-token-55aa"];

/**
 * Skills, command files and MCP servers in the shapes agents keep them, in the
 * test's home folder and repository (as in src/agents/customize.rs's tests).
 * Call before the backend starts, or before opening Settings.
 */
export function seedCustomizations(world: World) {
  const home = world.home;
  write(home, ".claude/skills/deploy/SKILL.md", "---\nname: deploy\ndescription: >\n  Ship it\n  safely.\nallowed-tools: [Bash, Read]\n---\n# Deploy\n\nShip it **carefully**.\n");
  write(home, ".claude/skills/empty/notes.txt", "a folder without SKILL.md is not a skill\n");
  write(home, ".agents/skills/review/SKILL.md", '---\nname: review\ndescription: "Review: diffs"\nuser-invocable: false\ndisable-model-invocation: true\n---\nReview the diff.\n');
  write(home, ".codex/skills/plan/SKILL.md", "---\nname: plan\ndescription: Codex only\n---\nPlan.\n");
  write(world.repo, ".claude/skills/local/SKILL.md", "---\nname: local-one\ndescription: Only in this project\n---\nLocal.\n");

  write(home, ".claude/commands/review.md", "Review the diff\n");
  write(home, ".claude/commands/git/commit.md", "---\ndescription: Commit staged changes\nargument-hint: <message>\n---\nCommit it.\n");

  const [header, password, project, codex] = SECRETS;
  write(
    home,
    ".claude.json",
    JSON.stringify({
      mcpServers: {
        docs: { type: "http", url: "https://docs.example/mcp", headers: { Authorization: `Bearer ${header}` } },
        db: { command: "npx", args: ["db-mcp"], env: { DB_PASSWORD: password } },
        legacy: { command: "node", args: ["legacy.js"], disabled: true },
      },
      projects: { [world.repo]: { mcpServers: { tracker: { command: "node", args: ["tracker.js"], env: { API_TOKEN: project } } } } },
    }),
  );
  write(home, ".codex/config.toml", `[mcp_servers.repl]\ncommand = "node"\nargs = ["repl.js"]\n[mcp_servers.repl.env]\nTOKEN = "${codex}"\n`);
  write(home, ".pi/agent/mcp.json", "{ not json");
}

/**
 * A copy of a recording whose agent also lists `commands` (as Claude lists
 * custom commands and skills), replayed by `agent`. The agent announces its
 * commands on every session/new, so a probe sees them.
 */
export function withCommands(world: World, agent: "claude" | "codex", recording: string, commands: { name: string; description: string }[]) {
  const rows = readFileSync(join(FIXTURES, recording), "utf8")
    .split("\n")
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l));
  for (const row of rows) {
    const update = row.line?.params?.update;
    if (update?.sessionUpdate === "available_commands_update") update.availableCommands.push(...commands);
  }
  const file = join(world.control, `${agent}-commands.jsonl`);
  writeFileSync(file, rows.map((r) => JSON.stringify(r)).join("\n") + "\n");
  world.agents.fixture(agent, file);
  world.agents.flags(agent, "--announce-commands");
}
