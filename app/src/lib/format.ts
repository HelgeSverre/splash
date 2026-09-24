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
