<script lang="ts">
  import { prompt as askText, shell } from "@elyra/runtime";
  import AgentIcon from "./AgentIcon.svelte";
  import Transcript from "./Transcript.svelte";
  import Composer from "./Composer.svelte";
  import RpcLog from "./RpcLog.svelte";
  import FileTab from "./FileTab.svelte";
  import DiffTab from "./DiffTab.svelte";
  import { api, type SessionView, type GitInfo } from "../bindings";
  import { transcripts, agentById, sessionTabs, closeTab, openTab, showError } from "../lib/state.svelte";
  import { home, basename } from "../lib/paths";

  import { layout } from "../lib/state.svelte";

  let {
    session,
    ontoggleright,
    ontogglebottom,
  }: { session: SessionView; ontoggleright?: () => void; ontogglebottom?: () => void } = $props();

  const t = $derived(transcripts[session.id]);
  const tabs = $derived(sessionTabs(session.id));
  const agent = $derived(agentById(session.agent_id));
  const usage = $derived(session.meta.usage);

  const pendingPermission = $derived(
    t?.entries.findLast((e) => e.kind === "permission" && !e.resolution) as
      | Extract<import("../bindings").Entry, { kind: "permission" }>
      | undefined,
  );

  const STATUS: Record<string, string> = {
    starting: "starting", idle: "ready", running: "working", awaiting_permission: "needs you", error: "error", exited: "stopped",
  };

  async function rename() {
    const title = await askText("Rename session", { defaultValue: session.title });
    if (title && title.trim() && title !== session.title) api.rename_session(session.id, title).catch(showError);
  }


  // Upstream context: remote, branch and PR (refreshed when a turn finishes).
  let git: GitInfo | null = $state(null);
  let lastStatus = "";
  $effect(() => {
    const id = session.id;
    const status = session.status;
    const finished = lastStatus === "running" && status === "idle";
    if (!git || finished) api.session_git(id, finished).then((g) => (git = g)).catch(() => {});
    lastStatus = status;
  });
  const open = (url: string | null | undefined) => url && shell.openExternal(url).catch(() => {});
  const branch = $derived(git?.branch ?? session.branch);

  // 1–9 answers a pending permission when you're not typing.
  function onkeydown(e: KeyboardEvent) {
    if (!pendingPermission || e.metaKey || e.ctrlKey || e.altKey) return;
    const el = e.target as HTMLElement;
    if (el.tagName === "TEXTAREA" && (el as HTMLTextAreaElement).value) return;
    if (el.tagName === "INPUT") return;
    const n = Number(e.key);
    const opt = pendingPermission.options[n - 1];
    if (opt) {
      e.preventDefault();
      api.resolve_permission(session.id, pendingPermission.request_id, opt.id).catch(showError);
    }
  }

  const tabLabel = (tab: (typeof tabs.list)[number]) =>
    tab.kind === "chat" ? "Chat" : tab.kind === "log" ? "Log" : basename(tab.path);
</script>

<svelte:window {onkeydown} />

<div class="session">
  <header>
    <button class="plain title" onclick={rename} title="Rename"><span class="title-text">{session.title}</span></button>
    <span class="agent"><AgentIcon id={session.agent_id} size={13} /> {agent?.name ?? session.agent_id}</span>
    {#if git?.repo}
      <button class="plain link repo" title={git.web_url} onclick={() => open(git?.web_url)}>{git.repo}</button>
    {/if}
    {#if branch}
      <button class="plain link branch" disabled={!git?.branch_url}
        title={session.isolation === "worktree" ? `worktree at ${session.cwd}` : `in place · ${session.cwd}`}
        onclick={() => open(git?.branch_url)}>
        <svg width="11" height="11" viewBox="0 0 16 16"><circle cx="4.5" cy="3.5" r="1.8" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="4.5" cy="12.5" r="1.8" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="11.5" cy="5.5" r="1.8" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M4.5 5.3v5.4M11.5 7.3c0 3-7 2-7 3.4" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>
        {branch}
      </button>
    {:else}
      <span class="link">{home(session.cwd)}</span>
    {/if}
    {#if git?.pr}
      <button class="plain link pr {git.pr.state.toLowerCase()}" title={git.pr.title} onclick={() => open(git?.pr?.url)}>
        PR #{git.pr.number}<span class="pr-state">{git.pr.state.toLowerCase()}</span>
      </button>
    {/if}
    <span class="status {session.status}"><span class="dot {session.status}"></span>{STATUS[session.status]}</span>
    {#if session.archived}<span class="archived">archived</span>{/if}

    <span class="spacer"></span>

    {#if usage?.cost_usd}<span class="cost" title="session cost reported by the agent">${usage.cost_usd.toFixed(2)}</span>{/if}
    <span class="toggles">
      <button class="plain" class:on={layout.bottomOpen} title="Terminal (⌘J)" onclick={ontogglebottom}>
        <svg width="14" height="14" viewBox="0 0 16 16"><rect x="1.5" y="2.5" width="13" height="11" rx="1.5" fill="none" stroke="currentColor"/><path d="M1.5 9.5h13" stroke="currentColor"/>{#if layout.bottomOpen}<rect x="2" y="10" width="12" height="3" fill="currentColor"/>{/if}</svg>
      </button>
      <button class="plain" class:on={layout.rightOpen} title="Changes & files (⌥⌘B)" onclick={ontoggleright}>
        <svg width="14" height="14" viewBox="0 0 16 16"><rect x="1.5" y="2.5" width="13" height="11" rx="1.5" fill="none" stroke="currentColor"/><path d="M10.5 2.5v11" stroke="currentColor"/>{#if layout.rightOpen}<rect x="11" y="3" width="3" height="10" fill="currentColor"/>{/if}</svg>
      </button>
    </span>
  </header>

  <div class="tabs">
    {#each tabs.list as tab, i (i)}
      <div class="tab" class:active={i === tabs.active}>
        <button class="plain tab-btn" onclick={() => (tabs.active = i)} title={"path" in tab ? tab.path : ""}>
          {#if tab.kind === "diff"}<span class="tab-kind">±</span>{/if}
          {tabLabel(tab)}
        </button>
        {#if tab.kind !== "chat"}<button class="plain close" onclick={() => closeTab(i)} title="Close">×</button>{/if}
      </div>
    {/each}
    <span class="spacer"></span>
    {#if !tabs.list.some((x) => x.kind === "log")}
      <button class="plain tab-btn subtle" onclick={() => openTab({ kind: "log" })} title="Raw JSON-RPC traffic">Log</button>
    {/if}
  </div>

  <div class="body">
    {#each tabs.list as tab, i (tab.kind === "chat" ? "chat" : `${tab.kind}:${"path" in tab ? tab.path : ""}`)}
      <div class="pane" class:hidden={i !== tabs.active}>
        {#if tab.kind === "chat"}
          <div class="chat">
            <div class="transcript">
              <Transcript {session} entries={t?.entries ?? []} loading={t?.loading ?? true} />
            </div>
            <Composer {session} />
          </div>
        {:else if tab.kind === "log"}
          <RpcLog session={session.id} />
        {:else if tab.kind === "file"}
          <FileTab {session} path={tab.path} line={tab.line} />
        {:else if tab.kind === "diff"}
          <DiffTab {session} path={tab.path} />
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .session { height: 100%; display: flex; flex-direction: column; min-width: 0; }
  header {
    display: flex; align-items: center; gap: 12px; min-width: 0;
    padding: 0 12px 0 16px; height: 44px; border-bottom: 1px solid var(--border); flex: none;
  }
  button { font: inherit; color: inherit; }
  .title-text { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .title { display: block; cursor: text; font-weight: 600; font-size: 14px; letter-spacing: -0.01em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 60px; flex: 0 1 auto; }
  .agent { display: inline-flex; align-items: center; gap: 6px; color: var(--text-2); flex: none; font-size: 12px; }
  .link {
    display: inline-flex; align-items: center; gap: 5px; min-width: 0; font-size: 12px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .link:hover:not(:disabled) { color: var(--text); }
  .link:disabled { cursor: default; }
  .link svg { flex: none; }
  .repo { flex: 0 3 auto; }
  .branch { flex: 0 2 auto; font-family: var(--font-mono); font-size: 11.5px; }
  .pr { flex: none; gap: 6px; }
  .pr-state { font-size: 10.5px; padding: 0 6px; border-radius: 999px; border: 1px solid var(--border-strong); }
  .pr.open .pr-state { color: var(--ok-dim); border-color: var(--ok-border); }
  .pr.merged .pr-state { color: var(--purple); border-color: var(--purple-border); }
  .pr.closed .pr-state { color: var(--err-dim); border-color: var(--err-border); }
  .status { display: inline-flex; align-items: center; gap: 6px; color: var(--muted); font-size: 12px; flex: none; }
  .status.running, .status.starting, .status.awaiting_permission { color: var(--accent); }
  .status.error { color: var(--err); }
  .archived { font: 11px var(--font-mono); color: var(--muted); border: 1px solid var(--border-strong); border-radius: 999px; padding: 0 7px; }
  .spacer { flex: 1; }
  .cost { font: 11.5px var(--font-mono); color: var(--muted); flex: none; }
  .toggles { display: flex; gap: 2px; flex: none; margin-left: 4px; }
  .toggles button { width: 26px; height: 26px; display: grid; place-items: center; border-radius: var(--radius); color: var(--muted); }
  .toggles button:hover { background: var(--hover); color: var(--text); }
  .toggles button.on { color: var(--text-2); }
  .tabs { display: flex; align-items: stretch; gap: 0; padding: 0 8px; border-bottom: 1px solid var(--border); height: 32px; flex: none; overflow-x: auto; }
  .tab { display: flex; align-items: center; border-bottom: 2px solid transparent; margin-bottom: -1px; }
  .tab.active { border-bottom-color: var(--accent); }
  .tab-btn { padding: 0 10px; height: 100%; display: flex; align-items: center; gap: 5px; color: var(--muted); font-size: 12px; white-space: nowrap; }
  .tab.active .tab-btn, .tab-btn:hover { color: var(--text); }
  .tab-btn.subtle { font-family: var(--font-mono); font-size: 11px; }
  .tab-kind { color: var(--muted); font-family: var(--font-mono); }
  .close { color: var(--faint); padding: 0 6px 0 0; font-size: 14px; }
  .close:hover { color: var(--text); }
  .body { flex: 1; min-height: 0; position: relative; }
  .pane { position: absolute; inset: 0; }
  .pane.hidden { display: none; }
  .chat { height: 100%; display: flex; flex-direction: column; }
  .transcript { flex: 1; min-height: 0; }
</style>
