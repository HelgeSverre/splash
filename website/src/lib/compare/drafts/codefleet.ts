// Splash vs CodeFleet. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const CODEFLEET: Comparison = {
	slug: 'codefleet',
	name: 'CodeFleet',
	description: 'How Splash and CodeFleet compare on agents, platforms, pricing, worktrees, review and scheduling, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and CodeFleet both run several coding agents at once, each in the project folder or its own git worktree. CodeFleet is a closed-source macOS app with a free core and Pro features in a free preview; Splash is open source, runs on macOS, Windows and Ubuntu, and can run on a server you open in a browser.',
	other: {
		name: 'CodeFleet',
		url: 'https://codefleet.app/',
		maker: 'CodeFleet',
		summary: 'A native macOS app for running Claude Code, Codex, OpenCode and Grok Build side by side in git worktrees, with diffs, a terminal, a browser, a task board and Pro routines and orchestration.',
		cite: ['codefleet-home', 'codefleet-getting-started', 'codefleet-workflow', 'codefleet-pro']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Native macOS desktop app with a menu bar panel, plus a codefleet command-line tool for Pro', cite: ['codefleet-getting-started', 'codefleet-workflow', 'codefleet-tools'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v1.4.0, released 23 September 2026, after 1.0 on 12 July; Pro features are in a Preview and Handoff is experimental', cite: ['codefleet-changelog', 'codefleet-cask', 'codefleet-pro', 'codefleet-home'] } },
				{ label: 'License', splash: S.license, other: { text: 'Closed source; the terms give a revocable right to install and run it and bar resale and reverse engineering', cite: ['codefleet-terms', 'codefleet-home'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free, with no account or card; Pro features are free during a Preview, and paid Pro pricing isn’t published', cite: ['codefleet-home', 'codefleet-pro'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 12 or later, Apple silicon or Intel; no Windows, Linux or web version is documented', cite: ['codefleet-home', 'codefleet-developers'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code, Codex, OpenCode and Grok Build, plus a custom command; Gemini CLI support ended with 1.0', cite: ['codefleet-getting-started', 'codefleet-maintainers', 'codefleet-changelog'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Runs agent CLIs locally: a Chat view the docs describe as ACP, or each agent’s own TUI in a terminal tab', cite: ['codefleet-getting-started', 'codefleet-agents', 'codefleet-privacy'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Your own agent CLI logins, subscriptions or API keys, with keys settable per worktree; CodeFleet adds no token charges', cite: ['codefleet-home', 'codefleet-agents', 'codefleet-terms'] } },
				{ label: 'Model and mode pickers', splash: S.models, other: { text: 'Permission mode, model and reasoning effort pickers in the composer, where the agent supports them, with defaults per agent', mark: 'yes', cite: ['codefleet-agents', 'codefleet-changelog'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Chat shows tool approvals when the agent’s permission mode asks for them; delegated and CLI runs use read-only, allow-edits or full-auto', mark: 'yes', cite: ['codefleet-agents', 'codefleet-tools'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Settings manage Claude Code and Codex MCP servers; codefleet mcp (Pro) exposes CodeFleet’s own controls as MCP tools', mark: 'yes', cite: ['codefleet-reference', 'codefleet-tools'] } },
				{ label: 'Usage figures', splash: { text: 'Context and cost readouts when the agent reports them', mark: 'yes', cite: ['splash-features'] }, other: { text: 'Usage statistics for the last seven days free; Pro adds 30-day and all-time ranges and per-model breakdowns', mark: 'yes', cite: ['codefleet-tools', 'codefleet-pro'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A git worktree on its own branch per task, which archives and restores intact; 1.4 added chats in the project checkout', mark: 'yes', cite: ['codefleet-getting-started', 'codefleet-developers', 'codefleet-workflow', 'codefleet-changelog'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'A run command (⌘R) opens in a terminal tab, and worktrees run project scripts; automatic setup and port handling aren’t documented', mark: 'partial', cite: ['codefleet-changelog', 'codefleet-agents'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'A menu bar panel and an activity feed of finished, waiting and running work; questions from agents appear in focused cards', mark: 'yes', cite: ['codefleet-workflow', 'codefleet-home', 'codefleet-changelog'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'CodeFleet Agents (Pro) lets the main agent delegate tasks to other vendors’ agents; experimental Handoff moves a chat to another agent', mark: 'partial', cite: ['codefleet-agents', 'codefleet-changelog', 'codefleet-home'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Routines (Pro) send recurring prompts on a schedule; the docs say they need the app open, the home page says otherwise', mark: 'partial', cite: ['codefleet-workflow', 'codefleet-home', 'codefleet-pro'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'A built-in browser; clicking components on a page brings up a prompt card for the agent', mark: 'yes', cite: ['codefleet-changelog'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Diffs per worktree with syntax highlighting, side-by-side agent results and in-viewer conflict resolution; diff line comments aren’t documented', mark: 'yes', cite: ['codefleet-tools', 'codefleet-changelog'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'A file explorer with an editor, ⌘O quick open and Markdown preview; staged, unstaged, untracked and conflicted files are listed', mark: 'yes', cite: ['codefleet-changelog', 'codefleet-tools'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'No PR creation is documented; an FAQ leaves pushing and opening PRs to your usual Git workflow', mark: 'no', cite: ['codefleet-maintainers'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'PR strip with review state and CI checks, a cross-project Pull Requests page, and in-app PR review and merge', mark: 'yes', cite: ['codefleet-tools', 'codefleet-changelog'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'None documented; a local Kanban board holds agent tasks and, per an FAQ, isn’t meant to replace a project tracker', mark: 'no', cite: ['codefleet-workflow', 'codefleet-agencies'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'None documented; agents run on your Mac. A Remote Control companion app for Pro is listed as coming soon', mark: 'no', cite: ['codefleet-pro', 'codefleet-reference', 'codefleet-privacy'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Checks for a newer release at startup and offers a download; you decide whether to install it. Also a Homebrew cask', mark: 'partial', cite: ['codefleet-changelog', 'codefleet-terms', 'codefleet-home'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented; chats started in CodeFleet keep their history when a worktree is archived and restored', mark: 'unknown', cite: ['codefleet-workflow'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'CodeFleet starts each agent’s CLI on your Mac, either as a Chat view its docs describe as ACP or as the agent’s own TUI in a terminal tab; Codex connects through the Codex App Server adapter. Splash speaks the <strong>Agent Client Protocol</strong> with each of its agents, natively or through a pinned adapter.',
			cite: ['codefleet-getting-started', 'codefleet-agents', 'codefleet-privacy', 'splash-registry', 'acp']
		},
		{
			title: 'Where it runs',
			text: 'CodeFleet runs on macOS 12 or later; agents run as local processes and projects stay on the Mac, with a Remote Control phone companion announced as coming soon for Pro. Splash builds for macOS, Windows and Ubuntu, and <code>splash-server</code> runs on the machine that holds your code, which you open in a browser over an SSH tunnel.',
			cite: ['codefleet-home', 'codefleet-privacy', 'codefleet-pro', 'splash-install', 'splash-server']
		},
		{
			title: 'Price, accounts and license',
			text: 'CodeFleet is closed source and free to download, with no account. Routines, Parallel Agents, CodeFleet Agents, advanced statistics, multiple workspaces and the CLI are Pro features, free during a Pro Preview; paid pricing isn’t announced, and if access ends, their gated actions turn read-only and saved data is kept. Splash is free, MIT-licensed and has no accounts.',
			cite: ['codefleet-terms', 'codefleet-home', 'codefleet-pro', 'codefleet-reference', 'splash-license', 'splash-download', 'splash-build']
		},
		{
			title: 'Delegation between agents',
			text: 'With <strong>CodeFleet Agents</strong> (Pro), the main agent hands bounded sub-tasks to profiles such as <code>@codex</code> or <code>@grok</code>, each with a read-only, allow-edits or full-auto level; write-capable runs take turns in the shared worktree while read-only ones run in parallel. In Splash, each session is one agent in one folder, and sessions don’t hand work to each other.',
			cite: ['codefleet-agents', 'codefleet-agents-page', 'splash-readme', 'splash-features']
		},
		{
			title: 'Around the session',
			text: 'CodeFleet adds tools beside the agents: a local Kanban board that starts agent runs, a browser with element picking, Postgres query tabs, scheduled routines, and <strong>Parallel Agents</strong>, which sends one prompt to several agents in separate worktrees. Splash centers on the conversation: a Needs attention queue, a review screen, transcript search and importing sessions started elsewhere.',
			cite: ['codefleet-workflow', 'codefleet-changelog', 'codefleet-tools', 'codefleet-home', 'splash-features', 'splash-history']
		}
	],
	fit: {
		splash: [
			'You want a free, MIT-licensed app that runs on Windows or Ubuntu as well as macOS.',
			'You want to run sessions on your own server and open them in a browser over SSH.',
			'You want Gemini, Copilot, Goose and other agents in the same chat view as Claude Code and Codex.',
			'You want to import conversations your agents started outside the app and search them with the rest.'
		],
		other: [
			'You want a native macOS app with a file editor, a built-in browser and Postgres tabs beside your agents.',
			'You want to send one prompt to several agents at once, or have one agent delegate to other vendors’ agents.',
			'You want routines that send prompts on a schedule and a Kanban board that starts agent runs.',
			'You want PR status, CI checks, review and merging in the same app as your agents.'
		]
	},
	sources: [
		{ id: 'codefleet-home', title: 'Your software factory on macOS', url: 'https://codefleet.app/', publisher: 'CodeFleet', checked: '2026-10-10' },
		{ id: 'codefleet-getting-started', title: 'Getting started', url: 'https://codefleet.app/docs/getting-started', publisher: 'CodeFleet', checked: '2026-10-10' },
		{ id: 'codefleet-workflow', title: 'App workflows', url: 'https://codefleet.app/docs/workflow', publisher: 'CodeFleet', checked: '2026-10-10' },
		{ id: 'codefleet-agents', title: 'Agents & runs', url: 'https://codefleet.app/docs/agents', publisher: 'CodeFleet', checked: '2026-10-10' },
		{ id: 'codefleet-tools', title: 'Tools & data', url: 'https://codefleet.app/docs/tools', publisher: 'CodeFleet', checked: '2026-10-10' },
		{ id: 'codefleet-reference', title: 'Settings & troubleshooting', url: 'https://codefleet.app/docs/reference', publisher: 'CodeFleet', checked: '2026-10-10' },
		{ id: 'codefleet-changelog', title: 'Changelog', url: 'https://codefleet.app/changelog', publisher: 'CodeFleet', checked: '2026-10-10' },
		{ id: 'codefleet-pro', title: 'CodeFleet Pro Preview', url: 'https://codefleet.app/pro', publisher: 'CodeFleet', checked: '2026-10-10' },
		{ id: 'codefleet-agents-page', title: 'CodeFleet Agents', url: 'https://codefleet.app/codefleet-agents', publisher: 'CodeFleet', checked: '2026-10-10' },
		{ id: 'codefleet-developers', title: 'CodeFleet for developers', url: 'https://codefleet.app/for/developers', publisher: 'CodeFleet', checked: '2026-10-10' },
		{ id: 'codefleet-maintainers', title: 'CodeFleet for open-source maintainers', url: 'https://codefleet.app/for/open-source-maintainers', publisher: 'CodeFleet', checked: '2026-10-10' },
		{ id: 'codefleet-agencies', title: 'CodeFleet for agencies', url: 'https://codefleet.app/for/agencies', publisher: 'CodeFleet', checked: '2026-10-10' },
		{ id: 'codefleet-terms', title: 'Terms of Service', url: 'https://codefleet.app/terms', publisher: 'CodeFleet', checked: '2026-10-10' },
		{ id: 'codefleet-privacy', title: 'Privacy Policy', url: 'https://codefleet.app/privacy', publisher: 'CodeFleet', checked: '2026-10-10' },
		{ id: 'codefleet-cask', title: 'Casks/codefleet.rb', url: 'https://github.com/jrcaz/homebrew-codefleet/blob/main/Casks/codefleet.rb', publisher: 'jrcaz/homebrew-codefleet on GitHub', checked: '2026-10-10' }
	]
};
