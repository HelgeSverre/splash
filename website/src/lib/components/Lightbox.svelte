<script lang="ts">
	// Full-screen screenshot gallery. A modal <dialog>: showModal() traps focus,
	// Escape closes it natively, and focus returns to the thumbnail on close.
	// ← → step through the page's screenshots, Home and End jump to the ends,
	// and on touch screens a horizontal swipe does the same.
	import { lightbox } from '../gallery.svelte';

	let dialog: HTMLDialogElement;

	$effect(() => {
		if (lightbox.open && !dialog.open) dialog.showModal();
		else if (!lightbox.open && dialog.open) dialog.close();
	});

	const count = $derived(lightbox.slides.length);
	const slide = $derived(lightbox.slides[lightbox.index]);

	// Fetch the neighbours so stepping through doesn't wait on the network.
	$effect(() => {
		if (!lightbox.open || count < 2) return;
		for (const step of [1, -1]) new Image().src = lightbox.slides[(lightbox.index + step + count) % count].src;
	});

	function go(step: number) {
		if (count) lightbox.index = (lightbox.index + step + count) % count;
	}

	function onkeydown(e: KeyboardEvent) {
		const moves: Record<string, () => void> = {
			ArrowRight: () => go(1),
			ArrowLeft: () => go(-1),
			Home: () => (lightbox.index = 0),
			End: () => (lightbox.index = count - 1)
		};
		if (!moves[e.key] || e.metaKey || e.ctrlKey || e.altKey) return;
		e.preventDefault();
		moves[e.key]();
	}

	// The dialog fills the screen; a click anywhere but the image or a control closes it.
	function onclick(e: MouseEvent) {
		if (!(e.target as Element).closest('img, button, figcaption')) dialog.close();
	}

	let startX = 0;
	let startY = 0;
	const ondown = (e: PointerEvent) => ((startX = e.clientX), (startY = e.clientY));
	function onup(e: PointerEvent) {
		if (e.pointerType === 'mouse') return;
		const dx = e.clientX - startX;
		if (Math.abs(dx) > 48 && Math.abs(e.clientY - startY) < 64) go(dx < 0 ? 1 : -1);
	}
</script>

<dialog bind:this={dialog} class="lightbox" aria-label="Screenshots" onclose={() => (lightbox.open = false)} {onkeydown} {onclick}>
	{#if slide}
		<!-- First in order, so showModal() puts focus here. -->
		<button class="close" onclick={() => dialog.close()} aria-label="Close"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8" /></svg></button>
		<figure onpointerdown={ondown} onpointerup={onup}>
			{#key slide.src}<img src={slide.src} alt={slide.alt} />{/key}
			<figcaption>
				{#if count > 1}<span class="count">{lightbox.index + 1} / {count}</span>{/if}
				<span>{slide.caption}</span>
			</figcaption>
		</figure>
		{#if count > 1}
			<button class="nav prev" onclick={() => go(-1)} aria-label="Previous screenshot"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" /></svg></button>
			<button class="nav next" onclick={() => go(1)} aria-label="Next screenshot"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg></button>
		{/if}
		<p class="keys" aria-hidden="true">{#if count > 1}<span class="kbd">←</span><span class="kbd">→</span> browse {/if}<span class="kbd">esc</span> close</p>
	{/if}
</dialog>

<style>
	.lightbox {
		width: 100vw;
		height: 100dvh;
		max-width: none;
		max-height: none;
		margin: 0;
		padding: 0;
		border: 0;
		background: color-mix(in srgb, var(--bg) 92%, transparent);
		backdrop-filter: blur(10px);
		color: var(--text);
		overflow: hidden;
	}
	.lightbox[open] {
		display: grid;
		place-items: center;
		opacity: 1;
		transition: opacity 0.2s ease-out;
		@starting-style {
			opacity: 0;
		}
	}
	.lightbox::backdrop {
		background: transparent;
	}
	:global(html:has(dialog.lightbox[open])) {
		overflow: hidden;
	}
	figure {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
		margin: 0;
		padding: 64px 88px 56px;
		max-width: 100%;
		max-height: 100%;
		touch-action: pan-y;
	}
	img {
		display: block;
		max-width: min(1600px, 100%);
		max-height: calc(100dvh - 180px);
		object-fit: contain;
		border: 1px solid var(--border-strong);
		border-radius: 10px;
		box-shadow: var(--site-window-shadow);
		animation: appear 0.22s ease-out;
	}
	@keyframes appear {
		from {
			opacity: 0;
			transform: scale(0.985);
		}
	}
	figcaption {
		display: flex;
		gap: 12px;
		align-items: baseline;
		color: var(--text-2);
		font-size: 14px;
		text-align: center;
	}
	.count {
		color: var(--muted);
		font: 12.5px var(--font-mono);
		font-variant-numeric: tabular-nums;
	}
	button {
		position: absolute;
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		padding: 0;
		border: 1px solid var(--border-strong);
		border-radius: 50%;
		background: var(--surface);
		color: var(--text-2);
		cursor: pointer;
	}
	button:is(:hover, :focus-visible) {
		color: var(--text);
		background: var(--hover);
		border-color: var(--border-focus);
	}
	svg {
		width: 18px;
		height: 18px;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.6;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.prev {
		left: 24px;
		top: 50%;
		translate: 0 -50%;
	}
	.next {
		right: 24px;
		top: 50%;
		translate: 0 -50%;
	}
	.close {
		top: 16px;
		right: 16px;
	}
	.keys {
		position: absolute;
		left: 24px;
		bottom: 18px;
		margin: 0;
		display: flex;
		gap: 6px;
		align-items: center;
		color: var(--muted);
		font-size: 12.5px;
	}
	.keys .kbd + :not(.kbd) {
		margin-left: 2px;
	}
	@media (max-width: 760px) {
		figure {
			padding: 64px 12px 72px;
		}
		.prev,
		.next {
			top: auto;
			bottom: 16px;
			translate: none;
		}
		.prev {
			left: calc(50% - 56px);
		}
		.next {
			right: calc(50% - 56px);
		}
		.keys {
			display: none;
		}
		img {
			max-height: calc(100dvh - 200px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.lightbox[open] {
			transition-duration: 0.01s;
		}
		img {
			animation: none;
		}
	}
</style>
