// Splash vs Lanes Desktop. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const LANES: Comparison = {
	slug: 'lanes',
	name: 'Lanes Desktop',
	description: 'How Splash and Lanes Desktop compare on agents, platforms, pricing, worktrees, review and team features, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Lanes Desktop both run several coding agents at once and can give work its own git worktree. Lanes Desktop, a macOS app, organizes sessions around issues on a board and runs the Claude Code or Codex CLI in a terminal; Splash drives agents over the Agent Client Protocol and shows each session as a transcript.',
	other: {
		name: 'Lanes Desktop',
		url: 'https://lanes.sh/desktop',
		maker: 'Lanes',
		summary: 'A macOS app that lays out coding work as issues on a board, can give each issue a git worktree, and runs Claude Code or Codex in a terminal. Pro adds teammates and roles.',
		cite: ['lanes-readme', 'lanes-worktrees', 'lanes-harness', 'lanes-pricing']
	},
	groups: [
		{ title: 'The basics', rows: [
			{ label: 'What it is', splash: S.formFactor, other: { text: 'macOS app that runs agent sessions on issues arranged as a board; a separate web dashboard handles forms, API keys and billing', cite: ['lanes-readme', 'lanes-v045'] } },
			{ label: 'Release status', splash: S.maturity, other: { text: 'v0.49.6 of 6 October 2026, a bug-fix release; the MCP server, Gateway and Local LLMs are research previews', cite: ['lanes-release', 'lanes-local-mcp', 'lanes-readme'] } },
			{ label: 'License', splash: S.license, other: { text: 'Sources conflict: the README says proprietary, all rights reserved, and the repo has no app source; the website calls it open source', cite: ['lanes-readme', 'lanes-home', 'lanes-desktop'] } },
			{ label: 'Price', splash: S.price, other: { text: 'Free for one user; Pro $19 a month for up to 10 members; Enterprise custom. The desktop app is in every plan', cite: ['lanes-pricing'] } },
			{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS Ventura or later, universal for Apple silicon and Intel; other systems are on the roadmap, with an open Windows and Linux request', cite: ['lanes-readme', 'lanes-desktop', 'lanes-issue-7'] } }
		] },
		{ title: 'Agents', rows: [
			{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code and OpenAI Codex, with more CLIs planned; other CLIs start in a bare terminal, without status tracking or resume', cite: ['lanes-harness', 'lanes-readme', 'lanes-desktop'] } },
			{ label: 'How it runs agents', splash: S.protocol, other: { text: 'The vendor’s Claude Code or Codex CLI, run interactively in a pseudo-terminal; state comes from its transcripts. No Agent SDK or ACP', cite: ['lanes-desktop', 'lanes-billing-split', 'lanes-harness'] } },
			{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Your existing CLI login or API key, billed by your provider; Gateway profiles can point Claude Code at other model providers', cite: ['lanes-desktop', 'lanes-subscription', 'lanes-gateway'] } },
			{ label: 'Account required', splash: S.account, other: { text: 'The app has a Google sign-in, and team features use a Lanes account; the docs don’t say whether local use requires it', cite: ['lanes-terms', 'lanes-google-verification', 'lanes-collaboration'] } },
			{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Answered in the agent CLI’s own terminal while the card shows Awaiting input; per-repo flags can pass options like --dangerously-skip-permissions', mark: 'yes', cite: ['lanes-sessions', 'lanes-loops', 'lanes-settings'] } },
			{ label: 'MCP servers', splash: S.mcp, other: { text: 'Its own MCP server (research preview) with issue, session, GitHub and Linear tools; also registers Lanes Link with Claude Code or Codex', mark: 'partial', cite: ['lanes-local-mcp', 'lanes-link-desktop'] } }
		] },
		{ title: 'Working in parallel', rows: [
			{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A git worktree per issue under .worktrees/ on a generated branch, or the project folder; several sessions on one issue share it', mark: 'yes', cite: ['lanes-worktrees', 'lanes-sessions'] } },
			{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'The README lists setup and teardown scripts, which no docs page explains; quick commands run in the worktree; dev-server ports are manual', mark: 'partial', cite: ['lanes-readme', 'lanes-worktrees'] } },
			{ label: 'What needs you', splash: S.attention, other: { text: 'Issue cards show Busy, Awaiting input, Stopped, Exited or Error, and an orange bell when waiting; the status bar totals cost', mark: 'yes', cite: ['lanes-sessions', 'lanes-quick-start'] } },
			{ label: 'Notifications', splash: S.notifications, other: { text: 'Sounds for workflow events, such as an issue reaching Done; system notifications for a waiting agent aren’t documented', mark: 'partial', cite: ['lanes-settings'] } },
			{ label: 'Team collaboration', hint: 'Several people on one project', splash: { text: 'splash-server is a personal, single-user service, not a multi-user deployment', mark: 'no', cite: ['splash-server'] }, other: { text: 'On Pro: shared remote workspaces with synced boards, chat, presence and issue locks; the pricing table marks remote workspaces coming soon', mark: 'partial', cite: ['lanes-readme', 'lanes-collaboration', 'lanes-pricing'] } },
			{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'A loop agent you build on the Desktop MCP can start sessions, check their diffs and take the next issue', mark: 'partial', cite: ['lanes-desktop', 'lanes-loops'] } }
		] },
		{ title: 'Review and shipping', rows: [
			{ label: 'Review changes', splash: S.review, other: { text: 'Read-only inline diffs in a Changes pane; diff comments aren’t documented, so feedback goes into the terminal or a Review Changes command', mark: 'yes', cite: ['lanes-git', 'lanes-quick-commands'] } },
			{ label: 'Files and diffs', splash: S.files, other: { text: 'A Monaco editor and file tree, diffs against the last commit or the issue’s base branch, and read-only SQL on SQLite files', mark: 'yes', cite: ['lanes-readme', 'lanes-git'] } },
			{ label: 'Create pull requests', splash: S.prs, other: { text: 'Commit, push and open a PR from the issue panel; the board then shows each branch’s PR state, but not CI checks', mark: 'yes', cite: ['lanes-readme', 'lanes-v049'] } },
			{ label: 'GitHub', splash: S.github, other: { text: 'Imports GitHub Issues over OAuth, opens PRs with the local gh CLI and shows PR state; merges happen locally via Complete & Merge', mark: 'yes', cite: ['lanes-github', 'lanes-v049', 'lanes-worktrees'] } },
			{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'GitHub Issues and Linear over OAuth, imported and refreshed in the app, with agents commenting back via MCP; no Jira or GitLab', mark: 'yes', cite: ['lanes-desktop', 'lanes-integrations', 'lanes-issue-20'] } }
		] },
		{ title: 'Where it runs', rows: [
			{ label: 'Remote access', splash: S.remote, other: { text: 'Agents run on your Mac; remote workspaces sync board data, not agents. An open GitHub issue asks for SSH workspaces', mark: 'no', cite: ['lanes-terms', 'lanes-trust', 'lanes-issue-6'] } },
			{ label: 'Auto-update', splash: S.updates, other: { text: 'Updates itself on launch, and the bundled lanes CLI updates with it; Homebrew installs it too', mark: 'yes', cite: ['lanes-readme', 'lanes-developers'] } }
		] },
		{ title: 'History and search', rows: [
			{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented; Lanes resumes the Claude Code and Codex sessions it started, and the Process Manager lists outside CLI processes', mark: 'unknown', cite: ['lanes-sessions', 'lanes-v049', 'lanes-process-manager'] } },
			{ label: 'Search transcripts', splash: S.search, other: { text: 'Not documented; a History tab renders each Lanes session’s transcript', mark: 'unknown', cite: ['lanes-v049'] } }
		] }
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Lanes Desktop runs the vendor’s <strong>Claude Code</strong> or <strong>Codex</strong> CLI interactively in a pseudo-terminal and reads the transcripts it writes to track state; Lanes says it uses no Agent SDK, <code>claude -p</code> or ACP, and other CLIs run as bare shells. Splash talks to every agent over the <strong>Agent Client Protocol</strong> and draws messages, tool calls and permission requests itself.',
			cite: ['lanes-desktop', 'lanes-billing-split', 'lanes-harness', 'lanes-sessions', 'splash-registry', 'splash-readme', 'acp']
		},
		{
			title: 'Platforms and where agents run',
			text: 'Lanes Desktop is a macOS app (Ventura or later); other platforms are on its roadmap, and agents run on the Mac, with remote workspaces syncing board data rather than running agents. Splash builds for macOS, Windows and Ubuntu, and <code>splash-server</code> runs sessions on the machine that holds your code, which you open in a browser over an SSH tunnel.',
			cite: ['lanes-readme', 'lanes-desktop', 'lanes-terms', 'lanes-trust', 'splash-install', 'splash-server']
		},
		{
			title: 'Price, accounts and license',
			text: 'Lanes has a Free plan for one user, Pro at $19 a month for up to 10 members, and custom Enterprise; the desktop app is in all three. Sources disagree on its license: the README says proprietary, the website says open source, and the Apache-2.0 license covers the separate Lanes Link. Splash is free, MIT-licensed and has no accounts.',
			cite: ['lanes-pricing', 'lanes-readme', 'lanes-home', 'lanes-link-license', 'splash-license', 'splash-download', 'splash-build']
		},
		{
			title: 'Models and providers',
			text: 'Lanes Desktop can point Claude Code at other providers through <strong>Gateway</strong> profiles and run local models through Ollama with <strong>Local LLMs</strong>, both research previews; Lanes doesn’t proxy model requests. Splash runs each agent with the login you gave its CLI and offers the model, mode and effort choices the agent reports.',
			cite: ['lanes-gateway', 'lanes-local-llms', 'lanes-readme', 'lanes-desktop', 'splash-agents', 'splash-features']
		},
		{
			title: 'Around the session',
			text: 'Lanes Desktop works from an issue board: GitHub and Linear issues come in over OAuth, each can get a worktree and several sessions, and it adds a Monaco editor, a Changes pane, PR creation and an MCP server for loops. Splash centers on the conversation: a Needs attention queue, a review screen, transcript search and importing sessions agents started elsewhere.',
			cite: ['lanes-readme', 'lanes-desktop', 'lanes-worktrees', 'lanes-sessions', 'lanes-local-mcp', 'lanes-loops', 'splash-features', 'splash-history']
		}
	],
	fit: {
		splash: [
			'You want a free, MIT-licensed app that needs no account.',
			'You work on Windows or Ubuntu as well as macOS, or want to run sessions on your own server over SSH.',
			'You want Gemini, Copilot, Goose and other agents alongside Claude Code and Codex, all over the Agent Client Protocol.',
			'You want to import conversations your agents started outside the app and search them with the rest.'
		],
		other: [
			'You want to plan work as issues on a board, pulled in from GitHub or Linear, with a worktree and several sessions per issue.',
			'You want the Claude Code and Codex terminal interfaces as they are, with your existing CLI logins.',
			'You want a code editor, a git Changes pane and PR creation in the same app as your agents.',
			'You want an MCP server your own agent loops can drive, or Gateway profiles for other model providers.'
		]
	},
	sources: [
		{ id: 'lanes-desktop', title: 'Lanes Desktop', url: 'https://lanes.sh/desktop', publisher: 'Lanes', checked: '2026-10-10' },
		{ id: 'lanes-home', title: 'Run your agentic fleet at scale', url: 'https://lanes.sh/', publisher: 'Lanes', checked: '2026-10-10' },
		{ id: 'lanes-readme', title: 'lanes-sh/app', url: 'https://github.com/lanes-sh/app', publisher: 'lanes-sh/app on GitHub', checked: '2026-10-10' },
		{ id: 'lanes-release', title: 'Lanes v0.49.6', url: 'https://github.com/lanes-sh/app/releases/tag/v0.49.6', publisher: 'lanes-sh/app on GitHub', checked: '2026-10-10' },
		{ id: 'lanes-issue-7', title: 'Request: Support Windows and Linux builds', url: 'https://github.com/lanes-sh/app/issues/7', publisher: 'lanes-sh/app on GitHub', checked: '2026-10-10' },
		{ id: 'lanes-issue-6', title: 'Feature Request: Remote SSH Workspace Support', url: 'https://github.com/lanes-sh/app/issues/6', publisher: 'lanes-sh/app on GitHub', checked: '2026-10-10' },
		{ id: 'lanes-issue-20', title: 'Is it possible to add the gitlab support?', url: 'https://github.com/lanes-sh/app/issues/20', publisher: 'lanes-sh/app on GitHub', checked: '2026-10-10' },
		{ id: 'lanes-link-license', title: 'LICENSE', url: 'https://github.com/lanes-sh/link/blob/main/LICENSE', publisher: 'lanes-sh/link on GitHub', checked: '2026-10-10' },
		{ id: 'lanes-pricing', title: 'Pricing', url: 'https://lanes.sh/pricing', publisher: 'Lanes', checked: '2026-10-10' },
		{ id: 'lanes-terms', title: 'Terms & Conditions', url: 'https://lanes.sh/terms/terms-and-conditions', publisher: 'Lanes', checked: '2026-10-10' },
		{ id: 'lanes-trust', title: 'Trust Center', url: 'https://lanes.sh/trust', publisher: 'Lanes', checked: '2026-10-10' },
		{ id: 'lanes-developers', title: 'Lanes for developers and agents', url: 'https://lanes.sh/developers', publisher: 'Lanes', checked: '2026-10-10' },
		{ id: 'lanes-quick-start', title: 'Quick start', url: 'https://lanes.sh/docs/desktop/quick-start', publisher: 'Lanes', checked: '2026-10-10' },
		{ id: 'lanes-harness', title: 'Harness', url: 'https://lanes.sh/docs/desktop/harness', publisher: 'Lanes', checked: '2026-10-10' },
		{ id: 'lanes-sessions', title: 'Working with Sessions', url: 'https://lanes.sh/docs/desktop/sessions', publisher: 'Lanes', checked: '2026-10-10' },
		{ id: 'lanes-gateway', title: 'Gateway', url: 'https://lanes.sh/docs/desktop/gateway', publisher: 'Lanes', checked: '2026-10-10' },
		{ id: 'lanes-local-llms', title: 'Local LLMs', url: 'https://lanes.sh/docs/desktop/local-llms', publisher: 'Lanes', checked: '2026-10-10' },
		{ id: 'lanes-settings', title: 'Settings & Configuration', url: 'https://lanes.sh/docs/desktop/settings', publisher: 'Lanes', checked: '2026-10-10' },
		{ id: 'lanes-worktrees', title: 'Worktree Management', url: 'https://lanes.sh/docs/desktop/worktrees', publisher: 'Lanes', checked: '2026-10-10' },
		{ id: 'lanes-git', title: 'Git Integration', url: 'https://lanes.sh/docs/desktop/git-integration', publisher: 'Lanes', checked: '2026-10-10' },
		{ id: 'lanes-quick-commands', title: 'Quick Commands', url: 'https://lanes.sh/docs/desktop/quick-commands', publisher: 'Lanes', checked: '2026-10-10' },
		{ id: 'lanes-github', title: 'GitHub Integration', url: 'https://lanes.sh/docs/desktop/github-integration', publisher: 'Lanes', checked: '2026-10-10' },
		{ id: 'lanes-collaboration', title: 'Collaboration', url: 'https://lanes.sh/docs/desktop/collaboration', publisher: 'Lanes', checked: '2026-10-10' },
		{ id: 'lanes-local-mcp', title: 'Lanes Desktop MCP', url: 'https://lanes.sh/docs/desktop/local-mcp', publisher: 'Lanes', checked: '2026-10-10' },
		{ id: 'lanes-loops', title: 'Building Loops', url: 'https://lanes.sh/docs/desktop/loops', publisher: 'Lanes', checked: '2026-10-10' },
		{ id: 'lanes-process-manager', title: 'Process Manager', url: 'https://lanes.sh/docs/desktop/process-manager', publisher: 'Lanes', checked: '2026-10-10' },
		{ id: 'lanes-google-verification', title: 'Google verification', url: 'https://lanes.sh/docs/link/google-verification', publisher: 'Lanes', checked: '2026-10-10' },
		{ id: 'lanes-billing-split', title: 'Anthropic just split the bill. Lanes did not have to change.', url: 'https://lanes.sh/blog/claude-billing-split', publisher: 'Lanes', checked: '2026-10-10' },
		{ id: 'lanes-subscription', title: 'Run agent fleets on your Claude subscription', url: 'https://lanes.sh/use-cases/keep-your-claude-subscription', publisher: 'Lanes', checked: '2026-10-10' },
		{ id: 'lanes-integrations', title: 'Run Claude Code/Codex sessions on GitHub and Linear issues', url: 'https://lanes.sh/blog/integrations-have-arrived', publisher: 'Lanes', checked: '2026-10-10' },
		{ id: 'lanes-link-desktop', title: 'Lanes Link is now available in the desktop app', url: 'https://lanes.sh/blog/lanes-link-in-the-desktop', publisher: 'Lanes', checked: '2026-10-10' },
		{ id: 'lanes-v045', title: 'What’s New in v0.45: Forms, a Dashboard, and a Revamped MCP', url: 'https://lanes.sh/blog/whats-new-v045', publisher: 'Lanes', checked: '2026-10-10' },
		{ id: 'lanes-v049', title: 'What’s New in v0.49', url: 'https://lanes.sh/blog/whats-new-v049-astra-is-a-banger-and-codex-got-a-lot-better', publisher: 'Lanes', checked: '2026-10-10' }
	]
};
