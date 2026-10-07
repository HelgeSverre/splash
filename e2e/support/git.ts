// Temporary git repositories used as Splash projects.
import { execFileSync } from "node:child_process";
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { E2E } from "./paths.ts";

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

/** What bareRemote needs of a World (support/world.ts). */
type GitWorld = { root: string; repo: string; gitconfig: string; env(): NodeJS.ProcessEnv };

/**
 * A bare repository standing in for `https://github.com/<fullName>.git`, with
 * the project's `main` pushed to it and set as the project's `origin`.
 *
 * Splash reads that URL as a GitHub remote (`git remote get-url`, which expands
 * `insteadOf`, and `git config remote.*.url`, which does not). The test's global
 * git config rewrites `https://github.com/` to `git@github.com:` with `insteadOf`,
 * and its ssh command (fakes/github-ssh) serves `<root>/github/<owner>/<name>.git`,
 * so fetches resolve locally, offline. (An `insteadOf` straight to the local path
 * would make `get-url` return that path, and Splash would see no GitHub remote.)
 */
export function bareRemote(world: GitWorld, fullName: string): string {
  const host = join(world.root, "github");
  const bare = remotePath(world, fullName);
  const config = readFileSync(world.gitconfig, "utf8");
  if (!config.includes("sshCommand")) {
    const ssh = join(E2E, "fakes", "github-ssh");
    appendFileSync(
      world.gitconfig,
      `[url "git@github.com:"]\n\tinsteadOf = https://github.com/\n[core]\n\tsshCommand = '${ssh}' '${host}'\n[ssh]\n\tvariant = simple\n`,
    );
  }
  const env = world.env();
  mkdirSync(dirname(bare), { recursive: true });
  git(world.root, env, "init", "-q", "--bare", "-b", "main", bare);
  git(world.repo, env, "remote", "add", "origin", `https://github.com/${fullName}.git`);
  git(world.repo, env, "push", "-q", "origin", "main");
  return bare;
}

/** Where bareRemote keeps github.com/<fullName>. */
export function remotePath(world: { root: string }, fullName: string): string {
  return join(world.root, "github", `${fullName}.git`);
}

/** Point `refs/pull/<number>/head` of a bare remote at a commit, as GitHub does for a pull request. */
export function createPrRef(bare: string, env: NodeJS.ProcessEnv, number: number, sha: string) {
  git(bare, env, "update-ref", `refs/pull/${number}/head`, sha);
}
