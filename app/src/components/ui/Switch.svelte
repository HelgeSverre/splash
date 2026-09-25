<script lang="ts">
  // An on/off switch. Name it with `label`, or point `labelledby` at the
  // visible text it sits next to.
  let {
    checked,
    onchange,
    label,
    labelledby,
    disabled = false,
  }: { checked: boolean; onchange: (checked: boolean) => void; label?: string; labelledby?: string; disabled?: boolean } = $props();
</script>

<button class="plain switch" class:on={checked} role="switch" aria-checked={checked} aria-label={labelledby ? undefined : label}
  aria-labelledby={labelledby} {disabled} onclick={() => onchange(!checked)}></button>

<style>
  /* On is the soft accent (as for a checkbox or a picked card), so the full
     accent of the focus ring still stands out around it. */
  .switch {
    position: relative; flex: none; width: 30px; height: 18px; border-radius: var(--radius-pill);
    background: var(--border-strong); border: 1px solid transparent; transition: background 0.15s;
  }
  .switch::after {
    content: ""; position: absolute; top: 1px; left: 1px; width: 14px; height: 14px; border-radius: 50%;
    background: var(--text-2); transition: transform 0.15s;
  }
  .switch:is(:hover, :focus-visible):not(:disabled)::after { background: var(--text); }
  .on { background: var(--accent-soft); border-color: var(--accent-border); }
  .on::after, .on:is(:hover, :focus-visible):not(:disabled)::after { transform: translateX(12px); background: var(--accent); }
  .switch:disabled { opacity: 0.5; }
</style>
