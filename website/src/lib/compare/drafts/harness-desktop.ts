// Splash vs Harness. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const HARNESS_DESKTOP: Comparison = {
	slug: 'harness-desktop',
	name: 'Harness',
	description: 'How Splash and Harness compare on agents, platforms, accounts, worktrees, remote machines and review, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Harness both run several coding agents side by side and can give each its own git worktree. Harness, from Autonomous, runs each agent’s own CLI in a tmux pane on every machine you link, with desktop, web, phone and terminal clients. Splash, a desktop app with a headless server, drives agents over the Agent Client Protocol.',
	other: {
		name: 'Harness',
		url: 'https://www.autonomous.ai/harness',
		maker: 'Autonomous',
		summary: 'A free, MIT-licensed command center that runs 14 coding-agent CLIs in tmux panes on every machine you link, with a native desktop app, phone viewers, a terminal client and an optional desk device.',
		cite: ['harness-desktop-home', 'harness-desktop-app', 'harness-desktop-readme', 'harness-desktop-engines', 'harness-desktop-license']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Native desktop app, plus a browser preview, phone viewers, the hn terminal client, a CLI and an optional desk device', cite: ['harness-desktop-home', 'harness-desktop-app', 'harness-desktop-desktop-readme', 'harness-desktop-tui'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'Desktop 1.2.63 (9 October 2026), the 140th desktop release since 11 September; the browser version is a public preview', cite: ['harness-desktop-release', 'harness-desktop-releases', 'harness-desktop-desktop-readme'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (MIT): app, daemon, CLI, relay and device firmware; Store packages’ wrapped tools keep their licenses', cite: ['harness-desktop-license', 'harness-desktop-readme'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free app; the optional Harness Device costs $149. You pay separately for agent subscriptions, model use and rented servers', cite: ['harness-desktop-app', 'harness-desktop-home'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 12+ (Apple silicon and Intel) comes first; Linux x64 and arm64 AppImages, parity in progress; no Windows build', cite: ['harness-desktop-download', 'harness-desktop-release', 'harness-desktop-desktop-readme'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Flutter (Dart) desktop and web client with a patched xterm renderer; TypeScript CLI and daemon on Node.js 20+', cite: ['harness-desktop-desktop-readme', 'harness-desktop-architecture', 'harness-desktop-readme'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: '14 engines, including Claude Code, Codex, Cursor, OpenCode, Amp, GitHub Copilot and Grok Build; new ones arrive by pull request', cite: ['harness-desktop-readme', 'harness-desktop-engines', 'harness-desktop-extending'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Vendor CLIs in tmux panes run by each machine’s daemon, followed through the vendor’s hooks and transcripts, not ACP', cite: ['harness-desktop-readme', 'harness-desktop-cli', 'harness-desktop-engines', 'harness-desktop-architecture'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Agents use your own logins or API keys; a harness can also switch to OpenRouter or another OpenAI-compatible API', cite: ['harness-desktop-app', 'harness-desktop-engines', 'harness-desktop-api-connections'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'A Harness sign-in via Google, Apple or a phone QR code; developer docs say the daemon won’t start without it', cite: ['harness-desktop-cli', 'harness-desktop-development'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Answered in the engine’s own dialog; new harnesses use its auto-approve mode where one exists, and Advanced offers its bypass flag', mark: 'yes', cite: ['harness-desktop-engines', 'harness-desktop-app-docs'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Connectors expose 86 catalog services, such as Linear and Notion, as MCP servers to local Claude Code, Codex and OpenCode', mark: 'partial', cite: ['harness-desktop-connectors', 'harness-desktop-connector-catalog'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A git worktree on its own branch per harness, on by default in Git projects and switchable per launch', mark: 'yes', cite: ['harness-desktop-readme', 'harness-desktop-new-harness', 'harness-desktop-git-worktree'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'Agent panes are full terminals with find, clickable links and scrollback restored on reattach; ⇧⌘T opens a project terminal', mark: 'yes', cite: ['harness-desktop-app-docs', 'harness-desktop-keyboard'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'An agent’s question puts an amber ring on its pane and lights the titlebar bell; ⇧⌘I lists all waiting agents', mark: 'yes', cite: ['harness-desktop-app-docs'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'System notifications, off until you accept a one-time offer; clicking one opens the agent on macOS but not on Linux', mark: 'yes', cite: ['harness-desktop-notifications'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Change agent leaves handoff files for the next engine; experimental, off-by-default swarms let agents in a tab consult each other', mark: 'partial', cite: ['harness-desktop-cli', 'harness-desktop-readme', 'harness-desktop-tab-channels'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Not documented; feedback goes to the agent in its own pane, and Store harness viewers inspect what agents produce', mark: 'unknown', cite: ['harness-desktop-architecture', 'harness-desktop-app-docs', 'harness-desktop-store'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Agents may open PRs, and the app records their URLs; its PR view is read-only and never pushes or merges', mark: 'no', cite: ['harness-desktop-worktree-prs'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'A read-only dialog shows a session’s branches and the state of their GitHub PRs; CI checks aren’t documented', mark: 'partial', cite: ['harness-desktop-worktree-prs'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'No in-app issue linking is documented; Linear, Atlassian, Asana, GitHub and others reach agents as MCP tools via Connectors', mark: 'partial', cite: ['harness-desktop-app-docs', 'harness-desktop-connectors', 'harness-desktop-connector-catalog'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Links your machines via a Harness account and per-machine remote password, without SSH or port forwarding; terminals stream end-to-end encrypted', mark: 'yes', cite: ['harness-desktop-readme', 'harness-desktop-app', 'harness-desktop-cli'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'iPhone (iOS 15+) and Android apps view linked machines and reply to agents; the phone never runs agents itself', mark: 'yes', cite: ['harness-desktop-app-store', 'harness-desktop-play', 'harness-desktop-mobile', 'harness-desktop-app'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'The desktop app updates itself, and each machine’s daemon installs new CLI releases from a signed manifest within a minute', mark: 'yes', cite: ['harness-desktop-release', 'harness-desktop-architecture'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Sessions launched outside Harness aren’t picked up; a 9 October design note covers adopting them', mark: 'no', cite: ['harness-desktop-cli', 'harness-desktop-external-sessions'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: '⌘P finds harnesses, projects, machines, tabs, commands and history; ⌘F searches the text of one pane', mark: 'partial', cite: ['harness-desktop-app-docs'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Harness runs each vendor’s CLI in a tmux pane owned by a per-machine daemon and follows its turns through the vendor’s own hooks and transcript files, not ACP; hosted agent platforms can join through an eight-method JSON-RPC provider protocol. Splash drives every agent over the <strong>Agent Client Protocol</strong>, natively or through a pinned adapter for the vendor’s CLI.',
			cite: ['harness-desktop-engines', 'harness-desktop-cli', 'harness-desktop-architecture', 'harness-desktop-provider', 'harness-desktop-extending', 'splash-registry', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'Harness targets macOS 12+ first, with Linux AppImages still reaching parity and no Windows build. A daemon runs on each linked machine, headless Linux servers included, and the desktop, web, phone and <code>hn</code> clients reach all of them. Splash runs on macOS 14+, Windows 11 and Ubuntu 24.04, or as <code>splash-server</code> on one machine you open over an SSH tunnel.',
			cite: ['harness-desktop-download', 'harness-desktop-desktop-readme', 'harness-desktop-release', 'harness-desktop-cli', 'harness-desktop-tui', 'harness-desktop-mobile', 'splash-install', 'splash-server']
		},
		{
			title: 'Accounts, price and license',
			text: 'Both apps are free and MIT-licensed. Harness also sells a $149 desk device, and its current source needs a Harness sign-in to start; its relay keeps machine records, agent names and daily counters, never transcripts or keystrokes. Splash has no accounts; <code>splash-server</code> asks for a token kept in its data folder.',
			cite: ['harness-desktop-license', 'harness-desktop-app', 'harness-desktop-home', 'harness-desktop-development', 'harness-desktop-architecture', 'splash-license', 'splash-download', 'splash-build', 'splash-server']
		},
		{
			title: 'What each is built around',
			text: 'Harness centers on terminals across machines: tmux-style keys, a desk device, Store packages for other domains, Connectors and experimental agent swarms, with a read-only PR view and no documented diff review. Splash centers on the conversation: a review screen with every changed file as a diff, a Needs attention queue, and search and import of past sessions.',
			cite: ['harness-desktop-tui', 'harness-desktop-home', 'harness-desktop-readme', 'harness-desktop-store', 'harness-desktop-connectors', 'harness-desktop-tab-channels', 'harness-desktop-worktree-prs', 'splash-features', 'splash-history']
		}
	],
	fit: {
		splash: [
			'You want a free, MIT-licensed app that needs no account.',
			'You use Windows, or want sessions on your own server reached over SSH.',
			'You want to review every changed file as a diff and send the agent feedback from one screen.',
			'You want to import conversations your agents started elsewhere and search their saved text.'
		],
		other: [
			'You want each agent’s own terminal interface, with tmux-style keys, on the desktop or in the hn terminal client.',
			'You want to link several machines, headless Linux servers included, without SSH keys or port forwarding.',
			'You want iPhone and Android apps that follow your agents and reply when one asks.',
			'You want to connect services such as Linear and Notion to Claude Code, Codex and OpenCode once per computer.'
		]
	},
	sources: [
		{ id: 'harness-desktop-home', title: 'Harness', url: 'https://www.autonomous.ai/harness', publisher: 'Autonomous', checked: '2026-10-10' },
		{ id: 'harness-desktop-app', title: 'Harness App', url: 'https://www.autonomous.ai/harness-app', publisher: 'Autonomous', checked: '2026-10-10' },
		{ id: 'harness-desktop-download', title: 'Harness desktop download', url: 'https://harness.autonomous.ai/desktop', publisher: 'Autonomous', checked: '2026-10-10' },
		{ id: 'harness-desktop-readme', title: 'README.md', url: 'https://github.com/autonomous-ai/openharness/blob/main/README.md', publisher: 'autonomous-ai/openharness on GitHub', checked: '2026-10-10' },
		{ id: 'harness-desktop-license', title: 'LICENSE', url: 'https://github.com/autonomous-ai/openharness/blob/main/LICENSE', publisher: 'autonomous-ai/openharness on GitHub', checked: '2026-10-10' },
		{ id: 'harness-desktop-desktop-readme', title: 'desktop/README.md', url: 'https://github.com/autonomous-ai/openharness/blob/main/desktop/README.md', publisher: 'autonomous-ai/openharness on GitHub', checked: '2026-10-10' },
		{ id: 'harness-desktop-tui', title: 'tui/README.md', url: 'https://github.com/autonomous-ai/openharness/blob/main/tui/README.md', publisher: 'autonomous-ai/openharness on GitHub', checked: '2026-10-10' },
		{ id: 'harness-desktop-mobile', title: 'mobile/README.md', url: 'https://github.com/autonomous-ai/openharness/blob/main/mobile/README.md', publisher: 'autonomous-ai/openharness on GitHub', checked: '2026-10-10' },
		{ id: 'harness-desktop-architecture', title: 'docs/architecture.md', url: 'https://github.com/autonomous-ai/openharness/blob/main/docs/architecture.md', publisher: 'autonomous-ai/openharness on GitHub', checked: '2026-10-10' },
		{ id: 'harness-desktop-development', title: 'docs/development.md', url: 'https://github.com/autonomous-ai/openharness/blob/main/docs/development.md', publisher: 'autonomous-ai/openharness on GitHub', checked: '2026-10-10' },
		{ id: 'harness-desktop-cli', title: 'docs/cli.md', url: 'https://github.com/autonomous-ai/openharness/blob/main/docs/cli.md', publisher: 'autonomous-ai/openharness on GitHub', checked: '2026-10-10' },
		{ id: 'harness-desktop-engines', title: 'docs/engines.md', url: 'https://github.com/autonomous-ai/openharness/blob/main/docs/engines.md', publisher: 'autonomous-ai/openharness on GitHub', checked: '2026-10-10' },
		{ id: 'harness-desktop-extending', title: 'docs/extending.md', url: 'https://github.com/autonomous-ai/openharness/blob/main/docs/extending.md', publisher: 'autonomous-ai/openharness on GitHub', checked: '2026-10-10' },
		{ id: 'harness-desktop-provider', title: 'provider/README.md', url: 'https://github.com/autonomous-ai/openharness/blob/main/provider/README.md', publisher: 'autonomous-ai/openharness on GitHub', checked: '2026-10-10' },
		{ id: 'harness-desktop-app-docs', title: 'docs/app.md', url: 'https://github.com/autonomous-ai/openharness/blob/main/docs/app.md', publisher: 'autonomous-ai/openharness on GitHub', checked: '2026-10-10' },
		{ id: 'harness-desktop-keyboard', title: 'docs/keyboard.md', url: 'https://github.com/autonomous-ai/openharness/blob/main/docs/keyboard.md', publisher: 'autonomous-ai/openharness on GitHub', checked: '2026-10-10' },
		{ id: 'harness-desktop-api-connections', title: 'docs/api-connections.md', url: 'https://github.com/autonomous-ai/openharness/blob/main/docs/api-connections.md', publisher: 'autonomous-ai/openharness on GitHub', checked: '2026-10-10' },
		{ id: 'harness-desktop-connectors', title: 'cli/src/lib/connectors/README.md', url: 'https://github.com/autonomous-ai/openharness/blob/main/cli/src/lib/connectors/README.md', publisher: 'autonomous-ai/openharness on GitHub', checked: '2026-10-10' },
		{ id: 'harness-desktop-connector-catalog', title: 'cli/src/lib/connectors/assets/catalog.json', url: 'https://github.com/autonomous-ai/openharness/blob/main/cli/src/lib/connectors/assets/catalog.json', publisher: 'autonomous-ai/openharness on GitHub', checked: '2026-10-10' },
		{ id: 'harness-desktop-new-harness', title: 'desktop/lib/state/new_harness.dart', url: 'https://github.com/autonomous-ai/openharness/blob/main/desktop/lib/state/new_harness.dart', publisher: 'autonomous-ai/openharness on GitHub', checked: '2026-10-10' },
		{ id: 'harness-desktop-git-worktree', title: 'desktop/lib/core/git_worktree.dart', url: 'https://github.com/autonomous-ai/openharness/blob/main/desktop/lib/core/git_worktree.dart', publisher: 'autonomous-ai/openharness on GitHub', checked: '2026-10-10' },
		{ id: 'harness-desktop-notifications', title: 'desktop/lib/notify/system_notifications.dart', url: 'https://github.com/autonomous-ai/openharness/blob/main/desktop/lib/notify/system_notifications.dart', publisher: 'autonomous-ai/openharness on GitHub', checked: '2026-10-10' },
		{ id: 'harness-desktop-tab-channels', title: 'docs/tab-channels.md', url: 'https://github.com/autonomous-ai/openharness/blob/main/docs/tab-channels.md', publisher: 'autonomous-ai/openharness on GitHub', checked: '2026-10-10' },
		{ id: 'harness-desktop-store', title: 'store/README.md', url: 'https://github.com/autonomous-ai/openharness/blob/main/store/README.md', publisher: 'autonomous-ai/openharness on GitHub', checked: '2026-10-10' },
		{ id: 'harness-desktop-worktree-prs', title: 'docs/worktree-pull-requests.md', url: 'https://github.com/autonomous-ai/openharness/blob/main/docs/worktree-pull-requests.md', publisher: 'autonomous-ai/openharness on GitHub', checked: '2026-10-10' },
		{ id: 'harness-desktop-external-sessions', title: 'docs/design/2026-10-09-external-session-boundary.md', url: 'https://github.com/autonomous-ai/openharness/blob/main/docs/design/2026-10-09-external-session-boundary.md', publisher: 'autonomous-ai/openharness on GitHub', checked: '2026-10-10' },
		{ id: 'harness-desktop-release', title: 'Harness Desktop 1.2.63', url: 'https://github.com/autonomous-ai/openharness/releases/tag/v1.2.63_desktop', publisher: 'autonomous-ai/openharness on GitHub', checked: '2026-10-10' },
		{ id: 'harness-desktop-releases', title: 'Releases', url: 'https://github.com/autonomous-ai/openharness/releases', publisher: 'autonomous-ai/openharness on GitHub', checked: '2026-10-10' },
		{ id: 'harness-desktop-app-store', title: 'Harness: Like a Boss', url: 'https://apps.apple.com/us/app/harness-like-a-boss/id6812264068', publisher: 'Apple App Store', checked: '2026-10-10' },
		{ id: 'harness-desktop-play', title: 'Harness: Like a Boss', url: 'https://play.google.com/store/apps/details?id=ai.autonomous.harness.android', publisher: 'Google Play', checked: '2026-10-10' }
	]
};
