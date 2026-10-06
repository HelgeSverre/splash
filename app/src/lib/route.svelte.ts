// Named views and saved conversations have stable local URLs.
import { app, openSession } from "./sessions.svelte";

export type View = { kind: "welcome" } | { kind: "session"; id: string } | { kind: "playground" } | { kind: "github" } | { kind: "actions" } | { kind: "library" } | { kind: "attention" };

function navigate(kind: "actions" | "github" | "playground" | "library" | "attention") {
  app.view = { kind };
  syncPlaygroundHash();
}
export const openActions = () => navigate("actions");
export const openGithub = () => navigate("github");
export const openPlayground = () => navigate("playground");
export const openLibrary = () => navigate("library");
export const openAttention = () => navigate("attention");
export function closePlayground() { app.view = { kind: "welcome" }; syncPlaygroundHash(); }

export function syncPlaygroundHash() {
  const hash = app.view.kind === "session" ? `#/session/${encodeURIComponent(app.view.id)}${app.focusEntry !== null ? `?entry=${app.focusEntry}` : ""}` : app.view.kind === "welcome" ? "" : `#/${app.view.kind}`;
  if (!installed) return;
  if (location.hash === hash) return;
  try { history.replaceState(null, "", hash || location.pathname + location.search); } catch {}
}

function routeFromHash() {
  const session = location.hash.match(/^#\/session\/([^?]+)(?:\?entry=(\d+))?$/);
  if (session) {
    try { void openSession(decodeURIComponent(session[1]), session[2] ? Number(session[2]) : undefined); } catch {}
    return;
  }
  const kind = location.hash.slice(2);
  if (kind === "actions" || kind === "github" || kind === "playground" || kind === "library" || kind === "attention") app.view = { kind };
  else app.view = { kind: "welcome" };
}
let installed = false;
export function installRoute() {
  if (installed) return;
  installed = true;
  routeFromHash();
  window.addEventListener("hashchange", routeFromHash);
}
