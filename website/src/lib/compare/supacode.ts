// Splash vs Supacode. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const SUPACODE: Comparison = {
	slug: 'supacode',
	name: 'Supacode',
	description: 'How Splash and Supacode compare on agents, platforms, licensing, worktrees, review and remote use, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Supacode both run several coding agents at once, with git worktrees to keep their work apart. Supacode, a native macOS app that embeds libghostty, runs each agent’s own command-line interface in a terminal. Splash, a desktop app for macOS, Windows and Ubuntu, drives agents over the Agent Client Protocol and shows each session as a transcript.',
	other: {
		name: 'Supacode',
		url: 'https://supacode.sh',
		maker: 'Supabit',
		summary: 'A native macOS app that runs terminal coding agents side by side. Each task gets a separate git worktree and Ghostty terminal, with GitHub pull request and CI status and a CLI for scripting.',
		cite: ['supacode-readme', 'supacode-docs', 'supacode-pr-ci']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Native macOS app that runs terminal coding agents in git worktrees, plus a supacode CLI and supacode:// deeplinks', cite: ['supacode-docs', 'supacode-readme'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v0.10.8 (3 August 2026); the site labels the download beta, and a Tip channel ships continuous pre-release builds', cite: ['supacode-release', 'supacode-home', 'supacode-tip', 'supacode-updates'] } },
				{ label: 'License', splash: S.license, other: { text: 'FSL-1.1-ALv2, which bars competing commercial use; each version becomes Apache 2.0 after two years. The site calls it open source', cite: ['supacode-license', 'supacode-home'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free download, labeled beta; no paid plan or price is published', cite: ['supacode-home'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 26 or newer, as a DMG or through Homebrew; a release note mentions Intel Macs. No Windows, Linux or mobile client', cite: ['supacode-install', 'supacode-home', 'supacode-v0-10-1'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'SwiftUI, The Composable Architecture and GhosttyKit (libghostty); no Electron or web wrapper', cite: ['supacode-install', 'supacode-home'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Hooks for 11 agents, including Claude Code, Codex, Copilot CLI, OpenCode, Kimi Code and Pi; any other agent that runs in a shell also works', cite: ['supacode-skill-agent', 'supacode-faq'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each agent’s CLI in a Ghostty terminal under zmx; hooks Supacode installs report presence and notifications over OSC 3008; neither docs nor source mention ACP', cite: ['supacode-zmx', 'supacode-hook-socket', 'supacode-agent-integration'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'You bring your own CLI agents; the docs don’t say how they sign in or whether Supacode bills for models', cite: ['supacode-home', 'supacode-privacy'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'No Supacode account; GitHub features use your gh login, and Supacode keeps no GitHub credentials of its own', cite: ['supacode-gh-cli', 'supacode-privacy'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Answered in the agent’s own terminal; Supacode documents no approval view, and its awaiting-input badge covers some agents', mark: 'partial', cite: ['supacode-terminal', 'supacode-readme', 'supacode-skill-agent'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A git worktree on its own branch and folder per task, under ~/.supacode/repos by default; plain folders also work', mark: 'yes', cite: ['supacode-first-worktree', 'supacode-faq', 'supacode-readme'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Setup, run and archive scripts per repository, plus named custom scripts; new worktrees can copy ignored files. No port handling is documented', mark: 'yes', cite: ['supacode-repo-commands', 'supacode-readme', 'supacode-repo-settings'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'A Ghostty terminal per worktree with tabs, splits and find, using your Ghostty config; sessions outlast app restarts through zmx', mark: 'yes', cite: ['supacode-terminal', 'supacode-faq', 'supacode-readme'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Live badges from agent hooks: busy and idle, plus awaiting input for some; worktrees that need you move to the top', mark: 'yes', cite: ['supacode-readme', 'supacode-skill-agent'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'In-app and optional macOS notifications, tied to the terminal that raised them, with sounds, muting and menu bar unread counts', mark: 'yes', cite: ['supacode-terminal', 'supacode-readme', 'supacode-v0-10-7'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'No diff viewer or feedback-to-agent action is documented; the toolbar shows lines added and removed', mark: 'no', cite: ['supacode-git-client', 'supacode-v0-5-1'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'Stable builds document no file or diff view; worktrees open in an external editor such as Zed, Cursor or Trae. Tip builds add a file explorer', mark: 'partial', cite: ['supacode-repo-settings', 'supacode-v0-10-6', 'supacode-pr-769', 'supacode-tip'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Not documented; PR actions apply to branches that already have an open PR: open, mark ready, merge and close', mark: 'no', cite: ['supacode-pr-ci'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Through gh: PR and draft state, checks, failing-check details and job reruns, merge-queue state, and merging with the repo’s strategy', mark: 'yes', cite: ['supacode-pr-ci', 'supacode-gh-cli', 'supacode-v0-10-0'] } },
				{ label: 'Other code hosts', hint: 'Besides GitHub', splash: { text: 'github.com through the gh CLI; no other hosts', mark: 'no', cite: ['splash-github'] }, other: { text: 'GitLab merge requests through glab, in Tip builds; stable v0.10.8 and the docs cover GitHub alone', mark: 'partial', cite: ['supacode-pr-816', 'supacode-tip'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'None documented; the GitHub integration covers pull requests and CI checks, not issues, and Linear and Jira aren’t mentioned', mark: 'no', cite: ['supacode-pr-ci', 'supacode-gh-cli'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Beta: manages worktrees of repositories on SSH hosts, Linux included; sessions survive dropped connections if the host has zmx', mark: 'partial', cite: ['supacode-readme', 'supacode-v0-10-7'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Updates itself through Sparkle, from a Stable channel or a faster Tip channel', mark: 'yes', cite: ['supacode-updates'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented; Supacode’s own terminal sessions persist across app restarts', mark: 'unknown', cite: ['supacode-terminal', 'supacode-readme'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Find in a worktree’s terminal output and a fuzzy command palette for repositories and branches; no cross-session search is documented', mark: 'partial', cite: ['supacode-terminal', 'supacode-command-palette'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Supacode runs each agent’s own CLI in an embedded Ghostty terminal, so any shell-based agent works. For 11 agents it installs hooks that report, as OSC 3008 sequences, whether the agent is busy or idle and, for some, awaiting input; it skips any agent not yet set up. Splash speaks the <strong>Agent Client Protocol</strong> with every agent and draws messages, tool calls, diffs and permission requests itself.',
			cite: ['supacode-faq', 'supacode-readme', 'supacode-skill-agent', 'supacode-agent-integration', 'supacode-hook-socket', 'splash-readme', 'splash-registry', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'Supacode runs on macOS 26 or newer. Its terminal sessions live in zmx, a session daemon, so they outlast the app, and a beta feature manages repositories on SSH hosts, Linux among them. Splash runs on macOS, Windows and Ubuntu, or as <code>splash-server</code> on the machine that holds your code, which you open in a browser over an SSH tunnel.',
			cite: ['supacode-install', 'supacode-readme', 'supacode-v0-10-7', 'splash-install', 'splash-server']
		},
		{
			title: 'Price, accounts and license',
			text: 'Supacode is a free download labeled beta, with no paid plan published and no Supacode account described. Its source is public under the <strong>Functional Source License 1.1</strong>, which bars competing commercial use and turns each version into Apache 2.0 after two years; the homepage calls it open source. Splash is free, MIT-licensed and has no accounts.',
			cite: ['supacode-home', 'supacode-gh-cli', 'supacode-license', 'splash-license', 'splash-download', 'splash-build']
		},
		{
			title: 'What each is built around',
			text: 'Supacode centers on the worktree and its terminal: setup, run and archive scripts, a CLI and <code>supacode://</code> deeplinks, and pull request status, CI reruns and merging through <code>gh</code>; no diff viewer is documented. Splash centers on the conversation: a Needs attention queue, a review screen with diffs and feedback, transcript search, and importing sessions agents started elsewhere.',
			cite: ['supacode-repo-commands', 'supacode-readme', 'supacode-pr-ci', 'supacode-git-client', 'splash-features', 'splash-history']
		}
	],
	fit: {
		splash: [
			'You work on Windows or Ubuntu as well as macOS, or on a Mac running a release older than macOS 26.',
			'You want each agent’s messages, tool calls and diffs drawn as a transcript, with permission requests answered in the app.',
			'You want to review every changed file as a diff and send feedback to the agent from the same window.',
			'You want to import conversations your agents started outside the app and search them with the rest.'
		],
		other: [
			'You want each agent’s own terminal interface in a native macOS app that embeds libghostty.',
			'You want setup, run and archive scripts per repository, and terminal sessions that outlast the app.',
			'You want to follow pull requests, rerun failed CI jobs and merge in the app through gh.',
			'You want to drive worktrees, tabs and splits from a CLI or deeplinks, or manage repositories on SSH hosts.'
		]
	},
	sources: [
		{ id: 'supacode-home', title: 'Supacode', url: 'https://supacode.sh', publisher: 'Supabit', checked: '2026-10-10' },
		{ id: 'supacode-docs', title: 'Supacode Docs', url: 'https://docs.supacode.sh', publisher: 'Supabit', checked: '2026-10-10' },
		{ id: 'supacode-install', title: 'Installation', url: 'https://docs.supacode.sh/getting-started/installation', publisher: 'Supabit', checked: '2026-10-10' },
		{ id: 'supacode-first-worktree', title: 'Your First Worktree', url: 'https://docs.supacode.sh/getting-started/first-worktree', publisher: 'Supabit', checked: '2026-10-10' },
		{ id: 'supacode-repo-commands', title: 'Repository Commands', url: 'https://docs.supacode.sh/worktree/repo-configuration', publisher: 'Supabit', checked: '2026-10-10' },
		{ id: 'supacode-repo-settings', title: 'Repository Settings', url: 'https://docs.supacode.sh/worktree/repository-settings', publisher: 'Supabit', checked: '2026-10-10' },
		{ id: 'supacode-terminal', title: 'Terminal', url: 'https://docs.supacode.sh/terminal', publisher: 'Supabit', checked: '2026-10-10' },
		{ id: 'supacode-command-palette', title: 'Command Palette', url: 'https://docs.supacode.sh/command-palette', publisher: 'Supabit', checked: '2026-10-10' },
		{ id: 'supacode-gh-cli', title: 'GitHub CLI Integration', url: 'https://docs.supacode.sh/github/github-cli-integration', publisher: 'Supabit', checked: '2026-10-10' },
		{ id: 'supacode-pr-ci', title: 'Pull Requests and CI', url: 'https://docs.supacode.sh/github/pull-requests-and-ci', publisher: 'Supabit', checked: '2026-10-10' },
		{ id: 'supacode-updates', title: 'Updates', url: 'https://docs.supacode.sh/configuration/updates', publisher: 'Supabit', checked: '2026-10-10' },
		{ id: 'supacode-faq', title: 'FAQ', url: 'https://docs.supacode.sh/reference/faq', publisher: 'Supabit', checked: '2026-10-10' },
		{ id: 'supacode-privacy', title: 'Privacy', url: 'https://docs.supacode.sh/reference/privacy', publisher: 'Supabit', checked: '2026-10-10' },
		{ id: 'supacode-readme', title: 'README.md', url: 'https://github.com/supabitapp/supacode/blob/main/README.md', publisher: 'supabitapp/supacode on GitHub', checked: '2026-10-10' },
		{ id: 'supacode-license', title: 'LICENSE', url: 'https://github.com/supabitapp/supacode/blob/main/LICENSE', publisher: 'supabitapp/supacode on GitHub', checked: '2026-10-10' },
		{ id: 'supacode-skill-agent', title: 'SupacodeSettingsShared/Models/SkillAgent.swift', url: 'https://github.com/supabitapp/supacode/blob/main/SupacodeSettingsShared/Models/SkillAgent.swift', publisher: 'supabitapp/supacode on GitHub', checked: '2026-10-10' },
		{ id: 'supacode-agent-integration', title: 'SupacodeSettingsShared/BusinessLogic/AgentIntegration.swift', url: 'https://github.com/supabitapp/supacode/blob/main/SupacodeSettingsShared/BusinessLogic/AgentIntegration.swift', publisher: 'supabitapp/supacode on GitHub', checked: '2026-10-10' },
		{ id: 'supacode-zmx', title: 'supacode/Clients/Zmx/ZmxClient.swift', url: 'https://github.com/supabitapp/supacode/blob/main/supacode/Clients/Zmx/ZmxClient.swift', publisher: 'supabitapp/supacode on GitHub', checked: '2026-10-10' },
		{ id: 'supacode-hook-socket', title: 'supacode/Infrastructure/AgentHookSocketServer.swift', url: 'https://github.com/supabitapp/supacode/blob/main/supacode/Infrastructure/AgentHookSocketServer.swift', publisher: 'supabitapp/supacode on GitHub', checked: '2026-10-10' },
		{ id: 'supacode-git-client', title: 'supacode/Clients/Git/GitClient.swift at v0.10.8', url: 'https://github.com/supabitapp/supacode/blob/v0.10.8/supacode/Clients/Git/GitClient.swift', publisher: 'supabitapp/supacode on GitHub', checked: '2026-10-10' },
		{ id: 'supacode-release', title: 'Release v0.10.8', url: 'https://github.com/supabitapp/supacode/releases/tag/v0.10.8', publisher: 'supabitapp/supacode on GitHub', checked: '2026-10-10' },
		{ id: 'supacode-tip', title: 'Supacode Tip ("Nightly")', url: 'https://github.com/supabitapp/supacode/releases/tag/tip', publisher: 'supabitapp/supacode on GitHub', checked: '2026-10-10' },
		{ id: 'supacode-v0-10-7', title: 'Release v0.10.7', url: 'https://github.com/supabitapp/supacode/releases/tag/v0.10.7', publisher: 'supabitapp/supacode on GitHub', checked: '2026-10-10' },
		{ id: 'supacode-v0-10-6', title: 'Release v0.10.6', url: 'https://github.com/supabitapp/supacode/releases/tag/v0.10.6', publisher: 'supabitapp/supacode on GitHub', checked: '2026-10-10' },
		{ id: 'supacode-v0-10-1', title: 'Release v0.10.1', url: 'https://github.com/supabitapp/supacode/releases/tag/v0.10.1', publisher: 'supabitapp/supacode on GitHub', checked: '2026-10-10' },
		{ id: 'supacode-v0-10-0', title: 'Release v0.10.0', url: 'https://github.com/supabitapp/supacode/releases/tag/v0.10.0', publisher: 'supabitapp/supacode on GitHub', checked: '2026-10-10' },
		{ id: 'supacode-v0-5-1', title: 'Release v0.5.1', url: 'https://github.com/supabitapp/supacode/releases/tag/v0.5.1', publisher: 'supabitapp/supacode on GitHub', checked: '2026-10-10' },
		{ id: 'supacode-pr-816', title: 'Abstract git forges and add GitLab support (#816)', url: 'https://github.com/supabitapp/supacode/pull/816', publisher: 'supabitapp/supacode on GitHub', checked: '2026-10-10' },
		{ id: 'supacode-pr-769', title: 'Add a file explorer to the worktree inspector (#769)', url: 'https://github.com/supabitapp/supacode/pull/769', publisher: 'supabitapp/supacode on GitHub', checked: '2026-10-10' }
	]
};
