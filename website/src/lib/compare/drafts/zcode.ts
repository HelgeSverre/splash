// Splash vs ZCode. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const ZCODE: Comparison = {
	slug: 'zcode',
	name: 'ZCode',
	description: 'How Splash and ZCode compare on agents, models, pricing, isolation, review and remote use, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and ZCode are both free, open-source desktop apps for working with coding agents. ZCode, from Z.ai, runs one agent, its own ZCode Agent, on GLM models or other providers’ APIs, and splits work across subagents. Splash runs many vendors’ agents side by side over the Agent Client Protocol, each session in the project folder or a git worktree.',
	other: {
		name: 'ZCode',
		url: 'https://zcode.z.ai/',
		maker: 'Z.ai',
		summary: 'Z.ai’s open-source desktop Agentic Development Environment, built around GLM-5.3. It runs Z.ai’s own ZCode Agent with subagents, a terminal, a browser panel, automations and remote workspaces on macOS, Windows and Linux.',
		cite: ['zcode-welcome', 'zcode-agents', 'zcode-install', 'zcode-license']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Electron desktop app Z.ai calls an Agentic Development Environment; the open-source repo also builds a zcode TUI and web UI', cite: ['zcode-welcome', 'zcode-readme'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: '3.14.5, released 9 October 2026; Linux builds and custom subagents are in Beta. The public repo’s latest release is v3.14.3', cite: ['zcode-changelog', 'zcode-home', 'zcode-subagents', 'zcode-repo-release'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (Apache-2.0); its NOTICE says the open release may not include every feature of the official app', cite: ['zcode-license', 'zcode-notice'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free; models need an API key or a GLM Coding Plan: $18, $80 or $168 a month, 30% less billed yearly', cite: ['zcode-qa', 'zcode-subscribe', 'zcode-home'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon and Intel), Windows x64 and ARM64, and Linux x64 and ARM64 as .deb, .rpm or AppImage, in Beta', cite: ['zcode-install', 'zcode-home'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Z.ai’s own ZCode Agent, with built-in and custom (Beta) subagents; running other vendors’ coding agents isn’t documented', cite: ['zcode-agents', 'zcode-qa', 'zcode-subagents'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Per the public source, runs its bundled agent as a child process speaking its own ZCode Protocol over stdio', cite: ['zcode-runtime', 'zcode-protocol', 'zcode-stdio', 'zcode-welcome'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Z.ai or BigModel sign-in for a GLM Coding Plan, or API keys for Anthropic, OpenAI and others; terminal settings aren’t synced', cite: ['zcode-configuration', 'zcode-qa'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'Not with an API key alone; the GLM Coding Plan, free trial and quota-reset cards need a Z.ai or BigModel account', cite: ['zcode-usage-stats', 'zcode-configuration'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'The task pauses until you answer; four modes, from Ask before changes (the default) to Full access, set what needs approval', mark: 'yes', cite: ['zcode-safety'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'User or workspace servers over stdio, HTTP or SSE, with OAuth; imports configs from Claude Code, Codex CLI and OpenCode', mark: 'yes', cite: ['zcode-mcp'] } },
				{
					label: 'Plugins, skills and hooks',
					hint: 'Extensions beyond MCP',
					splash: { text: 'Shows each agent’s skills and commands read-only in Settings, and completes slash commands', mark: 'partial', cite: ['splash-features'] },
					other: { text: 'Plugins bundle skills, commands, subagents, MCP servers and hooks; Claude Code’s marketplace comes preloaded, and skills import from other tools', mark: 'yes', cite: ['zcode-plugin', 'zcode-skill', 'zcode-hooks'] }
				}
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Tasks share the opened workspace folder; no per-task worktree is documented. Workspaces can run in Docker, WSL or over SSH', mark: 'no', cite: ['zcode-agents', 'zcode-remote-dev'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'The sidebar marks tasks waiting for confirmation, running, unread or failed; unanswered questions time out after five minutes by default', mark: 'yes', cite: ['zcode-safety', 'zcode-ade-tools'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'Not described in the docs; the public desktop source sends OS notifications for task events, including permission requests and questions', mark: 'yes', cite: ['zcode-notifications-src'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'The agent delegates to built-in general-purpose and Explore subagents or custom ones (Beta); dynamic workflows script several subagents', mark: 'yes', cite: ['zcode-subagents', 'zcode-changelog'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Automations run the agent on a schedule, up to 20 tasks, on your machine; idle-time tasks for subscribers are rolling out', mark: 'yes', cite: ['zcode-automations', 'zcode-idle'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'A browser panel with DevTools and an element picker, which the agent can drive to navigate, fill forms and check UI', mark: 'yes', cite: ['zcode-ade-tools'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'A change summary under each reply with all-or-nothing Undo and Reapply; Add to Chat hands changed files back to the agent', mark: 'yes', cite: ['zcode-edit-history', 'zcode-task-management'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'File tree with Git status markers and a changed-files filter; Git commit, branch switching and a read-only Git graph', mark: 'yes', cite: ['zcode-task-management', 'zcode-qa'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'No GitHub sign-in, pull request or CI integration is documented; GitHub serves as a source for plugins', mark: 'no', cite: ['zcode-plugin', 'zcode-feedback'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'A workspace and its agent can run on a POSIX SSH host, in WSL or in a local Docker container', mark: 'yes', cite: ['zcode-remote-dev'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'No native app; a phone browser drives the open desktop via a QR link, and WeChat or Feishu bots steer tasks', mark: 'partial', cite: ['zcode-remote-control', 'zcode-bot-channel', 'zcode-install'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'A migration wizard imports Claude Code conversations and those from older ZCode versions; other tools aren’t supported', mark: 'partial', cite: ['zcode-install'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Keyword search over chats, commands and files from the sidebar or Command Center; # links a past chat into a task', mark: 'yes', cite: ['zcode-task-management', 'zcode-ade-tools', 'zcode-agents'] } },
				{ label: 'Fork a conversation', splash: S.fork, other: { text: 'Forks branch the conversation alone; both copies work in one workspace, and files on disk aren’t rolled back', mark: 'yes', cite: ['zcode-agents'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'ZCode runs its own <strong>ZCode Agent</strong> on GLM models or other providers’ APIs; its docs describe no way to run other coding agents. Per the public source, the agent runs as a child process speaking ZCode’s own protocol over stdio. Splash starts each vendor’s agent and speaks the <strong>Agent Client Protocol</strong> with it, natively or via an adapter.',
			cite: ['zcode-agents', 'zcode-qa', 'zcode-configuration', 'zcode-runtime', 'zcode-protocol', 'zcode-stdio', 'splash-readme', 'splash-registry', 'acp']
		},
		{
			title: 'Models, accounts and price',
			text: 'The ZCode app is free and Apache-2.0 licensed. A Z.ai or BigModel sign-in brings a 5-day trial, then draws on a paid GLM Coding Plan from $18 a month; an API key from a supported provider works without signing in. Splash is free, MIT-licensed and has no accounts; each agent runs on its own CLI login.',
			cite: ['zcode-qa', 'zcode-license', 'zcode-welcome', 'zcode-configuration', 'zcode-usage-stats', 'zcode-subscribe', 'splash-download', 'splash-license', 'splash-build', 'splash-agents']
		},
		{
			title: 'Where agents run',
			text: 'Neither runs agents in a hosted cloud. ZCode runs its agent on your computer or in a workspace on an SSH host, in WSL or a local Docker container, and a phone browser, WeChat or Feishu can steer the open desktop. Splash runs agents locally or under <code>splash-server</code>, reached from a browser over an SSH tunnel.',
			cite: ['zcode-automations', 'zcode-idle', 'zcode-remote-dev', 'zcode-remote-control', 'zcode-bot-channel', 'splash-readme', 'splash-server']
		},
		{
			title: 'Parallel work',
			text: 'ZCode’s agent splits work across built-in and custom (Beta) subagents, and dynamic workflows script several at once; tasks work in the opened workspace folder, and no worktree per task is documented. Splash runs separate sessions side by side, each its own agent, in the project folder or a git worktree on its own branch.',
			cite: ['zcode-subagents', 'zcode-changelog', 'zcode-agents', 'splash-readme', 'splash-features']
		},
		{
			title: 'Around the session',
			text: 'Around its agent, ZCode bundles a browser panel the agent drives, Goal Mode, scheduled automations, plugins with skills, commands and hooks (including Claude Code’s marketplace), project memory and a repo wiki. Splash centers on its conversations: a Needs attention queue, a review screen, transcript search, a GitHub view across repositories, and importing sessions started elsewhere.',
			cite: ['zcode-ade-tools', 'zcode-goal', 'zcode-automations', 'zcode-plugin', 'zcode-hooks', 'zcode-agents', 'zcode-wiki', 'splash-features', 'splash-github', 'splash-history']
		}
	],
	fit: {
		splash: [
			'You want to run agents from several vendors, such as Claude Code, Codex and Gemini, side by side in one app.',
			'You want each session in its own git worktree on its own branch.',
			'You want each agent to run on the CLI login you already have, with no account in the app.',
			'You want a GitHub view of issues, pull requests and Actions runs, and to import conversations agents started elsewhere.'
		],
		other: [
			'You work mainly with Z.ai’s GLM models and have, or plan to get, a GLM Coding Plan.',
			'You want one agent with subagents, scheduled automations and a browser panel it can drive.',
			'You want to run workspaces over SSH, in WSL or in Docker, and steer the desktop from a phone browser or chat bots.',
			'You want builds for Windows and Linux on ARM64, and plugins, skills and hooks that work with Claude Code’s formats.'
		]
	},
	sources: [
		{ id: 'zcode-home', title: 'Official Harness for GLM-5.3', url: 'https://zcode.z.ai/en', publisher: 'Z.ai', checked: '2026-10-10' },
		{ id: 'zcode-changelog', title: 'ZCode Releases & Updates', url: 'https://zcode.z.ai/en/changelog', publisher: 'Z.ai', checked: '2026-10-10' },
		{ id: 'zcode-subscribe', title: 'GLM Coding Plan', url: 'https://z.ai/subscribe', publisher: 'Z.ai', checked: '2026-10-10' },
		{ id: 'zcode-welcome', title: 'Welcome to ZCode for GLM-5.3', url: 'https://zcode.z.ai/en/docs/welcome', publisher: 'Z.ai', checked: '2026-10-10' },
		{ id: 'zcode-install', title: 'Install', url: 'https://zcode.z.ai/en/docs/install', publisher: 'Z.ai', checked: '2026-10-10' },
		{ id: 'zcode-qa', title: 'FAQ (Q&A)', url: 'https://zcode.z.ai/en/docs/qa', publisher: 'Z.ai', checked: '2026-10-10' },
		{ id: 'zcode-configuration', title: 'Connect Models & Plans', url: 'https://zcode.z.ai/en/docs/configuration', publisher: 'Z.ai', checked: '2026-10-10' },
		{ id: 'zcode-usage-stats', title: 'Usage Stats', url: 'https://zcode.z.ai/en/docs/usage-stats', publisher: 'Z.ai', checked: '2026-10-10' },
		{ id: 'zcode-agents', title: 'ZCode Agent', url: 'https://zcode.z.ai/en/docs/agents', publisher: 'Z.ai', checked: '2026-10-10' },
		{ id: 'zcode-subagents', title: 'Subagents', url: 'https://zcode.z.ai/en/docs/subagents', publisher: 'Z.ai', checked: '2026-10-10' },
		{ id: 'zcode-safety', title: 'Safety Confirmation', url: 'https://zcode.z.ai/en/docs/safety-confirm', publisher: 'Z.ai', checked: '2026-10-10' },
		{ id: 'zcode-mcp', title: 'MCP', url: 'https://zcode.z.ai/en/docs/mcp-services', publisher: 'Z.ai', checked: '2026-10-10' },
		{ id: 'zcode-plugin', title: 'Plugin', url: 'https://zcode.z.ai/en/docs/plugin', publisher: 'Z.ai', checked: '2026-10-10' },
		{ id: 'zcode-skill', title: 'Skill', url: 'https://zcode.z.ai/en/docs/skill', publisher: 'Z.ai', checked: '2026-10-10' },
		{ id: 'zcode-hooks', title: 'Hooks', url: 'https://zcode.z.ai/en/docs/hooks', publisher: 'Z.ai', checked: '2026-10-10' },
		{ id: 'zcode-ade-tools', title: 'ADE Tools', url: 'https://zcode.z.ai/en/docs/ADE-tools', publisher: 'Z.ai', checked: '2026-10-10' },
		{ id: 'zcode-edit-history', title: 'Edit History', url: 'https://zcode.z.ai/en/docs/edit-history', publisher: 'Z.ai', checked: '2026-10-10' },
		{ id: 'zcode-task-management', title: 'Task & File Management', url: 'https://zcode.z.ai/en/docs/task-management', publisher: 'Z.ai', checked: '2026-10-10' },
		{ id: 'zcode-feedback', title: 'Feedback & Support', url: 'https://zcode.z.ai/en/docs/feedback', publisher: 'Z.ai', checked: '2026-10-10' },
		{ id: 'zcode-remote-dev', title: 'Remote Development', url: 'https://zcode.z.ai/en/docs/remote-development', publisher: 'Z.ai', checked: '2026-10-10' },
		{ id: 'zcode-remote-control', title: 'Remote Control', url: 'https://zcode.z.ai/en/docs/remote-control', publisher: 'Z.ai', checked: '2026-10-10' },
		{ id: 'zcode-bot-channel', title: 'Bot Channel', url: 'https://zcode.z.ai/en/docs/bot-channel', publisher: 'Z.ai', checked: '2026-10-10' },
		{ id: 'zcode-automations', title: 'Automations', url: 'https://zcode.z.ai/en/docs/automations', publisher: 'Z.ai', checked: '2026-10-10' },
		{ id: 'zcode-idle', title: 'Idle-time Task', url: 'https://zcode.z.ai/en/docs/idle-time-tasks', publisher: 'Z.ai', checked: '2026-10-10' },
		{ id: 'zcode-goal', title: 'Goal Mode', url: 'https://zcode.z.ai/en/docs/goal', publisher: 'Z.ai', checked: '2026-10-10' },
		{ id: 'zcode-wiki', title: 'Wiki', url: 'https://zcode.z.ai/en/docs/repo-wiki', publisher: 'Z.ai', checked: '2026-10-10' },
		{ id: 'zcode-readme', title: 'README.en.md', url: 'https://github.com/zai-org/ZCode/blob/main/README.en.md', publisher: 'zai-org/ZCode on GitHub', checked: '2026-10-10' },
		{ id: 'zcode-license', title: 'LICENSE', url: 'https://github.com/zai-org/ZCode/blob/main/LICENSE', publisher: 'zai-org/ZCode on GitHub', checked: '2026-10-10' },
		{ id: 'zcode-notice', title: 'NOTICE.md', url: 'https://github.com/zai-org/ZCode/blob/main/NOTICE.md', publisher: 'zai-org/ZCode on GitHub', checked: '2026-10-10' },
		{ id: 'zcode-repo-release', title: 'Release v3.14.3', url: 'https://github.com/zai-org/ZCode/releases/tag/v3.14.3', publisher: 'zai-org/ZCode on GitHub', checked: '2026-10-10' },
		{ id: 'zcode-runtime', title: 'packages/shared/src/zcode-agent-runtime.ts', url: 'https://github.com/zai-org/ZCode/blob/main/packages/shared/src/zcode-agent-runtime.ts', publisher: 'zai-org/ZCode on GitHub', checked: '2026-10-10' },
		{ id: 'zcode-protocol', title: 'packages/shared/src/zcode-protocol/index.ts', url: 'https://github.com/zai-org/ZCode/blob/main/packages/shared/src/zcode-protocol/index.ts', publisher: 'zai-org/ZCode on GitHub', checked: '2026-10-10' },
		{ id: 'zcode-stdio', title: 'packages/services/src/zcode-agent/zcodeStdioTransport.ts', url: 'https://github.com/zai-org/ZCode/blob/main/packages/services/src/zcode-agent/zcodeStdioTransport.ts', publisher: 'zai-org/ZCode on GitHub', checked: '2026-10-10' },
		{ id: 'zcode-notifications-src', title: 'packages/desktop/src/main/desktopNotifications.ts', url: 'https://github.com/zai-org/ZCode/blob/main/packages/desktop/src/main/desktopNotifications.ts', publisher: 'zai-org/ZCode on GitHub', checked: '2026-10-10' }
	]
};
