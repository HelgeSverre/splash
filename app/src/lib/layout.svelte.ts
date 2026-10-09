// The workbench's panels: their sizes, which are open, and the side panel's
// tab. Kept in localStorage, so they're the same next launch.
import { tick } from "svelte";
import { focusSession } from "./focus";
import { restoredLayout } from "./layout-values";
export type { SideTab } from "./layout-values";
import type { SideTab } from "./layout-values";

const saved = (() => {
  try {
    return JSON.parse(localStorage.getItem("splash.layout") ?? "{}");
  } catch {
    return {};
  }
})();

export const layout = $state(restoredLayout(saved));

export function saveLayout() {
  try {
    localStorage.setItem("splash.layout", JSON.stringify(layout));
  } catch {}
}

export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** The terminal pane's element id (BottomTerminal), to tell if focus is in it. */
export const TERMINAL_PANE = "terminal-pane";

export function toggleLeft() {
  layout.leftOpen = !layout.leftOpen;
  saveLayout();
}

export function toggleRight() {
  layout.rightOpen = !layout.rightOpen;
  saveLayout();
}

/** Show or hide the terminal. The shell takes focus as it shows; hiding it
 *  while it has focus hands focus back to the session. */
export function toggleBottom() {
  const hadFocus = !!document.getElementById(TERMINAL_PANE)?.contains(document.activeElement);
  layout.bottomOpen = !layout.bottomOpen;
  saveLayout();
  if (!layout.bottomOpen && hadFocus) tick().then(focusSession);
}

/** Open the side panel on a tab. */
export function showSideTab(tab: SideTab) {
  layout.rightOpen = true;
  layout.rightTab = tab;
  saveLayout();
}

export function openTerminal() {
  layout.bottomOpen = true;
  saveLayout();
}
