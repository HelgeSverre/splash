<script lang="ts">
	import PageHeader from '#lib/components/PageHeader.svelte';
	import Details from '#lib/components/Details.svelte';
	import FeatureNav from '#lib/components/FeatureNav.svelte';
	import Feature from '#lib/components/Feature.svelte';
	import AppWindow from '#lib/components/AppWindow.svelte';
	import Live from '#lib/components/Live.svelte';
	import Screenshot from '#lib/components/Screenshot.svelte';
	import { SHOTS } from '#lib/shots.ts';
</script>

<PageHeader slug="review" title="Review the work, not the scrollback.">
	<p>When an agent says it's done, you don't want 300 lines of transcript. You want <strong>the diff, anything that failed, and the final answer</strong>, next to each other, with a box to tell the agent what to fix.</p>
</PageHeader>

<section class="wrap">
	<AppWindow title="Fix project cache isolation · Splash" height={640}>
		<Live load={() => import('#lib/scenes/Review.svelte')} />
	</AppWindow>
</section>

<Details
	heading="What the Review panel shows"
	points={[
		{ title: 'The latest response', text: 'The agent’s final message from the last turn, rendered as Markdown, without the tool calls in between.' },
		{ title: 'Failures, up front', text: 'Failed tool calls and agent errors from the turn are listed, so a red test run can’t hide in the scroll.' },
		{ title: 'Every changed file', text: 'The folder’s git changes against <code>HEAD</code>. <strong>Review all changes</strong> opens each one as a diff tab, unified or split.' },
		{ title: 'The pull request', text: 'When the branch has a pull request on GitHub, it’s linked right there.' },
		{ title: 'Feedback in the same thread', text: '<strong>Send feedback</strong> continues the same conversation; <strong>Ask agent to review</strong> has the agent check its own work first.' },
		{ title: 'Mark reviewed', text: 'Clears the item from Needs attention once you’ve looked.' }
	]}
/>

<Feature eyebrow="Second opinions" title="Fork it for review.">
	<p>When the agent supports it, <strong>Fork for review</strong> creates a separate conversation from the agent's current context and prepares a review message for you to send. The original conversation stays as it was.</p>
	<ul>
		<li><strong>Try another approach</strong> forks without the review draft.</li>
		<li>Forks share the workspace folders with their parent, so file changes are shared too.</li>
	</ul>
	{#snippet media()}<Screenshot shot={SHOTS.sessionFork} />{/snippet}
</Feature>

<FeatureNav slug="review" />
