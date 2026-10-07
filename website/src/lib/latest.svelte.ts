// The latest published release, asked of GitHub in the browser, so download
// links keep pointing at real files after every release without a rebuild.
// Until it answers (or if it can't), links use the Cargo.toml version.
import { RELEASES_URL } from './site.ts';
import { VERSION, type Download } from './releases.ts';

const API = 'https://api.github.com/repos/HelgeSverre/splash/releases/latest';
const CACHE_KEY = 'splash.latest-release';
const CACHE_MS = 10 * 60 * 1000;

export const latest: { version: string; assets: Set<string> | null } = $state({ version: VERSION, assets: null });

type Cached = { at: number; version: string; assets: string[] };
let started = false;

export function loadLatest() {
	if (started || typeof window === 'undefined') return;
	started = true;
	try {
		const cached: Cached | null = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? 'null');
		if (cached && Date.now() - cached.at < CACHE_MS) return apply(cached.version, cached.assets);
	} catch {}
	fetch(API, { headers: { Accept: 'application/vnd.github+json' } })
		.then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
		.then((release: { tag_name: string; assets: { name: string }[] }) => {
			const version = release.tag_name.replace(/^v/, '');
			const assets = release.assets.map((a) => a.name);
			apply(version, assets);
			try {
				sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), version, assets } satisfies Cached));
			} catch {}
		})
		.catch(() => {});
}

function apply(version: string, assets: string[]) {
	latest.version = version;
	latest.assets = new Set(assets);
}

/** Whether to offer a download: optional files only once the latest release has them. */
export function available(d: Download) {
	return d.optional ? !!latest.assets?.has(d.file(latest.version)) : true;
}

export type Resolved = { file: string; url: string; sha256: string };

/** A download's file in the latest release, via GitHub's /releases/latest/download/ URLs. */
export function resolve(d: Download): Resolved {
	const file = d.file(latest.version);
	// A file the latest release doesn't carry goes to the release page instead of a 404.
	if (latest.assets && !latest.assets.has(file)) return { file, url: `${RELEASES_URL}/latest`, sha256: `${RELEASES_URL}/latest` };
	const url = `${RELEASES_URL}/latest/download/${file}`;
	return { file, url, sha256: `${url}.sha256` };
}
