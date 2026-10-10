// Splash vs Delta. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const ZED_DELTA: Comparison = {
	slug: 'zed-delta',
	name: 'Delta',
	description: 'How Splash and Delta, from the makers of Zed, compare on agents, platforms, pricing, isolation, collaboration and review, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Delta both run coding agents and can give each its own checkout. Delta, from the makers of Zed, runs its own agent on models you connect or Zed hosts, and syncs threads through Zed’s servers so teammates can join in. Splash, a free, open-source desktop app, drives agents such as Claude Code and Codex over the Agent Client Protocol.',
	other: {
		name: 'Delta',
		url: 'https://delta.dev/',
		maker: 'Zed Industries',
		summary: 'A desktop and web app where each thread pairs a conversation with Delta’s own agent and a checkout of the repository. Teammates can join a thread live, steer the agent and review its changes.',
		cite: ['zed-delta-home', 'zed-delta-beyond-pass-rate', 'zed-delta-collaborate', 'zed-delta-review']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app where each thread pairs an agent conversation with a repository checkout, plus Delta Web and a delta command-line tool', cite: ['zed-delta-home', 'zed-delta-download', 'zed-delta-web', 'zed-delta-101'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'Public beta since 16 September 2026; 28 releases from 0.1.1 (24 August) to 0.19.2 (9 October 2026)', cite: ['zed-delta-release-notes', 'zed-delta-install', 'zed-delta-public-beta'] } },
				{ label: 'License', splash: S.license, other: { text: 'Proprietary, with no public source code; use falls under the Early Access Agreement’s revocable, non-commercial license', cite: ['zed-delta-nix', 'zed-delta-early-access', 'zed-delta-download'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Personal: $0 with your own keys or subscriptions. Pro: $10 a month with $5 of hosted tokens. Business: $30 per seat monthly', cite: ['zed-delta-pricing', 'zed-delta-zed-pricing'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 13+ on Apple silicon (no Intel build), Linux and Windows on x64 and ARM64, a NixOS flake, and browsers', cite: ['zed-delta-install', 'zed-delta-download', 'zed-delta-nix', 'zed-delta-web'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Rust; Delta Web is the same app compiled to WebAssembly and drawn with WebGL', cite: ['zed-delta-introducing'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Delta’s own agent harness; the pricing page mentions external agents, but ACP support for Claude Code and others is still in progress', cite: ['zed-delta-beyond-pass-rate', 'zed-delta-pricing', 'zed-delta-roadmap'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'A built-in harness, with one system prompt for every model, that sends requests to the chosen model provider; Zed-hosted models go through Zed Cloud', cite: ['zed-delta-beyond-pass-rate', 'zed-delta-privacy'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'ChatGPT, Copilot or Grok subscriptions; keys for Anthropic, OpenAI, Google, OpenRouter or OpenCode; Zed-hosted models; OpenAI- or Anthropic-compatible endpoints on desktop', cite: ['zed-delta-101', 'zed-delta-models', 'zed-delta-plans'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'A Zed account through GitHub sign-in, plus the accepted Early Access Agreement; you must be online to open a workspace', cite: ['zed-delta-sign-in', 'zed-delta-troubleshooting'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'None: the agent calls tools, destructive ones included, without asking; agent permissions are on the roadmap', mark: 'no', cite: ['zed-delta-agentic-safety'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'MCP configuration is restricted to Zed staff in v0.19.2; MCP support is in progress on the roadmap', mark: 'no', cite: ['zed-delta-101', 'zed-delta-roadmap'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A Delta worktree per project in each thread by default: a separate Git clone, not a git worktree. Existing checkouts also work', mark: 'yes', cite: ['zed-delta-core-concepts', 'zed-delta-worktrees', 'zed-delta-101'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'An .agents/prepare script runs in each new managed checkout, and .agents/linked shares ignored files like .env; you assign ports', mark: 'yes', cite: ['zed-delta-project-setup'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'On desktop, an interactive terminal in the thread’s checkout, opened from the composer or File menu; Background Mode keeps servers running', mark: 'yes', cite: ['zed-delta-terminals', 'zed-delta-web'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Worker, Scout and Reviewer subagents plus custom profiles, up to four running per thread by default; agents can message other threads and, on desktop, start new ones', mark: 'yes', cite: ['zed-delta-subagents', 'zed-delta-settings', 'zed-delta-101'] } },
				{
					label: 'Team collaboration',
					hint: 'Several people in one thread',
					splash: { text: 'splash-server is a personal, single-user service, not a multi-user deployment', mark: 'no', cite: ['splash-server'] },
					other: { text: 'Shared threads show messages, edits and agent activity live, and everyone can steer and comment; invitees join as editors', mark: 'yes', cite: ['zed-delta-collaborate'] }
				},
				{ label: 'What needs you', splash: S.attention, other: { text: 'An Inbox for mentions and invitations, unread and running markers, subagent statuses, and system notifications when an agent finishes in the background', mark: 'yes', cite: ['zed-delta-101', 'zed-delta-subagents', 'zed-delta-settings'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'A Changes tab diffs the branch, uncommitted work, the last turn or one commit; line comments; review threads with Approve or Request Changes verdicts', mark: 'yes', cite: ['zed-delta-101', 'zed-delta-review'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'No PR screen: the agent pushes and opens PRs when asked, and Land Changes runs your project’s landing skill on desktop', mark: 'partial', cite: ['zed-delta-review'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Land result cards show the CI status the agent reports; the 0.6.0 notes add CI status in threads via a GitHub token; PRs the agent opens can link back', mark: 'partial', cite: ['zed-delta-review', 'zed-delta-release-notes', 'zed-delta-settings'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'Cloud Runner is restricted to Zed staff in v0.19.2, though the homepage describes it; persistent cloud environments are in progress', mark: 'no', cite: ['zed-delta-101', 'zed-delta-home', 'zed-delta-roadmap'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'Delta Web lets you join, review and message threads; browser turns use hosted models and have no shell; SSH hosts aren’t documented', mark: 'partial', cite: ['zed-delta-web', 'zed-delta-collaborate'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'No iOS or Android app is documented; Delta Web opens threads in phone and tablet browsers, with mobile Firefox unsupported', mark: 'partial', cite: ['zed-delta-web'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented for other tools’ transcripts; a thread can start in an existing git worktree to carry on their file changes', mark: 'unknown', cite: ['zed-delta-the-diff'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Go to Thread searches titles, archived ones included, and ⌘F or Ctrl+F searches one thread; the agent can search other transcripts', mark: 'partial', cite: ['zed-delta-threads', 'zed-delta-privacy'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Delta runs its own agent harness, with one system prompt for every model, on the providers you connect or on Zed-hosted models. Bringing Claude Code and other external agents in over ACP is in progress on its roadmap. Splash starts each vendor’s agent as a child process and speaks the <strong>Agent Client Protocol</strong> with it, natively or through an adapter.',
			cite: ['zed-delta-beyond-pass-rate', 'zed-delta-models', 'zed-delta-roadmap', 'splash-readme', 'splash-registry', 'acp']
		},
		{
			title: 'Where code and data live',
			text: 'Adding a project or creating a thread in Delta keeps its files and history on Zed’s servers, which run on Cloudflare. Telemetry and crash reports can’t be turned off, and Delta redacts secrets it recognizes before storing or sending content. Splash has no accounts, runs agents on your computer or your own <code>splash-server</code>, and saves transcripts in SQLite.',
			cite: ['zed-delta-quick-start', 'zed-delta-data-storage', 'zed-delta-privacy', 'zed-delta-security', 'splash-build', 'splash-readme', 'splash-server', 'splash-how']
		},
		{
			title: 'Working together',
			text: 'Delta is built around shared threads: teammates follow messages, edits and agent activity live, steer the agent, comment and submit reviews from the desktop app or a browser, and each turn runs where its sender is working. Everyone in a shared thread can edit it, and sharing also gives access to the Delta worktree histories of its repositories, including those of threads that were not shared. <code>splash-server</code> is a personal, single-user service.',
			cite: ['zed-delta-collaborate', 'zed-delta-review', 'zed-delta-web', 'zed-delta-data-storage', 'splash-server']
		},
		{
			title: 'Safety defaults',
			text: 'Delta has no sandbox and no permission prompts: its agent calls tools without asking, and a repository’s setup scripts can run and its rules and skills become agent instructions with no review step. Permissions, sandboxing and trust controls for Delta worktrees are planned. Splash shows the permission requests an agent sends in the transcript, answered with the 1–9 keys, and keeps pending ones in <strong>Needs attention</strong>.',
			cite: ['zed-delta-agentic-safety', 'zed-delta-roadmap', 'splash-features']
		},
		{
			title: 'Price, license and platforms',
			text: 'Delta is proprietary and used under a revocable, non-commercial Early Access Agreement. Personal is $0 with your own keys or subscriptions; Pro is $10 a month and adds hosted models. It runs on Apple silicon Macs, Linux, Windows and the web. Splash is free and MIT-licensed, with builds for macOS (Apple silicon and Intel), Windows and Ubuntu.',
			cite: ['zed-delta-nix', 'zed-delta-early-access', 'zed-delta-pricing', 'zed-delta-install', 'zed-delta-web', 'splash-license', 'splash-download', 'splash-install']
		}
	],
	fit: {
		splash: [
			'You want Claude Code, Codex, Gemini, Copilot and other vendors’ agents side by side, driven over the Agent Client Protocol.',
			'You want to answer the permission requests agents send from the transcript, with pending ones queued in one place.',
			'You want a free, MIT-licensed app with no account, on an Intel Mac too, or on your own server over SSH.',
			'You want to import conversations your agents started outside the app and search their full text.'
		],
		other: [
			'You want teammates to join an agent thread live, steer it, comment and approve its changes.',
			'You want one built-in agent that runs on your ChatGPT, Copilot or Grok subscription, API keys or a local model server.',
			'You want Worker, Scout and Reviewer subagents, and a prepare script that sets up each isolated checkout.',
			'You want to open, review and message threads from a desktop or phone browser.'
		]
	},
	sources: [
		{ id: 'zed-delta-home', title: 'A Multiplayer Environment for Coding with Agents', url: 'https://delta.dev/', publisher: 'Zed Industries', checked: '2026-10-10' },
		{ id: 'zed-delta-download', title: 'Download', url: 'https://delta.dev/download', publisher: 'Zed Industries', checked: '2026-10-10' },
		{ id: 'zed-delta-pricing', title: 'Pricing', url: 'https://delta.dev/pricing', publisher: 'Zed Industries', checked: '2026-10-10' },
		{ id: 'zed-delta-roadmap', title: 'Roadmap', url: 'https://delta.dev/roadmap', publisher: 'Zed Industries', checked: '2026-10-10' },
		{ id: 'zed-delta-early-access', title: 'Zed Early Access Agreement for Delta', url: 'https://delta.dev/early-access', publisher: 'Zed Industries', checked: '2026-10-10' },
		{ id: 'zed-delta-install', title: 'Install Delta', url: 'https://delta.dev/docs/installation', publisher: 'Zed Industries', checked: '2026-10-10' },
		{ id: 'zed-delta-quick-start', title: 'Quick Start', url: 'https://delta.dev/docs/getting-started/quick-start', publisher: 'Zed Industries', checked: '2026-10-10' },
		{ id: 'zed-delta-101', title: 'Delta 101', url: 'https://delta.dev/docs/delta-101.md', publisher: 'Zed Industries', checked: '2026-10-10' },
		{ id: 'zed-delta-release-notes', title: 'Release notes', url: 'https://delta.dev/docs/whats-in-the-latest', publisher: 'Zed Industries', checked: '2026-10-10' },
		{ id: 'zed-delta-core-concepts', title: 'Core Concepts', url: 'https://delta.dev/docs/concepts/core-concepts', publisher: 'Zed Industries', checked: '2026-10-10' },
		{ id: 'zed-delta-worktrees', title: 'Delta Worktrees', url: 'https://delta.dev/docs/concepts/worktrees', publisher: 'Zed Industries', checked: '2026-10-10' },
		{ id: 'zed-delta-project-setup', title: 'Prepare your project', url: 'https://delta.dev/docs/configuration/project-setup', publisher: 'Zed Industries', checked: '2026-10-10' },
		{ id: 'zed-delta-settings', title: 'Settings', url: 'https://delta.dev/docs/configuration/settings', publisher: 'Zed Industries', checked: '2026-10-10' },
		{ id: 'zed-delta-models', title: 'Models & Providers', url: 'https://delta.dev/docs/agents/models-and-providers', publisher: 'Zed Industries', checked: '2026-10-10' },
		{ id: 'zed-delta-terminals', title: 'Terminals', url: 'https://delta.dev/docs/agents/terminals', publisher: 'Zed Industries', checked: '2026-10-10' },
		{ id: 'zed-delta-subagents', title: 'Subagents', url: 'https://delta.dev/docs/agents/subagents', publisher: 'Zed Industries', checked: '2026-10-10' },
		{ id: 'zed-delta-threads', title: 'Threads', url: 'https://delta.dev/docs/agents/threads', publisher: 'Zed Industries', checked: '2026-10-10' },
		{ id: 'zed-delta-review', title: 'Reviewing & Syncing Changes', url: 'https://delta.dev/docs/agents/review-and-sync', publisher: 'Zed Industries', checked: '2026-10-10' },
		{ id: 'zed-delta-collaborate', title: 'Collaborate in a Thread', url: 'https://delta.dev/docs/collaboration/collaborate-thread', publisher: 'Zed Industries', checked: '2026-10-10' },
		{ id: 'zed-delta-web', title: 'Delta on the Web', url: 'https://delta.dev/docs/collaboration/delta-on-the-web', publisher: 'Zed Industries', checked: '2026-10-10' },
		{ id: 'zed-delta-plans', title: 'Plans & Usage', url: 'https://delta.dev/docs/account/plans-and-pricing', publisher: 'Zed Industries', checked: '2026-10-10' },
		{ id: 'zed-delta-sign-in', title: 'Sign In', url: 'https://delta.dev/docs/account/authenticate', publisher: 'Zed Industries', checked: '2026-10-10' },
		{ id: 'zed-delta-agentic-safety', title: 'Agentic Safety', url: 'https://delta.dev/docs/privacy-and-security/agentic-safety', publisher: 'Zed Industries', checked: '2026-10-10' },
		{ id: 'zed-delta-privacy', title: 'AI Privacy & Telemetry', url: 'https://delta.dev/docs/privacy-and-security/privacy', publisher: 'Zed Industries', checked: '2026-10-10' },
		{ id: 'zed-delta-security', title: 'Security', url: 'https://delta.dev/docs/privacy-and-security/security', publisher: 'Zed Industries', checked: '2026-10-10' },
		{ id: 'zed-delta-data-storage', title: 'Data Storage & Deletion', url: 'https://delta.dev/docs/privacy-and-security/data-storage', publisher: 'Zed Industries', checked: '2026-10-10' },
		{ id: 'zed-delta-troubleshooting', title: 'Troubleshooting', url: 'https://delta.dev/docs/troubleshooting', publisher: 'Zed Industries', checked: '2026-10-10' },
		{ id: 'zed-delta-the-diff', title: 'The Diff: September 2026', url: 'https://delta.dev/blog/the-diff-2026-09', publisher: 'Zed Industries', checked: '2026-10-10' },
		{ id: 'zed-delta-beyond-pass-rate', title: 'Beyond Pass Rate: Harness Evals, and Their Blind Spots', url: 'https://delta.dev/blog/beyond-pass-rate', publisher: 'Zed Industries', checked: '2026-10-10' },
		{ id: 'zed-delta-introducing', title: 'Introducing Delta', url: 'https://zed.dev/blog/introducing-delta', publisher: 'Zed Industries', checked: '2026-10-10' },
		{ id: 'zed-delta-public-beta', title: 'Replace PRs with Delta – Now in Public Beta', url: 'https://zed.dev/blog/delta-public-beta', publisher: 'Zed Industries', checked: '2026-10-10' },
		{ id: 'zed-delta-zed-pricing', title: 'Zed Pricing', url: 'https://zed.dev/pricing', publisher: 'Zed Industries', checked: '2026-10-10' },
		{ id: 'zed-delta-nix', title: 'zed-industries/delta-nix README', url: 'https://github.com/zed-industries/delta-nix', publisher: 'zed-industries/delta-nix on GitHub', checked: '2026-10-10' }
	]
};
