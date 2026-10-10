// Splash vs Xirp. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const XIRP: Comparison = {
	slug: 'xirp',
	name: 'Xirp',
	description: 'How Splash and Xirp compare on agents, platforms, pricing, worktrees, review and Portal context, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Xirp both run several coding agents at once, with an optional git worktree per session. Xirp, a beta Mac app from Spotify, runs each agent’s own CLI in a persistent terminal and can connect to Spotify Portal. Splash, a desktop app for macOS, Windows and Ubuntu, drives agents over the Agent Client Protocol.',
	other: {
		name: 'Xirp',
		url: 'https://xirp.spotify.com/',
		maker: 'Spotify',
		summary: 'A beta macOS app that organizes sessions of third-party coding agents, each run through its own CLI in a persistent terminal, across projects and git worktrees. Linking Spotify Portal brings in catalog and Workspace context.',
		cite: ['xirp-docs', 'xirp-plans', 'xirp-sessions']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Mac desktop app that runs third-party coding agents in persistent terminal sessions across projects, plus an xirp command-line tool', cite: ['xirp-docs', 'xirp-plans', 'xirp-sessions'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'Beta, under Preview Terms that call it experimental; the update manifest lists 0.51.0 (10 October 2026), the changelog ends at v0.50.0', cite: ['xirp-docs', 'xirp-terms', 'xirp-update-manifest', 'xirp-changelog'] } },
				{ label: 'License', splash: S.license, other: { text: 'Proprietary and not open source; Spotify keeps all rights to the app', cite: ['xirp-faq', 'xirp-plans', 'xirp-terms'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free for now during the beta; Xirp + Portal Foundations is free for 60 days, then priced on request', cite: ['xirp-plans'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS, Apple silicon and Intel (DMG or install script); Windows and Linux have a waitlist', cite: ['xirp-download', 'xirp-faq', 'xirp-plans'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code, Codex, Gemini CLI, Pi and Cursor; the website and Preview Terms list the first three', cite: ['xirp-docs', 'xirp-changelog', 'xirp-plans', 'xirp-home', 'xirp-terms'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each agent’s own CLI in a persistent terminal, with tmux required and session hooks reporting state; no agent protocol is documented', cite: ['xirp-sessions', 'xirp-getting-started', 'xirp-settings'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Your own agent accounts, signed in through each agent’s CLI; the Preview Terms make those agents your own procurement', cite: ['xirp-docs', 'xirp-getting-started', 'xirp-terms'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'A Spotify Technology account with a work email, separate from personal Spotify; downloading needs none, and Portal is optional', cite: ['xirp-getting-started', 'xirp-faq', 'xirp-changelog', 'xirp-docs'] } },
				{
					label: 'Switch agents in a session',
					hint: 'Another agent in the same session',
					splash: { text: 'Each session runs one agent in one project folder', mark: 'no', cite: ['splash-readme'] },
					other: { text: 'Switch to another installed agent mid-session; Xirp relaunches it and says whether the history carried over', mark: 'yes', cite: ['xirp-sessions', 'xirp-changelog'] }
				},
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'With Portal linked, Claude, Codex, Gemini and Cursor sessions get Portal’s MCP tools; no in-app MCP settings are documented', mark: 'partial', cite: ['xirp-and-portal', 'xirp-launching-sessions', 'xirp-changelog'] } },
				{
					label: 'Usage and cost',
					hint: 'Tokens, spend and context',
					splash: { text: 'Shows context use and cost when the agent reports them', mark: 'yes', cite: ['splash-features'] },
					other: { text: 'Estimated tokens and spend by session and day, a daily spend alert, and context-window use in the toolbar', mark: 'yes', cite: ['xirp-settings', 'xirp-sessions'] }
				}
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Optional per session: a fresh git worktree on its own branch, or the main checkout; multi-project sessions get one per project', mark: 'yes', cite: ['xirp-getting-started', 'xirp-sessions', 'xirp-changelog'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Setup and cleanup scripts per project for each worktree; local URLs a session prints open in the browser panel', mark: 'yes', cite: ['xirp-settings', 'xirp-changelog'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'Each session is a full terminal, with split panes, extra shells and a grid view; sessions keep running after you quit', mark: 'yes', cite: ['xirp-sessions', 'xirp-changelog'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'A browser panel next to the terminal; annotations on page elements go to the agent as comments', mark: 'yes', cite: ['xirp-sessions'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Session hooks drive Working, Idle, Waiting, Queued, Completed and Failed states in the minimap and project overview', mark: 'yes', cite: ['xirp-sessions'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'Desktop alerts and sounds, a notification center with dismiss and snooze, an optional digest mode and a Dock badge', mark: 'yes', cite: ['xirp-settings', 'xirp-changelog'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Agents start other sessions and message them through the xirp CLI; children nest under the parent, and recipients can reply', mark: 'yes', cite: ['xirp-sessions', 'xirp-changelog'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'An inline review panel with inline or split diffs; annotate passages of an agent reply and send them back together', mark: 'yes', cite: ['xirp-sessions', 'xirp-changelog'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'Files tab: tree and editor with Markdown and Mermaid preview. Git tab: changes, branches, history and commits', mark: 'yes', cite: ['xirp-projects'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Follows pull request status for supported remotes, marks approved, passing PRs as ready, and has a PR review pane', mark: 'yes', cite: ['xirp-and-portal', 'xirp-changelog'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'None documented in Xirp itself; a Portal Workspace can give agents Linear issues, projects and status through Portal’s MCP endpoint', mark: 'partial', cite: ['xirp-plans', 'xirp-workspaces', 'xirp-launching-sessions'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'The FAQs say everything runs on your Mac, with no cloud, server or SSH hosting; the home page mentions remote sessions', mark: 'no', cite: ['xirp-faq', 'xirp-plans', 'xirp-home'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Imports 30 days of Claude Code history and takes over live Claude Code sessions; the CLI also imports Cursor sessions', mark: 'partial', cite: ['xirp-changelog', 'xirp-sessions'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Not documented; project history filters sessions by name, goal, branch or last message, and Cmd+K finds sessions', mark: 'unknown', cite: ['xirp-projects', 'xirp-sessions'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Xirp runs each supported agent’s own CLI in a persistent terminal, permission prompts included, and reads working, idle and waiting states from session hooks. Spotify decides which agents it supports; the docs list five. Splash connects to every agent over the <strong>Agent Client Protocol</strong> and draws its messages, tool calls and permission requests as a transcript.',
			cite: ['xirp-sessions', 'xirp-getting-started', 'xirp-terms', 'xirp-docs', 'splash-readme', 'splash-registry', 'acp']
		},
		{
			title: 'Where it runs',
			text: 'Xirp runs on macOS during its beta, with Windows and Linux on a waitlist. Its FAQs say everything runs locally, with no cloud execution, server mode or SSH session hosting, though the home page mentions remote sessions. Splash builds for macOS, Windows 11 and Ubuntu 24.04, and <code>splash-server</code> runs agents on a machine you reach from a browser over SSH.',
			cite: ['xirp-faq', 'xirp-download', 'xirp-plans', 'xirp-home', 'splash-install', 'splash-server']
		},
		{
			title: 'Price, accounts and license',
			text: 'Xirp is proprietary and free for now during its beta; pairing it with Portal Foundations is free for 60 days, then priced on request. Signing in needs a Spotify Technology account with a work email. Splash is free, MIT-licensed and has no accounts; each agent runs with the login its own CLI already has.',
			cite: ['xirp-faq', 'xirp-plans', 'xirp-getting-started', 'splash-license', 'splash-download', 'splash-build', 'splash-agents']
		},
		{
			title: 'Spotify Portal',
			text: 'Xirp works on its own, and linking <strong>Spotify Portal</strong> adds catalog and Workspace context: sessions launched from a Workspace connect to Portal’s MCP endpoint, which can carry Linear issues and Google Drive docs. Splash has a GitHub view of issues, pull requests and Actions runs across repositories, through <code>gh</code>, and no Linear or Jira integration.',
			cite: ['xirp-docs', 'xirp-launching-sessions', 'xirp-plans', 'xirp-workspaces', 'splash-features', 'splash-github']
		},
		{
			title: 'Around the session',
			text: 'Xirp surrounds each terminal with a file editor, a browser panel with page annotations for the agent, estimated spend with daily alerts, mid-session agent switching and an <code>xirp</code> CLI that lets agents start and message other sessions. Splash centers on the conversation: a Needs attention queue, a review screen, full-text transcript search and importing conversations agents list over ACP.',
			cite: ['xirp-projects', 'xirp-sessions', 'xirp-settings', 'xirp-changelog', 'splash-features', 'splash-history']
		}
	],
	fit: {
		splash: [
			'You want a free, MIT-licensed app with no account, on Windows or Ubuntu as well as macOS.',
			'You want Copilot, OpenCode, Goose and other agents alongside Claude Code and Codex, all over the Agent Client Protocol.',
			'You want to run agents on your own server and use them from a browser over SSH.',
			'You want full-text search across saved transcripts and to import conversations agents list over ACP.'
		],
		other: [
			'You want each agent’s own terminal interface, with split panes, extra shells and a grid of live sessions.',
			'You want to switch a session to another agent, or let agents start and message other sessions through a CLI.',
			'You want a file editor, a browser panel and estimated spend with daily alerts next to your sessions.',
			'You use Spotify Portal and want its catalog, Workspaces and Linear context in your agents’ sessions.'
		]
	},
	sources: [
		{ id: 'xirp-home', title: 'Xirp home page', url: 'https://xirp.spotify.com/', publisher: 'Spotify', checked: '2026-10-10' },
		{ id: 'xirp-plans', title: 'Plans', url: 'https://xirp.spotify.com/plans', publisher: 'Spotify', checked: '2026-10-10' },
		{ id: 'xirp-download', title: 'Download Xirp', url: 'https://xirp.spotify.com/join-beta', publisher: 'Spotify', checked: '2026-10-10' },
		{ id: 'xirp-terms', title: 'Xirp Preview Terms', url: 'https://backstage.spotify.com/spotify-for-backstage-terms/xirp-preview-terms/', publisher: 'Spotify', checked: '2026-10-10' },
		{ id: 'xirp-update-manifest', title: 'Xirp macOS update manifest (latest-mac.yml)', url: 'https://reckless-finch.spotifycdn.com/external/latest-mac.yml', publisher: 'Spotify', checked: '2026-10-10' },
		{ id: 'xirp-docs', title: 'Xirp (docs overview)', url: 'https://backstage.spotify.com/docs/xirp', publisher: 'Spotify', checked: '2026-10-10' },
		{ id: 'xirp-getting-started', title: 'Get started with Xirp', url: 'https://backstage.spotify.com/docs/xirp/getting-started', publisher: 'Spotify', checked: '2026-10-10' },
		{ id: 'xirp-sessions', title: 'Sessions', url: 'https://backstage.spotify.com/docs/xirp/sessions', publisher: 'Spotify', checked: '2026-10-10' },
		{ id: 'xirp-projects', title: 'Projects', url: 'https://backstage.spotify.com/docs/xirp/projects', publisher: 'Spotify', checked: '2026-10-10' },
		{ id: 'xirp-settings', title: 'Settings', url: 'https://backstage.spotify.com/docs/xirp/settings', publisher: 'Spotify', checked: '2026-10-10' },
		{ id: 'xirp-faq', title: 'FAQ', url: 'https://backstage.spotify.com/docs/xirp/faq', publisher: 'Spotify', checked: '2026-10-10' },
		{ id: 'xirp-and-portal', title: 'Xirp and Portal', url: 'https://backstage.spotify.com/docs/xirp/xirp-and-portal', publisher: 'Spotify', checked: '2026-10-10' },
		{ id: 'xirp-workspaces', title: 'Workspaces', url: 'https://backstage.spotify.com/docs/xirp/workspaces', publisher: 'Spotify', checked: '2026-10-10' },
		{ id: 'xirp-launching-sessions', title: 'Launch and share Xirp sessions', url: 'https://backstage.spotify.com/docs/xirp/workspaces/launching-sessions', publisher: 'Spotify', checked: '2026-10-10' },
		{ id: 'xirp-changelog', title: 'Xirp changelog', url: 'https://backstage.spotify.com/docs/xirp/changelog', publisher: 'Spotify', checked: '2026-10-10' }
	]
};
