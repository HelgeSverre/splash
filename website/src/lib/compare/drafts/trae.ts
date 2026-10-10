// Splash vs TRAE. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const TRAE: Comparison = {
	slug: 'trae',
	name: 'TRAE',
	description: 'How Splash and TRAE compare on agents, models, pricing, platforms, worktrees, cloud tasks and review, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and TRAE both run several AI coding agents at once, with git worktrees to keep their work apart. TRAE, which merges TraeCode and TraeWork, pairs an Agent window with a full IDE and runs its own agents on built-in or custom models. Splash, a free, open-source desktop app, drives agents from several vendors over the Agent Client Protocol.',
	other: {
		name: 'TRAE',
		url: 'https://www.trae.ai',
		maker: 'TRAE',
		summary: 'A desktop, web and mobile platform merging TraeCode and TraeWork. Its Agent window runs TRAE’s own agents locally, in worktrees, over SSH or in the cloud, beside a full IDE window.',
		cite: ['trae-migration', 'trae-what-is', 'trae-agent-window', 'trae-changelog']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app with an Agent window for agent tasks and an IDE window, plus web, iOS and Android clients', cite: ['trae-what-is', 'trae-migration', 'trae-download'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v3.6.0 (8 October 2026); TraeWork, formerly TRAE SOLO, merges in and closes after 23 October 2026. Some features are in beta', cite: ['trae-changelog', 'trae-migration', 'trae-work-blog', 'trae-subagents'] } },
				{ label: 'License', splash: S.license, other: { text: 'Proprietary; SPRING (SG) PTE. LTD. grants a revocable right of use, and the official GitHub repository holds no source', cite: ['trae-terms', 'trae-github-repo'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free, restricted to Auto mode; Pro $20, Pro+ $60 and Ultra $200 a month; Lite, $8 a month, in 12 countries', cite: ['trae-pricing', 'trae-plans'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 12+ (Apple silicon and Intel), Windows 10/11 x64, Linux x64 and ARM64 (.deb, .rpm), web, iOS and Android', cite: ['trae-quickstart', 'trae-download', 'trae-migration'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Built-in Chat and Agent, custom agents with chosen prompts and tools, and Markdown subagents; outside coding agents aren’t documented', cite: ['trae-agent-overview', 'trae-what-is', 'trae-subagents'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'TRAE’s own agent loop, on 19 built-in models (GPT, Gemini, Kimi, DeepSeek and others) or an OpenAI- or Anthropic-format endpoint', cite: ['trae-models'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Plan usage balance for built-in models, with optional per-token overage; an API key for custom models. Reusing CLI logins isn’t documented', cite: ['trae-pricing', 'trae-on-demand', 'trae-models'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'A TRAE account, signed in on up to three devices at once; Privacy mode needs you to be logged in', cite: ['trae-quickstart', 'trae-device-limit', 'trae-privacy-mode'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Per-task modes: Manual Approval, Auto Approval judged by an LLM (not in the US), Full Access, or Custom rules', mark: 'yes', cite: ['trae-agent-window', 'trae-permissions'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Agents use MCP servers over stdio, SSE or Streamable HTTP; marketplace plugins can bundle servers with skills', mark: 'yes', cite: ['trae-mcp', 'trae-marketplace'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A Git worktree and branch per Agent window task, or an isolated cloud container; a sandbox can confine local commands', mark: 'yes', cite: ['trae-worktree', 'trae-cloud-env', 'trae-sandbox'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Cloud environments take install and start scripts plus environment variables; locally, a SessionStart hook can run setup commands', mark: 'partial', cite: ['trae-cloud-env', 'trae-hooks'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'A floating desktop ball shows agent progress with the main window closed; a shared queue of waiting tasks isn’t documented', mark: 'partial', cite: ['trae-changelog', 'trae-settings'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'Banner or sound alerts for finished or failed tasks, separate sounds for waiting ones, and a Notification hook for commands', mark: 'yes', cite: ['trae-settings', 'trae-hooks'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'The Agent delegates to subagents: a built-in Search subagent, plus your own Markdown-defined ones behind a Beta setting', mark: 'yes', cite: ['trae-agent-overview', 'trae-subagents'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'The Agent window’s Automation panel starts tasks at a set time, at intervals or on a plain-language schedule', mark: 'yes', cite: ['trae-automation'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Diff View of each task’s changes and agent code review with Fix in Chat; commenting on diff lines isn’t documented', mark: 'yes', cite: ['trae-agent-window', 'trae-code-review'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'A full IDE window (editor, terminal, debugger, extensions, source control) next to the Agent window’s Diff View', mark: 'yes', cite: ['trae-what-is', 'trae-agent-window'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'The GitHub connector opens AI-written or manual PRs from cloud tasks; worktree tasks merge locally with AI Merge', mark: 'partial', cite: ['trae-github', 'trae-worktree'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'A connector links cloud tasks to GitHub repositories and branches, with AI PR reviews; CI status and in-app merging aren’t documented', mark: 'partial', cite: ['trae-github'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'Isolated containers on a TRAE base image (no custom images); 2 concurrent tasks on Free, 10 on Pro, 20 on Ultra', mark: 'yes', cite: ['trae-cloud-env', 'trae-pricing'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'Over Remote SSH, a Linux host runs TRAE Server; since v3.6.0 Agent window tasks can run in a remote folder', mark: 'yes', cite: ['trae-ssh', 'trae-changelog'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'iOS and Android apps send Code-mode tasks to a paired computer using the same phone-number login, showing progress', mark: 'yes', cite: ['trae-download', 'trae-mobile'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented; setup can import VS Code or Cursor settings, and TRAE reads Claude Code hook configs', mark: 'unknown', cite: ['trae-quickstart', 'trae-hooks'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Global search finds tasks and messages across modes; history stays in sync across the Agent and IDE windows', mark: 'yes', cite: ['trae-agent-window'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'TRAE runs its own agents on built-in models or your API endpoint; running Claude Code, Codex or Gemini CLI inside it isn’t documented. Its China site documents a TRAE CLI 2.0, for flagship Enterprise plans, that serves ACP to editors; trae.ai lists a CLI as coming soon. Splash drives agents from several vendors over the <strong>Agent Client Protocol</strong>.',
			cite: ['trae-agent-overview', 'trae-models', 'trae-cli-cn', 'trae-enterprise', 'splash-registry', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'TRAE runs tasks on your computer, in a worktree, on a Linux host over SSH, or in cloud containers TRAE hosts, up to 20 at once on Ultra; its iOS and Android apps send tasks to a paired computer. Splash runs agents as child processes on your computer, or under <code>splash-server</code> on a machine you reach through an SSH tunnel.',
			cite: ['trae-agent-window', 'trae-worktree', 'trae-ssh', 'trae-cloud-env', 'trae-pricing', 'trae-mobile', 'splash-readme', 'splash-server']
		},
		{
			title: 'Price, accounts and license',
			text: 'TRAE is proprietary and needs a TRAE account. Its Free plan is restricted to Auto mode; Pro ($20), Pro+ ($60) and Ultra ($200) a month include a usage balance for built-in models, with optional per-token overage. Splash is free, MIT-licensed and has no accounts; each agent runs with the login you gave its CLI.',
			cite: ['trae-terms', 'trae-quickstart', 'trae-pricing', 'trae-on-demand', 'splash-license', 'splash-download', 'splash-build', 'splash-agents']
		},
		{
			title: 'Editor or conversation',
			text: 'TRAE pairs its Agent window with an IDE window (editor, debugger, extensions, source control); its open-source notice lists VS Code and Electron components. It adds hooks, scheduled Automation tasks and agent code review. Splash has no editor and centers on the conversations: a Needs attention queue, a review screen, transcript search and import of sessions started elsewhere.',
			cite: ['trae-what-is', 'trae-oss', 'trae-hooks', 'trae-automation', 'trae-code-review', 'splash-features', 'splash-file-tab', 'splash-history']
		}
	],
	fit: {
		splash: [
			'You want Claude Code, Codex, Gemini and other vendors’ agents side by side, each running with its own CLI login.',
			'You want a free, MIT-licensed app that needs no account.',
			'You want to import conversations your agents started outside the app and search them with the rest.',
			'You want permission requests and finished turns gathered in one Needs attention queue.'
		],
		other: [
			'You want a full IDE, with editor, debugger and extensions, beside a window for agent tasks.',
			'You want a choice of built-in models paid from one plan, or your own endpoint and API key.',
			'You want hosted cloud tasks, SSH hosts and iOS and Android apps that hand tasks to your computer.',
			'You want scheduled Automation tasks, lifecycle hooks and subagents in the same app.'
		]
	},
	sources: [
		{ id: 'trae-migration', title: 'TraeCode and TraeWork merged into the all-new TRAE', url: 'https://docs.trae.ai/ide/traework-to-traecode-data-migration?_lang=en', publisher: 'TRAE', checked: '2026-10-10' },
		{ id: 'trae-what-is', title: 'What is TraeCode?', url: 'https://docs.trae.ai/ide/what-is-trae?_lang=en', publisher: 'TRAE', checked: '2026-10-10' },
		{ id: 'trae-agent-window', title: 'Get started with the Agent window', url: 'https://docs.trae.ai/ide/get-started-with-the-agent-window?_lang=en', publisher: 'TRAE', checked: '2026-10-10' },
		{ id: 'trae-changelog', title: 'Changelog', url: 'https://www.trae.ai/changelog', publisher: 'TRAE', checked: '2026-10-10' },
		{ id: 'trae-download', title: 'Download TRAE', url: 'https://www.trae.ai/download', publisher: 'TRAE', checked: '2026-10-10' },
		{ id: 'trae-work-blog', title: 'Introducing TRAE Work', url: 'https://www.trae.ai/blog/trae_work_0609', publisher: 'TRAE', checked: '2026-10-10' },
		{ id: 'trae-terms', title: 'Terms of Service', url: 'https://www.trae.ai/terms-of-service', publisher: 'TRAE', checked: '2026-10-10' },
		{ id: 'trae-github-repo', title: 'Trae-AI/TRAE', url: 'https://github.com/Trae-AI/TRAE', publisher: 'Trae-AI/TRAE on GitHub', checked: '2026-10-10' },
		{ id: 'trae-pricing', title: 'Pricing', url: 'https://www.trae.ai/pricing', publisher: 'TRAE', checked: '2026-10-10' },
		{ id: 'trae-plans', title: 'Plans & billing', url: 'https://docs.trae.ai/ide/new-plans-and-billing?_lang=en', publisher: 'TRAE', checked: '2026-10-10' },
		{ id: 'trae-on-demand', title: 'On-Demand Usage', url: 'https://docs.trae.ai/ide/on-demand-usage?_lang=en', publisher: 'TRAE', checked: '2026-10-10' },
		{ id: 'trae-quickstart', title: 'Quickstart', url: 'https://docs.trae.ai/ide/set-up-trae?_lang=en', publisher: 'TRAE', checked: '2026-10-10' },
		{ id: 'trae-agent-overview', title: 'Agent overview', url: 'https://docs.trae.ai/ide/agent-overview?_lang=en', publisher: 'TRAE', checked: '2026-10-10' },
		{ id: 'trae-subagents', title: 'Subagents', url: 'https://docs.trae.ai/ide/subagents?_lang=en', publisher: 'TRAE', checked: '2026-10-10' },
		{ id: 'trae-models', title: 'Built-in models & custom models', url: 'https://docs.trae.ai/ide/models', publisher: 'TRAE', checked: '2026-10-10' },
		{ id: 'trae-device-limit', title: 'Device limit', url: 'https://docs.trae.ai/ide/device-limit?_lang=en', publisher: 'TRAE', checked: '2026-10-10' },
		{ id: 'trae-privacy-mode', title: 'Privacy mode', url: 'https://docs.trae.ai/ide/privacy-mode?_lang=en', publisher: 'TRAE', checked: '2026-10-10' },
		{ id: 'trae-permissions', title: 'Permission approval overview', url: 'https://docs.trae.ai/ide/permission-and-approval?_lang=en', publisher: 'TRAE', checked: '2026-10-10' },
		{ id: 'trae-mcp', title: 'MCP overview', url: 'https://docs.trae.ai/ide/model-context-protocol?_lang=en', publisher: 'TRAE', checked: '2026-10-10' },
		{ id: 'trae-marketplace', title: 'Plugin marketplace', url: 'https://docs.trae.ai/ide/marketplace?_lang=en', publisher: 'TRAE', checked: '2026-10-10' },
		{ id: 'trae-worktree', title: 'Worktree', url: 'https://docs.trae.ai/ide/worktree?_lang=en', publisher: 'TRAE', checked: '2026-10-10' },
		{ id: 'trae-cloud-env', title: 'Cloud environment setup', url: 'https://docs.trae.ai/ide/set-up-your-cloud-environment?_lang=en', publisher: 'TRAE', checked: '2026-10-10' },
		{ id: 'trae-sandbox', title: 'Sandbox', url: 'https://docs.trae.ai/ide/sandbox?_lang=en', publisher: 'TRAE', checked: '2026-10-10' },
		{ id: 'trae-hooks', title: 'Automate with hooks', url: 'https://docs.trae.ai/ide/automate-actions-with-hooks?_lang=en', publisher: 'TRAE', checked: '2026-10-10' },
		{ id: 'trae-settings', title: 'IDE settings overview', url: 'https://docs.trae.ai/ide/ide-settings-overview?_lang=en', publisher: 'TRAE', checked: '2026-10-10' },
		{ id: 'trae-automation', title: 'Automated tasks', url: 'https://docs.trae.ai/ide/automated-tasks?_lang=en', publisher: 'TRAE', checked: '2026-10-10' },
		{ id: 'trae-code-review', title: 'Agent-powered code review', url: 'https://docs.trae.ai/ide/agent-powered-code-review?_lang=en', publisher: 'TRAE', checked: '2026-10-10' },
		{ id: 'trae-github', title: 'Connect TRAE to GitHub', url: 'https://docs.trae.ai/ide/connect-trae-to-github?_lang=en', publisher: 'TRAE', checked: '2026-10-10' },
		{ id: 'trae-ssh', title: 'Remote development using SSH', url: 'https://docs.trae.ai/ide/ssh-remote?_lang=en', publisher: 'TRAE', checked: '2026-10-10' },
		{ id: 'trae-mobile', title: 'Connect TRAE to TRAE Mobile', url: 'https://docs.trae.ai/ide/connect-trae-to-trae-mobile?_lang=en', publisher: 'TRAE', checked: '2026-10-10' },
		{ id: 'trae-cli-cn', title: 'TRAE CLI 2.0 概述', url: 'https://docs.trae.cn/cli_about-trae-code-cli-2', publisher: 'TRAE', checked: '2026-10-10' },
		{ id: 'trae-enterprise', title: 'Enterprise', url: 'https://www.trae.ai/enterprise', publisher: 'TRAE', checked: '2026-10-10' },
		{ id: 'trae-oss', title: 'Open Source Software Notice', url: 'https://docs.trae.ai/ide/open-source-software-notice?_lang=en', publisher: 'TRAE', checked: '2026-10-10' }
	]
};
