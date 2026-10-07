<script lang="ts">
	// A page's title, description, canonical URL and share card. Prerendering
	// runs on a placeholder origin, so absolute URLs start from SITE_URL.
	import { page } from '$app/state';
	import { CARDS } from '../og';
	import { SITE_NAME, SITE_URL } from '../site';

	let { title, description, card }: { title: string; description: string; card: keyof typeof CARDS } = $props();

	const url = $derived(SITE_URL + page.url.pathname);
	const image = $derived(`${SITE_URL}/og/${card}.png`);
	const alt = $derived(CARDS[card].alt);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={alt} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
	<meta name="twitter:image:alt" content={alt} />
</svelte:head>
