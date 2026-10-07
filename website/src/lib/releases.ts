// Downloads and the changelog. File names follow release.yml (macOS),
// scripts/package-platform.py (Windows, Linux, server) and the asset list in
// scripts/release_pipeline.py; latest.svelte.ts turns them into links to the
// latest published release. Notes come from the `.github/release-notes-*.md`
// files the workflow publishes.
import cargo from '$repo/Cargo.toml?raw';

/** The app version in this checkout: the fallback until GitHub says what's latest. */
export const VERSION = /^version\s*=\s*"([^"]+)"/m.exec(cargo)![1];

export type Os = 'macos' | 'windows' | 'linux';
/** One downloadable file; `file` names it for a given version. */
export type Download = { label: string; detail: string; file: (version: string) => string };
export type Platform = { os: Os; name: string; requires: string; install: string; downloads: Download[] };

const download = (label: string, detail: string, name: string): Download => ({ label, detail, file: (v) => name.replace('{v}', v) });

export const PLATFORMS: Platform[] = [
	{
		os: 'macos',
		name: 'macOS',
		requires: 'macOS 14 Sonoma or later',
		install: 'Signed with a Developer ID and notarized by Apple.',
		downloads: [
			download('Universal installer', '.pkg', 'Splash-{v}-macos-universal.pkg'),
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
const DATES: Record<string, string> = { '0.1.0': '2026-10-05', '0.2.0': '2026-10-07', '0.2.1': '2026-10-07' };

/** Every release with notes, newest first. */
export const RELEASES: Release[] = Object.entries(notes)
	.map(([path, text]) => ({ version: /release-notes-(.+)\.md$/.exec(path)![1], notes: text }))
	.filter((r) => /^\d+\.\d+\.\d+$/.test(r.version))
	.sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }))
	.map((r) => ({ ...r, date: DATES[r.version] ?? '' }));

/** The visitor's OS, when the browser says. */
export function detect(): Os | null {
	if (typeof navigator === 'undefined') return null;
	const ua = `${navigator.platform} ${navigator.userAgent}`.toLowerCase();
	return ua.includes('mac') ? 'macos' : ua.includes('win') ? 'windows' : ua.includes('linux') && !ua.includes('android') ? 'linux' : null;
}

/** The file to offer first: the universal macOS installer, the Windows installer, the Debian package. */
export function primaryFor(os: Os): Download {
	return PLATFORMS.find((x) => x.os === os)!.downloads[0];
}
