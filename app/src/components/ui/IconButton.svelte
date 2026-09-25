<script lang="ts" module>
  export type IconButtonSize = "sm" | "md" | "lg";
  // Three sizes only: the box follows the control heights, the glyph follows the box.
  const GLYPH: Record<IconButtonSize, number> = { sm: 12, md: 14, lg: 15 };
</script>

<script lang="ts">
  // A square, chrome-less icon button with a tooltip: a glyph from lib/icons,
  // sized to the button. Pass `pressed` when it toggles something (a pane, a
  // mode): it's announced as a toggle button. `loading` swaps the glyph for a
  // spinner and holds the button until the work is done.
  import Icon from "../Icon.svelte";

  let {
    title,
    label,
    icon,
    onclick,
    active = false,
    pressed,
    disabled = false,
    loading = false,
    size = "lg",
    tabindex,
    class: cls = "",
  }: {
    title: string;
    /** The accessible name, when the tooltip carries extra text (a shortcut). */
    label?: string;
    icon: string;
    onclick?: (e: MouseEvent) => void;
    active?: boolean;
    pressed?: boolean;
    disabled?: boolean;
    loading?: boolean;
    size?: IconButtonSize;
    tabindex?: number;
    class?: string;
  } = $props();
</script>

<button class="plain icon-btn {size} {cls}" class:active={active || pressed} {title} aria-label={label ?? title} aria-pressed={pressed}
  disabled={disabled || loading} aria-busy={loading || undefined} {onclick} {tabindex}>
  {#if loading}<span class="spinner"></span>{:else}<Icon name={icon} size={GLYPH[size]} />{/if}
</button>

<style>
  .icon-btn { display: inline-grid; place-items: center; flex: none; border-radius: var(--radius); color: var(--muted); }
  .sm { width: var(--control-h-xs); height: var(--control-h-xs); border-radius: var(--radius-sm); }
  .md { width: var(--control-h-sm); height: var(--control-h-sm); }
  .lg { width: var(--control-h); height: var(--control-h); }
  .icon-btn:is(:hover, :focus-visible):not(:disabled) { background: var(--hover); color: var(--text); }
  .icon-btn.active { color: var(--text-2); }
  .icon-btn:disabled { opacity: 0.5; }
</style>
