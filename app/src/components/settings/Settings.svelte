<script lang="ts">
  import Icon from "../Icon.svelte";
  import AgentIcon from "../AgentIcon.svelte";
  import Modal from "../ui/Modal.svelte";
  import IconButton from "../ui/IconButton.svelte";
  import General from "./General.svelte";
  import Shortcuts from "./Shortcuts.svelte";
  import AgentsOverview from "./AgentsOverview.svelte";
  import AgentPage from "./AgentPage.svelte";
  import AgentSkills from "./AgentSkills.svelte";
  import AgentCommands from "./AgentCommands.svelte";
  import AgentMcp from "./AgentMcp.svelte";
  import About from "./About.svelte";
  import { app, customize } from "../../lib/state.svelte";
  import { readiness, skillsFor, mcpFor } from "../../lib/agents";

  let query = $state("");
  let searchEl: HTMLInputElement | undefined = $state();
  let expanded: Record<string, boolean> = $state({});

  const q = $derived(query.trim().toLowerCase());
  const hit = (...text: string[]) => !q || text.join(" ").toLowerCase().includes(q);

  // The current agent sub-page, so its agent stays expanded.
  const openAgent = $derived(app.settings?.startsWith("agent:") ? app.settings.split(":")[1] : null);

  const appItems = [
    { id: "general", title: "General", icon: "gear", keywords: "default agent isolation worktree notifications data folder" },
    { id: "shortcuts", title: "Keyboard shortcuts", icon: "keyboard", keywords: "keys hotkeys keybindings rebind" },
  ];

  const agents = $derived(
    app.agents.map((a) => {
      const children = [
        { id: `agent:${a.id}:skills`, title: "Skills", icon: "skills", count: customize.skills ? skillsFor(customize.skills, a.id).length : undefined },
        { id: `agent:${a.id}:commands`, title: "Commands", icon: "commands", count: a.probe?.commands.length },
        { id: `agent:${a.id}:mcp`, title: "MCP servers", icon: "mcp", count: customize.mcp ? mcpFor(customize.mcp.servers, a.id).filter((s) => !s.project).length : undefined },
      ].filter((c) => hit(a.name, c.title, "skill command mcp server"));
      return { a, children, show: hit(a.name, a.id, "agent") || children.length > 0 };
    }),
  );

  const close = () => (app.settings = null);

  function onkeydown(e: KeyboardEvent) {
    if (e.key === "Escape" && query) {
      e.preventDefault();
      query = "";
    } else if ((e.metaKey || e.ctrlKey) && e.key === "f") {
      e.preventDefault();
      searchEl?.focus();
    }
  }
</script>

<svelte:window onkeydowncapture={onkeydown} />

<Modal label="Settings" width="1000px" height="720px" onclose={close}>
  <div class="settings">
    <nav class="rail">
      <label class="search">
        <Icon name="search" size={14} />
        <input bind:this={searchEl} bind:value={query} placeholder="Search" />
      </label>
      <div class="groups">
        {#if appItems.some((i) => hit(i.title, i.keywords))}
          <div class="group-title">App</div>
          {#each appItems.filter((i) => hit(i.title, i.keywords)) as item (item.id)}
            <button class="plain item" class:active={app.settings === item.id} onclick={() => (app.settings = item.id)}>
              <Icon name={item.icon} size={15} /><span class="label">{item.title}</span>
            </button>
          {/each}
        {/if}

        <div class="group-title">Agents</div>
        {#if hit("overview agents probe detect refresh")}
          <button class="plain item" class:active={app.settings === "agents"} onclick={() => (app.settings = "agents")}>
            <Icon name="agents" size={15} /><span class="label">Overview</span>
          </button>
        {/if}
        {#each agents.filter((x) => x.show) as { a, children } (a.id)}
          {@const open = expanded[a.id] ?? (openAgent === a.id || !!q)}
          {@const r = readiness(a)}
          <div class="node">
            <button class="plain item" class:active={app.settings === `agent:${a.id}`}
              onclick={() => { app.settings = `agent:${a.id}`; expanded[a.id] = true; }}>
              <AgentIcon id={a.id} size={15} /><span class="label">{a.name}</span>
              <span class="dot-s {r.tone}" title={r.label}></span>
            </button>
            <button class="plain twist" class:open title={open ? "Collapse" : "Expand"} onclick={() => (expanded[a.id] = !open)}>›</button>
          </div>
          {#if open}
            {#each children as c (c.id)}
              <button class="plain item child" class:active={app.settings === c.id} onclick={() => (app.settings = c.id)}>
                <Icon name={c.icon} size={13} /><span class="label">{c.title}</span>
                {#if c.count !== undefined}<span class="count">{c.count}</span>{/if}
              </button>
            {/each}
          {/if}
        {/each}

        {#if hit("about version data")}
          <div class="group-title">About</div>
          <button class="plain item" class:active={app.settings === "about"} onclick={() => (app.settings = "about")}>
            <Icon name="info" size={15} /><span class="label">About Splash</span>
          </button>
        {/if}
      </div>
    </nav>

    <div class="content">
      <span class="close"><IconButton title="Close (Esc)" onclick={close}><Icon name="close" size={14} /></IconButton></span>
      <div class="page">
        {#if app.settings === "general"}
          <General />
        {:else if app.settings === "shortcuts"}
          <Shortcuts />
        {:else if app.settings === "agents"}
          <AgentsOverview />
        {:else if app.settings === "about"}
          <About />
        {:else if app.settings?.startsWith("agent:")}
          {@const [, id, sub] = app.settings.split(":")}
          {#key app.settings}
            {#if sub === "skills"}<AgentSkills {id} />
            {:else if sub === "commands"}<AgentCommands {id} />
            {:else if sub === "mcp"}<AgentMcp {id} />
            {:else}<AgentPage {id} />{/if}
          {/key}
        {/if}
      </div>
    </div>
  </div>
</Modal>

<style>
  .settings { flex: 1; min-height: 0; display: grid; grid-template-columns: 230px minmax(0, 1fr); }
  .rail { display: flex; flex-direction: column; min-height: 0; background: var(--surface); border-right: 1px solid var(--border); padding: 12px 8px; }
  .search {
    display: flex; align-items: center; gap: 8px; height: 30px; padding: 0 10px; margin-bottom: 10px;
    background: var(--soft); border: 1px solid var(--border); border-radius: var(--radius); color: var(--muted);
  }
  .search:focus-within { border-color: var(--border-strong); }
  .search input { all: unset; flex: 1; min-width: 0; font-size: 13px; color: var(--text); user-select: text; }
  .search input::placeholder { color: var(--muted); }
  .groups { flex: 1; overflow: auto; }
  .group-title { padding: 12px 10px 4px; font-size: 11px; font-weight: 500; color: var(--muted); }
  .group-title:first-child { padding-top: 2px; }
  .item { display: flex; align-items: center; gap: 10px; width: 100%; height: 30px; padding: 0 10px; border-radius: var(--radius); color: var(--text-2); }
  .item:hover { background: var(--hover); color: var(--text); }
  .item.active { background: var(--raised); color: var(--text); }
  .item .label { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .item.child { height: 26px; padding-left: 34px; font-size: 12.5px; }
  .count { font: 11px var(--font-mono); color: var(--faint); }
  .node { position: relative; }
  .node .item { padding-right: 30px; }
  .twist {
    position: absolute; right: 4px; top: 5px; width: 20px; height: 20px; display: grid; place-items: center;
    border-radius: var(--radius-sm); color: var(--faint); transition: transform 0.12s;
  }
  .twist:hover { color: var(--text); background: var(--raised); }
  .twist.open { transform: rotate(90deg); }
  .dot-s { width: 6px; height: 6px; border-radius: 50%; background: var(--faint); flex: none; }
  .dot-s.ok { background: var(--ok-dim); }
  .dot-s.warn { background: var(--warn-dim); }
  .dot-s.err { background: var(--err-dim); }
  .content { position: relative; min-height: 0; overflow: auto; user-select: text; }
  .close { position: absolute; top: 14px; right: 14px; z-index: 2; }
  .page { padding: 28px 36px 40px; max-width: 780px; }
</style>
