// Splash vs Bellows. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const BELLOWS: Comparison = {
	slug: 'bellows',
	name: 'Bellows',
	description: 'How Splash and Bellows compare on agents, permissions, platforms, pricing, worktrees and review, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Bellows are desktop apps for running coding agents side by side, each optionally in a git worktree. Bellows uses the Agent Client Protocol for most agents but other routes for Codex and Claude, and centers on shared permission rules, an audit trail and a paid Team plan. Splash, free and open source, uses ACP for every agent.',
	other: {
		name: 'Bellows',
		url: 'https://bellowsai.app',
		maker: 'Bellows',
		summary: 'A desktop app for Windows, macOS and Linux running Claude, Codex, Gemini CLI and other ACP agents under shared permission rules and a local audit trail; a paid Team plan extends them across a team.',
		cite: ['bellows-home', 'bellows-downloads']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop ACP client, plus a web console for teams and a browser view that guests of a shared session open', cite: ['bellows-home', 'bellows-console'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v1.19.0 (8 October 2026), first released 2 September 2026; Windows is tested end to end, and its legal terms are drafts', cite: ['bellows-changelog', 'bellows-v1-0-0', 'bellows-home', 'bellows-terms'] } },
				{ label: 'License', splash: S.license, other: { text: 'Business Source License 1.1 per its site, converting to Apache 2.0; the source is private, with no license file published', cite: ['bellows-downloads', 'bellows-terms', 'bellows-releases-repo'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Desktop app free; Team is $19 per person a month or $190 a year, with a 14-day trial. Providers bill model use', cite: ['bellows-home', 'bellows-terms'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'Windows 10 or later x64 (installer or Microsoft Store), macOS on Apple silicon and Intel, Linux as an AppImage or amd64 .deb', cite: ['bellows-downloads', 'bellows-ms-store', 'bellows-changelog', 'bellows-v1-19-0'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Electron, according to the build workflows in its public releases repository; the site names no framework', cite: ['bellows-appimage-test', 'bellows-build-unix'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude built in; Codex, Gemini CLI, Qwen Code and other ACP agents installed separately; Ollama and LM Studio models too', cite: ['bellows-home', 'bellows-side-by-side'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'ACP for Gemini CLI, Qwen Code and custom agents; Codex through its app-server protocol; Claude through the bundled Claude Agent SDK', cite: ['bellows-acp-guide', 'bellows-home', 'bellows-v1-0-0', 'bellows-changelog', 'bellows-build-unix'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Agents keep their own logins. Claude takes an Anthropic API key, a Settings provider or your launcher, not a Claude subscription', cite: ['bellows-home', 'bellows-changelog'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'None for the desktop app; the team console needs one, signed in with an emailed link and code', cite: ['bellows-console', 'bellows-terms'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'One card style for every agent, showing the exact change; calls pass your rules and enter a hash-linked audit trail', mark: 'yes', cite: ['bellows-home', 'bellows-changelog'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Agents keep their own MCP servers; the Agents & extensions panel covers them with skills and usage', mark: 'yes', cite: ['bellows-acp-guide', 'bellows-changelog'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'An optional git worktree per session, which you review or clean up afterwards; branch handling isn’t described', mark: 'yes', cite: ['bellows-home', 'bellows-side-by-side'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'None documented; Live view finds a dev server you started yourself and doesn’t launch one', mark: 'no', cite: ['bellows-preview-guide'] } },
				{ label: 'Built-in browser', hint: 'A web view inside the app', splash: S.browser, other: { text: 'Live view shows the project’s dev server or index.html next to the session, reloading when files change', mark: 'yes', cite: ['bellows-changelog', 'bellows-preview-guide'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Permission cards in each session; prompts can also be answered from a phone page, or on Team from a web console queue', mark: 'partial', cite: ['bellows-home', 'bellows-phone-guide', 'bellows-approve-anywhere'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'Alert me lets a waiting prompt buzz the phone page; desktop notifications aren’t described', mark: 'partial', cite: ['bellows-changelog'] } },
				{ label: 'Agents handing off work', hint: 'One agent passing a task to another', splash: S.handoff, other: { text: 'Continue with… hands the work to a different agent through a written handover; orchestrated parallel runs are planned, not shipped', mark: 'yes', cite: ['bellows-changelog', 'bellows-switch-guide', 'bellows-home', 'bellows-whats-new'] } },
				{
					label: 'Team collaboration',
					hint: 'Sharing sessions and rules with others',
					splash: { text: 'splash-server is a personal, single-user service, not a multi-user deployment', mark: 'no', cite: ['splash-server'] },
					other: { text: 'Session links to watch, suggest or type, free on your network; Team adds the relay, shared policy, audit export and budgets', mark: 'yes', cite: ['bellows-home'] }
				}
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'A read-only Review pane shows each edit as a diff, inline or side by side, marked Proposed, Applied or Not applied', mark: 'yes', cite: ['bellows-changelog', 'bellows-review-guide'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Not documented; GitHub hosts its downloads, and no pull request, issue or CI features are described', mark: 'unknown', cite: ['bellows-privacy', 'bellows-releases-repo'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Guests join shared sessions in a browser, and prompts can be answered by phone; beyond your own network both need Team', mark: 'partial', cite: ['bellows-home', 'bellows-phone-guide', 'bellows-approve-anywhere'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Windows and the Linux AppImage update themselves after a signature check, Store copies through the Store; Macs install updates by hand', mark: 'partial', cite: ['bellows-downloads', 'bellows-smoke-test'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Sessions started outside the app', splash: S.history, other: { text: 'Not documented; Bellows records sessions itself, and Hand over moves one to a teammate as a file', mark: 'unknown', cite: ['bellows-changelog', 'bellows-whats-new'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'History and transcript search include every agent’s sessions, labeled by agent; sessions are cleared after 180 days', mark: 'yes', cite: ['bellows-changelog'] } },
				{ label: 'Fork a conversation', splash: S.fork, other: { text: 'Fork or resume past sessions, with file rewind in Claude sessions; other agents’ sessions can be read back but not resumed', mark: 'partial', cite: ['bellows-home', 'bellows-changelog', 'bellows-undo-guide'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Bellows talks ACP with Gemini CLI, Qwen Code and custom agents, drives Codex through its <code>app-server</code> protocol so Codex asks before running commands or editing, and runs Claude on a bundled Claude Agent SDK. Splash uses the <strong>Agent Client Protocol</strong> for every agent, natively or through an adapter, and leaves installing and signing in to agents to you.',
			cite: ['bellows-acp-guide', 'bellows-home', 'bellows-v1-0-0', 'bellows-build-unix', 'splash-registry', 'acp', 'splash-agents']
		},
		{
			title: 'Rules, audit and teams',
			text: 'Bellows puts every tool call through permission rules and into a hash-linked audit trail, which its maker frames as evidence rather than enforcement. The paid Team plan publishes one policy to every machine, with budgets, fleet management and sharing across networks. Splash shows permission requests in the transcript, keeps pending ones in <strong>Needs attention</strong>, and its server serves one user.',
			cite: ['bellows-home', 'bellows-changelog', 'splash-features', 'splash-server']
		},
		{
			title: 'Price and license',
			text: 'The Bellows desktop app is free, and its Team plan costs $19 per person a month. Its site states a Business Source License 1.1 that converts to Apache 2.0, but the source is private. Splash is free and MIT-licensed, with its source on GitHub, and has no paid plan or accounts.',
			cite: ['bellows-home', 'bellows-terms', 'bellows-downloads', 'bellows-releases-repo', 'splash-license', 'splash-download', 'splash-build']
		},
		{
			title: 'Where agents run',
			text: 'Both run agents on your own computer, with no cloud execution; Bellows sessions stop when the app closes. Bellows reaches other devices through browser links for guests and a phone page for approvals. Splash can also run as <code>splash-server</code> on the machine holding your code, opened in a browser over SSH, where agents keep running if the tunnel drops.',
			cite: ['bellows-conductor', 'bellows-home', 'bellows-phone-guide', 'splash-readme', 'splash-server']
		},
		{
			title: 'Around the session',
			text: 'Bellows adds Live view of a running dev server, an optional formatter run after each turn, project memory and rules files every agent reads, and <strong>Keep as a tool</strong>, which turns a finished job into a small sandboxed app. Splash centers on the conversation: a Needs attention queue, a review screen, transcript search and importing sessions agents started elsewhere.',
			cite: ['bellows-changelog', 'bellows-home', 'splash-features', 'splash-history']
		}
	],
	fit: {
		splash: [
			'You want a free, MIT-licensed app whose source is public and that needs no account.',
			'You want every agent driven over the Agent Client Protocol, with Copilot, OpenCode, Goose and others alongside Claude Code and Codex.',
			'You want to import conversations your agents started outside the app and search them with the rest.',
			'You want a GitHub view of issues, pull requests and Actions runs, or the whole app on your own server over SSH.'
		],
		other: [
			'You want one set of permission rules and a tamper-evident audit trail for every agent, including Codex and local models.',
			'You want to share a live session with a colleague who watches, suggests or types from a browser.',
			'You want a team plan that publishes one policy to every machine, with budgets, fleet management and approvals from a phone.',
			'You want to hand a task from one agent to another, preview your app beside the session, or keep a finished job as a reusable tool.'
		]
	},
	sources: [
		{ id: 'bellows-home', title: 'The desktop app for every coding agent (ACP client)', url: 'https://bellowsai.app/', publisher: 'Bellows', checked: '2026-10-10' },
		{ id: 'bellows-downloads', title: 'Download Bellows', url: 'https://bellowsai.app/downloads', publisher: 'Bellows', checked: '2026-10-10' },
		{ id: 'bellows-changelog', title: 'Changelog', url: 'https://bellowsai.app/changelog', publisher: 'Bellows', checked: '2026-10-10' },
		{ id: 'bellows-whats-new', title: 'What’s new', url: 'https://bellowsai.app/whats-new', publisher: 'Bellows', checked: '2026-10-10' },
		{ id: 'bellows-terms', title: 'Terms of service', url: 'https://bellowsai.app/legal/terms', publisher: 'Bellows', checked: '2026-10-10' },
		{ id: 'bellows-privacy', title: 'Privacy policy', url: 'https://bellowsai.app/legal/privacy', publisher: 'Bellows', checked: '2026-10-10' },
		{ id: 'bellows-console', title: 'Console (team workspace sign-in)', url: 'https://bellowsai.app/console', publisher: 'Bellows', checked: '2026-10-10' },
		{ id: 'bellows-conductor', title: 'A Conductor alternative for Windows and Linux', url: 'https://bellowsai.app/compare/conductor', publisher: 'Bellows', checked: '2026-10-10' },
		{ id: 'bellows-acp-guide', title: 'An Agent Client Protocol (ACP) client for Windows, Mac and Linux', url: 'https://bellowsai.app/guides/acp-client-for-windows-mac-and-linux', publisher: 'Bellows', checked: '2026-10-10' },
		{ id: 'bellows-side-by-side', title: 'Run Codex, Gemini CLI and Claude side by side', url: 'https://bellowsai.app/guides/run-several-coding-agents-side-by-side', publisher: 'Bellows', checked: '2026-10-10' },
		{ id: 'bellows-switch-guide', title: 'Switch coding agents mid-task without losing the thread', url: 'https://bellowsai.app/guides/switch-coding-agents-mid-task', publisher: 'Bellows', checked: '2026-10-10' },
		{ id: 'bellows-review-guide', title: 'Review a coding agent’s edits live, as a diff, while it works', url: 'https://bellowsai.app/guides/review-coding-agent-edits-live', publisher: 'Bellows', checked: '2026-10-10' },
		{ id: 'bellows-undo-guide', title: 'Undo a coding agent’s file changes back to an earlier message', url: 'https://bellowsai.app/guides/undo-a-coding-agent-file-changes', publisher: 'Bellows', checked: '2026-10-10' },
		{ id: 'bellows-preview-guide', title: 'See what your coding agent is building, live, beside the session', url: 'https://bellowsai.app/guides/preview-what-your-coding-agent-builds', publisher: 'Bellows', checked: '2026-10-10' },
		{ id: 'bellows-phone-guide', title: 'Approve a coding agent’s permission prompts from your phone', url: 'https://bellowsai.app/guides/approve-coding-agent-permissions-from-your-phone', publisher: 'Bellows', checked: '2026-10-10' },
		{ id: 'bellows-approve-anywhere', title: 'Approve your coding agent’s prompts from anywhere: phone or browser', url: 'https://bellowsai.app/guides/approve-coding-agent-prompts-from-anywhere', publisher: 'Bellows', checked: '2026-10-10' },
		{ id: 'bellows-ms-store', title: 'Bellows: free download and install on Windows', url: 'https://apps.microsoft.com/detail/9p4gh3lq6n0k', publisher: 'Microsoft Store', checked: '2026-10-10' },
		{ id: 'bellows-releases-repo', title: 'bellowsai/bellows-releases', url: 'https://github.com/bellowsai/bellows-releases', publisher: 'bellowsai/bellows-releases on GitHub', checked: '2026-10-10' },
		{ id: 'bellows-v1-0-0', title: 'Bellows 1.0.0', url: 'https://github.com/bellowsai/bellows-releases/releases/tag/v1.0.0', publisher: 'bellowsai/bellows-releases on GitHub', checked: '2026-10-10' },
		{ id: 'bellows-v1-19-0', title: 'Bellows 1.19.0', url: 'https://github.com/bellowsai/bellows-releases/releases/tag/v1.19.0', publisher: 'bellowsai/bellows-releases on GitHub', checked: '2026-10-10' },
		{ id: 'bellows-build-unix', title: '.github/workflows/build-unix.yml', url: 'https://github.com/bellowsai/bellows-releases/blob/main/.github/workflows/build-unix.yml', publisher: 'bellowsai/bellows-releases on GitHub', checked: '2026-10-10' },
		{ id: 'bellows-appimage-test', title: '.github/workflows/appimage-test.yml', url: 'https://github.com/bellowsai/bellows-releases/blob/main/.github/workflows/appimage-test.yml', publisher: 'bellowsai/bellows-releases on GitHub', checked: '2026-10-10' },
		{ id: 'bellows-smoke-test', title: '.github/workflows/smoke-test.yml', url: 'https://github.com/bellowsai/bellows-releases/blob/main/.github/workflows/smoke-test.yml', publisher: 'bellowsai/bellows-releases on GitHub', checked: '2026-10-10' }
	]
};
