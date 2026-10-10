// Splash vs Automaker. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const AUTOMAKER: Comparison = {
	slug: 'automaker',
	name: 'Automaker',
	description: 'How Splash and Automaker compare on agents, platforms, pricing, worktrees, review and maintenance status, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Automaker both run several coding agents at once, each piece of work optionally in its own git worktree. Automaker, an Electron app, tracks work as feature cards on a Kanban board and runs Claude, Codex, Cursor, Gemini, OpenCode and Copilot through their SDKs and CLIs. Splash drives each agent over the Agent Client Protocol in its own session.',
	other: {
		name: 'Automaker',
		url: 'https://automaker.app/',
		maker: 'Automaker Core Contributors',
		summary: 'An Electron desktop and web app that turns features on a Kanban board into agent tasks, each in its own git worktree, with six agent providers. Its README says it’s no longer actively maintained.',
		cite: ['automaker-home', 'automaker-readme', 'automaker-license', 'automaker-provider-factory']
	},
	groups: [
		{ title: 'The basics', rows: [
			{ label: 'What it is', splash: S.formFactor, other: { text: 'Electron desktop app, also usable as a browser web app from source or Docker, built around a Kanban board of features', cite: ['automaker-readme', 'automaker-home'] } },
			{ label: 'Release status', splash: S.maturity, other: { text: 'v1.0.0 (15 March 2026), after 0.x releases from December 2025; the README says it’s no longer actively maintained', cite: ['automaker-v1-0-0', 'automaker-v0-1-0', 'automaker-readme', 'automaker-license'] } },
			{ label: 'License', splash: S.license, other: { text: 'Open source (MIT) since February 2026; in December 2025 it switched to AGPL-3.0, then to a source-available license', cite: ['automaker-license', 'automaker-readme', 'automaker-license-agpl', 'automaker-license-mit'] } },
			{ label: 'Price', splash: S.price, other: { text: 'Free, with no paid tiers; model usage is billed by each provider through your own plan or API key', cite: ['automaker-home', 'automaker-readme'] } },
			{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon, Intel), Windows x64 and Linux x64, with no code signing in its release workflow; a Docker image covers amd64 and arm64', cite: ['automaker-readme', 'automaker-v1-0-0', 'automaker-release-workflow'] } },
			{ label: 'Built with', splash: S.tech, other: { text: 'Electron, React and Vite with an Express backend, in TypeScript; running from source needs Node.js 22', cite: ['automaker-readme'] } }
		] },
		{ title: 'Agents', rows: [
			{ label: 'Agents', splash: S.agents, other: { text: 'Claude, Codex, Cursor, Gemini CLI, OpenCode and GitHub Copilot, plus endpoints that speak Claude’s API, such as OpenRouter', cite: ['automaker-provider-factory', 'automaker-readme', 'automaker-compatible-providers'] } },
			{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Claude and Copilot through their SDKs; Cursor, Gemini CLI, OpenCode and usually Codex as CLI subprocesses that stream JSON', cite: ['automaker-claude-provider', 'automaker-copilot-provider', 'automaker-codex-provider', 'automaker-cursor-provider', 'automaker-gemini-provider', 'automaker-opencode-provider'] } },
			{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Your existing Claude Code, Codex, Cursor or Gemini CLI login, a GitHub login for Copilot, or API keys saved in Automaker; providers bill usage', cite: ['automaker-readme', 'automaker-claude-provider', 'automaker-codex-provider', 'automaker-cursor-provider', 'automaker-gemini-provider', 'automaker-copilot-provider', 'automaker-settings-service'] } },
			{ label: 'Account required', splash: S.account, other: { text: 'No Automaker account; the local server creates its own API key at first start, and web mode uses a session cookie', cite: ['automaker-auth', 'automaker-readme'] } },
			{ label: 'Model and mode pickers', splash: S.models, other: { text: 'A model per feature, and four planning modes from skip to full; spec mode starts a separate agent for each task', mark: 'yes', cite: ['automaker-readme'] } },
			{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'No per-tool prompts: Claude bypasses permissions, Copilot auto-approves, Gemini uses yolo mode; an optional plan approval step comes first', mark: 'partial', cite: ['automaker-claude-provider', 'automaker-copilot-provider', 'automaker-gemini-provider', 'automaker-readme'] } },
			{ label: 'MCP servers', splash: S.mcp, other: { text: 'Add stdio, SSE or HTTP MCP servers for agents in settings, then test each one and list its tools', mark: 'yes', cite: ['automaker-settings-types', 'automaker-mcp-routes'] } }
		] },
		{ title: 'Working in parallel', rows: [
			{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A git worktree on its own feature branch per feature, on by default; a project can turn worktrees off', mark: 'yes', cite: ['automaker-readme', 'automaker-settings-types'] } },
			{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'A per-project init script for new worktrees, copied files like .env, and a dev server per worktree on its own port', mark: 'yes', cite: ['automaker-init-script', 'automaker-settings-types', 'automaker-dev-server'] } },
			{ label: 'Terminal', splash: S.terminal, other: { text: 'Built-in terminal with tabs, split panes and persistent sessions; a worktree can also open in your external terminal', mark: 'yes', cite: ['automaker-readme', 'automaker-v0-13-0'] } },
			{ label: 'What needs you', splash: S.attention, other: { text: 'A Running Agents view of every active agent across projects, and a Waiting Approval column for finished features', mark: 'yes', cite: ['automaker-readme', 'automaker-notifications'] } },
			{ label: 'Notifications', splash: S.notifications, other: { text: 'In-app notifications and optional completion sounds; event hooks can run a command, call a webhook or push via ntfy.sh', mark: 'yes', cite: ['automaker-readme', 'automaker-notifications', 'automaker-event-hooks', 'automaker-ntfy'] } },
			{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Auto Mode picks up backlog features by itself and implements them, one at a time unless you raise the limit; time-based schedules aren’t documented', mark: 'partial', cite: ['automaker-home', 'automaker-readme', 'automaker-settings-types'] } }
		] },
		{ title: 'Review and shipping', rows: [
			{ label: 'Review changes', splash: S.review, other: { text: 'Finished features wait for approval with a git diff of their changes; you can message running agents. Diff comments aren’t documented', mark: 'yes', cite: ['automaker-readme'] } },
			{ label: 'Create pull requests', splash: S.prs, other: { text: 'Commit, push and open PRs from a worktree via gh; Merge joins branches in local git, not on GitHub', mark: 'yes', cite: ['automaker-readme', 'automaker-create-pr', 'automaker-merge'] } },
			{ label: 'GitHub', splash: S.github, other: { text: 'Imports issues, lists PRs with review and merge state, and turns PR review comments into agent tasks; CI check status isn’t documented', mark: 'yes', cite: ['automaker-readme', 'automaker-list-prs', 'automaker-pr-790'] } },
			{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'GitHub issues, which AI checks for feasibility before they become tasks; Linear, Jira and GitLab aren’t documented', mark: 'partial', cite: ['automaker-readme'] } }
		] },
		{ title: 'Where it runs', rows: [
			{ label: 'Cloud execution', splash: S.cloud, other: { text: 'No hosted cloud; it runs on your computer or in your own Docker container, which its security disclaimer recommends', mark: 'no', cite: ['automaker-home', 'automaker-readme', 'automaker-disclaimer'] } },
			{ label: 'Remote access', splash: S.remote, other: { text: 'Web mode in a browser or as a phone PWA, reachable from LAN devices after sign-in; SSH isn’t documented', mark: 'partial', cite: ['automaker-readme', 'automaker-pr-782', 'automaker-server-index', 'automaker-auth'] } }
		] },
		{ title: 'History and search', rows: [
			{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented, nor is search across sessions; chats started in Automaker persist across restarts with their full history', mark: 'unknown', cite: ['automaker-readme'] } }
		] }
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Automaker runs Claude through the Claude Agent SDK and Copilot through the Copilot SDK, and starts Cursor, Gemini CLI, OpenCode and usually Codex as subprocesses whose JSON output it parses. Its provider docs describe adding a provider as one new TypeScript file plus a line in a factory. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, natively or through an adapter for the vendor’s CLI.',
			cite: ['automaker-claude-provider', 'automaker-copilot-provider', 'automaker-codex-provider', 'automaker-cursor-provider', 'automaker-gemini-provider', 'automaker-opencode-provider', 'automaker-providers-doc', 'splash-registry', 'acp']
		},
		{
			title: 'Permissions and sandboxing',
			text: 'Automaker runs agents autonomously: Claude bypasses permission prompts, Copilot auto-approves and Gemini runs in yolo mode. Its security disclaimer advises running it in Docker or a VM rather than directly on your computer, and the Docker deployment has no host filesystem access. Splash shows each permission request in the transcript and keeps pending ones in <strong>Needs attention</strong>.',
			cite: ['automaker-claude-provider', 'automaker-copilot-provider', 'automaker-gemini-provider', 'automaker-disclaimer', 'automaker-readme', 'splash-features']
		},
		{
			title: 'How work is organized',
			text: 'Automaker organizes work as features on a Kanban board. Each can get a plan you approve first, depend on other features and pass through custom pipeline steps; <strong>Auto Mode</strong> picks up backlog features by itself, one at a time unless you raise the limit. Splash is organized around conversations: one agent per session, with a review screen and transcript search.',
			cite: ['automaker-readme', 'automaker-home', 'automaker-v0-7-0', 'automaker-settings-types', 'splash-readme', 'splash-features']
		},
		{
			title: 'Reaching it from other devices',
			text: 'Automaker’s server listens on all network interfaces by default and accepts private-network origins, so its web mode, which also works as a phone PWA, can be opened from other devices on your LAN after signing in. Splash runs locally, or as <code>splash-server</code> on the machine with your code, opened in a browser through an SSH tunnel for one user.',
			cite: ['automaker-server-index', 'automaker-readme', 'automaker-pr-782', 'splash-readme', 'splash-server']
		},
		{
			title: 'Platforms, license and maintenance',
			text: 'Automaker has desktop builds for macOS, Windows x64 and Linux x64 plus a Docker image, and is free under the MIT License, which it has used since February 2026, after AGPL and source-available terms in December 2025. Its README and LICENSE say it is no longer actively maintained. Splash, in early development, is free and MIT-licensed, with builds for macOS, Windows and Ubuntu.',
			cite: ['automaker-readme', 'automaker-v1-0-0', 'automaker-license', 'automaker-license-agpl', 'automaker-license-mit', 'splash-readme', 'splash-license', 'splash-download', 'splash-install']
		}
	],
	fit: {
		splash: [
			'You want agents to ask before they act, with each permission request answered in the transcript.',
			'You want to browse and import conversations your agents started outside the app.',
			'You want a GitHub view of issues, pull requests and Actions runs across repositories.',
			'You want to run sessions on your own server and reach them from a browser over an SSH tunnel.'
		],
		other: [
			'You want to plan work as features on a Kanban board, with plan approval, dependencies and Auto Mode working through the backlog.',
			'You want an init script, copied .env files and a dev server on its own port in every worktree.',
			'You want to open pull requests from the app and turn PR review comments into tasks for agents.',
			'You want event hooks that run commands, call webhooks or send ntfy.sh pushes when features finish or fail.'
		]
	},
	sources: [
		{ id: 'automaker-home', title: 'Automaker | Agented Coding with Autonomous AI Agents | AI Software Engineer', url: 'https://automaker.app/', publisher: 'Automaker', checked: '2026-10-10' },
		{ id: 'automaker-readme', title: 'README.md', url: 'https://github.com/AutoMaker-Org/automaker/blob/main/README.md', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-license', title: 'LICENSE', url: 'https://github.com/AutoMaker-Org/automaker/blob/main/LICENSE', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-license-agpl', title: 'LICENSE at f2a443af', url: 'https://github.com/AutoMaker-Org/automaker/blob/f2a443af/LICENSE', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-license-mit', title: 'chore: update project status and licensing information', url: 'https://github.com/AutoMaker-Org/automaker/commit/9c304eee', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-v1-0-0', title: 'Release v1.0.0', url: 'https://github.com/AutoMaker-Org/automaker/releases/tag/v1.0.0', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-v0-1-0', title: 'Release v0.1.0 - Biggie Shorty', url: 'https://github.com/AutoMaker-Org/automaker/releases/tag/v0.1.0', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-v0-7-0', title: 'Release v0.7.0 - Dragon Slayer', url: 'https://github.com/AutoMaker-Org/automaker/releases/tag/v0.7.0', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-v0-13-0', title: 'Release v0.13.0 - Flying High', url: 'https://github.com/AutoMaker-Org/automaker/releases/tag/v0.13.0', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-release-workflow', title: '.github/workflows/release.yml', url: 'https://github.com/AutoMaker-Org/automaker/blob/main/.github/workflows/release.yml', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-provider-factory', title: 'apps/server/src/providers/provider-factory.ts', url: 'https://github.com/AutoMaker-Org/automaker/blob/main/apps/server/src/providers/provider-factory.ts', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-providers-doc', title: 'Provider Architecture Reference', url: 'https://github.com/AutoMaker-Org/automaker/blob/main/docs/server/providers.md', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-compatible-providers', title: 'Claude Compatible Providers System', url: 'https://github.com/AutoMaker-Org/automaker/blob/main/docs/UNIFIED_API_KEY_PROFILES.md', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-claude-provider', title: 'apps/server/src/providers/claude-provider.ts', url: 'https://github.com/AutoMaker-Org/automaker/blob/main/apps/server/src/providers/claude-provider.ts', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-copilot-provider', title: 'apps/server/src/providers/copilot-provider.ts', url: 'https://github.com/AutoMaker-Org/automaker/blob/main/apps/server/src/providers/copilot-provider.ts', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-codex-provider', title: 'apps/server/src/providers/codex-provider.ts', url: 'https://github.com/AutoMaker-Org/automaker/blob/main/apps/server/src/providers/codex-provider.ts', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-cursor-provider', title: 'apps/server/src/providers/cursor-provider.ts', url: 'https://github.com/AutoMaker-Org/automaker/blob/main/apps/server/src/providers/cursor-provider.ts', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-gemini-provider', title: 'apps/server/src/providers/gemini-provider.ts', url: 'https://github.com/AutoMaker-Org/automaker/blob/main/apps/server/src/providers/gemini-provider.ts', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-opencode-provider', title: 'apps/server/src/providers/opencode-provider.ts', url: 'https://github.com/AutoMaker-Org/automaker/blob/main/apps/server/src/providers/opencode-provider.ts', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-settings-service', title: 'apps/server/src/services/settings-service.ts', url: 'https://github.com/AutoMaker-Org/automaker/blob/main/apps/server/src/services/settings-service.ts', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-auth', title: 'apps/server/src/lib/auth.ts', url: 'https://github.com/AutoMaker-Org/automaker/blob/main/apps/server/src/lib/auth.ts', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-settings-types', title: 'libs/types/src/settings.ts', url: 'https://github.com/AutoMaker-Org/automaker/blob/main/libs/types/src/settings.ts', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-mcp-routes', title: 'apps/server/src/routes/mcp/index.ts', url: 'https://github.com/AutoMaker-Org/automaker/blob/main/apps/server/src/routes/mcp/index.ts', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-init-script', title: 'apps/server/src/services/init-script-service.ts', url: 'https://github.com/AutoMaker-Org/automaker/blob/main/apps/server/src/services/init-script-service.ts', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-dev-server', title: 'apps/server/src/services/dev-server-service.ts', url: 'https://github.com/AutoMaker-Org/automaker/blob/main/apps/server/src/services/dev-server-service.ts', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-notifications', title: 'libs/types/src/notification.ts', url: 'https://github.com/AutoMaker-Org/automaker/blob/main/libs/types/src/notification.ts', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-event-hooks', title: 'apps/server/src/services/event-hook-service.ts', url: 'https://github.com/AutoMaker-Org/automaker/blob/main/apps/server/src/services/event-hook-service.ts', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-ntfy', title: 'apps/server/src/services/ntfy-service.ts', url: 'https://github.com/AutoMaker-Org/automaker/blob/main/apps/server/src/services/ntfy-service.ts', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-create-pr', title: 'apps/server/src/routes/worktree/routes/create-pr.ts', url: 'https://github.com/AutoMaker-Org/automaker/blob/main/apps/server/src/routes/worktree/routes/create-pr.ts', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-merge', title: 'apps/server/src/routes/worktree/routes/merge.ts', url: 'https://github.com/AutoMaker-Org/automaker/blob/main/apps/server/src/routes/worktree/routes/merge.ts', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-list-prs', title: 'apps/server/src/routes/github/routes/list-prs.ts', url: 'https://github.com/AutoMaker-Org/automaker/blob/main/apps/server/src/routes/github/routes/list-prs.ts', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-pr-790', title: 'Feature: Add PR review comments and resolution, improve AI prompt handling (#790)', url: 'https://github.com/AutoMaker-Org/automaker/pull/790', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-pr-782', title: 'Feature: Comprehensive mobile improvements and bug fixes (#782)', url: 'https://github.com/AutoMaker-Org/automaker/pull/782', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-server-index', title: 'apps/server/src/index.ts', url: 'https://github.com/AutoMaker-Org/automaker/blob/main/apps/server/src/index.ts', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' },
		{ id: 'automaker-disclaimer', title: 'DISCLAIMER.md', url: 'https://github.com/AutoMaker-Org/automaker/blob/main/DISCLAIMER.md', publisher: 'AutoMaker-Org/automaker on GitHub', checked: '2026-10-10' }
	]
};
