// Every page, for search engines. Prerendered to build/sitemap.xml.
import { COMPARISON_LINKS, FEATURES, SITE_URL } from '#lib/site.ts';

export const prerender = true;

const PATHS = ['/', '/download', ...FEATURES.map((f) => `/features/${f.slug}`), '/vs', ...COMPARISON_LINKS.map((c) => `/vs/${c.slug}`)];

export function GET() {
	const urls = PATHS.map((path) => `\t<url><loc>${SITE_URL}${path}</loc></url>`).join('\n');
	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
	return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
