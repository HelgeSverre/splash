<script lang="ts">
  import { registerCommands, openCommandPalette } from "@elyra/runtime";
  import Sidebar from "./components/Sidebar.svelte";
  import SessionView from "./components/SessionView.svelte";
  import Settings from "./components/settings/Settings.svelte";
  import NewSession from "./components/NewSession.svelte";
  import Welcome from "./components/Welcome.svelte";
  import RightPanel from "./components/RightPanel.svelte";
  import TerminalPane, { focusTerminal } from "./components/TerminalPane.svelte";
  import Splitter from "./components/Splitter.svelte";
  import DocPreview from "./components/DocPreview.svelte";
  import IconButton from "./components/ui/IconButton.svelte";
  import Icon from "./components/Icon.svelte";
  import { api } from "./bindings";
  import { preview, app, layout, saveLayout, loadAll, currentSession, currentId, openSession, orderedSessions, showError, openSettings, sessionTabs, closeTab } from "./lib/state.svelte";
  import { installKeybindings, onAction, shortcut } from "./lib/keybindings.svelte";

  loadAll().catch(showError);

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

  export function toggleRight() {
    layout.rightOpen = !layout.rightOpen;
    saveLayout();
  }
  export function toggleBottom() {
    layout.bottomOpen = !layout.bottomOpen;
    saveLayout();
    if (layout.bottomOpen && sessionId) setTimeout(() => focusTerminal(sessionId), 50);
  }
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

  function toggleLeft() {
    layout.leftOpen = !layout.leftOpen;
    saveLayout();
  }

  function cycleSession(step: number) {
    const list = orderedSessions();
    if (!list.length) return false;
    const i = list.findIndex((s) => s.id === currentId());
    openSession(list[(i + step + list.length) % list.length].id);
  }

  // Everything a shortcut can do. Bindings live in lib/keybindings (rebindable
  // in Settings → Keyboard shortcuts); a handler returning false lets the key through.
  installKeybindings();
  onAction("session.new", () => void (app.newSession = {}));
  onAction("session.stop", () => {
    if (!session || (session.status !== "running" && session.status !== "awaiting_permission")) return false;
    api.cancel(session.id).catch(showError);
  });
  onAction("session.next", () => cycleSession(1));
  onAction("session.prev", () => cycleSession(-1));
  for (let n = 1; n <= 9; n++) {
    onAction(`session.go${n}`, () => {
      const s = orderedSessions()[n - 1];
      if (!s) return false;
      openSession(s.id);
    });
  }
  onAction("composer.focus", () => {
    const box = document.querySelector<HTMLTextAreaElement>(".composer textarea");
    if (!box) return false;
    box.focus();
  });
  onAction("view.left", toggleLeft);
  onAction("view.right", () => (session ? toggleRight() : false));
  onAction("view.terminal", () => (session ? toggleBottom() : false));
  onAction("tab.close", () => {
    const id = currentId();
    if (!id) return false;
    const t = sessionTabs(id);
    if (t.list[t.active]?.kind === "chat") return false;
    closeTab(t.active);
  });
  onAction("app.palette", () => openCommandPalette());
  onAction("app.settings", () => void (app.settings ? (app.settings = null) : openSettings()));

  $effect(() => {
    registerCommands([
      { id: "new", title: "New session", subtitle: shortcut("session.new"), action: () => (app.newSession = {}) },
      { id: "settings", title: "Settings", subtitle: shortcut("app.settings"), action: () => openSettings() },
      { id: "agents", title: "Agents", subtitle: "Settings", action: () => openSettings("agents") },
      { id: "shortcuts", title: "Keyboard shortcuts", subtitle: "Settings", action: () => openSettings("shortcuts") },
      { id: "terminal", title: "Toggle terminal", subtitle: shortcut("view.terminal"), action: () => session && toggleBottom() },
      { id: "panel", title: "Toggle changes, files & details", subtitle: shortcut("view.right"), action: () => session && toggleRight() },
      { id: "sidebar", title: "Toggle sidebar", subtitle: shortcut("view.left"), action: toggleLeft },
      ...app.sessions
        .filter((s) => !s.archived)
        .map((s) => ({
          id: `open:${s.id}`,
          title: s.title,
          subtitle: `${app.projects.find((p) => p.id === s.project_id)?.name ?? ""} · ${s.agent_id}`,
          action: () => openSession(s.id),
        })),
    ]);
  });
</script>

<div class="workbench" style:grid-template-columns={layout.leftOpen ? `${layout.left}px 1px minmax(0, 1fr)` : "minmax(0, 1fr)"}>
  {#if layout.leftOpen}
    <div class="left"><Sidebar /></div>
    <Splitter axis="x" onmove={(d) => (layout.left = clamp(layout.left + d, 200, 420))} onend={saveLayout} />
  {/if}
  <main>
    <div class="top">
      <div class="center">
        {#if app.view.kind === "session" && session}
          {#key session.id}
            <SessionView {session} ontoggleright={toggleRight} ontogglebottom={toggleBottom} />
          {/key}
        {:else}
          <Welcome />
        {/if}
      </div>
      {#if session && app.view.kind === "session" && layout.rightOpen}
        <Splitter axis="x" onmove={(d) => (layout.right = clamp(layout.right - d, 220, 720))} onend={saveLayout} />
        <div class="right" style:width="{layout.right}px"><RightPanel {session} /></div>
      {/if}
    </div>
    {#if session && app.view.kind === "session" && layout.bottomOpen}
      <Splitter axis="y" onmove={(d) => (layout.bottom = clamp(layout.bottom - d, 100, window.innerHeight - 200))} onend={saveLayout} />
      <div class="bottom" style:height="{layout.bottom}px">
        <div class="bottom-bar">
          <span>Terminal</span>
          <span class="path">{session.cwd.replace(/^\/Users\/[^/]+/, "~")}</span>
          <span class="spacer"></span>
          <IconButton title="Restart the shell" size={22} onclick={() => api.term_close(session.id).then(() => { layout.bottomOpen = false; setTimeout(() => (layout.bottomOpen = true), 30); })}>
            <Icon name="refresh" size={13} />
          </IconButton>
          <IconButton title="Hide ({shortcut('view.terminal')})" size={22} onclick={toggleBottom}>
            <Icon name="close" size={12} />
          </IconButton>
        </div>
        <div class="bottom-body"><TerminalPane session={session.id} /></div>
      </div>
    {/if}
  </main>
</div>

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
  .bottom { flex: none; display: flex; flex-direction: column; min-height: 0; background: var(--term-bg); }
  .bottom-bar { display: flex; align-items: center; gap: 10px; height: 28px; padding: 0 8px 0 14px; border-bottom: 1px solid var(--border); font-size: 12px; color: var(--text-2); flex: none; }
  .bottom-bar .path { font: 11px var(--font-mono); color: var(--muted); }
  .bottom-bar .spacer { flex: 1; }
  .bottom-body { flex: 1; min-height: 0; position: relative; }
</style>
