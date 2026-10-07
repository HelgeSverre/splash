// The session library: search across titles, folders and transcripts,
// filters, opening a match at its message, and URLs that survive a reload.
import { expect, test, type Splash } from "../../fixtures.ts";

/** Two finished conversations, the Codex one archived. */
async function seed({ app, page }: Splash) {
  await app.newSession({ agent: "claude", where: "in_place" });
  await app.prompt("What does subtract do?");
  await app.newSession({ agent: "codex", where: "worktree" });
  await app.prompt("Look for bugs");
  await expect(app.title).toHaveText("Read calc.py and tell me in one sentence what bug it has");
  await app.contextMenu(app.sessionRow("Read calc.py and tell me in one sentence what bug it has"), "Archive");
  await expect(page.getByRole("button", { name: /^Archived/ })).toBeVisible();
  await app.openNav("Sessions");
  await expect(page.getByRole("heading", { name: "Sessions", level: 1 })).toBeVisible();
}

// The label around each select also holds its options' text, so find it by role.
const filter = (page: Splash["page"], name: string) => page.getByRole("combobox", { name, exact: true });
const results = (s: Splash) => s.page.locator(".results .session-row");
const summary = (s: Splash) => s.page.getByRole("status").filter({ hasText: /conversations|Searching/ });

test("search finds titles, folders and transcript words, archived included", async ({ splash }) => {
  const { page } = splash;
  await seed(splash);
  await expect(page.getByRole("tab", { name: /^In Splash/, selected: true })).toContainText("2");
  await expect(summary(splash)).toHaveText("2 conversations");
  const search = page.getByRole("searchbox", { name: "Search conversations" });

  await search.fill("subtract do");
  await expect(summary(splash)).toHaveText("1 conversations");
  await expect(results(splash)).toContainText("What does subtract do?");

  // The worktree's folder is under the data dir: a folder match.
  await search.fill("worktrees");
  await expect(summary(splash)).toHaveText("1 conversations");
  await expect(results(splash)).toContainText("Archived");

  // Words only the agent said, with an excerpt; whole-word prefixes match.
  const answer = (splash.db.entries(splash.db.sessions()[0].id)).find((e) => e.kind === "agent")!.data.text as string;
  const word = answer.match(/\b[a-z]{7,}\b/)![0];
  await search.fill(word.slice(0, 5));
  await expect(results(splash).first().locator(".excerpt")).toBeVisible();
  await search.fill(word.slice(1));
  await expect(summary(splash)).toHaveText("0 conversations");
  await expect(page.getByText("No matching conversations")).toBeVisible();
});

test("filters narrow by project, agent and status", async ({ splash }) => {
  const { page } = splash;
  await seed(splash);
  await filter(page, "Agent").selectOption({ label: "Codex" });
  await expect(results(splash)).toHaveCount(1);
  await expect(results(splash)).toContainText("Read calc.py");
  await filter(page, "Agent").selectOption({ label: "All agents" });

  await filter(page, "Status").selectOption({ label: "Archived" });
  await expect(results(splash)).toHaveCount(1);
  await expect(results(splash)).toContainText("Archived");
  await filter(page, "Status").selectOption({ label: "Not archived" });
  await expect(results(splash)).toHaveCount(1);
  await expect(results(splash)).toContainText("What does subtract do?");
  await filter(page, "Status").selectOption({ label: "Failed" });
  await expect(results(splash)).toHaveCount(0);

  await filter(page, "Status").selectOption({ label: "All sessions" });
  await filter(page, "Project").selectOption({ label: "repo" });
  await expect(results(splash)).toHaveCount(2);
});

test("a transcript match opens at its message, and the URL survives a reload", async ({ splash }) => {
  const { app, page } = splash;
  await seed(splash);
  const answer = (splash.db.entries(splash.db.sessions()[0].id)).find((e) => e.kind === "agent")!;
  const word = (answer.data.text as string).match(/\b[a-z]{7,}\b/)![0];
  await page.getByRole("searchbox", { name: "Search conversations" }).fill(word);
  await results(splash).filter({ hasText: "What does subtract do?" }).click();

  await page.waitForFunction(() => /^#\/session\/[^?]+\?entry=\d+$/.test(location.hash));
  const hash = await page.evaluate(() => location.hash);
  const entry = Number(hash.split("entry=")[1]);
  expect(entry).toBe(answer.idx);
  const matched = page.locator(".matched");
  await expect(matched).toHaveAttribute("data-kind", "agent");
  await expect(matched).toBeInViewport();

  await page.reload();
  await app.waitReady();
  await expect(page.locator(".matched")).toHaveAttribute("data-kind", "agent");
  expect(await page.evaluate(() => location.hash)).toBe(hash);
});

for (const [hash, heading] of [
  ["#/library", "Sessions"],
  ["#/attention", "Needs attention"],
] as const) {
  test(`${hash} survives a reload`, async ({ splash }) => {
    const { app, page, backend } = splash;
    await page.goto(`${backend.url}/${hash}`);
    await app.waitReady();
    await expect(page.getByRole("heading", { name: heading, level: 1 })).toBeVisible();
    await page.reload();
    await app.waitReady();
    await expect(page.getByRole("heading", { name: heading, level: 1 })).toBeVisible();
  });
}
