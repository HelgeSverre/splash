<script lang="ts">
  import RevealButton from "../ui/RevealButton.svelte";
  import AgentIcon from "../AgentIcon.svelte";
  import SegmentedControl from "../ui/SegmentedControl.svelte";
  import Switch from "../ui/Switch.svelte";
  import ChoiceGroup from "../ui/ChoiceGroup.svelte";
  import PageHeader from "./PageHeader.svelte";
  import SettingsGroup from "./SettingsGroup.svelte";
  import SettingsRow from "./SettingsRow.svelte";
  import { home } from "../../lib/paths";
  import { app } from "../../lib/sessions.svelte";
  import { prefs, setPref } from "../../lib/prefs.svelte";

  const defaultAgent = $derived(prefs.default_agent ?? "claude");
  const isolation = $derived(prefs.default_isolation ?? "worktree");
  const notify = $derived(prefs.notify !== "off");
</script>

<div class="set-page">
  <PageHeader title="General">
    {#snippet lede()}Defaults for new sessions, and how Splash gets your attention.{/snippet}
  </PageHeader>

  <SettingsGroup title="New sessions">
    <SettingsRow label="Default agent" labelId="set-default-agent" desc="Preselected in the new-session dialog.">
      <!-- Wraps to a second row rather than squeezing the label. -->
      <div class="agent-choices">
      <ChoiceGroup data-testid="settings-default-agent" items={app.agents} value={defaultAgent} key={(a) => a.id} title={(a) => a.name} labelledby="set-default-agent"
        layout="row" variant="icon" onchange={(a) => setPref("default_agent", a.id)}>
        {#snippet item(a)}<AgentIcon id={a.id} size={14} />{/snippet}
      </ChoiceGroup>
      </div>
    </SettingsRow>
    <SettingsRow label="Where sessions work" desc="A new worktree keeps your checkout untouched; in place edits it directly.">
      <SegmentedControl data-testid="settings-isolation" label="Where sessions work" value={isolation} onchange={(v) => setPref("default_isolation", v)}
        options={[{ value: "worktree", label: "Worktree" }, { value: "in_place", label: "In place" }]} />
    </SettingsRow>
  </SettingsGroup>

  <SettingsGroup title="Notifications">
    <SettingsRow label="Notify when a background session needs you" labelId="set-notify"
      desc="A permission request, or a turn finishing while you're looking at something else.">
      <Switch data-testid="settings-notify" checked={notify} labelledby="set-notify" onchange={(on) => setPref("notify", on ? "on" : "off")} />
    </SettingsRow>
  </SettingsGroup>

  <SettingsGroup title="Storage">
    <SettingsRow data-testid="settings-row" data-key="data-folder" label="Data folder" desc="Projects, sessions and transcripts (SQLite)."
      value={home(prefs.data_dir ?? "")} valueTitle={prefs.data_dir} path>
      <RevealButton path={prefs.data_dir} />
    </SettingsRow>
    <SettingsRow data-testid="settings-row" data-key="worktrees" label="Worktrees" desc="One folder per worktree session; archiving removes it and keeps the branch."
      value={home(prefs.worktrees_dir ?? "")} valueTitle={prefs.worktrees_dir} path>
      <RevealButton path={prefs.worktrees_dir} />
    </SettingsRow>
  </SettingsGroup>
</div>

<style>
  .agent-choices { max-width: 320px; }
  .agent-choices :global(.is-row) { justify-content: flex-end; }
</style>
