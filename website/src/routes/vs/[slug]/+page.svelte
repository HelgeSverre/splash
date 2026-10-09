<script lang="ts">
	// The shared comparison layout. Sections without data are left out.
	import Seo from '#lib/components/Seo.svelte';
	import CompareHeader from '#lib/components/CompareHeader.svelte';
	import CompareGlance from '#lib/components/CompareGlance.svelte';
	import CompareTable from '#lib/components/CompareTable.svelte';
	import Details from '#lib/components/Details.svelte';
	import CompareFit from '#lib/components/CompareFit.svelte';
	import CompareSources from '#lib/components/CompareSources.svelte';
	import { setCites } from '#lib/compare/cite.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	// Prerendered once per slug, so the data never changes under the page.
	// svelte-ignore state_referenced_locally
	const { comparison: c, splash, sources } = data;
	setCites(new Map(sources.map((s) => [s.id, s.n])));
</script>

<Seo title="Splash vs {c.name} · Splash" description={c.description} card="vs-{c.slug}" />

<CompareHeader {c} sources={sources.length} />
<CompareGlance products={[splash, c.other]} />
<CompareTable groups={c.groups} other={c.name} heading="Side by side" />
{#if c.differences?.length}<Details heading="Where they differ" points={c.differences} />{/if}
{#if c.fit}<CompareFit columns={[{ name: 'Splash', points: c.fit.splash }, { name: c.name, points: c.fit.other }]} />{/if}
<CompareSources {sources} name={c.name} checked={c.checked} />
