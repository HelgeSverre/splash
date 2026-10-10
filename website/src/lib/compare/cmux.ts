// Splash vs cmux. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const CMUX: Comparison = {
	slug: 'cmux',
	name: 'cmux',
	description: 'How Splash and cmux compare on agents, platforms, pricing, isolation, review and remote use, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and cmux are both desktop apps for running several coding agents at once. cmux, a native macOS terminal that embeds Ghostty, runs each agent’s own command-line interface in a pane. Splash, for macOS, Windows and Ubuntu, drives agents over the Agent Client Protocol and shows each session as a transcript.',
	other: {
		name: 'cmux',
		url: 'https://cmux.com',
		maker: 'Manaflow',
		summary: 'A native macOS terminal that embeds Ghostty, adding vertical tabs, splits, a scriptable browser and notification rings for coding agents, which run as their own CLIs. Paid plans add cloud VMs and an iOS app.',
		cite: ['cmux-readme', 'cmux-home', 'cmux-pricing']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Native macOS terminal app for coding agents; Manaflow also ships a cross-platform cmux TUI and a Linux nightly of cmux Browser', cite: ['cmux-readme', 'cmux-home', 'cmux-tui', 'cmux-browser'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v0.65.0 (5 October 2026), plus nightlies. The iOS app, tmux mirroring and Conversations sidebar are beta', cite: ['cmux-changelog', 'cmux-readme', 'cmux-ios-docs', 'cmux-remote-tmux'] } },
				{ label: 'License', splash: S.license, other: { text: 'GPL-3.0-or-later for the app, CLI and TUI; BUSL-1.1 for server code. The site’s EULA and terms forbid modifying the app', cite: ['cmux-license', 'cmux-gpl', 'cmux-eula', 'cmux-terms'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free for local use; Pro $50 a month ($480 a year), Max $200 a month, Team $60 per user a month, Enterprise custom', cite: ['cmux-pricing'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'Desktop app: macOS 14+ on Apple silicon or Intel. Beta app for iPhone and iPad. cmux TUI: macOS, Linux and Windows', cite: ['cmux-getting-started', 'cmux-ios-docs', 'cmux-ios', 'cmux-tui'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Swift and AppKit with libghostty for terminal rendering, not Electron; cmux TUI is written in Rust', cite: ['cmux-readme', 'cmux-home', 'cmux-tui'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Any terminal agent CLI; cmux.com has pages for about 35, including Claude Code, Codex, Gemini CLI, OpenCode and Cursor CLI', cite: ['cmux-home', 'cmux-agents'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each agent’s CLI in a Ghostty pane, tracked via escape sequences, hooks and wrappers; an Agent Chat MVP uses ACP for some', cite: ['cmux-concepts', 'cmux-readme', 'cmux-claude-wrapper', 'cmux-session-restore', 'cmux-agent-chat'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Local agents use your own CLI logins and API keys at no charge from cmux; optional CodeRouter pools a team’s subscriptions', cite: ['cmux-pricing', 'cmux-coderouter'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'Not for the terminal; Cloud, iOS pairing and CodeRouter need a cmux account (Apple, Google, GitHub or emailed-code sign-in)', cite: ['cmux-llms', 'cmux-cloud', 'cmux-ios-docs', 'cmux-coderouter', 'cmux-privacy'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'A beta Feed, off by default, shows requests from agent hooks such as Claude Code’s, with Allow Once and Deny buttons', mark: 'partial', cite: ['cmux-changelog', 'cmux-session-restore'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'No built-in worktree manager, by design; a documented custom command creates a worktree and starts agents in it', mark: 'partial', cite: ['cmux-blog-home', 'cmux-custom-commands'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'cmux.json sets a setup command, per-terminal commands and env vars; the Dock runs dev servers, and the sidebar lists ports', mark: 'yes', cite: ['cmux-custom-commands', 'cmux-dock', 'cmux-changelog', 'cmux-readme'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'The core of the app: GPU-accelerated Ghostty terminals with splits and tabs that read your existing Ghostty config', mark: 'yes', cite: ['cmux-readme'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Pane rings, sidebar unread badges and agent status, a notification panel and macOS notifications; ⌘⇧U jumps to the newest unread', mark: 'yes', cite: ['cmux-home', 'cmux-readme', 'cmux-changelog'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'A browser split beside the terminal that agents script: DOM snapshots, clicks, JavaScript, console and network; it imports cookies from other browsers', mark: 'yes', cite: ['cmux-home', 'cmux-readme'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Claude Code teammates, Codex subagents and oh-my-* orchestrator workers open as native cmux splits through a tmux shim', mark: 'partial', cite: ['cmux-claude-teams', 'cmux-changelog', 'cmux-oh-my-codex'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'cmux diff opens a diff viewer; line comments, saved per repo, can go to an agent through a terminal TextBox', mark: 'yes', cite: ['cmux-changelog', 'cmux-keyboard-shortcuts'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'The sidebar shows each workspace’s git branch and linked PR status and number; cmux pr sets or clears the link', mark: 'partial', cite: ['cmux-readme', 'cmux-changelog'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'Persistent Ubuntu microVMs on paid plans, opened as cmux workspaces with Claude Code, Codex, OpenCode and Pi installed; docs say early access, 0.65.0 notes say open to all', mark: 'partial', cite: ['cmux-cloud', 'cmux-cloud-machines', 'cmux-cloud-security', 'cmux-cloud-workspaces', 'cmux-changelog'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'Remote workspaces through cmux ssh, beta tmux mirroring, and stopped Claude Code sessions that move between the Mac and an SSH host', mark: 'yes', cite: ['cmux-ssh', 'cmux-remote-tmux', 'cmux-changelog'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'Beta iPhone and iPad app on TestFlight, on paid plans: it mirrors Mac terminals and forwards agent notifications', mark: 'partial', cite: ['cmux-ios-docs', 'cmux-ios', 'cmux-pricing'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Updates itself through Sparkle; an MDM policy lets admins turn this off', mark: 'yes', cite: ['cmux-getting-started', 'cmux-mdm'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', splash: S.history, other: { text: 'Vault indexes on-disk sessions from Codex, Claude Code, OpenCode, Pi and others; drag one into a workspace to resume it', mark: 'yes', cite: ['cmux-vault', 'cmux-changelog'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Vault searches agent transcripts; the opt-in beta Conversations sidebar adds live sessions and history from several providers, with provider filters', mark: 'yes', cite: ['cmux-vault', 'cmux-changelog'] } },
				{ label: 'Fork a conversation', splash: S.fork, other: { text: 'Fork Conversation copies a session, with its history and folder, into another split, tab or workspace; Vault also forks from checkpoints', mark: 'yes', cite: ['cmux-fork', 'cmux-changelog'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'cmux is a terminal: each agent runs its own CLI in a Ghostty pane, and cmux follows it through OSC 9/99/777 escape sequences, hooks that call <code>cmux notify</code> and wrapper scripts. An Agent Chat MVP in the repository uses ACP for some agents. Splash speaks the <strong>Agent Client Protocol</strong> with every agent and draws the conversation itself.',
			cite: ['cmux-concepts', 'cmux-readme', 'cmux-claude-wrapper', 'cmux-agent-chat', 'splash-readme', 'splash-registry', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'The cmux app needs macOS 14 or later. Agents run in its local terminals, on SSH hosts through <code>cmux ssh</code>, or, on paid plans, in <strong>cmux Cloud</strong> microVMs; a beta iOS app mirrors the Mac’s terminals. Splash runs on macOS, Windows and Ubuntu, or as <code>splash-server</code> on a machine you reach in a browser through an SSH tunnel.',
			cite: ['cmux-getting-started', 'cmux-ssh', 'cmux-cloud', 'cmux-cloud-security', 'cmux-ios-docs', 'splash-install', 'splash-server']
		},
		{
			title: 'Price, accounts and license',
			text: 'The cmux repository is GPL-3.0-or-later, with server code under BUSL-1.1, while the EULA and terms on cmux.com, dated before the March 2026 switch to GPL, forbid modifying the app. Local use is free and needs no account; Cloud, iOS pairing and CodeRouter need one, and Pro costs $50 a month or $480 a year. Splash is free, MIT-licensed and has no accounts.',
			cite: ['cmux-license', 'cmux-gpl', 'cmux-eula', 'cmux-terms', 'cmux-llms', 'cmux-cloud', 'cmux-ios-docs', 'cmux-coderouter', 'cmux-pricing', 'splash-license', 'splash-download', 'splash-build']
		},
		{
			title: 'What each is built around',
			text: 'cmux calls itself a primitive: terminals, a browser, notifications, splits, and a CLI and socket API to script them, leaving worktrees and checkouts to your scripts and agents. It adds Vault, a diff viewer and a computer-use MCP server. Splash manages the sessions: an optional worktree each, a rendered transcript, a Needs attention queue and a GitHub view.',
			cite: ['cmux-readme', 'cmux-home', 'cmux-blog-home', 'cmux-vault', 'cmux-changelog', 'cmux-computer-use', 'splash-features', 'splash-github']
		}
	],
	fit: {
		splash: [
			'You want the same app on Windows and Ubuntu as well as macOS, or on your own server through a browser.',
			'You want the app to create a git worktree on its own branch for each session.',
			'You want every agent’s conversation drawn as a transcript over the Agent Client Protocol, with permission requests answered in one queue.',
			'You want a free, MIT-licensed app with no accounts and a GitHub view of issues, pull requests and Actions runs.'
		],
		other: [
			'You want each agent’s own terminal interface in a native macOS terminal, with any CLI agent.',
			'You want to script workspaces, splits and a built-in browser from a CLI and socket API.',
			'You want setup commands, env vars and dev servers defined in project config files.',
			'You want agents on SSH hosts or managed cloud VMs, plus an iPhone and iPad app that mirrors your Mac’s terminals.'
		]
	},
	sources: [
		{ id: 'cmux-home', title: 'cmux - The terminal built for multitasking', url: 'https://cmux.com/', publisher: 'Manaflow', checked: '2026-10-10' },
		{ id: 'cmux-readme', title: 'README.md', url: 'https://github.com/manaflow-ai/cmux/blob/main/README.md', publisher: 'manaflow-ai/cmux on GitHub', checked: '2026-10-10' },
		{ id: 'cmux-license', title: 'LICENSE', url: 'https://github.com/manaflow-ai/cmux/blob/main/LICENSE', publisher: 'manaflow-ai/cmux on GitHub', checked: '2026-10-10' },
		{ id: 'cmux-claude-wrapper', title: 'Resources/bin/cmux-claude-wrapper', url: 'https://github.com/manaflow-ai/cmux/blob/main/Resources/bin/cmux-claude-wrapper', publisher: 'manaflow-ai/cmux on GitHub', checked: '2026-10-10' },
		{ id: 'cmux-agent-chat', title: 'agent-chat/README.md', url: 'https://github.com/manaflow-ai/cmux/blob/main/agent-chat/README.md', publisher: 'manaflow-ai/cmux on GitHub', checked: '2026-10-10' },
		{ id: 'cmux-pricing', title: 'Pricing', url: 'https://cmux.com/pricing', publisher: 'Manaflow', checked: '2026-10-10' },
		{ id: 'cmux-llms', title: 'llms.txt (documentation index)', url: 'https://cmux.com/llms.txt', publisher: 'Manaflow', checked: '2026-10-10' },
		{ id: 'cmux-gpl', title: 'cmux is now GPL', url: 'https://cmux.com/blog/gpl', publisher: 'Manaflow', checked: '2026-10-10' },
		{ id: 'cmux-eula', title: 'EULA', url: 'https://cmux.com/eula', publisher: 'Manaflow', checked: '2026-10-10' },
		{ id: 'cmux-terms', title: 'Terms of Service', url: 'https://cmux.com/terms-of-service', publisher: 'Manaflow', checked: '2026-10-10' },
		{ id: 'cmux-privacy', title: 'Privacy Policy', url: 'https://cmux.com/privacy-policy', publisher: 'Manaflow', checked: '2026-10-10' },
		{ id: 'cmux-getting-started', title: 'Getting Started', url: 'https://cmux.com/docs/getting-started', publisher: 'Manaflow', checked: '2026-10-10' },
		{ id: 'cmux-concepts', title: 'Concepts', url: 'https://cmux.com/docs/concepts', publisher: 'Manaflow', checked: '2026-10-10' },
		{ id: 'cmux-tui', title: 'cmux TUI documentation', url: 'https://cmux.com/docs/tui', publisher: 'Manaflow', checked: '2026-10-10' },
		{ id: 'cmux-browser', title: 'cmux Browser Nightly', url: 'https://cmux.com/browser', publisher: 'Manaflow', checked: '2026-10-10' },
		{ id: 'cmux-agents', title: 'A terminal for coding agents', url: 'https://cmux.com/agents', publisher: 'Manaflow', checked: '2026-10-10' },
		{ id: 'cmux-changelog', title: 'Changelog', url: 'https://cmux.com/docs/changelog', publisher: 'Manaflow', checked: '2026-10-10' },
		{ id: 'cmux-session-restore', title: 'Session Restore', url: 'https://cmux.com/docs/session-restore', publisher: 'Manaflow', checked: '2026-10-10' },
		{ id: 'cmux-coderouter', title: 'CodeRouter model routing', url: 'https://cmux.com/docs/coderouter', publisher: 'Manaflow', checked: '2026-10-10' },
		{ id: 'cmux-custom-commands', title: 'Custom Commands and Actions', url: 'https://cmux.com/docs/custom-commands', publisher: 'Manaflow', checked: '2026-10-10' },
		{ id: 'cmux-dock', title: 'Dock', url: 'https://cmux.com/docs/dock', publisher: 'Manaflow', checked: '2026-10-10' },
		{ id: 'cmux-keyboard-shortcuts', title: 'Keyboard Shortcuts', url: 'https://cmux.com/docs/keyboard-shortcuts', publisher: 'Manaflow', checked: '2026-10-10' },
		{ id: 'cmux-claude-teams', title: 'Claude Code Teams', url: 'https://cmux.com/docs/agent-integrations/claude-code-teams', publisher: 'Manaflow', checked: '2026-10-10' },
		{ id: 'cmux-oh-my-codex', title: 'oh-my-codex', url: 'https://cmux.com/docs/agent-integrations/oh-my-codex', publisher: 'Manaflow', checked: '2026-10-10' },
		{ id: 'cmux-blog-home', title: 'cmux home', url: 'https://cmux.com/blog/cmux-home', publisher: 'Manaflow', checked: '2026-10-10' },
		{ id: 'cmux-fork', title: 'Introducing cmux Fork', url: 'https://cmux.com/blog/cmux-fork', publisher: 'Manaflow', checked: '2026-10-10' },
		{ id: 'cmux-vault', title: 'Vault', url: 'https://cmux.com/docs/vault', publisher: 'Manaflow', checked: '2026-10-10' },
		{ id: 'cmux-cloud', title: 'cmux Cloud', url: 'https://cmux.com/docs/cloud', publisher: 'Manaflow', checked: '2026-10-10' },
		{ id: 'cmux-cloud-machines', title: 'Cloud Machines', url: 'https://cmux.com/docs/cloud/machines', publisher: 'Manaflow', checked: '2026-10-10' },
		{ id: 'cmux-cloud-workspaces', title: 'Cloud Workspaces and Agents', url: 'https://cmux.com/docs/cloud/workspaces', publisher: 'Manaflow', checked: '2026-10-10' },
		{ id: 'cmux-cloud-security', title: 'cmux Cloud security', url: 'https://cmux.com/docs/cloud-security', publisher: 'Manaflow', checked: '2026-10-10' },
		{ id: 'cmux-ssh', title: 'SSH', url: 'https://cmux.com/docs/ssh', publisher: 'Manaflow', checked: '2026-10-10' },
		{ id: 'cmux-remote-tmux', title: 'Mirror Remote tmux Sessions over SSH (Beta)', url: 'https://cmux.com/docs/remote-tmux', publisher: 'Manaflow', checked: '2026-10-10' },
		{ id: 'cmux-ios-docs', title: 'iOS App', url: 'https://cmux.com/docs/ios', publisher: 'Manaflow', checked: '2026-10-10' },
		{ id: 'cmux-ios', title: 'cmux iOS', url: 'https://cmux.com/ios', publisher: 'Manaflow', checked: '2026-10-10' },
		{ id: 'cmux-computer-use', title: 'Computer Use setup and agent tools', url: 'https://cmux.com/docs/computer-use', publisher: 'Manaflow', checked: '2026-10-10' },
		{ id: 'cmux-mdm', title: 'Managed device policies (MDM)', url: 'https://cmux.com/docs/managed-policies', publisher: 'Manaflow', checked: '2026-10-10' }
	]
};
