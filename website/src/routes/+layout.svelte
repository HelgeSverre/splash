<script lang="ts">
	import '$splash/app.css';
	import '#lib/styles/site.css';
	import favicon from '$splash/../public/icon.svg';
	import Nav from '#lib/components/Nav.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import Overlays from '#lib/components/Overlays.svelte';
	import Lightbox from '#lib/components/Lightbox.svelte';
	import CtaBar from '#lib/components/CtaBar.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#0a0a0b" />
</svelte:head>

<Nav />
<main>{@render children()}</main>
<CtaBar />
<Footer />
<Overlays />
<Lightbox />
