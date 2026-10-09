// The share card for each page (1200 × 630): /og-card/[slug] renders it on
// the dev server and scripts/og.ts captures it to static/og/<slug>.png.
import { COMPARISON_LINKS, FEATURES } from './site';

/** A live scene from src/lib/scenes, a real capture from SHOTS, or the app icon. */
export type Visual =
	| { scene: 'Workbench' | 'Attention' | 'Review' | 'AgentSettings'; props?: Record<string, unknown>; window: string }
	| { shot: 'serverLibrary' }
	| { icon: true };

export type Card = {
	/** The mono label above the headline. */
	eyebrow: string;
	title: string;
	/** Headline words set in the accent colour, after `title`. */
	accent?: string;
	visual: Visual;
	/** Alt text for og:image and twitter:image. */
	alt: string;
	/** How long the scene plays before the capture, in ms. */
	settle?: number;
};

const FEATURE_VISUALS: Record<string, { visual: Visual; shows: string }> = {
	sessions: { visual: { scene: 'Workbench', window: 'atlas · Splash' }, shows: 'Claude Code working in its own worktree in the Splash app' },
	attention: { visual: { scene: 'Attention', props: { target: 'workbench' }, window: 'Needs attention · Splash' }, shows: 'the Needs attention queue in the Splash app' },
	review: { visual: { scene: 'Review', window: 'Fix project cache isolation · Splash' }, shows: "a session's diff and final answer in Splash's Review tab" },
	history: { visual: { scene: 'Workbench', props: { view: 'library' }, window: 'Sessions · Splash' }, shows: 'the Splash session library across agents' },
	github: { visual: { scene: 'Workbench', props: { view: 'github' }, window: 'GitHub · Splash' }, shows: 'GitHub triage in the Splash app' },
	server: { visual: { shot: 'serverLibrary' }, shows: 'the Splash session library served by splash-server in a browser' },
	agents: { visual: { scene: 'AgentSettings', window: 'Settings · Splash' }, shows: "Splash's agent settings" }
};

export const CARDS: Record<string, Card> = {
	home: {
		eyebrow: 'Open source · macOS, Windows, Linux',
		title: 'Run every coding agent',
		accent: 'side by side.',
		visual: { scene: 'Workbench', window: 'atlas · Splash' },
		alt: 'Splash: run every coding agent side by side. Below, Claude Code working in its own worktree in the Splash app.',
		settle: 2500
	},
	download: {
		eyebrow: 'Download',
		title: 'Splash for macOS, Windows and Linux.',
		visual: { icon: true },
		alt: 'The Splash app icon. Splash for macOS, Windows and Linux, or headless on a server.'
	},
	...Object.fromEntries(
		FEATURES.map((f) => {
			const { visual, shows } = FEATURE_VISUALS[f.slug];
			return [f.slug, { eyebrow: f.name, title: f.title, visual, alt: `${f.title} Below, ${shows}.`, settle: 2500 } satisfies Card];
		})
	),
	vs: {
		eyebrow: 'Compare',
		title: 'Splash and the alternatives,',
		accent: 'compared.',
		visual: { icon: true },
		alt: 'Splash and the alternatives, compared. The Splash app icon and the platforms it runs on.'
	},
	...Object.fromEntries(
		COMPARISON_LINKS.map((c) => [
			`vs-${c.slug}`,
			{ eyebrow: 'Compare', title: `Splash and ${c.name},`, accent: 'compared.', visual: { icon: true }, alt: `Splash and ${c.name}, compared. The Splash app icon and the platforms it runs on.` } satisfies Card
		])
	)
};
