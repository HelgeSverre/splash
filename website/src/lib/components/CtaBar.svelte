<script lang="ts">
	// The download prompt above the footer, on every page.
	import DownloadButton from './DownloadButton.svelte';
</script>

<aside class="cta-bar" aria-label="Download Splash">
	<div class="wrap row">
		<p><strong>Stop juggling agent terminals.</strong> <span>Free and open source, for macOS, Windows and Linux.</span></p>
		<DownloadButton tone="dark" />
	</div>
</aside>

<style>
	.cta-bar {
		margin-top: 120px;
		background: var(--accent);
		color: var(--on-accent);
	}
	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px 24px;
		min-height: 76px;
		padding-block: 14px;
	}
	p {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 4px 12px;
		margin: 0;
		font-size: 15px;
	}
	strong {
		font-size: 19px;
		font-weight: var(--fw-semibold);
		letter-spacing: -0.015em;
	}
	span {
		opacity: 0.72;
	}
	/* The site's ring is the accent colour, which would vanish on this bar. */
	.cta-bar :global(:focus-visible) {
		outline-color: var(--on-accent);
	}
	@media (max-width: 560px) {
		.row {
			flex-direction: column;
			align-items: flex-start;
			padding-block: 20px;
		}
	}
</style>
