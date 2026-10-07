/** Keyboard conventions belong to the browser, even when the server is remote. */
export function isApplePlatform(platform: string): boolean { return /Mac|iPhone|iPad|iPod/i.test(platform); }
export const appleClient = typeof navigator !== 'undefined' && isApplePlatform(navigator.platform);

/** Avoid browser-reserved new-window/close-tab/location shortcuts in server mode. */
export function defaultCombo(combo: string, apple: boolean, browser: boolean): string {
  if (browser) {
    const reserved: Record<string, string> = {
      'Meta+N': 'Alt+Shift+N', 'Meta+W': 'Alt+Shift+W', 'Meta+L': 'Alt+Shift+L',
      'Meta+K': 'Alt+Shift+K', 'Meta+Shift+P': 'Alt+Shift+P',
      'Ctrl+Tab': 'Alt+Shift+ArrowRight', 'Ctrl+Shift+Tab': 'Alt+Shift+ArrowLeft',
    };
    if (reserved[combo]) return reserved[combo];
    if (/^Meta\+[1-9]$/.test(combo)) return combo.replace('Meta+', 'Alt+Shift+');
    if (!apple && combo === 'Meta+J') return 'Alt+Shift+J';
    if (!apple && combo === 'Meta+B') return 'Alt+Shift+B';
  }
  return apple ? combo : combo.replace('Meta', 'Ctrl');
}
