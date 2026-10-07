<script lang="ts">
  import FilterInput from "../ui/FilterInput.svelte";
  import RevealButton from "../ui/RevealButton.svelte";
  import Tag from "../ui/Tag.svelte";
  import Checkbox from "../ui/Checkbox.svelte";
  import EmptyState from "../ui/EmptyState.svelte";
  import PageHeader from "./PageHeader.svelte";
  import SettingsGroup from "./SettingsGroup.svelte";
  import SettingsRow from "./SettingsRow.svelte";
  import { agentById } from "../../lib/sessions.svelte";
  import { customize } from "../../lib/customize.svelte";
  import { mcpFor } from "../../lib/agents";
  import { home } from "../../lib/paths";
  import { matches } from "../../lib/format";

  let { id }: { id: string } = $props();
  let filter = $state("");
  let showProjects = $state(false);
  const agent = $derived(agentById(id));
  const servers = $derived(customize.mcp ? mcpFor(customize.mcp.servers, id) : null);
  const errors = $derived((customize.mcp?.errors ?? []).filter((e) => e.agent === id));
  const scoped = $derived((servers ?? []).filter((s) => showProjects || !s.project));
  const shown = $derived(scoped.filter((s) => matches(filter, s.name, s.target, s.project)));
  const source = $derived(servers?.[0]?.source ?? errors[0]?.source);
  const projectCount = $derived((servers ?? []).filter((s) => s.project).length);
</script>

<div class="set-page">
  <PageHeader agent={id} title="{agent?.name ?? id} · MCP servers">
    {#snippet actions()}{#if source}<RevealButton path={source} size="lg" />{/if}{/snippet}
    {#snippet lede()}
      From {#if source}<code>{home(source)}</code>{:else}{agent?.name}'s config{/if}. Only header and env names are shown, never values.
    {/snippet}
  </PageHeader>
  <div class="filter-bar">
    <FilterInput data-testid="settings-filter" bind:value={filter} placeholder="Filter servers" shown={shown.length} total={scoped.length} />
    {#if projectCount}<Checkbox data-testid="settings-mcp-projects" data-count={projectCount} bind:checked={showProjects} label="Per project ({projectCount})" />{/if}
  </div>

  {#if servers === null}
    <SettingsGroup><EmptyState inline loading /></SettingsGroup>
  {:else}
    <SettingsGroup>
      {#each errors as e (e.source)}
        <SettingsRow data-testid="settings-mcp-error" data-source={e.source} label="Couldn't read {home(e.source)}" desc={e.error} />
      {/each}
      {#each shown as s (s.name + (s.project ?? ""))}
        <SettingsRow data-testid="settings-mcp-server" data-name={s.name} data-project={s.project}>
          {#snippet label()}{s.name} <Tag data-testid="settings-tag">{s.transport}</Tag> {#if !s.enabled}<Tag data-testid="settings-tag" tone="warn">disabled</Tag>{/if}{/snippet}
          {#snippet desc()}
            <div class="target truncate" title={s.target}>{s.target}</div>
            {#if s.project || s.header_keys.length || s.env_keys.length}
              <div>
                {#if s.project}project {home(s.project)}{/if}
                {#if s.header_keys.length} · headers: {s.header_keys.join(", ")}{/if}
                {#if s.env_keys.length} · env: {s.env_keys.join(", ")}{/if}
              </div>
            {/if}
          {/snippet}
        </SettingsRow>
      {:else}
        {#if !errors.length}<EmptyState data-testid="settings-empty" inline icon="mcp" title={filter ? "No servers match." : "No servers configured."} />{/if}
      {/each}
    </SettingsGroup>
  {/if}
</div>

<style>
  .target { font: var(--fs-xs) var(--font-mono); }
</style>
