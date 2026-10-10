// Every comparison's data, by slug. Each lives in its own file here and
// renders at /vs/<slug>; a page that needs a different layout can replace the
// shared one with src/routes/vs/<slug>/+page.svelte and the same components.
// Only the server reads this; the footer and share cards use the lighter
// COMPARISON_LINKS in site.ts, which must list the same pages.
import { COMPARISON_LINKS } from '../site.ts';
import type { Comparison } from './types.ts';
import { AGENT_ORCHESTRATOR } from './agent-orchestrator.ts';
import { AGENT_TEAMS } from './agent-teams.ts';
import { AGENTGRID } from './agentgrid.ts';
import { AIONUI } from './aionui.ts';
import { ATLAS_AGENTS } from './atlas-agents.ts';
import { AUGMENT_INTENT } from './augment-intent.ts';
import { AUTOMAKER } from './automaker.ts';
import { BATON } from './baton.ts';
import { BB } from './bb.ts';
import { CATE } from './cate.ts';
import { CCGUI } from './ccgui.ts';
import { CLAUDE_DESKTOP } from './claude-desktop.ts';
import { CMUX } from './cmux.ts';
import { CODEG } from './codeg.ts';
import { CODELAYER } from './codelayer.ts';
import { CODELEGATE } from './codelegate.ts';
import { CODEX_APP } from './codex-app.ts';
import { CONDUCTOR } from './conductor.ts';
import { EMDASH } from './emdash.ts';
import { GITHUB_COPILOT_APP } from './github-copilot-app.ts';
import { GOLUTRA } from './golutra.ts';
import { HAPPY } from './happy.ts';
import { JEAN } from './jean.ts';
import { KEPLER } from './kepler.ts';
import { KIMI_CODE } from './kimi-code.ts';
import { KIRO_CREW } from './kiro-crew.ts';
import { MAESTRO } from './maestro.ts';
import { MONOCODE } from './monocode.ts';
import { MUNDER_DIFFLIN } from './munder-difflin.ts';
import { NEZHA } from './nezha.ts';
import { NODETERM } from './nodeterm.ts';
import { OPENCODE_DESKTOP } from './opencode-desktop.ts';
import { ORCA } from './orca.ts';
import { ORG_2 } from './org-2.ts';
import { PASEO } from './paseo.ts';
import { PIEBALD } from './piebald.ts';
import { POLYSCOPE } from './polyscope.ts';
import { POOLSIDE } from './poolside.ts';
import { SHIKIGAMI } from './shikigami.ts';
import { SOLO } from './soloterm.ts';
import { SUPACODE } from './supacode.ts';
import { SUPERSET } from './superset.ts';
import { SYNARA } from './synara.ts';
import { T3_CODE } from './t3-code.ts';
import { VERDENT } from './verdent.ts';
import { XUM } from './xum.ts';
import { ZED_DELTA } from './zed-delta.ts';
import { ZENFLOW } from './zenflow.ts';
import { ZERON } from './zeron.ts';

export const COMPARISONS: Comparison[] = [
	AGENT_ORCHESTRATOR, AGENT_TEAMS, AGENTGRID, AIONUI, ATLAS_AGENTS, AUGMENT_INTENT, AUTOMAKER, BATON, BB, CATE, CCGUI, CLAUDE_DESKTOP, CMUX, CODEG, CODELAYER, CODELEGATE, CODEX_APP, CONDUCTOR, EMDASH, GITHUB_COPILOT_APP, GOLUTRA, HAPPY, JEAN, KEPLER, KIMI_CODE, KIRO_CREW, MAESTRO, MONOCODE, MUNDER_DIFFLIN, NEZHA, NODETERM, OPENCODE_DESKTOP, ORCA, ORG_2, PASEO, PIEBALD, POLYSCOPE, POOLSIDE, SHIKIGAMI, SOLO, SUPACODE, SUPERSET, SYNARA, T3_CODE, VERDENT, XUM, ZED_DELTA, ZENFLOW, ZERON
];

const listed = COMPARISON_LINKS.map((l) => `${l.slug}:${l.name}`).join();
const defined = COMPARISONS.map((c) => `${c.slug}:${c.name}`).join();
if (listed !== defined) throw new Error(`COMPARISON_LINKS in site.ts (${listed}) doesn't match src/lib/compare (${defined})`);
