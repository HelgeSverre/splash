<script lang="ts">
  import CodeView from "./ui/CodeView.svelte";
  import FilePane from "./FilePane.svelte";
  import type { PaneTools } from "../lib/tabs.svelte";
  import { api, type SessionView } from "../bindings";
  import { workspace } from "../lib/workspace.svelte";
  import { load } from "../lib/load.svelte";
  import { rel } from "../lib/paths";
  import { bytes } from "../lib/format";

  // `setTools` puts this pane's facts on the tab bar while it is the open tab.
  let { session, path, line, active = true, setTools }: { session: SessionView; path: string; line?: number; active?: boolean; setTools?: (owner: object, snippet: PaneTools | null) => void } = $props();
  const owner = {};
  $effect(() => {
    if (!active || !setTools) return;
    setTools(owner, tools);
    return () => setTools(owner, null);
  });

  const relPath = $derived(rel(path, session.cwd));
  const touched = $derived(workspace(session.id).touched[relPath]);
  const res = load(() => {
    void touched;
    return api.read_file(session.id, path);
  });
  const file = $derived(res.value);
  const lineCount = $derived(file?.text ? file.text.split("\n").length : 0);
</script>

{#snippet tools()}
  <span class="meta t-mono-meta" title={relPath}>{#if file}<span data-testid="file-meta" data-lines={lineCount}>{lineCount} lines · {bytes(file.size)}</span> · {/if}<span data-testid="file-readonly">read-only</span></span>
{/snippet}

<div class="tab">
  {#if !setTools}<div class="bar">{@render tools()}</div>{/if}
  <div class="content" data-testid="file-content">
    <FilePane {res} binary={file?.binary} tooLarge={file?.too_large && { title: "Too large to show", detail: bytes(file.size), mono: true }}>
      {#snippet children(file)}<CodeView text={file.text ?? ""} path={file.path} {line} />{/snippet}
    </FilePane>
  </div>
</div>

<style>
  .tab { height: 100%; display: flex; flex-direction: column; }
  .bar { display: flex; align-items: center; justify-content: flex-end; flex: none; height: var(--h-toolbar); padding: 0 var(--gutter); border-bottom: 1px solid var(--border); }
  .meta { flex: none; font-variant-numeric: tabular-nums; }
  .content { flex: 1; min-height: 0; }
</style>
