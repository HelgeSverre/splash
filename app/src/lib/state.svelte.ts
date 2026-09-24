// App state: one reactive store, fed by commands and the Rust event channels.
import { notify, toast } from "@elyra/runtime";
import {
  api,
  channel,
  type AgentStatus,
  type Entry,
  type Isolation,
  type Project,
  type SessionView,
  type Status,
} from "../bindings";

export type View = { kind: "welcome" } | { kind: "session"; id: string };

export type Transcript = { entries: Entry[]; versions: number[]; loading: boolean };

export const app = $state({
  projects: [] as Project[],
  sessions: [] as SessionView[],
  agents: [] as AgentStatus[],
  agentsLoading: false,
  view: { kind: "welcome" } as View,
  unread: {} as Record<string, boolean>,
  collapsed: {} as Record<string, boolean>,
  newSession: null as null | { projectId?: string },
  /** The open Settings page, or null when Settings is closed. */
  settings: null as null | string,
});

export const transcripts: Record<string, Transcript> = $state({});

export const currentId = () => (app.view.kind === "session" ? app.view.id : null);
export const currentSession = () => app.sessions.find((s) => s.id === currentId());
export const agentById = (id: string) => app.agents.find((a) => a.id === id);
export const projectById = (id: string) => app.projects.find((p) => p.id === id);

export function sessionsFor(projectId: string, archived = false) {
  return app.sessions.filter((s) => s.project_id === projectId && s.archived === archived);
}

// ── loading ──────────────────────────────────────────────────────────────────

/** App settings (key → value), from the Rust side's settings table. */
export const prefs: Record<string, string> = $state({});

export async function setPref(key: string, value: string) {
  prefs[key] = value;
  await api.set_setting(key, value).catch(showError);
}

export function openSettings(page = "general") {
  app.settings = page;
  loadCustomize();
}

// ── skills, commands and MCP servers on disk (for Settings) ─────────────────

import type { CommandFile, McpList, Skill } from "../bindings";

export const customize = $state({
  skills: null as Skill[] | null,
  commandFiles: [] as CommandFile[],
  mcp: null as McpList | null,
});

export async function loadCustomize() {
  const [skills, commandFiles, mcp] = await Promise.all([
    api.list_skills().catch(() => [] as Skill[]),
    api.list_command_files().catch(() => [] as CommandFile[]),
    api.list_mcp_servers().catch(() => ({ servers: [], errors: [] }) as McpList),
  ]);
  customize.skills = skills;
  customize.commandFiles = commandFiles;
  customize.mcp = mcp;
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

export async function loadAll() {
  const [projects, sessions, settings] = await Promise.all([api.list_projects(), api.list_sessions(), api.get_settings()]);
  app.projects = projects;
  app.sessions = sessions;
  Object.assign(prefs, settings);
  refreshAgents(false);
}

export async function refreshAgents(refresh = true) {
  app.agentsLoading = true;
  try {
    app.agents = await api.list_agents(refresh);
  } finally {
    app.agentsLoading = false;
  }
}

// ── live updates from Rust ───────────────────────────────────────────────────

const previousStatus: Record<string, Status> = {};

channel("session").subscribe((s) => {
  if (!s) return;
  const i = app.sessions.findIndex((x) => x.id === s.id);
  if (i === -1) app.sessions.unshift(s);
  else app.sessions[i] = s;

  const before = previousStatus[s.id];
  previousStatus[s.id] = s.status;
  const background = (s.id !== currentId() || document.hidden) && prefs.notify !== "off";
  if (!background || before === undefined || before === s.status) return;
  if (s.status === "awaiting_permission") {
    app.unread[s.id] = true;
    notify(`${s.title} needs permission`, "Splash is waiting for you to allow or reject a tool call.").catch(() => {});
  } else if ((before === "running" || before === "awaiting_permission") && s.status === "idle") {
    app.unread[s.id] = true;
    notify(`${s.title} finished`, agentById(s.agent_id)?.name ?? s.agent_id).catch(() => {});
  } else if (s.status === "error" && before !== "error") {
    app.unread[s.id] = true;
  }
});

channel("transcript").subscribe((ev) => {
  if (!ev) return;
  const t = transcripts[ev.session];
  if (!t || t.loading) return; // not open — it loads in full when opened
  for (const c of ev.changes) {
    const local = t.versions[c.index] ?? 0;
    if (c.op === "upsert") {
      if (c.version <= local) continue; // already have it (or the channel replayed it)
      while (t.entries.length < c.index) {
        t.entries.push({ kind: "divider", text: "" });
        t.versions.push(0);
      }
      t.entries[c.index] = c.entry;
      t.versions[c.index] = c.version;
    } else {
      if (c.version <= local) continue;
      const e = t.entries[c.index];
      if (c.version !== local + 1 || !e || (e.kind !== "agent" && e.kind !== "thought")) {
        resync(ev.session);
        return;
      }
      e.text += c.delta;
      t.versions[c.index] = c.version;
    }
  }
});

channel("agents").subscribe((a) => {
  if (!a) return;
  const i = app.agents.findIndex((x) => x.id === a.id);
  if (i === -1) app.agents.push(a);
  else app.agents[i] = a;
});

async function resync(id: string) {
  const t = transcripts[id];
  if (!t) return;
  const snap = await api.session_transcript(id);
  t.entries = snap.entries;
  t.versions = snap.versions;
}

// ── actions ──────────────────────────────────────────────────────────────────

export async function openSession(id: string) {
  ensureSession(id);
  app.view = { kind: "session", id };
  app.unread[id] = false;
  if (!transcripts[id]) transcripts[id] = { entries: [], versions: [], loading: true };
  try {
    const snap = await api.open_session(id);
    transcripts[id] = { entries: snap.entries, versions: snap.versions, loading: false };
  } catch (e) {
    transcripts[id].loading = false;
    showError(e);
  }
}

export async function addProject(path: string) {
  const p = await api.add_project(path);
  if (!app.projects.some((x) => x.id === p.id)) {
    app.projects.push(p);
    app.projects.sort((a, b) => a.name.localeCompare(b.name));
  }
  return p;
}

export async function removeProject(id: string) {
  await api.remove_project(id);
  app.projects = app.projects.filter((p) => p.id !== id);
  app.sessions = app.sessions.filter((s) => s.project_id !== id);
  if (app.view.kind === "session" && !app.sessions.some((s) => s.id === currentId())) app.view = { kind: "welcome" };
}

export async function createSession(projectId: string, agentId: string, isolation: Isolation, title: string | null) {
  const s = await api.create_session(projectId, agentId, isolation, title);
  if (!app.sessions.some((x) => x.id === s.id)) app.sessions.unshift(s);
  transcripts[s.id] = { entries: [], versions: [], loading: false };
  ensureSession(s.id);
  app.view = { kind: "session", id: s.id };
  return s;
}

export async function deleteSession(id: string) {
  await api.delete_session(id);
  app.sessions = app.sessions.filter((s) => s.id !== id);
  delete transcripts[id];
  if (currentId() === id) app.view = { kind: "welcome" };
}

export function showError(e: unknown) {
  toast(e instanceof Error ? e.message : String(e), { variant: "error", duration: 6000 });
}

/** Sessions in sidebar order, for ⌘1–9. */
export function orderedSessions() {
  return app.projects.flatMap((p) => (app.collapsed[p.id] ? [] : sessionsFor(p.id)));
}

// ── editor tabs (per session) ────────────────────────────────────────────────

export type Tab =
  | { kind: "chat" }
  | { kind: "log" }
  | { kind: "file"; path: string; line?: number }
  | { kind: "diff"; path: string };

type Tabs = { list: Tab[]; active: number };
export const tabs: Record<string, Tabs> = $state({});

const NO_TABS: Tabs = { list: [{ kind: "chat" }], active: 0 };

/** Read-only lookup (safe in `$derived`); `ensureSession` creates the entry. */
export function sessionTabs(id: string): Tabs {
  return tabs[id] ?? NO_TABS;
}

/** Per-session UI state, created before a session is shown. */
export function ensureSession(id: string) {
  if (!tabs[id]) tabs[id] = { list: [{ kind: "chat" }], active: 0 };
  if (!workspaces[id]) workspaces[id] = { changes: [], loading: false, tree: {}, expanded: { "": true }, touched: {} };
}

const sameTab = (a: Tab, b: Tab) =>
  a.kind === b.kind && ("path" in a ? a.path : "") === ("path" in b ? (b as { path: string }).path : "");

/** Open (or focus) a tab in the current session. */
export function openTab(tab: Tab) {
  const id = currentId();
  if (!id) return;
  const t = sessionTabs(id);
  const i = t.list.findIndex((x) => sameTab(x, tab));
  if (i >= 0) {
    t.list[i] = tab; // e.g. a new line to jump to
    t.active = i;
  } else {
    t.list.push(tab);
    t.active = t.list.length - 1;
  }
}

export function closeTab(index: number) {
  const id = currentId();
  if (!id) return;
  const t = sessionTabs(id);
  if (t.list[index]?.kind === "chat") return;
  t.list.splice(index, 1);
  if (t.active >= index) t.active = Math.max(0, t.active - 1);
}

// ── workspace (changes + files) per session ──────────────────────────────────

import type { DirEntry, FileChange } from "../bindings";

export type Workspace = {
  changes: FileChange[];
  loading: boolean;
  tree: Record<string, DirEntry[]>;
  expanded: Record<string, boolean>;
  /** Bumped per path when it changes on disk, so open tabs reload. */
  touched: Record<string, number>;
};
export const workspaces: Record<string, Workspace> = $state({});

const NO_WORKSPACE: Workspace = { changes: [], loading: false, tree: {}, expanded: {}, touched: {} };

/** Read-only lookup (safe in `$derived`); `ensureSession` creates the entry. */
export function workspace(id: string): Workspace {
  return workspaces[id] ?? NO_WORKSPACE;
}

const statusTimers: Record<string, ReturnType<typeof setTimeout>> = {};

export function refreshStatus(id: string, delay = 0) {
  clearTimeout(statusTimers[id]);
  statusTimers[id] = setTimeout(async () => {
    const w = workspace(id);
    w.loading = true;
    try {
      w.changes = await api.workspace_status(id);
    } catch {
      // A missing worktree (archived) just shows no changes.
      w.changes = [];
    } finally {
      w.loading = false;
    }
  }, delay);
}

export async function loadDir(id: string, dir: string) {
  const w = workspace(id);
  try {
    w.tree[dir] = await api.list_dir(id, dir);
  } catch {
    w.tree[dir] = [];
  }
}

channel("workspace").subscribe((ev) => {
  if (!ev || !workspaces[ev.session]) return;
  const w = workspaces[ev.session];
  refreshStatus(ev.session, 150);
  const now = Date.now();
  const dirs = new Set<string>();
  for (const p of ev.paths) {
    w.touched[p] = now;
    dirs.add(p.includes("/") ? p.slice(0, p.lastIndexOf("/")) : "");
  }
  // A tool finished without paths: refresh everything that's expanded.
  if (!ev.paths.length) Object.keys(w.tree).forEach((d) => dirs.add(d));
  for (const d of dirs) if (w.tree[d] && (w.expanded[d] || d === "")) loadDir(ev.session, d);
});

channel("project").subscribe((p) => {
  if (!p || app.projects.some((x) => x.id === p.id)) return;
  app.projects.push(p);
  app.projects.sort((a, b) => a.name.localeCompare(b.name));
});

// ── layout ───────────────────────────────────────────────────────────────────

const saved = (() => {
  try {
    return JSON.parse(localStorage.getItem("splash.layout") ?? "{}");
  } catch {
    return {};
  }
})();

export const layout = $state({
  left: saved.left ?? 260,
  right: saved.right ?? 340,
  bottom: saved.bottom ?? 260,
  leftOpen: saved.leftOpen ?? true,
  rightOpen: saved.rightOpen ?? true,
  bottomOpen: saved.bottomOpen ?? false,
  rightTab: (saved.rightTab ?? "changes") as "changes" | "files" | "details",
});

export function saveLayout() {
  try {
    localStorage.setItem("splash.layout", JSON.stringify(layout));
  } catch {}
}
