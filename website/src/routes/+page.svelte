<script lang="ts">
	import Hero from '#lib/components/Hero.svelte';
	import Feature from '#lib/components/Feature.svelte';
	import AgentRoster from '#lib/components/AgentRoster.svelte';
	import AppWindow from '#lib/components/AppWindow.svelte';
	import Live from '#lib/components/Live.svelte';
	import WorktreeDiagram from '#lib/components/WorktreeDiagram.svelte';
	import SshDiagram from '#lib/components/SshDiagram.svelte';
	import CodeBlock from '#lib/components/CodeBlock.svelte';
	import AcpTrace from '#lib/components/AcpTrace.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { ACP_URL, SITE_NAME, SITE_URL } from '#lib/site.ts';
	import { VERSION } from '#lib/releases.ts';

	const description =
		'A desktop app for running Claude Code, Codex, Gemini and other ACP coding agents side by side: a worktree per agent, one queue for what needs you.';

	// Structured data for search engines: the site, and the app it offers.
	const ld = {
		'@context': 'https://schema.org',
		'@graph': [
			{ '@type': 'WebSite', name: SITE_NAME, url: `${SITE_URL}/` },
			{
				'@type': 'SoftwareApplication',
				name: SITE_NAME,
				description,
				url: `${SITE_URL}/`,
				downloadUrl: `${SITE_URL}/download`,
				image: `${SITE_URL}/og/home.png`,
				applicationCategory: 'DeveloperApplication',
				operatingSystem: 'macOS 14+, Windows 11, Ubuntu 24.04',
				softwareVersion: VERSION,
				license: 'https://opensource.org/licenses/MIT',
				isAccessibleForFree: true,
				offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
				author: { '@type': 'Person', name: 'Helge Sverre', url: 'https://helgesver.re' }
			}
		]
	};
	// `<` is escaped so the JSON can never close the script element early.
	const jsonLd = `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}<\/script>`;

	const principles = [
		{ title: 'No accounts', text: 'Splash never installs agents or signs in to them. Each CLI keeps its own login, on your machine.' },
		{ title: 'No file access for agents', text: 'Splash offers agents no file-system or terminal capabilities. Agents edit files themselves; Splash follows the results through git and a file watcher.' },
		{ title: 'No private formats', text: 'History comes from ACP’s session/list and session/load. Splash does not parse vendor history files or attach to another running process.' },
		{ title: 'No surprise replays', text: 'After a disconnect, commands are never resent automatically. Your unsent draft waits in the composer.' }
	];
</script>

<Seo title="Splash · Run coding agents side by side" {description} card="home" />
<svelte:head>{@html jsonLd}</svelte:head>

<Hero />

<section class="wrap roster">
	<p class="eyebrow">Works with the agents you already use, over the <a class="prose-link" href={ACP_URL}>Agent Client Protocol</a></p>
	<AgentRoster />
	<a class="all" href="/features/agents">Every supported agent and how Splash launches it <span aria-hidden="true">→</span></a>
</section>

<Feature n="01" eyebrow="Sessions & worktrees" title="Every agent gets its own checkout." href="/features/sessions" more="sessions and worktrees">
	<p>Two agents editing the same files is how you lose an afternoon. Start a session in the project folder, or in a <strong>git worktree on its own <code class="inline-code">splash/…</code> branch</strong>, and let them work in parallel.</p>
	<ul>
		<li>Archive a session and its worktree goes; the branch stays.</li>
		<li>Uncommitted changes always ask before they are discarded.</li>
		<li>Cached conversations reopen without starting the agent.</li>
	</ul>
	{#snippet media()}<WorktreeDiagram />{/snippet}
</Feature>

<Feature n="02" eyebrow="Needs attention" title="Stop checking every tab." href="/features/attention" more="the attention queue">
	<p>With four agents running, one is always waiting on you. Permission prompts, crashed agents and finished turns land in <strong>one queue</strong>, and stay there across restarts until you deal with them.</p>
	<ul>
		<li>Answer a permission with <span class="kbd">1</span> to <span class="kbd">9</span>.</li>
		<li>Reconnect or recheck a crashed agent without leaving the queue.</li>
		<li>Try it: <strong>Answer permission</strong> opens that session in the window above.</li>
	</ul>
	{#snippet media()}
		<AppWindow title="Needs attention · Splash" width={860} height={600}>
			<Live load={() => import('#lib/scenes/Attention.svelte')} />
		</AppWindow>
	{/snippet}
</Feature>

<Feature n="03" eyebrow="Review" title="Review the work, not the scrollback." href="/features/review" more="reviewing agent work" stacked>
	<p>When an agent says it is done, you want the diff, anything that failed and the final answer. The Review panel puts them next to each other, and <strong>feedback goes straight back</strong> into the same conversation.</p>
	{#snippet media()}
		<AppWindow title="Fix project cache isolation · Splash" height={580}>
			<Live load={() => import('#lib/scenes/Review.svelte')} />
		</AppWindow>
	{/snippet}
</Feature>

<Feature n="04" eyebrow="Agent history" title="Pick up conversations from anywhere." href="/features/history" more="agent history">
	<p>You started that fix in Claude Code's terminal last week. Splash asks every installed agent for its sessions over ACP, previews them <strong>without sending a prompt</strong>, and continues them here.</p>
	<ul>
		<li>Search every saved transcript, archived ones included.</li>
		<li>Refresh a conversation you continued somewhere else.</li>
		<li>Fork a conversation to try another approach.</li>
	</ul>
	{#snippet media()}
		<AppWindow title="Sessions · Splash" width={1000} height={620}>
			<Live load={() => import('#lib/scenes/Library.svelte')} />
		</AppWindow>
	{/snippet}
</Feature>

<Feature n="05" eyebrow="GitHub & Actions" title="From issue to worktree in one click." href="/features/github" more="GitHub and Actions" stacked>
	<p>Triage issues, pull requests and failing runs across every repository your GitHub CLI login can see. <strong>Work on this</strong> opens a session with the issue in the composer, or a fresh worktree from a PR's head, without switching your checkout.</p>
	{#snippet media()}
		<AppWindow title="GitHub · Splash" height={680}>
			<Live load={() => import('#lib/scenes/Github.svelte')} />
		</AppWindow>
	{/snippet}
</Feature>

<Feature n="06" eyebrow="Splash over SSH" title="Agents on your workstation. Splash in any browser." href="/features/server" more="running Splash over SSH" stacked>
	<p>Run <code class="inline-code">splash-server</code> where your repositories and agent logins live, and open it through an SSH tunnel. Close the laptop; the agents keep working, and the browser catches up when you reconnect.</p>
	{#snippet media()}
		<div class="stack">
			<SshDiagram />
			<CodeBlock label="From your laptop" code={'ssh -N -L 127.0.0.1:4780:127.0.0.1:4780 devbox'} />
		</div>
	{/snippet}
</Feature>

<section class="wrap hood">
	<div class="copy">
		<p class="eyebrow"><span class="n">Under the hood</span></p>
		<h2 class="h2">An open protocol, not a screen scraper.</h2>
		<p class="lede">Splash starts each agent as a child process and speaks <a class="prose-link" href={ACP_URL}>ACP</a>, JSON-RPC over stdio, the protocol editors use for coding agents. What you see in the transcript is what the agent sent. Every session's traffic is one tab away in the Log.</p>
		<p class="small">This is a real recording from the repository's test fixtures, replayed. Click a row for the full message.</p>
	</div>
	<AcpTrace />
</section>

<section class="wrap principles">
	<h2 class="h2">What Splash leaves alone.</h2>
	<div class="grid">
		{#each principles as p (p.title)}
			<div class="principle">
				<h3 class="h3">{p.title}</h3>
				<p>{p.text}</p>
			</div>
		{/each}
	</div>
</section>

<style>
	.roster {
		margin-top: 120px;
		display: flex;
		flex-direction: column;
		gap: 22px;
	}
	.all {
		align-self: flex-start;
		color: var(--text-2);
		font-size: 14px;
		text-decoration: none;
	}
	.all:is(:hover, :focus-visible) {
		color: var(--text);
	}
	.stack {
		display: grid;
		gap: 16px;
	}
	.hood {
		display: grid;
		grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.4fr);
		gap: 56px;
		align-items: center;
		margin-top: 180px;
	}
	.hood .h2 {
		margin: 16px 0 20px;
	}
	.small {
		margin-top: 18px;
		color: var(--muted);
		font-size: 14px;
	}
	.principles {
		margin-top: 180px;
	}
	.principles .grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1px;
		margin-top: 40px;
		background: var(--border);
		border: 1px solid var(--border);
		border-radius: 12px;
		overflow: hidden;
	}
	.principle {
		padding: 24px;
		background: var(--bg);
	}
	.principle p {
		margin: 10px 0 0;
		font-size: 15px;
	}
	@media (max-width: 960px) {
		.hood {
			grid-template-columns: 1fr;
		}
		.principles .grid {
			grid-template-columns: 1fr 1fr;
		}
	}
	@media (max-width: 560px) {
		.principles .grid {
			grid-template-columns: 1fr;
		}
	}
</style>
