// Splash vs Poolside Assistant for desktop. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const POOLSIDE: Comparison = {
	slug: 'poolside',
	name: 'Poolside Assistant for desktop',
	description: 'How Splash and Poolside Assistant for desktop compare on agents, platforms, local models, worktrees and review, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Poolside Assistant for desktop are open-source apps that run several coding agents at once over the Agent Client Protocol, with git worktrees to keep their work apart. Poolside Assistant runs on Apple silicon Macs, bundles Poolside’s own agent and can run models locally. Splash runs on macOS, Windows and Ubuntu, and as a headless server.',
	other: {
		name: 'Poolside Assistant for desktop',
		url: 'https://docs.poolside.ai/tools/poolside-assistant-desktop',
		maker: 'Poolside',
		summary: 'A Mac app for Apple silicon that runs Poolside’s agent, Claude, Codex and other ACP agents across projects, with an optional git worktree per task and built-in terminals, diffs and GitHub status.',
		cite: ['poolside-docs', 'poolside-blog']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Mac app for running ACP coding agents outside the editor; also available as VS Code and Visual Studio extensions', cite: ['poolside-docs', 'poolside-docs-editors'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'Desktop v1.6.0 of 2 October 2026, after a launch on 28 July 2026; phone remote access is marked experimental', cite: ['poolside-release', 'poolside-blog', 'poolside-docs'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (Apache-2.0); the bundled Poolside Agent (pool) is proprietary, under Poolside’s EULA', cite: ['poolside-readme', 'poolside-pool-license'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free. Poolside’s agent has a free developer key or paid access through OpenRouter; other agents use their own subscriptions or API keys', cite: ['poolside-readme', 'poolside-log-in', 'poolside-blog', 'poolside-agent-requirements'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS on Apple silicon; the VS Code extension covers macOS, Linux and Windows, the Visual Studio one Windows', cite: ['poolside-docs', 'poolside-release-workflow', 'poolside-install', 'poolside-docs-editors'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'A Tauri v2 (Rust) shell around a Svelte and TypeScript UI shared with the editor extensions, plus a bundled Go helper', cite: ['poolside-ui-readme', 'poolside-install', 'poolside-tauri-conf', 'poolside-acp-process'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Poolside Agent (pool) by default; Claude Agent and Codex marked as tested; other public ACP registry agents and custom ACP executables', cite: ['poolside-docs', 'poolside-agent-registry', 'poolside-acp-registry'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'ACP over stdio: the app’s bundled Go helper starts each agent as a subprocess; Claude and Codex go through ACP adapters', cite: ['poolside-blog', 'poolside-tauri-conf', 'poolside-acp-process', 'poolside-claude-acp', 'poolside-agent-registry'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Other agents keep their own logins or API keys, with model calls bypassing Poolside; Poolside’s agent signs in via a terminal', cite: ['poolside-agent-requirements', 'poolside-blog', 'poolside-docs'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'No sign-up to install. Poolside’s agent logs in through Poolside Platform, OpenRouter, an org deployment or an OpenAI-compatible endpoint; local models need none unless gated', cite: ['poolside-docs', 'poolside-log-in', 'poolside-getting-started'] } },
				{ label: 'On-device models', hint: 'Models that run on your computer', splash: { text: 'None of its own; Splash starts the agent you pick and shows what it streams back', mark: 'no', cite: ['splash-readme'] }, other: { text: 'Poolside Local runs MLX models on the Mac and estimates fit before download; Laguna XS 2.1 allows an offline setup', mark: 'yes', cite: ['poolside-docs', 'poolside-blog'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Agents can ask before reading files, running commands or editing code; a pending request marks the conversation as waiting', mark: 'yes', cite: ['poolside-docs', 'poolside-tab-status'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Connectors are MCP servers: a built-in catalog (GitHub, Linear, Notion, Sentry, Vercel and more) plus custom ones', mark: 'yes', cite: ['poolside-blog', 'poolside-getting-started'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Each task can get its own git worktree and branch, kept under Poolside’s state folder', mark: 'yes', cite: ['poolside-docs', 'poolside-blog', 'poolside-worktree-store'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Worktree setup and teardown scripts per project; a failing teardown blocks removal. No dev-server or port handling is documented', mark: 'yes', cite: ['poolside-project-settings', 'poolside-worktree-repo'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'Built-in PTY terminals in tabs and splits beside conversations, files and diffs; setup scripts can run in one', mark: 'yes', cite: ['poolside-docs', 'poolside-blog', 'poolside-terminal', 'poolside-worktree-repo'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Waiting and unread marks on tabs and sidebar rows, a Dock badge count, a jump-to-next shortcut and macOS notifications for approvals', mark: 'yes', cite: ['poolside-tab-status', 'poolside-conversation-row', 'poolside-badge', 'poolside-commands', 'poolside-main'] } },
				{ label: 'Agents handing off work', hint: 'Passing a conversation or task to another agent', splash: S.handoff, other: { text: 'Pass a conversation to another agent, which picks it up at your next prompt with recent messages and the latest plan', mark: 'yes', cite: ['poolside-docs', 'poolside-blog', 'poolside-handoff'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Diff panel for all, staged or unstaged changes, unified or side by side, with Stage and Commit; no documented line comments', mark: 'yes', cite: ['poolside-docs', 'poolside-diff-panel'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Opens GitHub’s new-pull-request page for the branch in a browser; the GitHub integration reads PR state but doesn’t create or merge', mark: 'partial', cite: ['poolside-docs', 'poolside-github-handler', 'poolside-github-methods'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'PR status, CI checks, review state and comments for each worktree, read through gh or a personal access token', mark: 'yes', cite: ['poolside-docs', 'poolside-github-connector', 'poolside-github-methods'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'No tracker view; Linear and GitHub connectors give agents access, a repo’s issue list opens by link, others via custom MCP', mark: 'partial', cite: ['poolside-blog', 'poolside-getting-started', 'poolside-github-handler'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Experimental: a phone web app served from the Mac over Tailscale, paired by QR code; SSH and native apps aren’t documented', mark: 'partial', cite: ['poolside-docs', 'poolside-readme', 'poolside-mobile-remote', 'poolside-remote'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Downloads updates in the background; the sidebar Update button installs one and restarts. Stable by default, with a Preview channel', mark: 'yes', cite: ['poolside-autoupdater'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Imports Claude Code and Codex sessions from Settings → Archive, which also lists archived chats from every project', mark: 'yes', cite: ['poolside-blog', 'poolside-archive'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Not by message text: ⌘K finds conversations by title, project or agent name, and can open files', mark: 'no', cite: ['poolside-blog', 'poolside-search'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Both apps drive agents over the <strong>Agent Client Protocol</strong>. Poolside Assistant lists agents from the public ACP registry, accepts custom ACP executables in <code>assistant.json</code>, and keeps its own copy of Poolside’s <code>pool</code> agent up to date. Splash ships launch commands for its own list of agents, <code>pool acp</code> among them; you install and sign in to each CLI.',
			cite: ['poolside-blog', 'poolside-agent-registry', 'poolside-docs', 'splash-registry', 'splash-agents', 'acp']
		},
		{
			title: 'Where it runs',
			text: 'Poolside Assistant’s desktop app is for Apple silicon Macs; the assistant also runs as VS Code and Visual Studio extensions, and an experimental phone web app reaches the Mac over Tailscale. Splash runs on macOS 14+ (Apple silicon and Intel), Windows 11 and Ubuntu 24.04, or as <code>splash-server</code> on a machine you open in a browser through an SSH tunnel.',
			cite: ['poolside-docs', 'poolside-release-workflow', 'poolside-docs-editors', 'poolside-mobile-remote', 'splash-install', 'splash-server']
		},
		{
			title: 'Models, price and license',
			text: 'Both apps are free and open source: Splash under MIT, Poolside Assistant under Apache-2.0, though its bundled <code>pool</code> agent is proprietary. Poolside’s agent defaults to the Laguna S 2.1 model, with a free developer key or paid OpenRouter access, and <strong>Poolside Local</strong> runs MLX models on the Mac. Splash starts the agent you choose, signed in through its own CLI.',
			cite: ['splash-license', 'splash-download', 'poolside-readme', 'poolside-pool-license', 'poolside-blog', 'poolside-log-in', 'poolside-docs', 'splash-readme', 'splash-agents']
		},
		{
			title: 'Around the session',
			text: 'Poolside Assistant offers worktree setup and teardown scripts, a default layout of tabs and splits you can save, a chat mode with its own scratch folder, dictation transcribed on the Mac, and handing a conversation to another agent. Splash builds around its sessions: a Needs attention queue, a review screen that sends feedback, full-text transcript search and a GitHub view across repositories.',
			cite: ['poolside-project-settings', 'poolside-blog', 'poolside-docs', 'poolside-voice-input', 'poolside-handoff', 'splash-features', 'splash-github']
		}
	],
	fit: {
		splash: [
			'You work on Windows, Ubuntu or an Intel Mac, or want to run sessions on your own server over SSH.',
			'You want permission requests, failures and finished turns gathered in one Needs attention queue.',
			'You want to search the full text of saved transcripts, including conversations imported from your agents’ history.',
			'You want a GitHub view of issues, pull requests and Actions runs across your repositories.'
		],
		other: [
			'You work on an Apple silicon Mac and want Poolside’s own agent ready to use, with a free developer key.',
			'You want to run open-weight models on your Mac without a hosted model service.',
			'You want worktree setup and teardown scripts and an app that updates itself.',
			'You want to pass a conversation from one agent to another, or try the experimental phone remote for your Mac.'
		]
	},
	sources: [
		{ id: 'poolside-docs', title: 'Use Poolside Assistant for desktop', url: 'https://docs.poolside.ai/tools/poolside-assistant-desktop', publisher: 'Poolside', checked: '2026-10-10' },
		{ id: 'poolside-blog', title: 'Introducing Poolside Desktop Assistant, for macOS', url: 'https://poolside.ai/blog/introducing-poolside-desktop-assistant', publisher: 'Poolside', checked: '2026-10-10' },
		{ id: 'poolside-docs-editors', title: 'Use Poolside Assistant in VS Code or Visual Studio', url: 'https://docs.poolside.ai/tools/poolside-assistant', publisher: 'Poolside', checked: '2026-10-10' },
		{ id: 'poolside-log-in', title: 'Log in to Poolside', url: 'https://docs.poolside.ai/get-started/log-in', publisher: 'Poolside', checked: '2026-10-10' },
		{ id: 'poolside-readme', title: 'README.md', url: 'https://github.com/poolsideai/assistants/blob/main/README.md', publisher: 'poolsideai/assistants on GitHub', checked: '2026-10-10' },
		{ id: 'poolside-install', title: 'Install Poolside Assistant (INSTALL.md)', url: 'https://github.com/poolsideai/assistants/blob/main/INSTALL.md', publisher: 'poolsideai/assistants on GitHub', checked: '2026-10-10' },
		{ id: 'poolside-ui-readme', title: 'ui/README.md', url: 'https://github.com/poolsideai/assistants/blob/main/ui/README.md', publisher: 'poolsideai/assistants on GitHub', checked: '2026-10-10' },
		{ id: 'poolside-getting-started', title: 'Getting started with Poolside Assistant', url: 'https://github.com/poolsideai/assistants/blob/main/docs/getting-started.md', publisher: 'poolsideai/assistants on GitHub', checked: '2026-10-10' },
		{ id: 'poolside-release', title: 'Release desktop/v1.6.0', url: 'https://github.com/poolsideai/assistants/releases/tag/desktop/v1.6.0', publisher: 'poolsideai/assistants on GitHub', checked: '2026-10-10' },
		{ id: 'poolside-release-workflow', title: '.github/workflows/release-desktop.yml', url: 'https://github.com/poolsideai/assistants/blob/main/.github/workflows/release-desktop.yml', publisher: 'poolsideai/assistants on GitHub', checked: '2026-10-10' },
		{ id: 'poolside-autoupdater', title: 'Desktop auto-updater (AUTOUPDATER.md)', url: 'https://github.com/poolsideai/assistants/blob/main/ui/apps/desktop-assistant/AUTOUPDATER.md', publisher: 'poolsideai/assistants on GitHub', checked: '2026-10-10' },
		{ id: 'poolside-pool-license', title: 'LICENSE.md', url: 'https://github.com/poolsideai/pool/blob/main/LICENSE.md', publisher: 'poolsideai/pool on GitHub', checked: '2026-10-10' },
		{ id: 'poolside-acp-registry', title: 'ACP agent registry (registry.json)', url: 'https://cdn.agentclientprotocol.com/registry/v1/latest/registry.json', publisher: 'Agent Client Protocol', checked: '2026-10-10' },
		{ id: 'poolside-agent-registry', title: 'ui/packages/features/src/acp/agentRegistry.ts', url: 'https://github.com/poolsideai/assistants/blob/main/ui/packages/features/src/acp/agentRegistry.ts', publisher: 'poolsideai/assistants on GitHub', checked: '2026-10-10' },
		{ id: 'poolside-agent-requirements', title: 'ui/packages/features/src/acp/agentRequirements.ts', url: 'https://github.com/poolsideai/assistants/blob/main/ui/packages/features/src/acp/agentRequirements.ts', publisher: 'poolsideai/assistants on GitHub', checked: '2026-10-10' },
		{ id: 'poolside-acp-process', title: 'pkg/poolside-helper/internal/handler/acpproxy/process.go', url: 'https://github.com/poolsideai/assistants/blob/main/pkg/poolside-helper/internal/handler/acpproxy/process.go', publisher: 'poolsideai/assistants on GitHub', checked: '2026-10-10' },
		{ id: 'poolside-claude-acp', title: 'pkg/poolside-helper/internal/handler/acpproxy/claude_auth_probe.go', url: 'https://github.com/poolsideai/assistants/blob/main/pkg/poolside-helper/internal/handler/acpproxy/claude_auth_probe.go', publisher: 'poolsideai/assistants on GitHub', checked: '2026-10-10' },
		{ id: 'poolside-worktree-store', title: 'pkg/poolside-helper/internal/handler/acpnav/store.go', url: 'https://github.com/poolsideai/assistants/blob/main/pkg/poolside-helper/internal/handler/acpnav/store.go', publisher: 'poolsideai/assistants on GitHub', checked: '2026-10-10' },
		{ id: 'poolside-project-settings', title: 'ui/packages/features/src/acp/components/ProjectSettingsView.svelte', url: 'https://github.com/poolsideai/assistants/blob/main/ui/packages/features/src/acp/components/ProjectSettingsView.svelte', publisher: 'poolsideai/assistants on GitHub', checked: '2026-10-10' },
		{ id: 'poolside-worktree-repo', title: 'ui/packages/features/src/acp/features/WorktreeRepository.ts', url: 'https://github.com/poolsideai/assistants/blob/main/ui/packages/features/src/acp/features/WorktreeRepository.ts', publisher: 'poolsideai/assistants on GitHub', checked: '2026-10-10' },
		{ id: 'poolside-tauri-conf', title: 'ui/apps/desktop-assistant/src-tauri/tauri.conf.json', url: 'https://github.com/poolsideai/assistants/blob/main/ui/apps/desktop-assistant/src-tauri/tauri.conf.json', publisher: 'poolsideai/assistants on GitHub', checked: '2026-10-10' },
		{ id: 'poolside-terminal', title: 'ui/apps/desktop-assistant/src-tauri/src/terminal.rs', url: 'https://github.com/poolsideai/assistants/blob/main/ui/apps/desktop-assistant/src-tauri/src/terminal.rs', publisher: 'poolsideai/assistants on GitHub', checked: '2026-10-10' },
		{ id: 'poolside-tab-status', title: 'ui/packages/features/src/acp/components/chat/desktopChatTabStatus.ts', url: 'https://github.com/poolsideai/assistants/blob/main/ui/packages/features/src/acp/components/chat/desktopChatTabStatus.ts', publisher: 'poolsideai/assistants on GitHub', checked: '2026-10-10' },
		{ id: 'poolside-conversation-row', title: 'ui/packages/features/src/acp/components/sidebar/ConversationRow.svelte', url: 'https://github.com/poolsideai/assistants/blob/main/ui/packages/features/src/acp/components/sidebar/ConversationRow.svelte', publisher: 'poolsideai/assistants on GitHub', checked: '2026-10-10' },
		{ id: 'poolside-badge', title: 'ui/packages/assistant/src/acp/runtime/shared/registerAttentionBadgeEffect.svelte.ts', url: 'https://github.com/poolsideai/assistants/blob/main/ui/packages/assistant/src/acp/runtime/shared/registerAttentionBadgeEffect.svelte.ts', publisher: 'poolsideai/assistants on GitHub', checked: '2026-10-10' },
		{ id: 'poolside-main', title: 'ui/apps/desktop-assistant/src/main.ts', url: 'https://github.com/poolsideai/assistants/blob/main/ui/apps/desktop-assistant/src/main.ts', publisher: 'poolsideai/assistants on GitHub', checked: '2026-10-10' },
		{ id: 'poolside-commands', title: 'ui/packages/features/src/keybindings/commands.ts', url: 'https://github.com/poolsideai/assistants/blob/main/ui/packages/features/src/keybindings/commands.ts', publisher: 'poolsideai/assistants on GitHub', checked: '2026-10-10' },
		{ id: 'poolside-handoff', title: 'ui/packages/features/src/acp/features/session/handoffContext.ts', url: 'https://github.com/poolsideai/assistants/blob/main/ui/packages/features/src/acp/features/session/handoffContext.ts', publisher: 'poolsideai/assistants on GitHub', checked: '2026-10-10' },
		{ id: 'poolside-diff-panel', title: 'ui/packages/features/src/acp/components/chat/DesktopDiffPanel.svelte', url: 'https://github.com/poolsideai/assistants/blob/main/ui/packages/features/src/acp/components/chat/DesktopDiffPanel.svelte', publisher: 'poolsideai/assistants on GitHub', checked: '2026-10-10' },
		{ id: 'poolside-github-connector', title: 'ui/packages/features/src/acp/components/DesktopGitHubConnectorSection.svelte', url: 'https://github.com/poolsideai/assistants/blob/main/ui/packages/features/src/acp/components/DesktopGitHubConnectorSection.svelte', publisher: 'poolsideai/assistants on GitHub', checked: '2026-10-10' },
		{ id: 'poolside-github-methods', title: 'pkg/poolside-helper/methods/github.go', url: 'https://github.com/poolsideai/assistants/blob/main/pkg/poolside-helper/methods/github.go', publisher: 'poolsideai/assistants on GitHub', checked: '2026-10-10' },
		{ id: 'poolside-github-handler', title: 'pkg/poolside-helper/internal/handler/github/handler.go', url: 'https://github.com/poolsideai/assistants/blob/main/pkg/poolside-helper/internal/handler/github/handler.go', publisher: 'poolsideai/assistants on GitHub', checked: '2026-10-10' },
		{ id: 'poolside-mobile-remote', title: 'ui/apps/mobile-remote/README.md', url: 'https://github.com/poolsideai/assistants/blob/main/ui/apps/mobile-remote/README.md', publisher: 'poolsideai/assistants on GitHub', checked: '2026-10-10' },
		{ id: 'poolside-remote', title: 'ui/packages/features/src/acp/components/DesktopRemoteAccessSection.svelte', url: 'https://github.com/poolsideai/assistants/blob/main/ui/packages/features/src/acp/components/DesktopRemoteAccessSection.svelte', publisher: 'poolsideai/assistants on GitHub', checked: '2026-10-10' },
		{ id: 'poolside-archive', title: 'ui/packages/features/src/acp/components/DesktopArchivedChatsSection.svelte', url: 'https://github.com/poolsideai/assistants/blob/main/ui/packages/features/src/acp/components/DesktopArchivedChatsSection.svelte', publisher: 'poolsideai/assistants on GitHub', checked: '2026-10-10' },
		{ id: 'poolside-search', title: 'ui/packages/features/src/acp/components/sidebar/DesktopConversationSearch.svelte', url: 'https://github.com/poolsideai/assistants/blob/main/ui/packages/features/src/acp/components/sidebar/DesktopConversationSearch.svelte', publisher: 'poolsideai/assistants on GitHub', checked: '2026-10-10' },
		{ id: 'poolside-voice-input', title: 'pkg/poolside-helper/internal/handler/voice_input.go', url: 'https://github.com/poolsideai/assistants/blob/main/pkg/poolside-helper/internal/handler/voice_input.go', publisher: 'poolsideai/assistants on GitHub', checked: '2026-10-10' }
	]
};
