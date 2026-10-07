<script lang="ts">
  import type { DataAttrs } from "../../lib/attrs";
  // A secondary bar under a tab bar or at the top of a pane (a diff, a file,
  // the log, the terminal). `side` is the side panel's: its gutter, and the
  // tab-bar height. Content after the `end` snippet is pushed to the right.
  import type { Snippet } from "svelte";
  let { side = false, children, end, ...rest }: { side?: boolean; children: Snippet; end?: Snippet } & DataAttrs = $props();
</script>

<div {...rest} class="toolbar" class:side>
  {@render children()}
  {#if end}<span class="spacer"></span>{@render end()}{/if}
</div>

<style>
  .toolbar {
    display: flex; align-items: center; gap: 10px; flex: none; min-width: 0;
    height: var(--h-toolbar); padding: 0 var(--gutter); border-bottom: 1px solid var(--border);
    font-size: var(--fs-sm); color: var(--text-2);
  }
  /* The side panel's bar sits under a header-tall tab bar: tab-bar height puts
     both its rules on the session header's and tab bar's. */
  .toolbar.side { height: var(--h-tabbar); padding: 0 var(--gutter-side); }
</style>
