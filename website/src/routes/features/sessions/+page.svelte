<script lang="ts">
	import PageHeader from '#lib/components/PageHeader.svelte';
	import Feature from '#lib/components/Feature.svelte';
	import Details from '#lib/components/Details.svelte';
	import FeatureNav from '#lib/components/FeatureNav.svelte';
	import AppWindow from '#lib/components/AppWindow.svelte';
	import Live from '#lib/components/Live.svelte';
	import WorktreeDiagram from '#lib/components/WorktreeDiagram.svelte';
	import Screenshot from '#lib/components/Screenshot.svelte';
	import { SHOTS } from '#lib/shots.ts';
</script>

<PageHeader slug="sessions">
	<p>Two agents editing the same files is how you lose an afternoon. A Splash session is <strong>one agent working in one folder</strong>: the project itself, or a git worktree on its own <code class="inline-code">splash/…</code> branch. Run as many as you like, side by side.</p>
</PageHeader>

<section class="wrap">
	<AppWindow title="atlas · Splash">
		<Live load={() => import('#lib/scenes/Workbench.svelte')} />
	</AppWindow>
</section>

<Feature eyebrow="Isolation" title="In place, or in a worktree.">
	<p>In a git repository, choose <strong>Worktree</strong> and Splash makes a second checkout on a fresh <code class="inline-code">splash/…</code> branch, so the agent can't trip over your work or another agent's.</p>
	<ul>
		<li>Archiving or deleting the session removes the worktree and keeps the branch.</li>
		<li>Uncommitted changes need an explicit discard confirmation first.</li>
		<li>Add extra workspace folders when an agent needs to see a sibling repository.</li>
	</ul>
	{#snippet media()}<WorktreeDiagram />{/snippet}
</Feature>

<Feature eyebrow="Transcript" title="Everything the agent does, readable." stacked>
	<p>Markdown with syntax highlighting, thinking you can collapse, tool calls with their status, output and diffs, plans as live checklists, and permission requests inline. This window shows one of every entry, from the app's own component playground.</p>
	{#snippet media()}
		<AppWindow title="Add an excited flag to greet() · Splash" width={980} height={720}>
			<Live load={() => import('#lib/scenes/Transcript.svelte')} />
		</AppWindow>
	{/snippet}
</Feature>

<Details
	heading="The rest of the workbench"
	points={[
		{ title: 'The agent’s own controls', text: 'Model, mode and effort pickers appear when the agent offers them. Slash commands complete as you type. Context and cost readouts show when the agent reports usage.' },
		{ title: 'Changes, files, details', text: 'The side panel lists the session’s git changes, a file tree and session details. Diffs and files open as tabs next to the chat.' },
		{ title: 'A terminal where the agent works', text: 'Press <strong>⌘J</strong> for a shell in the session folder: your login shell on macOS and Linux, PowerShell on Windows.' },
		{ title: 'Resume without replay', text: 'Saved conversations open without starting the agent. Continue, and Splash reconnects with <code>session/resume</code> or <code>session/load</code> when the agent supports them.' },
		{ title: 'A failed reconnect loses nothing', text: 'The original session ID and history stay put, and your unsent draft is still in the composer to try again.' },
		{ title: 'The wire, one tab away', text: 'Each session’s Log tab shows its JSON-RPC traffic for the current run, for when you need to know exactly what the agent said.' }
	]}
/>

<section class="wrap shots">
	<Screenshot shot={SHOTS.newSessionFolders} />
	<Screenshot shot={SHOTS.terminal} />
</section>

<FeatureNav slug="sessions" />

<style>
	.shots {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
		margin-top: 80px;
	}
	@media (max-width: 760px) {
		.shots {
			grid-template-columns: 1fr;
		}
	}
</style>
