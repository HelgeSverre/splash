// Inline fixtures for the design-system playground: a fake session, config
// options and one transcript entry of every kind. Nothing here reaches Rust.
import type { ConfigOption, Entry, SessionView, Usage } from "../../bindings";

export const CWD = "/Users/demo/code/splash-demo";

const OLD_SRC = `export function greet(name: string) {
  return "Hello, " + name;
}

export const VERSION = 1;
`;

const NEW_SRC = `export function greet(name: string, excited = false) {
  const base = \`Hello, \${name}\`;
  return excited ? base + "!" : base;
}

export const VERSION = 2;
`;

export const DIFF = { path: `${CWD}/src/greet.ts`, old: OLD_SRC, new: NEW_SRC };

export const CODE_SAMPLE = `// A sample for CodeView: keywords, strings, numbers, comments.
import { readFile } from "node:fs/promises";

type Config = { name: string; retries: number };

export async function load(path: string): Promise<Config> {
  const raw = await readFile(path, "utf8");
  const cfg = JSON.parse(raw) as Config;
  return { ...cfg, retries: cfg.retries ?? 3 };
}
`;

export const MODEL_OPTION: ConfigOption = {
  id: "model",
  name: "Model",
  category: "model",
  current: "sonnet",
  choices: [
    { value: "opus", name: "Opus", description: "Most capable, slower" },
    { value: "sonnet", name: "Sonnet", description: "Balanced default" },
    { value: "haiku", name: "Haiku", description: "Fast and light" },
  ],
};

export const MODE_OPTION: ConfigOption = {
  id: "mode",
  name: "Mode",
  category: "mode",
  current: "default",
  choices: [
    { value: "default", name: "Ask", description: "Ask before edits and commands" },
    { value: "acceptEdits", name: "Accept edits", description: "Edit files without asking" },
    { value: "plan", name: "Plan", description: "Read only, propose a plan" },
  ],
};

export const usageAt = (pct: number): Usage => ({ used: Math.round(200_000 * pct), size: 200_000, cost_usd: pct > 0 ? 0.42 * pct : null, extra: [] });

export function fakeSession(status: SessionView["status"] = "idle", usage: Usage | null = usageAt(0.38)): SessionView {
  return {
    id: "playground",
    project_id: "playground",
    agent_id: "claude",
    title: "Add an excited flag to greet()",
    cwd: CWD,
    isolation: "worktree",
    branch: "splash/excited-greet",
    base_sha: null,
    agent_session_id: null,
    archived: false,
    created_at: 0,
    updated_at: 0,
    usage,
    status,
    detail: null,
    meta: { options: [MODE_OPTION, MODEL_OPTION], legacy_modes: false, commands: [], usage, title: null },
  } as SessionView;
}

const MARKDOWN = `Done. \`greet()\` now takes an optional **excited** flag.

## What changed

- \`src/greet.ts\`: new \`excited\` parameter, defaults to \`false\`
- Bumped \`VERSION\` to 2

\`\`\`ts
greet("Ada", true); // "Hello, Ada!"
\`\`\`

> Run the tests with \`npm test\` before merging.

| File | + | − |
| --- | --- | --- |
| src/greet.ts | 3 | 1 |
`;

const tool = (over: Partial<Extract<Entry, { kind: "tool" }>>): Entry => ({
  kind: "tool",
  id: Math.random().toString(36).slice(2),
  title: "Tool",
  tool_kind: "other",
  status: "completed",
  locations: [],
  content: [],
  input: null,
  output: null,
  ...over,
});

/** One of every transcript entry, in a plausible order. */
export const ENTRIES: Entry[] = [
  { kind: "notice", text: "MCP server \"docs\" failed to start: spawn docs-mcp ENOENT\nContinuing without it." },
  { kind: "user", text: "Add an optional excited flag to greet() that ends the greeting with an exclamation mark." },
  { kind: "thought", text: "The user wants a boolean flag. I should read src/greet.ts first, then make a minimal edit and keep the default behaviour unchanged.", streaming: false },
  {
    kind: "plan",
    items: [
      { content: "Read src/greet.ts", priority: "high", status: "completed" },
      { content: "Add the excited parameter", priority: "high", status: "in_progress" },
      { content: "Bump VERSION and run the tests", priority: "medium", status: "pending" },
    ],
  },
  tool({ title: `Read ${CWD}/src/greet.ts`, tool_kind: "read", status: "completed", locations: [{ path: `${CWD}/src/greet.ts`, line: null }], output: OLD_SRC }),
  tool({
    title: "Read `download_images.py`",
    tool_kind: "read",
    status: "completed",
    locations: [{ path: `${CWD}/download_images.py`, line: null }],
    content: [{ type: "text", text: "```python\nimport httpx\n\ndef fetch(url: str, retries: int = 3) -> bytes:\n    \"\"\"Download a logo, retrying on errors.\"\"\"\n    for attempt in range(retries):\n        r = httpx.get(url, timeout=10)\n        if r.status_code == 200:\n            return r.content  # done\n    raise RuntimeError(f\"gave up on {url}\")\n```" }],
  }),
  tool({ title: "Search for greet(", tool_kind: "search", status: "pending", input: "greet(" }),
  tool({ title: "npm test", tool_kind: "execute", status: "in_progress", input: "npm test" }),
  tool({ title: "rm -rf build", tool_kind: "execute", status: "failed", input: "rm -rf build", output: "rm: build: Permission denied" }),
  tool({
    title: `Edit ${CWD}/src/greet.ts`,
    tool_kind: "edit",
    status: "completed",
    locations: [{ path: DIFF.path, line: 1 }],
    content: [{ type: "diff", path: DIFF.path, old: DIFF.old, new: DIFF.new }],
  }),
  {
    kind: "permission",
    request_id: "req-1",
    title: "git push origin splash/excited-greet",
    tool_id: null,
    options: [
      { id: "allow", name: "Allow", kind: "allow_once" },
      { id: "always", name: "Always allow", kind: "allow_always" },
      { id: "reject", name: "Reject", kind: "reject_once" },
    ],
    resolution: "allow",
  },
  { kind: "agent", text: MARKDOWN, streaming: false },
  { kind: "turn_end", stop_reason: "end_turn", duration_ms: 42_300 },
  { kind: "divider", text: "Session resumed" },
  { kind: "user", text: "Now push it." },
  { kind: "error", text: "Agent exited with code 1\nerror: authentication required" },
  { kind: "turn_end", stop_reason: "max_tokens", duration_ms: 3_100 },
  {
    kind: "permission",
    request_id: "req-2",
    title: "git push --force origin splash/excited-greet",
    tool_id: null,
    options: [
      { id: "allow", name: "Allow", kind: "allow_once" },
      { id: "always", name: "Always allow", kind: "allow_always" },
      { id: "reject", name: "Reject", kind: "reject_once" },
    ],
    resolution: null,
  },
  { kind: "thought", text: "Waiting on the push permission, then I will", streaming: true },
  {
    kind: "agent",
    text: "Pushing the branch now. The **new flag is off by default** and `greet(",
    streaming: true,
  },
  {
    kind: "agent",
    text: "Here is the change so far:\n\n```ts\nexport function greet(name: string, excited = false) {\n  const end = excited ? \"!\" : \".\";",
    streaming: true,
  },
];
