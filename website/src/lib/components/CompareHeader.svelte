<script lang="ts">
	// The top of a comparison page: title, the neutral intro, and when it was checked.
	import type { Comparison } from '../compare/types.ts';
	import { date } from '../compare/date.ts';
	import JsonLd, { breadcrumbs } from './JsonLd.svelte';

	let { c, sources }: { c: Comparison; sources: number } = $props();
</script>

<JsonLd data={breadcrumbs([{ name: 'Splash', path: '/' }, { name: 'Compare', path: '/vs' }, { name: c.name, path: `/vs/${c.slug}` }])} />

<header class="head">
	<div class="glow" aria-hidden="true"></div>
	<div class="wrap">
		<p class="eyebrow"><a href="/">Splash</a><span aria-hidden="true">/</span><a href="/vs">Compare</a><span aria-hidden="true">/</span><span class="n">{c.name}</span></p>
		<h1 class="display">Splash and {c.name}, <span class="accent">compared.</span></h1>
		<p class="lede">{c.intro}</p>
		<p class="meta">
			<span>Checked {date(c.checked)}</span><i aria-hidden="true">·</i><a href="#sources">{sources} sources</a><i aria-hidden="true">·</i><span>Not affiliated with {c.other.maker}</span>
		</p>
	</div>
</header>

<style>
	.head {
		position: relative;
		padding: 80px 0 24px;
	}
	.glow {
		position: absolute;
		inset: -60px 0 auto;
		height: 700px;
		background: var(--site-glow);
		pointer-events: none;
	}
	.wrap {
		position: relative;
	}
	.eyebrow a {
		color: var(--muted);
		text-decoration: none;
	}
	.eyebrow a:is(:hover, :focus-visible) {
		color: var(--text);
	}
	.display {
		margin-top: 24px;
		max-width: 18ch;
		font-size: clamp(38px, 5.4vw, 66px);
	}
	.lede {
		margin-top: 28px;
		max-width: 64ch;
	}
	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 10px;
		margin: 24px 0 0;
		color: var(--muted);
		font: 12.5px var(--font-mono);
	}
	.meta i {
		font-style: normal;
		color: var(--faint);
	}
	.meta a {
		color: var(--text-2);
		text-decoration: underline;
		text-decoration-color: var(--border-focus);
		text-underline-offset: 3px;
	}
	.meta a:is(:hover, :focus-visible) {
		color: var(--text);
		text-decoration-color: var(--accent);
	}
</style>
