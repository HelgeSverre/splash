<script lang="ts">
  // Read-only, highlighted source with line numbers.
  import { tick } from "svelte";
  import { highlightLines } from "../../lib/highlight";

  let { text, path, line }: { text: string; path: string; line?: number } = $props();
  let root: HTMLDivElement | undefined = $state();
  const lines = $derived(highlightLines(text, path));

  $effect(() => {
    if (!line || !lines.length) return;
    tick().then(() => root?.querySelector(`[data-line="${line}"]`)?.scrollIntoView({ block: "center" }));
  });
</script>

<div class="code selectable" bind:this={root}>
  <table>
    <tbody>
      {#each lines as html, i (i)}
        <tr data-line={i + 1} class:hit={line === i + 1}>
          <td class="ln">{i + 1}</td>
          <td class="src">{@html html || " "}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .code { height: 100%; overflow: auto; }
  table { border-collapse: collapse; font: 12px/1.6 var(--font-mono); min-width: 100%; }
  .ln { width: 1%; padding: 0 12px 0 16px; text-align: right; color: var(--faint); user-select: none; vertical-align: top; }
  .src { padding: 0 16px 0 4px; white-space: pre; color: var(--text); }
  tr.hit { background: var(--accent-soft); }
  tr.hit .ln { color: var(--accent); }
  .code :global(.hljs-keyword), .code :global(.hljs-selector-tag), .code :global(.hljs-built_in) { color: var(--syn-keyword); }
  .code :global(.hljs-string), .code :global(.hljs-regexp), .code :global(.hljs-attr) { color: var(--syn-string); }
  .code :global(.hljs-number), .code :global(.hljs-literal) { color: var(--syn-number); }
  .code :global(.hljs-comment), .code :global(.hljs-quote) { color: var(--syn-comment); font-style: italic; }
  .code :global(.hljs-title), .code :global(.hljs-section) { color: var(--syn-title); }
  .code :global(.hljs-type), .code :global(.hljs-title.class_) { color: var(--syn-type); }
  .code :global(.hljs-variable), .code :global(.hljs-template-variable), .code :global(.hljs-params) { color: var(--text); }
  .code :global(.hljs-tag), .code :global(.hljs-name) { color: var(--syn-tag); }
  .code :global(.hljs-meta), .code :global(.hljs-symbol), .code :global(.hljs-bullet) { color: var(--syn-meta); }
</style>
