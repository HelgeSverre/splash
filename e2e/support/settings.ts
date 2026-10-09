// Settings: the dialog's rail and pages, the skill and command preview; a home
// folder with skills, commands and MCP servers to list; and shortcuts as
// Settings writes them. Found by test id, like everything in support/.
import { expect, type Locator, type Page } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { APPLE, type App } from "./app.ts";
import { write } from "./git.ts";
import { FIXTURES } from "./paths.ts";
import { testId } from "./testid.ts";
import type { World } from "./world.ts";

/** A Settings page, as the app names it (`app.settings`): `general`,
 * `shortcuts`, `agents` (the overview), `about`, `agent:claude`, or an agent's
 * sub-page `agent:claude:skills` (`commands`, `mcp`). */
export type SettingsPage = "general" | "shortcuts" | "agents" | "about" | `agent:${string}`;
export type AgentSubPage = "skills" | "commands" | "mcp";

export class Settings {
  readonly app: App;
  readonly page: Page;
  constructor(app: App) {
    this.app = app;
    this.page = app.page;
  }

  get dialog() {
    return testId(this.page, "settings");
  }
  /** The sidebar's gear. */
  get openButton() {
    return testId(this.page, "sidebar-settings");
  }
  get closeButton() {
    return testId(this.dialog, "modal-close");
  }
  /** Search settings, over the rail. */
  get search() {
    return testId(this.dialog, "settings-search");
  }
  /** A rail item, by the page it opens. An agent's is named with its status too. */
  nav(page: SettingsPage) {
    return testId(this.dialog, "settings-nav", { page });
  }
  /** The pages the rail lists, in order. */
  railPages(): Promise<(string | null)[]> {
    return testId(this.dialog, "settings-nav").evaluateAll((items) => items.map((item) => item.getAttribute("data-page")));
  }
  /** The open page; its `data-page` says which. */
  get current() {
    return testId(this.dialog, "settings-page");
  }
  async expectPage(page: SettingsPage) {
    await expect(this.current).toHaveAttribute("data-page", page);
  }

  /** Open Settings from the sidebar's gear (it opens on General), then a page. */
  async open(page?: SettingsPage) {
    await this.openButton.click();
    await this.expectPage("general");
    if (page) await this.go(page);
  }
  /** Go to a rail item and wait for its page. */
  async go(page: SettingsPage) {
    await this.nav(page).click();
    await this.expectPage(page);
  }
  /** An agent's sub-page, from the links on its page. */
  async subPage(agent: string, sub: AgentSubPage) {
    await this.go(`agent:${agent}`);
    await this.link(sub).click();
    await this.expectPage(`agent:${agent}:${sub}`);
  }

  async close() {
    await this.closeButton.click();
    await expect(this.dialog).toBeHidden();
  }

  // ── Any page ───────────────────────────────────────────────────────────────

  /** The line under the page's title. */
  get lede() {
    return testId(this.current, "settings-lede");
  }
  /** The titles over the page's groups. */
  get groupTitles() {
    return testId(this.current, "settings-group-title");
  }
  /** A row by its key (`host`, `login`, `launch`, `data-folder`…). */
  row(key: string) {
    return testId(this.current, "settings-row", { key });
  }
  /** A row's read-only value: a row's by key, or the one in `row`. */
  value(row: string | Locator) {
    return testId(typeof row === "string" ? this.row(row) : row, "settings-value");
  }
  /** The button that makes up a row that opens something (an agent, a skill). */
  rowLink(row: Locator) {
    return testId(row, "settings-row-open");
  }
  /** The labels on a skill, command or MCP server ("built in", "disabled"…). */
  tags(row: Locator) {
    return testId(row, "settings-tag");
  }
  /** The filter over a list of skills, commands or servers. */
  get filter() {
    return testId(this.current, "settings-filter");
  }
  /** The filter's "n of m"; `data-shown` and `data-total`. */
  get filterCount() {
    return testId(this.current, "filter-count");
  }
  /** What a list says when it has nothing to show. */
  get empty() {
    return testId(this.current, "settings-empty");
  }

  // ── General ────────────────────────────────────────────────────────────────

  /** A card of Default agent, by agent id. */
  defaultAgent(agent: string) {
    return testId(testId(this.current, "settings-default-agent"), "choice", { value: agent });
  }
  /** Where sessions work: `worktree` or `in_place`. */
  isolation(value: "worktree" | "in_place") {
    return testId(testId(this.current, "settings-isolation"), "segment", { value });
  }
  /** "Notify when a background session needs you". */
  get notify() {
    return testId(this.current, "settings-notify");
  }

  // ── Agents ─────────────────────────────────────────────────────────────────

  /** An agent's row on the Agents overview. */
  agentRow(agent: string) {
    return testId(this.current, "settings-agent", { agent });
  }
  /** An agent's status ("ready", "signed out"…): its overview row's, or its page's. */
  status(agent: string) {
    return testId(this.current, "settings-agent-status", { agent });
  }
  /** Refresh on an agent's page: runs the handshake. */
  get refresh() {
    return testId(this.current, "settings-agent-refresh");
  }
  /** Refresh detection and the free handshake for every installed agent. */
  get refreshAll() {
    return testId(this.current, "settings-agents-refresh");
  }
  /** A link on an agent's page to its skills, commands or MCP servers; `data-count` is how many. */
  link(sub: AgentSubPage) {
    return testId(this.current, "settings-agent-link", { page: sub });
  }
  get extraArgs() {
    return testId(this.current, "settings-extra-args");
  }
  /** The Handshake group; `data-state` is `unchecked`, `ok` or `failed`. */
  get handshake() {
    return testId(this.current, "settings-handshake");
  }
  /** The agent's error, when the handshake failed. */
  get handshakeError() {
    return testId(this.handshake, "settings-handshake-error");
  }
  /** What the handshake reported the agent supports; `data-supported` on each. */
  capabilities(key?: "load_session" | "image" | "audio" | "embedded_context") {
    return testId(this.current, "settings-capability", key ? { capability: key } : {});
  }
  /** One of the agent's options from the handshake (`model`, `mode`…), by id. */
  option(id: string) {
    return testId(this.current, "settings-option", { option: id });
  }

  // ── Skills, commands and MCP servers ───────────────────────────────────────

  skills(name?: string) {
    return testId(this.current, "settings-skill", name ? { name } : {});
  }
  /** Commands by name, without the slash (`compact`, `git:commit`). */
  commands(name?: string) {
    return testId(this.current, "settings-command", name ? { name } : {});
  }
  mcpServers(name?: string) {
    return testId(this.current, "settings-mcp-server", name ? { name } : {});
  }
  /** A config that couldn't be read. */
  get mcpErrors() {
    return testId(this.current, "settings-mcp-error");
  }
  /** Per project (n): also lists servers configured for one project; `data-count` is n. */
  get perProject() {
    return testId(this.current, "settings-mcp-projects");
  }

  /** The skill or command preview, over Settings. */
  get preview() {
    return new DocPreview(this.page);
  }

  // ── Keyboard shortcuts ─────────────────────────────────────────────────────

  /** An action's shortcut (`session.new`, `view.terminal`, `app.palette`…). */
  private recorder(action: string) {
    return testId(this.current, "settings-shortcut", { action });
  }
  /** The action's keys, which record a new shortcut on click; `aria-pressed` while recording. */
  shortcut(action: string) {
    return testId(this.recorder(action), "shortcut-keys");
  }
  /** Back to the action's default; shown once it has been changed. */
  shortcutReset(action: string) {
    return testId(this.recorder(action), "shortcut-reset");
  }
  /** Why a recorded combo can't be used ("Add ⌘, ⌥ or ⌃"). */
  shortcutHint(action: string) {
    return testId(this.recorder(action), "shortcut-hint");
  }
  /** "… is used by …", and its two answers. */
  shortcutClash(action: string) {
    return {
      message: testId(this.recorder(action), "shortcut-clash"),
      useHere: testId(this.recorder(action), "shortcut-use-here"),
      cancel: testId(this.recorder(action), "shortcut-cancel"),
    };
  }
  /** Reset all; shown once any shortcut has been changed. */
  get resetShortcuts() {
    return testId(this.current, "settings-reset-shortcuts");
  }
}

/** The read-only preview of a skill or command file. */
export class DocPreview {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  /** Its `data-kind` is `skill` or `command`. */
  get dialog() {
    return testId(this.page, "doc-preview");
  }
  /** Rendered or Source. */
  view(mode: "rendered" | "source") {
    return testId(testId(this.dialog, "doc-preview-view"), "segment", { value: mode });
  }
  /** The file's body, rendered or as source (`data-mode`). */
  get document() {
    return testId(this.dialog, "doc-preview-document");
  }
  /** A built-in command's note, in place of a file. */
  get builtin() {
    return testId(this.dialog, "doc-preview-builtin");
  }
  /** A frontmatter field, by its key (`description`, `allowed-tools`…). */
  field(key: string) {
    return testId(testId(this.dialog, "doc-preview-frontmatter"), "doc-preview-field", { key });
  }
  /** A list field's items. */
  chips(field: Locator) {
    return testId(field, "doc-preview-chip");
  }
  // The rendered markdown is the document's own HTML, without test ids.
  /** The rendered document's headings. */
  get headings() {
    return this.document.getByRole("heading");
  }
  /** The rendered document's bold text. */
  get bold() {
    return this.document.locator("strong");
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
