// Splash vs Episko. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const EPISKO: Comparison = {
	slug: 'episko',
	name: 'Episko',
	description: 'How Splash and Episko compare on agents, platforms, worktrees, tasks, review and GitHub, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Episko are free, MIT-licensed desktop apps for running several coding agents at once, with git worktrees to keep their work apart. Episko, a Tauri app, runs each agent’s own terminal interface and tracks Claude Code through hooks and Codex through its App Server; Splash drives agents over the Agent Client Protocol and renders their work as a transcript.',
	other: {
		name: 'Episko',
		url: 'https://episko.dev/',
		maker: 'Respeak',
		summary: 'A desktop session manager that runs each coding agent’s CLI in its own terminal pane, reads status, cost and permission prompts from Claude Code and Codex, and adds a GitHub-backed project dashboard.',
		cite: ['episko-readme', 'episko-home']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop session manager that runs each coding agent in its own terminal pane and collects all sessions in one window', cite: ['episko-readme', 'episko-home'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v0.34.0 (9 October 2026), released often since July 2026; the README describes it as early but used daily', cite: ['episko-release', 'episko-changelog', 'episko-readme'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (MIT), copyright Respeak GmbH', cite: ['episko-license', 'episko-readme'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free, with no paid plan documented; agents run on your own Anthropic or Codex access', cite: ['episko-home', 'episko-readme', 'episko-llms'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS on Apple silicon and Windows 10/11 x64; no Intel Mac build, and Linux isn’t packaged yet', cite: ['episko-readme', 'episko-home', 'episko-llms', 'episko-release'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Tauri v2: a Rust backend and a vanilla TypeScript frontend in the system webview, with xterm.js terminals', cite: ['episko-readme'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code and Codex as integrated providers; 20 other CLIs, such as Amp, Cursor, Gemini, GitHub Copilot and OpenCode, run terminal-only', cite: ['episko-readme', 'episko-sessions', 'episko-changelog'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each agent’s own TUI in a PTY. Claude reports through per-launch hooks to a local server; Codex through a loopback App Server', cite: ['episko-readme', 'episko-sessions', 'episko-providers'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Starts agent CLIs from your PATH, which use your own Anthropic or Codex access; Episko supplies no model access', cite: ['episko-llms', 'episko-readme', 'episko-sessions'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'None; an optional self-hosted sync server pairs machines through an invite or a team registration code', cite: ['episko-home', 'episko-server', 'episko-changelog'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'In-app for Claude and Codex, with a risk read and allow, deny or open terminal; launch mode per agent and project', mark: 'partial', cite: ['episko-readme', 'episko-changelog', 'episko-sessions'] } },
				{
					label: 'Usage and limits',
					hint: 'Cost, context and plan limits',
					splash: { text: 'Context and cost readouts when the agent reports them', mark: 'yes', cite: ['splash-features'] },
					other: { text: 'For Claude and Codex: cost (estimated for Codex), context, and 5-hour and weekly limit windows; a usage dashboard and Claude burn forecast', mark: 'partial', cite: ['episko-readme', 'episko-sessions'] }
				}
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'The repo, or a git worktree the new-session dialog creates beside it in .cc-worktrees; sessions follow an agent into another checkout', mark: 'yes', cite: ['episko-readme', 'episko-worktree', 'episko-changelog'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Runs existing project tasks in panes, by hand or after an agent’s turn; lists running dev servers. No worktree setup step documented', mark: 'partial', cite: ['episko-readme', 'episko-changelog'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'Every session is a PTY; ⌘/Ctrl+T opens a plain shell beside it. On macOS, Claude can run in Ghostty, Terminal.app or iTerm2', mark: 'yes', cite: ['episko-readme'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Status glyphs, with sessions awaiting a decision on top and in the header and tray; terminal-only agents show a plain »', mark: 'partial', cite: ['episko-readme', 'episko-changelog'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'Optional sounds for ten events, such as a permission request or failed turn; they can stay silent while Episko is in front', mark: 'yes', cite: ['episko-changelog'] } },
				{
					label: 'Team sharing',
					hint: 'What teammates can see',
					splash: { text: 'splash-server is a personal, single-user service, not a multi-user deployment', mark: 'no', cite: ['splash-server'] },
					other: { text: 'Notes and a generated work log can be committed under .episko/; an optional self-hosted server shows teammates’ live sessions and issue claims', mark: 'yes', cite: ['episko-readme', 'episko-changelog', 'episko-server'] }
				}
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'PR-style diff overlay with side-by-side view and copyable code-health findings; commit, stash or discard down to a hunk. Line comments aren’t documented', mark: 'yes', cite: ['episko-changelog', 'episko-claude-md'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'No PR creation or merging documented; the dashboard pulls, pushes and switches branches, and the review overlay commits', mark: 'no', cite: ['episko-changelog', 'episko-dependencies'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Via the gh CLI: open issues and PRs per project, bot PRs with check and merge state, and in-app issue and PR readers', mark: 'yes', cite: ['episko-readme', 'episko-dashboard', 'episko-dependencies', 'episko-changelog'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'GitHub issues: dispatching an agent claims the issue, then releases it. GitLab remotes get no issue column; no Linear or Jira documented', mark: 'partial', cite: ['episko-readme', 'episko-sessions'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'No SSH hosts, web client or phone app documented; an optional self-hosted sync server shares settings, spend and team presence across machines', mark: 'no', cite: ['episko-readme', 'episko-server', 'episko-changelog'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Checks for the latest GitHub release at launch and offers to install it in the app; it never updates unasked', mark: 'yes', cite: ['episko-readme'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Sessions started outside the app', splash: S.history, other: { text: 'Claude Code sessions started elsewhere are listed read-only with jump-to-terminal; Claude and Codex history reopens where it stopped', mark: 'partial', cite: ['episko-readme', 'episko-manifest'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'One History list of Claude transcripts and Codex threads you can search and filter by project and day; other agents aren’t included', mark: 'partial', cite: ['episko-readme', 'episko-manifest'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Episko runs each agent’s own TUI in a PTY. For Claude Code it writes a per-launch settings file whose hooks post to a localhost server, with permission hooks waiting for your answer; for Codex it starts a loopback <code>codex app-server</code>. Its docs don’t mention ACP. Splash speaks the <strong>Agent Client Protocol</strong> to every agent and draws the transcript itself.',
			cite: ['episko-readme', 'episko-providers', 'episko-sessions', 'splash-readme', 'acp']
		},
		{
			title: 'What each agent gets',
			text: 'Episko’s phase, cost, context, in-app permissions, history and resume cover Claude Code and Codex; 20 other CLIs run in a plain terminal pane. The website describes a Claude Code session manager, and the changelog adds Codex and 20 more agents in 0.22.0. Splash shows every agent in one transcript view; its controls depend on what each agent reports.',
			cite: ['episko-changelog', 'episko-providers', 'episko-home', 'episko-llms', 'splash-agents', 'splash-readme']
		},
		{
			title: 'Around the session',
			text: 'Episko surrounds its sessions with the project: a dashboard of GitHub issues and pull requests, agents dispatched at issues, the project’s own tasks in panes, running dev servers, plan-limit tracking and shared notes. Splash centers on the conversation: a <strong>Needs attention</strong> queue, a review screen with feedback, transcript search and imported agent history.',
			cite: ['episko-readme', 'episko-changelog', 'episko-dashboard', 'splash-features', 'splash-history']
		},
		{
			title: 'Where each one runs',
			text: 'Episko ships for macOS on Apple silicon and Windows x64, runs agents on your computer, and offers updates in the app; an optional self-hosted server syncs settings and team presence. Splash ships for macOS (Apple silicon and Intel), Windows 11 x64 and Ubuntu 24.04, and <code>splash-server</code> runs on another machine you open in a browser over an SSH tunnel.',
			cite: ['episko-readme', 'episko-release', 'episko-server', 'splash-install', 'splash-server']
		}
	],
	fit: {
		splash: [
			'You want every agent shown in one transcript, with messages, tool calls and permission requests drawn over the Agent Client Protocol.',
			'You work on an Intel Mac or Ubuntu, or want sessions on your own server, opened in a browser over SSH.',
			'You want to import conversations your agents started elsewhere and search their saved text, archived sessions included.',
			'You want a GitHub view of issues, pull requests and Actions runs across many repositories.'
		],
		other: [
			'You use Claude Code or Codex in their own terminal interfaces and want their status, cost and permission prompts in one window.',
			'You want your project’s existing tasks run in panes beside the agents, with running dev servers listed.',
			'You want to dispatch agents at GitHub issues and have each issue claimed and released for you.',
			'You want Claude’s 5-hour and weekly limits tracked, and notes and a work log shared with your team.'
		]
	},
	sources: [
		{ id: 'episko-home', title: 'Claude Code session manager for macOS & Windows', url: 'https://episko.dev/', publisher: 'Respeak GmbH', checked: '2026-10-10' },
		{ id: 'episko-llms', title: 'llms.txt', url: 'https://episko.dev/llms.txt', publisher: 'Respeak GmbH', checked: '2026-10-10' },
		{ id: 'episko-readme', title: 'README.md', url: 'https://github.com/respeak-io/episko/blob/main/README.md', publisher: 'respeak-io/episko on GitHub', checked: '2026-10-10' },
		{ id: 'episko-license', title: 'LICENSE', url: 'https://github.com/respeak-io/episko/blob/main/LICENSE', publisher: 'respeak-io/episko on GitHub', checked: '2026-10-10' },
		{ id: 'episko-changelog', title: 'CHANGELOG.md', url: 'https://github.com/respeak-io/episko/blob/main/CHANGELOG.md', publisher: 'respeak-io/episko on GitHub', checked: '2026-10-10' },
		{ id: 'episko-release', title: 'Release v0.34.0', url: 'https://github.com/respeak-io/episko/releases/tag/v0.34.0', publisher: 'respeak-io/episko on GitHub', checked: '2026-10-10' },
		{ id: 'episko-sessions', title: 'docs/sessions.md', url: 'https://github.com/respeak-io/episko/blob/main/docs/sessions.md', publisher: 'respeak-io/episko on GitHub', checked: '2026-10-10' },
		{ id: 'episko-providers', title: 'docs/providers.md', url: 'https://github.com/respeak-io/episko/blob/main/docs/providers.md', publisher: 'respeak-io/episko on GitHub', checked: '2026-10-10' },
		{ id: 'episko-manifest', title: 'src/providers/manifest.json', url: 'https://github.com/respeak-io/episko/blob/main/src/providers/manifest.json', publisher: 'respeak-io/episko on GitHub', checked: '2026-10-10' },
		{ id: 'episko-worktree', title: 'src/worktree.ts', url: 'https://github.com/respeak-io/episko/blob/main/src/worktree.ts', publisher: 'respeak-io/episko on GitHub', checked: '2026-10-10' },
		{ id: 'episko-server', title: 'episko-server/README.md', url: 'https://github.com/respeak-io/episko/blob/main/episko-server/README.md', publisher: 'respeak-io/episko on GitHub', checked: '2026-10-10' },
		{ id: 'episko-dashboard', title: 'docs/dashboard.md', url: 'https://github.com/respeak-io/episko/blob/main/docs/dashboard.md', publisher: 'respeak-io/episko on GitHub', checked: '2026-10-10' },
		{ id: 'episko-dependencies', title: 'docs/dependencies.md', url: 'https://github.com/respeak-io/episko/blob/main/docs/dependencies.md', publisher: 'respeak-io/episko on GitHub', checked: '2026-10-10' },
		{ id: 'episko-claude-md', title: 'CLAUDE.md', url: 'https://github.com/respeak-io/episko/blob/main/CLAUDE.md', publisher: 'respeak-io/episko on GitHub', checked: '2026-10-10' }
	]
};
