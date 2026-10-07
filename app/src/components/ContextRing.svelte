<script lang="ts">
  import type { Usage, Status } from "../bindings";
  import { compact, usd } from "../lib/format";
  let { usage, status }: { usage: Usage | null; status: Status } = $props();

  const pct = $derived(usage && usage.size > 0 ? Math.min(1, usage.used / usage.size) : 0);
  const R = 6;
  const C = 2 * Math.PI * R;
  const title = $derived(
    usage && usage.size > 0
      ? `Context ${compact(usage.used)} of ${compact(usage.size)} tokens (${Math.round(pct * 100)}%)` +
          (usage.cost_usd ? ` · ${usd(usage.cost_usd)}` : "")
      : "Context usage appears after the first turn",
  );
  const tone = $derived(pct > 0.85 ? "err" : pct > 0.65 ? "warn" : status === "running" || status === "starting" ? "busy" : "ok");
</script>

<span class="ring {tone}" data-testid="context-ring" data-tone={tone} {title}>
  <svg width="16" height="16" viewBox="0 0 16 16">
    <circle cx="8" cy="8" r={R} class="track" />
    <circle cx="8" cy="8" r={R} class="arc" stroke-dasharray="{C * pct} {C}" transform="rotate(-90 8 8)" />
  </svg>
</span>

<style>
  .ring { display: inline-grid; place-items: center; width: 22px; height: 22px; flex: none; cursor: default; }
  circle { fill: none; stroke-width: 2; }
  .track { stroke: var(--border-strong); }
  .arc { stroke: var(--text-2); stroke-linecap: round; transition: stroke-dasharray 0.3s; }
  .busy .arc { stroke: var(--accent); }
  .warn .arc { stroke: var(--warn); }
  .err .arc { stroke: var(--err); }
</style>
