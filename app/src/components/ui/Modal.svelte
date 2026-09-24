<script lang="ts" module>
  // Open modals, innermost last: only the top one answers Esc.
  const stack: symbol[] = [];
</script>

<script lang="ts">
  // A centred dialog over a scrim. Esc and a click outside close it.
  import { onDestroy } from "svelte";
  import type { Snippet } from "svelte";

  let {
    onclose,
    width = "620px",
    height = "auto",
    top = false,
    label,
    children,
  }: { onclose: () => void; width?: string; height?: string; top?: boolean; label: string; children: Snippet } = $props();

  const me = Symbol("modal");
  stack.push(me);
  onDestroy(() => stack.splice(stack.indexOf(me), 1));

  function onkeydown(e: KeyboardEvent) {
    if (e.key === "Escape" && !e.defaultPrevented && stack[stack.length - 1] === me) {
      e.preventDefault();
      onclose();
    }
  }
</script>

<svelte:window {onkeydown} />

<div class="scrim" class:top role="presentation" onclick={onclose}>
  <div class="panel" role="dialog" aria-label={label} tabindex="-1" style:width style:height
    onclick={(e) => e.stopPropagation()} onkeydown={() => {}}>
    {@render children()}
  </div>
</div>

<style>
  .scrim { position: fixed; inset: 0; z-index: 60; display: grid; place-items: center; padding: 24px; background: var(--scrim); }
  .scrim.top { place-items: start center; padding-top: 10vh; }
  .panel {
    max-width: 100%; max-height: 100%; overflow: hidden; display: flex; flex-direction: column;
    background: var(--bg); border: 1px solid var(--border-strong); border-radius: 12px; box-shadow: var(--shadow-modal);
  }
</style>
