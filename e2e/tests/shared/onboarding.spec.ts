// First-run recovery paths: a new user has no project yet, or an agent CLI
// without the separate executable that starts its ACP server.
import { existsSync } from "node:fs";
import { expect, test } from "../../fixtures.ts";
import { Settings } from "../../support/settings.ts";

test.describe("first run", () => {
  test.use({ folders: "none" });

  test("explains how to start when no project has been added", async ({ splash }) => {
    const { app } = splash;
    await app.newSessionButton.click();

    await expect(app.dialogProjectEmpty).toContainText("Add a project folder to begin");
    await expect(app.dialogStart).toBeDisabled();
  });
});

test.describe("agent setup recovery", () => {
  // The fake Vibe CLI exists, while its separately named `vibe-acp` launcher
  // deliberately does not. This reproduces an incomplete native installation.
  test.use({ agents: ["vibe"] });

  test("does not count an agent whose ACP launcher is missing as ready", async ({ splash }) => {
    const { app } = splash;
    await expect(app.welcomeAgents).toHaveAttribute("data-ready", "0");
    await app.newSessionButton.click();

    await expect(app.agentState("vibe")).toHaveText("vibe-acp missing");
    await expect(app.dialogAgentEmpty).toContainText("No agents are ready");
    await expect(app.dialogStart).toBeDisabled();

    await app.dialogConfigureAgents.click();
    const settings = new Settings(app);
    await settings.expectPage("agents");
    await expect(settings.status("vibe")).toHaveText("vibe-acp missing");
  });
});

test("refreshing every agent gives concurrent probes separate temporary folders", async ({ splash }) => {
  const { app, world } = splash;
  const settings = new Settings(app);
  await settings.open("agents");
  await settings.refreshAll.click();
  await expect(settings.status("claude")).toHaveText("ready");
  await expect(settings.status("codex")).toHaveText("ready");
  await expect(settings.status("glue")).toHaveText("ready");

  const directories = world.agents.launches().map((launch) => launch.cwd);
  expect(directories).toHaveLength(3);
  expect(new Set(directories).size).toBe(3);
  for (const directory of directories) {
    expect(directory.startsWith(world.tmp + "/splash-probe_")).toBe(true);
    expect(existsSync(directory)).toBe(false);
  }
});
