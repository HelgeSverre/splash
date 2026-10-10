// Splash vs Aizen. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const AIZEN: Comparison = {
	slug: 'aizen',
	name: 'Aizen',
	description: 'How Splash and Aizen compare on agents, platforms, pricing, worktrees, setup scripts and review, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Aizen are both desktop apps that run several coding agents at once and talk to them over the Agent Client Protocol. Aizen is a native macOS app that gives each branch its own environment with a terminal, browser and files; Splash runs on macOS, Windows and Ubuntu, or as a server you open in a browser.',
	other: {
		name: 'Aizen',
		url: 'https://aizen.win',
		maker: 'Vivy Technologies',
		summary: 'A native macOS app for Apple silicon that gives each project or branch an environment with ACP agents, a GPU terminal, a browser and Git review. GPL-3.0 source; the core app is free.',
		cite: ['aizen-home', 'aizen-terms', 'aizen-readme']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Native macOS workspace that gives each branch agents, terminals, a browser and files side by side, plus an aizen CLI', cite: ['aizen-home', 'aizen-terms', 'aizen-readme'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v1.0.83 (25 July 2026), the last 1.0.x release; the README says Early Access and that 2.0.0 will break compatibility', cite: ['aizen-release', 'aizen-readme'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (GPL-3.0); contributors sign a CLA, and the Terms add rules for official binaries and license keys', cite: ['aizen-readme', 'aizen-terms', 'aizen-cla'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free core app. Pro ($5.99 a month or $59 a year) and Lifetime ($179) add priority support; no Pro-exclusive feature is listed', cite: ['aizen-home', 'aizen-terms'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 14 or later on Apple silicon; Intel Macs are unsupported since 1.0.71. No Windows, Linux or mobile release', cite: ['aizen-terms', 'aizen-readme', 'aizen-appcast'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Swift and SwiftUI, with libghostty for the terminal, libgit2 for Git, Core Data for storage and Sparkle for updates', cite: ['aizen-readme'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code, Codex and OpenCode preset; more install from the ACP registry, Gemini included, and any custom ACP command works', cite: ['aizen-readme', 'aizen-registry-service', 'aizen-home'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Agent Client Protocol over stdio for every chat agent; Claude Code and Codex run through ACP adapter packages', cite: ['aizen-startup', 'aizen-home', 'aizen-acp-registry'] } },
				{ label: 'Agent sign-in', splash: S.signIn, other: { text: 'A login button, or API keys set as per-agent environment variables kept in the Keychain; reuse of CLI logins isn’t documented', cite: ['aizen-auth', 'aizen-env-store'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'None documented for the free app; Pro needs a license key, bought through Stripe and checked by an Aizen server', cite: ['aizen-privacy', 'aizen-terms', 'aizen-license-client'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Shown in the app while the agent waits; a request left unanswered for five minutes is denied automatically', mark: 'yes', cite: ['aizen-permissions'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Per-agent MCP servers, picked from an in-app marketplace that draws on the official MCP registry', mark: 'yes', cite: ['aizen-readme', 'aizen-mcp-registry'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'An environment per project or branch: a git worktree, local clone or folder copy with its own terminals, browser and agents', mark: 'yes', cite: ['aizen-readme', 'aizen-environments'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Post-create actions copy .env and other files, add symlinks, and run commands or bash scripts; no dev-server or port handling is documented', mark: 'yes', cite: ['aizen-post-create', 'aizen-post-create-sheet'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'GPU-rendered libghostty terminal with split panes and presets; optional tmux-backed sessions persist, and the aizen CLI can attach to them', mark: 'yes', cite: ['aizen-readme', 'aizen-home'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'No shared queue; a banner in the worktree view shows another session’s pending permission request, with answer and jump buttons', mark: 'partial', cite: ['aizen-permission-banner'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'macOS notifications for permission requests while the app isn’t focused, with Allow, Deny and View buttons', mark: 'yes', cite: ['aizen-permission-notifications'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'A browser in each environment, with tabs per pane for docs, previews, sign-in flows and local apps', mark: 'yes', cite: ['aizen-readme', 'aizen-terms'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Syntax-highlighted diffs and review comments, sent to the agent with one button; Git staging, commits, pushes, merges and branches in the app', mark: 'yes', cite: ['aizen-readme', 'aizen-review-comments'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Through gh, glab or az: new PRs and MRs open in the browser to finish; merge and close them from the app', mark: 'yes', cite: ['aizen-pr-actions'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Through gh: PR details and Actions runs in the sidebar, with workflow triggers, cancels and logs; GitLab CI runs too', mark: 'yes', cite: ['aizen-readme', 'aizen-pr-actions', 'aizen-workflow-actions'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'No Linear, Jira, GitHub Issues or GitLab Issues integration is documented', mark: 'no', cite: ['aizen-readme', 'aizen-home'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'None released. An unreleased 2.0 branch adds a Mac host that an iOS app reaches over the LAN, Tailscale or Cloudflare', mark: 'no', cite: ['aizen-terms', 'aizen-v2-packages', 'aizen-v2-remote'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Updates itself with Sparkle from an appcast feed; each DMG carries an EdDSA signature', mark: 'yes', cite: ['aizen-appcast'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented; Aizen resumes its own chats if the agent supports ACP session loading; Claude and Codex logs feed usage reports', mark: 'unknown', cite: ['aizen-lifecycle', 'aizen-cost-usage'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'The sessions list filters by title or agent name; message text isn’t searched', mark: 'no', cite: ['aizen-sessions-search'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Both drive agents over the <strong>Agent Client Protocol</strong>. Aizen starts every chat agent as an ACP child process, seeds Claude Code, Codex and OpenCode, and installs more from the ACP registry through <code>npx</code>, <code>uvx</code> or a binary; its presets can point Claude Code and Codex at other providers. Splash ships its own launch commands, natively or through pinned adapters.',
			cite: ['aizen-startup', 'aizen-readme', 'aizen-registry-service', 'aizen-env-presets', 'splash-registry', 'acp']
		},
		{
			title: 'Where it runs',
			text: 'Aizen runs on Apple silicon Macs with macOS 14 or later, with agents on that Mac; its unreleased 2.0 branch adds a Mac host for an iOS client. Splash builds for macOS on Apple silicon and Intel, Windows 11 and Ubuntu 24.04, or runs as <code>splash-server</code> on a machine you reach in a browser over SSH.',
			cite: ['aizen-terms', 'aizen-appcast', 'aizen-startup', 'aizen-v2-packages', 'splash-install', 'splash-server']
		},
		{
			title: 'Price, license and accounts',
			text: 'Aizen’s source is GPL-3.0, and contributors sign a CLA. The core app is free, with no account documented; Pro ($5.99 a month or $59 a year) and Lifetime ($179) fund development and add priority support, with license keys validated by an Aizen server. Splash is free and MIT-licensed, with no accounts.',
			cite: ['aizen-readme', 'aizen-cla', 'aizen-home', 'aizen-terms', 'aizen-license-client', 'splash-license', 'splash-download', 'splash-build']
		},
		{
			title: 'Around the agents',
			text: 'Aizen builds a workspace per branch: post-create actions copy <code>.env</code> files and run setup scripts, and each environment has a libghostty terminal, a browser and a file browser, plus voice input and Git tools for GitHub, GitLab and Azure DevOps. Splash centers on the conversation: a Needs attention queue, transcript search and importing sessions agents started elsewhere.',
			cite: ['aizen-readme', 'aizen-post-create', 'aizen-pr-actions', 'splash-features', 'splash-history']
		}
	],
	fit: {
		splash: [
			'You work on Windows, Ubuntu or an Intel Mac.',
			'You want to run sessions on a remote machine and use them in a browser over SSH.',
			'You want one queue for permission requests and finished turns, and search across saved transcript text.',
			'You want to import conversations your agents started outside the app.'
		],
		other: [
			'You work on an Apple silicon Mac and want a native app with a GPU-rendered terminal and tmux persistence.',
			'You want each new worktree, clone or copy to get its .env files and setup scripts automatically.',
			'You want a built-in browser beside each branch’s agents and terminals.',
			'You want PR actions on GitHub, GitLab or Azure DevOps and CI runs in the sidebar, in an app that updates itself.'
		]
	},
	sources: [
		{ id: 'aizen-home', title: 'Aizen', url: 'https://aizen.win', publisher: 'Vivy Technologies', checked: '2026-10-10' },
		{ id: 'aizen-terms', title: 'Terms of Use', url: 'https://aizen.win/terms', publisher: 'Vivy Technologies', checked: '2026-10-10' },
		{ id: 'aizen-privacy', title: 'Privacy Policy', url: 'https://aizen.win/privacy', publisher: 'Vivy Technologies', checked: '2026-10-10' },
		{ id: 'aizen-appcast', title: 'Aizen Updates (appcast.xml)', url: 'https://r2.aizen.win/appcast.xml', publisher: 'Vivy Technologies', checked: '2026-10-10' },
		{ id: 'aizen-readme', title: 'README.md', url: 'https://github.com/vivy-company/aizen/blob/main/README.md', publisher: 'vivy-company/aizen on GitHub', checked: '2026-10-10' },
		{ id: 'aizen-release', title: 'Release 1.0.83', url: 'https://github.com/vivy-company/aizen/releases/tag/v1.0.83', publisher: 'vivy-company/aizen on GitHub', checked: '2026-10-10' },
		{ id: 'aizen-cla', title: 'Contributor License Agreement', url: 'https://github.com/vivy-company/aizen/blob/main/CLA.md', publisher: 'vivy-company/aizen on GitHub', checked: '2026-10-10' },
		{ id: 'aizen-registry-service', title: 'ACPRegistryService.swift', url: 'https://github.com/vivy-company/aizen/blob/main/aizen/Features/Settings/Infrastructure/Agents/ACPRegistryService.swift', publisher: 'vivy-company/aizen on GitHub', checked: '2026-10-10' },
		{ id: 'aizen-acp-registry', title: 'ACP agent registry (registry.json)', url: 'https://cdn.agentclientprotocol.com/registry/v1/latest/registry.json', publisher: 'Agent Client Protocol', checked: '2026-10-10' },
		{ id: 'aizen-startup', title: 'ChatAgentSession+StartupSupport.swift', url: 'https://github.com/vivy-company/aizen/blob/main/aizen/Features/Chat/Infrastructure/ACP/ChatAgentSession+StartupSupport.swift', publisher: 'vivy-company/aizen on GitHub', checked: '2026-10-10' },
		{ id: 'aizen-auth', title: 'ChatAgentSessionAuth.swift', url: 'https://github.com/vivy-company/aizen/blob/main/aizen/Features/Chat/Infrastructure/ACP/ChatAgentSessionAuth.swift', publisher: 'vivy-company/aizen on GitHub', checked: '2026-10-10' },
		{ id: 'aizen-env-store', title: 'AgentEnvironmentStore.swift', url: 'https://github.com/vivy-company/aizen/blob/main/aizen/Features/Settings/Application/Agents/AgentEnvironmentStore.swift', publisher: 'vivy-company/aizen on GitHub', checked: '2026-10-10' },
		{ id: 'aizen-env-presets', title: 'AgentEnvironmentVariablePresets.swift', url: 'https://github.com/vivy-company/aizen/blob/main/aizen/Features/Settings/Domain/Agents/AgentEnvironmentVariablePresets.swift', publisher: 'vivy-company/aizen on GitHub', checked: '2026-10-10' },
		{ id: 'aizen-license-client', title: 'LicenseClient.swift', url: 'https://github.com/vivy-company/aizen/blob/main/aizen/Features/Settings/Infrastructure/License/LicenseClient.swift', publisher: 'vivy-company/aizen on GitHub', checked: '2026-10-10' },
		{ id: 'aizen-permissions', title: 'AgentPermissionHandler.swift', url: 'https://github.com/vivy-company/aizen/blob/main/aizen/Features/Chat/Infrastructure/ACP/Delegates/AgentPermissionHandler.swift', publisher: 'vivy-company/aizen on GitHub', checked: '2026-10-10' },
		{ id: 'aizen-permission-notifications', title: 'PermissionNotificationCoordinator.swift', url: 'https://github.com/vivy-company/aizen/blob/main/aizen/Features/Chat/Infrastructure/Notifications/PermissionNotificationCoordinator.swift', publisher: 'vivy-company/aizen on GitHub', checked: '2026-10-10' },
		{ id: 'aizen-permission-banner', title: 'PermissionBannerView.swift', url: 'https://github.com/vivy-company/aizen/blob/main/aizen/Features/Chat/UI/Components/PermissionBannerView.swift', publisher: 'vivy-company/aizen on GitHub', checked: '2026-10-10' },
		{ id: 'aizen-mcp-registry', title: 'MCPRegistryService.swift', url: 'https://github.com/vivy-company/aizen/blob/main/aizen/Features/Settings/Application/MCP/MCPRegistryService.swift', publisher: 'vivy-company/aizen on GitHub', checked: '2026-10-10' },
		{ id: 'aizen-environments', title: 'WorkspaceRepositoryStore+IndependentEnvironment.swift', url: 'https://github.com/vivy-company/aizen/blob/main/aizen/Features/Workspace/Application/WorkspaceRepositoryStore+IndependentEnvironment.swift', publisher: 'vivy-company/aizen on GitHub', checked: '2026-10-10' },
		{ id: 'aizen-post-create', title: 'PostCreateAction.swift', url: 'https://github.com/vivy-company/aizen/blob/main/aizen/Shared/Workspace/Git/PostCreateAction.swift', publisher: 'vivy-company/aizen on GitHub', checked: '2026-10-10' },
		{ id: 'aizen-post-create-sheet', title: 'PostCreateActionsSheet.swift', url: 'https://github.com/vivy-company/aizen/blob/main/aizen/Features/Settings/UI/Components/PostCreateActionsSheet.swift', publisher: 'vivy-company/aizen on GitHub', checked: '2026-10-10' },
		{ id: 'aizen-review-comments', title: 'ReviewCommentsPanel+Footer.swift', url: 'https://github.com/vivy-company/aizen/blob/main/aizen/Features/Worktree/UI/Components/Git/ReviewCommentsPanel+Footer.swift', publisher: 'vivy-company/aizen on GitHub', checked: '2026-10-10' },
		{ id: 'aizen-pr-actions', title: 'GitHostingService+PRActions.swift', url: 'https://github.com/vivy-company/aizen/blob/main/aizen/Features/Worktree/Infrastructure/Git/GitHostingService+PRActions.swift', publisher: 'vivy-company/aizen on GitHub', checked: '2026-10-10' },
		{ id: 'aizen-workflow-actions', title: 'GitHubWorkflowProvider+Actions.swift', url: 'https://github.com/vivy-company/aizen/blob/main/aizen/Features/Worktree/Infrastructure/Workflow/GitHubWorkflowProvider+Actions.swift', publisher: 'vivy-company/aizen on GitHub', checked: '2026-10-10' },
		{ id: 'aizen-lifecycle', title: 'ChatAgentSession+Lifecycle.swift', url: 'https://github.com/vivy-company/aizen/blob/main/aizen/Features/Chat/Infrastructure/ACP/ChatAgentSession+Lifecycle.swift', publisher: 'vivy-company/aizen on GitHub', checked: '2026-10-10' },
		{ id: 'aizen-cost-usage', title: 'CostUsageScanner.swift', url: 'https://github.com/vivy-company/aizen/blob/main/aizen/Features/Settings/Infrastructure/Usage/CostUsage/CostUsageScanner.swift', publisher: 'vivy-company/aizen on GitHub', checked: '2026-10-10' },
		{ id: 'aizen-sessions-search', title: 'SessionsListStore+Queries.swift', url: 'https://github.com/vivy-company/aizen/blob/main/aizen/Features/Chat/Application/SessionsListStore+Queries.swift', publisher: 'vivy-company/aizen on GitHub', checked: '2026-10-10' },
		{ id: 'aizen-v2-packages', title: 'Aizen Reignition packages (v2 branch README)', url: 'https://github.com/vivy-company/aizen/blob/feature/aizen-v2-reignition/Packages/README.md', publisher: 'vivy-company/aizen on GitHub', checked: '2026-10-10' },
		{ id: 'aizen-v2-remote', title: 'RemoteWebSocketTransport.swift (v2 branch)', url: 'https://github.com/vivy-company/aizen/blob/feature/aizen-v2-reignition/Packages/MacPlatform/Sources/AizenMacPlatform/RemoteWebSocketTransport.swift', publisher: 'vivy-company/aizen on GitHub', checked: '2026-10-10' }
	]
};
