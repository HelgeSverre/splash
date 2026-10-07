<script lang="ts">
  import { tick } from "svelte";
  import EntryView from "./entries/Entry.svelte";
  import type { Entry, SessionView } from "../bindings";
  import { home } from "../lib/paths";
  import SplashMark from "./SplashMark.svelte";
  import EmptyState from "./ui/EmptyState.svelte";
  import { agentById, app } from "../lib/sessions.svelte";
  import { pendingPermission } from "../lib/transcripts.svelte";

  let { session, entries, loading }: { session: SessionView; entries: Entry[]; loading: boolean } = $props();

  let scroller: HTMLDivElement | undefined = $state();
  let pinned = true;

  function onscroll() {
    if (!scroller) return;
    pinned = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight < 60;
  }

  // Follow new output while pinned to the bottom.
  $effect(() => {
    // Track: number of entries and the last entry's text length.
    const last = entries[entries.length - 1];
    void entries.length;
    void (last && "text" in last ? last.text.length : 0);
    void (last && last.kind === "tool" ? last.status : "");
    if (!pinned || app.focusEntry !== null) return;
    tick().then(() => scroller && (scroller.scrollTop = scroller.scrollHeight));
  });

  // Jump to the bottom when switching sessions.
  $effect(() => {
    void session.id;
    pinned = app.focusEntry === null;
    if (!pinned) return;
    tick().then(() => scroller && (scroller.scrollTop = scroller.scrollHeight));
  });

  $effect(() => {
    const index = app.focusEntry;
    if (index !== null && !loading && entries[index]) {
      pinned = false;
      tick().then(() => document.getElementById(`entry-${session.id}-${index}`)?.scrollIntoView({ block: "center" }));
    }
  });

  const agentName = $derived(agentById(session.agent_id)?.name ?? session.agent_id);
  // Nothing said yet: only agent notices or dividers (a new session starting
  // up) still get the centred empty or starting screen, notices above it.
  const quiet = $derived(entries.every((e) => e.kind === "notice" || e.kind === "divider"));

  const lastIsStreaming = $derived.by(() => {
    const l = entries[entries.length - 1];
    return !!l && (l.kind === "agent" || l.kind === "thought") && l.streaming;
  });
</script>

<!-- A scroll pane: tabindex so the keyboard reaches it in WebKit too. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div class="scroller scroll-region" bind:this={scroller} {onscroll} tabindex="0" role="region" aria-label="Transcript" data-testid="transcript">
  <div class="column">
    {#if loading || quiet}
      <div class="empty" data-testid="transcript-empty">
        <EmptyState {loading} mono
          title={loading ? undefined : session.status === "starting" ? `Starting ${agentName}…` : "What should we work on?"}
          detail={loading ? undefined : `${home(session.cwd)}${session.branch ? ` · ${session.branch}` : ""}`}>
          {#snippet graphic()}<SplashMark size={40} />{/snippet}
        </EmptyState>
      </div>
    {/if}

    {#each entries as e, i (i)}
      <div id={`entry-${session.id}-${i}`} class:matched={app.focusEntry === i} data-testid="entry" data-kind={e.kind} data-index={i} data-matched={app.focusEntry === i || undefined}><EntryView entry={e} {session} /></div>
    {/each}

    {#if quiet}
      <!-- the centred empty state covers it -->
    {:else if session.status === "starting"}
      <div class="hint" data-testid="transcript-hint"><span class="spinner"></span> Starting {agentName}…</div>
    {:else if session.status === "running" && !lastIsStreaming}
      <div class="hint" data-testid="transcript-hint"><span class="spinner"></span> Working…</div>
    {:else if session.status === "awaiting_permission"}
      <div class="hint waiting" data-testid="transcript-hint">Waiting for you: press 1 to {Math.max(1, pendingPermission(entries)?.options.length ?? 1)} or click an option.</div>
    {/if}
  </div>
</div>

<style>
  /* Chat focus is quiet: you tab through a lot here. Everything inside gets a
     1px tinted outline plus a faint accent wash layered over its own
     background (so buttons and code blocks keep their colours); the scroller
     itself only gets the outline, inset. */
  .scroller {
    --focus-ring-color: var(--focus-soft-ring);
    --focus-ring-width: 1px;
    --focus-ring-offset: 1px;
  }
  .scroller:focus-visible { outline-offset: -1px; }
  .scroller :global(:focus-visible) { background-image: linear-gradient(var(--focus-soft-bg), var(--focus-soft-bg)); }
  .scroller { position: relative; height: 100%; overflow-y: auto; overflow-x: hidden; }
  .matched { background: var(--accent-soft); border-radius: var(--radius); }
  .column { max-width: 860px; margin: 0 auto; padding: 24px 28px 32px; }
  /* Centred on the whole scroller, not the padded column. */
  .empty { position: absolute; inset: 0; display: flex; pointer-events: none; }
  .hint { display: flex; align-items: center; gap: 8px; margin: 12px 0; color: var(--muted); }
  .hint.waiting { color: var(--accent); }
</style>
