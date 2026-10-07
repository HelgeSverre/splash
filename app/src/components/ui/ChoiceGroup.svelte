<script lang="ts" generics="T">
  import type { DataAttrs } from "../../lib/attrs";
  // One-of-n, drawn as cards (the .choice look): a project, an agent, where a
  // session works. A radio group: one Tab stop, the arrow keys move and pick.
  // `layout` lays the cards out; `variant` shapes each one ("stack" puts a
  // title over a description, "icon" is a square holding just an icon).
  import type { Snippet } from "svelte";
  import { radioKeydown } from "../../lib/focus";

  let {
    items,
    value,
    key,
    onchange,
    disabled = () => false,
    title,
    label,
    labelledby,
    layout = "list",
    variant = "row",
    item,
    empty,
    ...rest
  }: {
    items: T[];
    /** The key of the picked item. */
    value: string;
    key: (item: T) => string;
    onchange: (item: T) => void;
    disabled?: (item: T) => boolean;
    /** Each card's tooltip; an icon card's accessible name too. */
    title?: (item: T) => string | undefined;
    label?: string;
    labelledby?: string;
    layout?: "list" | "grid" | "row";
    variant?: "row" | "stack" | "icon";
    item: Snippet<[T]>;
    /** Shown while there's nothing to pick. */
    empty?: Snippet;
  } & DataAttrs = $props();

  let root: HTMLDivElement | undefined = $state();
  const picked = $derived(items.findIndex((x) => key(x) === value));
  // The Tab stop: the picked card if it can take focus, else the first one
  // that can. A disabled stop would drop the whole group out of the Tab order.
  const stop = $derived(picked >= 0 && !disabled(items[picked]) ? picked : items.findIndex((x) => !disabled(x)));

  const onkeydown = (e: KeyboardEvent, i: number) =>
    radioKeydown(e, i, items.length, (j) => disabled(items[j]), (j) => onchange(items[j]), root);
</script>

<div {...rest} class="choices is-{layout}" role="radiogroup" aria-label={label} aria-labelledby={labelledby} bind:this={root}>
  {#each items as it, i (key(it))}
    <button data-testid="choice" data-value={key(it)} class="plain choice {variant}" class:on={i === picked} role="radio" aria-checked={i === picked}
      title={title?.(it)} aria-label={variant === "icon" ? title?.(it) : undefined}
      disabled={disabled(it)} tabindex={i === stop ? 0 : -1}
      onclick={() => onchange(it)} onkeydown={(e) => onkeydown(e, i)}>{@render item(it)}</button>
  {:else}
    {#if empty}{@render empty()}{/if}
  {/each}
</div>

<style>
  .is-list { display: flex; flex-direction: column; gap: 4px; }
  .is-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 6px; }
  .is-row { display: flex; flex-wrap: wrap; gap: 4px; }
  .stack { flex-direction: column; align-items: flex-start; gap: 2px; }
  .icon { width: var(--control-h); height: var(--control-h); padding: 0; justify-content: center; }
</style>
