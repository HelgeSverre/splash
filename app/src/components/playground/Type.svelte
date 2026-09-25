<script lang="ts">
  // The type scale, weights, line heights, families and the .t-* text roles.
  import { tokenGroups, textRoles, computed } from "./tokens";
  import { tweaks } from "./tweaks.svelte";

  const all = tokenGroups().flatMap((g) => g.tokens);
  const pick = (prefix: string) => all.filter((t) => t.name.startsWith(prefix));
  const sizes = pick("--fs-");
  const weights = pick("--fw-");
  const heights = pick("--lh-");
  const families = pick("--font-");
  const roles = textRoles();

  const value = (name: string) => (void tweaks.version, computed(name));
  const SAMPLE = "Run coding agents side by side";
  const PARA =
    "Each agent gets its own session, in place or in a worktree. Permissions, plans and diffs show up in the transcript as they happen, and the composer stays put at the bottom.";
</script>

<h3 class="t-group">Sizes</h3>
<div class="rows">
  {#each sizes as t (t.name)}
    <div class="row">
      <span class="label"><span class="mono">{t.name}</span><span class="dim mono">{value(t.name)}</span></span>
      <span class="sample truncate" style:font-size="var({t.name})">{SAMPLE}</span>
      <span class="sample mono truncate" style:font-size="var({t.name})">src/greet.ts:42</span>
      {#if t.note}<span class="dim note">{t.note}</span>{/if}
    </div>
  {/each}
</div>

<h3 class="t-group">Weights</h3>
<div class="rows">
  {#each weights as t (t.name)}
    <div class="row">
      <span class="label"><span class="mono">{t.name}</span><span class="dim mono">{value(t.name)}</span></span>
      <span class="sample" style:font-weight="var({t.name})" style:font-size="var(--fs-md)">{SAMPLE}</span>
    </div>
  {/each}
</div>

<h3 class="t-group">Line heights</h3>
<div class="leading">
  {#each heights as t (t.name)}
    <div class="lead-card">
      <span class="label"><span class="mono">{t.name}</span><span class="dim mono">{value(t.name)}</span></span>
      <p style:line-height="var({t.name})">{PARA}</p>
    </div>
  {/each}
</div>

<h3 class="t-group">Families</h3>
<div class="rows">
  {#each families as t (t.name)}
    <div class="row">
      <span class="label"><span class="mono">{t.name}</span></span>
      <span class="sample" style:font-family="var({t.name})" style:font-size="var(--fs-md)">Splash 0123456789 ⌘⌥⇧⏎ {"{ } => !="}</span>
    </div>
  {/each}
</div>

<h3 class="t-group">Text roles</h3>
<div class="rows">
  {#each roles as r (r)}
    <div class="row">
      <span class="label"><span class="mono">.{r}</span></span>
      <span class="{r} truncate">{r.includes("mono") || r === "t-code" || r === "t-count" ? "~/code/splash · 1,204" : SAMPLE}</span>
    </div>
  {/each}
</div>

<style>
  h3 { margin: 20px 0 8px; }
  h3:first-child { margin-top: 0; }
  .rows { border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--surface); }
  .row { display: grid; grid-template-columns: 200px minmax(0, 1fr) minmax(0, 0.6fr); align-items: baseline; gap: 2px 16px; padding: 8px 12px; }
  .row + .row { border-top: 1px solid var(--border); }
  .note { grid-column: 2 / -1; font-size: var(--fs-xs); }
  .label { display: flex; gap: 8px; align-items: baseline; font-size: var(--fs-sm); color: var(--text-2); }
  .dim { color: var(--muted); font-size: var(--fs-xs); }
  .sample { color: var(--text); }
  .leading { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 8px; }
  .lead-card { padding: 10px 12px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); }
  .lead-card p { margin: 6px 0 0; color: var(--text-2); }
</style>
