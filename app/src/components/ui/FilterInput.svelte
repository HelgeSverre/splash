<script lang="ts">
  import type { DataAttrs } from "../../lib/attrs";
  // The one search field. Esc clears it; `shown`/`total` add an "N of M" count.
  // Bind `ref` to focus it from a shortcut.
  import Icon from "../Icon.svelte";
  let {
    value = $bindable(""),
    ref = $bindable(),
    placeholder = "Filter",
    label,
    onenter,
    shown,
    total,
    unit = "",
    ...rest
  }: {
    value?: string;
    ref?: HTMLInputElement;
    placeholder?: string;
    /** The accessible name, when the placeholder isn't enough. */
    label?: string;
    onenter?: () => void;
    shown?: number;
    total?: number;
    /** A noun after the count: "12 of 40 lines". */
    unit?: string;
  } & DataAttrs = $props();
</script>

<label class="filter field-box">
  <Icon name="search" size={13} />
  <input {...rest} class="bare-input" bind:this={ref} bind:value {placeholder} aria-label={label ?? placeholder}
    onkeydown={(e) => { if (e.key === "Enter" && onenter) { e.preventDefault(); onenter(); } if (e.key === "Escape" && value) { e.preventDefault(); e.stopPropagation(); value = ""; } }} />
  {#if total !== undefined}<span class="count t-count" data-testid="filter-count" data-shown={shown ?? total} data-total={total}>{shown ?? total} of {total}{unit ? ` ${unit}` : ""}</span>{/if}
</label>

<style>
  .filter {
    display: flex; align-items: center; gap: 8px; height: var(--control-h); padding: 0 10px; min-width: 200px; flex: 1;
    background: var(--surface); color: var(--muted);
  }
  input { font-size: var(--fs-base); }
  .count { flex: none; }
</style>
