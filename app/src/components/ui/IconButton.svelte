<script lang="ts">
  // A square, chrome-less icon button with a tooltip.
  import type { Snippet } from "svelte";

  let {
    title,
    onclick,
    active = false,
    disabled = false,
    size = 28,
    children,
  }: { title: string; onclick?: (e: MouseEvent) => void; active?: boolean; disabled?: boolean; size?: number; children: Snippet } = $props();
</script>

<button class="plain icon-btn" class:active {title} aria-label={title} {disabled} {onclick} style:width="{size}px" style:height="{size}px">
  {@render children()}
</button>

<style>
  .icon-btn { display: inline-grid; place-items: center; flex: none; border-radius: var(--radius); color: var(--muted); }
  .icon-btn:hover:not(:disabled) { background: var(--hover); color: var(--text); }
  .icon-btn.active { color: var(--text-2); }
  .icon-btn:disabled { opacity: 0.5; }
</style>
