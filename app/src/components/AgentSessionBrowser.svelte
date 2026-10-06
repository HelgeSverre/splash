<script lang="ts">
  import { onDestroy } from "svelte";
  import { api, type ExternalSession, type SessionPreview } from "../bindings";
  import { app, agentById, applySession, openSession } from "../lib/sessions.svelte";
  import { historySources, sourceKey, loadSource } from "../lib/agent-history.svelte";
  import { foldersFromText, sourceIsNewer } from "../lib/session-history";
  import { errorMessage } from "../lib/format";
  import { home } from "../lib/paths";
  import AgentIcon from "./AgentIcon.svelte";
  import EmptyState from "./ui/EmptyState.svelte";
  import EntryView from "./entries/Entry.svelte";
  import Tag from "./ui/Tag.svelte";

  let agent = $state("");
  let folder = $state("");
  let cwd = $state("");
  let query = $state("");
  let sort = $state("recent");
  let since = $state("all");
  let knownAgent = $state("");
  let knownId = $state("");
  let knownCwd = $state("");
  let knownRoots = $state("");
  let preview = $state<SessionPreview | null>(null);
  let busy = $state("");
  let error = $state("");
  let version = 0;
  let alive = true;
  onDestroy(() => { alive = false; version++; });
  const available = $derived(app.agents.filter((a) => a.installed));
  const selected = $derived(available.filter((a) => !agent || a.id === agent));
  const directory = $derived(folder === "all" || !folder ? "" : folder === "custom" ? cwd.trim() : folder);
  const sources = $derived(selected.map((a) => ({ agent: a, key: sourceKey(a.id, a.extra_args, directory) })));
  const loading = $derived(sources.some((s) => historySources[s.key]?.loading));
  const loaded = $derived(sources.some((s) => historySources[s.key]?.page));
  const rows = $derived.by(() => {
    const cutoff = since === "all" ? 0 : Date.now() - Number(since) * 86400000;
    const term = query.trim().toLowerCase();
    return sources.flatMap(({ agent, key }) => (historySources[key]?.sessions ?? []).map((info) => ({ agent, key, info })))
      .filter(({ agent, info }) => (!term || `${info.title ?? ""} ${info.session_id} ${info.cwd} ${(info.additional_directories ?? []).join(" ")} ${agent.name}`.toLowerCase().includes(term)) &&
        (!cutoff || (info.updated_at && Date.parse(info.updated_at) >= cutoff)))
      .toSorted((a,b) => sort === "title" ? (a.info.title ?? a.info.session_id).localeCompare(b.info.title ?? b.info.session_id) : sort === "agent" ? a.agent.name.localeCompare(b.agent.name) :
        (Date.parse(b.info.updated_at ?? "") || 0) - (Date.parse(a.info.updated_at ?? "") || 0));
  });
  const existing = $derived(preview ? app.sessions.find((s) => s.agent_id === preview?.agent_id && s.agent_session_id === preview?.session_id && (!s.launch_args || s.launch_args === agentById(s.agent_id)?.extra_args)) : undefined);
  $effect(() => { if (!knownAgent && available.length) knownAgent = available[0].id; });
  $effect(() => { if (!knownCwd && app.projects.length) knownCwd = app.projects[0].path; });
  function clearPreview() { version++; preview = null; busy = ""; error = ""; }
  async function discover(refresh = false) {
    const pending = [...sources];
    const scope = directory;
    // Bound expensive adapter launches, while each result renders independently.
    await Promise.all(Array.from({ length: Math.min(3, pending.length) }, async () => {
      while (pending.length) {
        const source = pending.shift()!;
        await loadSource(source.key, source.agent.id, scope, false, refresh);
      }
    }));
  }
  async function load(agentId: string, info: ExternalSession) {
    if (busy) return;
    const request = ++version;
    busy = "Loading saved conversation…"; error = ""; preview = null;
    try { const result = await api.preview_session(agentId, info); if (alive && request === version) preview = result; }
    catch (e) { if (alive && request === version) error = errorMessage(e); }
    finally { if (alive && request === version) busy = ""; }
  }
  async function add() {
    if (!preview || busy) return;
    busy = "Saving local copy…"; error = "";
    try { const session = await api.import_session(preview.token); applySession(session); if (alive) await openSession(session.id); }
    catch (e) { if (alive) error = errorMessage(e); }
    finally { if (alive) busy = ""; }
  }
  const when = (value: string) => Number.isFinite(Date.parse(value)) ? new Date(value).toLocaleString() : value;
</script>

<form onsubmit={(e) => { e.preventDefault(); discover(); }}>
  <div class="filters">
    <label>Agent<select class="field" bind:value={agent} onchange={clearPreview}><option value="">All installed agents</option>{#each available as a}<option value={a.id}>{a.name}</option>{/each}</select></label>
    <label>Folders<select class="field" bind:value={folder} onchange={clearPreview}><option value="">All folders</option>{#each app.projects as p}<option value={p.path}>{p.name}</option>{/each}<option value="custom">Choose another folder</option></select></label>
    {#if folder === "custom"}<label class="grow">Working directory<input class="field" required bind:value={cwd} oninput={clearPreview} placeholder="/absolute/path/to/project" /></label>{/if}
    <button class="btn primary" disabled={loading || !available.length || (folder === "custom" && !cwd.trim())}>Find sessions</button>
    {#if loaded}<button class="btn" type="button" disabled={loading} onclick={() => discover(true)}>Refresh lists</button>{/if}
  </div>
</form>
<p class="summary">Browse saved conversations across your agents. Preview a conversation before adding its history and workspace folders.</p>
{#if !available.length}<EmptyState inline title="No installed agents" detail="Install an agent and refresh it in Settings to browse its conversations." />{/if}
<div class="sources" aria-label="Agent discovery status">
  {#each sources as s (s.key)}
    {@const state = historySources[s.key]}
    {#if state}
      <div class="source">
        <AgentIcon id={s.agent.id} size={16} /><strong>{s.agent.name}</strong>
        <span class="meta" role="status">{state.loading ? "Finding sessions…" : state.error ? "Could not finish" : state.page?.capabilities.list ? `${state.sessions.length} loaded` : "Listing unavailable"}</span>
        {#if state.fetchedAt}<span class="meta">Checked {new Date(state.fetchedAt).toLocaleTimeString()}</span>{/if}
        {#if state.page && !state.page.capabilities.load}<Tag tone="muted">Preview unavailable</Tag>{/if}
        {#if state.error}<button class="btn sm" disabled={state.loading} onclick={() => loadSource(s.key, s.agent.id, directory, !!state.page?.next_cursor, !state.page)}>Retry</button>{/if}
        {#if state.page?.next_cursor}<button class="btn sm" disabled={state.loading} onclick={() => loadSource(s.key, s.agent.id, directory, true)}>Load more from {s.agent.name}</button>{/if}
        {#if state.error}<p class="error" role="alert">{state.error}</p>{/if}
      </div>
    {/if}
  {/each}
</div>
{#if loaded}
  <div class="filters search-bar">
    <label class="grow">Search loaded sessions<input class="field" type="search" bind:value={query} placeholder="Title, agent, session ID, or folder" /></label>
    <label>Activity<select class="field" bind:value={since}><option value="all">Any time</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option></select></label>
    <label>Sort<select class="field" bind:value={sort}><option value="recent">Most recent</option><option value="title">Title</option><option value="agent">Agent</option></select></label>
  </div>
  <p class="summary" role="status">{rows.length} loaded sessions match. Search and sorting apply to the pages loaded so far.</p>
{/if}
{#if busy}<p class="summary" role="status"><span class="spinner"></span>{busy}</p>{/if}
{#if error}<p class="error" role="alert">{error}</p>{/if}
<div class="external-grid" class:has-preview={!!preview}>
  <div class="results">
    {#each rows as row (`${row.agent.id}:${row.info.session_id}`)}
      {@const s = row.info}
      {@const local = app.sessions.find((x) => x.agent_id === row.agent.id && x.agent_session_id === s.session_id)}
      <button class="plain session-row" disabled={!!busy || !historySources[row.key]?.page?.capabilities.load} aria-pressed={preview?.agent_id === row.agent.id && preview?.session_id === s.session_id} onclick={() => load(row.agent.id, s)}>
        <AgentIcon id={row.agent.id} size={20} />
        <span class="row-body"><strong>{s.title || s.session_id}</strong><span class="meta">{row.agent.name} · {home(s.cwd)}</span>
          {#if (s.additional_directories ?? []).length}<span class="meta">+{(s.additional_directories ?? []).length} workspace {(s.additional_directories ?? []).length === 1 ? "folder" : "folders"}</span>{/if}
          {#if s.updated_at}<span class="meta">{when(s.updated_at)}</span>{/if}
        </span>
        {#if local}<Tag tone={sourceIsNewer(local.source) ? "warn" : "muted"}>{sourceIsNewer(local.source) ? "New activity" : "In Splash"}</Tag>{/if}
      </button>
    {:else}{#if loaded}<EmptyState inline title="No matching sessions" detail="Try another agent or folder, load another page, or open a known session ID." />{/if}{/each}
  </div>
  {#if preview}
    <article class="preview">
      <div class="preview-head"><div><h2>{preview.title}</h2><p class="meta">{agentById(preview.agent_id)?.name} · {preview.entries.length} entries</p></div><button class="btn primary" disabled={!!busy || (!!existing && !["exited", "error"].includes(existing.status))} onclick={add}>{existing ? "Update local copy" : "Add to Splash"}</button></div>
      <div class="workspace"><strong>Workspace folders</strong><p>{home(preview.cwd)}</p>{#each preview.additional_directories as path}<p>{home(path)}</p>{/each}</div>
      {#if preview.source.updated_at}<p class="summary">Agent activity: {when(preview.source.updated_at)}</p>{/if}
      <p class="summary">{existing ? "Updating replaces the local transcript with this replay. Disconnect the conversation first." : "Adding keeps a local copy. The conversation and its folders remain with the agent."}</p>
      {#each preview.entries as entry, i (i)}<EntryView {entry} session={{ id: preview.token, cwd: preview.cwd, status: "exited" }} />{:else}<p class="summary">The agent returned no transcript entries.</p>{/each}
    </article>
  {/if}
</div>
<details class="known">
  <summary>Open a known session ID</summary>
  <form onsubmit={(e) => { e.preventDefault(); load(knownAgent, { session_id: knownId.trim(), cwd: knownCwd.trim(), additional_directories: foldersFromText(knownRoots), title: null, updated_at: null, metadata_json: null }); }}>
    <div class="filters">
      <label>Agent<select class="field" required bind:value={knownAgent}>{#each available as a}<option value={a.id}>{a.name}</option>{/each}</select></label>
      <label class="grow">Session ID<input class="field" required bind:value={knownId} placeholder="Native conversation ID" /></label>
      <label class="grow">Original working directory<input class="field" required bind:value={knownCwd} placeholder="/absolute/path/to/project" /></label>
    </div>
    <label>Additional workspace folders (one per line)<textarea class="field" rows="2" bind:value={knownRoots} placeholder="/absolute/path/to/shared-library"></textarea></label>
    <button class="btn" disabled={!!busy || !knownAgent}>Preview by ID</button>
  </form>
</details>

<style>
  .filters { display: flex; gap: 12px; flex-wrap: wrap; align-items: end; }
  label { display: flex; flex-direction: column; gap: 6px; color: var(--text-2); font-size: var(--fs-sm); }
  .grow { flex: 1; min-width: 190px; } .summary { display: flex; align-items: center; gap: 8px; margin: 14px 0; color: var(--muted); font-size: var(--fs-sm); }
  .sources { display: grid; gap: 6px; } .source { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; border: 1px solid var(--border); border-radius: var(--radius); padding: 10px 12px; font-size: var(--fs-sm); }
  .source .error { flex-basis: 100%; } .search-bar { margin-top: 18px; }
  .external-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 20px; align-items: start; }
  .external-grid.has-preview { grid-template-columns: minmax(240px, 1fr) minmax(0, 1.6fr); }
  .results { border: 1px solid var(--border); border-radius: var(--radius); overflow: auto; max-height: 65vh; } .results:empty { display: none; }
  .session-row { display: flex; width: 100%; align-items: center; gap: 12px; text-align: left; padding: 14px; border-bottom: 1px solid var(--border); }
  .session-row:last-child { border-bottom: 0; } .session-row:is(:hover, :focus-visible):not(:disabled), .session-row[aria-pressed="true"] { background: var(--row-hover); }
  .row-body { flex: 1; display: flex; flex-direction: column; min-width: 0; gap: 5px; } strong { font-weight: var(--fw-medium); overflow-wrap: anywhere; }
  .meta { color: var(--muted); font-size: var(--fs-xs); overflow-wrap: anywhere; margin: 4px 0 0; }
  .preview { min-width: 0; padding: 20px; border: 1px solid var(--border); border-radius: var(--radius); }
  .preview-head { display: flex; gap: 14px; align-items: start; justify-content: space-between; } .preview-head .btn { flex: none; } h2 { font-size: var(--fs-lg); margin: 0; }
  .workspace { margin-top: 16px; padding: 12px; background: var(--row-hover); border-radius: var(--radius-sm); font-size: var(--fs-sm); } .workspace p { margin: 6px 0 0; overflow-wrap: anywhere; font-family: var(--font-mono); font-size: var(--fs-xs); }
  .error { color: var(--del-fg); white-space: pre-wrap; overflow-wrap: anywhere; font-size: var(--fs-sm); }
  .known { margin-top: 24px; border-top: 1px solid var(--border); padding-top: 16px; } summary { cursor: pointer; color: var(--text-2); font-size: var(--fs-sm); } .known form { display: grid; gap: 14px; margin-top: 14px; } .known .btn { justify-self: start; }
  @media (max-width: 1000px) { .external-grid.has-preview { grid-template-columns: minmax(0, 1fr); } }
</style>
