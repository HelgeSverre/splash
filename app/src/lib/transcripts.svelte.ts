// Each open session's transcript, mirrored from Rust: loaded in full when the
// session opens, then kept current from the transcript channel's versioned
// changes (lib/live subscribes `applyTranscript`).
import { api, type Entry, type TranscriptEvent } from "../bindings";
import { showError } from "./system";

export type Transcript = { entries: Entry[]; versions: number[]; loading: boolean };

export const transcripts: Record<string, Transcript> = $state({});

export type PermissionEntry = Extract<Entry, { kind: "permission" }>;

/** The permission the agent is waiting on, if any. */
export const pendingPermission = (entries: Entry[]) =>
  entries.findLast((e): e is PermissionEntry => e.kind === "permission" && !e.resolution);

/** Load a session's transcript in full (it shows as loading until then). */
export async function openTranscript(id: string) {
  if (!transcripts[id]) transcripts[id] = { entries: [], versions: [], loading: true };
  try {
    const snap = await api.open_session(id);
    transcripts[id] = { entries: snap.entries, versions: snap.versions, loading: false };
  } catch (e) {
    transcripts[id].loading = false;
    showError(e);
  }
}

/** A brand-new session's transcript: empty, nothing to load. */
export function newTranscript(id: string) {
  transcripts[id] = { entries: [], versions: [], loading: false };
}

export function dropTranscript(id: string) {
  delete transcripts[id];
}

export function applyTranscript(ev: TranscriptEvent | undefined) {
  if (!ev) return;
  const t = transcripts[ev.session];
  if (ev.reset && t) { t.entries = ev.reset.entries; t.versions = ev.reset.versions; t.loading = false; return; }
  if (!t || t.loading) return; // not open — it loads in full when opened
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
    } else {
      if (c.version <= local) continue;
      const e = t.entries[c.index];
      if (c.version !== local + 1 || !e || (e.kind !== "agent" && e.kind !== "thought")) {
        resync(ev.session);
        return;
      }
      e.text += c.delta;
      t.versions[c.index] = c.version;
    }
  }
}

async function resync(id: string) {
  const t = transcripts[id];
  if (!t) return;
  const snap = await api.session_transcript(id);
  t.entries = snap.entries;
  t.versions = snap.versions;
}
