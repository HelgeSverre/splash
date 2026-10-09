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
  let parentHeight = $state(0);

  // Keep the saved preference intact while a smaller window temporarily caps
  // the rendered pane. Its parent is the actual workbench area, so this also
  // accounts for the web connection banner instead of assuming the viewport
  // is entirely available to the session.
  const MIN_TERMINAL_HEIGHT = 100;
  const MIN_WORKBENCH_HEIGHT = 400;
  const maxHeight = $derived(Math.max(MIN_TERMINAL_HEIGHT, parentHeight - MIN_WORKBENCH_HEIGHT));
  const bottomHeight = $derived(clamp(layout.bottom, MIN_TERMINAL_HEIGHT, maxHeight));

  function resizeTerminal(delta: number) {
    layout.bottom = clamp(bottomHeight - delta, MIN_TERMINAL_HEIGHT, maxHeight);
  }

  $effect(() => {
    const parent = el?.parentElement;
    if (!parent) return;
    const update = () => (parentHeight = parent.clientHeight);
    const observer = new ResizeObserver(update);
    observer.observe(parent);
    update();
    return () => observer.disconnect();
  });

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


<Splitter axis="y" label="Resize terminal" value={bottomHeight} min={MIN_TERMINAL_HEIGHT} max={maxHeight} onmove={resizeTerminal} onend={saveLayout} />
<div class="bottom" data-testid="terminal" id={TERMINAL_PANE} style:height="{bottomHeight}px" bind:this={el}>
  <Toolbar>
    <span class="bar-title">Terminal</span>
    <PathLabel path={session.cwd} muted />
    {#snippet end()}
      <span class="bar-actions">
        <IconButton data-testid="terminal-restart" title="Restart the shell" size="sm" icon="refresh" onclick={restartShell} />
        <IconButton data-testid="terminal-hide" title={withKey("Hide", "view.terminal")} label="Hide the terminal" size="sm" icon="close" onclick={toggleBottom} />
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
