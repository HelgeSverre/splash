// The app's keyboard shortcuts with their default combos: ⌘/Ctrl on the
// desktop, browser-safe Alt+Shift ones on the web (support/app.ts `key`).
import { expect, test } from "../../fixtures.ts";
import { keycaps, Settings } from "../../support/settings.ts";
import { Attention, Workbench } from "../../support/views.ts";

test("the Welcome page lists the shortcuts", async ({ splash }) => {
  const { app } = splash;
  // Keycaps side by side: "⌘N" (macOS), "CtrlN" (elsewhere).
  const caps = (combo: string) => keycaps(app.combo(combo)).replaceAll(" ", "");
  await expect(app.welcomeShortcut("session.new")).toHaveText(caps("N"));
  await expect(app.welcomeShortcut("session.go1")).toHaveText(caps("1"));
  await expect(app.welcomeShortcut("app.palette")).toHaveText(caps("Shift+P"));
  await expect(app.welcomeShortcut("view.terminal")).toHaveText(caps("J"));
  await expect(app.welcomeShortcut("app.settings")).toHaveText(caps(","));
});

test("New session opens from the keyboard, and Enter starts it", async ({ splash }) => {
  const { app, page, db } = splash;
  await page.keyboard.press(app.key("N"));
  await expect(app.newSessionDialog).toBeVisible();
  // Enter does nothing until an agent is picked: wait for the default one.
  await expect(app.dialogChoice("agent", "claude")).toBeChecked();
  await app.dialogChoice("where", "in_place").click();
  await page.keyboard.press("Enter");
  await expect(app.newSessionDialog).toBeHidden();
  const id = await app.sessionId();
  await app.expectStatus("idle");
  expect(db.session(id)).toMatchObject({ agent_id: "claude", isolation: "in_place" });
  // The composer has the focus: type straight away.
  await expect(app.composer).toBeFocused();
});

test("number keys open sessions in sidebar order; next and previous cycle", async ({ splash }) => {
  const { app, page, db } = splash;
  await app.newSession({ where: "in_place" });
  await app.prompt("First question");
  await app.newSession({ where: "in_place" });
  await app.prompt("Second question");

  // Each row shows its key; that key opens it.
  const rows = app.sessionRows;
  await expect(app.sessionRow("First question")).toBeVisible();
  await expect(app.sessionRow("Second question")).toBeVisible();
  await expect(rows).toHaveCount(2);
  const ids = await Promise.all([rows.nth(0), rows.nth(1)].map((row) => row.getAttribute("data-session-id")));
  const [first, second] = ids.map((id) => db.session(id!)!.title);
  await expect(app.sessionKey(app.sessionRow(first))).toHaveText(keycaps(app.combo("1")).replaceAll(" ", ""));
  await expect(app.sessionKey(app.sessionRow(second))).toHaveText(keycaps(app.combo("2")).replaceAll(" ", ""));

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
  const bench = new Workbench(page);
  await expect(app.terminalToggle).toHaveAttribute("aria-pressed", "false");
  await expect(app.panelToggle).toHaveAttribute("aria-pressed", "true");

  await page.keyboard.press(app.key("J"));
  await expect(app.terminalToggle).toHaveAttribute("aria-pressed", "true");
  await expect(bench.terminal).toBeVisible();
  // It works from inside the terminal too.
  await page.keyboard.press(app.key("J"));
  await expect(app.terminalToggle).toHaveAttribute("aria-pressed", "false");
  await expect(bench.terminal).toHaveCount(0);

  await page.keyboard.press(app.key("Alt+Meta+B"));
  await expect(app.panelToggle).toHaveAttribute("aria-pressed", "false");
  await expect(app.sidePanel).toHaveCount(0);
  await page.keyboard.press(app.key("Alt+Meta+B"));
  await expect(app.panelToggle).toHaveAttribute("aria-pressed", "true");
  await expect(app.sidePanel).toBeVisible();

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
  await settings.expectPage("general");
  // The same key closes it again, even though it is a dialog.
  await page.keyboard.press(app.key(","));
  await expect(settings.dialog).toBeHidden();
});

test("Close tab closes the open tab, never the chat", async ({ splash }) => {
  const { app, page } = splash;
  await app.newSession({ where: "in_place" });
  await app.openLogButton.click();
  await expect(app.sessionTab("log")).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press(app.key("W"));
  await expect(app.sessionTab("log")).toHaveCount(0);
  await expect(app.sessionTab("chat")).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press(app.key("W"));
  await expect(app.sessionTabs).toHaveCount(1);
  await expect(app.composer).toBeVisible();
});

test("the command palette runs commands and opens sessions", async ({ splash }) => {
  const { app, page } = splash;
  const id = await app.newSession({ where: "in_place" });
  await app.prompt("What does subtract do?");
  await app.openNav("library");

  await page.keyboard.press(app.key("Shift+P"));
  const { palette, paletteItems, paletteItem, paletteDetail } = app.ui;
  await expect(palette).toBeFocused();
  await expect(paletteDetail(paletteItem(/^New session/))).toHaveText(keycaps(app.combo("N")));
  await expect(paletteDetail(paletteItem("What does subtract do?"))).toHaveText("repo · claude");

  await palette.fill("attention");
  await expect(paletteItems).toHaveText(["Needs attentionPermissions, failures and completed work"]);
  await palette.press("Enter");
  await expect(palette).toHaveCount(0);
  await expect(page).toHaveURL(/#\/attention$/);
  await expect(new Attention(page).group("review")).toContainText("What does subtract do?");

  // ⌘K / Alt+Shift+K too; a session opens by its title.
  await page.keyboard.press(app.key("K"));
  await palette.fill("subtract");
  await expect(paletteItems).toHaveCount(1);
  await palette.press("Enter");
  await expect(page).toHaveURL(new RegExp(`#/session/${id}$`));
  await expect(app.title).toHaveText("What does subtract do?");

  // Escape closes it without running anything.
  const settings = new Settings(app);
  await page.keyboard.press(app.key("Shift+P"));
  await palette.fill("Keyboard shortcuts");
  await page.keyboard.press("Escape");
  await expect(palette).toHaveCount(0);
  await expect(settings.dialog).toHaveCount(0);

  await page.keyboard.press(app.key("Shift+P"));
  await palette.fill("Keyboard shortcuts");
  await palette.press("Enter");
  await settings.expectPage("shortcuts");
});

test("a shortcut removed in Settings stops working", async ({ splash }) => {
  const { app, page } = splash;
  await app.newSession({ where: "in_place" });
  const settings = new Settings(app);
  await settings.open("shortcuts");
  await settings.shortcut("app.palette").click();
  await page.keyboard.press("Backspace");
  await expect(settings.shortcut("app.palette")).toHaveAccessibleName("none");
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
