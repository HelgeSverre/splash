<script lang="ts">
  import FilterInput from "../ui/FilterInput.svelte";
  import RevealButton from "../ui/RevealButton.svelte";
  import Tag from "../ui/Tag.svelte";
  import EmptyState from "../ui/EmptyState.svelte";
  import PageHeader from "./PageHeader.svelte";
  import SettingsGroup from "./SettingsGroup.svelte";
  import SettingsRow from "./SettingsRow.svelte";
  import { agentById } from "../../lib/sessions.svelte";
  import { customize, preview } from "../../lib/customize.svelte";
  import { skillsFor } from "../../lib/agents";
  import { home } from "../../lib/paths";
  import { matches } from "../../lib/format";
  import type { Skill } from "../../bindings";

  let { id }: { id: string } = $props();
  let filter = $state("");
  const agent = $derived(agentById(id));
  const all = $derived(customize.skills ? skillsFor(customize.skills, id) : null);
  const shown = $derived((all ?? []).filter((s) => matches(filter, s.name, s.description, s.source)));
  const groups = $derived.by(() => {
    const m = new Map<string, Skill[]>();
    for (const s of shown) m.set(s.source, [...(m.get(s.source) ?? []), s]);
    return [...m.entries()];
  });

  function open(s: Skill) {
    preview.doc = { title: s.name, kind: "skill", agent: id, path: s.path, description: s.description };
  }
</script>

<div class="set-page">
  <PageHeader agent={id} title="{agent?.name ?? id} · Skills">
    {#snippet lede()}<code>SKILL.md</code> folders from {agent?.name ?? id} and <code>.agents/skills</code>.{/snippet}
  </PageHeader>
  <div class="filter-bar"><FilterInput bind:value={filter} placeholder="Filter skills" shown={shown.length} total={all?.length ?? 0} /></div>

  {#if all === null}
    <SettingsGroup><EmptyState inline loading /></SettingsGroup>
  {:else}
    {#each groups as [source, list] (source)}
      <SettingsGroup>
        {#snippet title()}<span class="t-mono-meta">{home(source)}</span> {#if !list[0].agents.length}<Tag>shared</Tag>{/if}{/snippet}
        {#each list as s (s.path)}
          <SettingsRow onclick={() => open(s)}>
            {#snippet label()}
              {s.name}
              {#if !s.user_invocable}<Tag title="user-invocable: false">not in / menu</Tag>{/if}
              {#if s.manual_only}<Tag title="disable-model-invocation: true">manual only</Tag>{/if}
            {/snippet}
            {#snippet desc()}{#if s.description}<span class="clamp">{s.description}</span>{/if}{/snippet}
            <RevealButton path={s.path} />
          </SettingsRow>
        {/each}
      </SettingsGroup>
    {:else}
      <SettingsGroup><EmptyState inline icon="skills" title={filter ? "No skills match." : "No skills yet."} /></SettingsGroup>
    {/each}
  {/if}
</div>

<style>
  .clamp { display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
