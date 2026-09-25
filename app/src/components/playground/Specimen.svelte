<script lang="ts">
  // One labelled exhibit on the playground: a name, the file it lives in,
  // and the live component(s) in a bordered stage.
  import type { Snippet } from "svelte";

  let {
    name,
    source,
    note,
    plain = false,
    children,
  }: { name: string; source?: string; note?: string; plain?: boolean; children: Snippet } = $props();
</script>

<figure class="specimen">
  <figcaption>
    <span class="name">{name}</span>
    {#if source}<span class="source t-mono-meta">{source}</span>{/if}
    {#if note}<span class="note t-meta">{note}</span>{/if}
  </figcaption>
  <div class="stage" class:plain>{@render children()}</div>
</figure>

<style>
  .specimen { margin: 0 0 20px; min-width: 0; }
  figcaption { display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px 10px; margin-bottom: 8px; }
  .name { font-size: var(--fs-base); font-weight: var(--fw-medium); color: var(--text); }
  .note { flex-basis: 100%; }
  .stage {
    display: flex; flex-wrap: wrap; align-items: center; gap: 12px; min-width: 0;
    padding: 16px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg);
  }
  .stage.plain { display: block; padding: 0; background: none; border: 0; }
</style>
