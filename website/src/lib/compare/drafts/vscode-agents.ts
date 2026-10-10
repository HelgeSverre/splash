// Splash vs VS Code Agents window. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const VSCODE_AGENTS: Comparison = {
	slug: 'vscode-agents',
	name: 'VS Code Agents window',
	description: 'How Splash and the VS Code Agents window compare on agents, pricing, worktrees, review, pull requests and remote use, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and the VS Code Agents window both run several coding agent sessions at once, each in a project folder or a git worktree. The Agents window is part of Visual Studio Code and runs Copilot, Claude and Codex harnesses through its Agent Host; Splash is a standalone desktop app that drives agents over the Agent Client Protocol.',
	other: {
		name: 'VS Code Agents window',
		url: 'https://code.visualstudio.com/docs/agents/run/agents-window',
		maker: 'Microsoft',
		summary: 'A separate window of Visual Studio Code for handing work to Copilot, Claude and Codex agents across projects and reviewing the results, with worktree isolation, pull request creation and remote or cloud sessions.',
		cite: ['vscode-agents-window', 'vscode-agents-harnesses']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'A separate window of desktop VS Code for assigning agent work across projects and reviewing results; also a browser client', cite: ['vscode-agents-window', 'vscode-agents-host'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'Stable since VS Code 1.120 (13 May 2026), now at 1.141 (7 October 2026); several features remain preview or experimental', cite: ['vscode-agents-1-120', 'vscode-agents-1-141', 'vscode-agents-window', 'vscode-agents-approvals'] } },
				{ label: 'License', splash: S.license, other: { text: 'VS Code ships under a Microsoft product license; its Code - OSS source is MIT. Copilot’s backend services are closed source', cite: ['vscode-agents-faq', 'vscode-agents-license'] } },
				{ label: 'Price', splash: S.price, other: { text: 'VS Code is free. Copilot: Free, Pro $10, Pro+ $39, Max $100 a month; Business $19, Enterprise $39 per user a month', cite: ['vscode-agents-faq', 'vscode-agents-plans'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'Windows 10/11 (x64, Arm64), macOS 12+ (Intel, Apple silicon), Linux (x64, Arm32, Arm64); a browser client at insiders.vscode.dev/agents', cite: ['vscode-agents-download', 'vscode-agents-window'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Electron, as part of VS Code', cite: ['vscode-agents-faq'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Copilot and Claude harnesses, experimental Codex on the Agent Host, and a Cloud target; no way to add other agents is documented', cite: ['vscode-agents-harnesses', 'vscode-agents-harness-concepts', 'vscode-agents-window'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Adapters in an Agent Host process: Copilot SDK, Claude Agent SDK and a codex app-server child process; clients connect over AHP', cite: ['vscode-agents-host', 'vscode-agents-harness-concepts', 'vscode-agents-harnesses', 'vscode-agents-codex-agent'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'A Copilot plan (Codex needs Pro+), your own key for Claude or BYOK models, or a ChatGPT account for Codex', cite: ['vscode-agents-harnesses', 'vscode-agents-config'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'GitHub sign-in by default, always in the browser; an experimental desktop setting lets Claude, BYOK models and Codex on ChatGPT skip it', cite: ['vscode-agents-window', 'vscode-agents-config'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Approve each call once, or per session, per workspace or permanently; worktree sessions use Allow all, which skips prompts', mark: 'yes', cite: ['vscode-agents-approvals', 'vscode-agents-harnesses'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'The Agent Host reads .mcp.json and ~/.copilot/mcp-config.json; VS Code forwards its own servers except ones needing interactive input', mark: 'yes', cite: ['vscode-agents-host'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'New Worktree from a base branch you pick, or Folder in place; experimental Dev Container sessions and opt-in sandboxing for Copilot', mark: 'yes', cite: ['vscode-agents-harnesses', 'vscode-agents-window', 'vscode-agents-sandboxing'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Setup and dev-server scripts aren’t documented; tasks run in each session’s worktree or folder, and a setting copies ignored files into worktrees', mark: 'partial', cite: ['vscode-agents-window', 'vscode-agents-harnesses'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'The session list shows status and change counts; a preview app badge, off by default in Stable, counts sessions that need you', mark: 'yes', cite: ['vscode-agents-window', 'vscode-agents-sessions'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'An integrated browser for checking web apps, with tabs isolated per session; localhost links from chat or a terminal open there', mark: 'yes', cite: ['vscode-agents-window', 'vscode-agents-browser-tools'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Agents in Agent Host sessions can list, create and message other sessions, each message needing your confirmation; remote delegation is experimental', mark: 'yes', cite: ['vscode-agents-sessions', 'vscode-agents-remote'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Automations (preview, off by default in Stable) run a saved prompt on demand or on an hourly, daily or weekly schedule', mark: 'partial', cite: ['vscode-agents-automations'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'A Changes view by branch, uncommitted work or last turn; range comments go to the agent, which edits and resolves them', mark: 'yes', cite: ['vscode-agents-window', 'vscode-agents-review'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Create PR commits, pushes and opens a PR, draft or not; then merge by hand, auto-merge or experimental agent merge', mark: 'yes', cite: ['vscode-agents-window'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Start a session from a PR (not from forks), attach issues or PRs as context, and post review comments to GitHub (experimental)', mark: 'yes', cite: ['vscode-agents-window', 'vscode-agents-review'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'A Cloud target runs Copilot, or Claude and Codex in preview, on remote infrastructure against a GitHub repo and returns a PR', mark: 'yes', cite: ['vscode-agents-harnesses', 'vscode-agents-window'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'Connects to agent hosts over SSH, dev tunnels or WSL using AHP; a browser client reaches your machine through a dev tunnel', mark: 'yes', cite: ['vscode-agents-remote', 'vscode-agents-host'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'No native app is documented; the browser client works on any device, and /remote on lets GitHub Mobile steer Copilot sessions', mark: 'partial', cite: ['vscode-agents-remote', 'vscode-agents-harnesses'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Opens and continues local sessions from Claude Code, Codex, Copilot CLI and the GitHub Copilot app; a filter hides them by default', mark: 'yes', cite: ['vscode-agents-sessions', 'vscode-agents-1-141'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: '/chronicle:search looks up past Copilot sessions by keyword, PR or issue reference, or file path, from a local SQLite store', mark: 'partial', cite: ['vscode-agents-history'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'VS Code runs its Copilot, Claude and Codex adapters inside an <strong>Agent Host</strong> process, built on the Copilot SDK, the Claude Agent SDK and a <code>codex app-server</code> child process. Clients reach the host over the Agent Host Protocol, an open, MIT-licensed spec. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, natively or through an adapter.',
			cite: ['vscode-agents-host', 'vscode-agents-harness-concepts', 'vscode-agents-harnesses', 'vscode-agents-codex-agent', 'vscode-agents-ahp', 'splash-registry', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'Agents window sessions run in a local Agent Host, on SSH, tunnel or WSL hosts, in experimental Dev Containers, or on a Cloud target that returns a GitHub pull request. A turn keeps going with no client attached while the host runs. Splash runs agents on your computer, or under <code>splash-server</code> on a machine you reach over SSH.',
			cite: ['vscode-agents-host', 'vscode-agents-remote', 'vscode-agents-window', 'vscode-agents-harnesses', 'splash-readme', 'splash-server']
		},
		{
			title: 'Price, accounts and license',
			text: 'VS Code is free and ships under a Microsoft product license, built from MIT-licensed source. Agent use draws on GitHub Copilot plans, from Free to Max at $100 a month, or on your own keys or a ChatGPT account, with GitHub sign-in by default. Splash is free, MIT-licensed and has no accounts; each agent uses its own CLI login.',
			cite: ['vscode-agents-faq', 'vscode-agents-plans', 'vscode-agents-harnesses', 'vscode-agents-window', 'splash-license', 'splash-download', 'splash-build', 'splash-agents']
		},
		{
			title: 'Around the session',
			text: 'The Agents window covers the path from task to merged pull request: worktree sessions, a Changes view whose comments the agent resolves, PR creation with auto-merge or experimental agent merge, an integrated browser and preview Automations. Splash centers on conversations: a Needs attention queue, a review screen, transcript search, importing history over ACP and a GitHub view across repositories.',
			cite: ['vscode-agents-window', 'vscode-agents-review', 'vscode-agents-automations', 'splash-features', 'splash-history', 'splash-github']
		},
		{
			title: 'Permissions and isolation',
			text: 'Agents window worktree sessions always use Allow all, and the docs note a worktree is not a security boundary. Opt-in sandboxing (preview, experimental on Windows) restricts Copilot sessions’ commands, and experimental Assisted permissions has an LLM judge each call. Splash shows each permission request in the transcript, answered with the 1–9 keys, and keeps pending ones in <strong>Needs attention</strong>.',
			cite: ['vscode-agents-harnesses', 'vscode-agents-harness-concepts', 'vscode-agents-sandboxing', 'vscode-agents-approvals', 'splash-features']
		}
	],
	fit: {
		splash: [
			'You want a free, MIT-licensed app with no account, where each agent runs with its own CLI login.',
			'You want Gemini, OpenCode, Goose and other agents in the same app as Claude, Codex and Copilot, over the Agent Client Protocol.',
			'You want permission requests from every session answered in the transcript and gathered in one Needs attention queue.',
			'You want to search the saved transcripts of every session, whichever agent ran it.'
		],
		other: [
			'You use VS Code and a GitHub Copilot plan and want agent sessions in a window beside your editor.',
			'You want to go from a session to a merged pull request, with auto-merge or an experimental agent merge that handles review threads and failing checks.',
			'You want sessions on SSH, tunnel or WSL hosts or on a Cloud target, and a browser client for any device.',
			'You want scheduled automations, an integrated browser and agents that start and message other sessions.'
		]
	},
	sources: [
		{ id: 'vscode-agents-window', title: 'Use the Agents window', url: 'https://code.visualstudio.com/docs/agents/run/agents-window', publisher: 'Microsoft', checked: '2026-10-10' },
		{ id: 'vscode-agents-config', title: 'Configure the Agents Window', url: 'https://code.visualstudio.com/docs/agents/run/agents-window-configuration', publisher: 'Microsoft', checked: '2026-10-10' },
		{ id: 'vscode-agents-host', title: 'Agent Host Architecture', url: 'https://code.visualstudio.com/docs/agents/concepts/agent-host', publisher: 'Microsoft', checked: '2026-10-10' },
		{ id: 'vscode-agents-harness-concepts', title: 'Agent Harnesses', url: 'https://code.visualstudio.com/docs/agents/concepts/agent-harnesses', publisher: 'Microsoft', checked: '2026-10-10' },
		{ id: 'vscode-agents-harnesses', title: 'Choose an Agent Harness', url: 'https://code.visualstudio.com/docs/agents/run/agent-harnesses', publisher: 'Microsoft', checked: '2026-10-10' },
		{ id: 'vscode-agents-approvals', title: 'Approvals & Permissions', url: 'https://code.visualstudio.com/docs/agents/run/approvals', publisher: 'Microsoft', checked: '2026-10-10' },
		{ id: 'vscode-agents-sandboxing', title: 'Agent Sandboxing', url: 'https://code.visualstudio.com/docs/agents/run/agent-sandboxing', publisher: 'Microsoft', checked: '2026-10-10' },
		{ id: 'vscode-agents-sessions', title: 'Manage Sessions', url: 'https://code.visualstudio.com/docs/agents/run/sessions/manage-sessions', publisher: 'Microsoft', checked: '2026-10-10' },
		{ id: 'vscode-agents-history', title: 'Session History', url: 'https://code.visualstudio.com/docs/agents/run/sessions/session-history', publisher: 'Microsoft', checked: '2026-10-10' },
		{ id: 'vscode-agents-review', title: 'Review & Revert Changes', url: 'https://code.visualstudio.com/docs/agents/run/review-code-edits', publisher: 'Microsoft', checked: '2026-10-10' },
		{ id: 'vscode-agents-remote', title: 'Remote Agent Sessions', url: 'https://code.visualstudio.com/docs/agents/run/remote-agent-sessions', publisher: 'Microsoft', checked: '2026-10-10' },
		{ id: 'vscode-agents-automations', title: 'Automations', url: 'https://code.visualstudio.com/docs/agents/run/automations', publisher: 'Microsoft', checked: '2026-10-10' },
		{ id: 'vscode-agents-browser-tools', title: 'Browser tools', url: 'https://code.visualstudio.com/docs/agents/run/browser-tools', publisher: 'Microsoft', checked: '2026-10-10' },
		{ id: 'vscode-agents-faq', title: 'Visual Studio Code FAQ', url: 'https://code.visualstudio.com/docs/supporting/faq', publisher: 'Microsoft', checked: '2026-10-10' },
		{ id: 'vscode-agents-download', title: 'Download Visual Studio Code', url: 'https://code.visualstudio.com/Download', publisher: 'Microsoft', checked: '2026-10-10' },
		{ id: 'vscode-agents-plans', title: 'GitHub Copilot · Plans & pricing', url: 'https://github.com/features/copilot/plans', publisher: 'GitHub', checked: '2026-10-10' },
		{ id: 'vscode-agents-1-120', title: 'Visual Studio Code 1.120', url: 'https://code.visualstudio.com/updates/v1_120', publisher: 'Microsoft', checked: '2026-10-10' },
		{ id: 'vscode-agents-1-141', title: 'Visual Studio Code 1.141', url: 'https://code.visualstudio.com/updates/v1_141', publisher: 'Microsoft', checked: '2026-10-10' },
		{ id: 'vscode-agents-license', title: 'LICENSE.txt', url: 'https://github.com/microsoft/vscode/blob/main/LICENSE.txt', publisher: 'microsoft/vscode on GitHub', checked: '2026-10-10' },
		{ id: 'vscode-agents-codex-agent', title: 'src/vs/platform/agentHost/node/codex/codexAgent.ts', url: 'https://github.com/microsoft/vscode/blob/main/src/vs/platform/agentHost/node/codex/codexAgent.ts', publisher: 'microsoft/vscode on GitHub', checked: '2026-10-10' },
		{ id: 'vscode-agents-ahp', title: 'Agent Host Protocol', url: 'https://microsoft.github.io/agent-host-protocol/', publisher: 'Microsoft', checked: '2026-10-10' }
	]
};
