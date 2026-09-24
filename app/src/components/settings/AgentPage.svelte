<script lang="ts">
  import AgentIcon from "../AgentIcon.svelte";
  import Icon from "../Icon.svelte";
  import IconButton from "../ui/IconButton.svelte";
  import StatusBadge from "../ui/StatusBadge.svelte";
  import Tag from "../ui/Tag.svelte";
  import { app, customize, showError } from "../../lib/state.svelte";
  import { readiness, skillsFor, mcpFor } from "../../lib/agents";
  import { ago } from "../../lib/format";
  import { api } from "../../bindings";

  let { id }: { id: string } = $props();
  const a = $derived(app.agents.find((x) => x.id === id));
  const p = $derived(a?.probe);
  const r = $derived(a ? readiness(a) : null);
  let probing = $state(false);

  async function probe() {
    probing = true;
    await api.probe_agent(id).catch(showError);
    probing = false;
  }

  async function saveArgs(value: string) {
    if (!a || value.trim() === a.extra_args) return;
    await api.set_agent_args(id, value).catch(showError);
  }

  const links = $derived([
    { page: "skills", title: "Skills", count: customize.skills ? skillsFor(customize.skills, id).length : null },
    { page: "commands", title: "Commands", count: p?.commands.length ?? null },
    { page: "mcp", title: "MCP servers", count: customize.mcp ? mcpFor(customize.mcp.servers, id).filter((s) => !s.project).length : null },
  ]);
</script>

{#if a && r}
  <div class="set-page">
    <div class="title">
      <AgentIcon id={a.id} size={22} />
      <h2>{a.name}</h2>
      {#if a.version}<Tag>v{a.version}</Tag>{/if}
      <Tag>{a.transport === "native" ? "native ACP" : "ACP adapter"}</Tag>
      {#if a.experimental}<Tag tone="warn">experimental</Tag>{/if}
      <span class="spacer"></span>
      <StatusBadge tone={r.tone} label={r.label} />
      <IconButton title="Refresh — probe {a.name}" disabled={!a.installed || probing} onclick={probe}>
        {#if probing}<span class="spinner"></span>{:else}<Icon name="refresh" size={15} />{/if}
      </IconButton>
    </div>

    <div class="links">
      {#each links as l (l.page)}
        <button class="plain link" onclick={() => (app.settings = `agent:${id}:${l.page}`)}>
          <span class="n">{l.count ?? "–"}</span><span>{l.title}</span><span class="chev">›</span>
        </button>
      {/each}
    </div>

    <div class="set-group-title">Installation</div>
    <div class="set-group">
      <div class="set-row"><div class="set-label">Installed</div>
        <span class="set-value" title={a.cli_path}>{a.installed ? a.cli_path : "not found on PATH"}</span></div>
      <div class="set-row"><div class="set-label">Login</div>
        <span class="set-value">{a.auth === "ok" ? "signed in" : a.auth === "logged_out" ? "signed out" : "unknown"}{a.auth_detail ? ` — ${a.auth_detail}` : ""}</span></div>
      <div class="set-row"><div class="set-label">Launch</div>
        <span class="set-value" title={a.launch}>{#if a.extra_args}<span class="extra">{a.extra_args} </span>{/if}{a.launch}</span></div>
      <div class="set-row">
        <div class="set-label"><div>Extra arguments</div><div class="set-desc">Global options placed before the ACP arguments.</div></div>
        <input class="field args" value={a.extra_args} placeholder="e.g. --verbose"
          onblur={(e) => saveArgs(e.currentTarget.value)} onkeydown={(e) => e.key === "Enter" && e.currentTarget.blur()} />
      </div>
    </div>

    <div class="set-group-title">Handshake</div>
    <div class="set-group">
      {#if !p}
        <div class="set-empty">Not probed yet. Refresh starts the agent, runs <code>initialize</code> and <code>session/new</code> in a scratch folder, and stops it.</div>
      {:else if !p.ok}
        <div class="set-empty">Probe failed · {ago(p.probed_at)}{#if p.error}<pre class="err">{p.error}</pre>{/if}</div>
      {:else}
        <div class="set-row"><div class="set-label">Reports as</div><span class="set-value">{p.agent_name} {p.agent_version} · protocol v{p.protocol_version} · {Math.round(p.duration_ms)} ms · {ago(p.probed_at)}</span></div>
        <div class="set-row"><div class="set-label">Capabilities</div>
          <span class="caps">
            {#each [["resume", p.load_session], ["images", p.image], ["audio", p.audio], ["embedded context", p.embedded_context]] as [label, on] (label)}
              <span class="cap" class:on>{label}</span>
            {/each}
          </span></div>
        {#if p.auth_methods.length}<div class="set-row"><div class="set-label">Auth methods</div><span class="set-value">{p.auth_methods.join(", ")}</span></div>{/if}
        {#each p.options as o (o.id)}
          <div class="set-row"><div class="set-label"><div>{o.name}</div><div class="set-desc">{o.choices.length} choices</div></div>
            <span class="set-value">{o.choices.find((c) => c.value === o.current)?.name ?? o.current}</span></div>
        {/each}
      {/if}
    </div>
  </div>
{/if}

<style>
  .title { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
  .title h2 { margin: 0; }
  .spacer { flex: 1; }
  .links { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .link { display: flex; align-items: baseline; gap: 8px; padding: 12px 14px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); color: var(--text-2); }
  .link:hover { border-color: var(--border-strong); color: var(--text); }
  .link .n { font: 600 16px var(--font-mono); color: var(--text); }
  .link .chev { margin-left: auto; color: var(--faint); }
  .extra { color: var(--accent); }
  .args { width: 240px; font: 12px var(--font-mono); padding: 4px 8px; }
  .caps { display: flex; gap: 5px; flex-wrap: wrap; }
  .cap { font: 10.5px var(--font-mono); color: var(--faint); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0 6px; text-decoration: line-through; }
  .cap.on { color: var(--text-2); text-decoration: none; }
  .err { margin: 8px 0 0; color: var(--err-dim); font: 11.5px var(--font-mono); white-space: pre-wrap; }
  code { font: 11.5px var(--font-mono); }
</style>
