// Where the repository, its fixtures and the binaries under test live.
import { join, resolve } from "node:path";

export const E2E = resolve(import.meta.dirname, "..");
export const REPO_ROOT = resolve(E2E, "..");
export const FIXTURES = join(REPO_ROOT, "fixtures");
/** Debug builds by default; SPLASH_E2E_BIN_DIR=target/release checks the embedded-asset path. */
export const BIN_DIR = resolve(REPO_ROOT, process.env.SPLASH_E2E_BIN_DIR ?? "target/debug");
const exe = (name: string) => join(BIN_DIR, name + (process.platform === "win32" ? ".exe" : ""));
export const BINARIES = {
  web: exe("splash-web"),
  server: exe("splash-server"),
  fakeAcp: exe("fake-acp"),
};
