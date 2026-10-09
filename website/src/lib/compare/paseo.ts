// Splash vs Paseo. Facts checked 2026-10-09 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const PASEO: Comparison = {
	slug: 'paseo',
	name: 'Paseo',
	description: 'How Splash and Paseo compare on agents, platforms, pricing, worktrees, mobile and remote access, and review, with a source for every fact.',
	checked: '2026-10-09',
	intro: 'Splash and Paseo run several coding agents at once, in your project folder or in separate git worktrees. Paseo runs a daemon that manages the agents, and its desktop, mobile, web and command-line apps connect to it; Splash is a desktop app, or a headless server used in a browser, that talks to every agent over the Agent Client Protocol.',
	other: {
		name: 'Paseo',
		url: 'https://paseo.sh',
		maker: 'Mohamed Boudra Ziani',
		summary: 'An open-source app its maker calls an agentic development environment: a local daemon runs coding agents in parallel, and apps for desktop, mobile, web and the command line connect to it.',
		cite: ['paseo-readme', 'paseo-home', 'paseo-privacy']
	},
	groups: [
		{ title: 'The basics', rows: [
			{ label: 'What it is', splash: S.formFactor, other: { text: 'A daemon that runs your agents, which desktop, mobile, web and CLI apps connect to; the desktop app starts its own daemon', cite: ['paseo-readme', 'paseo-getting-started'] } },
			{ label: 'Release status', splash: S.maturity, other: { text: 'v0.11.2, released 9 October 2026, with Stable and Beta update channels', cite: ['paseo-release', 'paseo-updates'] } },
			{ label: 'License', splash: S.license, other: { text: 'Open source (Apache 2.0), including the self-hostable Hub', cite: ['paseo-license', 'paseo-hub-repo'] } },
			{ label: 'Price', splash: S.price, other: { text: 'Free. Optional Paseo Hub: free self-hosted; hosted Free with 50 agent runs a month, or Pro at $15 per seat a month', cite: ['paseo-home', 'paseo-hub'] } },
			{ label: 'Built with', splash: S.tech, other: { text: 'Electron for the desktop app and Expo for iOS, Android and web; the official relay is written in Elixir', cite: ['paseo-readme'] } }
		] },
		{ title: 'Agents', rows: [
			{ label: 'Agents', splash: S.agents, other: { text: 'Bundled adapters for Claude Code, Codex, OpenCode, Pi, Antigravity and Muse Code; one-click installs of 30+ ACP agents, or add your own', cite: ['paseo-supported-providers', 'paseo-providers', 'paseo-custom-providers'] } },
			{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each installed CLI as a subprocess, through a provider adapter such as the Claude Agent SDK, Codex’s app-server, or ACP for catalog agents', cite: ['paseo-providers', 'paseo-claude-code', 'paseo-codex'] } },
			{ label: 'Agent sign-in', hint: 'Logging agents in and paying for models', splash: S.signIn, other: { text: 'Uses each CLI’s login, plan or API key at no added charge; background title and commit-message calls use them too', cite: ['paseo-home', 'paseo-security', 'paseo-claude-code', 'paseo-codex', 'paseo-metadata'] } },
			{ label: 'Permission requests', splash: S.permissions, other: { text: 'Answered on permission cards in the app, with paseo permit in the CLI, through MCP tools or by plugins; modes vary by provider, and Antigravity always runs in Full access', mark: 'yes', cite: ['paseo-changelog', 'paseo-cli', 'paseo-mcp', 'paseo-readme', 'paseo-supported-providers'] } },
			{
				label: 'Agents handing off work',
				hint: 'One agent launching or messaging another',
				splash: S.handoff,
				other: { text: 'Agents can start agents on any configured provider, create worktrees and message each other, through the Paseo CLI or its MCP tools (off by default)', mark: 'yes', cite: ['paseo-orchestration', 'paseo-mcp', 'paseo-cli'] }
			}
		] },
		{ title: 'Working in parallel', rows: [
			{ label: 'Isolation per session', hint: 'Where each agent’s work happens', splash: S.isolation, other: { text: 'Your checkout or a managed git worktree on its own branch, per workspace; agents in one workspace share its folder', mark: 'yes', cite: ['paseo-workspaces', 'paseo-parallel'] } },
			{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'paseo.json sets worktree setup and teardown, scripts and auto-opened terminals; dev servers and other services get their own port and hostname', mark: 'yes', cite: ['paseo-worktrees'] } },
			{
				label: 'Built-in browser',
				hint: 'A browser agents can see and use',
				splash: S.browser,
				other: { text: 'Browser tabs in the desktop app that agents can drive, once their browser tools are switched on', mark: 'yes', cite: ['paseo-browser', 'paseo-parallel'] }
			},
			{ label: 'Terminal', splash: S.terminal, other: { text: 'Terminals in each workspace, usable from desktop, web and mobile, and scriptable with paseo terminal commands', mark: 'yes', cite: ['paseo-claude-code', 'paseo-parallel', 'paseo-cli'] } },
			{ label: 'What needs you', splash: S.attention, other: { text: 'Workspaces can be grouped by status: Needs input, Failed, Ready to review, Working or Done; opening one focuses the waiting agent', mark: 'yes', cite: ['paseo-app-strings', 'paseo-changelog'] } },
			{ label: 'Notifications', splash: S.notifications, other: { text: 'Desktop notifications, and push notifications to the phone when a task finishes; a parent agent hears when a child it started ends, fails or asks for permission', mark: 'yes', cite: ['paseo-changelog', 'paseo-app-store', 'paseo-mcp'] } },
			{
				label: 'Scheduled and triggered runs',
				hint: 'Agents that start without a prompt from you',
				splash: S.scheduler,
				other: { text: 'Cron schedules and recurring heartbeats; with Hub, GitHub events and Slack or Discord mentions start Claude, Codex or OpenCode agents', mark: 'yes', cite: ['paseo-schedules', 'paseo-hub', 'paseo-hub-triggers'] }
			}
		] },
		{ title: 'Review and shipping', rows: [
			{ label: 'Review changes', splash: S.review, other: { text: 'A Changes view of each workspace’s diff, with comments on diff lines sent to the agent as a review', mark: 'yes', cite: ['paseo-parallel', 'paseo-changelog', 'paseo-review-pr'] } },
			{ label: 'Files and diffs', splash: S.files, other: { text: 'A Files view for browsing and editing the workspace’s source, next to its Changes diff', mark: 'yes', cite: ['paseo-parallel'] } },
			{ label: 'Create pull requests', splash: S.prs, other: { text: 'Commit, push, open, watch checks and reviews, and merge PRs, on GitHub, GitLab, Gitea, Forgejo and Codeberg', mark: 'yes', cite: ['paseo-conductor', 'paseo-app-strings', 'paseo-changelog'] } },
			{ label: 'GitHub', splash: S.github, other: { text: 'Send a PR’s comments, reviews and failed check logs to an agent; open an existing PR as its own worktree, using gh', mark: 'yes', cite: ['paseo-changelog', 'paseo-worktrees', 'paseo-getting-started'] } },
			{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'Issues from GitHub, GitLab and other forges attach as context; an example plugin adds Linear, a community plugin opens Jira links', mark: 'partial', cite: ['paseo-changelog', 'paseo-app-strings', 'paseo-linear-plugin', 'paseo-jira-plugin'] } }
		] },
		{ title: 'Where it runs', rows: [
			{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 13+ (Apple silicon, Intel), Windows x64 and ARM64, Linux x64 (AppImage, DEB, RPM); a headless daemon via npm, Nix or Docker', cite: ['paseo-download', 'paseo-release', 'paseo-readme'] } },
			{
				label: 'Mobile app',
				splash: S.mobile,
				other: { text: 'iOS 15.1+ and Android apps that connect to a daemon you run; store builds can lag desktop releases', mark: 'yes', cite: ['paseo-app-store', 'paseo-download', 'paseo-updates'] }
			},
			{ label: 'Remote access', splash: S.remote, other: { text: 'Desktop and CLI connect over SSH; clients can also use an opt-in end-to-end encrypted relay or a direct link such as Tailscale', mark: 'yes', cite: ['paseo-connectivity', 'paseo-security'] } },
			{ label: 'Cloud execution', splash: S.cloud, other: { text: 'No hosted agents; they run on daemons you operate, from a laptop to a VPS or a Docker container', mark: 'no', cite: ['paseo-security', 'paseo-hub'] } },
			{ label: 'Auto-update', splash: S.updates, other: { text: 'The desktop app checks GitHub Releases on a Stable or Beta channel; stable releases roll out over 36 hours', mark: 'yes', cite: ['paseo-updates', 'paseo-privacy'] } }
		] },
		{ title: 'History and search', rows: [
			{ label: 'Existing agent history', hint: 'Sessions started outside the app', splash: S.history, other: { text: 'Imports and resumes Claude, Codex, OpenCode, Pi, OMP, Kimi and other ACP sessions, from the New workspace screen or the CLI', mark: 'yes', cite: ['paseo-changelog'] } },
			{ label: 'Search transcripts', splash: S.search, other: { text: 'History search matches workspace, agent, project and branch; Cmd/Ctrl+F finds messages within one chat', mark: 'partial', cite: ['paseo-changelog'] } }
		] },
		{ title: 'Plugins and voice', rows: [
			{
				label: 'Plugins',
				hint: 'Code that adds to the app',
				splash: { text: 'No plugin system; Settings lists the MCP servers, skills and commands of each agent, read-only', mark: 'no', cite: ['splash-features'] },
				other: { text: 'Daemon-side plugins that every connected client shows, adding screens, panels, slash commands, themes, agent lifecycle hooks or providers; a public registry lists them', mark: 'yes', cite: ['paseo-readme', 'paseo-plugins', 'paseo-plugin-registry'] }
			},
			{
				label: 'Voice',
				hint: 'Speaking to agents instead of typing',
				splash: { text: 'No voice input or dictation', mark: 'no', cite: ['splash-features'] },
				other: { text: 'Dictation and a voice mode; speech runs on-device by default, or through OpenAI if you choose', mark: 'yes', cite: ['paseo-voice', 'paseo-readme'] }
			}
		] }
	],
	differences: [
		{
			title: 'How each connects to agents',
			text: 'Paseo reaches agents through provider adapters, among them the Claude Agent SDK for Claude Code, Codex’s app-server, Pi’s RPC mode, and ACP for Copilot, catalog and custom agents. Any agent CLI can also run in a Paseo terminal. Splash speaks the Agent Client Protocol to every agent, natively or through a pinned adapter for the vendor’s CLI.',
			cite: ['paseo-claude-code', 'paseo-codex', 'paseo-provider-internals', 'paseo-providers', 'paseo-conductor', 'splash-registry', 'acp']
		},
		{
			title: 'Where the agents run',
			text: 'Paseo’s daemon runs on your laptop, a server or a Docker container; its desktop, web, iOS, Android and CLI clients reach it over SSH (desktop and CLI), an opt-in encrypted relay or a direct connection. Splash runs agents on the computer running the app, or on a machine of yours running <code>splash-server</code>, opened in a browser over an SSH tunnel.',
			cite: ['paseo-security', 'paseo-connectivity', 'paseo-readme', 'splash-readme', 'splash-server']
		},
		{
			title: 'Pricing and the Hub',
			text: 'Paseo’s apps are free under Apache 2.0. <strong>Paseo Hub</strong>, a separate, optional service that starts agents on your own daemons from GitHub, Slack or Discord, is free to self-host; hosted Hub is free for 50 runs a month and one seat, or $15 per seat a month. Splash is free under the MIT license.',
			cite: ['paseo-home', 'paseo-license', 'paseo-hub', 'paseo-hub-repo', 'splash-download', 'splash-license']
		},
		{
			title: 'Workspaces and worktrees',
			text: 'A Paseo workspace is your checkout or a managed worktree, and can hold several agents and terminals that share it; from a repo’s <code>paseo.json</code>, Paseo runs setup and teardown and supervises dev servers on their own ports. A Splash session is one agent in its project folder or a worktree on a <code>splash/…</code> branch; Splash runs no setup scripts.',
			cite: ['paseo-workspaces', 'paseo-parallel', 'paseo-worktrees', 'splash-readme', 'splash-features', 'splash-worktree']
		},
		{
			title: 'Scripting and automation',
			text: 'Paseo can be scripted: a CLI that can do whatever the app does, a TypeScript SDK, MCP tools that let agents start and message other agents, cron schedules, and plugins that run on the daemon. In Splash, an agent starts when you create, continue or prompt a session, and each session is one agent in one folder.',
			cite: ['paseo-readme', 'paseo-mcp', 'paseo-orchestration', 'paseo-schedules', 'paseo-plugins', 'splash-how', 'splash-readme']
		}
	],
	fit: {
		splash: [
			'You want every agent driven over the Agent Client Protocol, with its transcript, tool calls and permission requests in one window.',
			'You want permission requests, failures and finished turns in one queue that survives restarts.',
			'You want to search the saved text of your Splash conversations, including ones imported from your agents’ own history.',
			'You want to triage GitHub issues, pull requests and Actions runs across many repositories next to your sessions.'
		],
		other: [
			'You want to follow and steer agents from iOS, Android or the web as well as the desktop.',
			'You want worktrees prepared by setup scripts, dev servers on their own ports, and browser tabs agents can drive.',
			'You want to commit, open and merge pull requests in the app, on GitHub, GitLab, Gitea, Forgejo or Codeberg.',
			'You want agents to start other agents, run on a cron schedule, or start from GitHub, Slack or Discord through Hub.'
		]
	},
	sources: [
		{ id: 'paseo-readme', title: 'Paseo README', url: 'https://github.com/getpaseo/paseo#readme', publisher: 'getpaseo/paseo on GitHub', checked: '2026-10-09' },
		{ id: 'paseo-home', title: 'Paseo – Run Claude Code, Codex, Copilot, OpenCode from anywhere', url: 'https://paseo.sh/', publisher: 'Paseo', checked: '2026-10-09' },
		{ id: 'paseo-privacy', title: 'Privacy Policy', url: 'https://paseo.sh/privacy', publisher: 'Paseo', checked: '2026-10-09' },
		{ id: 'paseo-getting-started', title: 'Getting started', url: 'https://paseo.sh/docs', publisher: 'Paseo', checked: '2026-10-09' },
		{ id: 'paseo-release', title: 'Paseo v0.11.2', url: 'https://github.com/getpaseo/paseo/releases/tag/v0.11.2', publisher: 'getpaseo/paseo on GitHub', checked: '2026-10-09' },
		{ id: 'paseo-updates', title: 'Updates', url: 'https://paseo.sh/docs/updates', publisher: 'Paseo', checked: '2026-10-09' },
		{ id: 'paseo-license', title: 'LICENSE', url: 'https://github.com/getpaseo/paseo/blob/main/LICENSE', publisher: 'getpaseo/paseo on GitHub', checked: '2026-10-09' },
		{ id: 'paseo-hub-repo', title: 'getpaseo/hub', url: 'https://github.com/getpaseo/hub', publisher: 'getpaseo/hub on GitHub', checked: '2026-10-09' },
		{ id: 'paseo-hub', title: 'Paseo Hub', url: 'https://paseo.sh/hub', publisher: 'Paseo', checked: '2026-10-09' },
		{ id: 'paseo-supported-providers', title: 'Supported providers', url: 'https://paseo.sh/docs/supported-providers', publisher: 'Paseo', checked: '2026-10-09' },
		{ id: 'paseo-providers', title: 'Providers', url: 'https://paseo.sh/docs/providers', publisher: 'Paseo', checked: '2026-10-09' },
		{ id: 'paseo-custom-providers', title: 'Custom providers', url: 'https://paseo.sh/docs/custom-providers', publisher: 'Paseo', checked: '2026-10-09' },
		{ id: 'paseo-claude-code', title: 'Claude Code', url: 'https://paseo.sh/docs/claude-code', publisher: 'Paseo', checked: '2026-10-09' },
		{ id: 'paseo-codex', title: 'Codex', url: 'https://paseo.sh/docs/codex', publisher: 'Paseo', checked: '2026-10-09' },
		{ id: 'paseo-security', title: 'Security', url: 'https://paseo.sh/docs/security', publisher: 'Paseo', checked: '2026-10-09' },
		{ id: 'paseo-metadata', title: 'Metadata generation', url: 'https://paseo.sh/docs/metadata-generation', publisher: 'Paseo', checked: '2026-10-09' },
		{ id: 'paseo-orchestration', title: 'Orchestration', url: 'https://paseo.sh/docs/orchestration', publisher: 'Paseo', checked: '2026-10-09' },
		{ id: 'paseo-mcp', title: 'MCP reference', url: 'https://paseo.sh/docs/mcp', publisher: 'Paseo', checked: '2026-10-09' },
		{ id: 'paseo-workspaces', title: 'Workspaces', url: 'https://paseo.sh/docs/workspaces', publisher: 'Paseo', checked: '2026-10-09' },
		{ id: 'paseo-parallel', title: 'Run parallel tasks', url: 'https://paseo.sh/docs/parallel-development', publisher: 'Paseo', checked: '2026-10-09' },
		{ id: 'paseo-worktrees', title: 'Git worktrees', url: 'https://paseo.sh/docs/worktrees', publisher: 'Paseo', checked: '2026-10-09' },
		{ id: 'paseo-browser', title: 'Browser automation', url: 'https://paseo.sh/docs/browser', publisher: 'Paseo', checked: '2026-10-09' },
		{ id: 'paseo-app-strings', title: 'packages/app/src/i18n/resources/en.ts', url: 'https://github.com/getpaseo/paseo/blob/main/packages/app/src/i18n/resources/en.ts', publisher: 'getpaseo/paseo on GitHub', checked: '2026-10-09' },
		{ id: 'paseo-changelog', title: 'CHANGELOG.md', url: 'https://github.com/getpaseo/paseo/blob/main/CHANGELOG.md', publisher: 'getpaseo/paseo on GitHub', checked: '2026-10-09' },
		{ id: 'paseo-schedules', title: 'Schedules', url: 'https://paseo.sh/docs/schedules', publisher: 'Paseo', checked: '2026-10-09' },
		{ id: 'paseo-hub-triggers', title: 'Hub triggers', url: 'https://paseo.sh/docs/hub/triggers', publisher: 'Paseo', checked: '2026-10-09' },
		{ id: 'paseo-review-pr', title: 'Add inline review comments to git diff pane, pull request #530', url: 'https://github.com/getpaseo/paseo/pull/530', publisher: 'getpaseo/paseo on GitHub', checked: '2026-10-09' },
		{ id: 'paseo-conductor', title: 'Paseo vs Conductor', url: 'https://paseo.sh/alternatives/conductor', publisher: 'Paseo', checked: '2026-10-09' },
		{ id: 'paseo-linear-plugin', title: 'plugin-examples/linear/README.md', url: 'https://github.com/getpaseo/paseo/blob/main/plugin-examples/linear/README.md', publisher: 'getpaseo/paseo on GitHub', checked: '2026-10-09' },
		{ id: 'paseo-jira-plugin', title: 'Jira Tickets – Paseo plugin', url: 'https://paseo.sh/plugins/ariel1safar/jira', publisher: 'Paseo', checked: '2026-10-09' },
		{ id: 'paseo-download', title: 'Download Paseo for macOS, Windows, Linux, iOS, and Android', url: 'https://paseo.sh/download', publisher: 'Paseo', checked: '2026-10-09' },
		{ id: 'paseo-app-store', title: 'Paseo - Remote Coding Agents', url: 'https://apps.apple.com/app/paseo-pocket-engineer/id6758887924', publisher: 'Apple App Store', checked: '2026-10-09' },
		{ id: 'paseo-connectivity', title: 'Connectivity', url: 'https://paseo.sh/docs/connectivity', publisher: 'Paseo', checked: '2026-10-09' },
		{ id: 'paseo-provider-internals', title: 'docs/providers.md', url: 'https://github.com/getpaseo/paseo/blob/main/docs/providers.md', publisher: 'getpaseo/paseo on GitHub', checked: '2026-10-09' },
		{ id: 'paseo-plugins', title: 'Plugin quickstart', url: 'https://paseo.sh/docs/plugins', publisher: 'Paseo', checked: '2026-10-09' },
		{ id: 'paseo-plugin-registry', title: 'Plugins – Extend Paseo with community plugins', url: 'https://paseo.sh/plugins', publisher: 'Paseo', checked: '2026-10-09' },
		{ id: 'paseo-cli', title: 'CLI reference', url: 'https://paseo.sh/docs/cli', publisher: 'Paseo', checked: '2026-10-09' },
		{ id: 'paseo-voice', title: 'Voice', url: 'https://paseo.sh/docs/voice', publisher: 'Paseo', checked: '2026-10-09' }
	]
};
