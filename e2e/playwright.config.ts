import { defineConfig, devices } from "@playwright/test";
import type { Harness } from "./support/backend.ts";

const CI = !!process.env.CI;
// node:sqlite (support/db.ts) is stable enough for reading test databases.
process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS ?? ""} --disable-warning=ExperimentalWarning`.trim();

// One fresh backend per test, so tests run fully parallel. Flows in
// tests/shared run against both the desktop UI (splash-web) and the web
// version (splash-server).
export default defineConfig<{ harness: Harness }>({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  workers: CI ? 4 : undefined,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: CI ? [["github"], ["list"], ["html", { open: "never" }]] : [["list"], ["html", { open: "never" }]],
  use: {
    ...devices["Desktop Chrome"],
    viewport: { width: 1440, height: 900 },
    locale: "en-US",
    timezoneId: "UTC",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", testMatch: /(shared|desktop)\/.*\.spec\.ts$/, use: { harness: "desktop" } },
    { name: "web", testMatch: /(shared|web)\/.*\.spec\.ts$/, use: { harness: "web" } },
  ],
});
