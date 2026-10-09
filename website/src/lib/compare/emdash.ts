// Splash vs Emdash. Facts checked 2026-10-09 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const EMDASH: Comparison = {
	slug: 'emdash',
	name: 'Emdash',
	description: 'How Splash and Emdash compare on agents, platforms, pricing, worktrees, remote work and review, with a source for every fact.',
	checked: '2026-10-09',
	intro: 'Splash and Emdash both run several coding agents at once, and both can give each agent its own git worktree. Emdash is an Electron desktop app that runs each agent’s own terminal interface by default, with an opt-in chat view over the Agent Client Protocol (ACP) for agents that support it; Splash is a desktop app and headless server that talks to every agent over ACP.',
	other: {
		name: 'Emdash',
		url: 'https://emdash.com',
		maker: 'General Action',
		summary: 'An open-source desktop app, which its makers call an agentic development environment, for running coding agents in parallel, scheduling agent work and reviewing their changes. It has builds for macOS, Windows and Linux.',
		cite: ['emdash-home', 'emdash-license']
	},
	groups: [
		{ title: 'The basics', rows: [
			{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app built on Electron; no web or mobile client is documented', cite: ['emdash-home', 'emdash-package'] } },
			{ label: 'Release status', splash: S.maturity, other: { text: 'v1.2.7 (September 2026); stable since v1 in April 2026, with an opt-in canary channel', cite: ['emdash-release', 'emdash-changelog'] } },
			{ label: 'License', splash: S.license, other: { text: 'Open source (Apache 2.0)', cite: ['emdash-license'] } },
			{ label: 'Price', splash: S.price, other: { text: 'Free; Emdash Cloud and Emdash Enterprise are offered by contact, with no published prices', cite: ['emdash-home', 'emdash-cloud', 'emdash-enterprise'] } },
			{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon and Intel), Windows x64, Linux x64 and ARM64 (AppImage, DEB, RPM)', cite: ['emdash-readme', 'emdash-release'] } },
			{ label: 'Built with', splash: S.tech, other: { text: 'TypeScript and React 19 on Electron, with xterm terminals, the Monaco editor and a local SQLite database', cite: ['emdash-package', 'emdash-readme'] } }
		] },
		{ title: 'Agents', rows: [
			{ label: 'Agents', splash: S.agents, other: { text: 'Docs list 35 agent CLIs, including Claude Code, Codex, Cursor, Amp, OpenCode and GitHub Copilot; installed ones are detected', cite: ['emdash-providers'] } },
			{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each agent’s own TUI in a terminal by default; an opt-in chat UI over ACP where the agent supports it', cite: ['emdash-tasks', 'emdash-changelog'] } },
			{ label: 'Agent sign-in', splash: S.signIn, other: { text: 'You sign in through each agent’s CLI with your subscription or API key; Emdash can run the CLIs’ install commands', cite: ['emdash-home', 'emdash-what-is', 'emdash-changelog', 'emdash-remote-projects'] } },
			{ label: 'Permission requests', splash: S.permissions, other: { text: 'In the TUI, the agent’s own prompts, with auto-approve where the agent supports it; in the chat UI, the agent’s allow and reject options above the composer', mark: 'yes', cite: ['emdash-providers', 'emdash-changelog', 'emdash-permission-band'] } },
			{ label: 'MCP servers', splash: S.mcp, other: { text: 'Set up once in a Library and written into the config file of each agent you pick, 11 in the docs; a catalog of 54 servers', mark: 'yes', cite: ['emdash-mcp'] } }
		] },
		{ title: 'Working in parallel', rows: [
			{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A git branch and worktree per task by default; worktrees can be turned off', mark: 'yes', cite: ['emdash-tasks'] } },
			{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Setup, run and teardown scripts per project, files such as .env copied into worktrees, and an in-app browser for dev servers', mark: 'yes', cite: ['emdash-project-config', 'emdash-browser'] } },
			{ label: 'Scheduled tasks', splash: S.scheduler, other: { text: 'Automations create tasks from a saved prompt on a cron schedule and keep a history of each run', mark: 'yes', cite: ['emdash-automations'] } },
			{ label: 'Terminal', splash: S.terminal, other: { text: 'Terminal tabs per task and a drawer with script logs; optional tmux keeps sessions alive across restarts on macOS and Linux', mark: 'yes', cite: ['emdash-tmux', 'emdash-project-config'] } },
			{ label: 'What needs you', splash: S.attention, other: { text: 'Status per agent (working, waiting for input, done) for agents with lifecycle hooks; the Providers page lists 20', mark: 'partial', cite: ['emdash-providers'] } },
			{ label: 'Notifications', splash: S.notifications, other: { text: 'For agents with lifecycle hooks; clicking one opens its conversation, and the sound can be changed', mark: 'partial', cite: ['emdash-providers', 'emdash-changelog'] } }
		] },
		{ title: 'Review and shipping', rows: [
			{ label: 'Review changes', splash: S.review, other: { text: 'Diff view per task, unified or split, with line comments; the chat UI passes draft comments to the agent', mark: 'yes', cite: ['emdash-diff-view', 'emdash-changelog', 'emdash-draft-comments'] } },
			{ label: 'Files and diffs', splash: S.files, other: { text: 'An editor for worktree files with tabs, syntax highlighting and find/replace; unstaged diffs are editable inline', mark: 'yes', cite: ['emdash-file-editor', 'emdash-diff-view'] } },
			{ label: 'Create pull requests', splash: S.prs, other: { text: 'Commits, pushes and opens GitHub pull requests from the diff view; a connected GitHub account can also merge them', mark: 'yes', cite: ['emdash-diff-view', 'emdash-github-accounts'] } },
			{ label: 'GitHub', splash: S.github, other: { text: 'A task’s PR files, commits, comments, merge state and Actions checks, through a connected account; Enterprise remotes too', mark: 'yes', cite: ['emdash-diff-view', 'emdash-ci-checks', 'emdash-github-accounts', 'emdash-changelog'] } },
			{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'A task can start from an issue in any of 12 trackers, among them Linear, Jira, GitHub, GitLab, Asana and Notion; issue details can go into the prompt', mark: 'yes', cite: ['emdash-issues'] } }
		] },
		{ title: 'Where it runs', rows: [
			{ label: 'Remote access', splash: S.remote, other: { text: 'Remote Projects keep the UI local and run the repo, terminals and agents on an SSH host; its design docs scope remotes to macOS and Linux', mark: 'yes', cite: ['emdash-remote-projects', 'emdash-workspace-server'] } },
			{ label: 'Cloud execution', splash: S.cloud, other: { text: 'Emdash Cloud offers isolated per-task cloud workspaces by contact; Remote Tasks create a VM or container per task with your script', mark: 'partial', cite: ['emdash-cloud', 'emdash-remote-tasks'] } },
			{ label: 'App updates', splash: S.updates, other: { text: 'In-app: an update prompt downloads and installs new versions, from the stable or an opt-in canary channel', mark: 'yes', cite: ['emdash-changelog'] } }
		] },
		{ title: 'History and search', rows: [
			{ label: 'Existing agent history', hint: 'Sessions started outside the app', splash: S.history, other: { text: 'Not documented; Emdash resumes its own sessions after a restart and can import tasks from Emdash v0.4.x', mark: 'no', cite: ['emdash-tasks', 'emdash-changelog'] } },
			{ label: 'Search transcripts', splash: S.search, other: { text: 'Find within a terminal (⌘/Ctrl+F); the command palette finds conversations, projects, tasks and files. Search across transcripts isn’t documented', mark: 'partial', cite: ['emdash-changelog'] } }
		] }
	],
	differences: [
		{
			title: 'How each connects to agents',
			text: 'Emdash runs each agent’s own terminal UI by default and offers an opt-in chat UI over ACP for agents that support it; in its source on 2026-10-09, 23 of its 37 agent plugins define an ACP mode. Splash speaks ACP to every agent, natively or through a pinned adapter, and draws the transcript, tool calls and permission requests itself.',
			cite: ['emdash-tasks', 'emdash-changelog', 'emdash-plugins', 'splash-registry', 'splash-agents', 'acp', 'splash-features']
		},
		{
			title: 'Where the work runs',
			text: 'Emdash Remote Projects keep the UI on your desktop and run the repo, terminals and agents on an SSH host; Emdash Cloud (by contact) and Remote Tasks, which use your own provisioning script, add a remote workspace per task. Splash runs agents on the computer with the app, or on a machine of yours with <code>splash-server</code>, which you open in a browser over an SSH tunnel.',
			cite: ['emdash-remote-projects', 'emdash-cloud', 'emdash-remote-tasks', 'splash-readme', 'splash-server']
		},
		{
			title: 'Project setup and scheduling',
			text: 'Emdash can run setup, run and teardown scripts for each task, copy files like <code>.env</code> into each new worktree, give a task’s terminals, agents and scripts a range of 10 ports, and create tasks on a cron schedule. A Splash worktree is a plain git checkout; Splash runs no setup scripts, and an agent starts when you create, continue or prompt a session.',
			cite: ['emdash-project-config', 'emdash-automations', 'splash-features', 'splash-worktree', 'splash-how']
		},
		{
			title: 'Agent configuration files',
			text: 'Emdash adds to agents’ user-level setup: marker-tagged hook entries for status and notifications in agents with lifecycle hooks, which do nothing outside Emdash; MCP servers written into the config of each agent you pick; and skills linked into supported agents’ skill folders. The MCP servers and skills also apply when you run those agents elsewhere. Splash reads the skills, commands and MCP servers it finds in agents’ config files and lists them read-only in Settings.',
			cite: ['emdash-readme', 'emdash-mcp', 'emdash-skills', 'splash-features', 'splash-mcp']
		},
		{
			title: 'GitHub, pull requests and issues',
			text: 'Emdash opens GitHub pull requests from a task and can merge them, and starts tasks from issues in the 12 trackers its docs list, connecting through a GitHub account or each tracker’s API key or token. Splash uses the GitHub CLI’s github.com login for a triage view of issues, pull requests and Actions runs across repositories; it can start a session from an issue or a pull request’s head, and does not create pull requests.',
			cite: ['emdash-diff-view', 'emdash-github-accounts', 'emdash-issues', 'splash-github', 'splash-features']
		}
	],
	fit: {
		splash: [
			'You want each agent’s session as a structured transcript over ACP, with permission requests answered from the keyboard.',
			'You want to browse, preview and import conversations your agents started outside the app, and search their saved text.',
			'You want permission requests, failures and finished turns in one queue that survives restarts.',
			'You want to run the app on a server of your own and use it from a browser over SSH.'
		],
		other: [
			'You want each agent’s own terminal UI, from a list of 35 agent CLIs, with an optional chat view for agents that support ACP.',
			'You want worktrees prepared by setup scripts, an in-app browser for dev servers, and tasks on a cron schedule.',
			'You want to start tasks from Linear, Jira and other trackers, and create and merge GitHub pull requests in the app.',
			'You want agents on SSH hosts or per-task cloud workspaces, or builds for Linux on ARM64.'
		]
	},
	sources: [
		{ id: 'emdash-home', title: 'Emdash — Open-Source Agentic Development Environment', url: 'https://emdash.com/', publisher: 'General Action, Inc.', checked: '2026-10-09' },
		{ id: 'emdash-license', title: 'LICENSE.md', url: 'https://github.com/generalaction/emdash/blob/main/LICENSE.md', publisher: 'generalaction/emdash on GitHub', checked: '2026-10-09' },
		{ id: 'emdash-package', title: 'apps/emdash-desktop/package.json', url: 'https://github.com/generalaction/emdash/blob/main/apps/emdash-desktop/package.json', publisher: 'generalaction/emdash on GitHub', checked: '2026-10-09' },
		{ id: 'emdash-release', title: 'Release v1.2.7', url: 'https://github.com/generalaction/emdash/releases/tag/v1.2.7', publisher: 'generalaction/emdash on GitHub', checked: '2026-10-09' },
		{ id: 'emdash-changelog', title: 'Changelog', url: 'https://emdash.com/changelog', publisher: 'General Action, Inc.', checked: '2026-10-09' },
		{ id: 'emdash-cloud', title: 'Cloud Workspaces for AI Coding Agents', url: 'https://emdash.com/cloud', publisher: 'General Action, Inc.', checked: '2026-10-09' },
		{ id: 'emdash-enterprise', title: 'Enterprise', url: 'https://emdash.com/enterprise', publisher: 'General Action, Inc.', checked: '2026-10-09' },
		{ id: 'emdash-readme', title: 'Emdash README', url: 'https://github.com/generalaction/emdash#readme', publisher: 'generalaction/emdash on GitHub', checked: '2026-10-09' },
		{ id: 'emdash-providers', title: 'Providers', url: 'https://emdash.com/docs/providers', publisher: 'General Action, Inc.', checked: '2026-10-09' },
		{ id: 'emdash-tasks', title: 'Tasks', url: 'https://emdash.com/docs/tasks', publisher: 'General Action, Inc.', checked: '2026-10-09' },
		{ id: 'emdash-what-is', title: 'What Is Emdash?', url: 'https://emdash.com/blog/what-is-emdash', publisher: 'General Action, Inc.', checked: '2026-10-09' },
		{ id: 'emdash-permission-band', title: 'permission-band.tsx', url: 'https://github.com/generalaction/emdash/blob/main/packages/ui/src/react/components/chat-composer/permission-band.tsx', publisher: 'generalaction/emdash on GitHub', checked: '2026-10-09' },
		{ id: 'emdash-mcp', title: 'MCP Servers', url: 'https://emdash.com/docs/library/mcp', publisher: 'General Action, Inc.', checked: '2026-10-09' },
		{ id: 'emdash-project-config', title: 'Project Settings', url: 'https://emdash.com/docs/project-config', publisher: 'General Action, Inc.', checked: '2026-10-09' },
		{ id: 'emdash-browser', title: 'In-App Browser', url: 'https://emdash.com/docs/in-app-browser', publisher: 'General Action, Inc.', checked: '2026-10-09' },
		{ id: 'emdash-automations', title: 'Automations', url: 'https://emdash.com/docs/automations', publisher: 'General Action, Inc.', checked: '2026-10-09' },
		{ id: 'emdash-tmux', title: 'Tmux Sessions', url: 'https://emdash.com/docs/tmux-sessions', publisher: 'General Action, Inc.', checked: '2026-10-09' },
		{ id: 'emdash-diff-view', title: 'Diff View', url: 'https://emdash.com/docs/diff-view', publisher: 'General Action, Inc.', checked: '2026-10-09' },
		{ id: 'emdash-draft-comments', title: 'draft-comments-context.ts', url: 'https://github.com/generalaction/emdash/blob/main/apps/emdash-desktop/src/core/features/conversations/browser/acp/draft-comments-context.ts', publisher: 'generalaction/emdash on GitHub', checked: '2026-10-09' },
		{ id: 'emdash-file-editor', title: 'File Editor', url: 'https://emdash.com/docs/file-editor', publisher: 'General Action, Inc.', checked: '2026-10-09' },
		{ id: 'emdash-github-accounts', title: 'GitHub Accounts', url: 'https://emdash.com/docs/github-accounts', publisher: 'General Action, Inc.', checked: '2026-10-09' },
		{ id: 'emdash-ci-checks', title: 'CI/CD Checks', url: 'https://emdash.com/docs/ci-checks', publisher: 'General Action, Inc.', checked: '2026-10-09' },
		{ id: 'emdash-issues', title: 'Passing Issues', url: 'https://emdash.com/docs/issues', publisher: 'General Action, Inc.', checked: '2026-10-09' },
		{ id: 'emdash-remote-projects', title: 'Remote Projects', url: 'https://emdash.com/docs/remote-development/remote-projects', publisher: 'General Action, Inc.', checked: '2026-10-09' },
		{ id: 'emdash-workspace-server', title: 'Workspace Server Client Connection', url: 'https://github.com/generalaction/emdash/blob/main/apps/workspace-server/docs/client-connection.md', publisher: 'generalaction/emdash on GitHub', checked: '2026-10-09' },
		{ id: 'emdash-remote-tasks', title: 'Remote Tasks', url: 'https://emdash.com/docs/remote-development/remote-tasks', publisher: 'General Action, Inc.', checked: '2026-10-09' },
		{ id: 'emdash-plugins', title: 'packages/plugins/src/agents/impl', url: 'https://github.com/generalaction/emdash/tree/main/packages/plugins/src/agents/impl', publisher: 'generalaction/emdash on GitHub', checked: '2026-10-09' },
		{ id: 'emdash-skills', title: 'Skills', url: 'https://emdash.com/docs/library/skills', publisher: 'General Action, Inc.', checked: '2026-10-09' }
	]
};
