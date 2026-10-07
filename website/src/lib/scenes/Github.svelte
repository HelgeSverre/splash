<script lang="ts">
	// The desktop app's GitHub triage view (issues, PRs, branches and activity
	// across repositories) on the demo account. It loads its own catalog.
	import GithubView from '$splash/components/github/GithubView.svelte';
	import IssueComposer from '$splash/components/github/IssueComposer.svelte';
	import { github } from '$splash/lib/github.svelte';
	import { app } from '$splash/lib/sessions.svelte';
	import FollowWorkbench from './FollowWorkbench.svelte';
</script>

<div class="scene"><GithubView /></div>
<!-- A workbench showing GitHub or Actions draws the composer itself. -->
{#if github.issueOpen && app.view.kind !== 'github' && app.view.kind !== 'actions'}<IssueComposer />{/if}
<FollowWorkbench />

<style>
	.scene {
		height: 100%;
		min-height: 0;
		background: var(--bg);
	}
</style>
