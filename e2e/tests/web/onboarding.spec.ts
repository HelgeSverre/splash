// New-session writes stay local to the dialog until the remote Splash server
// is reachable again.
import { expect, test } from "../../fixtures.ts";
import { Connection } from "../../support/server.ts";
import { Settings } from "../../support/settings.ts";

test("holds new-session mutations while the server is unavailable", async ({ splash }) => {
  const { app, page } = splash;
  const connection = new Connection(page);
  await app.newSessionButton.click();
  await expect(app.dialogStart).toBeEnabled();
  await expect(app.dialogAddFolder).toBeEnabled();

  await connection.holdChecks();
  await page.evaluate(() => window.dispatchEvent(new Event("offline")));
  await connection.expectStatus("offline");
  await expect(app.dialogStart).toBeDisabled();
  await expect(app.dialogAddFolder).toBeDisabled();

  await app.dialogCancel.click();
  const settings = new Settings(app);
  await settings.open("agents");
  await expect(settings.refreshAll).toBeDisabled();
  await settings.go("agent:claude");
  await expect(settings.refresh).toBeDisabled();
  await expect(settings.extraArgs).toBeDisabled();
});

test("restores a setting after its remote save fails", async ({ splash }) => {
  const { app, page } = splash;
  const settings = new Settings(app);
  await settings.open();
  await expect(settings.notify).toBeChecked();

  await page.route("**/__cmd/set_setting", (route) => route.abort("connectionreset"), { times: 1 });
  await settings.notify.click();

  await expect(settings.notify).toBeChecked();
});

test("keeps the final choice when an earlier matching save fails", async ({ splash }) => {
  const { app, page, db } = splash;
  const settings = new Settings(app);
  await settings.open();
  await expect(settings.notify).toBeChecked();

  let releaseFirst: (() => void) | undefined;
  const firstHeld = new Promise<void>((resolve) => { releaseFirst = resolve; });
  let firstStarted: (() => void) | undefined;
  const startedFirst = new Promise<void>((resolve) => { firstStarted = resolve; });
  let releaseSecond: (() => void) | undefined;
  const secondHeld = new Promise<void>((resolve) => { releaseSecond = resolve; });
  let secondStarted: (() => void) | undefined;
  const startedSecond = new Promise<void>((resolve) => { secondStarted = resolve; });
  let writes = 0;
  await page.route("**/__cmd/set_setting", async (route) => {
    switch (++writes) {
      case 1:
        firstStarted!();
        await firstHeld;
        await route.abort("connectionreset");
        return;
      case 2:
        secondStarted!();
        await secondHeld;
        return route.continue();
      default:
        return route.continue();
    }
  });

  // The first and last choices are both off. Its failure must not undo the
  // later off choice that is queued behind an intervening on choice.
  await settings.notify.click();
  await startedFirst;
  await settings.notify.click();
  await settings.notify.click();
  releaseFirst!();

  // Hold the next save so this observes the first failure's rollback. The old
  // value comparison sees the matching final off value and incorrectly resets
  // the switch to its last confirmed on state.
  await startedSecond;
  await expect(settings.notify).not.toBeChecked();
  releaseSecond!();

  await expect.poll(() => db.setting("notify")).toBe("off");
  await expect(settings.notify).not.toBeChecked();
});

test("keeps a settled setting while reconnect applies an older snapshot", async ({ splash }) => {
  const { app, page, db } = splash;
  const settings = new Settings(app);
  const connection = new Connection(page);
  await settings.open();
  await expect(settings.notify).toBeChecked();

  let releaseSnapshot: (() => void) | undefined;
  const snapshotHeld = new Promise<void>((resolve) => { releaseSnapshot = resolve; });
  let startedSnapshot: (() => void) | undefined;
  const snapshotStarted = new Promise<void>((resolve) => { startedSnapshot = resolve; });
  await page.route("**/__cmd/get_settings", async (route) => {
    const response = await route.fetch();
    const body = await response.body();
    startedSnapshot!();
    await snapshotHeld;
    await route.fulfill({ response, body });
  });

  // This reaches the server while Notify is still on, then holds that old
  // response. The user saves Notify off before the stale snapshot arrives.
  await page.evaluate(() => window.dispatchEvent(new Event("offline")));
  await snapshotStarted;
  await settings.notify.click();
  await expect.poll(() => db.setting("notify")).toBe("off");
  await expect(settings.notify).not.toBeChecked();

  releaseSnapshot!();
  await connection.expectStatus("online");
  await expect(settings.notify).not.toBeChecked();
});

test("keeps a setting that was saving when an older snapshot began", async ({ splash }) => {
  const { app, page, db } = splash;
  const settings = new Settings(app);
  const connection = new Connection(page);
  await settings.open();
  await expect(settings.notify).toBeChecked();

  let releaseSave: (() => void) | undefined;
  const saveHeld = new Promise<void>((resolve) => { releaseSave = resolve; });
  await page.route("**/__cmd/set_setting", async (route) => {
    await saveHeld;
    await route.continue();
  }, { times: 1 });
  await settings.notify.click();
  await expect(settings.notify).not.toBeChecked();

  let releaseSnapshot: (() => void) | undefined;
  const snapshotHeld = new Promise<void>((resolve) => { releaseSnapshot = resolve; });
  let startedSnapshot: (() => void) | undefined;
  const snapshotStarted = new Promise<void>((resolve) => { startedSnapshot = resolve; });
  await page.route("**/__cmd/get_settings", async (route) => {
    const response = await route.fetch();
    const body = await response.body();
    startedSnapshot!();
    await snapshotHeld;
    await route.fulfill({ response, body });
  });

  await page.evaluate(() => window.dispatchEvent(new Event("offline")));
  await snapshotStarted;
  releaseSave!();
  await expect.poll(() => db.setting("notify")).toBe("off");
  // Let the browser settle the completed save, so this checks the marker kept
  // from when the snapshot began rather than the currently-pending write.
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));

  releaseSnapshot!();
  await connection.expectStatus("online");
  await expect(settings.notify).not.toBeChecked();
});
