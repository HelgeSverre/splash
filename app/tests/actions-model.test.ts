import { test } from "node:test";
import { strict as assert } from "node:assert";
import { actionStatus, actionTone, duration, cleanLog } from "../src/lib/actions-model.ts";

test("queued and waiting are active; cancelled and skipped are not failures",()=> {
  assert.equal(actionTone("queued",null),"active");
  assert.equal(actionTone("waiting",null),"active");
  assert.equal(actionTone("completed","cancelled"),"neutral");
  assert.equal(actionTone("completed","skipped"),"neutral");
  assert.equal(actionTone("completed","timed_out"),"failed");
  assert.equal(actionStatus("completed","action_required"),"action required");
});
test("durations handle jobs that have not started and completed jobs",()=> {
  const start="2026-10-06T10:00:00Z", end="2026-10-06T10:02:05Z";
  assert.equal(duration(null,null,0),"Not started");
  assert.equal(duration(start,end,0),"2m 5s");
  assert.equal(duration(start,null,Date.parse(end)),"2m 5s");
  assert.equal(duration("bad",null,0),"Unavailable");
});
test("terminal control sequences are removed but markup remains literal text",()=> {
  assert.equal(cleanLog("\x1b[31mERROR\x1b[0m\r\n<script>literal</script>"),"ERROR\n<script>literal</script>");
  assert.equal(cleanLog("\x1b]0;title\x07hello"),"hello");
  assert.equal(cleanLog("\x1b]8;;https://example.com\x1b\\link\x1b]8;;\x1b\\"),"link");
  assert.equal(cleanLog("\x1b]".repeat(100000)),"");
});
