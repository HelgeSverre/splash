<script lang="ts">
  import type { DataAttrs } from "../../lib/attrs";
  // A small labelled checkbox: a 14px box that fills with the soft accent,
  // like every other "on" state.
  import Icon from "../Icon.svelte";
  let { checked = $bindable(false), label, ...rest }: { checked?: boolean; label: string } & DataAttrs = $props();
</script>

<button {...rest} class="plain check" role="checkbox" aria-checked={checked} onclick={() => (checked = !checked)}>
  <span class="box" class:on={checked}>{#if checked}<Icon name="check" size={10} />{/if}</span>{label}
</button>

<style>
  .check { display: inline-flex; align-items: center; gap: 6px; flex: none; font-size: var(--fs-sm); color: var(--text-2); border-radius: var(--radius-sm); white-space: nowrap; }
  .check:is(:hover, :focus-visible) { color: var(--text); }
  .box {
    display: inline-grid; place-items: center; width: 14px; height: 14px; flex: none;
    border: 1px solid var(--border-strong); border-radius: var(--radius-sm); background: var(--surface); color: var(--accent);
  }
  .check:is(:hover, :focus-visible) .box { border-color: var(--border-focus); }
  .box.on, .check:is(:hover, :focus-visible) .box.on { background: var(--accent-soft); border-color: var(--accent-border); }
</style>
