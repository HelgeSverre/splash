// GitHub triage and Actions for the demo backend: fixtures shaped like the
// Rust `github_*` command responses (src/github.rs, src/github_actions.rs).
//
// The account is `demo`. `demo/atlas` is the remote of the demo world's local
// `atlas` project, so its items link to the sessions in the sidebar. Everything
// here is invented: handles, repositories, runs and logs.
import type {
	ActionsFilters,
	ActionsJob,
	ActionsRun,
	ActionsStep,
	ActionsWorkflow,
	GithubComment,
	GithubItem,
	GithubKind,
	GithubRepository,
	GithubSearch,
	SessionView
} from '$splash/bindings';
import * as world from './world';
import { adopt } from './backend';

type Handler = (...args: never[]) => unknown;

const LOGIN = 'demo';

/** Fixture times are fixed when the page loads, then age like real data. */
const T0 = Date.now();
const at = (ms: number) => new Date(ms).toISOString().replace(/\.\d{3}Z$/, 'Z');
/** An ISO timestamp `minutes` before the page loaded. */
const ago = (minutes: number) => at(T0 - minutes * 60_000);
const H = 60;
const D = 24 * H;

function fail(message: string): never {
	throw new Error(message);
}

// ── repositories ────────────────────────────────────────────────────────────

const REPOS: Omit<GithubRepository, 'project_ids'>[] = [
	{ full_name: 'demo/atlas', owner: 'demo', private: false, archived: false, has_issues: true, updated_at: ago(1) },
	{ full_name: 'demo/atlas-web', owner: 'demo', private: false, archived: false, has_issues: true, updated_at: ago(25) },
	{ full_name: 'demo/release-tools', owner: 'demo', private: true, archived: false, has_issues: true, updated_at: ago(50) },
	{ full_name: 'atlas-labs/cli', owner: 'atlas-labs', private: false, archived: false, has_issues: true, updated_at: ago(6) },
	{ full_name: 'atlas-labs/homebrew-tap', owner: 'atlas-labs', private: false, archived: false, has_issues: false, updated_at: ago(5 * D) }
];

/** Repository → linked Splash projects. `demo/atlas` links through its git remote. */
const links: Record<string, string[]> = { 'demo/atlas': ['atlas'] };

function catalog() {
	return { login: LOGIN, repositories: REPOS.map((r) => ({ ...r, project_ids: [...(links[r.full_name] ?? [])] })) };
}

const repoKnown = (repository: string) => REPOS.some((r) => r.full_name === repository) || fail(`Could not resolve to a Repository with the name '${repository}'.`);

// ── issues, pull requests, branches and activity ────────────────────────────

const nodeId = (prefix: string, repository: string, key: string | number) => `${prefix}_kwDO${btoa(`${repository}:${key}`).replace(/[^A-Za-z0-9]/g, '')}`;

type Extra = Partial<Omit<GithubItem, 'repository' | 'kind' | 'number' | 'title' | 'body'>>;

function base(repository: string, kind: GithubKind): Omit<GithubItem, 'id' | 'number' | 'title' | 'body' | 'url' | 'state' | 'updated_at' | 'author'> {
	return { repository, kind, assignees: [], reviewers: [], labels: [], branch: null, checks: null, review_decision: null };
}

function issue(repository: string, number: number, minutes: number, author: string, title: string, body: string, extra: Extra = {}): GithubItem {
	return { ...base(repository, 'issue'), id: nodeId('I', repository, number), number, title, body, url: `https://github.com/${repository}/issues/${number}`, state: 'OPEN', updated_at: ago(minutes), author, ...extra };
}

function pull(repository: string, number: number, minutes: number, author: string, branch: string, title: string, body: string, extra: Extra = {}): GithubItem {
	return { ...base(repository, 'pull_request'), id: nodeId('PR', repository, number), number, title, body, url: `https://github.com/${repository}/pull/${number}`, state: 'OPEN', updated_at: ago(minutes), author, branch, ...extra };
}

function branch(repository: string, name: string, minutes: number, author: string, message: string): GithubItem {
	return { ...base(repository, 'branch'), id: nodeId('REF', repository, name), number: null, title: name, body: message, url: `https://github.com/${repository}/tree/${name.split('/').map(encodeURIComponent).join('/')}`, state: 'Branch', updated_at: ago(minutes), author, branch: name };
}

let eventSeq = 52_118_400_000;
/** One entry of the repository events feed, titled the way src/github.rs titles them. */
function event(repository: string, minutes: number, actor: string, type: string, title: string, url: string, body = ''): GithubItem {
	return { ...base(repository, 'activity'), id: `event:${eventSeq++}`, number: null, title, body, url, state: type, updated_at: ago(minutes), author: actor };
}

const ATLAS = 'demo/atlas';
const WEB = 'demo/atlas-web';
const TOOLS = 'demo/release-tools';
const CLI = 'atlas-labs/cli';
const TAP = 'atlas-labs/homebrew-tap';

const ITEMS: GithubItem[] = [
	// demo/atlas: pull requests
	pull(ATLAS, 128, 1, 'demo', 'splash/session-history', 'Include the agent in cache keys', [
		'Fixes #123.',
		'',
		"Two agents working in the same project wrote to the same cache entries, so Codex could read Claude's half-finished results.",
		'',
		'- `cacheKey()` now takes the agent: `project:agent:file`',
		'- Project paths are normalized, so `/atlas/` and `/atlas` share entries',
		'- New tests cover Claude and Codex working in one project',
		'',
		'The migration for existing rows is #129.'
	].join('\n'), { checks: 'SUCCESS', review_decision: 'REVIEW_REQUIRED', reviewers: ['tobias-l'], labels: ['bug', 'cache'] }),
	pull(ATLAS, 130, 2, 'demo', 'splash/release-job', 'Accept pre-release tags in release validation', [
		'Fixes #126.',
		'',
		'`VERSION_PATTERN` only matched `vX.Y.Z`, so the Release workflow rejected `v0.3.0-rc.1` before building anything.',
		'',
		'- Parse tags with `parseVersion()`, which understands SemVer pre-release suffixes',
		'- Mark pre-releases as such on GitHub',
		'- Skip the changelog check for pre-releases',
		'',
		'**Status:** CI fails on `v0.3.0-beta.2+build.7`. Build metadata is not handled yet.'
	].join('\n'), { checks: 'FAILURE', labels: ['ci', 'release'] }),
	pull(ATLAS, 129, 48, 'tobias-l', 'tl/cache-agent-column', 'Migration 0007: add an agent column to the cache table', [
		'Adds `agent` to `cache` with a default of `\'unknown\'`, plus a `(project, agent)` index, so #128 can query by agent.',
		'',
		'- `ALTER TABLE … ADD COLUMN … DEFAULT` is metadata-only on Postgres 16, so the lock is short',
		'- The index is built `CONCURRENTLY`',
		'- Rollback drops the index, then the column',
		'',
		'Please dry-run against staging before merging.'
	].join('\n'), { checks: 'SUCCESS', review_decision: 'REVIEW_REQUIRED', reviewers: ['demo'], labels: ['cache', 'database'] }),
	pull(ATLAS, 125, 25 * H, 'ana-r', 'ar/tree-keys', 'File tree: roving focus, arrow keys and type-ahead', [
		'Closes #127.',
		'',
		'| Key | Action |',
		'| --- | --- |',
		'| ↑ ↓ | Move between rows |',
		'| → | Expand a folder, or enter it |',
		'| ← | Collapse, or go to the parent |',
		'| Home / End | First / last row |',
		'| letters | Jump to the next matching name |',
		'',
		'Focus stays on one row at a time (`tabindex="0"` roves), so Tab leaves the tree in one step.'
	].join('\n'), { state: 'MERGED', checks: 'SUCCESS', review_decision: 'APPROVED', labels: ['accessibility'] }),
	pull(ATLAS, 122, 2 * D, 'dependabot', 'dependabot/npm_and_yarn/vitest-3.2.4', 'Bump vitest from 3.2.3 to 3.2.4', 'Bumps [vitest](https://github.com/vitest-dev/vitest/tree/HEAD/packages/vitest) from 3.2.3 to 3.2.4.\n\nDependabot will resolve any conflicts with this PR as long as you don\'t alter it yourself.', { state: 'MERGED', checks: 'SUCCESS', review_decision: 'APPROVED', labels: ['dependencies'] }),
	pull(ATLAS, 119, 4 * D, 'demo', 'splash/fts-spike', 'Spike: SQLite FTS5 index for transcripts', 'Throwaway spike for #121, not for merging. Findings are in the issue.', { state: 'CLOSED', checks: 'SUCCESS', labels: ['spike'] }),

	// demo/atlas: issues
	issue(ATLAS, 124, 4, 'mira-k', 'Release uploads fail about once a week with a 503', [
		'The nightly upload to the release bucket fails roughly once a week with `503 Slow Down`. Re-running the job always passes.',
		'',
		'`uploadAsset()` gives up on the first error response. It should retry 429 and 5xx with backoff, and still fail fast on 4xx.',
		'',
		'Recent failures: **Nightly upload #211**, and **#212** (attempt 1).'
	].join('\n'), { assignees: ['demo'], labels: ['bug', 'release'] }),
	issue(ATLAS, 123, 19, 'tobias-l', 'Cache entries leak between agents in the same project', [
		'When Claude and Codex both work in `atlas`, the second agent sometimes gets a cache hit for a file the first one is still editing.',
		'',
		'**Steps**',
		'',
		'1. Start a Claude session and a Codex session in the same project',
		'2. Ask both to touch `src/release/upload.ts`',
		"3. Codex reads Claude's cached parse of the file",
		'',
		'The key is only `project:file`. It should include the agent.'
	].join('\n'), { assignees: ['demo'], labels: ['bug', 'cache'] }),
	issue(ATLAS, 126, 95, 'ana-r', 'Release validation fails on pre-release tags', [
		'Pushing `v0.3.0-rc.1` failed the **Release** workflow at *Validate tag*:',
		'',
		'```',
		'Error: Tag v0.3.0-rc.1 does not match VERSION_PATTERN /^v\\d+\\.\\d+\\.\\d+$/',
		'```',
		'',
		'Release candidates should go through the same pipeline, minus the changelog check.'
	].join('\n'), { assignees: ['demo'], labels: ['bug', 'ci', 'release'] }),
	issue(ATLAS, 121, 3 * D, 'mira-k', 'Full-text search across saved transcripts', 'Searching titles is not enough once you have a few hundred sessions. I want to find the conversation where we discussed the bucket signing flow.\n\n- Match words anywhere in a transcript\n- Jump straight to the matching entry\n- Stay fast with a year of history', { labels: ['enhancement', 'search'] }),
	issue(ATLAS, 127, 25 * H, 'ana-r', 'Arrow-key navigation in the file tree', 'The file tree only responds to the mouse. It should behave like Finder: arrows move, → expands, ← collapses or goes to the parent.', { state: 'CLOSED', labels: ['accessibility', 'enhancement'] }),

	// demo/atlas: branches
	branch(ATLAS, 'main', 3 * H, 'ana-r', 'Merge pull request #125 from demo/ar/tree-keys\n\nFile tree: roving focus, arrow keys and type-ahead'),
	branch(ATLAS, 'splash/upload-retry', 4, 'demo', 'Retry 429 and 5xx in uploadAsset() with backoff\n\nRetries up to four times (250 ms, 500 ms, 1 s) and never retries other 4xx responses.'),
	branch(ATLAS, 'splash/session-history', 19, 'demo', 'Include the agent in cache keys\n\nNormalize trailing slashes in project paths and cover two agents in one project.'),
	branch(ATLAS, 'splash/release-job', 2, 'demo', 'Accept pre-release tags in VERSION_PATTERN'),
	branch(ATLAS, 'tl/cache-agent-column', 48, 'tobias-l', 'Migration 0007: add agent column and (project, agent) index'),

	// demo/atlas: activity (page 1; page 2 is in OLDER_ACTIVITY)
	event(ATLAS, 4, 'demo', 'IssueComment', 'IssueComment · created: Release uploads fail about once a week with a 503', 'https://github.com/demo/atlas/issues/124#issuecomment-3391120455', 'An agent is on it in `splash/upload-retry`: retries 429/502/503/504 up to four times, 250 ms → 500 ms → 1 s.'),
	event(ATLAS, 2, 'demo', 'Push', 'Pushed to splash/release-job', 'https://github.com/demo/atlas/commits/splash/release-job'),
	event(ATLAS, 11, 'demo', 'PullRequest', 'PullRequest · opened: Accept pre-release tags in release validation', 'https://github.com/demo/atlas/pull/130'),
	event(ATLAS, 19, 'demo', 'Push', 'Pushed to splash/session-history', 'https://github.com/demo/atlas/commits/splash/session-history'),
	event(ATLAS, 96, 'tobias-l', 'IssueComment', 'IssueComment · created: Release validation fails on pre-release tags', 'https://github.com/demo/atlas/issues/126#issuecomment-3390871214', '+1. Please make sure `v1.2` (no patch) still fails.'),

	// demo/atlas-web
	pull(WEB, 44, 70, 'mira-k', 'mk/release-notes-link', 'Link release notes from the download page', 'Each download card now links to its release notes, and pre-releases get an **RC** badge.\n\nPreview: https://pr-44.atlas-web.example.com', { checks: 'SUCCESS', review_decision: 'REVIEW_REQUIRED', reviewers: ['demo'], labels: ['website'] }),
	pull(WEB, 43, 2 * D, 'ana-r', 'ar/docs-dark-code', 'Dark theme for code blocks in the docs', 'Code blocks follow `prefers-color-scheme` instead of always rendering light.', { state: 'MERGED', checks: 'SUCCESS', review_decision: 'APPROVED', labels: ['docs'] }),
	issue(WEB, 42, 5 * H, 'ana-r', 'Download page offers the Intel build on Apple Silicon Macs', 'Safari reports `MacIntel` as the platform on Apple Silicon too, so the page picks the x64 archive.\n\nWe should default to the universal build, or ask for the architecture when we cannot tell.', { labels: ['bug', 'website'] }),
	branch(WEB, 'main', 25, 'demo', 'Update download copy for 0.3.0-rc.1'),
	branch(WEB, 'mk/release-notes-link', 70, 'mira-k', 'Link release notes from each download card'),
	event(WEB, 70, 'mira-k', 'PullRequest', 'PullRequest · opened: Link release notes from the download page', 'https://github.com/demo/atlas-web/pull/44'),

	// demo/release-tools (private)
	pull(TOOLS, 14, 50, 'demo', 'demo/prerelease-tags', 'Support pre-release tags in VERSION_PATTERN', 'Teach `Version::parse` about `-rc.N` and `-beta.N` suffixes so the release CLI can validate release candidates.', { checks: 'FAILURE', review_decision: 'CHANGES_REQUESTED', labels: ['release'] }),
	issue(TOOLS, 12, 6 * D, 'demo', 'Validate the tag format before uploading anything', 'Today a bad tag is only caught after the build artifacts are uploaded. Validate first, upload second.', { labels: ['enhancement', 'release'] }),
	issue(TOOLS, 11, 9 * D, 'mira-k', 'Nightly upload: retry on 503 from the bucket', 'Moved to demo/atlas#124, where the uploader lives now.', { state: 'CLOSED', labels: ['release'] }),
	branch(TOOLS, 'main', 6 * D, 'demo', 'Sign PUT requests with the bucket key'),
	branch(TOOLS, 'demo/prerelease-tags', 50, 'demo', 'Parse -rc and -beta suffixes in Version::parse'),

	// atlas-labs/cli
	pull(CLI, 306, 6, 'mira-k', 'mk/completions', 'Shell completions for zsh and fish', 'Generates completions from the clap command tree: `atlas completions zsh > ~/.zfunc/_atlas`.\n\n- [x] zsh\n- [x] fish\n- [ ] bash (follow-up)', { state: 'DRAFT', checks: 'PENDING', labels: ['cli'] }),
	pull(CLI, 305, 2 * H, 'jun-p', 'jp/no-color', 'Respect NO_COLOR in the progress bar', 'The progress bar ignored `NO_COLOR` and `--color never`. Both now disable styling, and non-TTY output falls back to one line per step.', { checks: 'SUCCESS', review_decision: 'APPROVED', labels: ['cli'] }),
	issue(CLI, 301, 7 * H, 'tobias-l', 'Add `atlas cache clear --agent <id>`', 'Now that cache keys include the agent (demo/atlas#128), clearing one agent\'s entries should not wipe everyone else\'s.', { labels: ['cache', 'cli'] }),
	issue(CLI, 298, 3 * D, 'sam-d', '`atlas login` hangs behind an HTTP proxy', '`HTTPS_PROXY` is set, `curl` works, but `atlas login` waits forever after "Opening browser…".\n\n```\natlas 1.8.0 (aarch64-apple-darwin)\n```', { labels: ['bug', 'needs-repro'] }),
	branch(CLI, 'main', 2 * H, 'jun-p', 'Merge pull request #304 from atlas-labs/jp/spinner-width'),
	branch(CLI, 'mk/completions', 6, 'mira-k', 'Generate fish completions from the command tree'),
	event(CLI, 5 * D, 'demo', 'Release', 'Release · published: v1.8.0', 'https://github.com/atlas-labs/cli/releases/tag/v1.8.0', '- `atlas cache stats`\n- Faster cold start'),

	// atlas-labs/homebrew-tap (issues disabled)
	pull(TAP, 18, 5 * D, 'jun-p', 'atlas-1.8.0', 'atlas 1.8.0', 'Bump the formula to 1.8.0 and update the checksums.', { state: 'MERGED', checks: 'SUCCESS', review_decision: 'APPROVED' }),
	branch(TAP, 'main', 5 * D, 'jun-p', 'atlas 1.8.0'),
	event(TAP, 5 * D, 'jun-p', 'Push', 'Pushed to main', 'https://github.com/atlas-labs/homebrew-tap/commits/main')
];

/** The second page of demo/atlas activity, for "Load more". */
const OLDER_ACTIVITY: GithubItem[] = [
	event(ATLAS, 25 * H, 'ana-r', 'PullRequest', 'PullRequest · closed: File tree: roving focus, arrow keys and type-ahead', 'https://github.com/demo/atlas/pull/125'),
	event(ATLAS, 25 * H, 'ana-r', 'Delete', 'Deleted branch ar/tree-keys', 'https://github.com/demo/atlas'),
	event(ATLAS, 4 * D + 30, 'demo', 'Release', 'Release · published: v0.2.0', 'https://github.com/demo/atlas/releases/tag/v0.2.0', 'Asset cache, faster uploads, and the first signed macOS build.')
];

/** Issues created from the composer during this visit. */
const created: GithubItem[] = [];

// ── discussions ─────────────────────────────────────────────────────────────

let commentSeq = 3_391_000_000;
const c = (author: string, minutes: number, body: string) => ({ author, minutes, body });

const DISCUSSIONS: Record<string, ReturnType<typeof c>[]> = {
	[`${ATLAS}#128`]: [
		c('tobias-l', 30, "Do we need to bump the cache version too? Old entries will never be hit again. That's fine, but they sit on disk until eviction."),
		c('demo', 22, 'Old keys are unreachable now, so they age out with the normal 7-day eviction. I would rather not add a version bump here; #129 adds the column and backfills `unknown`.'),
		c('mira-k', 1, 'Ran the agent suite locally with Claude and Codex in the same worktree: no more cross-reads. Looks good from my side.')
	],
	[`${ATLAS}#130`]: [
		c('mira-k', 12, 'The build-metadata case is real: nightly tags look like `v0.3.0-nightly.20261006+sha.4f2c9a1`. Can you cover it here rather than in a follow-up?'),
		c('demo', 2, 'Yes. The agent session timed out halfway through the fix; picking it back up now.')
	],
	[`${ATLAS}#129`]: [
		c('tobias-l', 52, '@demo could you review? A Codex session is running the staging dry run.'),
		c('ana-r', 48, 'The rollback order looks right. Do we know the row count on prod? Staging has about 18k.')
	],
	[`${ATLAS}#125`]: [
		c('demo', 26 * H, 'Lovely. Type-ahead resets after 700 ms of no typing, matching Finder?'),
		c('ana-r', 25 * H + 30, 'Yes, 700 ms. Also tested with VoiceOver: rows announce their level and expanded state.')
	],
	[`${ATLAS}#122`]: [c('demo', 2 * D, '@dependabot squash and merge')],
	[`${ATLAS}#119`]: [c('demo', 4 * D, 'Closing: the spike answered the question. Numbers are in #121.')],
	[`${ATLAS}#124`]: [
		c('tobias-l', 2 * D, 'The bucket docs recommend exponential backoff starting at 200–300 ms, and treating 429 the same as 503.'),
		c('mira-k', 6 * H, 'Hit it again last night: **Nightly upload #212** failed on `atlas-linux-x64.tar.gz`, then passed on re-run.'),
		c('demo', 4, 'An agent is on it in `splash/upload-retry`: retries 429/502/503/504 up to four times, 250 ms → 500 ms → 1 s. Tests cover a recovering 503, giving up, and no retry on 403.')
	],
	[`${ATLAS}#123`]: [
		c('demo', 40, 'Confirmed. I have a fix on `splash/session-history`, PR incoming.'),
		c('tobias-l', 19, 'Thanks. Note the trailing-slash case too: `/Users/demo/code/atlas/` and `/Users/demo/code/atlas` produce different keys today.')
	],
	[`${ATLAS}#126`]: [
		c('ana-r', 3 * H + 30, 'Run: **Release #57**. Everything after *validate* was skipped, so nothing was uploaded.'),
		c('demo', 100, 'Taking this. Plan: parse with a real SemVer pattern and publish anything with a pre-release suffix as a GitHub pre-release.'),
		c('tobias-l', 96, '+1. Please make sure `v1.2` (no patch) still fails.')
	],
	[`${ATLAS}#121`]: [
		c('demo', 4 * D, 'The FTS5 spike (#119) looks promising: prefix queries over 40k entries return in under 5 ms with an external-content table kept in sync by triggers.'),
		c('mira-k', 3 * D, 'Great. Snippets with the match highlighted would make the results much easier to scan.')
	],
	[`${ATLAS}#127`]: [c('ana-r', 25 * H, 'Shipped in #125. Closing.')],
	[`${WEB}#44`]: [
		c('github-actions', 69, 'Preview deployed to https://pr-44.atlas-web.example.com (commit `9c1e0b2`).'),
		c('mira-k', 68, '@demo the RC badge copy is a guess, happy to change it.')
	],
	[`${WEB}#42`]: [c('demo', 4 * H, "We can ask WebGL for the renderer string, but that's a heuristic. Defaulting to the universal build is simpler.")],
	[`${TOOLS}#14`]: [
		c('tobias-l', 55, '`Version::parse` still rejects `-rc.1`; the test you added fails on CI. Please also keep the old error message: the Release workflow greps for it.'),
		c('demo', 50, 'Right, the pattern anchors before the suffix. Fixing.')
	],
	[`${CLI}#305`]: [c('tobias-l', 2 * H, 'Checked `NO_COLOR=1 atlas sync | cat`: one plain line per step. Approved.')],
	[`${CLI}#298`]: [
		c('jun-p', 3 * D, 'Thanks for the report. Does `atlas login --no-browser` get further?'),
		c('sam-d', 2 * D, 'Same hang. It looks like the device-code request ignores `HTTPS_PROXY`.')
	]
};

function comments(repository: string, number: number, kind: GithubKind) {
	if (kind !== 'issue' && kind !== 'pull_request') fail('This item has no discussion');
	const item = [...ITEMS, ...created].find((i) => i.repository === repository && i.number === number);
	if (!item) fail('Could not resolve to an issue or pull request.');
	const list: GithubComment[] = (DISCUSSIONS[`${repository}#${number}`] ?? []).map((x) => ({
		author: x.author,
		body: x.body,
		url: `${item!.url}#issuecomment-${commentSeq++}`,
		created_at: ago(x.minutes)
	}));
	return { comments: list, has_more: false };
}

// ── search ──────────────────────────────────────────────────────────────────

const me = (value: string) => (value.trim() === '@me' ? LOGIN : value.trim()).toLowerCase();

function search(repositories: string[], kind: GithubKind, filters: GithubSearch) {
	if (!repositories.length || repositories.length > 10) fail('Search requires 1 to 10 repositories per page');
	if (kind !== 'issue' && kind !== 'pull_request') fail('GitHub search supports issues and pull requests');
	if (!['all', 'open', 'closed'].includes(filters.state)) fail('Invalid search state');
	const words = filters.text.toLowerCase().split(/\s+/).filter(Boolean);
	const items = [...ITEMS, ...created]
		.filter((i) => i.kind === kind && repositories.includes(i.repository))
		.filter((i) => words.every((w) => `${i.title}\n${i.body}`.toLowerCase().includes(w)))
		.filter((i) => !filters.author.trim() || i.author.toLowerCase() === me(filters.author))
		.filter((i) => !filters.assignee.trim() || i.assignees.some((a) => a.toLowerCase() === me(filters.assignee)))
		.filter((i) => !filters.label.trim() || i.labels.some((l) => l.toLowerCase() === filters.label.trim().toLowerCase()))
		.filter((i) => filters.state === 'all' || (filters.state === 'open' ? ['OPEN', 'DRAFT'].includes(i.state) : ['CLOSED', 'MERGED'].includes(i.state)))
		.filter((i) => {
			switch (filters.review) {
				case '': return true;
				case 'requested': return i.reviewers.includes(LOGIN);
				case 'required': return i.review_decision === 'REVIEW_REQUIRED';
				case 'approved': return i.review_decision === 'APPROVED';
				case 'changes_requested': return i.review_decision === 'CHANGES_REQUESTED';
				default: return fail('Invalid review filter');
			}
		})
		.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
	return { items, next_cursor: null };
}

// ── Actions ─────────────────────────────────────────────────────────────────

type StepState = 'ok' | 'fail' | 'skip' | 'run' | 'wait' | 'cancel';
/** A step: name, seconds it took, how it ended, and its log lines (defaults by name). */
type StepSpec = [name: string, seconds: number, state?: StepState, output?: string[]];
type JobSpec = { name: string; steps: StepSpec[]; skipped?: boolean; waiting?: boolean; offset?: number };
type RunSpec = {
	repo: string;
	workflow: string;
	number: number;
	title: string;
	branch: string;
	event: string;
	actor: string;
	/** Minutes before page load that the run was created. */
	minutes: number;
	status: string;
	conclusion: string | null;
	sha: string;
	attempt?: number;
	jobs: JobSpec[] | ((attempt: number) => JobSpec[]);
};

const WORKFLOWS: ActionsWorkflow[] = [
	[ATLAS, '71820001', 'CI', 'ci.yml', 'active'],
	[ATLAS, '71820002', 'Release', 'release.yml', 'active'],
	[ATLAS, '71820003', 'Nightly upload', 'nightly-upload.yml', 'active'],
	[ATLAS, '71820004', 'Docs', 'docs.yml', 'active'],
	[ATLAS, '71820005', 'Benchmarks', 'bench.yml', 'disabled_manually'],
	[WEB, '71830001', 'Deploy preview', 'preview.yml', 'active'],
	[WEB, '71830002', 'Lighthouse', 'lighthouse.yml', 'active'],
	[WEB, '71830003', 'Deploy', 'deploy.yml', 'active'],
	[TOOLS, '71840001', 'CI', 'ci.yml', 'active'],
	[CLI, '71850001', 'CI', 'ci.yml', 'active'],
	[CLI, '71850002', 'Release', 'release.yml', 'active']
].map(([repository, id, name, file, state]) => ({ id, repository, name, path: `.github/workflows/${file}`, state, url: `https://github.com/${repository}/actions/workflows/${file}` }));

const workflowFor = (repository: string, name: string) => WORKFLOWS.find((w) => w.repository === repository && w.name === name)!;

// Steps every job shares.
const SETUP: StepSpec = ['Set up job', 2];
const CHECKOUT: StepSpec = ['Run actions/checkout@v4', 2];
const NODE: StepSpec = ['Run actions/setup-node@v4', 4];
const NPM_CI: StepSpec = ['Run npm ci', 9];
const RUST: StepSpec = ['Run dtolnay/rust-toolchain@stable', 6];
const CACHE_RS: StepSpec = ['Run Swatinem/rust-cache@v2', 5];
const POST: StepSpec = ['Post Run actions/checkout@v4', 1];
const DONE: StepSpec = ['Complete job', 0];

/**
 * Steps after the first `fail`/`cancel` are skipped (cleanup still runs), and
 * steps after a running one are pending, the way GitHub reports them.
 */
function job(name: string, steps: StepSpec[], extra: Partial<JobSpec> = {}): JobSpec {
	let stopped = false;
	let running = false;
	return {
		name,
		...extra,
		steps: steps.map(([n, s, state = 'ok', out]): StepSpec => {
			if (running) return [n, 0, 'wait', out];
			if (stopped && state === 'ok' && n !== 'Complete job' && !n.startsWith('Post ')) return [n, 0, 'skip', out];
			if (state === 'fail' || state === 'cancel') stopped = true;
			if (state === 'run') running = true;
			return [n, s, state, out];
		})
	};
}

const lintJob = (cmd = 'Run npm run lint') => job('lint', [SETUP, CHECKOUT, NODE, NPM_CI, [cmd, 7], POST, DONE]);
const testJob = (os: string, test: StepSpec = ['Run npm test', 21], extra: Partial<JobSpec> = {}) => job(`test (${os})`, [SETUP, CHECKOUT, NODE, NPM_CI, test, POST, DONE], extra);
const ciJobs = (testState: StepState = 'ok') => [lintJob(), testJob('ubuntu-24.04', ['Run npm test', 21, testState]), testJob('macos-14', ['Run npm test', 26, testState], { offset: 4 })];

const ESC = '\x1b';
const red = (s: string) => `${ESC}[31m${s}${ESC}[39m`;
const green = (s: string) => `${ESC}[32m${s}${ESC}[39m`;
const dim = (s: string) => `${ESC}[2m${s}${ESC}[22m`;

/** The failing vitest run on PR #130 (demo/atlas CI #480). */
const VITEST_FAILURE = [
	'',
	'> atlas@0.3.0-rc.1 test',
	'> vitest run --reporter=verbose',
	'',
	` RUN  v3.2.4 /home/runner/work/atlas/atlas`,
	'',
	` ${green('✓')} tests/cache.test.ts > cacheKey > includes the agent ${dim('1ms')}`,
	` ${green('✓')} tests/cache.test.ts > cacheKey > keeps Claude and Codex apart in one project ${dim('1ms')}`,
	` ${green('✓')} tests/cache.test.ts > cacheKey > normalizes trailing slashes ${dim('0ms')}`,
	` ${green('✓')} tests/upload.test.ts > uploadAsset > uploads and returns the URL ${dim('3ms')}`,
	` ${green('✓')} tests/release/version.test.ts > parseVersion > accepts v0.3.0 ${dim('1ms')}`,
	` ${green('✓')} tests/release/version.test.ts > parseVersion > accepts v0.3.0-rc.1 ${dim('0ms')}`,
	` ${red('×')} tests/release/version.test.ts > parseVersion > accepts v0.3.0-beta.2+build.7 ${dim('4ms')}`,
	`   ${red('→ expected null to deeply equal { major: 0, minor: 3, …(3) }')}`,
	` ${green('✓')} tests/release/version.test.ts > parseVersion > rejects v1.2 without a patch version ${dim('0ms')}`,
	` ${green('✓')} tests/release/version.test.ts > parseVersion > rejects 0.3.0 without the v prefix ${dim('0ms')}`,
	` ${green('✓')} tests/release/validate.test.ts > validateRelease > requires a changelog entry for releases ${dim('2ms')}`,
	` ${green('✓')} tests/release/validate.test.ts > validateRelease > skips the changelog check for pre-releases ${dim('1ms')}`,
	` ${green('✓')} tests/release/validate.test.ts > validateRelease > marks rc tags as GitHub pre-releases ${dim('1ms')}`,
	'',
	red('⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯'),
	'',
	` ${red('FAIL')}  tests/release/version.test.ts > parseVersion > accepts v0.3.0-beta.2+build.7`,
	`${red('AssertionError')}: expected null to deeply equal { major: 0, minor: 3, …(3) }`,
	'',
	green('- Expected'),
	red('+ Received'),
	'',
	green('- {'),
	green('-   "build": "build.7",'),
	green('-   "major": 0,'),
	green('-   "minor": 3,'),
	green('-   "patch": 0,'),
	green('-   "pre": "beta.2",'),
	green('- }'),
	red('+ null'),
	'',
	` ❯ tests/release/version.test.ts:24:52`,
	'     22|',
	'     23|   it("accepts v0.3.0-beta.2+build.7", () => {',
	'     24|     expect(parseVersion("v0.3.0-beta.2+build.7")).toEqual({',
	`       |                                                    ${red('^')}`,
	'     25|       major: 0, minor: 3, patch: 0, pre: "beta.2", build: "build.7",',
	'     26|     });',
	'',
	red('⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯'),
	'',
	` Test Files  ${red('1 failed')} | ${green('3 passed')} (4)`,
	`      Tests  ${red('1 failed')} | ${green('11 passed')} (12)`,
	'   Start at  09:12:41',
	'   Duration  1.84s (transform 212ms, setup 0ms, collect 498ms, tests 61ms, environment 1ms, prepare 389ms)',
	'',
	'##[error]Process completed with exit code 1.'
];

/** The Release workflow's validate job on the v0.3.0-rc.1 tag (Release #57). */
const VALIDATE_FAILURE = [
	'Validating release v0.3.0-rc.1',
	`  ${green('✓')} package.json version matches the tag (0.3.0-rc.1)`,
	`  ${green('✓')} CHANGELOG.md has an entry for 0.3.0-rc.1`,
	`  ${red('✗')} tag format`,
	'file:///home/runner/work/atlas/atlas/scripts/validate-release.ts:12',
	'    throw new Error(`Tag ${tag} does not match VERSION_PATTERN ${VERSION_PATTERN}`);',
	'          ^',
	'',
	'Error: Tag v0.3.0-rc.1 does not match VERSION_PATTERN /^v\\d+\\.\\d+\\.\\d+$/',
	'    at validateTag (file:///home/runner/work/atlas/atlas/scripts/validate-release.ts:12:11)',
	'    at main (file:///home/runner/work/atlas/atlas/scripts/validate-release.ts:31:3)',
	'',
	'Node.js v22.20.0',
	'##[error]Process completed with exit code 1.'
];

const uploadFailure = (asset: string, date: string) => [
	`Uploading 6 assets to s3://atlas-releases/nightly/${date}/`,
	`  ${green('✓')} atlas-darwin-arm64.tar.gz   18.2 MB  2.1s`,
	`  ${green('✓')} atlas-darwin-x64.tar.gz     19.0 MB  2.3s`,
	asset === 'atlas-linux-x64.tar.gz' ? `  ${red('✗')} atlas-linux-x64.tar.gz      503 Slow Down` : `  ${green('✓')} atlas-linux-x64.tar.gz      17.6 MB  1.9s`,
	...(asset === 'atlas-linux-arm64.tar.gz' ? [`  ${red('✗')} atlas-linux-arm64.tar.gz    503 Slow Down`] : []),
	'file:///home/runner/work/atlas/atlas/src/release/upload.ts:6',
	'  if (!res.ok) throw new Error(`upload failed: ${res.status}`);',
	'                     ^',
	'',
	'Error: upload failed: 503',
	'    at uploadAsset (file:///home/runner/work/atlas/atlas/src/release/upload.ts:6:23)',
	'    at async Promise.all (index 2)',
	'    at async main (file:///home/runner/work/atlas/atlas/scripts/upload-nightly.ts:9:3)',
	'',
	'Node.js v22.20.0',
	'##[error]Process completed with exit code 1.'
];

/** release-tools CI #64: cargo test on PR #14. */
const CARGO_FAILURE = [
	'   Compiling release-tools v0.4.1 (/home/runner/work/release-tools/release-tools)',
	'    Finished `test` profile [unoptimized + debuginfo] target(s) in 38.21s',
	'     Running unittests src/lib.rs (target/debug/deps/release_tools-3f1c2a9e0b7d4c55)',
	'',
	'running 14 tests',
	'test bucket::tests::retries_are_bounded ... ok',
	'test bucket::tests::signs_put_requests ... ok',
	'test bucket::tests::rejects_expired_credentials ... ok',
	'test checksum::tests::sha256_matches_fixture ... ok',
	'test manifest::tests::lists_every_platform ... ok',
	'test manifest::tests::rejects_duplicate_assets ... ok',
	'test notes::tests::extracts_the_changelog_section ... ok',
	'test notes::tests::missing_section_is_an_error ... ok',
	'test upload::tests::dry_run_writes_nothing ... ok',
	'test upload::tests::skips_existing_assets ... ok',
	'test version::tests::accepts_plain_versions ... ok',
	`test version::tests::accepts_prerelease_tags ... ${red('FAILED')}`,
	'test version::tests::rejects_missing_patch ... ok',
	'test version::tests::rejects_missing_v_prefix ... ok',
	'',
	'failures:',
	'',
	'---- version::tests::accepts_prerelease_tags stdout ----',
	'',
	"thread 'version::tests::accepts_prerelease_tags' panicked at src/version.rs:88:9:",
	'assertion `left == right` failed: v1.4.0-rc.1 should parse',
	'  left: None',
	' right: Some(Version { major: 1, minor: 4, patch: 0, pre: Some("rc.1") })',
	'note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace',
	'',
	'',
	'failures:',
	'    version::tests::accepts_prerelease_tags',
	'',
	`test result: ${red('FAILED')}. 13 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.04s`,
	'',
	`${red('error')}: test failed, to rerun pass \`--lib\``,
	'##[error]Process completed with exit code 101.'
];

const RUNS: RunSpec[] = [
	// demo/atlas
	{ repo: ATLAS, workflow: 'CI', number: 480, title: 'Accept pre-release tags in release validation', branch: 'splash/release-job', event: 'pull_request', actor: 'demo', minutes: 2, status: 'completed', conclusion: 'failure', sha: '4f2c9a1d0be37c55e81a9d03f6b2e4c71a8d9e02',
		jobs: [lintJob(), testJob('ubuntu-24.04', ['Run npm test -- --reporter=verbose', 24, 'fail', VITEST_FAILURE]), testJob('macos-14', ['Run npm test -- --reporter=verbose', 19, 'cancel', ['##[error]The operation was canceled.']], { offset: 4 })] },
	{ repo: ATLAS, workflow: 'CI', number: 479, title: 'Retry release uploads with backoff', branch: 'splash/upload-retry', event: 'push', actor: 'demo', minutes: 4, status: 'in_progress', conclusion: null, sha: 'b81e4d7c02a95f3316e0c8a4d2f7b9e1c6a03d58',
		jobs: [lintJob(), testJob('ubuntu-24.04', ['Run npm test', 0, 'run'], { offset: 2 }), job('test (macos-14)', [SETUP, CHECKOUT, NODE, NPM_CI, ['Run npm test', 0, 'wait'], POST, DONE].map(([n]) => [n, 0, 'wait'] as StepSpec))] },
	{ repo: ATLAS, workflow: 'CI', number: 478, title: 'Include the agent in cache keys', branch: 'splash/session-history', event: 'pull_request', actor: 'demo', minutes: 20, status: 'completed', conclusion: 'success', sha: '9d0a3e61f4c2b7a85e0d19c3b6f8a2e47c51d0b9', jobs: ciJobs() },
	{ repo: ATLAS, workflow: 'CI', number: 477, title: 'Migration 0007: add an agent column to the cache table', branch: 'tl/cache-agent-column', event: 'pull_request', actor: 'tobias-l', minutes: 50, status: 'completed', conclusion: 'success', sha: 'e3c7b1094d2a6f85c0e1b9a37d4f2c68b05a1e93', jobs: ciJobs() },
	{ repo: ATLAS, workflow: 'CI', number: 476, title: 'Merge pull request #125 from demo/ar/tree-keys', branch: 'main', event: 'push', actor: 'ana-r', minutes: 3 * H + 2, status: 'completed', conclusion: 'success', sha: '2b024bcc81f3e6d09a4c7b5e1f2d8a3c6e90b4d7', jobs: ciJobs() },
	{ repo: ATLAS, workflow: 'Docs', number: 96, title: 'Merge pull request #125 from demo/ar/tree-keys', branch: 'main', event: 'push', actor: 'ana-r', minutes: 3 * H, status: 'completed', conclusion: 'success', sha: '2b024bcc81f3e6d09a4c7b5e1f2d8a3c6e90b4d7',
		jobs: [job('build', [SETUP, CHECKOUT, NODE, NPM_CI, ['Run npm run docs:build', 14], ['Run actions/upload-pages-artifact@v3', 3], POST, DONE]), job('deploy', [SETUP, ['Run actions/deploy-pages@v4', 11], DONE], { offset: 40 })] },
	{ repo: ATLAS, workflow: 'Release', number: 57, title: 'v0.3.0-rc.1', branch: 'v0.3.0-rc.1', event: 'push', actor: 'demo', minutes: 3 * H + 40, status: 'completed', conclusion: 'failure', sha: '7a1f0c3e9b2d4865a0c71e3f5b9d2a4c8e61f07b',
		jobs: [job('validate', [SETUP, CHECKOUT, NODE, NPM_CI, ['Run node scripts/validate-release.ts "$GITHUB_REF_NAME"', 2, 'fail', VALIDATE_FAILURE], POST, DONE]), job('build (macos-14)', [], { skipped: true }), job('build (ubuntu-24.04)', [], { skipped: true }), job('publish', [], { skipped: true })] },
	{ repo: ATLAS, workflow: 'Nightly upload', number: 212, title: 'Nightly upload', branch: 'main', event: 'schedule', actor: 'demo', minutes: 6 * H, status: 'completed', conclusion: 'success', attempt: 2, sha: '2b024bcc81f3e6d09a4c7b5e1f2d8a3c6e90b4d7',
		jobs: (attempt) => [job('upload', [SETUP, CHECKOUT, NODE, NPM_CI, ['Run npm run build:release', 31], ['Run node scripts/upload-nightly.ts', attempt === 1 ? 9 : 12, attempt === 1 ? 'fail' : 'ok', attempt === 1 ? uploadFailure('atlas-linux-x64.tar.gz', ago(6 * H).slice(0, 10)) : undefined], POST, DONE])] },
	{ repo: ATLAS, workflow: 'Nightly upload', number: 211, title: 'Nightly upload', branch: 'main', event: 'schedule', actor: 'demo', minutes: 30 * H, status: 'completed', conclusion: 'failure', sha: 'c94e2a0b7d13f6e58a2c0d9b4e7f1a3c5d86b20e',
		jobs: [job('upload', [SETUP, CHECKOUT, NODE, NPM_CI, ['Run npm run build:release', 29], ['Run node scripts/upload-nightly.ts', 11, 'fail', uploadFailure('atlas-linux-arm64.tar.gz', ago(30 * H).slice(0, 10))], POST, DONE])] },
	{ repo: ATLAS, workflow: 'Nightly upload', number: 210, title: 'Nightly upload', branch: 'main', event: 'schedule', actor: 'demo', minutes: 54 * H, status: 'completed', conclusion: 'success', sha: 'c94e2a0b7d13f6e58a2c0d9b4e7f1a3c5d86b20e',
		jobs: [job('upload', [SETUP, CHECKOUT, NODE, NPM_CI, ['Run npm run build:release', 30], ['Run node scripts/upload-nightly.ts', 12], POST, DONE])] },
	{ repo: ATLAS, workflow: 'CI', number: 475, title: 'Bump vitest from 3.2.3 to 3.2.4', branch: 'dependabot/npm_and_yarn/vitest-3.2.4', event: 'pull_request', actor: 'dependabot[bot]', minutes: 2 * D + 20, status: 'completed', conclusion: 'success', sha: 'f1d2c3b4a5968778695a4b3c2d1e0f9a8b7c6d5e', jobs: ciJobs() },
	{ repo: ATLAS, workflow: 'CI', number: 474, title: 'Spike: SQLite FTS5 index for transcripts', branch: 'splash/fts-spike', event: 'pull_request', actor: 'demo', minutes: 4 * D, status: 'completed', conclusion: 'cancelled', sha: 'a0b1c2d3e4f5061728394a5b6c7d8e9f0a1b2c3d',
		jobs: [lintJob(), testJob('ubuntu-24.04', ['Run npm test', 48, 'cancel', ['##[error]The operation was canceled.']]), testJob('macos-14', ['Run npm test', 51, 'cancel', ['##[error]The operation was canceled.']], { offset: 4 })] },
	{ repo: ATLAS, workflow: 'Release', number: 56, title: 'v0.2.0', branch: 'v0.2.0', event: 'push', actor: 'demo', minutes: 4 * D + 30, status: 'completed', conclusion: 'success', sha: '5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
		jobs: [job('validate', [SETUP, CHECKOUT, NODE, NPM_CI, ['Run node scripts/validate-release.ts "$GITHUB_REF_NAME"', 2], POST, DONE]), job('build (macos-14)', [SETUP, CHECKOUT, NODE, NPM_CI, ['Run npm run build:release', 64], POST, DONE], { offset: 30 }), job('build (ubuntu-24.04)', [SETUP, CHECKOUT, NODE, NPM_CI, ['Run npm run build:release', 41], POST, DONE], { offset: 30 }), job('publish', [SETUP, CHECKOUT, NODE, ['Run node scripts/publish-release.ts', 18], POST, DONE], { offset: 140 })] },

	// demo/atlas-web
	{ repo: WEB, workflow: 'Deploy', number: 41, title: 'Update download copy for 0.3.0-rc.1', branch: 'main', event: 'push', actor: 'demo', minutes: 25, status: 'waiting', conclusion: null, sha: '0c9b8a7d6e5f40312a3b4c5d6e7f8091a2b3c4d5',
		jobs: [job('build', [SETUP, CHECKOUT, NODE, NPM_CI, ['Run npm run build', 22], POST, DONE]), job('deploy (production)', [], { waiting: true })] },
	{ repo: WEB, workflow: 'Deploy preview', number: 88, title: 'Link release notes from the download page', branch: 'mk/release-notes-link', event: 'pull_request', actor: 'mira-k', minutes: 70, status: 'completed', conclusion: 'success', sha: '9c1e0b2f3a4d5e6f708192a3b4c5d6e7f8091a2b',
		jobs: [job('build', [SETUP, CHECKOUT, NODE, NPM_CI, ['Run npm run build', 20], POST, DONE]), job('deploy', [SETUP, ['Run ./scripts/deploy-preview.sh', 16], DONE], { offset: 45 })] },
	{ repo: WEB, workflow: 'Lighthouse', number: 312, title: 'Link release notes from the download page', branch: 'mk/release-notes-link', event: 'pull_request', actor: 'mira-k', minutes: 70, status: 'completed', conclusion: 'success', sha: '9c1e0b2f3a4d5e6f708192a3b4c5d6e7f8091a2b',
		jobs: [job('lighthouse', [SETUP, CHECKOUT, NODE, NPM_CI, ['Run npx lhci autorun', 47], POST, DONE])] },

	// demo/release-tools
	{ repo: TOOLS, workflow: 'CI', number: 64, title: 'Support pre-release tags in VERSION_PATTERN', branch: 'demo/prerelease-tags', event: 'pull_request', actor: 'demo', minutes: 52, status: 'completed', conclusion: 'failure', sha: '3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60',
		jobs: [job('clippy', [SETUP, CHECKOUT, RUST, CACHE_RS, ['Run cargo clippy --all-targets -- -D warnings', 34], POST, DONE]), job('test', [SETUP, CHECKOUT, RUST, CACHE_RS, ['Run cargo test --locked --all-targets', 46, 'fail', CARGO_FAILURE], POST, DONE])] },
	{ repo: TOOLS, workflow: 'CI', number: 63, title: 'Sign PUT requests with the bucket key', branch: 'main', event: 'push', actor: 'demo', minutes: 6 * D, status: 'completed', conclusion: 'success', sha: '8e9f0a1b2c3d4e5f60718293a4b5c6d7e8f90a1b',
		jobs: [job('clippy', [SETUP, CHECKOUT, RUST, CACHE_RS, ['Run cargo clippy --all-targets -- -D warnings', 31], POST, DONE]), job('test', [SETUP, CHECKOUT, RUST, CACHE_RS, ['Run cargo test --locked --all-targets', 44], POST, DONE])] },

	// atlas-labs/cli
	{ repo: CLI, workflow: 'CI', number: 1204, title: 'Shell completions for zsh and fish', branch: 'mk/completions', event: 'pull_request', actor: 'mira-k', minutes: 6, status: 'queued', conclusion: null, sha: '6a7b8c9d0e1f20314253647586a7b8c9d0e1f203',
		jobs: [job('test', [], { waiting: true }), job('clippy', [], { waiting: true })] },
	{ repo: CLI, workflow: 'CI', number: 1203, title: 'Respect NO_COLOR in the progress bar', branch: 'jp/no-color', event: 'pull_request', actor: 'jun-p', minutes: 2 * H, status: 'completed', conclusion: 'success', sha: 'd5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708',
		jobs: [job('clippy', [SETUP, CHECKOUT, RUST, CACHE_RS, ['Run cargo clippy --all-targets -- -D warnings', 29], POST, DONE]), job('test', [SETUP, CHECKOUT, RUST, CACHE_RS, ['Run cargo test --locked --all-targets', 52], POST, DONE])] },
	{ repo: CLI, workflow: 'Release', number: 77, title: 'v1.8.0', branch: 'v1.8.0', event: 'push', actor: 'demo', minutes: 5 * D, status: 'completed', conclusion: 'success', sha: '1f2e3d4c5b6a79880716253443526170f8e9d0c1',
		jobs: [job('build (aarch64-apple-darwin)', [SETUP, CHECKOUT, RUST, CACHE_RS, ['Run cargo build --release --locked', 96], POST, DONE]), job('build (x86_64-unknown-linux-gnu)', [SETUP, CHECKOUT, RUST, CACHE_RS, ['Run cargo build --release --locked', 81], POST, DONE]), job('publish', [SETUP, CHECKOUT, ['Run gh release upload "$GITHUB_REF_NAME" dist/*', 14], DONE], { offset: 180 })] }
];

const runId = (i: number) => String(18_204_311_000 + i * 1_013);
const jobId = (run: number, attempt: number, index: number) => String(51_640_000_000 + run * 100 + attempt * 10 + index);

const runStart = (spec: RunSpec) => T0 - spec.minutes * 60_000 + 5_000;
const jobSpecs = (spec: RunSpec, attempt: number) => (typeof spec.jobs === 'function' ? spec.jobs(attempt) : spec.jobs);
/** Each attempt of a re-run starts after the previous one finished. */
const attemptStart = (spec: RunSpec, attempt: number) => runStart(spec) + (attempt - 1) * 4 * 60_000;

type BuiltJob = ActionsJob & { log: string | null };

function buildJob(spec: RunSpec, index: number, attempt: number, j: JobSpec, i: number): BuiltJob {
	const id = jobId(index, attempt, i);
	const url = `https://github.com/${spec.repo}/actions/runs/${runId(index)}/job/${id}`;
	const runner = j.name.includes('macos') || j.name.includes('apple-darwin') ? `GitHub Actions ${200 + i}` : `GitHub Actions ${40 + i}`;
	const start = attemptStart(spec, attempt) + (j.offset ?? 2) * 1000;
	if (j.waiting) return { id, name: j.name, status: spec.status === 'waiting' ? 'waiting' : 'queued', conclusion: null, started_at: null, completed_at: null, runner: '', url, steps: [], log: null };
	if (j.skipped) return { id, name: j.name, status: 'completed', conclusion: 'skipped', started_at: at(start), completed_at: at(start), runner: '', url, steps: [], log: null };
	let clock = start;
	const lines: string[] = [];
	const stamp = (ms: number, text: string) => `${new Date(ms).toISOString().replace('Z', '0000Z')} ${text}`;
	const steps: ActionsStep[] = j.steps.map(([name, seconds, state = 'ok', output], n) => {
		const begin = clock;
		const timed = state !== 'wait';
		if (state !== 'skip' && timed && state !== 'run') clock += seconds * 1000;
		if (timed && state !== 'skip') {
			const body = output ?? defaultOutput(name, spec, j);
			const header = name === 'Set up job' || name === 'Complete job' || name.startsWith('Post ') ? [] : [`##[group]${name}`, ...(name.startsWith('Run ') && !name.includes('@') ? [name.slice(4), 'shell: /usr/bin/bash -e {0}'] : []), '##[endgroup]'];
			const all = [...header, ...body];
			all.forEach((line, k) => lines.push(stamp(begin + Math.round((k / Math.max(1, all.length)) * Math.max(seconds, 1) * 1000), line)));
		}
		return {
			number: n + 1,
			name,
			status: state === 'run' ? 'in_progress' : state === 'wait' ? 'pending' : 'completed',
			conclusion: { ok: 'success', fail: 'failure', skip: 'skipped', cancel: 'cancelled', run: null, wait: null }[state],
			started_at: timed ? at(begin) : null,
			completed_at: timed && state !== 'run' ? at(clock) : null
		};
	});
	const states = j.steps.map(([, , s = 'ok']) => s);
	const running = states.includes('run');
	const queued = states.every((s) => s === 'wait');
	const conclusion = running || queued ? null : states.includes('fail') ? 'failure' : states.includes('cancel') ? 'cancelled' : 'success';
	return {
		id,
		name: j.name,
		status: running ? 'in_progress' : queued ? 'queued' : 'completed',
		conclusion,
		started_at: queued ? null : at(start),
		completed_at: running || queued ? null : at(clock),
		runner: queued ? '' : runner,
		url,
		steps,
		log: running || queued ? null : lines.join('\n')
	};
}

function defaultOutput(name: string, spec: RunSpec, j: JobSpec): string[] {
	const repoName = spec.repo.split('/')[1];
	const mac = j.name.includes('macos') || j.name.includes('apple-darwin');
	if (name === 'Set up job') return [
		"Current runner version: '2.328.0'",
		'##[group]Operating System',
		...(mac ? ['macOS', '14.7.6', '23H626'] : ['Ubuntu', '24.04.3', 'LTS']),
		'##[endgroup]',
		'##[group]Runner Image',
		mac ? 'Image: macos-14-arm64' : 'Image: ubuntu-24.04',
		'Version: 20260928.1',
		'##[endgroup]',
		'Secret source: Actions',
		'Prepare workflow directory',
		'Prepare all required actions',
		"Download action repository 'actions/checkout@v4' (SHA:08eba0b27e820071cde6df949e0beb9ba4906955)",
		`Complete job name: ${j.name}`
	];
	if (name === 'Run actions/checkout@v4') return [`Syncing repository: ${spec.repo}`, '##[group]Fetching the repository', `[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +${spec.sha}:refs/remotes/origin/${spec.branch}`, '##[endgroup]', `HEAD is now at ${spec.sha.slice(0, 7)} ${spec.title}`];
	if (name === 'Run actions/setup-node@v4') return ['Attempting to download 22.x...', `Found in cache @ ${mac ? '/Users/runner/hostedtoolcache' : '/opt/hostedtoolcache'}/node/22.20.0/${mac ? 'arm64' : 'x64'}`, '##[group]Environment details', 'node: v22.20.0', 'npm: 10.9.3', '##[endgroup]'];
	if (name === 'Run npm ci') return ['', 'added 214 packages, and audited 215 packages in 6s', '', '41 packages are looking for funding', '  run `npm fund` for details', '', 'found 0 vulnerabilities'];
	if (name === 'Run npm run lint') return ['', `> ${repoName}@0.3.0-rc.1 lint`, '> biome check src tests scripts', '', 'Checked 41 files in 38ms. No fixes applied.'];
	if (name.startsWith('Run npm test')) return [
		'',
		`> ${repoName}@0.3.0-rc.1 test`,
		'> vitest run',
		'',
		` RUN  v3.2.4 /home/runner/work/${repoName}/${repoName}`,
		'',
		` ${green('✓')} tests/cache.test.ts (6 tests) 12ms`,
		` ${green('✓')} tests/upload.test.ts (3 tests) 38ms`,
		` ${green('✓')} tests/release/version.test.ts (5 tests) 4ms`,
		` ${green('✓')} tests/release/validate.test.ts (4 tests) 9ms`,
		'',
		` Test Files  ${green('4 passed')} (4)`,
		`      Tests  ${green('18 passed')} (18)`,
		'   Duration  1.62s (transform 201ms, setup 0ms, collect 472ms, tests 63ms, environment 1ms, prepare 377ms)'
	];
	if (name.startsWith('Run cargo clippy')) return [`    Checking ${repoName} v0.4.1 (/home/runner/work/${repoName}/${repoName})`, '    Finished `dev` profile [unoptimized + debuginfo] target(s) in 27.90s'];
	if (name.startsWith('Run cargo test')) return [`   Compiling ${repoName} v0.4.1 (/home/runner/work/${repoName}/${repoName})`, '    Finished `test` profile [unoptimized + debuginfo] target(s) in 36.02s', '', 'running 14 tests', 'test result: ok. 14 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.03s'];
	if (name.startsWith('Run cargo build')) return [`   Compiling ${repoName} v1.8.0 (/home/runner/work/${repoName}/${repoName})`, '    Finished `release` profile [optimized] target(s) in 1m 21s'];
	if (name.startsWith('Run node scripts/validate-release.ts')) return [`Validating release ${spec.branch}`, `  ${green('✓')} package.json version matches the tag`, `  ${green('✓')} CHANGELOG.md has an entry`, `  ${green('✓')} tag format`];
	if (name.startsWith('Run node scripts/upload-nightly.ts')) return ['Uploading 6 assets to s3://atlas-releases/nightly/', `  ${green('✓')} 6 of 6 uploaded (108.4 MB)`];
	if (name.startsWith('Run npm run build')) return ['', `> ${repoName}@0.3.0-rc.1 build`, '> tsc -p . && node scripts/bundle.ts', '', 'dist/ ready (6 artifacts)'];
	if (name.startsWith('Run dtolnay')) return ['info: syncing channel updates for stable-x86_64-unknown-linux-gnu', 'rustc 1.90.0 (1159e78c4 2025-09-14)'];
	if (name.startsWith('Run Swatinem')) return ['Cache restored from key: v0-rust-test-Linux-x64-3f1c2a9e'];
	if (name.startsWith('Post ')) return ['Post job cleanup.', `[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand`];
	if (name === 'Complete job') return ['Cleaning up orphan processes'];
	return ['Done.'];
}

type BuiltRun = { run: ActionsRun; jobs: Record<number, BuiltJob[]> };

const BUILT: BuiltRun[] = RUNS.map((spec, index) => {
	const wf = workflowFor(spec.repo, spec.workflow);
	const attempts = spec.attempt ?? 1;
	const jobs: Record<number, BuiltJob[]> = {};
	for (let a = 1; a <= attempts; a++) jobs[a] = jobSpecs(spec, a).map((j, i) => buildJob(spec, index, a, j, i));
	const latest = jobs[attempts];
	const ends = latest.map((j) => (j.completed_at ? Date.parse(j.completed_at) : 0));
	const done = spec.status === 'completed';
	const created = T0 - spec.minutes * 60_000;
	return {
		jobs,
		run: {
			id: runId(index),
			repository: spec.repo,
			workflow_id: wf.id,
			workflow: wf.name,
			title: spec.title,
			number: spec.number,
			attempt: attempts,
			status: spec.status,
			conclusion: spec.conclusion,
			branch: spec.branch,
			sha: spec.sha,
			event: spec.event,
			actor: spec.actor,
			created_at: at(created),
			updated_at: at(done ? Math.max(created, ...ends) : T0),
			started_at: spec.status === 'queued' ? null : at(attemptStart(spec, attempts)),
			url: `https://github.com/${spec.repo}/actions/runs/${runId(index)}`
		}
	};
});

function runs(repository: string, filters: ActionsFilters, page: number) {
	repoKnown(repository);
	if (page < 1) fail('Invalid Actions page');
	const since = filters.created.startsWith('>=') ? Date.parse(filters.created.slice(2)) : NaN;
	const list = BUILT.map((b) => b.run)
		.filter((r) => r.repository === repository)
		.filter((r) => !filters.workflow_id || r.workflow_id === filters.workflow_id)
		.filter((r) => !filters.status || r.status === filters.status || r.conclusion === filters.status)
		.filter((r) => !filters.branch || r.branch === filters.branch)
		.filter((r) => !filters.event || r.event === filters.event)
		.filter((r) => !Number.isFinite(since) || Date.parse(r.created_at) >= since)
		.sort((a, b) => b.created_at.localeCompare(a.created_at));
	return { runs: page === 1 ? list : [], next_page: null, total: list.length };
}

function jobs(repository: string, run_id: string, attempt: number) {
	const built = BUILT.find((b) => b.run.repository === repository && b.run.id === run_id) ?? fail('Not Found (HTTP 404)');
	if (attempt < 1) fail('Invalid run attempt');
	const list = built.jobs[attempt] ?? [];
	return { jobs: list.map(({ log: _log, ...j }) => j), next_page: null };
}

function log(repository: string, job_id: string) {
	for (const b of BUILT) {
		if (b.run.repository !== repository) continue;
		for (const list of Object.values(b.jobs)) {
			const j = list.find((x) => x.id === job_id);
			if (j) return j.log === null ? fail('This job has no log yet. Logs are available when the job finishes.') : { text: j.log, truncated: false };
		}
	}
	return fail('Not Found (HTTP 404)');
}

// ── commands ────────────────────────────────────────────────────────────────

function page(repository: string, kind: GithubKind, cursor: string | null) {
	repoKnown(repository);
	if (kind === 'activity' && cursor && !/^\d+$/.test(cursor)) fail('Invalid activity page');
	const all = [...created, ...ITEMS].filter((i) => i.repository === repository && i.kind === kind);
	if (kind === 'activity' && repository === ATLAS) {
		return cursor === '2' ? { items: OLDER_ACTIVITY, next_cursor: null } : { items: all, next_cursor: '2' };
	}
	return { items: cursor ? [] : all.sort((a, b) => b.updated_at.localeCompare(a.updated_at)), next_cursor: null };
}

function createIssue(repository: string, title: string, body: string): GithubItem {
	const repo = REPOS.find((r) => r.full_name === repository) ?? fail(`Could not resolve to a Repository with the name '${repository}'.`);
	if (!repo.has_issues) fail('Issues are disabled for this repository (HTTP 410)');
	const clean = title.trim();
	if (!clean || [...clean].length > 256) fail('Issue title must contain 1 to 256 characters');
	const numbers = [...ITEMS, ...created].filter((i) => i.repository === repository && i.number).map((i) => i.number!);
	const number = Math.max(0, ...numbers) + 1;
	const item: GithubItem = { ...issue(repository, number, 0, LOGIN, clean, body), updated_at: at(Date.now()) };
	created.unshift(item);
	return item;
}

/** A worktree session checked out at a pull request's head, shaped like create_session's. */
function workSession(project_id: string, agent_id: string, repository: string, number: number, title: string): SessionView {
	if (!world.projects().some((p) => p.id === project_id)) fail('No such project');
	if (!ITEMS.some((i) => i.repository === repository && i.number === number && i.kind === 'pull_request')) fail('Could not resolve to a PullRequest.');
	const template = world.sessions()[0];
	const id = `pr-${number}-${Date.now().toString(36)}`;
	const now = Math.floor(Date.now() / 1000);
	const session: SessionView = {
		...template,
		id,
		project_id,
		agent_id,
		title,
		isolation: 'worktree',
		branch: `splash/pr-${number}`,
		cwd: `${template.cwd.replace(/\/[^/]+$/, '')}/pr-${number}`,
		status: 'idle',
		detail: null,
		attention: null,
		usage: null,
		created_at: now,
		updated_at: now,
		agent_session_id: `${agent_id}-${id}`,
		meta: { ...template.meta, options: [], usage: null }
	};
	adopt(session);
	return session;
}

export const githubCommands: Record<string, Handler> = {
	github_catalog: () => catalog(),
	github_page: (repository: string, kind: GithubKind, cursor: string | null) => page(repository, kind, cursor),
	github_search: (repositories: string[], kind: GithubKind, filters: GithubSearch, _cursor: string | null) => search(repositories, kind, filters),
	github_comments: (repository: string, number: number, kind: GithubKind) => comments(repository, number, kind),
	github_link_project: (repository: string, project_id: string | null) => {
		repoKnown(repository);
		if (project_id === null) links[repository] = [];
		else if (!world.projects().some((p) => p.id === project_id)) fail('No such project');
		else if (!(links[repository] ??= []).includes(project_id)) links[repository].push(project_id);
		return null;
	},
	github_create_issue: (repository: string, title: string, body: string) => createIssue(repository, title, body),
	github_work_session: (project_id: string, agent_id: string, repository: string, number: number, title: string) => workSession(project_id, agent_id, repository, number, title),

	github_actions_runs: (repository: string, filters: ActionsFilters, page: number) => runs(repository, filters, page),
	github_actions_workflows: (repository: string, page: number) => {
		repoKnown(repository);
		return { workflows: page === 1 ? WORKFLOWS.filter((w) => w.repository === repository) : [], next_page: null };
	},
	github_actions_jobs: (repository: string, run_id: string, attempt: number, _page: number) => jobs(repository, run_id, attempt),
	github_actions_log: (repository: string, job_id: string) => log(repository, job_id)
};
