/** `2026-10-09` → `9 October 2026`, the same on the server and in every browser. */
export const date = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
