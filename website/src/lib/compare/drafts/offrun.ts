// Splash vs Offrun. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const OFFRUN: Comparison = {
	slug: 'offrun',
	name: 'Offrun',
	description: 'How Splash and Offrun compare on agents, platforms, pricing, worktrees, review and remote use, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Offrun are desktop apps that run several coding agents at once and can give each its own git worktree. Offrun, a Mac app, runs the Claude Code, Codex and Antigravity CLIs with your own logins; Splash, for macOS, Windows and Ubuntu, drives agents over the Agent Client Protocol.',
	other: {
		name: 'Offrun',
		url: 'https://offrun.dev',
		maker: 'Founderly',
		summary: 'A Mac app that runs Claude Code, Codex and Antigravity side by side as chats, each in its own git worktree, with several logins per agent, an optional reviewer agent and a preview panel.',
		cite: ['offrun-home', 'offrun-parallel', 'offrun-accounts', 'offrun-claude-codex']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Mac desktop app where agents run as chats beside a preview panel; a phone browser can pair as a remote', cite: ['offrun-download', 'offrun-home', 'offrun-changelog'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: '6.1.0 (4 October 2026); the changelog lists 21 releases from 5.0.1 in September 2026. Called Offloop before 6.0.0', cite: ['offrun-download', 'offrun-changelog'] } },
				{ label: 'License', splash: S.license, other: { text: 'Proprietary, with no public source; the terms grant a personal, revocable license and forbid reverse engineering', cite: ['offrun-terms'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free, with no paid plan today (the terms allow one later); you pay agent providers, and connectors use free credits', cite: ['offrun-home', 'offrun-terms'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'Apple silicon Macs (M1 or newer) with macOS 14 or later; no Intel, Windows or Linux build is listed', cite: ['offrun-download', 'offrun-home'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code, Codex and Antigravity (agy); some pages also name Grok Build. Pi and OpenCode are announced as coming soon', cite: ['offrun-parallel', 'offrun-vs-conductor', 'offrun-home'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Starts each agent’s own CLI on your Mac with a separate config folder per login; the connection method isn’t documented', cite: ['offrun-home', 'offrun-accounts'] } },
				{ label: 'Agent sign-in', splash: S.signIn, other: { text: 'Your existing CLI logins and plans, several per agent; a chat moves to the next login when one hits its limit', cite: ['offrun-home', 'offrun-terms', 'offrun-accounts'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'Not documented: setup lists no sign-up, but the terms describe an Offrun account and the app has a sign-in screen', cite: ['offrun-home', 'offrun-terms', 'offrun-changelog'] } },
				{ label: 'Model and mode pickers', splash: S.models, other: { text: 'One picker sets the agent’s and the reviewer’s model, effort level and fast mode; chats also have Build and Planner modes', mark: 'yes', cite: ['offrun-changelog'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Not documented; agent questions get clickable answers, and connectors read and write with no approval step', mark: 'unknown', cite: ['offrun-changelog'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A git worktree on its own branch for every chat, under .worktrees in the repo; no container or sandbox is documented', mark: 'yes', cite: ['offrun-parallel', 'offrun-vs-conductor'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Setup scripts aren’t documented; each chat can have its own environment variables, and its dev servers move with it', mark: 'partial', cite: ['offrun-changelog'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Home counts agents working, waiting for you or with unread answers, and shows each one’s state; chats carry status dots', mark: 'yes', cite: ['offrun-parallel', 'offrun-changelog'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'Agent alerts show as macOS-style notification cards with an Open button, visible for 15 seconds', mark: 'yes', cite: ['offrun-changelog'] } },
				{ label: 'Agents handing off work', hint: 'Passing a conversation or task to another agent', splash: S.handoff, other: { text: 'A chat can switch to another agent, which gets the whole conversation; Offrun suggests this when an agent’s logins run out', mark: 'yes', cite: ['offrun-claude-codex', 'offrun-accounts'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'A browser in the preview panel; Claude, Codex and agy can drive its pages, and you can take over', mark: 'yes', cite: ['offrun-home', 'offrun-changelog'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'An optional reviewer agent, possibly from another provider, posts numbered findings on each turn’s changes for you to pass on', mark: 'yes', cite: ['offrun-claude-codex', 'offrun-vs-conductor'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'A preview panel shows changed files and line-numbered diffs, plus markdown, images, PDFs, Excel, PowerPoint and editable CSV', mark: 'yes', cite: ['offrun-home', 'offrun-changelog'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Not in the app; each chat’s branch stays unmerged until you merge or open a PR with your usual git tools', mark: 'no', cite: ['offrun-vs-conductor', 'offrun-parallel'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Agents can file GitHub issues through an optional connector; no pull request or CI view is documented', mark: 'partial', cite: ['offrun-home', 'offrun-vs-conductor'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'Agents run on your Mac; the maker’s comparison with Conductor’s cloud workspaces says Offrun runs on the Mac alone', mark: 'no', cite: ['offrun-home', 'offrun-vs-conductor'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'Offrun Remote pairs a phone by QR code or link; its browser then runs the selected project’s agents on your Mac', mark: 'yes', cite: ['offrun-changelog'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Offers each new version inside the app and asks before downloading it', mark: 'yes', cite: ['offrun-changelog'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented; chats started in Offrun are saved, and you can reopen, rename, fork and copy them', mark: 'unknown', cite: ['offrun-changelog'] } },
				{ label: 'Fork a conversation', splash: S.fork, other: { text: 'Saved chats can be forked; the changelog doesn’t say whether from an earlier message', mark: 'yes', cite: ['offrun-changelog'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Offrun starts each agent’s own CLI on your Mac, pointed at a separate config folder for every login, and says prompts and code go straight to the provider; its connectors run through Composio. How it talks to the CLIs isn’t documented. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, natively or through an adapter for the vendor’s CLI.',
			cite: ['offrun-home', 'offrun-accounts', 'offrun-changelog', 'splash-registry', 'acp']
		},
		{
			title: 'Logins and usage limits',
			text: 'Offrun supports several logins for each agent. Home shows each login’s usage and reset time; when one runs out, the chat moves to the next and you resend, and with none left it offers another agent that receives the whole conversation. Splash runs each agent with the login you set up in its CLI.',
			cite: ['offrun-accounts', 'offrun-claude-codex', 'splash-agents']
		},
		{
			title: 'Platforms, price and license',
			text: 'Offrun is a proprietary app for Apple silicon Macs on macOS 14 or later. It is free today, and its terms allow a paid plan later. Splash is free and MIT-licensed, with builds for macOS (Apple silicon and Intel), Windows 11 and Ubuntu, plus <code>splash-server</code>, which you open in a browser over an SSH tunnel.',
			cite: ['offrun-terms', 'offrun-download', 'offrun-home', 'splash-license', 'splash-download', 'splash-install', 'splash-server']
		},
		{
			title: 'Around the chat',
			text: 'Offrun adds an optional reviewer agent that checks each turn, project memory kept as plain files under <code>.offrun</code> that every agent reads at the start, a browser agents can drive, and connectors to apps such as Gmail and Slack. Splash centers on the transcript: a Needs attention queue, a review screen, transcript search and importing sessions agents started elsewhere.',
			cite: ['offrun-claude-codex', 'offrun-home', 'offrun-changelog', 'splash-features', 'splash-history']
		},
		{
			title: 'Beyond coding agents',
			text: 'Offrun also has features outside coding: on-device dictation for speaking prompts, which setup has treated as optional since 6.0.8, and <strong>Meetings</strong>, which records and names calls and answers questions about them. Splash is a desktop app for running several coding agents at once.',
			cite: ['offrun-home', 'offrun-changelog', 'splash-readme']
		}
	],
	fit: {
		splash: [
			'You want a free, MIT-licensed app for Windows and Ubuntu as well as macOS, including Intel Macs.',
			'You want Gemini, Copilot, OpenCode, Goose and other agents, all driven over the Agent Client Protocol.',
			'You want permission requests shown in the transcript and gathered in one Needs attention queue.',
			'You want to import and search conversations your agents started elsewhere, or run sessions on your own server over SSH.'
		],
		other: [
			'You want several logins per agent, with each login’s usage on one screen and chats that move on when a limit is hit.',
			'You want a second agent, possibly from another provider, to review each turn’s changes before you commit.',
			'You want project memory in plain files that every agent reads, and a browser your agents can drive.',
			'You want to run your Mac’s agents from a phone browser, in an app that updates itself.'
		]
	},
	sources: [
		{ id: 'offrun-home', title: 'Run Claude Code and Codex agents in parallel on Mac', url: 'https://offrun.dev/', publisher: 'Founderly', checked: '2026-10-10' },
		{ id: 'offrun-download', title: 'Download Offrun for Mac', url: 'https://offrun.dev/download/', publisher: 'Founderly', checked: '2026-10-10' },
		{ id: 'offrun-changelog', title: 'Changelog', url: 'https://offrun.dev/changelog/', publisher: 'Founderly', checked: '2026-10-10' },
		{ id: 'offrun-terms', title: 'Terms of Service', url: 'https://offrun.dev/terms/', publisher: 'Founderly', checked: '2026-10-10' },
		{ id: 'offrun-parallel', title: 'Run coding agents in parallel with git worktrees', url: 'https://offrun.dev/parallel-coding-agents/', publisher: 'Founderly', checked: '2026-10-10' },
		{ id: 'offrun-accounts', title: 'Run multiple Claude Code accounts on one Mac', url: 'https://offrun.dev/multiple-claude-code-accounts/', publisher: 'Founderly', checked: '2026-10-10' },
		{ id: 'offrun-claude-codex', title: 'Use Claude Code and Codex together on one repo', url: 'https://offrun.dev/claude-code-and-codex/', publisher: 'Founderly', checked: '2026-10-10' },
		{ id: 'offrun-vs-conductor', title: 'Offrun vs Conductor', url: 'https://offrun.dev/compare/conductor/', publisher: 'Founderly', checked: '2026-10-10' }
	]
};
