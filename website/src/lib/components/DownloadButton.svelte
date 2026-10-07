<script lang="ts">
	// The primary download: a direct link to the build for the visitor's OS
	// (macOS until the browser says otherwise), and the full list one click away.
	import { onMount } from 'svelte';
	import { OS_NAMES, VERSION, detect, primaryFor, type Os } from '../releases.ts';

	// `dark` sits on the accent-coloured bar, where the primary yellow would vanish.
	let { others = false, tone = 'primary' }: { others?: boolean; tone?: 'primary' | 'dark' } = $props();

	let os: Os = $state('macos');
	let intel = $state(false);
	onMount(async () => {
		const found = await detect();
		if (found.os) os = found.os;
		intel = found.intel;
	});

	const file = $derived(primaryFor(os, intel));
</script>

<span class="download">
	<a class="cta {tone}" href={file.url}>
		<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2v8m0 0L4.5 6.5M8 10l3.5-3.5M3 13h10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
		Download for {OS_NAMES[os]}
		<span class="sub">v{VERSION}</span>
	</a>
	{#if others}<a class="others" href="/download">All platforms and formats →</a>{/if}
</span>

<style>
	.download {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}
	.others {
		color: var(--muted);
		font-size: 13px;
		text-decoration: none;
	}
	.others:is(:hover, :focus-visible) {
		color: var(--text);
	}
</style>
