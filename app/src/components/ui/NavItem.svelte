<script lang="ts">
  // A row in a navigation list (the sidebar, the settings rail): icons in
  // `lead`, a label that truncates, quiet extras in `trail`. `active` marks
  // where you are; `indent` (px) nests it under a parent row; `dense` is the
  // smaller row for children and asides. Pass `expanded` when it shows or
  // hides the rows under it. `action` is a small button of its own laid over
  // the row's end (a button can't sit inside the row's button).
  import type { Snippet } from "svelte";

  let {
    label,
    active = false,
    indent,
    dense = false,
    muted = false,
    expanded,
    title,
    onclick,
    oncontextmenu,
    lead,
    trail,
    action,
  }: {
    label: string;
    active?: boolean;
    indent?: number;
    dense?: boolean;
    muted?: boolean;
    expanded?: boolean;
    title?: string;
    onclick: () => void;
    oncontextmenu?: (e: MouseEvent) => void;
    lead?: Snippet;
    trail?: Snippet;
    action?: Snippet;
  } = $props();
</script>

{#snippet row()}
  <button class="plain nav-item focus-inset" class:active class:dense class:muted {title} aria-current={active ? "page" : undefined} aria-expanded={expanded}
    style:padding-left={indent ? `${indent}px` : undefined} {onclick} {oncontextmenu}>
    {#if lead}{@render lead()}{/if}
    <span class="label">{label}</span>
    {#if trail}{@render trail()}{/if}
  </button>
{/snippet}

{#if action}
  <div class="with-action">{@render row()}<span class="action">{@render action()}</span></div>
{:else}
  {@render row()}
{/if}

<style>
  .nav-item {
    display: flex; align-items: center; gap: 8px; width: 100%; min-width: 0;
    height: var(--row-h); padding: 0 8px; border-radius: var(--radius); color: var(--text-2);
  }
  .muted { color: var(--muted); }
  .dense { height: var(--row-h-sm); font-size: var(--fs-sm); }
  .nav-item:is(:hover, :focus-visible) { background: var(--row-hover); color: var(--text); }
  .active { background: var(--row-active); color: var(--text); }
  .with-action { position: relative; }
  /* Room for the action over the row's end. */
  .with-action > .nav-item { padding-right: calc(var(--control-h-xs) + 8px); }
  .action { position: absolute; top: 0; right: 3px; bottom: 0; display: flex; align-items: center; }
  .label { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
