// Splash vs Munder Difflin. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const MUNDER_DIFFLIN: Comparison = {
	slug: 'munder-difflin',
	name: 'Munder Difflin',
	description: 'How Splash and Munder Difflin compare on agents, orchestration, pricing, platforms, worktrees and review, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Munder Difflin both run several coding agents at once from a desktop app. Munder Difflin runs each vendor’s CLI in a terminal, with one orchestrator agent handing out work through a shared task board, inboxes and memory; Splash drives each agent over the Agent Client Protocol as a separate session, in the project folder or a git worktree.',
	other: {
		name: 'Munder Difflin',
		url: 'https://munderdiffl.in/',
		maker: 'Chaitanya Giri',
		summary: 'A desktop app that runs terminal coding agents as an office: one orchestrator agent assigns tasks, and agents share memory, inboxes and a task board. The paid Pro plan brings the Stapler, a floating window for dictation and meeting transcripts, and a sidebar workspace.',
		cite: ['munder-difflin-readme', 'munder-difflin-home']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app running terminal agent CLIs under an orchestrator agent, as a pixel-art office or, with Pro, a sidebar workspace', cite: ['munder-difflin-readme', 'munder-difflin-home'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v0.5.5 (1 October 2026), on a 0.x version line; the README calls it pre-release software', cite: ['munder-difflin-download', 'munder-difflin-release', 'munder-difflin-readme'] } },
				{ label: 'License', splash: S.license, other: { text: 'MIT code, separately licensed pixel art. Recent tags ship installers without source; Pro code like the Stapler isn’t in the public repo', cite: ['munder-difflin-license', 'munder-difflin-readme', 'munder-difflin-release', 'munder-difflin-0-5-3', 'munder-difflin-repo'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free; Pro $20 for 30 days or $200 a year ($150 launch offer ends 10 October 2026); Teams quoted on a call', cite: ['munder-difflin-home', 'munder-difflin-pro', 'munder-difflin-terms'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS universal build (Intel and Apple silicon), Windows 10/11 x64, Linux x86_64 AppImage; no ARM builds listed for Windows or Linux', cite: ['munder-difflin-download', 'munder-difflin-install'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Electron, React and TypeScript, with Pixi.js for the office, xterm.js and node-pty for terminals, and Monaco for the editor', cite: ['munder-difflin-readme', 'munder-difflin-ide'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Twelve CLIs, including Claude Code, Codex, Gemini CLI, Copilot, Cursor and OpenCode, plus any terminal command as a custom agent', cite: ['munder-difflin-home', 'munder-difflin-readme'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each vendor’s own CLI, run through node-pty in a pseudo-terminal; hooks or a proxy report status, except for Kimi, Copilot and Cursor', cite: ['munder-difflin-sdk', 'munder-difflin-readme', 'munder-difflin-providers'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Your existing CLI logins and plans; some engines read API keys saved in Settings, and four can run local models', cite: ['munder-difflin-home', 'munder-difflin-terms', 'munder-difflin-first-hour', 'munder-difflin-mac-mini'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'harnessMD sign-in on 0.5.2, even for Free; the 0.5.5 download page says solo use needs none. Pro adds a license key', cite: ['munder-difflin-first-hour', 'munder-difflin-0-5-2', 'munder-difflin-download', 'munder-difflin-privacy'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Each CLI’s own prompts in its terminal; auto mode, on by default per the 0.5.2 guide, passes each CLI’s skip-approval flag', mark: 'yes', cite: ['munder-difflin-changelog', 'munder-difflin-providers', 'munder-difflin-first-hour'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'An in-app MCP catalog for Claude Code agents alone; Claude Code agents also keep your own MCP servers and skills', mark: 'partial', cite: ['munder-difflin-mcp', 'munder-difflin-first-hour', 'munder-difflin-faq'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Optional git worktree per agent on its own branch, otherwise the shared project folder; orchestrator-spawned workers get one by default', mark: 'yes', cite: ['munder-difflin-readme', 'munder-difflin-add-agent', 'munder-difflin-main'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'Every agent is a live terminal you can read and type into, with a fullscreen view', mark: 'yes', cite: ['munder-difflin-readme', 'munder-difflin-home', 'munder-difflin-changelog'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'An Ask me inbox groups agents’ questions; OS notifications flag finished or waiting agents; spend, scope and destructive actions go to you', mark: 'yes', cite: ['munder-difflin-download', 'munder-difflin-changelog', 'munder-difflin-readme'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'An orchestrator agent splits your brief into tasks and assigns them; Kimi, Copilot and custom agents can’t receive inbox mail', mark: 'yes', cite: ['munder-difflin-home', 'munder-difflin-readme', 'munder-difflin-providers'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Automations run missions on a schedule while the app runs; GitHub, Linear, Telegram or custom webhooks can wake an agent', mark: 'yes', cite: ['munder-difflin-pro', 'munder-difflin-first-hour', 'munder-difflin-home'] } },
				{ label: 'Team collaboration', hint: 'Several people’s agents working together', splash: { text: 'splash-server is a personal, single-user service, not a multi-user deployment', mark: 'no', cite: ['splash-server'] }, other: { text: 'A Teams plan for 2–20 people, priced on a call: orchestrators message across machines, with invite-code seats and an admin console', mark: 'yes', cite: ['munder-difflin-home', 'munder-difflin-0-5-2'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'IDE views for changes, history and branch compare with view-only diffs against HEAD; diff comments sent to agents aren’t documented', mark: 'yes', cite: ['munder-difflin-readme', 'munder-difflin-ide'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'A Monaco editor with a file tree, editable tabs and git diffs; since 0.5.5 it can open in its own window', mark: 'yes', cite: ['munder-difflin-readme', 'munder-difflin-ide', 'munder-difflin-download'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Through gh: assign issues to agents and watch Actions runs; GitHub webhooks can wake an agent. A pull request view isn’t documented', mark: 'yes', cite: ['munder-difflin-changelog', 'munder-difflin-github', 'munder-difflin-download', 'munder-difflin-readme'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'GitHub issues via gh; Linear can wake an agent, and agents get Linear and Jira API templates; GitLab isn’t documented', mark: 'partial', cite: ['munder-difflin-changelog', 'munder-difflin-home', 'munder-difflin-integrations'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'Agents run on your machine and stop when it does; hosted sandboxes are listed as a coming Pro feature', mark: 'no', cite: ['munder-difflin-home', 'munder-difflin-terms'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'No SSH hosts or web client documented; reach a running office via Slack, Telegram, webhooks or Claude Code’s Remote Control', mark: 'partial', cite: ['munder-difflin-home', 'munder-difflin-readme', 'munder-difflin-changelog'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Add Agent can resume a Claude Code session started elsewhere by its id; browsing or importing other history isn’t documented', mark: 'partial', cite: ['munder-difflin-changelog', 'munder-difflin-main'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Search covers shared agent memory and, with Pro, meeting transcripts by name or content', mark: 'partial', cite: ['munder-difflin-readme', 'munder-difflin-download'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Munder Difflin starts each vendor’s interactive CLI in a pseudo-terminal through <code>node-pty</code> and reads agent status from config-file hooks or a local proxy, which Kimi, Copilot and Cursor don’t have yet; ACP isn’t documented. Splash connects to every agent over the <strong>Agent Client Protocol</strong> and draws messages, tool calls, diffs and permission requests in one transcript.',
			cite: ['munder-difflin-sdk', 'munder-difflin-readme', 'munder-difflin-providers', 'splash-registry', 'splash-readme', 'acp']
		},
		{
			title: 'One office or separate sessions',
			text: 'In Munder Difflin you brief one orchestrator agent, which splits the work into tasks for other agents. They share a task board, inboxes and lasting memory. Per-agent token budgets and a circuit breaker guard against runaway spend, and Pro adds a cap in dollars. In Splash each session is one agent in one folder, and sessions don’t hand work to each other.',
			cite: ['munder-difflin-home', 'munder-difflin-readme', 'munder-difflin-pro', 'splash-readme', 'splash-features']
		},
		{
			title: 'Price, license and accounts',
			text: 'Munder Difflin’s code is MIT-licensed, but since 0.5.2 the maker no longer signs or notarizes community builds, and Pro code such as the Stapler isn’t in the public repo. Pro is a prepaid term for one machine that doesn’t renew, and its pages disagree on whether the free plan needs an account. Splash is free, MIT-licensed and has no accounts.',
			cite: ['munder-difflin-license', 'munder-difflin-0-5-2', 'munder-difflin-repo', 'munder-difflin-terms', 'munder-difflin-home', 'munder-difflin-first-hour', 'munder-difflin-download', 'splash-license', 'splash-download', 'splash-build']
		},
		{
			title: 'Where agents run',
			text: 'Both run agents on your own computer. Munder Difflin’s agents stop when the machine does; Slack, Telegram, webhooks or Claude Code’s Remote Control reach a running office, and hosted sandboxes and an app remote are listed as coming. Splash can also run as <code>splash-server</code> on the machine that holds your code, used from a browser over an SSH tunnel.',
			cite: ['munder-difflin-home', 'munder-difflin-readme', 'munder-difflin-changelog', 'splash-readme', 'splash-server']
		},
		{
			title: 'Tools around the agents',
			text: 'Munder Difflin bundles a Monaco editor with git history and branch compare, scheduled automations, and a Pro Stapler that transcribes dictation and meetings on your machine with a bundled Whisper model. Splash centers on the conversation: a review screen that sends feedback to the agent, a Needs attention queue, transcript search and importing sessions agents started elsewhere.',
			cite: ['munder-difflin-readme', 'munder-difflin-ide', 'munder-difflin-pro', 'munder-difflin-download', 'splash-features', 'splash-history']
		}
	],
	fit: {
		splash: [
			'You want every agent driven over the Agent Client Protocol, with its messages, tool calls and diffs shown as one transcript.',
			'You want to answer permission requests in the app and send feedback on changed files from a review screen.',
			'You want to import conversations your agents started outside the app and search them with the rest.',
			'You want a free app with no accounts, or a server you open in a browser over SSH.'
		],
		other: [
			'You want to brief one orchestrator agent and let it hand tasks to agents that share a board, inboxes and memory.',
			'You want each agent’s own terminal interface, with twelve CLIs supported and any other command as a custom agent.',
			'You want scheduled automations, and GitHub, Linear or Telegram triggers that wake an agent.',
			'You want a built-in Monaco editor, per-agent token budgets with a circuit breaker, and the Pro Stapler for local dictation and meeting transcripts.'
		]
	},
	sources: [
		{ id: 'munder-difflin-home', title: 'Multi agent harness for Claude Code, Codex and ten more', url: 'https://munderdiffl.in/', publisher: 'Chaitanya Giri', checked: '2026-10-10' },
		{ id: 'munder-difflin-pro', title: 'Munder Difflin PRO: The professional workspace for your agents', url: 'https://munderdiffl.in/pro/', publisher: 'Chaitanya Giri', checked: '2026-10-10' },
		{ id: 'munder-difflin-download', title: 'Download Munder Difflin for macOS', url: 'https://harnessmd.com/download', publisher: 'Chaitanya Giri', checked: '2026-10-10' },
		{ id: 'munder-difflin-terms', title: 'Terms of Service', url: 'https://munderdiffl.in/terms.html', publisher: 'Chaitanya Giri', checked: '2026-10-10' },
		{ id: 'munder-difflin-privacy', title: 'Privacy Policy', url: 'https://munderdiffl.in/privacy.html', publisher: 'Chaitanya Giri', checked: '2026-10-10' },
		{ id: 'munder-difflin-0-5-2', title: 'Munder Difflin 0.5.2: Pro, the Stapler and Everything Since 0.4.6', url: 'https://munderdiffl.in/blog/launching-munder-difflin-v0-5-2/', publisher: 'Chaitanya Giri', checked: '2026-10-10' },
		{ id: 'munder-difflin-0-5-3', title: 'Munder Difflin 0.5.3: Stapler Listens, And It Listens Locally', url: 'https://munderdiffl.in/blog/munder-difflin-0-5-3/', publisher: 'Chaitanya Giri', checked: '2026-10-10' },
		{ id: 'munder-difflin-first-hour', title: 'Your First Hour With Munder Difflin: Onboarding to a Pro Office', url: 'https://munderdiffl.in/blog/your-first-hour-with-munder-difflin/', publisher: 'Chaitanya Giri', checked: '2026-10-10' },
		{ id: 'munder-difflin-install', title: 'How to Install and Use Munder Difflin: A Beginner’s Guide', url: 'https://munderdiffl.in/blog/how-to-install-and-use-munder-difflin/', publisher: 'Chaitanya Giri', checked: '2026-10-10' },
		{ id: 'munder-difflin-ide', title: 'How to Use the Built-in Monaco IDE', url: 'https://munderdiffl.in/blog/how-to-use-the-built-in-monaco-ide/', publisher: 'Chaitanya Giri', checked: '2026-10-10' },
		{ id: 'munder-difflin-sdk', title: 'Does the June 2026 Agent SDK Change Affect Munder Difflin?', url: 'https://munderdiffl.in/blog/does-the-june-2026-agent-sdk-change-affect-munder-difflin/', publisher: 'Chaitanya Giri', checked: '2026-10-10' },
		{ id: 'munder-difflin-faq', title: 'Munder Difflin FAQ: Everything People Ask', url: 'https://munderdiffl.in/blog/munder-difflin-faq/', publisher: 'Chaitanya Giri', checked: '2026-10-10' },
		{ id: 'munder-difflin-mac-mini', title: 'Run Munder Difflin Locally on a Mac Mini', url: 'https://munderdiffl.in/blog/run-munder-difflin-on-a-mac-mini/', publisher: 'Chaitanya Giri', checked: '2026-10-10' },
		{ id: 'munder-difflin-repo', title: 'HarnessMD/munder-difflin', url: 'https://github.com/HarnessMD/munder-difflin', publisher: 'HarnessMD/munder-difflin on GitHub', checked: '2026-10-10' },
		{ id: 'munder-difflin-readme', title: 'munder-difflin README', url: 'https://github.com/HarnessMD/munder-difflin/blob/main/README.md', publisher: 'HarnessMD/munder-difflin on GitHub', checked: '2026-10-10' },
		{ id: 'munder-difflin-license', title: 'LICENSE', url: 'https://github.com/HarnessMD/munder-difflin/blob/main/LICENSE', publisher: 'HarnessMD/munder-difflin on GitHub', checked: '2026-10-10' },
		{ id: 'munder-difflin-changelog', title: 'CHANGELOG.md', url: 'https://github.com/HarnessMD/munder-difflin/blob/main/CHANGELOG.md', publisher: 'HarnessMD/munder-difflin on GitHub', checked: '2026-10-10' },
		{ id: 'munder-difflin-release', title: 'v0.5.5 release', url: 'https://github.com/HarnessMD/munder-difflin/releases/tag/v0.5.5', publisher: 'HarnessMD/munder-difflin on GitHub', checked: '2026-10-10' },
		{ id: 'munder-difflin-providers', title: 'src/shared/agentProvider.ts', url: 'https://github.com/HarnessMD/munder-difflin/blob/main/src/shared/agentProvider.ts', publisher: 'HarnessMD/munder-difflin on GitHub', checked: '2026-10-10' },
		{ id: 'munder-difflin-add-agent', title: 'src/renderer/src/components/AddAgentModal.tsx', url: 'https://github.com/HarnessMD/munder-difflin/blob/main/src/renderer/src/components/AddAgentModal.tsx', publisher: 'HarnessMD/munder-difflin on GitHub', checked: '2026-10-10' },
		{ id: 'munder-difflin-main', title: 'src/main/index.ts', url: 'https://github.com/HarnessMD/munder-difflin/blob/main/src/main/index.ts', publisher: 'HarnessMD/munder-difflin on GitHub', checked: '2026-10-10' },
		{ id: 'munder-difflin-github', title: 'src/main/github.ts', url: 'https://github.com/HarnessMD/munder-difflin/blob/main/src/main/github.ts', publisher: 'HarnessMD/munder-difflin on GitHub', checked: '2026-10-10' },
		{ id: 'munder-difflin-integrations', title: 'src/shared/integrations.ts', url: 'https://github.com/HarnessMD/munder-difflin/blob/main/src/shared/integrations.ts', publisher: 'HarnessMD/munder-difflin on GitHub', checked: '2026-10-10' },
		{ id: 'munder-difflin-mcp', title: 'src/shared/mcpCatalog.ts', url: 'https://github.com/HarnessMD/munder-difflin/blob/main/src/shared/mcpCatalog.ts', publisher: 'HarnessMD/munder-difflin on GitHub', checked: '2026-10-10' }
	]
};
