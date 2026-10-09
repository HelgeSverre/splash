<script lang="ts">
	// What each product is, in one card apiece.
	import SplashMark from '$splash/components/SplashMark.svelte';
	import type { Product } from '../compare/types.ts';
	import Cite from './Cite.svelte';

	let { products }: { products: Product[] } = $props();
	const host = (url: string) => (url.startsWith('/') ? 'splash.computer' : new URL(url).host.replace(/^www\./, ''));
</script>

<section class="wrap glance" aria-label="At a glance">
	{#each products as p (p.name)}
		<article class="card">
			<h2 class="name">{#if p.name === 'Splash'}<SplashMark size={20} />{/if}{p.name}</h2>
			<p class="maker">{p.maker}</p>
			<p class="summary">{p.summary}<Cite ids={p.cite} /></p>
			<a class="site" href={p.url}>{host(p.url)} <span aria-hidden="true">↗</span></a>
		</article>
	{/each}
</section>

<style>
	.glance {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 16px;
		margin-top: 48px;
	}
	.card {
		display: flex;
		flex-direction: column;
		padding: 24px;
		border: 1px solid var(--border);
		border-radius: 12px;
		background: var(--surface);
	}
	.name {
		display: flex;
		align-items: center;
		gap: 9px;
		margin: 0;
		color: var(--text);
		font: var(--fw-semibold) 19px var(--font-ui);
		letter-spacing: -0.015em;
	}
	.maker {
		margin: 4px 0 0;
		color: var(--muted);
		font: 12.5px var(--font-mono);
	}
	.summary {
		flex: 1;
		margin: 16px 0 0;
		font-size: 15.5px;
	}
	.site {
		align-self: flex-start;
		margin-top: 20px;
		color: var(--text);
		font: var(--fw-medium) 13px var(--font-mono);
		text-decoration: none;
		border-bottom: 1px solid var(--border-focus);
		padding-bottom: 2px;
	}
	.site:is(:hover, :focus-visible) {
		border-color: var(--accent);
	}
</style>
