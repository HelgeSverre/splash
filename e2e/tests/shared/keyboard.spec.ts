// The app's keyboard shortcuts with their default combos: ⌘/Ctrl on the
// desktop, browser-safe Alt+Shift ones on the web (support/app.ts `key`).
import { expect, test } from "../../fixtures.ts";
import { keycaps, Settings } from "../../support/settings.ts";

test("the Welcome page lists the shortcuts", async ({ splash }) => {
  const { app, page } = splash;
  const keys = page.locator(".welcome .keys");
  const key = (label: string) => keys.locator("dd", { hasText: label }).locator("xpath=preceding-sibling::dt[1]");
  // Keycaps side by side: "⌘N" (macOS), "CtrlN" (elsewhere).
  const caps = (combo: string) => keycaps(app.combo(combo)).replaceAll(" ", "");
  await expect(key("New session")).toHaveText(caps("N"));
  await expect(key("Go to session 1, 2, …")).toHaveText(caps("1"));
  await expect(key("Command palette")).toHaveText(caps("Shift+P"));
  await expect(key("Terminal")).toHaveText(caps("J"));
  await expect(key("Settings")).toHaveText(caps(","));
});

test("New session opens from the keyboard, and Enter starts it", async ({ splash }) => {
  const { app, page, db } = splash;
  await page.keyboard.press(app.key("N"));
  const dialog = page.getByRole("dialog", { name: "New session" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("radiogroup", { name: "Where it works" }).getByRole("radio", { name: /^In place/ }).click();
  await page.keyboard.press("Enter");
  await expect(dialog).toBeHidden();
  const id = await app.sessionId();
  await app.expectStatus("idle");
  expect(db.session(id)).toMatchObject({ agent_id: "claude", isolation: "in_place" });
  // The composer has the focus: type straight away.
  await expect(app.composer).toBeFocused();
});

test("number keys open sessions in sidebar order; next and previous cycle", async ({ splash }) => {
  const { app, page } = splash;
  await app.newSession({ where: "in_place" });
  await app.prompt("First question");
  await app.newSession({ where: "in_place" });
  await app.prompt("Second question");

  // Each row shows its key; that key opens it.
  const rows = app.sidebar.locator("nav .nav-item");
  await expect(app.sessionRow("First question")).toBeVisible();
  await expect(app.sessionRow("Second question")).toBeVisible();
  await expect(rows).toHaveCount(2);
  const [first, second] = await rows.locator(".label").allTextContents();
  await expect(app.sessionRow(first).locator(".key")).toHaveText(keycaps(app.combo("1")).replaceAll(" ", ""));
  await expect(app.sessionRow(second).locator(".key")).toHaveText(keycaps(app.combo("2")).replaceAll(" ", ""));

  await page.keyboard.press(app.key("1"));
  await expect(app.title).toHaveText(first);
  await page.keyboard.press(app.key("2"));
  await expect(app.title).toHaveText(second);
  // Next wraps around from the last session, previous goes back.
  await page.keyboard.press(app.key("Ctrl+Tab"));
  await expect(app.title).toHaveText(first);
  await page.keyboard.press(app.key("Ctrl+Shift+Tab"));
  await expect(app.title).toHaveText(second);
});

test("the terminal, the side panel and the sidebar toggle from the keyboard", async ({ splash }) => {
  const { app, page } = splash;
  await app.newSession({ where: "in_place" });
  const terminal = page.getByRole("button", { name: "Terminal", exact: true });
  const side = page.getByRole("button", { name: "Changes & files", exact: true });
  await expect(terminal).toHaveAttribute("aria-pressed", "false");
  await expect(side).toHaveAttribute("aria-pressed", "true");

  await page.keyboard.press(app.key("J"));
  await expect(terminal).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#terminal-pane")).toBeVisible();
  // It works from inside the terminal too.
  await page.keyboard.press(app.key("J"));
  await expect(terminal).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator("#terminal-pane")).toHaveCount(0);

  await page.keyboard.press(app.key("Alt+Meta+B"));
  await expect(side).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByRole("tablist", { name: "Side panel" })).toHaveCount(0);
  await page.keyboard.press(app.key("Alt+Meta+B"));
  await expect(side).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("tablist", { name: "Side panel" })).toBeVisible();

  await page.keyboard.press(app.key("B"));
  await expect(app.newSessionButton).toBeHidden();
  await page.keyboard.press(app.key("B"));
  await expect(app.newSessionButton).toBeVisible();
});

test("Stop, focus the message box and Settings have shortcuts", async ({ splash }) => {
  const { app, page, world } = splash;
  world.agents.fixture("claude", "claude/cancel.jsonl");
  world.agents.speed("claude", 1);
  await app.newSession({ where: "in_place" });
  await app.send("Write a long essay");
  await app.expectStatus("running");
  await page.keyboard.press(app.key("."));
  await expect(app.entries("turn_end")).toContainText("cancelled");
  await app.expectStatus("idle");
  expect(world.agents.requests("claude", "session/cancel")).toHaveLength(1);

  await app.transcript.focus();
  await expect(app.composer).not.toBeFocused();
  await page.keyboard.press(app.key("L"));
  await expect(app.composer).toBeFocused();

  const settings = new Settings(app);
  await page.keyboard.press(app.key(","));
  await expect(settings.heading).toHaveText("General");
  // The same key closes it again, even though it is a dialog.
  await page.keyboard.press(app.key(","));
  await expect(settings.dialog).toBeHidden();
});

test("Close tab closes the open tab, never the chat", async ({ splash }) => {
  const { app, page } = splash;
  await app.newSession({ where: "in_place" });
  const tabs = page.getByRole("tablist", { name: "Session tabs" });
  await page.getByRole("button", { name: "Log", exact: true }).click();
  await expect(tabs.getByRole("tab", { name: "Log" })).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press(app.key("W"));
  await expect(tabs.getByRole("tab", { name: "Log" })).toHaveCount(0);
  await expect(tabs.getByRole("tab", { name: "Chat" })).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press(app.key("W"));
  await expect(tabs.getByRole("tab")).toHaveCount(1);
  await expect(app.composer).toBeVisible();
});

test("the command palette runs commands and opens sessions", async ({ splash }) => {
  const { app, page } = splash;
  const id = await app.newSession({ where: "in_place" });
  await app.prompt("What does subtract do?");
  await app.openNav("Sessions");

  await page.keyboard.press(app.key("Shift+P"));
  const { palette, paletteItems } = app.ui;
  await expect(palette).toBeFocused();
  await expect(paletteItems.filter({ hasText: /^New session/ }).locator(".sub")).toHaveText(keycaps(app.combo("N")));
  await expect(paletteItems.filter({ hasText: "What does subtract do?" }).locator(".sub")).toHaveText("repo · claude");

  await palette.fill("attention");
  await expect(paletteItems).toHaveText(["Needs attentionPermissions, failures and completed work"]);
  await palette.press("Enter");
  await expect(palette).toHaveCount(0);
  await expect(page).toHaveURL(/#\/attention$/);
  await expect(page.getByRole("region", { name: "Ready to review" })).toContainText("What does subtract do?");

  // ⌘K / Alt+Shift+K too; a session opens by its title.
  await page.keyboard.press(app.key("K"));
  await palette.fill("subtract");
  await expect(paletteItems).toHaveCount(1);
  await palette.press("Enter");
  await expect(page).toHaveURL(new RegExp(`#/session/${id}$`));
  await expect(app.title).toHaveText("What does subtract do?");

  // Escape closes it without running anything.
  await page.keyboard.press(app.key("Shift+P"));
  await palette.fill("Keyboard shortcuts");
  await page.keyboard.press("Escape");
  await expect(palette).toHaveCount(0);
  await expect(page.getByRole("dialog", { name: "Settings" })).toHaveCount(0);

  await page.keyboard.press(app.key("Shift+P"));
  await palette.fill("Keyboard shortcuts");
  await palette.press("Enter");
  await expect(new Settings(app).heading).toHaveText("Keyboard shortcuts");
});

test("a shortcut removed in Settings stops working", async ({ splash }) => {
  const { app, page } = splash;
  await app.newSession({ where: "in_place" });
  const settings = new Settings(app);
  await settings.open("Keyboard shortcuts");
  await settings.shortcut("Command palette").click();
  await page.keyboard.press("Backspace");
  await expect(settings.shortcut("Command palette")).toHaveAccessibleName("none");
  await settings.close();

  await app.composer.focus();
  await page.keyboard.press(app.key("Shift+P"));
  await page.keyboard.press(app.key("K"));
  // ⌘K / Ctrl+K as well (on the web it is the browser's own shortcut).
  await page.keyboard.press("ControlOrMeta+K");
  await page.keyboard.type("still typing here");
  await expect(app.composer).toHaveValue("still typing here");
  await expect(app.ui.palette).toHaveCount(0);
});
