// The demo world every live scene on the site shares: one project, a handful of
// sessions in different states, the agent registry and the files the agents
// touch. Synthetic data shaped exactly like the Rust backend's responses.
import type { AgentStatus, Entry, FileChange, Project, SessionView, Usage } from '$splash/bindings';
import { REGISTRY } from '../registry.ts';

export const HOME = '/Users/demo';
export const ATLAS = `${HOME}/code/atlas`;
const WORKTREES = `${HOME}/Library/Application Support/Splash/worktrees/atlas`;

const now = () => Math.floor(Date.now() / 1000);
export const minutesAgo = (m: number) => now() - m * 60;

// ── agents ──────────────────────────────────────────────────────────────────

type AgentRow = [id: string, name: string, launch: string, installed: boolean, version?: string];

/** Agents installed on the demo machine, with the versions they report. */
const INSTALLED: Record<string, string> = { claude: '0.81.1', codex: '1.13.1', gemini: '0.24.0', opencode: '1.0.12', pi: '0.0.33' };

/** The app's agent registry (src/agents/registry.rs); the demo machine has five installed. */
export const AGENT_ROWS: AgentRow[] = REGISTRY.map(({ id, name, launch }) => [id, name, launch, id in INSTALLED, INSTALLED[id]]);

export function agents(): AgentStatus[] {
	return AGENT_ROWS.map(([id, name, launch, installed, version]) => ({
		id,
		name,
		transport: launch.startsWith('npx') ? 'adapter' : 'native',
		experimental: false,
		launch,
		installed,
		cli_path: installed ? `${HOME}/.local/bin/${id}` : null,
		version: version ?? null,
		auth: installed ? 'ok' : 'unknown',
		auth_detail: null,
		runner_ok: true,
		probe: installed
			? { ok: true, error: null, agent_name: name, agent_version: version ?? null, protocol_version: 1, load_session: true, list_sessions: true, resume_session: id === 'claude' || id === 'codex', image: true, audio: false, embedded_context: true, auth_methods: [], options: [], commands: [], duration_ms: 1400, probed_at: now() - 600 }
			: null,
		extra_args: ''
	}));
}

// ── projects and sessions ───────────────────────────────────────────────────

export const projects = (): Project[] => [{ id: 'atlas', name: 'atlas', path: ATLAS, is_git: true, created_at: minutesAgo(60 * 24 * 9) }];

const MODEL = { id: 'model', name: 'Model', category: 'model', current: 'sonnet', choices: [
	{ value: 'opus', name: 'Opus', description: 'Most capable, slower' },
	{ value: 'sonnet', name: 'Sonnet', description: 'Balanced default' },
	{ value: 'haiku', name: 'Haiku', description: 'Fast and light' }
] };
const MODE = { id: 'mode', name: 'Mode', category: 'mode', current: 'default', choices: [
	{ value: 'default', name: 'Ask', description: 'Ask before edits and commands' },
	{ value: 'acceptEdits', name: 'Accept edits', description: 'Edit files without asking' },
	{ value: 'plan', name: 'Plan', description: 'Read only, propose a plan' }
] };
const COMMANDS = [
	{ name: 'review', description: 'Review the changes on this branch', hint: null },
	{ name: 'compact', description: 'Summarize the conversation to free context', hint: null },
	{ name: 'init', description: 'Write an AGENTS.md for this repository', hint: null }
];

const usage = (pct: number, cost: number | null): Usage => ({ used: Math.round(200_000 * pct), size: 200_000, cost_usd: cost, extra: [] });

type Seed = Partial<SessionView> & Pick<SessionView, 'id' | 'agent_id' | 'title' | 'status'>;

function session(seed: Seed): SessionView {
	const worktree = seed.isolation !== 'in_place';
	const slug = seed.branch?.replace('splash/', '') ?? seed.id;
	const u = seed.usage ?? null;
	return {
		project_id: 'atlas',
		cwd: worktree ? `${WORKTREES}/${slug}` : ATLAS,
		isolation: 'worktree',
		branch: null,
		base_sha: '2b024bcc',
		agent_session_id: `${seed.agent_id}-${seed.id}`,
		archived: false,
		created_at: minutesAgo(90),
		updated_at: minutesAgo(5),
		usage: u,
		external: false,
		launch_args: null,
		attention: null,
		additional_directories: [],
		parent_id: null,
		title_override: false,
		source: { capabilities: { list: true, load: true, resume: true, close: true, delete: true, fork: true }, title: null, updated_at: null, metadata_json: null, synced_updated_at: null, last_synced_at: null, deleted: false },
		detail: null,
		meta: {
			options: seed.agent_id === 'claude' ? [MODE, MODEL] : [MODE],
			legacy_modes: false,
			commands: COMMANDS,
			usage: u,
			title: null,
			source_updated_at: null,
			source_metadata_json: null,
			info_revision: 0,
			history_capabilities: { list: true, load: true, resume: true, close: true, delete: true, fork: seed.agent_id === 'claude' || seed.agent_id === 'codex' }
		},
		...seed
	} as SessionView;
}

/** The session the hero demo streams into. */
export const HERO = 'upload-retry';

export function sessions(): SessionView[] {
	return [
		session({ id: HERO, agent_id: 'claude', title: 'Retry failed release uploads', status: 'idle', branch: 'splash/upload-retry', usage: usage(0.06, 0.04), created_at: minutesAgo(1), updated_at: minutesAgo(0) }),
		session({ id: 'cache-migration', agent_id: 'codex', title: 'Validate the cache migration', status: 'awaiting_permission', branch: 'splash/cache-migration', usage: usage(0.22, null), attention: { kind: 'permission', detail: 'Codex is waiting for you to allow or reject a command.', at: minutesAgo(3) } }),
		session({ id: 'release-job', agent_id: 'gemini', title: 'Repair the release validation job', status: 'error', branch: 'splash/release-job', detail: 'Agent exited with code 1', attention: { kind: 'failed', detail: 'The agent process exited before validation finished. Reconnect to continue this conversation.', at: minutesAgo(11) } }),
		session({ id: 'cache-isolation', agent_id: 'claude', title: 'Fix project cache isolation', status: 'idle', branch: 'splash/session-history', usage: usage(0.31, 0.62), attention: { kind: 'review', detail: 'The agent finished. Review its response and changes.', at: minutesAgo(18) } }),
		session({ id: 'tree-keys', agent_id: 'opencode', title: 'Keyboard navigation in the file tree', status: 'exited', isolation: 'in_place', branch: 'main', updated_at: minutesAgo(60 * 26) }),
		session({ id: 'fts-spike', agent_id: 'pi', title: 'Spike: full-text search for transcripts', status: 'exited', branch: 'splash/fts-spike', archived: true, updated_at: minutesAgo(60 * 24 * 4) })
	];
}

// ── files ───────────────────────────────────────────────────────────────────

export const UPLOAD_OLD = `import { put } from "./bucket";
import type { Asset } from "./types";

export async function uploadAsset(asset: Asset): Promise<string> {
  const res = await put(asset.key, asset.body, { contentType: asset.type });
  if (!res.ok) throw new Error(\`upload failed: \${res.status}\`);
  return res.url;
}
`;

export const UPLOAD_NEW = `import { put } from "./bucket";
import type { Asset } from "./types";

const RETRYABLE = new Set([429, 502, 503, 504]);

export async function uploadAsset(asset: Asset, attempts = 4): Promise<string> {
  for (let attempt = 1; ; attempt++) {
    const res = await put(asset.key, asset.body, { contentType: asset.type });
    if (res.ok) return res.url;
    if (!RETRYABLE.has(res.status) || attempt === attempts) {
      throw new Error(\`upload failed after \${attempt} attempts: \${res.status}\`);
    }
    await sleep(250 * 2 ** (attempt - 1));
  }
}

const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms));
`;

export const TEST_NEW = `import { describe, expect, it, vi } from "vitest";
import { uploadAsset } from "../src/release/upload";
import * as bucket from "../src/release/bucket";

const asset = { key: "v0.2.0/Splash.zip", body: new Uint8Array(), type: "application/zip" };

describe("uploadAsset", () => {
  it("retries a 503 and returns the URL", async () => {
    vi.useFakeTimers();
    const put = vi.spyOn(bucket, "put")
      .mockResolvedValueOnce({ ok: false, status: 503, url: "" })
      .mockResolvedValueOnce({ ok: true, status: 200, url: "https://cdn/v0.2.0/Splash.zip" });
    const done = uploadAsset(asset);
    await vi.runAllTimersAsync();
    await expect(done).resolves.toBe("https://cdn/v0.2.0/Splash.zip");
    expect(put).toHaveBeenCalledTimes(2);
  });

  it("gives up after the last attempt", async () => {
    vi.useFakeTimers();
    vi.spyOn(bucket, "put").mockResolvedValue({ ok: false, status: 503, url: "" });
    const done = uploadAsset(asset, 3);
    await vi.runAllTimersAsync();
    await expect(done).rejects.toThrow("after 3 attempts");
  });

  it("does not retry a 403", async () => {
    const put = vi.spyOn(bucket, "put").mockResolvedValue({ ok: false, status: 403, url: "" });
    await expect(uploadAsset(asset)).rejects.toThrow("403");
    expect(put).toHaveBeenCalledTimes(1);
  });
});
`;

export const CACHE_OLD = `import { createHash } from "node:crypto";
import type { Store } from "./store";

/** One cache per project; entries expire after a day. */
const TTL_MS = 24 * 60 * 60 * 1000;

export function cacheKey(project: string, file: string) {
  return \`\${project}:\${file}\`;
}

export async function cached(store: Store, project: string, file: string, read: () => Promise<string>) {
  const key = cacheKey(project, file);
  const hit = await store.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.value;
  const value = await read();
  await store.set(key, { value, at: Date.now(), hash: digest(value) });
  return value;
}

const digest = (value: string) => createHash("sha256").update(value).digest("hex");
`;

export const CACHE_NEW = `import { createHash } from "node:crypto";
import type { Store } from "./store";

/** One cache per project and agent; entries expire after a day. */
const TTL_MS = 24 * 60 * 60 * 1000;

export function cacheKey(project: string, agent: string, file: string) {
  const root = project.replace(/\\/+$/, "");
  return \`\${root}:\${agent}:\${file}\`;
}

export async function cached(store: Store, project: string, agent: string, file: string, read: () => Promise<string>) {
  const key = cacheKey(project, agent, file);
  const hit = await store.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.value;
  const value = await read();
  await store.set(key, { value, at: Date.now(), hash: digest(value) });
  return value;
}

const digest = (value: string) => createHash("sha256").update(value).digest("hex");
`;

export const CACHE_TEST = `import { describe, expect, it } from "vitest";
import { cacheKey } from "../src/cache";

describe("cacheKey", () => {
  it("keeps Claude and Codex apart in one project", () => {
    expect(cacheKey("/atlas", "claude", "a.ts")).not.toBe(cacheKey("/atlas", "codex", "a.ts"));
  });

  it("ignores a trailing slash on the project path", () => {
    expect(cacheKey("/atlas/", "claude", "a.ts")).toBe(cacheKey("/atlas", "claude", "a.ts"));
  });
});
`;

type FileRecord = { old: string | null; new: string | null; status: string };

/** Changed files per session, relative to the session folder. */
export const CHANGED: Record<string, Record<string, FileRecord>> = {
	'cache-isolation': {
		'src/cache.ts': { old: CACHE_OLD, new: CACHE_NEW, status: 'M' },
		'tests/cache.test.ts': { old: null, new: CACHE_TEST, status: '?' }
	}
};

/** The same tree in every session folder, for the Files tab. */
export const TREE: Record<string, string[]> = {
	'': ['src/', 'tests/', 'package.json', 'README.md', 'tsconfig.json'],
	src: ['release/', 'cache.ts', 'index.ts'],
	'src/release': ['bucket.ts', 'types.ts', 'upload.ts'],
	tests: ['cache.test.ts', 'upload.test.ts']
};

export const FILES: Record<string, string> = {
	'src/release/upload.ts': UPLOAD_OLD,
	'src/cache.ts': CACHE_OLD,
	'package.json': `{\n  "name": "atlas",\n  "private": true,\n  "type": "module",\n  "scripts": { "test": "vitest run", "build": "tsc -p ." },\n  "devDependencies": { "typescript": "^5.9.3", "vitest": "^3.2.4" }\n}\n`,
	'README.md': '# atlas\n\nRelease tooling and the asset cache for the demo project.\n'
};

// ── transcripts ─────────────────────────────────────────────────────────────

let toolId = 0;
export const tool = (over: Partial<Extract<Entry, { kind: 'tool' }>>): Extract<Entry, { kind: 'tool' }> => ({
	kind: 'tool',
	id: `t${++toolId}`,
	title: 'Tool',
	tool_kind: 'other',
	status: 'completed',
	locations: [],
	content: [],
	input: null,
	output: null,
	...over
});

export const PERMISSION_OPTIONS = [
	{ id: 'allow', name: 'Allow', kind: 'allow_once' },
	{ id: 'always', name: 'Always allow', kind: 'allow_always' },
	{ id: 'reject', name: 'Reject', kind: 'reject_once' }
];

const cacheCwd = `${WORKTREES}/session-history`;
const migrationCwd = `${WORKTREES}/cache-migration`;

/** Saved transcripts for every session except the hero, which streams. */
export function transcripts(): Record<string, Entry[]> {
	return {
		[HERO]: [],
		'cache-isolation': [
			{ kind: 'user', text: 'The cache is shared between agents working in Atlas. Use both project and agent when building the cache key.' },
			{ kind: 'thought', text: 'Two agents in one project collide on the same key. Add the agent to the key and normalize the project path so trailing slashes do not split entries.', streaming: false },
			tool({ title: `Read ${cacheCwd}/src/cache.ts`, tool_kind: 'read', locations: [{ path: `${cacheCwd}/src/cache.ts`, line: null }], output: CACHE_OLD }),
			tool({ title: `Edit ${cacheCwd}/src/cache.ts`, tool_kind: 'edit', locations: [{ path: `${cacheCwd}/src/cache.ts`, line: 1 }], content: [{ type: 'diff', path: `${cacheCwd}/src/cache.ts`, old: CACHE_OLD, new: CACHE_NEW }] }),
			tool({ title: 'npm test -- cache', tool_kind: 'execute', input: 'npm test -- cache', output: ' ✓ tests/cache.test.ts (6 tests) 12ms\n\n Test Files  1 passed (1)\n      Tests  6 passed (6)' }),
			{ kind: 'agent', text: 'Updated `src/cache.ts` to include the agent in every cache key.\n\n- Added coverage for Claude and Codex using the same project.\n- Normalized trailing slashes in project paths.\n- Ran the cache tests successfully.\n\nThe changes are ready for review.', streaming: false },
			{ kind: 'turn_end', stop_reason: 'end_turn', duration_ms: 51_800 }
		],
		'cache-migration': [
			{ kind: 'user', text: 'Check that the cache migration is safe to run against the staging database. Dry run first.' },
			{ kind: 'plan', items: [
				{ content: 'Read the migration and its rollback', priority: 'high', status: 'completed' },
				{ content: 'Dry run against staging', priority: 'high', status: 'in_progress' },
				{ content: 'Report row counts and lock time', priority: 'medium', status: 'pending' }
			] },
			tool({ title: `Read ${migrationCwd}/migrations/0007_cache_agent.sql`, tool_kind: 'read', locations: [{ path: `${migrationCwd}/migrations/0007_cache_agent.sql`, line: null }], output: 'ALTER TABLE cache ADD COLUMN agent TEXT NOT NULL DEFAULT \'unknown\';\nCREATE INDEX cache_project_agent ON cache (project, agent);' }),
			{ kind: 'permission', request_id: 'migrate-1', title: 'npm run migrate -- --dry-run --target staging', tool_id: null, options: PERMISSION_OPTIONS, resolution: null }
		],
		'release-job': [
			{ kind: 'user', text: 'The release validation job fails on tags with a pre-release suffix. Find out why and fix it.' },
			tool({ title: 'Search for VERSION_PATTERN', tool_kind: 'search', input: 'VERSION_PATTERN', output: 'scripts/validate-release.ts:4\n.github/workflows/release.yml:41' }),
			{ kind: 'error', text: 'Agent exited with code 1\nerror: request timed out after 300s' }
		],
		'tree-keys': [
			{ kind: 'user', text: 'Arrow keys should move through the file tree like Finder: right expands, left collapses or goes to the parent.' },
			{ kind: 'agent', text: 'Implemented roving focus in `FileTree`: ↑ ↓ move, → expands or enters, ← collapses or returns to the parent, and Home/End jump to the ends. Typing a letter jumps to the next matching name.', streaming: false },
			{ kind: 'turn_end', stop_reason: 'end_turn', duration_ms: 74_100 }
		],
		'fts-spike': [
			{ kind: 'user', text: 'Spike: can SQLite FTS5 search a year of transcripts fast enough?' },
			{ kind: 'agent', text: 'Yes. Prefix queries over 40k entries return in under 5 ms with an external-content FTS5 table kept in sync by triggers.', streaming: false },
			{ kind: 'turn_end', stop_reason: 'end_turn', duration_ms: 28_900 }
		]
	};
}

export function changedFiles(session: string): FileChange[] {
	return Object.entries(CHANGED[session] ?? {}).map(([path, f]) => ({
		path,
		status: f.status,
		additions: lines(f.new) - (f.old ? common(f.old, f.new) : 0),
		deletions: f.old ? lines(f.old) - common(f.old, f.new) : 0,
		binary: false
	}));
}

const lines = (s: string | null) => (s ? s.trimEnd().split('\n').length : 0);
function common(a: string, b: string | null) {
	if (!b) return 0;
	const right = new Set(b.split('\n'));
	return a.trimEnd().split('\n').filter((l) => right.has(l)).length;
}
