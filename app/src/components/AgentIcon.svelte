<script lang="ts">
  import claude from "../assets/agents/claude.svg?raw";
  import codex from "../assets/agents/codex.svg?raw";
  import glue from "../assets/agents/glue.svg?raw";
  import pi from "../assets/agents/pi.svg?raw";
  import pool from "../assets/agents/pool.svg?raw";
  import copilot from "../assets/agents/copilot.svg?raw";
  import junie from "../assets/agents/junie.svg?raw";
  import opencode from "../assets/agents/opencode.svg?raw";

  const icons: Record<string, string> = { claude, codex, glue, pi, pool, copilot, junie, opencode };
  let { id, size = 14 }: { id: string; size?: number } = $props();
</script>

<span class="icon" class:glue={id === "glue"} style:width="{size}px" style:height="{size}px" aria-hidden="true">
  {@html icons[id] ?? ""}
</span>

<style>
  .icon { display: inline-flex; flex: none; color: var(--text-2); }
  .icon.glue { color: var(--accent); }
  .icon :global(svg) { width: 100%; height: 100%; }
</style>
