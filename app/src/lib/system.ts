// The OS side of the UI: error toasts, and links, Finder and the clipboard
// (quiet when they fail).
import { clipboard, shell, toast } from "@elyra/runtime";
import { errorMessage } from "./format";

/** A failed action, as an error toast. */
export function showError(e: unknown) {
  toast(errorMessage(e), { variant: "error", duration: 6000 });
}

/** Open a URL in the browser, or a path in Finder. Failing is not worth an error. */
export function openExternal(target: string) {
  shell.openExternal(target).catch(() => {});
}

/** Copy text: the app's clipboard, else the browser's (the web harness). True when it worked. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await clipboard.writeText(text);
    return true;
  } catch {
    return navigator.clipboard
      ?.writeText(text)
      .then(() => true)
      .catch(() => false) ?? false;
  }
}
