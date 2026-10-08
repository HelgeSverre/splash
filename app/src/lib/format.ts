// Display formatting shared across the UI.

/** "just now", "5 min ago", "3 h ago", or a date. */
export function ago(seconds: number): string {
  const s = Date.now() / 1000 - seconds;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return new Date(seconds * 1000).toLocaleDateString();
}

/** 1234 → "1k", 1_200_000 → "1.2M". */
export function compact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}k`;
  return `${Math.round(n)}`;
}

/** 850 → "850ms", 9700 → "9.7s", 125000 → "2m 5s". */
export function duration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60_000)}m ${Math.round((ms % 60_000) / 1000)}s`;
}

export const dateTime = (seconds: number) =>
  new Date(seconds * 1000).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });

export const num = (n: number) => Math.round(n).toLocaleString();

export function bytes(n: number): string {
  if (n > 1e6) return `${(n / 1e6).toFixed(1)} MB`;
  if (n > 1e3) return `${(n / 1e3).toFixed(1)} KB`;
  return `${n} B`;
}

export const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

const STATUS: Record<string, string> = {
  starting: "starting",
  idle: "ready",
  running: "working",
  awaiting_permission: "needs you",
  error: "error",
  exited: "stopped",
};

/** A session's status in words: "ready", "working", "needs you", … */
export const statusLabel = (status: string) => STATUS[status] ?? status.replaceAll("_", " ");

/** 0.4213 → "$0.42" (`digits` for more precision). */
export const usd = (n: number, digits = 2) => `$${n.toFixed(digits)}`;

/** Why a command failed, in plain words, when the web version lost its server:
 * the request never arrived (the server bridge's `ServerUnreachableError`), or
 * a restarted server refused the old IPC token (the runtime's `ForbiddenError`).
 * Undefined for any other error, and always in the desktop app, where a
 * refused token is a bug worth showing as it is. */
export function connectionError(e: unknown, serverMode: boolean): string | undefined {
  if (!serverMode || !(e instanceof Error)) return undefined;
  if (e.name === "ServerUnreachableError") return "Reconnecting to the server. Try again in a moment.";
  if (e.name === "ForbiddenError" && "detail" in e && /token/i.test(String(e.detail))) return "The server restarted. Try again in a moment.";
  return undefined;
}

/** The message of anything thrown: an Error, a command error, or a plain value. */
export function errorMessage(e: unknown): string {
  // `serverMode` from server.svelte.ts, read directly to keep this module plain.
  const lost = connectionError(e, !!globalThis.__SPLASH_SERVER__);
  if (lost) return lost;
  if (e instanceof Error && e.name === "CommandError" && "detail" in e && typeof e.detail === "string") return e.detail;
  if (e instanceof Error) return e.message;
  return String((e as { message?: unknown } | null)?.message ?? e);
}

/** A filter box's test: no query matches everything, else any of `text` contains it. */
export function matches(query: string, ...text: (string | null | undefined)[]): boolean {
  const q = query.trim().toLowerCase();
  return !q || text.join(" ").toLowerCase().includes(q);
}
