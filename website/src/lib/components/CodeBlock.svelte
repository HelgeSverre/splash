<script lang="ts">
	// A command or snippet with a copy button.
	let { code, label }: { code: string; label?: string } = $props();
	let copied = $state(false);

	async function copy() {
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			setTimeout(() => (copied = false), 1600);
		} catch {}
	}
</script>

<figure class="code">
	{#if label}<figcaption>{label}</figcaption>{/if}
	<pre><code>{code}</code></pre>
	<button class="copy" onclick={copy} aria-label="Copy {label ?? 'code'}">{copied ? 'Copied' : 'Copy'}</button>
</figure>

<style>
	.code {
		position: relative;
		margin: 0;
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		background: var(--surface);
		overflow: hidden;
	}
	figcaption {
		padding: 8px 14px;
		border-bottom: 1px solid var(--border);
		color: var(--muted);
		font: var(--fw-medium) 12px var(--font-mono);
	}
	pre {
		margin: 0;
		padding: 14px 16px;
		overflow-x: auto;
		font: 13px / 1.65 var(--font-mono);
		color: var(--text);
	}
	.copy {
		position: absolute;
		top: 6px;
		right: 6px;
		height: 24px;
		padding: 0 8px;
		border: 1px solid var(--border-strong);
		border-radius: var(--radius);
		background: var(--soft);
		color: var(--text-2);
		font: var(--fw-medium) 12px var(--font-ui);
		cursor: pointer;
	}
	.copy:is(:hover, :focus-visible) {
		color: var(--text);
		background: var(--hover);
	}
</style>
