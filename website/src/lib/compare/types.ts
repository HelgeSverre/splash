// The shape of a "Splash vs X" page. Every fact on one carries the sources
// that back it; `sources.ts` numbers them and fails the build on a fact
// without a source or a source nothing cites.

/** A page we cite. `checked` is the day someone last confirmed it says what we use it for. */
export type Source = { id: string; title: string; url: string; publisher: string; checked: string };

/** How a cell reads at a glance. Plain-text answers (a price, a list) leave it out. */
export type Mark = 'yes' | 'no' | 'partial' | 'unknown';

/** One product's answer to one row. `cite` may be empty only when `mark` is `unknown`. */
export type Cell = { text: string; mark?: Mark; cite: string[] };

/** A table row: the question, then each product's answer. */
export type Row = { label: string; hint?: string; splash: Cell; other: Cell };

/** Rows under one heading. */
export type Group = { title: string; rows: Row[] };

/** A titled paragraph (`Details`). `text` is trusted HTML from these data files. */
export type Point = { title: string; text: string; cite?: string[] };

/** A product in the "at a glance" cards. */
export type Product = { name: string; url: string; maker: string; summary: string; cite: string[] };

export type Comparison = {
	slug: string;
	/** The other product's name, as its makers write it. */
	name: string;
	/** Search snippet and share text. */
	description: string;
	/** When the facts were last checked against their sources, YYYY-MM-DD. */
	checked: string;
	/** The page's opening paragraph: what each product is, without judging either. */
	intro: string;
	other: Product;
	groups: Group[];
	/** Differences worth more than a table cell. */
	differences?: Point[];
	/** Who each product suits, from the facts above. */
	fit?: { splash: string[]; other: string[] };
	/** The other product's sources. Splash's come from `splash.ts`. */
	sources: Source[];
};
