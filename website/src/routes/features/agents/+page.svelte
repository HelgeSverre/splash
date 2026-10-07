<script lang="ts">
	import PageHeader from '#lib/components/PageHeader.svelte';
	import Details from '#lib/components/Details.svelte';
	import FeatureNav from '#lib/components/FeatureNav.svelte';
	import Feature from '#lib/components/Feature.svelte';
	import AgentRoster from '#lib/components/AgentRoster.svelte';
	import AppWindow from '#lib/components/AppWindow.svelte';
	import Live from '#lib/components/Live.svelte';
	import { ACP_URL } from '#lib/site.ts';
</script>

<PageHeader slug="agents" title="Bring the agent you already use.">
	<p>Splash speaks the <a class="prose-link" href={ACP_URL}>Agent Client Protocol</a>, the JSON-RPC protocol editors use to talk to coding agents. <strong>Splash never installs them or signs in for you</strong>: install and authenticate each CLI yourself, and Splash finds it.</p>
</PageHeader>

<section class="wrap">
	<AgentRoster detailed />
	<p class="caption">Launch commands and pinned adapter versions come from <code>src/agents/registry.rs</code>. The <code>npx</code> entries are adapters around the vendor's CLI; the rest are the CLIs' own ACP modes.</p>
</section>

<Feature eyebrow="Check before you trust" title="A connection test that sends no prompt." stacked>
	<p>Each agent's settings page shows whether it's installed, its version, and whether a real <strong>ACP handshake</strong> succeeded on this machine. Detecting a CLI on your PATH alone is not proof that it works.</p>
	<ul>
		<li>Add extra launch arguments per agent.</li>
		<li>Read each agent's skills, commands and MCP servers.</li>
		<li>Sign-in state is detected for Claude Code, Codex, Glue and Pool; for the others, the connection test shows it.</li>
	</ul>
	{#snippet media()}
		<AppWindow title="Settings · Splash" height={640}>
			<Live load={() => import('#lib/scenes/AgentSettings.svelte')} />
		</AppWindow>
	{/snippet}
</Feature>

<Details
	heading="How agents run"
	points={[
		{ title: 'A child process per session', text: 'Splash runs the launch command in the session folder, in its own process group, with your login shell’s <code>PATH</code>. Stdin and stdout carry ACP.' },
		{ title: 'Native PATH lookup everywhere', text: 'Windows uses PATH and PATHEXT, including npm <code>.cmd</code> launchers. Arguments are passed separately, never through a shell string.' },
		{ title: 'Cleaned up on quit', text: 'Quitting Splash ends every agent and shell process group, including on SIGTERM, SIGINT and SIGHUP, though not after a crash or SIGKILL. Windows uses kill-on-close Job Objects.' },
		{ title: 'Capabilities vary', text: 'Agents report different things: models, modes, commands, usage. Splash shows a control only when the agent offers it.' }
	]}
/>

<FeatureNav slug="agents" />

<style>
	.caption {
		margin-top: 16px;
		color: var(--muted);
		font-size: 14px;
	}
	.caption code {
		font: 13px var(--font-mono);
		color: var(--text-2);
	}
</style>
