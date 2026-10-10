// Splash vs HumanLayer (formerly CodeLayer). Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const CODELAYER: Comparison = {
	slug: 'codelayer',
	name: 'HumanLayer',
	description: 'How Splash and HumanLayer, formerly CodeLayer, compare on agents, platforms, pricing, worktrees, review and remote daemons, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and HumanLayer both run several coding agents at once and can give each piece of work its own git worktree. HumanLayer, which succeeds the open-source CodeLayer IDE, is a closed-source team workspace whose daemons run Claude Code and Codex and sync through its cloud. Splash is a free, open-source desktop app that drives agents over the Agent Client Protocol.',
	other: {
		name: 'HumanLayer',
		url: 'https://www.humanlayer.com/',
		maker: 'HumanLayer',
		summary: 'A closed-source team workspace that runs Claude Code and Codex sessions in git worktrees on daemons on your Mac or other hosts, synced through HumanLayer’s cloud to desktop, web and phone.',
		cite: ['codelayer-home', 'codelayer-faq-oss', 'codelayer-remote-daemons-explained', 'codelayer-skills-workflows']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app with a local daemon, plus remote daemons, a web app and a CLI, synced through HumanLayer’s cloud', cite: ['codelayer-home', 'codelayer-remote-daemons-explained', 'codelayer-npm-cli'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: '0.182.0 (9 October 2026), with releases every few days; many features arrive as alpha, experimental or early access', cite: ['codelayer-release-notes', 'codelayer-cask'] } },
				{ label: 'License', splash: S.license, other: { text: 'Closed source; the RPI skills, AgentLayer and Fold are MIT. The earlier open-source CodeLayer code is Apache 2.0 and deprecated', cite: ['codelayer-faq-oss', 'codelayer-skills-license', 'codelayer-agentlayer-license', 'codelayer-fold-license', 'codelayer-legacy-readme-2025', 'codelayer-legacy-readme', 'codelayer-legacy-license'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Starter: free for up to 3 members and 200 sessions a month. Pro: $100 per user a month. Enterprise: custom', cite: ['codelayer-pricing'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'Apple silicon Mac app; CLI daemon for macOS, Linux and Windows. Release notes mention a Linux app with no documented download', cite: ['codelayer-quickstart', 'codelayer-cask', 'codelayer-release-notes', 'codelayer-npm-cli', 'codelayer-remote-daemon-tutorial'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'The docs cover Claude Code and Codex; the FAQ also lists Copilot and Fireworks. An experimental Fold agent runs Grok models', cite: ['codelayer-quickstart', 'codelayer-codex', 'codelayer-faq-models', 'codelayer-release-notes'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'A daemon runs Claude Code through the Claude Agent SDK and Codex through HumanLayer’s own CodeLayer harness', cite: ['codelayer-remote-daemons-explained', 'codelayer-release-notes', 'codelayer-subagent-models'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Your Claude Code login, a Codex sign-in through the HumanLayer CLI, or Bedrock, Azure or OpenAI keys; no per-token HumanLayer bill', cite: ['codelayer-quickstart', 'codelayer-codex', 'codelayer-bedrock', 'codelayer-faq-byok'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'Yes; the app opens a browser sign-in at first launch, and remote daemons use humanlayer login or a launch token', cite: ['codelayer-quickstart', 'codelayer-remote-daemon-tutorial', 'codelayer-remote-daemons-explained'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Sessions can wait on tool approvals, which teammates may answer in shared sessions; automation runs skip the prompts', mark: 'yes', cite: ['codelayer-remote-daemons-explained', 'codelayer-release-notes', 'codelayer-automation'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Sessions connect MCP servers, OAuth ones included, and install plugins before the agent starts, from the launch directory’s config', mark: 'yes', cite: ['codelayer-release-notes', 'codelayer-workspace-model'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A git worktree per task, one per repo in multi-repo workspaces, or the current checkout; no sandbox is documented', mark: 'yes', cite: ['codelayer-skills-workflows', 'codelayer-workspace-model', 'codelayer-workspace-config', 'codelayer-remote-daemons-explained'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'A setupCommand runs in each new worktree after listed files such as .env are copied; dev servers and ports aren’t documented', mark: 'yes', cite: ['codelayer-workspace-config'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'A notification bell keeps sessions that need you until you act; session tables show states such as idle or usage limit', mark: 'yes', cite: ['codelayer-release-notes'] } },
				{
					label: 'Team collaboration',
					hint: 'Several people on the same work',
					splash: { text: 'splash-server is a personal, single-user service, not a multi-user deployment', mark: 'no', cite: ['splash-server'] },
					other: { text: 'Tasks are shared with your organization; admins can let teammates prompt, interrupt and answer approvals in a running session', mark: 'yes', cite: ['codelayer-release-notes'] }
				},
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: '/hl:orchestrate lets an agent create tasks in separate worktrees and start sessions; a session can move between Claude Code and Codex', mark: 'yes', cite: ['codelayer-release-notes'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Through the CLI: humanlayer automation run starts one session on a short-lived daemon when a CI job, cron entry or script calls it', mark: 'partial', cite: ['codelayer-automation'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Comment threads on diffs and on research, design and plan documents go back to the agent; files can be marked reviewed', mark: 'yes', cite: ['codelayer-release-notes', 'codelayer-home'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'The /rpi:describe-pr skill opens or updates the PR, watches its checks and fixes failures it caused', mark: 'yes', cite: ['codelayer-skills-reference', 'codelayer-release-notes'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Tasks from GitHub issues; an experimental tab shows PR status and checks, merges PRs and sends failing checks to the agent', mark: 'yes', cite: ['codelayer-github-integration', 'codelayer-release-notes'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'Creates tasks from Linear, Jira Cloud and GitHub issues, and syncs Linear status with the workflow; GitLab isn’t documented', mark: 'yes', cite: ['codelayer-linear', 'codelayer-jira', 'codelayer-github-integration'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'No HumanLayer-hosted sessions are documented; daemons run on machines you provide, like cloud VMs, and Enterprise lists on-prem or private VPC', mark: 'no', cite: ['codelayer-remote-daemons-explained', 'codelayer-pricing'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'Remote daemons run sessions on a cloud VM, workstation or private machine, driven from app.humanlayer.com on a computer or phone', mark: 'yes', cite: ['codelayer-remote-daemons-explained', 'codelayer-remote-daemon-tutorial'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'No native app is documented; the web app works on a phone, and its mobile UI started as an early-access preview', mark: 'partial', cite: ['codelayer-remote-daemons-explained', 'codelayer-release-notes'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Alpha plugins mirror pi and OpenCode sessions from their first linked prompt; importing Claude Code or Codex sessions isn’t documented', mark: 'partial', cite: ['codelayer-pi', 'codelayer-opencode', 'codelayer-release-notes'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Not documented; the ⌘K launcher jumps to sessions and lists the three most recently active', mark: 'unknown', cite: ['codelayer-release-notes', 'codelayer-home'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'HumanLayer’s daemon runs Claude Code through the Claude Agent SDK and Codex through its own CodeLayer harness. The homepage speaks of bringing your own agent harness, but the docs describe no way to add another CLI or ACP agent. Splash talks to every agent over the <strong>Agent Client Protocol</strong>, natively or through an adapter.',
			cite: ['codelayer-release-notes', 'codelayer-subagent-models', 'codelayer-home', 'splash-registry', 'acp']
		},
		{
			title: 'Where sessions run',
			text: 'HumanLayer’s desktop daemon and remote daemons both receive work and send session events through HumanLayer’s API, and a remote daemon needs outbound HTTPS to its API and sync hosts. The cloud also stores Codex conversations and the task files agents read or write; no offline mode is documented. Model calls go straight to the provider. Splash runs agents as child processes on your computer or under <code>splash-server</code> on your server.',
			cite: ['codelayer-remote-daemons-explained', 'codelayer-home', 'codelayer-tasks', 'codelayer-llm-gateways', 'splash-readme', 'splash-server']
		},
		{
			title: 'Teams and structured workflows',
			text: 'HumanLayer is built for teams: tasks are shared across the organization, admins can let teammates prompt running sessions, and people and agents comment on research, design and plan documents between workflow phases. Splash centers on one person’s sessions: <code>splash-server</code> serves a single user, and work is checked in a review screen and a Needs attention queue.',
			cite: ['codelayer-release-notes', 'codelayer-home', 'codelayer-skills-workflows', 'splash-server', 'splash-features']
		},
		{
			title: 'Around the session',
			text: 'HumanLayer connects tasks to Linear, Jira and GitHub issues, opens and follows pull requests through its <code>/rpi:describe-pr</code> skill, posts updates to Slack and runs sessions from CI jobs through its CLI. Splash’s tools center on the conversations: importing sessions agents started elsewhere, full-text transcript search, and a GitHub view of issues, pull requests and Actions runs across repositories.',
			cite: ['codelayer-linear', 'codelayer-jira', 'codelayer-github-integration', 'codelayer-skills-reference', 'codelayer-slack', 'codelayer-automation', 'splash-features', 'splash-history', 'splash-github']
		},
		{
			title: 'Price, license and platforms',
			text: 'HumanLayer is closed source, needs an account and charges per seat: Starter is free for up to three people and 200 sessions a month, Pro is $100 per user a month. Its documented desktop download is for Apple silicon Macs, and a CLI daemon covers Linux and Windows. Splash is free, MIT-licensed and account-free, with builds for macOS, Windows and Ubuntu.',
			cite: ['codelayer-faq-oss', 'codelayer-quickstart', 'codelayer-pricing', 'codelayer-npm-cli', 'splash-license', 'splash-download', 'splash-build', 'splash-install']
		}
	],
	fit: {
		splash: [
			'You want a free, MIT-licensed app that needs no account or hosted service.',
			'You want the desktop app on Windows, Ubuntu or an Intel Mac as well as Apple silicon.',
			'You want to start Gemini, OpenCode, Goose and other agents beside Claude Code and Codex, all over ACP.',
			'You want to import conversations your agents started elsewhere and search every transcript.'
		],
		other: [
			'You work in a team that shares tasks, comments on plans together and steps into each other’s sessions.',
			'You want research, design and plan stages with review points before an agent changes code.',
			'You want tasks created from Linear, Jira or GitHub issues, and pull requests opened and followed for you.',
			'You want sessions on remote daemons that you follow and prompt from a browser or a phone.'
		]
	},
	sources: [
		{ id: 'codelayer-home', title: 'The multiplayer control plane for your software factory', url: 'https://www.humanlayer.com/', publisher: 'HumanLayer', checked: '2026-10-10' },
		{ id: 'codelayer-pricing', title: 'Pricing', url: 'https://www.humanlayer.com/#pricing', publisher: 'HumanLayer', checked: '2026-10-10' },
		{ id: 'codelayer-faq-oss', title: 'FAQ: Is HumanLayer open source?', url: 'https://www.humanlayer.com/#faq-oss', publisher: 'HumanLayer', checked: '2026-10-10' },
		{ id: 'codelayer-faq-models', title: 'FAQ: Which agents and models are supported?', url: 'https://www.humanlayer.com/#faq-models', publisher: 'HumanLayer', checked: '2026-10-10' },
		{ id: 'codelayer-faq-byok', title: 'FAQ: Do I bring my own AI subscription, or pay for tokens?', url: 'https://www.humanlayer.com/#faq-byok', publisher: 'HumanLayer', checked: '2026-10-10' },
		{ id: 'codelayer-quickstart', title: 'Quickstart: Running a HumanLayer Task', url: 'https://docs.humanlayer.com/tutorials/first-session', publisher: 'HumanLayer', checked: '2026-10-10' },
		{ id: 'codelayer-remote-daemons-explained', title: 'How Remote Daemons Work', url: 'https://docs.humanlayer.com/explanation/remote-daemons', publisher: 'HumanLayer', checked: '2026-10-10' },
		{ id: 'codelayer-remote-daemon-tutorial', title: 'Run a Task on a Remote Daemon', url: 'https://docs.humanlayer.com/tutorials/remote-daemon', publisher: 'HumanLayer', checked: '2026-10-10' },
		{ id: 'codelayer-release-notes', title: 'Release Notes', url: 'https://docs.humanlayer.com/release-notes', publisher: 'HumanLayer', checked: '2026-10-10' },
		{ id: 'codelayer-subagent-models', title: 'Sub-agent models and effort', url: 'https://docs.humanlayer.com/reference/subagent-models', publisher: 'HumanLayer', checked: '2026-10-10' },
		{ id: 'codelayer-codex', title: 'Set Up Codex CLI', url: 'https://docs.humanlayer.com/guide/codex', publisher: 'HumanLayer', checked: '2026-10-10' },
		{ id: 'codelayer-bedrock', title: 'Claude on AWS Bedrock', url: 'https://docs.humanlayer.com/guide/bedrock', publisher: 'HumanLayer', checked: '2026-10-10' },
		{ id: 'codelayer-llm-gateways', title: 'Route Models Through an LLM Gateway', url: 'https://docs.humanlayer.com/guide/llm-gateways', publisher: 'HumanLayer', checked: '2026-10-10' },
		{ id: 'codelayer-automation', title: 'Run HumanLayer Sessions in Automations', url: 'https://docs.humanlayer.com/guide/automation-sessions', publisher: 'HumanLayer', checked: '2026-10-10' },
		{ id: 'codelayer-skills-workflows', title: 'Run a workflow in HumanLayer', url: 'https://docs.humanlayer.com/guide/skills-workflows', publisher: 'HumanLayer', checked: '2026-10-10' },
		{ id: 'codelayer-skills-reference', title: 'Skills and workflows reference', url: 'https://docs.humanlayer.com/reference/skills-workflows', publisher: 'HumanLayer', checked: '2026-10-10' },
		{ id: 'codelayer-workspace-model', title: 'How workspace configuration works', url: 'https://docs.humanlayer.com/explanation/workspace-model', publisher: 'HumanLayer', checked: '2026-10-10' },
		{ id: 'codelayer-workspace-config', title: 'Workspace config reference', url: 'https://docs.humanlayer.com/reference/workspace-config', publisher: 'HumanLayer', checked: '2026-10-10' },
		{ id: 'codelayer-tasks', title: 'How HumanLayer tasks keep related work together', url: 'https://docs.humanlayer.com/explanation/tasks', publisher: 'HumanLayer', checked: '2026-10-10' },
		{ id: 'codelayer-linear', title: 'Connect Linear and Run Ticket Workflows', url: 'https://docs.humanlayer.com/guide/linear-integration', publisher: 'HumanLayer', checked: '2026-10-10' },
		{ id: 'codelayer-jira', title: 'Connect Jira and Create Tasks from Tickets', url: 'https://docs.humanlayer.com/guide/jira-integration', publisher: 'HumanLayer', checked: '2026-10-10' },
		{ id: 'codelayer-github-integration', title: 'Connect GitHub and Create Tasks from Issues', url: 'https://docs.humanlayer.com/guide/github-integration', publisher: 'HumanLayer', checked: '2026-10-10' },
		{ id: 'codelayer-slack', title: 'Send HumanLayer Updates to Slack', url: 'https://docs.humanlayer.com/guide/slack-integration', publisher: 'HumanLayer', checked: '2026-10-10' },
		{ id: 'codelayer-npm-cli', title: '@humanlayer/cli package metadata', url: 'https://registry.npmjs.org/@humanlayer/cli/latest', publisher: 'npm', checked: '2026-10-10' },
		{ id: 'codelayer-cask', title: 'Casks/humanlayer.rb', url: 'https://github.com/humanlayer/homebrew-humanlayer/blob/main/Casks/humanlayer.rb', publisher: 'humanlayer/homebrew-humanlayer on GitHub', checked: '2026-10-10' },
		{ id: 'codelayer-legacy-readme', title: 'README.md', url: 'https://github.com/humanlayer/humanlayer/blob/main/README.md', publisher: 'humanlayer/humanlayer on GitHub', checked: '2026-10-10' },
		{ id: 'codelayer-legacy-readme-2025', title: 'README.md (September 2025 revision)', url: 'https://github.com/humanlayer/humanlayer/blob/69f67a6/README.md', publisher: 'humanlayer/humanlayer on GitHub', checked: '2026-10-10' },
		{ id: 'codelayer-legacy-license', title: 'LICENSE', url: 'https://github.com/humanlayer/humanlayer/blob/main/LICENSE', publisher: 'humanlayer/humanlayer on GitHub', checked: '2026-10-10' },
		{ id: 'codelayer-skills-license', title: 'LICENSE', url: 'https://github.com/humanlayer/skills/blob/main/LICENSE', publisher: 'humanlayer/skills on GitHub', checked: '2026-10-10' },
		{ id: 'codelayer-agentlayer-license', title: 'LICENSE', url: 'https://github.com/humanlayer/agentlayer/blob/main/LICENSE', publisher: 'humanlayer/agentlayer on GitHub', checked: '2026-10-10' },
		{ id: 'codelayer-fold-license', title: 'LICENSE', url: 'https://github.com/humanlayer/fold/blob/main/LICENSE', publisher: 'humanlayer/fold on GitHub', checked: '2026-10-10' },
		{ id: 'codelayer-pi', title: 'pi-humanlayer README', url: 'https://github.com/humanlayer/humanlayer-pi/blob/main/README.md', publisher: 'humanlayer/humanlayer-pi on GitHub', checked: '2026-10-10' },
		{ id: 'codelayer-opencode', title: 'opencode-humanlayer README', url: 'https://github.com/humanlayer/humanlayer-opencode/blob/main/README.md', publisher: 'humanlayer/humanlayer-opencode on GitHub', checked: '2026-10-10' }
	]
};
