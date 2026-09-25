<script lang="ts">
  // Lines added and removed (+12 −3), or "bin" for a binary file. Zeros are
  // left out. The one place status colours run at full strength.
  let { add = 0, del = 0, binary = false }: { add?: number; del?: number; binary?: boolean } = $props();
</script>

<span class="stat">
  {#if binary}<span class="bin">bin</span>{:else}
    {#if add}<span class="add">+{add}</span>{/if}
    {#if del}<span class="del">−{del}</span>{/if}
  {/if}
</span>

<style>
  .stat { display: inline-flex; gap: 6px; flex: none; font: var(--fs-xs) var(--font-mono); font-variant-numeric: tabular-nums; }
  .stat:empty { display: none; }
  .add { color: var(--ok); }
  .del { color: var(--err); }
  .bin { color: var(--muted); }
</style>
