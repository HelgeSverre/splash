// Splash vs VibeWorkspace. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const VIBEWORKSPACE: Comparison = {
	slug: 'vibeworkspace',
	name: 'VibeWorkspace',
	description: 'How Splash and VibeWorkspace compare on agents, platforms, pricing, terminals, review and remote use, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and VibeWorkspace are both free desktop apps for running several coding agents at once. VibeWorkspace, a Tauri app, runs each agent’s own command-line interface in up to four terminal panes beside an editor, Git tools and developer utilities; Splash, an open-source Rust app, drives agents over the Agent Client Protocol and renders their work as a transcript.',
	other: {
		name: 'VibeWorkspace',
		url: 'https://www.vibe-workspace.cloud',
		maker: 'VibeWorkspace',
		summary: 'A free Tauri desktop app for macOS, Windows and Linux that runs Claude Code, Codex, Gemini CLI and other agent CLIs in up to four terminals, with an editor, Git tools and developer utilities.',
		cite: ['vibeworkspace-home', 'vibeworkspace-pricing', 'vibeworkspace-downloads', 'vibeworkspace-changelog', 'vibeworkspace-docs']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app that runs agent CLIs in up to four terminals beside an editor, Git tools and developer utilities', cite: ['vibeworkspace-home', 'vibeworkspace-docs', 'vibeworkspace-features'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v1.2.0 (21 September 2026); 1.0.0 in June 2026 was the first stable release, after betas from May 2026', cite: ['vibeworkspace-changelog', 'vibeworkspace-downloads'] } },
				{ label: 'License', splash: S.license, other: { text: 'No license is named and no source code is linked; the site calls the app “100% Free & Open”', cite: ['vibeworkspace-changelog', 'vibeworkspace-pricing'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free, with no paid tiers, subscription or license key since 1.2.0; the user guide still describes a trial and activation key', cite: ['vibeworkspace-pricing', 'vibeworkspace-changelog', 'vibeworkspace-docs'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 12+ on Apple silicon (no Intel build), Windows 10+ x64 (.msi), Ubuntu 20.04+ and Debian 11+ x64 (.deb)', cite: ['vibeworkspace-downloads', 'vibeworkspace-changelog'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Tauri, with a Next.js and React frontend', cite: ['vibeworkspace-changelog'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code, Codex, Gemini CLI, OpenCode, Amp, Cline and Cursor Agent (the lists vary by page), or any terminal command', cite: ['vibeworkspace-home', 'vibeworkspace-docs', 'vibeworkspace-features'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each agent’s own CLI in a terminal pane (a PTY session); ACP and vendor SDKs aren’t mentioned', cite: ['vibeworkspace-changelog', 'vibeworkspace-docs'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'You install each agent’s CLI yourself; the app sells no model use. A switcher for saved agent logins is Coming Soon', cite: ['vibeworkspace-docs', 'vibeworkspace-pricing', 'vibeworkspace-features'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'No account; optional GitHub sign-in through the device flow lets you browse and clone your repositories', cite: ['vibeworkspace-downloads', 'vibeworkspace-docs'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Not documented; agents run in their own terminals, and no handling of their approval prompts is described', mark: 'unknown', cite: ['vibeworkspace-docs'] } },
				{
					label: 'Agent skills',
					hint: 'Reusable instruction packs for agents',
					splash: { text: 'Settings shows, read-only, the skills, slash commands and MCP servers each agent has', mark: 'partial', cite: ['splash-features'] },
					other: { text: 'Built-in and custom skills, an importer for Git repos and registries, and a prompt library; MCP isn’t mentioned', mark: 'yes', cite: ['vibeworkspace-docs', 'vibeworkspace-features', 'vibeworkspace-changelog'] }
				}
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Terminals share the workspace folder or each get their own; Git Lens manages worktrees, but no worktree per agent is described', mark: 'partial', cite: ['vibeworkspace-docs', 'vibeworkspace-features'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'None documented; a Port Manager lists and kills processes on ports, and an env editor manages .env files', mark: 'no', cite: ['vibeworkspace-features'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'Up to four terminals in a grid, columns, rows or full screen; agent terminals keep their scrollback across restarts', mark: 'yes', cite: ['vibeworkspace-docs', 'vibeworkspace-features'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Per-agent running, waiting and done badges, an activity feed, a tray list of active agents and an optional desktop pet', mark: 'yes', cite: ['vibeworkspace-home', 'vibeworkspace-features'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'In-app and native desktop notifications when agents or project scripts finish work in the background', mark: 'yes', cite: ['vibeworkspace-features', 'vibeworkspace-home'] } },
				{ label: 'Agents handing off work', hint: 'One agent messaging or launching another', splash: S.handoff, other: { text: 'Channel Chat: you and agents talk in named channels with mentions. Delegating by @mention from a terminal is Coming Soon', mark: 'yes', cite: ['vibeworkspace-features', 'vibeworkspace-home'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Side-by-side Monaco diffs, per-file accept or revert of agent edits, and sending selected code or files to an agent', mark: 'yes', cite: ['vibeworkspace-docs', 'vibeworkspace-features'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'A Monaco code editor and viewer, a three-way merge-conflict editor, and Open in External Editor for VS Code, Cursor or Zed', mark: 'yes', cite: ['vibeworkspace-features', 'vibeworkspace-changelog'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'None documented; Git Lens can push branches, and GitHub sign-in is used to clone repositories', mark: 'no', cite: ['vibeworkspace-changelog', 'vibeworkspace-docs'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Optional device-flow sign-in to browse and clone your repositories; no PR, issue or CI views are documented', mark: 'partial', cite: ['vibeworkspace-docs', 'vibeworkspace-changelog'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Not yet: the app runs locally, and Remote Control from other devices and SSH projects are listed as Coming Soon', mark: 'no', cite: ['vibeworkspace-home', 'vibeworkspace-features'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Checks GitHub Releases for signed updates, then downloads and installs them with a restart', mark: 'yes', cite: ['vibeworkspace-changelog', 'vibeworkspace-docs'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented; a Resume UI reopens past Claude Code, Codex and Gemini CLI sessions without saying where they began', mark: 'unknown', cite: ['vibeworkspace-features', 'vibeworkspace-docs'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'The Resume UI searches past Claude Code, Codex and Gemini CLI sessions; a prompt history keeps earlier prompts', mark: 'partial', cite: ['vibeworkspace-features'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'VibeWorkspace starts each agent’s own CLI in a terminal pane, a PTY session, so any command that runs in a terminal works, including local models with a CLI; its site mentions no ACP or vendor SDK. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, natively or through an adapter, and draws messages, tool calls and permission requests itself.',
			cite: ['vibeworkspace-changelog', 'vibeworkspace-docs', 'vibeworkspace-home', 'splash-registry', 'splash-features', 'acp']
		},
		{
			title: 'Where it runs',
			text: 'VibeWorkspace runs on your computer and keeps code, API keys and terminal logs there. Remote Control from other devices and projects opened over SSH appear on its features page, marked Coming Soon. Splash runs locally or as <code>splash-server</code> on the machine that holds your code, which one user opens in a browser through an SSH tunnel.',
			cite: ['vibeworkspace-home', 'vibeworkspace-features', 'splash-readme', 'splash-server']
		},
		{
			title: 'Price, license and platforms',
			text: 'Both are free and need no account. VibeWorkspace dropped its licensing restrictions in 1.2.0, names no license and links no source code. It ships for Apple silicon Macs, Windows x64 and Ubuntu or Debian, and updates itself. Splash is MIT-licensed, builds for macOS 14+ (Apple silicon and Intel), Windows 11 x64 and Ubuntu 24.04 x64, and updates by download.',
			cite: ['vibeworkspace-pricing', 'vibeworkspace-downloads', 'vibeworkspace-changelog', 'splash-license', 'splash-download', 'splash-build', 'splash-install', 'splash-about']
		},
		{
			title: 'Tools around the agents',
			text: 'VibeWorkspace surrounds its terminals with a Monaco editor, Git Lens, a prompt box that takes dragged files and images, Channel Chat between agents, a skill library, an HTTP client, container controls and utilities such as JSON and JWT tools. Splash centers on the conversation: a transcript, a <strong>Needs attention</strong> queue, a review screen, transcript search and a GitHub triage view.',
			cite: ['vibeworkspace-features', 'vibeworkspace-home', 'vibeworkspace-changelog', 'splash-features', 'splash-github']
		}
	],
	fit: {
		splash: [
			'You want every agent driven over the Agent Client Protocol and shown as a transcript, with permission requests in one queue.',
			'You want each session in its own git worktree on its own branch, whichever agent it runs.',
			'You want an MIT-licensed app with builds for Intel Macs as well as Apple silicon.',
			'You want to run sessions on your own server and use them from a browser over SSH.'
		],
		other: [
			'You want each agent’s own terminal interface, with any command-line agent, local models included.',
			'You want a code editor, Git Lens with worktrees and conflict resolution, and per-file accept or revert of agent edits.',
			'You want agents talking in shared channels, plus a library of skills and prompts to give them.',
			'You want an app that updates itself and bundles an HTTP client, container controls and other developer utilities.'
		]
	},
	sources: [
		{ id: 'vibeworkspace-home', title: 'Vibe Coding IDE for Claude Code, Codex, Gemini, and AI Agents', url: 'https://www.vibe-workspace.cloud/', publisher: 'VibeWorkspace', checked: '2026-10-10' },
		{ id: 'vibeworkspace-features', title: 'Vibe Coding Features', url: 'https://www.vibe-workspace.cloud/features', publisher: 'VibeWorkspace', checked: '2026-10-10' },
		{ id: 'vibeworkspace-pricing', title: 'Vibe Coding IDE Pricing', url: 'https://www.vibe-workspace.cloud/pricing', publisher: 'VibeWorkspace', checked: '2026-10-10' },
		{ id: 'vibeworkspace-downloads', title: 'Download VibeWorkspace', url: 'https://www.vibe-workspace.cloud/downloads', publisher: 'VibeWorkspace', checked: '2026-10-10' },
		{ id: 'vibeworkspace-docs', title: 'VibeWorkspace User Guide', url: 'https://www.vibe-workspace.cloud/docs', publisher: 'VibeWorkspace', checked: '2026-10-10' },
		{ id: 'vibeworkspace-changelog', title: 'VibeWorkspace Release Notes', url: 'https://www.vibe-workspace.cloud/changelog', publisher: 'VibeWorkspace', checked: '2026-10-10' }
	]
};
