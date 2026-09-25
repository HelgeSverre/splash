// The Rust side's event channels, each subscribed once, from App. The state
// modules own what an event does; this only connects them.
import { channel } from "../bindings";
import { writeTerm } from "../components/TerminalPane.svelte";
import { applyAgent, applyProject, applySession } from "./sessions.svelte";
import { applyTranscript } from "./transcripts.svelte";
import { applyWorkspace } from "./workspace.svelte";

let installed = false;
export function installLive() {
  if (installed) return;
  installed = true;
  channel("session").subscribe(applySession);
  channel("transcript").subscribe(applyTranscript);
  channel("agents").subscribe(applyAgent);
  channel("workspace").subscribe(applyWorkspace);
  channel("project").subscribe(applyProject);
  channel("term").subscribe(writeTerm);
}
