// Display helpers for paths inside a session's folder.

export const home = (p: string) => p.replace(/^\/Users\/[^/]+/, "~");

/** `cwd`-relative when inside it, otherwise ~-abbreviated. */
const canonical = (path: string) => path.replace(/^\/(tmp|var|etc)(?=\/|$)/, "/private/$1");

export function rel(path: string, cwd: string | undefined): string {
  if (cwd) {
    path = canonical(path);
    cwd = canonical(cwd);
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
  // macOS tools may resolve /tmp and /var through their /private aliases.
  const resolved = canonical(base);
  const alias = resolved.replace(/^\/private\/(tmp|var|etc)\//, "/$1/");
  return text.split(resolved).join("").split(alias).join("");
}

export const basename = (p: string) => p.split("/").filter(Boolean).pop() ?? p;
