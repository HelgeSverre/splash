<script lang="ts">
  import AgentIcon from "./AgentIcon.svelte";
  import Modal from "./ui/Modal.svelte";
  import Tag from "./ui/Tag.svelte";
  import EmptyState from "./ui/EmptyState.svelte";
  import ModalHeader from "./ui/ModalHeader.svelte";
  import Kbd from "./Kbd.svelte";
  import ChoiceGroup from "./ui/ChoiceGroup.svelte";
  import PathLabel from "./ui/PathLabel.svelte";
  import AddButton from "./ui/AddButton.svelte";
  import Chevron from "./ui/Chevron.svelte";
  import Icon from "./Icon.svelte";
  import { readiness as agentReadiness } from "../lib/agents";
  import { app, agentById, createSession, pickFolder, projectById } from "../lib/sessions.svelte";
  import { prefs } from "../lib/prefs.svelte";
  import { showError } from "../lib/system";
  import { foldersFromText } from "../lib/session-history";
  import { openSettings } from "../lib/customize.svelte";
  import { serverUnavailable } from "../lib/server.svelte";
  import type { AgentStatus, Isolation } from "../bindings";


  const context = app.newSession?.githubItem;
  let prHead = $state(context?.kind === "pull_request");
  let projectId = $state(app.newSession?.projectId ?? (context ? "" : app.projects[0]?.id ?? ""));
  let agentId = $state(prefs.default_agent ?? "claude");
  let isolation: Isolation = $state((prefs.default_isolation ?? "worktree") as Isolation);
  let busy = $state(false);
  let additionalFolders = $state("");
  let showFolders = $state(false);
  // Agents that aren't installed can't be chosen: they wait behind one line,
  // open from the start only when nothing is installed yet.
  let showAllAgents = $state<boolean | null>(null);

  const project = $derived(projectById(projectId));
  const canWorktree = $derived(project?.is_git ?? false);
  const effectiveIsolation: Isolation = $derived(canWorktree ? isolation : "in_place");
  const agent = $derived(agentById(agentId));

  // Usable agents show their version; the rest say why not.
  function readiness(a: AgentStatus) {
    const r = agentReadiness(a);
    return r.tone === "err" || r.tone === "warn" ? r : { tone: "ok" as const, label: a.version ? `v${a.version}` : "ready" };
  }
  const close = () => { if (!busy) app.newSession = null; };
  const agentOff = (a: AgentStatus) => readiness(a).tone === "err";
  const readyAgents = $derived(app.agents.filter((a) => !agentOff(a)));
  const missingAgents = $derived(app.agents.filter((a) => !a.installed));
  const allAgents = $derived(showAllAgents ?? missingAgents.length === app.agents.length);
  const shownAgents = $derived(allAgents ? app.agents : app.agents.filter((a) => a.installed));
  const canStart = $derived(!!projectId && !!agent && !agentOff(agent) && !busy && !serverUnavailable());

  // The stored default may not be installed or ready: start on one that is.
  $effect(() => {
    const current = agentById(agentId);
    if (current && !agentOff(current)) return;
    const ready = app.agents.find((a) => !agentOff(a));
    if (ready) agentId = ready.id;
  });

  async function addFolder() {
    if (busy || serverUnavailable()) return;
    const p = await pickFolder();
    if (p) projectId = p.id;
  }

  async function create() {
    if (!canStart) return;
    busy = true;
    try {
      await createSession(projectId, agentId, prHead ? "worktree" : effectiveIsolation, context?.title ?? null, context, prHead, foldersFromText(additionalFolders));
      app.newSession = null;
    } catch (e) {
      showError(e);
    } finally {
      busy = false;
    }
  }

  // ⏎ starts the session from anywhere in the dialog except a plain button
  // (Cancel, Add folder); ⌘⏎ from anywhere at all.
  let dialogEl: HTMLDivElement | undefined = $state();
  function onKey(e: KeyboardEvent) {
    const el = e.target as HTMLElement;
    if (e.key !== "Enter" || !dialogEl?.contains(el)) return;
    if (el.tagName === "TEXTAREA" && !e.metaKey) return;
    if (e.metaKey || el.tagName !== "BUTTON" || el.getAttribute("role") === "radio") {
      e.preventDefault();
      create();
    }
  }

  const isolations: { id: Isolation; title: string }[] = [
    { id: "worktree", title: "New worktree" },
    { id: "in_place", title: "In place" },
  ];
  const isolationDesc = (id: Isolation) =>
    id === "in_place" ? "Edits your working copy directly" : canWorktree ? "Own branch, your checkout stays clean" : "Needs a git repository";
</script>

<svelte:window onkeydown={onKey} />

<Modal data-testid="new-session" label="New session" width="620px" top onclose={close}>
  <ModalHeader title="New session" onclose={close} />
  <div class="dialog" bind:this={dialogEl}>
    {#if context}<p class="desc" data-testid="new-session-context" data-repo={context.repository} data-number={context.number}>{context.repository} #{context.number}: {context.title}</p><p class="desc">The description and GitHub link will be ready in the composer for you to review and send.</p>{/if}
    <div class="label t-group first" id="ns-project">Project</div>
    <ChoiceGroup data-testid="new-session-project" items={app.projects} value={projectId} key={(p) => p.id} title={(p) => p.path} labelledby="ns-project"
      variant="stack" onchange={(p) => (projectId = p.id)}>
      {#snippet item(p)}<span class="name">{p.name}</span><PathLabel path={p.path} muted start />{/snippet}
      {#snippet empty()}<EmptyState data-testid="new-session-project-empty" inline icon="folder" title="Add a project folder to begin" detail="Splash starts each session in a selected local folder." />{/snippet}
    </ChoiceGroup>
    <span class="add"><AddButton data-testid="new-session-add-folder" label="Add folder…" disabled={busy || serverUnavailable()} onclick={addFolder} /></span>

    <div class="label t-group" id="ns-agent">Agent</div>
    <ChoiceGroup data-testid="new-session-agent" items={shownAgents} value={agentId} key={(a) => a.id} disabled={agentOff} labelledby="ns-agent"
      layout="grid" onchange={(a) => (agentId = a.id)}>
      {#snippet item(a)}
        {@const st = readiness(a)}
        <AgentIcon id={a.id} size={16} />
        <span class="name">{a.name}</span>
        {#if a.experimental}<Tag tone="warn">experimental</Tag>{/if}
        <span class="astate {st.tone}" data-testid="new-session-agent-state" data-tone={st.tone}>{st.label}</span>
      {/snippet}
      {#snippet empty()}<EmptyState inline loading title="Detecting agents…" />{/snippet}
    </ChoiceGroup>
    {#if missingAgents.length && missingAgents.length < app.agents.length}
      <button class="plain more" data-testid="new-session-more-agents" data-count={missingAgents.length} aria-expanded={allAgents} onclick={() => (showAllAgents = !allAgents)}>
        <Chevron open={allAgents} />{allAgents ? "Hide" : "Show"} {missingAgents.length} {missingAgents.length === 1 ? "agent that is" : "agents that are"} not installed
      </button>
    {/if}
    {#if !app.agentsLoading && app.agents.length && !readyAgents.length}
      <EmptyState data-testid="new-session-agent-empty" inline icon="agents" title="No agents are ready" detail="Install and sign in to a supported coding agent, then refresh agent detection." />
      <button class="btn" data-testid="new-session-configure-agents" onclick={() => openSettings("agents")}>Configure agents</button>
    {/if}

    {#if context?.kind === "pull_request"}<label class="desc"><input type="checkbox" data-testid="new-session-pr-head" bind:checked={prHead} disabled={busy} /> Start a new worktree from PR #{context.number} ({context.branch})</label>{/if}
    {#if !prHead}
    <div class="label t-group" id="ns-where">Where it works</div>
    <ChoiceGroup data-testid="new-session-where" items={isolations} value={effectiveIsolation} key={(x) => x.id} disabled={(x) => x.id === "worktree" && !canWorktree}
      labelledby="ns-where" layout="grid" variant="stack" onchange={(x) => (isolation = x.id)}>
      {#snippet item(x)}<span class="name">{x.title}</span><span class="desc">{isolationDesc(x.id)}</span>{/snippet}
    </ChoiceGroup>

    {/if}
    {#if !prHead}
      {#if showFolders || additionalFolders.trim()}
        <label class="label t-group" for="ns-extra-folders">Additional workspace folders</label>
        <textarea id="ns-extra-folders" data-testid="new-session-folders" class="field extra-folders" rows="2" bind:value={additionalFolders} placeholder="Absolute paths, one per line" disabled={busy}></textarea>
        <p class="desc">These folders are restored when you reconnect. The selected agent must support additional workspace folders.</p>
      {:else}
        <button class="plain more folders" data-testid="new-session-folders-toggle" onclick={() => (showFolders = true)}><Icon name="plus" size={12} />Add workspace folders</button>
      {/if}
    {/if}
    <div class="actions">
      <span class="hint">{agent?.transport === "adapter" ? "First start may download the ACP adapter via npx." : ""}</span>
      <button class="btn ghost" data-testid="new-session-cancel" onclick={close}>Cancel</button>
      <button class="btn primary" data-testid="new-session-start" disabled={!canStart} onclick={create}>
        {#if busy}<span class="spinner"></span>{/if}
        Start session <Kbd keys="⏎" inline />
      </button>
    </div>
  </div>
</Modal>

<style>
  .dialog { overflow: auto; max-height: 80vh; padding: 16px 18px 18px; }
  /* The content group-title role, as in settings. */
  .extra-folders { display: block; width: 100%; min-height: 64px; resize: vertical; }
  .label { display: block; margin: 16px 0 6px; }
  .label.first { margin-top: 0; }
  .add { display: block; margin-top: 4px; }
  .more { display: flex; align-items: center; gap: 6px; margin-top: 8px; padding: 2px 4px; margin-left: -4px; border-radius: var(--radius-sm); color: var(--muted); font-size: var(--fs-sm); }
  .more:is(:hover, :focus-visible) { color: var(--text); }
  .more.folders { margin-top: 14px; }
  .name { flex: none; font-weight: var(--fw-medium); white-space: nowrap; }
  .desc { color: var(--muted); font-size: var(--fs-sm); }
  .astate { margin-left: auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: var(--fs-sm); color: var(--muted); }
  .astate.err { color: var(--err-dim); }
  .astate.warn { color: var(--warn-dim); }
  .actions { display: flex; align-items: center; gap: 8px; margin-top: 18px; }
  .hint { flex: 1; color: var(--muted); font-size: var(--fs-sm); }
</style>
