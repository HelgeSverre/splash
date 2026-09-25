<script lang="ts">
  // A small mono label. `count` is the filled variant for tab and list counts;
  // `off` strikes a capability or option that isn't there.
  import type { Snippet } from "svelte";
  let {
    tone = "default",
    off = false,
    title,
    children,
  }: { tone?: "default" | "muted" | "ok" | "warn" | "err" | "accent" | "purple" | "count"; off?: boolean; title?: string; children: Snippet } = $props();
</script>

<span class="tag {tone}" class:off {title}>{@render children()}</span>

<style>
  .tag {
    display: inline-flex; align-items: center; height: 17px; padding: 0 7px; flex: none; white-space: nowrap;
    font: var(--fw-regular) var(--fs-2xs)/1 var(--font-mono); color: var(--text-2); border: 1px solid var(--border-strong); border-radius: var(--radius-pill);
  }
  .muted { color: var(--muted); border-color: var(--border); }
  .ok { color: var(--ok-dim); border-color: var(--ok-border); }
  .warn { color: var(--warn-dim); border-color: var(--warn-border); }
  .err { color: var(--err-dim); border-color: var(--err-border); }
  .accent { color: var(--accent); border-color: var(--accent-border); }
  .purple { color: var(--purple); border-color: var(--purple-border); }
  .count { height: 16px; padding: 0 6px; background: var(--raised); border-color: transparent; font-variant-numeric: tabular-nums; }
  .off { color: var(--muted); border-color: var(--border); text-decoration: line-through; text-decoration-color: var(--faint); }
</style>
