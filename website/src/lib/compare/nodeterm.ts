// Splash vs nodeterm. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const NODETERM: Comparison = {
	slug: 'nodeterm',
	name: 'nodeterm',
	description: 'How Splash and nodeterm compare on agents, platforms, pricing, worktrees, review and remote use, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and nodeterm both run several coding agents at once and use git worktrees to keep their work apart. nodeterm is an Electron app that places each agent’s CLI in a terminal node, usually under tmux, on a pan-and-zoom canvas; Splash is a Rust app that drives agents over the Agent Client Protocol and shows each session as a transcript.',
	other: {
		name: 'nodeterm',
		url: 'https://nodeterm.dev/',
		maker: 'Enes Kirca',
		summary: 'A desktop app that places terminals and coding-agent CLIs as nodes on a pan-and-zoom canvas, usually in tmux sessions that outlive the app, with a browser Server Edition and an iOS companion.',
		cite: ['nodeterm-home', 'nodeterm-readme', 'nodeterm-persistence', 'nodeterm-server', 'nodeterm-mobile']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Electron app placing terminals and agents as nodes on a zoomable canvas, plus a browser Server Edition and an iOS companion', cite: ['nodeterm-home', 'nodeterm-readme', 'nodeterm-server', 'nodeterm-mobile'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v0.4.3 (9 October 2026), labelled early access; v0.4.0 through v0.4.3 came out within ten days', cite: ['nodeterm-github-releases', 'nodeterm-home', 'nodeterm-installation'] } },
				{ label: 'License', splash: S.license, other: { text: 'BUSL-1.1, not an open source license: it bars competing hosted or commercial offerings, and each release turns MIT after four years', cite: ['nodeterm-license', 'nodeterm-terms', 'nodeterm-faq'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free core app; Pro is $10/month on desktop (shown in the app), and $9.99/month, $79.99/year or $299 lifetime on iOS', cite: ['nodeterm-terms', 'nodeterm-license-section', 'nodeterm-app-store'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 12+ (Apple silicon and Intel), Linux x64 (AppImage, .deb, .rpm) and Windows x64 in beta; the FAQ still calls Windows unsupported', cite: ['nodeterm-home', 'nodeterm-installation', 'nodeterm-readme', 'nodeterm-releases', 'nodeterm-faq'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code, Codex, Antigravity, Gemini, opencode, Grok and GitHub Copilot built in (the docs list four), plus custom CLI agents', cite: ['nodeterm-agent-config', 'nodeterm-readme', 'nodeterm-agents'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Starts each agent’s CLI in a terminal, usually inside tmux; built-in agents report status through hooks it installs, not by output parsing', cite: ['nodeterm-agents', 'nodeterm-persistence', 'nodeterm-status'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'CLIs you’ve installed and signed in to, on your own plans or API keys; managed accounts keep several Claude and Codex logins', cite: ['nodeterm-faq', 'nodeterm-claude-accounts', 'nodeterm-releases'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'No nodeterm account; desktop Pro is a license key bound to the installation, and Team Access knows teammates by device', cite: ['nodeterm-privacy', 'nodeterm-terms', 'nodeterm-settings', 'nodeterm-team'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Each CLI’s own prompt, answered inside its node; Claude Code also has a permission-mode setting for terminal agent nodes', mark: 'yes', cite: ['nodeterm-home', 'nodeterm-permission-modes'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A git worktree attached to a canvas group frame; every node made inside works in its folder. SSH projects don’t support worktrees', mark: 'yes', cite: ['nodeterm-worktrees', 'nodeterm-ssh'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Per-project setup and archive scripts for worktrees, with paths like .env linked in; dev-server ports are listed for SSH forwarding', mark: 'yes', cite: ['nodeterm-project-settings', 'nodeterm-releases'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'Terminal nodes (xterm over tmux) survive app restarts; after a reboot, scrollback returns and agents relaunch from their saved sessions', mark: 'yes', cite: ['nodeterm-readme', 'nodeterm-persistence'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'RUNNING and NEEDS YOU badges on nodes, unread markers, and a sidebar Status view that puts sessions needing attention first', mark: 'yes', cite: ['nodeterm-status', 'nodeterm-v0-3-2', 'nodeterm-releases'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'Opt-in OS notifications that bring the node into view when clicked; on a MacBook, the notch also flags a blocked agent', mark: 'yes', cite: ['nodeterm-status', 'nodeterm-home', 'nodeterm-readme'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Through the canvas-control CLI, agents open nodes, start teams and check each other’s work; context links share transcripts between agents', mark: 'yes', cite: ['nodeterm-readme', 'nodeterm-context-link'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'Web, video and browser nodes sit on the canvas beside terminals, with page zoom since v0.3.13', mark: 'yes', cite: ['nodeterm-readme', 'nodeterm-home', 'nodeterm-releases'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Read-only Monaco diff nodes for staged or unstaged changes; line comments and review feedback to the agent aren’t documented', mark: 'yes', cite: ['nodeterm-editor-diff'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'Monaco editor nodes that save with ⌘S, read-only diff nodes, an Explorer file tree and a Source Control panel', mark: 'yes', cite: ['nodeterm-editor-diff', 'nodeterm-palette', 'nodeterm-source-control'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'No PR action is documented: Source Control stages, commits and pushes, with agent-drafted commit messages; agents run gh pr create', mark: 'no', cite: ['nodeterm-readme', 'nodeterm-source-control', 'nodeterm-github-issues'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Signs in through gh; opt-in GitHub Issues on the kanban board sync both ways, and PR cards carry CI and merge status', mark: 'yes', cite: ['nodeterm-source-control', 'nodeterm-readme', 'nodeterm-releases'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'GitHub Issues on the kanban board; a card dropped in a dispatch column starts an agent run. No built-in Linear or Jira', mark: 'partial', cite: ['nodeterm-readme', 'nodeterm-releases', 'nodeterm-canvas-control'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'SSH projects run terminals and agents on a remote host; the Server Edition serves the canvas to a browser behind one password', mark: 'yes', cite: ['nodeterm-ssh', 'nodeterm-server'] } },
				{ label: 'Team collaboration', splash: { text: 'splash-server is a personal, single-user service, not a multi-user deployment', mark: 'no', cite: ['splash-server'] }, other: { text: 'Pro: Team Access shares a Mac’s canvas with teammates at $5 a seat monthly; live links stream one terminal to a browser', mark: 'yes', cite: ['nodeterm-team', 'nodeterm-releases'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'iOS 17+ app paired by QR code, with an encrypted relay; 5 free connections a month, unlimited with Pro. No Android yet', mark: 'yes', cite: ['nodeterm-mobile', 'nodeterm-app-store', 'nodeterm-releases'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Self-updating on macOS and as a Linux AppImage; the .deb, .rpm and Windows builds are updated by downloading them again', mark: 'partial', cite: ['nodeterm-installation', 'nodeterm-readme'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Open recent lists Claude, Codex, Gemini, Grok and Copilot conversations already on disk and resumes one; not opencode or Antigravity', mark: 'yes', cite: ['nodeterm-recent', 'nodeterm-releases'] } },
				{ label: 'Fork a conversation', splash: S.fork, other: { text: 'Claude Code nodes can branch: the session runs /branch and a second node carries on from the split; other agents can’t', mark: 'partial', cite: ['nodeterm-branch', 'nodeterm-readme'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'The ⌘K palette searches every terminal’s visible output and finds nodes by title or tag; past transcript search isn’t documented', mark: 'partial', cite: ['nodeterm-palette'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'nodeterm runs each agent’s CLI in a terminal node, usually under tmux, and reads status from hooks it installs; its docs don’t mention the Agent Client Protocol. A ⌘M chat view shows some agents’ sessions as threads. Splash speaks <strong>ACP</strong> with every agent, natively or via an adapter, and renders each session as a transcript.',
			cite: ['nodeterm-agents', 'nodeterm-persistence', 'nodeterm-releases', 'splash-registry', 'acp', 'splash-features']
		},
		{
			title: 'A canvas of terminals',
			text: 'nodeterm places terminals and agents as nodes on a pan-and-zoom canvas, with worktrees bound to group frames. Agents open nodes through <code>canvas-control</code>, read each other’s transcripts over context links, and can delay a launch until a PR’s checks pass. Splash keeps one agent per session, in a folder or worktree, with a <strong>Needs attention</strong> queue and a review screen.',
			cite: ['nodeterm-home', 'nodeterm-worktrees', 'nodeterm-readme', 'nodeterm-context-link', 'nodeterm-releases', 'splash-readme', 'splash-features']
		},
		{
			title: 'Where it runs',
			text: 'nodeterm runs on macOS 12+, Linux x64 and Windows x64 (beta). SSH projects run its terminals on a remote host, and the <strong>Server Edition</strong> serves the canvas to a browser from a Linux server or Docker image. An iOS app pairs by QR code and connects from other networks through an encrypted relay. Splash runs on macOS, Windows and Ubuntu, or as <code>splash-server</code> over an SSH tunnel.',
			cite: ['nodeterm-home', 'nodeterm-installation', 'nodeterm-releases', 'nodeterm-ssh', 'nodeterm-server', 'nodeterm-mobile', 'splash-install', 'splash-server']
		},
		{
			title: 'Across restarts',
			text: 'With tmux, each nodeterm terminal lives in a session that outlives the app. After a reboot, nodeterm restores scrollback and relaunches agents with their saved session IDs, though running processes end. Under <code>splash-server</code>, agents keep running when the browser or SSH tunnel drops; restarting the backend stops them, and saved transcripts remain for continuing the conversation.',
			cite: ['nodeterm-persistence', 'splash-server']
		},
		{
			title: 'Price, license and accounts',
			text: 'nodeterm’s source is under <strong>BUSL-1.1</strong>, which permits production use but not competing hosted or commercial offerings; each release becomes MIT after four years, and the apps carry a separate license in the Terms. The core is free; Pro lifts the relay cap and adds Team Access. Neither product needs an account. Splash is free and MIT-licensed.',
			cite: ['nodeterm-license', 'nodeterm-terms', 'nodeterm-relay', 'nodeterm-privacy', 'splash-license', 'splash-download', 'splash-build']
		}
	],
	fit: {
		splash: [
			'You want every agent driven over the Agent Client Protocol, with messages, tool calls and diffs in one transcript.',
			'You want a free, MIT-licensed app with builds for macOS, Windows and Ubuntu.',
			'You want to review every changed file and send feedback to the agent from one screen.',
			'You want to search saved transcripts and import conversations agents started outside the app.'
		],
		other: [
			'You want terminals and agents laid out on a canvas, in tmux sessions that outlive the app.',
			'You want agents that open nodes, read each other’s transcripts and wait on pull request checks.',
			'You want an iOS companion, SSH projects or a browser Server Edition to follow agents from elsewhere.',
			'You want a kanban board that turns GitHub issues into agent runs, optionally in their own worktrees.'
		]
	},
	sources: [
		{ id: 'nodeterm-home', title: 'nodeterm — run your coding agents on a canvas', url: 'https://nodeterm.dev/', publisher: 'Enes Kirca', checked: '2026-10-10' },
		{ id: 'nodeterm-readme', title: 'README.md', url: 'https://github.com/eneskirca/nodeterm/blob/main/README.md', publisher: 'eneskirca/nodeterm on GitHub', checked: '2026-10-10' },
		{ id: 'nodeterm-persistence', title: 'Terminal persistence', url: 'https://nodeterm.dev/docs/concepts/terminal-persistence/', publisher: 'Enes Kirca', checked: '2026-10-10' },
		{ id: 'nodeterm-server', title: 'Server Edition', url: 'https://nodeterm.dev/docs/remote/server-edition/', publisher: 'Enes Kirca', checked: '2026-10-10' },
		{ id: 'nodeterm-mobile', title: 'Mobile companion', url: 'https://nodeterm.dev/docs/remote/mobile-companion/', publisher: 'Enes Kirca', checked: '2026-10-10' },
		{ id: 'nodeterm-github-releases', title: 'Releases', url: 'https://github.com/eneskirca/nodeterm/releases', publisher: 'eneskirca/nodeterm on GitHub', checked: '2026-10-10' },
		{ id: 'nodeterm-installation', title: 'Installation', url: 'https://nodeterm.dev/docs/get-started/installation/', publisher: 'Enes Kirca', checked: '2026-10-10' },
		{ id: 'nodeterm-license', title: 'LICENSE', url: 'https://github.com/eneskirca/nodeterm/blob/main/LICENSE', publisher: 'eneskirca/nodeterm on GitHub', checked: '2026-10-10' },
		{ id: 'nodeterm-terms', title: 'Terms of Use', url: 'https://nodeterm.dev/terms', publisher: 'Enes Kirca', checked: '2026-10-10' },
		{ id: 'nodeterm-faq', title: 'FAQ', url: 'https://nodeterm.dev/docs/reference/faq/', publisher: 'Enes Kirca', checked: '2026-10-10' },
		{ id: 'nodeterm-license-section', title: 'src/renderer/components/settings/sections/LicenseSection.tsx', url: 'https://github.com/eneskirca/nodeterm/blob/main/src/renderer/components/settings/sections/LicenseSection.tsx', publisher: 'eneskirca/nodeterm on GitHub', checked: '2026-10-10' },
		{ id: 'nodeterm-app-store', title: 'Nodeterm', url: 'https://apps.apple.com/us/app/nodeterm/id6790581233', publisher: 'Apple App Store', checked: '2026-10-10' },
		{ id: 'nodeterm-releases', title: 'Releases', url: 'https://nodeterm.dev/releases/', publisher: 'Enes Kirca', checked: '2026-10-10' },
		{ id: 'nodeterm-agent-config', title: 'src/shared/agents/config.ts', url: 'https://github.com/eneskirca/nodeterm/blob/main/src/shared/agents/config.ts', publisher: 'eneskirca/nodeterm on GitHub', checked: '2026-10-10' },
		{ id: 'nodeterm-agents', title: 'Agents overview', url: 'https://nodeterm.dev/docs/agents/overview/', publisher: 'Enes Kirca', checked: '2026-10-10' },
		{ id: 'nodeterm-status', title: 'Agent status & notifications', url: 'https://nodeterm.dev/docs/agents/status-and-notifications/', publisher: 'Enes Kirca', checked: '2026-10-10' },
		{ id: 'nodeterm-claude-accounts', title: 'Claude accounts', url: 'https://nodeterm.dev/docs/agents/claude-accounts/', publisher: 'Enes Kirca', checked: '2026-10-10' },
		{ id: 'nodeterm-privacy', title: 'Privacy Policy', url: 'https://nodeterm.dev/privacy', publisher: 'Enes Kirca', checked: '2026-10-10' },
		{ id: 'nodeterm-settings', title: 'Settings reference', url: 'https://nodeterm.dev/docs/reference/settings/', publisher: 'Enes Kirca', checked: '2026-10-10' },
		{ id: 'nodeterm-team', title: 'Team access & presence', url: 'https://nodeterm.dev/docs/remote/team-access/', publisher: 'Enes Kirca', checked: '2026-10-10' },
		{ id: 'nodeterm-permission-modes', title: 'Permission modes', url: 'https://nodeterm.dev/docs/agents/permission-modes/', publisher: 'Enes Kirca', checked: '2026-10-10' },
		{ id: 'nodeterm-worktrees', title: 'Git worktrees', url: 'https://nodeterm.dev/docs/code/git-worktrees/', publisher: 'Enes Kirca', checked: '2026-10-10' },
		{ id: 'nodeterm-ssh', title: 'SSH projects', url: 'https://nodeterm.dev/docs/remote/ssh-projects/', publisher: 'Enes Kirca', checked: '2026-10-10' },
		{ id: 'nodeterm-project-settings', title: 'src/renderer/components/settings/ProjectSettingsFamilies.tsx', url: 'https://github.com/eneskirca/nodeterm/blob/main/src/renderer/components/settings/ProjectSettingsFamilies.tsx', publisher: 'eneskirca/nodeterm on GitHub', checked: '2026-10-10' },
		{ id: 'nodeterm-v0-3-2', title: 'Release v0.3.2', url: 'https://github.com/eneskirca/nodeterm/releases/tag/v0.3.2', publisher: 'eneskirca/nodeterm on GitHub', checked: '2026-10-10' },
		{ id: 'nodeterm-context-link', title: 'Context Link', url: 'https://nodeterm.dev/docs/agents/context-link/', publisher: 'Enes Kirca', checked: '2026-10-10' },
		{ id: 'nodeterm-editor-diff', title: 'Editor & diff nodes', url: 'https://nodeterm.dev/docs/code/editor-and-diff-nodes/', publisher: 'Enes Kirca', checked: '2026-10-10' },
		{ id: 'nodeterm-source-control', title: 'Source control', url: 'https://nodeterm.dev/docs/code/source-control/', publisher: 'Enes Kirca', checked: '2026-10-10' },
		{ id: 'nodeterm-github-issues', title: 'src/renderer/state/githubIssues.ts', url: 'https://github.com/eneskirca/nodeterm/blob/main/src/renderer/state/githubIssues.ts', publisher: 'eneskirca/nodeterm on GitHub', checked: '2026-10-10' },
		{ id: 'nodeterm-canvas-control', title: 'src/core/canvas-control-core.ts', url: 'https://github.com/eneskirca/nodeterm/blob/main/src/core/canvas-control-core.ts', publisher: 'eneskirca/nodeterm on GitHub', checked: '2026-10-10' },
		{ id: 'nodeterm-branch', title: 'Branch conversations', url: 'https://nodeterm.dev/docs/agents/branch-conversations/', publisher: 'Enes Kirca', checked: '2026-10-10' },
		{ id: 'nodeterm-recent', title: 'src/shared/recent-conversations.ts', url: 'https://github.com/eneskirca/nodeterm/blob/main/src/shared/recent-conversations.ts', publisher: 'eneskirca/nodeterm on GitHub', checked: '2026-10-10' },
		{ id: 'nodeterm-palette', title: 'Explorer & command palette', url: 'https://nodeterm.dev/docs/code/explorer-and-command-palette/', publisher: 'Enes Kirca', checked: '2026-10-10' },
		{ id: 'nodeterm-relay', title: 'Relay quota & Pro', url: 'https://nodeterm.dev/docs/remote/relay-quota-and-pro/', publisher: 'Enes Kirca', checked: '2026-10-10' }
	]
};
