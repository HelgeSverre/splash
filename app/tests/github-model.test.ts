import { test } from "node:test";
import { strict as assert } from "node:assert";
import { isUnread, isSnoozed, selectMatching } from "../src/lib/github-model.ts";

test("clear, search, select matches preserves only the matching repos", () => {
  const all = ["a/sema", "b/semaphore", "a/other"];
  const matches = all.filter(n => n.includes("sema"));
  assert.deepEqual(selectMatching([], all, matches, true), matches);
  assert.deepEqual(selectMatching(["a/other", "a/sema"], all, matches, true), ["a/other", ...matches]);
  assert.deepEqual(selectMatching(null, all, matches, false), ["a/other"]);
  assert.deepEqual(selectMatching([], all, [], true), []);
});
test("read revisions survive refresh but new activity becomes unread", () => {
  const old = "2026-01-01T00:00:00Z", fresh = "2026-01-02T00:00:00Z";
  assert.equal(isUnread(old, fresh), false);
  assert.equal(isUnread(fresh, old), true);
  assert.equal(isUnread(fresh, old, { read: fresh }), false);
  assert.equal(isUnread(fresh, old, { read: old }), true);
  assert.equal(isUnread(old, fresh, { unread: true }), true);
  assert.equal(isUnread(old, "2026-01-01T00:00:00.100Z"), false);
});
test("snooze wakes at deadline or when activity changes", () => {
  const old = "2026-01-01T00:00:00Z", fresh = "2026-01-02T00:00:00Z";
  const timed = { snooze: { revision: old, until: 1000 } };
  assert.equal(isSnoozed(old, 999, timed), true);
  assert.equal(isSnoozed(old, 1000, timed), false);
  assert.equal(isSnoozed(fresh, 999, timed), false);
  assert.equal(isSnoozed(old, 100000, { snooze: { revision: old, until: null } }), true);
  assert.equal(isSnoozed(fresh, 100000, { snooze: { revision: old, until: null } }), false);
});
