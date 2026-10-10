// Splash vs Agent Orchestrator. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const AGENT_ORCHESTRATOR: Comparison = {
	slug: 'agent-orchestrator',
	name: 'Agent Orchestrator',
	description: 'How Splash and Agent Orchestrator compare on agents, platforms, pricing, worktrees, pull requests and remote use, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Agent Orchestrator are desktop apps that run coding agents in parallel, each session able to use its own git worktree. Agent Orchestrator runs agents in their own terminal interfaces, or in Chat for some, adds a planning agent per project and follows pull requests through CI and review. Splash drives every agent over the Agent Client Protocol and renders a transcript.',
	other: {
		name: 'Agent Orchestrator',
		url: 'https://orchestrator.inc',
		maker: 'Orchestrator.inc',
		summary: 'A desktop app, built around a local Go daemon, for supervising third-party coding agents in their own worktrees, with a planning agent per project and pull requests followed through CI, review and merge.',
		cite: ['agent-orchestrator-docs', 'agent-orchestrator-architecture', 'agent-orchestrator-home', 'agent-orchestrator-repo']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Electron app over a local Go daemon, plus an optional ao CLI, iOS and Android companions and a waitlisted hosted Cloud', cite: ['agent-orchestrator-architecture', 'agent-orchestrator-cli', 'agent-orchestrator-installation', 'agent-orchestrator-waitlist'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v0.13.6 (9 October 2026), plus early-access Nightly builds that come out often; the docs are checked against v0.13.3', cite: ['agent-orchestrator-release', 'agent-orchestrator-download', 'agent-orchestrator-docs'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (Apache 2.0); the hosted Cloud’s web app is not in the public repository', cite: ['agent-orchestrator-repo', 'agent-orchestrator-faq', 'agent-orchestrator-cloud-readme'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free desktop app, CLI and phone apps; Cloud pricing is unpublished; a design-partner pilot for companies costs $500–2,000 a month', cite: ['agent-orchestrator-home', 'agent-orchestrator-download', 'agent-orchestrator-cloud', 'agent-orchestrator-design-partners'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon and Intel), Windows x64, Linux x64 (AppImage, .deb, .rpm); companions for iOS/iPadOS 16.4+ and Android', cite: ['agent-orchestrator-platforms', 'agent-orchestrator-download', 'agent-orchestrator-release', 'agent-orchestrator-app-store', 'agent-orchestrator-play'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: '35 harnesses in the docs catalog, 23 to 25 on the site, among them Claude Code, Codex, Gemini, Copilot and Cursor', cite: ['agent-orchestrator-agents', 'agent-orchestrator-home', 'agent-orchestrator-design-partners'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Agents’ own terminal UIs in a PTY the app hosts; 13 harnesses have Chat, mostly over ACP, Codex over its app-server', cite: ['agent-orchestrator-agents', 'agent-orchestrator-architecture', 'agent-orchestrator-claude-acp'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Uses the agent CLIs and logins already on your computer; each provider bills usage, and no API calls pass through Orchestrator', cite: ['agent-orchestrator-installation', 'agent-orchestrator-faq', 'agent-orchestrator-home'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'None for the local app; Cloud and remote hosts need sign-in to an Orchestrator account', cite: ['agent-orchestrator-home', 'agent-orchestrator-cloud', 'agent-orchestrator-remote-access', 'agent-orchestrator-self-hosted'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Chat shows approvals and structured questions, and a waiting session is marked Blocked; projects can store permission defaults, bypass included', mark: 'yes', cite: ['agent-orchestrator-dashboard', 'agent-orchestrator-projects', 'agent-orchestrator-2026-09-06'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A git worktree and branch per Git-backed session, kept under ~/.ao; multi-repo projects add child repos; Scratch sessions use plain folders', mark: 'yes', cite: ['agent-orchestrator-quickstart', 'agent-orchestrator-parallel', 'agent-orchestrator-workspaces'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Per-project Setup and Cleanup steps, env vars and symlinked files like .env; ao preview start runs one command from .ao/launch.json and shows it in the session browser', mark: 'yes', cite: ['agent-orchestrator-projects', 'agent-orchestrator-cli', 'agent-orchestrator-dashboard'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Board columns for Working, Needs you, In review and Ready to merge, plus a notification center, desktop alerts and phone pushes', mark: 'yes', cite: ['agent-orchestrator-home', 'agent-orchestrator-repo', 'agent-orchestrator-dashboard'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Each project has an orchestrator agent that breaks a plan into tasks, starts or redirects workers and follows their progress', mark: 'yes', cite: ['agent-orchestrator-repo', 'agent-orchestrator-home'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Automations on cron or RRULE schedules, with run history; they run while the app is open and the computer awake', mark: 'yes', cite: ['agent-orchestrator-automation'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'A per-session browser agents can drive, with DevTools, annotations sent to Chat and profile import from Chrome, Firefox or Safari', mark: 'yes', cite: ['agent-orchestrator-dashboard'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Files inspector for workspace or PR diffs; line comments go to the agent, batched since v0.13.5; reviewer agents add findings', mark: 'yes', cite: ['agent-orchestrator-dashboard', 'agent-orchestrator-v0-13-5', 'agent-orchestrator-review-loop'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'Files browses the whole workspace tree beside local and PR diffs; workspaces and files open in IDEs like Cursor through deep links', mark: 'yes', cite: ['agent-orchestrator-2026-08-30', 'agent-orchestrator-dashboard', 'agent-orchestrator-home'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Worker agents open PRs, and sessions can claim existing ones; Orchestrator tracks them and has a merge action but no auto-merge setting', mark: 'partial', cite: ['agent-orchestrator-quickstart', 'agent-orchestrator-faq', 'agent-orchestrator-automation'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'GitHub PRs and GitLab MRs: checks, reviewers, open comments and mergeability, with failing CI and review feedback routed to the agent', mark: 'yes', cite: ['agent-orchestrator-scm', 'agent-orchestrator-ci-recovery', 'agent-orchestrator-quickstart'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'Opt-in GitHub and GitLab issue intake, off by default, that doesn’t write back to issues; Linear isn’t supported, Jira isn’t documented', mark: 'partial', cite: ['agent-orchestrator-trackers', 'agent-orchestrator-github-intake'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'Waitlisted Cloud runs Claude Code, Codex, Cursor and OpenCode in hosted sandboxes, Coder-backed ones included; pricing is unpublished', mark: 'partial', cite: ['agent-orchestrator-cloud', 'agent-orchestrator-waitlist', 'agent-orchestrator-2026-09-27', 'agent-orchestrator-release'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'Experimental: the desktop connects to several self-hosted Linux or macOS hosts, with account sign-in; SSH workspaces aren’t documented', mark: 'partial', cite: ['agent-orchestrator-self-hosted', 'agent-orchestrator-remote-access', 'agent-orchestrator-v0-13-4'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'Free iOS/iPadOS and Android companions connect to your desktop over LAN, Tailscale (not currently on iPhone) or a Cloudflare tunnel; agents run there', mark: 'yes', cite: ['agent-orchestrator-remote-access', 'agent-orchestrator-app-store', 'agent-orchestrator-play', 'agent-orchestrator-download'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Desktop builds look for updates at launch and periodically while running', mark: 'yes', cite: ['agent-orchestrator-migration', 'agent-orchestrator-platforms'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented; ao import covers legacy Orchestrator projects, and a stopped agent can be resumed in its session', mark: 'unknown', cite: ['agent-orchestrator-migration', 'agent-orchestrator-projects'] } },
				{ label: 'Fork a conversation', splash: S.fork, other: { text: 'Claude Code Chat lets you edit a message and carry on in a conversation branch, keeping the original path', mark: 'partial', cite: ['agent-orchestrator-2026-08-30'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Not documented; the command palette finds actions, projects, sessions by title, PRs and, since v0.13.4, workspace files', mark: 'unknown', cite: ['agent-orchestrator-2026-07-26', 'agent-orchestrator-v0-13-4', 'agent-orchestrator-command-palette'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Agent Orchestrator runs harnesses’ own terminal interfaces in a PTY it hosts. Thirteen offer Chat, most over ACP (Claude Code through a bundled <code>claude-agent-acp</code> adapter), Codex over its app-server. Adapters are compiled into the app, so adding an agent means writing a Go adapter; there is no plugin install. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, natively or through a pinned adapter.',
			cite: ['agent-orchestrator-agents', 'agent-orchestrator-architecture', 'agent-orchestrator-claude-acp', 'agent-orchestrator-cli', 'agent-orchestrator-authoring', 'splash-registry', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'Agent Orchestrator’s daemon runs on your computer and listens on loopback. Phones pair with it over LAN, Tailscale or a Cloudflare tunnel, experimental remote hosts run it on another Linux or macOS machine, and a waitlisted Cloud runs agents in hosted sandboxes. Splash runs agents on your computer, or under <code>splash-server</code> on a machine you reach through an SSH tunnel.',
			cite: ['agent-orchestrator-architecture', 'agent-orchestrator-platforms', 'agent-orchestrator-remote-access', 'agent-orchestrator-self-hosted', 'agent-orchestrator-cloud', 'splash-readme', 'splash-server']
		},
		{
			title: 'Price, accounts and license',
			text: 'Agent Orchestrator is Apache-2.0 licensed and free to use locally with no account. Cloud and remote hosts need an Orchestrator sign-in, Cloud pricing is not published, the Cloud web app is not in the public repository, and companies can join a paid design-partner pilot. Splash is free, MIT-licensed and has no accounts.',
			cite: ['agent-orchestrator-faq', 'agent-orchestrator-home', 'agent-orchestrator-cloud', 'agent-orchestrator-self-hosted', 'agent-orchestrator-cloud-readme', 'agent-orchestrator-design-partners', 'splash-license', 'splash-download', 'splash-build']
		},
		{
			title: 'Around the session',
			text: 'Agent Orchestrator centers on the path to a merged pull request: a planning agent per project, a board of session states, reviewer agents, CI failures and review comments sent back to the worker, automations and a browser per session. Splash centers on the conversation: a transcript, a Needs attention queue, a review screen, transcript search and importing sessions started elsewhere.',
			cite: ['agent-orchestrator-repo', 'agent-orchestrator-home', 'agent-orchestrator-review-loop', 'agent-orchestrator-ci-recovery', 'agent-orchestrator-automation', 'agent-orchestrator-dashboard', 'splash-features', 'splash-history']
		},
		{
			title: 'Platforms and updates',
			text: 'Agent Orchestrator ships desktop builds for macOS, Windows x64 and Linux x64 that check for updates themselves, plus iOS/iPadOS and Android companion apps. Splash builds for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64 plus a headless server, has no phone app, and is updated by downloading a new release from GitHub.',
			cite: ['agent-orchestrator-platforms', 'agent-orchestrator-download', 'agent-orchestrator-migration', 'agent-orchestrator-app-store', 'agent-orchestrator-play', 'splash-install', 'splash-about']
		}
	],
	fit: {
		splash: [
			'You want every agent driven over the Agent Client Protocol, with its work shown as one transcript.',
			'You want to import conversations your agents started outside the app and search their text with the rest.',
			'You want to run sessions on your own server and use them from a browser over an SSH tunnel.',
			'You want a GitHub view of issues, pull requests and Actions runs across many repositories.'
		],
		other: [
			'You want a planning agent per project that splits goals into tasks and directs worker agents.',
			'You want pull requests followed through CI, reviewer agents and merge, with failures sent back to the agent.',
			'You want iPhone and Android companions, a browser per session and scheduled automations.',
			'You want setup and cleanup steps, env vars and dev-server previews per project, in an app that updates itself.'
		]
	},
	sources: [
		{ id: 'agent-orchestrator-home', title: 'Run Coding Agents in Parallel', url: 'https://orchestrator.inc/', publisher: 'Orchestrator.inc', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-download', title: 'Download', url: 'https://orchestrator.inc/download/', publisher: 'Orchestrator.inc', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-waitlist', title: 'Orchestrator.inc Cloud: coding agents that run in the cloud', url: 'https://orchestrator.inc/waitlist/', publisher: 'Orchestrator.inc', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-design-partners', title: 'Design Partner Program', url: 'https://orchestrator.inc/design-partners/', publisher: 'Orchestrator.inc', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-docs', title: 'Introduction', url: 'https://docs.orchestrator.inc/', publisher: 'Orchestrator.inc', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-architecture', title: 'Architecture', url: 'https://docs.orchestrator.inc/architecture/', publisher: 'Orchestrator.inc', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-installation', title: 'Installation', url: 'https://docs.orchestrator.inc/installation/', publisher: 'Orchestrator.inc', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-platforms', title: 'Platforms', url: 'https://docs.orchestrator.inc/platforms/', publisher: 'Orchestrator.inc', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-migration', title: 'Migration', url: 'https://docs.orchestrator.inc/migration/', publisher: 'Orchestrator.inc', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-faq', title: 'FAQ', url: 'https://docs.orchestrator.inc/faq/', publisher: 'Orchestrator.inc', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-cli', title: 'CLI reference', url: 'https://docs.orchestrator.inc/cli/', publisher: 'Orchestrator.inc', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-quickstart', title: 'Quickstart', url: 'https://docs.orchestrator.inc/quickstart/', publisher: 'Orchestrator.inc', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-dashboard', title: 'Dashboard', url: 'https://docs.orchestrator.inc/dashboard/', publisher: 'Orchestrator.inc', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-agents', title: 'Agent adapters', url: 'https://docs.orchestrator.inc/plugins/agents/', publisher: 'Orchestrator.inc', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-authoring', title: 'Adapter development', url: 'https://docs.orchestrator.inc/plugins/authoring/', publisher: 'Orchestrator.inc', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-workspaces', title: 'Workspaces', url: 'https://docs.orchestrator.inc/plugins/workspaces/', publisher: 'Orchestrator.inc', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-scm', title: 'Source control and pull requests', url: 'https://docs.orchestrator.inc/plugins/scm/', publisher: 'Orchestrator.inc', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-trackers', title: 'Issue tracking', url: 'https://docs.orchestrator.inc/plugins/trackers/', publisher: 'Orchestrator.inc', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-github-intake', title: 'GitHub issue intake', url: 'https://docs.orchestrator.inc/plugins/trackers/github/', publisher: 'Orchestrator.inc', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-projects', title: 'Projects', url: 'https://docs.orchestrator.inc/configuration/projects/', publisher: 'Orchestrator.inc', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-remote-access', title: 'Connect Mobile', url: 'https://docs.orchestrator.inc/configuration/remote-access/', publisher: 'Orchestrator.inc', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-automation', title: 'Automation reference', url: 'https://docs.orchestrator.inc/configuration/lifecycle-automation/', publisher: 'Orchestrator.inc', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-parallel', title: 'Parallel work', url: 'https://docs.orchestrator.inc/guides/parallel-issues/', publisher: 'Orchestrator.inc', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-review-loop', title: 'Review loop', url: 'https://docs.orchestrator.inc/guides/review-loop/', publisher: 'Orchestrator.inc', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-ci-recovery', title: 'CI recovery', url: 'https://docs.orchestrator.inc/guides/ci-recovery/', publisher: 'Orchestrator.inc', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-cloud', title: 'Cloud sessions', url: 'https://docs.orchestrator.inc/guides/cloud/', publisher: 'Orchestrator.inc', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-repo', title: 'OrchestratorInc/agent-orchestrator', url: 'https://github.com/OrchestratorInc/agent-orchestrator', publisher: 'OrchestratorInc/agent-orchestrator on GitHub', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-cloud-readme', title: 'AO Cloud README', url: 'https://github.com/OrchestratorInc/agent-orchestrator/blob/main/cloud/README.md', publisher: 'OrchestratorInc/agent-orchestrator on GitHub', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-self-hosted', title: 'Self-hosted remote hosts (experimental)', url: 'https://github.com/OrchestratorInc/agent-orchestrator/blob/main/docs/self-hosted-remote.md', publisher: 'OrchestratorInc/agent-orchestrator on GitHub', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-claude-acp', title: 'backend/internal/adapters/chatdriver/claudeacp/driver.go', url: 'https://github.com/OrchestratorInc/agent-orchestrator/blob/main/backend/internal/adapters/chatdriver/claudeacp/driver.go', publisher: 'OrchestratorInc/agent-orchestrator on GitHub', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-command-palette', title: 'frontend/src/renderer/lib/command-palette.ts', url: 'https://github.com/OrchestratorInc/agent-orchestrator/blob/main/frontend/src/renderer/lib/command-palette.ts', publisher: 'OrchestratorInc/agent-orchestrator on GitHub', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-release', title: 'Release v0.13.6', url: 'https://github.com/OrchestratorInc/agent-orchestrator/releases/tag/v0.13.6', publisher: 'OrchestratorInc/agent-orchestrator on GitHub', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-v0-13-5', title: 'v0.13.5', url: 'https://orchestrator.inc/changelog/v0-13-5/', publisher: 'Orchestrator.inc', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-v0-13-4', title: 'v0.13.4', url: 'https://orchestrator.inc/changelog/v0-13-4/', publisher: 'Orchestrator.inc', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-2026-09-27', title: 'AO Mobile v2.0.0, scheduled automations, and visible context limits', url: 'https://orchestrator.inc/changelog/2026-09-27-weekly-update/', publisher: 'Orchestrator.inc', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-2026-09-06', title: 'Account switching, browser profiles, and permission defaults', url: 'https://orchestrator.inc/changelog/2026-09-06-weekly-update/', publisher: 'Orchestrator.inc', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-2026-08-30', title: 'Cost estimates, editable chat, and full workspace files', url: 'https://orchestrator.inc/changelog/2026-08-30-weekly-update/', publisher: 'Orchestrator.inc', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-2026-07-26', title: 'Mobile alerts, standalone terminals, and a more capable browser', url: 'https://orchestrator.inc/changelog/2026-07-26-weekly-update/', publisher: 'Orchestrator.inc', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-app-store', title: 'AO - Mobile', url: 'https://apps.apple.com/app/ao-mobile/id6792552173', publisher: 'Apple App Store', checked: '2026-10-10' },
		{ id: 'agent-orchestrator-play', title: 'AO - Mobile', url: 'https://play.google.com/store/apps/details?id=aoagents.dev', publisher: 'Google Play', checked: '2026-10-10' }
	]
};
