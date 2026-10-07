<script lang="ts">
  // Shows an action's shortcut; click it, press a new combo to rebind.
  // Esc cancels, ⌫ removes the shortcut, a clash asks before taking it over.
  import { onDestroy, tick } from "svelte";
  import type { DataAttrs } from "../../lib/attrs";
  import Kbd from "../Kbd.svelte";
  import {
    ACTIONS,
    bindings,
    comboFromEvent,
    conflict,
    format,
    isCustom,
    isUsable,
    keys,
    setBindings,
  } from "../../lib/keybindings.svelte";

  let { id, ...rest }: { id: string } & DataAttrs = $props();
  let recording = $state(false);
  let hint = $state("");
  let clash: { combo: string; other: string; otherTitle: string } | null = $state(null);
  let root: HTMLSpanElement | undefined = $state();
  let keysBtn: HTMLButtonElement | undefined = $state();
  let useBtn: HTMLButtonElement | undefined = $state();

  const current = $derived(bindings(id));
  const custom = $derived(isCustom(id));
  const defaults = $derived(ACTIONS.find((a) => a.id === id)?.defaults ?? []);

  function start() {
    recording = true;
    keys.recording = true;
    hint = "";
    clash = null;
    // WebKit doesn't focus a clicked button: focus it, so a blur (clicking or
    // tabbing away) ends the recording there too.
    keysBtn?.focus();
    window.addEventListener("pointerdown", onpointerdown, true);
  }

  function stop() {
    recording = false;
    keys.recording = false;
    window.removeEventListener("pointerdown", onpointerdown, true);
  }

  // A click anywhere else ends the recording, whether or not focus moved.
  function onpointerdown(e: PointerEvent) {
    if (!root?.contains(e.target as Node)) stop();
  }

  // The clash prompt swaps the key button out for its own two buttons, and
  // back: keep focus on whichever is showing, never on <body>.
  async function showClash(c: NonNullable<typeof clash>) {
    const had = root?.contains(document.activeElement);
    clash = c;
    await tick();
    if (had) useBtn?.focus();
  }

  async function endClash() {
    const had = root?.contains(document.activeElement);
    clash = null;
    await tick();
    if (had || document.activeElement === document.body) keysBtn?.focus();
  }

  // Never leave the app's shortcuts switched off: leaving the page, closing
  // Settings or clicking away all end the recording.
  onDestroy(() => {
    if (recording) stop();
  });

  function onkeydown(e: KeyboardEvent) {
    if (!recording) return;
    // Tab moves on, as it does everywhere else.
    if (e.key === "Tab" && !e.metaKey && !e.ctrlKey && !e.altKey) return stop();
    e.preventDefault();
    e.stopPropagation();
    const combo = comboFromEvent(e);
    if (!combo) return; // a lone modifier: keep waiting
    if (combo === "Escape") return stop();
    if (combo === "Backspace" || combo === "Delete") {
      setBindings(id, []);
      return stop();
    }
    if (!isUsable(combo)) {
      hint = "Add ⌘, ⌥ or ⌃";
      return;
    }
    const other = conflict(combo, id);
    stop();
    if (other) showClash({ combo, other: other.id, otherTitle: other.title });
    else setBindings(id, [combo]);
  }

  async function takeOver() {
    if (!clash) return;
    const { combo, other } = clash;
    await setBindings(other, bindings(other).filter((c) => c !== combo));
    await setBindings(id, [combo]);
    await endClash();
  }
</script>

<svelte:window onkeydowncapture={onkeydown} />

<span {...rest} class="rec" bind:this={root}>
  {#if clash}
    <span class="clash" data-testid="shortcut-clash">{format(clash.combo)} is used by “{clash.otherTitle}”</span>
    <button class="btn sm" data-testid="shortcut-use-here" bind:this={useBtn} onclick={takeOver}>Use here</button>
    <button class="btn sm ghost" data-testid="shortcut-cancel" onclick={endClash}>Cancel</button>
  {:else}
    {#if hint}<span class="hint" data-testid="shortcut-hint">{hint}</span>{/if}
    {#if custom}
      <button class="plain reset" data-testid="shortcut-reset" title="Back to {defaults.map(format).join(' or ') || 'none'}" onclick={() => setBindings(id, defaults)}>reset</button>
    {/if}
    <button class="plain keys" data-testid="shortcut-keys" class:recording aria-pressed={recording} bind:this={keysBtn} onclick={() => (recording ? stop() : start())}
      onblur={() => recording && stop()}
      title={recording ? "Press a shortcut. Esc cancels, ⌫ clears." : "Click to change"}>
      {#if recording}
        <span class="press">Press keys…</span>
      {:else if current.length}
        {#each current as c, i (c)}{#if i > 0}<span class="or">or</span>{/if}<Kbd keys={format(c)} />{/each}
      {:else}
        <span class="none">none</span>
      {/if}
    </button>
  {/if}
</span>

<style>
  .rec { display: inline-flex; align-items: center; gap: 8px; flex: none; }
  .keys { display: inline-flex; align-items: center; gap: 6px; height: var(--control-h-sm); padding: 0 6px; border-radius: var(--radius); border: 1px solid transparent; }
  .keys:is(:hover, :focus-visible) { border-color: var(--border); background: var(--soft); }
  .keys.recording { border-color: var(--accent-border); background: var(--accent-soft); }
  /* Recording already draws the accent: don't stack the ring on top of it. */
  .keys.recording:focus-visible { outline-color: transparent; }
  .press { font-size: var(--fs-sm); color: var(--accent); padding: 0 4px; }
  .none { font-size: var(--fs-sm); color: var(--muted); padding: 0 4px; }
  .or { font-size: var(--fs-xs); color: var(--muted); }
  .reset { font-size: var(--fs-xs); color: var(--muted); }
  .reset:is(:hover, :focus-visible) { color: var(--text); }
  .hint { font-size: var(--fs-xs); color: var(--warn-dim); }
  .clash { font-size: var(--fs-sm); color: var(--warn-dim); }
</style>
