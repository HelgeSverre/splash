<script lang="ts">
  import { onDestroy } from "svelte";
  import { api, type ExternalSession, type HistoryPage, type SessionMatch, type SessionPreview } from "../bindings";
  import { app, agentById, projectById, openSession, applySession } from "../lib/sessions.svelte";
  import { home } from "../lib/paths";
  import { errorMessage, statusLabel } from "../lib/format";
  import EntryView from "./entries/Entry.svelte";
  import AgentIcon from "./AgentIcon.svelte";
  import EmptyState from "./ui/EmptyState.svelte";
  import Tabs from "./ui/Tabs.svelte";

  let tab = $state("saved");
  let query = $state("");
  let project = $state("");
  let agentFilter = $state("");
  let filterStatus = $state("all");
  let matches = $state<SessionMatch[]>([]);
  let searching = $state(false);
  let searchError = $state("");
  let searchVersion = 0;
  let alive = true;
  onDestroy(() => { alive = false; searchVersion++; });

  $effect(() => {
    const text = query.trim();
    const version = ++searchVersion;
    matches = [];
    searchError = "";
    searching = !!text;
    const timer = setTimeout(async () => {
      if (!text) return;
      try {
        const found = await api.search_sessions(text);
        if (alive && version === searchVersion) matches = found;
      } catch (e) { if (alive && version === searchVersion) searchError = errorMessage(e); }
      finally { if (alive && version === searchVersion) searching = false; }
    }, 250);
    return () => clearTimeout(timer);
  });
  const matchById = $derived(new Map(matches.map((m) => [m.session_id, m])));
  const saved = $derived(app.sessions.filter((s) =>
    (!project || s.project_id === project) && (!agentFilter || s.agent_id === agentFilter) &&
    (filterStatus === "all" || (filterStatus === "archived" ? s.archived : filterStatus === "active" ? !s.archived : !s.archived && (s.status === filterStatus || (filterStatus === "error" && s.attention?.kind === "failed") || (filterStatus === "awaiting_permission" && s.attention?.kind === "permission")))) &&
    (!query.trim() || `${s.title} ${s.cwd} ${s.agent_id}`.toLowerCase().includes(query.trim().toLowerCase()) || matchById.has(s.id))
  ).toSorted((a, b) => b.updated_at - a.updated_at));

  let agent = $state("");
  let cwd = $state("");
  let knownId = $state("");
  let page = $state<HistoryPage | null>(null);
  let external = $state<ExternalSession[]>([]);
  let preview = $state<SessionPreview | null>(null);
  let busy = $state("");
  let error = $state("");
  const available = $derived(app.agents.filter((a) => a.installed));
  $effect(() => { if (!agent && available.length) agent = available[0].id; });
  $effect(() => { if (!cwd && app.projects.length) cwd = app.projects[0].path; });

  function resetSource() { page = null; external = []; preview = null; error = ""; }
  async function discover(more = false) {
    if (busy) return;
    error = ""; busy = "Discovering sessions…";
    if (!more) { external = []; page = null; preview = null; }
    try {
      const result = await api.discover_sessions(agent, cwd, more ? page?.next_cursor ?? null : null);
      if (!alive) return;
      const seen = new Set(external.map((s) => s.session_id));
      external = [...external, ...result.sessions.filter((s) => !seen.has(s.session_id))];
      page = result;
    } catch (e) { if (alive) error = errorMessage(e); }
    finally { if (alive) busy = ""; }
  }
  async function load(id: string, directory: string) {
    if (busy) return;
    busy = "Loading saved conversation…"; error = ""; preview = null;
    try { const result = await api.preview_session(agent, directory, id); if (alive) preview = result; }
    catch (e) { if (alive) error = errorMessage(e); }
    finally { if (alive) busy = ""; }
  }
  async function add() {
    if (!preview || busy) return;
    busy = "Adding conversation…"; error = "";
    try {
      const session = await api.import_session(preview.token);
      applySession(session);
      if (alive) await openSession(session.id);
    } catch (e) { if (alive) error = errorMessage(e); }
    finally { if (alive) busy = ""; }
  }
  const date = (seconds: number) => new Date(seconds * 1000).toLocaleString();
</script>

<div class="library">
  <header><div><h1>Sessions</h1><p>Find a conversation and pick up where you left off.</p></div><button class="btn" onclick={() => app.newSession = {}}>New session</button></header>
  <Tabs items={[{ id: "saved", label: "In Splash", count: app.sessions.length }, { id: "external", label: "Open from agent" }]} active={tab} prefix="library" label="Session sources" onselect={(id) => tab = id} />
  <div class="content" role="tabpanel" id="library-panel-{tab}" aria-labelledby="library-tab-{tab}">
    {#if tab === "saved"}
      <div class="filters">
        <label class="search">Search conversations<input class="field" type="search" bind:value={query} placeholder="Title, folder, or words in the transcript" /></label>
        <label>Project<select class="field" bind:value={project}><option value="">All projects</option>{#each app.projects as p}<option value={p.id}>{p.name}</option>{/each}</select></label>
        <label>Agent<select class="field" bind:value={agentFilter}><option value="">All agents</option>{#each app.agents as a}<option value={a.id}>{a.name}</option>{/each}</select></label>
        <label>Status<select class="field" bind:value={filterStatus}><option value="all">All sessions</option><option value="active">Not archived</option><option value="archived">Archived</option><option value="running">Running</option><option value="awaiting_permission">Needs permission</option><option value="error">Failed</option></select></label>
      </div>
      <p class="summary" role="status">{searching ? "Searching transcripts…" : `${saved.length} conversations`}{matches.length === 200 ? " · Showing up to 200 transcript matches. Refine your search for more." : ""}</p>
      {#if searchError}<p class="err" role="alert">{searchError}</p>{/if}
      <div class="results">
        {#each saved as s (s.id)}
          {@const match = matchById.get(s.id)}
          <button class="plain session-row" onclick={() => openSession(s.id, match?.entry_index)}>
            <AgentIcon id={s.agent_id} size={20} />
            <span class="row-body"><strong>{s.title}</strong><span class="meta">{projectById(s.project_id)?.name} · {agentById(s.agent_id)?.name ?? s.agent_id} · {s.archived ? "Archived" : statusLabel(s.status)}{s.external ? " · Imported" : ""}</span>{#if match}<span class="excerpt">{match.excerpt}</span>{/if}</span>
            <time datetime={new Date(s.updated_at * 1000).toISOString()}>{date(s.updated_at)}</time>
          </button>
        {:else}<EmptyState inline title={query ? "No matching conversations" : "No saved conversations"} detail="Open an existing conversation from an agent, or start a new session." />{/each}
      </div>
    {:else}
      <fieldset disabled={!!busy}>
        <legend>Choose an agent and the conversation’s original folder</legend>
        <form onsubmit={(e) => { e.preventDefault(); discover(); }}>
          <div class="filters">
            <label>Agent<select class="field" required bind:value={agent} onchange={resetSource}><option value="" disabled>Choose an installed agent</option>{#each available as a}<option value={a.id}>{a.name}</option>{/each}</select></label>
            <label>Project<select class="field" value="" onchange={(e) => { if (e.currentTarget.value) { cwd = e.currentTarget.value; resetSource(); } }}><option value="">Choose a folder…</option>{#each app.projects as p}<option value={p.path}>{p.name}</option>{/each}</select></label>
            <label class="search">Working directory<input class="field" required bind:value={cwd} oninput={resetSource} placeholder="/absolute/path/to/project" /></label>
            <button class="btn primary align-end" type="submit">Find sessions</button>
          </div>
        </form>
        <form class="known" onsubmit={(e) => { e.preventDefault(); load(knownId.trim(), cwd); }}>
          <label>Open by session ID<input class="field" required bind:value={knownId} placeholder="For agents without session listing" /></label>
          <button class="btn align-end" type="submit" disabled={!agent || !cwd || page?.capabilities.load === false}>Preview by ID</button>
        </form>
      </fieldset>
      <p class="summary">History is loaded through the selected agent. Previewing sends no prompt; availability depends on that agent’s saved sessions.</p>
      {#if !available.length}<p class="summary">Install an agent and refresh it in Settings to browse its conversations.</p>{/if}
      {#if busy}<p class="summary" role="status"><span class="spinner"></span> {busy}</p>{/if}
      {#if error}<p class="err error" role="alert">{error}</p>{/if}
      {#if page && !page.capabilities.list}<p class="summary">This agent does not offer session listing. {page.capabilities.load ? "Use a known session ID to preview its history." : "It does not support loading saved history either."}</p>{/if}
      {#if page && !page.capabilities.load && page.capabilities.list}<p class="summary">This agent lists conversations but cannot replay their history.</p>{/if}
      <div class="external-grid">
        <div class="results external-results">
          {#each external as s (s.session_id)}
            <button class="plain session-row" disabled={!!busy || !page?.capabilities.load} aria-pressed={preview?.session_id === s.session_id} onclick={() => load(s.session_id, s.cwd)}>
              <span class="row-body"><strong>{s.title ?? s.session_id}</strong><span class="meta">{home(s.cwd)}</span>{#if s.updated_at}<span class="meta">{s.updated_at}</span>{/if}</span>
            </button>
          {:else}{#if page?.capabilities.list && !busy}<EmptyState inline title="No sessions returned" detail="Try the original folder or a known session ID." />{/if}{/each}
          {#if page?.next_cursor}<button class="btn" disabled={!!busy} onclick={() => discover(true)}>Load more sessions</button>{/if}
        </div>
        {#if preview}
          <article class="preview">
            <div class="preview-head"><div><h2>{preview.title}</h2><p class="meta">{home(preview.cwd)} · {preview.entries.length} entries</p></div><button class="btn primary" disabled={!!busy} onclick={add}>Add to Splash</button></div>
            <p class="summary">Add this conversation to keep a local copy and continue it. Its original folder and history stay with the agent.</p>
            {#each preview.entries as entry, i (i)}<EntryView {entry} session={{ id: preview.token, cwd: preview.cwd, status: "exited" }} />{:else}<p class="summary">The agent returned no transcript entries.</p>{/each}
          </article>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .library { height: 100%; display: flex; flex-direction: column; min-width: 0; }
  header { display: flex; align-items: center; justify-content: space-between; padding: 22px 28px; gap: 16px; border-bottom: 1px solid var(--border); }
  h1 { font-size: var(--fs-xl); margin: 0 0 5px; } h2 { font-size: var(--fs-lg); margin: 0; }
  p { margin: 0; color: var(--muted); } .content { flex: 1; overflow: auto; padding: 22px 28px; }
  .filters { display: flex; gap: 12px; flex-wrap: wrap; align-items: end; }
  label { display: flex; flex-direction: column; gap: 6px; color: var(--text-2); font-size: var(--fs-sm); }
  .search { flex: 1; min-width: 200px; } .align-end { align-self: end; }
  .summary { display: flex; align-items: center; gap: 8px; margin: 14px 0; font-size: var(--fs-sm); }
  .results { border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  .session-row { display: flex; width: 100%; align-items: center; gap: 14px; text-align: left; padding: 14px; border-bottom: 1px solid var(--border); }
  .session-row:last-child { border-bottom: 0; } .session-row:is(:hover, :focus-visible):not(:disabled), .session-row[aria-pressed="true"] { background: var(--row-hover); }
  .row-body { flex: 1; display: flex; flex-direction: column; min-width: 0; gap: 5px; }
  strong { font-weight: var(--fw-medium); overflow-wrap: anywhere; } .meta, time { color: var(--muted); font-size: var(--fs-xs); overflow-wrap: anywhere; } time { flex: none; }
  .excerpt { font-size: var(--fs-sm); color: var(--text-2); overflow-wrap: anywhere; }
  fieldset { border: 0; padding: 0; margin: 0; min-width: 0; } legend { margin-bottom: 14px; color: var(--text-2); }
  .known { display: flex; gap: 12px; margin-top: 14px; } .known label { flex: 1; }
  .external-grid { display: grid; grid-template-columns: minmax(220px, 1fr) minmax(0, 2fr); gap: 20px; align-items: start; }
  .external-results { max-height: 65vh; overflow: auto; } .external-results:empty { display: none; }
  .preview { min-width: 0; padding: 20px; border: 1px solid var(--border); border-radius: var(--radius); }
  .preview-head { display: flex; gap: 14px; align-items: start; justify-content: space-between; }
  .preview-head .btn { flex: none; } .err { color: var(--del-fg); } .error { white-space: pre-wrap; }
  @media (max-width: 1000px) { .external-grid { grid-template-columns: minmax(0, 1fr); } time { display: none; } }
</style>
