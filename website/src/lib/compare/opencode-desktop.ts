// Splash vs OpenCode Desktop. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const OPENCODE_DESKTOP: Comparison = {
	slug: 'opencode-desktop',
	name: 'OpenCode Desktop',
	description: 'How Splash and OpenCode Desktop compare on agents, platforms, pricing, worktrees and review, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and OpenCode Desktop are both open-source desktop apps for working with AI coding agents. OpenCode Desktop is a front end for OpenCode’s own agent, which runs in an OpenCode server that the app starts locally or reaches by URL. Splash runs agents from several vendors, OpenCode among them, and drives each over the Agent Client Protocol.',
	other: {
		name: 'OpenCode Desktop',
		url: 'https://opencode.ai/download',
		maker: 'Anomaly',
		summary: 'The desktop app for OpenCode, Anomaly’s open-source coding agent. It runs OpenCode’s server locally or connects to one by URL, with Build and Plan agents, a Review tab, a terminal and models from many providers.',
		cite: ['opencode-desktop-download', 'opencode-desktop-troubleshooting', 'opencode-desktop-agents', 'opencode-desktop-review-tab', 'opencode-desktop-terminal', 'opencode-desktop-providers']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app for OpenCode, an open-source coding agent that also comes as a terminal UI, IDE extension and web interface', cite: ['opencode-desktop-download', 'opencode-desktop-home'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'Two lines ship: the download page serves 2.0.26 (V2), while GitHub releases and Homebrew have v1.18.35. The README labels it beta', cite: ['opencode-desktop-download-mac', 'opencode-desktop-package-v2', 'opencode-desktop-v1-18-35', 'opencode-desktop-changelog', 'opencode-desktop-brew-cask', 'opencode-desktop-readme'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (MIT), desktop package included', cite: ['opencode-desktop-download', 'opencode-desktop-package-dev'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free, with some free models. Optional: Zen pay-per-request credit, Go $10 or Go Plus $40 a month, per-seat Enterprise', cite: ['opencode-desktop-download', 'opencode-desktop-home', 'opencode-desktop-zen', 'opencode-desktop-go', 'opencode-desktop-enterprise'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon and Intel), Windows x64, Linux .deb and .rpm; the V2 docs add ARM64 builds and an AppImage', cite: ['opencode-desktop-download', 'opencode-desktop-v2-docs', 'opencode-desktop-readme'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Electron, with a Solid renderer', cite: ['opencode-desktop-desktop-readme', 'opencode-desktop-package-v2'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'OpenCode’s own agent: Build and Plan primary agents plus General and Explore subagents; running other agent CLIs isn’t documented', cite: ['opencode-desktop-agents', 'opencode-desktop-v2-agents'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Runs OpenCode’s own server locally and talks to it over HTTP; the 2.0.26 build joins V2’s shared background service', cite: ['opencode-desktop-troubleshooting', 'opencode-desktop-wsl', 'opencode-desktop-background-service', 'opencode-desktop-v2-cli'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Provider keys or logins via /connect (75+ providers, local models), including Copilot and ChatGPT plans; or Zen, Go and free models', cite: ['opencode-desktop-providers', 'opencode-desktop-home'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'None for the app or its free models; Zen, Go and Console features need an OpenCode account', cite: ['opencode-desktop-home', 'opencode-desktop-v2-console', 'opencode-desktop-go', 'opencode-desktop-zen'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Rules set each action to allow, ask or deny; ask waits for your approval. V1’s --auto approves anything not denied', mark: 'yes', cite: ['opencode-desktop-permissions'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Local and remote MCP servers, added in OpenCode’s config under mcp', mark: 'yes', cite: ['opencode-desktop-mcp'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Optional: a session in a git project can start in a worktree (“workspace”) under OpenCode’s data folder, or use your checkout', mark: 'yes', cite: ['opencode-desktop-v1-17-12', 'opencode-desktop-worktree', 'opencode-desktop-workspace-controller-v2'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'A per-project startup script, such as bun install, runs after a new workspace is created; ports and env files aren’t documented', mark: 'yes', cite: ['opencode-desktop-i18n', 'opencode-desktop-worktree'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'A terminal panel in each session, toggled with ctrl+`, backed by PTYs on the server', mark: 'yes', cite: ['opencode-desktop-terminal'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Unseen flags per session and project, plus notifications for finished turns, permission requests and errors', mark: 'yes', cite: ['opencode-desktop-notification', 'opencode-desktop-i18n'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'System notifications for finished turns, permission requests and errors while the window is unfocused, plus optional sounds', mark: 'yes', cite: ['opencode-desktop-notification', 'opencode-desktop-i18n', 'opencode-desktop-troubleshooting'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'A Review tab with per-file diffs, unified or split; line comments go to the agent with your next prompt', mark: 'yes', cite: ['opencode-desktop-review-tab', 'opencode-desktop-request-parts'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Not in the desktop app’s docs; the GitHub and GitLab CI agents open a PR or MR from a new branch', mark: 'partial', cite: ['opencode-desktop-github', 'opencode-desktop-gitlab'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'A GitHub Actions agent for issues and PRs; the CLI’s opencode pr checks out a PR. Neither is in the desktop app', mark: 'partial', cite: ['opencode-desktop-github', 'opencode-desktop-cli'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'GitHub and GitLab, through CI agents on issues and pull or merge requests; Linear and Jira aren’t listed as integrations', mark: 'partial', cite: ['opencode-desktop-github', 'opencode-desktop-gitlab', 'opencode-desktop-download'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'No hosted runs are documented; the server runs on your computer or on a machine whose URL you set', mark: 'no', cite: ['opencode-desktop-troubleshooting'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'Attaches to an OpenCode server by URL, such as one in WSL; opencode web (opencode pair in V2) serves a browser UI', mark: 'yes', cite: ['opencode-desktop-troubleshooting', 'opencode-desktop-wsl', 'opencode-desktop-web', 'opencode-desktop-v2-docs'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'No native mobile app is documented; the CLI docs run opencode web for web or mobile access', mark: 'no', cite: ['opencode-desktop-cli'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'V2 clients share one local server that owns sessions; the CLI imports OpenCode JSON or share links. Other tools: not documented', mark: 'partial', cite: ['opencode-desktop-v2-cli', 'opencode-desktop-cli'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Session search in the command palette, matching session titles', mark: 'partial', cite: ['opencode-desktop-v1-1-50', 'opencode-desktop-session-search'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'OpenCode Desktop is a client of OpenCode’s own server, which runs the agent loop; the 2.0.26 build joins V2’s shared background service, which every local client uses. Through <code>opencode acp</code>, OpenCode also acts as an ACP agent, and Splash launches it that way, as one of the agents it drives over the <strong>Agent Client Protocol</strong>.',
			cite: ['opencode-desktop-troubleshooting', 'opencode-desktop-background-service', 'opencode-desktop-v2-cli', 'opencode-desktop-v2-build', 'opencode-desktop-acp', 'splash-registry', 'acp']
		},
		{
			title: 'Models, price and accounts',
			text: 'OpenCode is free and MIT-licensed. You connect your own model providers, 75+ of them, or local models; it also ships some free models and sells optional model access through Zen and Go, which need an OpenCode account. Splash is free, MIT-licensed and has no accounts; each agent runs with the CLI login you set up.',
			cite: ['opencode-desktop-download', 'opencode-desktop-providers', 'opencode-desktop-home', 'opencode-desktop-zen', 'opencode-desktop-go', 'splash-license', 'splash-download', 'splash-build', 'splash-agents']
		},
		{
			title: 'Where it runs',
			text: 'OpenCode Desktop starts a local server by default, or uses one at a URL you configure, such as a server inside WSL on Windows; <code>opencode web</code> (<code>opencode pair</code> in V2) opens OpenCode in a browser. Splash runs agents as child processes on your computer, or under <code>splash-server</code> on a machine of yours, used in a browser through an SSH tunnel.',
			cite: ['opencode-desktop-troubleshooting', 'opencode-desktop-wsl', 'opencode-desktop-web', 'opencode-desktop-v2-docs', 'splash-readme', 'splash-server']
		},
		{
			title: 'Platforms and releases',
			text: 'OpenCode Desktop is an Electron app for macOS, Windows x64 and Linux (.deb and .rpm), and the V2 docs add ARM64 builds. Two lines ship at once: 2.0.26 from the download page and v1.18.35 on GitHub and Homebrew. Splash is a Rust app for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64, plus a headless server.',
			cite: ['opencode-desktop-desktop-readme', 'opencode-desktop-download', 'opencode-desktop-v2-docs', 'opencode-desktop-download-mac', 'opencode-desktop-v1-18-35', 'opencode-desktop-brew-cask', 'splash-how', 'splash-install']
		},
		{
			title: 'Around the session',
			text: 'OpenCode extends through JavaScript and TypeScript plugins, a type-safe SDK for its server, MCP servers, and GitHub and GitLab agents that run in CI. Splash’s tools center on the conversations: a Needs attention queue, a review screen, transcript search, importing sessions agents started elsewhere, and a GitHub view across repositories.',
			cite: ['opencode-desktop-plugins', 'opencode-desktop-sdk', 'opencode-desktop-mcp', 'opencode-desktop-github', 'opencode-desktop-gitlab', 'splash-features', 'splash-history', 'splash-github']
		}
	],
	fit: {
		splash: [
			'You want Claude Code, Codex, Gemini, Copilot, OpenCode and other agents in one app, each driven over the Agent Client Protocol.',
			'You want permission requests, failures and finished turns gathered in one Needs attention queue that survives restarts.',
			'You want to import conversations your agents started outside the app and search their transcript text.',
			'You want a GitHub view of issues, pull requests and Actions runs across repositories.'
		],
		other: [
			'You want OpenCode’s own agent with your choice of 75+ model providers, local models or its free models.',
			'You want one OpenCode server behind the desktop app, the terminal UI and a browser.',
			'You want startup scripts for new worktrees and line comments on diffs that go back to the agent.',
			'You want GitHub and GitLab agents that run in CI on issues and pull or merge requests.'
		]
	},
	sources: [
		{ id: 'opencode-desktop-download', title: 'Download', url: 'https://opencode.ai/download', publisher: 'Anomaly', checked: '2026-10-10' },
		{ id: 'opencode-desktop-home', title: 'The open source AI coding agent', url: 'https://opencode.ai/', publisher: 'Anomaly', checked: '2026-10-10' },
		{ id: 'opencode-desktop-download-mac', title: 'Stable macOS (Apple silicon) download link', url: 'https://opencode.ai/download/stable/darwin-aarch64-dmg', publisher: 'Anomaly', checked: '2026-10-10' },
		{ id: 'opencode-desktop-changelog', title: 'Changelog', url: 'https://opencode.ai/changelog', publisher: 'Anomaly', checked: '2026-10-10' },
		{ id: 'opencode-desktop-brew-cask', title: 'opencode-desktop cask', url: 'https://formulae.brew.sh/api/cask/opencode-desktop.json', publisher: 'Homebrew', checked: '2026-10-10' },
		{ id: 'opencode-desktop-v1-18-35', title: 'Release v1.18.35', url: 'https://github.com/anomalyco/opencode/releases/tag/v1.18.35', publisher: 'anomalyco/opencode on GitHub', checked: '2026-10-10' },
		{ id: 'opencode-desktop-readme', title: 'README.md', url: 'https://github.com/anomalyco/opencode', publisher: 'anomalyco/opencode on GitHub', checked: '2026-10-10' },
		{ id: 'opencode-desktop-desktop-readme', title: 'packages/desktop/README.md', url: 'https://github.com/anomalyco/opencode/blob/dev/packages/desktop/README.md', publisher: 'anomalyco/opencode on GitHub', checked: '2026-10-10' },
		{ id: 'opencode-desktop-package-v2', title: 'packages/desktop/package.json (v2 branch)', url: 'https://github.com/anomalyco/opencode/blob/v2/packages/desktop/package.json', publisher: 'anomalyco/opencode on GitHub', checked: '2026-10-10' },
		{ id: 'opencode-desktop-package-dev', title: 'packages/desktop/package.json (dev branch)', url: 'https://github.com/anomalyco/opencode/blob/dev/packages/desktop/package.json', publisher: 'anomalyco/opencode on GitHub', checked: '2026-10-10' },
		{ id: 'opencode-desktop-v2-docs', title: 'V2 docs: Intro', url: 'https://opencode.ai/v2/docs', publisher: 'Anomaly', checked: '2026-10-10' },
		{ id: 'opencode-desktop-zen', title: 'OpenCode Zen', url: 'https://opencode.ai/zen', publisher: 'Anomaly', checked: '2026-10-10' },
		{ id: 'opencode-desktop-go', title: 'OpenCode Go', url: 'https://opencode.ai/go', publisher: 'Anomaly', checked: '2026-10-10' },
		{ id: 'opencode-desktop-enterprise', title: 'Enterprise', url: 'https://opencode.ai/docs/enterprise/', publisher: 'Anomaly', checked: '2026-10-10' },
		{ id: 'opencode-desktop-agents', title: 'Agents', url: 'https://opencode.ai/docs/agents/', publisher: 'Anomaly', checked: '2026-10-10' },
		{ id: 'opencode-desktop-v2-agents', title: 'V2 docs: Agents', url: 'https://opencode.ai/v2/docs/agents/', publisher: 'Anomaly', checked: '2026-10-10' },
		{ id: 'opencode-desktop-troubleshooting', title: 'Troubleshooting', url: 'https://opencode.ai/docs/troubleshooting/', publisher: 'Anomaly', checked: '2026-10-10' },
		{ id: 'opencode-desktop-background-service', title: 'packages/desktop/src/main/service/background-service.ts (v2 branch)', url: 'https://github.com/anomalyco/opencode/blob/v2/packages/desktop/src/main/service/background-service.ts', publisher: 'anomalyco/opencode on GitHub', checked: '2026-10-10' },
		{ id: 'opencode-desktop-v2-cli', title: 'V2 docs: CLI', url: 'https://opencode.ai/v2/docs/cli/', publisher: 'Anomaly', checked: '2026-10-10' },
		{ id: 'opencode-desktop-v2-build', title: 'V2 docs: Build', url: 'https://opencode.ai/v2/docs/build/', publisher: 'Anomaly', checked: '2026-10-10' },
		{ id: 'opencode-desktop-providers', title: 'Providers', url: 'https://opencode.ai/docs/providers/', publisher: 'Anomaly', checked: '2026-10-10' },
		{ id: 'opencode-desktop-v2-console', title: 'V2 docs: Console', url: 'https://opencode.ai/v2/docs/console/', publisher: 'Anomaly', checked: '2026-10-10' },
		{ id: 'opencode-desktop-permissions', title: 'Permissions', url: 'https://opencode.ai/docs/permissions/', publisher: 'Anomaly', checked: '2026-10-10' },
		{ id: 'opencode-desktop-mcp', title: 'MCP servers', url: 'https://opencode.ai/docs/mcp-servers/', publisher: 'Anomaly', checked: '2026-10-10' },
		{ id: 'opencode-desktop-v1-17-12', title: 'Release v1.17.12', url: 'https://github.com/anomalyco/opencode/releases/tag/v1.17.12', publisher: 'anomalyco/opencode on GitHub', checked: '2026-10-10' },
		{ id: 'opencode-desktop-worktree', title: 'packages/opencode/src/worktree/index.ts', url: 'https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/worktree/index.ts', publisher: 'anomalyco/opencode on GitHub', checked: '2026-10-10' },
		{ id: 'opencode-desktop-workspace-controller-v2', title: 'packages/app/src/new-session/workspace/controller.ts (v2 branch)', url: 'https://github.com/anomalyco/opencode/blob/v2/packages/app/src/new-session/workspace/controller.ts', publisher: 'anomalyco/opencode on GitHub', checked: '2026-10-10' },
		{ id: 'opencode-desktop-i18n', title: 'packages/app/src/i18n/en.ts', url: 'https://github.com/anomalyco/opencode/blob/dev/packages/app/src/i18n/en.ts', publisher: 'anomalyco/opencode on GitHub', checked: '2026-10-10' },
		{ id: 'opencode-desktop-terminal', title: 'packages/app/src/components/terminal.tsx', url: 'https://github.com/anomalyco/opencode/blob/dev/packages/app/src/components/terminal.tsx', publisher: 'anomalyco/opencode on GitHub', checked: '2026-10-10' },
		{ id: 'opencode-desktop-notification', title: 'packages/app/src/context/notification.tsx', url: 'https://github.com/anomalyco/opencode/blob/dev/packages/app/src/context/notification.tsx', publisher: 'anomalyco/opencode on GitHub', checked: '2026-10-10' },
		{ id: 'opencode-desktop-review-tab', title: 'packages/app/src/pages/session/review-tab.tsx', url: 'https://github.com/anomalyco/opencode/blob/dev/packages/app/src/pages/session/review-tab.tsx', publisher: 'anomalyco/opencode on GitHub', checked: '2026-10-10' },
		{ id: 'opencode-desktop-request-parts', title: 'packages/app/src/components/prompt-input/build-request-parts.ts', url: 'https://github.com/anomalyco/opencode/blob/dev/packages/app/src/components/prompt-input/build-request-parts.ts', publisher: 'anomalyco/opencode on GitHub', checked: '2026-10-10' },
		{ id: 'opencode-desktop-github', title: 'GitHub', url: 'https://opencode.ai/docs/github/', publisher: 'Anomaly', checked: '2026-10-10' },
		{ id: 'opencode-desktop-gitlab', title: 'GitLab', url: 'https://opencode.ai/docs/gitlab/', publisher: 'Anomaly', checked: '2026-10-10' },
		{ id: 'opencode-desktop-cli', title: 'CLI', url: 'https://opencode.ai/docs/cli/', publisher: 'Anomaly', checked: '2026-10-10' },
		{ id: 'opencode-desktop-wsl', title: 'Windows (WSL)', url: 'https://opencode.ai/docs/windows-wsl/', publisher: 'Anomaly', checked: '2026-10-10' },
		{ id: 'opencode-desktop-web', title: 'Web', url: 'https://opencode.ai/docs/web/', publisher: 'Anomaly', checked: '2026-10-10' },
		{ id: 'opencode-desktop-v1-1-50', title: 'Release v1.1.50', url: 'https://github.com/anomalyco/opencode/releases/tag/v1.1.50', publisher: 'anomalyco/opencode on GitHub', checked: '2026-10-10' },
		{ id: 'opencode-desktop-session-search', title: 'packages/core/src/session.ts (v2 branch)', url: 'https://github.com/anomalyco/opencode/blob/v2/packages/core/src/session.ts', publisher: 'anomalyco/opencode on GitHub', checked: '2026-10-10' },
		{ id: 'opencode-desktop-acp', title: 'ACP Support', url: 'https://opencode.ai/docs/acp/', publisher: 'Anomaly', checked: '2026-10-10' },
		{ id: 'opencode-desktop-plugins', title: 'Plugins', url: 'https://opencode.ai/docs/plugins/', publisher: 'Anomaly', checked: '2026-10-10' },
		{ id: 'opencode-desktop-sdk', title: 'SDK', url: 'https://opencode.ai/docs/sdk/', publisher: 'Anomaly', checked: '2026-10-10' }
	]
};
