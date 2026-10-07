<script lang="ts">
  import Icon from "../Icon.svelte";
  import AgentIcon from "../AgentIcon.svelte";
  import Modal from "../ui/Modal.svelte";
  import ModalClose from "../ui/ModalClose.svelte";
  import FilterInput from "../ui/FilterInput.svelte";
  import Chevron from "../ui/Chevron.svelte";
  import NavItem from "../ui/NavItem.svelte";
  import General from "./General.svelte";
  import Shortcuts from "./Shortcuts.svelte";
  import AgentsOverview from "./AgentsOverview.svelte";
  import AgentPage from "./AgentPage.svelte";
  import AgentSkills from "./AgentSkills.svelte";
  import AgentCommands from "./AgentCommands.svelte";
  import AgentMcp from "./AgentMcp.svelte";
  import About from "./About.svelte";
  import { onDestroy } from "svelte";
  import { app } from "../../lib/sessions.svelte";
  import { agentPages, preview } from "../../lib/customize.svelte";
  import { readiness } from "../../lib/agents";
  import { matches } from "../../lib/format";

  let query = $state("");
  let searchEl: HTMLInputElement | undefined = $state();
  let expanded: Record<string, boolean> = $state({});

  const q = $derived(query.trim().toLowerCase());
  const hit = (...text: string[]) => matches(q, ...text);

  // The current agent sub-page, so its agent stays expanded.
  const openAgent = $derived(app.settings?.startsWith("agent:") ? app.settings.split(":")[1] : null);

  const appItems = [
    { id: "general", title: "General", icon: "gear", keywords: "default agent isolation worktree notifications data folder" },
    { id: "shortcuts", title: "Keyboard shortcuts", icon: "keyboard", keywords: "keys hotkeys keybindings rebind" },
  ];

  const agents = $derived(
    app.agents.map((a) => {
      const children = agentPages(a)
        .map((c) => ({ ...c, id: `agent:${a.id}:${c.page}` }))
        .filter((c) => hit(a.name, c.title, "skill command mcp server"));
      return { a, children, show: hit(a.name, a.id, "agent") || children.length > 0 };
    }),
  );

  const close = () => (app.settings = null);
  // A doc preview opens from a settings page: it goes when Settings goes.
  onDestroy(() => (preview.doc = null));

  // On the settings panel, not the window: a dialog stacked on top (a doc
  // preview) gets its own Esc and ⌘F.
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

<Modal data-testid="settings" label="Settings" width="1000px" height="720px" onclose={close}>
  <div class="settings" onkeydowncapture={onkeydown} role="presentation">
    <nav class="rail">
      <div class="search"><FilterInput bind:value={query} bind:ref={searchEl} placeholder="Search" label="Search settings" /></div>
      <div class="groups">
        {#if appItems.some((i) => hit(i.title, i.keywords))}
          <div class="group-title t-section">App</div>
          {#each appItems.filter((i) => hit(i.title, i.keywords)) as item (item.id)}
            <NavItem data-testid="settings-nav" data-page={item.id} label={item.title} active={app.settings === item.id} onclick={() => (app.settings = item.id)}>
              {#snippet lead()}<Icon name={item.icon} size={15} />{/snippet}
            </NavItem>
          {/each}
        {/if}

        <div class="group-title t-section">Agents</div>
        {#if hit("overview agents probe detect refresh")}
          <NavItem label="Overview" active={app.settings === "agents"} onclick={() => (app.settings = "agents")}>
            {#snippet lead()}<Icon name="agents" size={15} />{/snippet}
          </NavItem>
        {/if}
        {#each agents.filter((x) => x.show) as { a, children } (a.id)}
          {@const open = expanded[a.id] ?? (openAgent === a.id || !!q)}
          {@const r = readiness(a)}
          <NavItem label={a.name} active={app.settings === `agent:${a.id}`} onclick={() => { app.settings = `agent:${a.id}`; expanded[a.id] = true; }}>
            {#snippet lead()}<AgentIcon id={a.id} size={15} />{/snippet}
            {#snippet trail()}<span class="dot {r.tone}" title={r.label}></span>{/snippet}
            {#snippet action()}
              <button class="plain twist focus-inset" title={open ? "Collapse" : "Expand"} aria-label="{a.name} pages" aria-expanded={open}
                onclick={() => (expanded[a.id] = !open)}><Chevron {open} /></button>
            {/snippet}
          </NavItem>
          {#if open}
            {#each children as c (c.id)}
              <NavItem label={c.title} indent={31} dense active={app.settings === c.id} onclick={() => (app.settings = c.id)}>
                {#snippet lead()}<Icon name={c.icon} size={13} />{/snippet}
                {#snippet trail()}{#if c.count !== undefined}<span class="t-count">{c.count}</span>{/if}{/snippet}
              </NavItem>
            {/each}
          {/if}
        {/each}

        {#if hit("about version data")}
          <div class="group-title t-section">About</div>
          <NavItem label="About Splash" active={app.settings === "about"} onclick={() => (app.settings = "about")}>
            {#snippet lead()}<Icon name="info" size={15} />{/snippet}
          </NavItem>
        {/if}
      </div>
    </nav>

    <div class="content">
      <span class="close"><ModalClose onclose={close} /></span>
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
  .search { display: flex; margin-bottom: 10px; }
  .search :global(.filter) { min-width: 0; }
  .groups { flex: 1; overflow: auto; }
  .group-title { padding: 12px 10px 4px; }
  .group-title:first-child { padding-top: 2px; }
  .twist {
    width: var(--control-h-xs); height: var(--control-h-xs); display: grid; place-items: center;
    border-radius: var(--radius-sm);
  }
  .twist:is(:hover, :focus-visible) { background: var(--raised); }
  .twist:is(:hover, :focus-visible) :global(.chev) { color: var(--text); }
  .content { container-type: inline-size; position: relative; min-height: 0; overflow: auto; user-select: text; }
  .close { position: absolute; top: 14px; right: 14px; z-index: 2; }
  /* Room on the right for the close button. */
  .page { padding: 28px 56px 40px 36px; max-width: 800px; }
  @media (max-width: 800px) {
    .settings { grid-template-columns: 180px minmax(0, 1fr); }
    .page { padding: 28px 20px 32px; }
  }
</style>
