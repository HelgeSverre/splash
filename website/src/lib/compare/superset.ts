// Splash vs Superset. Facts checked 2026-10-09 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const SUPERSET: Comparison = {
	slug: 'superset',
	name: 'Superset',
	description: 'How Splash and Superset compare on agents, platforms, pricing, worktrees and review, with a source for every fact.',
	checked: '2026-10-09',
	intro: 'Splash and Superset are desktop apps for running several coding agents at once, with git worktrees to keep their work apart. Superset starts each agent’s own command-line interface in a terminal, with paid plans for teams, remote access and mobile. Splash, free and open source, drives agents over the Agent Client Protocol and shows their output as a conversation.',
	other: {
		name: 'Superset',
		url: 'https://superset.sh',
		maker: 'Superset Inc.',
		summary: 'A source-available desktop app that runs CLI coding agents side by side, giving each project workspace a git worktree and terminals of its own. An iPhone and iPad app, a CLI and an MCP server round it out.',
		cite: ['superset-overview', 'superset-workspaces']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app with agents in built-in terminals, plus an iPhone and iPad app, a CLI and an MCP server', cite: ['superset-faq', 'superset-overview'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v1.37.0, released 8 October 2026, with new builds daily; the CLI is in beta and cloud workspaces in early access', cite: ['superset-release', 'superset-install', 'superset-cli', 'superset-workspaces'] } },
				{ label: 'License', splash: S.license, other: { text: 'Source-available under the Elastic License 2.0, not OSI open source; others may not offer it as a hosted service', cite: ['superset-license', 'superset-home'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free for one user; Pro is $20 per user a month, or $15 a month billed yearly; Enterprise is custom-priced', cite: ['superset-pricing'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon and Intel) as the main target; Linux x64 AppImage (experimental) and .deb; Windows planned, no date', cite: ['superset-faq', 'superset-download'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: '22 listed, including Claude Code, Codex, Gemini CLI, OpenCode, Copilot and Cursor Agent; other CLI agents work too', cite: ['superset-agents', 'superset-readme'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Runs each agent’s own CLI in a terminal, adding status hooks to its config; agent chat is not yet generally available', cite: ['superset-model', 'superset-changelog'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Agents run on your CLI logins or API keys; the provider bills you, and Superset does not proxy model calls', cite: ['superset-faq', 'superset-pricing'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'Yes: the desktop app asks you to sign in with GitHub or Google and needs an active organization', cite: ['superset-auth-layout', 'superset-sign-in'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Claude Code, Codex and several other built-in agents launch with approval-bypass or auto-approve flags, editable in settings; the limited-access chat asks inline', mark: 'partial', cite: ['superset-builtin-agents', 'superset-agents', 'superset-changelog'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Each local project workspace is a git worktree on its own branch; workspaces without a project get a scratch folder', mark: 'yes', cite: ['superset-faq', 'superset-workspaces'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Per-project setup, teardown and Run-button dev server commands in .superset/config.json, with per-machine overrides', mark: 'yes', cite: ['superset-setup-scripts'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'A browser pane for previewing dev servers; Design Mode sends a picked element’s DOM, styles and a screenshot to an agent', mark: 'yes', cite: ['superset-browser'] } },
				{ label: 'Scheduled tasks', splash: S.scheduler, other: { text: 'Pro automations start an agent on a schedule on a device you pick; each run leaves a live workspace to review', mark: 'yes', cite: ['superset-automations'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'A terminal per workspace with tabs and splits; a background daemon keeps sessions alive across restarts and updates', mark: 'yes', cite: ['superset-terminal', 'superset-readme', 'superset-faq'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'A board sorts workspaces by state, such as Working, Needs attention and Needs review, from agent and PR status', mark: 'yes', cite: ['superset-workspaces', 'superset-agent-status'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'Notifications and a macOS dock badge when an agent finishes or waits for input; waiting detection varies by agent', mark: 'partial', cite: ['superset-agent-status'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'A Changes pane with split or unified diffs; selected PR lines go to an agent as a comment', mark: 'yes', cite: ['superset-diff-viewer', 'superset-pull-requests'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'A file tree and built-in editor per workspace; a diff line opens the editor at that spot; stage, commit, push and pull in the Changes pane', mark: 'yes', cite: ['superset-editor', 'superset-diff-viewer'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Creates PRs from the Changes pane, and merges, closes or reopens them from a Pull Requests view', mark: 'yes', cite: ['superset-diff-viewer', 'superset-pull-requests'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'PRs with CI checks, reviews and threads, using this machine’s own GitHub login such as the gh CLI; the separate GitHub App integration became Pro in October 2026', mark: 'yes', cite: ['superset-pull-requests', 'superset-install', 'superset-gh-login', 'superset-changelog'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'A Tasks view holds Superset tasks, Linear issues (Pro) and GitHub issues, and can start a workspace per task; Jira isn’t documented', mark: 'partial', cite: ['superset-tasks', 'superset-pricing'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'Cloud workspaces on separate clones, in early access and not yet open to every account', mark: 'partial', cite: ['superset-workspaces', 'superset-faq'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'A Pro feature, off by default: reach another machine’s workspaces through the hosted Superset Relay', mark: 'yes', cite: ['superset-remote-access', 'superset-faq', 'superset-pricing'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'iPhone and iPad app (iOS 26 or later); it needs Pro and a computer running Remote Access. No Android app yet', mark: 'yes', cite: ['superset-app-store', 'superset-readme', 'superset-faq'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Checks for updates on its own, downloads them and installs on quit; versions before 1.29.0 show an update screen', mark: 'yes', cite: ['superset-install', 'superset-updater', 'superset-changelog'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented for outside conversations; the CLI can resume an agent session by ID, and existing worktrees can be imported', mark: 'partial', cite: ['superset-agent-sessions', 'superset-workspaces'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Not documented; a search bar spans all open workspaces, but the docs don’t say whether it covers transcripts', mark: 'unknown', cite: ['superset-editor'] } },
				{ label: 'Fork a conversation', splash: S.fork, other: { text: 'Forks a session in agents with a fork command, or hands a different agent the session’s recent context to continue', mark: 'yes', cite: ['superset-agent-sessions'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Superset runs each agent’s own command-line interface in a terminal and reads its status from hooks written into the agent’s config. Splash launches each agent as a subprocess, speaks the <strong>Agent Client Protocol</strong> with it and renders messages, tool calls, diffs and permission requests itself. Superset’s source runs its agent chat, not yet generally available, over ACP too.',
			cite: ['superset-model', 'superset-agent-status', 'superset-acp-chat', 'superset-changelog', 'splash-readme', 'acp']
		},
		{
			title: 'Permission prompts',
			text: 'Several of Superset’s built-in agents start with approval-skipping flags, such as <code>claude --dangerously-skip-permissions</code> and <code>codex --dangerously-bypass-approvals-and-sandbox</code>; the launch commands can be changed in settings. Splash shows each permission request in the transcript, to be answered with the 1–9 keys, and lists pending ones under Needs attention.',
			cite: ['superset-builtin-agents', 'superset-agents', 'splash-features']
		},
		{
			title: 'Accounts, plans and license',
			text: 'Superset’s desktop app needs a GitHub or Google sign-in and an organization. Local use is free for one user; Pro, at $20 per user a month, adds unlimited users, remote access, automations, the mobile app, and the Linear and GitHub App integrations. Superset is source-available under ELv2. Splash has no accounts, costs nothing and is MIT-licensed.',
			cite: ['superset-auth-layout', 'superset-pricing', 'superset-changelog', 'superset-gh-login', 'superset-license', 'splash-build', 'splash-download', 'splash-license']
		},
		{
			title: 'Where it runs',
			text: 'Superset supports macOS, ships a Linux AppImage (experimental) and .deb, and plans Windows. It adds an iPhone and iPad app, early-access cloud workspaces, and a hosted relay for reaching other machines. Splash ships for macOS, Windows 11 and Ubuntu 24.04, and runs on a remote machine as <code>splash-server</code>, opened in your browser through your own SSH tunnel.',
			cite: ['superset-faq', 'superset-download', 'superset-app-store', 'superset-workspaces', 'superset-remote-access', 'splash-install', 'splash-server']
		},
		{
			title: 'Around the session',
			text: 'Superset builds tooling around each workspace: setup and teardown scripts, port detection, an in-app browser with a Design Mode element picker, scheduled automations, Pages for sharing agent output, and a Slack bot. Splash adds tools for the conversations themselves: a Needs attention queue, a review screen, transcript search, and importing sessions that agents started elsewhere.',
			cite: ['superset-setup-scripts', 'superset-ports', 'superset-browser', 'superset-automations', 'superset-overview', 'superset-slack', 'splash-features', 'splash-history']
		}
	],
	fit: {
		splash: [
			'You want a free, MIT-licensed app that needs no account.',
			'You work on Windows or Ubuntu as well as macOS.',
			'You want agents’ output as a transcript, with permission requests and finished turns gathered in one queue.',
			'You want to search past transcripts and import conversations your agents started elsewhere.'
		],
		other: [
			'You want each agent’s own terminal interface, with tabs, splits and sessions that survive restarts.',
			'You want setup scripts, a Run button for dev servers and an editor alongside each workspace.',
			'You want to create, review and merge pull requests and pick up Linear or GitHub issues inside the app.',
			'You want a team plan with remote access, automations and an iPhone and iPad app.'
		]
	},
	sources: [
		{ id: 'superset-home', title: 'Orchestrate any coding agent', url: 'https://superset.sh/', publisher: 'Superset Inc.', checked: '2026-10-09' },
		{ id: 'superset-pricing', title: 'Pricing', url: 'https://superset.sh/pricing', publisher: 'Superset Inc.', checked: '2026-10-09' },
		{ id: 'superset-download', title: 'Download Superset', url: 'https://superset.sh/download', publisher: 'Superset Inc.', checked: '2026-10-09' },
		{ id: 'superset-changelog', title: 'Changelog', url: 'https://superset.sh/changelog', publisher: 'Superset Inc.', checked: '2026-10-09' },
		{ id: 'superset-overview', title: 'What is Superset?', url: 'https://docs.superset.sh/overview', publisher: 'Superset Inc.', checked: '2026-10-09' },
		{ id: 'superset-faq', title: 'FAQ', url: 'https://docs.superset.sh/faq', publisher: 'Superset Inc.', checked: '2026-10-09' },
		{ id: 'superset-install', title: 'Install', url: 'https://docs.superset.sh/install', publisher: 'Superset Inc.', checked: '2026-10-09' },
		{ id: 'superset-cli', title: 'Getting Started (CLI)', url: 'https://docs.superset.sh/cli/getting-started', publisher: 'Superset Inc.', checked: '2026-10-09' },
		{ id: 'superset-workspaces', title: 'Workspaces', url: 'https://docs.superset.sh/workspaces', publisher: 'Superset Inc.', checked: '2026-10-09' },
		{ id: 'superset-agents', title: 'AI Agents', url: 'https://docs.superset.sh/agent-integration', publisher: 'Superset Inc.', checked: '2026-10-09' },
		{ id: 'superset-model', title: 'The Superset Model', url: 'https://docs.superset.sh/superset-model', publisher: 'Superset Inc.', checked: '2026-10-09' },
		{ id: 'superset-agent-status', title: 'Agent Status & Notifications', url: 'https://docs.superset.sh/agent-status', publisher: 'Superset Inc.', checked: '2026-10-09' },
		{ id: 'superset-agent-sessions', title: 'Agent Sessions & Forking', url: 'https://docs.superset.sh/agent-sessions', publisher: 'Superset Inc.', checked: '2026-10-09' },
		{ id: 'superset-setup-scripts', title: 'Project Lifecycle Scripts', url: 'https://docs.superset.sh/setup-teardown-scripts', publisher: 'Superset Inc.', checked: '2026-10-09' },
		{ id: 'superset-ports', title: 'Port Management', url: 'https://docs.superset.sh/ports', publisher: 'Superset Inc.', checked: '2026-10-09' },
		{ id: 'superset-terminal', title: 'Terminal', url: 'https://docs.superset.sh/terminal-integration', publisher: 'Superset Inc.', checked: '2026-10-09' },
		{ id: 'superset-diff-viewer', title: 'Diff Viewer', url: 'https://docs.superset.sh/diff-viewer', publisher: 'Superset Inc.', checked: '2026-10-09' },
		{ id: 'superset-editor', title: 'Editor & Files', url: 'https://docs.superset.sh/editor', publisher: 'Superset Inc.', checked: '2026-10-09' },
		{ id: 'superset-pull-requests', title: 'Pull Requests', url: 'https://docs.superset.sh/pull-requests', publisher: 'Superset Inc.', checked: '2026-10-09' },
		{ id: 'superset-tasks', title: 'Tasks', url: 'https://docs.superset.sh/tasks', publisher: 'Superset Inc.', checked: '2026-10-09' },
		{ id: 'superset-slack', title: 'Slack Integration', url: 'https://docs.superset.sh/use-with-slack', publisher: 'Superset Inc.', checked: '2026-10-09' },
		{ id: 'superset-remote-access', title: 'Remote Access', url: 'https://docs.superset.sh/remote-access', publisher: 'Superset Inc.', checked: '2026-10-09' },
		{ id: 'superset-browser', title: 'In-App Browser', url: 'https://docs.superset.sh/browser', publisher: 'Superset Inc.', checked: '2026-10-09' },
		{ id: 'superset-automations', title: 'Automations', url: 'https://docs.superset.sh/automations', publisher: 'Superset Inc.', checked: '2026-10-09' },
		{ id: 'superset-app-store', title: 'Superset: 100+ Coding Agents', url: 'https://apps.apple.com/us/app/id6788926383', publisher: 'Apple App Store', checked: '2026-10-09' },
		{ id: 'superset-readme', title: 'README', url: 'https://github.com/superset-sh/superset/blob/main/README.md', publisher: 'superset-sh/superset on GitHub', checked: '2026-10-09' },
		{ id: 'superset-license', title: 'LICENSE.md', url: 'https://github.com/superset-sh/superset/blob/main/LICENSE.md', publisher: 'superset-sh/superset on GitHub', checked: '2026-10-09' },
		{ id: 'superset-release', title: 'Superset Desktop desktop-v1.37.0', url: 'https://github.com/superset-sh/superset/releases/tag/desktop-v1.37.0', publisher: 'superset-sh/superset on GitHub', checked: '2026-10-09' },
		{ id: 'superset-builtin-agents', title: 'packages/shared/src/builtin-terminal-agents.ts', url: 'https://github.com/superset-sh/superset/blob/main/packages/shared/src/builtin-terminal-agents.ts', publisher: 'superset-sh/superset on GitHub', checked: '2026-10-09' },
		{ id: 'superset-acp-chat', title: 'packages/shared/src/constants.ts', url: 'https://github.com/superset-sh/superset/blob/main/packages/shared/src/constants.ts', publisher: 'superset-sh/superset on GitHub', checked: '2026-10-09' },
		{ id: 'superset-auth-layout', title: 'apps/desktop/src/renderer/routes/_authenticated/layout.tsx', url: 'https://github.com/superset-sh/superset/blob/main/apps/desktop/src/renderer/routes/_authenticated/layout.tsx', publisher: 'superset-sh/superset on GitHub', checked: '2026-10-09' },
		{ id: 'superset-sign-in', title: 'apps/desktop/src/renderer/routes/sign-in/page.tsx', url: 'https://github.com/superset-sh/superset/blob/main/apps/desktop/src/renderer/routes/sign-in/page.tsx', publisher: 'superset-sh/superset on GitHub', checked: '2026-10-09' },
		{ id: 'superset-gh-login', title: 'packages/host-service/src/providers/git/LocalGitCredentialProvider/credential-remedy.ts', url: 'https://github.com/superset-sh/superset/blob/main/packages/host-service/src/providers/git/LocalGitCredentialProvider/credential-remedy.ts', publisher: 'superset-sh/superset on GitHub', checked: '2026-10-09' },
		{ id: 'superset-updater', title: 'apps/desktop/src/main/lib/auto-updater.ts', url: 'https://github.com/superset-sh/superset/blob/main/apps/desktop/src/main/lib/auto-updater.ts', publisher: 'superset-sh/superset on GitHub', checked: '2026-10-09' }
	]
};
