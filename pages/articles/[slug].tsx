import React from 'react';
import type { GetServerSideProps } from 'next';
import ArticleView from '../../components/news/ArticleView';
import { getPublishedPost, getRelatedPosts } from '../../lib/posts';

export default function ArticlePage({ post, related }: any) {
  return <ArticleView post={post} related={related} />;
}

export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
  const post = await getPublishedPost('ARTICLE', String(params?.slug));
  if (!post) return { notFound: true };

  const related = await getRelatedPosts(post);

  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

  return { props: { post, related } };
};
