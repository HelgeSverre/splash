<script lang="ts">
  // A dashed, full-width card that adds something to the list above it (a
  // project folder). Also the call to action when that list is empty.
  import Icon from "../Icon.svelte";
  let { label, onclick }: { label: string; onclick: () => void } = $props();
</script>

<button class="plain add focus-inset" {onclick}><Icon name="plus" size={12} />{label}</button>

<style>
  .add {
    display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%;
    padding: 8px 10px; color: var(--text-2); border: 1px dashed var(--border-strong); border-radius: var(--radius);
  }
  .add:is(:hover, :focus-visible) { color: var(--text); border-color: var(--muted); }
</style>
