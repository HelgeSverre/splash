// Splash vs Nimbalyst. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const NIMBALYST: Comparison = {
	slug: 'nimbalyst',
	name: 'Nimbalyst',
	description: 'How Splash and Nimbalyst compare on agents, platforms, pricing, worktrees, review and mobile use, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Nimbalyst are open-source desktop apps for running coding agents, with an optional git worktree per session. Nimbalyst is an Electron workspace that adds visual editors, a task tracker and an iOS companion, and drives agents through SDKs, CLIs and protocols including ACP. Splash, written in Rust, drives every agent over the Agent Client Protocol.',
	other: {
		name: 'Nimbalyst',
		url: 'https://nimbalyst.com/',
		maker: 'Nimbalyst',
		summary: 'An open-source desktop workspace for coding agents such as Claude Code and Codex, combining visual editors, a task tracker and session management, with an iOS companion and a Teams plan for collaboration.',
		cite: ['nimbalyst-home', 'nimbalyst-docs', 'nimbalyst-open-source', 'nimbalyst-pricing']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Electron desktop workspace with visual editors, agent sessions and a task tracker, plus an iOS app and a Teams web console', cite: ['nimbalyst-docs', 'nimbalyst-readme', 'nimbalyst-app-store', 'nimbalyst-web-console'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v0.80.6 (9 October 2026); Teams is in beta, and several agents and features are labelled alpha', cite: ['nimbalyst-release', 'nimbalyst-web-console', 'nimbalyst-alpha'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (MIT) desktop and iOS apps; the sync server behind Teams is a separate project with no stated license', cite: ['nimbalyst-license', 'nimbalyst-open-source', 'nimbalyst-readme'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free for individuals; Teams costs $20 per user a month or $200 a year, free during beta; Enterprise is custom-priced', cite: ['nimbalyst-pricing'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 12+ (Apple silicon and Intel), Windows 10+ (x64 and arm64), Linux (.deb and AppImage); iPhone and iPad companion', cite: ['nimbalyst-readme', 'nimbalyst-release', 'nimbalyst-linux', 'nimbalyst-app-store'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Agent, OpenAI Codex and an opt-in Claude Code CLI; OpenCode, GitHub Copilot, Grok Build, Cursor Agent and Gemini in alpha', cite: ['nimbalyst-providers', 'nimbalyst-alpha'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Claude Agent SDK on a bundled runtime, codex app-server over JSON-RPC; alpha agents via ACP, CLI stream-json, HTTP or Connect-RPC', cite: ['nimbalyst-claude-provider', 'nimbalyst-quickstart', 'nimbalyst-codex-provider', 'nimbalyst-copilot-provider', 'nimbalyst-cursor-provider', 'nimbalyst-opencode-provider', 'nimbalyst-gemini-provider'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Claude or ChatGPT plan sign-in, or API keys added in the app; alpha agents reuse their CLI logins. Providers bill usage', cite: ['nimbalyst-providers', 'nimbalyst-alpha', 'nimbalyst-subscriptions'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'None for local use; an account is needed for Teams, phone sync and share links', cite: ['nimbalyst-privacy', 'nimbalyst-pricing', 'nimbalyst-mobile', 'nimbalyst-share-link'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Prompts inline in the transcript, four autonomy modes with Agent-verified as default, and a project trust gate; answerable from iOS', mark: 'yes', cite: ['nimbalyst-permissions', 'nimbalyst-mobile'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'MCP client with a template gallery and app- or project-level servers, plus Nimbalyst’s own tools for agents to call', mark: 'yes', cite: ['nimbalyst-mcp', 'nimbalyst-readme'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'An optional git worktree per session on its own branch, in Developer Mode; other sessions share the project folder', mark: 'yes', cite: ['nimbalyst-worktrees', 'nimbalyst-workstreams'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Sessions grouped as awaiting input, running or unread, a badge on the Agent icon, and a session kanban by phase', mark: 'yes', cite: ['nimbalyst-agent-window'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Agent Teams let one session spawn teammates that work in parallel; Super Loops, Blitz and Meta Agent are alpha', mark: 'partial', cite: ['nimbalyst-agent-teams', 'nimbalyst-alpha'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Automations run markdown prompts on a schedule, while the app is open', mark: 'yes', cite: ['nimbalyst-automations'] } },
				{ label: 'Team collaboration', hint: 'Several people on one project', splash: { text: 'splash-server is a personal, single-user service, not a multi-user deployment', mark: 'no', cite: ['splash-server'] }, other: { text: 'Teams (beta, free for now): shared documents, trackers and team chat, edited live by people and their agents', mark: 'partial', cite: ['nimbalyst-home', 'nimbalyst-pricing', 'nimbalyst-web-console'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Inline red/green diffs to accept or reject, a review queue and Keep All; line comments on code diffs aren’t documented', mark: 'yes', cite: ['nimbalyst-code-editor', 'nimbalyst-agent-window', 'nimbalyst-git'] } },
				{ label: 'Files and diffs', hint: 'Viewing and editing files', splash: S.files, other: { text: 'Visual editing of markdown, mockups, Mermaid, Excalidraw, CSV, data models and mind maps, and Monaco for code', mark: 'yes', cite: ['nimbalyst-readme', 'nimbalyst-home'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Pull Request mode through gh, GitHub Enterprise too: checks, comments, approvals, merges, and PR branches in worktree sessions', mark: 'yes', cite: ['nimbalyst-pr-reviews'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'Built-in tracker with kanban; browses and imports GitHub issues via gh; Linear and Jira through MCP templates, not native sync', mark: 'yes', cite: ['nimbalyst-tracker', 'nimbalyst-changelog', 'nimbalyst-repo-changelog', 'nimbalyst-mcp'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'Early option: remote sessions run Claude Code turns in an ephemeral Cloudflare sandbox in your own account', mark: 'partial', cite: ['nimbalyst-changelog', 'nimbalyst-cloudflare-sandbox', 'nimbalyst-node'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'The iOS app drives sessions on your desktop, which must stay awake and online; the web console doesn’t run agents', mark: 'partial', cite: ['nimbalyst-mobile', 'nimbalyst-web-console'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'Free iPhone and iPad app (iOS 18+) paired with your desktop; Android is planned, with an app in the repo', mark: 'yes', cite: ['nimbalyst-app-store', 'nimbalyst-mobile', 'nimbalyst-mobile-page', 'nimbalyst-android'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Receives updates by channel: promoted stable releases by default, or alpha builds, with a switch back to stable any time', mark: 'yes', cite: ['nimbalyst-readme'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Imports Claude Code CLI sessions to browse, search and resume; a setting also tracks terminal Claude Code and Codex sessions live', mark: 'partial', cite: ['nimbalyst-import-claude', 'nimbalyst-changelog'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Sidebar search over session titles and transcript text, plus a sessions tab in Quick Open', mark: 'yes', cite: ['nimbalyst-agent-window', 'nimbalyst-quickstart'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Nimbalyst runs Claude Agent on Anthropic’s Claude Agent SDK with a bundled runtime, and Codex through <code>codex app-server</code>; an opt-in mode starts the <code>claude</code> CLI in a terminal. Alpha providers use ACP (Copilot, Grok, Codex), Cursor’s stream-json output, OpenCode’s HTTP server or Antigravity’s language server. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, natively or via an adapter.',
			cite: ['nimbalyst-claude-provider', 'nimbalyst-quickstart', 'nimbalyst-codex-provider', 'nimbalyst-claude-cli', 'nimbalyst-copilot-provider', 'nimbalyst-grok-provider', 'nimbalyst-codex-acp', 'nimbalyst-cursor-provider', 'nimbalyst-opencode-provider', 'nimbalyst-gemini-provider', 'splash-registry', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'Nimbalyst runs agents on your desktop, where the iOS app reaches them over end-to-end encrypted sync, and an early option runs Claude Code sessions in a Cloudflare sandbox you deploy in your own account. Splash runs agents on your computer, or under <code>splash-server</code> on a machine you reach from a browser through an SSH tunnel.',
			cite: ['nimbalyst-privacy', 'nimbalyst-mobile', 'nimbalyst-changelog', 'nimbalyst-cloudflare-sandbox', 'nimbalyst-node', 'splash-readme', 'splash-server']
		},
		{
			title: 'Price, accounts and license',
			text: 'Nimbalyst’s desktop and iOS apps are MIT-licensed and free for individuals, with no account needed for local use. <strong>Teams</strong>, at $20 per user a month and free during its beta, adds shared documents, trackers and chat through Nimbalyst’s sync service, whose server code is a separate project. Splash is free, MIT-licensed and has no accounts.',
			cite: ['nimbalyst-license', 'nimbalyst-open-source', 'nimbalyst-pricing', 'nimbalyst-privacy', 'nimbalyst-home', 'nimbalyst-readme', 'splash-license', 'splash-download', 'splash-build']
		},
		{
			title: 'Around the session',
			text: 'Nimbalyst puts agents beside editors for markdown, mockups, diagrams, CSV and code, a built-in tracker agents can update, extensions, scheduled Automations and pull request review through <code>gh</code>. The terminal, worktrees and PR mode sit behind <strong>Developer Mode</strong>. Splash’s tools center on the conversation: a Needs attention queue, a review screen, transcript search and importing sessions agents started elsewhere.',
			cite: ['nimbalyst-readme', 'nimbalyst-tracker-ai', 'nimbalyst-extensions', 'nimbalyst-automations', 'nimbalyst-pr-reviews', 'nimbalyst-developer-mode', 'splash-features', 'splash-history']
		}
	],
	fit: {
		splash: [
			'You want every agent driven over one protocol, the Agent Client Protocol, with launch commands ready for many of them.',
			'You want to run sessions on your own server and use them from a browser over SSH.',
			'You want to import and search conversations that agents list over ACP, including ones started outside the app.',
			'You want permission requests, connection failures and finished turns gathered in one Needs attention queue.'
		],
		other: [
			'You want to edit documents, mockups, diagrams and code beside your agents in one workspace.',
			'You want a built-in task tracker your agents can read and update, with GitHub issues imported alongside.',
			'You want to follow and answer your desktop sessions from an iPhone or iPad.',
			'You want shared documents, trackers and team chat with teammates and their agents.'
		]
	},
	sources: [
		{ id: 'nimbalyst-home', title: 'Nimbalyst: Visual Editor for Claude Code & Codex', url: 'https://nimbalyst.com/', publisher: 'Nimbalyst', checked: '2026-10-10' },
		{ id: 'nimbalyst-docs', title: 'Why Nimbalyst?', url: 'https://nimbalyst.com/docs/', publisher: 'Nimbalyst', checked: '2026-10-10' },
		{ id: 'nimbalyst-open-source', title: 'Nimbalyst Is Open Source', url: 'https://nimbalyst.com/open-source/', publisher: 'Nimbalyst', checked: '2026-10-10' },
		{ id: 'nimbalyst-pricing', title: 'Nimbalyst Pricing', url: 'https://nimbalyst.com/pricing/', publisher: 'Nimbalyst', checked: '2026-10-10' },
		{ id: 'nimbalyst-subscriptions', title: 'Use Claude Code and Codex Subscriptions in One Workspace', url: 'https://nimbalyst.com/claude-code-codex-subscriptions/', publisher: 'Nimbalyst', checked: '2026-10-10' },
		{ id: 'nimbalyst-privacy', title: 'Privacy', url: 'https://nimbalyst.com/docs/open-safe-private-secure/privacy/', publisher: 'Nimbalyst', checked: '2026-10-10' },
		{ id: 'nimbalyst-changelog', title: 'Nimbalyst Changelog', url: 'https://nimbalyst.com/changelog/', publisher: 'Nimbalyst', checked: '2026-10-10' },
		{ id: 'nimbalyst-quickstart', title: 'Quickstart', url: 'https://nimbalyst.com/docs/getting-started/quickstart/', publisher: 'Nimbalyst', checked: '2026-10-10' },
		{ id: 'nimbalyst-providers', title: 'AI Provider Setup and Notifications', url: 'https://nimbalyst.com/docs/setup-nimbalyst/ai-provider-setup-and-notifications/', publisher: 'Nimbalyst', checked: '2026-10-10' },
		{ id: 'nimbalyst-alpha', title: 'Alpha Features', url: 'https://nimbalyst.com/docs/setup-nimbalyst/alpha-features/', publisher: 'Nimbalyst', checked: '2026-10-10' },
		{ id: 'nimbalyst-mcp', title: 'MCP', url: 'https://nimbalyst.com/docs/setup-nimbalyst/mcp/', publisher: 'Nimbalyst', checked: '2026-10-10' },
		{ id: 'nimbalyst-permissions', title: 'Permissions and Safety', url: 'https://nimbalyst.com/docs/open-safe-private-secure/permissions-and-safety/', publisher: 'Nimbalyst', checked: '2026-10-10' },
		{ id: 'nimbalyst-share-link', title: 'Share Link to a Session', url: 'https://nimbalyst.com/docs/session-management/share-link-to-a-session/', publisher: 'Nimbalyst', checked: '2026-10-10' },
		{ id: 'nimbalyst-agent-window', title: 'Agent Window & Session Management', url: 'https://nimbalyst.com/docs/session-management/agent-window-and-session-management/', publisher: 'Nimbalyst', checked: '2026-10-10' },
		{ id: 'nimbalyst-workstreams', title: 'Workstreams', url: 'https://nimbalyst.com/docs/session-management/workstreams/', publisher: 'Nimbalyst', checked: '2026-10-10' },
		{ id: 'nimbalyst-automations', title: 'Automations', url: 'https://nimbalyst.com/docs/session-management/automations/', publisher: 'Nimbalyst', checked: '2026-10-10' },
		{ id: 'nimbalyst-import-claude', title: 'Import Claude Code Sessions', url: 'https://nimbalyst.com/docs/session-management/import-claude-code-sessions/', publisher: 'Nimbalyst', checked: '2026-10-10' },
		{ id: 'nimbalyst-worktrees', title: 'Worktrees', url: 'https://nimbalyst.com/docs/developer-features/worktrees/', publisher: 'Nimbalyst', checked: '2026-10-10' },
		{ id: 'nimbalyst-agent-teams', title: 'Agent Teams', url: 'https://nimbalyst.com/docs/developer-features/agent-teams-and-super-loops/', publisher: 'Nimbalyst', checked: '2026-10-10' },
		{ id: 'nimbalyst-git', title: 'Working with Git', url: 'https://nimbalyst.com/docs/developer-features/working-with-git/', publisher: 'Nimbalyst', checked: '2026-10-10' },
		{ id: 'nimbalyst-pr-reviews', title: 'Pull Request Reviews', url: 'https://nimbalyst.com/docs/developer-features/pull-request-reviews/', publisher: 'Nimbalyst', checked: '2026-10-10' },
		{ id: 'nimbalyst-developer-mode', title: 'Turn on/off Developer Mode', url: 'https://nimbalyst.com/docs/developer-features/turn-on-off-developer-mode/', publisher: 'Nimbalyst', checked: '2026-10-10' },
		{ id: 'nimbalyst-code-editor', title: 'Code Editor', url: 'https://nimbalyst.com/docs/visual-editors-powered-by-ai/code-editor/', publisher: 'Nimbalyst', checked: '2026-10-10' },
		{ id: 'nimbalyst-tracker', title: 'Tracker Overview', url: 'https://nimbalyst.com/docs/task-management/overview/', publisher: 'Nimbalyst', checked: '2026-10-10' },
		{ id: 'nimbalyst-tracker-ai', title: 'Tracker AI Integration', url: 'https://nimbalyst.com/docs/task-management/ai-integration/', publisher: 'Nimbalyst', checked: '2026-10-10' },
		{ id: 'nimbalyst-extensions', title: 'Extension System & Marketplace', url: 'https://nimbalyst.com/docs/extensions/extension-system-and-marketplace/', publisher: 'Nimbalyst', checked: '2026-10-10' },
		{ id: 'nimbalyst-web-console', title: 'Web Console (console.nimbalyst.com)', url: 'https://nimbalyst.com/docs/team-collaboration/web-console/', publisher: 'Nimbalyst', checked: '2026-10-10' },
		{ id: 'nimbalyst-mobile', title: 'Mobile App', url: 'https://nimbalyst.com/docs/mobile/mobile-app/', publisher: 'Nimbalyst', checked: '2026-10-10' },
		{ id: 'nimbalyst-mobile-page', title: 'Mobile Agent Management for Claude Code & Codex', url: 'https://nimbalyst.com/mobile-agent-management/', publisher: 'Nimbalyst', checked: '2026-10-10' },
		{ id: 'nimbalyst-app-store', title: 'Nimbalyst', url: 'https://apps.apple.com/us/app/nimbalyst/id6756393105', publisher: 'Apple App Store', checked: '2026-10-10' },
		{ id: 'nimbalyst-readme', title: 'README.md', url: 'https://github.com/Nimbalyst/nimbalyst/blob/main/README.md', publisher: 'Nimbalyst/nimbalyst on GitHub', checked: '2026-10-10' },
		{ id: 'nimbalyst-license', title: 'LICENSE', url: 'https://github.com/Nimbalyst/nimbalyst/blob/main/LICENSE', publisher: 'Nimbalyst/nimbalyst on GitHub', checked: '2026-10-10' },
		{ id: 'nimbalyst-release', title: 'Release v0.80.6', url: 'https://github.com/Nimbalyst/nimbalyst/releases/tag/v0.80.6', publisher: 'Nimbalyst/nimbalyst on GitHub', checked: '2026-10-10' },
		{ id: 'nimbalyst-repo-changelog', title: 'CHANGELOG.md', url: 'https://github.com/Nimbalyst/nimbalyst/blob/main/CHANGELOG.md', publisher: 'Nimbalyst/nimbalyst on GitHub', checked: '2026-10-10' },
		{ id: 'nimbalyst-linux', title: 'docs/LINUX_INSTALL.md', url: 'https://github.com/Nimbalyst/nimbalyst/blob/main/docs/LINUX_INSTALL.md', publisher: 'Nimbalyst/nimbalyst on GitHub', checked: '2026-10-10' },
		{ id: 'nimbalyst-android', title: 'packages/android/README.md', url: 'https://github.com/Nimbalyst/nimbalyst/blob/main/packages/android/README.md', publisher: 'Nimbalyst/nimbalyst on GitHub', checked: '2026-10-10' },
		{ id: 'nimbalyst-cloudflare-sandbox', title: 'packages/cloudflare-sandbox/README.md', url: 'https://github.com/Nimbalyst/nimbalyst/blob/main/packages/cloudflare-sandbox/README.md', publisher: 'Nimbalyst/nimbalyst on GitHub', checked: '2026-10-10' },
		{ id: 'nimbalyst-node', title: 'packages/node/README.md', url: 'https://github.com/Nimbalyst/nimbalyst/blob/main/packages/node/README.md', publisher: 'Nimbalyst/nimbalyst on GitHub', checked: '2026-10-10' },
		{ id: 'nimbalyst-claude-provider', title: 'packages/runtime/src/ai/server/providers/ClaudeCodeProvider.ts', url: 'https://github.com/Nimbalyst/nimbalyst/blob/main/packages/runtime/src/ai/server/providers/ClaudeCodeProvider.ts', publisher: 'Nimbalyst/nimbalyst on GitHub', checked: '2026-10-10' },
		{ id: 'nimbalyst-claude-cli', title: 'packages/electron/src/main/services/ai/ClaudeCliSessionLauncher.ts', url: 'https://github.com/Nimbalyst/nimbalyst/blob/main/packages/electron/src/main/services/ai/ClaudeCliSessionLauncher.ts', publisher: 'Nimbalyst/nimbalyst on GitHub', checked: '2026-10-10' },
		{ id: 'nimbalyst-codex-provider', title: 'packages/runtime/src/ai/server/providers/OpenAICodexProvider.ts', url: 'https://github.com/Nimbalyst/nimbalyst/blob/main/packages/runtime/src/ai/server/providers/OpenAICodexProvider.ts', publisher: 'Nimbalyst/nimbalyst on GitHub', checked: '2026-10-10' },
		{ id: 'nimbalyst-codex-acp', title: 'packages/runtime/src/ai/server/protocols/CodexACPProtocol.ts', url: 'https://github.com/Nimbalyst/nimbalyst/blob/main/packages/runtime/src/ai/server/protocols/CodexACPProtocol.ts', publisher: 'Nimbalyst/nimbalyst on GitHub', checked: '2026-10-10' },
		{ id: 'nimbalyst-copilot-provider', title: 'packages/runtime/src/ai/server/providers/CopilotCLIProvider.ts', url: 'https://github.com/Nimbalyst/nimbalyst/blob/main/packages/runtime/src/ai/server/providers/CopilotCLIProvider.ts', publisher: 'Nimbalyst/nimbalyst on GitHub', checked: '2026-10-10' },
		{ id: 'nimbalyst-grok-provider', title: 'packages/runtime/src/ai/server/providers/GrokBuildProvider.ts', url: 'https://github.com/Nimbalyst/nimbalyst/blob/main/packages/runtime/src/ai/server/providers/GrokBuildProvider.ts', publisher: 'Nimbalyst/nimbalyst on GitHub', checked: '2026-10-10' },
		{ id: 'nimbalyst-cursor-provider', title: 'packages/runtime/src/ai/server/providers/CursorAgentProvider.ts', url: 'https://github.com/Nimbalyst/nimbalyst/blob/main/packages/runtime/src/ai/server/providers/CursorAgentProvider.ts', publisher: 'Nimbalyst/nimbalyst on GitHub', checked: '2026-10-10' },
		{ id: 'nimbalyst-opencode-provider', title: 'packages/runtime/src/ai/server/providers/OpenCodeProvider.ts', url: 'https://github.com/Nimbalyst/nimbalyst/blob/main/packages/runtime/src/ai/server/providers/OpenCodeProvider.ts', publisher: 'Nimbalyst/nimbalyst on GitHub', checked: '2026-10-10' },
		{ id: 'nimbalyst-gemini-provider', title: 'packages/runtime/src/ai/server/providers/GeminiAntigravityProvider.ts', url: 'https://github.com/Nimbalyst/nimbalyst/blob/main/packages/runtime/src/ai/server/providers/GeminiAntigravityProvider.ts', publisher: 'Nimbalyst/nimbalyst on GitHub', checked: '2026-10-10' }
	]
};
