<script lang="ts">
  // Every colour token, grouped as in app.css, with its source and its
  // computed value. Click a swatch to copy `var(--name)`.
  import { toast } from "@elyra/runtime";
  import { copyText } from "../../lib/system";
  import { tokenGroups, computed, isColor } from "./tokens";
  import { tweaks } from "./tweaks.svelte";

  const groups = tokenGroups();

  const colourGroups = $derived.by(() => {
    void tweaks.version;
    return groups
      .map((g) => ({
        title: g.title,
        tokens: g.tokens.map((t) => ({ ...t, value: computed(t.name) })).filter((t) => isColor(t.value)),
      }))
      .filter((g) => g.tokens.length);
  });

  const shadows = $derived.by(() => {
    void tweaks.version;
    return groups.flatMap((g) => g.tokens).filter((t) => t.name.startsWith("--shadow")).map((t) => ({ ...t, value: computed(t.name) }));
  });

  function copy(name: string) {
    copyText(`var(${name})`).then((ok) => ok && toast(`Copied var(${name})`, { duration: 1500 }));
  }
</script>

{#each colourGroups as g (g.title)}
  <h3 class="t-group">{g.title}</h3>
  <div class="swatches">
    {#each g.tokens as t (t.name)}
      <button class="plain swatch" onclick={() => copy(t.name)} title="Copy var({t.name}){t.note ? `\n${t.note}` : ""}">
        <span class="chip"><span class="fill" style:background="var({t.name})"></span></span>
        <span class="meta">
          <span class="name mono">{t.name}</span>
          {#if t.source !== t.value}<span class="src mono">{t.source}</span>{/if}
          <span class="val mono">{t.value}</span>
        </span>
      </button>
    {/each}
  </div>
{/each}

{#if shadows.length}
  <h3 class="t-group">Shadows</h3>
  <div class="shadows">
    {#each shadows as s (s.name)}
      <div class="shadow-card" style:box-shadow="var({s.name})">
        <span class="name mono">{s.name}</span>
        <span class="val mono">{s.value}</span>
      </div>
    {/each}
  </div>
{/if}

<style>
  h3 { margin: 20px 0 8px; }
  h3:first-child { margin-top: 0; }
  .swatches { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px; }
  /* One height for every card, text from the top, whether or not it has a source line. */
  .swatch {
    display: flex; align-items: flex-start; gap: 10px; min-width: 0; min-height: 62px; padding: 6px;
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
  }
  .swatch:is(:hover, :focus-visible) { border-color: var(--border-strong); }
  .chip {
    flex: none; width: 36px; height: 36px; border-radius: var(--radius-sm);
    border: 1px solid var(--border-strong);
    /* A checkerboard behind translucent tokens. */
    background-image: conic-gradient(var(--soft) 25%, var(--raised) 0 50%, var(--soft) 0 75%, var(--raised) 0);
    background-size: 8px 8px; overflow: hidden;
  }
  .fill { display: block; width: 100%; height: 100%; }
  .meta { display: flex; flex-direction: column; min-width: 0; line-height: var(--lh-tight); }
  .name { font-size: var(--fs-sm); color: var(--text); }
  .src, .val { font-size: var(--fs-xs); color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .src { color: var(--text-2); }
  .shadows { display: flex; flex-wrap: wrap; gap: 24px; padding: 8px 0 16px; }
  .shadow-card {
    display: flex; flex-direction: column; gap: 4px; width: 260px; padding: 16px;
    background: var(--surface); border: 1px solid var(--border-strong); border-radius: var(--radius-lg);
  }
</style>
