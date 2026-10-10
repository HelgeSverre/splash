// Splash vs Routa. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const ROUTA: Comparison = {
	slug: 'routa',
	name: 'Routa',
	description: 'How Splash and Routa compare on agents, platforms, licensing, worktrees, review and pull requests, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Routa are open-source apps for running several coding agents; both use the Agent Client Protocol to talk to agent CLIs. Routa organizes work in workspaces: Kanban lanes each run a specialist agent, and in Team mode a lead agent dispatches others. Splash runs one agent per session, in the project folder or a git worktree.',
	other: {
		name: 'Routa',
		url: 'https://phodal.github.io/routa/',
		maker: 'Fengda Huang',
		summary: 'A workspace-first platform for coordinating several coding agents, shipped as a Tauri desktop app, a CLI and a self-hosted web app. Specialist agents move Kanban cards from backlog through review to a pull request.',
		cite: ['routa-home', 'routa-readme', 'routa-platforms', 'routa-pr-publisher']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'A Tauri desktop app (Routa Desktop), a CLI, and a web app you run from source, all sharing one product model', cite: ['routa-platforms', 'routa-web', 'routa-readme', 'routa-tauri-conf'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'Routa Desktop v0.19.0 (22 June 2026); commits continued to 13 August 2026. CLI: 0.18.1 on npm, 0.16.0 on crates.io', cite: ['routa-release', 'routa-commits', 'routa-npm', 'routa-crates'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (MIT); the copyright holder is Routa Community', cite: ['routa-license', 'routa-readme'] } },
				{ label: 'Price', splash: S.price, other: { text: 'No price or paid plan is documented; the app comes from GitHub Releases, the CLI from npm and crates.io', cite: ['routa-quick-start', 'routa-deployment'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon and Intel), Windows x64 and Linux x64 (AppImage, .deb); the CLI also installs through npm or cargo', cite: ['routa-release', 'routa-release-guide', 'routa-quick-start'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code, Codex, OpenCode, Gemini, Copilot, Auggie, Kimi, Kiro and Qoder presets, plus ACP Registry and custom ACP agents', cite: ['routa-providers', 'routa-acp-presets', 'routa-custom-providers'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'ACP for most CLIs, Claude Code via its stream-json print mode, and HTTP for API providers like OpenAI and DeepSeek', cite: ['routa-adr-acp', 'routa-acp-presets', 'routa-claude-process', 'routa-api-providers'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Local agent CLIs, keys entered in the app, or environment variables such as OPENAI_API_KEY; reuse of CLI logins isn’t documented', cite: ['routa-env', 'routa-providers', 'routa-acp-presets'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'None documented; first run is creating a workspace, enabling a provider and attaching a repository', cite: ['routa-quick-start'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'ACP requests show as chat cards with the agent’s allow and reject options; Claude Code and Copilot auto-approve by default', mark: 'partial', cite: ['routa-permission-issue', 'routa-claude-process', 'routa-acp-presets'] } },
				{ label: 'Model and mode pickers', splash: S.models, other: { text: 'A default provider and model for each role, such as coordinator, implementer and verifier; saved aliases add custom endpoints and keys', mark: 'yes', cite: ['routa-providers'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Add MCP tools and your own MCP servers; Routa also injects its own MCP server into sessions such as Codex', mark: 'yes', cite: ['routa-readme', 'routa-v0-14-0'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Git worktrees per codebase, and one per Kanban card on an issue/ branch when it enters Dev; Docker sandboxes too', mark: 'yes', cite: ['routa-architecture', 'routa-feature-tree', 'routa-tasks-automation', 'routa-acp-presets'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'Terminals an agent opens run a real shell, shown inline in the chat and typeable there; no standalone terminal is documented', mark: 'partial', cite: ['routa-terminal-manager', 'routa-terminal-issue'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'The board marks running and queued cards; a separate Harness Monitor terminal UI follows agent runs and changed files', mark: 'partial', cite: ['routa-execution-modes', 'routa-harness-monitor'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'An in-app bell with an unread count and a Messages history page; desktop notifications aren’t documented', mark: 'partial', cite: ['routa-notification-center', 'routa-feature-tree'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Team mode’s lead agent plans, dispatches child sessions in waves and verifies them; Kanban lanes pass cards between specialists', mark: 'yes', cite: ['routa-team', 'routa-readme'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Schedules, GitHub webhooks, background tasks and YAML workflows can start agent runs without a prompt', mark: 'yes', cite: ['routa-readme', 'routa-webhook-panel'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'A Review Guard agent checks every acceptance criterion and sends failing cards back to Dev; findings, severity and traces are shown', mark: 'yes', cite: ['routa-readme'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'Each task’s changed files with per-file and per-commit diffs; the Kanban view can stage, commit, pull, rebase and reset', mark: 'yes', cite: ['routa-feature-tree', 'routa-v0-19-0'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'A PR Publisher agent commits, pushes and opens a GitHub PR or GitLab MR; Done needs a clean, PR-ready branch', mark: 'yes', cite: ['routa-pr-publisher', 'routa-execution-modes'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Imports repos as workspaces, browses issues, PRs and comments, posts PR comments; webhooks trigger agents. Merging and CI status aren’t documented', mark: 'yes', cite: ['routa-readme', 'routa-feature-tree', 'routa-webhook-panel'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'GitHub issues import as Kanban tasks, tasks can open issues and closed issues sync back; Linear and Jira aren’t documented', mark: 'partial', cite: ['routa-task-handlers', 'routa-v0-19-0', 'routa-gh-120'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Self-host the Next.js web app, backed by a local or remote runtime; the docs call that guide incomplete. SSH isn’t documented', mark: 'partial', cite: ['routa-self-hosting', 'routa-web'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Reads local Codex, Claude Code, Qoder and Augment transcripts for analysis; opening them as Routa sessions isn’t documented', mark: 'partial', cite: ['routa-transcript-discovery', 'routa-v0-17-0'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Not documented; each workspace has a session index for browsing and filtering', mark: 'unknown', cite: ['routa-feature-tree'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Routa runs most agent CLIs over ACP (<code>opencode acp</code>, <code>codex-acp</code>, <code>copilot --acp</code> and others), runs Claude Code in its stream-json print mode and translates the output into ACP-style updates, and calls OpenAI, Anthropic, Gemini, DeepSeek and other APIs over HTTP. Splash speaks the <strong>Agent Client Protocol</strong> over stdio with every agent, natively or through a pinned adapter.',
			cite: ['routa-adr-acp', 'routa-acp-presets', 'routa-claude-process', 'routa-api-providers', 'splash-registry', 'acp']
		},
		{
			title: 'A board of specialists or one agent per session',
			text: 'Each of Routa’s Kanban lanes runs its own specialist prompt, from Backlog Refiner to Done Reporter. A card gets a worktree when it enters Dev, a <strong>Review Guard</strong> checks it against its acceptance criteria, and a PR Publisher opens the pull request. In Splash each session is one agent in one folder or worktree, started when you prompt it.',
			cite: ['routa-readme', 'routa-tasks-automation', 'routa-pr-publisher', 'splash-readme', 'splash-features', 'splash-how']
		},
		{
			title: 'Default handling of permissions',
			text: 'Routa launches Claude Code in <code>bypassPermissions</code> mode and GitHub Copilot CLI with <code>--allow-all-tools</code> by default, so their tool calls are approved without asking; permission requests from other ACP agents show as cards in the chat. Splash shows each request an agent sends in the transcript, answered with the 1–9 keys, and keeps pending ones in <strong>Needs attention</strong>.',
			cite: ['routa-claude-process', 'routa-acp-presets', 'routa-permission-issue', 'splash-features']
		},
		{
			title: 'Surfaces and where they run',
			text: 'Routa ships desktop builds for macOS, Windows x64 and Linux x64, a Rust CLI on npm and crates.io, and a Next.js web surface you host yourself, from source or with Docker Compose; no hosted service is documented. Splash builds for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64, plus <code>splash-server</code>, used in a browser over an SSH tunnel.',
			cite: ['routa-release', 'routa-release-guide', 'routa-quick-start', 'routa-self-hosting', 'routa-readme', 'splash-install', 'splash-server']
		},
		{
			title: 'Session history',
			text: 'Routa keeps its own sessions, resumed natively or by replay and forked where the provider allows, and reads Codex, Claude Code, Qoder and Augment transcripts for Feature Explorer and trace analysis; opening those as live sessions isn’t documented. Splash imports the conversations agents list over ACP, including ones started elsewhere, and searches saved transcript text.',
			cite: ['routa-sessions', 'routa-acp-presets', 'routa-feature-tree', 'routa-transcript-discovery', 'routa-v0-17-0', 'splash-history', 'splash-features']
		}
	],
	fit: {
		splash: [
			'You want a Needs attention queue and desktop notifications for permission requests and finished turns.',
			'You want to import conversations your agents started outside the app and search their saved transcripts.',
			'You want a terminal in each session folder and a GitHub view of issues, pull requests and Actions runs across repositories.',
			'You want to run sessions on your own server and use them in a browser over an SSH tunnel.'
		],
		other: [
			'You want a Kanban board where each lane has its own specialist agent, from backlog refinement to review.',
			'You want agents to commit, push and open GitHub PRs or GitLab MRs once a review gate passes.',
			'You want a lead agent that splits work into child sessions, and schedules or webhooks that start runs.',
			'You want API providers such as OpenAI, Anthropic or DeepSeek alongside agent CLIs, with a model set per role.'
		]
	},
	sources: [
		{ id: 'routa-home', title: 'Routa', url: 'https://phodal.github.io/routa/', publisher: 'Fengda Huang', checked: '2026-10-10' },
		{ id: 'routa-readme', title: 'phodal/routa', url: 'https://github.com/phodal/routa', publisher: 'phodal/routa on GitHub', checked: '2026-10-10' },
		{ id: 'routa-platforms', title: 'Platforms Overview', url: 'https://phodal.github.io/routa/platforms', publisher: 'Fengda Huang', checked: '2026-10-10' },
		{ id: 'routa-web', title: 'Web', url: 'https://phodal.github.io/routa/platforms/web', publisher: 'Fengda Huang', checked: '2026-10-10' },
		{ id: 'routa-tauri-conf', title: 'apps/desktop/src-tauri/tauri.conf.json', url: 'https://github.com/phodal/routa/blob/main/apps/desktop/src-tauri/tauri.conf.json', publisher: 'phodal/routa on GitHub', checked: '2026-10-10' },
		{ id: 'routa-release', title: 'Release Routa Desktop v0.19.0', url: 'https://github.com/phodal/routa/releases/tag/v0.19.0', publisher: 'phodal/routa on GitHub', checked: '2026-10-10' },
		{ id: 'routa-commits', title: 'Commits on main', url: 'https://github.com/phodal/routa/commits/main', publisher: 'phodal/routa on GitHub', checked: '2026-10-10' },
		{ id: 'routa-npm', title: 'routa-cli registry metadata', url: 'https://registry.npmjs.org/routa-cli', publisher: 'npm', checked: '2026-10-10' },
		{ id: 'routa-crates', title: 'routa-cli crate metadata', url: 'https://crates.io/api/v1/crates/routa-cli', publisher: 'crates.io', checked: '2026-10-10' },
		{ id: 'routa-license', title: 'LICENSE', url: 'https://github.com/phodal/routa/blob/main/LICENSE', publisher: 'phodal/routa on GitHub', checked: '2026-10-10' },
		{ id: 'routa-quick-start', title: 'Quick Start', url: 'https://phodal.github.io/routa/quick-start', publisher: 'Fengda Huang', checked: '2026-10-10' },
		{ id: 'routa-deployment', title: 'Deployment Overview', url: 'https://phodal.github.io/routa/deployment', publisher: 'Fengda Huang', checked: '2026-10-10' },
		{ id: 'routa-release-guide', title: 'Routa Release Guide', url: 'https://phodal.github.io/routa/release-guide', publisher: 'Fengda Huang', checked: '2026-10-10' },
		{ id: 'routa-providers', title: 'Providers and Models', url: 'https://phodal.github.io/routa/configuration/providers-and-models', publisher: 'Fengda Huang', checked: '2026-10-10' },
		{ id: 'routa-acp-presets', title: 'src/core/acp/acp-presets.ts', url: 'https://github.com/phodal/routa/blob/main/src/core/acp/acp-presets.ts', publisher: 'phodal/routa on GitHub', checked: '2026-10-10' },
		{ id: 'routa-custom-providers', title: 'src/client/utils/custom-acp-providers.ts', url: 'https://github.com/phodal/routa/blob/main/src/client/utils/custom-acp-providers.ts', publisher: 'phodal/routa on GitHub', checked: '2026-10-10' },
		{ id: 'routa-adr-acp', title: 'ADR 0002: Provider Normalization via ACP', url: 'https://github.com/phodal/routa/blob/main/docs/adr/0002-provider-normalization-via-acp.md', publisher: 'phodal/routa on GitHub', checked: '2026-10-10' },
		{ id: 'routa-claude-process', title: 'src/core/acp/claude-code-process.ts', url: 'https://github.com/phodal/routa/blob/main/src/core/acp/claude-code-process.ts', publisher: 'phodal/routa on GitHub', checked: '2026-10-10' },
		{ id: 'routa-api-providers', title: 'src/core/acp/api-based-providers.ts', url: 'https://github.com/phodal/routa/blob/main/src/core/acp/api-based-providers.ts', publisher: 'phodal/routa on GitHub', checked: '2026-10-10' },
		{ id: 'routa-env', title: 'Environment Variables', url: 'https://phodal.github.io/routa/configuration/environment-variables', publisher: 'Fengda Huang', checked: '2026-10-10' },
		{ id: 'routa-permission-issue', title: 'ACP permission request cards collapse rich request payloads into a generic UI (resolved)', url: 'https://github.com/phodal/routa/blob/main/docs/issues/2026-04-08-acp-permission-request-ui-rendering.md', publisher: 'phodal/routa on GitHub', checked: '2026-10-10' },
		{ id: 'routa-v0-14-0', title: 'v0.14.0 Release Notes', url: 'https://phodal.github.io/routa/releases/v0.14.0-release-notes', publisher: 'Fengda Huang', checked: '2026-10-10' },
		{ id: 'routa-architecture', title: 'Routa.js Architecture', url: 'https://phodal.github.io/routa/ARCHITECTURE', publisher: 'Fengda Huang', checked: '2026-10-10' },
		{ id: 'routa-feature-tree', title: 'Routa.js Product Feature Specification', url: 'https://phodal.github.io/routa/product-specs/FEATURE_TREE', publisher: 'Fengda Huang', checked: '2026-10-10' },
		{ id: 'routa-tasks-automation', title: 'crates/routa-server/src/api/tasks_automation.rs', url: 'https://github.com/phodal/routa/blob/main/crates/routa-server/src/api/tasks_automation.rs', publisher: 'phodal/routa on GitHub', checked: '2026-10-10' },
		{ id: 'routa-terminal-manager', title: 'src/core/acp/terminal-manager.ts', url: 'https://github.com/phodal/routa/blob/main/src/core/acp/terminal-manager.ts', publisher: 'phodal/routa on GitHub', checked: '2026-10-10' },
		{ id: 'routa-terminal-issue', title: 'Kanban ACP sessions do not support browser-embedded interactive terminal control (resolved)', url: 'https://github.com/phodal/routa/blob/main/docs/issues/2026-03-14-kanban-web-interactive-terminal-feasibility.md', publisher: 'phodal/routa on GitHub', checked: '2026-10-10' },
		{ id: 'routa-execution-modes', title: 'Execution Modes', url: 'https://phodal.github.io/routa/design-docs/execution-modes', publisher: 'Fengda Huang', checked: '2026-10-10' },
		{ id: 'routa-harness-monitor', title: 'Harness Monitor', url: 'https://github.com/phodal/routa/blob/main/crates/harness-monitor/README.md', publisher: 'phodal/routa on GitHub', checked: '2026-10-10' },
		{ id: 'routa-notification-center', title: 'src/client/components/notification-center.tsx', url: 'https://github.com/phodal/routa/blob/main/src/client/components/notification-center.tsx', publisher: 'phodal/routa on GitHub', checked: '2026-10-10' },
		{ id: 'routa-team', title: 'Team', url: 'https://phodal.github.io/routa/use-routa/team', publisher: 'Fengda Huang', checked: '2026-10-10' },
		{ id: 'routa-webhook-panel', title: 'src/client/components/github-webhook-panel.tsx', url: 'https://github.com/phodal/routa/blob/main/src/client/components/github-webhook-panel.tsx', publisher: 'phodal/routa on GitHub', checked: '2026-10-10' },
		{ id: 'routa-v0-19-0', title: 'Routa Desktop v0.19.0', url: 'https://phodal.github.io/routa/releases/v0.19.0-release-notes', publisher: 'Fengda Huang', checked: '2026-10-10' },
		{ id: 'routa-pr-publisher', title: 'resources/specialists/workflows/kanban/pr-publisher.yaml', url: 'https://github.com/phodal/routa/blob/main/resources/specialists/workflows/kanban/pr-publisher.yaml', publisher: 'phodal/routa on GitHub', checked: '2026-10-10' },
		{ id: 'routa-task-handlers', title: 'crates/routa-server/src/api/tasks/handlers.rs', url: 'https://github.com/phodal/routa/blob/main/crates/routa-server/src/api/tasks/handlers.rs', publisher: 'phodal/routa on GitHub', checked: '2026-10-10' },
		{ id: 'routa-gh-120', title: '[GitHub #120] Support Kanban cards from docs/issues markdown files', url: 'https://github.com/phodal/routa/blob/main/docs/issues/2026-03-11-gh-120-support-kanban-cards-from-docs-issues-markdown-files-with-project-direct.md', publisher: 'phodal/routa on GitHub', checked: '2026-10-10' },
		{ id: 'routa-self-hosting', title: 'Self-Hosting', url: 'https://phodal.github.io/routa/administration/self-hosting', publisher: 'Fengda Huang', checked: '2026-10-10' },
		{ id: 'routa-transcript-discovery', title: 'crates/trace-parser/src/transcript_discovery.rs', url: 'https://github.com/phodal/routa/blob/main/crates/trace-parser/src/transcript_discovery.rs', publisher: 'phodal/routa on GitHub', checked: '2026-10-10' },
		{ id: 'routa-v0-17-0', title: 'v0.17.0 Release Notes', url: 'https://phodal.github.io/routa/releases/v0.17.0-release-notes', publisher: 'Fengda Huang', checked: '2026-10-10' },
		{ id: 'routa-sessions', title: 'Sessions', url: 'https://phodal.github.io/routa/use-routa/sessions', publisher: 'Fengda Huang', checked: '2026-10-10' }
	]
};
