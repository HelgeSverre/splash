<script lang="ts">
  import Self from "./TreeNode.svelte";
  import { workspace, loadDir, openTab } from "../lib/state.svelte";
  import type { DirEntry } from "../bindings";

  let { session, entry, depth, changed }: { session: string; entry: DirEntry; depth: number; changed: Record<string, string> } = $props();
  const w = $derived(workspace(session));
  const open = $derived(!!w.expanded[entry.path]);
  const children = $derived(w.tree[entry.path]);
  const mark = $derived(changed[entry.path]);
  const dirty = $derived(entry.is_dir && Object.keys(changed).some((p) => p.startsWith(entry.path + "/")));

  function toggle() {
    if (!entry.is_dir) {
      openTab(mark ? { kind: "diff", path: entry.path } : { kind: "file", path: entry.path });
      return;
    }
    w.expanded[entry.path] = !open;
    if (!open && !children) loadDir(session, entry.path);
  }
</script>

<button class="plain node" style:padding-left="{8 + depth * 12}px" onclick={toggle} title={entry.path}>
  <span class="twist">{entry.is_dir ? (open ? "▾" : "▸") : ""}</span>
  <span class="name" class:dir={entry.is_dir} class:dirty class:m={mark === "M"} class:a={mark === "A" || mark === "?"} class:d={mark === "D"}>{entry.name}</span>
  {#if mark}<span class="mark {mark === '?' ? 'a' : mark.toLowerCase()}">{mark === "?" ? "U" : mark}</span>{/if}
</button>
{#if open && children}
  {#each children as child (child.path)}
    <Self {session} entry={child} depth={depth + 1} {changed} />
  {/each}
{/if}

<style>
  .node { display: flex; align-items: center; gap: 4px; width: 100%; padding: 2px 8px; font-size: 12.5px; color: var(--text-2); }
  .node:hover { background: var(--hover); color: var(--text); }
  .twist { width: 10px; flex: none; color: var(--faint); font-size: 10px; }
  .name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
  .name.dir { color: var(--text); }
  .name.dirty { color: var(--modified-fg); }
  .name.m { color: var(--modified-fg); }
  .name.a { color: var(--added-fg); }
  .name.d { color: var(--deleted-fg); text-decoration: line-through; }
  .mark { font: 10px var(--font-mono); flex: none; }
  .mark.m { color: var(--warn); }
  .mark.a { color: var(--ok); }
  .mark.d { color: var(--err); }
</style>
