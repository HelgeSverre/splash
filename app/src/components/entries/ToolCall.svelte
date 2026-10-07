<script lang="ts">
  import DiffView from "../DiffView.svelte";
  import Chevron from "../ui/Chevron.svelte";
  import StepIcon from "../ui/StepIcon.svelte";
  import Tag from "../ui/Tag.svelte";
  import CodeBlock from "../ui/CodeBlock.svelte";
  import { splitFences } from "../../lib/highlight";
  import { openTab } from "../../lib/tabs.svelte";
  import { rel, relText } from "../../lib/paths";
  import type { Entry } from "../../bindings";

  type Tool = Extract<Entry, { kind: "tool" }>;
  let { entry, cwd }: { entry: Tool; cwd: string } = $props();
  let open = $state(false);
  const uid = $props.id();
  const bodyId = `tool-${uid}`;

  const KIND: Record<string, string> = {
    read: "read", edit: "edit", delete: "delete", move: "move", search: "search",
    execute: "run", think: "think", fetch: "fetch", switch_mode: "mode", other: "tool",
  };
  const kind = $derived(KIND[entry.tool_kind] ?? entry.tool_kind);
  const title = $derived(relText(entry.title, cwd));
  const input = $derived(entry.input ? relText(entry.input, cwd) : null);
  // Don't repeat the input when the title already says it.
  const showInput = $derived(input && !title.includes(input) && input !== title);
  const diffs = $derived(entry.content.filter((c) => c.type === "diff"));
  const texts = $derived(entry.content.filter((c) => c.type === "text"));
  const hasBody = $derived(diffs.length > 0 || texts.length > 0 || !!entry.output);
  // Diffs are the interesting part of an edit: show them without a click.
  $effect(() => {
    if (diffs.length && entry.status === "completed" && entry.tool_kind === "edit") open = true;
  });
</script>

{#snippet output(text: string)}
  {#each splitFences(text) as seg, j (j)}
    {#if seg.kind === "code"}
      <CodeBlock code={seg.code} lang={seg.lang} maxHeight="360px" />
    {:else}
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <pre class="out selectable scroll-region" tabindex="0" role="region" aria-label="Tool output" data-testid="tool-output">{seg.text}</pre>
    {/if}
  {/each}
{/snippet}

<div class="tool {entry.status}" data-testid="tool" data-status={entry.status} data-tool-kind={entry.tool_kind}>
  <!-- The head button's hit area covers the whole row (the locations sit on
       top of it), so the hover, the focus ring and the click all match. -->
  <div class="row" class:clickable={hasBody}>
    <button class="plain head" data-testid="tool-head" onclick={() => (open = !open)} disabled={!hasBody}
      aria-expanded={hasBody ? open : undefined} aria-controls={hasBody ? bodyId : undefined}>
      <StepIcon status={entry.status} live />
      <span class="kind">{kind}</span>
      <span class="title">{title}</span>
      {#if showInput}<span class="input">{input}</span>{/if}
    </button>
    {#each entry.locations.slice(0, 3) as loc (loc.path + loc.line)}
      <button class="plain loc" data-testid="tool-location" data-path={loc.path} data-line={loc.line} onclick={() => openTab({ kind: "file", path: loc.path, line: loc.line ?? undefined })}
        >{rel(loc.path, cwd)}{loc.line ? `:${loc.line}` : ""}</button>
    {/each}
    {#if hasBody}<span class="twist" aria-hidden="true"><Chevron {open} /></span>{/if}
  </div>
  {#if open}
    <div class="body" id={bodyId}>
      {#each diffs as d, i (i)}
        {#if d.type === "diff"}
          <div class="diff-head" data-testid="tool-diff" data-path={d.path} data-new={!d.old || undefined}>
            <button class="plain loc" data-testid="tool-diff-path" onclick={() => openTab({ kind: "diff", path: d.path })}>{rel(d.path, cwd)}</button>
            {#if !d.old}<Tag tone="ok">new file</Tag>{/if}
          </div>
          <DiffView oldText={d.old ?? ""} newText={d.new} path={d.path} maxHeight="360px" />
        {/if}
      {/each}
      <!-- Output panes scroll: tabindex so the keyboard can reach them in WebKit too. -->
      {#each texts as t, i (i)}
        {#if t.type === "text"}{@render output(t.text)}{/if}
      {/each}
      {#if entry.output && !texts.length}{@render output(entry.output)}{/if}
    </div>
  {/if}
</div>

<style>
  .tool { margin: 1px 0; font: var(--fs-sm)/var(--lh-base) var(--font-mono); }
  /* Hangs 8px into the gutter, so the status glyph lines up with the text. */
  .row {
    position: relative; display: flex; align-items: center; gap: 8px; min-width: 0;
    margin: 0 -8px; padding: 0 8px; border-radius: var(--radius-sm);
  }
  .row.clickable:is(:hover, :has(> .head:focus-visible)) { background: var(--row-hover); }
  /* The ring goes on the row, round everything the button's hit area covers. */
  .row:has(> .head:focus-visible) { outline: var(--focus-ring-width) solid var(--focus-ring-color); outline-offset: var(--focus-ring-inset); }
  .head { display: flex; align-items: center; gap: 8px; flex: 1 1 auto; min-width: 0; padding: 3px 0; }
  .head:focus-visible { outline: none; }
  .head:not(:disabled)::after { content: ""; position: absolute; inset: 0; border-radius: inherit; }
  .head:disabled { cursor: default; }
  .kind { flex: none; color: var(--muted); font-size: var(--fs-xs); min-width: 42px; }
  .title { color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 0 1 auto; min-width: 0; }
  .input { color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1 1 0; min-width: 0; }
  .loc {
    position: relative; z-index: 1; flex: none; font: inherit; color: var(--text-2); border-radius: var(--radius-sm); cursor: pointer;
    text-decoration: underline; text-decoration-color: var(--muted); text-underline-offset: 2px;
  }
  .loc:is(:hover, :focus-visible) { color: var(--text); text-decoration-color: var(--text-2); }
  .twist { flex: none; display: inline-grid; place-items: center; width: 16px; height: 16px; pointer-events: none; }
  .row.clickable:is(:hover, :has(> .head:focus-visible)) .twist :global(.chev) { color: var(--muted); }
  .body { margin: 4px 0 8px 22px; border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  .diff-head { display: flex; gap: 10px; align-items: center; padding: 5px 10px; background: var(--soft); border-bottom: 1px solid var(--border); }
  .out { margin: 0; padding: 8px 10px; max-height: 280px; overflow: auto; white-space: pre-wrap; word-break: break-word; color: var(--text-2); background: var(--surface); }
  .failed .out { color: var(--del-fg); }
</style>
