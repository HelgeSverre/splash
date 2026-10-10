// Splash vs Happier. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const HAPPIER: Comparison = {
	slug: 'happier',
	name: 'Happier',
	description: 'How Splash and Happier compare on agents, platforms, pricing, worktrees, phone access and remote machines, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Happier are free, MIT-licensed apps for coding agents running on your own machines. Happier pairs a CLI that starts each vendor’s agent with iOS, Android, web and desktop apps that reach it through an end-to-end encrypted relay. Splash is a desktop app, or a server opened over SSH, that drives agents over the Agent Client Protocol.',
	other: {
		name: 'Happier',
		url: 'https://happier.dev',
		maker: 'Happier',
		summary: 'A control layer for coding agents: a CLI starts Claude Code, Codex and other agent CLIs on your computers, and iOS, Android, web and desktop apps drive them through an encrypted relay.',
		cite: ['happier-home', 'happier-agents-site']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'iOS, Android, web and Tauri desktop apps on one Expo codebase, plus a CLI and daemon that run your agents', cite: ['happier-home', 'happier-updates', 'happier-llms-full', 'happier-repo'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'CLI v0.2.16 and desktop v0.2.17, both 9 October 2026; Claude, Codex and OpenCode are rated Stable, other agents Experimental', cite: ['happier-cli-release', 'happier-desktop-stable', 'happier-capabilities'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (MIT) for everything: CLI, phone, web and desktop apps, and relay server', cite: ['happier-license', 'happier-home'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free, with no seats, trials or feature gates; managed Happier Voice has quota and subscription rules but no published price', cite: ['happier-home', 'happier-enterprise', 'happier-voice'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon, Intel), Windows x64 and Linux x64 desktop apps; iOS 16+, Android and web; CLI also on arm64 Linux', cite: ['happier-download', 'happier-desktop-release', 'happier-app-store', 'happier-get-apps', 'happier-cli-release'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: '13 built in, including Claude Code, Codex, OpenCode, Cursor, Gemini and Copilot; docs list 18 with experimental ones and Custom ACP', cite: ['happier-home', 'happier-agents-site', 'happier-docs-agents'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Starts each vendor’s CLI: Claude via the Agent SDK, Codex via app-server, OpenCode via its server, the rest over ACP', cite: ['happier-agents-site', 'happier-claude', 'happier-llms-full', 'happier-opencode', 'happier-cursor'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Reuses each CLI’s login or subscription, or API keys and custom endpoints; providers bill model use, and Happier sells none', cite: ['happier-home', 'happier-app-store'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'Yes: sign in on a relay, Happier Cloud or your own; accounts default to device keys, recovered with a secret key', cite: ['happier-home', 'happier-get-apps', 'happier-self-host-auth', 'happier-encryption'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Four modes, Default to YOLO, set per session; provider support varies. Push alerts let you Allow or Deny', mark: 'yes', cite: ['happier-home', 'happier-app-store'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Servers defined once reach every agent on every machine, even agents without MCP; Happier also serves its own actions over MCP', mark: 'yes', cite: ['happier-home', 'happier-repo'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Opt-in git worktree per session on its own branch, from any local or remote branch; sandboxing is left to each agent', mark: 'yes', cite: ['happier-home', 'happier-permissions'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'Shell tab on the agent’s machine; on macOS and Linux, Claude Code and Codex runs can be shared with their TUI', mark: 'yes', cite: ['happier-terminal', 'happier-home', 'happier-claude', 'happier-llms-full'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'A Needs attention group heads the session list for decisions waiting on you; running sessions are grouped under Working', mark: 'yes', cite: ['happier-home'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'Push alerts for finished turns, permission requests and agent questions; webhooks can send the same events to your endpoint', mark: 'yes', cite: ['happier-home', 'happier-notifications'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'A session can send review, planning or delegated tasks to another agent and read back the results, or change agent mid-session', mark: 'yes', cite: ['happier-repo'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Sessions can run on a schedule, for example to watch pull requests, follow issues or repeat a task', mark: 'yes', cite: ['happier-home'] } },
				{ label: 'Team collaboration', hint: 'Sharing a session with other people', splash: { text: 'splash-server is a personal, single-user service, not a multi-user deployment', mark: 'no', cite: ['splash-server'] }, other: { text: 'Share a session by inviting people as viewers or editors, or through a public link that is read-only', mark: 'yes', cite: ['happier-repo'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Mark lines in files or diffs, pick which notes to send, and return them to the same or a new session', mark: 'yes', cite: ['happier-home', 'happier-review-comments'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Publishes a branch and opens or reuses a PR via a connected account or gh; experimental and off by default', mark: 'partial', cite: ['happier-pull-requests', 'happier-git'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Its fullest Git host: connected-account or gh access, repository publishing, PR checkout into worktrees; merging and CI checks aren’t documented', mark: 'partial', cite: ['happier-pull-requests', 'happier-git'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Pick which connected computer, VPS or dev box runs each session; add machines over SSH. No agent runs in Happier’s cloud', mark: 'yes', cite: ['happier-home', 'happier-repo', 'happier-google-play'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'Native iOS 16+ and Android apps, in sync with desktop and web, with answerable push alerts and an optional voice mode', mark: 'yes', cite: ['happier-home', 'happier-app-store', 'happier-google-play', 'happier-voice'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'The desktop app updates through Tauri’s updater and phone apps take over-the-air updates; stable, preview and dev channels', mark: 'yes', cite: ['happier-updates', 'happier-releases-docs'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Opens Claude Code, Codex and OpenCode sessions running on your machine, live; resumes past ones where the agent can list them', mark: 'yes', cite: ['happier-home', 'happier-continuing'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Opt-in semantic memory search across sessions, for you and your agents; summarising sessions spends tokens on your own credential', mark: 'yes', cite: ['happier-home'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Happier starts each vendor’s CLI as a subprocess and picks a transport per agent: the Claude Agent SDK (or an opt-in shared terminal), Codex’s <code>app-server</code>, OpenCode’s server API, and ACP for the rest, plus any ACP CLI as a <strong>Custom ACP</strong> backend. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, natively or through an adapter.',
			cite: ['happier-agents-site', 'happier-claude', 'happier-llms-full', 'happier-opencode', 'happier-home', 'splash-registry', 'acp']
		},
		{
			title: 'Where things run',
			text: 'Both run agents on machines you control. Happier’s apps reach them through a relay, <strong>Happier Cloud</strong> or your own, that stores session content end-to-end encrypted, and you sign in to it. Splash runs agents next to its desktop app, or under <code>splash-server</code> on a machine you reach over an SSH tunnel with a token, without accounts.',
			cite: ['happier-home', 'happier-privacy', 'happier-get-apps', 'splash-readme', 'splash-server', 'splash-build']
		},
		{
			title: 'Away from the computer',
			text: 'Happier is built for following agents away from their computer: iOS and Android apps, push alerts with Allow and Deny, moving a session to another machine (Claude and OpenCode; experimental for Codex), and waiting out a provider’s usage limit before resuming. Splash has no phone app; you use it on the desktop or in a browser over SSH.',
			cite: ['happier-home', 'happier-app-store', 'happier-usage-limits', 'splash-install', 'splash-server']
		},
		{
			title: 'Around the session',
			text: 'Happier’s tools reach across sessions and agents: scheduled runs, one agent handing review or delegated work to another, sharing a session with other people, MCP servers offered to every agent, and opt-in semantic memory search. Splash centers on the conversation: a Needs attention queue, a review screen, full-text transcript search, importing sessions started elsewhere, and a GitHub view across repositories.',
			cite: ['happier-home', 'happier-repo', 'splash-features', 'splash-history', 'splash-github']
		}
	],
	fit: {
		splash: [
			'You want an app with no account, on your desktop or as your own server over SSH.',
			'You want one Needs attention queue for permissions, failures and finished turns, kept across restarts.',
			'You want to import and search conversations agents list over ACP, including ones started elsewhere.',
			'You want a GitHub view of issues, pull requests and Actions runs across repositories.'
		],
		other: [
			'You want to follow and answer your agents from iOS, Android, the web or a desktop app.',
			'You want 13 built-in agents plus any ACP CLI, with MCP servers offered to all of them.',
			'You want scheduled sessions, agents handing work to other agents, and sessions shared with people.',
			'You want to choose which of your computers, VPSs or dev boxes runs each session.'
		]
	},
	sources: [
		{ id: 'happier-home', title: 'Open-source app for Claude Code, Codex & 11 more', url: 'https://happier.dev/', publisher: 'Happier', checked: '2026-10-10' },
		{ id: 'happier-agents-site', title: 'Every AI coding agent Happier runs', url: 'https://happier.dev/agents/', publisher: 'Happier', checked: '2026-10-10' },
		{ id: 'happier-terminal', title: 'Claude Code and Codex in your terminal, and in the app', url: 'https://happier.dev/features/terminal/', publisher: 'Happier', checked: '2026-10-10' },
		{ id: 'happier-usage-limits', title: 'Claude Code and Codex usage limits without losing work', url: 'https://happier.dev/features/usage-limits/', publisher: 'Happier', checked: '2026-10-10' },
		{ id: 'happier-enterprise', title: 'Self-hosted Happier for teams', url: 'https://happier.dev/enterprise/', publisher: 'Happier', checked: '2026-10-10' },
		{ id: 'happier-download', title: 'Download Happier', url: 'https://happier.dev/download/', publisher: 'Happier', checked: '2026-10-10' },
		{ id: 'happier-get-apps', title: 'Get the apps', url: 'https://docs.happier.dev/getting-started/get-the-apps', publisher: 'Happier', checked: '2026-10-10' },
		{ id: 'happier-releases-docs', title: 'Release channels', url: 'https://docs.happier.dev/releases', publisher: 'Happier', checked: '2026-10-10' },
		{ id: 'happier-updates', title: 'Updates', url: 'https://docs.happier.dev/releases/updates', publisher: 'Happier', checked: '2026-10-10' },
		{ id: 'happier-docs-agents', title: 'Coding agents', url: 'https://docs.happier.dev/agents', publisher: 'Happier', checked: '2026-10-10' },
		{ id: 'happier-capabilities', title: 'Agent capabilities', url: 'https://docs.happier.dev/agents/capabilities', publisher: 'Happier', checked: '2026-10-10' },
		{ id: 'happier-claude', title: 'Claude', url: 'https://docs.happier.dev/agents/claude', publisher: 'Happier', checked: '2026-10-10' },
		{ id: 'happier-opencode', title: 'OpenCode', url: 'https://docs.happier.dev/agents/opencode', publisher: 'Happier', checked: '2026-10-10' },
		{ id: 'happier-cursor', title: 'Cursor', url: 'https://docs.happier.dev/agents/cursor', publisher: 'Happier', checked: '2026-10-10' },
		{ id: 'happier-llms-full', title: 'Happier Docs full text (llms-full.txt)', url: 'https://docs.happier.dev/llms-full.txt', publisher: 'Happier', checked: '2026-10-10' },
		{ id: 'happier-permissions', title: 'Permissions', url: 'https://docs.happier.dev/sessions/permissions', publisher: 'Happier', checked: '2026-10-10' },
		{ id: 'happier-continuing', title: 'Continuing a session', url: 'https://docs.happier.dev/sessions/continuing-a-session', publisher: 'Happier', checked: '2026-10-10' },
		{ id: 'happier-review-comments', title: 'Review comments', url: 'https://docs.happier.dev/code/review-comments', publisher: 'Happier', checked: '2026-10-10' },
		{ id: 'happier-pull-requests', title: 'Pull requests', url: 'https://docs.happier.dev/code/pull-requests', publisher: 'Happier', checked: '2026-10-10' },
		{ id: 'happier-git', title: 'Git', url: 'https://docs.happier.dev/code/git', publisher: 'Happier', checked: '2026-10-10' },
		{ id: 'happier-notifications', title: 'Notifications', url: 'https://docs.happier.dev/extras/notifications-setup', publisher: 'Happier', checked: '2026-10-10' },
		{ id: 'happier-voice', title: 'Voice', url: 'https://docs.happier.dev/voice', publisher: 'Happier', checked: '2026-10-10' },
		{ id: 'happier-self-host-auth', title: 'Auth (self-hosting)', url: 'https://docs.happier.dev/self-hosting/auth', publisher: 'Happier', checked: '2026-10-10' },
		{ id: 'happier-encryption', title: 'Encryption model', url: 'https://docs.happier.dev/security/encryption', publisher: 'Happier', checked: '2026-10-10' },
		{ id: 'happier-privacy', title: 'Privacy Policy', url: 'https://docs.happier.dev/legal/privacy', publisher: 'Happier', checked: '2026-10-10' },
		{ id: 'happier-repo', title: 'happier-dev/happier', url: 'https://github.com/happier-dev/happier', publisher: 'happier-dev/happier on GitHub', checked: '2026-10-10' },
		{ id: 'happier-license', title: 'LICENCE', url: 'https://github.com/happier-dev/happier/blob/dev/LICENCE', publisher: 'happier-dev/happier on GitHub', checked: '2026-10-10' },
		{ id: 'happier-cli-release', title: 'Happier CLI v0.2.16', url: 'https://github.com/happier-dev/happier/releases/tag/cli-v0.2.16', publisher: 'happier-dev/happier on GitHub', checked: '2026-10-10' },
		{ id: 'happier-desktop-stable', title: 'Happier UI Desktop Stable', url: 'https://github.com/happier-dev/happier/releases/tag/ui-desktop-stable', publisher: 'happier-dev/happier on GitHub', checked: '2026-10-10' },
		{ id: 'happier-desktop-release', title: 'Happier UI Desktop v0.2.17', url: 'https://github.com/happier-dev/happier/releases/tag/ui-desktop-v0.2.17', publisher: 'happier-dev/happier on GitHub', checked: '2026-10-10' },
		{ id: 'happier-app-store', title: 'Happier - Remote Claude, Codex', url: 'https://apps.apple.com/us/app/happier-remote-claude-codex/id6758554297', publisher: 'Apple App Store', checked: '2026-10-10' },
		{ id: 'happier-google-play', title: 'Happier - Remote Claude, Codex', url: 'https://play.google.com/store/apps/details?id=dev.happier.app', publisher: 'Google Play', checked: '2026-10-10' }
	]
};
