// Splash vs Agentastic.dev. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const AGENTASTIC: Comparison = {
	slug: 'agentastic',
	name: 'Agentastic.dev',
	description: 'How Splash and Agentastic.dev compare on agents, platforms, pricing, worktrees, review and remote use, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Agentastic.dev are both desktop apps for running several coding agents at once, with git worktrees to keep their work apart. Agentastic.dev, a native macOS IDE, runs each agent’s own command-line interface in a terminal and offers a structured chat for 30 of them. Splash, for macOS, Windows and Ubuntu, drives every agent over the Agent Client Protocol.',
	other: {
		name: 'Agentastic.dev',
		url: 'https://www.agentastic.dev/',
		maker: 'Agentastic.ai',
		summary: 'A free macOS IDE that runs many coding agents side by side, each in a git worktree or container, with an editor, terminals, a browser, code review and an iPhone companion.',
		cite: ['agentastic-home', 'agentastic-llms', 'agentastic-agents', 'agentastic-companion']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Native macOS IDE written in Swift and SwiftUI, with its own editor, terminals, browser and git tools around the agents', cite: ['agentastic-faq', 'agentastic-llms', 'agentastic-overview'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v0.13.4 (8 October 2026), the latest of 48 dated releases since January 2026; the iPhone app is a TestFlight beta', cite: ['agentastic-whats-new', 'agentastic-download', 'agentastic-companion'] } },
				{ label: 'License', splash: S.license, other: { text: 'Pages conflict: llms.txt calls the app proprietary and closed source; its license page shows MIT text. The agent CLI declares Apache-2.0', cite: ['agentastic-llms', 'agentastic-vs-superset', 'agentastic-license', 'agentastic-cli-formula'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free, with no usage limits or sign-up; optional agentastic.com plans for hosted models start at $20 a month', cite: ['agentastic-home', 'agentastic-faq', 'agentastic-pricing'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 14+ (Apple silicon and Intel) and an iPhone beta; the separate agent CLI also runs on Linux and WSL', cite: ['agentastic-faq', 'agentastic-llms', 'agentastic-companion', 'agentastic-download'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: '55 built-in agent definitions, found on PATH, including Claude Code, Codex, Gemini CLI and Cursor; any terminal tool can be added', cite: ['agentastic-providers'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each agent’s own CLI in a terminal by default; 30 also offer structured Chat, 27 over ACP and three natively', cite: ['agentastic-agents', 'agentastic-chat', 'agentastic-providers'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Your existing CLI logins, subscriptions or API keys, billed by each vendor, not proxied; the docs FAQ asks for API keys', cite: ['agentastic-claude-code', 'agentastic-install', 'agentastic-home', 'agentastic-faq'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'Not for the app; the iPhone app’s internet relay and sharing through agentastic.com need an Agentastic account', cite: ['agentastic-home', 'agentastic-faq', 'agentastic-companion'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Servers added once in Settings reach Claude Code, Codex, OpenCode, Amp and GitHub Copilot at launch; other agents get skills instead', mark: 'partial', cite: ['agentastic-plugins'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A git worktree on its own branch by default, or a Docker or Apple container, SSH host or cloud sandbox', mark: 'yes', cite: ['agentastic-agents', 'agentastic-faq', 'agentastic-overview', 'agentastic-containers'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: '.agentastic/setup.sh runs on each new worktree and running dev servers are detected; docs and a comparison page disagree on teardown scripts', mark: 'yes', cite: ['agentastic-setup-scripts', 'agentastic-whats-new', 'agentastic-vs-superset'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'A durable inbox of finished, blocked and failed agents, shown as pane rings, tab dots and macOS notifications', mark: 'yes', cite: ['agentastic-notifications'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Manager Agents run for days or weeks, starting and steering other agents through the dev CLI toward objectives they verify', mark: 'yes', cite: ['agentastic-manager-agents'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Scheduled agents launch a full unattended run (worktree, branch, provider, prompt, skills) at a set time; SSH hosts run their own', mark: 'yes', cite: ['agentastic-scheduled'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'A WebKit browser with developer tools that agents drive through dev browser; the homepage describes Design Mode in Chromium', mark: 'yes', cite: ['agentastic-browser', 'agentastic-home'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Unified or side-by-side diffs, an AI guided review, line comments sent to the worktree’s agent, and parallel agent reviewers', mark: 'yes', cite: ['agentastic-diffs', 'agentastic-code-review'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Agents open PRs and fix CI or review comments on request; a GitHub panel edits descriptions and merges', mark: 'yes', cite: ['agentastic-actions', 'agentastic-source-control'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'A native PR panel with inline replies to review comments, CI checks and merging; PR badges also cover GitLab and Bitbucket', mark: 'yes', cite: ['agentastic-source-control', 'agentastic-whats-new'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'Linear and Sentry built in; Jira, GitHub, GitLab, Asana, Trello and five more as plugins. Slack messages can start tasks', mark: 'yes', cite: ['agentastic-issue-tracking', 'agentastic-slack'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'Cloud sandboxes on Modal, Fly.io or Vercel Sandbox, using your provider account, with its keys kept in the macOS Keychain', mark: 'yes', cite: ['agentastic-cloud', 'agentastic-vs-superset'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'SSH hosts get terminals, source control and worktrees; agents keep running there after the Mac sleeps, through a host daemon', mark: 'yes', cite: ['agentastic-remote', 'agentastic-whats-new'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'iPhone companion in public TestFlight beta (iOS 18+): answer agents, review diffs, merge PRs, start tasks; no Android app documented', mark: 'partial', cite: ['agentastic-companion', 'agentastic-testflight'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Updates itself through Sparkle, and keeps the agent CLI it installs up to date in the background', mark: 'yes', cite: ['agentastic-install', 'agentastic-own-agent'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented; Resume Latest reruns a CLI’s continue command, and older Claude Code and Codex logs feed cost history', mark: 'unknown', cite: ['agentastic-providers', 'agentastic-usage'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Not documented; project search covers files and symbols, and ⌘P matches agent and worktree names, branches and paths', mark: 'unknown', cite: ['agentastic-search', 'agentastic-whats-new'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Agentastic.dev starts each agent’s own CLI in a terminal by default, and any terminal command can be added as an agent. Thirty of its 55 catalog agents also offer a structured <strong>Chat</strong> view: Claude Code, Codex and Agentastic’s own agent through native integrations, the other 27 over ACP on the Mac. Splash speaks the <strong>Agent Client Protocol</strong> with every agent.',
			cite: ['agentastic-agents', 'agentastic-chat', 'agentastic-providers', 'splash-registry', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'Agentastic.dev needs macOS 14 or later. Its agents run in worktrees or containers on the Mac, on SSH hosts where a daemon keeps them running, or in Modal, Fly.io or Vercel Sandbox VMs on your own account. Splash runs on macOS, Windows and Ubuntu, or as <code>splash-server</code> on a machine you reach in a browser through an SSH tunnel.',
			cite: ['agentastic-faq', 'agentastic-containers', 'agentastic-remote', 'agentastic-cloud', 'splash-install', 'splash-server']
		},
		{
			title: 'Price, accounts and license',
			text: 'Agentastic.dev is free and needs no sign-up. Its llms.txt calls it closed source, while its license page shows MIT text; the separate <code>agentastic</code> agent CLI declares Apache-2.0. Optional agentastic.com plans from $20 a month add hosted models, and an account turns on the phone relay and sharing. Splash is free, MIT-licensed and has no accounts.',
			cite: ['agentastic-home', 'agentastic-llms', 'agentastic-license', 'agentastic-cli-formula', 'agentastic-pricing', 'agentastic-faq', 'splash-license', 'splash-download', 'splash-build']
		},
		{
			title: 'What each is built around',
			text: 'Agentastic.dev is an IDE around the agents: a code editor, terminals, a browser, a Kanban board of worktrees, multi-agent code review, a GitHub PR panel, issue trackers, scheduled agents and Manager Agents that steer others. Splash centers on the conversation: a rendered transcript, a Needs attention queue, a review screen, transcript search and importing sessions agents started elsewhere.',
			cite: ['agentastic-overview', 'agentastic-kanban', 'agentastic-code-review', 'agentastic-source-control', 'agentastic-issue-tracking', 'agentastic-scheduled', 'agentastic-manager-agents', 'splash-features', 'splash-history']
		}
	],
	fit: {
		splash: [
			'You want a free, MIT-licensed app that runs on Windows and Ubuntu as well as macOS.',
			'You want every agent driven over the Agent Client Protocol and shown as a rendered transcript.',
			'You want to import conversations agents started outside the app and search their saved text.',
			'You want to run sessions on your own server and open them in a browser over SSH.'
		],
		other: [
			'You want a native macOS IDE with an editor, terminals and a browser around each agent’s own CLI.',
			'You want setup scripts, containers, SSH hosts or cloud sandboxes to keep agents’ work apart.',
			'You want agents to open pull requests and pick up Linear, Sentry or Slack work, with parallel AI review.',
			'You want scheduled agents, long-running Manager Agents and an iPhone app for answering agents away from the Mac.'
		]
	},
	sources: [
		{ id: 'agentastic-home', title: 'Multi-Agent IDE for Claude Code, Codex & More', url: 'https://www.agentastic.dev/', publisher: 'Agentastic.ai', checked: '2026-10-10' },
		{ id: 'agentastic-llms', title: 'Agentastic.dev (llms.txt)', url: 'https://www.agentastic.dev/llms.txt', publisher: 'Agentastic.ai', checked: '2026-10-10' },
		{ id: 'agentastic-faq', title: 'FAQ', url: 'https://www.agentastic.dev/docs/faq', publisher: 'Agentastic.ai', checked: '2026-10-10' },
		{ id: 'agentastic-overview', title: 'How Agentastic Works', url: 'https://www.agentastic.dev/docs/overview', publisher: 'Agentastic.ai', checked: '2026-10-10' },
		{ id: 'agentastic-install', title: 'Installation', url: 'https://www.agentastic.dev/docs/installation', publisher: 'Agentastic.ai', checked: '2026-10-10' },
		{ id: 'agentastic-download', title: 'Download for macOS', url: 'https://www.agentastic.dev/download', publisher: 'Agentastic.ai', checked: '2026-10-10' },
		{ id: 'agentastic-whats-new', title: 'Release Notes', url: 'https://www.agentastic.dev/whats-new', publisher: 'Agentastic.ai', checked: '2026-10-10' },
		{ id: 'agentastic-license', title: 'License', url: 'https://www.agentastic.dev/legal/license', publisher: 'Agentastic.ai', checked: '2026-10-10' },
		{ id: 'agentastic-vs-superset', title: 'Agentastic vs Superset (2026)', url: 'https://www.agentastic.dev/compare/agentastic-vs-superset', publisher: 'Agentastic.ai', checked: '2026-10-10' },
		{ id: 'agentastic-cli-formula', title: 'Formula/agentastic.rb', url: 'https://github.com/agentasticai/homebrew-tap/blob/main/Formula/agentastic.rb', publisher: 'agentasticai/homebrew-tap on GitHub', checked: '2026-10-10' },
		{ id: 'agentastic-pricing', title: 'Pricing', url: 'https://www.agentastic.com/pricing', publisher: 'Agentastic, Inc.', checked: '2026-10-10' },
		{ id: 'agentastic-companion', title: 'Companion for iPhone', url: 'https://www.agentastic.dev/docs/features/companion', publisher: 'Agentastic.ai', checked: '2026-10-10' },
		{ id: 'agentastic-testflight', title: 'Join the Agentastic.dev beta', url: 'https://testflight.apple.com/join/asjh7RMQ', publisher: 'Apple TestFlight', checked: '2026-10-10' },
		{ id: 'agentastic-providers', title: 'Providers', url: 'https://www.agentastic.dev/docs/features/providers', publisher: 'Agentastic.ai', checked: '2026-10-10' },
		{ id: 'agentastic-agents', title: 'Agents', url: 'https://www.agentastic.dev/docs/features/agents', publisher: 'Agentastic.ai', checked: '2026-10-10' },
		{ id: 'agentastic-chat', title: 'Chat', url: 'https://www.agentastic.dev/docs/features/chat', publisher: 'Agentastic.ai', checked: '2026-10-10' },
		{ id: 'agentastic-claude-code', title: 'Run Claude Code in Agentastic', url: 'https://www.agentastic.dev/agents/claude-code', publisher: 'Agentastic.ai', checked: '2026-10-10' },
		{ id: 'agentastic-plugins', title: 'Plugins & MCP', url: 'https://www.agentastic.dev/docs/features/plugins', publisher: 'Agentastic.ai', checked: '2026-10-10' },
		{ id: 'agentastic-containers', title: 'Containers', url: 'https://www.agentastic.dev/docs/how-to/containers', publisher: 'Agentastic.ai', checked: '2026-10-10' },
		{ id: 'agentastic-setup-scripts', title: 'Setup & Teardown Scripts', url: 'https://www.agentastic.dev/docs/guides/setup-teardown-scripts', publisher: 'Agentastic.ai', checked: '2026-10-10' },
		{ id: 'agentastic-notifications', title: 'Notifications', url: 'https://www.agentastic.dev/docs/features/notifications', publisher: 'Agentastic.ai', checked: '2026-10-10' },
		{ id: 'agentastic-manager-agents', title: 'Manager Agents', url: 'https://www.agentastic.dev/docs/features/manager-agents', publisher: 'Agentastic.ai', checked: '2026-10-10' },
		{ id: 'agentastic-scheduled', title: 'Scheduled Agents', url: 'https://www.agentastic.dev/docs/features/scheduled-tasks', publisher: 'Agentastic.ai', checked: '2026-10-10' },
		{ id: 'agentastic-browser', title: 'Browser', url: 'https://www.agentastic.dev/docs/features/browser', publisher: 'Agentastic.ai', checked: '2026-10-10' },
		{ id: 'agentastic-kanban', title: 'Kanban Board', url: 'https://www.agentastic.dev/docs/features/kanban', publisher: 'Agentastic.ai', checked: '2026-10-10' },
		{ id: 'agentastic-diffs', title: 'Diff Viewer', url: 'https://www.agentastic.dev/docs/features/diffs', publisher: 'Agentastic.ai', checked: '2026-10-10' },
		{ id: 'agentastic-code-review', title: 'Code Review', url: 'https://www.agentastic.dev/docs/features/code-review', publisher: 'Agentastic.ai', checked: '2026-10-10' },
		{ id: 'agentastic-actions', title: 'Actions', url: 'https://www.agentastic.dev/docs/features/actions', publisher: 'Agentastic.ai', checked: '2026-10-10' },
		{ id: 'agentastic-source-control', title: 'Source Control', url: 'https://www.agentastic.dev/docs/features/source-control', publisher: 'Agentastic.ai', checked: '2026-10-10' },
		{ id: 'agentastic-issue-tracking', title: 'Issue Tracking', url: 'https://www.agentastic.dev/docs/features/issue-tracking', publisher: 'Agentastic.ai', checked: '2026-10-10' },
		{ id: 'agentastic-slack', title: 'Slack', url: 'https://www.agentastic.dev/docs/features/slack', publisher: 'Agentastic.ai', checked: '2026-10-10' },
		{ id: 'agentastic-cloud', title: 'Cloud Agents', url: 'https://www.agentastic.dev/docs/guides/cloud-agents', publisher: 'Agentastic.ai', checked: '2026-10-10' },
		{ id: 'agentastic-remote', title: 'Remote Machines', url: 'https://www.agentastic.dev/docs/guides/remote-machines', publisher: 'Agentastic.ai', checked: '2026-10-10' },
		{ id: 'agentastic-own-agent', title: 'Agentastic Agent', url: 'https://www.agentastic.dev/docs/features/agentastic-agent', publisher: 'Agentastic.ai', checked: '2026-10-10' },
		{ id: 'agentastic-usage', title: 'Usage & Cost', url: 'https://www.agentastic.dev/docs/features/usage', publisher: 'Agentastic.ai', checked: '2026-10-10' },
		{ id: 'agentastic-search', title: 'Search', url: 'https://www.agentastic.dev/docs/features/search', publisher: 'Agentastic.ai', checked: '2026-10-10' }
	]
};
