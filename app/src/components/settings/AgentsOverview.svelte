<script lang="ts">
  import AgentIcon from "../AgentIcon.svelte";
  import IconButton from "../ui/IconButton.svelte";
  import StatusBadge from "../ui/StatusBadge.svelte";
  import Tag from "../ui/Tag.svelte";
  import Chevron from "../ui/Chevron.svelte";
  import PageHeader from "./PageHeader.svelte";
  import SettingsGroup from "./SettingsGroup.svelte";
  import SettingsRow from "./SettingsRow.svelte";
  import { app, refreshAllAgents } from "../../lib/sessions.svelte";
  import { readinessBadge, transportLabel } from "../../lib/agents";
  import type { AgentStatus } from "../../bindings";
  import { serverUnavailable } from "../../lib/server.svelte";

  const installed = $derived(app.agents.filter((a) => a.installed));
  const uninstalled = $derived(app.agents.filter((a) => !a.installed));
  let showUninstalled = $state(false);
</script>

{#snippet rows(list: AgentStatus[])}
  {#each list as a (a.id)}
    {@const r = readinessBadge(a)}
    <SettingsRow data-testid="settings-agent" data-agent={a.id} desc="{transportLabel(a)}{a.installed ? ` · v${a.version ?? '?'}` : ''}" onclick={() => (app.settings = `agent:${a.id}`)}>
      {#snippet lead()}<AgentIcon id={a.id} size={20} />{/snippet}
      {#snippet label()}{a.name} {#if a.experimental}<Tag tone="warn">experimental</Tag>{/if}{/snippet}
      {#snippet trail()}<StatusBadge data-testid="settings-agent-status" data-agent={a.id} tone={r.tone} label={r.label} /><Chevron size={12} />{/snippet}
    </SettingsRow>
  {/each}
{/snippet}

<div class="set-page">
  <PageHeader title="Agents">
    {#snippet actions()}
      <IconButton data-testid="settings-agents-refresh" title="Refresh all agents" icon="refresh" loading={app.agentsLoading} disabled={serverUnavailable()} onclick={refreshAllAgents} />
    {/snippet}
    {#snippet lede()}Agents connect over ACP, natively or through an adapter. Refreshing is free.{/snippet}
  </PageHeader>
  {#if installed.length}<SettingsGroup>{@render rows(installed)}</SettingsGroup>{/if}
  {#if uninstalled.length}
    <button class="plain fold t-group" data-testid="settings-agents-uninstalled" data-count={uninstalled.length} aria-expanded={showUninstalled}
      onclick={() => (showUninstalled = !showUninstalled)}>
      <Chevron open={showUninstalled} /><span>Not installed</span><span class="sep" aria-hidden="true">·</span><span class="t-count">{uninstalled.length}</span>
    </button>
    {#if showUninstalled}<SettingsGroup>{@render rows(uninstalled)}</SettingsGroup>{/if}
  {/if}
</div>

<style>
  .fold { display: flex; align-items: center; gap: 6px; margin: 4px 0 8px; padding: 4px 6px; border-radius: var(--radius-sm); color: var(--muted); }
  .fold:is(:hover, :focus-visible) { color: var(--text); background: var(--row-hover); }
  .sep { color: var(--faint); }
</style>
