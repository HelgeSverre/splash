<script lang="ts">
  import AgentIcon from "./AgentIcon.svelte";
  import IconButton from "./ui/IconButton.svelte";
  import RevealButton from "./ui/RevealButton.svelte";
  import { dateTime as when, duration as dur, num, statusLabel, usd } from "../lib/format";
  import { transportLabel } from "../lib/agents";
  import { home } from "../lib/paths";
  import { copyText } from "../lib/system";
  import { agentById, projectById } from "../lib/sessions.svelte";
  import { transcripts } from "../lib/transcripts.svelte";
  import { workspace } from "../lib/workspace.svelte";
  import { openTerminal } from "../lib/layout.svelte";
  import type { SessionView } from "../bindings";

  let { session }: { session: SessionView } = $props();
  let copied = $state("");

  const entries = $derived(transcripts[session.id]?.entries ?? []);
  const agent = $derived(agentById(session.agent_id));
  const probe = $derived(agent?.probe);
  const project = $derived(projectById(session.project_id));
  const usage = $derived(session.meta.usage);
  const stats = $derived.by(() => {
    let turns = 0, time = 0, ok = 0, failed = 0;
    for (const e of entries) {
      if (e.kind === "turn_end") { turns++; time += e.duration_ms; }
      if (e.kind === "tool") { if (e.status === "failed") failed++; else ok++; }
    }
    return { turns, time, ok, failed };
  });
  const changes = $derived(workspace(session.id).changes.length);

  async function copy(value: string) {
    await copyText(value);
    copied = value;
    setTimeout(() => (copied = ""), 1200);
  }

</script>

<!-- Values are Inter by default; `mono` is for ids, shas, paths, commands and numbers. -->
{#snippet row(label: string, value: string | null | undefined, display?: string, mono = false)}
  {#if value}
    <span class="kv-k">{label}</span>
    <button class="plain v" class:mono class:copied={copied === value} onclick={() => copy(value)} title="Copy">{copied === value ? "copied" : (display ?? value)}</button>
  {/if}
{/snippet}

<div class="details">
  <section>
    <h3 class="t-section">Session</h3>
    <div class="kv">
    {@render row("Title", session.title)}
    {@render row("Status", statusLabel(session.status))}
    {@render row("Project", project?.name)}
    {@render row("Isolation", session.isolation === "worktree" ? "worktree" : "in place")}
    {@render row("Branch", session.branch, undefined, true)}
    {@render row("Base", session.base_sha, session.base_sha?.slice(0, 10), true)}
    {@render row("Folder", session.cwd, home(session.cwd), true)}
    {#each (session.additional_directories ?? []) as path, i}{@render row(`Extra folder ${i + 1}`, path, home(path), true)}{/each}
    {@render row("Added to Splash", when(session.created_at))}
    {@render row("Agent activity", session.source?.updated_at)}
    {@render row("Last synced", session.source?.last_synced_at ? when(session.source?.last_synced_at) : null)}
    {@render row("Forked from", session.parent_id, undefined, true)}
    {@render row("Splash id", session.id, undefined, true)}
    <div class="actions kv-full">
      <RevealButton path={session.cwd} />
      <IconButton title="Open the terminal here" size="md" icon="terminal" onclick={openTerminal} />
    </div>
    </div>
  </section>

  <section>
    <h3 class="t-section">Agent</h3>
    <div class="kv">
    <span class="kv-k">Agent</span><span class="v static"><AgentIcon id={session.agent_id} size={12} /> {agent?.name ?? session.agent_id}</span>
    {@render row("Version", probe?.agent_version ?? agent?.version, undefined, true)}
    {@render row("Transport", agent ? transportLabel(agent) : null)}
    {@render row("Launch", agent ? [agent.extra_args, agent.launch].filter(Boolean).join(" ") : null, undefined, true)}
    {@render row("Agent session", session.agent_session_id, undefined, true)}
    {@render row("Resume", probe ? (probe.load_session ? "supported" : "not supported") : null)}
    </div>
  </section>

  <section>
    <h3 class="t-section">Usage</h3>
    <div class="kv">
    {#if usage && usage.size > 0}
      <span class="kv-k">Context</span>
      <span class="v static mono">{num(usage.used)} / {num(usage.size)}</span>
      <div class="bar kv-full"><span style:width="{Math.min(100, (usage.used / usage.size) * 100)}%"></span></div>
    {/if}
    {@render row("Cost", usage?.cost_usd ? usd(usage.cost_usd, 4) : null, undefined, true)}
    {#each usage?.extra ?? [] as x (x.label)}
      {@render row(x.label, num(x.value), undefined, true)}
    {/each}
    {@render row("Turns", String(stats.turns))}
    {@render row("Agent time", stats.time ? dur(stats.time) : null)}
    {@render row("Tool calls", stats.ok + stats.failed ? `${stats.ok + stats.failed}${stats.failed ? ` (${stats.failed} failed)` : ""}` : null)}
    {@render row("Files changed", changes ? String(changes) : null)}
    </div>
    {#if !usage}<p class="note t-meta">Usage appears once the agent reports it.</p>{/if}
  </section>

  {#if session.meta.options.length}
    <section>
      <h3 class="t-section">Options</h3>
      <div class="kv">
      {#each session.meta.options as o (o.id)}
        {@render row(o.name, o.choices.find((c) => c.value === o.current)?.name ?? o.current)}
      {/each}
      </div>
    </section>
  {/if}
</div>

<style>
  .details { flex: 1; overflow: auto; padding: 4px 0 16px; }
  section { padding: 12px var(--gutter-side) 14px; border-bottom: 1px solid var(--border); }
  h3 { margin: 0 0 8px; }
  .v {
    min-width: 0; cursor: copy; font-size: var(--fs-sm); color: var(--text); font-variant-numeric: tabular-nums;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; border-radius: var(--radius-sm);
  }
  .v.mono { font-family: var(--font-mono); color: var(--text-2); }
  .v:is(:hover, :focus-visible):not(.static) { color: var(--text); }
  .v.copied { color: var(--ok-dim); }
  .v.static { cursor: default; display: inline-flex; align-items: center; gap: 6px; }
  /* A 4px meter: 2px ends read as a bar, not a pill. */
  .bar { height: 4px; margin: 2px 0 4px; background: var(--border); border-radius: 2px; overflow: hidden; align-self: center; }
  .bar span { display: block; height: 100%; background: var(--text-2); }
  .actions { display: flex; gap: 2px; margin-top: 6px; }
  .note { margin: 8px 0 0; }
</style>
