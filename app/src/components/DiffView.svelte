<script lang="ts">
  import { diffLines } from "diff";
  import { highlightLines } from "../lib/highlight";

  let {
    oldText,
    newText,
    path = "",
    mode = "unified",
    context = 3,
    maxHeight = "none",
  }: {
    oldText: string;
    newText: string;
    /** The file's path, for syntax highlighting (by extension). */
    path?: string;
    mode?: "unified" | "split";
    context?: number;
    maxHeight?: string;
  } = $props();

  // Highlight each side whole (multi-line strings and comments stay right),
  // then take each row's line from its side: deletions from the old text,
  // additions and context from the new.
  const oldLines = $derived(highlightLines(oldText, path));
  const newLines = $derived(highlightLines(newText, path));

  type Row = { kind: "ctx" | "add" | "del" | "gap"; a?: number; b?: number; text: string };
  const html = (r: Row | undefined) =>
    !r ? "" : (r.kind === "del" ? oldLines[(r.a ?? 1) - 1] : newLines[(r.b ?? 1) - 1]) ?? "";

  const rows = $derived.by(() => {
    const out: Row[] = [];
    let a = 1;
    let b = 1;
    for (const part of diffLines(oldText, newText)) {
      const lines = part.value.replace(/\n$/, "").split("\n");
      for (const text of lines) {
        if (part.added) out.push({ kind: "add", b: b++, text });
        else if (part.removed) out.push({ kind: "del", a: a++, text });
        else out.push({ kind: "ctx", a: a++, b: b++, text });
      }
    }
    // Collapse unchanged runs longer than 2×context into a gap marker.
    if (context < 0) return out;
    const keep = out.map((r) => r.kind !== "ctx");
    out.forEach((r, i) => {
      if (r.kind !== "ctx") for (let j = Math.max(0, i - context); j <= Math.min(out.length - 1, i + context); j++) keep[j] = true;
    });
    const shown: Row[] = [];
    let skipped = 0;
    out.forEach((r, i) => {
      if (keep[i]) {
        if (skipped) shown.push({ kind: "gap", text: `⋯ ${skipped} unchanged line${skipped === 1 ? "" : "s"}` });
        skipped = 0;
        shown.push(r);
      } else skipped++;
    });
    if (skipped) shown.push({ kind: "gap", text: `⋯ ${skipped} unchanged line${skipped === 1 ? "" : "s"}` });
    return shown;
  });

  /** Pair deletions with additions for side-by-side. */
  const pairs = $derived.by(() => {
    const out: { l?: Row; r?: Row; gap?: string }[] = [];
    let i = 0;
    while (i < rows.length) {
      const r = rows[i];
      if (r.kind === "gap") { out.push({ gap: r.text }); i++; continue; }
      if (r.kind === "ctx") { out.push({ l: r, r }); i++; continue; }
      const dels: Row[] = [];
      const adds: Row[] = [];
      while (i < rows.length && rows[i].kind === "del") dels.push(rows[i++]);
      while (i < rows.length && rows[i].kind === "add") adds.push(rows[i++]);
      for (let k = 0; k < Math.max(dels.length, adds.length); k++) out.push({ l: dels[k], r: adds[k] });
    }
    return out;
  });

</script>

<!-- A scroll pane: tabindex so the keyboard reaches it in WebKit too. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div class="diff syntax selectable scroll-region" style:max-height={maxHeight} tabindex="0" role="region" aria-label="Diff">
  {#if mode === "unified"}
    <table>
      <tbody>
        {#each rows as r, i (i)}
          {#if r.kind === "gap"}
            <tr class="gap"><td colspan="3">{r.text}</td></tr>
          {:else}
            <tr class={r.kind}>
              <td class="ln">{r.a ?? ""}</td>
              <td class="ln">{r.b ?? ""}</td>
              <td class="code"><span class="sign">{r.kind === "add" ? "+" : r.kind === "del" ? "-" : " "}</span>{@html html(r)}</td>
            </tr>
          {/if}
        {/each}
      </tbody>
    </table>
  {:else}
    <table class="split">
      <tbody>
        {#each pairs as p, i (i)}
          {#if p.gap}
            <tr class="gap"><td colspan="4">{p.gap}</td></tr>
          {:else}
            <tr>
              <td class="ln">{p.l?.a ?? ""}</td>
              <td class="code {p.l && p.l.kind === 'del' ? 'del' : ''}">{@html html(p.l)}</td>
              <td class="ln">{p.r?.b ?? ""}</td>
              <td class="code {p.r && p.r.kind === 'add' ? 'add' : ''}">{@html html(p.r)}</td>
            </tr>
          {/if}
        {/each}
      </tbody>
    </table>
  {/if}
</div>

<style>
  .diff { overflow: auto; font: var(--fs-sm)/var(--lh-code) var(--font-mono); background: var(--surface); }
  table { border-collapse: collapse; width: 100%; }
  td { padding: 0 8px; white-space: pre; vertical-align: top; }
  .ln { width: 1%; color: var(--faint); text-align: right; user-select: none; padding: 0 6px; }
  .code { color: var(--text-2); }
  .sign { color: var(--faint); user-select: none; margin-right: 6px; }
  tr.add td, td.add { background: var(--add-bg); }
  tr.del td, td.del { background: var(--del-bg); }
  tr.add .code, td.add, tr.del .code, td.del { color: var(--text); }
  tr.add .sign { color: var(--ok); }
  tr.del .sign { color: var(--err); }
  .gap td { color: var(--muted); background: var(--soft); padding: 2px 10px; font-size: var(--fs-xs); }
  .split .code { width: 50%; }
</style>
