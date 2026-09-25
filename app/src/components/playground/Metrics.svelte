<script lang="ts">
  // Heights, gutters, radii, and the focus ring in each of its forms.
  import { tokenGroups, computed } from "./tokens";
  import { tweaks } from "./tweaks.svelte";

  const all = tokenGroups().flatMap((g) => g.tokens);
  const heights = all.filter((t) => /^--(h-|control-h|row-h)/.test(t.name));
  const gutters = all.filter((t) => t.name.startsWith("--gutter"));
  const radii = all.filter((t) => t.name.startsWith("--radius"));
  const focus = all.filter((t) => t.name.startsWith("--focus"));
  const value = (name: string) => (void tweaks.version, computed(name));
</script>

<h3 class="t-group">Heights</h3>
<div class="bars">
  {#each heights as t (t.name)}
    <div class="bar-row">
      <span class="label"><span class="mono">{t.name}</span><span class="dim mono">{value(t.name)}</span></span>
      <span class="bar" style:height="var({t.name})"></span>
      {#if t.note}<span class="dim">{t.note}</span>{/if}
    </div>
  {/each}
</div>

<h3 class="t-group">Gutters</h3>
<div class="bars">
  {#each gutters as t (t.name)}
    <div class="bar-row">
      <span class="label"><span class="mono">{t.name}</span><span class="dim mono">{value(t.name)}</span></span>
      <span class="gutter"><span class="pad" style:width="var({t.name})"></span><span class="content">content</span></span>
      {#if t.note}<span class="dim">{t.note}</span>{/if}
    </div>
  {/each}
</div>

<h3 class="t-group">Radii</h3>
<div class="radii">
  {#each radii as t (t.name)}
    <div class="radius-card">
      <span class="box" style:border-radius="var({t.name})"></span>
      <span class="mono">{t.name}</span>
      <span class="dim mono">{value(t.name)}</span>
    </div>
  {/each}
</div>

<h3 class="t-group">Focus ring</h3>
<p class="t-meta lede">Static copies of each ring, then live controls: press Tab through them.</p>
<dl class="focus-tokens">
  {#each focus as t (t.name)}<dt class="mono">{t.name}</dt><dd class="mono">{value(t.name)}</dd>{/each}
</dl>
<div class="rings">
  <div class="ring-demo">
    <span class="btn ring-outside">Outside</span>
    <span class="dim">buttons, links, cards</span>
  </div>
  <div class="ring-demo">
    <span class="row-sample ring-inside">Inside</span>
    <span class="dim">tabs, rows, radios, menus</span>
  </div>
  <div class="ring-demo">
    <span class="field-sample">Field</span>
    <span class="dim">text fields use the border</span>
  </div>
</div>
<div class="live">
  <button class="btn">Button</button>
  <button class="btn primary">Primary</button>
  <button class="plain focus-inset row-sample">Inset row</button>
  <input class="field" placeholder="Text field" />
  <a href="#/playground" class="link" onclick={(e) => e.preventDefault()}>A link</a>
</div>

<style>
  h3 { margin: 20px 0 8px; }
  h3:first-child { margin-top: 0; }
  .label { display: flex; gap: 8px; align-items: baseline; width: 200px; flex: none; font-size: var(--fs-sm); color: var(--text-2); }
  .dim { color: var(--muted); font-size: var(--fs-xs); }
  .bars { display: flex; flex-direction: column; gap: 6px; }
  .bar-row { display: flex; align-items: center; gap: 16px; }
  .bar { width: 160px; flex: none; background: var(--accent-soft); border: 1px solid var(--accent-border); border-radius: var(--radius-sm); }
  .gutter { display: flex; width: 160px; flex: none; height: var(--control-h-sm); border: 1px solid var(--border-strong); border-radius: var(--radius-sm); overflow: hidden; }
  .pad { flex: none; background: var(--accent-soft); }
  .content { flex: 1; display: flex; align-items: center; padding-left: 4px; font-size: var(--fs-xs); color: var(--muted); }
  .radii { display: flex; flex-wrap: wrap; gap: 16px; }
  .radius-card { display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: var(--fs-sm); }
  .box { width: 72px; height: 48px; background: var(--raised); border: 1px solid var(--border-strong); }
  .lede { margin: 0 0 8px; max-width: 80ch; }
  .focus-tokens { display: grid; grid-template-columns: max-content auto; gap: 2px 12px; margin: 0 0 16px; font-size: var(--fs-xs); }
  .focus-tokens dt { color: var(--text-2); }
  .focus-tokens dd { margin: 0; color: var(--muted); }
  .rings { display: flex; flex-wrap: wrap; gap: 24px; margin-bottom: 16px; }
  .ring-demo { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
  .ring-outside { outline: var(--focus-ring-width) solid var(--focus-ring-color); outline-offset: var(--focus-ring-offset); cursor: default; }
  .row-sample { display: inline-flex; align-items: center; height: var(--row-h); padding: 0 10px; min-width: 140px; background: var(--soft); border-radius: var(--radius); color: var(--text); }
  .ring-inside { outline: var(--focus-ring-width) solid var(--focus-ring-color); outline-offset: var(--focus-ring-inset); }
  .field-sample {
    display: inline-flex; align-items: center; height: var(--control-h); padding: 0 10px; min-width: 140px;
    background: var(--surface); border: 1px solid var(--focus-field-border); border-radius: var(--radius); color: var(--muted);
  }
  .live { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
  .link { color: var(--text-2); font-size: var(--fs-sm); }
</style>
