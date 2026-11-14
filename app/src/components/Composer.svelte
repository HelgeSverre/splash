<script lang="ts">
  import { tick } from "svelte";
  import Picker from "./Picker.svelte";
  import ContextRing from "./ContextRing.svelte";
  import Icon from "./Icon.svelte";
  import IconButton from "./ui/IconButton.svelte";
  import SlashMenu from "./SlashMenu.svelte";
  import { api, type SessionView } from "../bindings";
  import { withKey } from "../lib/keybindings.svelte";
  import { registerComposer } from "../lib/focus";
  import { app, projectById, agentById, isBusy, drafts } from "../lib/sessions.svelte";
  import { showSideTab } from "../lib/layout.svelte";
  import { serverUnavailable } from "../lib/server.svelte";
  import { showError } from "../lib/system";

  let { session }: { session: SessionView } = $props();

  let text = $state("");
  let input: HTMLTextAreaElement | undefined = $state();
  let menu: SlashMenu | undefined = $state();
  let lastId = "";
  let sending = $state<Record<string, boolean>>({});

  $effect(() => input && registerComposer(input));

  // Each session keeps its draft: pick it up on arriving, keep it as it changes.
  $effect(() => {
    if (session.id !== lastId) {
      lastId = session.id;
      text = drafts[session.id] ?? "";
      queueMicrotask(() => input?.focus());
    }
  });
  $effect(() => {
    drafts[lastId] = text;
  });

  const busy = $derived(isBusy(session.status));
  const archived = $derived(session.archived || session.source?.deleted);
  const project = $derived(projectById(session.project_id));
  const agent = $derived(agentById(session.agent_id));

  // Where each option sits: permissions and build/plan on the left, the model and
  // how hard it thinks on the right.
  const LEFT = new Set(["mode", "collaboration_mode"]);
  const left = $derived(session.meta.options.filter((o) => LEFT.has(o.category)));
  const right = $derived(session.meta.options.filter((o) => !LEFT.has(o.category)));

  function autosize() {
    if (!input) return;
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, window.innerHeight * 0.4) + "px";
  }
  $effect(() => {
    void text;
    // Measure after a restored draft has reached the textarea.
    void tick().then(autosize);
  });

  async function send() {
    const prompt = text.trim();
    const id = session.id;
    if (serverUnavailable() || !prompt || busy || archived || sending[id] || session.status === "starting") return;
    sending[id] = true;
    try {
      await api.send_prompt(id, prompt);
      if (app.view.kind === "session" && app.view.id === id) app.focusEntry = null;
      if (drafts[id]?.trim() === prompt) drafts[id] = "";
      if (session.id === id && text.trim() === prompt) text = "";
    } catch (e) {
      showError(e);
    } finally { delete sending[id]; }
  }

  function stop() {
    api.cancel(session.id).catch(showError);
  }

  function complete(name: string) {
    text = `/${name} `;
    input?.focus();
  }

  function onkeydown(e: KeyboardEvent) {
    // Older WebKit can deliver the Enter used to confirm an IME candidate
    // after compositionend. keyCode 229 still identifies that keystroke.
    // Check before SlashMenu so a partial command cannot be completed either.
    if (e.isComposing || e.keyCode === 229) return;
    if (menu?.keydown(e)) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function setOption(option: string, value: string) {
    api.set_option(session.id, option, value).catch(showError);
  }

  const showDetails = () => showSideTab("details");
  const disconnected = $derived(!archived && (session.status === "exited" || session.status === "error"));
  const reconnecting = $derived(!!sending[session.id] && disconnected);
  const placeholder = $derived(
    archived ? (session.source?.deleted ? "Agent history was deleted. This local copy is read-only." : "This session is archived.")
    : busy ? "The agent is working…"
    : session.status === "error" ? `Connection failed. Reply to reconnect ${agent?.name ?? "the agent"} and try again`
    : session.status === "exited" ? `Reply to reconnect ${agent?.name ?? "the agent"} and continue`
    : "Describe a task or ask a question");
</script>

<div class="composer" data-testid="composer">
  <SlashMenu bind:this={menu} {text} commands={session.meta.commands} oncomplete={complete} />

  <div class="box field-box" class:disabled={archived}>
    <textarea
      class="bare-input"
      aria-label="Message"
      data-testid="composer-input"
      bind:this={input}
      bind:value={text}
      {onkeydown}
      rows="1"
      disabled={archived}
      data-disconnected={disconnected}
      {placeholder}
    ></textarea>
    {#if busy}
      <IconButton data-testid="composer-stop" class="stop" size="sm" icon="stop" title={withKey("Stop", "session.stop")} label="Stop" disabled={serverUnavailable()} onclick={stop} />
    {:else}
      <IconButton data-testid="composer-send" size="sm" icon="send" title="Send (⏎)" label="Send" disabled={serverUnavailable() || !text.trim() || archived || sending[session.id] || session.status === "starting"} onclick={send} />
    {/if}
  </div>

  <!-- One row under the box: reconnect (when stopped), how the agent may act,
       where it works, then the model and how hard it thinks. -->
  <div class="controls" data-testid="composer-options">
    {#if disconnected}
      <button class="btn sm" data-testid="composer-continue" title="Reconnect the agent without sending a message" disabled={serverUnavailable() || reconnecting} onclick={() => api.restart_session(session.id).catch(showError)}>{reconnecting ? "Reconnecting…" : "Reconnect"}</button>
    {/if}
    {#each left as o (o.id)}
      <Picker option={o} disabled={archived} onchange={(v) => setOption(o.id, v)} />
    {/each}
    <button class="plain chip where" data-testid="composer-where" onclick={showDetails} title={session.cwd}>
      {#if session.isolation === "worktree"}
        <Icon name="branch" size={12} /><span class="truncate">{session.branch ?? "worktree"}</span>
      {:else}
        <Icon name="monitor" size={12} /><span class="truncate">In place{session.branch ? ` · ${session.branch}` : ""}</span>
      {/if}
    </button>
    <button class="plain chip project" data-testid="composer-project" onclick={showDetails} title={project?.path ?? session.cwd}>
      <Icon name="folder" size={12} /><span class="truncate">{project?.name ?? "folder"}</span>
    </button>
    <span class="spacer"></span>
    {#each right as o (o.id)}
      <Picker option={o} align="right" disabled={archived} onchange={(v) => setOption(o.id, v)} />
    {/each}
    <ContextRing usage={session.meta.usage} status={session.status} />
  </div>
</div>

<style>
  .composer { position: relative; width: 100%; max-width: 860px; margin: 0 auto; padding: 0 28px 12px; container-type: inline-size; }
  /* Where the session works, as quiet as the pickers beside it. */
  .chip {
    display: inline-flex; align-items: center; gap: 5px; flex: 0 1 auto;
    height: var(--control-h-xs); padding: 0 6px; border-radius: var(--radius-sm); min-width: 0; max-width: 32%;
    font-size: var(--fs-sm); color: var(--muted); white-space: nowrap;
  }
  .chip:is(:hover, :focus-visible) { color: var(--text); background: var(--hover); }
  .chip :global(svg) { flex: none; }
  .box {
    display: flex; align-items: flex-end; gap: 8px;
    background: var(--surface); border: 1px solid var(--border-strong); border-radius: var(--radius-lg); padding: 8px 8px 8px 12px;
  }
  .box.disabled { opacity: 0.6; }
  textarea { resize: none; line-height: var(--lh-base); padding: 1px 0; max-height: 40vh; }
  .box :global(.stop) { color: var(--err); }
  .box :global(.stop:is(:hover, :focus-visible)) { background: var(--del-bg); color: var(--err); }
  .controls { display: flex; align-items: center; gap: 2px; margin-top: 6px; padding: 0 2px; min-height: var(--control-h-xs); }

  @container (max-width: 560px) {
    .chip.project { display: none; }
  }
  @container (max-width: 400px) {
    textarea { max-height: 180px; }
    .chip.where { display: none; }
  }
</style>
