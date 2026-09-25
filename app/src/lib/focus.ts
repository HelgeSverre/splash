// Keyboard focus helpers: the open-modal stack, tabbable lookup, focus traps
// and roving tabindex for lists (radios, tabs, tree rows).

// ── modals ───────────────────────────────────────────────────────────────────
//
// One stack of open modals, innermost last. Whatever sits outside the top
// modal is inert, recomputed from the stack on every open and close, so a
// dialog closing under another one (Settings under a doc preview) can't wake
// the app up behind the one still showing.

type Layer = { id: symbol; el: HTMLElement | null };
const layers: Layer[] = [];
/** The elements this module made inert, so a resync only undoes its own. */
let inerted: HTMLElement[] = [];

function syncInert() {
  for (const el of inerted) el.inert = false;
  inerted = [];
  const keep = [...layers].reverse().find((l) => l.el?.isConnected)?.el;
  if (!keep) return;
  const root = document.getElementById("app") ?? document.body;
  let node: HTMLElement | null = keep;
  while (node && node !== root && node.parentElement) {
    for (const sib of Array.from(node.parentElement.children)) {
      if (sib === node || !(sib instanceof HTMLElement) || sib.inert) continue;
      sib.inert = true;
      inerted.push(sib);
    }
    node = node.parentElement;
  }
}

/** Register a modal as it's created (before it mounts). */
export function pushModal(): symbol {
  const id = Symbol("modal");
  layers.push({ id, el: null });
  return id;
}

/** Hand over the modal's outermost element once mounted: the rest goes inert. */
export function mountModal(id: symbol, el: HTMLElement) {
  const layer = layers.find((l) => l.id === id);
  if (layer) layer.el = el;
  syncInert();
}

/** Take a modal off the stack; the one under it (if any) becomes the live one. */
export function popModal(id: symbol) {
  const i = layers.findIndex((l) => l.id === id);
  if (i >= 0) layers.splice(i, 1);
  syncInert();
}

/** True while any modal dialog is up: global shortcuts and hotkeys stand down. */
export function modalOpen(): boolean {
  return layers.length > 0;
}

/** True when `id` is the innermost open modal. */
export function isTopModal(id: symbol): boolean {
  return layers.at(-1)?.id === id;
}

// ── tabbables ────────────────────────────────────────────────────────────────

const TABBABLE = [
  "a[href]",
  "button",
  "input:not([type=hidden])",
  "select",
  "textarea",
  "summary",
  "[tabindex]",
  "[contenteditable]:not([contenteditable=false])",
].join(",");

/** Elements Tab can reach inside `root`, in document order. */
function tabbables(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(TABBABLE)).filter(
    (el) => el.tabIndex >= 0 && !el.matches(":disabled") && !el.closest("[inert]") && el.getClientRects().length > 0,
  );
}

/**
 * The next (or previous) tabbable from `from`, wrapping round. `from` need not
 * be in the list itself (the body, a tabindex=-1 container or row): the
 * search starts at its place in the document.
 */
function stepFrom(list: HTMLElement[], from: Element | null, back: boolean): HTMLElement | undefined {
  if (!list.length) return undefined;
  const at = from ? list.indexOf(from as HTMLElement) : -1;
  if (at >= 0) return list[(at + (back ? -1 : 1) + list.length) % list.length];
  if (!from || from === document.body) return back ? list[list.length - 1] : list[0];
  const after = (el: HTMLElement) => !!(from.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING);
  if (back) return list.findLast((el) => !after(el)) ?? list[list.length - 1];
  return list.find(after) ?? list[0];
}

/**
 * Tab and Shift+Tab across the whole app, in JS. WebKit on macOS (the real
 * app is a WKWebView) only tabs to text fields and pop-ups unless the user
 * turned on Keyboard navigation in System Settings, and nearly every control
 * here is a <button>. So the app moves focus itself, the same way in every
 * engine: through `tabbables()` of the top modal, or of the page. A handler
 * that already dealt with Tab (the composer's slash menu, a modal's trap)
 * calls preventDefault and this stands down; so does the terminal.
 */
export function installTabOrder() {
  window.addEventListener("keydown", (e) => {
    if (e.key !== "Tab" || e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
    const active = document.activeElement;
    if (active?.closest(".xterm")) return;
    const top = [...layers].reverse().find((l) => l.el?.isConnected)?.el;
    const list = tabbables(top ?? document.body);
    if (!list.length) return;
    e.preventDefault();
    let from: Element | null = active;
    // Skip anything that turns out not to take focus (hidden by visibility, say).
    for (let n = 0; n < list.length; n++) {
      const next = stepFrom(list, from, e.shiftKey);
      if (!next) return;
      next.focus();
      if (document.activeElement === next) return;
      from = next;
    }
  });
}

/** Keep Tab and Shift+Tab cycling inside `root`. Call from its keydown. */
export function trapTab(e: KeyboardEvent, root: HTMLElement) {
  if (e.key !== "Tab" || e.metaKey || e.ctrlKey || e.altKey) return;
  const list = tabbables(root);
  if (!list.length) {
    e.preventDefault();
    root.focus();
    return;
  }
  const first = list[0];
  const last = list[list.length - 1];
  const active = document.activeElement as HTMLElement | null;
  const inside = !!active && root.contains(active) && active !== root;
  if (e.shiftKey && (!inside || active === first)) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && (!inside || active === last)) {
    e.preventDefault();
    first.focus();
  }
}

/** Focus the first [autofocus] element in `root`, else the first tabbable, else root. */
export function focusFirst(root: HTMLElement) {
  if (root.contains(document.activeElement) && document.activeElement !== root) return;
  const auto = root.querySelector<HTMLElement>("[autofocus], [data-autofocus]");
  // A dialog's close button comes first in the markup, but it's the wrong place to land.
  const list = tabbables(root);
  const first = list.find((el) => !el.closest("[data-modal-close]")) ?? list[0];
  (auto ?? first ?? root).focus({ preventScroll: true });
}

// ── the message box ──────────────────────────────────────────────────────────

// Each mounted Composer's textarea (the playground can show a second one).
const composers = new Set<HTMLTextAreaElement>();

/** Composer registers its textarea while mounted; call the result to unregister. */
export function registerComposer(el: HTMLTextAreaElement): () => void {
  composers.add(el);
  return () => composers.delete(el);
}

/** True for a Composer's textarea. */
export const isComposer = (el: EventTarget | null) => composers.has(el as HTMLTextAreaElement);

/** Focus the message box that's showing. False when none is. */
export function focusComposer(): boolean {
  const box = [...composers].find((el) => el.getClientRects().length > 0);
  box?.focus();
  return !!box;
}

/**
 * Somewhere to land when the focused thing is about to go (the terminal
 * closing): the message box if the chat is showing, else the header's
 * Terminal toggle.
 */
export function focusSession() {
  if (!focusComposer()) document.querySelector<HTMLElement>(".session header [aria-label=Terminal]")?.focus();
}

// ── roving tabindex ──────────────────────────────────────────────────────────

/**
 * Arrow-key movement across a set of items where only one is tabbable.
 * Returns the index to move to, or null when the key isn't a move.
 * `orientation` picks which arrows count; "both" takes all four.
 */
export function rovingIndex(
  e: KeyboardEvent,
  index: number,
  count: number,
  orientation: "horizontal" | "vertical" | "both" = "both",
  disabled: (i: number) => boolean = () => false,
): number | null {
  if (e.metaKey || e.ctrlKey || e.altKey || count === 0) return null;
  const next = orientation !== "vertical" ? ["ArrowRight"] : [];
  const prev = orientation !== "vertical" ? ["ArrowLeft"] : [];
  if (orientation !== "horizontal") {
    next.push("ArrowDown");
    prev.push("ArrowUp");
  }
  let step = 0;
  let from = index;
  if (next.includes(e.key)) step = 1;
  else if (prev.includes(e.key)) step = -1;
  else if (e.key === "Home") (step = 1), (from = -1);
  else if (e.key === "End") (step = -1), (from = count);
  else return null;
  for (let n = 1; n <= count; n++) {
    const i = (((from + step * n) % count) + count) % count;
    if (!disabled(i)) return i;
  }
  return null;
}

/**
 * A radio group's arrow keys: pick the next enabled radio in `root` and move
 * focus to it, the way a native radio group does.
 */
export function radioKeydown(
  e: KeyboardEvent,
  index: number,
  count: number,
  disabled: (i: number) => boolean,
  pick: (i: number) => void,
  root: HTMLElement | undefined,
) {
  const next = rovingIndex(e, index, count, "both", disabled);
  if (next === null) return;
  e.preventDefault();
  pick(next);
  root?.querySelectorAll<HTMLElement>("[role=radio]")[next]?.focus();
}

/** Keys that are someone's typing, a terminal, or a dialog: hotkeys stay out. */
export function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el || !el.closest) return false;
  return !!el.closest("input, textarea, select, [contenteditable], .xterm, [role=dialog]");
}
