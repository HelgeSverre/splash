// Splash vs AgentGrid. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const AGENTGRID: Comparison = {
	slug: 'agentgrid',
	name: 'AgentGrid',
	description: 'How Splash and AgentGrid compare on agents, orchestration, platforms, pricing, worktrees and review, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and AgentGrid are both desktop apps for running several coding agents at once. AgentGrid, a closed-source Electron app, places agents, terminals and browsers on an infinite canvas, where a master agent can direct workers through MCP tools. Splash, a free, open-source app, runs each agent as its own session and drives it over the Agent Client Protocol.',
	other: {
		name: 'AgentGrid',
		url: 'https://agentgrid.sh',
		maker: 'AgentGrid',
		summary: 'A closed-source Electron app that puts Claude Code, Codex, Cursor and other agent harnesses on an infinite canvas with terminals and browsers, where master agents coordinate workers through MCP tools. It requires an AgentGrid account.',
		cite: ['agentgrid-home', 'agentgrid-docs', 'agentgrid-system-requirements', 'agentgrid-org-profile', 'agentgrid-panes', 'agentgrid-billing']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Electron desktop app with agents, terminals, browsers and notes on an infinite canvas; an iOS companion app in pre-release pairs with it', cite: ['agentgrid-docs', 'agentgrid-system-requirements', 'agentgrid-panes', 'agentgrid-changelog', 'agentgrid-mobile'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v2.9.5 (7 October 2026); the changelog lists 90 releases from v2.0.0 on 1 May 2026', cite: ['agentgrid-download', 'agentgrid-release', 'agentgrid-changelog'] } },
				{ label: 'License', splash: S.license, other: { text: 'Closed source, per its GitHub organization; the terms keep rights in the software with AgentGrid and its licensors', cite: ['agentgrid-org-profile', 'agentgrid-terms'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free: 3 projects, each running up to 10 agents at once. Pro: $20 a month or $192 a year (early-adopter price)', cite: ['agentgrid-pricing'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 11+ (Apple silicon, Intel), Windows 10/11 x64, Linux x64 (AppImage, .deb); downloads also offer Arm64 Windows and Linux builds', cite: ['agentgrid-system-requirements', 'agentgrid-download', 'agentgrid-release'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code, Codex, OpenCode, Antigravity, Cursor, Devin, Grok, Kimi and Pi in the docs; a story and the changelog also name Hermes. Adding others isn’t documented', cite: ['agentgrid-docs', 'agentgrid-harness-setup', 'agentgrid-switch-harness', 'agentgrid-changelog'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Masters: the harness’s CLI in a terminal, or a GUI conversation (default for new installs). Workers: an SDK, runtime or CLI', cite: ['agentgrid-harnesses', 'agentgrid-changelog', 'agentgrid-roles'] } },
				{ label: 'Model and mode pickers', splash: S.models, other: { text: 'GUI panes have model, effort and account pickers, plus a harness switch that passes the conversation text to the new agent', mark: 'yes', cite: ['agentgrid-changelog', 'agentgrid-multiple-accounts', 'agentgrid-switch-harness'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Reuses each harness’s own login and subscription; several Claude Code or Codex accounts, picked per pane. Providers bill model use separately', cite: ['agentgrid-harness-setup', 'agentgrid-home', 'agentgrid-multiple-accounts', 'agentgrid-pricing'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'An AgentGrid account, through Google or email, is needed before the workspace opens; downloading the installer needs none', cite: ['agentgrid-billing', 'agentgrid-installation'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Default, Plan, Auto and Bypass Permissions modes; Auto approves tool calls it has screened for risk and prompt injection', mark: 'yes', cite: ['agentgrid-harnesses'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Masters get AgentGrid’s MCP tools; a local MCP endpoint lets outside agents drive panes; roles can give Claude SDK workers MCP servers', mark: 'yes', cite: ['agentgrid-docs', 'agentgrid-hermes', 'agentgrid-roles'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A worker inherits its master’s folder by default; masters can give builders a git worktree via create_worktree. No containers documented', mark: 'partial', cite: ['agentgrid-spaces', 'agentgrid-build-review', 'agentgrid-changelog', 'agentgrid-roles'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Activity dots mark working panes; unread dots mark finished masters, optionally workers; the title bar shows usage and reset times for harnesses that report them', mark: 'yes', cite: ['agentgrid-canvas', 'agentgrid-changelog', 'agentgrid-agents-workers'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Masters (any harness but Antigravity and Pi) spawn, message and wait on workers through MCP tools; a Coordinator conversation, enabled by default on new installs since v2.8.39, runs teams', mark: 'yes', cite: ['agentgrid-docs', 'agentgrid-harness-setup', 'agentgrid-orchestrating', 'agentgrid-changelog'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'Chromium panes with DevTools on the canvas; cookies and storage are kept apart per project folder', mark: 'yes', cite: ['agentgrid-panes', 'agentgrid-browsers'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Source Control lists an agent’s commits, diffs, worktrees and PRs; qa and validator roles review work; diff comments aren’t documented', mark: 'yes', cite: ['agentgrid-panes', 'agentgrid-changelog', 'agentgrid-roles'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'No create or merge button is documented; the official build-and-review workflow has the builder agent open a draft PR', mark: 'partial', cite: ['agentgrid-build-review'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Source Control lists PRs and the footer shows PR status; opt-in replies to @AgentGrid mentions; reviews post as an agentgrid-ai bot', mark: 'yes', cite: ['agentgrid-panes', 'agentgrid-changelog'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'Not documented; Pro lists local and cloud agents, but no page says how or where cloud agents run', mark: 'unknown', cite: ['agentgrid-pricing'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'Live project sharing with a paired desktop over Tailscale or a LAN; Claude masters can continue on claude.ai via /rc', mark: 'yes', cite: ['agentgrid-shared-projects', 'agentgrid-changelog'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'Pre-release iOS companion through TestFlight that watches and prompts agents on a desktop on the same network; Android isn’t available yet', mark: 'partial', cite: ['agentgrid-mobile'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Fetches new versions from GitHub Releases in the background unless you turn that off in Settings', mark: 'yes', cite: ['agentgrid-updates', 'agentgrid-installation'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented; Resume Claude lists Claude sessions that can be recovered from the project folder, and masters can resume sessions across harnesses', mark: 'unknown', cite: ['agentgrid-spawn-menu', 'agentgrid-agents-workers'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Sidebar search matches prompt text, titles and metadata of panes in the current space; search across spaces isn’t documented', mark: 'partial', cite: ['agentgrid-canvas-filtering'] } },
				{ label: 'Fork a conversation', splash: S.fork, other: { text: 'Masters whose harness supports forking branch into a new pane; GUI team leads fork into a fresh session with one click', mark: 'yes', cite: ['agentgrid-panes', 'agentgrid-changelog'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'An AgentGrid master runs its harness’s CLI in a terminal pane or appears as a GUI conversation, the default for new installs. The app bundles the Claude Agent SDK and Codex SDK, Claude workers run on the SDK or the CLI, and its Langfuse guide names a Devin ACP path. Splash talks to every agent over the <strong>Agent Client Protocol</strong>.',
			cite: ['agentgrid-harnesses', 'agentgrid-changelog', 'agentgrid-system-requirements', 'agentgrid-roles', 'agentgrid-langfuse', 'splash-registry', 'acp']
		},
		{
			title: 'Teams of agents on a canvas',
			text: 'In AgentGrid, a master spawns role-based workers, messages them and waits on their results through MCP tools, and a Coordinator conversation, enabled by default on new installs since v2.8.39, manages teams within a project or across all local projects, all on an infinite canvas with terminals, browsers and notes. In Splash each session is one agent in one folder, and sessions don’t hand work to each other.',
			cite: ['agentgrid-docs', 'agentgrid-orchestrating', 'agentgrid-roles', 'agentgrid-changelog', 'agentgrid-panes', 'splash-readme', 'splash-features']
		},
		{
			title: 'Accounts, price and license',
			text: 'AgentGrid is closed source and needs an AgentGrid account before the workspace opens. Its Free plan covers 3 projects of up to 10 agents each; Pro, at an early-adopter price of $20 a month or $192 a year, adds unlimited canvases, cloud sync and cloud agents. Neither plan includes model use. Splash is free and MIT-licensed, and has no accounts.',
			cite: ['agentgrid-org-profile', 'agentgrid-billing', 'agentgrid-pricing', 'splash-license', 'splash-download', 'splash-build']
		},
		{
			title: 'Where agents run',
			text: 'AgentGrid runs agents on your computer under a background daemon, on by default, so closing the window doesn’t stop them. A paired desktop can share a project over Tailscale or a LAN, and a pre-release iOS app follows agents on the same network. Splash runs agents on your computer, or under <code>splash-server</code> on a machine you reach in a browser over SSH.',
			cite: ['agentgrid-daemon', 'agentgrid-shared-projects', 'agentgrid-mobile', 'splash-readme', 'splash-server']
		},
		{
			title: 'Platforms and updates',
			text: 'AgentGrid ships for macOS 11+, Windows 10/11 and Linux (AppImage or .deb), with Arm64 builds for Windows and Linux, and updates itself from GitHub Releases. Splash builds for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64 plus a headless server, and you download new versions from GitHub.',
			cite: ['agentgrid-system-requirements', 'agentgrid-download', 'agentgrid-release', 'agentgrid-updates', 'splash-install', 'splash-about']
		}
	],
	fit: {
		splash: [
			'You want a free, MIT-licensed app that needs no account.',
			'You want Gemini, Copilot, Goose and other agents driven over the Agent Client Protocol.',
			'You want to import conversations an agent started outside the app and search saved transcripts, archived ones included.',
			'You want to run sessions on your own server and reach them from a browser over SSH.'
		],
		other: [
			'You want a master agent to split work across role-based workers you can watch on one canvas.',
			'You want terminals, Chromium browsers and notes laid out beside your agents.',
			'You want to move a conversation between harnesses, or run several Claude Code or Codex accounts.',
			'You want an app that updates itself and lets a second desktop, or an iPhone in pre-release, follow your agents.'
		]
	},
	sources: [
		{ id: 'agentgrid-home', title: 'Infinite Canvas for AI Agents', url: 'https://agentgrid.sh', publisher: 'AgentGrid', checked: '2026-10-10' },
		{ id: 'agentgrid-docs', title: 'Introduction', url: 'https://agentgrid.sh/docs', publisher: 'AgentGrid', checked: '2026-10-10' },
		{ id: 'agentgrid-org-profile', title: 'AgentGrid organization profile (profile/README.md)', url: 'https://github.com/agent-grid/.github/blob/main/profile/README.md', publisher: 'agent-grid/.github on GitHub', checked: '2026-10-10' },
		{ id: 'agentgrid-terms', title: 'Terms of Service', url: 'https://agentgrid.sh/terms', publisher: 'AgentGrid', checked: '2026-10-10' },
		{ id: 'agentgrid-pricing', title: 'Pricing', url: 'https://agentgrid.sh/pricing', publisher: 'AgentGrid', checked: '2026-10-10' },
		{ id: 'agentgrid-billing', title: 'Account and billing', url: 'https://agentgrid.sh/guides/account-and-billing', publisher: 'AgentGrid', checked: '2026-10-10' },
		{ id: 'agentgrid-installation', title: 'Installation', url: 'https://agentgrid.sh/docs/getting-started/installation', publisher: 'AgentGrid', checked: '2026-10-10' },
		{ id: 'agentgrid-system-requirements', title: 'System Requirements', url: 'https://agentgrid.sh/docs/getting-started/system-requirements', publisher: 'AgentGrid', checked: '2026-10-10' },
		{ id: 'agentgrid-download', title: 'Download AgentGrid', url: 'https://agentgrid.sh/download', publisher: 'AgentGrid', checked: '2026-10-10' },
		{ id: 'agentgrid-release', title: 'AgentGrid 2.9.5', url: 'https://github.com/agent-grid/agent-grid-releases/releases/tag/v2.9.5', publisher: 'agent-grid/agent-grid-releases on GitHub', checked: '2026-10-10' },
		{ id: 'agentgrid-changelog', title: 'Changelog', url: 'https://agentgrid.sh/docs/changelog', publisher: 'AgentGrid', checked: '2026-10-10' },
		{ id: 'agentgrid-updates', title: 'Updates', url: 'https://agentgrid.sh/docs/troubleshooting/updates', publisher: 'AgentGrid', checked: '2026-10-10' },
		{ id: 'agentgrid-harness-setup', title: 'Coding harness setup', url: 'https://agentgrid.sh/docs/getting-started/cli-prerequisites', publisher: 'AgentGrid', checked: '2026-10-10' },
		{ id: 'agentgrid-harnesses', title: 'Coding harnesses', url: 'https://agentgrid.sh/guides/claude-codex-antigravity', publisher: 'AgentGrid', checked: '2026-10-10' },
		{ id: 'agentgrid-switch-harness', title: 'Switch harnesses mid-session without losing your place', url: 'https://agentgrid.sh/stories/switch-harness-mid-session', publisher: 'AgentGrid', checked: '2026-10-10' },
		{ id: 'agentgrid-multiple-accounts', title: 'Multiple accounts per harness', url: 'https://agentgrid.sh/guides/multiple-accounts', publisher: 'AgentGrid', checked: '2026-10-10' },
		{ id: 'agentgrid-roles', title: 'Roles', url: 'https://agentgrid.sh/docs/reference/roles', publisher: 'AgentGrid', checked: '2026-10-10' },
		{ id: 'agentgrid-langfuse', title: 'Set up Langfuse', url: 'https://agentgrid.sh/guides/observability-langfuse', publisher: 'AgentGrid', checked: '2026-10-10' },
		{ id: 'agentgrid-hermes', title: 'Connect Hermes to AgentGrid and Discord', url: 'https://agentgrid.sh/guides/hermes-agent-discord', publisher: 'AgentGrid', checked: '2026-10-10' },
		{ id: 'agentgrid-orchestrating', title: 'Orchestrating agents', url: 'https://agentgrid.sh/guides/orchestrating-agents', publisher: 'AgentGrid', checked: '2026-10-10' },
		{ id: 'agentgrid-agents-workers', title: 'Agents and workers', url: 'https://agentgrid.sh/docs/concepts/agents-and-workers', publisher: 'AgentGrid', checked: '2026-10-10' },
		{ id: 'agentgrid-spaces', title: 'Spaces and project folders', url: 'https://agentgrid.sh/docs/concepts/spaces-and-project-folders', publisher: 'AgentGrid', checked: '2026-10-10' },
		{ id: 'agentgrid-build-review', title: 'Build with Claude. Review with Codex.', url: 'https://agentgrid.sh/workflows/build-and-review', publisher: 'AgentGrid', checked: '2026-10-10' },
		{ id: 'agentgrid-panes', title: 'Panes', url: 'https://agentgrid.sh/docs/concepts/panes', publisher: 'AgentGrid', checked: '2026-10-10' },
		{ id: 'agentgrid-canvas', title: 'The Canvas', url: 'https://agentgrid.sh/docs/concepts/canvas', publisher: 'AgentGrid', checked: '2026-10-10' },
		{ id: 'agentgrid-browsers', title: 'Browsers', url: 'https://agentgrid.sh/guides/browsers', publisher: 'AgentGrid', checked: '2026-10-10' },
		{ id: 'agentgrid-daemon', title: 'System tray and daemon', url: 'https://agentgrid.sh/docs/concepts/system-tray-and-daemon', publisher: 'AgentGrid', checked: '2026-10-10' },
		{ id: 'agentgrid-shared-projects', title: 'Shared projects', url: 'https://agentgrid.sh/guides/shared-projects', publisher: 'AgentGrid', checked: '2026-10-10' },
		{ id: 'agentgrid-mobile', title: 'Mobile app', url: 'https://agentgrid.sh/guides/mobile-app', publisher: 'AgentGrid', checked: '2026-10-10' },
		{ id: 'agentgrid-spawn-menu', title: 'Spawn menu', url: 'https://agentgrid.sh/docs/reference/spawn-menu', publisher: 'AgentGrid', checked: '2026-10-10' },
		{ id: 'agentgrid-canvas-filtering', title: 'Canvas filtering', url: 'https://agentgrid.sh/guides/canvas-filtering', publisher: 'AgentGrid', checked: '2026-10-10' }
	]
};
