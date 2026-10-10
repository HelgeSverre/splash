// Splash vs Capy. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const CAPY: Comparison = {
	slug: 'capy',
	name: 'Capy',
	description: 'How Splash and Capy compare on agents, cloud VMs, pricing, platforms, pull requests and review, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Capy both run several coding agents at once. Capy is a proprietary cloud platform with paid plans, a desktop app and a web app: its own agent works on a VM per thread, or in a local folder, and opens pull requests. Splash, a free, open-source desktop app, drives other vendors’ agents over the Agent Client Protocol on your computer or server.',
	other: {
		name: 'Capy',
		url: 'https://capy.ai',
		maker: 'Scrapybara',
		summary: 'A cloud coding platform with desktop and web apps where Capy’s own agent works on a per-thread Ubuntu VM or a local folder, opens and reviews pull requests, and takes tasks from Slack and Linear.',
		cite: ['capy-home', 'capy-machines', 'capy-download', 'capy-review', 'capy-integrations']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app (macOS, Windows, Linux), a web app and a REST API; threads run on cloud VMs or locally', cite: ['capy-download', 'capy-changelog', 'capy-api-overview', 'capy-machines'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: '0.4.6, released 9 October 2026; the changelog starts with Capy Beta on 11 August 2026, and Capy’s blog goes back to February 2026', cite: ['capy-download', 'capy-changelog', 'capy-blog'] } },
				{ label: 'License', splash: S.license, other: { text: 'Proprietary; the terms forbid copying, modifying or reverse engineering it unless the law or Capy’s written permission allows it', cite: ['capy-terms'] } },
				{ label: 'Price', splash: S.price, other: { text: 'No free plan listed: Lite $20, Pro $100, Max $200–$1,000 a month, each with credits; or prepaid balance from $5; Enterprise custom-priced', cite: ['capy-pricing', 'capy-models-pricing'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon and Intel), Windows x64, Linux x64 and arm64, and a web app; local threads documented for Mac and Windows', cite: ['capy-download', 'capy-changelog'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Capy’s own agent, with subagents, a Captain and a review agent, on 59 listed models from Anthropic, OpenAI, Google, xAI and others', cite: ['capy-pricing', 'capy-subagents', 'capy-models-pricing'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'In cloud threads, Capy’s servers run the agent loop and a VM runs its commands; ACP and outside CLI agents aren’t documented', cite: ['capy-machines', 'capy-docs-welcome', 'capy-home'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Capy credits, your own keys or gateways (paid plans), or a Codex, GitHub Copilot or SuperGrok subscription; not a Claude subscription', cite: ['capy-models-pricing', 'capy-billing', 'capy-download'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'Yes: a Capy account through Google, GitHub or email; signing in on the desktop app also pairs that computer with Capy', cite: ['capy-download'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Not documented; a thread is marked Needs attention when it hits an error or waits on you for a decision, credentials or access', mark: 'unknown', cite: ['capy-threads'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'HTTP and stdio servers for the whole organization or one project, with per-tool toggles; marketplace plugins bundle servers and skills', mark: 'yes', cite: ['capy-integrations', 'capy-changelog'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Each cloud thread gets its own Ubuntu 24.04 VM, and work made on a base branch is pushed to a new capy/ branch; local threads use a folder or an existing worktree', mark: 'yes', cite: ['capy-machines', 'capy-pull-requests', 'capy-download', 'capy-changelog'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Per-repository initialize and refresh scripts, boot-time startup entries with ports, on-demand commands and VM snapshots, for cloud machines', mark: 'yes', cite: ['capy-environment'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Threads sort into Needs attention, Ready for review, Active, Waiting and Idle; a resting thread’s sidebar row shows its PR status', mark: 'yes', cite: ['capy-threads', 'capy-changelog'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'A thread’s agent starts subagents, nested up to three deep; an experimental Captain thread runs other threads as a crew', mark: 'yes', cite: ['capy-subagents', 'capy-changelog'] } },
				{ label: 'Team collaboration', hint: 'Sharing work with other people', splash: { text: 'splash-server is a personal, single-user service, not a multi-user deployment', mark: 'no', cite: ['splash-server'] }, other: { text: 'Unlimited members on all plans; members see the organization’s threads, except personal ones and those made private to chosen people', mark: 'yes', cite: ['capy-pricing', 'capy-projects', 'capy-changelog'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Automations fire on a schedule, on GitHub, Linear or Slack events, from an incoming webhook or on demand', mark: 'yes', cite: ['capy-automations', 'capy-changelog'] } },
				{ label: 'Built-in browser', hint: 'A browser shown inside the app', splash: S.browser, other: { text: 'The agent drives Google Chrome on its cloud machine, shown in a live desktop view in the thread; a computer-use skill also controls apps on your Mac', mark: 'yes', cite: ['capy-home', 'capy-machines', 'capy-skills'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'A review agent posts findings with severity on GitHub; reviewed PRs get a guide; the PR view has a Review button and per-file Reviewed checkboxes', mark: 'yes', cite: ['capy-review', 'capy-changelog'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Commits, pushes and opens PRs, stacked if needed; the agent merges one when you ask for that merge in the thread', mark: 'yes', cite: ['capy-pull-requests', 'capy-github', 'capy-admin-security'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'A GitHub App on your account or organization; failing CI, reviews and PR comments wake the owning thread, and commits can carry your name', mark: 'yes', cite: ['capy-github', 'capy-pull-requests'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'Linear issues delegated to Capy start threads that report back there; Jira and Notion are in progress, and GitHub issues as tasks aren’t documented', mark: 'partial', cite: ['capy-linear', 'capy-integrations', 'capy-automations'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'Each cloud thread gets its own Ubuntu VM, charged hourly by size, and keeps working after you close the laptop', mark: 'yes', cite: ['capy-machines', 'capy-models-pricing', 'capy-threads'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'A paired computer runs threads started in Capy on another browser, computer or phone while it is online with the app running; your own SSH hosts aren’t documented', mark: 'yes', cite: ['capy-download', 'capy-machines'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'No native iOS or Android app is documented; the web app works on phones, with push notifications once Capy is added to an iPhone Home Screen', mark: 'partial', cite: ['capy-changelog'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'The desktop app fetches updates in the background and shows a Restart to update control; the portable Linux tarball does not update itself', mark: 'yes', cite: ['capy-download', 'capy-linux'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'First desktop setup can import Claude Code and Codex sessions you pick as threads, in projects you choose', mark: 'partial', cite: ['capy-changelog', 'capy-download'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Full-text search over thread and subagent titles, thread codes, and what you and the agent wrote, from Cmd+K or the threads page', mark: 'yes', cite: ['capy-threads'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Capy runs its own agent, with subagents, a Captain and a review agent, on models from Anthropic, OpenAI, Google, xAI and others; in cloud threads, Capy’s servers run the loop. Its docs do not mention ACP or adding CLI agents such as Claude Code. Splash runs each vendor’s agent over the <strong>Agent Client Protocol</strong>, natively or through an adapter.',
			cite: ['capy-pricing', 'capy-models-pricing', 'capy-machines', 'capy-docs-welcome', 'capy-home', 'splash-registry', 'acp']
		},
		{
			title: 'Where work runs',
			text: 'Each Capy cloud thread gets its own Ubuntu VM, billed hourly. The desktop app can also run threads in a folder on a Mac or Windows PC, and a thread can move from a Mac to the cloud and back. Enterprise customers can host Capy on-prem. Splash runs agents on your computer, or under <code>splash-server</code> on your own machine.',
			cite: ['capy-machines', 'capy-models-pricing', 'capy-changelog', 'capy-download', 'capy-home', 'capy-security', 'splash-readme', 'splash-server']
		},
		{
			title: 'Price, accounts and license',
			text: 'Capy is proprietary and needs an account. Plans from $20 to $1,000 a month buy credits for model tokens and machine time, with unlimited members; an organization can also prepay balance or connect a Codex, GitHub Copilot or SuperGrok subscription, and open-source organizations that Capy approves receive $50 a day in free usage. Splash is free, MIT-licensed and has no accounts.',
			cite: ['capy-terms', 'capy-download', 'capy-pricing', 'capy-models-pricing', 'capy-billing', 'splash-license', 'splash-download', 'splash-build']
		},
		{
			title: 'Around the session',
			text: 'Capy ties threads to team tools: tasks arrive from Slack, Linear, automations or a REST API, failing CI and review comments wake the owning thread, and a review agent comments on pull requests. Splash works from the session on your machine: agents ask permission in the transcript, a <strong>Needs attention</strong> queue holds pending requests and finished turns, and a GitHub view lists issues, pull requests and Actions runs through the <code>gh</code> CLI.',
			cite: ['capy-integrations', 'capy-docs-welcome', 'capy-linear', 'capy-automations', 'capy-api-overview', 'capy-github', 'capy-review', 'splash-features', 'splash-history', 'splash-github']
		},
		{
			title: 'Platforms and updates',
			text: 'Capy’s desktop app ships for macOS, Windows x64 and Linux x64 and arm64, alongside a web app, and downloads its own updates, except from the portable Linux tarball. Splash builds for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64 plus a headless server, and is updated by downloading a new release from GitHub.',
			cite: ['capy-download', 'capy-linux', 'splash-install', 'splash-about']
		}
	],
	fit: {
		splash: [
			'You want a free, MIT-licensed app with no account, with agents running on your own computer or server.',
			'You want Claude Code, Gemini, Copilot, Goose and other vendors’ agents, each using the CLI login you already have.',
			'You want permission requests answered in the transcript and gathered in one Needs attention queue.',
			'You want to import conversations agents list over ACP and search them with the rest.'
		],
		other: [
			'You want each task on its own cloud VM, with setup scripts and snapshots, that keeps working after you close the laptop.',
			'You want one agent across dozens of models, paid from shared credits, your own keys or a Codex, Copilot or SuperGrok plan.',
			'You want tasks to arrive from Slack, Linear, schedules or an API, with CI results and review comments waking the thread.',
			'You want an agent that opens and stacks PRs and a review agent that comments on them, for a team of any size.'
		]
	},
	sources: [
		{ id: 'capy-home', title: 'Capy AI', url: 'https://capy.ai', publisher: 'Scrapybara', checked: '2026-10-10' },
		{ id: 'capy-download', title: 'Download Capy', url: 'https://capy.ai/download', publisher: 'Scrapybara', checked: '2026-10-10' },
		{ id: 'capy-pricing', title: 'Pricing', url: 'https://capy.ai/pricing', publisher: 'Scrapybara', checked: '2026-10-10' },
		{ id: 'capy-changelog', title: 'Changelog', url: 'https://capy.ai/changelog', publisher: 'Scrapybara', checked: '2026-10-10' },
		{ id: 'capy-blog', title: 'Blog', url: 'https://capy.ai/blog', publisher: 'Scrapybara', checked: '2026-10-10' },
		{ id: 'capy-integrations', title: 'Integrations', url: 'https://capy.ai/integrations', publisher: 'Scrapybara', checked: '2026-10-10' },
		{ id: 'capy-security', title: 'Security at Capy', url: 'https://capy.ai/security', publisher: 'Scrapybara', checked: '2026-10-10' },
		{ id: 'capy-terms', title: 'Terms of Service', url: 'https://capy.ai/terms-of-service', publisher: 'Scrapybara', checked: '2026-10-10' },
		{ id: 'capy-docs-welcome', title: 'Welcome', url: 'https://docs.capy.ai/welcome', publisher: 'Scrapybara', checked: '2026-10-10' },
		{ id: 'capy-models-pricing', title: 'Models & pricing', url: 'https://docs.capy.ai/models-and-pricing', publisher: 'Scrapybara', checked: '2026-10-10' },
		{ id: 'capy-billing', title: 'Billing', url: 'https://docs.capy.ai/admin/billing', publisher: 'Scrapybara', checked: '2026-10-10' },
		{ id: 'capy-admin-security', title: 'Security', url: 'https://docs.capy.ai/admin/security', publisher: 'Scrapybara', checked: '2026-10-10' },
		{ id: 'capy-machines', title: 'Machines', url: 'https://docs.capy.ai/machines', publisher: 'Scrapybara', checked: '2026-10-10' },
		{ id: 'capy-threads', title: 'Threads', url: 'https://docs.capy.ai/threads', publisher: 'Scrapybara', checked: '2026-10-10' },
		{ id: 'capy-subagents', title: 'Subagents', url: 'https://docs.capy.ai/subagents', publisher: 'Scrapybara', checked: '2026-10-10' },
		{ id: 'capy-environment', title: 'Environment', url: 'https://docs.capy.ai/environment', publisher: 'Scrapybara', checked: '2026-10-10' },
		{ id: 'capy-projects', title: 'Projects', url: 'https://docs.capy.ai/projects', publisher: 'Scrapybara', checked: '2026-10-10' },
		{ id: 'capy-skills', title: 'Skills', url: 'https://docs.capy.ai/skills', publisher: 'Scrapybara', checked: '2026-10-10' },
		{ id: 'capy-review', title: 'Reviews', url: 'https://docs.capy.ai/review', publisher: 'Scrapybara', checked: '2026-10-10' },
		{ id: 'capy-pull-requests', title: 'Pull requests', url: 'https://docs.capy.ai/pull-requests', publisher: 'Scrapybara', checked: '2026-10-10' },
		{ id: 'capy-github', title: 'GitHub', url: 'https://docs.capy.ai/integrations/github', publisher: 'Scrapybara', checked: '2026-10-10' },
		{ id: 'capy-linear', title: 'Linear', url: 'https://docs.capy.ai/integrations/linear', publisher: 'Scrapybara', checked: '2026-10-10' },
		{ id: 'capy-automations', title: 'Automations', url: 'https://docs.capy.ai/automations', publisher: 'Scrapybara', checked: '2026-10-10' },
		{ id: 'capy-api-overview', title: 'API reference', url: 'https://docs.capy.ai/api-reference/overview', publisher: 'Scrapybara', checked: '2026-10-10' },
		{ id: 'capy-linux', title: 'Install on Linux', url: 'https://docs.capy.ai/desktop-linux', publisher: 'Scrapybara', checked: '2026-10-10' }
	]
};
