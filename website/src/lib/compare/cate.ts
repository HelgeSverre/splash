// Splash vs Cate. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const CATE: Comparison = {
	slug: 'cate',
	name: 'Cate',
	description: 'How Splash and Cate compare on agents, platforms, pricing, worktrees, review and remote hosts, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Cate are both open-source desktop apps that run several coding agents at once, with git worktrees to keep their work apart. Cate places agent terminals, chat panels, editors and browsers on an infinite canvas and reads agent status from each CLI’s hooks; Splash drives every agent over the Agent Client Protocol and shows its work as a transcript.',
	other: {
		name: 'Cate',
		url: 'https://cate.cero-ai.com',
		maker: '0-AI UG',
		summary: 'An MIT-licensed Electron app that puts terminals, editors, browsers and agent chats on an infinite canvas, gives each git worktree its own area, and runs agents locally or on SSH and WSL hosts.',
		cite: ['cate-readme', 'cate-license', 'cate-package']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app that lays out terminals, agent chats, editors and browsers on an infinite canvas, with a cate CLI for agents', cite: ['cate-home', 'cate-readme', 'cate-cli-skill'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v2.0.5, released 30 September 2026; the stable 2.0 line began on 13 September 2026 after three betas', cite: ['cate-release', 'cate-changelog'] } },
				{ label: 'License', splash: S.license, other: { text: 'Open source (MIT)', cite: ['cate-license', 'cate-package'] } },
				{ label: 'Price', splash: S.price, other: { text: 'No documented price or paid plan; Product Hunt lists it as free. A paid, hosted Cate Cloud is planned, not released', cite: ['cate-home', 'cate-product-hunt', 'cate-plan'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon and Intel; the Homebrew cask needs 12+), Windows x64, Linux x64 as AppImage, .deb or tar.gz', cite: ['cate-readme', 'cate-release', 'cate-brew'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Electron, React and TypeScript, with xterm.js terminals on node-pty and Monaco editors', cite: ['cate-package', 'cate-agents-md'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Terminal hooks for Claude Code, Codex, Cursor, Grok, Hermes, Kiro and OpenCode; other CLIs run without status. The README lists five of these plus Antigravity for chat panels', cite: ['cate-agents-ts', 'cate-readme', 'cate-blog-hooks', 'cate-t3-drivers'] } },
				{ label: 'How it runs agents', hint: 'The protocol or interface', splash: S.protocol, other: { text: 'CLIs run in a terminal and report through their own hooks; chat panels embed T3 Code, which uses vendor SDKs, the Codex app-server or ACP', cite: ['cate-agent-hooks', 'cate-agents-md', 'cate-harness', 'cate-package', 'cate-t3-npm', 'cate-t3-codex', 'cate-t3-cursor', 'cate-agent-change-edits'] } },
				{ label: 'Agent sign-in', splash: S.signIn, other: { text: 'For chat panels, Cate runs each vendor CLI’s own login command; model requests go straight from your computer to your provider, with local credentials', cite: ['cate-provider-auth', 'cate-privacy'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'No Cate account is documented; GitHub features use a signed-in gh CLI, and optional T3 Connect needs a T3 Connect account', cite: ['cate-privacy', 'cate-github-prs', 'cate-t3-remote-access'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Chat panels show approvals; terminal CLIs prompt as usual and Cate flags the panel as waiting, except for Cursor and Kiro', mark: 'yes', cite: ['cate-readme', 'cate-agent-activity'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A git worktree and branch per task, from a local or remote branch or open PR, in its own canvas area', mark: 'yes', cite: ['cate-readme'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'None documented, and a workspace needs no config files; new worktrees get the project’s agent skills synced in', mark: 'no', cite: ['cate-readme', 'cate-git-ipc'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'xterm.js terminals on the canvas or in docks; after a restart they return with scrollback, each agent resuming its session', mark: 'yes', cite: ['cate-readme', 'cate-agents-md'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Per-terminal status (working, finished, waiting on you) and a notification when an agent needs input; none for CLIs without hooks', mark: 'yes', cite: ['cate-readme', 'cate-blog-hooks'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'With CLI permission, an agent can list, message, wait on and read other visible agent panels, terminal or T3, through cate agent', mark: 'yes', cite: ['cate-cli-skill'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'Browser panels on the canvas; agents drive them with JavaScript through the cate CLI, and their clicks show in the panel', mark: 'yes', cite: ['cate-readme', 'cate-cli-skill'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Diff Review of working-tree, staged, commit or branch changes, with notes; can start a review agent or request changes from one', mark: 'yes', cite: ['cate-changelog', 'cate-review-controls', 'cate-cli-skill'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'Monaco editors, source control across repos, a file tree with git badges, split diffs, ripgrep search, PDF, image and DOCX viewers', mark: 'yes', cite: ['cate-readme'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'A review panel can stage, commit, push and open a PR with gh pr create, or GitHub’s compare page without gh', mark: 'yes', cite: ['cate-changelog', 'cate-vcs', 'cate-git-review-panel'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Through gh: PRs you opened or were asked to review, with check status; worktrees start from open PRs. Merging PRs isn’t documented', mark: 'yes', cite: ['cate-github-prs', 'cate-changelog', 'cate-readme', 'cate-vcs'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'No Linear, Jira, GitLab or GitHub Issues integration is documented', mark: 'no', cite: ['cate-readme'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'SSH or WSL hosts run agents, terminals, git and search via cate-runtime; the canvas stays local. T3 Connect remote access is for local workspaces, not remote hosts', mark: 'yes', cite: ['cate-readme', 'cate-electron-builder', 'cate-changelog', 'cate-harness'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Packaged builds check GitHub for new versions and update through electron-updater; the Homebrew cask marks the app as self-updating', mark: 'yes', cite: ['cate-privacy', 'cate-package', 'cate-changelog', 'cate-brew'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented; restored terminals resume each CLI’s own session, and cate agent read reads a live agent’s conversation', mark: 'unknown', cite: ['cate-cli-skill', 'cate-readme'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'No search across agent sessions is documented', mark: 'unknown', cite: ['cate-cli-skill'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Cate runs each agent’s CLI in a terminal and reads its state from hooks it configures in workspace files. Its chat panels embed T3 Code 0.0.39, which reaches Claude and OpenCode through their SDKs, Codex through its app-server protocol, and Cursor and Grok over ACP. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, natively or via an adapter.',
			cite: ['cate-agent-hooks', 'cate-blog-hooks', 'cate-harness', 'cate-package', 'cate-t3-npm', 'cate-t3-codex', 'cate-t3-cursor', 'cate-agent-change-edits', 'splash-registry', 'acp']
		},
		{
			title: 'Canvas or conversation',
			text: 'Cate lays out terminals, Monaco editors, browsers, document viewers and review panels on an infinite canvas, gives each worktree a colored area, and offers a <code>cate</code> CLI through which agents drive panels and message other agents. Splash is organized around the conversation: a rendered transcript, a <strong>Needs attention</strong> queue, a review screen and full-text search of saved sessions.',
			cite: ['cate-readme', 'cate-cli-skill', 'cate-changelog', 'splash-features']
		},
		{
			title: 'Where agents run',
			text: 'Cate runs agents on your computer or on an SSH or WSL host, which pulls its own <code>cate-runtime</code> daemon, while the canvas, editors and browser stay on your machine. Its T3 Connect remote-access setup (2.0.4) is for local workspaces, not remote hosts. Splash runs agents on your computer, or under <code>splash-server</code> on a machine you open in a browser through an SSH tunnel.',
			cite: ['cate-readme', 'cate-electron-builder', 'cate-changelog', 'cate-harness', 'splash-readme', 'splash-server']
		},
		{
			title: 'Review and pull requests',
			text: 'Cate’s review panels cover working-tree, staged, commit and branch diffs, record agent findings through the <code>cate</code> CLI, and can stage, commit, push and open a pull request with <code>gh pr create</code>. Splash reviews a session’s latest response and changed files, shows a branch’s PR and lists GitHub issues, PRs and Actions runs; it does not create PRs.',
			cite: ['cate-changelog', 'cate-cli-skill', 'cate-vcs', 'splash-features', 'splash-github']
		},
		{
			title: 'Platforms, price and updates',
			text: 'Both are MIT-licensed. Splash is free; Cate documents no price, and its repository plans a paid, hosted Cate Cloud that has not shipped. Cate builds cover macOS, Windows x64 and Linux x64 and check GitHub for updates. Splash builds cover macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64, and you download new versions from GitHub Releases yourself.',
			cite: ['cate-license', 'cate-home', 'cate-plan', 'cate-readme', 'cate-privacy', 'splash-license', 'splash-download', 'splash-install', 'splash-about']
		}
	],
	fit: {
		splash: [
			'You want every agent driven over the Agent Client Protocol, each session shown as a transcript with permission requests answered in it.',
			'You want one Needs attention queue and full-text search across saved sessions, archived ones included.',
			'You want to import conversations your agents started outside the app.',
			'You want a GitHub view of issues, pull requests and Actions runs across repositories.'
		],
		other: [
			'You want terminals, editors, browsers and agent chats arranged on an infinite canvas, one colored area per worktree.',
			'You want each agent’s own CLI in a terminal, with hook-based status and sessions that resume after a restart.',
			'You want to review branch diffs, then commit, push and open a pull request from the same panel.',
			'You want agents to drive browser panels and message or read other agents through a CLI.'
		]
	},
	sources: [
		{ id: 'cate-home', title: 'CATE · Canvas Terminal Editor', url: 'https://cate.cero-ai.com/', publisher: '0-AI UG', checked: '2026-10-10' },
		{ id: 'cate-privacy', title: 'Privacy Policy', url: 'https://cate.cero-ai.com/privacy', publisher: '0-AI UG', checked: '2026-10-10' },
		{ id: 'cate-blog-hooks', title: 'How we made six coding-agent CLIs observable without wrapping their processes', url: 'https://cate.cero-ai.com/blog/observing-six-coding-agent-clis', publisher: '0-AI UG', checked: '2026-10-10' },
		{ id: 'cate-product-hunt', title: 'Cate on Product Hunt', url: 'https://www.producthunt.com/products/cate', publisher: 'Product Hunt', checked: '2026-10-10' },
		{ id: 'cate-readme', title: 'README.md', url: 'https://github.com/0-AI-UG/cate/blob/main/README.md', publisher: '0-AI-UG/cate on GitHub', checked: '2026-10-10' },
		{ id: 'cate-license', title: 'LICENSE', url: 'https://github.com/0-AI-UG/cate/blob/main/LICENSE', publisher: '0-AI-UG/cate on GitHub', checked: '2026-10-10' },
		{ id: 'cate-package', title: 'package.json', url: 'https://github.com/0-AI-UG/cate/blob/main/package.json', publisher: '0-AI-UG/cate on GitHub', checked: '2026-10-10' },
		{ id: 'cate-agents-md', title: 'AGENTS.md', url: 'https://github.com/0-AI-UG/cate/blob/main/AGENTS.md', publisher: '0-AI-UG/cate on GitHub', checked: '2026-10-10' },
		{ id: 'cate-changelog', title: 'CHANGELOG.md', url: 'https://github.com/0-AI-UG/cate/blob/main/CHANGELOG.md', publisher: '0-AI-UG/cate on GitHub', checked: '2026-10-10' },
		{ id: 'cate-release', title: 'Release v2.0.5', url: 'https://github.com/0-AI-UG/cate/releases/tag/v2.0.5', publisher: '0-AI-UG/cate on GitHub', checked: '2026-10-10' },
		{ id: 'cate-electron-builder', title: 'electron-builder.yml', url: 'https://github.com/0-AI-UG/cate/blob/main/electron-builder.yml', publisher: '0-AI-UG/cate on GitHub', checked: '2026-10-10' },
		{ id: 'cate-plan', title: 'Cate Cloud: EC2 Remote Workspaces (plan.md)', url: 'https://github.com/0-AI-UG/cate/blob/main/plan.md', publisher: '0-AI-UG/cate on GitHub', checked: '2026-10-10' },
		{ id: 'cate-agents-ts', title: 'src/shared/agents.ts', url: 'https://github.com/0-AI-UG/cate/blob/main/src/shared/agents.ts', publisher: '0-AI-UG/cate on GitHub', checked: '2026-10-10' },
		{ id: 'cate-agent-hooks', title: 'src/shared/agentHooks.ts', url: 'https://github.com/0-AI-UG/cate/blob/main/src/shared/agentHooks.ts', publisher: '0-AI-UG/cate on GitHub', checked: '2026-10-10' },
		{ id: 'cate-agent-change-edits', title: 'src/runtime/capabilities/agentChangeEdits.ts', url: 'https://github.com/0-AI-UG/cate/blob/main/src/runtime/capabilities/agentChangeEdits.ts', publisher: '0-AI-UG/cate on GitHub', checked: '2026-10-10' },
		{ id: 'cate-harness', title: 'src/main/t3Agent/T3HarnessManager.ts', url: 'https://github.com/0-AI-UG/cate/blob/main/src/main/t3Agent/T3HarnessManager.ts', publisher: '0-AI-UG/cate on GitHub', checked: '2026-10-10' },
		{ id: 'cate-provider-auth', title: 'src/main/t3Agent/providerAuth.ts', url: 'https://github.com/0-AI-UG/cate/blob/main/src/main/t3Agent/providerAuth.ts', publisher: '0-AI-UG/cate on GitHub', checked: '2026-10-10' },
		{ id: 'cate-github-prs', title: 'src/main/github/pullRequests.ts', url: 'https://github.com/0-AI-UG/cate/blob/main/src/main/github/pullRequests.ts', publisher: '0-AI-UG/cate on GitHub', checked: '2026-10-10' },
		{ id: 'cate-git-ipc', title: 'src/main/ipc/git.ts', url: 'https://github.com/0-AI-UG/cate/blob/main/src/main/ipc/git.ts', publisher: '0-AI-UG/cate on GitHub', checked: '2026-10-10' },
		{ id: 'cate-review-controls', title: 'src/renderer/panels/ReviewControls.tsx', url: 'https://github.com/0-AI-UG/cate/blob/main/src/renderer/panels/ReviewControls.tsx', publisher: '0-AI-UG/cate on GitHub', checked: '2026-10-10' },
		{ id: 'cate-git-review-panel', title: 'src/renderer/panels/GitReviewPanel.tsx', url: 'https://github.com/0-AI-UG/cate/blob/main/src/renderer/panels/GitReviewPanel.tsx', publisher: '0-AI-UG/cate on GitHub', checked: '2026-10-10' },
		{ id: 'cate-vcs', title: 'src/runtime/capabilities/vcs.ts', url: 'https://github.com/0-AI-UG/cate/blob/main/src/runtime/capabilities/vcs.ts', publisher: '0-AI-UG/cate on GitHub', checked: '2026-10-10' },
		{ id: 'cate-cli-skill', title: 'skills/cate-cli/SKILL.md', url: 'https://github.com/0-AI-UG/cate/blob/main/skills/cate-cli/SKILL.md', publisher: '0-AI-UG/cate on GitHub', checked: '2026-10-10' },
		{ id: 'cate-agent-activity', title: 'docs/agent-activity.md', url: 'https://github.com/0-AI-UG/cate/blob/main/docs/agent-activity.md', publisher: '0-AI-UG/cate on GitHub', checked: '2026-10-10' },
		{ id: 'cate-brew', title: 'Homebrew cask: cate', url: 'https://formulae.brew.sh/api/cask/cate.json', publisher: 'Homebrew', checked: '2026-10-10' },
		{ id: 'cate-t3-npm', title: 't3@0.0.39 registry metadata', url: 'https://registry.npmjs.org/t3/0.0.39', publisher: 'npm', checked: '2026-10-10' },
		{ id: 'cate-t3-drivers', title: 'builtInDrivers.ts at v0.0.39', url: 'https://github.com/pingdotgg/t3code/blob/v0.0.39/apps/server/src/provider/builtInDrivers.ts', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-10' },
		{ id: 'cate-t3-codex', title: 'CodexAdapter.ts at v0.0.39', url: 'https://github.com/pingdotgg/t3code/blob/v0.0.39/apps/server/src/provider/Layers/CodexAdapter.ts', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-10' },
		{ id: 'cate-t3-cursor', title: 'CursorAdapter.ts at v0.0.39', url: 'https://github.com/pingdotgg/t3code/blob/v0.0.39/apps/server/src/provider/Layers/CursorAdapter.ts', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-10' },
		{ id: 'cate-t3-remote-access', title: 'docs/user/remote-access.md', url: 'https://github.com/pingdotgg/t3code/blob/main/docs/user/remote-access.md', publisher: 'pingdotgg/t3code on GitHub', checked: '2026-10-10' }
	]
};
