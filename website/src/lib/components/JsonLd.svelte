<script lang="ts" module>
	import { SITE_URL } from '../site';

	/** A BreadcrumbList for search results: the trail from the home page to this one. */
	export function breadcrumbs(trail: { name: string; path: string }[]) {
		return {
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: SITE_URL + t.path }))
		};
	}
</script>

<script lang="ts">
	// Structured data for search engines, in the page head.
	let { data }: { data: object } = $props();

	// `<` is escaped so the JSON can never close the script element early.
	const script = $derived(`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}<\/script>`);
</script>

<svelte:head>{@html script}</svelte:head>
