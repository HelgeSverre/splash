// How support code finds an element: by its data-testid, optionally narrowed by
// data-* attributes (a repeated row's identity). See AGENTS.md, Test ids.
// scripts/check-testids.ts checks every id named here exists in the app.
import type { Locator, Page } from "@playwright/test";

export function testId(scope: Page | Locator, id: string, data: Record<string, string> = {}): Locator {
  const attrs = Object.entries(data)
    .map(([key, value]) => `[data-${key}=${JSON.stringify(value)}]`)
    .join("");
  return attrs ? scope.locator(`[data-testid=${JSON.stringify(id)}]${attrs}`) : scope.getByTestId(id);
}
