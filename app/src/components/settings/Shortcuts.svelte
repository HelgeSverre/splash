<script lang="ts">
  import { serverMode } from "../../lib/server.svelte";
  import { appleClient } from "../../lib/platform";
  import Kbd from "../Kbd.svelte";
  import KeyRecorder from "../ui/KeyRecorder.svelte";
  import PageHeader from "./PageHeader.svelte";
  import SettingsGroup from "./SettingsGroup.svelte";
  import SettingsRow from "./SettingsRow.svelte";
  import { ACTIONS, resetAll } from "../../lib/keybindings.svelte";
  import { prefs } from "../../lib/prefs.svelte";

  const groups = [...new Set(ACTIONS.map((a) => a.group))];
  const anyCustom = $derived((prefs.keybindings ?? "{}") !== "{}");
  // Keys that only mean something in one place: shown, not rebindable.
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
  <PageHeader title="Keyboard shortcuts">
    {#snippet actions()}{#if anyCustom}<button class="btn sm ghost" data-testid="settings-reset-shortcuts" onclick={resetAll}>Reset all</button>{/if}{/snippet}
    {#snippet lede()}Click a shortcut to change it. Defaults follow {appleClient ? "macOS" : "Windows and Linux"} conventions{serverMode ? " and avoid browser navigation shortcuts" : ""}.{/snippet}
  </PageHeader>

  {#each groups as g (g)}
    <SettingsGroup title={g} dense>
      {#each ACTIONS.filter((a) => a.group === g) as a (a.id)}
        <SettingsRow label={a.title}><KeyRecorder data-testid="settings-shortcut" data-action={a.id} id={a.id} /></SettingsRow>
      {/each}
    </SettingsGroup>
  {/each}

  <SettingsGroup title="In context" dense>
    {#each contextual as [keys, label] (label)}
      <SettingsRow {label}><Kbd {keys} /></SettingsRow>
    {/each}
  </SettingsGroup>
</div>
