<script lang="ts">
  import AgentIcon from "../AgentIcon.svelte";
  import Icon from "../Icon.svelte";
  import IconButton from "../ui/IconButton.svelte";
  import StatusBadge from "../ui/StatusBadge.svelte";
  import Tag from "../ui/Tag.svelte";
  import { app, refreshAllAgents } from "../../lib/state.svelte";
  import { readiness } from "../../lib/agents";
</script>

<div class="set-page">
  <div class="title-row">
    <h2>Agents</h2>
    <IconButton title="Refresh — detect and probe all agents" disabled={app.agentsLoading} onclick={refreshAllAgents}>
      {#if app.agentsLoading}<span class="spinner"></span>{:else}<Icon name="refresh" size={15} />{/if}
    </IconButton>
  </div>
  <p class="lede dim">Agents connect over ACP, natively or through an adapter. Refreshing is free.</p>
  <div class="set-group">
    {#each app.agents as a (a.id)}
      {@const r = readiness(a)}
      <button class="plain set-row agent" onclick={() => (app.settings = `agent:${a.id}`)}>
        <AgentIcon id={a.id} size={18} />
        <div class="set-label">
          <div>{a.name} {#if a.experimental}<Tag tone="warn">experimental</Tag>{/if}</div>
          <div class="set-desc">{a.transport === "native" ? "native ACP" : "ACP adapter"}{a.installed ? ` · v${a.version ?? "?"}` : ""}</div>
        </div>
        <StatusBadge tone={r.tone} label={r.label} />
        <span class="chev">›</span>
      </button>
    {/each}
  </div>
</div>

<style>
  .title-row { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
  .title-row h2 { margin: 0; }
  .agent { width: 100%; gap: 14px; }
  .agent:hover { background: var(--soft); }
  .set-group > .agent + .agent { border-top: 1px solid var(--border); }
  .chev { color: var(--faint); font-size: 16px; }
</style>
