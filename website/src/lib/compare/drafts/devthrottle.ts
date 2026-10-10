// Splash vs DevThrottle. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const DEVTHROTTLE: Comparison = {
	slug: 'devthrottle',
	name: 'DevThrottle',
	description: 'How Splash and DevThrottle compare on agents, platforms, pricing, worktrees, remote access and review, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and DevThrottle both run several coding agents at once on your own computers and are MIT-licensed. DevThrottle runs each agent’s own CLI in a terminal inside a desktop app, the Director, and links machines to a browser and phone through its Gateway. Splash drives agents over the Agent Client Protocol and shows their work as a transcript.',
	other: {
		name: 'DevThrottle',
		url: 'https://devthrottle.com',
		maker: 'Center Consulting',
		summary: 'An open-source app for running and watching command-line coding agents: the Director desktop app runs each in a terminal, and a Gateway brings them to a browser and phone.',
		cite: ['devthrottle-overview', 'devthrottle-terminal', 'devthrottle-pair-phone']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app (the Director), plus a Gateway service, hosted or self-run, a browser Cockpit and a phone web app', cite: ['devthrottle-overview', 'devthrottle-director', 'devthrottle-pair-phone'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v2.17.0 (7 October 2026), the newest of 165 GitHub releases since March 2026; it ships continuously', cite: ['devthrottle-release', 'devthrottle-releases', 'devthrottle-changelog'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (MIT); the site says the license will stay MIT', cite: ['devthrottle-license', 'devthrottle-open-source'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free plan with unlimited sessions; Pro $29 a month at the founding price ($49 list); Teams $59 a seat a month', cite: ['devthrottle-pricing'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'Windows 10/11 x64 and Apple silicon Macs, set up from Terminal; GitHub also ships Linux x64 builds, tested on Ubuntu 24.04', cite: ['devthrottle-install', 'devthrottle-release', 'devthrottle-v2-0-7'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'C# on .NET 10 with the Avalonia UI framework; the Cockpit and phone app are written in TypeScript', cite: ['devthrottle-csproj', 'devthrottle-repo'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Drivers for Claude Code, Codex, Gemini, GitHub Copilot, Cursor, OpenCode, Grok and Pi; Custom runs any CLI, with fewer features', cite: ['devthrottle-supported'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each agent’s own CLI, unmodified, in a pseudo-terminal; per-agent drivers type keystrokes, and Claude Code’s transcript files are read from disk', cite: ['devthrottle-supported', 'devthrottle-backend', 'devthrottle-drivers', 'devthrottle-claude-driver'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'You install each CLI and use your own subscriptions, logins or keys; DevThrottle doesn’t charge for or meter agent runs', cite: ['devthrottle-supported', 'devthrottle-overview'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'Not to run the Director, though the site’s download asks for a free account; phone, browser and voice need a sign-in', cite: ['devthrottle-readme', 'devthrottle-install', 'devthrottle-download'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Six of eight agents launch with approval-skipping flags by default; with Standard, a waiting approval turns the session card red', mark: 'yes', cite: ['devthrottle-supported', 'devthrottle-steering', 'devthrottle-sessions'] } },
				{ label: 'Skills and MCP servers', splash: { text: 'Settings shows each agent’s skills and MCP servers, read-only', mark: 'partial', cite: ['splash-features', 'splash-mcp'] }, other: { text: 'A shared Agent Skills library on the Gateway reaches all eight agents; MCP server management is still alpha', mark: 'yes', cite: ['devthrottle-skills', 'devthrottle-agents'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Sessions use any folder, shared or not; you create worktrees yourself or turn on an opt-in pool from the CLI', mark: 'partial', cite: ['devthrottle-worktrees', 'devthrottle-changelog'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'A live terminal per session you can type into, mirrored in the Cockpit; a prompt bar sends or queues messages', mark: 'yes', cite: ['devthrottle-terminal', 'devthrottle-session-view'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Red cards for questions and permission prompts, with wait timers and a counter; the Cockpit can also notify you in the browser', mark: 'yes', cite: ['devthrottle-sessions', 'devthrottle-director', 'devthrottle-remote'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'A Fleet Manager session starts and watches the others; sessions message each other and hold Architect, Manager or Worker roles', mark: 'yes', cite: ['devthrottle-changelog', 'devthrottle-roles'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'The Gateway’s cron starts unattended agent sessions on a schedule or once at a set time', mark: 'yes', cite: ['devthrottle-cron'] } },
				{ label: 'Team collaboration', splash: { text: 'splash-server is a personal, single-user service, not a multi-user deployment', mark: 'no', cite: ['splash-server'] }, other: { text: 'Teams plan, launched in v2.17.0: shared fleet, roles, policies and an approval record; invites are passed on as links for now', mark: 'yes', cite: ['devthrottle-pricing', 'devthrottle-release'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Each session lists changed files; line diffs, per-file staging and a commit box sit on the Repository screen', mark: 'yes', cite: ['devthrottle-source-control', 'devthrottle-repositories'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Not documented; you commit on the Repository screen, through the agent or with your own git tools', mark: 'unknown', cite: ['devthrottle-source-control', 'devthrottle-repositories'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'A read-only list of open PRs per repository through gh, with checks and review state; Azure DevOps PRs too, via az', mark: 'yes', cite: ['devthrottle-repositories', 'devthrottle-pr-service'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'Not yet: agents run on your own computers; hosted cloud machines and agents are announced as coming', mark: 'no', cite: ['devthrottle-pricing'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'The Gateway lets a browser or phone drive every session on enrolled machines; self-hosted, it needs your own VPN from outside', mark: 'yes', cite: ['devthrottle-cockpit', 'devthrottle-gateway', 'devthrottle-remote'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'A web app served by the Gateway and pinned to your home screen; text mode is free, voice mode is Pro', mark: 'yes', cite: ['devthrottle-pair-phone', 'devthrottle-pricing'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented; the docs describe resuming past Claude Code conversations from a list or with /resume', mark: 'unknown', cite: ['devthrottle-steering', 'devthrottle-session-lifecycle'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Not documented; the Cockpit’s History groups past sessions by repository and day, and the Fleet Map filters titles', mark: 'unknown', cite: ['devthrottle-cockpit', 'devthrottle-fleet-map'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'DevThrottle runs each agent’s own interactive CLI, unmodified, in a pseudo-terminal, and steers it through per-agent drivers that type keystrokes; for Claude Code it also reads the transcript files. Its repository holds an ACP research spike that ships no production code. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, natively or through an adapter.',
			cite: ['devthrottle-supported', 'devthrottle-backend', 'devthrottle-drivers', 'devthrottle-claude-driver', 'devthrottle-acp-spike', 'splash-registry', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'Both run agents on computers you own; DevThrottle lists hosted cloud machines as coming. Its Gateway, run by DevThrottle or on your own Windows machine or Linux container, links Directors to a browser and phone, and receives each finished turn, file contents included, keeping it 90 days. <code>splash-server</code> serves one user over an SSH tunnel.',
			cite: ['devthrottle-pricing', 'devthrottle-gateway', 'devthrottle-cockpit', 'devthrottle-telemetry', 'splash-readme', 'splash-server']
		},
		{
			title: 'Price, accounts and license',
			text: 'Both are MIT-licensed. DevThrottle’s Free plan covers unlimited sessions and machines; Pro, $29 a month at the founding price, adds the wingman, dictation and spoken replies, and Teams adds a shared fleet. Its pages disagree on whether the hosted Gateway belongs to Free or Pro. Splash is free and has no accounts.',
			cite: ['devthrottle-license', 'devthrottle-pricing', 'devthrottle-billing', 'devthrottle-start-install', 'splash-license', 'splash-download', 'splash-build']
		},
		{
			title: 'Around the session',
			text: 'DevThrottle adds tools for running a fleet: a Fleet Manager session that starts the others, session roles, Gateway cron jobs, a shared skills library and voice input; the Director keeps one session on screen at a time. Splash centers on the conversation: a rendered transcript, a <strong>Needs attention</strong> queue, diff review, transcript search and importing sessions agents started elsewhere.',
			cite: ['devthrottle-changelog', 'devthrottle-roles', 'devthrottle-cron', 'devthrottle-skills', 'devthrottle-voice', 'devthrottle-roadmap', 'splash-features', 'splash-history']
		},
		{
			title: 'Platforms',
			text: 'DevThrottle’s install docs cover Windows 10 and 11 and Apple silicon Macs; a Mac works as a workstation but cannot host the Gateway, and its installer isn’t notarized yet. GitHub releases also carry Linux x64 builds. Splash builds for macOS 14+ on Apple silicon and Intel, Windows 11 x64 and Ubuntu 24.04 x64, plus a headless server.',
			cite: ['devthrottle-install', 'devthrottle-gateway', 'devthrottle-release', 'devthrottle-v2-0-7', 'splash-install', 'splash-readme']
		}
	],
	fit: {
		splash: [
			'You want every agent driven over the Agent Client Protocol, with messages, tool calls and diffs in one transcript.',
			'You want each session in its own git worktree and branch, set up from the app.',
			'You want to import conversations agents started outside the app and search their full text.',
			'You want a free app with no accounts that also runs on Intel Macs.'
		],
		other: [
			'You want to follow and answer agents on several machines from a browser or your phone.',
			'You want a Fleet Manager session, session roles and scheduled runs to coordinate many agents.',
			'You want each agent’s own terminal interface, and to run any CLI as a custom session.',
			'You want team plans with a shared fleet and an approval record, or dictation and spoken replies.'
		]
	},
	sources: [
		{ id: 'devthrottle-overview', title: 'What DevThrottle is', url: 'https://devthrottle.com/docs/overview', publisher: 'Center Consulting', checked: '2026-10-10' },
		{ id: 'devthrottle-terminal', title: 'The embedded terminal', url: 'https://devthrottle.com/docs/director/terminal', publisher: 'Center Consulting', checked: '2026-10-10' },
		{ id: 'devthrottle-pair-phone', title: 'Pair your phone with your fleet', url: 'https://devthrottle.com/docs/tutorials/pair-phone', publisher: 'Center Consulting', checked: '2026-10-10' },
		{ id: 'devthrottle-director', title: 'The Director', url: 'https://devthrottle.com/docs/director/overview', publisher: 'Center Consulting', checked: '2026-10-10' },
		{ id: 'devthrottle-release', title: 'DevThrottle v2.17.0', url: 'https://github.com/thefrederiksen/devthrottle/releases/tag/v2.17.0', publisher: 'thefrederiksen/devthrottle on GitHub', checked: '2026-10-10' },
		{ id: 'devthrottle-releases', title: 'Releases', url: 'https://github.com/thefrederiksen/devthrottle/releases', publisher: 'thefrederiksen/devthrottle on GitHub', checked: '2026-10-10' },
		{ id: 'devthrottle-changelog', title: 'Changelog', url: 'https://devthrottle.com/docs/reference/changelog', publisher: 'Center Consulting', checked: '2026-10-10' },
		{ id: 'devthrottle-license', title: 'LICENSE', url: 'https://github.com/thefrederiksen/devthrottle/blob/main/LICENSE', publisher: 'thefrederiksen/devthrottle on GitHub', checked: '2026-10-10' },
		{ id: 'devthrottle-open-source', title: 'DevThrottle is open source', url: 'https://devthrottle.com/open-source', publisher: 'Center Consulting', checked: '2026-10-10' },
		{ id: 'devthrottle-pricing', title: 'DevThrottle Pricing', url: 'https://devthrottle.com/pricing', publisher: 'Center Consulting', checked: '2026-10-10' },
		{ id: 'devthrottle-install', title: 'Install DevThrottle and run your first agent', url: 'https://devthrottle.com/docs/install', publisher: 'Center Consulting', checked: '2026-10-10' },
		{ id: 'devthrottle-v2-0-7', title: 'DevThrottle v2.0.7', url: 'https://github.com/thefrederiksen/devthrottle/releases/tag/v2.0.7', publisher: 'thefrederiksen/devthrottle on GitHub', checked: '2026-10-10' },
		{ id: 'devthrottle-csproj', title: 'src/CcDirector.Avalonia/CcDirector.Avalonia.csproj', url: 'https://github.com/thefrederiksen/devthrottle/blob/main/src/CcDirector.Avalonia/CcDirector.Avalonia.csproj', publisher: 'thefrederiksen/devthrottle on GitHub', checked: '2026-10-10' },
		{ id: 'devthrottle-repo', title: 'thefrederiksen/devthrottle', url: 'https://github.com/thefrederiksen/devthrottle', publisher: 'thefrederiksen/devthrottle on GitHub', checked: '2026-10-10' },
		{ id: 'devthrottle-supported', title: 'Supported coding agents', url: 'https://devthrottle.com/docs/agents/supported', publisher: 'Center Consulting', checked: '2026-10-10' },
		{ id: 'devthrottle-backend', title: 'src/CcDirector.Core/Backends/PlatformSessionBackend.cs', url: 'https://github.com/thefrederiksen/devthrottle/blob/main/src/CcDirector.Core/Backends/PlatformSessionBackend.cs', publisher: 'thefrederiksen/devthrottle on GitHub', checked: '2026-10-10' },
		{ id: 'devthrottle-drivers', title: 'src/CcDirector.Core/Drivers/AgentDrivers.cs', url: 'https://github.com/thefrederiksen/devthrottle/blob/main/src/CcDirector.Core/Drivers/AgentDrivers.cs', publisher: 'thefrederiksen/devthrottle on GitHub', checked: '2026-10-10' },
		{ id: 'devthrottle-claude-driver', title: 'src/CcDirector.Core/Drivers/ClaudeDriver.cs', url: 'https://github.com/thefrederiksen/devthrottle/blob/main/src/CcDirector.Core/Drivers/ClaudeDriver.cs', publisher: 'thefrederiksen/devthrottle on GitHub', checked: '2026-10-10' },
		{ id: 'devthrottle-readme', title: 'README.md', url: 'https://github.com/thefrederiksen/devthrottle#readme', publisher: 'thefrederiksen/devthrottle on GitHub', checked: '2026-10-10' },
		{ id: 'devthrottle-download', title: 'Download DevThrottle for Windows', url: 'https://devthrottle.com/download', publisher: 'Center Consulting', checked: '2026-10-10' },
		{ id: 'devthrottle-steering', title: 'Starting and steering agents', url: 'https://devthrottle.com/docs/director/steering', publisher: 'Center Consulting', checked: '2026-10-10' },
		{ id: 'devthrottle-sessions', title: 'Session cards and states', url: 'https://devthrottle.com/docs/director/sessions', publisher: 'Center Consulting', checked: '2026-10-10' },
		{ id: 'devthrottle-skills', title: 'Skills: the capabilities your agents reach for', url: 'https://devthrottle.com/docs/gateway/skills', publisher: 'Center Consulting', checked: '2026-10-10' },
		{ id: 'devthrottle-agents', title: 'Agents and models', url: 'https://devthrottle.com/docs/director/agents', publisher: 'Center Consulting', checked: '2026-10-10' },
		{ id: 'devthrottle-worktrees', title: 'Repositories and worktrees', url: 'https://devthrottle.com/docs/tutorials/repositories-and-worktrees', publisher: 'Center Consulting', checked: '2026-10-10' },
		{ id: 'devthrottle-session-view', title: 'Working in a session', url: 'https://devthrottle.com/docs/cockpit/session-view', publisher: 'Center Consulting', checked: '2026-10-10' },
		{ id: 'devthrottle-remote', title: 'Answering agents remotely', url: 'https://devthrottle.com/docs/cockpit/remote', publisher: 'Center Consulting', checked: '2026-10-10' },
		{ id: 'devthrottle-roles', title: 'Session roles and missions', url: 'https://devthrottle.com/docs/director/roles', publisher: 'Center Consulting', checked: '2026-10-10' },
		{ id: 'devthrottle-cron', title: 'Scheduled runs with the Gateway cron', url: 'https://devthrottle.com/docs/gateway/cron', publisher: 'Center Consulting', checked: '2026-10-10' },
		{ id: 'devthrottle-source-control', title: 'Source control and history', url: 'https://devthrottle.com/docs/director/source-control', publisher: 'Center Consulting', checked: '2026-10-10' },
		{ id: 'devthrottle-repositories', title: 'Repositories and GitHub', url: 'https://devthrottle.com/docs/director/repositories', publisher: 'Center Consulting', checked: '2026-10-10' },
		{ id: 'devthrottle-pr-service', title: 'src/CcDirector.Core/Git/PullRequestService.cs', url: 'https://github.com/thefrederiksen/devthrottle/blob/main/src/CcDirector.Core/Git/PullRequestService.cs', publisher: 'thefrederiksen/devthrottle on GitHub', checked: '2026-10-10' },
		{ id: 'devthrottle-cockpit', title: 'The Cockpit', url: 'https://devthrottle.com/docs/cockpit/overview', publisher: 'Center Consulting', checked: '2026-10-10' },
		{ id: 'devthrottle-gateway', title: 'What the Gateway does', url: 'https://devthrottle.com/docs/gateway/overview', publisher: 'Center Consulting', checked: '2026-10-10' },
		{ id: 'devthrottle-session-lifecycle', title: 'Renaming and resuming sessions', url: 'https://devthrottle.com/docs/director/session-lifecycle', publisher: 'Center Consulting', checked: '2026-10-10' },
		{ id: 'devthrottle-fleet-map', title: 'The Fleet Map', url: 'https://devthrottle.com/docs/cockpit/fleet-map', publisher: 'Center Consulting', checked: '2026-10-10' },
		{ id: 'devthrottle-acp-spike', title: 'docs/spikes/acp/RECOMMENDATION.md', url: 'https://github.com/thefrederiksen/devthrottle/blob/main/docs/spikes/acp/RECOMMENDATION.md', publisher: 'thefrederiksen/devthrottle on GitHub', checked: '2026-10-10' },
		{ id: 'devthrottle-telemetry', title: 'What DevThrottle reports home', url: 'https://devthrottle.com/docs/reference/telemetry', publisher: 'Center Consulting', checked: '2026-10-10' },
		{ id: 'devthrottle-billing', title: 'Billing', url: 'https://devthrottle.com/docs/account/billing', publisher: 'Center Consulting', checked: '2026-10-10' },
		{ id: 'devthrottle-start-install', title: 'Step 1: Install DevThrottle and connect a gateway', url: 'https://devthrottle.com/docs/start/install', publisher: 'Center Consulting', checked: '2026-10-10' },
		{ id: 'devthrottle-voice', title: 'Voice', url: 'https://devthrottle.com/docs/voice/overview', publisher: 'Center Consulting', checked: '2026-10-10' },
		{ id: 'devthrottle-roadmap', title: 'Coming soon to DevThrottle', url: 'https://devthrottle.com/roadmap', publisher: 'Center Consulting', checked: '2026-10-10' }
	]
};
