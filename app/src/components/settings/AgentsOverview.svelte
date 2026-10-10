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
  import { readiness, transportLabel } from "../../lib/agents";
  import { serverUnavailable } from "../../lib/server.svelte";
</script>

<div class="set-page">
  <PageHeader title="Agents">
    {#snippet actions()}
      <IconButton data-testid="settings-agents-refresh" title="Refresh all agents" icon="refresh" loading={app.agentsLoading} disabled={serverUnavailable()} onclick={refreshAllAgents} />
    {/snippet}
    {#snippet lede()}Agents connect over ACP, natively or through an adapter. Refreshing is free.{/snippet}
  </PageHeader>
  <SettingsGroup>
    {#each app.agents as a (a.id)}
      {@const r = readiness(a)}
      <SettingsRow data-testid="settings-agent" data-agent={a.id} desc="{transportLabel(a)}{a.installed ? ` · v${a.version ?? '?'}` : ''}" onclick={() => (app.settings = `agent:${a.id}`)}>
        {#snippet lead()}<AgentIcon id={a.id} size={20} />{/snippet}
        {#snippet label()}{a.name} {#if a.experimental}<Tag tone="warn">experimental</Tag>{/if}{/snippet}
        {#snippet trail()}<StatusBadge data-testid="settings-agent-status" data-agent={a.id} tone={r.tone} label={r.label} /><Chevron size={12} />{/snippet}
      </SettingsRow>
    {/each}
  </SettingsGroup>
</div>
