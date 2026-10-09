import { createContext } from 'svelte';

/** Footnote number by source id, set by a comparison page for `Cite`. */
export const [getCites, setCites] = createContext<Map<string, number>>();
