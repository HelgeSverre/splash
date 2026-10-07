// Captures each page's share card (src/lib/og.ts) to static/og/<slug>.png.
// The card route exists on the dev server only, so this starts one and
// screenshots every card in the installed Chrome. CHROME_PATH overrides it.
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));
const out = new URL('../static/og/', import.meta.url);

const server = await createServer({ root, logLevel: 'warn', server: { port: 5299, open: false } });
await server.listen();
const base = server.resolvedUrls!.local[0].replace(/\/$/, '');
const { CARDS } = (await server.ssrLoadModule('/src/lib/og.ts')) as typeof import('../src/lib/og.ts');

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' });
try {
	const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
	page.on('pageerror', (e) => console.error(e));
	await mkdir(out, { recursive: true });
	for (const [slug, card] of Object.entries(CARDS)) {
		await page.goto(`${base}/og-card/${slug}`);
		// Fonts and images loaded and the live scene mounted (Live shows a
		// spinner until then), then let the scene play before the capture.
		await page.waitForFunction(
			() =>
				document.fonts.status === 'loaded' &&
				[...document.images].every((i) => i.complete) &&
				!document.querySelector('[aria-label="Loading the live demo"]')
		);
		await page.waitForTimeout(card.settle ?? 500);
		await page.screenshot({ path: fileURLToPath(new URL(`${slug}.png`, out)) });
		console.log(`static/og/${slug}.png`);
	}
} finally {
	await browser.close();
	await server.close();
}
