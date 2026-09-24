// Markdown for agent messages: GitHub-flavoured, sanitized, links go to the
// system browser (see Markdown.svelte).
import DOMPurify from "dompurify";
import { Marked } from "marked";

const marked = new Marked({ gfm: true, breaks: false, async: false });

const cache = new Map<string, string>();

export function renderMarkdown(src: string): string {
  const hit = cache.get(src);
  if (hit !== undefined) return hit;
  const html = DOMPurify.sanitize(marked.parse(src) as string, { ADD_ATTR: ["target"] });
  if (cache.size > 500) cache.clear();
  cache.set(src, html);
  return html;
}
