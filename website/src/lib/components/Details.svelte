<script lang="ts">
	// A page's detail points: short titled paragraphs in a grid. `cite` is for
	// comparison pages, which provide the source numbers.
	import type { Point } from '../compare/types.ts';
	import Cite from './Cite.svelte';

	let { points, heading }: { points: Point[]; heading?: string } = $props();
</script>

<section class="wrap details">
	{#if heading}<h2 class="h2">{heading}</h2>{/if}
	<div class="grid">
		{#each points as p (p.title)}
			<div class="point">
				<h3 class="h3">{p.title}</h3>
				<p>{@html p.text}{#if p.cite}<Cite ids={p.cite} />{/if}</p>
			</div>
		{/each}
	</div>
</section>

<style>
	.details {
		margin-top: 120px;
	}
	.h2 {
		margin-bottom: 40px;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 40px 48px;
	}
	.point {
		padding-top: 20px;
		border-top: 1px solid var(--border);
	}
	p {
		margin: 10px 0 0;
		font-size: 15.5px;
	}
	p :global(code) {
		font: 13.5px var(--font-mono);
		color: var(--text);
	}
	p :global(strong) {
		color: var(--text);
		font-weight: var(--fw-medium);
	}
</style>
