// Display only. Backend containment checks always use native Path components.
type Host = { host_os: string; home_dir: string | null };
let host: Host = { host_os: '', home_dir: null };
export function configurePaths(info: Host) { host = info; }

function normalized(path: string): string {
  if (host.host_os === 'windows') return path.replace(/^\\\\\?\\UNC\\/i, '\\\\').replace(/^\\\\\?\\/, '').replaceAll('\\', '/');
  return host.host_os === 'macos' ? path.replace(/^\/(tmp|var|etc)(?=\/|$)/, '/private/$1') : path;
}
function comparable(path: string): string { return host.host_os === 'windows' ? path.toLowerCase() : path; }
function within(path: string, root: string): string | undefined {
  const p = normalized(path), r = normalized(root).replace(/\/+$/, '');
  if (comparable(p) === comparable(r)) return '.';
  return comparable(p).startsWith(comparable(r) + '/') ? p.slice(r.length + 1) : undefined;
}
export function home(path: string): string {
  const tail = host.home_dir ? within(path, host.home_dir) : undefined;
  return tail === undefined ? path : tail === '.' ? '~' : `~/${tail}`;
}
export function rel(path: string, cwd: string | undefined): string { return (cwd ? within(path, cwd) : undefined) ?? home(path); }
export function relText(text: string, cwd: string | undefined): string {
  if (!cwd) return text;
  const bases = new Set([cwd.replace(/[\\/]$/, '') + (host.host_os === 'windows' ? '\\' : '/'), normalized(cwd).replace(/\/$/, '') + '/']);
  if (host.host_os === 'macos') for (const base of [...bases]) bases.add(base.replace(/^\/private\/(tmp|var|etc)\//, '/$1/'));
  for (const base of bases) text = text.split(base).join('');
  return text;
}
export const basename = (path: string) => normalized(path).split('/').filter(Boolean).pop() ?? path;
