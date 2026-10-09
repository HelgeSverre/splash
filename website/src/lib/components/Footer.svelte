<script lang="ts">
	import SplashMark from '$splash/components/SplashMark.svelte';
	import { FEATURES, REPO, ISSUES_URL, ACP_URL, COMPARISON_LINKS } from '../site';

	const year = new Date().getFullYear();
</script>

<footer>
	<div class="wrap grid">
		<div class="about">
			<a class="brand" href="/"><SplashMark size={20} /><span>splash</span></a>
			<p>A desktop app for running coding agents side by side, on macOS, Windows and Linux.</p>
			<p class="fine">Splash is independent and not affiliated with the agent providers.</p>
		</div>
		<nav aria-label="Features">
			<h2>Features</h2>
			{#each FEATURES as f (f.slug)}<a href="/features/{f.slug}">{f.name}</a>{/each}
		</nav>
		{#if COMPARISON_LINKS.length}
			<nav aria-label="Comparisons">
				<h2>Comparisons</h2>
				{#each COMPARISON_LINKS as c (c.slug)}<a href="/vs/{c.slug}">vs {c.name}</a>{/each}
				<a class="all" href="/vs">All comparisons →</a>
			</nav>
		{/if}
		<nav aria-label="Project">
			<h2>Project</h2>
			<a href="/download">Download</a>
			<a href="/download#changelog">Changelog</a>
			<a href={REPO}>Source on GitHub</a>
			<a href={ISSUES_URL}>Report a problem</a>
			<a href={ACP_URL}>Agent Client Protocol</a>
		</nav>
	</div>
	<div class="wrap bottom">
		<span>© {year} splash <i>·</i> <a href="{REPO}/blob/main/LICENSE">MIT</a></span>
		<span>made by <a href="https://helgesver.re">helgesverre</a> <i aria-hidden="true">↗</i></span>
	</div>
</footer>

<style>
	footer {
		padding: 56px 0 40px;
		border-top: 1px solid var(--site-hairline);
		background: var(--surface);
	}
	.grid {
		display: grid;
		grid-auto-flow: column;
		grid-template-columns: 2fr;
		grid-auto-columns: 1fr;
		gap: 40px;
	}
	.brand {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		color: var(--text);
		text-decoration: none;
		font: var(--fw-semibold) 16px var(--font-mono);
		letter-spacing: var(--tracking-brand);
	}
	.about p {
		max-width: 44ch;
		font-size: var(--site-fs-small);
	}
	.fine {
		color: var(--muted);
	}
	nav {
		display: flex;
		flex-direction: column;
		gap: 8px;
		font-size: var(--site-fs-small);
	}
	h2 {
		margin: 0 0 4px;
		font: var(--fw-medium) 12px var(--font-mono);
		color: var(--muted);
	}
	nav a {
		color: var(--text-2);
		text-decoration: none;
	}
	nav a:is(:hover, :focus-visible) {
		color: var(--text);
	}
	nav a.all {
		margin-top: 4px;
		color: var(--text);
	}
	.bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		margin-top: 40px;
		padding-top: 20px;
		border-top: 1px solid var(--border);
		color: var(--muted);
		font: 12.5px var(--font-mono);
	}
	.bottom span {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}
	.bottom i {
		font-style: normal;
		color: var(--faint);
	}
	.bottom a {
		color: var(--text);
		text-decoration: underline;
		text-decoration-color: var(--border-focus);
		text-underline-offset: 3px;
	}
	.bottom a:is(:hover, :focus-visible) {
		text-decoration-color: var(--accent);
	}
	@media (max-width: 560px) {
		.bottom {
			flex-direction: column;
			align-items: flex-start;
		}
	}
	@media (max-width: 720px) {
		.grid {
			grid-auto-flow: row;
			grid-template-columns: 1fr 1fr;
		}
		.about {
			grid-column: 1 / -1;
		}
	}
</style>
