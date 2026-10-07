// A capture template for scripts/og.ts, not a page: it exists on the dev
// server only, and the static build has no file for it.
import { dev } from '$app/env';
import { error } from '@sveltejs/kit';
import { CARDS } from '#lib/og.ts';
import type { PageLoad } from './$types';

export const prerender = false;

export const load: PageLoad = ({ params }) => {
	const card = CARDS[params.slug];
	if (!dev || !card) error(404);
	return { card };
};
