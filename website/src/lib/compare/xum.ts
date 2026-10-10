// Splash vs Xum. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const XUM: Comparison = {
	slug: 'xum',
	name: 'Xum',
	description: 'How Splash and Xum, formerly Mux, compare on agents, model providers, platforms, pricing, isolation, review and remote use, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Xum, formerly Mux, both run several coding agents at once from a desktop app or a browser. Xum, from Coder, runs its own agent loop against model provider APIs, in your checkout, a worktree, a container or a remote host. Splash drives vendors’ agents, such as Claude Code and Codex, over the Agent Client Protocol.',
	other: {
		name: 'Xum',
		url: 'https://xum.cdr.dev/',
		maker: 'Coder',
		summary: 'Coder’s open-source app for running coding agents in parallel, each in its own workspace, from a desktop app, a browser or a CLI. It runs its own agent loop against many model providers’ APIs.',
		cite: ['xum-docs', 'xum-repo', 'xum-cli', 'xum-providers']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Electron desktop app, plus a CLI, a web UI server, a VS Code extension and an ACP bridge for editors', cite: ['xum-install', 'xum-cli', 'xum-server-access', 'xum-vscode', 'xum-acp'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v0.31.0 (9 October 2026), renamed from Mux; the docs say it is in early development, and the Windows build is alpha', cite: ['xum-release', 'xum-repo', 'xum-gateway', 'xum-install'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (AGPL-3.0)', cite: ['xum-docs', 'xum-license'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free; your model providers bill your usage. The optional Xum Gateway gives eligible GitHub users evaluation credits', cite: ['xum-blog', 'xum-providers', 'xum-gateway'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon and Intel), Linux x64 and arm64 AppImages, Windows x64 (alpha); CLI and server through npm', cite: ['xum-install', 'xum-release'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'TypeScript and React in Electron; the agent reaches models through Vercel AI SDK packages', cite: ['xum-repo', 'xum-package', 'xum-install'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Its own agent loop, with modes and sub-agents defined in Markdown; it doesn’t host Claude Code, Codex or other CLI agents', cite: ['xum-repo', 'xum-agents', 'xum-acp'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Calls model APIs through Vercel AI SDK adapters, not a vendor CLI; bash and file tools run in the chosen runtime', cite: ['xum-providers', 'xum-package', 'xum-repo', 'xum-ssh'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'API keys, a ChatGPT plan (Codex OAuth), GitHub Copilot, Xum Gateway credits or Coder’s AI Gateway; Claude plan login isn’t documented', cite: ['xum-providers', 'xum-codex-oauth', 'xum-0-16-1', 'xum-copilot-oauth', 'xum-gateway'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'No Xum account; Xum Gateway sign-in with GitHub is optional, and xum server takes a bearer token or a GitHub login limited to one account', cite: ['xum-gateway', 'xum-server-access'] } },
				{ label: 'Model and mode pickers', splash: S.models, other: { text: 'Models from a dozen built-in providers, such as Anthropic, OpenAI, Google, Ollama and Bedrock, or custom endpoints; Plan and Exec modes', mark: 'yes', cite: ['xum-providers', 'xum-repo', 'xum-agents'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'No per-command prompts documented; Plan mode asks multiple-choice questions and awaits plan approval, and experimental hooks can block commands', mark: 'partial', cite: ['xum-plan-mode', 'xum-tool-hooks'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Set globally in ~/.xum/mcp.jsonc with per-repo overrides, one instance per workspace; git-installed plugins add skills and MCP servers', mark: 'yes', cite: ['xum-mcp'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Per workspace: the local checkout (no isolation), a git worktree, SSH host, Docker or Podman container, dev container or Coder workspace', mark: 'yes', cite: ['xum-runtimes', 'xum-local', 'xum-worktree', 'xum-docker', 'xum-coder-runtime'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Runs .xum/init in each new workspace, plus archive and delete hooks; .xumignore copies files like .env. No dev-server handling documented', mark: 'yes', cite: ['xum-init-hooks', 'xum-lifecycle-hooks', 'xum-xumignore', 'xum-workspaces'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Sidebar status per agent, written by a small model at set intervals, plus a marker when a model finishes', mark: 'yes', cite: ['xum-repo', 'xum-0-25-0', 'xum-why-parallelize'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'Native OS notifications for every response once you turn that on, or when the agent calls its notify tool; clicking one opens its workspace', mark: 'yes', cite: ['xum-notifications'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Agents start sub-agents; Best of N runs several on the same task and combines their results', mark: 'yes', cite: ['xum-agents', 'xum-best-of-n'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Heartbeats prompt a workspace’s agent every 5 minutes to 24 hours, after idle time or on a fixed cadence; xum run starts tasks from scripts and CI', mark: 'yes', cite: ['xum-tool-hooks', 'xum-release', 'xum-cli', 'xum-github-actions'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Diff review pane and Immersive Review mode; the agent flags hunks to check, and line notes attach to the chat input', mark: 'yes', cite: ['xum-repo', 'xum-0-22-0', 'xum-0-25-0', 'xum-0-12-1', 'xum-review-types', 'xum-use-reviews'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'The agent opens a PR when you ask and it has push credentials; no create-PR or merge button is documented', mark: 'partial', cite: ['xum-workspaces'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Finds each workspace’s PR through the gh CLI and shows its state, merge queue and CI checks, with a gh-stack dropdown for stacked PRs', mark: 'yes', cite: ['xum-pr-status', 'xum-links', 'xum-0-28-2', 'xum-0-13-0'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'xum server opens the web UI to other devices; the desktop app connects to remote servers; workspaces can run over SSH', mark: 'yes', cite: ['xum-server-access', 'xum-0-28-5', 'xum-ssh'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'No native app is documented; xum server’s web UI has a responsive layout for phones', mark: 'partial', cite: ['xum-repo', 'xum-server-access'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented; Xum’s own chats persist, their streams resume after restarts, and ACP editors can load them', mark: 'unknown', cite: ['xum-why-parallelize', 'xum-acp-agent'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Not documented; the command palette’s default mode is a workspace switcher', mark: 'unknown', cite: ['xum-keybinds'] } },
				{ label: 'Fork a conversation', splash: S.fork, other: { text: '/fork opens a new workspace and branch from HEAD with the chat history, model and mode; uncommitted changes aren’t copied', mark: 'yes', cite: ['xum-fork'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Xum runs its own agent loop, calling model APIs through Vercel AI SDK adapters, and does not host Claude Code, Codex or other external agents. It implements ACP as an agent, so editors such as Zed can start <code>xum acp</code>. Splash starts each vendor’s agent and speaks the <strong>Agent Client Protocol</strong> with it, natively or through an adapter.',
			cite: ['xum-repo', 'xum-providers', 'xum-package', 'xum-acp', 'xum-acp-agent', 'splash-registry', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'Each Xum workspace picks a runtime: your checkout, a git worktree, a Docker or Podman container, a dev container, an SSH host or a Coder workspace. <code>xum server</code> serves the web UI to browsers and phones. Splash runs agents on your computer, in the project folder or a worktree, or under <code>splash-server</code> on a machine you reach over SSH.',
			cite: ['xum-runtimes', 'xum-docker', 'xum-ssh', 'xum-coder-runtime', 'xum-server-access', 'xum-repo', 'splash-features', 'splash-server']
		},
		{
			title: 'Price, accounts and license',
			text: 'Xum is free, AGPL-3.0-licensed and needs no Xum account. Models run on your own API keys, a ChatGPT plan or GitHub Copilot login, or Xum Gateway evaluation credits; the Coder provider uses the AI Gateway of your Coder deployment, which comes with a Coder Premium license. Splash is free and MIT-licensed, has no accounts, and runs each agent on that agent’s own login.',
			cite: ['xum-blog', 'xum-license', 'xum-gateway', 'xum-providers', 'xum-codex-oauth', 'xum-copilot-oauth', 'xum-coder-ai-gateway', 'splash-license', 'splash-download', 'splash-build', 'splash-agents']
		},
		{
			title: 'Around the session',
			text: 'Xum builds tools around its agent: setup and cleanup hooks, sub-agents and Best of N, <code>/fork</code>, MCP servers and plugins, scheduled heartbeats, a <code>xum run</code> CLI for CI, and computer use in local workspaces on macOS and Linux X11. Splash centers on the conversations: a <strong>Needs attention</strong> queue, transcript search, importing sessions started elsewhere and a GitHub view across repositories.',
			cite: ['xum-init-hooks', 'xum-lifecycle-hooks', 'xum-best-of-n', 'xum-fork', 'xum-mcp', 'xum-tool-hooks', 'xum-release', 'xum-cli', 'xum-github-actions', 'xum-computer-use', 'splash-features', 'splash-history', 'splash-github']
		}
	],
	fit: {
		splash: [
			'You want Claude Code, Codex, Gemini CLI and other vendors’ agents side by side, each on its own CLI login.',
			'You want each permission request shown in the transcript and pending ones gathered in one Needs attention queue.',
			'You want to import conversations your agents started outside the app and search them with the rest.',
			'You want a GitHub view of issues, pull requests and Actions runs across your repositories.'
		],
		other: [
			'You want one agent that works with a dozen model providers, Ollama or custom endpoints, on your own API keys.',
			'You want workspaces in worktrees, containers, dev containers, SSH hosts or Coder workspaces, with an init script for each.',
			'You want sub-agents, Best of N runs and forks of a workspace with its chat history.',
			'You want a CLI for CI jobs such as GitHub Actions, and the same UI in a browser or on a phone.'
		]
	},
	sources: [
		{ id: 'xum-docs', title: 'Introduction', url: 'https://xum.cdr.dev/', publisher: 'Coder', checked: '2026-10-10' },
		{ id: 'xum-repo', title: 'coder/xum', url: 'https://github.com/coder/xum', publisher: 'coder/xum on GitHub', checked: '2026-10-10' },
		{ id: 'xum-install', title: 'Install', url: 'https://xum.cdr.dev/install', publisher: 'Coder', checked: '2026-10-10' },
		{ id: 'xum-package', title: 'package.json', url: 'https://github.com/coder/xum/blob/main/package.json', publisher: 'coder/xum on GitHub', checked: '2026-10-10' },
		{ id: 'xum-license', title: 'LICENSE', url: 'https://github.com/coder/xum/blob/main/LICENSE', publisher: 'coder/xum on GitHub', checked: '2026-10-10' },
		{ id: 'xum-blog', title: 'Picks, Shovels, IDEs, and Mux', url: 'https://coder.com/blog/running-parallel-self-hosted-coding-agents', publisher: 'Coder', checked: '2026-10-10' },
		{ id: 'xum-cli', title: 'CLI', url: 'https://xum.cdr.dev/reference/cli', publisher: 'Coder', checked: '2026-10-10' },
		{ id: 'xum-server-access', title: 'Server Access', url: 'https://xum.cdr.dev/config/server-access', publisher: 'Coder', checked: '2026-10-10' },
		{ id: 'xum-vscode', title: 'VS Code Extension', url: 'https://xum.cdr.dev/integrations/vscode-extension', publisher: 'Coder', checked: '2026-10-10' },
		{ id: 'xum-acp', title: 'ACP (Editor Integrations)', url: 'https://xum.cdr.dev/integrations/acp', publisher: 'Coder', checked: '2026-10-10' },
		{ id: 'xum-acp-agent', title: 'src/node/acp/agent.ts', url: 'https://github.com/coder/xum/blob/main/src/node/acp/agent.ts', publisher: 'coder/xum on GitHub', checked: '2026-10-10' },
		{ id: 'xum-gateway', title: 'Xum Gateway', url: 'https://xum.cdr.dev/getting-started/mux-gateway', publisher: 'Coder', checked: '2026-10-10' },
		{ id: 'xum-providers', title: 'Providers', url: 'https://xum.cdr.dev/config/providers', publisher: 'Coder', checked: '2026-10-10' },
		{ id: 'xum-codex-oauth', title: 'src/common/constants/codexOAuth.ts', url: 'https://github.com/coder/xum/blob/main/src/common/constants/codexOAuth.ts', publisher: 'coder/xum on GitHub', checked: '2026-10-10' },
		{ id: 'xum-copilot-oauth', title: 'src/node/services/copilotOauthService.ts', url: 'https://github.com/coder/xum/blob/main/src/node/services/copilotOauthService.ts', publisher: 'coder/xum on GitHub', checked: '2026-10-10' },
		{ id: 'xum-coder-ai-gateway', title: 'AI Gateway client configuration: Xum', url: 'https://coder.com/docs/ai-coder/ai-gateway/clients/xum', publisher: 'Coder', checked: '2026-10-10' },
		{ id: 'xum-agents', title: 'Agents', url: 'https://xum.cdr.dev/agents', publisher: 'Coder', checked: '2026-10-10' },
		{ id: 'xum-plan-mode', title: 'Plan Mode', url: 'https://xum.cdr.dev/agents/plan-mode', publisher: 'Coder', checked: '2026-10-10' },
		{ id: 'xum-best-of-n', title: 'Best of N', url: 'https://xum.cdr.dev/agents/best-of-n', publisher: 'Coder', checked: '2026-10-10' },
		{ id: 'xum-computer-use', title: 'Computer Use', url: 'https://xum.cdr.dev/agents/computer-use', publisher: 'Coder', checked: '2026-10-10' },
		{ id: 'xum-tool-hooks', title: 'Tool Hooks', url: 'https://xum.cdr.dev/hooks/tools', publisher: 'Coder', checked: '2026-10-10' },
		{ id: 'xum-init-hooks', title: 'Init Hooks', url: 'https://xum.cdr.dev/hooks/init', publisher: 'Coder', checked: '2026-10-10' },
		{ id: 'xum-lifecycle-hooks', title: 'Archive and Delete Hooks', url: 'https://xum.cdr.dev/hooks/lifecycle', publisher: 'Coder', checked: '2026-10-10' },
		{ id: 'xum-mcp', title: 'MCP Servers', url: 'https://xum.cdr.dev/config/mcp-servers', publisher: 'Coder', checked: '2026-10-10' },
		{ id: 'xum-notifications', title: 'Notifications', url: 'https://xum.cdr.dev/config/notifications', publisher: 'Coder', checked: '2026-10-10' },
		{ id: 'xum-keybinds', title: 'Keyboard Shortcuts', url: 'https://xum.cdr.dev/config/keybinds', publisher: 'Coder', checked: '2026-10-10' },
		{ id: 'xum-runtimes', title: 'Runtimes', url: 'https://xum.cdr.dev/runtime', publisher: 'Coder', checked: '2026-10-10' },
		{ id: 'xum-local', title: 'Local Runtime', url: 'https://xum.cdr.dev/runtime/local', publisher: 'Coder', checked: '2026-10-10' },
		{ id: 'xum-worktree', title: 'Worktree Runtime', url: 'https://xum.cdr.dev/runtime/worktree', publisher: 'Coder', checked: '2026-10-10' },
		{ id: 'xum-coder-runtime', title: 'Coder Runtime', url: 'https://xum.cdr.dev/runtime/coder', publisher: 'Coder', checked: '2026-10-10' },
		{ id: 'xum-docker', title: 'Docker Runtime', url: 'https://xum.cdr.dev/runtime/docker', publisher: 'Coder', checked: '2026-10-10' },
		{ id: 'xum-ssh', title: 'SSH Runtime', url: 'https://xum.cdr.dev/runtime/ssh', publisher: 'Coder', checked: '2026-10-10' },
		{ id: 'xum-workspaces', title: 'Workspaces', url: 'https://xum.cdr.dev/workspaces', publisher: 'Coder', checked: '2026-10-10' },
		{ id: 'xum-xumignore', title: '.xumignore', url: 'https://xum.cdr.dev/workspaces/xumignore', publisher: 'Coder', checked: '2026-10-10' },
		{ id: 'xum-fork', title: 'Forking Workspaces', url: 'https://xum.cdr.dev/workspaces/fork', publisher: 'Coder', checked: '2026-10-10' },
		{ id: 'xum-why-parallelize', title: 'Why Parallelize?', url: 'https://xum.cdr.dev/getting-started/why-parallelize', publisher: 'Coder', checked: '2026-10-10' },
		{ id: 'xum-github-actions', title: 'GitHub Actions', url: 'https://xum.cdr.dev/guides/github-actions', publisher: 'Coder', checked: '2026-10-10' },
		{ id: 'xum-review-types', title: 'src/common/types/review.ts', url: 'https://github.com/coder/xum/blob/main/src/common/types/review.ts', publisher: 'coder/xum on GitHub', checked: '2026-10-10' },
		{ id: 'xum-use-reviews', title: 'src/browser/hooks/useReviews.ts', url: 'https://github.com/coder/xum/blob/main/src/browser/hooks/useReviews.ts', publisher: 'coder/xum on GitHub', checked: '2026-10-10' },
		{ id: 'xum-pr-status', title: 'src/browser/stores/PRStatusStore.ts', url: 'https://github.com/coder/xum/blob/main/src/browser/stores/PRStatusStore.ts', publisher: 'coder/xum on GitHub', checked: '2026-10-10' },
		{ id: 'xum-links', title: 'src/common/types/links.ts', url: 'https://github.com/coder/xum/blob/main/src/common/types/links.ts', publisher: 'coder/xum on GitHub', checked: '2026-10-10' },
		{ id: 'xum-release', title: 'Release v0.31.0', url: 'https://github.com/coder/xum/releases/tag/v0.31.0', publisher: 'coder/xum on GitHub', checked: '2026-10-10' },
		{ id: 'xum-0-28-5', title: 'Release v0.28.5', url: 'https://github.com/coder/xum/releases/tag/v0.28.5', publisher: 'coder/xum on GitHub', checked: '2026-10-10' },
		{ id: 'xum-0-28-2', title: 'Release v0.28.2', url: 'https://github.com/coder/xum/releases/tag/v0.28.2', publisher: 'coder/xum on GitHub', checked: '2026-10-10' },
		{ id: 'xum-0-25-0', title: 'Release v0.25.0', url: 'https://github.com/coder/xum/releases/tag/v0.25.0', publisher: 'coder/xum on GitHub', checked: '2026-10-10' },
		{ id: 'xum-0-22-0', title: 'Release v0.22.0', url: 'https://github.com/coder/xum/releases/tag/v0.22.0', publisher: 'coder/xum on GitHub', checked: '2026-10-10' },
		{ id: 'xum-0-16-1', title: 'Release v0.16.1', url: 'https://github.com/coder/xum/releases/tag/v0.16.1', publisher: 'coder/xum on GitHub', checked: '2026-10-10' },
		{ id: 'xum-0-13-0', title: 'Release v0.13.0', url: 'https://github.com/coder/xum/releases/tag/v0.13.0', publisher: 'coder/xum on GitHub', checked: '2026-10-10' },
		{ id: 'xum-0-12-1', title: 'Release v0.12.1', url: 'https://github.com/coder/xum/releases/tag/v0.12.1', publisher: 'coder/xum on GitHub', checked: '2026-10-10' }
	]
};
