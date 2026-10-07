<script lang="ts">
  // The side panel's Changes tab: what the session changed against its base,
  // one row per file; a row opens its diff.
  import EmptyState from "./ui/EmptyState.svelte";
  import Toolbar from "./ui/Toolbar.svelte";
  import ChangeMark, { changeName } from "./ui/ChangeMark.svelte";
  import DiffStat from "./ui/DiffStat.svelte";
  import PathLabel from "./ui/PathLabel.svelte";
  import { plural } from "../lib/format";
  import { workspace } from "../lib/workspace.svelte";
  import { openTab } from "../lib/tabs.svelte";
  import type { SessionView } from "../bindings";

  let { session }: { session: SessionView } = $props();
  const w = $derived(workspace(session.id));

  const totals = $derived({
    add: w.changes.reduce((n, c) => n + c.additions, 0),
    del: w.changes.reduce((n, c) => n + c.deletions, 0),
  });
</script>

<Toolbar side>
  {#if w.changes.length}
    <span class="files" data-testid="changes-count" data-count={w.changes.length}>{plural(w.changes.length, "file")}</span>
    <DiffStat add={totals.add} del={totals.del} />
  {/if}
  {#snippet end()}
    <span class="t-mono-meta" data-testid="changes-base" title={session.base_sha ?? ""}>vs {session.isolation === "worktree" ? (session.base_sha?.slice(0, 7) ?? "base") : "HEAD"}</span>
  {/snippet}
</Toolbar>
{#if w.changes.length}
  <div class="list">
    {#each w.changes as c (c.path)}
      <button class="plain change focus-inset" data-testid="change" data-path={c.path} data-status={c.status} onclick={() => openTab({ kind: "diff", path: c.path })} title="{changeName(c.status)}: {c.path}">
        <PathLabel path={c.path} split />
        <span class="spacer"></span>
        <DiffStat add={c.additions} del={c.deletions} binary={c.binary} />
        <ChangeMark status={c.status} />
      </button>
    {/each}
  </div>
{:else}
  <EmptyState data-testid="changes-empty" data-loading={w.loading} loading={w.loading} icon="check" title={w.loading ? undefined : "No changes"} />
{/if}

<style>
  .files { color: var(--text-2); }
  .list { flex: 1; overflow: auto; padding: 4px 0; }
  .change { display: flex; gap: 8px; align-items: center; width: 100%; height: var(--row-h-sm); padding: 0 var(--gutter-side); font-size: var(--fs-sm); }
  .change:is(:hover, :focus-visible) { background: var(--row-hover); }
</style>
