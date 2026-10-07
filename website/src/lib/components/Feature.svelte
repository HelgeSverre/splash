<script lang="ts">
	// One feature on a page: the claim and its details beside (or above) the
	// live scene or capture that proves it.
	import type { Snippet } from 'svelte';

	let {
		n,
		eyebrow,
		title,
		href,
		more = eyebrow,
		stacked = false,
		children,
		media
	}: { n?: string; eyebrow: string; title: string; href?: string; more?: string; stacked?: boolean; children: Snippet; media?: Snippet } = $props();
</script>

<section class="feature wrap" class:stacked>
	<div class="copy">
		<p class="eyebrow">{#if n}<span class="n">{n}</span>{/if}{eyebrow}</p>
		<h2 class="h2">{title}</h2>
		<div class="body">{@render children()}</div>
		{#if href}<a class="more" {href}>More on {more} <span aria-hidden="true">→</span></a>{/if}
	</div>
	{#if media}<div class="media">{@render media()}</div>{/if}
</section>

<style>
	.feature {
		display: grid;
		grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.6fr);
		gap: 56px;
		align-items: center;
		margin-top: 160px;
	}
	.feature.stacked {
		grid-template-columns: 1fr;
		gap: 40px;
	}
	.stacked .copy {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		column-gap: 56px;
		align-items: end;
	}
	.stacked .eyebrow,
	.stacked .h2 {
		grid-column: 1;
	}
	.stacked .body,
	.stacked .more {
		grid-column: 2;
	}
	.stacked .body {
		grid-row: 1 / span 2;
		align-self: end;
	}
	.copy {
		min-width: 0;
	}
	.h2 {
		margin-top: 16px;
	}
	.body {
		margin-top: 20px;
		font-size: 17px;
	}
	.body :global(p) {
		margin: 0 0 14px;
	}
	.body :global(ul) {
		margin: 18px 0 0;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 10px;
		font-size: 15px;
	}
	.body :global(li) {
		position: relative;
		padding-left: 20px;
	}
	.body :global(li)::before {
		content: '';
		position: absolute;
		left: 2px;
		top: 0.62em;
		width: 7px;
		height: 7px;
		border-radius: 2px;
		background: var(--accent);
	}
	.body :global(strong) {
		color: var(--text);
		font-weight: var(--fw-medium);
	}
	.more {
		display: inline-flex;
		gap: 6px;
		margin-top: 22px;
		color: var(--text);
		font-weight: var(--fw-medium);
		font-size: 15px;
		text-decoration: none;
		border-bottom: 1px solid var(--border-focus);
		padding-bottom: 2px;
	}
	.more:is(:hover, :focus-visible) {
		border-color: var(--accent);
	}
	.media {
		min-width: 0;
	}
	@media (max-width: 960px) {
		.feature,
		.stacked .copy {
			grid-template-columns: 1fr;
			gap: 32px;
		}
		.stacked .body,
		.stacked .more {
			grid-column: 1;
			grid-row: auto;
		}
		.feature {
			margin-top: 110px;
		}
	}
</style>
