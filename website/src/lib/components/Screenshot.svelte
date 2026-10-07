<script lang="ts">
	// A real capture from screenshots/, framed like the live windows. Clicking
	// it opens the page's screenshots in the lightbox.
	import type { Shot } from '../shots';
	import { openGallery } from '../gallery.svelte';

	let { shot, label = true }: { shot: Shot; label?: boolean } = $props();
</script>

<figure>
	<button
		class="zoom"
		type="button"
		data-gallery
		data-src={shot.src}
		data-alt={shot.alt}
		data-caption={shot.caption}
		aria-label="View larger: {shot.caption}"
		onclick={(e) => openGallery(e.currentTarget)}
	>
		<img src={shot.src} alt={shot.alt} loading="lazy" decoding="async" />
		<span class="hint" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5 9 7M2.5 13.5 7 9" /></svg></span>
	</button>
	{#if label}<figcaption>{shot.caption} <span>· screenshot</span></figcaption>{/if}
</figure>

<style>
	figure {
		margin: 0;
	}
	.zoom {
		position: relative;
		display: block;
		width: 100%;
		padding: 0;
		border: 0;
		border-radius: 12px;
		background: none;
		cursor: zoom-in;
	}
	img {
		display: block;
		width: 100%;
		height: auto;
		border: 1px solid var(--border-strong);
		border-radius: 12px;
		box-shadow: var(--site-window-shadow);
		transition: border-color 0.15s;
	}
	.zoom:is(:hover, :focus-visible) img {
		border-color: var(--border-focus);
	}
	.hint {
		position: absolute;
		top: 12px;
		right: 12px;
		display: grid;
		place-items: center;
		width: 32px;
		height: 32px;
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-lg);
		background: color-mix(in srgb, var(--surface) 88%, transparent);
		color: var(--text-2);
		opacity: 0;
		transition: opacity 0.15s;
	}
	.zoom:is(:hover, :focus-visible) .hint {
		opacity: 1;
	}
	.hint svg {
		width: 15px;
		height: 15px;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.5;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	figcaption {
		margin-top: 12px;
		color: var(--text-2);
		font-size: 13px;
	}
	figcaption span {
		color: var(--muted);
	}
</style>
