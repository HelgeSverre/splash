<script lang="ts">
  // The top of a settings page: an icon (an agent's, or your own), the title,
  // tags after it, actions on the right, and a one-line lede under it.
  import type { Snippet } from "svelte";
  import AgentIcon from "../AgentIcon.svelte";

  let {
    title,
    agent,
    icon,
    tags,
    actions,
    lede,
  }: { title: string; agent?: string; icon?: Snippet; tags?: Snippet; actions?: Snippet; lede?: Snippet } = $props();
</script>

<div class="page-head">
  {#if icon}{@render icon()}{:else if agent}<AgentIcon id={agent} size={20} />{/if}
  <h2 class="t-page-title">{title}</h2>
  {#if tags}{@render tags()}{/if}
  <span class="spacer"></span>
  {#if actions}{@render actions()}{/if}
</div>
{#if lede}<p class="lede">{@render lede()}</p>{/if}

<style>
  .page-head { display: flex; align-items: center; gap: 10px; min-height: var(--control-h); margin-bottom: 4px; min-width: 0; }
  h2 { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .lede { margin: 0 0 16px; font-size: var(--fs-base); color: var(--muted); max-width: 60ch; }
  .lede :global(code) { font: var(--fs-sm) var(--font-mono); }
</style>
