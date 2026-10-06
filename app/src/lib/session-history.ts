import type { SessionSource } from "../bindings";

export function sourceIsNewer(source: SessionSource | undefined): boolean {
  if (!source?.updated_at) return false;
  const latest = Date.parse(source.updated_at);
  const synced = source.synced_updated_at ? Date.parse(source.synced_updated_at) : (source.last_synced_at ?? 0) * 1000;
  return Number.isFinite(latest) && Number.isFinite(synced) && latest > Math.max(synced, (source.last_local_activity_at ?? 0) * 1000);
}
export function foldersFromText(text: string): string[] {
  return [...new Set(text.split("\n").map((p) => p.trim()).filter(Boolean))];
}
