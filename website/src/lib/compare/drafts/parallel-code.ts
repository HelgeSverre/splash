// Splash vs Parallel Code. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const PARALLEL_CODE: Comparison = {
	slug: 'parallel-code',
	name: 'Parallel Code',
	description: 'How Splash and Parallel Code compare on agents, platforms, worktrees, review and phone access, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Parallel Code are free, open-source desktop apps that run several coding agents at once, each able to work in its own git worktree. Parallel Code, an Electron app for macOS and Linux, runs each agent’s own CLI in a terminal. Splash drives agents over the Agent Client Protocol and shows each session as a transcript.',
	other: {
		name: 'Parallel Code',
		url: 'https://parallelcode.app/',
		maker: 'Johannes Millan',
		summary: 'A free, MIT-licensed Electron app for macOS and Linux that runs coding agents’ own CLIs side by side, each task in a git worktree, with diff review, an AI Arena and phone access.',
		cite: ['parallel-code-home', 'parallel-code-about', 'parallel-code-legal', 'parallel-code-repo']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Standalone Electron desktop app that runs coding agents in parallel, each task in a git worktree, alongside your usual editor', cite: ['parallel-code-home', 'parallel-code-about'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v3.1.0, released 26 September 2026 and the 30th release since February; some features ship behind experimental flags', cite: ['parallel-code-release', 'parallel-code-releases', 'parallel-code-v2-0-0'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (MIT)', cite: ['parallel-code-license', 'parallel-code-legal'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free, with no paid tier or platform fee', cite: ['parallel-code-home', 'parallel-code-vs-superset', 'parallel-code-repo'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (universal build for Apple silicon and Intel) and Linux (AppImage, or an amd64 .deb); no Windows build', cite: ['parallel-code-home', 'parallel-code-release', 'parallel-code-issue-9', 'parallel-code-vs-vibe-kanban'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Electron and TypeScript, with a SolidJS interface; terminals use xterm.js and node-pty', cite: ['parallel-code-home', 'parallel-code-repo', 'parallel-code-package'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code, Codex, Gemini, Copilot and Antigravity CLIs (plus OpenCode in the source) and custom CLI agents; Cursor’s agent isn’t supported', cite: ['parallel-code-home', 'parallel-code-agents-src', 'parallel-code-custom-agent', 'parallel-code-vs-conductor'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each agent’s real CLI in a pseudo-terminal; optional chat drives Claude Code via the Claude Agent SDK and Codex via codex app-server', cite: ['parallel-code-pty', 'parallel-code-blog-permissions', 'parallel-code-home', 'parallel-code-claude-chat', 'parallel-code-codex-chat'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Install at least one agent CLI yourself; it runs on your logins, subscriptions or API keys, with no proxy or markup', cite: ['parallel-code-repo', 'parallel-code-home', 'parallel-code-blog-cost'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'None: no sign-up or login', cite: ['parallel-code-privacy'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Approvals in the Claude Code and Codex chat; terminal agents prompt in their own CLI, and the app doesn’t override their settings', mark: 'yes', cite: ['parallel-code-home', 'parallel-code-blog-permissions'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A branch and git worktree per task, optionally inside a Docker container; Direct mode works on main with no worktree', mark: 'yes', cite: ['parallel-code-home', 'parallel-code-repo'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'No documented setup scripts and no server launcher; start dev servers in task shells. Ignored files like .env are symlinked in', mark: 'no', cite: ['parallel-code-browser-preview', 'parallel-code-blog-claude-codex'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'With orchestration on, a coordinator agent spawns sub-tasks in separate worktrees through the app’s local MCP server', mark: 'yes', cite: ['parallel-code-home', 'parallel-code-privacy', 'parallel-code-mcp-tools'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'A browser preview on the task canvas lets you pick page elements into a prompt; agents get no browser automation tool', mark: 'yes', cite: ['parallel-code-repo', 'parallel-code-browser-preview'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Tasks show working, waiting or ready to merge; waiting ones pin to the sidebar top, and one queue collects what needs you', mark: 'yes', cite: ['parallel-code-home', 'parallel-code-v1-14-0'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'OS notifications when a task finishes or needs attention, and when PR checks pass or fail; phone push is on unreleased main', mark: 'yes', cite: ['parallel-code-privacy', 'parallel-code-repo', 'parallel-code-readme-main'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Diff viewer with inline comments you send back to the agent and per-commit navigation, plus guided tours, coverage badges and ESLint findings', mark: 'yes', cite: ['parallel-code-repo', 'parallel-code-home', 'parallel-code-review-sidebar', 'parallel-code-v1-15-0'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Merges a task’s branch locally from the sidebar or pushes it to the remote; creating a PR in the app isn’t documented', mark: 'no', cite: ['parallel-code-home', 'parallel-code-readme-v3-1-0'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Follows a linked PR’s state and CI checks through the gh CLI; PR merging and issue-based tasks are on unreleased main', mark: 'yes', cite: ['parallel-code-repo', 'parallel-code-privacy', 'parallel-code-github-prs-main', 'parallel-code-github-work-items-main'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'Super Productivity, the maker’s task and time tracker, follows the focused task and can start new ones; Linear and Jira aren’t documented', mark: 'partial', cite: ['parallel-code-repo', 'parallel-code-release', 'parallel-code-privacy'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'A phone web view over Wi-Fi or Tailscale; the QR link is view-only until paired with a desktop code. No SSH mode', mark: 'partial', cite: ['parallel-code-repo', 'parallel-code-privacy', 'parallel-code-vs-claude-squad'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'No released native app; phones use the web view, and a native Android app sits on unreleased main', mark: 'partial', cite: ['parallel-code-repo', 'parallel-code-readme-main', 'parallel-code-android-releases'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Packaged macOS and AppImage builds check GitHub Releases for updates; the .deb isn’t covered', mark: 'partial', cite: ['parallel-code-privacy'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'A Resume session… picker lists Claude Code and Codex transcripts in a task’s worktree, hand-run ones included; outside worktrees import as tasks', mark: 'partial', cite: ['parallel-code-session-scan', 'parallel-code-session-resume', 'parallel-code-repo'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Find within one chat transcript or one terminal; search across sessions isn’t documented', mark: 'partial', cite: ['parallel-code-transcript-search', 'parallel-code-terminal-search'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Parallel Code starts each agent’s own CLI in a pseudo-terminal, so any terminal agent can run, and adds a chat view for Claude Code, through the Claude Agent SDK, and for Codex, through <code>codex app-server</code>. Its docs and code don’t mention ACP. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, natively or through an adapter, and renders the transcript.',
			cite: ['parallel-code-pty', 'parallel-code-custom-agent', 'parallel-code-claude-chat', 'parallel-code-codex-chat', 'parallel-code-home', 'splash-readme', 'splash-registry', 'acp']
		},
		{
			title: 'Where it runs',
			text: 'Parallel Code ships for macOS and Linux, with Windows an open request; agents work locally or in a local Docker container, and the project operates no servers. Phones open a web view the desktop app serves over Wi-Fi or Tailscale. Splash runs on macOS, Windows 11 and Ubuntu 24.04, or as <code>splash-server</code>, used in a browser over an SSH tunnel.',
			cite: ['parallel-code-home', 'parallel-code-issue-9', 'parallel-code-privacy', 'parallel-code-repo', 'splash-install', 'splash-server']
		},
		{
			title: 'Isolation and permissions',
			text: 'Each Parallel Code worktree gets ignored files like <code>node_modules</code> and <code>.env</code> symlinked in by default. Its maker treats worktrees as a correctness boundary rather than a security one, says the optional Docker mode doesn’t isolate network or credentials, and doesn’t override agents’ permission settings. Splash gives each session the project folder or a worktree, with permission requests in the transcript.',
			cite: ['parallel-code-blog-claude-codex', 'parallel-code-blog-permissions', 'parallel-code-privacy', 'splash-features']
		},
		{
			title: 'Workflow focus',
			text: 'Its maker pitches Parallel Code for steering two to four live tasks, not unattended runs. Around each task it adds an AI Arena that races agents, a coordinator that spawns sub-tasks, guided tours, a mind-map canvas and Super Productivity time tracking. Splash centers on conversations: a Needs attention queue, a review screen, transcript search and importing sessions started elsewhere.',
			cite: ['parallel-code-blog-tools', 'parallel-code-repo', 'parallel-code-vs-superset', 'parallel-code-home', 'parallel-code-privacy', 'parallel-code-release', 'splash-features', 'splash-history']
		}
	],
	fit: {
		splash: [
			'You work on Windows, or want to run sessions on your own server over SSH.',
			'You want every agent driven over the Agent Client Protocol, with its output shown as a transcript.',
			'You want to search transcripts across sessions and import conversations your agents started elsewhere.',
			'You want a GitHub view of issues, pull requests and Actions runs across repositories.'
		],
		other: [
			'You want each agent’s own CLI in a terminal, with built-in chat for Claude Code and Codex.',
			'You want to race several agents on one task, or let a coordinator agent hand out sub-tasks.',
			'You want tasks to run in a Docker container built from your project’s own Dockerfile.',
			'You want to follow and answer your agents from a phone browser over Wi-Fi or Tailscale.'
		]
	},
	sources: [
		{ id: 'parallel-code-home', title: 'AI Coding Workspace', url: 'https://parallelcode.app/', publisher: 'Johannes Millan', checked: '2026-10-10' },
		{ id: 'parallel-code-about', title: 'About Johannes Millan', url: 'https://parallelcode.app/about/', publisher: 'Johannes Millan', checked: '2026-10-10' },
		{ id: 'parallel-code-legal', title: 'Software License & Legal Information', url: 'https://parallelcode.app/legal/', publisher: 'Johannes Millan', checked: '2026-10-10' },
		{ id: 'parallel-code-vs-conductor', title: 'Parallel Code vs Conductor: Open Source & Linux', url: 'https://parallelcode.app/compare/parallel-code-vs-conductor/', publisher: 'Johannes Millan', checked: '2026-10-10' },
		{ id: 'parallel-code-vs-superset', title: 'Parallel Code vs Superset: Licensing and Features', url: 'https://parallelcode.app/compare/parallel-code-vs-superset/', publisher: 'Johannes Millan', checked: '2026-10-10' },
		{ id: 'parallel-code-vs-claude-squad', title: 'Parallel Code vs Claude Squad: GUI vs Terminal', url: 'https://parallelcode.app/compare/parallel-code-vs-claude-squad/', publisher: 'Johannes Millan', checked: '2026-10-10' },
		{ id: 'parallel-code-vs-vibe-kanban', title: 'Parallel Code vs Vibe Kanban', url: 'https://parallelcode.app/compare/parallel-code-vs-vibe-kanban/', publisher: 'Johannes Millan', checked: '2026-10-10' },
		{ id: 'parallel-code-blog-permissions', title: 'AI Coding Agent Permissions and Sandboxing', url: 'https://parallelcode.app/blog/ai-agent-permissions-and-sandboxing/', publisher: 'Johannes Millan', checked: '2026-10-10' },
		{ id: 'parallel-code-blog-cost', title: 'Cost of Running Multiple AI Agents', url: 'https://parallelcode.app/blog/cost-of-running-multiple-ai-agents/', publisher: 'Johannes Millan', checked: '2026-10-10' },
		{ id: 'parallel-code-blog-claude-codex', title: 'Claude Code and Codex Together: 4 Workflows', url: 'https://parallelcode.app/blog/claude-code-and-codex-together/', publisher: 'Johannes Millan', checked: '2026-10-10' },
		{ id: 'parallel-code-blog-tools', title: 'Multi-Agent Coding Tools in 2026', url: 'https://parallelcode.app/blog/multi-agent-coding-tools-2026/', publisher: 'Johannes Millan', checked: '2026-10-10' },
		{ id: 'parallel-code-repo', title: 'johannesjo/parallel-code', url: 'https://github.com/johannesjo/parallel-code', publisher: 'johannesjo/parallel-code on GitHub', checked: '2026-10-10' },
		{ id: 'parallel-code-readme-main', title: 'README.md at main', url: 'https://github.com/johannesjo/parallel-code/blob/main/README.md', publisher: 'johannesjo/parallel-code on GitHub', checked: '2026-10-10' },
		{ id: 'parallel-code-readme-v3-1-0', title: 'README.md at v3.1.0', url: 'https://github.com/johannesjo/parallel-code/blob/v3.1.0/README.md', publisher: 'johannesjo/parallel-code on GitHub', checked: '2026-10-10' },
		{ id: 'parallel-code-license', title: 'LICENSE', url: 'https://github.com/johannesjo/parallel-code/blob/main/LICENSE', publisher: 'johannesjo/parallel-code on GitHub', checked: '2026-10-10' },
		{ id: 'parallel-code-privacy', title: 'PRIVACY.md', url: 'https://github.com/johannesjo/parallel-code/blob/main/PRIVACY.md', publisher: 'johannesjo/parallel-code on GitHub', checked: '2026-10-10' },
		{ id: 'parallel-code-browser-preview', title: 'docs/browser-preview.md', url: 'https://github.com/johannesjo/parallel-code/blob/main/docs/browser-preview.md', publisher: 'johannesjo/parallel-code on GitHub', checked: '2026-10-10' },
		{ id: 'parallel-code-releases', title: 'Releases', url: 'https://github.com/johannesjo/parallel-code/releases', publisher: 'johannesjo/parallel-code on GitHub', checked: '2026-10-10' },
		{ id: 'parallel-code-release', title: 'Release v3.1.0', url: 'https://github.com/johannesjo/parallel-code/releases/tag/v3.1.0', publisher: 'johannesjo/parallel-code on GitHub', checked: '2026-10-10' },
		{ id: 'parallel-code-v2-0-0', title: 'Release v2.0.0', url: 'https://github.com/johannesjo/parallel-code/releases/tag/v2.0.0', publisher: 'johannesjo/parallel-code on GitHub', checked: '2026-10-10' },
		{ id: 'parallel-code-v1-15-0', title: 'Release v1.15.0', url: 'https://github.com/johannesjo/parallel-code/releases/tag/v1.15.0', publisher: 'johannesjo/parallel-code on GitHub', checked: '2026-10-10' },
		{ id: 'parallel-code-v1-14-0', title: 'Release v1.14.0', url: 'https://github.com/johannesjo/parallel-code/releases/tag/v1.14.0', publisher: 'johannesjo/parallel-code on GitHub', checked: '2026-10-10' },
		{ id: 'parallel-code-android-releases', title: 'Releases matching android-v', url: 'https://github.com/johannesjo/parallel-code/releases?q=android-v&expanded=true', publisher: 'johannesjo/parallel-code on GitHub', checked: '2026-10-10' },
		{ id: 'parallel-code-issue-9', title: 'Support windows (issue #9)', url: 'https://github.com/johannesjo/parallel-code/issues/9', publisher: 'johannesjo/parallel-code on GitHub', checked: '2026-10-10' },
		{ id: 'parallel-code-package', title: 'package.json at v3.1.0', url: 'https://github.com/johannesjo/parallel-code/blob/v3.1.0/package.json', publisher: 'johannesjo/parallel-code on GitHub', checked: '2026-10-10' },
		{ id: 'parallel-code-agents-src', title: 'electron/ipc/agents.ts at v3.1.0', url: 'https://github.com/johannesjo/parallel-code/blob/v3.1.0/electron/ipc/agents.ts', publisher: 'johannesjo/parallel-code on GitHub', checked: '2026-10-10' },
		{ id: 'parallel-code-custom-agent', title: 'src/components/CustomAgentEditor.tsx at v3.1.0', url: 'https://github.com/johannesjo/parallel-code/blob/v3.1.0/src/components/CustomAgentEditor.tsx', publisher: 'johannesjo/parallel-code on GitHub', checked: '2026-10-10' },
		{ id: 'parallel-code-pty', title: 'electron/ipc/pty.ts at v3.1.0', url: 'https://github.com/johannesjo/parallel-code/blob/v3.1.0/electron/ipc/pty.ts', publisher: 'johannesjo/parallel-code on GitHub', checked: '2026-10-10' },
		{ id: 'parallel-code-claude-chat', title: 'electron/chat/claude.ts at v3.1.0', url: 'https://github.com/johannesjo/parallel-code/blob/v3.1.0/electron/chat/claude.ts', publisher: 'johannesjo/parallel-code on GitHub', checked: '2026-10-10' },
		{ id: 'parallel-code-codex-chat', title: 'electron/ipc/codex-chat.ts at v3.1.0', url: 'https://github.com/johannesjo/parallel-code/blob/v3.1.0/electron/ipc/codex-chat.ts', publisher: 'johannesjo/parallel-code on GitHub', checked: '2026-10-10' },
		{ id: 'parallel-code-mcp-tools', title: 'electron/mcp/mcp-tool-list.ts at v3.1.0', url: 'https://github.com/johannesjo/parallel-code/blob/v3.1.0/electron/mcp/mcp-tool-list.ts', publisher: 'johannesjo/parallel-code on GitHub', checked: '2026-10-10' },
		{ id: 'parallel-code-review-sidebar', title: 'src/components/ReviewSidebar.tsx at v3.1.0', url: 'https://github.com/johannesjo/parallel-code/blob/v3.1.0/src/components/ReviewSidebar.tsx', publisher: 'johannesjo/parallel-code on GitHub', checked: '2026-10-10' },
		{ id: 'parallel-code-github-prs-main', title: 'electron/github/pull-requests.ts at main', url: 'https://github.com/johannesjo/parallel-code/blob/main/electron/github/pull-requests.ts', publisher: 'johannesjo/parallel-code on GitHub', checked: '2026-10-10' },
		{ id: 'parallel-code-github-work-items-main', title: 'electron/github/work-items.ts at main', url: 'https://github.com/johannesjo/parallel-code/blob/main/electron/github/work-items.ts', publisher: 'johannesjo/parallel-code on GitHub', checked: '2026-10-10' },
		{ id: 'parallel-code-session-scan', title: 'electron/sessions/scan.ts at v3.1.0', url: 'https://github.com/johannesjo/parallel-code/blob/v3.1.0/electron/sessions/scan.ts', publisher: 'johannesjo/parallel-code on GitHub', checked: '2026-10-10' },
		{ id: 'parallel-code-session-resume', title: 'electron/shared/session-resume.ts at v3.1.0', url: 'https://github.com/johannesjo/parallel-code/blob/v3.1.0/electron/shared/session-resume.ts', publisher: 'johannesjo/parallel-code on GitHub', checked: '2026-10-10' },
		{ id: 'parallel-code-transcript-search', title: 'src/components/chat/TranscriptSearch.tsx at v3.1.0', url: 'https://github.com/johannesjo/parallel-code/blob/v3.1.0/src/components/chat/TranscriptSearch.tsx', publisher: 'johannesjo/parallel-code on GitHub', checked: '2026-10-10' },
		{ id: 'parallel-code-terminal-search', title: 'src/components/TerminalSearchOverlay.tsx at v3.1.0', url: 'https://github.com/johannesjo/parallel-code/blob/v3.1.0/src/components/TerminalSearchOverlay.tsx', publisher: 'johannesjo/parallel-code on GitHub', checked: '2026-10-10' }
	]
};
