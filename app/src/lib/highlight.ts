// Light syntax highlighting: files, diffs, code fences.
import hljs from "highlight.js/lib/common";

const EXT: Record<string, string> = {
  rs: "rust", ts: "typescript", tsx: "typescript", js: "javascript", jsx: "javascript", mjs: "javascript",
  svelte: "xml", vue: "xml", html: "xml", xml: "xml", svg: "xml", css: "css", scss: "scss",
  py: "python", rb: "ruby", go: "go", java: "java", kt: "kotlin", swift: "swift", c: "c", h: "c",
  cpp: "cpp", hpp: "cpp", cs: "csharp", php: "php", sh: "bash", zsh: "bash", bash: "bash",
  json: "json", yml: "yaml", yaml: "yaml", toml: "ini", ini: "ini", md: "markdown", sql: "sql",
  dart: "dart", lua: "lua", pl: "perl", r: "r", dockerfile: "dockerfile", makefile: "makefile",
};

function languageFor(path: string): string | undefined {
  const name = path.split("/").pop()?.toLowerCase() ?? "";
  if (name === "dockerfile") return "dockerfile";
  if (name === "makefile" || name === "justfile") return "makefile";
  const lang = EXT[name.split(".").pop() ?? ""];
  return lang && hljs.getLanguage(lang) ? lang : undefined;
}

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** A fence tag ("py", "tsx", "shell") as a highlight.js language, if it knows it. */
export function languageForTag(tag: string | undefined): string | undefined {
  const t = (tag ?? "").trim().toLowerCase().split(/[\s{]/)[0];
  if (!t) return undefined;
  const lang = EXT[t] ?? t;
  return hljs.getLanguage(lang) ? lang : undefined;
}

/** Highlighted HTML for a snippet; plain escaped text when the language is unknown. */
export function highlightCode(code: string, tag?: string): string {
  const lang = languageForTag(tag);
  if (!lang || code.length > 200_000) return escapeHtml(code);
  return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
}

export type Segment = { kind: "text"; text: string } | { kind: "code"; lang: string; code: string };

/** Split text into prose and fenced code blocks (``` or ~~~, any length ≥ 3). */
export function splitFences(text: string): Segment[] {
  const out: Segment[] = [];
  const lines = text.split("\n");
  let prose: string[] = [];
  let i = 0;
  const flush = () => {
    const t = prose.join("\n");
    if (t.trim()) out.push({ kind: "text", text: t });
    prose = [];
  };
  while (i < lines.length) {
    const open = /^\s*(`{3,}|~{3,})\s*([\w+#.-]*)[^`]*$/.exec(lines[i]);
    if (!open) {
      prose.push(lines[i++]);
      continue;
    }
    const fence = open[1];
    const close = lines.findIndex((l, j) => j > i && l.trim().startsWith(fence[0].repeat(fence.length)) && l.trim().replace(/[`~]/g, "") === "");
    if (close === -1) {
      prose.push(lines[i++]);
      continue;
    }
    flush();
    out.push({ kind: "code", lang: open[2], code: lines.slice(i + 1, close).join("\n") });
    i = close + 1;
  }
  flush();
  return out;
}

/** Highlight a whole file and split it into per-line HTML (spans re-opened per line). */
export function highlightLines(code: string, path: string): string[] {
  const lang = languageFor(path);
  if (!lang || code.length > 400_000) return code.split("\n").map(escapeHtml);
  const html = hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
  const out: string[] = [];
  let open: string[] = [];
  for (const line of html.split("\n")) {
    const prefix = open.join("");
    // Track spans left open at the end of this line.
    const tags = line.match(/<span[^>]*>|<\/span>/g) ?? [];
    for (const t of tags) {
      if (t.startsWith("</")) open.pop();
      else open.push(t);
    }
    out.push(prefix + line + "</span>".repeat(open.length));
  }
  return out;
}
