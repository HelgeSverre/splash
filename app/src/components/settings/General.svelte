<script lang="ts">
  import RevealButton from "../ui/RevealButton.svelte";
  import AgentIcon from "../AgentIcon.svelte";
  import { home } from "../../lib/paths";
  import { app, prefs, setPref } from "../../lib/state.svelte";

  const defaultAgent = $derived(prefs.default_agent ?? "claude");
  const isolation = $derived(prefs.default_isolation ?? "worktree");
  const notify = $derived(prefs.notify !== "off");
</script>

<div class="set-page">
  <h2>General</h2>
  <p class="lede">Defaults for new sessions, and how Splash gets your attention.</p>

  <div class="set-group-title">New sessions</div>
  <div class="set-group">
    <div class="set-row">
      <div class="set-label">
        <div>Default agent</div>
        <div class="set-desc">Preselected in the new-session dialog.</div>
      </div>
      <div class="agents">
        {#each app.agents as a (a.id)}
          <button class="plain agent" class:on={a.id === defaultAgent} title={a.name} onclick={() => setPref("default_agent", a.id)}>
            <AgentIcon id={a.id} size={14} />
          </button>
        {/each}
      </div>
    </div>
    <div class="set-row">
      <div class="set-label">
        <div>Where sessions work</div>
        <div class="set-desc">A new worktree keeps your checkout untouched; in place edits it directly.</div>
      </div>
      <div class="seg-control">
        <button class:on={isolation === "worktree"} onclick={() => setPref("default_isolation", "worktree")}>Worktree</button>
        <button class:on={isolation === "in_place"} onclick={() => setPref("default_isolation", "in_place")}>In place</button>
      </div>
    </div>
  </div>

  <div class="set-group-title">Notifications</div>
  <div class="set-group">
    <div class="set-row">
      <div class="set-label">
        <div>Notify when a background session needs you</div>
        <div class="set-desc">A permission request, or a turn finishing while you're looking at something else.</div>
      </div>
      <button class="toggle" class:on={notify} aria-label="Notifications" onclick={() => setPref("notify", notify ? "off" : "on")}></button>
    </div>
  </div>

  <div class="set-group-title">Storage</div>
  <div class="set-group">
    <div class="set-row">
      <div class="set-label"><div>Data folder</div><div class="set-desc">Projects, sessions and transcripts (SQLite).</div></div>
      <span class="set-value" title={prefs.data_dir}>{home(prefs.data_dir ?? "")}</span>
      <RevealButton path={prefs.data_dir} />
    </div>
    <div class="set-row">
      <div class="set-label"><div>Worktrees</div><div class="set-desc">One folder per worktree session; archiving removes it and keeps the branch.</div></div>
      <span class="set-value" title={prefs.worktrees_dir}>{home(prefs.worktrees_dir ?? "")}</span>
      <RevealButton path={prefs.worktrees_dir} />
    </div>
  </div>
</div>

<style>
  .agents { display: flex; gap: 4px; }
  .agent { width: 30px; height: 28px; display: grid; place-items: center; border: 1px solid var(--border); border-radius: var(--radius); cursor: pointer; }
  .agent:hover { border-color: var(--border-strong); }
  .agent.on { border-color: var(--accent); background: var(--accent-soft); }
</style>
