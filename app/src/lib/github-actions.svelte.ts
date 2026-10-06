import { api, type ActionsFilters, type ActionsRun, type ActionsWorkflow } from "../bindings";
import { errorMessage } from "./format";
import { prefs } from "./prefs.svelte";
import { github } from "./github.svelte";

export function repositorySelection(): string[] | null {
  try { const value: unknown = JSON.parse(prefs["github.repositories"] ?? "null"); return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : null; } catch { return null; }
}
export function scopedRepositories() {
  const names = repositorySelection(), owner = prefs["github.owner"] ?? "", linked = prefs["github.linked"] === "true";
  return (github.catalog?.repositories ?? []).filter(r => (!owner || r.owner === owner) && (!linked || r.project_ids.length) && (names === null || names.includes(r.full_name)));
}
type Page = { runs: ActionsRun[]; workflows: ActionsWorkflow[]; next: number | null; loaded: boolean; error: string; synced: number };
export const actions = $state({ pages: {} as Record<string, Page>, signature: "", loading: false, completed: 0, total: 0, paused: false });
let generation = 0;
export function stopActions() { generation++; actions.loading = false; actions.paused = true; }
export async function loadActions(repositories: string[], tab: string, filters: ActionsFilters, signature: string, mode: "initial" | "refresh" | "more" = "initial") {
  const run = ++generation;
  if (signature !== actions.signature) { actions.pages = {}; actions.signature = signature; }
  const queue = repositories.filter(name => mode === "refresh" || (mode === "more" ? !!actions.pages[name]?.next : !actions.pages[name]?.loaded || !!actions.pages[name]?.error));
  actions.loading = queue.length > 0; actions.paused = false; actions.completed = 0; actions.total = queue.length;
  let index = 0;
  await Promise.all(Array.from({ length: Math.min(3,queue.length) }, async () => {
    while (run === generation && index < queue.length) {
      const repository = queue[index++], previous = actions.pages[repository], page = mode === "more" ? previous?.next ?? 1 : 1;
      try {
        let runs: ActionsRun[] = [], workflows: ActionsWorkflow[] = [], next: number | null;
        if (tab === "runs") { const result = await api.github_actions_runs(repository, filters, page); runs = result.runs; next = result.next_page; }
        else { const result = await api.github_actions_workflows(repository, page); workflows = result.workflows; next = result.next_page; }
        if (run !== generation) return;
        if (mode === "more") { runs = [...(previous?.runs ?? []), ...runs]; workflows = [...(previous?.workflows ?? []), ...workflows]; }
        actions.pages[repository] = { runs: [...new Map(runs.map(r=>[r.id,r])).values()], workflows:[...new Map(workflows.map(w=>[w.id,w])).values()], next, loaded:true, error:"", synced:Date.now() };
      } catch(e) {
        if (run !== generation) return;
        const error = errorMessage(e);
        actions.pages[repository] = { runs:previous?.runs ?? [],workflows:previous?.workflows ?? [],next:previous?.next ?? null,loaded:previous?.loaded ?? false,synced:previous?.synced ?? 0,error };
        if (/rate limit|abuse|authenticate|authentication|gh auth login/i.test(error)) { actions.paused = true; index = queue.length; }
      } finally { if (run === generation) actions.completed++; }
    }
  }));
  if (run === generation) actions.loading = false;
}
