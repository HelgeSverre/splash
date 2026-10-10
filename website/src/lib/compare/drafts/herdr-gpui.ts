// Splash vs Herdr GPUI. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const HERDR_GPUI: Comparison = {
	slug: 'herdr-gpui',
	name: 'Herdr GPUI',
	description: 'How Splash and Herdr GPUI compare on agents, platforms, licensing, worktrees, review and remote hosts, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Herdr GPUI are both open-source desktop apps for running several coding agents at once. Herdr GPUI is a native client for a separately installed Herdr daemon, which runs each agent’s own CLI in a terminal pane and keeps it running when the app closes. Splash starts agents itself and drives them over the Agent Client Protocol.',
	other: {
		name: 'Herdr GPUI',
		url: 'https://github.com/penso/herdr-gpui',
		maker: 'Fabien Penso',
		summary: 'An independent Rust and GPUI desktop client for Herdr, a separately installed daemon that runs agent CLIs in terminal panes. It adds diff review, pull requests, browser tabs and several hosts in one window.',
		cite: ['herdr-gpui-repo', 'herdr-gpui-readme', 'herdr-gpui-herdr-home']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Native desktop client, built with Rust and GPUI, for a separately installed Herdr daemon; an independent project, not affiliated with Herdr', cite: ['herdr-gpui-readme', 'herdr-gpui-crate-readme'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v20261008.1 of 8 October 2026, one of 15 releases since 27 September; the Linux and Windows builds are experimental', cite: ['herdr-gpui-release', 'herdr-gpui-releases', 'herdr-gpui-readme'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (Apache-2.0); parts of its protocol crate are adapted from Herdr, also Apache-2.0', cite: ['herdr-gpui-license', 'herdr-gpui-notice'] } },
				{ label: 'Price', splash: S.price, other: { text: 'No price or paid plan is published; the app and the Herdr daemon are both Apache-2.0', cite: ['herdr-gpui-readme', 'herdr-gpui-herdr-home'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 14.2+ (Apple silicon and Intel); experimental Linux x86_64 and ARM64 (glibc 2.39+, Vulkan) and Windows x64 and ARM64', cite: ['herdr-gpui-readme', 'herdr-gpui-release'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'The 23 agents in Herdr’s docs, such as Claude Code, Codex, GitHub Copilot CLI and OpenCode; other CLIs run as plain terminals', cite: ['herdr-gpui-herdr-agents'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each agent’s own CLI in a Herdr daemon terminal pane; status is read from the screen or from integration hooks', cite: ['herdr-gpui-herdr-agents', 'herdr-gpui-herdr-integrations', 'herdr-gpui-crate-readme'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Uses the agent CLIs already installed and signed in on the host; no model billing of its own is documented', cite: ['herdr-gpui-herdr-home'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'None described; optional GitHub device sign-in turns on the pull request features', cite: ['herdr-gpui-readme', 'herdr-gpui-crate-readme'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Answered in the agent’s own terminal pane; Herdr marks the agent blocked when a known approval prompt is on screen', mark: 'yes', cite: ['herdr-gpui-herdr-agents'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Git worktrees you create, through the Herdr daemon; Fan out starts up to 6 agents, each with a fresh worktree', mark: 'yes', cite: ['herdr-gpui-readme', 'herdr-gpui-herdr-configuration', 'herdr-gpui-fan-out', 'herdr-gpui-fan-out-plan'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Setup, run and archive scripts from a committed .herdr/worktree.toml after a trust prompt; dev server ports appear as clickable chips', mark: 'yes', cite: ['herdr-gpui-crate-readme'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'Panes, tabs and splits of the daemon’s terminals drawn natively, with scrollback search, keyboard copy mode and editor groups', mark: 'yes', cite: ['herdr-gpui-readme', 'herdr-gpui-crate-readme'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'A status dot (idle, working, waiting on you) for each agent Herdr recognizes; the Agents panel can sort by priority', mark: 'partial', cite: ['herdr-gpui-readme', 'herdr-gpui-herdr-agents', 'herdr-gpui-crate-readme'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'Toasts or OS notifications when an agent finishes or needs attention, with sounds and a macOS Dock badge; unverified on Windows', mark: 'yes', cite: ['herdr-gpui-crate-readme'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'Browser tabs on macOS and Windows; pick page elements and send numbered notes to the agent. Linux opens the system browser', mark: 'partial', cite: ['herdr-gpui-crate-readme'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Diff tab for local checkouts, unified or side by side, with line notes sent to the agent; remote checkouts aren’t reviewable', mark: 'yes', cite: ['herdr-gpui-readme', 'herdr-gpui-crate-readme'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'Go to Symbol and Go to File open local code read-only or in your terminal editor; VS Code tabs outside Linux', mark: 'partial', cite: ['herdr-gpui-crate-readme'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Commit, push, open, review, comment on and merge PRs from a Git popup for local checkouts, after GitHub sign-in', mark: 'yes', cite: ['herdr-gpui-git-menu', 'herdr-gpui-crate-readme'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'PR numbers coloured by readiness, with check counts and review decisions; new worktrees from pull requests, fork PRs included', mark: 'yes', cite: ['herdr-gpui-crate-readme'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'No hosted runtime; Coder workspaces and experimental Daytona sandboxes join as devices, except on Windows. Herdr Cloud is announced', mark: 'partial', cite: ['herdr-gpui-crate-readme', 'herdr-gpui-herdr-home'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'Saved SSH hosts running Herdr share one window and one agent list; Windows clients can add WSL but not SSH hosts', mark: 'yes', cite: ['herdr-gpui-crate-readme', 'herdr-gpui-readme', 'herdr-gpui-herdr-connecting'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Signed in-app updates for the macOS app and standalone Linux executables; Linux packages and Windows zips don’t update themselves', mark: 'partial', cite: ['herdr-gpui-crate-readme', 'herdr-gpui-updating', 'herdr-gpui-readme'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Session restore', hint: 'After you quit and reopen the app', splash: { text: 'Saved conversations open without launching the agent; continuing reconnects with session/resume or session/load if the agent supports them', mark: 'yes', cite: ['splash-features'] }, other: { text: 'Agents keep running in the daemon when the app closes; after a server restart Herdr restores layouts and resumes supported agents', mark: 'yes', cite: ['herdr-gpui-readme', 'herdr-gpui-herdr-session-state'] } },
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented; the app attaches to existing Herdr daemon sessions, including work started in Herdr’s terminal client', mark: 'unknown', cite: ['herdr-gpui-crate-readme'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Cmd-F searches one pane’s scrollback and the palette finds workspaces, agents and notes; neither searches agent conversation history', mark: 'partial', cite: ['herdr-gpui-crate-readme'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Herdr GPUI draws the terminals of a Herdr daemon, which runs each agent’s own CLI in a pane and reads its state from the screen or from integration hooks. Through Herdr’s CLI and socket API, agents can start and prompt one another. Splash starts each agent itself and speaks the <strong>Agent Client Protocol</strong> with it, natively or through an adapter.',
			cite: ['herdr-gpui-crate-readme', 'herdr-gpui-herdr-agents', 'herdr-gpui-herdr-integrations', 'herdr-gpui-herdr-home', 'splash-registry', 'acp']
		},
		{
			title: 'One app or a client and a daemon',
			text: 'Herdr GPUI needs a separately installed Herdr daemon, made by Herdr, Inc.; the app is Fabien Penso’s independent project. Closing it leaves the daemon’s agents running, and one window attaches to the local daemon, saved SSH hosts and cloud devices. Splash is one app that starts agents as child processes, or <code>splash-server</code> on a machine you reach over SSH.',
			cite: ['herdr-gpui-readme', 'herdr-gpui-crate-readme', 'herdr-gpui-herdr-home', 'splash-readme', 'splash-server']
		},
		{
			title: 'Platforms and updates',
			text: 'Herdr GPUI targets macOS 14.2 or later; its Linux and Windows builds are experimental, and Windows has no saved SSH hosts, cloud devices or in-app updates. The macOS app and standalone Linux executables update themselves after a signature check. Splash builds for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64, and is updated by downloading a new release.',
			cite: ['herdr-gpui-readme', 'herdr-gpui-crate-readme', 'herdr-gpui-updating', 'splash-install', 'splash-about']
		},
		{
			title: 'Around the agent',
			text: 'Herdr GPUI centers on terminals and worktrees: Fan out, setup and run scripts, browser tabs with page notes, file checkpoints at each agent turn, PR creation, and <strong>Teleport</strong>, which moves a worktree and its agent sessions to another host. Splash centers on the conversation: a rendered transcript, a Needs attention queue, transcript search and importing sessions agents started elsewhere.',
			cite: ['herdr-gpui-fan-out', 'herdr-gpui-crate-readme', 'herdr-gpui-checkpoint', 'herdr-gpui-readme', 'splash-features', 'splash-history']
		}
	],
	fit: {
		splash: [
			'You want every agent driven over the Agent Client Protocol, with its messages, tool calls and diffs in one transcript.',
			'You want permission requests, connection failures and finished turns gathered in one Needs attention queue.',
			'You want to import conversations your agents started outside the app and search their transcripts.',
			'You want builds for Windows 11 and Ubuntu as well as macOS, with no separate daemon to install.'
		],
		other: [
			'You want each agent’s own terminal interface, kept running by a daemon when the app closes.',
			'You want setup, run and archive scripts per worktree, with dev server ports and browser tabs beside the agents.',
			'You want to commit, push and open pull requests from the app, and give several agents the same prompt at once.',
			'You want agents on SSH hosts and cloud devices in one window, in a native app that updates itself on macOS.'
		]
	},
	sources: [
		{ id: 'herdr-gpui-repo', title: 'penso/herdr-gpui', url: 'https://github.com/penso/herdr-gpui', publisher: 'penso/herdr-gpui on GitHub', checked: '2026-10-10' },
		{ id: 'herdr-gpui-readme', title: 'Herdr GPUI README', url: 'https://github.com/penso/herdr-gpui/blob/main/README.md', publisher: 'penso/herdr-gpui on GitHub', checked: '2026-10-10' },
		{ id: 'herdr-gpui-crate-readme', title: 'Herdr Native Shell (crate README)', url: 'https://github.com/penso/herdr-gpui/blob/main/crates/herdr-gpui/README.md', publisher: 'penso/herdr-gpui on GitHub', checked: '2026-10-10' },
		{ id: 'herdr-gpui-license', title: 'LICENSE', url: 'https://github.com/penso/herdr-gpui/blob/main/LICENSE', publisher: 'penso/herdr-gpui on GitHub', checked: '2026-10-10' },
		{ id: 'herdr-gpui-notice', title: 'NOTICE', url: 'https://github.com/penso/herdr-gpui/blob/main/NOTICE', publisher: 'penso/herdr-gpui on GitHub', checked: '2026-10-10' },
		{ id: 'herdr-gpui-release', title: 'Herdr GPUI 20261008.1', url: 'https://github.com/penso/herdr-gpui/releases/tag/v20261008.1', publisher: 'penso/herdr-gpui on GitHub', checked: '2026-10-10' },
		{ id: 'herdr-gpui-releases', title: 'Releases', url: 'https://github.com/penso/herdr-gpui/releases', publisher: 'penso/herdr-gpui on GitHub', checked: '2026-10-10' },
		{ id: 'herdr-gpui-updating', title: 'Shared Rust Updater Releases', url: 'https://github.com/penso/herdr-gpui/blob/main/docs/updating.md', publisher: 'penso/herdr-gpui on GitHub', checked: '2026-10-10' },
		{ id: 'herdr-gpui-git-menu', title: 'src/menu/git.rs', url: 'https://github.com/penso/herdr-gpui/blob/main/crates/herdr-gpui/src/menu/git.rs', publisher: 'penso/herdr-gpui on GitHub', checked: '2026-10-10' },
		{ id: 'herdr-gpui-fan-out', title: 'src/fan_out.rs', url: 'https://github.com/penso/herdr-gpui/blob/main/crates/herdr-gpui/src/fan_out.rs', publisher: 'penso/herdr-gpui on GitHub', checked: '2026-10-10' },
		{ id: 'herdr-gpui-fan-out-plan', title: 'src/fan_out/plan.rs', url: 'https://github.com/penso/herdr-gpui/blob/main/crates/herdr-gpui/src/fan_out/plan.rs', publisher: 'penso/herdr-gpui on GitHub', checked: '2026-10-10' },
		{ id: 'herdr-gpui-checkpoint', title: 'src/checkpoint.rs', url: 'https://github.com/penso/herdr-gpui/blob/main/crates/herdr-gpui/src/checkpoint.rs', publisher: 'penso/herdr-gpui on GitHub', checked: '2026-10-10' },
		{ id: 'herdr-gpui-herdr-home', title: 'Herdr: the runtime coding agents run on', url: 'https://herdr.dev/', publisher: 'Herdr, Inc.', checked: '2026-10-10' },
		{ id: 'herdr-gpui-herdr-agents', title: 'Agents', url: 'https://herdr.dev/docs/agents/', publisher: 'Herdr, Inc.', checked: '2026-10-10' },
		{ id: 'herdr-gpui-herdr-integrations', title: 'Integrations', url: 'https://herdr.dev/docs/integrations/', publisher: 'Herdr, Inc.', checked: '2026-10-10' },
		{ id: 'herdr-gpui-herdr-configuration', title: 'Configuration', url: 'https://herdr.dev/docs/configuration/', publisher: 'Herdr, Inc.', checked: '2026-10-10' },
		{ id: 'herdr-gpui-herdr-connecting', title: 'Connecting machines', url: 'https://herdr.dev/docs/connecting-machines/', publisher: 'Herdr, Inc.', checked: '2026-10-10' },
		{ id: 'herdr-gpui-herdr-session-state', title: 'Session state and restore', url: 'https://herdr.dev/docs/session-state/', publisher: 'Herdr, Inc.', checked: '2026-10-10' }
	]
};
