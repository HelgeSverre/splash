<script lang="ts">
  import IconButton from "../ui/IconButton.svelte";
  import StatusBadge from "../ui/StatusBadge.svelte";
  import Tag from "../ui/Tag.svelte";
  import Chevron from "../ui/Chevron.svelte";
  import EmptyState from "../ui/EmptyState.svelte";
  import PageHeader from "./PageHeader.svelte";
  import SettingsGroup from "./SettingsGroup.svelte";
  import SettingsRow from "./SettingsRow.svelte";
  import { app, agentById } from "../../lib/sessions.svelte";
  import { agentPages } from "../../lib/customize.svelte";
  import { showError } from "../../lib/system";
  import { readiness, transportLabel } from "../../lib/agents";
  import { ago } from "../../lib/format";
  import { serverUnavailable } from "../../lib/server.svelte";
  import { api } from "../../bindings";

  let { id }: { id: string } = $props();
  const a = $derived(agentById(id));
  const p = $derived(a?.probe);
  const r = $derived(a ? readiness(a) : null);
  let probing = $state(false);

  async function probe() {
    if (serverUnavailable()) return;
    probing = true;
    await api.probe_agent(id).catch(showError);
    probing = false;
  }

  async function saveArgs(value: string) {
    if (!a || serverUnavailable() || value.trim() === a.extra_args) return;
    await api.set_agent_args(id, value).catch(showError);
  }

  const login = $derived(
    !a ? "" : (a.auth === "ok" ? "signed in" : a.auth === "logged_out" ? "signed out" : "unknown") + (a.auth_detail ? ` · ${a.auth_detail}` : ""),
  );

  const links = $derived(a ? agentPages(a) : []);
</script>

{#if a && r}
  <div class="set-page">
    <PageHeader agent={a.id} title={a.name}>
      {#snippet tags()}
        {#if a.version}<Tag>v{a.version}</Tag>{/if}
        <Tag>{transportLabel(a)}</Tag>
        {#if a.experimental}<Tag tone="warn">experimental</Tag>{/if}
      {/snippet}
      {#snippet actions()}
        <StatusBadge data-testid="settings-agent-status" data-agent={a.id} tone={r.tone} label={r.label} />
        <IconButton data-testid="settings-agent-refresh" title="Refresh {a.name}" icon="refresh" loading={probing} disabled={!a.installed || serverUnavailable()} onclick={probe} />
      {/snippet}
    </PageHeader>

    <div class="links">
      {#each links as l (l.page)}
        <button class="plain link" data-testid="settings-agent-link" data-page={l.page} data-count={l.count} onclick={() => (app.settings = `agent:${id}:${l.page}`)}>
          <span class="n">{l.count ?? "…"}</span><span>{l.title}</span><span class="spacer"></span><Chevron size={12} />
        </button>
      {/each}
    </div>

    <SettingsGroup title="Installation">
      <SettingsRow data-testid="settings-row" data-key="host" label="Host compatibility" value={p?.ok ? "ACP handshake verified on this host" : "Unverified on this host"} desc="Installation alone does not confirm ACP support. Refresh to test the installed adapter. WSL agents need a server running inside WSL." />
      <SettingsRow data-testid="settings-row" data-key="installed" label="Installed" value={a.installed ? a.cli_path : "not found on PATH"} path={a.installed} />
      <SettingsRow data-testid="settings-row" data-key="login" label="Login" value={login} />
      <SettingsRow data-testid="settings-row" data-key="launch" label="Launch" value={[a.extra_args, a.launch].filter(Boolean).join(" ")} mono />
      <SettingsRow data-testid="settings-row" data-key="extra-args" label="Extra arguments" desc="Placed before the ACP arguments.">
        <input class="field sm args" data-testid="settings-extra-args" value={a.extra_args} placeholder="e.g. --verbose" aria-label="Extra arguments" disabled={serverUnavailable()}
          onblur={(e) => saveArgs(e.currentTarget.value)} onkeydown={(e) => e.key === "Enter" && e.currentTarget.blur()} />
      </SettingsRow>
    </SettingsGroup>

    <SettingsGroup title="Handshake" data-testid="settings-handshake" data-state={!p ? "unchecked" : p.ok ? "ok" : "failed"}>
      {#if !p}
        <EmptyState inline icon="refresh" title="Not checked yet." detail="Refresh runs a free handshake." />
      {:else if !p.ok}
        <EmptyState inline icon="alert" title="Handshake failed · {ago(p.probed_at)}">
          {#if p.error}<pre class="card-code err" data-testid="settings-handshake-error">{p.error}</pre>{/if}
        </EmptyState>
      {:else}
        <SettingsRow data-testid="settings-row" data-key="reports-as" label="Reports as" value="{p.agent_name} {p.agent_version} · protocol v{p.protocol_version} · {Math.round(p.duration_ms)} ms · {ago(p.probed_at)}" />
        <SettingsRow data-testid="settings-row" data-key="capabilities" label="Capabilities">
          {#each [["load_session", "resume", p.load_session], ["image", "images", p.image], ["audio", "audio", p.audio], ["embedded_context", "embedded context", p.embedded_context]] as [key, label, on] (key)}
            <Tag data-testid="settings-capability" data-capability={key} data-supported={on} off={!on} title={on ? undefined : "not supported"}>{label}</Tag>
          {/each}
        </SettingsRow>
        {#if p.auth_methods.length}<SettingsRow data-testid="settings-row" data-key="auth-methods" label="Auth methods" value={p.auth_methods.join(", ")} />{/if}
        {#each p.options as o (o.id)}
          <SettingsRow data-testid="settings-option" data-option={o.id} label={o.name} desc="{o.choices.length} choices" value={o.choices.find((c) => c.value === o.current)?.name ?? o.current} />
        {/each}
      {/if}
    </SettingsGroup>
  </div>
{/if}

<style>
  .links { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 16px; }
  .link {
    display: flex; align-items: baseline; gap: 8px; padding: 12px 14px;
    border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--surface); color: var(--text-2);
  }
  .link:is(:hover, :focus-visible) { border-color: var(--border-strong); color: var(--text); }
  .link :global(.chev) { align-self: center; }
  .link .n { font-size: var(--fs-lg); font-weight: var(--fw-semibold); font-variant-numeric: tabular-nums; color: var(--text); }
  .args { width: 240px; font-family: var(--font-mono); }
  .err { margin-top: 4px; text-align: left; max-width: 100%; }
</style>
