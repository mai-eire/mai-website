import React from 'react';
import type { GetServerSideProps } from 'next';
import NewsIndex from '../components/news/NewsIndex';
import { listPublishedPosts, getTopicOptions } from '../lib/posts';
import { POST_TYPE_IDS, TOPIC_IDS } from '../data/posts';

// The one newsroom page. ?type=STATEMENT or ?type=ARTICLE narrows it; the
// individual posts still live under /statements/<slug> and /articles/<slug>,
// because those prefixes are what make a link read as official or as opinion.
export default function NewsPage({ initial, activeType, activeTopic, topicOptions }: any) {
  return (
    <NewsIndex
      activeType={activeType}
      activeTopic={activeTopic}
      topicOptions={topicOptions}
      initial={initial}
    />
  );
}

// Server-rendered rather than statically built: a statement often needs to be
// public within minutes of an incident, and SSR means publishing is instant
// with no rebuild in between.
export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  // Never trust a query string - an unknown value is treated as no filter.
  const activeType = POST_TYPE_IDS.includes(query.type as string)
    ? (query.type as string)
    : null;
  const activeTopic = TOPIC_IDS.includes(query.topic as string)
    ? (query.topic as string)
    : null;

  const [initial, topicOptions] = await Promise.all([
    listPublishedPosts({ type: activeType as any, topic: activeTopic }),
    // Every topic in use stays in the row whichever tab is active, so the row
    // does not jump around; the ones with nothing under this tab come back
    // marked disabled.
    getTopicOptions(activeType as any),
  ]);

  // A short shared-cache window keeps a sudden surge of traffic to a statement
  // off the database, while stale-while-revalidate means nobody waits for the
  // refresh.
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

  return { props: { initial, activeType, activeTopic, topicOptions } };
};
