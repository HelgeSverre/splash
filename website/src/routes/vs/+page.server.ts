// The comparisons hub: one card per page, grouped, and the directory of other
// tools. Built from the comparison data at build time.
import { COMPARISONS } from '#lib/compare/index.ts';
import { DIRECTORY, DIRECTORY_CHECKED } from '#lib/compare/directory.ts';
import { COMPARISON_LINKS } from '#lib/site.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const group = new Map(COMPARISON_LINKS.map((l) => [l.slug, l.group]));
	const cards = COMPARISONS.map((c) => ({ slug: c.slug, name: c.name, maker: c.other.maker, summary: c.other.summary, group: group.get(c.slug)! }));
	return {
		vendors: cards.filter((c) => c.group === 'vendor'),
		apps: cards.filter((c) => c.group === 'app'),
		count: cards.length,
		checked: [...new Set(COMPARISONS.map((c) => c.checked))].sort(),
		directory: DIRECTORY,
		directoryChecked: DIRECTORY_CHECKED
	};
};
