<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import CompareCard from '#lib/components/CompareCard.svelte';
	import { date } from '#lib/compare/date.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<Seo
	title="Splash compared · Splash"
	description="How Splash compares with other apps for running coding agents in parallel: agents, platforms, pricing, worktrees and review, with a source for every fact."
	card="vs"
/>

<header class="head">
	<div class="glow" aria-hidden="true"></div>
	<div class="wrap">
		<p class="eyebrow"><a href="/">Splash</a><span aria-hidden="true">/</span><span class="n">Compare</span></p>
		<h1 class="display">Splash and the alternatives, <span class="accent">compared.</span></h1>
		<p class="lede">
			Several apps run coding agents in parallel, and they differ in which agents they support, where they run, what they cost and how you review the work. Each page sets one of them beside Splash, fact by fact, with a source for every statement.
		</p>
		<p class="meta">{data.cards.length} comparisons · checked {date(data.checked[0])}{#if data.checked.length > 1} to {date(data.checked.at(-1)!)}{/if}</p>
	</div>
</header>

<section class="wrap grid" aria-label="Comparisons">
	{#each data.cards as card (card.slug)}<CompareCard {card} />{/each}
</section>

<style>
	.head {
		position: relative;
		padding: 80px 0 48px;
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
		margin: 24px 0 0;
		color: var(--muted);
		font: 12.5px var(--font-mono);
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 16px;
	}
</style>
