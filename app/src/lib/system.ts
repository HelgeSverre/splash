// The OS side of the UI: error toasts, and links, Finder and the clipboard
// (quiet when they fail).
import { clipboard, shell, toast } from "@elyra/runtime";
import { errorMessage } from "./format";
import { serverMode } from "./server.svelte";

/** A failed action, as an error toast. */
export function showError(e: unknown) {
  toast(errorMessage(e), { variant: "error", duration: 6000 });
}

/** Open a URL in the browser, or a path in Finder. Failing is not worth an error. */
export function openExternal(target: string) {
  if (serverMode) {
    if (/^https?:\/\//i.test(target)) window.open(target, "_blank", "noopener,noreferrer");
    else toast("This path is on the server. Use Splash’s Files panel to browse it.");
    return;
  }
  shell.openExternal(target).catch(() => {});
}

/** Copy text: the app's clipboard, else the browser's (the web harness). True when it worked. */
export async function copyText(text: string): Promise<boolean> {
  if (serverMode) return navigator.clipboard?.writeText(text).then(() => true).catch(() => false) ?? false;
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

export async function notifyUser(title: string, body: string) {
  if (serverMode) {
    // Only use a previously granted permission. No surprise browser prompts.
    if ('Notification' in window && Notification.permission === 'granted') new Notification(title, { body });
    else toast(`${title}: ${body}`);
  } else {
    const { notify } = await import('@elyra/runtime');
    await notify(title, body);
  }
}
