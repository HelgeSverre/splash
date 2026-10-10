<script lang="ts">
	// Tools without a comparison page, by kind: name, maker and what each is.
	import type { DirectoryCategory, DirectoryEntry } from '../compare/directory.ts';
	import { date } from '../compare/date.ts';

	let { entries, checked }: { entries: DirectoryEntry[]; checked: string } = $props();

	const GROUPS: { id: DirectoryCategory; title: string }[] = [
		{ id: 'desktop', title: 'Desktop apps' },
		{ id: 'vendor', title: 'From agent and IDE makers' },
		{ id: 'web-cloud', title: 'Web and cloud' },
		{ id: 'terminal', title: 'Terminal' },
		{ id: 'ide', title: 'Editors with agent features' },
		{ id: 'single-agent', title: 'Apps for one agent' }
	];
	const groups = $derived(GROUPS.map((g) => ({ ...g, items: entries.filter((e) => e.category === g.id).sort((a, b) => a.name.localeCompare(b.name)) })).filter((g) => g.items.length));
</script>

<section class="wrap directory" id="directory">
	<h2 class="h2">More tools in this space</h2>
	<p class="note">Listed, not compared. Each line describes the tool from its own site, as it read on {date(checked)}.</p>
	{#each groups as g (g.id)}
		<h3 class="group">{g.title}</h3>
		<ul>
			{#each g.items as e (e.url)}
				<li>
					<a class="name" href={e.url} rel="noopener">{e.name}</a>
					<span class="maker">{e.maker}</span>
					<span class="summary">{e.summary}{#if e.source}<a class="src" href={e.source} rel="noopener" aria-label="Source for {e.name}">source</a>{/if}</span>
				</li>
			{/each}
		</ul>
	{/each}
</section>

<style>
	.directory {
		margin-top: 120px;
	}
	.note {
		margin: 12px 0 0;
		max-width: 70ch;
		font-size: 15px;
	}
	.group {
		margin: 40px 0 0;
		color: var(--muted);
		font: var(--fw-medium) 12px var(--font-mono);
	}
	ul {
		margin: 8px 0 0;
		padding: 0;
		list-style: none;
	}
	li {
		display: grid;
		grid-template-columns: minmax(0, 220px) minmax(0, 180px) minmax(0, 1fr);
		gap: 4px 20px;
		padding: 12px 0;
		border-top: 1px solid var(--border);
		font-size: 14.5px;
	}
	.name {
		color: var(--text);
		font-weight: var(--fw-medium);
		text-decoration: none;
	}
	.name:is(:hover, :focus-visible) {
		text-decoration: underline;
		text-decoration-color: var(--accent);
		text-underline-offset: 3px;
	}
	.maker {
		color: var(--muted);
		font: 12.5px / 1.9 var(--font-mono);
	}
	.summary {
		color: var(--text-2);
	}
	.src {
		margin-left: 8px;
		color: var(--muted);
		font: 12px var(--font-mono);
	}
	.src:is(:hover, :focus-visible) {
		color: var(--accent);
	}
	@media (max-width: 720px) {
		li {
			grid-template-columns: 1fr;
		}
	}
</style>
