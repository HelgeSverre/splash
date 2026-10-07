<script lang="ts">
	import PageHeader from '#lib/components/PageHeader.svelte';
	import Details from '#lib/components/Details.svelte';
	import FeatureNav from '#lib/components/FeatureNav.svelte';
	import SshDiagram from '#lib/components/SshDiagram.svelte';
	import CodeBlock from '#lib/components/CodeBlock.svelte';
	import Screenshot from '#lib/components/Screenshot.svelte';
	import { SHOTS } from '#lib/shots.ts';
	import { REPO } from '#lib/site.ts';
</script>

<PageHeader slug="server">
	<p>Run <code class="inline-code">splash-server</code> on the machine that has your repositories and agent logins, then open it through an SSH tunnel. Files, git, terminals and agents stay together on that machine. <strong>Close the laptop; the agents keep working.</strong></p>
</PageHeader>

<section class="wrap">
	<SshDiagram />
</section>

<section class="wrap steps">
	<div class="step">
		<span class="n">1</span>
		<h2 class="h3">Start the server where the code lives</h2>
		<p>No window or display needed. Install and sign in to your agents on the same machine.</p>
		<CodeBlock label="On the workstation" code={'splash-server --name devbox ~/code/my-project'} />
	</div>
	<div class="step">
		<span class="n">2</span>
		<h2 class="h3">Tunnel to it from your laptop</h2>
		<p>The server listens on loopback only. SSH carries the browser connection.</p>
		<CodeBlock label="On your laptop" code={'ssh -N -o ExitOnForwardFailure=yes -o ServerAliveInterval=30 \\\n  -L 127.0.0.1:4780:127.0.0.1:4780 devbox'} />
	</div>
	<div class="step">
		<span class="n">3</span>
		<h2 class="h3">Sign in with the token</h2>
		<p>Open <code class="inline-code">http://127.0.0.1:4780</code> and paste the token from the server's <code class="inline-code">server.token</code>. Startup prints where the file is, never what's in it.</p>
		<Screenshot shot={SHOTS.serverLogin} />
	</div>
</section>

<Details
	heading="Built for flaky connections"
	points={[
		{ title: 'Reconnects without surprises', text: 'When the tunnel returns, Splash refreshes sessions, the open transcript, permissions, files and terminal views.' },
		{ title: 'Drafts stay put', text: 'Unsent text stays in the open tab and sending is disabled while offline. Commands are never replayed automatically, because a failed response doesn’t prove the server missed them.' },
		{ title: 'Loopback and a token', text: 'The server binds to loopback and requires a token. Login uses an HttpOnly, SameSite cookie; foreign origins and non-loopback Host headers are rejected.' },
		{ title: 'Keep it running', text: 'A systemd user service ships in <code>packaging/server/</code>, with a launchd example for macOS. Several hosts can use different local tunnel ports.' }
	]}
/>

<section class="wrap shots">
	<Screenshot shot={SHOTS.serverOffline} />
	<Screenshot shot={SHOTS.serverFolders} />
</section>

<section class="wrap service">
	<CodeBlock label="Linux user service" code={'mkdir -p ~/.config/systemd/user\ncp packaging/server/splash.service ~/.config/systemd/user/\nsystemctl --user daemon-reload\nsystemctl --user enable --now splash'} />
	<p>Full setup, including the launchd example and rotating the token, is in the <a class="prose-link" href="{REPO}#run-as-a-web-app-over-ssh">README</a>.</p>
</section>

<FeatureNav slug="server" />

<style>
	.steps {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 32px;
		margin-top: 96px;
	}
	.step {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.step p {
		margin: 0;
		font-size: 15px;
	}
	.n {
		display: inline-grid;
		place-items: center;
		width: 28px;
		height: 28px;
		border: 1px solid var(--accent-border);
		border-radius: var(--radius);
		color: var(--accent);
		font: var(--fw-medium) 13px var(--font-mono);
	}
	.shots {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
		margin-top: 80px;
	}
	.service {
		margin-top: 80px;
		max-width: calc(var(--site-narrow) + 2 * var(--site-gutter));
	}
	.service p {
		margin-top: 16px;
		font-size: 15px;
	}
	@media (max-width: 900px) {
		.steps,
		.shots {
			grid-template-columns: 1fr;
		}
	}
</style>
