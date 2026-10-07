<script lang="ts">
  // The slash-command list over the message box: shows while the draft is
  // "/word" with no space yet. The box hands its keys to `keydown` first.
  import MenuItem from "./ui/MenuItem.svelte";
  import { rovingIndex } from "../lib/focus";
  import type { SlashCommand } from "../bindings";

  let { text, commands, oncomplete }: { text: string; commands: SlashCommand[]; oncomplete: (name: string) => void } = $props();
  let pick = $state(0);

  const shown = $derived.by(() => {
    const m = /^\/(\S*)$/.exec(text);
    if (!m) return [];
    const q = m[1].toLowerCase();
    return commands
      .filter((c) => c.name.toLowerCase().includes(q))
      .sort((a, b) => Number(!a.name.toLowerCase().startsWith(q)) - Number(!b.name.toLowerCase().startsWith(q)))
      .slice(0, 8);
  });
  $effect(() => {
    void shown.length;
    pick = 0;
  });

  /** Arrows move the pick, Tab (or ⏎ on a partial name) completes it. True when the key was the menu's. */
  export function keydown(e: KeyboardEvent): boolean {
    if (!shown.length) return false;
    // Only the arrows: Home and End stay the message box's.
    const next = e.key === "ArrowDown" || e.key === "ArrowUp" ? rovingIndex(e, pick, shown.length, "vertical") : null;
    if (next !== null) {
      e.preventDefault();
      pick = next;
      return true;
    }
    if (e.key === "Tab" || (e.key === "Enter" && !e.shiftKey && text.length > 1 && !shown.some((c) => c.name === text.slice(1)))) {
      e.preventDefault();
      oncomplete(shown[pick].name);
      return true;
    }
    return false;
  }
</script>

{#if shown.length}
  <div class="slash popover" data-testid="slash-menu">
    {#each shown as c, i (c.name)}
      <MenuItem data-testid="slash-command" data-name={c.name} data-active={i === pick} name="/{c.name}" description={c.description} mono inline active={i === pick}
        onmousedown={(e) => { e.preventDefault(); oncomplete(c.name); }} />
    {/each}
  </div>
{/if}

<style>
  .slash {
    position: absolute; left: 28px; right: 28px; bottom: calc(100% - 30px); z-index: 5; max-height: 280px; overflow: auto;
  }
</style>
