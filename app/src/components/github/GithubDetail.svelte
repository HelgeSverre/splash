<script lang="ts">
  import { api, type GithubItem, type GithubComments } from "../../bindings";
  import { github, itemStatus, ago, newIssue } from "../../lib/github.svelte";
  import { app, sessionsFor, openSession, pickFolder } from "../../lib/sessions.svelte";
  import { prefs } from "../../lib/prefs.svelte";
  import { markRead, unread, snooze } from "../../lib/github-inbox.svelte";
  import { errorMessage } from "../../lib/format";
  import { openExternal, showError } from "../../lib/system";
  import Markdown from "../entries/Markdown.svelte";
  import Icon from "../Icon.svelte";
  import Modal from "../ui/Modal.svelte";
  import ModalHeader from "../ui/ModalHeader.svelte";
  import Tag from "../ui/Tag.svelte";

  let { item }: { item: GithubItem } = $props();
  let discussion = $state<GithubComments | null>(null);
  let loading = $state(false);
  let error = $state("");
  let linking = $state(false);
  let linkPending = $state(false);
  let revision = $state(0);
  const repository = $derived(github.catalog?.repositories.find(r => r.full_name === item.repository));
  const projects = $derived(app.projects.filter(p => repository?.project_ids.includes(p.id)));
  $effect(() => {
    const current = item; void revision;
    let cancelled = false;
    discussion = null; error = ""; loading = false;
    if (current.number && (current.kind === "issue" || current.kind === "pull_request")) {
      loading = true;
      api.github_comments(current.repository, current.number, current.kind).then(result => { if (!cancelled) discussion = result; })
        .catch(e => { if (!cancelled) error = errorMessage(e); }).finally(() => { if (!cancelled) loading = false; });
    }
    return () => { cancelled = true; };
  });
  async function link(projectId: string) {
    if (linkPending) return;
    linkPending = true;
    try {
      await api.github_link_project(item.repository, projectId);
      if (repository && !repository.project_ids.includes(projectId)) repository.project_ids.push(projectId);
      linking = false;
    } catch(e) { showError(e); }
    finally { linkPending = false; }
  }
  async function addFolder() { const project = await pickFolder(); if (project) await link(project.id); }
</script>

<aside class="detail" aria-label="GitHub item details">
  <div class="detail-head"><span class="t-mono-meta">{item.repository}{item.number ? ` #${item.number}` : ""}</span><Tag>{itemStatus(item)}</Tag></div>
  <h2 class="t-page-title selectable">{item.title}</h2>
  <p class="t-meta">{item.author || "GitHub"} · {ago(item.updated_at)}{item.kind === "branch" ? " · last commit" : ""}</p>
  <div class="actions"><button class="btn sm" onclick={() => openExternal(item.url)}><Icon name="external" size={12} />Open on GitHub</button><button class="btn ghost sm" onclick={() => newIssue(item.repository)}><Icon name="plus" size={12} />Issue here</button></div>
  <div class="actions">
    {#if item.kind === "issue" || item.kind === "pull_request"}<button class="btn primary sm" onclick={() => app.newSession = { projectId: projects[0]?.id, githubItem: item }}>Work on this</button>{/if}
    <button class="btn ghost sm" onclick={() => markRead([item], !!unread(item))}>{unread(item) ? "Mark read" : "Mark unread"}</button>
    <select class="field" aria-label="Snooze item" value="" onchange={e => { snooze(item, e.currentTarget.value as "tomorrow" | "activity" | "wake"); e.currentTarget.value = ""; }}><option value="" disabled>Snooze…</option><option value="tomorrow">Until tomorrow at 9</option><option value="activity">Until new activity</option><option value="wake">Unsnooze</option></select>
  </div>
  {#if item.branch || item.checks || item.review_decision || item.assignees.length || item.reviewers.length}
    <dl class="metadata">
      {#if item.branch}<dt>Branch</dt><dd class="mono selectable">{item.branch}</dd>{/if}
      {#if item.checks}<dt>Checks</dt><dd>{item.checks.toLowerCase()}</dd>{/if}
      {#if item.review_decision}<dt>Review</dt><dd>{item.review_decision.toLowerCase().replaceAll("_", " ")}</dd>{/if}
      {#if item.assignees.length}<dt>Assigned</dt><dd>{item.assignees.join(", ")}</dd>{/if}
      {#if item.reviewers.length}<dt>Reviewers</dt><dd>{item.reviewers.join(", ")}</dd>{/if}
    </dl>
  {/if}
  {#if item.labels.length}<div class="labels">{#each item.labels as label}<Tag>{label}</Tag>{/each}</div>{/if}
  <section><h3 class="t-section">SPLASH WORKSPACE</h3>
    {#each projects as project (project.id)}
      <div class="project"><div class="project-name"><Icon name="folder" size={13} />{project.name}</div><div class="t-mono-meta selectable path">{project.path}</div>
        {#each sessionsFor(project.id) as session (session.id)}
          <button class="plain session-link" onclick={() => openSession(session.id).catch(showError)}><Icon name={session.isolation === "worktree" ? "branch" : "monitor"} size={12} /><span>{session.title}</span>{#if prefs[`session.github.${session.id}`] === item.url}<Tag>this item</Tag>{:else if item.branch && session.branch === item.branch}<Tag>this branch</Tag>{/if}</button>
        {/each}
        <button class="btn ghost sm" onclick={() => app.newSession = { projectId: project.id }}><Icon name="plus" size={12} />New session</button>
      </div>
    {:else}<p class="t-meta">No matching local project.</p>{/each}
    <button class="plain link" onclick={() => linking = true}>{projects.length ? "Link another project…" : "Link to Splash…"}</button>
  </section>
  <section><h3 class="t-section">{item.kind === "branch" ? "LATEST COMMIT" : "DESCRIPTION"}</h3>{#if item.body}<Markdown text={item.body} />{:else}<p class="t-meta">No description.</p>{/if}</section>
  {#if item.number}
    <section><h3 class="t-section">DISCUSSION</h3>
      {#if loading}<p class="t-meta" role="status">Loading discussion…</p>{/if}
      {#if error}<p class="error" role="alert">{error}</p><button class="btn sm" onclick={() => revision++}>Retry</button>{/if}
      {#each discussion?.comments ?? [] as comment (comment.url)}<article class="comment"><div class="comment-head"><strong>{comment.author || "GitHub"}</strong><button class="plain t-meta" onclick={() => openExternal(comment.url)}>{ago(comment.created_at)} ↗</button></div><Markdown text={comment.body} /></article>{/each}
      {#if discussion && !discussion.comments.length}<p class="t-meta">No comments yet.</p>{/if}
      {#if discussion?.has_more}<button class="btn ghost sm" onclick={() => openExternal(item.url)}>Older comments on GitHub ↗</button>{/if}
      {#if item.kind === "pull_request"}<p class="t-meta">Inline code reviews are available on GitHub.</p>{/if}
    </section>
  {/if}
</aside>

{#if linking}
  <Modal label="Link repository to Splash" width="480px" onclose={() => { if (!linkPending) linking = false; }}>
    <ModalHeader title="Link to Splash" onclose={() => { if (!linkPending) linking = false; }} />
    <div class="link-choices"><p class="t-mono-value">{item.repository}</p>{#each app.projects as project (project.id)}<button class="btn" disabled={linkPending || projects.some(p => p.id === project.id)} onclick={() => link(project.id)}><Icon name="folder" size={13} />{project.name}</button>{/each}<button class="btn ghost" disabled={linkPending} onclick={addFolder}>Add a project folder…</button></div>
  </Modal>
{/if}

<style>
  .detail { min-width: 0; height: 100%; overflow: auto; padding: 18px; border-left: 1px solid var(--border); background: var(--surface); }
  .detail-head { display: flex; justify-content: space-between; align-items: start; gap: 8px; }
  .detail-head > span { overflow-wrap: anywhere; }
  h2 { margin: 14px 0 6px; overflow-wrap: anywhere; line-height: var(--lh-base); }
  p { margin: 5px 0 12px; }
  .actions, .labels { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
  section { border-top: 1px solid var(--border); padding-top: 14px; margin-top: 16px; }
  h3 { margin: 0 0 10px; }
  .metadata { display: grid; grid-template-columns: auto minmax(0,1fr); gap: 5px 12px; font-size: var(--fs-sm); }
  dt { color: var(--muted); } dd { margin: 0; overflow-wrap: anywhere; }
  .project { margin-bottom: 12px; }
  .project-name { display: flex; align-items: center; gap: 7px; color: var(--accent); }
  .path { margin: 5px 0; overflow-wrap: anywhere; }
  .session-link { display: flex; align-items: center; gap: 6px; padding: 6px 0; width: 100%; font-size: var(--fs-sm); color: var(--text-2); }
  .session-link > span { flex: 1; text-align: left; overflow-wrap: anywhere; }
  .session-link:is(:hover,:focus-visible), .link:is(:hover,:focus-visible) { color: var(--accent); }
  .link { font-size: var(--fs-sm); color: var(--text-2); }
  .comment { padding: 12px 0; border-bottom: 1px solid var(--border); }
  .comment-head { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 8px; font-size: var(--fs-sm); }
  .error { color: var(--del-fg); overflow-wrap: anywhere; }
  .link-choices { display: flex; flex-direction: column; gap: 8px; padding: 18px; overflow: auto; }
</style>
