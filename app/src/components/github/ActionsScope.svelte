<script lang="ts">
  import { github } from "../../lib/github.svelte";
  import { repositorySelection, scopedRepositories } from "../../lib/github-actions.svelte";
  import { selectMatching } from "../../lib/github-model";
  import { prefs, setPref } from "../../lib/prefs.svelte";
  import Modal from "../ui/Modal.svelte";
  import ModalHeader from "../ui/ModalHeader.svelte";
  import FilterInput from "../ui/FilterInput.svelte";
  let picker = $state(false), query = $state("");
  let draft = $state<string[] | null>(null);
  const repositories = $derived(github.catalog?.repositories ?? []);
  const owners = $derived([...new Set(repositories.map(r=>r.owner))].sort());
  const matches = $derived(repositories.filter(r=>r.full_name.toLowerCase().includes(query.toLowerCase())));
  const scoped = $derived(scopedRepositories());
  function choose(selected: boolean) { draft = selectMatching(draft, repositories.map(r=>r.full_name), matches.map(r=>r.full_name), selected); }
</script>
<div class="scope">
  <select class="field" aria-label="Actions owner" value={prefs["github.owner"] ?? ""} onchange={e=>setPref("github.owner",e.currentTarget.value)}><option value="">All owners</option>{#each owners as owner}<option value={owner}>{owner}</option>{/each}</select>
  <button class="btn" onclick={()=>{ draft=repositorySelection(); query=""; picker=true; }}>Repositories <span class="t-count">{scoped.length}</span></button>
  <button class="btn ghost" aria-pressed={prefs["github.linked"] === "true"} onclick={()=>setPref("github.linked",String(prefs["github.linked"] !== "true"))}>Linked to Splash</button>
  <span class="t-meta">Scope shared with GitHub triage</span>
</div>
{#if picker}
  <Modal label="Actions repositories" width="650px" height="620px" onclose={()=>picker=false}>
    <ModalHeader title="Repositories" onclose={()=>picker=false} />
    <div class="tools"><FilterInput bind:value={query} placeholder="Search repositories across owners…" /><div class="buttons"><button class="btn ghost sm" onclick={()=>draft=null}>All repositories</button><button class="btn ghost sm" onclick={()=>draft=[]}>Clear all</button><button class="btn ghost sm" onclick={()=>choose(true)}>Select matches ({matches.length})</button><button class="btn ghost sm" onclick={()=>choose(false)}>Deselect matches</button></div><p class="t-meta">{draft?.length ?? repositories.length} selected. All repositories also includes future repositories.</p></div>
    <div class="repos">{#each matches as repo}<label><input type="checkbox" checked={draft === null || draft.includes(repo.full_name)} onchange={e=>draft=selectMatching(draft,repositories.map(r=>r.full_name),[repo.full_name],e.currentTarget.checked)} /><span>{repo.full_name}<small class="t-meta">{repo.private ? "Private" : "Public"}{repo.archived ? " · Archived" : ""}</small></span></label>{:else}<p class="t-meta">No matching repositories.</p>{/each}</div>
    <div class="buttons foot"><button class="btn ghost" onclick={()=>picker=false}>Cancel</button><span class="spacer"></span><button class="btn primary" onclick={()=>{ void setPref("github.repositories",JSON.stringify(draft)); picker=false; }}>Apply scope</button></div>
  </Modal>
{/if}
<style>
  .scope,.buttons { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
  .scope select { max-width:200px; }
  button[aria-pressed="true"] { color:var(--accent); background:var(--accent-soft); }
  .tools { padding:16px 18px 0; } .buttons { margin-top:8px; }
  .repos { flex:1; overflow:auto; padding:0 18px; min-height:0; }
  .repos label { display:flex; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid var(--border); overflow-wrap:anywhere; }
  small { display:block; } input { accent-color:var(--accent); }
  .foot { border-top:1px solid var(--border); padding:12px 18px; }
</style>
