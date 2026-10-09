<script lang="ts">
  import { openExternal } from "../../lib/system";
  import { renderMarkdown, renderStreamingBlocks } from "../../lib/markdown";
  import { mountDiagrams } from "../../lib/mermaid";

  // While a reply is still arriving, render it block by block (finished
  // blocks are cached; only the growing last one re-renders, healed).
  let { text, streaming = false }: { text: string; streaming?: boolean } = $props();
  const blocks = $derived(streaming ? renderStreamingBlocks(text) : [renderMarkdown(text)]);
  const html = $derived(blocks.join(""));
  let root: HTMLDivElement | undefined = $state();

  // Code blocks scroll sideways: make each one a focusable region, so the
  // keyboard can reach and scroll it in WebKit too. Diagram blocks get their
  // SVG once it is drawn (finished blocks keep their DOM while streaming, so
  // a drawn diagram stays put). Tracks `blocks`, not `html`: when streaming
  // ends, the blocks collapse into one and the DOM is rebuilt although the
  // joined HTML is unchanged.
  $effect(() => {
    void blocks;
    for (const pre of root?.querySelectorAll("pre") ?? []) {
      pre.tabIndex = 0;
      pre.classList.add("scroll-region");
      pre.setAttribute("role", "region");
      pre.setAttribute("aria-label", "Code");
    }
    if (root) mountDiagrams(root);
  });

  function onclick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    // A diagram block's bar: Source shows the fence's text, Actual size stops
    // scaling a wide diagram down to the column.
    const button = target.closest<HTMLButtonElement>("button.mermaid-toggle, button.mermaid-size");
    const block = button?.closest<HTMLElement>(".mermaid");
    if (button && block) {
      const pressed = button.getAttribute("aria-pressed") !== "true";
      button.setAttribute("aria-pressed", String(pressed));
      if (button.classList.contains("mermaid-toggle")) block.dataset.view = pressed ? "source" : "diagram";
      else block.dataset.size = pressed ? "actual" : "fit";
      return;
    }
    const a = target.closest("a");
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
  /* The font shorthand resets font-feature-settings: keep the body's ligatures-off, so `-->` reads as typed. */
  .md :global(code) { font: var(--fs-sm) var(--font-mono); font-feature-settings: inherit; background: var(--soft); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0 4px; }
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
  /* Keep a code span whole inside a cell; a wide table scrolls instead. */
  .md :global(td code), .md :global(th code) { white-space: nowrap; }
  .md :global(table) { display: block; max-width: 100%; overflow-x: auto; }
  .md :global(th) { background: var(--soft); font-weight: var(--fw-semibold); }
  .md :global(hr) { border: 0; border-top: 1px solid var(--border); margin: 1em 0; }

  /* ── Diagrams (lib/markdown.ts emits the block, lib/mermaid.ts draws it) ──
     The source shows until the SVG is ready and whenever the diagram is
     invalid; once ready, the bar's buttons switch to the source and between
     fitting the column and the diagram's actual size. */
  .md :global(.mermaid) {
    position: relative; margin: 0 0 0.7em; border: 1px solid var(--border); border-radius: var(--radius);
    background: var(--diagram-surface); overflow: hidden;
  }
  .md :global(.mermaid:last-child) { margin-bottom: 0; }
  .md :global(.mermaid > pre) { margin: 0; border: 0; border-radius: 0; background: transparent; padding-right: 72px; }
  .md :global(.mermaid-bar) {
    position: absolute; top: 5px; right: 6px; z-index: 1; display: flex; align-items: center; gap: 4px;
    padding: 1px 2px; border-radius: var(--radius-sm); background: var(--diagram-surface);
  }
  .md :global(.mermaid-lang) { font: var(--fs-2xs) var(--font-mono); color: var(--faint); margin-right: 4px; user-select: none; }
  .md :global(.mermaid-bar button) {
    font: var(--fs-2xs) var(--font-mono); color: var(--muted); padding: 1px 6px;
    border: 1px solid transparent; border-radius: var(--radius-sm);
  }
  .md :global(.mermaid-bar button:is(:hover, :focus-visible)) { color: var(--text); background: var(--hover); }
  .md :global(.mermaid-bar button[aria-pressed="true"]) { color: var(--text); background: var(--soft); border-color: var(--border-strong); }
  .md :global(.mermaid:not([data-status="ready"]) .mermaid-bar button),
  .md :global(.mermaid[data-view="source"] .mermaid-size) { display: none; }
  /* Natural size, centred; wider than the column, it scales down to fit
     until Actual size, which scrolls sideways instead. */
  .md :global(.mermaid-diagram) { display: none; padding: 24px 14px 14px; overflow-x: auto; text-align: center; }
  .md :global(.mermaid[data-status="ready"][data-view="diagram"] .mermaid-diagram) { display: block; }
  .md :global(.mermaid[data-status="ready"][data-view="diagram"] > pre) { display: none; }
  .md :global(.mermaid-diagram svg) { max-width: 100%; height: auto; vertical-align: top; }
  .md :global(.mermaid[data-size="actual"] .mermaid-diagram svg) { max-width: none; }
  .md :global(.mermaid-error) { display: none; padding: 6px 10px; border-top: 1px solid var(--border); font-size: var(--fs-sm); color: var(--del-fg); }
  .md :global(.mermaid[data-status="error"] .mermaid-error) { display: block; }
</style>
