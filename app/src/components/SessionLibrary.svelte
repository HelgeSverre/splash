<script lang="ts">
  import { onDestroy } from "svelte";
  import { api, type SessionMatch } from "../bindings";
  import { app, agentById, projectById, openSession } from "../lib/sessions.svelte";
  import { ago, errorMessage, statusLabel } from "../lib/format";
  import AgentSessionBrowser from "./AgentSessionBrowser.svelte";
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

  const date = (seconds: number) => new Date(seconds * 1000).toLocaleString();
</script>

<div class="library">
  <header><h1 class="t-page-title">Sessions</h1><button class="btn sm" data-testid="library-new-session" onclick={() => app.newSession = {}}>New session</button></header>
  <Tabs data-testid="library-tabs" items={[{ id: "saved", label: "In Splash", count: app.sessions.length }, { id: "external", label: "Open from agent" }]} active={tab} prefix="library" label="Session sources" onselect={(id) => tab = id} />
  <div class="content" role="tabpanel" id="library-panel-{tab}" aria-labelledby="library-tab-{tab}">
    {#if tab === "saved"}
      <div class="filters">
        <input class="field search" aria-label="Search conversations" data-testid="library-search" type="search" bind:value={query} placeholder="Search titles, folders and transcripts" />
        <select class="field" aria-label="Project" data-testid="library-project" bind:value={project}><option value="">All projects</option>{#each app.projects as p}<option value={p.id}>{p.name}</option>{/each}</select>
        <select class="field" aria-label="Agent" data-testid="library-agent" bind:value={agentFilter}><option value="">All agents</option>{#each app.agents as a}<option value={a.id}>{a.name}</option>{/each}</select>
        <select class="field" aria-label="Status" data-testid="library-status" bind:value={filterStatus}><option value="all">All sessions</option><option value="active">Not archived</option><option value="archived">Archived</option><option value="running">Running</option><option value="awaiting_permission">Needs permission</option><option value="error">Failed</option></select>
      </div>
      <p class="summary" role="status" data-testid="library-summary" data-searching={searching} data-count={saved.length}>{searching ? "Searching transcripts…" : `${saved.length} conversations`}{matches.length === 200 ? " · Showing up to 200 transcript matches. Refine your search for more." : ""}</p>
      {#if searchError}<p class="err" role="alert" data-testid="library-error">{searchError}</p>{/if}
      <div class="results">
        {#each saved as s (s.id)}
          {@const match = matchById.get(s.id)}
          <button class="plain session-row" data-testid="library-session" data-session-id={s.id} data-archived={s.archived} data-entry={match?.entry_index} onclick={() => openSession(s.id, match?.entry_index)}>
            <AgentIcon id={s.agent_id} size={15} />
            <span class="row-body"><span class="line"><strong>{s.title}</strong><span class="meta">{projectById(s.project_id)?.name} · {agentById(s.agent_id)?.name ?? s.agent_id} · {s.archived ? "Archived" : s.status === "exited" && s.attention?.kind === "failed" ? "exited" : statusLabel(s.status)}{s.external ? " · Imported" : ""}</span></span>{#if match}<span class="excerpt" data-testid="library-excerpt">{match.excerpt}</span>{/if}</span>
            <time datetime={new Date(s.updated_at * 1000).toISOString()} title={date(s.updated_at)}>{ago(s.updated_at)}</time>
          </button>
        {:else}<EmptyState data-testid="library-empty" inline title={query ? "No matching conversations" : "No saved conversations"} detail="Open an existing conversation from an agent, or start a new session." />{/each}
      </div>
    {:else}
      <AgentSessionBrowser />
    {/if}
  </div>
</div>

<style>
  .library { height: 100%; display: flex; flex-direction: column; min-width: 0; }
  header { display: flex; align-items: center; justify-content: space-between; height: var(--h-header); padding: 0 28px; gap: 16px; flex: none; }
  p { margin: 0; color: var(--muted); } .content { flex: 1; overflow: auto; padding: 16px 28px 22px; }
  .filters { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
  .search { flex: 1; min-width: 200px; }
  .summary { display: flex; align-items: center; gap: 8px; margin: 8px 0; font-size: var(--fs-sm); }
  .results { border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  .session-row { display: flex; width: 100%; align-items: center; gap: 10px; text-align: left; padding: 7px 12px; border-bottom: 1px solid var(--border); }
  .session-row:last-child { border-bottom: 0; } .session-row:is(:hover, :focus-visible):not(:disabled) { background: var(--row-hover); }
  /* Title and facts on one line; a transcript match adds its excerpt below. */
  .row-body { flex: 1; display: flex; flex-direction: column; min-width: 0; gap: 3px; }
  .line { display: flex; align-items: baseline; gap: 10px; min-width: 0; }
  strong { font-weight: var(--fw-medium); min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .meta, time { color: var(--muted); font-size: var(--fs-xs); white-space: nowrap; flex: none; } time { flex: none; }
  .excerpt { font-size: var(--fs-sm); color: var(--text-2); overflow-wrap: anywhere; }
  .err { color: var(--del-fg); }
  @media (max-width: 1000px) { time { display: none; } }
</style>
