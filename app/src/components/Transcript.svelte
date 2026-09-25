<script lang="ts">
  import { tick } from "svelte";
  import EntryView from "./entries/Entry.svelte";
  import type { Entry, SessionView } from "../bindings";
  import { home } from "../lib/paths";
  import SplashMark from "./SplashMark.svelte";
  import EmptyState from "./ui/EmptyState.svelte";
  import { agentById } from "../lib/sessions.svelte";
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
    if (!pinned) return;
    tick().then(() => scroller && (scroller.scrollTop = scroller.scrollHeight));
  });

  // Jump to the bottom when switching sessions.
  $effect(() => {
    void session.id;
    pinned = true;
    tick().then(() => scroller && (scroller.scrollTop = scroller.scrollHeight));
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
<div class="scroller scroll-region" bind:this={scroller} {onscroll} tabindex="0" role="region" aria-label="Transcript">
  <div class="column">
    {#if loading || quiet}
      <div class="empty">
        <EmptyState {loading} mono
          title={loading ? undefined : session.status === "starting" ? `Starting ${agentName}…` : "What should we work on?"}
          detail={loading ? undefined : `${home(session.cwd)}${session.branch ? ` · ${session.branch}` : ""}`}>
          {#snippet graphic()}<SplashMark size={40} />{/snippet}
        </EmptyState>
      </div>
    {/if}

    {#each entries as e, i (i)}
      <EntryView entry={e} {session} />
    {/each}

    {#if quiet}
      <!-- the centred empty state covers it -->
    {:else if session.status === "starting"}
      <div class="hint"><span class="spinner"></span> Starting {agentName}…</div>
    {:else if session.status === "running" && !lastIsStreaming}
      <div class="hint"><span class="spinner"></span> Working…</div>
    {:else if session.status === "awaiting_permission"}
      <div class="hint waiting">Waiting for you: press 1 to {Math.max(1, pendingPermission(entries)?.options.length ?? 1)} or click an option.</div>
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
  .column { max-width: 860px; margin: 0 auto; padding: 24px 28px 32px; }
  /* Centred on the whole scroller, not the padded column. */
  .empty { position: absolute; inset: 0; display: flex; pointer-events: none; }
  .hint { display: flex; align-items: center; gap: 8px; margin: 12px 0; color: var(--muted); }
  .hint.waiting { color: var(--accent); }
</style>
