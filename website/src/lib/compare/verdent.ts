// Splash vs Verdent. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const VERDENT: Comparison = {
	slug: 'verdent',
	name: 'Verdent',
	description: 'How Splash and Verdent compare on agents, platforms, pricing, isolation, review and remote work, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Verdent are desktop apps that run several coding agents in parallel. Verdent, for macOS and Windows, centers on a Manager that splits a goal into subtasks for worker agents, and needs a Verdent account. Splash, free and open source for macOS, Windows and Ubuntu, runs one agent per session over the Agent Client Protocol.',
	other: {
		name: 'Verdent',
		url: 'https://www.verdent.ai',
		maker: 'Verdent AI',
		summary: 'A desktop app where you describe a goal and a Manager splits it into subtasks, runs a worker agent for each in parallel and tracks them on a Kanban board for review.',
		cite: ['verdent-overview', 'verdent-os']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app (Verdent Manager), plus Verdent Cloud in the browser, a VS Code extension and a JetBrains plugin', cite: ['verdent-os', 'verdent-cloud-overview', 'verdent-download'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'The download page serves 2.16.0 installers; the changelog runs from v1.0.0 (September 2025) to v2.15.1 (23 September 2026)', cite: ['verdent-download', 'verdent-changelog'] } },
				{ label: 'License', splash: S.license, other: { text: 'Proprietary; no open-source license or source code is published, and the terms forbid reverse engineering the service', cite: ['verdent-terms'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free mode at $0; Lite $5, Starter $19, Pro $59, Max $179 a month; Teams $20 per user monthly; Enterprise custom', cite: ['verdent-pricing'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 11+ (Apple silicon and Intel), Windows 10/11 x64; no Linux desktop app, though the VS Code extension supports Linux', cite: ['verdent-install', 'verdent-os', 'verdent-download', 'verdent-vscode-requirements'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Verdent’s built-in agent by default; Manager’s worker tasks can run on Claude Code or Codex. No other outside agents are listed', cite: ['verdent-byoa'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Claude Code via npx and the @agentclientprotocol/claude-agent-acp adapter; Codex through your installed codex CLI, over a protocol the docs don’t name', cite: ['verdent-byoa', 'verdent-claude-agent-acp'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Verdent credits or the Free and Eco quotas, or your own Anthropic, OpenAI or OpenRouter key; Claude Code workers take a provider API key or token, Codex uses the auth you set up for it locally', cite: ['verdent-pricing', 'verdent-changelog', 'verdent-byok', 'verdent-byoa'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'A Verdent account (email and password, or OAuth such as Google or GitHub) before first use; AI features also need an internet connection', cite: ['verdent-install'] } },
				{ label: 'Model and mode pickers', splash: S.models, other: { text: 'Modes (Free, Eco, Prime) route work to models, or you choose models after enabling manual selection in Settings; tasks run in Agent or Plan Mode', mark: 'yes', cite: ['verdent-changelog', 'verdent-agent-mode', 'verdent-plan-mode'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'In Agent Mode, some actions pause until you review and approve them', mark: 'yes', cite: ['verdent-agent-mode'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Servers added in Settings and kept in ~/.verdent/mcp.json; marketplace plugins can bundle MCP servers with skills, subagents and rules', mark: 'yes', cite: ['verdent-mcp', 'verdent-integration'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Uses git worktrees internally for supported workflows; manual workspace creation is hidden, and tasks in one workspace share its files', mark: 'partial', cite: ['verdent-install', 'verdent-workspace-isolation'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Manager splits a goal into subtasks, each sent to its own worker agent and run in parallel; Lite plan and up', mark: 'yes', cite: ['verdent-overview', 'verdent-manager', 'verdent-pricing'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Manager queues its questions as reply requests in one banner, tied to each task; finished work waits in To Review', mark: 'yes', cite: ['verdent-manager', 'verdent-overview'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Manager runs recurring jobs set up with /schedule while the app is open; missed runs can be started by hand', mark: 'yes', cite: ['verdent-automation'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'An integrated browser; Visual Edits lets you pick an element on the page and describe a change for the agent', mark: 'yes', cite: ['verdent-changelog'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Task Changes lists a task’s modifications; a Reviewer subagent sorts findings by severity and fixes the ones you select', mark: 'yes', cite: ['verdent-workspace-isolation', 'verdent-code-review'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'The GitHub plugin drafts PRs with a summary and checks CI on request; rebase, sync, commit and conflict help are built in', mark: 'yes', cite: ['verdent-integration', 'verdent-workspace-isolation', 'verdent-changelog'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'A GitHub plugin from the official Verdent marketplace, connected through OAuth, lets agents read PRs, work on issues and start Actions runs', mark: 'yes', cite: ['verdent-integration', 'verdent-overview'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'Linear and GitHub issues through marketplace plugins; GitLab and Jira through community MCP servers', mark: 'yes', cite: ['verdent-integration', 'verdent-overview', 'verdent-mcp'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'Verdent Cloud runs workspaces in Verdent’s cloud from a browser, without Manager; Claude Code and Codex workers run on your machine', mark: 'yes', cite: ['verdent-cloud-overview', 'verdent-cloud-differences', 'verdent-byok'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'Open a project folder on a server over SSH; send Manager work from Slack, Telegram, Feishu, Discord or LINE', mark: 'yes', cite: ['verdent-quick-start', 'verdent-changelog', 'verdent-im', 'verdent-manager'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Checks for updates each time it launches and installs one when you click Update', mark: 'yes', cite: ['verdent-install'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented; Manager memory can import up to six months of history, but the docs don’t say from where', mark: 'unknown', cite: ['verdent-manager'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Search across messages in the app, added in v2.6.0 (June 2026)', mark: 'yes', cite: ['verdent-changelog'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Verdent runs its own built-in agent by default, with models picked by its Free, Eco or Prime mode or your own API key. Manager can give worker tasks to Claude Code, which Verdent launches through the <code>@agentclientprotocol/claude-agent-acp</code> adapter (its docs don’t mention ACP by name), or to your installed Codex CLI. Splash speaks the <strong>Agent Client Protocol</strong> with every agent.',
			cite: ['verdent-byoa', 'verdent-byok', 'verdent-changelog', 'verdent-claude-agent-acp', 'splash-registry', 'acp']
		},
		{
			title: 'Where things run',
			text: 'Verdent Desktop works on local folders or SSH servers; its security policy says most Desktop requests go through Verdent’s LLM proxy, and its AI features need an internet connection. Verdent Cloud runs workspaces in Verdent’s cloud, without Manager. Splash runs agents as child processes on your computer or under <code>splash-server</code> on a machine you choose, each agent using your own login.',
			cite: ['verdent-quick-start', 'verdent-security', 'verdent-install', 'verdent-cloud-overview', 'verdent-cloud-differences', 'splash-readme', 'splash-server', 'splash-agents']
		},
		{
			title: 'Price, accounts and license',
			text: 'Verdent is proprietary and needs a Verdent account. Free mode costs nothing but leaves out Manager, which starts with Lite at $5 a month and is where Claude Code and Codex run, as Manager’s workers. Starter ($19) and up include Prime-mode credits. Splash is free, MIT-licensed and has no accounts; each agent runs with your own login.',
			cite: ['verdent-terms', 'verdent-install', 'verdent-pricing', 'verdent-changelog', 'verdent-byoa', 'splash-license', 'splash-download', 'splash-build', 'splash-agents']
		},
		{
			title: 'Workflow focus',
			text: 'Verdent works from a goal: Manager plans subtasks, runs worker agents in parallel on a Kanban board, repeats jobs on a schedule, takes requests from chat apps and can publish Cloud projects to a <code>*.verdent.app</code> URL. Splash centers on single-agent sessions: a rendered transcript, a Needs attention queue, a review screen, transcript search and import of sessions started elsewhere.',
			cite: ['verdent-overview', 'verdent-manager', 'verdent-automation', 'verdent-im', 'verdent-cloud-projects', 'splash-readme', 'splash-features', 'splash-history']
		},
		{
			title: 'Platforms and updates',
			text: 'Verdent Desktop runs on macOS 11+ and 64-bit Windows 10 and 11 and checks for updates at launch; on Linux the Verdent for VS Code extension runs, and the family also has a JetBrains plugin and browser-based Verdent Cloud. Splash builds for macOS 14+, Windows 11 x64, Ubuntu 24.04 x64 and a headless server, updated by downloading releases from GitHub.',
			cite: ['verdent-install', 'verdent-os', 'verdent-vscode-requirements', 'verdent-download', 'verdent-cloud-overview', 'splash-install', 'splash-about']
		}
	],
	fit: {
		splash: [
			'You want a free, MIT-licensed app that needs no account.',
			'You work on Ubuntu as well as macOS or Windows, or want a headless server you use from a browser.',
			'You want Gemini, Copilot, OpenCode, Goose and other agents alongside Claude Code and Codex, each with your own login.',
			'You want to import conversations your agents started outside the app and search them with the rest.'
		],
		other: [
			'You want to describe a goal and have a Manager split it into tasks for parallel agents on a Kanban board.',
			'You want recurring jobs on a schedule and the option to send work from Slack, Telegram or other chat apps.',
			'You want models from many vendors routed by mode, with a no-cost Free mode and plans from $5 a month.',
			'You want a built-in browser for visual edits and a way to publish what you build to a live URL.'
		]
	},
	sources: [
		{ id: 'verdent-overview', title: 'Overview', url: 'https://www.verdent.ai/docs/verdent-manager/getting-started/overview', publisher: 'Verdent AI', checked: '2026-10-10' },
		{ id: 'verdent-os', title: 'Supported Operating Systems', url: 'https://www.verdent.ai/docs/verdent-manager/getting-started/supported-operating-systems', publisher: 'Verdent AI', checked: '2026-10-10' },
		{ id: 'verdent-install', title: 'Installation', url: 'https://www.verdent.ai/docs/verdent-manager/getting-started/installation', publisher: 'Verdent AI', checked: '2026-10-10' },
		{ id: 'verdent-quick-start', title: 'Quick Start', url: 'https://www.verdent.ai/docs/verdent-manager/getting-started/quick-start', publisher: 'Verdent AI', checked: '2026-10-10' },
		{ id: 'verdent-download', title: 'Download', url: 'https://www.verdent.ai/download', publisher: 'Verdent AI', checked: '2026-10-10' },
		{ id: 'verdent-pricing', title: 'Verdent AI Pricing', url: 'https://www.verdent.ai/pricing', publisher: 'Verdent AI', checked: '2026-10-10' },
		{ id: 'verdent-changelog', title: 'Changelog', url: 'https://www.verdent.ai/changelog', publisher: 'Verdent AI', checked: '2026-10-10' },
		{ id: 'verdent-terms', title: 'Terms of Use', url: 'https://www.verdent.ai/terms', publisher: 'Verdent AI', checked: '2026-10-10' },
		{ id: 'verdent-security', title: 'Security Policy', url: 'https://www.verdent.ai/security', publisher: 'Verdent AI', checked: '2026-10-10' },
		{ id: 'verdent-manager', title: 'Manager', url: 'https://www.verdent.ai/docs/verdent-manager/core-features/manager', publisher: 'Verdent AI', checked: '2026-10-10' },
		{ id: 'verdent-im', title: 'Instant Messaging', url: 'https://www.verdent.ai/docs/verdent-manager/core-features/instant-messaging', publisher: 'Verdent AI', checked: '2026-10-10' },
		{ id: 'verdent-integration', title: 'Integration', url: 'https://www.verdent.ai/docs/verdent-manager/core-features/integration', publisher: 'Verdent AI', checked: '2026-10-10' },
		{ id: 'verdent-automation', title: 'Automation', url: 'https://www.verdent.ai/docs/verdent-manager/core-features/automation', publisher: 'Verdent AI', checked: '2026-10-10' },
		{ id: 'verdent-cloud-projects', title: 'Cloud Projects and Publishing', url: 'https://www.verdent.ai/docs/verdent-manager/core-features/cloud-projects-and-publishing', publisher: 'Verdent AI', checked: '2026-10-10' },
		{ id: 'verdent-byoa', title: 'Bring Your Own Agent (BYOA)', url: 'https://www.verdent.ai/docs/verdent-manager/configuration/byoa', publisher: 'Verdent AI', checked: '2026-10-10' },
		{ id: 'verdent-byok', title: 'Bring Your Own Key (BYOK)', url: 'https://www.verdent.ai/docs/verdent-manager/configuration/byok', publisher: 'Verdent AI', checked: '2026-10-10' },
		{ id: 'verdent-mcp', title: 'MCP Integration', url: 'https://www.verdent.ai/docs/verdent-manager/configuration/mcp', publisher: 'Verdent AI', checked: '2026-10-10' },
		{ id: 'verdent-workspace-isolation', title: 'Workspace Isolation', url: 'https://www.verdent.ai/docs/verdent-manager/advanced-features/workspace-isolation', publisher: 'Verdent AI', checked: '2026-10-10' },
		{ id: 'verdent-code-review', title: 'Code Review', url: 'https://www.verdent.ai/docs/verdent-manager/advanced-features/code-review', publisher: 'Verdent AI', checked: '2026-10-10' },
		{ id: 'verdent-agent-mode', title: 'Agent Mode', url: 'https://www.verdent.ai/docs/verdent-manager/advanced-features/agent-mode', publisher: 'Verdent AI', checked: '2026-10-10' },
		{ id: 'verdent-plan-mode', title: 'Plan Mode', url: 'https://www.verdent.ai/docs/verdent-manager/advanced-features/plan-mode', publisher: 'Verdent AI', checked: '2026-10-10' },
		{ id: 'verdent-cloud-overview', title: 'Verdent Cloud Overview', url: 'https://www.verdent.ai/docs/verdent-cloud/getting-started/overview', publisher: 'Verdent AI', checked: '2026-10-10' },
		{ id: 'verdent-cloud-differences', title: 'Differences from Desktop', url: 'https://www.verdent.ai/docs/verdent-cloud/workspace-and-tasks/differences-from-desktop', publisher: 'Verdent AI', checked: '2026-10-10' },
		{ id: 'verdent-vscode-requirements', title: 'System Requirements & Compatibility', url: 'https://www.verdent.ai/docs/verdent-for-vscode/getting-started/system-requirements', publisher: 'Verdent AI', checked: '2026-10-10' },
		{ id: 'verdent-claude-agent-acp', title: 'README', url: 'https://github.com/agentclientprotocol/claude-agent-acp', publisher: 'agentclientprotocol/claude-agent-acp on GitHub', checked: '2026-10-10' }
	]
};
