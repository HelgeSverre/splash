<script lang="ts">
  import SplashMark from "./SplashMark.svelte";
  import Kbd from "./Kbd.svelte";
  import { shortcut } from "../lib/keybindings.svelte";
  import { app } from "../lib/sessions.svelte";
  import { openSettings } from "../lib/customize.svelte";
  const ready = $derived(app.agents.filter((a) => a.installed && a.auth !== "logged_out"));
</script>

<div class="welcome">
  <SplashMark size={44} />
  <h1>Splash</h1>
  <p>Run coding agents side by side. Each gets its own session, in place or in a worktree.</p>
  <div class="actions">
    <button class="btn primary" onclick={() => (app.newSession = {})}>New session</button>
    <button class="btn" onclick={() => openSettings("agents")}>Agents · {ready.length} ready</button>
  </div>
  <dl class="keys">
    {#each [["session.new", "New session"], ["session.go1", "Go to session 1, 2, …"], ["app.palette", "Command palette"], ["session.stop", "Stop the agent"], ["view.terminal", "Terminal"], ["view.right", "Changes, files & details"], ["app.settings", "Settings"]] as [id, label] (id)}
      {#if shortcut(id)}<dt><Kbd keys={shortcut(id)} /></dt><dd>{label}</dd>{/if}
    {/each}
  </dl>
</div>

<style>
  .welcome { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 24px; text-align: center; }
  h1 { margin: 6px 0 0; font: var(--fw-semibold) var(--fs-xl) var(--font-mono); letter-spacing: var(--tracking-brand); }
  p { margin: 0; color: var(--text-2); max-width: 46ch; }
  .actions { display: flex; gap: 8px; margin-top: 12px; }
  .keys { display: grid; grid-template-columns: auto auto; align-items: center; gap: 8px 12px; margin-top: 28px; font-size: var(--fs-sm); }
  dt { display: flex; justify-content: flex-end; }
  dd { margin: 0; color: var(--muted); text-align: left; }
</style>
