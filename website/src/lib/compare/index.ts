// Every comparison's data, by slug. Each lives in its own file here and
// renders at /vs/<slug>; a page that needs a different layout can replace the
// shared one with src/routes/vs/<slug>/+page.svelte and the same components.
// Only the server reads this; the footer and share cards use the lighter
// COMPARISON_LINKS in site.ts, which must list the same pages.
import { COMPARISON_LINKS } from '../site.ts';
import type { Comparison } from './types.ts';
import { CLAUDE_DESKTOP } from './claude-desktop.ts';
import { CODEG } from './codeg.ts';
import { CODEX_APP } from './codex-app.ts';
import { CONDUCTOR } from './conductor.ts';
import { EMDASH } from './emdash.ts';
import { JEAN } from './jean.ts';
import { KEPLER } from './kepler.ts';
import { ORCA } from './orca.ts';
import { PASEO } from './paseo.ts';
import { SOLO } from './soloterm.ts';
import { SUPERSET } from './superset.ts';
import { T3_CODE } from './t3-code.ts';

export const COMPARISONS: Comparison[] = [CLAUDE_DESKTOP, CODEG, CODEX_APP, CONDUCTOR, EMDASH, JEAN, KEPLER, ORCA, PASEO, SOLO, SUPERSET, T3_CODE];

const listed = COMPARISON_LINKS.map((l) => `${l.slug}:${l.name}`).join();
const defined = COMPARISONS.map((c) => `${c.slug}:${c.name}`).join();
if (listed !== defined) throw new Error(`COMPARISON_LINKS in site.ts (${listed}) doesn't match src/lib/compare (${defined})`);
