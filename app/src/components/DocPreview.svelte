<script lang="ts">
  // Read-only preview of a skill or command: the markdown rendered (or its
  // source), with the frontmatter parsed out into a side panel.
  import AgentIcon from "./AgentIcon.svelte";
  import Markdown from "./entries/Markdown.svelte";
  import Modal from "./ui/Modal.svelte";
  import ModalHeader from "./ui/ModalHeader.svelte";
  import RevealButton from "./ui/RevealButton.svelte";
  import CodeView from "./ui/CodeView.svelte";
  import Tag from "./ui/Tag.svelte";
  import FilePane from "./FilePane.svelte";
  import SegmentedControl from "./ui/SegmentedControl.svelte";
  import PathLabel from "./ui/PathLabel.svelte";
  import { preview } from "../lib/customize.svelte";
  import { api } from "../bindings";
  import { load } from "../lib/load.svelte";

  const d = $derived(preview.doc!);
  let mode: "rendered" | "source" = $state("rendered");
  const res = load(() => (d.path ? api.read_doc(d.path) : null), true);
  const doc = $derived(res.value);

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

<Modal data-testid="doc-preview" data-kind={d.kind} label="{d.kind} preview" width="940px" height="660px" onclose={close}>
  <ModalHeader title={d.title} onclose={close}>
    {#snippet icon()}<AgentIcon id={d.agent} size={16} />{/snippet}
    <Tag>{d.kind}</Tag>
    {#if d.path}<PathLabel path={d.path} muted />{/if}
    {#snippet actions()}
      {#if doc}
        <SegmentedControl data-testid="doc-preview-view" label="View" value={mode} onchange={(m) => (mode = m)}
          options={[{ value: "rendered", label: "Rendered" }, { value: "source", label: "Source" }]} />
      {/if}
      {#if d.path}<RevealButton path={d.path} size="lg" />{/if}
    {/snippet}
  </ModalHeader>

  <div class="body">
    <!-- Scroll panes: tabindex so the keyboard reaches them in WebKit too. -->
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <div class="main scroll-region" data-testid="doc-preview-document" data-mode={mode} tabindex="0" role="region" aria-label="Document">
      {#if !d.path}
        <div class="builtin" data-testid="doc-preview-builtin">
          <p class="big t-page-title">{d.title}</p>
          {#if d.description}<p>{d.description}</p>{/if}
          {#if d.hint}<p class="muted">Arguments: <code>{d.hint}</code></p>{/if}
          <p class="muted">Built into the agent. No file.</p>
        </div>
      {:else}
        <FilePane {res}>
          {#snippet children(doc)}
            {#if mode === "rendered"}
              <div class="rendered"><Markdown text={doc.body} /></div>
            {:else}
              <CodeView text={doc.body} path="doc.md" />
            {/if}
          {/snippet}
        </FilePane>
      {/if}
    </div>

    {#if doc?.frontmatter.length}
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <aside class="front scroll-region" data-testid="doc-preview-frontmatter" tabindex="0" aria-label="Frontmatter">
        <div class="front-title t-section">Frontmatter</div>
        {#each doc?.frontmatter ?? [] as f (f.key)}
          {@const list = asList(f.value)}
          <div class="field" data-testid="doc-preview-field" data-key={f.key}>
            <div class="k" title={f.key}>{label(f.key)}</div>
            {#if typeof f.value === "boolean"}
              <div class="v"><Tag tone={f.value ? "ok" : "default"}>{f.value ? "on" : "off"}</Tag></div>
            {:else if list}
              <div class="v chips">{#each list as item}<Tag data-testid="doc-preview-chip">{item}</Tag>{/each}</div>
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
  .body { flex: 1; min-height: 0; display: flex; }
  .main { flex: 1; min-width: 0; overflow: auto; user-select: text; }
  .rendered { padding: 22px 28px 40px; max-width: 720px; }
  .front { width: 260px; flex: none; overflow: auto; border-left: 1px solid var(--border); background: var(--surface); padding: 14px 16px; }
  .front-title { margin-bottom: 10px; }
  .field { margin-bottom: 12px; }
  .k { font-size: var(--fs-xs); color: var(--muted); margin-bottom: 3px; }
  .v { font-size: var(--fs-sm); color: var(--text); user-select: text; }
  .v.text { white-space: pre-wrap; overflow-wrap: anywhere; line-height: var(--lh-base); }
  .v.chips { display: flex; flex-wrap: wrap; gap: 4px; }
  .v.json { margin: 0; font: var(--fs-sm)/var(--lh-code) var(--font-mono); color: var(--text-2); white-space: pre-wrap; }
  .builtin { padding: 28px; color: var(--text-2); max-width: 60ch; }
  .builtin .big { margin: 0 0 10px; }
  code { font-size: var(--fs-sm); }
</style>
