// Splash vs Google Antigravity 2.0. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const ANTIGRAVITY: Comparison = {
	slug: 'antigravity',
	name: 'Google Antigravity 2.0',
	description: 'How Splash and Google Antigravity 2.0 compare on agents, models, pricing, platforms, worktrees and remote control, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Google Antigravity 2.0 are desktop apps for running several coding agents at once, each in your project folder or its own git worktree. Antigravity 2.0 runs Google’s own agent, with Gemini, Claude or GPT-OSS models billed through Google. Splash, free and open source, drives agents from several vendors over the Agent Client Protocol.',
	other: {
		name: 'Google Antigravity 2.0',
		url: 'https://antigravity.google',
		maker: 'Google',
		summary: 'Google’s standalone desktop app for running several Antigravity agents in parallel across projects, each conversation in your folders or a new Git worktree, with subagents, a browser subagent and scheduled Automations.',
		cite: ['antigravity-product', 'antigravity-projects', 'antigravity-subagents', 'antigravity-features', 'antigravity-changelog']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Standalone desktop app that works without an IDE; the Antigravity IDE, CLI, Python SDK and IDE extensions are separate surfaces', cite: ['antigravity-blog-2', 'antigravity-overview', 'antigravity-docs-home'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v2.22.0 (8 October 2026), launched 19 May 2026. Generally Available for individuals; Windows sandbox mode and agent teams are in Preview', cite: ['antigravity-changelog', 'antigravity-blog-2', 'antigravity-pricing', 'antigravity-sandbox', 'antigravity-teamwork'] } },
				{ label: 'License', splash: S.license, other: { text: 'Proprietary; Google hasn’t published the source. The Apache-2.0 Python SDK depends on a compiled runtime binary', cite: ['antigravity-terms', 'antigravity-acp-registry', 'antigravity-sdk-repo'] } },
				{ label: 'Price', splash: S.price, other: { text: '$0 tier with weekly limits; Google AI Pro ($19.99/month, US) or Ultra ($99.99 or $199.99) raise them; Gemini Enterprise seats from $30', cite: ['antigravity-pricing', 'antigravity-google-one'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 12+ (Apple silicon and Intel, though one doc says x86 is unsupported), Windows 10+ and Linux on x64 and ARM64, Googlebook', cite: ['antigravity-download', 'antigravity-releases', 'antigravity-getting-started'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Google’s Antigravity agent, plus custom variants defined in Markdown; adding Claude Code, Codex or other vendors’ agents isn’t documented', cite: ['antigravity-docs-home', 'antigravity-custom-agents', 'antigravity-faq'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Locally, in Google’s agent harness shared by every Antigravity surface; Google also offers that agent to Zed as an ACP server', cite: ['antigravity-home', 'antigravity-docs-home', 'antigravity-zed', 'antigravity-acp-registry'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Google bills model use: plan quota, then purchased AI credits (Pro and Ultra), or Gemini Enterprise; no bring-your-own-key for extra limits', cite: ['antigravity-plans', 'antigravity-pricing'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'A Google Account (18+, in approved countries) or a Business sign-in through Gemini Enterprise, which can use an external identity provider', cite: ['antigravity-getting-started', 'antigravity-faq', 'antigravity-enterprise'] } },
				{ label: 'Model and mode pickers', splash: S.models, other: { text: 'Choose Gemini, Claude or GPT-OSS-120b as the reasoning model, by plan; Claude 4.6 and GPT-OSS-120b are removed on 2 November 2026', mark: 'yes', cite: ['antigravity-models'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'By default, asks before terminal commands outside the sandbox, or any command on Windows; steps awaiting approval gather in one section', mark: 'yes', cite: ['antigravity-features', 'antigravity-task-groups'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Servers managed in Settings, an MCP Store with GitHub, Linear, Atlassian and more, and plugins that bundle servers with skills', mark: 'yes', cite: ['antigravity-mcp', 'antigravity-plugins'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Each conversation works in your folders (Local mode) or a new Git worktree; shell commands can run in an OS-level sandbox', mark: 'yes', cite: ['antigravity-projects', 'antigravity-sandbox'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Built-in and custom subagents, optionally in their own worktree; /boost reasoning pipelines and /teamwork-preview agent teams on paid plans', mark: 'yes', cite: ['antigravity-subagents', 'antigravity-boost', 'antigravity-teamwork'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Conversation-list badges for pending steps, a filter for unread conversations, live subagent cards and a section for steps awaiting approval', mark: 'yes', cite: ['antigravity-changelog-md', 'antigravity-task-groups'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'An action-required chime and a completion sound; Remote Control sends browser push notifications. Desktop OS notifications aren’t documented for 2.0', mark: 'yes', cite: ['antigravity-changelog-md', 'antigravity-features', 'antigravity-remote-control'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Automations, formerly Scheduled Tasks, start agent conversations on a cron schedule; sidecars can also start them through agentapi', mark: 'yes', cite: ['antigravity-product', 'antigravity-changelog', 'antigravity-sidecars'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'A /browser subagent drives Chrome and records WebM video; local dev server links open in the app’s preview pane', mark: 'yes', cite: ['antigravity-features', 'antigravity-changelog-md'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Inline comments on plans, diffs and other artifacts go to the agent; Planning mode can pause for your approval', mark: 'yes', cite: ['antigravity-features', 'antigravity-artifact-review'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'A Git panel shows uncommitted, branch and agent-edit diffs and stages, commits and pushes; Google suggests pairing 2.0 with an IDE', mark: 'partial', cite: ['antigravity-features', 'antigravity-vcs-blog', 'antigravity-overview', 'antigravity-blog-2'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'No built-in GitHub view or PR creation is documented; agents reach GitHub through the GitHub MCP server in the MCP Store', mark: 'partial', cite: ['antigravity-features', 'antigravity-mcp'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Remote Control drives desktop and CLI sessions on your own machines, servers included, from a browser; Windows builds can use WSL', mark: 'yes', cite: ['antigravity-remote-control', 'antigravity-remote-blog', 'antigravity-changelog-md'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'No phone app is documented; the Remote Control web app installs to a phone’s home screen and sends push notifications', mark: 'partial', cite: ['antigravity-remote-control'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'The desktop apps update themselves by default; earlier 2.0 builds, back to v2.0.0, remain on the releases page', mark: 'yes', cite: ['antigravity-releases'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'CLI sessions can be exported to 2.0 and Antigravity 1.0 projects migrate; importing from other agents isn’t documented', mark: 'partial', cite: ['antigravity-cli-repo', 'antigravity-changelog-md'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: '⌘K (Ctrl+K on Windows) searches conversations by their contents, since v2.21.1 (7 October 2026)', mark: 'yes', cite: ['antigravity-changelog'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Antigravity 2.0 runs Google’s own agent harness, the one behind its CLI, IDE and SDK, and you pick its model: Gemini, Claude or GPT-OSS, depending on plan. Adding other vendors’ agents isn’t documented; instead, editors such as Zed can install Antigravity’s agent as an ACP server. Splash speaks the <strong>Agent Client Protocol</strong> with agents from several vendors.',
			cite: ['antigravity-docs-home', 'antigravity-models', 'antigravity-faq', 'antigravity-zed', 'antigravity-acp-registry', 'splash-registry', 'acp']
		},
		{
			title: 'Who pays for the model',
			text: 'Antigravity bills model use through Google: a $0 tier with weekly limits, Google AI Pro or Ultra with optional AI credits, or Gemini Enterprise seats and pay-as-you-go. It offers no bring-your-own-key option for extra limits. Splash is free; you install and sign in to each agent’s CLI yourself, and Splash runs it with that login.',
			cite: ['antigravity-pricing', 'antigravity-plans', 'splash-download', 'splash-agents']
		},
		{
			title: 'Where agents run',
			text: 'Both run agents on your computer; at the May 2026 launch Google listed cloud-deployed agents as future work. Antigravity can confine agent shell commands to an OS-level sandbox, and <strong>Remote Control</strong> drives sessions on your machines from any browser. Splash can also run as <code>splash-server</code> on the machine with your code, used in a browser over an SSH tunnel.',
			cite: ['antigravity-home', 'antigravity-blog-2', 'antigravity-sandbox', 'antigravity-remote-control', 'splash-readme', 'splash-server']
		},
		{
			title: 'Around the session',
			text: 'Antigravity 2.0 builds in subagents, <code>/boost</code> and agent teams, a browser subagent that drives Chrome, cron Automations, artifact comments and a Git panel that commits and pushes. Splash centers on conversations from many agents: a Needs attention queue, a review screen, a GitHub view across repositories, and importing sessions agents started outside it.',
			cite: ['antigravity-subagents', 'antigravity-boost', 'antigravity-teamwork', 'antigravity-features', 'antigravity-product', 'splash-features', 'splash-history', 'splash-github']
		},
		{
			title: 'License, accounts and platforms',
			text: 'Antigravity 2.0 is proprietary, needs a Google Account or a Gemini Enterprise sign-in, ships for macOS, Windows and Linux (x64 and ARM64) plus Googlebook, and updates itself. Splash is MIT-licensed with no accounts, builds for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64, and updates by downloading a release from GitHub.',
			cite: ['antigravity-terms', 'antigravity-getting-started', 'antigravity-download', 'antigravity-releases', 'splash-license', 'splash-build', 'splash-install', 'splash-about']
		}
	],
	fit: {
		splash: [
			'You want agents from several vendors in one app, each running on the CLI login you already have.',
			'You want a free, MIT-licensed app that needs no account.',
			'You want to import conversations your agents started outside the app and search them with the rest.',
			'You want a GitHub view of issues, pull requests and Actions runs across repositories.'
		],
		other: [
			'You want Google’s agent with a choice of Gemini, Claude or GPT-OSS models under one Google plan, starting from a $0 tier.',
			'You want subagents, agent teams and a browser subagent that drives Chrome, built into the app.',
			'You want cron Automations, an OS-level sandbox for shell commands and an app that updates itself.',
			'You want to follow and approve agents from a browser or a phone through Remote Control.'
		]
	},
	sources: [
		{ id: 'antigravity-home', title: 'Google Antigravity', url: 'https://antigravity.google', publisher: 'Google', checked: '2026-10-10' },
		{ id: 'antigravity-product', title: 'Antigravity 2.0', url: 'https://antigravity.google/product/antigravity-2', publisher: 'Google', checked: '2026-10-10' },
		{ id: 'antigravity-docs-home', title: 'Welcome to Google Antigravity', url: 'https://antigravity.google/docs/home', publisher: 'Google', checked: '2026-10-10' },
		{ id: 'antigravity-overview', title: 'Antigravity 2.0 overview', url: 'https://antigravity.google/docs/overview', publisher: 'Google', checked: '2026-10-10' },
		{ id: 'antigravity-features', title: 'Antigravity 2.0 features', url: 'https://antigravity.google/docs/features', publisher: 'Google', checked: '2026-10-10' },
		{ id: 'antigravity-blog-2', title: 'Introducing Google Antigravity 2.0', url: 'https://antigravity.google/blog/introducing-google-antigravity-2', publisher: 'Google', checked: '2026-10-10' },
		{ id: 'antigravity-changelog', title: 'Changelog', url: 'https://antigravity.google/docs/changelog', publisher: 'Google', checked: '2026-10-10' },
		{ id: 'antigravity-changelog-md', title: 'Changelog (Markdown)', url: 'https://antigravity.google/docs/changelog.md', publisher: 'Google', checked: '2026-10-10' },
		{ id: 'antigravity-download', title: 'Download Google Antigravity', url: 'https://antigravity.google/download', publisher: 'Google', checked: '2026-10-10' },
		{ id: 'antigravity-releases', title: 'Google Antigravity Releases', url: 'https://antigravity.google/releases', publisher: 'Google', checked: '2026-10-10' },
		{ id: 'antigravity-getting-started', title: 'Getting started', url: 'https://antigravity.google/docs/getting-started', publisher: 'Google', checked: '2026-10-10' },
		{ id: 'antigravity-pricing', title: 'Pricing', url: 'https://antigravity.google/pricing', publisher: 'Google', checked: '2026-10-10' },
		{ id: 'antigravity-google-one', title: 'Google AI plans (United States)', url: 'https://one.google.com/intl/en_us/about/google-ai-plans/?hl=en&gl=US', publisher: 'Google', checked: '2026-10-10' },
		{ id: 'antigravity-plans', title: 'Plans', url: 'https://antigravity.google/docs/plans', publisher: 'Google', checked: '2026-10-10' },
		{ id: 'antigravity-models', title: 'Models', url: 'https://antigravity.google/docs/models', publisher: 'Google', checked: '2026-10-10' },
		{ id: 'antigravity-faq', title: 'FAQ', url: 'https://antigravity.google/docs/faq', publisher: 'Google', checked: '2026-10-10' },
		{ id: 'antigravity-enterprise', title: 'Antigravity in Gemini Enterprise', url: 'https://antigravity.google/docs/enterprise', publisher: 'Google', checked: '2026-10-10' },
		{ id: 'antigravity-terms', title: 'Google Antigravity Additional Terms of Service', url: 'https://antigravity.google/terms', publisher: 'Google', checked: '2026-10-10' },
		{ id: 'antigravity-acp-registry', title: 'antigravity-acp/agent.json', url: 'https://github.com/agentclientprotocol/registry/blob/main/antigravity-acp/agent.json', publisher: 'agentclientprotocol/registry on GitHub', checked: '2026-10-10' },
		{ id: 'antigravity-sdk-repo', title: 'google-antigravity/antigravity-sdk-python', url: 'https://github.com/google-antigravity/antigravity-sdk-python', publisher: 'google-antigravity/antigravity-sdk-python on GitHub', checked: '2026-10-10' },
		{ id: 'antigravity-cli-repo', title: 'google-antigravity/antigravity-cli', url: 'https://github.com/google-antigravity/antigravity-cli', publisher: 'google-antigravity/antigravity-cli on GitHub', checked: '2026-10-10' },
		{ id: 'antigravity-custom-agents', title: 'Introducing custom agents', url: 'https://antigravity.google/blog/introducing-custom-agents', publisher: 'Google', checked: '2026-10-10' },
		{ id: 'antigravity-zed', title: 'Zed', url: 'https://antigravity.google/docs/ide/extensions/zed', publisher: 'Google', checked: '2026-10-10' },
		{ id: 'antigravity-sandbox', title: 'Terminal sandbox', url: 'https://antigravity.google/docs/sandbox', publisher: 'Google', checked: '2026-10-10' },
		{ id: 'antigravity-task-groups', title: 'Task groups', url: 'https://antigravity.google/docs/tools', publisher: 'Google', checked: '2026-10-10' },
		{ id: 'antigravity-mcp', title: 'Model Context Protocol (MCP)', url: 'https://antigravity.google/docs/mcp', publisher: 'Google', checked: '2026-10-10' },
		{ id: 'antigravity-plugins', title: 'Plugins', url: 'https://antigravity.google/docs/plugins', publisher: 'Google', checked: '2026-10-10' },
		{ id: 'antigravity-projects', title: 'Projects', url: 'https://antigravity.google/docs/projects', publisher: 'Google', checked: '2026-10-10' },
		{ id: 'antigravity-subagents', title: 'Custom subagents', url: 'https://antigravity.google/docs/subagents', publisher: 'Google', checked: '2026-10-10' },
		{ id: 'antigravity-boost', title: 'Boost deep reasoning (/boost)', url: 'https://antigravity.google/docs/boost', publisher: 'Google', checked: '2026-10-10' },
		{ id: 'antigravity-teamwork', title: 'Teamwork agent teams (/teamwork-preview)', url: 'https://antigravity.google/docs/teamwork', publisher: 'Google', checked: '2026-10-10' },
		{ id: 'antigravity-sidecars', title: 'Sidecars', url: 'https://antigravity.google/docs/sidecars', publisher: 'Google', checked: '2026-10-10' },
		{ id: 'antigravity-artifact-review', title: 'Artifact review', url: 'https://antigravity.google/docs/artifact-review', publisher: 'Google', checked: '2026-10-10' },
		{ id: 'antigravity-vcs-blog', title: 'Improving the version control experience', url: 'https://antigravity.google/blog/vcs-and-terminal', publisher: 'Google', checked: '2026-10-10' },
		{ id: 'antigravity-remote-control', title: 'Remote Control', url: 'https://antigravity.google/docs/remote-control', publisher: 'Google', checked: '2026-10-10' },
		{ id: 'antigravity-remote-blog', title: 'Antigravity anywhere with Remote Control', url: 'https://antigravity.google/blog/remote-control-for-antigravity', publisher: 'Google', checked: '2026-10-10' }
	]
};
