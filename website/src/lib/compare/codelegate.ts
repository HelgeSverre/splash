// Splash vs Codelegate. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const CODELEGATE: Comparison = {
	slug: 'codelegate',
	name: 'Codelegate',
	description: 'How Splash and Codelegate compare on agents, platforms, licensing, worktrees, terminals and review, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Codelegate are open-source desktop apps that run several coding agents at once, each in the project folder or a git worktree. Codelegate, for macOS and Linux, runs Claude Code or Codex CLI in a terminal beside a shell and a Git pane. Splash drives agents over the Agent Client Protocol and shows each session as a transcript.',
	other: {
		name: 'Codelegate',
		url: 'https://codelegate.dev/',
		maker: 'Szu-Kai Hsu',
		summary: 'A GPLv3 desktop app for macOS and Linux that runs Claude Code or Codex CLI in a terminal per session, with a shell, a Git pane, optional worktrees and keyboard shortcuts throughout.',
		cite: ['codelegate-home', 'codelegate-readme', 'codelegate-license']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app running several agent sessions per repository, each with Agent, Terminal and Git panes; no web or mobile client', cite: ['codelegate-readme', 'codelegate-v1-0-0', 'codelegate-home'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v1.6.0 (6 August 2026), the seventh release; v1.0.0 came out in March 2026. An Electron rewrite on main is unreleased', cite: ['codelegate-releases', 'codelegate-commit-electron'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (GPL-3.0); manifests on the main branch say GPL-3.0-or-later', cite: ['codelegate-license', 'codelegate-repo', 'codelegate-package'] } },
				{ label: 'Price', splash: S.price, other: { text: 'No price or paid plan is published; the site calls it open source and downloads come from GitHub releases', cite: ['codelegate-home', 'codelegate-releases'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS on Apple silicon and Intel (DMG or .app.tar.gz); Linux x64 as AppImage, .deb or .rpm. No Windows build', cite: ['codelegate-v1-6-0', 'codelegate-home'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'v1.6.0 is Tauri 2, with a React frontend and a Rust backend; unreleased main is Electron and React, with a Rust addon for terminals and git', cite: ['codelegate-readme-v1-6-0', 'codelegate-cargo-v1-6-0', 'codelegate-readme', 'codelegate-native-cargo'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code and Codex CLI; the list is fixed in the source code, with no setting for adding agent types', cite: ['codelegate-home', 'codelegate-constants', 'codelegate-types'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each agent’s CLI in a terminal (PTY), started via your login shell with an editable command and arguments; no ACP', cite: ['codelegate-constants', 'codelegate-shell', 'codelegate-app-state', 'codelegate-notes-1-5-0', 'codelegate-readme'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'You install each CLI on your login shell’s PATH and it uses its own login; Codelegate’s settings take no API keys', cite: ['codelegate-v1-2-0', 'codelegate-constants', 'codelegate-readme'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'No Codelegate account or sign-in; the app runs locally', cite: ['codelegate-readme', 'codelegate-home'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Answered in each agent CLI’s own terminal prompts; Codelegate adds no separate approval view or waiting state', mark: 'yes', cite: ['codelegate-constants', 'codelegate-session-types'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'No MCP settings, plugin system, public API or automation CLI in the app or its docs', mark: 'no', cite: ['codelegate-readme'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Optional: a git worktree per session under ~/.codelegate/worktrees, on a new or chosen local branch; otherwise the repo checkout', mark: 'yes', cite: ['codelegate-readme', 'codelegate-notes-1-3-0'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Optional env variables and setup commands per session, with per-repository defaults, run before the agent starts; no run scripts or dev-server ports', mark: 'yes', cite: ['codelegate-v1-0-0', 'codelegate-readme', 'codelegate-app-state', 'codelegate-notes-1-5-0'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'A terminal pane per session with full shell access for any TUI tool (xterm.js); Cmd- or Ctrl-click opens URLs', mark: 'yes', cite: ['codelegate-home', 'codelegate-v1-0-0', 'codelegate-package', 'codelegate-notes-1-3-0'] } },
				{ label: 'Switch agents in a session', hint: 'Another agent in the same session', splash: { text: 'Each session runs one agent in one project folder', mark: 'no', cite: ['splash-readme'] }, other: { text: 'Since v1.5.0, Mod+Left and Mod+Right swap between Claude Code and Codex; the other agent keeps running with its scrollback', mark: 'yes', cite: ['codelegate-notes-1-5-0'] } },
				{ label: 'Keyboard shortcuts', splash: { text: 'Rebindable shortcuts in Settings; permission requests are answered with the 1–9 keys', mark: 'yes', cite: ['splash-features'] }, other: { text: 'Shortcuts for every session, pane and common action; you can change the modifier key (Alt by default), not single bindings', mark: 'yes', cite: ['codelegate-home', 'codelegate-readme'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Status lights per session, yellow for unseen background output; a collapsed sidebar briefly pops out a row on new activity. No waiting-for-input state', mark: 'partial', cite: ['codelegate-home', 'codelegate-notes-1-4-0', 'codelegate-notes-1-5-0', 'codelegate-session-types'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'OS notifications with repo and branch when a pane emits OSC 9 or 777; which agents send them isn’t documented', mark: 'partial', cite: ['codelegate-v1-0-0', 'codelegate-app-state', 'codelegate-cargo-v1-6-0', 'codelegate-notification'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Git pane with a file tree and split or unified diffs, capped at 4000 rows; no way to send feedback to the agent', mark: 'yes', cite: ['codelegate-readme', 'codelegate-v1-2-0', 'codelegate-notes-1-3-0'] } },
					{ label: 'Stage and commit', hint: 'From inside the app', splash: { text: 'No staging or commits; the workbench lists git changes and opens diff tabs', mark: 'no', cite: ['splash-features'] }, other: { text: 'The Git pane stages or unstages one file or all of them, discards all changes, and commits or amends', mark: 'yes', cite: ['codelegate-readme', 'codelegate-v1-0-0', 'codelegate-v1-2-0'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'No pull requests, CI checks or GitHub API calls in the app or its docs', mark: 'no', cite: ['codelegate-readme'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'No GitHub Issues, Linear, Jira or GitLab integration', mark: 'no', cite: ['codelegate-readme'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'None documented; agents and terminals run as local processes, with no SSH, web or mobile client', mark: 'no', cite: ['codelegate-readme', 'codelegate-app-state'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'No import of sessions started elsewhere; restore reopens Codelegate’s own saved sessions', mark: 'no', cite: ['codelegate-readme', 'codelegate-app-state'] } },
				{ label: 'Session restore', hint: 'After you quit and reopen the app', splash: { text: 'Saved conversations open without launching the agent; continuing reconnects with session/resume or session/load if the agent supports them', mark: 'yes', cite: ['splash-features'] }, other: { text: 'Optional and ticked by default when you quit: sessions reopen in their folders or worktrees and start the agent again; resuming its conversation isn’t documented', mark: 'partial', cite: ['codelegate-home', 'codelegate-readme', 'codelegate-app', 'codelegate-types', 'codelegate-app-state', 'codelegate-notes-1-5-0'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Sidebar search finds sessions; Codelegate saves each session’s repository settings and folder, not its transcript', mark: 'no', cite: ['codelegate-readme', 'codelegate-types'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Codelegate starts Claude Code or Codex CLI in a terminal through your login shell, so you see and answer each agent in its own text interface; the agent list is fixed in code. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, natively or through an adapter, and draws messages, tool calls, diffs and permission requests itself.',
			cite: ['codelegate-constants', 'codelegate-shell', 'codelegate-types', 'splash-readme', 'splash-features', 'splash-registry', 'acp']
		},
		{
			title: 'Where it runs',
			text: 'Codelegate builds for macOS (Apple silicon and Intel) and Linux x64, with no Windows build, and runs every agent and terminal on the local machine. Splash builds for macOS, Windows 11 and Ubuntu 24.04, and can also run as <code>splash-server</code> on the machine that holds your code, which you open in a browser over an SSH tunnel.',
			cite: ['codelegate-v1-6-0', 'codelegate-home', 'codelegate-readme', 'splash-install', 'splash-server']
		},
		{
			title: 'Releases, license and accounts',
			text: 'Codelegate is GPLv3 software with no published price. Its latest release, v1.6.0, is a Tauri 2 app; the main branch has since moved to Electron, in a rewrite no release has shipped yet. Splash is free, MIT-licensed and in early development. Neither needs an account.',
			cite: ['codelegate-license', 'codelegate-home', 'codelegate-readme-v1-6-0', 'codelegate-commit-electron', 'codelegate-readme', 'splash-license', 'splash-download', 'splash-readme', 'splash-build']
		},
		{
			title: 'What each is built around',
			text: 'Codelegate centers on the terminal and the keyboard: each session pairs an agent with a shell and a Git pane, one session can switch from Claude Code to Codex and back, and OSC 9 or 777 sequences from its panes become desktop notifications. Splash centers on the conversation: a Needs attention queue, review with feedback, transcript search and importing outside history.',
			cite: ['codelegate-home', 'codelegate-readme', 'codelegate-notes-1-5-0', 'codelegate-v1-0-0', 'codelegate-app-state', 'splash-features', 'splash-history']
		}
	],
	fit: {
		splash: [
			'You work on Windows, or want to run sessions on your own server and open them in a browser over SSH.',
			'You want agents beyond Claude Code and Codex, such as Gemini, Copilot, OpenCode or Goose, each session shown as a transcript.',
			'You want permission requests answered in the app and gathered with finished turns in a Needs attention queue.',
			'You want to send feedback from a review screen, search saved transcripts and import conversations started elsewhere.'
		],
		other: [
			'You want Claude Code and Codex in their own terminal interfaces, started with a command and arguments you choose.',
			'You want a shell and a Git pane in every session, with staging, commits and amends next to the diff.',
			'You want to swap between Claude Code and Codex inside one session and drive the app from the keyboard.',
			'You want environment variables and setup commands, with per-repository defaults, that run before a session’s agent starts.'
		]
	},
	sources: [
		{ id: 'codelegate-home', title: 'Codelegate - Multiple Agents, Same Repo', url: 'https://codelegate.dev/', publisher: 'Codelegate', checked: '2026-10-10' },
		{ id: 'codelegate-repo', title: 'brucehsu/codelegate', url: 'https://github.com/brucehsu/codelegate', publisher: 'brucehsu/codelegate on GitHub', checked: '2026-10-10' },
		{ id: 'codelegate-readme', title: 'README.md', url: 'https://github.com/brucehsu/codelegate/blob/main/README.md', publisher: 'brucehsu/codelegate on GitHub', checked: '2026-10-10' },
		{ id: 'codelegate-readme-v1-6-0', title: 'README.md at v1.6.0', url: 'https://github.com/brucehsu/codelegate/blob/v1.6.0/README.md', publisher: 'brucehsu/codelegate on GitHub', checked: '2026-10-10' },
		{ id: 'codelegate-cargo-v1-6-0', title: 'apps/desktop/src-tauri/Cargo.toml at v1.6.0', url: 'https://github.com/brucehsu/codelegate/blob/v1.6.0/apps/desktop/src-tauri/Cargo.toml', publisher: 'brucehsu/codelegate on GitHub', checked: '2026-10-10' },
		{ id: 'codelegate-license', title: 'LICENSE', url: 'https://github.com/brucehsu/codelegate/blob/main/LICENSE', publisher: 'brucehsu/codelegate on GitHub', checked: '2026-10-10' },
		{ id: 'codelegate-package', title: 'apps/desktop/package.json', url: 'https://github.com/brucehsu/codelegate/blob/main/apps/desktop/package.json', publisher: 'brucehsu/codelegate on GitHub', checked: '2026-10-10' },
		{ id: 'codelegate-native-cargo', title: 'apps/desktop/native/Cargo.toml', url: 'https://github.com/brucehsu/codelegate/blob/main/apps/desktop/native/Cargo.toml', publisher: 'brucehsu/codelegate on GitHub', checked: '2026-10-10' },
		{ id: 'codelegate-types', title: 'apps/desktop/electron/shared/types.ts', url: 'https://github.com/brucehsu/codelegate/blob/main/apps/desktop/electron/shared/types.ts', publisher: 'brucehsu/codelegate on GitHub', checked: '2026-10-10' },
		{ id: 'codelegate-constants', title: 'apps/desktop/src/constants.ts', url: 'https://github.com/brucehsu/codelegate/blob/main/apps/desktop/src/constants.ts', publisher: 'brucehsu/codelegate on GitHub', checked: '2026-10-10' },
		{ id: 'codelegate-shell', title: 'apps/desktop/src/utils/shell.ts', url: 'https://github.com/brucehsu/codelegate/blob/main/apps/desktop/src/utils/shell.ts', publisher: 'brucehsu/codelegate on GitHub', checked: '2026-10-10' },
		{ id: 'codelegate-app', title: 'apps/desktop/src/App.tsx', url: 'https://github.com/brucehsu/codelegate/blob/main/apps/desktop/src/App.tsx', publisher: 'brucehsu/codelegate on GitHub', checked: '2026-10-10' },
		{ id: 'codelegate-app-state', title: 'apps/desktop/src/hooks/useAppState.ts', url: 'https://github.com/brucehsu/codelegate/blob/main/apps/desktop/src/hooks/useAppState.ts', publisher: 'brucehsu/codelegate on GitHub', checked: '2026-10-10' },
		{ id: 'codelegate-session-types', title: 'apps/desktop/src/types.ts', url: 'https://github.com/brucehsu/codelegate/blob/main/apps/desktop/src/types.ts', publisher: 'brucehsu/codelegate on GitHub', checked: '2026-10-10' },
		{ id: 'codelegate-notification', title: 'apps/desktop/electron/main/ipc/notification.ts', url: 'https://github.com/brucehsu/codelegate/blob/main/apps/desktop/electron/main/ipc/notification.ts', publisher: 'brucehsu/codelegate on GitHub', checked: '2026-10-10' },
		{ id: 'codelegate-commit-electron', title: 'refactor: rewrite in Electron', url: 'https://github.com/brucehsu/codelegate/commit/acaaa0856da1a6af3a110146bba03bdb6da80b29', publisher: 'brucehsu/codelegate on GitHub', checked: '2026-10-10' },
		{ id: 'codelegate-releases', title: 'Releases', url: 'https://github.com/brucehsu/codelegate/releases', publisher: 'brucehsu/codelegate on GitHub', checked: '2026-10-10' },
		{ id: 'codelegate-v1-6-0', title: 'Codelegate v1.6.0 - A fresh look', url: 'https://github.com/brucehsu/codelegate/releases/tag/v1.6.0', publisher: 'brucehsu/codelegate on GitHub', checked: '2026-10-10' },
		{ id: 'codelegate-v1-2-0', title: 'Codelegate v1.2.0 - Git UX redesign', url: 'https://github.com/brucehsu/codelegate/releases/tag/v1.2.0', publisher: 'brucehsu/codelegate on GitHub', checked: '2026-10-10' },
		{ id: 'codelegate-v1-0-0', title: 'Codelegate v1.0.0', url: 'https://github.com/brucehsu/codelegate/releases/tag/v1.0.0', publisher: 'brucehsu/codelegate on GitHub', checked: '2026-10-10' },
		{ id: 'codelegate-notes-1-3-0', title: 'Release Notes - v1.3.0', url: 'https://github.com/brucehsu/codelegate/blob/main/apps/website/content/blog/2026-07-02-release-notes-1-3-0.en.md', publisher: 'brucehsu/codelegate on GitHub', checked: '2026-10-10' },
		{ id: 'codelegate-notes-1-4-0', title: 'Release Notes - v1.4.0', url: 'https://github.com/brucehsu/codelegate/blob/main/apps/website/content/blog/2026-07-04-release-notes-1-4-0.en.md', publisher: 'brucehsu/codelegate on GitHub', checked: '2026-10-10' },
		{ id: 'codelegate-notes-1-5-0', title: 'Release Notes - v1.5.0', url: 'https://github.com/brucehsu/codelegate/blob/main/apps/website/content/blog/2026-07-06-release-notes-1-5-0.en.md', publisher: 'brucehsu/codelegate on GitHub', checked: '2026-10-10' }
	]
};
