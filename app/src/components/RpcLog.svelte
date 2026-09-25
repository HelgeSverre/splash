<script lang="ts">
  import { onDestroy } from "svelte";
  import { api, channel, type RpcLine } from "../bindings";
  import EmptyState from "./ui/EmptyState.svelte";
  import Toolbar from "./ui/Toolbar.svelte";
  import FilterInput from "./ui/FilterInput.svelte";
  import Checkbox from "./ui/Checkbox.svelte";
  import Disclosure from "./ui/Disclosure.svelte";

  let { session }: { session: string } = $props();
  let lines: RpcLine[] = $state([]);
  let filter = $state("");
  let open: Record<number, boolean> = $state({});
  let scroller: HTMLDivElement | undefined = $state();
  let follow = $state(true);

  // The log belongs to one session: the tab is recreated per session, so
  // reading the prop once here is deliberate.
  // svelte-ignore state_referenced_locally
  api.rpc_log(session).then((l) => (lines = l));
  // svelte-ignore state_referenced_locally
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
  <Toolbar>
    <span class="search"><FilterInput bind:value={filter} placeholder="Filter (method, text…)" label="Filter the log" shown={shown.length} total={lines.length} unit="lines" /></span>
    {#snippet end()}<Checkbox bind:checked={follow} label="Follow" />{/snippet}
  </Toolbar>
  <div class="lines selectable" bind:this={scroller}>
    {#each shown as { l, i, p } (i)}
      <div class="line {p.kind}">
        <Disclosure class="summary" open={!!open[i]} ontoggle={() => (open[i] = !open[i])}>
          {#snippet head()}
            <span class="t">{time(l.at)}</span>
            <span class="dir {l.dir}">{l.dir === "out" ? "→" : "←"}</span>
            <span class="kind">{p.kind}</span>
            <span class="method">{p.method}</span>
            {#if p.id}<span class="id">#{p.id}</span>{/if}
            {#if !open[i]}<span class="preview">{l.line.slice(0, 160)}</span>{/if}
          {/snippet}
          <pre class="card-code">{JSON.stringify(p.json, null, 2)}</pre>
        </Disclosure>
      </div>
    {:else}
      <EmptyState icon="terminal" title="No traffic yet." detail="JSON-RPC between Splash and the agent shows up here." />
    {/each}
  </div>
</div>

<style>
  .log { height: 100%; display: flex; flex-direction: column; }
  .search { display: flex; width: 360px; max-width: 60%; }
  .search :global(.filter) { height: var(--control-h-sm); min-width: 0; }
  .lines { flex: 1; overflow: auto; display: flex; flex-direction: column; font: var(--fs-xs)/var(--lh-base) var(--font-mono); padding: 4px 0; }
  .line :global(.summary) { gap: 10px; padding: 1px var(--gutter); white-space: nowrap; }
  .line :global(.summary:is(:hover, :focus-visible)) { background: var(--row-hover); }
  .t { color: var(--faint); flex: none; }
  .dir { flex: none; width: 10px; }
  .dir.out { color: var(--info); }
  .dir.in { color: var(--ok-dim); }
  .kind { flex: none; width: 52px; color: var(--muted); }
  .error .kind { color: var(--err-dim); }
  .method { flex: none; color: var(--text); font-weight: var(--fw-medium); }
  .id { flex: none; color: var(--muted); }
  .preview { color: var(--text-2); overflow: hidden; text-overflow: ellipsis; }
  /* Indented to line up under the method column. */
  pre { margin: 2px var(--gutter) 8px 120px; font-size: var(--fs-xs); word-break: break-all; }
</style>
