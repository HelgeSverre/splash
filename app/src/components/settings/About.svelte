<script lang="ts">
  import SplashMark from "../SplashMark.svelte";
  import { prefs } from "../../lib/state.svelte";
</script>

<div class="set-page">
  <div class="hero"><SplashMark size={40} /><div><h2>Splash</h2><p class="lede">A small harness for coding agents — every agent over the Agent Client Protocol.</p></div></div>
  <div class="set-group">
    <div class="set-row"><div class="set-label">Version</div><span class="set-value">0.1.0</span></div>
    <div class="set-row"><div class="set-label">Built on</div><span class="set-value">Elyra 0.8 · agent-client-protocol 2.2</span></div>
    <div class="set-row"><div class="set-label">Data</div><span class="set-value">{prefs.data_dir}</span></div>
  </div>
</div>

<style>
  .hero { display: flex; gap: 16px; align-items: center; margin-bottom: 8px; }
  .hero .lede { margin-bottom: 0; }
</style>
