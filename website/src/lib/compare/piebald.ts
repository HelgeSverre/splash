// Splash vs Piebald. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const PIEBALD: Comparison = {
	slug: 'piebald',
	name: 'Piebald',
	description: 'How Splash and Piebald compare on agents, model providers, pricing, worktrees, review and web mode, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Piebald are desktop apps, each with a browser-based server mode, for running several AI coding sessions at once. Piebald is its own coding agent, which talks to the model provider you choose. Splash drives other vendors’ agents, such as Claude Code and Codex, over the Agent Client Protocol.',
	other: {
		name: 'Piebald',
		url: 'https://piebald.ai/',
		maker: 'Piebald',
		summary: 'An AI coding agent for desktop and browser that runs parallel chats on the model provider you pick. Its Pro plan adds worktrees, an editor, a terminal and an HTTP traffic inspector.',
		cite: ['piebald-intro', 'piebald-home', 'piebald-pricing']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'An AI coding agent in a desktop app, or in a browser served by the separate piebald-web binary', cite: ['piebald-intro', 'piebald-web-mode'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v0.7.1 (23 September 2026), still before 1.0; the site says it is in active development, adding features weekly', cite: ['piebald-downloads', 'piebald-release', 'piebald-home'] } },
				{ label: 'License', splash: S.license, other: { text: 'Closed source; the public GitHub repo holds the issue tracker and release binaries, and the terms forbid reverse engineering', cite: ['piebald-repo', 'piebald-terms'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Basic is free; Pro, $20 a month, adds worktrees, a terminal and a code editor. 14-day Pro trial without a card', cite: ['piebald-pricing', 'piebald-changelog', 'piebald-terms'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Universal), Windows x64 with no WSL needed, Linux x64 and ARM64 (AppImage, DEB, RPM); a community AUR package for Arch', cite: ['piebald-downloads', 'piebald-home', 'piebald-intro'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Tauri, with one React UI shared by the desktop app and web mode, according to a maintainer', cite: ['piebald-issue-31', 'piebald-changelog'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Piebald’s own agent, with built-in tools and subagents, on a model provider you pick; adding other agent CLIs isn’t documented', cite: ['piebald-builtin-tools', 'piebald-providers', 'piebald-pricing'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Its own agent loop calls each provider’s HTTP API; Claude Pro/Max runs through Claude Code in the background. ACP isn’t mentioned', cite: ['piebald-home', 'piebald-claude-max', 'piebald-changelog', 'piebald-builtin-tools'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'API keys, subscriptions such as Claude Pro/Max, ChatGPT, Copilot or SuperGrok, or logins imported from Claude Code, Codex or Gemini CLI', cite: ['piebald-providers', 'piebald-home', 'piebald-intro'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'Setup signs you in to a Piebald account via GitHub, Google, Microsoft or email; the app checks sign-in and subscription online', cite: ['piebald-intro', 'piebald-issue-26', 'piebald-proxy'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Read-only, Auto-accept, Plan and YOLO modes; pending tool calls queue over the input box to approve or deny, and survive restarts', mark: 'yes', cite: ['piebald-permission-modes', 'piebald-changelog', 'piebald-home'] } },
				{ label: 'Model and mode pickers', hint: 'And other model settings', splash: S.models, other: { text: 'A provider and model picker in the composer and four permission modes; you write the system prompt (none by default) and set temperature, stop sequences, max tokens and custom fields', mark: 'yes', cite: ['piebald-changelog', 'piebald-permission-modes', 'piebald-context', 'piebald-home'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Local and remote HTTP servers with OAuth, headers and resources; servers or single tools switch on or off per chat', mark: 'yes', cite: ['piebald-mcp', 'piebald-changelog', 'piebald-home'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Pro: create Git worktrees, start chats in them, move chats between them or approve a plan into a new one. Sandboxing is planned', mark: 'yes', cite: ['piebald-worktrees', 'piebald-changelog', 'piebald-managing-chats', 'piebald-pricing', 'piebald-roadmap'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'Pro: terminals in a pane docked at the bottom; on every plan, agent commands run in an embedded terminal that takes input', mark: 'yes', cite: ['piebald-terminal', 'piebald-builtin-tools', 'piebald-pricing'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'With LaunchSubagent, the agent hands scoped sub-tasks to subagents on the same or other models; free on Basic', mark: 'yes', cite: ['piebald-builtin-tools', 'piebald-context-management', 'piebald-pricing'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'The sidebar shows which chats are working, need you or are done; status and pending approvals persist across reboots', mark: 'yes', cite: ['piebald-home'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'Desktop alerts with sound when a model finishes or a tool needs approval; error alerts, custom text and sound choice are Pro', mark: 'yes', cite: ['piebald-notifications', 'piebald-pricing'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Edits render as diffs in chat, and pending tool calls can be approved or denied with a message; the Pro Git viewer shows diffs, inline or side by side, with no other Git actions yet', mark: 'partial', cite: ['piebald-chat-view', 'piebald-changelog', 'piebald-git-viewer'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'Pro: a file browser, a code editor and the Git viewer for diffs', mark: 'yes', cite: ['piebald-pricing', 'piebald-git-viewer'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'No GitHub integration or PR creation is documented; PR/MR stack support is planned, and remote MCP servers such as GitHub’s can be added', mark: 'no', cite: ['piebald-git-viewer', 'piebald-changelog'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Web mode serves the UI from a headless machine to a browser, for one Piebald account; bind it to 0.0.0.0 for remote use, with optional HTTPS', mark: 'yes', cite: ['piebald-web-mode'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'The desktop app updates itself; on macOS it can also be installed and updated from the official Homebrew tap', mark: 'yes', cite: ['piebald-homebrew'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not yet; importing chats from Claude Code, Codex, Gemini CLI, Cursor and other tools is planned for Pro', mark: 'no', cite: ['piebald-pricing'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Chat search in the sidebar, styled after VS Code’s search; the agent can also search past chats through its SearchChats tool', mark: 'yes', cite: ['piebald-changelog'] } },
				{ label: 'Fork a conversation', splash: S.fork, other: { text: 'Pro: branch from an earlier message by replying to it or editing it, and duplicate whole chats', mark: 'yes', cite: ['piebald-chat-flow', 'piebald-managing-chats', 'piebald-pricing'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Piebald is the agent: its own loop sends HTTP requests to providers such as OpenAI, Anthropic and Google, or to compatible APIs, and works through built-in tools; for Claude Pro/Max it runs Claude Code in the background. Its docs don’t mention ACP. Splash runs other vendors’ agent CLIs and talks to each over the <strong>Agent Client Protocol</strong>, natively or via an adapter.',
			cite: ['piebald-home', 'piebald-providers', 'piebald-builtin-tools', 'piebald-claude-max', 'piebald-changelog', 'splash-registry', 'acp']
		},
		{
			title: 'Price, accounts and license',
			text: 'Piebald is closed source. Basic is free; Pro, $20 a month, adds worktrees, the file browser, editor and terminal, chat branching and the HTTP traffic inspector. Piebald sells no inference, and setup signs you in to a Piebald account. Splash is free, MIT-licensed and has no accounts; each agent runs on the login you gave its CLI.',
			cite: ['piebald-repo', 'piebald-terms', 'piebald-pricing', 'piebald-telemetry', 'piebald-intro', 'splash-license', 'splash-download', 'splash-build', 'splash-agents']
		},
		{
			title: 'Where it runs',
			text: 'Piebald ships desktop builds for macOS, Windows x64 and Linux x64 and ARM64, plus a <code>piebald-web</code> server for a headless machine, reached from a browser by one Piebald account. Splash builds for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64, and <code>splash-server</code> serves one user over an SSH tunnel. Neither documents a mobile app.',
			cite: ['piebald-downloads', 'piebald-release', 'piebald-web-mode', 'splash-install', 'splash-server']
		},
		{
			title: 'What each centers on',
			text: 'Piebald centers on control of its own agent loop: a system prompt you write, inference settings, goals, subagents, Claude Code-compatible hooks and skills, and on Pro, pausing, branching and an HTTP traffic inspector. Splash centers on sessions from several agents: a <strong>Needs attention</strong> queue, a review screen, a GitHub view and importing conversations started elsewhere.',
			cite: ['piebald-home', 'piebald-context', 'piebald-chat-flow', 'piebald-hooks', 'piebald-pricing', 'splash-features', 'splash-github', 'splash-history']
		}
	],
	fit: {
		splash: [
			'You want a free, MIT-licensed app that needs no account.',
			'You want agents from several vendors, such as Claude Code and Codex, side by side over the Agent Client Protocol.',
			'You want each session in its own git worktree and a review screen that sends feedback to the agent.',
			'You want to import conversations your agents started elsewhere, and a GitHub view of issues, pull requests and Actions runs.'
		],
		other: [
			'You want to write the agent’s system prompt yourself and tune temperature, stop sequences and max tokens.',
			'You want to use Claude Pro/Max, ChatGPT, Copilot or SuperGrok subscriptions, or API keys, with one agent.',
			'You want a code editor and file browser in the app, and to branch or fork chats, on the Pro plan.',
			'You want an agent that launches its own subagents, with MCP servers and tools chosen per chat.'
		]
	},
	sources: [
		{ id: 'piebald-home', title: 'The ultimate agentic AI control experience for developers', url: 'https://piebald.ai/', publisher: 'Piebald LLC', checked: '2026-10-10' },
		{ id: 'piebald-pricing', title: 'Pricing', url: 'https://piebald.ai/pricing', publisher: 'Piebald LLC', checked: '2026-10-10' },
		{ id: 'piebald-downloads', title: 'Downloads', url: 'https://piebald.ai/downloads', publisher: 'Piebald LLC', checked: '2026-10-10' },
		{ id: 'piebald-terms', title: 'Terms & Conditions', url: 'https://piebald.ai/terms', publisher: 'Piebald LLC', checked: '2026-10-10' },
		{ id: 'piebald-intro', title: 'Introduction', url: 'https://docs.piebald.ai/introduction', publisher: 'Piebald LLC', checked: '2026-10-10' },
		{ id: 'piebald-web-mode', title: 'Web mode', url: 'https://docs.piebald.ai/web-mode', publisher: 'Piebald LLC', checked: '2026-10-10' },
		{ id: 'piebald-changelog', title: 'Changelog (release notes)', url: 'https://docs.piebald.ai/changelog', publisher: 'Piebald LLC', checked: '2026-10-10' },
		{ id: 'piebald-telemetry', title: 'Telemetry', url: 'https://docs.piebald.ai/telemetry', publisher: 'Piebald LLC', checked: '2026-10-10' },
		{ id: 'piebald-proxy', title: 'Proxying Piebald', url: 'https://docs.piebald.ai/proxying-piebald', publisher: 'Piebald LLC', checked: '2026-10-10' },
		{ id: 'piebald-providers', title: 'All supported providers', url: 'https://docs.piebald.ai/providers/all-supported-providers', publisher: 'Piebald LLC', checked: '2026-10-10' },
		{ id: 'piebald-claude-max', title: 'Claude Pro/Max', url: 'https://docs.piebald.ai/providers/claude-max', publisher: 'Piebald LLC', checked: '2026-10-10' },
		{ id: 'piebald-builtin-tools', title: 'Builtin tools', url: 'https://docs.piebald.ai/features/agentic/builtin-tools', publisher: 'Piebald LLC', checked: '2026-10-10' },
		{ id: 'piebald-context', title: 'Context', url: 'https://docs.piebald.ai/features/agentic/context', publisher: 'Piebald LLC', checked: '2026-10-10' },
		{ id: 'piebald-permission-modes', title: 'Permission modes', url: 'https://docs.piebald.ai/features/agentic/permission-modes', publisher: 'Piebald LLC', checked: '2026-10-10' },
		{ id: 'piebald-mcp', title: 'MCP servers', url: 'https://docs.piebald.ai/features/agentic/mcp-servers', publisher: 'Piebald LLC', checked: '2026-10-10' },
		{ id: 'piebald-hooks', title: 'Hooks', url: 'https://docs.piebald.ai/features/agentic/hooks', publisher: 'Piebald LLC', checked: '2026-10-10' },
		{ id: 'piebald-chat-flow', title: 'Chat flow', url: 'https://docs.piebald.ai/features/agentic/chat-flow', publisher: 'Piebald LLC', checked: '2026-10-10' },
		{ id: 'piebald-chat-view', title: 'Chat view configuration', url: 'https://docs.piebald.ai/features/chat-experience/chat-view-configuration', publisher: 'Piebald LLC', checked: '2026-10-10' },
		{ id: 'piebald-context-management', title: 'Context management', url: 'https://docs.piebald.ai/features/chat-experience/context-management', publisher: 'Piebald LLC', checked: '2026-10-10' },
		{ id: 'piebald-worktrees', title: 'Git worktrees', url: 'https://docs.piebald.ai/features/development-experience/git-worktrees', publisher: 'Piebald LLC', checked: '2026-10-10' },
		{ id: 'piebald-terminal', title: 'Integrated terminal', url: 'https://docs.piebald.ai/features/development-experience/integrated-terminal', publisher: 'Piebald LLC', checked: '2026-10-10' },
		{ id: 'piebald-git-viewer', title: 'Git viewer', url: 'https://docs.piebald.ai/features/development-experience/git-viewer', publisher: 'Piebald LLC', checked: '2026-10-10' },
		{ id: 'piebald-notifications', title: 'Desktop notifications', url: 'https://docs.piebald.ai/features/chat-experience/desktop-notifications', publisher: 'Piebald LLC', checked: '2026-10-10' },
		{ id: 'piebald-managing-chats', title: 'Managing chats', url: 'https://docs.piebald.ai/features/managing-chats/managing-chats', publisher: 'Piebald LLC', checked: '2026-10-10' },
		{ id: 'piebald-roadmap', title: 'Roadmap', url: 'https://docs.piebald.ai/roadmap', publisher: 'Piebald LLC', checked: '2026-10-10' },
		{ id: 'piebald-repo', title: 'Piebald-AI/piebald-issues', url: 'https://github.com/Piebald-AI/piebald-issues', publisher: 'Piebald-AI/piebald-issues on GitHub', checked: '2026-10-10' },
		{ id: 'piebald-release', title: 'Release v0.7.1', url: 'https://github.com/Piebald-AI/piebald-issues/releases/tag/v0.7.1', publisher: 'Piebald-AI/piebald-issues on GitHub', checked: '2026-10-10' },
		{ id: 'piebald-homebrew', title: 'Piebald-AI/homebrew-tap', url: 'https://github.com/Piebald-AI/homebrew-tap', publisher: 'Piebald-AI/homebrew-tap on GitHub', checked: '2026-10-10' },
		{ id: 'piebald-issue-26', title: 'Cannot use app first-time (#26)', url: 'https://github.com/Piebald-AI/piebald-issues/issues/26', publisher: 'Piebald-AI/piebald-issues on GitHub', checked: '2026-10-10' },
		{ id: 'piebald-issue-31', title: 'CRITICAL: Missing Telemetry & Integration Disclosure (PostHog, Exa) (#31)', url: 'https://github.com/Piebald-AI/piebald-issues/issues/31', publisher: 'Piebald-AI/piebald-issues on GitHub', checked: '2026-10-10' }
	]
};
