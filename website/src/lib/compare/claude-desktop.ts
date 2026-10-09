// Splash vs Claude Code Desktop. Facts checked 2026-10-09 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const CLAUDE_DESKTOP: Comparison = {
	slug: 'claude-desktop',
	name: 'Claude Code Desktop',
	description: 'How Splash and Claude Code Desktop compare on agents, platforms, pricing, worktrees and review, with a source for every fact.',
	checked: '2026-10-09',
	intro: 'Splash and Claude Code Desktop run several coding agent sessions at once, each in its project folder or a git worktree. Claude Code Desktop is the Code tab of Anthropic’s Claude app, a graphical interface for Claude Code with cloud and SSH sessions. Splash is a free, open-source app that drives agents from several vendors over the Agent Client Protocol.',
	other: {
		name: 'Claude Code Desktop',
		url: 'https://code.claude.com/docs/en/desktop',
		maker: 'Anthropic',
		summary: 'Anthropic’s graphical interface for Claude Code, in the Code tab of the Claude desktop app. It runs parallel sessions with optional git worktrees on your computer, over SSH, in WSL or in Anthropic’s cloud.',
		cite: ['claude-desktop-docs', 'claude-desktop-quickstart']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'The Code tab of the Claude desktop app, which also holds Chat and Cowork; Claude Code comes included', cite: ['claude-desktop-docs', 'claude-desktop-quickstart'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'Desktop 2.31226.0 in the apt repository; Linux support is beta. The bundled Claude Code has its own version number; the newest Claude Code release is 2.1.295 (8 October 2026)', cite: ['claude-desktop-apt', 'claude-desktop-linux', 'claude-desktop-docs', 'claude-desktop-changelog'] } },
				{ label: 'License', splash: S.license, other: { text: 'Proprietary and closed source; Claude Code’s repository reserves all rights, and the terms forbid reverse engineering', cite: ['claude-desktop-license', 'claude-desktop-terms'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free app; signed in to claude.ai, the Code tab needs Pro ($20 a month, or $17 a month billed yearly), Max (from $100 a month), Team or Enterprise. A 3P setup bills through its provider instead', cite: ['claude-desktop-download', 'claude-desktop-quickstart', 'claude-desktop-pricing', 'claude-desktop-3p-overview'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 11+ (universal build), Windows 10+ on x64 and ARM64, Ubuntu 22.04+ or Debian 12+ on x64 and arm64 (beta)', cite: ['claude-desktop-docs', 'claude-desktop-linux', 'claude-desktop-help-install'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code; the docs describe no way to add other agents', cite: ['claude-desktop-docs', 'claude-desktop-platforms'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Starts its own signed Claude Code binary, which the app downloads and updates; 3P settings go in through its environment and launch options. The docs don’t name the protocol', cite: ['claude-desktop-3p-install', 'claude-desktop-3p-code', 'claude-desktop-docs'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'OAuth or SSO to a claude.ai plan; a third-party (3P) setup uses Bedrock, Google Cloud, Foundry, a gateway or an Anthropic API key', cite: ['claude-desktop-linux', 'claude-desktop-auth', 'claude-desktop-3p-overview', 'claude-desktop-3p-api'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'A claude.ai account on a paid plan by default; a 3P setup can skip Anthropic sign-in', cite: ['claude-desktop-docs', 'claude-desktop-quickstart', 'claude-desktop-3p-overview', 'claude-desktop-3p-install'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Manual, Accept edits, Plan, Auto (a classifier checks actions) and Bypass permissions modes; Bypass must be turned on first', mark: 'yes', cite: ['claude-desktop-docs'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Optional git worktree per session, kept in .claude/worktrees/ by default; archiving the session removes it', mark: 'yes', cite: ['claude-desktop-docs'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Dev servers set up in .claude/launch.json and previewed in a Browser pane; .worktreeinclude copies gitignored files like .env into worktrees; setup scripts run in cloud sessions', mark: 'yes', cite: ['claude-desktop-docs', 'claude-desktop-cloud-env'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'Built-in terminal with tabs in the session folder, for local and SSH sessions; not yet in WSL', mark: 'yes', cite: ['claude-desktop-docs', 'claude-desktop-wsl'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'The sidebar groups sessions by project and filters them by status, project or environment; the docs don’t list the statuses', mark: 'partial', cite: ['claude-desktop-docs'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'OS notification when a session you aren’t viewing finishes; Dispatch sessions push to your phone when done or awaiting approval', mark: 'yes', cite: ['claude-desktop-docs'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Comment on diff lines and send them as one batch; /code-review findings can be fixed singly or all together', mark: 'yes', cite: ['claude-desktop-docs'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'Diff viewer for changed files and an integrated file editor; Manual mode lets you approve or reject every edit', mark: 'yes', cite: ['claude-desktop-docs'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Watches an open PR’s CI through gh; can fix failing checks, answer review comments and squash-merge once checks pass', mark: 'yes', cite: ['claude-desktop-docs'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'No tracker view; in local and SSH sessions, connectors such as Linear, GitHub and Notion let Claude create issues', mark: 'partial', cite: ['claude-desktop-docs'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'MCP servers from config files or the Connectors screen, plus plugins, skills and hooks shared with the CLI', mark: 'yes', cite: ['claude-desktop-docs'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'Cloud sessions on Anthropic’s infrastructure keep going after the app closes; they use plan limits, with no compute fee', mark: 'yes', cite: ['claude-desktop-docs'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'SSH sessions on Linux or macOS hosts; Remote Control shows local sessions on web and mobile, admin-enabled on Team and Enterprise', mark: 'yes', cite: ['claude-desktop-docs', 'claude-desktop-feature-availability'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'Claude for iOS and Android follows cloud and Remote Control sessions; Pro and Max can Dispatch work from a phone', mark: 'yes', cite: ['claude-desktop-platforms', 'claude-desktop-docs'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Updates itself on launch on macOS and Windows and keeps its bundled Claude Code current; on Linux, the app updates through apt', mark: 'yes', cite: ['claude-desktop-docs', 'claude-desktop-3p-code', 'claude-desktop-linux'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Resumes Claude Code CLI sessions from the same computer in a local session, searchable by title, folder or branch', mark: 'yes', cite: ['claude-desktop-docs'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Not documented; the docs describe sidebar filters, and /resume finding CLI sessions by title, folder or branch', mark: 'unknown', cite: ['claude-desktop-docs'] } },
				{ label: 'Fork a conversation', splash: S.fork, other: { text: 'Sessions can be forked, except in WSL; side chats ask about the session without adding to it', mark: 'yes', cite: ['claude-desktop-wsl', 'claude-desktop-docs'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Claude Code Desktop runs one agent, Claude Code. The app downloads a signed Claude Code binary, keeps it updated and starts it as a process; its docs don’t describe the protocol between them or mention ACP. Splash launches each agent in its registry as a subprocess and speaks the <strong>Agent Client Protocol</strong> with it over stdio.',
			cite: ['claude-desktop-docs', 'claude-desktop-3p-install', 'claude-desktop-3p-code', 'claude-desktop-llms', 'splash-registry', 'acp']
		},
		{
			title: 'Accounts and billing',
			text: 'With a claude.ai sign-in, the Code tab needs a Pro, Max, Team or Enterprise plan, and usage draws on the same pool as Claude chat. A 3P setup can skip that sign-in, sending inference and billing to Bedrock, Google Cloud, Foundry, a gateway or a Console organization. Splash is free and has no accounts; agents use their own CLI logins.',
			cite: ['claude-desktop-quickstart', 'claude-desktop-pricing', 'claude-desktop-3p-overview', 'claude-desktop-3p-api', 'splash-download', 'splash-build', 'splash-agents']
		},
		{
			title: 'Where sessions run',
			text: 'Claude Code Desktop runs sessions on your computer, inside WSL on Windows, on SSH hosts where it installs Claude Code, or in Anthropic’s cloud; the Claude mobile apps can follow cloud and local sessions. Splash runs agents as child processes on your computer, or on a machine of yours as <code>splash-server</code>, used in a browser through an SSH tunnel.',
			cite: ['claude-desktop-docs', 'claude-desktop-wsl', 'claude-desktop-platforms', 'splash-readme', 'splash-server']
		},
		{
			title: 'License and platforms',
			text: 'Claude Code Desktop is proprietary and ships for macOS 11+, Windows 10+ on x64 and ARM64, and, in beta, Ubuntu and Debian. Splash is open source under MIT and ships for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64, plus a headless server.',
			cite: ['claude-desktop-terms', 'claude-desktop-help-install', 'claude-desktop-docs', 'claude-desktop-linux', 'splash-license', 'splash-install']
		},
		{
			title: 'Around the session',
			text: 'Claude Code Desktop adds tools around each session: dev servers with a Browser pane where Claude checks its edits, CI monitoring with auto-fix and auto-merge, scheduled tasks, computer use (a research preview on Pro and Max), and Team and Enterprise admin policies. Splash adds tools for the conversations: a Needs attention queue, a review screen, transcript search, and importing sessions started elsewhere.',
			cite: ['claude-desktop-docs', 'claude-desktop-scheduled', 'splash-features', 'splash-history']
		}
	],
	fit: {
		splash: [
			'You want to run agents from several vendors side by side through one protocol.',
			'You want a free, MIT-licensed app that needs no account.',
			'You want permission requests, failures and finished turns gathered in one queue.',
			'You want to search past transcripts and import conversations your agents started elsewhere.'
		],
		other: [
			'You work with Claude Code and want the app to bundle it and keep it updated.',
			'You want cloud sessions that keep going after you close the app, and to follow them from your phone.',
			'You want dev server previews, line comments on diffs, and Claude watching PR checks, fixing failures and merging.',
			'You use Windows on ARM64 or WSL, or want sessions on SSH hosts that the app sets up for you.'
		]
	},
	sources: [
		{ id: 'claude-desktop-docs', title: 'Desktop application', url: 'https://code.claude.com/docs/en/desktop', publisher: 'Anthropic', checked: '2026-10-09' },
		{ id: 'claude-desktop-quickstart', title: 'Get started with the desktop app', url: 'https://code.claude.com/docs/en/desktop-quickstart', publisher: 'Anthropic', checked: '2026-10-09' },
		{ id: 'claude-desktop-linux', title: 'Claude Desktop on Linux (beta)', url: 'https://code.claude.com/docs/en/desktop-linux', publisher: 'Anthropic', checked: '2026-10-09' },
		{ id: 'claude-desktop-wsl', title: 'Claude Code Desktop in WSL', url: 'https://code.claude.com/docs/en/desktop-wsl', publisher: 'Anthropic', checked: '2026-10-09' },
		{ id: 'claude-desktop-platforms', title: 'Platforms and integrations', url: 'https://code.claude.com/docs/en/platforms', publisher: 'Anthropic', checked: '2026-10-09' },
		{ id: 'claude-desktop-feature-availability', title: 'Feature availability', url: 'https://code.claude.com/docs/en/feature-availability', publisher: 'Anthropic', checked: '2026-10-09' },
		{ id: 'claude-desktop-auth', title: 'Authentication', url: 'https://code.claude.com/docs/en/authentication', publisher: 'Anthropic', checked: '2026-10-09' },
		{ id: 'claude-desktop-cloud-env', title: 'Configure cloud environments', url: 'https://code.claude.com/docs/en/cloud-environments', publisher: 'Anthropic', checked: '2026-10-09' },
		{ id: 'claude-desktop-scheduled', title: 'Schedule recurring tasks in Claude Code Desktop', url: 'https://code.claude.com/docs/en/desktop-scheduled-tasks', publisher: 'Anthropic', checked: '2026-10-09' },
		{ id: 'claude-desktop-changelog', title: 'Claude Code changelog', url: 'https://code.claude.com/docs/en/changelog', publisher: 'Anthropic', checked: '2026-10-09' },
		{ id: 'claude-desktop-llms', title: 'Claude Code Docs index (llms.txt)', url: 'https://code.claude.com/docs/llms.txt', publisher: 'Anthropic', checked: '2026-10-09' },
		{ id: 'claude-desktop-pricing', title: 'Plans & pricing', url: 'https://claude.com/pricing', publisher: 'Anthropic', checked: '2026-10-09' },
		{ id: 'claude-desktop-download', title: 'Download Claude', url: 'https://claude.com/download', publisher: 'Anthropic', checked: '2026-10-09' },
		{ id: 'claude-desktop-help-install', title: 'Install Claude Desktop', url: 'https://support.claude.com/en/articles/10065433', publisher: 'Anthropic', checked: '2026-10-09' },
		{ id: 'claude-desktop-apt', title: 'claude-desktop apt Packages index (amd64)', url: 'https://downloads.claude.ai/claude-desktop/apt/stable/dists/stable/main/binary-amd64/Packages', publisher: 'Anthropic', checked: '2026-10-09' },
		{ id: 'claude-desktop-terms', title: 'Consumer Terms of Service', url: 'https://www.anthropic.com/legal/consumer-terms', publisher: 'Anthropic', checked: '2026-10-09' },
		{ id: 'claude-desktop-license', title: 'LICENSE.md', url: 'https://github.com/anthropics/claude-code/blob/main/LICENSE.md', publisher: 'anthropics/claude-code on GitHub', checked: '2026-10-09' },
		{ id: 'claude-desktop-3p-overview', title: 'Claude Desktop on 3P: Overview', url: 'https://claude.com/docs/third-party/claude-desktop/overview', publisher: 'Anthropic', checked: '2026-10-09' },
		{ id: 'claude-desktop-3p-install', title: 'Installation and setup (Claude Desktop on 3P)', url: 'https://claude.com/docs/third-party/claude-desktop/installation', publisher: 'Anthropic', checked: '2026-10-09' },
		{ id: 'claude-desktop-3p-api', title: 'Deploy Claude Desktop on 3P with the Claude API', url: 'https://claude.com/docs/third-party/claude-desktop/claude-api', publisher: 'Anthropic', checked: '2026-10-09' },
		{ id: 'claude-desktop-3p-code', title: 'Code in Claude Desktop on 3P', url: 'https://claude.com/docs/third-party/claude-desktop/code', publisher: 'Anthropic', checked: '2026-10-09' }
	]
};
