// Splash vs Happy. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const HAPPY: Comparison = {
	slug: 'happy',
	name: 'Happy',
	description: 'How Splash and Happy compare on agents, platforms, pricing, worktrees, sandboxing and phone access, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Happy are both free, open-source apps for running coding agents on your own machine. Happy Desktop drives Claude, Codex and Grok through its own agent runtime, Happy Agent, which supplies the tools, sandbox and permissions, and pairs with iOS and Android apps. Splash connects to each agent over the Agent Client Protocol.',
	other: {
		name: 'Happy',
		url: 'https://happy.engineering/',
		maker: 'Happy Engineering',
		summary: 'A macOS, Windows and Linux desktop app that drives Claude, Codex and Grok through a local agent daemon with its own sandbox and permissions, plus encrypted iOS and Android apps that control sessions.',
		cite: ['happy-desktop-app', 'happy-welcome', 'happy-how-it-works', 'happy-mobile']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app on a local agent daemon, Happy Agent, plus iOS, Android and web clients and a terminal UI', cite: ['happy-how-it-works', 'happy-repo', 'happy-terminal-guide'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'Desktop v0.0.93 (9 October 2026) with Happy Agent v0.4.86; the original happy CLI is now in maintenance mode', cite: ['happy-desktop-release', 'happy-agent-release', 'happy-security'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (MIT) for the desktop app, Happy Agent and the original CLI; adapted Grok Build code stays Apache-2.0', cite: ['happy-desktop-license', 'happy-agent-readme', 'happy-cli-package'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free, with no Happy plan for models; voice has a capped free tier, then an in-app subscription with no published price', cite: ['happy-home', 'happy-models', 'happy-faq', 'happy-app-realtime', 'happy-app-store'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon and Intel), Windows x64, Linux x64 and arm64 (AppImage); iOS 15.1+, Android and a web app', cite: ['happy-desktop-release', 'happy-quick-start', 'happy-app-store', 'happy-google-play', 'happy-repo'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Electron, React and TypeScript; agents, tools and the session database live in the separate Happy Agent daemon', cite: ['happy-desktop-package', 'happy-how-it-works'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude, Codex, Grok and Bedrock-hosted Claude and GPT models; the original CLI also runs Antigravity, OpenClaw and any ACP agent', cite: ['happy-welcome', 'happy-models', 'happy-cli-readme'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Happy Agent runs the loop and tools itself; inference goes through the Claude Agent SDK, Pi’s Codex transport and xAI’s Responses API', cite: ['happy-how-it-works', 'happy-agent-readme'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Reuses the Claude Code, Codex or Grok CLI login on the machine, or Bedrock credentials; requests go straight to the provider', cite: ['happy-models', 'happy-agent-readme'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'None for Desktop, which uses a signed-in provider CLI; the phone app creates an account with no email or password; teams sign in to Happy Social', cite: ['happy-how-it-works', 'happy-quick-start', 'happy-app-store', 'happy-multiplayer'] } },
				{ label: 'Model and mode pickers', splash: S.models, other: { text: 'Model, reasoning effort and permission mode can change mid-session, across providers, from the desktop or phone; the transcript stays', mark: 'yes', cite: ['happy-models', 'happy-desktop-app', 'happy-permissions'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Four modes; in Auto, the desktop default, a read-only agent reviews actions leaving the sandbox instead of asking you. The phone can answer requests', mark: 'yes', cite: ['happy-permissions', 'happy-mobile'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Stdio and Streamable HTTP servers in mcp.toml; Claude Code and Codex configs aren’t imported; each MCP tool requires Auto or Full access', mark: 'yes', cite: ['happy-extending', 'happy-permissions'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A git worktree on a new branch when parallel work could collide, or a folder copy without git; commands run in an OS sandbox except in Full access', mark: 'yes', cite: ['happy-workspaces', 'happy-permissions'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Setup commands such as pnpm install run in each new worktree; gitignored files like .env are copied and kept in sync', mark: 'yes', cite: ['happy-workspaces', 'happy-configuration'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'Terminals in the desktop app, including ones an agent opens; Happy Terminal offers the same harness as a TUI', mark: 'yes', cite: ['happy-how-it-works', 'happy-agents', 'happy-terminal-guide'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Agent questions show in the chat and in an experimental Inbox; a macOS Dock badge counts conversations waiting on you', mark: 'partial', cite: ['happy-agents', 'happy-how-it-works', 'happy-desktop-dock-badge'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'Push alerts on the phone when an agent is waiting on you or done; a completion chime on desktop', mark: 'yes', cite: ['happy-app-store', 'happy-desktop-chime'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Agents launch subagents, each picking its own model and running in Auto, up to three deep and five per tree, and message other agents by ID', mark: 'yes', cite: ['happy-agents'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'A main session can queue a message for itself or another agent to arrive hours or days later; waits of up to a day survive restarts', mark: 'yes', cite: ['happy-agents'] } },
				{ label: 'Team collaboration', splash: { text: 'splash-server is a personal, single-user service, not a multi-user deployment', mark: 'no', cite: ['splash-server'] }, other: { text: 'Invite someone into a live session; team servers are self-run, and adding teammates from the sidebar isn’t built yet', mark: 'yes', cite: ['happy-multiplayer'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Changed files beside the chat, diffed against the merge base with origin/main; line comments in the diff go to the agent', mark: 'yes', cite: ['happy-workspaces', 'happy-desktop-review-comment', 'happy-desktop-composer-attachment'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'No GitHub views among Desktop’s documented parts; the remote server setup can install and sign in the gh CLI', mark: 'no', cite: ['happy-how-it-works', 'happy-remote-server'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'Not offered; agents run on your computer, your own servers or a team server you run. The Vision page sketches a core agent that would live in the cloud', mark: 'no', cite: ['happy-desktop-app', 'happy-remote-server', 'happy-multiplayer', 'happy-vision'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'The Chief of Staff installs Happy Agent on a server over SSH; Desktop reaches it through built-in Tailcat with no account or open port', mark: 'yes', cite: ['happy-remote-server', 'happy-chief-of-staff'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'Encrypted iOS and Android apps and a web client: message agents, answer requests, switch models, read files and Git changes', mark: 'yes', cite: ['happy-mobile', 'happy-welcome', 'happy-app-store', 'happy-google-play', 'happy-repo'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'On macOS the app downloads and installs its own updates, with a Preview channel; Windows and Linux builds don’t yet. The Chief of Staff upgrades Happy Agent', mark: 'partial', cite: ['happy-desktop-updater', 'happy-desktop-main', 'happy-chief-of-staff'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Setup finds projects in Claude Code and Codex folders from their metadata and never imports their conversations', mark: 'no', cite: ['happy-chief-of-staff', 'happy-quick-start'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Not documented', mark: 'unknown', cite: [] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Happy Desktop’s daemon, Happy Agent, runs the agent loop, tools and permissions itself; for inference it calls the <strong>Claude Agent SDK</strong>, Pi’s Codex transport and xAI’s Responses API. The original <code>happy</code> CLI wraps the <code>claude</code> and <code>codex</code> CLIs and can start any ACP agent. Splash speaks the <strong>Agent Client Protocol</strong> with each agent, natively or through an adapter.',
			cite: ['happy-how-it-works', 'happy-agent-readme', 'happy-terminal-guide', 'happy-cli-readme', 'splash-registry', 'acp']
		},
		{
			title: 'Sandbox and permissions',
			text: 'Happy runs agent commands in an OS sandbox (Seatbelt on macOS, its own supervisor on Linux), optionally inside Docker, with no network unless domains are allowlisted; Full access lifts it. In Desktop’s default <strong>Auto</strong> mode, a read-only agent reviews actions that leave the sandbox instead of asking you. Splash shows each agent’s permission requests in the transcript, answered with the 1–9 keys and queued in <strong>Needs attention</strong>.',
			cite: ['happy-permissions', 'happy-configuration', 'splash-features']
		},
		{
			title: 'Where agents run',
			text: 'Happy runs agents on your computer, on your own servers running Happy Agent, or on team servers you host; it offers no cloud sessions. Phones connect through an encrypted relay you can self-host. Splash runs agents on your computer, or under <code>splash-server</code> on a machine you reach in a browser over SSH.',
			cite: ['happy-remote-server', 'happy-multiplayer', 'happy-desktop-app', 'happy-mobile', 'happy-self-hosting', 'splash-readme', 'splash-server']
		},
		{
			title: 'Price, accounts and license',
			text: 'Both are free and MIT-licensed. Happy documents one paid extra: voice, which moves to an in-app subscription past a free allowance. Its desktop app needs no Happy account, the phone app creates one with no email or password, and teams sign in to Happy Social. Splash has no accounts; <code>splash-server</code> uses a token.',
			cite: ['happy-home', 'happy-faq', 'happy-app-realtime', 'happy-desktop-license', 'happy-app-store', 'happy-how-it-works', 'happy-multiplayer', 'splash-license', 'splash-download', 'splash-build', 'splash-server']
		},
		{
			title: 'Around the session',
			text: 'Happy’s extras sit around the agent: a built-in <strong>Chief of Staff</strong> that handles setup and Happy Agent upgrades, subagents, scheduled messages, setup commands per workspace, shared sessions and phone control. Splash centers on the conversations themselves: a <strong>Needs attention</strong> queue, transcript search, importing sessions agents started elsewhere, and a GitHub view of issues, pull requests and Actions runs.',
			cite: ['happy-chief-of-staff', 'happy-agents', 'happy-workspaces', 'happy-multiplayer', 'happy-mobile', 'splash-features', 'splash-history', 'splash-github']
		}
	],
	fit: {
		splash: [
			'You want Gemini, Copilot, Goose, OpenCode and other ACP agents in one desktop app alongside Claude Code and Codex.',
			'You want to import conversations your agents started outside the app and search them with the rest.',
			'You want permission requests, connection failures and finished turns gathered in one Needs attention queue.',
			'You want a GitHub view of issues, pull requests and Actions runs across your repositories.'
		],
		other: [
			'You want Claude, Codex and Grok in one runtime with a shared sandbox, permission modes and subagents.',
			'You want to follow and answer your agents from encrypted iOS and Android apps.',
			'You want setup commands and synced .env files in each new worktree.',
			'You want agents on your own servers or a self-run team server, and to invite others into a session.'
		]
	},
	sources: [
		{ id: 'happy-home', title: 'Happy — Desktop & Mobile App for Claude Code, Codex & Grok', url: 'https://happy.engineering/', publisher: 'Happy Engineering', checked: '2026-10-10' },
		{ id: 'happy-welcome', title: 'Welcome', url: 'https://happy.engineering/welcome/', publisher: 'Happy Engineering', checked: '2026-10-10' },
		{ id: 'happy-desktop-app', title: 'The Open Source Desktop App for Claude Code, Codex, and Grok', url: 'https://happy.engineering/desktop-app/', publisher: 'Happy Engineering', checked: '2026-10-10' },
		{ id: 'happy-how-it-works', title: 'How It Works', url: 'https://happy.engineering/how-it-works/', publisher: 'Happy Engineering', checked: '2026-10-10' },
		{ id: 'happy-quick-start', title: 'Quick Start', url: 'https://happy.engineering/quick-start/', publisher: 'Happy Engineering', checked: '2026-10-10' },
		{ id: 'happy-models', title: 'Models & Subscriptions', url: 'https://happy.engineering/models/', publisher: 'Happy Engineering', checked: '2026-10-10' },
		{ id: 'happy-workspaces', title: 'Projects & Workspaces', url: 'https://happy.engineering/workspaces/', publisher: 'Happy Engineering', checked: '2026-10-10' },
		{ id: 'happy-permissions', title: 'Permissions & Sandbox', url: 'https://happy.engineering/permissions/', publisher: 'Happy Engineering', checked: '2026-10-10' },
		{ id: 'happy-configuration', title: 'Configuration', url: 'https://happy.engineering/guides/configuration/', publisher: 'Happy Engineering', checked: '2026-10-10' },
		{ id: 'happy-agents', title: 'Agents That Never Die', url: 'https://happy.engineering/agents/', publisher: 'Happy Engineering', checked: '2026-10-10' },
		{ id: 'happy-terminal-guide', title: 'Using the Terminal', url: 'https://happy.engineering/guides/terminal/', publisher: 'Happy Engineering', checked: '2026-10-10' },
		{ id: 'happy-remote-server', title: 'Run Claude Code and Codex on a Remote Server', url: 'https://happy.engineering/guides/remote-server/', publisher: 'Happy Engineering', checked: '2026-10-10' },
		{ id: 'happy-multiplayer', title: 'Multiplayer & Teams', url: 'https://happy.engineering/multiplayer/', publisher: 'Happy Engineering', checked: '2026-10-10' },
		{ id: 'happy-mobile', title: 'Mobile Access', url: 'https://happy.engineering/mobile/', publisher: 'Happy Engineering', checked: '2026-10-10' },
		{ id: 'happy-extending', title: 'Skills & MCP', url: 'https://happy.engineering/extending/', publisher: 'Happy Engineering', checked: '2026-10-10' },
		{ id: 'happy-chief-of-staff', title: 'Chief of Staff', url: 'https://happy.engineering/chief-of-staff/', publisher: 'Happy Engineering', checked: '2026-10-10' },
		{ id: 'happy-vision', title: 'Vision', url: 'https://happy.engineering/vision/', publisher: 'Happy Engineering', checked: '2026-10-10' },
		{ id: 'happy-security', title: 'Security & Encryption (Happy Coder docs)', url: 'https://happy.engineering/docs/security/', publisher: 'Happy Engineering', checked: '2026-10-10' },
		{ id: 'happy-faq', title: 'General FAQ (Happy Coder docs)', url: 'https://happy.engineering/docs/faq/', publisher: 'Happy Engineering', checked: '2026-10-10' },
		{ id: 'happy-self-hosting', title: 'Self-Host Your Own Happy Server (Happy Coder docs)', url: 'https://happy.engineering/docs/guides/self-hosting/', publisher: 'Happy Engineering', checked: '2026-10-10' },
		{ id: 'happy-app-store', title: 'Happy: Codex & Claude Code App', url: 'https://apps.apple.com/us/app/happy-codex-claude-code-app/id6748571505', publisher: 'Apple App Store', checked: '2026-10-10' },
		{ id: 'happy-google-play', title: 'Happy: Codex & Claude Code App', url: 'https://play.google.com/store/apps/details?id=com.ex3ndr.happy', publisher: 'Google Play', checked: '2026-10-10' },
		{ id: 'happy-desktop-release', title: 'Happy v0.0.93', url: 'https://github.com/slopus/happy-desktop/releases/tag/v0.0.93', publisher: 'slopus/happy-desktop on GitHub', checked: '2026-10-10' },
		{ id: 'happy-desktop-license', title: 'LICENSE', url: 'https://github.com/slopus/happy-desktop/blob/main/LICENSE', publisher: 'slopus/happy-desktop on GitHub', checked: '2026-10-10' },
		{ id: 'happy-desktop-package', title: 'packages/happy-desktop-electron/package.json', url: 'https://github.com/slopus/happy-desktop/blob/main/packages/happy-desktop-electron/package.json', publisher: 'slopus/happy-desktop on GitHub', checked: '2026-10-10' },
		{ id: 'happy-desktop-updater', title: 'packages/happy-desktop-electron/sources/main/updater.ts', url: 'https://github.com/slopus/happy-desktop/blob/main/packages/happy-desktop-electron/sources/main/updater.ts', publisher: 'slopus/happy-desktop on GitHub', checked: '2026-10-10' },
		{ id: 'happy-desktop-main', title: 'packages/happy-desktop-electron/sources/main/main.ts', url: 'https://github.com/slopus/happy-desktop/blob/main/packages/happy-desktop-electron/sources/main/main.ts', publisher: 'slopus/happy-desktop on GitHub', checked: '2026-10-10' },
		{ id: 'happy-desktop-review-comment', title: 'packages/happy-desktop-ui/src/ReviewComment.tsx', url: 'https://github.com/slopus/happy-desktop/blob/main/packages/happy-desktop-ui/src/ReviewComment.tsx', publisher: 'slopus/happy-desktop on GitHub', checked: '2026-10-10' },
		{ id: 'happy-desktop-composer-attachment', title: 'packages/happy-desktop-state/src/happyAgent/happyAgentComposerAttachment.ts', url: 'https://github.com/slopus/happy-desktop/blob/main/packages/happy-desktop-state/src/happyAgent/happyAgentComposerAttachment.ts', publisher: 'slopus/happy-desktop on GitHub', checked: '2026-10-10' },
		{ id: 'happy-desktop-dock-badge', title: 'packages/happy-desktop-electron/sources/main/dockBadge.ts', url: 'https://github.com/slopus/happy-desktop/blob/main/packages/happy-desktop-electron/sources/main/dockBadge.ts', publisher: 'slopus/happy-desktop on GitHub', checked: '2026-10-10' },
		{ id: 'happy-desktop-chime', title: 'packages/happy-desktop-electron/sources/renderer/completionChime.ts', url: 'https://github.com/slopus/happy-desktop/blob/main/packages/happy-desktop-electron/sources/renderer/completionChime.ts', publisher: 'slopus/happy-desktop on GitHub', checked: '2026-10-10' },
		{ id: 'happy-agent-readme', title: 'README', url: 'https://github.com/slopus/happy-agent', publisher: 'slopus/happy-agent on GitHub', checked: '2026-10-10' },
		{ id: 'happy-agent-release', title: 'Happy Agent v0.4.86', url: 'https://github.com/slopus/happy-agent/releases/tag/v0.4.86', publisher: 'slopus/happy-agent on GitHub', checked: '2026-10-10' },
		{ id: 'happy-repo', title: 'README', url: 'https://github.com/slopus/happy', publisher: 'slopus/happy on GitHub', checked: '2026-10-10' },
		{ id: 'happy-cli-readme', title: 'packages/happy-cli/README.md', url: 'https://github.com/slopus/happy/blob/main/packages/happy-cli/README.md', publisher: 'slopus/happy on GitHub', checked: '2026-10-10' },
		{ id: 'happy-cli-package', title: 'packages/happy-cli/package.json', url: 'https://github.com/slopus/happy/blob/main/packages/happy-cli/package.json', publisher: 'slopus/happy on GitHub', checked: '2026-10-10' },
		{ id: 'happy-app-realtime', title: 'packages/happy-app/sources/realtime/RealtimeSession.ts', url: 'https://github.com/slopus/happy/blob/main/packages/happy-app/sources/realtime/RealtimeSession.ts', publisher: 'slopus/happy on GitHub', checked: '2026-10-10' }
	]
};
