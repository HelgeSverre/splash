<script lang="ts">
	import SplashMark from '$splash/components/SplashMark.svelte';
	import { page } from '$app/state';
	import { FEATURES, REPO } from '../site';
	import GithubMark from './GithubMark.svelte';

	let open = $state(false);
	const here = (path: string) => page.url.pathname === path || page.url.pathname.startsWith(path + '/');
</script>

<header class="nav">
	<div class="wrap row">
		<a class="brand" href="/" aria-label="Splash home"><SplashMark size={22} /><span>splash</span></a>
		<nav aria-label="Primary">
			<div class="features" class:open>
				<button class="link" aria-expanded={open} aria-controls="feature-menu" class:here={here('/features')} onclick={() => (open = !open)}>Features</button>
				<div class="menu" id="feature-menu">
					{#each FEATURES as f (f.slug)}
						<a href="/features/{f.slug}" onclick={() => (open = false)}>
							<span class="name">{f.name}</span>
							<span class="sum">{f.summary}</span>
						</a>
					{/each}
				</div>
			</div>
			<a class="link" class:here={here('/download')} href="/download#changelog">Changelog</a>
			<a class="link gh" href={REPO} aria-label="Splash on GitHub"><GithubMark size={18} /><span>GitHub</span></a>
			<a class="cta primary small" href="/download">Download</a>
		</nav>
	</div>
</header>

<svelte:window onkeydown={(e) => e.key === 'Escape' && (open = false)} />

<style>
	.nav {
		position: sticky;
		top: 0;
		z-index: 50;
		background: color-mix(in srgb, var(--bg) 82%, transparent);
		backdrop-filter: blur(14px) saturate(1.4);
		border-bottom: 1px solid var(--site-hairline);
	}
	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 60px;
	}
	.brand {
		display: inline-flex;
		align-items: center;
		gap: 9px;
		color: var(--text);
		text-decoration: none;
		font: var(--fw-semibold) 17px var(--font-mono);
		letter-spacing: var(--tracking-brand);
	}
	nav {
		display: flex;
		align-items: center;
		gap: 4px;
	}
	.link {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		height: 34px;
		padding: 0 12px;
		border: 0;
		border-radius: var(--radius);
		background: none;
		color: var(--text-2);
		font: var(--fw-medium) 14px var(--font-ui);
		text-decoration: none;
		cursor: pointer;
	}
	.link:is(:hover, :focus-visible),
	.link.here {
		color: var(--text);
		background: var(--soft);
	}
	.cta.small {
		height: 34px;
		padding: 0 14px;
		font-size: 14px;
		margin-left: 8px;
	}
	.features {
		position: relative;
	}
	.menu {
		position: absolute;
		top: calc(100% + 8px);
		left: -12px;
		display: none;
		width: 340px;
		padding: 6px;
		background: var(--surface);
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-pop);
	}
	.features.open .menu,
	.features:focus-within .menu {
		display: block;
	}
	@media (hover: hover) {
		.features:hover .menu {
			display: block;
		}
		.features::after {
			content: '';
			position: absolute;
			inset: 100% -12px -10px;
		}
	}
	.menu a {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 8px 10px;
		border-radius: var(--radius);
		text-decoration: none;
	}
	.menu a:is(:hover, :focus-visible) {
		background: var(--hover);
	}
	.name {
		display: flex;
		align-items: center;
		gap: 8px;
		color: var(--text);
		font: var(--fw-medium) 14px var(--font-ui);
	}
	.sum {
		color: var(--muted);
		font-size: 13px;
		line-height: 1.4;
	}
	@media (max-width: 640px) {
		.gh span,
		.features {
			display: none;
		}
		.link {
			padding: 0 8px;
		}
	}
</style>
