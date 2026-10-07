<script lang="ts" module>
  export type TabItem = {
    id: string;
    label: string;
    /** A count badge after the label (hidden at 0). */
    count?: number;
    closable?: boolean;
    /** A short glyph before the label (± for a diff). */
    prefix?: string;
    title?: string;
    /** `data-*` attributes for the tab, such as what it shows (for the tests). */
    data?: Record<string, string>;
  };
</script>

<script lang="ts">
  import type { DataAttrs } from "../../lib/attrs";
  // A tab bar: one Tab stop, the arrow keys move and select, Delete closes a
  // closable tab. Tab `id`s become element ids `${prefix}-tab-${id}`, and each
  // tab controls `${prefix}-panel-${id}`: give the panel that id.
  import type { Snippet } from "svelte";
  import IconButton from "./IconButton.svelte";
  import Tag from "./Tag.svelte";
  import { rovingIndex } from "../../lib/focus";

  let {
    items,
    active,
    prefix,
    label,
    onselect,
    onclose,
    actions,
    size = "tabbar",
    ...rest
  }: {
    items: TabItem[];
    active: string;
    prefix: string;
    label: string;
    onselect: (id: string) => void;
    onclose?: (id: string) => void;
    /** Controls at the right end of the bar. */
    actions?: Snippet;
    /** "header" makes it --h-header tall, for a bar that tops a column and
        should line up with the session header next to it. */
    size?: "tabbar" | "header";
  } & DataAttrs = $props();

  let list: HTMLDivElement | undefined = $state();

  function focusAt(i: number) {
    queueMicrotask(() => list?.querySelectorAll<HTMLElement>("[role=tab]")[i]?.focus());
  }

  function onkeydown(e: KeyboardEvent, i: number) {
    const next = rovingIndex(e, i, items.length, "horizontal");
    if (next !== null) {
      e.preventDefault();
      onselect(items[next].id);
      focusAt(next);
    } else if ((e.key === "Delete" || e.key === "Backspace") && items[i].closable && onclose) {
      e.preventDefault();
      onclose(items[i].id);
      focusAt(Math.max(0, Math.min(i, items.length - 2)));
    }
  }

  const dataOf = (t: TabItem) => Object.fromEntries(Object.entries(t.data ?? {}).map(([k, v]) => [`data-${k}`, v]));
</script>

<div class="tabs" class:header={size === "header"}>
  <div {...rest} class="tablist" role="tablist" aria-label={label} bind:this={list}>
    {#each items as t, i (t.id)}
      <div class="tab" class:active={t.id === active}>
        <button {...dataOf(t)} data-testid="tab" data-tab={t.id} class="plain tab-btn" role="tab" id="{prefix}-tab-{t.id}" aria-selected={t.id === active} aria-controls="{prefix}-panel-{t.id}"
          tabindex={t.id === active ? 0 : -1} title={t.title} onclick={() => onselect(t.id)} onkeydown={(e) => onkeydown(e, i)}>
          {#if t.prefix}<span class="prefix">{t.prefix}</span>{/if}
          {t.label}
          {#if t.count}<Tag tone="count">{t.count}</Tag>{/if}
        </button>
        {#if t.closable && onclose}
          <IconButton {...dataOf(t)} data-testid="tab-close" class="close" size="sm" icon="close" title="Close" label="Close {t.label}" tabindex={-1} onclick={() => onclose(t.id)} />
        {/if}
      </div>
    {/each}
  </div>
  {#if actions}<span class="spacer"></span><span class="actions">{@render actions()}</span>{/if}
</div>

<style>
  /* Only the tab list scrolls: a scroller clips on both axes, and the
     actions' focus rings need the room. */
  .tabs {
    display: flex; align-items: stretch; flex: none; min-width: 0;
    height: var(--h-tabbar); padding: 0 8px; border-bottom: 1px solid var(--border);
  }
  .tabs.header { height: var(--h-header); }
  /* Hangs over the bar's bottom border, so the active underline covers it. */
  .tablist { display: flex; align-items: stretch; min-width: 0; margin-bottom: -1px; overflow-x: auto; scrollbar-width: none; }
  .tablist::-webkit-scrollbar { display: none; }
  .tab { display: flex; align-items: center; border-bottom: 2px solid transparent; }
  .tab.active { border-bottom-color: var(--accent); }
  .tab-btn {
    display: flex; align-items: center; gap: 6px; height: 100%; padding: 0 10px;
    font-size: var(--fs-sm); color: var(--muted); white-space: nowrap;
  }
  .tab.active .tab-btn, .tab-btn:is(:hover, :focus-visible) { color: var(--text); }
  .prefix { color: var(--muted); font-family: var(--font-mono); }
  .tab :global(.close) { margin-right: 2px; }
  .tab:not(:hover, :focus-within, .active) :global(.close) { opacity: 0.6; }
  .actions { display: flex; align-items: center; gap: 4px; flex: none; }
</style>
