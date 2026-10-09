<script lang="ts">
	// One product's answer in a comparison: an optional mark, the text, its sources.
	import type { Cell, Mark } from '../compare/types.ts';
	import Cite from './Cite.svelte';

	let { cell }: { cell: Cell } = $props();

	const LABEL: Record<Mark, string> = { yes: 'Yes', no: 'No', partial: 'Partly', unknown: 'Not documented' };
</script>

<span class="cell" data-mark={cell.mark}>
	{#if cell.mark}
		<!-- As tall as the first line of text, so the badge centres on it. -->
		<span class="mark" title={LABEL[cell.mark]}>
			<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
				{#if cell.mark === 'yes'}
					<path d="M4.75 8.25l2.25 2.25 4.25-4.75" />
				{:else if cell.mark === 'no'}
					<path d="M5 8h6" />
				{:else if cell.mark === 'partial'}
					<path d="M8 4.5a3.5 3.5 0 0 0 0 7z" class="fill" />
					<circle cx="8" cy="8" r="3.5" />
				{:else}
					<path d="M6.25 6.4a1.85 1.85 0 1 1 2.5 1.75c-.45.2-.75.55-.75 1.05v.35" />
					<circle cx="8" cy="11.4" r=".2" />
				{/if}
			</svg>
			<span class="sr">{LABEL[cell.mark]}:</span>
		</span>
	{/if}
	<span class="text">{cell.text}<Cite ids={cell.cite} /></span>
</span>

<style>
	.cell {
		display: flex;
		gap: 10px;
		align-items: flex-start;
	}
	.mark {
		flex: none;
		display: grid;
		place-items: center;
		height: 1.5em;
	}
	svg {
		display: block;
		border-radius: 50%;
		background: var(--soft);
		fill: none;
		stroke: var(--muted);
		stroke-width: 1.5;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	svg .fill {
		fill: currentColor;
		stroke: none;
	}
	[data-mark='yes'] svg {
		background: color-mix(in srgb, var(--ok) 14%, transparent);
		stroke: var(--ok);
	}
	[data-mark='partial'] svg {
		background: color-mix(in srgb, var(--warn) 14%, transparent);
		stroke: var(--warn);
		color: var(--warn);
	}
	[data-mark='unknown'] .text {
		color: var(--muted);
	}
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
</style>
