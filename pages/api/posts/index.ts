import type { NextApiRequest, NextApiResponse } from 'next';
import { listPublishedPosts } from '../../../lib/posts';
import { POST_TYPE_IDS, TOPIC_IDS } from '../../../data/posts';

// Public, read-only feed of published posts. Backs the "Load more" button and
// is safe to leave open - it can only ever return what is already public.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, topic, page } = req.query;

  try {
    const result = await listPublishedPosts({
      type: POST_TYPE_IDS.includes(type as string) ? (type as any) : null,
      topic: TOPIC_IDS.includes(topic as string) ? (topic as string) : null,
      page: Number(page) || 1,
    });

    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Error listing posts:', error);
    return res.status(500).json({ error: 'Could not load posts' });
  }
}
