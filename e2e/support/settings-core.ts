// The few Settings controls flows outside Settings need.
import type { Page } from "@playwright/test";
import { testId } from "./testid.ts";

export function settingsDialog(page: Page) {
  return testId(page, "settings");
}
export function openSettingsButton(page: Page) {
  return testId(page, "sidebar-settings");
}
/** A page in the Settings rail: `general`, `keyboard`, `agents`… */
export function settingsPage(page: Page, id: string) {
  return testId(settingsDialog(page), "settings-nav", { page: id });
}
/** "Notify when a background session needs you". */
export function notifySwitch(page: Page) {
  return testId(settingsDialog(page), "settings-notify");
}
