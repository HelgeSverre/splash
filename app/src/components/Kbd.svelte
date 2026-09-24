<script lang="ts">
  // A shortcut as keycaps: keys="⌘ N" → [⌘][N].
  let { keys }: { keys: string } = $props();
  const caps = $derived(keys.split(" ").filter(Boolean));
</script>

<span class="kbds">{#each caps as k, i (i)}<span class="kbd">{k}</span>{/each}</span>
