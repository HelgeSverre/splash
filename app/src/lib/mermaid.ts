// Diagrams from ```mermaid fences in agent messages, drawn the way ChatGPT's
// app draws them (read from its bundle): stock mermaid 11 with the ELK layout
// instead of dagre, SVG text labels, rounded nodes with hairline borders,
// pill-shaped edge labels and open chevron arrowheads, in Splash's colours
// (app.css, the --diagram-* tokens). Mermaid and ELK (about 2 MB) load the
// first time a finished diagram is shown, renders run one at a time (mermaid's
// config is global) and are cached by source, so a transcript that re-renders
// pays nothing. lib/markdown.ts emits the block; Markdown.svelte calls
// mountDiagrams once the HTML is in the DOM.
import DOMPurify from "dompurify";
import type { InternalHelpers, LayoutData, LayoutLoaderDefinition, MermaidConfig, SVG } from "mermaid";

type MermaidApi = typeof import("mermaid").default;
type Rgb = [number, number, number];
type Point = { x: number; y: number };

const FLOWCHART = "splash-flowchart";
const DECISION = new Set(["diamond", "diam", "decision", "question"]);
const BOX = new Set(["rect", "squareRect", "proc", "process", "rectangle", "rounded", "roundedRect", "event"]);
/** `%%{init: …}%%` and friends: a message's directive must not restyle the diagram. */
const DIRECTIVE = /%%\{[\s\S]*?\}%%/g;
const FLOW = /^\s*(?:flowchart|graph)\b/im;

let loading: Promise<MermaidApi> | undefined;
let queue: Promise<unknown> = Promise.resolve();
let count = 0;
const rendered = new Map<string, Promise<string>>();

/**
 * Draws every pending diagram block under `root` (see markdown.ts) once its
 * SVG is ready. An invalid diagram keeps showing its source, with the error.
 */
export function mountDiagrams(root: ParentNode): void {
  for (const block of root.querySelectorAll<HTMLElement>('.mermaid[data-status="pending"]')) {
    const source = block.querySelector(".mermaid-source code")?.textContent ?? "";
    const target = block.querySelector<HTMLElement>(".mermaid-diagram");
    const note = block.querySelector<HTMLElement>(".mermaid-error");
    if (!target || !note) continue;
    block.dataset.status = "rendering";
    render(source).then(
      (svg) => {
        if (!block.isConnected) return;
        target.innerHTML = svg;
        block.dataset.status = "ready";
        fitOrScroll(block, target);
      },
      (error: unknown) => {
        if (!block.isConnected) return;
        note.textContent = `Not a valid diagram: ${describe(error)}`;
        block.dataset.status = "error";
      },
    );
  }
}

/**
 * Mermaid's parse errors quote the line and point at the column over several
 * lines; keep the first line ("Parse error on line 3:") and the verdict
 * ("Expecting …, got 'EOF'"), cut to a sentence.
 */
function describe(error: unknown): string {
  const lines = (error instanceof Error ? error.message : String(error)).split("\n").map((l) => l.trim());
  const verdict = lines.find((l) => /^(Expecting|Lexical error|No diagram type)/.test(l));
  const text = [lines[0], verdict].filter((l) => l).join(" ") || "mermaid could not draw it";
  return text.length > 160 ? `${text.slice(0, 159)}…` : text;
}

/**
 * A diagram wider than the column scales down to fit (the default) unless that
 * would make its text too small to read: then it starts at actual size and
 * scrolls sideways. The bar's Actual size button flips either way.
 */
function fitOrScroll(block: HTMLElement, target: HTMLElement): void {
  const svg = target.querySelector("svg");
  const width = svg?.viewBox.baseVal.width || Number(svg?.getAttribute("width")) || 0;
  const room = target.clientWidth - 28;
  if (!width || room <= 0 || room / width >= 0.7) return;
  block.dataset.size = "actual";
  block.querySelector(".mermaid-size")?.setAttribute("aria-pressed", "true");
}

/** The SVG for a source, from the cache or the queue. */
function render(source: string): Promise<string> {
  let hit = rendered.get(source);
  if (!hit) {
    hit = queue.then(() => draw(source));
    queue = hit.catch(() => {});
    if (rendered.size > 200) rendered.clear();
    rendered.set(source, hit);
  }
  return hit;
}

function load(): Promise<MermaidApi> {
  loading ??= (async () => {
    const [{ default: mermaid }, { default: elk }] = await Promise.all([import("mermaid"), import("@mermaid-js/layout-elk")]);
    mermaid.registerLayoutLoaders([...elk, flowchartLayout(elk[0])]);
    return mermaid;
  })();
  return loading;
}

async function draw(source: string): Promise<string> {
  const mermaid = await load();
  // Text is measured with the real font, so a late Inter can't widen labels.
  await document.fonts?.ready;
  const t = theme();
  const text = source.replace(DIRECTIVE, "").trim();
  mermaid.initialize(config(t, FLOW.test(text)));
  const id = `splash-diagram-${++count}`;
  let svg: string;
  try {
    ({ svg } = await mermaid.render(id, text));
  } catch (error) {
    const healed = healFlowchart(text);
    if (healed === text) throw error;
    ({ svg } = await mermaid.render(`${id}h`, healed));
  }
  return DOMPurify.sanitize(polish(svg, t), { USE_PROFILES: { svg: true, svgFilters: true } });
}

// ── Layout ──────────────────────────────────────────────────────────────────

/**
 * The ELK layout, for flowcharts: padded rounded nodes, decisions as dashed
 * boxes instead of diamonds, arrows that stop just short of the node, and
 * edge labels as pills sized to their text.
 */
function flowchartLayout(elk: LayoutLoaderDefinition): LayoutLoaderDefinition {
  return {
    ...elk,
    name: FLOWCHART,
    loader: async () => {
      const impl = await elk.loader();
      return {
        async render(data: LayoutData, svg: SVG, helpers: InternalHelpers, options) {
          for (const node of data.nodes) {
            if (node.isGroup) continue;
            if (DECISION.has(node.shape ?? "")) {
              node.shape = "rect";
              node.cssClasses = `${node.cssClasses ?? ""} decision`;
            }
            if (node.shape === "rect" || BOX.has(node.shape ?? "")) {
              node.shape = "rect";
              node.padding = 14;
              node.labelPaddingX = 28;
              node.height = Math.max(node.height ?? 0, 44);
            }
          }
          const tweaked: InternalHelpers = {
            ...helpers,
            insertEdge(elem, edge, clusterDb, diagramType, startNode, endNode, diagramId, skipIntersect) {
              const shortened = { ...edge, points: pullBack(edge) };
              return helpers.insertEdge(elem, shortened, clusterDb, diagramType, startNode, endNode, diagramId, skipIntersect);
            },
            async insertEdgeLabel(elem, edge) {
              const label = await helpers.insertEdgeLabel(elem, edge);
              pill(label, edge);
              return label;
            },
          };
          await impl.render(data, svg, tweaked, options);
        },
      };
    },
  };
}

/** The edge's points with each pointed end pulled back a few px from the node. */
function pullBack(edge: { points?: Point[]; arrowTypeStart?: string; arrowTypeEnd?: string }): Point[] {
  const points = (edge.points ?? []).map((p) => ({ ...p }));
  const ends: [number, number, string | undefined][] = [
    [0, 1, edge.arrowTypeStart],
    [points.length - 1, points.length - 2, edge.arrowTypeEnd],
  ];
  for (const [end, prev, type] of ends) {
    const a = points[end];
    const b = points[prev];
    if (type !== "arrow_point" || !a || !b) continue;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    if (!len) continue;
    const cut = Math.min(6, Math.max(0, len / 2 - 4));
    points[end] = { x: a.x + (dx / len) * cut, y: a.y + (dy / len) * cut };
  }
  return points;
}

/** An edge label's background as a pill around its text; the edge learns the new size. */
function pill(label: SVGGElement, edge: { label?: string; width?: number; height?: number }): void {
  const bg = label.querySelector<SVGRectElement>("rect.background");
  const text = label.querySelector<SVGTextElement>("text");
  if (!edge.label || !bg || !text) return;
  const box = text.getBBox();
  const h = Math.max(22, box.height + 8);
  bg.setAttribute("x", String(box.x - 11));
  bg.setAttribute("y", String(box.y - (h - box.height) / 2));
  bg.setAttribute("width", String(box.width + 22));
  bg.setAttribute("height", String(h));
  bg.style.removeProperty("stroke");
  const outer = label.getBBox();
  edge.width = outer.width;
  edge.height = outer.height;
  label.parentElement?.setAttribute("transform", `translate(${-outer.x - outer.width / 2},${-outer.y - outer.height / 2})`);
}

/**
 * Quotes flowchart labels that contain ( ) or |, the usual reason an agent's
 * hand-written diagram fails to parse. The retry when the first render throws.
 */
function healFlowchart(source: string): string {
  if (!FLOW.test(source)) return source;
  const quote = (match: string, id: string, label: string, open: string, close: string) => {
    const inner = label.trim();
    if (!/[()|]/.test(inner) || (inner.startsWith('"') && inner.endsWith('"'))) return match;
    return `${id}${open}"${inner.replace(/"/g, "#quot;")}"${close}`;
  };
  return source
    .replace(/(\b[\w.:-]+)\[([^\]\n]*)\]/g, (m, id, label) => quote(m, id, label, "[", "]"))
    .replace(/(\b[\w.:-]+)\{([^}\n]*)\}/g, (m, id, label) => quote(m, id, label, "{", "}"));
}

// ── Theme ───────────────────────────────────────────────────────────────────

type Theme = {
  dark: boolean;
  font: string;
  fontSize: string;
  labelSize: string;
  radius: string;
  surface: Rgb;
  node: string;
  nodeBorder: string;
  decision: string;
  alt: string;
  cluster: string;
  clusterBorder: string;
  line: string;
  text: string;
  muted: string;
};

/** Splash's tokens, resolved: mermaid's theme code needs plain colours, not var(). */
function theme(): Theme {
  const root = document.documentElement;
  const css = getComputedStyle(root);
  const probe = document.createElement("span");
  probe.style.display = "none";
  root.append(probe);
  const resolve = (token: string): Rgb => {
    probe.style.color = `var(${token})`;
    return parseColor(getComputedStyle(probe).color) ?? [128, 128, 128];
  };
  const token = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
  try {
    const surface = resolve("--diagram-surface");
    return {
      dark: luma(surface) < 128,
      font: token("--font-ui", "sans-serif"),
      fontSize: token("--fs-base", "13px"),
      labelSize: token("--fs-sm", "12px"),
      radius: token("--radius-lg", "8px"),
      surface,
      node: hex(resolve("--diagram-node")),
      nodeBorder: hex(resolve("--diagram-node-border")),
      decision: hex(resolve("--diagram-decision")),
      alt: hex(resolve("--diagram-alt")),
      cluster: hex(resolve("--diagram-cluster")),
      clusterBorder: hex(resolve("--diagram-cluster-border")),
      line: hex(resolve("--diagram-line")),
      text: hex(resolve("--diagram-text")),
      muted: hex(resolve("--diagram-muted")),
    };
  } finally {
    probe.remove();
  }
}

/** A computed colour: the legacy form with 0 to 255 channels, or the color(srgb r g b) form a mixed token resolves to. */
function parseColor(color: string): Rgb | undefined {
  const nums = color.match(/-?\d*\.?\d+(?:e-?\d+)?/g)?.map(Number) ?? [];
  if (nums.length < 3) return undefined;
  const scale = color.startsWith("color(") ? 255 : 1;
  return [nums[0] * scale, nums[1] * scale, nums[2] * scale];
}

const channel = (v: number) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0");
const hex = (c: Rgb) => `#${c.map(channel).join("")}`;
const mix = (a: Rgb, b: Rgb, t: number): Rgb => [a[0] * t + b[0] * (1 - t), a[1] * t + b[1] * (1 - t), a[2] * t + b[2] * (1 - t)];
const luma = (c: Rgb) => (c[0] * 299 + c[1] * 587 + c[2] * 114) / 1000;

function config(t: Theme, flowchart: boolean): MermaidConfig {
  const fit = { useMaxWidth: false };
  return {
    startOnLoad: false,
    securityLevel: "strict",
    suppressErrorRendering: true,
    theme: "base",
    darkMode: t.dark,
    fontFamily: t.font,
    themeVariables: themeVariables(t),
    themeCSS: themeCSS(t),
    layout: flowchart ? FLOWCHART : "elk",
    htmlLabels: false,
    flowchart: { ...fit, htmlLabels: false },
    sequence: fit,
    state: fit,
    class: fit,
    er: fit,
    gantt: fit,
    pie: fit,
    journey: fit,
    timeline: fit,
    mindmap: fit,
    gitGraph: fit,
    quadrantChart: fit,
    xyChart: fit,
    requirement: fit,
    c4: fit,
    sankey: fit,
    block: fit,
    packet: fit,
    architecture: fit,
    radar: fit,
  };
}

function themeVariables(t: Theme) {
  const surface = hex(t.surface);
  return {
    darkMode: t.dark,
    fontFamily: t.font,
    fontSize: t.fontSize,
    background: surface,
    primaryColor: t.node,
    primaryTextColor: t.text,
    primaryBorderColor: t.nodeBorder,
    secondaryColor: t.cluster,
    secondaryTextColor: t.text,
    secondaryBorderColor: t.clusterBorder,
    tertiaryColor: t.cluster,
    tertiaryTextColor: t.text,
    tertiaryBorderColor: t.clusterBorder,
    textColor: t.text,
    titleColor: t.text,
    lineColor: t.line,
    mainBkg: t.node,
    nodeBkg: t.node,
    nodeBorder: t.nodeBorder,
    nodeTextColor: t.text,
    clusterBkg: t.cluster,
    clusterBorder: t.clusterBorder,
    edgeLabelBackground: surface,
    // sequence
    actorBkg: t.node,
    actorBorder: t.nodeBorder,
    actorTextColor: t.text,
    actorLineColor: t.line,
    signalColor: t.line,
    signalTextColor: t.text,
    labelBoxBkgColor: surface,
    labelBoxBorderColor: t.clusterBorder,
    labelTextColor: t.text,
    loopTextColor: t.text,
    noteBkgColor: t.decision,
    noteTextColor: t.text,
    noteBorderColor: t.clusterBorder,
    activationBkgColor: t.alt,
    activationBorderColor: t.nodeBorder,
    sequenceNumberColor: surface,
    // gantt
    sectionBkgColor: t.cluster,
    altSectionBkgColor: surface,
    sectionBkgColor2: t.decision,
    taskBkgColor: t.node,
    taskBorderColor: t.nodeBorder,
    taskTextColor: t.text,
    taskTextLightColor: t.text,
    taskTextOutsideColor: t.text,
    taskTextDarkColor: t.text,
    activeTaskBkgColor: t.alt,
    activeTaskBorderColor: t.nodeBorder,
    doneTaskBkgColor: t.cluster,
    doneTaskBorderColor: t.clusterBorder,
    critBkgColor: t.alt,
    critBorderColor: t.nodeBorder,
    gridColor: t.clusterBorder,
    todayLineColor: t.nodeBorder,
    // state, timeline, pie
    labelColor: t.text,
    altBackground: t.cluster,
    cScale0: t.node,
    cScale1: t.alt,
    cScale2: t.decision,
    pie1: t.node,
    pie2: t.alt,
    pie3: t.decision,
  };
}

function themeCSS(t: Theme): string {
  const surface = hex(t.surface);
  return `
.node text, .nodeLabel { font-size: ${t.fontSize}; font-weight: 600; fill: ${t.text}; }
.edgeLabels text, .edgeLabel text { font-size: ${t.labelSize}; font-weight: 600; fill: ${t.text}; }
.node tspan[font-weight="normal"], .edgeLabels tspan[font-weight="normal"] { font-weight: 600; }
.edgeLabel .label rect { opacity: 1; rx: 11px; ry: 11px; fill: ${surface}; stroke: ${t.line}; stroke-width: 1px; }
.node rect, .node circle, .node ellipse, .node polygon, .node path { fill: ${t.node}; stroke: ${t.nodeBorder}; stroke-width: 1px; }
.node rect { rx: ${t.radius}; ry: ${t.radius}; }
.node.decision .label-container { fill: ${t.decision}; stroke: ${t.nodeBorder}; stroke-dasharray: 3 3; }
.cluster rect { rx: ${t.radius}; ry: ${t.radius}; fill: ${t.cluster}; stroke: ${t.clusterBorder}; stroke-width: 1px; }
.cluster-label text, .cluster .nodeLabel { font-weight: 700; fill: ${t.muted}; }
.edgePaths .flowchart-link, .edgePath .path { stroke: ${t.line}; stroke-width: 1.25px; stroke-linecap: round; stroke-linejoin: round; }
.marker, marker path { fill: none; stroke: ${t.line}; }
.messageLine0, .messageLine1 { stroke-width: 1.25px; }
.actor { stroke-width: 1px; }
`;
}

// ── After mermaid ───────────────────────────────────────────────────────────

/** Open chevrons instead of filled arrowheads, and an agent's own fills toned down. */
function polish(svgText: string, t: Theme): string {
  const tpl = document.createElement("template");
  tpl.innerHTML = svgText;
  const svg = tpl.content.querySelector("svg");
  if (!svg) return svgText;
  chevrons(svg);
  softenFills(svg, t);
  return svg.outerHTML;
}

function chevrons(svg: SVGSVGElement): void {
  for (const marker of svg.querySelectorAll('marker[id*="pointEnd"], marker[id*="pointStart"]')) {
    const end = marker.id.includes("pointEnd");
    marker.setAttribute("viewBox", "-5 -5 10 10");
    marker.setAttribute("markerWidth", "10");
    marker.setAttribute("markerHeight", "10");
    marker.setAttribute("refX", end ? "1" : "-1");
    marker.setAttribute("refY", "0");
    for (const path of marker.querySelectorAll("path")) {
      path.setAttribute("d", end ? "M -3 -3.5 L 1 0 L -3 3.5" : "M 3 -3.5 L -1 0 L 3 3.5");
      path.setAttribute("style", "fill: none; stroke-width: 1.25; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: none");
    }
  }
}

/**
 * Fills from `style` and `classDef` lines become pastel (22% of the colour
 * over the surface, as ChatGPT does), and their labels keep the theme's text
 * colour, so an agent's colour choices stay readable on the dark surface.
 */
function softenFills(svg: SVGSVGElement, t: Theme): void {
  const shapes = svg.querySelectorAll<SVGElement>('.node > .label-container[style*="fill"], .node > .label-container.outer-path > path[style*="fill"]');
  if (!shapes.length) return;
  const probe = document.createElement("span");
  probe.style.display = "none";
  document.documentElement.append(probe);
  try {
    for (const shape of shapes) {
      const fill = shape.style.getPropertyValue("fill").trim();
      if (!fill || fill === "none" || fill === "transparent") continue;
      probe.style.color = "";
      probe.style.color = fill;
      const rgb = parseColor(getComputedStyle(probe).color);
      if (!rgb) continue;
      shape.style.setProperty("fill", hex(mix(rgb, t.surface, 0.22)), "important");
      for (const text of shape.closest(".node")?.querySelectorAll<SVGElement>("text, tspan") ?? []) text.style.setProperty("fill", t.text, "important");
    }
  } finally {
    probe.remove();
  }
}
