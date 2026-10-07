import { api, type ExternalSession, type HistoryPage } from "../bindings";
import { errorMessage } from "./format";

export type HistorySource = {
  agentId: string; cwd: string; page: HistoryPage | null; sessions: ExternalSession[];
  loading: boolean; error: string; fetchedAt: number | null; version: number; cursors: string[];
  /** The failed request was a next page: Retry asks for that page again. */
  retryMore: boolean;
};
// In-memory only: opaque cursors are never persisted between app launches.
export const historySources: Record<string, HistorySource> = $state({});
export const sourceKey = (id: string, args: string, cwd: string) => JSON.stringify([id, args, cwd]);

export async function loadSource(key: string, agentId: string, cwd: string, more = false, refresh = false) {
  let source = historySources[key];
  if (source?.loading || (source?.page && !more && !refresh)) return;
  if (!source) {
    historySources[key] = { agentId, cwd, page: null, sessions: [], loading: false, error: "", fetchedAt: null, version: 0, cursors: [], retryMore: false };
    source = historySources[key];
  }
  const cursor = more ? source.page?.next_cursor : null;
  if (more && !cursor) return;
  const version = ++source.version;
  source.loading = true; source.error = "";
  try {
    const page = await api.discover_sessions(agentId, cwd, cursor ?? null);
    if (historySources[key]?.version !== version) return;
    const rows = new Map((more ? source.sessions : []).map((s) => [s.session_id, s]));
    for (const session of page.sessions) rows.set(session.session_id, session);
    source.sessions = [...rows.values()];
    source.cursors = more ? [...source.cursors, cursor!] : [];
    if (page.next_cursor && source.cursors.includes(page.next_cursor)) {
      page.next_cursor = null;
      source.error = "The agent repeated a page cursor. Refresh its list to retry.";
      source.retryMore = false;
    }
    source.page = page;
    source.fetchedAt = Date.now();
  } catch (e) {
    if (historySources[key]?.version === version) { source.error = errorMessage(e); source.retryMore = more; }
  }
  finally { if (historySources[key]?.version === version) source.loading = false; }
}
/** Repeat the request that failed: the next page, or the first page again. */
export function retrySource(key: string) {
  const source = historySources[key];
  if (source) return loadSource(key, source.agentId, source.cwd, source.retryMore, true);
}
export function invalidateHistory(agentId: string) {
  for (const [key, source] of Object.entries(historySources)) {
    if (source.agentId === agentId) { source.version++; delete historySources[key]; }
  }
}
