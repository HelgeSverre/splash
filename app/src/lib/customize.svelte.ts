// What Settings lists from disk (skills, command files, MCP servers), and the
// skill or command open in the preview.
import { api, type AgentStatus, type CommandFile, type McpList, type Skill } from "../bindings";
import { mcpFor, skillsFor } from "./agents";
import { app } from "./sessions.svelte";

export const customize = $state({
  skills: null as Skill[] | null,
  commandFiles: [] as CommandFile[],
  mcp: null as McpList | null,
});

async function loadCustomize() {
  const [skills, commandFiles, mcp] = await Promise.all([
    api.list_skills().catch(() => [] as Skill[]),
    api.list_command_files().catch(() => [] as CommandFile[]),
    api.list_mcp_servers().catch(() => ({ servers: [], errors: [] }) as McpList),
  ]);
  customize.skills = skills;
  customize.commandFiles = commandFiles;
  customize.mcp = mcp;
}

export function openSettings(page = "general") {
  app.settings = page;
  loadCustomize();
}

/** An agent's sub-pages in Settings, with how many things each lists (undefined until known). */
export function agentPages(a: AgentStatus) {
  return [
    { page: "skills", title: "Skills", icon: "skills", count: customize.skills ? skillsFor(customize.skills, a.id).length : undefined },
    { page: "commands", title: "Commands", icon: "commands", count: a.probe?.commands.length },
    {
      page: "mcp",
      title: "MCP servers",
      icon: "mcp",
      count: customize.mcp ? mcpFor(customize.mcp.servers, a.id).filter((s) => !s.project).length : undefined,
    },
  ];
}

/** A skill or command open in the preview modal. */
export type Preview = {
  title: string;
  kind: "skill" | "command";
  agent: string;
  path: string | null;
  description?: string;
  hint?: string | null;
};
export const preview = $state({ doc: null as Preview | null });
