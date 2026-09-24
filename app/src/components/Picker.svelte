<script lang="ts">
  // A small text button that opens an upward menu of an agent's option choices.
  import type { ConfigOption } from "../bindings";

  let {
    option,
    onchange,
    align = "left",
    disabled = false,
  }: { option: ConfigOption; onchange: (value: string) => void; align?: "left" | "right"; disabled?: boolean } = $props();

  let open = $state(false);
  let hover = $state(0);
  let root: HTMLDivElement | undefined = $state();

  const current = $derived(option.choices.find((c) => c.value === option.current));
  const label = $derived(current?.name ?? option.current);

  function toggle() {
    if (disabled) return;
    open = !open;
    hover = Math.max(0, option.choices.findIndex((c) => c.value === option.current));
  }

  function choose(value: string) {
    open = false;
    if (value !== option.current) onchange(value);
  }

  function onkeydown(e: KeyboardEvent) {
    if (!open) return;
    if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); open = false; }
    else if (e.key === "ArrowDown") { e.preventDefault(); hover = (hover + 1) % option.choices.length; }
    else if (e.key === "ArrowUp") { e.preventDefault(); hover = (hover - 1 + option.choices.length) % option.choices.length; }
    else if (e.key === "Enter") { e.preventDefault(); choose(option.choices[hover].value); }
  }

  function onpointerdown(e: PointerEvent) {
    if (open && root && !root.contains(e.target as Node)) open = false;
  }
</script>

<svelte:window {onkeydown} {onpointerdown} />

<div class="picker" bind:this={root}>
  <button class="plain trigger" class:open {disabled} onclick={toggle} title={option.name}>
    <span class="label">{label}</span>
    <svg class="chev" width="8" height="8" viewBox="0 0 8 8"><path d="M1.5 3 4 5.5 6.5 3" fill="none" stroke="currentColor" stroke-width="1.2" /></svg>
  </button>
  {#if open}
    <div class="menu {align}" role="listbox" aria-label={option.name}>
      <div class="menu-title">{option.name}</div>
      {#each option.choices as c, i (c.value)}
        <button class="plain item" class:hover={i === hover} role="option" aria-selected={c.value === option.current}
          onmouseenter={() => (hover = i)} onclick={() => choose(c.value)}>
          <span class="check">{c.value === option.current ? "✓" : ""}</span>
          <span class="text">
            <span class="name">{c.name}</span>
            {#if c.description}<span class="desc">{c.description}</span>{/if}
          </span>
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .picker { position: relative; flex: none; }
  .trigger {
    display: inline-flex; align-items: center; gap: 4px;
    height: 22px; padding: 0 6px; border-radius: var(--radius-sm); font-size: 12px; color: var(--muted); white-space: nowrap; max-width: 200px;
  }
  .trigger:hover:not(:disabled), .trigger.open { color: var(--text); background: var(--hover); }
  .trigger:disabled { cursor: default; opacity: 0.5; }
  .label { overflow: hidden; text-overflow: ellipsis; }
  .chev { opacity: 0; transition: opacity 0.1s; flex: none; }
  .trigger:hover .chev, .trigger.open .chev { opacity: 0.8; }
  .menu {
    position: absolute; bottom: calc(100% + 6px); z-index: 30; min-width: 220px; max-width: 340px; max-height: 360px; overflow: auto;
    background: var(--surface); border: 1px solid var(--border-strong); border-radius: 8px; padding: 4px;
    box-shadow: var(--shadow-pop);
  }
  .menu.left { left: 0; }
  .menu.right { right: 0; }
  .menu-title { padding: 4px 8px 6px; font-size: 11px; color: var(--muted); }
  .item { display: flex; gap: 8px; width: 100%; padding: 6px 8px; border-radius: var(--radius-sm); }
  .item.hover { background: var(--hover); }
  .check { width: 12px; flex: none; color: var(--accent); font-size: 12px; }
  .text { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
  .name { font-size: 12.5px; color: var(--text); }
  .desc { font-size: 11.5px; color: var(--muted); line-height: 1.35; }
</style>
