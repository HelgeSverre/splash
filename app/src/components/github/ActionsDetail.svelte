<script lang="ts">
  import { untrack } from "svelte";
  import { api, type ActionsRun, type ActionsJob, type ActionsLog } from "../../bindings";
  import { actionStatus, actionTone, duration, cleanLog } from "../../lib/actions-model";
  import { errorMessage } from "../../lib/format";
  import { openExternal } from "../../lib/system";
  import { github } from "../../lib/github.svelte";
  import { app, sessionsFor, openSession } from "../../lib/sessions.svelte";
  import { showError } from "../../lib/system";
  import FilterInput from "../ui/FilterInput.svelte";
  let { run, now }: { run: ActionsRun; now: number } = $props();
  let chosenAttempt = $state(0), refresh = $state(0);
  const attempt = $derived(chosenAttempt || run.attempt);
  let jobs = $state<ActionsJob[]>([]), loading = $state(false), error = $state("");
  let next = $state<number | null>(null);
  let log = $state<ActionsLog | null>(null), logJob = $state<ActionsJob | null>(null), logLoading = $state(false), logError = $state(""), logQuery = $state("");
  let request = 0, logRequest = 0;
  const projects = $derived(app.projects.filter(p=>github.catalog?.repositories.find(r=>r.full_name===run.repository)?.project_ids.includes(p.id)));
  const text = $derived(log ? cleanLog(log.text) : "");
  const visibleLog = $derived(logQuery.trim() ? text.split("\n").filter(line=>line.toLowerCase().includes(logQuery.toLowerCase())).join("\n") : text);
  $effect(()=> {
    void run.id; void run.updated_at; void attempt; void refresh;
    untrack(()=> { jobs=[]; next=null; log=null; logJob=null; logRequest++; logLoading=false; logError=""; void loadJobs(1); });
    return ()=>{ request++; logRequest++; };
  });
  async function loadJobs(page: number) {
    const token=++request, current=run, selectedAttempt=attempt;
    loading=true; error="";
    try { const result=await api.github_actions_jobs(current.repository,current.id,selectedAttempt,page); if(token!==request)return;
      jobs=[...new Map([...(page===1?[]:jobs),...result.jobs].map(j=>[j.id,j])).values()]; next=result.next_page;
    } catch(e) { if(token===request)error=errorMessage(e); }
    finally { if(token===request)loading=false; }
  }
  async function loadLog(job: ActionsJob) {
    const token=++logRequest; logJob=job; log=null; logError=""; logQuery=""; logLoading=true;
    try { const result=await api.github_actions_log(run.repository,job.id); if(token===logRequest)log=result; }
    catch(e) { if(token===logRequest)logError=errorMessage(e); }
    finally { if(token===logRequest)logLoading=false; }
  }
</script>
<aside class="detail" aria-label="Workflow run details">
  <p class="t-mono-meta">{run.repository} · {run.workflow} #{run.number}</p>
  <h2 class="t-page-title">{run.title || run.workflow}</h2>
  <p class="status {actionTone(run.status,run.conclusion)}">{actionStatus(run.status,run.conclusion)} · latest attempt {run.attempt}</p>
  <div class="buttons"><button class="btn sm" onclick={()=>openExternal(run.url)}>Open run on GitHub ↗</button><button class="btn ghost sm" onclick={()=>refresh++} disabled={loading}>Refresh jobs</button></div>
  <dl><dt>Branch</dt><dd>{run.branch || "No branch"}</dd><dt>Commit</dt><dd><button class="plain" onclick={()=>openExternal(`https://github.com/${run.repository}/commit/${run.sha}`)}>{run.sha.slice(0,12)}</button></dd><dt>Triggered by</dt><dd>{run.actor} · {run.event}</dd><dt>Created</dt><dd>{new Date(run.created_at).toLocaleString()}</dd><dt>Started</dt><dd>{run.started_at ? new Date(run.started_at).toLocaleString() : "Not started"}</dd></dl>
  {#if projects.length}<section><h3 class="t-section">SPLASH WORKSPACES</h3>{#each projects as project}<p>{project.name}</p>{#each sessionsFor(project.id).filter(s=>s.branch===run.branch) as session}<button class="btn ghost sm" onclick={()=>openSession(session.id).catch(showError)}>{session.title}</button>{/each}<button class="btn ghost sm" onclick={()=>app.newSession={projectId:project.id}}>New session</button>{/each}</section>{/if}
  <section><div class="buttons"><h3 class="t-section">JOBS AND STEPS</h3><span class="spacer"></span><label class="t-meta">Attempt <select class="field" aria-label="Run attempt" value={attempt} onchange={e=>chosenAttempt=Number(e.currentTarget.value)}>{#each Array.from({length:run.attempt},(_,i)=>i+1) as n}<option value={n}>{n}{n===run.attempt ? " (latest)" : ""}</option>{/each}</select></label></div>
    {#if error}<p class="error" role="alert">{error}</p><button class="btn sm" onclick={()=>loadJobs(next ?? 1)}>Retry jobs</button>{/if}
    {#each jobs as job (job.id)}
      <details open={actionTone(job.status,job.conclusion)==="failed"}>
        <summary><span class="status {actionTone(job.status,job.conclusion)}">{actionStatus(job.status,job.conclusion)}</span> · {job.name}<span class="t-meta">{` · ${duration(job.started_at,job.completed_at,now)}`}</span></summary>
        {#if job.runner}<p class="t-meta">Runner: {job.runner}</p>{/if}
        <ol>{#each job.steps as step}<li><span>{step.name}</span><span class="status {actionTone(step.status,step.conclusion)}">{actionStatus(step.status,step.conclusion)}</span><span class="t-mono-meta">{duration(step.started_at,step.completed_at,now)}</span></li>{/each}</ol>
        <div class="buttons"><button class="btn sm" disabled={job.status!=="completed" || logLoading} onclick={()=>loadLog(job)}>View log</button><button class="btn ghost sm" onclick={()=>openExternal(job.url)}>Full job and logs ↗</button></div>
        {#if job.status!=="completed"}<p class="t-meta">Live logs are available on GitHub. The log preview becomes available when this job finishes.</p>{/if}
      </details>
    {:else}{#if !loading && !error}<p class="t-meta">No jobs yet for this attempt.</p>{/if}{/each}
    {#if loading}<p class="t-meta" role="status">Loading jobs…</p>{/if}
    {#if next}<button class="btn ghost sm" disabled={loading} onclick={()=>loadJobs(next!)}>Load more jobs</button>{/if}
  </section>
  {#if logJob}<section><div class="buttons"><h3 class="t-section">LOG · {logJob.name}</h3><span class="spacer"></span><button class="btn ghost sm" onclick={()=>{logRequest++;log=null;logJob=null;logLoading=false;}}>Close log</button></div>
    {#if logLoading}<p class="t-meta" role="status">Loading log…</p>{/if}
    {#if logError}<p class="error" role="alert">{logError}</p><button class="btn sm" onclick={()=>{if(logJob)void loadLog(logJob);}}>Retry log</button>{/if}
    {#if log}<FilterInput bind:value={logQuery} placeholder="Find lines in this log…" />{#if log.truncated}<p class="t-meta">Showing the first 512 KiB. Open the full job on GitHub for the rest.</p>{/if}
    <!-- Keyboard access to the scrollable log, matching the app’s other code regions. -->
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre class="selectable scroll-region" tabindex="0" role="region" aria-label="Job log"><code>{visibleLog || (logQuery ? "No matching lines." : "Empty log.")}</code></pre>{/if}
  </section>{/if}
</aside>
<style>
  .detail { min-width:0; overflow:auto; padding:18px; background:var(--surface); border-left:1px solid var(--border); }
  h2 { margin:12px 0; overflow-wrap:anywhere; } h3 { margin:0; } p { overflow-wrap:anywhere; }
  .buttons { display:flex; align-items:center; flex-wrap:wrap; gap:8px; }
  dl { display:grid; grid-template-columns:auto minmax(0,1fr); gap:6px 12px; font-size:var(--fs-sm); } dt { color:var(--muted); } dd { margin:0; overflow-wrap:anywhere; }
  section { border-top:1px solid var(--border); padding-top:16px; margin-top:16px; }
  details { border-bottom:1px solid var(--border); padding:12px 0; } summary { cursor:pointer; font-size:var(--fs-sm); overflow-wrap:anywhere; }
  ol { padding-left:22px; } li { display:flex; gap:8px; margin:8px 0; font-size:var(--fs-xs); } li > span:first-child { flex:1; overflow-wrap:anywhere; }
  .status { text-transform:capitalize; } .failed,.error { color:var(--err-dim); } .passed { color:var(--ok-dim); } .active { color:var(--accent); } .neutral { color:var(--muted); }
  .error { white-space:pre-wrap; overflow-wrap:anywhere; }
  pre { max-height:420px; overflow:auto; padding:12px; background:var(--bg); font-size:var(--fs-xs); white-space:pre; }
  .plain:is(:hover,:focus-visible) { color:var(--accent); }
</style>
