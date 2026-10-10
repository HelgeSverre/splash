<script lang="ts">
	// Scenes share the app's state with the page's workbench window. When the
	// visitor's click inside a scene hands off to the workbench (opening a
	// session, starting a new one, switching views) and that window is off
	// screen, bring it into view. Changes the scripted demo agents make on
	// their own never move the page.
	import { app } from '$splash/lib/sessions.svelte';
	import { actedInScene } from '../demo/guard.ts';

	let { target = 'demo' }: { target?: string } = $props();

	const key = () => `${app.view.kind}:${app.view.kind === 'session' ? app.view.id : ''}:${app.newSession ? 'new' : ''}`;
	const offscreen = (el: Element) => {
		const r = el.getBoundingClientRect();
		return r.bottom < 80 || r.top > innerHeight - 80;
	};
	// svelte-ignore state_referenced_locally
	let last = key();
	$effect(() => {
		const now = key();
		const el = document.getElementById(target);
		if (now !== last && el && actedInScene(1500) && offscreen(el)) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
		last = now;
	});
</script>
