// Splash vs Lody. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const LODY: Comparison = {
	slug: 'lody',
	name: 'Lody',
	description: 'How Splash and Lody compare on agents, platforms, pricing, team workspaces, worktrees and review, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Lody both run several coding agents at once over the Agent Client Protocol, with git worktrees to keep sessions apart. In Lody, a CLI daemon on your own machines runs the agents, and desktop, web and phone apps reach them through a hosted team workspace. Splash is a desktop app with an optional single-user server.',
	other: {
		name: 'Lody',
		url: 'https://lody.ai',
		maker: 'LoroHub',
		summary: 'A shared workspace for a team’s coding agents. A CLI daemon runs them over ACP on your own machines, and desktop, web, iOS and Android apps start, follow and review their sessions.',
		cite: ['lody-readme', 'lody-quickstart', 'lody-agent-readme']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Electron desktop app, iOS and Android apps, a web app, and a Node.js CLI daemon that runs agents on your machines', cite: ['lody-quickstart', 'lody-terminal'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v0.104.0 (8 October 2026); 71 releases listed since the January 2026 launch, plus an early-access Nightly channel', cite: ['lody-changelog', 'lody-blog', 'lody-nightly'] } },
				{ label: 'License', splash: S.license, other: { text: 'Partly open source: CLI, desktop app and shared packages under Apache-2.0; hosted backends and web and mobile app code stay private', cite: ['lody-license', 'lody-agents-md', 'lody-open-source-blog'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free: 2 workspaces, 30 turns per session, 3 members. Plus: $10 per seat a month, $8 billed yearly. Enterprise: custom', cite: ['lody-pricing'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon and Intel), Windows x64, Linux x64 (AppImage, .deb); iOS 16.1+, Android and a web app', cite: ['lody-download', 'lody-app-store'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code, Codex, Grok, OpenCode, Kimi and Devin, plus any ACP Registry agent or a custom ACP launch command', cite: ['lody-docs', 'lody-changelog', 'lody-cli-runtimes'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Agent Client Protocol over stdio for every agent; Lody maintains its own Claude Code and Codex adapters with extra capabilities', cite: ['lody-agent-readme', 'lody-cli-runtimes', 'lody-quickstart', 'lody-acp-claude', 'lody-acp-codex'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Claude Code or Codex login on the CLI’s machine, or API keys in an agent config; no markup on model use', cite: ['lody-agents', 'lody-pricing'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'Yes for the official apps and CLI daemon; not for a self-built open-source desktop, lody review or read-only share links', cite: ['lody-quickstart', 'lody-contributing', 'lody-review', 'lody-0-94-0'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'A global MCP configuration you pick servers from per conversation, plus built-in Lody MCP tools for agents', mark: 'yes', cite: ['lody-changelog', 'lody-session-orchestration'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A git worktree on its own branch per session, always for GitHub repositories and optional for local projects', mark: 'yes', cite: ['lody-worktrees', 'lody-parallel-agents'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Per-project setup and cleanup scripts in Bash or PowerShell; Lody Preview shows a session’s dev server. No port allocation is documented', mark: 'yes', cite: ['lody-worktrees', 'lody-preview'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'An interactive terminal in the desktop app for local sessions, up to 8 tabs; remote sessions, phone and web have none', mark: 'partial', cite: ['lody-terminal'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'Push notifications to desktop and phone when a conversation finishes, needs permission or errors; iPhone Live Activities can answer permission prompts', mark: 'yes', cite: ['lody-notifications', 'lody-mobile'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Built-in Lody MCP tools let an agent start, message, cancel and read results of other conversations, across agents and machines', mark: 'yes', cite: ['lody-session-orchestration'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Runs a chosen agent on a schedule, once or on demand, on one of your machines while its CLI runs', mark: 'yes', cite: ['lody-scheduled-tasks'] } },
				{ label: 'Team collaboration', hint: 'Several people in one workspace', splash: { text: 'splash-server is a personal, single-user service, not a multi-user deployment', mark: 'no', cite: ['splash-server'] }, other: { text: 'Shared workspaces: members can pick up a teammate’s session and continue it, share machines and roles, and see usage per member', mark: 'yes', cite: ['lody-home', 'lody-team', 'lody-agent-roles'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'Lody Preview opens dev servers, or any URL for local sessions, with responsive viewports and click-to-comment annotations for the agent', mark: 'yes', cite: ['lody-preview', 'lody-0-74-0'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Diffs per round and per session, threaded line comments sent back to the agent, and lody review HTML reports', mark: 'yes', cite: ['lody-diff-viewer', 'lody-review'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'For GitHub projects: creates PRs from a session, shows CI, marks drafts ready, merges, and can commit and push each turn', mark: 'yes', cite: ['lody-github', 'lody-workflow'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Lody GitHub App: PR state and CI per session, review threads synced both ways, Fix PR Comments and # issue mentions', mark: 'yes', cite: ['lody-github', 'lody-diff-comments'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'No hosted agent runs; the CLI runs agents on your own machines, while sync goes through Lody’s hosted service', mark: 'no', cite: ['lody-home', 'lody-scheduled-tasks', 'lody-open-source-blog'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'npx lody daemon start adds a server, VM or workstation to your workspace, driven from desktop, web or phone', mark: 'yes', cite: ['lody-quickstart'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'iOS (iPhone and iPad, 16.1+) and Android apps to run and follow agents on your machines, with Live Activities on iPhone', mark: 'yes', cite: ['lody-download', 'lody-app-store', 'lody-mobile'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Imports a local project’s Claude Code, Codex and Pi history to continue it; new Lody chats also appear in that CLI', mark: 'yes', cite: ['lody-local-project', 'lody-0-101-0'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Text search inside the open conversation, excluding tool calls; the command palette matches session titles, projects and branches', mark: 'partial', cite: ['lody-session-search'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Both connect to agents over the <strong>Agent Client Protocol</strong>. Lody’s CLI is the ACP client; it maintains its own adapters for Claude Code and Codex, forks of the ACP project’s adapters with Lody-specific extensions, and downloads pinned native runtimes. Splash drives each agent natively over ACP or through a pinned adapter for the vendor’s CLI.',
			cite: ['lody-agent-readme', 'lody-acp-claude', 'lody-acp-codex', 'lody-quickstart', 'splash-registry', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'Lody separates clients from the runner: agents run in a CLI daemon on your laptop, a server or cloud VM, and desktop, web, iOS and Android clients reach them through Lody’s hosted sync service. Splash runs agents as child processes of the desktop app, or under <code>splash-server</code> on a machine you open in a browser over an SSH tunnel.',
			cite: ['lody-quickstart', 'lody-open-source-blog', 'lody-download', 'splash-readme', 'splash-server']
		},
		{
			title: 'Teams or one person',
			text: 'Lody is built around a shared workspace: members can continue a teammate’s session, share machines and Agent Roles, and see token usage per member, with collaborative state synced as CRDTs. Splash has no accounts, and <code>splash-server</code> serves a single user.',
			cite: ['lody-home', 'lody-team', 'lody-agent-roles', 'lody-readme', 'splash-build', 'splash-server']
		},
		{
			title: 'Price, accounts and license',
			text: 'Lody’s CLI and desktop app are Apache-2.0, but the official downloads are the hosted build, which needs a Lody account; the open-source build is local-only and must be built from source. The Free plan caps workspaces, sessions and turns; Plus costs $10 per seat a month. Splash is free, MIT-licensed and has no accounts.',
			cite: ['lody-license', 'lody-agents-md', 'lody-contributing', 'lody-quickstart', 'lody-pricing', 'splash-license', 'splash-download', 'splash-build']
		},
		{
			title: 'Around the session',
			text: 'Lody adds tools around each session: setup and cleanup scripts, a preview browser with click-to-comment, PR creation with CI status, scheduled tasks and agents that start other sessions. Splash centers on the conversation: a Needs attention queue, a review screen, full-text search of saved transcripts and a GitHub triage view across repositories.',
			cite: ['lody-worktrees', 'lody-preview', 'lody-github', 'lody-scheduled-tasks', 'lody-session-orchestration', 'splash-features', 'splash-github']
		}
	],
	fit: {
		splash: [
			'You want a free, MIT-licensed app that needs no account.',
			'You want to import past conversations from any agent that lists them over ACP.',
			'You want to search the full text of saved transcripts, archived sessions included.',
			'You want a GitHub triage view of issues, pull requests and Actions runs across repositories.'
		],
		other: [
			'You want teammates to share a workspace and pick up each other’s sessions.',
			'You want to follow and answer agents on your own machines from iOS, Android or a browser.',
			'You want to create and merge GitHub pull requests from a session, with CI status and review threads synced.',
			'You want setup scripts, a preview browser and scheduled tasks around each session.'
		]
	},
	sources: [
		{ id: 'lody-home', title: 'Run your agents in parallel, safely', url: 'https://lody.ai/', publisher: 'LoroHub', checked: '2026-10-10' },
		{ id: 'lody-docs', title: 'Introduction', url: 'https://lody.ai/docs/', publisher: 'LoroHub', checked: '2026-10-10' },
		{ id: 'lody-quickstart', title: 'Quick Start', url: 'https://lody.ai/docs/quickstart/', publisher: 'LoroHub', checked: '2026-10-10' },
		{ id: 'lody-readme', title: 'README.md', url: 'https://github.com/LodyAI/Lody/blob/main/README.md', publisher: 'LodyAI/Lody on GitHub', checked: '2026-10-10' },
		{ id: 'lody-license', title: 'LICENSE', url: 'https://github.com/LodyAI/Lody/blob/main/LICENSE', publisher: 'LodyAI/Lody on GitHub', checked: '2026-10-10' },
		{ id: 'lody-agents-md', title: 'AGENTS.md', url: 'https://github.com/LodyAI/Lody/blob/main/AGENTS.md', publisher: 'LodyAI/Lody on GitHub', checked: '2026-10-10' },
		{ id: 'lody-contributing', title: 'Contributing Guide', url: 'https://github.com/LodyAI/Lody/blob/main/CONTRIBUTING.md', publisher: 'LodyAI/Lody on GitHub', checked: '2026-10-10' },
		{ id: 'lody-agent-readme', title: 'apps/cli/src/agent/README.md', url: 'https://github.com/LodyAI/Lody/blob/main/apps/cli/src/agent/README.md', publisher: 'LodyAI/Lody on GitHub', checked: '2026-10-10' },
		{ id: 'lody-acp-claude', title: 'ACP adapter for the Claude Agent SDK', url: 'https://github.com/LodyAI/acp-extension-claude', publisher: 'LodyAI/acp-extension-claude on GitHub', checked: '2026-10-10' },
		{ id: 'lody-acp-codex', title: 'ACP adapter for Codex CLI', url: 'https://github.com/LodyAI/acp-extension-codex', publisher: 'LodyAI/acp-extension-codex on GitHub', checked: '2026-10-10' },
		{ id: 'lody-blog', title: 'Blog', url: 'https://lody.ai/blog/', publisher: 'LoroHub', checked: '2026-10-10' },
		{ id: 'lody-open-source-blog', title: 'Lody Is Now Open Source', url: 'https://lody.ai/blog/lody-is-now-open-source/', publisher: 'LoroHub', checked: '2026-10-10' },
		{ id: 'lody-changelog', title: 'Changelog', url: 'https://lody.ai/changelog/', publisher: 'LoroHub', checked: '2026-10-10' },
		{ id: 'lody-0-101-0', title: 'Changelog v0.101.0', url: 'https://lody.ai/changelog/20260928/', publisher: 'LoroHub', checked: '2026-10-10' },
		{ id: 'lody-0-94-0', title: 'Changelog v0.94.0', url: 'https://lody.ai/changelog/20260915/', publisher: 'LoroHub', checked: '2026-10-10' },
		{ id: 'lody-0-74-0', title: 'Changelog v0.74.0', url: 'https://lody.ai/changelog/20260731/', publisher: 'LoroHub', checked: '2026-10-10' },
		{ id: 'lody-pricing', title: 'Pricing', url: 'https://lody.ai/price/', publisher: 'LoroHub', checked: '2026-10-10' },
		{ id: 'lody-download', title: 'Download Lody', url: 'https://lody.ai/download/', publisher: 'LoroHub', checked: '2026-10-10' },
		{ id: 'lody-nightly', title: 'Download Lody Nightly', url: 'https://lody.ai/download/nightly/', publisher: 'LoroHub', checked: '2026-10-10' },
		{ id: 'lody-app-store', title: 'Lody - Run Code Agent Anywhere', url: 'https://apps.apple.com/us/app/lody-run-code-agent-anywhere/id6761373528', publisher: 'Apple App Store', checked: '2026-10-10' },
		{ id: 'lody-terminal', title: 'Embedded Terminal', url: 'https://lody.ai/docs/terminal/', publisher: 'LoroHub', checked: '2026-10-10' },
		{ id: 'lody-cli-runtimes', title: 'CLI Runtime Types', url: 'https://lody.ai/docs/cli-runtimes/', publisher: 'LoroHub', checked: '2026-10-10' },
		{ id: 'lody-agents', title: 'Agent Config', url: 'https://lody.ai/docs/agents/', publisher: 'LoroHub', checked: '2026-10-10' },
		{ id: 'lody-agent-roles', title: 'Agent Roles', url: 'https://lody.ai/docs/agent-roles/', publisher: 'LoroHub', checked: '2026-10-10' },
		{ id: 'lody-review', title: 'Lody Review', url: 'https://lody.ai/docs/lody-review/', publisher: 'LoroHub', checked: '2026-10-10' },
		{ id: 'lody-mobile', title: 'Mobile Access', url: 'https://lody.ai/docs/mobile/', publisher: 'LoroHub', checked: '2026-10-10' },
		{ id: 'lody-notifications', title: 'Notifications', url: 'https://lody.ai/docs/notification/', publisher: 'LoroHub', checked: '2026-10-10' },
		{ id: 'lody-session-orchestration', title: 'Agent Session Control', url: 'https://lody.ai/docs/session-orchestration/', publisher: 'LoroHub', checked: '2026-10-10' },
		{ id: 'lody-worktrees', title: 'Worktrees', url: 'https://lody.ai/docs/worktrees/', publisher: 'LoroHub', checked: '2026-10-10' },
		{ id: 'lody-parallel-agents', title: 'Parallel Coding Agents', url: 'https://lody.ai/docs/parallel-agents/', publisher: 'LoroHub', checked: '2026-10-10' },
		{ id: 'lody-preview', title: 'Lody Preview', url: 'https://lody.ai/docs/preview/', publisher: 'LoroHub', checked: '2026-10-10' },
		{ id: 'lody-scheduled-tasks', title: 'Scheduled tasks', url: 'https://lody.ai/docs/scheduled-tasks/', publisher: 'LoroHub', checked: '2026-10-10' },
		{ id: 'lody-team', title: 'Team Features', url: 'https://lody.ai/docs/team/', publisher: 'LoroHub', checked: '2026-10-10' },
		{ id: 'lody-diff-viewer', title: 'Diff Viewer', url: 'https://lody.ai/docs/diff-viewer/', publisher: 'LoroHub', checked: '2026-10-10' },
		{ id: 'lody-diff-comments', title: 'Diff Comments', url: 'https://lody.ai/docs/diff-comments/', publisher: 'LoroHub', checked: '2026-10-10' },
		{ id: 'lody-github', title: 'GitHub Integration', url: 'https://lody.ai/docs/github/', publisher: 'LoroHub', checked: '2026-10-10' },
		{ id: 'lody-workflow', title: 'Recommended Workflow', url: 'https://lody.ai/docs/workflow/', publisher: 'LoroHub', checked: '2026-10-10' },
		{ id: 'lody-local-project', title: 'Local Projects', url: 'https://lody.ai/docs/local-project/', publisher: 'LoroHub', checked: '2026-10-10' },
		{ id: 'lody-session-search', title: 'In-Conversation Search', url: 'https://lody.ai/docs/session-search/', publisher: 'LoroHub', checked: '2026-10-10' }
	]
};
