<script lang="ts">
  // A button that shows or hides what's under it: a thought or an agent
  // notice in the transcript, a line in the RPC log. `head` fills the button
  // (it lays out as a row), `children` shows while `open`. The owner keeps
  // `open` and lays out the head through `class`.
  import type { Snippet } from "svelte";

  let {
    open,
    ontoggle,
    title,
    class: cls = "",
    head,
    children,
  }: { open: boolean; ontoggle: () => void; title?: string; class?: string; head: Snippet; children: Snippet } = $props();
</script>

<button class="plain disclosure focus-inset {cls}" aria-expanded={open} {title} onclick={ontoggle}>{@render head()}</button>
{#if open}{@render children()}{/if}

<style>
  .disclosure { display: flex; width: 100%; min-width: 0; }
</style>
