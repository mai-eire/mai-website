import type { NextApiRequest, NextApiResponse } from 'next';
import { destroySession } from '../../../lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  destroySession(res);
  return res.status(200).json({ ok: true });
}
