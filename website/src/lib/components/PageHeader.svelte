<script lang="ts">
	// The top of a feature page.
	import type { Snippet } from 'svelte';
	import { FEATURES } from '../site';

	let { slug, title, children }: { slug: string; title: string; children: Snippet } = $props();
	const feature = FEATURES.find((f) => f.slug === slug)!;
</script>

<svelte:head>
	<title>{feature.name} · Splash</title>
	<meta name="description" content={feature.summary} />
</svelte:head>

<header class="head">
	<div class="glow" aria-hidden="true"></div>
	<div class="wrap">
		<p class="eyebrow">
			<a href="/">Splash</a><span aria-hidden="true">/</span><span class="n">{feature.name}</span>
		</p>
		<h1 class="display">{title}</h1>
		<div class="lede">{@render children()}</div>
	</div>
</header>

<style>
	.head {
		position: relative;
		padding: 80px 0 56px;
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
		max-width: 16ch;
		font-size: clamp(38px, 5.4vw, 66px);
	}
	.lede {
		margin-top: 28px;
		max-width: 62ch;
		font-size: var(--site-fs-lede);
		line-height: 1.55;
	}
	.lede :global(p) {
		margin: 0 0 12px;
	}
	.lede :global(strong) {
		color: var(--text);
		font-weight: var(--fw-medium);
	}
</style>
