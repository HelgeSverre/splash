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

/** Below this window width the side panel floats over the conversation
 *  instead of taking a column from it, and starts closed. */
export const NARROW_WIDTH = 1100;

// Not saved: a narrow window borrows the panel for a moment; the saved
// `rightOpen` is how a wide window comes back.
export const viewport = $state({ narrow: false, overlayOpen: false });

/** Whether the side panel shows, as a column or (narrow) as an overlay. */
export const rightVisible = () => (viewport.narrow ? viewport.overlayOpen : layout.rightOpen);

export function setNarrow(narrow: boolean) {
  if (viewport.narrow === narrow) return;
  viewport.narrow = narrow;
  viewport.overlayOpen = false;
}

export function toggleLeft() {
  layout.leftOpen = !layout.leftOpen;
  saveLayout();
}

export function toggleRight() {
  if (viewport.narrow) {
    viewport.overlayOpen = !viewport.overlayOpen;
    return;
  }
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

/** Open the side panel on a tab. `asked` is false when the app does it by
 *  itself (a turn finished): a narrow window then only selects the tab, since
 *  its panel would cover the conversation uninvited. */
export function showSideTab(tab: SideTab, asked = true) {
  if (!viewport.narrow) layout.rightOpen = true;
  else if (asked) viewport.overlayOpen = true;
  layout.rightTab = tab;
  saveLayout();
}

export function openTerminal() {
  layout.bottomOpen = true;
  saveLayout();
}
