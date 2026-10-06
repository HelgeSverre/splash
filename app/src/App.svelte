<script lang="ts">
  import ActionsView from "./components/github/ActionsView.svelte";
  import GithubView from "./components/github/GithubView.svelte";
  import IssueComposer from "./components/github/IssueComposer.svelte";
  import { github } from "./lib/github.svelte";
  import Sidebar from "./components/Sidebar.svelte";
  import SessionView from "./components/SessionView.svelte";
  import Settings from "./components/settings/Settings.svelte";
  import NewSession from "./components/NewSession.svelte";
  import Welcome from "./components/Welcome.svelte";
  import RightPanel from "./components/RightPanel.svelte";
  import BottomTerminal from "./components/BottomTerminal.svelte";
  import Splitter from "./components/Splitter.svelte";
  import DocPreview from "./components/DocPreview.svelte";
  import { api } from "./bindings";
  import { app, loadAll, currentSession } from "./lib/sessions.svelte";
  import { layout, saveLayout, clamp } from "./lib/layout.svelte";
  import { preview } from "./lib/customize.svelte";
  import { installRoute, syncPlaygroundHash } from "./lib/route.svelte";
  import { installLive } from "./lib/live";
  import { installCommands } from "./lib/commands.svelte";
  import { installKeybindings } from "./lib/keybindings.svelte";
  import { installTabOrder } from "./lib/focus";
  import { showError } from "./lib/system";

  installRoute();
  installLive();
  loadAll().catch(showError);
  installKeybindings();
  installTabOrder();
  installCommands();

  // The design-system playground loads on demand, off the main bundle.
  const loadPlayground = () => import("./components/playground/Playground.svelte");
  $effect(syncPlaygroundHash);

  const session = $derived(currentSession());
  const sessionId = $derived(session?.id);

  // Watch the open session's folder (Changes, Files and open tabs follow it).
  let watched: string | undefined;
  $effect(() => {
    const id = sessionId;
    if (watched && watched !== id) api.watch_workspace(watched, false).catch(() => {});
    if (id && id !== watched) api.watch_workspace(id, true).catch(() => {});
    watched = id;
  });
</script>

<div class="workbench" style:grid-template-columns={layout.leftOpen ? `${layout.left}px 1px minmax(0, 1fr)` : "minmax(0, 1fr)"}>
  {#if layout.leftOpen}
    <div class="left"><Sidebar /></div>
    <Splitter axis="x" label="Resize sidebar" value={layout.left} min={200} max={420} onmove={(d) => (layout.left = clamp(layout.left + d, 200, 420))} onend={saveLayout} />
  {/if}
  <main>
    <div class="top">
      <div class="center">
        {#if app.view.kind === "actions"}
          <ActionsView />
        {:else if app.view.kind === "github"}
          <GithubView />
        {:else if app.view.kind === "playground"}
          {#await loadPlayground() then m}<m.default />{/await}
        {:else if app.view.kind === "session" && session}
          {#key session.id}
            <SessionView {session} />
          {/key}
        {:else}
          <Welcome />
        {/if}
      </div>
      {#if session && app.view.kind === "session" && layout.rightOpen}
        <Splitter axis="x" label="Resize side panel" value={layout.right} min={220} max={720} onmove={(d) => (layout.right = clamp(layout.right - d, 220, 720))} onend={saveLayout} />
        <div class="right" style:width="{layout.right}px"><RightPanel {session} /></div>
      {/if}
    </div>
    {#if session && app.view.kind === "session" && layout.bottomOpen}
      <BottomTerminal {session} />
    {/if}
  </main>
</div>

{#if github.issueOpen}<IssueComposer />{/if}

{#if app.newSession}
  <NewSession />
{/if}

{#if app.settings}
  <Settings />
{/if}

{#if preview.doc}
  <DocPreview />
{/if}

<style>
  .workbench { height: 100%; display: grid; }
  .left { min-width: 0; min-height: 0; }
  main { min-width: 0; min-height: 0; display: flex; flex-direction: column; background: var(--bg); }
  .top { flex: 1; min-height: 0; display: flex; }
  .center { flex: 1; min-width: 0; min-height: 0; }
  .right { flex: none; min-width: 0; min-height: 0; }
</style>
