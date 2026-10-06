// What the app's shortcuts and the command palette do. Bindings live in
// lib/keybindings (rebindable in Settings → Keyboard shortcuts); a handler
// returning false lets the key through.
import { tick } from "svelte";
import { registerCommands, openCommandPalette } from "@elyra/runtime";
import { api } from "../bindings";
import { actionTitle, onAction, shortcut } from "./keybindings.svelte";
import { focusComposer } from "./focus";
import { app, currentId, currentSession, isBusy, openSession, orderedSessions, projectById } from "./sessions.svelte";
import { closeTab, sessionTabs } from "./tabs.svelte";
import { toggleBottom, toggleLeft, toggleRight } from "./layout.svelte";
import { openSettings } from "./customize.svelte";
import { openPlayground, openGithub, openActions, openLibrary, openAttention } from "./route.svelte";
import { newIssue, loadCatalog } from "./github.svelte";
import { showError } from "./system";

function cycleSession(step: number) {
  const list = orderedSessions();
  if (!list.length) return false;
  const i = list.findIndex((s) => s.id === currentId());
  openSession(list[(i + step + list.length) % list.length].id);
}

/** The shortcut handlers, and the palette (kept current). Call while App initialises. */
export function installCommands() {
  onAction("session.new", () => void (app.newSession = {}));
  onAction("session.stop", () => {
    const session = currentSession();
    if (!session || !isBusy(session.status)) return false;
    api.cancel(session.id).catch(showError);
  });
  onAction("session.next", () => cycleSession(1));
  onAction("session.prev", () => cycleSession(-1));
  for (let n = 1; n <= 9; n++) {
    onAction(`session.go${n}`, () => {
      const s = orderedSessions()[n - 1];
      if (!s) return false;
      openSession(s.id);
    });
  }
  onAction("composer.focus", focusComposer);
  onAction("view.left", toggleLeft);
  onAction("view.right", () => (currentSession() ? toggleRight() : false));
  onAction("view.terminal", () => (currentSession() ? toggleBottom() : false));
  onAction("tab.close", () => {
    const id = currentId();
    if (!id) return false;
    const t = sessionTabs(id);
    if (t.list[t.active]?.kind === "chat") return false;
    closeTab(t.active);
    // The closed tab may have held focus: move it to the tab that's showing now.
    tick().then(() => {
      if (document.activeElement && document.activeElement !== document.body) return;
      document.getElementById(`stab-${id}-tab-${t.active}`)?.focus();
    });
  });
  onAction("app.palette", () => openCommandPalette());
  onAction("app.settings", () => void (app.settings ? (app.settings = null) : openSettings()));

  // A palette entry named after a shortcut action, its key as the subtitle.
  const fromAction = (actionId: string, id: string, action: () => void) => ({ id, title: actionTitle(actionId), subtitle: shortcut(actionId), action });

  $effect(() => {
    registerCommands([
      fromAction("session.new", "new", () => void (app.newSession = {})),
      fromAction("app.settings", "settings", () => openSettings()),
      { id: "agents", title: "Agents", subtitle: "Settings", action: () => openSettings("agents") },
      { id: "shortcuts", title: "Keyboard shortcuts", subtitle: "Settings", action: () => openSettings("shortcuts") },
      fromAction("view.terminal", "terminal", () => currentSession() && toggleBottom()),
      fromAction("view.right", "panel", () => currentSession() && toggleRight()),
      fromAction("view.left", "sidebar", toggleLeft),
      { id: "library", title: "Search sessions", subtitle: "Saved transcripts and agent history", action: openLibrary },
      { id: "attention", title: "Needs attention", subtitle: "Permissions, failures and completed work", action: openAttention },
      { id: "actions", title: "GitHub Actions", subtitle: "Workflow runs, jobs and logs across repositories", action: openActions },
      { id: "github", title: "GitHub", subtitle: "Repositories, issues, pull requests and activity", action: openGithub },
      { id: "github-issue", title: "New GitHub issue", action: () => { openGithub(); void loadCatalog().then(() => newIssue()); } },
      { id: "playground", title: "Design system playground", subtitle: "Debug", action: openPlayground },
      ...app.sessions
        .filter((s) => !s.archived)
        .map((s) => ({
          id: `open:${s.id}`,
          title: s.title,
          subtitle: `${projectById(s.project_id)?.name ?? ""} · ${s.agent_id}`,
          action: () => openSession(s.id),
        })),
    ]);
  });
}
