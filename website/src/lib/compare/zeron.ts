// Splash vs Zeron. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const ZERON: Comparison = {
	slug: 'zeron',
	name: 'Zeron',
	description: 'How Splash and Zeron compare on agents, platforms, worktrees, permissions, review and multi-device use, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Zeron are open-source Rust desktop apps for running several coding agents at once, each session in its project folder or a git worktree. Zeron talks to each agent through that agent’s own interface or ACP and can sync chats across your devices. Splash uses the Agent Client Protocol for every agent and can run as a browser-based server.',
	other: {
		name: 'Zeron',
		url: 'https://zeron.sh',
		maker: 'zeronsh',
		summary: 'An MIT-licensed Rust desktop app for macOS, Windows and Linux that drives nine coding agents on your machines, with optional worktrees, a PR board, and sign-in sync to follow or drive chats from another device.',
		cite: ['zeron-home', 'zeron-readme', 'zeron-architecture', 'zeron-registry', 'zeron-pickers', 'zeron-pull-requests']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app; the same binary also has a headless CLI and background engine, installable on Linux servers', cite: ['zeron-readme', 'zeron-architecture'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v0.2.107 (8 October 2026), not marked as a prerelease; 170 releases since v0.1.0 on 22 July 2026', cite: ['zeron-release-api', 'zeron-first-release'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (MIT)', cite: ['zeron-license', 'zeron-home'] } },
				{ label: 'Price', splash: S.price, other: { text: 'No prices or paid plans are published; the README asks for sponsorship to fund development', cite: ['zeron-readme', 'zeron-home'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 12+ (Apple silicon), Windows x64, Linux x64 and arm64; the headless installer supports Linux alone', cite: ['zeron-readme', 'zeron-release', 'zeron-info-plist'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Rust, with a native gpui interface that replaced an earlier Electron version', cite: ['zeron-architecture'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Drivers for nine agents, which Settings can install: Claude Code, Codex, Cursor, Devin, Grok, Hermes, Pi, OpenCode and Antigravity; adding others isn’t documented', cite: ['zeron-registry', 'zeron-readme', 'zeron-home', 'zeron-installers'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Native protocols for Claude Code, Codex, OpenCode and Pi; Cursor’s SDK through a Node shim; ACP for Devin, Grok, Hermes and Antigravity', cite: ['zeron-harness', 'zeron-claude-driver', 'zeron-cursor-driver', 'zeron-registry'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Each agent’s CLI login or API key; Zeron detects logins, and for several agents switches accounts and shows usage meters', cite: ['zeron-accounts', 'zeron-parity'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'Not for local use, which also works offline; optional sync between devices needs a sign-in through WorkOS', cite: ['zeron-readme', 'zeron-parity'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'None: Zeron auto-approves agents’ tool calls and runs Codex with full access; agent questions still reach you in a panel', mark: 'no', cite: ['zeron-claude-driver', 'zeron-codex-driver', 'zeron-acp-driver', 'zeron-architecture'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Adds its own MCP server to every agent run, for managing other chats; your configured MCP servers stay untouched', mark: 'yes', cite: ['zeron-mcp'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'The project folder by default, or a new git worktree on its own zeron/… branch, off a base you pick', mark: 'yes', cite: ['zeron-pickers', 'zeron-repos'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Project Actions, one of which can run when a worktree is created; a Browser tab lists dev servers found on macOS and Linux. Copying .env isn’t documented', mark: 'yes', cite: ['zeron-project-actions', 'zeron-preview'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Sessions sorted by attention with status dots; a question panel replaces the composer when an agent asks for input', mark: 'yes', cite: ['zeron-architecture', 'zeron-parity'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'Native banners on macOS and Linux; Windows plays a chime but shows no banner yet. Can be switched off', mark: 'partial', cite: ['zeron-notify'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Through Zeron’s MCP server, agents create chats, message them, wait for their turns and interrupt them', mark: 'yes', cite: ['zeron-mcp'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'Browser tabs for chat links and dev servers, including ones on other signed-in devices; Linux needs WebKitGTK 4.1 and JSON-GLib installed', mark: 'yes', cite: ['zeron-preview', 'zeron-linux-browser'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'A Changes pane with the branch diff, updated live; comments on diff or file lines join your next prompt', mark: 'yes', cite: ['zeron-parity', 'zeron-home', 'zeron-comments'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'A PR board via gh with checks and review status, comments, and handoff to agents; PR creation isn’t documented', mark: 'yes', cite: ['zeron-pull-requests', 'zeron-pr-handoff', 'zeron-source-control', 'zeron-pr-comments'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'No integration with GitHub Issues, Linear, Jira or GitLab is documented', mark: 'no', cite: ['zeron-readme'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Sign in on several devices to follow and drive chats, which run on their host; headless mode suits Linux servers', mark: 'yes', cite: ['zeron-readme', 'zeron-architecture'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'Not released: an iOS client that runs no agents itself is coming soon; no Android app', mark: 'no', cite: ['zeron-home', 'zeron-ios'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Downloads new releases from Zeron’s own feed and installs them on restart or quit', mark: 'yes', cite: ['zeron-readme', 'zeron-update'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Importing conversations started outside Zeron isn’t documented', mark: 'unknown', cite: ['zeron-readme'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'A command palette finds chats by title, project, device, branch or linked PR; full-text search isn’t documented', mark: 'partial', cite: ['zeron-command-palette'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Zeron drives each agent through that agent’s own interface: Claude Code’s stream-json, <code>codex app-server</code>, a Node shim around Cursor’s SDK (in public beta), OpenCode’s HTTP server and Pi’s JSONL RPC, with ACP for Devin, Grok, Hermes and Antigravity. The nine drivers are compiled into the app; the agents themselves are installed separately or from Zeron’s Settings. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, natively or through a pinned adapter.',
			cite: ['zeron-harness', 'zeron-claude-driver', 'zeron-cursor-driver', 'zeron-registry', 'zeron-home', 'zeron-installers', 'splash-registry', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'Zeron runs agents on your devices, including Linux servers in headless mode. After sign-in, chats sync through a Cloudflare relay, and every signed-in device can follow or drive a chat on its host and read and write the host’s workspace files. Splash runs agents on your computer or under <code>splash-server</code> on a machine you reach in a browser through SSH.',
			cite: ['zeron-readme', 'zeron-architecture', 'splash-readme', 'splash-server']
		},
		{
			title: 'Permission requests',
			text: 'Zeron runs agents unattended: it auto-approves their tool calls and sets Codex’s sandbox to <code>danger-full-access</code>. An agent’s questions still reach you, in a panel that replaces the composer. Splash shows each permission request an agent sends in the transcript, answered with the 1–9 keys, and keeps pending ones in <strong>Needs attention</strong>.',
			cite: ['zeron-claude-driver', 'zeron-codex-driver', 'zeron-acp-driver', 'zeron-architecture', 'splash-features']
		},
		{
			title: 'Platforms and updates',
			text: 'Both apps are MIT-licensed. Zeron’s desktop builds cover macOS 12+ on Apple silicon, Windows x64 and Linux x64 and arm64, and it updates itself from its own release feed. Splash builds for macOS 14+ on Apple silicon and Intel, Windows 11 x64 and Ubuntu 24.04 x64, and is updated by downloading a new release from GitHub.',
			cite: ['zeron-license', 'zeron-readme', 'zeron-info-plist', 'zeron-update', 'splash-license', 'splash-install', 'splash-about']
		},
		{
			title: 'Tools around the session',
			text: 'Zeron adds Project Actions, a browser tab for dev servers on this or another signed-in device, a GitHub PR board that hands pull requests to agents, an MCP server through which agents start other chats, and on-device voice dictation. Splash’s tools center on the conversation: a Needs attention queue, a review panel, full-text transcript search and importing sessions started elsewhere.',
			cite: ['zeron-project-actions', 'zeron-preview', 'zeron-pull-requests', 'zeron-pr-handoff', 'zeron-mcp', 'zeron-dictation', 'splash-features', 'splash-history']
		}
	],
	fit: {
		splash: [
			'You want to answer each permission request an agent sends, in the transcript or from one Needs attention queue.',
			'You want to import conversations agents started outside the app and search the full text of saved sessions.',
			'You want a GitHub view of issues, pull requests and Actions runs across repositories.',
			'You use an Intel Mac, or want to open your sessions in a browser through an SSH tunnel to your own server.'
		],
		other: [
			'You want to keep watch on agents running on one computer and steer them from another device.',
			'You want worktree setup commands and a built-in browser for dev servers, including ones on other devices.',
			'You want a GitHub PR board that passes a PR to a new agent session for review or to fix failing checks.',
			'You want agents that start, message and wait on other chats through a built-in MCP server.'
		]
	},
	sources: [
		{ id: 'zeron-home', title: 'Zeron — control your coding agents from any device', url: 'https://zeron.sh', publisher: 'zeronsh', checked: '2026-10-10' },
		{ id: 'zeron-readme', title: 'README.md', url: 'https://github.com/zeronsh/zeron/blob/main/README.md', publisher: 'zeronsh/zeron on GitHub', checked: '2026-10-10' },
		{ id: 'zeron-license', title: 'LICENSE', url: 'https://github.com/zeronsh/zeron/blob/main/LICENSE', publisher: 'zeronsh/zeron on GitHub', checked: '2026-10-10' },
		{ id: 'zeron-architecture', title: 'ARCHITECTURE.md', url: 'https://github.com/zeronsh/zeron/blob/main/ARCHITECTURE.md', publisher: 'zeronsh/zeron on GitHub', checked: '2026-10-10' },
		{ id: 'zeron-parity', title: 'docs/PARITY.md', url: 'https://github.com/zeronsh/zeron/blob/main/docs/PARITY.md', publisher: 'zeronsh/zeron on GitHub', checked: '2026-10-10' },
		{ id: 'zeron-release', title: 'Release v0.2.107', url: 'https://github.com/zeronsh/zeron/releases/tag/v0.2.107', publisher: 'zeronsh/zeron on GitHub', checked: '2026-10-10' },
		{ id: 'zeron-release-api', title: 'Release v0.2.107 (REST API)', url: 'https://api.github.com/repos/zeronsh/zeron/releases/tags/v0.2.107', publisher: 'zeronsh/zeron on GitHub', checked: '2026-10-10' },
		{ id: 'zeron-first-release', title: 'Releases API, oldest page', url: 'https://api.github.com/repos/zeronsh/zeron/releases?per_page=1&page=170', publisher: 'zeronsh/zeron on GitHub', checked: '2026-10-10' },
		{ id: 'zeron-info-plist', title: 'dist/macos/Info.plist', url: 'https://github.com/zeronsh/zeron/blob/main/dist/macos/Info.plist', publisher: 'zeronsh/zeron on GitHub', checked: '2026-10-10' },
		{ id: 'zeron-ios', title: 'apps/ios/README.md', url: 'https://github.com/zeronsh/zeron/blob/main/apps/ios/README.md', publisher: 'zeronsh/zeron on GitHub', checked: '2026-10-10' },
		{ id: 'zeron-registry', title: 'crates/engine/src/registry.rs', url: 'https://github.com/zeronsh/zeron/blob/main/crates/engine/src/registry.rs', publisher: 'zeronsh/zeron on GitHub', checked: '2026-10-10' },
		{ id: 'zeron-harness', title: 'crates/harness/src/lib.rs', url: 'https://github.com/zeronsh/zeron/blob/main/crates/harness/src/lib.rs', publisher: 'zeronsh/zeron on GitHub', checked: '2026-10-10' },
		{ id: 'zeron-claude-driver', title: 'crates/harness/src/claude/mod.rs', url: 'https://github.com/zeronsh/zeron/blob/main/crates/harness/src/claude/mod.rs', publisher: 'zeronsh/zeron on GitHub', checked: '2026-10-10' },
		{ id: 'zeron-codex-driver', title: 'crates/harness/src/codex/mod.rs', url: 'https://github.com/zeronsh/zeron/blob/main/crates/harness/src/codex/mod.rs', publisher: 'zeronsh/zeron on GitHub', checked: '2026-10-10' },
		{ id: 'zeron-cursor-driver', title: 'crates/harness/src/cursor/mod.rs', url: 'https://github.com/zeronsh/zeron/blob/main/crates/harness/src/cursor/mod.rs', publisher: 'zeronsh/zeron on GitHub', checked: '2026-10-10' },
		{ id: 'zeron-acp-driver', title: 'crates/harness/src/acp/mod.rs', url: 'https://github.com/zeronsh/zeron/blob/main/crates/harness/src/acp/mod.rs', publisher: 'zeronsh/zeron on GitHub', checked: '2026-10-10' },
		{ id: 'zeron-installers', title: 'crates/harness/README.md', url: 'https://github.com/zeronsh/zeron/blob/main/crates/harness/README.md', publisher: 'zeronsh/zeron on GitHub', checked: '2026-10-10' },
		{ id: 'zeron-accounts', title: 'crates/engine/src/agent_accounts.rs', url: 'https://github.com/zeronsh/zeron/blob/main/crates/engine/src/agent_accounts.rs', publisher: 'zeronsh/zeron on GitHub', checked: '2026-10-10' },
		{ id: 'zeron-pickers', title: 'crates/ui/src/pickers.rs', url: 'https://github.com/zeronsh/zeron/blob/main/crates/ui/src/pickers.rs', publisher: 'zeronsh/zeron on GitHub', checked: '2026-10-10' },
		{ id: 'zeron-repos', title: 'crates/engine/src/repos.rs', url: 'https://github.com/zeronsh/zeron/blob/main/crates/engine/src/repos.rs', publisher: 'zeronsh/zeron on GitHub', checked: '2026-10-10' },
		{ id: 'zeron-project-actions', title: 'docs/reference/project-actions.md', url: 'https://github.com/zeronsh/zeron/blob/main/docs/reference/project-actions.md', publisher: 'zeronsh/zeron on GitHub', checked: '2026-10-10' },
		{ id: 'zeron-preview', title: 'docs/preview-networking.md', url: 'https://github.com/zeronsh/zeron/blob/main/docs/preview-networking.md', publisher: 'zeronsh/zeron on GitHub', checked: '2026-10-10' },
		{ id: 'zeron-linux-browser', title: 'docs/reference/linux-browser.md', url: 'https://github.com/zeronsh/zeron/blob/main/docs/reference/linux-browser.md', publisher: 'zeronsh/zeron on GitHub', checked: '2026-10-10' },
		{ id: 'zeron-notify', title: 'crates/ui/src/notify.rs', url: 'https://github.com/zeronsh/zeron/blob/main/crates/ui/src/notify.rs', publisher: 'zeronsh/zeron on GitHub', checked: '2026-10-10' },
		{ id: 'zeron-mcp', title: 'docs/mcp.md', url: 'https://github.com/zeronsh/zeron/blob/main/docs/mcp.md', publisher: 'zeronsh/zeron on GitHub', checked: '2026-10-10' },
		{ id: 'zeron-comments', title: 'crates/ui/src/comments.rs', url: 'https://github.com/zeronsh/zeron/blob/main/crates/ui/src/comments.rs', publisher: 'zeronsh/zeron on GitHub', checked: '2026-10-10' },
		{ id: 'zeron-pull-requests', title: 'crates/ui/src/pull_requests.rs', url: 'https://github.com/zeronsh/zeron/blob/main/crates/ui/src/pull_requests.rs', publisher: 'zeronsh/zeron on GitHub', checked: '2026-10-10' },
		{ id: 'zeron-pr-handoff', title: 'crates/ui/src/pull_request_handoff.rs', url: 'https://github.com/zeronsh/zeron/blob/main/crates/ui/src/pull_request_handoff.rs', publisher: 'zeronsh/zeron on GitHub', checked: '2026-10-10' },
		{ id: 'zeron-pr-comments', title: 'crates/ui/src/pull_request_interactions.rs', url: 'https://github.com/zeronsh/zeron/blob/main/crates/ui/src/pull_request_interactions.rs', publisher: 'zeronsh/zeron on GitHub', checked: '2026-10-10' },
		{ id: 'zeron-source-control', title: 'crates/engine/src/source_control.rs', url: 'https://github.com/zeronsh/zeron/blob/main/crates/engine/src/source_control.rs', publisher: 'zeronsh/zeron on GitHub', checked: '2026-10-10' },
		{ id: 'zeron-update', title: 'crates/update/src/lib.rs', url: 'https://github.com/zeronsh/zeron/blob/main/crates/update/src/lib.rs', publisher: 'zeronsh/zeron on GitHub', checked: '2026-10-10' },
		{ id: 'zeron-command-palette', title: 'crates/ui/src/shell/command_palette.rs', url: 'https://github.com/zeronsh/zeron/blob/main/crates/ui/src/shell/command_palette.rs', publisher: 'zeronsh/zeron on GitHub', checked: '2026-10-10' },
		{ id: 'zeron-dictation', title: 'docs/reference/desktop-dictation.md', url: 'https://github.com/zeronsh/zeron/blob/main/docs/reference/desktop-dictation.md', publisher: 'zeronsh/zeron on GitHub', checked: '2026-10-10' }
	]
};
