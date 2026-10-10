import { renameSync } from "node:fs";
import { expect, test } from "../../fixtures.ts";
import { capture } from "../../support/capture.ts";
import { Connection } from "../../support/server.ts";
import { History, historyAgents } from "../../support/history.ts";
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
  await expect(bench.noChanges).toHaveAttribute("data-loading", "false");
  await capture(page, `quality-${harness}-conversation`);
  await page.setViewportSize({ width: 900, height: 560 });
  await expect(app.terminalToggle).toBeVisible();
  await capture(page, `quality-${harness}-small-window`);
  await app.terminalToggle.click();
  await bench.terminalInput.click();
  await page.keyboard.type("PS1='demo:repo$ '; clear; printf 'isolated demo terminal\\n'");
  await expect(bench.terminalScreen).toContainText("PS1=");
  await page.keyboard.press("Enter");
  await expect(bench.terminalScreen).not.toContainText("PS1=");
  await expect(bench.terminalScreen).toContainText("isolated demo terminal");
  await capture(page, `quality-${harness}-small-window-terminal`);
  await bench.hideTerminal.click();
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

test("agent history actions menu", async ({ splash }) => {
  const { app, page, world, harness } = splash;
  historyAgents(world);
  const history = new History(app);
  const bench = new Workbench(page);
  await history.importSession("Fix the subtract sign", world.repo);
  await expect(bench.noChanges).toHaveAttribute("data-loading", "false");
  await history.openMenu();
  await capture(page, `quality-${harness}-history-actions-menu`);
  await history.menu.press("Escape");
  await app.continueButton.click();
  await app.expectStatus("idle");
  await expect(bench.noChanges).toHaveAttribute("data-loading", "false");
  await history.openMenu();
  await expect(history.disconnectButton).toBeEnabled();
  await capture(page, `quality-${harness}-history-actions-connected`);
  await history.menu.press("Escape");
  await history.disconnect();
  await history.openMenu();
  await history.refreshButton.click();
  await expect(history.notice).toHaveText("History refreshed from the agent.");
  await capture(page, `quality-${harness}-history-refresh`);
  await history.manage();
  await capture(page, `quality-${harness}-history-management`);
  await history.deleteAgentHistoryButton.click();
  await expect(history.confirmation).toBeVisible();
  await capture(page, `quality-${harness}-history-delete`);
  await history.closeDialog.click();
  await history.openMenu();
  await history.forkButton.click();
  await expect(history.dialog("fork")).toBeVisible();
  await capture(page, `quality-${harness}-history-fork`);
  await history.closeDialog.click();
  await history.fork("review");
  await expect(app.composer).toHaveValue(/Review the work in the parent conversation\./);
  await expect(bench.noChanges).toHaveAttribute("data-loading", "false");
  await capture(page, `quality-${harness}-history-fork-review`);
});

test("an offline server preserves the conversation draft", async ({ splash }) => {
  test.skip(splash.harness !== "web", "Connection state belongs to the server client");
  const { app, page } = splash;
  await app.newSession({ where: "in_place" });
  await app.prompt("Inspect the calculation demo");
  await expect(new Workbench(page).noChanges).toHaveAttribute("data-loading", "false");
  await app.composer.fill("Please keep this draft while the connection recovers.");
  await page.route("**/__server/state", (route) => route.abort("connectionrefused"));
  await page.route("**/logout", (route) => route.abort("connectionrefused"));
  const connection = new Connection(page);
  await connection.signOut.click();
  await connection.expectStatus("offline");
  await expect(app.composer).toHaveValue("Please keep this draft while the connection recovers.");
  await capture(page, "quality-web-offline-draft");
});
