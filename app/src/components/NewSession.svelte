<script lang="ts">
  import { dialog } from "@elyra/runtime";
  import AgentIcon from "./AgentIcon.svelte";
  import Modal from "./ui/Modal.svelte";
  import Tag from "./ui/Tag.svelte";
  import { readiness as agentReadiness } from "../lib/agents";
  import { app, prefs, addProject, createSession, showError, projectById } from "../lib/state.svelte";
  import type { AgentStatus, Isolation } from "../bindings";


  let projectId = $state(app.newSession?.projectId ?? app.projects[0]?.id ?? "");
  let agentId = $state(prefs.default_agent ?? "claude");
  let isolation: Isolation = $state((prefs.default_isolation ?? "worktree") as Isolation);
  let busy = $state(false);

  const project = $derived(projectById(projectId));
  const canWorktree = $derived(project?.is_git ?? false);
  const effectiveIsolation: Isolation = $derived(canWorktree ? isolation : "in_place");
  const agent = $derived(app.agents.find((a) => a.id === agentId));

  // Usable agents show their version; the rest say why not.
  function readiness(a: AgentStatus) {
    const r = agentReadiness(a);
    return r.tone === "err" || r.tone === "warn" ? r : { tone: "ok" as const, label: a.version ? `v${a.version}` : "ready" };
  }
  const close = () => (app.newSession = null);

  async function pickFolder() {
    const [dir] = await dialog.open({ directory: true, title: "Add a project folder" });
    if (!dir) return;
    try {
      projectId = (await addProject(dir)).id;
    } catch (e) {
      showError(e);
    }
  }

  async function create() {
    if (!projectId || !agentId || busy) return;
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

  function onKey(e: KeyboardEvent) {
    if (e.key === "Enter" && (e.metaKey || (e.target as HTMLElement).tagName !== "BUTTON")) {
      e.preventDefault();
      create();
    }
  }
</script>

<svelte:window onkeydown={onKey} />

<Modal label="New session" width="620px" top onclose={close}>
  <div class="dialog">
    <h2>New session</h2>

    <div class="label">Project</div>
    <div class="projects">
      {#each app.projects as p (p.id)}
        <button class="choice" class:on={p.id === projectId} onclick={() => (projectId = p.id)} title={p.path}>
          <span class="pname">{p.name}</span>
          <span class="ppath">{p.path.replace(/^\/Users\/[^/]+/, "~")}</span>
        </button>
      {/each}
      <button class="choice add" onclick={pickFolder}>+ Add folder…</button>
    </div>

    <div class="label">Agent</div>
    <div class="agents">
      {#each app.agents as a (a.id)}
        {@const st = readiness(a)}
        <button class="agent" class:on={a.id === agentId} disabled={st.tone === "err"} onclick={() => (agentId = a.id)}>
          <AgentIcon id={a.id} size={16} />
          <span class="aname">{a.name}</span>
          {#if a.experimental}<Tag tone="warn">exp</Tag>{/if}
          <span class="astate {st.tone}">{st.label}</span>
        </button>
      {:else}
        <div class="loading"><span class="spinner"></span> Detecting agents…</div>
      {/each}
    </div>

    <div class="label">Where it works</div>
    <div class="seg">
      <button class:on={effectiveIsolation === "worktree"} disabled={!canWorktree} onclick={() => (isolation = "worktree")}>
        <strong>New worktree</strong>
        <span>{canWorktree ? "Own branch splash/…, your checkout stays untouched" : "Needs a git repository"}</span>
      </button>
      <button class:on={effectiveIsolation === "in_place"} onclick={() => (isolation = "in_place")}>
        <strong>In place</strong>
        <span>Edits your working copy directly</span>
      </button>
    </div>


    <div class="actions">
      <span class="hint">{agent?.transport === "adapter" ? "First start may download the ACP adapter via npx." : ""}</span>
      <button class="btn ghost" onclick={() => (app.newSession = null)}>Cancel</button>
      <button class="btn primary" disabled={!projectId || !agent || busy} onclick={create}>
        {#if busy}<span class="spinner"></span>{/if}
        Start session <span class="kbd on-accent">⏎</span>
      </button>
    </div>
  </div>
</Modal>

<style>
  .dialog { overflow: auto; max-height: 80vh; padding: 20px 22px 18px; background: var(--surface); }
  h2 { margin: 0 0 14px; font-size: 16px; font-weight: 600; }
  .label { color: var(--text-2); font-size: 12px; font-weight: 500; margin: 14px 0 6px; }
  button { font: inherit; color: inherit; cursor: pointer; }
  .projects, .agents { display: flex; flex-direction: column; gap: 4px; }
  .choice, .agent {
    display: flex; align-items: center; gap: 10px; text-align: left;
    padding: 7px 10px; background: var(--soft); border: 1px solid var(--border); border-radius: var(--radius);
  }
  .choice:hover, .agent:hover:not(:disabled) { border-color: var(--border-strong); }
  .choice.on, .agent.on { border-color: var(--accent); background: var(--accent-soft); }
  .choice.add { color: var(--text-2); justify-content: center; border-style: dashed; background: transparent; }
  .pname { font-weight: 500; }
  .ppath { color: var(--muted); font: 11px var(--font-mono); margin-left: auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 60%; }
  .agent:disabled { opacity: 0.45; cursor: default; }
  .aname { font-weight: 500; }
  .astate { margin-left: auto; font: 11px var(--font-mono); color: var(--muted); }
  .astate.err { color: var(--err-dim); }
  .astate.warn { color: var(--warn-dim); }
  .seg { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
  .seg button {
    display: flex; flex-direction: column; gap: 2px; text-align: left;
    padding: 9px 11px; background: var(--soft); border: 1px solid var(--border); border-radius: var(--radius);
  }
  .seg button span { color: var(--muted); font-size: 12px; }
  .seg button.on { border-color: var(--accent); background: var(--accent-soft); }
  .seg button:disabled { opacity: 0.45; cursor: default; }
  .actions { display: flex; align-items: center; gap: 8px; margin-top: 18px; }
  .hint { flex: 1; color: var(--muted); font-size: 12px; }
  .kbd.on-accent { color: inherit; background: transparent; border-color: var(--on-accent-border); height: 16px; min-width: 16px; }
  .loading { display: flex; gap: 8px; align-items: center; color: var(--muted); padding: 8px; }
</style>
