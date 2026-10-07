<script lang="ts">
  // One transcript entry, drawn by kind. Thoughts and agent notices fold; a
  // thought stays open while it streams.
  import Markdown from "./Markdown.svelte";
  import ToolCall from "./ToolCall.svelte";
  import PermissionCard from "./PermissionCard.svelte";
  import PlanView from "./PlanView.svelte";
  import Icon from "../Icon.svelte";
  import Chevron from "../ui/Chevron.svelte";
  import Disclosure from "../ui/Disclosure.svelte";
  import { duration } from "../../lib/format";
  import type { Entry, SessionView } from "../../bindings";

  let { entry, session }: { entry: Entry; session: Pick<SessionView, "id" | "cwd" | "status"> } = $props();
  let open = $state(false);
</script>

{#if entry.kind === "user"}
  <div class="user selectable">{entry.text}</div>
{:else if entry.kind === "agent"}
  <div class="agent">
    <Markdown text={entry.text} streaming={entry.streaming} />
  </div>
{:else if entry.kind === "thought"}
  {@const shown = open || entry.streaming}
  <div class="thought">
    <Disclosure data-testid="thought-toggle" data-open={shown} class="thought-head" open={shown} ontoggle={() => (open = !open)}>
      {#snippet head()}
        <span class="thought-label">{entry.streaming ? "Thinking…" : "Thought"}<Chevron open={shown} /></span>
        {#if !shown}<span class="thought-preview">{entry.text.slice(0, 160).replace(/\s+/g, " ")}</span>{/if}
      {/snippet}
      <div class="thought-text selectable" data-testid="thought-text">{entry.text}</div>
    </Disclosure>
  </div>
{:else if entry.kind === "notice"}
  <div class="notice">
    <Disclosure data-testid="notice-toggle" class="notice-head" open={open} ontoggle={() => (open = !open)} title="Output from the agent outside a turn">
      {#snippet head()}
        <span class="notice-icon"><Icon name="alert" size={12} /></span>
        <span class="notice-label">Agent notice</span>
        {#if !open}<span class="notice-preview">{entry.text.trim().split("\n")[0]}</span>{/if}
        <Chevron open={open} />
      {/snippet}
      <pre class="notice-text card-code selectable" data-testid="notice-text">{entry.text.trim()}</pre>
    </Disclosure>
  </div>
{:else if entry.kind === "tool"}
  <ToolCall {entry} cwd={session.cwd} />
{:else if entry.kind === "plan"}
  <PlanView items={entry.items} />
{:else if entry.kind === "permission"}
  <PermissionCard entry={!entry.resolution && session.status !== "awaiting_permission" ? { ...entry, resolution: "cancelled" } : entry} session={session.id} cwd={session.cwd} />
{:else if entry.kind === "turn_end"}
  <div class="turn-end" data-testid="turn-end" data-stop-reason={entry.stop_reason}>
    <span>{entry.stop_reason === "end_turn" ? "done" : entry.stop_reason.replace("_", " ")}</span>
    {#if entry.duration_ms > 0}<span>· {duration(entry.duration_ms)}</span>{/if}
  </div>
{:else if entry.kind === "divider"}
  {#if entry.text}<div class="divider"><span>{entry.text}</span></div>{/if}
{:else if entry.kind === "error"}
  <pre class="error card-code err selectable">{entry.text}</pre>
{:else if entry.kind === "unknown"}
  <details class="unknown"><summary>unrecognised update</summary><pre class="selectable">{entry.json}</pre></details>
{/if}

<style>
  .user {
    margin: 22px 0 14px; padding: 10px 14px; white-space: pre-wrap; overflow-wrap: anywhere;
    background: var(--raised); border: 1px solid var(--border); border-radius: var(--radius-lg); color: var(--text);
  }
  .user:first-child { margin-top: 0; }
  .agent { margin: 10px 0; }
  .thought {
    display: flex; flex-direction: column; gap: 2px; width: 100%; margin: 8px 0; color: var(--muted); font-size: var(--fs-sm); line-height: var(--lh-prose);
  }
  .thought :global(.thought-head) { flex-direction: column; gap: 2px; border-radius: var(--radius-sm); }
  .thought :global(.thought-head:is(:hover, :focus-visible)) { color: var(--text-2); }
  /* Takes the head's colour, so it lights up with it. */
  .thought-label { display: inline-flex; align-items: center; gap: 4px; font-weight: var(--fw-medium); }
  .thought-text { white-space: pre-wrap; font-style: italic; }
  .thought-preview { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-style: italic; }
  .notice { display: block; width: 100%; margin: 6px 0; }
  .notice :global(.notice-head) { align-items: center; gap: 8px; font-size: var(--fs-sm); color: var(--muted); border-radius: var(--radius-sm); }
  .notice :global(.notice-head:is(:hover, :focus-visible)) { color: var(--text-2); }
  .notice-icon { flex: none; display: inline-grid; place-items: center; color: var(--warn-dim); }
  .notice-label { flex: none; color: var(--text-2); font-weight: var(--fw-medium); }
  .notice-preview { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font: var(--fs-xs) var(--font-mono); color: var(--muted); min-width: 0; }
  .notice-text { margin: 6px 0 0 20px; }
  .turn-end { display: flex; gap: 6px; margin: 10px 0 4px; color: var(--muted); font: var(--fs-xs) var(--font-mono); }
  .divider { display: flex; align-items: center; gap: 12px; margin: 18px 0; color: var(--muted); font-size: var(--fs-sm); }
  .divider::before, .divider::after { content: ""; flex: 1; border-top: 1px dashed var(--border-strong); }
  .error { margin: 8px 0; }
  .unknown { margin: 4px 0; color: var(--muted); font: var(--fs-xs) var(--font-mono); }
  .unknown pre { white-space: pre-wrap; }
</style>
