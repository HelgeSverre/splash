/**
 * Owns one browser's cached agent-history searches. A state object is also
 * its request identity: deleting it makes every request that started for it
 * stale, even if a replacement reuses the same version number.
 */
export type DiscoveryMode = "initial" | "next" | "refresh";

export type HistoryPage<T> = {
  sessions: T[];
  next_cursor: string | null;
};

export type HistorySource<T, Page extends HistoryPage<T>> = {
  agentId: string;
  cwd: string;
  page: Page | null;
  sessions: T[];
  loading: boolean;
  error: string;
  fetchedAt: number | null;
  version: number;
  cursors: string[];
  retryMode: DiscoveryMode;
};

type Discover<Page> = (agentId: string, cwd: string, cursor: string | null) => Promise<Page>;

/** Keeps stale discovery replies from changing a replacement search. */
export class HistorySources<T extends { session_id: string }, Page extends HistoryPage<T>> {
  private readonly sources: Record<string, HistorySource<T, Page>>;
  private readonly discover: Discover<Page>;
  private readonly message: (error: unknown) => string;

  constructor(
    sources: Record<string, HistorySource<T, Page>>,
    discover: Discover<Page>,
    message: (error: unknown) => string,
  ) {
    this.sources = sources;
    this.discover = discover;
    this.message = message;
  }

  async load(key: string, agentId: string, cwd: string, mode: DiscoveryMode = "initial") {
    let source = this.sources[key];
    if (source?.loading || (source?.page && mode === "initial")) return;
    if (!source) {
      source = { agentId, cwd, page: null, sessions: [], loading: false, error: "", fetchedAt: null, version: 0, cursors: [], retryMode: "initial" };
      this.sources[key] = source;
      // Svelte `$state` wraps assigned objects. The wrapped value is the
      // authoritative identity used to reject an old request after deletion.
      source = this.sources[key];
    }
    const cursor = mode === "next" ? source.page?.next_cursor : null;
    if (mode === "next" && !cursor) return;

    const version = ++source.version;
    source.loading = true;
    source.error = "";
    try {
      const page = await this.discover(agentId, cwd, cursor ?? null);
      if (!this.current(key, source, version)) return;
      const rows = new Map((mode === "next" ? source.sessions : []).map((session) => [session.session_id, session]));
      for (const session of page.sessions) rows.set(session.session_id, session);
      source.sessions = [...rows.values()];
      source.cursors = mode === "next" ? [...source.cursors, cursor!] : [];
      if (page.next_cursor && source.cursors.includes(page.next_cursor)) {
        page.next_cursor = null;
        source.error = "The agent repeated a page cursor. Refresh its list to retry.";
        source.retryMode = "refresh";
      }
      source.page = page;
      source.fetchedAt = Date.now();
      if (!source.error) source.retryMode = "initial";
    } catch (error) {
      if (this.current(key, source, version)) {
        source.error = this.message(error);
        source.retryMode = mode;
      }
    } finally {
      if (this.current(key, source, version)) source.loading = false;
    }
  }

  retry(key: string) {
    const source = this.sources[key];
    return source && this.load(key, source.agentId, source.cwd, source.retryMode === "next" ? "next" : "refresh");
  }

  invalidate(agentId: string) {
    for (const [key, source] of Object.entries(this.sources)) {
      if (source.agentId !== agentId) continue;
      source.version++;
      delete this.sources[key];
    }
  }

  private current(key: string, source: HistorySource<T, Page>, version: number) {
    return this.sources[key] === source && source.version === version;
  }
}
