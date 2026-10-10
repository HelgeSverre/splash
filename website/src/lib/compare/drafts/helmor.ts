// Splash vs Helmor. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const HELMOR: Comparison = {
	slug: 'helmor',
	name: 'Helmor',
	description: 'How Splash and Helmor compare on agents, platforms, pricing, worktrees, review and shipping, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Helmor are both free, open-source desktop apps that run several coding agents at once, each in a project folder or its own git worktree. Helmor bundles five agents and drives each through its vendor’s SDK or server, with Kimi Code over ACP; Splash drives every agent it supports over the Agent Client Protocol.',
	other: {
		name: 'Helmor',
		url: 'https://helmor.ai',
		maker: 'Caspian Zhao and Nathan Lian',
		summary: 'An open-source desktop workbench that runs Claude Code, Codex, Cursor, OpenCode and Kimi Code in parallel, each workspace a git worktree, with diffs, an editor, terminals and PR actions in one window.',
		cite: ['helmor-home', 'helmor-readme', 'helmor-workspaces', 'helmor-review-ship', 'helmor-editor']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app built on Tauri, plus an optional helmor CLI and an experimental companion you open in a phone browser', cite: ['helmor-agents-md', 'helmor-install', 'helmor-readme', 'helmor-settings'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v0.46.0 of 24 July 2026, still the latest release on 10 October 2026; versions are pre-1.0', cite: ['helmor-release', 'helmor-home'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (Apache-2.0); the name and logo are the authors’ trademarks, and forks must ship under another name', cite: ['helmor-license', 'helmor-notice'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free; you pay model providers such as Anthropic, OpenAI or Cursor through your own subscriptions or API keys', cite: ['helmor-faq'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon and Intel) and Windows x64; the v0.46.0 release has no Linux or Windows on Arm build', cite: ['helmor-faq', 'helmor-release'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code, Codex, Cursor, OpenCode and Kimi Code, a fixed set; several accept custom or OpenAI-compatible model endpoints', cite: ['helmor-readme', 'helmor-session-manager', 'helmor-agents-models', 'helmor-changelog'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Claude Agent SDK for Claude Code, codex app-server JSON-RPC, @cursor/sdk, OpenCode’s HTTP server, and ACP for Kimi Code', cite: ['helmor-claude-sdk', 'helmor-codex-app-server', 'helmor-cursor-sdk', 'helmor-opencode', 'helmor-kimi-acp'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Bundled CLIs use your Claude Code, Codex or Kimi login or API key, OpenCode’s config, or a Cursor key', cite: ['helmor-install', 'helmor-agents-models', 'helmor-changelog'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'No Helmor account; first launch includes connecting GitHub or GitLab through the bundled gh and glab CLIs', cite: ['helmor-privacy', 'helmor-install'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Claude Code and Codex run with full access outside read-only Plan mode; Kimi Code’s permission prompts appear as panels', mark: 'partial', cite: ['helmor-provider-capabilities', 'helmor-claude-sdk', 'helmor-codex-app-server', 'helmor-changelog', 'helmor-composer'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Claude Code and Cursor sessions load your configured MCP servers; helmor mcp offers Helmor itself as a read-only MCP server', mark: 'yes', cite: ['helmor-agents-models', 'helmor-changelog', 'helmor-cli-mcp'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A git worktree on its own branch per workspace, shared by its sessions; Local and Chat modes have no isolation', mark: 'yes', cite: ['helmor-workspaces', 'helmor-sessions'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'helmor.json setup, run and archive scripts; HELMOR_PORT gives each workspace its own port range, and scripts can copy .env files', mark: 'yes', cite: ['helmor-configure', 'helmor-changelog'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'Terminal tabs in the workspace folder, a run-script panel, and Terminal Mode for Claude Code’s or Codex’s own TUI', mark: 'yes', cite: ['helmor-review-ship', 'helmor-agents-models', 'helmor-terminal-presets'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'The sidebar marks workspaces running, needing input or unread; desktop notifications, with optional sounds, cover finished and waiting agents', mark: 'yes', cite: ['helmor-sessions', 'helmor-parallel-agents'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Via the helmor CLI (an Experimental setting), an agent can spawn sibling workspaces and look through other sessions’ transcripts', mark: 'partial', cite: ['helmor-changelog', 'helmor-install', 'helmor-cli-mcp'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Lists changed files with status and line counts, opening side-by-side or unified diffs; line comments to the agent aren’t documented', mark: 'yes', cite: ['helmor-review-ship'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'Syntax-highlighted diffs switch to a built-in Monaco editor (⌘E) for fixing code by hand', mark: 'yes', cite: ['helmor-review-ship', 'helmor-editor'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Commit & Push and Create PR or MR run as steerable agent sessions; Merge respects branch protection; stacked PRs supported', mark: 'yes', cite: ['helmor-review-ship', 'helmor-stacked-prs'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'GitHub and GitLab via bundled gh and glab: auto-refreshing PR state and CI checks, agent-run Fix CI and Resolve Conflicts', mark: 'yes', cite: ['helmor-review-ship', 'helmor-install'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'Context panel pulls GitHub issues and PRs, GitLab issues and MRs, and Slack messages into prompts; no Linear or Jira', mark: 'partial', cite: ['helmor-composer', 'helmor-changelog'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'None; agents run on your computer and reach their providers directly, with no Helmor server between', mark: 'no', cite: ['helmor-privacy', 'helmor-faq'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'Experimental companion: a phone or other browser drives the desktop over a Cloudflare tunnel; no SSH hosts or mobile app', mark: 'partial', cite: ['helmor-readme', 'helmor-settings', 'helmor-tunnel'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Checks GitHub releases and installs updates when you restart', mark: 'yes', cite: ['helmor-install', 'helmor-privacy'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented. Helmor’s own sessions persist in local SQLite and resume; a Conductor import was removed in 0.45.0', mark: 'unknown', cite: ['helmor-sessions', 'helmor-privacy', 'helmor-changelog'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'No in-app search documented; helmor session search lets you or an agent search sessions in every workspace', mark: 'partial', cite: ['helmor-changelog', 'helmor-cli-mcp'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Helmor bundles its agents’ CLIs and drives each through its vendor’s interface: the Claude Agent SDK, <code>codex app-server</code>, <code>@cursor/sdk</code> and OpenCode’s HTTP server, with Kimi Code as the one agent on ACP. The set is fixed in its source. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, natively or through an adapter, and uses CLIs you install.',
			cite: ['helmor-install', 'helmor-claude-sdk', 'helmor-codex-app-server', 'helmor-cursor-sdk', 'helmor-opencode', 'helmor-kimi-acp', 'helmor-session-manager', 'splash-registry', 'splash-agents', 'acp']
		},
		{
			title: 'Permissions and Plan mode',
			text: 'Helmor treats a turn as read-only <strong>Plan mode</strong> or full access; outside Plan mode, Claude Code runs with <code>bypassPermissions</code> and Codex with a <code>dangerFullAccess</code> sandbox. Kimi Code has no Plan mode but sends its own permission prompts. Splash shows each permission request in the transcript, answered with the 1–9 keys, and queues pending ones in <strong>Needs attention</strong>.',
			cite: ['helmor-provider-capabilities', 'helmor-claude-sdk', 'helmor-codex-app-server', 'helmor-changelog', 'splash-features']
		},
		{
			title: 'Around the session',
			text: 'Helmor covers the path to a merged PR on GitHub or GitLab: <code>helmor.json</code> setup and run scripts with port ranges, a Monaco editor in diffs, agent-run Commit & Push, Create PR, Fix CI and Resolve Conflicts, and stacked PRs. Splash centers on the conversation: a Needs attention queue, a review screen, transcript search and importing sessions agents started elsewhere.',
			cite: ['helmor-configure', 'helmor-changelog', 'helmor-editor', 'helmor-review-ship', 'helmor-stacked-prs', 'splash-features', 'splash-history']
		},
		{
			title: 'Platforms, remote use and license',
			text: 'Helmor runs on macOS and Windows x64 under Apache-2.0 and updates itself; an experimental companion lets a phone browser drive the desktop through a Cloudflare tunnel, with an opt-in stable URL on your own Cloudflare account. Splash, MIT-licensed, also builds for Ubuntu, runs headless as <code>splash-server</code> reached over SSH, and is updated by downloading a new release.',
			cite: ['helmor-faq', 'helmor-license', 'helmor-install', 'helmor-readme', 'helmor-settings', 'helmor-tunnel', 'splash-license', 'splash-install', 'splash-server', 'splash-about']
		}
	],
	fit: {
		splash: [
			'You want Gemini, Copilot, Goose and other ACP agents alongside Claude Code and Codex in one transcript view.',
			'You work on Ubuntu, or want to run sessions on your own server and reach them over SSH.',
			'You want each permission request an agent sends shown in the transcript and kept in a Needs attention queue.',
			'You want to import conversations your agents started outside the app and search them in the app.'
		],
		other: [
			'You want the agent CLIs bundled with the app, using the logins you already have.',
			'You want helmor.json setup and run scripts with a separate port range for each workspace.',
			'You want agents to commit, open PRs or MRs, fix CI and resolve conflicts on GitHub or GitLab, stacked PRs included.',
			'You want to fix a diff by hand in a built-in editor, in an app that updates itself.'
		]
	},
	sources: [
		{ id: 'helmor-home', title: 'Helmor — The local-first IDE for coding agent orchestration', url: 'https://helmor.ai', publisher: 'Helmor', checked: '2026-10-10' },
		{ id: 'helmor-readme', title: 'README.md', url: 'https://github.com/dohooo/helmor/blob/main/README.md', publisher: 'dohooo/helmor on GitHub', checked: '2026-10-10' },
		{ id: 'helmor-agents-md', title: 'AGENTS.md', url: 'https://github.com/dohooo/helmor/blob/main/AGENTS.md', publisher: 'dohooo/helmor on GitHub', checked: '2026-10-10' },
		{ id: 'helmor-install', title: 'User guide: Install', url: 'https://github.com/dohooo/helmor/blob/main/docs/user/get-started/install.md', publisher: 'dohooo/helmor on GitHub', checked: '2026-10-10' },
		{ id: 'helmor-settings', title: 'User guide: Settings', url: 'https://github.com/dohooo/helmor/blob/main/docs/user/reference/settings.md', publisher: 'dohooo/helmor on GitHub', checked: '2026-10-10' },
		{ id: 'helmor-release', title: 'Helmor v0.46.0', url: 'https://github.com/dohooo/helmor/releases/tag/v0.46.0', publisher: 'dohooo/helmor on GitHub', checked: '2026-10-10' },
		{ id: 'helmor-license', title: 'LICENSE', url: 'https://github.com/dohooo/helmor/blob/main/LICENSE', publisher: 'dohooo/helmor on GitHub', checked: '2026-10-10' },
		{ id: 'helmor-notice', title: 'NOTICE', url: 'https://github.com/dohooo/helmor/blob/main/NOTICE', publisher: 'dohooo/helmor on GitHub', checked: '2026-10-10' },
		{ id: 'helmor-faq', title: 'User guide: FAQ', url: 'https://github.com/dohooo/helmor/blob/main/docs/user/troubleshooting/faq.md', publisher: 'dohooo/helmor on GitHub', checked: '2026-10-10' },
		{ id: 'helmor-session-manager', title: 'sidecar/src/session-manager.ts', url: 'https://github.com/dohooo/helmor/blob/main/sidecar/src/session-manager.ts', publisher: 'dohooo/helmor on GitHub', checked: '2026-10-10' },
		{ id: 'helmor-agents-models', title: 'User guide: Agents & models', url: 'https://github.com/dohooo/helmor/blob/main/docs/user/concepts/agents-and-models.md', publisher: 'dohooo/helmor on GitHub', checked: '2026-10-10' },
		{ id: 'helmor-changelog', title: 'CHANGELOG.md', url: 'https://github.com/dohooo/helmor/blob/main/CHANGELOG.md', publisher: 'dohooo/helmor on GitHub', checked: '2026-10-10' },
		{ id: 'helmor-claude-sdk', title: 'sidecar/src/claude/session-manager.ts', url: 'https://github.com/dohooo/helmor/blob/main/sidecar/src/claude/session-manager.ts', publisher: 'dohooo/helmor on GitHub', checked: '2026-10-10' },
		{ id: 'helmor-codex-app-server', title: 'sidecar/src/codex/app-server-manager.ts', url: 'https://github.com/dohooo/helmor/blob/main/sidecar/src/codex/app-server-manager.ts', publisher: 'dohooo/helmor on GitHub', checked: '2026-10-10' },
		{ id: 'helmor-cursor-sdk', title: 'sidecar/src/cursor/session-manager.ts', url: 'https://github.com/dohooo/helmor/blob/main/sidecar/src/cursor/session-manager.ts', publisher: 'dohooo/helmor on GitHub', checked: '2026-10-10' },
		{ id: 'helmor-opencode', title: 'sidecar/src/opencode-protocol/session-manager.ts', url: 'https://github.com/dohooo/helmor/blob/main/sidecar/src/opencode-protocol/session-manager.ts', publisher: 'dohooo/helmor on GitHub', checked: '2026-10-10' },
		{ id: 'helmor-kimi-acp', title: 'sidecar/src/kimi/session-manager.ts', url: 'https://github.com/dohooo/helmor/blob/main/sidecar/src/kimi/session-manager.ts', publisher: 'dohooo/helmor on GitHub', checked: '2026-10-10' },
		{ id: 'helmor-privacy', title: 'User guide: Privacy', url: 'https://github.com/dohooo/helmor/blob/main/docs/user/security/privacy.md', publisher: 'dohooo/helmor on GitHub', checked: '2026-10-10' },
		{ id: 'helmor-provider-capabilities', title: 'src-tauri/src/agents/provider_capabilities.rs', url: 'https://github.com/dohooo/helmor/blob/main/src-tauri/src/agents/provider_capabilities.rs', publisher: 'dohooo/helmor on GitHub', checked: '2026-10-10' },
		{ id: 'helmor-composer', title: 'User guide: Composer', url: 'https://github.com/dohooo/helmor/blob/main/docs/user/reference/composer.md', publisher: 'dohooo/helmor on GitHub', checked: '2026-10-10' },
		{ id: 'helmor-cli-mcp', title: 'User guide: CLI & MCP', url: 'https://github.com/dohooo/helmor/blob/main/docs/user/reference/cli-and-mcp.md', publisher: 'dohooo/helmor on GitHub', checked: '2026-10-10' },
		{ id: 'helmor-workspaces', title: 'User guide: Workspaces', url: 'https://github.com/dohooo/helmor/blob/main/docs/user/concepts/workspaces.md', publisher: 'dohooo/helmor on GitHub', checked: '2026-10-10' },
		{ id: 'helmor-sessions', title: 'User guide: Sessions', url: 'https://github.com/dohooo/helmor/blob/main/docs/user/concepts/sessions.md', publisher: 'dohooo/helmor on GitHub', checked: '2026-10-10' },
		{ id: 'helmor-configure', title: 'User guide: Configure your project', url: 'https://github.com/dohooo/helmor/blob/main/docs/user/get-started/configure-your-project.md', publisher: 'dohooo/helmor on GitHub', checked: '2026-10-10' },
		{ id: 'helmor-review-ship', title: 'User guide: Review & ship', url: 'https://github.com/dohooo/helmor/blob/main/docs/user/reference/review-and-ship.md', publisher: 'dohooo/helmor on GitHub', checked: '2026-10-10' },
		{ id: 'helmor-terminal-presets', title: 'src/features/terminal/terminal-presets.ts', url: 'https://github.com/dohooo/helmor/blob/main/src/features/terminal/terminal-presets.ts', publisher: 'dohooo/helmor on GitHub', checked: '2026-10-10' },
		{ id: 'helmor-parallel-agents', title: 'User guide: Parallel agents', url: 'https://github.com/dohooo/helmor/blob/main/docs/user/concepts/parallel-agents.md', publisher: 'dohooo/helmor on GitHub', checked: '2026-10-10' },
		{ id: 'helmor-editor', title: 'User guide: Editor', url: 'https://github.com/dohooo/helmor/blob/main/docs/user/reference/editor.md', publisher: 'dohooo/helmor on GitHub', checked: '2026-10-10' },
		{ id: 'helmor-stacked-prs', title: 'User guide: Stacked PRs', url: 'https://github.com/dohooo/helmor/blob/main/docs/user/concepts/stacked-prs.md', publisher: 'dohooo/helmor on GitHub', checked: '2026-10-10' },
		{ id: 'helmor-tunnel', title: 'src-tauri/src/companion/tunnel.rs', url: 'https://github.com/dohooo/helmor/blob/main/src-tauri/src/companion/tunnel.rs', publisher: 'dohooo/helmor on GitHub', checked: '2026-10-10' }
	]
};
