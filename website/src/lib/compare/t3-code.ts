// Splash vs T3 Code. Facts checked 2026-10-09 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const T3_CODE: Comparison = {
	slug: 't3-code',
	name: 'T3 Code',
	description: 'How Splash and T3 Code compare on agents, platforms, pricing, worktrees and review, with a source for every fact.',
	checked: '2026-10-09',
	intro: 'Splash and T3 Code both run several agents at once, each in a project folder or its own git worktree. T3 Code pairs a server that runs agents with desktop, web, iOS and Android apps, and uses each agent’s own interface. Splash is a desktop app, with an optional headless server you open in a browser, that speaks the Agent Client Protocol with every agent.',
	other: {
		name: 'T3 Code',
		url: 'https://t3.codes',
		maker: 'T3 Tools',
		summary: 'An MIT-licensed control surface for coding agents: a server runs Claude Code, Codex, Cursor and others on your own machines, driven from desktop, web, iOS and Android apps.',
		cite: ['t3-code-home', 't3-code-readme', 't3-code-architecture']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop, web, iOS and Android apps controlling a server that runs the agents; the server also runs alone as the t3 CLI', cite: ['t3-code-readme', 't3-code-architecture'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'Stable v0.0.45, released 2 October 2026, and nightly builds several times a day; the makers call it alpha and early-stage', cite: ['t3-code-release', 't3-code-releases', 't3-code-desktop-package', 't3-code-terms'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (MIT), the T3 Connect relay included; the Terms also cover use of the hosted services', cite: ['t3-code-license', 't3-code-relay', 't3-code-terms'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free; no paid plans are listed, and the Terms say there is currently no subscription fee', cite: ['t3-code-home', 't3-code-terms'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon, Intel), Windows 10 and 11 (x64, arm64), Linux x86_64 and arm64 (.deb, AppImage); iOS 18+ and Android', cite: ['t3-code-download', 't3-code-release', 't3-code-app-store', 't3-code-readme'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'TypeScript: an Electron desktop app, Expo and React Native mobile apps, and a Node.js server built on Effect', cite: ['t3-code-desktop-package', 't3-code-release', 't3-code-server-package'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Stable: Codex, Claude Code, Cursor, Grok Build, OpenCode, Antigravity. Nightly adds Pi, Muse Code (beta) and ACP agents (Registry or local)', cite: ['t3-code-readme', 't3-code-install', 't3-code-muse', 't3-code-providers-acp', 't3-code-orchestrator-pr', 't3-code-muse-pr'] } },
				{ label: 'How it runs agents', hint: 'The protocol or interface', splash: S.protocol, other: { text: 'An adapter per agent: Claude Agent SDK, Codex app-server, an OpenCode server; Grok, Antigravity and (in stable) Cursor over ACP', cite: ['t3-code-adding-provider', 't3-code-claude-driver', 't3-code-codex-adapter', 't3-code-opencode', 't3-code-cursor-driver'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Your existing agent logins and subscriptions; T3 resells no tokens, and each provider instance can hold its own API keys', cite: ['t3-code-readme', 't3-code-home', 't3-code-install'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'Not for local use or direct connections; T3 Connect and mobile push notifications need a T3 account', cite: ['t3-code-privacy', 't3-code-terms', 't3-code-mobile-notifications'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Answered in the conversation; four modes per thread, from Supervised to Full access (the initial default for new threads). Options vary by provider', mark: 'yes', cite: ['t3-code-permission-modes'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Agents get T3’s own MCP tools and load their own servers; nightly builds let outside agents sign in to T3’s MCP server', mark: 'yes', cite: ['t3-code-adding-provider', 't3-code-source-control', 't3-code-composer', 't3-code-outside-agents', 't3-code-outside-agents-pr'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Per thread: the current checkout or a new worktree on its own branch. Shift-clicking several models starts one worktree thread each', mark: 'yes', cite: ['t3-code-thread-sidebar', 't3-code-schema'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Scripts in a checked-in t3.json run in a T3 terminal, optionally on worktree creation, and can open a preview URL on desktop', mark: 'yes', cite: ['t3-code-schema'] } },
				{
					label: 'Built-in browser',
					hint: 'For previewing dev servers',
					splash: S.browser,
					other: { text: 'An in-app browser preview on desktop; nightly builds run it on the server, where you and agents share tabs from any device', mark: 'yes', cite: ['t3-code-schema', 't3-code-remote-access', 't3-code-browser-pr'] }
				},
				{ label: 'Terminal', splash: S.terminal, other: { text: 'Built-in terminals on desktop, web and mobile, run by the server and keeping up to 5,000 lines of scrollback across reconnects', mark: 'yes', cite: ['t3-code-terminal', 't3-code-app-store'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Sidebar sections for pinned, active, snoozed and settled threads; a beta option lifts threads that finish, fail or need you', mark: 'partial', cite: ['t3-code-thread-sidebar'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Inline diffs to check before pushing; diff comments go to the agent as chips; threads can rewind to an earlier message if the provider supports it', mark: 'yes', cite: ['t3-code-home', 't3-code-composer'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Commits, pushes and opens PRs from a thread with generated messages and descriptions; drafts, stacks, amends and auto-merge', mark: 'yes', cite: ['t3-code-source-control', 't3-code-home'] } },
				{ label: 'GitHub', hint: 'And other Git hosts', splash: S.github, other: { text: 'GitHub through the gh CLI, plus GitLab, Forgejo, Gitea, Bitbucket and Azure DevOps; a page to review, check out and merge PRs', mark: 'yes', cite: ['t3-code-source-control', 't3-code-source-control-stable'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'None documented; the Git host integrations cover repositories and pull requests, not issues', mark: 'no', cite: ['t3-code-source-control'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{
					label: 'Mobile app',
					splash: S.mobile,
					other: { text: 'iOS 18+ and Android companion apps for your own machines, with push alerts via T3 Connect; nightly builds need the TestFlight or Play beta app', mark: 'yes', cite: ['t3-code-app-store', 't3-code-readme', 't3-code-mobile-notifications', 't3-code-install'] }
				},
				{ label: 'Remote access', splash: S.remote, other: { text: 'T3 Connect relay (with sign-in), direct LAN or Tailscale pairing, SSH hosts added from the desktop app, and the hosted web app', mark: 'yes', cite: ['t3-code-remote-access'] } },
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'No hosted execution; agents run on machines you control, and an optional load balancer picks one for new threads', mark: 'no', cite: ['t3-code-remote-access', 't3-code-architecture'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'First-run setup offers to import Claude Code and Codex conversations active in the last 30 days, without tool activity; nightly also imports from ACP agents that support it', mark: 'partial', cite: ['t3-code-welcome', 't3-code-providers-acp', 't3-code-orchestrator-pr'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Cmd/Ctrl+K searches your messages and agents’ final replies across connected machines, on web and desktop', mark: 'yes', cite: ['t3-code-thread-sidebar'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'T3 Code uses each agent’s own interface: the <strong>Claude Agent SDK</strong>, Codex’s app-server protocol, an OpenCode server, and ACP for Grok and Antigravity. Stable builds run Cursor over ACP too; nightly builds move it to Cursor’s SDK and add ACP Registry agents. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, natively or through a pinned adapter.',
			cite: ['t3-code-adding-provider', 't3-code-claude-driver', 't3-code-codex-adapter', 't3-code-opencode', 't3-code-cursor-driver', 't3-code-cursor', 't3-code-providers-acp', 't3-code-orchestrator-pr', 'splash-registry', 'acp']
		},
		{
			title: 'Clients and servers',
			text: 'T3 Code splits into a server, which runs agents, terminals and Git, and desktop, web, iOS and Android clients. The desktop app includes its own server, the <code>t3</code> CLI runs one alone, and T3 Connect, direct LAN or Tailscale pairing, or SSH links devices. Splash is a desktop app; <code>splash-server</code> runs it on another machine, used in a browser through your own SSH tunnel.',
			cite: ['t3-code-architecture', 't3-code-readme', 't3-code-remote-access', 'splash-readme', 'splash-server']
		},
		{
			title: 'Stable and nightly builds',
			text: 'T3 Code ships stable releases (v0.0.45, 2 October 2026) and several nightly builds a day. Nightly builds run a new orchestrator, merged about an hour after v0.0.45 shipped, and add the ACP Registry, Pi, Muse Code, PR watching, and scheduled and webhook tasks; the store mobile apps can’t connect to them. The docs on its main branch already describe these features. Splash tags a release when a new version on main passes CI.',
			cite: ['t3-code-release', 't3-code-releases', 't3-code-orchestrator-pr', 't3-code-muse-pr', 't3-code-watch-pr', 't3-code-webhook-pr', 't3-code-install', 't3-code-providers-acp', 't3-code-source-control', 't3-code-project-settings', 'splash-install']
		},
		{
			title: 'Accounts and cost',
			text: 'Both are free and MIT-licensed, and both run agents with your own agent logins. T3 Code needs no account for local or direct connections; its T3 Connect relay and mobile push notifications need a T3 account. Splash has no accounts; <code>splash-server</code> asks for a token it keeps in its data folder.',
			cite: ['t3-code-license', 't3-code-terms', 't3-code-readme', 't3-code-privacy', 't3-code-mobile-notifications', 'splash-license', 'splash-download', 'splash-agents', 'splash-build', 'splash-server']
		},
		{
			title: 'Around the session',
			text: 'T3 Code adds tooling around the agents’ work: <code>t3.json</code> setup scripts, an in-app browser, a panel streaming an iOS Simulator or Android Emulator, a Usage page, and pull requests across six Git hosts. Splash adds tooling around conversations: a Needs attention queue, a review screen, transcript search, importing sessions agents list over ACP, and a GitHub view with Actions runs.',
			cite: ['t3-code-schema', 't3-code-devices', 't3-code-usage', 't3-code-source-control', 'splash-features', 'splash-history', 'splash-github']
		}
	],
	fit: {
		splash: [
			'You want no accounts at all, on the desktop or as a server you reach over SSH.',
			'You use agents such as Gemini, Copilot or Goose, which Splash ships ACP launch commands for.',
			'You want permission requests and finished turns in one queue, and search over full saved transcripts, tool output included.',
			'You want to import conversations from any agent that lists them over ACP, and triage GitHub issues and Actions runs.'
		],
		other: [
			'You want to follow and steer your agents from an iPhone, iPad or Android phone.',
			'You want to commit, push and open pull requests from a thread, then review and merge them on GitHub, GitLab, Bitbucket and other hosts.',
			'You want setup scripts in a checked-in t3.json and an in-app browser for previews.',
			'You want to reach your machines through T3 Connect, Tailscale or SSH, and spread new threads across them.'
		]
	},
	sources: [
		{ id: 't3-code-home', title: 'T3 Code', url: 'https://t3.codes/', publisher: 'T3 Tools, Inc.', checked: '2026-10-09' },
		{ id: 't3-code-download', title: 'Download T3 Code', url: 'https://t3.codes/download', publisher: 'T3 Tools, Inc.', checked: '2026-10-09' },
		{ id: 't3-code-privacy', title: 'T3 Code Privacy Policy', url: 'https://t3.codes/privacy-policy', publisher: 'T3 Tools, Inc.', checked: '2026-10-09' },
		{ id: 't3-code-terms', title: 'T3 Code Terms of Service', url: 'https://t3.codes/terms-of-service', publisher: 'T3 Tools, Inc.', checked: '2026-10-09' },
		{ id: 't3-code-schema', title: 'T3 project file (t3.json schema)', url: 'https://t3.codes/schema/t3.json', publisher: 'T3 Tools, Inc.', checked: '2026-10-09' },
		{ id: 't3-code-app-store', title: 'T3 Code - Remote Claude & more', url: 'https://apps.apple.com/us/app/t3-code-remote-claude-more/id6787819824', publisher: 'T3 Tools, Inc. on the App Store', checked: '2026-10-09' },
		{ id: 't3-code-readme', title: 'README', url: 'https://github.com/pingdotgg/t3code/blob/main/README.md', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-license', title: 'LICENSE', url: 'https://github.com/pingdotgg/t3code/blob/main/LICENSE', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-relay', title: 'T3 Connect Relay', url: 'https://github.com/pingdotgg/t3code/blob/main/infra/relay/README.md', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-release', title: 'T3 Code v0.0.45', url: 'https://github.com/pingdotgg/t3code/releases/tag/v0.0.45', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-releases', title: 'Releases', url: 'https://github.com/pingdotgg/t3code/releases', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-orchestrator-pr', title: 'feat(orchestrator): introduce new orchestrator (#2829)', url: 'https://github.com/pingdotgg/t3code/pull/2829', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-browser-pr', title: 'feat(preview): run the browser on the environment server (#15328)', url: 'https://github.com/pingdotgg/t3code/pull/15328', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-muse-pr', title: 'feat(providers): run Muse Code as a native provider (#17082)', url: 'https://github.com/pingdotgg/t3code/pull/17082', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-watch-pr', title: 'feat(server): agents can watch a PR and get woken when checks, reviews, or conflicts need them (#15057)', url: 'https://github.com/pingdotgg/t3code/pull/15057', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-webhook-pr', title: 'feat(web): create webhook automations and inspect their deliveries (#15088)', url: 'https://github.com/pingdotgg/t3code/pull/15088', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-outside-agents-pr', title: 'feat(server): outside agents sign in to the T3 MCP server with OAuth (#16336)', url: 'https://github.com/pingdotgg/t3code/pull/16336', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-desktop-package', title: 'apps/desktop/package.json', url: 'https://github.com/pingdotgg/t3code/blob/main/apps/desktop/package.json', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-server-package', title: 'apps/server/package.json', url: 'https://github.com/pingdotgg/t3code/blob/main/apps/server/package.json', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-architecture', title: 'Architecture', url: 'https://github.com/pingdotgg/t3code/blob/main/docs/internals/overview.md', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-adding-provider', title: 'Adding a provider', url: 'https://github.com/pingdotgg/t3code/blob/main/docs/internals/adding-a-provider.md', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-claude-driver', title: 'apps/server/src/provider/Drivers/ClaudeDriver.ts', url: 'https://github.com/pingdotgg/t3code/blob/main/apps/server/src/provider/Drivers/ClaudeDriver.ts', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-codex-adapter', title: 'apps/server/src/orchestration-v2/Adapters/CodexAdapterV2.ts', url: 'https://github.com/pingdotgg/t3code/blob/main/apps/server/src/orchestration-v2/Adapters/CodexAdapterV2.ts', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-cursor-driver', title: 'apps/server/src/provider/Drivers/CursorDriver.ts (v0.0.45)', url: 'https://github.com/pingdotgg/t3code/blob/v0.0.45/apps/server/src/provider/Drivers/CursorDriver.ts', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-install', title: 'Install T3 Code', url: 'https://github.com/pingdotgg/t3code/blob/main/docs/user/install.md', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-providers-acp', title: 'ACP providers', url: 'https://github.com/pingdotgg/t3code/blob/main/docs/user/providers-acp.md', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-cursor', title: 'Cursor', url: 'https://github.com/pingdotgg/t3code/blob/main/docs/user/cursor.md', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-opencode', title: 'OpenCode', url: 'https://github.com/pingdotgg/t3code/blob/main/docs/user/providers-opencode.md', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-muse', title: 'Muse Code', url: 'https://github.com/pingdotgg/t3code/blob/main/docs/user/providers-muse.md', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-permission-modes', title: 'Permission modes', url: 'https://github.com/pingdotgg/t3code/blob/main/docs/user/permission-modes.md', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-thread-sidebar', title: 'Working with threads', url: 'https://github.com/pingdotgg/t3code/blob/main/docs/user/thread-sidebar.md', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-project-settings', title: 'Settings and project overrides', url: 'https://github.com/pingdotgg/t3code/blob/main/docs/user/project-settings.md', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-terminal', title: 'Terminal history', url: 'https://github.com/pingdotgg/t3code/blob/main/docs/user/terminal.md', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-composer', title: 'Messages and context', url: 'https://github.com/pingdotgg/t3code/blob/main/docs/user/composer.md', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-source-control', title: 'Source control', url: 'https://github.com/pingdotgg/t3code/blob/main/docs/user/source-control.md', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-source-control-stable', title: 'Source control (v0.0.45)', url: 'https://github.com/pingdotgg/t3code/blob/v0.0.45/docs/user/source-control.md', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-mobile-notifications', title: 'Mobile notifications', url: 'https://github.com/pingdotgg/t3code/blob/main/docs/user/mobile-notifications.md', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-remote-access', title: 'Remote access', url: 'https://github.com/pingdotgg/t3code/blob/main/docs/user/remote-access.md', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-outside-agents', title: 'Outside agents', url: 'https://github.com/pingdotgg/t3code/blob/main/docs/user/outside-agents.md', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-welcome', title: 'Welcome wizard', url: 'https://github.com/pingdotgg/t3code/blob/main/docs/user/welcome-wizard.md', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-devices', title: 'Devices', url: 'https://github.com/pingdotgg/t3code/blob/main/docs/user/devices.md', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' },
		{ id: 't3-code-usage', title: 'Usage and limits', url: 'https://github.com/pingdotgg/t3code/blob/main/docs/user/usage.md', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-09' }
	]
};
