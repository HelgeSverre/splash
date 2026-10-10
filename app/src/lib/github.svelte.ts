import { api, type GithubCatalog, type GithubItem, type GithubKind, type GithubPage } from "../bindings";
import { errorMessage } from "./format";

export type Feed = "all" | "needs_me" | GithubKind;
export type Source = { repository: string; kind: GithubKind };
export type PageState = GithubPage & { loaded: boolean; error: string; syncedAt: number };
export const github = $state({
  catalog: null as GithubCatalog | null,
  catalogLoading: false,
  catalogError: "",
  pages: {} as Record<string, PageState>,
  loading: false,
  completed: 0,
  total: 0,
  paused: false,
  selected: "",
  created: [] as GithubItem[],
  issueOpen: false,
  draft: { repository: "", title: "", body: "" },
});
let generation = 0;
let catalogRequest: Promise<void> | null = null;
export const sourceKey = (source: Source) => `${source.repository}:${source.kind}`;
export const itemKey = (item: GithubItem) => `${item.repository}:${item.id}`;
export const kindsFor = (feed: Feed): GithubKind[] => feed === "all" ? ["issue", "pull_request", "branch", "activity"] : feed === "needs_me" ? ["issue", "pull_request"] : [feed];
/** Stop the current batch when GitHub rejects requests globally. */
export const isGithubAccessFailure = (error: string) => /rate limit|abuse|authenticate|authentication|gh auth login|bad credentials|http 401/i.test(error);
export const canCreateIssue = () => !!github.catalog?.repositories.some(repository => repository.has_issues && !repository.archived);

export async function loadCatalog(refresh = false) {
  if (catalogRequest) return catalogRequest;
  if (github.catalog && !refresh) return;
  github.catalogLoading = true;
  github.catalogError = "";
  catalogRequest = (async () => {
    try {
      const catalog = await api.github_catalog();
      if (github.catalog && github.catalog.login !== catalog.login) {
        stopLoading();
        github.pages = {};
        github.selected = "";
        github.created = [];
      }
      github.catalog = catalog;
    } catch (e) { github.catalogError = errorMessage(e); }
    finally { github.catalogLoading = false; catalogRequest = null; }
  })();
  return catalogRequest;
}

/** Bound the queue, retain cached pages across navigation, and discard stale responses. */
export async function loadSources(sources: Source[], mode: "initial" | "refresh" | "older" = "initial") {
  const run = ++generation;
  const queue = sources.filter(s => {
    const p = github.pages[sourceKey(s)];
    return mode === "refresh" || (mode === "older" ? !!p?.next_cursor : !p?.loaded);
  });
  github.loading = queue.length > 0;
  github.paused = false;
  github.completed = 0;
  github.total = queue.length;
  let index = 0;
  await Promise.all(Array.from({ length: Math.min(4, queue.length) }, async () => {
    while (run === generation && index < queue.length) {
      const source = queue[index++], key = sourceKey(source), previous = github.pages[key];
      try {
        const result = await api.github_page(source.repository, source.kind, mode === "older" ? previous?.next_cursor ?? null : null);
        if (run !== generation) return;
        const returnedIds = new Set(result.items.map(i => i.id));
        github.created = github.created.filter(i => i.repository !== source.repository || !returnedIds.has(i.id));
        const items = mode === "older" ? [...(previous?.items ?? []), ...result.items] : result.items;
        github.pages[key] = { ...result, items: [...new Map(items.map(i => [i.id, i])).values()], loaded: true, error: "", syncedAt: Date.now() };
      } catch (e) {
        if (run !== generation) return;
        const error = errorMessage(e);
        github.pages[key] = { items: previous?.items ?? [], next_cursor: previous?.next_cursor ?? null, loaded: previous?.loaded ?? false, syncedAt: previous?.syncedAt ?? 0, error };
        // Don't hammer the remaining repositories after GitHub asks us to stop.
        if (isGithubAccessFailure(error)) { github.paused = true; index = queue.length; }
      } finally { if (run === generation) github.completed++; }
    }
  }));
  if (run === generation) github.loading = false;
}

export function stopLoading() { generation++; github.loading = false; github.paused = true; }
export function newIssue(repository = "") {
  if (!canCreateIssue()) return;
  if (!github.draft.title && !github.draft.body) github.draft.repository = repository;
  github.issueOpen = true;
}
export function rememberIssue(item: GithubItem) {
  github.created = [...github.created.filter(i => i.id !== item.id), item];
  const key = sourceKey({ repository: item.repository, kind: "issue" }), page = github.pages[key];
  github.pages[key] = { items: [item, ...(page?.items ?? []).filter(i => i.id !== item.id)], next_cursor: page?.next_cursor ?? null, loaded: page?.loaded ?? false, error: page?.error ?? "", syncedAt: page?.syncedAt ?? 0 };
  github.selected = itemKey(item);
}

export function needsMe(item: GithubItem, login: string) {
  if (!["OPEN", "DRAFT"].includes(item.state) || !login) return false;
  const same = (value: string) => value.toLowerCase() === login.toLowerCase();
  return item.assignees.some(same) || item.reviewers.some(same) ||
    (same(item.author) && (item.review_decision === "CHANGES_REQUESTED" || ["FAILURE", "ERROR"].includes(item.checks ?? "")));
}
export const itemIcon = (kind: GithubKind) => ({ issue: "circle-dot", pull_request: "pull-request", branch: "branch", activity: "activity" })[kind];
export function itemStatus(item: GithubItem) {
  if (item.state === "MERGED") return "Merged";
  if (item.state === "CLOSED") return "Closed";
  if (item.state === "DRAFT") return "Draft";
  if (["FAILURE", "ERROR"].includes(item.checks ?? "")) return "Checks failing";
  if (item.review_decision === "CHANGES_REQUESTED") return "Changes requested";
  if (item.reviewers.length) return "Review requested";
  if (item.review_decision === "APPROVED") return "Approved";
  return item.state === "OPEN" ? "Open" : item.state;
}
export function ago(date: string) {
  const seconds = (Date.now() - Date.parse(date)) / 1000;
  if (!Number.isFinite(seconds)) return "";
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 86400 * 30) return `${Math.floor(seconds / 86400)}d`;
  return new Date(date).toLocaleDateString();
}
