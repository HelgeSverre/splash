// Splash vs CodeAgentSwarm. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const CODEAGENTSWARM: Comparison = {
	slug: 'codeagentswarm',
	name: 'CodeAgentSwarm',
	description: 'How Splash and CodeAgentSwarm compare on agents, platforms, pricing, worktrees, review and remote access, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and CodeAgentSwarm are desktop apps for running several coding agents at once, each optionally in its own git worktree. CodeAgentSwarm runs the real CLI of each of its ten supported agents in a terminal, adding Chat views and a Kanban board agents update; Splash drives agents over the Agent Client Protocol and shows each session as a transcript.',
	other: {
		name: 'CodeAgentSwarm',
		url: 'https://www.codeagentswarm.com/en',
		maker: 'Arturo García',
		summary: 'A desktop app for macOS, Windows and Linux that runs ten coding-agent CLIs side by side, with live status, conversation history, a Kanban task board and optional git worktrees. Free during its open beta.',
		cite: ['codeagentswarm-terms', 'codeagentswarm-beta', 'codeagentswarm-home', 'codeagentswarm-worktrees']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app with a free iOS companion; a separate open-source package, CAS Cloud, runs agents headless with a web client', cite: ['codeagentswarm-terms', 'codeagentswarm-app-store', 'codeagentswarm-cas-cloud'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'Open Beta; version 2.4.3 came out on 30 September 2026, after 2.4.0 on 24 September', cite: ['codeagentswarm-beta'] } },
				{ label: 'License', splash: S.license, other: { text: 'Proprietary and closed source; the terms forbid reverse engineering. The separate CAS Cloud package is AGPL-3.0', cite: ['codeagentswarm-t3', 'codeagentswarm-terms', 'codeagentswarm-cas-cloud'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free during the Open Beta, with Pro unlocked once you create an account; no post-beta price is published', cite: ['codeagentswarm-beta'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 12+ (Apple silicon and Intel), Windows 10/11 and Linux (.deb, AppImage) on x64 and ARM64; iOS 16.4+ companion', cite: ['codeagentswarm-beta', 'codeagentswarm-app-store'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'A fixed ten: Claude Code, Codex CLI, Antigravity CLI, OpenCode, Kimi Code, Grok Build, Cursor Agent, Muse Code, Pi, Devin CLI', cite: ['codeagentswarm-about', 'codeagentswarm-superset'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'The agent’s own CLI in a terminal; Chat views use ACP, Pi RPC, the Claude Agent SDK or codex app-server', cite: ['codeagentswarm-home', 'codeagentswarm-cursor-acp', 'codeagentswarm-pi', 'codeagentswarm-cas-chat-manager', 'codeagentswarm-cas-acp-driver'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Each agent CLI’s own login and plan; CodeAgentSwarm sells no model usage, and providers apply their own limits', cite: ['codeagentswarm-about', 'codeagentswarm-llms', 'codeagentswarm-beta'] } },
				{ label: 'Usage and limits', hint: 'Plan limits, context and cost', splash: { text: 'Shows context use and cost when the agent reports them', mark: 'yes', cite: ['splash-features'] }, other: { text: 'Shows each subscription’s remaining quota; since 2.4.0, daily caps per provider can alert you, hold new tasks or halt work', mark: 'yes', cite: ['codeagentswarm-t3', 'codeagentswarm-home'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'Optional per the privacy policy, but some features and the beta’s free Pro need GitHub, Google or Discord sign-in', cite: ['codeagentswarm-privacy', 'codeagentswarm-terms', 'codeagentswarm-beta'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'You answer each agent’s approval requests; Turbo Mode skips routine prompts but still blocks protected-branch pushes and destructive deletes', mark: 'yes', cite: ['codeagentswarm-about', 'codeagentswarm-home', 'codeagentswarm-beta'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'An MCP server marketplace you enable per project; agents work the task board over MCP, and Cursor’s .cursor/mcp.json is read', mark: 'yes', cite: ['codeagentswarm-llms', 'codeagentswarm-home', 'codeagentswarm-cursor-acp'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Optional, off by default: a git worktree on its own cas/ branch per terminal or Auto task, or the project folder', mark: 'yes', cite: ['codeagentswarm-worktrees', 'codeagentswarm-auto-kanban', 'codeagentswarm-about'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'A terminal per agent, arranged in Grid, Tabs or List views with resizable panels', mark: 'yes', cite: ['codeagentswarm-landing-readme', 'codeagentswarm-coordinator', 'codeagentswarm-beta'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'A session that needs you is flagged and sorted first while the rest keep working', mark: 'yes', cite: ['codeagentswarm-home'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'Desktop notifications when an agent completes, waits for input or hits an error', mark: 'yes', cite: ['codeagentswarm-home', 'codeagentswarm-beta'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Since 2.4.0, a coordinator agent plans work and opens worker sessions; with Session communication on, sessions can question each other', mark: 'yes', cite: ['codeagentswarm-home', 'codeagentswarm-coordinator'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Auto starts queued Kanban tasks by itself, several at once up to your cap; timed schedules are not documented', mark: 'partial', cite: ['codeagentswarm-home', 'codeagentswarm-auto-kanban', 'codeagentswarm-superset'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Live diffs per terminal while the agent edits; finished tasks wait in In Testing; no inline diff comments to the agent', mark: 'yes', cite: ['codeagentswarm-home', 'codeagentswarm-task-management', 'codeagentswarm-vibe-kanban'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'No PR button: the Git Manager stages, commits, pushes and pulls, writing commit messages with your local Claude CLI', mark: 'no', cite: ['codeagentswarm-t3', 'codeagentswarm-commit-messages', 'codeagentswarm-privacy'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'No built-in GitHub view or PR status is documented; agents reach GitHub through an MCP server from the marketplace', mark: 'partial', cite: ['codeagentswarm-t3', 'codeagentswarm-home'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'A built-in Kanban task board; Atlassian and GitHub reach agents as MCP servers, and no native tracker sync is documented', mark: 'partial', cite: ['codeagentswarm-task-management', 'codeagentswarm-home'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Mobile Connect (alpha) lets a phone follow and message desktop sessions; CAS Cloud runs agents on your Mac, Linux box or VPS', mark: 'partial', cite: ['codeagentswarm-about', 'codeagentswarm-t3', 'codeagentswarm-cas-cloud'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'Free iOS app for iPhone, iPad and Apple Watch; Mobile Connect is alpha and needs the desktop online; Android by request', mark: 'partial', cite: ['codeagentswarm-app-store', 'codeagentswarm-about', 'codeagentswarm-t3'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Sessions started outside the app', splash: S.history, other: { text: 'Uses each agent’s history already on disk, like Claude Code’s JSONL files, to search and resume earlier conversations', mark: 'yes', cite: ['codeagentswarm-claude-history', 'codeagentswarm-claude-history-guide', 'codeagentswarm-opencode-history'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Searches past conversations from every agent and project, filters by project or agent, and resumes one in a new terminal', mark: 'yes', cite: ['codeagentswarm-landing-readme', 'codeagentswarm-claude-history'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'CodeAgentSwarm integrates ten agents individually, each running its real CLI in a terminal; arbitrary commands can’t be added as agents. Chat views use ACP for Cursor Agent, Pi’s native RPC, and, per the maker’s source, the Claude Agent SDK and <code>codex app-server</code>. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, natively or through an adapter.',
			cite: ['codeagentswarm-superset', 'codeagentswarm-home', 'codeagentswarm-cursor-acp', 'codeagentswarm-pi', 'codeagentswarm-cas-chat-manager', 'splash-registry', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'CodeAgentSwarm’s desktop app runs agents on your computer; a separate open-source package, <strong>CAS Cloud</strong> (AGPL-3.0), runs them headless on a Mac, Linux box or VPS you control, reached from a browser client or the desktop app. Splash runs agents on your computer, or under <code>splash-server</code> on a machine you reach from a browser through an SSH tunnel.',
			cite: ['codeagentswarm-terms', 'codeagentswarm-cas-cloud', 'splash-readme', 'splash-server']
		},
		{
			title: 'Price, accounts and license',
			text: 'CodeAgentSwarm is closed source under a proprietary license. It is free during its Open Beta, with Pro unlocked by signing in through GitHub, Google or Discord; the site gives no post-beta price, and the terms route paid plans through Stripe. Splash is free, MIT-licensed and has no accounts.',
			cite: ['codeagentswarm-t3', 'codeagentswarm-terms', 'codeagentswarm-beta', 'splash-license', 'splash-download', 'splash-build']
		},
		{
			title: 'Around the session',
			text: 'CodeAgentSwarm organizes work on a Kanban board that agents read and update over MCP: Auto starts queued tasks, coordinators open worker sessions, per-provider daily budgets can pause new work, and finished cards wait in In Testing. Splash centers on the conversation: a Needs attention queue, a review screen with feedback to the agent, and a GitHub triage view.',
			cite: ['codeagentswarm-home', 'codeagentswarm-auto-kanban', 'codeagentswarm-coordinator', 'codeagentswarm-task-management', 'splash-features', 'splash-history', 'splash-github']
		},
		{
			title: 'Platforms and phones',
			text: 'CodeAgentSwarm builds for macOS 12+, Windows 10/11 and Linux on x64 and ARM64, though its Windows installers are not yet code-signed, and offers a free iOS companion that pairs through Mobile Connect, in alpha. Splash builds for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64 plus a headless server, and has no phone app.',
			cite: ['codeagentswarm-beta', 'codeagentswarm-app-store', 'codeagentswarm-about', 'codeagentswarm-t3', 'splash-install']
		}
	],
	fit: {
		splash: [
			'You want a free, MIT-licensed app that needs no account.',
			'You want Gemini, Copilot, Goose and other agents driven over the Agent Client Protocol in one transcript view.',
			'You want permission requests, failures and finished turns gathered in one Needs attention queue, with a review screen that sends feedback to the agent.',
			'You want a GitHub triage view of issues, pull requests and Actions runs across repositories.'
		],
		other: [
			'You want a Kanban board your agents update, with queued tasks that start by themselves and coordinators that hand work to other sessions.',
			'You want each agent’s own CLI in a terminal, with a Chat view of the same conversation for several agents.',
			'You want ARM64 builds for Windows and Linux, and an iOS companion for iPhone, iPad and Apple Watch.',
			'You want quota readouts and daily budgets per provider, plus commit messages written by your local Claude CLI.'
		]
	},
	sources: [
		{ id: 'codeagentswarm-home', title: 'Agentic Development Environment (ADE)', url: 'https://www.codeagentswarm.com/en', publisher: 'CodeAgentSwarm', checked: '2026-10-10' },
		{ id: 'codeagentswarm-about', title: 'About CodeAgentSwarm and its creator', url: 'https://www.codeagentswarm.com/en/about', publisher: 'CodeAgentSwarm', checked: '2026-10-10' },
		{ id: 'codeagentswarm-beta', title: 'Open Beta: Free Pro Access for AI Coding Agents', url: 'https://www.codeagentswarm.com/en/beta', publisher: 'CodeAgentSwarm', checked: '2026-10-10' },
		{ id: 'codeagentswarm-terms', title: 'Terms of Service', url: 'https://www.codeagentswarm.com/en/terms', publisher: 'CodeAgentSwarm', checked: '2026-10-10' },
		{ id: 'codeagentswarm-privacy', title: 'Privacy Policy', url: 'https://www.codeagentswarm.com/en/privacy', publisher: 'CodeAgentSwarm', checked: '2026-10-10' },
		{ id: 'codeagentswarm-llms', title: 'llms.txt', url: 'https://www.codeagentswarm.com/llms.txt', publisher: 'CodeAgentSwarm', checked: '2026-10-10' },
		{ id: 'codeagentswarm-app-store', title: 'CodeAgentSwarm App', url: 'https://apps.apple.com/us/app/codeagentswarm/id6801180696', publisher: 'Apple App Store', checked: '2026-10-10' },
		{ id: 'codeagentswarm-t3', title: 'T3 Code vs CodeAgentSwarm: An Honest Comparison', url: 'https://www.codeagentswarm.com/en/guides/t3-code-vs-codeagentswarm', publisher: 'CodeAgentSwarm', checked: '2026-10-10' },
		{ id: 'codeagentswarm-superset', title: 'Superset vs CodeAgentSwarm: An Honest Comparison', url: 'https://www.codeagentswarm.com/en/guides/superset-vs-codeagentswarm', publisher: 'CodeAgentSwarm', checked: '2026-10-10' },
		{ id: 'codeagentswarm-vibe-kanban', title: 'Vibe Kanban vs CodeAgentSwarm: An Honest Comparison', url: 'https://www.codeagentswarm.com/en/guides/vibe-kanban-vs-codeagentswarm', publisher: 'CodeAgentSwarm', checked: '2026-10-10' },
		{ id: 'codeagentswarm-cursor-acp', title: 'Cursor CLI Guide: Install Cursor Agent and Use ACP', url: 'https://www.codeagentswarm.com/en/guides/cursor-agent-cli-acp-codeagentswarm', publisher: 'CodeAgentSwarm', checked: '2026-10-10' },
		{ id: 'codeagentswarm-pi', title: 'Pi Coding Agent: Install, Sign In and Start Coding', url: 'https://www.codeagentswarm.com/en/guides/how-to-use-pi-coding-agent', publisher: 'CodeAgentSwarm', checked: '2026-10-10' },
		{ id: 'codeagentswarm-worktrees', title: 'Git Worktrees for AI Coding Agents', url: 'https://www.codeagentswarm.com/en/guides/git-worktrees-for-ai-coding-agents', publisher: 'CodeAgentSwarm', checked: '2026-10-10' },
		{ id: 'codeagentswarm-auto-kanban', title: 'Auto Kanban for AI Coding Agents', url: 'https://www.codeagentswarm.com/en/guides/auto-kanban-ai-coding-agents', publisher: 'CodeAgentSwarm', checked: '2026-10-10' },
		{ id: 'codeagentswarm-task-management', title: 'Claude Code Task Management: A Kanban Board Your AI Agents Update', url: 'https://www.codeagentswarm.com/en/guides/claude-code-task-management', publisher: 'CodeAgentSwarm', checked: '2026-10-10' },
		{ id: 'codeagentswarm-coordinator', title: 'AI Coding Agent Coordinator', url: 'https://www.codeagentswarm.com/en/guides/ai-coding-agent-coordinator', publisher: 'CodeAgentSwarm', checked: '2026-10-10' },
		{ id: 'codeagentswarm-commit-messages', title: 'AI Commit Message Generator Built Into Your Claude Code Workspace', url: 'https://www.codeagentswarm.com/en/guides/ai-commit-messages-claude-code', publisher: 'CodeAgentSwarm', checked: '2026-10-10' },
		{ id: 'codeagentswarm-claude-history', title: 'Search Claude Code History Across Projects', url: 'https://www.codeagentswarm.com/en/guides/claude-code-history', publisher: 'CodeAgentSwarm', checked: '2026-10-10' },
		{ id: 'codeagentswarm-claude-history-guide', title: 'Claude Code History: Find, Resume & Restore Sessions', url: 'https://www.codeagentswarm.com/en/guides/claude-code-history-complete-guide', publisher: 'CodeAgentSwarm', checked: '2026-10-10' },
		{ id: 'codeagentswarm-opencode-history', title: 'OpenCode Conversation History: Resume Sessions & Search', url: 'https://www.codeagentswarm.com/en/guides/opencode-conversation-history', publisher: 'CodeAgentSwarm', checked: '2026-10-10' },
		{ id: 'codeagentswarm-landing-readme', title: 'README.md', url: 'https://github.com/arturogj92/codeagentswarm-landing/blob/master/README.md', publisher: 'arturogj92/codeagentswarm-landing on GitHub', checked: '2026-10-10' },
		{ id: 'codeagentswarm-cas-cloud', title: 'CAS Cloud README', url: 'https://github.com/arturogj92/cas-cloud', publisher: 'arturogj92/cas-cloud on GitHub', checked: '2026-10-10' },
		{ id: 'codeagentswarm-cas-chat-manager', title: 'src/infrastructure/agent-drivers/driver-chat-manager.js', url: 'https://github.com/arturogj92/cas-cloud/blob/main/src/infrastructure/agent-drivers/driver-chat-manager.js', publisher: 'arturogj92/cas-cloud on GitHub', checked: '2026-10-10' },
		{ id: 'codeagentswarm-cas-acp-driver', title: 'src/infrastructure/agent-drivers/acp-agent-driver.js', url: 'https://github.com/arturogj92/cas-cloud/blob/main/src/infrastructure/agent-drivers/acp-agent-driver.js', publisher: 'arturogj92/cas-cloud on GitHub', checked: '2026-10-10' }
	]
};
