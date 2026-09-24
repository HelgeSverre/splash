// Display helpers for paths inside a session's folder.

export const home = (p: string) => p.replace(/^\/Users\/[^/]+/, "~");

/** `cwd`-relative when inside it, otherwise ~-abbreviated. */
export function rel(path: string, cwd: string | undefined): string {
  if (cwd) {
    const base = cwd.endsWith("/") ? cwd : cwd + "/";
    if (path.startsWith(base)) return path.slice(base.length);
    if (path === cwd) return ".";
  }
  return home(path);
}

/** Replace absolute session paths inside free text (commands, titles). */
export function relText(text: string, cwd: string | undefined): string {
  if (!cwd) return text;
  const base = cwd.endsWith("/") ? cwd : cwd + "/";
  return text.split(base).join("");
}

export const basename = (p: string) => p.split("/").filter(Boolean).pop() ?? p;
