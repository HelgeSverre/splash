<script lang="ts">
  import { api, type SessionView } from "../bindings";
  import { app, openSession, projectById, agentById } from "../lib/sessions.svelte";
  import { showSideTab } from "../lib/layout.svelte";
  import EmptyState from "./ui/EmptyState.svelte";
  import AgentIcon from "./AgentIcon.svelte";
  import { errorMessage } from "../lib/format";
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
  <header><h1>Needs attention</h1><p>Permissions, interrupted work, and completed conversations stay here until resolved.</p></header>
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
              <p class="meta">{projectById(s.project_id)?.name} · {agentById(s.agent_id)?.name ?? s.agent_id} · {new Date((s.attention?.at ?? 0) * 1000).toLocaleString()}</p>
              <p class="detail" data-testid="attention-detail">{group.kind === "permission" && s.status !== "awaiting_permission" ? "The agent stopped while waiting for permission. Reconnect to continue; the old request can no longer be answered." : s.attention?.detail}</p>
              <div class="actions">
                <button class="btn primary" data-testid="attention-open" onclick={() => open(s)}>{group.kind === "permission" && s.status === "awaiting_permission" ? "Answer permission" : group.kind === "review" ? "Review response & changes" : "Open conversation"}</button>
                {#if s.status === "error" || s.status === "exited"}<button class="btn" data-testid="attention-reconnect" disabled={!!busy || serverUnavailable()} onclick={() => run(s, "retry")}>{busy === s.id ? "Working…" : "Reconnect agent"}</button>{/if}
                {#if group.kind !== "review"}<button class="btn" data-testid="attention-recheck" disabled={!!busy || serverUnavailable()} onclick={() => run(s, "check")}>Recheck agent</button>{/if}
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
  .inbox { height: 100%; display: flex; flex-direction: column; }
  header { padding: 24px 28px; border-bottom: 1px solid var(--border); }
  h1 { margin: 0 0 8px; font-size: var(--fs-xl); } p { margin: 0; color: var(--muted); }
  .content { padding: 24px 28px; overflow: auto; flex: 1; }
  section { margin-bottom: 28px; } h2 { font-size: var(--fs-sm); font-weight: var(--fw-medium); color: var(--text-2); margin: 0 0 12px; }
  h2 span { margin-left: 8px; color: var(--muted); }
  article { padding: 18px; border: 1px solid var(--border); background: var(--surface); border-radius: var(--radius); margin-bottom: 10px; }
  .heading { display: flex; align-items: center; gap: 10px; } .title { text-align: left; font-weight: var(--fw-medium); overflow-wrap: anywhere; }
  .meta { font-size: var(--fs-xs); margin: 8px 0; } .detail { white-space: pre-wrap; overflow-wrap: anywhere; max-height: 180px; overflow: auto; font-size: var(--fs-sm); }
  .actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; } .error { padding: 16px 28px; white-space: pre-wrap; }
  .err { color: var(--del-fg); }
</style>
