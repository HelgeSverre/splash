// The comparisons hub: one card per page, built from the comparison data at
// build time.
import { COMPARISONS } from '#lib/compare/index.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	cards: COMPARISONS.map((c) => ({ slug: c.slug, name: c.name, maker: c.other.maker, summary: c.other.summary })),
	checked: [...new Set(COMPARISONS.map((c) => c.checked))].sort()
});
