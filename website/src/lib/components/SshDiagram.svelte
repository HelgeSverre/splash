<script lang="ts">
	// Splash over SSH: where each piece runs (README "Run as a web app over SSH").
	const hops = [
		{ where: 'Your laptop', what: 'Browser', detail: 'http://127.0.0.1:4780' },
		{ where: 'Encrypted', what: 'SSH tunnel', detail: 'ssh -N -L 4780:…' },
		{ where: 'Your workstation', what: 'splash-server', detail: 'loopback + token' },
		{ where: 'Same machine', what: 'Agents', detail: 'ACP over stdio' }
	];
</script>

<div class="diagram" role="img" aria-label="Browser on your laptop, through an SSH tunnel, to splash-server on your workstation, which runs agents over ACP on stdio next to your repositories and terminals.">
	<div class="hops">
		{#each hops as h, i (h.what)}
			{#if i}<span class="link" aria-hidden="true"><i></i></span>{/if}
			<div class="hop" class:server={h.what === 'splash-server'}>
				<span class="where">{h.where}</span>
				<span class="what">{h.what}</span>
				<span class="detail">{h.detail}</span>
			</div>
		{/each}
	</div>
	<div class="host">
		<span>Repositories</span><span>Git</span><span>Terminals</span><span>Agent logins</span>
		<em>all stay on the workstation</em>
	</div>
</div>

<style>
	.diagram {
		padding: 28px;
		border: 1px solid var(--border);
		border-radius: 12px;
		background:
			linear-gradient(var(--site-grid-line) 1px, transparent 1px) 0 0 / 24px 24px,
			linear-gradient(90deg, var(--site-grid-line) 1px, transparent 1px) 0 0 / 24px 24px,
			var(--surface);
	}
	.hops {
		display: flex;
		align-items: stretch;
	}
	.hop {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 14px;
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-lg);
		background: var(--bg);
		min-width: 0;
	}
	.hop.server {
		border-color: var(--accent-border);
		box-shadow: 0 0 0 4px var(--accent-soft);
	}
	.where {
		font: var(--fw-medium) 11px var(--font-mono);
		color: var(--muted);
	}
	.what {
		color: var(--text);
		font-weight: var(--fw-semibold);
	}
	.detail {
		font: 12px var(--font-mono);
		color: var(--text-2);
		overflow-wrap: anywhere;
	}
	.link {
		position: relative;
		flex: 0 0 36px;
		align-self: center;
		height: 2px;
		background: var(--border-strong);
		overflow: hidden;
	}
	.link i {
		position: absolute;
		top: 0;
		left: -10px;
		width: 10px;
		height: 2px;
		background: var(--accent);
		animation: packet 1.6s linear infinite;
	}
	@keyframes packet {
		to {
			left: 100%;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.link i {
			animation: none;
			left: 40%;
		}
	}
	.host {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		align-items: center;
		margin: 16px 0 0 calc(50% + 18px);
		padding-top: 14px;
		border-top: 1px dashed var(--border-strong);
		font-size: 13px;
	}
	.host span {
		padding: 3px 9px;
		border: 1px solid var(--border);
		border-radius: var(--radius-pill);
		background: var(--bg);
		color: var(--text-2);
	}
	.host em {
		color: var(--muted);
		font-style: normal;
	}
	@media (max-width: 760px) {
		.hops {
			flex-direction: column;
		}
		.link {
			flex: 0 0 20px;
			width: 2px;
			height: 20px;
		}
		.link i {
			display: none;
		}
		.host {
			margin-left: 0;
		}
	}
</style>
