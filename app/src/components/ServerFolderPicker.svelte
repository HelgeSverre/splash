<script lang="ts">
  import { api, type FolderListing } from '../bindings';
  import { connection } from '../lib/server.svelte';
  import { finishFolderPicker } from '../lib/folder-picker.svelte';
  import { errorMessage } from '../lib/format';
  import { basename } from '../lib/paths';
  import Modal from './ui/Modal.svelte';
  import ModalHeader from './ui/ModalHeader.svelte';
  let path = $state('');
  let result = $state<FolderListing | null>(null);
  let busy = $state(false);
  let error = $state('');
  let generation = 0;
  async function browse(target: string | null) {
    const mine = ++generation;
    busy = true; error = '';
    try {
      const listing = await api.browse_folders(target);
      if (mine !== generation) return;
      result = listing; path = listing.path;
    } catch (e) { if (mine === generation) error = errorMessage(e); }
    finally { if (mine === generation) busy = false; }
  }
  void browse(null);
  function close() { generation++; finishFolderPicker(null); }
</script>
<Modal label="Add a folder on the server" onclose={close} width="680px">
  <ModalHeader title="Add a folder on the server" onclose={close} />
  <div class="body">
    <p>Choose a project on <strong>{connection.name || 'the Splash server'}</strong>. These folders are on the server, not this browser’s device.</p>
    <form onsubmit={(e) => { e.preventDefault(); void browse(path); }}>
      <label for="server-folder-path">Server folder path</label>
      <div class="path-row"><input id="server-folder-path" bind:value={path} placeholder="/home/you/code" autocomplete="off" spellcheck="false" /><button class="btn" disabled={busy}>Go</button></div>
    </form>
    <div class="navigation"><button class="btn sm" disabled={busy} onclick={() => browse(null)}>Home</button><button class="btn sm" disabled={busy || !result?.parent} onclick={() => browse(result?.parent ?? null)}>Up one folder</button></div>
    {#if error}<p class="error" role="alert">{error}</p>{/if}
    <div class="folders" aria-busy={busy}>
      {#if busy}<p role="status">Loading folders…</p>
      {:else if result}
        {#each result.folders as folder}<button class="folder" onclick={() => browse(folder)}><span>{basename(folder)}</span><span aria-hidden="true">›</span></button>{/each}
        {#if !result.folders.length}<p>No visible subfolders. You can select this folder or enter another path.</p>{/if}
        {#if result.truncated}<p>Showing the first 1,000 folders. Enter a path to open another folder.</p>{/if}
      {/if}
    </div>
    <div class="footer"><button class="btn" onclick={close}>Cancel</button><button class="btn primary" disabled={busy || !result || !!error || path !== result.path} onclick={() => finishFolderPicker(result!.path)}>Add this folder</button></div>
  </div>
</Modal>
<style>
  .body { padding: 20px; overflow: auto; } p { color: var(--muted); font-size: var(--fs-sm); line-height: 1.5; } strong { color: var(--text); } label { display: block; font-size: var(--fs-sm); margin: 18px 0 8px; }
  .path-row { display: flex; gap: 8px; } input { flex: 1; min-width: 0; font-family: var(--font-mono); } .navigation { display: flex; gap: 8px; margin: 14px 0; }
  .folders { min-height: 120px; max-height: 280px; overflow: auto; border: 1px solid var(--border); border-radius: var(--radius); padding: 6px; } .folders p { padding: 8px; }
  .folder { width: 100%; display: flex; justify-content: space-between; padding: 10px; border: 0; background: transparent; text-align: left; color: var(--text); border-radius: var(--radius); } .folder:is(:hover, :focus-visible) { background: var(--row-hover); }
  .footer { display: flex; justify-content: flex-end; gap: 8px; margin-top: 18px; } .error { color: var(--del-fg); }
</style>
