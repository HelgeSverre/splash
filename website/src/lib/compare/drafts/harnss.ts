// Splash vs Harnss. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const HARNSS: Comparison = {
	slug: 'harnss',
	name: 'Harnss',
	description: 'How Splash and Harnss (formerly OpenACP UI) compare on agents, platforms, licensing, worktrees, review and history, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Harnss are open-source, MIT-licensed desktop apps for running several AI coding agents from one window. Harnss, built on Electron, runs Claude Code through Anthropic’s Claude Agent SDK, Codex through its app server and other agents over the Agent Client Protocol. Splash, written in Rust, drives every agent over the Agent Client Protocol.',
	other: {
		name: 'Harnss',
		url: 'https://github.com/OpenSource03/harnss',
		maker: 'Dejan Žegarac',
		summary: 'An open-source Electron app for macOS, Windows and Linux, called OpenACP UI until February 2026, that runs Claude Code, Codex and ACP agents in one interface, with a terminal, browser and Git panel.',
		cite: ['harnss-repo', 'harnss-readme', 'harnss-license', 'harnss-release-0-10-0']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Electron desktop app; no CLI, server, web or phone client is documented', cite: ['harnss-readme', 'harnss-package'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: '0.21.5 (19 March 2026), then the 0.22.0-beta.2 pre-release (14 April 2026); early development, with a large rewrite pending', cite: ['harnss-release-0-21-5', 'harnss-release-0-22-0-beta-2', 'harnss-readme'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (MIT)', cite: ['harnss-license', 'harnss-package'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free downloads from GitHub Releases, no published price; donations through GitHub Sponsors and Buy Me a Coffee', cite: ['harnss-readme', 'harnss-funding'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon and Intel), Windows x64 and ARM64, Linux x64 and arm64 as AppImage and .deb', cite: ['harnss-readme', 'harnss-release-0-22-0-beta-2'] } },
				{ label: 'Signed builds', splash: { text: 'macOS packages are signed and notarized; Windows packages and server archives are unsigned', cite: ['splash-install'] }, other: { text: 'Prebuilt binaries are unsigned, so Gatekeeper and Windows Defender warn; a request to sign them is open', cite: ['harnss-readme', 'harnss-issue-36'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code and Codex built in; Gemini CLI, Goose, cagent and other ACP agents from a registry or custom command', cite: ['harnss-readme'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Claude Code through Anthropic’s Claude Agent SDK, Codex through codex app-server over JSON-RPC, every other agent over ACP on stdio', cite: ['harnss-claude-sessions', 'harnss-codex-sessions', 'harnss-acp-sessions'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Your Claude and OpenAI or ChatGPT accounts, with an in-app Codex login; Harnss can install Claude Code and Codex', cite: ['harnss-readme', 'harnss-codex-auth', 'harnss-release-0-16-2', 'harnss-release-0-14-2'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'No Harnss account; you sign in to each agent instead', cite: ['harnss-readme'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Three modes, Ask First, Accept Edits and Allow All; for Codex they set its sandbox level', mark: 'yes', cite: ['harnss-readme', 'harnss-release-0-14-3'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Per-project MCP servers over stdio, SSE or HTTP with in-app OAuth; Jira and Confluence output gets custom views', mark: 'yes', cite: ['harnss-readme'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'You add and remove worktrees in the Git panel and pick one per project; none is created per session', mark: 'partial', cite: ['harnss-release-0-8-0', 'harnss-release-0-22-0-beta-1'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: '0.22 pre-releases run .harnss/worktree.json commands, such as installs or .env copies, in each new worktree; dev servers not documented', mark: 'partial', cite: ['harnss-git-ipc', 'harnss-worktree-bar'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'Multi-tab terminal running your native shell; each Space keeps its own terminal sessions', mark: 'yes', cite: ['harnss-readme', 'harnss-release-0-11-0', 'harnss-package'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'A browser panel inside the app opens links and can pass pages to the agent as extra context', mark: 'yes', cite: ['harnss-readme'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'In the 0.22 pre-release, sessions that finish in the background get a pulsing sidebar dot until opened', mark: 'partial', cite: ['harnss-release-0-22-0-beta-2'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'Desktop notifications, which you can configure, for plan approvals, permission prompts, questions from the agent and finished sessions', mark: 'yes', cite: ['harnss-readme'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Word-level, syntax-highlighted diffs and a per-turn Changes panel; Claude sessions can roll files or chat back to a checkpoint', mark: 'yes', cite: ['harnss-readme', 'harnss-release-0-5-0'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'The Git panel stages, commits with AI-written messages, pushes, pulls and switches branches; creating PRs is not documented', mark: 'no', cite: ['harnss-readme', 'harnss-git-ipc'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'No GitHub features beyond git itself; pull requests, CI checks and the GitHub API are not documented', mark: 'no', cite: ['harnss-readme'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'Jira board, a developer preview off by default; Create Task sends an issue to the agent. No Linear or GitHub Issues', mark: 'partial', cite: ['harnss-advanced-settings', 'harnss-app-settings', 'harnss-jira-board', 'harnss-jira-types'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Agents run on the computer in front of you; the maker plans a local-network web remote in an open issue', mark: 'no', cite: ['harnss-readme', 'harnss-issue-17'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Updates itself from GitHub Releases, with pre-releases opt-in; ACP agents from the registry also update in the background', mark: 'yes', cite: ['harnss-release-0-3-0', 'harnss-release-0-22-0-beta-1', 'harnss-release-0-18-0'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Imports and resumes Claude Code CLI sessions; importing from Codex or other agents is not documented', mark: 'partial', cite: ['harnss-readme'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Full-text search of session titles and message text', mark: 'yes', cite: ['harnss-readme'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Harnss takes a different route per engine: Claude Code through Anthropic’s <strong>Claude Agent SDK</strong>, Codex through <code>codex app-server</code> over JSON-RPC, and every other agent over the Agent Client Protocol on stdio, installed from the ACP Agent Registry or set up as a custom command. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, natively or through an adapter.',
			cite: ['harnss-claude-sessions', 'harnss-codex-sessions', 'harnss-acp-sessions', 'harnss-readme', 'splash-registry', 'acp']
		},
		{
			title: 'Worktrees',
			text: 'In Harnss you create, remove and prune git worktrees from the Git panel, and a per-project selector points sessions at one; the 0.22 pre-releases add a worktree bar above the composer and setup commands read from <code>.harnss/worktree.json</code>. Splash works in the project folder or gives a session its own worktree on its own branch, and runs no setup scripts.',
			cite: ['harnss-release-0-8-0', 'harnss-release-0-22-0-beta-1', 'harnss-git-ipc', 'splash-features', 'splash-worktree']
		},
		{
			title: 'Platforms and where it runs',
			text: 'Harnss, an Electron app, ships x64 and ARM builds for macOS, Windows and Linux and runs agents on the computer in front of you; a local-network remote is planned in an open issue. Splash, written in Rust, builds for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64, and <code>splash-server</code> runs it on a machine you reach over SSH.',
			cite: ['harnss-package', 'harnss-readme', 'harnss-release-0-22-0-beta-2', 'harnss-issue-17', 'splash-how', 'splash-install', 'splash-server']
		},
		{
			title: 'Around the chat',
			text: 'Harnss surrounds the chat with an embedded browser, per-project MCP servers with OAuth, a Jira board preview, voice input via macOS dictation or on-device Whisper, and image annotation; the 0.22 pre-releases add split view for up to four chats and chat folders. Splash builds around its sessions: a Needs attention queue, a review screen, transcript search and a GitHub view.',
			cite: ['harnss-readme', 'harnss-advanced-settings', 'harnss-release-0-22-0-beta-1', 'splash-features', 'splash-github']
		}
	],
	fit: {
		splash: [
			'You want every agent, Claude Code and Codex included, driven over the Agent Client Protocol.',
			'You want to give each session its own git worktree and branch.',
			'You want one Needs attention queue for permission requests and finished turns across sessions.',
			'You want a GitHub view of issues, pull requests and Actions runs, or to reach your own server through splash-server.'
		],
		other: [
			'You want Claude Code run through Anthropic’s Claude Agent SDK and Codex through its app server, alongside ACP agents from a registry.',
			'You want a built-in browser, per-project MCP servers with OAuth and voice input next to the chat.',
			'You want builds for Windows and Linux on ARM, and an app that updates itself.',
			'You want to import and resume Claude Code CLI sessions and roll Claude’s file changes back to a checkpoint.'
		]
	},
	sources: [
		{ id: 'harnss-repo', title: 'OpenSource03/harnss', url: 'https://github.com/OpenSource03/harnss', publisher: 'OpenSource03/harnss on GitHub', checked: '2026-10-10' },
		{ id: 'harnss-readme', title: 'README.md', url: 'https://github.com/OpenSource03/harnss/blob/master/README.md', publisher: 'OpenSource03/harnss on GitHub', checked: '2026-10-10' },
		{ id: 'harnss-license', title: 'LICENSE', url: 'https://github.com/OpenSource03/harnss/blob/master/LICENSE', publisher: 'OpenSource03/harnss on GitHub', checked: '2026-10-10' },
		{ id: 'harnss-package', title: 'package.json', url: 'https://github.com/OpenSource03/harnss/blob/master/package.json', publisher: 'OpenSource03/harnss on GitHub', checked: '2026-10-10' },
		{ id: 'harnss-funding', title: '.github/FUNDING.yml', url: 'https://github.com/OpenSource03/harnss/blob/master/.github/FUNDING.yml', publisher: 'OpenSource03/harnss on GitHub', checked: '2026-10-10' },
		{ id: 'harnss-release-0-22-0-beta-2', title: 'v0.22.0-beta.2: Thinking Previews, Smart Notifications & Project Drag-and-Drop', url: 'https://github.com/OpenSource03/harnss/releases/tag/v0.22.0-beta.2', publisher: 'OpenSource03/harnss on GitHub', checked: '2026-10-10' },
		{ id: 'harnss-release-0-22-0-beta-1', title: 'v0.22.0-beta.1: Split View, Chat Folders & Glass Tinting', url: 'https://github.com/OpenSource03/harnss/releases/tag/v0.22.0-beta.1', publisher: 'OpenSource03/harnss on GitHub', checked: '2026-10-10' },
		{ id: 'harnss-release-0-21-5', title: '0.21.5', url: 'https://github.com/OpenSource03/harnss/releases/tag/v0.21.5', publisher: 'OpenSource03/harnss on GitHub', checked: '2026-10-10' },
		{ id: 'harnss-release-0-18-0', title: 'v0.18.0: UI polish, Bottom Tool Panels, Error Tracking & ACP Improvements', url: 'https://github.com/OpenSource03/harnss/releases/tag/v0.18.0', publisher: 'OpenSource03/harnss on GitHub', checked: '2026-10-10' },
		{ id: 'harnss-release-0-16-2', title: 'v0.16.2: Claude Binary Resolution, Performance Improvements', url: 'https://github.com/OpenSource03/harnss/releases/tag/v0.16.2', publisher: 'OpenSource03/harnss on GitHub', checked: '2026-10-10' },
		{ id: 'harnss-release-0-14-3', title: 'v0.14.3: Codex Utility Prompts, ACP Tasks & Browser Redesign', url: 'https://github.com/OpenSource03/harnss/releases/tag/v0.14.3', publisher: 'OpenSource03/harnss on GitHub', checked: '2026-10-10' },
		{ id: 'harnss-release-0-14-2', title: 'v0.14.2: Codex Engine Config, Auth Flow & Settings Refresh', url: 'https://github.com/OpenSource03/harnss/releases/tag/v0.14.2', publisher: 'OpenSource03/harnss on GitHub', checked: '2026-10-10' },
		{ id: 'harnss-release-0-11-0', title: 'v0.11.0: Light Mode, Appearance Settings & Flat Layout', url: 'https://github.com/OpenSource03/harnss/releases/tag/v0.11.0', publisher: 'OpenSource03/harnss on GitHub', checked: '2026-10-10' },
		{ id: 'harnss-release-0-10-0', title: 'v0.10.0: Harnss Rebrand, Plan Mode & UI Polish', url: 'https://github.com/OpenSource03/harnss/releases/tag/v0.10.0', publisher: 'OpenSource03/harnss on GitHub', checked: '2026-10-10' },
		{ id: 'harnss-release-0-8-0', title: 'v0.8.0: Git Worktrees, ACP Utility Sessions & Streaming Polish', url: 'https://github.com/OpenSource03/harnss/releases/tag/v0.8.0', publisher: 'OpenSource03/harnss on GitHub', checked: '2026-10-10' },
		{ id: 'harnss-release-0-5-0', title: 'v0.5.0', url: 'https://github.com/OpenSource03/harnss/releases/tag/v0.5.0', publisher: 'OpenSource03/harnss on GitHub', checked: '2026-10-10' },
		{ id: 'harnss-release-0-3-0', title: 'v0.3.0: Syntax Highlighting, Background Permissions & Windows Support', url: 'https://github.com/OpenSource03/harnss/releases/tag/v0.3.0', publisher: 'OpenSource03/harnss on GitHub', checked: '2026-10-10' },
		{ id: 'harnss-issue-17', title: '[Feature]: Remote Control (#17)', url: 'https://github.com/OpenSource03/harnss/issues/17', publisher: 'OpenSource03/harnss on GitHub', checked: '2026-10-10' },
		{ id: 'harnss-issue-36', title: '[Feature]: Add Proper Signing (#36)', url: 'https://github.com/OpenSource03/harnss/issues/36', publisher: 'OpenSource03/harnss on GitHub', checked: '2026-10-10' },
		{ id: 'harnss-claude-sessions', title: 'electron/src/ipc/claude-sessions.ts', url: 'https://github.com/OpenSource03/harnss/blob/master/electron/src/ipc/claude-sessions.ts', publisher: 'OpenSource03/harnss on GitHub', checked: '2026-10-10' },
		{ id: 'harnss-codex-sessions', title: 'electron/src/ipc/codex-sessions.ts', url: 'https://github.com/OpenSource03/harnss/blob/master/electron/src/ipc/codex-sessions.ts', publisher: 'OpenSource03/harnss on GitHub', checked: '2026-10-10' },
		{ id: 'harnss-acp-sessions', title: 'electron/src/ipc/acp-sessions.ts', url: 'https://github.com/OpenSource03/harnss/blob/master/electron/src/ipc/acp-sessions.ts', publisher: 'OpenSource03/harnss on GitHub', checked: '2026-10-10' },
		{ id: 'harnss-codex-auth', title: 'src/components/CodexAuthDialog.tsx', url: 'https://github.com/OpenSource03/harnss/blob/master/src/components/CodexAuthDialog.tsx', publisher: 'OpenSource03/harnss on GitHub', checked: '2026-10-10' },
		{ id: 'harnss-git-ipc', title: 'electron/src/ipc/git.ts', url: 'https://github.com/OpenSource03/harnss/blob/master/electron/src/ipc/git.ts', publisher: 'OpenSource03/harnss on GitHub', checked: '2026-10-10' },
		{ id: 'harnss-worktree-bar', title: 'src/components/WorktreeBar.tsx', url: 'https://github.com/OpenSource03/harnss/blob/master/src/components/WorktreeBar.tsx', publisher: 'OpenSource03/harnss on GitHub', checked: '2026-10-10' },
		{ id: 'harnss-advanced-settings', title: 'src/components/settings/AdvancedSettings.tsx', url: 'https://github.com/OpenSource03/harnss/blob/master/src/components/settings/AdvancedSettings.tsx', publisher: 'OpenSource03/harnss on GitHub', checked: '2026-10-10' },
		{ id: 'harnss-app-settings', title: 'electron/src/lib/app-settings.ts', url: 'https://github.com/OpenSource03/harnss/blob/master/electron/src/lib/app-settings.ts', publisher: 'OpenSource03/harnss on GitHub', checked: '2026-10-10' },
		{ id: 'harnss-jira-board', title: 'src/hooks/useJiraBoard.ts', url: 'https://github.com/OpenSource03/harnss/blob/master/src/hooks/useJiraBoard.ts', publisher: 'OpenSource03/harnss on GitHub', checked: '2026-10-10' },
		{ id: 'harnss-jira-types', title: 'shared/types/jira.ts', url: 'https://github.com/OpenSource03/harnss/blob/master/shared/types/jira.ts', publisher: 'OpenSource03/harnss on GitHub', checked: '2026-10-10' }
	]
};
