// Splash's side of every comparison, in one place so each page says the same
// thing about it. Each answer cites the repository or this site; the agent
// list and version are read from the source at build time.
import { REGISTRY } from '../registry.ts';
import { VERSION } from '../releases.ts';
import { ACP_URL, RELEASES_URL, REPO, SITE_URL } from '../site.ts';
import type { Cell, Product, Source } from './types.ts';

const CHECKED = '2026-10-09';
const blob = (path: string) => `${REPO}/blob/main/${path}`;

export const SPLASH_SOURCES: Source[] = [
	{ id: 'splash-readme', title: 'Splash README', url: `${REPO}#readme`, publisher: 'Splash on GitHub', checked: CHECKED },
	{ id: 'splash-features', title: 'Splash README: Features', url: `${REPO}#features`, publisher: 'Splash on GitHub', checked: CHECKED },
	{ id: 'splash-install', title: 'Splash README: Download the app', url: `${REPO}#download-the-app`, publisher: 'Splash on GitHub', checked: CHECKED },
	{ id: 'splash-build', title: 'Splash README: Build from source', url: `${REPO}#build-from-source`, publisher: 'Splash on GitHub', checked: CHECKED },
	{ id: 'splash-server', title: 'Splash README: Run as a web app over SSH', url: `${REPO}#run-as-a-web-app-over-ssh`, publisher: 'Splash on GitHub', checked: CHECKED },
	{ id: 'splash-history', title: 'Splash README: Existing sessions and review', url: `${REPO}#existing-sessions-and-review`, publisher: 'Splash on GitHub', checked: CHECKED },
	{ id: 'splash-github', title: 'Splash README: GitHub view', url: `${REPO}#github-view`, publisher: 'Splash on GitHub', checked: CHECKED },
	{ id: 'splash-agents', title: 'Splash README: Agents', url: `${REPO}#agents`, publisher: 'Splash on GitHub', checked: CHECKED },
	{ id: 'splash-how', title: 'Splash README: How it works', url: `${REPO}#how-it-works`, publisher: 'Splash on GitHub', checked: CHECKED },
	{ id: 'splash-registry', title: 'src/agents/registry.rs', url: blob('src/agents/registry.rs'), publisher: 'Splash on GitHub', checked: CHECKED },
	{ id: 'splash-worktree', title: 'src/worktree.rs', url: blob('src/worktree.rs'), publisher: 'Splash on GitHub', checked: CHECKED },
	{ id: 'splash-mcp', title: 'src/agents/customize.rs', url: blob('src/agents/customize.rs'), publisher: 'Splash on GitHub', checked: CHECKED },
	{ id: 'splash-file-tab', title: 'app/src/components/FileTab.svelte', url: blob('app/src/components/FileTab.svelte'), publisher: 'Splash on GitHub', checked: CHECKED },
	{ id: 'splash-notify-settings', title: 'app/src/components/settings/General.svelte', url: blob('app/src/components/settings/General.svelte'), publisher: 'Splash on GitHub', checked: CHECKED },
	{ id: 'splash-notify', title: 'app/src/lib/system.ts', url: blob('app/src/lib/system.ts'), publisher: 'Splash on GitHub', checked: CHECKED },
	{ id: 'splash-about', title: 'app/src/components/settings/About.svelte', url: blob('app/src/components/settings/About.svelte'), publisher: 'Splash on GitHub', checked: CHECKED },
	{ id: 'splash-releases', title: 'Splash releases', url: RELEASES_URL, publisher: 'Splash on GitHub', checked: CHECKED },
	{ id: 'splash-download', title: 'Download Splash', url: `${SITE_URL}/download`, publisher: 'splash.computer', checked: CHECKED },
	{ id: 'splash-license', title: 'LICENSE', url: blob('LICENSE'), publisher: 'Splash on GitHub', checked: CHECKED },
	{ id: 'acp', title: 'Agent Client Protocol', url: ACP_URL, publisher: 'agentclientprotocol.com', checked: CHECKED }
];

const featured = ['claude', 'codex', 'gemini', 'copilot', 'opencode', 'goose'];
const names = REGISTRY.filter((a) => featured.includes(a.id)).map((a) => a.name);

export const SPLASH: Product = {
	name: 'Splash',
	url: '/',
	maker: 'Helge Sverre',
	summary: 'A desktop app for running several coding agents at once, each session in its project folder or its own git worktree. It drives agents over the Agent Client Protocol.',
	cite: ['splash-readme', 'acp']
};

/** Splash's answer to the rows comparisons ask most. Pages pick the ones they use. */
export const S = {
	formFactor: { text: 'Desktop app, plus a headless server you open in a browser', cite: ['splash-readme', 'splash-server'] },
	maturity: { text: `v${VERSION}, early development`, cite: ['splash-readme', 'splash-releases'] },
	license: { text: 'Open source (MIT)', cite: ['splash-license'] },
	price: { text: 'Free', cite: ['splash-download'] },
	platforms: { text: 'macOS 14+ (Apple silicon and Intel), Windows 11 x64, Ubuntu 24.04 x64', cite: ['splash-install'] },
	agents: { text: `Ships launch commands for ${REGISTRY.length} agents, including ${names.join(', ')}`, cite: ['splash-registry', 'splash-agents'] },
	protocol: { text: 'Agent Client Protocol over stdio, natively or through a pinned adapter for the vendor’s CLI', cite: ['splash-registry', 'acp'] },
	signIn: { text: 'You install and sign in to each agent’s CLI yourself; Splash runs it with that login', cite: ['splash-agents'] },
	account: { text: 'Splash has no accounts; splash-server asks for a token it keeps in its data folder', cite: ['splash-build', 'splash-server'] },
	cloud: { text: 'Agents run as child processes on your computer, or on your own server with splash-server', mark: 'no', cite: ['splash-readme', 'splash-server'] },
	tech: { text: 'Rust, with a Svelte 5 frontend in a webview, built on the Elyra framework', cite: ['splash-how'] },
	isolation: { text: 'The project folder, or a git worktree on its own branch per session', mark: 'yes', cite: ['splash-features'] },
	setupScripts: { text: 'A worktree is a plain git checkout; Splash runs no setup scripts or dev servers', mark: 'no', cite: ['splash-features', 'splash-worktree'] },
	models: { text: 'Model, mode and effort pickers when the agent offers them', mark: 'yes', cite: ['splash-features'] },
	permissions: { text: 'Shown in the transcript and answered with the 1–9 keys; pending ones wait in Needs attention', mark: 'yes', cite: ['splash-features'] },
	mcp: { text: 'Read-only list of MCP servers from Claude Code, Codex, Pi, Pool and Glue config files', mark: 'partial', cite: ['splash-features', 'splash-mcp'] },
	fork: { text: 'Experimental: fork the current conversation when the agent supports it, not from an earlier message', mark: 'partial', cite: ['splash-features', 'splash-history'] },
	review: { text: 'Latest response, failed tools and every changed file as a diff, with a box to send feedback', mark: 'yes', cite: ['splash-features'] },
	files: { text: 'File tree, git changes and diff tabs; files open read-only, with no editor', mark: 'partial', cite: ['splash-features', 'splash-file-tab'] },
	github: { text: 'Issues, pull requests and Actions runs across repositories, through the gh CLI', mark: 'yes', cite: ['splash-features', 'splash-github'] },
	prs: { text: 'Shows the PR for a session’s branch and starts worktrees from PR heads; does not create PRs', mark: 'no', cite: ['splash-features', 'splash-github'] },
	issueTrackers: { text: 'GitHub (github.com), through the gh CLI; no Linear or Jira', mark: 'partial', cite: ['splash-features', 'splash-github'] },
	terminal: { text: 'A terminal in the session folder', mark: 'yes', cite: ['splash-features'] },
	attention: { text: 'One queue for permission requests, connection failures and finished turns, kept across restarts', mark: 'yes', cite: ['splash-features', 'splash-history'] },
	notifications: { text: 'Notifies when a background session needs permission or finishes a turn; can be turned off', mark: 'yes', cite: ['splash-notify-settings', 'splash-notify'] },
	history: { text: 'Browse, preview and import conversations agents list over ACP, including ones started outside Splash', mark: 'yes', cite: ['splash-features', 'splash-history'] },
	search: { text: 'Search titles, folders and saved transcript text, archived sessions included', mark: 'yes', cite: ['splash-features'] },
	remote: { text: 'splash-server runs on the machine with your code; you use it in a browser over an SSH tunnel. Single user.', mark: 'yes', cite: ['splash-server'] },
	mobile: { text: 'No mobile app; builds cover macOS, Windows, Ubuntu and a headless server', mark: 'no', cite: ['splash-install'] },
	browser: { text: 'No built-in browser; the workbench holds git changes, a file tree, diff and file tabs, and a terminal', mark: 'no', cite: ['splash-features'] },
	scheduler: { text: 'No scheduler; an agent starts when you create, continue or prompt a session', mark: 'no', cite: ['splash-how'] },
	handoff: { text: 'Each session is one agent in one folder; sessions don’t hand work to each other', mark: 'no', cite: ['splash-readme', 'splash-features'] },
	updates: { text: 'Download new versions from GitHub Releases; the app does not update itself', mark: 'no', cite: ['splash-install', 'splash-about'] }
} satisfies Record<string, Cell>;
