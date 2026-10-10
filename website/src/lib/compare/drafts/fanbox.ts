// Splash vs FanBox. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const FANBOX: Comparison = {
	slug: 'fanbox',
	name: 'FanBox',
	description: 'How Splash and FanBox compare on agents, platforms, isolation, review and remote control, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and FanBox are both open-source desktop apps for running several coding agents at once. FanBox, a Mac app for Apple silicon, runs each agent’s own CLI in an embedded terminal beside a file browser and diff panel; Splash, for macOS, Windows and Ubuntu, drives agents over the Agent Client Protocol and shows their work as a transcript.',
	other: {
		name: 'FanBox',
		url: 'https://github.com/alchaincyf/fanbox',
		maker: 'Huashu',
		summary: 'An MIT-licensed Electron app for Apple silicon Macs that runs Claude Code, Codex and other CLI agents in embedded terminals beside a file browser, with per-round diffs, snapshots and rollback.',
		cite: ['fanbox-readme', 'fanbox-license']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Mac app with agent terminals beside a file browser, previews and diffs; a local browser mode covers browsing, search and preview', cite: ['fanbox-readme', 'fanbox-package'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v2.16.1, released 3 September 2026; 48 GitHub releases since the first in June 2026, none marked beta or pre-release', cite: ['fanbox-release', 'fanbox-releases-api', 'fanbox-changelog'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (MIT)', cite: ['fanbox-license'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free under the MIT license; no paid plan or price is published', cite: ['fanbox-license', 'fanbox-readme'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'Apple silicon Macs (signed, notarized .dmg); Intel builds ended with v2.6.2. Windows through unofficial community ports; no Linux build', cite: ['fanbox-readme', 'fanbox-release', 'fanbox-release-2-6-2', 'fanbox-package'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Electron 33 and node-pty, a Node.js backend with no dependencies, and Monaco, Milkdown and xterm.js in a single-page front end', cite: ['fanbox-readme', 'fanbox-package'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Launchers for 11 agents, including Claude Code, Codex and opencode; config adds more, and any CLI runs in the terminal', cite: ['fanbox-readme', 'fanbox-app-js'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each agent’s own CLI in an embedded terminal; Claude Code and Codex also report their status through their official hooks', cite: ['fanbox-readme', 'fanbox-main-js', 'fanbox-app-js'] } },
				{ label: 'Agent sign-in', splash: S.signIn, other: { text: 'No provider sign-in of its own; the WeChat remote reuses the Mac’s claude and codex logins and shell environment', cite: ['fanbox-driver', 'fanbox-changelog'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'No FanBox account; the optional WeChat remote stores its WeChat iLink login token on the Mac', cite: ['fanbox-readme', 'fanbox-bridge'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Answered in each agent’s own terminal prompt and flagged in the roster; the Claude Code button skips prompts by default', mark: 'yes', cite: ['fanbox-readme', 'fanbox-app-js'] } },
				{ label: 'Agent skills', hint: 'Skills installed for your agents', splash: { text: 'Settings shows the skills, commands and MCP servers of each agent, read-only', mark: 'partial', cite: ['splash-features'] }, other: { text: 'Skills X-ray shows every agent skill on the Mac with trigger counts, health checks and context budget, and toggles them reversibly', mark: 'yes', cite: ['fanbox-readme'] } },
				{ label: 'Usage and limits', hint: 'Plan limits, context and cost', splash: { text: 'Shows context use and cost when the agent reports them', mark: 'yes', cite: ['splash-features'] }, other: { text: 'An Agent usage panel shows Claude Code’s 5-hour and weekly quota, local token counts, and Codex limit snapshots', mark: 'partial', cite: ['fanbox-readme'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Agents work in the project folder itself; automatic snapshots in a shadow git repo outside it allow rollback', mark: 'no', cite: ['fanbox-changelog', 'fanbox-app-js'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'Tabbed terminals with clickable file paths; every session is recorded as asciinema to replay or export as MP4 or GIF', mark: 'yes', cite: ['fanbox-readme', 'fanbox-changelog'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'A roster of sessions awaiting approval or input, or finished; ⌘⌥L jumps to the next. Exact for Claude Code and Codex', mark: 'yes', cite: ['fanbox-readme', 'fanbox-changelog'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'System notifications open the waiting session’s tab, and the Dock badge counts sessions that need you', mark: 'yes', cite: ['fanbox-readme'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Agents in FanBox terminals list, read, message, open, wait on and close sibling terminals through a local HTTP API', mark: 'yes', cite: ['fanbox-changelog', 'fanbox-docs-12'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Cron, one-off or interval tasks run an agent or command in a terminal while FanBox is open; missed runs are skipped', mark: 'yes', cite: ['fanbox-changelog'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'A ‘This round’ panel lists an agent’s changed files with side-by-side diffs; restore a file, roll back the round or send line notes', mark: 'yes', cite: ['fanbox-readme'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'File browser with live previews and a follow mode that tracks the agent’s file; Monaco, Markdown and image editors', mark: 'yes', cite: ['fanbox-readme'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'A release wizard for Node projects commits, pushes and runs gh release create; no PR, issue or CI views are documented', mark: 'partial', cite: ['fanbox-readme', 'fanbox-server-js'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Backend listens on loopback; an optional WeChat ClawBot remote, via Tencent’s iLink service, lets your phone message Claude Code or Codex', mark: 'partial', cite: ['fanbox-readme', 'fanbox-changelog', 'fanbox-ilink'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Since v2.16, downloads updates in the background and installs them on restart; checks every two hours', mark: 'yes', cite: ['fanbox-changelog'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Project memory lists sessions per folder from Claude Code, Codex, Kimi Code and opencode logs, and resumes them in a terminal', mark: 'yes', cite: ['fanbox-readme', 'fanbox-server-js', 'fanbox-app-js'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Not documented; ⌘K searches files by name and content, not sessions', mark: 'unknown', cite: ['fanbox-readme'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'FanBox types each agent’s command into an embedded terminal, so you work in the agent’s own interface; for Claude Code and Codex it adds their official hooks to read exact status. No ACP or agent SDK ships. Splash speaks the <strong>Agent Client Protocol</strong> with every agent and renders messages, tool calls and diffs as a transcript.',
			cite: ['fanbox-readme', 'fanbox-app-js', 'fanbox-package', 'splash-readme', 'acp']
		},
		{
			title: 'Isolation and undo',
			text: 'FanBox runs agents in the project folder itself. Before each round it snapshots the project into a private shadow git repository under <code>~/.fanbox/snapshots</code>, keeping 40 per project, so you can restore one file or roll back a whole round. Splash runs a session in the project folder or in its own git worktree on a separate branch.',
			cite: ['fanbox-changelog', 'fanbox-app-js', 'splash-features']
		},
		{
			title: 'Default handling of permissions',
			text: 'FanBox starts Claude Code with <code>--dangerously-skip-permissions</code> from its launcher button, project-memory resume and WeChat remote, which also bypasses Codex approvals. The Codex button keeps its prompts, and launcher commands are editable in config. Scheduled tasks default to accepting edits but asking before commands. Splash shows each permission request in the transcript and keeps pending ones in <strong>Needs attention</strong>.',
			cite: ['fanbox-app-js', 'fanbox-driver', 'fanbox-changelog', 'splash-features']
		},
		{
			title: 'Platforms',
			text: 'FanBox ships a signed, notarized Mac app for Apple silicon; Intel builds stopped after v2.6.2, and Windows versions are unofficial community ports. A local browser mode has no terminal. Splash builds for macOS on Apple silicon and Intel, Windows 11 and Ubuntu 24.04, and runs as <code>splash-server</code> on a machine you reach through an SSH tunnel.',
			cite: ['fanbox-readme', 'fanbox-release-2-6-2', 'fanbox-release', 'splash-install', 'splash-server']
		},
		{
			title: 'Tools around the agent',
			text: 'FanBox centers on files: cards ripple as an agent writes them, follow mode tracks the file being edited, and it adds a Markdown editor with WeChat typesetting themes, a skills inspector and AI folder cleanup. Splash centers on the conversation: a rendered transcript, a <strong>Needs attention</strong> queue, review, transcript search and a GitHub view of issues, PRs and Actions.',
			cite: ['fanbox-readme', 'splash-features', 'splash-github']
		}
	],
	fit: {
		splash: [
			'You want every agent driven over the Agent Client Protocol, with its messages, tool calls and diffs in one transcript.',
			'You work on Windows, Ubuntu or an Intel Mac, or want to run sessions on your own server over SSH.',
			'You want each session in its own git worktree on a separate branch.',
			'You want to search saved transcripts and browse GitHub issues, pull requests and Actions runs across repositories.'
		],
		other: [
			'You want each agent’s own terminal interface, with launchers for 11 agents and room for any other CLI.',
			'You want automatic snapshots that let you roll back an agent’s round or restore a single file.',
			'You want scheduled agent tasks, agents that drive sibling terminals, and control from WeChat on your phone.',
			'You want a file browser that follows the agent, with Markdown editing, a skills inspector and quota tracking.'
		]
	},
	sources: [
		{ id: 'fanbox-readme', title: 'README', url: 'https://github.com/alchaincyf/fanbox', publisher: 'alchaincyf/fanbox on GitHub', checked: '2026-10-10' },
		{ id: 'fanbox-license', title: 'LICENSE', url: 'https://github.com/alchaincyf/fanbox/blob/master/LICENSE', publisher: 'alchaincyf/fanbox on GitHub', checked: '2026-10-10' },
		{ id: 'fanbox-package', title: 'package.json', url: 'https://github.com/alchaincyf/fanbox/blob/master/package.json', publisher: 'alchaincyf/fanbox on GitHub', checked: '2026-10-10' },
		{ id: 'fanbox-changelog', title: 'CHANGELOG.md', url: 'https://github.com/alchaincyf/fanbox/blob/master/CHANGELOG.md', publisher: 'alchaincyf/fanbox on GitHub', checked: '2026-10-10' },
		{ id: 'fanbox-release', title: 'Release v2.16.1', url: 'https://github.com/alchaincyf/fanbox/releases/tag/v2.16.1', publisher: 'alchaincyf/fanbox on GitHub', checked: '2026-10-10' },
		{ id: 'fanbox-release-2-6-2', title: 'Release v2.6.2', url: 'https://github.com/alchaincyf/fanbox/releases/tag/v2.6.2', publisher: 'alchaincyf/fanbox on GitHub', checked: '2026-10-10' },
		{ id: 'fanbox-releases-api', title: 'Releases (GitHub API)', url: 'https://api.github.com/repos/alchaincyf/fanbox/releases?per_page=100', publisher: 'alchaincyf/fanbox on GitHub', checked: '2026-10-10' },
		{ id: 'fanbox-app-js', title: 'public/app.js', url: 'https://github.com/alchaincyf/fanbox/blob/master/public/app.js', publisher: 'alchaincyf/fanbox on GitHub', checked: '2026-10-10' },
		{ id: 'fanbox-main-js', title: 'electron/main.js', url: 'https://github.com/alchaincyf/fanbox/blob/master/electron/main.js', publisher: 'alchaincyf/fanbox on GitHub', checked: '2026-10-10' },
		{ id: 'fanbox-server-js', title: 'server.js', url: 'https://github.com/alchaincyf/fanbox/blob/master/server.js', publisher: 'alchaincyf/fanbox on GitHub', checked: '2026-10-10' },
		{ id: 'fanbox-driver', title: 'electron/wechat/driver.js', url: 'https://github.com/alchaincyf/fanbox/blob/master/electron/wechat/driver.js', publisher: 'alchaincyf/fanbox on GitHub', checked: '2026-10-10' },
		{ id: 'fanbox-bridge', title: 'electron/wechat/bridge.js', url: 'https://github.com/alchaincyf/fanbox/blob/master/electron/wechat/bridge.js', publisher: 'alchaincyf/fanbox on GitHub', checked: '2026-10-10' },
		{ id: 'fanbox-ilink', title: 'electron/wechat/ilink.js', url: 'https://github.com/alchaincyf/fanbox/blob/master/electron/wechat/ilink.js', publisher: 'alchaincyf/fanbox on GitHub', checked: '2026-10-10' },
		{ id: 'fanbox-docs-12', title: 'docs/12-Agent控制接口-本机HTTP.md', url: 'https://github.com/alchaincyf/fanbox/blob/master/docs/12-Agent%E6%8E%A7%E5%88%B6%E6%8E%A5%E5%8F%A3-%E6%9C%AC%E6%9C%BAHTTP.md', publisher: 'alchaincyf/fanbox on GitHub', checked: '2026-10-10' }
	]
};
