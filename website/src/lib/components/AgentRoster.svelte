<script lang="ts">
	// The app's agent registry (src/agents/registry.rs) with the app's own
	// icons. `detailed` adds each launch command.
	import AgentIcon from '$splash/components/AgentIcon.svelte';
	import { REGISTRY } from '../registry.ts';

	let { detailed = false }: { detailed?: boolean } = $props();
</script>

{#if detailed}
	<div class="table" role="table" aria-label="Supported agents and launch commands">
		<div class="tr head" role="row"><span role="columnheader">Agent</span><span role="columnheader">Launch command</span><span role="columnheader">Kind</span></div>
		{#each REGISTRY as { id, name, launch, adapter } (id)}
			<div class="tr" role="row">
				<span class="name" role="cell"><span class="icon splash-ui"><AgentIcon {id} size={16} /></span>{name}</span>
				<span role="cell"><code>{launch}</code></span>
				<span class="kind" role="cell">{adapter ? 'Adapter' : 'Native ACP'}</span>
			</div>
		{/each}
	</div>
{:else}
	<ul class="grid">
		{#each REGISTRY as { id, name, launch } (id)}
			<li title={launch}><span class="icon splash-ui"><AgentIcon {id} size={18} /></span>{name}</li>
		{/each}
	</ul>
{/if}

<style>
	.grid {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.grid li {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		height: 36px;
		padding: 0 14px 0 10px;
		border: 1px solid var(--border);
		border-radius: var(--radius-pill);
		background: var(--surface);
		color: var(--text-2);
		font-size: 14px;
		cursor: default;
	}
	.grid li:hover {
		color: var(--text);
		border-color: var(--border-strong);
	} /* hover-only */
	.icon {
		display: inline-flex;
		color: var(--text);
	}
	.table {
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		overflow: hidden;
		font-size: 14px;
	}
	.tr {
		display: grid;
		grid-template-columns: 180px minmax(0, 1fr) 110px;
		gap: 16px;
		align-items: center;
		padding: 9px 16px;
		border-top: 1px solid var(--border);
	}
	.tr.head {
		border-top: 0;
		background: var(--surface);
		color: var(--muted);
		font: var(--fw-medium) 12px var(--font-mono);
	}
	.name {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		color: var(--text);
	}
	code {
		font: var(--fs-sm) var(--font-mono);
		color: var(--text-2);
		overflow-wrap: anywhere;
	}
	.kind {
		color: var(--muted);
		font-size: 13px;
	}
	@media (max-width: 640px) {
		.tr {
			grid-template-columns: 1fr;
			gap: 4px;
		}
		.kind,
		.head {
			display: none;
		}
	}
</style>
