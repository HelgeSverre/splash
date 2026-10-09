<script lang="ts">
	// A comparison's grouped feature table: the question, then each product's
	// answer. Every group's heading row repeats the product names, so a long
	// table needs no sticky header; the real column headers are for screen
	// readers. Below 720px each row stacks, labelled by product.
	import type { Group } from '../compare/types.ts';
	import CompareCell from './CompareCell.svelte';

	let { groups, other, heading }: { groups: Group[]; other: string; heading?: string } = $props();
</script>

<section class="wrap compare">
	{#if heading}<h2 class="h2">{heading}</h2>{/if}
	<table>
		<colgroup><col class="label" /><col /><col /></colgroup>
		<thead class="sr">
			<tr>
				<td></td>
				<th scope="col">Splash</th>
				<th scope="col">{other}</th>
			</tr>
		</thead>
		{#each groups as g (g.title)}
			<tbody>
				<tr class="group">
					<th scope="rowgroup">{g.title}</th>
					<td class="product splash" aria-hidden="true">Splash</td>
					<td class="product" aria-hidden="true">{other}</td>
				</tr>
				{#each g.rows as r (r.label)}
					<tr>
						<th scope="row">
							{r.label}
							{#if r.hint}<span class="hint">{r.hint}</span>{/if}
						</th>
						<td class="splash" data-product="Splash"><CompareCell cell={r.splash} /></td>
						<td data-product={other}><CompareCell cell={r.other} /></td>
					</tr>
				{/each}
			</tbody>
		{/each}
	</table>
</section>

<style>
	.compare {
		margin-top: 96px;
	}
	.h2 {
		margin-bottom: 8px;
	}
	table {
		width: 100%;
		border-collapse: collapse;
		table-layout: fixed;
		font-size: 15px;
	}
	col.label {
		width: 26%;
	}
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
	.group :is(th, td) {
		padding: 36px 16px 10px;
		color: var(--muted);
		font: var(--fw-medium) 12px var(--font-mono);
		text-align: left;
	}
	.group th {
		padding-left: 0;
	}
	.group .product {
		color: var(--text);
		font-weight: var(--fw-semibold);
	}
	.group .splash {
		color: var(--accent);
	}
	tbody tr:not(.group) {
		border-top: 1px solid var(--border);
	}
	tbody th[scope='row'] {
		padding: 14px 16px 14px 0;
		color: var(--text);
		font-weight: var(--fw-medium);
		text-align: left;
		vertical-align: top;
	}
	.hint {
		display: block;
		margin-top: 2px;
		color: var(--muted);
		font-size: 13px;
		font-weight: var(--fw-regular);
	}
	td {
		padding: 14px 16px;
		vertical-align: top;
		color: var(--text-2);
		line-height: 1.5;
	}
	@media (max-width: 720px) {
		table,
		tbody,
		tr,
		th,
		td {
			display: block;
			width: auto;
		}
		.group .product {
			display: none;
		}
		.group th {
			padding: 32px 0 8px;
		}
		tbody th[scope='row'] {
			padding: 16px 0 6px;
		}
		td {
			padding: 6px 0;
		}
		td::before {
			content: attr(data-product);
			display: block;
			margin-bottom: 2px;
			color: var(--text);
			font: var(--fw-semibold) 11.5px var(--font-mono);
		}
		td.splash::before {
			color: var(--accent);
		}
		td:last-child {
			padding-bottom: 16px;
		}
	}
</style>
