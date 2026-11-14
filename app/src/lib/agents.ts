// What we can say about an agent at a glance, and what belongs to it.
import type { AgentStatus, CommandFile, McpServer, Skill, SlashCommand } from "../bindings";

export type Readiness = { tone: "ok" | "warn" | "err" | "none"; label: string };

// "err" also means "cannot start a session": the Welcome count and the New
// session dialog read it that way, so a missing agent stays "err" here.
// `readinessBadge` is the same answer as Settings draws it.
export function readiness(a: AgentStatus): Readiness {
  if (!a.installed) return { tone: "err", label: "not installed" };
  // Native agents do not necessarily run through npx (for example, Vibe uses
  // `vibe-acp`). Use the actual launch program so the recovery action is clear.
  if (!a.runner_ok) return { tone: "err", label: `${a.launch.split(/\s+/, 1)[0] || "ACP launcher"} missing` };
  if (a.auth === "logged_out") return { tone: "err", label: "signed out" };
  if (a.probe && !a.probe.ok) return { tone: "warn", label: "check failed" };
  if (a.probe?.ok) return { tone: "ok", label: "ready" };
  return { tone: "none", label: "not checked" };
}

/** `readiness` for a status badge or dot: not being installed is not an error, so it is grey. */
export function readinessBadge(a: AgentStatus): Readiness {
  const r = readiness(a);
  return a.installed ? r : { ...r, tone: "none" };
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
