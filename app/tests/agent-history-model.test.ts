import { test } from "node:test";
import { strict as assert } from "node:assert";
import { HistorySources, type HistorySource } from "../src/lib/agent-history-model.ts";

type Session = { session_id: string; label: string };
type Page = { sessions: Session[]; next_cursor: string | null };

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => { resolve = done; });
  return { promise, resolve };
}

test("an invalidated discovery cannot strand its replacement in loading", async () => {
  const sources: Record<string, HistorySource<Session, Page>> = {};
  const first = deferred<Page>();
  const second = deferred<Page>();
  const requests = [first, second];
  const history = new HistorySources(sources, async () => requests.shift()!.promise, String);

  const old = history.load("fake", "agent", "/work");
  assert.equal(sources.fake.loading, true);
  history.invalidate("agent");
  const replacement = history.load("fake", "agent", "/work");
  assert.equal(sources.fake.loading, true);

  first.resolve({ sessions: [{ session_id: "old", label: "old" }], next_cursor: null });
  await old;
  assert.equal(sources.fake.loading, true);
  assert.deepEqual(sources.fake.sessions, []);

  second.resolve({ sessions: [{ session_id: "new", label: "new" }], next_cursor: null });
  await replacement;
  assert.equal(sources.fake.loading, false);
  assert.deepEqual(sources.fake.sessions, [{ session_id: "new", label: "new" }]);
});

test("a reactive backing store accepts its wrapped source and refreshes a repeated cursor", async () => {
  const raw: Record<string, HistorySource<Session, Page>> = {};
  const sources = new Proxy(raw, {
    set(target, key, value) {
      target[key as string] = new Proxy(value, {});
      return true;
    },
  });
  const pages = [
    { sessions: [{ session_id: "one", label: "one" }], next_cursor: "again" },
    { sessions: [{ session_id: "two", label: "two" }], next_cursor: "again" },
    { sessions: [{ session_id: "three", label: "three" }], next_cursor: null },
  ];
  const history = new HistorySources(sources, async () => pages.shift()!, String);

  await history.load("fake", "agent", "/work");
  assert.deepEqual(sources.fake.sessions, [{ session_id: "one", label: "one" }]);
  await history.load("fake", "agent", "/work", "next");
  assert.equal(sources.fake.error, "The agent repeated a page cursor. Refresh its list to retry.");
  await history.retry("fake");
  assert.deepEqual(sources.fake.sessions, [{ session_id: "three", label: "three" }]);
  assert.equal(sources.fake.loading, false);
});
