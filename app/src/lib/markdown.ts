// Markdown for agent messages: GitHub-flavoured, sanitized, links go to the
// system browser (see Markdown.svelte). A finished ```mermaid fence becomes a
// diagram block that lib/mermaid.ts draws once it is in the DOM.
import DOMPurify from "dompurify";
import { Marked } from "marked";
import remend from "remend";
import { highlightCode, languageForTag } from "./highlight";

const marked = new Marked({
  gfm: true,
  breaks: false,
  async: false,
  renderer: {
    code({ text, lang, raw }) {
      if (isMermaid(lang) && fenceClosed(raw) && text.trim()) return diagramBlock(text);
      const known = languageForTag(lang);
      const label = known ? `<span class="code-lang">${known}</span>` : "";
      return `<pre class="syntax">${label}<code>${highlightCode(text, lang)}</code></pre>\n`;
    },
  },
});

function isMermaid(lang: string | undefined): boolean {
  return (lang ?? "").trim().toLowerCase().split(/[\s{]/)[0] === "mermaid";
}

/**
 * Whether a fenced block's raw text ends with its closing fence. While a reply
 * streams, an open fence runs to the end of the text and marked still lexes it
 * as code; a diagram is only drawn once the fence is closed.
 */
function fenceClosed(raw: string): boolean {
  const open = /^ {0,3}(`{3,}|~{3,})/.exec(raw);
  if (!open) return false;
  const lines = raw.trimEnd().split("\n");
  const last = lines[lines.length - 1].trim();
  return lines.length > 1 && last.startsWith(open[1]) && /^[`~]+$/.test(last);
}

/**
 * A diagram block: its source as a code block (shown until the SVG is ready,
 * on demand after, and when the diagram is invalid), the place for the SVG,
 * and a bar with the view toggles. `data-status` goes pending → ready | error.
 */
function diagramBlock(source: string): string {
  return (
    `<div class="mermaid" data-testid="markdown-mermaid" data-status="pending" data-view="diagram" data-size="fit">` +
    `<div class="mermaid-bar"><span class="mermaid-lang">mermaid</span>` +
    `<button type="button" class="plain mermaid-size" data-testid="markdown-mermaid-size" aria-pressed="false">Actual size</button>` +
    `<button type="button" class="plain mermaid-toggle" data-testid="markdown-mermaid-toggle" aria-pressed="false">Source</button></div>` +
    `<div class="mermaid-diagram scroll-region" data-testid="markdown-mermaid-diagram" role="region" aria-label="Diagram" tabindex="0"></div>` +
    `<pre class="syntax mermaid-source" data-testid="markdown-mermaid-source"><code>${highlightCode(source)}</code></pre>` +
    `<div class="mermaid-error" data-testid="markdown-mermaid-error"></div></div>\n`
  );
}

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
