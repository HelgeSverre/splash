// Splash vs Atlas. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const ATLAS_AGENTS: Comparison = {
	slug: 'atlas-agents',
	name: 'Atlas',
	description: 'How Splash and Atlas compare on agents, accounts, isolation, review, team features and platforms, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Atlas are desktop apps that run coding agents over the Agent Client Protocol. Atlas, in alpha, adds a built-in agent, can record agent sessions and link them to the commits they produced, and shares them with a team through a synced organization. Splash has no accounts and can give each session its own git worktree.',
	other: {
		name: 'Atlas',
		url: 'https://www.tryatlas.cc',
		maker: 'Atlas',
		summary: 'An alpha desktop app that drives Claude Code, Codex and other ACP registry agents plus its own Atlas Agent, ties recorded sessions to the commits they produced, and shares them with a team.',
		cite: ['atlas-agents-home', 'atlas-agents-readme', 'atlas-agents-docs', 'atlas-agents-capture']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app for coding agents that can record sessions and link them to commits; a team web app runs no agents', cite: ['atlas-agents-architecture', 'atlas-agents-docs', 'atlas-agents-web-app'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'Alpha: v0.3.4 (‘Atlas Teams Early’, 27 September 2026), with releases since May 2026; 0.4.0 is in development', cite: ['atlas-agents-home', 'atlas-agents-releases', 'atlas-agents-changelog'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (Apache 2.0); Atlas Agent is a hard fork of openai/codex that doesn’t follow upstream', cite: ['atlas-agents-license', 'atlas-agents-readme', 'atlas-agents-adr-codex'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free during the alpha with your own keys; Atlas Agent use is billed to your organization under a plan Atlas grants, with no published prices', cite: ['atlas-agents-home', 'atlas-agents-ai-access', 'atlas-agents-atlas-agent'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 13+ on Apple silicon and Intel (install docs say 11+), Windows 10+ x64; Linux x86-64 packages the README calls untested', cite: ['atlas-agents-home', 'atlas-agents-install', 'atlas-agents-readme'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Tauri v2: a React 19 frontend and a Rust backend that runs agent sessions and the terminal', cite: ['atlas-agents-architecture'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Built-in Atlas Agent; Claude Code, Codex, Cursor, OpenCode, Kilo Code and other ACP registry agents with an npx or binary build', cite: ['atlas-agents-home', 'atlas-agents-readme', 'atlas-agents-agents', 'atlas-agents-registry'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'External agents as ACP subprocesses over piped stdio; Atlas Agent runs in process on a hard fork of Codex', cite: ['atlas-agents-readme', 'atlas-agents-connection', 'atlas-agents-adr-codex'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'External agents use your own subscriptions or API keys; Atlas Agent uses your Atlas account, with usage billed to your organization', cite: ['atlas-agents-ai-access', 'atlas-agents-settings', 'atlas-agents-atlas-agent'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'Not for local use; Google or GitHub sign-in unlocks Atlas Agent, team features, Cloud capture and the web app', cite: ['atlas-agents-accounts', 'atlas-agents-docs'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Chat shows each agent’s own permission choices; Atlas Agent has Ask, Accept edits, Plan and Bypass modes, sandboxed except Bypass', mark: 'yes', cite: ['atlas-agents-chat', 'atlas-agents-atlas-agent'] } },
				{ label: 'Skills and MCP servers', splash: { text: 'Settings shows each agent’s skills and MCP servers, read-only', mark: 'partial', cite: ['splash-features', 'splash-mcp'] }, other: { text: 'Links global or per-project skills into Atlas Agent, Claude Code and Codex and installs packs from skills.sh; offers agents its own memory server over MCP', mark: 'yes', cite: ['atlas-agents-skills', 'atlas-agents-memory'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'None documented: all agents share the open project folder. Per-run working copies come with Shared threads, in progress', mark: 'no', cite: ['atlas-agents-docs', 'atlas-agents-shared-threads'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'Block terminal pairing each command with its output, exit status and duration, in tabs and split panes; blocks need zsh', mark: 'yes', cite: ['atlas-agents-terminal', 'atlas-agents-readme'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'The homepage describes a cross-session Inbox of permission prompts and finished streams that the docs don’t cover; notifications are unreleased 0.4.0', mark: 'partial', cite: ['atlas-agents-home', 'atlas-agents-changelog'] } },
				{ label: 'Agents handing off work', hint: 'Passing context or work between agents', splash: S.handoff, other: { text: 'Agents with HTTP MCP support share an on-device memory per repository; handing a chat to another agent is unreleased 0.4.0', mark: 'partial', cite: ['atlas-agents-concepts', 'atlas-agents-memory', 'atlas-agents-agents', 'atlas-agents-changelog'] } },
				{ label: 'Team collaboration', hint: 'Several people on one project', splash: { text: 'splash-server is a personal, single-user service, not a multi-user deployment', mark: 'no', cite: ['splash-server'] }, other: { text: 'With a synced organization: a shared session timeline, comments, team chat, calls and Cloud capture', mark: 'yes', cite: ['atlas-agents-docs', 'atlas-agents-accounts'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'A browser tab in a native webview that keeps logins and cookies, with a reader mode', mark: 'yes', cite: ['atlas-agents-readme', 'atlas-agents-home'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Each turn lists changed files and opens its diff; Atlas Agent has /review. Line comments come with Shared threads, in progress', mark: 'yes', cite: ['atlas-agents-chat', 'atlas-agents-atlas-agent', 'atlas-agents-shared-threads'] } },
				{ label: 'Sessions linked to commits', hint: 'Which agent session produced a commit', splash: { text: 'No commit links; a session keeps its transcript, and archiving a worktree session keeps its splash/… branch', mark: 'no', cite: ['splash-features'] }, other: { text: 'With capture on, commits made in any tool are tied to the agent sessions behind them; links follow rebases, and a squash orphans them', mark: 'yes', cite: ['atlas-agents-capture', 'atlas-agents-git'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'An editor with tabs and splits that also shows PDFs, images and media; inline or side-by-side diffs', mark: 'yes', cite: ['atlas-agents-editor', 'atlas-agents-git'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Never opens PRs or pushes by itself; you stage, commit, push and publish branches from its git panel', mark: 'no', cite: ['atlas-agents-self-healing', 'atlas-agents-git'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'A GitHub tab searches public repositories and shallow-clones them as reference; PR, issue and CI views aren’t documented', mark: 'partial', cite: ['atlas-agents-git'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'None yet: Atlas’s own Issues feature is roadmapped, and importing knowledge from Jira and Confluence is being explored', mark: 'no', cite: ['atlas-agents-issues', 'atlas-agents-home'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'None; sessions run on team members’ own computers. Cloud machines for agents are roadmapped', mark: 'no', cite: ['atlas-agents-issues'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'No SSH or remote-host mode is documented, and the web app and in-progress mobile app run no agents. Shared threads (in progress) can send a prompt to a teammate’s desktop agent', mark: 'no', cite: ['atlas-agents-web-app', 'atlas-agents-mobile', 'atlas-agents-shared-threads'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Downloads updates and asks to restart on macOS and Windows; on Linux it reports a new version for your package manager to install', mark: 'yes', cite: ['atlas-agents-install'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Sessions started outside the app', splash: S.history, other: { text: 'Backfills Claude Code transcripts on disk once capture is on, and imports sessions from agents that can list them', mark: 'yes', cite: ['atlas-agents-readme', 'atlas-agents-chat', 'atlas-agents-capture'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Desktop: session titles, projects, agents, models and branches, plus ⌘F within a session. Web app: prompts, responses and tool calls too', mark: 'partial', cite: ['atlas-agents-chat', 'atlas-agents-timeline'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Both use the <strong>Agent Client Protocol</strong>. Atlas installs external agents from the ACP registry as npx packages or platform binaries, and ships <strong>Atlas Agent</strong>, which runs in process on a hard fork of OpenAI’s Codex and is billed to an organization. Splash runs each agent’s own CLI with your login, natively or through a pinned adapter.',
			cite: ['atlas-agents-registry', 'atlas-agents-readme', 'atlas-agents-adr-codex', 'atlas-agents-atlas-agent', 'splash-registry', 'splash-agents', 'acp']
		},
		{
			title: 'Where work happens',
			text: 'In Atlas all agents share the open project folder on a team member’s computer; per-run working copies come with <strong>Shared threads</strong> (in progress), and cloud agents are roadmapped. Splash runs each session in the project folder or its own git worktree on a <code>splash/…</code> branch, on your computer or under <code>splash-server</code> on a machine you reach over SSH.',
			cite: ['atlas-agents-docs', 'atlas-agents-shared-threads', 'atlas-agents-issues', 'splash-features', 'splash-server']
		},
		{
			title: 'Accounts, teams and price',
			text: 'Atlas is Apache 2.0 licensed, free in the alpha and usable signed out. Google or GitHub sign-in with a synced organization adds a shared session timeline, comments, team chat and Atlas Agent, whose usage is billed to the organization under a plan Atlas grants; no prices are published. Splash is MIT-licensed and free, has no accounts, and <code>splash-server</code> serves one user.',
			cite: ['atlas-agents-license', 'atlas-agents-home', 'atlas-agents-accounts', 'atlas-agents-docs', 'atlas-agents-ai-access', 'splash-license', 'splash-download', 'splash-build', 'splash-server']
		},
		{
			title: 'Workflow focus',
			text: 'Atlas keeps agent work on the record: with capture on, checkpoints tie each commit to the agent session behind it, agents that support HTTP MCP share an on-device memory per repository, and an editor, block terminal and git client sit alongside. Splash centers on the conversations: a Needs attention queue, a review screen, transcript search and a GitHub view of issues, PRs and Actions.',
			cite: ['atlas-agents-capture', 'atlas-agents-concepts', 'atlas-agents-memory', 'atlas-agents-editor', 'atlas-agents-terminal', 'atlas-agents-git', 'splash-features', 'splash-github']
		},
		{
			title: 'Release state and platforms',
			text: 'Atlas is an alpha Tauri app for macOS and Windows x64, with Linux packages the README calls untested. Several features its docs describe, including notifications and handing a chat to another agent, are listed under unreleased 0.4.0. Splash, in early development, builds for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64.',
			cite: ['atlas-agents-home', 'atlas-agents-architecture', 'atlas-agents-readme', 'atlas-agents-changelog', 'atlas-agents-roadmap', 'splash-readme', 'splash-install']
		}
	],
	fit: {
		splash: [
			'You want each session in its own git worktree and branch, so parallel agents don’t edit the same folder.',
			'You want to run agents on another machine through splash-server and an SSH tunnel.',
			'You want one queue for permission requests, connection failures and finished turns, kept across restarts.',
			'You want a GitHub view of issues, pull requests and Actions runs across your repositories.'
		],
		other: [
			'You want each commit linked to the recorded agent session that produced it.',
			'You want your team to share session timelines, comments and chat through a synced organization.',
			'You want an editor, a block terminal and a git client in the same window as your agents.',
			'You want your agents in a repository to share an on-device memory of plans and decisions.'
		]
	},
	sources: [
		{ id: 'atlas-agents-home', title: 'Every coding agent, one workspace, your whole team', url: 'https://www.tryatlas.cc/', publisher: 'Atlas', checked: '2026-10-10' },
		{ id: 'atlas-agents-docs', title: 'Welcome to Atlas', url: 'https://docs.tryatlas.cc/docs/getting-started', publisher: 'Atlas', checked: '2026-10-10' },
		{ id: 'atlas-agents-concepts', title: 'Concepts', url: 'https://docs.tryatlas.cc/docs/getting-started/concepts', publisher: 'Atlas', checked: '2026-10-10' },
		{ id: 'atlas-agents-install', title: 'Install', url: 'https://docs.tryatlas.cc/docs/getting-started/install', publisher: 'Atlas', checked: '2026-10-10' },
		{ id: 'atlas-agents-agents', title: 'Agents', url: 'https://docs.tryatlas.cc/docs/agents', publisher: 'Atlas', checked: '2026-10-10' },
		{ id: 'atlas-agents-registry', title: 'ACP registry', url: 'https://docs.tryatlas.cc/docs/agents/registry', publisher: 'Atlas', checked: '2026-10-10' },
		{ id: 'atlas-agents-atlas-agent', title: 'Atlas Agent', url: 'https://docs.tryatlas.cc/docs/agents/atlas-agent', publisher: 'Atlas', checked: '2026-10-10' },
		{ id: 'atlas-agents-chat', title: 'Agent chat', url: 'https://docs.tryatlas.cc/docs/product/chat', publisher: 'Atlas', checked: '2026-10-10' },
		{ id: 'atlas-agents-terminal', title: 'Terminal', url: 'https://docs.tryatlas.cc/docs/product/terminal', publisher: 'Atlas', checked: '2026-10-10' },
		{ id: 'atlas-agents-editor', title: 'Editor', url: 'https://docs.tryatlas.cc/docs/product/editor', publisher: 'Atlas', checked: '2026-10-10' },
		{ id: 'atlas-agents-settings', title: 'Settings', url: 'https://docs.tryatlas.cc/docs/product/settings', publisher: 'Atlas', checked: '2026-10-10' },
		{ id: 'atlas-agents-memory', title: 'Memory', url: 'https://docs.tryatlas.cc/docs/context/memory', publisher: 'Atlas', checked: '2026-10-10' },
		{ id: 'atlas-agents-skills', title: 'Skills', url: 'https://docs.tryatlas.cc/docs/context/skills', publisher: 'Atlas', checked: '2026-10-10' },
		{ id: 'atlas-agents-git', title: 'Git & Diff', url: 'https://docs.tryatlas.cc/docs/source-control/git', publisher: 'Atlas', checked: '2026-10-10' },
		{ id: 'atlas-agents-capture', title: 'Session capture', url: 'https://docs.tryatlas.cc/docs/source-control/capture', publisher: 'Atlas', checked: '2026-10-10' },
		{ id: 'atlas-agents-self-healing', title: 'Self-healing', url: 'https://docs.tryatlas.cc/docs/source-control/self-healing', publisher: 'Atlas', checked: '2026-10-10' },
		{ id: 'atlas-agents-issues', title: 'Issues', url: 'https://docs.tryatlas.cc/docs/source-control/issues', publisher: 'Atlas', checked: '2026-10-10' },
		{ id: 'atlas-agents-accounts', title: 'Your account', url: 'https://docs.tryatlas.cc/docs/team/accounts', publisher: 'Atlas', checked: '2026-10-10' },
		{ id: 'atlas-agents-ai-access', title: 'AI access & spend', url: 'https://docs.tryatlas.cc/docs/team/ai-access', publisher: 'Atlas', checked: '2026-10-10' },
		{ id: 'atlas-agents-timeline', title: 'Timeline', url: 'https://docs.tryatlas.cc/docs/team/timeline', publisher: 'Atlas', checked: '2026-10-10' },
		{ id: 'atlas-agents-shared-threads', title: 'Shared threads', url: 'https://docs.tryatlas.cc/docs/team/shared-threads', publisher: 'Atlas', checked: '2026-10-10' },
		{ id: 'atlas-agents-web-app', title: 'Web app', url: 'https://docs.tryatlas.cc/docs/team/web-app', publisher: 'Atlas', checked: '2026-10-10' },
		{ id: 'atlas-agents-mobile', title: 'Mobile', url: 'https://docs.tryatlas.cc/docs/team/mobile', publisher: 'Atlas', checked: '2026-10-10' },
		{ id: 'atlas-agents-changelog', title: 'Changelog', url: 'https://docs.tryatlas.cc/docs/community/changelog', publisher: 'Atlas', checked: '2026-10-10' },
		{ id: 'atlas-agents-roadmap', title: 'Roadmap', url: 'https://docs.tryatlas.cc/docs/community/roadmap', publisher: 'Atlas', checked: '2026-10-10' },
		{ id: 'atlas-agents-readme', title: 'README.md', url: 'https://github.com/pacifio/atlas', publisher: 'pacifio/atlas on GitHub', checked: '2026-10-10' },
		{ id: 'atlas-agents-license', title: 'LICENSE', url: 'https://github.com/pacifio/atlas/blob/main/LICENSE', publisher: 'pacifio/atlas on GitHub', checked: '2026-10-10' },
		{ id: 'atlas-agents-releases', title: 'Releases', url: 'https://github.com/pacifio/atlas/releases', publisher: 'pacifio/atlas on GitHub', checked: '2026-10-10' },
		{ id: 'atlas-agents-architecture', title: 'docs/architecture.md', url: 'https://github.com/pacifio/atlas/blob/main/docs/architecture.md', publisher: 'pacifio/atlas on GitHub', checked: '2026-10-10' },
		{ id: 'atlas-agents-adr-codex', title: 'ADR-0003: Codex fork as native agent', url: 'https://github.com/pacifio/atlas/blob/main/docs/adr/0003-codex-fork-as-native-agent.md', publisher: 'pacifio/atlas on GitHub', checked: '2026-10-10' },
		{ id: 'atlas-agents-connection', title: 'crates/atlas-agent-servers/src/connection.rs', url: 'https://github.com/pacifio/atlas/blob/main/crates/atlas-agent-servers/src/connection.rs', publisher: 'pacifio/atlas on GitHub', checked: '2026-10-10' }
	]
};
