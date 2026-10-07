// The screenshot lightbox: every screenshot on the page, in document order,
// with the one that was clicked showing.
export type Slide = { src: string; alt: string; caption: string };

export const lightbox: { slides: Slide[]; index: number; open: boolean } = $state({ slides: [], index: 0, open: false });

/** Open the gallery at `from`, a `[data-gallery]` element on the page. */
export function openGallery(from: HTMLElement) {
	const nodes = [...document.querySelectorAll<HTMLElement>('[data-gallery]')];
	lightbox.slides = nodes.map((n) => ({ src: n.dataset.src ?? '', alt: n.dataset.alt ?? '', caption: n.dataset.caption ?? '' }));
	lightbox.index = Math.max(0, nodes.indexOf(from));
	lightbox.open = true;
}
