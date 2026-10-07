<script lang="ts">
  // The top bar of a session: its title (click to rename), the agent, the
  // repo, branch and PR, the status, the cost, and the panel toggles. The
  // playground renders this same component with `live` off (no git lookups,
  // no rename, no panel toggles).
  import { prompt as askText } from "@elyra/runtime";
  import AgentIcon from "./AgentIcon.svelte";
  import IconButton from "./ui/IconButton.svelte";
  import Tag from "./ui/Tag.svelte";
  import Icon from "./Icon.svelte";
  import { withKey } from "../lib/keybindings.svelte";
  import { statusLabel, usd } from "../lib/format";
  import { home } from "../lib/paths";
  import { api, type SessionView, type GitInfo } from "../bindings";
  import { agentById } from "../lib/sessions.svelte";
  import { layout, toggleBottom, toggleRight } from "../lib/layout.svelte";
  import { openExternal, showError } from "../lib/system";

  let { session, live = true }: { session: SessionView; live?: boolean } = $props();

  const agent = $derived(agentById(session.agent_id));
  const usage = $derived(session.meta.usage);
  const PR_TONE: Record<string, "ok" | "purple" | "err"> = { open: "ok", merged: "purple", closed: "err" };

  async function rename() {
    if (!live) return;
    const title = await askText("Rename session", { defaultValue: session.title });
    if (title && title.trim() && title !== session.title) api.rename_session(session.id, title).catch(showError);
  }

  // Upstream context: remote, branch and PR (refreshed when a turn finishes).
  let git = $state<GitInfo | null>(null);
  let lastStatus = "";
  $effect(() => {
    const id = session.id;
    const status = session.status;
    const finished = lastStatus === "running" && status === "idle";
    if (live && (!git || finished)) api.session_git(id, finished).then((g) => (git = g)).catch(() => {});
    lastStatus = status;
  });
  const open = (url: string | null | undefined) => url && openExternal(url);
  const branch = $derived(git?.branch ?? session.branch);
</script>

<header>
  <button class="plain title t-pane-title" data-testid="session-title" onclick={rename} title="Rename"><span class="title-text">{session.title}</span></button>
  <span class="agent"><AgentIcon id={session.agent_id} size={13} /> {agent?.name ?? session.agent_id}</span>
  {#if git?.repo}
    <button class="plain link repo" data-testid="session-repo" title={git.web_url} onclick={() => open(git?.web_url)}>{git.repo}</button>
  {/if}
  {#if branch}
    <button class="plain link branch" data-testid="session-branch" disabled={!git?.branch_url}
      title={session.isolation === "worktree" ? `worktree at ${session.cwd}` : `in place · ${session.cwd}`}
      onclick={() => open(git?.branch_url)}>
      <Icon name="branch" size={12} /><span class="truncate">{branch}</span>
    </button>
  {:else}
    <span class="link">{home(session.cwd)}</span>
  {/if}
  {#if git?.pr}
    <button class="plain link pr" data-testid="session-pr" data-number={git.pr.number} data-state={git.pr.state.toLowerCase()} title={git.pr.title} onclick={() => open(git?.pr?.url)}>
      PR #{git.pr.number}<Tag tone={PR_TONE[git.pr.state.toLowerCase()] ?? "default"}>{git.pr.state.toLowerCase()}</Tag>
    </button>
  {/if}
  <span class="status {session.status}" data-testid="session-status" data-status={session.status}><span class="dot {session.status}"></span>{statusLabel(session.status)}</span>
  {#if session.archived}<Tag data-testid="session-archived" tone="muted">archived</Tag>{/if}

  <span class="spacer"></span>

  {#if usage?.cost_usd}<span class="cost" data-testid="session-cost" title="session cost reported by the agent">{usd(usage.cost_usd)}</span>{/if}
  <span class="toggles">
    <IconButton data-testid="session-terminal-toggle" size="md" icon="panel-bottom" title={withKey("Terminal", "view.terminal")} label="Terminal" pressed={layout.bottomOpen} onclick={() => live && toggleBottom()} />
    <IconButton data-testid="session-panel-toggle" size="md" icon="panel-right" title={withKey("Changes & files", "view.right")} label="Changes & files" pressed={layout.rightOpen} onclick={() => live && toggleRight()} />
  </span>
</header>

<style>
  header {
    display: flex; align-items: center; gap: 12px; min-width: 0;
    padding: 0 12px 0 var(--gutter); height: var(--h-header); border-bottom: 1px solid var(--border); flex: none;
  }
  /* The title renames on click: a quiet box on hover and focus says so. */
  .title {
    display: flex; overflow: hidden; min-width: 60px; flex: 0 1 auto;
    margin-left: -6px; padding: 2px 6px; border-radius: var(--radius-sm); cursor: text;
  }
  .title:is(:hover, :focus-visible) { background: var(--row-hover); }
  .title-text { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .agent { display: inline-flex; align-items: center; gap: 6px; color: var(--muted); flex: none; font-size: var(--fs-sm); }
  .link {
    display: inline-flex; align-items: center; gap: 5px; min-width: 0; font-size: var(--fs-sm); color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    border-radius: var(--radius-sm);
  }
  .link:is(:hover, :focus-visible):not(:disabled) { color: var(--text); }
  .link:disabled { cursor: default; }
  .repo { flex: 0 3 auto; }
  .branch { flex: 0 2 auto; font-family: var(--font-mono); font-size: var(--fs-xs); }
  .pr { flex: none; gap: 6px; }
  .status { display: inline-flex; align-items: center; gap: 6px; color: var(--muted); font-size: var(--fs-sm); flex: none; }
  .status.running, .status.starting, .status.awaiting_permission { color: var(--accent); }
  .status.error { color: var(--err-dim); }
  .cost { font: var(--fs-xs) var(--font-mono); color: var(--muted); flex: none; font-variant-numeric: tabular-nums; }
  .toggles { display: flex; gap: 2px; flex: none; margin-left: 4px; }
</style>
