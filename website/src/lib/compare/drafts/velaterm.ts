// Splash vs VelaTerm. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

const commit = 'https://github.com/vlinx-io/VelaTerm/blob/98b5f2f41acee62b8afa639832c758fd4a15e2bf';

export const VELATERM: Comparison = {
	slug: 'velaterm',
	name: 'VelaTerm',
	description: 'How Splash and VelaTerm compare on agents, terminals, platforms, worktrees, review and remote use, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and VelaTerm are both open-source desktop apps for running several coding agents at once. VelaTerm pairs agent sessions with split terminals: every agent can run its own terminal interface, and five can also run in a conversation view VelaTerm draws. Splash drives every agent over the Agent Client Protocol and shows each session as a transcript.',
	other: {
		name: 'VelaTerm',
		url: 'https://velaterm.com',
		maker: 'VLINX',
		summary: 'An open-source desktop app that combines coding-agent sessions with split terminals. It starts fourteen agents in their own terminal interfaces, five of them also in a conversation view, on your computer or an SSH host.',
		cite: ['velaterm-home', 'velaterm-agent-sessions', 'velaterm-conversation-view', 'velaterm-remote']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app pairing agent sessions with split terminals; it can also serve the same sessions to a web browser', cite: ['velaterm-home', 'velaterm-remote'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v0.2.9 (7 October 2026), pre-1.0, first released publicly in July 2026; account sharing and code audits are experimental', cite: ['velaterm-download', 'velaterm-release', 'velaterm-security', 'velaterm-changelog', 'velaterm-remote', 'velaterm-manual'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (MIT), copyright VLINX Software', cite: ['velaterm-license', 'velaterm-readme', 'velaterm-home'] } },
				{ label: 'Price', splash: S.price, other: { text: 'No price or paid plans are published; the MIT license grants its permissions free of charge', cite: ['velaterm-home', 'velaterm-license'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon and Intel), Windows x64 and Linux AppImage (x86_64, aarch64); iOS and Android apps are unpublished', cite: ['velaterm-getting-started', 'velaterm-download', 'velaterm-remote'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Tauri 2 (Rust and the system webview) on macOS and Windows, Electron on Linux since v0.2.6; React 19 and TypeScript', cite: ['velaterm-readme', 'velaterm-changelog', 'velaterm-home'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Fourteen, including Claude Code, Codex, OpenCode, Copilot, Cursor and Grok Build; presets can launch another executable for a supported kind', cite: ['velaterm-agent-sessions', 'velaterm-getting-started', 'velaterm-changelog'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each agent’s own TUI in a real terminal; five agents also run in a conversation view over each CLI’s native protocol', cite: ['velaterm-conversation-view', 'velaterm-changelog', 'velaterm-src-chat', 'velaterm-src-engine'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'The setup flow has no sign-in; an optional, experimental account lets your other devices continue conversations through velaterm.com', cite: ['velaterm-getting-started', 'velaterm-remote', 'velaterm-privacy'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Allow and Deny cards in the conversation view, for five agents; terminal sessions show the agent’s own interface', mark: 'partial', cite: ['velaterm-conversation-view'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Claude and Codex conversations show each MCP server’s status, with reconnect and on/off controls; audits add a Codex Security server', mark: 'partial', cite: ['velaterm-conversation-view', 'velaterm-code-audits'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'The project folder by default; a git worktree on a new branch for chosen sessions, groups or Plan/Execute roles', mark: 'yes', cite: ['velaterm-git', 'velaterm-plan-execute'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Worktree setup scripts and port handling aren’t documented; a terminal session can run a startup command, such as pnpm dev', mark: 'partial', cite: ['velaterm-terminal'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'The core of the app: real shells in split panes, with search, image paste and Windows shells including WSL', mark: 'yes', cite: ['velaterm-terminal', 'velaterm-interface', 'velaterm-readme'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Status dots, sidebar counters, system notifications and a Dock badge; Cursor, Antigravity, Cline and Kiro don’t report waiting for you', mark: 'yes', cite: ['velaterm-getting-started', 'velaterm-interface', 'velaterm-agent-sessions'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Agents start child sessions with vspawn and message others with vtell; in Plan/Execute a planner dispatches and reviews executor sessions', mark: 'yes', cite: ['velaterm-session-commands', 'velaterm-plan-execute', 'velaterm-home'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'A built-in browser in the desktop app; the makers say it also works on remote machines', mark: 'yes', cite: ['velaterm-home'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'A changes view with a file list and diff, Codex’s /review, and planner review in Plan/Execute; diff line comments aren’t documented', mark: 'yes', cite: ['velaterm-git', 'velaterm-conversation-view', 'velaterm-plan-execute'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'Code editor, WYSIWYG Markdown editor and image viewer; a Git tab stages, discards, commits and shows each commit’s diff', mark: 'yes', cite: ['velaterm-home', 'velaterm-changelog', 'velaterm-interface'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'No GitHub integration is documented; Git features work on local branches, worktrees and merges', mark: 'no', cite: ['velaterm-git', 'velaterm-interface'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'SSH hosts on Linux, macOS or Windows get a VelaTerm server automatically; the app can also serve browsers over HTTPS', mark: 'yes', cite: ['velaterm-remote'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'iOS and Android apps are in development and not yet published; the browser UI switches to a phone layout', mark: 'no', cite: ['velaterm-remote', 'velaterm-home'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Signed builds update in the app; checks every six hours send an anonymous install ID and the UI language', mark: 'yes', cite: ['velaterm-download', 'velaterm-src-updater', 'velaterm-changelog'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Imports conversations from Codex, Claude, OpenCode and Kiro whose folder matches a project; all fourteen agents resume by conversation ID', mark: 'yes', cite: ['velaterm-agent-sessions'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Global search (⌘⇧F) across agent conversations, plus terminal output when session recording is on', mark: 'yes', cite: ['velaterm-interface'] } },
				{ label: 'Fork a conversation', splash: S.fork, other: { text: 'Fork Session branches Claude, Codex, Pi and OMP conversations from their current history', mark: 'partial', cite: ['velaterm-agent-sessions'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'VelaTerm runs every agent’s own terminal interface in a PTY and learns its status from hooks, notify and plugins it injects at launch. For Claude Code, Codex, OpenCode, Pi and OMP it also offers a conversation view, driving each CLI’s native protocol (stream-json, <code>codex app-server</code>, <code>opencode serve</code>, RPC), not ACP. Splash speaks the <strong>Agent Client Protocol</strong> with every agent.',
			cite: ['velaterm-changelog', 'velaterm-agent-sessions', 'velaterm-conversation-view', 'velaterm-src-chat', 'velaterm-src-claude', 'velaterm-src-codex', 'velaterm-src-opencode', 'velaterm-src-pi', 'splash-registry', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'VelaTerm runs agents on your computer or on SSH hosts, where it installs its own server, and can serve its UI over HTTPS to browsers on phones and other computers. An experimental account relays conversations through velaterm.com. Splash runs agents on your computer, or under <code>splash-server</code> on a machine you reach through an SSH tunnel.',
			cite: ['velaterm-remote', 'velaterm-privacy', 'splash-readme', 'splash-server']
		},
		{
			title: 'Platforms and updates',
			text: 'VelaTerm ships signed, self-updating builds for macOS (Apple silicon and Intel), Windows x64 and Linux x86_64 and aarch64; Linux moved to Electron in v0.2.6. On Windows, Claude Code and Codex are fully supported; other agents come without that promise. Splash builds for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64, and new versions are downloaded from GitHub Releases.',
			cite: ['velaterm-download', 'velaterm-getting-started', 'velaterm-changelog', 'velaterm-agent-sessions', 'splash-install', 'splash-about']
		},
		{
			title: 'Tools around the agent',
			text: 'VelaTerm surrounds sessions with split terminals, code and Markdown editors, a browser tab, in-session commands such as <code>vspawn</code> and <code>vtell</code>, Plan/Execute workflows, knowledge bases, experimental code audits, and quota readouts with automatic continuation after a usage limit resets. Splash centers on the conversation: a rendered transcript, a Needs attention queue, review of changed files and a GitHub triage view.',
			cite: ['velaterm-home', 'velaterm-session-commands', 'velaterm-plan-execute', 'velaterm-code-audits', 'velaterm-agent-sessions', 'velaterm-conversation-view', 'splash-features', 'splash-github']
		},
		{
			title: 'License, accounts and data',
			text: 'Both are MIT-licensed. VelaTerm publishes no price; its optional, experimental account (email, Apple, Google, Facebook, X or GitHub sign-in) relays end-to-end encrypted conversations between devices, and update checks send an anonymous installation ID every six hours. Splash is free and has no accounts; <code>splash-server</code> asks for a token it keeps in its data folder.',
			cite: ['velaterm-license', 'velaterm-home', 'velaterm-remote', 'velaterm-privacy', 'velaterm-src-updater', 'splash-license', 'splash-download', 'splash-build', 'splash-server']
		}
	],
	fit: {
		splash: [
			'You want every agent driven over the Agent Client Protocol and shown as one rendered transcript.',
			'You want permission requests answered in the transcript and gathered in one Needs attention queue.',
			'You want to browse and import the history agents list over ACP, then search it with the rest.',
			'You want a GitHub triage view of issues, pull requests and Actions runs across repositories.'
		],
		other: [
			'You want each agent’s own terminal interface in split panes, next to plain shells and editors.',
			'You want agents that start child sessions, message each other or run planner and executor workflows.',
			'You want agents on SSH hosts and the same sessions in a browser on your phone.',
			'You want quota readouts and automatic continuation after a Claude or Codex usage limit resets.'
		]
	},
	sources: [
		{ id: 'velaterm-home', title: 'VelaTerm — Terminal & Agent Manager', url: 'https://velaterm.com/', publisher: 'VLINX', checked: '2026-10-10' },
		{ id: 'velaterm-download', title: 'Download VelaTerm', url: 'https://velaterm.com/download', publisher: 'VLINX', checked: '2026-10-10' },
		{ id: 'velaterm-manual', title: 'VelaTerm User Manual', url: 'https://velaterm.com/docs', publisher: 'VLINX', checked: '2026-10-10' },
		{ id: 'velaterm-getting-started', title: 'Getting Started', url: 'https://velaterm.com/docs/getting-started', publisher: 'VLINX', checked: '2026-10-10' },
		{ id: 'velaterm-agent-sessions', title: 'AI Agent Sessions', url: 'https://velaterm.com/docs/ai-agent-sessions', publisher: 'VLINX', checked: '2026-10-10' },
		{ id: 'velaterm-conversation-view', title: 'Conversation View', url: 'https://velaterm.com/docs/conversation-view', publisher: 'VLINX', checked: '2026-10-10' },
		{ id: 'velaterm-interface', title: 'Interface & Session Management', url: 'https://velaterm.com/docs/interface-and-sessions', publisher: 'VLINX', checked: '2026-10-10' },
		{ id: 'velaterm-terminal', title: 'Terminal Usage', url: 'https://velaterm.com/docs/terminal-usage', publisher: 'VLINX', checked: '2026-10-10' },
		{ id: 'velaterm-git', title: 'Session Spawning & Git Collaboration', url: 'https://velaterm.com/docs/session-spawning-and-git', publisher: 'VLINX', checked: '2026-10-10' },
		{ id: 'velaterm-plan-execute', title: 'Planning and Execution', url: 'https://velaterm.com/docs/planning-and-execution', publisher: 'VLINX', checked: '2026-10-10' },
		{ id: 'velaterm-session-commands', title: 'Session Commands', url: 'https://velaterm.com/docs/session-commands', publisher: 'VLINX', checked: '2026-10-10' },
		{ id: 'velaterm-code-audits', title: 'Code Audits', url: 'https://velaterm.com/docs/code-audits', publisher: 'VLINX', checked: '2026-10-10' },
		{ id: 'velaterm-remote', title: 'Remote Development & Management', url: 'https://velaterm.com/docs/remote-development', publisher: 'VLINX', checked: '2026-10-10' },
		{ id: 'velaterm-changelog', title: 'Changelog', url: 'https://velaterm.com/docs/changelog', publisher: 'VLINX', checked: '2026-10-10' },
		{ id: 'velaterm-privacy', title: 'Privacy and data deletion', url: 'https://velaterm.com/privacy', publisher: 'VLINX', checked: '2026-10-10' },
		{ id: 'velaterm-release', title: 'VelaTerm v0.2.9', url: 'https://github.com/vlinx-io/VelaTerm/releases/tag/v0.2.9', publisher: 'vlinx-io/VelaTerm on GitHub', checked: '2026-10-10' },
		{ id: 'velaterm-readme', title: 'README.md', url: `${commit}/README.md`, publisher: 'vlinx-io/VelaTerm on GitHub', checked: '2026-10-10' },
		{ id: 'velaterm-license', title: 'LICENSE', url: `${commit}/LICENSE`, publisher: 'vlinx-io/VelaTerm on GitHub', checked: '2026-10-10' },
		{ id: 'velaterm-security', title: 'SECURITY.md', url: `${commit}/SECURITY.md`, publisher: 'vlinx-io/VelaTerm on GitHub', checked: '2026-10-10' },
		{ id: 'velaterm-src-chat', title: 'src-tauri/src/agent/chat/mod.rs', url: `${commit}/src-tauri/src/agent/chat/mod.rs`, publisher: 'vlinx-io/VelaTerm on GitHub', checked: '2026-10-10' },
		{ id: 'velaterm-src-engine', title: 'src-tauri/src/agent/chat/engine.rs', url: `${commit}/src-tauri/src/agent/chat/engine.rs`, publisher: 'vlinx-io/VelaTerm on GitHub', checked: '2026-10-10' },
		{ id: 'velaterm-src-claude', title: 'src-tauri/src/agent/chat/protocol.rs', url: `${commit}/src-tauri/src/agent/chat/protocol.rs`, publisher: 'vlinx-io/VelaTerm on GitHub', checked: '2026-10-10' },
		{ id: 'velaterm-src-codex', title: 'src-tauri/src/agent/chat/codex_protocol.rs', url: `${commit}/src-tauri/src/agent/chat/codex_protocol.rs`, publisher: 'vlinx-io/VelaTerm on GitHub', checked: '2026-10-10' },
		{ id: 'velaterm-src-opencode', title: 'src-tauri/src/agent/chat/engine/opencode.rs', url: `${commit}/src-tauri/src/agent/chat/engine/opencode.rs`, publisher: 'vlinx-io/VelaTerm on GitHub', checked: '2026-10-10' },
		{ id: 'velaterm-src-pi', title: 'src-tauri/src/agent/chat/pi_protocol.rs', url: `${commit}/src-tauri/src/agent/chat/pi_protocol.rs`, publisher: 'vlinx-io/VelaTerm on GitHub', checked: '2026-10-10' },
		{ id: 'velaterm-src-updater', title: 'src/ipc/updater.ts', url: `${commit}/src/ipc/updater.ts`, publisher: 'vlinx-io/VelaTerm on GitHub', checked: '2026-10-10' }
	]
};
