
(() => {
  const nativeFetch = globalThis.fetch.bind(globalThis);
  globalThis.fetch = (input, init) => {
    if (typeof input === "string" && input.startsWith("elyra://localhost/")) {
      input = "http://elyra.localhost/" + input.slice("elyra://localhost/".length);
    }
    return nativeFetch(input, init);
  };
})();
