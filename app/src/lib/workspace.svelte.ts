// A session's working folder: its git changes, the file tree as far as it's
// been opened, and when each path last changed on disk (lib/live subscribes
// `applyWorkspace` to the watcher's channel).
import { api, type DirEntry, type FileChange, type WorkspaceEvent } from "../bindings";

export type Workspace = {
  changes: FileChange[];
  loading: boolean;
  tree: Record<string, DirEntry[]>;
  expanded: Record<string, boolean>;
  /** Bumped per path when it changes on disk, so open tabs reload. */
  touched: Record<string, number>;
};
const workspaces: Record<string, Workspace> = $state({});

const NO_WORKSPACE: Workspace = Object.freeze({
  changes: Object.freeze([] as FileChange[]) as FileChange[],
  loading: false,
  tree: Object.freeze({}),
  expanded: Object.freeze({}),
  touched: Object.freeze({}),
});

/** Read-only lookup (safe in `$derived`); `ensureWorkspace` creates the entry. */
export function workspace(id: string): Workspace {
  return workspaces[id] ?? NO_WORKSPACE;
}

/** Create a session's workspace before it's shown. */
export function ensureWorkspace(id: string) {
  if (!workspaces[id]) workspaces[id] = { changes: [], loading: false, tree: {}, expanded: { "": true }, touched: {} };
}

export function dropWorkspace(id: string) {
  delete workspaces[id];
  clearTimeout(statusTimers[id]);
  delete statusTimers[id];
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

export function refreshStatus(id: string, delay = 0) {
  clearTimeout(statusTimers[id]);
  statusTimers[id] = setTimeout(async () => {
    const w = workspaceFor(id);
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
  const w = workspaceFor(id);
  try {
    w.tree[dir] = await api.list_dir(id, dir);
  } catch {
    w.tree[dir] = [];
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
