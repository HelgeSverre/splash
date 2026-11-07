import { test } from "node:test";
import { strict as assert } from "node:assert";
import { ServerConnection, type ConnectionView, type ServerInfo } from "../src/lib/server-connection-model.ts";

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((done, fail) => { resolve = done; reject = fail; });
  return { promise, resolve, reject };
}

test("an auth event during reconciliation cannot be overwritten by online", async () => {
  const view: ConnectionView = { status: "connecting", name: "", error: "", recovered: 0, checking: false };
  const reconciliation = deferred<void>();
  const server: ServerInfo = { name: "Splash", instance: "one", token: "token" };
  const monitor = new ServerConnection(view, async () => server, () => reconciliation.promise, () => {});
  const checking = monitor.check();
  await new Promise<void>((done) => queueMicrotask(done));
  assert.equal(view.status, "syncing");
  monitor.auth();
  reconciliation.resolve();
  await checking;
  assert.equal(view.status, "auth");
  assert.equal(view.recovered, 0);
  assert.equal(view.checking, false);
});

test("an auth event also wins if the outstanding check fails", async () => {
  const view: ConnectionView = { status: "connecting", name: "", error: "", recovered: 0, checking: false };
  const state = deferred<ServerInfo>();
  const monitor = new ServerConnection(view, () => state.promise, async () => {}, () => {});
  const checking = monitor.check();
  monitor.auth();
  state.reject(new Error("offline"));
  await checking;
  assert.equal(view.status, "auth");
  assert.equal(view.error, "");
});

test("checks never retry after authentication has failed", async () => {
  const view: ConnectionView = { status: "connecting", name: "", error: "", recovered: 0, checking: false };
  let checks = 0;
  const monitor = new ServerConnection(view, async () => { checks++; throw new Error("offline"); }, async () => {}, () => {});
  monitor.auth();
  assert.equal(await monitor.check(), false);
  assert.equal(checks, 0);
  assert.equal(view.status, "auth");
});
