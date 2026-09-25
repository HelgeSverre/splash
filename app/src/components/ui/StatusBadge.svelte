<script lang="ts">
  // A small dot and a muted label: status without shouting.
  let { tone, label }: { tone: "ok" | "warn" | "err" | "none"; label: string } = $props();
</script>

<span class="badge"><span class="dot {tone}"></span>{label}</span>

<style>
  .badge { display: inline-flex; align-items: center; gap: 7px; font-size: var(--fs-sm); color: var(--text-2); white-space: nowrap; flex: none; }
</style>
