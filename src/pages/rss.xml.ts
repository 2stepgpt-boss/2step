import { getCollection } from 'astro:content';
export async function GET(context: { site: URL }) {
  const articles = await getCollection('articles');
  const esc = (value: string) => value.replace(/[<>&']/g, char => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', "'":'&apos;' }[char]!));
  const items = articles.map(article => `<item><title>${esc(article.data.title)}</title><description>${esc(article.data.description)}</description><link>${new URL(`/articles/${article.id}/`, context.site)}</link><pubDate>${article.data.publishedAt.toUTCString()}</pubDate></item>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>2step Articles</title><description>Development examples for the 2step template.</description><link>${context.site}</link>${items}</channel></rss>`, { headers: { 'Content-Type': 'application/xml' } });
}
