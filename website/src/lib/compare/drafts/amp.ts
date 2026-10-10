// Splash vs Amp for macOS, iPhone & iPad. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const AMP: Comparison = {
	slug: 'amp',
	name: 'Amp for macOS, iPhone & iPad',
	description: 'How Splash and Amp’s Mac, iPhone and iPad apps compare on agents, cloud orbs, platforms, pricing and review, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Amp for macOS, iPhone & iPad both run several coding-agent sessions at once. Amp’s apps are clients for Amp threads, which run Amp’s agent or its Claude Code mode in a cloud machine per thread or on a runner. Splash, a desktop app, drives many vendors’ agents over the Agent Client Protocol on your computer or server.',
	other: {
		name: 'Amp for macOS, iPhone & iPad',
		url: 'https://ampcode.com/app',
		maker: 'Amp',
		summary: 'Amp’s beta apps for Mac, iPhone and iPad. They open your ampcode.com threads, whose agents work in a cloud orb per thread or on a runner, and add notifications and dictation.',
		cite: ['amp-docs-apps', 'amp-app', 'amp-threads']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Native Mac, iPhone and iPad clients for Amp threads, which run in cloud orbs or on runners like your Mac', cite: ['amp-docs-apps', 'amp-threads', 'amp-runner-mac'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'Beta, announced 28 August 2026. The Mac app was 1.0 (build 726) on 10 October 2026; iPhone and iPad use TestFlight', cite: ['amp-app', 'amp-news-launch', 'amp-appcast', 'amp-testflight'] } },
				{ label: 'License', splash: S.license, other: { text: 'Proprietary: Amp’s terms grant a revocable license to use the service, and the ampcode GitHub organization has no app repository', cite: ['amp-terms', 'amp-github-org'] } },
				{ label: 'Price', splash: S.price, other: { text: 'No separate app price. Hobby is free (pay-as-you-go orbs, free runners); Megawatt $20 and Gigawatt $200 a month; Enterprise custom', cite: ['amp-pricing', 'amp-docs-pricing'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 26+ and iOS/iPadOS 26+; Mac CPU support isn’t stated. Also a web app and CLI (macOS, Linux, Windows via WSL)', cite: ['amp-app', 'amp-help'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Amp’s own agent in several modes, plus a Claude Code mode since 10 October 2026; plugins add modes. Others aren’t documented', cite: ['amp-docs', 'amp-dial', 'amp-news-claude'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Threads run in orbs or on runners; Claude Code mode uses the Claude Agent SDK; the Mac app runs amp as a runner', cite: ['amp-threads', 'amp-dial', 'amp-docs-apps', 'amp-runner-mac'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Amp credits by default; or your API keys, Bedrock, Vertex, gateways, or ChatGPT, 𝕏 Premium+/SuperGrok or Claude plans (for Claude Code mode)', cite: ['amp-model-routing', 'amp-dial', 'amp-pricing'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'An ampcode.com account, with up to five signed in per device; the Mac runner also needs the amp CLI signed in', cite: ['amp-docs-apps', 'amp-runner-mac'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Not by default: Amp runs tools without asking; a custom plugin’s tool.call hook can block tools or ask for confirmation', mark: 'partial', cite: ['amp-tools', 'amp-plugins'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Local MCP servers, or remote ones stored on ampcode.com; skills and TypeScript or JavaScript plugins add tools, commands and hooks', mark: 'yes', cite: ['amp-mcp', 'amp-plugins'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Agents start other agents in their own orbs, exchange files and collect results; built-in subagents and Puck also delegate work', mark: 'yes', cite: ['amp-agent-to-agent', 'amp-subagents', 'amp-docs'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Each orb thread gets a fresh sandboxed cloud machine with a repo clone; runner threads can each use a git worktree', mark: 'yes', cite: ['amp-orbs', 'amp-security', 'amp-runners'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Committed .agents/setup and .agents/resume scripts prepare orbs; dev servers in .amp/services.yaml open through Portals, which runners don’t have', mark: 'yes', cite: ['amp-customizing-orbs', 'amp-portals', 'amp-runners'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'Notifies when a thread awaits your reply, unless disabled or Amp is in front; threads can be marked unread or snoozed', mark: 'yes', cite: ['amp-docs-apps', 'amp-threads'] } },
				{ label: 'Team collaboration', hint: 'Several people on one thread', splash: { text: 'splash-server is a personal, single-user service, not a multi-user deployment', mark: 'no', cite: ['splash-server'] }, other: { text: 'Tagging a workspace member turns on Multiplayer, sharing the agent, terminal and files; each thread has a voice and video Space', mark: 'yes', cite: ['amp-threads', 'amp-space'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Automations resume a thread later or on a recurring schedule written in plain language, with no cron expression', mark: 'yes', cite: ['amp-automations'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'A Changes pane of committed and uncommitted work; Review walks the diff; request changes on sections or annotate a Portal', mark: 'yes', cite: ['amp-threads', 'amp-news-diffs', 'amp-portals'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Agents open PRs via the GitHub App; Ship lands on the base branch by default, or pushes a branch and reports its PR', mark: 'yes', cite: ['amp-github', 'amp-shipping'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'A GitHub App (github.com) lets the agent clone, push, open PRs and read CI; gated, experimental webhooks start threads for new issues', mark: 'yes', cite: ['amp-github'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'The default: an orb per thread, billed by the minute ($0.08 to $2.13 an hour by size) and paused when idle', mark: 'yes', cite: ['amp-orbs', 'amp-docs-pricing', 'amp-sizes'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'Runners run threads on any machine with amp, picked from the web, phone or Puck; a sleeping Mac pauses its threads', mark: 'yes', cite: ['amp-runners', 'amp-news-runner', 'amp-runner-mac'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'iPhone and iPad app in a TestFlight beta (iOS 26+), with the same threads, notifications, Puck voice calls and screen recording', mark: 'partial', cite: ['amp-docs-apps', 'amp-testflight', 'amp-app'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'The Mac app updates itself from a Sparkle feed; on iPhone and iPad you install new builds through TestFlight', mark: 'yes', cite: ['amp-docs-apps', 'amp-appcast'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Threads from Amp’s web app and CLI open in the apps; importing other agents’ sessions isn’t documented', mark: 'partial', cite: ['amp-threads'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'The Activity view filters threads by status, author, project or time and searches them; so does amp threads search', mark: 'yes', cite: ['amp-threads'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Amp threads run Amp’s own agent, whose modes route to several vendors’ models, or, since 10 October 2026, a Claude Code mode built on the Claude Agent SDK. The docs don’t cover other agents or ACP. Splash talks to each agent over the <strong>Agent Client Protocol</strong>, and its launch commands include Amp’s CLI through the <code>amp-acp</code> adapter.',
			cite: ['amp-docs', 'amp-dial', 'amp-news-claude', 'splash-registry', 'splash-agents', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'By default an Amp thread runs in an <strong>orb</strong>, a sandboxed cloud machine billed by the minute, so a task begun at your desk can be followed from a phone; runners put threads on machines of your own. Splash runs agents on your computer, or under <code>splash-server</code> on a machine you reach through an SSH tunnel.',
			cite: ['amp-orbs', 'amp-security', 'amp-docs-pricing', 'amp-docs-apps', 'amp-runners', 'splash-readme', 'splash-server']
		},
		{
			title: 'Price, accounts and license',
			text: 'Amp’s apps are proprietary and need an ampcode.com account. Hobby is free, with pay-as-you-go orbs and free runners on your own machines; Megawatt ($20) and Gigawatt ($200) a month include orb minutes and credits, and your own model keys or plans avoid Amp token fees. Splash is free, MIT-licensed and has no accounts.',
			cite: ['amp-terms', 'amp-docs-apps', 'amp-pricing', 'splash-license', 'splash-download', 'splash-build']
		},
		{
			title: 'Platforms and devices',
			text: 'Amp’s apps need macOS 26 or iOS/iPadOS 26 and later, with the iPhone and iPad app in a TestFlight beta; the web app and the CLI (macOS, Linux, Windows via WSL) reach the same threads. Splash builds for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64 plus a headless server, and has no phone app.',
			cite: ['amp-app', 'amp-testflight', 'amp-help', 'amp-threads', 'splash-install']
		},
		{
			title: 'Workflow around the agent',
			text: 'Amp runs tools without asking unless a plugin steps in, and builds around the thread: orb setup scripts and Portals, a Ship button, schedules, agents that start agents, and Multiplayer. Splash shows each agent’s permission requests in the transcript and adds a Needs attention queue, a review screen and import of sessions agents began elsewhere.',
			cite: ['amp-tools', 'amp-plugins', 'amp-customizing-orbs', 'amp-portals', 'amp-shipping', 'amp-automations', 'amp-agent-to-agent', 'amp-threads', 'splash-features', 'splash-history']
		}
	],
	fit: {
		splash: [
			'You want Codex, Gemini, Copilot, Goose and other vendors’ agents alongside Claude Code in one app.',
			'You want agents to run on your own computer or server, with no account to create.',
			'You want a free, MIT-licensed desktop app for macOS, Windows and Ubuntu.',
			'You want to answer each permission request in the transcript and import sessions your agents started elsewhere.'
		],
		other: [
			'You want each task in its own prepared cloud machine that you can follow from an iPhone or iPad.',
			'You want agents that start other agents, run on a schedule and push or open pull requests through a GitHub App.',
			'You want to bring teammates into a thread with Multiplayer and a voice or video Space.',
			'You want Puck to start and check on agents by text, dictation or a voice call.'
		]
	},
	sources: [
		{ id: 'amp-docs-apps', title: 'macOS & iOS Apps', url: 'https://ampcode.com/docs/macos-and-ios', publisher: 'Amp', checked: '2026-10-10' },
		{ id: 'amp-app', title: 'Download Amp', url: 'https://ampcode.com/app', publisher: 'Amp', checked: '2026-10-10' },
		{ id: 'amp-runner-mac', title: 'Use Your Mac as a Runner', url: 'https://ampcode.com/docs/macos-and-ios/runner', publisher: 'Amp', checked: '2026-10-10' },
		{ id: 'amp-news-launch', title: 'Amp on iOS & macOS', url: 'https://ampcode.com/news/amp-on-ios-and-macos', publisher: 'Amp', checked: '2026-10-10' },
		{ id: 'amp-news-runner', title: 'The Mac App Is Your Runner', url: 'https://ampcode.com/news/the-mac-app-is-your-runner', publisher: 'Amp', checked: '2026-10-10' },
		{ id: 'amp-news-claude', title: 'Use Your Claude Plan in Amp', url: 'https://ampcode.com/news/use-your-claude-plan', publisher: 'Amp', checked: '2026-10-10' },
		{ id: 'amp-news-diffs', title: 'Diffs', url: 'https://ampcode.com/news/diffs', publisher: 'Amp', checked: '2026-10-10' },
		{ id: 'amp-appcast', title: 'Mac app update feed (appcast.xml)', url: 'https://static.ampcode.com/mac/appcast.xml', publisher: 'Amp', checked: '2026-10-10' },
		{ id: 'amp-testflight', title: 'Join the Ampcode beta', url: 'https://testflight.apple.com/join/Skjdm6qe', publisher: 'Apple', checked: '2026-10-10' },
		{ id: 'amp-terms', title: 'Amp License Terms', url: 'https://ampcode.com/terms', publisher: 'Amp', checked: '2026-10-10' },
		{ id: 'amp-github-org', title: 'ampcode', url: 'https://github.com/ampcode', publisher: 'ampcode on GitHub', checked: '2026-10-10' },
		{ id: 'amp-pricing', title: 'Pricing', url: 'https://ampcode.com/pricing', publisher: 'Amp', checked: '2026-10-10' },
		{ id: 'amp-docs-pricing', title: 'Pricing (docs)', url: 'https://ampcode.com/docs/pricing', publisher: 'Amp', checked: '2026-10-10' },
		{ id: 'amp-sizes', title: 'Sizes & Costs', url: 'https://ampcode.com/docs/orbs/sizes-and-costs', publisher: 'Amp', checked: '2026-10-10' },
		{ id: 'amp-help', title: 'Getting Help', url: 'https://ampcode.com/docs/support/getting-help', publisher: 'Amp', checked: '2026-10-10' },
		{ id: 'amp-docs', title: 'Introduction', url: 'https://ampcode.com/docs', publisher: 'Amp', checked: '2026-10-10' },
		{ id: 'amp-dial', title: 'The Dial', url: 'https://ampcode.com/docs/the-dial', publisher: 'Amp', checked: '2026-10-10' },
		{ id: 'amp-subagents', title: 'Modes & Models', url: 'https://ampcode.com/docs/models-and-subagents', publisher: 'Amp', checked: '2026-10-10' },
		{ id: 'amp-threads', title: 'Threads', url: 'https://ampcode.com/docs/threads', publisher: 'Amp', checked: '2026-10-10' },
		{ id: 'amp-model-routing', title: 'Model Routing', url: 'https://ampcode.com/docs/customize/model-routing', publisher: 'Amp', checked: '2026-10-10' },
		{ id: 'amp-tools', title: 'Tools', url: 'https://ampcode.com/docs/tools', publisher: 'Amp', checked: '2026-10-10' },
		{ id: 'amp-plugins', title: 'Plugins', url: 'https://ampcode.com/docs/customize/plugins', publisher: 'Amp', checked: '2026-10-10' },
		{ id: 'amp-mcp', title: 'MCP', url: 'https://ampcode.com/docs/customize/mcp', publisher: 'Amp', checked: '2026-10-10' },
		{ id: 'amp-agent-to-agent', title: 'Agent to Agent', url: 'https://ampcode.com/docs/orbs/agent-to-agent', publisher: 'Amp', checked: '2026-10-10' },
		{ id: 'amp-orbs', title: 'Orbs', url: 'https://ampcode.com/docs/orbs', publisher: 'Amp', checked: '2026-10-10' },
		{ id: 'amp-security', title: 'Amp Security Reference', url: 'https://ampcode.com/security', publisher: 'Amp', checked: '2026-10-10' },
		{ id: 'amp-runners', title: 'Runners', url: 'https://ampcode.com/docs/cli/runners', publisher: 'Amp', checked: '2026-10-10' },
		{ id: 'amp-customizing-orbs', title: 'Customizing Orbs', url: 'https://ampcode.com/docs/orbs/customizing', publisher: 'Amp', checked: '2026-10-10' },
		{ id: 'amp-portals', title: 'Portals', url: 'https://ampcode.com/docs/orbs/portals', publisher: 'Amp', checked: '2026-10-10' },
		{ id: 'amp-space', title: 'Space', url: 'https://ampcode.com/docs/collaborate/space', publisher: 'Amp', checked: '2026-10-10' },
		{ id: 'amp-automations', title: 'Automations', url: 'https://ampcode.com/docs/orbs/automations', publisher: 'Amp', checked: '2026-10-10' },
		{ id: 'amp-shipping', title: 'Shipping Changes', url: 'https://ampcode.com/docs/orbs/shipping', publisher: 'Amp', checked: '2026-10-10' },
		{ id: 'amp-github', title: 'GitHub & Git', url: 'https://ampcode.com/docs/github', publisher: 'Amp', checked: '2026-10-10' }
	]
};
