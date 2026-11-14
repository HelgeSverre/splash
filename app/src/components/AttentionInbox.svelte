<script lang="ts">
  import { api, type SessionView } from "../bindings";
  import { app, openSession, projectById, agentById } from "../lib/sessions.svelte";
  import { showSideTab } from "../lib/layout.svelte";
  import EmptyState from "./ui/EmptyState.svelte";
  import AgentIcon from "./AgentIcon.svelte";
  import { ago, dateTime, errorMessage } from "../lib/format";
  import { serverUnavailable } from "../lib/server.svelte";

  let busy = $state("");
  let error = $state("");
  let checked = $state("");
  const groups = [
    { kind: "permission", title: "Waiting for permission" },
    { kind: "failed", title: "Needs recovery" },
    { kind: "review", title: "Ready to review" },
  ] as const;
  const attention = $derived(app.sessions.filter((s) => !s.archived && s.attention).toSorted((a, b) => (b.attention?.at ?? 0) - (a.attention?.at ?? 0)));
  async function open(s: SessionView) {
    await openSession(s.id);
    if (s.attention?.kind === "review") showSideTab("review");
  }
  async function run(s: SessionView, action: "retry" | "check" | "dismiss") {
    busy = s.id; error = ""; checked = "";
    try {
      if (action === "retry") { await api.restart_session(s.id); await openSession(s.id); }
      else if (action === "check") {
        const { probe } = await api.probe_agent(s.agent_id);
        if (probe?.ok) checked = `${agentById(s.agent_id)?.name ?? s.agent_id} connected successfully. Reconnect the conversation when ready.`;
        else error = probe?.error ?? "The agent connection check failed.";
      }
      else await api.acknowledge_session(s.id);
    } catch (e) { error = errorMessage(e); }
    finally { busy = ""; }
  }
</script>

<div class="inbox">
  <header><h1 class="t-page-title">Needs attention</h1></header>
  {#if error}<p class="err error" role="alert" data-testid="attention-error">{error}</p>{/if}
  {#if checked}<p class="error" role="status" data-testid="attention-checked">{checked}</p>{/if}
  <div class="content">
    {#if !attention.length}<EmptyState data-testid="attention-empty" icon="check" title="Nothing needs attention" detail="You can keep working. Sessions that need you will appear here." />{/if}
    {#each groups as group}
      {@const sessions = attention.filter((s) => s.attention?.kind === group.kind)}
      {#if sessions.length}
        <section aria-label={group.title} data-testid="attention-group" data-kind={group.kind}>
          <h2>{group.title} <span>{sessions.length}</span></h2>
          {#each sessions as s (s.id)}
            <article data-testid="attention-item" data-session-id={s.id} data-status={s.status}>
              <div class="heading"><AgentIcon id={s.agent_id} size={18} /><button class="plain title" data-testid="attention-title" onclick={() => open(s)}>{s.title}</button></div>
              <p class="meta">{projectById(s.project_id)?.name} · {agentById(s.agent_id)?.name ?? s.agent_id} · <time datetime={new Date((s.attention?.at ?? 0) * 1000).toISOString()} title={dateTime(s.attention?.at ?? 0)}>{ago(s.attention?.at ?? 0)}</time></p>
              <p class="detail" data-testid="attention-detail">{group.kind === "permission" && s.status !== "awaiting_permission" ? "The agent stopped while waiting for permission. Reconnect to continue; the old request can no longer be answered." : s.attention?.detail}</p>
              <div class="actions">
                <button class="btn primary" data-testid="attention-open" onclick={() => open(s)}>{group.kind === "permission" && s.status === "awaiting_permission" ? "Answer" : group.kind === "review" ? "Review" : "Open"}</button>
                {#if s.status === "error" || s.status === "exited"}<button class="btn" data-testid="attention-reconnect" disabled={!!busy || serverUnavailable()} onclick={() => run(s, "retry")}>{busy === s.id ? "Working…" : "Reconnect"}</button>{/if}
                {#if group.kind !== "review"}<button class="btn" data-testid="attention-recheck" disabled={!!busy || serverUnavailable()} title="Test that the agent starts, without the conversation" onclick={() => run(s, "check")}>Recheck</button>{/if}
                {#if s.status !== "awaiting_permission"}<button class="btn ghost" data-testid="attention-dismiss" disabled={!!busy || serverUnavailable()} onclick={() => run(s, "dismiss")}>{group.kind === "review" ? "Mark reviewed" : "Dismiss"}</button>{/if}
              </div>
            </article>
          {/each}
        </section>
      {/if}
    {/each}
  </div>
</div>

<style>
  .inbox { height: 100%; display: flex; flex-direction: column; container-type: inline-size; }
  header { display: flex; align-items: center; height: var(--h-header); padding: 0 28px; border-bottom: 1px solid var(--border); flex: none; }
  p { margin: 0; color: var(--muted); }
  .content { padding: 18px 28px; overflow: auto; flex: 1; }
  section { margin-bottom: 18px; } h2 { font-size: var(--fs-sm); font-weight: var(--fw-medium); color: var(--text-2); margin: 0 0 8px; }
  h2 span { margin-left: 8px; color: var(--muted); }
  /* One row per session: what it is on the left, what to do on the right. */
  article {
    display: grid; grid-template-columns: minmax(0, 1fr) auto; column-gap: 16px; row-gap: 2px; align-items: center;
    padding: 10px 14px; border: 1px solid var(--border); background: var(--surface); border-radius: var(--radius); margin-bottom: 6px;
  }
  .heading { display: flex; align-items: center; gap: 10px; min-width: 0; } .title { text-align: left; font-weight: var(--fw-medium); overflow-wrap: anywhere; }
  .meta { font-size: var(--fs-xs); } .detail { white-space: pre-wrap; overflow-wrap: anywhere; max-height: 120px; overflow: auto; font-size: var(--fs-sm); }
  .heading, .meta, .detail { grid-column: 1; }
  .actions { grid-column: 2; grid-row: 1 / span 3; display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
  .actions .btn { height: var(--control-h-sm); font-size: var(--fs-sm); }
  .error { padding: 12px 28px; white-space: pre-wrap; }
  @container (max-width: 640px) {
    article { grid-template-columns: minmax(0, 1fr); }
    .actions { grid-column: 1; grid-row: auto; justify-content: flex-start; margin-top: 8px; }
  }
  .err { color: var(--del-fg); }
</style>
