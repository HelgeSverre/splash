<script lang="ts">
  // The side panel: the session's changes, its files, and its details.
  import ReviewPanel from "./ReviewPanel.svelte";
  import ChangesList from "./ChangesList.svelte";
  import FileTree from "./FileTree.svelte";
  import DetailsPanel from "./DetailsPanel.svelte";
  import IconButton from "./ui/IconButton.svelte";
  import Tabs from "./ui/Tabs.svelte";
  import { layout, saveLayout, type SideTab } from "../lib/layout.svelte";
  import { workspace, refreshStatus, loadDir } from "../lib/workspace.svelte";
  import type { SessionView } from "../bindings";

  let { session }: { session: SessionView } = $props();
  const w = $derived(workspace(session.id));

  $effect(() => {
    const id = session.id;
    refreshStatus(id);
    if (!workspace(id).tree[""]) loadDir(id, "");
  });

  const tabs = $derived([
    { id: "review", label: "Review", count: session.attention?.kind === "review" ? 1 : undefined },
    { id: "changes", label: "Changes", count: w.changes.length },
    { id: "files", label: "Files" },
    { id: "details", label: "Details" },
  ]);

  function setTab(t: string) {
    layout.rightTab = t as SideTab;
    saveLayout();
  }
</script>

<div class="panel">
  <Tabs data-testid="side-tabs" items={tabs} active={layout.rightTab} prefix="rp" label="Side panel" size="header" onselect={setTab}>
    {#snippet actions()}
      <IconButton title="Refresh" size="sm" icon="refresh" onclick={() => { refreshStatus(session.id); loadDir(session.id, ""); }} />
    {/snippet}
  </Tabs>
  <div class="tabpanel" id="rp-panel-{layout.rightTab}" role="tabpanel" aria-labelledby="rp-tab-{layout.rightTab}">
    {#if layout.rightTab === "review"}
      {#key session.id}<ReviewPanel {session} />{/key}
    {:else if layout.rightTab === "changes"}
      <ChangesList {session} />
    {:else if layout.rightTab === "details"}
      <DetailsPanel {session} />
    {:else}
      <FileTree {session} />
    {/if}
  </div>
</div>

<style>
  .panel { height: 100%; display: flex; flex-direction: column; background: var(--surface); min-width: 0; }
  .tabpanel { flex: 1; min-height: 0; display: flex; flex-direction: column; }
</style>
