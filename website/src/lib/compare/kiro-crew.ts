// Splash vs Kiro Crew. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const KIRO_CREW: Comparison = {
	slug: 'kiro-crew',
	name: 'Kiro Crew',
	description: 'How Splash and Kiro Crew compare on agents, platforms, pricing, isolation, scheduling and remote use, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Kiro Crew are both open-source apps that drive coding agents over the Agent Client Protocol. Kiro Crew is a persistent workspace: a Gateway on your own hardware that keeps memory, runs scheduled work and uses Kiro CLI on a Kiro plan by default. Splash is a desktop app that runs many vendors’ agents side by side.',
	other: {
		name: 'Kiro Crew',
		url: 'https://kiro.dev/crew/',
		maker: 'AWS',
		summary: 'An open-source development workspace from Kiro that runs on your own hardware. Its Gateway, reached from a desktop app, browser, CLI or chat apps, keeps memory across sessions, runs scheduled work and coordinates parallel agents.',
		cite: ['kiro-crew-home', 'kiro-crew-quickstart', 'kiro-crew-interfaces']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'A Python Gateway with a React dashboard, used from an Electron desktop app, a browser, the kirocrew CLI or chat apps', cite: ['kiro-crew-installation', 'kiro-crew-interfaces', 'kiro-crew-home'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v0.8.0 (October 2026), pre-1.0 with frequent releases on Stable, Insider and Nightly channels; several features are in Preview', cite: ['kiro-crew-release', 'kiro-crew-repo-changelog', 'kiro-crew-readme', 'kiro-crew-backends'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (Apache License 2.0)', cite: ['kiro-crew-license', 'kiro-crew-home'] } },
				{ label: 'Price', splash: S.price, other: { text: 'No fee; needs a Kiro plan: Free (50 credits), Pro $20, Pro+ $40, Pro Max $100 or Power $200 per user a month', cite: ['kiro-crew-home', 'kiro-crew-pricing'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'Desktop: macOS universal, Windows x64, Linux x64 and arm64 (.deb, .rpm, AppImage; glibc 2.34+). Also a multi-arch Docker image', cite: ['kiro-crew-release', 'kiro-crew-installation', 'kiro-crew-readme'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Kiro CLI by default; in Preview, behind Developer Mode: Claude Code, KAS, Codex, OpenCode, Pi, goose and, since 0.8.0, DeepSeek', cite: ['kiro-crew-backends', 'kiro-crew-features', 'kiro-crew-home', 'kiro-crew-repo-changelog', 'kiro-crew-release'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Agent Client Protocol: the Gateway launches kiro-cli acp by default, or a harness from a fixed list of ACP integrations', cite: ['kiro-crew-install-guide', 'kiro-crew-home', 'kiro-crew-backends-source', 'kiro-crew-custom-backend'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Kiro sign-in, billed in Kiro plan credits; the Preview Claude Code harness can send chat turns to your own Anthropic-compatible endpoint', cite: ['kiro-crew-home', 'kiro-crew-custom-backend', 'kiro-crew-backends'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'A Kiro account, signed in once through Kiro CLI, which the 0.8.0 desktop app bundles; Crew itself keeps no user accounts', cite: ['kiro-crew-home', 'kiro-crew-readme', 'kiro-crew-release'] } },
				{ label: 'Model and mode pickers', splash: S.models, other: { text: 'A model chip in the composer sets the model and reasoning effort; Kiro’s models include Auto, Claude, GPT-5.6 and open-weight models', mark: 'yes', cite: ['kiro-crew-chat', 'kiro-crew-pricing'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Automatic by default: calls that clear deny, governance and sandbox checks run unprompted; Interactive mode asks, with bulk approve or reject', mark: 'yes', cite: ['kiro-crew-security'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Two managed servers built in, servers you add and one-click connectors such as Linear and Atlassian; the Pi harness receives none of them', mark: 'yes', cite: ['kiro-crew-mcp', 'kiro-crew-connections', 'kiro-crew-backends'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Chats keep their own context and approvals, with no worktree documented; Task Runner tasks and a follow-up action get git worktrees', mark: 'partial', cite: ['kiro-crew-sessions', 'kiro-crew-task-runner', 'kiro-crew-followups'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Tabs show thinking, waiting or idle; approval and question cards; desktop alerts for approvals and, if enabled, finished chats', mark: 'yes', cite: ['kiro-crew-sessions', 'kiro-crew-security', 'kiro-crew-agent-questions', 'kiro-crew-release'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Isolated subagents, Crew Mode sub-sessions (a feature preview), peer session control and Python Workflows scripts that fan work out across agents', mark: 'yes', cite: ['kiro-crew-subagents', 'kiro-crew-sessions', 'kiro-crew-features'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Cron jobs, each in its own session, authenticated webhooks, and heartbeat monitors that react to PR, deploy and pipeline changes', mark: 'yes', cite: ['kiro-crew-cron', 'kiro-crew-home'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'The agent can drive a real browser, clicking and filling in forms, while you watch it from the dashboard', mark: 'yes', cite: ['kiro-crew-features'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'Shell tabs in each chat’s side panel start in its working directory; the Project menu opens one in the project folder', mark: 'yes', cite: ['kiro-crew-dashboard', 'kiro-crew-chat'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Diff chips in the transcript expand to patches, with a side-by-side view; line comments sent to the agent aren’t documented', mark: 'yes', cite: ['kiro-crew-chat', 'kiro-crew-changelog'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'A side-panel file tree to browse, search and edit project files, plus a Git panel for repo status and commit history', mark: 'yes', cite: ['kiro-crew-chat', 'kiro-crew-changelog'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Code Review Sage, a shipped app you switch on, reviews PRs through gh and stages a draft review; PR watches wake the agent; creating PRs isn’t documented', mark: 'yes', cite: ['kiro-crew-apps-doc', 'kiro-crew-home', 'kiro-crew-release'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'Issue Radar, a shipped app you switch on, triages GitHub, GitLab and Azure DevOps issues; Jira links open in a side panel; Linear and Atlassian connect via MCP', mark: 'yes', cite: ['kiro-crew-apps-doc', 'kiro-crew-chat', 'kiro-crew-connections'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Remote Gateways over SSH tunnels; an opt-in hub reaches crews over SSH, SSM or Fargate, with remote chats in Preview', mark: 'yes', cite: ['kiro-crew-installation', 'kiro-crew-interfaces', 'kiro-crew-multi-instance'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'No native Crew app described; the dashboard installs as a phone PWA, and chats continue in Slack, WhatsApp and other apps', mark: 'partial', cite: ['kiro-crew-home', 'kiro-crew-remote-mobile', 'kiro-crew-interfaces'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented; Crew imports its own exported sessions, and setup imports MCP servers and workspaces from Gemini CLI and Antigravity', mark: 'unknown', cite: ['kiro-crew-sessions', 'kiro-crew-repo-changelog'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Finds sessions on all connected Gateways by title, PR or issue number; full-text search of transcripts isn’t documented', mark: 'partial', cite: ['kiro-crew-sessions'] } },
				{ label: 'Fork a conversation', splash: S.fork, other: { text: 'Sessions can be forked or resumed, survive Gateway restarts and move between machines as exported files', mark: 'yes', cite: ['kiro-crew-sessions'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Both speak the <strong>Agent Client Protocol</strong>. Kiro Crew’s Gateway starts <code>kiro-cli acp</code> by default; Claude Code, KAS, Codex, OpenCode, Pi and goose are Preview harnesses, picked from a fixed list behind Developer Mode. Splash ships launch commands for many agents and runs each natively or through a pinned adapter, with the login of that agent’s own CLI.',
			cite: ['kiro-crew-install-guide', 'kiro-crew-backends', 'kiro-crew-backends-source', 'kiro-crew-home', 'splash-registry', 'splash-agents', 'acp']
		},
		{
			title: 'Accounts, pricing and license',
			text: 'Kiro Crew is Apache-2.0 software with no fee of its own; it needs a Kiro account and plan, and by default its model requests, scheduled runs included, use your plan’s credits, from the 50-credit Free tier to Power at $200 per user a month. Splash is MIT-licensed, free and has no accounts; each agent runs with its own CLI’s login.',
			cite: ['kiro-crew-license', 'kiro-crew-home', 'kiro-crew-pricing', 'splash-license', 'splash-download', 'splash-build', 'splash-agents']
		},
		{
			title: 'Where it runs and how you reach it',
			text: 'Kiro Crew’s Gateway runs on your computer, a remote host or in Docker, reached from the desktop app, a browser dashboard that installs on a phone, the <code>kirocrew</code> CLI or chat apps such as Slack and WhatsApp. Splash runs on macOS, Windows and Ubuntu, or as <code>splash-server</code>, used in a browser over an SSH tunnel.',
			cite: ['kiro-crew-installation', 'kiro-crew-running-24-7', 'kiro-crew-interfaces', 'kiro-crew-remote-mobile', 'splash-install', 'splash-server']
		},
		{
			title: 'What each is built around',
			text: 'Kiro Crew keeps working between conversations: it remembers projects and learned lessons, starts work from cron jobs, webhooks and heartbeat monitors, and its Task Runner breaks a spec into checkpointed steps on its own branch. Splash centers on sessions you start, one agent each, with a Needs attention queue, a review screen and import of conversations begun elsewhere.',
			cite: ['kiro-crew-home', 'kiro-crew-cron', 'kiro-crew-task-runner', 'splash-readme', 'splash-how', 'splash-features', 'splash-history']
		},
		{
			title: 'Permissions and sandboxing',
			text: 'Kiro Crew approves tool calls automatically by default once they clear its deny, governance and sandbox checks; <strong>Interactive</strong> mode asks first. An OS sandbox hides credential folders such as <code>.gnupg</code> from agent processes, and strict mode also hides <code>.ssh</code> and <code>.aws</code>. Splash shows each permission request the agent sends in the transcript and keeps pending ones in <strong>Needs attention</strong>.',
			cite: ['kiro-crew-security', 'splash-features']
		}
	],
	fit: {
		splash: [
			'You want a free, MIT-licensed app with no account, running each agent on the CLI login you already have.',
			'You want Claude Code, Codex, Gemini, Copilot and other agents side by side, each session in its project folder or its own worktree.',
			'You want permission requests answered in the transcript and gathered with finished turns in one Needs attention queue.',
			'You want to import and search conversations your agents started outside the app.'
		],
		other: [
			'You already have a Kiro plan and want it to power a workspace on your own machines.',
			'You want an agent that remembers your projects and learns lessons from one session to the next.',
			'You want cron jobs, webhooks and heartbeat monitors that start work while you are away.',
			'You want to pick up the same conversations from a browser, the CLI, a phone or chat apps such as Slack.'
		]
	},
	sources: [
		{ id: 'kiro-crew-home', title: 'Kiro Crew', url: 'https://kiro.dev/crew/', publisher: 'AWS', checked: '2026-10-10' },
		{ id: 'kiro-crew-quickstart', title: 'Quick start', url: 'https://kiro.dev/docs/crew/', publisher: 'AWS', checked: '2026-10-10' },
		{ id: 'kiro-crew-installation', title: 'Installation', url: 'https://kiro.dev/docs/crew/installation/', publisher: 'AWS', checked: '2026-10-10' },
		{ id: 'kiro-crew-interfaces', title: 'Interfaces', url: 'https://kiro.dev/docs/crew/interfaces/', publisher: 'AWS', checked: '2026-10-10' },
		{ id: 'kiro-crew-features', title: 'Features', url: 'https://kiro.dev/docs/crew/features/', publisher: 'AWS', checked: '2026-10-10' },
		{ id: 'kiro-crew-backends', title: 'Agent backends (Preview)', url: 'https://kiro.dev/docs/crew/features/agent-backends/', publisher: 'AWS', checked: '2026-10-10' },
		{ id: 'kiro-crew-chat', title: 'Chat', url: 'https://kiro.dev/docs/crew/chat/', publisher: 'AWS', checked: '2026-10-10' },
		{ id: 'kiro-crew-sessions', title: 'Sessions', url: 'https://kiro.dev/docs/crew/chat/sessions/', publisher: 'AWS', checked: '2026-10-10' },
		{ id: 'kiro-crew-subagents', title: 'Subagents', url: 'https://kiro.dev/docs/crew/features/subagents/', publisher: 'AWS', checked: '2026-10-10' },
		{ id: 'kiro-crew-task-runner', title: 'Task Runner', url: 'https://kiro.dev/docs/crew/features/task-runner/', publisher: 'AWS', checked: '2026-10-10' },
		{ id: 'kiro-crew-cron', title: 'Scheduling', url: 'https://kiro.dev/docs/crew/features/cron/', publisher: 'AWS', checked: '2026-10-10' },
		{ id: 'kiro-crew-multi-instance', title: 'Multi-instance', url: 'https://kiro.dev/docs/crew/features/multi-instance/', publisher: 'AWS', checked: '2026-10-10' },
		{ id: 'kiro-crew-security', title: 'Security', url: 'https://kiro.dev/docs/crew/security/', publisher: 'AWS', checked: '2026-10-10' },
		{ id: 'kiro-crew-mcp', title: 'Integrations (MCP)', url: 'https://kiro.dev/docs/crew/capabilities/mcp-tools/', publisher: 'AWS', checked: '2026-10-10' },
		{ id: 'kiro-crew-running-24-7', title: 'Running 24/7', url: 'https://kiro.dev/docs/crew/running-24-7/', publisher: 'AWS', checked: '2026-10-10' },
		{ id: 'kiro-crew-changelog', title: 'Crew changelog', url: 'https://kiro.dev/changelog/crew/', publisher: 'AWS', checked: '2026-10-10' },
		{ id: 'kiro-crew-pricing', title: 'Pricing', url: 'https://kiro.dev/pricing/', publisher: 'AWS', checked: '2026-10-10' },
		{ id: 'kiro-crew-readme', title: 'README.md', url: 'https://github.com/kirodotdev/KiroCrew/blob/main/README.md', publisher: 'kirodotdev/KiroCrew on GitHub', checked: '2026-10-10' },
		{ id: 'kiro-crew-license', title: 'LICENSE', url: 'https://github.com/kirodotdev/KiroCrew/blob/main/LICENSE', publisher: 'kirodotdev/KiroCrew on GitHub', checked: '2026-10-10' },
		{ id: 'kiro-crew-repo-changelog', title: 'CHANGELOG.md', url: 'https://github.com/kirodotdev/KiroCrew/blob/main/CHANGELOG.md', publisher: 'kirodotdev/KiroCrew on GitHub', checked: '2026-10-10' },
		{ id: 'kiro-crew-release', title: 'Release v0.8.0', url: 'https://github.com/kirodotdev/KiroCrew/releases/tag/v0.8.0', publisher: 'kirodotdev/KiroCrew on GitHub', checked: '2026-10-10' },
		{ id: 'kiro-crew-install-guide', title: 'Installing and Running Kiro Crew', url: 'https://github.com/kirodotdev/KiroCrew/blob/main/docs/guides/install.md', publisher: 'kirodotdev/KiroCrew on GitHub', checked: '2026-10-10' },
		{ id: 'kiro-crew-custom-backend', title: 'Running the agent on an Anthropic-compatible LLM endpoint', url: 'https://github.com/kirodotdev/KiroCrew/blob/main/docs/guides/custom-llm-backend.md', publisher: 'kirodotdev/KiroCrew on GitHub', checked: '2026-10-10' },
		{ id: 'kiro-crew-backends-source', title: 'src/kiro_crew/agent_sdk/backends.py', url: 'https://github.com/kirodotdev/KiroCrew/blob/main/src/kiro_crew/agent_sdk/backends.py', publisher: 'kirodotdev/KiroCrew on GitHub', checked: '2026-10-10' },
		{ id: 'kiro-crew-remote-mobile', title: 'Remote Hosts and Mobile Access', url: 'https://github.com/kirodotdev/KiroCrew/blob/main/docs/guides/remote-and-mobile.md', publisher: 'kirodotdev/KiroCrew on GitHub', checked: '2026-10-10' },
		{ id: 'kiro-crew-followups', title: 'Follow-up Suggestions', url: 'https://github.com/kirodotdev/KiroCrew/blob/main/src/kiro_crew/docs/followup-suggestions.md', publisher: 'kirodotdev/KiroCrew on GitHub', checked: '2026-10-10' },
		{ id: 'kiro-crew-agent-questions', title: 'Agent questions (ask_question)', url: 'https://github.com/kirodotdev/KiroCrew/blob/main/src/kiro_crew/docs/agent-questions.md', publisher: 'kirodotdev/KiroCrew on GitHub', checked: '2026-10-10' },
		{ id: 'kiro-crew-apps-doc', title: 'Apps and the App Store', url: 'https://github.com/kirodotdev/KiroCrew/blob/main/src/kiro_crew/docs/apps.md', publisher: 'kirodotdev/KiroCrew on GitHub', checked: '2026-10-10' },
		{ id: 'kiro-crew-dashboard', title: 'Web Dashboard', url: 'https://github.com/kirodotdev/KiroCrew/blob/main/src/kiro_crew/docs/dashboard.md', publisher: 'kirodotdev/KiroCrew on GitHub', checked: '2026-10-10' },
		{ id: 'kiro-crew-connections', title: 'Connections', url: 'https://github.com/kirodotdev/KiroCrew/blob/main/src/kiro_crew/docs/connections.md', publisher: 'kirodotdev/KiroCrew on GitHub', checked: '2026-10-10' }
	]
};
