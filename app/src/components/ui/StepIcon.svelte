<script lang="ts">
  // The state of one step (a tool call, a plan item), drawn the same
  // everywhere: done is a quiet check, failed a full-strength cross, under
  // way the accent (a spinner while it's `live`), to do a hollow circle.
  import Icon from "../Icon.svelte";
  let { status, live = false, size = 12 }: { status: string; live?: boolean; size?: number } = $props();
  const NAMES: Record<string, string> = { completed: "done", failed: "failed", in_progress: "in progress", pending: "to do" };
</script>

<span class="step {status}" role="img" aria-label={NAMES[status] ?? status}>
  {#if status === "completed"}<Icon name="check" {size} />
  {:else if status === "failed"}<Icon name="close" {size} />
  {:else if status === "in_progress" && live}<span class="spinner"></span>
  {:else if status === "in_progress"}<Icon name="circle-dot" {size} />
  {:else}<Icon name="circle" {size} />{/if}
</span>

<style>
  .step { display: inline-grid; place-items: center; flex: none; width: 14px; color: var(--muted); }
  .completed { color: var(--ok-dim); }
  .failed { color: var(--err); }
  .in_progress { color: var(--accent); }
  .spinner { width: 10px; height: 10px; border-width: 1.5px; }
</style>
