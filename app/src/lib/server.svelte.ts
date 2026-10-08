import { api } from '../bindings';

export type ServerInfo = { name: string; instance: string; token: string; version?: string };
declare global { var __SPLASH_SERVER__: ServerInfo | undefined; }
export const serverMode = !!globalThis.__SPLASH_SERVER__;
export const workspaceClient = crypto.randomUUID();
export const connection = $state({ status: 'connecting' as 'connecting' | 'online' | 'offline' | 'auth' | 'syncing', name: globalThis.__SPLASH_SERVER__?.name ?? '', error: '', recovered: 0 });
const unavailable = $derived(serverMode && connection.status !== 'online');
/** True in the web version while commands can't reach the server: connecting,
 * restoring the workspace, signed out or connection lost. Never in the desktop app. */
export const serverUnavailable = () => unavailable;
let checking = false;
let ready = false;
let recoveryNeeded = false;
let reconcile: (() => Promise<void>) | undefined;
let knownInstance = '';
let soon: ReturnType<typeof setTimeout> | undefined;
let retryDelay = 0;

export function installServerConnection(resync: () => Promise<void>) {
  if (!serverMode) return;
  reconcile = resync;
  const offline = () => {
    if (connection.status === 'auth') return;
    connection.status = 'offline';
    recoveryNeeded = true;
    // A request just failed: a restarted server refused the old token, or
    // nothing answered. Look now rather than at the next interval.
    checkSoon();
  };
  window.addEventListener('splash:offline', offline);
  window.addEventListener('splash:auth-required', () => { connection.status = 'auth'; });
  window.addEventListener('online', () => { recoveryNeeded = true; void checkConnection(); });
  window.addEventListener('offline', offline);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { recoveryNeeded = true; void checkConnection(); } });
  window.setInterval(checkConnection, 5000);
  void checkConnection();
}

/** One connection check shortly; requests failing together share it. */
function checkSoon(delay = 100) {
  if (soon !== undefined) return;
  soon = setTimeout(() => { soon = undefined; void checkConnection(); }, delay);
}

export async function checkConnection() {
  if (!serverMode || checking || connection.status === 'auth') return;
  checking = true;
  try {
    const response = await fetch('/__server/state', { cache: 'no-store', signal: AbortSignal.timeout(4500) });
    if (response.status === 401) { connection.status = 'auth'; return; }
    if (!response.ok) throw new Error('Server unavailable');
    const info: ServerInfo = await response.json();
    if (info.instance !== knownInstance) recoveryNeeded = true;
    knownInstance = info.instance;
    Object.assign(globalThis.__SPLASH_SERVER__!, info);
    connection.name = info.name;
    if ((!ready || recoveryNeeded) && reconcile) {
      connection.status = 'syncing';
      // Consume the old failure before resync; a new network failure sets it again.
      recoveryNeeded = false;
      await reconcile();
      ready = true;
      connection.recovered++;
    }
    if (!recoveryNeeded) { connection.status = 'online'; connection.error = ''; retryDelay = 0; }
  } catch {
    connection.status = 'offline';
    recoveryNeeded = true;
    connection.error = 'Check that the server and SSH tunnel are running. Your drafts are kept here.';
  } finally {
    checking = false;
    // Not back yet (or something failed while checking): a restart takes a
    // moment, so look again soon, backing off to the event stream's 2 s.
    if (recoveryNeeded && connection.status !== 'auth') {
      retryDelay = Math.min(retryDelay ? retryDelay * 2 : 250, 2000);
      checkSoon(retryDelay);
    }
  }
}

export async function signOut() {
  const response = await fetch('/logout', { method: 'POST' });
  if (response.ok) location.reload();
}

export async function renewWorkspace(id: string) {
  await api.watch_workspace(id, true, workspaceClient);
}
