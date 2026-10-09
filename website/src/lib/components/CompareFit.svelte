<script lang="ts">
	// Who each product suits, side by side, drawn from the facts on the page.
	let { columns, heading = 'Which one fits' }: { columns: { name: string; points: string[] }[]; heading?: string } = $props();
</script>

<section class="wrap fit">
	<h2 class="h2">{heading}</h2>
	<div class="grid">
		{#each columns as col (col.name)}
			<div class="col">
				<h3 class="h3">{col.name} may suit you if</h3>
				<ul>
					{#each col.points as p (p)}<li>{p}</li>{/each}
				</ul>
			</div>
		{/each}
	</div>
</section>

<style>
	.fit {
		margin-top: 120px;
	}
	.h2 {
		margin-bottom: 40px;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 40px 48px;
	}
	.col {
		padding-top: 20px;
		border-top: 1px solid var(--border);
	}
	ul {
		display: grid;
		gap: 10px;
		margin: 16px 0 0;
		padding: 0;
		list-style: none;
		font-size: 15.5px;
	}
	li {
		position: relative;
		padding-left: 20px;
	}
	li::before {
		content: '';
		position: absolute;
		left: 2px;
		top: 0.62em;
		width: 7px;
		height: 7px;
		border-radius: 2px;
		background: var(--accent);
	}
</style>
