import { api, type ExternalSession, type HistoryPage } from "../bindings";
import { errorMessage } from "./format";
import { HistorySources, type HistorySource } from "./agent-history-model";

// In-memory only: opaque cursors are never persisted between app launches.
const sources: Record<string, HistorySource<ExternalSession, HistoryPage>> = $state({});
const keyFor = (id: string, args: string, cwd: string) => JSON.stringify([id, args, cwd]);
const history = new HistorySources(sources, api.discover_sessions, errorMessage);

/** Agent-history cache and request ordering behind one interface. */
export const agentHistory = {
  state(agentId: string, args: string, cwd: string) {
    return sources[keyFor(agentId, args, cwd)];
  },
  load(agentId: string, args: string, cwd: string) {
    return history.load(keyFor(agentId, args, cwd), agentId, cwd);
  },
  refresh(agentId: string, args: string, cwd: string) {
    return history.load(keyFor(agentId, args, cwd), agentId, cwd, "refresh");
  },
  loadMore(agentId: string, args: string, cwd: string) {
    return history.load(keyFor(agentId, args, cwd), agentId, cwd, "next");
  },
  retry(agentId: string, args: string, cwd: string) {
    return history.retry(keyFor(agentId, args, cwd));
  },
  invalidate(agentId: string) {
    history.invalidate(agentId);
  },
};
