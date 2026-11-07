import { api } from '../bindings';
import { ServerConnection, type ServerInfo } from './server-connection-model';

export type { ServerInfo } from './server-connection-model';
declare global { var __SPLASH_SERVER__: ServerInfo | undefined; }
export const serverMode = !!globalThis.__SPLASH_SERVER__;
export const workspaceClient = crypto.randomUUID();
export const connection = $state({ status: 'connecting' as 'connecting' | 'online' | 'offline' | 'auth' | 'syncing', name: globalThis.__SPLASH_SERVER__?.name ?? '', error: '', recovered: 0, checking: false });
const unavailable = $derived(serverMode && connection.status !== 'online');
/** True in the web version while commands can't reach the server: connecting,
 * restoring the workspace, signed out or connection lost. Never in the desktop app. */
export const serverUnavailable = () => unavailable;
let soon: ReturnType<typeof setTimeout> | undefined;
let retryDelay = 0;
let connectionMonitor: ServerConnection | undefined;

function markOffline() {
  if (!connectionMonitor?.offline()) return;
  // A request just failed: a restarted server refused the old token, or
  // nothing answered. Look now rather than at the next interval.
  checkSoon();
}

function markAuth() {
  connectionMonitor?.auth();
}

export function installServerConnection(resync: () => Promise<void>) {
  if (!serverMode) return;
  connectionMonitor = new ServerConnection(connection, async () => {
    const response = await fetch('/__server/state', { cache: 'no-store', signal: AbortSignal.timeout(4500) });
    if (response.status === 401) return undefined;
    if (!response.ok) throw new Error('Server unavailable');
    return response.json();
  }, resync, (info) => Object.assign(globalThis.__SPLASH_SERVER__!, info));
  window.addEventListener('splash:offline', markOffline);
  window.addEventListener('splash:auth-required', markAuth);
  window.addEventListener('online', () => { connectionMonitor?.reconnect(); void checkConnection(); });
  window.addEventListener('offline', markOffline);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { connectionMonitor?.reconnect(); void checkConnection(); } });
  window.setInterval(checkConnection, 5000);
  void checkConnection();
}

/** One connection check shortly; requests failing together share it. */
function checkSoon(delay = 100) {
  if (soon !== undefined) return;
  soon = setTimeout(() => { soon = undefined; void checkConnection(); }, delay);
}

export async function checkConnection() {
  if (!serverMode || !connectionMonitor) return;
  if (await connectionMonitor.check()) {
    retryDelay = Math.min(retryDelay ? retryDelay * 2 : 250, 2000);
    checkSoon(retryDelay);
  } else if (connection.status === 'online') retryDelay = 0;
}

export async function signOut() {
  let response: Response;
  try {
    response = await fetch('/logout', { method: 'POST' });
  } catch (error) {
    markOffline();
    const lost = new Error('Could not reach the Splash server', { cause: error });
    lost.name = 'ServerUnreachableError';
    throw lost;
  }
  // A session can disappear in another tab or after rotating the token.
  // The login page explains what to do better than a stale app shell can.
  if (response.status === 401) {
    location.reload();
    return;
  }
  if (!response.ok) throw new Error(`Could not sign out (${response.status})`);
  location.reload();
}

export async function renewWorkspace(id: string) {
  await api.watch_workspace(id, true, workspaceClient);
}
