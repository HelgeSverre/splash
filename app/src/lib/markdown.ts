// Markdown for agent messages: GitHub-flavoured, sanitized, links go to the
// system browser (see Markdown.svelte).
import DOMPurify from "dompurify";
import { Marked } from "marked";
import remend from "remend";
import { highlightCode, languageForTag } from "./highlight";

const marked = new Marked({
  gfm: true,
  breaks: false,
  async: false,
  renderer: {
    code({ text, lang }) {
      const known = languageForTag(lang);
      const label = known ? `<span class="code-lang">${known}</span>` : "";
      return `<pre class="syntax">${label}<code>${highlightCode(text, lang)}</code></pre>\n`;
    },
  },
});

const cache = new Map<string, string>();

export function renderMarkdown(src: string): string {
  const hit = cache.get(src);
  if (hit !== undefined) return hit;
  const html = DOMPurify.sanitize(marked.parse(src) as string, { ADD_ATTR: ["target"] });
  if (cache.size > 500) cache.clear();
  cache.set(src, html);
  return html;
}

/**
 * Markdown that is still arriving, as rendered blocks (Streamdown's approach):
 * the text is split into top-level blocks, finished blocks render once and
 * come from the cache, and only the last, growing block is "healed" by
 * remend (closing a dangling **, `, [link]( …) before it renders. An open
 * code fence needs no healing: marked renders it as code to the end.
 */
export function renderStreamingBlocks(src: string): string[] {
  const tokens = marked.lexer(src);
  const raws = tokens.map((t) => t.raw).filter((r) => r.trim() !== "");
  return raws.map((raw, i) => {
    const last = i === raws.length - 1;
    const isCode = /^\s*(`{3,}|~{3,})/.test(raw);
    return renderMarkdown(last && !isCode ? remend(raw) : raw);
  });
}
