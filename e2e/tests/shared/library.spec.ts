// The session library: search across titles, folders and transcripts,
// filters, opening a match at its message, and URLs that survive a reload.
import { expect, test, type Splash } from "../../fixtures.ts";
import { Library } from "../../support/views.ts";

/** Two finished conversations, the Codex one archived. Returns their ids. */
async function seed({ app }: Splash) {
  const claude = await app.newSession({ agent: "claude", where: "in_place" });
  await app.prompt("What does subtract do?");
  const codex = await app.newSession({ agent: "codex", where: "worktree" });
  await app.prompt("Look for bugs");
  await expect(app.title).toHaveText("Read calc.py and tell me in one sentence what bug it has");
  await app.contextMenu(app.sessionRow("Read calc.py and tell me in one sentence what bug it has"), "Archive");
  await expect(app.archivedToggle).toBeVisible();
  await app.openNav("library");
  await expect(app.navItem("library")).toHaveAttribute("aria-current", "page");
  return { claude, codex };
}

/** A word only the agent said in this session. */
function agentWord(splash: Splash, sessionId: string) {
  const answer = splash.db.entries(sessionId).find((e) => e.kind === "agent")!;
  return { index: answer.idx, word: (answer.data.text as string).match(/\b[a-z]{7,}\b/)![0] };
}

test("search finds titles, folders and transcript words, archived included", async ({ splash }) => {
  const { claude, codex } = await seed(splash);
  const library = new Library(splash.page);
  await expect(library.tab("saved")).toHaveAttribute("aria-selected", "true");
  await expect(library.tab("saved")).toContainText("2");
  await expect(library.summary).toHaveAttribute("data-count", "2");

  await library.find("subtract do");
  await expect(library.rows()).toHaveCount(1);
  await expect(library.rows(claude)).toBeVisible();

  // The worktree's folder is under the data dir: a folder match.
  await library.find("worktrees");
  await expect(library.rows()).toHaveCount(1);
  await expect(library.rows(codex)).toHaveAttribute("data-archived", "true");

  // Words only the agent said, with an excerpt; whole-word prefixes match.
  const { word } = agentWord(splash, claude);
  await library.find(word.slice(0, 5));
  await expect(library.excerpt(library.rows(claude))).toBeVisible();
  await library.find(word.slice(1));
  await expect(library.rows()).toHaveCount(0);
  await expect(library.empty).toBeVisible();
});

test("filters narrow by project, agent and status", async ({ splash }) => {
  const { claude, codex } = await seed(splash);
  const library = new Library(splash.page);
  await library.agent.selectOption("codex");
  await expect(library.rows()).toHaveCount(1);
  await expect(library.rows(codex)).toBeVisible();
  await library.agent.selectOption("");

  await library.status.selectOption("archived");
  await expect(library.rows()).toHaveCount(1);
  await expect(library.rows(codex)).toBeVisible();
  await library.status.selectOption("active");
  await expect(library.rows()).toHaveCount(1);
  await expect(library.rows(claude)).toBeVisible();
  await library.status.selectOption("error");
  await expect(library.rows()).toHaveCount(0);

  await library.status.selectOption("all");
  await library.project.selectOption(splash.db.projects()[0].id);
  await expect(library.rows()).toHaveCount(2);
});

test("a transcript match opens at its message, and the URL survives a reload", async ({ splash }) => {
  const { app, page } = splash;
  const { claude } = await seed(splash);
  const { index, word } = agentWord(splash, claude);
  const library = new Library(page);
  await library.find(word);
  await expect(library.rows(claude)).toHaveAttribute("data-entry", String(index));
  await library.rows(claude).click();

  await page.waitForFunction(() => /^#\/session\/[^?]+\?entry=\d+$/.test(location.hash));
  const hash = await page.evaluate(() => location.hash);
  expect(hash).toBe(`#/session/${encodeURIComponent(claude)}?entry=${index}`);
  await expect(app.matchedEntry).toHaveAttribute("data-index", String(index));
  await expect(app.matchedEntry).toHaveAttribute("data-kind", "agent");
  await expect(app.matchedEntry).toBeInViewport();

  await page.reload();
  await app.waitReady();
  await expect(app.matchedEntry).toHaveAttribute("data-index", String(index));
  expect(await page.evaluate(() => location.hash)).toBe(hash);
});

for (const [hash, view] of [
  ["#/library", "library"],
  ["#/attention", "attention"],
] as const) {
  test(`${hash} survives a reload`, async ({ splash }) => {
    const { app, page, backend } = splash;
    await page.goto(`${backend.url}/${hash}`);
    await app.waitReady();
    await expect(app.navItem(view)).toHaveAttribute("aria-current", "page");
    await page.reload();
    await app.waitReady();
    await expect(app.navItem(view)).toHaveAttribute("aria-current", "page");
  });
}
