<script lang="ts">
  import Kbd from "../Kbd.svelte";
  import { api } from "../../bindings";
  import { showError } from "../../lib/system";
  import { relText } from "../../lib/paths";
  import type { Entry } from "../../bindings";

  type Perm = Extract<Entry, { kind: "permission" }>;
  let { entry, session, cwd }: { entry: Perm; session: string; cwd: string } = $props();

  const chosen = $derived(entry.options.find((o) => o.id === entry.resolution));

  function choose(optionId: string | null) {
    api.resolve_permission(session, entry.request_id, optionId).catch(showError);
  }
</script>

<div class="perm card" class:pending={!entry.resolution}>
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
          <Kbd keys={String(i + 1)} inline /> {o.name}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .perm { margin: 8px 0; }
  .perm.pending { border-color: var(--accent-border); background: linear-gradient(0deg, var(--accent-soft), var(--accent-soft)), var(--surface); }
  .head { display: flex; gap: 10px; align-items: baseline; min-width: 0; }
  .q { font-weight: var(--fw-semibold); flex: none; }
  .pending .q { color: var(--accent); }
  .title { font: var(--fs-sm) var(--font-mono); color: var(--text-2); overflow-wrap: anywhere; }
  .options { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px; }
  /* A status word, not code. */
  .answer { margin-top: 4px; font-size: var(--fs-sm); color: var(--ok-dim); }
  .answer.rejected { color: var(--err-dim); }
</style>
