<script lang="ts">
  // A path in mono, cut off at the end when there's no room, the full path on
  // hover. With `cwd` it reads relative to the session folder, otherwise ~.
  // `split` dims the folder part so the file name reads first; `muted` is the
  // quieter, smaller one for meta lines (a dialog head, the terminal bar).
  // `start` cuts the front instead and keeps the tail, the part that tells
  // similar paths apart (project folders, storage locations).
  import { rel } from "../../lib/paths";

  let {
    path,
    cwd,
    split = false,
    muted = false,
    start = false,
  }: { path: string; cwd?: string; split?: boolean; muted?: boolean; start?: boolean } = $props();

  const shown = $derived(rel(path, cwd));
  const cut = $derived(split ? shown.lastIndexOf("/") + 1 : 0);
</script>

<span class="path" class:muted class:start title={path}
  >{#if start}<bdi>{shown}</bdi>{:else}{#if cut}<span class="dir">{shown.slice(0, cut)}</span>{/if}{shown.slice(cut)}{/if}</span>

<style>
  .path {
    flex: 0 1 auto; min-width: 0; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    font: var(--fs-sm) var(--font-mono); color: var(--text);
  }
  .muted { font-size: var(--fs-xs); color: var(--muted); }
  /* Right to left puts the ellipsis at the front; <bdi> keeps the path itself
     reading left to right. */
  .start { direction: rtl; text-align: left; }
  .dir { color: var(--muted); }
</style>
