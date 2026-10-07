<script lang="ts">
	// The desktop app's session library: saved conversations in Splash, and
	// "Open from agent" to find and preview each agent's own saved sessions.
	import SessionLibrary from '$splash/components/SessionLibrary.svelte';
	import FollowWorkbench from './FollowWorkbench.svelte';
</script>

<div class="scene"><SessionLibrary /></div>
<FollowWorkbench />

<style>
	.scene {
		height: 100%;
		min-height: 0;
		background: var(--bg);
	}
</style>
