// Splash vs Waku. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const WAKU: Comparison = {
	slug: 'waku',
	name: 'Waku',
	description: 'How Splash and Waku compare on agents, platforms, worktrees, review, remote use and updates, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Waku are open-source Rust desktop apps for working with several coding agents from one app, each task in its project folder or a git worktree. Waku keeps tasks, files and Git in a separate daemon and reaches each agent through that agent’s own structured interface, ACP for some. Splash drives every agent over the Agent Client Protocol.',
	other: {
		name: 'Waku',
		url: 'https://waku.sh',
		maker: 'egoist',
		summary: 'A GPL-licensed Rust desktop app for macOS, Windows and Linux that runs the coding agent CLIs installed on your machine through their own protocols, with worktrees, checkpoints and a daemon a browser client can reach.',
		cite: ['waku-home', 'waku-readme', 'waku-license', 'waku-worktree']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Native desktop app backed by its own waku-daemon process, plus Waku Web, a hosted browser client for your daemon', cite: ['waku-readme', 'waku-home', 'waku-web-readme'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v0.1.20 (2 October 2026), not marked as a prerelease; every version since the 0.0.8 first release is 0.x', cite: ['waku-release', 'waku-changelog'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (GPL-3.0-only)', cite: ['waku-license', 'waku-readme'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free downloads; no prices or paid plans are published, and the README asks for support through GitHub Sponsors', cite: ['waku-home', 'waku-readme'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 13+ on Apple silicon (no Intel build); Windows 10 1809+ or 11 and Linux (glibc 2.35+) on x64 and arm64', cite: ['waku-home', 'waku-info-plist', 'waku-windows', 'waku-linux'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Rust, with a native GPUI interface (the framework behind the Zed editor), not Electron', cite: ['waku-home', 'waku-readme'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: '11 in the provider docs (9 in the README), including Claude Code, Codex, Cursor and OpenCode; new ones need code changes', cite: ['waku-providers', 'waku-readme'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each agent’s own protocol, not a terminal: ACP for Cursor, Fx, Grok and Kimi; stream-json for Claude Code; app-server for Codex', cite: ['waku-providers', 'waku-acp-driver', 'waku-home'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'You install and sign in to each CLI; Waku uses those logins, plans and rate limits and holds no API keys', cite: ['waku-readme', 'waku-home', 'waku-commit-messages'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'No Waku account is needed; Waku Web and other clients reach your daemon with a token from its settings', cite: ['waku-readme', 'waku-home', 'waku-web'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Allow once, for the session or always; four access modes, though Amp, Pi and Oh My Pi always get Full access', mark: 'yes', cite: ['waku-locales', 'waku-providers'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'No MCP server settings are documented; MCP tool calls the agents make appear as activity in the transcript', mark: 'no', cite: ['waku-locales', 'waku-readme'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Per task, Local (the project folder) or a New worktree under ~/.waku/worktrees; projectless tasks get a folder of their own', mark: 'yes', cite: ['waku-worktree', 'waku-locales', 'waku-readme'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'A shell in the task’s workspace on macOS, Windows and Linux; unavailable when the desktop app uses a remote daemon', mark: 'yes', cite: ['waku-locales', 'waku-windows', 'waku-readme'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Tasks blocked on a permission request or an agent question get a Waiting status and alert icon in the sidebar', mark: 'yes', cite: ['waku-streaming', 'waku-locales'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'Notifies when a turn ends, stops or waits on background work, if no Waku window is active; not for permissions', mark: 'yes', cite: ['waku-streaming', 'waku-platform'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'A Browser tab on macOS (WKWebView) and Windows (WebView2), not Linux; the README still describes it as macOS alone', mark: 'partial', cite: ['waku-browser', 'waku-windows', 'waku-readme'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'A Review tab shows diffs for the last or any turn, uncommitted, staged, committed or branch changes; diff comments aren’t documented', mark: 'yes', cite: ['waku-locales'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'A file editor on macOS, Windows and Linux, with Markdown highlighting and a toggle to a rendered preview', mark: 'yes', cite: ['waku-changelog', 'waku-readme'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'None documented; Git actions cover commit, commit and push, and branches, and the agent can write the commit message', mark: 'no', cite: ['waku-locales', 'waku-commit-messages'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'No GitHub integration is documented: no pull requests, CI checks, issues or API use', mark: 'no', cite: ['waku-readme', 'waku-locales'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Expose your daemon beyond loopback with a token, then connect Waku Web or another desktop; no SSH feature is documented', mark: 'yes', cite: ['waku-readme', 'waku-locales', 'waku-web'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Signed in-app updates on macOS, Windows and Linux; on macOS through Sparkle, with binary deltas', mark: 'yes', cite: ['waku-home', 'waku-linux', 'waku-readme'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Since 0.1.16, import and continue conversations begun in any provider’s CLI, via /resume or the palette, also in Waku Web', mark: 'yes', cite: ['waku-changelog'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'The command palette matches tasks and text in saved transcripts; Cmd-F or Ctrl-F searches the open transcript', mark: 'yes', cite: ['waku-command-palette', 'waku-changelog'] } },
				{ label: 'Fork a conversation', splash: S.fork, other: { text: 'Per-prompt git checkpoints; rewind code and conversation to a turn or branch from it, except with Fx and Kimi Code', mark: 'yes', cite: ['waku-home', 'waku-providers'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Waku reaches each agent through its own structured interface: ACP for Cursor, Fx, Grok and Kimi Code, stream-json for Claude Code and Amp, <code>codex app-server</code> for Codex and a background HTTP service for OpenCode. Adding a provider takes a code change. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, natively or through a pinned adapter for the vendor’s CLI.',
			cite: ['waku-providers', 'waku-acp-driver', 'splash-registry', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'Waku’s desktop app is a client of a <code>waku-daemon</code> that you can expose with a token to Waku Web or another desktop. Cloud agents and a phone app are planned; the repo already holds source for an Expo mobile client. Splash runs agents on your computer, or under <code>splash-server</code> on a machine you reach in a browser over SSH.',
			cite: ['waku-readme', 'waku-web', 'waku-home', 'waku-mobile-readme', 'splash-readme', 'splash-server']
		},
		{
			title: 'License, price and data',
			text: 'Waku is GPL-3.0-only, publishes no prices and needs no account; tasks and transcripts stay on the daemon host. Its homepage says there is no telemetry, while release builds send anonymous usage events unless you turn them off in Settings. Splash is free, MIT-licensed and has no accounts.',
			cite: ['waku-license', 'waku-readme', 'waku-windows', 'waku-home', 'waku-analytics', 'waku-persistence', 'waku-locales', 'splash-license', 'splash-download', 'splash-build']
		},
		{
			title: 'Platforms and updates',
			text: 'Waku builds for macOS 13+ on Apple silicon, and for Windows 10 and 11 and Linux on both x64 and arm64; it updates itself on all three. Splash builds for macOS 14+ (Apple silicon and Intel), Windows 11 x64 and Ubuntu 24.04 x64, and you download new versions from GitHub Releases.',
			cite: ['waku-home', 'waku-info-plist', 'waku-windows', 'waku-linux', 'splash-install', 'splash-about']
		},
		{
			title: 'Around the session',
			text: 'Waku includes per-prompt git checkpoints for rewinding code with the conversation, a file editor, a browser tab on macOS and Windows, queued or mid-turn follow-ups, a token and cost usage page, and commit and push. Splash centers on a <strong>Needs attention</strong> queue, review with a feedback box, and a GitHub view of issues, pull requests and Actions runs.',
			cite: ['waku-home', 'waku-changelog', 'waku-browser', 'waku-usage-page', 'waku-locales', 'splash-features', 'splash-github']
		}
	],
	fit: {
		splash: [
			'You want every agent driven over the Agent Client Protocol, with Gemini, Copilot and Goose next to Claude Code and Codex.',
			'You want permission requests, failures and finished turns kept in one Needs attention queue, with notifications for permissions.',
			'You want a GitHub view of issues, pull requests and Actions runs, and review feedback sent to the agent.',
			'You want an MIT-licensed app, with a build for Intel Macs.'
		],
		other: [
			'You want to rewind code and conversation together to an earlier turn, or branch from there.',
			'You want to edit workspace files beside your agents, with a browser tab on macOS or Windows.',
			'You want an app that updates itself, with Windows and Linux builds for arm64 as well as x64.',
			'You want to reach your own daemon from Waku Web in a browser or from another desktop.'
		]
	},
	sources: [
		{ id: 'waku-home', title: 'Waku — one native app for all your coding agents', url: 'https://waku.sh', publisher: 'egoist', checked: '2026-10-10' },
		{ id: 'waku-web', title: 'Waku Web', url: 'https://web.waku.sh', publisher: 'egoist', checked: '2026-10-10' },
		{ id: 'waku-readme', title: 'README.md', url: 'https://github.com/egoist/waku/blob/main/README.md', publisher: 'egoist/waku on GitHub', checked: '2026-10-10' },
		{ id: 'waku-license', title: 'LICENSE', url: 'https://github.com/egoist/waku/blob/main/LICENSE', publisher: 'egoist/waku on GitHub', checked: '2026-10-10' },
		{ id: 'waku-changelog', title: 'CHANGELOG.md', url: 'https://github.com/egoist/waku/blob/main/CHANGELOG.md', publisher: 'egoist/waku on GitHub', checked: '2026-10-10' },
		{ id: 'waku-release', title: 'Release v0.1.20', url: 'https://github.com/egoist/waku/releases/tag/v0.1.20', publisher: 'egoist/waku on GitHub', checked: '2026-10-10' },
		{ id: 'waku-info-plist', title: 'resources/Info.plist', url: 'https://github.com/egoist/waku/blob/main/resources/Info.plist', publisher: 'egoist/waku on GitHub', checked: '2026-10-10' },
		{ id: 'waku-linux', title: 'Waku on Linux', url: 'https://github.com/egoist/waku/blob/main/docs/linux.md', publisher: 'egoist/waku on GitHub', checked: '2026-10-10' },
		{ id: 'waku-windows', title: 'Waku on Windows', url: 'https://github.com/egoist/waku/blob/main/docs/windows.md', publisher: 'egoist/waku on GitHub', checked: '2026-10-10' },
		{ id: 'waku-web-readme', title: 'apps/web/README.md', url: 'https://github.com/egoist/waku/blob/main/apps/web/README.md', publisher: 'egoist/waku on GitHub', checked: '2026-10-10' },
		{ id: 'waku-mobile-readme', title: 'apps/mobile/README.md', url: 'https://github.com/egoist/waku/blob/main/apps/mobile/README.md', publisher: 'egoist/waku on GitHub', checked: '2026-10-10' },
		{ id: 'waku-providers', title: 'Provider integrations', url: 'https://github.com/egoist/waku/blob/main/docs/providers.md', publisher: 'egoist/waku on GitHub', checked: '2026-10-10' },
		{ id: 'waku-acp-driver', title: 'crates/waku-core/src/driver/acp.rs', url: 'https://github.com/egoist/waku/blob/main/crates/waku-core/src/driver/acp.rs', publisher: 'egoist/waku on GitHub', checked: '2026-10-10' },
		{ id: 'waku-commit-messages', title: 'Commit-message generation', url: 'https://github.com/egoist/waku/blob/main/docs/commit-messages.md', publisher: 'egoist/waku on GitHub', checked: '2026-10-10' },
		{ id: 'waku-locales', title: 'locales/app.yml', url: 'https://github.com/egoist/waku/blob/main/locales/app.yml', publisher: 'egoist/waku on GitHub', checked: '2026-10-10' },
		{ id: 'waku-worktree', title: 'crates/waku-core/src/worktree.rs', url: 'https://github.com/egoist/waku/blob/main/crates/waku-core/src/worktree.rs', publisher: 'egoist/waku on GitHub', checked: '2026-10-10' },
		{ id: 'waku-streaming', title: 'src/app/streaming.rs', url: 'https://github.com/egoist/waku/blob/main/src/app/streaming.rs', publisher: 'egoist/waku on GitHub', checked: '2026-10-10' },
		{ id: 'waku-platform', title: 'src/platform.rs', url: 'https://github.com/egoist/waku/blob/main/src/platform.rs', publisher: 'egoist/waku on GitHub', checked: '2026-10-10' },
		{ id: 'waku-browser', title: 'src/browser.rs', url: 'https://github.com/egoist/waku/blob/main/src/browser.rs', publisher: 'egoist/waku on GitHub', checked: '2026-10-10' },
		{ id: 'waku-command-palette', title: 'src/app/command_palette.rs', url: 'https://github.com/egoist/waku/blob/main/src/app/command_palette.rs', publisher: 'egoist/waku on GitHub', checked: '2026-10-10' },
		{ id: 'waku-usage-page', title: 'src/app/usage_page.rs', url: 'https://github.com/egoist/waku/blob/main/src/app/usage_page.rs', publisher: 'egoist/waku on GitHub', checked: '2026-10-10' },
		{ id: 'waku-analytics', title: 'src/analytics.rs', url: 'https://github.com/egoist/waku/blob/main/src/analytics.rs', publisher: 'egoist/waku on GitHub', checked: '2026-10-10' },
		{ id: 'waku-persistence', title: 'crates/waku-client/src/persistence.rs', url: 'https://github.com/egoist/waku/blob/main/crates/waku-client/src/persistence.rs', publisher: 'egoist/waku on GitHub', checked: '2026-10-10' }
	]
};
