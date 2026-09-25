// App settings (key → value), from the Rust side's settings table.
import { api } from "../bindings";
import { showError } from "./system";

export const prefs: Record<string, string> = $state({});

export async function setPref(key: string, value: string) {
  prefs[key] = value;
  await api.set_setting(key, value).catch(showError);
}
