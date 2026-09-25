<script lang="ts" generics="T extends string">
  // A small one-of-n switch (Unified / Split). A radio group: one Tab stop,
  // the arrow keys move and select.
  import { radioKeydown } from "../../lib/focus";

  type Option = { value: T; label: string; title?: string; disabled?: boolean };
  let {
    options,
    value,
    onchange,
    label,
  }: { options: Option[]; value: T; onchange: (value: T) => void; label: string } = $props();

  let root: HTMLDivElement | undefined = $state();
  const selected = $derived(Math.max(0, options.findIndex((o) => o.value === value)));

  const onkeydown = (e: KeyboardEvent, i: number) =>
    radioKeydown(e, i, options.length, (j) => !!options[j].disabled, (j) => onchange(options[j].value), root);
</script>

<div class="seg" role="radiogroup" aria-label={label} bind:this={root}>
  {#each options as o, i (o.value)}
    <button class="plain" role="radio" aria-checked={o.value === value} tabindex={i === selected ? 0 : -1}
      disabled={o.disabled} title={o.title} onclick={() => onchange(o.value)} onkeydown={(e) => onkeydown(e, i)}>{o.label}</button>
  {/each}
</div>

<style>
  .seg { display: inline-flex; flex: none; gap: 1px; height: var(--control-h-sm); padding: 1px; border: 1px solid var(--border); border-radius: var(--radius); }
  .seg > button { display: inline-flex; align-items: center; padding: 0 9px; font-size: var(--fs-sm); font-weight: var(--fw-medium); color: var(--muted); border-radius: var(--radius-sm); }
  .seg > button:is(:hover, :focus-visible):not(:disabled) { color: var(--text); }
  .seg > button:is(:hover, :focus-visible):not([aria-checked="true"]):not(:disabled) { background: var(--hover); }
  /* The pick: the soft accent, as for a checkbox, a switch or a choice card. */
  .seg > button[aria-checked="true"] { background: var(--accent-soft); box-shadow: inset 0 0 0 1px var(--accent-border); color: var(--text); }
  .seg > button:disabled { opacity: 0.45; cursor: default; }
</style>
