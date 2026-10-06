import { test } from "node:test";
import { strict as assert } from "node:assert";
import { sourceIsNewer, foldersFromText } from "../src/lib/session-history.ts";

test("native activity uses parsed timestamps and preserves unknown dates", () => {
  assert.equal(sourceIsNewer(undefined), false);
  assert.equal(sourceIsNewer({ updated_at: "bad" }), false);
  assert.equal(sourceIsNewer({ updated_at: "2026-10-06T12:00:00+02:00", synced_updated_at: "2026-10-06T10:00:00Z" }), false);
  assert.equal(sourceIsNewer({ updated_at: "2026-10-06T10:01:00Z", synced_updated_at: "2026-10-06T10:00:00Z" }), true);
  assert.equal(sourceIsNewer({ updated_at: "2026-10-05T10:00:00Z", last_synced_at: Date.parse("2026-10-06T10:00:00Z") / 1000 }), false);
});
test("workspace input keeps path spaces and stable root order", () => {
  assert.deepEqual(foldersFromText(" /work/shared library \n/work/api\n\n/work/shared library"), ["/work/shared library", "/work/api"]);
});
