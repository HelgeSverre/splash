// Numbers a comparison's sources in the order the page first cites them, and
// checks the data: every fact has a source, every source id exists, and no
// source sits unused. A broken comparison fails the prerender, not a reader.
import { SPLASH, SPLASH_SOURCES } from './splash.ts';
import type { Cell, Comparison, Source } from './types.ts';

export type Numbered = Source & { n: number };

export function numberSources(c: Comparison): Numbered[] {
	const known = new Map([...SPLASH_SOURCES, ...c.sources].map((s) => [s.id, s]));
	const order: string[] = [];
	const use = (ids: string[] | undefined, where: string) => {
		for (const id of ids ?? []) {
			if (!known.has(id)) throw new Error(`vs/${c.slug}: ${where} cites unknown source "${id}"`);
			if (!order.includes(id)) order.push(id);
		}
	};
	const cell = (x: Cell, where: string) => {
		if (!x.cite.length && x.mark !== 'unknown') throw new Error(`vs/${c.slug}: ${where} has no source`);
		use(x.cite, where);
	};

	use(SPLASH.cite, 'Splash summary');
	use(c.other.cite, `${c.name} summary`);
	for (const g of c.groups)
		for (const r of g.rows) {
			cell(r.splash, `"${r.label}" (Splash)`);
			cell(r.other, `"${r.label}" (${c.name})`);
		}
	for (const p of c.differences ?? []) use(p.cite, `"${p.title}"`);

	const unused = c.sources.filter((s) => !order.includes(s.id)).map((s) => s.id);
	if (unused.length) throw new Error(`vs/${c.slug}: sources never cited: ${unused.join(', ')}`);
	return order.map((id, i) => ({ ...known.get(id)!, n: i + 1 }));
}
