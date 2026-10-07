<script lang="ts">
	// One share card at 1200 × 630: the page's headline over its real app
	// window, in the site's own tokens. scripts/og.ts screenshots it.
	import SplashMark from '$splash/components/SplashMark.svelte';
	import icon from '$splash/../public/icon.svg';
	import AppWindow from '#lib/components/AppWindow.svelte';
	import Live, { type Loader } from '#lib/components/Live.svelte';
	import { SHOTS } from '#lib/shots.ts';
	import { SITE_URL } from '#lib/site.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const card = $derived(data.card);
	const visual = $derived(card.visual);

	const SCENES: Record<string, Loader> = {
		Workbench: () => import('#lib/scenes/Workbench.svelte'),
		Attention: () => import('#lib/scenes/Attention.svelte'),
		Review: () => import('#lib/scenes/Review.svelte'),
		AgentSettings: () => import('#lib/scenes/AgentSettings.svelte')
	};
	const PLATFORMS = ['macOS 14+', 'Windows 11', 'Ubuntu 24.04', 'Headless server'];
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="card">
	<div class="glow" aria-hidden="true"></div>
	<header class="top">
		<span class="brand"><SplashMark size={30} /><span>splash</span></span>
		<span class="domain">{SITE_URL.replace('https://', '')}</span>
	</header>

	<p class="eyebrow">{card.eyebrow}</p>
	<h1 class="display">
		{card.title}
		{#if card.accent}<span class="accent">{card.accent}</span>{/if}
	</h1>

	<div class="media">
		{#if 'scene' in visual}
			<AppWindow title={visual.window}>
				<Live load={SCENES[visual.scene]} props={visual.props} />
			</AppWindow>
		{:else if 'shot' in visual}
			<img class="shot" src={SHOTS[visual.shot].src} alt="" />
		{:else}
			<div class="download">
				<img class="icon" src={icon} alt="" width="168" height="168" />
				<ul class="platforms">
					{#each PLATFORMS as p (p)}<li>{p}</li>{/each}
				</ul>
			</div>
		{/if}
	</div>
</div>

<style>
	:global(html, body) {
		margin: 0;
		background: var(--bg);
	}
	.card {
		position: relative;
		width: 1200px;
		height: 630px;
		padding: 48px 64px 0;
		box-sizing: border-box;
		overflow: hidden;
		background: var(--bg);
	}
	.glow {
		position: absolute;
		inset: -40px 0 auto;
		height: 720px;
		background: var(--site-glow);
		pointer-events: none;
	}
	.top,
	.eyebrow,
	.display,
	.media {
		position: relative;
	}
	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.brand {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		font: var(--fw-semibold) 26px var(--font-mono);
		letter-spacing: var(--tracking-brand);
		color: var(--text);
	}
	.domain {
		font: var(--fw-medium) 20px var(--font-mono);
		color: var(--muted);
	}
	.eyebrow {
		margin: 40px 0 0;
		font: var(--fw-medium) 20px / 1 var(--font-mono);
		color: var(--accent);
	}
	.display {
		margin-top: 18px;
		max-width: 1040px;
		font-size: 68px;
	}
	.media {
		margin-top: 40px;
	}
	.shot {
		display: block;
		width: 100%;
		border: 1px solid var(--border-strong);
		border-radius: 12px;
		box-shadow: var(--site-window-shadow);
	}
	.download {
		display: flex;
		align-items: center;
		gap: 40px;
		margin-top: 8px;
	}
	.icon {
		border-radius: 36px;
		box-shadow: var(--site-window-shadow);
	}
	.platforms {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.platforms li {
		padding: 10px 18px;
		border: 1px solid var(--border-strong);
		border-radius: 999px;
		background: var(--surface);
		font: var(--fw-medium) 22px var(--font-ui);
		color: var(--text);
	}
</style>
