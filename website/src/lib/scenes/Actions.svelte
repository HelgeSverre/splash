<script lang="ts">
	// The desktop app's Actions view: workflow runs across the demo account's
	// repositories, with jobs, steps and searchable logs. It loads its own catalog.
	import ActionsView from '$splash/components/github/ActionsView.svelte';
	import FollowWorkbench from './FollowWorkbench.svelte';
</script>

<div class="scene"><ActionsView /></div>
<FollowWorkbench />

<style>
	.scene {
		height: 100%;
		min-height: 0;
		background: var(--bg);
	}
</style>
