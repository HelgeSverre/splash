// Splash vs Cursor Agents Window. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const CURSOR_AGENTS: Comparison = {
	slug: 'cursor-agents',
	name: 'Cursor Agents Window',
	description: 'How Splash and Cursor’s Agents Window compare on agents, models, platforms, pricing, worktrees, cloud agents and review, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Cursor’s Agents Window both run several coding agents at once, each in your project or its own git worktree. The Agents Window, a mode of the Cursor app, runs Cursor’s own agent on a choice of models, locally, over SSH or in Cursor’s cloud. Splash drives many vendors’ agents over the Agent Client Protocol.',
	other: {
		name: 'Cursor Agents Window',
		url: 'https://cursor.com/docs/agent/agents-window',
		maker: 'Anysphere',
		summary: 'The agent-first window of the Cursor desktop app. It runs many of Cursor’s agents side by side across repositories, locally, in worktrees, over SSH or in cloud VMs, with diffs, pull requests and a browser.',
		cite: ['cursor-agents-docs', 'cursor-agents-changelog-3-0', 'cursor-agents-blog']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'A mode of the Cursor desktop app beside its classic editor; cloud agents also run from the web and iOS', cite: ['cursor-agents-docs', 'cursor-agents-download', 'cursor-agents-ios'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'Generally available since Cursor 3 (2 April 2026); ships with the app, now 3.24. Projects is in beta', cite: ['cursor-agents-docs', 'cursor-agents-download', 'cursor-agents-changelog'] } },
				{ label: 'License', splash: S.license, other: { text: 'Proprietary; the terms forbid reverse engineering and derivative works, and the public cursor/cursor repository holds no source code', cite: ['cursor-agents-tos', 'cursor-agents-repo'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Hobby free; Pro $20, Pro+ $60, Ultra $200 a month; Teams $40 or $120 per user a month; Enterprise custom', cite: ['cursor-agents-pricing-help', 'cursor-agents-pricing'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 12+ (Apple silicon, Intel), Windows 10+ (x64, Arm64), Linux x64 and Arm64 (.deb, RPM, AppImage)', cite: ['cursor-agents-download', 'cursor-agents-quickstart'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Cursor’s own agent, on Cursor’s Grok and Composer models or models from OpenAI, Anthropic, Google and others', cite: ['cursor-agents-models'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Cursor’s own harness, tuned per model. The docs mention ACP for Cursor CLI as a server, not this window', cite: ['cursor-agents-agent-overview', 'cursor-agents-coding-agents', 'cursor-agents-acp'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Cursor bills usage against your plan, then on demand; your own API key covers chat models; Claude subscriptions can’t be reused', cite: ['cursor-agents-pricing', 'cursor-agents-models', 'cursor-agents-byok', 'cursor-agents-forum-claude'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'Yes, a Cursor account; the free Hobby plan needs no credit card', cite: ['cursor-agents-quickstart', 'cursor-agents-tos', 'cursor-agents-pricing'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Run Modes (Auto-review, Allowlist, Run Everything) decide when the agent asks; Auto-review’s classifier runs on Cursor’s servers', mark: 'yes', cite: ['cursor-agents-run-modes', 'cursor-agents-release-notes'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'stdio, SSE and Streamable HTTP servers with OAuth; Marketplace plugins bundle MCP servers with skills, rules and hooks', mark: 'yes', cite: ['cursor-agents-mcp', 'cursor-agents-plugins'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Opt-in git worktree per agent; cloud agents get a VM and branch; commands can use a macOS or Linux sandbox', mark: 'yes', cite: ['cursor-agents-worktrees', 'cursor-agents-cloud-agent', 'cursor-agents-run-modes'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Per-OS setup commands in .cursor/worktrees.json for new worktrees; cloud agents start dev servers too. No documented local port handling', mark: 'yes', cite: ['cursor-agents-worktrees', 'cursor-agents-cloud-setup'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Sidebar groups agents by status, with an Error group and unread markers; pills show pending input; a tray holds questions', mark: 'yes', cite: ['cursor-agents-release-notes'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: '/in-cloud sends work to a cloud subagent on its own VM; Projects (beta) has a coordinator agent delegate to others', mark: 'partial', cite: ['cursor-agents-docs', 'cursor-agents-subagents', 'cursor-agents-projects', 'cursor-agents-changelog'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'The agent opens, navigates and screenshots sites, local ones too; Design Mode turns clicks, drawings or voice into feedback', mark: 'yes', cite: ['cursor-agents-blog', 'cursor-agents-browser', 'cursor-agents-design-mode'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Diffs view to edit, stage and commit, with a Last Agent Turn scope; /agent-review runs quick or deep AI review', mark: 'yes', cite: ['cursor-agents-blog', 'cursor-agents-release-notes', 'cursor-agents-agent-review'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'Jump from a diff to its line in Cursor’s editor, which supports VS Code extensions and split screens', mark: 'yes', cite: ['cursor-agents-changelog-3-1', 'cursor-agents-docs'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'A PR tab creates, merges, marks ready, closes and reopens PRs, with CI status and a merge-queue control', mark: 'yes', cite: ['cursor-agents-release-notes', 'cursor-agents-blog'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Cursor’s GitHub app connects repos for cloud agents and Bugbot; commenting @cursor on a PR or issue starts an agent', mark: 'yes', cite: ['cursor-agents-github', 'cursor-agents-cloud-agent'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'Delegate Linear issues, or Jira work items (Teams, Enterprise), to cloud agents; the window has no documented issue list', mark: 'partial', cite: ['cursor-agents-linear', 'cursor-agents-jira'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'Paid plans: cloud agents in isolated VMs, started from the Cloud selector; sessions move between local and cloud either way', mark: 'yes', cite: ['cursor-agents-cloud-agent', 'cursor-agents-blog', 'cursor-agents-pricing'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'Agents over SSH, WSL or dev containers. Self-Hosted Machines run cloud agents’ tools on your hardware; Cursor keeps the loop', mark: 'yes', cite: ['cursor-agents-docs', 'cursor-agents-release-notes', 'cursor-agents-self-hosted'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'Paid plans: an iOS and iPadOS 26+ app controls cloud agents and, through Remote Control, local ones; Android is planned', mark: 'yes', cite: ['cursor-agents-ios', 'cursor-agents-changelog'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Undocumented, but Cursor staff say Claude Code sessions run inside Cursor can be pulled in; a wider importer is requested', mark: 'partial', cite: ['cursor-agents-forum-claude', 'cursor-agents-forum-import'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Cmd/Ctrl+K searches all past agent transcripts through a local index; past chats also show in @-mention search', mark: 'yes', cite: ['cursor-agents-agent-overview', 'cursor-agents-changelog-3-0'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'The Agents Window runs Cursor’s own agent, tuned to each model, with models from Cursor, OpenAI, Anthropic, Google and others. Its docs don’t describe running other vendors’ agent CLIs, and mention ACP when Cursor CLI acts as a server. Splash starts each agent as a child process and speaks the <strong>Agent Client Protocol</strong> with it, natively or through an adapter.',
			cite: ['cursor-agents-agent-overview', 'cursor-agents-models', 'cursor-agents-coding-agents', 'cursor-agents-acp', 'splash-readme', 'splash-registry', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'An Agents Window agent runs on your computer, in a worktree, over SSH or as a cloud agent in a VM that keeps going while you’re offline; Self-Hosted Machines put a cloud agent’s tools on your own hardware. Splash runs agents as child processes on your computer, or under <code>splash-server</code> on a machine you reach through an SSH tunnel.',
			cite: ['cursor-agents-docs', 'cursor-agents-cloud-agent', 'cursor-agents-blog', 'cursor-agents-self-hosted', 'splash-readme', 'splash-server']
		},
		{
			title: 'Accounts, billing and license',
			text: 'Cursor is proprietary and needs an account. Cursor bills model use against your plan, from free Hobby to Ultra at $200 a month, or you add your own API key; requests still pass through Cursor’s servers. Splash is free and MIT-licensed, has no accounts, and runs each agent on that agent’s own login.',
			cite: ['cursor-agents-tos', 'cursor-agents-quickstart', 'cursor-agents-pricing-help', 'cursor-agents-byok', 'cursor-agents-data-use', 'splash-license', 'splash-download', 'splash-build', 'splash-agents']
		},
		{
			title: 'Around the session',
			text: 'The Agents Window surrounds its agents with IDE tooling: Cursor’s editor in the same app, a built-in browser, worktree setup scripts, a pull request tab with CI status, AI review and Projects for larger multi-agent work. Splash centers on the conversation: a Needs attention queue, a review screen, a GitHub triage view across repositories and importing sessions agents started elsewhere.',
			cite: ['cursor-agents-docs', 'cursor-agents-browser', 'cursor-agents-worktrees', 'cursor-agents-release-notes', 'cursor-agents-agent-review', 'cursor-agents-projects', 'splash-features', 'splash-github', 'splash-history']
		},
		{
			title: 'Platforms and phones',
			text: 'The Cursor app runs on macOS 12+, Windows 10+ and Linux on x64 and Arm64; cloud agents can also be driven from <code>cursor.com/agents</code> in a browser and from an iOS app, with Android planned. Splash builds for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64, plus a headless server, and has no phone app.',
			cite: ['cursor-agents-download', 'cursor-agents-quickstart', 'cursor-agents-cloud-agent', 'cursor-agents-ios', 'splash-install']
		}
	],
	fit: {
		splash: [
			'You want agents from several vendors, such as Claude Code, Codex and Gemini, side by side over one protocol.',
			'You want a free, MIT-licensed app with no account, where each agent runs on its own login.',
			'You want to browse and import conversations your agents started outside the app, and search them.',
			'You want permission requests, failures and finished turns in one queue that survives restarts.'
		],
		other: [
			'You want Cursor’s agent on models from Cursor, OpenAI, Anthropic and Google, billed through one plan.',
			'You want cloud agents that keep working while you’re offline, reachable from a browser or an iPhone.',
			'You want an editor, a built-in browser, worktree setup scripts and a pull request tab in one app.',
			'You want a coordinator agent, in the Projects beta, to plan larger work and hand pieces to cloud agents.'
		]
	},
	sources: [
		{ id: 'cursor-agents-docs', title: 'Agents Window', url: 'https://cursor.com/docs/agent/agents-window', publisher: 'Anysphere', checked: '2026-10-10' },
		{ id: 'cursor-agents-changelog-3-0', title: 'New Cursor Interface', url: 'https://cursor.com/changelog/3-0', publisher: 'Anysphere', checked: '2026-10-10' },
		{ id: 'cursor-agents-blog', title: 'Meet the new Cursor', url: 'https://cursor.com/blog/cursor-3', publisher: 'Anysphere', checked: '2026-10-10' },
		{ id: 'cursor-agents-download', title: 'Download', url: 'https://cursor.com/download', publisher: 'Anysphere', checked: '2026-10-10' },
		{ id: 'cursor-agents-ios', title: 'Cursor for iOS', url: 'https://cursor.com/docs/cloud-agent/mobile', publisher: 'Anysphere', checked: '2026-10-10' },
		{ id: 'cursor-agents-changelog', title: 'Changelog', url: 'https://cursor.com/changelog', publisher: 'Anysphere', checked: '2026-10-10' },
		{ id: 'cursor-agents-tos', title: 'Terms of Service', url: 'https://cursor.com/terms-of-service', publisher: 'Anysphere', checked: '2026-10-10' },
		{ id: 'cursor-agents-repo', title: 'cursor/cursor', url: 'https://github.com/cursor/cursor', publisher: 'cursor/cursor on GitHub', checked: '2026-10-10' },
		{ id: 'cursor-agents-pricing-help', title: 'Pricing and plans', url: 'https://cursor.com/help/account-and-billing/pricing.md', publisher: 'Anysphere', checked: '2026-10-10' },
		{ id: 'cursor-agents-pricing', title: 'Pricing', url: 'https://cursor.com/pricing', publisher: 'Anysphere', checked: '2026-10-10' },
		{ id: 'cursor-agents-quickstart', title: 'Quickstart', url: 'https://cursor.com/docs/get-started/quickstart', publisher: 'Anysphere', checked: '2026-10-10' },
		{ id: 'cursor-agents-models', title: 'Models & Pricing', url: 'https://cursor.com/docs/models-and-pricing', publisher: 'Anysphere', checked: '2026-10-10' },
		{ id: 'cursor-agents-agent-overview', title: 'Cursor Agent', url: 'https://cursor.com/docs/agent/overview', publisher: 'Anysphere', checked: '2026-10-10' },
		{ id: 'cursor-agents-coding-agents', title: 'What are coding agents?', url: 'https://cursor.com/help/ai-features/coding-agents', publisher: 'Anysphere', checked: '2026-10-10' },
		{ id: 'cursor-agents-acp', title: 'ACP', url: 'https://cursor.com/docs/cli/acp', publisher: 'Anysphere', checked: '2026-10-10' },
		{ id: 'cursor-agents-byok', title: 'Bring your own API key', url: 'https://cursor.com/help/models-and-usage/api-keys', publisher: 'Anysphere', checked: '2026-10-10' },
		{ id: 'cursor-agents-forum-claude', title: 'Allow Claude Max / Claude Code Subscription Access in Cursor (staff reply, 21 June 2026)', url: 'https://forum.cursor.com/t/allow-claude-max-claude-code-subscription-access-in-cursor/163716', publisher: 'Cursor Community Forum', checked: '2026-10-10' },
		{ id: 'cursor-agents-run-modes', title: 'Run Modes', url: 'https://cursor.com/docs/agent/security/run-modes', publisher: 'Anysphere', checked: '2026-10-10' },
		{ id: 'cursor-agents-release-notes', title: 'Agents Window release notes', url: 'https://cursor.com/docs/release-notes/agents-window', publisher: 'Anysphere', checked: '2026-10-10' },
		{ id: 'cursor-agents-mcp', title: 'Model Context Protocol (MCP)', url: 'https://cursor.com/docs/mcp', publisher: 'Anysphere', checked: '2026-10-10' },
		{ id: 'cursor-agents-plugins', title: 'Plugins', url: 'https://cursor.com/docs/plugins', publisher: 'Anysphere', checked: '2026-10-10' },
		{ id: 'cursor-agents-worktrees', title: 'Worktrees', url: 'https://cursor.com/docs/configuration/worktrees', publisher: 'Anysphere', checked: '2026-10-10' },
		{ id: 'cursor-agents-cloud-agent', title: 'Cloud Agents', url: 'https://cursor.com/docs/cloud-agent', publisher: 'Anysphere', checked: '2026-10-10' },
		{ id: 'cursor-agents-cloud-setup', title: 'Cloud Agent setup', url: 'https://cursor.com/docs/cloud-agent/setup', publisher: 'Anysphere', checked: '2026-10-10' },
		{ id: 'cursor-agents-subagents', title: 'Subagents', url: 'https://cursor.com/docs/subagents', publisher: 'Anysphere', checked: '2026-10-10' },
		{ id: 'cursor-agents-projects', title: 'Projects', url: 'https://cursor.com/docs/agent/projects', publisher: 'Anysphere', checked: '2026-10-10' },
		{ id: 'cursor-agents-browser', title: 'Browser', url: 'https://cursor.com/docs/agent/tools/browser', publisher: 'Anysphere', checked: '2026-10-10' },
		{ id: 'cursor-agents-design-mode', title: 'Design Mode', url: 'https://cursor.com/docs/agent/design-mode.md', publisher: 'Anysphere', checked: '2026-10-10' },
		{ id: 'cursor-agents-agent-review', title: 'Agent Review', url: 'https://cursor.com/docs/agent/agent-review', publisher: 'Anysphere', checked: '2026-10-10' },
		{ id: 'cursor-agents-changelog-3-1', title: 'Tiled Layout and Upgraded Voice Input in the Agents Window', url: 'https://cursor.com/changelog/3-1', publisher: 'Anysphere', checked: '2026-10-10' },
		{ id: 'cursor-agents-github', title: 'GitHub', url: 'https://cursor.com/docs/integrations/github.md', publisher: 'Anysphere', checked: '2026-10-10' },
		{ id: 'cursor-agents-linear', title: 'Linear', url: 'https://cursor.com/docs/integrations/linear', publisher: 'Anysphere', checked: '2026-10-10' },
		{ id: 'cursor-agents-jira', title: 'Jira', url: 'https://cursor.com/docs/integrations/jira', publisher: 'Anysphere', checked: '2026-10-10' },
		{ id: 'cursor-agents-self-hosted', title: 'Self-Hosted Machines', url: 'https://cursor.com/docs/cloud-agent/self-hosted', publisher: 'Anysphere', checked: '2026-10-10' },
		{ id: 'cursor-agents-forum-import', title: 'Native Agent History Import / Importer API for Claude Code, Codex, and Cursor sessions (staff reply, 2 July 2026)', url: 'https://forum.cursor.com/t/native-agent-history-import-importer-api-for-claude-code-codex-and-cursor-sessions/164604', publisher: 'Cursor Community Forum', checked: '2026-10-10' },
		{ id: 'cursor-agents-data-use', title: 'Data Use & Privacy Overview', url: 'https://cursor.com/data-use', publisher: 'Anysphere', checked: '2026-10-10' }
	]
};
