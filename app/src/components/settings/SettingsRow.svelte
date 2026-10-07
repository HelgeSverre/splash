<script lang="ts">
  // One row of a SettingsGroup: a label (with a quieter description under it)
  // on the left; a read-only value, and any controls, on the right.
  // With `onclick`, the row minus its controls is one button that opens
  // something; `trail` sits inside that button (a badge, a chevron),
  // `children` outside it (a Reveal button, a switch). `data-*` attributes
  // go on the row.
  import type { Snippet } from "svelte";
  import type { DataAttrs } from "../../lib/attrs";

  let {
    label,
    labelId,
    desc,
    value,
    valueTitle,
    mono = false,
    path = false,
    onclick,
    lead,
    trail,
    children,
    ...rest
  }: {
    /** Plain text, or a snippet for a name with tags after it. */
    label: string | Snippet;
    /** For a control that names itself with aria-labelledby. */
    labelId?: string;
    desc?: string | Snippet | null;
    value?: string | null;
    /** The value's tooltip, when the value is shortened (a ~ path). */
    valueTitle?: string | null;
    /** The value is a path, a command or a version. */
    mono?: boolean;
    /** The value is a path: mono, cut at the front so its tail shows. */
    path?: boolean;
    onclick?: () => void;
    lead?: Snippet;
    trail?: Snippet;
    children?: Snippet;
  } & DataAttrs = $props();
</script>

{#snippet main()}
  {#if lead}{@render lead()}{/if}
  <div class="text">
    {#if typeof label === "string"}<div class="label" id={labelId}>{label}</div>{:else}<div class="label named" id={labelId}>{@render label()}</div>{/if}
    {#if desc}<div class="desc">{#if typeof desc === "string"}{desc}{:else}{@render desc()}{/if}</div>{/if}
  </div>
  {#if value}<span class="value" data-testid="settings-value" class:mono={mono || path} class:path title={valueTitle ?? value}>{#if path}<bdi>{value}</bdi>{:else}{value}{/if}</span>{/if}
  {#if trail}{@render trail()}{/if}
{/snippet}

<div {...rest} class="set-row row" class:link={!!onclick}>
  {#if onclick}
    <button class="plain main focus-inset" data-testid="settings-row-open" {onclick}>{@render main()}</button>
  {:else}
    {@render main()}
  {/if}
  {#if children}<span class="controls">{@render children()}</span>{/if}
</div>

<style>
  .row { display: flex; align-items: center; gap: 16px; padding: 12px 14px; min-width: 0; }
  .text { flex: 1; min-width: 0; }
  /* The label carries its weight itself, whatever the markup around it. */
  .label { font-weight: var(--fw-medium); }
  .named { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
  .desc { margin-top: 2px; font-size: var(--fs-sm); font-weight: var(--fw-regular); color: var(--muted); }
  .desc:empty { display: none; }
  /* Prose values in Inter; `mono` for paths, commands and versions. */
  .value { min-width: 0; max-width: 55%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: var(--fs-sm); color: var(--text-2); }
  .value.mono { font-family: var(--font-mono); }
  /* Right to left puts the ellipsis at the front; <bdi> keeps the path reading left to right. */
  .value.path { max-width: 45%; direction: rtl; text-align: left; }
  .controls { display: flex; align-items: center; gap: 8px; flex: none; }

  /* A row that opens something: the button fills it, the controls keep the gutter. */
  .link { padding: 0; gap: 0; }
  .main {
    display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0; align-self: stretch;
    padding: 12px 14px; text-align: left; border-radius: inherit;
  }
  .link .controls { padding-right: 14px; }
  .link:has(> .main:is(:hover, :focus-visible)) { background: var(--row-hover); }
  @container (max-width: 460px) {
    .row, .main { flex-wrap: wrap; gap: 8px; }
    .value, .value.path { max-width: 100%; }
    .row > .value, .main > .value { flex-basis: 100%; }
  }
</style>
