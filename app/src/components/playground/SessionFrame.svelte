<script lang="ts">
  // The real Transcript, fed inline fixtures, inside a mock session frame.
  // Switch the status and the transcript state to see the hints and the
  // empty/loading screen; the Composer is opt-in (it takes focus).
  import Transcript from "../Transcript.svelte";
  import Composer from "../Composer.svelte";
  import SessionHeader from "../SessionHeader.svelte";
  import SegmentedControl from "../ui/SegmentedControl.svelte";
  import Checkbox from "../ui/Checkbox.svelte";
  import { statusLabel } from "../../lib/format";
  import type { Status } from "../../bindings";
  import { ENTRIES, fakeSession } from "./fixtures";

  type Fill = "full" | "empty" | "loading";
  let status: Status = $state("awaiting_permission");
  let fill: Fill = $state("full");
  let composer = $state(false);

  const session = $derived(fakeSession(status));
  const entries = $derived(fill === "full" ? ENTRIES : []);
  const STATUSES: Status[] = ["idle", "starting", "running", "awaiting_permission", "error", "exited"];
</script>

<div class="controls">
  <SegmentedControl label="Transcript" value={fill} onchange={(v) => (fill = v)}
    options={[{ value: "full", label: "Every entry" }, { value: "empty", label: "Empty" }, { value: "loading", label: "Loading" }]} />
  <span class="status-pick t-secondary">Status
    <SegmentedControl label="Status" value={status} onchange={(v) => (status = v)}
      options={STATUSES.map((s) => ({ value: s, label: statusLabel(s) }))} />
  </span>
  <Checkbox bind:checked={composer} label="Composer" />
</div>

<div class="frame">
  <SessionHeader {session} live={false} />
  <div class="body">
    {#key fill}
      <Transcript {session} {entries} loading={fill === "loading"} />
    {/key}
  </div>
  {#if composer}<Composer {session} />{/if}
</div>

<style>
  .controls { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; margin-bottom: 12px; }
  .status-pick { display: inline-flex; align-items: center; gap: 8px; }
  .frame {
    display: flex; flex-direction: column; height: 720px;
    border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--bg); overflow: hidden;
  }
  .body { flex: 1; min-height: 0; }
</style>
