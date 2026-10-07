<script lang="ts">
  // A bordered group of SettingsRows, with an optional title above it.
  // `dense` tightens rows that each hold one small control (shortcuts).
  // `data-*` attributes go on the group's box.
  import type { Snippet } from "svelte";
  import type { DataAttrs } from "../../lib/attrs";

  let {
    title,
    dense = false,
    children,
    ...rest
  }: { title?: string | Snippet; dense?: boolean; children: Snippet } & DataAttrs = $props();
</script>

{#if title}
  <div class="title t-group" data-testid="settings-group-title">{#if typeof title === "string"}{title}{:else}{@render title()}{/if}</div>
{/if}
<div {...rest} class="group" class:dense>{@render children()}</div>

<style>
  .title { display: flex; align-items: center; gap: 8px; margin: 20px 0 8px; }
  .group { border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--surface); margin-bottom: 16px; }
  .group > :global(.set-row + .set-row) { border-top: 1px solid var(--border); }
  /* Rows paint their own hover: keep it inside the group's corners. */
  .group > :global(.set-row:first-child) { border-top-left-radius: calc(var(--radius-lg) - 1px); border-top-right-radius: calc(var(--radius-lg) - 1px); }
  .group > :global(.set-row:last-child) { border-bottom-left-radius: calc(var(--radius-lg) - 1px); border-bottom-right-radius: calc(var(--radius-lg) - 1px); }
  .dense > :global(.set-row) { padding-block: 7px; }
</style>
