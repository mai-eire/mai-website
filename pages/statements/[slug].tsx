import React from 'react';
import type { GetServerSideProps } from 'next';
import StatementView from '../../components/news/StatementView';
import { getPublishedPost, getRelatedPosts } from '../../lib/posts';

export default function StatementPage({ post, related }: any) {
  return <StatementView post={post} related={related} />;
}

export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
  const post = await getPublishedPost('STATEMENT', String(params?.slug));

  // A draft, a deleted post, or an article slug reached under /statements all
  // land here. 404 rather than redirect, so an unpublished URL never confirms
  // that something exists behind it.
  if (!post) return { notFound: true };

  const related = await getRelatedPosts(post);

  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

  return { props: { post, related } };
};
