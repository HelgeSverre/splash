<script lang="ts">
  import CodeView from "./ui/CodeView.svelte";
  import FilePane from "./FilePane.svelte";
  import Toolbar from "./ui/Toolbar.svelte";
  import PathLabel from "./ui/PathLabel.svelte";
  import { api, type SessionView } from "../bindings";
  import { workspace } from "../lib/workspace.svelte";
  import { load } from "../lib/load.svelte";
  import { rel } from "../lib/paths";
  import { bytes } from "../lib/format";

  let { session, path, line }: { session: SessionView; path: string; line?: number } = $props();

  const relPath = $derived(rel(path, session.cwd));
  const touched = $derived(workspace(session.id).touched[relPath]);
  const res = load(() => {
    void touched;
    return api.read_file(session.id, path);
  });
  const file = $derived(res.value);
  const lineCount = $derived(file?.text ? file.text.split("\n").length : 0);
</script>

<div class="tab">
  <Toolbar>
    <PathLabel {path} cwd={session.cwd} />
    {#if file}<span class="meta t-mono-meta" data-testid="file-meta" data-lines={lineCount}>{lineCount} lines · {bytes(file.size)}</span>{/if}
    {#snippet end()}<span class="meta t-mono-meta" data-testid="file-readonly">read-only</span>{/snippet}
  </Toolbar>
  <div class="content" data-testid="file-content">
    <FilePane {res} binary={file?.binary} tooLarge={file?.too_large && { title: "Too large to show", detail: bytes(file.size), mono: true }}>
      {#snippet children(file)}<CodeView text={file.text ?? ""} path={file.path} {line} />{/snippet}
    </FilePane>
  </div>
</div>

<style>
  .tab { height: 100%; display: flex; flex-direction: column; }
  .meta { flex: none; font-variant-numeric: tabular-nums; }
  .content { flex: 1; min-height: 0; }
</style>
