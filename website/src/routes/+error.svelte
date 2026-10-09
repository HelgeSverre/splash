<script lang="ts">
	// Any error page, inside the site's nav and footer. The static build's
	// 404.html boots into this for addresses that don't exist.
	import { page } from '$app/state';
	import { FEATURES, ISSUES_URL } from '#lib/site.ts';

	const missing = $derived(page.status === 404);
	const path = $derived(page.url.pathname);
</script>

<svelte:head>
	<title>{missing ? 'Page not found' : 'Something went wrong'} · Splash</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="error">
	<div class="glow" aria-hidden="true"></div>
	<div class="wrap">
		<p class="eyebrow"><span class="n">{page.status}</span>{missing ? 'Not found' : 'Error'}</p>
		<h1 class="display">{missing ? 'Nothing at this address.' : 'Something went wrong.'}</h1>

		<div class="term" aria-label="{missing ? 'No page at' : 'Error loading'} {path}">
			<p><span class="prompt" aria-hidden="true">$</span> cd {path}</p>
			<p class="out">{missing ? `cd: no such file or directory: ${path}` : (page.error?.message ?? 'Internal error')}</p>
		</div>

		<p class="lede">
			{#if missing}
				The link may be out of date, or the address mistyped. One of these is probably what you were after.
			{:else}
				Reloading may help. If it keeps happening, <a class="prose-link" href={ISSUES_URL}>open an issue</a> with the address.
			{/if}
		</p>

		<nav class="routes" aria-label="Where to go instead">
			<a class="route" href="/"><span class="name">Home</span><span class="sum">What Splash is, with the app running live.</span></a>
			<a class="route" href="/download"><span class="name">Download</span><span class="sum">macOS, Windows, Linux and the headless server, plus the changelog.</span></a>
			<a class="route" href="/vs"><span class="name">Comparisons</span><span class="sum">Splash beside other apps for running coding agents.</span></a>
		</nav>

		<div class="features">
			<h2>Features</h2>
			<ul>
				{#each FEATURES as f (f.slug)}<li><a href="/features/{f.slug}">{f.name}</a></li>{/each}
			</ul>
		</div>
	</div>
</section>

<style>
	.error {
		position: relative;
		padding: 80px 0 0;
	}
	.glow {
		position: absolute;
		inset: -60px 0 auto;
		height: 700px;
		background: var(--site-glow);
		pointer-events: none;
	}
	.wrap {
		position: relative;
	}
	.eyebrow .n {
		margin-right: 8px;
	}
	.display {
		margin-top: 24px;
		max-width: 16ch;
		font-size: clamp(38px, 5.4vw, 66px);
	}
	.term {
		max-width: 640px;
		margin-top: 36px;
		padding: 16px 18px;
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		background: var(--term-bg);
		font: 14px / 1.7 var(--font-mono);
		color: var(--term-fg);
		overflow-wrap: anywhere;
	}
	.term p {
		margin: 0;
	}
	.prompt {
		color: var(--accent);
	}
	.out {
		color: var(--muted);
	}
	.lede {
		margin-top: 32px;
		max-width: 56ch;
	}
	.routes {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 16px;
		margin-top: 40px;
	}
	.route {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 20px;
		border: 1px solid var(--border);
		border-radius: 12px;
		background: var(--surface);
		text-decoration: none;
	}
	.route:is(:hover, :focus-visible) {
		border-color: var(--border-focus);
	}
	.name {
		color: var(--text);
		font-weight: var(--fw-semibold);
		font-size: 17px;
	}
	.sum {
		color: var(--text-2);
		font-size: 14px;
	}
	.features {
		margin-top: 48px;
	}
	.features h2 {
		margin: 0;
		color: var(--muted);
		font: var(--fw-medium) 12px var(--font-mono);
	}
	.features ul {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin: 14px 0 0;
		padding: 0;
		list-style: none;
	}
	.features a {
		display: inline-flex;
		align-items: center;
		height: 34px;
		padding: 0 14px;
		border: 1px solid var(--border);
		border-radius: var(--radius-pill);
		color: var(--text-2);
		font-size: 14px;
		text-decoration: none;
	}
	.features a:is(:hover, :focus-visible) {
		color: var(--text);
		border-color: var(--border-strong);
	}
</style>
