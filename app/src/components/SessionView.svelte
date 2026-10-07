<script lang="ts">
  import Transcript from "./Transcript.svelte";
  import Composer from "./Composer.svelte";
  import RpcLog from "./RpcLog.svelte";
  import FileTab from "./FileTab.svelte";
  import DiffTab from "./DiffTab.svelte";
  import SessionHistoryActions from "./SessionHistoryActions.svelte";
  import SessionHeader from "./SessionHeader.svelte";
  import Tabs, { type TabItem } from "./ui/Tabs.svelte";
  import { modalOpen, isComposer, isTypingTarget } from "../lib/focus";
  import { api, type SessionView } from "../bindings";
  import { transcripts, pendingPermission } from "../lib/transcripts.svelte";
  import { sessionTabs, closeTab, selectTab, openTab } from "../lib/tabs.svelte";
  import { showError } from "../lib/system";
  import { basename } from "../lib/paths";

  let { session }: { session: SessionView } = $props();

  const t = $derived(transcripts[session.id]);
  const tabs = $derived(sessionTabs(session.id));
  const pending = $derived(t ? pendingPermission(t.entries) : undefined);

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
  <SessionHeader {session} />
  {#key session.id}<SessionHistoryActions {session} />{/key}

  <Tabs data-testid="session-tabs" items={tabItems} active={String(tabs.active)} {prefix} label="Session tabs"
    onselect={(id) => selectTab(Number(id))} onclose={(id) => closeTab(Number(id))}>
    {#snippet actions()}
      {#if !tabs.list.some((x) => x.kind === "log")}
        <button class="plain log-tab focus-inset" data-testid="session-open-log" onclick={() => openTab({ kind: "log" })} title="Raw JSON-RPC traffic">Log</button>
      {/if}
    {/snippet}
  </Tabs>

  <div class="body">
    {#each tabs.list as tab, i (tab.kind === "chat" ? "chat" : `${tab.kind}:${"path" in tab ? tab.path : ""}`)}
      <div class="pane" class:hidden={i !== tabs.active} data-testid="session-pane" data-active={i === tabs.active} role="tabpanel" id="{prefix}-panel-{i}" aria-labelledby="{prefix}-tab-{i}">
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
  /* Opens the Log tab: drawn like a tab, with the tab's inset ring. */
  .log-tab { display: flex; align-items: center; align-self: stretch; padding: 0 10px; font-size: var(--fs-sm); color: var(--muted); }
  .log-tab:is(:hover, :focus-visible) { color: var(--text); }
  .body { flex: 1; min-height: 0; position: relative; }
  .pane { position: absolute; inset: 0; }
  .pane.hidden { display: none; }
  .chat { height: 100%; display: flex; flex-direction: column; }
  .transcript { flex: 1; min-height: 0; }
</style>
