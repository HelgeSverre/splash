<script lang="ts">
  // A drag handle: reports pixel deltas along its axis.
  let { axis, onmove, onend }: { axis: "x" | "y"; onmove: (delta: number) => void; onend?: () => void } = $props();
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
</script>

<div class="splitter {axis}" class:dragging role="separator" aria-orientation={axis === "x" ? "vertical" : "horizontal"} onpointerdown={down}></div>

<style>
  .splitter { position: relative; z-index: 4; flex: none; }
  .splitter.x { width: 1px; cursor: col-resize; background: var(--border); }
  .splitter.y { height: 1px; cursor: row-resize; background: var(--border); }
  .splitter::after { content: ""; position: absolute; }
  .splitter.x::after { inset: 0 -3px; }
  .splitter.y::after { inset: -3px 0; }
  .splitter:hover, .splitter.dragging { background: var(--accent); }
</style>
