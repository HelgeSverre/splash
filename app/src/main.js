import "./app.css";
import { mount } from "svelte";
import { toast } from "@elyra/runtime";
import App from "./App.svelte";

// Surface frontend errors instead of failing silently.
window.addEventListener("error", (e) => toast(`UI error: ${e.message}`, { variant: "error", duration: 8000 }));
window.addEventListener("unhandledrejection", (e) =>
  toast(`UI error: ${e.reason?.message ?? e.reason}`, { variant: "error", duration: 8000 }),
);

export default mount(App, { target: document.getElementById("app") });
