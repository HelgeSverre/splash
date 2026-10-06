// Projects, sessions and agents: the app's data, fed by commands and the
// session, agents and project channels (lib/live), and which view shows.
import { dialog, notify } from "@elyra/runtime";
import { api, type GithubItem, type AgentStatus, type Isolation, type Project, type SessionView, type Status } from "../bindings";
import type { View } from "./route.svelte";
import { prefs, setPref } from "./prefs.svelte";
import { showSideTab } from "./layout.svelte";
import { showError } from "./system";
import { dropTranscript, newTranscript, openTranscript } from "./transcripts.svelte";
import { dropTabs, ensureTabs, openTab } from "./tabs.svelte";
import { dropWorkspace, ensureWorkspace } from "./workspace.svelte";

export const app = $state({
  projects: [] as Project[],
  sessions: [] as SessionView[],
  agents: [] as AgentStatus[],
  agentsLoading: false,
  view: { kind: "welcome" } as View,
  unread: {} as Record<string, boolean>,
  focusEntry: null as number | null,
  collapsed: {} as Record<string, boolean>,
  newSession: null as null | { projectId?: string; githubItem?: GithubItem },
  /** The open Settings page, or null when Settings is closed. */
  settings: null as null | string,
});

/** Unsent messages, per session: they survive switching away. */
export const drafts: Record<string, string> = $state({});

export const currentId = () => (app.view.kind === "session" ? app.view.id : null);
export const currentSession = () => app.sessions.find((s) => s.id === currentId());
export const agentById = (id: string) => app.agents.find((a) => a.id === id);
export const projectById = (id: string) => app.projects.find((p) => p.id === id);

/** The agent is at work: running a turn, or waiting on a permission. */
export const isBusy = (status: Status) => status === "running" || status === "awaiting_permission";

export function sessionsFor(projectId: string, archived = false) {
  return app.sessions.filter((s) => s.project_id === projectId && s.archived === archived);
}

/** Sessions in sidebar order, for ⌘1–9. */
export function orderedSessions() {
  return app.projects.flatMap((p) => (app.collapsed[p.id] ? [] : sessionsFor(p.id)));
}

// ── loading ──────────────────────────────────────────────────────────────────

export async function loadAll() {
  const [projects, sessions, settings] = await Promise.all([api.list_projects(), api.list_sessions(), api.get_settings()]);
  app.projects = projects;
  app.sessions = sessions;
  Object.assign(prefs, settings);
  refreshAgents(false);
}

async function refreshAgents(refresh = true) {
  app.agentsLoading = true;
  try {
    app.agents = await api.list_agents(refresh);
  } finally {
    app.agentsLoading = false;
  }
}

/** Refresh every agent: detect, then probe each installed one. */
export async function refreshAllAgents() {
  app.agentsLoading = true;
  try {
    app.agents = await api.list_agents(true);
    await Promise.all(app.agents.filter((a) => a.installed).map((a) => api.probe_agent(a.id).catch(showError)));
  } finally {
    app.agentsLoading = false;
  }
}

// ── actions ──────────────────────────────────────────────────────────────────

export async function openSession(id: string, entryIndex?: number) {
  app.focusEntry = entryIndex ?? null;
  ensureTabs(id);
  ensureWorkspace(id);
  app.view = { kind: "session", id };
  if (entryIndex !== undefined) openTab({ kind: "chat" });
  app.unread[id] = false;
  await openTranscript(id);
}

function addSorted(p: Project) {
  app.projects.push(p);
  app.projects.sort((a, b) => a.name.localeCompare(b.name));
}

export async function addProject(path: string) {
  const p = await api.add_project(path);
  if (!app.projects.some((x) => x.id === p.id)) addSorted(p);
  return p;
}

/** Ask for a folder and add it as a project: the project, or null if cancelled or it failed. */
export async function pickFolder(): Promise<Project | null> {
  const [dir] = await dialog.open({ directory: true, title: "Add a project folder" });
  if (!dir) return null;
  try {
    return await addProject(dir);
  } catch (e) {
    showError(e);
    return null;
  }
}

export async function removeProject(id: string) {
  await api.remove_project(id);
  app.projects = app.projects.filter((p) => p.id !== id);
  for (const s of app.sessions.filter((s) => s.project_id === id)) forgetSession(s.id);
  app.sessions = app.sessions.filter((s) => s.project_id !== id);
  if (app.view.kind === "session" && !app.sessions.some((s) => s.id === currentId())) app.view = { kind: "welcome" };
}

export async function createSession(projectId: string, agentId: string, isolation: Isolation, title: string | null, context?: GithubItem, prHead = false) {
  const s = context && prHead && context.number
    ? await api.github_work_session(projectId, agentId, context.repository, context.number, title ?? context.title)
    : await api.create_session(projectId, agentId, isolation, title);
  if (context) {
    const prompt = `Work on ${context.repository}${context.number ? ` #${context.number}` : ""}: ${context.title}\n${context.url}\n\n${context.body}`;
    drafts[s.id] = prompt;
    await setPref(`session.github.${s.id}`, context.url);
  }
  if (!app.sessions.some((x) => x.id === s.id)) app.sessions.unshift(s);
  newTranscript(s.id);
  ensureTabs(s.id);
  ensureWorkspace(s.id);
  app.view = { kind: "session", id: s.id };
  return s;
}

export async function deleteSession(id: string, force = false) {
  await api.delete_session(id, force);
  app.sessions = app.sessions.filter((s) => s.id !== id);
  forgetSession(id);
  if (currentId() === id) app.view = { kind: "welcome" };
}

/** Drop everything the UI keeps for a session. */
function forgetSession(id: string) {
  dropTranscript(id);
  dropTabs(id);
  dropWorkspace(id);
  delete drafts[id];
  delete previousStatus[id];
  delete app.unread[id];
}

// ── live updates (lib/live subscribes these) ─────────────────────────────────

const previousStatus: Record<string, Status> = {};

/** A session changed: keep it, and flag (and notify) what happened out of sight. */
export function applySession(s: SessionView | undefined) {
  if (!s) return;
  const i = app.sessions.findIndex((x) => x.id === s.id);
  if (i === -1) app.sessions.unshift(s);
  else app.sessions[i] = s;

  const before = previousStatus[s.id];
  previousStatus[s.id] = s.status;
  if (before !== "idle" && s.status === "idle" && s.attention?.kind === "review" && s.id === currentId()) showSideTab("review");
  const background = (s.id !== currentId() || document.hidden) && prefs.notify !== "off";
  if (!background || before === undefined || before === s.status) return;
  if (s.status === "awaiting_permission") {
    app.unread[s.id] = true;
    notify(`${s.title} needs permission`, "Splash is waiting for you to allow or reject a tool call.").catch(() => {});
  } else if (isBusy(before) && s.status === "idle") {
    app.unread[s.id] = true;
    notify(`${s.title} finished`, agentById(s.agent_id)?.name ?? s.agent_id).catch(() => {});
  } else if (s.status === "error" && before !== "error") {
    app.unread[s.id] = true;
  }
}

export function applyAgent(a: AgentStatus | undefined) {
  if (!a) return;
  const i = app.agents.findIndex((x) => x.id === a.id);
  if (i === -1) app.agents.push(a);
  else app.agents[i] = a;
}

/** A project added elsewhere (the command line, another window). */
export function applyProject(p: Project | undefined) {
  if (!p || app.projects.some((x) => x.id === p.id)) return;
  addSorted(p);
}
