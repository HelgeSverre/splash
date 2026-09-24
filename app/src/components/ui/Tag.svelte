<script lang="ts">
  import type { Snippet } from "svelte";
  let { tone = "default", title, children }: { tone?: "default" | "ok" | "warn" | "err" | "accent" | "purple"; title?: string; children: Snippet } = $props();
</script>

<span class="tag {tone}" {title}>{@render children()}</span>

<style>
  .tag {
    display: inline-flex; align-items: center; height: 17px; padding: 0 7px; flex: none; white-space: nowrap;
    font: 10.5px var(--font-mono); color: var(--text-2); border: 1px solid var(--border-strong); border-radius: 999px;
  }
  .ok { color: var(--ok-dim); border-color: var(--ok-border); }
  .warn { color: var(--warn-dim); border-color: var(--warn-border); }
  .err { color: var(--err-dim); border-color: var(--err-border); }
  .accent { color: var(--accent); border-color: var(--accent-border); }
  .purple { color: var(--purple); border-color: var(--purple-border); }
</style>
