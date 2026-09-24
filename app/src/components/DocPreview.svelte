<script lang="ts">
  // Read-only preview of a skill or command: the markdown rendered (or its
  // source), with the frontmatter parsed out into a side panel.
  import AgentIcon from "./AgentIcon.svelte";
  import Icon from "./Icon.svelte";
  import Markdown from "./entries/Markdown.svelte";
  import Modal from "./ui/Modal.svelte";
  import IconButton from "./ui/IconButton.svelte";
  import RevealButton from "./ui/RevealButton.svelte";
  import CodeView from "./ui/CodeView.svelte";
  import Tag from "./ui/Tag.svelte";
  import { preview } from "../lib/state.svelte";
  import { home } from "../lib/paths";
  import { api, type Doc } from "../bindings";

  const d = $derived(preview.doc!);
  let doc: Doc | null = $state(null);
  let error = $state("");
  let mode: "rendered" | "source" = $state("rendered");

  $effect(() => {
    const path = d.path;
    doc = null;
    error = "";
    if (path) api.read_doc(path).then((x) => (doc = x)).catch((e) => (error = String(e?.message ?? e)));
  });

  // Friendly names for the keys agents actually act on.
  const LABELS: Record<string, string> = {
    name: "Name",
    description: "Description",
    "allowed-tools": "Allowed tools",
    "argument-hint": "Arguments",
    model: "Model",
    "user-invocable": "In / menu",
    "disable-model-invocation": "Manual only",
    hidden: "Hidden (marker)",
    license: "License",
    version: "Version",
  };
  const label = (k: string) => LABELS[k] ?? k.replace(/[-_]/g, " ").replace(/^./, (c) => c.toUpperCase());
  const asList = (v: unknown): string[] | null =>
    Array.isArray(v) ? v.map(String) : typeof v === "string" && /^[\w().:*, -]+$/.test(v) && v.includes(",") ? v.split(",").map((s) => s.trim()) : null;
  const close = () => (preview.doc = null);
</script>

<Modal label="{d.kind} preview" width="940px" height="660px" onclose={close}>
  <div class="head">
    <AgentIcon id={d.agent} size={16} />
    <span class="title">{d.title}</span>
    <Tag>{d.kind}</Tag>
    {#if d.path}<span class="path" title={d.path}>{home(d.path)}</span>{/if}
    <span class="spacer"></span>
    {#if doc}
      <div class="seg-control">
        <button class:on={mode === "rendered"} onclick={() => (mode = "rendered")}>Rendered</button>
        <button class:on={mode === "source"} onclick={() => (mode = "source")}>Source</button>
      </div>
    {/if}
    {#if d.path}<RevealButton path={d.path} />{/if}
    <IconButton title="Close (Esc)" onclick={close}><Icon name="close" size={14} /></IconButton>
  </div>

  <div class="body">
    <div class="main">
      {#if !d.path}
        <div class="builtin">
          <p class="big">{d.title}</p>
          {#if d.description}<p>{d.description}</p>{/if}
          {#if d.hint}<p class="muted">Arguments: <code>{d.hint}</code></p>{/if}
          <p class="muted">Built into the agent — there's no file behind this command.</p>
        </div>
      {:else if error}
        <div class="note err">{error}</div>
      {:else if !doc}
        <div class="note"><span class="spinner"></span></div>
      {:else if mode === "rendered"}
        <div class="rendered"><Markdown text={doc.body} /></div>
      {:else}
        <CodeView text={doc.body} path="doc.md" />
      {/if}
    </div>

    {#if doc?.frontmatter.length}
      <aside class="front">
        <div class="front-title">Frontmatter</div>
        {#each doc?.frontmatter ?? [] as f (f.key)}
          {@const list = asList(f.value)}
          <div class="field">
            <div class="k" title={f.key}>{label(f.key)}</div>
            {#if typeof f.value === "boolean"}
              <div class="v"><Tag tone={f.value ? "ok" : "default"}>{f.value ? "on" : "off"}</Tag></div>
            {:else if list}
              <div class="v chips">{#each list as item (item)}<Tag>{item}</Tag>{/each}</div>
            {:else if typeof f.value === "string"}
              <div class="v text">{f.value}</div>
            {:else}
              <pre class="v json">{JSON.stringify(f.value, null, 2)}</pre>
            {/if}
          </div>
        {/each}
      </aside>
    {/if}
  </div>
</Modal>

<style>
  .head { display: flex; align-items: center; gap: 10px; padding: 12px 12px 12px 18px; border-bottom: 1px solid var(--border); min-width: 0; }
  .title { font-weight: 600; font-size: 14px; flex: none; }
  .path { font: 11.5px var(--font-mono); color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
  .spacer { flex: 1; }
  .body { flex: 1; min-height: 0; display: flex; }
  .main { flex: 1; min-width: 0; overflow: auto; user-select: text; }
  .rendered { padding: 22px 28px 40px; max-width: 720px; }
  .front { width: 260px; flex: none; overflow: auto; border-left: 1px solid var(--border); background: var(--surface); padding: 14px 16px; }
  .front-title { font-size: 11px; font-weight: 600; color: var(--muted); margin-bottom: 10px; }
  .field { margin-bottom: 12px; }
  .k { font-size: 11.5px; color: var(--muted); margin-bottom: 3px; }
  .v { font-size: 12.5px; color: var(--text); user-select: text; }
  .v.text { white-space: pre-wrap; overflow-wrap: anywhere; line-height: 1.45; }
  .v.chips { display: flex; flex-wrap: wrap; gap: 4px; }
  .v.json { margin: 0; font: 11.5px var(--font-mono); color: var(--text-2); white-space: pre-wrap; }
  .builtin { padding: 28px; color: var(--text-2); max-width: 60ch; }
  .builtin .big { font: 600 18px var(--font-mono); color: var(--accent); margin: 0 0 10px; }
  .muted { color: var(--muted); }
  code { font: 12px var(--font-mono); }
  .note { padding: 28px; color: var(--muted); }
  .note.err { color: var(--err-dim); }
</style>
