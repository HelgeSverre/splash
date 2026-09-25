<script lang="ts">
  // A drag handle: reports pixel deltas along its axis. Focusable: the arrow
  // keys nudge it by 8px (32px with Shift).
  let {
    axis,
    onmove,
    onend,
    label = "Resize",
    value,
    min,
    max,
  }: {
    axis: "x" | "y";
    onmove: (delta: number) => void;
    onend?: () => void;
    label?: string;
    /** The size of the pane it resizes, for assistive tech. */
    value?: number;
    min?: number;
    max?: number;
  } = $props();
  let dragging = $state(false);

  function down(e: PointerEvent) {
    dragging = true;
    let last = axis === "x" ? e.clientX : e.clientY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => {
      const now = axis === "x" ? ev.clientX : ev.clientY;
      onmove(now - last);
      last = now;
    };
    const up = () => {
      dragging = false;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      onend?.();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function onkeydown(e: KeyboardEvent) {
    const back = axis === "x" ? "ArrowLeft" : "ArrowUp";
    const fwd = axis === "x" ? "ArrowRight" : "ArrowDown";
    if (e.key !== back && e.key !== fwd) return;
    e.preventDefault();
    const step = e.shiftKey ? 32 : 8;
    onmove(e.key === fwd ? step : -step);
    onend?.();
  }
</script>

<!-- A focusable separator is an interactive widget (a resizer), per WAI-ARIA. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
<div class="splitter {axis}" class:dragging role="separator" tabindex="0" aria-label={label}
  aria-orientation={axis === "x" ? "vertical" : "horizontal"}
  aria-valuenow={value} aria-valuemin={min} aria-valuemax={max}
  onpointerdown={down} {onkeydown}></div>

<style>
  .splitter { position: relative; z-index: 4; flex: none; }
  .splitter.x { width: 1px; cursor: col-resize; background: var(--border); }
  .splitter.y { height: 1px; cursor: row-resize; background: var(--border); }
  .splitter::after { content: ""; position: absolute; }
  .splitter.x::after { inset: 0 -3px; }
  .splitter.y::after { inset: -3px 0; }
  /* Hover and drag brighten the line; the accent is kept for keyboard focus. */
  .splitter:hover, .splitter.dragging { background: var(--border-strong); } /* hover-only: focus has its own bar */
  /* Focus: a 3px accent bar over the hit area, as loud as the ring elsewhere
     (a ring around a 1px line would just be noise). */
  .splitter:focus-visible { outline: none; }
  .splitter:focus-visible::before { content: ""; position: absolute; background: var(--focus-ring-color); pointer-events: none; }
  .splitter.x:focus-visible::before { inset: 0 -1px; }
  .splitter.y:focus-visible::before { inset: -1px 0; }
</style>
