<script lang="ts">
  import { ICONS } from "../lib/icons";
  let { name, size = 16 }: { name: string; size?: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" style="flex:none">
  <path d={ICONS[name]} fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
</svg>
