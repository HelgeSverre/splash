// Splash vs Sculptor. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const SCULPTOR: Comparison = {
	slug: 'sculptor',
	name: 'Sculptor',
	description: 'How Splash and Sculptor compare on agents, platforms, pricing, worktrees, review and pull requests, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Sculptor are open-source desktop apps that run several coding agents at once and can give each its own git worktree. Sculptor, for macOS and Linux, integrates Claude Code and Pi as chats and runs other CLI agents in a terminal. Splash, for macOS, Windows and Ubuntu, drives every agent over the Agent Client Protocol.',
	other: {
		name: 'Sculptor',
		url: 'https://imbue.com/product/sculptor',
		maker: 'Imbue',
		summary: 'An open-source desktop app that runs several coding agents side by side, each in a git worktree by default. Claude Code and Pi run as chats; other CLI agents run in a terminal.',
		cite: ['sculptor-home', 'sculptor-readme', 'sculptor-workspaces-help']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Electron desktop app over a local Python backend, plus a sculpt CLI that drives workspaces and agents from scripts or CI', cite: ['sculptor-spec'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v0.48.0 (21 September 2026); its README calls it an experimental research preview, and SECURITY.md an active beta', cite: ['sculptor-release-0-48-0', 'sculptor-readme', 'sculptor-security'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (MIT); the README says Imbue can’t yet take on many outside contributions', cite: ['sculptor-license', 'sculptor-home', 'sculptor-readme'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free; you pay your model provider, and Claude agents need a paid Claude or Claude Max plan', cite: ['sculptor-home'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon) and Linux x64; Linux arm64 builds don’t block a release. No Windows, Intel Mac or mobile builds', cite: ['sculptor-home', 'sculptor-readme', 'sculptor-spec'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code and Pi as chats; Claude Code’s TUI and any CLI agent you register run in a terminal', cite: ['sculptor-readme', 'sculptor-spec'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Claude Code over stream-json, respawned each turn with --resume; Pi in RPC mode; other CLIs in a terminal (PTY)', cite: ['sculptor-harnesses-help', 'sculptor-process-utils', 'sculptor-process-manager', 'sculptor-spec'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Your Claude plan via the Claude CLI, which Sculptor can install and log in; Pi takes API keys or provider logins', cite: ['sculptor-home', 'sculptor-getting-started', 'sculptor-spec', 'sculptor-settings-help'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'Optional: onboarding offers an Imbue account or Continue without an account; continuing either way accepts Imbue’s terms', cite: ['sculptor-spec', 'sculptor-welcome-step'] } },
				{ label: 'Model and mode pickers', splash: S.models, other: { text: 'Claude models for Claude agents; Pi agents pick from providers such as Anthropic, OpenAI, Google and OpenRouter, mid-session too', mark: 'yes', cite: ['sculptor-spec', 'sculptor-provider-catalog', 'sculptor-home'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Claude’s tool permissions are auto-approved, so no per-tool prompts; questions and plan approvals open Sculptor’s own panels', mark: 'no', cite: ['sculptor-harnesses-help', 'sculptor-process-utils', 'sculptor-spec'] } },
				{
					label: 'Extensions and skills',
					hint: 'Add-ons to the app or its agents',
					splash: { text: 'Settings lists each agent’s skills, commands and MCP servers, read-only; slash commands complete as you type', mark: 'partial', cite: ['splash-features'] },
					other: { text: 'JavaScript extensions add panels, widgets, home views and overlays; bundled workflow skills, plus yours from ~/.claude and the repo', mark: 'yes', cite: ['sculptor-extensions-help', 'sculptor-security', 'sculptor-skills-help'] }
				}
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A git worktree and branch per workspace; clone and in-place modes are experimental. Agents in one workspace share its files', mark: 'yes', cite: ['sculptor-workspaces-help', 'sculptor-agents-help', 'sculptor-spec'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'A per-repo setup command runs on workspace creation and .env files load; the docs suggest the terminal for dev servers', mark: 'yes', cite: ['sculptor-workspaces-help', 'sculptor-terminal-help'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Status dots on workspaces and agents, including waiting on a question or plan approval, plus unread markers and a hover peek', mark: 'yes', cite: ['sculptor-spec'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'The bundled workflow runs each stage, spec through review, as its own agent; experimental skills hand work to a fresh agent', mark: 'partial', cite: ['sculptor-skills-help', 'sculptor-spec'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'Experimental Browser panel beside the chat in the desktop app, for previews such as a local dev server', mark: 'partial', cite: ['sculptor-spec'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Per-file diffs, side by side or unified; feedback goes to the agent in chat. Line comments aren’t documented', mark: 'yes', cite: ['sculptor-changes-help', 'sculptor-spec'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Create PR pushes the branch and opens a GitHub PR through gh; the agent writes commit messages. In-app merging isn’t documented', mark: 'yes', cite: ['sculptor-changes-help', 'sculptor-pull-requests-help'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'PR state, approvals, unresolved comments and CI on GitHub repos; an experimental CI Babysitter sends agents to fix failures', mark: 'yes', cite: ['sculptor-pull-requests-help', 'sculptor-spec', 'sculptor-ci-babysitter'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'Linear, via a bundled extension: linked issues, a board and workspaces from tickets. Jira and GitHub Issues aren’t documented', mark: 'yes', cite: ['sculptor-extensions-help', 'sculptor-release-0-44-0'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'An experimental custom backend moves Sculptor’s backend into Docker, a VM or a server over SSH; an OpenHost manifest covers self-hosting', mark: 'partial', cite: ['sculptor-spec', 'sculptor-competitors', 'sculptor-openhost'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'No native app, and the FAQ lists no mobile support; 0.44.0 added an experimental mobile web layout', mark: 'partial', cite: ['sculptor-home', 'sculptor-release-0-44-0'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Updates itself in place from the Stable or Latest release channel', mark: 'yes', cite: ['sculptor-settings-help', 'sculptor-spec'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented; Sculptor keeps its own workspaces and conversations in SQLite and restores them after a quit or crash', mark: 'unknown', cite: ['sculptor-spec', 'sculptor-database'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Search within one agent’s transcript (Cmd/Ctrl+Shift+F) and filter workspaces by name, branch or project; cross-session search isn’t documented', mark: 'partial', cite: ['sculptor-spec', 'sculptor-scenarios'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Sculptor runs the Claude Code CLI over stream-json, starting a new process each turn and resuming with <code>--resume</code>, and runs Pi in RPC mode. Other CLI agents run in a terminal and can report status by calling <code>sculpt signal</code>. Its docs and source don’t mention ACP. Splash connects to every agent over the <strong>Agent Client Protocol</strong>.',
			cite: ['sculptor-harnesses-help', 'sculptor-process-manager', 'sculptor-spec', 'splash-registry', 'acp']
		},
		{
			title: 'Models, sign-in and price',
			text: 'Both are free and MIT-licensed. Sculptor requires the Claude CLI and git at setup, and its Claude agents need a paid Claude plan; Pi adds other providers, including OpenAI and ChatGPT (Codex) logins, while the spec names no separate Codex harness. Splash runs the agent CLIs you install and sign in to yourself.',
			cite: ['sculptor-license', 'sculptor-home', 'sculptor-spec', 'sculptor-provider-catalog', 'splash-license', 'splash-download', 'splash-agents']
		},
		{
			title: 'Platforms and where it runs',
			text: 'Sculptor ships for Apple silicon Macs and Linux x64, with Linux arm64 builds that don’t block a release, and updates itself. It runs locally; an experimental custom backend can move it into Docker, a VM or a remote server. Splash builds for macOS (Apple silicon and Intel), Windows 11 and Ubuntu, plus <code>splash-server</code>, which you reach through an SSH tunnel.',
			cite: ['sculptor-home', 'sculptor-readme', 'sculptor-spec', 'sculptor-settings-help', 'splash-install', 'splash-server']
		},
		{
			title: 'Around the session',
			text: 'Sculptor works from a Linear ticket to a pull request: a setup command per repo, Commit and Create PR buttons, PR and CI status, and bundled workflow skills that run each stage as its own agent. Splash centers on the conversations: permission prompts in the transcript, a <strong>Needs attention</strong> queue, cross-session search and imported agent history.',
			cite: ['sculptor-extensions-help', 'sculptor-release-0-44-0', 'sculptor-workspaces-help', 'sculptor-changes-help', 'sculptor-pull-requests-help', 'sculptor-skills-help', 'splash-features', 'splash-history']
		},
		{
			title: 'Approvals and trust',
			text: 'Sculptor runs Claude chat agents with tool permissions auto-approved and shows their questions and plan approvals in panels of its own. Setting up a workspace runs the repo’s setup command and its <code>.env</code>. Splash shows each permission request in the transcript, answered with the 1–9 keys, and keeps pending ones in <strong>Needs attention</strong>.',
			cite: ['sculptor-harnesses-help', 'sculptor-process-utils', 'sculptor-security', 'splash-features']
		}
	],
	fit: {
		splash: [
			'You work on Windows or an Intel Mac, or want to run sessions on your own server over SSH.',
			'You want Codex, Gemini, Copilot and other agents in one chat view, all over the Agent Client Protocol.',
			'You want to answer each permission request yourself, with pending ones gathered in one queue.',
			'You want to import conversations your agents started outside the app and search across all your sessions.'
		],
		other: [
			'You want a setup command per repo, plus commits and pull requests created and tracked from the app.',
			'You want Linear tickets on a board and an experimental babysitter that sends agents to fix failing CI.',
			'You want to extend the app with JavaScript panels and widgets, or run a bundled spec-to-review workflow.',
			'You want Pi’s choice of model providers alongside Claude Code, or a sculpt CLI for scripts and CI.'
		]
	},
	sources: [
		{ id: 'sculptor-home', title: 'Sculptor: The extensible, parallel coding workspace you own', url: 'https://imbue.com/product/sculptor', publisher: 'Imbue', checked: '2026-10-10' },
		{ id: 'sculptor-readme', title: 'README.md', url: 'https://github.com/imbue-ai/sculptor/blob/main/README.md', publisher: 'imbue-ai/sculptor on GitHub', checked: '2026-10-10' },
		{ id: 'sculptor-spec', title: 'Sculptor — Product Specification', url: 'https://github.com/imbue-ai/sculptor/blob/main/docs/specs/SPEC.md', publisher: 'imbue-ai/sculptor on GitHub', checked: '2026-10-10' },
		{ id: 'sculptor-scenarios', title: 'docs/specs/scenarios.md', url: 'https://github.com/imbue-ai/sculptor/blob/main/docs/specs/scenarios.md', publisher: 'imbue-ai/sculptor on GitHub', checked: '2026-10-10' },
		{ id: 'sculptor-license', title: 'LICENSE.md', url: 'https://github.com/imbue-ai/sculptor/blob/main/LICENSE.md', publisher: 'imbue-ai/sculptor on GitHub', checked: '2026-10-10' },
		{ id: 'sculptor-security', title: 'Security', url: 'https://github.com/imbue-ai/sculptor/blob/main/SECURITY.md', publisher: 'imbue-ai/sculptor on GitHub', checked: '2026-10-10' },
		{ id: 'sculptor-release-0-48-0', title: 'Release sculptor-v0.48.0', url: 'https://github.com/imbue-ai/sculptor/releases/tag/sculptor-v0.48.0', publisher: 'imbue-ai/sculptor on GitHub', checked: '2026-10-10' },
		{ id: 'sculptor-release-0-44-0', title: 'Release sculptor-v0.44.0', url: 'https://github.com/imbue-ai/sculptor/releases/tag/sculptor-v0.44.0', publisher: 'imbue-ai/sculptor on GitHub', checked: '2026-10-10' },
		{ id: 'sculptor-getting-started', title: 'Getting Started', url: 'https://github.com/imbue-ai/sculptor/blob/main/docs/help/getting_started.md', publisher: 'imbue-ai/sculptor on GitHub', checked: '2026-10-10' },
		{ id: 'sculptor-settings-help', title: 'Settings', url: 'https://github.com/imbue-ai/sculptor/blob/main/docs/help/settings.md', publisher: 'imbue-ai/sculptor on GitHub', checked: '2026-10-10' },
		{ id: 'sculptor-harnesses-help', title: 'Integrated Harnesses', url: 'https://github.com/imbue-ai/sculptor/blob/main/docs/help/integrated_harnesses.md', publisher: 'imbue-ai/sculptor on GitHub', checked: '2026-10-10' },
		{ id: 'sculptor-process-utils', title: 'claude_code_sdk/process_manager_utils.py', url: 'https://github.com/imbue-ai/sculptor/blob/main/sculptor/sculptor/agents/default/claude_code_sdk/process_manager_utils.py', publisher: 'imbue-ai/sculptor on GitHub', checked: '2026-10-10' },
		{ id: 'sculptor-process-manager', title: 'claude_code_sdk/process_manager.py', url: 'https://github.com/imbue-ai/sculptor/blob/main/sculptor/sculptor/agents/default/claude_code_sdk/process_manager.py', publisher: 'imbue-ai/sculptor on GitHub', checked: '2026-10-10' },
		{ id: 'sculptor-provider-catalog', title: 'pi_agent/provider_catalog.py', url: 'https://github.com/imbue-ai/sculptor/blob/main/sculptor/sculptor/agents/pi_agent/provider_catalog.py', publisher: 'imbue-ai/sculptor on GitHub', checked: '2026-10-10' },
		{ id: 'sculptor-welcome-step', title: 'onboarding/WelcomeStep.tsx', url: 'https://github.com/imbue-ai/sculptor/blob/main/sculptor/frontend/src/pages/onboarding/WelcomeStep.tsx', publisher: 'imbue-ai/sculptor on GitHub', checked: '2026-10-10' },
		{ id: 'sculptor-extensions-help', title: 'Extensions', url: 'https://github.com/imbue-ai/sculptor/blob/main/docs/help/extensions.md', publisher: 'imbue-ai/sculptor on GitHub', checked: '2026-10-10' },
		{ id: 'sculptor-skills-help', title: 'Skills', url: 'https://github.com/imbue-ai/sculptor/blob/main/docs/help/skills.md', publisher: 'imbue-ai/sculptor on GitHub', checked: '2026-10-10' },
		{ id: 'sculptor-workspaces-help', title: 'Workspaces', url: 'https://github.com/imbue-ai/sculptor/blob/main/docs/help/workspaces.md', publisher: 'imbue-ai/sculptor on GitHub', checked: '2026-10-10' },
		{ id: 'sculptor-agents-help', title: 'Agents', url: 'https://github.com/imbue-ai/sculptor/blob/main/docs/help/agents.md', publisher: 'imbue-ai/sculptor on GitHub', checked: '2026-10-10' },
		{ id: 'sculptor-terminal-help', title: 'Terminal', url: 'https://github.com/imbue-ai/sculptor/blob/main/docs/help/terminal.md', publisher: 'imbue-ai/sculptor on GitHub', checked: '2026-10-10' },
		{ id: 'sculptor-changes-help', title: 'Changes', url: 'https://github.com/imbue-ai/sculptor/blob/main/docs/help/changes.md', publisher: 'imbue-ai/sculptor on GitHub', checked: '2026-10-10' },
		{ id: 'sculptor-pull-requests-help', title: 'Pull Requests', url: 'https://github.com/imbue-ai/sculptor/blob/main/docs/help/pull_requests.md', publisher: 'imbue-ai/sculptor on GitHub', checked: '2026-10-10' },
		{ id: 'sculptor-ci-babysitter', title: 'CI Babysitter', url: 'https://github.com/imbue-ai/sculptor/blob/main/docs/help/ci_babysitter.md', publisher: 'imbue-ai/sculptor on GitHub', checked: '2026-10-10' },
		{ id: 'sculptor-competitors', title: 'Competitors', url: 'https://github.com/imbue-ai/sculptor/blob/main/docs/competitors.md', publisher: 'imbue-ai/sculptor on GitHub', checked: '2026-10-10' },
		{ id: 'sculptor-openhost', title: 'openhost.toml', url: 'https://github.com/imbue-ai/sculptor/blob/main/openhost.toml', publisher: 'imbue-ai/sculptor on GitHub', checked: '2026-10-10' },
		{ id: 'sculptor-database', title: 'Database', url: 'https://github.com/imbue-ai/sculptor/blob/main/docs/development/database.md', publisher: 'imbue-ai/sculptor on GitHub', checked: '2026-10-10' }
	]
};
