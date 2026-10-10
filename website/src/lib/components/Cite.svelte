<script lang="ts">
	// Footnote links to a comparison's sources, numbered by `setCites`.
	import { getCites } from '../compare/cite.ts';

	let { ids }: { ids: string[] } = $props();
	const cites = getCites();
</script>

{#if ids.length}
	<sup class="cite">
		{#each ids as id (id)}{@const n = cites.get(id)}<a href="#source-{id}" aria-label="Source {n}">{n}</a>{/each}
	</sup>
{/if}

<style>
	.cite {
		display: inline-flex;
		margin-left: 1px;
		vertical-align: super;
		line-height: 0;
		font: var(--fw-medium) 10.5px var(--font-mono);
	}
	/* A 24 × 24 px tap target around each small number; the negative margins
	   keep it from growing the line. */
	a {
		min-width: 24px;
		padding: 5px 0;
		margin: -5px 0;
		line-height: 14px;
		text-align: center;
		color: var(--muted);
		text-decoration: none;
	}
	a::before {
		content: '[';
	}
	a::after {
		content: ']';
	}
	a:is(:hover, :focus-visible) {
		color: var(--accent);
	}
</style>
