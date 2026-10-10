// Splash vs Shepherd. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const SHEPHERD_TERMINAL: Comparison = {
	slug: 'shepherd-terminal',
	name: 'Shepherd',
	description: 'How Splash and Shepherd compare on agents, platforms, pricing, terminals, review and remote use, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Shepherd both run coding agents side by side on the desktop. Shepherd runs Codex and Claude Code as their own CLIs in terminal panes that a background service keeps alive, with an iPhone and iPad companion. Splash drives agents over the Agent Client Protocol, each session in its folder or a git worktree.',
	other: {
		name: 'Shepherd',
		url: 'https://shepherd.kotoro.click/',
		maker: 'Junseo Ko',
		summary: 'A macOS app for Apple silicon that runs Codex and Claude Code in persistent terminal tabs and panes, with an agent monitor, diffs, a browser review tool and an iOS companion.',
		cite: ['shepherd-terminal-home', 'shepherd-terminal-docs', 'shepherd-terminal-app-store']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Mac desktop app (Shepherd Terminal) with a background service that keeps sessions running, plus Shepherd Mobile for iPhone and iPad', cite: ['shepherd-terminal-home', 'shepherd-terminal-privacy', 'shepherd-terminal-app-store'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'Desktop 0.5.6 in its September 2026 guides; the maker launched it as a public beta in August 2026. iOS app 1.0.28 (5 October 2026)', cite: ['shepherd-terminal-workflow-guide', 'shepherd-terminal-product-hunt', 'shepherd-terminal-app-store-data'] } },
				{ label: 'License', splash: S.license, other: { text: 'Closed source: no license is stated and no source repository is public; the iOS app uses Apple’s standard EULA', cite: ['shepherd-terminal-home', 'shepherd-terminal-app-store'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free on Mac, with Enterprise on request; Shepherd Mobile is free, and Shepherd Pro costs $4.99 a month or $24.99 a year', cite: ['shepherd-terminal-pricing', 'shepherd-terminal-home', 'shepherd-terminal-app-store'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'Apple silicon Macs (macOS 14+ per the maker); iPhone and iPad on iOS 15.1+. No Intel, Windows or Linux desktop build listed', cite: ['shepherd-terminal-home', 'shepherd-terminal-herdr', 'shepherd-terminal-product-hunt', 'shepherd-terminal-app-store'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Codex and Claude Code; monitoring, history, resume and the MCP skills are described for those two, and no other agent is named', cite: ['shepherd-terminal-home', 'shepherd-terminal-workflow-guide'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each agent’s own installed CLI, started in a Shepherd terminal tab or pane; the docs name neither ACP nor an SDK', cite: ['shepherd-terminal-browser-review', 'shepherd-terminal-terminal-control', 'shepherd-terminal-home'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'You install and sign in to the Codex or Claude Code CLI yourself; providers bill their own usage', cite: ['shepherd-terminal-terminal-control', 'shepherd-terminal-pricing'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'No Shepherd account is described; Shepherd Mobile purchases go through your Apple ID', cite: ['shepherd-terminal-privacy', 'shepherd-terminal-app-store'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Answered in the agent’s own terminal, with the Agent Monitor flagging a session that needs you; no separate approval UI is documented', mark: 'yes', cite: ['shepherd-terminal-home'] } },
				{ label: 'MCP servers', hint: 'What each app does with MCP', splash: S.mcp, other: { text: 'The Shepherd plugin gives Codex and Claude Code MCP tools to open panes, send input, read output and ask you for review', mark: 'yes', cite: ['shepherd-terminal-home', 'shepherd-terminal-terminal-control'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A shortcut (⌘Y) opens a terminal at one of the project’s worktrees; creating a worktree or branch per session isn’t documented', mark: 'partial', cite: ['shepherd-terminal-split-panes'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Dev servers run in panes you start and stay up in the background service; Routes forward remote ones. Setup scripts aren’t documented', mark: 'partial', cite: ['shepherd-terminal-split-panes', 'shepherd-terminal-home', 'shepherd-terminal-browser-review'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'The core of the app: tabs and split panes for agents and shells that survive restarts, kept running by a background service', mark: 'yes', cite: ['shepherd-terminal-home'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'The Agent Monitor shows each Codex or Claude Code session as working, needing you or done, also in a floating window over other apps', mark: 'yes', cite: ['shepherd-terminal-home', 'shepherd-terminal-docs'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'Separate Task Done and Agent Done alerts on the Mac; on iOS, agent notifications and Lock Screen Live Activities need Shepherd Pro', mark: 'yes', cite: ['shepherd-terminal-workflow-guide', 'shepherd-terminal-home', 'shepherd-terminal-app-store'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Workflows of Agent, Shell and Data steps, written in YAML or described in words, run on a schedule on your server', mark: 'yes', cite: ['shepherd-terminal-docs', 'shepherd-terminal-home'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'Opens dev server URLs in Shepherd’s browser; Browser Review lets you point at an element and send a comment to the agent', mark: 'yes', cite: ['shepherd-terminal-home', 'shepherd-terminal-docs', 'shepherd-terminal-browser-review'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Agents can use the sheperd-change-review skill to gather edited files into a review; Browser Review sends page-element comments to the agent', mark: 'yes', cite: ['shepherd-terminal-workflow-guide', 'shepherd-terminal-docs'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'Previews workspace files (Markdown or code) beside the terminal and shows each changed file’s diff; editing isn’t documented', mark: 'partial', cite: ['shepherd-terminal-docs'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Not documented; the docs describe no pull request, merge or CI view', mark: 'unknown', cite: ['shepherd-terminal-docs', 'shepherd-terminal-pricing'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'Nothing hosted: agents run on your Mac or SSH servers you connect. An optional Shepherd relay handles notifications and Live Activities', mark: 'no', cite: ['shepherd-terminal-pricing', 'shepherd-terminal-home', 'shepherd-terminal-app-store'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'Works on a server over SSH as on the Mac, including remote files; Routes bring its localhost services to the Mac', mark: 'yes', cite: ['shepherd-terminal-home', 'shepherd-terminal-ghostty'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'Shepherd Mobile (iPhone, iPad) opens the same sessions on a Mac or Linux host: live terminal, prompts, Git changes, history and resume', mark: 'yes', cite: ['shepherd-terminal-app-store'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Agent History resumes past Codex and Claude Code conversations in a new terminal, per project; importing outside ones isn’t documented', mark: 'partial', cite: ['shepherd-terminal-docs', 'shepherd-terminal-workflow-guide', 'shepherd-terminal-context'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Not documented', mark: 'unknown', cite: ['shepherd-terminal-docs', 'shepherd-terminal-context'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Shepherd starts Codex and Claude Code as their own CLIs in its terminal panes, and the <strong>Shepherd plugin</strong> gives them MCP tools and skills to open panes, read output and ask for review. Its docs name neither ACP nor an SDK, nor how agent status is detected. Splash speaks the <strong>Agent Client Protocol</strong> with every agent and renders its transcript.',
			cite: ['shepherd-terminal-browser-review', 'shepherd-terminal-home', 'shepherd-terminal-terminal-control', 'shepherd-terminal-monitoring', 'splash-readme', 'splash-registry', 'acp']
		},
		{
			title: 'Where sessions live',
			text: 'Shepherd keeps terminals, agents and dev servers in a background service, so quitting the window leaves them running; it also works on servers over SSH, and Shepherd Mobile reaches the same sessions. Splash runs agents as child processes on your computer, or under <code>splash-server</code> on a machine you open in a browser through an SSH tunnel.',
			cite: ['shepherd-terminal-home', 'shepherd-terminal-app-store', 'splash-readme', 'splash-server']
		},
		{
			title: 'Platforms, price and license',
			text: 'Shepherd’s desktop app is free and built for Apple silicon Macs. Shepherd Mobile for iPhone and iPad is free, with a <strong>Shepherd Pro</strong> subscription for several machines, Live Activities, agent notifications and iCloud sync. No license is stated and the source isn’t public. Splash is free and MIT-licensed, builds for macOS, Windows and Ubuntu, and has no phone app.',
			cite: ['shepherd-terminal-pricing', 'shepherd-terminal-herdr', 'shepherd-terminal-app-store', 'splash-download', 'splash-license', 'splash-install']
		},
		{
			title: 'What surrounds the agent',
			text: 'Shepherd is built around the terminal: split panes for agents, shells and dev servers, a browser with element-level review, an Agent Monitor and scheduled workflows of agent, shell and data steps. Splash is built around the conversation: an optional git worktree per session, a <strong>Needs attention</strong> queue, a review screen, transcript search, history import and a GitHub view.',
			cite: ['shepherd-terminal-home', 'shepherd-terminal-docs', 'splash-features', 'splash-history', 'splash-github']
		}
	],
	fit: {
		splash: [
			'You want Gemini, Copilot, Goose or other agents alongside Claude Code and Codex, each in a rendered transcript.',
			'You want each session in its own git worktree, created for you on its own branch.',
			'You work on Windows, Ubuntu or an Intel Mac, or want MIT-licensed open source.',
			'You want to search saved transcripts, import outside conversations and triage GitHub issues and pull requests.'
		],
		other: [
			'You want Codex and Claude Code in their own terminal interfaces, in panes that keep running after you close the window.',
			'You want to follow and answer your agents from an iPhone or iPad, with Lock Screen Live Activities.',
			'You want a built-in browser where you point at a page element and send feedback to the agent.',
			'You want scheduled workflows of agent, shell and data steps that run on your own server.'
		]
	},
	sources: [
		{ id: 'shepherd-terminal-home', title: 'Shepherd — The workspace for coding agents', url: 'https://shepherd.kotoro.click/', publisher: 'Shepherd', checked: '2026-10-10' },
		{ id: 'shepherd-terminal-docs', title: 'Shepherd Docs', url: 'https://shepherd.kotoro.click/docs/', publisher: 'Shepherd', checked: '2026-10-10' },
		{ id: 'shepherd-terminal-pricing', title: 'Pricing — Free to use', url: 'https://shepherd.kotoro.click/pricing/', publisher: 'Shepherd', checked: '2026-10-10' },
		{ id: 'shepherd-terminal-privacy', title: 'Privacy Policy — Shepherd SSH', url: 'https://shepherd.kotoro.click/privacy/', publisher: 'Shepherd', checked: '2026-10-10' },
		{ id: 'shepherd-terminal-workflow-guide', title: 'Monitor and Resume Coding Agents in Shepherd', url: 'https://shepherd.kotoro.click/blog/shepherd-agent-workflow-guide/', publisher: 'Shepherd', checked: '2026-10-10' },
		{ id: 'shepherd-terminal-browser-review', title: 'Browser Review with MCP and Skills in Shepherd', url: 'https://shepherd.kotoro.click/blog/shepherd-browser-review-guide/', publisher: 'Shepherd', checked: '2026-10-10' },
		{ id: 'shepherd-terminal-terminal-control', title: 'Control Shepherd Terminals with MCP and Skills', url: 'https://shepherd.kotoro.click/blog/shepherd-terminal-control-guide/', publisher: 'Shepherd', checked: '2026-10-10' },
		{ id: 'shepherd-terminal-split-panes', title: 'Split Terminal Panes and Navigate Workspaces in Shepherd', url: 'https://shepherd.kotoro.click/blog/shepherd-split-panes-guide/', publisher: 'Shepherd', checked: '2026-10-10' },
		{ id: 'shepherd-terminal-monitoring', title: 'How We Built Agent Monitoring Around Human Attention', url: 'https://shepherd.kotoro.click/blog/how-shepherd-monitors-coding-agents/', publisher: 'Shepherd', checked: '2026-10-10' },
		{ id: 'shepherd-terminal-context', title: 'Why an AI Coding Workspace Needs to Remember More Than Chat', url: 'https://shepherd.kotoro.click/blog/why-agent-workspaces-need-context/', publisher: 'Shepherd', checked: '2026-10-10' },
		{ id: 'shepherd-terminal-herdr', title: 'Herdr Alternatives for Persistent Agent Sessions', url: 'https://shepherd.kotoro.click/blog/herdr-alternatives/', publisher: 'Shepherd', checked: '2026-10-10' },
		{ id: 'shepherd-terminal-ghostty', title: 'Ghostty + tmux vs Shepherd for Remote Development', url: 'https://shepherd.kotoro.click/blog/ghostty-tmux-vs-shepherd/', publisher: 'Shepherd', checked: '2026-10-10' },
		{ id: 'shepherd-terminal-app-store', title: 'Shepherd Mobile', url: 'https://apps.apple.com/us/app/shepherd-mobile/id6806755577', publisher: 'Apple App Store', checked: '2026-10-10' },
		{ id: 'shepherd-terminal-app-store-data', title: 'Shepherd Mobile App Store listing data', url: 'https://itunes.apple.com/lookup?id=6806755577', publisher: 'Apple', checked: '2026-10-10' },
		{ id: 'shepherd-terminal-product-hunt', title: 'Shepherd Terminal: A persistent terminal for Codex and Claude', url: 'https://www.producthunt.com/products/shepherd-terminal-designed-for-agent', publisher: 'Product Hunt', checked: '2026-10-10' }
	]
};
