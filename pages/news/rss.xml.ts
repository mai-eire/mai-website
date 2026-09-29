import type { GetServerSideProps } from 'next';
import { listPublishedPosts } from '../../lib/posts';
import { absoluteUrl, postUrl } from '../../components/news/postFormatting';
import { ORG_NAME, ORG_SEO_NAME } from '../../data/posts';

// RSS for the whole newsroom. Newsrooms and aggregators subscribe to these,
// and it is how a statement gets picked up without anyone being emailed.

const escapeXml = (unsafe: string): string =>
  String(unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export default function Rss() {
  // Never rendered: getServerSideProps writes the XML and ends the response.
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const { posts } = await listPublishedPosts({ perPage: 50 });

  const items = posts
    .map((post) => {
      const link = absoluteUrl(postUrl(post));
      const author =
        post.type === 'STATEMENT'
          ? post.issuedBy || ORG_NAME
          : post.authorName || 'Guest contributor';

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description>${escapeXml(post.displaySummary)}</description>
      <category>${escapeXml(post.type === 'STATEMENT' ? 'Statement' : 'Article')}</category>
      <dc:creator>${escapeXml(author)}</dc:creator>
      <pubDate>${post.publishedAt ? new Date(post.publishedAt).toUTCString() : ''}</pubDate>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>MAI Newsroom</title>
    <link>${absoluteUrl('/news')}</link>
    <atom:link href="${absoluteUrl('/news/rss.xml')}" rel="self" type="application/rss+xml" />
    <!-- Channel metadata, so the searchable long name belongs here. -->
    <description>Statements and articles from the ${ORG_SEO_NAME} (${ORG_NAME}).</description>
    <language>en-IE</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  res.write(xml);
  res.end();

  return { props: {} };
};
