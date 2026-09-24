<script lang="ts">
  import { tick } from "svelte";
  import Markdown from "./entries/Markdown.svelte";
  import ToolCall from "./entries/ToolCall.svelte";
  import PermissionCard from "./entries/PermissionCard.svelte";
  import PlanView from "./entries/PlanView.svelte";
  import type { Entry, SessionView } from "../bindings";
  import { duration } from "../lib/format";
  import { home } from "../lib/paths";
  import SplashMark from "./SplashMark.svelte";

  let { session, entries, loading }: { session: SessionView; entries: Entry[]; loading: boolean } = $props();

  let scroller: HTMLDivElement | undefined = $state();
  let pinned = true;
  let openThoughts: Record<number, boolean> = $state({});

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

  const lastIsStreaming = $derived.by(() => {
    const l = entries[entries.length - 1];
    return !!l && (l.kind === "agent" || l.kind === "thought") && l.streaming;
  });
</script>

<div class="scroller" bind:this={scroller} {onscroll}>
  <div class="column">
    {#if loading || entries.length === 0}
      <div class="empty">
        <SplashMark size={40} />
        {#if loading}
          <p class="big"><span class="spinner"></span></p>
        {:else}
          <p class="big">{session.status === "starting" ? `Starting ${session.agent_id}…` : "What should we work on?"}</p>
          <p class="where">{home(session.cwd)}{session.branch ? ` · ${session.branch}` : ""}</p>
        {/if}
      </div>
    {/if}

    {#each entries as e, i (i)}
      {#if e.kind === "user"}
        <div class="user selectable">{e.text}</div>
      {:else if e.kind === "agent"}
        <div class="agent">
          {#if e.streaming}
            <div class="streaming selectable">{e.text}<span class="caret">▍</span></div>
          {:else}
            <Markdown text={e.text} />
          {/if}
        </div>
      {:else if e.kind === "thought"}
        <button class="plain thought" onclick={() => (openThoughts[i] = !openThoughts[i])}>
          <span class="thought-label">{e.streaming ? "Thinking…" : "Thought"} <span class="chev">{openThoughts[i] || e.streaming ? "▾" : "▸"}</span></span>
          {#if openThoughts[i] || e.streaming}
            <span class="thought-text selectable">{e.text}</span>
          {:else}
            <span class="thought-preview">{e.text.slice(0, 160).replace(/\s+/g, " ")}</span>
          {/if}
        </button>
      {:else if e.kind === "notice"}
        <button class="plain notice" onclick={() => (openThoughts[i] = !openThoughts[i])} title="Output from the agent outside a turn">
          <span class="notice-head">
            <span class="notice-icon">!</span>
            <span class="notice-label">Agent notice</span>
            {#if !openThoughts[i]}<span class="notice-preview">{e.text.trim().split("\n")[0]}</span>{/if}
            <span class="chev">{openThoughts[i] ? "▾" : "▸"}</span>
          </span>
          {#if openThoughts[i]}<pre class="notice-text selectable">{e.text.trim()}</pre>{/if}
        </button>
      {:else if e.kind === "tool"}
        <ToolCall entry={e} cwd={session.cwd} />
      {:else if e.kind === "plan"}
        <PlanView items={e.items} />
      {:else if e.kind === "permission"}
        <PermissionCard entry={e} session={session.id} cwd={session.cwd} />
      {:else if e.kind === "turn_end"}
        <div class="turn-end">
          <span>{e.stop_reason === "end_turn" ? "done" : e.stop_reason.replace("_", " ")}</span>
          {#if e.duration_ms > 0}<span>· {duration(e.duration_ms)}</span>{/if}
        </div>
      {:else if e.kind === "divider"}
        {#if e.text}<div class="divider"><span>{e.text}</span></div>{/if}
      {:else if e.kind === "error"}
        <pre class="error selectable">{e.text}</pre>
      {:else if e.kind === "unknown"}
        <details class="unknown"><summary>unrecognised update</summary><pre class="selectable">{e.json}</pre></details>
      {/if}
    {/each}

    {#if entries.length === 0}
      <!-- the centred empty state covers it -->
    {:else if session.status === "starting"}
      <div class="hint"><span class="spinner"></span> Starting {session.agent_id}…</div>
    {:else if session.status === "running" && !lastIsStreaming}
      <div class="hint"><span class="spinner"></span> Working…</div>
    {:else if session.status === "awaiting_permission"}
      <div class="hint waiting">Waiting for you: press 1–{Math.max(1, (entries.findLast((x) => x.kind === "permission" && !x.resolution) as any)?.options?.length ?? 1)} or click an option.</div>
    {/if}
  </div>
</div>

<style>
  .scroller { position: relative; height: 100%; overflow-y: auto; overflow-x: hidden; }
  .column { max-width: 860px; margin: 0 auto; padding: 24px 28px 32px; }
  .empty {
    position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 8px; text-align: center; pointer-events: none;
  }
  .empty :global(svg) { opacity: 0.12; filter: grayscale(1); margin-bottom: 6px; }
  .empty .big { margin: 0; font-size: 15px; font-weight: 600; color: var(--text-2); }
  .empty .where { margin: 0; font: 11.5px var(--font-mono); color: var(--faint); }
  .user {
    margin: 22px 0 14px; padding: 10px 14px; white-space: pre-wrap; overflow-wrap: anywhere;
    background: var(--raised); border: 1px solid var(--border); border-radius: 8px; color: var(--text);
  }
  .user:first-child { margin-top: 0; }
  .agent { margin: 10px 0; }
  .streaming { white-space: pre-wrap; overflow-wrap: anywhere; line-height: 1.6; }
  .caret { color: var(--accent); animation: blink 1s steps(1) infinite; margin-left: 1px; }
  @keyframes blink { 50% { opacity: 0; } }
  .thought {
    display: flex; flex-direction: column; gap: 2px; width: 100%; margin: 8px 0; color: var(--muted); font-size: 12.5px; line-height: 1.55;
  }
  .thought:hover { color: var(--text-2); }
  .thought-label { font: 11px var(--font-mono); color: var(--faint); }
  .thought:hover .thought-label { color: var(--muted); }
  .chev { font-size: 9px; margin-left: 2px; }
  .thought-text { white-space: pre-wrap; font-style: italic; }
  .thought-preview { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-style: italic; }
  .notice { display: block; width: 100%; margin: 6px 0; }
  .notice-head { display: flex; align-items: center; gap: 8px; min-width: 0; font-size: 12px; color: var(--muted); }
  .notice:hover .notice-head { color: var(--text-2); }
  .notice-icon {
    width: 14px; height: 14px; flex: none; display: grid; place-items: center; border-radius: 50%;
    font: 700 9px var(--font-ui); color: var(--on-accent); background: var(--warn); opacity: 0.85;
  }
  .notice-label { flex: none; color: var(--warn); font-weight: 500; }
  .notice-preview { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font: 11.5px var(--font-mono); color: var(--faint); min-width: 0; }
  .notice-text {
    margin: 6px 0 0 22px; padding: 8px 10px; white-space: pre-wrap; overflow-wrap: anywhere;
    font: 11.5px/1.5 var(--font-mono); color: var(--text-2);
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
  }
  .turn-end { display: flex; gap: 6px; margin: 10px 0 4px; color: var(--faint); font: 11px var(--font-mono); }
  .divider { display: flex; align-items: center; gap: 12px; margin: 18px 0; color: var(--muted); font-size: 12px; }
  .divider::before, .divider::after { content: ""; flex: 1; border-top: 1px dashed var(--border-strong); }
  .error { margin: 8px 0; padding: 8px 10px; color: var(--del-fg); background: var(--del-bg); border: 1px solid var(--err-soft); border-radius: var(--radius); font: 12px var(--font-mono); white-space: pre-wrap; overflow-wrap: anywhere; }
  .unknown { margin: 4px 0; color: var(--muted); font: 11px var(--font-mono); }
  .unknown pre { white-space: pre-wrap; }
  .hint { display: flex; align-items: center; gap: 8px; margin: 12px 0; color: var(--muted); }
  .hint.waiting { color: var(--accent); }
</style>
