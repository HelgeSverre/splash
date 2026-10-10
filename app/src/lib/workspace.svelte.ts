// A session's working folder: its git changes, the file tree as far as it's
// been opened, and when each path last changed on disk (lib/live subscribes
// `applyWorkspace` to the watcher's channel).
import { api, type DirEntry, type FileChange, type WorkspaceEvent } from "../bindings";
import { errorMessage } from "./format";

export type Workspace = {
  changes: FileChange[];
  loading: boolean;
  tree: Record<string, DirEntry[]>;
  /** Directory reads that failed (rather than a real empty directory). */
  treeErrors: Record<string, string>;
  expanded: Record<string, boolean>;
  /** Bumped per path when it changes on disk, so open tabs reload. */
  touched: Record<string, number>;
};
const workspaces: Record<string, Workspace> = $state({});
// Incremented when a session workspace is discarded. Request versions alone
// are not sufficient if a reconnect recreates the same session id: an old
// response and the new workspace can both be on version 1.
const lifetimes: Record<string, number> = {};
const lifetimeFor = (id: string) => lifetimes[id] ??= 0;

const NO_WORKSPACE: Workspace = Object.freeze({
  changes: Object.freeze([] as FileChange[]) as FileChange[],
  loading: false,
  tree: Object.freeze({}),
  treeErrors: Object.freeze({}),
  expanded: Object.freeze({}),
  touched: Object.freeze({}),
});

/** Read-only lookup (safe in `$derived`); `ensureWorkspace` creates the entry. */
export function workspace(id: string): Workspace {
  return workspaces[id] ?? NO_WORKSPACE;
}

/** Create a session's workspace before it's shown. */
export function ensureWorkspace(id: string) {
  if (!workspaces[id]) workspaces[id] = { changes: [], loading: false, tree: {}, treeErrors: {}, expanded: { "": true }, touched: {} };
}

export function dropWorkspace(id: string) {
  lifetimes[id] = lifetimeFor(id) + 1;
  delete workspaces[id];
  clearTimeout(statusTimers[id]);
  delete statusTimers[id];
  delete statusVersions[id];
  delete dirVersions[id];
}

/** A session's workspace for writing (created if missing). Reads use `workspace`. */
function workspaceFor(id: string): Workspace {
  ensureWorkspace(id);
  return workspaces[id];
}

export function setExpanded(id: string, dir: string, open: boolean) {
  workspaceFor(id).expanded[dir] = open;
}

const statusTimers: Record<string, ReturnType<typeof setTimeout>> = {};
const statusVersions: Record<string, number> = {};

export function refreshStatus(id: string, delay = 0) {
  clearTimeout(statusTimers[id]);
  const lifetime = lifetimeFor(id);
  const version = (statusVersions[id] ?? 0) + 1;
  statusVersions[id] = version;
  statusTimers[id] = setTimeout(async () => {
    if (lifetimeFor(id) !== lifetime || statusVersions[id] !== version) return;
    const w = workspaceFor(id);
    w.loading = true;
    try {
      const changes = await api.workspace_status(id);
      if (lifetimeFor(id) === lifetime && statusVersions[id] === version) w.changes = changes;
    } catch {
      // A missing worktree (archived) just shows no changes.
      if (lifetimeFor(id) === lifetime && statusVersions[id] === version) w.changes = [];
    } finally {
      if (lifetimeFor(id) === lifetime && statusVersions[id] === version) w.loading = false;
    }
  }, delay);
}

const dirVersions: Record<string, Record<string, number>> = {};

export async function loadDir(id: string, dir: string) {
  const lifetime = lifetimeFor(id);
  const versions = (dirVersions[id] ??= {});
  const version = (versions[dir] ?? 0) + 1;
  versions[dir] = version;
  const w = workspaceFor(id);
  try {
    const entries = await api.list_dir(id, dir);
    if (lifetimeFor(id) !== lifetime || dirVersions[id] !== versions || versions[dir] !== version) return;
    w.tree[dir] = entries;
    delete w.treeErrors[dir];
  } catch (e) {
    if (lifetimeFor(id) !== lifetime || dirVersions[id] !== versions || versions[dir] !== version) return;
    w.tree[dir] = [];
    w.treeErrors[dir] = errorMessage(e);
  }
}

/** Paths changed on disk: refresh the changes, mark the paths, reload their folders. */
export function applyWorkspace(ev: WorkspaceEvent | undefined) {
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
}
