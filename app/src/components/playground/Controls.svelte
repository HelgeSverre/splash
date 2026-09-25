<script lang="ts">
  // The global classes from app.css: buttons, fields, choices, dots, cards.
  import Specimen from "./Specimen.svelte";
  import Icon from "../Icon.svelte";
  import Kbd from "../Kbd.svelte";
  import ChoiceGroup from "../ui/ChoiceGroup.svelte";

  let picked = $state("b");
  const CHOICES = [
    { id: "a", label: "First" },
    { id: "b", label: "Picked" },
    { id: "c", label: "Third" },
    { id: "d", label: "Disabled", off: true },
  ];
  const DOTS = ["starting", "running", "awaiting_permission", "idle", "unread", "error", "exited", "ok", "warn", "err"];
</script>

<Specimen name=".btn" source="app.css" note="Default, primary, ghost, danger; .sm; disabled.">
  <button class="btn">Default</button>
  <button class="btn primary">Primary</button>
  <button class="btn ghost">Ghost</button>
  <button class="btn danger">Delete</button>
  <button class="btn"><Icon name="plus" size={12} />With icon</button>
  <button class="btn">Palette <Kbd keys="⌘ K" inline /></button>
  <span class="sep"></span>
  <button class="btn sm">Small</button>
  <button class="btn sm primary">Small primary</button>
  <button class="btn sm ghost">Small ghost</button>
  <span class="sep"></span>
  <button class="btn" disabled>Disabled</button>
  <button class="btn primary" disabled>Primary disabled</button>
</Specimen>

<Specimen name="Fields" source="app.css" note="input.field, .sm, textarea.field, select.field, .field-box with .bare-input.">
  <div class="grid">
    <input class="field" placeholder="input.field" />
    <input class="field sm" placeholder="input.field.sm" />
    <select class="field"><option>select.field</option><option>Second</option></select>
    <label class="field-box boxed"><Icon name="search" size={12} /><input class="bare-input" placeholder=".field-box + .bare-input" /></label>
    <textarea class="field" rows="3" placeholder="textarea.field"></textarea>
    <input class="field" value="Disabled" disabled />
  </div>
</Specimen>

<Specimen name=".choice" source="app.css · ui/ChoiceGroup.svelte" note="Radio cards, always through ChoiceGroup: one Tab stop, the arrows pick.">
  <ChoiceGroup items={CHOICES} value={picked} key={(c) => c.id} disabled={(c) => !!c.off} label="Choices" layout="row"
    onchange={(c) => (picked = c.id)}>
    {#snippet item(c)}{c.label}{/snippet}
  </ChoiceGroup>
</Specimen>

<Specimen name=".dot, .spinner" source="app.css">
  {#each DOTS as d (d)}<span class="dot-cell"><span class="dot {d}"></span><span class="t-mono-meta">{d}</span></span>{/each}
  <span class="dot-cell"><span class="spinner"></span><span class="t-mono-meta">spinner</span></span>
</Specimen>

<Specimen name=".card, .card-code, .kv" source="app.css">
  <div class="stack">
    <div class="card t-body">A .card holds a boxed block in the transcript or a pane.</div>
    <pre class="card-code selectable">$ npm test
  ✓ greet (3 ms)
  ✓ greet excited (1 ms)</pre>
    <pre class="card-code err selectable">error: authentication required</pre>
    <div class="kv card">
      <span class="kv-k">Agent</span><span>Claude Code</span>
      <span class="kv-k">Branch</span><span class="t-mono-value">splash/excited-greet</span>
      <span class="kv-k">Context</span><span>76k of 200k</span>
      <span class="kv-full t-meta">A full-width line under the values.</span>
    </div>
  </div>
</Specimen>

<Specimen name=".t-section, .reveal-on-hover" source="app.css">
  <div class="stack">
    <span class="t-section">Eyebrow over a rail</span>
    <div class="hover-row">Hover or focus this row <button class="btn sm ghost reveal-on-hover">Revealed</button></div>
  </div>
</Specimen>

<style>
  .sep { width: 1px; align-self: stretch; background: var(--border); }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; width: 100%; align-items: start; }
  .boxed { display: flex; align-items: center; gap: 6px; height: var(--control-h); padding: 0 8px; background: var(--surface); color: var(--muted); }
  .dot-cell { display: inline-flex; align-items: center; gap: 6px; }
  .stack { display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 560px; }
  .hover-row { display: flex; align-items: center; gap: 8px; padding: 4px 8px; border: 1px dashed var(--border-strong); border-radius: var(--radius); }
</style>
