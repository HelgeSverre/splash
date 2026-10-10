// Splash vs PiDeck. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const PIDECK: Comparison = {
	slug: 'pideck',
	name: 'PiDeck',
	description: 'How Splash and PiDeck compare on agents, platforms, pricing, isolation, review and remote use, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and PiDeck are both free, MIT-licensed desktop apps for running coding-agent sessions side by side. PiDeck is an Electron workbench built around the pi agent: it runs one pi process per session, adds a second backend, DeepSeek Harness, and puts Git and a terminal beside the chat. Splash connects to each agent over the Agent Client Protocol.',
	other: {
		name: 'PiDeck',
		url: 'https://pideck.caoayu.top/',
		maker: 'ayuayue',
		summary: 'An Electron desktop workbench for Windows, macOS and Linux that manages local pi agent sessions, configuration, Git and a terminal in one window, with DeepSeek Harness and image generation as further backends.',
		cite: ['pideck-home', 'pideck-readme']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Electron desktop workbench for pi sessions, Git and a terminal, plus an optional web edition for browsers on your LAN', cite: ['pideck-home', 'pideck-settings'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v0.8.0 (7 October 2026), badged experimental; main-branch notes announce v0.9.0, which has no tag or release yet', cite: ['pideck-v0-8-0', 'pideck-readme', 'pideck-changelog'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (MIT)', cite: ['pideck-license', 'pideck-home'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free, with no paid tier; donations are optional, and the providers you configure bill model use', cite: ['pideck-faq', 'pideck-readme'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'Windows, macOS (an arm64 build plus an unlabeled one) and Linux x64 and arm64 (AppImage, .deb, tar.gz)', cite: ['pideck-faq', 'pideck-v0-8-0'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Electron (version 43 in package.json), TypeScript and React 19', cite: ['pideck-package', 'pideck-readme'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'pi and DSH (DeepSeek Harness), plus image generation; seven ACP presets, including Claude Agent and Codex CLI, are unreleased', cite: ['pideck-faq', 'pideck-readme', 'pideck-changelog', 'pideck-acp-presets'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'One pi --mode rpc child process per session over stdio JSON-RPC; DSH runs in an embedded Electron utility process', cite: ['pideck-home', 'pideck-readme', 'pideck-pi-process', 'pideck-dsh-host'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Reuses pi’s provider logins and API keys in ~/.pi/agent; DSH keys come from DSH’s own credential store', cite: ['pideck-architecture', 'pideck-getting-started', 'pideck-readme', 'pideck-settings'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'No PiDeck account; you sign in to model providers through pi, and optionally to MCP servers or a Feishu bot', cite: ['pideck-getting-started', 'pideck-v0-8-0', 'pideck-readme'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'pi’s security gate defaults to off, allowing every call; the standard and strict levels ask with Allow or Deny cards', mark: 'yes', cite: ['pideck-security', 'pideck-feature-reference'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Configured on a settings page that edits mcp.json; servers needing OAuth sign in from their status row', mark: 'yes', cite: ['pideck-v0-8-0'] } },
				{ label: 'Skills and extensions', hint: 'Add-ons the agent loads', splash: { text: 'Read-only lists of each agent’s skills and commands in Settings', mark: 'partial', cite: ['splash-features'] }, other: { text: 'Manage global and per-project Skills and pi extensions; search and install from prompts.chat and skills.sh', mark: 'yes', cite: ['pideck-home', 'pideck-readme'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A pi process per session, scoped to its project folder; per-branch Git worktrees are a workspace type you create', mark: 'yes', cite: ['pideck-readme', 'pideck-home', 'pideck-feature-reference'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'A node-pty terminal dock with a tab per agent; shells include PowerShell, CMD, Bash, Zsh, Fish, Git Bash and WSL', mark: 'yes', cite: ['pideck-readme', 'pideck-feature-reference'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Status dots for running, idle or failed sessions, an Activity list of running agents across projects, and a desktop pet', mark: 'partial', cite: ['pideck-feature-reference', 'pideck-readme'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'In-app toasts, plus system notifications for agent questions with their own switch; background questions can stay silent', mark: 'yes', cite: ['pideck-readme'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Subagents that pi launches show in a live strip above the composer with goal, status, tokens and tool calls', mark: 'yes', cite: ['pideck-architecture'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Cron-based Automation tasks with a visual editor, run history, per-project scope and normal, plan or goal modes; DSH included', mark: 'yes', cite: ['pideck-changelog', 'pideck-site-changelog'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Each turn lists changed files and line counts; read-only split or unified diffs; selections can be quoted back to the agent', mark: 'yes', cite: ['pideck-readme', 'pideck-feature-reference'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'None documented; the Git panel handles commit, push, pull, cherry-pick and revert, with a branch graph and AI commit messages', mark: 'no', cite: ['pideck-home', 'pideck-feature-reference'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Opt-in web edition for LAN browsers, token-protected by default, and a two-way Feishu/Lark bot; cloudflared and Tailscale access is unreleased', mark: 'yes', cite: ['pideck-settings', 'pideck-site-changelog', 'pideck-ultimate-guide', 'pideck-changelog'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'No native app; the web edition is tuned for phone browsers, and you can message the Feishu bot from a phone', mark: 'partial', cite: ['pideck-v0-8-0', 'pideck-ultimate-guide'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Updates itself on Windows and Linux, downloading in the background by default; on macOS it opens the GitHub release page', mark: 'partial', cite: ['pideck-readme'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'pi CLI sessions appear as they are; a one-way import copies sessions from ten tools, including Codex, Claude, Cursor and OpenCode', mark: 'yes', cite: ['pideck-architecture', 'pideck-v0-7-9', 'pideck-readme'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'A command palette finds sessions and projects across all projects; searching message text isn’t documented', mark: 'partial', cite: ['pideck-feature-reference'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'PiDeck starts a <code>pi --mode rpc</code> process per session and talks to it over stdio JSON-RPC; DeepSeek Harness runs inside an Electron utility process. An ACP backend for tools such as Gemini CLI and Codex sits on main, opt-in and unreleased. Splash connects to every agent over the <strong>Agent Client Protocol</strong>, natively or through an adapter.',
			cite: ['pideck-pi-process', 'pideck-readme', 'pideck-dsh-host', 'pideck-changelog', 'pideck-settings-ts', 'splash-registry', 'acp']
		},
		{
			title: 'Platforms and releases',
			text: 'PiDeck ships Windows, macOS and Linux builds; Windows and Linux update themselves, and macOS opens the release page. Its latest release is v0.8.0, badged experimental; main already describes an unreleased v0.9.0 with ACP and internet access. Splash builds for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64 and is updated by downloading a new release.',
			cite: ['pideck-faq', 'pideck-readme', 'pideck-v0-8-0', 'pideck-changelog', 'splash-install', 'splash-about']
		},
		{
			title: 'Reaching sessions away from the desk',
			text: 'Both run agents on your own computer. PiDeck can serve a token-protected web edition to browsers on your LAN, phones included, and a Feishu/Lark bot relays chat from your phone to the desktop. Splash can run as <code>splash-server</code> on the machine that holds your code, which you open in a browser through an SSH tunnel.',
			cite: ['pideck-readme', 'pideck-settings', 'pideck-v0-8-0', 'pideck-ultimate-guide', 'splash-readme', 'splash-server']
		},
		{
			title: 'Safety around the agent',
			text: 'PiDeck wraps pi in its own guards: a trust prompt when a project first opens, a security gate whose default level, <code>off</code>, allows every call, a trash guard for deletions and Rewind checkpoints kept as git refs; pi does not sandbox its tools. Splash shows each agent’s own permission requests and holds pending ones in <strong>Needs attention</strong>.',
			cite: ['pideck-feature-reference', 'pideck-security', 'pideck-architecture', 'pideck-pi-docs', 'splash-features']
		},
		{
			title: 'Tools around the session',
			text: 'PiDeck builds out the tools around pi: skill and prompt stores, cron Automation tasks, a Git panel with AI commit messages, a Feishu bot and session import from ten other tools. Splash centers on many agents through one protocol, with a Needs attention queue, a review screen, transcript search and a GitHub triage view across repositories.',
			cite: ['pideck-readme', 'pideck-changelog', 'pideck-home', 'pideck-v0-7-9', 'splash-features', 'splash-github']
		}
	],
	fit: {
		splash: [
			'You want Claude Code, Codex, Gemini, Copilot and other agents in the same chat view, each over the Agent Client Protocol.',
			'You want permission requests, connection failures and finished turns gathered in one Needs attention queue.',
			'You want full-text search over saved transcripts, archived sessions included.',
			'You want a GitHub triage view of issues, pull requests and Actions runs across repositories.'
		],
		other: [
			'You use the pi agent and want its sessions, skills and extensions in a desktop window that shares files with the pi CLI.',
			'You want DeepSeek Harness and image generation next to pi, with provider balance checks built in.',
			'You want cron-scheduled agent tasks, a Git panel with AI commit messages and a terminal tab per agent.',
			'You want to reach sessions from a phone browser on your LAN or through a Feishu/Lark bot.'
		]
	},
	sources: [
		{ id: 'pideck-home', title: 'PiDeck - pi desktop 桌面工作台', url: 'https://pideck.caoayu.top/', publisher: 'ayuayue', checked: '2026-10-10' },
		{ id: 'pideck-faq', title: '常见问题', url: 'https://pideck.caoayu.top/guide/faq', publisher: 'ayuayue', checked: '2026-10-10' },
		{ id: 'pideck-getting-started', title: '快速开始', url: 'https://pideck.caoayu.top/guide/getting-started', publisher: 'ayuayue', checked: '2026-10-10' },
		{ id: 'pideck-feature-reference', title: '功能操作手册', url: 'https://pideck.caoayu.top/guide/feature-reference', publisher: 'ayuayue', checked: '2026-10-10' },
		{ id: 'pideck-architecture', title: '核心原理解析与深度指南', url: 'https://pideck.caoayu.top/guide/architecture-deep-dive', publisher: 'ayuayue', checked: '2026-10-10' },
		{ id: 'pideck-settings', title: '配置与 Skills', url: 'https://pideck.caoayu.top/guide/settings', publisher: 'ayuayue', checked: '2026-10-10' },
		{ id: 'pideck-ultimate-guide', title: '从零到精通终极全景指南', url: 'https://pideck.caoayu.top/guide/ultimate-guide', publisher: 'ayuayue', checked: '2026-10-10' },
		{ id: 'pideck-site-changelog', title: '更新日志', url: 'https://pideck.caoayu.top/changelog', publisher: 'ayuayue', checked: '2026-10-10' },
		{ id: 'pideck-readme', title: 'README.md', url: 'https://github.com/ayuayue/PiDeck/blob/main/README.md', publisher: 'ayuayue/PiDeck on GitHub', checked: '2026-10-10' },
		{ id: 'pideck-license', title: 'LICENSE', url: 'https://github.com/ayuayue/PiDeck/blob/main/LICENSE', publisher: 'ayuayue/PiDeck on GitHub', checked: '2026-10-10' },
		{ id: 'pideck-package', title: 'package.json', url: 'https://github.com/ayuayue/PiDeck/blob/main/package.json', publisher: 'ayuayue/PiDeck on GitHub', checked: '2026-10-10' },
		{ id: 'pideck-changelog', title: 'CHANGELOG.zh-CN.md', url: 'https://github.com/ayuayue/PiDeck/blob/main/CHANGELOG.zh-CN.md', publisher: 'ayuayue/PiDeck on GitHub', checked: '2026-10-10' },
		{ id: 'pideck-v0-8-0', title: 'Release v0.8.0', url: 'https://github.com/ayuayue/PiDeck/releases/tag/v0.8.0', publisher: 'ayuayue/PiDeck on GitHub', checked: '2026-10-10' },
		{ id: 'pideck-v0-7-9', title: 'Release v0.7.9', url: 'https://github.com/ayuayue/PiDeck/releases/tag/v0.7.9', publisher: 'ayuayue/PiDeck on GitHub', checked: '2026-10-10' },
		{ id: 'pideck-pi-process', title: 'src/main/pi/PiProcess.ts', url: 'https://github.com/ayuayue/PiDeck/blob/main/src/main/pi/PiProcess.ts', publisher: 'ayuayue/PiDeck on GitHub', checked: '2026-10-10' },
		{ id: 'pideck-dsh-host', title: 'src/main/dsh/DshHostProcess.ts', url: 'https://github.com/ayuayue/PiDeck/blob/main/src/main/dsh/DshHostProcess.ts', publisher: 'ayuayue/PiDeck on GitHub', checked: '2026-10-10' },
		{ id: 'pideck-acp-presets', title: 'src/shared/acpToolPresets.ts', url: 'https://github.com/ayuayue/PiDeck/blob/main/src/shared/acpToolPresets.ts', publisher: 'ayuayue/PiDeck on GitHub', checked: '2026-10-10' },
		{ id: 'pideck-settings-ts', title: 'src/shared/types/settings.ts', url: 'https://github.com/ayuayue/PiDeck/blob/main/src/shared/types/settings.ts', publisher: 'ayuayue/PiDeck on GitHub', checked: '2026-10-10' },
		{ id: 'pideck-security', title: 'src/shared/types/security.ts (v0.8.0)', url: 'https://github.com/ayuayue/PiDeck/blob/v0.8.0/src/shared/types/security.ts', publisher: 'ayuayue/PiDeck on GitHub', checked: '2026-10-10' },
		{ id: 'pideck-pi-docs', title: 'Pi documentation', url: 'https://pi.dev/docs', publisher: 'Earendil Inc.', checked: '2026-10-10' }
	]
};
