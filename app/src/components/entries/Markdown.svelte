<script lang="ts">
  import { shell } from "@elyra/runtime";
  import { renderMarkdown } from "../../lib/markdown";

  let { text }: { text: string } = $props();
  const html = $derived(renderMarkdown(text));

  function onclick(e: MouseEvent) {
    const a = (e.target as HTMLElement).closest("a");
    if (a?.href) {
      e.preventDefault();
      shell.openExternal(a.href).catch(() => {});
    }
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="md selectable" {onclick}>{@html html}</div>

<style>
  .md { line-height: 1.6; overflow-wrap: anywhere; }
  .md :global(p) { margin: 0 0 0.7em; }
  .md :global(p:last-child), .md :global(ul:last-child), .md :global(ol:last-child), .md :global(pre:last-child) { margin-bottom: 0; }
  .md :global(h1), .md :global(h2), .md :global(h3), .md :global(h4) { font-size: 14px; font-weight: 600; margin: 1em 0 0.4em; }
  .md :global(ul), .md :global(ol) { margin: 0 0 0.7em; padding-left: 1.4em; }
  .md :global(li) { margin: 0.15em 0; }
  .md :global(code) { font: 12px var(--font-mono); background: var(--soft); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0 4px; }
  .md :global(pre) { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 10px 12px; overflow-x: auto; margin: 0 0 0.7em; }
  .md :global(pre code) { background: none; border: 0; padding: 0; font-size: 12px; line-height: 1.55; }
  .md :global(a) { color: var(--text); text-decoration: underline; text-decoration-color: var(--muted); text-underline-offset: 2px; }
  .md :global(a:hover) { text-decoration-color: var(--accent); }
  .md :global(blockquote) { margin: 0 0 0.7em; padding: 6px 12px; background: var(--soft); border-radius: var(--radius); color: var(--text-2); }
  .md :global(table) { border-collapse: collapse; margin: 0 0 0.7em; font-size: 12px; }
  .md :global(th), .md :global(td) { border: 1px solid var(--border); padding: 4px 8px; text-align: left; }
  .md :global(th) { background: var(--soft); font-weight: 600; }
  .md :global(hr) { border: 0; border-top: 1px solid var(--border); margin: 1em 0; }
</style>
