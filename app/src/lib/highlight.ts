// Light syntax highlighting for file and diff tabs.
import hljs from "highlight.js/lib/common";

const EXT: Record<string, string> = {
  rs: "rust", ts: "typescript", tsx: "typescript", js: "javascript", jsx: "javascript", mjs: "javascript",
  svelte: "xml", vue: "xml", html: "xml", xml: "xml", svg: "xml", css: "css", scss: "scss",
  py: "python", rb: "ruby", go: "go", java: "java", kt: "kotlin", swift: "swift", c: "c", h: "c",
  cpp: "cpp", hpp: "cpp", cs: "csharp", php: "php", sh: "bash", zsh: "bash", bash: "bash",
  json: "json", yml: "yaml", yaml: "yaml", toml: "ini", ini: "ini", md: "markdown", sql: "sql",
  dart: "dart", lua: "lua", pl: "perl", r: "r", dockerfile: "dockerfile", makefile: "makefile",
};

export function languageFor(path: string): string | undefined {
  const name = path.split("/").pop()?.toLowerCase() ?? "";
  if (name === "dockerfile") return "dockerfile";
  if (name === "makefile" || name === "justfile") return "makefile";
  const lang = EXT[name.split(".").pop() ?? ""];
  return lang && hljs.getLanguage(lang) ? lang : undefined;
}

/** Highlight a whole file and split it into per-line HTML (spans re-opened per line). */
export function highlightLines(code: string, path: string): string[] {
  const lang = languageFor(path);
  const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  if (!lang || code.length > 400_000) return code.split("\n").map(escape);
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
