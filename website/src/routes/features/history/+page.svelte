<script lang="ts">
	import PageHeader from '#lib/components/PageHeader.svelte';
	import Details from '#lib/components/Details.svelte';
	import FeatureNav from '#lib/components/FeatureNav.svelte';
	import Feature from '#lib/components/Feature.svelte';
	import Screenshot from '#lib/components/Screenshot.svelte';
	import AppWindow from '#lib/components/AppWindow.svelte';
	import Live from '#lib/components/Live.svelte';
	import { SHOTS } from '#lib/shots.ts';

	// From the repository's recorded initialization fixtures (README).
	const capabilities = [
		['Claude Code 0.81.1', true, true, true],
		['Codex 1.13.1', true, true, true],
		['Pi 0.0.33', true, true, false],
		['Pool 1.0.16', true, true, false],
		['Glue 0.9.0', false, false, false]
	] as const;
</script>

<PageHeader slug="history">
	<p>You started that fix in Claude Code's terminal last week. Splash asks every installed agent for its sessions over ACP, lets you <strong>preview them without sending a prompt</strong>, and continues them here. Search covers every transcript you've saved, archived ones included.</p>
</PageHeader>

<section class="wrap" id="demo">
	<AppWindow title="Sessions · Splash" height={700}>
		<Live load={() => import('#lib/scenes/Workbench.svelte')} props={{ view: 'library' }} />
	</AppWindow>
	<p class="try">Open the <strong>Open from agent</strong> tab and press <strong>Find sessions</strong>, then pick a conversation to preview it.</p>
</section>

<Details
	heading="Find, preview, continue"
	points={[
		{ title: 'Every agent, every folder', text: 'Choose <strong>All installed agents</strong> and <strong>All folders</strong>, or narrow either. Each agent loads, fails and paginates on its own, with its own retry and <strong>Load more</strong>.' },
		{ title: 'Preview first', text: 'A short-lived agent connection loads the transcript and its workspace folders. Nothing is sent to the agent, and previews expire after 15 minutes.' },
		{ title: 'Add or update a local copy', text: '<strong>Add to Splash</strong> saves the conversation with its original session ID, folders and launch arguments. Imported conversations stay in their original folders.' },
		{ title: 'Refresh what changed elsewhere', text: 'Continued a conversation in the terminal? <strong>Refresh from agent</strong> reloads it, and <strong>New activity at agent</strong> tells you when discovery saw newer activity.' }
	]}
/>

<Feature eyebrow="Search" title="Search every transcript you've saved.">
	<p>The library searches titles, folders and saved transcript text across agents, including archived conversations. Pick a result and Splash opens the conversation <strong>at the matching message</strong>. Session URLs survive a reload.</p>
	<ul>
		<li>Filter by project, agent or status.</li>
		<li>Literal word prefixes across transcript text and tool output.</li>
	</ul>
	{#snippet media()}<Screenshot shot={SHOTS.sessionSearch} />{/snippet}
</Feature>

<section class="wrap caps">
	<h2 class="h2">What each adapter supports</h2>
	<p class="lede">Splash negotiates ACP v1 and checks the running adapter's capabilities. This baseline comes from the repository's recorded initialization fixtures.</p>
	<div class="table" role="table" aria-label="History capabilities by adapter">
		<div class="tr head" role="row"><span role="columnheader">Adapter</span><span role="columnheader">Lists sessions</span><span role="columnheader">Loads history</span><span role="columnheader">Resumes without replay</span></div>
		{#each capabilities as [name, list, load, resume] (name)}
			<div class="tr" role="row">
				<span role="cell">{name}</span>
				{#each [list, load, resume] as yes, i (i)}<span role="cell" class:yes>{yes ? 'Yes' : 'No'}</span>{/each}
			</div>
		{/each}
	</div>
</section>

<FeatureNav slug="history" />

<style>
	.try {
		margin: 16px 0 0;
		color: var(--muted);
		font-size: 14px;
		text-align: center;
	}
	.try strong {
		color: var(--text-2);
		font-weight: var(--fw-medium);
	}
	.caps {
		margin-top: 140px;
	}
	.caps .lede {
		margin: 16px 0 32px;
		max-width: 62ch;
	}
	.table {
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		overflow: hidden;
		font-size: 14.5px;
	}
	.tr {
		display: grid;
		grid-template-columns: 1.4fr 1fr 1fr 1fr;
		gap: 16px;
		padding: 11px 18px;
		border-top: 1px solid var(--border);
		color: var(--muted);
	}
	.tr :first-child {
		color: var(--text);
	}
	.tr.head {
		border-top: 0;
		background: var(--surface);
		font: var(--fw-medium) 12px var(--font-mono);
	}
	.tr.head :first-child {
		color: var(--muted);
	}
	.yes {
		color: var(--ok-dim);
	}
	@media (max-width: 640px) {
		.tr {
			grid-template-columns: 1.4fr repeat(3, 0.8fr);
			font-size: 13px;
			gap: 8px;
			padding: 10px 12px;
		}
	}
</style>
