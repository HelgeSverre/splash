<script lang="ts">
  import AgentIcon from "../AgentIcon.svelte";
  import FilterInput from "../ui/FilterInput.svelte";
  import RevealButton from "../ui/RevealButton.svelte";
  import Tag from "../ui/Tag.svelte";
  import { app, customize } from "../../lib/state.svelte";
  import { mcpFor } from "../../lib/agents";
  import { home } from "../../lib/paths";

  let { id }: { id: string } = $props();
  let filter = $state("");
  let showProjects = $state(false);
  const agent = $derived(app.agents.find((a) => a.id === id));
  const servers = $derived(customize.mcp ? mcpFor(customize.mcp.servers, id) : null);
  const errors = $derived((customize.mcp?.errors ?? []).filter((e) => e.agent === id));
  const scoped = $derived((servers ?? []).filter((s) => showProjects || !s.project));
  const shown = $derived(
    scoped.filter((s) => !filter || `${s.name} ${s.target} ${s.project ?? ""}`.toLowerCase().includes(filter.toLowerCase())),
  );
  const source = $derived(servers?.[0]?.source ?? errors[0]?.source);
  const projectCount = $derived((servers ?? []).filter((s) => s.project).length);
</script>

<div class="set-page">
  <h2><AgentIcon {id} size={18} /> {agent?.name} · MCP servers</h2>
  <p class="lede">
    Read from {#if source}<code>{home(source)}</code>{:else}{agent?.name}'s config{/if}. Header and environment values are never shown — only their names.
  </p>
  <div class="bar">
    <FilterInput bind:value={filter} placeholder="Filter servers" shown={shown.length} total={scoped.length} />
    {#if projectCount}<label class="check"><input type="checkbox" bind:checked={showProjects} /> per-project ({projectCount})</label>{/if}
    {#if source}<RevealButton path={source} size={30} />{/if}
  </div>

  {#if servers === null}
    <div class="set-empty"><span class="spinner"></span></div>
  {:else}
    <div class="set-group">
      {#each errors as e (e.source)}
        <div class="set-row"><div class="set-label"><div>Couldn't read {home(e.source)}</div><div class="set-desc">{e.error}</div></div></div>
      {/each}
      {#each shown as s (s.name + (s.project ?? ""))}
        <div class="set-row">
          <div class="set-label">
            <div class="name">{s.name} <Tag>{s.transport}</Tag> {#if !s.enabled}<Tag tone="warn">disabled</Tag>{/if}</div>
            <div class="set-desc target" title={s.target}>{s.target}</div>
            {#if s.project || s.header_keys.length || s.env_keys.length}
              <div class="set-desc">
                {#if s.project}project {home(s.project)}{/if}
                {#if s.header_keys.length} · headers: {s.header_keys.join(", ")}{/if}
                {#if s.env_keys.length} · env: {s.env_keys.join(", ")}{/if}
              </div>
            {/if}
          </div>
        </div>
      {:else}
        {#if !errors.length}<div class="set-empty">None{filter ? " match" : " configured"}.</div>{/if}
      {/each}
    </div>
  {/if}
</div>

<style>
  h2 { display: flex; align-items: center; gap: 8px; }
  .bar { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
  .check { display: flex; gap: 6px; align-items: center; font-size: 12px; color: var(--text-2); flex: none; }
  .name { display: flex; align-items: center; gap: 6px; }
  .target { font: 11.5px var(--font-mono); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  code { font: 11.5px var(--font-mono); }
</style>
