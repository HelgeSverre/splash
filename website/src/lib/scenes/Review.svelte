<script lang="ts">
	// A finished session's review: the real diff tab beside the real Review
	// panel, for the cache isolation fix.
	import { onMount } from 'svelte';
	import DiffTab from '$splash/components/DiffTab.svelte';
	import ReviewPanel from '$splash/components/ReviewPanel.svelte';
	import Tabs from '$splash/components/ui/Tabs.svelte';
	import { app } from '$splash/lib/sessions.svelte';
	import { openTranscript } from '$splash/lib/transcripts.svelte';
	import { ensureWorkspace, refreshStatus, workspace } from '$splash/lib/workspace.svelte';

	let { id = 'cache-isolation' }: { id?: string } = $props();

	// svelte-ignore state_referenced_locally
	const sessionId = id;
	const session = $derived(app.sessions.find((s) => s.id === sessionId));
	const files = $derived(workspace(sessionId).changes);
	let active = $state('0');

	onMount(() => {
		ensureWorkspace(sessionId);
		refreshStatus(sessionId);
		openTranscript(sessionId);
	});
</script>

{#if session}
	<div class="review">
		<div class="diff">
			<Tabs items={files.map((f, i) => ({ id: String(i), label: f.path.split('/').pop() ?? f.path, prefix: '±' }))} {active} prefix="review-scene" label="Changed files" onselect={(i) => (active = i)} />
			<div class="pane">
				{#if files[Number(active)]}
					{#key files[Number(active)].path}<DiffTab {session} path={files[Number(active)].path} />{/key}
				{/if}
			</div>
		</div>
		<div class="panel"><ReviewPanel {session} /></div>
	</div>
{/if}

<style>
	.review {
		height: 100%;
		display: grid;
		grid-template-columns: minmax(0, 1fr) 360px;
	}
	.diff {
		min-width: 0;
		min-height: 0;
		display: flex;
		flex-direction: column;
	}
	.pane {
		flex: 1;
		min-height: 0;
	}
	.panel {
		min-width: 0;
		min-height: 0;
		overflow: auto;
		border-left: 1px solid var(--border);
		background: var(--bg);
	}
	@media (max-width: 760px) {
		.review {
			grid-template-columns: 1fr;
		}
		.diff {
			display: none;
		}
	}
</style>
