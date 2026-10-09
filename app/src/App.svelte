<script lang="ts">
  import { tick } from "svelte";
  import SessionLibrary from "./components/SessionLibrary.svelte";
  import AttentionInbox from "./components/AttentionInbox.svelte";
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
  import ServerConnection from './components/ServerConnection.svelte';
  import ServerFolderPicker from './components/ServerFolderPicker.svelte';
  import { folderPicker } from './lib/folder-picker.svelte';
  import { serverMode, installServerConnection, workspaceClient, renewWorkspace } from './lib/server.svelte';
  import { openTranscript } from './lib/transcripts.svelte';
  import { sessionTabs } from "./lib/tabs.svelte";
  import { applyWorkspace } from './lib/workspace.svelte';
  import { reconnectTerminals } from './components/TerminalPane.svelte';

  installLive();
  // Loaded and routed: the URL's view is shown (data-ready, for the tests).
  let routeInstalled = $state(false);
  async function restoreWorkspace() {
    await loadAll();
    if (!routeInstalled) { installRoute(); routeInstalled = true; }
    const id = currentSession()?.id;
    if (id) { await openTranscript(id); await renewWorkspace(id); applyWorkspace({ session: id, paths: [] });
      applyWorkspace({ session: id, paths: sessionTabs(id).list.flatMap((tab) => "path" in tab ? [tab.path] : []) }); }
    await reconnectTerminals(new Set(app.sessions.map((s) => s.id)));
  }
  if (serverMode) installServerConnection(restoreWorkspace);
  else loadAll().then(async () => { installRoute(); routeInstalled = true; await tick(); await api.frontend_ready(); }).catch(showError);
  installKeybindings();
  installTabOrder();
  installCommands();

  // The design-system playground loads on demand, off the main bundle.
  const loadPlayground = () => import("./components/playground/Playground.svelte");
  $effect(syncPlaygroundHash);

  const session = $derived(currentSession());
  const sessionId = $derived(session?.id);
  let workbenchWidth = $state(window.innerWidth);
  const sideVisible = $derived(!!session && app.view.kind === "session" && layout.rightOpen);
  // Preserve saved sizes while reserving room for the conversation at the
  // desktop's minimum window size. Expanding the window restores those sizes.
  const leftMax = $derived(Math.max(200, Math.min(420, workbenchWidth - 361 - (sideVisible ? 221 : 0))));
  const leftWidth = $derived(clamp(layout.left, 200, leftMax));
  const rightMax = $derived(Math.max(220, Math.min(720, workbenchWidth - (layout.leftOpen ? leftWidth + 1 : 0) - 361)));
  const rightWidth = $derived(clamp(layout.right, 220, rightMax));

  // Watch the open session's folder (Changes, Files and open tabs follow it).
  let watched: string | undefined;
  $effect(() => {
    const id = sessionId;
    if (watched && watched !== id) api.watch_workspace(watched, false, workspaceClient).catch(() => {});
    if (id && id !== watched) renewWorkspace(id).catch(() => {});
    watched = id;
  });
  $effect(() => {
    const id = sessionId;
    if (!id) return;
    const timer = setInterval(() => renewWorkspace(id).catch(() => {}), 30000);
    return () => clearInterval(timer);
  });
</script>

<div class="workbench" data-testid="app" data-ready={routeInstalled} bind:clientWidth={workbenchWidth} style:grid-template-columns={layout.leftOpen ? `${leftWidth}px 1px minmax(0, 1fr)` : "minmax(0, 1fr)"}>
  {#if layout.leftOpen}
    <div class="left"><Sidebar /></div>
    <Splitter axis="x" label="Resize sidebar" value={leftWidth} min={200} max={leftMax} onmove={(d) => (layout.left = clamp(leftWidth + d, 200, leftMax))} onend={saveLayout} />
  {/if}
  <main>
    {#if serverMode}<ServerConnection />{/if}
    <div class="workbench-body">
    <div class="top">
      <div class="center" data-testid="workbench-center">
        {#if app.view.kind === "library"}
          <SessionLibrary />
        {:else if app.view.kind === "attention"}
          <AttentionInbox />
        {:else if app.view.kind === "actions"}
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
        <Splitter axis="x" label="Resize side panel" value={rightWidth} min={220} max={rightMax} onmove={(d) => (layout.right = clamp(rightWidth - d, 220, rightMax))} onend={saveLayout} />
        <div class="right" data-testid="workbench-side" style:width="{rightWidth}px"><RightPanel {session} /></div>
      {/if}
    </div>
    {#if session && app.view.kind === "session" && layout.bottomOpen}
      <BottomTerminal {session} />
    {/if}
    </div>
  </main>
</div>

{#if folderPicker.open}<ServerFolderPicker />{/if}

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
  .workbench-body { flex: 1; min-height: 0; display: flex; flex-direction: column; }
  .top { flex: 1; min-height: 0; display: flex; }
  .center { flex: 1; min-width: 0; min-height: 0; }
  .right { flex: none; min-width: 0; min-height: 0; }
</style>
