<script lang="ts">
  // Show a file or folder in Finder.
  import { openExternal } from "../../lib/system";
  import IconButton, { type IconButtonSize } from "./IconButton.svelte";
  let { path, size = "md" }: { path: string | null | undefined; size?: IconButtonSize } = $props();
</script>

<IconButton title="Open in file manager" icon="folder" {size} disabled={!path} onclick={(e) => { e.stopPropagation(); if (path) openExternal(path); }} />
