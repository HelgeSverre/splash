<script lang="ts">
  import Icon from "../Icon.svelte";
  let {
    value = $bindable(""),
    placeholder = "Filter",
    shown,
    total,
  }: { value?: string; placeholder?: string; shown?: number; total?: number } = $props();
</script>

<label class="filter">
  <Icon name="search" size={13} />
  <input bind:value {placeholder} onkeydown={(e) => { if (e.key === "Escape" && value) { e.preventDefault(); e.stopPropagation(); value = ""; } }} />
  {#if total !== undefined}<span class="count">{shown ?? total} of {total}</span>{/if}
</label>

<style>
  .filter {
    display: flex; align-items: center; gap: 8px; height: 30px; padding: 0 10px; min-width: 220px; flex: 1;
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); color: var(--muted);
  }
  .filter:focus-within { border-color: var(--border-strong); }
  input { all: unset; flex: 1; min-width: 0; font-size: 12.5px; color: var(--text); user-select: text; }
  input::placeholder { color: var(--muted); }
  .count { font: 11px var(--font-mono); color: var(--faint); flex: none; }
</style>
