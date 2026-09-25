<script lang="ts" module>
  const NAMES: Record<string, string> = { M: "modified", A: "added", D: "deleted", "?": "untracked", T: "type changed" };
  /** Git's status letter as shown: untracked "?" reads as "U". */
  export const changeLetter = (status: string) => (status === "?" ? "U" : status);
  export const changeName = (status: string) => NAMES[status] ?? status;
</script>

<script lang="ts">
  // A file's change letter (M, A, D, U), toned by kind.
  let { status }: { status: string } = $props();
  const tone = $derived(status === "M" || status === "T" ? "m" : status === "D" ? "d" : "a");
</script>

<span class="mark {tone}" title={changeName(status)}>{changeLetter(status)}</span>

<style>
  .mark { font: var(--fs-xs) var(--font-mono); width: 12px; flex: none; text-align: center; }
  .m { color: var(--warn-dim); }
  .a { color: var(--ok-dim); }
  .d { color: var(--err-dim); }
</style>
