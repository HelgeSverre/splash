/** Pure inbox and scope rules, independent of the UI and storage bridge. */
export type Mark = { read?: string; unread?: boolean; snooze?: { revision: string; until: number | null } };
export function isUnread(updated: string, baseline: string, mark?: Mark): boolean {
  return !!mark?.unread || Date.parse(updated) > Date.parse(mark?.read ?? baseline);
}
export function isSnoozed(updated: string, now: number, mark?: Mark): boolean {
  const s = mark?.snooze;
  return !!s && Date.parse(updated) <= Date.parse(s.revision) && (s.until === null || s.until > now);
}
export function selectMatching(current: string[] | null, all: string[], matches: string[], selected: boolean): string[] {
  const names = new Set(matches);
  return selected ? [...new Set([...(current ?? all), ...names])] : (current ?? all).filter(n => !names.has(n));
}
