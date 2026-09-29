import React from 'react';
import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import DraftPreviewBar from '../../../../components/admin/DraftPreviewBar';
import StatementView from '../../../../components/news/StatementView';
import ArticleView from '../../../../components/news/ArticleView';
import { requireUser } from '../../../../lib/auth';
import { getAnyPostBySlug, getRelatedPosts } from '../../../../lib/posts';
import { POST_TYPES } from '../../../../data/posts';

// Preview: a post rendered exactly as its published page would be, before it
// is published.
//
// The URL mirrors the public one under /admin - /statements/x previews at
// /admin/drafts/statements/x - so the two can never drift. _app.tsx makes a
// deliberate exception for /admin/drafts and keeps the public navbar and
// footer here, because a preview that is missing the site's own chrome is not
// showing you the page you are about to publish.

// The public prefix an editor sees in the address bar maps back to the type.
const TYPE_BY_PREFIX: Record<string, string> = Object.fromEntries(
  POST_TYPES.map((t) => [t.basePath.replace(/^\//, ''), t.id])
);

export default function DraftPreviewPage({ post, related }: any) {
  const View = post.type === 'STATEMENT' ? StatementView : ArticleView;

  return (
    <>
      <Head>
        <title key="title">{`Preview: ${post.title} | MAI`}</title>
        {/* A draft that reached a search index would defeat the point of it
            being a draft. PostSeo is skipped below for the same reason: this
            page must never advertise a canonical URL or a social card. */}
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <DraftPreviewBar post={post} />
      <View post={post} related={related} preview />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const auth = await requireUser(ctx as any);
  if ('redirect' in auth) return auth as any;

  const type = TYPE_BY_PREFIX[String(ctx.params?.type)];
  if (!type) return { notFound: true };

  const post = await getAnyPostBySlug(type as any, String(ctx.params?.slug));
  if (!post) return { notFound: true };

  const related = await getRelatedPosts(post);

  // Never cached, anywhere. A draft behind a shared cache is a published draft.
  ctx.res.setHeader('Cache-Control', 'no-store, max-age=0');

  return { props: { user: auth.user, post, related } };
};
