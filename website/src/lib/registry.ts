// The agent registry, read from src/agents/registry.rs at build time, so the
// site lists exactly the agents and launch commands the app ships with.
import source from '$repo/src/agents/registry.rs?raw';

export type RegistryAgent = { id: string; name: string; launch: string; adapter: boolean };

const field = (block: string, key: string) => new RegExp(`\\b${key}: "([^"]*)"`).exec(block)?.[1] ?? '';

export const REGISTRY: RegistryAgent[] = [...source.matchAll(/^ {4}AgentSpec \{([\s\S]*?)^ {4}\},/gm)]
	.map(([, block]) => {
		const args = [...(/\bargs: &\[([\s\S]*?)\]/.exec(block)?.[1] ?? '').matchAll(/"([^"]*)"/g)].map((m) => m[1]);
		return { id: field(block, 'id'), name: field(block, 'name'), launch: [field(block, 'program'), ...args].join(' '), adapter: block.includes('Transport::Adapter') };
	})
	.filter((a) => a.id && a.name);
