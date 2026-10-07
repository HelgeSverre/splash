// Start, stop and restart a Splash backend for one test: the desktop UI through
// the `splash-web` harness, or the web version through `splash-server`.
import { spawn, type ChildProcess } from "node:child_process";
import { createWriteStream, readFileSync, type WriteStream } from "node:fs";
import { createServer } from "node:net";
import { join } from "node:path";
import { BINARIES } from "./paths.ts";
import type { World } from "./world.ts";

export type Harness = "desktop" | "web";

const freePort = () =>
  new Promise<number>((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address() as { port: number };
      server.close(() => resolve(port));
    });
  });

export class Backend {
  port = 0;
  private proc?: ChildProcess;
  private exited?: Promise<number | null>;
  private log: WriteStream;
  readonly logFile: string;
  readonly harness: Harness;
  readonly world: World;
  readonly folders: string[];

  constructor(harness: Harness, world: World, folders: string[]) {
    this.harness = harness;
    this.world = world;
    this.folders = folders;
    this.logFile = join(world.root, "backend.log");
    this.log = createWriteStream(this.logFile, { flags: "a" });
  }

  get url() {
    return `http://127.0.0.1:${this.port}`;
  }

  /** The web version's login token. */
  token(): string {
    return readFileSync(join(this.world.data, "server.token"), "utf8").trim();
  }

  async start() {
    // A port picked here can be taken before the server binds it: try again.
    for (let attempt = 0; ; attempt++) {
      const port = this.port || (this.harness === "web" ? await freePort() : 0);
      try {
        await this.spawn(port);
        return;
      } catch (e) {
        if (this.port || attempt >= 4) throw e;
      }
    }
  }

  private spawn(port: number): Promise<void> {
    const args =
      this.harness === "desktop"
        ? ["--port", String(port), ...this.folders]
        : ["--port", String(port), "--data-dir", this.world.data, "--name", "E2E box", ...this.folders];
    const bin = this.harness === "desktop" ? BINARIES.web : BINARIES.server;
    this.log.write(`\n$ ${bin} ${args.join(" ")}\n`);
    const proc = spawn(bin, args, { cwd: this.world.root, env: this.world.env(), stdio: ["ignore", "pipe", "pipe"] });
    this.proc = proc;
    this.exited = new Promise((resolve) => proc.once("exit", (code) => resolve(code)));
    proc.stdout!.pipe(this.log, { end: false });
    proc.stderr!.pipe(this.log, { end: false });

    return new Promise((resolve, reject) => {
      let output = "";
      let settled = false;
      const fail = (why: string) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        reject(new Error(`${this.harness} backend did not start: ${why}\n${output}`));
      };
      const timer = setTimeout(() => fail("timed out"), 20_000);
      proc.once("exit", (code) => fail(`exited with ${code}`));
      const onData = (chunk: Buffer) => {
        output += chunk;
        const bound = /on http:\/\/127\.0\.0\.1:(\d+)/.exec(output);
        if (!bound) return;
        proc.stderr!.off("data", onData);
        this.port = Number(bound[1]);
        this.ready().then(
          () => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            resolve();
          },
          (e) => fail(String(e)),
        );
      };
      proc.stderr!.on("data", onData);
    });
  }

  /** The page (or login page) answers. */
  private async ready() {
    const deadline = Date.now() + 10_000;
    for (;;) {
      try {
        const res = await fetch(this.url + "/", { signal: AbortSignal.timeout(2_000) });
        if (res.ok) return;
      } catch {}
      if (Date.now() > deadline) throw new Error(`${this.url} never answered`);
      await new Promise((r) => setTimeout(r, 50));
    }
  }

  /** SIGTERM (Splash stops its agents), SIGKILL after 10 s. */
  async stop() {
    const proc = this.proc;
    if (!proc || proc.exitCode !== null || proc.signalCode !== null) return;
    proc.kill("SIGTERM");
    const timer = setTimeout(() => proc.kill("SIGKILL"), 10_000);
    await this.exited;
    clearTimeout(timer);
    this.proc = undefined;
  }

  /** Stop and start again on the same port and data directory. */
  async restart() {
    await this.stop();
    await this.start();
  }

  async dispose() {
    await this.stop();
    await new Promise<void>((resolve) => this.log.end(resolve));
  }
}
