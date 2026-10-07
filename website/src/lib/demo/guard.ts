// The app's components own their window: they focus the composer when a
// session opens and scroll entries into view. On a web page that would yank
// the reader around (and open a phone's keyboard). Inside live scenes:
// - programmatic focus only applies once the visitor is using that scene,
//   and never scrolls the page;
// - scrollIntoView scrolls the scene's own scroller, not the page.
const SCENE = '.splash-ui';

let engaged: Element | null = null;

const sceneOf = (node: Node | null) => (node instanceof Element ? node.closest(SCENE) : node?.parentElement?.closest(SCENE)) ?? null;

function scroller(el: Element, scene: Element): HTMLElement | null {
	for (let p = el.parentElement; p && p !== scene.parentElement; p = p.parentElement) {
		const { overflowY } = getComputedStyle(p);
		if ((overflowY === 'auto' || overflowY === 'scroll') && p.scrollHeight > p.clientHeight) return p;
	}
	return null;
}

let installed = false;

export function installSceneGuard() {
	if (installed) return;
	installed = true;

	const remember = (e: Event) => (engaged = sceneOf(e.target as Node));
	window.addEventListener('pointerdown', remember, true);
	window.addEventListener('focusin', remember, true);

	const focus = HTMLElement.prototype.focus;
	HTMLElement.prototype.focus = function (this: HTMLElement, options?: FocusOptions) {
		const scene = sceneOf(this);
		if (!scene) return focus.call(this, options);
		if (engaged !== scene) return;
		focus.call(this, { ...options, preventScroll: true });
	};

	const scrollIntoView = Element.prototype.scrollIntoView;
	Element.prototype.scrollIntoView = function (this: Element, arg?: boolean | ScrollIntoViewOptions) {
		const scene = sceneOf(this);
		if (!scene) return scrollIntoView.call(this, arg);
		const box = scroller(this, scene);
		if (!box) return;
		const block = typeof arg === 'object' ? arg.block : arg === false ? 'end' : 'start';
		const el = this.getBoundingClientRect();
		const view = box.getBoundingClientRect();
		const offset = el.top - view.top;
		const target = block === 'center' ? offset - (view.height - el.height) / 2 : block === 'end' ? offset - view.height + el.height : offset;
		box.scrollTop += target;
	};
}
