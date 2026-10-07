<script lang="ts">
	// The desktop app's workbench (App.svelte's layout) with its real Sidebar,
	// views and side panel, running on the demo backend.
	import { onMount } from 'svelte';
	import Sidebar from '$splash/components/Sidebar.svelte';
	import SessionView from '$splash/components/SessionView.svelte';
	import RightPanel from '$splash/components/RightPanel.svelte';
	import Splitter from '$splash/components/Splitter.svelte';
	import SessionLibrary from '$splash/components/SessionLibrary.svelte';
	import AttentionInbox from '$splash/components/AttentionInbox.svelte';
	import GithubView from '$splash/components/github/GithubView.svelte';
	import ActionsView from '$splash/components/github/ActionsView.svelte';
	import NewSession from '$splash/components/NewSession.svelte';
	import Settings from '$splash/components/settings/Settings.svelte';
	import Welcome from '$splash/components/Welcome.svelte';
	import IssueComposer from '$splash/components/github/IssueComposer.svelte';
	import { github } from '$splash/lib/github.svelte';
	import { app, currentSession, openSession } from '$splash/lib/sessions.svelte';
	import { layout, clamp } from '$splash/lib/layout.svelte';
	import { playHero } from '../demo/backend';
	import { HERO } from '../demo/world';

	type View = 'library' | 'attention' | 'github' | 'actions';
	// Open on `view` when given, otherwise on the session `start`.
	let { start = HERO, play = true, view }: { start?: string; play?: boolean; view?: View } = $props();

	const session = $derived(currentSession());
	let root: HTMLDivElement;

	onMount(() => {
		// A phone-width window shows the conversation alone, as the app does
		// with both panels closed.
		const narrow = root.clientWidth < 760;
		Object.assign(layout, { leftOpen: !narrow, rightOpen: !narrow });
		if (view) app.view = { kind: view };
		else openSession(start);
		if (play && !view && start === HERO) playHero();
	});
</script>

<div class="workbench" bind:this={root} style:grid-template-columns={layout.leftOpen ? `${layout.left}px 1px minmax(0, 1fr)` : 'minmax(0, 1fr)'}>
	{#if layout.leftOpen}
		<div class="left"><Sidebar /></div>
		<Splitter axis="x" label="Resize sidebar" value={layout.left} min={200} max={420} onmove={(d) => (layout.left = clamp(layout.left + d, 200, 420))} />
	{/if}
	<main>
		<div class="top">
			<div class="center">
				{#if app.view.kind === 'library'}
					<SessionLibrary />
				{:else if app.view.kind === 'attention'}
					<AttentionInbox />
				{:else if app.view.kind === 'actions'}
					<ActionsView />
				{:else if app.view.kind === 'github'}
					<GithubView />
				{:else if app.view.kind === 'session' && session}
					{#key session.id}<SessionView {session} />{/key}
				{:else}
					<Welcome />
				{/if}
			</div>
			{#if session && app.view.kind === 'session' && layout.rightOpen}
				<Splitter axis="x" label="Resize side panel" value={layout.right} min={220} max={720} onmove={(d) => (layout.right = clamp(layout.right - d, 220, 720))} />
				<div class="right" style:width="{layout.right}px"><RightPanel {session} /></div>
			{/if}
		</div>
	</main>
</div>

{#if app.newSession}<NewSession />{/if}
{#if app.settings}<Settings />{/if}
{#if github.issueOpen && (app.view.kind === 'github' || app.view.kind === 'actions')}<IssueComposer />{/if}

<style>
	.workbench {
		height: 100%;
		display: grid;
	}
	.left {
		min-width: 0;
		min-height: 0;
	}
	main {
		min-width: 0;
		min-height: 0;
		display: flex;
		flex-direction: column;
		background: var(--bg);
	}
	.top {
		flex: 1;
		min-height: 0;
		display: flex;
	}
	.center {
		flex: 1;
		min-width: 0;
		min-height: 0;
	}
	.right {
		flex: none;
		min-width: 0;
		min-height: 0;
	}
</style>
