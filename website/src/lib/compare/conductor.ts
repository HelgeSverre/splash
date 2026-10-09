// Splash vs Conductor. Facts checked 2026-10-09 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const CONDUCTOR: Comparison = {
	slug: 'conductor',
	name: 'Conductor',
	description: 'How Splash and Conductor compare on agents, platforms, pricing, worktrees and review, with a source for every fact.',
	checked: '2026-10-09',
	intro: 'Splash and Conductor both run several coding agents at once, with git worktrees to keep their work apart. Conductor, a macOS app, runs Claude Code, Codex, Cursor and OpenCode, and its paid plans add cloud sandboxes, an API and an iOS app. Splash, a free, open-source desktop app for macOS, Windows and Ubuntu, drives agents over the Agent Client Protocol.',
	other: {
		name: 'Conductor',
		url: 'https://www.conductor.build',
		maker: 'Melty Labs',
		summary: 'A macOS app that runs Claude Code, Codex, Cursor and OpenCode side by side, each workspace a git worktree, then lets you review their changes and merge them. Paid plans add cloud sandboxes, an API and an iOS app.',
		cite: ['conductor-brandkit', 'conductor-harnesses', 'conductor-worktrees', 'conductor-pricing']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Mac desktop app, plus Conductor Cloud sandboxes, an iOS app and an HTTP API that drive the same agents', cite: ['conductor-brandkit', 'conductor-home'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v0.90.1, a patch to 0.90.0 of 2 October 2026, with frequent releases since July 2025; its API and MCP server are in beta', cite: ['conductor-0-90-0', 'conductor-changelog', 'conductor-api', 'conductor-api-mcp'] } },
				{ label: 'License', splash: S.license, other: { text: 'Proprietary; the terms forbid copying, modifying or making derivative works of it', cite: ['conductor-terms', 'conductor-skill'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free for local workspaces; Pro is $50 a month, Teams $60 per user a month (by invitation), Enterprise custom-priced', cite: ['conductor-pricing'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon and Intel), plus an iOS app for cloud workspaces; Windows and Linux are on a waitlist', cite: ['conductor-install', 'conductor-home', 'conductor-0-90-0'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code, Codex, Cursor and OpenCode in chat; OpenCode isn’t documented for cloud workspaces. Experimental Big Terminal Mode runs any terminal agent', cite: ['conductor-harnesses', 'conductor-0-85-0', 'conductor-api', 'conductor-big-terminal'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Claude Code through Anthropic’s Claude Agent SDK, Cursor Agent via Cursor’s API, and bundled Codex and OpenCode binaries', cite: ['conductor-claude-sdk', 'conductor-providers', 'conductor-harnesses'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Claude Code and Codex logins already on your Mac, or API keys; Codex can also use a ChatGPT plan. Providers bill model usage', cite: ['conductor-faq', 'conductor-install', 'conductor-0-89-0', 'conductor-providers'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'GitHub sign-in, checked with gh, is required; the app has Conductor accounts, but the docs don’t say local use needs one', cite: ['conductor-install', 'conductor-0-76-0'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Optional tool approvals for shell commands, file changes, MCP and web access; an experimental Auto mode approves safe actions', mark: 'yes', cite: ['conductor-security', 'conductor-settings', 'conductor-0-70-0'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Local Claude Code, Codex and Cursor chats load that agent’s own MCP config; cloud workspaces use servers added in Conductor’s settings', mark: 'yes', cite: ['conductor-mcp', 'conductor-0-90-0', 'conductor-0-82-0'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A git worktree on its own branch per workspace, shared by that workspace’s chats; cloud workspaces run in microVMs', mark: 'yes', cite: ['conductor-worktrees', 'conductor-harnesses', 'conductor-cloud-computer'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Setup, run and archive scripts per project; each local workspace gets ten ports for dev servers and copies of .env files', mark: 'yes', cite: ['conductor-scripts', 'conductor-files-to-copy'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'A terminal in each workspace; experimental Big Terminal Mode turns the center panel into a terminal that survives restarts', mark: 'yes', cite: ['conductor-first-workspace', 'conductor-big-terminal'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'The sidebar flags sessions waiting for input; you can jump between chats needing attention, and workspaces are grouped by status', mark: 'yes', cite: ['conductor-troubleshooting', 'conductor-0-36-4', 'conductor-0-35-0'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'macOS notifications for permission requests and for Claude’s questions and plan reviews; unread badges in the sidebar and Dock', mark: 'yes', cite: ['conductor-0-45-0', 'conductor-0-28-7', 'conductor-0-0-19'] } },
				{ label: 'Team collaboration', splash: { text: 'splash-server is a personal, single-user service, not a multi-user deployment', mark: 'no', cite: ['splash-server'] }, other: { text: 'Multiplayer on paid plans: live collaboration among up to five Pro users, or any team size on Teams', mark: 'yes', cite: ['conductor-pricing'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'A Diff Viewer with line comments sent back to the agent and in-diff editing, plus an agent Review action', mark: 'yes', cite: ['conductor-review-merge', 'conductor-workflow', 'conductor-0-84-0'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Opens a PR with an agent-drafted description, follows its CI checks, merges it and archives the workspace; supports stacked PRs', mark: 'yes', cite: ['conductor-review-merge', 'conductor-workflow', 'conductor-0-80-0'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'A Checks tab shows CI, deployments, PR comments and review threads; unresolved todos can block merging. Supports GitHub Enterprise login', mark: 'yes', cite: ['conductor-checks', 'conductor-0-22-4'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'Starts a workspace from a GitHub or Linear issue, including through Linear deep links; no Jira integration is documented', mark: 'yes', cite: ['conductor-issue-to-pr', 'conductor-deep-links'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'On paid plans: a Linux microVM per workspace that keeps working after the app closes. GitHub repositories, no other hosts yet', mark: 'yes', cite: ['conductor-cloud-faq', 'conductor-cloud-computer'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'SSH, file sync, terminals and port forwarding into cloud sandboxes; a self-hosted cloud for your own machines is in development', mark: 'partial', cite: ['conductor-cloud-working', 'conductor-cloud-faq'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'iOS app (iOS 26+) for agent chats and merging PRs in cloud workspaces, included in Pro; no Android app is listed', mark: 'yes', cite: ['conductor-0-90-0', 'conductor-app-store', 'conductor-pricing', 'conductor-home'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented; Conductor’s own archived workspaces can be restored with their chat history', mark: 'unknown', cite: ['conductor-faq', 'conductor-workflow'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Find in chat (⌘F) and a command palette that searches sessions by message; SQL over cloud transcripts through the API', mark: 'yes', cite: ['conductor-0-90-0', 'conductor-0-39-0', 'conductor-api'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Conductor runs Claude Code through Anthropic’s Claude Agent SDK, Cursor Agent through Cursor’s API, and Codex and OpenCode from bundled binaries; other CLI agents run in the experimental Big Terminal Mode. Its docs do not mention ACP, though the API schema lists an undocumented <code>acp</code> agent value. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, natively or via an adapter.',
			cite: ['conductor-claude-sdk', 'conductor-providers', 'conductor-harnesses', 'conductor-big-terminal', 'conductor-llms-full', 'conductor-openapi', 'splash-registry', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'Conductor’s desktop app runs on macOS. Paid plans add Conductor Cloud: a Linux microVM per workspace that keeps working after you close the app, driven from the Mac, the iOS app or a beta HTTP API. Splash runs on macOS, Windows and Ubuntu, or as <code>splash-server</code> on the machine that holds your code, where agents keep running if the SSH tunnel drops.',
			cite: ['conductor-install', 'conductor-cloud-faq', 'conductor-cloud-computer', 'conductor-skill', 'conductor-api', 'splash-install', 'splash-server']
		},
		{
			title: 'Price, accounts and license',
			text: 'Conductor is proprietary. Its Free plan covers local workspaces; Pro, at $50 a month, adds Conductor Cloud, Multiplayer, the API and the mobile app, and Teams and Enterprise add admin, billing and SSO features. A GitHub login is required. Splash is free, MIT-licensed and has no accounts; GitHub sign-in through <code>gh</code> is optional.',
			cite: ['conductor-terms', 'conductor-pricing', 'conductor-install', 'splash-license', 'splash-download', 'splash-build']
		},
		{
			title: 'Around the session',
			text: 'Conductor covers the path from a GitHub or Linear issue to a merged PR: setup and run scripts with reserved ports, an agent Review action, PR creation that tracks CI checks, per-turn checkpoints and cloud routines that run on a schedule or a trigger. Splash’s tools center on the conversations: a Needs attention queue, a review screen, transcript search and importing sessions agents started elsewhere.',
			cite: ['conductor-issue-to-pr', 'conductor-scripts', 'conductor-workflow', 'conductor-checkpoints', 'conductor-0-85-0', 'splash-features', 'splash-history']
		}
	],
	fit: {
		splash: [
			'You want a free, MIT-licensed app that needs no account.',
			'You work on Windows or Ubuntu as well as macOS, or want to run sessions on your own server over SSH.',
			'You want Gemini, Copilot, Goose and other agents in the same chat view as Claude Code and Codex.',
			'You want to import conversations your agents started outside the app and search them with the rest.'
		],
		other: [
			'You want setup and run scripts, reserved ports and copied .env files in each local workspace.',
			'You want to go from a GitHub or Linear issue to a merged PR in one app, with agent review and CI checks.',
			'You want agents to keep working in cloud sandboxes you can follow from your phone or drive through an API.',
			'You want shared workspaces and team plans with an admin portal, SAML SSO and SCIM.'
		]
	},
	sources: [
		{ id: 'conductor-home', title: 'Run a team of coding agents in the cloud', url: 'https://www.conductor.build/', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-brandkit', title: 'Brand kit', url: 'https://www.conductor.build/brandkit', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-pricing', title: 'Pricing', url: 'https://www.conductor.build/pricing', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-terms', title: 'Terms of service', url: 'https://www.conductor.build/terms', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-skill', title: 'Conductor agent skill (SKILL.md)', url: 'https://www.conductor.build/.well-known/agent-skills/conductor/SKILL.md', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-llms-full', title: 'llms-full.txt (all site markdown)', url: 'https://www.conductor.build/llms-full.txt', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-install', title: 'Install', url: 'https://www.conductor.build/docs/installation', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-first-workspace', title: 'Your first workspace', url: 'https://www.conductor.build/docs/first-workspace', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-faq', title: 'FAQ', url: 'https://www.conductor.build/docs/faq', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-harnesses', title: 'Harnesses: Overview', url: 'https://www.conductor.build/docs/reference/harnesses', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-providers', title: 'Configure model providers', url: 'https://www.conductor.build/docs/guides/providers', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-big-terminal', title: 'Big Terminal Mode', url: 'https://www.conductor.build/docs/reference/big-terminal-mode', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-claude-sdk', title: 'Claude subscription update for Conductor', url: 'https://www.conductor.build/blog/claude-subscription-update', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-security', title: 'Security and permissions', url: 'https://www.conductor.build/docs/reference/security-and-permissions', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-settings', title: 'Settings reference', url: 'https://www.conductor.build/docs/reference/settings/reference', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-mcp', title: 'MCP', url: 'https://www.conductor.build/docs/reference/mcp', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-worktrees', title: 'Git worktrees', url: 'https://www.conductor.build/docs/concepts/git-worktrees', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-workflow', title: 'Workflow', url: 'https://www.conductor.build/docs/concepts/workflow', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-scripts', title: 'Scripts', url: 'https://www.conductor.build/docs/reference/scripts', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-files-to-copy', title: 'Use Files to copy', url: 'https://www.conductor.build/docs/guides/use-files-to-copy', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-troubleshooting', title: 'Troubleshooting issues', url: 'https://www.conductor.build/docs/troubleshooting/issues', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-review-merge', title: 'Review and merge a workspace', url: 'https://www.conductor.build/docs/guides/review-and-merge', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-checks', title: 'Checks', url: 'https://www.conductor.build/docs/reference/checks', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-checkpoints', title: 'Checkpoints', url: 'https://www.conductor.build/docs/reference/checkpoints', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-issue-to-pr', title: 'From issue to PR', url: 'https://www.conductor.build/docs/guides/issue-to-pr', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-deep-links', title: 'Deep links', url: 'https://www.conductor.build/docs/reference/deep-links', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-cloud-faq', title: 'Cloud FAQ', url: 'https://www.conductor.build/docs/cloud/faq', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-cloud-computer', title: 'Cloud Computer', url: 'https://www.conductor.build/docs/cloud/cloud-computer', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-cloud-working', title: 'Work with cloud workspaces', url: 'https://www.conductor.build/docs/cloud/working-with-cloud-workspaces', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-api', title: 'Conductor API', url: 'https://www.conductor.build/docs/api', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-api-mcp', title: 'Conductor MCP server', url: 'https://www.conductor.build/docs/api/mcp', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-openapi', title: 'Roundhouse public API (OpenAPI)', url: 'https://api.conductor.build/v0/openapi.json', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-app-store', title: 'Conductor.build App Store listing data', url: 'https://itunes.apple.com/lookup?id=6791228564&country=us', publisher: 'Apple', checked: '2026-10-09' },
		{ id: 'conductor-changelog', title: 'Changelog', url: 'https://www.conductor.build/changelog.md', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-0-90-0', title: '0.90.0: Conductor for iOS', url: 'https://www.conductor.build/changelog/0.90.0-conductor-for-ios', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-0-89-0', title: '0.89.0: Sign in with ChatGPT', url: 'https://www.conductor.build/changelog/0.89.0-sign-in-with-chatgpt', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-0-85-0', title: '0.85.0: Sections, routines, and a new model picker', url: 'https://www.conductor.build/changelog/0.85.0-sections-routines-and-a-new-model-picker', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-0-84-0', title: '0.84.0: Edit files directly in diffs', url: 'https://www.conductor.build/changelog/0.84.0-edit-files-directly-in-diffs', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-0-82-0', title: '0.82.0: Conductor MCP', url: 'https://www.conductor.build/changelog/0.82.0-conductor-mcp', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-0-80-0', title: '0.80.0: Stacks', url: 'https://www.conductor.build/changelog/0.80.0-stacks', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-0-76-0', title: '0.76.0: Bug Squashathon', url: 'https://www.conductor.build/changelog/0.76.0-bug-squashathon', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-0-70-0', title: '0.70.0: Multiple Run Scripts', url: 'https://www.conductor.build/changelog/0.70.0-multiple-run-scripts', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-0-45-0', title: '0.45.0: File Previews, Codex Personalities', url: 'https://www.conductor.build/changelog/0.45.0-file-previews-codex-personalities', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-0-39-0', title: '0.39.0: Insta-Summarize, Command Palette, Opus 4.6', url: 'https://www.conductor.build/changelog/0.39.0-insta-summarize-command-palette-opus-4-6', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-0-36-4', title: '0.36.4: Next Workspace', url: 'https://www.conductor.build/changelog/0.36.4-next-workspace', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-0-35-0', title: '0.35.0: Workspace Status', url: 'https://www.conductor.build/changelog/0.35.0-workspace-status', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-0-28-7', title: '0.28.7: Change Target Branch', url: 'https://www.conductor.build/changelog/0.28.7-change-target-branch', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-0-22-4', title: '0.22.4: Expand Terminal, Env Vars, and GitHub Enterprise', url: 'https://www.conductor.build/changelog/0.22.4-expand-terminal-env-vars-and-github-enterprise', publisher: 'Melty Labs', checked: '2026-10-09' },
		{ id: 'conductor-0-0-19', title: '0.0.19: Misc Improvements', url: 'https://www.conductor.build/changelog/0.0.19-misc-improvements', publisher: 'Melty Labs', checked: '2026-10-09' }
	]
};
