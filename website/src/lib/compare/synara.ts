// Splash vs Synara. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const SYNARA: Comparison = {
	slug: 'synara',
	name: 'Synara',
	description: 'How Splash and Synara compare on agents, platforms, pricing, worktrees, review and remote use, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Synara are free, MIT-licensed desktop apps that run several coding agents at once and can give each piece of work its own git worktree. Synara, an Electron app, has a separate adapter for each of ten supported agents; Splash, written in Rust, drives every agent over the Agent Client Protocol.',
	other: {
		name: 'Synara',
		url: 'https://www.trysynara.com',
		maker: 'Emanuele Di Pietro',
		summary: 'A free, open-source desktop workspace that runs ten coding agents through per-agent adapters, with git worktrees, diffs, pull-request tools, a shared browser and scheduled automations.',
		cite: ['synara-docs', 'synara-llms', 'synara-registry', 'synara-worktrees', 'synara-features-overview', 'synara-browser', 'synara-automations']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app, plus a headless server package that serves the same web client to a browser', cite: ['synara-docs', 'synara-installation', 'synara-headless'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v1.0.1 (8 October 2026), following the 1.0.0 Stable release; the README still calls it early-stage software', cite: ['synara-release', 'synara-1-0-0', 'synara-readme'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (MIT)', cite: ['synara-license', 'synara-readme'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free, with no paid tier or model plan; sponsorships buy logo placement and donations help keep the app free', cite: ['synara-llms', 'synara-home', 'synara-sponsor', 'synara-donors'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon and Intel), Windows x64 (projects stored in WSL supported), Linux x86_64 AppImage; no ARM builds for Windows or Linux', cite: ['synara-install', 'synara-readme', 'synara-release', 'synara-git-troubleshooting'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Electron around a local server and a React 19 web UI, with a local SQLite database; started from the T3 Code codebase', cite: ['synara-desktop-pkg', 'synara-web-pkg', 'synara-privacy', 'synara-0-7-0', 'synara-license'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Ten: Claude Code, Codex, OpenCode, Cursor, Antigravity, Grok Build, Devin CLI, Pi, Oh My Pi and Factory Droid; adding others isn’t documented', cite: ['synara-llms', 'synara-registry', 'synara-customization'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Per-agent adapters: ACP for Cursor, Devin, Droid, Oh My Pi and Grok; Claude Agent SDK, codex app-server, opencode serve, Pi SDK, agy CLI', cite: ['synara-cursor-adapter', 'synara-devin', 'synara-droid', 'synara-omp', 'synara-grok', 'synara-claude-adapter', 'synara-readme', 'synara-opencode-runtime', 'synara-pi', 'synara-antigravity-adapter'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Approval and input requests appear in the task and under Awaiting you on the Kanban board; tasks run approval-required or full-access', mark: 'yes', cite: ['synara-providers', 'synara-tasks', 'synara-automations'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Gives supported agents Synara’s own MCP tools and lets other local apps create scoped tasks; passes compatible MCP server config to Devin', mark: 'partial', cite: ['synara-agent-gateway', 'synara-external-mcp', 'synara-devin'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Your checkout, or a managed git worktree per task with its own branch and terminal; no Synara sandbox is documented', mark: 'yes', cite: ['synara-worktrees', 'synara-antigravity'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'A project script runs as setup in each new worktree; the Environment panel starts and stops dev servers; you pick the ports', mark: 'yes', cite: ['synara-worktree-setup', 'synara-0-7-1', 'synara-organize', 'synara-worktrees'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'An Inbox and the Awaiting you group on the Kanban board gather approvals, failures, open questions and stalled work; completion alerts are muted while Synara has focus', mark: 'yes', cite: ['synara-tasks', 'synara-0-6-7'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'A Chromium page you and the agent share, with tabs scoped to the task and browser tools for compatible agents', mark: 'yes', cite: ['synara-browser'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Automations run agent work on a schedule through the same task and provider pipeline as interactive chats', mark: 'yes', cite: ['synara-automations'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Agent Gateway tools let one task create and steer others; a chat can switch provider mid-conversation; Beta adds coordinator Hubs', mark: 'yes', cite: ['synara-agent-gateway', 'synara-handoffs', 'synara-hubs'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Diffs of the last turn or of repository changes, also against another branch, tag or commit; file-preview line comments go to the agent; checkpoints roll back threads', mark: 'yes', cite: ['synara-workspace-editor', 'synara-composer'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'Split or stacked diffs with change navigation and line blame; files open in an in-app editor', mark: 'yes', cite: ['synara-workspace-editor'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'A Create PR dialog commits, pushes and opens the PR in one step, with generated commit messages and PR text', mark: 'yes', cite: ['synara-0-7-1', 'synara-pull-requests'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Through gh: a PR workspace to browse, review, comment, merge, close and reopen, with stacks, status and opt-in Auto-fix CI', mark: 'yes', cite: ['synara-features-overview', 'synara-pull-requests'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'GitHub issues, which can start an agent task; no Linear, Jira or GitLab integration is documented; built-in Tasks and a Kanban board', mark: 'partial', cite: ['synara-pull-requests', 'synara-tasks'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Opt-in: the server listens on LAN or Tailscale behind an auth token, and other devices open the web client', mark: 'yes', cite: ['synara-remote', 'synara-privacy', 'synara-headless'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Packaged builds update through the built-in desktop updater; the Beta app has its own prerelease feed', mark: 'yes', cite: ['synara-installation', 'synara-beta'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Copies Codex and Claude Code chats and projects from your machine into Synara, where you continue them; existing Droid sessions too', mark: 'partial', cite: ['synara-project-import', 'synara-0-5-2'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Searches saved messages, including chats you haven’t opened lately, and the open transcript; a chat exports as a ZIP', mark: 'yes', cite: ['synara-1-0-1', 'synara-organize'] } },
				{ label: 'Fork a conversation', splash: S.fork, other: { text: 'Forks a whole chat or one exact turn into a linked task, using the agent’s native fork where available', mark: 'yes', cite: ['synara-features-overview'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Synara has its own adapter for each of ten agents: ACP for Cursor, Devin, Droid, Oh My Pi and Grok; the Claude Agent SDK for Claude Code; <code>codex app-server</code>; <code>opencode serve</code>; the Pi SDK; and Antigravity’s <code>agy</code> CLI. Adding another agent isn’t documented. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, natively or through an adapter.',
			cite: ['synara-cursor', 'synara-cursor-adapter', 'synara-devin', 'synara-droid', 'synara-omp', 'synara-grok', 'synara-claude-adapter', 'synara-readme', 'synara-opencode-runtime', 'synara-pi', 'synara-antigravity-adapter', 'synara-registry', 'synara-customization', 'splash-registry', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'Both run agents on your own computer and offer a headless server you open in a browser. Synara’s server, a Node.js package, can listen on a LAN or Tailscale address behind an auth token, so a phone or tablet can connect. <code>splash-server</code> serves one user, reached through an SSH tunnel. Neither offers hosted cloud execution.',
			cite: ['synara-headless', 'synara-remote', 'synara-privacy', 'synara-agent-instructions', 'splash-readme', 'splash-server']
		},
		{
			title: 'Accounts and model billing',
			text: 'Neither app has accounts of its own. Synara uses the provider logins, subscriptions and API keys already on your machine, supports several accounts per provider, sends model traffic straight to each provider and sells no model plan; sponsorships and donations fund it. Splash runs each agent’s CLI with the login you set up yourself.',
			cite: ['synara-install', 'synara-docs', 'synara-provider-accounts', 'synara-privacy', 'synara-home', 'synara-sponsor', 'synara-donors', 'splash-build', 'splash-agents']
		},
		{
			title: 'Around the session',
			text: 'Synara’s tools around a task reach from setup to delivery: worktree setup scripts, dev servers, an in-app editor, a shared Chromium browser, PR creation, opt-in Auto-fix CI, scheduled Automations and a Tasks and Kanban board. Splash’s include a <strong>Needs attention</strong> queue, a review screen, transcript search, session import over ACP and a GitHub triage view.',
			cite: ['synara-worktree-setup', 'synara-organize', 'synara-workspace-editor', 'synara-browser', 'synara-0-7-1', 'synara-pull-requests', 'synara-automations', 'synara-tasks', 'splash-features', 'splash-history', 'splash-github']
		},
		{
			title: 'Platforms and releases',
			text: 'Synara ships for macOS (Apple silicon and Intel), Windows x64 and Linux x86_64, supports Windows projects stored inside WSL and updates itself; Computer Use (beta), the iOS Simulator pane and window capture require macOS. Splash builds for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64 and is updated by downloading a new release from GitHub.',
			cite: ['synara-install', 'synara-readme', 'synara-git-troubleshooting', 'synara-installation', 'synara-computer-use', 'synara-ios-simulator', 'synara-composer', 'splash-install', 'splash-about']
		}
	],
	fit: {
		splash: [
			'You want Gemini, Copilot, Goose and other ACP agents in the same chat view as Claude Code and Codex.',
			'You want permission requests answered in the transcript with number keys and gathered in one Needs attention queue.',
			'You want to import conversations agents list over ACP, including ones started outside the app, and search them with the rest.',
			'You want to run sessions on the machine that holds your code and use them in a browser through an SSH tunnel.'
		],
		other: [
			'You want worktree setup scripts, dev servers in an Environment panel and a browser you share with the agent.',
			'You want to edit files, commit, push and open pull requests in the app, with opt-in Auto-fix CI for failing checks.',
			'You want scheduled Automations, a Tasks and Kanban board, and tasks that can create and steer other tasks.',
			'You want to open your sessions from a phone or tablet over your own network, in an app that updates itself.'
		]
	},
	sources: [
		{ id: 'synara-home', title: 'AI Coding Workspace for Claude Code, Codex & Cursor', url: 'https://www.trysynara.com/', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-docs', title: 'Synara Documentation', url: 'https://www.trysynara.com/docs', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-llms', title: 'Synara (llms.txt)', url: 'https://www.trysynara.com/llms.txt', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-install', title: 'Download Synara', url: 'https://www.trysynara.com/install', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-privacy', title: 'Privacy', url: 'https://www.trysynara.com/privacy', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-sponsor', title: 'Sponsor', url: 'https://www.trysynara.com/sponsor', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-donors', title: 'Donors', url: 'https://www.trysynara.com/donors', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-agent-instructions', title: 'Synara agent instructions', url: 'https://www.trysynara.com/agent-instructions.md', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-installation', title: 'Installation', url: 'https://www.trysynara.com/docs/getting-started/installation', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-providers', title: 'Providers', url: 'https://www.trysynara.com/docs/getting-started/providers', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-headless', title: 'Headless server', url: 'https://www.trysynara.com/docs/workflows/headless-server', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-worktrees', title: 'Git Worktrees for AI Coding Agents', url: 'https://www.trysynara.com/docs/workflows/worktrees', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-pull-requests', title: 'Pull requests', url: 'https://www.trysynara.com/docs/workflows/pull-requests', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-browser', title: 'Browser verification', url: 'https://www.trysynara.com/docs/workflows/browser-verification', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-automations', title: 'Automations', url: 'https://www.trysynara.com/docs/workflows/automations', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-agent-gateway', title: 'Agent Gateway', url: 'https://www.trysynara.com/docs/workflows/agent-gateway', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-external-mcp', title: 'External MCP', url: 'https://www.trysynara.com/docs/workflows/external-mcp', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-handoffs', title: 'Provider handoffs', url: 'https://www.trysynara.com/docs/workflows/handoffs', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-features-overview', title: 'All features', url: 'https://www.trysynara.com/docs/features/overview', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-beta', title: 'Synara Beta', url: 'https://www.trysynara.com/docs/features/synara-beta', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-hubs', title: 'Hubs and Library', url: 'https://www.trysynara.com/docs/features/hubs', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-customization', title: 'Customization', url: 'https://www.trysynara.com/docs/features/customization', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-provider-accounts', title: 'Provider accounts', url: 'https://www.trysynara.com/docs/features/provider-accounts', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-organize', title: 'Organize & navigate', url: 'https://www.trysynara.com/docs/features/organize', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-tasks', title: 'Tasks, Kanban, and Inbox', url: 'https://www.trysynara.com/docs/features/tasks-and-inbox', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-workspace-editor', title: 'Workspace editor & diffs', url: 'https://www.trysynara.com/docs/features/workspace-editor', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-composer', title: 'Composer & attachments', url: 'https://www.trysynara.com/docs/features/composer', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-project-import', title: 'Import Codex and Claude projects', url: 'https://www.trysynara.com/docs/features/project-import', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-computer-use', title: 'Computer Use beta', url: 'https://www.trysynara.com/docs/features/computer-use', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-ios-simulator', title: 'iOS Simulator', url: 'https://www.trysynara.com/docs/features/ios-simulator', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-git-troubleshooting', title: 'Git and worktrees', url: 'https://www.trysynara.com/docs/troubleshooting/git-and-worktrees', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-cursor', title: 'Cursor', url: 'https://www.trysynara.com/docs/providers/cursor', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-devin', title: 'Devin CLI', url: 'https://www.trysynara.com/docs/providers/devin', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-droid', title: 'Factory Droid', url: 'https://www.trysynara.com/docs/providers/factory-droid', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-omp', title: 'Oh My Pi', url: 'https://www.trysynara.com/docs/providers/omp', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-grok', title: 'Grok Build', url: 'https://www.trysynara.com/docs/providers/grok', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-pi', title: 'Pi', url: 'https://www.trysynara.com/docs/providers/pi', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-antigravity', title: 'Antigravity', url: 'https://www.trysynara.com/docs/providers/antigravity', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-0-5-2', title: 'Synara 0.5.2', url: 'https://www.trysynara.com/changelog/v0.5.2', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-0-6-7', title: 'Synara 0.6.7', url: 'https://www.trysynara.com/changelog/v0.6.7', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-0-7-0', title: 'Synara 0.7.0', url: 'https://www.trysynara.com/changelog/v0.7.0', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-0-7-1', title: 'Synara 0.7.1', url: 'https://www.trysynara.com/changelog/v0.7.1', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-1-0-0', title: 'Synara 1.0.0', url: 'https://www.trysynara.com/changelog/v1.0.0', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-1-0-1', title: 'Synara 1.0.1', url: 'https://www.trysynara.com/changelog/v1.0.1', publisher: 'Emanuele Di Pietro', checked: '2026-10-10' },
		{ id: 'synara-release', title: 'Synara v1.0.1', url: 'https://github.com/Emanuele-web04/synara/releases/tag/v1.0.1', publisher: 'Emanuele-web04/synara on GitHub', checked: '2026-10-10' },
		{ id: 'synara-readme', title: 'README.md', url: 'https://github.com/Emanuele-web04/synara/blob/v1.0.1/README.md', publisher: 'Emanuele-web04/synara on GitHub', checked: '2026-10-10' },
		{ id: 'synara-license', title: 'LICENSE', url: 'https://github.com/Emanuele-web04/synara/blob/v1.0.1/LICENSE', publisher: 'Emanuele-web04/synara on GitHub', checked: '2026-10-10' },
		{ id: 'synara-remote', title: 'REMOTE.md', url: 'https://github.com/Emanuele-web04/synara/blob/v1.0.1/REMOTE.md', publisher: 'Emanuele-web04/synara on GitHub', checked: '2026-10-10' },
		{ id: 'synara-desktop-pkg', title: 'apps/desktop/package.json', url: 'https://github.com/Emanuele-web04/synara/blob/v1.0.1/apps/desktop/package.json', publisher: 'Emanuele-web04/synara on GitHub', checked: '2026-10-10' },
		{ id: 'synara-web-pkg', title: 'apps/web/package.json', url: 'https://github.com/Emanuele-web04/synara/blob/v1.0.1/apps/web/package.json', publisher: 'Emanuele-web04/synara on GitHub', checked: '2026-10-10' },
		{ id: 'synara-worktree-setup', title: 'apps/server/src/worktreeSetup.ts', url: 'https://github.com/Emanuele-web04/synara/blob/v1.0.1/apps/server/src/worktreeSetup.ts', publisher: 'Emanuele-web04/synara on GitHub', checked: '2026-10-10' },
		{ id: 'synara-registry', title: 'ProviderAdapterRegistry.ts', url: 'https://github.com/Emanuele-web04/synara/blob/v1.0.1/apps/server/src/provider/Layers/ProviderAdapterRegistry.ts', publisher: 'Emanuele-web04/synara on GitHub', checked: '2026-10-10' },
		{ id: 'synara-cursor-adapter', title: 'CursorAdapter.ts', url: 'https://github.com/Emanuele-web04/synara/blob/v1.0.1/apps/server/src/provider/Layers/CursorAdapter.ts', publisher: 'Emanuele-web04/synara on GitHub', checked: '2026-10-10' },
		{ id: 'synara-claude-adapter', title: 'ClaudeAdapter.ts', url: 'https://github.com/Emanuele-web04/synara/blob/v1.0.1/apps/server/src/provider/Layers/ClaudeAdapter.ts', publisher: 'Emanuele-web04/synara on GitHub', checked: '2026-10-10' },
		{ id: 'synara-antigravity-adapter', title: 'AntigravityAdapter.ts', url: 'https://github.com/Emanuele-web04/synara/blob/v1.0.1/apps/server/src/provider/Layers/AntigravityAdapter.ts', publisher: 'Emanuele-web04/synara on GitHub', checked: '2026-10-10' },
		{ id: 'synara-opencode-runtime', title: 'opencodeRuntime.ts', url: 'https://github.com/Emanuele-web04/synara/blob/v1.0.1/apps/server/src/provider/opencodeRuntime.ts', publisher: 'Emanuele-web04/synara on GitHub', checked: '2026-10-10' }
	]
};
