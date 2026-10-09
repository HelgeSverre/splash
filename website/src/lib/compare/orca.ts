// Splash vs Orca. Facts checked 2026-10-09 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const ORCA: Comparison = {
	slug: 'orca',
	name: 'Orca',
	description: 'How Splash and Orca compare on agents, platforms, pricing, worktrees, review and remote use, with a source for every fact.',
	checked: '2026-10-09',
	intro: 'Splash and Orca both run several coding agents at once and can give each its own git worktree. Orca is an Electron app that runs each agent’s own command-line interface in a terminal, alongside diffs, a browser and phone companions; Splash is a Rust app that drives agents over the Agent Client Protocol and renders their work as a transcript.',
	other: {
		name: 'Orca',
		url: 'https://www.onorca.dev/',
		maker: 'Stably AI',
		summary: 'A desktop app for running many coding agents side by side, each in its own git worktree. It runs each agent’s CLI in a terminal and adds diffs, a browser, a CLI and phone companions.',
		cite: ['orca-home', 'orca-supported']
	},
	groups: [
		{ title: 'The basics', rows: [
			{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app, plus a headless server mode (orca serve), a command-line tool and iOS and Android companions', cite: ['orca-home', 'orca-remote-servers', 'orca-cli', 'orca-repo'] } },
			{ label: 'Release status', splash: S.maturity, other: { text: 'v1.4.223 (8 October 2026); new versions come out most days', cite: ['orca-release', 'orca-home'] } },
			{ label: 'License', splash: S.license, other: { text: 'Open source (MIT), including the phone app and the relay that pairs it with a desktop', cite: ['orca-license', 'orca-readme', 'orca-app-store'] } },
			{ label: 'Price', splash: S.price, other: { text: 'Free; enterprise support is arranged by contact, with no published price', cite: ['orca-home', 'orca-enterprise'] } },
			{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon and Intel), Windows 10/11 x64 with WSL support, Linux x64 and arm64 (AppImage, .deb, .rpm)', cite: ['orca-download', 'orca-release', 'orca-install', 'orca-terminal'] } },
			{ label: 'Built with', splash: S.tech, other: { text: 'Electron, written mainly in TypeScript', cite: ['orca-install', 'orca-repo'] } }
		] },
		{ title: 'Agents', rows: [
			{ label: 'Agents', splash: S.agents, other: { text: 'The docs list 41 preconfigured agents, including Claude Code, Codex, Gemini and Cursor CLI; any other CLI also runs', cite: ['orca-supported'] } },
			{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each agent’s own CLI in a terminal; an experimental structured chat uses the Claude Agent SDK, codex app-server or ACP (Grok)', cite: ['orca-supported', 'orca-native-chat', 'orca-claude-sdk', 'orca-codex-app-server', 'orca-release'] } },
			{ label: 'Agent sign-in', splash: S.signIn, other: { text: 'Uses the CLI logins and subscriptions you already have, with several accounts per provider for Claude, Codex, OpenCode and others', cite: ['orca-home', 'orca-settings'] } },
			{ label: 'Permission requests', splash: S.permissions, other: { text: 'Agents launch with their bypass (Yolo) flags by default; switching to Manual keeps each uncustomized agent’s own approval prompts', mark: 'yes', cite: ['orca-settings', 'orca-supported'] } },
			{ label: 'What needs you', splash: S.attention, other: { text: 'Status glyphs for agents Orca recognizes, an Agents feed of finished turns and blocking questions, and an experimental dashboard', mark: 'partial', cite: ['orca-sessions', 'orca-activity'] } },
			{ label: 'MCP servers', splash: S.mcp, other: { text: 'Register MCP servers in settings; agents whose CLIs support MCP can then use them', mark: 'yes', cite: ['orca-skills'] } }
		] },
		{ title: 'Working in parallel', rows: [
			{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A git worktree per task, with its own branch, files and terminals; deleting it also deletes the branch. Multi-repo groups get folder workspaces', mark: 'yes', cite: ['orca-worktrees'] } },
			{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'orca.yaml setup and archive scripts; .worktreeinclude copies ignored files like .env. No port handling for local dev servers is documented', mark: 'yes', cite: ['orca-yaml', 'orca-settings', 'orca-worktrees', 'orca-ssh'] } },
			{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Experimental: through orca orchestration commands, a coordinator creates tasks, starts supervised agent workers in new or existing worktrees and collects their messages', mark: 'partial', cite: ['orca-orchestration'] } },
			{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'The orca automations command sends a stored prompt to the agent you pick on a preset, cron or RRULE schedule, in a repo or an existing worktree', mark: 'yes', cite: ['orca-automations'] } },
			{ label: 'Built-in browser', splash: S.browser, other: { text: 'A Chromium window per worktree; Design Mode sends a clicked element’s HTML, CSS and a screenshot to the agent', mark: 'yes', cite: ['orca-home', 'orca-design-mode'] } }
		] },
		{ title: 'Review and shipping', rows: [
			{ label: 'Review changes', splash: S.review, other: { text: 'Diff per worktree with image diffs and a three-way conflict view; Annotate AI Diff batches line comments to the agent', mark: 'yes', cite: ['orca-diff-viewer', 'orca-annotate'] } },
			{ label: 'Create pull requests', splash: S.prs, other: { text: 'Stage, commit, push and open a PR or MR in the app; AI can write commit messages and PR details', mark: 'yes', cite: ['orca-commit-push'] } },
			{ label: 'GitHub', splash: S.github, other: { text: 'Through the gh CLI: checks, reviews and comments in a PR tab, auto-merge, stacked PRs and a Fix broken checks action', mark: 'yes', cite: ['orca-github-errors', 'orca-github'] } },
			{ label: 'Other code hosts', hint: 'Besides GitHub', splash: { text: 'github.com through the gh CLI; no other hosts', mark: 'no', cite: ['splash-github'] }, other: { text: 'GitLab merge requests and issues in the same flow; Bitbucket Cloud PR creation; Azure DevOps and Gitea PRs appear in the sidebar', mark: 'yes', cite: ['orca-github'] } },
			{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'GitHub issues and Projects, GitLab issues, Linear, and Jira Cloud or self-hosted; a worktree can start from an issue', mark: 'yes', cite: ['orca-github', 'orca-linear', 'orca-jira'] } }
		] },
		{ title: 'Where it runs', rows: [
			{ label: 'Remote access', splash: S.remote, other: { text: 'SSH worktrees run agents on remote hosts; beta Remote Orca Servers let laptops, browsers and phones share one host', mark: 'yes', cite: ['orca-ssh', 'orca-ways-to-run', 'orca-remote-servers'] } },
			{ label: 'Mobile app', splash: S.mobile, other: { text: 'Beta companions for iOS and Android (pre-release APK) that remote-control a paired desktop or server; Relay pairing needs an Orca account', mark: 'partial', cite: ['orca-mobile', 'orca-app-store', 'orca-releases'] } },
			{ label: 'Cloud execution', splash: S.cloud, other: { text: 'Experimental Cloud VM boots a sandbox, VM or Docker container per worktree on your own provider; no hosted option', mark: 'partial', cite: ['orca-ways-to-run'] } },
			{ label: 'Auto-update', splash: S.updates, other: { text: 'Updates itself from the stable channel; release candidates on request. On Linux, .deb and .rpm show an update command instead', mark: 'yes', cite: ['orca-install'] } }
		] },
		{ title: 'History and search', rows: [
			{ label: 'Existing agent history', hint: 'Sessions started outside the app', splash: S.history, other: { text: 'Agent Session History lists transcripts supported CLIs keep on disk, wherever started, and resumes one in a local terminal', mark: 'yes', cite: ['orca-session-history'] } },
			{ label: 'Search transcripts', splash: S.search, other: { text: 'Session History and the orca search command query an index of agent transcripts, including paired computers that allow it', mark: 'yes', cite: ['orca-session-history', 'orca-cli-reference'] } }
		] }
	],
	differences: [
		{
			title: 'How each talks to agents',
			text: 'Orca starts each agent’s own command-line interface in a terminal, so any CLI can run, and reads its state from terminal title sequences and hooks; an experimental structured chat adds the Claude Agent SDK, <code>codex app-server</code> and ACP for Grok. Splash connects to every agent over the Agent Client Protocol and draws messages, tool calls, diffs and permission requests.',
			cite: ['orca-supported', 'orca-sessions', 'orca-native-chat', 'orca-claude-sdk', 'orca-codex-app-server', 'orca-release', 'splash-readme', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'Orca runs agents on your computer, on SSH hosts, on a <strong>Remote Orca Server</strong> (beta) that laptops, browsers and phones pair with, or in experimental per-worktree cloud environments on your own provider account. Splash runs them on your computer, or under <code>splash-server</code> on a machine you reach from a browser through an SSH tunnel, for one user.',
			cite: ['orca-ssh', 'orca-ways-to-run', 'orca-remote-servers', 'splash-readme', 'splash-server']
		},
		{
			title: 'Default handling of permissions',
			text: 'Orca starts agents with their permission-bypass (‘Yolo’) flags and trusts the workspace folder by default, treating the disposable worktree as the boundary; switching to <strong>Manual</strong> keeps the agents’ own prompts, except for agents with custom launch arguments. Splash shows the permission requests an agent sends in the transcript, answered with the 1–9 keys, and keeps pending ones in <strong>Needs attention</strong>.',
			cite: ['orca-supported', 'orca-settings', 'orca-sessions', 'splash-features']
		},
		{
			title: 'Tools around the agent',
			text: 'Orca bundles a terminal, diffs, a Chromium browser per worktree, transcript search, an <code>orca</code> CLI and scheduled automations, and handles commits, pushes and pull or merge requests on GitHub, GitLab and Bitbucket, plus Linear and Jira. Splash is built around the conversation: a rendered transcript, review of changed files, full-text search of saved sessions, and a GitHub triage view across repositories.',
			cite: ['orca-home', 'orca-session-history', 'orca-cli', 'orca-automations', 'orca-commit-push', 'orca-github', 'orca-linear', 'orca-jira', 'splash-features', 'splash-github']
		},
		{
			title: 'Platforms and updates',
			text: 'Orca ships desktop builds for macOS, Windows x64 and Linux x64 and arm64, a headless <code>orca serve</code> mode, and iOS and Android companions; it updates itself except from Linux .deb and .rpm packages, and releases come out most days. Splash builds for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64 plus a headless server, has no phone app, and is updated by downloading a new release from GitHub.',
			cite: ['orca-download', 'orca-release', 'orca-remote-servers', 'orca-mobile', 'orca-install', 'orca-home', 'splash-install', 'splash-about']
		}
	],
	fit: {
		splash: [
			'You want every agent driven over the Agent Client Protocol, with its messages, tool calls and diffs shown as one transcript.',
			'You want permission requests answered in the transcript and gathered in one Needs attention queue.',
			'You want to import agent history over ACP into a searchable local copy that opens without starting the agent.',
			'You want a GitHub triage view of issues, pull requests and Actions runs across many repositories.'
		],
		other: [
			'You want each agent’s own terminal interface and the option to run any CLI agent.',
			'You want to commit, push and open pull or merge requests from the app, with Linear or Jira alongside.',
			'You want iOS and Android companions, SSH worktrees or per-worktree cloud environments for your agents.',
			'You want setup scripts per worktree, a built-in Chromium browser and an app that updates itself.'
		]
	},
	sources: [
		{ id: 'orca-home', title: 'Orca — The agent development environment', url: 'https://www.onorca.dev/', publisher: 'Stably AI', checked: '2026-10-09' },
		{ id: 'orca-supported', title: 'Supported agents', url: 'https://www.onorca.dev/docs/agents/supported', publisher: 'Stably AI', checked: '2026-10-09' },
		{ id: 'orca-remote-servers', title: 'Remote Orca Servers', url: 'https://www.onorca.dev/docs/remote-servers', publisher: 'Stably AI', checked: '2026-10-09' },
		{ id: 'orca-cli', title: 'Orca CLI overview', url: 'https://www.onorca.dev/docs/cli/overview', publisher: 'Stably AI', checked: '2026-10-09' },
		{ id: 'orca-repo', title: 'stablyai/orca', url: 'https://github.com/stablyai/orca', publisher: 'stablyai/orca on GitHub', checked: '2026-10-09' },
		{ id: 'orca-release', title: 'Release v1.4.223', url: 'https://github.com/stablyai/orca/releases/tag/v1.4.223', publisher: 'stablyai/orca on GitHub', checked: '2026-10-09' },
		{ id: 'orca-releases', title: 'Releases', url: 'https://github.com/stablyai/orca/releases', publisher: 'stablyai/orca on GitHub', checked: '2026-10-09' },
		{ id: 'orca-license', title: 'LICENSE', url: 'https://github.com/stablyai/orca/blob/main/LICENSE', publisher: 'stablyai/orca on GitHub', checked: '2026-10-09' },
		{ id: 'orca-readme', title: 'README.md', url: 'https://github.com/stablyai/orca/blob/main/README.md', publisher: 'stablyai/orca on GitHub', checked: '2026-10-09' },
		{ id: 'orca-app-store', title: 'Orca IDE', url: 'https://apps.apple.com/us/app/orca-ide/id6766130217', publisher: 'Apple App Store', checked: '2026-10-09' },
		{ id: 'orca-enterprise', title: 'Orca Enterprise', url: 'https://www.onorca.dev/enterprise', publisher: 'Stably AI', checked: '2026-10-09' },
		{ id: 'orca-download', title: 'Download Orca', url: 'https://www.onorca.dev/download', publisher: 'Stably AI', checked: '2026-10-09' },
		{ id: 'orca-install', title: 'Install', url: 'https://www.onorca.dev/docs/install', publisher: 'Stably AI', checked: '2026-10-09' },
		{ id: 'orca-terminal', title: 'Terminal', url: 'https://www.onorca.dev/docs/terminal', publisher: 'Stably AI', checked: '2026-10-09' },
		{ id: 'orca-native-chat', title: 'Chat UI (native chat)', url: 'https://www.onorca.dev/docs/agents/native-chat', publisher: 'Stably AI', checked: '2026-10-09' },
		{ id: 'orca-claude-sdk', title: 'src/main/claude/claude-stream-json-connection.ts', url: 'https://github.com/stablyai/orca/blob/main/src/main/claude/claude-stream-json-connection.ts', publisher: 'stablyai/orca on GitHub', checked: '2026-10-09' },
		{ id: 'orca-codex-app-server', title: 'src/main/codex/codex-structured-session-state.ts', url: 'https://github.com/stablyai/orca/blob/main/src/main/codex/codex-structured-session-state.ts', publisher: 'stablyai/orca on GitHub', checked: '2026-10-09' },
		{ id: 'orca-settings', title: 'Settings reference', url: 'https://www.onorca.dev/docs/settings', publisher: 'Stably AI', checked: '2026-10-09' },
		{ id: 'orca-sessions', title: 'Agents & sessions', url: 'https://www.onorca.dev/docs/model/agents-sessions', publisher: 'Stably AI', checked: '2026-10-09' },
		{ id: 'orca-activity', title: 'Agents feed', url: 'https://www.onorca.dev/docs/activity', publisher: 'Stably AI', checked: '2026-10-09' },
		{ id: 'orca-skills', title: 'Orca skills registry & MCP', url: 'https://www.onorca.dev/docs/cli/skills', publisher: 'Stably AI', checked: '2026-10-09' },
		{ id: 'orca-worktrees', title: 'Worktrees', url: 'https://www.onorca.dev/docs/model/worktrees', publisher: 'Stably AI', checked: '2026-10-09' },
		{ id: 'orca-yaml', title: 'docs/site/content/docs/model/orca-yaml.mdx', url: 'https://github.com/stablyai/orca/blob/main/docs/site/content/docs/model/orca-yaml.mdx', publisher: 'stablyai/orca on GitHub', checked: '2026-10-09' },
		{ id: 'orca-ssh', title: 'SSH worktrees', url: 'https://www.onorca.dev/docs/ssh', publisher: 'Stably AI', checked: '2026-10-09' },
		{ id: 'orca-design-mode', title: 'Design Mode', url: 'https://www.onorca.dev/docs/browser/design-mode', publisher: 'Stably AI', checked: '2026-10-09' },
		{ id: 'orca-diff-viewer', title: 'Diff viewer', url: 'https://www.onorca.dev/docs/review/diff-viewer', publisher: 'Stably AI', checked: '2026-10-09' },
		{ id: 'orca-annotate', title: 'Annotate AI Diff', url: 'https://www.onorca.dev/docs/review/annotate-ai-diff', publisher: 'Stably AI', checked: '2026-10-09' },
		{ id: 'orca-commit-push', title: 'Commit & push from Orca', url: 'https://www.onorca.dev/docs/review/commit-push', publisher: 'Stably AI', checked: '2026-10-09' },
		{ id: 'orca-github-errors', title: 'Troubleshooting GitHub errors', url: 'https://www.onorca.dev/docs/github-errors', publisher: 'Stably AI', checked: '2026-10-09' },
		{ id: 'orca-github', title: 'Hosted reviews, issues & Actions', url: 'https://www.onorca.dev/docs/review/github', publisher: 'Stably AI', checked: '2026-10-09' },
		{ id: 'orca-linear', title: 'Linear items drawer', url: 'https://www.onorca.dev/docs/review/linear', publisher: 'Stably AI', checked: '2026-10-09' },
		{ id: 'orca-jira', title: 'Jira items drawer', url: 'https://www.onorca.dev/docs/review/jira', publisher: 'Stably AI', checked: '2026-10-09' },
		{ id: 'orca-ways-to-run', title: 'Ways to run Orca', url: 'https://www.onorca.dev/docs/ways-to-run', publisher: 'Stably AI', checked: '2026-10-09' },
		{ id: 'orca-mobile', title: 'Mobile companion', url: 'https://www.onorca.dev/docs/mobile', publisher: 'Stably AI', checked: '2026-10-09' },
		{ id: 'orca-session-history', title: 'Agent session history', url: 'https://www.onorca.dev/docs/agents/session-history', publisher: 'Stably AI', checked: '2026-10-09' },
		{ id: 'orca-automations', title: 'Scheduled automations', url: 'https://www.onorca.dev/docs/cli/automations', publisher: 'Stably AI', checked: '2026-10-09' },
		{ id: 'orca-orchestration', title: 'Orchestration', url: 'https://www.onorca.dev/docs/cli/orchestration', publisher: 'Stably AI', checked: '2026-10-09' },
		{ id: 'orca-cli-reference', title: 'Orca CLI reference', url: 'https://www.onorca.dev/docs/cli/reference', publisher: 'Stably AI', checked: '2026-10-09' }
	]
};
