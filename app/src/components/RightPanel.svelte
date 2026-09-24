<script lang="ts">
  import TreeNode from "./TreeNode.svelte";
  import DetailsPanel from "./DetailsPanel.svelte";
  import { layout, saveLayout, workspace, refreshStatus, loadDir, openTab } from "../lib/state.svelte";
  import type { SessionView } from "../bindings";

  let { session }: { session: SessionView } = $props();
  const w = $derived(workspace(session.id));

  $effect(() => {
    const id = session.id;
    refreshStatus(id);
    if (!workspace(id).tree[""]) loadDir(id, "");
  });

  const totals = $derived({
    add: w.changes.reduce((n, c) => n + c.additions, 0),
    del: w.changes.reduce((n, c) => n + c.deletions, 0),
  });
  const changed = $derived(Object.fromEntries(w.changes.map((c) => [c.path, c.status])));

  const STATUS: Record<string, string> = { M: "modified", A: "added", D: "deleted", "?": "untracked", T: "type changed" };
  const dir = (p: string) => (p.includes("/") ? p.slice(0, p.lastIndexOf("/") + 1) : "");
  const file = (p: string) => p.slice(p.lastIndexOf("/") + 1);

  function setTab(t: "changes" | "files" | "details") {
    layout.rightTab = t;
    saveLayout();
  }
</script>

<div class="panel">
  <div class="tabs">
    <button class="plain" class:active={layout.rightTab === "changes"} onclick={() => setTab("changes")}>
      Changes {#if w.changes.length}<span class="n">{w.changes.length}</span>{/if}
    </button>
    <button class="plain" class:active={layout.rightTab === "files"} onclick={() => setTab("files")}>Files</button>
    <button class="plain" class:active={layout.rightTab === "details"} onclick={() => setTab("details")}>Details</button>
    <span class="spacer"></span>
    <button class="plain icon" title="Refresh" onclick={() => { refreshStatus(session.id); loadDir(session.id, ""); }}>↻</button>
  </div>

  {#if layout.rightTab === "changes"}
    <div class="summary">
      {#if w.changes.length}
        <span>{w.changes.length} file{w.changes.length === 1 ? "" : "s"}</span>
        <span class="add">+{totals.add}</span><span class="del">−{totals.del}</span>
      {:else}
        <span class="muted">{w.loading ? "Checking…" : "No changes"}</span>
      {/if}
      <span class="base" title={session.base_sha ?? ""}>
        vs {session.isolation === "worktree" ? (session.base_sha?.slice(0, 7) ?? "base") : "HEAD"}
      </span>
    </div>
    <div class="list">
      {#each w.changes as c (c.path)}
        <button class="plain change" onclick={() => openTab({ kind: "diff", path: c.path })} title="{STATUS[c.status] ?? c.status}: {c.path}">
          <span class="st st-{c.status === '?' ? 'u' : c.status.toLowerCase()}">{c.status === "?" ? "U" : c.status}</span>
          <span class="path"><span class="dir">{dir(c.path)}</span>{file(c.path)}</span>
          {#if c.binary}
            <span class="muted mono">bin</span>
          {:else}
            {#if c.additions}<span class="add">+{c.additions}</span>{/if}
            {#if c.deletions}<span class="del">−{c.deletions}</span>{/if}
          {/if}
        </button>
      {/each}
    </div>
  {:else if layout.rightTab === "details"}
    <DetailsPanel {session} />
  {:else}
    <div class="list tree">
      {#each w.tree[""] ?? [] as e (e.path)}
        <TreeNode session={session.id} entry={e} depth={0} {changed} />
      {:else}
        <div class="muted pad">Empty folder</div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .panel { height: 100%; display: flex; flex-direction: column; background: var(--surface); min-width: 0; }
  .tabs { display: flex; align-items: stretch; height: 32px; border-bottom: 1px solid var(--border); padding: 0 6px; flex: none; }
  .tabs button { padding: 0 10px; font-size: 12px; color: var(--muted); display: flex; align-items: center; gap: 6px; border-bottom: 2px solid transparent; margin-bottom: -1px; }
  .tabs button.active { color: var(--text); border-bottom-color: var(--accent); }
  .tabs button:hover { color: var(--text); }
  .tabs .icon { font-size: 14px; }
  .n { font: 10px var(--font-mono); background: var(--raised); border-radius: 999px; padding: 0 6px; color: var(--text-2); }
  .spacer { flex: 1; }
  .summary { display: flex; gap: 8px; align-items: center; padding: 8px 12px; font-size: 12px; border-bottom: 1px solid var(--border); flex: none; }
  .base { margin-left: auto; font: 11px var(--font-mono); color: var(--faint); }
  .list { flex: 1; overflow: auto; padding: 4px 0; }
  .change { display: flex; gap: 8px; align-items: center; width: 100%; padding: 3px 12px; font-size: 12.5px; }
  .change:hover { background: var(--hover); }
  .st { font: 11px var(--font-mono); width: 12px; flex: none; text-align: center; }
  .st-m { color: var(--warn); }
  .st-a, .st-u { color: var(--ok); }
  .st-d { color: var(--err); }
  .path { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--text); }
  .dir { color: var(--muted); }
  .add { color: var(--ok); font: 11px var(--font-mono); }
  .del { color: var(--err); font: 11px var(--font-mono); }
  .muted { color: var(--muted); }
  .mono { font: 11px var(--font-mono); }
  .pad { padding: 10px 12px; }
</style>
