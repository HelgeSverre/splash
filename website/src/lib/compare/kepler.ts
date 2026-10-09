// Splash vs Kepler. Facts checked 2026-10-09 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

const C = '2026-10-09';
const SITE = 'https://www.gitkraken.com';
const DOCS = 'https://help.gitkraken.com/kepler';
const MAKER = 'GitKraken';
const GK_ADE = 'gitkraken/gk-ade on GitHub';

export const KEPLER: Comparison = {
	slug: 'kepler',
	name: 'Kepler',
	description: 'How Splash and Kepler compare on agents, platforms, pricing, worktrees, remote hosts and review, with a source for every fact.',
	checked: C,
	intro: 'Splash and Kepler are desktop apps that run several coding agents at once in git worktrees, and both use the Agent Client Protocol. Kepler, GitKraken’s agentic development environment, is organized around Tasks that can span several repositories and is tied to a GitKraken account. Splash is open source, and each session runs one agent in a project folder or its worktree.',
	other: {
		name: 'Kepler',
		url: `${SITE}/kepler`,
		maker: 'GitKraken',
		summary: 'GitKraken’s agentic development environment: a desktop app where a Task can hold work across several repositories, with a worktree per repository, shared context for every agent session, and agents driven over ACP or in a terminal.',
		cite: ['kepler-home', 'kepler-tasks', 'kepler-agent-integrations']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'GitKraken’s agentic development environment, a desktop app; paid Remote Access also opens it in a browser on another device', cite: ['kepler-home', 'kepler-download', 'kepler-remote'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'Public preview, version 0.12.0 (October 7, 2026); the release notes start at 0.7.0, dated June 15, 2026', cite: ['kepler-getting-started', 'kepler-release-notes'] } },
				{ label: 'License', splash: S.license, other: { text: 'Closed source; GitKraken’s public gk-ade repository is an issue tracker, under an all-rights-reserved license', cite: ['kepler-gk-ade', 'kepler-gk-ade-license'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free Community plan with a task limit; paid GitKraken plans from US$10 or €8 a seat a month, billed annually', cite: ['kepler-pricing'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'Windows 10+ and Linux on x64, with ARM preview builds for both; macOS 12+ on Apple silicon and Intel', cite: ['kepler-getting-started', 'kepler-download'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Nine built in: Claude Code, Codex, GitHub Copilot, Cursor, OpenCode, Auggie, Grok Build, Pi and Google Antigravity, plus custom agent servers', cite: ['kepler-agent-integrations'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Rich chat over ACP (most agents’ default) or the agent’s own CLI in a built-in terminal; Antigravity starts in the terminal, and Pi always runs there', cite: ['kepler-agent-integrations'] } },
				{ label: 'Agent sign-in', splash: S.signIn, other: { text: 'Your own agent accounts, with no markup; Kepler can run an agent’s installer, and paid plans hold several accounts for five of the agents', cite: ['kepler-agent-integrations', 'kepler-pricing'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'A GitKraken account, and a free one is enough; it also stores your Git host and issue-tracker connections', cite: ['kepler-getting-started', 'kepler-release-notes', 'kepler-pr-integrations'] } },
				{ label: 'Permission requests', splash: S.permissions, other: { text: 'Answered in Kepler or from a notification, terminal agents included via hooks; choices include allowing once, per session or always, and rejecting', mark: 'yes', cite: ['kepler-agent-sessions', 'kepler-release-notes'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Adds, removes and disables MCP servers for seven of the nine agents; sessions get Kepler’s own, and GitKraken’s is installed into detected clients by default', mark: 'yes', cite: ['kepler-agent-integrations', 'kepler-mcp', 'kepler-tasks', 'kepler-settings'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A git worktree per repository per Task, on a new branch (kepler/ by default) from the remote default branch; can be turned off per repository', mark: 'yes', cite: ['kepler-tasks', 'kepler-getting-started'] } },
				{
					label: 'Work across repositories',
					hint: 'One task or session spanning several repos',
					splash: { text: 'One project folder or worktree per session; a new session can add other folders as workspace roots when the agent supports them', mark: 'partial', cite: ['splash-readme', 'splash-history'] },
					other: { text: 'A Task can span several repositories, and its prompt, issue, PR, notes and links reach its sessions as shared context by default', mark: 'yes', cite: ['kepler-home', 'kepler-tasks'] }
				},
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Per-repository commands run in order in each new worktree before the agent starts; agents can attach dev servers to the Task', mark: 'yes', cite: ['kepler-tasks', 'kepler-settings', 'kepler-release-notes'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Needs attention and Unread groups on the dashboard, colored dots on task titles, and waiting counts in window titles', mark: 'yes', cite: ['kepler-arranging', 'kepler-interface'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'A diff panel and full-window overlay, stacked or split; comment on lines or files, then add the comments to the prompt', mark: 'yes', cite: ['kepler-review'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'Edit files in place, stage, commit, amend, discard and resolve conflicts; one button pushes or pulls, and a branch can be rebased or merged onto its target', mark: 'yes', cite: ['kepler-review'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'No create-PR button; the agent, a terminal command or the host’s website opens the PR, then Kepler attaches it to the Task and tracks it', mark: 'no', cite: ['kepler-review', 'kepler-release-notes'] } },
				{ label: 'GitHub', hint: 'And other Git hosts', splash: S.github, other: { text: 'PRs you wrote or need to review, from GitHub, GitLab, Azure DevOps and Bitbucket, cloud or self-hosted (GitHub Enterprise and GitLab Self-Managed on paid plans); CI checks aren’t documented', mark: 'yes', cite: ['kepler-pr-integrations', 'kepler-pricing'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'Jira (Cloud, Server, Data Center), Linear, Trello, GitHub, GitLab and Azure DevOps; start a Task from an issue', mark: 'yes', cite: ['kepler-issue-integrations', 'kepler-pr-integrations', 'kepler-tasks'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'No GitKraken-hosted agents are documented; remote environments are machines you supply, such as a dev server or cloud VM', mark: 'no', cite: ['kepler-remote'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'Paid plans: agents, worktrees and terminals run on an SSH host or in WSL 2, and sessions survive disconnects', mark: 'yes', cite: ['kepler-remote', 'kepler-pricing'] } },
				{
					label: 'Phones and tablets',
					splash: S.mobile,
					other: { text: 'No native app; paid Remote Access opens your desktop Kepler in a phone’s browser, paired by QR code', mark: 'partial', cite: ['kepler-remote', 'kepler-release-notes'] }
				},
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Updates itself and prompts you to restart', mark: 'yes', cite: ['kepler-release-notes'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Sessions started outside the app', splash: S.history, other: { text: 'Hooks show sessions of five agents started in your terminal, and past ones are found on disk; fork or continue them, with transcripts shown for Claude Code and Codex', mark: 'yes', cite: ['kepler-agent-integrations', 'kepler-agent-sessions'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Find in one conversation, plus search of task titles, refs, repos and archived sessions; cross-transcript search isn’t documented', mark: 'partial', cite: ['kepler-release-notes', 'kepler-arranging', 'kepler-agent-sessions'] } }
			]
		}
	],
	differences: [
		{
			title: 'How each app talks to agents',
			text: 'Splash drives every agent over the <strong>Agent Client Protocol</strong> on stdio and draws the transcript itself. Kepler is an ACP client too and shows most agents as Rich chat by default. Since September 2026 it can also run an agent’s own CLI in a terminal within the task, reading its status and permission requests through hooks Kepler installs, or from the terminal falling idle where an agent has no hooks.',
			cite: ['splash-readme', 'acp', 'kepler-acp-clients', 'kepler-agent-integrations', 'kepler-agent-sessions', 'kepler-release-notes']
		},
		{
			title: 'Tasks across repositories, or sessions rooted in one folder',
			text: 'In Kepler, a <strong>Task</strong> can hold work across several repositories, with a worktree in each, and passes its prompt, issue, PR and notes to its sessions as shared context. Built-in Actions such as Plan and Review start work, and the Agent Graph shows sessions and tool calls live. In Splash, each session is one agent in one project folder or worktree, and a new session can add other folders as workspace roots when the agent supports them.',
			cite: ['kepler-home', 'kepler-tasks', 'kepler-pricing', 'splash-readme', 'splash-features', 'splash-history']
		},
		{
			title: 'Account, plans and license',
			text: 'Splash is MIT-licensed open source, has no accounts and is free. Kepler is closed source and needs a GitKraken account. A free account runs it with a task limit; paid plans add unlimited tasks, remote environments, Remote Access, and GitHub Enterprise and GitLab Self-Managed integrations, among other features. GitKraken’s July and August 2026 posts called Kepler free during the public preview.',
			cite: ['splash-license', 'splash-build', 'splash-download', 'kepler-gk-ade', 'kepler-getting-started', 'kepler-pricing', 'kepler-remote', 'kepler-blog-public-preview', 'kepler-blog-big-release']
		},
		{
			title: 'Where agents run',
			text: 'Splash runs agents on your computer, or on a machine you reach through <code>splash-server</code> in a browser over an SSH tunnel, where agents keep running if the browser closes or the tunnel drops. Kepler’s paid Remote Environments put a Kepler server on an SSH host or WSL 2 distro, where sessions outlive disconnects; Remote Access relays your desktop Kepler to a browser on a phone or another computer through your GitKraken account.',
			cite: ['splash-readme', 'splash-server', 'kepler-remote', 'kepler-pricing']
		}
	],
	fit: {
		splash: [
			'You want MIT-licensed open source that needs no account and costs nothing.',
			'You want to import, browse and search past conversations, including the full text of saved transcripts.',
			'You want issues, pull requests and Actions runs across your GitHub repositories inside the app.',
			'You want to run the app as a server on your own machine and open it in a browser over SSH.'
		],
		other: [
			'You want one Task to span several repositories, with a worktree in each and shared context for every agent.',
			'You want to edit, stage, commit and sync changes, and pass diff comments to the agent, inside the app.',
			'You want setup commands run in each new worktree, and to start work from Jira, Linear or Trello issues.',
			'You want agents to keep running on an SSH or WSL host, and to check on them from a phone, on a paid plan.'
		]
	},
	sources: [
		{ id: 'kepler-home', title: 'Kepler | Mission Control for Agent-driven Development', url: `${SITE}/kepler`, publisher: MAKER, checked: C },
		{ id: 'kepler-download', title: 'Download Kepler', url: `${SITE}/kepler/download`, publisher: MAKER, checked: C },
		{ id: 'kepler-pricing', title: 'GitKraken Pricing', url: `${SITE}/pricing`, publisher: MAKER, checked: C },
		{ id: 'kepler-getting-started', title: 'Getting Started with Kepler', url: `${DOCS}/kepler-getting-started/`, publisher: MAKER, checked: C },
		{ id: 'kepler-release-notes', title: 'Kepler 0.x release notes', url: `${DOCS}/release-notes-current/`, publisher: MAKER, checked: C },
		{ id: 'kepler-agent-integrations', title: 'Agent Integrations', url: `${DOCS}/agent-integrations/`, publisher: MAKER, checked: C },
		{ id: 'kepler-agent-sessions', title: 'Agent Sessions', url: `${DOCS}/agent-sessions/`, publisher: MAKER, checked: C },
		{ id: 'kepler-settings', title: 'Settings', url: `${DOCS}/settings/`, publisher: MAKER, checked: C },
		{ id: 'kepler-tasks', title: 'Tasks and Resources', url: `${DOCS}/tasks-and-resources/`, publisher: MAKER, checked: C },
		{ id: 'kepler-remote', title: 'Remote Environments', url: `${DOCS}/remote-environments/`, publisher: MAKER, checked: C },
		{ id: 'kepler-review', title: 'Review Changes', url: `${DOCS}/review-changes/`, publisher: MAKER, checked: C },
		{ id: 'kepler-pr-integrations', title: 'Pull Request Integrations', url: `${DOCS}/pull-request-integrations/`, publisher: MAKER, checked: C },
		{ id: 'kepler-issue-integrations', title: 'Issue Tracker Integrations', url: `${DOCS}/issue-tracker-integrations/`, publisher: MAKER, checked: C },
		{ id: 'kepler-mcp', title: 'MCP Servers', url: `${DOCS}/mcp-servers/`, publisher: MAKER, checked: C },
		{ id: 'kepler-arranging', title: 'Arranging Your Work', url: `${DOCS}/arranging-your-work/`, publisher: MAKER, checked: C },
		{ id: 'kepler-interface', title: 'The Kepler Interface', url: `${DOCS}/kepler-interface/`, publisher: MAKER, checked: C },
		{ id: 'kepler-gk-ade', title: 'gk-ade README', url: 'https://github.com/gitkraken/gk-ade', publisher: GK_ADE, checked: C },
		{ id: 'kepler-gk-ade-license', title: 'LICENSE.md', url: 'https://github.com/gitkraken/gk-ade/blob/main/LICENSE.md', publisher: GK_ADE, checked: C },
		{ id: 'kepler-blog-public-preview', title: 'Kepler Is in Public Preview: One Task, Every Repo, Every Agent', url: `${SITE}/blog/kepler-is-in-public-preview-one-task-every-repo-every-agent`, publisher: MAKER, checked: C },
		{ id: 'kepler-blog-big-release', title: 'Kepler: One place to run every agent, from idea to merged', url: `${SITE}/blog/big-kepler-release`, publisher: MAKER, checked: C },
		{ id: 'kepler-acp-clients', title: 'Clients', url: 'https://agentclientprotocol.com/get-started/clients', publisher: 'Agent Client Protocol project', checked: C }
	]
};
