// Splash vs Agent Teams AI. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const AGENT_TEAMS: Comparison = {
	slug: 'agent-teams',
	name: 'Agent Teams AI',
	description: 'How Splash and Agent Teams AI compare on agents, teams, platforms, pricing, worktrees and review, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Agent Teams AI are free desktop apps for running several coding agents at once. In Agent Teams AI, a lead agent turns your goal into kanban tasks for teammate agents that message and review each other. In Splash, each session is one agent, driven over the Agent Client Protocol in its project folder or a git worktree.',
	other: {
		name: 'Agent Teams AI',
		url: 'https://agentteams.live/',
		maker: '777genius',
		summary: 'A free, AGPL-licensed desktop app in which a lead agent splits your goal into tasks on a kanban board, and teammate agents work them in parallel, messaging and reviewing each other while you oversee.',
		cite: ['agent-teams-home', 'agent-teams-docs', 'agent-teams-license']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Electron desktop app where a lead agent turns your goal into board tasks for teammates; a web dashboard is in development', cite: ['agent-teams-home', 'agent-teams-docs', 'agent-teams-readme'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v2.17.10 of 9 October 2026, the 32nd release counting from 1.0.0 in March 2026; the docs’ Release Notes page names v1.2.0 as current', cite: ['agent-teams-v2-17-10', 'agent-teams-home', 'agent-teams-releases', 'agent-teams-changelog', 'agent-teams-release-notes'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (AGPL-3.0) with a commercial-sublicensing CLA; the bundled runtime that starts agents is closed source, shipped as binaries', cite: ['agent-teams-license', 'agent-teams-readme', 'agent-teams-binaries', 'agent-teams-runtime-lock'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free, with no paid tier; one free model works without a login, and other model use is billed by its provider', cite: ['agent-teams-home', 'agent-teams-providers', 'agent-teams-faq'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 13+ (Apple silicon and Intel), Windows x64 and ARM64, Linux x64 (AppImage, .deb, .rpm, .pacman)', cite: ['agent-teams-installation', 'agent-teams-download', 'agent-teams-v2-17-10'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Runtimes for Claude Code, Codex and OpenCode; Cursor, SuperGrok, GitHub Copilot, Kiro, Z.AI, MiniMax and local models connect through OpenCode', cite: ['agent-teams-home', 'agent-teams-providers', 'agent-teams-create-team', 'agent-teams-provider-onboarding', 'agent-teams-v2-8-0', 'agent-teams-v2-12-0', 'agent-teams-v2-15-0'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'A bundled runtime binary launches agents as app-managed processes; Codex runs through its SDK, most other providers through opencode serve', cite: ['agent-teams-cli-flavor', 'agent-teams-readme', 'agent-teams-codex-decision', 'agent-teams-cursor-attribution', 'agent-teams-providers'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Each runtime’s CLI on your PATH, with its login or an API key; guided setup connects Copilot, Cursor and Kimi plans', cite: ['agent-teams-runtime-setup', 'agent-teams-installation', 'agent-teams-v2-8-0'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'No Agent Teams account or signup; providers beyond the free model need their own login or API key', cite: ['agent-teams-home', 'agent-teams-installation'] } },
				{ label: 'Model and mode pickers', splash: S.models, other: { text: 'Provider, model and effort level per teammate, with Fast mode and Limit context options; one team can mix providers', mark: 'yes', cite: ['agent-teams-create-team'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Chosen per launch: auto-approve tools, preselected unless you last switched it off, or confirm each supported action, notified per request', mark: 'yes', cite: ['agent-teams-readme', 'agent-teams-launch-dialog', 'agent-teams-release-notes'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'A built-in agent-teams server for coordination, plus your own from ~/.claude.json, .mcp.json or an in-app registry with diagnostics', mark: 'yes', cite: ['agent-teams-mcp'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Shared project checkout by default; an optional git worktree per teammate, which several docs pages restrict to OpenCode members', mark: 'partial', cite: ['agent-teams-worktrees', 'agent-teams-readme', 'agent-teams-team-strings'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'No setup scripts documented; dev servers that agents start are registered and listed with their URLs, ready to open or stop', mark: 'partial', cite: ['agent-teams-workflow', 'agent-teams-mcp', 'agent-teams-readme'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'A terminal workspace per team and project, with team and local shell tabs, saved history and autocomplete; agents run outside it', mark: 'yes', cite: ['agent-teams-home', 'agent-teams-readme'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'A task card gets a distinct badge while its agent waits for your input; agents can ask questions with answer buttons', mark: 'yes', cite: ['agent-teams-readme', 'agent-teams-release-notes'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'Configurable alerts for finished tasks, agents waiting on you, new comments, errors and monthly token or cost budgets', mark: 'yes', cite: ['agent-teams-readme', 'agent-teams-home'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'A lead splits your goal into tasks for up to 30 teammates, who message and review each other; linked teams can message each other too', mark: 'yes', cite: ['agent-teams-home', 'agent-teams-v2-9-0', 'agent-teams-workflow'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Per-task Changes view: accept or reject files or single hunks, edit, undo, comment inline; the lead reviews by default', mark: 'yes', cite: ['agent-teams-home', 'agent-teams-code-review'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'A project file editor with Git support, which since v2.17.10 also previews PDF, Word, Excel and PowerPoint files', mark: 'yes', cite: ['agent-teams-readme', 'agent-teams-v2-17-10'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'No pull request, CI or GitHub account features documented; you merge worktree output after review, and can add an issue tracker as an MCP server', mark: 'no', cite: ['agent-teams-worktrees', 'agent-teams-mcp'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'Teams run on your own computer; 24/7 cloud teams are a roadmap item marked in progress', mark: 'no', cite: ['agent-teams-readme', 'agent-teams-privacy'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'Views Claude Code sessions on another machine over SSH; remote team launches aren’t documented. A web dashboard without login suits trusted networks', mark: 'partial', cite: ['agent-teams-security', 'agent-teams-settings-strings', 'agent-teams-readme'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Packaged desktop builds check GitHub Releases at launch and while running, then offer to install updates; the Docker or Node dashboard disables the updater', mark: 'yes', cite: ['agent-teams-installation', 'agent-teams-security'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Finds Claude Code projects in ~/.claude and reads their session files; resuming an outside session as a teammate isn’t documented', mark: 'partial', cite: ['agent-teams-readme', 'agent-teams-privacy'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Transcript search, 3× faster since v1.1.0; the command palette searches conversations and across all projects', mark: 'yes', cite: ['agent-teams-release-notes', 'agent-teams-common-strings'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Agent Teams AI launches every agent through its bundled <strong>multimodel runtime</strong>, which a team launch starts with stream-json flags and a generated <code>--mcp-config</code>. Inside it, Codex runs through its SDK, and most other providers go through <code>opencode serve</code>, Cursor via an ACP bridge. Agents coordinate through the app’s MCP tools. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, natively or through an adapter.',
			cite: ['agent-teams-cli-flavor', 'agent-teams-launch-flow', 'agent-teams-codex-decision', 'agent-teams-cursor-attribution', 'agent-teams-cursor-companion', 'agent-teams-provider-onboarding', 'agent-teams-prompt-watchdog', 'agent-teams-mcp', 'splash-registry', 'acp']
		},
		{
			title: 'A team or separate sessions',
			text: 'In Agent Teams AI a lead agent turns your goal into kanban tasks that teammates pick up, move, discuss and send for review, while you comment, approve or message them; linked teams can message each other and be grouped into organizations. In Splash each session is one agent in one folder, and sessions don’t hand work to each other.',
			cite: ['agent-teams-home', 'agent-teams-workflow', 'agent-teams-code-review', 'splash-readme', 'splash-features']
		},
		{
			title: 'License and the agent runtime',
			text: 'Both are free and need no account. Agent Teams AI’s app is AGPL-3.0, with a CLA that lets its owner also license contributions commercially, while the <strong>multimodel runtime</strong> that launches agents is built from a private repository and published as binaries without a license file. Splash’s code is MIT-licensed.',
			cite: ['agent-teams-home', 'agent-teams-license', 'agent-teams-readme', 'agent-teams-binaries', 'agent-teams-runtime-lock', 'splash-license', 'splash-download', 'splash-build']
		},
		{
			title: 'Where agents run',
			text: 'Both run agents on your own computer. Agent Teams AI builds for macOS 13+, Windows x64 and ARM64 and Linux x64, offers a web dashboard, in development and without built-in login, for trusted networks, and lists cloud teams as in progress. Splash builds for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64, or runs as <code>splash-server</code>, opened through an SSH tunnel.',
			cite: ['agent-teams-installation', 'agent-teams-v2-17-10', 'agent-teams-readme', 'splash-install', 'splash-readme', 'splash-server']
		},
		{
			title: 'Tools around the agents',
			text: 'Agent Teams AI has a kanban board with review states, hunk-by-hunk review per task, a project editor, a terminal workspace per team, dev servers that agents register, and token and cost analytics with monthly budgets that can cap supported scheduled runs. Splash has a Needs attention queue, a review screen with a diff per changed file, a terminal per session, import of sessions agents started elsewhere, and a GitHub view.',
			cite: ['agent-teams-home', 'agent-teams-code-review', 'agent-teams-readme', 'agent-teams-workflow', 'splash-features', 'splash-history', 'splash-github']
		}
	],
	fit: {
		splash: [
			'You want every agent driven over the Agent Client Protocol, its messages, tool calls and diffs shown as one transcript per session.',
			'You want each session in its own git worktree, whichever agent runs it.',
			'You want to import conversations your agents started outside the app and search them with the rest.',
			'You want a GitHub view of issues, pull requests and Actions runs, or a server you open in a browser over SSH.'
		],
		other: [
			'You want to give a lead agent a goal and have a team of agents split it into tasks on a shared kanban board.',
			'You want Claude Code, Codex, OpenCode and subscription or local models working side by side in one team.',
			'You want to review each task’s changes hunk by hunk and see the dev servers agents start.',
			'You want monthly token or cost budgets with alerts, plus an app that checks for its own updates.'
		]
	},
	sources: [
		{ id: 'agent-teams-home', title: 'Agent Teams – You’re the boss. Agents are your team.', url: 'https://agentteams.live/', publisher: '777genius', checked: '2026-10-10' },
		{ id: 'agent-teams-download', title: 'Download', url: 'https://agentteams.live/download/', publisher: '777genius', checked: '2026-10-10' },
		{ id: 'agent-teams-docs', title: 'Run AI Agent Teams from a Local Desktop App', url: 'https://docs.agentteams.live/', publisher: '777genius', checked: '2026-10-10' },
		{ id: 'agent-teams-installation', title: 'Installation', url: 'https://docs.agentteams.live/guide/installation', publisher: '777genius', checked: '2026-10-10' },
		{ id: 'agent-teams-runtime-setup', title: 'Runtime Setup', url: 'https://docs.agentteams.live/guide/runtime-setup', publisher: '777genius', checked: '2026-10-10' },
		{ id: 'agent-teams-providers', title: 'Providers and Runtimes', url: 'https://docs.agentteams.live/reference/providers-runtimes', publisher: '777genius', checked: '2026-10-10' },
		{ id: 'agent-teams-mcp', title: 'MCP Integration', url: 'https://docs.agentteams.live/guide/mcp-integration', publisher: '777genius', checked: '2026-10-10' },
		{ id: 'agent-teams-worktrees', title: 'Git and Worktree Strategy', url: 'https://docs.agentteams.live/guide/git-worktree-strategy', publisher: '777genius', checked: '2026-10-10' },
		{ id: 'agent-teams-create-team', title: 'Create a Team', url: 'https://docs.agentteams.live/guide/create-team', publisher: '777genius', checked: '2026-10-10' },
		{ id: 'agent-teams-workflow', title: 'Agent Workflow', url: 'https://docs.agentteams.live/guide/agent-workflow', publisher: '777genius', checked: '2026-10-10' },
		{ id: 'agent-teams-code-review', title: 'Code Review', url: 'https://docs.agentteams.live/guide/code-review', publisher: '777genius', checked: '2026-10-10' },
		{ id: 'agent-teams-faq', title: 'FAQ', url: 'https://docs.agentteams.live/reference/faq', publisher: '777genius', checked: '2026-10-10' },
		{ id: 'agent-teams-privacy', title: 'Privacy and Local Data', url: 'https://docs.agentteams.live/reference/privacy-local-data', publisher: '777genius', checked: '2026-10-10' },
		{ id: 'agent-teams-release-notes', title: 'Release Notes', url: 'https://docs.agentteams.live/reference/release-notes', publisher: '777genius', checked: '2026-10-10' },
		{ id: 'agent-teams-readme', title: 'README.md', url: 'https://github.com/777genius/agent-teams-ai/blob/main/README.md', publisher: '777genius/agent-teams-ai on GitHub', checked: '2026-10-10' },
		{ id: 'agent-teams-license', title: 'LICENSE', url: 'https://github.com/777genius/agent-teams-ai/blob/main/LICENSE', publisher: '777genius/agent-teams-ai on GitHub', checked: '2026-10-10' },
		{ id: 'agent-teams-security', title: 'SECURITY.md', url: 'https://github.com/777genius/agent-teams-ai/blob/main/.github/SECURITY.md', publisher: '777genius/agent-teams-ai on GitHub', checked: '2026-10-10' },
		{ id: 'agent-teams-changelog', title: 'docs/CHANGELOG.md', url: 'https://github.com/777genius/agent-teams-ai/blob/main/docs/CHANGELOG.md', publisher: '777genius/agent-teams-ai on GitHub', checked: '2026-10-10' },
		{ id: 'agent-teams-releases', title: 'Releases', url: 'https://github.com/777genius/agent-teams-ai/releases', publisher: '777genius/agent-teams-ai on GitHub', checked: '2026-10-10' },
		{ id: 'agent-teams-runtime-lock', title: 'runtime.lock.json', url: 'https://github.com/777genius/agent-teams-ai/blob/main/runtime.lock.json', publisher: '777genius/agent-teams-ai on GitHub', checked: '2026-10-10' },
		{ id: 'agent-teams-binaries', title: 'Agent Teams Orchestrator Binaries', url: 'https://github.com/777genius/agent_teams_orchestrator_binaries', publisher: '777genius/agent_teams_orchestrator_binaries on GitHub', checked: '2026-10-10' },
		{ id: 'agent-teams-cli-flavor', title: 'src/main/services/team/cliFlavor.ts', url: 'https://github.com/777genius/agent-teams-ai/blob/main/src/main/services/team/cliFlavor.ts', publisher: '777genius/agent-teams-ai on GitHub', checked: '2026-10-10' },
		{ id: 'agent-teams-launch-flow', title: 'TeamProvisioningLaunchTeamFlow.ts', url: 'https://github.com/777genius/agent-teams-ai/blob/main/src/main/services/team/provisioning/TeamProvisioningLaunchTeamFlow.ts', publisher: '777genius/agent-teams-ai on GitHub', checked: '2026-10-10' },
		{ id: 'agent-teams-launch-dialog', title: 'LaunchTeamDialog.tsx', url: 'https://github.com/777genius/agent-teams-ai/blob/main/src/renderer/components/team/dialogs/LaunchTeamDialog.tsx', publisher: '777genius/agent-teams-ai on GitHub', checked: '2026-10-10' },
		{ id: 'agent-teams-codex-decision', title: 'Codex Native Runtime Integration Decision', url: 'https://github.com/777genius/agent-teams-ai/blob/main/docs/research/codex-native-runtime-integration-decision.md', publisher: '777genius/agent-teams-ai on GitHub', checked: '2026-10-10' },
		{ id: 'agent-teams-cursor-attribution', title: 'CursorAgentAttributionRecords.ts', url: 'https://github.com/777genius/agent-teams-ai/blob/main/src/main/services/team/opencode/bridge/CursorAgentAttributionRecords.ts', publisher: '777genius/agent-teams-ai on GitHub', checked: '2026-10-10' },
		{ id: 'agent-teams-cursor-companion', title: 'CursorAgentCompanionDefinition.ts', url: 'https://github.com/777genius/agent-teams-ai/blob/main/src/features/runtime-provider-management/main/infrastructure/cli-companion/definitions/CursorAgentCompanionDefinition.ts', publisher: '777genius/agent-teams-ai on GitHub', checked: '2026-10-10' },
		{ id: 'agent-teams-provider-onboarding', title: 'runtimeProviderOnboarding.ts', url: 'https://github.com/777genius/agent-teams-ai/blob/main/src/features/runtime-provider-management/core/domain/runtimeProviderOnboarding.ts', publisher: '777genius/agent-teams-ai on GitHub', checked: '2026-10-10' },
		{ id: 'agent-teams-prompt-watchdog', title: 'OpenCodePromptDeliveryWatchdog.ts', url: 'https://github.com/777genius/agent-teams-ai/blob/main/src/main/services/team/opencode/delivery/OpenCodePromptDeliveryWatchdog.ts', publisher: '777genius/agent-teams-ai on GitHub', checked: '2026-10-10' },
		{ id: 'agent-teams-team-strings', title: 'locales/en/team.json', url: 'https://github.com/777genius/agent-teams-ai/blob/main/src/features/localization/renderer/locales/en/team.json', publisher: '777genius/agent-teams-ai on GitHub', checked: '2026-10-10' },
		{ id: 'agent-teams-settings-strings', title: 'locales/en/settings.json', url: 'https://github.com/777genius/agent-teams-ai/blob/main/src/features/localization/renderer/locales/en/settings.json', publisher: '777genius/agent-teams-ai on GitHub', checked: '2026-10-10' },
		{ id: 'agent-teams-common-strings', title: 'locales/en/common.json', url: 'https://github.com/777genius/agent-teams-ai/blob/main/src/features/localization/renderer/locales/en/common.json', publisher: '777genius/agent-teams-ai on GitHub', checked: '2026-10-10' },
		{ id: 'agent-teams-v2-17-10', title: 'Release v2.17.10', url: 'https://github.com/777genius/agent-teams-ai/releases/tag/v2.17.10', publisher: '777genius/agent-teams-ai on GitHub', checked: '2026-10-10' },
		{ id: 'agent-teams-v2-15-0', title: 'Release v2.15.0', url: 'https://github.com/777genius/agent-teams-ai/releases/tag/v2.15.0', publisher: '777genius/agent-teams-ai on GitHub', checked: '2026-10-10' },
		{ id: 'agent-teams-v2-12-0', title: 'Release v2.12.0', url: 'https://github.com/777genius/agent-teams-ai/releases/tag/v2.12.0', publisher: '777genius/agent-teams-ai on GitHub', checked: '2026-10-10' },
		{ id: 'agent-teams-v2-9-0', title: 'Release v2.9.0', url: 'https://github.com/777genius/agent-teams-ai/releases/tag/v2.9.0', publisher: '777genius/agent-teams-ai on GitHub', checked: '2026-10-10' },
		{ id: 'agent-teams-v2-8-0', title: 'Release v2.8.0', url: 'https://github.com/777genius/agent-teams-ai/releases/tag/v2.8.0', publisher: '777genius/agent-teams-ai on GitHub', checked: '2026-10-10' }
	]
};
