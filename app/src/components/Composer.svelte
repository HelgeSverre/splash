<script lang="ts">
  import AgentIcon from "./AgentIcon.svelte";
  import Picker from "./Picker.svelte";
  import ContextRing from "./ContextRing.svelte";
  import { api, type SessionView } from "../bindings";
  import { showError, projectById, agentById, layout, saveLayout } from "../lib/state.svelte";

  let { session }: { session: SessionView } = $props();

  // Drafts survive switching sessions.
  const drafts: Record<string, string> = ((globalThis as any).__splashDrafts ??= {});
  let text = $state("");
  let input: HTMLTextAreaElement | undefined = $state();
  let pick = $state(0);
  let lastId = "";

  $effect(() => {
    if (session.id !== lastId) {
      if (lastId) drafts[lastId] = text;
      lastId = session.id;
      text = drafts[session.id] ?? "";
      queueMicrotask(() => input?.focus());
    }
  });

  const busy = $derived(session.status === "running" || session.status === "awaiting_permission");
  const archived = $derived(session.archived);
  const project = $derived(projectById(session.project_id));
  const agent = $derived(agentById(session.agent_id));

  // Where each option sits: permissions and build/plan on the left, the model and
  // how hard it thinks on the right.
  const LEFT = new Set(["mode", "collaboration_mode"]);
  const left = $derived(session.meta.options.filter((o) => LEFT.has(o.category)));
  const right = $derived(session.meta.options.filter((o) => !LEFT.has(o.category)));

  // Slash commands: while the draft is "/word" with no space yet.
  const slash = $derived.by(() => {
    const m = /^\/(\S*)$/.exec(text);
    if (!m) return [];
    const q = m[1].toLowerCase();
    return session.meta.commands
      .filter((c) => c.name.toLowerCase().includes(q))
      .sort((a, b) => Number(!a.name.toLowerCase().startsWith(q)) - Number(!b.name.toLowerCase().startsWith(q)))
      .slice(0, 8);
  });
  $effect(() => {
    void slash.length;
    pick = 0;
  });

  function autosize() {
    if (!input) return;
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, window.innerHeight * 0.4) + "px";
  }
  $effect(() => {
    void text;
    autosize();
  });

  async function send() {
    const prompt = text.trim();
    if (!prompt || busy || archived) return;
    text = "";
    drafts[session.id] = "";
    try {
      await api.send_prompt(session.id, prompt);
    } catch (e) {
      text = prompt;
      showError(e);
    }
  }

  function stop() {
    api.cancel(session.id).catch(showError);
  }

  function complete(name: string) {
    text = `/${name} `;
    input?.focus();
  }

  function onkeydown(e: KeyboardEvent) {
    if (slash.length) {
      if (e.key === "ArrowDown") { e.preventDefault(); pick = (pick + 1) % slash.length; return; }
      if (e.key === "ArrowUp") { e.preventDefault(); pick = (pick - 1 + slash.length) % slash.length; return; }
      if (e.key === "Tab" || (e.key === "Enter" && !e.shiftKey && text.length > 1 && !slash.some((c) => c.name === text.slice(1)))) {
        e.preventDefault();
        complete(slash[pick].name);
        return;
      }
    }
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      send();
    }
  }

  function setOption(option: string, value: string) {
    api.set_option(session.id, option, value).catch(showError);
  }

  function showDetails() {
    layout.rightOpen = true;
    layout.rightTab = "details";
    saveLayout();
  }
</script>

<div class="composer">
  <div class="chips">
    <button class="plain chip" onclick={showDetails} title={session.cwd}>
      {#if session.isolation === "worktree"}
        <svg width="12" height="12" viewBox="0 0 16 16"><circle cx="4.5" cy="3.5" r="1.8" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="4.5" cy="12.5" r="1.8" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="11.5" cy="5.5" r="1.8" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M4.5 5.3v5.4M11.5 7.3c0 3-7 2-7 3.4" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>
        {session.branch ?? "worktree"}
      {:else}
        <svg width="12" height="12" viewBox="0 0 16 16"><rect x="2" y="3" width="12" height="9" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M5 14h6" stroke="currentColor" stroke-width="1.3"/></svg>
        In place{session.branch ? ` · ${session.branch}` : ""}
      {/if}
    </button>
    <button class="plain chip" onclick={showDetails} title={project?.path ?? session.cwd}>
      <svg width="12" height="12" viewBox="0 0 16 16"><path d="M2 4.5A1.5 1.5 0 0 1 3.5 3h3l1.5 1.5h4.5A1.5 1.5 0 0 1 14 6v5.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11.5z" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>
      {project?.name ?? "folder"}
    </button>
    <span class="spacer"></span>
    <span class="agent" title={agent?.name ?? session.agent_id}><AgentIcon id={session.agent_id} size={16} /></span>
  </div>

  {#if slash.length}
    <div class="slash">
      {#each slash as c, i (c.name)}
        <button class="plain" class:on={i === pick} onmousedown={(e) => { e.preventDefault(); complete(c.name); }}>
          <span class="name">/{c.name}</span>
          <span class="desc">{c.description}</span>
        </button>
      {/each}
    </div>
  {/if}

  <div class="box" class:disabled={archived}>
    <textarea
      bind:this={input}
      bind:value={text}
      {onkeydown}
      rows="1"
      disabled={archived}
      placeholder={archived ? "This session is archived." : busy ? "The agent is working…" : "Describe a task or ask a question"}
    ></textarea>
    {#if busy}
      <button class="plain send stop" onclick={stop} title="Stop (⌘.)" aria-label="Stop">
        <svg width="10" height="10" viewBox="0 0 10 10"><rect width="10" height="10" rx="2" fill="currentColor" /></svg>
      </button>
    {:else}
      <button class="plain send" disabled={!text.trim() || archived} onclick={send} title="Send (⏎)" aria-label="Send">⏎</button>
    {/if}
  </div>

  <div class="controls">
    {#each left as o (o.id)}
      <Picker option={o} disabled={archived} onchange={(v) => setOption(o.id, v)} />
    {/each}
    <span class="spacer"></span>
    {#each right as o (o.id)}
      <Picker option={o} align="right" disabled={archived} onchange={(v) => setOption(o.id, v)} />
    {/each}
    <ContextRing usage={session.meta.usage} status={session.status} />
  </div>
</div>

<style>
  .composer { position: relative; width: 100%; max-width: 860px; margin: 0 auto; padding: 0 28px 12px; }
  button { font: inherit; color: inherit; }
  .chips { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; min-width: 0; }
  .chip {
    display: inline-flex; align-items: center; gap: 6px;
    height: 22px; padding: 0 8px; border-radius: var(--radius); min-width: 0;
    font-size: 12px; color: var(--text-2); background: var(--soft); border: 1px solid var(--border);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 45%;
  }
  .chip:hover { color: var(--text); border-color: var(--border-strong); }
  .chip svg { flex: none; color: var(--muted); }
  .spacer { flex: 1; }
  .agent { display: inline-flex; padding-right: 4px; }
  .box {
    display: flex; align-items: flex-end; gap: 8px;
    background: var(--surface); border: 1px solid var(--border-strong); border-radius: 10px; padding: 9px 8px 9px 12px;
  }
  .box:focus-within { border-color: var(--border-focus); }
  .box.disabled { opacity: 0.6; }
  textarea { flex: 1; resize: none; border: 0; outline: none; background: transparent; line-height: 1.5; padding: 1px 0; max-height: 40vh; user-select: text; }
  textarea::placeholder { color: var(--muted); }
  .send {
    flex: none; width: 24px; height: 22px; display: grid; place-items: center;
    border-radius: var(--radius-sm); color: var(--muted);
    font: 500 13px/1 var(--font-keys);
  }
  .send:hover:not(:disabled) { color: var(--text); background: var(--hover); }
  .send:disabled { cursor: default; opacity: 0.45; }
  .send.stop { color: var(--err); }
  .send.stop:hover { background: var(--del-bg); color: var(--err); }
  .controls { display: flex; align-items: center; gap: 2px; margin-top: 5px; padding: 0 2px; min-height: 22px; }
  .slash {
    position: absolute; left: 28px; right: 28px; bottom: calc(100% - 30px); z-index: 5;
    background: var(--surface); border: 1px solid var(--border-strong); border-radius: 8px; padding: 4px; max-height: 280px; overflow: auto;
  }
  .slash button { display: flex; gap: 12px; width: 100%; padding: 5px 8px; border-radius: var(--radius-sm); }
  .slash button.on { background: var(--hover); }
  .slash .name { font: 12px var(--font-mono); color: var(--accent); flex: none; }
  .slash .desc { color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
