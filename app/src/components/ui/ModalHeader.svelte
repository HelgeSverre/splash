<script lang="ts">
  // The head row of a dialog: a title, extras after it, actions on the right,
  // then the close button.
  import type { Snippet } from "svelte";
  import ModalClose from "./ModalClose.svelte";

  let {
    title,
    onclose,
    icon,
    children,
    actions,
  }: { title: string; onclose: () => void; icon?: Snippet; children?: Snippet; actions?: Snippet } = $props();
</script>

<div class="head">
  {#if icon}{@render icon()}{/if}
  <h2 class="title t-pane-title">{title}</h2>
  {#if children}{@render children()}{/if}
  <span class="spacer"></span>
  {#if actions}{@render actions()}{/if}
  <ModalClose {onclose} />
</div>

<style>
  .head {
    display: flex; align-items: center; gap: 10px; flex: none; min-width: 0;
    height: var(--h-header); padding: 0 10px 0 18px; border-bottom: 1px solid var(--border);
  }
  .title { margin: 0; flex: 0 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
