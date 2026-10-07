<script lang="ts">
	// Scenes share the app's state with the page's workbench window. When a
	// click inside a scene hands off to the workbench (opening a session,
	// starting a new one, switching views), bring that window into view.
	import { app } from '$splash/lib/sessions.svelte';

	let { target = 'demo' }: { target?: string } = $props();

	const key = () => `${app.view.kind}:${app.view.kind === 'session' ? app.view.id : ''}:${app.newSession ? 'new' : ''}`;
	// svelte-ignore state_referenced_locally
	let last = key();
	$effect(() => {
		const now = key();
		if (now !== last) document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
		last = now;
	});
</script>
