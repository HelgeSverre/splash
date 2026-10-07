<script lang="ts">
  import { api, type SessionView, type GitInfo } from "../bindings";
  import { transcripts } from "../lib/transcripts.svelte";
  import { workspace } from "../lib/workspace.svelte";
  import { openTab } from "../lib/tabs.svelte";
  import { openExternal } from "../lib/system";
  import { app } from "../lib/sessions.svelte";
  import { errorMessage } from "../lib/format";
  import Markdown from "./entries/Markdown.svelte";
  import ChangesList from "./ChangesList.svelte";

  let { session }: { session: SessionView } = $props();
  let feedback = $state("");
  let busy = $state(false);
  let error = $state("");
  let git = $state<GitInfo | null>(null);
  const entries = $derived(transcripts[session.id]?.entries ?? []);
  const lastUser = $derived(entries.findLastIndex((e) => e.kind === "user"));
  const turn = $derived(entries.slice(Math.max(0, lastUser)));
  const answer = $derived(turn.findLast((e) => e.kind === "agent"));
  const failures = $derived(turn.filter((e) => e.kind === "error" || (e.kind === "tool" && e.status === "failed")));
  const changes = $derived(workspace(session.id).changes);
  const available = $derived(!session.archived && !session.source?.deleted && !["starting", "running", "awaiting_permission"].includes(session.status));
  $effect(() => {
    const id = session.id;
    const status = session.status;
    let current = true;
    api.session_git(id, status === "idle").then((result) => { if (current) git = result; }).catch(() => { if (current) git = null; });
    return () => { current = false; };
  });
  async function send(text: string) {
    if (busy || !available || !text.trim()) return;
    const id = session.id;
    const draft = feedback;
    busy = true; error = "";
    try {
      await api.send_prompt(id, text);
      if (feedback === draft) feedback = "";
      if (app.view.kind === "session" && app.view.id === id) {
        app.focusEntry = null;
        openTab({ kind: "chat" });
      }
    }
    catch (e) { error = errorMessage(e); }
    finally { busy = false; }
  }
  async function reviewed() {
    try { await api.acknowledge_session(session.id); }
    catch (e) { error = errorMessage(e); }
  }
</script>

<div class="review" data-testid="review">
  <section>
    <h2>Review work</h2>
    <p class="meta">{git?.branch ?? session.branch ?? "Current folder"}{session.base_sha ? ` · base ${session.base_sha.slice(0, 8)}` : ""}</p>
    <div class="actions">
      <button class="btn sm" data-testid="review-all-changes" disabled={!changes.length} onclick={() => { for (const c of [...changes].reverse()) openTab({ kind: "diff", path: c.path }); }}>Review all changes</button>
      {#if git?.pr}<button class="btn sm" data-testid="review-open-pr" onclick={() => git?.pr && openExternal(git.pr.url)}>Open PR #{git.pr.number}</button>{/if}
      {#if session.attention?.kind === "review"}<button class="btn sm" data-testid="review-mark-reviewed" onclick={reviewed}>Mark reviewed</button>{/if}
    </div>
  </section>
  <div class="changes"><ChangesList {session} /></div>
  <section data-testid="review-latest">
    <h2>Latest response</h2>
    {#if answer?.kind === "agent"}<Markdown text={answer.text} />{:else}<p class="meta">No agent response yet.</p>{/if}
  </section>
  {#if failures.length}
    <section data-testid="review-failures" data-count={failures.length}><h2>Errors and failed tools · {failures.length}</h2>{#each failures as e}<p class="failure" data-testid="review-failure">{e.kind === "error" ? e.text : e.kind === "tool" ? e.title : ""}</p>{/each}</section>
  {/if}
  <section>
    <form onsubmit={(e) => { e.preventDefault(); send(`Review feedback for this conversation:\n\n${feedback.trim()}`); }}>
      <label for="review-feedback">Feedback for the agent</label>
      <textarea id="review-feedback" data-testid="review-feedback" class="field" bind:value={feedback} required rows="4" placeholder="Describe what to change, including file names or line numbers." disabled={session.archived || session.source?.deleted}></textarea>
      <div class="actions"><button class="btn primary sm" data-testid="review-send-feedback" type="submit" disabled={!available || busy}>{busy ? "Connecting…" : "Send feedback"}</button><button class="btn sm" data-testid="review-ask" type="button" disabled={!available || busy} onclick={() => send("Review the changes you made in this conversation. Check for correctness, regressions, and missing validation. Report concrete findings with file locations, and explain what you verified before making further changes.")}>Ask agent to review</button></div>
    </form>
    {#if error}<p class="err failure" role="alert" data-testid="review-error">{error}</p>{/if}
  </section>
</div>

<style>
  .review { overflow: auto; min-height: 0; font-size: var(--fs-sm); }
  section { padding: 16px; border-bottom: 1px solid var(--border); } h2 { font-size: var(--fs-sm); font-weight: var(--fw-medium); margin: 0 0 10px; }
  .meta { color: var(--muted); font-size: var(--fs-xs); margin: 0 0 10px; overflow-wrap: anywhere; }
  .actions { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
  .changes { max-height: 260px; overflow: auto; border-bottom: 1px solid var(--border); }
  label { display: block; margin-bottom: 8px; color: var(--text-2); } textarea { width: 100%; min-height: 80px; resize: vertical; }
  .failure { color: var(--del-fg); white-space: pre-wrap; overflow-wrap: anywhere; margin: 8px 0; }
</style>
