// Splash vs Intent. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const AUGMENT_INTENT: Comparison = {
	slug: 'augment-intent',
	name: 'Intent',
	description: 'How Splash and Intent compare on agents, platforms, pricing, worktrees, multi-agent workflows and review, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Intent are free, open-source desktop apps that run several coding agents over the Agent Client Protocol, using git worktrees to keep work apart. Intent runs its agents through a separate daemon and is built around workspaces where a Coordinator can split a living spec across a team of agents. Splash runs one agent per session.',
	other: {
		name: 'Intent',
		url: 'https://intentapp.dev/',
		maker: 'SHV Labs',
		summary: 'A desktop app for coordinating many coding agents, with each workspace on its own branch and, by default, its own git worktree. A Coordinator agent can write a living spec and delegate tasks to other agents; an iOS app steers it remotely.',
		cite: ['augment-intent-docs', 'augment-intent-readme', 'augment-intent-app-store']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Electron desktop app over a local Rust daemon (intentd), an iOS remote-control app, and a standalone daemon for remote hosts', cite: ['augment-intent-fe-readme', 'augment-intent-readme', 'augment-intent-docs'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v2.212.1 stable (8 October 2026), with GitHub pre-releases such as v2.215.0 (10 October) in between; Windows and Linux builds are marked Alpha', cite: ['augment-intent-release', 'augment-intent-updates', 'augment-intent-prerelease', 'augment-intent-docs'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (Apache 2.0); the iOS app’s code is private for now, and outside pull requests aren’t accepted yet', cite: ['augment-intent-readme', 'augment-intent-docs', 'augment-intent-contributing'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free, iOS app included; no paid plans are documented. Model use runs through the provider accounts you sign in with', cite: ['augment-intent-docs', 'augment-intent-app-store'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon and Intel); Windows x64 and Linux x64 and arm64 in Alpha; iPhone and iPad app for iOS and iPadOS 18+', cite: ['augment-intent-docs', 'augment-intent-release', 'augment-intent-app-store'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Auggie, Claude Code, Antigravity, Grok Build, Codex, OpenCode, Pi and Unsloth, mixed per workspace; Droid and Cortex are hidden by default', cite: ['augment-intent-docs', 'augment-intent-home', 'augment-intent-providers'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each CLI’s ACP mode or a pinned npx adapter, run by the daemon over stdio; the Antigravity bridge Intent installs is limited to Apple silicon Macs', cite: ['augment-intent-architecture', 'augment-intent-providers', 'augment-intent-antigravity'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'You sign in to each provider with your own account; turns stopped by usage limits can retry on another provider', cite: ['augment-intent-docs', 'augment-intent-readme'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'No Intent account appears in the setup steps; the iOS app needs none, and all state stays on your machine', cite: ['augment-intent-docs', 'augment-intent-app-store', 'augment-intent-readme'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'In source, the daemon approves tool requests by default; prompts that wait for you need INTENTD_PERMISSION_POLICY=interactive', mark: 'partial', cite: ['augment-intent-intentd-main', 'augment-intent-permission-flow'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Add any MCP server globally or per workspace; Intent also hands agents its own workspace_api tool', mark: 'yes', cite: ['augment-intent-docs', 'augment-intent-architecture'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A worktree and branch per workspace, shared by its agents, or the folder itself; opt-in per-agent copy-on-write sandboxes are being retired', mark: 'yes', cite: ['augment-intent-docs', 'augment-intent-architecture', 'augment-intent-ui-strings', 'augment-intent-agent-ops-tests'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Per-workspace setup scripts with path and branch variables, plus saved build, test and service commands; no port allocation is documented', mark: 'yes', cite: ['augment-intent-docs', 'augment-intent-ui-strings'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'A Coordinator plans in a living spec and delegates tasks to parallel Implementors, checked by a Verifier; the default is one Developer agent', mark: 'yes', cite: ['augment-intent-docs'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Home sorts workspaces under Needs you, Running and Done & idle, with a Fleet HUD overview; agents ask multiple-choice questions inline', mark: 'yes', cite: ['augment-intent-docs'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'A browser panel per workspace that agents drive for end-to-end tests, taking screenshots and checking layout, accessibility and console errors', mark: 'yes', cite: ['augment-intent-docs'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Changes panel with side-by-side diffs; accepting commits, rejecting asks the agent for fixes or undoes; a PR Reviewer specialist reviews PRs', mark: 'yes', cite: ['augment-intent-docs'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Opens PRs with title, description and target branch prefilled or generated, merges them in the app, or merges into trunk locally', mark: 'yes', cite: ['augment-intent-docs'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'OAuth or token sign-in, with GitHub Enterprise support in the daemon; shows a PR’s merge state, checks and review comments, and agents can act on PR feedback', mark: 'yes', cite: ['augment-intent-docs', 'augment-intent-readme', 'augment-intent-intentd-readme'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'Start workspaces from Linear issues in Home; Sentry can be connected; GitHub issues are marked coming soon; Jira isn’t mentioned', mark: 'yes', cite: ['augment-intent-docs', 'augment-intent-ui-strings'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Run or transfer workspaces on paired machines running intentd, such as VMs or AWS hosts; no Intent-hosted cloud is documented', mark: 'yes', cite: ['augment-intent-docs', 'augment-intent-home', 'augment-intent-readme'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'Free iOS and iPadOS remote control; its App Store description asks for the same local network, while the docs add a Tailcat tunnel', mark: 'yes', cite: ['augment-intent-app-store', 'augment-intent-docs'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'The packaged app checks GitHub Releases for updates and downloads them; settings offer Stable, Beta and Alpha channels or turning updates off', mark: 'yes', cite: ['augment-intent-readme', 'augment-intent-docs', 'augment-intent-ui-strings'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented; imports cover earlier Intent installs, workspace export files and Claude Code agent definitions, not outside sessions', mark: 'unknown', cite: ['augment-intent-ui-strings', 'augment-intent-docs'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'The command palette (Cmd+K) searches notes across workspaces and has a chat messages group; the daemon full-text indexes agent transcripts', mark: 'yes', cite: ['augment-intent-docs', 'augment-intent-ui-strings', 'augment-intent-search-protocol'] } },
				{ label: 'Fork a conversation', splash: S.fork, other: { text: 'Branch a conversation from any message in it', mark: 'yes', cite: ['augment-intent-docs'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Both drive agents over the <strong>Agent Client Protocol</strong> on stdio, with pinned adapters for CLIs that need one. Intent puts this in a separate daemon, <code>intentd</code>, which stores state in SQLite and serves a JSON-RPC API to the desktop and iOS apps, a CLI and other agents. Splash runs agents as child processes of the app or of <code>splash-server</code>.',
			cite: ['augment-intent-architecture', 'augment-intent-providers', 'augment-intent-readme', 'splash-registry', 'acp', 'splash-readme', 'splash-server']
		},
		{
			title: 'One agent or a coordinated team',
			text: 'Intent is built around workspaces where a Coordinator writes a living spec, hands tasks to Implementors working in parallel and has a Verifier check the results, with notes and task blocks as shared context. Its docs note that coordination uses more tokens, and one Developer agent is the default. In Splash each session is one agent in one folder.',
			cite: ['augment-intent-docs', 'splash-readme', 'splash-features']
		},
		{
			title: 'Where agents run',
			text: 'Intent runs agents on your computer or on paired machines running <code>intentd</code>, such as VMs or AWS hosts, and moves workspaces with their notes, chats and repository between them. An iOS app steers it; the frontend also builds from source into a self-hosted browser client. Splash runs agents locally or under <code>splash-server</code>, which one user opens through an SSH tunnel.',
			cite: ['augment-intent-docs', 'augment-intent-home', 'augment-intent-readme', 'augment-intent-fe-readme', 'augment-intent-app-store', 'splash-readme', 'splash-server']
		},
		{
			title: 'License, price and origins',
			text: 'Both are free and open source: Intent under Apache 2.0, though its public repository takes no outside pull requests yet, and Splash under MIT. Intent began as <strong>Intent by Augment</strong>; an Augment Code page last updated in June 2026 describes it as a macOS app that is not open source and uses Augment credits; the current docs, license and releases differ. SHV Labs, which lists Intent among its projects, sells the iOS app.',
			cite: ['augment-intent-readme', 'augment-intent-contributing', 'augment-intent-notice', 'augment-intent-augment-emdash', 'augment-intent-docs', 'augment-intent-release', 'augment-intent-shv-projects', 'augment-intent-app-store', 'splash-license', 'splash-download']
		},
		{
			title: 'Platforms and updates',
			text: 'Intent ships for macOS, with Windows and Linux builds marked Alpha, plus an iOS app; it updates itself from GitHub Releases on a Stable, Beta or Alpha channel, and pre-releases ship between stable versions. Splash builds for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64 plus a headless server, and is updated by downloading a new release from GitHub.',
			cite: ['augment-intent-docs', 'augment-intent-release', 'augment-intent-prerelease', 'augment-intent-readme', 'augment-intent-ui-strings', 'augment-intent-app-store', 'splash-install', 'splash-about']
		}
	],
	fit: {
		splash: [
			'You want Gemini, Copilot, Goose and other agents alongside Claude Code and Codex, each in its own session.',
			'You want permission requests shown in the transcript and gathered in one Needs attention queue.',
			'You want to import conversations your agents started outside the app and search them with the rest.',
			'You want one view of GitHub issues, pull requests and Actions runs across your repositories.'
		],
		other: [
			'You want a Coordinator to turn a spec into tasks for parallel agents, with a Verifier checking the work.',
			'You want to create and merge pull requests and start workspaces from Linear issues in the same app.',
			'You want setup scripts per workspace, a browser your agents can test in, and an app that updates itself.',
			'You want an iOS app and remote machines you can move workspaces between.'
		]
	},
	sources: [
		{ id: 'augment-intent-home', title: 'Intent', url: 'https://intentapp.dev/', publisher: 'Intent', checked: '2026-10-10' },
		{ id: 'augment-intent-docs', title: 'Docs', url: 'https://intentapp.dev/docs', publisher: 'Intent', checked: '2026-10-10' },
		{ id: 'augment-intent-updates', title: 'Updates', url: 'https://intentapp.dev/updates', publisher: 'Intent', checked: '2026-10-10' },
		{ id: 'augment-intent-readme', title: 'README.md', url: 'https://github.com/intent-hq/intent/blob/main/README.md', publisher: 'intent-hq/intent on GitHub', checked: '2026-10-10' },
		{ id: 'augment-intent-architecture', title: 'Architecture', url: 'https://github.com/intent-hq/intent/blob/main/docs/ARCHITECTURE.md', publisher: 'intent-hq/intent on GitHub', checked: '2026-10-10' },
		{ id: 'augment-intent-contributing', title: 'CONTRIBUTING.md', url: 'https://github.com/intent-hq/intent/blob/main/CONTRIBUTING.md', publisher: 'intent-hq/intent on GitHub', checked: '2026-10-10' },
		{ id: 'augment-intent-notice', title: 'NOTICE', url: 'https://github.com/intent-hq/intent/blob/main/NOTICE', publisher: 'intent-hq/intent on GitHub', checked: '2026-10-10' },
		{ id: 'augment-intent-permission-flow', title: 'Permission flow (protocol §8)', url: 'https://github.com/intent-hq/intent/blob/main/docs/protocol/08-permission-flow.md', publisher: 'intent-hq/intent on GitHub', checked: '2026-10-10' },
		{ id: 'augment-intent-search-protocol', title: 'search.* and drafts.* methods', url: 'https://github.com/intent-hq/intent/blob/main/docs/protocol/methods/search-drafts.md', publisher: 'intent-hq/intent on GitHub', checked: '2026-10-10' },
		{ id: 'augment-intent-intentd-readme', title: 'README.md', url: 'https://github.com/intent-hq/intentd/blob/main/README.md', publisher: 'intent-hq/intentd on GitHub', checked: '2026-10-10' },
		{ id: 'augment-intent-providers', title: 'crates/intent-providers/src/config.rs', url: 'https://github.com/intent-hq/intentd/blob/main/crates/intent-providers/src/config.rs', publisher: 'intent-hq/intentd on GitHub', checked: '2026-10-10' },
		{ id: 'augment-intent-antigravity', title: 'crates/intent-providers/src/antigravity.rs', url: 'https://github.com/intent-hq/intentd/blob/main/crates/intent-providers/src/antigravity.rs', publisher: 'intent-hq/intentd on GitHub', checked: '2026-10-10' },
		{ id: 'augment-intent-intentd-main', title: 'crates/intentd/src/main.rs', url: 'https://github.com/intent-hq/intentd/blob/main/crates/intentd/src/main.rs', publisher: 'intent-hq/intentd on GitHub', checked: '2026-10-10' },
		{ id: 'augment-intent-agent-ops-tests', title: 'crates/intent-services/src/agent_ops/tests.rs', url: 'https://github.com/intent-hq/intentd/blob/main/crates/intent-services/src/agent_ops/tests.rs', publisher: 'intent-hq/intentd on GitHub', checked: '2026-10-10' },
		{ id: 'augment-intent-fe-readme', title: 'README.md', url: 'https://github.com/intent-hq/cloudlands-fe/blob/main/README.md', publisher: 'intent-hq/cloudlands-fe on GitHub', checked: '2026-10-10' },
		{ id: 'augment-intent-ui-strings', title: 'messages/en.json', url: 'https://github.com/intent-hq/cloudlands-fe/blob/main/messages/en.json', publisher: 'intent-hq/cloudlands-fe on GitHub', checked: '2026-10-10' },
		{ id: 'augment-intent-release', title: 'Intent v2.212.1', url: 'https://github.com/intent-hq/cloudlands-releases/releases/tag/v2.212.1', publisher: 'intent-hq/cloudlands-releases on GitHub', checked: '2026-10-10' },
		{ id: 'augment-intent-prerelease', title: 'Intent v2.215.0', url: 'https://github.com/intent-hq/cloudlands-releases/releases/tag/v2.215.0', publisher: 'intent-hq/cloudlands-releases on GitHub', checked: '2026-10-10' },
		{ id: 'augment-intent-shv-projects', title: 'Projects', url: 'https://labs.shv.com/projects', publisher: 'SHV Labs', checked: '2026-10-10' },
		{ id: 'augment-intent-app-store', title: 'Intent Mobile', url: 'https://apps.apple.com/us/app/intent-mobile/id6806514581', publisher: 'Apple App Store', checked: '2026-10-10' },
		{ id: 'augment-intent-augment-emdash', title: 'Emdash vs Intent (2026): Open-Source ADE or Paid Platform?', url: 'https://www.augmentcode.com/tools/emdash-vs-intent', publisher: 'Augment Code', checked: '2026-10-10' }
	]
};
