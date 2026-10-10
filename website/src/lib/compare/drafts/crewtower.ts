// Splash vs CrewTower. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const CREWTOWER: Comparison = {
	slug: 'crewtower',
	name: 'CrewTower',
	description: 'How Splash and CrewTower compare on agents, platforms, pricing, approvals and review, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and CrewTower both help you follow several coding agents at once. CrewTower is a Mac app that puts the agents you run in terminals, editors and desktop apps into the notch, where you can answer many of their requests. Splash is a desktop app that starts each agent itself and talks to it over the Agent Client Protocol.',
	other: {
		name: 'CrewTower',
		url: 'https://crewtower.app/',
		maker: 'Said Altan',
		summary: 'A native Mac app that shows the coding agents you run elsewhere in the notch or a small pill. You approve requests, answer questions and review plans there; Jump brings the agent’s own window forward.',
		cite: ['crewtower-home', 'crewtower-cursor', 'crewtower-jump']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Native Mac app showing agents from terminals, editors and the Claude and ChatGPT apps in the notch; it doesn’t run them', cite: ['crewtower-home', 'crewtower-cursor'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v1.0.33 of 6 October 2026, first released as 1.0 on 29 July 2026; prompt sending for Claude Code is a beta', cite: ['crewtower-changelog', 'crewtower-appcast'] } },
				{ label: 'License', splash: S.license, other: { text: 'Proprietary and closed source: a personal license for one Mac that can’t be transferred; reverse engineering is forbidden', cite: ['crewtower-opencode', 'crewtower-terms'] } },
				{ label: 'Price', splash: S.price, other: { text: '$9.99 once per Mac at the early-bird price (regularly $14.99), updates included; no free trial, 30-day refunds', cite: ['crewtower-home', 'crewtower-terms'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 15 or later; a small pill stands in on screens without a notch. CPU architectures aren’t stated', cite: ['crewtower-home', 'crewtower-appcast'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'A native Mac app that updates through Sparkle; its AlternativeTo listing says it’s written in Swift, without Electron', cite: ['crewtower-home', 'crewtower-privacy', 'crewtower-alternativeto'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: '27 recognized: Claude Code, Codex, Cursor, Gemini CLI, Qwen Code and opencode can be answered; 21 more get activity and Jump', cite: ['crewtower-changelog', 'crewtower-home'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Doesn’t start agents; hooks in their configs reach it over a local Unix socket, and it reads their JSONL transcripts', cite: ['crewtower-cursor', 'crewtower-claude-code', 'crewtower-home', 'crewtower-privacy'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Agents keep their own logins and bills; the usage strip, on by default, reuses your Claude Code login', cite: ['crewtower-privacy', 'crewtower-terms'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'No account or login; a license key is activated online once, then renews quietly in the background', cite: ['crewtower-claude-code', 'crewtower-terms'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'For the six agents it can answer: allow once, for the session or always, from the notch; MCP calls included', mark: 'yes', cite: ['crewtower-claude-code', 'crewtower-codex', 'crewtower-changelog'] } },
				{ label: 'Send prompts', hint: 'Talking to the agent from the app', splash: { text: 'You prompt the agent in its session; Splash shows the messages, tool calls and diffs it streams back', mark: 'yes', cite: ['splash-readme'] }, other: { text: 'Beta, off by default: send Claude Code its next prompt, or stop or compact a turn, from the notch', mark: 'partial', cite: ['crewtower-changelog', 'crewtower-llms'] } },
				{ label: 'Context and usage', splash: { text: 'Context and cost readouts for agents that report them', mark: 'yes', cite: ['splash-features'] }, other: { text: 'Context-window fill for every session plus Claude and Codex usage meters; no token counts or costs', mark: 'yes', cite: ['crewtower-changelog', 'crewtower-privacy', 'crewtower-claude-code'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Doesn’t create worktrees or sandboxes; when one repo has several worktrees, each session shows its branch', mark: 'no', cite: ['crewtower-cursor', 'crewtower-changelog'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'Not a terminal; Jump focuses an agent’s exact tab or pane in 7 terminal apps, tmux and herdr', mark: 'no', cite: ['crewtower-claude-code', 'crewtower-jump', 'crewtower-changelog'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Waiting approvals, questions and plans sort above working sessions; All and Unread views, Mark all read and subagent progress', mark: 'yes', cite: ['crewtower-home', 'crewtower-changelog'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'The notch announces finished sessions and nudges waiting ones again after 1, 5 and 15 minutes; macOS Focus quiets it', mark: 'yes', cite: ['crewtower-changelog', 'crewtower-home'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Approve a Claude Code plan or return it with feedback; approval cards show the command or edit and flag destructive ones', mark: 'partial', cite: ['crewtower-home', 'crewtower-claude-code', 'crewtower-changelog'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'No file browser or diff viewer; CrewTower doesn’t read your source files', mark: 'no', cite: ['crewtower-privacy', 'crewtower-claude-code'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'No GitHub features; its privacy page names three network uses: usage meter, license checks and updates', mark: 'no', cite: ['crewtower-privacy'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'No way to follow a session from another machine; agents over SSH get no special handling', mark: 'no', cite: ['crewtower-cursor', 'crewtower-jump'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'No phone or web client; CrewTower is a Mac app with no remote viewing', mark: 'no', cite: ['crewtower-home', 'crewtower-cursor'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Installs new versions itself through Sparkle, checking roughly daily; updates carry no upgrade fee', mark: 'yes', cite: ['crewtower-changelog', 'crewtower-privacy', 'crewtower-home'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Sessions started outside the app', splash: S.history, other: { text: 'Follows live sessions started in terminals, editors and apps, and recovers recent ones after a restart; import isn’t documented', mark: 'partial', cite: ['crewtower-cursor', 'crewtower-home', 'crewtower-changelog'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Not documented; a card’s Activity control shows the recent part of that session’s transcript', mark: 'unknown', cite: ['crewtower-changelog'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'CrewTower doesn’t start agents: hooks in each agent’s config reach it over a local Unix socket, and it reads the JSONL transcripts agents write. Its changelog says unlisted agent CLIs show up while running, but its privacy page describes matching against a set list of names. Splash starts each agent and talks to it over the <strong>Agent Client Protocol</strong>.',
			cite: ['crewtower-home', 'crewtower-claude-code', 'crewtower-privacy', 'crewtower-changelog', 'splash-readme', 'acp']
		},
		{
			title: 'Where you work with the agent',
			text: 'With CrewTower you keep working in each agent’s own terminal, editor or desktop app. The notch shows their status and takes approvals, answers and plan decisions, and Jump brings the right window forward; sending prompts from it is a Claude Code beta. In Splash the conversation lives in the app, with its transcript, review screen, file tabs and terminal.',
			cite: ['crewtower-home', 'crewtower-jump', 'crewtower-changelog', 'splash-readme', 'splash-features']
		},
		{
			title: 'Where agents run',
			text: 'CrewTower watches agents on the Mac it runs on. It has no cloud service, offers no way to follow a session from another machine and gives agents running over SSH no special handling. Splash runs agents on your computer, or under <code>splash-server</code> on the machine with your code, which you open in a browser through an SSH tunnel.',
			cite: ['crewtower-cursor', 'crewtower-jump', 'splash-readme', 'splash-server']
		},
		{
			title: 'Price, license and platforms',
			text: 'CrewTower, a one-person product, is a closed-source Mac app for macOS 15 or later, sold for $9.99 once per Mac at its early-bird price ($14.99 regularly), with no trial. Its license is checked online; after three weeks without reaching the server it stops working. Splash is free, MIT-licensed and needs no account, with builds for macOS, Windows and Ubuntu.',
			cite: ['crewtower-opencode', 'crewtower-home', 'crewtower-appcast', 'crewtower-terms', 'splash-license', 'splash-download', 'splash-build', 'splash-install']
		}
	],
	fit: {
		splash: [
			'You want a free, MIT-licensed app with no account, on macOS, Windows or Ubuntu.',
			'You want to start agents and hold the whole conversation in one app, from the prompt to reviewing the diff.',
			'You want a worktree per session, a terminal, file tabs and a GitHub view beside the transcript.',
			'You want to import and search past conversations, or run sessions on your own server over SSH.'
		],
		other: [
			'You already run agents in terminals, editors or the Claude and ChatGPT apps and want them in one view.',
			'You want to approve requests, answer questions and review plans from the notch.',
			'You want Jump to bring forward the exact terminal tab or pane where an agent is waiting.',
			'You want context fill and Claude or Codex usage at the top of your screen, from a one-time purchase with no account.'
		]
	},
	sources: [
		{ id: 'crewtower-home', title: 'Your AI coding agents, in your Mac’s notch', url: 'https://crewtower.app/', publisher: 'Said Altan', checked: '2026-10-10' },
		{ id: 'crewtower-cursor', title: 'Cursor agent monitor for Mac', url: 'https://crewtower.app/cursor', publisher: 'Said Altan', checked: '2026-10-10' },
		{ id: 'crewtower-claude-code', title: 'Claude Code monitor for Mac', url: 'https://crewtower.app/claude-code', publisher: 'Said Altan', checked: '2026-10-10' },
		{ id: 'crewtower-codex', title: 'Codex monitor for Mac', url: 'https://crewtower.app/codex', publisher: 'Said Altan', checked: '2026-10-10' },
		{ id: 'crewtower-opencode', title: 'opencode session monitor for Mac', url: 'https://crewtower.app/opencode', publisher: 'Said Altan', checked: '2026-10-10' },
		{ id: 'crewtower-jump', title: 'Jump to the exact terminal tab', url: 'https://crewtower.app/jump-to-terminal', publisher: 'Said Altan', checked: '2026-10-10' },
		{ id: 'crewtower-changelog', title: 'Changelog', url: 'https://crewtower.app/changelog', publisher: 'Said Altan', checked: '2026-10-10' },
		{ id: 'crewtower-appcast', title: 'Crew Tower appcast', url: 'https://dl.crewtower.app/appcast.xml', publisher: 'Said Altan', checked: '2026-10-10' },
		{ id: 'crewtower-privacy', title: 'Privacy', url: 'https://crewtower.app/privacy', publisher: 'Said Altan', checked: '2026-10-10' },
		{ id: 'crewtower-terms', title: 'Terms', url: 'https://crewtower.app/terms', publisher: 'Said Altan', checked: '2026-10-10' },
		{ id: 'crewtower-llms', title: 'llms.txt', url: 'https://crewtower.app/llms.txt', publisher: 'Said Altan', checked: '2026-10-10' },
		{ id: 'crewtower-alternativeto', title: 'Crew Tower', url: 'https://alternativeto.net/software/crew-tower/about/', publisher: 'AlternativeTo', checked: '2026-10-10' }
	]
};
