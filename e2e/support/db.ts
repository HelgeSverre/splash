// Read-only views of a test backend's SQLite database (<data>/splash.db).
import { join } from "node:path";

// Loaded on first use so listing tests never touches the experimental module.
const sqlite = () => process.getBuiltinModule("node:sqlite") as typeof import("node:sqlite");

export type SessionRow = {
  id: string;
  project_id: string;
  agent_id: string;
  title: string;
  cwd: string;
  isolation: string;
  branch: string | null;
  base_sha: string | null;
  agent_session_id: string | null;
  archived: number;
  title_override: number;
  external: number;
  parent_id: string | null;
  attention_json: string | null;
  usage_json: string | null;
  source_json: string;
  additional_directories_json: string;
  launch_args: string | null;
};

export class Db {
  readonly dataDir: string;
  constructor(dataDir: string) {
    this.dataDir = dataDir;
  }

  query<T>(sql: string, ...params: (string | number | null)[]): T[] {
    const db = new (sqlite().DatabaseSync)(join(this.dataDir, "splash.db"), { readOnly: true });
    try {
      return db.prepare(sql).all(...params) as T[];
    } finally {
      db.close();
    }
  }

  sessions(): SessionRow[] {
    return this.query<SessionRow>("SELECT * FROM sessions ORDER BY created_at");
  }
  session(id: string): SessionRow | undefined {
    return this.query<SessionRow>("SELECT * FROM sessions WHERE id = ?", id)[0];
  }
  projects(): { id: string; name: string; path: string; is_git: number }[] {
    return this.query("SELECT id, name, path, is_git FROM projects ORDER BY name");
  }
  /** Entry kinds of a session, in order. */
  kinds(sessionId: string): string[] {
    return this.query<{ kind: string }>("SELECT kind FROM entries WHERE session_id = ? ORDER BY idx", sessionId).map((r) => r.kind);
  }
  entries(sessionId: string): { idx: number; kind: string; data: any }[] {
    return this.query<{ idx: number; kind: string; data: string }>(
      "SELECT idx, kind, data FROM entries WHERE session_id = ? ORDER BY idx",
      sessionId,
    ).map((r) => ({ ...r, data: JSON.parse(r.data) }));
  }
  setting(key: string): string | undefined {
    return this.query<{ value: string }>("SELECT value FROM settings WHERE key = ?", key)[0]?.value;
  }
}
