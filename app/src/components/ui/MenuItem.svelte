<script lang="ts">
  // One row in a .popover menu: an optional check, a name and a quieter
  // description (stacked, or beside it with `inline`). `active` marks the row
  // the keyboard is on when focus stays elsewhere (the slash list).
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import Icon from "../Icon.svelte";

  let {
    name,
    description,
    mono = false,
    inline = false,
    active = false,
    checked,
    children,
    ...rest
  }: {
    name: string;
    description?: string | null;
    mono?: boolean;
    inline?: boolean;
    active?: boolean;
    /** Show a check column; true draws the check. */
    checked?: boolean;
    children?: Snippet;
  } & HTMLButtonAttributes = $props();
</script>

<button class="plain item focus-inset" class:active class:inline tabindex="-1" {...rest}>
  {#if checked !== undefined}<span class="check">{#if checked}<Icon name="check" size={12} />{/if}</span>{/if}
  <span class="text">
    <span class="name t-item-name" class:mono>{name}</span>
    {#if description}<span class="desc t-item-desc">{description}</span>{/if}
  </span>
  {#if children}{@render children()}{/if}
</button>

<style>
  .item { display: flex; gap: 8px; width: 100%; padding: 6px 8px; border-radius: var(--radius-sm); }
  .item:is(:hover, :focus, .active) { background: var(--row-hover); }
  /* Mouse focus follows the pointer: only the keyboard gets the ring. */
  .item:focus:not(:focus-visible) { outline: none; }
  .check { width: 12px; flex: none; display: inline-grid; place-items: center; height: 18px; color: var(--accent); }
  .text { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
  .inline .text { flex-direction: row; align-items: baseline; gap: 12px; }
  .inline .name { flex: none; }
  .inline .desc { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  /* Accent marks the picked row only; the list itself stays quiet. */
  .active .name.mono { color: var(--accent); }
</style>
