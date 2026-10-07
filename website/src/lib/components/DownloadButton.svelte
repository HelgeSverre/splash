<script lang="ts">
	// The primary download: the build for the visitor's OS (macOS until the
	// browser says otherwise), with every other platform and format in a menu.
	import { onMount } from 'svelte';
	import { OS_NAMES, PLATFORMS, detect, primaryFor, type Os } from '../releases.ts';
	import { latest, loadLatest, resolve } from '../latest.svelte.ts';

	// `dark` sits on the accent-coloured bar, where the primary yellow would vanish.
	let { tone = 'primary', menu = true }: { tone?: 'primary' | 'dark'; menu?: boolean } = $props();

	let os: Os = $state('macos');
	let intel = $state(false);
	let open = $state(false);
	let root: HTMLElement;
	const id = `downloads-${Math.random().toString(36).slice(2, 8)}`;

	onMount(async () => {
		loadLatest();
		const found = await detect();
		if (found.os) os = found.os;
		intel = found.intel;
	});

	const file = $derived(resolve(primaryFor(os, intel)));

	function onpointerdown(e: PointerEvent) {
		if (open && !root.contains(e.target as Node)) open = false;
	}
	function onkeydown(e: KeyboardEvent) {
		if (!open) return;
		if (e.key === 'Escape') {
			open = false;
			root.querySelector<HTMLButtonElement>('.more')?.focus();
		}
		if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
			e.preventDefault();
			const items = [...root.querySelectorAll<HTMLAnchorElement>('[role=menuitem]')];
			const i = items.indexOf(document.activeElement as HTMLAnchorElement);
			items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length]?.focus();
		}
	}
	function toggle() {
		open = !open;
		if (open) queueMicrotask(() => root.querySelector<HTMLAnchorElement>('[role=menuitem]')?.focus());
	}
</script>

<svelte:window {onpointerdown} {onkeydown} />

<span class="download" class:split={menu} bind:this={root}>
	<a class="cta {tone} main" href={file.url}>
		<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2v8m0 0L4.5 6.5M8 10l3.5-3.5M3 13h10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
		Download for {OS_NAMES[os]}
		<span class="sub">v{latest.version}</span>
	</a>
	{#if menu}
		<button class="cta {tone} more" type="button" aria-label="Other platforms and formats" aria-haspopup="menu" aria-expanded={open} aria-controls={id} onclick={toggle}>
			<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
		</button>
		<div class="menu" id={id} role="menu" aria-label="Downloads" hidden={!open}>
			{#each PLATFORMS as p (p.os)}
				<p class="group" role="presentation">{p.name}</p>
				{#each p.downloads as d (d.label)}
					<a role="menuitem" href={resolve(d).url} onclick={() => (open = false)}><span>{d.label}</span><span class="ext">{d.detail}</span></a>
				{/each}
			{/each}
			<a class="all" role="menuitem" href="/download" onclick={() => (open = false)}>Server builds, checksums and changelog →</a>
		</div>
	{/if}
</span>

<style>
	.download {
		position: relative;
		display: inline-flex;
	}
	.split .main {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}
	.more {
		padding: 0 12px;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		border-left-color: var(--on-accent-border);
	}
	.cta.dark.more {
		border-left-color: var(--border-strong);
	}
	.more[aria-expanded='true'] svg {
		rotate: 180deg;
	}
	.menu {
		position: absolute;
		top: calc(100% + 8px);
		right: 0;
		z-index: 40;
		display: flex;
		flex-direction: column;
		width: 280px;
		padding: 6px;
		background: var(--surface);
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-pop);
		color: var(--text);
		text-align: left;
	}
	.menu[hidden] {
		display: none;
	}
	.group {
		margin: 8px 10px 4px;
		color: var(--muted);
		font: var(--fw-medium) 11.5px var(--font-mono);
	}
	.group:first-child {
		margin-top: 4px;
	}
	.menu a {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		padding: 7px 10px;
		border-radius: var(--radius);
		color: var(--text);
		font-size: 14px;
		text-decoration: none;
	}
	.menu a:is(:hover, :focus-visible) {
		background: var(--hover);
		outline: none;
	}
	.ext {
		color: var(--muted);
		font: 12px var(--font-mono);
	}
	.menu .all {
		margin-top: 6px;
		padding-top: 10px;
		border-top: 1px solid var(--border);
		border-radius: 0 0 var(--radius) var(--radius);
		color: var(--text-2);
		font-size: 13px;
	}
	/* Inside the yellow bar the menu keeps the dark page's selection colours. */
	.menu ::selection {
		background: var(--accent);
		color: var(--on-accent);
	}
</style>
