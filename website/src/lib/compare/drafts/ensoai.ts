// Splash vs EnsoAI. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const ENSOAI: Comparison = {
	slug: 'ensoai',
	name: 'EnsoAI',
	description: 'How Splash and EnsoAI compare on agents, platforms, licensing, worktrees, review and remote access, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and EnsoAI are free, open-source desktop apps for running several coding agents at once, with git worktrees to keep their work apart. EnsoAI, an Electron app, opens each agent’s own command-line interface in a terminal beside an editor and Git tools. Splash, a Rust app, drives agents over the Agent Client Protocol and shows each session as a transcript.',
	other: {
		name: 'EnsoAI',
		url: 'https://enso.j3.do/',
		maker: 'J3n5en',
		summary: 'An Electron desktop app that gives each task its own git worktree, with agent CLIs running in terminals, a code editor and source control. Its maker now recommends the successor, EnsoCode, to new users.',
		cite: ['ensoai-home', 'ensoai-readme']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app, pitched as a Git worktree manager plus AI programming assistant, with an English and Chinese interface', cite: ['ensoai-home', 'ensoai-i18n'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v0.2.45 (11 August 2026); the site labels v0.2 a beta, and the README recommends its successor, EnsoCode, to new users', cite: ['ensoai-v0-2-45', 'ensoai-home', 'ensoai-readme'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (MIT)', cite: ['ensoai-license', 'ensoai-readme'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free download from GitHub Releases; no prices or paid plans are published', cite: ['ensoai-readme'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon, Intel), Windows x64 with WSL shell support, Linux x64 (AppImage, .deb); Homebrew, Scoop and Winget', cite: ['ensoai-v0-2-45', 'ensoai-electron-builder', 'ensoai-v0-1-3', 'ensoai-readme'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Electron, React 19 and TypeScript, with Monaco, xterm.js, node-pty, simple-git and SQLite', cite: ['ensoai-readme', 'ensoai-architecture'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Nine built in (Claude Code, Codex, Gemini, Cursor Agent, Droid, Auggie, OpenCode, Pi, OMP), plus any CLI agent you add', cite: ['ensoai-cli-detector', 'ensoai-readme', 'ensoai-v0-2-45', 'ensoai-v0-2-9'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each agent’s own interactive CLI in a terminal (node-pty, xterm.js), chosen over ACP; Claude Code also gets a WebSocket IDE bridge', cite: ['ensoai-agent-terminal', 'ensoai-readme', 'ensoai-agent-command', 'ensoai-architecture'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Runs the CLIs you installed and signed in to; it can also switch Claude Code’s API provider (base URL and token)', cite: ['ensoai-readme', 'ensoai-i18n'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'No EnsoAI account is mentioned; GitHub PR features need a signed-in gh CLI, and Hapi sharing an access token', cite: ['ensoai-readme', 'ensoai-git-service', 'ensoai-hapi-settings'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Not documented; each agent runs as its own CLI in a terminal, and Claude Code’s questions raise a notification', mark: 'unknown', cite: ['ensoai-pr-432', 'ensoai-agent-terminal', 'ensoai-v0-2-30'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Edits Claude Code’s MCP servers in ~/.claude.json, plus its plugins and CLAUDE.md; no MCP settings for other agents are documented', mark: 'partial', cite: ['ensoai-architecture', 'ensoai-i18n'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A git worktree per task from a new or existing branch, with its own agents, terminals and editor state', mark: 'yes', cite: ['ensoai-readme'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'A per-repository Init Script runs shell commands when a worktree is created; port and dev-server handling aren’t documented', mark: 'yes', cite: ['ensoai-i18n', 'ensoai-v0-2-14'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'Terminal tabs beside the agent tabs in each worktree, splittable into panes, with 400+ Ghostty themes', mark: 'yes', cite: ['ensoai-readme', 'ensoai-i18n'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'An Agent Tasks panel shows each agent session’s status and opens it on click; a Running Projects list shows busy worktrees', mark: 'yes', cite: ['ensoai-pr-432', 'ensoai-agent-task-types', 'ensoai-running-projects'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'System notifications when an agent goes idle or stops output; for Claude Code, hooks catch finished turns and questions (needs Node.js)', mark: 'yes', cite: ['ensoai-i18n', 'ensoai-hook-manager', 'ensoai-v0-2-30'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Source-control panel with staging, history and diffs; line comments from a diff review go to the agent’s terminal; AI code review', mark: 'yes', cite: ['ensoai-readme', 'ensoai-diff-review', 'ensoai-editor-comment'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'Monaco editor (50+ languages), a 3-way merge editor, project-wide search and Open In for Cursor, VS Code and others', mark: 'yes', cite: ['ensoai-readme', 'ensoai-home'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'No PR creation is documented; the app pushes, pulls, publishes branches and merges branches locally', mark: 'no', cite: ['ensoai-git-service', 'ensoai-i18n', 'ensoai-readme'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Through the gh CLI: lists open pull requests, opens a worktree from one and detects squash-merged branches; CI status isn’t documented', mark: 'yes', cite: ['ensoai-git-service', 'ensoai-v0-2-7', 'ensoai-v0-2-28'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'None documented; a local Todo board can start an agent from a task card and run queued tasks automatically', mark: 'no', cite: ['ensoai-v0-2-34', 'ensoai-v0-2-38', 'ensoai-i18n'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Through the third-party Hapi, which shares agent sessions over web and Telegram, optionally via Cloudflare Tunnel; Happy can also run agents', mark: 'partial', cite: ['ensoai-i18n', 'ensoai-v0-2-2', 'ensoai-hapi-settings'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Updates itself from GitHub Releases; automatic updates can be turned off since v0.2.14', mark: 'yes', cite: ['ensoai-electron-builder', 'ensoai-v0-2-14'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Sessions started outside the app', splash: S.history, other: { text: 'Sessions persist per worktree; since v0.2.45, Codex tabs can browse and resume local Codex sessions, including ones started elsewhere', mark: 'partial', cite: ['ensoai-readme', 'ensoai-i18n', 'ensoai-codex-history', 'ensoai-v0-2-45'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Not documented; project-wide search finds files by name or content', mark: 'no', cite: ['ensoai-home', 'ensoai-readme'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'EnsoAI opens each agent’s own interactive CLI in a terminal; its README explains choosing native CLIs over ACP. Claude Code gets extra wiring: an IDE bridge, optional tmux and hooks for notifications. Commit messages and AI reviews come from headless runs such as <code>claude -p</code>. Splash talks to every agent over the <strong>Agent Client Protocol</strong>, natively or through an adapter.',
			cite: ['ensoai-agent-terminal', 'ensoai-readme', 'ensoai-agent-command', 'ensoai-architecture', 'ensoai-hook-manager', 'ensoai-providers', 'splash-registry', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'EnsoAI runs agents on your computer, in your shell or, on Windows, optionally a WSL shell. Remote use goes through the third-party <strong>Hapi</strong>, which shares sessions over the web and Telegram; SSH workspaces shipped in v0.2.39 and were reverted before v0.2.40. Splash runs agents locally or under <code>splash-server</code>, which you reach from a browser over an SSH tunnel.',
			cite: ['ensoai-agent-terminal', 'ensoai-v0-1-3', 'ensoai-i18n', 'ensoai-v0-2-39', 'ensoai-revert-380', 'splash-readme', 'splash-server']
		},
		{
			title: 'A workspace or a conversation',
			text: 'EnsoAI pairs agent terminals with IDE-style tools: a Monaco editor, a 3-way merge editor, source control, project search and a Todo board that starts agents. Its README pitches it for small and medium projects, beside a full IDE for monorepos. Splash centers on the conversation: a transcript, a <strong>Needs attention</strong> queue, a review screen, transcript search and a GitHub view.',
			cite: ['ensoai-readme', 'ensoai-home', 'ensoai-v0-2-34', 'splash-features', 'splash-github']
		},
		{
			title: 'Release line and successor',
			text: 'Both are free and MIT-licensed. EnsoAI’s site labels v0.2 a beta, and v0.2.45, from 11 August 2026, is the latest release. Its README names <strong>EnsoCode</strong>, a separate local-first workbench, as the successor and recommends it to new users; enso.j3.do now opens on EnsoCode. This page covers EnsoAI. Splash is in early development, with releases on GitHub.',
			cite: ['ensoai-license', 'ensoai-home', 'ensoai-v0-2-45', 'ensoai-readme', 'splash-license', 'splash-download', 'splash-readme', 'splash-releases']
		}
	],
	fit: {
		splash: [
			'You want every agent driven over the Agent Client Protocol and shown as one transcript.',
			'You want permission requests answered in the app and gathered in one Needs attention queue.',
			'You want to import conversations your agents started outside the app and search their transcripts.',
			'You want to run sessions on your own server over SSH, or triage GitHub issues, pull requests and Actions runs.'
		],
		other: [
			'You want each agent’s own CLI in a terminal, with nine agents built in and room to add any other.',
			'You want a code editor, a 3-way merge editor and source control with staging beside your agents.',
			'You want an init script for every new worktree and a Todo board that starts agents from task cards.',
			'You want an app that updates itself, installs through Homebrew, Scoop or Winget, and has an English and Chinese interface.'
		]
	},
	sources: [
		{ id: 'ensoai-home', title: 'EnsoCode — One Developer, An Entire Agent Fleet (EnsoAI tab)', url: 'https://enso.j3.do/', publisher: 'J3n5en', checked: '2026-10-10' },
		{ id: 'ensoai-readme', title: 'README.md', url: 'https://github.com/J3n5en/EnsoAI/blob/main/README.md', publisher: 'J3n5en/EnsoAI on GitHub', checked: '2026-10-10' },
		{ id: 'ensoai-license', title: 'LICENSE', url: 'https://github.com/J3n5en/EnsoAI/blob/main/LICENSE', publisher: 'J3n5en/EnsoAI on GitHub', checked: '2026-10-10' },
		{ id: 'ensoai-architecture', title: 'docs/architecture.md', url: 'https://github.com/J3n5en/EnsoAI/blob/main/docs/architecture.md', publisher: 'J3n5en/EnsoAI on GitHub', checked: '2026-10-10' },
		{ id: 'ensoai-electron-builder', title: 'electron-builder.yml', url: 'https://github.com/J3n5en/EnsoAI/blob/main/electron-builder.yml', publisher: 'J3n5en/EnsoAI on GitHub', checked: '2026-10-10' },
		{ id: 'ensoai-i18n', title: 'src/shared/i18n.ts', url: 'https://github.com/J3n5en/EnsoAI/blob/main/src/shared/i18n.ts', publisher: 'J3n5en/EnsoAI on GitHub', checked: '2026-10-10' },
		{ id: 'ensoai-cli-detector', title: 'src/main/services/cli/CliDetector.ts', url: 'https://github.com/J3n5en/EnsoAI/blob/main/src/main/services/cli/CliDetector.ts', publisher: 'J3n5en/EnsoAI on GitHub', checked: '2026-10-10' },
		{ id: 'ensoai-agent-terminal', title: 'src/renderer/components/chat/AgentTerminal.tsx', url: 'https://github.com/J3n5en/EnsoAI/blob/main/src/renderer/components/chat/AgentTerminal.tsx', publisher: 'J3n5en/EnsoAI on GitHub', checked: '2026-10-10' },
		{ id: 'ensoai-agent-command', title: 'src/renderer/lib/agentCommand.ts', url: 'https://github.com/J3n5en/EnsoAI/blob/main/src/renderer/lib/agentCommand.ts', publisher: 'J3n5en/EnsoAI on GitHub', checked: '2026-10-10' },
		{ id: 'ensoai-providers', title: 'src/main/services/ai/providers.ts', url: 'https://github.com/J3n5en/EnsoAI/blob/main/src/main/services/ai/providers.ts', publisher: 'J3n5en/EnsoAI on GitHub', checked: '2026-10-10' },
		{ id: 'ensoai-hapi-settings', title: 'src/renderer/components/settings/HapiSettings.tsx', url: 'https://github.com/J3n5en/EnsoAI/blob/main/src/renderer/components/settings/HapiSettings.tsx', publisher: 'J3n5en/EnsoAI on GitHub', checked: '2026-10-10' },
		{ id: 'ensoai-git-service', title: 'src/main/services/git/GitService.ts', url: 'https://github.com/J3n5en/EnsoAI/blob/main/src/main/services/git/GitService.ts', publisher: 'J3n5en/EnsoAI on GitHub', checked: '2026-10-10' },
		{ id: 'ensoai-hook-manager', title: 'src/main/services/claude/ClaudeHookManager.ts', url: 'https://github.com/J3n5en/EnsoAI/blob/main/src/main/services/claude/ClaudeHookManager.ts', publisher: 'J3n5en/EnsoAI on GitHub', checked: '2026-10-10' },
		{ id: 'ensoai-diff-review', title: 'src/renderer/components/source-control/DiffReviewModal.tsx', url: 'https://github.com/J3n5en/EnsoAI/blob/main/src/renderer/components/source-control/DiffReviewModal.tsx', publisher: 'J3n5en/EnsoAI on GitHub', checked: '2026-10-10' },
		{ id: 'ensoai-editor-comment', title: 'src/renderer/components/files/EditorLineComment.tsx', url: 'https://github.com/J3n5en/EnsoAI/blob/main/src/renderer/components/files/EditorLineComment.tsx', publisher: 'J3n5en/EnsoAI on GitHub', checked: '2026-10-10' },
		{ id: 'ensoai-agent-task-types', title: 'src/shared/types/agentTask.ts', url: 'https://github.com/J3n5en/EnsoAI/blob/main/src/shared/types/agentTask.ts', publisher: 'J3n5en/EnsoAI on GitHub', checked: '2026-10-10' },
		{ id: 'ensoai-running-projects', title: 'src/renderer/components/layout/RunningProjectsPopover.tsx', url: 'https://github.com/J3n5en/EnsoAI/blob/main/src/renderer/components/layout/RunningProjectsPopover.tsx', publisher: 'J3n5en/EnsoAI on GitHub', checked: '2026-10-10' },
		{ id: 'ensoai-codex-history', title: 'src/main/services/codex/CodexHistoryService.ts', url: 'https://github.com/J3n5en/EnsoAI/blob/main/src/main/services/codex/CodexHistoryService.ts', publisher: 'J3n5en/EnsoAI on GitHub', checked: '2026-10-10' },
		{ id: 'ensoai-pr-432', title: 'feat: 添加 Agent 任务列表面板 (#432)', url: 'https://github.com/J3n5en/EnsoAI/pull/432', publisher: 'J3n5en/EnsoAI on GitHub', checked: '2026-10-10' },
		{ id: 'ensoai-revert-380', title: 'Revert "feat(remote): 添加 SSH 远程工作区与远端执行链路 (#380)"', url: 'https://github.com/J3n5en/EnsoAI/commit/70f10f8bb9c1e516afe8a7bad6fc7adfc2e5eaa6', publisher: 'J3n5en/EnsoAI on GitHub', checked: '2026-10-10' },
		{ id: 'ensoai-v0-2-45', title: 'Release 0.2.45', url: 'https://github.com/J3n5en/EnsoAI/releases/tag/v0.2.45', publisher: 'J3n5en/EnsoAI on GitHub', checked: '2026-10-10' },
		{ id: 'ensoai-v0-2-39', title: 'Release v0.2.39', url: 'https://github.com/J3n5en/EnsoAI/releases/tag/v0.2.39', publisher: 'J3n5en/EnsoAI on GitHub', checked: '2026-10-10' },
		{ id: 'ensoai-v0-2-38', title: 'Release 0.2.38', url: 'https://github.com/J3n5en/EnsoAI/releases/tag/v0.2.38', publisher: 'J3n5en/EnsoAI on GitHub', checked: '2026-10-10' },
		{ id: 'ensoai-v0-2-34', title: 'Release 0.2.34', url: 'https://github.com/J3n5en/EnsoAI/releases/tag/v0.2.34', publisher: 'J3n5en/EnsoAI on GitHub', checked: '2026-10-10' },
		{ id: 'ensoai-v0-2-30', title: 'Release v0.2.30', url: 'https://github.com/J3n5en/EnsoAI/releases/tag/v0.2.30', publisher: 'J3n5en/EnsoAI on GitHub', checked: '2026-10-10' },
		{ id: 'ensoai-v0-2-28', title: 'Release v0.2.28', url: 'https://github.com/J3n5en/EnsoAI/releases/tag/v0.2.28', publisher: 'J3n5en/EnsoAI on GitHub', checked: '2026-10-10' },
		{ id: 'ensoai-v0-2-14', title: 'Release v0.2.14', url: 'https://github.com/J3n5en/EnsoAI/releases/tag/v0.2.14', publisher: 'J3n5en/EnsoAI on GitHub', checked: '2026-10-10' },
		{ id: 'ensoai-v0-2-9', title: 'Release v0.2.9', url: 'https://github.com/J3n5en/EnsoAI/releases/tag/v0.2.9', publisher: 'J3n5en/EnsoAI on GitHub', checked: '2026-10-10' },
		{ id: 'ensoai-v0-2-7', title: 'Release v0.2.7', url: 'https://github.com/J3n5en/EnsoAI/releases/tag/v0.2.7', publisher: 'J3n5en/EnsoAI on GitHub', checked: '2026-10-10' },
		{ id: 'ensoai-v0-2-2', title: 'Release v0.2.2', url: 'https://github.com/J3n5en/EnsoAI/releases/tag/v0.2.2', publisher: 'J3n5en/EnsoAI on GitHub', checked: '2026-10-10' },
		{ id: 'ensoai-v0-1-3', title: 'Release v0.1.3', url: 'https://github.com/J3n5en/EnsoAI/releases/tag/v0.1.3', publisher: 'J3n5en/EnsoAI on GitHub', checked: '2026-10-10' }
	]
};
