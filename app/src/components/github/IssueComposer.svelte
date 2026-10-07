<script lang="ts">
  import { toast } from "@elyra/runtime";
  import { api } from "../../bindings";
  import { github, rememberIssue } from "../../lib/github.svelte";
  import { errorMessage } from "../../lib/format";
  import { openExternal } from "../../lib/system";
  import Markdown from "../entries/Markdown.svelte";
  import Modal from "../ui/Modal.svelte";
  import ModalHeader from "../ui/ModalHeader.svelte";
  import FilterInput from "../ui/FilterInput.svelte";
  import Icon from "../Icon.svelte";

  let search = $state("");
  let preview = $state(false);
  let pending = $state(false);
  let error = $state("");
  const repositories = $derived((github.catalog?.repositories ?? []).filter(r => r.has_issues && !r.archived));
  const choices = $derived(repositories.filter(r => r.full_name === github.draft.repository || r.full_name.toLowerCase().includes(search.toLowerCase())));
  const validRepo = $derived(repositories.some(r => r.full_name === github.draft.repository));
  function close() { if (!pending) github.issueOpen = false; }
  async function submit(e: SubmitEvent) {
    e.preventDefault();
    if (pending || !validRepo || !github.draft.title.trim()) return;
    pending = true; error = "";
    try {
      const issue = await api.github_create_issue(github.draft.repository, github.draft.title, github.draft.body);
      rememberIssue(issue);
      github.draft = { repository: "", title: "", body: "" };
      github.issueOpen = false;
      toast(`Created ${issue.repository} #${issue.number}`);
    } catch (e) { error = errorMessage(e); }
    finally { pending = false; }
  }
</script>

<Modal data-testid="issue-composer" label="New GitHub issue" width="680px" onclose={close}>
  <ModalHeader title="New issue" onclose={close} />
  <form onsubmit={submit}>
    <div class="fields">
      <label class="t-group" for="issue-repo">Repository</label>
      <FilterInput data-testid="issue-repo-filter" bind:value={search} placeholder="Find any repository…" />
      <select class="field" id="issue-repo" data-testid="issue-repo" bind:value={github.draft.repository} required disabled={pending}>
        <option value="" disabled>Choose a repository</option>
        {#each choices as r (r.full_name)}<option value={r.full_name}>{r.full_name}</option>{/each}
      </select>
      <p class="t-meta">All accessible repositories with issues enabled. Your current GitHub permissions apply.</p>
      <label class="t-group" for="issue-title">Title</label>
      <input class="field" id="issue-title" data-testid="issue-title" bind:value={github.draft.title} placeholder="What needs to happen?" required maxlength="256" disabled={pending} />
      <div class="editor-head">
        <label class="t-group" for="issue-body">Description</label><span class="spacer"></span>
        <button type="button" class="btn ghost sm" data-testid="issue-write" aria-pressed={!preview} onclick={() => preview = false}>Write</button>
        <button type="button" class="btn ghost sm" data-testid="issue-preview" aria-pressed={preview} onclick={() => preview = true}>Preview</button>
      </div>
      {#if preview}
        <div class="preview" data-testid="issue-preview-pane">{#if github.draft.body}<Markdown text={github.draft.body} />{:else}<span class="t-meta">Nothing to preview.</span>{/if}</div>
      {:else}
        <textarea class="field" id="issue-body" data-testid="issue-body" bind:value={github.draft.body} placeholder="Add context, a checklist, or a thought for later…" maxlength="65536" disabled={pending}></textarea>
      {/if}
      <span class="t-meta">GitHub-flavoured Markdown supported. Closing keeps your draft until you leave Splash.</span>
      {#if error}<div class="error" role="alert" data-testid="issue-error">{error}<button type="button" class="btn sm" data-testid="issue-check-github" onclick={() => openExternal(`https://github.com/${github.draft.repository}/issues`)}>Check issues on GitHub</button></div>{/if}
    </div>
    <footer><button type="button" class="btn ghost" data-testid="issue-cancel" onclick={close} disabled={pending}>Cancel</button><span class="spacer"></span><button class="btn primary" type="submit" data-testid="issue-create" disabled={pending || !validRepo || !github.draft.title.trim()}>{#if pending}<span class="spinner"></span>{:else}<Icon name="plus" size={13} />{/if}{pending ? "Creating…" : "Create issue"}</button></footer>
  </form>
</Modal>

<style>
  form { display: flex; flex-direction: column; min-height: 0; }
  .fields { padding: 18px; display: flex; flex-direction: column; gap: 9px; overflow: auto; }
  p { margin: 0 0 6px; }
  .editor-head, footer { display: flex; align-items: center; gap: 6px; }
  .editor-head { margin-top: 6px; }
  textarea { resize: vertical; min-height: 220px; font-family: var(--font-mono); font-size: var(--fs-sm); line-height: var(--lh-code); }
  .preview { min-height: 220px; padding: 12px; border: 1px solid var(--border); border-radius: var(--radius); }
  footer { padding: 12px 18px; border-top: 1px solid var(--border); flex: none; }
  .error { color: var(--del-fg); white-space: pre-wrap; overflow-wrap: anywhere; display: flex; align-items: start; gap: 8px; flex-direction: column; }
  button[aria-pressed="true"] { color: var(--accent); background: var(--accent-soft); }
</style>
