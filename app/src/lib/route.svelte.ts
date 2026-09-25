// Which screen shows: the welcome page, a session, or the hidden
// design-system playground (#/playground, the one view with a URL).
import { app } from "./sessions.svelte";

export type View = { kind: "welcome" } | { kind: "session"; id: string } | { kind: "playground" };

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

/** Leaving the playground another way (a session) drops the hash with it. */
export function syncPlaygroundHash() {
  if (app.view.kind !== "playground" && location.hash === PLAYGROUND_HASH) setHash("");
}

function routeFromHash() {
  if (location.hash === PLAYGROUND_HASH) app.view = { kind: "playground" };
  else if (app.view.kind === "playground") app.view = { kind: "welcome" };
}

let installed = false;
/** Follow the URL hash: now, and whenever it changes. */
export function installRoute() {
  if (installed) return;
  installed = true;
  routeFromHash();
  window.addEventListener("hashchange", routeFromHash);
}
