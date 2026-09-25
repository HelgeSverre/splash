<script lang="ts">
  // The hidden design-system page (#/playground, or "Design system
  // playground" in the command palette): tokens, every shared component and
  // a transcript of fixtures, with live token tweaks and layout overlays.
  import IconButton from "../ui/IconButton.svelte";
  import Checkbox from "../ui/Checkbox.svelte";
  import Tag from "../ui/Tag.svelte";
  import NavItem from "../ui/NavItem.svelte";
  import SegmentedControl from "../ui/SegmentedControl.svelte";
  import Colors from "./Colors.svelte";
  import Type from "./Type.svelte";
  import Metrics from "./Metrics.svelte";
  import Controls from "./Controls.svelte";
  import Components from "./Components.svelte";
  import SessionFrame from "./SessionFrame.svelte";
  import { tokenGroups, computed, isColor } from "./tokens";
  import { tweaks, applyTweaks, resetTweaks, tweaked } from "./tweaks.svelte";
  import { closePlayground } from "../../lib/route.svelte";

  const SECTIONS = [
    { id: "colors", title: "Colours", lede: "Every colour token in app.css :root. Click one to copy it." },
    { id: "type", title: "Type", lede: "The scale, weights, line heights, families and text roles." },
    { id: "metrics", title: "Sizes, radii, focus", lede: "Bar heights, control heights, gutters, corner radii and the focus ring." },
    { id: "controls", title: "Controls", lede: "The global classes: buttons, fields, choice cards, dots and cards." },
    { id: "components", title: "Components", lede: "Every shared component, live." },
    { id: "transcript", title: "Transcript", lede: "The real Transcript fed one entry of every kind." },
  ];

  // Accent presets are other tokens, so no colour is typed here.
  const ACCENTS = ["", "--info", "--ok", "--purple", "--ansi-cyan", "--err", "--text"];
  const scaleOptions = (list: number[]) => list.map((s) => ({ value: String(s), label: `${Math.round(s * 100)}%` }));
  const TYPE_SCALES = scaleOptions([0.9, 1, 1.1, 1.2]);
  const RADIUS_SCALES = scaleOptions([0, 0.5, 1, 1.5, 2]);

  const tokenNames = tokenGroups().flatMap((g) => g.tokens.map((t) => t.name));
  let overrideName = $state("");
  let overrideValue = $state("");
  const accentHex = $derived((void tweaks.version, computed("--accent")));
  const dirty = $derived((void tweaks.version, tweaked()));

  let scroller: HTMLDivElement | undefined = $state();
  let current = $state(SECTIONS[0].id);

  function go(id: string) {
    scroller?.querySelector(`#pg-${id}`)?.scrollIntoView({ block: "start" });
  }

  function onscroll() {
    if (!scroller) return;
    const top = scroller.getBoundingClientRect().top + 80;
    let at = SECTIONS[0].id;
    for (const s of SECTIONS) {
      const el = scroller.querySelector(`#pg-${s.id}`);
      if (el && el.getBoundingClientRect().top <= top) at = s.id;
    }
    current = at;
  }

  function setAccent(value: string) {
    tweaks.accent = value;
    applyTweaks();
  }

  function applyOverride(e: SubmitEvent) {
    e.preventDefault();
    const name = overrideName.trim();
    if (!name.startsWith("--")) return;
    tweaks.custom[name] = overrideValue.trim();
    applyTweaks();
  }

  function pickOverride() {
    if (tokenNames.includes(overrideName)) overrideValue = computed(overrideName);
  }
</script>

<div class="pg">
  <header class="bar">
    <span class="t-pane-title">Design system</span>
    <Tag tone="muted">playground</Tag>
    <span class="spacer"></span>
    <IconButton size="md" icon="close" title="Close the playground" onclick={closePlayground} />
  </header>

  <div class="tweaks" role="toolbar" aria-label="Tweaks">
    <div class="group" role="group" aria-label="Accent">
      <span class="t-meta">Accent</span>
      {#each ACCENTS as a (a)}
        <button class="plain swatch" aria-pressed={tweaks.accent === a} title={a ? `var(${a})` : "The stylesheet's accent"} onclick={() => setAccent(a)}>
          <span class="fill" style:background={a ? `var(${a})` : "var(--accent)"} class:default={!a}></span>
        </button>
      {/each}
      <input class="color" type="color" aria-label="Custom accent" value={isColor(accentHex) && accentHex.startsWith("#") && accentHex.length === 7 ? accentHex : undefined}
        oninput={(e) => setAccent(e.currentTarget.value)} />
    </div>
    <span class="group"><span class="t-meta">Type</span>
      <SegmentedControl label="Type scale" options={TYPE_SCALES} value={String(tweaks.typeScale)}
        onchange={(v) => { tweaks.typeScale = Number(v); applyTweaks(); }} />
    </span>
    <span class="group"><span class="t-meta">Radius</span>
      <SegmentedControl label="Radius scale" options={RADIUS_SCALES} value={String(tweaks.radiusScale)}
        onchange={(v) => { tweaks.radiusScale = Number(v); applyTweaks(); }} />
    </span>
    <form class="group" onsubmit={applyOverride}>
      <input class="field mini mono token" list="pg-tokens" placeholder="--token" aria-label="Token" bind:value={overrideName} onchange={pickOverride} />
      <input class="field mini mono" placeholder="value" aria-label="Value" bind:value={overrideValue} />
      <button class="btn sm" disabled={!overrideName.startsWith("--")}>Set</button>
      <datalist id="pg-tokens">{#each tokenNames as n (n)}<option value={n}></option>{/each}</datalist>
    </form>
    <span class="group">
      <Checkbox bind:checked={tweaks.grid} label="Grid" />
      <Checkbox bind:checked={tweaks.baseline} label="Baseline" />
      <Checkbox bind:checked={tweaks.outlines} label="Outlines" />
    </span>
    <span class="spacer"></span>
    <button class="btn sm ghost" disabled={!dirty} onclick={resetTweaks} title="Tweaks last until you reset or reload">Reset tweaks</button>
  </div>

  <div class="main">
    <nav class="toc" aria-label="Playground sections">
      {#each SECTIONS as s (s.id)}
        <NavItem label={s.title} active={current === s.id} onclick={() => go(s.id)} />
      {/each}
    </nav>

    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <div class="scroller scroll-region" bind:this={scroller} {onscroll} tabindex="0" role="region" aria-label="Playground">
      <div class="content" class:outlines={tweaks.outlines}>
        {#each SECTIONS as s (s.id)}
          <section id="pg-{s.id}" aria-labelledby="pg-h-{s.id}">
            <h2 class="t-page-title" id="pg-h-{s.id}">{s.title}</h2>
            <p class="lede t-meta">{s.lede}</p>
            {#if s.id === "colors"}<Colors />
            {:else if s.id === "type"}<Type />
            {:else if s.id === "metrics"}<Metrics />
            {:else if s.id === "controls"}<Controls />
            {:else if s.id === "components"}<Components />
            {:else if s.id === "transcript"}<SessionFrame />
            {/if}
          </section>
        {/each}
        {#if tweaks.grid || tweaks.baseline}
          <div class="overlay" class:grid={tweaks.grid} class:baseline={tweaks.baseline} aria-hidden="true"></div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .pg { height: 100%; display: flex; flex-direction: column; min-width: 0; background: var(--bg); }
  .bar {
    display: flex; align-items: center; gap: 10px; flex: none;
    height: var(--h-header); padding: 0 12px 0 var(--gutter); border-bottom: 1px solid var(--border);
  }
  .tweaks {
    display: flex; flex-wrap: wrap; align-items: center; gap: 8px 16px; flex: none;
    min-height: var(--h-toolbar); padding: 6px var(--gutter); border-bottom: 1px solid var(--border); background: var(--surface);
  }
  .group { display: inline-flex; align-items: center; gap: 6px; margin: 0; }
  .swatch { display: inline-grid; place-items: center; width: 20px; height: 20px; border-radius: var(--radius-sm); border: 1px solid var(--border); }
  .swatch[aria-pressed="true"] { border-color: var(--text-2); }
  .fill { width: 12px; height: 12px; border-radius: 50%; }
  .fill.default { box-shadow: 0 0 0 1px var(--border-strong); }
  .color { width: 24px; height: 20px; padding: 0; border: 1px solid var(--border); border-radius: var(--radius-sm); background: none; cursor: pointer; }
  .mini { height: var(--control-h-xs); padding: 0 6px; font-size: var(--fs-sm); }
  .mini.token { width: 132px; }
  input.mini:not(.token) { width: 96px; }
  .main { flex: 1; min-height: 0; display: flex; }
  .toc {
    flex: none; width: 180px; display: flex; flex-direction: column; gap: 1px;
    padding: 12px 8px; background: var(--surface); border-right: 1px solid var(--border); overflow-y: auto;
  }
  .scroller { flex: 1; min-width: 0; overflow-y: auto; }
  .content { position: relative; max-width: 1100px; padding: 24px 32px 64px; }
  section + section { margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--border); }
  h2 { margin-bottom: 4px; }
  .lede { margin: 0 0 20px; }
  .overlay { position: absolute; inset: 0; pointer-events: none; z-index: 5; }
  .overlay.grid {
    background-image:
      linear-gradient(to right, var(--debug-grid) 1px, transparent 1px),
      linear-gradient(to right, var(--debug-grid-soft) 1px, transparent 1px);
    background-size: 64px 100%, 8px 100%;
  }
  .overlay.baseline {
    background-image: linear-gradient(to bottom, var(--debug-baseline) 1px, transparent 1px);
    background-size: 100% 4px;
  }
  .overlay.grid.baseline {
    background-image:
      linear-gradient(to right, var(--debug-grid) 1px, transparent 1px),
      linear-gradient(to right, var(--debug-grid-soft) 1px, transparent 1px),
      linear-gradient(to bottom, var(--debug-baseline) 1px, transparent 1px);
    background-size: 64px 100%, 8px 100%, 100% 4px;
  }
  /* Every box outlined, except the one with keyboard focus: its ring shows through. */
  .outlines :global(*:not(:focus-visible)) { outline: 1px solid var(--debug-outline); outline-offset: -1px; }
</style>
