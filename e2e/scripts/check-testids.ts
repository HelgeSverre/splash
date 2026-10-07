// The browser tests' selector rules (AGENTS.md, Test ids): every test id they
// use exists in the app, so a typo or a removed attribute fails here rather than
// as a timeout; and spec files find elements only through e2e/support. Ids are
// spelled out as `testId(scope, "id")` in e2e/support and `data-testid="id"` in
// the app.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const e2e = resolve(import.meta.dirname, "..");
const repo = resolve(e2e, "..");

function files(dir: string, ext: RegExp): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (name === "node_modules") return [];
    return statSync(path).isDirectory() ? files(path, ext) : ext.test(name) ? [path] : [];
  });
}

const defined = new Set<string>();
for (const file of [...files(join(repo, "app/src"), /\.svelte$/), join(repo, "src/server/login.html")])
  for (const [, id] of readFileSync(file, "utf8").matchAll(/data-testid="([a-z0-9-]+)"/g)) defined.add(id);

const missing: string[] = [];
for (const file of [...files(join(e2e, "support"), /\.ts$/), join(e2e, "fixtures.ts")]) {
  const text = readFileSync(file, "utf8");
  for (const m of text.matchAll(/testId\([^,()]+,\s*"([^"]+)"/g))
    if (!defined.has(m[1])) missing.push(`${relative(repo, file)}:${text.slice(0, m.index).split("\n").length} ${m[1]}`);
}
// Specs go through the support helpers: no test ids, classes or copy to find
// elements. A line that must use one says why in a `// raw selector:` comment.
const raw = /\.(locator|getByTestId|getByRole|getByText|getByLabel|getByPlaceholder|getByTitle|getByAltText)\(|data-testid|\btestId\(/;
for (const file of files(join(e2e, "tests"), /\.ts$/)) {
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (raw.test(line) && !line.includes("// raw selector:"))
        missing.push(`${relative(repo, file)}:${i + 1} finds an element directly; add a helper in e2e/support`);
    });
}

if (missing.length) {
  console.error(`Selector problems (see AGENTS.md, Test ids):\n  ${missing.join("\n  ")}`);
  process.exit(1);
}
console.log(`${defined.size} test ids in the app; every one the tests use exists.`);
