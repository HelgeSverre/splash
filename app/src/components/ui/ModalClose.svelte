<script lang="ts">
  // A dialog's close button. `data-modal-close` keeps focusFirst from landing
  // on it when the dialog opens.
  import IconButton from "./IconButton.svelte";
  let { onclose }: { onclose: () => void } = $props();
</script>

<span class="close" data-modal-close><IconButton data-testid="modal-close" title="Close (Esc)" label="Close" icon="close" onclick={onclose} /></span>

<style>
  .close { display: contents; }
</style>
