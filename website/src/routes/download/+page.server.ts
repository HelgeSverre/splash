// Release notes are Markdown files in the repository; render them once, at
// build time, so the page ships as plain HTML.
import { marked } from 'marked';
import { RELEASES } from '#lib/releases.ts';

// The notes' own H1 repeats the version the page already shows.
const body = (md: string) => marked.parse(md.replace(/^# .*\n+/, ''), { async: false });

export function load() {
	return { notes: Object.fromEntries(RELEASES.map((r) => [r.version, body(r.notes)])) };
}
