import { expect, test } from "../../fixtures.ts";
import { write } from "../../support/git.ts";
import { Settings } from "../../support/settings.ts";

test.beforeEach(({ world }) => {
  write(world.home, ".claude/skills/repeated-tools/SKILL.md", "---\nname: repeated-tools\ndescription: Repeated tool names\nallowed-tools: [Read, Read, Bash]\n---\n# Repeated tools\n\nThis document still renders.\n");
});

test("a skill preview accepts repeated values in its frontmatter", async ({ splash }) => {
  const { app, page } = splash;
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const settings = new Settings(app);
  await settings.open("agent:claude");
  await settings.subPage("claude", "skills");
  await settings.rowLink(settings.skills("repeated-tools")).click();
  const preview = settings.preview;
  await expect(preview.chips(preview.field("allowed-tools"))).toHaveText(["Read", "Read", "Bash"]);
  await expect(preview.document).toContainText("This document still renders.");
  await preview.view("source").click();
  await expect(preview.document).toContainText("# Repeated tools");
  await page.keyboard.press("Escape");
  await settings.expectPage("agent:claude:skills");
  expect(errors).toEqual([]);
});
