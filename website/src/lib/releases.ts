// Downloads and the changelog. The version comes from Cargo.toml, which the
// release workflow requires the tag to match; file names follow release.yml
// (macOS) and scripts/package-platform.py (Windows, Linux, server). Notes come
// from the `.github/release-notes-<version>.md` files the workflow publishes.
import cargo from '$repo/Cargo.toml?raw';
import { RELEASES_URL } from './site.ts';

export const VERSION = /^version\s*=\s*"([^"]+)"/m.exec(cargo)![1];

export type Os = 'macos' | 'windows' | 'linux';
export type Download = { label: string; detail: string; file: string; url: string; sha256: string };
export type Platform = { os: Os; name: string; requires: string; install: string; downloads: Download[] };

const download = (label: string, detail: string, file: string): Download => {
	const url = `${RELEASES_URL}/download/v${VERSION}/${file}`;
	return { label, detail, file, url, sha256: `${url}.sha256` };
};

export const PLATFORMS: Platform[] = [
	{
		os: 'macos',
		name: 'macOS',
		requires: 'macOS 14 Sonoma or later',
		install: 'Signed with a Developer ID and notarized by Apple.',
		downloads: [
			download('Apple silicon', '.zip', `Splash-${VERSION}-macos-arm64.zip`),
			download('Intel', '.zip', `Splash-${VERSION}-macos-x86_64.zip`)
		]
	},
	{
		os: 'windows',
		name: 'Windows',
		requires: 'Windows 11 x64 with the WebView2 Runtime',
		install: 'The installer sets Splash up for your user; no administrator rights needed.',
		downloads: [
			download('Installer', '.exe', `Splash-${VERSION}-windows-x86_64-setup.exe`),
			download('Portable', '.zip', `Splash-${VERSION}-windows-x86_64.zip`)
		]
	},
	{
		os: 'linux',
		name: 'Linux',
		requires: 'Ubuntu 24.04 x64, or GTK 3 and WebKitGTK 4.1',
		install: 'Install the .deb with apt to pull in GTK and WebKit. The AppImage and tarball use the system’s libraries.',
		downloads: [
			download('Debian / Ubuntu', '.deb', `Splash-${VERSION}-linux-x86_64.deb`),
			download('AppImage', '.AppImage', `Splash-${VERSION}-linux-x86_64.AppImage`),
			download('Tarball', '.tar.gz', `Splash-${VERSION}-linux-x86_64.tar.gz`)
		]
	}
];

/** Headless `splash-server` archives: no window, no WebKit. */
export const SERVER: Download[] = [
	download('macOS · Apple silicon', '.tar.gz', `splash-server-${VERSION}-macos-arm64.tar.gz`),
	download('macOS · Intel', '.tar.gz', `splash-server-${VERSION}-macos-x86_64.tar.gz`),
	download('Linux · x64', '.tar.gz', `splash-server-${VERSION}-linux-x86_64.tar.gz`),
	download('Windows · x64', '.zip', `splash-server-${VERSION}-windows-x86_64.zip`)
];

export const OS_NAMES: Record<Os, string> = { macos: 'macOS', windows: 'Windows', linux: 'Linux' };

export type Release = { version: string; date: string; notes: string };

const notes = import.meta.glob('$repo/.github/release-notes-*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const DATES: Record<string, string> = { '0.1.0': '2026-10-05' };

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

/** The one file to offer first. */
export function primaryFor(os: Os, intel = false): Download {
	const p = PLATFORMS.find((x) => x.os === os)!;
	return os === 'macos' && intel ? p.downloads[1] : p.downloads[0];
}
