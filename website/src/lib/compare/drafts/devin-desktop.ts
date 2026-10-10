// Splash vs Devin Desktop. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from '../splash.ts';
import type { Comparison } from '../types.ts';

export const DEVIN_DESKTOP: Comparison = {
	slug: 'devin-desktop',
	name: 'Devin Desktop',
	description: 'How Splash and Devin Desktop, formerly Windsurf, compare on agents, platforms, pricing, worktrees, cloud and review, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Devin Desktop both run several coding agents at once and support git worktrees. Devin Desktop, formerly Windsurf, is a VS Code-based IDE from Cognition that runs the Devin agent locally or in the cloud, plus other ACP agents on paid plans. Splash, a free, open-source app with no editor, drives every agent over the Agent Client Protocol.',
	other: {
		name: 'Devin Desktop',
		url: 'https://devin.ai/desktop',
		maker: 'Cognition',
		summary: 'An AI IDE built on VS Code, formerly Windsurf. It runs Cognition’s Devin Local agent and third-party ACP agents on your computer, sends work to Devin Cloud VMs, and tracks every agent on one board.',
		cite: ['devin-desktop-intro', 'devin-desktop-faq', 'devin-desktop-changelog', 'devin-desktop-acp', 'devin-desktop-cloud', 'devin-desktop-acc']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop IDE forked from VS Code, formerly Windsurf, with its agent manager, the Agent Command Center, as the main view', cite: ['devin-desktop-rebrand', 'devin-desktop-faq', 'devin-desktop-changelog'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v3.10.48 (29 September 2026), renamed from Windsurf on 2 June 2026; a beta Next channel gets features first', cite: ['devin-desktop-changelog', 'devin-desktop-faq', 'devin-desktop-rebrand', 'devin-desktop-changelog-next', 'devin-desktop-download'] } },
				{ label: 'License', splash: S.license, other: { text: 'Proprietary; Cognition’s platform terms reserve all rights and forbid reverse engineering any part of the software', cite: ['devin-desktop-terms', 'devin-desktop-acp'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free with a light quota; Pro $20 a month, Max $200, Teams $80 plus $40 per full seat, Enterprise custom', cite: ['devin-desktop-pricing'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon and Intel), Windows 10+ on x64 and arm64, Linux x64 (.tar.gz and .deb); no Linux arm64 build', cite: ['devin-desktop-download', 'devin-desktop-changelog'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Devin Local and Devin Cloud; on Pro, Max and Teams, any ACP agent, such as Codex CLI, Claude Agent, OpenCode or Gemini CLI', cite: ['devin-desktop-acp', 'devin-desktop-rebrand', 'devin-desktop-local'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'ACP over stdio, each local agent a sub-process, Devin Local included; Devin Cloud sessions use a remote ACP connection', cite: ['devin-desktop-acp-custom', 'devin-desktop-changelog', 'devin-desktop-local', 'devin-desktop-cloud'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Devin’s agents draw on your plan’s quota, or GPT usage on a linked ChatGPT plan; third-party agents sign in and bill separately', cite: ['devin-desktop-cloud', 'devin-desktop-chatgpt', 'devin-desktop-acp'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'A Devin account, free to create; you sign in or paste a Devin API key. No account-free mode is documented', cite: ['devin-desktop-getting-started'] } },
				{ label: 'Model and mode pickers', splash: S.models, other: { text: 'OpenAI, Claude, Gemini, SpaceXAI and open models on paid plans, plus SWE-2 and Fusion and Adaptive routing; no ACP session modes', mark: 'partial', cite: ['devin-desktop-pricing', 'devin-desktop-home', 'devin-desktop-fusion', 'devin-desktop-adaptive', 'devin-desktop-acp-custom'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Devin Local applies allow, ask and deny rules with editable request cards; ACP agents’ permission requests are passed to you', mark: 'yes', cite: ['devin-desktop-local', 'devin-desktop-acp-custom'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Devin Local reads MCP servers from config files, with a marketplace and OAuth, and asks before each tool call by default', mark: 'yes', cite: ['devin-desktop-local', 'devin-desktop-changelog'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Git worktrees for Devin Local sessions, with a Merge button and optional OS sandbox; a VM per Devin Cloud session', mark: 'yes', cite: ['devin-desktop-local', 'devin-desktop-changelog', 'devin-desktop-cloud'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'A post_setup_worktree hook runs in each new worktree to install dependencies or copy .env files; dev-server ports aren’t documented', mark: 'yes', cite: ['devin-desktop-worktrees', 'devin-desktop-changelog'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Kanban board of local and cloud agents by status, an agent inbox, and opt-in OS alerts when sessions finish or need input', mark: 'yes', cite: ['devin-desktop-acc', 'devin-desktop-changelog'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Hands a local agent’s plan to Devin Cloud in one click, and Devin’s PRs back to local agents; subagents are in preview', mark: 'yes', cite: ['devin-desktop-cloud', 'devin-desktop-windsurf-2', 'devin-desktop-local'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'Previews show your local dev server in the IDE; captured page elements and console errors become context for the agent', mark: 'yes', cite: ['devin-desktop-previews'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Inline diff zones to accept or reject each hunk, on for all agents by default; Devin Local adds a second-agent Quick Review', mark: 'yes', cite: ['devin-desktop-advanced', 'devin-desktop-quick-review'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'A full VS Code-based editor: editing, debugging, syntax highlighting and Tab completions alongside the agents', mark: 'yes', cite: ['devin-desktop-home', 'devin-desktop-pricing', 'devin-desktop-changelog'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Devin Cloud opens PRs and replies to review comments, and Spaces collect agents’ PRs; no create-PR action for local agents is documented', mark: 'partial', cite: ['devin-desktop-github', 'devin-desktop-spaces'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Devin Review syncs PR reviews with GitHub and can merge or set auto-merge; Devin Cloud reads CI check results', mark: 'yes', cite: ['devin-desktop-review', 'devin-desktop-github'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'Devin Cloud turns Linear and Jira Cloud tickets into PRs on Pro and up; the IDE offers Linear and Atlassian MCP servers', mark: 'yes', cite: ['devin-desktop-linear', 'devin-desktop-jira', 'devin-desktop-pricing', 'devin-desktop-home'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Cloud execution', splash: S.cloud, other: { text: 'A VM per Devin Cloud session that runs on with your laptop shut; Pro and Max allow 10 at once, Free none', mark: 'yes', cite: ['devin-desktop-cloud', 'devin-desktop-pricing'] } },
				{ label: 'Remote access', splash: S.remote, other: { text: 'Remote agent hosts over SSH from the location picker, plus Remote-SSH to Linux hosts, WSL (beta) and Dev Containers in the editor', mark: 'yes', cite: ['devin-desktop-changelog', 'devin-desktop-advanced'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Devin Local sessions are shared with Devin CLI, and Cascade chats can carry on in Devin Local; other tools’ sessions aren’t documented', mark: 'partial', cite: ['devin-desktop-changelog', 'devin-desktop-local'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Not documented; there is an agent search, and the sidebar filters, sorts and groups sessions', mark: 'unknown', cite: ['devin-desktop-changelog', 'devin-desktop-acc'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Both drive agents over the <strong>Agent Client Protocol</strong>. Devin Desktop launches local ACP agents, its own Devin Local included, as sub-processes over stdio and reaches Devin Cloud sessions over a remote ACP link; third-party agents need Pro, Max or Teams and can’t open terminals in its UI. Splash drives every agent over ACP, natively or through a pinned adapter.',
			cite: ['devin-desktop-acp-custom', 'devin-desktop-acp', 'devin-desktop-changelog', 'devin-desktop-cloud', 'splash-registry', 'acp']
		},
		{
			title: 'Where agents run',
			text: 'Devin Desktop runs agents on your computer, on SSH hosts, or in <strong>Devin Cloud</strong>, which gives each session a VM that carries on when your laptop is shut and stays in sync with the Devin web app. Splash runs agents as child processes on your computer, or under <code>splash-server</code> on a machine you reach through an SSH tunnel.',
			cite: ['devin-desktop-cloud', 'devin-desktop-changelog', 'splash-readme', 'splash-server']
		},
		{
			title: 'Price, accounts and license',
			text: 'Devin Desktop is proprietary and needs a Devin account. The Free plan has a light quota and no Devin Cloud; Pro costs $20 a month and Max $200, and paid plans can buy usage past the quota at API list prices. Splash is free, MIT-licensed and has no accounts; each agent runs on its own CLI login.',
			cite: ['devin-desktop-terms', 'devin-desktop-getting-started', 'devin-desktop-pricing', 'devin-desktop-quota', 'splash-license', 'splash-download', 'splash-build', 'splash-agents']
		},
		{
			title: 'Editor or workbench',
			text: 'Devin Desktop is a full IDE built on VS Code: you edit code, accept or reject agent edits hunk by hunk, preview your dev server and run Quick Review. Splash has no editor; files open read-only, and its tools center on the conversation: a Needs attention queue, a review screen, transcript search and importing sessions agents started elsewhere.',
			cite: ['devin-desktop-home', 'devin-desktop-advanced', 'devin-desktop-previews', 'devin-desktop-quick-review', 'splash-features', 'splash-file-tab', 'splash-history']
		},
		{
			title: 'Pull requests and trackers',
			text: 'Devin Cloud opens pull requests, answers review comments and takes Linear and Jira tickets. <strong>Devin Review</strong>, opened from PR cards, reviews PRs on GitHub, GitLab and Azure DevOps and can merge them, most fully on GitHub; Bitbucket Cloud isn’t supported. Splash shows a session’s PR, starts worktrees from PR heads and has a GitHub triage view; it doesn’t create PRs.',
			cite: ['devin-desktop-github', 'devin-desktop-linear', 'devin-desktop-jira', 'devin-desktop-review', 'devin-desktop-changelog', 'splash-features', 'splash-github']
		}
	],
	fit: {
		splash: [
			'You want a free, MIT-licensed app with no account, plan or usage quota.',
			'You want Claude Code, Codex, Gemini and other agents in one app, each on its own CLI login.',
			'You want to import conversations your agents started outside the app and search their text with the rest.',
			'You want a GitHub view of issues, pull requests and Actions runs across repositories.'
		],
		other: [
			'You want a full VS Code-based editor, with Tab completions and hunk-by-hunk review of agent edits, in the same app as your agents.',
			'You want agents on cloud VMs that keep going while your laptop is shut, with a one-click handoff from a local plan.',
			'You want Devin to take Linear or Jira tickets and come back with pull requests.',
			'You want to preview your dev server in the IDE and send page elements to the agent.'
		]
	},
	sources: [
		{ id: 'devin-desktop-home', title: 'Devin Desktop', url: 'https://devin.ai/desktop', publisher: 'Cognition', checked: '2026-10-10' },
		{ id: 'devin-desktop-intro', title: 'Introducing Devin Desktop', url: 'https://docs.devin.ai/desktop/introducing-devin-desktop', publisher: 'Cognition', checked: '2026-10-10' },
		{ id: 'devin-desktop-faq', title: 'Devin Desktop FAQ', url: 'https://docs.devin.ai/desktop/devin-desktop-faq', publisher: 'Cognition', checked: '2026-10-10' },
		{ id: 'devin-desktop-rebrand', title: 'Windsurf is now Devin Desktop', url: 'https://devin.ai/blog/windsurf-is-now-devin-desktop', publisher: 'Cognition', checked: '2026-10-10' },
		{ id: 'devin-desktop-windsurf-2', title: 'Windsurf 2.0: Introducing the Agent Command Center', url: 'https://devin.ai/blog/windsurf-2-0', publisher: 'Cognition', checked: '2026-10-10' },
		{ id: 'devin-desktop-changelog', title: 'Devin Desktop changelog', url: 'https://docs.devin.ai/desktop/changelog', publisher: 'Cognition', checked: '2026-10-10' },
		{ id: 'devin-desktop-changelog-next', title: 'Changelog (Next)', url: 'https://docs.devin.ai/desktop/changelog-next', publisher: 'Cognition', checked: '2026-10-10' },
		{ id: 'devin-desktop-download', title: 'Download', url: 'https://devin.ai/download', publisher: 'Cognition', checked: '2026-10-10' },
		{ id: 'devin-desktop-terms', title: 'Platform Terms of Service', url: 'https://cognition.com/legal/platform-terms-of-service', publisher: 'Cognition', checked: '2026-10-10' },
		{ id: 'devin-desktop-pricing', title: 'Plans and Pricing', url: 'https://devin.ai/pricing', publisher: 'Cognition', checked: '2026-10-10' },
		{ id: 'devin-desktop-quota', title: 'Quota-Based Usage', url: 'https://docs.devin.ai/desktop/accounts/quota', publisher: 'Cognition', checked: '2026-10-10' },
		{ id: 'devin-desktop-getting-started', title: 'Welcome to Devin Desktop', url: 'https://docs.devin.ai/desktop/getting-started', publisher: 'Cognition', checked: '2026-10-10' },
		{ id: 'devin-desktop-acp', title: 'Agent Client Protocol', url: 'https://docs.devin.ai/desktop/acp', publisher: 'Cognition', checked: '2026-10-10' },
		{ id: 'devin-desktop-acp-custom', title: 'Building a custom ACP agent', url: 'https://docs.devin.ai/desktop/acp-custom', publisher: 'Cognition', checked: '2026-10-10' },
		{ id: 'devin-desktop-local', title: 'Devin Local Agent', url: 'https://docs.devin.ai/desktop/devin-local', publisher: 'Cognition', checked: '2026-10-10' },
		{ id: 'devin-desktop-cloud', title: 'Devin in Devin Desktop', url: 'https://docs.devin.ai/desktop/devin', publisher: 'Cognition', checked: '2026-10-10' },
		{ id: 'devin-desktop-chatgpt', title: 'Use your ChatGPT plan in Devin', url: 'https://docs.devin.ai/admin/billing/chatgpt', publisher: 'Cognition', checked: '2026-10-10' },
		{ id: 'devin-desktop-fusion', title: 'Fusion in Devin Desktop', url: 'https://docs.devin.ai/desktop/fusion', publisher: 'Cognition', checked: '2026-10-10' },
		{ id: 'devin-desktop-adaptive', title: 'Adaptive', url: 'https://docs.devin.ai/desktop/adaptive', publisher: 'Cognition', checked: '2026-10-10' },
		{ id: 'devin-desktop-acc', title: 'Agent Command Center', url: 'https://docs.devin.ai/desktop/agent-command-center', publisher: 'Cognition', checked: '2026-10-10' },
		{ id: 'devin-desktop-worktrees', title: 'Worktrees', url: 'https://docs.devin.ai/desktop/cascade/worktrees', publisher: 'Cognition', checked: '2026-10-10' },
		{ id: 'devin-desktop-previews', title: 'Devin Desktop Previews', url: 'https://docs.devin.ai/desktop/previews', publisher: 'Cognition', checked: '2026-10-10' },
		{ id: 'devin-desktop-advanced', title: 'Advanced Configuration', url: 'https://docs.devin.ai/desktop/advanced', publisher: 'Cognition', checked: '2026-10-10' },
		{ id: 'devin-desktop-quick-review', title: 'Quick Review', url: 'https://docs.devin.ai/desktop/quick-review', publisher: 'Cognition', checked: '2026-10-10' },
		{ id: 'devin-desktop-spaces', title: 'Spaces', url: 'https://docs.devin.ai/desktop/spaces', publisher: 'Cognition', checked: '2026-10-10' },
		{ id: 'devin-desktop-github', title: 'Devin GitHub integration', url: 'https://docs.devin.ai/integrations/gh', publisher: 'Cognition', checked: '2026-10-10' },
		{ id: 'devin-desktop-review', title: 'Devin Review', url: 'https://docs.devin.ai/work-with-devin/devin-review', publisher: 'Cognition', checked: '2026-10-10' },
		{ id: 'devin-desktop-linear', title: 'Linear', url: 'https://docs.devin.ai/integrations/linear', publisher: 'Cognition', checked: '2026-10-10' },
		{ id: 'devin-desktop-jira', title: 'Devin Jira integration', url: 'https://docs.devin.ai/integrations/jira', publisher: 'Cognition', checked: '2026-10-10' }
	]
};
