<script lang="ts">
	// The real Needs attention view. Opening a conversation from it switches
	// the page's workbench window.
	import AttentionInbox from '$splash/components/AttentionInbox.svelte';
	import FollowWorkbench from './FollowWorkbench.svelte';

	let { target = 'demo' }: { target?: string } = $props();
</script>

<AttentionInbox />
<FollowWorkbench {target} />
