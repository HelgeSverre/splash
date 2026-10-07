<script lang="ts">
  import type { DataAttrs } from "../../lib/attrs";
  // A small dot and a muted label: status without shouting.
  let { tone, label, ...rest }: { tone: "ok" | "warn" | "err" | "none"; label: string } & DataAttrs = $props();
</script>

<span {...rest} class="badge"><span class="dot {tone}"></span>{label}</span>

<style>
  .badge { display: inline-flex; align-items: center; gap: 7px; font-size: var(--fs-sm); color: var(--text-2); white-space: nowrap; flex: none; }
</style>
