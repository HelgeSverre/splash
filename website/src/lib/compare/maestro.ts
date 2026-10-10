// Splash vs Maestro. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const MAESTRO: Comparison = {
	slug: 'maestro',
	name: 'Maestro',
	description: 'How Splash and Maestro compare on agents, automation, platforms, licensing, worktrees, review and remote access, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Maestro are both open-source desktop apps for running several coding agents at once, optionally in git worktrees. Maestro, an Electron app, runs each vendor’s CLI in batch mode and adds unattended runs, event triggers and a browser UI; Splash, a Rust app, drives agents over the Agent Client Protocol and shows each session as a transcript.',
	other: {
		name: 'Maestro',
		url: 'https://runmaestro.ai/',
		maker: 'Pedram Amini',
		summary: 'An open-source Electron app for orchestrating many coding agents: it runs eleven agent CLIs in batch mode and adds Auto Run checklists, event triggers, Group Chat, SSH agents and a browser UI.',
		cite: ['maestro-home', 'maestro-package', 'maestro-license', 'maestro-releases', 'maestro-definitions', 'maestro-overview', 'maestro-autorun', 'maestro-cue', 'maestro-group-chat', 'maestro-ssh', 'maestro-remote-control']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Electron desktop app that can also serve its full interface to browsers on your network, plus a command-line tool, maestro-cli', cite: ['maestro-readme', 'maestro-package', 'maestro-remote-control', 'maestro-cli'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v1.0.0 (9 October 2026), its first major release; work began in November 2025. The docs list six agents as beta', cite: ['maestro-release', 'maestro-releases', 'maestro-home', 'maestro-getting-started'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (AGPL-3.0)', cite: ['maestro-license', 'maestro-readme'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free; no paid plan is listed and there is no license check. Agent providers bill model use directly', cite: ['maestro-battle-cards', 'maestro-privacy', 'maestro-readme'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Intel and Apple silicon), Windows x64 (installer or portable), Linux x86_64 and arm64 (AppImage, .deb, .rpm)', cite: ['maestro-installation', 'maestro-release'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Eleven CLIs, including Claude Code, Codex, OpenCode, Copilot CLI, Antigravity CLI and Grok CLI; adding another takes a source change', cite: ['maestro-releases', 'maestro-definitions', 'maestro-provider-support', 'maestro-battle-cards'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each vendor’s CLI in batch mode, reading its structured output; opt-in modes drive Claude Code’s TUI or a shared OpenCode server', cite: ['maestro-overview', 'maestro-architecture', 'maestro-definitions', 'maestro-provider-notes', 'maestro-encore'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Your CLIs’ own logins; Claude Code bills API credit or a Max plan, and Claude Code, Codex and OpenCode agents can each use a different account', cite: ['maestro-readme', 'maestro-privacy', 'maestro-provider-notes', 'maestro-multi-provider'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'None; the optional leaderboard asks for an email, and turning on Web Login adds local accounts for browser access', cite: ['maestro-privacy', 'maestro-remote-control'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Claude Code’s Standard mode brings approvals and questions into Maestro, except over SSH; Codex and OpenCode runs approve automatically', mark: 'partial', cite: ['maestro-releases', 'maestro-provider-notes', 'maestro-definitions'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Agents keep the MCP servers set up in their own CLIs, and the docs describe no MCP manager; Coworking and maestro-cli mcp serve offer Maestro’s own tools over MCP', mark: 'partial', cite: ['maestro-readme', 'maestro-coworking', 'maestro-cli-reference'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'The project folder by default; a worktree sub-agent gets its own directory and branch. No per-agent containers', mark: 'yes', cite: ['maestro-git-worktrees', 'maestro-overview', 'maestro-battle-cards'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'A Setup Script prepares each new worktree, for example copying .env files; a terminal tab’s startup command can start a dev server. Port allocation isn’t documented', mark: 'yes', cite: ['maestro-git-worktrees', 'maestro-general-usage', 'maestro-cli'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Status dots, unread badges and OS notifications; opt-in Pianola answers waiting prompts using your rules and passes others to you', mark: 'yes', cite: ['maestro-general-usage', 'maestro-configuration', 'maestro-pianola'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'In Group Chat a moderator agent routes questions across agents; @mentions consult another agent once; agents can drive Maestro through maestro-cli', mark: 'yes', cite: ['maestro-group-chat', 'maestro-overview', 'maestro-home'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Maestro Cue sends prompts on timers, file changes, finished agents, new GitHub PRs, issues or labels, and webhooks, set in each project’s cue.yaml', mark: 'yes', cite: ['maestro-cue', 'maestro-cue-events'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'Browser tabs next to each agent’s chat and terminal; opt-in Coworking allows Claude Code, Codex, OpenCode and Factory Droid agents to inspect them', mark: 'yes', cite: ['maestro-home', 'maestro-general-usage', 'maestro-coworking'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'A real shell per agent in its working directory, with several tabs that can each run a startup command; also on SSH hosts', mark: 'yes', cite: ['maestro-general-usage', 'maestro-ssh'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'A side-by-side diff viewer, a git log graph and a changed-files list; no line comments back to the agent', mark: 'yes', cite: ['maestro-git-worktrees', 'maestro-general-usage', 'maestro-releases', 'maestro-battle-cards'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'File explorer and editable preview tabs, also over SSH; Maestro’s own comparison page says editing is restricted to markdown', mark: 'partial', cite: ['maestro-general-usage', 'maestro-ssh', 'maestro-battle-cards'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Opens a PR from any agent’s branch via gh, with a generated title and description; maestro-cli Auto Runs can too', mark: 'yes', cite: ['maestro-git-worktrees'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Through gh: PR creation, Cue triggers on new PRs, issues and labels, and Gists. Merging PRs and CI status aren’t documented', mark: 'yes', cite: ['maestro-git-worktrees', 'maestro-cue-events', 'maestro-general-usage'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'GitHub issues and labels can trigger agents through Cue, and GitLab through a generic webhook; no Linear or Jira', mark: 'partial', cite: ['maestro-cue-events', 'maestro-battle-cards'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'None; agents run on your computer or on your own SSH hosts', mark: 'no', cite: ['maestro-battle-cards', 'maestro-ssh'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'Agents on SSH hosts; Live serves the full UI to browsers and phones on your network or, via a Cloudflare tunnel, anywhere', mark: 'yes', cite: ['maestro-ssh', 'maestro-remote-control'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'No native app; phones open the full web interface in a one-handed layout, on your network or through a tunnel', mark: 'partial', cite: ['maestro-battle-cards', 'maestro-remote-control'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Checks for a new version at startup and can download and install it from inside the app; beta and release-candidate builds are opt-in', mark: 'yes', cite: ['maestro-configuration', 'maestro-auto-updater'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Session Discovery imports supported agents’ existing sessions, even ones that predate Maestro, so you can search, star and resume them', mark: 'yes', cite: ['maestro-readme', 'maestro-home'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Search one agent’s open tabs, not the whole fleet; Director’s Notes lists every agent’s history entries in one timeline, searchable by summary', mark: 'partial', cite: ['maestro-general-usage', 'maestro-director-notes'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Maestro starts each vendor’s CLI in non-interactive batch mode, such as <code>claude --print</code> or <code>codex exec</code>, and parses its output, so Claude Code messages sent mid-turn wait for the turn to end. Opt-in modes drive Claude Code’s TUI or a shared OpenCode server. Its planning notes list ACP client support as a later step. Splash talks to every agent over the <strong>Agent Client Protocol</strong>.',
			cite: ['maestro-overview', 'maestro-definitions', 'maestro-provider-notes', 'maestro-encore', 'maestro-acp-plan', 'splash-registry', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'Maestro runs agents locally or on SSH hosts, with the local app in control. Turning on <strong>Live</strong> serves its full UI to browsers on your network, or anywhere through a Cloudflare tunnel, guarded by a URL token and optional Web Login. Splash runs agents locally or under <code>splash-server</code>, which you open in a browser over an SSH tunnel.',
			cite: ['maestro-ssh', 'maestro-remote-control', 'splash-readme', 'splash-server']
		},
		{
			title: 'Unattended work',
			text: 'Maestro leans toward unattended work: <strong>Auto Run</strong> works through markdown checklists or toward a free-text goal, starting a fresh agent session for each step, Cue prompts agents when events fire, and Agent Resilience resends prompts after provider errors or quota limits. Splash centers on each conversation: permission requests answered in the transcript, a Needs attention queue, a review screen and transcript search.',
			cite: ['maestro-autorun', 'maestro-cue', 'maestro-resilience', 'splash-features']
		},
		{
			title: 'Price, license and privacy',
			text: 'Maestro is free under the AGPL-3.0 and needs no account or license check. It makes four optional network calls (an install count, Cue counters, the leaderboard and crash reports), all of which Settings can turn off. Splash is free, MIT-licensed and has no accounts. Both run agents with the CLI logins you already have.',
			cite: ['maestro-license', 'maestro-battle-cards', 'maestro-privacy', 'maestro-readme', 'splash-license', 'splash-download', 'splash-build', 'splash-agents']
		},
		{
			title: 'Stack and platforms',
			text: 'Maestro is an Electron app written in TypeScript with React, with builds for macOS (Intel and Apple silicon), Windows x64 and Linux x86_64 and arm64, plus <code>maestro-cli</code> on Node.js. Splash is written in Rust with a Svelte 5 frontend in a webview, and builds for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64.',
			cite: ['maestro-package', 'maestro-installation', 'maestro-release', 'maestro-cli', 'splash-how', 'splash-install']
		}
	],
	fit: {
		splash: [
			'You want every agent driven over the Agent Client Protocol, with Gemini, Goose and others in one transcript view.',
			'You want permission requests answered in the transcript and gathered in one Needs attention queue.',
			'You want a GitHub view of issues, pull requests and Actions runs across your repositories.',
			'You want to search saved transcript text across all your sessions, archived ones included.'
		],
		other: [
			'You want agents to work unattended through checklists, goals and event triggers, with prompts resent after provider errors.',
			'You want worktree setup scripts, a built-in browser and pull requests opened from the app.',
			'You want agents on SSH hosts and the full interface in a browser or phone, on your network or through a tunnel.',
			'You want agents to consult each other through Group Chat and @mentions, or to script the app with maestro-cli.'
		]
	},
	sources: [
		{ id: 'maestro-home', title: 'Delightful Desktop Orchestration Experience', url: 'https://runmaestro.ai/', publisher: 'Pedram Amini', checked: '2026-10-10' },
		{ id: 'maestro-battle-cards', title: 'Competitive Analysis', url: 'https://runmaestro.ai/battle-cards', publisher: 'Pedram Amini', checked: '2026-10-10' },
		{ id: 'maestro-privacy', title: 'Privacy', url: 'https://runmaestro.ai/privacy', publisher: 'Pedram Amini', checked: '2026-10-10' },
		{ id: 'maestro-readme', title: 'Maestro README', url: 'https://github.com/RunMaestro/Maestro', publisher: 'RunMaestro/Maestro on GitHub', checked: '2026-10-10' },
		{ id: 'maestro-package', title: 'package.json', url: 'https://github.com/RunMaestro/Maestro/blob/main/package.json', publisher: 'RunMaestro/Maestro on GitHub', checked: '2026-10-10' },
		{ id: 'maestro-license', title: 'LICENSE', url: 'https://github.com/RunMaestro/Maestro/blob/main/LICENSE', publisher: 'RunMaestro/Maestro on GitHub', checked: '2026-10-10' },
		{ id: 'maestro-release', title: 'v1.0.0 | Full Orchestra', url: 'https://github.com/RunMaestro/Maestro/releases/tag/v1.0.0', publisher: 'RunMaestro/Maestro on GitHub', checked: '2026-10-10' },
		{ id: 'maestro-definitions', title: 'src/main/agents/definitions.ts', url: 'https://github.com/RunMaestro/Maestro/blob/main/src/main/agents/definitions.ts', publisher: 'RunMaestro/Maestro on GitHub', checked: '2026-10-10' },
		{ id: 'maestro-provider-support', title: 'PROVIDER-SUPPORT.md', url: 'https://github.com/RunMaestro/Maestro/blob/main/PROVIDER-SUPPORT.md', publisher: 'RunMaestro/Maestro on GitHub', checked: '2026-10-10' },
		{ id: 'maestro-architecture', title: 'ARCHITECTURE.md', url: 'https://github.com/RunMaestro/Maestro/blob/main/ARCHITECTURE.md', publisher: 'RunMaestro/Maestro on GitHub', checked: '2026-10-10' },
		{ id: 'maestro-auto-updater', title: 'src/main/auto-updater.ts', url: 'https://github.com/RunMaestro/Maestro/blob/main/src/main/auto-updater.ts', publisher: 'RunMaestro/Maestro on GitHub', checked: '2026-10-10' },
		{ id: 'maestro-acp-plan', title: 'Plans/autonomous-manager-agent-investigation.md', url: 'https://github.com/RunMaestro/Maestro/blob/main/Plans/autonomous-manager-agent-investigation.md', publisher: 'RunMaestro/Maestro on GitHub', checked: '2026-10-10' },
		{ id: 'maestro-releases', title: 'Release Notes', url: 'https://docs.runmaestro.ai/releases', publisher: 'Pedram Amini', checked: '2026-10-10' },
		{ id: 'maestro-getting-started', title: 'Getting Started', url: 'https://docs.runmaestro.ai/getting-started', publisher: 'Pedram Amini', checked: '2026-10-10' },
		{ id: 'maestro-installation', title: 'Installation', url: 'https://docs.runmaestro.ai/installation', publisher: 'Pedram Amini', checked: '2026-10-10' },
		{ id: 'maestro-overview', title: 'Overview', url: 'https://docs.runmaestro.ai/about/overview', publisher: 'Pedram Amini', checked: '2026-10-10' },
		{ id: 'maestro-provider-notes', title: 'Provider Notes', url: 'https://docs.runmaestro.ai/provider-notes', publisher: 'Pedram Amini', checked: '2026-10-10' },
		{ id: 'maestro-multi-provider', title: 'Multiple Accounts', url: 'https://docs.runmaestro.ai/multi-provider', publisher: 'Pedram Amini', checked: '2026-10-10' },
		{ id: 'maestro-configuration', title: 'Configuration', url: 'https://docs.runmaestro.ai/configuration', publisher: 'Pedram Amini', checked: '2026-10-10' },
		{ id: 'maestro-general-usage', title: 'General Usage', url: 'https://docs.runmaestro.ai/general-usage', publisher: 'Pedram Amini', checked: '2026-10-10' },
		{ id: 'maestro-git-worktrees', title: 'Git and Worktrees', url: 'https://docs.runmaestro.ai/git-worktrees', publisher: 'Pedram Amini', checked: '2026-10-10' },
		{ id: 'maestro-encore', title: 'Encore Features & Plugins', url: 'https://docs.runmaestro.ai/encore-features', publisher: 'Pedram Amini', checked: '2026-10-10' },
		{ id: 'maestro-coworking', title: 'Coworking', url: 'https://docs.runmaestro.ai/coworking', publisher: 'Pedram Amini', checked: '2026-10-10' },
		{ id: 'maestro-pianola', title: 'Pianola', url: 'https://docs.runmaestro.ai/pianola', publisher: 'Pedram Amini', checked: '2026-10-10' },
		{ id: 'maestro-group-chat', title: 'Group Chat', url: 'https://docs.runmaestro.ai/group-chat', publisher: 'Pedram Amini', checked: '2026-10-10' },
		{ id: 'maestro-autorun', title: 'Auto Run + Playbooks', url: 'https://docs.runmaestro.ai/autorun-playbooks', publisher: 'Pedram Amini', checked: '2026-10-10' },
		{ id: 'maestro-cue', title: 'Cue Overview', url: 'https://docs.runmaestro.ai/maestro-cue', publisher: 'Pedram Amini', checked: '2026-10-10' },
		{ id: 'maestro-cue-events', title: 'Cue Event Types', url: 'https://docs.runmaestro.ai/maestro-cue-events', publisher: 'Pedram Amini', checked: '2026-10-10' },
		{ id: 'maestro-resilience', title: 'Agent Resilience', url: 'https://docs.runmaestro.ai/agent-resilience', publisher: 'Pedram Amini', checked: '2026-10-10' },
		{ id: 'maestro-ssh', title: 'SSH Remote Execution', url: 'https://docs.runmaestro.ai/ssh-remote-execution', publisher: 'Pedram Amini', checked: '2026-10-10' },
		{ id: 'maestro-remote-control', title: 'Remote Control', url: 'https://docs.runmaestro.ai/remote-control', publisher: 'Pedram Amini', checked: '2026-10-10' },
		{ id: 'maestro-cli', title: 'CLI', url: 'https://docs.runmaestro.ai/cli', publisher: 'Pedram Amini', checked: '2026-10-10' },
		{ id: 'maestro-cli-reference', title: 'CLI Reference', url: 'https://docs.runmaestro.ai/cli-reference', publisher: 'Pedram Amini', checked: '2026-10-10' },
		{ id: 'maestro-director-notes', title: 'Director’s Notes', url: 'https://docs.runmaestro.ai/director-notes', publisher: 'Pedram Amini', checked: '2026-10-10' }
	]
};
