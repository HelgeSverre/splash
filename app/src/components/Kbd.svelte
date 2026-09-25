<script lang="ts">
  // A shortcut as keycaps: keys="⌘ N" → [⌘][N]. `inline` is the keycap
  // inside a button: smaller, and it takes the button's colour.
  let { keys, inline = false }: { keys: string; inline?: boolean } = $props();
  const caps = $derived(keys.split(" ").filter(Boolean));
</script>

<span class="kbds">{#each caps as k, i (i)}<span class="kbd" class:inline>{k}</span>{/each}</span>

<style>
  .inline { height: 16px; min-width: 16px; padding: 0 4px; color: inherit; background: transparent; border-color: var(--border-strong); }
  :global(.btn.primary) .inline { border-color: var(--on-accent-border); }
</style>
