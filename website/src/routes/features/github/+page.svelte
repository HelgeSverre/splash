<script lang="ts">
	import PageHeader from '#lib/components/PageHeader.svelte';
	import Details from '#lib/components/Details.svelte';
	import FeatureNav from '#lib/components/FeatureNav.svelte';
	import Feature from '#lib/components/Feature.svelte';
	import Screenshot from '#lib/components/Screenshot.svelte';
	import AppWindow from '#lib/components/AppWindow.svelte';
	import Live from '#lib/components/Live.svelte';
	import { SHOTS } from '#lib/shots.ts';
</script>

<PageHeader slug="github" title="From issue to worktree in one click.">
	<p>Triage issues, pull requests, branches and failing runs across every repository your GitHub CLI login can see. When something needs doing, <strong>Work on this</strong> starts a session with the issue in the composer, or a fresh worktree from a pull request's head.</p>
</PageHeader>

<section class="wrap" id="demo">
	<AppWindow title="GitHub · Splash" height={720}>
		<Live load={() => import('#lib/scenes/Workbench.svelte')} props={{ view: 'github' }} />
	</AppWindow>
</section>

<Details
	heading="Triage"
	points={[
		{ title: 'Across owners and organizations', text: 'Pick a set of repositories across owners, or <strong>Linked to Splash</strong> for the ones you have locally. Git remotes link projects automatically.' },
		{ title: 'Needs me', text: 'Direct review requests, assignments, and your pull requests with failed checks or requested changes.' },
		{ title: 'An inbox that stays local', text: 'Unread tracking, mark read, and snooze until tomorrow at 9 AM or until new activity. None of it touches your GitHub notifications.' },
		{ title: 'Search beyond what’s loaded', text: '<strong>Search GitHub</strong> covers issues and pull requests with author, assignee, label and review filters, with pause, resume and saved searches.' },
		{ title: 'Saved views', text: 'Save the repository scope, owner, filters and search fields. Views and inbox state are scoped to your GitHub login.' },
		{ title: 'New issue, with preview', text: 'Create an issue in any repository you can access, in a Markdown editor with a preview. Nothing is submitted until you press <strong>Create issue</strong>.' }
	]}
/>

<Feature eyebrow="Work on this" title="The issue becomes the prompt.">
	<p>Splash opens session setup with the item's title, description and URL in the composer, for you to review before sending. For a pull request, choose a <strong>fresh worktree from the PR head</strong>, fork PRs included.</p>
	<ul>
		<li>Splash fetches a unique temporary ref and creates its own branch, without switching your current checkout.</li>
		<li>Existing sessions are labelled when their branch or source URL matches the item.</li>
	</ul>
	{#snippet media()}<Screenshot shot={SHOTS.issueEditor} />{/snippet}
</Feature>

<Feature eyebrow="Actions" title="Every run, every repository, one list." stacked>
	<p>Recent workflow runs across the selected repositories, newest first, with status, time, branch and event filters. Open a run for its jobs, step outcomes, runner, timings and matching Splash sessions, and <strong>search the log preview</strong> of a failed job right there.</p>
	{#snippet media()}
		<AppWindow title="Actions · Splash" height={680}>
			<Live load={() => import('#lib/scenes/Actions.svelte')} />
		</AppWindow>
	{/snippet}
</Feature>

<FeatureNav slug="github" />

