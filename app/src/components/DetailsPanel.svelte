<script lang="ts">
  import { clipboard } from "@elyra/runtime";
  import AgentIcon from "./AgentIcon.svelte";
  import Icon from "./Icon.svelte";
  import IconButton from "./ui/IconButton.svelte";
  import RevealButton from "./ui/RevealButton.svelte";
  import { dateTime as when, duration as dur, num } from "../lib/format";
  import { home } from "../lib/paths";
  import { transcripts, agentById, projectById, workspace, layout, saveLayout } from "../lib/state.svelte";
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
    await clipboard.writeText(value).catch(() => {});
    copied = value;
    setTimeout(() => (copied = ""), 1200);
  }

</script>

{#snippet row(label: string, value: string | null | undefined, display?: string)}
  {#if value}
    <div class="row">
      <span class="k">{label}</span>
      <button class="plain v" class:copied={copied === value} onclick={() => copy(value)} title="Copy">{copied === value ? "copied" : (display ?? value)}</button>
    </div>
  {/if}
{/snippet}

<div class="details">
  <section>
    <h3>Session</h3>
    {@render row("Title", session.title)}
    {@render row("Status", session.status.replace("_", " "))}
    {@render row("Project", project?.name)}
    {@render row("Isolation", session.isolation === "worktree" ? "worktree" : "in place")}
    {@render row("Branch", session.branch)}
    {@render row("Base", session.base_sha, session.base_sha?.slice(0, 10))}
    {@render row("Folder", session.cwd, home(session.cwd))}
    {@render row("Created", when(session.created_at))}
    {@render row("Splash id", session.id)}
    <div class="actions">
      <RevealButton path={session.cwd} />
      <IconButton title="Open the terminal here" size={26} onclick={() => { layout.bottomOpen = true; saveLayout(); }}>
        <Icon name="terminal" size={14} />
      </IconButton>
    </div>
  </section>

  <section>
    <h3>Agent</h3>
    <div class="row"><span class="k">Agent</span><span class="v plain"><AgentIcon id={session.agent_id} size={12} /> {agent?.name ?? session.agent_id}</span></div>
    {@render row("Version", probe?.agent_version ?? agent?.version)}
    {@render row("Transport", agent ? (agent.transport === "native" ? "native ACP" : "ACP adapter") : null)}
    {@render row("Launch", agent ? [agent.extra_args, agent.launch].filter(Boolean).join(" ") : null)}
    {@render row("Agent session", session.agent_session_id)}
    {@render row("Resume", probe ? (probe.load_session ? "supported" : "not supported") : null)}
  </section>

  <section>
    <h3>Usage</h3>
    {#if usage && usage.size > 0}
      <div class="row">
        <span class="k">Context</span>
        <span class="v plain">{num(usage.used)} / {num(usage.size)}</span>
      </div>
      <div class="bar"><span style:width="{Math.min(100, (usage.used / usage.size) * 100)}%"></span></div>
    {/if}
    {@render row("Cost", usage?.cost_usd ? `$${usage.cost_usd.toFixed(4)}` : null)}
    {#each usage?.extra ?? [] as x (x.label)}
      {@render row(x.label, num(x.value))}
    {/each}
    {@render row("Turns", String(stats.turns))}
    {@render row("Agent time", stats.time ? dur(stats.time) : null)}
    {@render row("Tool calls", stats.ok + stats.failed ? `${stats.ok + stats.failed}${stats.failed ? ` (${stats.failed} failed)` : ""}` : null)}
    {@render row("Files changed", changes ? String(changes) : null)}
    {#if !usage}<p class="muted">Usage appears once the agent reports it.</p>{/if}
  </section>

  {#if session.meta.options.length}
    <section>
      <h3>Options</h3>
      {#each session.meta.options as o (o.id)}
        {@render row(o.name, o.choices.find((c) => c.value === o.current)?.name ?? o.current)}
      {/each}
    </section>
  {/if}
</div>

<style>
  .details { flex: 1; overflow: auto; padding: 4px 0 16px; }
  section { padding: 10px 14px 12px; border-bottom: 1px solid var(--border); }
  h3 { margin: 0 0 8px; font-size: 11px; font-weight: 600; color: var(--muted); }
  .row { display: flex; align-items: baseline; gap: 10px; padding: 2px 0; min-width: 0; }
  .k { flex: none; width: 92px; color: var(--muted); font-size: 12px; }
  .v {
    flex: 1; min-width: 0; cursor: copy; font: 11.5px var(--font-mono); color: var(--text-2);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; border-radius: 3px;
  }
  .v:hover { color: var(--text); }
  .v.copied { color: var(--ok); }
  .v.plain { cursor: default; display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-ui); font-size: 12px; }
  .bar { height: 4px; margin: 4px 0 6px 102px; background: var(--border); border-radius: 2px; overflow: hidden; }
  .bar span { display: block; height: 100%; background: var(--text-2); }
  .actions { display: flex; gap: 2px; margin: 8px 0 0 96px; }
  .muted { color: var(--muted); font-size: 12px; margin: 6px 0 0; }
</style>
