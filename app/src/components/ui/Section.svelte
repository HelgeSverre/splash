<script lang="ts">
  // A titled, collapsible block.
  import type { Snippet } from "svelte";
  let {
    title,
    count,
    open = $bindable(true),
    actions,
    children,
  }: { title: string; count?: number; open?: boolean; actions?: Snippet; children: Snippet } = $props();
</script>

<section>
  <div class="head">
    <button class="plain toggle" onclick={() => (open = !open)}>
      <span class="chev" class:open>›</span>{title}{#if count !== undefined}<span class="count">{count}</span>{/if}
    </button>
    {#if actions}<span class="actions">{@render actions()}</span>{/if}
  </div>
  {#if open}{@render children()}{/if}
</section>

<style>
  section { margin-bottom: 8px; }
  .head { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin: 16px 0 8px; }
  .toggle { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: var(--text-2); }
  .toggle:hover { color: var(--text); }
  .chev { width: 8px; color: var(--faint); transition: transform 0.12s; display: inline-block; }
  .chev.open { transform: rotate(90deg); }
  .count { color: var(--muted); font-weight: 400; margin-left: 2px; }
  .actions { display: flex; gap: 6px; align-items: center; }
</style>
