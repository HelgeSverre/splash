// Each open session's transcript, mirrored from Rust: loaded in full when the
// session opens, then kept current from the transcript channel's versioned
// changes (lib/live subscribes `applyTranscript`).
import { api, type Entry, type TranscriptEvent } from "../bindings";
import { showError } from "./system";

export type Transcript = {
  entries: Entry[];
  versions: number[];
  loading: boolean;
  // Changes that arrive while a full snapshot is in flight must be replayed
  // after it, otherwise the snapshot can erase the tail of a live response.
  syncing: boolean;
  queued: TranscriptEvent[];
  revision: number;
  resyncing: boolean;
  needsResync: boolean;
  retryTimer: ReturnType<typeof setTimeout> | undefined;
  retryDelay: number;
  resyncErrorReported: boolean;
};

export const transcripts: Record<string, Transcript> = $state({});

export type PermissionEntry = Extract<Entry, { kind: "permission" }>;

/** The permission the agent is waiting on, if any. */
export const pendingPermission = (entries: Entry[]) =>
  entries.findLast((e): e is PermissionEntry => e.kind === "permission" && !e.resolution);

const transcript = (loading: boolean): Transcript => ({
  entries: [], versions: [], loading, syncing: false, queued: [], revision: 0, resyncing: false, needsResync: false,
  retryTimer: undefined, retryDelay: 0, resyncErrorReported: false,
});

/** Load a session's transcript in full (it shows as loading until then). */
export async function openTranscript(id: string) {
  if (!transcripts[id]) transcripts[id] = transcript(true);
  const t = transcripts[id];
  if (t.syncing) return;
  t.syncing = true;
  if (t.retryTimer) clearTimeout(t.retryTimer);
  t.retryTimer = undefined;
  // Discard any older gap-recovery response while this authoritative load runs.
  t.revision++;
  try {
    const snap = await api.open_session(id);
    if (transcripts[id] !== t) return;
    t.entries = snap.entries;
    t.versions = snap.versions;
    t.loading = false;
    t.needsResync = false;
    t.retryDelay = 0;
    t.resyncErrorReported = false;
  } catch (e) {
    if (transcripts[id] !== t) return;
    t.loading = false;
    showError(e);
  } finally {
    if (transcripts[id] !== t) return;
    t.syncing = false;
    const queued = t.queued;
    t.queued = [];
    for (const ev of queued) applyEvent(t, ev);
    if (t.needsResync) void resync(id, t);
  }
}

/** A brand-new session's transcript: empty, nothing to load. */
export function newTranscript(id: string) {
  transcripts[id] = transcript(false);
}

export function dropTranscript(id: string) {
  const t = transcripts[id];
  if (t?.retryTimer) clearTimeout(t.retryTimer);
  delete transcripts[id];
}

export function applyTranscript(ev: TranscriptEvent | undefined) {
  if (!ev) return;
  const t = transcripts[ev.session];
  if (!t) return; // not open — it loads in full when opened
  if (t.syncing) {
    t.queued.push(ev);
    return;
  }
  applyEvent(t, ev);
}

function applyEvent(t: Transcript, ev: TranscriptEvent) {
  if (ev.reset) {
    t.entries = ev.reset.entries;
    t.versions = ev.reset.versions;
    t.loading = false;
    t.needsResync = false;
    t.revision++;
    return;
  }
  let changed = false;
  for (const c of ev.changes) {
    const local = t.versions[c.index] ?? 0;
    if (c.op === "upsert") {
      if (c.version <= local) continue; // already have it (or the channel replayed it)
      while (t.entries.length < c.index) {
        t.entries.push({ kind: "divider", text: "" });
        t.versions.push(0);
      }
      t.entries[c.index] = c.entry;
      t.versions[c.index] = c.version;
      changed = true;
    } else {
      if (c.version <= local) continue;
      const e = t.entries[c.index];
      if (c.version !== local + 1 || !e || (e.kind !== "agent" && e.kind !== "thought")) {
        t.needsResync = true;
        t.revision++;
        resync(ev.session, t);
        return;
      }
      e.text += c.delta;
      t.versions[c.index] = c.version;
      changed = true;
    }
  }
  if (changed) t.revision++;
}

async function resync(id: string, t = transcripts[id]) {
  if (!t || !t.needsResync || t.resyncing || t.syncing) return;
  t.resyncing = true;
  const revision = t.revision;
  try {
    const snap = await api.session_transcript(id);
    // Events or a newer full load arrived while this request was pending.
    // Its snapshot could be older, so let the next recovery request replace it.
    if (transcripts[id] !== t || t.revision !== revision) return;
    t.entries = snap.entries;
    t.versions = snap.versions;
    t.needsResync = false;
    if (t.retryTimer) clearTimeout(t.retryTimer);
    t.retryTimer = undefined;
    t.retryDelay = 0;
    t.resyncErrorReported = false;
  } catch (e) {
    if (transcripts[id] === t) {
      if (!t.resyncErrorReported) showError(e);
      t.resyncErrorReported = true;
    }
  } finally {
    if (transcripts[id] !== t) return;
    t.resyncing = false;
    if (t.needsResync) {
      if (t.resyncErrorReported) retryResync(id, t);
      else void resync(id, t);
    }
  }
}

function retryResync(id: string, t: Transcript) {
  if (t.retryTimer) return;
  t.retryDelay = Math.min(t.retryDelay ? t.retryDelay * 2 : 250, 2_000);
  t.retryTimer = setTimeout(() => {
    t.retryTimer = undefined;
    void resync(id, t);
  }, t.retryDelay);
}
