/** `data-*` attributes a primitive passes to its root element, such as a
 * `data-testid` for the browser tests (see AGENTS.md, Test ids). */
export type DataAttrs = { [key: `data-${string}`]: string | number | boolean | null | undefined };
