// The Elyra runtime's own UI (confirm, prompt, toasts, command palette, context
// menu) is plain DOM without ARIA roles; this is the one place that knows its
// class names.
import type { Locator, Page } from "@playwright/test";

export const elyra = (page: Page) => ({
  modal: page.locator(".elyra-modal-overlay"),
  /** Click a confirm/prompt button by its label ("Remove", "Cancel", "OK"…). */
  modalButton: (label: string | RegExp): Locator =>
    page.locator(".elyra-modal-overlay .elyra-modal-btn").filter({ hasText: label }),
  modalInput: page.locator(".elyra-modal-overlay .elyra-modal-input"),
  toasts: page.locator(".elyra-toast"),
  palette: page.locator(".elyra-cmdk input"),
  paletteItems: page.locator(".elyra-cmdk-item"),
  /** A context menu item, once the menu is open. */
  menuItem: (label: string | RegExp): Locator => page.locator(".elyra-ctx-item").filter({ hasText: label }),
});
