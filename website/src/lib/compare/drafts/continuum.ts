// Splash vs Continuum. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const CONTINUUM: Comparison = {
	slug: 'continuum',
	name: 'Continuum',
	description: 'How Splash and Continuum compare on agents, platforms, pricing, worktrees, review and remote use, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Continuum both run several coding agents at once, each session in the project folder or its own git worktree. Continuum separates hosts that run agents (Mac, Windows, Linux, servers, its cloud) from phone, Watch and web apps that steer them. Splash is a desktop app, plus a headless server, that drives every agent over the Agent Client Protocol.',
	other: {
		name: 'Continuum',
		url: 'https://continuumcode.ai',
		maker: 'Montauk Analytics',
		summary: 'A free app for steering coding agents. Mac, Windows, Linux and CLI hosts run Claude Code, Codex, Cursor, Grok and others in git worktrees, while phone, Watch and web apps steer them.',
		cite: ['continuum-docs', 'continuum-providers', 'continuum-sessions', 'continuum-mobile']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Native Mac app, Electron Windows and Linux apps and a CLI run agents; phone, Watch and web apps steer them', cite: ['continuum-docs', 'continuum-desktop', 'continuum-mobile', 'continuum-web'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'Mac app 0.97.8 (6 October 2026) and the iPhone app are stable; Windows, Linux and the CLI are beta', cite: ['continuum-changelog', 'continuum-release-mac', 'continuum-download', 'continuum-install'] } },
				{ label: 'License', splash: S.license, other: { text: 'No license or app source is published; its public GitHub repository holds the update feed and installers', cite: ['continuum-updates-repo'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free on every client; optional hosted-inference plans cost $25 to $500 a month, or from $25 per member for organizations', cite: ['continuum-pricing', 'continuum-hosted'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'Apple silicon on macOS 26 (Intel in beta), Windows 10/11 x64, Linux x64 and arm64; iOS, Watch, Android and web remotes', cite: ['continuum-install', 'continuum-appcast', 'continuum-release-unified', 'continuum-mobile'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code, Codex, Antigravity (Gemini), Cursor, Grok and OpenCode CLIs, plus OpenRouter, Z.ai, hosted models and custom compatible endpoints', cite: ['continuum-providers', 'continuum-changelog'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Varies by provider: ACP for Claude (default), Cursor and Grok; codex app-server for Codex; per-turn headless runs for Antigravity; opencode serve', cite: ['continuum-providers', 'continuum-claude', 'continuum-codex', 'continuum-cursor', 'continuum-grok', 'continuum-antigravity', 'continuum-openrouter'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Your own CLI logins and keys, billed by each provider, or paid hosted models; connected accounts sync across hosts and Cloud', cite: ['continuum-faq', 'continuum-providers', 'continuum-hosted', 'continuum-changelog'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'Optional for one host used locally; the web app, phones and linking devices need email sign-in', cite: ['continuum-faq', 'continuum-remote-devices'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Plan mode shows inline approve or deny prompts; Code mode runs every provider without approvals, and Cursor always runs that way', mark: 'partial', cite: ['continuum-plan-mode', 'continuum-cursor'] } },
				{ label: 'Usage and cost', hint: 'Spend, tokens and quotas', splash: { text: 'Context and cost readouts when the agent reports them', mark: 'yes', cite: ['splash-features'] }, other: { text: 'Spend and tokens by provider, day and repo, parsed locally from CLI logs, with live quota gauges per account', mark: 'yes', cite: ['continuum-analytics'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A git worktree on its own branch, or the main checkout in Local mode; Cloud sessions get a managed sandbox', mark: 'yes', cite: ['continuum-sessions', 'continuum-remote-devices'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Each session copies ignored .env-style files and runs the repo’s setup script; Preview runs dev scripts. No port allocation is documented', mark: 'yes', cite: ['continuum-mobile', 'continuum-autopilot'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'A multi-pane shell in the session folder, plus Spawn mode: a grid of up to eight agent CLIs in real terminals', mark: 'yes', cite: ['continuum-code', 'continuum-spawn', 'continuum-changelog'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Desktop notifications, an attention badge and chimes, a shortcut to the next session needing you, and a sidebar status filter', mark: 'yes', cite: ['continuum-desktop', 'continuum-shortcuts', 'continuum-code'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Live diff of staged, unstaged and untracked changes with per-hunk stage, unstage and revert, and a commit sheet', mark: 'yes', cite: ['continuum-diffs'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Create PR has the agent open one, drafts included; Merge shows when checks pass or haven’t reported, using gh', mark: 'yes', cite: ['continuum-diffs'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'PR state, review decision and CI checks through gh on the host; GitHub review threads appear on Mac diff lines', mark: 'yes', cite: ['continuum-diffs', 'continuum-code'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'Per a June 2026 changelog, a pasted GitHub or Linear issue URL becomes context; current docs mention neither this nor Jira', mark: 'partial', cite: ['continuum-changelog'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'Managed cloud sandboxes the docs tie to hosted-inference plans; an August 2026 changelog says every account gets 300 minutes weekly', mark: 'partial', cite: ['continuum-remote-devices', 'continuum-cloud', 'continuum-changelog'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'Sessions run on enrolled hosts such as a second Mac or a Linux server; signed-in devices steer them via Continuum’s relay', mark: 'yes', cite: ['continuum-remote-devices', 'continuum-faq'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'iPhone and Apple Watch apps with push alerts for approvals and questions, and an Android early preview; all steer a host', mark: 'yes', cite: ['continuum-mobile', 'continuum-app-store', 'continuum-play'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'An in-app browser for GitHub and local dev servers; Preview’s Comment and Edit modes add element notes to your next prompt', mark: 'yes', cite: ['continuum-code'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'The Mac app updates from a Sparkle feed; desktop releases ship electron-updater metadata', mark: 'yes', cite: ['continuum-updates-repo', 'continuum-release-desktop'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Sessions started outside the app', splash: S.history, other: { text: 'The sidebar lists sessions Continuum itself spawned; views of sessions started elsewhere were removed, and no import is documented', mark: 'no', cite: ['continuum-code', 'continuum-sessions'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'A sidebar search field; the Code page says it matches transcript text, while the Sessions page says session titles', mark: 'partial', cite: ['continuum-code', 'continuum-sessions'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Continuum picks a transport per provider: ACP for Claude by default and for Cursor and Grok, <code>codex app-server</code> for Codex, per-turn headless runs of <code>agy</code>, and a shared <code>opencode serve</code> process for OpenCode, OpenRouter and Z.ai. Its Spawn mode also runs agents’ own CLIs in terminals. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, natively or via an adapter.',
			cite: ['continuum-providers', 'continuum-claude', 'continuum-codex', 'continuum-cursor', 'continuum-grok', 'continuum-antigravity', 'continuum-openrouter', 'continuum-spawn', 'splash-registry', 'acp']
		},
		{
			title: 'Hosts and remotes',
			text: 'Continuum separates hosts that run agents and hold the code (Mac, Windows, Linux, the CLI, enrolled servers, Continuum Cloud) from remotes that steer them (iPhone, Watch, Android, the web app), connected through a relay that needs a Continuum account. Splash runs agents on your computer, or under <code>splash-server</code> on a machine you open in a browser through an SSH tunnel.',
			cite: ['continuum-docs', 'continuum-remote-devices', 'continuum-web', 'continuum-faq', 'splash-readme', 'splash-server']
		},
		{
			title: 'Price, accounts and data',
			text: 'Continuum is free with your own provider accounts and sells optional hosted inference; it publishes no license or source code. A single local host needs no account; signing in syncs connected provider accounts and recent transcripts to Continuum’s cloud, encrypted at rest but not end to end. Splash is free, MIT-licensed and has no accounts.',
			cite: ['continuum-pricing', 'continuum-hosted', 'continuum-updates-repo', 'continuum-faq', 'continuum-changelog', 'continuum-privacy-docs', 'splash-license', 'splash-download', 'splash-build']
		},
		{
			title: 'Around the session',
			text: 'Continuum adds steps around the agent: setup scripts, copied .env files, a Preview browser, Create PR and Merge, <strong>Auto</strong> routing that splits work among planner, executor and verifier models, and spend and quota gauges. Its Code mode runs agents without approval prompts. Splash centers on the conversation: a <strong>Needs attention</strong> queue, a review screen, transcript search and importing outside history.',
			cite: ['continuum-mobile', 'continuum-autopilot', 'continuum-code', 'continuum-diffs', 'continuum-quickstart', 'continuum-analytics', 'continuum-plan-mode', 'splash-features', 'splash-history']
		},
		{
			title: 'Platforms',
			text: 'Continuum’s Mac app needs Apple silicon and macOS 26 per its docs, with a beta build for Intel; its Windows (x64) and Linux apps are Electron betas; iPhone, Watch, Android and web clients steer a host. Splash builds for macOS 14+ on Apple silicon and Intel, Windows 11 x64 and Ubuntu 24.04 x64, with no phone app.',
			cite: ['continuum-install', 'continuum-appcast', 'continuum-release-unified', 'continuum-desktop', 'continuum-mobile', 'splash-install']
		}
	],
	fit: {
		splash: [
			'You want a free, MIT-licensed app with published source and no accounts.',
			'You want every agent driven over the Agent Client Protocol, with permission requests gathered in one Needs attention queue.',
			'You want to import conversations your agents started outside the app and search them with the rest.',
			'You want a desktop app for macOS 14 and later, Windows 11 and Ubuntu, or a server you reach over SSH.'
		],
		other: [
			'You want to steer sessions from an iPhone, Apple Watch, Android phone or browser while agents run on your Mac, desktop or Linux server.',
			'You want setup scripts, a Preview browser for dev servers, and pull request creation and merging inside the app.',
			'You want spend, token and quota tracking across providers, with several accounts per provider.',
			'You want the option of paid hosted models or sessions in Continuum Cloud alongside your own provider accounts.'
		]
	},
	sources: [
		{ id: 'continuum-docs', title: 'What is Continuum?', url: 'https://continuumcode.ai/docs', publisher: 'Montauk Analytics', checked: '2026-10-10' },
		{ id: 'continuum-providers', title: 'Providers', url: 'https://continuumcode.ai/docs/providers/overview', publisher: 'Montauk Analytics', checked: '2026-10-10' },
		{ id: 'continuum-sessions', title: 'Sessions', url: 'https://continuumcode.ai/docs/features/sessions', publisher: 'Montauk Analytics', checked: '2026-10-10' },
		{ id: 'continuum-mobile', title: 'Mobile & Watch', url: 'https://continuumcode.ai/docs/surfaces/mobile', publisher: 'Montauk Analytics', checked: '2026-10-10' },
		{ id: 'continuum-desktop', title: 'Windows & Linux', url: 'https://continuumcode.ai/docs/surfaces/desktop', publisher: 'Montauk Analytics', checked: '2026-10-10' },
		{ id: 'continuum-web', title: 'Web App', url: 'https://continuumcode.ai/docs/surfaces/web', publisher: 'Montauk Analytics', checked: '2026-10-10' },
		{ id: 'continuum-code', title: 'Code', url: 'https://continuumcode.ai/docs/surfaces/code', publisher: 'Montauk Analytics', checked: '2026-10-10' },
		{ id: 'continuum-install', title: 'Installation', url: 'https://continuumcode.ai/docs/installation', publisher: 'Montauk Analytics', checked: '2026-10-10' },
		{ id: 'continuum-download', title: 'Download', url: 'https://continuumcode.ai/download', publisher: 'Montauk Analytics', checked: '2026-10-10' },
		{ id: 'continuum-pricing', title: 'Pricing', url: 'https://continuumcode.ai/pricing', publisher: 'Montauk Analytics', checked: '2026-10-10' },
		{ id: 'continuum-hosted', title: 'Hosted Inference & Billing', url: 'https://continuumcode.ai/docs/features/hosted-inference', publisher: 'Montauk Analytics', checked: '2026-10-10' },
		{ id: 'continuum-faq', title: 'FAQ', url: 'https://continuumcode.ai/docs/reference/faq', publisher: 'Montauk Analytics', checked: '2026-10-10' },
		{ id: 'continuum-claude', title: 'Claude Code', url: 'https://continuumcode.ai/docs/providers/claude', publisher: 'Montauk Analytics', checked: '2026-10-10' },
		{ id: 'continuum-codex', title: 'Codex', url: 'https://continuumcode.ai/docs/providers/codex', publisher: 'Montauk Analytics', checked: '2026-10-10' },
		{ id: 'continuum-cursor', title: 'Cursor', url: 'https://continuumcode.ai/docs/providers/cursor', publisher: 'Montauk Analytics', checked: '2026-10-10' },
		{ id: 'continuum-grok', title: 'Grok', url: 'https://continuumcode.ai/docs/providers/grok', publisher: 'Montauk Analytics', checked: '2026-10-10' },
		{ id: 'continuum-antigravity', title: 'Antigravity / Gemini', url: 'https://continuumcode.ai/docs/providers/antigravity', publisher: 'Montauk Analytics', checked: '2026-10-10' },
		{ id: 'continuum-openrouter', title: 'OpenRouter via OpenCode', url: 'https://continuumcode.ai/docs/providers/openrouter', publisher: 'Montauk Analytics', checked: '2026-10-10' },
		{ id: 'continuum-plan-mode', title: 'Plan Mode', url: 'https://continuumcode.ai/docs/features/plan-mode', publisher: 'Montauk Analytics', checked: '2026-10-10' },
		{ id: 'continuum-analytics', title: 'Analytics', url: 'https://continuumcode.ai/docs/features/analytics', publisher: 'Montauk Analytics', checked: '2026-10-10' },
		{ id: 'continuum-remote-devices', title: 'Remote Devices', url: 'https://continuumcode.ai/docs/features/remote-devices', publisher: 'Montauk Analytics', checked: '2026-10-10' },
		{ id: 'continuum-autopilot', title: 'Autopilot & Safety Rails', url: 'https://continuumcode.ai/docs/features/autopilot', publisher: 'Montauk Analytics', checked: '2026-10-10' },
		{ id: 'continuum-spawn', title: 'Spawn Mode', url: 'https://continuumcode.ai/docs/features/spawn-mode', publisher: 'Montauk Analytics', checked: '2026-10-10' },
		{ id: 'continuum-shortcuts', title: 'Keyboard Shortcuts', url: 'https://continuumcode.ai/docs/reference/shortcuts', publisher: 'Montauk Analytics', checked: '2026-10-10' },
		{ id: 'continuum-diffs', title: 'Diffs & PRs', url: 'https://continuumcode.ai/docs/features/diffs-and-prs', publisher: 'Montauk Analytics', checked: '2026-10-10' },
		{ id: 'continuum-cloud', title: 'Cloud & Cloud Burst', url: 'https://continuumcode.ai/product/cloud/', publisher: 'Montauk Analytics', checked: '2026-10-10' },
		{ id: 'continuum-quickstart', title: 'Quickstart', url: 'https://continuumcode.ai/docs/quickstart', publisher: 'Montauk Analytics', checked: '2026-10-10' },
		{ id: 'continuum-privacy-docs', title: 'Privacy', url: 'https://continuumcode.ai/docs/privacy', publisher: 'Montauk Analytics', checked: '2026-10-10' },
		{ id: 'continuum-changelog', title: 'Changelog', url: 'https://continuumcode.ai/docs/changelog', publisher: 'Montauk Analytics', checked: '2026-10-10' },
		{ id: 'continuum-updates-repo', title: 'Continuumcodeapp/continuum-updates', url: 'https://github.com/Continuumcodeapp/continuum-updates', publisher: 'Continuumcodeapp/continuum-updates on GitHub', checked: '2026-10-10' },
		{ id: 'continuum-appcast', title: 'Sparkle appcast', url: 'https://continuumcodeapp.github.io/continuum-updates/updates/appcast.xml', publisher: 'Continuumcodeapp/continuum-updates on GitHub', checked: '2026-10-10' },
		{ id: 'continuum-release-mac', title: 'Continuum 0.97.8', url: 'https://github.com/Continuumcodeapp/continuum-updates/releases/tag/v0.97.8-mac', publisher: 'Continuumcodeapp/continuum-updates on GitHub', checked: '2026-10-10' },
		{ id: 'continuum-release-unified', title: 'Continuum Unified for Mac 0.97.9', url: 'https://github.com/Continuumcodeapp/continuum-updates/releases/tag/v0.97.9-unified-mac', publisher: 'Continuumcodeapp/continuum-updates on GitHub', checked: '2026-10-10' },
		{ id: 'continuum-release-desktop', title: 'Continuum Desktop 0.97.8 (Windows + Linux)', url: 'https://github.com/Continuumcodeapp/continuum-updates/releases/tag/v0.97.8-desktop', publisher: 'Continuumcodeapp/continuum-updates on GitHub', checked: '2026-10-10' },
		{ id: 'continuum-app-store', title: 'Continuum: AI Coding', url: 'https://apps.apple.com/us/app/continuum-console/id6776332528', publisher: 'Apple App Store', checked: '2026-10-10' },
		{ id: 'continuum-play', title: 'Continuum: AI Coding', url: 'https://play.google.com/store/apps/details?id=ai.continuum.mobile', publisher: 'Google Play', checked: '2026-10-10' }
	]
};
