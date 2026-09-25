// What we can say about an agent at a glance, and what belongs to it.
import type { AgentStatus, CommandFile, McpServer, Skill, SlashCommand } from "../bindings";

export type Readiness = { tone: "ok" | "warn" | "err" | "none"; label: string };

export function readiness(a: AgentStatus): Readiness {
  if (!a.installed) return { tone: "err", label: "not installed" };
  if (!a.runner_ok) return { tone: "err", label: "npx missing" };
  if (a.auth === "logged_out") return { tone: "err", label: "signed out" };
  if (a.probe && !a.probe.ok) return { tone: "warn", label: "probe failed" };
  if (a.probe?.ok) return { tone: "ok", label: "ready" };
  return { tone: "none", label: "not probed" };
}

/** How Splash talks to the agent: "native ACP" or "ACP adapter". */
export const transportLabel = (a: Pick<AgentStatus, "transport">) => (a.transport === "native" ? "native ACP" : "ACP adapter");

/** Skills an agent reads: its own folders plus the shared `.agents/skills`. */
export const skillsFor = (skills: Skill[], agent: string) =>
  skills.filter((s) => s.agents.includes(agent) || s.agents.length === 0);

export const mcpFor = (servers: McpServer[], agent: string) => servers.filter((s) => s.agent === agent);

export type CommandRow = SlashCommand & { path: string | null; source: "file" | "skill" | "builtin" };

/** Probe-reported commands, each matched to the file behind it when there is one. */
export function commandsFor(a: AgentStatus, files: CommandFile[], skills: Skill[]): CommandRow[] {
  return (a.probe?.commands ?? []).map((c) => {
    const file = files.find((f) => f.agent === a.id && f.name === c.name);
    if (file) return { ...c, path: file.path, source: "file" };
    const skill = skillsFor(skills, a.id).find((s) => s.name === c.name);
    if (skill) return { ...c, path: skill.path, source: "skill" };
    return { ...c, path: null, source: "builtin" };
  });
}
