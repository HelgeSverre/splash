// Loaded before the application. Desktop IPC stays unchanged outside server mode.
(() => {
  const nativeFetch = globalThis.fetch.bind(globalThis);
  const state = globalThis.__SPLASH_SERVER__ = { name: 'Splash server', instance: '', token: '' };
  const refresh = async () => {
    const response = await nativeFetch('/__server/state', { cache: 'no-store' });
    if (!response.ok) throw new Error('Could not connect to the Splash server');
    Object.assign(state, await response.json());
  };
  const ready = refresh().catch(() => {});
  globalThis.__ELYRA__ = Object.freeze({ token: '' });
  globalThis.fetch = async (input, init) => {
    if (typeof input !== 'string' || !input.startsWith('elyra://localhost')) return nativeFetch(input, init);
    await ready;
    const headers = new Headers(init?.headers);
    headers.set('x-elyra-token', state.token);
    try {
      const response = await nativeFetch(location.origin + input.slice(17), { ...init, headers });
      if (response.status === 401) globalThis.dispatchEvent(new Event('splash:auth-required'));
      else if (response.status === 403) {
        globalThis.dispatchEvent(new Event('splash:offline'));
        // The service may have restarted with a new IPC token. Let the event
        // pump retry after state refresh; never replay a mutation here.
        if (input.endsWith('/__events')) {
          const headers = new Headers(response.headers);
          headers.delete('x-elyra-error-kind');
          return new Response(response.body, { status: 503, headers });
        }
      }
      return response;
    } catch (error) {
      globalThis.dispatchEvent(new Event('splash:offline'));
      // Never replay commands: the server may have received them. Name the
      // failure so the app can say it is reconnecting instead of "Failed to fetch".
      const lost = new Error('Could not reach the Splash server', { cause: error });
      lost.name = 'ServerUnreachableError';
      throw lost;
    }
  };
})();
