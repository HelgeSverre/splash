// Splash vs lpm. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const LPM: Comparison = {
	slug: 'lpm',
	name: 'lpm',
	description: 'How Splash and lpm compare on agents, dev servers, platforms, worktrees, review and remote use, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and lpm are both free, open-source desktop apps for running coding agents side by side. lpm, which began as a dev-server runner, keeps each project’s services and terminals together and runs every agent’s own CLI in a terminal tab. Splash drives agents over the Agent Client Protocol and shows each session as a transcript.',
	other: {
		name: 'lpm',
		url: 'https://lpm.cx',
		maker: 'Gurgen Abagyan',
		summary: 'A free desktop app that keeps a project’s dev servers, terminals and coding agents together, with folder copies or worktrees for parallel work, an lpm CLI and an iPhone and iPad companion.',
		cite: ['lpm-home', 'lpm-features', 'lpm-agents-md', 'lpm-mobile']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app for dev servers, terminals and coding agents, plus a CLI, an iPhone and iPad app and a headless Linux host', cite: ['lpm-home', 'lpm-agents-md', 'lpm-features'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v0.7.2 (10 October 2026), after more than 400 releases since March 2026; the Windows and Linux builds are beta', cite: ['lpm-release', 'lpm-stats', 'lpm-first-readme', 'lpm-home'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (MIT)', cite: ['lpm-license', 'lpm-home'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free, with no paid tier; the iPhone and iPad app is free too', cite: ['lpm-home', 'lpm-features', 'lpm-app-store'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 12+ (Apple silicon and Intel); beta builds for Windows 11 x64 and x86-64 Linux; iOS and iPadOS 17+ for the companion', cite: ['lpm-home', 'lpm-features', 'lpm-mobile'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Tauri 2: a React and TypeScript interface in the system webview over a Rust backend, without Electron', cite: ['lpm-agents-md', 'lpm-review', 'lpm-home'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code and Codex with the deepest integration, Gemini CLI and OpenCode as one-click buttons, any other CLI agent in a terminal', cite: ['lpm-home', 'lpm-features'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each agent’s own CLI in a PTY terminal tab; Claude Code and Codex report status through hooks lpm adds to their config', cite: ['lpm-config', 'lpm-pty', 'lpm-hooks', 'lpm-features'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Your own installed, signed-in agent CLIs; add several Claude Code accounts and pin one per project. lpm hosts no model', cite: ['lpm-home', 'lpm-features', 'lpm-privacy'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Answered at the agent’s own terminal prompt, on the desktop or iPhone; lpm marks Claude Code and Codex tabs amber meanwhile', mark: 'partial', cite: ['lpm-connect-agents', 'lpm-home', 'lpm-mobile'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'No MCP server of its own; Skills & tools lists the MCP servers Claude Code and Codex load in a folder', mark: 'partial', cite: ['lpm-connect-agents', 'lpm-features'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Up to 50 folder copies, each its own Git repo, or worktrees on new branches; agents in one copy share it', mark: 'yes', cite: ['lpm-features', 'lpm-parallel', 'lpm-home'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'YAML services, profiles and action buttons, detected for many stacks; new copies can install dependencies or run a command or prompt', mark: 'yes', cite: ['lpm-config', 'lpm-features', 'lpm-worktrees'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'Tabs per project in your login shell, with split panes, search and detachable windows; a prompt composer works with any CLI', mark: 'yes', cite: ['lpm-features', 'lpm-home'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Claude Code and Codex tabs show Working, Needs you, Done or Problem, with alerts; an Activity view puts waiting ones first', mark: 'partial', cite: ['lpm-features'] } },
				{ label: 'Agents handing off work', hint: 'One agent picking up another’s work', splash: S.handoff, other: { text: 'Agents save named work sessions to shared project memory that another agent can pick up by name; needs lpm’s agent skills', mark: 'yes', cite: ['lpm-features', 'lpm-connect-agents'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Scheduled agent prompts, commands or actions while lpm is open, optionally in a fresh copy; agents get full access by default', mark: 'yes', cite: ['lpm-features', 'lpm-jobs'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Every uncommitted change in one diff stack you can edit; commits take whole files, with no hunk staging or review comments', mark: 'yes', cite: ['lpm-features', 'lpm-review'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Auto Create PR branches, commits, pushes and opens a PR with AI-written text through gh; merging a PR isn’t documented', mark: 'yes', cite: ['lpm-features', 'lpm-pull-request'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'PR number and state in the footer, through gh; CI checks, issues and other code hosts aren’t documented', mark: 'partial', cite: ['lpm-features', 'lpm-pull-request'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'SSH projects on any server, or a Linux host lpm installs itself on, where agents keep running after your laptop closes', mark: 'yes', cite: ['lpm-home', 'lpm-features'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'lpm Link for iPhone and iPad (iOS 17+) mirrors terminals, flags agents waiting on you and gets encrypted push alerts', mark: 'yes', cite: ['lpm-home', 'lpm-mobile', 'lpm-app-store'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'A light web tab beside the terminals on macOS and Windows; on Linux, links open in your default browser', mark: 'partial', cite: ['lpm-features', 'lpm-home'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Updates itself in one click on macOS; on Windows and Linux it opens the new download in your browser', mark: 'partial', cite: ['lpm-home'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Lists a project’s Claude Code and Codex conversations, even those begun outside lpm, and reopens one in a tab', mark: 'partial', cite: ['lpm-features', 'lpm-agent-sessions'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Searches a project’s Claude Code and Codex conversations; terminal tabs have their own search', mark: 'partial', cite: ['lpm-features', 'lpm-home'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'lpm opens each agent’s own CLI in a PTY terminal tab; its docs mention no ACP or agent SDK. Claude Code and Codex report status through hooks lpm adds to their config, and other agents can post status with <code>lpm set-status</code>. Splash connects to every agent over the <strong>Agent Client Protocol</strong> and shows each session as a transcript.',
			cite: ['lpm-config', 'lpm-pty', 'lpm-hooks', 'lpm-features', 'lpm-connect-agents', 'splash-registry', 'acp', 'splash-readme']
		},
		{
			title: 'Dev servers around the agents',
			text: 'lpm began as a dev-server runner: YAML services and action buttons, port checks that name whoever holds a port, and up to 50 folder copies or worktrees that keep those services. It does not isolate ports or containers. Splash is built around agent sessions in a project folder or worktree and runs no setup scripts or dev servers.',
			cite: ['lpm-first-readme', 'lpm-config', 'lpm-features', 'lpm-worktrees', 'splash-features', 'splash-worktree']
		},
		{
			title: 'Where agents run',
			text: 'lpm runs agents on your computer, on an SSH server, or on a Linux host it sets up, where they keep running after your laptop closes; <strong>lpm Link</strong> for iPhone and iPad pairs with a computer or host running lpm. Splash runs agents locally or under <code>splash-server</code>, opened in a browser through an SSH tunnel, and has no phone app.',
			cite: ['lpm-home', 'lpm-features', 'lpm-mobile', 'splash-server', 'splash-install']
		},
		{
			title: 'Permissions and automation',
			text: 'lpm leaves permission prompts to each agent’s terminal and marks a Claude Code or Codex tab amber while one waits. Scheduled automations run with full access by default, and OpenCode jobs always do. Splash shows the permission requests an agent sends in its transcript, answered with the 1–9 keys, keeps pending ones in <strong>Needs attention</strong>, and has no scheduler.',
			cite: ['lpm-connect-agents', 'lpm-features', 'lpm-jobs', 'splash-features', 'splash-how']
		},
		{
			title: 'Licensing, platforms and updates',
			text: 'Both are free, MIT-licensed and need no account. lpm’s macOS build is signed and notarized and updates itself; its Windows 11 and x86-64 Linux builds are beta, unsigned, and update by opening the new download. Splash builds for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64, and new versions come from GitHub Releases.',
			cite: ['lpm-license', 'lpm-home', 'lpm-features', 'lpm-privacy', 'splash-license', 'splash-download', 'splash-build', 'splash-install', 'splash-about']
		}
	],
	fit: {
		splash: [
			'You want each agent’s session driven over the Agent Client Protocol and shown as a transcript.',
			'You want to answer permission requests in the transcript and keep pending ones in a Needs attention queue.',
			'You want to import and search conversations from any agent that lists them over ACP, archived sessions included.',
			'You want a GitHub view of issues, pull requests and Actions runs across repositories.'
		],
		other: [
			'You want each project’s dev servers and action buttons beside your agents.',
			'You want many folder copies or worktrees of a project, each started with its own agent prompt.',
			'You want an iPhone or iPad companion and a Linux host that keeps agents running after your laptop closes.',
			'You want scheduled agent jobs, pull requests opened from the app and a macOS build that updates itself.'
		]
	},
	sources: [
		{ id: 'lpm-home', title: 'Free Desktop App to Run Claude Code, Codex & Dev Projects', url: 'https://lpm.cx/', publisher: 'Gurgen Abagyan', checked: '2026-10-10' },
		{ id: 'lpm-features', title: 'Features: Dev Servers, Claude Code & Codex on Your Desktop', url: 'https://lpm.cx/features', publisher: 'Gurgen Abagyan', checked: '2026-10-10' },
		{ id: 'lpm-config', title: 'lpm Config Reference', url: 'https://lpm.cx/config', publisher: 'Gurgen Abagyan', checked: '2026-10-10' },
		{ id: 'lpm-connect-agents', title: 'Let Claude Code and Codex Run Your Dev Environment', url: 'https://lpm.cx/connect-ai-agents', publisher: 'Gurgen Abagyan', checked: '2026-10-10' },
		{ id: 'lpm-mobile', title: 'Control Claude Code on Your Mac From Your iPhone', url: 'https://lpm.cx/mobile', publisher: 'Gurgen Abagyan', checked: '2026-10-10' },
		{ id: 'lpm-review', title: 'Review Code Changes in Terminal Before You Commit', url: 'https://lpm.cx/review-changes-in-terminal', publisher: 'Gurgen Abagyan', checked: '2026-10-10' },
		{ id: 'lpm-parallel', title: 'Run Claude Code in Parallel', url: 'https://lpm.cx/run-claude-code-in-parallel', publisher: 'Gurgen Abagyan', checked: '2026-10-10' },
		{ id: 'lpm-worktrees', title: 'Git Worktrees for Claude Code, Codex & AI Agents', url: 'https://lpm.cx/git-worktree-for-ai-agents', publisher: 'Gurgen Abagyan', checked: '2026-10-10' },
		{ id: 'lpm-privacy', title: 'Privacy Policy', url: 'https://lpm.cx/privacy', publisher: 'Gurgen Abagyan', checked: '2026-10-10' },
		{ id: 'lpm-stats', title: 'Download Stats by Release', url: 'https://lpm.cx/stats', publisher: 'Gurgen Abagyan', checked: '2026-10-10' },
		{ id: 'lpm-app-store', title: 'lpm Link', url: 'https://apps.apple.com/us/app/lpm-link/id6788396977', publisher: 'Apple App Store', checked: '2026-10-10' },
		{ id: 'lpm-license', title: 'LICENSE', url: 'https://github.com/gug007/lpm/blob/main/LICENSE', publisher: 'gug007/lpm on GitHub', checked: '2026-10-10' },
		{ id: 'lpm-agents-md', title: 'AGENTS.md', url: 'https://github.com/gug007/lpm/blob/main/AGENTS.md', publisher: 'gug007/lpm on GitHub', checked: '2026-10-10' },
		{ id: 'lpm-first-readme', title: 'README.md at the first commit (29 March 2026)', url: 'https://github.com/gug007/lpm/blob/c75d5549d293d61551790ab02525aec9cc36c050/README.md', publisher: 'gug007/lpm on GitHub', checked: '2026-10-10' },
		{ id: 'lpm-release', title: 'Release v0.7.2', url: 'https://github.com/gug007/lpm/releases/tag/v0.7.2', publisher: 'gug007/lpm on GitHub', checked: '2026-10-10' },
		{ id: 'lpm-pty', title: 'desktop/frontend/src-tauri/src/pty.rs', url: 'https://github.com/gug007/lpm/blob/main/desktop/frontend/src-tauri/src/pty.rs', publisher: 'gug007/lpm on GitHub', checked: '2026-10-10' },
		{ id: 'lpm-hooks', title: 'desktop/frontend/src-tauri/src/hooks.rs', url: 'https://github.com/gug007/lpm/blob/main/desktop/frontend/src-tauri/src/hooks.rs', publisher: 'gug007/lpm on GitHub', checked: '2026-10-10' },
		{ id: 'lpm-jobs', title: 'desktop/frontend/src-tauri/src/jobs.rs', url: 'https://github.com/gug007/lpm/blob/main/desktop/frontend/src-tauri/src/jobs.rs', publisher: 'gug007/lpm on GitHub', checked: '2026-10-10' },
		{ id: 'lpm-pull-request', title: 'desktop/frontend/src-tauri/src/pull_request.rs', url: 'https://github.com/gug007/lpm/blob/main/desktop/frontend/src-tauri/src/pull_request.rs', publisher: 'gug007/lpm on GitHub', checked: '2026-10-10' },
		{ id: 'lpm-agent-sessions', title: 'desktop/frontend/src-tauri/src/agent_sessions.rs', url: 'https://github.com/gug007/lpm/blob/main/desktop/frontend/src-tauri/src/agent_sessions.rs', publisher: 'gug007/lpm on GitHub', checked: '2026-10-10' }
	]
};
