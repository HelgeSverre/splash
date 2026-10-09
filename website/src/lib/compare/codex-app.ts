// Splash vs ChatGPT desktop app. Facts checked 2026-10-09 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const CODEX_APP: Comparison = {
	slug: 'codex-app',
	name: 'ChatGPT desktop app',
	description: 'How Splash and Codex in the ChatGPT desktop app, formerly the Codex app, compare on agents, platforms, pricing, worktrees and review.',
	checked: '2026-10-09',
	intro: 'Splash and the ChatGPT desktop app both run several coding-agent sessions at once, each in your checkout or its own git worktree. The ChatGPT desktop app, which the Codex app merged into in July 2026, runs OpenAI’s Codex locally, on SSH hosts or in the cloud; Splash, free and open source, drives many vendors’ agents over the Agent Client Protocol.',
	other: {
		name: 'ChatGPT desktop app',
		url: 'https://learn.chatgpt.com/docs/app',
		maker: 'OpenAI',
		summary: 'OpenAI’s desktop app for ChatGPT, whose Codex mode runs coding-agent threads in parallel: in your checkout, a Git worktree, an SSH host or OpenAI’s cloud. The standalone Codex app merged into it in July 2026.',
		cite: ['codex-app-app', 'codex-app-modes', 'codex-app-remote', 'codex-app-changelog-chatgpt']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app with Codex as a mode beside ChatGPT; OpenAI also offers web and mobile apps, the Codex CLI and an IDE extension', cite: ['codex-app-app', 'codex-app-modes', 'codex-app-quickstart'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: '26.924, a macOS security update from 25 September 2026; Linux is in preview. Launched as the Codex app in February 2026', cite: ['codex-app-changelog-latest', 'codex-app-linux', 'codex-app-changelog-launch'] } },
				{ label: 'License', splash: S.license, other: { text: 'No license or source published for the app; it bundles Codex, whose CLI and app server are open source (Apache-2.0)', cite: ['codex-app-troubleshooting', 'codex-app-open-source', 'codex-app-codex-license'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Included in ChatGPT Free, Go ($8 a month), Plus ($20), Pro ($100/$200/$500), Business (from $20 per user), Enterprise and Edu', cite: ['codex-app-pricing'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon, Intel), Windows 10 version 19041+ (x64, Arm64), Linux preview (x64, ARM64) for Ubuntu, Debian, Fedora and Arch', cite: ['codex-app-changelog-intel', 'codex-app-store', 'codex-app-windows-deployment', 'codex-app-linux'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'OpenAI’s Codex; custom agents and subagents are Codex setups with their own model and instructions. Other vendors’ agents are not documented', cite: ['codex-app-app', 'codex-app-subagents'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Runs the Codex build bundled with the app, and the Codex app server on SSH hosts; the docs never mention ACP', cite: ['codex-app-troubleshooting', 'codex-app-remote', 'codex-app-app-server'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'ChatGPT sign-in draws on your plan’s usage, and an OpenAI API key is billed at API rates; Amazon Bedrock also works', cite: ['codex-app-auth', 'codex-app-bedrock'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'A ChatGPT account or OpenAI API key by default; Amazon Bedrock with AWS credentials, or provider credentials for an organization’s gateway, can stand in', cite: ['codex-app-app', 'codex-app-auth', 'codex-app-bedrock'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Ask for approval, Approve for me (sends eligible requests to automatic review) or Full access; local commands run in an OS sandbox', mark: 'yes', cite: ['codex-app-permissions', 'codex-app-sandbox'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'STDIO and streamable HTTP servers, with configuration shared with the CLI and IDE extension; plugins can bundle skills and MCP servers', mark: 'yes', cite: ['codex-app-mcp', 'codex-app-plugins'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Per chat: Local (your checkout), a Codex-managed Git worktree in detached HEAD, or a Cloud workspace; permanent worktrees also exist', mark: 'yes', cite: ['codex-app-worktrees', 'codex-app-modes'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Setup scripts run on each new worktree; top-bar actions start dev servers or tests; .worktreeinclude copies ignored files such as .env', mark: 'yes', cite: ['codex-app-local-env', 'codex-app-worktrees'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'Shows sites and local web apps, such as a dev server, in a chat, with visual comments for the agent', mark: 'yes', cite: ['codex-app-browser'] } },
				{ label: 'Scheduled tasks', splash: S.scheduler, other: { text: 'Recurring tasks run in the background on local projects, in the project folder or an isolated worktree, while the computer and app stay on', mark: 'yes', cite: ['codex-app-automations'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'A terminal in each chat, scoped to its project or worktree, whose output the agent can read; Windows offers PowerShell, Command Prompt, Git Bash or WSL', mark: 'yes', cite: ['codex-app-terminal', 'codex-app-windows'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'An Activity list, where available, of unread, running and waiting chats; a floating pet shows Running, Needs input, Ready or Blocked', mark: 'yes', cite: ['codex-app-notifications'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'System notifications for finished turns (never, in the background or always), with separate switches for permission requests and questions', mark: 'yes', cite: ['codex-app-notifications'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Git diffs of unstaged, staged, commit, branch or last-turn changes; stage or revert hunks, comment on lines, run /review', mark: 'yes', cite: ['codex-app-local-env', 'codex-app-code-review'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Commit, push and open a pull request from the app; no merge control is documented', mark: 'yes', cite: ['codex-app-local-env', 'codex-app-code-review'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Through the GitHub CLI and the Code Review plugin: a PR inbox across repositories, diffs, comments and checks, review submission, and Fix for failing checks', mark: 'yes', cite: ['codex-app-windows', 'codex-app-code-review'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'Linear issues assigned to Codex and @codex mentions in GitHub Issues start cloud tasks; Codex Security can file findings in Jira; no in-app issue view is documented', mark: 'partial', cite: ['codex-app-linear', 'codex-app-changelog-issues', 'codex-app-jira'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'Cloud tasks in their own remote workspaces, started or continued from the app, web or mobile; ChatGPT sign-in required', mark: 'yes', cite: ['codex-app-modes', 'codex-app-auth'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'Remote projects on SSH hosts, which need Codex installed; the ChatGPT phone apps can also control a Mac or Windows host', mark: 'yes', cite: ['codex-app-remote', 'codex-app-changelog-remote'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'ChatGPT for iOS and Android approves actions and shows diffs for a linked Mac or Windows host, and starts cloud tasks', mark: 'yes', cite: ['codex-app-remote', 'codex-app-mobile', 'codex-app-modes'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Updates itself; on macOS and Windows, admins can switch the updater off and roll out approved versions', mark: 'yes', cite: ['codex-app-updates'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Imports setup and the last 30 days of chats from Claude Code, Claude Cowork and Cursor, and can keep them in sync', mark: 'yes', cite: ['codex-app-import'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Search chats; where expanded matching is available, it also looks at message text and Git branch names', mark: 'partial', cite: ['codex-app-commands'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'The ChatGPT desktop app runs OpenAI’s Codex from a binary bundled with the app, and starts the Codex app server on SSH hosts; its custom agents are Codex configurations. Splash starts each agent as a child process and speaks the <strong>Agent Client Protocol</strong> with it. In Splash, Codex is one of those agents, through the <code>codex-acp</code> adapter.',
			cite: ['codex-app-troubleshooting', 'codex-app-remote', 'codex-app-subagents', 'splash-readme', 'splash-agents', 'acp']
		},
		{
			title: 'Where it runs',
			text: 'The ChatGPT desktop app runs on macOS and Windows, with Linux in preview. Codex chats run locally, on an SSH host or as cloud tasks, and the ChatGPT phone apps can control a Mac or Windows host. Splash runs agents on your computer, or on your own server as <code>splash-server</code>, used in a browser over an SSH tunnel.',
			cite: ['codex-app-quickstart', 'codex-app-linux', 'codex-app-modes', 'codex-app-remote', 'splash-install', 'splash-readme', 'splash-server']
		},
		{
			title: 'Accounts, plans and license',
			text: 'Codex in the ChatGPT desktop app draws on a ChatGPT plan’s usage, from Free to Enterprise, or an OpenAI API key at API rates; Amazon Bedrock is another route. OpenAI publishes no source for the app; the Codex it bundles is open source under Apache-2.0. Splash is free and MIT-licensed, has no accounts, and runs each agent on that agent’s own login.',
			cite: ['codex-app-pricing', 'codex-app-auth', 'codex-app-bedrock', 'codex-app-troubleshooting', 'codex-app-open-source', 'codex-app-codex-license', 'splash-download', 'splash-license', 'splash-build', 'splash-agents']
		},
		{
			title: 'Pull requests and GitHub',
			text: 'Codex in the ChatGPT desktop app commits, pushes and opens pull requests, and its Code Review plugin shows a PR’s diff, comments and checks and submits reviews. Splash does not create pull requests; its GitHub view triages issues, pull requests and Actions runs across repositories through the <code>gh</code> CLI and links them to local sessions.',
			cite: ['codex-app-local-env', 'codex-app-code-review', 'splash-features', 'splash-github']
		},
		{
			title: 'Around the session',
			text: 'The ChatGPT desktop app adds tooling around each Codex chat: setup scripts and top-bar actions, a built-in browser, Computer Use on macOS and Windows, scheduled tasks, Handoff between Local, a worktree and an SSH host, and worktree cleanup that saves snapshots. Both apps follow chats that need you, show diffs, search past chats and import other agents’ conversations. The ChatGPT app imports from Claude Code, Claude Cowork and Cursor; Splash imports from agents that list their sessions over ACP, and its Needs attention queue, kept across restarts, also holds connection failures.',
			cite: ['codex-app-local-env', 'codex-app-browser', 'codex-app-linux', 'codex-app-automations', 'codex-app-remote', 'codex-app-worktrees', 'codex-app-notifications', 'codex-app-code-review', 'codex-app-commands', 'codex-app-import', 'splash-features', 'splash-history']
		}
	],
	fit: {
		splash: [
			'You want to run agents from several vendors, Codex among them, side by side in one app.',
			'You want a free, MIT-licensed app with no account of its own.',
			'You want permission requests, failures and finished turns in one queue, and search across saved transcripts.',
			'You want to browse and import conversations your agents started outside the app.'
		],
		other: [
			'You work mainly with OpenAI’s Codex and have a ChatGPT plan, Free included.',
			'You want cloud tasks, SSH hosts and control from an iOS or Android phone.',
			'You want setup scripts, dev-server actions and a built-in browser alongside each worktree.',
			'You want to commit, open pull requests and review them in the same app.'
		]
	},
	sources: [
		{ id: 'codex-app-app', title: 'ChatGPT desktop app', url: 'https://learn.chatgpt.com/docs/app', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-quickstart', title: 'Quickstart', url: 'https://learn.chatgpt.com/docs/quickstart', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-modes', title: 'Codex environments', url: 'https://learn.chatgpt.com/docs/environments/modes', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-changelog-launch', title: 'ChatGPT & Codex changelog: Introducing the Codex app (2 February 2026)', url: 'https://learn.chatgpt.com/docs/changelog#codex-2026-02-02', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-changelog-intel', title: 'ChatGPT & Codex changelog: 16 April 2026', url: 'https://learn.chatgpt.com/docs/changelog#codex-2026-04-16-app', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-changelog-remote', title: 'ChatGPT & Codex changelog: 25 June 2026', url: 'https://learn.chatgpt.com/docs/changelog#codex-2026-06-25', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-changelog-chatgpt', title: 'ChatGPT & Codex changelog: 9 July 2026', url: 'https://learn.chatgpt.com/docs/changelog#codex-2026-07-09-app', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-changelog-latest', title: 'ChatGPT & Codex changelog: 25 September 2026', url: 'https://learn.chatgpt.com/docs/changelog#codex-2026-09-25-app', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-changelog-issues', title: 'ChatGPT & Codex changelog: 22 October 2025', url: 'https://learn.chatgpt.com/docs/changelog#codex-2025-10-22', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-open-source', title: 'Open Source', url: 'https://learn.chatgpt.com/docs/open-source', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-codex-license', title: 'LICENSE', url: 'https://github.com/openai/codex/blob/main/LICENSE', publisher: 'openai/codex on GitHub', checked: '2026-10-09' },
		{ id: 'codex-app-pricing', title: 'Pricing', url: 'https://learn.chatgpt.com/docs/pricing', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-store', title: 'ChatGPT', url: 'https://apps.microsoft.com/detail/9PLM9XGG6VKS', publisher: 'OpenAI on the Microsoft Store', checked: '2026-10-09' },
		{ id: 'codex-app-windows', title: 'ChatGPT desktop app for Windows', url: 'https://learn.chatgpt.com/docs/windows/windows-app', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-windows-deployment', title: 'Deploy the Windows app', url: 'https://learn.chatgpt.com/docs/enterprise/windows-deployment', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-linux', title: 'ChatGPT desktop app for Linux', url: 'https://learn.chatgpt.com/docs/linux/linux-app', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-subagents', title: 'Subagents', url: 'https://learn.chatgpt.com/docs/agent-configuration/subagents', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-troubleshooting', title: 'Troubleshooting', url: 'https://learn.chatgpt.com/docs/reference/troubleshooting', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-app-server', title: 'Codex App Server', url: 'https://learn.chatgpt.com/docs/app-server', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-auth', title: 'Authentication', url: 'https://learn.chatgpt.com/docs/auth', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-bedrock', title: 'Use ChatGPT Work and Codex with Amazon Bedrock', url: 'https://learn.chatgpt.com/docs/amazon-bedrock', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-permissions', title: 'Permissions', url: 'https://learn.chatgpt.com/docs/permission-modes', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-sandbox', title: 'Sandbox', url: 'https://learn.chatgpt.com/docs/sandboxing', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-mcp', title: 'Model Context Protocol', url: 'https://learn.chatgpt.com/docs/extend/mcp', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-plugins', title: 'Plugins', url: 'https://learn.chatgpt.com/docs/plugins', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-worktrees', title: 'Worktrees', url: 'https://learn.chatgpt.com/docs/environments/git-worktrees', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-local-env', title: 'Local environments', url: 'https://learn.chatgpt.com/docs/environments/local-environment', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-terminal', title: 'Integrated terminal', url: 'https://learn.chatgpt.com/docs/integrated-terminal', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-browser', title: 'Browser', url: 'https://learn.chatgpt.com/docs/browser', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-notifications', title: 'Notifications', url: 'https://learn.chatgpt.com/docs/notifications', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-automations', title: 'Scheduled tasks', url: 'https://learn.chatgpt.com/docs/automations', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-code-review', title: 'Code review', url: 'https://learn.chatgpt.com/docs/code-review', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-linear', title: 'Use Codex in Linear', url: 'https://learn.chatgpt.com/docs/third-party/linear', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-jira', title: 'Export and track security findings', url: 'https://learn.chatgpt.com/docs/security/plugin/export-findings', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-remote', title: 'Remote connections', url: 'https://learn.chatgpt.com/docs/remote-connections', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-mobile', title: 'Codex on mobile', url: 'https://learn.chatgpt.com/docs/mobile', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-updates', title: 'Manage app updates', url: 'https://learn.chatgpt.com/docs/enterprise/manage-app-updates', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-import', title: 'Import from another agent', url: 'https://learn.chatgpt.com/docs/import', publisher: 'OpenAI', checked: '2026-10-09' },
		{ id: 'codex-app-commands', title: 'Commands', url: 'https://learn.chatgpt.com/docs/reference/commands', publisher: 'OpenAI', checked: '2026-10-09' }
	]
};
