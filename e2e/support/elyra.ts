// The Elyra runtime's own UI (confirm, prompt, toasts, command palette, context
// menu) is plain DOM without ARIA roles; this is the one place that knows its
// class names.
import type { Locator, Page } from "@playwright/test";

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const elyra = (page: Page) => ({
  modal: page.locator(".elyra-modal-overlay"),
  /** A confirm/prompt button by its exact label ("Remove", "Cancel", "OK"…). */
  modalButton: (label: string): Locator =>
    page.locator(".elyra-modal-overlay .elyra-modal-btn").filter({ hasText: new RegExp(`^${escape(label)}$`) }),
  modalInput: page.locator(".elyra-modal-overlay .elyra-modal-input"),
  /** The open dialog's message (or its title, when it has no message). */
  modalMessage: page.locator(".elyra-modal-overlay").locator(".elyra-modal-body, .elyra-modal-title").first(),
  toasts: page.locator(".elyra-toast"),
  palette: page.locator(".elyra-cmdk input"),
  paletteItems: page.locator(".elyra-cmdk-item"),
  /** A context menu item, once the menu is open. */
  menuItem: (label: string | RegExp): Locator => page.locator(".elyra-ctx-item").filter({ hasText: label }),
});
