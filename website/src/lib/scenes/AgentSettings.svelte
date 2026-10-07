<script lang="ts">
	// The app's real Settings, opened on the agent overview.
	import { onMount } from 'svelte';
	import Settings from '$splash/components/settings/Settings.svelte';
	import { app } from '$splash/lib/sessions.svelte';
	import { openSettings } from '$splash/lib/customize.svelte';

	let { page = 'agents' }: { page?: string } = $props();
	onMount(() => openSettings(page));
</script>

{#if app.settings}
	<Settings />
{:else}
	<div class="closed"><button class="btn" onclick={() => openSettings(page)}>Open Settings</button></div>
{/if}

<style>
	.closed {
		height: 100%;
		display: grid;
		place-items: center;
	}
</style>
