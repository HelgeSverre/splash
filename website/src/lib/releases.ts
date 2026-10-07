// Downloads and the changelog. File names follow release.yml (macOS),
// scripts/package-platform.py (Windows, Linux, server) and the asset list in
// scripts/release_pipeline.py; latest.svelte.ts turns them into links to the
// latest published release. Notes come from the `.github/release-notes-*.md`
// files the workflow publishes.
import cargo from '$repo/Cargo.toml?raw';

/** The app version in this checkout: the fallback until GitHub says what's latest. */
export const VERSION = /^version\s*=\s*"([^"]+)"/m.exec(cargo)![1];

export type Os = 'macos' | 'windows' | 'linux';
/** One downloadable file; `file` names it for a given version. An `optional`
 *  file is offered only once the latest release is known to contain it. */
export type Download = { label: string; detail: string; file: (version: string) => string; optional?: boolean };
export type Platform = { os: Os; name: string; requires: string; install: string; downloads: Download[] };

const download = (label: string, detail: string, name: string, optional = false): Download => ({ label, detail, file: (v) => name.replace('{v}', v), optional });

export const PLATFORMS: Platform[] = [
	{
		os: 'macos',
		name: 'macOS',
		requires: 'macOS 14 Sonoma or later',
		install: 'Signed with a Developer ID and notarized by Apple.',
		downloads: [
			download('Universal installer', '.pkg', 'Splash-{v}-macos-universal.pkg', true),
			download('Apple silicon', '.zip', 'Splash-{v}-macos-arm64.zip'),
			download('Intel', '.zip', 'Splash-{v}-macos-x86_64.zip')
		]
	},
	{
		os: 'windows',
		name: 'Windows',
		requires: 'Windows 11 x64 with the WebView2 Runtime',
		install: 'The installer sets Splash up for your user; no administrator rights needed.',
		downloads: [
			download('Installer', '.exe', 'Splash-{v}-windows-x86_64-setup.exe'),
			download('Portable', '.zip', 'Splash-{v}-windows-x86_64.zip')
		]
	},
	{
		os: 'linux',
		name: 'Linux',
		requires: 'Ubuntu 24.04 x64, or GTK 3 and WebKitGTK 4.1',
		install: 'Install the .deb with apt to pull in GTK and WebKit. The AppImage and tarball use the system’s libraries.',
		downloads: [
			download('Debian / Ubuntu', '.deb', 'Splash-{v}-linux-x86_64.deb'),
			download('AppImage', '.AppImage', 'Splash-{v}-linux-x86_64.AppImage'),
			download('Tarball', '.tar.gz', 'Splash-{v}-linux-x86_64.tar.gz')
		]
	}
];

/** Headless `splash-server` archives: no window, no WebKit. */
export const SERVER: Download[] = [
	download('macOS · Apple silicon', '.tar.gz', 'splash-server-{v}-macos-arm64.tar.gz'),
	download('macOS · Intel', '.tar.gz', 'splash-server-{v}-macos-x86_64.tar.gz'),
	download('Linux · x64', '.tar.gz', 'splash-server-{v}-linux-x86_64.tar.gz'),
	download('Windows · x64', '.zip', 'splash-server-{v}-windows-x86_64.zip')
];

export const OS_NAMES: Record<Os, string> = { macos: 'macOS', windows: 'Windows', linux: 'Linux' };

export type Release = { version: string; date: string; notes: string };

const notes = import.meta.glob('$repo/.github/release-notes-*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const DATES: Record<string, string> = { '0.1.0': '2026-10-05', '0.2.0': '2026-10-07' };

/** Every release with notes, newest first. */
export const RELEASES: Release[] = Object.entries(notes)
	.map(([path, text]) => ({ version: /release-notes-(.+)\.md$/.exec(path)![1], notes: text }))
	.filter((r) => /^\d+\.\d+\.\d+$/.test(r.version))
	.sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }))
	.map((r) => ({ ...r, date: DATES[r.version] ?? '' }));

/** The visitor's OS and, where the browser says, a Mac's architecture. */
export async function detect(): Promise<{ os: Os | null; intel: boolean }> {
	if (typeof navigator === 'undefined') return { os: null, intel: false };
	const ua = `${navigator.platform} ${navigator.userAgent}`.toLowerCase();
	const os: Os | null = ua.includes('mac') ? 'macos' : ua.includes('win') ? 'windows' : ua.includes('linux') && !ua.includes('android') ? 'linux' : null;
	let intel = false;
	const data = (navigator as Navigator & { userAgentData?: { getHighEntropyValues(h: string[]): Promise<{ architecture?: string }> } }).userAgentData;
	if (os === 'macos' && data) intel = (await data.getHighEntropyValues(['architecture']).catch(() => ({ architecture: '' }))).architecture === 'x86';
	return { os, intel };
}

/** The first file to offer: the first one available, or a Mac's own architecture among the ZIPs. */
export function primaryFor(os: Os, intel = false, available: (d: Download) => boolean = (d) => !d.optional): Download {
	const offered = PLATFORMS.find((x) => x.os === os)!.downloads.filter(available);
	if (os === 'macos' && !offered[0].file('').endsWith('.pkg')) return offered.find((d) => d.label === (intel ? 'Intel' : 'Apple silicon')) ?? offered[0];
	return offered[0];
}
