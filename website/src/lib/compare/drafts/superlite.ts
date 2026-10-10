// Splash vs Superlite. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const SUPERLITE: Comparison = {
	slug: 'superlite',
	name: 'Superlite',
	description: 'How Splash and Superlite compare on agents, platforms, pricing, licensing, remote access and review, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Superlite are both open-source desktop apps that run several coding agents at once over the Agent Client Protocol. Superlite is a native GPUI app with a free desktop tier and a paid Pro plan for browser remote use. Splash is free throughout and can give each session its own git worktree.',
	other: {
		name: 'Superlite',
		url: 'https://superlite.dev/',
		maker: 'Matt Gilg',
		summary: 'A native Rust and GPUI desktop app for running ACP agents in parallel as chats, with a bundled agent called Rusty. A paid Pro plan covers remote use from a browser and push notifications.',
		cite: ['superlite-home', 'superlite-readme', 'superlite-upgrade']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Native desktop chat client for ACP agents, with a browser remote; native iOS and Android apps are in development', cite: ['superlite-home', 'superlite-readme', 'superlite-privacy'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'Desktop beta; v0.1.9 of 5 September 2026 is the latest of ten tagged releases since March 2026', cite: ['superlite-home', 'superlite-releases', 'superlite-changelog'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (GPL-3.0-or-later) for the desktop app; the bundled Rusty agent comes from a separate repository with no public source', cite: ['superlite-license', 'superlite-terms', 'superlite-gitmodules', 'superlite-ci'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Desktop free; Pro $12 a month or $99 a year, with a 14-day trial. Providers bill model usage separately', cite: ['superlite-home', 'superlite-upgrade'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'Windows 10/11 x64 and ARM64, macOS 13+ (one build, architecture not stated), and Linux x64 as a .deb or Flatpak', cite: ['superlite-home', 'superlite-releases', 'superlite-ci'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Rust on Zed’s GPUI framework; the contributing guide turns away web views and Electron-style dependencies', cite: ['superlite-home', 'superlite-contributing', 'superlite-cargo'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'ACP registry agents shipped via npx or a binary for your OS, the bundled Rusty agent, and any ACP agent you configure', cite: ['superlite-agents', 'superlite-registry-rs', 'superlite-readme', 'superlite-home'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'As an ACP client: each agent is a subprocess speaking ACP over stdio; Claude and Codex run through npx adapter packages', cite: ['superlite-readme', 'superlite-connection-rs', 'superlite-agents'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Agents use their own logins or keys over ACP, billed by providers; quota rings read local Claude, Codex and GLM credentials', cite: ['superlite-upgrade', 'superlite-agents-rs', 'superlite-changelog', 'superlite-claude-usage-rs'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'None for the desktop app; the web remote and mobile companion need a Google sign-in', cite: ['superlite-home', 'superlite-terms', 'superlite-privacy'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Approve tool calls in the chat after seeing their diffs; bundled Rusty also offers session-wide approval, rejection with feedback and YOLO mode', mark: 'yes', cite: ['superlite-home', 'superlite-notifier-rs'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Add stdio or HTTP MCP servers that Superlite passes to agent sessions; it also ships its own graph and conversation-search servers', mark: 'yes', cite: ['superlite-changelog', 'superlite-mcp-rs'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'None documented: each chat starts a fresh agent process in a project folder you confirm first', mark: 'no', cite: ['superlite-changelog'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'An interactive terminal panel below the chat, in the chat’s folder; agents’ ACP terminal requests show as terminal blocks', mark: 'yes', cite: ['superlite-changelog', 'superlite-delegate-rs'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Sidebar dots for chats that are generating or waiting on a permission, in a separate color; background requests also show a toast', mark: 'yes', cite: ['superlite-sidebar-rs', 'superlite-app-rs'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'A system notification when an agent asks for permission, plus a taskbar flash on Windows; Pro lists push notifications', mark: 'yes', cite: ['superlite-notifier-rs', 'superlite-upgrade'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Agents can ask another agent for a read-only second opinion, or debate and work on a shared goal together', mark: 'yes', cite: ['superlite-changelog'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Edits render as diffs in the chat; a changed file opens in Zed, VS Code or Cursor as a diff against HEAD', mark: 'yes', cite: ['superlite-home', 'superlite-changelog', 'superlite-editors-rs'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'None documented; the app’s git commands are read-only queries such as status, diff and ls-files', mark: 'no', cite: ['superlite-git-rs'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'No GitHub integration, CI status or merge actions are documented', mark: 'no', cite: ['superlite-git-rs'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'A browser remote sends prompts and approvals to your running desktop peer to peer; the site disagrees on whether Free includes it', mark: 'partial', cite: ['superlite-home', 'superlite-privacy', 'superlite-terms', 'superlite-remote-note'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'Native iOS and Android apps are in development and unreleased; Pro is to include them', mark: 'no', cite: ['superlite-home'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Windows installs update themselves through Velopack; no auto-update is documented for macOS or Linux', mark: 'partial', cite: ['superlite-cargo', 'superlite-changelog'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented; Superlite’s own chats are saved locally, and archived ones can be resurrected with their original agent', mark: 'unknown', cite: ['superlite-changelog'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Agents can search all past sessions through a built-in MCP tool; in the app, search works inside an archived chat', mark: 'partial', cite: ['superlite-changelog', 'superlite-sidebar-rs'] } },
				{ label: 'Fork a conversation', splash: S.fork, other: { text: 'Fork the current chat into a new one, seeded with the message in progress', mark: 'yes', cite: ['superlite-changelog'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Both are ACP clients that start each agent as a subprocess over stdio. Superlite installs agents from the community ACP registry when they ship through npx or a binary for your OS, and bundles <strong>Rusty</strong>, its own agent for Ollama and OpenAI-compatible models. Splash ships launch commands, with pinned adapters where needed, for the agents it supports.',
			cite: ['superlite-readme', 'superlite-agents', 'superlite-registry-rs', 'superlite-home', 'superlite-changelog', 'splash-registry', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'Both run agents on your own machines; neither offers hosted execution. Superlite’s browser remote reaches a running desktop peer to peer over WebRTC after Google sign-in, and its iOS and Android apps are unreleased. Splash can instead run as <code>splash-server</code> on the machine that holds your code, which you open in a browser through an SSH tunnel, with no account.',
			cite: ['superlite-terms', 'superlite-privacy', 'superlite-home', 'splash-readme', 'splash-server']
		},
		{
			title: 'Price, accounts and license',
			text: 'Superlite’s desktop app is GPL-3.0-or-later and free without an account; Pro, at $12 a month or $99 a year, adds unlimited concurrent agents, remote devices and push notifications. The site caps Free at two running conversations, a limit found in unreleased dev-branch code but not in v0.1.9. Splash is MIT-licensed, free and has no accounts.',
			cite: ['superlite-license', 'superlite-home', 'superlite-upgrade', 'superlite-changelog-dev', 'splash-license', 'splash-download', 'splash-build']
		},
		{
			title: 'Around the conversation',
			text: 'Superlite calls itself a chat client, not a code editor, and leaves deeper review to your editor. It adds a project graph of changed code and its callers, second opinions and debates between agents, and nestable chat folders. Splash adds optional per-session git worktrees, a Needs attention queue, a review screen, a GitHub triage view and imports of outside sessions.',
			cite: ['superlite-readme', 'superlite-changelog', 'splash-features', 'splash-github', 'splash-history']
		},
		{
			title: 'Platforms and updates',
			text: 'Superlite is a native GPUI app with builds for Windows x64 and ARM64, macOS 13+ and Linux x64 as a .deb or Flatpak; Windows installs update themselves. Splash is Rust with a Svelte webview, built for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64 plus a headless server, and is updated by downloading a new release.',
			cite: ['superlite-home', 'superlite-releases', 'superlite-cargo', 'splash-how', 'splash-install', 'splash-about']
		}
	],
	fit: {
		splash: [
			'You want an MIT-licensed app that is free in full and needs no account.',
			'You want each session in its own git worktree, so several agents can work on one repository at once.',
			'You want a GitHub triage view of issues, pull requests and Actions runs across your repositories.',
			'You want to import conversations your agents started outside the app and search them with the rest.'
		],
		other: [
			'You want a native app on Windows x64 or ARM64, macOS 13 or later, or Linux as a .deb or Flatpak.',
			'You want to install agents from the ACP registry, or run Ollama and other local models through the bundled Rusty agent.',
			'You want agents to ask one another for second opinions, with a graph of changed code and its callers.',
			'You want to follow and approve your desktop agents from a browser on another device, with phone apps planned.'
		]
	},
	sources: [
		{ id: 'superlite-home', title: 'Run AI agents without living in an IDE', url: 'https://superlite.dev/', publisher: 'Superlite', checked: '2026-10-10' },
		{ id: 'superlite-upgrade', title: 'Superlite Pro: 14-day free trial', url: 'https://superlite.dev/upgrade', publisher: 'Superlite', checked: '2026-10-10' },
		{ id: 'superlite-terms', title: 'Terms of Service', url: 'https://superlite.dev/terms', publisher: 'Superlite', checked: '2026-10-10' },
		{ id: 'superlite-privacy', title: 'Privacy Policy', url: 'https://superlite.dev/privacy', publisher: 'Superlite', checked: '2026-10-10' },
		{ id: 'superlite-agents', title: 'ACP Agent Registry', url: 'https://superlite.dev/agents', publisher: 'Superlite', checked: '2026-10-10' },
		{ id: 'superlite-readme', title: 'README.md', url: 'https://gitlab.com/superlite.dev/superlite/-/blob/main/README.md', publisher: 'superlite.dev/superlite on GitLab', checked: '2026-10-10' },
		{ id: 'superlite-license', title: 'LICENSE.md', url: 'https://gitlab.com/superlite.dev/superlite/-/blob/main/LICENSE.md', publisher: 'superlite.dev/superlite on GitLab', checked: '2026-10-10' },
		{ id: 'superlite-contributing', title: 'CONTRIBUTING.md', url: 'https://gitlab.com/superlite.dev/superlite/-/blob/main/CONTRIBUTING.md', publisher: 'superlite.dev/superlite on GitLab', checked: '2026-10-10' },
		{ id: 'superlite-cargo', title: 'Cargo.toml', url: 'https://gitlab.com/superlite.dev/superlite/-/blob/main/Cargo.toml', publisher: 'superlite.dev/superlite on GitLab', checked: '2026-10-10' },
		{ id: 'superlite-changelog', title: 'CHANGELOG.md', url: 'https://gitlab.com/superlite.dev/superlite/-/blob/main/CHANGELOG.md', publisher: 'superlite.dev/superlite on GitLab', checked: '2026-10-10' },
		{ id: 'superlite-changelog-dev', title: 'CHANGELOG.md (dev branch, Unreleased)', url: 'https://gitlab.com/superlite.dev/superlite/-/blob/dev/CHANGELOG.md', publisher: 'superlite.dev/superlite on GitLab', checked: '2026-10-10' },
		{ id: 'superlite-releases', title: 'Releases', url: 'https://gitlab.com/superlite.dev/superlite/-/releases', publisher: 'superlite.dev/superlite on GitLab', checked: '2026-10-10' },
		{ id: 'superlite-gitmodules', title: '.gitmodules', url: 'https://gitlab.com/superlite.dev/superlite/-/blob/main/.gitmodules', publisher: 'superlite.dev/superlite on GitLab', checked: '2026-10-10' },
		{ id: 'superlite-ci', title: '.gitlab-ci.yml', url: 'https://gitlab.com/superlite.dev/superlite/-/blob/main/.gitlab-ci.yml', publisher: 'superlite.dev/superlite on GitLab', checked: '2026-10-10' },
		{ id: 'superlite-registry-rs', title: 'src/config/registry.rs', url: 'https://gitlab.com/superlite.dev/superlite/-/blob/main/src/config/registry.rs', publisher: 'superlite.dev/superlite on GitLab', checked: '2026-10-10' },
		{ id: 'superlite-agents-rs', title: 'src/config/agents.rs', url: 'https://gitlab.com/superlite.dev/superlite/-/blob/main/src/config/agents.rs', publisher: 'superlite.dev/superlite on GitLab', checked: '2026-10-10' },
		{ id: 'superlite-claude-usage-rs', title: 'src/usage/claude.rs', url: 'https://gitlab.com/superlite.dev/superlite/-/blob/main/src/usage/claude.rs', publisher: 'superlite.dev/superlite on GitLab', checked: '2026-10-10' },
		{ id: 'superlite-connection-rs', title: 'src/acp/connection.rs', url: 'https://gitlab.com/superlite.dev/superlite/-/blob/main/src/acp/connection.rs', publisher: 'superlite.dev/superlite on GitLab', checked: '2026-10-10' },
		{ id: 'superlite-delegate-rs', title: 'src/acp/delegate.rs', url: 'https://gitlab.com/superlite.dev/superlite/-/blob/main/src/acp/delegate.rs', publisher: 'superlite.dev/superlite on GitLab', checked: '2026-10-10' },
		{ id: 'superlite-mcp-rs', title: 'src/config/mcp.rs', url: 'https://gitlab.com/superlite.dev/superlite/-/blob/main/src/config/mcp.rs', publisher: 'superlite.dev/superlite on GitLab', checked: '2026-10-10' },
		{ id: 'superlite-editors-rs', title: 'src/config/editors.rs', url: 'https://gitlab.com/superlite.dev/superlite/-/blob/main/src/config/editors.rs', publisher: 'superlite.dev/superlite on GitLab', checked: '2026-10-10' },
		{ id: 'superlite-git-rs', title: 'src/graph/git.rs', url: 'https://gitlab.com/superlite.dev/superlite/-/blob/main/src/graph/git.rs', publisher: 'superlite.dev/superlite on GitLab', checked: '2026-10-10' },
		{ id: 'superlite-notifier-rs', title: 'src/platform/notifier.rs', url: 'https://gitlab.com/superlite.dev/superlite/-/blob/main/src/platform/notifier.rs', publisher: 'superlite.dev/superlite on GitLab', checked: '2026-10-10' },
		{ id: 'superlite-sidebar-rs', title: 'src/ui/sidebar.rs', url: 'https://gitlab.com/superlite.dev/superlite/-/blob/main/src/ui/sidebar.rs', publisher: 'superlite.dev/superlite on GitLab', checked: '2026-10-10' },
		{ id: 'superlite-app-rs', title: 'src/app.rs', url: 'https://gitlab.com/superlite.dev/superlite/-/blob/main/src/app.rs', publisher: 'superlite.dev/superlite on GitLab', checked: '2026-10-10' },
		{ id: 'superlite-remote-note', title: 'Free remote-access entitlement mismatch (dev branch note)', url: 'https://gitlab.com/superlite.dev/superlite/-/blob/dev/documentation/Notes/free-remote-entitlement-mismatch.md', publisher: 'superlite.dev/superlite on GitLab', checked: '2026-10-10' }
	]
};
