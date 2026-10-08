<script lang="ts">
  import { api, type SessionView } from "../bindings";
  import { app, applySession, deleteSession, drafts, openSession } from "../lib/sessions.svelte";
  import { openTranscript } from "../lib/transcripts.svelte";
  import { invalidateHistory } from "../lib/agent-history.svelte";
  import { sourceIsNewer } from "../lib/session-history";
  import { errorMessage } from "../lib/format";
  import { serverUnavailable } from "../lib/server.svelte";
  import { home } from "../lib/paths";
  import Modal from "./ui/Modal.svelte";
  import ModalHeader from "./ui/ModalHeader.svelte";
  import Tag from "./ui/Tag.svelte";

  let { session }: { session: SessionView } = $props();
  let busy = $state("");
  let error = $state("");
  let notice = $state("");
  let panel = $state<"manage" | "fork" | null>(null);
  let confirm = $state<"native" | "local" | "dirty" | null>(null);
  const source = $derived(session.source ?? {});
  const caps = $derived(session.meta.history_capabilities ?? source.capabilities);
  const disconnected = $derived(["exited", "error"].includes(session.status));
  const working = $derived(["starting", "running", "awaiting_permission"].includes(session.status));
  const native = $derived(!!session.agent_session_id && !source.deleted);
  const newer = $derived(sourceIsNewer(source));
  const parent = $derived(app.sessions.find((s) => s.id === session.parent_id));
  const actionHint = $derived(!disconnected ? "Disconnect the agent first." : "");
  const localLabel = $derived(session.isolation === "worktree" && !session.external ? "Delete local session" : "Remove local copy");
  const date = (value: string | null | undefined) => value ? (Number.isFinite(Date.parse(value)) ? new Date(value).toLocaleString() : value) : "Not reported";
  function close() { if (!busy) { panel = null; confirm = null; } }
  async function run(action: "refresh" | "disconnect" | "capabilities" | "delete" | "remove" | "discard" | "fork" | "review") {
    if (busy) return;
    const id = session.id;
    const agentId = session.agent_id;
    busy = action; error = ""; notice = "";
    try {
      if (action === "refresh") {
        applySession(await api.refresh_session_history(id));
        await openTranscript(id);
        notice = "History refreshed from the agent.";
      } else if (action === "disconnect") {
        await api.disconnect_session(id);
        notice = "Agent disconnected. Your local history is saved.";
      } else if (action === "capabilities") {
        const capabilities = await api.session_history_capabilities(id);
        applySession({ ...session, source: { ...session.source, capabilities } });
      } else if (action === "delete") {
        applySession(await api.delete_agent_history(id));
        invalidateHistory(agentId); confirm = null;
        notice = "Removed from agent history. Your local transcript is still available.";
      } else if (action === "remove" || action === "discard") {
        // A dirty worktree needs a second, explicit confirmation.
        try { await deleteSession(id, action === "discard"); }
        catch (e) { if (errorMessage(e) !== "dirty") throw e; confirm = "dirty"; return; }
        invalidateHistory(agentId);
      } else {
        const child = await api.fork_session(id);
        applySession(child); invalidateHistory(agentId);
        if (action === "review") drafts[child.id] = "Review the work in the parent conversation. Check the current changes for correctness, regressions, and missing validation. Report concrete findings with file locations and explain what you verified. Do not change files during this review.";
        panel = null;
        await openSession(child.id);
      }
    } catch (e) { error = errorMessage(e); }
    finally { busy = ""; }
  }
</script>

<div class="history-bar" data-testid="history-bar" data-sync={source.deleted ? "deleted" : newer ? "outdated" : source.last_synced_at ? "synced" : "unsynced"}>
  <div class="context">
    {#if source.deleted}<Tag tone="muted">Local history only</Tag>
    {:else if newer}<Tag tone="warn">New activity at agent</Tag>
    {:else if source.last_synced_at}<span>Synced {new Date(source.last_synced_at * 1000).toLocaleString()}</span>
    {:else}<span>Agent history</span>{/if}
    {#if session.parent_id}<button class="plain parent" data-testid="history-parent" data-session-id={session.parent_id} disabled={!parent} onclick={() => parent && openSession(parent.id)}>Fork of {parent?.title ?? "removed local session"}</button>{/if}
  </div>
  <div class="buttons">
    {#if !disconnected}<button class="btn sm" data-testid="history-disconnect" disabled={!!busy || working || serverUnavailable()} onclick={() => run("disconnect")}>Disconnect agent</button>{/if}
    {#if native && !caps}<button class="btn sm" data-testid="history-check-support" disabled={!!busy || serverUnavailable()} onclick={() => run("capabilities")}>Check history support</button>{/if}
    {#if native && caps?.load}<button class="btn sm" data-testid="history-refresh" title={actionHint} disabled={!!busy || !disconnected || serverUnavailable()} onclick={() => run("refresh")}>{busy === "refresh" ? "Refreshing…" : "Refresh from agent"}</button>{/if}
    {#if native && caps?.fork && caps.load}<button class="btn sm" data-testid="history-fork" title={actionHint} disabled={!!busy || !disconnected || serverUnavailable()} onclick={() => { panel = "fork"; error = ""; }}>Fork conversation</button>{/if}
    <button class="btn sm" data-testid="history-manage" disabled={!!busy} onclick={() => { panel = "manage"; error = ""; }}>Manage history</button>
  </div>
  {#if error && !panel}<p class="error" role="alert" data-testid="history-error">{error}</p>{/if}
  {#if notice}<p class="notice" role="status" data-testid="history-notice">{notice}</p>{/if}
</div>

{#if panel}
  <Modal data-testid="history-dialog" data-panel={panel} label={panel === "fork" ? "Fork conversation" : "Manage session history"} width="660px" onclose={close}>
    <ModalHeader title={panel === "fork" ? "Fork conversation" : "Manage session history"} onclose={close} />
    <div class="body">
      <h2 data-testid="history-dialog-title">{session.title}</h2>
      {#if panel === "fork"}
        <p>Create a separate conversation with the agent’s current context. Your original conversation stays available.</p>
        <p>The fork shares these workspace folders, so file changes are shared too. Forking is experimental and depends on your agent.</p>
      {/if}
      <div class="workspace"><h3>Workspace folders</h3><p data-testid="history-dialog-folder" data-path={session.cwd}>{home(session.cwd)}</p>{#each (session.additional_directories ?? []) as path}<p data-testid="history-dialog-folder" data-path={path}>{home(path)}</p>{/each}</div>
      {#if panel === "manage"}
        <dl>
          <dt>Agent session</dt><dd data-testid="history-agent-session">{session.agent_session_id ?? "Not created yet"}</dd>
          <dt>Agent title</dt><dd>{source.title ?? "Not reported"}</dd>
          <dt>Agent activity</dt><dd>{date(source.updated_at)}</dd>
          <dt>Last synced</dt><dd>{source.last_synced_at ? new Date(source.last_synced_at * 1000).toLocaleString() : "Not synced yet"}</dd>
          {#if caps}<dt>Available actions</dt><dd>{[caps.list && "List", caps.load && "Refresh", caps.resume && "Resume", caps.close && "Close", caps.delete && "Delete", caps.fork && "Fork (experimental)", caps.additional_directories && "Extra folders"].filter(Boolean).join(" · ") || "No history actions advertised"}</dd>{/if}
        </dl>
        {#if source.metadata_json}<details><summary>Agent metadata</summary><pre>{source.metadata_json}</pre></details>{/if}
        {#if !disconnected}<p data-testid="history-disconnect-first">Disconnect the agent before changing its saved history.</p>{/if}
        {#if confirm}
          <div class="confirmation" role="group" aria-label="Confirm deletion" data-testid="history-confirm" data-confirm={confirm}>
            <h3 data-testid="history-confirm-title">{confirm === "native" ? "Delete from agent history?" : confirm === "dirty" ? "Discard uncommitted changes?" : `${localLabel}?`}</h3>
            <p data-testid="history-confirm-message">{confirm === "native" ? "The agent will remove this conversation from its session list. It may delete or archive its stored data. Splash keeps your local transcript as a read-only copy." : confirm === "dirty" ? "The worktree has uncommitted changes. Delete anyway and permanently discard them? Keeping the branch does not preserve uncommitted changes." : session.isolation === "worktree" && !session.external ? "This deletes the local transcript and its worktree. The Git branch and agent's saved conversation remain." : "This removes the transcript from Splash. Your files and the agent’s saved conversation remain."}</p>
            <div class="buttons"><button class="btn" data-testid="history-confirm-cancel" disabled={!!busy} onclick={() => confirm = null}>Cancel</button><button class="btn danger" data-testid="history-confirm-delete" disabled={!!busy || !disconnected || serverUnavailable()} onclick={() => run(confirm === "native" ? "delete" : confirm === "dirty" ? "discard" : "remove")}>{busy ? "Working…" : confirm === "native" ? "Delete from agent history" : confirm === "dirty" ? "Discard & delete" : localLabel}</button></div>
          </div>
        {:else}
          <div class="buttons management">
            {#if native && caps?.delete}<button class="btn" data-testid="history-delete-agent" disabled={!!busy || !disconnected} onclick={() => confirm = "native"}>Delete agent history…</button>{/if}
            <button class="btn" data-testid="history-remove-local" data-worktree={session.isolation === "worktree" && !session.external} disabled={!!busy || !disconnected} onclick={() => confirm = "local"}>{localLabel}…</button>
            {#if native}<button class="btn ghost" data-testid="history-recheck" disabled={!!busy || serverUnavailable()} onclick={() => run("capabilities")}>{busy === "capabilities" ? "Checking…" : "Recheck support"}</button>{/if}
          </div>
        {/if}
      {:else}
        <div class="buttons fork-actions">
          <button class="btn" data-testid="history-fork-cancel" disabled={!!busy} onclick={close}>Cancel</button>
          <button class="btn" data-testid="history-fork-review" disabled={!!busy || !disconnected || serverUnavailable()} onclick={() => run("review")}>Fork for review</button>
          <button class="btn primary" data-testid="history-fork-separate" disabled={!!busy || !disconnected || serverUnavailable()} onclick={() => run("fork")}>{busy ? "Forking…" : "Try another approach"}</button>
        </div>
        <p class="note">Fork for review prepares a review message in the new conversation for you to send.</p>
      {/if}
      {#if error}<p class="error" role="alert" data-testid="history-dialog-error">{error}</p>{/if}
    </div>
  </Modal>
{/if}

<style>
  .history-bar { display: flex; align-items: center; gap: 10px; padding: 10px var(--gutter); border-bottom: 1px solid var(--border); flex-wrap: wrap; font-size: var(--fs-xs); }
  .context { flex: 1; display: flex; flex-direction: column; align-items: start; gap: 6px; color: var(--muted); min-width: 150px; }
  .buttons { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; } .parent { color: var(--accent); text-align: left; }
  .notice, .error { flex-basis: 100%; margin: 4px 0; overflow-wrap: anywhere; } .notice { color: var(--muted); } .error { color: var(--del-fg); white-space: pre-wrap; }
  .body { padding: 20px; overflow: auto; font-size: var(--fs-sm); } h2 { font-size: var(--fs-lg); margin: 0 0 14px; } h3 { font-size: var(--fs-sm); margin: 0 0 8px; } p { color: var(--text-2); line-height: 1.5; }
  .workspace { background: var(--row-hover); padding: 14px; border-radius: var(--radius); margin: 16px 0; } .workspace p { margin: 6px 0 0; font-family: var(--font-mono); overflow-wrap: anywhere; font-size: var(--fs-xs); }
  dl { display: grid; grid-template-columns: 105px 1fr; gap: 10px 16px; } dt { color: var(--muted); } dd { margin: 0; overflow-wrap: anywhere; }
  details { margin: 14px 0; } summary { cursor: pointer; } pre { white-space: pre-wrap; overflow-wrap: anywhere; color: var(--muted); }
  .confirmation { padding: 14px; border: 1px solid var(--border-strong); border-radius: var(--radius); margin-top: 20px; } .management, .fork-actions { margin-top: 20px; } .note { color: var(--muted); font-size: var(--fs-xs); } .danger { color: var(--del-fg); }
</style>
