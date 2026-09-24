<script lang="ts">
  import { api } from "../../bindings";
  import { showError } from "../../lib/state.svelte";
  import { relText } from "../../lib/paths";
  import type { Entry } from "../../bindings";

  type Perm = Extract<Entry, { kind: "permission" }>;
  let { entry, session, cwd }: { entry: Perm; session: string; cwd: string } = $props();

  const chosen = $derived(entry.options.find((o) => o.id === entry.resolution));

  export function choose(optionId: string | null) {
    api.resolve_permission(session, entry.request_id, optionId).catch(showError);
  }
</script>

<div class="perm" class:pending={!entry.resolution}>
  <div class="head">
    <span class="q">{entry.resolution ? "Permission" : "Allow this?"}</span>
    <span class="title">{relText(entry.title, cwd)}</span>
  </div>
  {#if entry.resolution}
    <div class="answer" class:rejected={chosen?.kind.startsWith("reject") || entry.resolution === "cancelled"}>
      → {chosen?.name ?? entry.resolution}
    </div>
  {:else}
    <div class="options">
      {#each entry.options as o, i (o.id)}
        <button class="btn sm {o.kind.startsWith('allow') ? (i === 0 ? 'primary' : '') : 'danger'}" onclick={() => choose(o.id)}>
          <span class="n">{i + 1}</span> {o.name}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .perm { margin: 8px 0; padding: 10px 12px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); }
  .perm.pending { border-color: var(--accent-border); background: linear-gradient(0deg, var(--accent-soft), var(--accent-soft)), var(--surface); }
  .head { display: flex; gap: 10px; align-items: baseline; min-width: 0; }
  .q { font-weight: 600; flex: none; }
  .pending .q { color: var(--accent); }
  .title { font: 12px var(--font-mono); color: var(--text-2); overflow-wrap: anywhere; }
  .options { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px; }
  .n { font: 10px var(--font-mono); opacity: 0.7; }
  .answer { margin-top: 4px; font: 12px var(--font-mono); color: var(--ok); }
  .answer.rejected { color: var(--err); }
</style>
