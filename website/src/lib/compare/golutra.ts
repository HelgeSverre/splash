// Splash vs Golutra. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const GOLUTRA: Comparison = {
	slug: 'golutra',
	name: 'Golutra',
	description: 'How Splash and Golutra compare on agents, platforms, licensing, isolation, review and remote control, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Golutra are desktop apps that run several coding agents at once. Golutra, a Tauri app, starts each agent’s own CLI in a terminal and coordinates the agents through chat, with roles, supervisor members and scheduled tasks. Splash drives agents over the Agent Client Protocol, each session in its project folder or its own git worktree.',
	other: {
		name: 'Golutra',
		url: 'https://www.golutra.com/',
		maker: 'Golutra',
		summary: 'A desktop multi-agent workspace that runs Claude Code, Codex, Gemini CLI and other command-line agents in terminals, coordinated through chat, with remote control, memory and stores for agents, skills and templates.',
		cite: ['golutra-readme', 'golutra-home', 'golutra-v0-2-7', 'golutra-v0-2-5']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app, plus self-hostable Web Server builds and a hosted web app (app.golutra.com) for remote control', cite: ['golutra-readme', 'golutra-v0-3-4', 'golutra-app-bundle'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v0.3.4 (28 September 2026); its tag points to the last public source commit, from 12 May 2026', cite: ['golutra-v0-3-4', 'golutra-tag-api', 'golutra-master-api'] } },
				{ label: 'License', splash: S.license, other: { text: 'Business Source License 1.1 (non-production use; the README allows commercial software built with it), becoming GPL-2.0-or-later by 25 February 2030', cite: ['golutra-license', 'golutra-readme'] } },
				{ label: 'Price', splash: S.price, other: { text: 'No prices are published. Remote control needs a membership, by upgrade or redeemed card; Golutra Enterprise has a waitlist', cite: ['golutra-home', 'golutra-app-bundle'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'Windows 10+ (x64, arm64), macOS 11+ (Apple silicon, Intel), Linux x64 and arm64 (AppImage, .deb, .rpm)', cite: ['golutra-home', 'golutra-v0-3-4'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Tauri, with a Vue 3 frontend and a Rust backend', cite: ['golutra-readme'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code, Gemini CLI, Codex CLI, OpenCode, Qwen Code, OpenClaw, its own Golutra Agent, and any CLI by command', cite: ['golutra-home', 'golutra-readme', 'golutra-v0-3-3', 'golutra-agent-readme', 'golutra-v0-2-0'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each agent’s CLI in a pseudo-terminal; prompts are typed into its terminal stream. No ACP or vendor SDK is documented', cite: ['golutra-home', 'golutra-pty', 'golutra-agent-desktop', 'golutra-readme'] } },
				{ label: 'Agent sign-in', splash: S.signIn, other: { text: 'Not documented for other CLIs; Golutra Agent uses the Golutra API, another vendor or a custom provider, by key or OAuth', cite: ['golutra-agent-providers', 'golutra-agent-desktop'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'A cloud account (Google, Apple, GitHub or email) for remote control; the web app’s sign-in page also offers to continue locally', cite: ['golutra-app', 'golutra-v0-2-5', 'golutra-app-bundle'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Not documented; Unlimited Mode, described as bypassing usage limits, starts Claude, Codex, Gemini and Qwen with flags that skip approvals', mark: 'unknown', cite: ['golutra-claude-member', 'golutra-codex-member', 'golutra-gemini-member', 'golutra-qwen-member', 'golutra-en-us'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Chat has had MCP support since v0.2.2, and golutra-mcp, a pilot-stage MCP server, lets agents and other MCP hosts drive the running app. No settings for other MCP servers are documented', mark: 'partial', cite: ['golutra-v0-2-2', 'golutra-mcp-readme', 'golutra-readme'] } },
				{ label: 'Agents handing off work', hint: 'One agent passing work to another', splash: S.handoff, other: { text: 'Agents are chat members with roles, and the site describes automatic result handoff; supervisor members coordinate tasks, and dispatched commands queue until a member is online', mark: 'yes', cite: ['golutra-home', 'golutra-readme', 'golutra-v0-1-7', 'golutra-v0-3-1', 'golutra-commands'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'No worktree or branch per agent is documented, and the app marks its sandbox option as not yet available; in the public source, members start in the shared workspace folder', mark: 'no', cite: ['golutra-readme', 'golutra-app-bundle', 'golutra-workspace-vue'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'None documented; since v0.1.5, settings can pass extra environment variables, such as a proxy, to the processes terminals start', mark: 'no', cite: ['golutra-readme', 'golutra-v0-1-5', 'golutra-app-bundle'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'Agents run in xterm.js terminals; a plain Terminal member is available, and the site describes a background Stealth Terminal', mark: 'yes', cite: ['golutra-home', 'golutra-package-json', 'golutra-pty', 'golutra-app-bundle'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Since v0.1.7, each member can have scheduled tasks that send prompts at an interval, at a daily time or once', mark: 'yes', cite: ['golutra-v0-1-7', 'golutra-app-bundle'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Statuses such as working or disconnected, tray unread badges and a dispatch queue view; no needs-input state is documented', mark: 'partial', cite: ['golutra-terminal-types', 'golutra-notification', 'golutra-v0-3-1'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'No diff viewer, review screen or way to send review feedback is documented', mark: 'no', cite: ['golutra-readme'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'No GitHub issues, pull request creation, merging or CI status is documented in the app', mark: 'no', cite: ['golutra-readme'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'None documented: no GitHub Issues, GitLab, Linear or Jira integration', mark: 'no', cite: ['golutra-readme'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Since v0.2.7, the web or desktop app controls a chosen online machine that runs Golutra’s desktop app or server; needs a cloud account and a membership', mark: 'yes', cite: ['golutra-v0-2-7', 'golutra-v0-3-4', 'golutra-app-bundle'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'No mobile app; the README lists mobile remote control as future work', mark: 'no', cite: ['golutra-readme'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Not documented; releases such as v0.3.1 include updater packages and their signature files', mark: 'unknown', cite: ['golutra-v0-3-1'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented; in the public source, resuming by session ID covers Codex sessions Golutra started, not other agents', mark: 'unknown', cite: ['golutra-readme', 'golutra-codex-member'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'A conversation’s chat history can be searched by message or member and filtered by date; no search across conversations is documented', mark: 'partial', cite: ['golutra-app-bundle', 'golutra-readme'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Golutra starts each agent’s CLI in a pseudo-terminal and types prompts into it; in the public source it reads the terminal screen to tell when an agent is ready. No ACP is documented, and the README lists a standard agent protocol as future work. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, natively or through a pinned adapter.',
			cite: ['golutra-home', 'golutra-pty', 'golutra-emulator', 'golutra-codex-member', 'golutra-readme', 'splash-registry', 'acp']
		},
		{
			title: 'How work is organized',
			text: 'Golutra coordinates agents through chat, with assigned roles, supervisor members, a dispatch queue and scheduled tasks; in the public source every agent starts in the same workspace folder. A Splash session is one agent in its project folder or in a git worktree on its own branch, and sessions don’t hand work to each other.',
			cite: ['golutra-home', 'golutra-v0-1-7', 'golutra-v0-3-1', 'golutra-commands', 'golutra-workspace-vue', 'splash-features', 'splash-readme']
		},
		{
			title: 'Memory, stores and history',
			text: 'Golutra adds a memory layer with local and cloud memory and long-term agent memory, can call EverOS for memory, and has Agent, Skill and Template Stores; v0.3.1 added Feishu connectors per member. Splash keeps each session’s transcript, searches saved text across sessions, and imports conversations agents list over ACP, including ones started elsewhere.',
			cite: ['golutra-v0-2-0', 'golutra-v0-2-5', 'golutra-readme', 'golutra-v0-3-1', 'splash-features', 'splash-history']
		},
		{
			title: 'Where agents run',
			text: 'Golutra’s desktop app runs on Windows 10+, macOS 11+ and Linux, and its Web Server build can be self-hosted. The hosted web app at app.golutra.com picks which online machine to control, with a cloud account and a membership; agents stay on that machine. Splash runs on macOS 14+, Windows 11 and Ubuntu 24.04, or as a single-user <code>splash-server</code> over SSH.',
			cite: ['golutra-home', 'golutra-v0-3-4', 'golutra-v0-2-6', 'golutra-app-bundle', 'splash-install', 'splash-server']
		},
		{
			title: 'License, price and accounts',
			text: 'Golutra uses the Business Source License 1.1, whose text says it isn’t an open-source license, though the README calls it one and allows building commercial software with Golutra. Versions become GPL-2.0-or-later by February 2030. No prices are published, and remote control requires a membership. Splash is free, MIT-licensed and has no accounts.',
			cite: ['golutra-license', 'golutra-readme', 'golutra-home', 'golutra-app-bundle', 'splash-license', 'splash-download', 'splash-build']
		}
	],
	fit: {
		splash: [
			'You want each agent session in its project folder or its own git worktree on a separate branch.',
			'You want permission requests, connection failures and finished turns in one queue, and a review screen with every changed file as a diff.',
			'You want to import conversations agents started elsewhere and triage GitHub issues, pull requests and Actions runs.',
			'You want a free, MIT-licensed app that needs no account.'
		],
		other: [
			'You want agents organized through chat, with roles, supervisor members and a dispatch queue.',
			'You want each agent’s own CLI in a terminal, any CLI you name, and Golutra’s own coding agent.',
			'You want agents to run scheduled, recurring tasks on Windows, macOS or Linux, arm64 included.',
			'You want to control your machine’s agents from a web app, or host Golutra as a web server yourself.'
		]
	},
	sources: [
		{ id: 'golutra-home', title: 'Golutra - Multi-Agent Era', url: 'https://www.golutra.com/', publisher: 'Golutra', checked: '2026-10-10' },
		{ id: 'golutra-app', title: 'Golutra web app sign-in page', url: 'https://app.golutra.com/', publisher: 'Golutra', checked: '2026-10-10' },
		{ id: 'golutra-app-bundle', title: 'app.golutra.com web app bundle', url: 'https://app.golutra.com/assets/main-brXL3cEU.js', publisher: 'Golutra', checked: '2026-10-10' },
		{ id: 'golutra-readme', title: 'golutra README', url: 'https://github.com/golutra/golutra/blob/master/README.md', publisher: 'golutra/golutra on GitHub', checked: '2026-10-10' },
		{ id: 'golutra-license', title: 'LICENSE (Business Source License 1.1)', url: 'https://github.com/golutra/golutra/blob/master/LICENSE', publisher: 'golutra/golutra on GitHub', checked: '2026-10-10' },
		{ id: 'golutra-v0-3-4', title: 'Release v0.3.4', url: 'https://github.com/golutra/golutra/releases/tag/v0.3.4', publisher: 'golutra/golutra on GitHub', checked: '2026-10-10' },
		{ id: 'golutra-v0-3-3', title: 'Release v0.3.3', url: 'https://github.com/golutra/golutra/releases/tag/v0.3.3', publisher: 'golutra/golutra on GitHub', checked: '2026-10-10' },
		{ id: 'golutra-v0-3-1', title: 'Release v0.3.1', url: 'https://github.com/golutra/golutra/releases/tag/v0.3.1', publisher: 'golutra/golutra on GitHub', checked: '2026-10-10' },
		{ id: 'golutra-v0-2-7', title: 'Release v0.2.7', url: 'https://github.com/golutra/golutra/releases/tag/v0.2.7', publisher: 'golutra/golutra on GitHub', checked: '2026-10-10' },
		{ id: 'golutra-v0-2-6', title: 'Release v0.2.6', url: 'https://github.com/golutra/golutra/releases/tag/v0.2.6', publisher: 'golutra/golutra on GitHub', checked: '2026-10-10' },
		{ id: 'golutra-v0-2-5', title: 'Release v0.2.5', url: 'https://github.com/golutra/golutra/releases/tag/v0.2.5', publisher: 'golutra/golutra on GitHub', checked: '2026-10-10' },
		{ id: 'golutra-v0-2-2', title: 'Release v0.2.2', url: 'https://github.com/golutra/golutra/releases/tag/v0.2.2', publisher: 'golutra/golutra on GitHub', checked: '2026-10-10' },
		{ id: 'golutra-v0-2-0', title: 'Release v0.2.0', url: 'https://github.com/golutra/golutra/releases/tag/v0.2.0', publisher: 'golutra/golutra on GitHub', checked: '2026-10-10' },
		{ id: 'golutra-v0-1-7', title: 'Release v0.1.7', url: 'https://github.com/golutra/golutra/releases/tag/v0.1.7', publisher: 'golutra/golutra on GitHub', checked: '2026-10-10' },
		{ id: 'golutra-v0-1-5', title: 'Release v0.1.5', url: 'https://github.com/golutra/golutra/releases/tag/v0.1.5', publisher: 'golutra/golutra on GitHub', checked: '2026-10-10' },
		{ id: 'golutra-tag-api', title: 'Git ref tags/v0.3.4', url: 'https://api.github.com/repos/golutra/golutra/git/ref/tags/v0.3.4', publisher: 'golutra/golutra on GitHub', checked: '2026-10-10' },
		{ id: 'golutra-master-api', title: 'Latest commit on master', url: 'https://api.github.com/repos/golutra/golutra/commits/master', publisher: 'golutra/golutra on GitHub', checked: '2026-10-10' },
		{ id: 'golutra-pty', title: 'src-tauri/src/runtime/pty.rs', url: 'https://github.com/golutra/golutra/blob/master/src-tauri/src/runtime/pty.rs', publisher: 'golutra/golutra on GitHub', checked: '2026-10-10' },
		{ id: 'golutra-emulator', title: 'src-tauri/src/terminal_engine/emulator.rs', url: 'https://github.com/golutra/golutra/blob/master/src-tauri/src/terminal_engine/emulator.rs', publisher: 'golutra/golutra on GitHub', checked: '2026-10-10' },
		{ id: 'golutra-codex-member', title: 'src-tauri/src/terminal_engine/default_members/codex.rs', url: 'https://github.com/golutra/golutra/blob/master/src-tauri/src/terminal_engine/default_members/codex.rs', publisher: 'golutra/golutra on GitHub', checked: '2026-10-10' },
		{ id: 'golutra-claude-member', title: 'src-tauri/src/terminal_engine/default_members/claude.rs', url: 'https://github.com/golutra/golutra/blob/master/src-tauri/src/terminal_engine/default_members/claude.rs', publisher: 'golutra/golutra on GitHub', checked: '2026-10-10' },
		{ id: 'golutra-gemini-member', title: 'src-tauri/src/terminal_engine/default_members/gemini.rs', url: 'https://github.com/golutra/golutra/blob/master/src-tauri/src/terminal_engine/default_members/gemini.rs', publisher: 'golutra/golutra on GitHub', checked: '2026-10-10' },
		{ id: 'golutra-qwen-member', title: 'src-tauri/src/terminal_engine/default_members/qwen.rs', url: 'https://github.com/golutra/golutra/blob/master/src-tauri/src/terminal_engine/default_members/qwen.rs', publisher: 'golutra/golutra on GitHub', checked: '2026-10-10' },
		{ id: 'golutra-commands', title: 'src-tauri/src/terminal_engine/session/commands.rs', url: 'https://github.com/golutra/golutra/blob/master/src-tauri/src/terminal_engine/session/commands.rs', publisher: 'golutra/golutra on GitHub', checked: '2026-10-10' },
		{ id: 'golutra-notification', title: 'src-tauri/src/ui_gateway/notification.rs', url: 'https://github.com/golutra/golutra/blob/master/src-tauri/src/ui_gateway/notification.rs', publisher: 'golutra/golutra on GitHub', checked: '2026-10-10' },
		{ id: 'golutra-en-us', title: 'src/i18n/locales/en-US.ts', url: 'https://github.com/golutra/golutra/blob/master/src/i18n/locales/en-US.ts', publisher: 'golutra/golutra on GitHub', checked: '2026-10-10' },
		{ id: 'golutra-workspace-vue', title: 'src/features/terminal/TerminalWorkspace.vue', url: 'https://github.com/golutra/golutra/blob/master/src/features/terminal/TerminalWorkspace.vue', publisher: 'golutra/golutra on GitHub', checked: '2026-10-10' },
		{ id: 'golutra-terminal-types', title: 'src/shared/types/terminal.ts', url: 'https://github.com/golutra/golutra/blob/master/src/shared/types/terminal.ts', publisher: 'golutra/golutra on GitHub', checked: '2026-10-10' },
		{ id: 'golutra-package-json', title: 'package.json', url: 'https://github.com/golutra/golutra/blob/master/package.json', publisher: 'golutra/golutra on GitHub', checked: '2026-10-10' },
		{ id: 'golutra-mcp-readme', title: 'golutra-mcp README', url: 'https://github.com/golutra/golutra-mcp/blob/main/README.md', publisher: 'golutra/golutra-mcp on GitHub', checked: '2026-10-10' },
		{ id: 'golutra-agent-readme', title: 'Golutra Agent README', url: 'https://github.com/golutra/golutra-agent/blob/main/README.md', publisher: 'golutra/golutra-agent on GitHub', checked: '2026-10-10' },
		{ id: 'golutra-agent-providers', title: 'docs/llm-provider-integration.md', url: 'https://github.com/golutra/golutra-agent/blob/main/docs/llm-provider-integration.md', publisher: 'golutra/golutra-agent on GitHub', checked: '2026-10-10' },
		{ id: 'golutra-agent-desktop', title: 'docs/desktop-integration.md', url: 'https://github.com/golutra/golutra-agent/blob/main/docs/desktop-integration.md', publisher: 'golutra/golutra-agent on GitHub', checked: '2026-10-10' }
	]
};
