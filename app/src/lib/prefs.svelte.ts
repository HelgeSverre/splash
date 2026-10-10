// App settings (key → value), from the Rust side's settings table.
import { api } from "../bindings";
import { showError } from "./system";

export const prefs: Record<string, string> = $state({});

// Settings controls update immediately, but the backing store may be remote.
// Keep writes for each key in order and remember the last confirmed value, so
// a failed or out-of-order request cannot leave the control lying about what
// will survive the next launch.
const writes = new Map<string, Promise<void>>();
const confirmed = new Map<string, string | undefined>();
const intents = new Map<string, number>();
let nextIntent = 0;

/** State captured immediately before requesting a server preferences snapshot. */
export type PrefsSnapshotMarker = { watermark: number; pending: Set<string> };
export function prefsSnapshotMarker(): PrefsSnapshotMarker {
  return { watermark: nextIntent, pending: new Set(writes.keys()) };
}

/** Apply a server snapshot without replacing a newer local intent. */
export function applyPrefsSnapshot(snapshot: Record<string, string>, marker: PrefsSnapshotMarker) {
  for (const key of Object.keys(prefs)) {
    if (key in snapshot || writes.has(key) || marker.pending.has(key) || (intents.get(key) ?? 0) > marker.watermark) continue;
    delete prefs[key];
    confirmed.delete(key);
  }
  for (const [key, value] of Object.entries(snapshot)) {
    if (writes.has(key) || marker.pending.has(key) || (intents.get(key) ?? 0) > marker.watermark) continue;
    prefs[key] = value;
    confirmed.set(key, value);
  }
}

export async function setPref(key: string, value: string) {
  const intent = ++nextIntent;
  intents.set(key, intent);
  if (!confirmed.has(key)) confirmed.set(key, prefs[key]);
  prefs[key] = value;
  const previous = writes.get(key) ?? Promise.resolve();
  const write = previous.then(async () => {
    try {
      await api.set_setting(key, value);
      confirmed.set(key, value);
    } catch (e) {
      // A newer interaction owns the visible value, even if it picked the
      // same value again after changing its mind (A → B → A).
      if (intents.get(key) !== intent) return;
      const saved = confirmed.get(key);
      if (saved === undefined) delete prefs[key];
      else prefs[key] = saved;
      showError(e);
    }
  });
  writes.set(key, write);
  void write.finally(() => { if (writes.get(key) === write) writes.delete(key); });
  await write;
}
