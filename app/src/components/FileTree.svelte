<script lang="ts">
  // The side panel's Files tab: the session's folder as a tree, opened a
  // folder at a time. Changed files carry their mark; a file opens its diff
  // if it changed, else the file.
  import TreeNode from "./TreeNode.svelte";
  import EmptyState from "./ui/EmptyState.svelte";
  import { workspace } from "../lib/workspace.svelte";
  import type { SessionView } from "../bindings";

  let { session }: { session: SessionView } = $props();
  const w = $derived(workspace(session.id));
  const changed = $derived(Object.fromEntries(w.changes.map((c) => [c.path, c.status])));

  // The tree is one Tab stop: the row you were last on while it's still
  // shown, else the first row. Kept as state, so a row unmounting (a folder
  // collapsed, a file deleted) or a new first row can't leave the tree with
  // no stop, or two.
  const visible = $derived.by(() => {
    const out: string[] = [];
    const walk = (dir: string) => {
      for (const e of w.tree[dir] ?? []) {
        out.push(e.path);
        if (e.is_dir && w.expanded[e.path]) walk(e.path);
      }
    };
    walk("");
    return out;
  });
  let lastRow: string | null = $state(null);
  const stop = $derived(lastRow && visible.includes(lastRow) ? lastRow : visible[0]);

  // Up and Down walk the visible rows (stopping at the ends, as trees do).
  function onkeydown(e: KeyboardEvent) {
    const tree = e.currentTarget as HTMLElement;
    const rows = Array.from(tree.querySelectorAll<HTMLElement>("[role=treeitem]"));
    const at = rows.indexOf(document.activeElement as HTMLElement);
    if (at < 0) return;
    let next = -1;
    if (e.key === "ArrowDown") next = Math.min(at + 1, rows.length - 1);
    else if (e.key === "ArrowUp") next = Math.max(at - 1, 0);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = rows.length - 1;
    else return;
    e.preventDefault();
    rows[next].focus();
  }
</script>

{#if (w.tree[""] ?? []).length}
  <div class="tree" data-testid="file-tree" role="tree" aria-label="Files" tabindex="-1" {onkeydown}>
    {#each w.tree[""] ?? [] as e (e.path)}
      <TreeNode session={session.id} entry={e} depth={0} {changed} {stop} onstop={(path) => (lastRow = path)} />
    {/each}
  </div>
{:else if !w.tree[""]}
  <EmptyState loading />
{:else}
  <EmptyState icon="folder" title="Empty folder" />
{/if}

<style>
  .tree { flex: 1; overflow: auto; padding: 4px 0; }
  .tree:focus-visible { outline: none; }
</style>
