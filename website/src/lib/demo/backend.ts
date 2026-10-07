// An in-browser stand-in for Splash's Rust backend. It answers the commands
// the shared components call (`api.*` → `invoke`) and pushes events on the
// same channels, so the app's own state modules (sessions, transcripts,
// workspace) do all the rendering work, exactly as they do in the desktop app.
//
// Agents here are scripts: the hero session replays a task, and any prompt
// sent from a Composer gets an honest "this is a demo" reply.
import type { DirEntry, Entry, FileChange, Project, RpcLine, SessionView } from '$splash/bindings';
import * as world from './world';
import { pushToast } from './toasts.svelte';
import { githubCommands } from './github';
import { historyCommands } from './history';

// ── channels ────────────────────────────────────────────────────────────────

type Listener = (value: unknown) => void;
const listeners = new Map<string, Set<Listener>>();

export function subscribe(name: string, handler: Listener) {
	let set = listeners.get(name);
	if (!set) listeners.set(name, (set = new Set()));
	set.add(handler);
	return () => void set.delete(handler);
}

function emit(name: string, value: unknown) {
	for (const handler of listeners.get(name) ?? []) handler(structuredClone(value));
}

// ── state ───────────────────────────────────────────────────────────────────

type Log = { entries: Entry[]; versions: number[] };
type FileRecord = { old: string | null; new: string | null; status: string };

let sessions: SessionView[] = [];
let logs: Record<string, Log> = {};
let changed: Record<string, Record<string, FileRecord>> = {};
const rpc: Record<string, RpcLine[]> = {};

function reset() {
	sessions = world.sessions();
	logs = Object.fromEntries(Object.entries(world.transcripts()).map(([id, entries]) => [id, { entries, versions: entries.map(() => 1) }]));
	changed = structuredClone(world.CHANGED);
}
reset();

const now = () => Math.floor(Date.now() / 1000);
const find = (id: string) => sessions.find((s) => s.id === id);
const agentName = (id: string) => world.AGENT_ROWS.find(([agent]) => agent === id)?.[1] ?? id;

function patch(id: string, change: Partial<SessionView>) {
	const s = find(id);
	if (!s) return;
	Object.assign(s, change, { updated_at: now() });
	if (change.usage !== undefined) s.meta.usage = change.usage;
	emit('session', s);
}

function log(id: string): Log {
	return (logs[id] ??= { entries: [], versions: [] });
}

/** Append an entry; returns its index. */
function push(id: string, entry: Entry): number {
	const l = log(id);
	const index = l.entries.length;
	l.entries.push(entry);
	l.versions.push(1);
	emit('transcript', { session: id, changes: [{ op: 'upsert', index, version: 1, entry }], reset: null });
	traffic(id, entry, 'new');
	return index;
}

/** Replace an entry in place (a tool finishing, a plan step ticking over). */
function put(id: string, index: number, entry: Entry) {
	const l = log(id);
	l.entries[index] = entry;
	const version = ++l.versions[index];
	emit('transcript', { session: id, changes: [{ op: 'upsert', index, version, entry }], reset: null });
	traffic(id, entry, 'update');
}

/** Stream text onto an agent or thought entry. */
function append(id: string, index: number, delta: string) {
	const l = log(id);
	const entry = l.entries[index];
	if (entry.kind !== 'agent' && entry.kind !== 'thought') return;
	entry.text += delta;
	const version = ++l.versions[index];
	emit('transcript', { session: id, changes: [{ op: 'append_text', index, version, delta }], reset: null });
	acp(id, 'in', { jsonrpc: '2.0', method: 'session/update', params: { sessionId: sid(id), update: { sessionUpdate: entry.kind === 'agent' ? 'agent_message_chunk' : 'agent_thought_chunk', content: { type: 'text', text: delta } } } });
}

/**
 * Take over a session another demo module created (an imported conversation,
 * a pull request worktree), so prompts and its transcript work like any other.
 */
export function adopt(session: SessionView, entries: Entry[] = []) {
	const copy = structuredClone(session);
	const i = sessions.findIndex((s) => s.id === copy.id);
	if (i === -1) sessions.unshift(copy);
	else sessions[i] = copy;
	logs[copy.id] = { entries: structuredClone(entries), versions: entries.map(() => 1) };
	emit('transcript', { session: copy.id, changes: [], reset: logs[copy.id] });
}

/** A project added outside the project list (an import from another folder). */
export function announceProject(project: Project) {
	emit('project', project);
}

function touch(id: string, path: string, file: FileRecord) {
	(changed[id] ??= {})[path] = file;
	emit('workspace', { session: id, paths: [path] });
}

// ── ACP traffic for the Log tab ─────────────────────────────────────────────

const sid = (id: string) => find(id)?.agent_session_id ?? id;
let rpcId = 0;

function acp(id: string, dir: 'in' | 'out', message: object) {
	const line: RpcLine = { session: id, dir, at: Date.now() / 1000, line: JSON.stringify(message) };
	(rpc[id] ??= []).push(line);
	emit('rpc', line);
}

function traffic(id: string, entry: Entry, phase: 'new' | 'update') {
	const sessionId = sid(id);
	const update = (u: object) => acp(id, 'in', { jsonrpc: '2.0', method: 'session/update', params: { sessionId, update: u } });
	switch (entry.kind) {
		case 'user':
			return acp(id, 'out', { jsonrpc: '2.0', id: ++rpcId, method: 'session/prompt', params: { sessionId, prompt: [{ type: 'text', text: entry.text }] } });
		case 'tool':
			return update({ sessionUpdate: phase === 'new' ? 'tool_call' : 'tool_call_update', toolCallId: entry.id, title: entry.title, kind: entry.tool_kind, status: entry.status, ...(entry.locations.length ? { locations: entry.locations } : {}) });
		case 'plan':
			return update({ sessionUpdate: 'plan', entries: entry.items });
		case 'permission':
			if (phase === 'new') return acp(id, 'in', { jsonrpc: '2.0', id: entry.request_id, method: 'session/request_permission', params: { sessionId, toolCall: { toolCallId: entry.tool_id ?? entry.request_id, title: entry.title }, options: entry.options.map((o) => ({ optionId: o.id, name: o.name, kind: o.kind })) } });
			return acp(id, 'out', { jsonrpc: '2.0', id: entry.request_id, result: { outcome: entry.resolution === 'cancelled' ? { outcome: 'cancelled' } : { outcome: 'selected', optionId: entry.resolution } } });
		case 'turn_end':
			return acp(id, 'in', { jsonrpc: '2.0', id: rpcId, result: { stopReason: entry.stop_reason } });
	}
}

// ── scripted agents ─────────────────────────────────────────────────────────

class Stopped extends Error {}
const runs: Record<string, number> = {};

/** A cancellable timeline for one session: a newer run, or a cancel, stops it. */
function runner(id: string) {
	const token = (runs[id] = (runs[id] ?? 0) + 1);
	const alive = () => runs[id] === token;
	return {
		alive,
		wait: (ms: number) => new Promise<void>((ok, fail) => setTimeout(() => (alive() ? ok() : fail(new Stopped())), ms))
	};
}
type Run = ReturnType<typeof runner>;

const stop = (id: string) => void (runs[id] = (runs[id] ?? 0) + 1);

/** Stream text word by word, the way agents send message chunks. */
async function say(id: string, r: Run, kind: 'agent' | 'thought', text: string, pace = 26) {
	const index = push(id, { kind, text: '', streaming: true });
	for (const word of text.match(/\s*\S+|\s+$/g) ?? []) {
		await r.wait(pace + Math.random() * pace);
		append(id, index, word);
	}
	put(id, index, { kind, text, streaming: false });
}

/** A tool call that runs for a while, then lands as `done`. */
async function run(id: string, r: Run, done: Extract<Entry, { kind: 'tool' }>, ms: number) {
	const index = push(id, { ...done, status: 'in_progress', content: [], output: null });
	await r.wait(ms);
	put(id, index, done);
	return index;
}

const waiting: Record<string, (option: string | null) => void> = {};

/** Ask the visitor for permission; resolves with the chosen option id. */
function ask(id: string, request_id: string, title: string): Promise<string | null> {
	push(id, { kind: 'permission', request_id, title, tool_id: null, options: world.PERMISSION_OPTIONS, resolution: null });
	patch(id, { status: 'awaiting_permission', attention: { kind: 'permission', detail: `${agentName(find(id)!.agent_id)} is waiting for you to allow or reject a command.`, at: now() } });
	return new Promise((ok) => (waiting[request_id] = ok));
}

const finish = (id: string, ms: number, review = true) => {
	push(id, { kind: 'turn_end', stop_reason: 'end_turn', duration_ms: ms });
	patch(id, { status: 'idle', attention: review ? { kind: 'review', detail: 'The agent finished. Review its response and changes.', at: now() } : null });
};

function guard(task: Promise<void>) {
	task.catch((e) => {
		if (!(e instanceof Stopped)) console.error(e);
	});
}

const HERO_PROMPT = 'Uploads to the release bucket fail about once a week with a 503. Add a retry with backoff to `uploadAsset()` and cover it with tests.';

/** Listeners for the hero's progress (the site shows hints beside the window). */
export const heroListeners = new Set<(phase: 'running' | 'permission' | 'done') => void>();
const heroPhase = (phase: 'running' | 'permission' | 'done') => heroListeners.forEach((l) => l(phase));

/** Replay the hero task from the start. */
export function playHero() {
	const id = world.HERO;
	stop(id);
	logs[id] = { entries: [], versions: [] };
	rpc[id] = [];
	changed[id] = {};
	emit('transcript', { session: id, changes: [], reset: { entries: [], versions: [] } });
	emit('workspace', { session: id, paths: [] });
	guard(hero(id, runner(id)));
}

async function hero(id: string, r: Run) {
	const cwd = find(id)!.cwd;
	const at = (path: string) => `${cwd}/${path}`;
	heroPhase('running');
	patch(id, { status: 'starting', attention: null, usage: { used: 9_400, size: 200_000, cost_usd: 0, extra: [] } });
	acp(id, 'out', { jsonrpc: '2.0', id: ++rpcId, method: 'initialize', params: { protocolVersion: 1, clientCapabilities: { fs: { readTextFile: false, writeTextFile: false }, terminal: false } } });
	await r.wait(400);
	acp(id, 'in', { jsonrpc: '2.0', id: rpcId, result: { protocolVersion: 1, agentInfo: { name: '@agentclientprotocol/claude-agent-acp', version: '0.81.1' }, agentCapabilities: { loadSession: true, sessionCapabilities: { list: {}, resume: {}, fork: {}, close: {} } } } });
	acp(id, 'out', { jsonrpc: '2.0', id: ++rpcId, method: 'session/new', params: { cwd, mcpServers: [] } });
	acp(id, 'in', { jsonrpc: '2.0', id: rpcId, result: { sessionId: sid(id) } });
	push(id, { kind: 'user', text: HERO_PROMPT });
	patch(id, { status: 'running' });
	await r.wait(700);
	await say(id, r, 'thought', 'The upload lives in src/release/upload.ts. Read it and the callers first, keep the public signature compatible, and only retry statuses that are worth retrying.', 14);

	const steps = ['Read uploadAsset() and its callers', 'Retry 429 and 5xx with exponential backoff', 'Cover recovery, give-up and no-retry cases', 'Run the release tests'];
	let progress = 0;
	const planItems = () => steps.map((content, i) => ({ content, priority: i < 2 ? 'high' : 'medium', status: i < progress ? 'completed' : i === progress ? 'in_progress' : 'pending' }));
	const plan = push(id, { kind: 'plan', items: planItems() });
	const tick = () => { progress++; put(id, plan, { kind: 'plan', items: planItems() }); };

	await r.wait(500);
	await run(id, r, world.tool({ title: `Read ${at('src/release/upload.ts')}`, tool_kind: 'read', locations: [{ path: at('src/release/upload.ts'), line: null }], output: world.UPLOAD_OLD }), 700);
	await run(id, r, world.tool({ title: 'Search for uploadAsset(', tool_kind: 'search', input: 'uploadAsset(', output: 'src/release/publish.ts:18\nsrc/release/publish.ts:44\nscripts/upload-nightly.ts:9' }), 900);
	patch(id, { usage: { used: 21_800, size: 200_000, cost_usd: 0.02, extra: [] } });
	tick();
	await r.wait(400);
	await run(id, r, world.tool({ title: `Edit ${at('src/release/upload.ts')}`, tool_kind: 'edit', locations: [{ path: at('src/release/upload.ts'), line: 4 }], content: [{ type: 'diff', path: at('src/release/upload.ts'), old: world.UPLOAD_OLD, new: world.UPLOAD_NEW }] }), 1100);
	touch(id, 'src/release/upload.ts', { old: world.UPLOAD_OLD, new: world.UPLOAD_NEW, status: 'M' });
	tick();
	await run(id, r, world.tool({ title: `Write ${at('tests/upload.test.ts')}`, tool_kind: 'edit', locations: [{ path: at('tests/upload.test.ts'), line: 1 }], content: [{ type: 'diff', path: at('tests/upload.test.ts'), old: null, new: world.TEST_NEW }] }), 1300);
	touch(id, 'tests/upload.test.ts', { old: null, new: world.TEST_NEW, status: '?' });
	patch(id, { usage: { used: 34_200, size: 200_000, cost_usd: 0.05, extra: [] } });
	tick();
	await run(id, r, world.tool({ title: 'npm test -- upload', tool_kind: 'execute', input: 'npm test -- upload', output: ' ✓ tests/upload.test.ts (3 tests) 38ms\n   ✓ retries a 503 and returns the URL\n   ✓ gives up after the last attempt\n   ✓ does not retry a 403\n\n Test Files  1 passed (1)\n      Tests  3 passed (3)' }), 2200);
	tick();

	heroPhase('permission');
	const choice = await ask(id, 'push-1', 'git push -u origin splash/upload-retry');
	heroPhase('running');
	await r.wait(300);
	if (choice === 'reject' || choice === null) {
		await say(id, r, 'agent', 'Okay, I left the branch unpushed. Everything is committed on `splash/upload-retry`; review the diff in the side panel and push it when you are ready.');
	} else {
		await run(id, r, world.tool({ title: 'git push -u origin splash/upload-retry', tool_kind: 'execute', input: 'git push -u origin splash/upload-retry', output: "To github.com:demo/atlas.git\n * [new branch]      splash/upload-retry -> splash/upload-retry\nbranch 'splash/upload-retry' set up to track 'origin/splash/upload-retry'." }), 1200);
		await say(id, r, 'agent', [
			'Done. `uploadAsset()` now retries 429 and 5xx responses up to four times, waiting 250 ms, 500 ms and 1 s between attempts.',
			'',
			'- `src/release/upload.ts`: retry loop with exponential backoff; the extra `attempts` argument is optional, so callers are unchanged',
			'- `tests/upload.test.ts`: a 503 that recovers, giving up after the last attempt, and no retry on a 403',
			'',
			'All three tests pass and `splash/upload-retry` is pushed. The diff is in the Review panel.'
		].join('\n'));
	}
	patch(id, { usage: { used: 41_900, size: 200_000, cost_usd: 0.07, extra: [] } });
	finish(id, 38_400);
	heroPhase('done');
}

/** The other pending permission in the demo world. */
async function migration(id: string, r: Run, choice: string | null) {
	patch(id, { status: 'running' });
	if (choice === 'reject' || choice === null) {
		await say(id, r, 'agent', 'Understood, I did not run the migration. The SQL only adds a defaulted column and an index, so a dry run is safe whenever you want one.');
		return finish(id, 4_100, false);
	}
	await run(id, r, world.tool({ title: 'npm run migrate -- --dry-run --target staging', tool_kind: 'execute', input: 'npm run migrate -- --dry-run --target staging', output: 'dry run: 0007_cache_agent.sql\n  ALTER TABLE cache   18,204 rows, est. lock 120 ms\n  CREATE INDEX        est. 340 ms (concurrent)\nno changes written' }), 1600);
	await say(id, r, 'agent', 'The dry run is clean: **18,204 rows** gain the `agent` column with a default, and the table lock is about 120 ms. The index builds concurrently. Safe to run on staging.');
	finish(id, 12_700);
}

/** Any prompt typed into a Composer on the site. */
async function reply(id: string, r: Run, text: string) {
	const s = find(id)!;
	push(id, { kind: 'user', text });
	patch(id, { status: 'running', attention: null });
	await r.wait(600);
	await say(id, r, 'thought', 'No agent is attached in the browser, so explain what would happen.', 14);
	await say(id, r, 'agent', `This window is Splash's own interface running on demo data in your browser, so nothing left this page. In the desktop app, this prompt goes to **${agentName(s.agent_id)}** over ACP, and its tool calls, diffs and permission requests stream in right here.\n\nDownload Splash to run it on your own repositories.`);
	finish(id, 3_600, false);
}

// ── commands ────────────────────────────────────────────────────────────────

const demoOnly = (what: string) => pushToast(`${what} is available in the desktop app.`);

function listDir(path: string): DirEntry[] {
	return (world.TREE[path] ?? []).map((name) => {
		const dir = name.endsWith('/');
		const clean = dir ? name.slice(0, -1) : name;
		return { name: clean, path: path ? `${path}/${clean}` : clean, is_dir: dir };
	});
}

function changes(id: string): FileChange[] {
	const records = changed[id] ?? {};
	return Object.entries(records).map(([path, f]) => {
		const before = new Set((f.old ?? '').split('\n'));
		const after = (f.new ?? '').trimEnd().split('\n');
		const kept = after.filter((l) => before.has(l)).length;
		return { path, status: f.status, additions: after.length - kept, deletions: f.old ? f.old.trimEnd().split('\n').length - kept : 0, binary: false };
	});
}

function excerpt(text: string, at: number) {
	const start = Math.max(0, at - 40);
	return (start ? '…' : '') + text.slice(start, at + 80).replace(/\s+/g, ' ') + (at + 80 < text.length ? '…' : '');
}

type Handler = (...args: never[]) => unknown;

function plain(value: unknown) {
	try {
		return structuredClone(value);
	} catch {
		return JSON.parse(JSON.stringify(value ?? null));
	}
}

const commands: Record<string, Handler> = {
	app_info: () => ({ version: '0.1.0', description: 'Coding agents, side by side', author: 'Helge Sverre', repository: 'https://github.com/HelgeSverre/splash', license: 'MIT', host_os: 'macos', host_arch: 'aarch64', home_dir: world.HOME, shell: '/bin/zsh' }),
	// The GitHub inbox was last read half an hour ago, so the newest activity shows as unread.
	get_settings: () => ({ notify: 'off', 'github.demo.inbox': JSON.stringify({ baseline: new Date(Date.now() - 30 * 60_000).toISOString(), marks: {} }) }),
	set_setting: () => null,
	list_projects: () => world.projects(),
	list_sessions: () => sessions,
	list_agents: () => world.agents(),
	probe_agent: (id: string) => world.agents().find((a) => a.id === id),
	frontend_ready: () => null,

	open_session: (id: string) => log(id),
	session_transcript: (id: string) => log(id),
	session_git: (id: string) => {
		const s = find(id);
		return { repo: 'github.com/demo/atlas', web_url: 'https://github.com/demo/atlas', branch: s?.branch ?? null, branch_url: null, pr: id === 'cache-isolation' ? { number: 128, url: 'https://github.com/demo/atlas/pull/128', state: 'OPEN', title: 'Include the agent in cache keys' } : null };
	},
	session_history_capabilities: (id: string) => find(id)?.meta.history_capabilities ?? {},
	workspace_status: (id: string) => changes(id),
	watch_workspace: () => null,
	list_dir: (_id: string, path: string) => listDir(path),
	read_file: (id: string, path: string) => {
		const text = changed[id]?.[path]?.new ?? world.FILES[path] ?? `// ${path}\n`;
		return { path, text, binary: false, too_large: false, size: text.length };
	},
	file_diff: (id: string, path: string) => {
		const f = changed[id]?.[path];
		return { path, old: f?.old ?? null, new: f?.new ?? world.FILES[path] ?? null, binary: false, too_large: false };
	},
	rpc_log: (id: string) => rpc[id] ?? [],
	watch_rpc: () => null,

	send_prompt: (id: string, text: string) => guard(reply(id, runner(id), text)),
	cancel: (id: string) => {
		stop(id);
		push(id, { kind: 'turn_end', stop_reason: 'cancelled', duration_ms: 0 });
		patch(id, { status: 'idle' });
		return null;
	},
	resolve_permission: (id: string, request_id: string, option: string | null) => {
		const l = log(id);
		const index = l.entries.findIndex((e) => e.kind === 'permission' && e.request_id === request_id);
		if (index === -1) return null;
		put(id, index, { ...(l.entries[index] as Extract<Entry, { kind: 'permission' }>), resolution: option ?? 'cancelled' });
		patch(id, { status: 'running', attention: null });
		if (waiting[request_id]) {
			waiting[request_id](option);
			delete waiting[request_id];
		} else if (request_id === 'migrate-1') guard(migration(id, runner(id), option));
		return null;
	},
	set_option: (id: string, option: string, value: string) => {
		const s = find(id);
		const o = s?.meta.options.find((x) => x.id === option);
		if (o) o.current = value;
		if (s) emit('session', s);
		return null;
	},
	restart_session: (id: string) => {
		patch(id, { status: 'starting', detail: null });
		setTimeout(() => {
			push(id, { kind: 'divider', text: 'Session resumed' });
			patch(id, { status: 'idle', attention: null });
		}, 700);
		return null;
	},
	acknowledge_session: (id: string) => (patch(id, { attention: null }), null),
	rename_session: (id: string, title: string) => (patch(id, { title, title_override: true }), null),
	archive_session: (id: string) => (patch(id, { archived: true, attention: null }), null),
	disconnect_session: (id: string) => (patch(id, { status: 'exited' }), null),
	delete_session: (id: string) => {
		sessions = sessions.filter((s) => s.id !== id);
		return null;
	},
	create_session: (project_id: string, agent_id: string, isolation: SessionView['isolation'], title: string | null) => {
		const base = world.sessions()[0];
		const id = `demo-${Date.now().toString(36)}`;
		const s: SessionView = { ...base, id, project_id, agent_id, isolation, title: title || 'New session', branch: isolation === 'worktree' ? `splash/${id}` : 'main', status: 'idle', attention: null, usage: null, created_at: now(), updated_at: now(), agent_session_id: `${agent_id}-${id}`, meta: { ...base.meta, options: [], usage: null } };
		sessions.unshift(s);
		logs[id] = { entries: [], versions: [] };
		return s;
	},
	fork_session: (id: string) => {
		const parent = find(id)!;
		const child: SessionView = { ...structuredClone(parent), id: `${id}-fork`, title: `${parent.title} (fork)`, parent_id: id, attention: null, created_at: now() };
		sessions.unshift(child);
		logs[child.id] = structuredClone(log(id));
		emit('session', child);
		return child;
	},
	search_sessions: (query: string) => {
		const q = query.trim().toLowerCase();
		if (!q) return [];
		return Object.entries(logs).flatMap(([session_id, l]) =>
			l.entries.flatMap((e, entry_index) => {
				const text = 'text' in e ? e.text : e.kind === 'tool' ? `${e.title}\n${e.output ?? ''}` : '';
				const at = text.toLowerCase().indexOf(q);
				return at === -1 ? [] : [{ session_id, entry_index, excerpt: excerpt(text, at) }];
			})
		);
	},

	list_skills: () => [
		{ name: 'release-checklist', description: 'Walk through the release steps for atlas: version bump, notes, tag, verify artifacts.', path: `${world.HOME}/.claude/skills/release-checklist`, source: '~/.claude/skills', agents: ['claude'], project: null, user_invocable: true, manual_only: false },
		{ name: 'cache-debugging', description: 'Inspect and clear the atlas asset cache safely.', path: `${world.ATLAS}/.agents/skills/cache-debugging`, source: '.agents/skills', agents: [], project: world.ATLAS, user_invocable: true, manual_only: true }
	],
	list_command_files: () => [
		{ agent: 'claude', name: 'review', path: `${world.HOME}/.claude/commands/review.md`, project: null },
		{ agent: 'claude', name: 'git:pr', path: `${world.HOME}/.claude/commands/git/pr.md`, project: null },
		{ agent: 'codex', name: 'changelog', path: `${world.ATLAS}/.codex/prompts/changelog.md`, project: world.ATLAS }
	],
	list_mcp_servers: () => ({
		servers: [
			{ agent: 'claude', name: 'github', transport: 'http', target: 'https://api.githubcopilot.com/mcp/', enabled: true, header_keys: ['Authorization'], env_keys: [], source: '~/.claude.json', project: null },
			{ agent: 'codex', name: 'docs', transport: 'stdio', target: 'npx -y docs-mcp', enabled: true, header_keys: [], env_keys: ['DOCS_ROOT'], source: '~/.codex/config.toml', project: null }
		],
		errors: []
	}),
	set_agent_args: (id: string, args: string) => ({ ...world.agents().find((a) => a.id === id), extra_args: args }),

	add_project: () => (demoOnly('Adding folders'), world.projects()[0]),
	remove_project: () => (demoOnly('Removing projects'), null),
	term_open: () => (demoOnly('The terminal'), null),

	...githubCommands,
	...historyCommands
};

export async function handle(command: string, args: unknown[]): Promise<unknown> {
	const handler = commands[command] as ((...a: unknown[]) => unknown) | undefined;
	if (!handler) {
		if (import.meta.env.DEV) console.debug(`[demo] unhandled command ${command}`, args);
		return null;
	}
	// A beat of latency, like a real round trip, and copies both ways so the UI
	// and the "backend" never share objects (arguments can be $state proxies).
	await new Promise((ok) => setTimeout(ok, 16));
	return structuredClone(handler(...args.map(plain)));
}

/** Put the world back the way it started (between page visits). */
export function resetWorld() {
	Object.keys(runs).forEach(stop);
	reset();
}
