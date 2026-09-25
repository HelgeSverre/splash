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
  import { readiness as agentReadiness } from "../lib/agents";
  import { app, agentById, createSession, pickFolder, projectById } from "../lib/sessions.svelte";
  import { prefs } from "../lib/prefs.svelte";
  import { showError } from "../lib/system";
  import type { AgentStatus, Isolation } from "../bindings";


  let projectId = $state(app.newSession?.projectId ?? app.projects[0]?.id ?? "");
  let agentId = $state(prefs.default_agent ?? "claude");
  let isolation: Isolation = $state((prefs.default_isolation ?? "worktree") as Isolation);
  let busy = $state(false);

  const project = $derived(projectById(projectId));
  const canWorktree = $derived(project?.is_git ?? false);
  const effectiveIsolation: Isolation = $derived(canWorktree ? isolation : "in_place");
  const agent = $derived(agentById(agentId));

  // Usable agents show their version; the rest say why not.
  function readiness(a: AgentStatus) {
    const r = agentReadiness(a);
    return r.tone === "err" || r.tone === "warn" ? r : { tone: "ok" as const, label: a.version ? `v${a.version}` : "ready" };
  }
  const close = () => (app.newSession = null);
  const agentOff = (a: AgentStatus) => readiness(a).tone === "err";
  const canStart = $derived(!!projectId && !!agent && !agentOff(agent) && !busy);

  // The stored default may not be installed or ready: start on one that is.
  $effect(() => {
    const current = agentById(agentId);
    if (current && !agentOff(current)) return;
    const ready = app.agents.find((a) => !agentOff(a));
    if (ready) agentId = ready.id;
  });

  async function addFolder() {
    const p = await pickFolder();
    if (p) projectId = p.id;
  }

  async function create() {
    if (!canStart) return;
    busy = true;
    try {
      await createSession(projectId, agentId, effectiveIsolation, null);
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

<Modal label="New session" width="620px" top onclose={close}>
  <ModalHeader title="New session" onclose={close} />
  <div class="dialog" bind:this={dialogEl}>
    <div class="label t-group first" id="ns-project">Project</div>
    <ChoiceGroup items={app.projects} value={projectId} key={(p) => p.id} title={(p) => p.path} labelledby="ns-project"
      variant="stack" onchange={(p) => (projectId = p.id)}>
      {#snippet item(p)}<span class="name">{p.name}</span><PathLabel path={p.path} muted start />{/snippet}
    </ChoiceGroup>
    <span class="add"><AddButton label="Add folder…" onclick={addFolder} /></span>

    <div class="label t-group" id="ns-agent">Agent</div>
    <ChoiceGroup items={app.agents} value={agentId} key={(a) => a.id} disabled={agentOff} labelledby="ns-agent"
      layout="grid" onchange={(a) => (agentId = a.id)}>
      {#snippet item(a)}
        {@const st = readiness(a)}
        <AgentIcon id={a.id} size={16} />
        <span class="name">{a.name}</span>
        {#if a.experimental}<Tag tone="warn">experimental</Tag>{/if}
        <span class="astate {st.tone}">{st.label}</span>
      {/snippet}
      {#snippet empty()}<EmptyState inline loading title="Detecting agents…" />{/snippet}
    </ChoiceGroup>

    <div class="label t-group" id="ns-where">Where it works</div>
    <ChoiceGroup items={isolations} value={effectiveIsolation} key={(x) => x.id} disabled={(x) => x.id === "worktree" && !canWorktree}
      labelledby="ns-where" layout="grid" variant="stack" onchange={(x) => (isolation = x.id)}>
      {#snippet item(x)}<span class="name">{x.title}</span><span class="desc">{isolationDesc(x.id)}</span>{/snippet}
    </ChoiceGroup>

    <div class="actions">
      <span class="hint">{agent?.transport === "adapter" ? "First start may download the ACP adapter via npx." : ""}</span>
      <button class="btn ghost" onclick={close}>Cancel</button>
      <button class="btn primary" disabled={!canStart} onclick={create}>
        {#if busy}<span class="spinner"></span>{/if}
        Start session <Kbd keys="⏎" inline />
      </button>
    </div>
  </div>
</Modal>

<style>
  .dialog { overflow: auto; max-height: 80vh; padding: 16px 18px 18px; }
  /* The content group-title role, as in settings. */
  .label { margin: 16px 0 6px; }
  .label.first { margin-top: 0; }
  .add { display: block; margin-top: 4px; }
  .name { flex: none; font-weight: var(--fw-medium); white-space: nowrap; }
  .desc { color: var(--muted); font-size: var(--fs-sm); }
  .astate { margin-left: auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: var(--fs-sm); color: var(--muted); }
  .astate.err { color: var(--err-dim); }
  .astate.warn { color: var(--warn-dim); }
  .actions { display: flex; align-items: center; gap: 8px; margin-top: 18px; }
  .hint { flex: 1; color: var(--muted); font-size: var(--fs-sm); }
</style>
