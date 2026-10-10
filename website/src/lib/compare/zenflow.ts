// Splash vs Zenflow. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const ZENFLOW: Comparison = {
	slug: 'zenflow',
	name: 'Zenflow',
	description: 'How Splash and Zenflow compare on agents, platforms, pricing, worktrees, review and automations, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Zenflow both run several coding agents at once and can give each its own git worktree. Zenflow, from Zencoder, runs Claude Code, Codex, Gemini or Zencoder’s own agent through step-based workflows, and its paid plans add credits for hosted models. Splash, a free, open-source desktop app, drives agents over the Agent Client Protocol.',
	other: {
		name: 'Zenflow',
		url: 'https://zencoder.ai/zenflow',
		maker: 'Zencoder',
		summary: 'A desktop app that runs Claude Code, Codex, Gemini or Zencoder’s own agent on parallel tasks in git worktrees, through step-based workflows with review and pull requests. A Work mode handles non-coding tasks.',
		cite: ['zenflow-download', 'zenflow-install', 'zenflow-concepts', 'zenflow-agent-presets', 'zenflow-projects-tasks']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app with Code and Work modes, plus a server for a remote VM, reached over SSH or in a browser', cite: ['zenflow-download', 'zenflow-install', 'zenflow-remote-hosts', 'zenflow-vps'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'Launched December 2025. The changelog ends at v2.3.4 (26 August 2026); the Remote Hosts doc asks for 2.5.1 or later', cite: ['zenflow-blog-work', 'zenflow-changelog-aug', 'zenflow-remote-hosts'] } },
				{ label: 'License', splash: S.license, other: { text: 'Proprietary and closed source; a revocable license for professional development use that forbids reverse engineering', cite: ['zenflow-terms'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free plan; Pro $45, Pro Plus $95 and Pro Max $195 per user a month ($40, $85 and $175 a month if billed yearly), each with model credits; Enterprise custom', cite: ['zenflow-docs-pricing', 'zenflow-pricing', 'zenflow-blog-work'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon and Intel), Windows x64, Linux x64 (.deb and .rpm); the remote server runs on Ubuntu', cite: ['zenflow-download', 'zenflow-remote-hosts'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Electron, with an embedded Chromium browser; the source code isn’t public', cite: ['zenflow-changelog-may', 'zenflow-projects-tasks', 'zenflow-terms'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Zencoder’s own agent (ZenCLI), Claude Code, Codex and Gemini; custom models plug in as OpenAI-compatible or Gemini endpoints', cite: ['zenflow-quickstart', 'zenflow-agent-presets', 'zenflow-troubleshooting', 'zenflow-custom-models'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each agent’s CLI on your computer, in a chat that streams tool calls and commands; the docs name no protocol', cite: ['zenflow-quickstart', 'zenflow-concepts', 'zenflow-claude-code', 'zenflow-troubleshooting', 'zenflow-projects-tasks'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Claude Pro/Max or an Anthropic key; an OpenAI key (Codex); Google AI or Vertex (Gemini); or Zencoder credits for hosted models', cite: ['zenflow-claude-code', 'zenflow-codex', 'zenflow-gemini', 'zenflow-docs-pricing'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'The terms say basic features work without one; the install guide has you sign in, and integrations need an account', cite: ['zenflow-terms', 'zenflow-install', 'zenflow-integrations'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Set per preset: Claude Code’s skip-permissions and auto-approve modes, Codex sandbox modes such as Always ask, ZenCLI shell-command confirmation', mark: 'yes', cite: ['zenflow-agent-presets', 'zenflow-claude-code', 'zenflow-changelog-may', 'zenflow-codex', 'zenflow-changelog-mar'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Add MCP servers in settings; a built-in Zenflow MCP server lets agents create tasks and trigger automations', mark: 'yes', cite: ['zenflow-settings', 'zenflow-changelog-feb'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A worktree on its own branch per Code task, removed on archive; Work tasks use a folder; no container sandbox documented', mark: 'yes', cite: ['zenflow-concepts', 'zenflow-git-worktrees'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Setup scripts per worktree, verification after each agent turn and copied .env files; the dev server command isn’t run automatically yet', mark: 'yes', cite: ['zenflow-projects-tasks', 'zenflow-concepts'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Kanban board and task list with live status, inline agent questions, an Action needed banner and desktop notifications', mark: 'yes', cite: ['zenflow-blast-agents', 'zenflow-changelog-mar', 'zenflow-changelog-feb', 'zenflow-settings'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Workflow steps switch between agent presets, agents can start subagents, and the built-in MCP server lets agents create tasks', mark: 'yes', cite: ['zenflow-agent-presets', 'zenflow-subagents', 'zenflow-changelog-feb'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Automations run on a schedule, as a new task each time or inside one task; custom cron expressions since August 2026', mark: 'yes', cite: ['zenflow-automations', 'zenflow-changelog-aug'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'An embedded Chromium browser for localhost previews; copy an element for the agent, and agents control it through MCP tools', mark: 'yes', cite: ['zenflow-projects-tasks', 'zenflow-page', 'zenflow-changelog-mar'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Diffs with a checkpoint per turn, rollback and hunk picking, plus reviewer agents from another model; no line comments documented', mark: 'yes', cite: ['zenflow-tracking-changes', 'zenflow-settings', 'zenflow-page'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Opens a GitHub PR, draft or not, after pushing the task’s branch, with merge strategies; PR status updates the task', mark: 'yes', cite: ['zenflow-projects-tasks', 'zenflow-changelog-mar', 'zenflow-github'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Connected by OAuth or a token with a Zencoder account; issues can start tasks, PR comments can re-run agents, and an agent can monitor CI and fix failing runs', mark: 'yes', cite: ['zenflow-github', 'zenflow-changelog-feb', 'zenflow-changelog-mar'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'Tasks from GitHub, Jira or Linear issues; Jira and Linear get status updates and links to the branch or PR', mark: 'yes', cite: ['zenflow-changelog-feb', 'zenflow-jira', 'zenflow-linear'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Remote hosts, marked experimental, keep tasks running on an Ubuntu VM over SSH; a public VPS install serves a browser UI', mark: 'partial', cite: ['zenflow-remote-hosts', 'zenflow-vps'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'No mobile app listed; downloads cover macOS, Windows and Linux. A Slack, Telegram or Discord assistant starts tasks and sends updates', mark: 'no', cite: ['zenflow-download', 'zenflow-home', 'zenflow-changelog'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Importing sessions started outside Zenflow isn’t documented; the Import issue button brings in tracker issues', mark: 'unknown', cite: ['zenflow-projects-tasks'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Searching chat text isn’t documented; archived tasks can be browsed and searched, and keep their chat logs', mark: 'unknown', cite: ['zenflow-archiving'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Zenflow runs Zencoder’s ZenCLI or the Claude Code, Codex and Gemini CLIs installed locally, and streams their tool calls into its chat panel. The docs name no protocol and no way to add other agent CLIs; custom models plug in as OpenAI-compatible or Gemini endpoints. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, natively or through an adapter.',
			cite: ['zenflow-quickstart', 'zenflow-troubleshooting', 'zenflow-projects-tasks', 'zenflow-clis-overview', 'zenflow-custom-models', 'splash-registry', 'acp']
		},
		{
			title: 'Around the task',
			text: 'Zenflow builds each task around a workflow (built-in ones like Spec First, or your own in Markdown) with a preset per step, setup and verification scripts, a reviewer agent from another model, per-turn checkpoints and a GitHub PR; automations start tasks on a schedule. Splash centers on conversations: a Needs attention queue, a review screen, transcript search and imported sessions.',
			cite: ['zenflow-concepts', 'zenflow-agent-presets', 'zenflow-projects-tasks', 'zenflow-page', 'zenflow-tracking-changes', 'zenflow-automations', 'splash-features', 'splash-history']
		},
		{
			title: 'Price, accounts and license',
			text: 'Zenflow is closed source. Its Free plan uses your own keys plus a few hosted models; paid plans at $45 to $195 per user a month ($40 to $175 billed yearly) add model credits, and higher tiers add team credit pools, SSO and audit logs. The terms allow basic use without a Zencoder account, but integrations need one. Splash is free, MIT-licensed and has no accounts.',
			cite: ['zenflow-terms', 'zenflow-docs-pricing', 'zenflow-pricing', 'zenflow-models', 'zenflow-integrations', 'splash-license', 'splash-download', 'splash-build']
		},
		{
			title: 'Where agents run',
			text: 'Zenflow’s desktop app runs on macOS, Windows x64 and Linux x64. Remote hosts, still marked experimental, run a Zenflow server on an Ubuntu VM reached over SSH; a public VPS install serves it to a browser; and a messaging assistant takes tasks from Slack, Telegram or Discord. Splash runs on macOS, Windows and Ubuntu, or as <code>splash-server</code> reached through an SSH tunnel.',
			cite: ['zenflow-download', 'zenflow-remote-hosts', 'zenflow-vps', 'zenflow-home', 'splash-install', 'splash-server']
		}
	],
	fit: {
		splash: [
			'You want a free, MIT-licensed app that needs no account.',
			'You want Copilot, OpenCode, Goose and other agents in the same chat view as Claude Code, Codex and Gemini.',
			'You want every agent driven over the Agent Client Protocol, with permission requests answered in the transcript.',
			'You want to import conversations your agents started outside the app and search their saved text.'
		],
		other: [
			'You want each task run through a workflow, with setup and verification scripts and a reviewer agent from another model.',
			'You want to go from a GitHub, Jira or Linear issue to a GitHub pull request in one app.',
			'You want scheduled automations, a built-in browser and a chat assistant in Slack, Telegram or Discord.',
			'You want one plan that covers hosted models from several providers, with team credit pools and SSO on higher tiers.'
		]
	},
	sources: [
		{ id: 'zenflow-page', title: 'Zenflow by Zencoder', url: 'https://zencoder.ai/zenflow', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-home', title: 'Zencoder | The AI Coding Agent', url: 'https://zencoder.ai/', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-download', title: 'Download Zenflow', url: 'https://zencoder.ai/download', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-pricing', title: 'Pricing', url: 'https://zencoder.ai/pricing', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-terms', title: 'Terms of Service: Zenflow', url: 'https://zencoder.ai/legal/terms-of-service-zenflow', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-blog-work', title: 'Introducing Zenflow Work: AI Orchestration for the Other 75 Percent', url: 'https://zencoder.ai/blog/introducing-zenflow-work', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-docs-pricing', title: 'Pricing & Plans', url: 'https://docs.zencoder.ai/faq/pricing', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-models', title: 'Models', url: 'https://docs.zencoder.ai/features/models', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-install', title: 'Install Zenflow', url: 'https://docs.zencoder.ai/get-started/install-zenflow', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-concepts', title: 'Zenflow Concepts', url: 'https://docs.zencoder.ai/get-started/zenflow-concepts', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-quickstart', title: 'Zenflow Code (Quickstart)', url: 'https://docs.zencoder.ai/quickstart/zenflow-code', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-projects-tasks', title: 'Projects & Tasks', url: 'https://docs.zencoder.ai/zenflow/projects-and-tasks', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-settings', title: 'Settings', url: 'https://docs.zencoder.ai/zenflow/settings', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-agent-presets', title: 'Agent Presets', url: 'https://docs.zencoder.ai/zenflow/orchestration/agent-presets', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-subagents', title: 'SubAgents', url: 'https://docs.zencoder.ai/zenflow/subagents', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-clis-overview', title: 'Overview (CLIs)', url: 'https://docs.zencoder.ai/clis/overview', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-claude-code', title: 'Claude Code', url: 'https://docs.zencoder.ai/clis/claude-code', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-codex', title: 'Codex (OpenAI)', url: 'https://docs.zencoder.ai/clis/codex', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-gemini', title: 'Gemini', url: 'https://docs.zencoder.ai/clis/gemini', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-custom-models', title: 'Custom Models', url: 'https://docs.zencoder.ai/clis/custom-agent', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-troubleshooting', title: 'Troubleshooting', url: 'https://docs.zencoder.ai/zenflow/troubleshooting', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-git-worktrees', title: 'Git and Worktrees', url: 'https://docs.zencoder.ai/zenflow/git-worktrees', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-tracking-changes', title: 'Tracking Changes', url: 'https://docs.zencoder.ai/zenflow/tracking-changes', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-blast-agents', title: 'Blast Multiple Agents', url: 'https://docs.zencoder.ai/zenflow/blast-agents', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-archiving', title: 'Archiving Tasks', url: 'https://docs.zencoder.ai/zenflow/archiving', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-automations', title: 'Automations', url: 'https://docs.zencoder.ai/zenflow/scheduled-automation', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-integrations', title: 'Integrations Overview', url: 'https://docs.zencoder.ai/zenflow/integrations', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-github', title: 'GitHub Integration', url: 'https://docs.zencoder.ai/zenflow/integrations/github', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-jira', title: 'Jira Integration', url: 'https://docs.zencoder.ai/zenflow/integrations/jira', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-linear', title: 'Linear Integration', url: 'https://docs.zencoder.ai/zenflow/integrations/linear', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-remote-hosts', title: 'Remote Hosts', url: 'https://docs.zencoder.ai/zenflow/remote-hosts', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-vps', title: 'VPS Setup', url: 'https://docs.zencoder.ai/zenflow/vps-setup', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-changelog', title: 'Zenflow Changelog', url: 'https://docs.zencoder.ai/zenflow-changelog/home', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-changelog-feb', title: 'February 2026 (Zenflow Changelog)', url: 'https://docs.zencoder.ai/zenflow-changelog/february-2026', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-changelog-mar', title: 'March 2026 (Zenflow Changelog)', url: 'https://docs.zencoder.ai/zenflow-changelog/march-2026', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-changelog-may', title: 'May 2026 (Zenflow Changelog)', url: 'https://docs.zencoder.ai/zenflow-changelog/may-2026', publisher: 'Zencoder', checked: '2026-10-10' },
		{ id: 'zenflow-changelog-aug', title: 'August 2026 (Zenflow Changelog)', url: 'https://docs.zencoder.ai/zenflow-changelog/august-2026', publisher: 'Zencoder', checked: '2026-10-10' }
	]
};
