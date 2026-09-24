<script lang="ts">
  import Kbd from "../Kbd.svelte";
  import KeyRecorder from "../ui/KeyRecorder.svelte";
  import { ACTIONS, resetAll } from "../../lib/keybindings.svelte";
  import { prefs } from "../../lib/state.svelte";

  const groups = [...new Set(ACTIONS.map((a) => a.group))];
  const anyCustom = $derived((prefs.keybindings ?? "{}") !== "{}");
  // Keys that only mean something in one place — shown, not rebindable.
  const contextual = [
    ["⏎", "Send the message"],
    ["⇧ ⏎", "New line in the message"],
    ["/", "Slash commands (at the start of a message)"],
    ["⇥", "Complete a slash command"],
    ["1 … 9", "Answer a permission request"],
    ["Esc", "Close a dialog or menu"],
  ];
</script>

<div class="set-page">
  <div class="title-row">
    <h2>Keyboard shortcuts</h2>
    {#if anyCustom}<button class="btn sm ghost" onclick={resetAll}>Reset all</button>{/if}
  </div>
  <p class="lede">Click a shortcut and press a new one. Esc cancels, ⌫ removes it. Defaults follow VS Code where there's a convention.</p>

  {#each groups as g (g)}
    <div class="set-group-title">{g}</div>
    <div class="set-group">
      {#each ACTIONS.filter((a) => a.group === g) as a (a.id)}
        <div class="set-row"><div class="set-label">{a.title}</div><KeyRecorder id={a.id} /></div>
      {/each}
    </div>
  {/each}

  <div class="set-group-title">In context</div>
  <div class="set-group">
    {#each contextual as [keys, label] (label)}
      <div class="set-row"><div class="set-label">{label}</div><Kbd {keys} /></div>
    {/each}
  </div>
</div>

<style>
  .title-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
  .title-row h2 { margin: 0; }
  .set-row { padding-top: 7px; padding-bottom: 7px; }
</style>
