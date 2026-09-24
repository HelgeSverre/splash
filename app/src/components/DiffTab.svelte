<script lang="ts">
  import DiffView from "./DiffView.svelte";
  import { api, type FileDiff, type SessionView } from "../bindings";
  import { workspace, openTab } from "../lib/state.svelte";

  let { session, path }: { session: SessionView; path: string } = $props();
  let diff: FileDiff | null = $state(null);
  let error = $state("");
  let mode: "unified" | "split" = $state((localStorage.getItem("splash.diffMode") as "unified" | "split") ?? "unified");
  let full = $state(false);

  const touched = $derived(workspace(session.id).touched[path]);

  $effect(() => {
    void touched;
    api.file_diff(session.id, path).then((d) => { diff = d; error = ""; }).catch((e) => (error = String(e.message ?? e)));
  });

  function setMode(m: "unified" | "split") {
    mode = m;
    try { localStorage.setItem("splash.diffMode", m); } catch {}
  }
</script>

<div class="tab">
  <div class="bar">
    <span class="path">{path}</span>
    {#if diff && diff.old === null && diff.new !== null}<span class="tag add">new file</span>{/if}
    {#if diff && diff.new === null && !diff.binary && !diff.too_large}<span class="tag del">deleted</span>{/if}
    <span class="spacer"></span>
    <div class="seg-control">
      <button class:on={mode === "unified"} onclick={() => setMode("unified")}>Unified</button>
      <button class:on={mode === "split"} onclick={() => setMode("split")}>Split</button>
    </div>
    <label class="full"><input type="checkbox" bind:checked={full} /> whole file</label>
    {#if diff?.new !== null}<button class="btn sm ghost" onclick={() => openTab({ kind: "file", path })}>Open file</button>{/if}
  </div>
  <div class="content">
    {#if error}
      <div class="note err">{error}</div>
    {:else if !diff}
      <div class="note"><span class="spinner"></span></div>
    {:else if diff.binary}
      <div class="note">Binary file — no text diff.</div>
    {:else if diff.too_large}
      <div class="note">Too large to diff here (over 1 MB).</div>
    {:else if diff.old === diff.new}
      <div class="note">No changes against the base.</div>
    {:else}
      <DiffView oldText={diff.old ?? ""} newText={diff.new ?? ""} {mode} context={full ? -1 : 4} />
    {/if}
  </div>
</div>

<style>
  .tab { height: 100%; display: flex; flex-direction: column; }
  .bar { display: flex; align-items: center; gap: 10px; padding: 6px 12px 6px 16px; border-bottom: 1px solid var(--border); flex: none; }
  .path { font: 12px var(--font-mono); color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .tag { font: 10.5px var(--font-mono); padding: 0 6px; border-radius: 999px; border: 1px solid; }
  .tag.add { color: var(--ok-dim); border-color: var(--ok-border); }
  .tag.del { color: var(--err-dim); border-color: var(--err-border); }
  .spacer { flex: 1; }
  .full { display: flex; gap: 5px; align-items: center; font-size: 12px; color: var(--text-2); }
  .content { flex: 1; min-height: 0; overflow: auto; }
  .content :global(.diff) { height: 100%; background: var(--bg); }
  .note { padding: 24px; color: var(--muted); display: flex; gap: 8px; align-items: center; }
  .note.err { color: var(--err); }
</style>
