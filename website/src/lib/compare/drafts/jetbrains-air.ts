// Splash vs JetBrains Air. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const JETBRAINS_AIR: Comparison = {
	slug: 'jetbrains-air',
	name: 'JetBrains Air',
	description: 'How Splash and JetBrains Air compare on agents, platforms, pricing, isolation, review and cloud tasks, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and JetBrains Air both run several coding agents at once, in your project folder or a git worktree. JetBrains Air spans a desktop app, a JetBrains IDE plugin and Air Teams, with Docker and cloud environments and JetBrains AI credits. Splash is an open-source desktop app and headless server that drives every agent over the Agent Client Protocol.',
	other: {
		name: 'JetBrains Air',
		url: 'https://www.jetbrains.com/air/',
		maker: 'JetBrains',
		summary: 'JetBrains’ products for coding agents: a desktop app that runs built-in and ACP agents locally, in worktrees, in Docker or in the cloud, a plugin for JetBrains IDEs, and Air Teams.',
		cite: ['jetbrains-air-home', 'jetbrains-air-system', 'jetbrains-air-supported-agents', 'jetbrains-air-run-env']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'A set of products: a desktop app, a JetBrains IDE plugin, Air Teams in the browser and the Air Gateway CLI', cite: ['jetbrains-air-home', 'jetbrains-air-system', 'jetbrains-air-app', 'jetbrains-air-ways', 'jetbrains-air-gateway'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'Desktop app: Public Preview, build 262.1037.6 (8 October 2026). IDE plugin: EAP. Air Teams and Air Gateway: early access', cite: ['jetbrains-air-releases', 'jetbrains-air-ides-idea', 'jetbrains-air-home', 'jetbrains-air-gateway'] } },
				{ label: 'License', splash: S.license, other: { text: 'Proprietary early-access terms that forbid reverse engineering; the IDE plugin ships under the JetBrains Free Plugin License', cite: ['jetbrains-air-terms', 'jetbrains-air-marketplace'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free app; models run on your own provider account or JetBrains AI credits (AI Pro €100/year before VAT). Air Governance Business: $20/seat/month', cite: ['jetbrains-air-store', 'jetbrains-air-terms', 'jetbrains-air-ai-plans', 'jetbrains-air-governance'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS, Windows and Linux, each on x64 and ARM64; the plugin runs in IntelliJ-based IDEs from 2026.2, except Android Studio', cite: ['jetbrains-air-releases', 'jetbrains-air-ides-idea', 'jetbrains-air-ides-overview'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Agent, Codex, Gemini CLI and Junie built in; Copilot, OpenCode, Cline and any other ACP agent through acp.json', cite: ['jetbrains-air-supported-agents', 'jetbrains-air-july', 'jetbrains-air-agents-models'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Custom agents over ACP; the IDE plugin runs ACP agents as chat, CLI agents in a terminal. How built-ins start isn’t documented', cite: ['jetbrains-air-agents-models', 'jetbrains-air-ides-overview', 'jetbrains-air-ides-manage-agents'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Provider subscriptions or API keys for local tasks, or JetBrains AI credits; cloud tasks and automations always spend credits', cite: ['jetbrains-air-quickstart', 'jetbrains-air-supported-agents', 'jetbrains-air-cloud-tasks'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'A JetBrains Account for JetBrains AI, Junie and Air Teams; with ACP agents alone you can skip the app’s provider step', cite: ['jetbrains-air-quickstart', 'jetbrains-air-teams-setup', 'jetbrains-air-supported-agents'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Plan, Ask, Edit and Full Access modes (names vary by agent); you answer questions and approvals in the widget that shows them', mark: 'yes', cite: ['jetbrains-air-permission-modes', 'jetbrains-air-prompt-queue'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Workspace and global MCP servers in the app, set in .air/mcp.json; Air Teams connectors are MCP servers for cloud tasks', mark: 'yes', cite: ['jetbrains-air-settings', 'jetbrains-air-connectors'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Chosen per task: your project folder, a git worktree on its own branch, a Docker container, or a cloud container', mark: 'yes', cite: ['jetbrains-air-run-env', 'jetbrains-air-accept'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Worktree and Docker setup commands in .air/, a startup script for cloud environments, and public URLs for cloud ports', mark: 'yes', cite: ['jetbrains-air-run-env', 'jetbrains-air-startup', 'jetbrains-air-ports'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'A Tasks list across projects with Input required labels and status grouping, plus a notification to open a task waiting on you', mark: 'yes', cite: ['jetbrains-air-multitasking', 'jetbrains-air-launch'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Air Teams automations start cloud tasks on a schedule, an interval, GitHub or Jira events, CI failures or webhooks', mark: 'partial', cite: ['jetbrains-air-automations', 'jetbrains-air-triggers', 'jetbrains-air-teams-post'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'A Web preview tool that opens a web project when its server starts, or a static HTML project', mark: 'yes', cite: ['jetbrains-air-web-preview'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Unified or Side-by-side diffs with line comments and reverts; Review with agent runs a second agent and model as reviewer', mark: 'yes', cite: ['jetbrains-air-review-changes', 'jetbrains-air-review-integrate', 'jetbrains-air-agent-review'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Cloud tasks have a Create PR action and automations can open PRs; for local tasks you push and open the PR yourself', mark: 'partial', cite: ['jetbrains-air-create-pr', 'jetbrains-air-accept'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Repository access through a GitHub connection app (GitLab via OAuth); GitHub PR, issue and Actions events can trigger automations', mark: 'partial', cite: ['jetbrains-air-source-control', 'jetbrains-air-triggers'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'Air Teams connectors for Jira, Linear, YouTrack and GitHub serve cloud tasks; Jira and GitHub issue events can start automations', mark: 'partial', cite: ['jetbrains-air-connectors', 'jetbrains-air-triggers'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'Air Teams runs tasks in remote containers that push to a task branch each turn; rolling out to eligible organizations', mark: 'partial', cite: ['jetbrains-air-cloud-tasks', 'jetbrains-air-home', 'jetbrains-air-ides-session'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'Start and follow Air Teams cloud tasks in the browser; running agents on your own remote machines isn’t documented', mark: 'partial', cite: ['jetbrains-air-ways', 'jetbrains-air-settings'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'Not yet; the Air home page marks its Mobile surface as coming soon', mark: 'no', cite: ['jetbrains-air-home', 'jetbrains-air-system', 'jetbrains-air-teams-post'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'The IDE plugin’s session list follows sessions from tools such as the Codex app; importing CLI transcripts isn’t documented', mark: 'partial', cite: ['jetbrains-air-ides-sessions'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'The IDE plugin searches the text of active and archived sessions; the app searches tasks across all its projects', mark: 'yes', cite: ['jetbrains-air-ides-sessions', 'jetbrains-air-august'] } },
				{ label: 'Fork a conversation', splash: S.fork, other: { text: 'The IDE plugin forks a session into a new temporary worktree or the same workspace, or continues it with its earlier messages', mark: 'yes', cite: ['jetbrains-air-ides-session'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'JetBrains Air ships Claude Agent, Codex, Gemini CLI and Junie as built-in agents; its docs don’t say how the app starts them. Others, such as Copilot and OpenCode, join over ACP through <code>acp.json</code>, and the IDE plugin can also run CLI agents in a terminal tab. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, natively or through an adapter.',
			cite: ['jetbrains-air-supported-agents', 'jetbrains-air-agents-models', 'jetbrains-air-july', 'jetbrains-air-ides-overview', 'splash-registry', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'The Air app runs each task in your project folder, a git worktree, a Docker container or, with Air Teams, a cloud container that pushes to a task branch after every turn; cloud runs are reaching eligible organizations gradually. Splash runs agents on your computer, or under <code>splash-server</code> on a machine you reach from a browser through an SSH tunnel.',
			cite: ['jetbrains-air-run-env', 'jetbrains-air-cloud-tasks', 'jetbrains-air-home', 'jetbrains-air-ides-session', 'splash-readme', 'splash-server']
		},
		{
			title: 'Accounts, billing and license',
			text: 'The Air app is free under proprietary early-access terms. Local tasks can use your provider subscription or API key, while cloud tasks and automations always spend JetBrains AI credits; the docs disagree on Claude subscriptions, and Docker tasks can’t use one. Splash is MIT-licensed, has no accounts and runs each agent with the login of that agent’s own CLI.',
			cite: ['jetbrains-air-terms', 'jetbrains-air-store', 'jetbrains-air-quickstart', 'jetbrains-air-supported-agents', 'jetbrains-air-ai-credits', 'jetbrains-air-run-env', 'splash-license', 'splash-download', 'splash-build', 'splash-agents']
		},
		{
			title: 'Teams and automation',
			text: 'Air Teams, open to JetBrains business customers, adds cloud tasks and automations started by schedules, GitHub or Jira events, CI failures or webhooks, with MCP connectors for Jira, Linear, Sentry and others; admins pick the agents in Air Governance. Splash centers on one person’s sessions: a Needs attention queue, a review screen, transcript search and imported agent history.',
			cite: ['jetbrains-air-teams-post', 'jetbrains-air-triggers', 'jetbrains-air-connectors', 'jetbrains-air-supported-agents', 'splash-server', 'splash-features', 'splash-history']
		},
		{
			title: 'Platforms and surfaces',
			text: 'Air’s desktop app builds for macOS, Windows and Linux on x64 and ARM64, but the Air home page’s Try Air links go to the IDE plugin (IntelliJ-based IDEs from 2026.2), the browser and the CLI; a mobile surface is marked coming soon. Splash builds for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64, plus a headless server.',
			cite: ['jetbrains-air-releases', 'jetbrains-air-home', 'jetbrains-air-ides-idea', 'splash-install', 'splash-server']
		}
	],
	fit: {
		splash: [
			'You want a free, MIT-licensed app with no account that runs each agent on its own CLI login.',
			'You want every agent, Claude Code and Codex included, driven over the Agent Client Protocol.',
			'You want to run sessions on your own server and use them from a browser over SSH.',
			'You want to import conversations your agents started elsewhere and search them with the rest.'
		],
		other: [
			'You want Docker containers or cloud environments, as well as worktrees, for each task.',
			'You work in IntelliJ-based IDEs and want agent sessions inside them.',
			'You want setup scripts, a web preview and an agent reviewer with its own model before you accept changes.',
			'You want team automations that start cloud tasks from schedules, GitHub or Jira events, CI failures or webhooks.'
		]
	},
	sources: [
		{ id: 'jetbrains-air-home', title: 'JetBrains Air: One system for building software with agents', url: 'https://www.jetbrains.com/air/', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-system', title: 'JetBrains Air: Building a System of Products for Agentic Software Development', url: 'https://blog.jetbrains.com/blog/2026/09/22/introducing-jetbrains-air/', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-app', title: 'Air app', url: 'https://www.jetbrains.com/help/air/air-app.html', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-ways', title: 'Ways to reach Air Teams', url: 'https://www.jetbrains.com/help/air/ways-to-reach-air-teams.html', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-gateway', title: 'Air Gateway', url: 'https://www.jetbrains.com/air/gateway/', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-releases', title: 'JetBrains product releases feed (AIR)', url: 'https://data.services.jetbrains.com/products/releases?code=AIR&latest=true&type=preview', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-launch', title: 'Air Launches as Public Preview', url: 'https://blog.jetbrains.com/air/2026/03/air-launches-as-public-preview-a-new-wave-of-dev-tooling-built-on-26-years-of-experience/', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-terms', title: 'JetBrains Air EAP User Agreement', url: 'https://www.jetbrains.com/legal/docs/terms/jetbrains-air/', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-marketplace', title: 'JetBrains Marketplace API: plugin 33314 (Air)', url: 'https://plugins.jetbrains.com/api/plugins/33314', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-store', title: 'JetBrains Store', url: 'https://www.jetbrains.com/store/?section=personal&billing=yearly', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-ai-plans', title: 'JetBrains AI Plans & Pricing', url: 'https://www.jetbrains.com/ai-ides/buy/?section=personal&billing=yearly', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-governance', title: 'Air Governance', url: 'https://www.jetbrains.com/air/governance/', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-ides-idea', title: 'JetBrains Air in IDEs', url: 'https://www.jetbrains.com/help/idea/air-in-jetbrains-ides.html.md', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-ides-overview', title: 'JetBrains Air in IDEs overview', url: 'https://www.jetbrains.com/help/air-ides/air-overview.html', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-ides-manage-agents', title: 'Browse, install, and update agents', url: 'https://www.jetbrains.com/help/air-ides/air-manage-agents.html', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-ides-session', title: 'Start, continue, or fork a session', url: 'https://www.jetbrains.com/help/air-ides/air-start-a-new-session.html', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-ides-sessions', title: 'Manage agent sessions', url: 'https://www.jetbrains.com/help/air-ides/air-manage-agent-sessions.html', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-supported-agents', title: 'Supported agents', url: 'https://www.jetbrains.com/help/air/supported-agents.html', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-agents-models', title: 'Agents and models', url: 'https://www.jetbrains.com/help/air/select-agents-and-models.html', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-july', title: 'What’s new: Air gets more agents, local models, and Java/Kotlin code intelligence', url: 'https://blog.jetbrains.com/air/2026/07/what-s-new-air-gets-more-agents-local-models-and-java-kotlin-code-intelligence/', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-august', title: 'New in Air: Multiproject View, a New Markdown Editor, and IME on Windows', url: 'https://blog.jetbrains.com/air/2026/08/new-in-air-multiproject-view-and-improved-markdown/', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-quickstart', title: 'Quickstart with Air', url: 'https://www.jetbrains.com/help/air/quickstart-air-app.html', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-ai-credits', title: 'Credits and usage', url: 'https://www.jetbrains.com/help/air/ai-credits.html', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-permission-modes', title: 'Permission modes', url: 'https://www.jetbrains.com/help/air/permission-modes.html', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-prompt-queue', title: 'Prompt queue', url: 'https://www.jetbrains.com/help/air/prompt-queue.html', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-settings', title: 'Settings', url: 'https://www.jetbrains.com/help/air/settings.html', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-run-env', title: 'Run environments', url: 'https://www.jetbrains.com/help/air/run-environments.html', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-accept', title: 'Accept changes', url: 'https://www.jetbrains.com/help/air/accept-changes.html', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-startup', title: 'Startup commands', url: 'https://www.jetbrains.com/help/air/startup-commands.html', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-ports', title: 'Exposed ports', url: 'https://www.jetbrains.com/help/air/exposed-ports.html', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-web-preview', title: 'Web preview', url: 'https://www.jetbrains.com/help/air/web-preview.html', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-multitasking', title: 'Multitasking', url: 'https://www.jetbrains.com/help/air/multitasking.html', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-cloud-tasks', title: 'Cloud tasks', url: 'https://www.jetbrains.com/help/air/tasks.html', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-teams-setup', title: 'Set up Air Teams', url: 'https://www.jetbrains.com/help/air/set-up-air-teams.html', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-teams-post', title: 'Air Teams: Bring Your Best Agentic Workflows to the Whole Team', url: 'https://blog.jetbrains.com/air/2026/09/introducing-air-teams/', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-automations', title: 'Automations', url: 'https://www.jetbrains.com/help/air/automations.html', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-triggers', title: 'Automation triggers', url: 'https://www.jetbrains.com/help/air/automation-triggers.html', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-connectors', title: 'MCP Connectors', url: 'https://www.jetbrains.com/help/air/connectors.html', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-review-changes', title: 'Review changes', url: 'https://www.jetbrains.com/help/air/review-changes.html', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-review-integrate', title: 'Review and integrate', url: 'https://www.jetbrains.com/help/air/review-and-integrate.html', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-agent-review', title: 'Review with agent', url: 'https://www.jetbrains.com/help/air/agentic-review.html', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-create-pr', title: 'Create a pull request', url: 'https://www.jetbrains.com/help/air/create-a-pull-request.html', publisher: 'JetBrains', checked: '2026-10-10' },
		{ id: 'jetbrains-air-source-control', title: 'Source control', url: 'https://www.jetbrains.com/help/air/source-control.html', publisher: 'JetBrains', checked: '2026-10-10' }
	]
};
