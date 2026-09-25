// Rebindable keyboard shortcuts: actions with default combos, user overrides
// kept in the `keybindings` setting, and one dispatcher for the whole app.
//
// Combos are canonical strings — modifiers in the order Ctrl, Alt, Shift, Meta,
// then the key from `KeyboardEvent.code` ("Meta+Shift+P", "Alt+Meta+B",
// "Ctrl+Tab"), so ⌥ doesn't turn letters into "∫".
import { prefs, setPref } from "./prefs.svelte";
import { modalOpen } from "./focus";

export type Action = { id: string; title: string; group: string; defaults: string[] };

const sessions = Array.from({ length: 9 }, (_, i) => ({
  id: `session.go${i + 1}`,
  title: `Go to session ${i + 1}`,
  group: "Sessions",
  defaults: [`Meta+${i + 1}`],
}));

// Defaults follow VS Code / JetBrains where there's a convention.
export const ACTIONS: Action[] = [
  { id: "session.new", title: "New session", group: "Sessions", defaults: ["Meta+N"] },
  { id: "session.stop", title: "Stop the agent", group: "Sessions", defaults: ["Meta+."] },
  { id: "session.next", title: "Next session", group: "Sessions", defaults: ["Ctrl+Tab"] },
  { id: "session.prev", title: "Previous session", group: "Sessions", defaults: ["Ctrl+Shift+Tab"] },
  ...sessions,
  { id: "composer.focus", title: "Focus the message box", group: "Composer", defaults: ["Meta+L"] },
  { id: "view.left", title: "Toggle sidebar", group: "Workbench", defaults: ["Meta+B"] },
  { id: "view.right", title: "Toggle changes, files & details", group: "Workbench", defaults: ["Alt+Meta+B"] },
  { id: "view.terminal", title: "Toggle terminal", group: "Workbench", defaults: ["Meta+J"] },
  { id: "tab.close", title: "Close tab", group: "Workbench", defaults: ["Meta+W"] },
  { id: "app.palette", title: "Command palette", group: "App", defaults: ["Meta+Shift+P", "Meta+K"] },
  { id: "app.settings", title: "Settings", group: "App", defaults: ["Meta+,"] },
];

const byId = new Map(ACTIONS.map((a) => [a.id, a]));

/** An action's name, as the shortcut list and the command palette show it. */
export const actionTitle = (id: string) => byId.get(id)?.title ?? id;

/** Shared UI state: while recording a combo, shortcuts don't fire. */
export const keys = $state({ recording: false });

function overrides(): Record<string, string[]> {
  try {
    return JSON.parse(prefs.keybindings ?? "{}");
  } catch {
    return {};
  }
}

const MOD_ORDER = ["Ctrl", "Alt", "Shift", "Meta"];

/** Modifiers in canonical order, so "Meta+Shift+P" and "Shift+Meta+P" are one combo. */
function normalize(combo: string): string {
  const parts = combo.split("+");
  const key = parts.pop() ?? "";
  const mods = MOD_ORDER.filter((m) => parts.includes(m));
  return [...mods, key].join("+");
}

export function bindings(id: string): string[] {
  return (overrides()[id] ?? byId.get(id)?.defaults ?? []).map(normalize);
}

export function isCustom(id: string): boolean {
  return id in overrides();
}

export async function setBindings(id: string, combos: string[]) {
  const o = overrides();
  const defaults = byId.get(id)?.defaults ?? [];
  if (combos.length === defaults.length && combos.every((c, i) => c === defaults[i])) delete o[id];
  else o[id] = combos;
  await setPref("keybindings", JSON.stringify(o));
}

export async function resetAll() {
  await setPref("keybindings", "{}");
}

/** The other action already using `combo`, if any. */
export function conflict(combo: string, except: string): Action | undefined {
  return ACTIONS.find((a) => a.id !== except && bindings(a.id).includes(combo));
}

// ── combos ───────────────────────────────────────────────────────────────────

const CODE_KEYS: Record<string, string> = {
  Comma: ",", Period: ".", Slash: "/", Backslash: "\\", Semicolon: ";", Quote: "'", Backquote: "`",
  BracketLeft: "[", BracketRight: "]", Minus: "-", Equal: "=", Space: "Space",
};

/** The canonical combo for a key event, or null for a lone modifier. */
export function comboFromEvent(e: KeyboardEvent): string | null {
  const code = e.code;
  if (/^(Shift|Control|Alt|Meta|OS|CapsLock|Fn)/.test(code) || !code) return null;
  let key: string;
  if (code.startsWith("Key")) key = code.slice(3);
  else if (code.startsWith("Digit")) key = code.slice(5);
  else if (code.startsWith("Numpad")) key = code.slice(6);
  else key = CODE_KEYS[code] ?? code; // ArrowUp, Enter, Escape, Tab, Backspace, F5…
  const mods = [e.ctrlKey && "Ctrl", e.altKey && "Alt", e.shiftKey && "Shift", e.metaKey && "Meta"].filter(Boolean);
  return [...mods, key].join("+");
}

/** Global shortcuts need a modifier (or a function key), or they'd eat typing. */
export function isUsable(combo: string): boolean {
  return /(^|\+)(Ctrl|Alt|Meta)\+/.test(combo) || /(^|\+)F\d{1,2}$/.test(combo);
}

const SYMBOLS: Record<string, string> = {
  Ctrl: "⌃", Alt: "⌥", Shift: "⇧", Meta: "⌘", Enter: "⏎", Escape: "Esc", Tab: "⇥", Backspace: "⌫",
  Delete: "⌦", Space: "Space", ArrowUp: "↑", ArrowDown: "↓", ArrowLeft: "←", ArrowRight: "→",
};

/** "Alt+Meta+B" → "⌥ ⌘ B" (space-separated keycaps). */
export function format(combo: string): string {
  return combo
    .split("+")
    .map((k) => SYMBOLS[k] ?? k)
    .join(" ");
}

/** The first binding of an action, formatted — for hints next to labels. */
export function shortcut(id: string): string {
  const b = bindings(id)[0];
  return b ? format(b) : "";
}

/** A tooltip with the action's shortcut: "Terminal (⌘J)", or just "Terminal" when unbound. */
export function withKey(label: string, id: string): string {
  const keys = shortcut(id).replaceAll(" ", "");
  return keys ? `${label} (${keys})` : label;
}

// ── dispatch ─────────────────────────────────────────────────────────────────

/** A handler returns false when it doesn't apply right now (the key passes on). */
type Handler = () => boolean | void;
const handlers = new Map<string, Handler>();

export function onAction(id: string, handler: Handler): () => void {
  handlers.set(id, handler);
  return () => handlers.delete(id);
}

export function run(id: string): boolean {
  const h = handlers.get(id);
  return !!h && h() !== false;
}

/** The only actions that still fire while a modal dialog is open. */
const OVER_MODALS = new Set(["app.settings", "app.palette"]);

function dispatch(e: KeyboardEvent) {
  if (keys.recording || e.defaultPrevented) return;
  const combo = comboFromEvent(e);
  if (!combo || !isUsable(combo)) return;
  const modal = modalOpen();
  for (const a of ACTIONS) {
    if (modal && !OVER_MODALS.has(a.id)) continue;
    if (bindings(a.id).includes(combo) && run(a.id)) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
  }
}

let installed = false;
/** Install the app-wide listener (capture phase, so it works in the terminal too). */
export function installKeybindings() {
  if (installed) return;
  installed = true;
  window.addEventListener("keydown", dispatch, true);
}
