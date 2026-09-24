<script lang="ts">
  import { onDestroy } from "svelte";
  import { api, channel, type RpcLine } from "../bindings";

  let { session }: { session: string } = $props();
  let lines: RpcLine[] = $state([]);
  let filter = $state("");
  let open: Record<number, boolean> = $state({});
  let scroller: HTMLDivElement | undefined = $state();
  let follow = $state(true);

  api.rpc_log(session).then((l) => (lines = l));
  api.watch_rpc(session, true);
  const unsubscribe = channel("rpc").subscribe((l) => {
    if (!l || l.session !== session) return;
    lines.push(l);
    if (lines.length > 5000) lines.splice(0, lines.length - 5000);
  });
  onDestroy(() => {
    unsubscribe();
    api.watch_rpc(session, false);
  });

  type Parsed = { method: string; id: string; kind: string; json: any };
  function parse(l: RpcLine): Parsed {
    try {
      const j = JSON.parse(l.line);
      const kind = j.method ? (j.id !== undefined ? "request" : "notify") : j.error ? "error" : "result";
      let method = j.method ?? "";
      if (method === "session/update") method += ` · ${j.params?.update?.sessionUpdate ?? ""}`;
      return { method, id: j.id !== undefined ? String(j.id).slice(0, 8) : "", kind, json: j };
    } catch {
      return { method: "(not json)", id: "", kind: "error", json: l.line };
    }
  }

  const shown = $derived.by(() => {
    const q = filter.toLowerCase();
    const all = lines.map((l, i) => ({ l, i, p: parse(l) }));
    return (q ? all.filter((x) => x.l.line.toLowerCase().includes(q)) : all).slice(-2000);
  });

  $effect(() => {
    void shown.length;
    if (follow && scroller) queueMicrotask(() => scroller && (scroller.scrollTop = scroller.scrollHeight));
  });

  const time = (t: number) => new Date(t * 1000).toLocaleTimeString([], { hour12: false }) + "." + String(Math.floor((t % 1) * 1000)).padStart(3, "0");
</script>

<div class="log">
  <div class="bar">
    <input class="field" bind:value={filter} placeholder="Filter (method, text…)" />
    <label><input type="checkbox" bind:checked={follow} /> follow</label>
    <span class="count">{shown.length} / {lines.length} lines</span>
  </div>
  <div class="lines selectable" bind:this={scroller}>
    {#each shown as { l, i, p } (i)}
      <div class="line {p.kind}">
        <button class="plain summary" onclick={() => (open[i] = !open[i])}>
          <span class="t">{time(l.at)}</span>
          <span class="dir {l.dir}">{l.dir === "out" ? "→" : "←"}</span>
          <span class="kind">{p.kind}</span>
          <span class="method">{p.method}</span>
          {#if p.id}<span class="id">#{p.id}</span>{/if}
          {#if !open[i]}<span class="preview">{l.line.slice(0, 160)}</span>{/if}
        </button>
        {#if open[i]}<pre>{JSON.stringify(p.json, null, 2)}</pre>{/if}
      </div>
    {:else}
      <div class="empty">No traffic yet. Every JSON-RPC line between Splash and the agent shows up here.</div>
    {/each}
  </div>
</div>

<style>
  .log { height: 100%; display: flex; flex-direction: column; }
  .bar { display: flex; gap: 12px; align-items: center; padding: 8px 16px; border-bottom: 1px solid var(--border); }
  .bar .field { width: 280px; padding: 4px 8px; font-size: 12px; }
  .bar label { display: flex; gap: 6px; align-items: center; color: var(--text-2); font-size: 12px; }
  .count { margin-left: auto; color: var(--muted); font: 11px var(--font-mono); }
  .lines { flex: 1; overflow: auto; font: 11.5px/1.5 var(--font-mono); padding: 4px 0; }
  .summary { display: flex; gap: 10px; width: 100%; padding: 1px 16px; white-space: nowrap; }
  .summary:hover { background: var(--soft); }
  .t { color: var(--faint); flex: none; }
  .dir { flex: none; width: 10px; }
  .dir.out { color: var(--info); }
  .dir.in { color: var(--ok); }
  .kind { flex: none; width: 52px; color: var(--muted); }
  .error .kind { color: var(--err); }
  .method { flex: none; color: var(--text); }
  .id { flex: none; color: var(--faint); }
  .preview { color: var(--muted); overflow: hidden; text-overflow: ellipsis; }
  pre { margin: 2px 16px 8px 120px; padding: 8px 10px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); white-space: pre-wrap; word-break: break-all; color: var(--text-2); }
  .empty { padding: 24px 16px; color: var(--muted); font-family: var(--font-ui); }
</style>
