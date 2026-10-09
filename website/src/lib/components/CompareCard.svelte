<script lang="ts">
	// A link to one comparison: the other product, who makes it, what it is.
	export type CompareCardData = { slug: string; name: string; maker: string; summary: string };
	let { card }: { card: CompareCardData } = $props();
</script>

<a class="card" href="/vs/{card.slug}">
	<span class="vs">Splash vs</span>
	<span class="name">{card.name}</span>
	<span class="maker">{card.maker}</span>
	<span class="summary">{card.summary}</span>
	<span class="go">Compare <span aria-hidden="true">→</span></span>
</a>

<style>
	.card {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 22px;
		border: 1px solid var(--border);
		border-radius: 12px;
		background: var(--surface);
		text-decoration: none;
		transition: border-color 0.15s;
	}
	.card:is(:hover, :focus-visible) {
		border-color: var(--border-focus);
	}
	.vs {
		color: var(--muted);
		font: var(--fw-medium) 12px var(--font-mono);
	}
	.name {
		margin-top: 6px;
		color: var(--text);
		font: var(--fw-semibold) 19px var(--font-ui);
		letter-spacing: -0.015em;
	}
	.maker {
		margin-top: 2px;
		color: var(--muted);
		font: 12.5px var(--font-mono);
	}
	.summary {
		flex: 1;
		margin-top: 14px;
		color: var(--text-2);
		font-size: 14.5px;
		line-height: 1.55;
	}
	.go {
		margin-top: 18px;
		color: var(--text);
		font: var(--fw-medium) 13px var(--font-mono);
	}
	.card:is(:hover, :focus-visible) .go {
		color: var(--accent);
	}
</style>
