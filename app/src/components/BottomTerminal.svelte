<script lang="ts">
  // The terminal under the session: a resizable pane holding the session's
  // shell, with a bar to restart or hide it.
  import TerminalPane, { focusTerminal } from "./TerminalPane.svelte";
  import Splitter from "./Splitter.svelte";
  import IconButton from "./ui/IconButton.svelte";
  import Toolbar from "./ui/Toolbar.svelte";
  import PathLabel from "./ui/PathLabel.svelte";
  import { api, type SessionView } from "../bindings";
  import { withKey } from "../lib/keybindings.svelte";
  import { layout, saveLayout, clamp, toggleBottom, TERMINAL_PANE } from "../lib/layout.svelte";

  let { session }: { session: SessionView } = $props();
  let el: HTMLDivElement | undefined = $state();

  function restartShell() {
    const id = session.id;
    const hadFocus = !!el?.contains(document.activeElement);
    api.term_close(id).then(() => {
      layout.bottomOpen = false;
      setTimeout(() => {
        layout.bottomOpen = true;
        if (hadFocus) setTimeout(() => focusTerminal(id), 50);
      }, 30);
    });
  }
</script>

<Splitter axis="y" label="Resize terminal" value={layout.bottom} min={100} max={window.innerHeight - 200} onmove={(d) => (layout.bottom = clamp(layout.bottom - d, 100, window.innerHeight - 200))} onend={saveLayout} />
<div class="bottom" id={TERMINAL_PANE} style:height="{layout.bottom}px" bind:this={el}>
  <Toolbar>
    <span class="bar-title">Terminal</span>
    <PathLabel path={session.cwd} muted />
    {#snippet end()}
      <span class="bar-actions">
        <IconButton title="Restart the shell" size="sm" icon="refresh" onclick={restartShell} />
        <IconButton title={withKey("Hide", "view.terminal")} label="Hide the terminal" size="sm" icon="close" onclick={toggleBottom} />
      </span>
    {/snippet}
  </Toolbar>
  <div class="bottom-body"><TerminalPane session={session.id} /></div>
</div>

<style>
  .bottom { flex: none; display: flex; flex-direction: column; min-height: 0; background: var(--term-bg); }
  .bar-title { flex: none; color: var(--text-2); }
  .bar-actions { display: flex; gap: 2px; margin-right: -6px; }
  .bottom-body { flex: 1; min-height: 0; position: relative; }
</style>
