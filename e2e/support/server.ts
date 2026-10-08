// The web version's own UI: the login page, the connection banner and the
// server folder picker.
import { expect, type Page } from "@playwright/test";
import { testId } from "./testid.ts";

/** The login page served before the token is entered (src/server/login.html). */
export class Login {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  get token() {
    return testId(this.page, "login-token");
  }
  get submit() {
    return testId(this.page, "login-submit");
  }
  get error() {
    return testId(this.page, "login-error");
  }
  async signIn(token: string) {
    await this.token.fill(token);
    await this.submit.click();
  }
}

/** The banner over the app: the server's name, the connection, sign out. */
export class Connection {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  /** Its `data-status`: connecting, online, syncing, offline or auth. */
  get banner() {
    return testId(this.page, "server-connection");
  }
  get name() {
    return testId(this.page, "server-name");
  }
  get message() {
    return testId(this.page, "server-status");
  }
  get error() {
    return testId(this.page, "server-error");
  }
  get retry() {
    return testId(this.page, "server-retry");
  }
  get signOut() {
    return testId(this.page, "server-sign-out");
  }
  get signIn() {
    return testId(this.page, "server-sign-in");
  }
  async expectStatus(status: "connecting" | "online" | "syncing" | "offline" | "auth", timeout?: number) {
    await expect(this.banner).toHaveAttribute("data-status", status, { timeout });
  }
  /** Fail the page's connection checks, so it keeps the IPC token it has
   * (a restarted server's token stays unknown to it) until `releaseChecks`. */
  async holdChecks() {
    await this.page.route("**/__server/state", (route) => route.abort());
  }
  async releaseChecks() {
    await this.page.unroute("**/__server/state");
  }
  /** The page has adopted this server instance (and its IPC token), restored
   * the workspace and shows Connected. */
  async expectInstance(instance: string, timeout?: number) {
    await this.page.waitForFunction((i) => globalThis.__SPLASH_SERVER__?.instance === i, instance, { timeout });
    await this.expectStatus("online", timeout);
  }
}

/** "Add a folder on the server": browse the server's folders. */
export class FolderPicker {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  get dialog() {
    return testId(this.page, "folder-picker");
  }
  get path() {
    return testId(this.dialog, "folder-picker-path");
  }
  get go() {
    return testId(this.dialog, "folder-picker-go");
  }
  get home() {
    return testId(this.dialog, "folder-picker-home");
  }
  get up() {
    return testId(this.dialog, "folder-picker-up");
  }
  get error() {
    return testId(this.dialog, "folder-picker-error");
  }
  /** The listing; `data-path` is the folder listed, `aria-busy` while loading. */
  get list() {
    return testId(this.dialog, "folder-picker-list");
  }
  folder(path?: string) {
    return testId(this.list, "folder-picker-folder", path ? { path } : {});
  }
  /** The listed folders' paths, in order. */
  folderPaths(): Promise<(string | null)[]> {
    return this.folder().evaluateAll((folders) => folders.map((folder) => folder.getAttribute("data-path")));
  }
  get add() {
    return testId(this.dialog, "folder-picker-add");
  }
  get cancel() {
    return testId(this.dialog, "folder-picker-cancel");
  }
  /** Type a path, open it, and wait until it is the listed folder. */
  async open(path: string) {
    await this.path.fill(path);
    await this.go.click();
    await expect(this.list).toHaveAttribute("data-path", path);
    await expect(this.list).toHaveAttribute("aria-busy", "false");
  }
}
