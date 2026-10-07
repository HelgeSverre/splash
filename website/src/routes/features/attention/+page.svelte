<script lang="ts">
	import PageHeader from '#lib/components/PageHeader.svelte';
	import Feature from '#lib/components/Feature.svelte';
	import Details from '#lib/components/Details.svelte';
	import FeatureNav from '#lib/components/FeatureNav.svelte';
	import AppWindow from '#lib/components/AppWindow.svelte';
	import Live from '#lib/components/Live.svelte';
</script>

<PageHeader slug="attention">
	<p>With four agents running, one is always waiting on you, and it's never the one on screen. <strong>Needs attention</strong> collects every permission prompt, crashed agent and finished turn in one queue that survives restarts, until you deal with it.</p>
</PageHeader>

<section class="wrap">
	<AppWindow title="Needs attention · Splash" width={1000} height={660}>
		<Live load={() => import('#lib/scenes/Attention.svelte')} props={{ target: 'workbench' }} />
	</AppWindow>
</section>

<Details
	heading="Three kinds of waiting"
	points={[
		{ title: 'Waiting for permission', text: 'An agent asked to run a command or edit a file. Open the conversation and answer with <strong>1</strong> to <strong>9</strong>, or click an option.' },
		{ title: 'Needs recovery', text: 'The agent process exited or failed to connect. <strong>Reconnect agent</strong> continues the same conversation; <strong>Recheck agent</strong> runs a connection test that sends no prompt.' },
		{ title: 'Ready to review', text: 'A turn finished. <strong>Review response & changes</strong> opens the Review panel; <strong>Mark reviewed</strong> clears it when you are done.' }
	]}
/>

<Feature eyebrow="Try it" title="Answer the one that's waiting." stacked>
	<p>Press <strong>Answer permission</strong> above: the session opens here, and the pending request sits at the bottom of the transcript. Press <span class="kbd">1</span> to allow it.</p>
	{#snippet media()}
		<div id="workbench">
			<AppWindow title="atlas · Splash">
				<Live load={() => import('#lib/scenes/Workbench.svelte')} props={{ start: 'cache-migration', play: false }} />
			</AppWindow>
		</div>
	{/snippet}
</Feature>

<Details
	points={[
		{ title: 'Flags for work out of sight', text: 'Sessions you are not looking at get an unread mark when they need permission, finish a turn or fail.' },
		{ title: 'Desktop notifications', text: 'Splash notifies you when a background session needs permission or finishes, and you can turn notifications off in Settings.' },
		{ title: 'Persistent by design', text: 'Attention items live in Splash’s SQLite database, so quitting the app doesn’t lose track of what was waiting.' }
	]}
/>

<FeatureNav slug="attention" />
