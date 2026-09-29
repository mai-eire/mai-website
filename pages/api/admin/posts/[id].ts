import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';
import { withAuth } from '../../../../lib/auth';
import { serializePost } from '../../../../lib/posts';
import { buildPostData } from '../../../../lib/postInput';

export default withAuth(async (req: NextApiRequest, res: NextApiResponse, user) => {
  const id = String(req.query.id);
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ error: 'Post not found' });

  if (req.method === 'GET') {
    return res.status(200).json({ post: serializePost(existing) });
  }

  if (req.method === 'PUT') {
    const { errors, data } = await buildPostData(req.body, {
      existingId: id,
      existingStatus: existing.status,
    });
    if (errors.length) return res.status(400).json({ errors });

    try {
      const post = await prisma.post.update({
        where: { id },
        data: { ...data, updatedBy: user.email },
      });
      return res.status(200).json({ post: serializePost(post) });
    } catch (error: any) {
      console.error('Error updating post:', error);
      return res.status(500).json({ errors: ['Could not save this post.'] });
    }
  }

  if (req.method === 'DELETE') {
    // A published statement is part of the public record, and deleting one
    // breaks every link to it. Unpublish it first, deliberately, then delete.
    if (existing.status === 'PUBLISHED') {
      return res.status(409).json({
        errors: ['Unpublish this post before deleting it.'],
      });
    }
    await prisma.post.delete({ where: { id } });
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', 'GET, PUT, DELETE');
  return res.status(405).json({ error: 'Method not allowed' });
});
