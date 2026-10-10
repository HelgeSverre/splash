<script lang="ts" module>
	export type Loader = () => Promise<{ default: Component<any> }>;
</script>

<script lang="ts">
	// A live scene: the desktop app's components, mounted in the browser only
	// (they expect a DOM and the demo backend). Until then, and without
	// JavaScript, the fallback shows (usually a real screenshot).
	import { onMount, type Component, type Snippet } from 'svelte';

	let { load, props = {}, fallback }: { load: Loader; props?: Record<string, unknown>; fallback?: Snippet } = $props();

	let Scene: Component<any> | null = $state(null);
	let failed = $state(false);

	onMount(async () => {
		try {
			const [{ boot }, scene] = await Promise.all([import('../demo/boot'), load()]);
			await boot();
			Scene = scene.default;
		} catch (e) {
			console.error(e);
			failed = true;
		}
	});
</script>

{#if Scene && !failed}
	<Scene {...props} />
{:else if fallback}
	{@render fallback()}
{:else}
	<div class="loading" role="status" aria-label="Loading the live demo"><span class="spinner"></span></div>
{/if}

<style>
	.loading {
		height: 100%;
		display: grid;
		place-items: center;
	}
</style>
