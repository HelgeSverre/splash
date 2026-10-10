import type { Page } from "@playwright/test";
import { join } from "node:path";
import { REPO_ROOT } from "./paths.ts";

/** Documentation captures use the real app and each test's isolated fixtures. */
export async function capture(page: Page, name: string) {
  await page.screenshot({ path: join(REPO_ROOT, "screenshots", `${name}.jpg`), type: "jpeg", quality: 90 });
}
