<script lang="ts">
  import FilterInput from "../ui/FilterInput.svelte";
  import Tag from "../ui/Tag.svelte";
  import EmptyState from "../ui/EmptyState.svelte";
  import PageHeader from "./PageHeader.svelte";
  import SettingsGroup from "./SettingsGroup.svelte";
  import { agentById } from "../../lib/sessions.svelte";
  import { customize, preview } from "../../lib/customize.svelte";
  import { commandsFor, type CommandRow } from "../../lib/agents";
  import { matches } from "../../lib/format";

  let { id }: { id: string } = $props();
  let filter = $state("");
  const agent = $derived(agentById(id));
  const all = $derived(agent ? commandsFor(agent, customize.commandFiles, customize.skills ?? []) : []);
  const shown = $derived(all.filter((c) => matches(filter, c.name, c.description)));

  function open(c: CommandRow) {
    preview.doc = { title: `/${c.name}`, kind: "command", agent: id, path: c.path, description: c.description, hint: c.hint };
  }
</script>

<div class="set-page">
  <PageHeader agent={id} title="{agent?.name ?? id} · Commands">
    {#snippet lede()}Built-in, custom and skill commands. Type <code>/</code> in the composer to use one.{/snippet}
  </PageHeader>
  {#if !agent?.probe?.ok}
    <SettingsGroup><EmptyState data-testid="settings-empty" inline icon="refresh" title="Refresh {agent?.name ?? 'the agent'} to list its commands." /></SettingsGroup>
  {:else}
    <div class="filter-bar"><FilterInput data-testid="settings-filter" bind:value={filter} placeholder="Filter commands" shown={shown.length} total={all.length} /></div>
    <SettingsGroup>
      <div class="list">
      {#each shown as c (c.name)}
        <button class="plain cmd focus-inset" data-testid="settings-command" data-name={c.name} data-source={c.source} onclick={() => open(c)}>
          <span class="name t-item-name mono">/{c.name}</span>
          <span class="desc t-item-desc truncate">{c.description}{#if c.hint}<span class="muted">{` · ${c.hint}`}</span>{/if}</span>
          {#if c.source === "builtin"}<Tag data-testid="settings-tag">built in</Tag>{:else if c.source === "skill"}<Tag data-testid="settings-tag">skill</Tag>{/if}
        </button>
      {:else}
        <EmptyState data-testid="settings-empty" inline title="No commands{filter ? ' match' : ''}." />
      {/each}
      </div>
    </SettingsGroup>
  {/if}
</div>

<style>
  .list { padding: 4px 0; }
  .cmd { display: flex; align-items: center; gap: 14px; width: 100%; height: var(--row-h); padding: 0 14px; min-width: 0; }
  .cmd:is(:hover, :focus-visible) { background: var(--row-hover); }
  .name { flex: none; min-width: 140px; }
  .desc { flex: 1; }
</style>
