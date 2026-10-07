<script lang="ts">
	// The desktop shell's toasts and context menus, for live scenes.
	import MenuItem from '$splash/components/ui/MenuItem.svelte';
	import { toasts } from '../demo/toasts.svelte';
	import { menu, closeMenu } from '../demo/overlays.svelte';

	let el: HTMLDivElement | undefined = $state();

	$effect(() => {
		if (menu.items.length) el?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus();
	});

	function onkeydown(e: KeyboardEvent) {
		if (!menu.items.length) return;
		if (e.key === 'Escape') closeMenu();
		if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
		e.preventDefault();
		const items = [...(el?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [])];
		const i = items.indexOf(document.activeElement as HTMLButtonElement);
		items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length]?.focus();
	}
</script>

<svelte:window {onkeydown} onscroll={closeMenu} onresize={closeMenu} />

{#if menu.items.length}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div class="catcher" onclick={closeMenu} oncontextmenu={(e) => (e.preventDefault(), closeMenu())}></div>
	<div class="splash-ui popover menu" role="menu" bind:this={el} style:left="{menu.x}px" style:top="{menu.y}px">
		{#each menu.items as item, i (i)}
			{#if item.separator}
				<hr />
			{:else}
				<MenuItem name={item.label ?? ''} role="menuitem" disabled={item.disabled} onclick={() => { closeMenu(); item.action?.(); }} />
			{/if}
		{/each}
	</div>
{/if}

<div class="splash-ui toasts" aria-live="polite">
	{#each toasts as t (t.id)}
		<div class="toast {t.variant}">{t.message}</div>
	{/each}
</div>

<style>
	.catcher {
		position: fixed;
		inset: 0;
		z-index: 90;
	}
	.menu {
		position: fixed;
		z-index: 91;
		min-width: 200px;
	}
	hr {
		margin: 4px 0;
		border: 0;
		border-top: 1px solid var(--border);
	}
	.toasts {
		position: fixed;
		right: 16px;
		bottom: 16px;
		z-index: 95;
		display: flex;
		flex-direction: column;
		gap: 8px;
		align-items: flex-end;
		pointer-events: none;
	}
	.toast {
		max-width: 360px;
		padding: 8px 12px;
		background: var(--raised);
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-pop);
		color: var(--text);
	}
	.toast.error {
		color: var(--del-fg);
		border-color: var(--err-soft);
	}
</style>
