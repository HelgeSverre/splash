// Editor tabs, per session: the chat, the RPC log, files and diffs.
import { currentId } from "./sessions.svelte";

export type Tab =
  | { kind: "chat" }
  | { kind: "log" }
  | { kind: "file"; path: string; line?: number }
  | { kind: "diff"; path: string };

type Tabs = { list: Tab[]; active: number };
const tabs: Record<string, Tabs> = $state({});

// Frozen: reading a session's tabs before it's open is fine, writing isn't.
const NO_TABS: Tabs = Object.freeze({ list: Object.freeze([{ kind: "chat" }]) as Tab[], active: 0 });

/** Read-only lookup (safe in `$derived`); `ensureTabs` creates the entry. */
export function sessionTabs(id: string): Tabs {
  return tabs[id] ?? NO_TABS;
}

/** Create a session's tabs before it's shown. */
export function ensureTabs(id: string) {
  if (!tabs[id]) tabs[id] = { list: [{ kind: "chat" }], active: 0 };
}

export function dropTabs(id: string) {
  delete tabs[id];
}

/** A session's tabs for writing (created if missing). Reads use `sessionTabs`. */
function tabsFor(id: string): Tabs {
  ensureTabs(id);
  return tabs[id];
}

export function selectTab(index: number) {
  const id = currentId();
  if (id) tabsFor(id).active = index;
}

const sameTab = (a: Tab, b: Tab) =>
  a.kind === b.kind && ("path" in a ? a.path : "") === ("path" in b ? (b as { path: string }).path : "");

/** Open (or focus) a tab in the current session. */
export function openTab(tab: Tab) {
  const id = currentId();
  if (!id) return;
  const t = tabsFor(id);
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
  const t = tabsFor(id);
  if (t.list[index]?.kind === "chat") return;
  t.list.splice(index, 1);
  if (t.active >= index) t.active = Math.max(0, t.active - 1);
}
