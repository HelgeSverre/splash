<script lang="ts">
  import CodeView from "./ui/CodeView.svelte";
  import { api, type FileContent, type SessionView } from "../bindings";
  import { workspace } from "../lib/state.svelte";
  import { rel } from "../lib/paths";
  import { bytes } from "../lib/format";

  let { session, path, line }: { session: SessionView; path: string; line?: number } = $props();
  let file: FileContent | null = $state(null);
  let error = $state("");

  const relPath = $derived(rel(path, session.cwd));
  const touched = $derived(workspace(session.id).touched[relPath]);
  const lineCount = $derived(file?.text ? file.text.split("\n").length : 0);

  $effect(() => {
    void touched;
    api.read_file(session.id, path).then((f) => { file = f; error = ""; }).catch((e) => (error = String(e.message ?? e)));
  });
</script>

<div class="tab">
  <div class="bar">
    <span class="path">{relPath}</span>
    {#if file}<span class="meta">{lineCount} lines · {bytes(file.size)}</span>{/if}
    <span class="ro">read-only</span>
  </div>
  <div class="content">
    {#if error}
      <div class="note err">{error}</div>
    {:else if !file}
      <div class="note"><span class="spinner"></span></div>
    {:else if file.binary}
      <div class="note">Binary file.</div>
    {:else if file.too_large}
      <div class="note">Too large to show ({bytes(file.size)}).</div>
    {:else}
      <CodeView text={file.text ?? ""} path={file.path} {line} />
    {/if}
  </div>
</div>

<style>
  .tab { height: 100%; display: flex; flex-direction: column; }
  .bar { display: flex; align-items: center; gap: 12px; padding: 6px 16px; border-bottom: 1px solid var(--border); flex: none; min-height: 37px; }
  .path { font: 12px var(--font-mono); color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .meta { font: 11px var(--font-mono); color: var(--muted); }
  .ro { margin-left: auto; font: 11px var(--font-mono); color: var(--faint); }
  .content { flex: 1; min-height: 0; }
  .note { padding: 24px; color: var(--muted); display: flex; gap: 8px; align-items: center; }
  .note.err { color: var(--err-dim); }
</style>
