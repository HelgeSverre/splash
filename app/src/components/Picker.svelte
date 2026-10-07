<script lang="ts">
  // A small text button that opens an upward menu of an agent's option choices.
  import { tick } from "svelte";
  import Chevron from "./ui/Chevron.svelte";
  import MenuItem from "./ui/MenuItem.svelte";
  import { rovingIndex } from "../lib/focus";
  import type { ConfigOption } from "../bindings";

  let {
    option,
    onchange,
    align = "left",
    disabled = false,
  }: { option: ConfigOption; onchange: (value: string) => void; align?: "left" | "right"; disabled?: boolean } = $props();

  let open = $state(false);
  let root: HTMLDivElement | undefined = $state();
  let trigger: HTMLButtonElement | undefined = $state();
  let menu: HTMLDivElement | undefined = $state();

  const current = $derived(option.choices.find((c) => c.value === option.current));
  const label = $derived(current?.name ?? option.current);
  const uid = $props.id();
  const menuId = `picker-${uid}`;

  const items = () => Array.from(menu?.querySelectorAll<HTMLElement>("[role=option]") ?? []);

  async function show() {
    if (disabled) return;
    open = true;
    await tick();
    const i = Math.max(0, option.choices.findIndex((c) => c.value === option.current));
    items()[i]?.focus();
  }

  function hide(refocus = true) {
    open = false;
    if (refocus) trigger?.focus();
  }

  function choose(value: string) {
    hide();
    if (value !== option.current) onchange(value);
  }

  // Real focus moves through the items, so the ring and the highlight agree.
  function onmenukey(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      return hide();
    }
    // Back to the trigger first, so Tab moves on from there (the menu is about to go).
    if (e.key === "Tab") return hide();
    const list = items();
    const next = rovingIndex(e, list.indexOf(document.activeElement as HTMLElement), list.length, "vertical");
    if (next === null) return;
    e.preventDefault();
    list[next].focus();
  }

  function ontriggerkey(e: KeyboardEvent) {
    if (!open && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
      e.preventDefault();
      show();
    }
  }

  function onfocusout(e: FocusEvent) {
    if (open && root && !root.contains(e.relatedTarget as Node | null)) open = false;
  }

  function onpointerdown(e: PointerEvent) {
    if (open && root && !root.contains(e.target as Node)) open = false;
  }
</script>

<svelte:window {onpointerdown} />

<div class="picker" bind:this={root} {onfocusout}>
  <button class="plain trigger" data-testid="option-picker" data-option={option.id} class:open {disabled} bind:this={trigger} onclick={() => (open ? hide() : show())} onkeydown={ontriggerkey}
    title={option.name} aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? menuId : undefined}>
    <span class="label">{label}</span>
    <span class="chev"><Chevron down /></span>
  </button>
  {#if open}
    <div class="menu popover {align}" data-testid="option-menu" id={menuId} role="listbox" aria-label={option.name} tabindex="-1" bind:this={menu} onkeydown={onmenukey}>
      <div class="menu-title t-section">{option.name}</div>
      {#each option.choices as c (c.value)}
        <MenuItem data-testid="option-choice" data-value={c.value} role="option" aria-selected={c.value === option.current} name={c.name} description={c.description} checked={c.value === option.current}
          onmouseenter={(e) => e.currentTarget.focus({ preventScroll: true })} onclick={() => choose(c.value)} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .picker { position: relative; flex: none; }
  .trigger {
    display: inline-flex; align-items: center; gap: 4px;
    height: var(--control-h-xs); padding: 0 6px; border-radius: var(--radius-sm); font-size: var(--fs-sm); color: var(--muted); white-space: nowrap; max-width: 200px;
  }
  .trigger:is(:hover, :focus-visible):not(:disabled), .trigger.open { color: var(--text); background: var(--hover); }
  .trigger:disabled { cursor: default; opacity: 0.5; }
  .label { overflow: hidden; text-overflow: ellipsis; }
  .chev { display: inline-grid; opacity: 0; transition: opacity 0.1s; flex: none; }
  .trigger:is(:hover, :focus-visible) .chev, .trigger.open .chev { opacity: 1; }
  .menu { position: absolute; bottom: calc(100% + 6px); z-index: 30; min-width: 220px; max-width: 340px; max-height: 360px; overflow: auto; }
  .menu.left { left: 0; }
  .menu.right { right: 0; }
  .menu-title { padding: 4px 8px 6px; }
</style>
