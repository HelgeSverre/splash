<script lang="ts">
  import AgentIcon from "../AgentIcon.svelte";
  import FilterInput from "../ui/FilterInput.svelte";
  import RevealButton from "../ui/RevealButton.svelte";
  import Tag from "../ui/Tag.svelte";
  import { app, customize, preview } from "../../lib/state.svelte";
  import { skillsFor } from "../../lib/agents";
  import { home } from "../../lib/paths";
  import type { Skill } from "../../bindings";

  let { id }: { id: string } = $props();
  let filter = $state("");
  const agent = $derived(app.agents.find((a) => a.id === id));
  const all = $derived(customize.skills ? skillsFor(customize.skills, id) : null);
  const shown = $derived(
    (all ?? []).filter((s) => !filter || `${s.name} ${s.description} ${s.source}`.toLowerCase().includes(filter.toLowerCase())),
  );
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
  <h2><AgentIcon {id} size={18} /> {agent?.name} · Skills</h2>
  <p class="lede">Skill folders (<code>SKILL.md</code>) {agent?.name} picks up — its own, plus the shared <code>.agents/skills</code>. Click one to read it.</p>
  <div class="bar"><FilterInput bind:value={filter} placeholder="Filter skills" shown={shown.length} total={all?.length ?? 0} /></div>

  {#if all === null}
    <div class="set-empty"><span class="spinner"></span></div>
  {:else}
    {#each groups as [source, list] (source)}
      <div class="set-group-title src">{home(source)} {#if !list[0].agents.length}<Tag>shared</Tag>{/if}</div>
      <div class="set-group">
        {#each list as s (s.path)}
          <div class="set-row clickable" role="button" tabindex="0" onclick={() => open(s)} onkeydown={(e) => e.key === "Enter" && open(s)}>
            <div class="set-label">
              <div class="name">
                {s.name}
                {#if !s.user_invocable}<Tag title="user-invocable: false">not in / menu</Tag>{/if}
                {#if s.manual_only}<Tag title="disable-model-invocation: true">manual only</Tag>{/if}
              </div>
              {#if s.description}<div class="set-desc clamp">{s.description}</div>{/if}
            </div>
            <RevealButton path={s.path} />
          </div>
        {/each}
      </div>
    {:else}
      <div class="set-group"><div class="set-empty">No skills{filter ? " match" : ""}.</div></div>
    {/each}
  {/if}
</div>

<style>
  h2 { display: flex; align-items: center; gap: 8px; }
  .bar { display: flex; margin-bottom: 4px; }
  .src { display: flex; align-items: center; gap: 8px; font: 600 11.5px var(--font-mono); }
  .name { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
  .clickable { cursor: pointer; }
  .clickable:hover { background: var(--soft); }
  .clamp { display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  code { font: 11.5px var(--font-mono); }
</style>
