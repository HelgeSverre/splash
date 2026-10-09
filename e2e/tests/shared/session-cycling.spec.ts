import { expect, test } from "../../fixtures.ts";

test("next and previous enter the session list from either end", async ({ splash }) => {
  const { app, page } = splash;
  for (const title of ["First conversation", "Second conversation", "Third conversation"]) {
    await app.newSession({ where: "in_place" });
    await app.prompt(title);
  }
  const first = await app.sessionRows.first().getAttribute("data-session-id");
  const last = await app.sessionRows.last().getAttribute("data-session-id");
  await app.openNav("library");
  await page.keyboard.press(app.key("Ctrl+Shift+Tab"));
  expect(await app.sessionId()).toBe(last);
  await app.openNav("library");
  await page.keyboard.press(app.key("Ctrl+Tab"));
  expect(await app.sessionId()).toBe(first);
});
