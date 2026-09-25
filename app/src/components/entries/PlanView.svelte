<script lang="ts">
  import StepIcon from "../ui/StepIcon.svelte";
  import type { PlanItem } from "../../bindings";
  let { items }: { items: PlanItem[] } = $props();
  const done = $derived(items.filter((i) => i.status === "completed").length);
</script>

<div class="plan card">
  <div class="head">Plan <span class="count t-count">{done}/{items.length}</span></div>
  {#each items as item, i (i)}
    <div class="item {item.status}">
      <span class="box"><StepIcon status={item.status} /></span>
      <span class="text">{item.content}</span>
    </div>
  {/each}
</div>

<style>
  .plan { margin: 8px 0; }
  .head { font-weight: var(--fw-semibold); margin-bottom: 6px; }
  .count { margin-left: 6px; font-weight: var(--fw-regular); }
  .item { display: flex; gap: 8px; padding: 1px 0; color: var(--text-2); }
  /* One line high, so the glyph sits on the first line of a long item. */
  .box { display: inline-flex; align-items: center; height: calc(1em * var(--lh-base)); flex: none; }
  .item.completed .text { color: var(--muted); text-decoration: line-through; text-decoration-color: var(--faint); }
  .item.in_progress { color: var(--text); }
</style>
