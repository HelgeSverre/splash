// Comparison data and source numbering run at build time only; the page gets
// the result, and the data modules never ship to the browser.
import { error } from '@sveltejs/kit';
import { COMPARISONS } from '#lib/compare/index.ts';
import { SPLASH } from '#lib/compare/splash.ts';
import { numberSources } from '#lib/compare/sources.ts';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => COMPARISONS.map((c) => ({ slug: c.slug }));

export const load: PageServerLoad = ({ params }) => {
	const comparison = COMPARISONS.find((c) => c.slug === params.slug);
	if (!comparison) error(404);
	return { comparison, splash: SPLASH, sources: numberSources(comparison) };
};
