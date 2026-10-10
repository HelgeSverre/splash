// Splash vs GitHub Copilot app. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const GITHUB_COPILOT_APP: Comparison = {
	slug: 'github-copilot-app',
	name: 'GitHub Copilot app',
	description: 'How Splash and the GitHub Copilot app compare on agents, platforms, pricing, worktrees, review and GitHub, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and the GitHub Copilot app are desktop apps that run several coding agent sessions at once, each in your checkout or its own git worktree. The GitHub Copilot app runs GitHub Copilot’s own agent, built on Copilot CLI and tied into GitHub; Splash, free and open source, drives agents from many vendors over the Agent Client Protocol.',
	other: {
		name: 'GitHub Copilot app',
		url: 'https://github.com/features/ai/github-app',
		maker: 'GitHub',
		summary: 'GitHub’s desktop app for agent-driven development, built on Copilot CLI. It runs parallel Copilot sessions in git worktrees and covers issues, pull requests, CI checks and merging on GitHub.',
		cite: ['github-copilot-app-docs', 'github-copilot-app-readme', 'github-copilot-app-issues-prs']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app for agent-driven work across GitHub repositories, built on GitHub Copilot CLI', cite: ['github-copilot-app-docs', 'github-copilot-app-readme'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v1.1.28 (9 October 2026); GA since 17 June 2026. Cloud sandboxes, BYOK and computer use are in public preview', cite: ['github-copilot-app-release', 'github-copilot-app-ga', 'github-copilot-app-sessions', 'github-copilot-app-byok', 'github-copilot-app-computer-use'] } },
				{ label: 'License', splash: S.license, other: { text: 'Proprietary, all rights reserved by GitHub; the public github/app repository holds releases, issues and the changelog, not the source', cite: ['github-copilot-app-license', 'github-copilot-app-readme'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Any Copilot plan, including Free ($0), Pro ($10 a month), Pro+ ($39), Max ($100), Business ($19/user) and Enterprise ($39/user); or BYOK with no plan', cite: ['github-copilot-app-home', 'github-copilot-app-readme'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon and Intel), Windows x64 and ARM, Linux x64 and arm64 as AppImage, .deb and .rpm', cite: ['github-copilot-app-readme', 'github-copilot-app-release'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'GitHub Copilot’s agent, with custom agents and a built-in rubber duck critic; Claude Code or Codex in the app isn’t documented', cite: ['github-copilot-app-docs', 'github-copilot-app-custom-agents', 'github-copilot-app-sessions', 'github-copilot-app-third-party'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Built on GitHub Copilot CLI, sharing its runtime with the Copilot SDK; how the app talks to it isn’t documented', cite: ['github-copilot-app-docs', 'github-copilot-app-launch', 'github-copilot-app-changelog'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Copilot plan credits, or BYOK: OpenAI, Azure OpenAI, Anthropic, Ollama, LM Studio and more. Claude or ChatGPT subscriptions aren’t documented', cite: ['github-copilot-app-docs', 'github-copilot-app-byok'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'A GitHub account, even with BYOK; no GitHub Enterprise Server. Organization seats need the app’s policy, on by default', cite: ['github-copilot-app-byok', 'github-copilot-app-quickstart', 'github-copilot-app-docs'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'A tool permissions setting decides when it asks; a new local repo stays on Always ask until you trust it, /yolo auto-approves, and Plan mode waits for approval', mark: 'yes', cite: ['github-copilot-app-changelog', 'github-copilot-app-slash-commands', 'github-copilot-app-docs'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Local or HTTP servers; those set up for the repo or Copilot CLI load automatically, and plugins can add more', mark: 'yes', cite: ['github-copilot-app-customize', 'github-copilot-app-home'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A new git worktree on its own branch, or your local checkout; optional OS-level sandboxing restricts files, network and credentials', mark: 'yes', cite: ['github-copilot-app-sessions', 'github-copilot-app-docs', 'github-copilot-app-sandboxes'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Scripts in .github/github-app.yml run manually or when a session is created or archived; detected dev servers open in the built-in browser', mark: 'yes', cite: ['github-copilot-app-repo-config'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'An integrated browser to check work beside the terminal; dev servers that repo scripts start open in it by default', mark: 'yes', cite: ['github-copilot-app-ga', 'github-copilot-app-repo-config'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Status labels (Working, Done, Idle, Needs input, Loading), a centralized inbox, desktop notifications and a tray badge on Windows and Linux', mark: 'yes', cite: ['github-copilot-app-changelog', 'github-copilot-app-home'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: '/fleet runs several agents on one task; /spawn starts child sessions and /orchestrate coordinates them, across repositories too', mark: 'yes', cite: ['github-copilot-app-slash-commands', 'github-copilot-app-skills'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Automations run saved prompts on demand, hourly, daily, weekly, on issue or PR events, or by cron for local ones', mark: 'yes', cite: ['github-copilot-app-automations'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'A Changes diff with commit ranges, inline comments for the agent, /review and /security-review (preview), and per-file discard', mark: 'yes', cite: ['github-copilot-app-quickstart', 'github-copilot-app-issues-prs', 'github-copilot-app-slash-commands', 'github-copilot-app-sessions', 'github-copilot-app-changelog'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Creates, closes and merges PRs, including stacks of dependent PRs; Agent merge fixes what blocks a PR, then merges it', mark: 'yes', cite: ['github-copilot-app-docs', 'github-copilot-app-issues-prs', 'github-copilot-app-skills'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Built in: issue and PR lists, PR reviews with batched inline comments, CI check results and agent fixes for failing checks', mark: 'yes', cite: ['github-copilot-app-docs', 'github-copilot-app-issues-prs', 'github-copilot-app-changelog'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'GitHub Issues, and sessions started from one; Azure DevOps through a plugin canvas, plus a featured Jira canvas. Linear isn’t documented', mark: 'yes', cite: ['github-copilot-app-issues-prs', 'github-copilot-app-canvas', 'github-copilot-app-changelog'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'Docs describe GitHub-hosted cloud sandboxes (public preview, billed by usage), but v1.1.27 removed creating new cloud sessions', mark: 'partial', cite: ['github-copilot-app-sessions', 'github-copilot-app-sandboxes', 'github-copilot-app-release-1-1-27'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'Remote control (/remote) steers a local session from GitHub.com; the changelog also describes SSH, WSL, Codespaces and Docker environments', mark: 'yes', cite: ['github-copilot-app-slash-commands', 'github-copilot-app-remote-control', 'github-copilot-app-changelog'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'GitHub Mobile can steer a local session through remote control, off by default; no mobile build of the app is published', mark: 'yes', cite: ['github-copilot-app-slash-commands', 'github-copilot-app-repo-config', 'github-copilot-app-release'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Copilot CLI sessions appear in the sidebar if you turn on a setting; importing other agents’ sessions isn’t documented', mark: 'partial', cite: ['github-copilot-app-changelog'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: '/chronicle searches the history of app and Copilot CLI sessions; Manage sessions searches and filters sessions and chats, archived chats too', mark: 'yes', cite: ['github-copilot-app-slash-commands', 'github-copilot-app-sessions'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'The GitHub Copilot app runs GitHub Copilot’s own agent on Copilot CLI, the runtime GitHub also offers as the Copilot SDK; its docs don’t name the transport or describe adding other vendors’ agents. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, Copilot included, which it starts as <code>copilot --acp</code>: the CLI’s ACP server, in public preview.',
			cite: ['github-copilot-app-docs', 'github-copilot-app-launch', 'github-copilot-app-third-party', 'github-copilot-app-acp', 'splash-agents', 'splash-registry', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'The GitHub Copilot app runs sessions locally, and its changelog adds SSH, WSL, Codespaces and Docker environments; docs describe GitHub-hosted cloud sandboxes, though v1.1.27 removed creating new ones. GitHub.com and GitHub Mobile can steer a local session through remote control. Splash runs agents on your computer, or under <code>splash-server</code> on a machine you reach over an SSH tunnel.',
			cite: ['github-copilot-app-changelog', 'github-copilot-app-sessions', 'github-copilot-app-release-1-1-27', 'github-copilot-app-slash-commands', 'splash-readme', 'splash-server']
		},
		{
			title: 'Price, accounts and license',
			text: 'The GitHub Copilot app is proprietary and needs a GitHub account. It works with any Copilot plan, from the $0 Free plan to Enterprise, drawing on the plan’s credits, or with no plan through your own provider key (BYOK). Splash is free, MIT-licensed and has no accounts, and it runs each agent on that agent’s own login.',
			cite: ['github-copilot-app-license', 'github-copilot-app-byok', 'github-copilot-app-home', 'github-copilot-app-docs', 'splash-license', 'splash-download', 'splash-build', 'splash-agents']
		},
		{
			title: 'Around the session',
			text: 'The GitHub Copilot app covers the path from a GitHub issue to a merged pull request: repo scripts, a built-in browser, PR creation and <strong>Agent merge</strong>, plus automations, canvases and <code>/fleet</code> for parallel agents. Splash centers on conversations with many vendors’ agents: a Needs attention queue, a review screen, transcript search and importing sessions started elsewhere.',
			cite: ['github-copilot-app-issues-prs', 'github-copilot-app-repo-config', 'github-copilot-app-ga', 'github-copilot-app-automations', 'github-copilot-app-canvas', 'github-copilot-app-slash-commands', 'splash-features', 'splash-history']
		}
	],
	fit: {
		splash: [
			'You want to run agents from several vendors, Copilot among them, side by side in one app.',
			'You want a free, MIT-licensed app with no account of its own.',
			'You want to import conversations your agents started outside the app and search them with the rest.',
			'You want to run sessions on your own server and use them in a browser over SSH.'
		],
		other: [
			'You work mainly with GitHub Copilot and have a Copilot plan, Free included, or your own model provider key.',
			'You want to go from a GitHub issue to a merged pull request in one app, with Agent merge clearing blockers.',
			'You want repo scripts, a built-in browser, scheduled automations and several agents working on one task.',
			'You want to follow and steer a local session from GitHub.com or GitHub Mobile.'
		]
	},
	sources: [
		{ id: 'github-copilot-app-home', title: 'GitHub Copilot app', url: 'https://github.com/features/ai/github-app', publisher: 'GitHub', checked: '2026-10-10' },
		{ id: 'github-copilot-app-readme', title: 'README.md', url: 'https://github.com/github/app/blob/main/README.md', publisher: 'github/app on GitHub', checked: '2026-10-10' },
		{ id: 'github-copilot-app-license', title: 'License.md', url: 'https://github.com/github/app/blob/main/License.md', publisher: 'github/app on GitHub', checked: '2026-10-10' },
		{ id: 'github-copilot-app-changelog', title: 'changelog.md', url: 'https://github.com/github/app/blob/main/changelog.md', publisher: 'github/app on GitHub', checked: '2026-10-10' },
		{ id: 'github-copilot-app-release', title: 'Release v1.1.28', url: 'https://github.com/github/app/releases/tag/v1.1.28', publisher: 'github/app on GitHub', checked: '2026-10-10' },
		{ id: 'github-copilot-app-release-1-1-27', title: 'Release v1.1.27', url: 'https://github.com/github/app/releases/tag/v1.1.27', publisher: 'github/app on GitHub', checked: '2026-10-10' },
		{ id: 'github-copilot-app-docs', title: 'GitHub Copilot app', url: 'https://docs.github.com/en/copilot/concepts/copilot-surfaces/github-copilot-app', publisher: 'GitHub', checked: '2026-10-10' },
		{ id: 'github-copilot-app-quickstart', title: 'Getting started with the GitHub Copilot app', url: 'https://docs.github.com/en/copilot/get-started/quickstart-copilot-app', publisher: 'GitHub', checked: '2026-10-10' },
		{ id: 'github-copilot-app-sessions', title: 'Working with agent sessions in the GitHub Copilot app', url: 'https://docs.github.com/en/copilot/how-tos/github-copilot-app/agent-sessions', publisher: 'GitHub', checked: '2026-10-10' },
		{ id: 'github-copilot-app-byok', title: 'Adding LLM models to the GitHub Copilot app', url: 'https://docs.github.com/en/copilot/how-tos/github-copilot-app/use-byok-models', publisher: 'GitHub', checked: '2026-10-10' },
		{ id: 'github-copilot-app-computer-use', title: 'Using the GitHub Copilot app to interact with desktop applications', url: 'https://docs.github.com/en/copilot/how-tos/github-copilot-app/computer-use', publisher: 'GitHub', checked: '2026-10-10' },
		{ id: 'github-copilot-app-customize', title: 'Customizing the GitHub Copilot app', url: 'https://docs.github.com/en/copilot/how-tos/github-copilot-app/customize-github-copilot-app', publisher: 'GitHub', checked: '2026-10-10' },
		{ id: 'github-copilot-app-issues-prs', title: 'Managing issues and pull requests with the GitHub Copilot app', url: 'https://docs.github.com/en/copilot/how-tos/github-copilot-app/managing-issues-and-pull-requests', publisher: 'GitHub', checked: '2026-10-10' },
		{ id: 'github-copilot-app-automations', title: 'Using automations in the GitHub Copilot app', url: 'https://docs.github.com/en/copilot/how-tos/github-copilot-app/using-automations', publisher: 'GitHub', checked: '2026-10-10' },
		{ id: 'github-copilot-app-canvas', title: 'Working with canvas extensions in the GitHub Copilot app', url: 'https://docs.github.com/en/copilot/how-tos/github-copilot-app/working-with-canvas-extensions', publisher: 'GitHub', checked: '2026-10-10' },
		{ id: 'github-copilot-app-repo-config', title: 'Repository configuration for the GitHub Copilot app', url: 'https://docs.github.com/en/copilot/reference/github-copilot-app-reference/repository-configuration', publisher: 'GitHub', checked: '2026-10-10' },
		{ id: 'github-copilot-app-slash-commands', title: 'Slash commands for the GitHub Copilot app', url: 'https://docs.github.com/en/copilot/reference/github-copilot-app-reference/slash-commands', publisher: 'GitHub', checked: '2026-10-10' },
		{ id: 'github-copilot-app-skills', title: 'Built-in skills for the GitHub Copilot app', url: 'https://docs.github.com/en/copilot/reference/github-copilot-app-reference/built-in-skills', publisher: 'GitHub', checked: '2026-10-10' },
		{ id: 'github-copilot-app-sandboxes', title: 'About cloud and local sandboxes for GitHub Copilot', url: 'https://docs.github.com/en/copilot/concepts/about-cloud-and-local-sandboxes', publisher: 'GitHub', checked: '2026-10-10' },
		{ id: 'github-copilot-app-custom-agents', title: 'About custom agents', url: 'https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-custom-agents', publisher: 'GitHub', checked: '2026-10-10' },
		{ id: 'github-copilot-app-third-party', title: 'About third-party coding agents', url: 'https://docs.github.com/en/copilot/concepts/agents/about-third-party-coding-agents', publisher: 'GitHub', checked: '2026-10-10' },
		{ id: 'github-copilot-app-remote-control', title: 'About remote control of GitHub Copilot CLI sessions', url: 'https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-remote-control', publisher: 'GitHub', checked: '2026-10-10' },
		{ id: 'github-copilot-app-acp', title: 'Copilot CLI ACP server', url: 'https://docs.github.com/en/copilot/reference/copilot-cli-reference/acp-server', publisher: 'GitHub', checked: '2026-10-10' },
		{ id: 'github-copilot-app-ga', title: 'GitHub Copilot app generally available', url: 'https://github.blog/changelog/2026-06-17-github-copilot-app-generally-available/', publisher: 'GitHub', checked: '2026-10-10' },
		{ id: 'github-copilot-app-launch', title: 'GitHub Copilot app: The agent-native desktop experience', url: 'https://github.blog/news-insights/product-news/github-copilot-app-the-agent-native-desktop-experience/', publisher: 'GitHub', checked: '2026-10-10' }
	]
};
