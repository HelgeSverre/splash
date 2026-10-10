// Splash vs Pane. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const PANE: Comparison = {
	slug: 'pane',
	name: 'Pane',
	description: 'How Splash and Pane (RunPane) compare on agents, platforms, licensing, worktrees, review and remote use, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Pane (RunPane) are free, open-source desktop apps for running several coding agents at once, and both can give each its own git worktree. Pane, an Electron app, runs each agent’s own command-line interface in a terminal; Splash, a Rust app, drives agents over the Agent Client Protocol and shows their work as a conversation.',
	other: {
		name: 'Pane',
		url: 'https://runpane.com',
		maker: 'Greenfield',
		summary: 'A free, AGPL-licensed desktop app for running coding agents side by side, each pane a git worktree with its own terminals. Made by Greenfield, formerly Dcouple; a self-hosted daemon adds browser and phone access.',
		cite: ['pane-about', 'pane-home', 'pane-worktrees', 'pane-remote-daemon']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Keyboard-first desktop agent manager, not an IDE; a self-hosted Remote Pane daemon adds browser and phone clients', cite: ['pane-about', 'pane-llms-full', 'pane-remote-daemon'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v2.4.178, after 11 releases dated 6 to 9 October 2026; v1.0.0 came out in February 2026', cite: ['pane-release', 'pane-changelog'] } },
				{ label: 'License', splash: S.license, other: { text: 'AGPL-3.0 plus two terms: copies keep a visible Dcouple Inc credit, and forks may not promote themselves with its name or logo', cite: ['pane-license', 'pane-troubleshooting'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free, with no paid plan; you pay model providers yourself. The maker plans optional paid services such as managed cloud worktrees', cite: ['pane-pricing-md', 'pane-pricing'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'Windows x64 and ARM64, macOS (Apple silicon and Intel), Linux x64 and ARM64 (AppImage, .deb); runs natively on Windows and opens WSL repos', cite: ['pane-download', 'pane-wsl'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code, Codex, Cursor Agent (in WSL repos on Windows) and OpenCode built in; any other terminal CLI runs as a custom command', cite: ['pane-troubleshooting', 'pane-wsl', 'pane-custom-agents'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each agent’s own CLI in a real terminal (PTY), with no SDK; its docs don’t mention ACP', cite: ['pane-readme', 'pane-panels', 'pane-pty-host'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Each agent’s own login or API key, such as a Claude Pro or Max or a ChatGPT plan; Pane doesn’t proxy model requests', cite: ['pane-providers', 'pane-claude-code', 'pane-codex', 'pane-security'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'No Pane account; linking your own machines uses a Tailscale login, and PR status needs the gh CLI signed in', cite: ['pane-troubleshooting', 'pane-remote-daemon', 'pane-llms-full'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Built-in buttons start agents with approvals skipped; a custom command keeps them. Remote Pane shows requests on all connected clients', mark: 'partial', cite: ['pane-security', 'pane-remote-daemon', 'pane-troubleshooting'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Registers its own pane MCP server with Claude Code, Codex and Cursor; agents load your MCP servers from their own config', mark: 'yes', cite: ['pane-mcp'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A git worktree on its own branch per pane, shared by its tabs; worktrees can be turned off, and there’s no sandbox', mark: 'yes', cite: ['pane-worktrees', 'pane-troubleshooting', 'pane-security'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Setup, run and archive scripts in pane.json (conductor.json is read too), 10 reserved ports per pane, and .env files copied in', mark: 'yes', cite: ['pane-configuration', 'pane-env'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'Split terminal and agent tabs per pane with 2,500 lines of saved scrollback and inline images; SSH config hosts open as ssh tabs', mark: 'yes', cite: ['pane-panels', 'pane-ssh-hosts'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'A webview tab inside the app to preview what you’re running; after a push, Pane can open the PR page there', mark: 'yes', cite: ['pane-panels', 'pane-fly'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Status dots on agent tabs for waiting, working, finished and idle, summed up per pane and project in the sidebar', mark: 'yes', cite: ['pane-fly', 'pane-worktrees'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'In Sessions, one agent starts a pane per feature, watches workers and collects reports; runpane handoff sends a pushed branch to another machine', mark: 'yes', cite: ['pane-sessions', 'pane-chat', 'pane-readme'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Per-file diff tabs, split or unified, over a commit range; you type fixes to the agent, and line comments aren’t documented', mark: 'yes', cite: ['pane-review', 'pane-panels'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'File tree and a Monaco editor tab with auto-save, plus Markdown, Mermaid, notebook, image and PDF previews; meant for quick edits', mark: 'yes', cite: ['pane-panels'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Commits, pushes and merges to main in the app; PRs are opened on GitHub, GitLab or elsewhere, or by an agent with gh', mark: 'no', cite: ['pane-git', 'pane-review', 'pane-mcp'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Through the gh CLI: PR status badges on panes, and Sessions check open PRs about every 3 minutes for conflicts, checks and merges', mark: 'yes', cite: ['pane-mcp', 'pane-sessions'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'No built-in Linear, Jira or GitHub Issues integration; agents use trackers through their own MCP servers or CLIs', mark: 'no', cite: ['pane-mcp', 'pane-agents-md'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'A self-hosted Remote Pane daemon on your VM or server, reached over Tailscale, an SSH tunnel or HTTPS; Pane provides no cloud machines', mark: 'yes', cite: ['pane-remote-daemon', 'pane-llms-full', 'pane-cloud-vm'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'A browser app at runpane.com/app, installable as a PWA; its pages call the native phone app coming soon or in early access', mark: 'partial', cite: ['pane-home', 'pane-llms-full', 'pane-remote-daemon'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Resumes an outside agent session by its ID and adopts existing worktrees with runpane panes adopt; there’s no one-click import', mark: 'partial', cite: ['pane-importing'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Not documented; Pane Chat can answer what you worked on from Pane state, git, PRs and local Claude or Codex transcripts', mark: 'unknown', cite: ['pane-chat'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Pane starts each agent’s own command-line interface in a real terminal, from built-in buttons for Claude Code, Codex, Cursor Agent and OpenCode or as a custom command for any other CLI; its README says it uses no SDK, and its docs don’t mention ACP. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, natively or through an adapter.',
			cite: ['pane-readme', 'pane-troubleshooting', 'pane-custom-agents', 'splash-registry', 'acp']
		},
		{
			title: 'Permissions and boundaries',
			text: 'Pane’s built-in buttons launch agents in their skip-the-prompts modes, such as <code>claude --dangerously-skip-permissions</code> and <code>codex --yolo</code>; to keep an agent’s own prompts you add it as a custom command. Pane doesn’t sandbox agents, and a worktree is a soft boundary. Splash shows the permission requests an agent sends in the transcript and keeps pending ones in <strong>Needs attention</strong>.',
			cite: ['pane-security', 'pane-claude-code', 'pane-codex', 'splash-features']
		},
		{
			title: 'Where agents run',
			text: 'Pane runs on Windows, macOS and Linux, including ARM64 builds for Windows and Linux. A self-hosted <strong>Remote Pane</strong> daemon runs agents on your VM or server, reached from a desktop, browser or phone over Tailscale, an SSH tunnel or HTTPS; Pane provides no cloud machines. Splash runs on macOS, Windows and Ubuntu, or as <code>splash-server</code> behind an SSH tunnel.',
			cite: ['pane-download', 'pane-remote-daemon', 'pane-llms-full', 'pane-cloud-vm', 'splash-install', 'splash-server']
		},
		{
			title: 'License and price',
			text: 'Both are free. Pane is licensed under AGPL-3.0 with added terms that require visible Dcouple Inc attribution, and its maker plans optional paid services such as managed cloud worktrees; it needs no Pane account. Splash is MIT-licensed and has no accounts.',
			cite: ['pane-license', 'pane-troubleshooting', 'pane-pricing-md', 'pane-pricing', 'splash-license', 'splash-download', 'splash-build']
		},
		{
			title: 'Around the agent',
			text: 'Each pane comes with setup and run scripts on reserved ports, a Monaco editor tab, an in-app webview, local commit and merge actions and, for Claude Code and Codex, cost tracking; Sessions orchestrate other agents through the <code>runpane</code> CLI and MCP tools. Splash centers on the conversation: a Needs attention queue, transcript search, imported agent history and a GitHub view.',
			cite: ['pane-configuration', 'pane-env', 'pane-panels', 'pane-git', 'pane-usage', 'pane-sessions', 'pane-mcp', 'splash-features', 'splash-history', 'splash-github']
		}
	],
	fit: {
		splash: [
			'You want every agent driven over the Agent Client Protocol and shown as one transcript of messages, tool calls and diffs.',
			'You want permission requests answered in the app and gathered in one Needs attention queue.',
			'You want to import conversations agents started elsewhere and search saved transcripts across sessions.',
			'You want an MIT-licensed app with a GitHub view of issues, pull requests and Actions runs across repositories.'
		],
		other: [
			'You want each agent’s own terminal interface, with any CLI agent added as a custom command.',
			'You want setup and run scripts, reserved ports, an editor tab and a preview browser in each worktree.',
			'You want an orchestrating agent that starts other agents, watches them and collects their reports.',
			'You want ARM64 builds for Windows and Linux, or a self-hosted daemon you reach from a browser or phone.'
		]
	},
	sources: [
		{ id: 'pane-home', title: 'RunPane: Open-Source Agent Manager', url: 'https://runpane.com/', publisher: 'Greenfield', checked: '2026-10-10' },
		{ id: 'pane-about', title: 'About RunPane', url: 'https://runpane.com/about', publisher: 'Greenfield', checked: '2026-10-10' },
		{ id: 'pane-llms-full', title: 'RunPane complete reference (llms-full.txt)', url: 'https://runpane.com/llms-full.txt', publisher: 'Greenfield', checked: '2026-10-10' },
		{ id: 'pane-worktrees', title: 'Panes & Worktrees', url: 'https://runpane.com/docs/panes-and-worktrees', publisher: 'Greenfield', checked: '2026-10-10' },
		{ id: 'pane-remote-daemon', title: 'Remote VM Setup', url: 'https://runpane.com/docs/remote-daemon', publisher: 'Greenfield', checked: '2026-10-10' },
		{ id: 'pane-release', title: 'Release v2.4.178', url: 'https://github.com/greenfield-inc/Pane/releases/tag/v2.4.178', publisher: 'greenfield-inc/Pane on GitHub', checked: '2026-10-10' },
		{ id: 'pane-changelog', title: 'Changelog', url: 'https://runpane.com/changelog', publisher: 'Greenfield', checked: '2026-10-10' },
		{ id: 'pane-license', title: 'LICENSE', url: 'https://github.com/greenfield-inc/Pane/blob/main/LICENSE', publisher: 'greenfield-inc/Pane on GitHub', checked: '2026-10-10' },
		{ id: 'pane-troubleshooting', title: 'Troubleshooting & FAQ', url: 'https://runpane.com/docs/troubleshooting', publisher: 'Greenfield', checked: '2026-10-10' },
		{ id: 'pane-pricing-md', title: 'RunPane pricing (pricing.md)', url: 'https://runpane.com/pricing.md', publisher: 'Greenfield', checked: '2026-10-10' },
		{ id: 'pane-pricing', title: 'Pricing', url: 'https://runpane.com/pricing', publisher: 'Greenfield', checked: '2026-10-10' },
		{ id: 'pane-download', title: 'Download', url: 'https://runpane.com/docs/download', publisher: 'Greenfield', checked: '2026-10-10' },
		{ id: 'pane-wsl', title: 'Windows and WSL', url: 'https://runpane.com/docs/windows-and-wsl', publisher: 'Greenfield', checked: '2026-10-10' },
		{ id: 'pane-custom-agents', title: 'Custom Agents', url: 'https://runpane.com/docs/custom-agents', publisher: 'Greenfield', checked: '2026-10-10' },
		{ id: 'pane-readme', title: 'README.md', url: 'https://github.com/greenfield-inc/Pane/blob/main/README.md', publisher: 'greenfield-inc/Pane on GitHub', checked: '2026-10-10' },
		{ id: 'pane-panels', title: 'Tabs', url: 'https://runpane.com/docs/panels', publisher: 'Greenfield', checked: '2026-10-10' },
		{ id: 'pane-pty-host', title: 'main/src/ptyHost/ptyHostMain.ts', url: 'https://github.com/greenfield-inc/Pane/blob/main/main/src/ptyHost/ptyHostMain.ts', publisher: 'greenfield-inc/Pane on GitHub', checked: '2026-10-10' },
		{ id: 'pane-providers', title: 'AI providers', url: 'https://runpane.com/docs/providers', publisher: 'Greenfield', checked: '2026-10-10' },
		{ id: 'pane-claude-code', title: 'Claude Code (quick start)', url: 'https://runpane.com/docs/quick-starts/claude-code', publisher: 'Greenfield', checked: '2026-10-10' },
		{ id: 'pane-codex', title: 'Codex (quick start)', url: 'https://runpane.com/docs/quick-starts/codex', publisher: 'Greenfield', checked: '2026-10-10' },
		{ id: 'pane-security', title: 'Security & permissions', url: 'https://runpane.com/docs/security', publisher: 'Greenfield', checked: '2026-10-10' },
		{ id: 'pane-mcp', title: 'Pane MCP server and your MCP servers', url: 'https://runpane.com/docs/mcp', publisher: 'Greenfield', checked: '2026-10-10' },
		{ id: 'pane-configuration', title: 'Configuration', url: 'https://runpane.com/docs/configuration', publisher: 'Greenfield', checked: '2026-10-10' },
		{ id: 'pane-env', title: 'Environment variables', url: 'https://runpane.com/docs/environment-variables', publisher: 'Greenfield', checked: '2026-10-10' },
		{ id: 'pane-ssh-hosts', title: 'SSH Hosts', url: 'https://runpane.com/docs/ssh-hosts', publisher: 'Greenfield', checked: '2026-10-10' },
		{ id: 'pane-fly', title: 'Fly with Pane', url: 'https://runpane.com/docs/fly-with-pane', publisher: 'Greenfield', checked: '2026-10-10' },
		{ id: 'pane-sessions', title: 'Sessions', url: 'https://runpane.com/docs/sessions', publisher: 'Greenfield', checked: '2026-10-10' },
		{ id: 'pane-chat', title: 'Pane Chat', url: 'https://runpane.com/docs/pane-chat', publisher: 'Greenfield', checked: '2026-10-10' },
		{ id: 'pane-review', title: 'Review & Commit', url: 'https://runpane.com/docs/review-and-commit', publisher: 'Greenfield', checked: '2026-10-10' },
		{ id: 'pane-git', title: 'Git Workflow', url: 'https://runpane.com/docs/git', publisher: 'Greenfield', checked: '2026-10-10' },
		{ id: 'pane-agents-md', title: 'RunPane agent instructions (agents.md)', url: 'https://runpane.com/agents.md', publisher: 'Greenfield', checked: '2026-10-10' },
		{ id: 'pane-cloud-vm', title: 'Run Pane on a Cloud VM', url: 'https://runpane.com/docs/cloud-workspaces', publisher: 'Greenfield', checked: '2026-10-10' },
		{ id: 'pane-importing', title: 'Switching from another tool', url: 'https://runpane.com/docs/importing', publisher: 'Greenfield', checked: '2026-10-10' },
		{ id: 'pane-usage', title: 'Usage & Limits', url: 'https://runpane.com/docs/usage', publisher: 'Greenfield', checked: '2026-10-10' }
	]
};
