<script lang="ts">
  import { onMount, untrack } from "svelte";
  import { github, loadCatalog, ago } from "../../lib/github.svelte";
  import { actions, loadActions, stopActions, scopedRepositories } from "../../lib/github-actions.svelte";
  import { actionStatus, actionTone, duration } from "../../lib/actions-model";
  import { openGithub } from "../../lib/route.svelte";
  import { openExternal } from "../../lib/system";
  import { toggleLeft } from "../../lib/layout.svelte";
  import type { ActionsWorkflow } from "../../bindings";
  import ActionsScope from "./ActionsScope.svelte";
  import ActionsDetail from "./ActionsDetail.svelte";
  import Icon from "../Icon.svelte";
  import IconButton from "../ui/IconButton.svelte";
  import Tabs from "../ui/Tabs.svelte";
  import FilterInput from "../ui/FilterInput.svelte";
  import EmptyState from "../ui/EmptyState.svelte";
  let tab=$state("runs"), query=$state(""), status=$state(""), days=$state("30");
  let branch=$state(""), event=$state(""), appliedBranch=$state(""), appliedEvent=$state("");
  let workflow=$state<ActionsWorkflow | null>(null), selectedId=$state(""), limit=$state(150), now=$state(Date.now()), revision=$state(0);
  let created=$state(new Date(Date.now()-30*86400000).toISOString());
  const scope=$derived(scopedRepositories());
  const activeWorkflow=$derived(workflow && scope.some(r=>r.full_name===workflow?.repository) ? workflow : null);
  const repositories=$derived(scope.filter(r=>tab!=="runs" || !activeWorkflow || r.full_name===activeWorkflow.repository).map(r=>r.full_name));
  const filters=$derived({status,branch:appliedBranch,event:appliedEvent,created:created ? `>=${created}` : "",workflow_id:activeWorkflow?.id ?? null});
  const signature=$derived(JSON.stringify({login:github.catalog?.login, repositories,tab,filters:tab==="runs"?filters:null}));
  const pages=$derived(repositories.map(r=>actions.pages[r]));
  const failures=$derived(repositories.filter(r=>actions.pages[r]?.error));
  const loaded=$derived(pages.filter(p=>p?.loaded).length);
  const next=$derived(pages.some(p=>p?.next));
  const allRuns=$derived(pages.flatMap(p=>p?.runs ?? []));
  const runs=$derived(allRuns.filter(r=>`${r.repository} ${r.workflow} ${r.title} ${r.branch} ${r.sha} ${r.actor} ${r.event} #${r.number}`.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>b.created_at.localeCompare(a.created_at)||b.id.localeCompare(a.id)));
  const workflows=$derived(pages.flatMap(p=>p?.workflows ?? []).filter(w=>`${w.repository} ${w.name} ${w.path} ${w.state}`.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>a.repository.localeCompare(b.repository)||a.name.localeCompare(b.name)));
  const selected=$derived(runs.find(r=>`${r.repository}:${r.id}`===selectedId) ?? runs[0]);
  const synced=$derived(Math.max(0,...pages.map(p=>p?.synced ?? 0)));
  const counts=$derived({active:allRuns.filter(r=>actionTone(r.status,r.conclusion)==="active").length,failed:allRuns.filter(r=>actionTone(r.status,r.conclusion)==="failed").length,passed:allRuns.filter(r=>r.conclusion==="success").length});
  onMount(()=> { void loadCatalog(); const timer=setInterval(()=>now=Date.now(),10000); return ()=>{clearInterval(timer);stopActions();}; });
  $effect(()=> { const key=signature, names=repositories, currentTab=tab, currentFilters=filters; void revision;
    untrack(()=>{limit=150; if(github.catalog)void loadActions(names,currentTab,currentFilters,key);}); return stopActions;
  });
  function load(mode:"initial"|"refresh"|"more"="initial") { return loadActions(repositories,tab,filters,signature,mode); }
  function openWorkflow(value:ActionsWorkflow) { workflow=value; query=""; status=""; branch="";event="";appliedBranch="";appliedEvent="";tab="runs"; }
</script>
<div class="actions-view">
  <header><IconButton icon="monitor" title="Toggle sidebar" onclick={toggleLeft}/><Icon name="activity" size={16}/><h1 class="t-pane-title">Actions</h1><span class="spacer"></span>{#if github.catalog}<span class="t-meta">@{github.catalog.login}</span>{/if}<button class="btn ghost sm" onclick={openGithub}>GitHub triage</button><button class="btn sm" disabled={actions.loading || !github.catalog} onclick={()=>load("refresh")}>Refresh</button></header>
  {#if !github.catalog}<EmptyState icon="github" loading={github.catalogLoading} title={github.catalogLoading?"Loading GitHub repositories…":"Connect GitHub"} detail="Uses your GitHub CLI login, including private and organization repositories.">{#if github.catalogError}<p class="error" role="alert">{github.catalogError}</p>{/if}<button class="btn" onclick={()=>loadCatalog(true)} disabled={github.catalogLoading}>Retry</button></EmptyState>
  {:else}
    <search class="filters"><ActionsScope/><div class="filter-row"><FilterInput bind:value={query} placeholder={tab==="runs"?"Filter loaded runs, workflows, branches, actors…":"Find loaded workflows…"}/><button class="btn ghost sm" disabled={github.catalogLoading} onclick={()=>loadCatalog(true)}>Refresh repositories</button></div></search>
    <Tabs items={[{id:"runs",label:"Runs"},{id:"workflows",label:"Workflows"}]} active={tab} onselect={id=>{tab=id;query="";}} prefix="actions" label="Actions overview"/>
    {#if tab==="runs"}
      <form class="run-filters" onsubmit={e=>{e.preventDefault();appliedBranch=branch.trim();appliedEvent=event.trim();}}>
        <select class="field" aria-label="Run status" bind:value={status}><option value="">All statuses</option><option value="in_progress">Running</option><option value="queued">Queued</option><option value="waiting">Waiting for approval</option><option value="failure">Failed</option><option value="success">Successful</option><option value="cancelled">Cancelled</option><option value="timed_out">Timed out</option><option value="completed">Completed</option></select>
        <select class="field" aria-label="Run time range" bind:value={days} onchange={e=>{created=e.currentTarget.value ? new Date(Date.now()-Number(e.currentTarget.value)*86400000).toISOString():"";}}><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="">All available history</option></select>
        <input class="field" aria-label="Branch filter" placeholder="Exact branch" bind:value={branch}/><input class="field" aria-label="Event filter" placeholder="Event, e.g. push" bind:value={event}/><button class="btn sm">Apply</button>
        {#if activeWorkflow}<span class="t-meta">{activeWorkflow.repository} · {activeWorkflow.name}</span><button type="button" class="btn ghost sm" onclick={()=>workflow=null}>All workflows</button>{/if}
      </form>
      <div class="summary t-meta"><span><strong>{allRuns.length}</strong> runs loaded</span><span class="active">{counts.active} active / waiting</span><span class="failed">{counts.failed} need attention</span><span class="passed">{counts.passed} successful</span></div>
    {/if}
    {#if github.catalogError}<p class="notice error" role="alert">Repository refresh failed: {github.catalogError}</p>{/if}
    {#if failures.length}<details class="failures"><summary>{failures.length} repositories could not be loaded. Results are incomplete.</summary>{#each failures as name}<p>{name}: {actions.pages[name].error}</p>{/each}<button class="btn sm" disabled={actions.loading} onclick={()=>load()}>Retry failed requests</button></details>{/if}
    <div class="content" class:wide={tab==="workflows"} role="tabpanel" id="actions-panel-{tab}" aria-labelledby="actions-tab-{tab}">
      <section class="list" aria-label={tab==="runs"?"Workflow runs":"Workflows"}>
        {#if tab==="runs"}<div class="list-head t-meta">{runs.length} matching loaded runs · newest first</div>
          {#each runs.slice(0,limit) as run (`${run.repository}:${run.id}`)}<button class="plain row focus-inset" class:selected={selected?.id===run.id && selected?.repository===run.repository} aria-pressed={selected?.id===run.id && selected?.repository===run.repository} onclick={()=>selectedId=`${run.repository}:${run.id}`}><span class="run-status {actionTone(run.status,run.conclusion)}">{actionStatus(run.status,run.conclusion)}</span><span class="row-main"><strong>{run.title || run.workflow}</strong><span class="t-meta">{run.repository} · {run.workflow} #{run.number} · attempt {run.attempt}</span><span class="t-meta">{run.branch} · {run.event} · {run.actor} · {run.sha.slice(0,7)}</span></span><span class="timing t-mono-meta"><time datetime={run.created_at}>{ago(run.created_at)}</time>{#if run.status!=="completed" && run.started_at}<span>{duration(run.started_at,null,now)}</span>{/if}</span></button>
          {:else}<EmptyState inline loading={actions.loading} title={actions.loading?"Loading runs…":"No matching runs loaded"} detail={scope.length?"Change the filters or time range, or load more history.":"Select repositories to see Actions runs."}/>{/each}
        {:else}<div class="list-head t-meta">{workflows.length} workflows loaded, including disabled workflows</div>
          {#each workflows.slice(0,limit) as w (`${w.repository}:${w.id}`)}<div class="workflow"><div class="row-main"><strong>{w.name}</strong><span class="t-meta">{w.repository} · {w.path}</span></div><span class="t-meta">{w.state.replaceAll("_"," ")}</span><button class="btn sm" onclick={()=>openWorkflow(w)}>View runs</button><button class="btn ghost sm" onclick={()=>openExternal(w.url)}>GitHub ↗</button></div>{:else}<EmptyState inline loading={actions.loading} title={actions.loading?"Loading workflows…":"No workflows loaded"} detail="Choose repositories or adjust the search."/>{/each}
        {/if}
        {#if (tab==="runs"?runs.length:workflows.length)>limit}<button class="btn ghost more" onclick={()=>limit+=150}>Show more loaded items</button>{/if}
        {#if next}<button class="btn ghost more" disabled={actions.loading} onclick={()=>load("more")}>Load more {tab==="runs"?"run history":"workflows"}</button>{/if}
      </section>
      {#if tab==="runs"}{#if selected}{#key `${selected.repository}:${selected.id}`}<ActionsDetail run={selected} {now}/>{/key}{:else}<EmptyState icon="activity" title="CI across your projects" detail="Select a run to inspect its jobs, steps and logs."/>{/if}{/if}
    </div>
    <footer><span role="status">{#if actions.loading}Loading {actions.completed} / {actions.total} repositories{:else}{loaded} / {repositories.length} repositories loaded{/if}{#if synced} · Updated {new Date(synced).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}{/if}</span><span class="spacer"></span>{#if actions.loading}<button class="btn ghost sm" onclick={stopActions}>Pause</button>{:else if actions.paused || loaded<repositories.length}<button class="btn ghost sm" onclick={()=>revision++}>Resume</button>{/if}</footer>
    <p class="coverage t-meta">{tab==="runs"?"Starts with 30 runs per repository. Load more for history; GitHub caps filtered history at 1,000 runs per repository. Refresh to update running jobs.":"Workflows load in pages of 100 per repository. View runs to inspect a workflow’s history."} Access failures are shown above.</p>
  {/if}
</div>
<style>
  .actions-view { height:100%; min-height:0; display:flex; flex-direction:column; }
  header { display:flex; align-items:center; gap:10px; min-height:var(--h-header); padding:0 12px; border-bottom:1px solid var(--border); } h1 { margin:0; }
  .filters { padding:12px 16px; } .filter-row { display:flex; gap:8px; margin-top:10px; }
  .run-filters { display:flex; align-items:center; gap:8px; flex-wrap:wrap; padding:10px 16px; } .run-filters input { width:150px; }
  .summary { display:flex; flex-wrap:wrap; gap:18px; padding:4px 16px 12px; border-bottom:1px solid var(--border); }
  .content { flex:1; min-height:0; display:grid; grid-template-columns:minmax(260px,1.2fr) minmax(300px,1fr); } .content.wide { grid-template-columns:1fr; }
  .list { min-width:0; overflow:auto; } .list-head { padding:12px 16px; }
  .row { display:flex; align-items:start; gap:10px; width:100%; text-align:left; padding:14px 16px; border-bottom:1px solid var(--border); }
  .row:is(:hover,:focus-visible) { background:var(--row-hover); } .row.selected { background:var(--row-active); }
  .row-main { flex:1; min-width:0; display:flex; flex-direction:column; gap:5px; overflow-wrap:anywhere; } strong { font-weight:var(--fw-medium); }
  .run-status { min-width:68px; max-width:90px; text-transform:capitalize; font-size:var(--fs-xs); padding-top:2px; }
  .failed,.error { color:var(--err-dim); } .passed { color:var(--ok-dim); } .active { color:var(--accent); } .neutral { color:var(--muted); }
  .timing { display:flex; flex-direction:column; gap:6px; flex:none; }
  .workflow { display:flex; align-items:center; gap:12px; padding:14px 16px; border-bottom:1px solid var(--border); }
  footer { display:flex; align-items:center; gap:8px; min-height:var(--h-toolbar); padding:8px 16px; border-top:1px solid var(--border); font-size:var(--fs-xs); color:var(--muted); }
  .coverage { margin:0; padding:0 16px 10px; } .more { display:block; margin:14px auto; }
  .failures { padding:10px 16px; max-height:170px; overflow:auto; color:var(--warn-dim); font-size:var(--fs-sm); } .failures p,.error { overflow-wrap:anywhere; } summary { cursor:pointer; } .notice { padding:8px 16px; }
</style>
