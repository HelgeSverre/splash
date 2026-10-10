// Splash vs Vibeyard. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const VIBEYARD: Comparison = {
	slug: 'vibeyard',
	name: 'Vibeyard',
	description: 'How Splash and Vibeyard compare on agents, platforms, licensing, isolation, review and session sharing, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Vibeyard are both free, open-source desktop apps for running several coding agents at once. Vibeyard, an Electron app, runs each agent’s own command-line interface in a terminal and tracks it through hooks it adds to that CLI’s settings; Splash, a Rust app, drives agents over the Agent Client Protocol and renders their work as a transcript.',
	other: {
		name: 'Vibeyard',
		url: 'https://github.com/elirantutia/vibeyard',
		maker: 'Eliran Tutia',
		summary: 'An open-source Electron app that runs Claude Code, Codex, GitHub Copilot or Gemini CLI sessions per project, each in a terminal, with status dots, cost tracking, a kanban board, a browser tab and session sharing.',
		cite: ['vibeyard-readme', 'vibeyard-site', 'vibeyard-license', 'vibeyard-package']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Electron desktop app that runs coding agents’ CLIs in terminals; no web client, server mode or mobile app', cite: ['vibeyard-package', 'vibeyard-readme', 'vibeyard-security'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v0.3.8 (3 September 2026), the latest of 37 releases since March 2026; its website calls it a stable release', cite: ['vibeyard-release', 'vibeyard-repo', 'vibeyard-changelog', 'vibeyard-site'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (MIT)', cite: ['vibeyard-license', 'vibeyard-package'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free; no paid tier is documented, and the maintainer accepts GitHub Sponsors', cite: ['vibeyard-readme', 'vibeyard-repo'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon and Intel), Windows x64 (installer or portable .exe), Linux x64 (.deb and AppImage)', cite: ['vibeyard-readme', 'vibeyard-release', 'vibeyard-release-workflow', 'vibeyard-changelog'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Electron, written mainly in TypeScript, with xterm.js terminals over node-pty', cite: ['vibeyard-package', 'vibeyard-repo', 'vibeyard-pty'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code, Codex CLI, GitHub Copilot CLI and Gemini CLI; the set is fixed in code, with no custom agents', cite: ['vibeyard-site', 'vibeyard-types', 'vibeyard-registry', 'vibeyard-readme'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each agent’s own CLI runs in a terminal (node-pty); hooks Vibeyard installs report its status. No ACP or vendor SDK', cite: ['vibeyard-pty', 'vibeyard-readme', 'vibeyard-hooks', 'vibeyard-package'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Each CLI’s own login, which bills model use; Claude profiles keep several Claude Code logins apart', cite: ['vibeyard-readme', 'vibeyard-keychain'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'No Vibeyard account; app state is kept in ~/.vibeyard on your computer', cite: ['vibeyard-readme', 'vibeyard-store'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Each agent asks in its own terminal interface; a Claude Code request also turns its tab to input needed', mark: 'yes', cite: ['vibeyard-pty', 'vibeyard-hooks'] } },
				{ label: 'Cost and context', splash: { text: 'Context and cost readouts when the agent reports them', mark: 'yes', cite: ['splash-features'] }, other: { text: 'Spend, tokens and context window per session, plus an inspector with a timeline, cost breakdown and tool-use stats', mark: 'yes', cite: ['vibeyard-readme', 'vibeyard-hook-status'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'An MCP inspector tab connects to servers over SSE or HTTP; a dialog adds servers to Claude Code’s config', mark: 'partial', cite: ['vibeyard-mcp-client', 'vibeyard-mcp-add', 'vibeyard-claude-cli'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Sessions share the project folder, each in its own process; worktrees come from Claude Code, and Vibeyard lists them', mark: 'partial', cite: ['vibeyard-readme', 'vibeyard-pty', 'vibeyard-changelog', 'vibeyard-git-status', 'vibeyard-claude-cli'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'Every session is a terminal; a project terminal panel holds several shells, with search and a right-click menu', mark: 'yes', cite: ['vibeyard-readme', 'vibeyard-changelog'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Status dots per tab (working, waiting, input needed, completed), a sessions panel across projects and optional desktop notifications', mark: 'yes', cite: ['vibeyard-readme', 'vibeyard-changelog'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'Browser tab for any URL, with Chrome cookie import; inspect mode sends an element’s selector, text and URL to an agent', mark: 'yes', cite: ['vibeyard-readme', 'vibeyard-changelog'] } },
				{ label: 'Agents handing off work', hint: 'Moving a session’s work to another agent', splash: S.handoff, other: { text: 'Resume a session with a different agent; it gets the earlier transcript’s path to read as history', mark: 'yes', cite: ['vibeyard-changelog', 'vibeyard-resume-handoff'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Diff viewer with stage, unstage and discard; Ask AI sends selected file text to an agent. No inline diff comments', mark: 'yes', cite: ['vibeyard-changelog', 'vibeyard-ipc'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'No; Vibeyard’s GitHub code lists pull requests and issues and has no create or merge step', mark: 'no', cite: ['vibeyard-github-cli'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Dashboard widgets list PRs and issues through gh, with review, fix and add-to-kanban actions; no CI or check status', mark: 'yes', cite: ['vibeyard-readme', 'vibeyard-github-cli', 'vibeyard-changelog'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Runs on your computer; no SSH remotes, server mode or web client, and no network services exposed', mark: 'no', cite: ['vibeyard-security'] } },
				{ label: 'Team collaboration', hint: 'Several people on one session', splash: { text: 'splash-server is a personal, single-user service, not a multi-user deployment', mark: 'no', cite: ['splash-server'] }, other: { text: 'Encrypted peer-to-peer WebRTC with a PIN; the host picks read-only or read-write, and the full scrollback is shared', mark: 'yes', cite: ['vibeyard-readme', 'vibeyard-share-dialog'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Checks GitHub Releases shortly after launch and every four hours, downloads updates itself and installs them on quit', mark: 'yes', cite: ['vibeyard-auto-updater', 'vibeyard-package'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'History reads each CLI’s transcripts from disk, so Claude sessions started elsewhere may appear; no import feature is documented', mark: 'partial', cite: ['vibeyard-deep-search', 'vibeyard-claude-provider'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'A global session search palette looks through the saved transcripts of every supported agent', mark: 'yes', cite: ['vibeyard-changelog', 'vibeyard-deep-search'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Vibeyard runs each agent’s own CLI in a terminal and reads its status, cost and context from hooks it adds to the agents’ settings in <code>~/.claude</code>, <code>~/.codex</code> and <code>~/.gemini</code>, and to a file under <code>.github/hooks</code> in projects where Copilot runs. The hook scripts run on Python. Splash speaks the <strong>Agent Client Protocol</strong> with every agent and draws the transcript itself.',
			cite: ['vibeyard-pty', 'vibeyard-hooks', 'vibeyard-hook-status', 'vibeyard-codex-hooks', 'vibeyard-copilot-hooks', 'vibeyard-platform', 'vibeyard-prerequisites', 'splash-readme', 'splash-features', 'splash-registry', 'acp']
		},
		{
			title: 'Where it runs, and sharing',
			text: 'Vibeyard runs on your computer and exposes no network services. To work with someone, you share a live terminal peer to peer over WebRTC, with a PIN and a read-only or read-write mode you pick. Splash runs locally or as <code>splash-server</code> on the machine with your code, which one user reaches through an SSH tunnel.',
			cite: ['vibeyard-security', 'vibeyard-readme', 'vibeyard-share-dialog', 'splash-readme', 'splash-server']
		},
		{
			title: 'Price, license and platforms',
			text: 'Both are free, MIT-licensed and need no account. Vibeyard, an Electron app, ships builds for macOS (Apple silicon and Intel), Windows x64 and Linux x64 and installs its own updates. Splash, a Rust app, builds for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64 plus a headless server, and is updated by downloading a new release.',
			cite: ['vibeyard-license', 'vibeyard-readme', 'vibeyard-release-workflow', 'vibeyard-auto-updater', 'splash-license', 'splash-download', 'splash-build', 'splash-install', 'splash-about']
		},
		{
			title: 'Tools around the session',
			text: 'Vibeyard builds project tools around the terminals: a kanban board whose cards start or resume sessions and move to Done once the session ends, an AI Readiness Score with one-click fixes, a persona library and a grid view of every session. Splash builds around the conversation: a transcript, a <strong>Needs attention</strong> queue, a review screen and a GitHub triage view.',
			cite: ['vibeyard-readme', 'vibeyard-changelog', 'splash-features', 'splash-github']
		}
	],
	fit: {
		splash: [
			'You want every agent driven over the Agent Client Protocol and shown as a transcript, with permission requests in one queue.',
			'You want each session in its own git worktree on its own branch, whichever agent it runs.',
			'You want to import conversations agents started outside the app and search them with the rest.',
			'You want to run sessions on your own server and use them from a browser over SSH.'
		],
		other: [
			'You want each agent’s own terminal interface, with status dots and per-session cost and context figures.',
			'You want to move a session to a different agent that picks up from the earlier transcript.',
			'You want a built-in browser that sends a page element you pick to an agent.',
			'You want to share a live agent terminal with a teammate, read-only or read-write.'
		]
	},
	sources: [
		{ id: 'vibeyard-repo', title: 'elirantutia/vibeyard', url: 'https://github.com/elirantutia/vibeyard', publisher: 'elirantutia/vibeyard on GitHub', checked: '2026-10-10' },
		{ id: 'vibeyard-readme', title: 'README.md', url: 'https://github.com/elirantutia/vibeyard/blob/main/README.md', publisher: 'elirantutia/vibeyard on GitHub', checked: '2026-10-10' },
		{ id: 'vibeyard-site', title: 'Vibeyard — The IDE built for AI coding agents', url: 'https://vibeyard.app/', publisher: 'Eliran Tutia', checked: '2026-10-10' },
		{ id: 'vibeyard-package', title: 'package.json', url: 'https://github.com/elirantutia/vibeyard/blob/main/package.json', publisher: 'elirantutia/vibeyard on GitHub', checked: '2026-10-10' },
		{ id: 'vibeyard-license', title: 'LICENSE', url: 'https://github.com/elirantutia/vibeyard/blob/main/LICENSE', publisher: 'elirantutia/vibeyard on GitHub', checked: '2026-10-10' },
		{ id: 'vibeyard-changelog', title: 'CHANGELOG.md', url: 'https://github.com/elirantutia/vibeyard/blob/main/CHANGELOG.md', publisher: 'elirantutia/vibeyard on GitHub', checked: '2026-10-10' },
		{ id: 'vibeyard-security', title: 'SECURITY.md', url: 'https://github.com/elirantutia/vibeyard/blob/main/SECURITY.md', publisher: 'elirantutia/vibeyard on GitHub', checked: '2026-10-10' },
		{ id: 'vibeyard-hooks', title: 'HOOKS.md', url: 'https://github.com/elirantutia/vibeyard/blob/main/HOOKS.md', publisher: 'elirantutia/vibeyard on GitHub', checked: '2026-10-10' },
		{ id: 'vibeyard-release', title: 'Release 0.3.8', url: 'https://github.com/elirantutia/vibeyard/releases/tag/v0.3.8', publisher: 'elirantutia/vibeyard on GitHub', checked: '2026-10-10' },
		{ id: 'vibeyard-release-workflow', title: '.github/workflows/release.yml', url: 'https://github.com/elirantutia/vibeyard/blob/main/.github/workflows/release.yml', publisher: 'elirantutia/vibeyard on GitHub', checked: '2026-10-10' },
		{ id: 'vibeyard-types', title: 'src/shared/types.ts', url: 'https://github.com/elirantutia/vibeyard/blob/main/src/shared/types.ts', publisher: 'elirantutia/vibeyard on GitHub', checked: '2026-10-10' },
		{ id: 'vibeyard-registry', title: 'src/main/providers/registry.ts', url: 'https://github.com/elirantutia/vibeyard/blob/main/src/main/providers/registry.ts', publisher: 'elirantutia/vibeyard on GitHub', checked: '2026-10-10' },
		{ id: 'vibeyard-claude-provider', title: 'src/main/providers/claude-provider.ts', url: 'https://github.com/elirantutia/vibeyard/blob/main/src/main/providers/claude-provider.ts', publisher: 'elirantutia/vibeyard on GitHub', checked: '2026-10-10' },
		{ id: 'vibeyard-resume-handoff', title: 'src/main/providers/resume-handoff.ts', url: 'https://github.com/elirantutia/vibeyard/blob/main/src/main/providers/resume-handoff.ts', publisher: 'elirantutia/vibeyard on GitHub', checked: '2026-10-10' },
		{ id: 'vibeyard-pty', title: 'src/main/pty-manager.ts', url: 'https://github.com/elirantutia/vibeyard/blob/main/src/main/pty-manager.ts', publisher: 'elirantutia/vibeyard on GitHub', checked: '2026-10-10' },
		{ id: 'vibeyard-hook-status', title: 'src/main/hook-status.ts', url: 'https://github.com/elirantutia/vibeyard/blob/main/src/main/hook-status.ts', publisher: 'elirantutia/vibeyard on GitHub', checked: '2026-10-10' },
		{ id: 'vibeyard-codex-hooks', title: 'src/main/codex-hooks.ts', url: 'https://github.com/elirantutia/vibeyard/blob/main/src/main/codex-hooks.ts', publisher: 'elirantutia/vibeyard on GitHub', checked: '2026-10-10' },
		{ id: 'vibeyard-copilot-hooks', title: 'src/main/copilot-hooks.ts', url: 'https://github.com/elirantutia/vibeyard/blob/main/src/main/copilot-hooks.ts', publisher: 'elirantutia/vibeyard on GitHub', checked: '2026-10-10' },
		{ id: 'vibeyard-platform', title: 'src/main/platform.ts', url: 'https://github.com/elirantutia/vibeyard/blob/main/src/main/platform.ts', publisher: 'elirantutia/vibeyard on GitHub', checked: '2026-10-10' },
		{ id: 'vibeyard-prerequisites', title: 'src/main/prerequisites.ts', url: 'https://github.com/elirantutia/vibeyard/blob/main/src/main/prerequisites.ts', publisher: 'elirantutia/vibeyard on GitHub', checked: '2026-10-10' },
		{ id: 'vibeyard-keychain', title: 'src/main/claude-keychain.ts', url: 'https://github.com/elirantutia/vibeyard/blob/main/src/main/claude-keychain.ts', publisher: 'elirantutia/vibeyard on GitHub', checked: '2026-10-10' },
		{ id: 'vibeyard-store', title: 'src/main/store.ts', url: 'https://github.com/elirantutia/vibeyard/blob/main/src/main/store.ts', publisher: 'elirantutia/vibeyard on GitHub', checked: '2026-10-10' },
		{ id: 'vibeyard-claude-cli', title: 'src/main/claude-cli.ts', url: 'https://github.com/elirantutia/vibeyard/blob/main/src/main/claude-cli.ts', publisher: 'elirantutia/vibeyard on GitHub', checked: '2026-10-10' },
		{ id: 'vibeyard-git-status', title: 'src/main/git-status.ts', url: 'https://github.com/elirantutia/vibeyard/blob/main/src/main/git-status.ts', publisher: 'elirantutia/vibeyard on GitHub', checked: '2026-10-10' },
		{ id: 'vibeyard-ipc', title: 'src/main/ipc-handlers.ts', url: 'https://github.com/elirantutia/vibeyard/blob/main/src/main/ipc-handlers.ts', publisher: 'elirantutia/vibeyard on GitHub', checked: '2026-10-10' },
		{ id: 'vibeyard-github-cli', title: 'src/main/github-cli.ts', url: 'https://github.com/elirantutia/vibeyard/blob/main/src/main/github-cli.ts', publisher: 'elirantutia/vibeyard on GitHub', checked: '2026-10-10' },
		{ id: 'vibeyard-mcp-client', title: 'src/main/mcp-client.ts', url: 'https://github.com/elirantutia/vibeyard/blob/main/src/main/mcp-client.ts', publisher: 'elirantutia/vibeyard on GitHub', checked: '2026-10-10' },
		{ id: 'vibeyard-mcp-add', title: 'src/renderer/components/mcp-add-modal.ts', url: 'https://github.com/elirantutia/vibeyard/blob/main/src/renderer/components/mcp-add-modal.ts', publisher: 'elirantutia/vibeyard on GitHub', checked: '2026-10-10' },
		{ id: 'vibeyard-share-dialog', title: 'src/renderer/components/share-dialog.ts', url: 'https://github.com/elirantutia/vibeyard/blob/main/src/renderer/components/share-dialog.ts', publisher: 'elirantutia/vibeyard on GitHub', checked: '2026-10-10' },
		{ id: 'vibeyard-auto-updater', title: 'src/main/auto-updater.ts', url: 'https://github.com/elirantutia/vibeyard/blob/main/src/main/auto-updater.ts', publisher: 'elirantutia/vibeyard on GitHub', checked: '2026-10-10' },
		{ id: 'vibeyard-deep-search', title: 'src/main/session-deep-search.ts', url: 'https://github.com/elirantutia/vibeyard/blob/main/src/main/session-deep-search.ts', publisher: 'elirantutia/vibeyard on GitHub', checked: '2026-10-10' }
	]
};
