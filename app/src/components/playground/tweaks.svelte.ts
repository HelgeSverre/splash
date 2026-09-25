// Live token overrides for the playground. They sit as inline styles on
// <html>, so the whole app follows them until Reset or a reload. Nothing is
// saved.
import { tokenGroups, px } from "./tokens";

export const tweaks = $state({
  /** A token name (`--info`) or a colour value; "" is the stylesheet's own. */
  accent: "",
  typeScale: 1,
  radiusScale: 1,
  grid: false,
  baseline: false,
  outlines: false,
  /** Bumped on every change, so token readouts re-read computed values. */
  version: 0,
  /** Hand overrides from the token editor: name → value. */
  custom: {} as Record<string, string>,
});

const root = () => document.documentElement.style;
const sources = () => Object.fromEntries(tokenGroups().flatMap((g) => g.tokens.map((t) => [t.name, t.source])));
const touched = new Set<string>();

function set(name: string, value: string | null) {
  if (value === null) {
    root().removeProperty(name);
    touched.delete(name);
  } else {
    root().setProperty(name, value);
    touched.add(name);
  }
}

function scalePx(names: string[], factor: number) {
  const src = sources();
  for (const n of names) {
    const base = px(src[n] ?? "");
    if (Number.isNaN(base)) continue;
    set(n, factor === 1 ? null : `${+(base * factor).toFixed(2)}px`);
  }
}

/** Recompute every override from `tweaks`. */
export function applyTweaks() {
  const a = tweaks.accent;
  if (!a) {
    for (const n of ["--accent", "--accent-hover", "--accent-soft", "--accent-border", "--term-selection"]) set(n, null);
  } else {
    set("--accent", a.startsWith("--") ? `var(${a})` : a);
    // The accent's companions follow it, mixed from tokens (no literals).
    set("--accent-hover", "color-mix(in srgb, var(--accent) 80%, var(--text))");
    set("--accent-soft", "color-mix(in srgb, var(--accent) 12%, transparent)");
    set("--accent-border", "color-mix(in srgb, var(--accent) 45%, transparent)");
    set("--term-selection", "color-mix(in srgb, var(--accent) 25%, transparent)");
  }
  const names = Object.keys(sources());
  scalePx(names.filter((n) => n.startsWith("--fs-")), tweaks.typeScale);
  scalePx(names.filter((n) => n.startsWith("--radius") && n !== "--radius-pill"), tweaks.radiusScale);
  for (const [n, v] of Object.entries(tweaks.custom)) set(n, v || null);
  tweaks.version++;
}

export function resetTweaks() {
  for (const n of [...touched]) set(n, null);
  Object.assign(tweaks, { accent: "", typeScale: 1, radiusScale: 1, custom: {} });
  tweaks.version++;
}

export const tweaked = () => touched.size > 0;
