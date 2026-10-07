// Start the app's state modules against the demo backend, once per page load:
// the same channel wiring as lib/live (minus terminals) and the same loadAll()
// the desktop app runs at startup.
import { channel } from '$splash/bindings';
import { applyAgent, applyProject, applySession, loadAll } from '$splash/lib/sessions.svelte';
import { applyTranscript } from '$splash/lib/transcripts.svelte';
import { applyWorkspace } from '$splash/lib/workspace.svelte';
import { layout } from '$splash/lib/layout.svelte';
import { installSceneGuard } from './guard';

let started: Promise<void> | undefined;

export function boot() {
	return (started ??= start());
}

async function start() {
	installSceneGuard();
	channel('session').subscribe(applySession);
	channel('transcript').subscribe(applyTranscript);
	channel('agents').subscribe(applyAgent);
	channel('workspace').subscribe(applyWorkspace);
	channel('project').subscribe(applyProject);
	// The panel sizes a first launch gets, not whatever this browser saved.
	Object.assign(layout, { left: 232, right: 330, leftOpen: true, rightOpen: true, bottomOpen: false, rightTab: 'changes' });
	await loadAll();
}
