<script lang="ts">
  let { size = 18 }: { size?: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
  <path d="M32 8 C32 8, 48 24, 48 35 C48 44.5, 40.8 52, 32 52 C23.2 52, 16 44.5, 16 35 C16 24, 32 8, 32 8Z" fill="var(--accent)" />
  <circle cx="10" cy="45" r="3.4" fill="var(--accent)" />
  <circle cx="55" cy="42" r="2.6" fill="var(--accent)" />
  <circle cx="48" cy="56" r="2" fill="var(--accent)" />
  <circle cx="16" cy="57" r="1.7" fill="var(--accent)" />
</svg>
