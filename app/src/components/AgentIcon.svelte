<script lang="ts">
  import claude from "../assets/agents/claude.svg?raw";
  import codex from "../assets/agents/codex.svg?raw";
  import glue from "../assets/agents/glue.svg?raw";
  import pi from "../assets/agents/pi.svg?raw";
  import pool from "../assets/agents/pool.svg?raw";
  import copilot from "../assets/agents/copilot.svg?raw";
  import junie from "../assets/agents/junie.svg?raw";
  import opencode from "../assets/agents/opencode.svg?raw";
  import letta from "../assets/agents/letta.svg?raw";
  import amp from "../assets/agents/amp.svg?raw";
  import autohand from "../assets/agents/autohand.svg?raw";
  import devin from "../assets/agents/devin.svg?raw";
  import dirac from "../assets/agents/dirac.svg?raw";
  import droid from "../assets/agents/droid.svg?raw";
  import gemini from "../assets/agents/gemini.svg?raw";
  import goose from "../assets/agents/goose.svg?raw";
  import hermes from "../assets/agents/hermes.svg?raw";
  import kimi from "../assets/agents/kimi.svg?raw";
  import openhands from "../assets/agents/openhands.svg?raw";
  import vibe from "../assets/agents/vibe.svg?raw";

  const icons: Record<string, string> = { claude, codex, glue, pi, pool, copilot, junie, opencode, letta,
    amp, autohand, devin, dirac, droid, gemini, goose, hermes, kimi, openhands, vibe,
  };
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
