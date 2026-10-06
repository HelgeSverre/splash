<script lang="ts">
  import { openActions } from "../../lib/route.svelte";
  import { onMount, untrack, tick } from "svelte";
  import { github, loadCatalog, loadSources, stopLoading, sourceKey, itemKey, kindsFor, itemIcon, itemStatus, needsMe, ago, newIssue, type Feed } from "../../lib/github.svelte";
  import { selectMatching } from "../../lib/github-model";
  import { accountKey, parse, persist, initializeInbox, unread, snoozed, markRead, search, searchGithub, stopSearch } from "../../lib/github-inbox.svelte";
  import { prefs, setPref } from "../../lib/prefs.svelte";
  import { toggleLeft } from "../../lib/layout.svelte";
  import Icon from "../Icon.svelte";
  import IconButton from "../ui/IconButton.svelte";
  import FilterInput from "../ui/FilterInput.svelte";
  import EmptyState from "../ui/EmptyState.svelte";
  import Tabs from "../ui/Tabs.svelte";
  import Modal from "../ui/Modal.svelte";
  import ModalHeader from "../ui/ModalHeader.svelte";
  import GithubDetail from "./GithubDetail.svelte";

  const tabs = [ { id: "all", label: "All activity" }, { id: "needs_me", label: "Needs me" }, { id: "issue", label: "Issues" }, { id: "pull_request", label: "PRs" }, { id: "branch", label: "Branches" } ];
  const feed = $derived((tabs.some(t => t.id === prefs["github.feed"]) ? prefs["github.feed"] : "all") as Feed);
  const owner = $derived(prefs["github.owner"] ?? "");
  const linkedOnly = $derived(prefs["github.linked"] === "true");
  const selectedRepos = $derived.by((): string[] | null => {
    try { const value: unknown = JSON.parse(prefs["github.repositories"] ?? "null"); return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : null; } catch { return null; }
  });
  let query = $state("");
  let status = $state("all");
  let mode = $state("loaded");
  let author = $state("");
  let assignee = $state("");
  let label = $state("");
  let review = $state("");
  let inboxFilter = $state("inbox");
  let now = $state(Date.now());
  let saving = $state(false);
  let viewName = $state("");
  let activeView = $state("");
  type Saved = { id: string; name: string; repositories: string[] | null; owner: string; linked: boolean; feed: Feed; query: string; status: string; mode: string; author: string; assignee: string; label: string; review: string; inbox: string };
  const saved = $derived(parse<Saved[]>(prefs[accountKey("views")], []));
  const visibleFeed = $derived(mode === "github" && !["issue", "pull_request"].includes(feed) ? "all" : feed);
  const searchFilters = $derived({ text: query, author, assignee, label, review, state: status });

  let picker = $state(false);
  let repoQuery = $state("");
  let draftRepos = $state<string[] | null>(null);
  let limit = $state(150);
  let retry = $state(0);
  const repositories = $derived(github.catalog?.repositories ?? []);
  const repoByName = $derived(new Map(repositories.map(r => [r.full_name, r])));
  const owners = $derived([...new Set(repositories.map(r => r.owner))].sort());
  const scoped = $derived(repositories.filter(r => (!owner || r.owner === owner) && (!linkedOnly || r.project_ids.length) && (selectedRepos === null || selectedRepos.includes(r.full_name))));
  const sources = $derived.by(() => {
    if (mode !== "github") return scoped.flatMap(r => kindsFor(feed).filter(kind => kind !== "issue" || r.has_issues).map(kind => ({ repository: r.full_name, kind })));
    const kinds = feed === "issue" ? ["issue" as const] : feed === "pull_request" || review ? ["pull_request" as const] : ["issue" as const, "pull_request" as const];
    return kinds.flatMap(kind => {
      const names = scoped.filter(r => kind !== "issue" || r.has_issues).map(r => r.full_name).sort();
      return Array.from({ length: Math.ceil(names.length / 10) }, (_, i) => ({ kind, repository: names.slice(i * 10, i * 10 + 10).join(",") }));
    });
  });
  const signature = $derived(JSON.stringify({ sources, searchFilters, login: github.catalog?.login }));
  const pageStore = $derived(mode === "github" ? search.pages : github.pages);
  const busy = $derived(mode === "github" ? search.loading : github.loading);
  const pages = $derived(sources.map(s => pageStore[sourceKey(s)]));
  const failures = $derived(sources.filter(s => pageStore[sourceKey(s)]?.error));
  const older = $derived(pages.filter(p => p?.next_cursor).length);
  const loaded = $derived(pages.filter(p => p?.loaded).length);
  const items = $derived.by(() => {
    const q = mode === "loaded" ? query.trim().toLowerCase() : "";
    const created = github.created.filter(i => scoped.some(r => r.full_name === i.repository) && kindsFor(feed).includes(i.kind));
    return [...new Map([...pages.flatMap(p => p?.items ?? []), ...(mode === "loaded" ? created : [])].map(i => [itemKey(i), i])).values()]
      .filter(i => (mode === "github" || feed !== "needs_me" || needsMe(i, github.catalog?.login ?? "")) &&
        (inboxFilter === "all" || (inboxFilter === "snoozed" ? snoozed(i, now) : !snoozed(i, now) && (inboxFilter !== "unread" || unread(i)))) &&
        (status === "all" || (status === "open" ? ["OPEN", "DRAFT"].includes(i.state) : ["CLOSED", "MERGED"].includes(i.state))) &&
        (!q || `${i.title} ${i.repository} ${i.author} ${i.number ?? ""} ${i.labels.join(" ")}`.toLowerCase().includes(q)))
      .sort((a,b) => b.updated_at.localeCompare(a.updated_at) || a.id.localeCompare(b.id));
  });
  const selected = $derived(items.find(i => itemKey(i) === github.selected) ?? items[0]);
  const pickerRepos = $derived(repositories.filter(r => r.full_name.toLowerCase().includes(repoQuery.toLowerCase())));
  const latestSync = $derived(Math.max(0, ...pages.map(p => p?.syncedAt ?? 0)));

  onMount(() => { void loadCatalog(); const timer = setInterval(() => now = Date.now(), 30000); return () => { clearInterval(timer); stopLoading(); stopSearch(); }; });
  $effect(() => { if (github.catalog) untrack(initializeInbox); });
  $effect(() => { void signature; untrack(() => stopSearch(true)); });
  $effect(() => {
    const list = sources; const remote = mode === "github"; void retry;
    untrack(() => { limit = 150; if (!remote) void loadSources(list); });
    return stopLoading;
  });
  function showPicker() { draftRepos = selectedRepos === null ? null : [...selectedRepos]; repoQuery = ""; picker = true; }
  function toggleRepo(name: string, checked: boolean) {
    const current = draftRepos ?? repositories.map(r => r.full_name);
    draftRepos = checked ? [...current.filter(n => n !== name), name] : current.filter(n => n !== name);
  }
  function applyRepos() { void setPref("github.repositories", JSON.stringify(draftRepos)); picker = false; }
  async function runSearch(older = false) { await searchGithub(sources, searchFilters, signature, older); }
  async function refresh() { await loadCatalog(true); await tick(); if (!github.catalogError) { if (mode === "github") { stopSearch(true); await runSearch(); } else await loadSources(sources, "refresh"); } }
  function selectMatches(selected: boolean) { draftRepos = selectMatching(draftRepos, repositories.map(r => r.full_name), pickerRepos.map(r => r.full_name), selected); }
  function saveView() {
    if (!viewName.trim()) return;
    const value: Saved = { id: activeView || crypto.randomUUID(), name: viewName.trim(), repositories: selectedRepos, owner, linked: linkedOnly, feed, query, status, mode, author, assignee, label, review, inbox: inboxFilter };
    persist(accountKey("views"), [...saved.filter(v => v.id !== value.id), value]); activeView = value.id; saving = false;
  }
  function restoreView(id: string) {
    activeView = id; const view = saved.find(v => v.id === id); if (!view) return;
    void setPref("github.repositories", JSON.stringify(view.repositories)); void setPref("github.owner", view.owner); void setPref("github.linked", String(view.linked)); void setPref("github.feed", view.feed);
    query = view.query; status = view.status; mode = view.mode; author = view.author; assignee = view.assignee; label = view.label; review = view.review; inboxFilter = view.inbox;
  }
</script>

<div class="github-view">
  <header><IconButton icon="monitor" title="Toggle sidebar" onclick={toggleLeft} /><Icon name="github" size={16} /><h1 class="t-pane-title">GitHub</h1><span class="spacer"></span><button class="btn ghost sm" onclick={openActions}>Actions</button>{#if github.catalog}<span class="account t-meta">@{github.catalog.login}</span>{/if}<IconButton icon="refresh" title="Refresh GitHub" onclick={refresh} disabled={github.catalogLoading || busy} /><button class="btn primary sm" onclick={() => newIssue(selected?.repository ?? (scoped.length === 1 ? scoped[0].full_name : ""))} disabled={!github.catalog}><Icon name="plus" size={12} />New issue</button></header>
  {#if !github.catalog}
    <EmptyState icon="github" loading={github.catalogLoading} title={github.catalogLoading ? "Loading your GitHub repositories…" : "Connect your GitHub account"} detail="Splash uses GitHub CLI. Run gh auth login --hostname github.com, then retry. Private and organization repositories require access through that login.">
      {#if github.catalogError}<p class="error" role="alert">{github.catalogError}</p>{/if}<button class="btn" onclick={() => loadCatalog(true)} disabled={github.catalogLoading}>Retry</button>
    </EmptyState>
  {:else}
    <div class="filters">
      <FilterInput bind:value={query} placeholder={mode === "github" ? "Search issues and PRs on GitHub…" : "Filter loaded items…"} label="Search GitHub items" onenter={() => { if (mode === "github" && !busy && scoped.length) void runSearch(); }} />
      <select class="field" aria-label="GitHub owner" value={owner} onchange={e => setPref("github.owner", e.currentTarget.value)}><option value="">All owners</option>{#each owners as name}<option value={name}>{name}</option>{/each}</select>
      <button class="btn" onclick={showPicker}><Icon name="folder" size={13} />Repositories <span class="t-count">{scoped.length}</span></button>
      <button class="btn ghost" aria-pressed={linkedOnly} onclick={() => setPref("github.linked", String(!linkedOnly))}>Linked to Splash</button>
    </div>
    <div class="view-tools">
      <select class="field" aria-label="Saved view" value={activeView} onchange={e => restoreView(e.currentTarget.value)}><option value="">Custom view</option>{#each saved as view}<option value={view.id}>{view.name}</option>{/each}</select>
      <button class="btn ghost sm" onclick={() => { viewName = saved.find(v => v.id === activeView)?.name ?? ""; saving = true; }}>Save view…</button>
      {#if activeView}<button class="btn ghost sm" onclick={() => { persist(accountKey("views"), saved.filter(v => v.id !== activeView)); activeView = ""; }}>Delete view</button>{/if}
      <span class="spacer"></span>
      <select class="field" aria-label="Inbox filter" bind:value={inboxFilter}><option value="inbox">Inbox</option><option value="unread">Unread</option><option value="snoozed">Snoozed</option><option value="all">Include snoozed</option></select>
      <button class="btn ghost sm" disabled={!items.length} onclick={() => markRead(items)}>Mark loaded read</button>
      <select class="field" aria-label="Search source" bind:value={mode}><option value="loaded">Loaded activity</option><option value="github">Search GitHub</option></select>
    </div>
    {#if mode === "github"}
      <form class="search-tools" onsubmit={e => { e.preventDefault(); void runSearch(); }}>
        <input class="field" aria-label="Author" placeholder="Author / @me" bind:value={author} />
        <input class="field" aria-label="Assignee" placeholder="Assignee / @me" bind:value={assignee} />
        <input class="field" aria-label="Label" placeholder="Label" bind:value={label} />
        <select class="field" aria-label="Review status" bind:value={review} onchange={e => { if (e.currentTarget.value) void setPref("github.feed", "pull_request"); }}><option value="">Any review</option><option value="requested">Review requested from me</option><option value="required">Review required</option><option value="approved">Approved</option><option value="changes_requested">Changes requested</option></select>
        <button class="btn primary sm" disabled={busy || !scoped.length}>Search GitHub</button>
      </form>
      <div class="notice t-meta">Searches issues and PRs in {scoped.length} repositories. Text is literal; use the fields for qualifiers. Review filters search PRs only. Select Issues or PRs to narrow the type.</div>
    {/if}
    <Tabs items={mode === "github" ? tabs.filter(t => ["all", "issue", "pull_request"].includes(t.id)) : tabs} active={visibleFeed} prefix="github" label="GitHub activity type" onselect={id => { if (mode === "github" && id === "issue") review = ""; void setPref("github.feed", id); }}>
      {#snippet actions()}<select class="field state-filter" aria-label="Item status" bind:value={status}><option value="all">All states</option><option value="open">Open</option><option value="closed">Closed / merged</option></select>{/snippet}
    </Tabs>
    {#if github.catalogError}<div class="notice error" role="alert">Repository refresh failed. Showing the previous catalog. {github.catalogError}</div>{/if}
    {#if mode === "loaded" && feed === "needs_me"}<div class="notice t-meta">Assigned to you, directly requesting your review, or your PRs with failing checks / requested changes.</div>{/if}
    {#if failures.length}<details class="failures"><summary>{failures.length} GitHub {failures.length === 1 ? "feed failed" : "feeds failed"}. Results may be incomplete.</summary><div class="failure-list">{#each failures as s}<p><strong>{s.repository} · {s.kind.replaceAll("_", " ")}</strong><br>{pageStore[sourceKey(s)]?.error}</p>{/each}</div><button class="btn sm" disabled={busy} onclick={() => mode === "github" ? runSearch() : loadSources(failures, "refresh")}>Retry failed requests</button></details>{/if}
    <div class="triage" role="tabpanel" id="github-panel-{visibleFeed}" aria-labelledby="github-tab-{visibleFeed}">
      <section class="list" aria-label="GitHub activity">
        <div class="list-head t-meta"><span>{items.length} loaded {items.length === 1 ? "item" : "items"}</span><span>Updated most recently</span></div>
        <div class="rows">
          {#each items.slice(0, limit) as item (itemKey(item))}
            <button class="plain item focus-inset" class:active={selected && itemKey(item) === itemKey(selected)} aria-pressed={selected && itemKey(item) === itemKey(selected)} onclick={() => github.selected = itemKey(item)}>
              <span class="item-icon" class:failing={itemStatus(item) === "Checks failing"} class:merged={item.state === "MERGED"}><Icon name={itemIcon(item.kind)} size={15} /></span>
              <span class="item-content"><span class="item-title">{#if unread(item)}<span class="unread" title="New or updated since last read">● </span>{/if}{item.title}</span><span class="item-meta"><span class="repo-name">{item.repository}</span>{#if item.number}<span>#{item.number}</span>{/if}<span>{itemStatus(item)}</span>{#if repoByName.get(item.repository)?.project_ids.length}<span title="Linked to a Splash project"><Icon name="folder" size={11} /></span>{/if}</span></span>
              <time class="t-mono-meta" datetime={item.updated_at} title={item.updated_at}>{ago(item.updated_at)}</time>
            </button>
          {:else}<EmptyState inline loading={busy} title={busy ? "Loading activity…" : "No matching items loaded"} detail={scoped.length ? "Try another filter, refresh, or load older items." : "Choose repositories or clear your scope filters."} />{/each}
          {#if items.length > limit}<button class="btn ghost more" onclick={() => limit += 150}>Show {Math.min(150, items.length - limit)} more loaded items</button>{/if}
          {#if older && !busy}<button class="btn ghost more" onclick={() => mode === "github" ? runSearch(true) : loadSources(sources, "older")}>Load more ({older} feeds)</button>{/if}
        </div>
      </section>
      {#if selected}<GithubDetail item={selected} />{:else}<div class="blank"><EmptyState icon="github" title="Your GitHub workspace" detail="Select an issue, pull request, branch, or activity to see details and linked Splash sessions." /></div>{/if}
    </div>
    <footer><span class="sync" role="status">{#if busy}<span class="spinner"></span>Loading {mode === "github" ? search.completed : github.completed} / {mode === "github" ? search.total : github.total}{:else}{loaded} / {sources.length} feeds loaded{#if latestSync} · Updated {new Date(latestSync).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{/if}{/if}</span><span class="spacer"></span>{#if busy}<button class="btn ghost sm" onclick={() => mode === "github" ? stopSearch() : stopLoading()}>Pause</button>{:else if mode === "loaded" && (github.paused || loaded < sources.length)}<button class="btn ghost sm" onclick={() => retry++}>Resume</button>{:else if mode === "github" && search.signature && loaded < sources.length}<button class="btn ghost sm" onclick={() => runSearch()}>Resume search</button>{/if}<span class="t-meta">{scoped.length} / {repositories.length} repositories</span></footer>
    <div class="coverage t-meta">{mode === "github" ? "GitHub search returns up to 1,000 matches per group of up to 10 repositories and type. Narrow the scope if you reach that limit. Load more to continue. Search indexing may be delayed." : "Recent items per repository; load older items for more. GitHub’s activity feed has limited history and may be delayed."} Read and snooze apply only in Splash. New activity wakes snoozed items.</div>
  {/if}
</div>

{#if picker}
  <Modal label="Choose GitHub repositories" width="620px" height="620px" onclose={() => picker = false}>
    <ModalHeader title="Repositories" onclose={() => picker = false} />
    <div class="picker-tools"><FilterInput bind:value={repoQuery} placeholder="Find a repository across all owners…" /><div class="picker-actions"><button class="btn ghost sm" onclick={() => draftRepos = null}>All repositories</button><button class="btn ghost sm" onclick={() => draftRepos = []}>Clear all</button><button class="btn ghost sm" disabled={!pickerRepos.length} onclick={() => selectMatches(true)}>Select matches ({pickerRepos.length})</button><button class="btn ghost sm" disabled={!pickerRepos.length} onclick={() => selectMatches(false)}>Deselect matches</button><span class="spacer"></span><span class="t-meta">{draftRepos === null ? repositories.length : draftRepos.length} selected</span></div><p class="t-meta">All repositories visible to your GitHub CLI login, including private and organization repositories. New repositories are included automatically when “All” is selected.</p></div>
    <div class="repo-list">{#each pickerRepos as r (r.full_name)}<label class="repo-choice"><input type="checkbox" checked={draftRepos === null || draftRepos.includes(r.full_name)} onchange={e => toggleRepo(r.full_name, e.currentTarget.checked)} /><span><span class="t-mono-value">{r.full_name}</span><span class="t-meta">{r.private ? "Private" : "Public"}{r.archived ? " · Archived" : ""}{r.project_ids.length ? " · Linked to Splash" : ""}</span></span></label>{:else}<EmptyState inline title="No matching repositories" />{/each}</div>
    <div class="picker-footer"><button class="btn ghost" onclick={() => picker = false}>Cancel</button><span class="spacer"></span><button class="btn primary" onclick={applyRepos}>Apply scope</button></div>
  </Modal>
{/if}

{#if saving}
  <Modal label="Save GitHub view" width="420px" onclose={() => saving = false}>
    <ModalHeader title="Save view" onclose={() => saving = false} />
    <form class="save-form" onsubmit={e => { e.preventDefault(); saveView(); }}>
      <label>View name<input class="field" bind:value={viewName} required maxlength="80" /></label>
      <p class="t-meta">Saves repositories, owner, linked filter, activity type, inbox, search fields and status. GitHub searches run when you press Search.</p>
      {#if activeView}<label><input type="checkbox" checked={false} onchange={e => { if (e.currentTarget.checked) activeView = ""; }} /> Save as a new view</label>{/if}
      <button class="btn primary" disabled={!viewName.trim()}>Save</button>
    </form>
  </Modal>
{/if}

<style>
  .view-tools, .search-tools { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; padding: 0 16px 10px; }
  .search-tools input { width: 140px; flex: 1; min-width: 90px; }
  .save-form { padding: 18px; display: grid; gap: 12px; }
  .save-form label { display: grid; gap: 6px; }
  .unread { color: var(--accent); }
  .github-view { height: 100%; display: flex; flex-direction: column; min-height: 0; }
  header { display: flex; align-items: center; gap: 10px; height: var(--h-header); flex: none; padding: 0 12px; border-bottom: 1px solid var(--border); }
  h1 { margin: 0; }
  .filters { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; padding: 14px 16px 10px; }
  .filters select { max-width: 190px; }
  .filters button[aria-pressed="true"] { color: var(--accent); background: var(--accent-soft); }
  .state-filter { height: var(--control-h-sm); font-size: var(--fs-sm); }
  .triage { flex: 1; min-height: 0; display: grid; grid-template-columns: minmax(260px, 1.2fr) minmax(300px, 1fr); }
  .list { display: flex; flex-direction: column; min-width: 0; min-height: 0; }
  .list-head { display: flex; justify-content: space-between; gap: 8px; padding: 12px 16px 8px; flex: none; }
  .rows { overflow: auto; flex: 1; min-height: 0; }
  .item { display: flex; align-items: start; gap: 10px; padding: 13px 16px; width: 100%; border-bottom: 1px solid var(--border); text-align: left; }
  .item:is(:hover, :focus-visible) { background: var(--row-hover); }
  .item.active { background: var(--row-active); }
  .item-icon { padding-top: 2px; color: var(--ok-dim); }
  .item-icon.failing { color: var(--err-dim); } .item-icon.merged { color: var(--purple); }
  .item-content { flex: 1; min-width: 0; }
  .item-title { display: block; color: var(--text); overflow-wrap: anywhere; }
  .item-meta { display: flex; align-items: center; flex-wrap: wrap; column-gap: 8px; row-gap: 2px; color: var(--muted); font-size: var(--fs-xs); margin-top: 5px; }
  .repo-name { overflow-wrap: anywhere; }
  time { flex: none; padding-top: 2px; }
  .blank { border-left: 1px solid var(--border); min-width: 0; }
  .more { display: flex; margin: 14px auto; }
  footer { display: flex; align-items: center; gap: 8px; min-height: var(--h-toolbar); padding: 6px 16px; border-top: 1px solid var(--border); flex: none; }
  .sync { display: flex; align-items: center; gap: 8px; color: var(--muted); font-size: var(--fs-xs); }
  .coverage { padding: 0 16px 8px; font-size: var(--fs-xs); }
  .notice { padding: 8px 16px; border-bottom: 1px solid var(--border); }
  .error { color: var(--del-fg); white-space: pre-wrap; overflow-wrap: anywhere; }
  .failures { padding: 8px 16px; font-size: var(--fs-sm); color: var(--warn-dim); border-bottom: 1px solid var(--border); }
  .failure-list { max-height: 160px; overflow: auto; color: var(--text-2); overflow-wrap: anywhere; }
  summary { cursor: pointer; }
  .picker-tools { padding: 16px 18px 8px; }
  .picker-tools p { margin: 8px 0 0; }
  .picker-actions, .picker-footer { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding-top: 8px; }
  .picker-footer { padding: 12px 18px; border-top: 1px solid var(--border); }
  .repo-list { flex: 1; overflow: auto; min-height: 0; padding: 0 18px 12px; }
  .repo-choice { display: flex; align-items: center; gap: 10px; padding: 9px 6px; border-bottom: 1px solid var(--border); cursor: pointer; }
  .repo-choice:is(:hover, :focus-within) { background: var(--row-hover); }
  .repo-choice > span { display: flex; flex-direction: column; min-width: 0; overflow-wrap: anywhere; }
  .repo-choice input { accent-color: var(--accent); }
  @media (max-width: 1050px) { .triage { grid-template-columns: minmax(220px,1fr) minmax(280px,1fr); } .account { display: none; } }
</style>
