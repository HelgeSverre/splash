// Splash vs Quack. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const QUACK: Comparison = {
	slug: 'quack',
	name: 'Quack',
	description: 'How Splash and Quack compare on agents, platforms, pricing, worktrees, review and remote use, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Quack are free, MIT-licensed desktop apps that run several coding agents at once and can give each piece of work its own git worktree. Quack, a macOS Electron app forked from Synara, has a separate adapter for each provider it supports; Splash, written in Rust, drives every agent over the Agent Client Protocol.',
	other: {
		name: 'Quack',
		url: 'https://www.quack.build/',
		maker: 'Alek Dobrohotov',
		summary: 'A free, open-source macOS workspace forked from Synara that runs nine coding CLIs plus a remote Companion, with git worktrees, diffs, pull requests, a browser agents drive and scheduled Automations.',
		cite: ['quack-readme', 'quack-release', 'quack-home']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Local-first desktop app that puts agent chats, terminals, a browser, diffs and git in one window', cite: ['quack-readme'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v2.0.0 (19 August 2026), a rebuild of the app first shipped in October 2025; the README says to expect bugs', cite: ['quack-release', 'quack-what-is', 'quack-readme'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (MIT), with copyright lines for T3 Code, Synara’s contributors and Quack', cite: ['quack-license', 'quack-home'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free, with paid consulting at 100 EUR an hour and optional donations; the site’s llms.txt still lists paid plans', cite: ['quack-home', 'quack-consultancy', 'quack-gumroad', 'quack-llms'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 12+ on Apple silicon, with no Intel Mac build; for Windows and Linux the site says to build from source', cite: ['quack-release', 'quack-home'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Electron, a local TypeScript server and a React web UI; a soft fork of Synara, itself begun from T3 Code', cite: ['quack-desktop-pkg', 'quack-desktop-main', 'quack-readme'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Codex, Claude Code, Cursor, Antigravity, Grok, Factory Droid, Kilo, OpenCode, Pi and Companion (a remote Astronaut client); adding others isn’t documented', cite: ['quack-release', 'quack-home', 'quack-astronaut-doc', 'quack-astronaut-remote', 'quack-contracts'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Per-provider adapters: Claude Agent SDK, codex app-server, ACP (Cursor, Droid, Grok), opencode/kilo serve, Pi SDK, agy CLI, HTTP (Companion)', cite: ['quack-claude-adapter', 'quack-codex-manager', 'quack-cursor-adapter', 'quack-droid-adapter', 'quack-grok-adapter', 'quack-opencode-runtime', 'quack-opencode-adapter', 'quack-pi-adapter', 'quack-antigravity-adapter', 'quack-astronaut-remote'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Each CLI’s own login and subscription, with no Quack account; Quack resells no model access and needs no extra API keys', cite: ['quack-home', 'quack-install', 'quack-readme'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Approval-required, Auto or Full access modes; Activity shows tasks awaiting input. Antigravity runs with its skip-permissions flag', mark: 'yes', cite: ['quack-changelog', 'quack-release', 'quack-antigravity-adapter'] } },
				{ label: 'Model and mode pickers', splash: S.models, other: { text: 'A provider per thread; Ducks are named presets with their own instructions, model and effort, switched within a thread', mark: 'yes', cite: ['quack-home', 'quack-readme'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'A built-in Agent Gateway gives supported agents tools to manage tasks; paired outside clients such as Claude Code can control Quack', mark: 'partial', cite: ['quack-changelog'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Your checkout or a new isolated git worktree per thread; no container or VM sandbox is documented', mark: 'yes', cite: ['quack-readme', 'quack-branch-toolbar'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Project actions can run on worktree creation; an Environment panel lists and stops dev servers. No port or .env handling documented', mark: 'yes', cite: ['quack-project-scripts', 'quack-changelog'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'An Activity inbox groups running, waiting, failed and finished tasks by urgency; OS notifications and a sound mark finished tasks', mark: 'yes', cite: ['quack-release', 'quack-task-completion'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'A visible browser agents drive with your tabs, cookies and logins; annotated page elements can go to the agent', mark: 'yes', cite: ['quack-release', 'quack-changelog'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Automations run recurring jobs on a schedule; the docs’ Background Tasks page still says Quack has no scheduler', mark: 'yes', cite: ['quack-readme', 'quack-docs-automations'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Agent Gateway tools let agents create and steer tasks; a thread can pass to another provider and keep its context', mark: 'yes', cite: ['quack-changelog', 'quack-readme'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'A diff panel and review file tree; file-preview line comments go to the agent; checkpoints undo files or roll back chats', mark: 'yes', cite: ['quack-readme', 'quack-changelog'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Branch, commit, push and open PRs in the app; generated PR text follows the repository’s .github template', mark: 'yes', cite: ['quack-readme', 'quack-changelog'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Through gh: a Pull Requests workspace with checks, reviewers, commits, diffs and comments; merges PRs and imports repos as projects', mark: 'yes', cite: ['quack-changelog', 'quack-github-cli', 'quack-release'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'Linear, with a personal API key: @-mention issues or open one as a draft. No Jira, GitLab or GitHub Issues documented', mark: 'partial', cite: ['quack-release', 'quack-linear-docs', 'quack-linear-feature'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Companion reaches a Quack on another machine; REMOTE.md covers serving a source-built server to browsers over LAN or Tailscale', mark: 'partial', cite: ['quack-release', 'quack-remote'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'A built-in updater downloads each release’s .zip from GitHub', mark: 'yes', cite: ['quack-release'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Import thread attaches a thread to a provider session started elsewhere; release notes mention imported Codex history and Droid session import', mark: 'yes', cite: ['quack-sidebar', 'quack-release', 'quack-changelog'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'A search palette over projects, threads and actions also matches message text; /export saves a thread as a ZIP', mark: 'yes', cite: ['quack-search-palette', 'quack-search-logic', 'quack-changelog'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Quack has a separate adapter per provider: the Claude Agent SDK for Claude Code, <code>codex app-server</code>, ACP for Cursor, Factory Droid and Grok, <code>opencode serve</code> for OpenCode and Kilo, the Pi SDK, Antigravity’s <code>agy</code> CLI and HTTP for Companion. Adding another agent isn’t documented. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, natively or through an adapter.',
			cite: ['quack-claude-adapter', 'quack-codex-manager', 'quack-cursor-adapter', 'quack-droid-adapter', 'quack-grok-adapter', 'quack-opencode-runtime', 'quack-opencode-adapter', 'quack-pi-adapter', 'quack-antigravity-adapter', 'quack-astronaut-remote', 'quack-contracts', 'splash-registry', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'Both run agents on your own computer, and Quack has no cloud of its own. Its Companion provider talks to a remote server, and a source-built server can serve other devices over LAN or Tailscale; the README pitches Companion for phones, but the docs FAQ says there is no mobile app. <code>splash-server</code> serves one user through an SSH tunnel.',
			cite: ['quack-readme', 'quack-astronaut-remote', 'quack-release', 'quack-remote', 'quack-docs-faq', 'splash-readme', 'splash-server']
		},
		{
			title: 'Price, accounts and license',
			text: 'Both are free, MIT-licensed and need no account. Quack’s makers sell setup and consulting and take optional donations; its llms.txt still lists paid plans, which the FAQ and README contradict. Quack runs each CLI with your existing login and resells no model access; Splash likewise runs each agent’s CLI with the login you set up.',
			cite: ['quack-license', 'quack-home', 'quack-install', 'quack-consultancy', 'quack-gumroad', 'quack-llms', 'quack-readme', 'splash-license', 'splash-download', 'splash-build', 'splash-agents']
		},
		{
			title: 'Platforms and older docs',
			text: 'Quack 2.0 ships for macOS 12+ on Apple silicon; 0.9.3 had a Windows installer, and the site points Windows and Linux users to the source. Much of the quack.build docs, its llms.txt and footer still mention Tauri, two backends or paid plans, which appear to predate 2.0. Splash builds for macOS 14+, Windows 11 and Ubuntu 24.04.',
			cite: ['quack-release', 'quack-release-0-9-3', 'quack-home', 'quack-docs', 'quack-docs-models', 'quack-llms', 'splash-install']
		},
		{
			title: 'Around the session',
			text: 'Quack’s tools reach from the chat to delivery: worktree setup actions, dev-server tracking, a browser agents drive, an iOS Simulator pane, PR creation, Linear issues, scheduled Automations and a Kanban board. Splash centers on the conversation: a <strong>Needs attention</strong> queue, a review screen, transcript search, importing sessions over ACP and a GitHub triage view.',
			cite: ['quack-project-scripts', 'quack-changelog', 'quack-release', 'quack-readme', 'quack-linear-docs', 'quack-kanban', 'splash-features', 'splash-history', 'splash-github']
		}
	],
	fit: {
		splash: [
			'You work on Windows, Ubuntu or an Intel Mac as well as on Apple silicon.',
			'You want Gemini, Copilot, Goose and other ACP agents in the same chat view as Claude Code and Codex.',
			'You want to import conversations agents list over ACP, including ones started outside the app, and search them with the rest.',
			'You want to run sessions on the machine that holds your code and use them in a browser through an SSH tunnel.'
		],
		other: [
			'You want worktree setup actions, dev-server tracking and a browser your agents drive with your logged-in sessions.',
			'You want to commit, push and open pull requests in the app and bring Linear issues into the composer.',
			'You want scheduled Automations, named agent presets and threads you can hand to another provider with their context.',
			'You work on an Apple silicon Mac and want an app that updates itself, with an iOS Simulator pane your agents can operate.'
		]
	},
	sources: [
		{ id: 'quack-home', title: 'One desktop app for all your AI coding agents', url: 'https://www.quack.build/', publisher: 'Alek Dobrohotov', checked: '2026-10-10' },
		{ id: 'quack-llms', title: 'Quack (llms.txt)', url: 'https://www.quack.build/llms.txt', publisher: 'Alek Dobrohotov', checked: '2026-10-10' },
		{ id: 'quack-consultancy', title: 'AI Consultancy', url: 'https://www.quack.build/consultancy', publisher: 'Alek Dobrohotov', checked: '2026-10-10' },
		{ id: 'quack-gumroad', title: 'Support Quack — Buy Us a Pizza', url: 'https://alekdob.gumroad.com/l/obgae', publisher: 'Alek Dobrohotov', checked: '2026-10-10' },
		{ id: 'quack-docs', title: 'Quack Documentation', url: 'https://www.quack.build/docs', publisher: 'Alek Dobrohotov', checked: '2026-10-10' },
		{ id: 'quack-what-is', title: 'What is Quack?', url: 'https://www.quack.build/docs/start-here/what-is-quack', publisher: 'Alek Dobrohotov', checked: '2026-10-10' },
		{ id: 'quack-install', title: 'Install', url: 'https://www.quack.build/docs/start-here/install', publisher: 'Alek Dobrohotov', checked: '2026-10-10' },
		{ id: 'quack-docs-models', title: 'Models & Providers', url: 'https://www.quack.build/docs/customize/models-and-providers', publisher: 'Alek Dobrohotov', checked: '2026-10-10' },
		{ id: 'quack-docs-automations', title: 'Background Tasks', url: 'https://www.quack.build/docs/organize-work/automations', publisher: 'Alek Dobrohotov', checked: '2026-10-10' },
		{ id: 'quack-docs-faq', title: 'FAQ', url: 'https://www.quack.build/docs/reference/faq', publisher: 'Alek Dobrohotov', checked: '2026-10-10' },
		{ id: 'quack-release', title: 'Quack 2.0', url: 'https://github.com/AlekDob/quack-releases/releases/tag/v2.0.0', publisher: 'AlekDob/quack-releases on GitHub', checked: '2026-10-10' },
		{ id: 'quack-release-0-9-3', title: 'Quack 0.9.3', url: 'https://github.com/AlekDob/quack-releases/releases/tag/v0.9.3', publisher: 'AlekDob/quack-releases on GitHub', checked: '2026-10-10' },
		{ id: 'quack-readme', title: 'README.md', url: 'https://github.com/AlekDob/quack-app/blob/main/README.md', publisher: 'AlekDob/quack-app on GitHub', checked: '2026-10-10' },
		{ id: 'quack-license', title: 'LICENSE', url: 'https://github.com/AlekDob/quack-app/blob/main/LICENSE', publisher: 'AlekDob/quack-app on GitHub', checked: '2026-10-10' },
		{ id: 'quack-changelog', title: 'CHANGELOG.md', url: 'https://github.com/AlekDob/quack-app/blob/main/CHANGELOG.md', publisher: 'AlekDob/quack-app on GitHub', checked: '2026-10-10' },
		{ id: 'quack-remote', title: 'Remote Access Setup (REMOTE.md)', url: 'https://github.com/AlekDob/quack-app/blob/main/REMOTE.md', publisher: 'AlekDob/quack-app on GitHub', checked: '2026-10-10' },
		{ id: 'quack-desktop-pkg', title: 'apps/desktop/package.json', url: 'https://github.com/AlekDob/quack-app/blob/main/apps/desktop/package.json', publisher: 'AlekDob/quack-app on GitHub', checked: '2026-10-10' },
		{ id: 'quack-desktop-main', title: 'apps/desktop/src/main.ts', url: 'https://github.com/AlekDob/quack-app/blob/main/apps/desktop/src/main.ts', publisher: 'AlekDob/quack-app on GitHub', checked: '2026-10-10' },
		{ id: 'quack-contracts', title: 'packages/contracts/src/orchestration.ts', url: 'https://github.com/AlekDob/quack-app/blob/main/packages/contracts/src/orchestration.ts#L57-L68', publisher: 'AlekDob/quack-app on GitHub', checked: '2026-10-10' },
		{ id: 'quack-claude-adapter', title: 'ClaudeAdapter.ts', url: 'https://github.com/AlekDob/quack-app/blob/main/apps/server/src/provider/Layers/ClaudeAdapter.ts#L1-L8', publisher: 'AlekDob/quack-app on GitHub', checked: '2026-10-10' },
		{ id: 'quack-codex-manager', title: 'codexAppServerManager.ts', url: 'https://github.com/AlekDob/quack-app/blob/main/apps/server/src/codexAppServerManager.ts#L718', publisher: 'AlekDob/quack-app on GitHub', checked: '2026-10-10' },
		{ id: 'quack-cursor-adapter', title: 'CursorAdapter.ts', url: 'https://github.com/AlekDob/quack-app/blob/main/apps/server/src/provider/Layers/CursorAdapter.ts#L1-L5', publisher: 'AlekDob/quack-app on GitHub', checked: '2026-10-10' },
		{ id: 'quack-droid-adapter', title: 'DroidAdapter.ts', url: 'https://github.com/AlekDob/quack-app/blob/main/apps/server/src/provider/Layers/DroidAdapter.ts#L1-L5', publisher: 'AlekDob/quack-app on GitHub', checked: '2026-10-10' },
		{ id: 'quack-grok-adapter', title: 'GrokAdapter.ts', url: 'https://github.com/AlekDob/quack-app/blob/main/apps/server/src/provider/Layers/GrokAdapter.ts#L1-L5', publisher: 'AlekDob/quack-app on GitHub', checked: '2026-10-10' },
		{ id: 'quack-opencode-runtime', title: 'opencodeRuntime.ts', url: 'https://github.com/AlekDob/quack-app/blob/main/apps/server/src/provider/opencodeRuntime.ts#L949', publisher: 'AlekDob/quack-app on GitHub', checked: '2026-10-10' },
		{ id: 'quack-opencode-adapter', title: 'OpenCodeAdapter.ts', url: 'https://github.com/AlekDob/quack-app/blob/main/apps/server/src/provider/Layers/OpenCodeAdapter.ts#L119-L122', publisher: 'AlekDob/quack-app on GitHub', checked: '2026-10-10' },
		{ id: 'quack-pi-adapter', title: 'PiAdapter.ts', url: 'https://github.com/AlekDob/quack-app/blob/main/apps/server/src/provider/Layers/PiAdapter.ts#L19', publisher: 'AlekDob/quack-app on GitHub', checked: '2026-10-10' },
		{ id: 'quack-antigravity-adapter', title: 'AntigravityAdapter.ts', url: 'https://github.com/AlekDob/quack-app/blob/main/apps/server/src/provider/Layers/AntigravityAdapter.ts#L1064-L1074', publisher: 'AlekDob/quack-app on GitHub', checked: '2026-10-10' },
		{ id: 'quack-astronaut-remote', title: 'astronautRemote.ts', url: 'https://github.com/AlekDob/quack-app/blob/main/apps/server/src/provider/astronautRemote.ts#L1', publisher: 'AlekDob/quack-app on GitHub', checked: '2026-10-10' },
		{ id: 'quack-astronaut-doc', title: 'Astronaut remoto (feature doc, Italian)', url: 'https://github.com/AlekDob/quack-app/blob/main/documentation/features/017-astronaut-remote-provider.md', publisher: 'AlekDob/quack-app on GitHub', checked: '2026-10-10' },
		{ id: 'quack-branch-toolbar', title: 'BranchToolbar.tsx', url: 'https://github.com/AlekDob/quack-app/blob/main/apps/web/src/components/BranchToolbar.tsx#L568', publisher: 'AlekDob/quack-app on GitHub', checked: '2026-10-10' },
		{ id: 'quack-project-scripts', title: 'ProjectScriptsControl.tsx', url: 'https://github.com/AlekDob/quack-app/blob/main/apps/web/src/components/ProjectScriptsControl.tsx#L489', publisher: 'AlekDob/quack-app on GitHub', checked: '2026-10-10' },
		{ id: 'quack-task-completion', title: 'taskCompletion.tsx', url: 'https://github.com/AlekDob/quack-app/blob/main/apps/web/src/notifications/taskCompletion.tsx', publisher: 'AlekDob/quack-app on GitHub', checked: '2026-10-10' },
		{ id: 'quack-kanban', title: 'KanbanProjectBoardView.tsx', url: 'https://github.com/AlekDob/quack-app/blob/main/apps/web/src/components/kanban/KanbanProjectBoardView.tsx', publisher: 'AlekDob/quack-app on GitHub', checked: '2026-10-10' },
		{ id: 'quack-github-cli', title: 'GitHubCli.ts', url: 'https://github.com/AlekDob/quack-app/blob/main/apps/server/src/git/Layers/GitHubCli.ts#L1227', publisher: 'AlekDob/quack-app on GitHub', checked: '2026-10-10' },
		{ id: 'quack-linear-docs', title: 'Open Linear issues in Quack', url: 'https://github.com/AlekDob/quack-app/blob/main/docs/linear-coding-tools.md', publisher: 'AlekDob/quack-app on GitHub', checked: '2026-10-10' },
		{ id: 'quack-linear-feature', title: 'Integrazione Linear nel composer (feature doc, Italian)', url: 'https://github.com/AlekDob/quack-app/blob/main/documentation/features/026-linear-issue-composer-integration.md', publisher: 'AlekDob/quack-app on GitHub', checked: '2026-10-10' },
		{ id: 'quack-sidebar', title: 'Sidebar.tsx', url: 'https://github.com/AlekDob/quack-app/blob/main/apps/web/src/components/Sidebar.tsx#L5515-L5516', publisher: 'AlekDob/quack-app on GitHub', checked: '2026-10-10' },
		{ id: 'quack-search-palette', title: 'SidebarSearchPalette.tsx', url: 'https://github.com/AlekDob/quack-app/blob/main/apps/web/src/components/SidebarSearchPalette.tsx#L726', publisher: 'AlekDob/quack-app on GitHub', checked: '2026-10-10' },
		{ id: 'quack-search-logic', title: 'SidebarSearchPalette.logic.ts', url: 'https://github.com/AlekDob/quack-app/blob/main/apps/web/src/components/SidebarSearchPalette.logic.ts#L356', publisher: 'AlekDob/quack-app on GitHub', checked: '2026-10-10' }
	]
};
