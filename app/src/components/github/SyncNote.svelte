<script lang="ts">
  // An "info" button beside a footer's sync status. It opens a note above
  // itself: how much is loaded and what GitHub limits, text that is useful
  // once and should not sit in the footer for good. `data-*` go to the button.
  import type { Snippet } from "svelte";
  import type { DataAttrs } from "../../lib/attrs";
  import Icon from "../Icon.svelte";

  let { label, children, ...rest }: { label: string; children: Snippet } & DataAttrs = $props();

  let open = $state(false);
  let root: HTMLSpanElement | undefined = $state();
  const uid = $props.id();
  const noteId = `sync-note-${uid}`;

  // On the window: a click does not focus a button in every webview, so the
  // key may arrive with focus elsewhere.
  function onkeydown(e: KeyboardEvent) {
    if (!open || e.key !== "Escape") return;
    e.preventDefault();
    open = false;
  }
  function onpointerdown(e: PointerEvent) {
    if (open && root && !root.contains(e.target as Node)) open = false;
  }
  function onfocusout(e: FocusEvent) {
    if (open && root && e.relatedTarget && !root.contains(e.relatedTarget as Node)) open = false;
  }
</script>

<svelte:window {onkeydown} {onpointerdown} />

<span class="sync-note" bind:this={root} {onfocusout}>
  <button {...rest} type="button" class="plain trigger" class:open title={label} aria-label={label} aria-expanded={open} aria-controls={open ? noteId : undefined} onclick={() => (open = !open)}>
    <Icon name="info" size={13} />
  </button>
  {#if open}<div class="note popover" id={noteId} role="note">{@render children()}</div>{/if}
</span>

<style>
  .sync-note { position: relative; display: inline-flex; flex: none; }
  .trigger { display: inline-grid; place-items: center; width: var(--control-h-xs); height: var(--control-h-xs); border-radius: var(--radius-sm); color: var(--muted); }
  .trigger:is(:hover, :focus-visible), .trigger.open { color: var(--text); background: var(--hover); }
  .note {
    position: absolute; bottom: calc(100% + 6px); left: 0; z-index: 30; width: max-content; max-width: min(360px, 70vw);
    padding: 8px 10px; font-size: var(--fs-xs); line-height: 1.5; color: var(--text-2); white-space: normal; overflow-wrap: anywhere;
  }
</style>
