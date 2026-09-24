<script lang="ts">
  // Show a file or folder in Finder.
  import { shell } from "@elyra/runtime";
  import Icon from "../Icon.svelte";
  import IconButton from "./IconButton.svelte";
  let { path, size = 26 }: { path: string | null | undefined; size?: number } = $props();
</script>

<IconButton title="Reveal in Finder" {size} disabled={!path} onclick={(e) => { e.stopPropagation(); if (path) shell.openExternal(path).catch(() => {}); }}>
  <Icon name="folder" size={14} />
</IconButton>
