export type SideTab = "changes" | "files" | "details" | "review";

const defaults = {
  left: 260,
  right: 340,
  bottom: 260,
  leftOpen: true,
  rightOpen: true,
  bottomOpen: false,
  rightTab: "changes" as SideTab,
};

/** Persisted browser state can outlive a version or contain valid non-object JSON. */
export function restoredLayout(value: unknown): typeof defaults {
  const saved = value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
  const size = (key: "left" | "right" | "bottom", min: number, max: number) => {
    const value = saved[key];
    return typeof value === "number" && Number.isFinite(value)
      ? Math.max(min, Math.min(max, value))
      : defaults[key];
  };
  const open = (key: "leftOpen" | "rightOpen" | "bottomOpen") =>
    typeof saved[key] === "boolean" ? saved[key] as boolean : defaults[key];
  const tabs: readonly unknown[] = ["changes", "files", "details", "review"];
  return {
    left: size("left", 200, 420),
    right: size("right", 220, 720),
    bottom: size("bottom", 100, 1200),
    leftOpen: open("leftOpen"),
    rightOpen: open("rightOpen"),
    bottomOpen: open("bottomOpen"),
    rightTab: tabs.includes(saved.rightTab) ? saved.rightTab as SideTab : defaults.rightTab,
  };
}
