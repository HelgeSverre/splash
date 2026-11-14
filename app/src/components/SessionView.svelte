<script lang="ts">
  import Transcript from "./Transcript.svelte";
  import Composer from "./Composer.svelte";
  import RpcLog from "./RpcLog.svelte";
  import FileTab from "./FileTab.svelte";
  import DiffTab from "./DiffTab.svelte";
  import type { Snippet } from "svelte";
  import SessionHistoryActions, { type HistoryMessages } from "./SessionHistoryActions.svelte";
  import SessionHeader from "./SessionHeader.svelte";
  import Tabs, { type TabItem } from "./ui/Tabs.svelte";
  import { modalOpen, isComposer, isTypingTarget } from "../lib/focus";
  import { api, type SessionView } from "../bindings";
  import { transcripts, pendingPermission } from "../lib/transcripts.svelte";
  import { sessionTabs, closeTab, selectTab, type PaneTools } from "../lib/tabs.svelte";
  import { showError } from "../lib/system";
  import { basename } from "../lib/paths";

  let { session }: { session: SessionView } = $props();

  const t = $derived(transcripts[session.id]);
  const tabs = $derived(sessionTabs(session.id));
  const pending = $derived(t ? pendingPermission(t.entries) : undefined);
  let history = $state<HistoryMessages>({ busy: "", error: "", notice: "" });

  // The open pane's own controls (a diff's layout, a file's size) sit at the
  // right of the tab bar rather than on a bar of their own. A pane hands its
  // snippet over while it is the active one.
  let tools = $state.raw<{ owner: object; snippet: Snippet } | null>(null);
  function setTools(owner: object, snippet: PaneTools | null) {
    if (snippet) tools = { owner, snippet: snippet as unknown as Snippet };
    else if (tools?.owner === owner) tools = null;
  }

  // 1–9 answers a pending permission, but only from the chat itself: the page,
  // the transcript, the card, or an empty message box. Never from the
  // terminal, a field, a control elsewhere, or behind a dialog.
  function onkeydown(e: KeyboardEvent) {
    if (!pending || e.metaKey || e.ctrlKey || e.altKey || modalOpen()) return;
    const el = e.target as HTMLElement;
    const emptyComposer = isComposer(el) && !(el as HTMLTextAreaElement).value;
    const inChat = el === document.body || !!el.closest?.(".transcript");
    if (!emptyComposer && (isTypingTarget(el) || !inChat)) return;
    const n = Number(e.key);
    const opt = pending.options[n - 1];
    if (opt) {
      e.preventDefault();
      api.resolve_permission(session.id, pending.request_id, opt.id).catch(showError);
    }
  }

  const tabLabel = (tab: (typeof tabs.list)[number]) =>
    tab.kind === "chat" ? "Chat" : tab.kind === "log" ? "Log" : basename(tab.path);

  // Tabs are keyed by position; the Tabs bar handles the keyboard.
  const prefix = $derived(`stab-${session.id}`);
  const tabItems: TabItem[] = $derived(
    tabs.list.map((tab, i) => ({
      id: String(i),
      label: tabLabel(tab),
      prefix: tab.kind === "diff" ? "±" : undefined,
      closable: tab.kind !== "chat",
      title: "path" in tab ? tab.path : undefined,
      data: { kind: tab.kind, ...("path" in tab ? { path: tab.path } : {}) },
    })),
  );
</script>

<svelte:window {onkeydown} />

<div class="session">
  <SessionHeader {session}>
    {#snippet actions()}{#key session.id}<SessionHistoryActions {session} bind:messages={history} />{/key}{/snippet}
  </SessionHeader>
  {#if history.busy || history.error || history.notice}
    <div class="history-status" data-testid="history-status">
      {#if history.busy}<p class="notice" role="status" data-testid="history-busy">{history.busy}</p>{/if}
      {#if history.error}<p class="error" role="alert" data-testid="history-error">{history.error}</p>{/if}
      {#if history.notice}<p class="notice" role="status" data-testid="history-notice">{history.notice}</p>{/if}
    </div>
  {/if}

  <!-- The chat alone needs no tab bar: it shows once a file, diff or the log is open. -->
  <div class="tabstrip" class:single={tabs.list.length < 2} data-testid="session-tabstrip" data-single={tabs.list.length < 2}>
    <Tabs data-testid="session-tabs" items={tabItems} active={String(tabs.active)} {prefix} label="Session tabs"
      onselect={(id) => selectTab(Number(id))} onclose={(id) => closeTab(Number(id))}>
      {#snippet actions()}
        <span class="tools" data-testid="session-tab-tools">{#if tools}{@render tools.snippet()}{/if}</span>
      {/snippet}
    </Tabs>
  </div>

  <div class="body">
    {#each tabs.list as tab, i (tab.kind === "chat" ? "chat" : `${tab.kind}:${"path" in tab ? tab.path : ""}`)}
      <div class="pane" class:hidden={i !== tabs.active} data-testid="session-pane" data-active={i === tabs.active} role="tabpanel" id="{prefix}-panel-{i}" aria-labelledby="{prefix}-tab-{i}">
        {#if tab.kind === "chat"}
          <div class="chat">
            <div class="transcript">
              <Transcript {session} entries={t?.entries ?? []} loading={t?.loading ?? true} active={i === tabs.active} />
            </div>
            <Composer {session} />
          </div>
        {:else if tab.kind === "log"}
          <RpcLog session={session.id} />
        {:else if tab.kind === "file"}
          <FileTab {session} path={tab.path} line={tab.line} active={i === tabs.active} {setTools} />
        {:else if tab.kind === "diff"}
          <DiffTab {session} path={tab.path} active={i === tabs.active} {setTools} />
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .session { height: 100%; display: flex; flex-direction: column; min-width: 0; }
  .tabstrip.single { display: none; }
  .tools { display: flex; align-items: center; gap: 10px; padding-right: 4px; font-size: var(--fs-sm); color: var(--text-2); white-space: nowrap; }
  .history-status { flex: none; padding: 6px var(--gutter); border-bottom: 1px solid var(--border); font-size: var(--fs-xs); }
  .history-status p { margin: 0; overflow-wrap: anywhere; }
  .history-status .notice { color: var(--muted); }
  .history-status .error { color: var(--del-fg); white-space: pre-wrap; }
  .body { flex: 1; min-height: 0; position: relative; }
  .pane { position: absolute; inset: 0; }
  .pane.hidden { display: none; }
  .chat { height: 100%; display: flex; flex-direction: column; }
  .transcript { flex: 1; min-height: 0; }
</style>
