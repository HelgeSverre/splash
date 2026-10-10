// Splash vs Traycer. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const TRAYCER: Comparison = {
	slug: 'traycer',
	name: 'Traycer',
	description: 'How Splash and Traycer compare on agents, accounts, pricing, worktrees, review and mobile access, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Traycer are desktop apps that run several coding agents at once, each in a project folder or a git worktree. Traycer groups work into Tasks with shared plans and reviews, runs agents through a background Host, and syncs Tasks to its cloud. Splash drives each agent over the Agent Client Protocol and keeps transcripts in a local database.',
	other: {
		name: 'Traycer',
		url: 'https://traycer.ai/',
		maker: 'Traycer AI',
		summary: 'A desktop app, with open-source clients, that runs Claude Code, Codex, Cursor and 19 other coding agents in parallel, grouped into Tasks with shared plans, code review and cloud sync.',
		cite: ['traycer-docs', 'traycer-contributing', 'traycer-coding-agents', 'traycer-sync']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Electron desktop app whose agents run in a background Host process, plus iOS and Android apps and a traycer CLI', cite: ['traycer-docs', 'traycer-desktop-package', 'traycer-hosts', 'traycer-mobile', 'traycer-install'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'Desktop 1.5.0, released 7 October 2026; the first public version, 1.0.0, came out 23 June 2026', cite: ['traycer-desktop-1-5-0', 'traycer-desktop-1-0-0'] } },
				{ label: 'License', splash: S.license, other: { text: 'MIT for the public repo of clients, CLI and protocol; the signed Host binaries are built in Traycer’s internal repository', cite: ['traycer-license', 'traycer-contributing'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free for individuals; Sync for teams costs $20 per user a month ($16 yearly); optional credits pay for Traycer Inference', cite: ['traycer-docs-pricing', 'traycer-pricing'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 12+ (Apple silicon and Intel), Windows x64, Linux x64 (AppImage, .deb, .rpm); iPhone and iPad via TestFlight, Android', cite: ['traycer-install', 'traycer-desktop-1-5-0'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: '22 agents, including Claude Code, Codex, OpenCode, Cursor, Copilot and Traycer Inference; the docs list no way to add more', cite: ['traycer-coding-agents', 'traycer-providers'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'SDKs for Claude Code, OpenCode and Cursor, ACP for 11 others per source comments, and a terminal (PTY) mode for three', cite: ['traycer-host-1-0-0', 'traycer-shared-ts', 'traycer-agent-runtime', 'traycer-host-changelog', 'traycer-terminal-agents'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Downloads most agent CLIs itself; each agent uses your own account, API key or CLI login. Traycer Inference bills Traycer credits', cite: ['traycer-coding-agents', 'traycer-providers', 'traycer-docs-pricing'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'Yes, a Traycer account via GitHub, Google, Apple or an emailed code; no SSO, and no account-free mode is documented', cite: ['traycer-first-run', 'traycer-sign-in', 'traycer-teams'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Approve or Deny cards outside Full access; new chats default to Full access, the mode Amp and Cursor always use', mark: 'yes', cite: ['traycer-agents-panel', 'traycer-quickstart'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Add MCP servers (HTTP, SSE or stdio), plugins and skills for each agent provider; five providers have no MCP settings', mark: 'yes', cite: ['traycer-mcp', 'traycer-providers'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Per folder: the local checkout, a new worktree on a new branch, or an existing one; agents can also add worktrees', mark: 'yes', cite: ['traycer-worktrees'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Setup and teardown scripts in .traycer/environment.json; the browser lists dev servers terminals print, and agents can forward ports between hosts', mark: 'yes', cite: ['traycer-scripts', 'traycer-browsers', 'traycer-port-forwarding'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'A Needs attention list and optional Home tab; alerts by system notification, phone push, sound, or a script or HTTP hook', mark: 'yes', cite: ['traycer-notifications', 'traycer-changelog'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Agents start child agents, message one another and read transcripts, across Tasks and hosts', mark: 'yes', cite: ['traycer-agent-to-agent'] } },
				{ label: 'Team collaboration', hint: 'Several people on the same work', splash: { text: 'splash-server is a personal, single-user service, not a multi-user deployment', mark: 'no', cite: ['splash-server'] }, other: { text: 'Share a Task with invited people as Owner, Editor or Viewer on any plan; whole-team sharing needs Sync', mark: 'yes', cite: ['traycer-sharing', 'traycer-docs-pricing'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'Browser tabs open as tiles beside agents; agents use them as you watch and check with you before paying or deleting', mark: 'yes', cite: ['traycer-browsers'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Review all opens an agent’s edits as one diff; undo per file or turn; a review agent writes prioritized findings', mark: 'yes', cite: ['traycer-review-guide'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'No create or merge button is documented; the guide says to ask the agent to push the branch and open one', mark: 'no', cite: ['traycer-pull-requests', 'traycer-parallel-guide'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Pull Requests panel, via gh, with checks and reviews for a Task’s branches; Fix in chat quotes failures into the composer', mark: 'yes', cite: ['traycer-pull-requests'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'None documented; specs, tickets and stories live as Artifacts inside each Task', mark: 'no', cite: ['traycer-artifacts'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Install the traycer CLI on another machine and add it as a host, reached through Traycer’s relay; on every plan', mark: 'yes', cite: ['traycer-remote-hosts', 'traycer-host-changelog', 'traycer-docs-pricing'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'iOS (TestFlight beta) and Android apps with the desktop interface; they steer agents on your hosts via the relay', mark: 'yes', cite: ['traycer-mobile', 'traycer-install'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Imports Claude Code, Codex and OpenCode sessions from the host into Tasks to continue there; other agents’ sessions aren’t listed', mark: 'partial', cite: ['traycer-first-run'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'History finds Tasks by title, repo, branch or PR, and chat search covers messages on this machine, except terminal agents', mark: 'yes', cite: ['traycer-history', 'traycer-changelog'] } },
				{ label: 'Where chats are kept', splash: { text: 'A local copy of each transcript in Splash’s SQLite database, on the computer or server running it', cite: ['splash-how', 'splash-history', 'splash-server'] }, other: { text: 'Chats live on the host and in Traycer’s cloud, synced across devices; no opt-out is documented. Terminal agents stay local', cite: ['traycer-sync', 'traycer-host-changelog'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Traycer’s Host reaches Claude Code, OpenCode and Cursor through their SDKs, 11 agents such as Kiro and Copilot over ACP (per its source code), and several others through their own SDKs or RPC modes. Its docs list 22 agents and no way to add others. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, natively or through an adapter.',
			cite: ['traycer-host-1-0-0', 'traycer-shared-ts', 'traycer-agent-runtime', 'traycer-senders', 'traycer-coding-agents', 'splash-registry', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'Traycer runs agents in a Host process on each of your machines; remote hosts are reached through Traycer’s relay, from the desktop app or the iOS and Android apps. Its pricing page lists Cloud sandboxes at extra cost, which no docs page describes. Splash runs agents on your computer, or under <code>splash-server</code> reached through an SSH tunnel.',
			cite: ['traycer-hosts', 'traycer-remote-hosts', 'traycer-mobile', 'traycer-pricing', 'splash-readme', 'splash-server']
		},
		{
			title: 'Accounts, cloud and license',
			text: 'Traycer requires an account, keeps a cloud copy of each chat agent and collects product usage data tied to that account. It is free for individuals; the Sync team plan costs $20 per user a month. Its clients, CLI and protocol are MIT-licensed; Host binaries are built in an internal repository. Splash is free, MIT-licensed and has no accounts.',
			cite: ['traycer-first-run', 'traycer-sync', 'traycer-changelog', 'traycer-docs-pricing', 'traycer-license', 'traycer-contributing', 'splash-license', 'splash-download', 'splash-build']
		},
		{
			title: 'Usage and accounts per agent',
			text: 'Traycer reads provider usage limits, warns when an account runs low and, with <strong>Route automatically</strong> on, moves a chat that hits a limit to another account or an equivalent model; Claude Code, Codex, Grok and Antigravity can hold several account profiles. Splash shows context and cost readouts when an agent reports them, using the agent’s own CLI login.',
			cite: ['traycer-usage-limits', 'traycer-coding-agents', 'splash-features', 'splash-agents']
		},
		{
			title: 'Workflow focus',
			text: 'Traycer centers on Tasks: plans, specs and tickets as versioned Artifacts with comments, built-in planning and review skills, agents that start and message other agents, a built-in browser, and setup scripts for new worktrees. Splash centers on the conversation: a rendered transcript, a Needs attention queue, review of changed files, transcript search and importing sessions agents list over ACP.',
			cite: ['traycer-artifacts', 'traycer-review-guide', 'traycer-agent-to-agent', 'traycer-browsers', 'traycer-scripts', 'splash-features', 'splash-history']
		}
	],
	fit: {
		splash: [
			'You want a free, MIT-licensed app that needs no account and keeps transcripts in a local database.',
			'You want each agent driven over the Agent Client Protocol, with permission requests answered in the transcript.',
			'You want to import conversations from any agent that lists them over ACP and search them with archived sessions.',
			'You want a GitHub view of issues, pull requests and Actions runs across your repositories.'
		],
		other: [
			'You want Tasks that hold plans, specs and reviews next to the agents working on them.',
			'You want agents that start and message other agents, with a built-in browser they can drive.',
			'You want to follow and steer agents from iOS or Android, or run them on remote hosts through a relay.',
			'You want to share Tasks with others and run setup scripts in each new worktree.'
		]
	},
	sources: [
		{ id: 'traycer-docs', title: 'What is Traycer?', url: 'https://docs.traycer.ai/', publisher: 'Traycer AI', checked: '2026-10-10' },
		{ id: 'traycer-contributing', title: 'CONTRIBUTING.md', url: 'https://github.com/traycerai/traycer/blob/main/CONTRIBUTING.md', publisher: 'traycerai/traycer on GitHub', checked: '2026-10-10' },
		{ id: 'traycer-coding-agents', title: 'Agents & Models', url: 'https://docs.traycer.ai/agents-and-models/coding-agents', publisher: 'Traycer AI', checked: '2026-10-10' },
		{ id: 'traycer-sync', title: 'Sync and offline', url: 'https://docs.traycer.ai/concepts/sync-and-offline', publisher: 'Traycer AI', checked: '2026-10-10' },
		{ id: 'traycer-desktop-package', title: 'clients/desktop/package.json', url: 'https://github.com/traycerai/traycer/blob/main/clients/desktop/package.json', publisher: 'traycerai/traycer on GitHub', checked: '2026-10-10' },
		{ id: 'traycer-hosts', title: 'Hosts', url: 'https://docs.traycer.ai/concepts/hosts', publisher: 'Traycer AI', checked: '2026-10-10' },
		{ id: 'traycer-mobile', title: 'Mobile App', url: 'https://docs.traycer.ai/account/mobile-app', publisher: 'Traycer AI', checked: '2026-10-10' },
		{ id: 'traycer-install', title: 'Install', url: 'https://docs.traycer.ai/install', publisher: 'Traycer AI', checked: '2026-10-10' },
		{ id: 'traycer-desktop-1-5-0', title: 'Traycer Desktop 1.5.0', url: 'https://github.com/traycerai/traycer/releases/tag/desktop-v1.5.0', publisher: 'traycerai/traycer on GitHub', checked: '2026-10-10' },
		{ id: 'traycer-desktop-1-0-0', title: 'Traycer Desktop 1.0.0', url: 'https://github.com/traycerai/traycer/releases/tag/desktop-v1.0.0', publisher: 'traycerai/traycer on GitHub', checked: '2026-10-10' },
		{ id: 'traycer-license', title: 'LICENSE', url: 'https://github.com/traycerai/traycer/blob/main/LICENSE', publisher: 'traycerai/traycer on GitHub', checked: '2026-10-10' },
		{ id: 'traycer-docs-pricing', title: 'Pricing', url: 'https://docs.traycer.ai/account/pricing', publisher: 'Traycer AI', checked: '2026-10-10' },
		{ id: 'traycer-pricing', title: 'Pricing - Traycer AI', url: 'https://traycer.ai/pricing', publisher: 'Traycer AI', checked: '2026-10-10' },
		{ id: 'traycer-providers', title: 'Providers', url: 'https://docs.traycer.ai/settings/providers', publisher: 'Traycer AI', checked: '2026-10-10' },
		{ id: 'traycer-host-1-0-0', title: 'Traycer Host 1.0.0', url: 'https://github.com/traycerai/traycer/releases/tag/host-v1.0.0', publisher: 'traycerai/traycer on GitHub', checked: '2026-10-10' },
		{ id: 'traycer-shared-ts', title: 'protocol/src/host/agent/shared.ts', url: 'https://github.com/traycerai/traycer/blob/main/protocol/src/host/agent/shared.ts', publisher: 'traycerai/traycer on GitHub', checked: '2026-10-10' },
		{ id: 'traycer-agent-runtime', title: 'protocol/src/host/agent/gui/agent-runtime.ts', url: 'https://github.com/traycerai/traycer/blob/main/protocol/src/host/agent/gui/agent-runtime.ts', publisher: 'traycerai/traycer on GitHub', checked: '2026-10-10' },
		{ id: 'traycer-senders', title: 'protocol/src/persistence/epic/senders.ts', url: 'https://github.com/traycerai/traycer/blob/main/protocol/src/persistence/epic/senders.ts', publisher: 'traycerai/traycer on GitHub', checked: '2026-10-10' },
		{ id: 'traycer-host-changelog', title: 'Host Changelog', url: 'https://docs.traycer.ai/host/changelog', publisher: 'Traycer AI', checked: '2026-10-10' },
		{ id: 'traycer-terminal-agents', title: 'Terminal Agents VS Terminals', url: 'https://docs.traycer.ai/concepts/terminal-agents-vs-terminals', publisher: 'Traycer AI', checked: '2026-10-10' },
		{ id: 'traycer-first-run', title: 'First run and importing', url: 'https://docs.traycer.ai/first-run', publisher: 'Traycer AI', checked: '2026-10-10' },
		{ id: 'traycer-sign-in', title: 'Sign In', url: 'https://docs.traycer.ai/account/sign-in', publisher: 'Traycer AI', checked: '2026-10-10' },
		{ id: 'traycer-teams', title: 'Teams', url: 'https://docs.traycer.ai/account/teams', publisher: 'Traycer AI', checked: '2026-10-10' },
		{ id: 'traycer-agents-panel', title: 'Agents', url: 'https://docs.traycer.ai/panels/agents', publisher: 'Traycer AI', checked: '2026-10-10' },
		{ id: 'traycer-quickstart', title: 'Quickstart', url: 'https://docs.traycer.ai/quickstart', publisher: 'Traycer AI', checked: '2026-10-10' },
		{ id: 'traycer-mcp', title: 'MCP servers', url: 'https://docs.traycer.ai/settings/providers/mcp-servers', publisher: 'Traycer AI', checked: '2026-10-10' },
		{ id: 'traycer-worktrees', title: 'Worktrees', url: 'https://docs.traycer.ai/concepts/worktrees', publisher: 'Traycer AI', checked: '2026-10-10' },
		{ id: 'traycer-scripts', title: 'Setup and teardown scripts', url: 'https://docs.traycer.ai/concepts/worktrees/scripts', publisher: 'Traycer AI', checked: '2026-10-10' },
		{ id: 'traycer-browsers', title: 'Browsers', url: 'https://docs.traycer.ai/panels/browsers', publisher: 'Traycer AI', checked: '2026-10-10' },
		{ id: 'traycer-port-forwarding', title: 'Port forwarding', url: 'https://docs.traycer.ai/concepts/hosts/port-forwarding', publisher: 'Traycer AI', checked: '2026-10-10' },
		{ id: 'traycer-notifications', title: 'Notifications', url: 'https://docs.traycer.ai/concepts/notifications', publisher: 'Traycer AI', checked: '2026-10-10' },
		{ id: 'traycer-changelog', title: 'Changelog', url: 'https://docs.traycer.ai/changelog', publisher: 'Traycer AI', checked: '2026-10-10' },
		{ id: 'traycer-agent-to-agent', title: 'Agent-to-Agent', url: 'https://docs.traycer.ai/concepts/agent-to-agent', publisher: 'Traycer AI', checked: '2026-10-10' },
		{ id: 'traycer-sharing', title: 'Sharing', url: 'https://docs.traycer.ai/panels/sharing', publisher: 'Traycer AI', checked: '2026-10-10' },
		{ id: 'traycer-review-guide', title: 'Review agent changes', url: 'https://docs.traycer.ai/guides/review-agent-changes', publisher: 'Traycer AI', checked: '2026-10-10' },
		{ id: 'traycer-pull-requests', title: 'Pull Requests', url: 'https://docs.traycer.ai/panels/pull-requests', publisher: 'Traycer AI', checked: '2026-10-10' },
		{ id: 'traycer-parallel-guide', title: 'Run agents in parallel on worktrees', url: 'https://docs.traycer.ai/guides/parallel-agents-on-worktrees', publisher: 'Traycer AI', checked: '2026-10-10' },
		{ id: 'traycer-artifacts', title: 'Artifacts', url: 'https://docs.traycer.ai/panels/artifacts', publisher: 'Traycer AI', checked: '2026-10-10' },
		{ id: 'traycer-remote-hosts', title: 'Remote hosts', url: 'https://docs.traycer.ai/concepts/hosts/remote-hosts', publisher: 'Traycer AI', checked: '2026-10-10' },
		{ id: 'traycer-history', title: 'History', url: 'https://docs.traycer.ai/concepts/history', publisher: 'Traycer AI', checked: '2026-10-10' },
		{ id: 'traycer-usage-limits', title: 'Usage limits and model routing', url: 'https://docs.traycer.ai/agents-and-models/usage-limits-and-routing', publisher: 'Traycer AI', checked: '2026-10-10' }
	]
};
