// Facts the whole site repeats, in one place.
export const REPO = 'https://github.com/HelgeSverre/splash';
export const RELEASES_URL = `${REPO}/releases`;
export const ISSUES_URL = `${REPO}/issues`;
export const ACP_URL = 'https://agentclientprotocol.com';

export type FeatureLink = { slug: string; name: string; summary: string };

/** Feature pages, in nav order. */
export const FEATURES: FeatureLink[] = [
	{ slug: 'sessions', name: 'Sessions & worktrees', summary: 'Each agent in its own checkout, streaming tool calls, diffs and plans.' },
	{ slug: 'attention', name: 'Needs attention', summary: 'One queue for permissions, crashes and finished work.' },
	{ slug: 'review', name: 'Review', summary: 'The diff, the failures and the final answer, side by side.' },
	{ slug: 'history', name: 'Agent history', summary: 'Find, preview and continue sessions started anywhere.' },
	{ slug: 'github', name: 'GitHub & Actions', summary: 'Triage issues and runs, then work on one in a worktree.' },
	{ slug: 'server', name: 'Splash over SSH', summary: 'Agents on your workstation, the UI in any browser.' },
	{ slug: 'agents', name: 'Agents over ACP', summary: 'Claude Code, Codex, Gemini, OpenCode and more.' }
];
