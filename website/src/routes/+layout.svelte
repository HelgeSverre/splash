<script lang="ts">
	import '$splash/app.css';
	import '#lib/styles/site.css';
	import favicon from '$splash/../public/icon.svg';
	import iconPng from '$splash/../public/icon.png';
	// Inter sets most of the text; fetching it before its CSS is parsed keeps
	// pages from reflowing when it arrives. The mono font is smaller text and
	// left to load on its own.
	import interFont from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url';
	import { page } from '$app/state';
	import Nav from '#lib/components/Nav.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import Overlays from '#lib/components/Overlays.svelte';
	import Lightbox from '#lib/components/Lightbox.svelte';
	import CtaBar from '#lib/components/CtaBar.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	// Share-card captures (scripts/og.ts) render without the site's chrome.
	const bare = $derived(page.route.id === '/og-card/[slug]');
</script>

<svelte:head>
	<link rel="icon" href={favicon} type="image/svg+xml" />
	<link rel="icon" href={iconPng} type="image/png" sizes="1024x1024" />
	<link rel="apple-touch-icon" href={iconPng} />
	<link rel="preload" href={interFont} as="font" type="font/woff2" crossorigin="anonymous" />
	<meta name="theme-color" content="#0a0a0b" />
</svelte:head>

{#if bare}
	{@render children()}
{:else}
	<Nav />
	<main>{@render children()}</main>
	<CtaBar />
	<Footer />
	<Overlays />
	<Lightbox />
{/if}
