import "./app.css";
import { mount } from "svelte";
import { toast } from "@elyra/runtime";
import App from "./App.svelte";
import { connectionError } from "./lib/format";
import { serverMode } from "./lib/server.svelte";

// Surface frontend errors instead of failing silently.
window.addEventListener("error", (e) => toast(`UI error: ${e.message}`, { variant: "error", duration: 8000 }));
window.addEventListener("unhandledrejection", (e) =>
  toast(connectionError(e.reason, serverMode) ?? `UI error: ${e.reason?.message ?? e.reason}`, { variant: "error", duration: 8000 }),
);

export default mount(App, { target: document.getElementById("app") });
