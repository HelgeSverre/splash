// Screens with stable URLs: GitHub and the design-system playground.
// Session navigation stays in memory.
import { app } from "./sessions.svelte";

export type View = { kind: "welcome" } | { kind: "session"; id: string } | { kind: "playground" } | { kind: "github" } | { kind: "actions" };

export function openActions() { app.view = { kind: "actions" }; setHash("#/actions"); }

export function openGithub() {
  app.view = { kind: "github" };
  setHash("#/github");
}

const PLAYGROUND_HASH = "#/playground";

function setHash(hash: string) {
  try {
    history.replaceState(null, "", hash || location.pathname + location.search);
  } catch {}
}

export function openPlayground() {
  app.view = { kind: "playground" };
  if (location.hash !== PLAYGROUND_HASH) setHash(PLAYGROUND_HASH);
}

export function closePlayground() {
  app.view = { kind: "welcome" };
  if (location.hash === PLAYGROUND_HASH) setHash("");
}

/** Leaving a named view through another navigation action drops its hash. */
export function syncPlaygroundHash() {
  if (app.view.kind !== "actions" && location.hash === "#/actions") setHash("");
  if (app.view.kind !== "github" && location.hash === "#/github") setHash("");
  if (app.view.kind !== "playground" && location.hash === PLAYGROUND_HASH) setHash("");
}

function routeFromHash() {
  if (location.hash === "#/actions") app.view = { kind: "actions" };
  else if (location.hash === "#/github") app.view = { kind: "github" };
  else if (location.hash === PLAYGROUND_HASH) app.view = { kind: "playground" };
  else if (app.view.kind === "playground" || app.view.kind === "github" || app.view.kind === "actions") app.view = { kind: "welcome" };
}

let installed = false;
/** Follow the URL hash: now, and whenever it changes. */
export function installRoute() {
  if (installed) return;
  installed = true;
  routeFromHash();
  window.addEventListener("hashchange", routeFromHash);
}
