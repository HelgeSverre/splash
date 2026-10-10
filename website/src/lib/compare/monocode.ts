// Splash vs MonoCode. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const MONOCODE: Comparison = {
	slug: 'monocode',
	name: 'MonoCode',
	description: 'How Splash and MonoCode compare on agents, platforms, licensing, worktrees, review, automations and remote hosts, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and MonoCode are both open-source desktop apps that run the coding agent CLIs you already have, with git worktrees for parallel sessions. MonoCode, built on Tauri, has a separate adapter for each of its eleven agents, six of them over the Agent Client Protocol (ACP); Splash drives every agent over ACP.',
	other: {
		name: 'MonoCode',
		url: 'https://www.usemono.dev/',
		maker: 'Nick (hardbeat920)',
		summary: 'An open-source Tauri desktop app that runs eleven installed coding agent CLIs, with worktrees, an Inbox for issues and pull requests, automations, and experimental Monos and remote hosts.',
		cite: ['monocode-readme', 'monocode-license', 'monocode-cargo', 'monocode-changelog', 'monocode-remote']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Tauri desktop app, Rust with a React frontend, for the agent CLIs on your machine; an experimental host service runs agents elsewhere', cite: ['monocode-home', 'monocode-cargo', 'monocode-package', 'monocode-remote'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v0.11.0 of 9 October 2026; 70 releases since 0.1.0 on 20 August, and the README calls it still early', cite: ['monocode-release', 'monocode-changelog', 'monocode-repo', 'monocode-readme'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (MIT); provider names and logos remain their owners’ trademarks', cite: ['monocode-license', 'monocode-readme'] } },
				{ label: 'Price', splash: S.price, other: { text: 'No price, paid tier or checkout is listed, and MonoCode sells no tokens; models bill through your own agent plans or keys', cite: ['monocode-home', 'monocode-readme', 'monocode-providers'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon and Intel), Windows x64, Linux x64 (.deb, AppImage, .rpm); the remote host also comes in arm64', cite: ['monocode-release', 'monocode-readme', 'monocode-install', 'monocode-remote'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'No MonoCode account is mentioned; the stated prerequisite is one supported agent CLI, installed and signed in', cite: ['monocode-readme', 'monocode-providers'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code, Codex, Cursor, Grok Build, OpenCode, Antigravity (macOS and Linux), Pi, omp, fx, Hermes Agent and Devin; adding others isn’t documented', cite: ['monocode-home', 'monocode-readme', 'monocode-changelog', 'monocode-contributing'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each CLI as a child process: ACP for six agents, plus Claude Code stream-json, Codex app-server, OpenCode’s HTTP server and Pi/omp RPC', cite: ['monocode-harness', 'monocode-claude', 'monocode-codex', 'monocode-opencode', 'monocode-grok', 'monocode-fx', 'monocode-changelog', 'monocode-remote'] } },
				{ label: 'Model and mode pickers', splash: S.models, other: { text: 'Model and effort pickers; hand a finished turn to another provider, or ask one for a second opinion, in a split pane beside it', mark: 'yes', cite: ['monocode-changelog'] } },
				{ label: 'Agent sign-in', splash: S.signIn, other: { text: 'Reuses each CLI’s login and can open browser sign-in for five agents; Claude Code and Codex take several named accounts', cite: ['monocode-readme', 'monocode-providers', 'monocode-changelog'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Approval and question prompts in the transcript; access modes such as Supervised and Full Access; with supported agents, /plan waits for you to approve a plan', mark: 'yes', cite: ['monocode-changelog'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Settings finds, adds and removes servers for Claude Code, Claude Desktop, Codex, Cursor and OpenCode; /mcp picks which ones to use', mark: 'yes', cite: ['monocode-changelog'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Picked per session: your current checkout, a worktree you already have, or a new worktree and branch made on its first turn', mark: 'yes', cite: ['monocode-changelog', 'monocode-worktree-dialog'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'Built-in terminals belong to the project, dock to any edge and start in the current session’s worktree; remote projects have none', mark: 'yes', cite: ['monocode-changelog', 'monocode-remote'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'A sidebar status filter that includes needs approval; pending prompts stay visible in the transcript, and sessions can carry reminders', mark: 'yes', cite: ['monocode-changelog'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'Optional system notifications when a turn ends or an agent waits in a hidden session; sounds, banners and mutes set per project', mark: 'yes', cite: ['monocode-changelog'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'A lead agent directs up to four workers; with /operator, or as a Mono, an agent can start and message sessions', mark: 'yes', cite: ['monocode-changelog', 'monocode-agent-access', 'monocode-readme'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Automations on hourly-to-weekly schedules or tracker events from GitHub, GitLab, Linear, Jira or Azure DevOps; experimental Monos repeat Habits while the app is open', mark: 'yes', cite: ['monocode-changelog', 'monocode-jira', 'monocode-readme'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Staged and unstaged diffs with line-by-line comments sent to the agent as one prompt; session checkpoints can be undone', mark: 'yes', cite: ['monocode-changelog'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'A file tree and an editor that shows diffs, with full-text search across the project', mark: 'yes', cite: ['monocode-changelog'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Commit, push, pull and switch branches, then open a PR through gh; merge, close, reopen or change draft state in the app', mark: 'yes', cite: ['monocode-changelog', 'monocode-remote'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Through your gh login: PR checks in the Inbox, failed checks sent to an agent, sessions linked to issues and PRs', mark: 'yes', cite: ['monocode-changelog'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'An Inbox for GitHub, GitLab, Linear, Jira Cloud and Azure DevOps items: read, comment, discuss with an agent or start a session', mark: 'yes', cite: ['monocode-changelog', 'monocode-jira'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Experimental: over SSH, installs a host service on a Windows, Linux or macOS machine that stays awake; sessions survive a dropped tunnel', mark: 'partial', cite: ['monocode-readme', 'monocode-remote'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Built-in updater with stable and beta feeds; the AppImage updates itself, while .deb and .rpm need the newer package installed', mark: 'yes', cite: ['monocode-install', 'monocode-building', 'monocode-changelog'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented; MonoCode keeps its own sessions per project, and several agents resume the ones it started', mark: 'unknown', cite: ['monocode-changelog'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Global search across files, projects and earlier conversations, including message text; Find within an open transcript', mark: 'yes', cite: ['monocode-changelog'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'MonoCode has its own adapter for each of its eleven agents: ACP for six, plus Claude Code’s stream-json mode, Codex’s <code>app-server</code>, OpenCode’s HTTP server and Pi and omp RPC. No documented route adds others, and new adapters are paused for now. Splash speaks the <strong>Agent Client Protocol</strong> to every agent, natively or through a pinned adapter.',
			cite: ['monocode-claude', 'monocode-codex', 'monocode-opencode', 'monocode-grok', 'monocode-fx', 'monocode-changelog', 'monocode-remote', 'monocode-contributing', 'splash-registry', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'Both start agents as child processes on your computer, and neither documents a hosted service. MonoCode’s experimental remote mode installs a host service over SSH on a Windows, Linux or macOS machine that stays awake; terminals, automations and orchestration don’t work there yet. Splash can run as <code>splash-server</code> on the machine with your code, opened in a browser over SSH.',
			cite: ['monocode-harness', 'monocode-remote', 'splash-readme', 'splash-server']
		},
		{
			title: 'Price, license and platforms',
			text: 'Both are MIT-licensed. Splash is free and has no accounts; MonoCode lists no price or paid tier, and its docs mention no MonoCode account. MonoCode ships for macOS (Apple silicon and Intel), Windows x64 and Linux x64, with arm64 builds of its remote host; Splash builds for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64.',
			cite: ['monocode-license', 'monocode-home', 'monocode-readme', 'monocode-release', 'splash-license', 'splash-download', 'splash-build', 'splash-install']
		},
		{
			title: 'Around the session',
			text: 'MonoCode extends into the work around a session: an Inbox for GitHub, GitLab, Linear, Jira and Azure DevOps, PR creation, scheduled and event-driven automations, a lead agent with up to four workers, and experimental <strong>Monos</strong>, persistent agents with memory. Splash centers on the sessions: a Needs attention queue, a GitHub view across repositories and importing conversations agents started elsewhere.',
			cite: ['monocode-changelog', 'monocode-readme', 'splash-features', 'splash-history', 'splash-github']
		}
	],
	fit: {
		splash: [
			'You want every agent driven over the Agent Client Protocol, including Gemini, Copilot and Goose.',
			'You want to import conversations your agents started outside the app and search them with the rest.',
			'You want to reach your sessions from a browser, with splash-server on the machine that holds your code.',
			'You want permission requests, connection failures and finished turns in one queue that survives restarts.'
		],
		other: [
			'You want to open, check and merge pull requests, with GitHub, GitLab, Linear, Jira and Azure DevOps items in one Inbox.',
			'You want agents that start on a schedule or from tracker events, and a lead agent that splits work among up to four workers.',
			'You want to edit files in the app, with project terminals and session checkpoints you can undo.',
			'You want an app that updates itself and manages MCP servers for Claude Code, Codex, Cursor and OpenCode.'
		]
	},
	sources: [
		{ id: 'monocode-home', title: 'MonoCode', url: 'https://www.usemono.dev/', publisher: 'usemono.dev', checked: '2026-10-10' },
		{ id: 'monocode-repo', title: 'hardbeat920/monocode', url: 'https://github.com/hardbeat920/monocode', publisher: 'hardbeat920/monocode on GitHub', checked: '2026-10-10' },
		{ id: 'monocode-readme', title: 'README.md', url: 'https://github.com/hardbeat920/monocode/blob/main/README.md', publisher: 'hardbeat920/monocode on GitHub', checked: '2026-10-10' },
		{ id: 'monocode-changelog', title: 'CHANGELOG.md', url: 'https://github.com/hardbeat920/monocode/blob/main/CHANGELOG.md', publisher: 'hardbeat920/monocode on GitHub', checked: '2026-10-10' },
		{ id: 'monocode-contributing', title: 'CONTRIBUTING.md', url: 'https://github.com/hardbeat920/monocode/blob/main/CONTRIBUTING.md', publisher: 'hardbeat920/monocode on GitHub', checked: '2026-10-10' },
		{ id: 'monocode-license', title: 'LICENSE', url: 'https://github.com/hardbeat920/monocode/blob/main/LICENSE', publisher: 'hardbeat920/monocode on GitHub', checked: '2026-10-10' },
		{ id: 'monocode-release', title: 'MonoCode 0.11.0', url: 'https://github.com/hardbeat920/monocode/releases/tag/v0.11.0', publisher: 'hardbeat920/monocode on GitHub', checked: '2026-10-10' },
		{ id: 'monocode-providers', title: 'docs/providers.md', url: 'https://github.com/hardbeat920/monocode/blob/main/docs/providers.md', publisher: 'hardbeat920/monocode on GitHub', checked: '2026-10-10' },
		{ id: 'monocode-install', title: 'docs/install.md', url: 'https://github.com/hardbeat920/monocode/blob/main/docs/install.md', publisher: 'hardbeat920/monocode on GitHub', checked: '2026-10-10' },
		{ id: 'monocode-building', title: 'docs/building.md', url: 'https://github.com/hardbeat920/monocode/blob/main/docs/building.md', publisher: 'hardbeat920/monocode on GitHub', checked: '2026-10-10' },
		{ id: 'monocode-remote', title: 'Remote access (experimental)', url: 'https://github.com/hardbeat920/monocode/blob/main/docs/remote-access.md', publisher: 'hardbeat920/monocode on GitHub', checked: '2026-10-10' },
		{ id: 'monocode-agent-access', title: 'docs/agent-access.md', url: 'https://github.com/hardbeat920/monocode/blob/main/docs/agent-access.md', publisher: 'hardbeat920/monocode on GitHub', checked: '2026-10-10' },
		{ id: 'monocode-jira', title: 'docs/jira.md', url: 'https://github.com/hardbeat920/monocode/blob/main/docs/jira.md', publisher: 'hardbeat920/monocode on GitHub', checked: '2026-10-10' },
		{ id: 'monocode-cargo', title: 'src-tauri/Cargo.toml', url: 'https://github.com/hardbeat920/monocode/blob/main/src-tauri/Cargo.toml', publisher: 'hardbeat920/monocode on GitHub', checked: '2026-10-10' },
		{ id: 'monocode-package', title: 'package.json', url: 'https://github.com/hardbeat920/monocode/blob/main/package.json', publisher: 'hardbeat920/monocode on GitHub', checked: '2026-10-10' },
		{ id: 'monocode-worktree-dialog', title: 'CreateWorktreeDialog.tsx', url: 'https://github.com/hardbeat920/monocode/blob/main/src/features/source-control/ui/CreateWorktreeDialog.tsx', publisher: 'hardbeat920/monocode on GitHub', checked: '2026-10-10' },
		{ id: 'monocode-harness', title: 'src-tauri/src/harness.rs', url: 'https://github.com/hardbeat920/monocode/blob/main/src-tauri/src/harness.rs', publisher: 'hardbeat920/monocode on GitHub', checked: '2026-10-10' },
		{ id: 'monocode-claude', title: 'claudeProtocol.ts', url: 'https://github.com/hardbeat920/monocode/blob/main/src/integrations/harness/providers/claude/claudeProtocol.ts', publisher: 'hardbeat920/monocode on GitHub', checked: '2026-10-10' },
		{ id: 'monocode-codex', title: 'codex.ts', url: 'https://github.com/hardbeat920/monocode/blob/main/src/integrations/harness/providers/codex/codex.ts', publisher: 'hardbeat920/monocode on GitHub', checked: '2026-10-10' },
		{ id: 'monocode-opencode', title: 'opencode.ts', url: 'https://github.com/hardbeat920/monocode/blob/main/src/integrations/harness/providers/opencode/opencode.ts', publisher: 'hardbeat920/monocode on GitHub', checked: '2026-10-10' },
		{ id: 'monocode-grok', title: 'grok.ts', url: 'https://github.com/hardbeat920/monocode/blob/main/src/integrations/harness/providers/grok/grok.ts', publisher: 'hardbeat920/monocode on GitHub', checked: '2026-10-10' },
		{ id: 'monocode-fx', title: 'fx.ts', url: 'https://github.com/hardbeat920/monocode/blob/main/src/integrations/harness/providers/fx/fx.ts', publisher: 'hardbeat920/monocode on GitHub', checked: '2026-10-10' }
	]
};
