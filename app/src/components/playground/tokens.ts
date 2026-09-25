// Reads the design tokens straight out of app.css, so the playground lists
// exactly what :root defines, grouped by the comment headings there.
import css from "../../app.css?raw";

export type Token = { name: string; source: string; note?: string };
export type TokenGroup = { title: string; tokens: Token[] };

function rootBody(): string {
  const start = css.indexOf(":root {");
  if (start < 0) return "";
  const end = css.indexOf("\n}", start);
  return css.slice(start + ":root {".length, end < 0 ? undefined : end);
}

/** Every `--token` in :root, in order, under the heading comment above it. */
export function tokenGroups(): TokenGroup[] {
  const body = rootBody();
  const groups: TokenGroup[] = [];
  let current: TokenGroup = { title: "Base", tokens: [] };
  const re = /\/\*([\s\S]*?)\*\/|(--[\w-]+)\s*:\s*([^;]+);/g;
  for (let m = re.exec(body); m; m = re.exec(body)) {
    if (m[1] !== undefined) {
      const lineStart = body.lastIndexOf("\n", m.index) + 1;
      const onOwnLine = body.slice(lineStart, m.index).trim() === "";
      const text = m[1].trim().replace(/\s+/g, " ");
      if (onOwnLine) {
        if (current.tokens.length) groups.push(current);
        current = { title: text.split(/[.:](\s|$)/)[0], tokens: [] };
      } else if (current.tokens.length) {
        current.tokens[current.tokens.length - 1].note = text;
      }
    } else {
      current.tokens.push({ name: m[2], source: m[3].trim().replace(/\s+/g, " ") });
    }
  }
  if (current.tokens.length) groups.push(current);
  return groups;
}

/** The text-role classes (.t-page-title, .t-meta…) app.css defines. */
export function textRoles(): string[] {
  const out = new Set<string>();
  for (const m of css.matchAll(/^\.(t-[\w-]+)/gm)) out.add(m[1]);
  return [...out];
}

export const computed = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export const isColor = (value: string) => !!value && CSS.supports("color", value);

/** A px token as a number (10.5px → 10.5); NaN when it isn't one. */
export const px = (source: string) => (/^-?[\d.]+px$/.test(source) ? parseFloat(source) : NaN);
