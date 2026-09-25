<script lang="ts">
  // Every shared component, live, in its variants.
  import Specimen from "./Specimen.svelte";
  import Kbd from "../Kbd.svelte";
  import Icon from "../Icon.svelte";
  import AgentIcon from "../AgentIcon.svelte";
  import SplashMark from "../SplashMark.svelte";
  import ContextRing from "../ContextRing.svelte";
  import Picker from "../Picker.svelte";
  import DiffView from "../DiffView.svelte";
  import AddButton from "../ui/AddButton.svelte";
  import ChangeMark from "../ui/ChangeMark.svelte";
  import Checkbox from "../ui/Checkbox.svelte";
  import Chevron from "../ui/Chevron.svelte";
  import ChoiceGroup from "../ui/ChoiceGroup.svelte";
  import CodeView from "../ui/CodeView.svelte";
  import DiffStat from "../ui/DiffStat.svelte";
  import Disclosure from "../ui/Disclosure.svelte";
  import EmptyState from "../ui/EmptyState.svelte";
  import FilterInput from "../ui/FilterInput.svelte";
  import IconButton from "../ui/IconButton.svelte";
  import KeyRecorder from "../ui/KeyRecorder.svelte";
  import MenuItem from "../ui/MenuItem.svelte";
  import Modal from "../ui/Modal.svelte";
  import ModalHeader from "../ui/ModalHeader.svelte";
  import NavItem from "../ui/NavItem.svelte";
  import PathLabel from "../ui/PathLabel.svelte";
  import RevealButton from "../ui/RevealButton.svelte";
  import SegmentedControl from "../ui/SegmentedControl.svelte";
  import StatusBadge from "../ui/StatusBadge.svelte";
  import StepIcon from "../ui/StepIcon.svelte";
  import Switch from "../ui/Switch.svelte";
  import Tabs, { type TabItem } from "../ui/Tabs.svelte";
  import Tag from "../ui/Tag.svelte";
  import Toolbar from "../ui/Toolbar.svelte";
  import SettingsGroup from "../settings/SettingsGroup.svelte";
  import SettingsRow from "../settings/SettingsRow.svelte";
  import PageHeader from "../settings/PageHeader.svelte";
  import { ICONS } from "../../lib/icons";
  import { shortcut } from "../../lib/keybindings.svelte";
  import { CODE_SAMPLE, CWD, DIFF, MODEL_OPTION, MODE_OPTION, usageAt } from "./fixtures";

  // Components this page shows. Anything else in ui/ is listed as missing, so
  // a new component doesn't slip past the playground.
  const SHOWN = new Set([
    "AddButton", "ChangeMark", "Checkbox", "Chevron", "ChoiceGroup", "CodeView", "DiffStat", "Disclosure", "EmptyState",
    "FilterInput", "IconButton", "KeyRecorder", "MenuItem", "Modal", "ModalClose", "ModalHeader", "NavItem", "PathLabel",
    "RevealButton", "SegmentedControl", "StatusBadge", "StepIcon", "Switch", "Tabs", "Tag", "Toolbar",
  ]);
  const uiFiles = Object.keys(import.meta.glob("../ui/*.svelte", { eager: true }));
  const missing = uiFiles.map((f) => f.replace(/^.*\//, "").replace(/\.svelte$/, "")).filter((n) => !SHOWN.has(n));

  const agentIds = Object.keys(import.meta.glob("../../assets/agents/*.svg", { eager: true, query: "?raw", import: "default" }))
    .map((f) => f.replace(/^.*\//, "").replace(/\.svg$/, ""));
  const iconNames = Object.keys(ICONS);

  const TONES = ["default", "muted", "ok", "warn", "err", "accent", "purple", "count"] as const;

  let tabActive = $state("chat");
  let tabItems: TabItem[] = $state([
    { id: "chat", label: "Chat" },
    { id: "log", label: "Log", closable: true },
    { id: "greet", label: "greet.ts", closable: true, title: "src/greet.ts" },
    { id: "diff", label: "greet.ts", prefix: "±", closable: true },
    { id: "changes", label: "Changes", count: 3 },
  ]);
  let navActive = $state("one");
  let navOpen = $state(true);
  let discOpen = $state(false);
  let checked = $state(true);
  let on = $state(true);
  let seg = $state<"unified" | "split">("unified");
  let filter = $state("");
  let choice = $state("worktree");
  let agentChoice = $state("claude");
  let modalOpen = $state(false);
  let model = $state({ ...MODEL_OPTION });
  let mode = $state({ ...MODE_OPTION });
  let menuPick = $state("sonnet");
  const WHERE = [
    { id: "in_place", title: "In place", desc: "Work in the project folder itself" },
    { id: "worktree", title: "Worktree", desc: "A fresh git worktree on its own branch" },
  ];
</script>

{#if missing.length}
  <p class="missing t-meta"><Icon name="alert" size={12} /> Not on this page yet: {missing.join(", ")}</p>
{/if}

<Specimen name="Kbd" source="components/Kbd.svelte" note="Keys come from shortcut(id), never typed by hand.">
  <Kbd keys={shortcut("app.palette") || "⌘ K"} />
  <Kbd keys={shortcut("session.new") || "⌘ N"} />
  <Kbd keys="⌘ ⇧ ⏎" />
  <button class="btn primary">Send <Kbd keys="⌘ ⏎" inline /></button>
  <button class="btn">Close <Kbd keys="Esc" inline /></button>
</Specimen>

<Specimen name="Icon" source="components/Icon.svelte · lib/icons.ts" note="{iconNames.length} glyphs, 16px stroke, currentColor.">
  <div class="icons">
    {#each iconNames as n (n)}
      <span class="icon-cell" title={n}><Icon name={n} /><span class="icon-name mono">{n}</span></span>
    {/each}
  </div>
</Specimen>

<Specimen name="AgentIcon" source="components/AgentIcon.svelte">
  {#each agentIds as id (id)}
    <span class="agent-cell"><AgentIcon {id} size={20} /><AgentIcon {id} size={14} /><span class="mono">{id}</span></span>
  {/each}
</Specimen>

<Specimen name="SplashMark" source="components/SplashMark.svelte">
  <SplashMark size={14} /><SplashMark size={18} /><SplashMark size={24} /><SplashMark size={40} /><SplashMark size={64} />
</Specimen>

<Specimen name="StatusBadge" source="ui/StatusBadge.svelte">
  <StatusBadge tone="ok" label="ready" />
  <StatusBadge tone="warn" label="probe failed" />
  <StatusBadge tone="err" label="signed out" />
  <StatusBadge tone="none" label="not probed" />
</Specimen>

<Specimen name="Tag" source="ui/Tag.svelte">
  {#each TONES as tone (tone)}<Tag {tone}>{tone === "count" ? "12" : tone}</Tag>{/each}
  <Tag off>images</Tag>
</Specimen>

<Specimen name="IconButton" source="ui/IconButton.svelte" note="sm, md, lg; active, pressed, disabled, loading.">
  <IconButton size="sm" icon="refresh" title="Small" />
  <IconButton size="md" icon="refresh" title="Medium" />
  <IconButton size="lg" icon="refresh" title="Large" />
  <span class="sep"></span>
  <IconButton icon="panel-right" title="Active" active />
  <IconButton icon="panel-bottom" title="Pressed" pressed={true} />
  <IconButton icon="panel-bottom" title="Not pressed" pressed={false} />
  <IconButton icon="close" title="Disabled" disabled />
  <IconButton icon="refresh" title="Loading" loading />
</Specimen>

<Specimen name="Chevron, ChangeMark, DiffStat" source="ui/">
  <Chevron /><Chevron open /><Chevron down /><Chevron size={12} />
  <span class="sep"></span>
  {#each ["M", "A", "D", "?", "T"] as s (s)}<ChangeMark status={s} />{/each}
  <span class="sep"></span>
  <DiffStat add={12} del={3} /><DiffStat add={140} /><DiffStat del={8} /><DiffStat binary />
</Specimen>

<Specimen name="StepIcon" source="ui/StepIcon.svelte" note="Tool calls and plan items: done, failed, under way (live: a spinner), to do.">
  {#each ["completed", "failed", "in_progress", "pending"] as s (s)}
    <span class="dot-cell"><StepIcon status={s} /><span class="t-mono-meta">{s}</span></span>
  {/each}
  <span class="dot-cell"><StepIcon status="in_progress" live /><span class="t-mono-meta">in_progress live</span></span>
</Specimen>

<Specimen name="PathLabel, RevealButton" source="ui/PathLabel.svelte · ui/RevealButton.svelte" note="Default cuts the end; start keeps the tail.">
  <div class="stack w-280">
    <PathLabel path="{CWD}/src/components/playground/Playground.svelte" />
    <PathLabel path="{CWD}/src/components/playground/Playground.svelte" cwd={CWD} split />
    <PathLabel path={CWD} muted />
    <PathLabel path="{CWD}/src/components/playground/Playground.svelte" muted start />
  </div>
  <RevealButton path={CWD} />
</Specimen>

<Specimen name="FilterInput" source="ui/FilterInput.svelte">
  <div class="w-280"><FilterInput bind:value={filter} placeholder="Filter commands" shown={filter ? 3 : 12} total={12} /></div>
  <div class="w-280"><FilterInput placeholder="Search" /></div>
</Specimen>

<Specimen name="Checkbox, Switch" source="ui/Checkbox.svelte · ui/Switch.svelte">
  <Checkbox bind:checked label="Per project (3)" />
  <Checkbox checked={false} label="Unchecked" />
  <span class="sep"></span>
  <Switch checked={on} onchange={(v) => (on = v)} label="Notifications" />
  <Switch checked={false} onchange={() => {}} label="Off" />
  <Switch checked={true} onchange={() => {}} label="Disabled" disabled />
</Specimen>

<Specimen name="SegmentedControl" source="ui/SegmentedControl.svelte">
  <SegmentedControl label="Diff layout" value={seg} onchange={(v) => (seg = v)}
    options={[{ value: "unified", label: "Unified" }, { value: "split", label: "Split" }]} />
  <SegmentedControl label="Three" value="b" onchange={() => {}}
    options={[{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }, { value: "c", label: "Gamma", disabled: true }]} />
</Specimen>

<Specimen name="ChoiceGroup" source="ui/ChoiceGroup.svelte" note="list, grid + stack, and icon variants.">
  <div class="stack wide">
    <ChoiceGroup items={agentIds.slice(0, 3)} value={agentChoice} key={(a) => a} label="Agent" onchange={(a) => (agentChoice = a)}
      disabled={(a) => a === agentIds[2]}>
      {#snippet item(a)}<AgentIcon id={a} size={14} /><span>{a}</span><span class="spacer"></span><StatusBadge tone={a === agentIds[2] ? "err" : "ok"} label={a === agentIds[2] ? "not installed" : "ready"} />{/snippet}
    </ChoiceGroup>
    <ChoiceGroup items={WHERE} value={choice} key={(x) => x.id} label="Where it works" layout="grid" variant="stack" onchange={(x) => (choice = x.id)}>
      {#snippet item(x)}<span class="t-label">{x.title}</span><span class="t-item-desc">{x.desc}</span>{/snippet}
    </ChoiceGroup>
    <ChoiceGroup items={agentIds} value={agentChoice} key={(a) => a} label="Agent icon" layout="row" variant="icon" title={(a) => a} onchange={(a) => (agentChoice = a)}>
      {#snippet item(a)}<AgentIcon id={a} size={16} />{/snippet}
    </ChoiceGroup>
  </div>
</Specimen>

<Specimen name="Tabs" source="ui/Tabs.svelte" plain>
  <div class="frame">
    <Tabs items={tabItems} active={tabActive} prefix="pg" label="Playground tabs" onselect={(id) => (tabActive = id)}
      onclose={(id) => { tabItems = tabItems.filter((t) => t.id !== id); if (tabActive === id) tabActive = "chat"; }}>
      {#snippet actions()}<button class="btn sm ghost">Log</button>{/snippet}
    </Tabs>
    <div class="frame-body t-meta" role="tabpanel" id="pg-panel-{tabActive}" aria-labelledby="pg-tab-{tabActive}">Panel: {tabActive}</div>
  </div>
</Specimen>

<Specimen name="Toolbar" source="ui/Toolbar.svelte" plain>
  <div class="frame">
    <Toolbar>
      <span class="t-label">Terminal</span>
      <PathLabel path={CWD} muted />
      {#snippet end()}<IconButton size="sm" icon="refresh" title="Restart" /><IconButton size="sm" icon="close" title="Hide" />{/snippet}
    </Toolbar>
    <Toolbar side>
      <span class="t-label">Side panel toolbar</span>
      {#snippet end()}<DiffStat add={12} del={3} />{/snippet}
    </Toolbar>
  </div>
</Specimen>

<Specimen name="NavItem" source="ui/NavItem.svelte" plain>
  <div class="frame nav">
    <NavItem label="splash-demo" expanded={navOpen} onclick={() => (navOpen = !navOpen)}>
      {#snippet lead()}<Chevron open={navOpen} />{/snippet}
      {#snippet trail()}<span class="t-count">3</span>{/snippet}
    </NavItem>
    {#if navOpen}
      <NavItem label="Add an excited flag" indent={24} active={navActive === "one"} onclick={() => (navActive = "one")}>
        {#snippet lead()}<span class="dot running"></span>{/snippet}
      </NavItem>
      <NavItem label="Fix the flaky test in the store with a very long title that truncates" indent={24} active={navActive === "two"} onclick={() => (navActive = "two")}>
        {#snippet lead()}<span class="dot unread"></span>{/snippet}
      </NavItem>
      <NavItem label="No sessions yet" indent={24} dense muted onclick={() => {}} />
    {/if}
    <NavItem label="New session" onclick={() => {}}>
      {#snippet lead()}<Icon name="plus" size={12} />{/snippet}
      {#snippet trail()}{#if shortcut("session.new")}<Kbd keys={shortcut("session.new")} />{/if}{/snippet}
    </NavItem>
  </div>
</Specimen>

<Specimen name="Disclosure" source="ui/Disclosure.svelte" note="The owner lays out the head.">
  <div class="stack wide">
    <Disclosure class="pg-disclosure" open={discOpen} ontoggle={() => (discOpen = !discOpen)}>
      {#snippet head()}<Chevron open={discOpen} /><span class="t-label">Agent notice</span>{/snippet}
      <pre class="card-code">Loaded 3 MCP servers.</pre>
    </Disclosure>
  </div>
</Specimen>

<Specimen name="MenuItem in a .popover" source="ui/MenuItem.svelte">
  <div class="popover menu" role="listbox" aria-label="Models">
    {#each MODEL_OPTION.choices as c (c.value)}
      <MenuItem role="option" name={c.name} description={c.description} checked={menuPick === c.value} aria-selected={menuPick === c.value} onclick={() => (menuPick = c.value)} />
    {/each}
  </div>
  <div class="popover menu" role="listbox" aria-label="Commands">
    <MenuItem role="option" name="/review" description="Review the current diff" mono inline active />
    <MenuItem role="option" name="/init" description="Write an AGENTS.md" mono inline />
    <MenuItem role="option" name="/compact" mono inline />
  </div>
</Specimen>

<Specimen name="Picker" source="components/Picker.svelte" note="A fake ConfigOption; opens upward.">
  <span class="picker-row">
    <Picker option={mode} onchange={(v) => (mode = { ...mode, current: v })} />
    <Picker option={model} align="right" onchange={(v) => (model = { ...model, current: v })} />
    <Picker option={model} disabled onchange={() => {}} />
  </span>
</Specimen>

<Specimen name="ContextRing" source="components/ContextRing.svelte" note="Hover for the tooltip. Turns warn past 65%, err past 85%.">
  <span class="ring-cell"><ContextRing usage={null} status="idle" /><span class="t-mono-meta">none</span></span>
  {#each [0.1, 0.38, 0.5, 0.7, 0.9, 1] as p (p)}
    <span class="ring-cell"><ContextRing usage={usageAt(p)} status="idle" /><span class="t-mono-meta">{Math.round(p * 100)}%</span></span>
  {/each}
  <span class="ring-cell"><ContextRing usage={usageAt(0.3)} status="running" /><span class="t-mono-meta">running</span></span>
</Specimen>

<Specimen name="EmptyState" source="ui/EmptyState.svelte" plain>
  <div class="empties">
    <div class="frame empty-box"><EmptyState icon="folder" title="No changes yet" detail={CWD} mono /></div>
    <div class="frame empty-box"><EmptyState loading /></div>
    <div class="frame empty-box"><EmptyState icon="alert" error title="Could not read the file" detail="EACCES: permission denied" /></div>
    <div class="frame empty-box"><EmptyState title="What should we work on?" detail="~/code/splash-demo · main" mono>{#snippet graphic()}<SplashMark size={40} />{/snippet}</EmptyState></div>
  </div>
  <div class="frame inline-empty"><EmptyState inline icon="skills" title="No skills yet." /></div>
  <div class="frame inline-empty"><EmptyState inline loading title="Detecting agents…" /></div>
</Specimen>

<Specimen name="AddButton" source="ui/AddButton.svelte">
  <div class="w-280"><AddButton label="Add a project folder" onclick={() => {}} /></div>
</Specimen>

<Specimen name="SettingsGroup, SettingsRow, PageHeader" source="components/settings/" plain>
  <div>
    <PageHeader title="Claude Code" agent="claude">
      {#snippet tags()}<Tag tone="muted">ACP adapter</Tag>{/snippet}
      {#snippet actions()}<button class="btn sm">Refresh</button>{/snippet}
      {#snippet lede()}Anthropic's coding agent, through an ACP adapter.{/snippet}
    </PageHeader>
    <SettingsGroup title="Status">
      <SettingsRow label="Installed" desc="Found on your PATH" value="~/.local/bin/claude" mono />
      <SettingsRow label="Notifications" desc="When a background session finishes or needs you">
        <Switch checked={on} onchange={(v) => (on = v)} label="Notifications" />
      </SettingsRow>
      <SettingsRow label="Skills" desc="12 found" onclick={() => {}}>
        {#snippet trail()}<Chevron size={12} />{/snippet}
      </SettingsRow>
    </SettingsGroup>
  </div>
</Specimen>

<Specimen name="KeyRecorder" source="ui/KeyRecorder.svelte" note="Live: a rebind here changes the real shortcut (Esc cancels, ⌫ clears).">
  <KeyRecorder id="app.palette" />
  <KeyRecorder id="view.terminal" />
</Specimen>

<Specimen name="Modal, ModalHeader, ModalClose" source="ui/Modal.svelte · ui/ModalHeader.svelte · ui/ModalClose.svelte">
  <button class="btn" onclick={() => (modalOpen = true)}>Open a modal</button>
</Specimen>

<Specimen name="CodeView" source="ui/CodeView.svelte" plain>
  <div class="frame code"><CodeView text={CODE_SAMPLE} path="load.ts" /></div>
</Specimen>

<Specimen name="DiffView" source="components/DiffView.svelte" note="Unified, then split." plain>
  <div class="frame diff"><DiffView oldText={DIFF.old} newText={DIFF.new} path={DIFF.path} /></div>
  <div class="frame diff"><DiffView oldText={DIFF.old} newText={DIFF.new} path={DIFF.path} mode="split" /></div>
</Specimen>

{#if modalOpen}
  <Modal label="Playground modal" width="480px" onclose={() => (modalOpen = false)}>
    <ModalHeader title="A modal" onclose={() => (modalOpen = false)}>
      <Tag tone="muted">demo</Tag>
      {#snippet actions()}<button class="btn sm ghost">Action</button>{/snippet}
    </ModalHeader>
    <div class="modal-body">
      <p class="t-body">Esc, a click outside, or the close button closes it. Tab stays inside.</p>
      <input class="field" placeholder="Type here" />
      <div class="modal-actions">
        <button class="btn" onclick={() => (modalOpen = false)}>Cancel</button>
        <button class="btn primary" onclick={() => (modalOpen = false)}>OK</button>
      </div>
    </div>
  </Modal>
{/if}

<style>
  .missing { display: flex; align-items: center; gap: 6px; margin: 0 0 16px; color: var(--warn-dim); }
  .sep { width: 1px; align-self: stretch; background: var(--border); }
  .stack { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
  .stack.wide { flex: 1; max-width: 560px; }
  .w-280 { width: 280px; }
  .icons { display: grid; grid-template-columns: repeat(auto-fill, minmax(104px, 1fr)); gap: 4px; width: 100%; }
  .icon-cell { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 10px 4px; border-radius: var(--radius); color: var(--text-2); }
  .icon-cell:hover { background: var(--row-hover); color: var(--text); } /* hover-only: not focusable */
  .dot-cell { display: inline-flex; align-items: center; gap: 6px; }
  .icon-name { font-size: var(--fs-xs); color: var(--muted); }
  .agent-cell { display: inline-flex; align-items: center; gap: 8px; padding: 4px 8px; font-size: var(--fs-sm); color: var(--text-2); }
  .frame { border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--bg); overflow: hidden; min-width: 0; }
  .frame + .frame { margin-top: 8px; }
  .frame-body { padding: 16px; }
  .stack :global(.pg-disclosure) { align-items: center; gap: 6px; border-radius: var(--radius-sm); }
  .nav { width: 300px; padding: 6px; background: var(--surface); }
  .menu { width: 260px; align-self: flex-start; }
  .picker-row { display: flex; align-items: center; gap: 8px; }
  .ring-cell { display: inline-flex; flex-direction: column; align-items: center; gap: 4px; }
  .empties { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 8px; margin-bottom: 8px; }
  .empties .frame + .frame { margin-top: 0; }
  .empty-box { height: 200px; }
  .inline-empty { background: var(--surface); }
  .code { height: 240px; }
  .diff { max-height: 360px; overflow: auto; }
  .modal-body { display: flex; flex-direction: column; gap: 12px; padding: 16px; }
  .modal-body p { margin: 0; }
  .modal-actions { display: flex; justify-content: flex-end; gap: 8px; }
</style>
