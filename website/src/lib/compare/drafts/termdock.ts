// Splash vs Termdock. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

const repo = 'https://github.com/termdock/termdock-issues';

export const TERMDOCK: Comparison = {
	slug: 'termdock',
	name: 'Termdock',
	description: 'How Splash and Termdock compare on agents, terminals, platforms, automation, review and remote use, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Termdock are both free desktop apps for working with several coding agents. Termdock is a terminal: each agent runs its own command-line interface in a terminal tab, and agents can open terminals and pass work to each other. Splash drives every agent over the Agent Client Protocol and shows each session as a transcript.',
	other: {
		name: 'Termdock',
		url: 'https://www.termdock.com/en',
		maker: 'Termdock',
		summary: 'A desktop terminal for coding agents on macOS and Windows. It runs each agent’s CLI as a managed session, lets agents open terminals and hand off work, and pairs machines on your LAN.',
		cite: ['termdock-home', 'termdock-getting-started', 'termdock-readme']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop terminal built for coding agents; phones and browsers on your network can open its terminals, with the desktop as host', cite: ['termdock-home', 'termdock-readme', 'termdock-features'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v1.22.0 (4 October 2026) on GitHub, which the changelog still marks as pending public release; 1.0.0 came out in August 2025', cite: ['termdock-v1-22-0', 'termdock-progress', 'termdock-changelog'] } },
				{ label: 'License', splash: S.license, other: { text: 'Closed source, with no published license; the code lives in a private repository, and the public one hosts releases and issues', cite: ['termdock-readme'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free; no paid tier or subscription is published', cite: ['termdock-home', 'termdock-compare'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon and Intel) and Windows; Linux is listed as coming soon', cite: ['termdock-installation', 'termdock-readme', 'termdock-v1-22-0'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Electron (version 41 since v1.7.0), with Rust for code parsing and PTY writes, an xterm WebGL terminal and Monaco', cite: ['termdock-changelog', 'termdock-v1-7-0'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Managed sessions for Claude Code, Codex, GitLab Duo, OpenCode and Antigravity (agy, replacing Gemini CLI); other CLIs run in terminals', cite: ['termdock-getting-started', 'termdock-compare', 'termdock-terminal-api'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each agent’s own interactive CLI in a PTY terminal, with provider-aware tracking; OpenCode through its daemon over HTTP and SSE', cite: ['termdock-integrations', 'termdock-v1-8-0', 'termdock-v1-20-0', 'termdock-terminal-api', 'termdock-changelog'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Uses the agent CLIs and logins you already have, with no model proxy; optional AI commit messages use your own keys', cite: ['termdock-home', 'termdock-privacy', 'termdock-readme'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'None; the privacy policy says Termdock runs no servers. Discord or Telegram control needs a bot you create', cite: ['termdock-home', 'termdock-privacy', 'termdock-remote-control'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Workstream cards to approve, deny or answer requests from Claude Code, Codex and Gemini once termdock hooks are installed', mark: 'partial', cite: ['termdock-readme', 'termdock-integrations', 'termdock-cli'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Offers its own code-graph MCP server (read-only, built from source) with symbol search, callers and impact analysis', mark: 'partial', cite: ['termdock-integrations', 'termdock-compare'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'No git worktree per task; a workspace groups one project’s terminals and file views and is worktree-aware', mark: 'no', cite: ['termdock-compare', 'termdock-getting-started', 'termdock-changelog'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Workspace setup scripts aren’t documented; terminal tabs show listening ports, and scheduled terminals take a startup command', mark: 'partial', cite: ['termdock-features', 'termdock-automation'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'The core of the app: WebGL-rendered tabs and split panes, restored after restarts, with a dock for background terminals', mark: 'yes', cite: ['termdock-readme', 'termdock-changelog'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'A Workstream panel gathers agents’ questions, permission requests and plan reviews; a macOS Dock badge counts unread sessions', mark: 'yes', cite: ['termdock-readme', 'termdock-changelog'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'Terminal attention alerts (OSC 99/777), plus agent notifications through your own Discord or Telegram bot, off by default', mark: 'yes', cite: ['termdock-changelog', 'termdock-remote-control', 'termdock-compare'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'With the termdock CLI or API, an agent starts another agent in a new terminal, follows its output and sends it work', mark: 'yes', cite: ['termdock-home', 'termdock-cli', 'termdock-terminal-api'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Cron or one-off schedules start a terminal with a prompt, and workflows chain prompts; schedules run while the app is open', mark: 'yes', cite: ['termdock-home', 'termdock-automation'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'Since 1.22, a browser panel shows web pages and local HTML files next to terminals or in split panes', mark: 'yes', cite: ['termdock-features'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Side-by-side diffs, blame, branch graphs and read-only conflict review; diff comments or feedback to an agent aren’t documented', mark: 'yes', cite: ['termdock-features'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'No pull request, issue or CI features are documented; GitHub ties cover OAuth sign-in, release notes and filing bug reports', mark: 'no', cite: ['termdock-changelog', 'termdock-v1-19-0'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Pairs Termdocks on your LAN with end-to-end encryption and terminal takeover; SSH hosts with tmux join as a Beta', mark: 'yes', cite: ['termdock-home', 'termdock-remote-workspaces', 'termdock-compare'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'No app; a phone browser on the same network views and types into existing terminals over HTTP', mark: 'no', cite: ['termdock-home', 'termdock-browser-access'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'The Agent Session API finds and attaches to existing provider sessions; an early Claude history browser is absent from current docs', mark: 'partial', cite: ['termdock-terminal-api', 'termdock-1-4-1', 'termdock-1-4-4'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Recall searches saved decisions, lessons and conventions across sessions in the AI Memory Library, not the transcripts themselves', mark: 'no', cite: ['termdock-memory'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Termdock runs each agent’s own interactive CLI in a PTY terminal and tracks Claude Code, Codex, Antigravity, GitLab Duo and OpenCode as managed sessions, OpenCode through its daemon over HTTP and SSE. Its docs mention neither ACP nor an SDK. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, natively or through an adapter, and renders a transcript.',
			cite: ['termdock-integrations', 'termdock-v1-8-0', 'termdock-changelog', 'termdock-compare', 'termdock-terminal-api', 'splash-readme', 'splash-registry', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'Everything runs on machines you own: Termdock desktops on one LAN pair with end-to-end encryption and can take over each other’s terminals, SSH hosts with tmux join in Beta, and phones open terminals in a browser over HTTP. Splash runs agents on your computer, or under <code>splash-server</code> on a machine you reach through an SSH tunnel.',
			cite: ['termdock-home', 'termdock-remote-workspaces', 'termdock-browser-access', 'splash-readme', 'splash-server']
		},
		{
			title: 'Agents driving agents',
			text: 'Termdock lets agents work the terminal themselves: through the <code>termdock</code> CLI and a local Terminal API, one agent can open a terminal, start another, follow its output and send it work, while schedules and workflows send prompts unattended. In Splash each session is one agent in one folder, started when you create, continue or prompt it.',
			cite: ['termdock-home', 'termdock-cli', 'termdock-terminal-api', 'termdock-automation', 'splash-readme', 'splash-features', 'splash-how']
		},
		{
			title: 'Tools around the agent',
			text: 'Termdock adds a code graph of definitions, callers and dependencies, an AI Memory Library searched with Recall, a usage dashboard with estimated costs for Claude Code and Codex, and masking of recognized secrets in terminal output. Splash centers on the conversation: a Needs attention queue, a review screen for changed files, a git worktree per session and transcript search.',
			cite: ['termdock-home', 'termdock-memory', 'termdock-features', 'splash-features']
		},
		{
			title: 'License, platforms and price',
			text: 'Both are free and need no account. Termdock is closed source with no published license, and ships for macOS and Windows, with Linux listed as coming soon. Splash is MIT-licensed and builds for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64, plus a headless server.',
			cite: ['termdock-home', 'termdock-readme', 'termdock-installation', 'splash-license', 'splash-download', 'splash-build', 'splash-install', 'splash-server']
		}
	],
	fit: {
		splash: [
			'You want every agent driven over the Agent Client Protocol and shown as one rendered transcript.',
			'You want each session in its own git worktree, with a review screen that sends feedback to the agent.',
			'You want a GitHub view of issues, pull requests and Actions runs, plus search across saved transcripts.',
			'You want an MIT-licensed app that also runs on Ubuntu, or as a server you reach over SSH.'
		],
		other: [
			'You want a terminal-first app where each agent runs its own CLI in tabs and split panes.',
			'You want agents that open terminals, start other agents and pass work along through a CLI and a local API.',
			'You want scheduled prompts and chained workflows that run while the desktop app is open.',
			'You want to pair desktops on your LAN, take over their terminals and check in from a phone browser.'
		]
	},
	sources: [
		{ id: 'termdock-home', title: 'Termdock – The Terminal Your AI Agents Drive', url: 'https://www.termdock.com/en', publisher: 'Termdock', checked: '2026-10-10' },
		{ id: 'termdock-compare', title: 'Compare Agent Terminals', url: 'https://www.termdock.com/en/compare', publisher: 'Termdock', checked: '2026-10-10' },
		{ id: 'termdock-progress', title: 'Development Progress', url: 'https://www.termdock.com/en/progress', publisher: 'Termdock', checked: '2026-10-10' },
		{ id: 'termdock-privacy', title: 'Privacy Policy', url: 'https://www.termdock.com/en/privacy', publisher: 'Termdock', checked: '2026-10-10' },
		{ id: 'termdock-getting-started', title: 'Getting Started', url: 'https://www.termdock.com/docs/getting-started', publisher: 'Termdock', checked: '2026-10-10' },
		{ id: 'termdock-installation', title: 'Installation', url: 'https://www.termdock.com/docs/installation', publisher: 'Termdock', checked: '2026-10-10' },
		{ id: 'termdock-features', title: 'Features', url: 'https://www.termdock.com/docs/features', publisher: 'Termdock', checked: '2026-10-10' },
		{ id: 'termdock-integrations', title: 'Integrations', url: 'https://www.termdock.com/docs/integrations', publisher: 'Termdock', checked: '2026-10-10' },
		{ id: 'termdock-terminal-api', title: 'Terminal API', url: 'https://www.termdock.com/docs/terminal-api', publisher: 'Termdock', checked: '2026-10-10' },
		{ id: 'termdock-cli', title: 'CLI Guide', url: 'https://www.termdock.com/docs/cli', publisher: 'Termdock', checked: '2026-10-10' },
		{ id: 'termdock-automation', title: 'Automation', url: 'https://www.termdock.com/docs/automation', publisher: 'Termdock', checked: '2026-10-10' },
		{ id: 'termdock-remote-workspaces', title: 'Remote Workspaces', url: 'https://www.termdock.com/docs/remote-workspaces', publisher: 'Termdock', checked: '2026-10-10' },
		{ id: 'termdock-browser-access', title: 'Phone and Browser Access', url: 'https://www.termdock.com/docs/browser-access', publisher: 'Termdock', checked: '2026-10-10' },
		{ id: 'termdock-remote-control', title: 'Discord and Telegram Remote Control', url: 'https://www.termdock.com/docs/remote-control', publisher: 'Termdock', checked: '2026-10-10' },
		{ id: 'termdock-memory', title: 'AI Memory Library', url: 'https://www.termdock.com/docs/memory', publisher: 'Termdock', checked: '2026-10-10' },
		{ id: 'termdock-changelog', title: 'Changelog', url: 'https://www.termdock.com/docs/changelog', publisher: 'Termdock', checked: '2026-10-10' },
		{ id: 'termdock-readme', title: 'termdock-issues README', url: repo, publisher: 'termdock/termdock-issues on GitHub', checked: '2026-10-10' },
		{ id: 'termdock-v1-22-0', title: 'TermDock v1.22.0', url: `${repo}/releases/tag/v1.22.0`, publisher: 'termdock/termdock-issues on GitHub', checked: '2026-10-10' },
		{ id: 'termdock-v1-20-0', title: 'TermDock v1.20.0', url: `${repo}/releases/tag/v1.20.0`, publisher: 'termdock/termdock-issues on GitHub', checked: '2026-10-10' },
		{ id: 'termdock-v1-19-0', title: 'TermDock v1.19.0', url: `${repo}/releases/tag/v1.19.0`, publisher: 'termdock/termdock-issues on GitHub', checked: '2026-10-10' },
		{ id: 'termdock-v1-8-0', title: 'TermDock v1.8.0', url: `${repo}/releases/tag/v1.8.0`, publisher: 'termdock/termdock-issues on GitHub', checked: '2026-10-10' },
		{ id: 'termdock-v1-7-0', title: 'TermDock v1.7.0', url: `${repo}/releases/tag/v1.7.0`, publisher: 'termdock/termdock-issues on GitHub', checked: '2026-10-10' },
		{ id: 'termdock-1-4-4', title: 'TermDock 1.4.4', url: `${repo}/releases/tag/1.4.4`, publisher: 'termdock/termdock-issues on GitHub', checked: '2026-10-10' },
		{ id: 'termdock-1-4-1', title: 'TermDock 1.4.1', url: `${repo}/releases/tag/1.4.1`, publisher: 'termdock/termdock-issues on GitHub', checked: '2026-10-10' }
	]
};
