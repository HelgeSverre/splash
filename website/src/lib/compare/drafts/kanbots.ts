// Splash vs KanBots. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const KANBOTS: Comparison = {
	slug: 'kanbots',
	name: 'KanBots',
	description: 'How Splash and KanBots compare on agents, platforms, pricing, worktrees, review and team features, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and KanBots are open-source desktop apps that run several coding agents at once and can give each run its own git worktree. KanBots lays work out as cards on a kanban board, starts each agent’s CLI headless and sells a Cloud board for teams; Splash drives agents over the Agent Client Protocol and shows each session as a transcript.',
	other: {
		name: 'KanBots',
		url: 'https://www.kanbots.dev/',
		maker: 'KanBots',
		summary: 'A desktop kanban board where each card can run a coding agent’s CLI in its own git worktree, with branch previews and draft PRs. A paid Cloud adds a shared board for teams.',
		cite: ['kanbots-home', 'kanbots-readme', 'kanbots-pricing']
	},
	groups: [
		{ title: 'The basics', rows: [
			{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop kanban board where cards run coding agents in their own worktrees; an optional paid Cloud adds a team board', cite: ['kanbots-home', 'kanbots-readme', 'kanbots-pricing'] } },
			{ label: 'Release status', splash: S.maturity, other: { text: 'v1.2.0 of 25 May 2026, with no commits or releases since; the site footer and OSS page say v1.0', cite: ['kanbots-releases', 'kanbots-v1-2-0', 'kanbots-oss'] } },
			{ label: 'License', splash: S.license, other: { text: 'Open source (MIT) desktop; no license is stated for the hosted Cloud, whose server code isn’t in the public repo', cite: ['kanbots-license', 'kanbots-pricing', 'kanbots-security'] } },
			{ label: 'Price', splash: S.price, other: { text: 'Desktop free; Cloud Pro $19 per seat a month or $190 a year, Enterprise custom. The billing docs list different tiers', cite: ['kanbots-pricing', 'kanbots-oss', 'kanbots-billing-portal'] } },
			{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon and Intel), Windows x64 and Linux x64, as unsigned builds; the README’s npx kanbots installer isn’t on npm', cite: ['kanbots-v1-2-0', 'kanbots-getting-started', 'kanbots-readme', 'kanbots-npm'] } }
		] },
		{ title: 'Agents', rows: [
			{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code, Codex, Gemini, Cursor, Copilot, Amp, OpenCode, Droid, CCR, Qwen and a generic ACP entry; the docs and pricing page name Claude Code and Codex', cite: ['kanbots-v1-2-0', 'kanbots-worker', 'kanbots-agents-md', 'kanbots-dispatching-agents', 'kanbots-pricing'] } },
			{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Runs each vendor’s CLI headless as a child process, parsing its JSON stream; per the source, its ACP entry sends no requests', cite: ['kanbots-claude-adapter', 'kanbots-worker', 'kanbots-acp-adapter'] } },
			{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Each CLI’s login or API key pays for model use; the desktop can also sign in to Claude to show usage limits', cite: ['kanbots-getting-started', 'kanbots-providers-md', 'kanbots-claude-auth', 'kanbots-cost'] } },
			{ label: 'Account required', splash: S.account, other: { text: 'The getting-started and billing docs say the desktop needs a Cloud sign-in; the homepage, OSS page and source make it optional', cite: ['kanbots-getting-started', 'kanbots-billing-portal', 'kanbots-home', 'kanbots-oss', 'kanbots-first-run'] } },
			{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'None: agents start with their approval-bypass flags. Questions arrive as decision prompts, and edits outside the worktree can warn or pause', mark: 'no', cite: ['kanbots-agents-md', 'kanbots-amp-adapter', 'kanbots-configuration'] } },
			{ label: 'MCP servers', splash: S.mcp, other: { text: 'Ships an MCP server so Claude Desktop, Cursor or the claude CLI can manage cards, dispatch runs and answer decisions', mark: 'yes', cite: ['kanbots-mcp'] } }
		] },
		{ title: 'Working in parallel', rows: [
			{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A git worktree on a kanbots/ branch per run, kept until promoted or discarded; a pre-push hook stops agents pushing', mark: 'yes', cite: ['kanbots-worktrees', 'kanbots-agents-md'] } },
			{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Per-repo dev-server, setup and cleanup scripts; previews run the dev server in the worktree on a free port. Setup is manual', mark: 'yes', cite: ['kanbots-v1-1-0', 'kanbots-preview', 'kanbots-repo-scripts'] } },
			{ label: 'Built-in browser', splash: S.browser, other: { text: 'Branch previews open in an in-app frame with an editable URL bar, Eruda devtools and a click-to-component inspector', mark: 'yes', cite: ['kanbots-branch-preview', 'kanbots-v1-1-0', 'kanbots-v1-2-0'] } },
			{ label: 'Terminal', splash: S.terminal, other: { text: 'No built-in terminal; dev-server logs stream into the run’s thread', mark: 'no', cite: ['kanbots-branch-preview', 'kanbots-web-package'] } },
			{ label: 'What needs you', splash: S.attention, other: { text: 'Decision prompts pause a run and show numbered options; a tray gathers pending ones, and rate limits raise a banner', mark: 'yes', cite: ['kanbots-decision-prompts', 'kanbots-v1-2-0', 'kanbots-agents-md'] } },
			{ label: 'Autopilot', hint: 'Runs started by the app, not one prompt at a time', splash: S.scheduler, other: { text: 'Feature-dev autopilot runs up to four agents at once under optional cost caps; the app marks QA autopilot coming soon', mark: 'yes', cite: ['kanbots-agents-md', 'kanbots-autopilot-modal', 'kanbots-autopilot-qa'] } },
			{ label: 'Team collaboration', splash: { text: 'splash-server is a personal, single-user service, not a multi-user deployment', mark: 'no', cite: ['splash-server'] }, other: { text: 'Cloud Pro adds a shared board with presence, live card editing, assignments and Slack alerts; Enterprise adds SAML SSO and SCIM', mark: 'yes', cite: ['kanbots-pricing'] } }
		] },
		{ title: 'Review and shipping', rows: [
			{ label: 'Review changes', splash: S.review, other: { text: 'Run threads show inline diffs, unified or split; comments on diff lines go to the agent with your next reply', mark: 'yes', cite: ['kanbots-inline-diff', 'kanbots-v1-1-0'] } },
			{ label: 'Create pull requests', splash: S.prs, other: { text: 'In GitHub mode, pushes the run’s branch and opens a draft PR with an AI-drafted title and body', mark: 'yes', cite: ['kanbots-issues', 'kanbots-v1-2-0'] } },
			{ label: 'GitHub', splash: S.github, other: { text: 'GitHub mode runs the board on Issues; PR review comments show in chat and replies post back. No CI status is documented', mark: 'yes', cite: ['kanbots-issues', 'kanbots-v1-2-0'] } },
			{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'Local SQLite issues, GitHub Issues and imported Sentry error groups; no Linear, Jira or GitLab integration', mark: 'yes', cite: ['kanbots-issues', 'kanbots-sentry'] } }
		] },
		{ title: 'Where it runs', rows: [
			{ label: 'Cloud execution', splash: S.cloud, other: { text: 'Agents run on your machine; Cloud hosts the shared board and run history, though one repo doc mentions hosted runs', mark: 'no', cite: ['kanbots-pricing', 'kanbots-security', 'kanbots-cloud-dispatcher', 'kanbots-getting-started-md'] } },
			{ label: 'Remote access', splash: S.remote, other: { text: 'No SSH or remote-machine runs; agents stay on your computer, and Cloud Pro syncs the board across devices, laptop to phone', mark: 'no', cite: ['kanbots-pricing'] } }
		] },
		{ title: 'History and search', rows: [
			{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented; each card keeps every run dispatched from KanBots, and a run can resume its agent session', mark: 'unknown', cite: ['kanbots-the-board', 'kanbots-agents-md'] } },
			{ label: 'Search transcripts', splash: S.search, other: { text: 'Not documented; v1.2.0 adds saved board views and a recent-activity feed', mark: 'unknown', cite: ['kanbots-v1-2-0'] } }
		] }
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'KanBots starts each vendor’s CLI headless, such as <code>claude -p</code> or <code>codex exec</code>, and parses the JSON it prints. Its generic ACP entry reads ACP output but, per its source, sends no handshake of its own. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, natively or through a pinned adapter for the vendor’s CLI.',
			cite: ['kanbots-claude-adapter', 'kanbots-codex-adapter', 'kanbots-worker', 'kanbots-acp-adapter', 'splash-registry', 'acp']
		},
		{
			title: 'Permissions and safeguards',
			text: 'KanBots launches agents with their approval-bypass flags, so tools run without prompts; its safeguards are a worktree per run, a pre-push hook that blocks pushes and a path check that warns or pauses. Agents raise questions as decision prompts. Splash shows each permission request in the transcript, answered with the 1–9 keys, and keeps pending ones in <strong>Needs attention</strong>.',
			cite: ['kanbots-agents-md', 'kanbots-worktrees', 'kanbots-decision-prompts', 'splash-features']
		},
		{
			title: 'Board or conversation',
			text: 'KanBots arranges work as cards on a kanban board, fed by local issues, GitHub Issues or Sentry, and adds autopilot, per-run cost caps, branch previews and draft PRs. Splash is arranged around sessions: a rendered transcript per agent, a review screen, a terminal, transcript search and conversations imported from the agents’ own history.',
			cite: ['kanbots-home', 'kanbots-issues', 'kanbots-sentry', 'kanbots-agents-md', 'kanbots-v1-2-0', 'splash-features', 'splash-history']
		},
		{
			title: 'Price, accounts and license',
			text: 'Both desktop apps are free and MIT-licensed. KanBots sells Cloud, a hosted team board: Pro is $19 per seat a month on its pricing page, while its billing docs describe Team, Business and Enterprise tiers with seat minimums. Its docs disagree on whether the desktop needs a Cloud sign-in. Splash has no accounts.',
			cite: ['kanbots-license', 'kanbots-pricing', 'kanbots-billing-portal', 'kanbots-getting-started', 'kanbots-first-run', 'splash-license', 'splash-download', 'splash-build']
		},
		{
			title: 'Where agents run',
			text: 'KanBots runs agents on your computer, on macOS, Windows x64 or Linux x64; Cloud coordinates the board, not the runs. Its latest release, v1.2.0, dates from 25 May 2026. Splash runs on macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64, or as <code>splash-server</code> on a machine you reach from a browser over SSH.',
			cite: ['kanbots-v1-2-0', 'kanbots-security', 'kanbots-releases', 'splash-install', 'splash-server']
		}
	],
	fit: {
		splash: [
			'You want agents driven over the Agent Client Protocol, with their permission requests answered in the transcript.',
			'You want to run sessions on your own server and use them from a browser over SSH.',
			'You want to import conversations your agents started elsewhere and search them with the rest.',
			'You want a terminal, file tree and git changes beside each session.'
		],
		other: [
			'You want to plan and dispatch agent work as cards on a kanban board, fed by local issues, GitHub Issues or Sentry.',
			'You want agents to run hands-off in their own worktrees, with autopilot slots and cost caps.',
			'You want in-app previews of a branch’s dev server and draft PRs with AI-written descriptions.',
			'You want a shared team board with presence and live card editing on a paid Cloud plan.'
		]
	},
	sources: [
		{ id: 'kanbots-home', title: 'KanBots — a kanban that runs parallel agents', url: 'https://www.kanbots.dev/', publisher: 'KanBots', checked: '2026-10-10' },
		{ id: 'kanbots-oss', title: 'KanBots OSS — the open-source desktop edition', url: 'https://www.kanbots.dev/oss', publisher: 'KanBots', checked: '2026-10-10' },
		{ id: 'kanbots-pricing', title: 'Pricing', url: 'https://www.kanbots.dev/pricing', publisher: 'KanBots', checked: '2026-10-10' },
		{ id: 'kanbots-security', title: 'Security & privacy', url: 'https://www.kanbots.dev/security', publisher: 'KanBots', checked: '2026-10-10' },
		{ id: 'kanbots-getting-started', title: 'Getting started with the KanBots desktop', url: 'https://www.kanbots.dev/docs/getting-started', publisher: 'KanBots', checked: '2026-10-10' },
		{ id: 'kanbots-billing-portal', title: 'Billing portal', url: 'https://www.kanbots.dev/docs/billing-portal', publisher: 'KanBots', checked: '2026-10-10' },
		{ id: 'kanbots-dispatching-agents', title: 'Dispatch Claude Code or Codex from a card', url: 'https://www.kanbots.dev/docs/dispatching-agents', publisher: 'KanBots', checked: '2026-10-10' },
		{ id: 'kanbots-worktrees', title: 'Per-run worktrees, branch naming, and the pre-push hook', url: 'https://www.kanbots.dev/docs/worktrees-and-branches', publisher: 'KanBots', checked: '2026-10-10' },
		{ id: 'kanbots-configuration', title: 'Configuration reference for .kanbots/config.json', url: 'https://www.kanbots.dev/docs/configuration', publisher: 'KanBots', checked: '2026-10-10' },
		{ id: 'kanbots-branch-preview', title: 'Launch a dev server against an agent worktree', url: 'https://www.kanbots.dev/docs/branch-preview', publisher: 'KanBots', checked: '2026-10-10' },
		{ id: 'kanbots-decision-prompts', title: 'Answering agent decision prompts', url: 'https://www.kanbots.dev/docs/decision-prompts', publisher: 'KanBots', checked: '2026-10-10' },
		{ id: 'kanbots-issues', title: 'Workspace modes — local SQLite or GitHub Issues', url: 'https://www.kanbots.dev/docs/issues-local-vs-github', publisher: 'KanBots', checked: '2026-10-10' },
		{ id: 'kanbots-sentry', title: 'Auto-import Sentry error groups onto the board', url: 'https://www.kanbots.dev/docs/sentry-import', publisher: 'KanBots', checked: '2026-10-10' },
		{ id: 'kanbots-mcp', title: 'Driving the board from Claude Desktop or Cursor via MCP', url: 'https://www.kanbots.dev/docs/mcp-server', publisher: 'KanBots', checked: '2026-10-10' },
		{ id: 'kanbots-the-board', title: 'The KanBots board — columns, cards, and agent runs', url: 'https://www.kanbots.dev/docs/the-board', publisher: 'KanBots', checked: '2026-10-10' },
		{ id: 'kanbots-autopilot-qa', title: 'Autopilot QA', url: 'https://www.kanbots.dev/docs/autopilot-qa', publisher: 'KanBots', checked: '2026-10-10' },
		{ id: 'kanbots-readme', title: 'README.md', url: 'https://github.com/leodavinci1/kanbots/blob/main/README.md', publisher: 'leodavinci1/kanbots on GitHub', checked: '2026-10-10' },
		{ id: 'kanbots-license', title: 'LICENSE', url: 'https://github.com/leodavinci1/kanbots/blob/main/LICENSE', publisher: 'leodavinci1/kanbots on GitHub', checked: '2026-10-10' },
		{ id: 'kanbots-releases', title: 'Releases', url: 'https://github.com/leodavinci1/kanbots/releases', publisher: 'leodavinci1/kanbots on GitHub', checked: '2026-10-10' },
		{ id: 'kanbots-v1-2-0', title: 'Release v1.2.0', url: 'https://github.com/leodavinci1/kanbots/releases/tag/v1.2.0', publisher: 'leodavinci1/kanbots on GitHub', checked: '2026-10-10' },
		{ id: 'kanbots-v1-1-0', title: 'Release v1.1.0', url: 'https://github.com/leodavinci1/kanbots/releases/tag/v1.1.0', publisher: 'leodavinci1/kanbots on GitHub', checked: '2026-10-10' },
		{ id: 'kanbots-npm', title: 'kanbots (npm registry entry)', url: 'https://registry.npmjs.org/kanbots', publisher: 'npm', checked: '2026-10-10' },
		{ id: 'kanbots-agents-md', title: 'docs/agents.md', url: 'https://github.com/leodavinci1/kanbots/blob/main/docs/agents.md', publisher: 'leodavinci1/kanbots on GitHub', checked: '2026-10-10' },
		{ id: 'kanbots-providers-md', title: 'docs/providers.md', url: 'https://github.com/leodavinci1/kanbots/blob/main/docs/providers.md', publisher: 'leodavinci1/kanbots on GitHub', checked: '2026-10-10' },
		{ id: 'kanbots-getting-started-md', title: 'docs/getting-started.md', url: 'https://github.com/leodavinci1/kanbots/blob/main/docs/getting-started.md', publisher: 'leodavinci1/kanbots on GitHub', checked: '2026-10-10' },
		{ id: 'kanbots-worker', title: 'packages/dispatcher/src/worker.ts', url: 'https://github.com/leodavinci1/kanbots/blob/main/packages/dispatcher/src/worker.ts', publisher: 'leodavinci1/kanbots on GitHub', checked: '2026-10-10' },
		{ id: 'kanbots-claude-adapter', title: 'packages/dispatcher/src/adapters/claude-code.ts', url: 'https://github.com/leodavinci1/kanbots/blob/main/packages/dispatcher/src/adapters/claude-code.ts', publisher: 'leodavinci1/kanbots on GitHub', checked: '2026-10-10' },
		{ id: 'kanbots-codex-adapter', title: 'packages/dispatcher/src/adapters/codex-cli.ts', url: 'https://github.com/leodavinci1/kanbots/blob/main/packages/dispatcher/src/adapters/codex-cli.ts', publisher: 'leodavinci1/kanbots on GitHub', checked: '2026-10-10' },
		{ id: 'kanbots-amp-adapter', title: 'packages/dispatcher/src/adapters/amp-cli.ts', url: 'https://github.com/leodavinci1/kanbots/blob/main/packages/dispatcher/src/adapters/amp-cli.ts', publisher: 'leodavinci1/kanbots on GitHub', checked: '2026-10-10' },
		{ id: 'kanbots-acp-adapter', title: 'packages/dispatcher/src/adapters/acp.ts', url: 'https://github.com/leodavinci1/kanbots/blob/main/packages/dispatcher/src/adapters/acp.ts', publisher: 'leodavinci1/kanbots on GitHub', checked: '2026-10-10' },
		{ id: 'kanbots-preview', title: 'packages/dispatcher/src/preview.ts', url: 'https://github.com/leodavinci1/kanbots/blob/main/packages/dispatcher/src/preview.ts', publisher: 'leodavinci1/kanbots on GitHub', checked: '2026-10-10' },
		{ id: 'kanbots-repo-scripts', title: 'packages/api/src/handlers/workspace.ts', url: 'https://github.com/leodavinci1/kanbots/blob/main/packages/api/src/handlers/workspace.ts', publisher: 'leodavinci1/kanbots on GitHub', checked: '2026-10-10' },
		{ id: 'kanbots-cost', title: 'packages/api/src/handlers/cost.ts', url: 'https://github.com/leodavinci1/kanbots/blob/main/packages/api/src/handlers/cost.ts', publisher: 'leodavinci1/kanbots on GitHub', checked: '2026-10-10' },
		{ id: 'kanbots-claude-auth', title: 'packages/desktop/src/claude-auth.ts', url: 'https://github.com/leodavinci1/kanbots/blob/main/packages/desktop/src/claude-auth.ts', publisher: 'leodavinci1/kanbots on GitHub', checked: '2026-10-10' },
		{ id: 'kanbots-cloud-dispatcher', title: 'packages/desktop/src/cloud-run-dispatcher.ts', url: 'https://github.com/leodavinci1/kanbots/blob/main/packages/desktop/src/cloud-run-dispatcher.ts', publisher: 'leodavinci1/kanbots on GitHub', checked: '2026-10-10' },
		{ id: 'kanbots-web-package', title: 'packages/web/package.json', url: 'https://github.com/leodavinci1/kanbots/blob/main/packages/web/package.json', publisher: 'leodavinci1/kanbots on GitHub', checked: '2026-10-10' },
		{ id: 'kanbots-first-run', title: 'packages/web/src/components/CloudFirstRunPrompt.tsx', url: 'https://github.com/leodavinci1/kanbots/blob/main/packages/web/src/components/CloudFirstRunPrompt.tsx', publisher: 'leodavinci1/kanbots on GitHub', checked: '2026-10-10' },
		{ id: 'kanbots-autopilot-modal', title: 'packages/web/src/components/modals/AutopilotLaunchModal.tsx', url: 'https://github.com/leodavinci1/kanbots/blob/main/packages/web/src/components/modals/AutopilotLaunchModal.tsx', publisher: 'leodavinci1/kanbots on GitHub', checked: '2026-10-10' },
		{ id: 'kanbots-inline-diff', title: 'packages/web/src/components/run/InlineDiff.tsx', url: 'https://github.com/leodavinci1/kanbots/blob/main/packages/web/src/components/run/InlineDiff.tsx', publisher: 'leodavinci1/kanbots on GitHub', checked: '2026-10-10' }
	]
};
