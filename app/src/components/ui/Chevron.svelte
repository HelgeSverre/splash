<script lang="ts">
  // The one disclosure glyph: points right, turns down when `open`. `down`
  // is for a menu trigger; `size` 12 for a "go to" arrow at the end of a row.
  import Icon from "../Icon.svelte";
  let { open = false, down = false, size = 10 }: { open?: boolean; down?: boolean; size?: number } = $props();
</script>

<span class="chev" class:open={open || down} aria-hidden="true"><Icon name="chevron" {size} /></span>

<style>
  .chev { display: inline-grid; place-items: center; flex: none; color: var(--faint); transition: transform 0.12s; }
  .open { transform: rotate(90deg); }
</style>
