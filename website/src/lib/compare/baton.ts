// Splash vs Baton. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const BATON: Comparison = {
	slug: 'baton',
	name: 'Baton',
	description: 'How Splash and Baton compare on agents, platforms, pricing, worktrees, review and remote use, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Baton are both desktop apps for running several coding agents at once, with git worktrees to keep their work apart. Baton runs each agent’s own command-line interface in a terminal pane and adds diffs, an editor and git tools. Splash drives agents over the Agent Client Protocol and shows each session as a transcript.',
	other: {
		name: 'Baton',
		url: 'https://getbaton.dev',
		maker: 'Tafjord Invest',
		summary: 'A desktop app that runs several terminal coding agents side by side in separate git worktrees, with status badges, diffs, an editor and one-click pull requests. Free with up to four workspaces running at once.',
		cite: ['baton-home', 'baton-llms', 'baton-buy']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app that runs terminal coding agents side by side in git worktrees, with diffs, an editor and git tools', cite: ['baton-llms', 'baton-home'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v3.4.1, released 8 July 2026; the Windows and Linux builds are labelled Beta', cite: ['baton-update-manifest', 'baton-download'] } },
				{ label: 'License', splash: S.license, other: { text: 'Proprietary; the terms grant a non-transferable license to use it and forbid reverse-engineering or decompiling it', cite: ['baton-terms'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free for 4 workspaces at once, every feature included; unlimited costs $19 a month, $79 a year or $99 lifetime', cite: ['baton-buy'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon and Intel); Windows and Linux (AppImage) for x64 and ARM64, labelled Beta. Git must be installed', cite: ['baton-download', 'baton-llms', 'baton-home'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Any terminal CLI; hooks for Claude Code, Codex CLI, Gemini CLI and OpenCode, and presets for Cursor CLI, Amp and others', cite: ['baton-home', 'baton-remote-workspaces'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each agent’s own CLI in a Baton terminal, keeping its flags, config and login; status comes from hooks Baton installs or from OSC notification sequences', cite: ['baton-conductor-guide', 'baton-remote-workspaces', 'baton-update-manifest'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Agents use their own logins and APIs; Baton’s AI for workspace names and commit messages is free for now', cite: ['baton-home', 'baton-conductor-guide', 'baton-terms'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'No account; paid plans activate with a license key that Baton’s server checks', cite: ['baton-buy', 'baton-privacy'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Handled by each agent’s own CLI, which keeps its native behavior; Baton flags pending prompts from Codex and OpenCode, and presets set permission modes', mark: 'yes', cite: ['baton-conductor-guide', 'baton-update-manifest', 'baton-opencode', 'baton-claude-code'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Agents keep their own MCP config; Baton adds a local MCP server for spawning workspaces, tabs and previews, with per-tool switches', mark: 'yes', cite: ['baton-conductor-guide', 'baton-home', 'baton-update-manifest'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Each workspace gets its own git worktree and branch, or shares the folder of a non-git project; optional Lima VM or Safehouse sandboxes', mark: 'yes', cite: ['baton-home', 'baton-cli', 'baton-sandboxing'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Setup steps for each project copy files such as .env, install dependencies and run commands; cleanup scripts run on archive. No port allocation is documented', mark: 'yes', cite: ['baton-home', 'baton-llms', 'baton-update-manifest'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'WebGL xterm.js terminals in tabs and split panes, several per workspace, with output search and drag-and-drop reordering', mark: 'yes', cite: ['baton-llms', 'baton-home'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Card, sidebar and macOS dock badges, a dashboard and optional sounds show agents running, waiting, finished or errored; states vary by agent', mark: 'yes', cite: ['baton-agents', 'baton-home', 'baton-llms', 'baton-update-manifest', 'baton-codex-cli'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'A preview panel beside the agent loads the dev server, taking its URL from terminal output and reloading on file changes', mark: 'yes', cite: ['baton-home'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Agents start other agents in new Baton workspaces or tabs through its MCP server or the baton CLI', mark: 'yes', cite: ['baton-home', 'baton-cli', 'baton-update-manifest'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Monaco diffs, split or unified, that follow the agent live; edit, roll back files or compare branches. Line comments aren’t documented', mark: 'yes', cite: ['baton-agents', 'baton-home', 'baton-conductor-guide'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'A changed-file tree, a Monaco editor for edits, git blame, file and commit history, and fzf and ripgrep search', mark: 'yes', cite: ['baton-home', 'baton-llms'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Opens a pull request on GitHub or GitLab in one click; fetch, pull, rebase, push and merge in the app', mark: 'yes', cite: ['baton-home', 'baton-update-manifest'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Pull requests open on GitHub; CI checks, review state and issues aren’t documented', mark: 'partial', cite: ['baton-home'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'SSH workspaces put agents, terminals, git and worktrees on your own Linux or macOS host; the UI stays local. No hosted cloud', mark: 'yes', cite: ['baton-remote-workspaces', 'baton-llms'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'No native app; the home page marks remote control from a phone or tablet as coming soon, while the privacy policy describes it and a pairing page is live', mark: 'partial', cite: ['baton-home', 'baton-privacy', 'baton-remote'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Updates itself, fetching new versions in the background with differential downloads', mark: 'yes', cite: ['baton-update-manifest'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented; each agent preset has a configurable continue command for resuming through the agent’s own CLI', mark: 'unknown', cite: ['baton-llms'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Not documented; workspace search finds old or active workspaces, and fzf and ripgrep search files', mark: 'unknown', cite: ['baton-cmux-guide', 'baton-home'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Baton runs each agent’s own CLI in a terminal, keeping its flags, config and login, and tracks its status through hooks it installs for Claude Code, Codex CLI, Gemini CLI and OpenCode, or through OSC notification sequences. Baton’s pages don’t mention ACP. Splash speaks the <strong>Agent Client Protocol</strong> with every agent and draws each session as a transcript.',
			cite: ['baton-conductor-guide', 'baton-remote-workspaces', 'baton-update-manifest', 'splash-readme', 'splash-registry', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'Baton runs agents on your computer, optionally inside a managed Lima VM (macOS and Linux), a Safehouse sandbox (macOS) or your own wrapper such as Docker, or on SSH hosts you configure; there is no hosted cloud. Splash runs agents on your computer, or under <code>splash-server</code> on the machine with your code, opened in a browser over SSH.',
			cite: ['baton-sandboxing', 'baton-remote-workspaces', 'baton-llms', 'splash-readme', 'splash-server']
		},
		{
			title: 'Price, license and accounts',
			text: 'Baton is proprietary and needs no account. The free tier includes every feature and runs four workspaces at a time, a limit its terms say may change; paying $19 a month, $79 a year or $99 once (an early-access price) lifts the cap. Splash is free, MIT-licensed and has no accounts.',
			cite: ['baton-terms', 'baton-buy', 'splash-license', 'splash-download', 'splash-build']
		},
		{
			title: 'Tools around the agent',
			text: 'Baton surrounds the terminal with setup scripts, a dev server preview, a Monaco editor with blame and history, GitHub or GitLab pull requests, linked workspaces across repositories, offline voice dictation, and an MCP server and CLI for agents to launch agents. Splash centers on the conversation: a Needs attention queue, a review panel, transcript search and session import.',
			cite: ['baton-home', 'baton-update-manifest', 'baton-cli', 'splash-features', 'splash-history']
		},
		{
			title: 'Platforms and updates',
			text: 'Baton ships for macOS, with Windows and Linux builds for x64 and ARM64 labelled Beta, and updates itself in the background. Splash builds for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64 plus a headless server, and is updated by downloading a new release from GitHub.',
			cite: ['baton-download', 'baton-llms', 'baton-update-manifest', 'splash-install', 'splash-about']
		}
	],
	fit: {
		splash: [
			'You want a free, MIT-licensed app with no account, or a server you run on the machine that holds your code.',
			'You want every agent driven over the Agent Client Protocol, with permission requests answered in the transcript.',
			'You want to import conversations agents started outside the app and search saved transcripts.',
			'You want a GitHub triage view of issues, pull requests and Actions runs across repositories.'
		],
		other: [
			'You want each agent’s own terminal interface, and to add any CLI agent with a custom command.',
			'You want setup scripts, a dev server preview and a Monaco editor for each worktree.',
			'You want to rebase, push and open GitHub or GitLab pull requests from the app.',
			'You want agents to run in a local VM or sandbox, or on your own SSH hosts, from an app that updates itself.'
		]
	},
	sources: [
		{ id: 'baton-home', title: 'Baton — Run AI Coding Agents in Parallel', url: 'https://getbaton.dev/', publisher: 'Tafjord Invest', checked: '2026-10-10' },
		{ id: 'baton-llms', title: 'llms.txt', url: 'https://getbaton.dev/llms.txt', publisher: 'Tafjord Invest', checked: '2026-10-10' },
		{ id: 'baton-buy', title: 'Buy Baton — Run & Monitor Unlimited AI Coding Agents', url: 'https://getbaton.dev/buy', publisher: 'Tafjord Invest', checked: '2026-10-10' },
		{ id: 'baton-download', title: 'Download Baton — Free AI Coding Agent Manager for Mac, Windows, Linux', url: 'https://getbaton.dev/download', publisher: 'Tafjord Invest', checked: '2026-10-10' },
		{ id: 'baton-terms', title: 'Terms of Service', url: 'https://getbaton.dev/terms', publisher: 'Tafjord Invest', checked: '2026-10-10' },
		{ id: 'baton-privacy', title: 'Privacy Policy', url: 'https://getbaton.dev/privacy', publisher: 'Tafjord Invest', checked: '2026-10-10' },
		{ id: 'baton-update-manifest', title: 'latest-mac.yml (update manifest with release notes)', url: 'https://downloads.getbaton.dev/latest/latest-mac.yml', publisher: 'Tafjord Invest', checked: '2026-10-10' },
		{ id: 'baton-agents', title: 'Run Multiple CLI Agent Sessions in Parallel', url: 'https://getbaton.dev/agents', publisher: 'Tafjord Invest', checked: '2026-10-10' },
		{ id: 'baton-claude-code', title: 'Claude Code Multiple Sessions in Parallel', url: 'https://getbaton.dev/agents/claude-code', publisher: 'Tafjord Invest', checked: '2026-10-10' },
		{ id: 'baton-codex-cli', title: 'Codex CLI Multiple Sessions in Parallel', url: 'https://getbaton.dev/agents/codex-cli', publisher: 'Tafjord Invest', checked: '2026-10-10' },
		{ id: 'baton-opencode', title: 'OpenCode Parallel Sessions and Multiple Sessions', url: 'https://getbaton.dev/agents/opencode', publisher: 'Tafjord Invest', checked: '2026-10-10' },
		{ id: 'baton-cli', title: 'Baton CLI — Control Baton from your agent', url: 'https://getbaton.dev/baton-cli', publisher: 'Tafjord Invest', checked: '2026-10-10' },
		{ id: 'baton-sandboxing', title: 'Sandboxing AI Coding Agents', url: 'https://getbaton.dev/sandboxing', publisher: 'Tafjord Invest', checked: '2026-10-10' },
		{ id: 'baton-remote-workspaces', title: 'Run AI Coding Agents on Remote Machines over SSH', url: 'https://getbaton.dev/remote-workspaces', publisher: 'Tafjord Invest', checked: '2026-10-10' },
		{ id: 'baton-remote', title: 'Baton remote pairing client', url: 'https://remote.getbaton.dev/', publisher: 'Tafjord Invest', checked: '2026-10-10' },
		{ id: 'baton-conductor-guide', title: 'Conductor vs Baton for AI Coding Agents', url: 'https://getbaton.dev/guides/conductor-vs-baton', publisher: 'Tafjord Invest', checked: '2026-10-10' },
		{ id: 'baton-cmux-guide', title: 'cmux vs Baton for AI Coding Agents', url: 'https://getbaton.dev/guides/cmux-vs-baton', publisher: 'Tafjord Invest', checked: '2026-10-10' }
	]
};
