// Splash vs Shikigami. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const SHIKIGAMI: Comparison = {
	slug: 'shikigami',
	name: 'Shikigami',
	description: 'How Splash and Shikigami compare on agents, platforms, license, worktrees, editing and review, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Shikigami are free desktop apps that run several coding agents at once, each in the project folder or a git worktree. Shikigami, a closed-source Electron app, runs the Claude Code, Codex and opencode CLIs in terminals beside an editor. Splash, an open-source Rust app, drives agents over the Agent Client Protocol and shows their work as a transcript.',
	other: {
		name: 'Shikigami',
		url: 'https://shikigami.dev/',
		maker: 'Igor Nastarowicz',
		summary: 'A free, closed-source desktop app from one developer that runs Claude Code, Codex or opencode agents side by side, each in its own terminal and optionally its own git worktree, with a built-in editor.',
		cite: ['shikigami-home', 'shikigami-faq', 'shikigami-harness']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app with a grid of agent terminals and a built-in editor; no CLI, server, web or mobile client is documented', cite: ['shikigami-faq'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'Beta 0.50.0, published 7 October 2026; one developer ships it often and posts release notes on X', cite: ['shikigami-faq', 'shikigami-feed-mac', 'shikigami-feed-linux', 'shikigami-feed-windows', 'shikigami-llms'] } },
				{ label: 'License', splash: S.license, other: { text: 'Closed source with no public repository; the site’s app demo allows personal and internal company use and bars redistribution', cite: ['shikigami-faq', 'shikigami-home'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free with no paid tier; you pay for your own agent CLIs, or nothing with a local model via opencode', cite: ['shikigami-home', 'shikigami-faq'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (signed, Apple silicon and Intel), Windows x64 (installer not yet code-signed) and a Linux AppImage; Linux architecture isn’t stated', cite: ['shikigami-faq', 'shikigami-home', 'shikigami-llms'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Electron with React; the editor is Monaco, and every agent has its own PTY', cite: ['shikigami-faq'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code, OpenAI Codex and opencode, which can use a local Ollama model; adding other agents isn’t documented', cite: ['shikigami-home', 'shikigami-opencode'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each vendor’s CLI runs in a terminal you can see and type into, on a real PTY; ACP isn’t documented', cite: ['shikigami-harness', 'shikigami-home'] } },
				{ label: 'Agent sign-in', splash: S.signIn, other: { text: 'Each agent uses its own CLI login (OAuth or file-based); Shikigami strips API-key, secret and token environment variables before it starts one', cite: ['shikigami-opencode'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'None; there is no account, sign-up or cloud service', cite: ['shikigami-home', 'shikigami-faq'] } },
				{ label: 'Model and mode pickers', splash: S.models, other: { text: 'Model and effort per agent for Claude Code and Codex, also saved as presets; opencode picks its own model, or takes a --model flag from a preset', mark: 'yes', cite: ['shikigami-home', 'shikigami-harness', 'shikigami-opencode'] } },
				{ label: 'Usage and limits', hint: 'Plan limits, context and cost', splash: { text: 'Shows context use and cost when the agent reports them', mark: 'yes', cite: ['splash-features'] }, other: { text: 'A Usage panel tracks Claude and Codex 5-hour and weekly plan limits and each agent’s context in tokens, read from local CLI files; no dollar costs', mark: 'yes', cite: ['shikigami-harness'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Answered in each agent’s own CLI in its terminal; opencode runs with --auto or interactive approval, with no per-tool rules', mark: 'yes', cite: ['shikigami-harness', 'shikigami-opencode'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Per agent, a new git worktree on its own branch or the shared project root; each agent gets a full shell, not a sandbox', mark: 'yes', cite: ['shikigami-harness', 'shikigami-home', 'shikigami-faq'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'Each agent runs in a live terminal you can type into; the site’s app demo also shows a separate terminal dock', mark: 'yes', cite: ['shikigami-harness', 'shikigami-home'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Agents sit as panes in one grid; Claude Code and Codex agents show activity and a done pip, opencode agents show neither', mark: 'partial', cite: ['shikigami-faq', 'shikigami-home', 'shikigami-opencode'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'Desktop notification when a Claude Code or Codex agent ends its turn or needs input; a click opens that session. None for opencode', mark: 'yes', cite: ['shikigami-home', 'shikigami-opencode'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Opt-in delegation over a local MCP server lets agents in a workspace send peers Task, Rework or Blocked requests; opencode can’t send', mark: 'yes', cite: ['shikigami-harness'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'A diff viewer, git history and line blame across a monorepo’s repos, and GPG-signed commits; sending diff comments to agents isn’t documented', mark: 'yes', cite: ['shikigami-home', 'shikigami-faq'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'Monaco editor with a file tree, Markdown preview, split view beside the agents and language features for Python, PHP and TS/JS', mark: 'yes', cite: ['shikigami-faq', 'shikigami-language-support'] } },
				{ label: 'Database and Docker views', splash: { text: 'None; the workbench holds git changes, a file tree, diff and file tabs, and a terminal', mark: 'no', cite: ['splash-features'] }, other: { text: 'Read-only MySQL browsing with saved SQL queries and Redis key inspection, plus a Docker Compose view with service logs, shell access to containers and start/stop', mark: 'yes', cite: ['shikigami-home'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'No PR step is described; the app commits, and the demo’s git menu covers fetch, pull, push, merge and rebase', mark: 'no', cite: ['shikigami-home', 'shikigami-faq'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'No GitHub integration is described; the site’s GitHub links go to the maker’s profile', mark: 'no', cite: ['shikigami-home', 'shikigami-llms'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'No; the site says it isn’t a cloud product, and agents and their worktrees stay on your machine', mark: 'no', cite: ['shikigami-faq'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'No; the site says everything runs locally, and no SSH or remote-machine mode is documented', mark: 'no', cite: ['shikigami-harness', 'shikigami-faq'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented; Shikigami saves its own sessions to resume after a restart, opencode ones if they exited cleanly', mark: 'unknown', cite: ['shikigami-home', 'shikigami-opencode'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Not documented; the editor’s search covers files in the project', mark: 'unknown', cite: ['shikigami-home'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Shikigami starts the vendor’s own CLI for each agent (Claude Code, Codex or opencode) in a terminal you can see and type into, and the CLIs keep their own logins. Splash connects to every agent over the <strong>Agent Client Protocol</strong>, natively or through an adapter, and draws messages, tool calls, diffs and permission requests as a transcript.',
			cite: ['shikigami-harness', 'shikigami-home', 'shikigami-opencode', 'splash-registry', 'acp', 'splash-features']
		},
		{
			title: 'Where agents run',
			text: 'Shikigami is local by design: agents, their worktrees and their shells run on your computer, with no account, cloud service or remote mode. Splash runs agents on your computer too, and <code>splash-server</code> can run sessions on the machine that holds your code, which you open in a browser through an SSH tunnel, for one user.',
			cite: ['shikigami-faq', 'shikigami-harness', 'shikigami-home', 'splash-readme', 'splash-server']
		},
		{
			title: 'License, price and platforms',
			text: 'Shikigami is free and closed source, with no paid tier; the About panel in the site’s app demo permits personal and internal company use. It ships a signed macOS build, a Linux AppImage and a Windows x64 installer that is not code-signed yet. Splash is free and MIT-licensed, with builds for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64.',
			cite: ['shikigami-faq', 'shikigami-home', 'shikigami-llms', 'splash-license', 'splash-download', 'splash-install']
		},
		{
			title: 'Tools around the agents',
			text: 'Shikigami pairs the agent grid with a Monaco editor and code intelligence, git history and blame, GPG-signed commits, read-only MySQL and Redis views, a Docker Compose monitor and a Usage panel for Claude and Codex limits. Splash centers on the transcript: a review screen, a <strong>Needs attention</strong> queue, transcript search, imported agent history and a GitHub triage view.',
			cite: ['shikigami-faq', 'shikigami-language-support', 'shikigami-home', 'shikigami-harness', 'splash-features', 'splash-history', 'splash-github']
		},
		{
			title: 'Agents working together',
			text: 'With delegation turned on, Shikigami gives each agent four MCP tools to find live peers in the same workspace and pass them work; a delegated message sits in the receiver’s prompt for you to send with Enter, unless you enable auto-submit. Splash keeps each session to one agent in one folder, and sessions don’t pass work to each other.',
			cite: ['shikigami-harness', 'splash-readme', 'splash-features']
		}
	],
	fit: {
		splash: [
			'You want every agent driven over the Agent Client Protocol, with messages, tool calls, diffs and permission requests in one transcript.',
			'You want an open-source, MIT-licensed app you can build from source.',
			'You want to import conversations your agents started elsewhere and search them with your saved transcripts.',
			'You want a GitHub triage view of issues, pull requests and Actions runs, or sessions on a server you reach over SSH.'
		],
		other: [
			'You want each agent’s own CLI running in a terminal you can type into, with all agents side by side in one grid.',
			'You want a Monaco editor with code intelligence, git blame and GPG-signed commits next to your agents.',
			'You want agents in a workspace to pass Task, Rework or Blocked requests to each other.',
			'You want to run opencode on a local Ollama model at no cost, and see Claude and Codex plan limits in one panel.'
		]
	},
	sources: [
		{ id: 'shikigami-home', title: 'Shikigami: Run coding agents in parallel', url: 'https://shikigami.dev/', publisher: 'Igor Nastarowicz', checked: '2026-10-10' },
		{ id: 'shikigami-faq', title: 'Shikigami FAQ: parallel AI coding agents, worktrees, and what it costs', url: 'https://shikigami.dev/faq', publisher: 'Igor Nastarowicz', checked: '2026-10-10' },
		{ id: 'shikigami-harness', title: 'Multi-Agent Coding Harness: Claude Code & Codex', url: 'https://shikigami.dev/harness', publisher: 'Igor Nastarowicz', checked: '2026-10-10' },
		{ id: 'shikigami-opencode', title: 'Running opencode in Shikigami with a local model via Ollama', url: 'https://shikigami.dev/docs/opencode', publisher: 'Igor Nastarowicz', checked: '2026-10-10' },
		{ id: 'shikigami-language-support', title: 'Language support in Shikigami: Python, PHP, TypeScript & JavaScript', url: 'https://shikigami.dev/docs/language-support', publisher: 'Igor Nastarowicz', checked: '2026-10-10' },
		{ id: 'shikigami-llms', title: 'Shikigami llms.txt', url: 'https://shikigami.dev/llms.txt', publisher: 'Igor Nastarowicz', checked: '2026-10-10' },
		{ id: 'shikigami-feed-mac', title: 'latest-mac.yml (macOS update feed)', url: 'https://updates.shikigami.dev/latest-mac.yml', publisher: 'Igor Nastarowicz', checked: '2026-10-10' },
		{ id: 'shikigami-feed-linux', title: 'latest-linux.yml (Linux update feed)', url: 'https://updates.shikigami.dev/latest-linux.yml', publisher: 'Igor Nastarowicz', checked: '2026-10-10' },
		{ id: 'shikigami-feed-windows', title: 'latest.yml (Windows update feed)', url: 'https://updates.shikigami.dev/latest.yml', publisher: 'Igor Nastarowicz', checked: '2026-10-10' }
	]
};
