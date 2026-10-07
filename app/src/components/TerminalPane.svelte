<script lang="ts" module>
  import { Terminal } from "@xterm/xterm";
  import { FitAddon } from "@xterm/addon-fit";
  import "@xterm/xterm/css/xterm.css";
  import { api, type TermEvent } from "../bindings";

  type Instance = { term: Terminal; fit: FitAddon; el: HTMLDivElement; lastSeq: number; exited: boolean; ready: boolean };
  // One xterm per session, kept alive while you switch around.
  const instances = new Map<string, Instance>();
  const pending = new Map<string, TermEvent[]>();

  const decode = (b64: string) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

  /** Shell output for whichever terminal it belongs to (lib/live subscribes this). */
  export function writeTerm(ev: TermEvent | undefined) {
    if (!ev) return;
    const inst = instances.get(ev.session);
    if (!inst) return;
    if (!inst.ready) {
      const queue = pending.get(ev.session) ?? [];
      queue.push(ev);
      if (queue.length > 1024) queue.shift();
      pending.set(ev.session, queue);
      return;
    }
    if (ev.seq <= inst.lastSeq) return;
    inst.lastSeq = ev.seq;
    if (ev.data) inst.term.write(decode(ev.data));
    if (ev.exited) {
      inst.exited = true;
      inst.term.write("\r\n\x1b[2m[shell exited · press any key for a new one]\x1b[0m\r\n");
    }
  }

  // xterm needs real colour strings: read the terminal tokens from app.css.
  function themeFromCss() {
    const css = getComputedStyle(document.documentElement);
    const v = (name: string) => css.getPropertyValue(`--${name}`).trim();
    const ansi = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"];
    const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
    return {
      background: v("term-bg"),
      foreground: v("term-fg"),
      cursor: v("term-cursor"),
      cursorAccent: v("term-bg"),
      selectionBackground: v("term-selection"),
      ...Object.fromEntries(ansi.map((c) => [c, v(`ansi-${c}`)])),
      ...Object.fromEntries(ansi.map((c) => [`bright${cap(c)}`, v(`ansi-bright-${c}`)])),
    };
  }

  async function attach(id: string, inst: Instance) {
    inst.fit.fit();
    const a = await api.term_open(id, inst.term.cols, inst.term.rows);
    if (a.scrollback) inst.term.write(decode(a.scrollback));
    inst.lastSeq = a.seq;
    inst.exited = false;
    inst.ready = true;
    drain(id);
  }

  function drain(id: string) {
    const queue = pending.get(id) ?? [];
    pending.delete(id);
    queue.forEach(writeTerm);
  }

  export async function reconnectTerminals(ids: Set<string>) {
    await Promise.all([...instances].filter(([id, inst]) => ids.has(id) && inst.term.element && !inst.exited).map(async ([id, inst]) => {
      inst.ready = false;
      const snapshot = await api.term_open(id, inst.term.cols, inst.term.rows);
      inst.term.reset();
      if (snapshot.scrollback) inst.term.write(decode(snapshot.scrollback));
      inst.lastSeq = snapshot.seq;
      inst.ready = true;
      drain(id);
    }));
  }

  function create(id: string): Instance {
    const el = document.createElement("div");
    el.className = "xterm-host";
    const term = new Terminal({
      fontFamily: '"JetBrains Mono Variable", "JetBrains Mono", ui-monospace, Menlo, monospace',
      fontSize: 12.5,
      lineHeight: 1.25,
      cursorBlink: true,
      allowProposedApi: false,
      scrollback: 5000,
      theme: themeFromCss(),
      macOptionIsMeta: true,
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    const inst: Instance = { term, fit, el, lastSeq: 0, exited: false, ready: false };
    term.onData((data) => {
      if (inst.exited) {
        inst.ready = false;
        term.reset();
        attach(id, inst);
        return;
      }
      api.term_write(id, data).catch(() => {});
    });
    term.onResize(({ cols, rows }) => {
      if (inst.ready) api.term_resize(id, cols, rows).catch(() => {});
    });
    instances.set(id, inst);
    return inst;
  }

  export function focusTerminal(id: string) {
    instances.get(id)?.term.focus();
  }
</script>

<script lang="ts">
  import { onDestroy } from "svelte";

  let { session }: { session: string } = $props();
  let host: HTMLDivElement | undefined = $state();
  let current: Instance | null = null;

  $effect(() => {
    const id = session;
    if (!host) return;
    const box = host;
    let inst = instances.get(id);
    const fresh = !inst;
    if (!inst) inst = create(id);
    if (current && current !== inst) current.el.remove();
    box.appendChild(inst.el);
    current = inst;
    const i = inst;
    document.fonts.ready.then(() => {
      if (fresh) {
        i.term.open(i.el);
        attach(id, i).then(() => i.term.focus());
      } else {
        i.fit.fit();
        i.term.focus();
      }
    });
  });

  // Refit when the pane is resized.
  $effect(() => {
    if (!host) return;
    const ro = new ResizeObserver(() => {
      if (current?.ready || current?.term.element) current.fit.fit();
    });
    ro.observe(host);
    return () => ro.disconnect();
  });

  onDestroy(() => current?.el.remove());
</script>

<div class="pane" bind:this={host}></div>

<style>
  .pane { position: absolute; inset: 0; padding: 6px 0 0 12px; background: var(--term-bg); }
  .pane :global(.xterm-host) { width: 100%; height: 100%; }
  .pane :global(.xterm) { height: 100%; }
  .pane :global(.xterm-viewport) { background: transparent !important; }
</style>
