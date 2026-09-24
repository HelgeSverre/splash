<script lang="ts">
  import AgentIcon from "../AgentIcon.svelte";
  import FilterInput from "../ui/FilterInput.svelte";
  import Tag from "../ui/Tag.svelte";
  import { app, customize, preview } from "../../lib/state.svelte";
  import { commandsFor, type CommandRow } from "../../lib/agents";

  let { id }: { id: string } = $props();
  let filter = $state("");
  const agent = $derived(app.agents.find((a) => a.id === id));
  const all = $derived(agent ? commandsFor(agent, customize.commandFiles, customize.skills ?? []) : []);
  const shown = $derived(all.filter((c) => !filter || `${c.name} ${c.description}`.toLowerCase().includes(filter.toLowerCase())));

  function open(c: CommandRow) {
    preview.doc = { title: `/${c.name}`, kind: "command", agent: id, path: c.path, description: c.description, hint: c.hint };
  }
</script>

<div class="set-page">
  <h2><AgentIcon {id} size={18} /> {agent?.name} · Commands</h2>
  <p class="lede">The slash commands {agent?.name} advertises — built-ins, your custom commands and skills. Type <code>/</code> in the composer to use them; click one to read it.</p>
  {#if !agent?.probe?.ok}
    <div class="set-group"><div class="set-empty">Refresh {agent?.name ?? "the agent"} to list its commands.</div></div>
  {:else}
    <div class="bar"><FilterInput bind:value={filter} placeholder="Filter commands" shown={shown.length} total={all.length} /></div>
    <div class="set-group list">
      {#each shown as c (c.name)}
        <button class="plain cmd" onclick={() => open(c)}>
          <span class="name">/{c.name}</span>
          <span class="desc">{c.description}{#if c.hint}<span class="hint"> · {c.hint}</span>{/if}</span>
          {#if c.source === "builtin"}<Tag>built in</Tag>{:else if c.source === "skill"}<Tag>skill</Tag>{/if}
        </button>
      {:else}
        <div class="set-empty">No commands{filter ? " match" : ""}.</div>
      {/each}
    </div>
  {/if}
</div>

<style>
  h2 { display: flex; align-items: center; gap: 8px; }
  .bar { display: flex; margin: 0 0 12px; }
  .list { padding: 4px 0; }
  .cmd { display: flex; align-items: center; gap: 14px; width: 100%; padding: 6px 14px; font-size: 12px; min-width: 0; }
  .cmd:hover { background: var(--soft); }
  .name { font-family: var(--font-mono); color: var(--accent); flex: none; min-width: 140px; }
  .desc { flex: 1; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .hint { color: var(--faint); }
  code { font: 11.5px var(--font-mono); }
</style>
