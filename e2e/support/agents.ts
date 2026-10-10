// Steer the fake agents through their control files and read back what they
// were asked: launches (argv, cwd) and every ACP request (the audit log).
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { isAbsolute, join } from "node:path";
import { FIXTURES } from "./paths.ts";

export type AgentId = "claude" | "codex" | "glue" | "pool" | "pi" | "amp" | "vibe";

export type Launch = { agent: AgentId; argv: string[]; cwd: string; pid: number };
export type Request = { id?: number; method?: string; params?: any; result?: any };

/** Read newline-delimited JSON records. The writer commits a record with its
 * trailing newline, so an append observed mid-write is not parsed yet. */
export const lines = <T>(file: string): T[] => {
  if (!existsSync(file)) return [];
  const text = readFileSync(file, "utf8");
  const committed = text.endsWith("\n") ? text : text.slice(0, text.lastIndexOf("\n") + 1);
  return committed
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line) as T);
};

export class Agents {
  readonly dir: string;
  constructor(dir: string) {
    this.dir = dir;
  }

  /** Replay this recording; relative paths are under the repository's fixtures/. */
  fixture(agent: AgentId, path: string) {
    writeFileSync(join(this.dir, `${agent}.fixture`), isAbsolute(path) ? path : join(FIXTURES, path));
  }
  flags(agent: AgentId, ...flags: string[]) {
    writeFileSync(join(this.dir, `${agent}.flags`), flags.join(" "));
  }
  /** FAKE_ACP_SPEED: 0 replays without delays, 1 in recorded time. */
  speed(agent: AgentId, speed: number) {
    writeFileSync(join(this.dir, `${agent}.speed`), String(speed));
  }
  loggedOut(agent: AgentId, out = true) {
    writeFileSync(join(this.dir, `${agent}.auth`), out ? "logged_out" : "ok");
  }

  launches(agent?: AgentId): Launch[] {
    return lines<Launch>(join(this.dir, "launches.jsonl")).filter((l) => !agent || l.agent === agent);
  }
  /** Every JSON-RPC message the agent received, in order. */
  audit(agent: AgentId): Request[] {
    return lines<Request>(join(this.dir, `${agent}.audit.jsonl`));
  }
  requests(agent: AgentId, method: string): Request[] {
    return this.audit(agent).filter((r) => r.method === method);
  }
}
