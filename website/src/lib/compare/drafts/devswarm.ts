// Splash vs DevSwarm. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const DEVSWARM: Comparison = {
	slug: 'devswarm',
	name: 'DevSwarm',
	description: 'How Splash and DevSwarm compare on agents, platforms, pricing, worktrees, review and orchestration, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and DevSwarm both run several coding agents at once and can give each its own git worktree. DevSwarm, a proprietary IDE for macOS and Windows, runs each agent’s CLI in a terminal beside a VS Code-based editor. Splash, a free, open-source desktop app for macOS, Windows and Ubuntu, drives agents over the Agent Client Protocol.',
	other: {
		name: 'DevSwarm',
		url: 'https://devswarm.ai/',
		maker: '21st Idea',
		summary: 'A desktop IDE for macOS and Windows that runs CLI coding agents in parallel, each workspace a git worktree with a VS Code-based editor, plus GitHub and Jira intake and agent orchestration.',
		cite: ['devswarm-overview', 'devswarm-2-0', 'devswarm-using', 'devswarm-github', 'devswarm-jira', 'devswarm-hivecontrol', 'devswarm-download']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop IDE for parallel agents; each workspace pairs an editor built on the VS Code codebase with AI and shell terminals', cite: ['devswarm-overview', 'devswarm-2-0', 'devswarm-using'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v2.5.6 installers (8 October 2026); release notes reach 2.5.3. Public beta from September 2025, and some pages still say beta', cite: ['devswarm-update-manifest', 'devswarm-release-2-5-3', 'devswarm-changelog-5', 'devswarm-readme'] } },
				{ label: 'License', splash: S.license, other: { text: 'Proprietary; the app’s source isn’t published, and its GitHub repository holds the website, docs and issue tracker', cite: ['devswarm-license'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free with ads; Pro $8 a month; Team $18 per seat a month; Enterprise on request; Pro free to students for non-commercial use', cite: ['devswarm-pricing', 'devswarm-pricing-blog', 'devswarm-student'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 14+ on Apple silicon and Windows 11 on Intel/AMD, including repos inside WSL; 16 GB RAM minimum; no Linux build', cite: ['devswarm-download', 'devswarm-wsl', 'devswarm-faq-repo'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'The docs list 19 CLI agents and the website 20, including Claude Code, Codex, Copilot, Gemini and Goose; installed ones are detected', cite: ['devswarm-ai-assistants', 'devswarm-supported-agents'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Each agent’s CLI in a worktree terminal; DevSwarm Chat gives Claude, Copilot and Codex a chat view, by an undocumented method', cite: ['devswarm-ai-assistants', 'devswarm-chat-blog'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Your own agent accounts, subscriptions or API keys; DevSwarm adds no fee on model use and can install supported agents', cite: ['devswarm-faq', 'devswarm-pricing-blog', 'devswarm-repo-management', 'devswarm-changelog'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'Sign-in with Google, Microsoft or GitHub is part of first launch; the Terms limit the service to users in the United States', cite: ['devswarm-installation', 'devswarm-terms'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'DevSwarm Chat turns Claude, Copilot and Codex requests, background ones included, into clickable actions; other agents prompt in their terminal', mark: 'yes', cite: ['devswarm-chat-blog', 'devswarm-release-2-5-3', 'devswarm-security'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Agents keep their own MCP servers; DevSwarm trusts a project’s MCP servers automatically, and since 2.5.2 AI chat can manage them', mark: 'yes', cite: ['devswarm-changelog-4', 'devswarm-release-2-5-2'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A git worktree per workspace, normally on a new branch; PR and existing-branch workspaces check that branch out. No containers documented', mark: 'yes', cite: ['devswarm-using', 'devswarm-github'] } },
				{
					label: 'Work across repositories',
					hint: 'One task or session spanning several repos',
					splash: { text: 'One project folder or worktree per session; a new session can add other folders as workspace roots when the agent supports them', mark: 'partial', cite: ['splash-readme', 'splash-history'] },
					other: { text: 'Multi-Repo workspaces (marked Advanced) join several repositories as submodules of a local parent; each keeps its own remote, branch and PR', mark: 'yes', cite: ['devswarm-multi-repo'] }
				},
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Setup and teardown scripts in .devswarm/config.json, copies of untracked files like .env, and a free port per named variable per workspace', mark: 'yes', cite: ['devswarm-dashboard', 'devswarm-example-prompts', 'devswarm-file-patterns', 'devswarm-port-variables'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'The sidebar marks running and dormant workspaces with PR and CI status; DevSwarm Chat raises background permission requests. No input queue documented', mark: 'partial', cite: ['devswarm-changelog-3', 'devswarm-github', 'devswarm-release-2-5-3'] } },
				{ label: 'Notifications', splash: S.notifications, other: { text: 'Not documented for agent events; the docs mention a notification when a teardown script fails', mark: 'unknown', cite: ['devswarm-example-prompts'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'HiveControl: given a plain-language goal, an agent plans the work, creates child workspaces and coordinates them through messages', mark: 'yes', cite: ['devswarm-hivecontrol'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Review Mode diffs a workspace against its source branch, with line comments and review verdicts on GitHub PRs; not in Free', mark: 'partial', cite: ['devswarm-using', 'devswarm-github', 'devswarm-pricing-blog'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'A VS Code-based editor with Open VSX extensions; a shortcut opens the workspace in Cursor, JetBrains or another editor', mark: 'yes', cite: ['devswarm-2-0', 'devswarm-using'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'The Teams page says you can push and open PRs in the app; the docs don’t describe the steps', mark: 'yes', cite: ['devswarm-teams', 'devswarm-github'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'OAuth sign-in; clone repos, list PRs with CI and review status, start workspaces from one or many PRs', mark: 'yes', cite: ['devswarm-github'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'Jira on the Team tier: browse issues and start workspaces from them, with read-only access. Linear and GitHub Issues aren’t documented', mark: 'partial', cite: ['devswarm-jira', 'devswarm-pricing', 'devswarm-faq'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Every workspace runs on your own machine; no cloud, SSH, web or phone access is documented', mark: 'no', cite: ['devswarm-security', 'devswarm-download'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented; DevSwarm reopens its own workspaces on launch and resumes Codex and Antigravity conversations after a restart', mark: 'unknown', cite: ['devswarm-changelog-2', 'devswarm-release-2-5-3', 'devswarm-ai-assistants'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Not documented; a palette looks up workspaces by their name, branch or Jira issue, and 2.5.3 exports sessions as Markdown', mark: 'unknown', cite: ['devswarm-changelog', 'devswarm-release-2-5-3'] } },
				{ label: 'Fork a conversation', splash: S.fork, other: { text: 'Since 2.5.3, sessions can be forked, renamed, compacted, rewound to checkpoints or exported as Markdown', mark: 'yes', cite: ['devswarm-release-2-5-3'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'DevSwarm runs each agent’s CLI in a terminal in the workspace’s worktree, from a maker-curated list of 19 to 20 agents; adding other agents isn’t documented. <strong>DevSwarm Chat</strong> gives Claude, Copilot and Codex a chat view, by a method the maker doesn’t describe. Splash talks to every agent over the <strong>Agent Client Protocol</strong>, natively or through an adapter.',
			cite: ['devswarm-ai-assistants', 'devswarm-agents-doc', 'devswarm-supported-agents', 'devswarm-chat-blog', 'splash-registry', 'acp']
		},
		{
			title: 'Where it runs',
			text: 'DevSwarm runs on macOS with Apple silicon and on Windows 11 x64, including repositories inside WSL, needs 16 GB of RAM, and keeps every workspace on your machine. Splash builds for macOS, Windows 11 x64 and Ubuntu 24.04, and <code>splash-server</code> runs it on another machine you open in a browser over an SSH tunnel.',
			cite: ['devswarm-download', 'devswarm-wsl', 'devswarm-security', 'splash-install', 'splash-server']
		},
		{
			title: 'Price, accounts and license',
			text: 'DevSwarm is proprietary. Free shows ads; Pro ($8 a month) drops them and adds GitHub PR review, Team ($18 per seat) adds Jira intake, and Enterprise adds private model endpoints and agent allowlists. First launch includes a Google, Microsoft or GitHub sign-in, and the Terms limit the service to the United States. Splash is free, MIT-licensed and has no accounts.',
			cite: ['devswarm-license', 'devswarm-pricing', 'devswarm-pricing-blog', 'devswarm-faq', 'devswarm-security', 'devswarm-installation', 'devswarm-terms', 'splash-license', 'splash-download', 'splash-build']
		},
		{
			title: 'Around the agents',
			text: 'DevSwarm builds out the workspace: a VS Code-based editor, setup and teardown scripts with per-workspace ports, Jira and GitHub PR intake, Multi-Repo workspaces, starter templates and <strong>HiveControl</strong>, through which an agent creates and coordinates child workspaces. Splash centers on the conversation: a rendered transcript, a Needs attention queue, full-text search of saved sessions and importing sessions agents started elsewhere.',
			cite: ['devswarm-2-0', 'devswarm-dashboard', 'devswarm-port-variables', 'devswarm-jira', 'devswarm-github', 'devswarm-multi-repo', 'devswarm-hivecontrol', 'splash-features', 'splash-history']
		},
		{
			title: 'How far isolation goes',
			text: 'DevSwarm’s Security page says agents can’t reach files outside their worktree, while its Terms say DevSwarm neither confines third-party agents to a directory nor sandboxes or watches them, and leave securing the environment to you. Splash runs each session in its project folder or a git worktree and shows the agent’s permission requests in the transcript.',
			cite: ['devswarm-security', 'devswarm-terms', 'splash-features']
		}
	],
	fit: {
		splash: [
			'You want a free, MIT-licensed app with no account, on macOS, Windows or Ubuntu.',
			'You want to run sessions on your own server and use them from a browser over SSH.',
			'You want every agent in one chat view over the Agent Client Protocol, with permission requests gathered in a Needs attention queue.',
			'You want to import conversations agents started outside the app and search their full text.'
		],
		other: [
			'You want a VS Code-based editor with Open VSX extensions in every workspace, next to the agents’ own terminals.',
			'You want setup and teardown scripts, copied .env files and a free port in each workspace.',
			'You want to start workspaces from Jira issues or GitHub PRs, or span several repositories in one Multi-Repo workspace.',
			'You want an agent to break a goal into child workspaces and coordinate them through HiveControl.'
		]
	},
	sources: [
		{ id: 'devswarm-overview', title: 'Overview', url: 'https://docs.devswarm.ai/getting-started/overview', publisher: '21st Idea', checked: '2026-10-10' },
		{ id: 'devswarm-2-0', title: 'DevSwarm 2.0: A Full IDE for Parallel AI Coding', url: 'https://devswarm.ai/blog/devswarm-2-0-a-full-ide-for-parallel-ai-coding/', publisher: '21st Idea', checked: '2026-10-10' },
		{ id: 'devswarm-using', title: 'Using DevSwarm', url: 'https://docs.devswarm.ai/getting-started/using-devswarm', publisher: '21st Idea', checked: '2026-10-10' },
		{ id: 'devswarm-github', title: 'GitHub Integration', url: 'https://docs.devswarm.ai/features-and-integrations/github-integration', publisher: '21st Idea', checked: '2026-10-10' },
		{ id: 'devswarm-jira', title: 'Jira Integration', url: 'https://docs.devswarm.ai/features-and-integrations/jira-integration', publisher: '21st Idea', checked: '2026-10-10' },
		{ id: 'devswarm-hivecontrol', title: 'HiveControl', url: 'https://docs.devswarm.ai/hivecontrol/hivecontrol', publisher: '21st Idea', checked: '2026-10-10' },
		{ id: 'devswarm-download', title: 'Download DevSwarm', url: 'https://devswarm.ai/download/', publisher: '21st Idea', checked: '2026-10-10' },
		{ id: 'devswarm-update-manifest', title: 'latest-mac.yml (macOS update manifest)', url: 'https://downloads.devswarm.ai/latest-mac.yml', publisher: '21st Idea', checked: '2026-10-10' },
		{ id: 'devswarm-release-2-5-3', title: 'DevSwarm 2.5.3 – Workspace and session control', url: 'https://github.com/devswarm-ai/devswarm/releases/tag/v2.5.3', publisher: 'devswarm-ai/devswarm on GitHub', checked: '2026-10-10' },
		{ id: 'devswarm-changelog-5', title: 'Changelog (page 5)', url: 'https://devswarm.ai/changelog/5/', publisher: '21st Idea', checked: '2026-10-10' },
		{ id: 'devswarm-readme', title: 'README.md', url: 'https://github.com/devswarm-ai/devswarm/blob/main/README.md', publisher: 'devswarm-ai/devswarm on GitHub', checked: '2026-10-10' },
		{ id: 'devswarm-license', title: 'LICENSE', url: 'https://github.com/devswarm-ai/devswarm/blob/main/LICENSE', publisher: 'devswarm-ai/devswarm on GitHub', checked: '2026-10-10' },
		{ id: 'devswarm-pricing', title: 'Pricing & Products', url: 'https://devswarm.ai/pricing/', publisher: '21st Idea', checked: '2026-10-10' },
		{ id: 'devswarm-pricing-blog', title: 'DevSwarm Pricing, Explained', url: 'https://devswarm.ai/blog/devswarm-pricing-explained-free-parallel-ai-coding/', publisher: '21st Idea', checked: '2026-10-10' },
		{ id: 'devswarm-student', title: 'DevSwarm for students', url: 'https://devswarm.ai/student/', publisher: '21st Idea', checked: '2026-10-10' },
		{ id: 'devswarm-faq-repo', title: 'docs/faq.md', url: 'https://github.com/devswarm-ai/devswarm/blob/main/docs/faq.md', publisher: 'devswarm-ai/devswarm on GitHub', checked: '2026-10-10' },
		{ id: 'devswarm-ai-assistants', title: 'AI Assistants', url: 'https://docs.devswarm.ai/features-and-integrations/ai-assistants', publisher: '21st Idea', checked: '2026-10-10' },
		{ id: 'devswarm-supported-agents', title: 'Supported agents', url: 'https://devswarm.ai/supported-agents/', publisher: '21st Idea', checked: '2026-10-10' },
		{ id: 'devswarm-agents-doc', title: 'docs/supported-ai-assistants.md', url: 'https://github.com/devswarm-ai/devswarm/blob/main/docs/supported-ai-assistants.md', publisher: 'devswarm-ai/devswarm on GitHub', checked: '2026-10-10' },
		{ id: 'devswarm-chat-blog', title: 'A Better Way to Chat With Your AI Agents', url: 'https://devswarm.ai/blog/devswarm-wears-your-vscode-theme/', publisher: '21st Idea', checked: '2026-10-10' },
		{ id: 'devswarm-faq', title: 'FAQ', url: 'https://devswarm.ai/frequently-asked-questions/', publisher: '21st Idea', checked: '2026-10-10' },
		{ id: 'devswarm-installation', title: 'Installation', url: 'https://docs.devswarm.ai/getting-started/installation', publisher: '21st Idea', checked: '2026-10-10' },
		{ id: 'devswarm-repo-management', title: 'Repository Management', url: 'https://docs.devswarm.ai/repositories-and-workspaces/repository-management', publisher: '21st Idea', checked: '2026-10-10' },
		{ id: 'devswarm-changelog', title: 'Changelog', url: 'https://devswarm.ai/changelog/', publisher: '21st Idea', checked: '2026-10-10' },
		{ id: 'devswarm-changelog-2', title: 'Changelog (page 2)', url: 'https://devswarm.ai/changelog/2/', publisher: '21st Idea', checked: '2026-10-10' },
		{ id: 'devswarm-changelog-3', title: 'Changelog (page 3)', url: 'https://devswarm.ai/changelog/3/', publisher: '21st Idea', checked: '2026-10-10' },
		{ id: 'devswarm-changelog-4', title: 'Changelog (page 4)', url: 'https://devswarm.ai/changelog/4/', publisher: '21st Idea', checked: '2026-10-10' },
		{ id: 'devswarm-release-2-5-2', title: 'DevSwarm 2.5.2 – Agent visibility and session continuity', url: 'https://github.com/devswarm-ai/devswarm/releases/tag/v2.5.2', publisher: 'devswarm-ai/devswarm on GitHub', checked: '2026-10-10' },
		{ id: 'devswarm-terms', title: 'Terms of Service', url: 'https://devswarm.ai/terms-of-service/', publisher: '21st Idea', checked: '2026-10-10' },
		{ id: 'devswarm-security', title: 'Security', url: 'https://devswarm.ai/security/', publisher: '21st Idea', checked: '2026-10-10' },
		{ id: 'devswarm-multi-repo', title: 'Multi-Repos & Sub-Modules', url: 'https://docs.devswarm.ai/repositories-and-workspaces/multi-repos-and-sub-modules', publisher: '21st Idea', checked: '2026-10-10' },
		{ id: 'devswarm-dashboard', title: 'Repository Dashboard', url: 'https://docs.devswarm.ai/repositories-and-workspaces/repository-dashboard', publisher: '21st Idea', checked: '2026-10-10' },
		{ id: 'devswarm-example-prompts', title: 'Example Prompts to prepare your repository', url: 'https://docs.devswarm.ai/unstoppable-workflows/example-prompts-to-prepare-your-repository', publisher: '21st Idea', checked: '2026-10-10' },
		{ id: 'devswarm-file-patterns', title: 'File Patterns', url: 'https://docs.devswarm.ai/features-and-integrations/file-patterns', publisher: '21st Idea', checked: '2026-10-10' },
		{ id: 'devswarm-port-variables', title: 'Port Variables', url: 'https://docs.devswarm.ai/features-and-integrations/port-variables', publisher: '21st Idea', checked: '2026-10-10' },
		{ id: 'devswarm-teams', title: 'DevSwarm for Teams', url: 'https://devswarm.ai/devswarm-for-teams/', publisher: '21st Idea', checked: '2026-10-10' },
		{ id: 'devswarm-wsl', title: 'Windows and WSL Support', url: 'https://docs.devswarm.ai/features-and-integrations/windows-and-wsl', publisher: '21st Idea', checked: '2026-10-10' }
	]
};
