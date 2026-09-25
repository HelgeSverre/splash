<script lang="ts">
  import SplashMark from "../SplashMark.svelte";
  import PageHeader from "./PageHeader.svelte";
  import SettingsGroup from "./SettingsGroup.svelte";
  import SettingsRow from "./SettingsRow.svelte";
  import { prefs } from "../../lib/prefs.svelte";
  import { home } from "../../lib/paths";
</script>

<div class="set-page">
  <PageHeader title="Splash">
    {#snippet icon()}<SplashMark size={20} />{/snippet}
    {#snippet lede()}A small harness for coding agents, all over the Agent Client Protocol.{/snippet}
  </PageHeader>
  <SettingsGroup>
    <SettingsRow label="Version" value="0.1.0" mono />
    <SettingsRow label="Built on" value="Elyra 0.8 · agent-client-protocol 2.2" />
    <SettingsRow label="Data" value={home(prefs.data_dir ?? "")} valueTitle={prefs.data_dir} path />
  </SettingsGroup>
</div>
