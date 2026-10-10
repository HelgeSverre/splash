// Splash vs bb. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const BB: Comparison = {
	slug: 'bb',
	name: 'bb',
	description: 'How Splash and bb compare on agents, platforms, pricing, worktrees, review and remote use, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and bb are both free, MIT-licensed apps that run several coding agents at once, each in the project folder or a git worktree. bb is a server with desktop, web, CLI and phone clients and a plugin system, and can spread threads across machines; Splash is a desktop app, plus a headless server you open in a browser, that drives every agent over the Agent Client Protocol.',
	other: {
		name: 'bb',
		url: 'https://getbb.app',
		maker: 'Michael Yong',
		summary: 'An open-source agent IDE built around a server you run: it runs Claude Code, Codex, Pi and ACP agents in checkouts or git worktrees, from desktop, web, CLI or phone, extended by plugins.',
		cite: ['bb-repo', 'bb-license', 'bb-system-overview', 'bb-switch-claude', 'bb-worktrees', 'bb-platform-support']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Agent IDE driven from an Electron desktop app, a web app served by its server, a CLI or an HTTP API', cite: ['bb-repo', 'bb-desktop-package', 'bb-system-overview'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: '0.46.0 (9 October 2026), plus nightly builds; in active development, with alpha Linux, Windows and Android builds and an iOS beta', cite: ['bb-release', 'bb-changelog', 'bb-repo', 'bb-platform-support'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (MIT)', cite: ['bb-license', 'bb-home'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free for individuals and teams, with no paid tier listed; the bb connect relay is free too', cite: ['bb-home', 'bb-vs-conductor', 'bb-switch-claude'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'Desktop: Apple silicon Macs, alpha Linux x64 and Windows x64; Intel Macs use npx bb-app. iOS beta, Android alpha', cite: ['bb-repo', 'bb-platform-support'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code, Codex and Pi built in; Cursor, OpenCode, Grok Build, omp, Hermes Agent and any other ACP agent; plugins add more', cite: ['bb-parallel-agents', 'bb-switch-claude', 'bb-acp-readme', 'bb-configuration', 'bb-marketplace-devin', 'bb-marketplace-amp'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Claude Code through Anthropic’s Claude Agent SDK, Codex through codex app-server, Pi in RPC mode, the rest over ACP', cite: ['bb-claude-sdk', 'bb-codex-bridge', 'bb-pi-rpc', 'bb-acp-readme'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Uses the CLI sign-in, plan or API key each agent already has; bb-app env can store API keys. Providers bill usage, not bb', cite: ['bb-app-readme', 'bb-home'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'None for the app; bb connect and bb cloud AI need a getbb.app account via GitHub; phones also connect directly without one', cite: ['bb-privacy', 'bb-dashboard', 'bb-cloud-ai', 'bb-platform-support'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Per-thread modes: Accept Edits, Approve for me (auto-reviews, escalates risky ones) or Full Access, capped per machine; answer from computer or phone', mark: 'yes', cite: ['bb-vs-conductor', 'bb-changelog'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Agents bring their own MCP servers, as bb runs their CLIs and SDKs; a community plugin manages MCP configs across agents', mark: 'partial', cite: ['bb-parallel-agents', 'bb-marketplace-mcp-manager'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'The project checkout or a managed git worktree on its own branch per thread; several threads can share one', mark: 'yes', cite: ['bb-worktrees', 'bb-system-overview'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Setup and teardown scripts per worktree; .worktreeinclude copies files like .env. Dev servers run in a thread terminal; no built-in port allocation', mark: 'yes', cite: ['bb-worktrees', 'bb-vs-conductor', 'bb-remote-dev-servers'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'A terminal per thread in its worktree that keeps running when its tab closes; the bb CLI can create and read terminals', mark: 'yes', cite: ['bb-remote-dev-servers', 'bb-vs-conductor'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'The thread list shows each thread as running, needing you or done, on every machine', mark: 'yes', cite: ['bb-parallel-agents'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'The built-in Push notifications plugin alerts phone, web and desktop; per thread, choose all activity, input requests alone or none', mark: 'yes', cite: ['bb-push-package', 'bb-multiple-devices', 'bb-changelog'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Any thread can start and message threads on other providers; you can also hand a thread to another agent or model', mark: 'yes', cite: ['bb-parallel-agents', 'bb-changelog'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Automations start agent threads or scripts on your own machines: on a repeating schedule, at one chosen time or after a delay', mark: 'yes', cite: ['bb-vs-conductor'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'An in-app browser in the desktop app; the official, experimental Browser Automation plugin lets agents drive it and connected machines’ browsers', mark: 'yes', cite: ['bb-changelog', 'bb-marketplace-browser-automation'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Diff panel with glob filters; Add to chat sends selected lines to the agent; Commit stages and commits all changes', mark: 'yes', cite: ['bb-vs-conductor', 'bb-changelog', 'bb-verify-git'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'Files open in a read-only preview; the built-in File Editor plugin edits and saves them in Monaco, with find and a file tree', mark: 'yes', cite: ['bb-file-editor', 'bb-changelog'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'The agent opens PRs; the thread then tracks their checks and offers a Merge button. No create-PR button is documented', mark: 'partial', cite: ['bb-vs-conductor'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Official GitHub plugin, installed from the bundled catalog: issues and PR panel, Send agent and Review with agent, via gh', mark: 'yes', cite: ['bb-github-plugin', 'bb-configuration'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'Official GitHub and Tasks plugins cover GitHub issues and Linear-style tasks; community plugins add Linear, Jira Cloud and GitLab issues', mark: 'yes', cite: ['bb-github-plugin', 'bb-configuration', 'bb-changelog', 'bb-marketplace-linear', 'bb-marketplace-jira', 'bb-marketplace-gitlab'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'No hosted agent compute; the built-in, experimental Modal Sandbox plugin runs threads in sandboxes on your own Modal account', mark: 'partial', cite: ['bb-vs-conductor', 'bb-modal-package'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'Threads can run on several enrolled macOS, Linux or Windows machines; remote browsers and phones use bb connect or Tailscale', mark: 'yes', cite: ['bb-multiple-devices', 'bb-remote-dev-servers', 'bb-configuration', 'bb-app-readme'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'iOS (TestFlight beta) and Android (alpha APK) apps act as clients of a bb server; neither is in a public store', mark: 'partial', cite: ['bb-platform-support', 'bb-multiple-devices'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'In-app updates for the desktop app and npm installs, from Settings → Updates; enrolled machines move to the server’s version on their own', mark: 'yes', cite: ['bb-configuration', 'bb-multiple-devices', 'bb-work-anywhere'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'No built-in import; bb’s guide has an agent read Claude Code’s .jsonl files. Community plugins adopt terminal sessions or import Codex chats', mark: 'partial', cite: ['bb-work-anywhere', 'bb-switch-claude', 'bb-marketplace-handoff', 'bb-marketplace-codex-migrate'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Thread search matches titles, projects and message text, with filter and sort controls', mark: 'yes', cite: ['bb-changelog'] } },
				{ label: 'Fork a conversation', splash: S.fork, other: { text: 'Fork a new thread off any message; in Codex, Claude Code and Pi threads, edit an earlier message to rerun', mark: 'yes', cite: ['bb-vs-conductor', 'bb-configuration'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'bb runs Claude Code through Anthropic’s Claude Agent SDK, Codex through <code>codex app-server</code> and Pi in RPC mode; Cursor, OpenCode and other ACP agents go through bb’s ACP kit. Every provider bridge talks to bb over a JSON-RPC protocol of bb’s own. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, natively or through an adapter.',
			cite: ['bb-claude-sdk', 'bb-codex-bridge', 'bb-pi-rpc', 'bb-acp-readme', 'bb-bridge-protocol', 'splash-registry', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'bb’s server keeps state in SQLite and a host daemon runs on each execution machine, so threads can run on several machines. Its API has no authentication and listens on loopback by default; remote phones and browsers use <strong>bb connect</strong> or Tailscale. Splash runs agents on your computer, or under <code>splash-server</code> on a machine you reach through an SSH tunnel.',
			cite: ['bb-system-overview', 'bb-multiple-devices', 'bb-app-readme', 'bb-configuration', 'splash-readme', 'splash-server']
		},
		{
			title: 'Plugins and automation',
			text: 'bb’s GitHub, Tasks, notification and sandbox features are plugins, and a community marketplace reviewed by the bb team lists 300+ more; plugins run as full-trust code in the server. Agents use the <code>bb</code> CLI to start and message other threads, and scripts use the HTTP API or a Node SDK. A Splash session is one agent in one folder.',
			cite: ['bb-github-plugin', 'bb-push-package', 'bb-modal-package', 'bb-marketplace-manifest', 'bb-vs-conductor', 'bb-configuration', 'bb-parallel-agents', 'bb-app-readme', 'bb-repo', 'splash-readme', 'splash-features']
		},
		{
			title: 'Accounts and hosted services',
			text: 'bb runs without an account. Signing in to getbb.app with GitHub adds <strong>bb connect</strong>, a free relay, and <strong>bb cloud AI</strong>, which is on by default once signed in. It sends first prompts, diff excerpts and voice recordings through getbb.app to OpenRouter zero-data-retention endpoints for titles, commit messages and transcription; getbb.app keeps usage records but not prompts or recordings. Splash has no accounts; <code>splash-server</code> asks for a token.',
			cite: ['bb-privacy', 'bb-dashboard', 'bb-switch-claude', 'bb-cloud-ai', 'splash-build', 'splash-server']
		},
		{
			title: 'Platforms',
			text: 'bb’s Electron desktop app supports Apple silicon Macs, with alpha builds for Linux x64 and Windows x64; Intel Macs and WSL2 run the server and web app through <code>npx bb-app</code>, and the iOS and Android clients are beta and alpha. Splash, written in Rust, builds for macOS 14+ on Apple silicon and Intel, Windows 11 x64 and Ubuntu 24.04 x64.',
			cite: ['bb-repo', 'bb-desktop-package', 'bb-platform-support', 'splash-install', 'splash-how']
		}
	],
	fit: {
		splash: [
			'You want a desktop app for Intel as well as Apple silicon Macs, Windows 11 and Ubuntu.',
			'You want launch commands for Gemini, Copilot, Goose and other agents shipped with the app, each driven over the Agent Client Protocol.',
			'You want to import conversations that agents list over ACP, including ones started outside the app, and search them with the rest.',
			'You want to reach your own server through an SSH tunnel, with no accounts or relay service involved.'
		],
		other: [
			'You want one server to run threads across several machines, followed from a browser or a phone.',
			'You want agents that start and message other agents’ threads, plus automations that run on a schedule.',
			'You want setup and teardown scripts per worktree, with optional Modal sandboxes for cloud runs.',
			'You want to extend the app with plugins, including community ones for Linear, Jira, GitLab and more agents.'
		]
	},
	sources: [
		{ id: 'bb-home', title: 'bb: the IDE that builds itself', url: 'https://getbb.app/', publisher: 'bb', checked: '2026-10-10' },
		{ id: 'bb-vs-conductor', title: 'Conductor Alternatives: bb, the Free, Open-Source Option', url: 'https://getbb.app/compare/conductor-alternatives', publisher: 'bb', checked: '2026-10-10' },
		{ id: 'bb-parallel-agents', title: 'Build your own software factory of coding agents', url: 'https://getbb.app/claude-code-parallel-agents', publisher: 'bb', checked: '2026-10-10' },
		{ id: 'bb-switch-claude', title: 'Switch from Claude Code to bb', url: 'https://getbb.app/guides/switch-from-claude-code', publisher: 'bb', checked: '2026-10-10' },
		{ id: 'bb-work-anywhere', title: 'Keep working from anywhere', url: 'https://getbb.app/guides/work-from-anywhere', publisher: 'bb', checked: '2026-10-10' },
		{ id: 'bb-remote-dev-servers', title: 'Run a dev server for every branch', url: 'https://getbb.app/guides/remote-dev-servers', publisher: 'bb', checked: '2026-10-10' },
		{ id: 'bb-changelog', title: 'Changelog', url: 'https://getbb.app/changelog', publisher: 'bb', checked: '2026-10-10' },
		{ id: 'bb-privacy', title: 'Privacy', url: 'https://getbb.app/privacy', publisher: 'bb', checked: '2026-10-10' },
		{ id: 'bb-dashboard', title: 'bb connect', url: 'https://getbb.app/dashboard', publisher: 'bb', checked: '2026-10-10' },
		{ id: 'bb-marketplace-manifest', title: 'BB Community marketplace manifest', url: 'https://getbb.app/marketplace/v2/marketplace.json', publisher: 'bb', checked: '2026-10-10' },
		{ id: 'bb-marketplace-devin', title: 'Devin — bb Plugin Marketplace', url: 'https://getbb.app/marketplace/devin', publisher: 'bb', checked: '2026-10-10' },
		{ id: 'bb-marketplace-amp', title: 'Amp — bb Plugin Marketplace', url: 'https://getbb.app/marketplace/amp', publisher: 'bb', checked: '2026-10-10' },
		{ id: 'bb-marketplace-linear', title: 'Linear — bb Plugin Marketplace', url: 'https://getbb.app/marketplace/linear', publisher: 'bb', checked: '2026-10-10' },
		{ id: 'bb-marketplace-jira', title: 'Jira — bb Plugin Marketplace', url: 'https://getbb.app/marketplace/jira', publisher: 'bb', checked: '2026-10-10' },
		{ id: 'bb-marketplace-gitlab', title: 'GitLab — bb Plugin Marketplace', url: 'https://getbb.app/marketplace/gitlab', publisher: 'bb', checked: '2026-10-10' },
		{ id: 'bb-marketplace-handoff', title: 'Handoff — bb Plugin Marketplace', url: 'https://getbb.app/marketplace/handoff', publisher: 'bb', checked: '2026-10-10' },
		{ id: 'bb-marketplace-codex-migrate', title: 'Codex Migrate — bb Plugin Marketplace', url: 'https://getbb.app/marketplace/codex-migrate', publisher: 'bb', checked: '2026-10-10' },
		{ id: 'bb-marketplace-mcp-manager', title: 'MCP Manager — bb Plugin Marketplace', url: 'https://getbb.app/marketplace/mcp-manager', publisher: 'bb', checked: '2026-10-10' },
		{ id: 'bb-marketplace-browser-automation', title: 'Browser Automation — bb Plugin Marketplace', url: 'https://getbb.app/marketplace/browser-automation', publisher: 'bb', checked: '2026-10-10' },
		{ id: 'bb-repo', title: 'get-bb/bb README', url: 'https://github.com/get-bb/bb/blob/main/README.md', publisher: 'get-bb/bb on GitHub', checked: '2026-10-10' },
		{ id: 'bb-license', title: 'LICENSE', url: 'https://github.com/get-bb/bb/blob/main/LICENSE', publisher: 'get-bb/bb on GitHub', checked: '2026-10-10' },
		{ id: 'bb-release', title: 'bb desktop 0.46.0', url: 'https://github.com/get-bb/bb/releases/tag/desktop-v0.46.0', publisher: 'get-bb/bb on GitHub', checked: '2026-10-10' },
		{ id: 'bb-desktop-package', title: 'apps/desktop/package.json', url: 'https://github.com/get-bb/bb/blob/main/apps/desktop/package.json', publisher: 'get-bb/bb on GitHub', checked: '2026-10-10' },
		{ id: 'bb-app-readme', title: 'bb-app package README', url: 'https://github.com/get-bb/bb/blob/main/packages/bb-app/README.md', publisher: 'get-bb/bb on GitHub', checked: '2026-10-10' },
		{ id: 'bb-system-overview', title: 'System Overview', url: 'https://github.com/get-bb/bb/blob/main/docs/system-overview.md', publisher: 'get-bb/bb on GitHub', checked: '2026-10-10' },
		{ id: 'bb-platform-support', title: 'Platform Support', url: 'https://github.com/get-bb/bb/blob/main/docs/platform-support.md', publisher: 'get-bb/bb on GitHub', checked: '2026-10-10' },
		{ id: 'bb-multiple-devices', title: 'Using bb on multiple devices', url: 'https://github.com/get-bb/bb/blob/main/docs/multiple-devices.md', publisher: 'get-bb/bb on GitHub', checked: '2026-10-10' },
		{ id: 'bb-configuration', title: 'Configuration', url: 'https://github.com/get-bb/bb/blob/main/docs/configuration.md', publisher: 'get-bb/bb on GitHub', checked: '2026-10-10' },
		{ id: 'bb-worktrees', title: 'Worktrees, setup scripts, and teardown scripts', url: 'https://github.com/get-bb/bb/blob/main/docs/worktrees.md', publisher: 'get-bb/bb on GitHub', checked: '2026-10-10' },
		{ id: 'bb-bridge-protocol', title: 'The bb Provider Bridge Protocol', url: 'https://github.com/get-bb/bb/blob/main/docs/provider-bridge-protocol.md', publisher: 'get-bb/bb on GitHub', checked: '2026-10-10' },
		{ id: 'bb-claude-sdk', title: 'plugins/provider-claude-code/src/bridge/sdk-session.ts', url: 'https://github.com/get-bb/bb/blob/main/plugins/provider-claude-code/src/bridge/sdk-session.ts', publisher: 'get-bb/bb on GitHub', checked: '2026-10-10' },
		{ id: 'bb-codex-bridge', title: 'plugins/provider-codex/src/bridge/bridge.ts', url: 'https://github.com/get-bb/bb/blob/main/plugins/provider-codex/src/bridge/bridge.ts', publisher: 'get-bb/bb on GitHub', checked: '2026-10-10' },
		{ id: 'bb-pi-rpc', title: 'plugins/provider-pi/src/bridge/rpc-session.ts', url: 'https://github.com/get-bb/bb/blob/main/plugins/provider-pi/src/bridge/rpc-session.ts', publisher: 'get-bb/bb on GitHub', checked: '2026-10-10' },
		{ id: 'bb-acp-readme', title: 'ACP providers plugin README', url: 'https://github.com/get-bb/bb/blob/main/plugins/provider-acp/README.md', publisher: 'get-bb/bb on GitHub', checked: '2026-10-10' },
		{ id: 'bb-github-plugin', title: 'bb-plugin-github README', url: 'https://github.com/get-bb/bb/blob/main/plugins/github/README.md', publisher: 'get-bb/bb on GitHub', checked: '2026-10-10' },
		{ id: 'bb-push-package', title: 'plugins/push-notifications/package.json', url: 'https://github.com/get-bb/bb/blob/main/plugins/push-notifications/package.json', publisher: 'get-bb/bb on GitHub', checked: '2026-10-10' },
		{ id: 'bb-modal-package', title: 'plugins/environment-modal-sandbox/package.json', url: 'https://github.com/get-bb/bb/blob/main/plugins/environment-modal-sandbox/package.json', publisher: 'get-bb/bb on GitHub', checked: '2026-10-10' },
		{ id: 'bb-cloud-ai', title: 'bb cloud AI plugin README', url: 'https://github.com/get-bb/bb/blob/main/plugins/bb-ai/README.md', publisher: 'get-bb/bb on GitHub', checked: '2026-10-10' },
		{ id: 'bb-file-editor', title: 'bb-plugin-monaco-editor README', url: 'https://github.com/get-bb/bb/blob/main/plugins/monaco-editor/README.md', publisher: 'get-bb/bb on GitHub', checked: '2026-10-10' },
		{ id: 'bb-verify-git', title: 'verify-bb: Projects, sources, environments, and Git', url: 'https://github.com/get-bb/bb/blob/main/.bb/skills/verify-bb/features/projects-environments.md', publisher: 'get-bb/bb on GitHub', checked: '2026-10-10' }
	]
};
