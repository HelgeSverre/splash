<script lang="ts" generics="T">
  // What a file view shows until it has the file: the error, a spinner, then
  // (when the parent says so) binary or too large. `children` gets the value.
  import type { Snippet } from "svelte";
  import EmptyState from "./ui/EmptyState.svelte";
  import type { Loaded } from "../lib/load.svelte";

  type TooLarge = { title: string; detail?: string; mono?: boolean };
  let {
    res,
    binary = false,
    tooLarge,
    children,
  }: { res: Loaded<T>; binary?: boolean; tooLarge?: TooLarge | false | null; children: Snippet<[T]> } = $props();
</script>

{#if res.error}
  <EmptyState icon="alert" title={res.error} error />
{:else if res.value === null}
  <EmptyState loading />
{:else if binary}
  <EmptyState icon="info" title="Binary file" />
{:else if tooLarge}
  <EmptyState icon="info" title={tooLarge.title} detail={tooLarge.detail} mono={tooLarge.mono} />
{:else}
  {@render children(res.value)}
{/if}
