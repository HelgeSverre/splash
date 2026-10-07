// Temporary git repositories used as Splash projects.
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export const CALC = `def add(a, b):
    return a + b


def subtract(a, b):
    return a - b
`;

export function git(cwd: string, env: NodeJS.ProcessEnv, ...args: string[]): string {
  return execFileSync("git", args, { cwd, env, encoding: "utf8" }).trim();
}

export function write(root: string, path: string, text: string) {
  const file = join(root, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, text);
}

/** A small Python project with one commit on `main`. */
export function initRepo(dir: string, env: NodeJS.ProcessEnv) {
  mkdirSync(dir, { recursive: true });
  git(dir, env, "init", "-q", "-b", "main");
  write(dir, "calc.py", CALC);
  write(dir, "README.md", "# calc\n\nTiny arithmetic helpers.\n");
  write(dir, "src/util.py", "def double(x):\n    return x * 2\n");
  git(dir, env, "add", "-A");
  git(dir, env, "commit", "-q", "-m", "Initial commit");
}

export function branchExists(repo: string, env: NodeJS.ProcessEnv, branch: string): boolean {
  try {
    git(repo, env, "rev-parse", "--verify", "--quiet", `refs/heads/${branch}`);
    return true;
  } catch {
    return false;
  }
}

export function status(repo: string, env: NodeJS.ProcessEnv): string {
  return git(repo, env, "status", "--porcelain");
}
