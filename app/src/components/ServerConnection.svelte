<script lang="ts">
  import { connection, checkConnection, signOut } from '../lib/server.svelte';
  import { showError } from '../lib/system';
</script>
<div class="server-connection" data-testid="server-connection" data-status={connection.status} class:offline={connection.status === 'offline' || connection.status === 'auth'}>
  <div><strong data-testid="server-name">{connection.name || 'Splash server'}</strong><span role="status" data-testid="server-status">{connection.status === 'online' ? 'Connected · files and agents run on this server' : connection.status === 'syncing' ? 'Restoring your workspace…' : connection.status === 'connecting' ? 'Connecting…' : connection.status === 'auth' ? 'Sign in again to reconnect' : 'Connection lost · reconnecting'}</span></div>
  {#if connection.status === 'auth'}<button class="btn sm" data-testid="server-sign-in" onclick={() => location.reload()}>Sign in</button>
  {:else if connection.status === 'offline'}<button class="btn sm" data-testid="server-retry" disabled={connection.checking} onclick={checkConnection}>{connection.checking ? 'Checking…' : 'Retry connection'}</button>
  {:else}<button class="btn sm ghost" data-testid="server-sign-out" onclick={() => signOut().catch(showError)}>Sign out</button>{/if}
  {#if connection.error}<p data-testid="server-error">{connection.error}</p>{/if}
</div>
<style>
  .server-connection { flex: none; display: flex; align-items: center; flex-wrap: wrap; gap: 10px; padding: 9px 18px; border-bottom: 1px solid var(--border); background: var(--panel); font-size: var(--fs-xs); }
  .server-connection > div { flex: 1; display: flex; gap: 12px; align-items: baseline; flex-wrap: wrap; } strong { color: var(--text); } span, p { color: var(--muted); } p { flex-basis: 100%; margin: 0; } .offline { border-bottom-color: var(--accent); }
</style>
