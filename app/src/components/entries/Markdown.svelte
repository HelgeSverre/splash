<script lang="ts">
  import { openExternal } from "../../lib/system";
  import { renderMarkdown, renderStreamingBlocks } from "../../lib/markdown";

  // While a reply is still arriving, render it block by block (finished
  // blocks are cached; only the growing last one re-renders, healed).
  let { text, streaming = false }: { text: string; streaming?: boolean } = $props();
  const blocks = $derived(streaming ? renderStreamingBlocks(text) : [renderMarkdown(text)]);
  const html = $derived(blocks.join(""));
  let root: HTMLDivElement | undefined = $state();

  // Code blocks scroll sideways: make each one a focusable region, so the
  // keyboard can reach and scroll it in WebKit too.
  $effect(() => {
    void html;
    for (const pre of root?.querySelectorAll("pre") ?? []) {
      pre.tabIndex = 0;
      pre.classList.add("scroll-region");
      pre.setAttribute("role", "region");
      pre.setAttribute("aria-label", "Code");
    }
  });

  function onclick(e: MouseEvent) {
    const a = (e.target as HTMLElement).closest("a");
    if (a?.href) {
      e.preventDefault();
      openExternal(a.href);
    }
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="md selectable" class:streaming bind:this={root} {onclick}>{#each blocks as block, i (i)}{@html block}{/each}</div>

<style>
  .md { line-height: var(--lh-prose); overflow-wrap: anywhere; }
  .md :global(p) { margin: 0 0 0.7em; }
  .md :global(p:last-child), .md :global(ul:last-child), .md :global(ol:last-child), .md :global(pre:last-child) { margin-bottom: 0; }
  .md :global(:is(h1, h2, h3, h4, h5, h6)) { font-weight: var(--fw-semibold); line-height: var(--lh-tight); margin: 1.2em 0 0.5em; color: var(--text); }
  .md :global(:is(h1, h2, h3, h4, h5, h6):first-child) { margin-top: 0; }
  .md :global(h1) { font-size: var(--fs-lg); letter-spacing: var(--tracking-title); }
  .md :global(h2) { font-size: var(--fs-md); letter-spacing: var(--tracking-title); margin-top: 1.4em; }
  .md :global(h3) { font-size: var(--fs-base); }
  .md :global(:is(h4, h5, h6)) { font-size: var(--fs-sm); color: var(--text-2); }
  .md :global(ul), .md :global(ol) { margin: 0 0 0.7em; padding-left: 1.4em; }
  .md :global(li) { margin: 0.15em 0; }
  .md :global(code) { font: var(--fs-sm) var(--font-mono); background: var(--soft); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0 4px; }
  .md :global(pre) { position: relative; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 8px 10px; overflow-x: auto; margin: 0 0 0.7em; }
  .md :global(.code-lang) {
    position: absolute; top: 6px; right: 8px; font: var(--fs-2xs) var(--font-mono); color: var(--faint);
    user-select: none; pointer-events: none;
  }
  /* A caret after whatever arrived last. */
  .md.streaming > :global(:last-child)::after {
    content: "▍"; margin-left: 1px; color: var(--accent); animation: md-blink 1s steps(1) infinite;
  }
  @keyframes md-blink { 50% { opacity: 0; } }
  .md :global(pre code) { background: none; border: 0; padding: 0; font-size: var(--fs-sm); line-height: var(--lh-code); }
  .md :global(a) { color: var(--text); text-decoration: underline; text-decoration-color: var(--muted); text-underline-offset: 2px; }
  .md :global(a:is(:hover, :focus-visible)) { text-decoration-color: var(--text-2); }
  .md :global(blockquote) { margin: 0 0 0.7em; padding: 6px 12px; background: var(--soft); border-radius: var(--radius); color: var(--text-2); }
  .md :global(table) { border-collapse: collapse; margin: 0 0 0.7em; font-size: var(--fs-sm); }
  .md :global(th), .md :global(td) { border: 1px solid var(--border); padding: 4px 8px; text-align: left; }
  .md :global(th) { background: var(--soft); font-weight: var(--fw-semibold); }
  .md :global(hr) { border: 0; border-top: 1px solid var(--border); margin: 1em 0; }
</style>
