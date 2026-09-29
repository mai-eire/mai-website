import React from 'react';
import Head from 'next/head';
import { absoluteUrl, postUrl } from './postFormatting';
import { ORG_SEO_NAME } from '../../data/posts';

// Per-post metadata.
//
// IMPORTANT: _app.tsx sets site-wide og:* tags. Next only lets a page override
// a tag from _app when BOTH carry the same `key`, so the keys used here must
// match the ones in _app.tsx. Without that, every statement shared on social
// would show the generic site card instead of its own headline.
const PostSeo = ({ post }) => {
  const url = absoluteUrl(postUrl(post));
  const image = post.coverImageUrl
    ? (post.coverImageUrl.startsWith('http') ? post.coverImageUrl : absoluteUrl(post.coverImageUrl))
    : absoluteUrl('/assets/MAI_Logo.png');

  const isStatement = post.type === 'STATEMENT';

  // Tells Google and aggregators this is a dated news item by a named
  // publisher, which is what gets a statement surfaced as news rather than as
  // an undated page.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.displaySummary,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: url,
    image: [image],
    author: isStatement
      ? { '@type': 'Organization', name: post.issuedBy || ORG_SEO_NAME }
      : { '@type': 'Person', name: post.authorName || 'Guest contributor' },
    publisher: {
      '@type': 'Organization',
      // Structured data, not page copy: search engines get the long name.
      name: ORG_SEO_NAME,
      logo: { '@type': 'ImageObject', url: absoluteUrl('/assets/MAI_Logo.png') },
    },
  };

  return (
    <Head>
      <title key="title">{`${post.title} | MAI`}</title>
      <meta key="description" name="description" content={post.displaySummary} />
      <link rel="canonical" href={url} />

      <meta key="og:title" property="og:title" content={post.title} />
      <meta key="og:description" property="og:description" content={post.displaySummary} />
      <meta key="og:image" property="og:image" content={image} />
      <meta key="og:url" property="og:url" content={url} />
      <meta key="og:type" property="og:type" content="article" />
      <meta key="article:published_time" property="article:published_time" content={post.publishedAt || ''} />

      <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
      <meta key="twitter:title" name="twitter:title" content={post.title} />
      <meta key="twitter:description" name="twitter:description" content={post.displaySummary} />
      <meta key="twitter:image" name="twitter:image" content={image} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  );
};

export default PostSeo;
