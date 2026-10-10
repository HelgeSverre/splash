// Splash vs Vibe Island. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const VIBE_ISLAND: Comparison = {
	slug: 'vibe-island',
	name: 'Vibe Island',
	description: 'How Splash and Vibe Island compare on agents, platforms, pricing, approvals and remote use, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Vibe Island both help you follow several coding agents at once. Vibe Island is a macOS notch panel that monitors agents you start in your own terminals and editors, through hooks and plugins it installs in them. Splash is a desktop app that starts the agents itself over the Agent Client Protocol and shows each conversation.',
	other: {
		name: 'Vibe Island',
		url: 'https://vibeisland.app/',
		maker: 'Built on Taste',
		summary: 'A native macOS app that turns the notch into a status panel for coding agents running in your terminals and editors. It alerts you, takes approvals from supported agents and jumps back to each session.',
		cite: ['vibe-island-home', 'vibe-island-app-store', 'vibe-island-approve-guide', 'vibe-island-precise-jump']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'A macOS notch panel that monitors coding agents running in your own terminals and editors; it launches none itself', cite: ['vibe-island-home', 'vibe-island-app-store', 'vibe-island-multi-agent'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'Direct v1.0.51 (26 September 2026) and App Store 1.0.52 (8 October 2026, its first release); about 50 releases since March 2026', cite: ['vibe-island-changelog', 'vibe-island-app-store-data'] } },
				{ label: 'License', splash: S.license, other: { text: 'Proprietary and closed source; the public GitHub repository holds bug reports and discussions, not code', cite: ['vibe-island-terms', 'vibe-island-repo'] } },
				{ label: 'Price', splash: S.price, other: { text: '$19.99 one-time for one Mac plus $10 per extra Mac ($14.99 early-bird price on 10 October 2026); App Store unlock $29.99', cite: ['vibe-island-home', 'vibe-island-price-api', 'vibe-island-app-store'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 14+ on Apple silicon and Intel, via direct download, Homebrew or the Mac App Store; no other systems', cite: ['vibe-island-session-tracker', 'vibe-island-home', 'vibe-island-app-store'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Native Swift with no Electron, drawn as an overlay that never takes focus from the app you’re in', cite: ['vibe-island-home', 'vibe-island-repo'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'The FAQ lists 30, among them Claude Code, Codex, Gemini CLI, Cursor and OpenCode; the changelog adds apps like Codex Desktop', cite: ['vibe-island-home', 'vibe-island-changelog'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'It doesn’t run them; hooks or plugins it installs in each agent report over a local socket, and OpenCode over HTTP', cite: ['vibe-island-app-store', 'vibe-island-privacy', 'vibe-island-changelog', 'vibe-island-opencode'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Agents keep their own logins and plans; the usage view reads credentials their CLIs already store on the Mac', cite: ['vibe-island-usage', 'vibe-island-privacy'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'None; a direct license key activates per Mac with a hashed hardware ID, and App Store purchases go through Apple', cite: ['vibe-island-app-store', 'vibe-island-privacy'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Approve, deny or answer in the notch for Claude Code, OpenCode, Codex, Copilot CLI and more; others get alerts and jump-back', mark: 'partial', cite: ['vibe-island-approve-guide', 'vibe-island-opencode', 'vibe-island-claude-code', 'vibe-island-changelog'] } },
				{ label: 'Model and mode pickers', splash: S.models, other: { text: 'Cards show each agent’s model and reasoning effort; a Bypass button switches Claude Code sessions out of per-tool approval', mark: 'partial', cite: ['vibe-island-changelog'] } },
				{ label: 'Usage and limits', hint: 'Plan limits, context and cost', splash: { text: 'Shows context use and cost when the agent reports them', mark: 'yes', cite: ['splash-features'] }, other: { text: 'Plan quota for Claude, Codex, Kimi, GLM, DeepSeek, Grok, Cursor and others; token and cost breakdowns per day, month and model', mark: 'yes', cite: ['vibe-island-home', 'vibe-island-changelog', 'vibe-island-ccusage'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Creates no worktrees or sandboxes; cards flag sessions already in a git worktree, and a Settings guide covers Docker', mark: 'no', cite: ['vibe-island-changelog', 'vibe-island-multi-agent'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'None built in; clicks jump to the agent’s pane in iTerm2, Ghostty, tmux and others, or its app in App Store builds', mark: 'no', cite: ['vibe-island-home', 'vibe-island-precise-jump', 'vibe-island-jump-rules'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Live status for every session in the notch; approvals and questions queue as cards, with sounds and optional follow-up reminders', mark: 'yes', cite: ['vibe-island-approve-guide', 'vibe-island-home', 'vibe-island-changelog'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'macOS notifications when sessions finish; optional pushes to an iPhone and Apple Watch through the free, third-party Bark app', mark: 'yes', cite: ['vibe-island-codex', 'vibe-island-iphone'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Approve Claude Code plans, rendered as Markdown, or send them back with feedback; the site’s demo shows diffs on edit requests', mark: 'partial', cite: ['vibe-island-claude-code', 'vibe-island-home', 'vibe-island-changelog'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Not documented; the GitHub repository is the app’s public issue tracker', mark: 'unknown', cite: ['vibe-island-repo'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'None; the app works locally without a cloud service, watching agents on your Mac or your own SSH hosts', mark: 'no', cite: ['vibe-island-home', 'vibe-island-ssh'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'Beta SSH Remote puts a 2.5 MB helper on Linux, macOS or FreeBSD hosts that relays status and approvals over SSH', mark: 'partial', cite: ['vibe-island-ssh', 'vibe-island-changelog'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'No mobile app; the third-party Bark app can push alerts to an iPhone, while approving and answering stay on the Mac', mark: 'no', cite: ['vibe-island-iphone', 'vibe-island-app-store'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Updates arrive automatically through the in-app updater; a direct license includes one year of them, and renewing is optional', mark: 'yes', cite: ['vibe-island-changelog', 'vibe-island-terms'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Shows live sessions wherever they started, with titles and recaps read from their session files; browsing past sessions isn’t documented', mark: 'partial', cite: ['vibe-island-privacy', 'vibe-island-changelog'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Not documented; a keyboard Session Switcher moves between live sessions', mark: 'unknown', cite: ['vibe-island-changelog'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Vibe Island starts no agents. It installs hooks, plugins or IDE extensions into the agents it finds, which report over a local Unix socket; OpenCode connects over HTTP, and the beta <strong>Custom Agents</strong> docs (v1.0.53+) add a <code>vibe-island-bridge</code> command. Its pages don’t mention ACP. Splash starts each agent itself and speaks the <strong>Agent Client Protocol</strong> over stdio.',
			cite: ['vibe-island-privacy', 'vibe-island-changelog', 'vibe-island-opencode', 'vibe-island-custom-agents', 'splash-registry', 'acp']
		},
		{
			title: 'Where the work happens',
			text: 'Agents watched by Vibe Island stay in your terminals and editors; the notch shows their status, takes approvals for supported agents, and a click jumps to the right tab or pane. Its docs describe no built-in terminal, file tree or changes view. Splash holds the conversation, a review screen, git changes, a file tree and a terminal in one window.',
			cite: ['vibe-island-app-store', 'vibe-island-approve-guide', 'vibe-island-precise-jump', 'vibe-island-claude-code', 'splash-features']
		},
		{
			title: 'Price, license and editions',
			text: 'Vibe Island is closed source. The direct edition is a one-time purchase per Mac that includes a year of updates, with a 2-day trial and a free mode for core monitoring after it. The App Store edition, a separate purchase with a 7-day trial, has no custom jump rules or custom agents. Splash is free and MIT-licensed.',
			cite: ['vibe-island-terms', 'vibe-island-home', 'vibe-island-ssh', 'vibe-island-app-store', 'vibe-island-support', 'vibe-island-jump-rules', 'vibe-island-custom-agents-guide', 'splash-license', 'splash-download']
		},
		{
			title: 'Platforms and remote machines',
			text: 'Vibe Island needs macOS 14 or later. Its beta SSH Remote puts a small helper on Linux, macOS or FreeBSD hosts that relays agent status and approvals to the Mac, and alerts can reach an iPhone through Bark. Splash builds for macOS, Windows and Ubuntu, and <code>splash-server</code> runs sessions on a remote machine you use from a browser.',
			cite: ['vibe-island-session-tracker', 'vibe-island-ssh', 'vibe-island-changelog', 'vibe-island-iphone', 'splash-install', 'splash-server']
		}
	],
	fit: {
		splash: [
			'You want an app that starts your agents and shows each conversation as a transcript you can review in one window.',
			'You work on Windows or Ubuntu as well as macOS, or want sessions on your own server through a browser.',
			'You want each session in its own git worktree, with a terminal, file tree and diffs beside it.',
			'You want a free, MIT-licensed app with transcript search, imported agent history and a GitHub view.'
		],
		other: [
			'You want to keep agents in your usual terminals and IDEs and follow all of them from the Mac’s notch.',
			'You want to approve requests and answer questions from supported agents in the notch, then land in the right terminal pane.',
			'You want plan quotas and token costs for Claude, Codex and other providers in view while you work.',
			'You want status from agents on your SSH hosts and alerts pushed to your iPhone.'
		]
	},
	sources: [
		{ id: 'vibe-island-home', title: 'Dynamic Island for Your AI Agents', url: 'https://vibeisland.app/', publisher: 'Built on Taste', checked: '2026-10-10' },
		{ id: 'vibe-island-app-store', title: 'Vibe Island: AI Agent Monitor', url: 'https://apps.apple.com/us/app/vibe-island-ai-agent-monitor/id6818366218', publisher: 'Apple App Store', checked: '2026-10-10' },
		{ id: 'vibe-island-approve-guide', title: 'Approve AI Agent Permissions from Your Notch', url: 'https://vibeisland.app/guides/approve-ai-agent-permissions-from-notch/', publisher: 'Built on Taste', checked: '2026-10-10' },
		{ id: 'vibe-island-precise-jump', title: 'Jump to AI Agent Terminal Tab on Mac', url: 'https://vibeisland.app/precise-jump/', publisher: 'Built on Taste', checked: '2026-10-10' },
		{ id: 'vibe-island-multi-agent', title: 'Run Multiple AI Agents in Parallel on Mac', url: 'https://vibeisland.app/multi-agent/', publisher: 'Built on Taste', checked: '2026-10-10' },
		{ id: 'vibe-island-changelog', title: 'Changelog', url: 'https://vibeisland.app/changelog/', publisher: 'Built on Taste', checked: '2026-10-10' },
		{ id: 'vibe-island-app-store-data', title: 'Vibe Island: AI Agent Monitor App Store listing data', url: 'https://itunes.apple.com/lookup?id=6818366218&country=us', publisher: 'Apple', checked: '2026-10-10' },
		{ id: 'vibe-island-terms', title: 'Terms of Service', url: 'https://vibeisland.app/terms/', publisher: 'Built on Taste', checked: '2026-10-10' },
		{ id: 'vibe-island-repo', title: 'vibeislandapp/vibe-island', url: 'https://github.com/vibeislandapp/vibe-island', publisher: 'vibeislandapp/vibe-island on GitHub', checked: '2026-10-10' },
		{ id: 'vibe-island-price-api', title: 'Current price API', url: 'https://api.vibeisland.app/api/current-price', publisher: 'Built on Taste', checked: '2026-10-10' },
		{ id: 'vibe-island-session-tracker', title: 'AI Coding Session Monitor for Mac Notch', url: 'https://vibeisland.app/ai-coding-session-tracker/', publisher: 'Built on Taste', checked: '2026-10-10' },
		{ id: 'vibe-island-privacy', title: 'Privacy Policy', url: 'https://vibeisland.app/privacy/', publisher: 'Built on Taste', checked: '2026-10-10' },
		{ id: 'vibe-island-opencode', title: 'Monitor OpenCode on Mac', url: 'https://vibeisland.app/opencode/', publisher: 'Built on Taste', checked: '2026-10-10' },
		{ id: 'vibe-island-usage', title: 'Track AI Coding Agent Usage on Mac', url: 'https://vibeisland.app/usage/', publisher: 'Built on Taste', checked: '2026-10-10' },
		{ id: 'vibe-island-claude-code', title: 'Monitor Claude Code from Your MacBook Notch', url: 'https://vibeisland.app/claude-code/', publisher: 'Built on Taste', checked: '2026-10-10' },
		{ id: 'vibe-island-ccusage', title: 'ccusage Alternative', url: 'https://vibeisland.app/ccusage-alternative/', publisher: 'Built on Taste', checked: '2026-10-10' },
		{ id: 'vibe-island-jump-rules', title: 'Custom Jump Rules', url: 'https://vibeisland.app/docs/custom-jump-rules/', publisher: 'Built on Taste', checked: '2026-10-10' },
		{ id: 'vibe-island-codex', title: 'Monitor OpenAI Codex CLI on Mac', url: 'https://vibeisland.app/codex/', publisher: 'Built on Taste', checked: '2026-10-10' },
		{ id: 'vibe-island-iphone', title: 'iPhone notifications', url: 'https://vibeisland.app/docs/iphone-notifications/', publisher: 'Built on Taste', checked: '2026-10-10' },
		{ id: 'vibe-island-ssh', title: 'Monitor Remote AI Agents via SSH', url: 'https://vibeisland.app/ssh-remote/', publisher: 'Built on Taste', checked: '2026-10-10' },
		{ id: 'vibe-island-custom-agents', title: 'Custom Agents (Beta)', url: 'https://vibeisland.app/docs/custom-agents/', publisher: 'Built on Taste', checked: '2026-10-10' },
		{ id: 'vibe-island-support', title: 'Support', url: 'https://vibeisland.app/support/', publisher: 'Built on Taste', checked: '2026-10-10' },
		{ id: 'vibe-island-custom-agents-guide', title: 'Custom Agents: integration guide (Beta)', url: 'https://vibeisland.app/docs/custom-agents-agent-guide/', publisher: 'Built on Taste', checked: '2026-10-10' }
	]
};
