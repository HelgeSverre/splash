// A test's private machine: temp home, data dir, PATH of fake agents, control
// files and a git repository. Nothing here touches the user's own Splash data.
import { mkdirSync, mkdtempSync, realpathSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Agents, type AgentId } from "./agents.ts";
import { initRepo } from "./git.ts";
import { BINARIES, E2E, FIXTURES } from "./paths.ts";

export type WorldOptions = {
  /** Agent CLIs on the PATH. Adapter agents (claude, codex, pi) also get `npx`. */
  agents: AgentId[];
  /** Put the fake `gh` on the PATH. */
  gh: boolean;
};

export class World {
  readonly root = realpathSync(mkdtempSync(join(tmpdir(), "splash-e2e-")));
  readonly data = join(this.root, "data");
  readonly home = join(this.root, "home");
  readonly bin = join(this.root, "bin");
  readonly control = join(this.root, "control");
  readonly tmp = join(this.root, "tmp");
  readonly repo = join(this.root, "repo");
  readonly gitconfig = join(this.root, "gitconfig");
  readonly agents: Agents;

  constructor(options: WorldOptions) {
    for (const dir of [this.data, this.home, this.bin, this.control, this.tmp]) mkdirSync(dir, { recursive: true });
    writeFileSync(
      this.gitconfig,
      "[user]\n\tname = Splash E2E\n\temail = e2e@example.invalid\n[init]\n\tdefaultBranch = main\n[commit]\n\tgpgsign = false\n",
    );
    const fake = join(E2E, "fakes", "agent");
    const names = new Set<string>(options.agents);
    if (options.agents.some((a) => a === "claude" || a === "codex" || a === "pi")) names.add("npx");
    for (const name of names) symlinkSync(fake, join(this.bin, name));
    if (options.gh) symlinkSync(join(E2E, "fakes", "gh"), join(this.bin, "gh"));
    this.agents = new Agents(this.control);
    initRepo(this.repo, this.env());
  }

  /** The environment every backend and helper process runs with. */
  env(): NodeJS.ProcessEnv {
    const path = [this.bin, "/usr/bin", "/bin", "/usr/sbin", "/sbin"].join(":");
    return {
      HOME: this.home,
      USER: process.env.USER ?? "e2e",
      LOGNAME: process.env.LOGNAME ?? process.env.USER ?? "e2e",
      PATH: path,
      SPLASH_PATH: path,
      SHELL: "/bin/bash",
      SPLASH_SHELL: "/bin/bash",
      SPLASH_DATA_DIR: this.data,
      SPLASH_E2E_DIR: this.control,
      SPLASH_E2E_FAKE_ACP: BINARIES.fakeAcp,
      SPLASH_E2E_FIXTURES: FIXTURES,
      GIT_CONFIG_GLOBAL: this.gitconfig,
      GIT_CONFIG_NOSYSTEM: "1",
      TMPDIR: this.tmp,
      TZ: "UTC",
      LANG: "C.UTF-8",
      NO_COLOR: "1",
      RUST_BACKTRACE: "1",
    };
  }

  dispose() {
    if (process.env.SPLASH_E2E_KEEP) {
      console.log(`kept ${this.root}`);
      return;
    }
    rmSync(this.root, { recursive: true, force: true, maxRetries: 3 });
  }
}
