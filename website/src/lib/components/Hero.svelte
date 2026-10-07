<script lang="ts">
	import { onMount } from 'svelte';
	import Live from './Live.svelte';
	import AppWindow from './AppWindow.svelte';
	import DownloadButton from './DownloadButton.svelte';
	import GithubMark from './GithubMark.svelte';
	import { latest } from '../latest.svelte.ts';
	import { REPO } from '../site';

	type Phase = 'idle' | 'running' | 'permission' | 'done';
	let phase: Phase = $state('idle');
	let replay: (() => void) | undefined = $state();

	onMount(() => {
		let off = () => {};
		import('../demo/backend').then(({ heroListeners, playHero }) => {
			const listen = (p: Exclude<Phase, 'idle'>) => (phase = p);
			heroListeners.add(listen);
			off = () => heroListeners.delete(listen);
			replay = playHero;
		});
		return () => off();
	});

	const steps: { phase: Phase; n: string; text: string }[] = [
		{ phase: 'running', n: '1', text: 'Claude Code works in its own worktree on splash/upload-retry.' },
		{ phase: 'permission', n: '2', text: 'It wants to push. Press 1 to allow, or click an option.' },
		{ phase: 'done', n: '3', text: 'Done: the Review tab shows the response and the diff.' }
	];
</script>

<section class="hero">
	<div class="glow" aria-hidden="true"></div>
	<div class="wrap">
		<a class="pill" href="/download#changelog">
			<span class="dot"></span>
			<span>v{latest.version}</span>
			<span class="sep">·</span>
			<span>macOS, Windows, Linux</span>
			<span class="sep">·</span>
			<span>open source</span>
			<span class="arrow" aria-hidden="true">→</span>
		</a>
		<h1 class="display">Run every coding agent<br /><span class="accent">side by side.</span></h1>
		<div class="intro">
			<p class="lede">
				Claude Code in one terminal, Codex in another, and a permission prompt you haven't seen for ten minutes. Splash gives each agent its own session and worktree, streams everything it does, and keeps whatever needs you in one queue.
			</p>
			<div class="actions">
				<div class="buttons">
					<DownloadButton />
					<a class="cta" href={REPO}><GithubMark size={16} /> Source</a>
				</div>
				<p class="req">macOS 14+ · Windows 11 · Ubuntu 24.04 · <a href="/download">all downloads</a><br />or run it headless on a server, over SSH</p>
			</div>
		</div>

		<div class="demo" id="demo">
			<AppWindow title="atlas · Splash">
				<Live load={() => import('../scenes/Workbench.svelte')}>
					{#snippet fallback()}
						<div class="loading"><span class="spinner"></span></div>
					{/snippet}
				</Live>
			</AppWindow>
			<ol class="steps" aria-label="What the demo shows">
				{#each steps as s (s.n)}
					<li class:on={phase === s.phase}><span class="n">{s.n}</span>{s.text}</li>
				{/each}
			</ol>
			<p class="note">
				This is Splash's real interface running in your browser on demo data: click sessions, open the Changes tab, type a message.
				{#if replay && phase === 'done'}<button class="replay" onclick={replay}>Replay the task</button>{/if}
			</p>
		</div>
	</div>
</section>

<style>
	.hero {
		position: relative;
		padding: 72px 0 0;
	}
	.glow {
		position: absolute;
		inset: -60px 0 auto;
		height: 900px;
		background: var(--site-glow);
		pointer-events: none;
	}
	.pill {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		height: 30px;
		padding: 0 12px;
		margin-bottom: 28px;
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-pill);
		background: var(--surface);
		color: var(--text-2);
		font: var(--fw-medium) 12.5px var(--font-mono);
		text-decoration: none;
	}
	.pill:is(:hover, :focus-visible) {
		border-color: var(--accent-border);
		color: var(--text);
	}
	.pill .dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 0 3px var(--accent-soft);
	}
	.sep,
	.arrow {
		color: var(--muted);
	}
	.display {
		position: relative;
	}
	.intro {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
		gap: 48px;
		align-items: end;
		margin-top: 32px;
	}
	.lede {
		max-width: 56ch;
	}
	.actions {
		display: flex;
		flex-direction: column;
		gap: 14px;
		align-items: flex-end;
	}
	.buttons {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
		justify-content: flex-end;
	}
	.req {
		margin: 0;
		color: var(--muted);
		font-size: 13px;
		text-align: right;
	}
	.req a {
		color: var(--text-2);
	}
	.req a:is(:hover, :focus-visible) {
		color: var(--text);
	}
	.demo {
		position: relative;
		margin-top: 64px;
	}
	.loading {
		height: 100%;
		display: grid;
		place-items: center;
	}
	.steps {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
		margin: 20px 0 0;
		padding: 0;
		list-style: none;
	}
	.steps li {
		display: flex;
		gap: 10px;
		align-items: baseline;
		padding: 12px 14px;
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		color: var(--muted);
		font-size: 14px;
		line-height: 1.45;
		transition: color 0.3s, border-color 0.3s, background 0.3s;
	}
	.steps li.on {
		color: var(--text);
		border-color: var(--accent-border);
		background: var(--accent-soft);
	}
	.n {
		flex: none;
		display: inline-grid;
		place-items: center;
		width: 20px;
		height: 20px;
		border-radius: var(--radius-sm);
		border: 1px solid var(--border-strong);
		font: var(--fw-medium) 11px var(--font-mono);
		color: var(--text-2);
	}
	.on .n {
		border-color: var(--accent);
		color: var(--accent);
	}
	.note {
		margin: 16px 0 0;
		color: var(--muted);
		font-size: 13px;
		text-align: center;
	}
	.replay {
		margin-left: 6px;
		padding: 0;
		border: 0;
		background: none;
		color: var(--accent);
		font: inherit;
		cursor: pointer;
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	@media (max-width: 860px) {
		.intro {
			grid-template-columns: 1fr;
			gap: 28px;
		}
		.actions {
			align-items: flex-start;
		}
		.buttons {
			justify-content: flex-start;
		}
		.req {
			text-align: left;
		}
		.steps {
			grid-template-columns: 1fr;
		}
	}
</style>
