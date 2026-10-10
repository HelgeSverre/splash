import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

// The site renders the desktop app's own components from ../app/src. Their
// bare imports must resolve to this package's copies (one Svelte runtime), and
// `@elyra/runtime` resolves to an in-browser demo backend instead of the IPC
// bridge to Rust.
const SHARED = ['svelte', 'diff', 'dompurify', 'highlight.js', 'marked', 'mermaid', '@mermaid-js/layout-elk', 'remend', '@fontsource-variable/inter', '@fontsource-variable/jetbrains-mono', '@xterm/xterm', '@xterm/addon-fit'];

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
			},
			adapter: adapter({ fallback: '404.html' }),
			// Pages with live scenes pull in ~30 small component stylesheets, and on a
			// phone each one delays the first paint. Inline the small ones; the large
			// shared ones stay cached files.
			inlineStyleThreshold: 10_000
		})
	],
	resolve: {
		// Mirrored in tsconfig.json `paths`.
		alias: {
			$splash: fileURLToPath(new URL('../app/src', import.meta.url)),
			$repo: fileURLToPath(new URL('..', import.meta.url)),
			'@elyra/runtime': fileURLToPath(new URL('src/lib/demo/runtime.ts', import.meta.url))
		},
		dedupe: SHARED
	},
	server: { port: 5287, fs: { allow: ['..'] } }
});
