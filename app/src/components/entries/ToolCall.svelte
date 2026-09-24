<script lang="ts">
  import DiffView from "../DiffView.svelte";
  import { openTab } from "../../lib/state.svelte";
  import { rel, relText } from "../../lib/paths";
  import type { Entry } from "../../bindings";

  type Tool = Extract<Entry, { kind: "tool" }>;
  let { entry, cwd }: { entry: Tool; cwd: string } = $props();
  let open = $state(false);

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

<div class="tool {entry.status}">
  <button class="plain row" onclick={() => (open = !open)} disabled={!hasBody}>
    <span class="status">
      {#if entry.status === "completed"}✓{:else if entry.status === "failed"}✗{:else if entry.status === "in_progress"}<span class="spinner"></span>{:else}○{/if}
    </span>
    <span class="kind">{kind}</span>
    <span class="title">{title}</span>
    {#if showInput}<span class="input">{input}</span>{/if}
    {#each entry.locations.slice(0, 3) as loc (loc.path + loc.line)}
      <span
        class="loc"
        role="link"
        tabindex="0"
        onclick={(e) => { e.stopPropagation(); openTab({ kind: "file", path: loc.path, line: loc.line ?? undefined }); }}
        onkeydown={(e) => e.key === "Enter" && openTab({ kind: "file", path: loc.path, line: loc.line ?? undefined })}
      >{rel(loc.path, cwd)}{loc.line ? `:${loc.line}` : ""}</span>
    {/each}
    {#if hasBody}<span class="chev">{open ? "▾" : "▸"}</span>{/if}
  </button>
  {#if open}
    <div class="body">
      {#each diffs as d, i (i)}
        {#if d.type === "diff"}
          <div class="diff-head">
            <span
              class="loc"
              role="link"
              tabindex="0"
              onclick={() => openTab({ kind: "diff", path: d.path })}
              onkeydown={(e) => e.key === "Enter" && openTab({ kind: "diff", path: d.path })}
            >{rel(d.path, cwd)}</span>
            {#if !d.old}<span class="new">new file</span>{/if}
          </div>
          <DiffView oldText={d.old ?? ""} newText={d.new} maxHeight="360px" />
        {/if}
      {/each}
      {#each texts as t, i (i)}
        {#if t.type === "text"}<pre class="out selectable">{t.text}</pre>{/if}
      {/each}
      {#if entry.output && !texts.length}<pre class="out selectable">{entry.output}</pre>{/if}
    </div>
  {/if}
</div>

<style>
  .tool { margin: 1px 0; font: 12px/1.5 var(--font-mono); }
  .row {
    display: flex; align-items: center; gap: 8px; width: 100%;
    padding: 3px 8px; margin-left: -8px; border-radius: var(--radius-sm); min-width: 0;
  }
  .row:hover:not(:disabled) { background: var(--soft); }
  .row:disabled { cursor: default; }
  .status { width: 12px; flex: none; display: inline-flex; justify-content: center; color: var(--muted); }
  .completed .status { color: var(--ok); }
  .failed .status { color: var(--err); }
  .status .spinner { width: 10px; height: 10px; border-width: 1.5px; }
  .kind { flex: none; color: var(--muted); min-width: 42px; }
  .title { color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 0 1 auto; min-width: 0; }
  .input { color: var(--text-2); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1 1 0; min-width: 0; }
  .loc { color: var(--text-2); text-decoration: underline; text-decoration-color: var(--faint); text-underline-offset: 2px; cursor: pointer; flex: none; }
  .loc:hover { color: var(--accent); text-decoration-color: var(--accent); }
  .chev { color: var(--faint); margin-left: auto; flex: none; }
  .body { margin: 4px 0 8px 20px; border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  .diff-head { display: flex; gap: 10px; align-items: center; padding: 5px 10px; background: var(--soft); border-bottom: 1px solid var(--border); }
  .new { color: var(--ok); font-size: 11px; }
  .out { margin: 0; padding: 8px 10px; max-height: 280px; overflow: auto; white-space: pre-wrap; word-break: break-word; color: var(--text-2); background: var(--surface); }
  .failed .out { color: var(--del-fg); }
</style>
