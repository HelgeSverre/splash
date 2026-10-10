// Splash vs Nezha. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const NEZHA: Comparison = {
	slug: 'nezha',
	name: 'Nezha',
	description: 'How Splash and Nezha compare on agents, platforms, licensing, worktrees, review and session history, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Nezha are free, open-source desktop apps that run several coding agents at once, each in its project folder or its own git worktree. Nezha runs Claude Code and Codex in their own terminal interfaces, inside an IDE with an editor and Git tools. Splash drives agents over the Agent Client Protocol and shows each session as a transcript.',
	other: {
		name: 'Nezha',
		url: 'https://nezha.hanshutx.com/',
		maker: 'hanshuaikang',
		summary: 'A Tauri desktop app, pitched as a lightweight AI-native IDE, that runs Claude Code and Codex in terminals across several projects, with optional git worktrees, a code editor, Git tools and a Kanban board.',
		cite: ['nezha-home', 'nezha-repo', 'nezha-readme', 'nezha-i18n']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app pitched as a lightweight AI-native IDE, in English and Chinese; no web, mobile or server version', cite: ['nezha-home', 'nezha-i18n', 'nezha-v0-5-0-assets'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v0.5.0 (17 September 2026); 22 releases in all, starting with v0.1.0 in April 2026; none is labeled beta or alpha', cite: ['nezha-v0-5-0', 'nezha-releases', 'nezha-v0-1-0', 'nezha-readme', 'nezha-home'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (GPL-3.0)', cite: ['nezha-license', 'nezha-repo'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free; the site invites optional sponsorship through Afdian', cite: ['nezha-home'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon, Intel; unsigned), Windows x64 and arm64, Linux x86_64 (.deb, .rpm); no AppImage or Linux arm64', cite: ['nezha-v0-5-0-assets', 'nezha-home', 'nezha-release-workflow', 'nezha-readme'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Tauri 2 and Rust, with a React 19, TypeScript and Vite frontend, xterm.js and Shiki', cite: ['nezha-agents-md'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code and OpenAI Codex CLI, each with a configurable binary path', cite: ['nezha-config', 'nezha-readme', 'nezha-i18n'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each agent’s own CLI in a pseudo-terminal shown with xterm.js, launched with permission, model and effort flags; no ACP', cite: ['nezha-pty', 'nezha-readme', 'nezha-home'] } },
				{ label: 'Model and mode pickers', splash: S.models, other: { text: 'Model and thinking-depth pickers on each new task; you edit the model list in settings, and it accepts provider model IDs', mark: 'yes', cite: ['nezha-i18n', 'nezha-pty'] } },
				{ label: 'Agent sign-in', splash: S.signIn, other: { text: 'Runs your installed Claude Code or Codex with its login; a usage display reads Claude’s token from the macOS Keychain', cite: ['nezha-readme', 'nezha-usage'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'No Nezha account or sign-up is mentioned', cite: ['nezha-readme'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Answered in the agent’s own terminal; tasks start in ask, auto-edit or full-access mode, which map to CLI flags', mark: 'yes', cite: ['nezha-pty', 'nezha-config', 'nezha-readme'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'None documented; a skill manager installs your local skills into a project for Claude Code or Codex by symlink', mark: 'no', cite: ['nezha-readme', 'nezha-i18n', 'nezha-v0-5-0'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Per task: the project checkout, or a new git worktree and branch under .nezha/worktrees in the repository', mark: 'yes', cite: ['nezha-git', 'nezha-i18n', 'nezha-config'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'None documented; project config sets the default agent, permission mode, a prompt prefix and commit options', mark: 'no', cite: ['nezha-config'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'Agents run in PTY terminals; a shell panel holds several terminals and can open one for a worktree', mark: 'yes', cite: ['nezha-home', 'nezha-v0-2-2', 'nezha-v0-4-5'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Hook-driven task statuses such as Needs confirmation, and a cross-project Kanban board with a Needs attention column', mark: 'yes', cite: ['nezha-i18n', 'nezha-hooks-doc', 'nezha-readme'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'System notifications plus an app badge when an agent needs input; the hooks behind them need Node.js 18+', mark: 'yes', cite: ['nezha-readme', 'nezha-i18n', 'nezha-hooks'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'A review view with unified or split diffs and stage, unstage or discard; feedback to the agent isn’t documented', mark: 'yes', cite: ['nezha-readme', 'nezha-v0-3-2', 'nezha-i18n'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'File explorer, a code editor with Shiki highlighting for 100+ languages, and a Markdown editor with preview', mark: 'yes', cite: ['nezha-home', 'nezha-readme'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'No PR creation is documented; Nezha commits with AI-written messages, pushes, pulls and merges worktree branches locally', mark: 'no', cite: ['nezha-home', 'nezha-git'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'No GitHub API, pull request or CI status integration is documented; Git runs locally, plus push and pull', mark: 'no', cite: ['nezha-home'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'Agents run on your own machine; no cloud execution is documented', mark: 'no', cite: ['nezha-repo'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'No SSH, remote machine or web access is documented', mark: 'no', cite: ['nezha-repo'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Sessions started outside the app', splash: S.history, other: { text: 'No import of sessions started elsewhere is documented; sessions of tasks Nezha launched can be replayed, resumed, pinned and exported as Markdown', mark: 'no', cite: ['nezha-i18n', 'nezha-readme'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Task search matches prompt text and the Search panel finds files; transcript search isn’t documented', mark: 'no', cite: ['nezha-tasklist', 'nezha-i18n'] } },
				{ label: 'Fork a conversation', splash: S.fork, other: { text: 'Forks a session into a new task since v0.4.6; not yet available for worktree tasks', mark: 'partial', cite: ['nezha-v0-4-6', 'nezha-i18n'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Nezha starts Claude Code or Codex in a pseudo-terminal and reads task status from hook scripts it installs; for Codex they sit in a marked block of the global <code>~/.codex/config.toml</code>. The hooks need Node.js 18+ plus Claude Code 2.1.87+ or Codex 0.131.0+; otherwise Nezha polls. Splash talks to every agent over the <strong>Agent Client Protocol</strong>, natively or through an adapter.',
			cite: ['nezha-pty', 'nezha-hooks-doc', 'nezha-hooks', 'nezha-i18n', 'splash-registry', 'acp']
		},
		{
			title: 'Two agents or many',
			text: 'Nezha supports two agents, Claude Code and Codex; its project config accepts no other default. Besides the terminal sessions, it runs both headless to title tasks and draft commit messages. Splash ships launch commands for more agents, among them Gemini, Copilot, OpenCode and Goose, and shows all of them in the same transcript view.',
			cite: ['nezha-config', 'nezha-agent-assist', 'nezha-git', 'splash-registry', 'splash-agents', 'splash-how']
		},
		{
			title: 'An IDE or a session manager',
			text: 'Nezha wraps agents in an IDE: a file explorer, a code and Markdown editor, staging, commits, push and pull, and a Kanban board and timeline across projects. Splash centers on the conversation: a transcript, a <strong>Needs attention</strong> queue, a review screen with a feedback box, transcript search and a GitHub view of issues, pull requests and Actions runs.',
			cite: ['nezha-home', 'nezha-readme', 'nezha-i18n', 'splash-features', 'splash-github']
		},
		{
			title: 'Platforms and where agents run',
			text: 'Nezha ships desktop installers: unsigned macOS builds for Apple silicon and Intel, Windows x64 and arm64, and Linux x86_64 <code>.deb</code> and <code>.rpm</code> packages, with agents on your own machine. Splash builds for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64, and <code>splash-server</code> runs it on a machine you reach from a browser over an SSH tunnel.',
			cite: ['nezha-v0-5-0-assets', 'nezha-readme', 'nezha-repo', 'splash-install', 'splash-server']
		}
	],
	fit: {
		splash: [
			'You want agents beyond Claude Code and Codex, such as Gemini, Copilot or Goose, in one transcript view.',
			'You want to import sessions your agents started outside the app and search their transcripts.',
			'You want to run sessions on your own server and reach them from a browser over SSH.',
			'You want to send review feedback to the agent and triage GitHub issues, pull requests and Actions runs.'
		],
		other: [
			'You want each agent’s own terminal interface, with a code editor, a Markdown editor and Git tools in the same window.',
			'You want a Kanban board of tasks across several projects, with columns for in-progress tasks, tasks that need attention and tasks awaiting review.',
			'You want builds for Windows on arm64 or Linux packages in .rpm format.',
			'You want an interface in Chinese as well as English.'
		]
	},
	sources: [
		{ id: 'nezha-home', title: 'Nezha', url: 'https://nezha.hanshutx.com/', publisher: 'hanshuaikang', checked: '2026-10-10' },
		{ id: 'nezha-repo', title: 'hanshuaikang/nezha', url: 'https://github.com/hanshuaikang/nezha', publisher: 'hanshuaikang/nezha on GitHub', checked: '2026-10-10' },
		{ id: 'nezha-readme', title: 'README_EN.md', url: 'https://github.com/hanshuaikang/nezha/blob/main/README_EN.md', publisher: 'hanshuaikang/nezha on GitHub', checked: '2026-10-10' },
		{ id: 'nezha-i18n', title: 'src/i18n.tsx', url: 'https://github.com/hanshuaikang/nezha/blob/main/src/i18n.tsx', publisher: 'hanshuaikang/nezha on GitHub', checked: '2026-10-10' },
		{ id: 'nezha-v0-5-0', title: 'Release v0.5.0', url: 'https://github.com/hanshuaikang/nezha/releases/tag/v0.5.0', publisher: 'hanshuaikang/nezha on GitHub', checked: '2026-10-10' },
		{ id: 'nezha-releases', title: 'Releases', url: 'https://github.com/hanshuaikang/nezha/releases', publisher: 'hanshuaikang/nezha on GitHub', checked: '2026-10-10' },
		{ id: 'nezha-v0-5-0-assets', title: 'Release v0.5.0 assets', url: 'https://github.com/hanshuaikang/nezha/releases/expanded_assets/v0.5.0', publisher: 'hanshuaikang/nezha on GitHub', checked: '2026-10-10' },
		{ id: 'nezha-v0-1-0', title: 'Release v0.1.0', url: 'https://github.com/hanshuaikang/nezha/releases/tag/v0.1.0', publisher: 'hanshuaikang/nezha on GitHub', checked: '2026-10-10' },
		{ id: 'nezha-v0-2-2', title: 'Release v0.2.2', url: 'https://github.com/hanshuaikang/nezha/releases/tag/v0.2.2', publisher: 'hanshuaikang/nezha on GitHub', checked: '2026-10-10' },
		{ id: 'nezha-v0-3-2', title: 'Release v0.3.2', url: 'https://github.com/hanshuaikang/nezha/releases/tag/v0.3.2', publisher: 'hanshuaikang/nezha on GitHub', checked: '2026-10-10' },
		{ id: 'nezha-v0-4-5', title: 'Release v0.4.5', url: 'https://github.com/hanshuaikang/nezha/releases/tag/v0.4.5', publisher: 'hanshuaikang/nezha on GitHub', checked: '2026-10-10' },
		{ id: 'nezha-v0-4-6', title: 'Release v0.4.6', url: 'https://github.com/hanshuaikang/nezha/releases/tag/v0.4.6', publisher: 'hanshuaikang/nezha on GitHub', checked: '2026-10-10' },
		{ id: 'nezha-license', title: 'LICENSE', url: 'https://github.com/hanshuaikang/nezha/blob/main/LICENSE', publisher: 'hanshuaikang/nezha on GitHub', checked: '2026-10-10' },
		{ id: 'nezha-release-workflow', title: '.github/workflows/release-desktop.yml', url: 'https://github.com/hanshuaikang/nezha/blob/main/.github/workflows/release-desktop.yml', publisher: 'hanshuaikang/nezha on GitHub', checked: '2026-10-10' },
		{ id: 'nezha-agents-md', title: 'AGENTS.md', url: 'https://github.com/hanshuaikang/nezha/blob/main/AGENTS.md', publisher: 'hanshuaikang/nezha on GitHub', checked: '2026-10-10' },
		{ id: 'nezha-config', title: 'src-tauri/src/config.rs', url: 'https://github.com/hanshuaikang/nezha/blob/main/src-tauri/src/config.rs', publisher: 'hanshuaikang/nezha on GitHub', checked: '2026-10-10' },
		{ id: 'nezha-pty', title: 'src-tauri/src/pty.rs', url: 'https://github.com/hanshuaikang/nezha/blob/main/src-tauri/src/pty.rs', publisher: 'hanshuaikang/nezha on GitHub', checked: '2026-10-10' },
		{ id: 'nezha-usage', title: 'src-tauri/src/usage.rs', url: 'https://github.com/hanshuaikang/nezha/blob/main/src-tauri/src/usage.rs', publisher: 'hanshuaikang/nezha on GitHub', checked: '2026-10-10' },
		{ id: 'nezha-hooks', title: 'src-tauri/src/hooks.rs', url: 'https://github.com/hanshuaikang/nezha/blob/main/src-tauri/src/hooks.rs', publisher: 'hanshuaikang/nezha on GitHub', checked: '2026-10-10' },
		{ id: 'nezha-hooks-doc', title: 'knowledge/references/agent-hooks-support.md', url: 'https://github.com/hanshuaikang/nezha/blob/main/knowledge/references/agent-hooks-support.md', publisher: 'hanshuaikang/nezha on GitHub', checked: '2026-10-10' },
		{ id: 'nezha-git', title: 'src-tauri/src/git.rs', url: 'https://github.com/hanshuaikang/nezha/blob/main/src-tauri/src/git.rs', publisher: 'hanshuaikang/nezha on GitHub', checked: '2026-10-10' },
		{ id: 'nezha-agent-assist', title: 'src-tauri/src/agent_assist.rs', url: 'https://github.com/hanshuaikang/nezha/blob/main/src-tauri/src/agent_assist.rs', publisher: 'hanshuaikang/nezha on GitHub', checked: '2026-10-10' },
		{ id: 'nezha-tasklist', title: 'src/components/task-panel/TaskList.tsx', url: 'https://github.com/hanshuaikang/nezha/blob/main/src/components/task-panel/TaskList.tsx', publisher: 'hanshuaikang/nezha on GitHub', checked: '2026-10-10' }
	]
};
