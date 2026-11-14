export function actionStatus(status: string, conclusion: string | null) { return (conclusion || status || "unknown").replaceAll("_", " "); }
/** The status as a label: "In progress", "Timed out". */
export function actionLabel(status: string, conclusion: string | null) { const text = actionStatus(status, conclusion); return text.charAt(0).toUpperCase() + text.slice(1); }
export function actionTone(status: string, conclusion: string | null) {
  if (["failure", "timed_out", "action_required", "startup_failure"].includes(conclusion ?? "")) return "failed";
  if (conclusion === "success") return "passed";
  return ["queued", "in_progress", "waiting", "pending", "requested"].includes(status) ? "active" : "neutral";
}
export function duration(start: string | null, end: string | null, now: number): string {
  if (!start) return "Not started";
  const elapsed = (end ? Date.parse(end) : now) - Date.parse(start);
  if (!Number.isFinite(elapsed) || elapsed < 0) return "Unavailable";
  const seconds = Math.floor(elapsed / 1000);
  return seconds >= 3600 ? `${Math.floor(seconds / 3600)}h ${Math.floor(seconds % 3600 / 60)}m` : seconds >= 60 ? `${Math.floor(seconds / 60)}m ${seconds % 60}s` : `${seconds}s`;
}
// Logs stay plain text. Remove terminal controls rather than interpreting them.
export function cleanLog(text: string): string { return text.replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, "").replace(/\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)?/g, "").replace(/[\x00-\x08\x0b-\x1f\x7f]/g, ""); }
