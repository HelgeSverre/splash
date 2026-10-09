// Splash vs Codeg. Facts checked 2026-10-09 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const CODEG: Comparison = {
	slug: 'codeg',
	name: 'Codeg',
	description: 'How Splash and Codeg compare on agents, platforms, worktrees, remote access, review and pricing, with a source for every fact.',
	checked: '2026-10-09',
	intro: 'Splash and Codeg are open-source apps that run several coding agents at once over the Agent Client Protocol. Codeg runs as a desktop app, in a Docker container or as a self-hosted server, with mobile clients and a to-do queue that gives each task a worktree. Splash is a desktop app and single-user server; each session runs in its folder or a worktree.',
	other: {
		name: 'Codeg',
		url: 'https://docs.codeg.app',
		maker: 'SpaceRing',
		summary: 'A multi-agent coding workspace that runs as a desktop app, in a Docker container or as a self-hosted server, with mobile clients. It drives 15 built-in agents through the Agent Client Protocol and queues to-do tasks in worktrees.',
		cite: ['codeg-spacering', 'codeg-release', 'codeg-readme', 'codeg-supported-agents', 'codeg-tasks']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app, self-hosted server used in a browser, or Docker container; iOS and Android apps connect to it', cite: ['codeg-readme', 'codeg-install'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v0.34.0, released 7 October 2026; the iOS and Android clients are still in testing', cite: ['codeg-install', 'codeg-release'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (Apache-2.0); the iOS and Android clients are open source too', cite: ['codeg-license', 'codeg-about', 'codeg-architecture'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free, with no paid tier documented; sponsors support development. The iOS client is free on the App Store', cite: ['codeg-about', 'codeg-app-store'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'A Rust core and a Next.js/React interface, which the desktop app wraps in a Tauri 2 shell', cite: ['codeg-architecture', 'codeg-cargo'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: '15 built in, including Claude Code, Codex, Gemini CLI, OpenCode, Cursor and Grok; other ACP agents can be added', cite: ['codeg-supported-agents', 'codeg-readme'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Agent Client Protocol, each agent a subprocess; Claude Code, Codex and DeepSeek Harness go through ACP adapters, and the source code launches Pi through one too', cite: ['codeg-architecture', 'codeg-supported-agents', 'codeg-registry'] } },
				{ label: 'Agent sign-in', hint: 'Installing agents and logging them in', splash: S.signIn, other: { text: 'Installs and pins the built-in agents; each agent signs in through its vendor account, an API key from its provider or a custom endpoint', cite: ['codeg-supported-agents', 'codeg-auth'] } },
				{ label: 'Permission requests', splash: S.permissions, other: { text: 'A card above the composer offers the agent’s own choices; there is no global auto-approve switch', mark: 'yes', cite: ['codeg-workspace'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Scans installed MCP servers, offers a registry Market, and writes a server into the configs of the agents you pick', mark: 'yes', cite: ['codeg-mcp', 'codeg-readme'] } },
				{
					label: 'Agents handing off work',
					hint: 'One agent handing a subtask to another',
					splash: S.handoff,
					other: { text: 'Off by default; when on, a lead agent hands subtasks to other agent types. OpenClaw and Pi can’t lead', mark: 'yes', cite: ['codeg-intro', 'codeg-collaboration', 'codeg-multi-agent'] }
				}
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Each to-do task gets a worktree on its own branch; a conversation uses your working tree or a worktree you create', mark: 'yes', cite: ['codeg-tasks', 'codeg-git'] } },
				{
					label: 'Queued and scheduled runs',
					hint: 'Task queues and timed runs',
					splash: { text: 'An agent starts when you create, continue or prompt a session; there is no task queue or scheduler', mark: 'no', cite: ['splash-how'] },
					other: { text: 'To-dos queue under a per-folder concurrency limit (default 2); Automations run a saved prompt by cron schedule or by hand', mark: 'yes', cite: ['codeg-tasks', 'codeg-automations'] }
				},
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'A per-folder init command runs in each new task worktree, and a status-bar launcher starts dev servers and other commands', mark: 'yes', cite: ['codeg-tasks', 'codeg-workspace'] } },
				{
					label: 'Built-in browser',
					hint: 'A browser agents can see and use',
					splash: S.browser,
					other: { text: 'In the desktop app; agents can read and drive its pages once you switch on their browser tools', mark: 'yes', cite: ['codeg-readme', 'codeg-privacy'] }
				},
				{ label: 'Terminal', splash: S.terminal, other: { text: 'Terminals in the working folder (⌘J), in tabs; each is a real shell', mark: 'yes', cite: ['codeg-workspace'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Each conversation has a live status dot; a badge counts to-dos that await input, need review or failed', mark: 'yes', cite: ['codeg-workspace', 'codeg-tasks'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'OS notifications for six event types, each with its own switch and on by default; chat channels and webhooks can relay agent events', mark: 'yes', cite: ['codeg-general', 'codeg-chat-channels'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Read-only diffs of each reply’s edits, a built-in git client, and a review stage where to-dos are merged, reworked or abandoned', mark: 'yes', cite: ['codeg-workspace', 'codeg-git', 'codeg-tasks'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'Files open in an editor that saves automatically; diffs stay read-only, apart from a three-pane merge-conflict editor', mark: 'yes', cite: ['codeg-workspace', 'codeg-git'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Tasks from issues can push their branch and open a PR; tasks from PRs push back to that PR’s branch', mark: 'yes', cite: ['codeg-repository'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'A per-folder Repository panel for issues and PRs, with CI checks, comments, close, reopen and merge; items become to-dos', mark: 'yes', cite: ['codeg-repository'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'GitHub, GitLab, Gitea and Forgejo, self-hosted instances included; Linear and Jira aren’t documented', mark: 'partial', cite: ['codeg-repository'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon, Intel), Windows 10/11 x64 and Arm64, Linux x64 and arm64; server builds and a multi-arch Docker image', cite: ['codeg-install', 'codeg-deployment'] } },
				{
					label: 'Mobile app',
					splash: S.mobile,
					other: { text: 'iOS/iPadOS 26+ and Android 12+ clients, still in testing, that connect to your own Codeg host', mark: 'partial', cite: ['codeg-install', 'codeg-app-store'] }
				},
				{ label: 'Remote access', splash: S.remote, other: { text: 'No hosted cloud; use it in a browser through the desktop Web Service or a self-hosted codeg-server, with a token', mark: 'yes', cite: ['codeg-privacy', 'codeg-web-service', 'codeg-deployment'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'The desktop app updates itself; codeg-server does too, except on Windows, where you rerun the installer', mark: 'yes', cite: ['codeg-architecture', 'codeg-deployment'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', splash: S.history, other: { text: 'Imports sessions the 15 built-in agents saved on disk, including ones begun outside Codeg, and resumes them with that agent', mark: 'yes', cite: ['codeg-aggregation'] } },
				{ label: 'Search', hint: 'Across saved conversations', splash: S.search, other: { text: '⌘K searches conversations from every agent, imported ones included, and files; matching on message text isn’t documented', mark: 'yes', cite: ['codeg-aggregation', 'codeg-workspace'] } },
				{ label: 'Fork a conversation', splash: S.fork, other: { text: 'Forks from a completed reply and lets you steer a running turn, where the agent supports it', mark: 'partial', cite: ['codeg-readme'] } }
			]
		}
	],
	differences: [
		{
			title: 'Who runs file edits and commands',
			text: 'Codeg serves an agent’s ACP file and terminal requests in its own process, unless a per-agent switch hands them back, and gives most agents its <code>codeg-mcp</code> companion, which carries delegation and other Codeg tools. Splash offers agents no file-system or terminal capabilities: each agent changes files on its own, and Splash reads the results from git and a folder watcher.',
			cite: ['codeg-agents', 'codeg-architecture', 'codeg-multi-agent', 'splash-how']
		},
		{
			title: 'To-dos and sessions',
			text: 'Codeg gives each <strong>to-do</strong> a worktree and branch, an optional init command, a review step and an agent that does the merge, under a per-folder concurrency limit; its conversations run in your working tree or in a worktree you create. A Splash <strong>session</strong> is one agent in its project folder or its own worktree on a <code>splash/…</code> branch, and archiving it deletes the worktree but keeps the branch.',
			cite: ['codeg-tasks', 'codeg-git', 'splash-readme', 'splash-features']
		},
		{
			title: 'Where each one runs',
			text: 'Codeg ships desktop builds for macOS and for Windows and Linux on x64 and Arm, plus a server binary, a multi-arch Docker image, iOS and Android clients still in testing, and Telegram, Lark and WeChat channels. Splash ships desktop builds for macOS, Windows 11 x64 and Ubuntu 24.04 x64, plus a single-user server that listens on loopback for an SSH tunnel.',
			cite: ['codeg-install', 'codeg-deployment', 'codeg-chat-channels', 'splash-install', 'splash-server']
		},
		{
			title: 'Setting up agents',
			text: 'Codeg installs and pins versions of its built-in agents, most of them npm packages it starts with <code>npx</code>, and writes MCP servers into the configs of the agents you choose. Splash installs no agents: you install and sign in to each CLI, <code>npx</code> fetches adapters on first run, and Splash lists the MCP servers in the Claude Code, Codex, Pi, Pool and Glue config files, read-only.',
			cite: ['codeg-supported-agents', 'codeg-mcp', 'splash-agents', 'splash-features', 'splash-mcp']
		}
	],
	fit: {
		splash: [
			'You want each agent session in its project folder or its own worktree, with permission requests, failures and finished turns in one queue.',
			'You want to find conversations agents expose over ACP, import them, and search their saved transcript text.',
			'You triage GitHub issues, pull requests and Actions runs across many repositories next to your sessions.',
			'You run agents on a remote machine and use them from a browser over an SSH tunnel.'
		],
		other: [
			'You want to queue tasks that each get a worktree, an optional setup command and a review step before an agent merges them.',
			'You want a lead agent to pass parts of a job to other kinds of agents within one conversation.',
			'You want to follow sessions from iOS, Android, Telegram, Lark or WeChat, or run the server in Docker.',
			'You work with GitLab, Gitea or Forgejo as well as GitHub and want tasks to open pull requests.'
		]
	},
	sources: [
		{ id: 'codeg-spacering', title: 'Open source', url: 'https://spacering.net/open-source/', publisher: 'SpaceRing', checked: '2026-10-09' },
		{ id: 'codeg-release', title: 'codeg v0.34.0', url: 'https://github.com/spacering-net/codeg/releases/tag/v0.34.0', publisher: 'spacering-net/codeg on GitHub', checked: '2026-10-09' },
		{ id: 'codeg-readme', title: 'Codeg README', url: 'https://github.com/spacering-net/codeg', publisher: 'spacering-net/codeg on GitHub', checked: '2026-10-09' },
		{ id: 'codeg-license', title: 'LICENSE', url: 'https://github.com/spacering-net/codeg/blob/main/LICENSE', publisher: 'spacering-net/codeg on GitHub', checked: '2026-10-09' },
		{ id: 'codeg-cargo', title: 'src-tauri/Cargo.toml', url: 'https://github.com/spacering-net/codeg/blob/main/src-tauri/Cargo.toml', publisher: 'spacering-net/codeg on GitHub', checked: '2026-10-09' },
		{ id: 'codeg-registry', title: 'src-tauri/src/acp/registry.rs', url: 'https://github.com/spacering-net/codeg/blob/main/src-tauri/src/acp/registry.rs', publisher: 'spacering-net/codeg on GitHub', checked: '2026-10-09' },
		{ id: 'codeg-app-store', title: 'Codeg Client', url: 'https://apps.apple.com/app/codeg-client/id6785199071', publisher: 'Apple App Store', checked: '2026-10-09' },
		{ id: 'codeg-intro', title: 'Introduction', url: 'https://docs.codeg.app/getting-started/', publisher: 'Codeg', checked: '2026-10-09' },
		{ id: 'codeg-install', title: 'Download and install', url: 'https://docs.codeg.app/getting-started/installation', publisher: 'Codeg', checked: '2026-10-09' },
		{ id: 'codeg-deployment', title: 'Deployment', url: 'https://docs.codeg.app/getting-started/deployment', publisher: 'Codeg', checked: '2026-10-09' },
		{ id: 'codeg-architecture', title: 'Architecture', url: 'https://docs.codeg.app/reference/architecture', publisher: 'Codeg', checked: '2026-10-09' },
		{ id: 'codeg-about', title: 'About', url: 'https://docs.codeg.app/about', publisher: 'Codeg', checked: '2026-10-09' },
		{ id: 'codeg-supported-agents', title: 'Supported Agents', url: 'https://docs.codeg.app/guide/supported-agents', publisher: 'Codeg', checked: '2026-10-09' },
		{ id: 'codeg-agents', title: 'Working with Agents', url: 'https://docs.codeg.app/guide/agents', publisher: 'Codeg', checked: '2026-10-09' },
		{ id: 'codeg-auth', title: 'Authentication & Models', url: 'https://docs.codeg.app/guide/authentication', publisher: 'Codeg', checked: '2026-10-09' },
		{ id: 'codeg-multi-agent', title: 'Multi-Agent Collaboration', url: 'https://docs.codeg.app/guide/multi-agent', publisher: 'Codeg', checked: '2026-10-09' },
		{ id: 'codeg-collaboration', title: 'Collaboration', url: 'https://docs.codeg.app/reference/settings/collaboration', publisher: 'Codeg', checked: '2026-10-09' },
		{ id: 'codeg-mcp', title: 'MCP Servers', url: 'https://docs.codeg.app/guide/mcp', publisher: 'Codeg', checked: '2026-10-09' },
		{ id: 'codeg-tasks', title: 'To-dos', url: 'https://docs.codeg.app/guide/tasks', publisher: 'Codeg', checked: '2026-10-09' },
		{ id: 'codeg-git', title: 'Git & Worktrees', url: 'https://docs.codeg.app/guide/git', publisher: 'Codeg', checked: '2026-10-09' },
		{ id: 'codeg-automations', title: 'Automations', url: 'https://docs.codeg.app/guide/automations', publisher: 'Codeg', checked: '2026-10-09' },
		{ id: 'codeg-workspace', title: 'The Workspace', url: 'https://docs.codeg.app/guide/workspace', publisher: 'Codeg', checked: '2026-10-09' },
		{ id: 'codeg-general', title: 'General', url: 'https://docs.codeg.app/reference/settings/general', publisher: 'Codeg', checked: '2026-10-09' },
		{ id: 'codeg-privacy', title: 'Privacy & Security', url: 'https://docs.codeg.app/reference/privacy', publisher: 'Codeg', checked: '2026-10-09' },
		{ id: 'codeg-repository', title: 'Repository Panel', url: 'https://docs.codeg.app/guide/repository', publisher: 'Codeg', checked: '2026-10-09' },
		{ id: 'codeg-web-service', title: 'Web Service', url: 'https://docs.codeg.app/reference/settings/web-service', publisher: 'Codeg', checked: '2026-10-09' },
		{ id: 'codeg-aggregation', title: 'Conversation Aggregation', url: 'https://docs.codeg.app/guide/aggregation', publisher: 'Codeg', checked: '2026-10-09' },
		{ id: 'codeg-chat-channels', title: 'Chat Channels', url: 'https://docs.codeg.app/guide/chat-channels', publisher: 'Codeg', checked: '2026-10-09' }
	]
};
