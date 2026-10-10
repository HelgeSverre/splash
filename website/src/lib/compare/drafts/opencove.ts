// Splash vs OpenCove. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const OPENCOVE: Comparison = {
	slug: 'opencove',
	name: 'OpenCove',
	description: 'How Splash and OpenCove compare on agents, platforms, licensing, worktrees, review and remote use, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and OpenCove are free, open-source desktop apps for running several coding agents at once, with git worktrees to keep work apart. OpenCove places each agent’s own command-line interface in a terminal on an infinite canvas, next to tasks and notes; Splash drives agents over the Agent Client Protocol and shows each session as a transcript.',
	other: {
		name: 'OpenCove',
		url: 'https://github.com/DeadWaveWave/opencove',
		maker: 'Haojie Shi',
		summary: 'An Electron desktop app, in Alpha, that puts Claude Code, Codex and other CLI agents in terminals on an infinite canvas with tasks and notes, grouped into Spaces that can become git worktrees.',
		cite: ['opencove-readme', 'opencove-space-lifecycle']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app with an infinite canvas for agents, terminals, tasks and notes, plus a headless Worker and experimental Web UI', cite: ['opencove-readme', 'opencove-changelog'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'Alpha, aimed at early adopters; v0.3.3 (12 September 2026) is the latest stable release, with nightly builds since', cite: ['opencove-readme', 'opencove-v0-3-3', 'opencove-releases'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (MIT); its contributor agreement also lets the steward license contributions under other terms', cite: ['opencove-license', 'opencove-package', 'opencove-cla'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free; no paid plans, subscriptions or sponsorship options are listed', cite: ['opencove-readme', 'opencove-license'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon and Intel; unsigned), Windows x64, Linux x86_64 (AppImage, .deb); headless Worker bundles for all three', cite: ['opencove-v0-3-3', 'opencove-readme', 'opencove-cli-docs'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Electron, React and TypeScript; the canvas uses @xyflow/react, terminals xterm.js and node-pty', cite: ['opencove-readme', 'opencove-package'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code, Codex, OpenCode, Pi and Kimi Code; Gemini CLI has been hidden since 0.3.0. Adding other agents isn’t documented', cite: ['opencove-providers', 'opencove-changelog', 'opencove-defaults'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each agent’s own CLI in a Worker-owned PTY; Claude Code, Codex and Pi get status hooks at launch. No ACP', cite: ['opencove-agent-docs', 'opencove-claude-provider', 'opencove-codex-provider', 'opencove-pi-provider'] } },
				{ label: 'Agent sign-in', splash: S.signIn, other: { text: 'Runs the agent CLIs you install, each handling its own session; Settings can npm-install four and set their env variables', cite: ['opencove-readme', 'opencove-installer', 'opencove-changelog'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'None; an optional password guards the experimental Web UI, and manual remote Workers need an access token', cite: ['opencove-readme', 'opencove-settings-strings'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Full Access Mode, on by default, disables sandboxes and approvals; when off, Claude Code and Codex ask in their terminals', mark: 'partial', cite: ['opencove-defaults', 'opencove-settings-strings'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Per Space, not per agent: a Space can become a git worktree on its own branch, under .opencove/worktrees by default', mark: 'yes', cite: ['opencove-space-lifecycle', 'opencove-worktree-service', 'opencove-worktrees-root'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'None documented; quick commands defined in Settings can run in a terminal after its session attaches', mark: 'no', cite: ['opencove-changelog'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'Canvas terminals on xterm.js and node-pty, with find; Claude Code and Codex typed into one are tracked as agents', mark: 'yes', cite: ['opencove-readme', 'opencove-changelog'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Sidebar status rings and a standby banner; Claude Code, Codex and Pi report status through hooks, others via session files', mark: 'yes', cite: ['opencove-changelog', 'opencove-agent-docs'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'System notifications when an agent finishes work and goes to standby, including agents started in ordinary terminals', mark: 'yes', cite: ['opencove-changelog'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'Website windows as canvas nodes, which the changelog labels experimental and opt-in', mark: 'partial', cite: ['opencove-changelog'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'No diff review or feedback to the agent is documented; 0.3.0 removed the in-canvas PR diff and checks panel', mark: 'no', cite: ['opencove-changelog'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'Project file browsing and previews, plus documents edited in Monaco on the canvas; no diff view is documented', mark: 'partial', cite: ['opencove-changelog'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Through gh, a chip on a worktree Space opens its branch’s PR on GitHub; no PR creation, checks or merging', mark: 'partial', cite: ['opencove-changelog', 'opencove-gh-service'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'No integration with GitHub issues, Linear, Jira or other trackers is documented', mark: 'no', cite: ['opencove-readme', 'opencove-changelog'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Experimental, off by default: remote Workers OpenCove installs over SSH or that you run yourself, plus a browser Web UI', mark: 'partial', cite: ['opencove-managed-ssh', 'opencove-settings-strings', 'opencove-readme'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'No phone app; the experimental Web UI can serve the canvas to browsers on your local network', mark: 'no', cite: ['opencove-v0-3-3', 'opencove-readme'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Checks GitHub Releases and asks before updating on Windows and Linux; unsigned macOS builds are updated by hand', mark: 'partial', cite: ['opencove-package', 'opencove-defaults', 'opencove-releasing'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations the agent’s CLI already keeps', splash: S.history, other: { text: 'Agent nodes reload or switch among sessions read from each CLI’s local store, with previews; Kimi Code lists none', mark: 'partial', cite: ['opencove-changelog', 'opencove-session-catalog'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Searches the canvas and terminal output; search across saved agent conversations isn’t documented', mark: 'partial', cite: ['opencove-readme', 'opencove-changelog'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'OpenCove starts each agent’s own CLI in a terminal that its Worker owns, and injects status hooks at launch: a temporary settings file for Claude Code, <code>--config</code> overrides for Codex and an extension for Pi. Other agents are tracked through their session files. Splash talks to every agent over the <strong>Agent Client Protocol</strong>, natively or through an adapter.',
			cite: ['opencove-agent-docs', 'opencove-claude-provider', 'opencove-codex-provider', 'opencove-pi-provider', 'splash-registry', 'acp']
		},
		{
			title: 'A canvas or a list of sessions',
			text: 'OpenCove lays out agents, terminals, tasks and notes on an infinite canvas, grouped into <strong>Spaces</strong> that can each become a git worktree, and its <code>opencove</code> CLI lets agents and scripts edit canvas nodes. Splash is built around sessions, each one agent in one folder, shown as a transcript beside a <strong>Needs attention</strong> queue, a review screen and transcript search.',
			cite: ['opencove-readme', 'opencove-space-lifecycle', 'opencove-changelog', 'opencove-cli-docs', 'splash-readme', 'splash-features']
		},
		{
			title: 'Where agents run',
			text: 'OpenCove runs agents locally. Experimental settings, off by default, add remote Workers on SSH hosts that OpenCove installs or on endpoints you administer, and a Worker Web UI that stays on loopback unless you allow LAN access with a password. Splash runs locally, or as <code>splash-server</code> on a machine you open in a browser through an SSH tunnel.',
			cite: ['opencove-managed-ssh', 'opencove-settings-strings', 'opencove-readme', 'splash-readme', 'splash-server']
		},
		{
			title: 'Permissions by default',
			text: 'OpenCove turns on <strong>Full Access Mode</strong> by default, which disables the agents’ sandboxes and manual approvals; with it off, Claude Code and Codex ask in their own terminals and OpenCove marks them as waiting. Splash shows each permission request in the transcript, answered with the 1–9 keys, and keeps pending ones in <strong>Needs attention</strong>.',
			cite: ['opencove-defaults', 'opencove-settings-strings', 'splash-features']
		},
		{
			title: 'License, platforms and updates',
			text: 'Both are MIT-licensed; OpenCove’s contributor license agreement also lets its steward license contributions under other terms, including proprietary ones. OpenCove, in Alpha, ships unsigned macOS builds updated by hand, plus Windows x64 and Linux x86_64 builds that check GitHub for updates. Splash builds for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64; new versions are downloaded from GitHub.',
			cite: ['opencove-license', 'opencove-cla', 'opencove-readme', 'opencove-v0-3-3', 'opencove-releasing', 'opencove-package', 'splash-license', 'splash-install', 'splash-about']
		}
	],
	fit: {
		splash: [
			'You want every agent driven over the Agent Client Protocol, with each session shown as a transcript.',
			'You want to review changed files as diffs and send feedback to the agent from the same screen.',
			'You want to import conversations your agents started elsewhere and search their saved transcripts.',
			'You want a GitHub view of issues, pull requests and Actions runs across repositories.'
		],
		other: [
			'You want agents, terminals, tasks and notes arranged on an infinite canvas, grouped into Spaces.',
			'You want each agent’s own terminal interface, with Claude Code and Codex tracked even when typed into an ordinary canvas terminal.',
			'You want to browse project files and edit documents in Monaco next to your agents.',
			'You want to try remote Workers that OpenCove installs over SSH, or open the canvas from a browser.'
		]
	},
	sources: [
		{ id: 'opencove-readme', title: 'OpenCove README', url: 'https://github.com/DeadWaveWave/opencove/blob/main/README.md', publisher: 'DeadWaveWave/opencove on GitHub', checked: '2026-10-10' },
		{ id: 'opencove-changelog', title: 'CHANGELOG.md', url: 'https://github.com/DeadWaveWave/opencove/blob/main/CHANGELOG.md', publisher: 'DeadWaveWave/opencove on GitHub', checked: '2026-10-10' },
		{ id: 'opencove-package', title: 'package.json', url: 'https://github.com/DeadWaveWave/opencove/blob/main/package.json', publisher: 'DeadWaveWave/opencove on GitHub', checked: '2026-10-10' },
		{ id: 'opencove-license', title: 'LICENSE', url: 'https://github.com/DeadWaveWave/opencove/blob/main/LICENSE', publisher: 'DeadWaveWave/opencove on GitHub', checked: '2026-10-10' },
		{ id: 'opencove-cla', title: 'OpenCove Contributor License Agreement', url: 'https://github.com/DeadWaveWave/opencove/blob/main/CLA.md', publisher: 'DeadWaveWave/opencove on GitHub', checked: '2026-10-10' },
		{ id: 'opencove-releases', title: 'Releases', url: 'https://github.com/DeadWaveWave/opencove/releases', publisher: 'DeadWaveWave/opencove on GitHub', checked: '2026-10-10' },
		{ id: 'opencove-v0-3-3', title: 'Release v0.3.3', url: 'https://github.com/DeadWaveWave/opencove/releases/tag/v0.3.3', publisher: 'DeadWaveWave/opencove on GitHub', checked: '2026-10-10' },
		{ id: 'opencove-cli-docs', title: 'docs/cli/README.md', url: 'https://github.com/DeadWaveWave/opencove/blob/main/docs/cli/README.md', publisher: 'DeadWaveWave/opencove on GitHub', checked: '2026-10-10' },
		{ id: 'opencove-releasing', title: 'docs/runtime/RELEASING.md', url: 'https://github.com/DeadWaveWave/opencove/blob/main/docs/runtime/RELEASING.md', publisher: 'DeadWaveWave/opencove on GitHub', checked: '2026-10-10' },
		{ id: 'opencove-agent-docs', title: 'Agent Runtime', url: 'https://github.com/DeadWaveWave/opencove/blob/main/docs/agent/README.md', publisher: 'DeadWaveWave/opencove on GitHub', checked: '2026-10-10' },
		{ id: 'opencove-managed-ssh', title: 'docs/runtime/MANAGED_SSH_RUNTIME.md', url: 'https://github.com/DeadWaveWave/opencove/blob/main/docs/runtime/MANAGED_SSH_RUNTIME.md', publisher: 'DeadWaveWave/opencove on GitHub', checked: '2026-10-10' },
		{ id: 'opencove-space-lifecycle', title: 'docs/canvas/SPACE_LIFECYCLE_SPEC.md', url: 'https://github.com/DeadWaveWave/opencove/blob/main/docs/canvas/SPACE_LIFECYCLE_SPEC.md', publisher: 'DeadWaveWave/opencove on GitHub', checked: '2026-10-10' },
		{ id: 'opencove-providers', title: 'agentSettings.providers.ts', url: 'https://github.com/DeadWaveWave/opencove/blob/main/src/contexts/settings/domain/agentSettings.providers.ts', publisher: 'DeadWaveWave/opencove on GitHub', checked: '2026-10-10' },
		{ id: 'opencove-defaults', title: 'agentSettings.defaults.ts', url: 'https://github.com/DeadWaveWave/opencove/blob/main/src/contexts/settings/domain/agentSettings.defaults.ts', publisher: 'DeadWaveWave/opencove on GitHub', checked: '2026-10-10' },
		{ id: 'opencove-installer', title: 'AgentProviderInstaller.ts', url: 'https://github.com/DeadWaveWave/opencove/blob/main/src/contexts/agent/infrastructure/cli/AgentProviderInstaller.ts', publisher: 'DeadWaveWave/opencove on GitHub', checked: '2026-10-10' },
		{ id: 'opencove-claude-provider', title: 'ClaudeCodeAgentProviderContribution.ts', url: 'https://github.com/DeadWaveWave/opencove/blob/main/src/contexts/agent/infrastructure/providers/claude-code/ClaudeCodeAgentProviderContribution.ts', publisher: 'DeadWaveWave/opencove on GitHub', checked: '2026-10-10' },
		{ id: 'opencove-codex-provider', title: 'CodexAgentProviderContribution.ts', url: 'https://github.com/DeadWaveWave/opencove/blob/main/src/contexts/agent/infrastructure/providers/codex/CodexAgentProviderContribution.ts', publisher: 'DeadWaveWave/opencove on GitHub', checked: '2026-10-10' },
		{ id: 'opencove-pi-provider', title: 'PiAgentProviderContribution.ts', url: 'https://github.com/DeadWaveWave/opencove/blob/main/src/contexts/agent/infrastructure/providers/pi/PiAgentProviderContribution.ts', publisher: 'DeadWaveWave/opencove on GitHub', checked: '2026-10-10' },
		{ id: 'opencove-settings-strings', title: 'en.settingsPanel.ts', url: 'https://github.com/DeadWaveWave/opencove/blob/main/src/app/renderer/i18n/locales/en.settingsPanel.ts', publisher: 'DeadWaveWave/opencove on GitHub', checked: '2026-10-10' },
		{ id: 'opencove-worktree-service', title: 'GitWorktreeService.ts', url: 'https://github.com/DeadWaveWave/opencove/blob/main/src/contexts/worktree/infrastructure/git/GitWorktreeService.ts', publisher: 'DeadWaveWave/opencove on GitHub', checked: '2026-10-10' },
		{ id: 'opencove-worktrees-root', title: 'resolveWorktreesRoot.ts', url: 'https://github.com/DeadWaveWave/opencove/blob/main/src/contexts/worktree/application/resolveWorktreesRoot.ts', publisher: 'DeadWaveWave/opencove on GitHub', checked: '2026-10-10' },
		{ id: 'opencove-session-catalog', title: 'AgentSessionCatalog.ts', url: 'https://github.com/DeadWaveWave/opencove/blob/main/src/contexts/agent/infrastructure/cli/AgentSessionCatalog.ts', publisher: 'DeadWaveWave/opencove on GitHub', checked: '2026-10-10' },
		{ id: 'opencove-gh-service', title: 'GitHubPullRequestGhService.ts', url: 'https://github.com/DeadWaveWave/opencove/blob/main/src/contexts/integration/infrastructure/github/GitHubPullRequestGhService.ts', publisher: 'DeadWaveWave/opencove on GitHub', checked: '2026-10-10' }
	]
};
