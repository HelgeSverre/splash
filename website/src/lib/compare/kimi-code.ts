// Splash vs Kimi Code Desktop. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const KIMI_CODE: Comparison = {
	slug: 'kimi-code',
	name: 'Kimi Code Desktop',
	description: 'How Splash and Kimi Code Desktop compare on agents, platforms, pricing, isolation, review and remote use, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Kimi Code Desktop are both desktop apps for working with coding agents. Kimi Code Desktop, Moonshot AI’s app for macOS and Windows, runs Moonshot’s own Kimi Code agent and its subagents on Kimi models or other providers’ APIs. Splash, free and open source, runs many vendors’ agents side by side over the Agent Client Protocol.',
	other: {
		name: 'Kimi Code Desktop',
		url: 'https://www.kimi.com/code',
		maker: 'Moonshot AI',
		summary: 'Moonshot AI’s desktop app for Kimi Code. It runs Moonshot’s own coding agent, with subagent modes, a built-in browser, a terminal and a Changes panel, on macOS and Windows, using Kimi models or other providers.',
		cite: ['kimi-code-getting-started', 'kimi-code-tasks', 'kimi-code-browser', 'kimi-code-help']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop client for Moonshot AI’s Kimi Code service, which is also offered as a CLI and a VS Code extension', cite: ['kimi-code-getting-started', 'kimi-code-overview'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: '1.0.4, from 24 September 2026; generally available since 1.0.0 on 17 September 2026, with Tower mode still experimental', cite: ['kimi-code-changelog', 'kimi-code-whats-new', 'kimi-code-tasks'] } },
				{ label: 'License', splash: S.license, other: { text: 'No source or license published for the app; the Kimi Code CLI and agent engine it builds on are MIT-licensed', cite: ['kimi-code-surfaces', 'kimi-code-license', 'kimi-code-changelog'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Kimi’s models need a membership: Plus $19, Pro $39, Max $99 or Ultra $199 a month; $15–$159 a month billed yearly', cite: ['kimi-code-home', 'kimi-code-pricing', 'kimi-code-membership'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon and Intel) and Windows 64-bit; no Linux build of the app, though the CLI runs on Linux', cite: ['kimi-code-help', 'kimi-code-home', 'kimi-code-launch', 'kimi-code-cli-release'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Moonshot’s Kimi Code agent and its built-in subagents (coder, explore, plan); running other vendors’ coding agents is not documented', cite: ['kimi-code-whats-new', 'kimi-code-agents'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Via an embedded local server running Kimi Code’s agent engine, over REST and WebSocket; ACP is documented for the CLI alone', cite: ['kimi-code-surfaces', 'kimi-code-kap-server-changelog', 'kimi-code-changelog', 'kimi-code-acp'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Kimi sign-in draws on your membership quota, shared with the CLI and VS Code; other providers take your own API key', cite: ['kimi-code-membership', 'kimi-code-getting-started'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'Kimi sign-in can be skipped and a third-party model provider used instead; official Kimi models need an account with a membership', cite: ['kimi-code-getting-started', 'kimi-code-help'] } },
				{ label: 'Model and mode pickers', splash: S.models, other: { text: 'A model picker in the composer, with models from your plan or added providers; Normal, Plan, Goal, Swarm and Tower task modes; three permission modes', mark: 'yes', cite: ['kimi-code-getting-started', 'kimi-code-interface', 'kimi-code-tasks'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Approval cards for commands, file changes and plans; in Always Ask mode, everything except reads waits for you', mark: 'yes', cite: ['kimi-code-tasks'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Supported, sharing the CLI’s MCP configuration; plugins, Skills and Hooks also extend the agent', mark: 'yes', cite: ['kimi-code-settings'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Sessions work in the local project folder; experimental Tower mode puts subagents in their own git worktrees when needed', mark: 'partial', cite: ['kimi-code-sessions', 'kimi-code-tasks'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'The agent hands tasks to subagents; Swarm runs same-kind subtasks in parallel and experimental Tower splits big goals across a team', mark: 'yes', cite: ['kimi-code-agents', 'kimi-code-tasks'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'A native terminal with tabs in the bottom panel, starting in the workspace folder; tabs can also open on the right', mark: 'yes', cite: ['kimi-code-tasks', 'kimi-code-interface'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'The agent reads pages, clicks and fills in forms there; you can take over and send annotated elements back to it', mark: 'yes', cite: ['kimi-code-browser'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Approval and question cards in the conversation, and a work bar listing background tasks and subagents', mark: 'yes', cite: ['kimi-code-tasks'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'No built-in system notifications are documented for the app; a hook in the shared config can show one', mark: 'partial', cite: ['kimi-code-settings', 'kimi-code-hooks'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'The agent can schedule a prompt into the session, once or on a cron schedule, and the app shows each schedule in the conversation; recurring ones end after 7 days', mark: 'yes', cite: ['kimi-code-tools', 'kimi-code-changelog'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'A Changes panel shows diffs by file or turn; comments on selected text and annotated screenshots go to the agent', mark: 'yes', cite: ['kimi-code-interface', 'kimi-code-input'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'Changes and File Preview tabs, with no in-app editor described; projects and files open in VS Code, Cursor, Zed or Xcode', mark: 'partial', cite: ['kimi-code-interface'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'A Git status area shows the branch, ahead and behind counts, file changes and related PR status; creating PRs isn’t documented', mark: 'partial', cite: ['kimi-code-launch'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'None documented for the app; the CLI’s Remote Control, on paid plans, drives local sessions from a phone or another computer', mark: 'partial', cite: ['kimi-code-remote-control'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Checks for updates at launch, fetches them in the background and installs once you confirm', mark: 'yes', cite: ['kimi-code-settings'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Kimi Code CLI sessions show up and resume here; a CLI command imports Claude Code and Codex setup (instructions, skills, MCP servers), not their sessions', mark: 'partial', cite: ['kimi-code-sessions', 'kimi-code-slash-commands'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'You can search a workspace’s sessions; the docs don’t say whether search covers message text', mark: 'partial', cite: ['kimi-code-sessions'] } },
				{ label: 'Fork a conversation', splash: S.fork, other: { text: 'A fork is an independent copy of the session, whole history included; side chats branch off with read-only tools', mark: 'yes', cite: ['kimi-code-sessions'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Kimi Code Desktop runs one agent, Moonshot’s own, through a local embedded server built on the Kimi Code CLI’s agent engine; other vendors plug in as model providers, not as agents. Splash starts each vendor’s agent as a child process and speaks the <strong>Agent Client Protocol</strong> with it, natively or through an adapter.',
			cite: ['kimi-code-whats-new', 'kimi-code-surfaces', 'kimi-code-kap-server-changelog', 'kimi-code-changelog', 'kimi-code-providers', 'splash-readme', 'splash-registry', 'acp']
		},
		{
			title: 'Accounts and billing',
			text: 'Official Kimi models in Kimi Code Desktop need a paid Kimi membership, from $19 a month or $15 a month billed yearly. Its quota is shared with the CLI, VS Code and API keys, and a prepaid Extra Usage balance, charged by use, covers requests beyond it. Sign-in can be skipped when you use another provider’s API key. Splash is free, has no accounts, and runs each agent on that agent’s own login.',
			cite: ['kimi-code-home', 'kimi-code-membership', 'kimi-code-help', 'kimi-code-getting-started', 'splash-download', 'splash-build', 'splash-agents']
		},
		{
			title: 'Platforms and source',
			text: 'Kimi Code Desktop has builds for macOS and Windows; the Kimi Code CLI also runs on Linux. No source or license is published for the app, while the CLI and agent engine it builds on are MIT-licensed. Splash is MIT-licensed and builds for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64, plus a headless server.',
			cite: ['kimi-code-help', 'kimi-code-home', 'kimi-code-cli-release', 'kimi-code-surfaces', 'kimi-code-license', 'splash-license', 'splash-install', 'splash-server']
		},
		{
			title: 'Parallel work',
			text: 'Kimi Code Desktop documents parallel work inside a task: Swarm runs subagents side by side, experimental <strong>Tower</strong> splits a goal across a team of agents with git worktrees as needed, and background tasks keep running while the session continues. Sessions work in the project folder. Splash runs separate sessions at once, each its own agent, in the project folder or in a git worktree on its own branch.',
			cite: ['kimi-code-tasks', 'kimi-code-sessions', 'splash-readme', 'splash-features']
		},
		{
			title: 'Around the session',
			text: 'Kimi Code Desktop also has a browser the agent drives and you can take over, opening projects in external editors, prompts the agent can schedule for later, plugins such as Computer Use and WebBridge, and self-updates. Splash has a Needs attention queue with system notifications, a review screen, transcript search, a GitHub view across repositories, and importing of sessions started outside Splash.',
			cite: ['kimi-code-browser', 'kimi-code-interface', 'kimi-code-tools', 'kimi-code-changelog', 'kimi-code-settings', 'kimi-code-plugins', 'splash-features', 'splash-notify', 'splash-github', 'splash-history']
		}
	],
	fit: {
		splash: [
			'You want to run agents from several vendors side by side in one app.',
			'You work on Ubuntu as well as macOS or Windows, or want to run sessions on your own server over SSH.',
			'You want a free, MIT-licensed app with no account of its own.',
			'You want pending permission requests and finished turns in one queue, with system notifications and transcript search.'
		],
		other: [
			'You work mainly with Moonshot’s Kimi models and have, or plan to get, a Kimi membership.',
			'You want Plan and Goal modes, and one agent that splits work across subagents with Swarm or Tower.',
			'You want a built-in browser the agent can drive and you can take over.',
			'You want an app that updates itself and shares its sessions with the Kimi Code CLI.'
		]
	},
	sources: [
		{ id: 'kimi-code-home', title: 'Kimi Code with Kimi K3: AI coding Agent & CLI tools', url: 'https://www.kimi.com/code', publisher: 'Moonshot AI', checked: '2026-10-10' },
		{ id: 'kimi-code-pricing', title: 'Kimi Pricing | Membership plans and subscription options', url: 'https://www.kimi.com/membership/pricing', publisher: 'Moonshot AI', checked: '2026-10-10' },
		{ id: 'kimi-code-launch', title: 'Kimi Code Desktop 正式与你见面', url: 'https://www.kimi.com/news/kimi-code-desktop', publisher: 'Moonshot AI', checked: '2026-10-10' },
		{ id: 'kimi-code-overview', title: 'Kimi Code Overview', url: 'https://www.kimi.com/code/docs/en/', publisher: 'Moonshot AI', checked: '2026-10-10' },
		{ id: 'kimi-code-whats-new', title: 'What’s New', url: 'https://www.kimi.com/code/docs/en/kimi-code/whats-new.html', publisher: 'Moonshot AI', checked: '2026-10-10' },
		{ id: 'kimi-code-membership', title: 'Membership Benefits', url: 'https://www.kimi.com/code/docs/en/kimi-code/membership.html', publisher: 'Moonshot AI', checked: '2026-10-10' },
		{ id: 'kimi-code-getting-started', title: 'Quick Start', url: 'https://www.kimi.com/code/docs/en/kimi-code-desktop/getting-started.html', publisher: 'Moonshot AI', checked: '2026-10-10' },
		{ id: 'kimi-code-interface', title: 'Interface Tour', url: 'https://www.kimi.com/code/docs/en/kimi-code-desktop/interface-and-sessions.html', publisher: 'Moonshot AI', checked: '2026-10-10' },
		{ id: 'kimi-code-sessions', title: 'Project and Session Management', url: 'https://www.kimi.com/code/docs/en/kimi-code-desktop/project-and-session-management.html', publisher: 'Moonshot AI', checked: '2026-10-10' },
		{ id: 'kimi-code-input', title: 'Input and Context', url: 'https://www.kimi.com/code/docs/en/kimi-code-desktop/input-and-context.html', publisher: 'Moonshot AI', checked: '2026-10-10' },
		{ id: 'kimi-code-tasks', title: 'Task Execution and Review', url: 'https://www.kimi.com/code/docs/en/kimi-code-desktop/task-execution-and-review.html', publisher: 'Moonshot AI', checked: '2026-10-10' },
		{ id: 'kimi-code-browser', title: 'Built-in Browser', url: 'https://www.kimi.com/code/docs/en/kimi-code-desktop/built-in-browser.html', publisher: 'Moonshot AI', checked: '2026-10-10' },
		{ id: 'kimi-code-settings', title: 'Settings and Extensions', url: 'https://www.kimi.com/code/docs/en/kimi-code-desktop/settings-and-extensions.html', publisher: 'Moonshot AI', checked: '2026-10-10' },
		{ id: 'kimi-code-help', title: 'FAQ and Troubleshooting', url: 'https://www.kimi.com/code/docs/en/kimi-code-desktop/help.html', publisher: 'Moonshot AI', checked: '2026-10-10' },
		{ id: 'kimi-code-changelog', title: 'Changelog (Kimi Code Desktop)', url: 'https://www.kimi.com/code/docs/en/kimi-code-desktop/changelog.html', publisher: 'Moonshot AI', checked: '2026-10-10' },
		{ id: 'kimi-code-agents', title: 'Agents and Sub-Agents', url: 'https://www.kimi.com/code/docs/en/kimi-code-cli/customization/agents.html', publisher: 'Moonshot AI', checked: '2026-10-10' },
		{ id: 'kimi-code-providers', title: 'Providers and models', url: 'https://www.kimi.com/code/docs/en/kimi-code-cli/configuration/providers.html', publisher: 'Moonshot AI', checked: '2026-10-10' },
		{ id: 'kimi-code-acp', title: 'kimi acp Subcommand', url: 'https://www.kimi.com/code/docs/en/kimi-code-cli/reference/kimi-acp.html', publisher: 'Moonshot AI', checked: '2026-10-10' },
		{ id: 'kimi-code-hooks', title: 'Hooks', url: 'https://www.kimi.com/code/docs/en/kimi-code-cli/customization/hooks.html', publisher: 'Moonshot AI', checked: '2026-10-10' },
		{ id: 'kimi-code-plugins', title: 'Plugins', url: 'https://www.kimi.com/code/docs/en/kimi-code-cli/customization/plugins.html', publisher: 'Moonshot AI', checked: '2026-10-10' },
		{ id: 'kimi-code-remote-control', title: 'Remote Control', url: 'https://www.kimi.com/code/docs/en/kimi-code-cli/guides/remote-control.html', publisher: 'Moonshot AI', checked: '2026-10-10' },
		{ id: 'kimi-code-tools', title: 'Built-in Tools', url: 'https://www.kimi.com/code/docs/en/kimi-code-cli/reference/tools.html', publisher: 'Moonshot AI', checked: '2026-10-10' },
		{ id: 'kimi-code-slash-commands', title: 'Slash Commands', url: 'https://www.kimi.com/code/docs/en/kimi-code-cli/reference/slash-commands.html', publisher: 'Moonshot AI', checked: '2026-10-10' },
		{ id: 'kimi-code-license', title: 'LICENSE', url: 'https://github.com/MoonshotAI/kimi-code/blob/main/LICENSE', publisher: 'MoonshotAI/kimi-code on GitHub', checked: '2026-10-10' },
		{ id: 'kimi-code-surfaces', title: '.agents/skills/review-pr/surfaces.md', url: 'https://github.com/MoonshotAI/kimi-code/blob/main/.agents/skills/review-pr/surfaces.md', publisher: 'MoonshotAI/kimi-code on GitHub', checked: '2026-10-10' },
		{ id: 'kimi-code-kap-server-changelog', title: 'packages/kap-server/CHANGELOG.md', url: 'https://github.com/MoonshotAI/kimi-code/blob/main/packages/kap-server/CHANGELOG.md', publisher: 'MoonshotAI/kimi-code on GitHub', checked: '2026-10-10' },
		{ id: 'kimi-code-cli-release', title: 'Release @moonshot-ai/kimi-code@2.1.1', url: 'https://github.com/MoonshotAI/kimi-code/releases/tag/%40moonshot-ai/kimi-code%402.1.1', publisher: 'MoonshotAI/kimi-code on GitHub', checked: '2026-10-10' }
	]
};
