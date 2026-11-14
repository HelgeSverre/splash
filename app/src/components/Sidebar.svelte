<script lang="ts">
  import { contextMenu, confirm } from "@elyra/runtime";
  import { openGithub, openActions, openLibrary, openAttention } from "../lib/route.svelte";
  import AgentIcon from "./AgentIcon.svelte";
  import SplashMark from "./SplashMark.svelte";
  import Icon from "./Icon.svelte";
  import Kbd from "./Kbd.svelte";
  import IconButton from "./ui/IconButton.svelte";
  import Chevron from "./ui/Chevron.svelte";
  import NavItem from "./ui/NavItem.svelte";
  import AddButton from "./ui/AddButton.svelte";
  import { shortcut, withKey } from "../lib/keybindings.svelte";
  import { errorMessage, statusLabel } from "../lib/format";
  import { app, pickFolder, removeProject, openSession, sessionsFor, orderedSessions, currentId, deleteSession } from "../lib/sessions.svelte";
  import { openSettings } from "../lib/customize.svelte";
  import { showError } from "../lib/system";
  import { api } from "../bindings";
  import { serverUnavailable } from "../lib/server.svelte";
  import { toggleLeft } from "../lib/layout.svelte";

  let showArchived: Record<string, boolean> = $state({});

  async function addFolder() {
    if (serverUnavailable()) return;
    const p = await pickFolder();
    if (p) app.newSession = { projectId: p.id };
  }

  function projectMenu(e: MouseEvent, id: string, name: string) {
    contextMenu(e, [
      { label: "New session…", action: () => void (app.newSession = { projectId: id }) },
      { separator: true },
      {
        label: "Remove project…",
        action: async () => {
          if (await confirm(`Remove ${name} from Splash? Its sessions are deleted; files on disk are untouched.`, { danger: true, confirmLabel: "Remove" }))
            removeProject(id).catch(showError);
        },
      },
    ]);
  }

  function sessionMenu(e: MouseEvent, id: string, title: string, archived: boolean) {
    contextMenu(e, [
      { label: "Open", action: () => openSession(id) },
      ...(archived
        ? []
        : [{ label: "Archive", action: () => archive(id) }]),
      { separator: true },
      {
        label: "Remove local session…",
        action: async () => {
          if (await confirm(`Remove "${title}" from Splash? The local transcript and any owned worktree are removed. The agent’s saved history and Git branch remain.`, { danger: true, confirmLabel: "Delete" }))
            await removeSession(id);
        },
      },
    ]);
  }

  async function removeSession(id: string) {
    try {
      await deleteSession(id);
    } catch (e) {
      if (errorMessage(e) === "dirty") {
        if (await confirm("The worktree has uncommitted changes. Delete anyway and permanently discard them? Keeping the branch does not preserve uncommitted changes.", { danger: true, confirmLabel: "Discard & delete" }))
          await deleteSession(id, true).catch(showError);
      } else showError(e);
    }
  }

  async function archive(id: string) {
    try {
      await api.archive_session(id, false);
    } catch (e) {
      if (errorMessage(e) === "dirty") {
        if (await confirm("The worktree has uncommitted changes. Archive anyway and discard them? (The branch is kept.)", { danger: true, confirmLabel: "Discard & archive" }))
          await api.archive_session(id, true).catch(showError);
      } else showError(e);
    }
  }

  // "Go to session n" follows the list's order, which changes as sessions
  // come and go: the numbers show only while a modifier is held, when they
  // are about to be used.
  let modifier = $state(false);
  const onModifier = (e: KeyboardEvent) => (modifier = e.metaKey || e.ctrlKey || e.altKey);

  const hotkey = (id: string) => {
    const i = orderedSessions().findIndex((s) => s.id === id);
    return i >= 0 && i < 9 ? shortcut(`session.go${i + 1}`).replaceAll(" ", "") : "";
  };
</script>

<svelte:window onkeydown={onModifier} onkeyup={onModifier} onblur={() => (modifier = false)} />

<aside data-testid="sidebar">
  <div class="brand">
    <SplashMark size={18} />
    <span>splash</span>
    <span class="spacer"></span>
    <IconButton data-testid="sidebar-hide" title={withKey("Hide sidebar", "view.left")} label="Hide sidebar" icon="panel-left" onclick={toggleLeft} />
    <IconButton data-testid="sidebar-settings" title={withKey("Settings", "app.settings")} label="Settings" icon="gear" onclick={() => openSettings()} />
  </div>

  <div class="global-nav"><NavItem data-testid="sidebar-library" label="Sessions" active={app.view.kind === "library"} onclick={openLibrary}>{#snippet lead()}<Icon name="list" size={14} />{/snippet}</NavItem>
    <NavItem data-testid="sidebar-attention" label="Needs attention" active={app.view.kind === "attention"} onclick={openAttention}>{#snippet lead()}<Icon name="alert" size={14} />{/snippet}{#snippet trail()}<span class="t-count" data-testid="sidebar-attention-count">{app.sessions.filter((s) => !s.archived && s.attention).length || ""}</span>{/snippet}</NavItem><NavItem data-testid="sidebar-github" label="GitHub" active={app.view.kind === "github"} onclick={openGithub}>
    {#snippet lead()}<Icon name="github" size={14} />{/snippet}
  </NavItem><NavItem data-testid="sidebar-actions" label="Actions" active={app.view.kind === "actions"} onclick={openActions}>{#snippet lead()}<Icon name="activity" size={14}/>{/snippet}</NavItem></div>

  <div class="section t-section">
    <span>Projects</span>
    <IconButton data-testid="sidebar-add-project" title="Add a project folder" label="Add a project folder" size="sm" icon="folder-plus" disabled={serverUnavailable()} onclick={addFolder} />
  </div>

  <nav>
    {#each app.projects as p (p.id)}
      {@const sessions = sessionsFor(p.id)}
      {@const archived = sessionsFor(p.id, true)}
      <div class="project">
        <div class="project-row" data-testid="sidebar-project" data-project-id={p.id} data-path={p.path} oncontextmenu={(e) => projectMenu(e, p.id, p.name)} role="presentation">
          <button
            data-testid="sidebar-project-toggle"
            class="plain project-toggle focus-inset"
            aria-expanded={!app.collapsed[p.id]}
            onclick={() => (app.collapsed[p.id] = !app.collapsed[p.id])}
            title={p.path}
          >
            <Chevron open={!app.collapsed[p.id]} />
            <span class="name truncate">{p.name}</span>
          </button>
          <IconButton data-testid="sidebar-project-new-session" class="add reveal-on-hover" title="New session in {p.name}" size="sm" icon="plus"
            onclick={() => (app.newSession = { projectId: p.id })} />
        </div>
        {#if !app.collapsed[p.id]}
          {#each sessions as s (s.id)}
            <NavItem data-testid="sidebar-session" data-session-id={s.id} data-status={s.status} data-unread={!!app.unread[s.id] && s.status === "idle"}
              label={s.title} indent={24} active={s.id === currentId()} onclick={() => openSession(s.id)}
              oncontextmenu={(e) => sessionMenu(e, s.id, s.title, false)}
              title={`${s.title}\n${statusLabel(s.status)}${s.branch ? ` · ${s.branch}` : ""}`}>
              {#snippet lead()}
                <!-- The agent's mark carries the status: one glyph, not a dot and a glyph. -->
                <span class="agent {app.unread[s.id] && s.status === 'idle' ? 'unread' : s.attention?.kind === 'failed' ? 'error' : s.status}"><AgentIcon id={s.agent_id} size={13} /></span>
              {/snippet}
              {#snippet trail()}
                {#if s.status === "awaiting_permission"}<span class="needs" data-testid="sidebar-session-needs" title="Needs you"><Icon name="alert" size={12} /></span>{/if}
                <span class="key" class:shown={modifier} data-testid="sidebar-session-key">{hotkey(s.id)}</span>
              {/snippet}
            </NavItem>
          {:else}
            <NavItem data-testid="sidebar-no-sessions" label="No sessions yet" indent={24} dense muted onclick={() => (app.newSession = { projectId: p.id })} />
          {/each}
          {#if archived.length}
            <NavItem data-testid="sidebar-archived" label="Archived" indent={24} dense muted expanded={!!showArchived[p.id]} onclick={() => (showArchived[p.id] = !showArchived[p.id])}>
              {#snippet lead()}<Chevron open={!!showArchived[p.id]} />{/snippet}
              {#snippet trail()}<span class="t-count" data-testid="sidebar-archived-count">{archived.length}</span>{/snippet}
            </NavItem>
            {#if showArchived[p.id]}
              {#each archived as s (s.id)}
                <NavItem data-testid="sidebar-session" data-session-id={s.id} data-status={s.status} data-archived label={s.title} indent={24} muted active={s.id === currentId()} onclick={() => openSession(s.id)}
                  oncontextmenu={(e) => sessionMenu(e, s.id, s.title, true)}>
                  {#snippet lead()}<AgentIcon id={s.agent_id} size={12} />{/snippet}
                </NavItem>
              {/each}
            {/if}
          {/if}
        {/if}
      </div>
    {:else}
      <div class="empty-projects"><AddButton data-testid="sidebar-add-project-empty" label="Add a project folder" disabled={serverUnavailable()} onclick={addFolder} /></div>
    {/each}
  </nav>

  <div class="footer">
    <NavItem data-testid="sidebar-new-session" label="New session" onclick={() => (app.newSession = {})}>
      {#snippet lead()}<Icon name="plus" size={12} />{/snippet}
      {#snippet trail()}{#if shortcut("session.new")}<Kbd keys={shortcut("session.new")} />{/if}{/snippet}
    </NavItem>
  </div>
</aside>

<style>
  aside {
    height: 100%; display: flex; flex-direction: column;
    background: var(--surface); border-right: 1px solid var(--border);
    min-width: 0;
  }
  .brand {
    display: flex; align-items: center; gap: 8px;
    height: var(--h-header); padding: 0 8px 0 14px; flex: none; font: var(--fw-semibold) var(--fs-md) var(--font-mono); letter-spacing: var(--tracking-brand);
  }
  .global-nav { padding: 4px 6px 8px; }
  .section {
    display: flex; align-items: center; justify-content: space-between;
    padding: 6px 10px 0 14px;
  }
  /* 4px on top: room for a focus ring on the first row's reveal button. */
  nav { flex: 1; overflow: auto; padding: 4px 6px 8px; }
  .project { margin-bottom: 4px; }
  .project-row {
    display: flex; align-items: center; gap: 2px; width: 100%; padding-right: 4px;
    border-radius: var(--radius); color: var(--text); font-weight: var(--fw-semibold);
  }
  .project-row:is(:hover, :focus-within) { background: var(--row-hover); color: var(--text); }
  .project-toggle { display: flex; align-items: center; gap: 6px; flex: 1; min-width: 0; height: var(--row-h); padding: 0 8px; border-radius: var(--radius); }
  .project-toggle .name { flex: 1; }
  .needs { display: inline-grid; place-items: center; flex: none; color: var(--accent); }
  .agent { display: inline-grid; place-items: center; flex: none; color: var(--muted); }
  .agent.running, .agent.starting { color: var(--accent); animation: pulse 1.4s ease-in-out infinite; }
  .agent.awaiting_permission { color: var(--accent); }
  .agent.unread { color: var(--ok-dim); }
  .agent.error { color: var(--err-dim); }
  .agent.exited { color: var(--faint); }
  @media (prefers-reduced-motion: reduce) { .agent { animation: none; } }
  nav :global([data-unread="true"] .label) { color: var(--text); font-weight: var(--fw-medium); }
  /* The keycap font, bare: a box on every row would be noise. Hidden until a
     modifier is held, so the title keeps the room. */
  .key { display: none; color: var(--muted); font: var(--fw-medium) var(--fs-xs) var(--font-keys); min-width: 20px; text-align: right; }
  .key.shown { display: inline; }
  .empty-projects { margin: 8px 2px; }
  .footer { border-top: 1px solid var(--border); padding: 6px; display: flex; flex-direction: column; gap: 1px; }
</style>
