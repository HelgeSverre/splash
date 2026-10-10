// Splash vs Scape. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const SCAPE: Comparison = {
	slug: 'scape',
	name: 'Scape',
	description: 'How Splash and Scape compare on agents, platforms, pricing, worktrees, review and remote use, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Scape both run several coding agents at once and can give each its own git worktree. Scape, a paid macOS app, runs each agent’s own command-line interface in a terminal, alongside an editor, dev servers and an orchestrator. Splash, a free, open-source desktop app for macOS, Windows and Ubuntu, drives agents over the Agent Client Protocol.',
	other: {
		name: 'Scape',
		url: 'https://www.scape.work/',
		maker: 'Scape Labs',
		summary: 'A paid macOS app for running many coding-agent CLIs in parallel, each in its own git worktree, with a terminal, code editor, dev servers, integrations and an orchestrator called Argus.',
		cite: ['scape-home', 'scape-what-is', 'scape-harnesses', 'scape-argus']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Native macOS app for running coding-agent CLIs side by side in git worktrees, with a terminal, editor and automations', cite: ['scape-privacy', 'scape-home', 'scape-what-is'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v1.137 (7 October 2026), the latest of 151 releases since March 2026; Apps, Flight Plans and the CLI are beta', cite: ['scape-v1-137', 'scape-changelog', 'scape-releases', 'scape-v1-134', 'scape-cli'] } },
				{ label: 'License', splash: S.license, other: { text: 'Proprietary; the terms forbid reverse engineering and redistribution. Its chat relay server is open source (Apache-2.0)', cite: ['scape-terms', 'scape-what-is', 'scape-chat-relay'] } },
				{ label: 'Price', splash: S.price, other: { text: '$9.99 once (one month of updates); Pro $9.99/month or $99/year; Supporter $19.99/month or $199/year. 7-day free trial', cite: ['scape-home', 'scape-terms'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 14 or later, from one DMG with no stated chip architecture; Linux and Windows are planned for 2027', cite: ['scape-home', 'scape-appcast', 'scape-v1-137', 'scape-what-is'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code, Codex, OpenCode, pi, omp, GitHub Copilot and Cursor; some pages still name only the first three', cite: ['scape-harnesses', 'scape-home', 'scape-spectator'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each agent’s own CLI in a SwiftTerm-based terminal; Scape adds its hooks, statusline script and MCP server to Claude Code', cite: ['scape-harnesses', 'scape-terminal', 'scape-bridge', 'scape-uninstall'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Each agent CLI’s own login and plan, with per-project account profiles for Claude Code, Codex and OpenCode', cite: ['scape-home', 'scape-privacy', 'scape-harnesses', 'scape-profiles'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'No Scape account; the trial needs no key, and a paid license key is checked online through Keygen', cite: ['scape-parallel', 'scape-home', 'scape-privacy', 'scape-terms'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Each agent’s own prompts in its terminal; optional Watchdogs answer them from your instructions, for Claude Code only', mark: 'yes', cite: ['scape-home', 'scape-watchdogs', 'scape-harnesses'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Scape’s MCP server offers 100+ tools; the Harnesses page says all seven agents get it, the MCP page says three', mark: 'yes', cite: ['scape-mcp-tools', 'scape-harnesses'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A git worktree per feature, inside the project’s .worktrees folder; Argus gives each child agent a fresh one', mark: 'yes', cite: ['scape-home', 'scape-v1-57', 'scape-argus'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Post-create bash hooks, global or per repo; dev servers get their own $PORT per worktree. Pages disagree on copying .env', mark: 'yes', cite: ['scape-worktree-hooks', 'scape-dev-servers'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Session cards show live agent state and flag sessions that need you; Copilot shows as unknown. Watchdogs escalate stuck sessions', mark: 'yes', cite: ['scape-notify', 'scape-v1-132', 'scape-harnesses', 'scape-watchdogs'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Sessions can message each other; Argus, on a subscription, runs up to 16 child agents in their own worktrees', mark: 'yes', cite: ['scape-inter-session', 'scape-argus'] } },
				{ label: 'Team collaboration', hint: 'Working with other people and their agents', splash: { text: 'splash-server is a personal, single-user service, not a multi-user deployment', mark: 'no', cite: ['splash-server'] }, other: { text: 'Encrypted Backchannels, Agent Rendezvous rooms with other people’s agents, Sharing and beta Flight Plans, on a subscription', mark: 'partial', cite: ['scape-docs', 'scape-backchannels', 'scape-sharing', 'scape-flight-plan', 'scape-v1-134', 'scape-terms'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'An embedded browser that agents drive through Scape’s tools: screenshots, accessibility trees, clicks and form filling', mark: 'yes', cite: ['scape-docs', 'scape-mcp-tools'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'The editor’s diff view, Diff Summary and Review PR tools, and a Codex reviewer via /scape-codex-review; line comments aren’t documented', mark: 'yes', cite: ['scape-code-editor', 'scape-toolkit', 'scape-adversarial'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'A Monaco code editor for 60+ languages, with a diff view against HEAD and a git history timeline with restore', mark: 'yes', cite: ['scape-code-editor'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'A built-in Create PR tool opens one from the current branch; a Merge button on session cards merges the branch', mark: 'yes', cite: ['scape-toolkit', 'scape-v1-111'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Pull request and issue connectors, read-only PR tools for agents and Open on GitHub; CI status isn’t documented', mark: 'yes', cite: ['scape-inboxes', 'scape-mcp-tools', 'scape-code-editor'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'Connectors for Jira, GitHub Issues, Linear, Notion, Slack, ServiceNow, Bugsnag, Datadog and custom JSON sources; items can start sessions', mark: 'yes', cite: ['scape-inboxes', 'scape-custom-integrations'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Saved SSH hosts with a terminal, SFTP files and remote Claude Code sessions; Claude’s Remote Control is opt-in per project', mark: 'partial', cite: ['scape-ssh', 'scape-harnesses', 'scape-privacy'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Downloads and installs updates in the background through Sparkle; the one-time purchase keeps the versions from its month', mark: 'yes', cite: ['scape-v1-58', 'scape-changelog', 'scape-home'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented; Scape’s own sessions can be resumed with all seven agents', mark: 'unknown', cite: ['scape-harnesses', 'scape-profiles'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Not documented; Search Everywhere and Find in Files cover files, notes, sessions and code', mark: 'unknown', cite: ['scape-docs'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Scape runs each of its seven agents as the agent’s own CLI in a terminal built on a SwiftTerm fork, tracks Claude Code through hook scripts, and has Watchdogs answer prompts with keystrokes. Its docs mention no ACP or vendor SDK. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, natively or through an adapter.',
			cite: ['scape-harnesses', 'scape-terminal', 'scape-bridge', 'scape-notify', 'scape-watchdogs', 'splash-registry', 'acp']
		},
		{
			title: 'Price, license and accounts',
			text: 'Scape is proprietary. $9.99 once buys the versions released over one month; Pro ($9.99 a month) and Supporter ($19.99 a month) are subscriptions. Argus needs one; Playbooks, Tables and Agent Rendezvous need one or a purchase month. The 7-day trial needs no account, and licenses are checked through Keygen. Splash is free, MIT-licensed and has no accounts.',
			cite: ['scape-terms', 'scape-home', 'scape-argus', 'scape-privacy', 'splash-license', 'splash-download', 'splash-build']
		},
		{
			title: 'Platforms and where agents run',
			text: 'Scape runs on macOS, with Linux and Windows planned for 2027. Agents work on the Mac or, for Claude Code, on SSH hosts; Claude’s Remote Control lets claude.ai or the Claude phone app drive a session. Splash runs on macOS, Windows and Ubuntu, or as <code>splash-server</code> on the machine with your code, used from a browser over SSH.',
			cite: ['scape-home', 'scape-what-is', 'scape-ssh', 'scape-harnesses', 'scape-privacy', 'splash-install', 'splash-server']
		},
		{
			title: 'Around the session',
			text: 'Scape surrounds each session with worktree hooks, dev servers on their own ports, a Monaco editor, a browser agents can drive, an MCP server with 100+ tools, Jira, Linear and Slack integrations, and the <strong>Argus</strong> orchestrator. Splash centers on the conversation: a rendered transcript, a <strong>Needs attention</strong> queue, review with feedback, transcript search and importing sessions begun elsewhere.',
			cite: ['scape-worktree-hooks', 'scape-dev-servers', 'scape-code-editor', 'scape-docs', 'scape-mcp-tools', 'scape-inboxes', 'scape-argus', 'splash-readme', 'splash-features', 'splash-history']
		}
	],
	fit: {
		splash: [
			'You want a free, MIT-licensed app with no license key.',
			'You work on Windows or Ubuntu as well as macOS, or want sessions on your own server, used from a browser.',
			'You want agents driven over the Agent Client Protocol, with messages, tool calls and diffs shown as a transcript.',
			'You want to import conversations your agents started elsewhere and search their text.'
		],
		other: [
			'You want each agent’s own terminal interface, with a code editor and an agent-driven browser beside it.',
			'You want an orchestrator that splits work across child agents, each in its own worktree.',
			'You want items from Jira, Linear, Slack and other tools passed directly to an agent.',
			'You want worktree setup hooks, dev servers on their own ports and an app that updates itself.'
		]
	},
	sources: [
		{ id: 'scape-home', title: 'Command unlimited agents without melting your brain', url: 'https://www.scape.work/', publisher: 'Scape Labs', checked: '2026-10-10' },
		{ id: 'scape-what-is', title: 'What is Scape?', url: 'https://www.scape.work/what-is-scape', publisher: 'Scape Labs', checked: '2026-10-10' },
		{ id: 'scape-parallel', title: 'Run agents in parallel across isolated worktrees', url: 'https://www.scape.work/parallel', publisher: 'Scape Labs', checked: '2026-10-10' },
		{ id: 'scape-adversarial', title: 'Automating adversarial reviews for Claude Code and Codex', url: 'https://www.scape.work/adversarial-reviews', publisher: 'Scape Labs', checked: '2026-10-10' },
		{ id: 'scape-privacy', title: 'Privacy Policy', url: 'https://www.scape.work/privacy', publisher: 'Scape Labs', checked: '2026-10-10' },
		{ id: 'scape-terms', title: 'Terms of Service', url: 'https://www.scape.work/terms', publisher: 'Scape Labs', checked: '2026-10-10' },
		{ id: 'scape-changelog', title: 'Changelog', url: 'https://www.scape.work/changelog', publisher: 'Scape Labs', checked: '2026-10-10' },
		{ id: 'scape-appcast', title: 'Sparkle appcast', url: 'https://www.scape.work/appcast.xml', publisher: 'Scape Labs', checked: '2026-10-10' },
		{ id: 'scape-docs', title: 'Docs', url: 'https://www.scape.work/docs', publisher: 'Scape Labs', checked: '2026-10-10' },
		{ id: 'scape-harnesses', title: 'Harnesses', url: 'https://www.scape.work/docs/harnesses', publisher: 'Scape Labs', checked: '2026-10-10' },
		{ id: 'scape-terminal', title: 'Terminal', url: 'https://www.scape.work/docs/terminal', publisher: 'Scape Labs', checked: '2026-10-10' },
		{ id: 'scape-code-editor', title: 'Code Editor', url: 'https://www.scape.work/docs/code-editor', publisher: 'Scape Labs', checked: '2026-10-10' },
		{ id: 'scape-profiles', title: 'Account Profiles', url: 'https://www.scape.work/docs/claude-profiles', publisher: 'Scape Labs', checked: '2026-10-10' },
		{ id: 'scape-spectator', title: 'Spectator Mode', url: 'https://www.scape.work/docs/spectator-mode', publisher: 'Scape Labs', checked: '2026-10-10' },
		{ id: 'scape-watchdogs', title: 'Watchdogs', url: 'https://www.scape.work/docs/watchdogs', publisher: 'Scape Labs', checked: '2026-10-10' },
		{ id: 'scape-argus', title: 'Argus', url: 'https://www.scape.work/docs/argus', publisher: 'Scape Labs', checked: '2026-10-10' },
		{ id: 'scape-inter-session', title: 'Inter-Session Messaging', url: 'https://www.scape.work/docs/inter-session-messaging', publisher: 'Scape Labs', checked: '2026-10-10' },
		{ id: 'scape-mcp-tools', title: 'MCP Tools', url: 'https://www.scape.work/docs/mcp-tools', publisher: 'Scape Labs', checked: '2026-10-10' },
		{ id: 'scape-worktree-hooks', title: 'Post-Create Worktree Hooks', url: 'https://www.scape.work/docs/worktree-hooks', publisher: 'Scape Labs', checked: '2026-10-10' },
		{ id: 'scape-dev-servers', title: 'Dev Servers', url: 'https://www.scape.work/docs/dev-servers', publisher: 'Scape Labs', checked: '2026-10-10' },
		{ id: 'scape-toolkit', title: 'Toolkit', url: 'https://www.scape.work/docs/toolkit', publisher: 'Scape Labs', checked: '2026-10-10' },
		{ id: 'scape-inboxes', title: 'Integrations', url: 'https://www.scape.work/docs/inboxes', publisher: 'Scape Labs', checked: '2026-10-10' },
		{ id: 'scape-custom-integrations', title: 'Custom Integrations', url: 'https://www.scape.work/docs/custom-integrations', publisher: 'Scape Labs', checked: '2026-10-10' },
		{ id: 'scape-backchannels', title: 'Backchannels', url: 'https://www.scape.work/docs/backchannels', publisher: 'Scape Labs', checked: '2026-10-10' },
		{ id: 'scape-sharing', title: 'Sharing', url: 'https://www.scape.work/docs/sharing', publisher: 'Scape Labs', checked: '2026-10-10' },
		{ id: 'scape-flight-plan', title: 'Flight Plan', url: 'https://www.scape.work/docs/flight-plan', publisher: 'Scape Labs', checked: '2026-10-10' },
		{ id: 'scape-ssh', title: 'SSH Sessions', url: 'https://www.scape.work/docs/ssh', publisher: 'Scape Labs', checked: '2026-10-10' },
		{ id: 'scape-cli', title: 'Scape CLI & URL Scheme', url: 'https://www.scape.work/docs/cli', publisher: 'Scape Labs', checked: '2026-10-10' },
		{ id: 'scape-uninstall', title: 'Uninstall', url: 'https://www.scape.work/docs/uninstall', publisher: 'Scape Labs', checked: '2026-10-10' },
		{ id: 'scape-releases', title: 'fliptables/scape-releases', url: 'https://github.com/fliptables/scape-releases', publisher: 'fliptables/scape-releases on GitHub', checked: '2026-10-10' },
		{ id: 'scape-bridge', title: 'scripts/bridge.sh', url: 'https://github.com/fliptables/scape-releases/blob/main/scripts/bridge.sh', publisher: 'fliptables/scape-releases on GitHub', checked: '2026-10-10' },
		{ id: 'scape-notify', title: 'scripts/notify.sh', url: 'https://github.com/fliptables/scape-releases/blob/main/scripts/notify.sh', publisher: 'fliptables/scape-releases on GitHub', checked: '2026-10-10' },
		{ id: 'scape-v1-137', title: 'Scape v1.137', url: 'https://github.com/fliptables/scape-releases/releases/tag/v1.137', publisher: 'fliptables/scape-releases on GitHub', checked: '2026-10-10' },
		{ id: 'scape-v1-134', title: 'Scape v1.134', url: 'https://github.com/fliptables/scape-releases/releases/tag/v1.134', publisher: 'fliptables/scape-releases on GitHub', checked: '2026-10-10' },
		{ id: 'scape-v1-132', title: 'Scape v1.132', url: 'https://github.com/fliptables/scape-releases/releases/tag/v1.132', publisher: 'fliptables/scape-releases on GitHub', checked: '2026-10-10' },
		{ id: 'scape-v1-111', title: 'Scape v1.111', url: 'https://github.com/fliptables/scape-releases/releases/tag/v1.111', publisher: 'fliptables/scape-releases on GitHub', checked: '2026-10-10' },
		{ id: 'scape-v1-58', title: 'Scape v1.58', url: 'https://github.com/fliptables/scape-releases/releases/tag/v1.58', publisher: 'fliptables/scape-releases on GitHub', checked: '2026-10-10' },
		{ id: 'scape-v1-57', title: 'Scape v1.57', url: 'https://github.com/fliptables/scape-releases/releases/tag/v1.57', publisher: 'fliptables/scape-releases on GitHub', checked: '2026-10-10' },
		{ id: 'scape-chat-relay', title: 'fliptables/scape-chat-relay', url: 'https://github.com/fliptables/scape-chat-relay', publisher: 'fliptables/scape-chat-relay on GitHub', checked: '2026-10-10' }
	]
};
