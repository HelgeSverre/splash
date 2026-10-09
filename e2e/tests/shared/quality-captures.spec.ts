import { renameSync } from "node:fs";
import { expect, test } from "../../fixtures.ts";
import { capture } from "../../support/capture.ts";
import { Connection } from "../../support/server.ts";
import { Workbench } from "../../support/views.ts";

test.skip(process.env.SPLASH_CAPTURE_SCREENSHOTS !== "1", "Documentation capture is run explicitly after the quality gate");

test.describe("first run captures", () => {
  test.use({ agents: [], folders: "none" });
  test("first run and agent setup", async ({ splash }) => {
    const { app, page, harness } = splash;
    await expect(app.welcomeAgents).toHaveAttribute("data-ready", "0");
    await capture(page, `quality-${harness}-first-run`);
    await app.newSessionButton.click();
    await expect(app.newSessionDialog).toBeVisible();
    await capture(page, `quality-${harness}-agent-setup`);
  });
});

test("conversation, library and missing workspace", async ({ splash }) => {
  const { app, page, world, harness } = splash;
  const bench = new Workbench(page);
  await app.newSession({ where: "in_place" });
  await app.prompt("Inspect the calculation demo");
  await app.sideTab("review").click();
  await capture(page, `quality-${harness}-conversation`);
  await page.setViewportSize({ width: 900, height: 560 });
  await expect(app.terminalToggle).toBeVisible();
  await capture(page, `quality-${harness}-small-window`);
  await page.setViewportSize({ width: 1440, height: 900 });
  await app.sideTab("files").click();
  await expect(bench.tree).toBeVisible();
  renameSync(world.repo, world.repo + "-moved");
  await bench.refreshSidePanel.click();
  await expect(bench.fileTreeError).toBeVisible();
  await capture(page, `quality-${harness}-missing-workspace`);
  await app.openNav("library");
  await expect(app.sessionRows).toHaveCount(1);
  await capture(page, `quality-${harness}-library`);
});

test("an offline server preserves the conversation draft", async ({ splash }) => {
  test.skip(splash.harness !== "web", "Connection state belongs to the server client");
  const { app, page } = splash;
  await app.newSession({ where: "in_place" });
  await app.prompt("Inspect the calculation demo");
  await app.composer.fill("Please keep this draft while the connection recovers.");
  await page.route("**/__server/state", (route) => route.abort("connectionrefused"));
  await page.route("**/logout", (route) => route.abort("connectionrefused"));
  const connection = new Connection(page);
  await connection.signOut.click();
  await connection.expectStatus("offline");
  await expect(app.composer).toHaveValue("Please keep this draft while the connection recovers.");
  await capture(page, "quality-web-offline-draft");
});
