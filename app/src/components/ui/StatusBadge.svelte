<script lang="ts">
  // A small dot and a muted label: status without shouting.
  let { tone, label, title }: { tone: "ok" | "warn" | "err" | "none"; label: string; title?: string } = $props();
</script>

<span class="badge" {title}><span class="dot-s {tone}"></span>{label}</span>

<style>
  .badge { display: inline-flex; align-items: center; gap: 7px; font-size: 12px; color: var(--text-2); white-space: nowrap; flex: none; }
  .dot-s { width: 6px; height: 6px; border-radius: 50%; background: var(--faint); flex: none; }
  .ok { background: var(--ok-dim); }
  .warn { background: var(--warn-dim); }
  .err { background: var(--err-dim); }
</style>
