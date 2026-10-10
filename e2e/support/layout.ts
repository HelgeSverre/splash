import type { Page } from "@playwright/test";
import { testId } from "./testid.ts";

export class Layout {
  readonly page: Page;
  constructor(page: Page) { this.page = page; }
  get center() { return testId(this.page, "workbench-center"); }
  get side() { return testId(this.page, "workbench-side"); }
  get sidebar() { return testId(this.page, "sidebar"); }
}
