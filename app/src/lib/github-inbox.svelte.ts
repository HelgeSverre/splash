import { api, type GithubItem, type GithubSearch } from "../bindings";
import { prefs } from "./prefs.svelte";
import { github, itemKey, sourceKey, type Source, type PageState } from "./github.svelte";
import { showError } from "./system";
import { errorMessage } from "./format";

import { isUnread, isSnoozed, type Mark } from "./github-model";
export type Inbox = { baseline: string; marks: Record<string, Mark> };
export function parse<T>(raw: string | undefined, fallback: T): T { try { return raw ? JSON.parse(raw) ?? fallback : fallback; } catch { return fallback; } }
export const accountKey = (key: string) => `github.${github.catalog?.login.toLowerCase() ?? "unknown"}.${key}`;
// Serialize writes so rapid inbox actions cannot overwrite a newer setting on disk.
const writes = new Map<string, Promise<void>>();
export function persist(key: string, value: unknown) {
  const encoded = JSON.stringify(value); prefs[key] = encoded;
  const write = (writes.get(key) ?? Promise.resolve()).then(async () => { await api.set_setting(key, encoded); }).catch(showError);
  writes.set(key, write); void write.finally(() => { if (writes.get(key) === write) writes.delete(key); });
}
const fallback: Inbox = { baseline: new Date().toISOString(), marks: {} };
export function inbox(): Inbox { return parse(prefs[accountKey("inbox")], fallback); }
export function initializeInbox() { if (github.catalog && !prefs[accountKey("inbox")]) persist(accountKey("inbox"), { baseline: new Date().toISOString(), marks: {} }); }
export function unread(item: GithubItem) { const state = inbox(), mark = state.marks[itemKey(item)]; return isUnread(item.updated_at, state.baseline, mark); }
export function snoozed(item: GithubItem, now: number) { return isSnoozed(item.updated_at, now, inbox().marks[itemKey(item)]); }
export function markRead(items: GithubItem[], read = true) {
  const state = inbox(); for (const item of items) state.marks[itemKey(item)] = { ...state.marks[itemKey(item)], read: item.updated_at, unread: !read }; persist(accountKey("inbox"), state);
}
export function snooze(item: GithubItem, mode: "tomorrow" | "activity" | "wake") {
  const state = inbox(), key = itemKey(item), tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); tomorrow.setHours(9,0,0,0);
  state.marks[key] = { ...state.marks[key], snooze: mode === "wake" ? undefined : { revision: item.updated_at, until: mode === "activity" ? null : tomorrow.getTime() } }; persist(accountKey("inbox"), state);
}
export const search = $state({ pages: {} as Record<string, PageState>, loading: false, completed: 0, total: 0, signature: "", paused: false });
let generation = 0;
export function stopSearch(clear = false) { generation++; search.loading = false; search.paused = true; if (clear) { search.pages = {}; search.signature = ""; } }
export async function searchGithub(sources: Source[], filters: GithubSearch, signature: string, older = false) {
  const run = ++generation;
  if (signature !== search.signature) search.pages = {};
  search.signature = signature; search.loading = true; search.paused = false; search.completed = 0;
  const queue = sources.filter(s => older ? !!search.pages[sourceKey(s)]?.next_cursor : !search.pages[sourceKey(s)]?.loaded || !!search.pages[sourceKey(s)]?.error);
  search.total = queue.length; let index = 0;
  await Promise.all(Array.from({ length: Math.min(2, queue.length) }, async () => {
    while (run === generation && index < queue.length) {
      const source = queue[index++], key = sourceKey(source), previous = search.pages[key];
      try {
        const page = await api.github_search(source.repository.split(","), source.kind, filters, older ? previous?.next_cursor ?? null : null);
        if (run !== generation) return;
        const items = older ? [...(previous?.items ?? []), ...page.items] : page.items;
        search.pages[key] = { ...page, items: [...new Map(items.map(i => [itemKey(i), i])).values()], loaded: true, error: "", syncedAt: Date.now() };
      } catch (e) {
        if (run !== generation) return;
        const error = errorMessage(e);
        search.pages[key] = { items: previous?.items ?? [], next_cursor: previous?.next_cursor ?? null, loaded: previous?.loaded ?? false, error, syncedAt: previous?.syncedAt ?? 0 };
        if (/rate limit|abuse|authenticate|authentication|gh auth login/i.test(error)) { search.paused = true; index = queue.length; }
      } finally { if (run === generation) search.completed++; }
    }
  }));
  if (run === generation) search.loading = false;
}
