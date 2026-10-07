<script lang="ts">
  // A centred dialog over a scrim. Esc and a click outside close it.
  // Focus moves in on open (the first [autofocus], else the first tabbable),
  // Tab cycles inside, the rest of the app is inert, and focus goes back to
  // whatever had it when the dialog closes.
  import { onDestroy, onMount } from "svelte";
  import type { Snippet } from "svelte";
  import { pushModal, mountModal, popModal, isTopModal, trapTab, focusFirst } from "../../lib/focus";

  let {
    onclose,
    width = "620px",
    height = "auto",
    top = false,
    label,
    children,
  }: { onclose: () => void; width?: string; height?: string; top?: boolean; label: string; children: Snippet } = $props();

  const me = pushModal();
  // Taken before the children mount, so an [autofocus] inside can't hide it.
  const returnTo = document.activeElement as HTMLElement | null;
  let scrim: HTMLDivElement | undefined = $state();
  let panel: HTMLDivElement | undefined = $state();

  onMount(() => {
    if (!scrim || !panel) return;
    mountModal(me, scrim);
    focusFirst(panel);
  });

  onDestroy(() => {
    popModal(me);
    // After the current update: a dialog stacked on this one may be closing in
    // the same tick, and the page is only live again once it has.
    queueMicrotask(() => {
      if (returnTo?.isConnected && !returnTo.closest("[inert]")) returnTo.focus({ preventScroll: true });
    });
  });

  function onkeydown(e: KeyboardEvent) {
    if (e.key === "Escape" && !e.defaultPrevented && isTopModal(me)) {
      e.preventDefault();
      onclose();
    }
  }
</script>

<svelte:window {onkeydown} />

<div class="scrim" class:top role="presentation" bind:this={scrim} onclick={onclose}>
  <div class="panel" role="dialog" aria-modal="true" aria-label={label} tabindex="-1" style:width style:height
    bind:this={panel} onclick={(e) => e.stopPropagation()} onkeydown={(e) => panel && trapTab(e, panel)}>
    {@render children()}
  </div>
</div>

<style>
  .scrim { position: fixed; inset: 0; z-index: 60; display: grid; grid-template-columns: minmax(0, 1fr); grid-template-rows: minmax(0, 1fr); place-items: center; padding: 24px; background: var(--scrim); }
  .scrim.top { place-items: start center; padding-top: 10vh; }
  .panel {
    min-width: 0; max-width: 100%; max-height: 100%; overflow: hidden; display: flex; flex-direction: column;
    background: var(--bg); border: 1px solid var(--border-strong); border-radius: var(--radius-lg); box-shadow: var(--shadow-modal);
  }
  /* The panel only takes focus when it has nothing tabbable: no ring for that. */
  .panel:focus-visible { outline: none; }
</style>
