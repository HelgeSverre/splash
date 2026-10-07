<script lang="ts">
  import PageHeader from "./PageHeader.svelte";
  import SettingsGroup from "./SettingsGroup.svelte";
  import SettingsRow from "./SettingsRow.svelte";
  import { prefs } from "../../lib/prefs.svelte";
  import { home } from "../../lib/paths";
  import { api } from "../../bindings";
  import { load } from "../../lib/load.svelte";
  import { openExternal } from "../../lib/system";
  const info = load(() => api.app_info());
  const repository = "https://github.com/HelgeSverre/splash";
</script>

<div class="set-page">
  <PageHeader title="Splash">
    {#snippet icon()}<img class="app-icon" src="/icon.png" alt="" width="64" height="64" />{/snippet}
    {#snippet lede()}A cross-platform workspace for coding agents. Run sessions side by side, keep work in separate git worktrees, and stay in control of permissions.{/snippet}
  </PageHeader>
  <SettingsGroup>
    <SettingsRow label="Version" value={info.value?.version ?? (info.error || "Loading…")} mono />
    <SettingsRow label="Developed by" value={info.value?.author ?? "Helge Sverre"} onclick={() => openExternal("https://github.com/HelgeSverre")} />
    <SettingsRow label="License" value={info.value?.license ?? "MIT"} onclick={() => openExternal(`${repository}/blob/main/LICENSE`)} />
    <SettingsRow label="Built on" value="Elyra 0.8 · agent-client-protocol 2.2" />
    <SettingsRow label="Host" value={info.value ? `${info.value.host_os} · ${info.value.host_arch}` : "Loading…"} />
    <SettingsRow label="Terminal shell" value={info.value?.shell ?? "Loading…"} mono />
    <SettingsRow label="Data" value={home(prefs.data_dir ?? "")} valueTitle={prefs.data_dir} path />
  </SettingsGroup>
  <SettingsGroup title="Project">
    <SettingsRow label="Source code" value="GitHub" onclick={() => openExternal(info.value?.repository ?? repository)} />
    <SettingsRow label="Releases" desc="Download the latest version and read what changed." onclick={() => openExternal(`${repository}/releases`)} />
    <SettingsRow label="Report an issue" desc="Share a bug, an agent compatibility issue, or a feature request." onclick={() => openExternal(`${repository}/issues/new/choose`)} />
    <SettingsRow label="Agent Client Protocol" desc="The open protocol connecting Splash to your coding agents." onclick={() => openExternal("https://agentclientprotocol.com")} />
  </SettingsGroup>
  <p class="note">Splash is an independent, open-source project. Agent accounts and subscriptions are managed by their providers.</p>
</div>

<style>
  .app-icon { flex: none; }
  .note { color: var(--muted); font-size: var(--fs-sm); line-height: var(--lh-prose); max-width: 64ch; }
</style>
