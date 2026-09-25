// Fetching into component state: the value, or why there isn't one.
import { errorMessage } from "./format";

export type Loaded<T> = { value: T | null; error: string };

/**
 * Run `fetch` in an effect, so it runs again whenever what it reads changes
 * (a path, a touched stamp). The last value stays up while the next one
 * loads, unless `reset` clears it first; a reply that's been overtaken is
 * dropped. A null fetch loads nothing. Call it while a component initialises.
 */
export function load<T>(fetch: () => Promise<T> | null, reset = false): Loaded<T> {
  const res = $state<Loaded<T>>({ value: null, error: "" });
  let latest = 0;
  $effect(() => {
    const run = ++latest;
    if (reset) {
      res.value = null;
      res.error = "";
    }
    fetch()
      ?.then((v) => {
        if (run !== latest) return;
        res.value = v;
        res.error = "";
      })
      .catch((e) => {
        if (run === latest) res.error = errorMessage(e);
      });
  });
  return res;
}
