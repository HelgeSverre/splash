// Splash vs Jean. Facts checked 2026-10-09 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const JEAN: Comparison = {
	slug: 'jean',
	name: 'Jean',
	description: 'How Splash and Jean compare on agents, platforms, pricing, worktrees, remote servers and review, with a source for every fact.',
	checked: '2026-10-09',
	intro: 'Splash and Jean are open-source apps that run several coding agents at once, each able to work in its own git worktree. Jean is a desktop app and headless Linux server that drives each agent through the interface its CLI offers. Splash is a desktop app and single-user server that drives every agent over the Agent Client Protocol.',
	other: {
		name: 'Jean',
		url: 'https://jean.build',
		maker: 'coolLabs',
		summary: 'An open-source AI agent workspace that gives each task its own git worktree, with chats, terminals and integrations for GitHub, Linear and Sentry. It runs as a desktop app, a headless Linux server, or both.',
		cite: ['jean-home', 'jean-readme', 'jean-license']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app, plus jean-server, a headless Linux binary whose full UI opens in a browser', cite: ['jean-readme', 'jean-web-access'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v1.0.9, released 7 October 2026; v1.0.0 came out on 21 September, and some agents and features are labeled beta', cite: ['jean-release', 'jean-changelog', 'jean-readme', 'jean-backends'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (Apache 2.0)', cite: ['jean-license'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free, with no paid tiers, feature gates or usage limits; sponsoring is optional', cite: ['jean-faq'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 10.15+ (universal), Windows x64, Linux x64 and ARM64; the maker tests on macOS. jean-server: Linux amd64/arm64 or Docker', cite: ['jean-release', 'jean-tauri-conf', 'jean-faq', 'jean-web-access'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Tauri v2 with a Rust backend and a React 19, TypeScript and Tailwind frontend', cite: ['jean-readme'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Nine in the README: Claude Code, Codex, OpenCode, Cursor Agent, Pi, Command Code, Grok, Kimi Code and Antigravity; the website lists eight', cite: ['jean-readme', 'jean-backends'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each CLI’s own mode: Claude Code’s stream-json print mode, Codex app-server, OpenCode’s HTTP server; ACP over stdio for Grok and Kimi Code', cite: ['jean-claude-rs', 'jean-codex-rs', 'jean-opencode-rs', 'jean-backends', 'jean-grok-rs', 'jean-kimi-rs'] } },
				{ label: 'Agent sign-in', hint: 'Installing agents and logging them in', splash: S.signIn, other: { text: 'Uses your CLI logins, subscriptions or API keys, with no Jean account; it can install and update managed copies of supported CLIs', cite: ['jean-readme', 'jean-faq', 'jean-security', 'jean-settings'] } },
				{ label: 'Permission requests', splash: S.permissions, other: { text: 'A policy per session, from Supervised to Full access (the default); Cursor, Pi, Command Code and Antigravity run with Full access', mark: 'partial', cite: ['jean-permissions'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Finds servers in installed backends’ config files, which you enable at global, project or session level; its own Jean MCP server lets agents drive Jean', mark: 'yes', cite: ['jean-backends', 'jean-architecture'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A git worktree per task, on its own branch, holding one or more chats; a base session uses the main checkout', mark: 'yes', cite: ['jean-home', 'jean-first-project', 'jean-how-it-works'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'A jean.json file sets setup and teardown scripts, terminal run commands and named dev-server ports', mark: 'yes', cite: ['jean-first-project'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'A terminal beside the chat or in a drawer that floats or docks to an edge; a session can also run the agent’s own CLI full screen', mark: 'yes', cite: ['jean-canvas', 'jean-readme', 'jean-architecture'] } },
				{
					label: 'Built-in browser',
					hint: 'A browser inside the app',
					splash: S.browser,
					other: { text: 'An embedded browser in the desktop app; Browser Context Grab sends a page element, with DOM and React hints, to the chat', mark: 'yes', cite: ['jean-browser-grab', 'jean-readme'] }
				},
				{ label: 'What needs you', splash: S.attention, other: { text: 'The canvas shows each session as waiting, planning, running or review-ready; unopened finished sessions collect in an unread popover', mark: 'yes', cite: ['jean-canvas', 'jean-archive'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'Optional notification sounds; the desktop app also shows OS notifications when a session you aren’t viewing needs approval or input', mark: 'yes', cite: ['jean-settings', 'jean-notifications'] } },
				{
					label: 'Issue sweeps',
					hint: 'Agents picking up issues on a schedule',
					splash: S.scheduler,
					other: { text: 'Mr. Robot (beta) checks open GitHub issues on a schedule, plans each in its own worktree, and can run approved plans', mark: 'partial', cite: ['jean-github-linear', 'jean-readme'] }
				}
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Unified or side-by-side diffs with line comments for the agent; a Review command runs an AI or CodeRabbit review', mark: 'yes', cite: ['jean-readme', 'jean-magic-commands', 'jean-coderabbit'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'A file browser with previews and in-app editing; a workspace can also open in Zed, VS Code, Cursor, Xcode or another external editor', mark: 'yes', cite: ['jean-readme', 'jean-settings'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Magic commands commit, push, create or update a PR, merge, and resolve conflicts with AI, using the GitHub CLI', mark: 'yes', cite: ['jean-magic-commands', 'jean-install'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Starts work from issues, PRs, workflow runs and security alerts; tracks PR, review and CI state; checks out PRs as worktrees', mark: 'yes', cite: ['jean-github-linear', 'jean-readme', 'jean-pr-status'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'GitHub, Linear with a personal API key, and Sentry once configured; Jira and GitLab issues aren’t documented', mark: 'yes', cite: ['jean-github-linear', 'jean-install'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{
					label: 'Mobile app',
					hint: 'Phones and tablets',
					splash: S.mobile,
					other: { text: 'No native app; the full UI opens in phone and tablet browsers through Web Access, with mobile layouts', mark: 'partial', cite: ['jean-web-access', 'jean-changelog'] }
				},
				{ label: 'Remote access', splash: S.remote, other: { text: 'Not hosted; the desktop app adds jean-server hosts or installs one over SSH; any instance can serve a token-protected browser UI', mark: 'yes', cite: ['jean-what-is', 'jean-readme', 'jean-web-access'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'The desktop app checks GitHub Releases after launch and installs updates in the app; jean-server installs one after you confirm, with a SHA-256 check', mark: 'yes', cite: ['jean-archive', 'jean-tauri-conf', 'jean-web-access'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', splash: S.history, other: { text: 'Developer docs describe importing Claude and Codex sessions from disk as terminal sessions that resume in the CLI', mark: 'partial', cite: ['jean-architecture'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Cmd/Ctrl+F within a conversation; Magic → Load Context can find saved sessions by their message text', mark: 'yes', cite: ['jean-canvas', 'jean-changelog'] } }
			]
		}
	],
	differences: [
		{
			title: 'How each connects to agents',
			text: 'Jean drives each CLI through the interface that CLI offers: Claude Code in <code>--print</code> mode with stream-json, <code>codex app-server</code> over JSON-RPC, <code>opencode serve</code> over HTTP, and the Agent Client Protocol for Grok and Kimi Code. Splash speaks ACP over stdio to every agent it launches, natively or through a pinned adapter around the vendor’s CLI.',
			cite: ['jean-claude-rs', 'jean-codex-rs', 'jean-opencode-rs', 'jean-backends', 'jean-grok-rs', 'jean-kimi-rs', 'splash-registry', 'splash-how', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'Jean’s desktop app shows projects from <code>jean-server</code> hosts beside local ones. On Unix, its source code starts most backends, including Claude, Codex, Grok and Kimi Code, as detached processes, so a turn can continue after Jean quits. Splash runs agents as child processes and stops them when it quits; <code>splash-server</code> is a separate single-user server, opened through an SSH tunnel, where agents keep running when the browser closes.',
			cite: ['jean-readme', 'jean-detached-rs', 'jean-codex-server-rs', 'jean-grok-rs', 'jean-kimi-rs', 'splash-readme', 'splash-how', 'splash-server']
		},
		{
			title: 'Workflow around the agents',
			text: 'Jean builds automation around its worktrees: <code>jean.json</code> setup and teardown scripts, Magic commands that commit, push, open and merge pull requests, Mr. Robot (beta) issue sweeps, and Jean MCP, a built-in server agents use to drive Jean. Splash centers on a Needs attention queue, a Review panel listing every changed file, and GitHub and Actions views across repositories.',
			cite: ['jean-first-project', 'jean-magic-commands', 'jean-github-linear', 'jean-architecture', 'splash-features', 'splash-github']
		},
		{
			title: 'Platforms and testing',
			text: 'Jean ships desktop builds for macOS 10.15 and later, Windows x64, and Linux x64 and ARM64, plus a Linux server binary and Docker image. Its makers test on macOS; Windows is not fully tested and Linux is community tested. Splash ships desktop builds for macOS 14 and later, Windows 11 x64 and Ubuntu 24.04 x64, plus a headless server archive for each, and runs native CI on all three.',
			cite: ['jean-release', 'jean-tauri-conf', 'jean-web-access', 'jean-faq', 'jean-readme', 'splash-install', 'splash-readme']
		}
	],
	fit: {
		splash: [
			'You use agents such as Gemini, Copilot or Goose, which Splash drives over the Agent Client Protocol.',
			'You want permission requests, failures and finished turns from every session in one queue that persists across restarts.',
			'You triage GitHub issues, pull requests and Actions runs across many repositories next to your sessions.',
			'You want to find conversations agents expose over ACP, import them, and search their saved transcript text.'
		],
		other: [
			'You want setup and teardown scripts, run commands and dev-server ports defined once in jean.json for every worktree.',
			'You want the app to commit, push, open and merge pull requests, and to start work from Linear or Sentry issues.',
			'You want agents on your own Linux server or Docker host, reachable from the desktop app or a phone browser.',
			'You want open GitHub issues swept on a schedule, with a plan drafted for each in its own worktree (Mr. Robot, in beta).'
		]
	},
	sources: [
		{ id: 'jean-home', title: 'Jean', url: 'https://jean.build/', publisher: 'coolLabs Solutions Kft.', checked: '2026-10-09' },
		{ id: 'jean-faq', title: 'Jean: FAQ', url: 'https://jean.build/#faq', publisher: 'coolLabs Solutions Kft.', checked: '2026-10-09' },
		{ id: 'jean-changelog', title: 'Changelog', url: 'https://jean.build/changelog', publisher: 'coolLabs Solutions Kft.', checked: '2026-10-09' },
		{ id: 'jean-readme', title: 'Jean README', url: 'https://github.com/coollabsio/jean', publisher: 'coollabsio/jean on GitHub', checked: '2026-10-09' },
		{ id: 'jean-license', title: 'LICENSE.md', url: 'https://github.com/coollabsio/jean/blob/main/LICENSE.md', publisher: 'coollabsio/jean on GitHub', checked: '2026-10-09' },
		{ id: 'jean-release', title: 'Release v1.0.9', url: 'https://github.com/coollabsio/jean/releases/tag/v1.0.9', publisher: 'coollabsio/jean on GitHub', checked: '2026-10-09' },
		{ id: 'jean-tauri-conf', title: 'src-tauri/tauri.conf.json', url: 'https://github.com/coollabsio/jean/blob/main/src-tauri/tauri.conf.json', publisher: 'coollabsio/jean on GitHub', checked: '2026-10-09' },
		{ id: 'jean-what-is', title: 'What is Jean', url: 'https://jean.build/docs/about/what-is-jean', publisher: 'coolLabs Solutions Kft.', checked: '2026-10-09' },
		{ id: 'jean-how-it-works', title: 'How Jean Works', url: 'https://jean.build/docs/about/how-jean-works', publisher: 'coolLabs Solutions Kft.', checked: '2026-10-09' },
		{ id: 'jean-security', title: 'Local-First and Security', url: 'https://jean.build/docs/about/local-first-and-security', publisher: 'coolLabs Solutions Kft.', checked: '2026-10-09' },
		{ id: 'jean-install', title: 'Install and Setup', url: 'https://jean.build/docs/getting-started/installation', publisher: 'coolLabs Solutions Kft.', checked: '2026-10-09' },
		{ id: 'jean-first-project', title: 'Add Your First Project', url: 'https://jean.build/docs/getting-started/add-your-first-project', publisher: 'coolLabs Solutions Kft.', checked: '2026-10-09' },
		{ id: 'jean-backends', title: 'Backends, Models, and MCP', url: 'https://jean.build/docs/core-concepts/backends-models-and-mcp', publisher: 'coolLabs Solutions Kft.', checked: '2026-10-09' },
		{ id: 'jean-canvas', title: 'Project Canvas and Chat', url: 'https://jean.build/docs/workflows/project-canvas-and-chat', publisher: 'coolLabs Solutions Kft.', checked: '2026-10-09' },
		{ id: 'jean-magic-commands', title: 'Magic Commands', url: 'https://jean.build/docs/workflows/magic-commands', publisher: 'coolLabs Solutions Kft.', checked: '2026-10-09' },
		{ id: 'jean-github-linear', title: 'GitHub, Linear, and Reviews', url: 'https://jean.build/docs/workflows/github-linear-and-reviews', publisher: 'coolLabs Solutions Kft.', checked: '2026-10-09' },
		{ id: 'jean-browser-grab', title: 'Browser Context Grab', url: 'https://jean.build/docs/workflows/browser-context-grab', publisher: 'coolLabs Solutions Kft.', checked: '2026-10-09' },
		{ id: 'jean-settings', title: 'Settings and Customization', url: 'https://jean.build/docs/manage/preferences-and-customization', publisher: 'coolLabs Solutions Kft.', checked: '2026-10-09' },
		{ id: 'jean-archive', title: 'Archive, Recovery, Updates', url: 'https://jean.build/docs/manage/archive-recovery-and-updates', publisher: 'coolLabs Solutions Kft.', checked: '2026-10-09' },
		{ id: 'jean-web-access', title: 'Web Access and Headless', url: 'https://jean.build/docs/manage/web-access-and-headless', publisher: 'coolLabs Solutions Kft.', checked: '2026-10-09' },
		{ id: 'jean-architecture', title: 'Architecture guide', url: 'https://github.com/coollabsio/jean/blob/main/docs/developer/architecture-guide.md', publisher: 'coollabsio/jean on GitHub', checked: '2026-10-09' },
		{ id: 'jean-permissions', title: 'Workflow and permission policies', url: 'https://github.com/coollabsio/jean/blob/main/docs/developer/permissions.md', publisher: 'coollabsio/jean on GitHub', checked: '2026-10-09' },
		{ id: 'jean-coderabbit', title: 'CodeRabbit CLI Integration', url: 'https://github.com/coollabsio/jean/blob/main/docs/developer/coderabbit-cli.md', publisher: 'coollabsio/jean on GitHub', checked: '2026-10-09' },
		{ id: 'jean-claude-rs', title: 'jean-core/src/chat/claude.rs', url: 'https://github.com/coollabsio/jean/blob/main/jean-core/src/chat/claude.rs', publisher: 'coollabsio/jean on GitHub', checked: '2026-10-09' },
		{ id: 'jean-codex-rs', title: 'jean-core/src/chat/codex.rs', url: 'https://github.com/coollabsio/jean/blob/main/jean-core/src/chat/codex.rs', publisher: 'coollabsio/jean on GitHub', checked: '2026-10-09' },
		{ id: 'jean-opencode-rs', title: 'jean-core/src/chat/opencode.rs', url: 'https://github.com/coollabsio/jean/blob/main/jean-core/src/chat/opencode.rs', publisher: 'coollabsio/jean on GitHub', checked: '2026-10-09' },
		{ id: 'jean-codex-server-rs', title: 'jean-core/src/chat/codex_server.rs', url: 'https://github.com/coollabsio/jean/blob/main/jean-core/src/chat/codex_server.rs', publisher: 'coollabsio/jean on GitHub', checked: '2026-10-09' },
		{ id: 'jean-grok-rs', title: 'jean-core/src/chat/grok.rs', url: 'https://github.com/coollabsio/jean/blob/main/jean-core/src/chat/grok.rs', publisher: 'coollabsio/jean on GitHub', checked: '2026-10-09' },
		{ id: 'jean-kimi-rs', title: 'jean-core/src/chat/kimi.rs', url: 'https://github.com/coollabsio/jean/blob/main/jean-core/src/chat/kimi.rs', publisher: 'coollabsio/jean on GitHub', checked: '2026-10-09' },
		{ id: 'jean-detached-rs', title: 'jean-core/src/chat/detached.rs', url: 'https://github.com/coollabsio/jean/blob/main/jean-core/src/chat/detached.rs', publisher: 'coollabsio/jean on GitHub', checked: '2026-10-09' },
		{ id: 'jean-pr-status', title: 'src/types/pr-status.ts', url: 'https://github.com/coollabsio/jean/blob/main/src/types/pr-status.ts', publisher: 'coollabsio/jean on GitHub', checked: '2026-10-09' },
		{ id: 'jean-notifications', title: 'src/lib/session-notifications.ts', url: 'https://github.com/coollabsio/jean/blob/main/src/lib/session-notifications.ts', publisher: 'coollabsio/jean on GitHub', checked: '2026-10-09' }
	]
};
