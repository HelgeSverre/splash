<script lang="ts">
  import type { PlanItem } from "../../bindings";
  let { items }: { items: PlanItem[] } = $props();
  const done = $derived(items.filter((i) => i.status === "completed").length);
</script>

<div class="plan">
  <div class="head">Plan <span class="count">{done}/{items.length}</span></div>
  {#each items as item, i (i)}
    <div class="item {item.status}">
      <span class="box">{item.status === "completed" ? "✓" : item.status === "in_progress" ? "◐" : "○"}</span>
      <span class="text">{item.content}</span>
    </div>
  {/each}
</div>

<style>
  .plan { margin: 8px 0; padding: 10px 12px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); }
  .head { font-weight: 600; margin-bottom: 6px; }
  .count { color: var(--muted); font: 11px var(--font-mono); margin-left: 6px; }
  .item { display: flex; gap: 8px; padding: 1px 0; color: var(--text-2); }
  .box { font-family: var(--font-mono); width: 14px; flex: none; color: var(--muted); }
  .item.completed .text { color: var(--muted); text-decoration: line-through; text-decoration-color: var(--faint); }
  .item.completed .box { color: var(--ok); }
  .item.in_progress { color: var(--text); }
  .item.in_progress .box { color: var(--accent); }
</style>
