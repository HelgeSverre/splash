<script lang="ts">
	import { onMount } from 'svelte';
	import CodeBlock from '#lib/components/CodeBlock.svelte';
	import SplashMark from '$splash/components/SplashMark.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { OS_NAMES, PLATFORMS, RELEASES, SERVER, VERSION, detect, primaryFor, type Os } from '#lib/releases.ts';
	import { available, latest, loadLatest, resolve } from '#lib/latest.svelte.ts';
	import { REPO, RELEASES_URL } from '#lib/site.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let os: Os = $state('macos');
	let intel = $state(false);
	onMount(async () => {
		loadLatest();
		const found = await detect();
		if (found.os) os = found.os;
		intel = found.intel;
	});

	const platform = $derived(PLATFORMS.find((p) => p.os === os)!);
	const primary = $derived(primaryFor(os, intel, available));
	const primaryFile = $derived(resolve(primary));
	const date = (iso: string) => (iso ? new Date(`${iso}T12:00:00Z`).toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' }) : '');

	const verify: Record<Os, { label: string; code: string }> = {
		macos: { label: 'Verify on macOS', code: `shasum -a 256 -c ${primaryFor('macos', false, available).file(latest.version)}.sha256` },
		windows: { label: 'Verify on Windows (PowerShell)', code: `Get-FileHash -Algorithm SHA256 .\\${primaryFor('windows').file(latest.version)}` },
		linux: { label: 'Verify on Linux', code: `sha256sum -c ${primaryFor('linux').file(latest.version)}.sha256` }
	};
</script>

<Seo title="Download Splash · Changelog" description="Download Splash v{VERSION} for macOS, Windows and Linux, or the headless server, and read the changelog." card="download" />

<section class="top">
	<div class="glow" aria-hidden="true"></div>
	<div class="wrap">
		<div class="hero">
			<div class="mark"><SplashMark size={56} /></div>
			<div>
				<p class="eyebrow"><span class="n">v{latest.version}</span> · macOS · Windows · Linux · MIT</p>
				<h1 class="display">Download Splash</h1>
				<p class="lede">Free and open source. Splash runs the agents you already have installed and signed in; bring one or several.</p>
			</div>
		</div>

		<div class="card main">
			<div class="info">
				<span class="os">Splash for {OS_NAMES[os]}</span>
				<span class="file">{primary.label} · {primaryFile.file}</span>
				<span class="meta">{platform.requires}. {platform.install}</span>
			</div>
			<div class="actions">
				<a class="cta primary" href={primaryFile.url}>Download {primary.detail}</a>
				<a class="sum" href={primaryFile.sha256}>SHA-256</a>
			</div>
		</div>

		<div class="platforms">
			{#each PLATFORMS as p (p.os)}
				<div class="card platform" class:mine={os === p.os}>
					<h2 class="name">{p.name}</h2>
					<p class="requires">{p.requires}</p>
					<ul>
						{#each p.downloads.filter(available) as d (d.label)}
							{@const f = resolve(d)}
							<li>
								<a class="file-link" href={f.url}><span class="label">{d.label}</span><span class="ext">{d.detail}</span></a>
								<a class="hash" href={f.sha256} aria-label="SHA-256 for {f.file}">sha256</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>

		<div class="card server">
			<div class="server-head">
				<h2 class="name">splash-server</h2>
				<p class="requires">Headless, no window or WebKit needed. Run it where your repositories live and <a class="prose-link" href="/features/server">use it over SSH</a>.</p>
			</div>
			<ul>
				{#each SERVER as d (d.label)}
					{@const f = resolve(d)}
					<li><a class="file-link" href={f.url}><span class="label">{d.label}</span><span class="ext">{d.detail}</span></a><a class="hash" href={f.sha256} aria-label="SHA-256 for {f.file}">sha256</a></li>
				{/each}
			</ul>
		</div>

		<div class="extra">
			<div>
				<h2 class="h3">Add an agent</h2>
				<p>Install and sign in to any <a class="prose-link" href="/features/agents">supported agent</a>; Splash finds it on your PATH. Adapters launched through <code>npx</code> need Node.js. Worktrees use git, and the GitHub view uses the GitHub CLI.</p>
			</div>
			<div class="blocks">
				<CodeBlock label={verify[os].label} code={verify[os].code} />
				<p class="all">Every file, checksum and older version is on <a class="prose-link" href={RELEASES_URL}>GitHub Releases</a>. Source on <a class="prose-link" href={REPO}>GitHub</a>.</p>
			</div>
		</div>
	</div>
</section>

<section class="wrap changelog" id="changelog">
	<h2 class="h2">Changelog</h2>
	<p class="lede">What changed in each release, newest first.</p>

	{#each RELEASES as r (r.version)}
		<article class="release" id="v{r.version}">
			<div class="side">
				<span class="version">v{r.version}</span>
				{#if r.date}<span class="date">{date(r.date)}</span>{/if}
				<a class="gh" href="{RELEASES_URL}/tag/v{r.version}">On GitHub ↗</a>
			</div>
			<div class="notes">{@html data.notes[r.version]}</div>
		</article>
	{/each}
</section>

<style>
	.top {
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
	.hero {
		display: flex;
		gap: 28px;
		align-items: flex-start;
	}
	.mark {
		flex: none;
		display: grid;
		place-items: center;
		width: 96px;
		height: 96px;
		border: 1px solid var(--border-strong);
		border-radius: 22px;
		background: var(--bg);
		box-shadow: var(--site-card-shadow);
	}
	.display {
		margin-top: 14px;
		font-size: clamp(38px, 5.4vw, 64px);
	}
	.hero .lede {
		margin-top: 16px;
		max-width: 60ch;
	}
	.card {
		border: 1px solid var(--border);
		border-radius: 12px;
		background: var(--surface);
	}
	.main {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		margin-top: 48px;
		padding: 24px 28px;
		border-color: var(--accent-border);
		box-shadow: 0 0 0 4px var(--accent-soft);
	}
	.info {
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
	}
	.os {
		color: var(--text);
		font-size: 21px;
		font-weight: var(--fw-semibold);
		letter-spacing: -0.01em;
	}
	.file {
		font: 13px var(--font-mono);
		color: var(--text-2);
		overflow-wrap: anywhere;
	}
	.meta {
		max-width: 70ch;
		color: var(--muted);
		font-size: 14px;
	}
	.actions {
		display: flex;
		align-items: center;
		gap: 16px;
		flex: none;
	}
	.sum,
	.hash {
		color: var(--muted);
		font: 12.5px var(--font-mono);
	}
	.sum:is(:hover, :focus-visible),
	.hash:is(:hover, :focus-visible) {
		color: var(--text);
	}
	.platforms {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
		margin-top: 16px;
	}
	.platform {
		padding: 20px;
	}
	.platform.mine {
		border-color: var(--border-focus);
	}
	.name {
		margin: 0;
		color: var(--text);
		font-size: 17px;
		font-weight: var(--fw-semibold);
	}
	.requires {
		margin: 4px 0 0;
		color: var(--muted);
		font-size: 13.5px;
	}
	ul {
		margin: 14px 0 0;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 6px;
	}
	li {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.file-link {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		min-width: 0;
		height: 38px;
		padding: 0 12px;
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-lg);
		background: var(--bg);
		color: var(--text);
		font-size: 14.5px;
		text-decoration: none;
	}
	.file-link:is(:hover, :focus-visible) {
		border-color: var(--accent-border);
		background: var(--accent-soft);
	}
	.ext {
		color: var(--muted);
		font: 12px var(--font-mono);
	}
	.server {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
		gap: 24px;
		align-items: center;
		margin-top: 16px;
		padding: 20px;
	}
	.server ul {
		margin: 0;
		grid-template-columns: 1fr 1fr;
	}

	.extra code {
		font: 13px var(--font-mono);
		color: var(--text);
	}
	.extra {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 48px;
		margin-top: 64px;
	}
	.extra p {
		margin: 8px 0 14px;
		font-size: 15px;
	}
	.extra .h3:not(:first-child) {
		margin-top: 32px;
	}
	.blocks {
		display: grid;
		gap: 16px;
		align-content: start;
	}
	.blocks .all {
		margin: 0;
		color: var(--muted);
		font-size: 14px;
	}
	.changelog {
		margin-top: 140px;
	}
	.changelog > .lede {
		margin: 14px 0 48px;
	}
	.release {
		display: grid;
		grid-template-columns: 200px minmax(0, 1fr);
		gap: 40px;
		padding: 40px 0;
		border-top: 1px solid var(--border);
	}
	.side {
		position: sticky;
		top: 84px;
		align-self: start;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.version {
		color: var(--text);
		font: var(--fw-semibold) 22px var(--font-mono);
		letter-spacing: var(--tracking-brand);
	}
	.date {
		color: var(--muted);
		font-size: 14px;
	}
	.gh {
		margin-top: 6px;
		color: var(--text-2);
		font-size: 14px;
		text-decoration: none;
	}
	.gh:is(:hover, :focus-visible) {
		color: var(--text);
	}
	.notes {
		max-width: 76ch;
		font-size: 15.5px;
	}
	.notes :global(p:first-child) {
		margin-top: 0;
		color: var(--text);
		font-size: 17px;
	}
	.notes :global(h2) {
		margin: 28px 0 10px;
		color: var(--text);
		font-size: 17px;
		font-weight: var(--fw-semibold);
	}
	.notes :global(ul) {
		margin: 0;
		padding-left: 18px;
		display: grid;
		gap: 6px;
		list-style: disc;
	}
	.notes :global(li) {
		display: list-item;
	}
	.notes :global(strong) {
		color: var(--text);
		font-weight: var(--fw-medium);
	}
	.notes :global(code) {
		font: 13.5px var(--font-mono);
		color: var(--text);
	}
	.notes :global(a) {
		color: var(--text);
		text-underline-offset: 3px;
		text-decoration-color: var(--border-focus);
	}
	.notes :global(table) {
		width: 100%;
		border-collapse: collapse;
		font-size: 14.5px;
	}
	.notes :global(:is(th, td)) {
		padding: 8px 10px;
		border-bottom: 1px solid var(--border);
		text-align: left;
		vertical-align: top;
	}
	.notes :global(td:first-child) {
		white-space: nowrap;
		color: var(--text);
	}
	.notes :global(th) {
		color: var(--muted);
		font: var(--fw-medium) 12px var(--font-mono);
	}
	@media (max-width: 960px) {
		.platforms {
			grid-template-columns: 1fr;
		}
		.server,
		.extra,
		.release {
			grid-template-columns: 1fr;
			gap: 20px;
		}
		.side {
			position: static;
			flex-direction: row;
			align-items: baseline;
			gap: 12px;
		}
	}
	@media (max-width: 860px) {
		.server ul {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 640px) {
		.hero {
			flex-direction: column;
		}
		.main {
			flex-direction: column;
			align-items: flex-start;
		}
		.server ul {
			grid-template-columns: 1fr;
		}
	}
</style>
