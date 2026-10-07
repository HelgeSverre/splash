<script lang="ts">
	// Previous and next feature.
	import { FEATURES } from '../site';

	let { slug }: { slug: string } = $props();
	const i = FEATURES.findIndex((f) => f.slug === slug);
	const prev = FEATURES[(i - 1 + FEATURES.length) % FEATURES.length];
	const next = FEATURES[(i + 1) % FEATURES.length];
</script>

<nav class="wrap pager" aria-label="More features">
	<a class="card" href="/features/{prev.slug}"><span class="dir">← Previous</span><span class="name">{prev.name}</span><span class="sum">{prev.summary}</span></a>
	<a class="card right" href="/features/{next.slug}"><span class="dir">Next →</span><span class="name">{next.name}</span><span class="sum">{next.summary}</span></a>
</nav>

<style>
	.pager {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
		align-items: stretch;
		margin-top: 120px;
	}
	.card {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 20px;
		border: 1px solid var(--border);
		border-radius: 12px;
		text-decoration: none;
	}
	.card:is(:hover, :focus-visible) {
		border-color: var(--border-focus);
		background: var(--surface);
	}
	.right {
		text-align: right;
	}
	.dir {
		color: var(--muted);
		font: var(--fw-medium) 12px var(--font-mono);
	}
	.name {
		color: var(--text);
		font-weight: var(--fw-semibold);
		font-size: 17px;
	}
	.sum {
		color: var(--text-2);
		font-size: 14px;
	}
	@media (max-width: 640px) {
		.pager {
			grid-template-columns: 1fr;
		}
		.right {
			text-align: left;
		}
	}
</style>
