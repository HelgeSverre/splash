<script lang="ts">
  // A fenced code block: highlighted when the language is known, labelled,
  // and a keyboard-reachable scroll region.
  import { highlightCode, languageForTag } from "../../lib/highlight";

  let { code, lang = "", maxHeight = "none" }: { code: string; lang?: string; maxHeight?: string } = $props();
  const known = $derived(languageForTag(lang));
  const html = $derived(highlightCode(code, lang));
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<pre class="block syntax selectable scroll-region" style:max-height={maxHeight} tabindex="0" role="region"
  aria-label={known ? `${known} code` : "Code"}>{#if known}<span class="lang">{known}</span>{/if}<code>{@html html}</code></pre>

<style>
  .block {
    position: relative; margin: 0; padding: 8px 10px; overflow: auto;
    font: var(--fs-sm) / var(--lh-code) var(--font-mono); color: var(--text);
    background: var(--surface); white-space: pre;
  }
  .lang {
    position: sticky; float: right; top: 0; margin-left: 12px;
    font: var(--fs-2xs) var(--font-mono); color: var(--faint); user-select: none;
  }
</style>
