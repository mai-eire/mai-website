import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';
import { withAuth } from '../../../../lib/auth';
import { listAllPosts, serializePost } from '../../../../lib/posts';
import { buildPostData } from '../../../../lib/postInput';

// Back-office listing and creation. Behind withAuth, so unlike /api/posts this
// one can see drafts.
export default withAuth(async (req: NextApiRequest, res: NextApiResponse, user) => {
  if (req.method === 'GET') {
    const posts = await listAllPosts({
      type: (req.query.type as any) || null,
      status: (req.query.status as any) || null,
    });
    return res.status(200).json({ posts });
  }

  if (req.method === 'POST') {
    const { errors, data } = await buildPostData(req.body);
    if (errors.length) return res.status(400).json({ errors });

    try {
      const post = await prisma.post.create({
        data: { ...data, createdBy: user.email, updatedBy: user.email },
      });
      return res.status(201).json({ post: serializePost(post) });
    } catch (error: any) {
      console.error('Error creating post:', error);
      return res.status(500).json({ errors: ['Could not save this post.'] });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
});
