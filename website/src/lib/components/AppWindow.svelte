<script lang="ts">
	// A desktop window around a live scene. The scene renders at its real size
	// (`width` × `height` CSS px) and the window zooms to fit narrower columns,
	// down to `minZoom`. `contain` makes it the containing block for the app's
	// fixed-position dialogs, so they open inside the window.
	import type { Snippet } from 'svelte';

	let {
		title = 'Splash',
		width = 1180,
		height = 720,
		minZoom = 0.62,
		children
	}: { title?: string; width?: number; height?: number; minZoom?: number; children: Snippet } = $props();

	let outer = $state(0);
	const zoom = $derived(outer ? Math.max(minZoom, Math.min(1, outer / width)) : 1);
	// Below the minimum the window keeps the column's width and its own height.
	const fluid = $derived(outer > 0 && outer / width < minZoom);
</script>

<div class="frame" bind:clientWidth={outer} style:height={fluid ? undefined : `${height * zoom}px`}>
	<div class="window" class:fluid style:width={fluid ? undefined : `${width}px`} style:height="{height}px" style:zoom={fluid ? undefined : zoom}>
		<div class="titlebar" aria-hidden="true">
			<span class="lights"><i></i><i></i><i></i></span>
			<span class="title">{title}</span>
		</div>
		<div class="splash-ui body">{@render children()}</div>
	</div>
</div>

<style>
	.frame {
		position: relative;
		width: 100%;
	}
	.window {
		position: relative;
		display: flex;
		flex-direction: column;
		background: var(--bg);
		border: 1px solid var(--border-strong);
		border-radius: 12px;
		overflow: hidden;
		box-shadow: var(--site-window-shadow);
		contain: layout paint;
		margin-inline: auto;
	}
	.window.fluid {
		width: 100%;
	}
	.titlebar {
		flex: none;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		height: 30px;
		padding: 0 12px;
		background: var(--surface);
		border-bottom: 1px solid var(--border);
	}
	.lights {
		display: flex;
		gap: 7px;
	}
	.lights i {
		width: 11px;
		height: 11px;
		border-radius: 50%;
		background: var(--border-strong);
	}
	.title {
		font: var(--fw-medium) var(--fs-xs) var(--font-ui);
		color: var(--muted);
	}
	.body {
		flex: 1;
		min-height: 0;
		position: relative;
	}
</style>
