// Splash vs Flock. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const FLOCK: Comparison = {
	slug: 'flock',
	name: 'Flock',
	description: 'How Splash and Flock compare on agents, platforms, pricing, permissions, isolation and review, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Flock are free, open-source desktop apps for running several coding agents at once. Flock, a native macOS app with a separate Windows companion, runs Claude Code and shell sessions as terminal panes in one window. Splash, for macOS, Windows and Ubuntu, drives agents over the Agent Client Protocol and shows each session as a transcript.',
	other: {
		name: 'Flock',
		url: 'https://baahaus.github.io/flock/',
		maker: 'Brandon Anderson',
		summary: 'A native macOS app that runs many Claude Code and shell sessions as tiled SwiftTerm terminal panes in one window, with broadcast typing, markdown panes and a change log. Free and MIT-licensed.',
		cite: ['flock-home', 'flock-readme', 'flock-license']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Native macOS app that runs Claude Code and shell sessions as terminal panes in one window; a separate Windows companion exists', cite: ['flock-readme', 'flock-home', 'flock-windows'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v0.11.0 (9 June 2026), the latest of 36 releases since v0.1.0 in March 2026; workspaces on main are unreleased', cite: ['flock-release', 'flock-release-0-1-0', 'flock-workspace'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (MIT); the Windows companion’s README also says MIT, but that repository has no LICENSE file', cite: ['flock-license', 'flock-readme', 'flock-windows'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free, with no subscription or paid tier listed', cite: ['flock-home'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 13 Ventura or later on Apple silicon or Intel; Flock for Windows needs Windows 10 or later (x64)', cite: ['flock-docs', 'flock-windows', 'flock-windows-release'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Swift and AppKit with a SwiftTerm fork for terminals, no Electron or web views; the Windows app uses Rust and Tauri', cite: ['flock-home', 'flock-docs', 'flock-package', 'flock-windows'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code on the site; since v0.11.0 the app also detects Codex, Gemini, opencode, Aider, Goose, Amp, Copilot and Cursor Agent', cite: ['flock-home', 'flock-privacy', 'flock-agent-cli', 'flock-multi-cli-commit'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Types the agent’s command into a login shell and infers its state from the terminal text; no ACP or SDK', cite: ['flock-terminal-pane-main', 'flock-parser', 'flock-home'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Your installed Claude Code CLI with its own login; model usage goes through your provider account, not a Flock backend', cite: ['flock-privacy', 'flock-support'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'None; Flock has no accounts, though Claude Code must be installed and logged in', cite: ['flock-privacy', 'flock-support'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Claude Code always launches with --dangerously-skip-permissions and its trust prompt is auto-accepted; other CLIs launch without approval-skipping flags', mark: 'partial', cite: ['flock-terminal-pane', 'flock-terminal-pane-main'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'No MCP settings or lists; none are documented, and the source has no MCP code', mark: 'no', cite: ['flock-docs', 'flock-readme'] } },
				{ label: 'Usage and limits', hint: 'Plan limits, context and cost', splash: { text: 'Shows context use and cost when the agent reports them', mark: 'yes', cite: ['splash-features'] }, other: { text: 'Off by default: daily Claude Code tokens and cost from local files, plus plan limits fetched with Claude Code’s login token', mark: 'partial', cite: ['flock-readme', 'flock-usage', 'flock-privacy'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'No worktrees, branches or sandboxes; new panes open in your home folder and share one filesystem', mark: 'no', cite: ['flock-terminal-pane-main', 'flock-issue-31'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'The core of the app: Claude, shell and agent-CLI panes are SwiftTerm terminals, and zsh shells get autosuggestions', mark: 'yes', cite: ['flock-home', 'flock-readme'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Agent panes show a live state, such as thinking, writing or Needs input, inferred from their terminal output', mark: 'yes', cite: ['flock-home', 'flock-parser', 'flock-changelog-main'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'A native macOS notification when a task that ran over 10 seconds finishes in a pane you aren’t focused on', mark: 'yes', cite: ['flock-docs', 'flock-readme', 'flock-terminal-pane-main'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'A change log (⌘⇧L) lists the files a Claude pane read or edited and the commands it ran; no diff view', mark: 'partial', cite: ['flock-home', 'flock-terminal-pane', 'flock-docs'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'Markdown panes open, edit and autosave .md files and flag changes made outside; no diff viewer is documented', mark: 'partial', cite: ['flock-readme'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'No GitHub, pull request, CI or issue-tracker features; Flock’s own network calls are an update check and an optional usage tracker', mark: 'no', cite: ['flock-privacy', 'flock-docs'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Not documented: no SSH, server, web or phone access, and session state stays on your Mac', mark: 'no', cite: ['flock-privacy', 'flock-docs'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Checks for a new version at launch, on by default; whether it then installs the update itself isn’t documented', mark: 'partial', cite: ['flock-docs', 'flock-privacy'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Session restore', hint: 'After you quit and reopen the app', splash: { text: 'Saved conversations open without launching the agent; continuing reconnects with session/resume or session/load if the agent supports them', mark: 'yes', cite: ['splash-features'] }, other: { text: 'Off by default: Restore Last Session reopens the layout, panes and folders, and resumes Claude panes with claude --resume', mark: 'yes', cite: ['flock-docs', 'flock-terminal-pane-main'] } },
				{ label: 'Existing agent history', hint: 'Sessions started outside the app', splash: S.history, other: { text: 'Not documented; Flock resumes Claude sessions from its own panes, not ones started outside it', mark: 'no', cite: ['flock-docs', 'flock-terminal-pane-main'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Find (⌘⇧F) searches every open pane at once; there is no search of past sessions', mark: 'partial', cite: ['flock-docs'] } }
			]
		}
	],
	differences: [
		{
			title: 'How each runs agents',
			text: 'Flock opens a login shell in a SwiftTerm pane, types the agent’s command into it and infers state from the terminal text. The site names Claude Code; v0.11.0 added eight detected CLIs, and the list isn’t user-editable. Splash connects to every agent over the <strong>Agent Client Protocol</strong>, natively or through an adapter.',
			cite: ['flock-terminal-pane-main', 'flock-parser', 'flock-home', 'flock-agent-cli', 'splash-registry', 'acp']
		},
		{
			title: 'Permissions and isolation',
			text: 'Flock launches Claude Code with <code>--dangerously-skip-permissions</code> and accepts its workspace trust prompt itself; no setting changes this, and the docs don’t mention it. All panes share your filesystem, with no worktrees. Splash shows each permission request in the transcript, answered with the 1–9 keys, and can put a session in its own git worktree.',
			cite: ['flock-terminal-pane', 'flock-terminal-pane-main', 'flock-docs', 'splash-features']
		},
		{
			title: 'What the window is built around',
			text: 'Flock is a terminal multiplexer: panes arrange themselves by count, broadcast mode (⌘⇧B) sends what you type to every pane, markdown panes edit notes alongside, and a change log lists what Claude read, edited and ran. Splash is built around the conversation: a rendered transcript, review of changed files as diffs, saved-session search and a GitHub triage view.',
			cite: ['flock-readme', 'flock-docs', 'flock-home', 'splash-features', 'splash-github']
		},
		{
			title: 'Platforms and where things run',
			text: 'Flock is a Swift app for macOS 13 or later; its maker publishes a separate Rust and Tauri app for Windows 10 or later. No server, web or phone client is documented; session state stays on the Mac. Splash builds for macOS 14+, Windows 11 and Ubuntu 24.04, plus <code>splash-server</code>, used in a browser over an SSH tunnel.',
			cite: ['flock-docs', 'flock-windows', 'flock-privacy', 'splash-install', 'splash-server']
		}
	],
	fit: {
		splash: [
			'You want every agent’s messages, tool calls, diffs and permission requests shown as one transcript over the Agent Client Protocol.',
			'You want each session in its own git worktree, with its changed files reviewed as diffs.',
			'You want to import conversations started outside the app and search saved transcripts.',
			'You work on Ubuntu, or want to run agents on another machine through splash-server.'
		],
		other: [
			'You want Claude Code and shell sessions as native terminal panes, tiled together in one macOS window.',
			'You want markdown notes edited beside your agents and a change log of what Claude read, edited and ran.',
			'You want a daily count of Claude Code tokens, cost and plan limits next to your sessions.',
			'You use macOS 13 Ventura, or Windows 10 with the separate Flock for Windows app.'
		]
	},
	sources: [
		{ id: 'flock-home', title: 'flock — let your agents loose', url: 'https://baahaus.github.io/flock/', publisher: 'Brandon Anderson', checked: '2026-10-10' },
		{ id: 'flock-readme', title: 'baahaus/flock', url: 'https://github.com/baahaus/flock', publisher: 'baahaus/flock on GitHub', checked: '2026-10-10' },
		{ id: 'flock-license', title: 'LICENSE', url: 'https://github.com/baahaus/flock/blob/main/LICENSE', publisher: 'baahaus/flock on GitHub', checked: '2026-10-10' },
		{ id: 'flock-windows', title: 'baahaus/flock-windows', url: 'https://github.com/baahaus/flock-windows', publisher: 'baahaus/flock-windows on GitHub', checked: '2026-10-10' },
		{ id: 'flock-release', title: 'Flock v0.11.0', url: 'https://github.com/baahaus/flock/releases/tag/v0.11.0', publisher: 'baahaus/flock on GitHub', checked: '2026-10-10' },
		{ id: 'flock-release-0-1-0', title: 'Flock v0.1.0', url: 'https://github.com/baahaus/flock/releases/tag/v0.1.0', publisher: 'baahaus/flock on GitHub', checked: '2026-10-10' },
		{ id: 'flock-workspace', title: 'Sources/Flock/Workspace.swift', url: 'https://github.com/baahaus/flock/blob/main/Sources/Flock/Workspace.swift', publisher: 'baahaus/flock on GitHub', checked: '2026-10-10' },
		{ id: 'flock-docs', title: 'flock docs', url: 'https://baahaus.github.io/flock/documentation.html', publisher: 'Brandon Anderson', checked: '2026-10-10' },
		{ id: 'flock-windows-release', title: 'Flock v0.2.0 (Windows)', url: 'https://github.com/baahaus/flock-windows/releases/tag/v0.2.0', publisher: 'baahaus/flock-windows on GitHub', checked: '2026-10-10' },
		{ id: 'flock-package', title: 'Package.swift', url: 'https://github.com/baahaus/flock/blob/main/Package.swift', publisher: 'baahaus/flock on GitHub', checked: '2026-10-10' },
		{ id: 'flock-privacy', title: 'flock privacy', url: 'https://baahaus.github.io/flock/privacy.html', publisher: 'Brandon Anderson', checked: '2026-10-10' },
		{ id: 'flock-agent-cli', title: 'Sources/Flock/AgentCLI.swift (v0.11.0)', url: 'https://github.com/baahaus/flock/blob/v0.11.0/Sources/Flock/AgentCLI.swift', publisher: 'baahaus/flock on GitHub', checked: '2026-10-10' },
		{ id: 'flock-multi-cli-commit', title: 'Add multi-CLI agent panes (commit 2fffe78)', url: 'https://github.com/baahaus/flock/commit/2fffe78', publisher: 'baahaus/flock on GitHub', checked: '2026-10-10' },
		{ id: 'flock-terminal-pane-main', title: 'Sources/Flock/TerminalPane.swift', url: 'https://github.com/baahaus/flock/blob/main/Sources/Flock/TerminalPane.swift', publisher: 'baahaus/flock on GitHub', checked: '2026-10-10' },
		{ id: 'flock-parser', title: 'Sources/Flock/ClaudeOutputParser.swift', url: 'https://github.com/baahaus/flock/blob/main/Sources/Flock/ClaudeOutputParser.swift', publisher: 'baahaus/flock on GitHub', checked: '2026-10-10' },
		{ id: 'flock-support', title: 'flock support', url: 'https://baahaus.github.io/flock/support.html', publisher: 'Brandon Anderson', checked: '2026-10-10' },
		{ id: 'flock-terminal-pane', title: 'Sources/Flock/TerminalPane.swift (v0.11.0)', url: 'https://github.com/baahaus/flock/blob/v0.11.0/Sources/Flock/TerminalPane.swift', publisher: 'baahaus/flock on GitHub', checked: '2026-10-10' },
		{ id: 'flock-usage', title: 'Sources/Flock/UsageTracker.swift', url: 'https://github.com/baahaus/flock/blob/main/Sources/Flock/UsageTracker.swift', publisher: 'baahaus/flock on GitHub', checked: '2026-10-10' },
		{ id: 'flock-issue-31', title: 'Configurable default working directory for new Claude/shell panes', url: 'https://github.com/baahaus/flock/issues/31', publisher: 'baahaus/flock on GitHub', checked: '2026-10-10' },
		{ id: 'flock-changelog-main', title: 'Sources/Flock/UpdateChecker.swift', url: 'https://github.com/baahaus/flock/blob/main/Sources/Flock/UpdateChecker.swift', publisher: 'baahaus/flock on GitHub', checked: '2026-10-10' }
	]
};
