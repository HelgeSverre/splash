<script lang="ts">
  import Self from "./TreeNode.svelte";
  import Chevron from "./ui/Chevron.svelte";
  import ChangeMark from "./ui/ChangeMark.svelte";
  import { openTab } from "../lib/tabs.svelte";
  import { workspace, loadDir, setExpanded } from "../lib/workspace.svelte";
  import type { DirEntry } from "../bindings";

  let {
    session,
    entry,
    depth,
    changed,
    stop,
    onstop,
  }: {
    session: string;
    entry: DirEntry;
    depth: number;
    changed: Record<string, string>;
    /** The path of the tree's one Tab stop (FileTree keeps it). */
    stop: string | undefined;
    onstop: (path: string) => void;
  } = $props();
  const w = $derived(workspace(session));
  const open = $derived(!!w.expanded[entry.path]);
  const children = $derived(w.tree[entry.path]);
  const error = $derived(w.treeErrors[entry.path]);
  const mark = $derived(changed[entry.path]);
  const dirty = $derived(entry.is_dir && Object.keys(changed).some((p) => p.startsWith(entry.path + "/")));

  function toggle() {
    if (!entry.is_dir) {
      openTab(mark ? { kind: "diff", path: entry.path } : { kind: "file", path: entry.path });
      return;
    }
    setOpen(!open);
  }

  function setOpen(to: boolean) {
    setExpanded(session, entry.path, to);
    if (to && !children) loadDir(session, entry.path);
  }

  // Right opens a folder or steps into it, Left closes it or steps out to the
  // parent. Up/Down are handled by the tree (FileTree).
  function onkeydown(e: KeyboardEvent) {
    const row = e.currentTarget as HTMLElement;
    const rows = Array.from(row.closest("[role=tree]")?.querySelectorAll<HTMLElement>("[role=treeitem]") ?? []);
    const at = rows.indexOf(row);
    const go = (el: HTMLElement | undefined) => el?.focus();
    if (e.key === "ArrowRight" && entry.is_dir) {
      e.preventDefault();
      if (!open) setOpen(true);
      else if (children?.length) go(rows[at + 1]);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (entry.is_dir && open) setOpen(false);
      else if (depth > 0) go(rows.slice(0, at).findLast((r) => r.getAttribute("aria-level") === String(depth)));
    }
  }

  // The last row you were on stays the tree's one Tab stop.
  const onfocus = () => onstop(entry.path);
</script>

<button class="plain node focus-inset" data-testid="tree-node" data-path={entry.path} data-dir={entry.is_dir || undefined} style:padding-left="calc(var(--gutter-side) + {depth * 12}px)" onclick={toggle} {onkeydown} {onfocus} title={entry.path}
  role="treeitem" aria-level={depth + 1} aria-expanded={entry.is_dir ? open : undefined} aria-selected="false" tabindex={entry.path === stop ? 0 : -1}>
  <span class="twist">{#if entry.is_dir}<Chevron {open} />{/if}</span>
  <span class="name" class:dir={entry.is_dir} class:dirty class:d={mark === "D"}>{entry.name}</span>
  {#if mark}<ChangeMark status={mark} />{/if}
</button>
{#if open && error}
  <p class="load-error" role="status" style:padding-left="calc(var(--gutter-side) + {(depth + 1) * 12}px)">Couldn't read folder: {error}</p>
{:else if open && children}
  {#each children as child (child.path)}
    <Self {session} entry={child} depth={depth + 1} {changed} {stop} {onstop} />
  {/each}
{/if}

<style>
  .node { display: flex; align-items: center; gap: 4px; width: 100%; height: var(--row-h-sm); padding-right: var(--gutter-side); font-size: var(--fs-sm); color: var(--text-2); }
  .node:is(:hover, :focus-visible) { background: var(--row-hover); color: var(--text); }
  .twist { width: 10px; flex: none; display: inline-grid; place-items: center; }
  .name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
  .name.dir { color: var(--text); }
  /* A file's change shows in its mark; a folder has none, so its name carries it. */
  .name.dirty { color: var(--modified-fg); }
  .name.d { color: var(--muted); text-decoration: line-through; }
  .load-error { margin: 2px var(--gutter-side) 4px; color: var(--del-fg); font-size: var(--fs-xs); overflow-wrap: anywhere; }
</style>
