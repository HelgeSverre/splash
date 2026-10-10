// Splash vs Factory App. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const FACTORY: Comparison = {
	slug: 'factory',
	name: 'Factory App',
	description: 'How Splash and the Factory App compare on agents, platforms, pricing, worktrees, cloud machines and review, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and the Factory App both run several coding-agent sessions at once, each in a project folder or its own git worktree. The Factory App runs Factory’s own agent, Droid, on your computer or on Factory-hosted Droid Computers, with a paid Factory plan. Splash, free and open source, drives many vendors’ agents over the Agent Client Protocol.',
	other: {
		name: 'Factory App',
		url: 'https://factory.com/product/desktop',
		maker: 'Factory',
		summary: 'Factory’s desktop and web workspace for its Droid agent, built to run several sessions at once, in git worktrees on your computer or Factory-hosted Droid Computers, with diffs, previews and inline feedback.',
		cite: ['factory-app-overview', 'factory-launch', 'factory-worktrees', 'factory-desktop']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app for Factory’s agent, Droid; its sessions also sync with a web app, mobile browsers and the Droid CLI', cite: ['factory-app-overview', 'factory-desktop', 'factory-welcome'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'Desktop 0.195.0 (10 October 2026), with new versions most weekdays; publicly launched in April 2026, generally available with no maturity tag', cite: ['factory-download', 'factory-changelog', 'factory-launch', 'factory-maturity'] } },
				{ label: 'License', splash: S.license, other: { text: 'Closed source; Factory’s public GitHub repository has a README and docs but no app source or license file', cite: ['factory-readme'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Monthly: Pro $20, Plus $100, Max $200; Teams $60 plus $40 a seat; Business and Enterprise custom; no free plan listed', cite: ['factory-pricing', 'factory-pricing-individuals', 'factory-pricing-orgs'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon and Intel) and Windows (x64 and ARM64); no Linux desktop build. The web app runs in any browser', cite: ['factory-quickstart', 'factory-welcome'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Factory’s own agent, Droid, on models Factory provides or your own (BYOK); other vendors’ agents aren’t documented in the app', cite: ['factory-app-overview', 'factory-byok'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Talks to a local Droid daemon over an undocumented protocol; Droid also acts as an ACP agent for Zed and JetBrains', cite: ['factory-changelog', 'factory-cli-reference', 'factory-ide'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Your Factory plan pays for model use under rolling rate limits; your own API keys or local models (BYOK) also work', cite: ['factory-pricing-individuals', 'factory-byok'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'A Factory account; onboarding asks for a card or a voucher. Enterprise airgap builds, not publicly distributed, skip sign-in', cite: ['factory-quickstart', 'factory-changelog', 'factory-airgap'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'MCP servers, Factory-managed connectors, skills, hooks and plugins, including plugins in Claude Code’s format', mark: 'yes', cite: ['factory-desktop', 'factory-connectors', 'factory-plugins'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A Factory-managed git worktree on a new or existing branch, locally or on a Droid Computer, or the project folder itself', mark: 'yes', cite: ['factory-worktrees'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Per-project profiles run a setup script, an initial prompt and a cleanup script; .worktreeinclude copies ignored files. Dev servers aren’t covered', mark: 'yes', cite: ['factory-worktrees'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'The sidebar bolds sessions waiting on a tool-call confirmation and can sort by status; native notifications when sessions finish', mark: 'yes', cite: ['factory-changelog'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Droid hands tasks to built-in or custom subagents; Missions run orchestrator, worker and validator agents, with Extra Usage on Individual plans', mark: 'yes', cite: ['factory-subagents', 'factory-missions-app', 'factory-pricing-individuals'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'Live sites, documents, spreadsheets and PDFs preview beside the session; Design mode picks an element and asks Droid to change it', mark: 'yes', cite: ['factory-desktop', 'factory-app-overview'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'A diff viewer with line comments Droid acts on, unstaged changes, and the PR’s GitHub comments beside the code', mark: 'yes', cite: ['factory-desktop', 'factory-app-overview', 'factory-changelog'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Droid opens PRs with a built-in Create-PR skill; sessions show linked PRs, and an Autofix PR button fixes their issues', mark: 'yes', cite: ['factory-changelog'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'GitHub (through a GitHub App) and GitLab via Factory’s Git integration, self-managed servers on Enterprise; a separate Droid Action reviews PRs', mark: 'yes', cite: ['factory-identity', 'factory-connectors', 'factory-self-managed-scm', 'factory-code-review-ci'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'Connectors for Linear, Jira, Jira Service Management, Monday and Teamwork.com; assigning work from Linear, Jira or Slack is in Private Preview', mark: 'yes', cite: ['factory-connectors', 'factory-delegations'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'Sessions and Missions can run on Factory-hosted Droid Computers; the docs include them in Pro, the pricing page in Plus', mark: 'yes', cite: ['factory-computers', 'factory-missions-app', 'factory-pricing-individuals', 'factory-pricing'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'Remote Control makes your Linux, macOS or Windows machine, the app’s own included, reachable via Factory’s relay with no inbound ports', mark: 'yes', cite: ['factory-remote-control'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'No native app is documented; the web app runs on phones and tablets, without BYOK custom models', mark: 'partial', cite: ['factory-welcome', 'factory-launch', 'factory-byok'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'In-app updates, found by a background check and installed with your consent; organizations can turn them off and push signed packages', mark: 'yes', cite: ['factory-msix'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Droid sessions from the CLI and IDE extension carry over; importing other agents’ conversations isn’t documented', mark: 'partial', cite: ['factory-launch'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Session search by title or message, run on Factory’s servers, plus lookup by session ID and Command-K search', mark: 'yes', cite: ['factory-changelog'] } },
				{ label: 'Fork a conversation', splash: S.fork, other: { text: 'Sessions fork from their sidebar row; /rewind-conversation takes the chat and your files back to an earlier point', mark: 'yes', cite: ['factory-changelog'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'The Factory App runs Factory’s own agent, Droid, through a local Droid daemon; its docs don’t cover other vendors’ agents in the app. Droid can reuse Claude Code subagents and plugins, and acts as an ACP agent for Zed and JetBrains. Splash starts each agent as a child process and speaks the <strong>Agent Client Protocol</strong> with it.',
			cite: ['factory-app-overview', 'factory-changelog', 'factory-subagents', 'factory-plugins', 'factory-ide', 'splash-readme', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'The Factory App runs on macOS and Windows, and as a web app in desktop and phone browsers. Sessions run on your computer, on a machine you link with Remote Control, or on Factory-hosted Droid Computers. Splash runs on macOS, Windows and Ubuntu, or as <code>splash-server</code> on the machine with your code, used in a browser over an SSH tunnel.',
			cite: ['factory-quickstart', 'factory-welcome', 'factory-launch', 'factory-remote-control', 'factory-computers', 'splash-install', 'splash-server']
		},
		{
			title: 'Price, accounts and license',
			text: 'The Factory App is closed source and needs a Factory account. Plans run from Pro at $20 a month to custom-priced Enterprise, and model use draws on plan credits under rolling rate limits, or on your own API keys. Splash is free and MIT-licensed, has no accounts, and runs each agent on that agent’s own login.',
			cite: ['factory-readme', 'factory-quickstart', 'factory-pricing', 'factory-pricing-individuals', 'factory-byok', 'splash-license', 'splash-download', 'splash-build', 'splash-agents']
		},
		{
			title: 'Around the session',
			text: 'The Factory App adds worktree setup profiles, previews with Design mode, Missions that coordinate orchestrator, worker and validator agents, PRs opened by a Droid skill, Linear and Jira connectors, and computer use that lets Droid operate other desktop apps. Splash centers on the conversations: a Needs attention queue, a review screen, transcript search, and importing sessions agents started elsewhere.',
			cite: ['factory-worktrees', 'factory-app-overview', 'factory-missions-app', 'factory-changelog', 'factory-connectors', 'factory-launch', 'splash-features', 'splash-history']
		}
	],
	fit: {
		splash: [
			'You want a free, MIT-licensed app that needs no account.',
			'You work on Ubuntu as well as macOS or Windows, or want to run sessions on your own server over SSH.',
			'You want Claude Code, Codex, Gemini and other vendors’ agents side by side, each on its own login.',
			'You want to import conversations your agents started outside the app and keep them with the rest.'
		],
		other: [
			'You want Factory’s Droid agent, paid for through one Factory plan or your own API keys.',
			'You want sessions on Factory-hosted Droid Computers or your own linked machines, reachable from a browser or phone.',
			'You want worktree setup profiles, live previews with Design mode, and Missions that spread a large project across agents.',
			'You want Droid to open pull requests and work with Linear or Jira through connectors.'
		]
	},
	sources: [
		{ id: 'factory-desktop', title: 'Factory Desktop', url: 'https://factory.com/product/desktop', publisher: 'Factory', checked: '2026-10-10' },
		{ id: 'factory-launch', title: 'The Factory Desktop App', url: 'https://factory.com/news/factory-desktop', publisher: 'Factory', checked: '2026-10-10' },
		{ id: 'factory-app-overview', title: 'Factory App', url: 'https://docs.factory.com/factory-app/overview', publisher: 'Factory', checked: '2026-10-10' },
		{ id: 'factory-quickstart', title: 'Factory App Quickstart', url: 'https://docs.factory.com/factory-app/quickstart', publisher: 'Factory', checked: '2026-10-10' },
		{ id: 'factory-worktrees', title: 'Worktrees in the Factory App', url: 'https://docs.factory.com/factory-app/worktrees', publisher: 'Factory', checked: '2026-10-10' },
		{ id: 'factory-welcome', title: 'Welcome to Factory', url: 'https://docs.factory.com/welcome', publisher: 'Factory', checked: '2026-10-10' },
		{ id: 'factory-changelog', title: 'Full Changelog', url: 'https://docs.factory.com/changelog/release-notes', publisher: 'Factory', checked: '2026-10-10' },
		{ id: 'factory-maturity', title: 'Feature Maturity', url: 'https://docs.factory.com/changelog/feature-maturity', publisher: 'Factory', checked: '2026-10-10' },
		{ id: 'factory-download', title: 'Factory App download (macOS Apple silicon)', url: 'https://app.factory.ai/api/desktop?platform=darwin&architecture=arm64', publisher: 'Factory', checked: '2026-10-10' },
		{ id: 'factory-readme', title: 'Factory-AI/factory README', url: 'https://github.com/Factory-AI/factory/blob/main/README.md', publisher: 'Factory-AI/factory on GitHub', checked: '2026-10-10' },
		{ id: 'factory-pricing', title: 'Pricing', url: 'https://factory.com/pricing', publisher: 'Factory', checked: '2026-10-10' },
		{ id: 'factory-pricing-individuals', title: 'Individual Plans', url: 'https://docs.factory.com/pricing/individuals', publisher: 'Factory', checked: '2026-10-10' },
		{ id: 'factory-pricing-orgs', title: 'Organization Plans', url: 'https://docs.factory.com/pricing/organizations', publisher: 'Factory', checked: '2026-10-10' },
		{ id: 'factory-subagents', title: 'Custom droids (subagents)', url: 'https://docs.factory.com/harness/subagents', publisher: 'Factory', checked: '2026-10-10' },
		{ id: 'factory-plugins', title: 'Plugins', url: 'https://docs.factory.com/harness/plugins', publisher: 'Factory', checked: '2026-10-10' },
		{ id: 'factory-connectors', title: 'Connectors', url: 'https://docs.factory.com/harness/connectors', publisher: 'Factory', checked: '2026-10-10' },
		{ id: 'factory-cli-reference', title: 'Droid CLI Reference', url: 'https://docs.factory.com/droid-cli/cli-reference', publisher: 'Factory', checked: '2026-10-10' },
		{ id: 'factory-ide', title: 'IDE Integrations', url: 'https://docs.factory.com/ide-integrations', publisher: 'Factory', checked: '2026-10-10' },
		{ id: 'factory-byok', title: 'Custom Models (BYOK)', url: 'https://docs.factory.com/model-independence/byok', publisher: 'Factory', checked: '2026-10-10' },
		{ id: 'factory-airgap', title: 'Airgapped Deployment', url: 'https://docs.factory.com/enterprise/airgapped-deployment', publisher: 'Factory', checked: '2026-10-10' },
		{ id: 'factory-missions-app', title: 'Running in the Factory App (Missions)', url: 'https://docs.factory.com/missions/running-app', publisher: 'Factory', checked: '2026-10-10' },
		{ id: 'factory-identity', title: 'Identity & Access', url: 'https://docs.factory.com/enterprise/identity-and-access', publisher: 'Factory', checked: '2026-10-10' },
		{ id: 'factory-self-managed-scm', title: 'Self-Managed Source Control', url: 'https://docs.factory.com/enterprise/self-managed-scm', publisher: 'Factory', checked: '2026-10-10' },
		{ id: 'factory-code-review-ci', title: 'Automated Code Review', url: 'https://docs.factory.com/software-factory/code-review-ci', publisher: 'Factory', checked: '2026-10-10' },
		{ id: 'factory-delegations', title: 'Delegations', url: 'https://docs.factory.com/delegations', publisher: 'Factory', checked: '2026-10-10' },
		{ id: 'factory-computers', title: 'Droid Computers', url: 'https://docs.factory.com/droid-computers/overview', publisher: 'Factory', checked: '2026-10-10' },
		{ id: 'factory-remote-control', title: 'Remote Control', url: 'https://docs.factory.com/remote-control', publisher: 'Factory', checked: '2026-10-10' },
		{ id: 'factory-msix', title: 'Deploy the Factory App on Windows', url: 'https://docs.factory.com/enterprise/windows-msix-deployment', publisher: 'Factory', checked: '2026-10-10' }
	]
};
