// Splash vs Solo. Facts checked 2026-10-09 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

const C = '2026-10-09';
const SITE = 'https://soloterm.com';
const DOCS = `${SITE}/docs`;
const MAKER = 'Try Hard Studios, LLC';

export const SOLO: Comparison = {
	slug: 'soloterm',
	name: 'Solo',
	description: 'How Splash and Solo compare on agents, platforms, pricing, worktrees, dev servers and review, with a source for every fact.',
	checked: C,
	intro: 'Splash and Solo are both desktop apps for running several coding agents at once. Solo is a Tauri app that runs each agent’s own CLI in a terminal beside your dev servers, with an MCP server agents use to coordinate. Splash talks to agents over the Agent Client Protocol, each session in its project folder or a git worktree.',
	other: {
		name: 'Solo',
		url: `${SITE}/`,
		maker: 'Try Hard Studios (Aaron Francis)',
		summary: 'A desktop “meta-harness” that runs the agent CLIs you already use in terminals next to your dev commands, with an MCP server that lets agents spawn and coordinate other agents.',
		cite: ['solo-home']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'A Tauri desktop app, a “meta-harness” for the agent CLIs and dev commands you already use; not an editor', cite: ['solo-home', 'solo-vs-zed'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v0.10.1 (September 3, 2026); the download page calls it a beta', cite: ['solo-changelog', 'solo-download'] } },
				{ label: 'License', splash: S.license, other: { text: 'Proprietary and closed source; the Terms forbid reverse engineering', cite: ['solo-terms', 'solo-vs-zed'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free: every feature, 4 projects, 20 processes. Pro: $99 a year. Team seats: $99 down to $69 each a year', cite: ['solo-home'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 11+ (Apple silicon and Intel), Windows 10 1809+ (64-bit); Linux is listed as coming soon', cite: ['solo-install', 'solo-download'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Built in: Claude Code, Codex, Amp, Gemini CLI, OpenCode, Copilot CLI, Kimi CLI, Antigravity; other interactive CLIs as custom tools', cite: ['solo-home', 'solo-setting-up-tools'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Runs each agent’s installed CLI in a PTY terminal, where you type prompts; its docs don’t mention ACP', cite: ['solo-home', 'solo-launching-agents', 'solo-vs-zed'] } },
				{ label: 'Agent sign-in', splash: S.signIn, other: { text: 'Uses each CLI’s existing login, subscription or API key; Solo neither installs the CLIs nor asks for provider keys', cite: ['solo-home', 'solo-setting-up-tools'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'Not for Free. Pro checks its license key with soloterm.com, with 14 days offline by default; team-seat claimants sign in or register', cite: ['solo-home', 'solo-activating-license'] } },
				{ label: 'Model and mode pickers', splash: S.models, other: { text: 'Solo adds none of its own; each CLI keeps its own models and configuration', mark: 'no', cite: ['solo-home', 'solo-agents'] } },
				{ label: 'Permission requests', splash: S.permissions, other: { text: 'Answered in each agent’s own terminal prompt; Solo shows a heuristic waiting-for-permission state', mark: 'yes', cite: ['solo-home', 'solo-idle-detection'] } },
				{ label: 'MCP servers', hint: 'What each app does with MCP', splash: S.mcp, other: { text: 'Is an MCP server: 40+ tools let agents spawn agents, read their output, and share todos and scratchpads', mark: 'yes', cite: ['solo-mcp-server', 'solo-agents', 'solo-home'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Creates none; agents run in their project’s folder, which can be a worktree or clone you linked', mark: 'no', cite: ['solo-vs-conductor', 'solo-agents-spawning', 'solo-home'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'A committable solo.yml defines dev commands, with auto-start, restart on unexpected exit or file change, and env vars', mark: 'yes', cite: ['solo-yml', 'solo-auto-restart'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'Agents, commands and shells all run in the same built-in terminal emulator, with scrollback, mouse support and the Kitty keyboard protocol', mark: 'yes', cite: ['solo-terminal-basics', 'solo-terminal-kitty'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Heuristic agent states, unread markers, badges and notifications; a finished turn is flagged if the agent sends a BEL or OSC notification', mark: 'yes', cite: ['solo-idle-detection', 'solo-notification-indicators', 'solo-home'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'No diff or review UI; its workflow docs suggest a read-only reviewer agent for the exact diff', mark: 'no', cite: ['solo-vs-conductor', 'solo-build-review-land'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Not offered; the workflow docs have an agent commit or push when you ask', mark: 'no', cite: ['solo-vs-conductor', 'solo-build-review-land'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'No native Git UI, and no GitHub integration is documented', mark: 'no', cite: ['solo-vs-zed', 'solo-vs-conductor'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'Linear isn’t offered and no other tracker is documented; Solo has its own todos with dependencies and blockers', mark: 'no', cite: ['solo-vs-conductor', 'solo-home'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'None; agents and commands run as local processes on your computer', mark: 'no', cite: ['solo-home'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'No remote-host or headless sessions; the FAQ suggests SSH or tmux, and the HTTP API listens on 127.0.0.1', mark: 'no', cite: ['solo-home', 'solo-http-api'] } },
				{
					label: 'WSL on Windows',
					splash: { text: 'Run splash-server inside WSL and use it from a browser; WSL counts as a separate Linux host', mark: 'partial', cite: ['splash-how', 'splash-server'] },
					other: { text: 'Per project: the Windows host or a chosen WSL distribution; an agent installed in both shows up as two launch options', mark: 'yes', cite: ['solo-execution-profiles', 'solo-changelog'] }
				},
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Built-in updater that checks automatically; each update is signed and verified before it installs, and every plan gets updates', mark: 'yes', cite: ['solo-install', 'solo-home'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', splash: S.history, other: { text: 'Keeps resume IDs, not copies of conversations; five CLIs’ own pickers can open other conversations. Importing isn’t documented', mark: 'partial', cite: ['solo-stopping-resuming'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'A find bar for one process’s scrollback; output isn’t kept across restarts and cross-session search isn’t documented', mark: 'partial', cite: ['solo-terminal-search', 'solo-persistent-sessions'] } }
			]
		}
	],
	differences: [
		{
			title: 'How each app talks to agents',
			text: 'Splash speaks the <strong>Agent Client Protocol</strong> to each agent over stdio and draws the transcript itself: messages, tool calls, diffs and permission requests. Solo runs each agent’s installed CLI in a PTY terminal and shows that CLI’s own interface, leaving its models, permissions and configuration as they are. Solo’s docs don’t mention ACP.',
			cite: ['splash-readme', 'acp', 'solo-home', 'solo-launching-agents']
		},
		{
			title: 'Agents directing agents',
			text: 'Solo’s MCP server lets one agent spawn another, including one from a different vendor, wait for it and collect its output, with shared todos, scratchpads, timers and locks for coordination. In Splash, each session runs one agent in its project folder or worktree, and the prompts come from you.',
			cite: ['solo-home', 'solo-mcp-server', 'splash-readme', 'splash-features']
		},
		{
			title: 'Dev servers or git worktrees',
			text: 'Solo supervises a project’s dev servers, queues and watchers from a committable <code>solo.yml</code>, and can restart them when they exit unexpectedly or watched files change; it creates no isolated workspaces and shows no diffs. Splash gives each session its folder or a git worktree on its own branch, with diffs, review and a GitHub view, and runs no dev servers.',
			cite: ['solo-home', 'solo-yml', 'solo-auto-restart', 'solo-vs-conductor', 'splash-features', 'splash-worktree']
		},
		{
			title: 'Price and license',
			text: 'Splash is free and MIT-licensed open source. Solo is proprietary. Its Free plan covers 4 projects and 20 processes, agents included; Pro costs $99 a year, removes both limits and checks its license key with soloterm.com. Team seats cost $99 down to $69 each per year.',
			cite: ['splash-license', 'splash-download', 'solo-terms', 'solo-home', 'solo-launching-agents', 'solo-activating-license']
		},
		{
			title: 'Where each one runs',
			text: 'Splash ships for macOS, Windows and Ubuntu, and <code>splash-server</code> can run on another machine that you use from a browser over an SSH tunnel. Solo ships for macOS and Windows, with Linux listed as coming soon. It runs locally, can run a project inside WSL on Windows, and its FAQ suggests SSH or tmux for remote work.',
			cite: ['splash-install', 'splash-server', 'solo-download', 'solo-execution-profiles', 'solo-home']
		}
	],
	fit: {
		splash: [
			'You want each session in its own git worktree, created for you on its own branch.',
			'You want to read every changed file as a diff and send review feedback from the app.',
			'You want to import, browse and search past conversations, including ones started outside Splash.',
			'You want MIT-licensed open source that also runs on Ubuntu, or as a server you open in a browser over SSH.'
		],
		other: [
			'You want agents to spawn and direct other agents, across vendors, through an MCP server.',
			'You want dev servers and watchers supervised and restarted beside your agents, from a committed solo.yml.',
			'You prefer each agent’s own terminal interface, with its models, permissions and settings left as they are.',
			'You work on Windows and want agents inside WSL, or you want the app to install signed updates itself.'
		]
	},
	sources: [
		{ id: 'solo-home', title: 'The meta-harness for coding agents', url: `${SITE}/`, publisher: MAKER, checked: C },
		{ id: 'solo-download', title: 'Download Solo', url: `${SITE}/download`, publisher: MAKER, checked: C },
		{ id: 'solo-changelog', title: 'Changelog', url: `${SITE}/changelog`, publisher: MAKER, checked: C },
		{ id: 'solo-terms', title: 'Terms of Service', url: `${SITE}/terms-of-service`, publisher: MAKER, checked: C },
		{ id: 'solo-vs-zed', title: 'Solo vs Zed', url: `${SITE}/solo-vs-zed`, publisher: MAKER, checked: C },
		{ id: 'solo-vs-conductor', title: 'Solo vs Conductor', url: `${SITE}/solo-vs-conductor`, publisher: MAKER, checked: C },
		{ id: 'solo-agents', title: 'Best Workspace for AI Coding Agents', url: `${SITE}/agents`, publisher: MAKER, checked: C },
		{ id: 'solo-install', title: 'Installation and system requirements', url: `${DOCS}/getting-started/installation`, publisher: MAKER, checked: C },
		{ id: 'solo-setting-up-tools', title: 'Setting up agent tools', url: `${DOCS}/agents/setting-up-tools`, publisher: MAKER, checked: C },
		{ id: 'solo-launching-agents', title: 'Launching agents in a project', url: `${DOCS}/agents/launching-agents`, publisher: MAKER, checked: C },
		{ id: 'solo-activating-license', title: 'Activating a license', url: `${DOCS}/account/activating-license`, publisher: MAKER, checked: C },
		{ id: 'solo-idle-detection', title: 'Agent idle detection', url: `${DOCS}/agents/idle-detection`, publisher: MAKER, checked: C },
		{ id: 'solo-mcp-server', title: 'MCP server integration', url: `${DOCS}/integrations/mcp-server`, publisher: MAKER, checked: C },
		{ id: 'solo-agents-spawning', title: 'Agents spawning agents', url: `${DOCS}/workflows/agents-spawning-agents`, publisher: MAKER, checked: C },
		{ id: 'solo-yml', title: 'solo.yml overview', url: `${DOCS}/projects/solo-yml`, publisher: MAKER, checked: C },
		{ id: 'solo-auto-restart', title: 'Auto-restart', url: `${DOCS}/commands/auto-restart`, publisher: MAKER, checked: C },
		{ id: 'solo-terminal-basics', title: 'Terminal basics', url: `${DOCS}/terminal/basics`, publisher: MAKER, checked: C },
		{ id: 'solo-terminal-kitty', title: 'OSC, links, and Kitty keyboard protocol', url: `${DOCS}/terminal/osc-kitty-protocol`, publisher: MAKER, checked: C },
		{ id: 'solo-notification-indicators', title: 'Notification indicators', url: `${DOCS}/notifications/indicators`, publisher: MAKER, checked: C },
		{ id: 'solo-build-review-land', title: 'Build, review, and land one change', url: `${DOCS}/workflows/build-review-land`, publisher: MAKER, checked: C },
		{ id: 'solo-http-api', title: 'HTTP API', url: `${DOCS}/integrations/http-api`, publisher: MAKER, checked: C },
		{ id: 'solo-execution-profiles', title: 'Execution profiles', url: `${DOCS}/environment/execution-profiles`, publisher: MAKER, checked: C },
		{ id: 'solo-stopping-resuming', title: 'Stopping and resuming agents', url: `${DOCS}/agents/stopping-resuming-agents`, publisher: MAKER, checked: C },
		{ id: 'solo-terminal-search', title: 'Searching terminal output', url: `${DOCS}/terminal/search`, publisher: MAKER, checked: C },
		{ id: 'solo-persistent-sessions', title: 'Terminal session persistence', url: `${DOCS}/terminal/persistent-sessions`, publisher: MAKER, checked: C }
	]
};
