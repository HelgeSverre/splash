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

<!-- A scroll pane: tabindex so the keyboard reaches it in WebKit too. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div class="code syntax selectable scroll-region" bind:this={root} tabindex="0" role="region" aria-label="File contents">
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
  table { border-collapse: collapse; font: var(--fs-sm)/var(--lh-prose) var(--font-mono); min-width: 100%; }
  .ln { width: 1%; padding: 0 12px 0 16px; text-align: right; color: var(--faint); user-select: none; vertical-align: top; }
  .src { padding: 0 16px 0 4px; white-space: pre; color: var(--text); }
  tr.hit { background: var(--accent-soft); }
  tr.hit .ln { color: var(--accent); }
</style>
