<script lang="ts">
	// Every kind of transcript entry, from the app's own design-system
	// playground fixtures, in the real SessionHeader and Transcript.
	import SessionHeader from '$splash/components/SessionHeader.svelte';
	import Transcript from '$splash/components/Transcript.svelte';
	import { ENTRIES, fakeSession } from '$splash/components/playground/fixtures';

	const session = fakeSession('awaiting_permission');
</script>

<div class="frame">
	<SessionHeader {session} live={false} />
	<div class="body"><Transcript {session} entries={ENTRIES} loading={false} /></div>
</div>

<style>
	.frame {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.body {
		flex: 1;
		min-height: 0;
	}
</style>
