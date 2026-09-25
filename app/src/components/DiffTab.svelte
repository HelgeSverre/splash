<script lang="ts">
  import DiffView from "./DiffView.svelte";
  import SegmentedControl from "./ui/SegmentedControl.svelte";
  import EmptyState from "./ui/EmptyState.svelte";
  import FilePane from "./FilePane.svelte";
  import Tag from "./ui/Tag.svelte";
  import Toolbar from "./ui/Toolbar.svelte";
  import Checkbox from "./ui/Checkbox.svelte";
  import PathLabel from "./ui/PathLabel.svelte";
  import { api, type SessionView } from "../bindings";
  import { openTab } from "../lib/tabs.svelte";
  import { workspace } from "../lib/workspace.svelte";
  import { load } from "../lib/load.svelte";

  let { session, path }: { session: SessionView; path: string } = $props();
  let mode: "unified" | "split" = $state((localStorage.getItem("splash.diffMode") as "unified" | "split") ?? "unified");
  let full = $state(false);

  const touched = $derived(workspace(session.id).touched[path]);

  const res = load(() => {
    void touched;
    return api.file_diff(session.id, path);
  });
  const diff = $derived(res.value);

  function setMode(m: "unified" | "split") {
    mode = m;
    try { localStorage.setItem("splash.diffMode", m); } catch {}
  }
</script>

<div class="tab">
  <Toolbar>
    <PathLabel {path} />
    {#if diff && diff.old === null && diff.new !== null}<Tag tone="ok">new file</Tag>{/if}
    {#if diff && diff.new === null && !diff.binary && !diff.too_large}<Tag tone="err">deleted</Tag>{/if}
    {#snippet end()}
      <SegmentedControl label="Diff layout" value={mode} onchange={setMode}
        options={[{ value: "unified", label: "Unified" }, { value: "split", label: "Split" }]} />
      <Checkbox bind:checked={full} label="Whole file" />
      {#if diff?.new !== null}<button class="btn sm ghost" onclick={() => openTab({ kind: "file", path })}>Open file</button>{/if}
    {/snippet}
  </Toolbar>
  <div class="content">
    <FilePane {res} binary={diff?.binary} tooLarge={diff?.too_large && { title: "Too large to diff here", detail: "Over 1 MB." }}>
      {#snippet children(diff)}
        {#if diff.old === diff.new}
          <EmptyState icon="check" title="No changes against the base" />
        {:else}
          <DiffView oldText={diff.old ?? ""} newText={diff.new ?? ""} {path} {mode} context={full ? -1 : 4} />
        {/if}
      {/snippet}
    </FilePane>
  </div>
</div>

<style>
  .tab { height: 100%; display: flex; flex-direction: column; }
  .content { flex: 1; min-height: 0; overflow: auto; }
  .content :global(.diff) { height: 100%; background: var(--bg); }
</style>
