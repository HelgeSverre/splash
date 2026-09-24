<script lang="ts">
  import { dialog, contextMenu, confirm } from "@elyra/runtime";
  import AgentIcon from "./AgentIcon.svelte";
  import SplashMark from "./SplashMark.svelte";
  import Icon from "./Icon.svelte";
  import Kbd from "./Kbd.svelte";
  import { shortcut } from "../lib/keybindings.svelte";
  import {
    app,
    addProject,
    removeProject,
    openSession,
    sessionsFor,
    orderedSessions,
    currentId,
    deleteSession,
    showError,
    openSettings,
  } from "../lib/state.svelte";
  import { api } from "../bindings";

  let showArchived: Record<string, boolean> = $state({});


  async function pickFolder() {
    const [dir] = await dialog.open({ directory: true, title: "Add a project folder" });
    if (!dir) return;
    try {
      const p = await addProject(dir);
      app.newSession = { projectId: p.id };
    } catch (e) {
      showError(e);
    }
  }

  function projectMenu(e: MouseEvent, id: string, name: string) {
    contextMenu(e, [
      { label: "New session…", action: () => (app.newSession = { projectId: id }) },
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
        label: "Delete…",
        action: async () => {
          if (await confirm(`Delete "${title}"? The transcript is removed; a worktree is removed too (its branch stays).`, { danger: true, confirmLabel: "Delete" }))
            deleteSession(id).catch(showError);
        },
      },
    ]);
  }

  async function archive(id: string) {
    try {
      await api.archive_session(id, false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg === "dirty") {
        if (await confirm("The worktree has uncommitted changes. Archive anyway and discard them? (The branch is kept.)", { danger: true, confirmLabel: "Discard & archive" }))
          await api.archive_session(id, true).catch(showError);
      } else showError(e);
    }
  }

  const hotkey = (id: string) => {
    const i = orderedSessions().findIndex((s) => s.id === id);
    return i >= 0 && i < 9 ? shortcut(`session.go${i + 1}`).replaceAll(" ", "") : "";
  };
</script>

<aside>
  <div class="brand">
    <SplashMark size={18} />
    <span>splash</span>
    <span class="spacer"></span>
    <button class="plain gear" title="Settings (⌘,)" aria-label="Settings" onclick={() => openSettings()}><Icon name="gear" size={15} /></button>
  </div>

  <div class="section">
    <span>Projects</span>
    <button class="plain icon-btn" title="Add a project folder" onclick={pickFolder}>+</button>
  </div>

  <nav>
    {#each app.projects as p (p.id)}
      {@const sessions = sessionsFor(p.id)}
      {@const archived = sessionsFor(p.id, true)}
      <div class="project">
        <button
          class="plain project-row"
          onclick={() => (app.collapsed[p.id] = !app.collapsed[p.id])}
          oncontextmenu={(e) => projectMenu(e, p.id, p.name)}
          title={p.path}
        >
          <span class="chev" class:open={!app.collapsed[p.id]}>›</span>
          <span class="name">{p.name}</span>
          <span class="add" role="button" tabindex="-1" title="New session"
            onclick={(e) => { e.stopPropagation(); app.newSession = { projectId: p.id }; }}
            onkeydown={() => {}}>+</span>
        </button>
        {#if !app.collapsed[p.id]}
          {#each sessions as s (s.id)}
            <button
              class="plain session"
              class:active={s.id === currentId()}
              onclick={() => openSession(s.id)}
              oncontextmenu={(e) => sessionMenu(e, s.id, s.title, false)}
              title={s.branch ? `${s.title}\n⎇ ${s.branch}` : s.title}
            >
              <span class="dot {app.unread[s.id] && s.status === 'idle' ? 'unread' : s.status}"></span>
              <AgentIcon id={s.agent_id} size={12} />
              <span class="title">{s.title}</span>
              {#if s.status === "awaiting_permission"}<span class="needs">!</span>{/if}
              {#if s.isolation === "worktree"}<span class="wt" title="worktree">⎇</span>{/if}
              <span class="key">{hotkey(s.id)}</span>
            </button>
          {:else}
            <button class="plain session empty" onclick={() => (app.newSession = { projectId: p.id })}>
              <span class="muted">No sessions — start one</span>
            </button>
          {/each}
          {#if archived.length}
            <button class="plain archived-toggle" onclick={() => (showArchived[p.id] = !showArchived[p.id])}>
              {showArchived[p.id] ? "▾" : "▸"} Archived ({archived.length})
            </button>
            {#if showArchived[p.id]}
              {#each archived as s (s.id)}
                <button
                  class="plain session archived"
                  class:active={s.id === currentId()}
                  onclick={() => openSession(s.id)}
                  oncontextmenu={(e) => sessionMenu(e, s.id, s.title, true)}
                >
                  <AgentIcon id={s.agent_id} size={12} />
                  <span class="title">{s.title}</span>
                </button>
              {/each}
            {/if}
          {/if}
        {/if}
      </div>
    {:else}
      <button class="plain empty-projects" onclick={pickFolder}>
        <span>Add a project folder to start</span>
      </button>
    {/each}
  </nav>

  <div class="footer">
    <button class="plain foot-btn" onclick={() => (app.newSession = {})}>
      <span>+ New session</span>{#if shortcut("session.new")}<Kbd keys={shortcut("session.new")} />{/if}
    </button>
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
    padding: 10px 8px 8px 14px; min-height: 44px; font: 600 14px var(--font-mono); letter-spacing: -0.02em;
  }
  .spacer { flex: 1; }
  .gear { width: 28px; height: 28px; display: grid; place-items: center; border-radius: var(--radius); color: var(--muted); }
  .gear:hover { background: var(--hover); color: var(--text); }
  .section {
    display: flex; align-items: center; justify-content: space-between;
    padding: 6px 10px 4px 14px; color: var(--muted); font-size: 11px; font-weight: 500;
  }
  .icon-btn {
    width: 20px; height: 20px; border: 0; border-radius: var(--radius-sm);
    background: transparent; color: var(--muted); cursor: pointer; font-size: 15px; line-height: 1;
  }
  .icon-btn:hover { background: var(--hover); color: var(--text); }
  nav { flex: 1; overflow: auto; padding: 0 6px 8px; }
  .project { margin-bottom: 4px; }
  .project-row {
    display: flex; align-items: center; gap: 6px; width: 100%;
    padding: 5px 8px; border-radius: var(--radius); color: var(--text-2); font-weight: 500;
  }
  .project-row:hover { background: var(--hover); color: var(--text); }
  .chev { width: 10px; color: var(--muted); transition: transform 0.12s; display: inline-block; }
  .chev.open { transform: rotate(90deg); }
  .project-row .name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .add { opacity: 0; color: var(--muted); padding: 0 4px; border-radius: var(--radius-sm); font-size: 14px; }
  .project-row:hover .add { opacity: 1; }
  .add:hover { color: var(--text); background: var(--raised); }
  .session {
    display: flex; align-items: center; gap: 8px; width: 100%;
    padding: 4px 8px 4px 22px; border-radius: var(--radius); color: var(--text-2);
  }
  .session:hover { background: var(--hover); color: var(--text); }
  .session.active { background: var(--raised); color: var(--text); }
  .session .title { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .session.archived { color: var(--muted); }
  .session.empty { color: var(--muted); font-size: 12px; }
  .needs { color: var(--accent); font-weight: 700; font-family: var(--font-mono); }
  .wt { color: var(--muted); font-size: 11px; }
  .key { color: var(--faint); font: 500 10.5px var(--font-keys); min-width: 20px; text-align: right; }
  .archived-toggle { padding: 3px 8px 3px 22px; color: var(--muted); font-size: 11px; }
  .archived-toggle:hover { color: var(--text-2); }
  .muted { color: var(--muted); }
  .empty-projects {
    display: block; margin: 8px; padding: 14px; text-align: center; color: var(--muted);
    border: 1px dashed var(--border-strong); border-radius: var(--radius);
  }
  .empty-projects:hover { color: var(--text); border-color: var(--muted); }
  .footer { border-top: 1px solid var(--border); padding: 6px; display: flex; flex-direction: column; gap: 1px; }
  .foot-btn {
    display: flex; align-items: center; justify-content: space-between;
    padding: 6px 8px; border-radius: var(--radius); color: var(--text-2);
  }
  .foot-btn:hover, .foot-btn.active { background: var(--hover); color: var(--text); }
  .count { font: 11px var(--font-mono); color: var(--muted); }
</style>
