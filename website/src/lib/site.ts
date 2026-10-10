// Facts the whole site repeats, in one place.
export const SITE_URL = 'https://splash.computer';
export const SITE_NAME = 'Splash';
export const REPO = 'https://github.com/HelgeSverre/splash';
export const RELEASES_URL = `${REPO}/releases`;
export const ISSUES_URL = `${REPO}/issues`;
export const ACP_URL = 'https://agentclientprotocol.com';

/**
 * Comparison pages (/vs/<slug>), alphabetical. Their data is in src/lib/compare.
 * `group` sorts the /vs hub: an agent or IDE maker's own app, or an independent
 * app. `featured` ones are also linked from the footer.
 */
export type ComparisonLink = { slug: string; name: string; group: 'vendor' | 'app'; featured?: true };
export const COMPARISON_LINKS: ComparisonLink[] = [
	{ slug: 'agent-orchestrator', name: 'Agent Orchestrator', group: 'app' },
	{ slug: 'agent-teams', name: 'Agent Teams AI', group: 'app' },
	{ slug: 'agentgrid', name: 'AgentGrid', group: 'app' },
	{ slug: 'aionui', name: 'AionUi', group: 'app' },
	{ slug: 'atlas-agents', name: 'Atlas', group: 'app' },
	{ slug: 'augment-intent', name: 'Intent', group: 'app' },
	{ slug: 'automaker', name: 'Automaker', group: 'app' },
	{ slug: 'baton', name: 'Baton', group: 'app' },
	{ slug: 'bb', name: 'bb', group: 'app' },
	{ slug: 'cate', name: 'Cate', group: 'app' },
	{ slug: 'ccgui', name: 'ccgui', group: 'app' },
	{ slug: 'claude-desktop', name: 'Claude Code Desktop', group: 'vendor', featured: true },
	{ slug: 'cmux', name: 'cmux', group: 'app' },
	{ slug: 'codeg', name: 'Codeg', group: 'app' },
	{ slug: 'codelayer', name: 'HumanLayer', group: 'app' },
	{ slug: 'codelegate', name: 'Codelegate', group: 'app' },
	{ slug: 'codex-app', name: 'ChatGPT desktop app', group: 'vendor', featured: true },
	{ slug: 'conductor', name: 'Conductor', group: 'app', featured: true },
	{ slug: 'emdash', name: 'Emdash', group: 'app' },
	{ slug: 'github-copilot-app', name: 'GitHub Copilot app', group: 'vendor', featured: true },
	{ slug: 'golutra', name: 'Golutra', group: 'app' },
	{ slug: 'happy', name: 'Happy', group: 'app' },
	{ slug: 'jean', name: 'Jean', group: 'app' },
	{ slug: 'kepler', name: 'Kepler', group: 'app' },
	{ slug: 'kimi-code', name: 'Kimi Code Desktop', group: 'vendor' },
	{ slug: 'kiro-crew', name: 'Kiro Crew', group: 'vendor' },
	{ slug: 'maestro', name: 'Maestro', group: 'app' },
	{ slug: 'monocode', name: 'MonoCode', group: 'app' },
	{ slug: 'munder-difflin', name: 'Munder Difflin', group: 'app' },
	{ slug: 'nezha', name: 'Nezha', group: 'app' },
	{ slug: 'nodeterm', name: 'nodeterm', group: 'app' },
	{ slug: 'opencode-desktop', name: 'OpenCode Desktop', group: 'vendor' },
	{ slug: 'orca', name: 'Orca', group: 'app', featured: true },
	{ slug: 'org-2', name: 'ORG-2', group: 'app' },
	{ slug: 'paseo', name: 'Paseo', group: 'app' },
	{ slug: 'piebald', name: 'Piebald', group: 'vendor' },
	{ slug: 'polyscope', name: 'Polyscope', group: 'app' },
	{ slug: 'poolside', name: 'Poolside Assistant for desktop', group: 'vendor' },
	{ slug: 'shikigami', name: 'Shikigami', group: 'app' },
	{ slug: 'soloterm', name: 'Solo', group: 'app', featured: true },
	{ slug: 'supacode', name: 'Supacode', group: 'app' },
	{ slug: 'superset', name: 'Superset', group: 'app' },
	{ slug: 'synara', name: 'Synara', group: 'app' },
	{ slug: 't3-code', name: 'T3 Code', group: 'app' },
	{ slug: 'verdent', name: 'Verdent', group: 'vendor' },
	{ slug: 'xum', name: 'Xum', group: 'app' },
	{ slug: 'zed-delta', name: 'Delta', group: 'app' },
	{ slug: 'zenflow', name: 'Zenflow', group: 'app' },
	{ slug: 'zeron', name: 'Zeron', group: 'app' }
];

/** `summary` is the nav menu line, `title` the page's H1, `description` its search snippet. */
export type FeatureLink = { slug: string; name: string; summary: string; title: string; description: string };

/** Feature pages, in nav order. */
export const FEATURES: FeatureLink[] = [
	{
		slug: 'sessions',
		name: 'Sessions & worktrees',
		summary: 'Each agent in its own checkout, streaming tool calls, diffs and plans.',
		title: 'Every agent gets its own checkout.',
		description: 'Run coding agents side by side. Each Splash session is one agent in one folder or its own git worktree, streaming tool calls, diffs and plans as it works.'
	},
	{
		slug: 'attention',
		name: 'Needs attention',
		summary: 'One queue for permissions, crashes and finished work.',
		title: 'Stop checking every tab.',
		description: "Every permission prompt, crashed agent and finished turn lands in one queue that survives restarts, so you stop checking every agent's tab."
	},
	{
		slug: 'review',
		name: 'Review',
		summary: 'The diff, the failures and the final answer, side by side.',
		title: 'Review the work, not the scrollback.',
		description: 'When an agent finishes, Splash shows the diff, anything that failed and the final answer side by side, with a box to tell the agent what to fix.'
	},
	{
		slug: 'history',
		name: 'Agent history',
		summary: 'Find, preview and continue sessions started anywhere.',
		title: 'Your conversations, wherever they started.',
		description: "Find, preview and continue coding agent sessions started anywhere, including Claude Code's terminal. Search every saved transcript, archived ones included."
	},
	{
		slug: 'github',
		name: 'GitHub & Actions',
		summary: 'Triage issues and runs, then work on one in a worktree.',
		title: 'From issue to worktree in one click.',
		description: 'Triage GitHub issues, pull requests and failing Actions runs across your repositories, then start an agent session on one in a fresh worktree.'
	},
	{
		slug: 'server',
		name: 'Splash over SSH',
		summary: 'Agents on your workstation, the UI in any browser.',
		title: 'Agents on your workstation. Splash in any browser.',
		description: 'Run splash-server on the machine with your code and agent logins, then use Splash in any browser over an SSH tunnel. Close the laptop; the agents keep working.'
	},
	{
		slug: 'agents',
		name: 'Agents over ACP',
		summary: 'Claude Code, Codex, Gemini, OpenCode and more.',
		title: 'Bring the agent you already use.',
		description: 'Use Claude Code, Codex, Gemini CLI, OpenCode and more over the Agent Client Protocol. Install and sign in to each CLI yourself, and Splash finds it.'
	}
];
