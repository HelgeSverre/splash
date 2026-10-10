// Splash vs Armada. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const ARMADA: Comparison = {
	slug: 'armada',
	name: 'Armada',
	description: 'How Splash and Armada compare on agents, platforms, pricing, attention, usage limits and history, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Armada both help you follow several coding agents at once. Armada is a macOS menu bar app that watches the Claude Code, Codex and Grok Build sessions on your Mac by reading the files they write, and starts new ones in your own terminal. Splash is a desktop app that runs agents itself over the Agent Client Protocol.',
	other: {
		name: 'Armada',
		url: 'https://armada.mgcrea.io/',
		maker: 'Magenta Creations',
		summary: 'A native macOS menu bar app that watches Claude Code, Codex and Grok Build sessions across accounts, shows what needs you and each account’s plan limits, and starts sessions in your terminal.',
		cite: ['armada-home', 'armada-repo']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Mac menu bar app with a main window that watches agent sessions and plan limits; it starts sessions without hosting them', cite: ['armada-home', 'armada-support', 'armada-readme'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: '1.10.0, released 5 October 2026; 1.0.0 came out on 14 September 2026, with ten releases since', cite: ['armada-1-10-0', 'armada-changelog', 'armada-releases'] } },
				{ label: 'License', splash: S.license, other: { text: 'Source-available app code: read, change and build it yourself, but no binary distribution. Docs, design files and scripts are MIT', cite: ['armada-license-app', 'armada-readme', 'armada-license-root'] } },
				{ label: 'Price', splash: S.price, other: { text: '$14.99 once (€14.99 with EU VAT) for all 1.x versions; 30-minute trial, no free tier; 2.0 is a new purchase', cite: ['armada-home', 'armada-terms'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 26 or later; Apple silicon or Intel support isn’t stated. No Windows, Linux, web or mobile client is documented', cite: ['armada-home', 'armada-appcast'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Native macOS app in Swift, built with Xcode 26; the repository’s docs refer to SwiftUI views', cite: ['armada-repo', 'armada-readme', 'armada-implementation'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code (read most fully), Codex (which its makers call a spike) and Grok Build; adding others isn’t documented', cite: ['armada-home'] } },
				{ label: 'How it runs agents', hint: 'The protocol or interface', splash: S.protocol, other: { text: 'Reads the session files agents write, watched with FSEvents; new sessions run the vendor’s own CLI in your terminal app', cite: ['armada-home', 'armada-terminal-app', 'armada-new-session'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Uses the CLI logins you already have, several accounts per vendor; it holds no vendor credentials. Sessions use your own plans', cite: ['armada-home', 'armada-privacy'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'No account; purchases go through Stripe, and the license key is checked offline', cite: ['armada-home', 'armada-privacy'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Shows what a waiting Claude Code session wants; you answer in its terminal, raised by Focus. Grok Build prompts aren’t read', mark: 'partial', cite: ['armada-home'] } },
				{ label: 'Usage and limits', hint: 'Plan limits, context and cost', splash: { text: 'Shows context use and cost when the agent reports them', mark: 'yes', cite: ['splash-features'] }, other: { text: '5-hour and 7-day plan windows with a pace forecast, context fill, prompt-cache timers and per-project tokens; Grok has a weekly allowance', mark: 'yes', cite: ['armada-home', 'armada-readme', 'armada-changelog-md'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'An opt-in MCP server on 127.0.0.1 lets Claude Code, Codex, Cursor and others read sessions; write tools need Allow writes', mark: 'yes', cite: ['armada-home', 'armada-changelog-md', 'armada-readme'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Creates no worktrees, branches or sandboxes; the Projects pane shows live sessions in a saved folder, including worktrees you made', mark: 'no', cite: ['armada-readme'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'None built in; it starts sessions in Terminal, Ghostty or iTerm, or new Claude Code ones in a VS Code tab', mark: 'no', cite: ['armada-home', 'armada-releases', 'armada-changelog-md'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Claude Code sessions ranked by what needs you, ringing the menu bar; Codex and Grok Build show working, waiting or ended', mark: 'partial', cite: ['armada-home', 'armada-changelog-md'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'Optional warnings before a prompt cache expires and a notice when a Codex schedule changes; none documented for waiting sessions', mark: 'partial', cite: ['armada-changelog-md', 'armada-1-10-0'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'With Allow writes and message delivery on, an agent connected to Armada’s MCP server can message a running Claude Code session', mark: 'partial', cite: ['armada-changelog-md'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'A read-only Schedules pane lists Codex automations and the Claude app’s tasks; an agent can change the Codex ones via MCP', mark: 'partial', cite: ['armada-1-10-0'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'No diff or review view; Read Transcript shows a Claude Code session’s turns, thinking and tool calls, with live Follow', mark: 'no', cite: ['armada-home', 'armada-releases'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'None documented: no pull requests, CI status or issues. GitHub hosts Armada’s source code and releases', mark: 'no', cite: ['armada-repo', 'armada-releases'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Local only: one Mac, one user, nothing synced to other machines; Focus can’t raise sessions in tmux, over ssh or headless', mark: 'no', cite: ['armada-design', 'armada-home', 'armada-changelog-md'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Sparkle updates from an appcast once you turn the check on; updates within a major version are free', mark: 'yes', cite: ['armada-terms', 'armada-privacy', 'armada-appcast'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Lists live sessions started anywhere; History shows ended Claude Code sessions to resume, read or continue on another account', mark: 'yes', cite: ['armada-home', 'armada-releases'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'History searches ended Claude Code sessions by title or folder; searching transcript text isn’t documented', mark: 'partial', cite: ['armada-releases'] } },
				{ label: 'Fork a conversation', splash: S.fork, other: { text: 'Forks Claude Code, Codex and Grok Build sessions into your terminal; Claude Code and Codex use their own fork commands', mark: 'yes', cite: ['armada-readme', 'armada-changelog-md'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Armada hosts no agents: it reads the session files Claude Code, Codex and Grok Build write, and starts new sessions by handing a script to Terminal, Ghostty or iTerm. It uses ACP only to ask Grok Build for its usage allowance. Splash starts each agent as a child process and speaks the <strong>Agent Client Protocol</strong> with it.',
			cite: ['armada-home', 'armada-terminal-app', 'armada-grok-control', 'splash-readme', 'splash-registry', 'acp']
		},
		{
			title: 'Status or conversation',
			text: 'Armada centers on status: which Claude Code sessions need you and why, context fill, prompt-cache timers and token totals. You reply in each session’s own terminal, which Focus raises for Claude Code, and read Claude Code transcripts in a viewer. Splash shows each conversation as a transcript where you prompt, answer permission requests and review changed files.',
			cite: ['armada-home', 'armada-market-intel', 'armada-releases', 'splash-features']
		},
		{
			title: 'Several accounts',
			text: 'Armada reads several accounts per vendor from separate config folders and shows each account’s plan windows. When a Claude Code session hits one account’s limit, it can continue on another, and sessions can move between Claude accounts. Splash runs each agent with the login its CLI already has and shows context and cost when the agent reports them.',
			cite: ['armada-home', 'armada-changelog', 'splash-agents', 'splash-features']
		},
		{
			title: 'Price and license',
			text: 'Armada is a $14.99 one-time purchase covering all 1.x releases, with a 30-minute trial, and self-compiled builds also ask for a license key. The app code is source-available, with binary redistribution reserved; GitHub labels the repository MIT from its root LICENSE, and the README applies MIT to docs, design files and scripts. Splash is free and MIT-licensed.',
			cite: ['armada-home', 'armada-terms', 'armada-license-app', 'armada-github-api', 'armada-license-root', 'armada-readme', 'splash-license', 'splash-download']
		},
		{
			title: 'Where it runs',
			text: 'Armada runs on macOS 26 or later and stays on one Mac: nothing syncs between machines, and no web or phone client is documented. Splash builds for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64, and <code>splash-server</code> runs sessions on a machine you open in a browser through an SSH tunnel.',
			cite: ['armada-home', 'armada-appcast', 'armada-design', 'splash-install', 'splash-server']
		}
	],
	fit: {
		splash: [
			'You want an app that runs your agents and shows each conversation as a transcript you prompt, review and answer permission requests in.',
			'You want each session in its own git worktree, with a terminal, file tree and diffs beside it.',
			'You use Windows or Ubuntu as well as macOS, or want sessions on your own server through a browser.',
			'You want a free, MIT-licensed app that drives Gemini, Copilot, Goose and other agents besides Claude Code and Codex.'
		],
		other: [
			'You want to keep Claude Code, Codex and Grok Build in your own terminals and follow every session from the menu bar.',
			'You want each account’s 5-hour and 7-day plan windows, context fill and token totals in view while you work.',
			'You use several accounts per vendor and want Claude Code sessions to continue on another account when one hits its limit.',
			'You want agents to read your sessions through a local MCP server on your Mac.'
		]
	},
	sources: [
		{ id: 'armada-home', title: 'Every Claude Code and Codex session and limit, on one screen', url: 'https://armada.mgcrea.io/', publisher: 'Magenta Creations', checked: '2026-10-10' },
		{ id: 'armada-support', title: 'Support', url: 'https://armada.mgcrea.io/support/', publisher: 'Magenta Creations', checked: '2026-10-10' },
		{ id: 'armada-privacy', title: 'Privacy', url: 'https://armada.mgcrea.io/privacy/', publisher: 'Magenta Creations', checked: '2026-10-10' },
		{ id: 'armada-terms', title: 'Licence terms', url: 'https://armada.mgcrea.io/terms/', publisher: 'Magenta Creations', checked: '2026-10-10' },
		{ id: 'armada-changelog', title: 'Changelog', url: 'https://armada.mgcrea.io/changelog/', publisher: 'Magenta Creations', checked: '2026-10-10' },
		{ id: 'armada-1-10-0', title: 'Armada 1.10.0: Schedules, and a Mac that stays awake for your agents', url: 'https://armada.mgcrea.io/changelog/1.10.0/', publisher: 'Magenta Creations', checked: '2026-10-10' },
		{ id: 'armada-appcast', title: 'Armada appcast', url: 'https://armada.mgcrea.io/appcast.xml', publisher: 'Magenta Creations', checked: '2026-10-10' },
		{ id: 'armada-repo', title: 'mgcrea/armada', url: 'https://github.com/mgcrea/armada', publisher: 'mgcrea/armada on GitHub', checked: '2026-10-10' },
		{ id: 'armada-github-api', title: 'mgcrea/armada repository metadata', url: 'https://api.github.com/repos/mgcrea/armada', publisher: 'mgcrea/armada on GitHub', checked: '2026-10-10' },
		{ id: 'armada-readme', title: 'README.md', url: 'https://github.com/mgcrea/armada/blob/main/README.md', publisher: 'mgcrea/armada on GitHub', checked: '2026-10-10' },
		{ id: 'armada-license-root', title: 'LICENSE', url: 'https://github.com/mgcrea/armada/blob/main/LICENSE', publisher: 'mgcrea/armada on GitHub', checked: '2026-10-10' },
		{ id: 'armada-license-app', title: 'Armada Source-Available License (apps/apple/LICENSE)', url: 'https://github.com/mgcrea/armada/blob/main/apps/apple/LICENSE', publisher: 'mgcrea/armada on GitHub', checked: '2026-10-10' },
		{ id: 'armada-changelog-md', title: 'CHANGELOG.md', url: 'https://github.com/mgcrea/armada/blob/main/CHANGELOG.md', publisher: 'mgcrea/armada on GitHub', checked: '2026-10-10' },
		{ id: 'armada-releases', title: 'Releases', url: 'https://github.com/mgcrea/armada/releases', publisher: 'mgcrea/armada on GitHub', checked: '2026-10-10' },
		{ id: 'armada-design', title: 'docs/design.md', url: 'https://github.com/mgcrea/armada/blob/main/docs/design.md', publisher: 'mgcrea/armada on GitHub', checked: '2026-10-10' },
		{ id: 'armada-implementation', title: 'docs/implementation.md', url: 'https://github.com/mgcrea/armada/blob/main/docs/implementation.md', publisher: 'mgcrea/armada on GitHub', checked: '2026-10-10' },
		{ id: 'armada-market-intel', title: 'Market intelligence ledger (docs/market-intel.md)', url: 'https://github.com/mgcrea/armada/blob/main/docs/market-intel.md', publisher: 'mgcrea/armada on GitHub', checked: '2026-10-10' },
		{ id: 'armada-terminal-app', title: 'apps/apple/Armada/TerminalApp.swift', url: 'https://github.com/mgcrea/armada/blob/main/apps/apple/Armada/TerminalApp.swift', publisher: 'mgcrea/armada on GitHub', checked: '2026-10-10' },
		{ id: 'armada-new-session', title: 'apps/apple/Armada/NewSession.swift', url: 'https://github.com/mgcrea/armada/blob/main/apps/apple/Armada/NewSession.swift', publisher: 'mgcrea/armada on GitHub', checked: '2026-10-10' },
		{ id: 'armada-grok-control', title: 'apps/apple/Armada/GrokControl.swift', url: 'https://github.com/mgcrea/armada/blob/main/apps/apple/Armada/GrokControl.swift', publisher: 'mgcrea/armada on GitHub', checked: '2026-10-10' }
	]
};
