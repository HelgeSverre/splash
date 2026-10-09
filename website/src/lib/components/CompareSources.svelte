<script lang="ts">
	// A comparison's numbered sources, and how they were gathered.
	import type { Numbered } from '../compare/sources.ts';
	import { date } from '../compare/date.ts';
	import { ISSUES_URL } from '../site.ts';

	let { sources, name, checked }: { sources: Numbered[]; name: string; checked: string } = $props();
	const host = (url: string) => new URL(url).host.replace(/^www\./, '');
</script>

<section class="wrap sources" id="sources">
	<h2 class="h3">Sources</h2>
	<p class="note">
		Facts about {name} come from its public website, documentation and repositories as they read on {date(checked)}; we haven't confirmed each one by running {name}. Facts about Splash link to its source. Products change, so check the linked pages before deciding. Something wrong or out of date? <a class="prose-link" href={ISSUES_URL}>Open an issue</a>.
	</p>
	<ol>
		{#each sources as s (s.id)}
			<li id="source-{s.id}">
				<span class="n">{s.n}</span>
				<span class="body">
					<a href={s.url}>{s.title}</a>
					<span class="meta">{s.publisher} · {host(s.url)} · checked {s.checked}</span>
				</span>
			</li>
		{/each}
	</ol>
</section>

<style>
	.sources {
		margin-top: 120px;
	}
	.note,
	ol {
		max-width: 76ch;
	}
	.note {
		margin: 12px 0 0;
		font-size: 14.5px;
	}
	ol {
		display: grid;
		gap: 10px;
		margin: 28px 0 0;
		padding: 0;
		list-style: none;
		font-size: 14px;
	}
	li {
		display: flex;
		gap: 12px;
		scroll-margin-top: 140px;
	}
	li:target {
		background: var(--accent-soft);
		border-radius: var(--radius);
		outline: 6px solid var(--accent-soft);
	}
	.n {
		flex: none;
		width: 24px;
		color: var(--muted);
		font: var(--fw-medium) 12.5px / 1.6 var(--font-mono);
		text-align: right;
	}
	.body {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}
	.body a {
		color: var(--text);
		text-decoration: underline;
		text-decoration-color: var(--border-focus);
		text-underline-offset: 3px;
		overflow-wrap: anywhere;
	}
	.body a:is(:hover, :focus-visible) {
		text-decoration-color: var(--accent);
	}
	.meta {
		color: var(--muted);
		font: 12px var(--font-mono);
	}
</style>
