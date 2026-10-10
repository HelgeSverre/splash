// Splash vs ORG-2. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const ORG_2: Comparison = {
	slug: 'org-2',
	name: 'ORG-2',
	description: 'How Splash and ORG-2 compare on agents, platforms, pricing, worktrees, review and team sync, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and ORG-2 are open-source desktop apps for running coding agents. ORG-2, built on Rust and Tauri, has its own agent harness, launches 20+ agent CLIs, records every session for replay and offers optional team sync through ORG-2 Cloud. Splash, a Rust app on the Elyra framework, connects to every agent over the Agent Client Protocol.',
	other: {
		name: 'ORG-2',
		url: 'https://www.org2.ai/',
		maker: 'ORG2 AI',
		summary: 'A Rust and Tauri desktop app that runs coding agents from its own harness or 20+ agent CLIs and keeps a replayable record of each session; optional ORG-2 Cloud adds team sync.',
		cite: ['org-2-readme', 'org-2-home', 'org-2-install', 'org-2-cloud']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Tauri desktop app with built-in Rust agents that also launches 20+ agent CLIs; optional ORG-2 Cloud syncs team sessions', cite: ['org-2-readme', 'org-2-install', 'org-2-cloud'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v2.0.10 (9 October 2026), with frequent releases since v2.0.2 on 14 September; self-hosted team sync is WIP, remote daemons beta', cite: ['org-2-release-2-0-10', 'org-2-release-2-0-2', 'org-2-readme', 'org-2-runtimes'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (AGPL-3.0-or-later) as open core; ORG-2 Cloud is a separate managed backend. Contributions need a signed CLA', cite: ['org-2-readme', 'org-2-docs'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free on your own keys. ORG-2 Cloud: free for 3 members; Pro $8, Team $15 per seat a month; Enterprise via sales', cite: ['org-2-home', 'org-2-cloud', 'org-2-enterprise'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS on Apple silicon (no Intel build), Windows x64, and Linux x64 as AppImage or .deb', cite: ['org-2-install', 'org-2-troubleshooting', 'org-2-download', 'org-2-release-2-0-10'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Built-in Rust agents plus 20+ CLIs; the docs list eight it installs, signs in and supervises, such as Claude Code and Codex', cite: ['org-2-readme', 'org-2-agents'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Built-in agents call model APIs in-process; supervised CLIs stream JSON, use ACP or codex app-server; others run in a terminal pane', cite: ['org-2-agents', 'org-2-transport-acp', 'org-2-session-rs', 'org-2-tui-bridge'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Your keys for 15 providers, local models (Ollama, LM Studio) or existing CLI subscriptions; ORG-2 resells no inference', cite: ['org-2-api-keys'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'Not for local use or self-hosted Supabase sync; an ORG-2 account, signed in by email link, unlocks ORG-2 Cloud and marketplace features', cite: ['org-2-install', 'org-2-quickstart', 'org-2-cloud'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Its own agents ask with Allow, Deny or Always Allow prompts that expire after five minutes; CLI agents launch pre-approved by default', mark: 'partial', cite: ['org-2-agents', 'org-2-launch-profiles'] } },
				{ label: 'Model and mode pickers', splash: S.models, other: { text: 'A per-session model and effort picker; Build, Plan and Ask modes remove tools from its own agents and become prompt guidance for CLIs', mark: 'yes', cite: ['org-2-agents', 'org-2-sessions'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'For its own agents: stdio, SSE or streamable HTTP servers per user or repo, importable from Cursor, Claude and VS Code configs', mark: 'yes', cite: ['org-2-mcp'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Optional git worktree per session on an agent/<session-id> branch, eight per repo by default; no OS-level sandbox', mark: 'yes', cite: ['org-2-sessions', 'org-2-projects', 'org-2-security'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Turns waiting on you show as awaiting_user and in a Blocking board column; OS notifications and the Dock badge start off', mark: 'yes', cite: ['org-2-sessions', 'org-2-work-items', 'org-2-scheduling'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'An ADE Manager meta-agent starts, watches and coordinates other sessions; Agent Teams put agents under a coordinator', mark: 'yes', cite: ['org-2-harness', 'org-2-agents'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Routines start sessions or work items on a UTC cron or one-time schedule while the app is running', mark: 'yes', cite: ['org-2-scheduling'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'A native WebKit browser; Design Mode sends a picked element’s page context to the agent. Agents drive a browser through a sidecar downloaded in Settings', mark: 'yes', cite: ['org-2-readme', 'org-2-tools', 'org-2-install'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Unified or split diffs per turn, session or all uncommitted changes; Keep and Undo All act on edit snapshots, not hunks', mark: 'yes', cite: ['org-2-tools', 'org-2-sessions'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'A CodeMirror 6 editor with git blame and language-server diagnostics (28 servers defined), plus a file explorer, source control and a database panel', mark: 'yes', cite: ['org-2-tools', 'org-2-sessions'] } },
				{ label: 'Team collaboration', hint: 'Sharing sessions with teammates', splash: { text: 'splash-server is a personal, single-user service, not a multi-user deployment', mark: 'no', cite: ['splash-server'] }, other: { text: 'Sessions sync over ORG-2 Cloud or self-hosted Supabase (WIP); share links and comments on session steps need ORG-2 Cloud', mark: 'yes', cite: ['org-2-cloud', 'org-2-collaboration', 'org-2-readme'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Agent work items open a PR by default, or from a Create Pull Request button; merging and CI checks aren’t documented', mark: 'yes', cite: ['org-2-projects'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'Built-in work items (Overview, List, Kanban), Linear and GitHub Issues browsing, and two-way sync with Linear or GitHub; Jira isn’t documented', mark: 'yes', cite: ['org-2-projects', 'org-2-changelog'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Beta: with permission, sessions can run on a headless device or a teammate’s idle machine. ORG-2 Cloud syncs sessions but runs none', mark: 'partial', cite: ['org-2-runtimes', 'org-2-sessions'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'v2.0.2 added phone pairing to browse sessions; a repo doc from 8 September 2026 calls the iOS app not ready for release', mark: 'partial', cite: ['org-2-release-2-0-2', 'org-2-ios-readiness'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Updates itself; the v2.0.10 updater manifest covers macOS, Windows and Linux, though the install docs name macOS alone', mark: 'yes', cite: ['org-2-install', 'org-2-latest-json'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Sessions started outside the app', splash: S.history, other: { text: 'Imports Codex App, Claude Code, OpenCode, Windsurf, WorkBuddy and Cursor sessions to replay, not continue; mirrors a running Cursor composer', mark: 'yes', cite: ['org-2-agents'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'A full-text index (SQLite FTS5) covers session events, tool-call arguments included', mark: 'yes', cite: ['org-2-sessions', 'org-2-tools'] } },
				{ label: 'Fork a conversation', splash: S.fork, other: { text: 'A shared session can be forked to carry on the work; the Sessions doc lists no fork action, but Restore checkpoint rewinds to an earlier message', mark: 'partial', cite: ['org-2-collaboration', 'org-2-cloud', 'org-2-sessions'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'ORG-2 runs its own agents inside its Rust engine, calling model APIs directly. It drives eight CLIs headless, reading streaming JSON, <strong>ACP</strong> (Copilot, Kiro, OpenCode) or <code>codex app-server</code>, and runs other CLIs interactively in a terminal pane, tracked through hooks. Splash connects to every agent over the <strong>Agent Client Protocol</strong>, natively or through an adapter.',
			cite: ['org-2-agents', 'org-2-transport-acp', 'org-2-session-rs', 'org-2-tui-bridge', 'org-2-cli-terminal', 'splash-registry', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'Both run agents on your computer by default. ORG-2 Cloud syncs and replays sessions but does not run them, and the app’s Cloud running location is disabled; a beta <strong>network of daemons</strong> can place a session on a teammate’s idle machine. Splash runs agents locally, or under <code>splash-server</code> on a machine you reach from a browser over SSH.',
			cite: ['org-2-sessions', 'org-2-cloud', 'org-2-runtimes', 'splash-readme', 'splash-server']
		},
		{
			title: 'Price, license and accounts',
			text: 'ORG-2’s desktop app is free, AGPL-3.0-or-later and needs no account for local use; contributors sign a CLA. ORG-2 Cloud adds team sync: free for three members and one repo, Pro at $8 and Team at $15 per seat a month, Enterprise through sales. Splash is free, MIT-licensed and has no accounts.',
			cite: ['org-2-home', 'org-2-readme', 'org-2-docs', 'org-2-install', 'org-2-cloud', 'org-2-enterprise', 'splash-license', 'splash-download', 'splash-build']
		},
		{
			title: 'Around the session',
			text: 'ORG-2 is built as a record of agent work: replay with scrubbing, <strong>Agent Blame</strong> tying files and commits to the sessions behind them, checkpoint rewind, work items that agents turn into pull requests, scheduled routines and a coordinating meta-agent. Splash centers on the conversation: a Needs attention queue, a review screen, transcript search and GitHub triage across repositories.',
			cite: ['org-2-replay', 'org-2-sessions', 'org-2-projects', 'org-2-scheduling', 'org-2-harness', 'splash-features', 'splash-github']
		},
		{
			title: 'Platforms and updates',
			text: 'ORG-2 ships builds for macOS on Apple silicon, Windows x64 and Linux x64 (AppImage and .deb), though two docs pages still say no Linux build is published; its v2.0.10 updater manifest covers all three. Splash builds for macOS 14+ on Apple silicon and Intel, Windows 11 x64, Ubuntu 24.04 x64 and a headless server, and does not update itself.',
			cite: ['org-2-install', 'org-2-release-2-0-10', 'org-2-download', 'org-2-docs', 'org-2-troubleshooting', 'org-2-latest-json', 'splash-install', 'splash-about']
		}
	],
	fit: {
		splash: [
			'You want an MIT-licensed app with no accounts or paid tiers.',
			'You use an Intel Mac, or want to run sessions on your own server and open them in a browser over SSH.',
			'You want every agent driven over the Agent Client Protocol, with permission requests gathered in one Needs attention queue.',
			'You want a GitHub triage view of issues, pull requests and Actions runs across many repositories.'
		],
		other: [
			'You want your team’s agent sessions synced, replayed and commented on, with Agent Blame tying files and commits to the sessions behind them.',
			'You want built-in agents on your own API keys or local models, next to 20+ agent CLIs.',
			'You want work items on a Kanban board that agents turn into pull requests, synced with Linear or GitHub.',
			'You want scheduled routines, a coordinating meta-agent and a WebKit browser with Design Mode in one app.'
		]
	},
	sources: [
		{ id: 'org-2-home', title: 'The system of record for how teams build with agents', url: 'https://www.org2.ai/', publisher: 'ORG2 AI', checked: '2026-10-10' },
		{ id: 'org-2-harness', title: 'Harness', url: 'https://www.org2.ai/product/harness', publisher: 'ORG2 AI', checked: '2026-10-10' },
		{ id: 'org-2-runtimes', title: 'Runtimes', url: 'https://www.org2.ai/product/runtimes', publisher: 'ORG2 AI', checked: '2026-10-10' },
		{ id: 'org-2-work-items', title: 'Work items', url: 'https://www.org2.ai/product/work-items', publisher: 'ORG2 AI', checked: '2026-10-10' },
		{ id: 'org-2-download', title: 'Download', url: 'https://www.org2.ai/download', publisher: 'ORG2 AI', checked: '2026-10-10' },
		{ id: 'org-2-enterprise', title: 'Enterprise', url: 'https://www.org2.ai/enterprise', publisher: 'ORG2 AI', checked: '2026-10-10' },
		{ id: 'org-2-docs', title: 'Introduction', url: 'https://www.org2.ai/docs', publisher: 'ORG2 AI', checked: '2026-10-10' },
		{ id: 'org-2-install', title: 'Install ORG-2', url: 'https://www.org2.ai/docs/install', publisher: 'ORG2 AI', checked: '2026-10-10' },
		{ id: 'org-2-quickstart', title: 'Quickstart', url: 'https://www.org2.ai/docs/quickstart', publisher: 'ORG2 AI', checked: '2026-10-10' },
		{ id: 'org-2-troubleshooting', title: 'Troubleshooting', url: 'https://www.org2.ai/docs/troubleshooting', publisher: 'ORG2 AI', checked: '2026-10-10' },
		{ id: 'org-2-agents', title: 'Agents', url: 'https://www.org2.ai/docs/agents', publisher: 'ORG2 AI', checked: '2026-10-10' },
		{ id: 'org-2-api-keys', title: 'API keys and model accounts', url: 'https://www.org2.ai/docs/api-keys', publisher: 'ORG2 AI', checked: '2026-10-10' },
		{ id: 'org-2-sessions', title: 'Sessions', url: 'https://www.org2.ai/docs/sessions', publisher: 'ORG2 AI', checked: '2026-10-10' },
		{ id: 'org-2-projects', title: 'Projects, repositories, and work items', url: 'https://www.org2.ai/docs/projects', publisher: 'ORG2 AI', checked: '2026-10-10' },
		{ id: 'org-2-tools', title: 'Tools', url: 'https://www.org2.ai/docs/tools', publisher: 'ORG2 AI', checked: '2026-10-10' },
		{ id: 'org-2-mcp', title: 'MCP servers', url: 'https://www.org2.ai/docs/mcp', publisher: 'ORG2 AI', checked: '2026-10-10' },
		{ id: 'org-2-security', title: 'Security and privacy', url: 'https://www.org2.ai/docs/security', publisher: 'ORG2 AI', checked: '2026-10-10' },
		{ id: 'org-2-scheduling', title: 'Scheduling and unattended work', url: 'https://www.org2.ai/docs/scheduling', publisher: 'ORG2 AI', checked: '2026-10-10' },
		{ id: 'org-2-collaboration', title: 'Collaboration', url: 'https://www.org2.ai/docs/collaboration', publisher: 'ORG2 AI', checked: '2026-10-10' },
		{ id: 'org-2-replay', title: 'Replay and Agent Blame', url: 'https://www.org2.ai/docs/replay', publisher: 'ORG2 AI', checked: '2026-10-10' },
		{ id: 'org-2-cloud', title: 'Cloud and sync', url: 'https://www.org2.ai/docs/cloud', publisher: 'ORG2 AI', checked: '2026-10-10' },
		{ id: 'org-2-readme', title: 'README', url: 'https://github.com/org2AI/ORG2', publisher: 'org2AI/ORG2 on GitHub', checked: '2026-10-10' },
		{ id: 'org-2-changelog', title: 'Changelog (repo wiki)', url: 'https://github.com/org2AI/ORG2/blob/develop/docs/contributing/wiki/Changelog.md', publisher: 'org2AI/ORG2 on GitHub', checked: '2026-10-10' },
		{ id: 'org-2-release-2-0-10', title: 'Release v2.0.10', url: 'https://github.com/org2AI/ORG2/releases/tag/v2.0.10', publisher: 'org2AI/ORG2 on GitHub', checked: '2026-10-10' },
		{ id: 'org-2-release-2-0-2', title: 'Release v2.0.2', url: 'https://github.com/org2AI/ORG2/releases/tag/v2.0.2', publisher: 'org2AI/ORG2 on GitHub', checked: '2026-10-10' },
		{ id: 'org-2-latest-json', title: 'v2.0.10 updater manifest (latest.json)', url: 'https://github.com/org2AI/ORG2/releases/download/v2.0.10/latest.json', publisher: 'org2AI/ORG2 on GitHub', checked: '2026-10-10' },
		{ id: 'org-2-ios-readiness', title: 'ORG2 Remote First-Release Readiness', url: 'https://github.com/org2AI/ORG2/blob/develop/docs/releases/ios-launch-readiness.md', publisher: 'org2AI/ORG2 on GitHub', checked: '2026-10-10' },
		{ id: 'org-2-transport-acp', title: 'src-tauri/src/agent_sessions/cli/session_runner/session/transport_acp.rs', url: 'https://github.com/org2AI/ORG2/blob/develop/src-tauri/src/agent_sessions/cli/session_runner/session/transport_acp.rs', publisher: 'org2AI/ORG2 on GitHub', checked: '2026-10-10' },
		{ id: 'org-2-session-rs', title: 'src-tauri/src/agent_sessions/cli/session_runner/session.rs (v2.0.10)', url: 'https://github.com/org2AI/ORG2/blob/v2.0.10/src-tauri/src/agent_sessions/cli/session_runner/session.rs', publisher: 'org2AI/ORG2 on GitHub', checked: '2026-10-10' },
		{ id: 'org-2-launch-profiles', title: 'src-tauri/src/agent_sessions/cli/session_runner/launch_profiles.rs', url: 'https://github.com/org2AI/ORG2/blob/develop/src-tauri/src/agent_sessions/cli/session_runner/launch_profiles.rs', publisher: 'org2AI/ORG2 on GitHub', checked: '2026-10-10' },
		{ id: 'org-2-tui-bridge', title: 'src-tauri/src/agent_sessions/cli/tui_bridge.rs', url: 'https://github.com/org2AI/ORG2/blob/develop/src-tauri/src/agent_sessions/cli/tui_bridge.rs', publisher: 'org2AI/ORG2 on GitHub', checked: '2026-10-10' },
		{ id: 'org-2-cli-terminal', title: 'src/api/tauri/agent/cliTerminalSession.ts', url: 'https://github.com/org2AI/ORG2/blob/develop/src/api/tauri/agent/cliTerminalSession.ts', publisher: 'org2AI/ORG2 on GitHub', checked: '2026-10-10' }
	]
};
