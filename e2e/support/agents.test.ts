import { strict as assert } from "node:assert";
import { mkdtempSync, rmSync, writeFileSync, appendFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { lines } from "./agents.ts";

test("JSONL waits for an appended record's newline", () => {
  const dir = mkdtempSync(join(tmpdir(), "splash-agents-"));
  try {
    const file = join(dir, "claude.audit.jsonl");
    writeFileSync(file, '{"method":"initialize"}\n{"method":"session');
    assert.deepEqual(lines<{ method: string }>(file), [{ method: "initialize" }]);

    appendFileSync(file, '/prompt"}\n');
    assert.deepEqual(lines<{ method: string }>(file), [{ method: "initialize" }, { method: "session/prompt" }]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("JSONL still rejects a malformed committed record", () => {
  const dir = mkdtempSync(join(tmpdir(), "splash-agents-"));
  try {
    const file = join(dir, "claude.audit.jsonl");
    writeFileSync(file, '{"method":}\n');
    assert.throws(() => lines(file), SyntaxError);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
