// Agent history for the demo backend: session discovery, preview and import
// (`discover_sessions`, `preview_session`, `import_session`), plus refreshing
// and deleting a saved session's agent-side history. Shaped like the Rust
// responses in src/hub/sessions/library.rs and src/acp/history.rs.
//
// Every installed agent in the demo world has a few saved conversations in
// ~/code/atlas, ~/code/atlas-web and ~/code/release-tools. Some of them are
// the demo world's own sessions, so they show "In Splash".
import type { Entry, ExternalSession, HistoryCapabilities, Project, SessionPreview, SessionSource, SessionView } from '$splash/bindings';
import * as world from './world';
import { adopt, announceProject } from './backend';

type Handler = (...args: never[]) => unknown;

/**
 * The agent whose first listing fails (a locked session store), so "Find
 * sessions" shows a per-agent error with Retry. Retrying succeeds. Set to ''
 * to have every agent list cleanly.
 */
export const FLAKY_AGENT = '';

const WEB = `${world.HOME}/code/atlas-web`;
const TOOLS = `${world.HOME}/code/release-tools`;

const T0 = Date.now();
const iso = (minutes: number) => new Date(T0 - minutes * 60_000).toISOString().replace(/\.\d{3}Z$/, 'Z');
const seconds = () => Math.floor(Date.now() / 1000);
const H = 60;
const D = 24 * H;

function fail(message: string): never {
	throw new Error(message);
}

const agentName = (id: string) => world.AGENT_ROWS.find(([agent]) => agent === id)?.[1] ?? id;

/** What each agent's ACP adapter advertises for saved sessions. */
function capabilities(agent: string): HistoryCapabilities {
	const forks = agent === 'claude' || agent === 'codex';
	return { list: true, load: true, resume: true, close: true, delete: true, fork: forks, additional_directories: agent === 'claude' };
}

// ── saved conversations ─────────────────────────────────────────────────────

type Saved = {
	agent: string;
	id: string;
	cwd: string;
	title: string;
	minutes: number;
	additional?: string[];
	/** Only on the second page of the agent's list. */
	older?: boolean;
	entries: () => Entry[];
};

const tool = world.tool;
const user = (text: string): Entry => ({ kind: 'user', text });
const agent = (text: string): Entry => ({ kind: 'agent', text, streaming: false });
const thought = (text: string): Entry => ({ kind: 'thought', text, streaming: false });
const end = (ms: number): Entry => ({ kind: 'turn_end', stop_reason: 'end_turn', duration_ms: ms });

/** One of the demo world's own sessions, as its agent lists it. */
function local(agentId: string, sessionId: string, minutes: number): Saved {
	const s = world.sessions().find((x) => x.id === sessionId)!;
	return { agent: agentId, id: s.agent_session_id!, cwd: s.cwd, title: s.title, minutes, entries: () => world.transcripts()[sessionId] ?? [] };
}

const SAVED: Saved[] = [
	// Claude Code
	local('claude', 'cache-isolation', 18),
	{ agent: 'claude', id: '3f6c1e2a-8b4d-4c1e-9a7f-2d5b8e0c4a19', cwd: world.ATLAS, title: 'Profile the cold start of the asset cache', minutes: 2 * H + 10, entries: () => [
		user('Opening a project takes about two seconds before the cache is warm. Profile the cold start and tell me where the time goes.'),
		thought('Measure first. A CPU profile of the warm-up script will show whether this is I/O or hashing.'),
		tool({ title: 'node --cpu-prof scripts/warm-cache.ts', tool_kind: 'execute', input: 'node --cpu-prof scripts/warm-cache.ts', output: 'warmed 4,812 entries in 1,946 ms\nprofile written to CPU.20261007.091204.cpuprofile' }),
		tool({ title: `Read ${world.ATLAS}/src/cache.ts`, tool_kind: 'read', locations: [{ path: `${world.ATLAS}/src/cache.ts`, line: null }], output: world.CACHE_OLD }),
		agent('Most of the cold start is hashing, not disk:\n\n| Phase | Time |\n| --- | --- |\n| Hash file contents (SHA-256) | 1,210 ms |\n| Read index from disk | 412 ms |\n| Build key map | 324 ms |\n\nEvery file is re-hashed on open even when its mtime and size are unchanged. Keying the hash on `(path, mtime, size)` and only re-hashing changed files should bring a warm reopen under 300 ms. Want me to implement that?'),
		end(46_200)
	] },
	{ agent: 'claude', id: '8d2e4f61-0c3b-4a7e-b5d9-6e1f2a3c4b70', cwd: WEB, title: 'Default the download button to the universal build', minutes: 26 * H, entries: () => [
		user('Safari on Apple Silicon reports MacIntel, so we offer the Intel build. Default to the universal archive when we cannot tell.'),
		tool({ title: 'Search for MacIntel', tool_kind: 'search', input: 'MacIntel', output: 'src/lib/download.ts:14' }),
		tool({ title: `Edit ${WEB}/src/lib/download.ts`, tool_kind: 'edit', locations: [{ path: `${WEB}/src/lib/download.ts`, line: 12 }], content: [{ type: 'diff', path: `${WEB}/src/lib/download.ts`, old: 'export function pickAsset(platform: string) {\n  if (platform === "MacIntel") return "atlas-darwin-x64.tar.gz";\n  return "atlas-darwin-arm64.tar.gz";\n}\n', new: 'export function pickAsset(platform: string, arch?: string) {\n  if (arch === "arm") return "atlas-darwin-arm64.tar.gz";\n  if (arch === "x86") return "atlas-darwin-x64.tar.gz";\n  // Safari reports MacIntel on Apple Silicon too.\n  return "atlas-darwin-universal.tar.gz";\n}\n' }] }),
		agent('`pickAsset()` now trusts `navigator.userAgentData.getHighEntropyValues(["architecture"])` when the browser offers it, and otherwise offers the universal archive. The other architectures stay one click away under **Other downloads**.'),
		end(31_400)
	] },
	{ agent: 'claude', id: 'b47a90e3-61d2-4f8c-a0e5-93c7d1b2f468', cwd: world.ATLAS, additional: [TOOLS], title: 'Explain the bucket signing flow', minutes: 6 * D, entries: () => [
		user('How does an upload get signed? Walk me through it from `uploadAsset()` to the bucket.'),
		tool({ title: `Read ${world.ATLAS}/src/release/bucket.ts`, tool_kind: 'read', locations: [{ path: `${world.ATLAS}/src/release/bucket.ts`, line: null }] }),
		tool({ title: `Read ${TOOLS}/src/bucket.rs`, tool_kind: 'read', locations: [{ path: `${TOOLS}/src/bucket.rs`, line: 41 }] }),
		agent('1. `uploadAsset()` calls `put(key, body)` in `src/release/bucket.ts`.\n2. `put()` asks the release CLI (`release-tools sign-put`) for a pre-signed URL. The bucket key never leaves CI.\n3. `release-tools` signs `PUT /<key>` with a 10-minute expiry and the content type pinned, so a URL cannot be reused for a different file.\n4. The upload goes straight to the bucket with that URL.\n\nA `503 Slow Down` comes from step 4, so retrying with the same URL is safe while it is still valid.'),
		end(22_800)
	] },
	{ agent: 'claude', id: 'e19c5b27-3d8a-4f60-8b1e-5a2c7d94f03b', cwd: world.ATLAS, title: 'Write release notes for v0.2.0', minutes: 4 * D + 2 * H, entries: () => [
		user('Draft the v0.2.0 release notes from the merged PRs since v0.1.0.'),
		tool({ title: 'git log --merges --oneline v0.1.0..main', tool_kind: 'execute', input: 'git log --merges --oneline v0.1.0..main', output: 'a41c0de Merge pull request #117 from demo/asset-cache\n6e02b9f Merge pull request #115 from demo/parallel-uploads\n93d7c21 Merge pull request #112 from demo/macos-signing' }),
		agent('## v0.2.0\n\n- **Asset cache.** Rebuilds reuse unchanged assets (#117)\n- **Faster uploads.** Assets upload in parallel, four at a time (#115)\n- **Signed macOS builds.** Archives are signed and notarized (#112)\n\nI left out the dependency bumps. Want them in a short *Maintenance* section?'),
		end(18_300)
	] },
	{ agent: 'claude', id: '5c0d8e4b-27f1-4a93-9e6c-0b8f3a1d72e5', cwd: world.ATLAS, title: 'Move CI to Node 22', minutes: 12 * D, older: true, entries: () => [
		user('Move CI and the release workflow from Node 20 to Node 22.'),
		agent('Updated `node-version` in `ci.yml`, `release.yml` and `nightly-upload.yml`, and set `"engines": { "node": ">=22" }` in `package.json`. The test suite passes on 22.20.0.'),
		end(14_900)
	] },
	{ agent: 'claude', id: '2a9f7c13-e5b0-4d86-a1f4-c3e8b0d95a27', cwd: world.ATLAS, title: 'Set up vitest with fake timers', minutes: 20 * D, older: true, entries: () => [
		user('Add vitest, and show me how to test code that sleeps without waiting in real time.'),
		agent('Added `vitest` and a `test` script. For anything that sleeps, use `vi.useFakeTimers()` and `await vi.runAllTimersAsync()`: the test advances time instantly. See `tests/example.test.ts`.'),
		end(20_100)
	] },

	// Codex
	local('codex', 'cache-migration', 3),
	{ agent: 'codex', id: '0199b2c4-5e1a-7d3f-8c2b-4a6e9f1d0b37', cwd: world.ATLAS, title: 'Lint the release scripts with Biome', minutes: 5 * H, entries: () => [
		user('Add Biome and make `scripts/` pass. Do not change behavior.'),
		{ kind: 'plan', items: [
			{ content: 'Add Biome with the repository style', priority: 'high', status: 'completed' },
			{ content: 'Fix lint errors in scripts/', priority: 'high', status: 'completed' },
			{ content: 'Run the release tests', priority: 'medium', status: 'completed' }
		] },
		tool({ title: 'npx biome check scripts', tool_kind: 'execute', input: 'npx biome check scripts', output: 'Checked 9 files in 12ms. No fixes applied.' }),
		agent('Biome is set up (`biome.json` matches the existing two-space, double-quote style) and `scripts/` is clean. The only real finding was an unused `stat` import in `upload-nightly.ts`. `npm test` still passes.'),
		end(27_600)
	] },
	{ agent: 'codex', id: '0199a7e1-3c4d-7b20-9f8e-1d2c3b4a5f60', cwd: TOOLS, title: 'Port the nightly uploader to the release CLI', minutes: 3 * D, entries: () => [
		user('Move `scripts/upload-nightly.ts` into `release-tools` as `release-tools upload --nightly`.'),
		tool({ title: 'cargo test upload', tool_kind: 'execute', input: 'cargo test upload', output: 'running 3 tests\ntest upload::tests::dry_run_writes_nothing ... ok\ntest upload::tests::skips_existing_assets ... ok\ntest upload::tests::nightly_prefix_uses_the_date ... ok\n\ntest result: ok. 3 passed; 0 failed' }),
		agent('Added `release-tools upload --nightly`, which uploads to `nightly/<date>/` and skips assets that already exist. The TypeScript script can be deleted once the workflow switches over.'),
		end(52_400)
	] },

	// Gemini
	local('gemini', 'release-job', 11),
	{ agent: 'gemini', id: '6f2b8d14-9a3c-4e57-b0d1-7c8e2f5a9b36', cwd: world.ATLAS, title: 'Summarize open issues for the 0.3 milestone', minutes: 1 * D, entries: () => [
		user('What is still open for 0.3? Group it by area.'),
		tool({ title: 'gh issue list --milestone 0.3 --state open', tool_kind: 'execute', input: 'gh issue list --milestone 0.3 --state open', output: '126  Release validation fails on pre-release tags   bug, ci, release\n124  Release uploads fail about once a week with a 503   bug, release\n123  Cache entries leak between agents in the same project   bug, cache\n121  Full-text search across saved transcripts   enhancement, search' }),
		agent('**Release** (2): pre-release tags fail validation (#126); uploads hit intermittent 503s (#124).\n\n**Cache** (1): entries leak between agents in one project (#123). A fix is in review.\n\n**Search** (1): full-text transcript search (#121). The spike looked good; nothing is assigned.'),
		end(9_800)
	] },
	{ agent: 'gemini', id: '1d4c7a90-b3e2-4f15-8a6d-0e9c2b7f4a83', cwd: WEB, title: 'Find broken links in the docs', minutes: 2 * D, entries: () => [
		user('Crawl the built docs and list broken links.'),
		tool({ title: 'npx linkinator dist --recurse', tool_kind: 'execute', input: 'npx linkinator dist --recurse', output: 'Scanned 214 links, 2 broken:\n  [404] /docs/cache#eviction\n  [404] /releases/v0.1.0' }),
		agent('Two broken links. `/docs/cache#eviction` points at a heading that was renamed to *Expiry*, and `/releases/v0.1.0` should go to the GitHub release page.'),
		end(12_600)
	] },

	// OpenCode
	local('opencode', 'tree-keys', 26 * H),
	{ agent: 'opencode', id: 'ses_6a1f2c9e0ffeR3kq8ZtV1yN4pB', cwd: world.ATLAS, title: 'Tune type-ahead timing in the file tree', minutes: 25 * H, entries: () => [
		user('Type-ahead in the file tree resets too quickly. Match Finder.'),
		agent('Finder resets after roughly 700 ms without typing, so the timeout is now 700 ms (was 400 ms), and repeating the same letter cycles through names that start with it.'),
		end(11_200)
	] },
	{ agent: 'opencode', id: 'ses_6a0e91b4dffeK7wq2MxP5rT8cL', cwd: WEB, title: 'Fix focus ring contrast in dark mode', minutes: 3 * D, entries: () => [
		user('The focus ring is hard to see on dark backgrounds.'),
		agent('The ring used `--accent` at 40% opacity, about 2.1:1 against the dark surface. It now uses a solid 2 px ring with a 1 px offset, at 4.6:1.'),
		end(8_400)
	] },

	// Pi
	local('pi', 'fts-spike', 4 * D),
	{ agent: 'pi', id: '7e3a1c58-4b9d-4f02-a6e7-2c1d8b5f0a94', cwd: world.ATLAS, title: 'Draft a cache eviction policy', minutes: 8 * D, entries: () => [
		user('Propose an eviction policy for the asset cache. Disk is cheap, but not unlimited.'),
		agent('Least-recently-used with two limits: entries untouched for 7 days are dropped on startup, and the cache stays under 2 GB by evicting the oldest entries first. Pinned entries (the last release) are never evicted.'),
		end(16_700)
	] }
];

const find = (agentId: string, sessionId: string) => SAVED.find((s) => s.agent === agentId && s.id === sessionId);

function external(s: Saved): ExternalSession {
	return { session_id: s.id, cwd: s.cwd, title: s.title, updated_at: iso(s.minutes), additional_directories: s.additional ?? [], metadata_json: null };
}

// ── discovery ───────────────────────────────────────────────────────────────

let flaked = false;

function discover(agentId: string, cwd: string, cursor: string | null) {
	const name = agentName(agentId);
	if (!world.agents().some((a) => a.id === agentId && a.installed)) fail(`Could not start ${name} for session discovery: ${agentId}: command not found`);
	if (cwd && !cwd.startsWith('/')) fail(`Choose an absolute folder path: ${cwd}`);
	if (agentId === FLAKY_AGENT && !flaked) {
		flaked = true;
		fail(`${name} history request failed: Internal error: database is locked (another ${agentId} process is compacting its session store)`);
	}
	if (cursor !== null && cursor !== '2') fail(`${name} history request failed: Invalid params: unknown cursor`);
	const all = SAVED.filter((s) => s.agent === agentId && (!cwd || s.cwd === cwd)).sort((a, b) => a.minutes - b.minutes);
	const recent = all.filter((s) => !s.older);
	const older = all.filter((s) => s.older);
	const page = cursor === '2' ? older : recent;
	return { capabilities: capabilities(agentId), sessions: page.map(external), next_cursor: cursor === null && older.length ? '2' : null };
}

// ── preview and import ──────────────────────────────────────────────────────

type Cached = { preview: SessionPreview; at: number };
const previews = new Map<string, Cached>();
let previewSeq = 0;

function source(s: Saved): SessionSource {
	const updated = iso(s.minutes);
	return { capabilities: capabilities(s.agent), title: s.title, updated_at: updated, synced_updated_at: updated, metadata_json: null, last_synced_at: seconds(), last_local_activity_at: null, deleted: false };
}

function preview(agentId: string, info: ExternalSession): SessionPreview {
	const name = agentName(agentId);
	if (!info.session_id.trim()) fail('Enter a session ID.');
	if (!info.cwd.startsWith('/')) fail('Choose an absolute working directory.');
	const saved = find(agentId, info.session_id.trim()) ?? fail(`${name} history request failed: Resource not found: session ${info.session_id.trim()}`);
	// A copy: arguments can be the caller's reactive state, which cannot be cloned.
	const folders = [...(info.additional_directories ?? saved.additional ?? [])];
	if (folders.length && !capabilities(agentId).additional_directories) fail(`${name} history request failed: This agent no longer supports this session's additional folders. Its workspace cannot be restored safely.`);
	const result: SessionPreview = {
		token: `preview-${(++previewSeq).toString(36)}${Date.now().toString(36)}`,
		agent_id: agentId,
		session_id: saved.id,
		cwd: info.cwd,
		title: saved.title,
		entries: saved.entries(),
		additional_directories: folders,
		source: source(saved)
	};
	previews.set(result.token, { preview: result, at: Date.now() });
	return result;
}

/**
 * The app's own state modules. The demo backend keeps no record of sessions it
 * did not create, so history reads the live session list from the app (what
 * the Rust store would hold) and hands imports back to it. Loaded lazily:
 * a static import would cycle through bindings → runtime → backend.
 */
type Ui = [typeof import('$splash/lib/sessions.svelte'), typeof import('$splash/lib/transcripts.svelte')];
let ui: Ui | null = null;
void Promise.all([import('$splash/lib/sessions.svelte'), import('$splash/lib/transcripts.svelte')]).then((m) => (ui = m));

/** Sessions this visit imported or refreshed, by local id (until the app has them). */
const known = new Map<string, SessionView>();

/** Every saved session as plain data: the app's live list first, then ours and the world's. */
function allSessions(): SessionView[] {
	const live: SessionView[] = ui ? JSON.parse(JSON.stringify(ui[0].app.sessions)) : [];
	const byId = new Map<string, SessionView>();
	for (const s of [...live, ...known.values(), ...world.sessions()]) if (!byId.has(s.id)) byId.set(s.id, structuredClone(s));
	return [...byId.values()];
}

function lookup(id: string): SessionView {
	return allSessions().find((s) => s.id === id) ?? fail('No such session');
}

const timestamp = (value: string | null | undefined) => (value && Number.isFinite(Date.parse(value)) ? Math.floor(Date.parse(value) / 1000) : null);
const shortTitle = (title: string) => (title.length > 80 ? `${title.slice(0, 79)}…` : title);

function importSession(token: string): SessionView {
	const cached = previews.get(token);
	if (!cached || Date.now() - cached.at > 15 * 60_000) fail('Preview expired. Load the conversation again.');
	const p = cached.preview;
	const existing = allSessions().find((s) => s.agent_id === p.agent_id && s.agent_session_id === p.session_id);
	if (existing) {
		if (existing.cwd !== p.cwd) fail('The original working folder changed. Remove the local copy before importing it again.');
		const updated: SessionView = {
			...structuredClone(existing),
			title: existing.title_override ? existing.title : shortTitle(p.title),
			additional_directories: p.additional_directories,
			source: p.source,
			updated_at: timestamp(p.source.updated_at) ?? existing.updated_at
		};
		known.set(updated.id, updated);
		adopt(updated, p.entries);
		return updated;
	}
	const project = projectFor(p.cwd);
	const template = world.sessions()[0];
	const id = `s-${Date.now().toString(36)}${previewSeq}`;
	const caps = capabilities(p.agent_id);
	const session: SessionView = {
		...template,
		id,
		project_id: project.id,
		agent_id: p.agent_id,
		title: shortTitle(p.title),
		cwd: p.cwd,
		isolation: 'in_place',
		branch: 'main',
		agent_session_id: p.session_id,
		archived: false,
		created_at: seconds(),
		updated_at: timestamp(p.source.updated_at) ?? seconds(),
		usage: null,
		external: true,
		launch_args: '',
		attention: null,
		source: p.source,
		additional_directories: p.additional_directories,
		parent_id: null,
		title_override: false,
		status: 'exited',
		detail: null,
		meta: { ...template.meta, options: [], commands: [], usage: null, title: null, source_updated_at: p.source.updated_at ?? null, source_metadata_json: null, info_revision: 0, history_capabilities: caps }
	};
	known.set(id, session);
	if (!world.projects().some((x) => x.id === project.id)) announceProject(project);
	adopt(session, p.entries);
	return session;
}

/** The project an import lands in: atlas, or a new project for that folder. */
function projectFor(cwd: string): Project {
	const match = world.projects().find((p) => cwd === p.path || cwd.startsWith(`${p.path}/`));
	if (match) return match;
	const name = cwd.split('/').filter(Boolean).pop() ?? 'project';
	return { id: name, name, path: cwd, is_git: true, created_at: seconds() };
}

// ── saved sessions' agent-side history ──────────────────────────────────────

function refresh(id: string): SessionView {
	const s = lookup(id);
	if (!['exited', 'error'].includes(s.status)) fail('Disconnect this session before refreshing, forking, or deleting its agent history.');
	const now = seconds();
	const updated = s.source?.updated_at ?? new Date(s.updated_at * 1000).toISOString();
	const result: SessionView = { ...s, source: { ...s.source, capabilities: s.meta.history_capabilities ?? capabilities(s.agent_id), updated_at: updated, synced_updated_at: updated, last_synced_at: now, deleted: false } };
	known.set(id, result);
	return result;
}

function deleteNative(id: string): SessionView {
	const s = lookup(id);
	if (!['exited', 'error'].includes(s.status)) fail('Disconnect this session before refreshing, forking, or deleting its agent history.');
	if (s.source?.deleted) fail('This conversation was deleted from the agent. The local copy is read-only.');
	const result: SessionView = { ...s, source: { ...s.source, deleted: true } };
	known.set(id, result);
	return result;
}

export const historyCommands: Record<string, Handler> = {
	discover_sessions: (agent_id: string, cwd: string, cursor: string | null) => discover(agent_id, cwd, cursor),
	preview_session: (agent_id: string, session: ExternalSession) => preview(agent_id, session),
	import_session: (token: string) => importSession(token),
	refresh_session_history: (id: string) => refresh(id),
	delete_agent_history: (id: string) => deleteNative(id)
};
