import { expect, test } from "../../fixtures.ts";
import { Layout } from "../../support/layout.ts";
import { Workbench } from "../../support/views.ts";

test("a malformed saved layout does not prevent opening Splash", async ({ splash }) => {
  const { page, app } = splash;
  await page.evaluate(() => localStorage.setItem("splash.layout", "null"));
  await page.reload();
  await app.waitReady();
  await expect(app.welcome).toBeVisible();
  await app.newSession({ where: "in_place" });
  await app.prompt("A working conversation after restoring layout");
  await expect(app.title).toHaveText("A working conversation after restoring layout");
});

test("saved wide panels leave room for the chat in the minimum desktop window", async ({ splash }) => {
  const { page, app } = splash;
  const panels = new Layout(page);
  await page.evaluate(() => localStorage.setItem("splash.layout", JSON.stringify({ left: 420, right: 720 })));
  await page.setViewportSize({ width: 900, height: 560 });
  await page.reload();
  await app.waitReady();
  await app.newSession({ where: "in_place" });
  await expect.poll(async () => (await panels.center.boundingBox())?.width).toBeGreaterThanOrEqual(360);
  await expect(app.composer).toBeVisible();
  await app.prompt("Usable at the minimum desktop size");
  await expect(app.title).toHaveText("Usable at the minimum desktop size");
  await page.setViewportSize({ width: 1800, height: 900 });
  await expect.poll(async () => (await panels.sidebar.boundingBox())?.width).toBe(420);
  await expect.poll(async () => (await panels.side.boundingBox())?.width).toBe(720);
});

test("the selected side tab stays reachable in a 220px panel", async ({ splash }) => {
  const { page, app } = splash;
  const panels = new Layout(page);
  await page.evaluate(() => localStorage.setItem("splash.layout", JSON.stringify({
    left: 260, right: 220, bottom: 260, leftOpen: true, rightOpen: true, bottomOpen: false, rightTab: "details",
  })));
  await page.setViewportSize({ width: 900, height: 560 });
  await page.reload();
  await app.waitReady();
  await app.newSession({ where: "in_place" });

  await expect.poll(async () => (await panels.side.boundingBox())?.width).toBe(220);
  const details = app.sideTab("details");
  await expect(details).toHaveAttribute("aria-selected", "true");
  await expect(details).toBeInViewport();
  await expect(new Workbench(page).refreshSidePanel).toBeInViewport();

  const [tabs, selected] = await Promise.all([app.sidePanel.boundingBox(), details.boundingBox()]);
  expect(tabs).not.toBeNull();
  expect(selected).not.toBeNull();
  expect(selected!.x).toBeGreaterThanOrEqual(tabs!.x);
  expect(selected!.x + selected!.width).toBeLessThanOrEqual(tabs!.x + tabs!.width);
});

test("a saved terminal height yields to a smaller window and restores after expanding", async ({ splash }) => {
  const { page, app } = splash;
  const bench = new Workbench(page);
  const constrainedTerminalHeight = splash.harness === "web" ? 197 : 240;
  await page.evaluate(() => localStorage.setItem("splash.layout", JSON.stringify({
    left: 260, right: 340, bottom: 700, leftOpen: true, rightOpen: true, bottomOpen: true, rightTab: "changes",
  })));
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.reload();
  await app.waitReady();
  await app.newSession({ where: "in_place" });
  await expect.poll(async () => (await bench.terminal.boundingBox())?.height).toBe(700);

  await page.setViewportSize({ width: 900, height: 560 });
  await expect.poll(async () => (await bench.terminal.boundingBox())?.height).toBe(constrainedTerminalHeight);
  const [composer, terminal] = await Promise.all([app.composer.boundingBox(), bench.terminal.boundingBox()]);
  expect(composer).not.toBeNull();
  expect(terminal).not.toBeNull();
  expect(composer!.y + composer!.height).toBeLessThanOrEqual(terminal!.y);
  await app.composer.click();
  await app.send("Composer stays usable above a constrained terminal");

  await page.setViewportSize({ width: 1440, height: 1100 });
  await expect.poll(async () => (await bench.terminal.boundingBox())?.height).toBe(700);
});

test("invalid stored panel values recover to usable controls", async ({ splash }) => {
  const { page, app } = splash;
  await page.evaluate(() => localStorage.setItem("splash.layout", JSON.stringify({
    left: "wide", right: -900, bottom: "tall", leftOpen: "false", rightOpen: true,
    bottomOpen: false, rightTab: "removed-tab",
  })));
  await page.reload();
  await app.waitReady();
  await app.newSession({ where: "in_place" });
  await expect(app.composer).toBeVisible();
  await expect(app.sideTab("changes")).toHaveAttribute("aria-selected", "true");
  await app.prompt("Panel state recovered");
  await expect(app.title).toHaveText("Panel state recovered");
});
