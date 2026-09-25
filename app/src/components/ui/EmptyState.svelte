<script lang="ts">
  // The note an empty or loading pane shows: centred on both axes, with a dim
  // icon (or a spinner, or a `graphic` of your own), one line of text and an
  // optional detail. `inline` is the variant for an empty list inside a group
  // or a panel section.
  import type { Snippet } from "svelte";
  import Icon from "../Icon.svelte";

  let {
    icon,
    graphic,
    loading = false,
    title,
    detail,
    mono = false,
    error = false,
    inline = false,
    children,
  }: {
    icon?: string;
    /** Drawn in place of the icon, dimmed the same way. */
    graphic?: Snippet;
    loading?: boolean;
    title?: string;
    detail?: string;
    /** The detail is a path or an id. */
    mono?: boolean;
    /** The title is an error message. */
    error?: boolean;
    inline?: boolean;
    children?: Snippet;
  } = $props();
</script>

<div class="empty" class:inline role={loading ? "status" : undefined} aria-label={loading && !title ? "Loading" : undefined}>
  {#if graphic}<span class="icon graphic">{@render graphic()}</span>{/if}
  {#if loading}<span class="spinner"></span>{:else if icon && !graphic}<span class="icon"><Icon name={icon} size={inline ? 16 : 24} /></span>{/if}
  {#if title}<p class="title" class:error>{title}</p>{/if}
  {#if detail}<p class="detail" class:mono>{detail}</p>{/if}
  {#if children}<div class="extra">{@render children()}</div>{/if}
</div>

<style>
  .empty {
    flex: 1; height: 100%; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 8px; padding: 24px; text-align: center; color: var(--muted);
    font-family: var(--font-ui); line-height: var(--lh-base); white-space: normal;
  }
  .empty.inline { flex: none; height: auto; gap: 6px; padding: 18px 14px; }
  .icon { display: inline-grid; place-items: center; color: var(--faint); }
  /* A brand mark, greyed right down: a watermark, not a logo. */
  .graphic { opacity: 0.14; filter: grayscale(1); margin-bottom: 4px; }
  p { margin: 0; max-width: 56ch; overflow-wrap: anywhere; }
  .title { font-size: var(--fs-base); color: var(--muted); }
  .title.error { color: var(--del-fg); white-space: pre-wrap; }
  .detail { font-size: var(--fs-sm); color: var(--muted); }
  .detail.mono { font-family: var(--font-mono); font-size: var(--fs-xs); }
  .extra { font-size: var(--fs-sm); color: var(--muted); }
</style>
