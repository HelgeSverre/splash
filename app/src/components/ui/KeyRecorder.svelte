<script lang="ts">
  // Shows an action's shortcut; click it, press a new combo to rebind.
  // Esc cancels, ⌫ removes the shortcut, a clash asks before taking it over.
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

  let { id }: { id: string } = $props();
  let recording = $state(false);
  let hint = $state("");
  let clash: { combo: string; other: string; otherTitle: string } | null = $state(null);

  const current = $derived(bindings(id));
  const custom = $derived(isCustom(id));
  const defaults = $derived(ACTIONS.find((a) => a.id === id)?.defaults ?? []);

  function start() {
    recording = true;
    keys.recording = true;
    hint = "";
    clash = null;
  }

  function stop() {
    recording = false;
    keys.recording = false;
  }

  function onkeydown(e: KeyboardEvent) {
    if (!recording) return;
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
      hint = "Add ⌘, ⌥ or ⌃ — plain keys are for typing";
      return;
    }
    const other = conflict(combo, id);
    stop();
    if (other) clash = { combo, other: other.id, otherTitle: other.title };
    else setBindings(id, [combo]);
  }

  async function takeOver() {
    if (!clash) return;
    await setBindings(clash.other, bindings(clash.other).filter((c) => c !== clash!.combo));
    await setBindings(id, [clash.combo]);
    clash = null;
  }
</script>

<svelte:window onkeydowncapture={onkeydown} />

<span class="rec">
  {#if clash}
    <span class="clash">{format(clash.combo)} is used by “{clash.otherTitle}”</span>
    <button class="btn sm" onclick={takeOver}>Use here</button>
    <button class="btn sm ghost" onclick={() => (clash = null)}>Cancel</button>
  {:else}
    {#if hint}<span class="hint">{hint}</span>{/if}
    {#if custom}
      <button class="plain reset" title="Back to {defaults.map(format).join(' or ') || 'none'}" onclick={() => setBindings(id, defaults)}>reset</button>
    {/if}
    <button class="plain keys" class:recording onclick={() => (recording ? stop() : start())}
      title={recording ? "Press the new shortcut — Esc cancels, ⌫ removes" : "Click to change"}>
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
  .keys { display: inline-flex; align-items: center; gap: 6px; min-height: 26px; padding: 2px 6px; border-radius: var(--radius); border: 1px solid transparent; }
  .keys:hover { border-color: var(--border); background: var(--soft); }
  .keys.recording { border-color: var(--accent-border); background: var(--accent-soft); }
  .press { font-size: 12px; color: var(--accent); padding: 0 4px; }
  .none { font-size: 12px; color: var(--faint); padding: 0 4px; }
  .or { font-size: 11px; color: var(--faint); }
  .reset { font-size: 11.5px; color: var(--muted); }
  .reset:hover { color: var(--text); }
  .hint { font-size: 11.5px; color: var(--warn-dim); }
  .clash { font-size: 12px; color: var(--warn-dim); }
</style>
